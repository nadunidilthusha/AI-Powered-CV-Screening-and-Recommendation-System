import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './routePaths';

// TODO: replace with real auth check (e.g. via AuthContext / useAuth hook)
const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'));
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
