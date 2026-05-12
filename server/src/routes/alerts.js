const express = require('express');
const router = express.Router();
const {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  acknowledgeAlert,
  resolveAlert,
  deleteAlert,
} = require('../controllers/alertsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getAlerts).post(authorize('admin', 'analyst'), createAlert);

router
  .route('/:id')
  .get(getAlert)
  .put(authorize('admin', 'analyst'), updateAlert)
  .delete(authorize('admin'), deleteAlert);

router.put('/:id/acknowledge', acknowledgeAlert);
router.put('/:id/resolve', authorize('admin', 'analyst'), resolveAlert);

module.exports = router;
