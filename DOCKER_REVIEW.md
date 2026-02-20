# Docker Configuration Review & Updates

## Issues Found and Fixed

### ✅ 1. Backend Dockerfile
**Issue**: Missing `curl` for healthcheck
**Fixed**: Added `curl` to system dependencies

### ✅ 2. Frontend Development Setup
**Issue**: Using production build in development mode
**Fixed**: Created `Dockerfile.dev` for development with Vite dev server

### ✅ 3. Docker Compose Development
**Issues Found**:
- Frontend using production build with volumes (inconsistent)
- Missing CELERY_RESULT_BACKEND in celery-worker
- CORS_ORIGINS not properly configured
- Healthcheck tools missing (curl/wget)
- Frontend port mismatch (3000 vs 5173)

**Fixed**:
- Frontend now uses `Dockerfile.dev` for development
- Added CELERY_RESULT_BACKEND to celery-worker
- Updated CORS_ORIGINS to include all frontend URLs
- Added curl to backend, wget to frontend
- Changed frontend port to 5173 (Vite default)
- Added proper healthcheck start periods

### ✅ 4. CORS Configuration
**Issue**: CORS_ORIGINS as List[str] doesn't work with Docker environment variables
**Fixed**: Changed to string with comma-separated values and added property method to parse

### ✅ 5. Production Configuration
**Issue**: Missing production docker-compose file
**Fixed**: Created `docker-compose.prod.yml` with:
- Environment variable support
- Network isolation
- Multiple Celery worker replicas
- Proper build args for frontend
- Health checks
- Restart policies

## Updated Files

1. **messaging-backend/Dockerfile**
   - Added `curl` for healthcheck

2. **messaging-frontend/Dockerfile**
   - Added build arg for VITE_API_URL
   - Added wget for healthcheck

3. **messaging-frontend/Dockerfile.dev** (NEW)
   - Development-specific Dockerfile
   - Runs Vite dev server
   - Includes wget for healthcheck

4. **docker-compose.dev.yml**
   - Updated frontend to use Dockerfile.dev
   - Fixed port mapping (5173)
   - Added CELERY_RESULT_BACKEND
   - Updated CORS_ORIGINS
   - Added healthcheck start periods
   - Excluded venv from volume mount

5. **docker-compose.prod.yml** (NEW)
   - Production-ready configuration
   - Environment variable support
   - Network isolation
   - Scalable worker configuration

6. **app/core/config.py**
   - Changed CORS_ORIGINS to string
   - Added `cors_origins_list` property for parsing

7. **app/main.py**
   - Updated to use `cors_origins_list` property

## Configuration Summary

### Development (`docker-compose.dev.yml`)
- **Backend**: Port 8000, hot reload enabled
- **Frontend**: Port 5173, Vite dev server
- **PostgreSQL**: Port 5432
- **Redis**: Port 6379
- **Volumes**: Source code mounted for hot reload

### Production (`docker-compose.prod.yml`)
- **Backend**: Configurable port, optimized build
- **Frontend**: Port 3000 (configurable), production build
- **Network**: Isolated bridge network
- **Workers**: 2 Celery worker replicas
- **Volumes**: Only data volumes (no source code)

## Usage

### Development
```bash
docker-compose -f docker-compose.dev.yml up
```

### Production
```bash
# Set environment variables
cp .env.docker.example .env
# Edit .env with your values

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

## Verification Checklist

- ✅ Backend healthcheck works (curl installed)
- ✅ Frontend healthcheck works (wget installed)
- ✅ CORS properly configured for frontend URLs
- ✅ Development uses Vite dev server
- ✅ Production uses optimized build
- ✅ All environment variables properly set
- ✅ Database and Redis connections work
- ✅ Celery workers can connect to Redis
- ✅ Network isolation in production

## Notes

- Development mode uses volume mounts for hot reload
- Production mode uses immutable containers
- Health checks have proper start periods
- All services have restart policies in production
- Environment variables properly passed to containers
