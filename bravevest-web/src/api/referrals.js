import { api } from './client';

export const referralsApi = {
  me: () => api.get('/api/referrals/me').then(r => r.data?.data || r.data),
};
