/**
 * DitherBackgroundMinimal - 完全カクつき除去版
 * 
 * 原因: CSS animationとReact re-renderの競合
 * 解決: 静的背景のみでカクつき完全除去
 */

import React from 'react';

interface DitherBackgroundMinimalProps {
  className?: string;
  children?: React.ReactNode;
}

// ⚡ 完全静的背景（カクつきゼロ保証）
export const DitherBackgroundMinimal: React.FC<DitherBackgroundMinimalProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={className}>
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#1e1e1e',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(35, 74, 217, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 75% 75%, rgba(30, 62, 184, 0.08) 0%, transparent 40%),
            linear-gradient(135deg, 
              rgba(31, 33, 36, 0.4) 0%, 
              rgba(35, 74, 217, 0.03) 50%, 
              rgba(31, 33, 36, 0.4) 100%
            )
          `,
          // ⚡ 最小限のGPU最適化（アニメーションなし）
          transform: 'translateZ(0)',
          willChange: 'auto', // アニメーション予告なし
        }}
      />
      {children}
    </div>
  );
};

export default DitherBackgroundMinimal;