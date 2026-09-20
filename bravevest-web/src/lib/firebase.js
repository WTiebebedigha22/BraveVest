// src/lib/firebase.js — Firebase Web SDK init
// Import only what you use. Tree-shaken by Vite in prod.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';

/* ─────────────────────────────────────────────────────────
   Firebase public config (safe in browser — protected by
   Firebase Security Rules on the project side).
   ───────────────────────────────────────────────────────── */

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Guard: fail loudly if env is missing (e.g. forgot to restart Vite)
const missing = Object.entries(firebaseConfig)
  .filter(([k, v]) => !v && k !== 'measurementId')
  .map(([k]) => k);

if (missing.length) {
  console.warn(
    '[firebase] Missing config:',
    missing.join(', '),
    '— check bravevest-web/.env.local and restart Vite'
  );
}

/* ─────────────────────────────────────────────────────────
   Init (idempotent — safe under React StrictMode double-mount)
   ───────────────────────────────────────────────────────── */

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

// Analytics is browser-only and unsupported in some environments — guard.
export let analytics = null;
if (typeof window !== 'undefined') {
  analyticsSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(app); })
    .catch(() => { /* ignore */ });
}

/* ─────────────────────────────────────────────────────────
   Emulator hooks (opt-in via .env: VITE_USE_FIREBASE_EMULATORS=true)
   ───────────────────────────────────────────────────────── */

if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  console.info('[firebase] Using local emulators');
}

export default app;
