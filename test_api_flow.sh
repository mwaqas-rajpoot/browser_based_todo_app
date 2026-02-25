#!/bin/bash

echo "=== Todo App API Test Flow ==="
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
HEALTH=$(curl -s http://localhost:8000/health)
echo "Response: $HEALTH"
echo ""

# Test 2: Register User
echo "2. Testing User Registration..."
TIMESTAMP=$(date +%s)
REGISTER=$(curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"user$TIMESTAMP\",\"email\":\"user$TIMESTAMP@example.com\",\"password\":\"Test123456!\"}")
echo "Response: $REGISTER"
echo ""

# Extract email for login
EMAIL="user$TIMESTAMP@example.com"

# Test 3: Login
echo "3. Testing User Login..."
LOGIN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test123456!\"}")
echo "Response: $LOGIN"
echo ""

# Extract token
TOKEN=$(echo $LOGIN | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo "Extracted Token: ${TOKEN:0:50}..."
echo ""

# Test 4: Create Task
echo "4. Testing Task Creation..."
TASK=$(curl -s -X POST http://localhost:8000/api/v1/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Test Task\",\"description\":\"Testing API\",\"status\":\"todo\",\"priority\":\"high\"}")
echo "Response: $TASK"
echo ""

# Test 5: Get All Tasks
echo "5. Testing Get All Tasks..."
TASKS=$(curl -s -X GET http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $TASKS"
echo ""

# Test 6: Frontend Check
echo "6. Testing Frontend..."
FRONTEND=$(curl -s http://localhost:3002 | grep -o "<title>.*</title>" | head -1)
echo "Frontend Title: $FRONTEND"
echo ""

echo "=== Test Complete ==="
echo ""
echo "Summary:"
echo "- Backend: http://localhost:8000"
echo "- Frontend: http://localhost:3002"
echo "- Database: SQLite (todo_app.db)"
echo ""
