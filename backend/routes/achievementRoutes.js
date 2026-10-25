const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(protect, getAchievements)
  .post(protect, authorize('faculty'), createAchievement);

router
  .route('/:id')
  .get(protect, getAchievementById)
  .put(protect, authorize('faculty'), updateAchievement)
  .delete(protect, authorize('faculty'), deleteAchievement);

module.exports = router;
