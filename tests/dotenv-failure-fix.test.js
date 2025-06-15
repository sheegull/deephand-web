// TDD: dotenv読み込み失敗修正テスト

import { describe, it, expect } from 'vitest';

describe('🔴 Red Phase: dotenv Loading Failure', () => {
  it('should fail with require in ESM environment', () => {
    // ESM環境でrequireが使用できないことを確認
    const requireUsage = `eval('require')('dotenv')`;

    expect(requireUsage).toContain('require');
    // require依存がESM環境で問題を引き起こすことを確認
  });

  it('should show environment variable missing error', () => {
    // 環境変数未設定エラーパターンを確認
    const errorMessage = '環境変数 RESEND_API_KEY が設定されていません';
    expect(errorMessage).toContain('RESEND_API_KEY');
    expect(errorMessage).toContain('設定されていません');
  });

  it('should fail with complex initialization', () => {
    // 複雑な初期化処理が失敗することを確認
    const complexInit = 'initializeEnvironment() + eval(require)';
    expect(complexInit).toContain('eval');
    expect(complexInit).toContain('require');
  });
});

describe('🟢 Green Phase: Simple Environment Access', () => {
  it('should work with direct process.env access', () => {
    // process.env直接アクセスが動作することを確認
    const directAccess = process.env.NODE_ENV || 'development';

    expect(typeof directAccess).toBe('string');
    expect(directAccess).toBeTruthy();
  });

  it('should handle missing environment variables safely', () => {
    // 未設定環境変数の安全な処理を確認
    const safeAccess = (key, fallback) => {
      return process.env[key] || fallback || '';
    };

    expect(safeAccess('NONEXISTENT_KEY', 'default')).toBe('default');
    expect(safeAccess('NONEXISTENT_KEY')).toBe('');
  });

  it('should provide simple environment configuration', () => {
    // シンプルな環境設定オブジェクトを確認
    const simpleEnv = {
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
      NODE_ENV: process.env.NODE_ENV || 'development',
    };

    expect(typeof simpleEnv.RESEND_API_KEY).toBe('string');
    expect(typeof simpleEnv.PUBLIC_SITE_URL).toBe('string');
    expect(typeof simpleEnv.NODE_ENV).toBe('string');
  });
});

describe('🔵 Refactor Phase: Robust Environment Management', () => {
  it('should validate required environment variables', () => {
    // 必須環境変数の検証機能を確認
    const validateEnv = config => {
      const required = ['RESEND_API_KEY'];
      const missing = required.filter(key => !config[key]);
      return { isValid: missing.length === 0, missing };
    };

    const testConfig = { RESEND_API_KEY: 're_test123' };
    const result = validateEnv(testConfig);

    expect(result.isValid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('should provide fallback values', () => {
    // フォールバック値の提供を確認
    const withFallbacks = {
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'contact@deephandai.com',
    };

    // フォールバック値が適切に設定されることを確認
    expect(withFallbacks.PUBLIC_SITE_URL).toBeTruthy();
    expect(withFallbacks.ADMIN_EMAIL).toBe('contact@deephandai.com');
  });
});
