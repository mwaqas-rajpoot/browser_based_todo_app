"""
Module to properly set up model relationships after both User and Task models are defined.
This avoids circular import issues in SQLModel.
"""

from sqlmodel import Relationship
from .models.user import User
from .models.task import Task

# Set up the relationships after both models are fully defined
User.tasks = Relationship(back_populates="user")
Task.user = Relationship(back_populates="tasks")