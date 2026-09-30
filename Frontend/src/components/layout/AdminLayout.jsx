import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar/Sidebar';
import Navbar from '../common/Navbar/Navbar';
import Footer from '../common/Footer/Footer';
import useAuth from '../../hooks/useAuth';

const roleLabel = (role) => {
  if (role === 'admin') return 'Administrator';
  if (role === 'hr_manager') return 'HR Manager';
  return 'Administrator';
};

const initialsFromName = (name) => {
  if (!name) return 'AD';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
};

const AdminLayout = () => {
  const { user } = useAuth();

  const displayName = user?.name || user?.fullName || 'Admin User';
  const role = user?.role;

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role ?? 'admin'} />
      <div className="flex-1 flex flex-col">
        <Navbar
          pageTitle="Dashboard"
          searchPlaceholder="Search candidates, users, logs..."
          user={{
            name: displayName,
            role: roleLabel(role),
            initials: user?.initials ?? initialsFromName(displayName),
            avatarUrl: user?.avatarUrl ?? null,
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