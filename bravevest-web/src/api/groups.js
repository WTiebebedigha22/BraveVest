import { api } from './client';

export const groupsApi = {
  list: () => api.get('/api/groups').then(r => r.data?.data || r.data || []),
  get: (id) => api.get('/api/groups/' + id).then(r => r.data?.data || r.data),
  create: (payload) => api.post('/api/groups', payload).then(r => r.data?.data || r.data),
  join: (inviteCode) => api.post('/api/groups/join', { inviteCode }).then(r => r.data?.data || r.data),
  contribute: (id, amount) => api.post('/api/groups/' + id + '/contribute', { amount }).then(r => r.data),
};
