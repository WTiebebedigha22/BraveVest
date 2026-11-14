import { api } from './client';

export const storiesApi = {
  listPublished: async () => (await api.get('/stories/published')).data.data,
  getPublished: async (id) => (await api.get(`/stories/${id}`)).data.data,
  adminList: async (params) => (await api.get('/stories/admin/list', { params })).data,
  adminGet: async (id) => (await api.get(`/stories/admin/${id}`)).data.data,
  create: async (payload) => (await api.post('/stories', payload)).data.data,
  update: async (id, payload) => (await api.patch(`/stories/${id}`, payload)).data.data,
  remove: async (id) => { await api.delete(`/stories/${id}`); },
};
