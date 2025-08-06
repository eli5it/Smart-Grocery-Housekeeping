#!/bin/bash

echo "🚀 Smart Grocery Housekeeping - Clean Deployment Script"
echo "======================================================"

# Set variables
COMPOSE_FILE="docker-compose.freeports.yml"
API_PORT="8001"
FRONTEND_PORT="8080"

echo "📋 Step 1: Stopping any existing containers..."
sudo docker-compose down 2>/dev/null || true
sudo docker-compose -f docker-compose.*.yml down 2>/dev/null || true

echo "🧹 Step 2: Cleaning Docker system..."
sudo docker system prune -f

echo "📝 Step 3: Checking .env file..."
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
JWT_SECRET_KEY=super-secret-change-this-$(date +%s)
VITE_API_URL=http://$(hostname -I | awk '{print $1}'):${API_PORT}
TZ=America/Los_Angeles
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file exists"
fi

echo "🔧 Step 4: Building containers..."
sudo docker-compose -f ${COMPOSE_FILE} build --no-cache

echo "🚀 Step 5: Starting services..."
sudo docker-compose -f ${COMPOSE_FILE} up -d

echo "⏳ Step 6: Waiting for services to start..."
sleep 10

echo "🔍 Step 7: Checking container status..."
sudo docker-compose -f ${COMPOSE_FILE} ps

echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://$(hostname -I | awk '{print $1}'):${FRONTEND_PORT}"
echo "   API:      http://$(hostname -I | awk '{print $1}'):${API_PORT}/api/health"
echo ""
echo "📊 Useful commands:"
echo "   Check logs:   sudo docker-compose -f ${COMPOSE_FILE} logs -f"
echo "   Stop:         sudo docker-compose -f ${COMPOSE_FILE} down"
echo "   Restart:      sudo docker-compose -f ${COMPOSE_FILE} restart"
