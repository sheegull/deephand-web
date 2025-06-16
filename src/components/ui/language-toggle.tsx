import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from './button';

interface LanguageToggleProps {
  currentLanguage?: 'ja' | 'en';
  onLanguageChange?: (language: 'ja' | 'en') => void;
}

export const LanguageToggle = ({ 
  currentLanguage = 'ja', 
  onLanguageChange 
}: LanguageToggleProps) => {
  const handleToggle = () => {
    const newLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="sm"
      className="h-8 w-16 p-0 font-alliance font-normal text-xs text-white hover:bg-white/20 transition-colors flex items-center gap-1"
      aria-label={`Switch to ${currentLanguage === 'ja' ? 'English' : 'Japanese'}`}
      title={`Switch to ${currentLanguage === 'ja' ? 'English' : 'Japanese'}`}
    >
      <Globe className="w-3 h-3" />
      {currentLanguage === 'ja' ? 'EN' : 'JA'}
    </Button>
  );
};