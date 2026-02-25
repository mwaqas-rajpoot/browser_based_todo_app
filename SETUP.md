# Setup Guide - Todo App

## Backend Setup

### 1. Environment Variables
Create a `.env` file in the `backend/` directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
ADMIN_TOKEN=dev-admin-token-change-in-production
JWT_SECRET=your-secret-key-change-in-production
```

### 2. Install Dependencies
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run Database Migrations (if needed)
```bash
alembic upgrade head
```

### 4. Start Backend Server
```bash
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at: `http://localhost:8000`

---

## Frontend Setup

### 1. Environment Variables
Create a `.env.local` file in the `frontend/` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Start Frontend Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Features

### User Authentication
- **Register**: `/register` - Create new account
- **Login**: `/login` - Sign in with email and password
- **Dashboard**: `/dashboard` - View and manage tasks (protected route)

### Task Management
- Create, read, update, delete tasks
- Filter by status and priority
- Sort by various fields
- Each task is associated with the logged-in user

### Admin Dashboard (Developer Only)
- **URL**: `/admin`
- **Access**: Requires admin token
- **Default Token**: `dev-admin-token-change-in-production`
- **Features**:
  - View all users
  - See hashed passwords
  - View user creation dates
  - Check user status

### Security Features
- Password hashing with Argon2
- JWT token-based authentication
- Rate limiting on auth endpoints
- CORS protection
- Input validation and sanitization
- User data isolation (users can only see their own tasks)

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user details
- `POST /api/v1/auth/logout` - Logout (client-side token removal)

### Tasks
- `GET /api/v1/tasks` - Get user's tasks (with filtering/sorting)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{task_id}` - Get specific task
- `PUT /api/v1/tasks/{task_id}` - Update task
- `DELETE /api/v1/tasks/{task_id}` - Delete task

### Admin (Developer Only)
- `GET /api/v1/admin/users?admin_token=<token>` - Get all users
- `GET /api/v1/admin/users/{user_id}?admin_token=<token>` - Get specific user

---

## Troubleshooting

### "Failed to fetch" Error
1. Ensure backend is running on `http://localhost:8000`
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Verify CORS is enabled in backend
4. Check browser console for detailed error messages

### Tasks Not Appearing
1. Verify you're logged in
2. Check that the token is valid (not expired)
3. Ensure backend database is running
4. Check browser DevTools Network tab for API responses

### Admin Dashboard Access
1. Navigate to `/admin`
2. Enter the admin token: `dev-admin-token-change-in-production`
3. View all users and their hashed passwords

---

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `hashed_password` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)
- `is_active` (Boolean)

### Tasks Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `title` (String)
- `description` (String, Optional)
- `status` (Enum: todo, in_progress, completed)
- `priority` (Enum: low, medium, high)
- `due_date` (DateTime, Optional)
- `created_at` (DateTime)
- `updated_at` (DateTime)

---

## Important Notes

⚠️ **For Production:**
1. Change `ADMIN_TOKEN` to a secure random value
2. Change `JWT_SECRET` to a secure random value
3. Update `DATABASE_URL` to production database
4. Set `NEXT_PUBLIC_API_URL` to production backend URL
5. Enable HTTPS
6. Remove debug logging
7. Set proper CORS origins

