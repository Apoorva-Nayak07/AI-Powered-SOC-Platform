const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Threat = require('../models/Threat');
const Alert = require('../models/Alert');
const Incident = require('../models/Incident');
const Log = require('../models/Log');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@soc.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'SOC Analyst',
    email: 'analyst@soc.com',
    password: 'Analyst@123',
    role: 'analyst',
  },
  {
    name: 'Viewer User',
    email: 'viewer@soc.com',
    password: 'Viewer@123',
    role: 'viewer',
  },
];

const threats = [
  {
    type: 'brute_force',
    severity: 'high',
    status: 'active',
    sourceIP: '192.168.1.100',
    destinationIP: '10.0.0.50',
    sourcePort: 54321,
    destinationPort: 22,
    protocol: 'TCP',
    description: 'Multiple failed SSH login attempts detected from suspicious IP',
    indicators: ['Failed login attempts', 'Unusual source IP', 'High frequency'],
    riskScore: 75,
    confidence: 85,
    detectedBy: 'ai',
  },
  {
    type: 'port_scan',
    severity: 'medium',
    status: 'investigating',
    sourceIP: '203.0.113.45',
    destinationIP: '10.0.0.100',
    protocol: 'TCP',
    description: 'Port scanning activity detected targeting internal network',
    indicators: ['Sequential port access', 'Multiple ports', 'Short duration'],
    riskScore: 60,
    confidence: 90,
    detectedBy: 'rule',
  },
  {
    type: 'malware',
    severity: 'critical',
    status: 'contained',
    sourceIP: '198.51.100.23',
    destinationIP: '10.0.0.75',
    description: 'Malware communication detected with known C2 server',
    indicators: ['Known malicious IP', 'Suspicious payload', 'Encrypted traffic'],
    riskScore: 95,
    confidence: 95,
    detectedBy: 'ai',
    blocked: true,
    blockedAt: new Date(),
  },
  {
    type: 'ddos',
    severity: 'high',
    status: 'active',
    sourceIP: '198.51.100.50',
    destinationIP: '10.0.0.1',
    destinationPort: 80,
    protocol: 'TCP',
    description: 'Distributed Denial of Service attack detected',
    indicators: ['High traffic volume', 'Multiple sources', 'SYN flood'],
    riskScore: 85,
    confidence: 92,
    detectedBy: 'ai',
  },
  {
    type: 'sql_injection',
    severity: 'critical',
    status: 'resolved',
    sourceIP: '203.0.113.100',
    destinationIP: '10.0.0.200',
    destinationPort: 443,
    protocol: 'HTTPS',
    description: 'SQL injection attempt detected in web application',
    indicators: ['SQL keywords in request', 'Unusual query patterns'],
    riskScore: 90,
    confidence: 88,
    detectedBy: 'rule',
  },
];

const alerts = [
  {
    title: 'Critical: Malware Detected',
    description: 'Malware communication with C2 server blocked',
    severity: 'critical',
    status: 'new',
    category: 'malware',
    source: 'AI Detection Engine',
    sourceIP: '198.51.100.23',
    priority: 5,
    tags: ['malware', 'c2', 'blocked'],
  },
  {
    title: 'High: Brute Force Attack',
    description: 'Multiple failed login attempts from suspicious IP',
    severity: 'high',
    status: 'acknowledged',
    category: 'intrusion',
    source: 'Authentication System',
    sourceIP: '192.168.1.100',
    priority: 4,
    tags: ['brute-force', 'ssh', 'authentication'],
  },
  {
    title: 'Medium: Port Scan Detected',
    description: 'Port scanning activity targeting internal network',
    severity: 'medium',
    status: 'investigating',
    category: 'anomaly',
    source: 'Network Monitor',
    sourceIP: '203.0.113.45',
    priority: 3,
    tags: ['port-scan', 'reconnaissance'],
  },
  {
    title: 'High: DDoS Attack in Progress',
    description: 'Large volume of traffic from multiple sources',
    severity: 'high',
    status: 'new',
    category: 'intrusion',
    source: 'Traffic Analyzer',
    sourceIP: '198.51.100.50',
    priority: 4,
    tags: ['ddos', 'syn-flood'],
  },
];

