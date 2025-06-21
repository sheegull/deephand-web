// Import JSON translation files
import jaTranslations from '../i18n/locales/ja.json';
import enTranslations from '../i18n/locales/en.json';

// i18n実装
export const translations = {
  en: enTranslations,
  ja: jaTranslations
};

// 🚀 Step 2: ブラウザ言語検出機能
export const detectBrowserLanguage = (): 'ja' | 'en' => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.languages?.[0];
  
  // 日本語検出パターン（ja, ja-JP等）
  if (browserLang?.startsWith('ja')) return 'ja';
  
  // その他はすべて英語にフォールバック
  return 'en';
};

// 🚀 Step 2: 地域検出による自動リダイレクト機能
const performAutoRedirect = (detectedLanguage: 'ja' | 'en', currentPath: string): void => {
  if (typeof window === 'undefined') return;
  
  // リダイレクト条件チェック
  const shouldRedirect = checkRedirectConditions(detectedLanguage, currentPath);
  
  if (shouldRedirect.redirect) {
    console.log(`🌐 Auto-redirecting: ${detectedLanguage} browser detected, redirecting to ${shouldRedirect.targetUrl}`);
    
    // リダイレクト記録
    try {
      sessionStorage.setItem('deephand-last-redirect', Date.now().toString());
    } catch (error) {
      console.warn('Failed to record redirect timestamp:', error);
    }
    
    // 少し遅延させて自然なリダイレクトを実現
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = shouldRedirect.targetUrl;
      }
    }, 100);
  }
};

// 🚀 Step 2: リダイレクト条件判定
const checkRedirectConditions = (detectedLanguage: 'ja' | 'en', currentPath: string): { redirect: boolean; targetUrl: string } => {
  // 0. リダイレクト抑制フラグをチェック
  if (shouldSuppressRedirect()) {
    return { redirect: false, targetUrl: currentPath };
  }
  
  // 1. 既に適切な言語パスにいる場合はリダイレクト不要
  if (detectedLanguage === 'ja' && currentPath.startsWith('/ja')) {
    return { redirect: false, targetUrl: currentPath };
  }
  if (detectedLanguage === 'en' && !currentPath.startsWith('/ja')) {
    return { redirect: false, targetUrl: currentPath };
  }
  
  // 2. 日本語ブラウザだがルートパスにいる場合 → /ja へリダイレクト
  if (detectedLanguage === 'ja' && !currentPath.startsWith('/ja')) {
    const targetUrl = currentPath === '/' ? '/ja' : `/ja${currentPath}`;
    return { redirect: true, targetUrl };
  }
  
  // 3. 英語ブラウザだが /ja パスにいる場合 → ルートへリダイレクト
  if (detectedLanguage === 'en' && currentPath.startsWith('/ja')) {
    const cleanPath = currentPath.slice(3) || '/';
    return { redirect: true, targetUrl: cleanPath };
  }
  
  // 4. その他の場合はリダイレクト不要
  return { redirect: false, targetUrl: currentPath };
};

// 🚀 Step 2: リダイレクト抑制条件をチェック
const shouldSuppressRedirect = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // 1. 最近リダイレクトが発生した場合は抑制（無限ループ防止）
  const lastRedirect = sessionStorage.getItem('deephand-last-redirect');
  if (lastRedirect) {
    const lastTime = parseInt(lastRedirect);
    const now = Date.now();
    if (now - lastTime < 3000) { // 3秒以内のリダイレクトは抑制
      return true;
    }
  }
  
  // 2. ユーザーが手動で言語切り替えを行った場合は抑制
  const manualSwitch = sessionStorage.getItem('deephand-manual-switch');
  if (manualSwitch === 'true') {
    return true;
  }
  
  return false;
};

// Language state management with localStorage persistence
let currentLanguage: 'ja' | 'en' = 'en'; // 🚀 Step 1: デフォルトを英語に変更
let languageChangeCallbacks: (() => void)[] = [];

