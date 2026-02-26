# Backend Deployment Steps (Urdu/English)

## Step 1: Database Setup (Pehle Database Banayein)

1. [Neon.tech](https://neon.tech) par jaye aur account banaye
2. New Project create kare
3. Database connection string copy kare (ye aisa dikhega):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

## Step 2: Vercel CLI Install (Agar nahi hai to)

```bash
npm install -g vercel
```

## Step 3: Backend Deploy Kare

### Terminal mein ye commands run kare:

```bash
# Backend folder mein jaye
cd backend

# Vercel login kare
vercel login

# Deploy kare (production)
vercel --prod
```

### Deployment ke dauran ye questions puchhe jayenge:

1. **Set up and deploy?** → Yes (Y)
2. **Which scope?** → Apna account select kare
3. **Link to existing project?** → No (N)
4. **Project name?** → `todo-app-backend` (ya koi bhi naam)
5. **Directory?** → `.` (current directory)
6. **Override settings?** → No (N)

## Step 4: Environment Variables Add Kare

Deployment ke baad Vercel dashboard mein jaye:

1. [Vercel Dashboard](https://vercel.com/dashboard) open kare
2. Apni backend project select kare
3. **Settings** → **Environment Variables** par jaye
4. Ye variables add kare:

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | Aapka Neon database connection string |
| `SECRET_KEY` | Koi bhi random 32+ character string (e.g., `my-super-secret-jwt-key-12345678`) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `ADMIN_TOKEN` | Koi bhi admin token (e.g., `admin-token-2026`) |
| `ENVIRONMENT` | `production` |
| `FRONTEND_URL` | Aapka frontend URL (e.g., `https://your-app.vercel.app`) |

5. **Save** kare

## Step 5: Redeploy Kare (Environment Variables ke saath)

```bash
vercel --prod
```

## Step 6: Test Kare

Deployment complete hone ke baad:

1. Backend URL milega (e.g., `https://todo-app-backend.vercel.app`)
2. Browser mein test kare:
   - `https://your-backend.vercel.app/` → Welcome message
   - `https://your-backend.vercel.app/health` → Health check
   - `https://your-backend.vercel.app/docs` → API documentation

## Step 7: Frontend Update Kare

Frontend ke environment variables update kare:

1. Frontend project ke Vercel dashboard mein jaye
2. **Settings** → **Environment Variables**
3. `NEXT_PUBLIC_API_URL` update kare:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```
4. Frontend redeploy kare

## Troubleshooting

### Agar database connect nahi ho raha:
- Check kare `DATABASE_URL` sahi hai
- `?sslmode=require` end mein hai ya nahi

### Agar 500 error aa raha hai:
- Vercel dashboard mein **Deployments** → **Logs** dekhe
- Environment variables sahi set hain ya nahi check kare

### CORS error:
- `FRONTEND_URL` environment variable sahi set hai ya nahi check kare

## Quick Commands Reference

```bash
# Logs dekhne ke liye
vercel logs

# Deployments list
vercel ls

# Environment variables dekhne ke liye
vercel env ls

# Project remove karne ke liye
vercel rm [project-name]
```

## Important Notes

- Backend aur Frontend **alag-alag** deploy hote hain
- Har deployment ka apna URL hoga
- Environment variables change karne ke baad redeploy karna zaroori hai
- Database Neon par free tier mein available hai
