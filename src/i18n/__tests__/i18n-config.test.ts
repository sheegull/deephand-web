// TDD Red Step: i18n configuration tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createI18nConfig,
  initializeI18n,
  getLanguageFromUrl,
  generateLanguageRoutes,
  validateLanguageContent,
  switchLanguage,
  getCurrentLanguage,
  type SupportedLanguage,
  type I18nConfig,
  type LanguageContent,
} from '../i18n-config';

describe('i18n Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/ja/',
        href: 'https://deephand.ai/ja/',
        search: '',
        hash: '',
      },
      writable: true,
    });
  });

  describe('Language Detection', () => {
    it('should detect Japanese from URL path', () => {
      window.location.pathname = '/ja/about';

      const language = getLanguageFromUrl();

      expect(language).toBe('ja');
    });

    it('should detect English from URL path', () => {
      window.location.pathname = '/en/services';

      const language = getLanguageFromUrl();

      expect(language).toBe('en');
    });

    it('should default to Japanese for root path', () => {
      window.location.pathname = '/';

      const language = getLanguageFromUrl();

      expect(language).toBe('ja');
    });

    it('should default to Japanese for invalid language', () => {
      window.location.pathname = '/fr/page';

      const language = getLanguageFromUrl();

      expect(language).toBe('ja');
    });

    it('should handle paths without language prefix', () => {
      window.location.pathname = '/about';

      const language = getLanguageFromUrl();

      expect(language).toBe('ja'); // Default to Japanese
    });
  });

  describe('i18n Configuration Creation', () => {
    it('should create complete i18n configuration', () => {
      const config = createI18nConfig();

      expect(config).toHaveProperty('supportedLanguages');
      expect(config).toHaveProperty('defaultLanguage');
      expect(config).toHaveProperty('resources');
      expect(config).toHaveProperty('urlStructure');
      expect(config.supportedLanguages).toContain('ja');
      expect(config.supportedLanguages).toContain('en');
      expect(config.defaultLanguage).toBe('ja');
    });

    it('should include all required resource namespaces', () => {
      const config = createI18nConfig();

      expect(config.resources.ja).toHaveProperty('common');
      expect(config.resources.ja).toHaveProperty('pages');
      expect(config.resources.ja).toHaveProperty('services');
      expect(config.resources.en).toHaveProperty('common');
      expect(config.resources.en).toHaveProperty('pages');
      expect(config.resources.en).toHaveProperty('services');
    });

    it('should configure URL structure correctly', () => {
      const config = createI18nConfig();

      expect(config.urlStructure.usePrefix).toBe(true);
      expect(config.urlStructure.prefixDefault).toBe(false); // Japanese default, no prefix
      expect(config.urlStructure.pattern).toBe('/:lang/');
    });

    it('should set up fallback configuration', () => {
      const config = createI18nConfig();

      expect(config.fallbackLanguage).toBe('ja');
      expect(config.interpolation).toHaveProperty('escapeValue');
      expect(config.detection).toHaveProperty('order');
    });
  });

  describe('Language Route Generation', () => {
    it('should generate routes for all supported languages', () => {
      const routes = generateLanguageRoutes();

      expect(routes).toHaveProperty('ja');
      expect(routes).toHaveProperty('en');
      expect(Array.isArray(routes.ja)).toBe(true);
      expect(Array.isArray(routes.en)).toBe(true);
    });

    it('should include all main pages in routes', () => {
      const routes = generateLanguageRoutes();

      const expectedPages = ['/', '/about', '/services', '/contact', '/data-request'];

      expectedPages.forEach(page => {
        expect(routes.ja.some(route => route.path === page)).toBe(true);
        expect(routes.en.some(route => route.path === page)).toBe(true);
      });
    });

    it('should provide correct URL patterns for each language', () => {
      const routes = generateLanguageRoutes();

      expect(routes.ja.find(r => r.path === '/')?.url).toBe('/');
      expect(routes.en.find(r => r.path === '/')?.url).toBe('/en/');
      expect(routes.ja.find(r => r.path === '/about')?.url).toBe('/about');
      expect(routes.en.find(r => r.path === '/about')?.url).toBe('/en/about');
    });

    it('should include SEO metadata for each route', () => {
      const routes = generateLanguageRoutes();

      routes.ja.forEach(route => {
        expect(route).toHaveProperty('title');
        expect(route).toHaveProperty('description');
        expect(route).toHaveProperty('keywords');
      });

      routes.en.forEach(route => {
        expect(route).toHaveProperty('title');
        expect(route).toHaveProperty('description');
        expect(route).toHaveProperty('keywords');
      });
    });
  });

  describe('Language Content Validation', () => {
    it('should validate complete language content', () => {
      const validContent: LanguageContent = {
        common: {
          navigation: { home: 'ホーム', about: '私たちについて' },
          buttons: { submit: '送信', cancel: 'キャンセル' },
          forms: { email: 'メールアドレス', name: '名前' },
        },
        pages: {
          home: { title: 'ホーム', description: '説明' },
          about: { title: '私たちについて', description: '説明' },
        },
        services: {
          consulting: { title: 'コンサルティング', description: '説明' },
        },
      };

      const result = validateLanguageContent(validContent, 'ja');

      expect(result.isValid).toBe(true);
      expect(result.missingKeys).toHaveLength(0);
    });

    it('should detect missing required keys', () => {
      const incompleteContent: LanguageContent = {
        common: {
          navigation: { home: 'ホーム' }, // Missing 'about'
          buttons: { submit: '送信' }, // Missing 'cancel'
          forms: {}, // Missing all keys
        },
        pages: {},
        services: {},
      };

      const result = validateLanguageContent(incompleteContent, 'ja');

      expect(result.isValid).toBe(false);
      expect(result.missingKeys.length).toBeGreaterThan(0);
      expect(result.missingKeys).toContain('common.navigation.about');
      expect(result.missingKeys).toContain('common.buttons.cancel');
    });

    it('should validate English content structure', () => {
      const englishContent: LanguageContent = {
        common: {
          navigation: { home: 'Home', about: 'About Us' },
          buttons: { submit: 'Submit', cancel: 'Cancel' },
          forms: { email: 'Email Address', name: 'Name' },
        },
        pages: {
          home: { title: 'Home', description: 'Description' },
          about: { title: 'About Us', description: 'Description' },
        },
        services: {
          consulting: { title: 'Consulting', description: 'Description' },
        },
      };

      const result = validateLanguageContent(englishContent, 'en');

      expect(result.isValid).toBe(true);
      expect(result.missingKeys).toHaveLength(0);
    });
  });

  describe('Language Switching', () => {
    it('should switch language and update URL', () => {
      window.location.pathname = '/ja/about';
      const mockPushState = vi.fn();
      Object.defineProperty(window.history, 'pushState', {
        value: mockPushState,
        writable: true,
      });

      switchLanguage('en');

      expect(mockPushState).toHaveBeenCalledWith(null, '', '/en/about');
    });

    it('should handle root path language switching', () => {
      window.location.pathname = '/';
      const mockPushState = vi.fn();
      Object.defineProperty(window.history, 'pushState', {
        value: mockPushState,
        writable: true,
      });

      switchLanguage('en');

      expect(mockPushState).toHaveBeenCalledWith(null, '', '/en/');
    });

    it('should switch from English to Japanese', () => {
      window.location.pathname = '/en/services';
      const mockPushState = vi.fn();
      Object.defineProperty(window.history, 'pushState', {
        value: mockPushState,
        writable: true,
      });

      switchLanguage('ja');

      expect(mockPushState).toHaveBeenCalledWith(null, '', '/services');
    });

    it('should preserve query parameters and hash', () => {
      window.location.pathname = '/ja/about';
      window.location.search = '?param=value';
      window.location.hash = '#section';
      const mockPushState = vi.fn();
      Object.defineProperty(window.history, 'pushState', {
        value: mockPushState,
        writable: true,
      });

      switchLanguage('en');

      expect(mockPushState).toHaveBeenCalledWith(null, '', '/en/about?param=value#section');
    });
  });

  describe('Current Language Detection', () => {
    it('should get current language from URL', () => {
      window.location.pathname = '/en/about';

      const currentLang = getCurrentLanguage();

      expect(currentLang).toBe('en');
    });

    it('should return default language for root', () => {
      window.location.pathname = '/';

      const currentLang = getCurrentLanguage();

      expect(currentLang).toBe('ja');
    });
  });

  describe('i18n Initialization', () => {
    it('should initialize i18n with correct configuration', async () => {
      const config = createI18nConfig();

      const i18nInstance = await initializeI18n(config);

      expect(i18nInstance).toBeDefined();
      expect(typeof i18nInstance.t).toBe('function');
      expect(typeof i18nInstance.changeLanguage).toBe('function');
    });

    it('should set initial language based on URL', async () => {
      window.location.pathname = '/en/about';
      const config = createI18nConfig();

      const i18nInstance = await initializeI18n(config);

      expect(i18nInstance.language).toBe('en');
    });

    it('should handle initialization errors gracefully', async () => {
      const invalidConfig = {} as I18nConfig;

      await expect(initializeI18n(invalidConfig)).rejects.toThrow();
    });
  });
});
