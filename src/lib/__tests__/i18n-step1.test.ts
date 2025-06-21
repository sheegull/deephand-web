/**
 * Step 1 TDD Tests: デフォルト言語をENに変更
 * 
 * 要件:
 * - 初回アクセス時のデフォルト言語が英語(en)であること
 * - URLパスがない場合(/)は英語コンテンツを表示
 * - 日本語は明示的に/jaパスでアクセス
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// 基本的なタイマー関数のモック
vi.stubGlobal('setTimeout', (callback: () => void, ms: number) => {
  return setTimeout(callback, ms);
});
vi.stubGlobal('clearTimeout', (id: any) => {
  return clearTimeout(id);
});

// テスト対象の関数をモック前にインポート
let getCurrentLanguage: () => 'ja' | 'en';
let setCurrentLanguage: (lang: 'ja' | 'en') => void;
let getLocalizedPath: (lang: 'ja' | 'en', currentPath?: string) => string;

describe('Step 1: デフォルト言語EN変更 (TDD)', () => {
  beforeEach(() => {
    // localStorageのモック
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);
    
    // windowのモック
    const windowMock = {
      location: {
        pathname: '/',
        href: 'http://localhost:3000/',
      },
    };
    vi.stubGlobal('window', windowMock);
    
    // モジュールをリセットして再インポート
    vi.resetModules();
  });
  
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  describe('デフォルト言語の変更', () => {
    it('should return "en" as default language when no URL path is specified', async () => {
      // URLパスがルート(/)の場合
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      // i18nモジュールを動的にインポートして初期化
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: 英語がデフォルト (現在は日本語がデフォルト)
      expect(getCurrentLanguage()).toBe('en');
    });
    
    it('should return "en" for root path "/"', async () => {
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: ルートパスは英語 (現在は日本語)
      expect(getCurrentLanguage()).toBe('en');
    });
    
    it('should return "ja" for explicit Japanese path "/ja"', async () => {
      vi.stubGlobal('window', {
        location: { pathname: '/ja' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: /jaパスで日本語 (現在は/jaパス未対応)
      expect(getCurrentLanguage()).toBe('ja');
    });
    
    it('should return "ja" for Japanese subpages "/ja/about"', async () => {
      vi.stubGlobal('window', {
        location: { pathname: '/ja/about' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: /ja/aboutパスで日本語 (現在は/jaパス未対応)
      expect(getCurrentLanguage()).toBe('ja');
    });
    
    it('should return "en" for English path "/en"', async () => {
      vi.stubGlobal('window', {
        location: { pathname: '/en' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ✅ 期待値: /enパスで英語 (現在も対応済み)
      expect(getCurrentLanguage()).toBe('en');
    });
    
    it('should return "en" for English subpages "/en/about"', async () => {
      vi.stubGlobal('window', {
        location: { pathname: '/en/about' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ✅ 期待値: /en/aboutパスで英語 (現在も対応済み)
      expect(getCurrentLanguage()).toBe('en');
    });
  });

  describe('パス生成の変更', () => {
    it('should generate correct localized paths for new language structure', async () => {
      const i18nModule = await import('../i18n');
      getLocalizedPath = i18nModule.getLocalizedPath;
      
      // ❌ 期待値: 英語がデフォルトなので日本語は/jaプレフィックス必要
      expect(getLocalizedPath('en', '/')).toBe('/');  // 英語はルート
      expect(getLocalizedPath('ja', '/')).toBe('/ja'); // 日本語は/jaプレフィックス
      
      expect(getLocalizedPath('en', '/about')).toBe('/about');    // 英語サブページ
      expect(getLocalizedPath('ja', '/about')).toBe('/ja/about'); // 日本語サブページ
    });
    
    it('should handle path conversion between languages correctly', async () => {
      const i18nModule = await import('../i18n');
      getLocalizedPath = i18nModule.getLocalizedPath;
      
      // ❌ 期待値: 言語間の正しいパス変換
      expect(getLocalizedPath('ja', '/en/about')).toBe('/ja/about'); // EN→JA
      expect(getLocalizedPath('en', '/ja/about')).toBe('/about');    // JA→EN
      
      expect(getLocalizedPath('ja', '/en')).toBe('/ja'); // EN root→JA root
      expect(getLocalizedPath('en', '/ja')).toBe('/');   // JA root→EN root
    });
  });

  describe('localStorage統合', () => {
    it('should save correct default language to localStorage', async () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      await import('../i18n');
      
      // ❌ 期待値: デフォルト言語として英語を保存 (現在は日本語を保存)
      expect(setItemSpy).toHaveBeenCalledWith('language', 'en');
    });
    
    it('should save Japanese when explicitly accessing /ja path', async () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      
      vi.stubGlobal('window', {
        location: { pathname: '/ja' }
      });
      
      await import('../i18n');
      
      // ❌ 期待値: /jaパスで日本語を保存 (現在は/jaパス未対応)
      expect(setItemSpy).toHaveBeenCalledWith('language', 'ja');
    });
  });

  describe('SSR対応', () => {
    it('should return "en" as default in SSR environment', async () => {
      // SSR環境をシミュレート (window undefined)
      vi.stubGlobal('window', undefined);
      vi.stubGlobal('globalThis', {});
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: SSR環境でも英語がデフォルト (現在は日本語)
      expect(getCurrentLanguage()).toBe('en');
    });
    
    it('should detect Japanese from SSR path "/ja"', async () => {
      vi.stubGlobal('window', undefined);
      vi.stubGlobal('globalThis', {
        location: { pathname: '/ja' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: SSR環境で/jaパスを正しく検出 (現在は/jaパス未対応)
      expect(getCurrentLanguage()).toBe('ja');
    });
  });
});

/**
 * 予想されるテスト結果:
 * ❌ 8/10 tests failing
 * ✅ 2/10 tests passing (/en関連のみ)
 * 
 * 失敗予想箇所:
 * 1. デフォルト言語が日本語 → 英語に変更必要
 * 2. /jaパス未対応 → /jaパス対応実装必要  
 * 3. パス生成ロジック → 英語デフォルト用に修正必要
 * 4. localStorage保存値 → 英語デフォルト対応必要
 * 5. SSRデフォルト言語 → 英語に変更必要
 */