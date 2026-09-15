import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, LayoutGrid, Briefcase, Upload, Users,
  LineChart, Settings, UserCog, Wrench, Activity, Database,
} from 'lucide-react';
import { ROUTES } from '../../../routes/routePaths';


const WORKSPACE_ITEMS = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutGrid },
  { label: 'Job postings', to: ROUTES.JOBS, icon: Briefcase },
  { label: 'Upload CVs', to: ROUTES.JOBS, icon: Upload }, // upload needs a job picked first, so send them to the job list
  { label: 'Candidates', to: ROUTES.CANDIDATES, icon: Users },
  { label: 'Reports', to: ROUTES.REPORTS, icon: LineChart },
  { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
];

const ADMIN_ITEMS = [
  { label: 'User management', to: ROUTES.ADMIN_USERS, icon: UserCog },
  { label: 'API configuration', to: ROUTES.ADMIN_API_CONFIG, icon: Wrench },
  { label: 'System status', to: ROUTES.ADMIN_SYSTEM_STATUS, icon: Activity },
  { label: 'Database status', to: ROUTES.ADMIN_DATABASE_STATUS, icon: Database },
];


const Navbar = ({
  searchPlaceholder = 'Search...',
  user = { name: 'User', role: 'Member', initials: 'U', avatarUrl: null },
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setMenuOpen(false);
    navigate(ROUTES.SETTINGS);
  };

  const allItems = user.role === 'Administrator' ? [...WORKSPACE_ITEMS, ...ADMIN_ITEMS] : WORKSPACE_ITEMS;

  const results =
    query.trim().length === 0
      ? []
      : allItems.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  const showDropdown = query.trim().length > 0;

  const goTo = (item) => {
    setQuery('');
    navigate(item.to);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setQuery('')} />
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 max-h-72 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-slate-400">No sections match "{query}"</p>
                ) : (
                  results.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => goTo(item)}
                      className="w-full flex items-center gap-3 text-left px-3 py-2.5 hover:bg-slate-50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 flex-shrink-0">
                        <item.icon size={15} />
                      </div>
                      <p className="text-sm font-medium text-slate-800">{item.label}</p>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-2">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                {user.initials}
              </div>
            )}
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-0" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10">
                <button
                  onClick={handleProfileClick}
                  className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;