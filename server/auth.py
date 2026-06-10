import os
from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from flask import g, jsonify, request

JWT_SECRET = os.getenv("JWT_SECRET", "dev-insecure-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 12


def sign_admin_token(user_id: int, email: str) -> str:
    payload = {
        "id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_admin_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("sleng_admin_token")
        if not token:
            return jsonify({"error": "Требуется авторизация"}), 401
        try:
            g.admin = verify_admin_token(token)
        except jwt.PyJWTError:
            resp = jsonify({"error": "Сессия истекла, войдите снова"})
            resp.delete_cookie("sleng_admin_token", path="/")
            return resp, 401
        return f(*args, **kwargs)

    return decorated
