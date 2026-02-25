import requests

# Login to get token
login_response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    json={"email": "test@example.com", "password": "Test@123"}
)
token = login_response.json()["access_token"]
print(f"Token: {token[:50]}...")

# Create a task
task_response = requests.post(
    "http://localhost:8000/api/v1/tasks",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "title": "Test Task in NeonDB",
        "description": "This task is stored in PostgreSQL NeonDB",
        "priority": "high"
    }
)

print(f"\nTask Creation Status: {task_response.status_code}")
print(f"Response Text: {task_response.text}")
if task_response.status_code == 201:
    print(f"Response JSON: {task_response.json()}")

# Get all tasks
tasks_response = requests.get(
    "http://localhost:8000/api/v1/tasks",
    headers={"Authorization": f"Bearer {token}"}
)

print(f"\nAll Tasks: {tasks_response.json()}")
