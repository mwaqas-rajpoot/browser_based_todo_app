import logging
from datetime import datetime
import json
from typing import Dict, Any
from enum import Enum


class SecurityEventType(Enum):
    AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS"
    AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE"
    UNAUTHORIZED_ACCESS_ATTEMPT = "UNAUTHORIZED_ACCESS_ATTEMPT"
    RESOURCE_ACCESS_VIOLATION = "RESOURCE_ACCESS_VIOLATION"
    TOKEN_VALIDATION_ERROR = "TOKEN_VALIDATION_ERROR"
    PERMISSION_DENIED = "PERMISSION_DENIED"


class SecurityLogger:
    """Utility class for security-related logging and audit trail."""

    def __init__(self, logger_name: str = "security_audit"):
        self.logger = logging.getLogger(logger_name)

        # Create handler if not already configured
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

    def log_security_event(
        self,
        event_type: SecurityEventType,
        user_id: str = None,
        resource: str = None,
        ip_address: str = None,
        details: Dict[str, Any] = None
    ):
        """
        Log a security-related event.

        Args:
            event_type: Type of security event
            user_id: ID of the user involved (if any)
            resource: Resource being accessed
            ip_address: IP address of the request
            details: Additional details about the event
        """
        event_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type.value,
            "user_id": user_id,
            "resource": resource,
            "ip_address": ip_address,
            "details": details or {}
        }

        message = json.dumps(event_data, indent=2)
        self.logger.info(message)

    def log_authentication_success(self, user_id: str, ip_address: str = None):
        """Log successful authentication."""
        self.log_security_event(
            event_type=SecurityEventType.AUTHENTICATION_SUCCESS,
            user_id=user_id,
            ip_address=ip_address,
            details={"success": True}
        )

    def log_authentication_failure(self, email: str, ip_address: str = None, reason: str = None):
        """Log failed authentication attempt."""
        self.log_security_event(
            event_type=SecurityEventType.AUTHENTICATION_FAILURE,
            user_id=email,  # Using email for failed auth since user_id isn't available
            ip_address=ip_address,
            details={"reason": reason}
        )

    def log_unauthorized_access_attempt(
        self,
        user_id: str,
        resource: str,
        ip_address: str = None,
        attempted_action: str = None
    ):
        """Log an unauthorized access attempt."""
        self.log_security_event(
            event_type=SecurityEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
            user_id=user_id,
            resource=resource,
            ip_address=ip_address,
            details={"attempted_action": attempted_action}
        )

    def log_resource_access_violation(
        self,
        user_id: str,
        resource: str,
        requested_user_id: str,
        ip_address: str = None
    ):
        """Log when a user attempts to access another user's resource."""
        self.log_security_event(
            event_type=SecurityEventType.RESOURCE_ACCESS_VIOLATION,
            user_id=user_id,
            resource=resource,
            ip_address=ip_address,
            details={
                "requested_user_id": requested_user_id,
                "violation_type": "cross_user_access"
            }
        )

    def log_permission_denied(self, user_id: str, resource: str, permission: str, ip_address: str = None):
        """Log when a user is denied permission to access a resource."""
        self.log_security_event(
            event_type=SecurityEventType.PERMISSION_DENIED,
            user_id=user_id,
            resource=resource,
            ip_address=ip_address,
            details={"required_permission": permission}
        )


# Create a global instance for use throughout the application
security_logger = SecurityLogger()