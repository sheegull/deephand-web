/**
 * Astro Configuration Validation Test
 * TDDアプローチで設定エラーを検証
 */

import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';
import { promisify } from 'util';

interface DevServerResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  output: string;
  startTime: number;
  duration: number;
}

class AstroConfigValidator {
  private output = '';
  private errors: string[] = [];
  private warnings: string[] = [];

  async validateDevServerStart(timeout = 30000): Promise<DevServerResult> {
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const devProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let serverStarted = false;
      let configErrors = false;

      const handleOutput = (data: Buffer) => {
        const text = data.toString();
        this.output += text;
        
        // 設定エラーを検出
        if (text.includes('[config] Astro found issue(s)')) {
          configErrors = true;
        }

        // 個別のエラーパターンを検出
        if (text.includes('Expected type "object", received "string"')) {
          this.errors.push('image.service configuration type error');
        }

        if (text.includes('Invalid or outdated experimental feature')) {
          this.errors.push('experimental configuration error');
        }

        // 警告を検出
        if (text.includes('[WARN]')) {
          this.warnings.push(text.trim());
        }

        // サーバー正常起動を検出
        if (text.includes('Local:') && !configErrors) {
          if (!serverStarted) {
            serverStarted = true;
            setTimeout(() => {
              devProcess.kill();
              resolve({
                success: true,
                errors: this.errors,
                warnings: this.warnings,
                output: this.output,
                startTime,
                duration: Date.now() - startTime
              });
            }, 2000);
          }
        }
      };

      devProcess.stdout.on('data', handleOutput);
      devProcess.stderr.on('data', handleOutput);

      devProcess.on('error', (error) => {
        this.errors.push(`Process error: ${error.message}`);
      });

      // タイムアウト処理
      setTimeout(() => {
        if (!serverStarted) {
          devProcess.kill();
          resolve({
            success: false,
            errors: this.errors,
            warnings: this.warnings,
            output: this.output,
            startTime,
            duration: Date.now() - startTime
          });
        }
      }, timeout);
    });
  }

  reset() {
    this.output = '';
    this.errors = [];
    this.warnings = [];
  }
}

test.describe('Astro Configuration Validation', () => {
  const validator = new AstroConfigValidator();

  test('should start development server without configuration errors', async () => {
    console.log('🧪 Testing Astro configuration validation...');
    
    const result = await validator.validateDevServerStart();
    
    console.log('📊 Validation Results:', {
      success: result.success,
      errorCount: result.errors.length,
      warningCount: result.warnings.length,
      duration: `${result.duration}ms`
    });

    if (result.errors.length > 0) {
      console.log('❌ Configuration Errors Found:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('⚠️ Warnings Found:');
      result.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    // 設定エラーがないことを確認
    expect(result.errors.length).toBe(0);
    
    // サーバーが正常に起動することを確認
    expect(result.success).toBe(true);
    
    // 合理的な起動時間であることを確認
    expect(result.duration).toBeLessThan(20000); // 20秒以内
  });

  test('should validate image service configuration', async () => {
    const result = await validator.validateDevServerStart();
    
    // image.service関連のエラーがないことを確認
    const imageServiceErrors = result.errors.filter(error => 
      error.includes('image.service')
    );
    
    expect(imageServiceErrors.length).toBe(0);
    
    console.log('✅ Image service configuration is valid');
  });

  test('should validate experimental features configuration', async () => {
    const result = await validator.validateDevServerStart();
    
    // experimental関連のエラーがないことを確認
    const experimentalErrors = result.errors.filter(error => 
      error.includes('experimental')
    );
    
    expect(experimentalErrors.length).toBe(0);
    
    console.log('✅ Experimental features configuration is valid');
  });

  test('should measure development server performance', async () => {
    const result = await validator.validateDevServerStart();
    
    const performanceMetrics = {
      startupTime: result.duration,
      success: result.success,
      errorCount: result.errors.length,
      warningCount: result.warnings.length
    };
    
    console.log('⚡ Performance Metrics:', performanceMetrics);
    
    // パフォーマンス基準の確認
    expect(performanceMetrics.startupTime).toBeLessThan(15000); // 15秒以内
    expect(performanceMetrics.errorCount).toBe(0);
    
    // 警告は許容範囲内であること（必要に応じて調整）
    expect(performanceMetrics.warningCount).toBeLessThan(5);
  });

  test('should validate complete configuration integrity', async () => {
    console.log('🔍 Comprehensive configuration validation...');
    
    const result = await validator.validateDevServerStart(25000); // より長いタイムアウト
    
    const configIssues = {
      typeErrors: result.errors.filter(e => e.includes('type')),
      syntaxErrors: result.errors.filter(e => e.includes('syntax')),
      deprecationWarnings: result.warnings.filter(w => w.includes('deprecated')),
      unknownOptions: result.errors.filter(e => e.includes('unknown') || e.includes('invalid'))
    };
    
    console.log('📋 Configuration Analysis:', {
      totalErrors: result.errors.length,
      totalWarnings: result.warnings.length,
      typeErrors: configIssues.typeErrors.length,
      syntaxErrors: configIssues.syntaxErrors.length,
      deprecationWarnings: configIssues.deprecationWarnings.length,
      unknownOptions: configIssues.unknownOptions.length
    });
    
    // 全体的な設定整合性を確認
    expect(result.success).toBe(true);
    expect(configIssues.typeErrors.length).toBe(0);
    expect(configIssues.syntaxErrors.length).toBe(0);
    expect(configIssues.unknownOptions.length).toBe(0);
    
    console.log('✅ Configuration integrity validated successfully');
  });
});

// ヘルパー関数: 設定変更のための再テスト
test.describe('Configuration Change Verification', () => {
  test('should validate after configuration changes', async () => {
    const validator = new AstroConfigValidator();
    
    // 設定変更後の検証
    const result = await validator.validateDevServerStart();
    
    const changeValidation = {
      imageServiceFixed: !result.errors.some(e => e.includes('image.service')),
      experimentalFixed: !result.errors.some(e => e.includes('experimental')),
      overallSuccess: result.success,
      configurationClean: result.errors.length === 0
    };
    
    console.log('🔄 Configuration Change Validation:', changeValidation);
    
    // 全ての修正が適用されていることを確認
    expect(changeValidation.imageServiceFixed).toBe(true);
    expect(changeValidation.experimentalFixed).toBe(true);
    expect(changeValidation.overallSuccess).toBe(true);
    expect(changeValidation.configurationClean).toBe(true);
    
    console.log('✅ All configuration changes validated successfully');
  });
});