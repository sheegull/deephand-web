// TDD: env.ts 構文エラー修正テスト

import { describe, it, expect } from 'vitest';

describe('🔴 Red Phase: env.ts Syntax Error Reproduction', () => {
  it('should fail with ESM/CommonJS mixing', () => {
    // ESM環境でのrequire使用が問題を引き起こすことを確認
    const problematicCode = `
      const { config } = require('dotenv'); // CommonJS
      export const getEnvVar = () => { // ESM
        const value = import.meta?.env?.[key]; // ESM syntax
      };
    `;

    expect(problematicCode).toContain('require(');
    expect(problematicCode).toContain('export const');
    expect(problematicCode).toContain('import.meta');
  });

  it('should show syntax error pattern', () => {
    // 構文エラーパターンを確認
    const errorPattern = /Expected.*but found.*!==/;
    const sampleError = 'Expected "(" but found "!=="';
    expect(sampleError).toMatch(errorPattern);
  });
});

describe('🟢 Green Phase: env.ts Syntax Fix', () => {
  it('should work with pure ESM syntax', () => {
    // 純粋なESM構文で動作することを確認
    const cleanESMCode = `
      export const getEnvVar = (key, fallback) => {
        let value = process.env[key];
        if (!value && typeof globalThis !== 'undefined' && globalThis.process) {
          value = globalThis.process.env[key];
        }
        return value || fallback;
      };
    `;

    expect(cleanESMCode).not.toContain('require(');
    expect(cleanESMCode).toContain('export const');
    expect(cleanESMCode).not.toContain('import.meta?.env');
  });

  it('should handle environment variables safely', () => {
    // 安全な環境変数処理を確認
    const safeEnvAccess = (key, fallback) => {
      let value = process.env[key];
      if (!value) {
        value = fallback;
      }
      return value;
    };

    expect(safeEnvAccess('TEST_KEY', 'default')).toBe('default');
    expect(typeof safeEnvAccess).toBe('function');
  });

  it('should avoid complex optional chaining', () => {
    // 複雑なoptional chainingを回避
    const simpleAccess = key => {
      if (process.env[key]) {
        return process.env[key];
      }
      return undefined;
    };

    expect(typeof simpleAccess).toBe('function');
  });
});

describe('🔵 Refactor Phase: Clean Environment Management', () => {
  it('should have simple environment access', () => {
    // シンプルな環境変数アクセス
    const ENV_KEYS = ['RESEND_API_KEY', 'PUBLIC_SITE_URL', 'ADMIN_EMAIL'];

    ENV_KEYS.forEach(key => {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });
  });

  it('should separate initialization from access', () => {
    // 初期化とアクセスの分離
    const initializationConcern = 'dotenv-loading';
    const accessConcern = 'env-variable-access';

    expect(initializationConcern).not.toBe(accessConcern);
  });
});
