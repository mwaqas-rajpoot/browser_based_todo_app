#!/bin/bash
echo "Starting Backend Server..."
cd backend
source .venv/Scripts/activate
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
