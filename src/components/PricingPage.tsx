import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { t, getCurrentLanguage, onLanguageChange } from '../lib/i18n';
import { GlobalHeader } from './GlobalHeader';

interface PricingPageProps {
  className?: string;
}

export const PricingPage = ({ className = '' }: PricingPageProps) => {
  // 言語変更に反応するための再レンダリングstate
  const [, forceUpdate] = React.useState({});
  
  React.useEffect(() => {
    // 言語変更時の再レンダリング登録
    const unsubscribe = onLanguageChange(() => {
      forceUpdate({}); // 強制的に再レンダリング
    });
    
    return unsubscribe;
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

  const features = ['highQuality', 'fastDelivery', 'customSupport', 'secureData'];

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
            {t('pricing.title')}
          </h1>
          {t('pricing.subtitle') && (
            <p className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-relaxed mb-4">
              {t('pricing.subtitle')}
            </p>
          )}
          <p className="font-alliance font-light text-zinc-500 text-base md:text-lg leading-relaxed">
            {t('pricing.description')}
          </p>
        </motion.div>

        {/* 主要機能セクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {features.map((feature) => (
            <div key={feature} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">✓</span>
              </div>
              <p className="font-alliance font-light text-zinc-400 text-sm">
                {t(`pricing.features.${feature}`)}
              </p>
            </div>
          ))}
        </motion.div>

        {/* 料金プラングリッド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                ease: 'easeOut',
              }}
              className="group relative"
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] text-white px-4 py-1 rounded-full text-sm font-alliance font-medium">
                    {t('pricing.recommended')}
                  </span>
                </div>
              )}
              <Card
                className={`h-full rounded-2xl shadow-[0px_0px_60px_#0000007d] border backdrop-blur-md hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
                  plan.highlight
                    ? '!bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border-[#234ad9]/50 hover:border-[#234ad9]/70 shadow-[0px_0px_80px_#234ad930]'
                    : '!bg-[#1A1A1A]/95 border-gray-700/30 hover:border-gray-600/50 hover:shadow-[0px_0px_80px_#0000009d]'
                }`}
              >
                <CardHeader className="px-6 pt-8 pb-4 text-center">
                  <CardTitle className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-2">
                    {t(`pricing.plans.${plan.key}.title`)}
                  </CardTitle>
                  <CardDescription className="font-alliance font-light text-zinc-400 text-base">
                    {t(`pricing.plans.${plan.key}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3 mb-8">
                    {(t(`pricing.plans.${plan.key}.features`) as string[]).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="font-alliance font-light text-zinc-400 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <button
                      className={`w-full py-3 rounded-lg font-alliance font-medium text-base transition-all duration-300 ease-out shadow-lg ${
                        (t(`pricing.plans.${plan.key}.comingSoon`) as unknown as boolean)
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : plan.highlight
                            ? 'bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white hover:shadow-xl'
                            : 'bg-transparent border-2 border-[#234ad9] text-[#234ad9] hover:bg-[#234ad9] hover:text-white hover:shadow-xl'
                      }`}
                      disabled={t(`pricing.plans.${plan.key}.comingSoon`) as unknown as boolean}
                      onClick={() => {
                        if (
                          typeof window !== 'undefined' &&
                          !(t(`pricing.plans.${plan.key}.comingSoon`) as unknown as boolean)
                        ) {
                          const currentLanguage = getCurrentLanguage();
                          const requestUrl = currentLanguage === 'en' ? '/en/request' : '/request';
                          window.location.href = requestUrl;
                        }
                      }}
                    >
                      {(t(`pricing.plans.${plan.key}.comingSoon`) as unknown as boolean)
                        ? t(`pricing.plans.${plan.key}.buttonText`) || 'お問い合わせ'
                        : 'お問い合わせ'}
                    </button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* お見積もりセクション */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md pt-14">
            <CardContent className="px-8 py-8">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('pricing.contactForQuote')}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('pricing.cta.description')}
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
                      const requestUrl = currentLanguage === 'en' ? '/en/request' : '/request';
                      window.location.href = requestUrl;
                    }
                  }}
                >
                  {t('pricing.cta.button')}
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
