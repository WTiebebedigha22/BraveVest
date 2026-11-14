const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDB, disconnectDB } = require('./config/database');

let server;

async function start() {
  // ── Database connectivity check ────────────────────────
  try {
    await connectDB();
    logger.info('✔ Connected to database');
  } catch (err) {
    logger.error('✖ Failed to connect to database: ' + (err.message || err));
    process.exit(1);
  }

  // ── HTTP server ────────────────────────────────────────
  server = http.createServer(app);
  server.listen(env.port, () => {
    logger.info('🚀 BraveVest API running on ' + env.apiBaseUrl);
    logger.info('   ENV: ' + env.nodeEnv);
    logger.info('   CORS: ' + env.frontendUrl);
  });
}

async function shutdown(signal) {
  logger.warn('Received ' + signal + '. Shutting down…');
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logger.error('Shutdown error: ' + (err.message || err));
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (r) => { logger.error('Unhandled:', r); shutdown('unhandledRejection'); });
process.on('uncaughtException', (e) => { logger.error('Uncaught:', e); shutdown('uncaughtException'); });

start();