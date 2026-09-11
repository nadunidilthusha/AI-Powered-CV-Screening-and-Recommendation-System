import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './routePaths';

// TODO: replace with real auth check (e.g. via AuthContext / useAuth hook)
const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'));
};

const ProtectedRoute = () => {
  // Temporarily bypass auth check for frontend development
  return <Outlet />;
};

export default ProtectedRoute;
