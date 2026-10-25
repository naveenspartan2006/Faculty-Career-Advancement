const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say'
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true
    },
    dateOfJoining: {
      type: Date
    },
    highestQualification: {
      type: String,
      default: 'Ph.D.'
    },
    specialization: {
      type: String,
      trim: true,
      default: ''
    },
    researchInterests: {
      type: [String],
      default: []
    },
    university: {
      type: String,
      trim: true,
      default: ''
    },
    graduationYear: {
      type: Number
    },
    orcid: {
      type: String,
      trim: true,
      default: ''
    },
    googleScholar: {
      type: String,
      trim: true,
      default: ''
    },
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    biography: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

facultySchema.index({ department: 1 });
facultySchema.index({ fullName: 'text', department: 'text', specialization: 'text' });

module.exports = mongoose.model('Faculty', facultySchema);
