const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    projectType: {
      type: String,
      enum: ['Research', 'Consultancy', 'Institutional', 'Development', 'Other'],
      default: 'Research'
    },
    fundingOrganization: {
      type: String,
      required: [true, 'Funding organization is required'],
      trim: true
    },
    principalInvestigator: {
      type: String,
      required: [true, 'Principal Investigator is required'],
      trim: true
    },
    coInvestigators: {
      type: [String],
      default: []
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date
    },
    fundingAmount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Proposed', 'Ongoing', 'Completed'],
      default: 'Ongoing'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

projectSchema.index({ facultyId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ startDate: -1 });

module.exports = mongoose.model('Project', projectSchema);
