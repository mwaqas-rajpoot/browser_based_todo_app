from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

def add_cors_middleware(app: FastAPI):
    """
    Add CORS middleware to the FastAPI application.
    Allows requests from specified origins.
    """
    # Get environment (default to development)
    environment = os.getenv("ENVIRONMENT", "development")

    # Configure origins based on environment
    if environment == "production":
        origins = [
            os.getenv("FRONTEND_URL", "https://your-app.vercel.app"),
            "https://*.vercel.app",  # Allow all Vercel preview deployments
        ]
    else:
        # Development origins
        origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:3002",
        ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
