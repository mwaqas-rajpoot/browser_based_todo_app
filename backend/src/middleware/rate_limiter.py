import time
from collections import defaultdict, deque
from fastapi import HTTPException, status
from typing import Dict
import threading


class RateLimiter:
    """
    Simple in-memory rate limiter to prevent API abuse.
    Note: For production use, consider using redis-backed rate limiting.
    """

    def __init__(self):
        self.requests = defaultdict(deque)
        self.lock = threading.Lock()

    def is_allowed(self, identifier: str, max_requests: int, window_size: int) -> bool:
        """
        Check if a request from the given identifier is allowed.

        Args:
            identifier: Unique identifier for the client (e.g., IP address)
            max_requests: Maximum number of requests allowed
            window_size: Time window in seconds

        Returns:
            True if request is allowed, False otherwise
        """
        with self.lock:
            current_time = time.time()
            queue = self.requests[identifier]

            # Remove old requests outside the time window
            while queue and queue[0] <= current_time - window_size:
                queue.popleft()

            # Check if the number of requests is within the limit
            if len(queue) >= max_requests:
                return False

            # Add current request to the queue
            queue.append(current_time)
            return True


# Global rate limiter instance
rate_limiter = RateLimiter()


def check_rate_limit(identifier: str, max_requests: int = 10, window_size: int = 60):
    """
    Check if the request from the given identifier is within rate limits.

    Args:
        identifier: Unique identifier for the client (e.g., IP address)
        max_requests: Maximum number of requests allowed
        window_size: Time window in seconds

    Raises:
        HTTPException: If rate limit is exceeded
    """
    if not rate_limiter.is_allowed(identifier, max_requests, window_size):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )