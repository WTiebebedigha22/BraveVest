// src/lib/firebase.js — Firebase Web SDK init (defensive, disabled-safe)

import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const ENABLED = Boolean(firebaseConfig.apiKey);

let app = null;
let auth = null;
let db = null;
let storage = null;
let analytics = null;

if (ENABLED) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    const { getAuth } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');
    const { getStorage } = await import('firebase/storage');

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    if (typeof window !== 'undefined') {
      try {
        const { getAnalytics, isSupported } = await import('firebase/analytics');
        const ok = await isSupported();
        if (ok) analytics = getAnalytics(app);
      } catch { /* analytics optional */ }
    }
  } catch (err) {
    console.warn('[firebase] init failed, disabling:', err.message);
  }
} else {
  console.info('[firebase] disabled — using backend JWT auth');
}

export { app, auth, db, storage, analytics, ENABLED };
export default app;
