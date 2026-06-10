"""Загрузка товаров из script.js и создание администратора."""
import os
import re
from pathlib import Path

import json

import bcrypt
import json5
from dotenv import load_dotenv

from db import get_connection, init_schema

load_dotenv()

SCRIPT_PATH = Path(__file__).resolve().parent.parent / "script.js"


def load_products_from_script():
    content = SCRIPT_PATH.read_text(encoding="utf-8")
    match = re.search(r"let products = (\[[\s\S]*?\n\]);", content)
    if not match:
        raise RuntimeError("Не удалось найти массив products в script.js")
    return json5.loads(match.group(1))


def seed_products(conn, products):
    count = conn.execute("SELECT COUNT(*) AS c FROM products").fetchone()["c"]
    if count > 0:
        print(f"Товары уже в базе ({count} шт.), пропуск seed.")
        return

    insert_sql = """
        INSERT INTO products (
            id, name, price, category, image, photos, model_image,
            size_label, description, emo, stock
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    rows = []
    for p in products:
        rows.append(
            (
                p["id"],
                p["name"],
                p["price"],
                json.dumps(p.get("category", []), ensure_ascii=False),
                p.get("image"),
                json.dumps(p.get("photos", []), ensure_ascii=False),
                p.get("modelImage"),
                p.get("size", "OS"),
                p.get("desc", ""),
                1 if p.get("emo") else 0,
                json.dumps(p.get("stock", {}), ensure_ascii=False),
            )
        )
    conn.executemany(insert_sql, rows)
    conn.commit()
    print(f"Загружено товаров: {len(products)}")


def seed_admin(conn):
    count = conn.execute("SELECT COUNT(*) AS c FROM admin_users").fetchone()["c"]
    if count > 0:
        print("Администратор уже существует, пропуск.")
        return

    email = (os.getenv("ADMIN_EMAIL") or "admin@sleng.shop").strip().lower()
    password = os.getenv("ADMIN_PASSWORD") or "SlengAdmin2026!"
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

    conn.execute(
        "INSERT INTO admin_users (email, password_hash) VALUES (?, ?)",
        (email, password_hash),
    )
    conn.commit()
    print(f"Создан администратор: {email}")
    print("Смените пароль в .env после первого входа!")


def main():
    conn = get_connection()
    init_schema(conn)
    products = load_products_from_script()
    seed_products(conn, products)
    seed_admin(conn)
    conn.close()
    print("Seed завершён.")


if __name__ == "__main__":
    main()
