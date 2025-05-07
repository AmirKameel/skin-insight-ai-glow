
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  onLanguageChange: (language: 'en' | 'ar') => void;
  initialLanguage?: 'en' | 'ar';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange, initialLanguage = 'en' }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(
    // Try to get from localStorage first, otherwise use initialLanguage
    (localStorage.getItem('preferredLanguage') as 'en' | 'ar') || initialLanguage
  );

  // Set initial language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'ar';
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      onLanguageChange(savedLanguage);
    }
  }, [onLanguageChange]);

  const changeLanguage = (language: 'en' | 'ar') => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    onLanguageChange(language);
    
    // Set document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // You could also add a class to the body for additional RTL styles
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLanguage === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('ar')}
          className={currentLanguage === 'ar' ? 'bg-accent' : ''}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
