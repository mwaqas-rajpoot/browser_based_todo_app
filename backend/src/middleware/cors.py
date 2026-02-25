from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

def add_cors_middleware(app: FastAPI):
    """
    Add CORS middleware to allow frontend communication.

    This function sets up Cross-Origin Resource Sharing (CORS) to allow
    the frontend to communicate with the backend API.
    """
    # Allow specific origins, or all if in development
    origins = [
        "http://localhost:3000",  # Default Next.js dev server
        "http://localhost:3001",  # Alternative port
        "http://127.0.0.1:3000",  # Alternative localhost format
        "http://127.0.0.1:3001",  # Alternative localhost format
        "http://localhost:8000",  # Backend docs/swagger
        "http://127.0.0.1:8000",  # Backend alternative format
    ]

    # Additional origins from environment variable
    additional_origins = os.getenv("BACKEND_CORS_ORIGINS", "")
    if additional_origins:
        origins.extend(additional_origins.split(","))

    print(f"CORS enabled for origins: {origins}")

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )