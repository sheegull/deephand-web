/**
 * Step 2 TDD Tests: ブラウザ言語自動検出機能
 * 
 * 要件:
 * - navigator.languageを使用してブラウザの言語設定を検出
 * - 判定優先順位: URL > localStorage > ブラウザ言語 > デフォルト(EN)
 * - 日本語(ja-JP, ja)の検出とフォールバック機能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// テスト対象の関数
let getCurrentLanguage: () => 'ja' | 'en';
let detectBrowserLanguage: () => 'ja' | 'en';

describe('Step 2: ブラウザ言語自動検出 (TDD)', () => {
  beforeEach(() => {
    // localStorageのモック
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', localStorageMock);
    
    // navigatorのモック
    const navigatorMock = {
      language: 'en-US',
      languages: ['en-US', 'en'],
    };
    vi.stubGlobal('navigator', navigatorMock);
    
    // windowのモック
    const windowMock = {
      location: {
        pathname: '/',
        href: 'http://localhost:3000/',
      },
    };
    vi.stubGlobal('window', windowMock);
    
    // モジュールをリセット
    vi.resetModules();
  });
  
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  describe('ブラウザ言語検出機能', () => {
    it('should detect Japanese from navigator.language "ja"', async () => {
      vi.stubGlobal('navigator', {
        language: 'ja',
        languages: ['ja']
      });
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: "ja"を検出 (detectBrowserLanguage関数が未実装)
      expect(detectBrowserLanguage()).toBe('ja');
    });
    
    it('should detect Japanese from navigator.language "ja-JP"', async () => {
      vi.stubGlobal('navigator', {
        language: 'ja-JP',
        languages: ['ja-JP', 'ja', 'en']
      });
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: "ja-JP"から"ja"を検出
      expect(detectBrowserLanguage()).toBe('ja');
    });
    
    it('should fallback to English for unsupported languages', async () => {
      vi.stubGlobal('navigator', {
        language: 'zh-CN',
        languages: ['zh-CN', 'zh']
      });
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: 中国語は英語にフォールバック
      expect(detectBrowserLanguage()).toBe('en');
    });
    
    it('should fallback to English when navigator is undefined', async () => {
      vi.stubGlobal('navigator', undefined);
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: navigatorが未定義の場合は英語
      expect(detectBrowserLanguage()).toBe('en');
    });
    
    it('should handle navigator.languages array fallback', async () => {
      vi.stubGlobal('navigator', {
        language: undefined,
        languages: ['ja-JP', 'ja', 'en-US']
      });
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: navigator.languagesの最初の要素から日本語を検出
      expect(detectBrowserLanguage()).toBe('ja');
    });
  });

  describe('統合された言語判定（優先順位）', () => {
    it('should prioritize URL over browser language', async () => {
      vi.stubGlobal('navigator', {
        language: 'ja-JP',
        languages: ['ja-JP']
      });
      vi.stubGlobal('window', {
        location: { pathname: '/en/about' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ✅ URL優先で英語が選択される（現在も対応済み）
      expect(getCurrentLanguage()).toBe('en');
    });
    
    it('should use localStorage over browser language', async () => {
      const getItemSpy = vi.fn().mockReturnValue('en');
      vi.stubGlobal('localStorage', {
        getItem: getItemSpy,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
      
      vi.stubGlobal('navigator', {
        language: 'ja-JP',
        languages: ['ja-JP']
      });
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: localStorage優先で英語（現在は実装未完了）
      expect(getCurrentLanguage()).toBe('en');
      expect(getItemSpy).toHaveBeenCalledWith('deephand-language');
    });
    
    it('should use browser language when no URL or localStorage', async () => {
      const getItemSpy = vi.fn().mockReturnValue(null);
      vi.stubGlobal('localStorage', {
        getItem: getItemSpy,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
      
      vi.stubGlobal('navigator', {
        language: 'ja-JP',
        languages: ['ja-JP']
      });
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ❌ 期待値: ブラウザ言語検出で日本語（現在は実装未完了）
      expect(getCurrentLanguage()).toBe('ja');
    });
    
    it('should fallback to English default when no detection possible', async () => {
      const getItemSpy = vi.fn().mockReturnValue(null);
      vi.stubGlobal('localStorage', {
        getItem: getItemSpy,
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
      
      vi.stubGlobal('navigator', undefined);
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      const i18nModule = await import('../i18n');
      getCurrentLanguage = i18nModule.getCurrentLanguage;
      
      // ✅ 期待値: 最終フォールバックで英語（Step 1で対応済み）
      expect(getCurrentLanguage()).toBe('en');
    });
  });

  describe('初回アクセス時の動作', () => {
    it('should auto-detect and save Japanese user preference', async () => {
      const setItemSpy = vi.fn();
      const getItemSpy = vi.fn().mockReturnValue(null);
      vi.stubGlobal('localStorage', {
        getItem: getItemSpy,
        setItem: setItemSpy,
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
      
      vi.stubGlobal('navigator', {
        language: 'ja-JP',
        languages: ['ja-JP']
      });
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      await import('../i18n');
      
      // ❌ 期待値: 日本語設定の自動保存（現在は実装未完了）
      expect(setItemSpy).toHaveBeenCalledWith('deephand-language', 'ja');
    });
    
    it('should auto-detect and save English user preference', async () => {
      const setItemSpy = vi.fn();
      const getItemSpy = vi.fn().mockReturnValue(null);
      vi.stubGlobal('localStorage', {
        getItem: getItemSpy,
        setItem: setItemSpy,
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
      
      vi.stubGlobal('navigator', {
        language: 'en-US',
        languages: ['en-US']
      });
      vi.stubGlobal('window', {
        location: { pathname: '/' }
      });
      
      await import('../i18n');
      
      // ❌ 期待値: 英語設定の自動保存（現在は実装未完了）
      expect(setItemSpy).toHaveBeenCalledWith('deephand-language', 'en');
    });
  });

  describe('特殊ケースの処理', () => {
    it('should handle empty navigator.languages array', async () => {
      vi.stubGlobal('navigator', {
        language: undefined,
        languages: []
      });
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: 空配列の場合は英語にフォールバック
      expect(detectBrowserLanguage()).toBe('en');
    });
    
    it('should handle malformed language codes', async () => {
      vi.stubGlobal('navigator', {
        language: 'invalid-code',
        languages: ['invalid-code']
      });
      
      const i18nModule = await import('../i18n');
      detectBrowserLanguage = i18nModule.detectBrowserLanguage;
      
      // ❌ 期待値: 無効な言語コードは英語にフォールバック
      expect(detectBrowserLanguage()).toBe('en');
    });
  });
});

/**
 * 予想されるテスト結果:
 * ❌ 8/11 tests failing  
 * ✅ 3/11 tests passing (URL優先・最終フォールバック等)
 * 
 * 失敗予想箇所:
 * 1. detectBrowserLanguage関数が未実装
 * 2. localStorage統合ロジックが未実装  
 * 3. ブラウザ言語検出の優先順位統合が未実装
 * 4. 自動保存機能が未実装
 * 5. エラーハンドリングが未実装
 */