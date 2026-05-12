const Alert = require('../models/Alert');
const { asyncHandler } = require('../middleware/errorHandler');
const { emitNewAlert } = require('../sockets');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    severity,
    status,
    category,
    sortBy = '-createdAt',
  } = req.query;

  const query = {};

  if (severity) query.severity = severity;
  if (status) query.status = status;
  if (category) query.category = category;

  const alerts = await Alert.find(query)
    .sort(sortBy)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('acknowledgedBy resolvedBy', 'name email')
    .populate('threat', 'type severity sourceIP');

  const count = await Alert.countDocuments(query);

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    alerts,
  });
});

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Private
exports.getAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
    .populate('acknowledgedBy resolvedBy', 'name email')
    .populate('threat', 'type severity sourceIP description');

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found',
    });
  }

  res.json({
    success: true,
    alert,
  });
});

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private (Admin, Analyst)
exports.createAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.create(req.body);

  // Emit socket event
  emitNewAlert(alert);

  res.status(201).json({
    success: true,
    alert,
  });
});

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private (Admin, Analyst)
exports.updateAlert = asyncHandler(async (req, res) => {
  let alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found',
    });
  }

  alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    alert,
  });
});

// @desc    Acknowledge alert
// @route   PUT /api/alerts/:id/acknowledge
// @access  Private
exports.acknowledgeAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found',
    });
  }

  alert.status = 'acknowledged';
  alert.acknowledgedBy = req.user.id;
  alert.acknowledgedAt = Date.now();

  await alert.save();

  res.json({
    success: true,
    message: 'Alert acknowledged',
    alert,
  });
});

// @desc    Resolve alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private (Admin, Analyst)
exports.resolveAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found',
    });
  }

  alert.status = 'resolved';
  alert.resolvedBy = req.user.id;
  alert.resolvedAt = Date.now();
  alert.resolution = req.body.resolution;

  await alert.save();

  res.json({
    success: true,
    message: 'Alert resolved',
    alert,
  });
});

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private (Admin)
exports.deleteAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id);

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found',
    });
  }

  await alert.deleteOne();

  res.json({
    success: true,
    message: 'Alert deleted',
  });
});
