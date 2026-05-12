const Threat = require('../models/Threat');
const { asyncHandler } = require('../middleware/errorHandler');
const { emitThreatDetected } = require('../sockets');

// @desc    Get all threats
// @route   GET /api/threats
// @access  Private
exports.getThreats = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    severity,
    type,
    status,
    sortBy = '-createdAt',
  } = req.query;

  const query = {};

  if (severity) query.severity = severity;
  if (type) query.type = type;
  if (status) query.status = status;

  const threats = await Threat.find(query)
    .sort(sortBy)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('resolvedBy', 'name email');

  const count = await Threat.countDocuments(query);

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    threats,
  });
});

// @desc    Get single threat
// @route   GET /api/threats/:id
// @access  Private
exports.getThreat = asyncHandler(async (req, res) => {
  const threat = await Threat.findById(req.params.id)
    .populate('resolvedBy', 'name email')
    .populate('notes.user', 'name email');

  if (!threat) {
    return res.status(404).json({
      success: false,
      message: 'Threat not found',
    });
  }

  res.json({
    success: true,
    threat,
  });
});

// @desc    Create new threat
// @route   POST /api/threats
// @access  Private (Admin, Analyst)
exports.createThreat = asyncHandler(async (req, res) => {
  const threat = await Threat.create(req.body);

  // Emit socket event
  emitThreatDetected(threat);

  res.status(201).json({
    success: true,
    threat,
  });
});

// @desc    Update threat
// @route   PUT /api/threats/:id
// @access  Private (Admin, Analyst)
exports.updateThreat = asyncHandler(async (req, res) => {
  let threat = await Threat.findById(req.params.id);

  if (!threat) {
    return res.status(404).json({
      success: false,
      message: 'Threat not found',
    });
  }

  // If status is being changed to resolved
  if (req.body.status === 'resolved' && threat.status !== 'resolved') {
    req.body.resolvedBy = req.user.id;
    req.body.resolvedAt = Date.now();
  }

  threat = await Threat.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    threat,
  });
});

// @desc    Delete threat
// @route   DELETE /api/threats/:id
// @access  Private (Admin)
exports.deleteThreat = asyncHandler(async (req, res) => {
  const threat = await Threat.findById(req.params.id);

  if (!threat) {
    return res.status(404).json({
      success: false,
      message: 'Threat not found',
    });
  }

  await threat.deleteOne();

  res.json({
    success: true,
    message: 'Threat deleted',
  });
});

// @desc    Get threat statistics
// @route   GET /api/threats/stats
// @access  Private
exports.getThreatStats = asyncHandler(async (req, res) => {
  const stats = await Threat.aggregate([
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 },
      },
    },
  ]);

  const typeStats = await Threat.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusStats = await Threat.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalThreats = await Threat.countDocuments();
  const activeThreats = await Threat.countDocuments({ status: 'active' });
  const blockedThreats = await Threat.countDocuments({ blocked: true });

  res.json({
    success: true,
    stats: {
      total: totalThreats,
      active: activeThreats,
      blocked: blockedThreats,
      bySeverity: stats,
      byType: typeStats,
      byStatus: statusStats,
    },
  });
});

// @desc    Block threat
// @route   PUT /api/threats/:id/block
// @access  Private (Admin, Analyst)
exports.blockThreat = asyncHandler(async (req, res) => {
  const threat = await Threat.findById(req.params.id);

  if (!threat) {
    return res.status(404).json({
      success: false,
      message: 'Threat not found',
    });
  }

  threat.blocked = true;
  threat.blockedAt = Date.now();
  threat.status = 'contained';

  await threat.save();

  res.json({
    success: true,
    message: 'Threat blocked successfully',
    threat,
  });
});
