from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
import os
from typing import Generator
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database URL from environment variable (PostgreSQL only)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

if not DATABASE_URL.startswith("postgresql"):
    raise ValueError("Only PostgreSQL databases are supported. DATABASE_URL must start with 'postgresql://'")

# Create engine with PostgreSQL-specific settings
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

# Initialize database tables (for serverless environments)
def init_db():
    """Initialize database tables if they don't exist."""
    try:
        SQLModel.metadata.create_all(bind=engine)
        print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Database initialization error: {e}")

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