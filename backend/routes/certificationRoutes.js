const express = require('express');
const router = express.Router();
const {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification
} = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(protect, getCertifications)
  .post(protect, authorize('faculty'), createCertification);

router
  .route('/:id')
  .get(protect, getCertificationById)
  .put(protect, authorize('faculty'), updateCertification)
  .delete(protect, authorize('faculty'), deleteCertification);

module.exports = router;
