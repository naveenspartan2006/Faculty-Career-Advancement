const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getFacultyById } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/profile', protect, authorize('faculty'), getProfile);
router.put('/profile', protect, authorize('faculty'), updateProfile);
router.get('/:id', protect, getFacultyById);

module.exports = router;
