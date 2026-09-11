import { Outlet } from 'react-router-dom';

const RoleRoute = ({ allow = [] }) => {
  // Temporarily bypass role check for frontend development
  return <Outlet />;
};

export default RoleRoute;