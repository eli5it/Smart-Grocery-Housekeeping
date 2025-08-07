#!/bin/bash
cd /app/api
export FLASK_APP=run.py
exec gunicorn --bind 0.0.0.0:5000 run:app