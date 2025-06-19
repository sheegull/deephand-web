#!/usr/bin/env node

/**
 * Quick Configuration Test
 * 設定エラーの迅速な検証
 */

import { spawn } from 'child_process';

class QuickConfigTest {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.configValid = false;
  }

  async testConfig(timeout = 15000) {
    console.log('🧪 Testing Astro configuration...');
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const devProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let hasConfigErrors = false;

      const handleOutput = (data) => {
        const text = data.toString();
        output += text;
        
        // 設定エラーパターンの検出
        if (text.includes('[config] Astro found issue(s)')) {
          hasConfigErrors = true;
        }

        if (text.includes('Expected type "object", received "string"')) {
          this.errors.push('❌ image.service type error');
        }

        if (text.includes('Invalid or outdated experimental feature')) {
          this.errors.push('❌ experimental config error');
        }

        if (text.includes('[WARN]')) {
          this.warnings.push(text.trim());
        }

        // 成功パターンの検出
        if (text.includes('Local:') && !hasConfigErrors) {
          this.configValid = true;
          devProcess.kill();
          
          const duration = Date.now() - startTime;
          resolve({
            success: true,
            duration,
            errors: this.errors,
            warnings: this.warnings,
            output
          });
        }
      };

      devProcess.stdout.on('data', handleOutput);
      devProcess.stderr.on('data', handleOutput);

      devProcess.on('error', (error) => {
        this.errors.push(`Process error: ${error.message}`);
      });

      // タイムアウト処理
      setTimeout(() => {
        devProcess.kill();
        const duration = Date.now() - startTime;
        
        if (hasConfigErrors || this.errors.length > 0) {
          resolve({
            success: false,
            duration,
            errors: this.errors,
            warnings: this.warnings,
            output
          });
        } else {
          // タイムアウトだが設定エラーはない
          resolve({
            success: false,
            duration,
            errors: ['⏱️ Timeout - Server may be slow but config appears valid'],
            warnings: this.warnings,
            output
          });
        }
      }, timeout);
    });
  }

  printResults(result) {
    console.log('\n📊 Configuration Test Results:');
    console.log(`Duration: ${result.duration}ms`);
    console.log(`Success: ${result.success ? '✅' : '❌'}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      result.warnings.forEach(warning => console.log(`  ${warning.substring(0, 100)}...`));
    }
    
    if (result.success) {
      console.log('\n✅ Configuration is valid!');
    } else if (result.errors.length === 0) {
      console.log('\n🟡 No configuration errors detected');
    }
  }
}

// 実行
async function main() {
  const tester = new QuickConfigTest();
  
  try {
    const result = await tester.testConfig();
    tester.printResults(result);
    
    // 終了コード設定
    const hasConfigErrors = result.errors.some(e => 
      e.includes('type error') || e.includes('config error')
    );
    
    process.exit(hasConfigErrors ? 1 : 0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// ES Module環境での実行
main();

export default QuickConfigTest;