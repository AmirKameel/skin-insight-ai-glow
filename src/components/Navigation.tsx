
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/ui/sidebar';
import {
  Menu,
  Home,
  Camera,
  Calendar,
  Book,
  LayoutGrid,
  User,
  LogOut,
  FileText,
  Star,
  Settings,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { checkUserPremiumStatus } from '@/services/analysisService';

interface NavigationProps {
  language?: 'en' | 'ar';
  setLanguage?: (language: 'en' | 'ar') => void;
}

const Navigation = ({ language = 'en', setLanguage }: NavigationProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useMobile();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user is premium
    if (user?.id) {
      checkUserPremiumStatus(user.id)
        .then(result => setIsPremium(result))
        .catch(error => console.error('Error checking premium status:', error));
    }
  }, [user]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: language === 'ar' ? "تم تسجيل الخروج بنجاح" : "Signed out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? "فشل في تسجيل الخروج" : "Failed to sign out",
      });
    }
  };

  const getInitials = () => {
    return user?.email?.substring(0, 2).toUpperCase() || 'U';
  };

  const toggleLanguage = () => {
    if (setLanguage) {
      const newLanguage = language === 'en' ? 'ar' : 'en';
      setLanguage(newLanguage);
      localStorage.setItem('preferredLanguage', newLanguage);
    }
  };

  const navItems = [
    {
      name: { en: 'Dashboard', ar: 'لوحة التحكم' },
      icon: <LayoutGrid className="h-5 w-5" />,
      href: '/dashboard',
      requiresAuth: true,
    },
    {
      name: { en: 'Skin Analysis', ar: 'تحليل البشرة' },
      icon: <Camera className="h-5 w-5" />,
      href: '/analysis',
      requiresAuth: true,
    },
    {
      name: { en: 'Journal', ar: 'المجلة' },
      icon: <FileText className="h-5 w-5" />,
      href: '/journal',
      requiresAuth: true,
    },
    {
      name: { en: 'Routines', ar: 'الروتين' },
      icon: <Calendar className="h-5 w-5" />,
      href: '/routines',
      requiresAuth: true,
    },
    {
      name: { en: 'Knowledge', ar: 'المعرفة' },
      icon: <Book className="h-5 w-5" />,
      href: '/knowledge',
      requiresAuth: false,
    },
  ];

  const renderNavLinks = () => (
    <ul className="space-y-2">
      {navItems
        .filter(item => !item.requiresAuth || user)
        .map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <li key={index}>
              <Link
                to={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 
                  ${isActive ? 'bg-gray-100 text-gray-900' : ''} 
                  ${language === 'ar' ? 'flex-row-reverse text-right' : ''}
                `}
              >
                {item.icon}
                <span>{language === 'ar' ? item.name.ar : item.name.en}</span>
                {item.href === '/analysis' && isPremium && (
                  <Star className="h-4 w-4 text-amber-500" />
                )}
              </Link>
            </li>
          );
        })}
      
      {user && (
        <li>
          <Link
            to="/upgrade"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900
              ${location.pathname === '/upgrade' ? 'bg-gray-100 text-gray-900' : ''}
              ${language === 'ar' ? 'flex-row-reverse text-right' : ''}
            `}
          >
            <Star className="h-5 w-5 text-amber-500" />
            <span>{language === 'ar' ? 'ترقية' : 'Upgrade'}</span>
          </Link>
        </li>
      )}
    </ul>
  );

  // Only render normal sidebar on desktop
  const renderDesktopSidebar = () => (
    <Sidebar className="fixed w-64 hidden md:block">
      <div className="px-3 py-2">
        <div className="mb-6 px-3 py-2">
          <Link
            to="/"
            className="flex items-center"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkinInsight AI
            </div>
          </Link>
        </div>
        {renderNavLinks()}
      </div>
    </Sidebar>
  );

  // Render mobile navigation (top bar + sheet sidebar)
  const renderMobileNav = () => (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SkinInsight AI
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="mr-2 h-4 w-4" />
                  {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                </DropdownMenuItem>
                {isPremium && (
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4 text-amber-500" />
                    {language === 'ar' ? 'عضو متميز' : 'Premium Member'}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/upgrade')}>
                  <Star className="mr-2 h-4 w-4" />
                  {language === 'ar' ? 'ترقية' : 'Upgrade'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => navigate('/dashboard')}>
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'}>
              <div className="px-2 py-6">
                <Link
                  to="/"
                  className="flex items-center mb-8 px-2"
                  onClick={() => setOpen(false)}
                >
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SkinInsight AI
                  </div>
                </Link>
                {renderNavLinks()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );

  // Render desktop sidebar + user dropdown
  const renderDesktopUserControls = () => (
    <div className="fixed right-4 top-4 z-30 hidden md:flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={toggleLanguage}>
        <Globe className="h-5 w-5" />
        <span className="sr-only">
          {language === 'ar' ? 'تبديل اللغة' : 'Toggle language'}
        </span>
      </Button>
      
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <User className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </DropdownMenuItem>
            {isPremium && (
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4 text-amber-500" />
                {language === 'ar' ? 'عضو متميز' : 'Premium Member'}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate('/upgrade')}>
              <Star className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'ترقية' : 'Upgrade'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="default" onClick={() => navigate('/dashboard')}>
          {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {renderMobileNav()}
      {renderDesktopSidebar()}
      {renderDesktopUserControls()}
    </>
  );
};

export default Navigation;
