const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mock data
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@soc.com', password: 'Admin@123', role: 'admin' },
  { id: '2', name: 'SOC Analyst', email: 'analyst@soc.com', password: 'Analyst@123', role: 'analyst' },
  { id: '3', name: 'Viewer User', email: 'viewer@soc.com', password: 'Viewer@123', role: 'viewer' },
];

const mockThreats = [
  { _id: '1', type: 'brute_force', severity: 'high', status: 'active', sourceIP: '192.168.1.100', description: 'Multiple failed SSH login attempts', riskScore: 75, createdAt: new Date() },
  { _id: '2', type: 'port_scan', severity: 'medium', status: 'investigating', sourceIP: '203.0.113.45', description: 'Port scanning activity detected', riskScore: 60, createdAt: new Date() },
  { _id: '3', type: 'malware', severity: 'critical', status: 'contained', sourceIP: '198.51.100.23', description: 'Malware communication detected', riskScore: 95, blocked: true, createdAt: new Date() },
];

const mockAlerts = [
  { _id: '1', title: 'Critical: Malware Detected', description: 'Malware communication blocked', severity: 'critical', status: 'new', timestamp: new Date() },
  { _id: '2', title: 'High: Brute Force Attack', description: 'Multiple failed login attempts', severity: 'high', status: 'acknowledged', timestamp: new Date() },
];

// Mock token
const mockToken = 'mock-jwt-token-for-demo';

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      token: mockToken,
      refreshToken: mockToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    token: mockToken,
    refreshToken: mockToken,
    user: { id: '4', name: req.body.name, email: req.body.email, role: 'viewer' }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    user: mockUsers[0]
  });
});

app.get('/api/threats', (req, res) => {
  res.json({
    success: true,
    count: mockThreats.length,
    threats: mockThreats
  });
});

app.get('/api/threats/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      total: 150,
      active: 45,
      blocked: 30,
      bySeverity: [
        { _id: 'critical', count: 20 },
        { _id: 'high', count: 50 },
        { _id: 'medium', count: 60 },
        { _id: 'low', count: 20 }
      ]
    }
  });
});

app.get('/api/alerts', (req, res) => {
  res.json({
    success: true,
    count: mockAlerts.length,
    alerts: mockAlerts
  });
});

app.get('/api/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalThreats: 150,
      activeAlerts: 25,
      openIncidents: 5,
      blockedAttacks: 30
    },
    threatsByType: [
      { name: 'malware', value: 40 },
      { name: 'brute_force', value: 35 },
      { name: 'port_scan', value: 30 },
      { name: 'ddos', value: 25 },
      { name: 'sql_injection', value: 20 }
    ],
    recentAlerts: mockAlerts
  });
});

app.get('/api/analytics/threat-trends', (req, res) => {
  const trends = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trends.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 30) + 20
    });
  }
  res.json({ success: true, trends });
});

// Catch all other routes
app.all('/api/*', (req, res) => {
  res.json({ success: true, message: 'Mock API endpoint', data: [] });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: 'DEMO MODE - No Database'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'SOC Platform API - DEMO MODE',
    version: '1.0.0',
    note: 'Running without database for quick demo'
  });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  // Send welcome event
  socket.emit('system:notification', {
    message: 'Connected to SOC Platform',
    icon: '🛡️'
  });
  
  // Simulate real-time events every 5 seconds
  const interval = setInterval(() => {
    socket.emit('security:event', {
      timestamp: new Date(),
      message: `Security event detected from ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    });
  }, 5000);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 SOC Platform Backend - DEMO MODE');
  console.log('========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('📡 Socket.IO server ready');
  console.log('⚠️  Running WITHOUT database (mock data)');
  console.log('🌐 API: http://localhost:${PORT}');
  console.log('========================================\n');
});

module.exports = { app, server, io };
