#!/usr/bin/env node
// init.js — BraveVest Phase 3 mobile app bootstrap
// v8: onboarding carousel + homepage layout matching the UI kit (BraveVest palette).
// Run from repo root: `node init.js [--force]`

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MOBILE = path.join(ROOT, 'mobile');
const FORCE = process.argv.includes('--force');

const CONFIG = {
  apiBaseUrl: 'http://localhost:3001',
  apiBaseUrlProd: 'https://api.bravevest.com',
  fonts: { serif: 'PlayfairDisplay', sans: 'Inter' },
  currencies: ['NGN', 'ZAR', 'USD', 'GBP', 'EUR'],
  demoAccounts: [
    { email: 'admin@demo.bravevest.test', role: 'admin' },
    { email: 'investor@demo.bravevest.test', role: 'investor', kyc: 'approved' },
    { email: 'investor.pending@demo.bravevest.test', role: 'investor', kyc: 'review' },
    { email: 'investor.new@demo.bravevest.test', role: 'investor', kyc: 'none' },
  ],
  demoPassword: 'DemoPass123!',
};

const log = (m) => console.log(`\x1b[38;5;149m▸\x1b[0m ${m}`);
const warn = (m) => console.log(`\x1b[38;5;214m!\x1b[0m ${m}`);

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function write(rel, contents) {
  const abs = path.join(MOBILE, rel);
  ensureDir(path.dirname(abs));
  if (fs.existsSync(abs) && !FORCE) { warn(`skip: mobile/${rel}`); return; }
  fs.writeFileSync(abs, contents);
  log(`wrote mobile/${rel}`);
}
function writeJSON(rel, obj) { write(rel, JSON.stringify(obj, null, 2) + '\n'); }

if (fs.existsSync(MOBILE)) warn(`mobile/ exists${FORCE ? ' — FORCE' : ''}`);
else { ensureDir(MOBILE); log('created mobile/'); }

// ---------- package.json ----------
writeJSON('package.json', {
  name: 'bravevest-mobile',
  version: '0.4.0',
  main: 'expo-router/entry',
  scripts: {
    start: 'expo start',
    android: 'expo start --android',
    ios: 'expo start --ios',
    web: 'expo start --web',
    typecheck: 'tsc --noEmit',
  },
  dependencies: {
    expo: '~51.0.0',
    'expo-router': '~3.5.0',
    'expo-status-bar': '~1.12.1',
    'expo-secure-store': '~13.0.2',
    'expo-local-authentication': '~14.0.1',
    'expo-notifications': '~0.28.0',
    'expo-font': '~12.0.0',
    'expo-splash-screen': '~0.27.0',
    'expo-constants': '~16.0.0',
    'expo-linear-gradient': '~13.0.2',
    'expo-linking': '~6.3.1',
    '@expo-google-fonts/playfair-display': '^0.2.3',
    '@expo-google-fonts/inter': '^0.2.3',
    '@react-native-async-storage/async-storage': '1.23.1',
    '@react-navigation/native': '^6.1.17',
    '@react-navigation/bottom-tabs': '^6.5.20',
    'react-native-safe-area-context': '4.10.5',
    'react-native-screens': '3.31.1',
    'react-native-gesture-handler': '~2.16.1',
    'react-native-reanimated': '~3.10.1',
    react: '18.2.0',
    'react-native': '0.74.5',
    zod: '^3.23.8',
    axios: '^1.7.4',
  },
  devDependencies: {
    '@babel/core': '^7.24.0',
    '@types/react': '~18.2.79',
    typescript: '~5.3.3',
    'babel-plugin-module-resolver': '^5.0.3',
  },
  private: true,
});

writeJSON('app.json', {
  expo: {
    name: 'BraveVest', slug: 'bravevest', scheme: 'bravevest', version: '0.4.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    splash: { backgroundColor: '#0F0F10', resizeMode: 'contain' },
    assetBundlePatterns: ['**/*'],
    ios: { supportsTablet: false, bundleIdentifier: 'com.bravevest.app' },
    android: { package: 'com.bravevest.app', adaptiveIcon: { backgroundColor: '#0F0F10' } },
    plugins: ['expo-router', 'expo-secure-store', 'expo-local-authentication'],
    experiments: { typedRoutes: true },
    extra: { apiBaseUrl: CONFIG.apiBaseUrl, apiBaseUrlProd: CONFIG.apiBaseUrlProd },
  },
});

writeJSON('tsconfig.json', {
  extends: 'expo/tsconfig.base',
  compilerOptions: { strict: true, paths: { '@/*': ['./src/*'] } },
  include: ['**/*.ts', '**/*.tsx', '.expo/types/**/*.ts', 'expo-env.d.ts'],
});

write('babel.config.js', `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', { alias: { '@': './src' } }],
      'react-native-reanimated/plugin',
    ],
  };
};
`);

write('.env.example', `EXPO_PUBLIC_API_BASE_URL=${CONFIG.apiBaseUrl}
EXPO_PUBLIC_ENV=dev
EXPO_PUBLIC_DEV_AUTH_BYPASS=1
`);

// ============================================================
// THEME
// ============================================================
write('src/theme/palettes.ts', `export type Palette = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderStrong: string;
  lime: string;
  limeSoft: string;
  teal: string;
  tealSoft: string;
  lavender: string;
  lavenderSoft: string;
  success: string;
  warning: string;
  danger: string;
  onAccent: string;
  heroGradient: readonly [string, string];
  heroText: string;
  scrim: string;
};

export const darkColors: Palette = {
  background: '#0F0F10',
  surface: '#16161A',
  surfaceElevated: '#1C1C22',
  surfaceMuted: '#121215',
  textPrimary: '#FFFFFF',
  textSecondary: '#9A9AA5',
  textTertiary: '#6B6B6B',
  border: '#26262E',
  borderStrong: '#33333D',
  lime: '#B3D941',
  limeSoft: '#B3D94122',
  teal: '#3FB8C4',
  tealSoft: '#3FB8C422',
  lavender: '#C9A6F2',
  lavenderSoft: '#C9A6F222',
  success: '#B3D941',
  warning: '#F5A623',
  danger: '#E5484D',
  onAccent: '#0F0F10',
  heroGradient: ['#B3D941', '#3FB8C4'] as const,
  heroText: '#0F0F10',
  scrim: '#000000cc',
};

export const lightColors: Palette = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F0F2F5',
  textPrimary: '#0F0F10',
  textSecondary: '#6B6B6B',
  textTertiary: '#9A9AA5',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  lime: '#7A9B22',
  limeSoft: '#B3D94133',
  teal: '#2A8C96',
  tealSoft: '#3FB8C433',
  lavender: '#7A5FB0',
  lavenderSoft: '#C9A6F233',
  success: '#5E8F1E',
  warning: '#B8791A',
  danger: '#C0363A',
  onAccent: '#FFFFFF',
  heroGradient: ['#B3D941', '#3FB8C4'] as const,
  heroText: '#0F0F10',
  scrim: '#00000066',
};
`);

