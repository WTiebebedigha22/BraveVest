// src/app.js — Express app
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const env = require('./config/env');
const logger = require('./config/logger');
const { globalLimiter } = require('./middleware/rateLimit');
const { notFound, errorHandler } = require('./middleware/error');
const { success } = require('./utils/apiResponse');

const app = express();

// ── Security & utility ──
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: [env.frontendUrl], credentials: true }));
app.use(compression());

// JSON parser with raw body capture (needed for webhook signatures)
app.use(
  express.json({
    limit: '2mb',
    verify: (req, res, buf) => { req.rawBody = buf; },
  })
);
app.use(express.urlencoded({ extended: true }));

// ── Logging ──
app.use(
  morgan(env.isDev ? 'dev' : 'combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// ── Static uploads ──
app.use('/uploads', express.static(path.join(process.cwd(), env.uploads.dir)));

// ── Rate limit ──
app.use('/api', globalLimiter);

// ── Health ──
app.get('/health', async (req, res) => {
  let supabase = 'disabled';
  try {
    const svc = require('./services/supabase.service');
    const ok = await svc.ping();
    supabase = ok ? 'ok' : 'unconfigured';
  } catch { supabase = 'error'; }

  let firebase = 'disabled';
  try {
    const fb = require('./services/firebaseAdmin.service').init();
    firebase = fb ? 'ok' : 'unconfigured';
  } catch { firebase = 'error'; }

  res.json({
    status: 'ok',
    service: 'bravevest-api',
    env: env.nodeEnv,
    supabase,
    firebase,
    time: new Date().toISOString(),
  });
});

// ── API root ──
app.get('/api', (req, res) => {
  success(res, {
    name: 'BraveVest API',
    version: '0.1.0',
    phase: 'MVP (Phase 1 & 2)',
    docs: '/api/docs',
  });
});

// ── Feature routes ──
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/kyc', require('./modules/kyc/kyc.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));
app.use('/api/projects', require('./modules/projects/projects.routes'));
app.use('/api/investments', require('./modules/investments/investments.routes'));
app.use('/api/payments', require('./modules/payments/payments.routes'));
app.use('/api/users', require('./modules/users/users.routes'));

// ── 404 + error handlers (must be last) ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;
