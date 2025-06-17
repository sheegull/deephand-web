import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { t } from '../lib/i18n';
import { useLanguage } from '../hooks/useLanguage';

interface TermsOfServicePageProps {
  onLogoClick?: () => void;
}

export const TermsOfServicePage = ({ onLogoClick }: TermsOfServicePageProps) => {
  const { currentLanguage } = useLanguage();

  const handleNavigation = (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const articles = [
    'article1', 'article2', 'article3', 'article4', 'article5', 'article6',
    'article7', 'article8', 'article9', 'article10', 'article11'
  ];

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      {/* Header */}
      <header className="bg-[#1e1e1e] py-4 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div
            className="flex items-center gap-2 cursor-pointer w-fit"
            onClick={() => {
              if (onLogoClick) {
                onLogoClick();
              } else {
                const homeUrl = currentLanguage === 'en' ? '/en' : '/';
                handleNavigation(homeUrl);
              }
            }}
          >
            <img className="w-8 h-8 object-cover" alt="Icon" src="/logo.png" />
            <div className="font-alliance font-light text-white text-xl leading-tight">
              DeepHand
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg border-gray-200">
              <CardContent className="p-8 md:p-12">
                {/* Title */}
                <div className="mb-8">
                  <h1 className="font-alliance font-semibold text-gray-900 text-3xl md:text-4xl mb-4">
                    {t('terms.title')}
                  </h1>
                  <p className="font-alliance font-normal text-gray-600 text-sm">
                    {t('terms.lastUpdated')}
                  </p>
                </div>

                {/* Articles */}
                <div className="space-y-8">
                  {articles.map((articleKey, index) => (
                    <motion.div
                      key={articleKey}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border-l-4 border-[#234ad9] pl-6"
                    >
                      <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                        {t(`terms.${articleKey}.title`)}
                      </h2>
                      <p className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                        {t(`terms.${articleKey}.content`)}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-12 pt-8 border-t border-gray-200"
                >
                  <p className="font-alliance font-medium text-gray-900 text-sm md:text-base">
                    {t('terms.contact')}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-alliance font-light text-gray-600 text-xs">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center gap-6">
              <a
                onClick={() => {
                  const termsUrl = currentLanguage === 'en' ? '/en/terms' : '/terms';
                  handleNavigation(termsUrl);
                }}
                className="font-alliance font-light text-gray-600 text-xs hover:text-gray-900 transition-colors cursor-pointer"
              >
                {t('footer.termsOfService')}
              </a>
              <a
                onClick={() => {
                  const privacyUrl = currentLanguage === 'en' ? '/en/privacy' : '/privacy';
                  handleNavigation(privacyUrl);
                }}
                className="font-alliance font-light text-gray-600 text-xs hover:text-gray-900 transition-colors cursor-pointer"
              >
                {t('footer.privacyPolicy')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};