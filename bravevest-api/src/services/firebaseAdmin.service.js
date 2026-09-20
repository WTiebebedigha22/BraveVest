// src/services/firebaseAdmin.service.js — Firebase Admin SDK singleton
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let initialized = false;

function init() {
  if (initialized) return admin;

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasEnvCreds =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.includes('REPLACE_WITH_REAL_KEY');

  if (credPath && fs.existsSync(path.resolve(credPath))) {
    admin.initializeApp({
      credential: admin.credential.cert(require(path.resolve(credPath))),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    initialized = true;
    return admin;
  }

  if (hasEnvCreds) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    initialized = true;
    return admin;
  }

  // Not configured — return null so callers can fall back to JWT
  return null;
}

async function verifyIdToken(idToken) {
  const a = init();
  if (!a) return null;
  try {
    return await a.auth().verifyIdToken(idToken);
  } catch {
    return null;
  }
}

module.exports = { init, verifyIdToken };
