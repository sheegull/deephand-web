import React from 'react';
import { MotionDiv } from '../ui/motion-optimized';
import { Container } from '../common/Container';
import { t } from '../../lib/i18n';

interface AboutSectionProps {
  className?: string;
  'data-testid'?: string;
}

/**
 * AboutSection - About us content section
 * Migrated from AboutPage.tsx for better structure organization
 * Optimized for performance and accessibility
 */
export const AboutSection: React.FC<AboutSectionProps> = ({
  className = '',
  'data-testid': testId = 'about-section',
}) => {
  return (
    <section 
      className={`min-h-screen bg-[#1e1e1e] text-white ${className}`}
      data-testid={testId}
    >
      <Container className="py-16 lg:py-24">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h1 className="font-alliance font-normal text-4xl lg:text-6xl text-white mb-6">
            {t('about.title') || 'About DeepHand'}
          </h1>
          <p className="font-alliance font-light text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {t('about.subtitle') || 'AI・ロボティクスに特化したデータアノテーションサービス'}
          </p>
        </MotionDiv>

        {/* Vision Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20"
        >
          <div>
            <h2 className="font-alliance font-medium text-2xl lg:text-3xl text-white mb-6">
              {t('about.vision.title') || 'Our Vision'}
            </h2>
            <p className="font-alliance font-light text-lg text-zinc-400 leading-relaxed mb-6">
              {t('about.vision.description') || 
                'AIとロボティクスの未来を切り拓くために、高品質なアノテーションデータを通じて技術革新を支援します。'}
            </p>
            <p className="font-alliance font-light text-lg text-zinc-400 leading-relaxed">
              {t('about.vision.mission') || 
                '私たちは、データの品質が AI の性能を決定する重要な要素であることを理解し、最高水準のアノテーションサービスを提供します。'}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full h-64 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-gray-700/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="font-alliance font-light text-sm text-zinc-400">
                  {t('about.vision.placeholder') || 'Innovation Through Data'}
                </p>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* Services Grid */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mb-20"
        >
          <h2 className="font-alliance font-medium text-2xl lg:text-3xl text-white text-center mb-12">
            {t('about.services.title') || 'Our Services'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: t('about.services.robotics.title') || 'Robotics Data',
                description: t('about.services.robotics.description') || 'ロボティクス用の高精度アノテーションデータ'
              },
              {
                icon: '👁️',
                title: t('about.services.vision.title') || 'Computer Vision',
                description: t('about.services.vision.description') || 'コンピュータビジョン向けデータセット'
              },
              {
                icon: '🧠',
                title: t('about.services.ai.title') || 'AI Training Data',
                description: t('about.services.ai.description') || 'AI学習用の品質保証されたデータ'
              }
            ].map((service, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2, ease: 'easeOut' }}
                className="bg-gray-900/50 border border-gray-700/30 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="font-alliance font-medium text-xl text-white mb-3">
                  {service.title}
                </h3>
                <p className="font-alliance font-light text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>

        {/* Team Section */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <h2 className="font-alliance font-medium text-2xl lg:text-3xl text-white mb-8">
            {t('about.team.title') || 'Our Commitment'}
          </h2>
          <p className="font-alliance font-light text-lg text-zinc-400 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('about.team.description') || 
              '経験豊富な専門家チームが、お客様のプロジェクトに最適なソリューションを提供します。品質、効率性、イノベーションを重視し、AI・ロボティクス分野の発展に貢献します。'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: t('about.stats.projects') || '100+', sublabel: t('about.stats.projectsLabel') || 'Projects' },
              { label: t('about.stats.accuracy') || '99.9%', sublabel: t('about.stats.accuracyLabel') || 'Accuracy' },
              { label: t('about.stats.clients') || '50+', sublabel: t('about.stats.clientsLabel') || 'Clients' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6">
                <div className="font-alliance font-bold text-3xl lg:text-4xl text-blue-400 mb-2">
                  {stat.label}
                </div>
                <div className="font-alliance font-light text-sm text-zinc-400">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
};

export default AboutSection;