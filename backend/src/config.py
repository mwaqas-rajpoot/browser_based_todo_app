import os
from typing import Optional
from datetime import timedelta
from passlib.context import CryptContext

# Secret key for JWT tokens
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")

# Password hashing context - using argon2 as primary scheme for better compatibility
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

class Settings:
    SECRET_KEY: str = SECRET_KEY
    ALGORITHM: str = ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = ACCESS_TOKEN_EXPIRE_MINUTES
    DATABASE_URL: str = DATABASE_URL

    # JWT settings
    BETTER_AUTH_SECRET: str = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-key-change-this-in-production")

    # Origins for CORS
    BACKEND_CORS_ORIGINS: list[str] = os.getenv("BACKEND_CORS_ORIGINS", "").split(",")

settings = Settings()