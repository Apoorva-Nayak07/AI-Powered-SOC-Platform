# Deployment Guide

## Production Deployment

This guide covers deploying the SOC Platform to various cloud providers and production environments.

## Pre-Deployment Checklist

- [ ] Update all environment variables with production values
- [ ] Change default passwords and JWT secrets
- [ ] Configure MongoDB with authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all services locally
- [ ] Review security settings

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://username:password@host:27017/soc-platform?authSource=admin
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
ML_SERVICE_URL=https://ml-service.yourdomain.com
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SOCKET_URL=https://api.yourdomain.com
```

### ML Service (.env)

```env
PORT=8000
MODEL_PATH=/app/trained_models
DATASET_PATH=/app/datasets
```

## Deployment Options

### Option 1: Docker Compose (Recommended for VPS)

#### 1. Prepare Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - soc-network

  server:
    build: ./server
    restart: always
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/soc-platform?authSource=admin
    depends_on:
      - mongodb
      - ml-service
    networks:
      - soc-network

  ml-service:
    build: ./ml-service
    restart: always
    volumes:
      - ml_models:/app/trained_models
    networks:
      - soc-network

  client:
    build: ./client
    restart: always
    depends_on:
      - server
    networks:
      - soc-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - client
      - server
    networks:
      - soc-network

networks:
  soc-network:
    driver: bridge

volumes:
  mongodb_data:
  ml_models:
```

#### 2. Deploy

```bash
# Create .env file with production values
nano .env

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Option 2: AWS Deployment

#### Using AWS EC2

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.medium or larger
   - Security Group: Allow ports 22, 80, 443

2. **Connect and Setup**

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone <your-repo-url>
cd soc-platform

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

3. **Configure Domain and SSL**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Using AWS ECS (Elastic Container Service)

1. Push images to ECR
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure Application Load Balancer

### Option 3: Azure Deployment

#### Using Azure Container Instances

```bash
# Login to Azure
az login

# Create resource group
az group create --name soc-platform-rg --location eastus

# Create container registry
az acr create --resource-group soc-platform-rg --name socplatformacr --sku Basic

# Build and push images
az acr build --registry socplatformacr --image soc-server:latest ./server
az acr build --registry socplatformacr --image soc-client:latest ./client
az acr build --registry socplatformacr --image soc-ml:latest ./ml-service

# Deploy container group
az container create \
  --resource-group soc-platform-rg \
  --name soc-platform \
  --image socplatformacr.azurecr.io/soc-server:latest \
  --dns-name-label soc-platform \
  --ports 80 443
```

### Option 4: Railway Deployment

1. **Install Railway CLI**

```bash
npm install -g @railway/cli
```

2. **Login and Initialize**

```bash
railway login
railway init
```

3. **Deploy Services**

```bash
# Deploy backend
cd server
railway up

# Deploy frontend
cd ../client
railway up

# Deploy ML service
cd ../ml-service
railway up
```

4. **Configure Environment Variables**

Use Railway dashboard to set environment variables for each service.

### Option 5: Render Deployment

1. **Create Render Account** at render.com

2. **Deploy Backend**
   - New Web Service
   - Connect GitHub repository
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Add environment variables

3. **Deploy Frontend**
   - New Static Site
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`

4. **Deploy ML Service**
   - New Web Service
   - Docker deployment
   - Dockerfile path: `ml-service/Dockerfile`

### Option 6: DigitalOcean Deployment

#### Using DigitalOcean App Platform

1. Connect GitHub repository
2. Configure components:
   - Backend: Node.js service
   - Frontend: Static site
   - ML Service: Docker service
   - Database: Managed MongoDB
3. Set environment variables
4. Deploy

#### Using DigitalOcean Droplet

Similar to AWS EC2 deployment above.

## NGINX Configuration

Create `nginx/nginx.conf`:

```nginx
upstream backend {
    server server:5000;
}

upstream ml_service {
    server ml-service:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Frontend
    location / {
        proxy_pass http://client:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # ML Service
    location /ml {
        proxy_pass http://ml_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Database Backup

### Automated MongoDB Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MONGO_URI="mongodb://username:password@localhost:27017"

mkdir -p $BACKUP_DIR

mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/backup_$TIMESTAMP"

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: backup_$TIMESTAMP"
```

### Setup Cron Job

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

## Monitoring

### Setup PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start server/src/server.js --name soc-server
pm2 start ml-service/app/main.py --name soc-ml --interpreter python3

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

### Health Check Endpoints

- Backend: `https://yourdomain.com/health`
- ML Service: `https://yourdomain.com/ml/health`

## Security Hardening

1. **Firewall Configuration**

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Fail2Ban Setup**

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

3. **Regular Updates**

```bash
# Setup unattended upgrades
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Scaling

### Horizontal Scaling

Use load balancers to distribute traffic across multiple instances:

- AWS: Application Load Balancer
- Azure: Azure Load Balancer
- DigitalOcean: Load Balancer

### Vertical Scaling

Upgrade instance sizes as needed based on resource usage.

## Troubleshooting

### Check Logs

```bash
# Docker logs
docker-compose logs -f service-name

# PM2 logs
pm2 logs soc-server

# System logs
journalctl -u service-name -f
```

### Common Issues

1. **502 Bad Gateway**: Backend service not running
2. **Connection Refused**: Check firewall rules
3. **Database Connection Failed**: Verify MongoDB credentials

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or with PM2
pm2 restart all
```

### Database Maintenance

```bash
# Compact database
mongo --eval "db.runCommand({compact: 'collection_name'})"

# Rebuild indexes
mongo --eval "db.collection.reIndex()"
```

## Support

For deployment issues:
- Check logs first
- Review environment variables
- Verify network connectivity
- Consult cloud provider documentation
