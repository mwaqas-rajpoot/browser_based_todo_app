#!/bin/bash

# Test Runner Script for Todo Application
# This script runs all tests for both frontend and backend

set -e  # Exit on error

echo "=========================================="
echo "Todo Application - Test Runner"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Backend Tests
echo "=========================================="
echo "Running Backend Tests"
echo "=========================================="
echo ""

cd backend

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    print_info "Creating Python virtual environment..."
    python -m venv .venv
fi

# Activate virtual environment
print_info "Activating virtual environment..."
source .venv/bin/activate || source .venv/Scripts/activate

# Install dependencies
print_info "Installing backend dependencies..."
pip install -r requirements.txt -q

# Run pytest
print_info "Running backend tests..."
if pytest tests/ -v --tb=short; then
    print_success "Backend tests passed!"
else
    print_error "Backend tests failed!"
    exit 1
fi

# Run specific test files
echo ""
print_info "Running API endpoint tests..."
if pytest tests/test_api_endpoints.py -v; then
    print_success "API endpoint tests passed!"
else
    print_error "API endpoint tests failed!"
fi

echo ""
print_info "Running integration tests..."
if pytest tests/test_integration_api.py -v; then
    print_success "Integration tests passed!"
else
    print_error "Integration tests failed!"
fi

# Generate coverage report
echo ""
print_info "Generating test coverage report..."
pytest tests/ --cov=src --cov-report=html --cov-report=term

cd ..

# Frontend Tests
echo ""
echo "=========================================="
echo "Running Frontend Tests"
echo "=========================================="
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
fi

# Run Jest tests
print_info "Running frontend tests..."
if npm test -- --passWithNoTests; then
    print_success "Frontend tests passed!"
else
    print_error "Frontend tests failed!"
    exit 1
fi

# Run tests with coverage
echo ""
print_info "Generating frontend test coverage..."
npm run test:coverage -- --passWithNoTests

cd ..

# Summary
echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
print_success "All tests completed successfully!"
echo ""
print_info "Backend coverage report: backend/htmlcov/index.html"
print_info "Frontend coverage report: frontend/coverage/index.html"
echo ""
echo "=========================================="
