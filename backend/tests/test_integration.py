"""
Integration tests for the Todo application API
"""
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from backend.src.main import app
from backend.src.database.database import get_session
from backend.src.models.user import User
from backend.src.models.task import Task
from backend.src.services.auth import AuthService
from passlib.context import CryptContext
import uuid


# Create test database engine
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)


@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(bind=engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_full_user_flow(client: TestClient, session: Session):
    """Test the complete user flow: register, login, create tasks, view tasks, update, delete"""

    # Step 1: Register a new user
    registration_data = {
        "email": "testuser@example.com",
        "password": "SecurePass123!"
    }

    response = client.post("/api/v1/auth/register", json=registration_data)
    assert response.status_code == 200

    user_response = response.json()
    assert user_response["email"] == "testuser@example.com"

    # Step 2: Login with the registered user
    login_data = {
        "email": "testuser@example.com",
        "password": "SecurePass123!"
    }

    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200

    auth_response = response.json()
    assert "access_token" in auth_response
    assert auth_response["token_type"] == "bearer"

    # Store the token for subsequent requests
    token = auth_response["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Step 3: Get user info
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == 200

    user_info = response.json()
    assert user_info["email"] == "testuser@example.com"

    # Step 4: Create a task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task",
        "priority": "medium"
    }

    response = client.post("/api/v1/tasks/", json=task_data, headers=headers)
    assert response.status_code == 201

    created_task = response.json()
    assert created_task["title"] == "Test Task"
    assert created_task["description"] == "This is a test task"
    assert created_task["priority"] == "medium"
    assert created_task["status"] == "todo"

    # Store the task ID for later use
    task_id = created_task["id"]

    # Step 5: Get all tasks
    response = client.get("/api/v1/tasks/", headers=headers)
    assert response.status_code == 200

    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["id"] == task_id

    # Step 6: Get the specific task
    response = client.get(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 200

    retrieved_task = response.json()
    assert retrieved_task["id"] == task_id
    assert retrieved_task["title"] == "Test Task"

    # Step 7: Update the task
    update_data = {
        "status": "in_progress",
        "priority": "high"
    }

    response = client.put(f"/api/v1/tasks/{task_id}", json=update_data, headers=headers)
    assert response.status_code == 200

    updated_task = response.json()
    assert updated_task["id"] == task_id
    assert updated_task["status"] == "in_progress"
    assert updated_task["priority"] == "high"

    # Step 8: Delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 204

    # Step 9: Verify the task is deleted
    response = client.get(f"/api/v1/tasks/{task_id}", headers=headers)
    assert response.status_code == 404


def test_user_isolation(client: TestClient, session: Session):
    """Test that users can only access their own tasks"""

    # Create first user
    user1_data = {
        "email": "user1@example.com",
        "password": "SecurePass123!"
    }

    response = client.post("/api/v1/auth/register", json=user1_data)
    assert response.status_code == 200

    # Login as first user
    response = client.post("/api/v1/auth/login", json=user1_data)
    assert response.status_code == 200
    user1_token = response.json()["access_token"]
    user1_headers = {"Authorization": f"Bearer {user1_token}"}

    # Create a task for user 1
    task_data = {
        "title": "User 1 Task",
        "description": "This belongs to user 1"
    }

    response = client.post("/api/v1/tasks/", json=task_data, headers=user1_headers)
    assert response.status_code == 201
    task1_id = response.json()["id"]

    # Create second user
    user2_data = {
        "email": "user2@example.com",
        "password": "SecurePass123!"
    }

    response = client.post("/api/v1/auth/register", json=user2_data)
    assert response.status_code == 200

    # Login as second user
    response = client.post("/api/v1/auth/login", json=user2_data)
    assert response.status_code == 200
    user2_token = response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    # Verify user 2 can't access user 1's task
    response = client.get(f"/api/v1/tasks/{task1_id}", headers=user2_headers)
    assert response.status_code == 404  # Should not find the task

    # Verify user 2 can access their own tasks list (should be empty)
    response = client.get("/api/v1/tasks/", headers=user2_headers)
    assert response.status_code == 200
    user2_tasks = response.json()
    assert len(user2_tasks) == 0

    # Verify user 1 can still access their task
    response = client.get(f"/api/v1/tasks/{task1_id}", headers=user1_headers)
    assert response.status_code == 200
    retrieved_task = response.json()
    assert retrieved_task["id"] == task1_id
    assert retrieved_task["title"] == "User 1 Task"


def test_invalid_inputs(client: TestClient, session: Session):
    """Test validation of invalid inputs"""

    # Register a user
    user_data = {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }

    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 200

    # Login
    response = client.post("/api/v1/auth/login", json=user_data)
    assert response.status_code == 200
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Try to create a task without a title (should fail)
    invalid_task_data = {
        "description": "Task without title"
    }

    response = client.post("/api/v1/tasks/", json=invalid_task_data, headers=headers)
    assert response.status_code == 422  # Validation error

    # Try to create a task with a very long title (should fail)
    long_title = "t" * 300  # More than 255 chars
    invalid_task_data = {
        "title": long_title,
        "description": "Task with long title"
    }

    response = client.post("/api/v1/tasks/", json=invalid_task_data, headers=headers)
    assert response.status_code == 400  # Validation error