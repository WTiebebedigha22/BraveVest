import { api } from './client';

export const authApi = {
  async register(payload) { return (await api.post('/auth/register', payload)).data.data; },
  async login(payload) { return (await api.post('/auth/login', payload)).data.data; },
  async me() { return (await api.get('/auth/me')).data.data; },
  async logout(refreshToken) { await api.post('/auth/logout', { refreshToken }); },
  async forgotPassword(email) { return (await api.post('/auth/forgot-password', { email })).data.data; },
  async resetPassword(token, password) { return (await api.post('/auth/reset-password', { token, password })).data.data; },
};
