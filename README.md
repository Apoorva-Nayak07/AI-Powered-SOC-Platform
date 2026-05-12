# 🛡️ AI-Powered Security Operations Center (SOC) Platform

## 🎯 Overview

Enterprise-grade Security Operations Center platform with real-time threat monitoring, AI-driven attack detection, automated incident response, and advanced analytics. Built with modern technologies to provide comprehensive cybersecurity monitoring and protection.

## ✨ Features

### 🔐 Core Security Features
- **Real-time Threat Monitoring** - Live security event tracking and analysis
- **AI-Powered Anomaly Detection** - Machine learning models for threat detection
- **Automated Incident Response** - Intelligent threat mitigation and response
- **Advanced Threat Intelligence** - GeoIP tracking, MITRE ATT&CK mapping
- **Live Alert System** - Multi-level alerting with real-time notifications
- **Attack Visualization** - Interactive maps and dashboards

### 🤖 AI/ML Capabilities
- Isolation Forest for anomaly detection
- Random Forest classification
- Real-time risk scoring
- Behavioral analysis
- Predictive threat modeling

### 📊 Dashboard Modules
1. Executive Dashboard
2. Live Monitoring Center
3. Threat Detection Console
4. Alerts Center
5. Incident Response Panel
6. Threat Intelligence Dashboard
7. Attack Visualization Map
8. Logs Explorer
9. AI Insights Dashboard
10. User Management
11. Reports & Analytics
12. System Settings

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Framer Motion
- Recharts
- Socket.IO Client
- React Router v6
- Axios

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcrypt

### AI/ML Service
- Python FastAPI
- Scikit-learn
- TensorFlow
- Pandas
- NumPy

### DevOps
- Docker
- Docker Compose
- NGINX

## 📁 Project Structure

```
soc-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── charts/        # Chart components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Layout components
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   ├── sockets/       # Socket.IO handlers
│   │   ├── utils/         # Utilities
│   │   └── server.js
│   └── package.json
│
├── ml-service/            # Python AI/ML service
│   ├── app/
│   │   ├── models/        # ML models
│   │   ├── services/      # ML services
│   │   ├── utils/         # Utilities
│   │   └── main.py
│   ├── datasets/          # Training datasets
│   ├── trained_models/    # Saved models
│   └── requirements.txt
│
├── docker/                # Docker configurations
│   ├── nginx/
│   └── docker-compose.yml
│
└── docs/                  # Documentation
    ├── API.md
    ├── DEPLOYMENT.md
    └── ARCHITECTURE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB 6+
- Docker & Docker Compose (optional)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd soc-platform
```

#### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

#### 4. Setup ML Service
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app/main.py
```

### 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soc-platform
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

#### ML Service (.env)
```env
PORT=8000
MODEL_PATH=./trained_models
```

## 👥 User Roles

- **Admin** - Full system access
- **SOC Analyst** - Threat analysis and incident response
- **Viewer** - Read-only dashboard access

## 🔐 Default Credentials

```
Admin:
Email: admin@soc.com
Password: Admin@123

Analyst:
Email: analyst@soc.com
Password: Analyst@123
```

**⚠️ Change these credentials immediately in production!**

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Threats
- `GET /api/threats` - Get all threats
- `GET /api/threats/:id` - Get threat by ID
- `POST /api/threats` - Create threat
- `PUT /api/threats/:id` - Update threat
- `DELETE /api/threats/:id` - Delete threat

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert
- `PUT /api/alerts/:id/resolve` - Resolve alert

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Create incident
- `PUT /api/incidents/:id` - Update incident
- `PUT /api/incidents/:id/assign` - Assign incident

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/threats` - Threat analytics
- `GET /api/analytics/timeline` - Attack timeline

### ML Service
- `POST /api/ml/predict` - Anomaly detection
- `POST /api/ml/analyze` - Threat analysis
- `GET /api/ml/insights` - AI insights

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# ML service tests
cd ml-service
pytest
```

## 📊 Monitoring

The platform includes:
- Real-time WebSocket updates
- Live event streaming
- Performance metrics
- System health monitoring
- Audit logging

## 🌍 Deployment

### Production Deployment

#### Using Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### Manual Deployment
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

### Supported Platforms
- AWS (EC2, ECS, Lambda)
- Azure (App Service, Container Instances)
- Railway
- Render
- DigitalOcean

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet.js security headers
- Input validation
- CORS protection
- SQL injection prevention
- XSS protection
- CSRF tokens

## 🎨 UI/UX Features

- Dark theme with glassmorphism
- Neon cyber aesthetics
- Smooth animations with Framer Motion
- Responsive design
- Interactive charts
- Real-time updates
- Toast notifications
- Loading states

## 📈 Performance

- WebSocket for real-time updates
- Optimized database queries
- Caching strategies
- Lazy loading
- Code splitting
- CDN integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request


## 🙏 Acknowledgments

- Inspired by CrowdStrike Falcon, Splunk, IBM QRadar
- MITRE ATT&CK Framework
- CICIDS2017, NSL-KDD, UNSW-NB15 datasets


**Built with ❤️ for Cybersecurity Professionals**
