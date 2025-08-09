#!/bin/bash
cd /app/api
export FLASK_APP=run.py
cp /app/api/app.db /tmp/app.db
exec gunicorn --bind 0.0.0.0:8080 run:app