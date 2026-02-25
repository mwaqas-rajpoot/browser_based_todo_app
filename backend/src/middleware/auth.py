from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from ..config import settings
from typing import Dict, Optional
import uuid

security = HTTPBearer()


class AuthMiddleware:
    """JWT authentication middleware to verify user identity server-side."""

    @staticmethod
    def verify_token(token: str) -> Dict:
        """Verify the JWT token and return the payload."""
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    @staticmethod
    def get_current_user_id(request: Request) -> Optional[str]:
        """Extract and return the current user ID from the request's JWT token."""
        authorization = request.headers.get("Authorization")

        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Extract token from "Bearer <token>" format
        try:
            scheme, credentials = authorization.split(" ")
            if scheme.lower() != "bearer":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication scheme",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            payload = AuthMiddleware.verify_token(credentials)
            user_id = payload.get("sub")

            if user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return user_id
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format",
                headers={"WWW-Authenticate": "Bearer"},
            )

    @staticmethod
    def verify_user_owns_resource(user_id: str, resource_owner_id: str) -> bool:
        """Verify that the authenticated user owns the requested resource."""
        return str(user_id) == str(resource_owner_id)