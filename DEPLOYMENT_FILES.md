# Essential Files for Synology NAS Deployment

## ✅ **REQUIRED FILES** (Must copy to NAS)

### Core Application
```
api/                          # Complete backend folder
├── app/                      # Flask application code
├── migrations/              # Database migrations  
├── config.py               # Configuration
├── requirements.txt        # Python dependencies
├── run.py                  # Application entry point
└── Dockerfile              # Backend container config

frontend/                     # Complete frontend folder  
├── src/                     # React source code
├── public/                  # Static assets
├── package.json            # Node dependencies
├── package-lock.json       # Dependency lock file
├── vite.config.ts          # Build configuration
├── nginx.conf              # Frontend nginx config
└── Dockerfile              # Frontend container config

nginx/                        # Reverse proxy config
└── nginx.conf              # Nginx configuration

docker-compose.yml           # Main deployment config
docker-compose.simple.yml    # Alternative simple config
.env.example                 # Environment template
.dockerignore               # Docker build optimization
deploy-synology.sh          # Deployment script
```

## ❌ **SKIP THESE** (Don't copy to NAS)

### Development Files
```
.git/                        # Git repository (large, not needed)
.github/                     # GitHub workflows
.vscode/                     # VS Code settings
.pytest_cache/              # Test cache
node_modules/               # Node dependencies (will be installed in container)
venv/                       # Python virtual environment
.venv/                      # Alternative venv name
__pycache__/               # Python cache files
```

### Documentation & Metadata
```
README.md                   # Optional (for reference only)
SYNOLOGY_DEPLOYMENT.md     # Optional (for reference only)
LICENSE                    # Optional
requirements.txt           # Only if not in api/ folder
```

### Generated/Temporary Files
```
api/app.db                 # Database file (will be created)
api/instance/              # Flask instance folder
frontend/dist/             # Built frontend (generated in container)
frontend/node_modules/     # Dependencies (installed in container)
```

## 📦 **Minimal Deployment Package**

If you want the absolute minimum, copy just these:

```
Smart-Grocery-Housekeeping/
├── api/                    # Entire folder
├── frontend/               # Entire folder  
├── nginx/                  # Entire folder
├── docker-compose.yml      # Main config
├── .env.example           # Environment template
├── .dockerignore          # Build optimization
└── deploy-synology.sh     # Deployment script
```

**Total size**: ~50-100MB (without node_modules, .git, etc.)

## 🚀 **Recommended Upload Methods**

### Method 1: Selective Upload via File Station
1. Create folder: `/docker/smart-grocery-housekeeping/`
2. Upload only the required folders/files listed above
3. Skip all the ❌ files

### Method 2: Archive and Upload
```bash
# Create deployment archive (excluding unnecessary files)
tar -czf smart-grocery-deploy.tar.gz \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.venv' \
  --exclude='venv' \
  --exclude='.pytest_cache' \
  --exclude='__pycache__' \
  --exclude='.vscode' \
  --exclude='api/app.db' \
  api/ frontend/ nginx/ *.yml *.sh .env.example .dockerignore

# Upload smart-grocery-deploy.tar.gz to NAS, then extract
```

### Method 3: Git Clone on NAS (if you have Git)
```bash
# SSH to NAS and clone (automatically excludes .git for deployment)
cd /volume1/docker/
git clone <your-repo> smart-grocery-housekeeping
cd smart-grocery-housekeeping
git checkout main  # or your deployment branch
```

## 💾 **Storage Requirements**
- **Source files**: ~50-100MB
- **Docker images**: ~1-2GB (downloaded during build)
- **Database**: Starts small, grows with usage
- **Total**: ~2-3GB for complete deployment
