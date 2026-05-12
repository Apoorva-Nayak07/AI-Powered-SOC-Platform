const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
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
      enum: ['critical', 'high', 'medium', 'low', 'info'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['new', 'acknowledged', 'investigating', 'resolved', 'false_positive'],
      default: 'new',
    },
    category: {
      type: String,
      enum: [
        'intrusion',
        'malware',
        'policy_violation',
        'anomaly',
        'vulnerability',
        'compliance',
        'system',
        'other',
      ],
      default: 'other',
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
    affectedAssets: {
      type: [String],
      default: [],
    },
    threat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Threat',
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
    resolution: {
      type: String,
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
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
alertSchema.index({ severity: 1, status: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