// 🚀 Step 2: 新しい優先順位による言語判定ロジック
// 優先順位: URL > localStorage > ブラウザ言語 > デフォルト(EN)
if (typeof window !== 'undefined') {
  const path = window.location.pathname;
  
  // 1. URL優先 - 明示的な言語指定
  if (path.startsWith('/ja')) {
    currentLanguage = 'ja';
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('deephand-language', 'ja'); // 🚀 Step 4: 統一キー使用
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  } else if (path.startsWith('/en')) {
    currentLanguage = 'en';
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('deephand-language', 'en');
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  } else {
    // 2. localStorage確認 - ユーザーの過去の選択
    let storedLang = null;
    if (typeof localStorage !== 'undefined') {
      storedLang = localStorage.getItem('deephand-language') || 
                   localStorage.getItem('preferred-language') || // 🚀 後方互換性
                   localStorage.getItem('language'); // 🚀 古いキー対応
    }
    
    if (storedLang === 'ja' || storedLang === 'en') {
      currentLanguage = storedLang;
      // 新しいキーに移行
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('deephand-language', storedLang);
        } catch (error) {
          console.warn('Failed to migrate language preference:', error);
        }
      }
    } else {
      // 3. ブラウザ言語検出
      currentLanguage = detectBrowserLanguage();
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('deephand-language', currentLanguage);
        } catch (error) {
          console.warn('Failed to save detected language:', error);
        }
      }
      
      // 🚀 Step 2: 地域検出による自動リダイレクト
      performAutoRedirect(currentLanguage, path);
    }
  }
} else {
  // 🚀 SSR環境: URLパスから言語を判定
  if (typeof globalThis !== 'undefined' && globalThis.location?.pathname) {
    if (globalThis.location.pathname.startsWith('/ja')) {
      currentLanguage = 'ja';
    } else {
      currentLanguage = 'en';
    }
  } else {
    // 🚀 SSR環境ではブラウザ言語検出不可、デフォルトは英語
    currentLanguage = 'en';
  }
}

export const getCurrentLanguage = () => currentLanguage;

export const setCurrentLanguage = (lang: 'ja' | 'en') => {
  const previousLanguage = currentLanguage;
  currentLanguage = lang;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem('deephand-language', lang); // 🚀 Step 2: 統一キー使用
      // 🚀 古いキーのクリーンアップ（段階的移行）
      localStorage.removeItem('language');
      localStorage.removeItem('preferred-language');
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }
  
  // 言語が変更された場合のみコールバックを実行
  if (previousLanguage !== lang) {
    languageChangeCallbacks.forEach(callback => callback());
  }
};

// コンポーネントの再レンダリング用コールバック登録
export const onLanguageChange = (callback: () => void) => {
  languageChangeCallbacks.push(callback);
  return () => {
    languageChangeCallbacks = languageChangeCallbacks.filter(cb => cb !== callback);
  };
};

// 🚀 Step 1: ページパスを新しい言語構造に対応したパスに変換
export const getLocalizedPath = (lang: 'ja' | 'en', currentPath?: string) => {
  if (typeof window === 'undefined' && !currentPath) {
    return lang === 'ja' ? '/ja' : '/'; // 🚀 英語がデフォルト、日本語は/jaプレフィックス
  }
  
  const path = currentPath || window.location.pathname;
  
  // 🚀 現在のパスから言語プレフィックスを除去
  let cleanPath = path;
  if (path.startsWith('/ja')) {
    cleanPath = path.slice(3); // /ja を除去
  } else if (path.startsWith('/en')) {
    cleanPath = path.slice(3); // /en を除去  
  }
  
  // 🚀 空文字列とルートパスの正規化
  const normalizedPath = cleanPath === '' ? '/' : cleanPath;
  
  // 🚀 新しい言語構造でのパスを構築
  if (lang === 'ja') {
    // 日本語は /ja プレフィックス
    return normalizedPath === '/' ? '/ja' : `/ja${normalizedPath}`;
  } else {
    // 英語はルート（プレフィックスなし）
    return normalizedPath === '/' ? '/' : normalizedPath;
  }
};

