#!/bin/bash

echo "Starting Orchitek services..."

# Function to handle cleanup
cleanup() {
    echo "Shutting down services..."
    kill $NGINX_PID $FASTAPI_PID 2>/dev/null || true
    exit 0
}

# Set trap to handle shutdown signals
trap cleanup SIGTERM SIGINT

# Start nginx in the background
echo "Starting nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# Wait for nginx to start
sleep 1

# Start FastAPI backend in the background
echo "Starting FastAPI backend..."
cd /app/backend
python -m uvicorn server:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

echo "All services started. Monitoring..."

# Keep the container running and monitor both processes
while true; do
    # Check if either process has died
    if ! kill -0 $NGINX_PID 2>/dev/null; then
        echo "ERROR: nginx has died"
        cleanup
    fi
    if ! kill -0 $FASTAPI_PID 2>/dev/null; then
        echo "ERROR: FastAPI has died"
        cleanup
    fi
    sleep 5
done
