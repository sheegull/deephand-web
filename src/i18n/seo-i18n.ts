// TDD Green Step: SEO i18n implementation

import type { SupportedLanguage } from './i18n-config';

export interface HreflangTag {
  hreflang: string;
  href: string;
}

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface OpenGraphTags {
  title: string;
  description: string;
  url: string;
  type: string;
  locale: string;
  alternate_locale?: string[];
  site_name: string;
  image?: string;
}

export interface TwitterTags {
  card: string;
  title: string;
  description: string;
  image?: string;
}

export interface I18nMetaData {
  title: string;
  description: string;
  keywords: string[];
  lang: string;
  canonical: string;
  hreflang: HreflangTag[];
  openGraph: OpenGraphTags;
  twitter: TwitterTags;
}

export interface SEOStructure {
  pages: Record<string, Record<SupportedLanguage, string>>;
  hreflang: {
    implemented: boolean;
    allPagesHaveAlternates: boolean;
    xDefaultSet: boolean;
  };
  sitemap: {
    exists: boolean;
    multilingualSupport: boolean;
    lastUpdated: string;
  };
  canonical: {
    allPagesHaveCanonical: boolean;
    noConflicts: boolean;
  };
}

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// Generate hreflang tags for a page
export function generateHreflangTags(currentPath: string, baseUrl: string): HreflangTag[] {
  const supportedLanguages: SupportedLanguage[] = ['ja', 'en'];
  const tags: HreflangTag[] = [];

  // Remove existing language prefix from path
  const cleanPath = currentPath.replace(/^\/(?:ja|en)/, '') || '/';

  // Generate hreflang tags for each supported language
  supportedLanguages.forEach(lang => {
    let href: string;

    if (lang === 'ja') {
      // Japanese is default, no prefix needed
      href = cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`;
    } else {
      // Add language prefix for non-default languages
      href = cleanPath === '/' ? `${baseUrl}/${lang}/` : `${baseUrl}/${lang}${cleanPath}`;
    }

    tags.push({
      hreflang: lang,
      href,
    });
  });

  // Add x-default pointing to the default language (Japanese)
  const defaultHref = cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`;
  tags.push({
    hreflang: 'x-default',
    href: defaultHref,
  });

  return tags;
}

// Generate multilingual sitemap
export function generateMultilingualSitemap(baseUrl: string): SitemapEntry[] {
  const pages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/about', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/services', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/contact', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/data-request', priority: 0.5, changefreq: 'monthly' as const },
  ];

  const sitemap: SitemapEntry[] = [];
  const now = new Date().toISOString();

  pages.forEach(page => {
    // Japanese version (default, no prefix)
    const jaUrl = page.path === '/' ? `${baseUrl}/` : `${baseUrl}${page.path}`;
    const jaAlternates = generateHreflangTags(page.path, baseUrl);

    sitemap.push({
      url: jaUrl,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
      alternates: jaAlternates.map(tag => ({
        hreflang: tag.hreflang,
        href: tag.href,
      })),
    });

    // English version
    const enUrl = page.path === '/' ? `${baseUrl}/en/` : `${baseUrl}/en${page.path}`;
    const enAlternates = generateHreflangTags(page.path, baseUrl);

    sitemap.push({
      url: enUrl,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority * 0.9, // Slightly lower priority for non-default language
      alternates: enAlternates.map(tag => ({
        hreflang: tag.hreflang,
        href: tag.href,
      })),
    });
  });

  return sitemap;
}

// Create i18n meta tags for a page
export function createI18nMetaTags(
  pageKey: string,
  language: SupportedLanguage,
  baseUrl: string
): I18nMetaData {
  const pageData = getPageMetadata(pageKey, language);
  const currentPath = getPagePath(pageKey);
  const canonical = createCanonicalUrls(currentPath, language, baseUrl);
  const hreflang = generateHreflangTags(currentPath, baseUrl);
  const openGraph = generateOpenGraphTags(pageKey, language, baseUrl);
  const twitter = generateTwitterTags(pageKey, language);

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    lang: language,
    canonical,
    hreflang,
    openGraph,
    twitter,
  };
}

