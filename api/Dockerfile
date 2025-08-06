# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for database
RUN mkdir -p /app/instance

# Set environment variables
ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Expose port
EXPOSE 5000

# Add health check endpoint
RUN echo "from flask import Flask, jsonify\nfrom app import create_app\napp = create_app()\n@app.route('/api/health')\ndef health():\n    return jsonify({'status': 'healthy'}), 200" >> health_check.py

# Create startup script
RUN echo '#!/bin/bash\n\
# Initialize database if it does not exist\n\
if [ ! -f /app/app.db ]; then\n\
    echo "Initializing database..."\n\
    flask db upgrade\n\
fi\n\
\n\
# Start the Flask application\n\
echo "Starting Flask application..."\n\
exec gunicorn -w 4 -b 0.0.0.0:5000 "run:app"' > /app/start.sh

# Make startup script executable
RUN chmod +x /app/start.sh

# Install gunicorn for production
RUN pip install gunicorn

# Run the startup script
CMD ["/app/start.sh"]
