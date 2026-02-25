# Vercel Deployment Guide - Todo App

## 🚀 Complete Deployment Steps

### Prerequisites
- GitHub account with your project pushed
- Vercel account (free tier works)
- Project URL: https://github.com/YOUR_USERNAME/Browser_Based_Todo_App

---

## Method 1: Vercel Dashboard (Recommended - Easiest)

### Step 1: Vercel Account Setup
1. Visit: https://vercel.com
2. Click "Sign Up" ya "Login"
3. "Continue with GitHub" select karein
4. GitHub se authorize karein

### Step 2: Import Project
1. Vercel dashboard mein "Add New" → "Project" click karein
2. "Import Git Repository" section mein apna repo search karein
3. "Browser_Based_Todo_App" select karein
4. "Import" button click karein

### Step 3: Configure Frontend Deployment
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 4: Environment Variables (Frontend)
Dashboard mein "Environment Variables" section mein add karein:
```
NEXT_PUBLIC_API_URL = https://your-backend-url.vercel.app
```
(Backend deploy hone ke baad update karenge)

### Step 5: Deploy Frontend
- "Deploy" button click karein
- Wait for deployment (2-3 minutes)
- Frontend URL milega: `https://your-app-name.vercel.app`

### Step 6: Backend Deployment (Separate Project)
1. Vercel dashboard mein dobara "Add New" → "Project"
2. Same repo select karein
3. Configure karein:
```
Framework Preset: Other
Root Directory: backend
Build Command: pip install -r requirements.txt
Output Directory: (leave empty)
```

### Step 7: Environment Variables (Backend)
```
DATABASE_URL = your-production-database-url
BETTER_AUTH_SECRET = your-super-secret-production-key-min-32-chars
ADMIN_TOKEN = your-production-admin-token
PYTHON_VERSION = 3.11
```

### Step 8: Update Frontend Environment
1. Frontend project mein jaayen
2. Settings → Environment Variables
3. `NEXT_PUBLIC_API_URL` ko backend URL se update karein
4. Redeploy karein

---

## Method 2: Vercel CLI (Advanced)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy Frontend
```bash
cd frontend
vercel --prod
```

### Step 4: Deploy Backend
```bash
cd ../backend
vercel --prod
```

---

## Database Setup for Production

### Option 1: Neon PostgreSQL (Recommended - Free)
1. Visit: https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string
5. Vercel backend environment variables mein add karein:
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Option 2: Supabase PostgreSQL
1. Visit: https://supabase.com
2. Create project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables

### Option 3: Vercel Postgres
1. Vercel dashboard mein Storage tab
2. "Create Database" → "Postgres"
3. Automatically environment variables add ho jayenge

---

## Post-Deployment Configuration

### 1. Update Backend CORS
Backend code mein CORS origins update karein:
```python
# backend/src/main.py
origins = [
    "https://your-frontend-url.vercel.app",
    "http://localhost:3002",  # for local development
]
```

### 2. Database Migration
```bash
# Local se run karein with production DATABASE_URL
cd backend
alembic upgrade head
```

### 3. Test Deployment
```bash
# Frontend URL test karein
curl https://your-frontend-url.vercel.app

# Backend API test karein
curl https://your-backend-url.vercel.app/health
```

---

## Important Notes

### Security Checklist
- [ ] Strong `BETTER_AUTH_SECRET` use karein (min 32 characters)
- [ ] Production `ADMIN_TOKEN` change karein
- [ ] Database connection SSL enabled ho
- [ ] CORS origins properly configured hain
- [ ] Environment variables secure hain

### Performance Tips
- [ ] Vercel Edge Network automatically enabled hai
- [ ] Next.js automatic optimization use karta hai
- [ ] Database connection pooling enable karein
- [ ] Static assets CDN se serve honge

### Monitoring
- Vercel dashboard mein:
  - Analytics dekh sakte hain
  - Logs check kar sakte hain
  - Performance metrics dekh sakte hain
  - Error tracking available hai

---

## Troubleshooting

### Build Fails
```bash
# Check logs in Vercel dashboard
# Common issues:
- Missing environment variables
- Wrong Node.js version
- Dependency conflicts
```

### API Connection Issues
```bash
# Verify:
1. NEXT_PUBLIC_API_URL correct hai
2. Backend deployed aur running hai
3. CORS properly configured hai
4. Environment variables set hain
```

### Database Connection Issues
```bash
# Check:
1. DATABASE_URL format correct hai
2. SSL mode enabled hai
3. Database accessible from Vercel
4. Credentials valid hain
```

---

## Quick Commands Reference

```bash
# Deploy frontend
cd frontend && vercel --prod

# Deploy backend
cd backend && vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm deployment-url
```

---

## URLs After Deployment

Frontend: `https://your-app-name.vercel.app`
Backend API: `https://your-backend-name.vercel.app`
API Docs: `https://your-backend-name.vercel.app/docs`

---

## Support

Issues face karein to:
1. Vercel dashboard logs check karein
2. GitHub Actions logs dekhen
3. Browser console errors check karein
4. Network tab mein API calls verify karein

---

**Last Updated**: 2026-02-25
**Status**: Ready for Deployment ✅
