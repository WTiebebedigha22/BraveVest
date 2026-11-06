/**
 * BraveVest — apiFetch
 *
 * Thin wrapper around the axios client (src/api/client.js).
 * The axios request interceptor attaches the Bearer token from `bv_access`.
 * Base URL is already configured on the axios instance (VITE_API_BASE_URL).
 *
 * Callers pass a path WITHOUT the /api prefix, e.g.:
 *   apiFetch('/dashboard')            → GET  http://localhost:3001/api/dashboard
 *   apiFetch('/wallet/withdraw', { method: 'POST', body: { amount: 5000 } })
 */

import { api as apiClient } from '@/api/client';

export async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body =
    options.body === undefined
      ? undefined
      : typeof options.body === 'string'
      ? JSON.parse(options.body)
      : options.body;

  try {
    const res = await apiClient.request({
      url: path,
      method,
      data: body,
      headers: options.headers,
    });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      `Request failed (${err.response?.status || 'network'})`;
    const wrapped = new Error(message);
    wrapped.status = err.response?.status;
    wrapped.data = err.response?.data;
    throw wrapped;
  }
}

export const api = {
  get: (p, o) => apiFetch(p, { ...o, method: 'GET' }),
  post: (p, body, o) => apiFetch(p, { ...o, method: 'POST', body }),
  patch: (p, body, o) => apiFetch(p, { ...o, method: 'PATCH', body }),
  put: (p, body, o) => apiFetch(p, { ...o, method: 'PUT', body }),
  del: (p, o) => apiFetch(p, { ...o, method: 'DELETE' }),
};