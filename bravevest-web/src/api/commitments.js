import { api } from './client';

export const commitmentsApi = {
  create: (payload) => api.post('/funding/commitments', payload).then((r) => r.data),
  mine: () => api.get('/funding/commitments/mine').then((r) => r.data),
  forRequest: (requestId) => api.get(`/funding/requests/${requestId}/commitments`).then((r) => r.data),
  cancel: (id) => api.post(`/funding/commitments/${id}/cancel`).then((r) => r.data),
};
