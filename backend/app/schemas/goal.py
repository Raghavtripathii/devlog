# schemas/goal.py

from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    target_hours: int = Field(..., ge=1, le=168)  # max 168 hours in a week
    week_start: datetime


class GoalOut(BaseModel):
    id: UUID
    title: str
    target_hours: int
    week_start: datetime
    created_at: datetime

    class Config:
        from_attributes = True