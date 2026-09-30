import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import useAuth from '../../hooks/useAuth';
import ToastContainer from '../common/Toast';

const HrLayout = () => {
  const { user, toasts, removeToast } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <Sidebar
        role={user?.role ?? 'hr_manager'}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pageTitle="Dashboard"
          searchPlaceholder="Search candidates, job postings..."
          user={{
            name: user?.name ?? 'Nadeesha R.',
            role: 'HR Manager',
            initials: user?.initials ?? 'NR',
            avatarUrl: user?.avatarUrl ?? null,
          }}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-[#F6F8FC] min-w-0">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default HrLayout;