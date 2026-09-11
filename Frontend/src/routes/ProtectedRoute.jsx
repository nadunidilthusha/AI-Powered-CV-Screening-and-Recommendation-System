import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './routePaths';

// TEMPORARY: paired with the MOCK_USER in AuthContext.jsx while real login
// isn't built yet. Always "authenticated" so pages are reachable for
// development. Revert to the real token check below once LoginPage sets a
// real token on successful login.
// const isAuthenticated = () => Boolean(localStorage.getItem('token'));
const isAuthenticated = () => true;

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;