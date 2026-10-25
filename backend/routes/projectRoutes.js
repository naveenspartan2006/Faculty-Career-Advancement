const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('faculty'), createProject);

router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, authorize('faculty'), updateProject)
  .delete(protect, authorize('faculty'), deleteProject);

module.exports = router;
