import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
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
} from 'lucide-react';

const getWorkspaceLinks = (role) => [
  {
    to: role === 'hr_manager' ? '/dashboard' : '/',
    label: 'Dashboard',
    icon: LayoutGrid,
    end: true,
  },
  { to: '/jobs', label: 'Job postings', icon: Briefcase },
  { to: '/cv-upload', label: 'Upload CVs', icon: Upload },
  { to: '/candidates', label: 'Candidates', icon: Users },
  { to: '/reports', label: 'Reports', icon: LineChart },
];

const adminLinks = [
  {
    to: '/admin/users',
    label: 'User management',
    icon: UserCog,
  },
  {
    to: '/admin/api-config',
    label: 'API configuration',
    icon: Wrench,
  },
  {
    to: '/admin/system-status',
    label: 'System status',
    icon: Activity,
  },
  {
    to: '/admin/database-status',
    label: 'Database status',
    icon: Database,
  },
];

const accountLinks = [
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

const NavItem = ({ to, label, icon: Icon, end }) => (
  <NavLink
    to={to}
    end={end}
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
  <p className="px-3 pt-5 pb-2 text-xs font-medium text-slate-400">
    {children}
  </p>
);

// role: 'admin' | 'hr_manager'
const Sidebar = ({ role = 'admin' }) => {
  const workspaceLinks = getWorkspaceLinks(role);

  const handleLogout = () => {
    // TODO: clear auth state / token, redirect to /login
  };

  return (
    <aside className="w-64 min-h-screen bg-[#1B2559] flex flex-col justify-between">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
            TL
          </div>

          <div>
            <p className="text-white text-sm font-semibold leading-tight">
              TalentLens
            </p>

            <p className="text-slate-400 text-xs leading-tight">
              CV Screening &amp; AI Match
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3">
          <SectionLabel>Workspace</SectionLabel>

          <div className="flex flex-col gap-1">
            {workspaceLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </div>

          {/* Admin-only links */}
          {role === 'admin' && (
            <>
              <SectionLabel>Admin</SectionLabel>

              <div className="flex flex-col gap-1">
                {adminLinks.map((link) => (
                  <NavItem key={link.to} {...link} />
                ))}
              </div>
            </>
          )}

          <SectionLabel>Account</SectionLabel>

          <div className="flex flex-col gap-1">
            {accountLinks.map((link) => (
              <NavItem key={link.to} {...link} />
            ))}
          </div>
        </nav>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;