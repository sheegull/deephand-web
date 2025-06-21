import React from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { Button } from './button';

interface LanguageToggleProps {
  currentLanguage?: 'ja' | 'en';
  onLanguageChange?: (language: 'ja' | 'en') => Promise<void> | void;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const LanguageToggle = ({ 
  currentLanguage = 'ja', 
  onLanguageChange,
  fullWidth = false,
  isLoading = false
}: LanguageToggleProps) => {
  const handleToggle = async () => {
    const newLanguage = currentLanguage === 'ja' ? 'en' : 'ja';
    if (onLanguageChange) {
      try {
        await onLanguageChange(newLanguage);
      } catch (error) {
        console.error('Language switch failed:', error);
      }
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="sm"
      disabled={isLoading}
      className={`h-8 ${fullWidth ? 'w-full justify-start px-4' : 'w-16 justify-center'} p-0 font-alliance font-normal text-xs text-white hover:bg-white/20 transition-colors flex items-center gap-1 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label={`Switch to ${currentLanguage === 'ja' ? 'English' : 'Japanese'}`}
      title={`Switch to ${currentLanguage === 'ja' ? 'English' : 'Japanese'}`}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Globe className="w-3 h-3" />
      )}
      {isLoading ? '...' : (currentLanguage === 'ja' ? 'EN' : 'JA')}
    </Button>
  );
};