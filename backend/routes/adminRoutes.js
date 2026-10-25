const express = require('express');
const router = express.Router();
const {
  getFacultyList,
  getAdminStatistics,
  getAdminPublications
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));

router.get('/faculty', getFacultyList);
router.get('/statistics', getAdminStatistics);
router.get('/publications', getAdminPublications);

module.exports = router;
