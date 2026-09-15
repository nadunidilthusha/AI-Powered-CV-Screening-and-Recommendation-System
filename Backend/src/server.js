const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  // Catch unhandled promise rejections (e.g. a DB query that fails outside
  // any request context) so the process fails loudly instead of silently.
  process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.error(`Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
