const Faculty = require('../models/Faculty');
const User = require('../models/User');

// @desc    Get current faculty profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty only)
exports.getProfile = async (req, res, next) => {
  try {
    let faculty = await Faculty.findOne({ userId: req.user._id });
    if (!faculty) {
      faculty = await Faculty.create({
        userId: req.user._id,
        fullName: req.user.name,
        employeeId: req.user.employeeId,
        email: req.user.email,
        department: req.user.department,
        designation: req.user.designation
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current faculty profile
// @route   PUT /api/faculty/profile
// @access  Private (Faculty only)
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'fullName',
      'phone',
      'dateOfBirth',
      'gender',
      'department',
      'designation',
      'dateOfJoining',
      'highestQualification',
      'specialization',
      'researchInterests',
      'university',
      'graduationYear',
      'orcid',
      'googleScholar',
      'linkedin',
      'biography'
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Clean research interests if provided as string or array
    if (updates.researchInterests && typeof updates.researchInterests === 'string') {
      updates.researchInterests = updates.researchInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let faculty = await Faculty.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );

    // Also sync User name/department/designation if updated
    if (updates.fullName || updates.department || updates.designation) {
      await User.findByIdAndUpdate(req.user._id, {
        name: updates.fullName || req.user.name,
        department: updates.department || req.user.department,
        designation: updates.designation || req.user.designation
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty profile by ID
// @route   GET /api/faculty/:id
// @access  Private
exports.getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
};
