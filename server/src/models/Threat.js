const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'malware',
        'phishing',
        'ddos',
        'brute_force',
        'sql_injection',
        'xss',
        'port_scan',
        'unauthorized_access',
        'data_exfiltration',
        'ransomware',
        'zero_day',
        'insider_threat',
        'other',
      ],
    },
    severity: {
      type: String,
      required: true,
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'investigating', 'contained', 'resolved', 'false_positive'],
      default: 'active',
    },
    sourceIP: {
      type: String,
      required: true,
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
    description: {
      type: String,
      required: true,
    },
    indicators: {
      type: [String],
      default: [],
    },
    mitreAttack: {
      tactic: String,
      technique: String,
      id: String,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    affectedAssets: {
      type: [String],
      default: [],
    },
    geoLocation: {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    detectedBy: {
      type: String,
      enum: ['ai', 'rule', 'manual', 'integration'],
      default: 'ai',
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    blockedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
    notes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
threatSchema.index({ sourceIP: 1 });
threatSchema.index({ type: 1, severity: 1 });
threatSchema.index({ status: 1 });
threatSchema.index({ createdAt: -1 });
threatSchema.index({ riskScore: -1 });

module.exports = mongoose.model('Threat', threatSchema);
