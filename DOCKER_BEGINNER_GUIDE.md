# Docker Guide for Messaging Portal (Beginners)

This project has two apps:

| Folder | Technology | Role |
|--------|------------|------|
| `messaging-backend` | FastAPI + PostgreSQL + Redis + Celery | API and background jobs |
| `messaging-frontend` | React (Vite) | Web UI |

Docker runs each part in a **container** (a small isolated environment). **Docker Compose** starts all containers together with one command.

---

## What you need installed

1. [Docker Engine](https://docs.docker.com/engine/install/) (Linux) or [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac)
2. Verify:

```bash
docker --version
docker compose version
```

---

## Project layout (Docker files)

```
messaging/
├── docker-compose.dev.yml      ← Start here (development)
├── docker-compose.prod.yml     ← Production
├── messaging-backend/
│   ├── Dockerfile              ← Production API image
│   ├── Dockerfile.dev          ← Development API (hot reload)
│   └── .env.docker.example     ← Env vars when API runs in Docker
└── messaging-frontend/
    ├── Dockerfile              ← Production (nginx + built React)
    ├── Dockerfile.dev          ← Development (Vite dev server)
    └── .env.docker.example     ← Env for browser → API URL
```

---

## How the pieces connect

```
┌─────────────────────────────────────────────────────────────┐
│  Your browser (on your PC)                                   │
│  http://localhost:5173  →  Frontend container              │
│  http://localhost:8000  →  Backend container (API)           │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │                              ├──► postgres (database)
         │                              ├──► redis (queue)
         │                              └──► celery-worker (sends messages)
```

Inside Docker, services talk by **service name** (`postgres`, `redis`).  
Your **browser** always uses **localhost** and the **published ports** (5173, 8000).

---

## Step-by-step: run everything with Docker (development)

### Step 1 — Open the project root

```bash
cd /var/www/html/messaging
```

All `docker compose` commands run from this folder.

### Step 2 — (Optional) Prepare environment files

Docker Compose sets most variables for you. For local overrides:

```bash
# Backend (only if you run backend outside compose)
cp messaging-backend/.env.docker.example messaging-backend/.env

# Frontend — API URL must be reachable from YOUR browser
cp messaging-frontend/.env.docker.example messaging-frontend/.env
```

For Compose dev, `VITE_API_URL=http://localhost:8000` is already set in `docker-compose.dev.yml`.

### Step 3 — Build and start all services

```bash
docker compose -f docker-compose.dev.yml up --build
```

- First run downloads images and installs dependencies (several minutes).
- Leave this terminal open to see logs.
- Or run in background:

```bash
docker compose -f docker-compose.dev.yml up --build -d
```

### Step 4 — Check that containers are running

```bash
docker compose -f docker-compose.dev.yml ps
```

You should see: `postgres`, `redis`, `backend`, `celery-worker`, `frontend` — all **running** or **healthy**.

### Step 5 — Open the app

| What | URL |
|------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| API docs (Swagger) | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |

### Step 6 — Sign up and test

1. Open http://localhost:5173  
2. Sign up / log in  
3. Add a client, send a message  

Messages are queued in **Redis** and processed by **celery-worker**.

### Step 7 — View logs

```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# One service
docker compose -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.dev.yml logs -f celery-worker
```

### Step 8 — Stop everything

```bash
docker compose -f docker-compose.dev.yml down
```

Remove database data too:

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## Common commands (cheat sheet)

| Task | Command |
|------|---------|
| Start (foreground) | `docker compose -f docker-compose.dev.yml up --build` |
| Start (background) | `docker compose -f docker-compose.dev.yml up --build -d` |
| Stop | `docker compose -f docker-compose.dev.yml down` |
| Restart one service | `docker compose -f docker-compose.dev.yml restart backend` |
| Rebuild after code change | `docker compose -f docker-compose.dev.yml up --build -d` |
| Shell inside backend | `docker compose -f docker-compose.dev.yml exec backend bash` |
| Run DB migrations | `docker compose -f docker-compose.dev.yml exec backend alembic upgrade head` |

---

## Two ways to develop

### A) Everything in Docker (recommended for beginners)

- One command starts DB, Redis, API, Celery, and frontend.
- Use `docker-compose.dev.yml` from project root.
- Edit code on your machine; dev containers reload (backend + Vite).

### B) Backend on your PC, only DB/Redis in Docker

```bash
cd /var/www/html/messaging
docker compose -f docker-compose.dev.yml up -d postgres redis
```

In `messaging-backend/.env` use:

```env
DATABASE_URL=postgresql://messaging_user:messaging_password@localhost:5432/messaging_db
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

Then:

```bash
cd messaging-backend
uvicorn app.main:app --reload
# Another terminal:
celery -A app.tasks.celery_app worker --loglevel=info
```

Frontend: `cd messaging-frontend && npm run dev`

---

## Production (overview)

```bash
cd /var/www/html/messaging
# Set variables in .env (see docker-compose.prod.yml)
docker compose -f docker-compose.prod.yml up -d --build
```

Frontend is served by **nginx** on port 3000 (default). Backend on port 8000.

---

## Troubleshooting

### Port already in use

Change ports in `docker-compose.dev.yml`, for example:

```yaml
ports:
  - "8001:8000"   # backend → use http://localhost:8001 in browser
```

Update `VITE_API_URL` for the frontend to match the new backend port.

### `Temporary failure in name resolution` for Redis

Backend is using hostname `redis` but not running inside Docker.  
Either run full Compose stack, or set `REDIS_URL=redis://localhost:6379/0` in `.env`.

### Message status `failed` immediately

- Ensure **celery-worker** container is running.
- Ensure **redis** is healthy.
- Check: `docker compose -f docker-compose.dev.yml logs celery-worker`

### CORS errors from frontend

Backend must allow `http://localhost:5173` in `CORS_ORIGINS` (already set in compose).

### Database connection refused

Wait until `postgres` is healthy, then restart backend:

```bash
docker compose -f docker-compose.dev.yml restart backend
```

---

## What each Dockerfile does

### `messaging-backend/Dockerfile` (production)

- Python 3.11, installs dependencies, runs API as non-root user.
- Command: `uvicorn` without `--reload`.

### `messaging-backend/Dockerfile.dev` (development)

- Same stack, runs `uvicorn --reload` for code changes.

### `messaging-frontend/Dockerfile` (production)

- Builds React with `npm run build`, serves static files with **nginx**.

### `messaging-frontend/Dockerfile.dev` (development)

- Runs `npm run dev` (Vite) on port **5173**.

---

## Next steps

1. Run `docker compose -f docker-compose.dev.yml up --build` from project root.  
2. Open http://localhost:5173 and test signup/login.  
3. Read logs if something fails: `docker compose -f docker-compose.dev.yml logs -f`.

For more detail, see also `DOCKER_SETUP.md` and `DOCKER_REVIEW.md` in this folder.
