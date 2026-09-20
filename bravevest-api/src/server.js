// src/server.js — bootstrap
const http = require('http');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDB, disconnectDB } = require('./config/database');
const supabaseService = require('./services/supabase.service');

let server;

async function start() {
  await connectDB();

  // Optional — verify Supabase Storage/API is reachable (non-fatal)
  try {
    const ok = await supabaseService.ping();
    if (ok) logger.info('   Supabase: ready');
    else logger.warn('   Supabase: not configured (storage/admin disabled)');
  } catch (err) {
    logger.warn('   Supabase ping failed: ' + err.message);
  }

  server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`🚀 BraveVest API running on ${env.apiBaseUrl}`);
    logger.info(`   ENV: ${env.nodeEnv}`);
    logger.info(`   CORS: ${env.frontendUrl}`);
  });
}

async function shutdown(signal) {
  logger.warn(`Received ${signal}. Shutting down gracefully…`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      logger.info('👋 Server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection:', reason);
  shutdown('unhandledRejection');
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  shutdown('uncaughtException');
});

start();
