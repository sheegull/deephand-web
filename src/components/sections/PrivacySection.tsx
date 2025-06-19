import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Container } from '../common/Container';
import { t } from '../../lib/i18n';
import { useLanguage } from '../../hooks/useLanguage';

interface PrivacySectionProps {
  className?: string;
  'data-testid'?: string;
  onLogoClick?: () => void;
}

/**
 * PrivacySection - Privacy policy content section
 * Migrated from PrivacyPolicyPage.tsx for better structure organization
 * Optimized for legal document display with proper typography
 */
export const PrivacySection: React.FC<PrivacySectionProps> = ({
  className = '',
  'data-testid': testId = 'privacy-section',
  onLogoClick,
}) => {
  const { currentLanguage } = useLanguage();

  const handleNavigation = (url: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };

  const sections = [
    'section1', 'section2', 'section3', 'section4', 
    'section5', 'section6', 'section7', 'section8'
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
            data-testid="privacy-logo"
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
                    {t('privacy.title') || 'プライバシーポリシー'}
                  </h1>
                  <p className="font-alliance font-normal text-gray-600 text-sm">
                    {t('privacy.lastUpdated') || '最終更新日: 2024年1月1日'}
                  </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                  {sections.map((sectionKey, index) => {
                    const title = t(`privacy.${sectionKey}.title`);
                    const content = t(`privacy.${sectionKey}.content`);
                    
                    // Skip sections without content
                    if (!title || !content) return null;
                    
                    return (
                      <motion.div
                        key={sectionKey}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border-l-4 border-[#234ad9] pl-6"
                        data-testid={`privacy-section-${sectionKey}`}
                      >
                        <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                          {title}
                        </h2>
                        <div className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                          {content.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Default content if no translation available */}
                {(!sections.some(s => t(`privacy.${s}.title`))) && (
                  <div className="space-y-8">
                    <div className="border-l-4 border-[#234ad9] pl-6">
                      <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                        個人情報の取り扱いについて
                      </h2>
                      <p className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                        DeepHand（以下「当社」）は、お客様の個人情報保護の重要性を認識し、
                        個人情報の保護に関する法律（個人情報保護法）を遵守し、
                        お客様の個人情報を適切に取り扱うことをお約束いたします。
                      </p>
                    </div>
                    <div className="border-l-4 border-[#234ad9] pl-6">
                      <h2 className="font-alliance font-semibold text-gray-900 text-lg md:text-xl mb-3">
                        収集する個人情報
                      </h2>
                      <p className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
                        当社では、お客様から以下の個人情報を収集する場合があります：
                        お名前、メールアドレス、電話番号、所属組織名、お問い合わせ内容など。
                      </p>
                    </div>
                  </div>
                )}
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

export default PrivacySection;