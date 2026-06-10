import json
import math
import os
import re
from pathlib import Path

import bcrypt
from dotenv import load_dotenv
from flask import Flask, g, jsonify, request, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from auth import require_admin, sign_admin_token
from db import DB_PATH, get_connection, init_schema

load_dotenv()

SITE_ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.getenv("PORT", "3000"))
IS_PRODUCTION = os.getenv("NODE_ENV") == "production" or os.getenv("FLASK_ENV") == "production"

app = Flask(__name__, static_folder=str(SITE_ROOT), static_url_path="")
app.config["JSON_AS_ASCII"] = False
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024

limiter = Limiter(get_remote_address, app=app, default_limits=["300 per 15 minutes"])


def get_db():
    if "db" not in g:
        g.db = get_connection()
    return g.db


@app.teardown_appcontext
def close_db(_exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


with get_connection() as conn:
    init_schema(conn)


def sanitize_text(value, max_len=500):
    if value is None:
        return ""
    return str(value).strip()[:max_len]


def validate_phone(phone):
    digits = re.sub(r"\D", "", phone)
    return 10 <= len(digits) <= 15


def validate_email(email):
    if not email:
        return True
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


def validate_name(name):
    return bool(re.match(r"^[a-zA-Zа-яА-ЯёЁ\s-]{2,120}$", name))


def row_to_product(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "price": row["price"],
        "category": json.loads(row["category"]),
        "image": row["image"],
        "photos": json.loads(row["photos"]),
        "modelImage": row["model_image"],
        "size": row["size_label"],
        "desc": row["description"],
        "stock": json.loads(row["stock"]),
        "emo": bool(row["emo"]),
    }


def get_order_items(conn, order_id):
    return conn.execute(
        "SELECT product_id, product_name, size, quantity, price FROM order_items WHERE order_id = ?",
        (order_id,),
    ).fetchall()


def row_to_order(row, items):
    discount = None
    if row["discount_code"] and row["discount_amount"] > 0:
        discount = {
            "code": row["discount_code"],
            "amount": row["discount_amount"],
            "percent": row["discount_percent"],
        }
    return {
        "id": row["id"],
        "date": row["created_at"],
        "status": row["status"],
        "customer": {
            "fullName": row["customer_name"],
            "phone": row["customer_phone"],
            "email": row["customer_email"] or "",
            "address": row["customer_address"] or "",
            "telegram": row["customer_telegram"] or "",
        },
        "items": [
            {
                "id": item["product_id"],
                "name": item["product_name"],
                "size": item["size"],
                "quantity": item["quantity"],
                "price": item["price"],
            }
            for item in items
        ],
        "subtotal": row["subtotal"],
        "delivery": row["delivery"],
        "discount": discount,
        "total": row["total"],
    }


def cookie_kwargs():
    return {
        "httponly": True,
        "secure": IS_PRODUCTION,
        "samesite": "Strict",
        "max_age": 12 * 60 * 60,
        "path": "/",
    }


# ==================== PRODUCTS ====================

@app.get("/api/products")
def list_products():
    conn = get_db()
    rows = conn.execute("SELECT * FROM products ORDER BY id").fetchall()
    return jsonify([row_to_product(r) for r in rows])


@app.get("/api/products/<int:product_id>")
def get_product(product_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        return jsonify({"error": "Товар не найден"}), 404
    return jsonify(row_to_product(row))


# ==================== ORDERS ====================

@app.post("/api/orders")
@limiter.limit("20 per 15 minutes")
def create_order():
    body = request.get_json(silent=True) or {}
    customer = body.get("customer") or {}
    items = body.get("items") if isinstance(body.get("items"), list) else []

    full_name = sanitize_text(customer.get("fullName"), 120)
    phone = sanitize_text(customer.get("phone"), 30)
    email = sanitize_text(customer.get("email"), 120)
    address = sanitize_text(customer.get("address"), 300)
    telegram = sanitize_text(customer.get("telegram"), 80)
    promo_code = sanitize_text(body.get("promoCode"), 30).upper()

    if not full_name or not phone:
        return jsonify({"error": "Заполните ФИО и телефон"}), 400
    if not validate_name(full_name):
        return jsonify({"error": "Некорректное ФИО"}), 400
    if not validate_phone(phone):
        return jsonify({"error": "Некорректный телефон"}), 400
    if not validate_email(email):
        return jsonify({"error": "Некорректный email"}), 400
    if not items:
        return jsonify({"error": "Корзина пуста"}), 400

    delivery_cost = 240
    subtotal = 0
    prepared_items = []
    conn = get_db()

    for item in items:
        product_id = int(item.get("id") or 0)
        quantity = math.floor(float(item.get("quantity") or 0))
        size = sanitize_text(item.get("size") or "OS", 20)

        if not product_id or quantity < 1 or quantity > 99:
            return jsonify({"error": "Некорректные данные товара"}), 400

        product = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not product:
            return jsonify({"error": f"Товар не найден: {product_id}"}), 400

        stock = json.loads(product["stock"])
        available = stock.get(size, 0)
        if available < quantity:
            return jsonify({
                "error": f"Недостаточно товара «{product['name']}» (размер {size}): осталось {available} шт."
            }), 409

        if float(item.get("price") or 0) != float(product["price"]):
            return jsonify({"error": "Цена товара изменилась. Обновите страницу."}), 400

        prepared_items.append({
            "product_id": product_id,
            "name": product["name"],
            "size": size,
            "quantity": quantity,
            "price": product["price"],
            "stock": stock,
        })
        subtotal += product["price"] * quantity

    discount_percent = 0
    if promo_code:
        promo = conn.execute(
            "SELECT discount_percent FROM promo_codes WHERE code = ? AND active = 1",
            (promo_code,),
        ).fetchone()
        if not promo:
            return jsonify({"error": "Неверный промокод"}), 400
        discount_percent = promo["discount_percent"]

    discount_amount = (subtotal * discount_percent / 100) if promo_code else 0
    total = round(subtotal + delivery_cost - discount_amount)

    try:
        conn.execute("BEGIN")
        cur = conn.execute(
            """INSERT INTO orders (
                customer_name, customer_phone, customer_email, customer_address, customer_telegram,
                subtotal, delivery, discount_code, discount_amount, discount_percent, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                full_name, phone, email or None, address or None, telegram or None,
                subtotal, delivery_cost, promo_code or None, discount_amount,
                discount_percent if promo_code else None, total,
            ),
        )
        order_id = cur.lastrowid

        for item in prepared_items:
            conn.execute(
                """INSERT INTO order_items (order_id, product_id, product_name, size, quantity, price)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (order_id, item["product_id"], item["name"], item["size"], item["quantity"], item["price"]),
            )
            item["stock"][item["size"]] = max(0, item["stock"].get(item["size"], 0) - item["quantity"])
            conn.execute(
                "UPDATE products SET stock = ? WHERE id = ?",
                (json.dumps(item["stock"]), item["product_id"]),
            )

        conn.commit()
        order_row = conn.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        order_items = get_order_items(conn, order_id)
        return jsonify({"ok": True, "order": row_to_order(order_row, order_items)}), 201
    except Exception as exc:
        conn.rollback()
        app.logger.error("Order error: %s", exc)
        return jsonify({"error": "Не удалось сохранить заказ"}), 500


@app.get("/api/orders")
@require_admin
def list_orders():
    search = sanitize_text(request.args.get("search"), 100).lower()
    status = sanitize_text(request.args.get("status"), 20)
    conn = get_db()

    sql = "SELECT * FROM orders"
    params = []
    conditions = []

    if search:
        conditions.append(
            "(LOWER(customer_name) LIKE ? OR customer_phone LIKE ? OR LOWER(customer_email) LIKE ?)"
        )
        like = f"%{search}%"
        params.extend([like, like, like])
    if status and status != "all":
        conditions.append("status = ?")
        params.append(status)
    if conditions:
        sql += " WHERE " + " AND ".join(conditions)
    sql += " ORDER BY created_at DESC"

    rows = conn.execute(sql, params).fetchall()
    orders = [row_to_order(r, get_order_items(conn, r["id"])) for r in rows]
    stats = conn.execute(
        "SELECT COUNT(*) AS totalOrders, COALESCE(SUM(total), 0) AS totalRevenue FROM orders"
    ).fetchone()
    return jsonify({"orders": orders, "stats": dict(stats)})


@app.patch("/api/orders/<int:order_id>/status")
@require_admin
def update_order_status(order_id):
    allowed = {"new", "processing", "shipped", "completed", "cancelled"}
    body = request.get_json(silent=True) or {}
    status = sanitize_text(body.get("status"), 20)
    if status not in allowed:
        return jsonify({"error": "Недопустимый статус"}), 400
    conn = get_db()
    cur = conn.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
    conn.commit()
    if cur.rowcount == 0:
        return jsonify({"error": "Заказ не найден"}), 404
    return jsonify({"ok": True})


@app.delete("/api/orders/<int:order_id>")
@require_admin
def delete_order(order_id):
    conn = get_db()
    cur = conn.execute("DELETE FROM orders WHERE id = ?", (order_id,))
    conn.commit()
    if cur.rowcount == 0:
        return jsonify({"error": "Заказ не найден"}), 404
    return jsonify({"ok": True})


@app.delete("/api/orders")
@require_admin
def clear_orders():
    conn = get_db()
    conn.execute("DELETE FROM order_items")
    conn.execute("DELETE FROM orders")
    conn.commit()
    return jsonify({"ok": True})


@app.post("/api/orders/validate-promo")
@limiter.limit("20 per 15 minutes")
def validate_promo():
    body = request.get_json(silent=True) or {}
    code = sanitize_text(body.get("code"), 30).upper()
    if not code:
        return jsonify({"error": "Введите промокод"}), 400
    conn = get_db()
    promo = conn.execute(
        "SELECT discount_percent FROM promo_codes WHERE code = ? AND active = 1", (code,)
    ).fetchone()
    if not promo:
        return jsonify({"error": "Неверный промокод"}), 404
    return jsonify({"code": code, "discount": promo["discount_percent"]})


# ==================== ADMIN ====================

@app.post("/api/admin/login")
@limiter.limit("10 per 15 minutes")
def admin_login():
    body = request.get_json(silent=True) or {}
    email = str(body.get("email") or "").strip().lower()[:120]
    password = str(body.get("password") or "")

    if not email or not password:
        return jsonify({"error": "Введите email и пароль"}), 400

    conn = get_db()
    user = conn.execute("SELECT * FROM admin_users WHERE email = ?", (email,)).fetchone()
    if not user or not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return jsonify({"error": "Неверный email или пароль"}), 401

    token = sign_admin_token(user["id"], user["email"])
    resp = jsonify({"ok": True, "email": user["email"]})
    resp.set_cookie("sleng_admin_token", token, **cookie_kwargs())
    return resp


@app.post("/api/admin/logout")
def admin_logout():
    resp = jsonify({"ok": True})
    resp.delete_cookie("sleng_admin_token", path="/")
    return resp


@app.get("/api/admin/me")
@require_admin
def admin_me():
    return jsonify({"ok": True, "email": g.admin["email"]})


# ==================== STATIC ====================

@app.route("/")
def index():
    return send_from_directory(SITE_ROOT, "index.html")


@app.errorhandler(429)
def rate_limit_handler(_e):
    return jsonify({"error": "Слишком много запросов. Попробуйте позже."}), 429


@app.errorhandler(500)
def server_error(_e):
    return jsonify({"error": "Внутренняя ошибка сервера"}), 500


if __name__ == "__main__":
    print(f"S.L.E.N.G запущен: http://localhost:{PORT}")
    print(f"Админ-панель: http://localhost:{PORT}/admin.html")
    print(f"База SQLite: {DB_PATH}")
    app.run(host="0.0.0.0", port=PORT, debug=not IS_PRODUCTION)
