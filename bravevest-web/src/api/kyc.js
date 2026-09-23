import { api } from './client';

export const kycApi = {
  async me() { return (await api.get('/kyc')).data.data; },
  async status() { return (await api.get('/kyc/status')).data.data; },
  async saveStep(step, payload) { return (await api.patch('/kyc/step/' + step, payload)).data.data; },
  async uploadDocument(file, type) {
    const form = new FormData();
    form.append('file', file);
    form.append('type', type);
    const res = await api.post('/kyc/documents', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async submit() { return (await api.post('/kyc/submit')).data.data; },
};