write('src/theme/tokens.ts', `import { Palette, darkColors, lightColors } from './palettes';

export { darkColors, lightColors };
export type { Palette };

export const colors = darkColors;

export const fonts = {
  serif: 'PlayfairDisplay',
  sans: 'Inter',
} as const;

export const radii = {
  card: 24,
  button: 14,
  chip: 999,
  pill: 999,
  icon: 20,
  input: 14,
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 16, lg: 20, xl: 28, xxl: 40,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

export const currencies = ${JSON.stringify(CONFIG.currencies)} as const;
export type Currency = (typeof currencies)[number];

export type ThemeMode = 'system' | 'light' | 'dark';
`);

write('src/theme/ThemeProvider.tsx', `import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
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
`);

// ============================================================
// API
// ============================================================
write('src/api/client.ts', `import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  Constants.expoConfig?.extra?.apiBaseUrl ??
  '${CONFIG.apiBaseUrl}';

const ACCESS_KEY = 'bv.access';
const REFRESH_KEY = 'bv.refresh';

export const tokenStore = {
  async get() { return { access: await SecureStore.getItemAsync(ACCESS_KEY), refresh: await SecureStore.getItemAsync(REFRESH_KEY) }; },
  async set(access: string, refresh: string) { await SecureStore.setItemAsync(ACCESS_KEY, access); await SecureStore.setItemAsync(REFRESH_KEY, refresh); },
  async clear() { await SecureStore.deleteItemAsync(ACCESS_KEY); await SecureStore.deleteItemAsync(REFRESH_KEY); },
};

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL, timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const { access } = await tokenStore.get();
  if (access && config.headers) config.headers.Authorization = \`Bearer \${access}\`;
  return config;
});

let refreshing: Promise<string | null> | null = null;
api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original: any = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (!refreshing) {
        refreshing = (async () => {
          const { refresh } = await tokenStore.get();
          if (!refresh) return null;
          try {
            const { data } = await axios.post(\`\${BASE_URL}/api/auth/refresh\`, { refresh });
            await tokenStore.set(data.access, data.refresh ?? refresh);
            return data.access;
          } catch { await tokenStore.clear(); return null; }
          finally { refreshing = null; }
        })();
      }
      const fresh = await refreshing;
      if (fresh) { original.headers.Authorization = \`Bearer \${fresh}\`; return api(original); }
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: { register: '/api/auth/register', login: '/api/auth/login', refresh: '/api/auth/refresh', logout: '/api/auth/logout', me: '/api/auth/me' },
  kyc: { get: '/api/kyc', step: (n: number) => \`/api/kyc/step/\${n}\`, documents: '/api/kyc/documents', submit: '/api/kyc/submit' },
  projects: { list: '/api/projects', detail: (slug: string) => \`/api/projects/\${slug}\` },
  investments: { create: '/api/investments', list: '/api/investments', portfolio: '/api/investments/portfolio', series: '/api/investments/portfolio/series' },
  payments: { init: '/api/payments/initialize', verify: (r: string) => \`/api/payments/verify/\${r}\`, transactions: '/api/payments/transactions', wallet: '/api/payments/wallet' },
  users: { me: '/api/users/me', changePassword: '/api/users/change-password' },
  goals: { list: '/api/goals', detail: (id: string) => \`/api/goals/\${id}\` },
  groups: { list: '/api/groups', join: '/api/groups/join', detail: (id: string) => \`/api/groups/\${id}\`, contribute: (id: string) => \`/api/groups/\${id}/contribute\` },
};
`);

write('src/api/hooks.ts', `import { useCallback, useEffect, useState } from 'react';
import { api } from './client';

export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    let alive = true;
    setLoading(true); setError(null);
    fn().then((res) => { if (alive) setData(res); })
       .catch((e) => { if (alive) setError(e instanceof Error ? e : new Error(String(e))); })
       .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);
  return { data, loading, error, refetch };
}

export type Project = { id: string; slug: string; title: string; summary?: string; description?: string; category?: string; targetReturn?: number | string; targetAmount?: number; raisedAmount?: number; minimumAmount?: number; durationMonths?: number; status?: string };
export type PortfolioItem = { id: string; projectId?: string; projectTitle?: string; projectSlug?: string; amount?: number; currentValue?: number; returnPct?: number; status?: string; investedAt?: string };
export type PortfolioSummary = { totalInvested: number; currentValue: number; totalReturns: number; itemCount: number; items: PortfolioItem[] };
export type SeriesPoint = { date: string; value: number };
export type Me = { id: string; email: string; firstName?: string; lastName?: string; role?: string; kycStatus?: string; phone?: string; currency?: string; theme?: 'system' | 'light' | 'dark'; createdAt?: string };
export type Goal = { id: string; title: string; targetAmount: number; currentAmount: number; deadline?: string; status?: string; projectId?: string; createdAt?: string };

export function useProjects() {
  return useApi<Project[]>(async () => {
    const { data } = await api.get('/api/projects');
    return Array.isArray(data) ? data : data?.projects ?? data?.items ?? [];
  });
}
export function useProject(slug: string) {
  return useApi<Project | null>(async () => {
    const { data } = await api.get(\`/api/projects/\${slug}\`);
    return data?.project ?? data ?? null;
  }, [slug]);
}
export function usePortfolio() {
  return useApi<PortfolioSummary>(async () => {
    const { data } = await api.get('/api/investments/portfolio');
    const items: PortfolioItem[] = data?.items ?? data?.investments ?? (Array.isArray(data) ? data : []);
    return {
      totalInvested: data?.totalInvested ?? items.reduce((s, i) => s + (i.amount ?? 0), 0),
      currentValue: data?.currentValue ?? items.reduce((s, i) => s + (i.currentValue ?? i.amount ?? 0), 0),
      totalReturns: data?.totalReturns ?? 0,
      itemCount: data?.itemCount ?? items.length,
      items,
    };
  });
}
export function usePortfolioSeries() {
  return useApi<SeriesPoint[]>(async () => {
    const { data } = await api.get('/api/investments/portfolio/series');
    const raw = Array.isArray(data) ? data : data?.series ?? data?.points ?? [];
    return raw.map((p: any) => ({ date: String(p.date ?? p.t ?? p.x ?? ''), value: Number(p.value ?? p.v ?? p.y ?? 0) }));
  });
}
export function useMe() {
  return useApi<Me | null>(async () => {
    const { data } = await api.get('/api/users/me');
    return data?.user ?? data ?? null;
  });
}
export function useGoals() {
  return useApi<Goal[]>(async () => {
    const { data } = await api.get('/api/goals');
    return Array.isArray(data) ? data : data?.goals ?? data?.items ?? [];
  });
}
`);

