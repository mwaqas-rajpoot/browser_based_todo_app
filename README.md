# Hackathon Todo – Phase II (Full-Stack Web App)

This project transforms an existing console-based Todo app into a secure, multi-user, full-stack web application using spec-driven development.

## Architecture

- **Frontend**: Next.js 16+ with TypeScript and Tailwind CSS
- **Backend**: FastAPI + SQLModel
- **Database**: SQLite
- **Auth**: JWT-based authentication

## Security Features

- All API routes require JWT authentication
- JWT verification using shared secret: BETTER_AUTH_SECRET
- Backend never trusts user_id from frontend without verifying JWT
- Users can only access their own tasks

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── models/          # Database models (User, Task)
│   │   ├── services/        # Business logic (AuthService, TaskService)
│   │   ├── api/             # API routers (auth_router, task_router)
│   │   ├── database/        # Database configuration
│   │   ├── auth/            # Authentication handlers
│   │   ├── middleware/      # CORS and auth middleware
│   │   └── config.py        # Configuration settings
│   ├── requirements.txt     # Backend dependencies
│   ├── alembic/             # Database migrations
│   └── src/main.py          # Main application entry point
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions (auth)
│   ├── package.json         # Frontend dependencies
│   └── src/app/globals.css  # Global styles
└── specs/                   # Specification documents
```

## Setup Instructions

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   # In backend/.env
   DATABASE_URL=sqlite:///./todo_app.db
   SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

3. Run the application:
   ```bash
   cd backend
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set environment variables:
   ```bash
   # In frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Run the development server:
   ```bash
   cd frontend
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/logout` - Logout (client-side only)
- `GET /api/v1/auth/me` - Get current user info

### Tasks
- `GET /api/v1/tasks` - Get user's tasks
- `POST /api/v1/tasks` - Create a new task
- `GET /api/v1/tasks/{id}` - Get a specific task
- `PUT /api/v1/tasks/{id}` - Update a task
- `DELETE /api/v1/tasks/{id}` - Delete a task

## Features

1. **User Authentication**: Secure registration and login with JWT tokens
2. **Task Management**: Full CRUD operations for user-specific tasks
3. **User Isolation**: Strict enforcement that users can only access their own tasks
4. **Responsive UI**: Clean interface for task management
5. **Security**: Server-side validation of all requests

## Deployment

### Vercel Deployment

This project is deployed on Vercel with separate deployments for frontend and backend.

#### Frontend Deployment
Already deployed on Vercel. Update environment variable:
- `NEXT_PUBLIC_API_URL` - Your backend Vercel URL

#### Backend Deployment

**Option 1: Using Vercel CLI**
```bash
cd backend
vercel login
vercel --prod
```

**Option 2: Using Vercel Dashboard**
1. Import repository
2. Set Root Directory to `backend`
3. Add environment variables (see below)
4. Deploy

#### Required Environment Variables (Backend)

Set these in Vercel Dashboard → Project Settings → Environment Variables:

- `DATABASE_URL` - PostgreSQL connection string (NeonDB recommended)
- `SECRET_KEY` - JWT secret key (min 32 characters)
- `ALGORITHM` - `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` - `30`
- `ADMIN_TOKEN` - Admin API token
- `ENVIRONMENT` - `production`
- `FRONTEND_URL` - Your frontend Vercel URL

#### Deployment Guide
📘 [Complete Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)

## Development

This project follows spec-driven development principles. All features are guided by specifications in the `/specs` directory.

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Documentation

- API Documentation: `http://localhost:8000/docs` (Swagger UI)
- Project Status: [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

<!--Admin Login token: dev-admin-token-2026 -->