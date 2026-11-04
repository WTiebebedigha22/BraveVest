import { api } from './client';

export const documentsApi = {
  list: () => api.get('/api/users/documents').then(r => r.data?.data || r.data || []),
  upload: (formData) => api.post('/api/users/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data?.data || r.data),
  delete: (id) => api.delete('/api/users/documents/' + id).then(r => r.data),
};
