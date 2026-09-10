import { useAuthContext } from '../context/AuthContext';

// TODO: implement auth helpers (login, logout, isAuthenticated, etc.)
const useAuth = () => {
  const { user, setUser } = useAuthContext();
  return { user, setUser };
};

export default useAuth;
