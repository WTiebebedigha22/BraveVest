const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDB, disconnectDB } = require('./config/database');

let server;
async function start() {
  await connectDB();
  server = http.createServer(app);
  server.listen(env.port, () => {
    logger.info('🚀 BraveVest API running on ' + env.apiBaseUrl);
    logger.info('   ENV: ' + env.nodeEnv);
    logger.info('   CORS: ' + env.frontendUrl);
  });
}
async function shutdown(signal) {
  logger.warn('Received ' + signal + '. Shutting down…');
  if (server) server.close(async () => { await disconnectDB(); process.exit(0); });
  else process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (r) => { logger.error('Unhandled:', r); shutdown('unhandledRejection'); });
process.on('uncaughtException', (e) => { logger.error('Uncaught:', e); shutdown('uncaughtException'); });
start();
