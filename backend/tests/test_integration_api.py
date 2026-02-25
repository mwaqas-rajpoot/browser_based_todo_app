"""
Integration Tests for API Services
Tests the integration between frontend services and backend API
"""

import pytest
import httpx
from typing import Dict, Any


BASE_URL = "http://localhost:8000"


@pytest.fixture
def test_user_credentials() -> Dict[str, str]:
    """Test user credentials"""
    return {
        "username": "integrationtest",
        "email": "integration@test.com",
        "password": "testpassword123"
    }


@pytest.fixture
async def auth_token(test_user_credentials: Dict[str, str]) -> str:
    """Get authentication token for tests"""
    async with httpx.AsyncClient() as client:
        # Register user
        try:
            await client.post(
                f"{BASE_URL}/api/v1/auth/register",
                json=test_user_credentials
            )
        except:
            pass  # User might already exist

        # Login
        response = await client.post(
            f"{BASE_URL}/api/v1/auth/login",
            data={
                "username": test_user_credentials["username"],
                "password": test_user_credentials["password"]
            }
        )
        return response.json()["access_token"]


class TestAPIIntegration:
    """Integration tests for API endpoints"""

    @pytest.mark.asyncio
    async def test_health_endpoint(self):
        """Test API health check"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_user_registration_flow(self, test_user_credentials: Dict[str, str]):
        """Test complete user registration flow"""
        async with httpx.AsyncClient() as client:
            # Register new user with unique username
            unique_creds = test_user_credentials.copy()
            unique_creds["username"] = f"testuser_{httpx.AsyncClient.__hash__(client)}"
            unique_creds["email"] = f"test_{httpx.AsyncClient.__hash__(client)}@example.com"

            response = await client.post(
                f"{BASE_URL}/api/v1/auth/register",
                json=unique_creds
            )
            assert response.status_code == 200
            data = response.json()
            assert "id" in data
            assert data["username"] == unique_creds["username"]

    @pytest.mark.asyncio
    async def test_login_flow(self, test_user_credentials: Dict[str, str]):
        """Test user login flow"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BASE_URL}/api/v1/auth/login",
                data={
                    "username": test_user_credentials["username"],
                    "password": test_user_credentials["password"]
                }
            )
            assert response.status_code == 200
            data = response.json()
            assert "access_token" in data
            assert data["token_type"] == "bearer"

    @pytest.mark.asyncio
    async def test_task_crud_operations(self, auth_token: str):
        """Test complete CRUD operations for tasks"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {auth_token}"}

            # Create task
            create_response = await client.post(
                f"{BASE_URL}/api/v1/tasks",
                json={
                    "title": "Integration Test Task",
                    "description": "Testing CRUD operations",
                    "status": "pending",
                    "priority": "high"
                },
                headers=headers
            )
            assert create_response.status_code == 200
            task_data = create_response.json()
            task_id = task_data["id"]

            # Read task
            read_response = await client.get(
                f"{BASE_URL}/api/v1/tasks/{task_id}",
                headers=headers
            )
            assert read_response.status_code == 200
            assert read_response.json()["title"] == "Integration Test Task"

            # Update task
            update_response = await client.put(
                f"{BASE_URL}/api/v1/tasks/{task_id}",
                json={
                    "title": "Updated Integration Test Task",
                    "status": "completed"
                },
                headers=headers
            )
            assert update_response.status_code == 200
            assert update_response.json()["title"] == "Updated Integration Test Task"

            # Delete task
            delete_response = await client.delete(
                f"{BASE_URL}/api/v1/tasks/{task_id}",
                headers=headers
            )
            assert delete_response.status_code == 200

    @pytest.mark.asyncio
    async def test_task_filtering(self, auth_token: str):
        """Test task filtering functionality"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {auth_token}"}

            # Create multiple tasks
            await client.post(
                f"{BASE_URL}/api/v1/tasks",
                json={"title": "High Priority Task", "priority": "high", "status": "pending"},
                headers=headers
            )
            await client.post(
                f"{BASE_URL}/api/v1/tasks",
                json={"title": "Low Priority Task", "priority": "low", "status": "completed"},
                headers=headers
            )

            # Filter by priority
            response = await client.get(
                f"{BASE_URL}/api/v1/tasks?priority=high",
                headers=headers
            )
            assert response.status_code == 200
            tasks = response.json()
            assert all(task["priority"] == "high" for task in tasks)

            # Filter by status
            response = await client.get(
                f"{BASE_URL}/api/v1/tasks?status=completed",
                headers=headers
            )
            assert response.status_code == 200
            tasks = response.json()
            assert all(task["status"] == "completed" for task in tasks)

    @pytest.mark.asyncio
    async def test_unauthorized_access(self):
        """Test that unauthorized requests are rejected"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/api/v1/tasks")
            assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_invalid_token(self):
        """Test that invalid tokens are rejected"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": "Bearer invalid_token_here"}
            response = await client.get(
                f"{BASE_URL}/api/v1/tasks",
                headers=headers
            )
            assert response.status_code == 401


class TestErrorHandling:
    """Test error handling across the application"""

    @pytest.mark.asyncio
    async def test_404_not_found(self):
        """Test 404 error handling"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL}/api/v1/nonexistent")
            assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_invalid_task_id(self, auth_token: str):
        """Test handling of invalid task ID"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {auth_token}"}
            response = await client.get(
                f"{BASE_URL}/api/v1/tasks/99999",
                headers=headers
            )
            assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_invalid_request_body(self, auth_token: str):
        """Test handling of invalid request body"""
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {auth_token}"}
            response = await client.post(
                f"{BASE_URL}/api/v1/tasks",
                json={"invalid_field": "value"},
                headers=headers
            )
            assert response.status_code == 422


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
