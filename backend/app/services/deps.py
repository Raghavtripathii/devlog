# services/deps.py
# FastAPI dependencies — reusable pieces of logic injected into route handlers.
# get_current_user is used on every protected endpoint.

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth import decode_token, get_user_by_id

# FastAPI looks for the token in the Authorization: Bearer <token> header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Extracts the user from the JWT token.
    If the token is missing, invalid, or the user doesn't exist — raises 401.
    Every protected endpoint uses this as a dependency.
    """
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token_data = decode_token(token)
    except JWTError:
        raise credentials_error

    user = get_user_by_id(db, UUID(token_data.user_id))
    if user is None:
        raise credentials_error

    return user