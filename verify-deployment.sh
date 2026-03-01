#!/bin/bash

# Production Deployment Verification Script
# Run this before deploying to Railway

echo "=================================="
echo "Production Deployment Verification"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Check function
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((FAILED++))
    fi
}

echo "1. Checking Backend Files..."
echo "----------------------------"

# Check Procfile
if [ -f "backend/Procfile" ]; then
    check 0 "Procfile exists"
    if grep -q "uvicorn src.main:app --host 0.0.0.0 --port \$PORT" backend/Procfile; then
        check 0 "Procfile has correct command"
    else
        check 1 "Procfile command incorrect"
    fi
else
    check 1 "Procfile missing"
fi

# Check requirements.txt
if [ -f "backend/requirements.txt" ]; then
    check 0 "requirements.txt exists"

    if grep -q "psycopg2-binary" backend/requirements.txt; then
        check 0 "psycopg2-binary in requirements"
    else
        check 1 "psycopg2-binary missing"
    fi

    if grep -q "passlib\[bcrypt\]" backend/requirements.txt; then
        check 0 "passlib[bcrypt] in requirements"
    else
        check 1 "passlib[bcrypt] missing"
    fi

    if grep -q "python-dotenv" backend/requirements.txt; then
        check 0 "python-dotenv in requirements"
    else
        check 1 "python-dotenv missing"
    fi
else
    check 1 "requirements.txt missing"
fi

# Check .env.railway.example
if [ -f "backend/.env.railway.example" ]; then
    check 0 ".env.railway.example exists"
else
    check 1 ".env.railway.example missing"
fi

echo ""
echo "2. Checking Database Configuration..."
echo "-------------------------------------"

# Check database.py for PostgreSQL only
if [ -f "backend/src/database/database.py" ]; then
    check 0 "database.py exists"

    if grep -q "Only PostgreSQL databases are supported" backend/src/database/database.py; then
        check 0 "PostgreSQL-only enforcement found"
    else
        check 1 "PostgreSQL-only enforcement missing"
    fi

    if ! grep -q "sqlite" backend/src/database/database.py; then
        check 0 "No SQLite references"
    else
        check 1 "SQLite references still present"
    fi
else
    check 1 "database.py missing"
fi

echo ""
echo "3. Checking Security Configuration..."
echo "-------------------------------------"

# Check CORS middleware
if [ -f "backend/src/middleware/cors.py" ]; then
    check 0 "cors.py exists"

    if grep -q "ENVIRONMENT" backend/src/middleware/cors.py; then
        check 0 "Environment-based CORS configuration"
    else
        check 1 "Environment-based CORS missing"
    fi
else
    check 1 "cors.py missing"
fi

# Check auth service
if [ -f "backend/src/services/auth.py" ]; then
    check 0 "auth.py exists"

    if grep -q "validate_password_strength" backend/src/services/auth.py; then
        check 0 "Password strength validation found"
    else
        check 1 "Password strength validation missing"
    fi

    if grep -q 'schemes=\["bcrypt"\]' backend/src/services/auth.py; then
        check 0 "Bcrypt-only hashing configured"
    else
        check 1 "Bcrypt-only hashing not configured"
    fi
else
    check 1 "auth.py missing"
fi

echo ""
echo "4. Checking Frontend Updates..."
echo "--------------------------------"

# Check register page
if [ -f "frontend/src/app/register/page.tsx" ]; then
    check 0 "register/page.tsx exists"

    if grep -q "copyToClipboard" frontend/src/app/register/page.tsx; then
        check 0 "Copy password functionality found"
    else
        check 1 "Copy password functionality missing"
    fi

    if grep -q "fetchWithRetry" frontend/src/app/register/page.tsx; then
        check 0 "Network retry logic found"
    else
        check 1 "Network retry logic missing"
    fi

    if grep -q "Password must be at least 8 characters" frontend/src/app/register/page.tsx; then
        check 0 "Password validation found"
    else
        check 1 "Password validation missing"
    fi
else
    check 1 "register/page.tsx missing"
fi

echo ""
echo "5. Checking Documentation..."
echo "----------------------------"

[ -f "QUICK_START.md" ] && check 0 "QUICK_START.md exists" || check 1 "QUICK_START.md missing"
[ -f "RAILWAY_DEPLOYMENT.md" ] && check 0 "RAILWAY_DEPLOYMENT.md exists" || check 1 "RAILWAY_DEPLOYMENT.md missing"
[ -f "DEPLOYMENT_STRUCTURE.md" ] && check 0 "DEPLOYMENT_STRUCTURE.md exists" || check 1 "DEPLOYMENT_STRUCTURE.md missing"
[ -f "IMPLEMENTATION_SUMMARY.md" ] && check 0 "IMPLEMENTATION_SUMMARY.md exists" || check 1 "IMPLEMENTATION_SUMMARY.md missing"
[ -f "FOLDER_STRUCTURE.md" ] && check 0 "FOLDER_STRUCTURE.md exists" || check 1 "FOLDER_STRUCTURE.md missing"

echo ""
echo "6. Checking Alembic Configuration..."
echo "-------------------------------------"

if [ -f "backend/alembic/env.py" ]; then
    check 0 "alembic/env.py exists"

    if grep -q "load_dotenv()" backend/alembic/env.py; then
        check 0 "dotenv loading in alembic"
    else
        check 1 "dotenv loading missing in alembic"
    fi
else
    check 1 "alembic/env.py missing"
fi

echo ""
echo "=================================="
echo "Verification Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to deploy to Railway.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Production-ready deployment'"
    echo "3. git push origin main"
    echo "4. Deploy to Railway (see QUICK_START.md)"
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
