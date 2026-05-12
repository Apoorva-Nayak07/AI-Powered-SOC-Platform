# API Documentation

## Base URL

```
Development: http://localhost:5000
Production: https://api.yourdomain.com
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "viewer"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@soc.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@soc.com",
    "role": "admin"
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@soc.com",
    "role": "admin",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Refresh Token

```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Threats

#### Get All Threats

```http
GET /api/threats?page=1&limit=20&severity=high&type=malware&status=active
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `severity` (optional): Filter by severity (critical, high, medium, low, info)
- `type` (optional): Filter by type (malware, phishing, ddos, etc.)
- `status` (optional): Filter by status (active, investigating, contained, resolved)
- `sortBy` (optional): Sort field (default: -createdAt)

**Response:**
```json
{
  "success": true,
  "count": 50,
  "totalPages": 3,
  "currentPage": 1,
  "threats": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "malware",
      "severity": "critical",
      "status": "active",
      "sourceIP": "192.168.1.100",
      "destinationIP": "10.0.0.50",
      "description": "Malware detected",
      "riskScore": 95,
      "confidence": 90,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Threat by ID

```http
GET /api/threats/:id
```

**Response:**
```json
{
  "success": true,
  "threat": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "malware",
    "severity": "critical",
    "status": "active",
    "sourceIP": "192.168.1.100",
    "destinationIP": "10.0.0.50",
    "sourcePort": 54321,
    "destinationPort": 443,
    "protocol": "TCP",
    "description": "Malware communication detected",
    "indicators": ["Known C2 server", "Encrypted payload"],
    "mitreAttack": {
      "tactic": "Command and Control",
      "technique": "Application Layer Protocol",
      "id": "T1071"
    },
    "riskScore": 95,
    "confidence": 90,
    "blocked": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Create Threat

```http
POST /api/threats
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "brute_force",
  "severity": "high",
  "sourceIP": "192.168.1.100",
  "destinationIP": "10.0.0.50",
  "sourcePort": 54321,
  "destinationPort": 22,
  "protocol": "TCP",
  "description": "Multiple failed SSH login attempts",
  "indicators": ["Failed logins", "High frequency"],
  "riskScore": 75,
  "confidence": 85
}
```

**Response:**
```json
{
  "success": true,
  "threat": { ... }
}
```

#### Update Threat

```http
PUT /api/threats/:id
```

**Request Body:**
```json
{
  "status": "resolved",
  "notes": "Threat contained and resolved"
}
```

#### Block Threat

```http
PUT /api/threats/:id/block
```

**Response:**
```json
{
  "success": true,
  "message": "Threat blocked successfully",
  "threat": { ... }
}
```

#### Get Threat Statistics

```http
GET /api/threats/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "active": 45,
    "blocked": 30,
    "bySeverity": [
      { "_id": "critical", "count": 20 },
      { "_id": "high", "count": 50 },
      { "_id": "medium", "count": 60 },
      { "_id": "low", "count": 20 }
    ],
    "byType": [
      { "_id": "malware", "count": 40 },
      { "_id": "brute_force", "count": 35 },
      { "_id": "port_scan", "count": 30 }
    ]
  }
}
```

### Alerts

#### Get All Alerts

```http
GET /api/alerts?page=1&limit=20&severity=critical&status=new
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "alerts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Critical Security Alert",
      "description": "Malware detected on system",
      "severity": "critical",
      "status": "new",
      "category": "malware",
      "source": "AI Detection Engine",
      "sourceIP": "192.168.1.100",
      "priority": 5,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Acknowledge Alert

```http
PUT /api/alerts/:id/acknowledge
```

**Response:**
```json
{
  "success": true,
  "message": "Alert acknowledged",
  "alert": { ... }
}
```

#### Resolve Alert

```http
PUT /api/alerts/:id/resolve
```

**Request Body:**
```json
{
  "resolution": "Threat contained and systems cleaned"
}
```

### Analytics

#### Get Dashboard Analytics

```http
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalThreats": 150,
    "activeAlerts": 25,
    "openIncidents": 5,
    "blockedAttacks": 30
  },
  "threatsByType": [
    { "name": "malware", "value": 40 },
    { "name": "brute_force", "value": 35 }
  ],
  "recentAlerts": [ ... ]
}
```

#### Get Threat Trends

