import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  Constants.expoConfig?.extra?.apiBaseUrl ??
  'http://localhost:3001';

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
  if (access && config.headers) config.headers.Authorization = `Bearer ${access}`;
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
            const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, { refresh });
            await tokenStore.set(data.access, data.refresh ?? refresh);
            return data.access;
          } catch { await tokenStore.clear(); return null; }
          finally { refreshing = null; }
        })();
      }
      const fresh = await refreshing;
      if (fresh) { original.headers.Authorization = `Bearer ${fresh}`; return api(original); }
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: { register: '/api/auth/register', login: '/api/auth/login', refresh: '/api/auth/refresh', logout: '/api/auth/logout', me: '/api/auth/me' },
  kyc: { get: '/api/kyc', step: (n: number) => `/api/kyc/step/${n}`, documents: '/api/kyc/documents', submit: '/api/kyc/submit' },
  projects: { list: '/api/projects', detail: (slug: string) => `/api/projects/${slug}` },
  investments: { create: '/api/investments', list: '/api/investments', portfolio: '/api/investments/portfolio', series: '/api/investments/portfolio/series' },
  payments: { init: '/api/payments/initialize', verify: (r: string) => `/api/payments/verify/${r}`, transactions: '/api/payments/transactions', wallet: '/api/payments/wallet' },
  users: { me: '/api/users/me', changePassword: '/api/users/change-password' },
  goals: { list: '/api/goals', detail: (id: string) => `/api/goals/${id}` },
  groups: { list: '/api/groups', join: '/api/groups/join', detail: (id: string) => `/api/groups/${id}`, contribute: (id: string) => `/api/groups/${id}/contribute` },
};
