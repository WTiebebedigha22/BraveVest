import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, endpoints, tokenStore } from '@/api/client';
import { applyThemeFromBackend } from '@/theme/ThemeProvider';

type User = { id: string; email: string; role: 'admin' | 'investor'; kycStatus?: string; theme?: 'system' | 'light' | 'dark' };
type AuthCtx = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => Promise<void>; refreshMe: () => Promise<void> };
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const applyUserTheme = (u: User | null) => {
    if (u?.theme === 'light' || u?.theme === 'dark' || u?.theme === 'system') applyThemeFromBackend(u.theme);
  };
  const refreshMe = useCallback(async () => {
    const { access } = await tokenStore.get();
    if (!access) return setUser(null);
    try {
      const { data } = await api.get(endpoints.auth.me);
      const u = data.user ?? data; setUser(u); applyUserTheme(u);
    } catch { setUser(null); }
  }, []);
  useEffect(() => { (async () => { await refreshMe(); setLoading(false); })(); }, [refreshMe]);
  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post(endpoints.auth.login, { email, password });
    await tokenStore.set(data.access, data.refresh);
    const u = data.user ?? (await api.get(endpoints.auth.me)).data;
    setUser(u); applyUserTheme(u);
  }, []);
  const logout = useCallback(async () => {
    try { await api.post(endpoints.auth.logout); } catch {}
    await tokenStore.clear(); setUser(null);
  }, []);
  return <Ctx.Provider value={{ user, loading, login, logout, refreshMe }}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
