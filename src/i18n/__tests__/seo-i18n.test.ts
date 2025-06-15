// TDD Red Step: SEO i18n implementation tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateHreflangTags,
  generateMultilingualSitemap,
  createI18nMetaTags,
  generateAlternateUrls,
  validateSEOStructure,
  createCanonicalUrls,
  generateOpenGraphTags,
  type HreflangTag,
  type SitemapEntry,
  type I18nMetaData,
  type SEOStructure,
} from '../seo-i18n';

describe('SEO i18n Implementation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/ja/',
        href: 'https://deephand.ai/ja/',
        host: 'deephand.ai',
        protocol: 'https:',
      },
      writable: true,
    });
  });

  describe('Hreflang Tags Generation', () => {
    it('should generate hreflang tags for all supported languages', () => {
      const currentPath = '/about';
      const baseUrl = 'https://deephand.ai';

      const hreflangTags = generateHreflangTags(currentPath, baseUrl);

      expect(hreflangTags).toHaveLength(3); // ja, en, x-default
      expect(hreflangTags.find(tag => tag.hreflang === 'ja')).toBeDefined();
      expect(hreflangTags.find(tag => tag.hreflang === 'en')).toBeDefined();
      expect(hreflangTags.find(tag => tag.hreflang === 'x-default')).toBeDefined();
    });

    it('should generate correct URLs for Japanese pages', () => {
      const currentPath = '/services';
      const baseUrl = 'https://deephand.ai';

      const hreflangTags = generateHreflangTags(currentPath, baseUrl);
      const jaTag = hreflangTags.find(tag => tag.hreflang === 'ja');

      expect(jaTag?.href).toBe('https://deephand.ai/services');
    });

    it('should generate correct URLs for English pages', () => {
      const currentPath = '/contact';
      const baseUrl = 'https://deephand.ai';

      const hreflangTags = generateHreflangTags(currentPath, baseUrl);
      const enTag = hreflangTags.find(tag => tag.hreflang === 'en');

      expect(enTag?.href).toBe('https://deephand.ai/en/contact');
    });

    it('should set x-default to Japanese (default language)', () => {
      const currentPath = '/';
      const baseUrl = 'https://deephand.ai';

      const hreflangTags = generateHreflangTags(currentPath, baseUrl);
      const defaultTag = hreflangTags.find(tag => tag.hreflang === 'x-default');

      expect(defaultTag?.href).toBe('https://deephand.ai/');
    });

    it('should handle root path correctly', () => {
      const currentPath = '/';
      const baseUrl = 'https://deephand.ai';

      const hreflangTags = generateHreflangTags(currentPath, baseUrl);

      expect(hreflangTags.find(tag => tag.hreflang === 'ja')?.href).toBe('https://deephand.ai/');
      expect(hreflangTags.find(tag => tag.hreflang === 'en')?.href).toBe('https://deephand.ai/en/');
    });
  });

  describe('Multilingual Sitemap Generation', () => {
    it('should generate sitemap for all pages and languages', () => {
      const baseUrl = 'https://deephand.ai';

      const sitemap = generateMultilingualSitemap(baseUrl);

      expect(Array.isArray(sitemap)).toBe(true);
      expect(sitemap.length).toBeGreaterThan(0);

      // Should have entries for both languages
      const jaEntries = sitemap.filter(
        entry => entry.url.includes('/ja/') || !entry.url.includes('/en/')
      );
      const enEntries = sitemap.filter(entry => entry.url.includes('/en/'));

      expect(jaEntries.length).toBeGreaterThan(0);
      expect(enEntries.length).toBeGreaterThan(0);
    });

    it('should include alternate language URLs for each page', () => {
      const baseUrl = 'https://deephand.ai';

      const sitemap = generateMultilingualSitemap(baseUrl);
      const homeEntry = sitemap.find(entry => entry.url === 'https://deephand.ai/');

      expect(homeEntry).toBeDefined();
      expect(homeEntry?.alternates).toBeDefined();
      expect(homeEntry?.alternates?.length).toBeGreaterThan(0);
    });

    it('should set correct priority for different pages', () => {
      const baseUrl = 'https://deephand.ai';

      const sitemap = generateMultilingualSitemap(baseUrl);
      const homeEntry = sitemap.find(entry => entry.url === 'https://deephand.ai/');
      const aboutEntry = sitemap.find(entry => entry.url.endsWith('/about'));

      expect(homeEntry?.priority).toBe(1.0); // Home page highest priority
      expect(aboutEntry?.priority).toBeLessThan(1.0);
    });

    it('should include lastmod dates', () => {
      const baseUrl = 'https://deephand.ai';

      const sitemap = generateMultilingualSitemap(baseUrl);

      sitemap.forEach(entry => {
        expect(entry.lastmod).toBeDefined();
        expect(typeof entry.lastmod).toBe('string');
        expect(new Date(entry.lastmod)).toBeInstanceOf(Date);
      });
    });

    it('should set appropriate changefreq for different page types', () => {
      const baseUrl = 'https://deephand.ai';

      const sitemap = generateMultilingualSitemap(baseUrl);
      const homeEntry = sitemap.find(entry => entry.url === 'https://deephand.ai/');

      expect(homeEntry?.changefreq).toBeDefined();
      expect(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).toContain(
        homeEntry?.changefreq
      );
    });
  });

  describe('I18n Meta Tags Creation', () => {
    it('should create complete meta tags for Japanese page', () => {
      const pageKey = 'home';
      const language = 'ja';
      const baseUrl = 'https://deephand.ai';

      const metaTags = createI18nMetaTags(pageKey, language, baseUrl);

      expect(metaTags.title).toBeDefined();
      expect(metaTags.description).toBeDefined();
      expect(metaTags.keywords).toBeDefined();
      expect(metaTags.lang).toBe('ja');
      expect(metaTags.hreflang).toBeDefined();
      expect(Array.isArray(metaTags.hreflang)).toBe(true);
    });

    it('should create complete meta tags for English page', () => {
      const pageKey = 'about';
      const language = 'en';
      const baseUrl = 'https://deephand.ai';

      const metaTags = createI18nMetaTags(pageKey, language, baseUrl);

      expect(metaTags.title).toBeDefined();
      expect(metaTags.description).toBeDefined();
      expect(metaTags.lang).toBe('en');
      expect(metaTags.canonical).toContain('/en/');
    });

    it('should include OpenGraph tags', () => {
      const pageKey = 'services';
      const language = 'ja';
      const baseUrl = 'https://deephand.ai';

      const metaTags = createI18nMetaTags(pageKey, language, baseUrl);

      expect(metaTags.openGraph).toBeDefined();
      expect(metaTags.openGraph.title).toBeDefined();
      expect(metaTags.openGraph.description).toBeDefined();
      expect(metaTags.openGraph.url).toBeDefined();
      expect(metaTags.openGraph.locale).toBeDefined();
    });

    it('should include Twitter Card tags', () => {
      const pageKey = 'contact';
      const language = 'en';
      const baseUrl = 'https://deephand.ai';

      const metaTags = createI18nMetaTags(pageKey, language, baseUrl);

      expect(metaTags.twitter).toBeDefined();
      expect(metaTags.twitter.card).toBe('summary_large_image');
      expect(metaTags.twitter.title).toBeDefined();
      expect(metaTags.twitter.description).toBeDefined();
    });
  });

  describe('Alternate URLs Generation', () => {
    it('should generate alternate URLs for all languages', () => {
      const currentPath = '/services';
      const baseUrl = 'https://deephand.ai';

      const alternates = generateAlternateUrls(currentPath, baseUrl);

      expect(alternates).toHaveProperty('ja');
      expect(alternates).toHaveProperty('en');
      expect(alternates.ja).toBe('https://deephand.ai/services');
      expect(alternates.en).toBe('https://deephand.ai/en/services');
    });

    it('should handle root path correctly', () => {
      const currentPath = '/';
      const baseUrl = 'https://deephand.ai';

      const alternates = generateAlternateUrls(currentPath, baseUrl);

      expect(alternates.ja).toBe('https://deephand.ai/');
      expect(alternates.en).toBe('https://deephand.ai/en/');
    });

    it('should handle paths with trailing slashes', () => {
      const currentPath = '/about/';
      const baseUrl = 'https://deephand.ai';

      const alternates = generateAlternateUrls(currentPath, baseUrl);

      expect(alternates.ja).toBe('https://deephand.ai/about/');
      expect(alternates.en).toBe('https://deephand.ai/en/about/');
    });
  });

  describe('Canonical URLs Creation', () => {
    it('should create correct canonical URL for Japanese page', () => {
      const currentPath = '/about';
      const language = 'ja';
      const baseUrl = 'https://deephand.ai';

      const canonical = createCanonicalUrls(currentPath, language, baseUrl);

      expect(canonical).toBe('https://deephand.ai/about');
    });

    it('should create correct canonical URL for English page', () => {
      const currentPath = '/services';
      const language = 'en';
      const baseUrl = 'https://deephand.ai';

      const canonical = createCanonicalUrls(currentPath, language, baseUrl);

      expect(canonical).toBe('https://deephand.ai/en/services');
    });

    it('should handle root path correctly', () => {
      const jaCanonical = createCanonicalUrls('/', 'ja', 'https://deephand.ai');
      const enCanonical = createCanonicalUrls('/', 'en', 'https://deephand.ai');

      expect(jaCanonical).toBe('https://deephand.ai/');
      expect(enCanonical).toBe('https://deephand.ai/en/');
    });
  });

  describe('OpenGraph Tags Generation', () => {
    it('should generate OpenGraph tags for Japanese content', () => {
      const pageKey = 'home';
      const language = 'ja';
      const baseUrl = 'https://deephand.ai';

      const ogTags = generateOpenGraphTags(pageKey, language, baseUrl);

      expect(ogTags.title).toBeDefined();
      expect(ogTags.description).toBeDefined();
      expect(ogTags.url).toBeDefined();
      expect(ogTags.locale).toBe('ja_JP');
      expect(ogTags.type).toBe('website');
    });

    it('should generate OpenGraph tags for English content', () => {
      const pageKey = 'about';
      const language = 'en';
      const baseUrl = 'https://deephand.ai';

      const ogTags = generateOpenGraphTags(pageKey, language, baseUrl);

      expect(ogTags.locale).toBe('en_US');
      expect(ogTags.alternate_locale).toContain('ja_JP');
    });

    it('should include site name and image', () => {
      const pageKey = 'services';
      const language = 'ja';
      const baseUrl = 'https://deephand.ai';

      const ogTags = generateOpenGraphTags(pageKey, language, baseUrl);

      expect(ogTags.site_name).toBe('DeepHand');
      expect(ogTags.image).toBeDefined();
      expect(ogTags.image?.startsWith('https://')).toBe(true);
    });
  });

  describe('SEO Structure Validation', () => {
    it('should validate complete SEO structure', () => {
      const seoStructure: SEOStructure = {
        pages: {
          '/': { ja: 'ホーム', en: 'Home' },
          '/about': { ja: '私たちについて', en: 'About Us' },
          '/services': { ja: 'サービス', en: 'Services' },
        },
        hreflang: {
          implemented: true,
          allPagesHaveAlternates: true,
          xDefaultSet: true,
        },
        sitemap: {
          exists: true,
          multilingualSupport: true,
          lastUpdated: new Date().toISOString(),
        },
        canonical: {
          allPagesHaveCanonical: true,
          noConflicts: true,
        },
      };

      const validation = validateSEOStructure(seoStructure);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toBeDefined();
    });

    it('should detect missing hreflang implementation', () => {
      const invalidStructure: SEOStructure = {
        pages: {
          '/': { ja: 'ホーム', en: 'Home' },
        },
        hreflang: {
          implemented: false,
          allPagesHaveAlternates: false,
          xDefaultSet: false,
        },
        sitemap: {
          exists: true,
          multilingualSupport: true,
          lastUpdated: new Date().toISOString(),
        },
        canonical: {
          allPagesHaveCanonical: true,
          noConflicts: true,
        },
      };

      const validation = validateSEOStructure(invalidStructure);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Hreflang not implemented');
    });

    it('should detect sitemap issues', () => {
      const invalidStructure: SEOStructure = {
        pages: {
          '/': { ja: 'ホーム', en: 'Home' },
        },
        hreflang: {
          implemented: true,
          allPagesHaveAlternates: true,
          xDefaultSet: true,
        },
        sitemap: {
          exists: false,
          multilingualSupport: false,
          lastUpdated: '',
        },
        canonical: {
          allPagesHaveCanonical: true,
          noConflicts: true,
        },
      };

      const validation = validateSEOStructure(invalidStructure);

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Sitemap does not exist');
    });

    it('should provide recommendations for improvements', () => {
      const goodStructure: SEOStructure = {
        pages: {
          '/': { ja: 'ホーム', en: 'Home' },
        },
        hreflang: {
          implemented: true,
          allPagesHaveAlternates: true,
          xDefaultSet: true,
        },
        sitemap: {
          exists: true,
          multilingualSupport: true,
          lastUpdated: new Date().toISOString(),
        },
        canonical: {
          allPagesHaveCanonical: true,
          noConflicts: true,
        },
      };

      const validation = validateSEOStructure(goodStructure);

      expect(validation.recommendations).toBeDefined();
      expect(Array.isArray(validation.recommendations)).toBe(true);
    });
  });
});
