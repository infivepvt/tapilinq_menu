import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useTheme } from '../hooks/useTheme';
import { useAuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useAuthContext();

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-background ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => setSidebarOpen(false)} 
            />
            <div className="fixed inset-y-0 left-0 flex w-full max-w-xs overflow-y-auto">
              <Sidebar mobile onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onSidebarOpen={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;