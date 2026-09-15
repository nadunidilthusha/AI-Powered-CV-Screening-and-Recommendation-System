const mongoose = require('mongoose');

// Embedded AI Evaluation Schema
const aiEvaluationSchema = new mongoose.Schema({
  matchPercentage: { type: Number, default: 0 },
  recommendationStatus: { 
    type: String, 
    enum: ['Highly Recommended', 'Recommended', 'Not Recommended', 'Pending'],
    default: 'Pending'
  },
  matchingSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  justification: { type: String },
});

// Main Candidate Schema
const candidateSchema = new mongoose.Schema(
  {
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Job', 
      required: true 
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    education: { type: String },
    experience: { type: String },
    technicalSkills: [{ type: String }],
    cvUrl: { type: String, required: true }, 
    status: { 
      type: String, 
      enum: ['Pending', 'Processing', 'Complete', 'Failed'],
      default: 'Pending'
    },
    aiEvaluation: aiEvaluationSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);