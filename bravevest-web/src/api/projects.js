import { api } from './client';

export const projectsApi = {
  async list(params = {}) {
    const r = await api.get('/projects', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async get(slug) {
    const r = await api.get('/projects/' + slug);
    return r.data;
  },
  async featured(limit = 3) {
    const r = await api.get('/projects', { params: { featured: 'true', limit } });
    return r.data.data;
  },
};
