const express = require('express');
const router = express.Router();
const {
  getThreats,
  getThreat,
  createThreat,
  updateThreat,
  deleteThreat,
  getThreatStats,
  blockThreat,
} = require('../controllers/threatsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getThreats).post(authorize('admin', 'analyst'), createThreat);

router.get('/stats', getThreatStats);

router
  .route('/:id')
  .get(getThreat)
  .put(authorize('admin', 'analyst'), updateThreat)
  .delete(authorize('admin'), deleteThreat);

router.put('/:id/block', authorize('admin', 'analyst'), blockThreat);

module.exports = router;
