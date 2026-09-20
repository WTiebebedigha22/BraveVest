// src/api/firebaseAuth.js — Firebase Auth helpers
// All functions throw a clear error when Firebase is disabled.
// AuthContext only calls these if ENABLED is true.

import { auth, ENABLED } from '@/lib/firebase';

function ensureEnabled() {
  if (!ENABLED) throw new Error('Firebase is not configured');
}

export async function fbRegister({ email, password, firstName, lastName, phone }) {
  ensureEnabled();
  const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  await setDoc(doc(db, 'users', user.uid), {
    email, firstName, lastName, phone: phone || null,
    role: 'INVESTOR', kycStatus: 'NOT_STARTED',
    createdAt: serverTimestamp(),
  }, { merge: true });

  await sendEmailVerification(user).catch(() => {});
  return user;
}

export async function fbLogin({ email, password }) {
  ensureEnabled();
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function fbLoginWithGoogle() {
  ensureEnabled();
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const { doc, setDoc, getDoc, serverTimestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');

  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);

  const snap = await getDoc(doc(db, 'users', cred.user.uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      firstName: cred.user.displayName?.split(' ')[0] || 'User',
      lastName: cred.user.displayName?.split(' ').slice(1).join(' ') || '',
      role: 'INVESTOR', kycStatus: 'NOT_STARTED',
      createdAt: serverTimestamp(),
    });
  }
  return cred.user;
}

export async function fbLogout() {
  if (!ENABLED) return;
  const { signOut } = await import('firebase/auth');
  await signOut(auth);
}

export async function fbForgotPassword(email) {
  ensureEnabled();
  const { sendPasswordResetEmail } = await import('firebase/auth');
  await sendPasswordResetEmail(auth, email, { url: `${window.location.origin}/#/login` });
}

export async function fbGetIdToken(forceRefresh = false) {
  if (!ENABLED || !auth?.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}

export async function fbOnAuthChange(callback) {
  if (!ENABLED) {
    callback(null);
    return () => {};
  }
  const { onAuthStateChanged } = await import('firebase/auth');
  return onAuthStateChanged(auth, callback);
}