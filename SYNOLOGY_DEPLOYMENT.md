# Smart Grocery Housekeeping - Synology NAS Deployment Guide

## 🚀 Quick Deployment on Synology NAS

This guide will help you deploy the Smart Grocery Housekeeping application on your Synology NAS using Docker.

### Prerequisites

1. **Synology NAS with Docker package installed**
   - DSM 7.0 or later
   - Docker package from Package Center
   - At least 2GB RAM recommended
   - 1GB free storage space

2. **SSH access to your NAS** (optional but recommended)
   - Enable SSH in Control Panel > Terminal & SNMP

### 📋 Deployment Steps

#### Step 1: Enable Docker on Synology

1. Open **Package Center** on your Synology DSM
2. Search for and install **Docker**
3. Open **Docker** from the main menu

#### Step 2: Prepare the Application

1. **What files to upload** (see [DEPLOYMENT_FILES.md](DEPLOYMENT_FILES.md) for details):
   ```bash
   # REQUIRED: Copy these folders/files to your NAS
   api/                     # Complete backend folder
   frontend/                # Complete frontend folder  
   nginx/                   # Reverse proxy config (includes Dockerfile)
   docker-compose*.yml      # All deployment configs
   .env.example            # Environment template
   deploy-synology.sh      # Deployment script
   quick-fix-typescript.sh # TypeScript error fix script
   .dockerignore           # Build optimization
   
   # SKIP: Don't copy these (waste space/time)
   .git/                   # Git repository  
   node_modules/           # Node dependencies
   .venv/ or venv/         # Python virtual environment
   .pytest_cache/          # Test cache
   __pycache__/           # Python cache
   ```

2. **Upload methods**:

   **Option A: File Station (Easiest)**
   - Create folder: `/docker/smart-grocery-housekeeping`
   - Upload only the required files/folders listed above
   - Skip the unnecessary files to save time and space

   **Option B: SCP (Command line)**
   ```bash
   # Create archive excluding unnecessary files
   tar -czf smart-grocery-deploy.tar.gz \
     --exclude='.git' --exclude='node_modules' --exclude='.venv' \
     --exclude='venv' --exclude='.pytest_cache' --exclude='__pycache__' \
     api/ frontend/ nginx/ *.yml *.sh .env.example .dockerignore
   
   # Upload to NAS
   scp smart-grocery-deploy.tar.gz admin@your-synology-ip:/volume1/docker/
   
   # SSH and extract
   ssh admin@your-synology-ip
   cd /volume1/docker/
   tar -xzf smart-grocery-deploy.tar.gz
   mv smart-grocery-housekeeping smart-grocery-housekeeping  # if needed
   ```

3. **SSH into your NAS**:
   ```bash
   ssh admin@your-synology-ip
   cd /volume1/docker/Smart-Grocery-Housekeeping
   ```

#### Step 3: Configure Environment

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the .env file** with your settings:
   
   **Option A: Use the setup helper (easiest)**
   ```bash
   ./setup-env.sh
   # Follow the interactive prompts
   ```
   
   **Option B: Using vi (available on all Synology systems)**
   ```bash
   vi .env
   # Press 'i' to enter insert mode
   # Edit the values (see below)
   # Press 'Esc' then type ':wq' and press Enter to save and exit
   ```
   
   **Option C: Using File Station (easiest for beginners)**
   - Open DSM File Station
   - Navigate to `/docker/smart-grocery-housekeeping/`
   - Right-click `.env` file → Edit (or double-click to open)
   - Edit in the built-in text editor
   
   **Option D: Create file manually**
   ```bash
   cat > .env << EOF
   JWT_SECRET_KEY=your-unique-secret-key-here
   VITE_API_URL=http://YOUR_NAS_IP:5000
   TZ=America/Los_Angeles
   EOF
   ```
   
   **Required values to update**:
   ```env
   JWT_SECRET_KEY=your-unique-secret-key-here
   VITE_API_URL=http://YOUR_NAS_IP:5000
   ```
   
   > **Note:** The frontend will be accessible on port 8080, but the API remains on port 5000.

#### Step 4: Deploy with Docker Compose