// ============================================================
// CONTEXTS
// ============================================================
write('src/context/AuthContext.tsx', `import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
`);

write('src/context/CurrencyContext.tsx', `import React, { createContext, useContext, useState } from 'react';
import { Currency } from '@/theme/tokens';

const RATES: Record<Currency, number> = { NGN: 1, ZAR: 0.012, USD: 0.00065, GBP: 0.00051, EUR: 0.00060 };
type Ctx = { currency: Currency; setCurrency: (c: Currency) => void; convert: (ngn: number) => number };
const CurrencyCtx = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const convert = (ngn: number) => ngn * RATES[currency];
  return <CurrencyCtx.Provider value={{ currency, setCurrency, convert }}>{children}</CurrencyCtx.Provider>;
}
export function useCurrency() {
  const v = useContext(CurrencyCtx);
  if (!v) throw new Error('useCurrency must be used within CurrencyProvider');
  return v;
}
`);

// ============================================================
// ONBOARDING CONTEXT (first-run flag)
// ============================================================
write('src/context/OnboardingContext.tsx', `import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'bv.onboarded';
type Ctx = { seen: boolean; ready: boolean; markSeen: () => void; reset: () => void };
const OnbCtx = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try { setSeen((await AsyncStorage.getItem(KEY)) === '1'); } catch {}
      setReady(true);
    })();
  }, []);
  const markSeen = useCallback(() => { setSeen(true); AsyncStorage.setItem(KEY, '1').catch(() => {}); }, []);
  const reset = useCallback(() => { setSeen(false); AsyncStorage.removeItem(KEY).catch(() => {}); }, []);
  return <OnbCtx.Provider value={{ seen, ready, markSeen, reset }}>{children}</OnbCtx.Provider>;
}
export function useOnboarding() {
  const v = useContext(OnbCtx);
  if (!v) throw new Error('useOnboarding must be used within OnboardingProvider');
  return v;
}
`);

// ============================================================
// UI PRIMITIVES
// ============================================================
write('src/components/ui/Button.tsx', `import { Pressable, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';
type Props = { label: string; onPress?: () => void; variant?: Variant; loading?: boolean; disabled?: boolean; full?: boolean; style?: ViewStyle };

export function Button({ label, onPress, variant = 'primary', loading, disabled, full, style }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.lime : variant === 'secondary' ? colors.surfaceElevated : 'transparent';
  const fg = variant === 'primary' ? colors.onAccent : variant === 'secondary' ? colors.textPrimary : colors.lime;
  const border = variant === 'secondary' ? colors.border : variant === 'ghost' ? colors.lime : 'transparent';
  return (
    <Pressable onPress={onPress} disabled={disabled || loading}
      style={[styles.base, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'primary' ? 0 : 1 }, full && { alignSelf: 'stretch' }, (disabled || loading) && { opacity: 0.6 }, style]}>
      {loading ? <ActivityIndicator color={fg} /> : <Text style={{ color: fg, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600' }}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radii.button, alignItems: 'center', justifyContent: 'center', minHeight: 52 },
});
`);

write('src/components/ui/Card.tsx', `import { View, ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radii, shadows, spacing } from '@/theme/tokens';

type Variant = 'default' | 'elevated' | 'outline';
export function Card({ variant = 'default', style, children, ...rest }: ViewProps & { variant?: Variant }) {
  const { colors } = useTheme();
  return (
    <View style={[
      { borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
      variant === 'elevated' && shadows.card,
      variant === 'outline' && { backgroundColor: 'transparent' },
      style,
    ]} {...rest}>
      {children}
    </View>
  );
}
`);

write('src/components/ui/IconPill.tsx', `import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

export function IconPill({ icon, label, color, onPress }: { icon: string; label: string; color?: string; onPress?: () => void }) {
  const { colors } = useTheme();
  const c = color ?? colors.lime;
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', flex: 1 }} android_ripple={{ color: c + '22' }}>
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c + '1F', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, color: c, fontFamily: fonts.sans, fontWeight: '700' }}>{icon}</Text>
      </View>
      <Text style={{ marginTop: spacing.sm, color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 12, textAlign: 'center' }} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}
`);

write('src/components/ui/SectionHeader.tsx', `import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700' }}>{title}</Text>
      {action ? <Pressable onPress={onAction}><Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>{action}</Text></Pressable> : null}
    </View>
  );
}
`);

write('src/components/ui/Chip.tsx', `import { Pressable, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.chip,
      borderWidth: 1, borderColor: active ? colors.lime : colors.border,
      backgroundColor: active ? colors.lime : 'transparent',
    }}>
      <Text style={{ color: active ? colors.onAccent : colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
`);

