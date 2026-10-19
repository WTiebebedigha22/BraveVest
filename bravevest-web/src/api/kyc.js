import { api } from './client';

export const kycApi = {
  get: () => api.get('/kyc').then((r) => r.data?.data ?? r.data),
  status: () => api.get('/kyc/status').then((r) => r.data?.data ?? r.data),
  saveStep: (step, payload) => api.patch(`/kyc/step/${step}`, payload).then((r) => r.data?.data ?? r.data),
  upload: (file, type) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    return api.post('/kyc/documents', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data?.data ?? r.data);
  },
  submit: () => api.post('/kyc/submit').then((r) => r.data?.data ?? r.data),
};

export const payApi = {
  resolveAccount: (bank, account) =>
    api.get('/payments/resolve-account', { params: { bank, account } }).then((r) => r.data?.data ?? r.data),
};
