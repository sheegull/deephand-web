import React from 'react';
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
      className="h-8 w-12 p-0 font-alliance font-normal text-xs text-white hover:bg-white/20 transition-colors"
    >
      {currentLanguage === 'ja' ? 'EN' : 'JA'}
    </Button>
  );
};