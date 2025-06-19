import React from 'react';
import { MotionDiv, optimizedTransition, useInView } from './ui/motion-optimized';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { t, getCurrentLanguage } from '../lib/i18n';
import { GlobalHeader } from './GlobalHeader';

interface SolutionsPageProps {
  className?: string;
}

export const SolutionsPage = ({ className = '' }: SolutionsPageProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      key: 'imageAnnotation',
    },
    {
      key: 'videoAnnotation',
    },
    {
      key: '3dAnnotation',
    },
    {
      key: 'roboticsData',
    },
  ];

  return (
    <>
      {/* <GlobalHeader /> */}
      <div
        className={`flex flex-col w-full bg-[#1e1e1e] min-h-screen pt-32 pb-20 px-4 md:px-8 lg:px-20 ${className}`}
      >
        {/* ヘッダーセクション */}
        <MotionDiv
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="font-alliance font-normal text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            {t('solutions.title')}
          </h1>
          {t('solutions.subtitle') && (
            <p className="font-alliance font-light text-zinc-400 text-lg md:text-xl leading-relaxed mb-4">
              {t('solutions.subtitle')}
            </p>
          )}
          <p className="font-alliance font-light text-zinc-500 text-base md:text-lg leading-relaxed">
            {t('solutions.description')}
          </p>
        </MotionDiv>

        {/* サービスグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
              <Card className="h-full !bg-[#1A1A1A]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md hover:border-gray-600/50 transition-all duration-300 hover:shadow-[0px_0px_80px_#0000009d] hover:scale-[1.02] cursor-pointer">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="font-alliance font-normal text-white text-xl md:text-2xl leading-tight mb-4">
                    {t(`solutions.services.${service.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <CardDescription className="font-alliance font-light text-zinc-400 text-base leading-relaxed">
                    {t(`solutions.services.${service.key}.description`)}
                  </CardDescription>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </div>

        {/* CTA セクション */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-center mt-20 max-w-2xl mx-auto"
        >
          <Card className="!bg-gradient-to-br from-[#1A1A1A]/95 to-[#0F0F0F]/95 rounded-2xl shadow-[0px_0px_60px_#0000007d] border border-gray-700/30 backdrop-blur-md pt-14">
            <CardContent className="px-8 py-8">
              <h3 className="font-alliance font-normal text-white text-2xl md:text-3xl leading-tight mb-6">
                {t('solutions.cta.title')}
              </h3>
              <p className="font-alliance font-light text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                {t('solutions.cta.description')}
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
                      const currentLanguage = getCurrentLanguage();
                      const requestUrl = currentLanguage === 'en' ? '/en/request' : '/request';
                      window.location.href = requestUrl;
                    }
                  }}
                >
                  {t('solutions.cta.button')}
                </button>
              </MotionDiv>
            </CardContent>
          </Card>
        </MotionDiv>
      </div>
    </>
  );
};
