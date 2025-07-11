import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { t, getCurrentLanguage, onLanguageChange, getLocalizedPath, setManualNavigationFlag } from '../lib/i18n';
import { GlobalHeader } from './GlobalHeader';

interface ResourcesPageProps {
  className?: string;
}

export const ResourcesPage = ({ className = '' }: ResourcesPageProps) => {
  // 言語変更に反応するための再レンダリングstate
  const [, forceUpdate] = React.useState({});
  
  React.useEffect(() => {
    // 言語変更時の再レンダリング登録
    const unsubscribe = onLanguageChange(() => {
      forceUpdate({}); // 強制的に再レンダリング
    });
    
    return unsubscribe;
  }, []);

  const categories = [
    {
      key: 'whitepapers',
    },
    {
      key: 'caseStudies',
    },
    {
      key: 'techDocs',
    },
    {
      key: 'tools',
    },
  ];

  return (
    <>
      <GlobalHeader />
      <div
        className={`flex flex-col w-full bg-[#1e1e1e] min-h-screen pt-32 px-4 md:px-8 lg:px-20 ${className}`}
      >
        {/* ヘッダーセクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="font-alliance font-normal text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {t('resources.title')}
          </h1>
          {t('resources.subtitle') && (
            <p className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-relaxed mb-4">
              {t('resources.subtitle')}
            </p>
          )}
          <p className="font-alliance font-light text-zinc-500 text-base md:text-lg leading-relaxed">
            {t('resources.description')}
          </p>
        </motion.div>

        {/* リソースカテゴリグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.key}
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
                    {t(`resources.categories.${category.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <CardDescription className="font-alliance font-light text-zinc-400 text-base leading-relaxed">
                    {t(`resources.categories.${category.key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA セクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-center mt-20 max-w-2xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md pt-14">
            <CardContent className="px-8 py-8">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('resources.cta.title')}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('resources.cta.description')}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <button
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium text-base rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      setManualNavigationFlag();
                      const currentLanguage = getCurrentLanguage();
                      const contactUrl = getLocalizedPath(currentLanguage, '/') + '#contact';
                      window.location.href = contactUrl;
                    }
                  }}
                >
                  {t('resources.cta.button')}
                </button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-0 mt-auto pt-16 pb-8">
          <div className="font-alliance font-light text-zinc-400 text-[10px] leading-[16.8px]">
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            <a
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const currentLanguage = getCurrentLanguage();
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
                if (typeof window !== 'undefined') {
                  const currentLanguage = getCurrentLanguage();
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
