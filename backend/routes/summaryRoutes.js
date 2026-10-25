const express = require('express');
const router = express.Router();
const {
  getCareerSummary,
  getPublicationSummary,
  getDashboardStats
} = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/career', protect, getCareerSummary);
router.get('/publications', protect, getPublicationSummary);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
