#!/bin/bash
# Start Messaging Portal with Docker (development)
set -e
cd "$(dirname "$0")"

echo "Starting Messaging Portal (Docker)..."
docker compose -f docker-compose.dev.yml up --build -d

echo ""
echo "Waiting for backend health..."
sleep 5
docker compose -f docker-compose.dev.yml ps

echo ""
echo "Ready:"
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "Logs:  docker compose -f docker-compose.dev.yml logs -f"
echo "Stop:  docker compose -f docker-compose.dev.yml down"
