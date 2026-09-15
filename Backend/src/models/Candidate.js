const mongoose = require('mongoose');

// TODO: define the Candidate schema (resume file info, extracted CV data,
// AI match score, recommendation, processing status, etc.)
const candidateSchema = new mongoose.Schema(
  {
    // TODO: add fields
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);
