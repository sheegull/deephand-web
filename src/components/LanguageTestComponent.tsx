import React from 'react';
import { t, getCurrentLanguage, onLanguageChange } from '../lib/i18n';

export const LanguageTestComponent: React.FC = () => {
  // 言語変更に反応するための再レンダリングstate
  const [, forceUpdate] = React.useState({});
  const [renderCount, setRenderCount] = React.useState(0);
  
  React.useEffect(() => {
    // 言語変更時の再レンダリング登録
    const unsubscribe = onLanguageChange(() => {
      console.log('Language changed, re-rendering LanguageTestComponent');
      forceUpdate({}); // 強制的に再レンダリング
      setRenderCount(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    console.log('LanguageTestComponent rendered, current language:', getCurrentLanguage());
  });

  return (
    <div className="p-6 bg-[#2a2a2a] rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-white">言語切替テストコンポーネント</h2>
      
      <div className="space-y-2">
        <p className="text-gray-300">
          <strong>現在の言語:</strong> {getCurrentLanguage()}
        </p>
        <p className="text-gray-300">
          <strong>再レンダリング回数:</strong> {renderCount}
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">翻訳テスト:</h3>
        <p className="text-blue-300">
          <strong>solutions.title:</strong> {t('solutions.title')}
        </p>
        <p className="text-blue-300">
          <strong>solutions.description:</strong> {t('solutions.description')}
        </p>
        <p className="text-green-300">
          <strong>about.title:</strong> {t('about.title')}
        </p>
        <p className="text-green-300">
          <strong>pricing.title:</strong> {t('pricing.title')}
        </p>
      </div>
      
      <div className="text-xs text-gray-500">
        このコンポーネントは言語切替に反応してリアルタイムで更新されます。
        ヘッダーの言語切替ボタンをクリックして確認してください。
      </div>
    </div>
  );
};