import { api } from './client';

export const referralsApi = {
  async me() { return (await api.get('/referrals/me')).data.data; },
};
