const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'Open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

