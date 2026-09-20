import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const USE_FIREBASE = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Token storage (legacy JWT mode) ── */
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

/* ── Request: attach token ── */
api.interceptors.request.use(async (config) => {
  if (USE_FIREBASE) {
    // Prefer a fresh Firebase ID token
    try {
      const { fbGetIdToken } = await import('./firebaseAuth');
      const idToken = await fbGetIdToken(false);
      if (idToken) config.headers.Authorization = `Bearer ${idToken}`;
    } catch {
      // fall through to JWT if Firebase fails
    }
  }
  if (!config.headers.Authorization) {
    const t = tokens.access;
    if (t) config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

/* ── Response: auto-refresh JWT on 401 (legacy mode only) ── */
let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;

    if (USE_FIREBASE) {
      // Firebase handles its own refresh; nothing to do
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/register') ||
      original?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint && tokens.refresh) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = axios
            .post(`${API_BASE}/auth/refresh`, { refreshToken: tokens.refresh })
            .then((res) => {
              tokens.set(res.data.data);
              return res.data.data.accessToken;
            })
            .finally(() => { refreshing = null; });
        }
        const newAccess = await refreshing;
        original.headers.Authorization = `Bearer ${newAccess}`;
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
