// src/services/email.service.js — nodemailer transporter
const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../config/logger');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  // Dev: log-only transport
  if (env.isDev && !env.notifications.sendgrid.apiKey) {
    transporter = {
      async sendMail(opts) {
        logger.info('[EMAIL:dev]', opts.subject, '→', opts.to);
        return { messageId: 'dev-' + Date.now(), dev: true };
      },
    };
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    auth: {
      user: process.env.SMTP_USER || 'apikey',
      pass: env.notifications.sendgrid.apiKey,
    },
  });
  return transporter;
}

async function send({ to, subject, html, text }) {
  const t = getTransporter();
  try {
    const info = await t.sendMail({
      from: env.notifications.emailFrom,
      to, subject, html: html || text, text,
    });
    logger.info(`Email sent: ${subject} → ${to}`);
    return info;
  } catch (err) {
    logger.error(`Email failed (${subject} → ${to}): ${err.message}`);
    return { error: err.message };
  }
}

module.exports = { send };
