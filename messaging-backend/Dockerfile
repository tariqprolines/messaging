FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create non-root user and install system deps
RUN useradd -m appuser && \
    apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        postgresql-client \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Change ownership
RUN chown -R appuser:appuser /app

# Switch user
USER appuser

EXPOSE 8000

# Production-grade server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]