import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSwitcher() {
  const { currentLanguage, switchLanguage, isLoading } = useLanguage({ reloadOnSwitch: false });
  const [isToggling, setIsToggling] = useState(false);

  const toggleLanguage = async () => {
    if (isLoading || isToggling) return;
    
    setIsToggling(true);
    const newLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    
    try {
      await switchLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to switch language:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      disabled={isLoading || isToggling}
      className="flex items-center gap-2 text-gray-700 hover:text-primary disabled:opacity-50"
      aria-label={`Switch to ${currentLanguage === 'ja' ? 'English' : 'Japanese'}`}
    >
      <Globe className={`h-4 w-4 ${(isLoading || isToggling) ? 'animate-spin' : ''}`} />
      <span className="font-medium">
        {currentLanguage === 'ja' ? 'EN' : 'JA'}
      </span>
      {(isLoading || isToggling) && (
        <div className="ml-1 w-2 h-2 bg-current rounded-full animate-pulse" />
      )}
    </Button>
  );
}