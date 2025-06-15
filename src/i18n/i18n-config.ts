// TDD Green Step: i18n configuration implementation

import i18next from 'i18next';

export type SupportedLanguage = 'ja' | 'en';

export interface LanguageContent {
  common: {
    navigation: Record<string, string>;
    buttons: Record<string, string>;
    forms: Record<string, string>;
  };
  pages: Record<
    string,
    {
      title: string;
      description: string;
    }
  >;
  services: Record<
    string,
    {
      title: string;
      description: string;
    }
  >;
}

export interface I18nConfig {
  supportedLanguages: SupportedLanguage[];
  defaultLanguage: SupportedLanguage;
  fallbackLanguage: SupportedLanguage;
  resources: Record<SupportedLanguage, LanguageContent>;
  urlStructure: {
    usePrefix: boolean;
    prefixDefault: boolean;
    pattern: string;
  };
  interpolation: {
    escapeValue: boolean;
  };
  detection: {
    order: string[];
  };
}

export interface LanguageRoute {
  path: string;
  url: string;
  title: string;
  description: string;
  keywords: string[];
}

export interface ValidationResult {
  isValid: boolean;
  missingKeys: string[];
}

// Language detection from URL
export function getLanguageFromUrl(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'ja';
  }

  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return 'ja'; // Default for root path
  }

  const firstSegment = segments[0];

  if (firstSegment === 'en') {
    return 'en';
  }

  if (firstSegment === 'ja') {
    return 'ja';
  }

  // If no language prefix or invalid language, default to Japanese
  return 'ja';
}

// Get current language
export function getCurrentLanguage(): SupportedLanguage {
  return getLanguageFromUrl();
}

// Switch language
export function switchLanguage(newLanguage: SupportedLanguage): void {
  if (typeof window === 'undefined') {
    return;
  }

  const currentPath = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;

  let newPath: string;

  // Remove existing language prefix
  const pathWithoutLang = currentPath.replace(/^\/(?:ja|en)/, '') || '/';

  if (newLanguage === 'ja') {
    // Japanese is default, no prefix needed
    newPath = pathWithoutLang === '/' ? '/' : pathWithoutLang;
  } else {
    // Add language prefix for non-default languages
    newPath = `/en${pathWithoutLang}`;
  }

  const fullUrl = `${newPath}${search}${hash}`;

  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', fullUrl);
  }
}

// Generate language routes
export function generateLanguageRoutes(): Record<SupportedLanguage, LanguageRoute[]> {
  const pages = [
    { path: '/', key: 'home' },
    { path: '/about', key: 'about' },
    { path: '/services', key: 'services' },
    { path: '/contact', key: 'contact' },
    { path: '/data-request', key: 'dataRequest' },
  ];

  const jaRoutes: LanguageRoute[] = pages.map(page => ({
    path: page.path,
    url: page.path === '/' ? '/' : page.path,
    title: getPageTitle(page.key, 'ja'),
    description: getPageDescription(page.key, 'ja'),
    keywords: getPageKeywords(page.key, 'ja'),
  }));

  const enRoutes: LanguageRoute[] = pages.map(page => ({
    path: page.path,
    url: page.path === '/' ? '/en/' : `/en${page.path}`,
    title: getPageTitle(page.key, 'en'),
    description: getPageDescription(page.key, 'en'),
    keywords: getPageKeywords(page.key, 'en'),
  }));

  return {
    ja: jaRoutes,
    en: enRoutes,
  };
}

// Helper functions for SEO metadata
function getPageTitle(key: string, lang: SupportedLanguage): string {
  const titles = {
    ja: {
      home: 'ホーム - DeepHand',
      about: '私たちについて - DeepHand',
      services: 'サービス - DeepHand',
      contact: 'お問い合わせ - DeepHand',
      dataRequest: 'データリクエスト - DeepHand',
    },
    en: {
      home: 'Home - DeepHand',
      about: 'About Us - DeepHand',
      services: 'Services - DeepHand',
      contact: 'Contact - DeepHand',
      dataRequest: 'Data Request - DeepHand',
    },
  };

  return titles[lang][key as keyof (typeof titles)[typeof lang]] || titles[lang].home;
}

function getPageDescription(key: string, lang: SupportedLanguage): string {
  const descriptions = {
    ja: {
      home: 'DeepHandは次世代のAIソリューションを提供します',
      about: 'DeepHandについて詳しく知る',
      services: '私たちのサービスと専門分野',
      contact: 'お気軽にお問い合わせください',
      dataRequest: 'データリクエストフォーム',
    },
    en: {
      home: 'DeepHand provides next-generation AI solutions',
      about: 'Learn more about DeepHand',
      services: 'Our services and expertise',
      contact: 'Feel free to contact us',
      dataRequest: 'Data request form',
    },
  };

  return (
    descriptions[lang][key as keyof (typeof descriptions)[typeof lang]] || descriptions[lang].home
  );
}

