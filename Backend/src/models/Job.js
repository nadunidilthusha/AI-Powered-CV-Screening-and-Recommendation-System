const mongoose = require('mongoose');

/**
 * Job posting schema.
 * Field names match exactly what the frontend's JobForm.jsx sends and
 * expects back (title, department, type, location, level, salaryMin,
 * salaryMax, description, skills, status) — no field-name translation
 * needed between frontend and backend.
 */
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: ['Engineering', 'Design', 'Product', 'Marketing', 'Operations'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Entry level', 'Mid level', 'Senior level', 'Lead / Principal'],
      default: 'Entry level',
    },
    salaryMin: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative'],
    },
    salaryMax: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative'],
      validate: {
        validator: function (value) {
          // Only enforce the relationship if both values are actually set.
          if (this.salaryMin == null || value == null) return true;
          return value >= this.salaryMin;
        },
        message: 'Maximum salary must be greater than or equal to minimum salary',
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Closed'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Powers the frontend's job search box (title/department search).
jobSchema.index({ title: 'text', department: 'text' });

module.exports = mongoose.model('Job', jobSchema);