#!/bin/bash

# Smart Grocery Housekeeping - Environment Setup Helper for Synology NAS
# This script helps create the .env file with proper values

set -e

echo "🔧 Smart Grocery Housekeeping - Environment Setup"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_prompt() {
    echo -e "${BLUE}[INPUT]${NC} $1"
}

# Check if .env already exists
if [ -f ".env" ]; then
    log_warn ".env file already exists!"
    echo "Current contents:"
    echo "----------------"
    cat .env
    echo "----------------"
    echo ""
    read -p "Do you want to recreate it? (y/N): " RECREATE
    if [[ ! "$RECREATE" =~ ^[Yy]$ ]]; then
        log_info "Keeping existing .env file. Exiting."
        exit 0
    fi
fi

# Get NAS IP address automatically
log_info "Detecting NAS IP address..."
NAS_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "")

if [ -z "$NAS_IP" ]; then
    # Fallback method
    NAS_IP=$(ip route get 8.8.8.8 2>/dev/null | awk '{print $7; exit}' || echo "192.168.1.100")
fi

log_info "Detected IP: $NAS_IP"

# Get user input
echo ""
log_prompt "Enter your JWT secret key (or press Enter for a generated one):"
read -r JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
    # Generate a random JWT secret
    JWT_SECRET=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1 2>/dev/null || echo "change-this-secret-key-$(date +%s)")
    log_info "Generated JWT secret: $JWT_SECRET"
fi

echo ""
log_prompt "Enter your NAS IP address (detected: $NAS_IP) [press Enter to use detected]:"
read -r USER_IP

if [ -n "$USER_IP" ]; then
    NAS_IP="$USER_IP"
fi

echo ""
log_prompt "Enter timezone (default: America/Los_Angeles):"
read -r TIMEZONE

if [ -z "$TIMEZONE" ]; then
    TIMEZONE="America/Los_Angeles"
fi

# Create the .env file
log_info "Creating .env file..."

cat > .env << EOF
# Smart Grocery Housekeeping - Production Environment Configuration
# Generated on $(date)

# JWT Secret Key - Keep this secure and unique
JWT_SECRET_KEY=$JWT_SECRET

# API URL for frontend - Update with your NAS IP
VITE_API_URL=http://$NAS_IP:5000

# Database configuration (SQLite by default)
DATABASE_URL=sqlite:///app.db

# Timezone
TZ=$TIMEZONE

# Optional: Uncomment and configure for PostgreSQL
# DATABASE_URL=postgresql://username:password@localhost:5432/smart_grocery
EOF

log_info "✅ .env file created successfully!"
echo ""
echo "📋 Configuration Summary:"
echo "  JWT Secret: $JWT_SECRET"
echo "  API URL: http://$NAS_IP:5000"
echo "  Timezone: $TIMEZONE"
echo "  Database: SQLite (default)"
echo ""
echo "🔍 File contents:"
echo "----------------"
cat .env
echo "----------------"
echo ""
log_info "You can now run: ./deploy-synology.sh"
echo ""
log_warn "💡 Tips:"
echo "  - Keep your JWT secret secure"
echo "  - Access your app at: http://$NAS_IP:3000"
echo "  - API health check: http://$NAS_IP:5000/api/health"
echo ""
