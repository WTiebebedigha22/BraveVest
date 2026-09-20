import { createContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { tokens } from '@/api/client';
import { ENABLED as FIREBASE_ENABLED } from '@/lib/firebase';
import {
  fbRegister, fbLogin, fbLogout, fbOnAuthChange, fbGetIdToken,
} from '@/api/firebaseAuth';
import { fbGetUser } from '@/api/firebaseDb';

export const AuthContext = createContext(null);

const USE_FIREBASE = FIREBASE_ENABLED;

async function hydrateBackendProfile() {
  try {
    return await authApi.me();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!USE_FIREBASE) return;
    const unsub = fbOnAuthChange(async (fbUser) => {
      if (!fbUser) { setUser(null); setLoading(false); return; }
      const idToken = await fbGetIdToken(true);
      if (idToken) localStorage.setItem('bv_firebase_token', idToken);
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

  useEffect(() => {
    if (USE_FIREBASE) return;
    if (!tokens.access) { setLoading(false); return; }
    authApi
      .me()
      .then(setUser)
      .catch(() => { tokens.clear(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload) => {
    if (USE_FIREBASE) {
      const fbUser = await fbLogin(payload);
      const backend = await hydrateBackendProfile();
      return {
        id: fbUser.uid,
        email: fbUser.email,
        firstName: backend?.firstName || '',
        lastName: backend?.lastName || '',
        role: backend?.role || 'INVESTOR',
      };
    }
    const data = await authApi.login(payload);
    tokens.set(data);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    if (USE_FIREBASE) {
      const fbUser = await fbRegister(payload);
      try {
        await authApi.register({ ...payload, firebaseUid: fbUser.uid });
      } catch (err) {
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
    const data = await authApi.register(payload);
    tokens.set(data);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

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