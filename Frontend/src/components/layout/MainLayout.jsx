import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar/Navbar';
import Sidebar from '../common/Sidebar/Sidebar';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-3 sm:p-4 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
