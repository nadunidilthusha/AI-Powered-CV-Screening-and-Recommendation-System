import api from './api';

// TODO: implement API calls
const adminService = {
  getUsers: () => api.get('/admin/users'),
  updateApiConfig: (data) => api.put('/admin/api-config', data),
  getSystemStatus: () => api.get('/admin/system-status'),
  getDatabaseStatus: () => api.get('/admin/database-status'),
};

export default adminService;