1. **Using SSH** (Recommended):
   ```bash
   cd /volume1/docker/smart-grocery-housekeeping
   
   # Option A: Safe deployment (RECOMMENDED - most reliable, direct access)
   sudo docker-compose -f docker-compose.safe.yml up -d
   
   # Option B: Full deployment with nginx reverse proxy 
   sudo docker-compose -f docker-compose.full.yml up -d
   
   # Option C: Alternative minimal deployment 
   sudo docker-compose -f docker-compose.minimal.yml up -d
   
   # Option D: Simple deployment 
   sudo docker-compose -f docker-compose.simple.yml up -d
   
   # Option E: Original deployment 
   sudo docker-compose up -d
   
   # Option D: Use automated fix script if build fails
   ./fix-frontend-build.sh
   ```

2. **Using Synology Docker GUI**:
   - Open Docker app
   - Go to **Project** tab
   - Click **Create**
   - Select your project folder
   - Choose `docker-compose.yml`
   - Click **Next** and **Apply**

#### Step 5: Verify Deployment

1. **Check container status**:
   ```bash
   docker-compose ps
   ```

2. **Access the application**:
   
   **Safe deployment** (docker-compose.safe.yml):
   - Frontend: `http://YOUR_NAS_IP:8080`
   - API: `http://YOUR_NAS_IP:5000`
   
   **Full deployment with nginx** (docker-compose.full.yml):
   - Full app (via nginx): `http://YOUR_NAS_IP:8080`
   - API: `http://YOUR_NAS_IP:8080/api/`
   
   **Simple deployment** (docker-compose.simple.yml):
   - Frontend: `http://YOUR_NAS_IP:3000`
   - API: `http://YOUR_NAS_IP:5000`

### 🔧 Configuration Options

#### Option 1: Simple Deployment (Recommended)
- Uses SQLite database (included)
- Single NAS deployment
- No external dependencies

#### Option 2: Advanced Deployment
- PostgreSQL database
- SSL/HTTPS support
- Domain name setup

### 🛠️ Management Commands

#### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart api

# View logs
docker-compose logs -f api
docker-compose logs -f frontend
```

#### Database Management
```bash
# Access the API container
docker-compose exec api bash

# Run database migrations
docker-compose exec api flask db upgrade

# Create a backup
docker-compose exec api cp /app/app.db /app/backup-$(date +%Y%m%d).db
```

### 📊 Monitoring

#### Health Checks
- API Health: `http://YOUR_NAS_IP:5000/api/health`
- Container Status: Check Docker app in DSM

#### Logs
```bash
# Real-time logs
docker-compose logs -f

# Service-specific logs
docker-compose logs api
docker-compose logs frontend
docker-compose logs nginx
```

### 🔒 Security Considerations

1. **Change default JWT secret**:
   ```env
   JWT_SECRET_KEY=your-very-secure-random-key
   ```

2. **Enable firewall rules** in DSM:
   - Control Panel > Security > Firewall
   - Allow ports 80, 3000, 5000 (or configure as needed)

3. **Use HTTPS** (optional):
   - Configure reverse proxy in DSM
   - Or modify nginx configuration for SSL

### 🚨 Troubleshooting

> **⚡ Quick Fix for TypeScript Build Errors (TS6133, TS2307, etc.):**
> ```bash
> # If you get "error TS6133: 'variable' is declared but its value is never read"
> # Or "failed to read dockerfile" - Use the safe deployment:
> sudo docker-compose -f docker-compose.safe.yml build --no-cache
> sudo docker-compose -f docker-compose.safe.yml up -d
> ```

#### Synology-Specific Notes

1. **Text editors available**:
   - `vi` - Always available (use `i` to edit, `Esc` then `:wq` to save)
   - File Station - DSM web interface (easiest for beginners)
   - No `nano` or `emacs` by default

2. **Common Synology paths**:
   ```bash
   /volume1/docker/          # Main docker directory
   /usr/local/bin/docker     # Docker binary location
   /var/services/homes/      # User home directories
   ```

3. **Docker commands on Synology**:
   ```bash
   # Most Docker commands need sudo on Synology
   sudo docker-compose up -d
   sudo docker-compose down
   sudo docker-compose ps
   sudo docker-compose logs -f
   
   # Alternative: Full path with sudo
   sudo /usr/local/bin/docker-compose up -d
   
   # Check if user is in docker group
   groups $USER
   
   # Add user to docker group (requires admin/root)
   sudo usermod -aG docker $USER
   # Then logout and login again
   ```