write('src/components/ui/ProjectCard.tsx', `import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { useCurrency } from '@/context/CurrencyContext';
import { fonts, radii, spacing } from '@/theme/tokens';
import type { Project } from '@/api/hooks';

export function ProjectCard({ project, onPress }: { project: Project; onPress?: () => void }) {
  const { colors } = useTheme();
  const { currency, convert } = useCurrency();
  const target = typeof project.targetReturn === 'number' ? project.targetReturn : parseFloat(String(project.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const min = project.minimumAmount ?? 0;
  const raised = project.raisedAmount ?? 0;
  const targetAmt = project.targetAmount ?? 1;
  const pct = Math.min(100, Math.round((raised / Math.max(1, targetAmt)) * 100));

  return (
    <Pressable onPress={onPress} style={{ backgroundColor: colors.surface, borderRadius: radii.card, overflow: 'hidden', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border }}>
      <View style={{ height: 140 }}>
        <LinearGradient colors={[colors.surfaceMuted, colors.surfaceElevated]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 44 }}>{project.category?.[0]?.toUpperCase() ?? '◈'}</Text>
        </LinearGradient>
        {project.category ? (
          <View style={{ position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: colors.lime, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.chip }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>{project.category}</Text>
          </View>
        ) : null}
      </View>
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' }} numberOfLines={2}>{project.title}</Text>
        {project.summary ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 6, lineHeight: 18 }} numberOfLines={2}>{project.summary}</Text> : null}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg }}>
          <Stat label="Target return" value={\`\${target}%\`} accent={colors.lime} />
          <Stat label="Minimum" value={\`\${currency} \${convert(min).toLocaleString(undefined, { maximumFractionDigits: 0 })}\`} />
          <Stat label="Funded" value={\`\${pct}%\`} />
        </View>
        <View style={{ height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 6, backgroundColor: colors.lime, borderRadius: 3, width: \`\${pct}%\` }} />
        </View>
      </View>
    </Pressable>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600', marginTop: 2 }}>{value}</Text>
    </View>
  );
}
`);

write('src/components/ui/EmptyState.tsx', `import { View, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

export function EmptyState({ title, body }: { title: string; body?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ padding: spacing.xl, alignItems: 'center' }}>
      <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' }}>{title}</Text>
      {body ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: spacing.sm, textAlign: 'center' }}>{body}</Text> : null}
    </View>
  );
}
`);

write('src/components/ui/Sparkline.tsx', `import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function Sparkline({ points, height = 60, color }: { points: number[]; height?: number; color?: string }) {
  const { colors } = useTheme();
  if (!points.length) return null;
  const c = color ?? colors.lime;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height }}>
      {points.map((v, i) => {
        const h = ((v - min) / range) * (height - 8) + 4;
        return <View key={i} style={{ flex: 1, borderRadius: 2, opacity: 0.9, height: h, backgroundColor: c }} />;
      })}
    </View>
  );
}
`);

write('src/components/ui/QuickAction.tsx', `export { IconPill as QuickAction } from './IconPill';
`);

// ============================================================
// ROOT LAYOUT
// ============================================================
write('app/_layout.tsx', `import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AuthProvider } from '@/context/AuthContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { ThemeProvider, useTheme, _registerExternalSetMode } from '@/theme/ThemeProvider';
import { fonts } from '@/theme/tokens';

class Boundary extends React.Component<{ children: React.ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error('ROOT ERROR:', err); }
  render() {
    if (this.state.err) {
      return (
        <View style={styles.errorWrap}>
          <Text style={styles.errorTitle}>Something broke.</Text>
          <Text style={styles.errorBody}>{String(this.state.err)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function ThemeBridge() {
  const { setMode } = useTheme();
  React.useEffect(() => { _registerExternalSetMode(setMode); }, [setMode]);
  return null;
}

function ThemedStack() {
  const { colors, resolved } = useTheme();
  return (
    <>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.serif]: PlayfairDisplay_700Bold,
    [fonts.sans]: Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [timedOut, setTimedOut] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setTimedOut(true), 4000); return () => clearTimeout(t); }, []);
  if (error) console.error('Font load error:', error);
  const ready = loaded || !!error || timedOut;
  if (!ready) return <View style={styles.boot}><ActivityIndicator color="#B3D941" /></View>;

  return (
    <Boundary>
      <ThemeProvider>
        <ThemeBridge />
        <SafeAreaProvider>
          <OnboardingProvider>
            <AuthProvider>
              <CurrencyProvider>
                <ThemedStack />
              </CurrencyProvider>
            </AuthProvider>
          </OnboardingProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </Boundary>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: '#0F0F10', alignItems: 'center', justifyContent: 'center' },
  errorWrap: { flex: 1, backgroundColor: '#0F0F10', padding: 24, justifyContent: 'center' },
  errorTitle: { color: '#B3D941', fontFamily: fonts.serif, fontSize: 20 },
  errorBody: { color: '#fff', marginTop: 12, fontFamily: fonts.sans },
});
`);

// ---------- ROOT INDEX — routes to onboarding on first run ----------
write('app/index.tsx', `import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useOnboarding } from '@/context/OnboardingContext';
import { useTheme } from '@/theme/ThemeProvider';

const DEV_BYPASS = process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS !== '0';

export default function Index() {
  const { seen, ready } = useOnboarding();
  const { colors } = useTheme();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View>;
  }

  if (!seen) return <Redirect href="/onboarding" />;
  return <Redirect href={DEV_BYPASS ? '/(app)' : '/(auth)/login'} />;
}
`);

