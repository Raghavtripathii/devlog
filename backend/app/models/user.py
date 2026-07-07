# The User table — one row per registered user.

import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_public = Column(Boolean, default=True)  # whether profile is publicly viewable
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships — SQLAlchemy will auto-join these when needed
    sessions = relationship("CodingSession", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")