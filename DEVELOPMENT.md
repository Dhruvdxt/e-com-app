# Development Guide for MERN Ecommerce

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- MongoDB running locally on port 27017
- Node.js 16+ (for local development if needed)

### Starting Development Environment

1. **Start MongoDB locally:**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # Or manually
   mongod --config /usr/local/etc/mongod.conf
   ```

2. **Start the development environment:**
   ```bash
   # Using the provided script
   ./dev-start.sh
   
   # Or manually
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

### Stopping Development Environment

```bash
# Using the provided script
./dev-stop.sh

# Or manually
docker-compose -f docker-compose.dev.yml down
```

## 🔧 Development Workflow

### Hot Reload Features
- **Frontend**: Changes to React components, styles, and assets are reflected immediately
- **Backend**: Changes to server code are reflected immediately with nodemon
- **No Docker rebuilds needed** for code changes

### File Structure
```
mern-ecommerce/
├── client/                 # React frontend
│   ├── app/               # Source code
│   ├── Dockerfile.dev     # Development Dockerfile
│   └── package.json
├── server/                # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── Dockerfile.dev     # Development Dockerfile
│   └── package.json
├── docker-compose.dev.yml # Development configuration
├── dev-start.sh          # Start script
└── dev-stop.sh           # Stop script
```

### Making Changes

1. **Frontend Changes:**
   - Edit files in `client/app/`
   - Changes appear instantly in browser
   - No container restart needed

2. **Backend Changes:**
   - Edit files in `server/`
   - Changes are picked up by nodemon
   - No container restart needed

3. **Database Changes:**
   - Connect to local MongoDB
   - Changes persist between container restarts

### Environment Configuration

The development environment uses:
- **MongoDB**: Local instance (not containerized)
- **Ports**: 8080 (frontend), 3000 (backend)
- **Hot Reload**: Enabled for both frontend and backend
- **Volume Mounting**: Source code is mounted for live updates

### Troubleshooting

1. **Port conflicts:**
   ```bash
   # Check what's using the ports
   lsof -i :3000
   lsof -i :8080
   ```

2. **MongoDB connection issues:**
   - Ensure MongoDB is running locally
   - Check connection string in docker-compose.dev.yml

3. **Container issues:**
   ```bash
   # Rebuild containers
   docker-compose -f docker-compose.dev.yml up --build --force-recreate
   ```

## 📦 Production Build

When ready for production:

```bash
# Build production containers
docker-compose up --build

# Or use the original docker-compose.yml
docker-compose -f docker-compose.yml up --build
```

## 🔄 Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Hot Reload | ✅ | ❌ |
| Source Mounting | ✅ | ❌ |
| MongoDB | Local | Containerized |
| Build Time | Fast | Optimized |
| Debugging | Easy | Optimized |
