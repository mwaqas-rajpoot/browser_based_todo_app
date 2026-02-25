from typing import Optional
import re
from pydantic import BaseModel, validator
from ..models.task import TaskCreate, TaskUpdate


class InputValidator:
    """Utility class for input validation and sanitization."""

    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Validate email format.

        Args:
            email: Email address to validate

        Returns:
            True if email is valid, False otherwise
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Validate password strength requirements.

        Args:
            password: Password to validate

        Returns:
            Tuple of (is_valid, message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"

        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"

        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"

        if not re.search(r'\d', password):
            return False, "Password must contain at least one digit"

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character"

        return True, "Password is valid"

    @staticmethod
    def sanitize_text(text: str, max_length: int = 1000) -> str:
        """
        Sanitize text input by removing potentially harmful content.

        Args:
            text: Text to sanitize
            max_length: Maximum allowed length

        Returns:
            Sanitized text
        """
        if not isinstance(text, str):
            return ""

        # Limit length
        text = text[:max_length]

        # Remove potentially dangerous characters/sequences
        # This is a basic example - consider using a more comprehensive sanitizer
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',  # Script tags
            r'javascript:',               # JavaScript URLs
            r'on\w+\s*=',                # Event handlers
        ]

        for pattern in dangerous_patterns:
            import re
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)

        return text.strip()

    @staticmethod
    def validate_task_input(task_data: TaskCreate) -> tuple[bool, str]:
        """
        Validate task creation input.

        Args:
            task_data: Task creation data

        Returns:
            Tuple of (is_valid, message)
        """
        if not task_data.title or len(task_data.title.strip()) == 0:
            return False, "Task title is required"

        if len(task_data.title) > 255:
            return False, "Task title must be 255 characters or less"

        if task_data.description and len(task_data.description) > 1000:
            return False, "Task description must be 1000 characters or less"

        if task_data.priority and task_data.priority not in ['low', 'medium', 'high']:
            return False, "Priority must be 'low', 'medium', or 'high'"

        if task_data.status and task_data.status not in ['todo', 'in_progress', 'completed']:
            return False, "Status must be 'todo', 'in_progress', or 'completed'"

        return True, "Task input is valid"

    @staticmethod
    def validate_task_update(task_data: TaskUpdate) -> tuple[bool, str]:
        """
        Validate task update input.

        Args:
            task_data: Task update data

        Returns:
            Tuple of (is_valid, message)
        """
        if task_data.title and len(task_data.title) > 255:
            return False, "Task title must be 255 characters or less"

        if task_data.description and len(task_data.description) > 1000:
            return False, "Task description must be 1000 characters or less"

        if task_data.priority and task_data.priority not in ['low', 'medium', 'high']:
            return False, "Priority must be 'low', 'medium', or 'high'"

        if task_data.status and task_data.status not in ['todo', 'in_progress', 'completed']:
            return False, "Status must be 'todo', 'in_progress', or 'completed'"

        return True, "Task update input is valid"