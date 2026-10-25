const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Publication title is required'],
      trim: true
    },
    authors: {
      type: [String],
      required: [true, 'At least one author is required']
    },
    publicationType: {
      type: String,
      required: [true, 'Publication type is required'],
      enum: ['Journal', 'Conference', 'Book Chapter', 'Book', 'Patent', 'Other'],
      default: 'Journal'
    },
    journalName: {
      type: String,
      trim: true,
      default: ''
    },
    conferenceName: {
      type: String,
      trim: true,
      default: ''
    },
    publisher: {
      type: String,
      trim: true,
      default: ''
    },
    publicationDate: {
      type: Date,
      required: [true, 'Publication date is required']
    },
    volume: {
      type: String,
      trim: true,
      default: ''
    },
    issue: {
      type: String,
      trim: true,
      default: ''
    },
    pages: {
      type: String,
      trim: true,
      default: ''
    },
    doi: {
      type: String,
      trim: true,
      default: ''
    },
    issn: {
      type: String,
      trim: true,
      default: ''
    },
    isbn: {
      type: String,
      trim: true,
      default: ''
    },
    abstract: {
      type: String,
      trim: true,
      default: ''
    },
    keywords: {
      type: [String],
      default: []
    },
    indexing: {
      type: String,
      enum: ['Scopus', 'Web of Science', 'UGC', 'Google Scholar', 'Other', 'Not Indexed'],
      default: 'Not Indexed'
    },
    status: {
      type: String,
      enum: ['Published', 'Accepted', 'Under Review', 'In Progress'],
      default: 'Published'
    },
    url: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

publicationSchema.index({ facultyId: 1 });
publicationSchema.index({ publicationType: 1 });
publicationSchema.index({ indexing: 1 });
publicationSchema.index({ publicationDate: -1 });
publicationSchema.index({ title: 'text', journalName: 'text', conferenceName: 'text', doi: 'text' });

module.exports = mongoose.model('Publication', publicationSchema);
