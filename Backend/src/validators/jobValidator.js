const { body } = require('express-validator');

const jobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required'),

  body('department')
    .optional()
    .isIn([
      'Engineering',
      'Design',
      'Product',
      'Marketing',
      'Operations',
    ])
    .withMessage('Invalid department'),

  body('type')
    .optional()
    .isIn([
      'Full-time',
      'Part-time',
      'Contract',
      'Internship',
    ])
    .withMessage('Invalid employment type'),

  body('level')
    .optional()
    .isIn([
      'Entry level',
      'Mid level',
      'Senior level',
      'Lead / Principal',
    ])
    .withMessage('Invalid experience level'),

  body('salaryMin')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),

  body('salaryMax')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),

  body('skills.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each skill must be a valid string'),

  body('status')
    .optional()
    .isIn([
      'Draft',
      'Active',
      'Closed',
    ])
    .withMessage('Invalid job status'),
];

module.exports = { jobValidator };