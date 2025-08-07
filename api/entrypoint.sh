#!/bin/sh

flask db upgrade

# populate db with test data
python bulk_import.py

exec gunicorn -b 0.0.0.0:5000 run:app