const mongoose = require('mongoose');

// Embedded AI Evaluation Schema
const aiEvaluationSchema = new mongoose.Schema(
  {
    matchPercentage: {
      type: Number,
      default: 0,
    },

    recommendationStatus: {
      type: String,
      enum: [
        'Highly Recommended',
        'Recommended',
        'Not Recommended',
        'Pending',
      ],
      default: 'Pending',
    },

    matchingSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    justification: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  }
);

// Main Candidate Schema
const candidateSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },

    /*
      Candidate details are optional during initial CV upload.

      These fields can be populated later by the CV extraction /
      AI processing stage.
    */
    name: {
      type: String,
      default: '',
      trim: true,
    },

    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: '',
    },

    education: {
      type: String,
      default: '',
    },

    experience: {
      type: String,
      default: '',
    },

    technicalSkills: [
      {
        type: String,
      },
    ],

    /*
      Relative path of the stored CV.

      Example:
      uploads/1723456789-123456789.pdf
    */
    cvUrl: {
      type: String,
      required: true,
    },

    // Original filename uploaded by the HR manager.
    originalFileName: {
      type: String,
      required: true,
    },

    // File size in bytes.
    fileSize: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Complete',
        'Failed',
      ],
      default: 'Pending',
      index: true,
    },

    // Optional error message if CV processing fails.
    processingError: {
      type: String,
      default: '',
    },

    aiEvaluation: {
      type: aiEvaluationSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Candidate',
  candidateSchema
);