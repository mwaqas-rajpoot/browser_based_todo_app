"""
Comprehensive API Endpoint Tests
Tests all API endpoints including auth, tasks, and admin routes
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from src.main import app
from src.database.database import get_session
from src.models.user import User
from src.models.task import Task
from src.auth.password import get_password_hash


# Create in-memory SQLite database for testing
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
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


@pytest.fixture(name="test_user")
def test_user_fixture(session: Session):
    """Create a test user"""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpassword123"),
        is_admin=False
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="admin_user")
def admin_user_fixture(session: Session):
    """Create an admin user"""
    admin = User(
        username="adminuser",
        email="admin@example.com",
        hashed_password=get_password_hash("adminpassword123"),
        is_admin=True
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin


@pytest.fixture(name="auth_token")
def auth_token_fixture(client: TestClient):
    """Get authentication token for test user"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testuser", "password": "testpassword123"}
    )
    return response.json()["access_token"]


@pytest.fixture(name="admin_token")
def admin_token_fixture(client: TestClient):
    """Get authentication token for admin user"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "adminuser", "password": "adminpassword123"}
    )
    return response.json()["access_token"]


class TestHealthEndpoints:
    """Test health and root endpoints"""

    def test_root_endpoint(self, client: TestClient):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data

    def test_health_check(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestAuthEndpoints:
    """Test authentication endpoints"""

    def test_register_user(self, client: TestClient):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "newpassword123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"
        assert "id" in data

    def test_register_duplicate_username(self, client: TestClient, test_user: User):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "username": "testuser",
                "email": "another@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 400

    def test_login_success(self, client: TestClient, test_user: User):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "testpassword123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_credentials(self, client: TestClient, test_user: User):
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "testuser", "password": "wrongpassword"}
        )
        assert response.status_code == 401


class TestTaskEndpoints:
    """Test task management endpoints"""

    def test_create_task(self, client: TestClient, test_user: User, auth_token: str):
        response = client.post(
            "/api/v1/tasks",
            json={
                "title": "Test Task",
                "description": "Test Description",
                "status": "pending",
                "priority": "medium"
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["status"] == "pending"

    def test_get_tasks(self, client: TestClient, test_user: User, auth_token: str, session: Session):
        # Create test tasks
        task1 = Task(title="Task 1", user_id=test_user.id, status="pending")
        task2 = Task(title="Task 2", user_id=test_user.id, status="completed")
        session.add(task1)
        session.add(task2)
        session.commit()

        response = client.get(
            "/api/v1/tasks",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 2

    def test_get_task_by_id(self, client: TestClient, test_user: User, auth_token: str, session: Session):
        task = Task(title="Specific Task", user_id=test_user.id, status="pending")
        session.add(task)
        session.commit()
        session.refresh(task)

        response = client.get(
            f"/api/v1/tasks/{task.id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Specific Task"

    def test_update_task(self, client: TestClient, test_user: User, auth_token: str, session: Session):
        task = Task(title="Old Title", user_id=test_user.id, status="pending")
        session.add(task)
        session.commit()
        session.refresh(task)

        response = client.put(
            f"/api/v1/tasks/{task.id}",
            json={"title": "Updated Title", "status": "completed"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["status"] == "completed"

    def test_delete_task(self, client: TestClient, test_user: User, auth_token: str, session: Session):
        task = Task(title="To Delete", user_id=test_user.id, status="pending")
        session.add(task)
        session.commit()
        session.refresh(task)

        response = client.delete(
            f"/api/v1/tasks/{task.id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200

    def test_unauthorized_access(self, client: TestClient):
        response = client.get("/api/v1/tasks")
        assert response.status_code == 401


class TestAdminEndpoints:
    """Test admin endpoints"""

    def test_get_all_users_as_admin(self, client: TestClient, admin_user: User, admin_token: str):
        response = client.get(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_all_users_as_regular_user(self, client: TestClient, test_user: User, auth_token: str):
        response = client.get(
            "/api/v1/admin/users",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 403

    def test_delete_user_as_admin(self, client: TestClient, admin_user: User, admin_token: str, session: Session):
        user_to_delete = User(
            username="deleteme",
            email="delete@example.com",
            hashed_password=get_password_hash("password123")
        )
        session.add(user_to_delete)
        session.commit()
        session.refresh(user_to_delete)

        response = client.delete(
            f"/api/v1/admin/users/{user_to_delete.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200


class TestTaskFiltering:
    """Test task filtering and sorting"""

    def test_filter_by_status(self, client: TestClient, test_user: User, auth_token: str, session: Session):
        task1 = Task(title="Pending Task", user_id=test_user.id, status="pending")
        task2 = Task(title="Completed Task", user_id=test_user.id, status="completed")
        session.add(task1)
        session.add(task2)
        session.commit()

        response = client.get(
            "/api/v1/tasks?status=pending",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert all(task["status"] == "pending" for task in data)

    def test_filter_by_priority(self, client: TestClient, test_user: User, auth_token: str, session: Session):
        task1 = Task(title="High Priority", user_id=test_user.id, priority="high")
        task2 = Task(title="Low Priority", user_id=test_user.id, priority="low")
        session.add(task1)
        session.add(task2)
        session.commit()

        response = client.get(
            "/api/v1/tasks?priority=high",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert all(task["priority"] == "high" for task in data)
