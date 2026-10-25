const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Award', 'Research', 'Teaching', 'Innovation', 'Academic', 'Professional', 'Other'],
      default: 'Award'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    level: {
      type: String,
      enum: ['Institution', 'Department', 'State', 'National', 'International'],
      default: 'National'
    },
    certificateNumber: {
      type: String,
      trim: true,
      default: ''
    },
    verificationUrl: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

achievementSchema.index({ facultyId: 1 });
achievementSchema.index({ category: 1 });
achievementSchema.index({ level: 1 });
achievementSchema.index({ date: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);
