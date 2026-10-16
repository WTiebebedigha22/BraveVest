import { api } from './client';

export const fundingApi = {
  // public
  list: (params = {}) => api.get('/funding/requests', { params }).then((r) => r.data),
  get: (idOrRef) => api.get(`/funding/requests/${idOrRef}`).then((r) => r.data),

  // borrower
  create: (payload) => api.post('/funding/requests', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/funding/requests/${id}`, payload).then((r) => r.data),
  submit: (id) => api.post(`/funding/requests/${id}/submit`).then((r) => r.data),
  mine: () => api.get('/funding/mine').then((r) => r.data),

  // admin
  reviewQueue: () => api.get('/funding/review').then((r) => r.data),
  approve: (id) => api.post(`/funding/requests/${id}/approve`).then((r) => r.data),
  reject: (id, reason) => api.post(`/funding/requests/${id}/reject`, { reason }).then((r) => r.data),
};
