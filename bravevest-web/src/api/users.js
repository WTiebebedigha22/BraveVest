import { api } from './client';

export const usersApi = {
  async me() { return (await api.get('/users/me')).data.data; },
  async update(payload) { return (await api.patch('/users/me', payload)).data.data; },
  async changePassword(currentPassword, newPassword) {
    return (await api.post('/users/me/change-password', { currentPassword, newPassword })).data.data;
  },
};
