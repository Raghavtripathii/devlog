# Sets up the SQLAlchemy connection to PostgreSQL.
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

# The engine is the actual connection to the database
engine = create_engine(settings.database_url)

# SessionLocal is a factory that creates database sessions
# Each request gets its own session that opens and closes cleanly
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class all our database models will inherit from
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session to route handlers.
    Yields the session, then closes it when the request finishes —
    even if an error occurred. The try/finally ensures cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()