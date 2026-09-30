import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import useAuth from '../../hooks/useAuth';
import ToastContainer from '../common/Toast';

// Maps backend role strings to human-readable labels.
const roleLabel = (role) => {
  if (role === 'admin') return 'Administrator';
  if (role === 'hr_manager') return 'HR Manager';
  return 'HR Manager';
};

// Derives initials from a name like "Test Rashaan" -> "TR".
const initialsFromName = (name) => {
  if (!name) return 'NR';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
};

const HrLayout = () => {
  const { user, toasts, removeToast } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const displayName = user?.name || user?.fullName || 'HR User';
  const role = user?.role;

  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <Sidebar
        role={role ?? 'hr_manager'}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pageTitle="Dashboard"
          searchPlaceholder="Search candidates, job postings..."
          user={{
            name: displayName,
            role: roleLabel(role),
            initials: user?.initials ?? initialsFromName(displayName),
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