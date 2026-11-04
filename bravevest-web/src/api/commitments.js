import { api } from './client';

export const commitmentsApi = {
  mine: () => api.get('/api/funding/commitments/mine').then(r => r.data?.data || r.data || []),
  create: (payload) => api.post('/api/funding/commitments', payload).then(r => r.data?.data || r.data),
  cancel: (id) => api.post('/api/funding/commitments/' + id + '/cancel').then(r => r.data),
};
