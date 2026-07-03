"""Admin authentication helpers — JWT + bcrypt."""
import os
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Request, Depends
from typing import Optional

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24  # Admin sessions last 24h


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
        "type": "access",
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])


async def seed_admin(db):
    """Idempotent admin seed. Creates or updates the admin user from env vars."""
    email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    password = os.environ.get("ADMIN_PASSWORD", "")
    if not email or not password:
        return
    existing = await db.admin_users.find_one({"email": email})
    now = datetime.now(timezone.utc).isoformat()
    if existing is None:
        await db.admin_users.insert_one({
            "email": email,
            "password_hash": hash_password(password),
            "name": "Admin",
            "role": "admin",
            "created_at": now,
        })
    elif not verify_password(password, existing["password_hash"]):
        # Password in env was changed — sync hash
        await db.admin_users.update_one(
            {"email": email},
            {"$set": {"password_hash": hash_password(password)}},
        )


def get_token_from_request(request: Request) -> Optional[str]:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


async def require_admin(request: Request) -> dict:
    """FastAPI dependency to protect admin routes."""
    from server import db  # late import to avoid circular
    token = get_token_from_request(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.admin_users.find_one({"email": payload.get("email")}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def log_activity(db, admin_email: str, action: str, target: str = "", details: str = ""):
    """Insert activity log entry and prune to last 100."""
    await db.activity_log.insert_one({
        "admin_email": admin_email,
        "action": action,
        "target": target,
        "details": details,
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    # Prune — keep only last 100
    count = await db.activity_log.count_documents({})
    if count > 100:
        excess = count - 100
        oldest = db.activity_log.find({}, {"_id": 1}).sort("ts", 1).limit(excess)
        ids_to_delete = [doc["_id"] async for doc in oldest]
        if ids_to_delete:
            await db.activity_log.delete_many({"_id": {"$in": ids_to_delete}})
