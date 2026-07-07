# A CodingSession is a single log entry — "I coded Python for 2 hours today."

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class CodingSession(Base):
    __tablename__ = "coding_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    language = Column(String(50), nullable=False)  # e.g. "Python", "TypeScript"
    hours = Column(Integer, nullable=False)          # how many hours they coded
    what_i_built = Column(Text, nullable=False)      # free text: what they worked on
    mood = Column(Integer, nullable=False)           # 1 (rough) to 5 (great)
    logged_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")