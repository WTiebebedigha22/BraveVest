import { api } from './client';

export const investmentsApi = {
  async create(payload) { return (await api.post('/investments', payload)).data; },
  async list(params = {}) {
    const r = await api.get('/investments', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async get(id) { return (await api.get(`/investments/${id}`)).data; },
  async portfolio() { return (await api.get('/investments/portfolio')).data; },
  async series() { return (await api.get('/investments/portfolio/series')).data; },
};
