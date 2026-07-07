# A weekly coding goal — "I want to code 15 hours this week."

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    title = Column(String(100), nullable=False)       # e.g. "Ship DevLog this week"
    target_hours = Column(Integer, nullable=False)     # how many hours they're aiming for
    week_start = Column(DateTime, nullable=False)      # Monday of that week
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="goals")