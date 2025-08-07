#!/bin/bash

# Start Flask backend
gunicorn -b 127.0.0.1:5000 api.run:app &

# Start Nginx (this must stay in the foreground!)
nginx -g "daemon off;"