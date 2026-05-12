const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    level: {
      type: String,
      enum: ['debug', 'info', 'warning', 'error', 'critical'],
      default: 'info',
    },
    source: {
      type: String,
      required: true,
    },
    sourceIP: {
      type: String,
    },
    destinationIP: {
      type: String,
    },
    sourcePort: {
      type: Number,
    },
    destinationPort: {
      type: Number,
    },
    protocol: {
      type: String,
    },
    action: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        'authentication',
        'authorization',
        'network',
        'system',
        'application',
        'database',
        'firewall',
        'ids',
        'other',
      ],
      default: 'other',
    },
    user: {
      type: String,
    },
    result: {
      type: String,
      enum: ['success', 'failure', 'unknown'],
      default: 'unknown',
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      default: 'info',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    tags: {
      type: [String],
      default: [],
    },
    analyzed: {
      type: Boolean,
      default: false,
    },
    anomalyScore: {
      type: Number,
      min: 0,
      max: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
logSchema.index({ timestamp: -1 });
logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ source: 1, timestamp: -1 });
logSchema.index({ sourceIP: 1 });
logSchema.index({ eventType: 1, timestamp: -1 });
logSchema.index({ analyzed: 1 });

// TTL index to automatically delete old logs after 90 days
logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Log', logSchema);
