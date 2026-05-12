const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Threat = require('../models/Threat');
const Alert = require('../models/Alert');
const Incident = require('../models/Incident');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const totalThreats = await Threat.countDocuments();
    const activeAlerts = await Alert.countDocuments({ status: { $in: ['new', 'acknowledged'] } });
    const openIncidents = await Incident.countDocuments({ status: { $in: ['open', 'investigating'] } });
    const blockedAttacks = await Threat.countDocuments({ blocked: true });

    const threatsByType = await Threat.aggregate([
      { $group: { _id: '$type', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } },
      { $limit: 5 },
    ]);

    const recentAlerts = await Alert.find()
      .sort('-createdAt')
      .limit(5)
      .select('title description severity timestamp');

    res.json({
      success: true,
      stats: {
        totalThreats,
        activeAlerts,
        openIncidents,
        blockedAttacks,
      },
      threatsByType,
      recentAlerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get threat trends
// @route   GET /api/analytics/threat-trends
// @access  Private
const getThreatTrends = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trends = await Threat.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]);

    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/threat-trends', getThreatTrends);
router.get('/threats', (req, res) => res.json({ success: true, data: [] }));
router.get('/timeline', (req, res) => res.json({ success: true, data: [] }));
router.get('/geo', (req, res) => res.json({ success: true, data: [] }));
router.get('/top-attackers', (req, res) => res.json({ success: true, data: [] }));

module.exports = router;
