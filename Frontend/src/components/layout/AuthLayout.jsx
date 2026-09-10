import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* TODO: auth page content (login / register / forgot password) */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
