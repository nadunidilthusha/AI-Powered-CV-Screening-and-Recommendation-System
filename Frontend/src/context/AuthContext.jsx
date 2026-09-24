import { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const readSavedSession = () => {
  const sources = [localStorage, sessionStorage];
  for (const store of sources) {
    const savedUser = store.getItem('user');
    const token = store.getItem('token');
    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
      }
    }
  }
  return null;
};

const clearAllSessionStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readSavedSession);
  const [toasts, setToasts] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email, password, remember = true) => {
    try {
      const response = await authService.login({ email, password });
      const { token, ...userData } = response.data.data;
      
      const sessionUser = {
        name: userData.fullName,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'hr_manager',
        initials: userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        jobTitle: 'HR Manager'
      };

      setUser(sessionUser);
      clearAllSessionStorage();
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('user', JSON.stringify(sessionUser));

      showToast(`Welcome back, ${sessionUser.name}!`, 'success');
      return sessionUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (formData) => {
    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'hr_manager'
      });
      
      const { token, ...userData } = response.data.data;

      const sessionUser = {
        name: userData.fullName,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        initials: userData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        jobTitle: formData.jobTitle
      };

      setUser(sessionUser);
      clearAllSessionStorage();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      showToast('Recruiter account created successfully! Workspace activated.', 'success');
      return sessionUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed.');
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      showToast(response.data.message || 'Password recovery link dispatched.', 'success', 6000);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to send reset link.');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {}
    setUser(null);
    clearAllSessionStorage();
    setIsLogoutModalOpen(false);
    showToast('Signed out of recruitment workspace.', 'info');
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(next));
      } else if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(next));
      }
      return next;
    });
  };

  const value = {
    user, setUser, updateUser, login, register, forgotPassword, logout, toasts, showToast, removeToast, isLogoutModalOpen, setIsLogoutModalOpen
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;

