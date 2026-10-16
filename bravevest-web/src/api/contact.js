import { api } from './client';

export const contactApi = {
  submit: (payload) => api.post('/contact', payload).then((r) => r.data),
  // admin
  list: (params = {}) => api.get('/contact', { params }).then((r) => r.data),
  get: (id) => api.get(`/contact/${id}`).then((r) => r.data),
  update: (id, payload) => api.patch(`/contact/${id}`, payload).then((r) => r.data),
};
