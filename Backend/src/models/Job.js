const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      default: 'Engineering',
      trim: true,
    },

    type: {
      type: String,
      enum: [
        'Full-time',
        'Part-time',
        'Contract',
        'Internship',
      ],
      default: 'Full-time',
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: [
        'Entry level',
        'Mid level',
        'Senior level',
        'Lead / Principal',
      ],
      default: 'Entry level',
    },

    salaryMin: {
      type: Number,
      default: null,
    },

    salaryMax: {
      type: Number,
      default: null,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        'Draft',
        'Active',
        'Closed',
      ],
      default: 'Draft',
      index: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);