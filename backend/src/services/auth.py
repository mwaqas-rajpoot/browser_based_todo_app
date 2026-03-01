from sqlmodel import Session, select
from passlib.context import CryptContext
from ..models.user import User, UserCreate, UserLogin, UserRegister
from ..auth.jwt_handler import create_access_token
from datetime import timedelta
from typing import Optional
import uuid
import re

# Password hashing context - using bcrypt only for production
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    """Service class for handling user authentication operations."""

    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Validate password strength.

        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if len(password) > 72:
            return False, "Password cannot exceed 72 characters"
        if not re.search(r"[A-Z]", password):
            return False, "Password must contain at least one uppercase letter"
        if not re.search(r"[a-z]", password):
            return False, "Password must contain at least one lowercase letter"
        if not re.search(r"\d", password):
            return False, "Password must contain at least one number"
        return True, ""

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against a hashed password."""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Generate a hash for a plain password using bcrypt."""
        return pwd_context.hash(password)

    @staticmethod
    def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user by email and password.

        Args:
            session: Database session
            email: User's email address
            password: Plain text password

        Returns:
            User object if authentication is successful, None otherwise
        """
        # Find user by email
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()

        # Verify user exists and password is correct
        if not user or not AuthService.verify_password(password, user.hashed_password):
            return None

        return user

    @staticmethod
    def register_user(session: Session, user_register: UserRegister) -> Optional[User]:
        """
        Register a new user with email and password.

        Args:
            session: Database session
            user_register: User registration data

        Returns:
            Created User object if successful, None if email already exists

        Raises:
            ValueError: If password is weak or validation fails
        """
        # Validate password strength
        is_valid, error_msg = AuthService.validate_password_strength(user_register.password)
        if not is_valid:
            raise ValueError(error_msg)

        # Check if user with email already exists
        statement = select(User).where(User.email == user_register.email)
        existing_user = session.exec(statement).first()

        if existing_user:
            return None  # Email already exists

        # Hash the password
        hashed_password = AuthService.get_password_hash(user_register.password)

        # Create new user
        db_user = User(
            username=user_register.username,
            email=user_register.email,
            hashed_password=hashed_password,
        )

        # Add to session and commit
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return db_user

    @staticmethod
    def create_access_token_for_user(user: User) -> str:
        """
        Create an access token for a user.

        Args:
            user: User object for whom to create the token

        Returns:
            JWT access token string
        """
        # Create data to encode in the token (using user ID as sub)
        data = {"sub": str(user.id), "email": user.email}

        # Create and return the token
        token = create_access_token(
            data=data,
            expires_delta=timedelta(minutes=30)  # Token expires in 30 minutes
        )

        return token

    @staticmethod
    def get_user_by_email(session: Session, email: str) -> Optional[User]:
        """
        Get a user by their email address.

        Args:
            session: Database session
            email: Email address to search for

        Returns:
            User object if found, None otherwise
        """
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()

        return user