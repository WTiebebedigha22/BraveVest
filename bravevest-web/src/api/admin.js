import { api } from './client';

export const adminApi = {
  async dashboard() { return (await api.get('/admin/dashboard')).data.data; },
  async listKyc(params = {}) {
    const r = await api.get('/admin/kyc', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async getKyc(id) { return (await api.get('/admin/kyc/' + id)).data.data; },
  async approveKyc(id) { return (await api.patch('/admin/kyc/' + id + '/approve')).data.data; },
  async rejectKyc(id, reason) { return (await api.patch('/admin/kyc/' + id + '/reject', { reason })).data.data; },
  async investors(params = {}) {
    const r = await api.get('/admin/investors', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async investor(id) { return (await api.get('/admin/investors/' + id)).data.data; },
  async investments(params = {}) {
    const r = await api.get('/admin/investments', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async transactions(params = {}) {
    const r = await api.get('/admin/transactions', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async adminProjects(params = {}) {
    const r = await api.get('/projects/admin/list', { params });
    return { data: r.data.data, meta: r.data.meta };
  },
  async createProject(payload) { return (await api.post('/projects', payload)).data.data; },
  async updateProject(id, payload) { return (await api.patch('/projects/' + id, payload)).data.data; },
  async updateProjectStatus(id, status) { return (await api.patch('/projects/' + id + '/status', { status })).data.data; },
};
