import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { t } from '../lib/i18n';
import { GlobalHeaderFixed } from './GlobalHeaderFixed';
import { useLanguage } from '../hooks/useLanguage';

interface AboutPageProps {
  className?: string;
}

export const AboutPage = ({ className = '' }: AboutPageProps) => {
  const { currentLanguage } = useLanguage();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = React.useCallback((newLanguage: string) => {
    console.log('Language changing to:', newLanguage);
  }, []);

  const sections = [
    {
      key: 'mission',
    },
    {
      key: 'vision',
    },
    {
      key: 'team',
    },
    {
      key: 'contact',
    },
  ];

  return (
    <>
      <GlobalHeaderFixed onLanguageChange={handleLanguageChange} />
      <div
        className={`flex flex-col w-full bg-[#1e1e1e] min-h-screen pt-32 px-4 md:px-8 lg:px-20 ${className}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="font-alliance font-normal text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {t('about.title')}
          </h1>
          <p className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-relaxed">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: 'easeOut',
              }}
              className="group"
            >
              <Card className="h-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0px_0px_80px_#0000009d] hover:scale-[1.02] cursor-pointer">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="font-alliance font-normal text-white text-xl md:text-2xl leading-tight mb-4">
                    {t(`about.sections.${section.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="font-alliance font-light text-zinc-400 text-base leading-relaxed">
                    {t(`about.sections.${section.key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <footer className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0 mt-auto pt-16 pb-8">
          <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            <a
              onClick={() => {
                if (isClient && typeof window !== 'undefined') {
                  const termsUrl = currentLanguage === 'ja' ? '/ja/terms' : '/terms';
                  window.location.href = termsUrl;
                }
              }}
              className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
            >
              {t('footer.termsOfService')}
            </a>
            <a
              onClick={() => {
                if (isClient && typeof window !== 'undefined') {
                  const privacyUrl = currentLanguage === 'ja' ? '/ja/privacy' : '/privacy';
                  window.location.href = privacyUrl;
                }
              }}
              className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px] hover:text-gray-300 transition-colors cursor-pointer"
            >
              {t('footer.privacyPolicy')}
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};