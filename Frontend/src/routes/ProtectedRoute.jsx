import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './routePaths';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;