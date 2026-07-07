# schemas/session.py

from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    language: str = Field(..., min_length=1, max_length=50)
    hours: int = Field(..., ge=1, le=16)   # between 1 and 16 hours
    what_i_built: str = Field(..., min_length=5)
    mood: int = Field(..., ge=1, le=5)


class SessionOut(BaseModel):
    id: UUID
    language: str
    hours: int
    what_i_built: str
    mood: int
    logged_at: datetime

    class Config:
        from_attributes = True