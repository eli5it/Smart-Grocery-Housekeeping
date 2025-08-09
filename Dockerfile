# === Stage 1: Build frontend ===
FROM node:22 AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# === Stage 2: Backend only ===
FROM python:3.11-slim

WORKDIR /app

COPY ./api /app/api
COPY --from=frontend-builder /app/dist /app/api/dist

RUN pip install --upgrade pip
RUN pip install -r /app/api/requirements.txt

# Add this to make `from app import ...` work
ENV PYTHONPATH=/app/api

WORKDIR /app/api

# Default command - will be overridden by docker-compose
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]