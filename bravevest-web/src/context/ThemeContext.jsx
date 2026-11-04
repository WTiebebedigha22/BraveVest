import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/api/client';

const STORAGE_KEY = 'bv.theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  // Sync from server on load (best effort)
  useEffect(() => {
    api.get('/api/users/me')
      .then(r => {
        const prefs = r.data?.data?.preferences || r.data?.preferences;
        const serverTheme = prefs?.theme;
        if (serverTheme === 'light' || serverTheme === 'dark') setThemeState(serverTheme);
      })
      .catch(() => {});
  }, []);

  function setTheme(next) {
    setThemeState(next);
    api.patch('/api/users/me', { preferences: { theme: next } }).catch(() => {});
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
