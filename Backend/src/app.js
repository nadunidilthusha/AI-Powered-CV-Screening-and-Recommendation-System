const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { attachResponseHelpers } = require('./utils/apiResponse');

const app = express();

// ─────────────────────────────────────────────────────────
// Security & core middleware
// ─────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use(apiLimiter);
app.use(attachResponseHelpers);

// ─────────────────────────────────────────────────────────
// DEV-ONLY AUTH BYPASS
//
// Signs a JWT for a known dev user and injects it into the request
// so protected routes can be tested without hitting /api/auth/login.
//
// ACTIVATE WITH HEADER:   x-dev-user: 1
//
// GUARDED BY: env.nodeEnv === 'development'
//   → cannot fire in production even if the code is left in place.
//
// TODO(team): remove this block once /api/auth/login is implemented.
// ─────────────────────────────────────────────────────────
if (env.nodeEnv === 'development') {
  const jwt = require('jsonwebtoken');

  // Must correspond to a user that exists in MongoDB.
  const DEV_USER_ID = '6aaa8244b24513046c2e4bba';   // Thisuli Upload Test
  const DEV_USER_ROLE = 'hr_manager';

  app.use((req, res, next) => {
    if (req.headers['x-dev-user'] === '1') {
      if (!env.jwtSecret) {
        // eslint-disable-next-line no-console
        console.warn('[dev-auth] x-dev-user used but JWT_SECRET is not set.');
        return next();
      }
      const token = jwt.sign(
        { id: DEV_USER_ID, role: DEV_USER_ROLE },
        env.jwtSecret,
        { expiresIn: '7d' },
      );
      req.headers.authorization = `Bearer ${token}`;
    }
    next();
  });
}

// ─────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────
app.use('/api', routes);

// ─────────────────────────────────────────────────────────
// Error handling — MUST be last, in this exact order
// ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;