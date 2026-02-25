@echo off
REM Test Runner Script for Todo Application (Windows)
REM This script runs all tests for both frontend and backend

echo ==========================================
echo Todo Application - Test Runner
echo ==========================================
echo.

REM Check if we're in the project root
if not exist "backend" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)
if not exist "frontend" (
    echo Error: Please run this script from the project root directory
    exit /b 1
)

REM Backend Tests
echo ==========================================
echo Running Backend Tests
echo ==========================================
echo.

cd backend

REM Check if virtual environment exists
if not exist ".venv" (
    echo Creating Python virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt -q

REM Run pytest
echo Running backend tests...
pytest tests/ -v --tb=short
if %errorlevel% neq 0 (
    echo Backend tests failed!
    exit /b 1
)
echo Backend tests passed!

REM Run specific test files
echo.
echo Running API endpoint tests...
pytest tests/test_api_endpoints.py -v
if %errorlevel% neq 0 (
    echo API endpoint tests failed!
)

echo.
echo Running integration tests...
pytest tests/test_integration_api.py -v
if %errorlevel% neq 0 (
    echo Integration tests failed!
)

REM Generate coverage report
echo.
echo Generating test coverage report...
pytest tests/ --cov=src --cov-report=html --cov-report=term

cd ..

REM Frontend Tests
echo.
echo ==========================================
echo Running Frontend Tests
echo ==========================================
echo.

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Run Jest tests
echo Running frontend tests...
call npm test -- --passWithNoTests
if %errorlevel% neq 0 (
    echo Frontend tests failed!
    exit /b 1
)
echo Frontend tests passed!

REM Run tests with coverage
echo.
echo Generating frontend test coverage...
call npm run test:coverage -- --passWithNoTests

cd ..

REM Summary
echo.
echo ==========================================
echo Test Summary
echo ==========================================
echo All tests completed successfully!
echo.
echo Backend coverage report: backend\htmlcov\index.html
echo Frontend coverage report: frontend\coverage\index.html
echo.
echo ==========================================
