# Quick Fix for Local Development

## Problem
Backend requires PostgreSQL but you want to test locally with SQLite.

## Temporary Solution (Local Development Only)

### Option A: Allow SQLite for Local Dev (Quick Fix)

Edit `backend/src/database/database.py`:

```python
from sqlmodel import create_engine, Session, SQLModel
from contextlib import contextmanager
import os
from typing import Generator
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Allow SQLite for local development
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )
elif DATABASE_URL.startswith("sqlite"):
    # Allow SQLite for local development only
    print("⚠️  WARNING: Using SQLite for local development. Use PostgreSQL for production!")
    engine = create_engine(DATABASE_URL, echo=False)
else:
    raise ValueError("DATABASE_URL must start with 'postgresql://' or 'sqlite:///'")
```

Then update `.env`:
```env
DATABASE_URL=sqlite:///./todo_app.db
ENVIRONMENT=development
```

### Option B: Use Docker PostgreSQL (Recommended)

```bash
# Install Docker Desktop, then run:
docker run --name postgres-todo -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo_db -p 5432:5432 -d postgres:16

# Keep .env as:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db

# Run migrations:
alembic upgrade head

# Start backend:
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

## Which Option to Choose?

**Option A (SQLite):**
- ✅ Quick, no installation needed
- ✅ Works immediately
- ⚠️ Different from production
- ⚠️ Don't commit this change

**Option B (Docker PostgreSQL):**
- ✅ Same as production
- ✅ Better testing
- ⚠️ Requires Docker installation

**Option C (Deploy to Railway):**
- ✅ No local setup needed
- ✅ Production environment
- ✅ PostgreSQL provided automatically

## Recommendation

For quick local testing: Use Option A (SQLite temporary fix)
For proper testing: Use Option B (Docker PostgreSQL)
For production: Deploy to Railway (already configured)

Would you like me to apply Option A (SQLite temporary fix) so you can test locally right now?
