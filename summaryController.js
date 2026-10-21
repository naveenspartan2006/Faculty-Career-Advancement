const mongoose = require('mongoose');
const Faculty = require('../models/Faculty');
const Publication = require('../models/Publication');
const Achievement = require('../models/Achievement');
const Certification = require('../models/Certification');
const Conference = require('../models/Conference');
const Project = require('../models/Project');
const { formatCareerSummary } = require('../utils/generateSummary');

// @desc    Get structured career advancement summary
// @route   GET /api/summary/career
// @access  Private
exports.getCareerSummary = async (req, res, next) => {
  try {
    let targetFacultyId = req.facultyId;

    // Admin can view any faculty's summary by passing ?facultyId=...
    if (req.user.role === 'admin' && req.query.facultyId) {
      targetFacultyId = req.query.facultyId;
    }

    if (!targetFacultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID required to generate summary'
      });
    }

    const faculty = await Faculty.findById(targetFacultyId);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const [publications, achievements, certifications, conferences, projects] = await Promise.all([
      Publication.find({ facultyId: targetFacultyId }).sort('-publicationDate'),
      Achievement.find({ facultyId: targetFacultyId }).sort('-date'),
      Certification.find({ facultyId: targetFacultyId }).sort('-issueDate'),
      Conference.find({ facultyId: targetFacultyId }).sort('-startDate'),
      Project.find({ facultyId: targetFacultyId }).sort('-startDate')
    ]);

    const summary = formatCareerSummary({
      faculty,
      publications,
      achievements,
      certifications,
      conferences,
      projects
    });

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get publication analytics & summary breakdown
// @route   GET /api/summary/publications
// @access  Private
exports.getPublicationSummary = async (req, res, next) => {
  try {
    let targetFacultyId = req.facultyId;

    if (req.user.role === 'admin' && req.query.facultyId) {
      targetFacultyId = req.query.facultyId;
    }

    if (!targetFacultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty ID required'
      });
    }

    const facultyObjectId = new mongoose.Types.ObjectId(targetFacultyId);

    // Total and type breakdown
    const typeAggregation = await Publication.aggregate([
      { $match: { facultyId: facultyObjectId } },
      { $group: { _id: '$publicationType', count: { $sum: 1 } } }
    ]);

    // Indexing breakdown
    const indexingAggregation = await Publication.aggregate([
      { $match: { facultyId: facultyObjectId } },
      { $group: { _id: '$indexing', count: { $sum: 1 } } }
    ]);

    // Status breakdown
    const statusAggregation = await Publication.aggregate([
      { $match: { facultyId: facultyObjectId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Year-wise trend
    const yearlyAggregation = await Publication.aggregate([
      { $match: { facultyId: facultyObjectId } },
      {
        $group: {
          _id: { $year: '$publicationDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Map helpers
    const typeCounts = {
      Journal: 0,
      Conference: 0,
      'Book Chapter': 0,
      Book: 0,
      Patent: 0,
      Other: 0
    };
    let total = 0;
    typeAggregation.forEach((item) => {
      if (typeCounts[item._id] !== undefined) {
        typeCounts[item._id] = item.count;
      }
      total += item.count;
    });

    const indexingCounts = {
      Scopus: 0,
      'Web of Science': 0,
      UGC: 0,
      'Google Scholar': 0,
      Other: 0,
      'Not Indexed': 0
    };
    indexingAggregation.forEach((item) => {
      if (indexingCounts[item._id] !== undefined) {
        indexingCounts[item._id] = item.count;
      }
    });

    const statusCounts = {
      Published: 0,
      Accepted: 0,
      'Under Review': 0,
      'In Progress': 0
    };
    statusAggregation.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    const yearlyTrend = yearlyAggregation.map((y) => ({
      year: y._id,
      count: y.count
    }));

    res.status(200).json({
      success: true,
      data: {
        total,
        types: typeCounts,
        indexing: indexingCounts,
        status: statusCounts,
        yearlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics for logged in faculty
// @route   GET /api/summary/dashboard
// @access  Private (Faculty)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const facultyId = req.facultyId;

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const facultyObjectId = new mongoose.Types.ObjectId(facultyId);

    const [
      totalPublications,
      journalCount,
      conferenceCount,
      totalAchievements,
      totalCertifications,
      totalConferences,
      totalProjects,
      recentPublications,
      recentAchievements,
      yearlyPubs,
      typeBreakdown,
      indexingBreakdown,
      achievementCategories
    ] = await Promise.all([
      Publication.countDocuments({ facultyId }),
      Publication.countDocuments({ facultyId, publicationType: 'Journal' }),
      Publication.countDocuments({ facultyId, publicationType: 'Conference' }),
      Achievement.countDocuments({ facultyId }),
      Certification.countDocuments({ facultyId }),
      Conference.countDocuments({ facultyId }),
      Project.countDocuments({ facultyId }),
      Publication.find({ facultyId }).sort('-publicationDate').limit(4),
      Achievement.find({ facultyId }).sort('-date').limit(3),
      Publication.aggregate([
        { $match: { facultyId: facultyObjectId } },
        {
          $group: {
            _id: { $year: '$publicationDate' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Publication.aggregate([
        { $match: { facultyId: facultyObjectId } },
        { $group: { _id: '$publicationType', count: { $sum: 1 } } }
      ]),
      Publication.aggregate([
        { $match: { facultyId: facultyObjectId } },
        { $group: { _id: '$indexing', count: { $sum: 1 } } }
      ]),
      Achievement.aggregate([
        { $match: { facultyId: facultyObjectId } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalPublications,
          journalCount,
          conferenceCount,
          totalAchievements,
          totalCertifications,
          totalConferences,
          totalProjects
        },
        recentPublications,
        recentAchievements,
        charts: {
          publicationsByYear: yearlyPubs.map((p) => ({ year: p._id, count: p.count })),
          publicationsByType: typeBreakdown.map((t) => ({ type: t._id, count: t.count })),
          publicationsByIndexing: indexingBreakdown.map((i) => ({ indexing: i._id, count: i.count })),
          achievementsByCategory: achievementCategories.map((a) => ({ category: a._id, count: a.count }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
