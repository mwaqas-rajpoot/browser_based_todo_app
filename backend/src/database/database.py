from sqlmodel import create_engine, Session
from contextlib import contextmanager
import os
from typing import Generator
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create engine with PostgreSQL-specific settings
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,  # Verify connections before using them
        pool_size=5,
        max_overflow=10
    )
else:
    engine = create_engine(DATABASE_URL, echo=False)

def get_session() -> Generator[Session, None, None]:
    """Get database session for dependency injection."""
    with Session(engine) as session:
        yield session

# Create context manager for sessions
@contextmanager
def get_db_session():
    """Context manager for database sessions."""
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()