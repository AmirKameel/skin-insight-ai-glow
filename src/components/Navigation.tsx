
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  Calendar, 
  BookOpen, 
  User, 
  Menu, 
  X,
  Settings,
  LucideProps
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationItem } from '@/types';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Skin Analysis', href: '/analysis', icon: Camera, current: false },
    { name: 'Routines', href: '/routines', icon: Calendar, current: false },
    { name: 'Knowledge', href: '/knowledge', icon: BookOpen, current: false },
    { name: 'Profile', href: '/profile', icon: User, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ];

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
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-skin-blue/30 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
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
                className="flex items-center gap-3 p-3 rounded-md hover:bg-skin-blue/30 transition-all"
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
