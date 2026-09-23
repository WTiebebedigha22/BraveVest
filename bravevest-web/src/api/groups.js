import { api } from './client';

export const groupsApi = {
  async list() { return (await api.get('/groups')).data.data; },
  async create(payload) { return (await api.post('/groups', payload)).data.data; },
  async get(id) { return (await api.get('/groups/' + id)).data.data; },
  async join(inviteCode) { return (await api.post('/groups/join', { inviteCode })).data.data; },
  async contribute(id, amount) { return (await api.post('/groups/' + id + '/contribute', { amount })).data.data; },
};
