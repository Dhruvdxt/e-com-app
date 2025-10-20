#!/bin/bash

echo "🚀 Deploying MarketHub to EC2..."

# Create market-hub directory if it doesn't exist
mkdir -p ~/market-hub

# Copy project files to market-hub directory
echo "📁 Copying project files..."
cp -r . ~/market-hub/

# Navigate to market-hub directory
cd ~/market-hub

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove old images to free up space
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start the application
echo "🔨 Building and starting MarketHub..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Show logs
echo "📋 Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

echo "✅ MarketHub deployment completed!"
echo "🌐 Application should be available at: http://your-ec2-ip"
echo "📊 To view logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 To stop: docker-compose -f docker-compose.prod.yml down"
