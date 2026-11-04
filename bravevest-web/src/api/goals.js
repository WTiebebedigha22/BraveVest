import { api } from './client';

export const goalsApi = {
  list: () => api.get('/api/goals').then(r => r.data?.data || r.data || []),
  get: (id) => api.get('/api/goals/' + id).then(r => r.data?.data || r.data),
  create: (payload) => api.post('/api/goals', payload).then(r => r.data?.data || r.data),
  update: (id, payload) => api.patch('/api/goals/' + id, payload).then(r => r.data),
  remove: (id) => api.delete('/api/goals/' + id).then(r => r.data),
  recommend: (id) => api.get('/api/goals/' + id + '/recommend').then(r => r.data?.data || r.data),
};
