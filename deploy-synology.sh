#!/bin/bash

# Smart Grocery Housekeeping - Synology Deployment Script
# This script automates the deployment process on Synology NAS

set -e

echo "🚀 Smart Grocery Housekeeping - Synology Deployment"
echo "=================================================="

# Configuration
PROJECT_NAME="smart-grocery-housekeeping"
DEPLOY_DIR="/volume1/docker/$PROJECT_NAME"
BACKUP_DIR="/volume1/docker/backups/$PROJECT_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null && ! command -v /usr/local/bin/docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker from Package Center."
        exit 1
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        if ! command -v /usr/local/bin/docker-compose &> /dev/null; then
            if ! docker compose version &> /dev/null && ! sudo docker compose version &> /dev/null; then
                log_error "Docker Compose is not available."
                exit 1
            else
                log_info "Using 'docker compose' (v2 syntax) with sudo"
                COMPOSE_CMD="sudo docker compose"
            fi
        else
            log_info "Using '/usr/local/bin/docker-compose' with sudo"
            COMPOSE_CMD="sudo /usr/local/bin/docker-compose"
        fi
    else
        # Test if we can run docker-compose without sudo
        if docker-compose version &> /dev/null; then
            log_info "Using 'docker-compose' (v1 syntax)"
            COMPOSE_CMD="docker-compose"
        else
            log_info "Using 'docker-compose' with sudo"
            COMPOSE_CMD="sudo docker-compose"
        fi
    fi
    
    # Test Docker daemon access
    if ! docker ps &> /dev/null; then
        if sudo docker ps &> /dev/null; then
            log_warn "Docker requires sudo access. This is normal on Synology NAS."
            # Update compose command to use sudo if not already
            if [[ "$COMPOSE_CMD" != sudo* ]]; then
                COMPOSE_CMD="sudo $COMPOSE_CMD"
            fi
        else
            log_error "Cannot access Docker daemon. Please check Docker installation."
            exit 1
        fi
    fi
    
    log_info "Requirements check passed ✓"
    log_info "Using: $COMPOSE_CMD"
}

setup_directories() {
    log_info "Setting up directories..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Create deploy directory if it doesn't exist
    if [ ! -d "$DEPLOY_DIR" ]; then
        mkdir -p "$DEPLOY_DIR"
        log_info "Created deployment directory: $DEPLOY_DIR"
    fi
}

backup_existing() {
    if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
        log_info "Backing up existing deployment..."
        BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
        cp -r "$DEPLOY_DIR" "$BACKUP_DIR/$BACKUP_NAME"
        log_info "Backup created: $BACKUP_DIR/$BACKUP_NAME"
    fi
}

