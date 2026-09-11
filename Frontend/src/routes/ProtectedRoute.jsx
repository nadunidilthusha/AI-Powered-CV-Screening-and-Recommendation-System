import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Temporarily bypass auth check for frontend development
  return <Outlet />;
};

export default ProtectedRoute;