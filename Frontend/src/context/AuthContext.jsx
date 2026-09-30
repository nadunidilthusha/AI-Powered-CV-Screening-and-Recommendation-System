import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import authService from '../services/authService';

const AuthContext = createContext(null);

const readSavedSession = () => {
  const sources = [
    localStorage,
    sessionStorage,
  ];

  for (const store of sources) {
    const savedUser =
      store.getItem('user');

    const token =
      store.getItem('token');

    if (savedUser && token) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
  }

  return null;
};

const getStoredToken = () =>
  localStorage.getItem('token') ||
  sessionStorage.getItem('token');

const persistUser = (user) => {
  const safeUser = {
    ...user,

    // Avatar is fetched from the backend when
    // the session is restored. Do not store a large
    // image data URL in localStorage.
    avatarUrl: undefined,
  };

  const json = JSON.stringify(
    safeUser
  );

  if (localStorage.getItem('token')) {
    localStorage.setItem(
      'user',
      json
    );
  } else if (
    sessionStorage.getItem('token')
  ) {
    sessionStorage.setItem(
      'user',
      json
    );
  }
};

const clearAllSessionStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

const buildSessionUser = (userData) => ({
  ...userData,

  name: userData.fullName,

  fullName: userData.fullName,

  email: userData.email,

  role:
    userData.role ||
    'hr_manager',

  initials: userData.fullName
    ? userData.fullName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U',

  jobTitle:
    userData.role === 'admin'
      ? 'Administrator'
      : 'HR Manager',

  avatarUrl:
    userData.avatarUrl ?? null,
});

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(readSavedSession);

  const [toasts, setToasts] =
    useState([]);

  const [
    isLogoutModalOpen,
    setIsLogoutModalOpen,
  ] = useState(false);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const showToast = (
    message,
    type = 'info',
    duration = 4000
  ) => {
    const id =
      Date.now() +
      Math.random();

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter(
          (toast) =>
            toast.id !== id
        )
      );
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter(
        (toast) =>
          toast.id !== id
      )
    );
  };

  // Restore the latest profile from MongoDB.
  useEffect(() => {
    const token =
      getStoredToken();

    if (!token) {
      setAuthLoading(false);
      return;
    }

    const loadCurrentUser =
      async () => {
        try {
          const response =
            await authService.getMe();

          const currentUser =
            buildSessionUser(
              response.data.data
            );

          setUser(currentUser);

          persistUser(
            currentUser
          );
        } catch (err) {
          console.error(
            'Failed to restore authenticated user:',
            err
          );

          if (
            err.response?.status ===
            401
          ) {
            clearAllSessionStorage();
            setUser(null);
          }
        } finally {
          setAuthLoading(false);
        }
      };

    loadCurrentUser();
  }, []);

  const login = async (
    email,
    password,
    remember = true
  ) => {
    try {
      const response =
        await authService.login({
          email,
          password,
        });

      const {
        token,
        ...userData
      } = response.data.data;

      const sessionUser =
        buildSessionUser(
          userData
        );

      setUser(sessionUser);

      clearAllSessionStorage();

      const storage =
        remember
          ? localStorage
          : sessionStorage;

      storage.setItem(
        'token',
        token
      );

      storage.setItem(
        'user',
        JSON.stringify({
          ...sessionUser,
          avatarUrl:
            undefined,
        })
      );

      showToast(
        `Welcome back, ${sessionUser.name}!`,
        'success'
      );

      return sessionUser;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    }
  };

  const register = async (
    formData
  ) => {
    try {
      const response =
        await authService.register({
          fullName:
            formData.fullName,
          email:
            formData.email,
          password:
            formData.password,
          role: 'hr_manager',
        });

      const {
        token,
        ...userData
      } = response.data.data;

      const sessionUser =
        buildSessionUser(
          userData
        );

      setUser(sessionUser);

      clearAllSessionStorage();

      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...sessionUser,
          avatarUrl:
            undefined,
        })
      );

      showToast(
        'Recruiter account created successfully! Workspace activated.',
        'success'
      );

      return sessionUser;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          'Registration failed.'
      );
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

  const resetPassword = async (email, password) => {
    try {
      const response = await authService.resetPassword({ email, password });
      showToast(response.data.message || 'Password reset successfully! You can now login.', 'success', 6000);
      return true;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Session is still cleared locally.
    }

    setUser(null);

    clearAllSessionStorage();

    setIsLogoutModalOpen(false);

    showToast(
      'Signed out of recruitment workspace.',
      'info'
    );
  };

  const updateUser = (
    updates
  ) => {
    setUser((prev) => {
      const next = {
        ...prev,
        ...updates,
      };

      persistUser(next);

      return next;
    });
  };

  const value = {
    user,
    setUser,
    updateUser,

    login,
    register,
    forgotPassword,
    resetPassword,
    logout,

    toasts,
    showToast,
    removeToast,

    isLogoutModalOpen,
    setIsLogoutModalOpen,

    authLoading,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext =
  () => useContext(AuthContext);

export default AuthContext;