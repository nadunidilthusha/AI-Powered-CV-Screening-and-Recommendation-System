import api from './api';

const authService = {
  login: (credentials) =>
    api.post('/auth/login', credentials),

  register: (data) =>
    api.post('/auth/register', data),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data) =>
    api.post('/auth/reset-password', data),

  logout: () =>
    api.post('/auth/logout'),

  getMe: () =>
    api.get('/auth/me'),

  updateProfile: (data) =>
    api.put('/auth/me', data),

  removeAvatar: () =>
    api.delete('/auth/me/avatar'),
};

export default authService;