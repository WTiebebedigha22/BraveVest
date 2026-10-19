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

// ── CORS allowlist ──────────────────────────────────────────
// Driven by FRONTEND_URLS (comma-separated). Falls back to
// FRONTEND_URL for backwards compat, then localhost.
const rawOrigins =
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  'http://localhost:5173';

const ALLOWED_ORIGINS = rawOrigins
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, cb) => {
      // no origin: curl, server-to-server, Postman
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      logger.warn('CORS blocked: ' + origin);
      cb(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isDev ? 'dev' : 'combined', { stream: { write: (m) => logger.info(m.trim()) } }));
app.use('/uploads', express.static(path.join(process.cwd(), env.uploads.dir)));
app.use('/api', globalLimiter);

app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    service: 'bravevest-api',
    env: env.nodeEnv,
    time: new Date().toISOString(),
  })
);
app.get('/api', (req, res) => success(res, { name: 'BraveVest API', version: '0.1.0' }));

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/kyc', require('./modules/kyc/kyc.routes'));
app.use('/api/projects', require('./modules/projects/projects.routes'));
app.use('/api/investments', require('./modules/investments/investments.routes'));
app.use('/api/payments', require('./modules/payments/payments.routes'));
app.use('/api/users', require('./modules/users/users.routes'));
app.use('/api/groups', require('./modules/groups/groups.routes'));
app.use('/api/goals', require('./modules/goals/goals.routes'));
app.use('/api/streaks', require('./modules/streaks/streaks.routes'));
app.use('/api/insights', require('./modules/insights/insights.routes'));
app.use('/api/referrals', require('./modules/referrals/referrals.routes'));
app.use('/api/admin', require('./modules/admin/admin.routes'));

app.use('/api/funding', require('./modules/funding/commitment.routes'));
app.use('/api/funding', require('./modules/funding/funding.routes'));

app.use('/api/contact', require('./modules/contact/contact.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
