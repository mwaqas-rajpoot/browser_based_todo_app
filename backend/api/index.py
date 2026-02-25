from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Create FastAPI app
app = FastAPI(
    title="Todo Application API",
    description="API for managing todo tasks",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers after app creation to avoid circular imports
try:
    from src.api.auth_router import router as auth_router
    from src.api.task_router import router as task_router
    from src.api.admin_router import router as admin_router

    app.include_router(auth_router, prefix="/api/v1")
    app.include_router(task_router, prefix="/api/v1")
    app.include_router(admin_router, prefix="/api/v1")
except Exception as e:
    print(f"Warning: Could not load routers: {e}")

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Todo Application API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "message": "API is running"
    }

# Vercel handler
handler = app
