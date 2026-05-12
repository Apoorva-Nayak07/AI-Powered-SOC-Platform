const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Socket.IO authentication middleware
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

// Initialize Socket.IO
exports.initializeSocket = (io) => {
  // Apply authentication middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.user.name} (${socket.id})`);

    // Join user-specific room
    socket.join(`user:${socket.user._id}`);

    // Join role-based rooms
    socket.join(`role:${socket.user.role}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.name} (${socket.id})`);
    });

    // Subscribe to specific threat types
    socket.on('subscribe:threats', (threatTypes) => {
      threatTypes.forEach((type) => {
        socket.join(`threat:${type}`);
      });
      socket.emit('subscribed', { types: threatTypes });
    });

    // Unsubscribe from threat types
    socket.on('unsubscribe:threats', (threatTypes) => {
      threatTypes.forEach((type) => {
        socket.leave(`threat:${type}`);
      });
      socket.emit('unsubscribed', { types: threatTypes });
    });

    // Acknowledge alert
    socket.on('alert:acknowledge', (alertId) => {
      io.emit('alert:acknowledged', { alertId, user: socket.user.name });
    });

    // Request real-time stats
    socket.on('request:stats', () => {
      // This would be populated with real stats
      socket.emit('stats:update', {
        threats: 0,
        alerts: 0,
        incidents: 0,
      });
    });
  });

  // Store io instance globally for use in other modules
  global.io = io;
};

// Helper function to emit events
exports.emitSecurityEvent = (event) => {
  if (global.io) {
    global.io.emit('security:event', event);
  }
};

exports.emitThreatDetected = (threat) => {
  if (global.io) {
    global.io.emit('threat:detected', threat);
    global.io.to(`threat:${threat.type}`).emit('threat:specific', threat);
  }
};

exports.emitNewAlert = (alert) => {
  if (global.io) {
    global.io.emit('alert:new', alert);
    
    // Send to specific roles based on severity
    if (alert.severity === 'critical' || alert.severity === 'high') {
      global.io.to('role:admin').emit('alert:priority', alert);
      global.io.to('role:analyst').emit('alert:priority', alert);
    }
  }
};

exports.emitIncidentCreated = (incident) => {
  if (global.io) {
    global.io.emit('incident:created', incident);
    global.io.to('role:admin').emit('incident:notification', incident);
    global.io.to('role:analyst').emit('incident:notification', incident);
  }
};

exports.emitIncidentUpdated = (incident) => {
  if (global.io) {
    global.io.emit('incident:updated', incident);
    
    // Notify assigned user
    if (incident.assignedTo) {
      global.io.to(`user:${incident.assignedTo}`).emit('incident:assigned', incident);
    }
  }
};

exports.emitSystemNotification = (notification) => {
  if (global.io) {
    global.io.emit('system:notification', notification);
  }
};
