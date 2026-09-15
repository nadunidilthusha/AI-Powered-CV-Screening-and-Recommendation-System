const { body } = require('express-validator');

// TODO: define validation rules for register (fullName, email, password, etc.)
const registerValidator = [
  // TODO: add validation rules, e.g.
  // body('email').isEmail().withMessage('A valid email is required'),
];

// TODO: define validation rules for login
const loginValidator = [
  // TODO: add validation rules
];

module.exports = { registerValidator, loginValidator };
