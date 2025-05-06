
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  Calendar, 
  BookOpen, 
  User, 
  Menu, 
  X,
  Settings,
  LogOut,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: location.pathname === '/dashboard' },
    { name: 'Skin Analysis', href: '/analysis', icon: Camera, current: location.pathname === '/analysis' || location.pathname.startsWith('/analysis/') },
    { name: 'Routines', href: '/routines', icon: Calendar, current: location.pathname === '/routines' },
    { name: 'Knowledge', href: '/knowledge', icon: BookOpen, current: location.pathname === '/knowledge' },
    { name: 'Profile', href: '/profile', icon: User, current: location.pathname === '/profile' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't show navigation if not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="fixed top-4 right-4 z-40 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex md:hidden">
          <nav className="glass-effect w-64 h-full p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-10">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkinInsight
              </span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 p-3 rounded-md hover:bg-skin-blue/30 transition-all ${
                      item.current ? 'bg-skin-blue/20 font-semibold' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              
              <li>
                <Link
                  to="/upgrade"
                  className={`flex items-center gap-3 p-3 rounded-md text-amber-600 hover:bg-amber-50 transition-all ${
                    location.pathname === '/upgrade' ? 'bg-amber-50 font-semibold' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Star className="h-5 w-5" />
                  <span>Upgrade to Premium</span>
                </Link>
              </li>
              
              <li className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-md text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:block fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 z-30">
        <div className="mb-10">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SkinInsight
          </span>
        </div>
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={`flex items-center gap-3 p-3 rounded-md hover:bg-skin-blue/30 transition-all ${
                  item.current ? 'bg-skin-blue/20 font-semibold' : ''
                }`}
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
          
          <li>
            <Link
              to="/upgrade"
              className={`flex items-center gap-3 p-3 rounded-md text-amber-600 hover:bg-amber-50 transition-all ${
                location.pathname === '/upgrade' ? 'bg-amber-50 font-semibold' : ''
              }`}
            >
              <Star className="h-5 w-5" />
              <span>Upgrade to Premium</span>
            </Link>
          </li>
          
          <li className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
