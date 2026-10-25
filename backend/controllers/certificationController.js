const Certification = require('../models/Certification');

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Private
exports.getCertifications = async (req, res, next) => {
  try {
    const { search, facultyId } = req.query;
    const query = {};

    if (req.user.role === 'faculty') {
      query.facultyId = req.facultyId;
    } else if (facultyId) {
      query.facultyId = facultyId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { issuingOrganization: { $regex: search, $options: 'i' } },
        { credentialId: { $regex: search, $options: 'i' } }
      ];
    }

    const certifications = await Certification.find(query).sort('-issueDate');

    res.status(200).json({
      success: true,
      count: certifications.length,
      data: certifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certification
// @route   GET /api/certifications/:id
// @access  Private
exports.getCertificationById = async (req, res, next) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    if (
      req.user.role === 'faculty' &&
      certification.facultyId.toString() !== req.facultyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this certification'
      });
    }

    res.status(200).json({
      success: true,
      data: certification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create certification
// @route   POST /api/certifications
// @access  Private (Faculty only)
exports.createCertification = async (req, res, next) => {
  try {
    const certification = await Certification.create({
      ...req.body,
      facultyId: req.facultyId
    });

    res.status(201).json({
      success: true,
      message: 'Certification added successfully',
      data: certification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private (Faculty only)
exports.updateCertification = async (req, res, next) => {
  try {
    let certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    if (certification.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this certification'
      });
    }

    certification = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      data: certification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private (Faculty only)
exports.deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }

    if (certification.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this certification'
      });
    }

    await certification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
