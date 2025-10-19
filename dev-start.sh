#!/bin/bash

# Development Start Script for MERN Ecommerce
echo "🚀 Starting MERN Ecommerce Development Environment..."

# Check if MongoDB is running locally
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running locally. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   mongod --config /usr/local/etc/mongod.conf"
    exit 1
fi

echo "✅ MongoDB is running locally"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

# Build and start development containers
echo "🔨 Building and starting development containers..."
docker-compose -f docker-compose.dev.yml up --build

echo "🎉 Development environment started!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:3000"
echo "🗄️  MongoDB: localhost:27017"
