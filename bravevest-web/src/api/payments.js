import { api } from './client';

export const paymentsApi = {
  async initialize(investmentId) { return (await api.post('/payments/initialize', { investmentId })).data; },
  async verify(reference) { return (await api.get('/payments/verify/' + reference)).data; },
  async transactions(params = {}) {
    const r = await api.get('/payments/transactions', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async wallet() { return (await api.get('/payments/wallet')).data; },
};
