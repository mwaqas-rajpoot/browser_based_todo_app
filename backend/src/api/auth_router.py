from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session
from ..database.database import get_session
from ..models.user import UserRegister, UserLogin, UserResponse
from ..services.auth import AuthService
from ..auth.jwt_handler import get_current_user
from ..middleware.rate_limiter import check_rate_limit
from ..utils.validation import InputValidator
from typing import Annotated
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register_user(
    request: Request,
    user_register: UserRegister,
    session: Session = Depends(get_session)
):
    """
    Register a new user with email and password.

    Args:
        request: HTTP request object to get client IP
        user_register: User registration data
        session: Database session

    Returns:
        UserResponse with user details
    """
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"

    # Apply rate limiting
    check_rate_limit(f"register:{client_ip}", max_requests=5, window_size=300)  # 5 requests per 5 minutes

    # Validate email format
    if not InputValidator.validate_email(user_register.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Validate password strength
    is_valid, message = InputValidator.validate_password_strength(user_register.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    # Sanitize inputs
    user_register.email = InputValidator.sanitize_text(user_register.email, max_length=255)

    # Attempt to register the user
    db_user = AuthService.register_user(session=session, user_register=user_register)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Return user response
    return UserResponse(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at
    )


@router.post("/login")
def login_user(
    request: Request,
    user_login: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate user with email and password, return JWT token.

    Args:
        request: HTTP request object to get client IP
        user_login: User login credentials
        session: Database session

    Returns:
        Dictionary with access token and token type
    """
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"

    # Apply rate limiting for login attempts
    check_rate_limit(f"login:{client_ip}", max_requests=5, window_size=300)  # 5 login attempts per 5 minutes

    # Validate email format
    if not InputValidator.validate_email(user_login.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Sanitize inputs
    user_login.email = InputValidator.sanitize_text(user_login.email, max_length=255)

    # Authenticate the user
    user = AuthService.authenticate_user(
        session=session,
        email=user_login.email,
        password=user_login.password
    )

    if not user:
        # Log authentication failure for security monitoring
        from ..utils.logger import security_logger
        security_logger.log_authentication_failure(
            email=user_login.email,
            ip_address=client_ip,
            reason="Invalid credentials"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Log successful authentication
    from ..utils.logger import security_logger
    security_logger.log_authentication_success(
        user_id=str(user.id),
        ip_address=client_ip
    )

    # Create access token for the user
    access_token = AuthService.create_access_token_for_user(user=user)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout_user():
    """
    Invalidate the current session/token.

    Returns:
        Success message indicating successful logout
    """
    # For JWT tokens, the server typically doesn't store session state
    # So "logout" means the client should remove the token from storage
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: Annotated[UserResponse, Depends(get_current_user)]):
    """
    Get current authenticated user details.

    Args:
        current_user: Currently authenticated user (from JWT token)

    Returns:
        UserResponse with user details
    """
    return UserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )