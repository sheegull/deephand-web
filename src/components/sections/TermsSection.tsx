import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Container } from '../common/Container';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';

interface TermsSectionProps {
  className?: string;
  'data-testid'?: string;
  onLogoClick?: () => void;
}

/**
 * TermsSection - Terms of service content section
 * Migrated from TermsOfServicePage.tsx for better structure organization
 * Optimized for legal document display with proper typography
 */
export const TermsSection: React.FC<TermsSectionProps> = ({
  className = '',
  'data-testid': testId = 'terms-section',
  onLogoClick,
}) => {
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
    <div 
      className={`flex flex-col w-full bg-white min-h-screen ${className}`}
      data-testid={testId}
    >
      {/* Header */}
      <header className="bg-[#1e1e1e] py-4 px-4 md:px-8">
        <Container>
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
            data-testid="terms-logo"
          >
            <img className="w-8 h-8 object-cover" alt="DeepHand Logo" src="/logo.png" />
            <div className="font-alliance font-light text-white text-xl leading-tight">
              DeepHand
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 md:px-8">
        <Container className="max-w-4xl">
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
                    {t('terms.title') || '利用規約'}
                  </h1>
                  <p className="font-alliance font-normal text-gray-600 text-sm">
                    {t('terms.lastUpdated') || '最終更新日: 2024年1月1日'}
                  </p>
                </div>

                {/* Articles */}
                <div className="space-y-8">
                  {articles.map((articleKey, index) => {
                    const title = t(`terms.${articleKey}.title`);
                    const content = t(`terms.${articleKey}.content`);
                    
                    // Skip articles without content
                    if (!title || !content) return null;
                    
                    return (
                      <motion.div
                        key={articleKey}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border-l-4 border-[#234ad9] pl-6"
                        data-testid={`terms-article-${articleKey}`}
                      >
                        <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                          {title}
                        </h2>
                        <p className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                          {content}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Default content if no translation available */}
                {(!articles.some(a => t(`terms.${a}.title`))) && (
                  <div className="space-y-8">
                    <div className="border-l-4 border-[#234ad9] pl-6">
                      <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                        第1条（総則）
                      </h2>
                      <p className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                        本利用規約（以下「本規約」）は、DeepHand（以下「当社」）が提供するサービスの利用条件を定めるものです。
                        利用者は本規約に同意の上、サービスをご利用ください。
                      </p>
                    </div>
                    <div className="border-l-4 border-[#234ad9] pl-6">
                      <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                        第2条（利用資格）
                      </h2>
                      <p className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                        本サービスの利用者は、法人または個人事業主である必要があります。
                        未成年者が利用する場合は、保護者の同意が必要です。
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-12 pt-8 border-t border-gray-200"
                  data-testid="terms-contact"
                >
                  <p className="font-alliance font-medium text-gray-900 text-sm md:text-base">
                    {t('terms.contact') || 
                      'ご質問やお問い合わせは、お問い合わせフォームよりご連絡ください。'}
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 md:px-8">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-alliance font-light text-gray-600 text-xs">
              {t('footer.copyright') || '© 2024 DeepHand. All rights reserved.'}
            </div>
            <div className="flex items-center gap-6">
              <a
                onClick={() => {
                  const termsUrl = currentLanguage === 'en' ? '/en/terms' : '/terms';
                  handleNavigation(termsUrl);
                }}
                className="font-alliance font-light text-gray-600 text-xs hover:text-gray-900 transition-colors cursor-pointer"
                data-testid="footer-terms-link"
              >
                {t('footer.termsOfService') || '利用規約'}
              </a>
              <a
                onClick={() => {
                  const privacyUrl = currentLanguage === 'en' ? '/en/privacy' : '/privacy';
                  handleNavigation(privacyUrl);
                }}
                className="font-alliance font-light text-gray-600 text-xs hover:text-gray-900 transition-colors cursor-pointer"
                data-testid="footer-privacy-link"
              >
                {t('footer.privacyPolicy') || 'プライバシーポリシー'}
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default TermsSection;