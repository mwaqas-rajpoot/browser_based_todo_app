from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from .task import Task


class UserBase(SQLModel):
    username: str = Field(unique=True, index=True, max_length=100)
    email: str = Field(unique=True, index=True, max_length=255)


class User(UserBase, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str = Field(unique=True, index=True, max_length=100)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)

    pass  # Relationship will be added after both models are defined



class UserCreate(UserBase):
    username: str
    password: str


class UserRegister(UserBase):
    username: str
    password: str


class UserLogin(SQLModel):
    email: str
    password: str


class UserResponse(SQLModel):
    id: uuid.UUID
    username: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True