import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { t } from '../lib/i18n';
import { GlobalHeaderFixed } from './GlobalHeaderFixed';
import { useLanguage } from '../hooks/useLanguage';

interface PricingPageProps {
  className?: string;
}

export const PricingPage = ({ className = '' }: PricingPageProps) => {
  const { currentLanguage } = useLanguage();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = React.useCallback((newLanguage: string) => {
    console.log('Language changing to:', newLanguage);
  }, []);

  const plans = [
    {
      key: 'starter',
      highlight: false,
    },
    {
      key: 'professional', 
      highlight: true,
    },
    {
      key: 'enterprise',
      highlight: false,
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
            {t('pricing.title')}
          </h1>
          <p className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: 'easeOut',
              }}
              className="group"
            >
              <Card className={`h-full rounded-2xl shadow-[0px_0px_60px_#0000007d] border backdrop-blur-md hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
                plan.highlight 
                  ? '!bg-gradient-to-br from-[#234ad9]/20 to-[#1e3eb8]/20 border-[#234ad9]/50 hover:border-[#234ad9]/70' 
                  : '!bg-[#1A1A1A]/95 border-gray-700/30 hover:border-gray-600/50'
              }`}>
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="font-alliance font-normal text-white text-xl md:text-2xl leading-tight mb-4">
                    {t(`pricing.plans.${plan.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-white text-3xl font-bold mb-4">
                    {t(`pricing.plans.${plan.key}.price`)}
                  </div>
                  <p className="font-alliance font-light text-zinc-400 text-base leading-relaxed mb-6">
                    {t(`pricing.plans.${plan.key}.description`)}
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