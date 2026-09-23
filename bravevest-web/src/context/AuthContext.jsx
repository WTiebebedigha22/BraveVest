import { createContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { tokens } from '@/api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Hydrate from token on mount */
  useEffect(() => {
    if (!tokens.access) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((data) => setUser(data))
      .catch(() => { tokens.clear(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload) => {
    const data = await authApi.login(payload);
    tokens.set(data);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    tokens.set(data);
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(tokens.refresh); } catch { /* ignore */ }
    tokens.clear();
    setUser(null);
    window.location.href = '/';
  }, []);

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
