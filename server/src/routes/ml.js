const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @desc    Predict anomaly
// @route   POST /api/ml/predict
// @access  Private
const predict = async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/predict`, req.body);
    res.json({ success: true, ...response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ML service unavailable',
      error: error.message,
    });
  }
};

// @desc    Analyze threat
// @route   POST /api/ml/analyze
// @access  Private
const analyze = async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/analyze`, req.body);
    res.json({ success: true, ...response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ML service unavailable',
      error: error.message,
    });
  }
};

// @desc    Get AI insights
// @route   GET /api/ml/insights
// @access  Private
const getInsights = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/insights`);
    res.json({ success: true, ...response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ML service unavailable',
      error: error.message,
    });
  }
};

router.use(protect);

router.post('/predict', predict);
router.post('/analyze', analyze);
router.get('/insights', getInsights);

module.exports = router;