function getPageKeywords(key: string, lang: SupportedLanguage): string[] {
  const keywords = {
    ja: {
      home: ['AI', '人工知能', 'DeepHand', 'ソリューション'],
      about: ['DeepHand', '会社概要', 'チーム'],
      services: ['サービス', 'コンサルティング', 'AI開発'],
      contact: ['お問い合わせ', 'コンタクト', '相談'],
      dataRequest: ['データ', 'リクエスト', 'フォーム'],
    },
    en: {
      home: ['AI', 'Artificial Intelligence', 'DeepHand', 'Solutions'],
      about: ['DeepHand', 'About Us', 'Team'],
      services: ['Services', 'Consulting', 'AI Development'],
      contact: ['Contact', 'Inquiry', 'Consultation'],
      dataRequest: ['Data', 'Request', 'Form'],
    },
  };

  return keywords[lang][key as keyof (typeof keywords)[typeof lang]] || keywords[lang].home;
}

// Validate language content
export function validateLanguageContent(
  content: LanguageContent,
  language: SupportedLanguage
): ValidationResult {
  const requiredKeys = [
    'common.navigation.home',
    'common.navigation.about',
    'common.buttons.submit',
    'common.buttons.cancel',
    'common.forms.email',
    'common.forms.name',
    'pages.home.title',
    'pages.home.description',
    'pages.about.title',
    'pages.about.description',
    'services.consulting.title',
    'services.consulting.description',
  ];

  const missingKeys: string[] = [];

  requiredKeys.forEach(key => {
    const keyParts = key.split('.');
    let current: any = content;

    for (const part of keyParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        missingKeys.push(key);
        break;
      }
    }
  });

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
}

// Create i18n configuration
export function createI18nConfig(): I18nConfig {
  const jaContent: LanguageContent = {
    common: {
      navigation: {
        home: 'ホーム',
        about: '私たちについて',
        services: 'サービス',
        contact: 'お問い合わせ',
      },
      buttons: {
        submit: '送信',
        cancel: 'キャンセル',
        send: '送信する',
        close: '閉じる',
      },
      forms: {
        email: 'メールアドレス',
        name: '名前',
        company: '会社名',
        message: 'メッセージ',
      },
    },
    pages: {
      home: {
        title: 'ホーム',
        description: 'DeepHandは次世代のAIソリューションを提供します',
      },
      about: {
        title: '私たちについて',
        description: 'DeepHandのミッションと価値観について',
      },
      services: {
        title: 'サービス',
        description: '私たちの専門的なサービス',
      },
      contact: {
        title: 'お問い合わせ',
        description: 'お気軽にご相談ください',
      },
    },
    services: {
      consulting: {
        title: 'AIコンサルティング',
        description: '専門的なAIコンサルティングサービス',
      },
      development: {
        title: 'AI開発',
        description: 'カスタムAIソリューションの開発',
      },
    },
  };

  const enContent: LanguageContent = {
    common: {
      navigation: {
        home: 'Home',
        about: 'About Us',
        services: 'Services',
        contact: 'Contact',
      },
      buttons: {
        submit: 'Submit',
        cancel: 'Cancel',
        send: 'Send',
        close: 'Close',
      },
      forms: {
        email: 'Email Address',
        name: 'Name',
        company: 'Company',
        message: 'Message',
      },
    },
    pages: {
      home: {
        title: 'Home',
        description: 'DeepHand provides next-generation AI solutions',
      },
      about: {
        title: 'About Us',
        description: "Learn about DeepHand's mission and values",
      },
      services: {
        title: 'Services',
        description: 'Our professional services',
      },
      contact: {
        title: 'Contact',
        description: 'Feel free to reach out to us',
      },
    },
    services: {
      consulting: {
        title: 'AI Consulting',
        description: 'Professional AI consulting services',
      },
      development: {
        title: 'AI Development',
        description: 'Custom AI solution development',
      },
    },
  };

  return {
    supportedLanguages: ['ja', 'en'],
    defaultLanguage: 'ja',
    fallbackLanguage: 'ja',
    resources: {
      ja: jaContent,
      en: enContent,
    },
    urlStructure: {
      usePrefix: true,
      prefixDefault: false, // Japanese is default, no prefix
      pattern: '/:lang/',
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
    },
  };
}

// Initialize i18n
export async function initializeI18n(config: I18nConfig): Promise<typeof i18next> {
  if (!config || !config.resources) {
    throw new Error('Invalid i18n configuration');
  }

  const currentLanguage = getCurrentLanguage();

  await i18next.init({
    lng: currentLanguage,
    fallbackLng: config.fallbackLanguage,
    debug: false, // Enable for development

    interpolation: config.interpolation,

    resources: {
      ja: {
        translation: flattenObject(config.resources.ja),
      },
      en: {
        translation: flattenObject(config.resources.en),
      },
    },
  });

  return i18next;
}

// Helper function to flatten nested objects for i18next
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value, newKey));
      } else {
        flattened[newKey] = String(value);
      }
    }
  }

  return flattened;
}
