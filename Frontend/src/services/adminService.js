import api from './api';

const adminService = {
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateApiConfig: (data) => api.put('/admin/api-config', data),
  getApiConfig: () => api.get('/admin/api-config'),
  getSystemStatus: () => api.get('/admin/system-status'),
  getDatabaseStatus: () => api.get('/admin/database-status'),
};

export default adminService;