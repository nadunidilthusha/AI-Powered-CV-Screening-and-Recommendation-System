import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from './routePaths';

// allow: array of role strings permitted to access this branch, e.g. ['admin']
const RoleRoute = ({ allow = [] }) => {
  const { user } = useAuth();

  // TODO: replace with real role check once useAuth/AuthContext returns actual user data
  if (!user || !allow.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
