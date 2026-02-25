from functools import wraps
from fastapi import HTTPException, status, Depends
from typing import Callable, Any
from sqlmodel import Session
from ..models.user import User
from .jwt_handler import get_current_user
import uuid


def require_same_user_or_admin(resource_user_id_field: str = "user_id"):
    """
    Decorator to ensure that the current user is the same as the resource owner.

    Args:
        resource_user_id_field: The field name that contains the resource owner's user ID
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Extract the current user and resource owner from kwargs
            current_user = kwargs.get('current_user') or kwargs.get('user')
            resource_owner_id = kwargs.get(resource_user_id_field)

            # Handle the case where the resource owner ID comes from a resource object
            if resource_owner_id is None and 'task' in kwargs:
                task = kwargs['task']
                resource_owner_id = getattr(task, 'user_id', None)

            # Check if the current user matches the resource owner
            if not current_user or not resource_owner_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated or resource owner not specified"
                )

            if str(current_user.id) != str(resource_owner_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: You can only access your own resources"
                )

            return func(*args, **kwargs)
        return wrapper
    return decorator


async def verify_user_owns_task(
    task_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
) -> bool:
    """
    Verify that the current user owns the specified task.

    Args:
        task_id: ID of the task to check
        current_user: The currently authenticated user
        session: Database session

    Returns:
        True if the user owns the task, raises HTTPException otherwise
    """
    from backend.src.models.task import Task
    from sqlmodel import select

    # Get the task by ID
    task = session.get(Task, uuid.UUID(task_id))

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check if the task belongs to the current user
    if str(task.user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own tasks"
        )

    return True


def check_user_ownership(resource_user_id: str, current_user_id: str) -> bool:
    """
    Check if the current user owns the specified resource.

    Args:
        resource_user_id: ID of the user who owns the resource
        current_user_id: ID of the current authenticated user

    Returns:
        True if the user owns the resource, False otherwise
    """
    return str(resource_user_id) == str(current_user_id)