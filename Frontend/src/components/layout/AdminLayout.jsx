import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import useAuth from '../../hooks/useAuth';

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Navbar
          pageTitle="Dashboard"
          searchPlaceholder="Search candidates, users, logs..."
          user={{
            name: user?.name ?? 'Admin User',
            role: 'Administrator',
            initials: user?.initials ?? 'AD',
          }}
        />
        <main className="flex-1 p-6 bg-slate-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
