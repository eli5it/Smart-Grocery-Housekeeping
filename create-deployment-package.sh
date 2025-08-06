#!/bin/bash

# Smart Grocery Housekeeping - Create Deployment Package
# This script creates a clean deployment package for Synology NAS

set -e

echo "📦 Creating Synology NAS Deployment Package"
echo "==========================================="

# Configuration
PACKAGE_NAME="smart-grocery-deploy-$(date +%Y%m%d-%H%M%S).tar.gz"
TEMP_DIR="smart-grocery-deployment"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Clean up any existing temp directory
if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
fi

# Create temporary directory structure
log_info "Creating deployment package structure..."
mkdir -p "$TEMP_DIR"

# Copy required files and directories
log_info "Copying application files..."

# Core application directories
cp -r api/ "$TEMP_DIR/"
cp -r frontend/ "$TEMP_DIR/"
cp -r nginx/ "$TEMP_DIR/"

# Configuration files
cp docker-compose.yml "$TEMP_DIR/"
cp docker-compose.simple.yml "$TEMP_DIR/"
cp .env.example "$TEMP_DIR/"
cp deploy-synology.sh "$TEMP_DIR/"
cp .dockerignore "$TEMP_DIR/"

# Documentation (optional but helpful)
cp SYNOLOGY_DEPLOYMENT.md "$TEMP_DIR/"
cp DEPLOYMENT_FILES.md "$TEMP_DIR/"
cp README.md "$TEMP_DIR/"

# Clean up any development artifacts in the copied files
log_info "Cleaning up development artifacts..."

# Remove Python cache files
find "$TEMP_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "*.pyc" -delete 2>/dev/null || true
find "$TEMP_DIR" -name "*.pyo" -delete 2>/dev/null || true

# Remove Node.js artifacts
find "$TEMP_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR" -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove development/build artifacts
rm -rf "$TEMP_DIR/api/app.db" 2>/dev/null || true
rm -rf "$TEMP_DIR/api/instance/" 2>/dev/null || true
rm -rf "$TEMP_DIR/frontend/.next/" 2>/dev/null || true

# Make deployment script executable
chmod +x "$TEMP_DIR/deploy-synology.sh"

# Create the archive
log_info "Creating deployment archive: $PACKAGE_NAME"
tar -czf "$PACKAGE_NAME" -C "$TEMP_DIR" .

# Clean up temp directory
rm -rf "$TEMP_DIR"

# Show results
PACKAGE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
log_info "Deployment package created successfully!"
echo ""
echo "📊 Package Details:"
echo "   File: $PACKAGE_NAME"
echo "   Size: $PACKAGE_SIZE"
echo ""
echo "🚀 Next Steps:"
echo "1. Upload $PACKAGE_NAME to your Synology NAS"
echo "2. Extract: tar -xzf $PACKAGE_NAME -C /volume1/docker/"
echo "3. Run: cd /volume1/docker/ && ./deploy-synology.sh"
echo ""
echo "📋 What's included:"
echo "   ✅ Core application (api/, frontend/, nginx/)"  
echo "   ✅ Docker configuration (docker-compose.yml)"
echo "   ✅ Deployment scripts (deploy-synology.sh)"
echo "   ✅ Documentation (*.md files)"
echo ""
echo "🚫 Excluded (saves space):"
echo "   ❌ Git repository (.git/)"
echo "   ❌ Node modules (node_modules/)"
echo "   ❌ Python virtual env (venv/, .venv/)"
echo "   ❌ Cache files (__pycache__/, .pytest_cache/)"
echo ""
log_warn "Remember to edit .env file with your settings after extraction!"
echo ""
