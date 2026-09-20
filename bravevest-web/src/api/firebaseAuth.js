// src/api/firebaseAuth.js — Firebase Auth helpers
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

/* ── Register ── */
export async function fbRegister({ email, password, firstName, lastName, phone }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  // Mirror user doc in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email,
    firstName,
    lastName,
    phone: phone || null,
    role: 'INVESTOR',
    kycStatus: 'NOT_STARTED',
    createdAt: serverTimestamp(),
  }, { merge: true });

  // Send verification email (optional)
  await sendEmailVerification(user).catch(() => {});

  return user;
}

/* ── Login ── */
export async function fbLogin({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/* ── Google ── */
export async function fbLoginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  // Mirror doc on first sign-in
  const snap = await getDoc(doc(db, 'users', cred.user.uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email,
      firstName: cred.user.displayName?.split(' ')[0] || 'User',
      lastName: cred.user.displayName?.split(' ').slice(1).join(' ') || '',
      role: 'INVESTOR',
      kycStatus: 'NOT_STARTED',
      createdAt: serverTimestamp(),
    });
  }
  return cred.user;
}

/* ── Logout ── */
export async function fbLogout() {
  await signOut(auth);
}

/* ── Forgot password ── */
export async function fbForgotPassword(email) {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/#/login`,
  });
}

/* ── Get ID token (send to backend on each request) ── */
export async function fbGetIdToken(forceRefresh = false) {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken(forceRefresh);
}

/* ── Subscribe to auth state ── */
export function fbOnAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
