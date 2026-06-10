import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB = BASE_DIR.parent / "data" / "sleng.db"

_db_path = os.getenv("DATABASE_PATH")
DB_PATH = Path(_db_path).resolve() if _db_path else DEFAULT_DB
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_schema(conn):
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT NOT NULL DEFAULT '[]',
            image TEXT,
            photos TEXT NOT NULL DEFAULT '[]',
            model_image TEXT,
            size_label TEXT,
            description TEXT,
            emo INTEGER NOT NULL DEFAULT 0,
            stock TEXT NOT NULL DEFAULT '{}'
        );

        CREATE TABLE IF NOT EXISTS promo_codes (
            code TEXT PRIMARY KEY,
            discount_percent REAL NOT NULL,
            active INTEGER NOT NULL DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            status TEXT NOT NULL DEFAULT 'new',
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_email TEXT,
            customer_address TEXT,
            customer_telegram TEXT,
            subtotal REAL NOT NULL,
            delivery REAL NOT NULL,
            discount_code TEXT,
            discount_amount REAL NOT NULL DEFAULT 0,
            discount_percent REAL,
            total REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER,
            product_name TEXT NOT NULL,
            size TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
        """
    )

    promo_count = conn.execute("SELECT COUNT(*) AS c FROM promo_codes").fetchone()["c"]
    if promo_count == 0:
        promos = [("SLENG10", 10), ("SSS8", 8), ("WELCOME", 5)]
        conn.executemany(
            "INSERT INTO promo_codes (code, discount_percent) VALUES (?, ?)", promos
        )
    conn.commit()
