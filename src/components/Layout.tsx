
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Map, 
  FileText, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  User, 
  Home, 
  Shield 
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;

  // Navigation links based on user role
  const getNavLinks = () => {
    // Common links for all users
    const links = [
      { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
      { to: '/hotspots', label: 'Crime Hotspots', icon: <Map size={20} /> },
    ];

    // Add role-specific links
    if (user) {
      if (user.role === 'admin' || user.role === 'law_enforcement') {
        links.push(
          { to: '/reports', label: 'Crime Reports', icon: <FileText size={20} /> },
          { to: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> }
        );
      }
      
      if (user.role === 'admin') {
        links.push(
          { to: '/admin', label: 'Admin Panel', icon: <Shield size={20} /> },
          { to: '/settings', label: 'Settings', icon: <Settings size={20} /> }
        );
      }
      
      if (user.role === 'law_enforcement') {
        links.push(
          { to: '/alerts', label: 'Alerts', icon: <AlertTriangle size={20} /> }
        );
      }
    }
    
    return links;
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <div className="bg-sidebar text-sidebar-foreground w-64 flex-shrink-0">
        <div className="p-4 flex items-center space-x-2">
          <Shield size={24} className="text-sidebar-foreground" />
          <h1 className="text-xl font-bold">PredictCrime</h1>
        </div>
        
        <div className="px-3 py-2">
          <p className="text-xs uppercase text-sidebar-foreground/60 mb-2 pl-3">Navigation</p>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(link.to) 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* User section at bottom of sidebar */}
        {user && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-sidebar-accent h-10 w-10 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="p-4 text-center text-sm text-muted-foreground border-t">
          <p>© {new Date().getFullYear()} PredictCrime. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
