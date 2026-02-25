# Quickstart Guide: Todo Phase II

**Feature**: Hackathon Todo – Phase II (Full-Stack Web App)
**Date**: 2026-02-04
**Status**: Complete

## Overview

This guide provides a rapid path to getting the full-stack todo application running with authentication and user isolation.

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- PostgreSQL (local or Neon Serverless instance)
- Docker (optional, for containerized setup)

## Setup Steps

### 1. Clone and Initialize Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup

Navigate to backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to frontend directory and install dependencies:

```bash
cd frontend  # or return to root and then cd frontend
npm install
```

### 4. Environment Configuration

Create `.env` files in both directories:

**Backend (.env):**
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_app
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
BETTER_AUTH_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

### 5. Database Setup

Initialize the database and run migrations:

```bash
cd backend
# Apply database migrations
alembic upgrade head
```

### 6. Running the Applications

Start the backend:

```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

In a new terminal, start the frontend:

```bash
cd frontend
npm run dev
```

## API Endpoints

Once running, the API will be available at `http://localhost:8000`:

- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate user
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Frontend Access

The frontend application will be available at `http://localhost:3000`:

1. Visit `http://localhost:3000/register` to create an account
2. Log in at `http://localhost:3000/login`
3. Manage your tasks at `http://localhost:3000/dashboard`

## Security Notes

- Authentication is required for all task-related endpoints
- Users can only access their own tasks
- JWT tokens are validated server-side on every request
- Passwords are securely hashed using BCrypt

## Troubleshooting

**Database connection issues**: Ensure PostgreSQL is running and credentials are correct in DATABASE_URL

**Authentication failures**: Verify that BETTER_AUTH_SECRET matches between frontend and backend

**CORS errors**: Check that the API URL is correctly configured in frontend environment variables

## Next Steps

1. Run the complete test suite: `pytest` (backend) and `npm test` (frontend)
2. Review API documentation at `/docs` endpoint
3. Customize the UI in the frontend components
4. Add additional task features as needed