4. **Permission fixes**:
   ```bash
   # Fix Docker daemon permissions (run as admin)
   sudo chmod 666 /var/run/docker.sock
   
   # Or add user to docker group permanently
   sudo usermod -aG docker $(whoami)
   # Logout and login again for group changes to take effect
   ```

#### Common Issues

1. **Permission denied errors**:
   ```bash
   # Solution 1: Use sudo (most common fix)
   sudo docker-compose up -d
   
   # Solution 2: Fix docker socket permissions
   sudo chmod 666 /var/run/docker.sock
   
   # Solution 3: Add user to docker group
   sudo usermod -aG docker $USER
   # Then logout and login again
   
   # Check if fix worked
   docker ps
   ```

2. **Port conflicts** (Error: "bind: address already in use"):
   ```bash
   # Port 80 is often used by Synology DSM - this is normal!
   
   # SOLUTION 1: Stop current containers and use safe deployment (uses port 8080)
   sudo docker-compose down
   sudo docker-compose -f docker-compose.safe.yml up -d
   # Access at: http://YOUR_NAS_IP:8080
   
   # SOLUTION 2: Check what's using the ports
   netstat -tlnp | grep :80
   netstat -tlnp | grep :3000
   netstat -tlnp | grep :5000
   
   # SOLUTION 3: Use different ports entirely
   sudo docker-compose -f docker-compose.ports.yml up -d
   ```

2. **Frontend build issues**:
   ```bash
   # If you see TypeScript errors during frontend build (TS6133, TS2307, etc.):
   
   # SOLUTION 1: Use minimal deployment (RECOMMENDED)
   sudo docker-compose down
   sudo docker system prune -af
   sudo docker-compose -f docker-compose.minimal.yml build --no-cache
   sudo docker-compose -f docker-compose.minimal.yml up -d
   
   # SOLUTION 2: Use simple deployment
   sudo docker-compose -f docker-compose.simple.yml build --no-cache
   sudo docker-compose -f docker-compose.simple.yml up -d
   
   # SOLUTION 3: Clean everything first, then try full deployment
   sudo docker-compose down
   sudo docker system prune -af
   sudo docker volume prune -f
   sudo docker-compose build --no-cache
   sudo docker-compose up -d
   
   # Alternative: Run the automated fix script
   ./fix-frontend-build.sh
   
   # If still failing: Check if files are properly uploaded
   ls -la frontend/package.json
   cat frontend/package.json | grep '"build"'
   # Should show: "build": "vite build" (NOT "tsc -b && vite build")
   ```

3. **Port conflicts**:
   ```bash
   # Reset database
   docker-compose down
   rm api/app.db
   docker-compose up -d
   ```

3. **Permission issues**:
   ```bash
   # Fix file permissions
   sudo chown -R 1000:1000 /volume1/docker/Smart-Grocery-Housekeeping
   ```

#### Logs and Debugging
```bash
# Check container logs
docker-compose logs api
docker-compose logs frontend

# Access container shell
docker-compose exec api bash
docker-compose exec frontend sh
```

### 📈 Performance Tips

1. **Resource allocation**:
   - Minimum 2GB RAM
   - Monitor CPU usage in DSM

2. **Storage optimization**:
   - Store database on SSD if available
   - Regular cleanup of Docker images

3. **Network optimization**:
   - Use wired connection for NAS
   - Consider dedicated VLAN for Docker

### 🔄 Updates

#### Update the application:
```bash
# Pull latest code
git pull origin main

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

#### Update dependencies:
```bash
# Update Python packages
docker-compose exec api pip install -r requirements.txt

# Update Node packages
docker-compose build frontend --no-cache
```

### 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify network connectivity
3. Ensure all ports are available
4. Check Synology resource usage
5. Review firewall settings

### 📱 Mobile Access

To access from mobile devices:
1. Use your NAS's QuickConnect ID
2. Set up DDNS in DSM
3. Configure port forwarding on your router
4. Access via: `http://your-nas-domain:3000`

---

**Happy cooking and smart grocery management! 🥘📱**
