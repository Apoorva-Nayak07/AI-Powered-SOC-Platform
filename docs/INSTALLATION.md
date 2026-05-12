# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MongoDB** 6+
- **Docker** and Docker Compose (optional, for containerized deployment)
- **Git**

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd soc-platform
```

### 2. Setup MongoDB

#### Option A: Local MongoDB Installation

Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)

Start MongoDB:
```bash
# On Linux/Mac
sudo systemctl start mongod

# On Windows
net start MongoDB
```

#### Option B: MongoDB Docker Container

```bash
docker run -d -p 27017:27017 --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:6
```

### 3. Setup Backend Server

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soc-platform
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 4. Setup Frontend Client

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the client:
```bash
npm start
```

The client will run on `http://localhost:3000`

### 5. Setup ML Service

```bash
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Start the ML service:
```bash
python app/main.py
```

The ML service will run on `http://localhost:8000`

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Individual Service Builds

```bash
# Build backend
cd server
docker build -t soc-server .

# Build frontend
cd client
docker build -t soc-client .

# Build ML service
cd ml-service
docker build -t soc-ml-service .
```

## Seeding Initial Data

To populate the database with sample data:

```bash
cd server
npm run seed
```

This will create:
- Default admin user (admin@soc.com / Admin@123)
- Default analyst user (analyst@soc.com / Analyst@123)
- Sample threats, alerts, and incidents

## Verification

### Check Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45
}
```

### Check ML Service Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": {
    "anomaly_detector": true,
    "threat_analyzer": true
  }
}
```

### Access Frontend

Open your browser and navigate to:
```
http://localhost:3000
```

Login with default credentials:
- **Admin**: admin@soc.com / Admin@123
- **Analyst**: analyst@soc.com / Analyst@123

## Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection failed":

1. Ensure MongoDB is running:
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   ```

2. Verify connection string in `.env`

3. Check MongoDB logs:
   ```bash
   tail -f /var/log/mongodb/mongod.log
   ```

### Port Already in Use

If ports 3000, 5000, or 8000 are already in use:

1. Find the process:
   ```bash
   # On Linux/Mac
   lsof -i :5000
   
   # On Windows
   netstat -ano | findstr :5000
   ```

2. Kill the process or change the port in `.env` files

### ML Service Import Errors

If you see Python import errors:

1. Ensure you're in the virtual environment:
   ```bash
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. Reinstall dependencies:
   ```bash
   pip install --upgrade -r requirements.txt
   ```

### Frontend Build Errors

If npm install fails:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [API.md](./API.md) for API documentation
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review logs for error messages