deploy_application() {
    log_info "Deploying application..."
    
    cd "$DEPLOY_DIR"
    
    # Copy files if not already in deploy directory
    if [ "$(pwd)" != "$DEPLOY_DIR" ]; then
        log_info "Copying application files..."
        cp -r ./* "$DEPLOY_DIR/"
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        log_info "Creating environment file..."
        cp .env.example .env
        log_warn "Please edit .env file with your configuration:"
        log_warn "  - Set JWT_SECRET_KEY to a secure random value"
        log_warn "  - Update VITE_API_URL with your NAS IP address"
        log_warn ""
        log_warn "Edit options:"
        log_warn "  1. Use File Station: Open DSM → File Station → Navigate to this folder → Edit .env"
        log_warn "  2. Use vi: vi .env (press 'i' to edit, 'Esc' then ':wq' to save)"
        log_warn "  3. Manual creation: See SYNOLOGY_DEPLOYMENT.md for examples"
        read -p "Press Enter to continue after editing .env file..." || {
            log_warn "No input detected. You can edit .env later and re-run the script."
        }
    fi
    
    # Build and start services  
    log_info "Starting Docker services..."
    $COMPOSE_CMD down --remove-orphans 2>/dev/null || true
    
    # Try simple deployment first (more reliable)
    log_info "Attempting simple deployment (recommended)..."
    if $COMPOSE_CMD -f docker-compose.simple.yml build --no-cache && $COMPOSE_CMD -f docker-compose.simple.yml up -d; then
        log_info "✅ Simple deployment successful!"
        DEPLOYMENT_TYPE="simple"
    else
        log_warn "Simple deployment failed, trying full deployment..."
        if $COMPOSE_CMD build --no-cache && $COMPOSE_CMD up -d; then
            log_info "✅ Full deployment successful!"
            DEPLOYMENT_TYPE="full"
        else
            log_error "Both deployment types failed. Check the logs above."
            exit 1
        fi
    fi
    
    log_info "Deployment completed! ✓"
}

check_health() {
    log_info "Checking service health..."
    
    # Wait for services to start
    sleep 10
    
    # Check if containers are running (use the deployment type we succeeded with)
    COMPOSE_FILE_OPTION=""
    if [ "$DEPLOYMENT_TYPE" = "simple" ]; then
        COMPOSE_FILE_OPTION="-f docker-compose.simple.yml"
        log_info "Checking simple deployment containers..."
    else
        log_info "Checking full deployment containers..."
    fi
    
    if $COMPOSE_CMD $COMPOSE_FILE_OPTION ps | grep -q "Up"; then
        log_info "Containers are running ✓"
    else
        log_error "Some containers failed to start"
        $COMPOSE_CMD $COMPOSE_FILE_OPTION logs
        exit 1
    fi
    
    # Check API health endpoint (try both with and without sudo for curl)
    log_info "Checking API health..."
    for i in {1..30}; do
        if curl -f http://localhost:5000/api/health &>/dev/null; then
            log_info "API is healthy ✓"
            break
        fi
        if [ $i -eq 30 ]; then
            log_warn "API health check failed, but containers are running."
            log_warn "This might be normal if the API is still initializing."
            log_warn "Try accessing http://localhost:5000/api/health manually."
            break
        fi
        sleep 2
    done
}

show_access_info() {
    # Get the local IP
    LOCAL_IP=$(hostname -I | awk '{print $1}')
    
    echo ""
    echo "🎉 Deployment Successful!"
    echo "======================="
    echo ""
    echo "Deployment type: $DEPLOYMENT_TYPE"
    echo ""
    echo "Access your application:"
    if [ "$DEPLOYMENT_TYPE" = "simple" ]; then
        echo "  Frontend:  http://$LOCAL_IP:3000"
        echo "  API:       http://$LOCAL_IP:5000"
        echo "  Health:    http://$LOCAL_IP:5000/api/health"
    else
        echo "  Frontend:  http://$LOCAL_IP:3000"
        echo "  API:       http://$LOCAL_IP:5000"
        echo "  Full App:  http://$LOCAL_IP (via nginx)"
        echo "  Health:    http://$LOCAL_IP:5000/api/health"
    fi
    echo ""
    echo "Management commands:"
    if [ "$DEPLOYMENT_TYPE" = "simple" ]; then
        echo "  View logs:     $COMPOSE_CMD -f docker-compose.simple.yml logs -f"
        echo "  Stop services: $COMPOSE_CMD -f docker-compose.simple.yml down"
        echo "  Restart:       $COMPOSE_CMD -f docker-compose.simple.yml restart"
    else
        echo "  View logs:     $COMPOSE_CMD logs -f"
        echo "  Stop services: $COMPOSE_CMD down"
        echo "  Restart:       $COMPOSE_CMD restart"
    fi
    echo ""
    echo "Backup location: $BACKUP_DIR"
    echo ""
}

# Main execution
main() {
    check_requirements
    setup_directories
    backup_existing
    deploy_application
    check_health
    show_access_info
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "stop")
        log_info "Stopping services..."
        cd "$DEPLOY_DIR"
        $COMPOSE_CMD down
        log_info "Services stopped ✓"
        ;;
    "restart")
        log_info "Restarting services..."
        cd "$DEPLOY_DIR"
        $COMPOSE_CMD restart
        log_info "Services restarted ✓"
        ;;
    "logs")
        cd "$DEPLOY_DIR"
        $COMPOSE_CMD logs -f
        ;;
    "status")
        cd "$DEPLOY_DIR"
        $COMPOSE_CMD ps
        ;;
    "backup")
        backup_existing
        log_info "Manual backup completed ✓"
        ;;
    *)
        echo "Usage: $0 [deploy|stop|restart|logs|status|backup]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy the application (default)"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - Show service logs"
        echo "  status   - Show service status"
        echo "  backup   - Create manual backup"
        exit 1
        ;;
esac