// ============================================================
// ONBOARDING
// ============================================================
write('app/onboarding.tsx', `import { useRef, useState } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/context/OnboardingContext';
import { Button } from '@/components/ui/Button';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  previewKind: 'card' | 'portfolio' | 'goals';
};

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    eyebrow: 'Welcome to BraveVest',
    title: 'Stretch out your investments over time',
    body: 'Put money to work in vetted solar, real estate, and SME opportunities — from as little as your first paycheck.',
    previewKind: 'card',
  },
  {
    key: 'portfolio',
    eyebrow: 'Track everything',
    title: 'One portfolio, every holding',
    body: 'See what you own, what it\\'s worth, and how each position is performing — all in a single view.',
    previewKind: 'portfolio',
  },
  {
    key: 'goals',
    eyebrow: 'Save with purpose',
    title: 'Set goals and watch them fill',
    body: 'Define what you\\'re saving for. Contribute when you can. Watch the bar move.',
    previewKind: 'goals',
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { colors } = useTheme();
  const { markSeen } = useOnboarding();
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== idx) setIdx(next);
  }

  function finish() {
    markSeen();
    router.replace('/(auth)/login');
  }

  function next() {
    if (idx === SLIDES.length - 1) finish();
    else scrollRef.current?.scrollTo({ x: width * (idx + 1), animated: true });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: spacing.lg }}>
        <Pressable onPress={finish}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s) => (
          <View key={s.key} style={{ width, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
            <Preview kind={s.previewKind} />
            <View style={{ height: spacing.xxl }} />
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.eyebrow}</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 32, textAlign: 'center', marginTop: spacing.md, lineHeight: 40 }}>{s.title}</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 15, textAlign: 'center', marginTop: spacing.md, lineHeight: 22, paddingHorizontal: spacing.lg }}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ padding: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: spacing.lg }}>
          {SLIDES.map((s, i) => (
            <View key={s.key} style={{
              width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
              backgroundColor: i === idx ? colors.lime : colors.border,
            }} />
          ))}
        </View>
        <Button label={idx === SLIDES.length - 1 ? 'Get started' : 'Continue'} onPress={next} full />
        <Pressable onPress={finish} style={{ alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>Browse assets</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Preview({ kind }: { kind: Slide['previewKind'] }) {
  const { colors } = useTheme();

  if (kind === 'card') {
    return (
      <View style={{ width: '100%', maxWidth: 320 }}>
        <LinearGradient colors={[...colors.heroGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radii.card, padding: spacing.xl, ...shadows.card }}>
          <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, opacity: 0.75 }}>USD Balance</Text>
          <Text style={{ color: colors.heroText, fontFamily: fonts.serif, fontSize: 34, marginTop: 4 }}>$8,786.55</Text>
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
            {['Deposit', 'Withdraw', 'Send', 'Receive'].map((label) => (
              <View key={label} style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.heroText + '22', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.heroText, fontSize: 16 }}>◈</Text>
                </View>
                <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 10, marginTop: 6, opacity: 0.9 }}>{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (kind === 'portfolio') {
    return (
      <View style={{ width: '100%', maxWidth: 320 }}>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1, borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Crypto</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 4 }}>$20,321</Text>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 11, marginTop: 4 }}>▲ 0.24%</Text>
          </View>
          <View style={{ flex: 1, borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.lime }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, opacity: 0.8 }}>Stocks</Text>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 4 }}>$5,687</Text>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, marginTop: 4, opacity: 0.85 }}>▼ 1.35%</Text>
          </View>
        </View>
        <View style={{ borderRadius: radii.card, padding: spacing.lg, marginTop: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Profits</Text>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700', marginTop: 4 }}>$2,567.00</Text>
        </View>
      </View>
    );
  }

  // goals
  return (
    <View style={{ width: '100%', maxWidth: 320 }}>
      <View style={{ borderRadius: radii.card, padding: spacing.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Emergency fund</Text>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>62%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: colors.surfaceMuted, borderRadius: 4, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 8, backgroundColor: colors.lime, borderRadius: 4, width: '62%' }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>₦310,000</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>of ₦500,000</Text>
        </View>
      </View>
      <View style={{ borderRadius: radii.card, padding: spacing.lg, marginTop: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Lagos trip</Text>
          <Text style={{ color: colors.teal, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>88%</Text>
        </View>
        <View style={{ height: 8, backgroundColor: colors.surfaceMuted, borderRadius: 4, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 8, backgroundColor: colors.teal, borderRadius: 4, width: '88%' }} />
        </View>
      </View>
    </View>
  );
}
`);

// ============================================================
// AUTH
// ============================================================
write('app/(auth)/_layout.tsx', `import { Stack } from 'expo-router';
export default function AuthLayout() { return <Stack screenOptions={{ headerShown: false }} />; }
`);

write('app/(auth)/login.tsx', `import { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { fonts, radii, spacing } from '@/theme/tokens';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('investor@demo.bravevest.test');
  const [password, setPassword] = useState('DemoPass123!');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (busy) return;
    setBusy(true);
    try { await login(email.trim(), password); router.replace('/(app)'); }
    catch (e: any) { Alert.alert('Login failed', e?.response?.data?.message ?? e?.message ?? 'Unknown error'); }
    finally { setBusy(false); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'center' }}>
      <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 40 }}>BraveVest</Text>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.xxl }}>Invest in what matters.</Text>

      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginBottom: spacing.sm }}>Email</Text>
      <TextInput style={{ backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, borderWidth: 1, borderColor: colors.border }} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={colors.textTertiary} />

      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.md, marginBottom: spacing.sm }}>Password</Text>
      <TextInput style={{ backgroundColor: colors.surface, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, borderWidth: 1, borderColor: colors.border }} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.textTertiary} />

      <Button label="Sign in" onPress={onSubmit} loading={busy} full style={{ marginTop: spacing.xl }} />
      <Text style={{ color: colors.textTertiary, fontFamily: fonts.sans, fontSize: 11, marginTop: spacing.lg, textAlign: 'center' }}>Demo: investor@demo.bravevest.test · DemoPass123!</Text>
    </View>
  );
}
`);

// ============================================================
// APP GROUP
// ============================================================
write('app/(app)/_layout.tsx', `import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, shadows, spacing } from '@/theme/tokens';

export default function AppLayout() {
  const { colors } = useTheme();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        left: spacing.lg, right: spacing.lg, bottom: spacing.lg,
        height: 64, borderRadius: radii.pill,
        backgroundColor: colors.surface, borderTopWidth: 0, paddingBottom: 0,
        borderWidth: 1, borderColor: colors.border,
        ...shadows.floating,
      },
      tabBarActiveTintColor: colors.lime,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: { fontFamily: fonts.sans, fontSize: 10, fontWeight: '600' },
      tabBarItemStyle: { paddingVertical: spacing.sm },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="marketplace" options={{ title: 'Discover' }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="goals" options={{ title: 'Goals' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
`);

