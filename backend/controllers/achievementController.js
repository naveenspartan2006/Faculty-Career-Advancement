const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Private
exports.getAchievements = async (req, res, next) => {
  try {
    const { search, category, level, sort = '-date', facultyId } = req.query;
    const query = {};

    if (req.user.role === 'faculty') {
      query.facultyId = req.facultyId;
    } else if (facultyId) {
      query.facultyId = facultyId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    const achievements = await Achievement.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single achievement
// @route   GET /api/achievements/:id
// @access  Private
exports.getAchievementById = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (
      req.user.role === 'faculty' &&
      achievement.facultyId.toString() !== req.facultyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this achievement'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create achievement
// @route   POST /api/achievements
// @access  Private (Faculty only)
exports.createAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create({
      ...req.body,
      facultyId: req.facultyId
    });

    res.status(201).json({
      success: true,
      message: 'Achievement added successfully',
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private (Faculty only)
exports.updateAchievement = async (req, res, next) => {
  try {
    let achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (achievement.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this achievement'
      });
    }

    achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Faculty only)
exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    if (achievement.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this achievement'
      });
    }

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
