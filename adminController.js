const Faculty = require('../models/Faculty');
const User = require('../models/User');
const Publication = require('../models/Publication');
const Achievement = require('../models/Achievement');
const Certification = require('../models/Certification');
const Conference = require('../models/Conference');
const Project = require('../models/Project');

// @desc    Get all faculty members with academic counts (for admin directory)
// @route   GET /api/admin/faculty
// @access  Private (Admin only)
exports.getFacultyList = async (req, res, next) => {
  try {
    const { search, department, designation, page = 1, limit = 15 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (designation && designation !== 'All') {
      query.designation = designation;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const total = await Faculty.countDocuments(query);
    const facultyList = await Faculty.find(query)
      .sort('fullName')
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Populate counts for each faculty
    const enrichedFaculty = await Promise.all(
      facultyList.map(async (fac) => {
        const [pubCount, achCount, projCount, certCount] = await Promise.all([
          Publication.countDocuments({ facultyId: fac._id }),
          Achievement.countDocuments({ facultyId: fac._id }),
          Project.countDocuments({ facultyId: fac._id }),
          Certification.countDocuments({ facultyId: fac._id })
        ]);

        return {
          ...fac,
          counts: {
            publications: pubCount,
            achievements: achCount,
            projects: projCount,
            certifications: certCount
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: enrichedFaculty
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get college-wide academic statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin only)
exports.getAdminStatistics = async (req, res, next) => {
  try {
    const [
      totalFaculty,
      totalPublications,
      totalAchievements,
      totalCertifications,
      totalProjects,
      totalConferences,
      distinctDepartments,
      facultyByDeptAgg,
      pubsByTypeAgg,
      pubsByIndexingAgg,
      pubsByYearAgg
    ] = await Promise.all([
      Faculty.countDocuments(),
      Publication.countDocuments(),
      Achievement.countDocuments(),
      Certification.countDocuments(),
      Project.countDocuments(),
      Conference.countDocuments(),
      Faculty.distinct('department'),
      Faculty.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Publication.aggregate([
        { $group: { _id: '$publicationType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Publication.aggregate([
        { $group: { _id: '$indexing', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Publication.aggregate([
        {
          $group: {
            _id: { $year: '$publicationDate' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Publications by department (lookup through Faculty)
    const pubsByDeptAgg = await Publication.aggregate([
      {
        $lookup: {
          from: 'faculties',
          localField: 'facultyId',
          foreignField: '_id',
          as: 'faculty'
        }
      },
      { $unwind: '$faculty' },
      {
        $group: {
          _id: '$faculty.department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalFaculty,
          totalPublications,
          totalDepartments: distinctDepartments.length,
          totalAchievements,
          totalCertifications,
          totalProjects,
          totalConferences
        },
        charts: {
          facultyByDepartment: facultyByDeptAgg.map((d) => ({
            department: d._id || 'Unassigned',
            count: d.count
          })),
          publicationsByDepartment: pubsByDeptAgg.map((d) => ({
            department: d._id || 'General',
            count: d.count
          })),
          publicationsByType: pubsByTypeAgg.map((t) => ({
            type: t._id,
            count: t.count
          })),
          publicationsByIndexing: pubsByIndexingAgg.map((i) => ({
            indexing: i._id,
            count: i.count
          })),
          publicationsByYear: pubsByYearAgg.map((y) => ({
            year: y._id,
            count: y.count
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all publications institution-wide with filters (Admin)
// @route   GET /api/admin/publications
// @access  Private (Admin only)
exports.getAdminPublications = async (req, res, next) => {
  try {
    const { search, publicationType, indexing, department, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { journalName: { $regex: search, $options: 'i' } },
        { conferenceName: { $regex: search, $options: 'i' } },
        { doi: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } }
      ];
    }

    if (publicationType && publicationType !== 'All') {
      query.publicationType = publicationType;
    }

    if (indexing && indexing !== 'All') {
      query.indexing = indexing;
    }

    if (department && department !== 'All') {
      const faculties = await Faculty.find({ department }).select('_id');
      const facultyIds = faculties.map((f) => f._id);
      query.facultyId = { $in: facultyIds };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Publication.countDocuments(query);
    const publications = await Publication.find(query)
      .populate('facultyId', 'fullName employeeId department designation email')
      .sort('-publicationDate')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      count: publications.length,
      data: publications
    });
  } catch (error) {
    next(error);
  }
};
