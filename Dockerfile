# === Stage 1: Build frontend ===
FROM node:22 AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# === Stage 2: Backend + Nginx ===
FROM python:3.11-slim

# Install nginx
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Set workdir
WORKDIR /app
ENV PYTHONPATH=/app/api


# Copy backend
COPY api/ ./api/
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend build from previous stage
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: add entrypoint script if you need to populate DB or run migrations
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 80

# Run both services
CMD ["/entrypoint.sh"]
