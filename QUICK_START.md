# Quick Start Guide

## Prerequisites

- Docker and Docker Compose installed
- Ports 8000, 5173, 5432, 6379 available

## Development Setup (Quick Start)

### Step 1: Navigate to Project Root
```bash
cd /var/www/html/messaging
```

### Step 2: Start All Services
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Step 4: Create Your First Account

1. Go to http://localhost:5173
2. Click "Sign up"
3. Fill in your email, password, and company name
4. You'll be automatically logged in

## Common Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Stop Services
```bash
docker-compose -f docker-compose.dev.yml down
```

### Restart a Service
```bash
docker-compose -f docker-compose.dev.yml restart backend
```

### Rebuild After Code Changes
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

## Troubleshooting

### Port Already in Use
If you get port conflicts, check what's using the ports:
```bash
# Check port 8000
sudo lsof -i :8000

# Check port 5173
sudo lsof -i :5173
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yml ps postgres

# View PostgreSQL logs
docker-compose -f docker-compose.dev.yml logs postgres
```

### Frontend Can't Connect to Backend
1. Check backend is running: http://localhost:8000/health
2. Check CORS configuration in docker-compose.dev.yml
3. Verify VITE_API_URL in frontend environment

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose -f docker-compose.dev.yml down -v

# Start fresh
docker-compose -f docker-compose.dev.yml up -d
```

## Next Steps

1. Create client contacts
2. Create message templates
3. Send your first message
4. Check the dashboard for statistics
