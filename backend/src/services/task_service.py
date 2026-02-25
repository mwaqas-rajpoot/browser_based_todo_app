from sqlmodel import Session, select
from typing import Optional, List
from ..models.user import User
from ..models.task import Task, TaskCreate, TaskUpdate
from ..auth.jwt_handler import get_current_user
from ..utils.logger import security_logger
from ..utils.validation import InputValidator
import uuid


class TaskService:
    """Service class for handling task operations with user isolation."""

    @staticmethod
    def create_task(*, session: Session, task_data: TaskCreate, user_id: str, ip_address: str = None) -> Task:
        """
        Create a new task for the authenticated user.

        Args:
            session: Database session
            task_data: Task creation data
            user_id: ID of the user creating the task
            ip_address: IP address of the requesting client

        Returns:
            Created Task object
        """
        # Create task instance with user_id
        task = Task(
            title=task_data.title,
            description=task_data.description,
            status=task_data.status,
            due_date=task_data.due_date,
            priority=task_data.priority,
            user_id=uuid.UUID(user_id)
        )

        # Add to session and commit
        session.add(task)
        session.commit()
        session.refresh(task)

        # Log successful task creation
        try:
            security_logger.log_security_event(
                event_type="TASK_CREATED",
                user_id=user_id,
                resource=f"task/{task.id}",
                ip_address=ip_address,
                details={
                    "task_title": task.title,
                    "task_status": task.status,
                    "task_priority": task.priority
                }
            )
        except Exception as e:
            # Don't fail task creation if logging fails
            print(f"Warning: Failed to log task creation: {e}")

        return task

    @staticmethod
    def get_task_by_id(*, session: Session, task_id: str, user_id: str, ip_address: str = None) -> Optional[Task]:
        """
        Get a specific task by ID for the authenticated user.

        Args:
            session: Database session
            task_id: ID of the task to retrieve
            user_id: ID of the authenticated user
            ip_address: IP address of the requesting client

        Returns:
            Task object if found and owned by user, None otherwise
        """
        task_uuid = uuid.UUID(task_id)
        user_uuid = uuid.UUID(user_id)

        # Query for the task that belongs to the current user
        statement = select(Task).where(Task.id == task_uuid).where(Task.user_id == user_uuid)
        task = session.exec(statement).first()

        if not task:
            # Log potential unauthorized access attempt
            security_logger.log_unauthorized_access_attempt(
                user_id=user_id,
                resource=f"task/{task_id}",
                ip_address=ip_address,
                attempted_action="read"
            )

        return task

    @staticmethod
    def get_tasks_by_user(*, session: Session, user_id: str, skip: int = 0, limit: int = 100,
                         status_filter: str = None, priority_filter: str = None,
                         sort_by: str = "created_at", sort_order: str = "asc") -> List[Task]:
        """
        Get all tasks for the authenticated user with optional filtering and sorting.

        Args:
            session: Database session
            user_id: ID of the authenticated user
            skip: Number of records to skip
            limit: Maximum number of records to return
            status_filter: Filter tasks by status (todo, in_progress, completed)
            priority_filter: Filter tasks by priority (low, medium, high)
            sort_by: Sort by field (created_at, updated_at, due_date, priority, status)
            sort_order: Sort order (asc, desc)

        Returns:
            List of Task objects owned by the user
        """
        user_uuid = uuid.UUID(user_id)

        # Build query with user_id filter
        statement = select(Task).where(Task.user_id == user_uuid)

        # Apply status filter if provided
        if status_filter:
            statement = statement.where(Task.status == status_filter)

        # Apply priority filter if provided
        if priority_filter:
            statement = statement.where(Task.priority == priority_filter)

        # Apply sorting
        if sort_order.lower() == "desc":
            if sort_by == "created_at":
                statement = statement.order_by(Task.created_at.desc())
            elif sort_by == "updated_at":
                statement = statement.order_by(Task.updated_at.desc())
            elif sort_by == "due_date":
                statement = statement.order_by(Task.due_date.desc())
            elif sort_by == "priority":
                statement = statement.order_by(Task.priority.desc())
            elif sort_by == "status":
                statement = statement.order_by(Task.status.desc())
            else:
                statement = statement.order_by(Task.created_at.desc())
        else:  # Default to ascending
            if sort_by == "created_at":
                statement = statement.order_by(Task.created_at.asc())
            elif sort_by == "updated_at":
                statement = statement.order_by(Task.updated_at.asc())
            elif sort_by == "due_date":
                statement = statement.order_by(Task.due_date.asc())
            elif sort_by == "priority":
                statement = statement.order_by(Task.priority.asc())
            elif sort_by == "status":
                statement = statement.order_by(Task.status.asc())
            else:
                statement = statement.order_by(Task.created_at.asc())

        # Apply pagination
        statement = statement.offset(skip).limit(limit)

        tasks = session.exec(statement).all()

        return tasks

    @staticmethod
    def update_task(*, session: Session, task_id: str, task_update: TaskUpdate, user_id: str, ip_address: str = None) -> Optional[Task]:
        """
        Update a task for the authenticated user.

        Args:
            session: Database session
            task_id: ID of the task to update
            task_update: Update data
            user_id: ID of the authenticated user
            ip_address: IP address of the requesting client

        Returns:
            Updated Task object if successful, None if not found or not owned by user
        """
        task_uuid = uuid.UUID(task_id)
        user_uuid = uuid.UUID(user_id)

        # Get the task that belongs to the current user
        statement = select(Task).where(Task.id == task_uuid).where(Task.user_id == user_uuid)
        task = session.exec(statement).first()

        if not task:
            # Log unauthorized access attempt
            security_logger.log_unauthorized_access_attempt(
                user_id=user_id,
                resource=f"task/{task_id}",
                ip_address=ip_address,
                attempted_action="update"
            )
            return None

        # Update task fields if provided in update data
        update_data = task_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        session.add(task)
        session.commit()
        session.refresh(task)

        return task

    @staticmethod
    def delete_task(*, session: Session, task_id: str, user_id: str, ip_address: str = None) -> bool:
        """
        Delete a task for the authenticated user.

        Args:
            session: Database session
            task_id: ID of the task to delete
            user_id: ID of the authenticated user
            ip_address: IP address of the requesting client

        Returns:
            True if task was deleted, False if not found or not owned by user
        """
        task_uuid = uuid.UUID(task_id)
        user_uuid = uuid.UUID(user_id)

        # Get the task that belongs to the current user
        statement = select(Task).where(Task.id == task_uuid).where(Task.user_id == user_uuid)
        task = session.exec(statement).first()

        if not task:
            # Log unauthorized access attempt
            security_logger.log_unauthorized_access_attempt(
                user_id=user_id,
                resource=f"task/{task_id}",
                ip_address=ip_address,
                attempted_action="delete"
            )
            return False

        session.delete(task)
        session.commit()

        return True

    @staticmethod
    def get_task_count_by_user(*, session: Session, user_id: str) -> int:
        """
        Get the total count of tasks for the authenticated user.

        Args:
            session: Database session
            user_id: ID of the authenticated user

        Returns:
            Number of tasks owned by the user
        """
        user_uuid = uuid.UUID(user_id)

        # Count tasks that belong to the current user
        statement = select(Task).where(Task.user_id == user_uuid)
        tasks = session.exec(statement).all()

        return len(tasks)