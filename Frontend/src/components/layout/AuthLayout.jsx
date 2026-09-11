import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ToastContainer from '../common/Toast';

const AuthLayout = () => {
  const { toasts, removeToast } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Outlet />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default AuthLayout;
