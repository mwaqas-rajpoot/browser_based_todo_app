from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

def add_cors_middleware(app: FastAPI):
    """
    Add CORS middleware to allow frontend communication.
    Production-ready with specific origin control.
    """
    environment = os.getenv("ENVIRONMENT", "production")

    # Development origins
    dev_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    # Production origins from environment
    frontend_url = os.getenv("FRONTEND_URL", "")
    additional_origins = os.getenv("BACKEND_CORS_ORIGINS", "")

    if environment == "production":
        # Production: only allow specific domains
        origins = []
        if frontend_url:
            origins.append(frontend_url)
        if additional_origins:
            origins.extend([origin.strip() for origin in additional_origins.split(",")])

        if not origins:
            raise ValueError("FRONTEND_URL or BACKEND_CORS_ORIGINS must be set in production")
    else:
        # Development: allow local origins
        origins = dev_origins
        if frontend_url:
            origins.append(frontend_url)
        if additional_origins:
            origins.extend([origin.strip() for origin in additional_origins.split(",")])

    print(f"CORS enabled for origins: {origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )