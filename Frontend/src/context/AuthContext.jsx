import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// TEMPORARY: real login isn't implemented yet, so RoleRoute has nothing to
// check against and every protected page redirects forever. This mock user
// unblocks development of the other pages. Remove MOCK_USER once LoginPage
// actually authenticates and calls setUser() with the real logged-in user.
const MOCK_USER = {
  name: 'Nadeesha Ranasinghe',
  initials: 'NR',
  role: 'hr_manager', // change to 'admin' to preview the admin-only pages instead
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);

  // TODO: implement login/logout/register logic, persist token, etc.
  // TODO: on app load, if a token exists in localStorage, decode it or call
  // an /api/auth/me endpoint to restore the real `user` here instead of
  // leaving it null — otherwise a valid token with no restored user causes
  // ProtectedRoute and RoleRoute to disagree and loop forever.
  const value = { user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;