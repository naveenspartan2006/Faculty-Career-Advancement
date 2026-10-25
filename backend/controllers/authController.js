const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Faculty = require('../models/Faculty');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'faculty_career_super_secret_jwt_key_2026_secure', {
    expiresIn: '7d'
  });
};

// @desc    Register a new user (Faculty or Admin)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, employeeId, department, designation } = req.body;

    // Check if user or employee ID already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { employeeId }]
    });

    if (userExists) {
      const field = userExists.email === email.toLowerCase() ? 'Email' : 'Employee ID';
      return res.status(400).json({
        success: false,
        message: `${field} is already registered. Please use another one.`
      });
    }

    // Create user
    const userRole = role && ['faculty', 'admin'].includes(role) ? role : 'faculty';
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      employeeId,
      department,
      designation
    });

    let facultyProfile = null;

    // If faculty, automatically initialize Faculty profile
    if (user.role === 'faculty') {
      facultyProfile = await Faculty.create({
        userId: user._id,
        fullName: user.name,
        employeeId: user.employeeId,
        email: user.email,
        department: user.department,
        designation: user.designation
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          department: user.department,
          designation: user.designation,
          facultyId: facultyProfile ? facultyProfile._id : null
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    let facultyId = null;
    if (user.role === 'faculty') {
      let faculty = await Faculty.findOne({ userId: user._id });
      if (!faculty) {
        // Fallback: create profile if missing
        faculty = await Faculty.create({
          userId: user._id,
          fullName: user.name,
          employeeId: user.employeeId,
          email: user.email,
          department: user.department,
          designation: user.designation
        });
      }
      facultyId = faculty._id;
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          department: user.department,
          designation: user.designation,
          facultyId
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let faculty = null;

    if (user.role === 'faculty') {
      faculty = await Faculty.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        faculty
      }
    });
  } catch (error) {
    next(error);
  }
};
