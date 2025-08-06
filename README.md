# Smart Grocery Housekeeping

A smart web application for managing your pantry, reducing waste, and discovering recipe ideas — powered by a React frontend and Flask backend.

## 🚀 Quickstart

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Create Python Virtual Environment

```bash
cd api
python -m venv venv
```

### Activate the Environment

**macOS/Linux:**

```bash
source venv/bin/activate
```

**Windows (CMD):**

```bash
venv\Scripts\activate
```

### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### Create a .flaskenv File

In the `api/` directory, create a `.flaskenv` file with the following contents:

```text
FLASK_APP=run.py
FLASK_ENV=development
```

## 🛠️ Development Workflow

### Run Frontend Dev Server

```bash
cd frontend
npm run dev
```

### Run API Server

```bash
cd api
flask run
```

**Note:** Ensure your Python virtual environment is activated before running the API server.

## 🚀 Production Deployment

### Docker Deployment (Recommended)

The easiest way to deploy this application is using Docker:

```bash
# Standard deployment (API + Frontend)
docker-compose up -d

# Alternative port deployment (avoids port conflicts on Synology NAS)
docker-compose -f docker-compose.freeports.yml up -d
```

### Synology NAS Deployment

For detailed Synology NAS deployment instructions, see [SYNOLOGY_DEPLOYMENT.md](SYNOLOGY_DEPLOYMENT.md).

Quick setup:
```bash
# Use the port-safe configuration to avoid conflicts with DSM
docker-compose -f docker-compose.freeports.yml up -d

# Access your app:
# Internal: http://YOUR_NAS_IP:8080
# API: http://YOUR_NAS_IP:8001
```

## ✅ Running Tests

### Frontend Tests

```bash
cd frontend
npm run test
```

### Backend Tests

```bash
cd api
pytest
```

## 📁 Project Structure

```
frontend/  # React frontend
api/       # Flask backend
```

## 📄 License

Licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