```http
GET /api/analytics/threat-trends?days=7
```

**Response:**
```json
{
  "success": true,
  "trends": [
    { "date": "2024-01-15", "count": 25 },
    { "date": "2024-01-16", "count": 30 },
    { "date": "2024-01-17", "count": 28 }
  ]
}
```

### ML Service

#### Predict Anomalies

```http
POST /api/ml/predict
```

**Request Body:**
```json
{
  "logs": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "source_ip": "192.168.1.100",
      "destination_ip": "10.0.0.50",
      "source_port": 54321,
      "destination_port": 22,
      "protocol": "TCP",
      "bytes_sent": 1024,
      "bytes_received": 2048,
      "duration": 120.5
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "index": 0,
      "source_ip": "192.168.1.100",
      "destination_ip": "10.0.0.50",
      "is_anomaly": true,
      "anomaly_score": 0.85,
      "risk_score": 85.0,
      "confidence": 90.0
    }
  ],
  "summary": {
    "total_logs": 1,
    "anomalies_detected": 1,
    "anomaly_rate": 1.0,
    "average_risk_score": 85.0
  }
}
```

#### Analyze Threat

```http
POST /api/ml/analyze
```

**Request Body:**
```json
{
  "source_ip": "192.168.1.100",
  "destination_ip": "10.0.0.50",
  "threat_type": "brute_force",
  "indicators": ["Failed login attempts", "High frequency"],
  "metadata": {
    "attempts": 50,
    "duration": 300
  }
}
```

**Response:**
```json
{
  "success": true,
  "risk_score": 75.0,
  "confidence": 85.0,
  "threat_level": "high",
  "recommendations": [
    "Implement account lockout policies",
    "Enable multi-factor authentication",
    "Review failed login attempts"
  ],
  "mitre_attack": {
    "tactic": "Credential Access",
    "technique": "Brute Force",
    "id": "T1110"
  }
}
```

#### Get AI Insights

```http
GET /api/ml/insights
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "threat_trends": [
      {
        "type": "brute_force",
        "trend": "increasing",
        "change_percentage": 15.3,
        "recommendation": "Implement rate limiting"
      }
    ],
    "top_risks": [
      {
        "risk": "Unpatched vulnerabilities",
        "severity": "high",
        "affected_systems": 12,
        "recommendation": "Schedule immediate patching"
      }
    ],
    "model_performance": {
      "accuracy": 0.94,
      "precision": 0.91,
      "recall": 0.89,
      "f1_score": 0.90
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 423 | Locked (Account locked) |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## WebSocket Events

### Client → Server

- `subscribe:threats` - Subscribe to threat types
- `unsubscribe:threats` - Unsubscribe from threat types
- `alert:acknowledge` - Acknowledge an alert
- `request:stats` - Request real-time statistics

### Server → Client

- `security:event` - New security event
- `threat:detected` - New threat detected
- `alert:new` - New alert created
- `alert:updated` - Alert updated
- `incident:created` - New incident created
- `incident:updated` - Incident updated
- `system:notification` - System notification

## Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@soc.com","password":"Admin@123"}'
```

**Get Threats:**
```bash
curl http://localhost:5000/api/threats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create Alert:**
```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Security Alert",
    "description": "Suspicious activity detected",
    "severity": "high",
    "source": "Manual"
  }'
```

### JavaScript Examples

**Using Axios:**
```javascript
import axios from 'axios';

// Login
const login = async () => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'admin@soc.com',
    password: 'Admin@123'
  });
  return response.data.token;
};

// Get Threats
const getThreats = async (token) => {
  const response = await axios.get('http://localhost:5000/api/threats', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.threats;
};
```

**Using Socket.IO:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('threat:detected', (threat) => {
  console.log('New threat:', threat);
});

socket.on('alert:new', (alert) => {
  console.log('New alert:', alert);
});
```

## Best Practices

1. **Always use HTTPS in production**
2. **Store tokens securely** (httpOnly cookies or secure storage)
3. **Implement token refresh** before expiration
4. **Handle rate limiting** gracefully
5. **Validate input** on client side
6. **Handle errors** appropriately
7. **Use pagination** for large datasets
8. **Implement retry logic** for failed requests

## Support

For API issues or questions:
- Check this documentation
- Review error messages
- Check server logs
- Open an issue on GitHub
