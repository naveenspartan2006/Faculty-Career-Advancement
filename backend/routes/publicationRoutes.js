const express = require('express');
const router = express.Router();
const {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication
} = require('../controllers/publicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(protect, getPublications)
  .post(protect, authorize('faculty'), createPublication);

router
  .route('/:id')
  .get(protect, getPublicationById)
  .put(protect, authorize('faculty'), updatePublication)
  .delete(protect, authorize('faculty'), deletePublication);

module.exports = router;
