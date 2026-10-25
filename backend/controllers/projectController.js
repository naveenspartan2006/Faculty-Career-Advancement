const Project = require('../models/Project');

// @desc    Get all research & funded projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    const { search, status, projectType, facultyId } = req.query;
    const query = {};

    if (req.user.role === 'faculty') {
      query.facultyId = req.facultyId;
    } else if (facultyId) {
      query.facultyId = facultyId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { fundingOrganization: { $regex: search, $options: 'i' } },
        { principalInvestigator: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (projectType && projectType !== 'All') {
      query.projectType = projectType;
    }

    const projects = await Project.find(query).sort('-startDate');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (
      req.user.role === 'faculty' &&
      project.facultyId.toString() !== req.facultyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this project'
      });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Faculty only)
exports.createProject = async (req, res, next) => {
  try {
    let coInvestigators = req.body.coInvestigators;
    if (typeof coInvestigators === 'string') {
      coInvestigators = coInvestigators.split(',').map((c) => c.trim()).filter(Boolean);
    }

    const project = await Project.create({
      ...req.body,
      coInvestigators,
      facultyId: req.facultyId
    });

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Faculty only)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const updates = { ...req.body };
    if (typeof updates.coInvestigators === 'string') {
      updates.coInvestigators = updates.coInvestigators.split(',').map((c) => c.trim()).filter(Boolean);
    }

    project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Faculty only)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
