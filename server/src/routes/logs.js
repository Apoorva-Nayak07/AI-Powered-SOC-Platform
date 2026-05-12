const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const getLogs = async (req, res) => {
  res.json({ success: true, logs: [] });
};
const getLog = async (req, res) => {
  res.json({ success: true, log: {} });
};
const searchLogs = async (req, res) => {
  res.json({ success: true, logs: [] });
};

router.use(protect);
router.use(authorize('admin', 'analyst'));

router.get('/', getLogs);
router.get('/:id', getLog);
router.post('/search', searchLogs);

module.exports = router;
