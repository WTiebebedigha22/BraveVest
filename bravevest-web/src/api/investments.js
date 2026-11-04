import { api } from './client';

export const investmentsApi = {
  create: (payload) => api.post('/api/investments', payload).then(r => r.data?.data || r.data),
  listMine: () => api.get('/api/investments').then(r => r.data?.data || r.data || []),
  get: (id) => api.get('/api/investments/' + id).then(r => r.data?.data || r.data),
  portfolio: () => api.get('/api/investments/portfolio').then(r => r.data?.data || r.data),
  series: () => api.get('/api/investments/portfolio/series').then(r => r.data?.data || r.data || []),
};

export const paymentsApi = {
  initialize: (payload) => api.post('/api/payments/initialize', payload).then(r => r.data?.data || r.data),
  verify: (ref) => api.get('/api/payments/verify/' + ref).then(r => r.data?.data || r.data),
  transactions: (params) => api.get('/api/payments/transactions', { params }).then(r => r.data?.data || r.data || []),
  wallet: () => api.get('/api/payments/wallet').then(r => r.data?.data || r.data),
};
