const { body } = require('express-validator');

const VALID_DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Operations',
];

const VALID_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];

const VALID_LEVELS = [
  'Entry level',
  'Mid level',
  'Senior level',
  'Lead / Principal',
];

const VALID_STATUSES = [
  'Draft',
  'Active',
  'Closed',
];

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
    .isIn(VALID_DEPARTMENTS)
    .withMessage(
      `Department must be one of: ${VALID_DEPARTMENTS.join(', ')}`
    ),

  body('type')
    .optional()
    .isIn(VALID_TYPES)
    .withMessage(
      `Employment type must be one of: ${VALID_TYPES.join(', ')}`
    ),

  body('level')
    .optional()
    .isIn(VALID_LEVELS)
    .withMessage(
      `Experience level must be one of: ${VALID_LEVELS.join(', ')}`
    ),

  body('salaryMin')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isFloat({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),

  body('salaryMax')
    .optional({
      nullable: true,
      checkFalsy: true,
    })
    .isFloat({ min: 0 })
    .withMessage('Maximum salary must be a positive number')
    .custom((value, { req }) => {
      const min = req.body.salaryMin;

      if (
        min != null &&
        min !== '' &&
        Number(value) < Number(min)
      ) {
        throw new Error(
          'Maximum salary must be greater than or equal to minimum salary'
        );
      }

      return true;
    }),

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
    .isIn(VALID_STATUSES)
    .withMessage(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    ),
];

module.exports = {
  jobValidator,
};