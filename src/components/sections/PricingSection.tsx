import React from 'react';
import { MotionDiv, optimizedTransition, useInView } from '../ui/motion-optimized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Container } from '../common/Container';
import { t, getCurrentLanguage } from '../../lib/i18n';

interface PricingSectionProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * PricingSection - Pricing plans and features section
 * Migrated from PricingPage.tsx for better structure organization
 * Optimized for performance and accessibility
 */
export const PricingSection: React.FC<PricingSectionProps> = ({
  className = '',
  'data-testid': testId = 'pricing-section',
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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

  const handlePlanClick = (planKey: string) => {
    if (typeof window !== 'undefined') {
      const isComingSoon = t(`pricing.plans.${planKey}.comingSoon`) as unknown as boolean;
      if (!isComingSoon) {
        const currentLanguage = getCurrentLanguage();
        const requestUrl = currentLanguage === 'en' ? '/en/request' : '/request';
        window.location.href = requestUrl;
      }
    }
  };

  const handleContactClick = () => {
    if (typeof window !== 'undefined') {
      const currentLanguage = getCurrentLanguage();
      const requestUrl = currentLanguage === 'en' ? '/en/request' : '/request';
      window.location.href = requestUrl;
    }
  };

  return (
    <section 
      className={`min-h-screen bg-[#1e1e1e] text-white ${className}`}
      data-testid={testId}
    >
      <Container className="py-16 lg:py-24">
        {/* Header Section */}
        <MotionDiv
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="font-alliance font-normal text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            {t('pricing.title') || 'Pricing Plans'}
          </h1>
          {t('pricing.subtitle') && (
            <p className="font-alliance font-light text-xl text-zinc-400 mb-4 leading-relaxed">
              {t('pricing.subtitle')}
            </p>
          )}
          <p className="font-alliance font-light text-lg text-zinc-500 leading-relaxed">
            {t('pricing.description') || 'お客様のニーズに合わせた柔軟な料金プランをご提供します。'}
          </p>
        </MotionDiv>

        {/* Key Features Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <MotionDiv
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">✓</span>
              </div>
              <p className="font-alliance font-light text-zinc-400 text-sm">
                {t(`pricing.features.${feature}`) || feature}
              </p>
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* Pricing Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const isComingSoon = t(`pricing.plans.${plan.key}.comingSoon`) as unknown as boolean;
            const features = (t(`pricing.plans.${plan.key}.features`) as string[]) || [];
            
            return (
              <MotionDiv
                key={plan.key}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={
                  isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.4 + index * 0.1,
                  ease: 'easeOut',
                  ...optimizedTransition,
                }}
                className="group relative"
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] text-white px-4 py-1 rounded-full text-sm font-alliance font-medium">
                      {t('pricing.recommended') || 'おすすめ'}
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
                      {t(`pricing.plans.${plan.key}.title`) || plan.key}
                    </CardTitle>
                    <CardDescription className="font-alliance font-light text-zinc-400 text-base">
                      {t(`pricing.plans.${plan.key}.description`) || ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-8">
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, idx) => (
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
                    <MotionDiv
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={optimizedTransition}
                      className="w-full"
                    >
                      <button
                        className={`w-full py-3 rounded-lg font-alliance font-medium text-base transition-all duration-300 ease-out shadow-lg ${
                          isComingSoon
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : plan.highlight
                              ? 'bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white hover:shadow-xl'
                              : 'bg-transparent border-2 border-[#234ad9] text-[#234ad9] hover:bg-[#234ad9] hover:text-white hover:shadow-xl'
                        }`}
                        disabled={isComingSoon}
                        onClick={() => handlePlanClick(plan.key)}
                        data-testid={`plan-button-${plan.key}`}
                      >
                        {isComingSoon
                          ? (t(`pricing.plans.${plan.key}.buttonText`) || 'お問い合わせ')
                          : 'お問い合わせ'}
                      </button>
                    </MotionDiv>
                  </CardContent>
                </Card>
              </MotionDiv>
            );
          })}
        </div>

        {/* Contact for Quote Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md">
            <CardContent className="px-8 py-12">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('pricing.contactForQuote') || 'カスタム見積もり'}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('pricing.cta.description') || 
                  'お客様のプロジェクト要件に応じて、最適なプランをご提案いたします。お気軽にお問い合わせください。'}
              </p>
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={optimizedTransition}
              >
                <button
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium text-base rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                  onClick={handleContactClick}
                  data-testid="contact-quote-button"
                >
                  {t('pricing.cta.button') || 'お見積もり依頼'}
                </button>
              </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>
      </Container>
    </section>
  );
};

export default PricingSection;