// 🚀 Step 3: URL変換関数（リロードなし用）
export const updatePathLanguage = (currentPath: string, newLang: 'ja' | 'en'): string => {
  // 現在のパスから言語プレフィックスを除去
  let cleanPath = currentPath;
  if (currentPath.startsWith('/ja')) {
    cleanPath = currentPath.slice(3);
  } else if (currentPath.startsWith('/en')) {
    cleanPath = currentPath.slice(3);
  }
  
  // 空文字列はルートパスに正規化
  if (cleanPath === '') cleanPath = '/';
  
  // 新しい言語でのパスを構築
  if (newLang === 'ja') {
    return cleanPath === '/' ? '/ja' : `/ja${cleanPath}`;
  } else {
    return cleanPath === '/' ? '/' : cleanPath;
  }
};

// 🚀 Step 3: リロードなし言語切り替え関数
export const switchLanguageWithoutReload = async (lang: 'ja' | 'en'): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  // 🚀 入力値検証
  if (lang !== 'ja' && lang !== 'en') {
    throw new Error(`Invalid language code: ${lang}. Must be 'ja' or 'en'.`);
  }
  
  const startTime = performance.now();
  
  try {
    // 1. 現在の言語と同じ場合は何もしない
    if (currentLanguage === lang) return;
    
    // 🚀 Step 2: 手動言語切り替えフラグを設定（自動リダイレクト抑制用）
    try {
      sessionStorage.setItem('deephand-manual-switch', 'true');
    } catch (error) {
      console.warn('Failed to set manual switch flag:', error);
    }
    
    // 2. URL更新（リロードなし）- History API存在確認
    const newPath = updatePathLanguage(window.location.pathname, lang);
    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', newPath);
    } else {
      // History API未対応の場合はフォールバック
      throw new Error('History API not supported');
    }
    
    // 3. 言語状態更新
    setCurrentLanguage(lang);
    
    // 4. パフォーマンス測定
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 200) {
      console.warn(`Language switch took ${duration}ms (target: <200ms)`);
    }
    
  } catch (error) {
    console.error('Language switch failed:', error);
    // フォールバック: 完全リロード
    const newPath = getLocalizedPath(lang);
    if (window.location) {
      window.location.href = newPath;
    }
    throw error; // 🚀 テスト用にエラーを再スロー
  }
};

// 🚀 Step 3: 翻訳キャッシュとパフォーマンス測定
const translationCache = new Map<string, { data: any; loadTime: number; }>();

// 🚀 Step 3: 翻訳データ読み込み（パフォーマンス最適化版）
export const loadTranslations = async (lang: 'ja' | 'en'): Promise<void> => {
  const startTime = performance.now();
  
  // キャッシュ確認
  if (translationCache.has(lang)) {
    const cached = translationCache.get(lang)!;
    const endTime = performance.now();
    console.debug(`Loaded ${lang} translations from cache in ${endTime - startTime}ms`);
    return Promise.resolve();
  }
  
  // 現在の実装では翻訳は静的にインポート済み
  if (translations[lang]) {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // キャッシュに保存
    translationCache.set(lang, {
      data: translations[lang],
      loadTime
    });
    
    console.debug(`Loaded ${lang} translations in ${loadTime}ms`);
    return Promise.resolve();
  }
  
  throw new Error(`Translations for ${lang} not found`);
};

// 🚀 従来の完全リロード版（後方互換性）
export const switchLanguageInstantly = (lang: 'ja' | 'en') => {
  setCurrentLanguage(lang);
  // URLを更新（適切な言語ページに遷移）
  if (typeof window !== 'undefined') {
    const newPath = getLocalizedPath(lang);
    window.location.href = newPath; // pushStateではなくhrefで完全な遷移
  }
};

export const t = (key: string, interpolations?: Record<string, any>) => {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  let result = value !== undefined ? value : key;
  
  // Handle interpolations like {{field}}
  if (interpolations && typeof result === 'string') {
    Object.entries(interpolations).forEach(([key, val]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), val);
    });
  }
  
  return result;
};

// 🚀 Footer用の統一されたURL生成関数
export const getFooterUrls = () => {
  const lang = getCurrentLanguage();
  return {
    terms: getLocalizedPath(lang, '/terms'),
    privacy: getLocalizedPath(lang, '/privacy'),
  };
};

// 🚀 ページ遷移時の手動フラグ設定
export const setManualNavigationFlag = () => {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('deephand-manual-switch', 'true');
    } catch (error) {
      console.warn('Failed to set manual navigation flag:', error);
    }
  }
};