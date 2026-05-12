const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'investigating', 'contained', 'resolved', 'closed'],
      default: 'open',
    },
    category: {
      type: String,
      enum: [
        'security_breach',
        'data_leak',
        'malware_infection',
        'ddos_attack',
        'unauthorized_access',
        'policy_violation',
        'system_compromise',
        'other',
      ],
      default: 'other',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    threats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Threat',
      },
    ],
    alerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert',
      },
    ],
    affectedSystems: {
      type: [String],
      default: [],
    },
    affectedUsers: {
      type: [String],
      default: [],
    },
    timeline: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        action: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        description: String,
      },
    ],
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
    containmentActions: {
      type: [String],
      default: [],
    },
    rootCause: {
      type: String,
    },
    resolution: {
      type: String,
    },
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
incidentSchema.index({ status: 1, severity: 1 });
incidentSchema.index({ assignedTo: 1 });
incidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