// ---------- HOME — kit layout ----------
write('app/(app)/index.tsx', `import { ScrollView, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { IconPill } from '@/components/ui/IconPill';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

const SAMPLE_TOTAL_NGN = 8_786_550;
const SAMPLE_CHANGE_PCT = 2.35;

const CATEGORIES = [
  { label: 'Solar', icon: '☀', color: 'lime' as const },
  { label: 'Real Estate', icon: '⌂', color: 'teal' as const },
  { label: 'Agri', icon: '❦', color: 'lavender' as const },
  { label: 'SME', icon: '◈', color: 'lime' as const },
];

const WATCHLIST_FILTERS = ['All', 'Solar', 'Real Estate', 'Agri'];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const firstName = user?.email?.split('@')[0]?.split('.')[0] ?? 'Investor';
  const total = convert(SAMPLE_TOTAL_NGN);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>

        {/* Greeting row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <View>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Good morning,</Text>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', marginTop: 2 }}>{firstName}</Text>
          </View>
          <Pressable
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}
            onPress={() => router.push('/(app)/profile')}
          >
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' }}>{firstName[0]?.toUpperCase()}</Text>
          </Pressable>
        </View>

        {/* Total asset value — kit's headline section */}
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>Total asset value</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.serif, fontSize: 38, lineHeight: 44 }} numberOfLines={1}>
              {currency} {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm }}>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>↑ {SAMPLE_CHANGE_PCT}%</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>(+1.50%) from last week</Text>
            </View>
          </View>
          <Pressable
            style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => router.push('/(app)/portfolio')}
          >
            <Text style={{ color: colors.lime, fontSize: 22 }}>▤</Text>
          </Pressable>
        </View>

        {/* My Portfolio — kit's stacked cards */}
        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="My Portfolio" action="See all" onAction={() => router.push('/(app)/portfolio')} />
          <View style={{ borderRadius: radii.card, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ backgroundColor: colors.surface, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.tealSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.teal, fontSize: 20 }}>◎</Text>
                </View>
                <View>
                  <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Solar</Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>3 holdings</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
                  {currency} {convert(4_500_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginTop: 2 }}>▲ 0.24%</Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.lime, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.onAccent + '1F', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: colors.onAccent, fontSize: 20 }}>⌂</Text>
                </View>
                <View>
                  <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Real Estate</Text>
                  <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 12, marginTop: 2, opacity: 0.8 }}>2 holdings</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
                  {currency} {convert(2_800_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
                <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 12, fontWeight: '600', marginTop: 2, opacity: 0.85 }}>▼ 1.35%</Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.surface, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Profits</Text>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 4 }}>
                  {currency} {convert(1_486_550).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </Text>
              </View>
              <Pressable
                style={{ backgroundColor: colors.lime, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radii.button }}
                onPress={() => router.push('/(app)/marketplace')}
              >
                <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>Invest</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Category pills */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl }}>
          {CATEGORIES.map((c) => {
            const col = c.color === 'lime' ? colors.lime : c.color === 'teal' ? colors.teal : colors.lavender;
            return <IconPill key={c.label} icon={c.icon} label={c.label} color={col} onPress={() => router.push('/(app)/marketplace')} />;
          })}
        </View>

        {/* Watchlist */}
        <View style={{ marginTop: spacing.xxl }}>
          <SectionHeader title="Watchlist" action="Edit watchlist" onAction={() => {}} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, marginBottom: spacing.md }}>
            {WATCHLIST_FILTERS.map((f, i) => <Chip key={f} label={f} active={i === 0} />)}
          </ScrollView>

          <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 18, fontWeight: '700' }}>₦</Text>
              </View>
              <View>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>Lagos Solar Fund II</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: 2 }}>14.5% target · 18mo</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '700' }}>
                {currency} {convert(500_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
              <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700', marginTop: 2 }}>▲ 0.35%</Text>
            </View>
          </Card>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
`);

// ---------- MARKETPLACE ----------
write('app/(app)/marketplace.tsx', `import { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProjects } from '@/api/hooks';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeProvider';
import { fonts, spacing } from '@/theme/tokens';

const CATEGORIES = ['All', 'Solar', 'Real Estate', 'Agri', 'SME'];

export default function Marketplace() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data, loading, error, refetch } = useProjects();
  const [cat, setCat] = useState('All');
  const projects = (data ?? []).filter((p) => cat === 'All' || p.category === cat);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && projects.length > 0} onRefresh={refetch} tintColor={colors.lime} />}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Discover</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4, marginBottom: spacing.lg }}>Curated opportunities, vetted by BraveVest.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.lg }} contentContainerStyle={{ gap: spacing.sm }}>
          {CATEGORIES.map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} />)}
        </ScrollView>

        {loading && projects.length === 0 ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
            <EmptyState title="Couldn't load projects" body={error.message} />
            <Button label="Retry" variant="ghost" onPress={refetch} style={{ marginTop: spacing.md }} />
          </View>
        : projects.length === 0 ? <EmptyState title="No projects yet" body="Check back soon." />
        : projects.map((p) => <ProjectCard key={p.id} project={p} onPress={() => router.push(\`/(app)/project/\${p.slug}\`)} />)}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
`);

// ---------- PROJECT DETAIL ----------
write('app/(app)/project/[slug].tsx', `import { ScrollView, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProject } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function ProjectDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const { data: project, loading, error } = useProject(String(slug ?? ''));

  if (loading) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.lime} /></View></SafeAreaView>;
  if (error || !project) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <EmptyState title="Project not found" body={error?.message} />
        <Button label="Go back" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
      </View>
    </SafeAreaView>
  );

  const target = typeof project.targetReturn === 'number' ? project.targetReturn : parseFloat(String(project.targetReturn ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const min = project.minimumAmount ?? 0;
  const raised = project.raisedAmount ?? 0;
  const targetAmt = project.targetAmount ?? 1;
  const pct = Math.min(100, Math.round((raised / Math.max(1, targetAmt)) * 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: spacing.md }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600' }}>← Back</Text>
        </Pressable>

        <LinearGradient colors={[colors.surfaceMuted, colors.surfaceElevated]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 180, borderRadius: radii.card, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, ...shadows.card }}>
          <Text style={{ color: colors.lime, fontFamily: fonts.serif, fontSize: 60 }}>{project.category?.[0]?.toUpperCase() ?? '◈'}</Text>
        </LinearGradient>

        {project.category ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.lime, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radii.chip, marginBottom: spacing.md }}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 11, fontWeight: '700' }}>{project.category}</Text>
          </View>
        ) : null}

        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>{project.title}</Text>
        {project.summary ? <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 }}>{project.summary}</Text> : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.xl, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
          <Stat label="Target return" value={\`\${target}%\`} accent={colors.lime} />
          <Stat label="Funded" value={\`\${pct}%\`} />
          <Stat label="Minimum" value={\`\${currency} \${convert(min).toLocaleString(undefined, { maximumFractionDigits: 0 })}\`} />
          <Stat label="Raised" value={\`\${currency} \${convert(raised).toLocaleString(undefined, { maximumFractionDigits: 0 })}\`} />
        </View>

        <View style={{ height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' }}>
          <View style={{ height: 6, backgroundColor: colors.lime, borderRadius: 3, width: \`\${pct}%\` }} />
        </View>

        {project.description ? (
          <>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.sm }}>About</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14, lineHeight: 22 }}>{project.description}</Text>
          </>
        ) : null}

        <Button label="Invest now" onPress={() => {}} full style={{ marginTop: spacing.xl }} />
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: '50%', marginBottom: spacing.md }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 17, fontWeight: '700', marginTop: 2 }}>{value}</Text>
    </View>
  );
}
`);

