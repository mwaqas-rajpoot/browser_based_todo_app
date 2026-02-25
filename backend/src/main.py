from fastapi import FastAPI
from fastapi.security import HTTPBearer
from .api.auth_router import router as auth_router
from .api.task_router import router as task_router
from .middleware.cors import add_cors_middleware
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from .database.database import engine

# Import all models to register them with SQLModel before creating tables
from .models import user, task  # This ensures both models are loaded
from .model_relations import *  # This sets up the relationships after both models are loaded
from .api.admin_router import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for the FastAPI application.
    Runs startup and shutdown events.
    """
    # Startup: Initialize database tables
    print("Creating database tables...")
    SQLModel.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

    yield

    # Shutdown: Cleanup code goes here
    print("Application shutting down...")


# Create FastAPI application with Swagger UI authentication
app = FastAPI(
    title="Todo Application API",
    description="API for managing todo tasks with user authentication",
    version="1.0.0",
    lifespan=lifespan,
    swagger_ui_parameters={
        "persistAuthorization": True
    }
)

# Add CORS middleware
add_cors_middleware(app)

# Add security scheme for Swagger UI
from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Todo Application API",
        version="1.0.0",
        description="API for managing todo tasks with user authentication",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token from /api/v1/auth/login"
        }
    }
    # Apply security globally to all endpoints
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            if method != "parameters":
                openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Include API routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(task_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")

@app.get("/")
def read_root():
    """
    Root endpoint for the API.

    Returns:
        Welcome message and API status
    """
    return {
        "message": "Welcome to the Todo Application API",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """
    Health check endpoint for the entire application.

    Returns:
        Health status information
    """
    return {
        "status": "healthy",
        "message": "API is running",
        "endpoints": [
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/tasks"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)