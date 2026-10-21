const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['Conference', 'Workshop', 'Seminar', 'FDP', 'Webinar', 'Symposium', 'Other'],
      default: 'Conference'
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date
    },
    role: {
      type: String,
      enum: ['Participant', 'Speaker', 'Presenter', 'Organizer', 'Chairperson'],
      default: 'Participant'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    referenceUrl: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

conferenceSchema.index({ facultyId: 1 });
conferenceSchema.index({ eventType: 1 });
conferenceSchema.index({ startDate: -1 });

module.exports = mongoose.model('Conference', conferenceSchema);
