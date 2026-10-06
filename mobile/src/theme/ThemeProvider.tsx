import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, Palette } from './palettes';
import type { ThemeMode } from './tokens';

const STORAGE_KEY = 'bv.theme.mode';

type Ctx = { mode: ThemeMode; resolved: 'light' | 'dark'; colors: Palette; setMode: (m: ThemeMode) => void; ready: boolean };
const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') setModeState(stored);
      } catch {}
      setReady(true);
    })();
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  }, []);

  const resolved: 'light' | 'dark' = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  const colors = resolved === 'dark' ? darkColors : lightColors;

  const value = useMemo(() => ({ mode, resolved, colors, setMode, ready }), [mode, resolved, colors, setMode, ready]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error('useTheme must be used within ThemeProvider');
  return v;
}

let externalSetMode: ((m: ThemeMode) => void) | null = null;
export function _registerExternalSetMode(fn: (m: ThemeMode) => void) { externalSetMode = fn; }
export function applyThemeFromBackend(m: ThemeMode) { externalSetMode?.(m); }
