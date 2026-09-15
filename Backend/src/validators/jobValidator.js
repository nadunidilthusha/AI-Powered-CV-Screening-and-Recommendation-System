const { body } = require('express-validator');

// TODO: define validation rules for creating/updating a job.
// Should mirror the required-field validation already enforced on the
// frontend (JobForm.jsx): Job Title, Location, and Description are required.
const jobValidator = [
  // TODO: add validation rules
];

module.exports = { jobValidator };
