#!/usr/bin/env python3
"""
Test script to debug the user registration process
"""

from sqlmodel import Session
from src.database.database import engine
from src.models.user import UserRegister
from src.services.auth import AuthService

def test_registration():
    print("Testing user registration process...")

    # Create a session
    with Session(engine) as session:
        # Create test user data
        user_register = UserRegister(
            username="testuser",
            email="test@example.com",
            password="test123"
        )

        print(f"Attempting to register user: {user_register.username}")
        print(f"Email: {user_register.email}")

        try:
            # Try to register the user
            result = AuthService.register_user(session=session, user_register=user_register)

            if result:
                print(f"SUCCESS: User registered with ID: {result.id}")
                print(f"Username: {result.username}")
                print(f"Email: {result.email}")
            else:
                print("FAILURE: Registration failed - likely user already exists")

        except Exception as e:
            print(f"ERROR: Exception occurred during registration: {str(e)}")
            import traceback
            print("Full traceback:")
            traceback.print_exc()

if __name__ == "__main__":
    test_registration()