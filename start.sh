#!/bin/bash
set -e

echo "Starting Orchitek services..."

# Start nginx in the background
echo "Starting nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# Wait a bit for nginx to start
sleep 2

# Start FastAPI backend
echo "Starting FastAPI backend..."
cd /app/backend
python -m uvicorn server:app --host 127.0.0.1 --port 8000

# Cleanup on exit
trap "kill $NGINX_PID" EXIT
