from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated, List
from ..database.database import get_session
from ..models.user import User
from ..auth.jwt_handler import get_current_user
import os

router = APIRouter(prefix="/admin", tags=["Admin"])

# Admin token from environment variable
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "dev-admin-token-change-in-production")


def verify_admin_token(token: str) -> bool:
    """Verify if the provided token is valid admin token."""
    return token == ADMIN_TOKEN


@router.get("/users", response_model=List[dict])
def get_all_users(
    admin_token: str,
    session: Session = Depends(get_session)
):
    """
    Get all users with their details (admin only).

    Args:
        admin_token: Admin authentication token
        session: Database session

    Returns:
        List of all users with username, email, and hashed_password

    Raises:
        HTTPException: If admin token is invalid
    """
    if not verify_admin_token(admin_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token"
        )

    # Get all users
    statement = select(User)
    users = session.exec(statement).all()

    # Return user data including hashed passwords for admin view
    return [
        {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "hashed_password": user.hashed_password,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "is_active": user.is_active
        }
        for user in users
    ]


@router.get("/users/{user_id}", response_model=dict)
def get_user_details(
    user_id: str,
    admin_token: str,
    session: Session = Depends(get_session)
):
    """
    Get specific user details (admin only).

    Args:
        user_id: User ID to retrieve
        admin_token: Admin authentication token
        session: Database session

    Returns:
        User details including hashed_password

    Raises:
        HTTPException: If admin token is invalid or user not found
    """
    if not verify_admin_token(admin_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token"
        )

    # Get user by ID
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        "hashed_password": user.hashed_password,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "is_active": user.is_active
    }
