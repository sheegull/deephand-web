import React from 'react';
import { MotionDiv, optimizedTransition, useInView } from '../ui/motion-optimized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Container } from '../common/Container';
import { t } from '../../lib/i18n';

interface SolutionsSectionProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * SolutionsSection - Solutions and services section
 * Migrated from SolutionsPage.tsx for better structure organization
 * Optimized for performance and accessibility
 */
export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  className = '',
  'data-testid': testId = 'solutions-section',
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      key: 'robotics',
      icon: '🤖',
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'vision',
      icon: '👁️',
      color: 'from-green-500 to-green-600'
    },
    {
      key: 'nlp',
      icon: '💬',
      color: 'from-purple-500 to-purple-600'
    },
    {
      key: 'custom',
      icon: '⚙️',
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
            {t('solutions.title') || 'Solutions'}
          </h1>
          <p className="font-alliance font-light text-xl text-zinc-400 leading-relaxed mb-6">
            {t('solutions.subtitle') || 'AI・ロボティクスに特化したアノテーションソリューション'}
          </p>
          <p className="font-alliance font-light text-lg text-zinc-500 leading-relaxed">
            {t('solutions.description') || 
              'お客様の技術分野とプロジェクト要件に応じて、最適なデータアノテーションサービスをご提供します。'}
          </p>
        </MotionDiv>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {services.map((service, index) => (
            <MotionDiv
              key={service.key}
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
                <CardHeader className="px-6 pt-8 pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <CardTitle className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-2">
                    {t(`solutions.services.${service.key}.title`) || service.key}
                  </CardTitle>
                  <CardDescription className="font-alliance font-light text-zinc-400 text-base leading-relaxed">
                    {t(`solutions.services.${service.key}.description`) || ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8">
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="font-alliance font-medium text-white text-lg mb-3">
                        {t(`solutions.services.${service.key}.featuresTitle`) || '主な特徴'}
                      </h4>
                      <ul className="space-y-2">
                        {(t(`solutions.services.${service.key}.features`) as string[] || []).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                            <span className="font-alliance font-light text-zinc-400 text-sm">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Default features if no translation available */}
                      {(!t(`solutions.services.${service.key}.features`) || (t(`solutions.services.${service.key}.features`) as string[]).length === 0) && (
                        <ul className="space-y-2">
                          {service.key === 'robotics' && (
                            <>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">3Dポイントクラウドアノテーション</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">ロボット動作軌跡ラベリング</span>
                              </li>
                            </>
                          )}
                          {service.key === 'vision' && (
                            <>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">オブジェクト検出・セグメンテーション</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">画像分類・キーポイント検出</span>
                              </li>
                            </>
                          )}
                          {service.key === 'nlp' && (
                            <>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">テキスト分類・感情分析</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">固有表現認識・関係抽出</span>
                              </li>
                            </>
                          )}
                          {service.key === 'custom' && (
                            <>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">カスタムアノテーション設計</span>
                              </li>
                              <li className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex-shrink-0"></div>
                                <span className="font-alliance font-light text-zinc-400 text-sm">専用ツール開発・導入</span>
                              </li>
                            </>
                          )}
                        </ul>
                      )}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <MotionDiv
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={optimizedTransition}
                        className="w-full"
                      >
                        <button
                          className="w-full py-3 bg-transparent border-2 border-[#234ad9] text-[#234ad9] hover:bg-[#234ad9] hover:text-white rounded-lg font-alliance font-medium text-base transition-all duration-300 ease-out hover:shadow-xl"
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              window.location.href = '/request';
                            }
                          }}
                          data-testid={`solution-button-${service.key}`}
                        >
                          {t(`solutions.services.${service.key}.buttonText`) || '詳細を見る'}
                        </button>
                      </MotionDiv>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </div>

        {/* Process Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mb-16"
        >
          <h2 className="font-alliance font-normal text-3xl md:text-4xl text-white text-center mb-12">
            {t('solutions.process.title') || 'Our Process'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: t('solutions.process.step1.title') || '要件分析', description: t('solutions.process.step1.description') || 'お客様のプロジェクト要件を詳細に分析' },
              { step: '02', title: t('solutions.process.step2.title') || 'アノテーション実行', description: t('solutions.process.step2.description') || '高品質なアノテーションデータを作成' },
              { step: '03', title: t('solutions.process.step3.title') || '品質保証・納品', description: t('solutions.process.step3.description') || '厳格な品質チェック後、データを納品' }
            ].map((step, index) => (
              <MotionDiv
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#234ad9] to-[#1e3eb8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-alliance font-bold text-white text-lg">{step.step}</span>
                </div>
                <h3 className="font-alliance font-medium text-white text-xl mb-3">{step.title}</h3>
                <p className="font-alliance font-light text-zinc-400 text-sm leading-relaxed">{step.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Call to Action */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md">
            <CardContent className="px-8 py-12">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('solutions.cta.title') || 'プロジェクトを始めませんか？'}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('solutions.cta.description') || 
                  '専門チームがお客様のプロジェクトに最適なソリューションをご提案いたします。'}
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
                  data-testid="solutions-contact-button"
                >
                  {t('solutions.cta.button') || 'お問い合わせ'}
                </button>
              </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>
      </Container>
    </section>
  );
};

export default SolutionsSection;