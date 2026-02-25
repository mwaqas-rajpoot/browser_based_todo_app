from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Annotated, List
from ..database.database import get_session
from ..models.task import Task, TaskCreate, TaskUpdate, TaskResponse
from ..models.user import User
from ..services.task_service import TaskService
from ..auth.jwt_handler import get_current_user
from ..middleware.auth import AuthMiddleware
from fastapi import Request
from ..utils.validation import InputValidator

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    priority: str = None,
    sort_by: str = "created_at",
    sort_order: str = "asc",
    session: Session = Depends(get_session)
):
    """
    Get all tasks belonging to the authenticated user with optional filtering and sorting.

    Args:
        request: HTTP request object to get client IP
        current_user: Currently authenticated user
        skip: Number of tasks to skip (for pagination)
        limit: Maximum number of tasks to return (for pagination)
        status: Filter tasks by status (todo, in_progress, completed)
        priority: Filter tasks by priority (low, medium, high)
        sort_by: Sort by field (created_at, updated_at, due_date, priority, status)
        sort_order: Sort order (asc, desc)
        session: Database session

    Returns:
        List of TaskResponse objects
    """
    # Get client IP address
    client_ip = request.client.host if request.client else None

    # Get all tasks for the current user with filtering and sorting
    tasks = TaskService.get_tasks_by_user(
        session=session,
        user_id=str(current_user.id),
        skip=skip,
        limit=limit,
        status_filter=status,
        priority_filter=priority,
        sort_by=sort_by,
        sort_order=sort_order
    )

    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    request: Request,
    task_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """
    Get a specific task by ID if it belongs to the authenticated user.

    Args:
        request: HTTP request object to get client IP
        task_id: ID of the task to retrieve
        current_user: Currently authenticated user
        session: Database session

    Returns:
        TaskResponse object

    Raises:
        HTTPException: If task not found or doesn't belong to user
    """
    # Get client IP address
    client_ip = request.client.host if request.client else None

    # Get the specific task for the current user
    task = TaskService.get_task_by_id(
        session=session,
        task_id=task_id,
        user_id=str(current_user.id),
        ip_address=client_ip
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to current user"
        )

    return task


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    request: Request,
    task_create: TaskCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.

    Args:
        request: HTTP request object to get client IP
        task_create: Task creation data
        current_user: Currently authenticated user
        session: Database session

    Returns:
        TaskResponse object of the created task

    Raises:
        HTTPException: If there's an issue creating the task
    """
    # Get client IP for security logging
    client_ip = request.client.host if request.client else None

    # Validate task input
    is_valid, message = InputValidator.validate_task_input(task_create)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    # Sanitize text inputs
    task_create.title = InputValidator.sanitize_text(task_create.title, max_length=255)
    if task_create.description:
        task_create.description = InputValidator.sanitize_text(task_create.description, max_length=1000)

    # Create the task for the current user
    task = TaskService.create_task(
        session=session,
        task_data=task_create,
        user_id=str(current_user.id)
    )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    request: Request,
    task_id: str,
    task_update: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """
    Update an existing task if it belongs to the authenticated user.

    Args:
        request: HTTP request object to get client IP
        task_id: ID of the task to update
        task_update: Task update data
        current_user: Currently authenticated user
        session: Database session

    Returns:
        TaskResponse object of the updated task

    Raises:
        HTTPException: If task not found or doesn't belong to user
    """
    # Get client IP address
    client_ip = request.client.host if request.client else None

    # Validate task update input
    is_valid, message = InputValidator.validate_task_update(task_update)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    # Sanitize text inputs if they exist
    if task_update.title:
        task_update.title = InputValidator.sanitize_text(task_update.title, max_length=255)
    if task_update.description:
        task_update.description = InputValidator.sanitize_text(task_update.description, max_length=1000)

    # Update the task for the current user
    updated_task = TaskService.update_task(
        session=session,
        task_id=task_id,
        task_update=task_update,
        user_id=str(current_user.id),
        ip_address=client_ip
    )

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to current user"
        )

    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    request: Request,
    task_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Session = Depends(get_session)
):
    """
    Delete a task if it belongs to the authenticated user.

    Args:
        request: HTTP request object to get client IP
        task_id: ID of the task to delete
        current_user: Currently authenticated user
        session: Database session

    Returns:
        HTTP 204 No Content if successful

    Raises:
        HTTPException: If task not found or doesn't belong to user
    """
    # Get client IP address
    client_ip = request.client.host if request.client else None

    # Delete the task for the current user
    deleted = TaskService.delete_task(
        session=session,
        task_id=task_id,
        user_id=str(current_user.id),
        ip_address=client_ip
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to current user"
        )

    # Return 204 No Content for successful deletion
    return


# Health check endpoint
@router.get("/health")
def health_check():
    """
    Health check endpoint for the tasks API.

    Returns:
        Dictionary with health status
    """
    return {"status": "healthy", "message": "Tasks API is running"}