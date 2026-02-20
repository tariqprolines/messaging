# Docker Setup Guide

## Important: Working Directory

**All docker-compose commands must be run from the project root directory:**
```bash
cd /var/www/html/messaging
```

The `docker-compose.dev.yml` and `docker-compose.prod.yml` files are in the root directory, not in the backend or frontend subdirectories.

## Development Setup

### Using Docker Compose (Recommended)

1. **Navigate to project root:**
```bash
cd /var/www/html/messaging
```

2. **Start all services:**
```bash
docker-compose -f docker-compose.dev.yml up
```

2. **Start in background:**
```bash
cd /var/www/html/messaging
docker-compose -f docker-compose.dev.yml up -d
```

3. **View logs:**
```bash
cd /var/www/html/messaging
docker-compose -f docker-compose.dev.yml logs -f
```

4. **Stop services:**
```bash
cd /var/www/html/messaging
docker-compose -f docker-compose.dev.yml down
```

5. **Stop and remove volumes:**
```bash
cd /var/www/html/messaging
docker-compose -f docker-compose.dev.yml down -v
```

### Services

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **API Docs**: http://localhost:8000/docs

### Development Features

- Hot reload enabled for both frontend and backend
- Source code mounted as volumes
- Database and Redis data persisted in volumes

## Production Setup

1. **Navigate to project root:**
```bash
cd /var/www/html/messaging
```

2. **Create environment file:**
```bash
cp .env.docker.example .env
# Edit .env with your production values
```

3. **Build and start:**
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

4. **Run database migrations:**
```bash
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Production Features

- Optimized multi-stage builds
- No source code volumes (immutable containers)
- Multiple Celery worker replicas
- Health checks enabled
- Restart policies configured

## Individual Service Commands

### Backend Only
```bash
cd messaging-backend
docker build -t messaging-backend .
docker run -p 8000:8000 --env-file .env messaging-backend
```

### Frontend Only (Development)
```bash
cd messaging-frontend
docker build -f Dockerfile.dev -t messaging-frontend-dev .
docker run -p 5173:5173 messaging-frontend-dev
```

### Frontend Only (Production)
```bash
cd messaging-frontend
docker build --build-arg VITE_API_URL=http://your-api-url -t messaging-frontend .
docker run -p 3000:80 messaging-frontend
```

## Troubleshooting

### Port Already in Use
If ports are already in use, modify the port mappings in docker-compose files:
```yaml
ports:
  - "8001:8000"  # Change 8001 to available port
```

### Database Connection Issues
- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check database URL in environment variables
- Verify network connectivity between containers

### Frontend Can't Connect to Backend
- Check CORS_ORIGINS includes frontend URL
- Verify VITE_API_URL matches backend URL
- Check network connectivity

### Rebuild After Code Changes
```bash
# Rebuild specific service
docker-compose -f docker-compose.dev.yml build backend

# Rebuild all services
docker-compose -f docker-compose.dev.yml build

# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build
```

## Volume Management

### View volumes:
```bash
docker volume ls
```

### Remove volumes:
```bash
docker-compose -f docker-compose.dev.yml down -v
```

### Backup database:
```bash
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U messaging_user messaging_db > backup.sql
```

### Restore database:
```bash
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U messaging_user messaging_db < backup.sql
```
