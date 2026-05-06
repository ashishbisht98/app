#!/bin/bash

echo "Starting Orchitek services..."

# Start FastAPI in the background
cd /app/backend
echo "Starting FastAPI backend on port 8000..."
python -m uvicorn server:app --host 0.0.0.0 --port 8000 > /tmp/fastapi.log 2>&1 &
FASTAPI_PID=$!

# Wait for FastAPI to start
sleep 3

# Start nginx in foreground (this will block)
echo "Starting nginx on port 3000..."
echo "Frontend location: /app/frontend/build"
ls -la /app/frontend/build/ 2>&1 | head -5
exec nginx -g 'daemon off;'
