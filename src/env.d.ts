/// <reference path="../.astro/types.d.ts" />

// Astro環境変数の型定義
interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  readonly ADMIN_EMAIL: string;
  readonly FROM_EMAIL: string;
  readonly NOREPLY_EMAIL: string;
  readonly REQUESTS_EMAIL: string;
  readonly TEST_EMAIL_RECIPIENT: string;
  readonly ENABLE_EMAIL_DEBUG: string;
  readonly NODE_ENV: string;
  readonly PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
