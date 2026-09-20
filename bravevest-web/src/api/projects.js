import { api } from './client';

export const projectsApi = {
  async list(params = {}) {
    const res = await api.get('/projects', { params });
    return { data: res.data.data, meta: res.data.meta };
  },
  async get(slug) {
    const res = await api.get(`/projects/${slug}`);
    return res.data;
  },
};
