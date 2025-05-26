import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../stores/auth';
import Button from './ui/Button';
import { getInitials } from '../lib/utils';

interface HeaderProps {
  onSidebarOpen: () => void;
}

const Header = ({ onSidebarOpen }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <button 
              type="button"
              className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={onSidebarOpen}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error"></span>
            </button>

            {/* User menu */}
            <div className="relative ml-3">
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {getInitials(user?.name || '')}
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hidden md:flex"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;