# Local PostgreSQL Setup for Development

## Option 1: Install PostgreSQL (Recommended)

### Windows Installation

1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 16 installer
   - Run the installer

2. **During Installation:**
   - Set password for postgres user: `postgres` (or your choice)
   - Port: `5432` (default)
   - Install pgAdmin (optional GUI tool)

3. **Create Database:**
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter password when prompted

   # Create database
   CREATE DATABASE todo_db;

   # Exit
   \q
   ```

4. **Update .env file:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/todo_db
   ```
   Replace `YOUR_PASSWORD` with the password you set during installation.

5. **Run Migrations:**
   ```bash
   cd backend
   alembic upgrade head
   ```

6. **Start Backend:**
   ```bash
   uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
   ```

---

## Option 2: Use Docker PostgreSQL (Faster)

If you have Docker installed:

```bash
# Start PostgreSQL in Docker
docker run --name postgres-todo -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo_db -p 5432:5432 -d postgres:16

# Your .env is already configured for this
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db
```

Then run migrations and start the backend.

---

## Option 3: Temporarily Allow SQLite for Local Dev

If you want to test locally with SQLite before deploying to Railway:

### Modify database.py temporarily:

```python
# In backend/src/database/database.py
# Comment out the PostgreSQL enforcement for local dev only

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# TEMPORARILY COMMENT OUT FOR LOCAL DEV:
# if not DATABASE_URL.startswith("postgresql"):
#     raise ValueError("Only PostgreSQL databases are supported...")

# Create engine
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10
    )
else:
    # Allow SQLite for local development only
    engine = create_engine(DATABASE_URL, echo=False)
```

**IMPORTANT:** This is only for local testing. Don't commit this change. The production code on Railway will use PostgreSQL.

---

## Recommended Approach

**For Local Development:**
- Use Option 2 (Docker PostgreSQL) - fastest and cleanest
- Or use Option 1 (Install PostgreSQL) - permanent solution

**For Production:**
- Deploy to Railway (already configured)
- Railway provides PostgreSQL automatically
- No local setup needed

---

## Quick Docker Setup (Recommended)

```bash
# 1. Install Docker Desktop for Windows
# Download from: https://www.docker.com/products/docker-desktop

# 2. Start PostgreSQL
docker run --name postgres-todo -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=todo_db -p 5432:5432 -d postgres:16

# 3. Run migrations
cd backend
alembic upgrade head

# 4. Start backend
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

---

## Current Status

Your `.env` file is now configured for PostgreSQL:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo_db
```

**Next Step:** Choose one of the options above to set up PostgreSQL locally.

**Or:** Skip local testing and deploy directly to Railway where PostgreSQL is provided automatically.
