const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Placeholder controller functions
const getIncidents = async (req, res) => {
  res.json({ success: true, incidents: [] });
};
const getIncident = async (req, res) => {
  res.json({ success: true, incident: {} });
};
const createIncident = async (req, res) => {
  res.status(201).json({ success: true, incident: req.body });
};
const updateIncident = async (req, res) => {
  res.json({ success: true, incident: req.body });
};
const assignIncident = async (req, res) => {
  res.json({ success: true, message: 'Incident assigned' });
};
const deleteIncident = async (req, res) => {
  res.json({ success: true, message: 'Incident deleted' });
};

router.use(protect);

router.route('/').get(getIncidents).post(authorize('admin', 'analyst'), createIncident);

router
  .route('/:id')
  .get(getIncident)
  .put(authorize('admin', 'analyst'), updateIncident)
  .delete(authorize('admin'), deleteIncident);

router.put('/:id/assign', authorize('admin', 'analyst'), assignIncident);

module.exports = router;
