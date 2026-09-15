const mongoose = require('mongoose');

// TODO: define the Job schema (title, department, location, description,
// status, etc.) — should match the fields used in the frontend's JobForm.
const jobSchema = new mongoose.Schema(
  {
    // TODO: add fields
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
