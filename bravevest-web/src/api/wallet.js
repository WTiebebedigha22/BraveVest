import { api } from './client';

export const walletApi = {
  get: () => api.get('/wallet').then((r) => r.data?.data ?? r.data),
  ledger: (limit = 50) =>
    api.get('/wallet/ledger', { params: { limit } }).then((r) => {
      const payload = r.data?.data ?? r.data;
      return Array.isArray(payload) ? payload : [];
    }),
  credit: (payload) => api.post('/wallet/credit', payload).then((r) => r.data),
};
