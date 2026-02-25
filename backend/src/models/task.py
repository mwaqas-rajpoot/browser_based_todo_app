from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

# Import User using string reference to avoid circular import
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="todo", sa_column_kwargs={"server_default": "todo"})
    due_date: Optional[datetime] = Field(default=None)
    priority: str = Field(default="medium", sa_column_kwargs={"server_default": "medium"})


class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: str = Field(default="todo", sa_column_kwargs={"server_default": "todo"})  # 'todo', 'in_progress', 'completed'
    due_date: Optional[datetime] = Field(default=None)
    priority: str = Field(default="medium", sa_column_kwargs={"server_default": "medium"})  # 'low', 'medium', 'high'
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    pass  # Relationship will be added after both models are defined


class TaskCreate(TaskBase):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: str = "medium"


class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None  # 'todo', 'in_progress', 'completed'
    due_date: Optional[datetime] = None
    priority: Optional[str] = None  # 'low', 'medium', 'high'


class TaskResponse(SQLModel):
    id: uuid.UUID
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[datetime] = None
    priority: str
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True