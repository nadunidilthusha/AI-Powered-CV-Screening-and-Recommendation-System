import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Upload,
  Users,
  LineChart,
  UserCog,
  Wrench,
  Activity,
  Database,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { ROUTES } from '../../../routes/routePaths';
import LogoutModal from '../../modals/LogoutModal';

const workspaceLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/jobs', label: 'Job postings', icon: Briefcase },
  { to: '/cv-upload', label: 'Upload CVs', icon: Upload },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/reports', label: 'Reports', icon: LineChart },
];

const adminLinks = [
  { to: '/admin/users', label: 'User management', icon: UserCog },
  { to: '/admin/api-config', label: 'API configuration', icon: Wrench },
  { to: '/admin/system-status', label: 'System status', icon: Activity },
  { to: '/admin/database-status', label: 'Database status', icon: Database },
];

const accountLinks = [{ to: '/settings', label: 'Settings', icon: Settings }];

const NavItem = ({ to, label, icon: Icon, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

const SectionLabel = ({ children }) => (
  <p className="px-3 pt-5 pb-2 text-xs font-medium text-slate-400">{children}</p>
);

// role: 'admin' | 'hr_manager'
const Sidebar = ({ role = 'admin', isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    if (onClose) onClose();
    navigate(ROUTES.LOGIN);
  };

  const navContent = (isMobile = false) => (
    <>
      <div>
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              TL
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">TalentLens</p>
              <p className="text-slate-400 text-xs leading-tight">CV Screening &amp; AI Match</p>
            </div>
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 md:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav sections */}
        <nav className="px-3">
          <SectionLabel>Workspace</SectionLabel>
          <div className="flex flex-col gap-1">
            {workspaceLinks.map((link) => (
              <NavItem
                key={link.to}
                {...link}
                onClick={isMobile ? onClose : undefined}
              />
            ))}
          </div>

          {role === 'admin' && (
            <>
              <SectionLabel>Admin</SectionLabel>
              <div className="flex flex-col gap-1">
                {adminLinks.map((link) => (
                  <NavItem
                    key={link.to}
                    {...link}
                    onClick={isMobile ? onClose : undefined}
                  />
                ))}
              </div>
            </>
          )}

          <SectionLabel>Account</SectionLabel>
          <div className="flex flex-col gap-1">
            {accountLinks.map((link) => (
              <NavItem
                key={link.to}
                {...link}
                onClick={isMobile ? onClose : undefined}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={() => {
            if (isMobile && onClose) onClose();
            setIsLogoutModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (md and up) */}
      <aside className="hidden md:flex w-64 h-screen sticky top-0 overflow-y-auto bg-[#1B2559] flex-col justify-between flex-shrink-0 z-20">
        {navContent(false)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Off-canvas Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#1B2559] z-50 flex flex-col justify-between overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent(true)}
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        userEmail={user?.email}
      />
    </>
  );
};

export default Sidebar;