// ---------- PORTFOLIO ----------
write('app/(app)/portfolio.tsx', `import { ScrollView, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePortfolio, usePortfolioSeries } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/components/ui/Card';
import { Sparkline } from '@/components/ui/Sparkline';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function Portfolio() {
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const { data, loading, error, refetch } = usePortfolio();
  const { data: series } = usePortfolioSeries();

  const s = data;
  const changePct = s && s.totalInvested > 0 ? ((s.currentValue - s.totalInvested) / s.totalInvested) * 100 : 0;
  const sparkPoints = (series ?? []).map((p) => p.value);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && !!s} onRefresh={refetch} tintColor={colors.lime} />}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Portfolio</Text>
        <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4, marginBottom: spacing.lg }}>Your holdings and performance.</Text>

        {loading && !s ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <EmptyState title="Couldn't load portfolio" body={error.message} />
        : !s || s.itemCount === 0 ? <EmptyState title="No investments yet" body="Head to Discover to find your first opportunity." />
        : (
          <>
            <LinearGradient colors={[...colors.heroGradient]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radii.card, padding: spacing.xl, marginBottom: spacing.lg, ...shadows.card }}>
              <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 13, opacity: 0.75 }}>Current value</Text>
              <Text style={{ color: colors.heroText, fontFamily: fonts.serif, fontSize: 34, marginTop: spacing.sm }}>
                {currency} {convert(s.currentValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm }}>
                <View style={{ backgroundColor: colors.heroText + '22', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radii.chip }}>
                  <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, fontWeight: '700' }}>{changePct >= 0 ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%</Text>
                </View>
                <Text style={{ color: colors.heroText, fontFamily: fonts.sans, fontSize: 12, opacity: 0.75 }}>Invested {currency} {convert(s.totalInvested).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </View>
            </LinearGradient>

            {sparkPoints.length > 1 ? (
              <Card style={{ marginBottom: spacing.lg }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11, marginBottom: spacing.md }}>Last {sparkPoints.length} periods</Text>
                <Sparkline points={sparkPoints} height={72} color={colors.teal} />
              </Card>
            ) : null}

            <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl }}>
              <Card style={{ flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Returns</Text>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 4 }}>{currency} {convert(s.totalReturns).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </Card>
              <Card style={{ flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 11 }}>Holdings</Text>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginTop: 4 }}>{s.itemCount}</Text>
              </Card>
            </View>

            <SectionHeader title="Holdings" />
            {s.items.map((it, i) => {
              const amount = it.amount ?? 0;
              const current = it.currentValue ?? amount;
              const pct = amount > 0 ? ((current - amount) / amount) * 100 : 0;
              return (
                <Card key={it.id ?? i} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600', flex: 1, marginRight: spacing.md }} numberOfLines={1}>{it.projectTitle ?? 'Investment'}</Text>
                    <Text style={{ color: pct >= 0 ? colors.lime : colors.lavender, fontFamily: fonts.sans, fontSize: 13, fontWeight: '700' }}>{pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</Text>
                  </View>
                </Card>
              );
            })}
          </>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
`);

// ---------- GOALS ----------
write('app/(app)/goals.tsx', `import { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, ActivityIndicator, Pressable, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGoals } from '@/api/hooks';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { api } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { fonts, radii, spacing, shadows } from '@/theme/tokens';

export default function Goals() {
  const { currency, convert } = useCurrency();
  const { colors } = useTheme();
  const { data, loading, error, refetch } = useGoals();
  const [modal, setModal] = useState(false);
  const goals = data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading && goals.length > 0} onRefresh={refetch} tintColor={colors.lime} />}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
          <View>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700' }}>Goals</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 4 }}>Save with purpose.</Text>
          </View>
          <Pressable style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }} onPress={() => setModal(true)}>
            <Text style={{ color: colors.onAccent, fontFamily: fonts.sans, fontSize: 22, lineHeight: 24 }}>＋</Text>
          </Pressable>
        </View>

        {loading && goals.length === 0 ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <EmptyState title="Couldn't load goals" body={error.message} />
        : goals.length === 0 ? <EmptyState title="No goals yet" body="Tap ＋ to set your first savings goal." />
        : goals.map((g) => {
          const pct = g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
          return (
            <Card key={g.id} style={{ marginBottom: spacing.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 15, fontWeight: '600', flex: 1, marginRight: spacing.md }} numberOfLines={1}>{g.title}</Text>
                <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 14, fontWeight: '700' }}>{pct}%</Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.surfaceMuted, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' }}>
                <View style={{ height: 6, backgroundColor: colors.lime, borderRadius: 3, width: \`\${pct}%\` }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>{currency} {convert(g.currentAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>of {currency} {convert(g.targetAmount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </View>
            </Card>
          );
        })}
        <View style={{ height: 120 }} />
      </ScrollView>

      <NewGoalModal visible={modal} onClose={() => setModal(false)} onCreated={refetch} />
    </SafeAreaView>
  );
}

function NewGoalModal({ visible, onClose, onCreated }: { visible: boolean; onClose: () => void; onCreated: () => void }) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    const amt = Number(target.replace(/[^0-9.]/g, ''));
    if (!title.trim() || !amt) { Alert.alert('Missing fields', 'Enter a title and target amount.'); return; }
    setBusy(true);
    try {
      await api.post('/api/goals', { title: title.trim(), targetAmount: amt });
      setTitle(''); setTarget(''); onClose(); onCreated();
    } catch (e: any) { Alert.alert('Could not create goal', e?.response?.data?.message ?? e?.message ?? 'Unknown error'); }
    finally { setBusy(false); }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.scrim, justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radii.card, borderTopRightRadius: radii.card, padding: spacing.xl, ...shadows.floating }}>
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 20, fontWeight: '700', marginBottom: spacing.lg }}>New goal</Text>
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12 }}>Title</Text>
          <TextInput style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border }} value={title} onChangeText={setTitle} placeholder="e.g. Emergency fund" placeholderTextColor={colors.textTertiary} />
          <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.md }}>Target amount (NGN)</Text>
          <TextInput style={{ backgroundColor: colors.surfaceMuted, color: colors.textPrimary, fontFamily: fonts.sans, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.input, fontSize: 15, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border }} value={target} onChangeText={setTarget} keyboardType="numeric" placeholder="500000" placeholderTextColor={colors.textTertiary} />
          <Button label="Create goal" onPress={submit} loading={busy} full style={{ marginTop: spacing.xl }} />
          <Pressable style={{ alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm }} onPress={onClose}>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 14 }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
`);

