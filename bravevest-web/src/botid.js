import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    { path: '/api/auth/register', method: 'POST' },
    { path: '/api/auth/login', method: 'POST' },
    { path: '/api/auth/forgot-password', method: 'POST' },
    { path: '/api/auth/reset-password', method: 'POST' },
    { path: '/api/auth/otp/*', method: 'POST' },
    { path: '/api/contact', method: 'POST' },
  ],
});