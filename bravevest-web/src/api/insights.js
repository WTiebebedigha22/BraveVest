import { api } from './client';

export const insightsApi = {
  /* Public */
  async list(params = {}) { return (await api.get('/insights', { params })).data.data; },
  async get(id) { return (await api.get('/insights/' + id)).data.data; },

  /* Admin */
  async adminList(params = {}) {
    const r = await api.get('/insights/admin/list', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async adminGet(id) { return (await api.get('/insights/' + id)).data.data; },
  async create(payload) { return (await api.post('/insights', payload)).data.data; },
  async update(id, payload) { return (await api.patch('/insights/' + id, payload)).data.data; },
  async toggle(id) { return (await api.patch('/insights/' + id + '/toggle')).data.data; },
  async remove(id) { await api.delete('/insights/' + id); },
};