const incidents = [
  {
    title: 'Malware Outbreak Investigation',
    description: 'Multiple systems infected with malware, investigating source and scope',
    severity: 'critical',
    status: 'investigating',
    category: 'malware_infection',
    affectedSystems: ['WS-001', 'WS-002', 'SRV-DB-01'],
    affectedUsers: ['user1@company.com', 'user2@company.com'],
    priority: 5,
    tags: ['malware', 'outbreak', 'investigation'],
  },
  {
    title: 'Unauthorized Access Attempt',
    description: 'Unauthorized access attempt to production database',
    severity: 'high',
    status: 'open',
    category: 'unauthorized_access',
    affectedSystems: ['SRV-DB-PROD'],
    priority: 4,
    tags: ['unauthorized', 'database', 'access'],
  },
];

const logs = [
  {
    level: 'warning',
    source: 'Firewall',
    sourceIP: '192.168.1.100',
    destinationIP: '10.0.0.50',
    sourcePort: 54321,
    destinationPort: 22,
    protocol: 'TCP',
    action: 'BLOCK',
    message: 'Blocked connection attempt from suspicious IP',
    eventType: 'firewall',
    result: 'failure',
    severity: 'medium',
  },
  {
    level: 'error',
    source: 'Authentication',
    sourceIP: '192.168.1.100',
    user: 'admin',
    action: 'LOGIN',
    message: 'Failed login attempt for user admin',
    eventType: 'authentication',
    result: 'failure',
    severity: 'high',
  },
  {
    level: 'info',
    source: 'System',
    message: 'Security scan completed successfully',
    eventType: 'system',
    result: 'success',
    severity: 'info',
  },
  {
    level: 'critical',
    source: 'IDS',
    sourceIP: '198.51.100.23',
    destinationIP: '10.0.0.75',
    message: 'Malware communication detected and blocked',
    eventType: 'ids',
    result: 'success',
    severity: 'critical',
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Threat.deleteMany({});
    await Alert.deleteMany({});
    await Incident.deleteMany({});
    await Log.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create threats
    console.log('🛡️  Creating threats...');
    const createdThreats = await Threat.create(threats);
    console.log(`✅ Created ${createdThreats.length} threats`);

    // Link alerts to threats
    alerts[0].threat = createdThreats[2]._id; // Malware alert
    alerts[1].threat = createdThreats[0]._id; // Brute force alert
    alerts[2].threat = createdThreats[1]._id; // Port scan alert
    alerts[3].threat = createdThreats[3]._id; // DDoS alert

    // Create alerts
    console.log('🔔 Creating alerts...');
    const createdAlerts = await Alert.create(alerts);
    console.log(`✅ Created ${createdAlerts.length} alerts`);

    // Link incidents to users and threats
    incidents[0].createdBy = createdUsers[0]._id; // Admin
    incidents[0].assignedTo = createdUsers[1]._id; // Analyst
    incidents[0].threats = [createdThreats[2]._id];
    incidents[0].alerts = [createdAlerts[0]._id];

    incidents[1].createdBy = createdUsers[1]._id; // Analyst
    incidents[1].threats = [createdThreats[0]._id];
    incidents[1].alerts = [createdAlerts[1]._id];

    // Create incidents
    console.log('📋 Creating incidents...');
    const createdIncidents = await Incident.create(incidents);
    console.log(`✅ Created ${createdIncidents.length} incidents`);

    // Create logs
    console.log('📝 Creating logs...');
    const createdLogs = await Log.create(logs);
    console.log(`✅ Created ${createdLogs.length} logs`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Threats: ${createdThreats.length}`);
    console.log(`   Alerts: ${createdAlerts.length}`);
    console.log(`   Incidents: ${createdIncidents.length}`);
    console.log(`   Logs: ${createdLogs.length}`);
    console.log('\n🔐 Default Credentials:');
    console.log('   Admin: admin@soc.com / Admin@123');
    console.log('   Analyst: analyst@soc.com / Analyst@123');
    console.log('   Viewer: viewer@soc.com / Viewer@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
