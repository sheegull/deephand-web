import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    
    // Save to localStorage for persistence
    localStorage.setItem('preferred-language', newLanguage);
  };

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-gray-700 hover:text-primary"
      aria-label={`Switch to ${currentLanguage === 'ja' ? 'English' : 'Japanese'}`}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {currentLanguage === 'ja' ? 'EN' : 'JA'}
      </span>
    </Button>
  );
}