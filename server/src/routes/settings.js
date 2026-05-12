const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const getSettings = async (req, res) => {
  res.json({ success: true, settings: {} });
};
const updateSettings = async (req, res) => {
  res.json({ success: true, settings: req.body });
};

router.use(protect);

router.route('/').get(getSettings).put(updateSettings);

module.exports = router;
