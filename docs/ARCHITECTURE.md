# System Architecture

## Overview

The SOC Platform is built using a modern microservices architecture with three main components:

1. **Frontend Client** - React.js SPA
2. **Backend Server** - Node.js/Express API
3. **ML Service** - Python FastAPI microservice

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React.js Frontend (Port 3000)                         │ │
│  │  - Tailwind CSS, Framer Motion                         │ │
│  │  - Socket.IO Client                                    │ │
│  │  - Recharts for visualization                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Node.js Backend (Port 5000)                           │ │
│  │  - Express.js REST API                                 │ │
│  │  - Socket.IO Server                                    │ │
│  │  - JWT Authentication                                  │ │
│  │  - Rate Limiting & Security                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            │ HTTP                            │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Python ML Service (Port 8000)                         │ │
│  │  - FastAPI                                             │ │
│  │  - Scikit-learn, TensorFlow                            │ │
│  │  - Anomaly Detection Models                            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Protocol
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MongoDB (Port 27017)                                  │ │
│  │  - Users, Threats, Alerts, Incidents                   │ │
│  │  - Logs, Analytics Data                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React.js)

**Technology Stack:**
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion
- Recharts
- Socket.IO Client
- Axios

**Key Features:**
- Real-time updates via WebSocket
- Responsive design
- Dark theme with glassmorphism
- Interactive charts and visualizations
- Role-based UI rendering

**Directory Structure:**
```
client/src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── layouts/         # Layout wrappers
├── contexts/        # React Context providers
├── services/        # API service layer
├── hooks/           # Custom React hooks
└── utils/           # Utility functions
```

### Backend (Node.js/Express)

**Technology Stack:**
- Node.js 18+
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT for authentication
- bcrypt for password hashing
- Helmet for security

**Key Features:**
- RESTful API design
- WebSocket for real-time communication
- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting
- Input validation
- Error handling middleware

**Directory Structure:**
```
server/src/
├── routes/          # API route definitions
├── controllers/     # Request handlers
├── models/          # Mongoose schemas
├── middleware/      # Express middleware
├── services/        # Business logic
├── sockets/         # Socket.IO handlers
├── utils/           # Utility functions
└── config/          # Configuration files
```

**API Endpoints:**

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh

Threats:
GET    /api/threats
GET    /api/threats/:id
POST   /api/threats
PUT    /api/threats/:id
DELETE /api/threats/:id
GET    /api/threats/stats
PUT    /api/threats/:id/block

Alerts:
GET    /api/alerts
GET    /api/alerts/:id
POST   /api/alerts
PUT    /api/alerts/:id
PUT    /api/alerts/:id/acknowledge
PUT    /api/alerts/:id/resolve
DELETE /api/alerts/:id

Incidents:
GET    /api/incidents
GET    /api/incidents/:id
POST   /api/incidents
PUT    /api/incidents/:id
PUT    /api/incidents/:id/assign
DELETE /api/incidents/:id

Analytics:
GET    /api/analytics/dashboard
GET    /api/analytics/threats
GET    /api/analytics/timeline
GET    /api/analytics/geo
GET    /api/analytics/top-attackers
GET    /api/analytics/threat-trends

ML Service:
POST   /api/ml/predict
POST   /api/ml/analyze
GET    /api/ml/insights
```

### ML Service (Python/FastAPI)

**Technology Stack:**
- Python 3.9+
- FastAPI
- Scikit-learn
- TensorFlow
- NumPy, Pandas
- Uvicorn

**Key Features:**
- Anomaly detection using Isolation Forest
- Threat analysis and risk scoring
- MITRE ATT&CK mapping
- Real-time predictions
- Model training capabilities

**ML Models:**

1. **Isolation Forest**
   - Unsupervised anomaly detection
   - Detects outliers in network traffic
   - Contamination rate: 10%

2. **Random Forest Classifier**
   - Supervised threat classification
   - Multi-class threat categorization
   - Feature importance analysis

3. **Threat Analyzer**
   - Rule-based + ML hybrid approach
   - Risk scoring algorithm
   - Confidence calculation

**Directory Structure:**
```
ml-service/
├── app/
│   ├── main.py              # FastAPI application
│   ├── models/              # ML model definitions
│   └── services/            # ML services
│       ├── anomaly_detector.py
│       └── threat_analyzer.py
├── datasets/                # Training datasets
├── trained_models/          # Saved models
└── requirements.txt
```

### Database (MongoDB)

**Collections:**

1. **users**
   - User accounts and authentication
   - Roles: admin, analyst, viewer
   - Login tracking and security

2. **threats**
   - Detected security threats
   - Source/destination IPs
   - Severity and status
   - MITRE ATT&CK mapping

3. **alerts**
   - Security alerts
   - Acknowledgment tracking
   - Resolution status

4. **incidents**
   - Security incidents
   - Assignment and workflow
   - Timeline and notes

5. **logs**
   - Security event logs
   - Network traffic logs
   - System logs

**Indexes:**
- Compound indexes on frequently queried fields
- TTL index on logs (90-day retention)
- Text indexes for search functionality

## Data Flow

### Authentication Flow

```
1. User submits credentials
2. Backend validates credentials
3. Backend generates JWT token
4. Token stored in localStorage
5. Token sent with each API request
6. Backend validates token on each request
7. Refresh token used for token renewal
```

### Real-Time Event Flow

```
1. Security event detected
2. Backend processes event
3. Event stored in MongoDB
4. Socket.IO emits event to connected clients
5. Frontend receives event via WebSocket
6. UI updates in real-time
7. Toast notification displayed
```

### Threat Detection Flow

```
1. Log data ingested
2. Backend sends data to ML service
3. ML service analyzes with trained models
4. Anomaly score calculated
5. If anomaly detected:
   a. Threat record created
   b. Alert generated
   c. Socket.IO notification sent
   d. Risk score calculated
