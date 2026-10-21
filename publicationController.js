const Publication = require('../models/Publication');

// @desc    Get all publications (with search, filter, sort, pagination)
// @route   GET /api/publications
// @access  Private
exports.getPublications = async (req, res, next) => {
  try {
    const {
      search,
      publicationType,
      indexing,
      status,
      year,
      sort = '-publicationDate',
      page = 1,
      limit = 10,
      facultyId
    } = req.query;

    const query = {};

    // Role-based scope: faculty sees only their own, admin can filter by facultyId or see all
    if (req.user.role === 'faculty') {
      query.facultyId = req.facultyId;
    } else if (facultyId) {
      query.facultyId = facultyId;
    }

    // Keyword Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { journalName: { $regex: search, $options: 'i' } },
        { conferenceName: { $regex: search, $options: 'i' } },
        { doi: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (publicationType && publicationType !== 'All') {
      query.publicationType = publicationType;
    }

    // Filter by indexing
    if (indexing && indexing !== 'All') {
      query.indexing = indexing;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by publication year
    if (year && year !== 'All') {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      query.publicationDate = { $gte: startOfYear, $lte: endOfYear };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Publication.countDocuments(query);
    const publications = await Publication.find(query)
      .populate('facultyId', 'fullName employeeId department designation')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: publications.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: publications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single publication
// @route   GET /api/publications/:id
// @access  Private
exports.getPublicationById = async (req, res, next) => {
  try {
    const publication = await Publication.findById(req.params.id).populate(
      'facultyId',
      'fullName employeeId department designation'
    );

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    // Security check: if faculty, verify ownership
    if (
      req.user.role === 'faculty' &&
      publication.facultyId._id.toString() !== req.facultyId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this publication'
      });
    }

    res.status(200).json({
      success: true,
      data: publication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create publication
// @route   POST /api/publications
// @access  Private (Faculty only)
exports.createPublication = async (req, res, next) => {
  try {
    if (!req.facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty profile not found for this user.'
      });
    }

    // Format authors if provided as string
    let authors = req.body.authors;
    if (typeof authors === 'string') {
      authors = authors.split(',').map((a) => a.trim()).filter(Boolean);
    }

    // Format keywords if provided as string
    let keywords = req.body.keywords;
    if (typeof keywords === 'string') {
      keywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }

    const publication = await Publication.create({
      ...req.body,
      authors,
      keywords,
      facultyId: req.facultyId
    });

    res.status(201).json({
      success: true,
      message: 'Publication added successfully',
      data: publication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update publication
// @route   PUT /api/publications/:id
// @access  Private (Faculty only)
exports.updatePublication = async (req, res, next) => {
  try {
    let publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    // Ownership check
    if (publication.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this publication'
      });
    }

    const updates = { ...req.body };

    // Format authors if provided as string
    if (typeof updates.authors === 'string') {
      updates.authors = updates.authors.split(',').map((a) => a.trim()).filter(Boolean);
    }
    // Format keywords if provided as string
    if (typeof updates.keywords === 'string') {
      updates.keywords = updates.keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }

    publication = await Publication.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Publication updated successfully',
      data: publication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete publication
// @route   DELETE /api/publications/:id
// @access  Private (Faculty only)
exports.deletePublication = async (req, res, next) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    // Ownership check
    if (publication.facultyId.toString() !== req.facultyId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this publication'
      });
    }

    await publication.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Publication deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
