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
app.use(helmet()); // sets safe HTTP headers
app.use(
  cors({
    origin: env.clientUrl, // matches the frontend's Vite dev server URL
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev')); // request logging in dev only
}

app.use(apiLimiter); // SEC: throttle abusive traffic globally
app.use(attachResponseHelpers); // adds res.success(...) to every response

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
