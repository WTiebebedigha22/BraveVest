import { createContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { tokens } from '@/api/client';
import {
  fbRegister, fbLogin, fbLogout, fbOnAuthChange, fbGetIdToken,
} from '@/api/firebaseAuth';
import { fbGetUser } from '@/api/firebaseDb';

export const AuthContext = createContext(null);

/*
  Dual-mode auth:

  · If Firebase is configured (VITE_FIREBASE_API_KEY present), the context
    uses Firebase Auth and syncs the user profile from Firestore.
  · Otherwise it falls back to the legacy JWT flow (backend /api/auth).
    This keeps the app working in dev even if Firebase env vars are missing.
*/

const USE_FIREBASE = !!import.meta.env.VITE_FIREBASE_API_KEY;

async function hydrateBackendProfile() {
  // Fetch the full user record from the backend (has kycStatus, role, etc.)
  try {
    const me = await authApi.me();
    return me;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Firebase mode: listen to auth state ── */
  useEffect(() => {
    if (!USE_FIREBASE) return;

    const unsub = fbOnAuthChange(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Grab the ID token to authenticate backend requests
      const idToken = await fbGetIdToken(true);
      if (idToken) {
        localStorage.setItem('bv_firebase_token', idToken);
      }
      const fbProfile = await fbGetUser(fbUser.uid).catch(() => null);
      const backendProfile = await hydrateBackendProfile();

      setUser({
        id: fbUser.uid,
        email: fbUser.email,
        firstName: fbProfile?.firstName || backendProfile?.firstName || '',
        lastName: fbProfile?.lastName || backendProfile?.lastName || '',
        role: backendProfile?.role || fbProfile?.role || 'INVESTOR',
        kycStatus: backendProfile?.kycStatus || fbProfile?.kycStatus || 'NOT_STARTED',
        _firebase: true,
      });
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ── JWT mode: hydrate from stored token ── */
  useEffect(() => {
    if (USE_FIREBASE) return;
    if (!tokens.access) { setLoading(false); return; }
    authApi
      .me()
      .then(setUser)
      .catch(() => { tokens.clear(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  /* ── login ── */
  const login = useCallback(async (payload) => {
    if (USE_FIREBASE) {
      const fbUser = await fbLogin(payload);
      // onAuthChange will set the user; return a minimal object for the caller
      const backend = await hydrateBackendProfile();
      return {
        id: fbUser.uid,
        email: fbUser.email,
        firstName: backend?.firstName || '',
        lastName: backend?.lastName || '',
        role: backend?.role || 'INVESTOR',
      };
    }
    // Legacy
    const data = await authApi.login(payload);
    tokens.set(data);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  /* ── register ── */
  const register = useCallback(async (payload) => {
    if (USE_FIREBASE) {
      const fbUser = await fbRegister(payload);
      // Also create the matching record on the backend (Prisma) so
      // server-side features (KYC, investments) see the user.
      try {
        await authApi.register({ ...payload, firebaseUid: fbUser.uid });
      } catch (err) {
        // If the backend rejects (e.g. already exists), don't fail the signup
        if (import.meta.env.DEV) console.warn('[register] backend sync:', err?.response?.data?.message);
      }
      return {
        id: fbUser.uid,
        email: fbUser.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: 'INVESTOR',
      };
    }
    // Legacy
    const data = await authApi.register(payload);
    tokens.set(data);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  /* ── logout ── */
  const logout = useCallback(async () => {
    if (USE_FIREBASE) {
      await fbLogout().catch(() => {});
      localStorage.removeItem('bv_firebase_token');
      setUser(null);
      window.location.href = '/';
      return;
    }
    try { await authApi.logout(tokens.refresh); } catch { /* ignore */ }
    tokens.clear();
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
