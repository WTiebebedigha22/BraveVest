import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const USE_FIREBASE = !!import.meta.env.VITE_FIREBASE_API_KEY && !import.meta.env.VITE_FIREBASE_API_KEY.startsWith('REPLACE');

/* ── Connection state (used by UI to show offline banners) ── */
export const connectionState = {
  online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  listeners: new Set(),
  set(online) {
    if (this.online === online) return;
    this.online = online;
    this.listeners.forEach((fn) => fn(online));
  },
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => connectionState.set(true));
  window.addEventListener('offline', () => connectionState.set(false));
}

/* ── Axios instance with sane timeouts ── */
export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000, // 20s — friendly to slow 3G
});

/* ── Token storage ── */
export const tokens = {
  get access() { return localStorage.getItem('bv_access'); },
  get refresh() { return localStorage.getItem('bv_refresh'); },
  set({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem('bv_access', accessToken);
    if (refreshToken) localStorage.setItem('bv_refresh', refreshToken);
  },
  clear() {
    localStorage.removeItem('bv_access');
    localStorage.removeItem('bv_refresh');
  },
};

/* ── Retry logic for transient network failures ── */
const RETRYABLE_STATUSES = [408, 425, 429, 500, 502, 503, 504];
const MAX_RETRIES = 2;

function isRetryable(error) {
  if (!error.response) return true; // network error — always retry
  return RETRYABLE_STATUSES.includes(error.response.status);
}

function backoffDelay(attempt) {
  // 400ms, then 1200ms
  return Math.min(400 * Math.pow(3, attempt), 5000);
}

/* ── Request interceptor: attach token, block when offline ── */
api.interceptors.request.use((config) => {
  const t = tokens.access;
  if (t) config.headers.Authorization = 'Bearer ' + t;

  // If we know we're offline, fail fast with a clear error
  if (!connectionState.online && config.method !== 'get') {
    return Promise.reject(Object.assign(new Error('You are offline. Please check your connection.'), { isOffline: true, config }));
  }
  return config;
});

/* ── Response interceptor: retry + refresh tokens ── */
let refreshing = null;

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    /* Retry transient failures */
    if (isRetryable(error) && !original._retried && (original._retryCount = (original._retryCount || 0)) < MAX_RETRIES) {
      original._retried = true;
      original._retryCount++;
      const delay = backoffDelay(original._retryCount);
      await new Promise((res) => setTimeout(res, delay));
      return api(original);
    }

    /* Legacy JWT auto-refresh (Firebase disabled) */
    if (USE_FIREBASE) return Promise.reject(error);

    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register') ||
      original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint && tokens.refresh) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = axios
            .post(API_BASE + '/auth/refresh', { refreshToken: tokens.refresh }, { timeout: 15000 })
            .then((res) => {
              tokens.set(res.data.data);
              return res.data.data.accessToken;
            })
            .finally(() => { refreshing = null; });
        }
        const newAccess = await refreshing;
        original.headers.Authorization = 'Bearer ' + newAccess;
        return api(original);
      } catch (refreshErr) {
        tokens.clear();
        if (window.location.pathname !== '/login') window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
