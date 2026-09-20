import { api } from './client';

export const paymentsApi = {
  async initialize(investmentId) {
    const res = await api.post('/payments/initialize', { investmentId });
    return res.data;
  },
  async verify(reference) {
    const res = await api.get(`/payments/verify/${reference}`);
    return res.data;
  },
  async transactions(params = {}) {
    const res = await api.get('/payments/transactions', { params });
    return { data: res.data.data, meta: res.data.meta };
  },
  async wallet() {
    const res = await api.get('/payments/wallet');
    return res.data;
  },
};
