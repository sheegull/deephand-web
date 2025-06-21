// 環境変数管理 - Cloudflare Pages SSR対応

// Cloudflare Workersランタイム環境変数を取得する関数
export function getCloudflareEnv(runtimeEnv?: any) {
  // 本番環境（Cloudflare Workers）でRESEND_API_KEYが存在する場合のみruntimeEnvを優先
  if (runtimeEnv && runtimeEnv.RESEND_API_KEY) {
    // Cloudflare Workersランタイムから取得
    return {
      RESEND_API_KEY: runtimeEnv.RESEND_API_KEY || '',
      PUBLIC_SITE_URL: runtimeEnv.PUBLIC_SITE_URL || 'https://deephandai.com',
      ADMIN_EMAIL: runtimeEnv.ADMIN_EMAIL || 'contact@deephandai.com',
      FROM_EMAIL: runtimeEnv.FROM_EMAIL || 'contact@deephandai.com',
      NOREPLY_EMAIL: runtimeEnv.NOREPLY_EMAIL || 'noreply@deephandai.com',
      REQUESTS_EMAIL: runtimeEnv.REQUESTS_EMAIL || 'requests@deephandai.com',
      TEST_EMAIL_RECIPIENT: runtimeEnv.TEST_EMAIL_RECIPIENT || '',
      ENABLE_EMAIL_DEBUG: runtimeEnv.ENABLE_EMAIL_DEBUG === 'true',
      NODE_ENV: runtimeEnv.NODE_ENV || 'production',
      PORT: parseInt(runtimeEnv.PORT || '4321', 10),
    };
  }
  
  // フォールバック：ビルド時環境変数 + ローカル開発環境専用の直接読み込み + runtime環境変数
  let localEnv: Record<string, string> = {};
  
  // ローカル開発環境でのみ process.env から直接読み込み（本番環境では使用されない）
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    localEnv = {
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || '',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
      FROM_EMAIL: process.env.FROM_EMAIL || '',
      NOREPLY_EMAIL: process.env.NOREPLY_EMAIL || '',
      REQUESTS_EMAIL: process.env.REQUESTS_EMAIL || '',
      TEST_EMAIL_RECIPIENT: process.env.TEST_EMAIL_RECIPIENT || '',
      ENABLE_EMAIL_DEBUG: process.env.ENABLE_EMAIL_DEBUG || '',
      NODE_ENV: process.env.NODE_ENV || '',
      PORT: process.env.PORT || '',
    };
  }
  
  return {
    RESEND_API_KEY: localEnv.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || runtimeEnv?.RESEND_API_KEY || '',
    PUBLIC_SITE_URL: runtimeEnv?.PUBLIC_SITE_URL || localEnv.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || 'https://deephandai.com',
    ADMIN_EMAIL: runtimeEnv?.ADMIN_EMAIL || localEnv.ADMIN_EMAIL || import.meta.env.ADMIN_EMAIL || 'contact@deephandai.com',
    FROM_EMAIL: runtimeEnv?.FROM_EMAIL || localEnv.FROM_EMAIL || import.meta.env.FROM_EMAIL || 'contact@deephandai.com',
    NOREPLY_EMAIL: runtimeEnv?.NOREPLY_EMAIL || localEnv.NOREPLY_EMAIL || import.meta.env.NOREPLY_EMAIL || 'noreply@deephandai.com',
    REQUESTS_EMAIL: runtimeEnv?.REQUESTS_EMAIL || localEnv.REQUESTS_EMAIL || import.meta.env.REQUESTS_EMAIL || 'requests@deephandai.com',
    TEST_EMAIL_RECIPIENT: localEnv.TEST_EMAIL_RECIPIENT || import.meta.env.TEST_EMAIL_RECIPIENT || runtimeEnv?.TEST_EMAIL_RECIPIENT || '',
    ENABLE_EMAIL_DEBUG: (runtimeEnv?.ENABLE_EMAIL_DEBUG || localEnv.ENABLE_EMAIL_DEBUG || import.meta.env.ENABLE_EMAIL_DEBUG) === 'true',
    NODE_ENV: localEnv.NODE_ENV || runtimeEnv?.NODE_ENV || import.meta.env.NODE_ENV || 'production',
    PORT: parseInt(localEnv.PORT || import.meta.env.PORT || runtimeEnv?.PORT || '4321', 10),
  };
}

// 旧形式（互換性のため）
export const ENV = getCloudflareEnv();

// 環境変数検証機能（Cloudflare対応）
export function validateEnvironment(runtimeEnv?: any) {
  const env = getCloudflareEnv(runtimeEnv);
  const errors: string[] = [];

  // 必須環境変数チェック
  if (!env.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required');
  } else if (!env.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY must start with "re_"');
  }

  // URL形式チェック
  if (env.PUBLIC_SITE_URL && !env.PUBLIC_SITE_URL.startsWith('http')) {
    errors.push('PUBLIC_SITE_URL must start with http:// or https://');
  }

  const isValid = errors.length === 0;

  if (env.ENABLE_EMAIL_DEBUG) {
    console.log('🔍 環境変数検証結果:');
    console.log('='.repeat(50));
    console.log('RESEND_API_KEY:', env.RESEND_API_KEY ? '✅ 設定済み' : '❌ 未設定');
    console.log('PUBLIC_SITE_URL:', env.PUBLIC_SITE_URL);
    console.log('ADMIN_EMAIL:', env.ADMIN_EMAIL);
    console.log('FROM_EMAIL:', env.FROM_EMAIL);
    console.log('NODE_ENV:', env.NODE_ENV);
    console.log('='.repeat(50));

    if (!isValid) {
      console.error('❌ 環境変数エラー:', errors);
    } else {
      console.log('✅ 環境変数設定正常');
    }
  }

  return {
    isValid,
    errors,
    config: {
      apiKey: env.RESEND_API_KEY,
      siteUrl: env.PUBLIC_SITE_URL,
      adminEmail: env.ADMIN_EMAIL,
      fromEmail: env.FROM_EMAIL,
    },
  };
}

// 安全な環境変数取得
export function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] || fallback;

  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }

  return value;
}

// 診断機能（Cloudflare対応）
export function diagnoseEnvironment(runtimeEnv?: any) {
  return validateEnvironment(runtimeEnv);
}

// 初期化時の自動検証（開発モードのみ）
if (ENV.NODE_ENV === 'development') {
  // Cloudflare SSRではsetTimeoutを使用
  if (typeof globalThis !== 'undefined') {
    setTimeout(() => {
      if (ENV.ENABLE_EMAIL_DEBUG) {
        validateEnvironment();
      }
    }, 0);
  }
}
