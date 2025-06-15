// 環境変数管理 - シンプル・確実な実装

// 環境変数の直接アクセス（require不使用）
export const ENV = {
  // メール設定（必須）
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',

  // URL設定
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',

  // メールアドレス設定（.env.localで変更可能）
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'contact@deephandai.com',
  FROM_EMAIL: process.env.FROM_EMAIL || 'contact@deephandai.com',
  NOREPLY_EMAIL: process.env.NOREPLY_EMAIL || 'noreply@deephandai.com',
  REQUESTS_EMAIL: process.env.REQUESTS_EMAIL || 'requests@deephandai.com',

  // テスト・デバッグ設定
  TEST_EMAIL_RECIPIENT: process.env.TEST_EMAIL_RECIPIENT || '',
  ENABLE_EMAIL_DEBUG: process.env.ENABLE_EMAIL_DEBUG === 'true',

  // 環境設定
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4321', 10),
} as const;

// 環境変数検証機能
export function validateEnvironment() {
  const errors: string[] = [];

  // 必須環境変数チェック
  if (!ENV.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required');
  } else if (!ENV.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY must start with "re_"');
  }

  // URL形式チェック
  if (ENV.PUBLIC_SITE_URL && !ENV.PUBLIC_SITE_URL.startsWith('http')) {
    errors.push('PUBLIC_SITE_URL must start with http:// or https://');
  }

  const isValid = errors.length === 0;

  if (ENV.ENABLE_EMAIL_DEBUG) {
    console.log('🔍 環境変数検証結果:');
    console.log('='.repeat(50));
    console.log('RESEND_API_KEY:', ENV.RESEND_API_KEY ? '✅ 設定済み' : '❌ 未設定');
    console.log('PUBLIC_SITE_URL:', ENV.PUBLIC_SITE_URL);
    console.log('ADMIN_EMAIL:', ENV.ADMIN_EMAIL);
    console.log('FROM_EMAIL:', ENV.FROM_EMAIL);
    console.log('NODE_ENV:', ENV.NODE_ENV);
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
      apiKey: ENV.RESEND_API_KEY,
      siteUrl: ENV.PUBLIC_SITE_URL,
      adminEmail: ENV.ADMIN_EMAIL,
      fromEmail: ENV.FROM_EMAIL,
    },
  };
}

// 安全な環境変数取得
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;

  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }

  return value;
}

// 診断機能
export function diagnoseEnvironment() {
  return validateEnvironment();
}

// 初期化時の自動検証（開発モードのみ）
if (ENV.NODE_ENV === 'development') {
  // 即座実行を避け、nextTickで実行
  if (typeof process !== 'undefined' && process.nextTick) {
    process.nextTick(() => {
      if (ENV.ENABLE_EMAIL_DEBUG) {
        validateEnvironment();
      }
    });
  }
}
