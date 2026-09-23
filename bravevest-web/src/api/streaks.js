import { api } from './client';

export const streaksApi = {
  async me() { return (await api.get('/streaks/me')).data.data; },
};