6. Frontend displays threat
```

## Security Architecture

### Authentication & Authorization

- **JWT Tokens**: Short-lived access tokens (1 hour)
- **Refresh Tokens**: Long-lived tokens (7 days)
- **Password Hashing**: bcrypt with salt rounds
- **Account Lockout**: After 5 failed attempts
- **Role-Based Access Control**: Admin, Analyst, Viewer

### API Security

- **Helmet.js**: Security headers
- **CORS**: Configured origins
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Express-validator
- **SQL Injection Prevention**: Mongoose ODM
- **XSS Protection**: Content Security Policy

### Network Security

- **HTTPS**: TLS 1.3
- **WebSocket Security**: WSS protocol
- **Firewall Rules**: Restricted ports
- **DDoS Protection**: Rate limiting + CDN

## Scalability

### Horizontal Scaling

- **Frontend**: Static files on CDN
- **Backend**: Multiple instances behind load balancer
- **ML Service**: Separate instances for prediction
- **Database**: MongoDB replica set

### Vertical Scaling

- Increase instance resources
- Optimize database queries
- Implement caching (Redis)
- Use connection pooling

### Performance Optimization

- **Frontend**:
  - Code splitting
  - Lazy loading
  - Image optimization
  - Gzip compression

- **Backend**:
  - Database indexing
  - Query optimization
  - Caching strategies
  - Connection pooling

- **ML Service**:
  - Model optimization
  - Batch predictions
  - Async processing
  - Model caching

## Monitoring & Logging

### Application Monitoring

- Health check endpoints
- Performance metrics
- Error tracking
- Resource usage monitoring

### Logging Strategy

- **Frontend**: Console errors, user actions
- **Backend**: Request logs, error logs, audit logs
- **ML Service**: Prediction logs, model performance
- **Database**: Query logs, slow query analysis

### Log Levels

- **DEBUG**: Detailed information
- **INFO**: General information
- **WARNING**: Warning messages
- **ERROR**: Error messages
- **CRITICAL**: Critical issues

## Disaster Recovery

### Backup Strategy

- **Database**: Daily automated backups
- **Models**: Version-controlled models
- **Configuration**: Git repository
- **Retention**: 30-day backup retention

### Recovery Procedures

1. Restore database from backup
2. Redeploy application from Git
3. Restore ML models
4. Verify system functionality
5. Resume operations

## Future Enhancements

1. **Advanced ML Models**
   - Deep learning models
   - Behavioral analysis
   - Predictive analytics

2. **Integration**
   - SIEM integration
   - Threat intelligence feeds
   - Third-party security tools

3. **Features**
   - Automated response playbooks
   - Advanced reporting
   - Mobile application
   - Multi-tenancy support

4. **Infrastructure**
   - Kubernetes deployment
   - Service mesh
   - Distributed tracing
   - Advanced caching

## Technology Decisions

### Why React?

- Component-based architecture
- Large ecosystem
- Excellent performance
- Strong community support

### Why Node.js?

- JavaScript full-stack
- Non-blocking I/O
- Real-time capabilities
- NPM ecosystem

### Why Python for ML?

- Rich ML libraries
- Industry standard
- Easy model deployment
- Scientific computing support

### Why MongoDB?

- Flexible schema
- Horizontal scalability
- JSON-like documents
- Rich query language

## Conclusion

The SOC Platform architecture is designed for:
- **Scalability**: Handle growing data and users
- **Security**: Enterprise-grade security measures
- **Performance**: Fast response times
- **Maintainability**: Clean code and documentation
- **Extensibility**: Easy to add new features
