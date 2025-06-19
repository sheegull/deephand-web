import React from 'react';
import { MotionDiv, optimizedTransition, useInView } from '../ui/motion-optimized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Container } from '../common/Container';
import { useConsistentTranslation } from '../../lib/astro-i18n';

interface ResourcesSectionProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * ResourcesSection - Resources and documentation section
 * Migrated from ResourcesPage.tsx for better structure organization
 * Optimized for performance and accessibility
 */
export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  className = '',
  'data-testid': testId = 'resources-section',
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  // SSR-safe translation hook
  const t = useConsistentTranslation();

  const categories = [
    {
      key: 'documentation',
      icon: '📚',
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'tutorials',
      icon: '🎓',
      color: 'from-green-500 to-green-600'
    },
    {
      key: 'bestPractices',
      icon: '⭐',
      color: 'from-purple-500 to-purple-600'
    },
    {
      key: 'support',
      icon: '🛠️',
      color: 'from-orange-500 to-orange-600'
    }
  ];

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
            {t('resources.title') || 'Resources'}
          </h1>
          <p className="font-alliance font-light text-xl text-zinc-400 leading-relaxed mb-6">
            {t('resources.subtitle') || 'データアノテーションに関する有用なリソースとガイド'}
          </p>
          <p className="font-alliance font-light text-lg text-zinc-500 leading-relaxed">
            {t('resources.description') || 
              '高品質なアノテーションデータ作成のためのベストプラクティス、ドキュメント、サポート情報をご提供します。'}
          </p>
        </MotionDiv>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {categories.map((category, index) => (
            <MotionDiv
              key={category.key}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }
              }
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
                ease: 'easeOut',
                ...optimizedTransition,
              }}
              className="group"
            >
              <Card className="h-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md hover:border-gray-600/50 hover:shadow-[0px_0px_80px_#0000009d] transition-all duration-300 cursor-pointer group-hover:scale-[1.02]">
                <CardHeader className="px-6 pt-8 pb-4 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <CardTitle className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-2">
                    {t(`resources.categories.${category.key}.title`) || category.key}
                  </CardTitle>
                  <CardDescription className="font-alliance font-light text-zinc-400 text-base">
                    {t(`resources.categories.${category.key}.description`) || ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <ul className="space-y-3">
                    {(() => {
                      const items = t(`resources.categories.${category.key}.items`);
                      const itemsArray = Array.isArray(items) ? items : [];
                      return itemsArray.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                          <span className="font-alliance font-light text-zinc-400 text-sm">
                            {item}
                          </span>
                        </li>
                      ));
                    })()}
                  </ul>
                  
                  {/* Default items if no translation available */}
                  {(() => {
                    const items = t(`resources.categories.${category.key}.items`);
                    const itemsArray = Array.isArray(items) ? items : [];
                    return itemsArray.length === 0;
                  })() && (
                    <ul className="space-y-3">
                      {category.key === 'documentation' && (
                        <>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">API仕様書</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">データフォーマットガイド</span>
                          </li>
                        </>
                      )}
                      {category.key === 'tutorials' && (
                        <>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">はじめてのアノテーション</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">高精度ラベリング技法</span>
                          </li>
                        </>
                      )}
                      {category.key === 'bestPractices' && (
                        <>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">品質管理プロセス</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">効率的なワークフロー</span>
                          </li>
                        </>
                      )}
                      {category.key === 'support' && (
                        <>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">技術サポート</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">FAQ・よくある質問</span>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </div>

        {/* Call to Action */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md">
            <CardContent className="px-8 py-12">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('resources.cta.title') || 'さらに詳しい情報が必要ですか？'}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('resources.cta.description') || 
                  '専門スタッフがお客様のプロジェクトに最適なソリューションをご提案いたします。'}
              </p>
              <MotionDiv
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={optimizedTransition}
              >
                <button
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#234ad9] to-[#1e3eb8] hover:from-[#1e3eb8] hover:to-[#183099] text-white font-alliance font-medium text-base rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/request';
                    }
                  }}
                  data-testid="resources-contact-button"
                >
                  {t('resources.cta.button') || 'お問い合わせ'}
                </button>
              </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>
      </Container>
    </section>
  );
};

export default ResourcesSection;