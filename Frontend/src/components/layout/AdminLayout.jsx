import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import useAuth from '../../hooks/useAuth';

const AdminLayout = () => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role={user?.role ?? 'admin'}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pageTitle="Dashboard"
          searchPlaceholder="Search candidates, users, logs..."
          user={{
            name: user?.name ?? 'Admin User',
            role: 'Administrator',
            initials: user?.initials ?? 'AD',
            avatarUrl: user?.avatarUrl ?? null,
          }}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-3 sm:p-4 md:p-6 bg-slate-50 min-w-0">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;