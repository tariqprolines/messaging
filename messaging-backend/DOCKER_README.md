# Backend Docker

Use the **root** project Compose file (not this folder’s old compose files):

```bash
cd /var/www/html/messaging
docker compose -f docker-compose.dev.yml up --build
```

- **Production image**: `Dockerfile`
- **Development image**: `Dockerfile.dev` (hot reload, used by root `docker-compose.dev.yml`)

Celery worker command (correct):

```bash
celery -A app.tasks.celery_app worker --loglevel=info
```
