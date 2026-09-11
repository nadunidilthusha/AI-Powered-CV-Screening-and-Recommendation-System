import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Pre-seed demo users in localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('talentlens_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        fullName: 'Nadeesha R.',
        jobTitle: 'HR Manager',
        email: 'recruiter@company.com',
        password: 'Password123!',
        specialization: 'Engineering',
        role: 'hr_manager',
        initials: 'NR',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
      }
    ];
  });

  // Active user session
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      name: 'Nadeesha R.',
      fullName: 'Nadeesha R.',
      email: 'recruiter@company.com',
      role: 'hr_manager',
      initials: 'NR',
      jobTitle: 'HR Manager'
    };
  });

  // Ensure default token exists for HR Manager access
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'mock_jwt_token_hr_manager_secure_session');
    }
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Toast notifications
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

  const generateMockJwt = (usr) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: usr.email,
      name: usr.fullName || usr.name,
      role: usr.role || 'hr_manager',
      exp: Math.floor(Date.now() / 1000) + 3600
    }));
    return `${header}.${payload}.signature`;
  };

  const login = async (email, password, remember = true) => {
    await new Promise(r => setTimeout(r, 500));
    const normalized = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === normalized);

    if (!found) {
      throw new Error('Account not found with this work email address.');
    }
    if (found.password !== password) {
      throw new Error('Invalid workspace password. Please check your credentials.');
    }

    const token = generateMockJwt(found);
    const sessionUser = {
      name: found.fullName,
      fullName: found.fullName,
      email: found.email,
      role: found.role || 'hr_manager',
      initials: found.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      jobTitle: found.jobTitle
    };

    setUser(sessionUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    showToast(`Welcome back, ${sessionUser.name}!`, 'success');
    return sessionUser;
  };

  const register = async (formData) => {
    await new Promise(r => setTimeout(r, 600));
    const normalized = formData.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === normalized)) {
      throw new Error('An enterprise account with this work email already exists.');
    }

    const newUser = {
      fullName: formData.fullName.trim(),
      jobTitle: formData.jobTitle.trim(),
      email: normalized,
      password: formData.password,
      specialization: formData.specialization || 'Engineering',
      role: 'hr_manager',
      initials: formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    setUsers(prev => [...prev, newUser]);
    const token = generateMockJwt(newUser);
    const sessionUser = {
      name: newUser.fullName,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      initials: newUser.initials,
      jobTitle: newUser.jobTitle
    };

    setUser(sessionUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    showToast('Recruiter account created successfully! Workspace activated.', 'success');
    return sessionUser;
  };

  const forgotPassword = async (email) => {
    await new Promise(r => setTimeout(r, 500));
    const token = 'TL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    showToast(`Password recovery link dispatched to ${email} (Expires in 15m). Token: ${token}`, 'success', 6000);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogoutModalOpen(false);
    showToast('Signed out of recruitment workspace.', 'info');
  };

  const value = {
    user,
    setUser,
    login,
    register,
    forgotPassword,
    logout,
    toasts,
    showToast,
    removeToast,
    isLogoutModalOpen,
    setIsLogoutModalOpen
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;
