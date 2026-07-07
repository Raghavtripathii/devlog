# All the auth logic lives here — password hashing, JWT creation, JWT verification.
# The routers call these functions, keeping the route handlers thin and readable.

from datetime import datetime, timedelta
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from app.models.user import User
from app.schemas.user import TokenData

# bcrypt is the hashing algorithm — it's slow on purpose (makes brute force harder)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    """
    Creates a signed JWT token that expires after ACCESS_TOKEN_EXPIRE_MINUTES.
    The `data` dict is encoded inside the token — we put the user's ID in there.
    """
    payload = data.copy()
    expires = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload.update({"exp": expires})
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> TokenData:
    """
    Decodes and validates a JWT token.
    Raises JWTError if the token is invalid, expired, or tampered with.
    """
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    user_id: str = payload.get("sub")
    if user_id is None:
        raise JWTError("Token missing subject claim")
    return TokenData(user_id=user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> User | None:
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()