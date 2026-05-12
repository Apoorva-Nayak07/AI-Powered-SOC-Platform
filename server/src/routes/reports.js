const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const generateReport = async (req, res) => {
  res.json({ success: true, report: { id: '123', type: req.body.type } });
};
const getReports = async (req, res) => {
  res.json({ success: true, reports: [] });
};
const getReport = async (req, res) => {
  res.json({ success: true, report: {} });
};

router.use(protect);
router.use(authorize('admin', 'analyst'));

router.post('/generate', generateReport);
router.get('/', getReports);
router.get('/:id', getReport);

module.exports = router;
