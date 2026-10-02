require('dotenv').config();
const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'PORT'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) { console.error('❌ Missing env:', missing.join(', ')); process.exit(1); }

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  port: parseInt(process.env.PORT, 10) || 3001,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  payments: {
    provider: process.env.PAYMENT_PROVIDER || 'paystack',
    callbackUrl: process.env.PAYMENT_CALLBACK_URL,
    paystack: { secret: process.env.PAYSTACK_SECRET_KEY, public: process.env.PAYSTACK_PUBLIC_KEY },
  },
  uploads: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
  },
};
