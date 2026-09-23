import { api } from './client';

export const goalsApi = {
  async list() { return (await api.get('/goals')).data.data; },
  async create(payload) { return (await api.post('/goals', payload)).data.data; },
  async update(id, payload) { return (await api.patch('/goals/' + id, payload)).data.data; },
  async remove(id) { await api.delete('/goals/' + id); },
  async recommend(id) { return (await api.get('/goals/' + id + '/recommend')).data.data; },
};
