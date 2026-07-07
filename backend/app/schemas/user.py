# Pydantic schemas define the shape of data coming IN and going OUT of the API.
# They're separate from models (which define the database shape).

from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    """What we expect when someone tries to register."""
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """What we expect on login."""
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    """What we send back — never include password or sensitive data here."""
    id: UUID
    username: str
    email: str
    is_public: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: str | None = None