# Vercel Backend Deployment Guide

## Prerequisites
- Vercel account
- Vercel CLI installed: `npm i -g vercel`
- PostgreSQL database (Neon DB recommended)

## Step 1: Database Setup
1. Create a PostgreSQL database on [Neon](https://neon.tech) or any PostgreSQL provider
2. Copy the connection string (should look like: `postgresql://user:password@host/database?sslmode=require`)

## Step 2: Deploy Backend to Vercel

### Option A: Using Vercel CLI (Recommended)

1. Navigate to backend directory:
```bash
cd backend
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Add environment variables during deployment or via Vercel dashboard:
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
SECRET_KEY=your-super-secret-jwt-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ADMIN_TOKEN=your-admin-token
ENVIRONMENT=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Set **Root Directory** to `backend`
5. Framework Preset: **Other**
6. Add environment variables in "Environment Variables" section
7. Click "Deploy"

## Step 3: Configure Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `SECRET_KEY` | `your-secret-key` | JWT secret (min 32 chars) |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Token expiry time |
| `ADMIN_TOKEN` | `your-admin-token` | Admin API token |
| `ENVIRONMENT` | `production` | Environment name |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Frontend URL for CORS |

## Step 4: Update Frontend API URL

Update your frontend environment variables to point to the backend:

```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Step 5: Test Deployment

1. Visit: `https://your-backend.vercel.app/`
2. Check health: `https://your-backend.vercel.app/health`
3. API docs: `https://your-backend.vercel.app/docs`

## Project Structure

```
backend/
├── api/
│   └── index.py          # Vercel serverless handler
├── src/
│   ├── api/              # API routers
│   ├── models/           # Database models
│   ├── database/         # Database config
│   └── ...
├── vercel.json           # Vercel configuration
└── requirements.txt      # Python dependencies
```

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Check database is accessible from Vercel's IP ranges
- Verify credentials are correct

### Import Errors
- Check all dependencies are in `requirements.txt`
- Ensure `PYTHONPATH` is set correctly in code

### CORS Issues
- Update `FRONTEND_URL` environment variable
- Check CORS middleware in `api/index.py`

## Useful Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# View environment variables
vercel env ls
```

## Notes

- Backend runs as serverless functions on Vercel
- Cold starts may take 1-2 seconds
- Database connections are pooled automatically
- All routes go through `api/index.py`