// Generate alternate URLs for all languages
export function generateAlternateUrls(
  currentPath: string,
  baseUrl: string
): Record<SupportedLanguage, string> {
  const cleanPath = currentPath.replace(/^\/(?:ja|en)/, '') || '/';

  return {
    ja: cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`,
    en: cleanPath === '/' ? `${baseUrl}/en/` : `${baseUrl}/en${cleanPath}`,
  };
}

// Create canonical URLs
export function createCanonicalUrls(
  currentPath: string,
  language: SupportedLanguage,
  baseUrl: string
): string {
  const cleanPath = currentPath.replace(/^\/(?:ja|en)/, '') || '/';

  if (language === 'ja') {
    return cleanPath === '/' ? `${baseUrl}/` : `${baseUrl}${cleanPath}`;
  } else {
    return cleanPath === '/' ? `${baseUrl}/en/` : `${baseUrl}/en${cleanPath}`;
  }
}

// Generate OpenGraph tags
export function generateOpenGraphTags(
  pageKey: string,
  language: SupportedLanguage,
  baseUrl: string
): OpenGraphTags {
  const pageData = getPageMetadata(pageKey, language);
  const currentPath = getPagePath(pageKey);
  const url = createCanonicalUrls(currentPath, language, baseUrl);

  const locale = language === 'ja' ? 'ja_JP' : 'en_US';
  const alternateLocale = language === 'ja' ? ['en_US'] : ['ja_JP'];

  return {
    title: pageData.title,
    description: pageData.description,
    url,
    type: 'website',
    locale,
    alternate_locale: alternateLocale,
    site_name: 'DeepHand',
    image: `${baseUrl}/images/og-image-${language}.jpg`,
  };
}

// Generate Twitter tags
function generateTwitterTags(pageKey: string, language: SupportedLanguage): TwitterTags {
  const pageData = getPageMetadata(pageKey, language);

  return {
    card: 'summary_large_image',
    title: pageData.title,
    description: pageData.description,
    image: `/images/twitter-card-${language}.jpg`,
  };
}

// Validate SEO structure
export function validateSEOStructure(structure: SEOStructure): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check hreflang implementation
  if (!structure.hreflang.implemented) {
    errors.push('Hreflang not implemented');
  }
  if (!structure.hreflang.allPagesHaveAlternates) {
    errors.push('Not all pages have alternate language versions');
  }
  if (!structure.hreflang.xDefaultSet) {
    warnings.push('x-default hreflang not set');
  }

  // Check sitemap
  if (!structure.sitemap.exists) {
    errors.push('Sitemap does not exist');
  }
  if (!structure.sitemap.multilingualSupport) {
    errors.push('Sitemap does not support multiple languages');
  }
  if (!structure.sitemap.lastUpdated) {
    warnings.push('Sitemap last updated date not available');
  }

  // Check canonical URLs
  if (!structure.canonical.allPagesHaveCanonical) {
    errors.push('Not all pages have canonical URLs');
  }
  if (!structure.canonical.noConflicts) {
    errors.push('Canonical URL conflicts detected');
  }

  // Check page coverage
  const pageCount = Object.keys(structure.pages).length;
  if (pageCount < 3) {
    warnings.push('Consider adding more pages for better SEO coverage');
  }

  // Recommendations
  recommendations.push('Consider implementing structured data markup');
  recommendations.push('Monitor Core Web Vitals for all language versions');
  recommendations.push('Set up Google Search Console for all domains/subdomains');

  if (structure.hreflang.implemented && structure.sitemap.exists) {
    recommendations.push('Consider implementing automatic hreflang tag generation');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations,
  };
}

// Helper functions
function getPageMetadata(pageKey: string, language: SupportedLanguage) {
  const metadata = {
    ja: {
      home: {
        title: 'ホーム - DeepHand',
        description: 'DeepHandは次世代のAIソリューションを提供します',
        keywords: ['AI', '人工知能', 'DeepHand', 'ソリューション'],
      },
      about: {
        title: '私たちについて - DeepHand',
        description: 'DeepHandのミッションと価値観について',
        keywords: ['DeepHand', '会社概要', 'チーム', 'ミッション'],
      },
      services: {
        title: 'サービス - DeepHand',
        description: '私たちの専門的なサービス',
        keywords: ['サービス', 'コンサルティング', 'AI開発', '専門'],
      },
      contact: {
        title: 'お問い合わせ - DeepHand',
        description: 'お気軽にご相談ください',
        keywords: ['お問い合わせ', 'コンタクト', '相談', '連絡'],
      },
      'data-request': {
        title: 'データリクエスト - DeepHand',
        description: 'データリクエストフォーム',
        keywords: ['データ', 'リクエスト', 'フォーム', '申請'],
      },
    },
    en: {
      home: {
        title: 'Home - DeepHand',
        description: 'DeepHand provides next-generation AI solutions',
        keywords: ['AI', 'Artificial Intelligence', 'DeepHand', 'Solutions'],
      },
      about: {
        title: 'About Us - DeepHand',
        description: "Learn about DeepHand's mission and values",
        keywords: ['DeepHand', 'About Us', 'Team', 'Mission'],
      },
      services: {
        title: 'Services - DeepHand',
        description: 'Our professional services',
        keywords: ['Services', 'Consulting', 'AI Development', 'Professional'],
      },
      contact: {
        title: 'Contact - DeepHand',
        description: 'Feel free to reach out to us',
        keywords: ['Contact', 'Inquiry', 'Consultation', 'Reach Out'],
      },
      'data-request': {
        title: 'Data Request - DeepHand',
        description: 'Data request form',
        keywords: ['Data', 'Request', 'Form', 'Application'],
      },
    },
  };

  return (
    metadata[language][pageKey as keyof (typeof metadata)[typeof language]] ||
    metadata[language].home
  );
}

function getPagePath(pageKey: string): string {
  const paths: Record<string, string> = {
    home: '/',
    about: '/about',
    services: '/services',
    contact: '/contact',
    'data-request': '/data-request',
  };

  return paths[pageKey] || '/';
}
