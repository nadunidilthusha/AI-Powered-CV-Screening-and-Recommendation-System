import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const Navbar = ({
  pageTitle = 'Dashboard',
  searchPlaceholder = 'Search...',
  user = { name: 'User', role: 'Member', initials: 'U' },
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="relative">
          <button onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              {user.initials}
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10">
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Profile
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50">
        <h1 className="text-lg font-semibold text-slate-800">{pageTitle}</h1>
      </div>
    </header>
  );
};

export default Navbar;
