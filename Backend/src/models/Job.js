const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },

    department: {
      type: String,
      enum: [
        'Engineering',
        'Design',
        'Product',
        'Marketing',
        'Operations',
      ],
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
      required: [true, 'Location is required'],
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
      min: [0, 'Minimum salary cannot be negative'],
    },

    salaryMax: {
      type: Number,
      default: null,
      min: [0, 'Maximum salary cannot be negative'],
    },

    description: {
      type: String,
      required: [true, 'Job description is required'],
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({
  title: 'text',
  department: 'text',
});

module.exports = mongoose.model('Job', jobSchema);