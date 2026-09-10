import api from './api';

// TODO: implement API calls
const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  logout: () => api.post('/auth/logout'),
};

export default authService;
