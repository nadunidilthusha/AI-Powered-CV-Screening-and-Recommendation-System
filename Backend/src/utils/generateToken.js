const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Signs a JWT for a given user document.
 * Keep the payload minimal — id and role are enough; the client
 * shouldn't need to decode the token to get user info (call /auth/me instead).
 */
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

module.exports = generateToken;
