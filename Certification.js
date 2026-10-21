const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required']
    },
    expiryDate: {
      type: Date
    },
    credentialId: {
      type: String,
      trim: true,
      default: ''
    },
    credentialUrl: {
      type: String,
      trim: true,
      default: ''
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

certificationSchema.index({ facultyId: 1 });
certificationSchema.index({ issueDate: -1 });

module.exports = mongoose.model('Certification', certificationSchema);
