const Conference = require('../models/Conference');

// @desc    Get all conferences/workshops
// @route   GET /api/conferences
// @access  Private
exports.getConferences = async (req, res, next) => {
  try {
    const { search, eventType, role, facultyId } = req.query;
    const query = {};

    if (req.user.role === 'faculty') {
      query.facultyId = req.facultyId;
    } else if (facultyId) {
      query.facultyId = facultyId;
    }

    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (eventType && eventType !== 'All') {
      query.eventType = eventType;
    }

    if (role && role !== 'All') {
      query.role = role;
    }

    const conferences = await Conference.find(query).sort('-startDate');

    res.status(200).json({
      success: true,
      count: conferences.length,
      data: conferences
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conference
// @route   GET /api/conferences/:id
// @access  Private
exports.getConferenceById = async (req, res, next) => {
  try {
    const conference = await Conference.findById(req.params.id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (
      req.user.role === 'faculty' &&
      conference.facultyId.toString() !== req.facultyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this event'
      });
    }

    res.status(200).json({
      success: true,
      data: conference
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create conference / workshop record
// @route   POST /api/conferences
// @access  Private (Faculty only)
exports.createConference = async (req, res, next) => {
  try {
    const conference = await Conference.create({
      ...req.body,
      facultyId: req.facultyId
    });

    res.status(201).json({
      success: true,
      message: 'Event record added successfully',
      data: conference
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update conference / workshop
// @route   PUT /api/conferences/:id
// @access  Private (Faculty only)
exports.updateConference = async (req, res, next) => {
  try {
    let conference = await Conference.findById(req.params.id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (conference.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    conference = await Conference.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: conference
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete conference / workshop
// @route   DELETE /api/conferences/:id
// @access  Private (Faculty only)
exports.deleteConference = async (req, res, next) => {
  try {
    const conference = await Conference.findById(req.params.id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (conference.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await conference.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
