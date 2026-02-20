#!/bin/bash
# Quick start script for Docker Compose

cd "$(dirname "$0")"
echo "Starting messaging portal services..."
docker-compose -f docker-compose.dev.yml up -d
echo ""
echo "Services started!"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "Stop services: docker-compose -f docker-compose.dev.yml down"
