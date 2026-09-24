const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    description: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    experienceLevel: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'Draft'],
      default: 'Open',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);