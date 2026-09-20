// src/config/env.js — validated env loader
require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'PORT'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing required env vars:', missing.join(', '));
  console.error('   Check bravevest-api/.env');
  process.exit(1);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV !== 'production',

  port: parseInt(process.env.PORT, 10) || 3001,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || null,

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  payments: {
    paystack: {
      secret: process.env.PAYSTACK_SECRET_KEY,
      public: process.env.PAYSTACK_PUBLIC_KEY,
    },
    flutterwave: {
      secret: process.env.FLUTTERWAVE_SECRET_KEY,
      public: process.env.FLUTTERWAVE_PUBLIC_KEY,
    },
  },

  kyc: {
    provider: process.env.KYC_PROVIDER || 'smile_identity',
    smile: {
      apiKey: process.env.SMILE_IDENTITY_API_KEY,
      partnerId: process.env.SMILE_IDENTITY_PARTNER_ID,
    },
    verifyme: {
      apiKey: process.env.VERIFYME_API_KEY,
    },
  },

  notifications: {
    sendgrid: { apiKey: process.env.SENDGRID_API_KEY },
    termii: {
      apiKey: process.env.TERMII_API_KEY,
      senderId: process.env.TERMII_SENDER_ID || 'BraveVest',
    },
    emailFrom: process.env.EMAIL_FROM || 'BraveVest <no-reply@bravevest.com>',
  },

  uploads: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
  },
};

module.exports = env;
