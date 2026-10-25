const express = require('express');
const router = express.Router();
const {
  getConferences,
  getConferenceById,
  createConference,
  updateConference,
  deleteConference
} = require('../controllers/conferenceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(protect, getConferences)
  .post(protect, authorize('faculty'), createConference);

router
  .route('/:id')
  .get(protect, getConferenceById)
  .put(protect, authorize('faculty'), updateConference)
  .delete(protect, authorize('faculty'), deleteConference);

module.exports = router;
