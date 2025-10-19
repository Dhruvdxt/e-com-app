#!/bin/bash

# Development Stop Script for MERN Ecommerce
echo "🛑 Stopping MERN Ecommerce Development Environment..."

# Stop development containers
docker-compose -f docker-compose.dev.yml down

echo "✅ Development environment stopped!"
