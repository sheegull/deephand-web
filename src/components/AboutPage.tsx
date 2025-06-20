import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { t, getCurrentLanguage } from '../lib/i18n';
import { GlobalHeader } from './GlobalHeader';

interface AboutPageProps {
  className?: string;
}

export const AboutPage = ({ className = '' }: AboutPageProps) => {
  const values = ['quality', 'innovation', 'partnership', 'integrity'];

  const valueIcons = {
    quality: '●',
    innovation: '●',
    partnership: '●',
    integrity: '●',
  };

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
            {t('about.title')}
          </h1>
          {t('about.subtitle') && (
            <p className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-relaxed mb-4">
              {t('about.subtitle')}
            </p>
          )}
          <p className="font-alliance font-light text-zinc-500 text-base md:text-lg leading-relaxed">
            {t('about.description')}
          </p>
        </motion.div>

        {/* ミッション・ビジョンセクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="group"
          >
            <Card className="h-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0px_0px_80px_#0000009d] hover:scale-[1.02] cursor-pointer">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-4">
                  {t('about.mission.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <CardDescription className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed">
                  {t('about.mission.content')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="group"
          >
            <Card className="h-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0px_0px_80px_#0000009d] hover:scale-[1.02] cursor-pointer">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-4">
                  {t('about.vision.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <CardDescription className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed">
                  {t('about.vision.content')}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 価値観セクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mb-16 max-w-6xl mx-auto"
        >
          <h2 className="font-alliance font-normal text-white text-3xl md:text-4xl leading-tight mb-12 text-center">
            {t('about.values.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + index * 0.1,
                  ease: 'easeOut',
                }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{valueIcons[value as keyof typeof valueIcons]}</span>
                </div>
                <h3 className="font-alliance font-medium text-white text-lg md:text-xl mb-2">
                  {t(`about.values.${value}`)}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* チームセクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-center max-w-4xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md pt-14">
            <CardContent className="px-8 py-8">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('about.team.title')}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('about.team.description')}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium text-base rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const currentLanguage = getCurrentLanguage();
                      const contactUrl = currentLanguage === 'en' ? '/en#contact' : '/#contact';
                      window.location.href = contactUrl;
                    }
                  }}
                >
                  {t('about.cta.button')}
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
                  const termsUrl = currentLanguage === 'en' ? '/en/terms' : '/terms';
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
                  const privacyUrl = currentLanguage === 'en' ? '/en/privacy' : '/privacy';
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