// ---------- PROFILE ----------
write('app/(app)/profile.tsx', `import { ScrollView, Text, View, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMe } from '@/api/hooks';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/theme/ThemeProvider';
import { useOnboarding } from '@/context/OnboardingContext';
import { api } from '@/api/client';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Chip } from '@/components/ui/Chip';
import { currencies, Currency, ThemeMode, fonts, radii, spacing } from '@/theme/tokens';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { colors, mode, setMode } = useTheme();
  const { reset: resetOnboarding } = useOnboarding();
  const { data: me, loading, error, refetch } = useMe();

  const email = me?.email ?? user?.email ?? '—';
  const name = [me?.firstName, me?.lastName].filter(Boolean).join(' ') || email.split('@')[0];
  const kyc = me?.kycStatus ?? user?.kycStatus ?? 'unknown';

  async function onLogout() { await logout(); router.replace('/(auth)/login'); }
  async function pickTheme(next: ThemeMode) { setMode(next); try { await api.patch('/api/users/me', { theme: next }); } catch {} }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 24, fontWeight: '700', marginBottom: spacing.lg }}>Profile</Text>

        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.lime + '1F', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.lime, fontFamily: fonts.sans, fontSize: 22, fontWeight: '700' }}>{name[0]?.toUpperCase() ?? '·'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 18, fontWeight: '600' }} numberOfLines={1}>{name}</Text>
            <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13, marginTop: 2 }} numberOfLines={1}>{email}</Text>
          </View>
        </Card>

        {loading && !me ? <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}><ActivityIndicator color={colors.lime} /></View>
        : error ? <><EmptyState title="Couldn't load profile" body={error.message} /><Button label="Retry" variant="ghost" onPress={refetch} style={{ alignSelf: 'center', marginTop: spacing.md }} /></>
        : (
          <>
            <SectionHeader title="Account" />
            <Card style={{ marginBottom: spacing.xl }}>
              <Row label="Role" value={me?.role ?? user?.role ?? '—'} />
              <Divider />
              <Row label="KYC status" value={String(kyc)} accent={kyc === 'approved' ? colors.lime : colors.lavender} />
              <Divider />
              <Row label="Phone" value={me?.phone ?? '—'} />
            </Card>

            <SectionHeader title="Appearance" />
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
              {(['system', 'light', 'dark'] as ThemeMode[]).map((m) => (
                <View key={m} style={{ flex: 1 }}>
                  <Chip label={m[0].toUpperCase() + m.slice(1)} active={m === mode} onPress={() => pickTheme(m)} />
                </View>
              ))}
            </View>

            <SectionHeader title="Currency" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl }}>
              {currencies.map((c) => <Chip key={c} label={c} active={c === currency} onPress={() => setCurrency(c as Currency)} />)}
            </View>

            <SectionHeader title="Actions" />
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border }} onPress={() => Alert.alert('KYC', 'Wire to /api/kyc wizard next')}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Complete KYC</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20 }}>›</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border }} onPress={() => Alert.alert('Change password', 'Wire to POST /api/users/change-password')}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Change password</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20 }}>›</Text>
            </Pressable>
            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border }} onPress={() => { resetOnboarding(); router.replace('/onboarding'); }}>
              <Text style={{ color: colors.textPrimary, fontFamily: fonts.sans, fontSize: 14, fontWeight: '600' }}>Replay onboarding</Text>
              <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 20 }}>›</Text>
            </Pressable>
            <Button label="Sign out" variant="ghost" onPress={onLogout} full style={{ marginTop: spacing.lg }} />
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
      <Text style={{ color: colors.textSecondary, fontFamily: fonts.sans, fontSize: 13 }}>{label}</Text>
      <Text style={{ color: accent ?? colors.textPrimary, fontFamily: fonts.sans, fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right' }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />;
}
`);

// ---------- HANDOFF ----------
write('HANDOFF.md', `# BraveVest Mobile — Handoff

Bootstrap: **v8** (${new Date().toISOString().slice(0, 10)})

## What's new
- **Onboarding carousel** (\`app/onboarding.tsx\`) — 3 slides, dots, Skip / Continue / Get started. First-run only.
- **OnboardingContext** — persists \`bv.onboarded\` in AsyncStorage. Replay from Profile.
- **Homepage layout** matches the UI kit: Total asset value headline, My Portfolio stacked cards (Solar / Real Estate / Profits + Invest), 4 icon pills, Watchlist with chip filters and a card.
- **Card** now has a border in both themes for clearer separation.

## Palette
BraveVest palette preserved:
- ink \`#0F0F10\` · lime \`#B3D941\` · teal \`#3FB8C4\` · lavender \`#C9A6F2\`
- Light theme derived — accents darkened for contrast on white.

## Themes
- Device default via \`useColorScheme()\`
- Override in Profile → Appearance (System / Light / Dark), persisted to AsyncStorage
- PATCH \`/api/users/me { theme }\` — needs backend field (see below)

## Backend requirement
\`\`\`prisma
model User {
  theme String @default("system")
}
\`\`\`
Migration: \`npx prisma migrate dev --name add_user_theme\`. PATCH \`/api/users/me\` should accept \`theme\`.

## Demo accounts (password: \`${CONFIG.demoPassword}\`)
${CONFIG.demoAccounts.map((a) => `- \`${a.email}\` — ${a.role}${a.kyc ? `, KYC ${a.kyc}` : ''}`).join('\n')}

## Screens
- Onboarding — 3-slide carousel
- Home — kit layout (Total asset value, My Portfolio stacked cards, category pills, Watchlist)
- Discover — chip filters + ProjectCard list
- Project detail — stats grid + progress + Invest CTA
- Portfolio — hero + sparkline + holdings
- Goals — list + floating ＋ → modal
- Profile — account, appearance, currency, replay onboarding, sign out

## Run
\`\`\`powershell
node init.js --force
cd mobile && npm install && npx expo start --clear
\`\`\`

## Next
1. \`theme\` field in Prisma User + PATCH endpoint
2. Investment flow (Paystack)
3. KYC wizard
4. Push notifications + biometrics
5. Restore auth: \`EXPO_PUBLIC_DEV_AUTH_BYPASS=0\`
6. \`npx eas-cli init\`
`);

log('---');
log('v8 ready — onboarding + homepage kit layout.');
log('next: cd mobile && npm install && npx expo start --clear');