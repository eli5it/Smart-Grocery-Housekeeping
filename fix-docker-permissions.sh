#!/bin/bash

# Quick Docker Permission Fix for Synology NAS
# Run this script if you get "permission denied" errors with Docker

echo "🔧 Docker Permission Fix for Synology NAS"
echo "========================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check current user
USER_NAME=$(whoami)
log_info "Current user: $USER_NAME"

# Test Docker access
log_info "Testing Docker access..."
if docker ps &>/dev/null; then
    log_info "✅ Docker works without sudo - no fix needed!"
    exit 0
elif sudo docker ps &>/dev/null; then
    log_warn "⚠️  Docker requires sudo access"
else
    log_error "❌ Docker daemon not accessible even with sudo"
    exit 1
fi

echo ""
echo "Choose a fix option:"
echo "1) Use sudo for all commands (recommended - no system changes)"
echo "2) Fix docker socket permissions (temporary - until reboot)"  
echo "3) Add user to docker group (permanent - requires logout/login)"
echo "4) Show manual commands only"
echo ""

read -p "Enter choice (1-4): " CHOICE

case $CHOICE in
    1)
        log_info "✅ No changes needed - just use sudo with Docker commands"
        echo ""
        echo "Use these commands:"
        echo "  sudo docker-compose up -d"
        echo "  sudo docker-compose down"
        echo "  sudo docker-compose logs -f"
        echo ""
        log_info "The deploy-synology.sh script will automatically use sudo"
        ;;
    2)
        log_info "Fixing docker socket permissions (temporary)..."
        if sudo chmod 666 /var/run/docker.sock; then
            log_info "✅ Fixed! Docker should work without sudo now"
            echo ""
            log_warn "⚠️  This fix is temporary and will reset after reboot"
            log_warn "⚠️  Use option 3 for a permanent fix"
        else
            log_error "❌ Failed to fix permissions"
        fi
        ;;
    3)
        log_info "Adding user '$USER_NAME' to docker group..."
        if sudo usermod -aG docker $USER_NAME; then
            log_info "✅ User added to docker group"
            echo ""
            log_warn "⚠️  You must LOGOUT and LOGIN again for this to take effect"
            log_warn "⚠️  After re-login, Docker commands will work without sudo"
            echo ""
            echo "To test after re-login:"
            echo "  docker ps"
            echo "  docker-compose --version"
        else
            log_error "❌ Failed to add user to docker group"
        fi
        ;;
    4)
        echo ""
        echo "Manual fix commands:"
        echo ""
        echo "Option A - Use sudo (easiest):"
        echo "  sudo docker-compose up -d"
        echo ""
        echo "Option B - Fix socket permissions (temporary):"
        echo "  sudo chmod 666 /var/run/docker.sock"
        echo ""
        echo "Option C - Add to docker group (permanent):"
        echo "  sudo usermod -aG docker $USER_NAME"
        echo "  # Then logout and login again"
        echo ""
        ;;
    *)
        log_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
log_info "You can now run: ./deploy-synology.sh"
echo ""
