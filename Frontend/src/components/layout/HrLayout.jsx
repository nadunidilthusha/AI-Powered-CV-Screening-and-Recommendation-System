import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import useAuth from '../../hooks/useAuth';
import ToastContainer from '../common/Toast';

const HrLayout = () => {
  const { user, toasts, removeToast } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <Sidebar role="hr_manager" />
      <div className="flex-1 flex flex-col">
        <Navbar
          pageTitle="Dashboard"
          searchPlaceholder="Search candidates, job postings..."
          user={{
            name: user?.name ?? 'Nadeesha R.',
            role: 'HR Manager',
            initials: user?.initials ?? 'NR',
          }}
        />
        <main className="flex-1 p-6 bg-[#F6F8FC]">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default HrLayout;
