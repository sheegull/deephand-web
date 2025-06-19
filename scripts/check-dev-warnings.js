#!/usr/bin/env node

/**
 * Development Warnings Checker
 * npm run devの出力を監視して警告を自動検出
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevWarningsChecker {
  constructor() {
    this.warnings = [];
    this.errors = [];
    this.startTime = Date.now();
    this.logFile = path.join(__dirname, '../logs/dev-warnings.log');
    
    // ログディレクトリを作成
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  async startDevServer() {
    console.log('🚀 Starting development server...');
    
    return new Promise((resolve, reject) => {
      const devProcess = spawn('npm', ['run', 'dev'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let serverStarted = false;

      devProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        this.analyzeOutput(text);
        
        // サーバーが起動したことを検出
        if (text.includes('Local:') || text.includes('localhost:')) {
          if (!serverStarted) {
            serverStarted = true;
            setTimeout(() => resolve(devProcess), 3000); // 3秒待機後に解決
          }
        }
      });

      devProcess.stderr.on('data', (data) => {
        const text = data.toString();
        output += text;
        this.analyzeOutput(text);
      });

      devProcess.on('error', (error) => {
        this.errors.push(`Process error: ${error.message}`);
        reject(error);
      });

      // タイムアウト設定
      setTimeout(() => {
        if (!serverStarted) {
          reject(new Error('Development server failed to start within 30 seconds'));
        }
      }, 30000);
    });
  }

  analyzeOutput(text) {
    const lines = text.split('\n');
    
    for (const line of lines) {
      // 特定の警告パターンを検出
      if (this.isWarning(line)) {
        this.warnings.push({
          type: this.categorizeWarning(line),
          message: line.trim(),
          timestamp: Date.now() - this.startTime
        });
      }
      
      if (this.isError(line)) {
        this.errors.push({
          message: line.trim(),
          timestamp: Date.now() - this.startTime
        });
      }
    }
    
    // ログファイルに記録
    this.writeToLog(text);
  }

  isWarning(line) {
    const warningPatterns = [
      /\[WARN\]/i,
      /warning:/i,
      /deprecated/i,
      /\.backup/,
      /unsupported file type/i,
      /sharp at runtime/i
    ];
    
    return warningPatterns.some(pattern => pattern.test(line));
  }

  isError(line) {
    const errorPatterns = [
      /\[ERROR\]/i,
      /error:/i,
      /failed to/i,
      /cannot/i
    ];
    
    return errorPatterns.some(pattern => pattern.test(line)) && 
           !line.includes('net::ERR_'); // ネットワークエラーを除外
  }

  categorizeWarning(line) {
    if (line.includes('.backup')) return 'backup-file';
    if (line.includes('sharp')) return 'image-optimization';
    if (line.includes('Cloudflare')) return 'cloudflare-adapter';
    if (line.includes('deprecated')) return 'deprecation';
    return 'general';
  }

  writeToLog(text) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${text}`;
    fs.appendFileSync(this.logFile, logEntry);
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      runtime: Date.now() - this.startTime,
      warnings: {
        total: this.warnings.length,
        byType: this.groupByType(this.warnings)
      },
      errors: {
        total: this.errors.length,
        items: this.errors
      },
      improvements: this.suggestImprovements()
    };

    return report;
  }

  groupByType(items) {
    return items.reduce((acc, item) => {
      const type = item.type || 'general';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  suggestImprovements() {
    const suggestions = [];
    
    const backupWarnings = this.warnings.filter(w => w.type === 'backup-file');
    if (backupWarnings.length > 0) {
      suggestions.push('バックアップファイルを削除またはアンダースコアプレフィックスを追加');
    }

    const imageWarnings = this.warnings.filter(w => w.type === 'image-optimization');
    if (imageWarnings.length > 0) {
      suggestions.push('astro.config.mjsでimage.service: "compile"を設定');
    }

    if (this.warnings.length === 0) {
      suggestions.push('✅ 警告は検出されませんでした');
    }

    return suggestions;
  }

  async checkForSeconds(duration = 15) {
    console.log(`⏱️ Monitoring for ${duration} seconds...`);
    
    const devProcess = await this.startDevServer();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('⏹️ Stopping monitoring...');
        devProcess.kill();
        
        const report = this.generateReport();
        console.log('\n📊 Development Warnings Report:');
        console.log(JSON.stringify(report, null, 2));
        
        // 結果をファイルに保存
        const reportPath = path.join(__dirname, '../logs/dev-warnings-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📝 Report saved to: ${reportPath}`);
        
        resolve(report);
      }, duration * 1000);
    });
  }
}

// スクリプトとして実行された場合
if (require.main === module) {
  const checker = new DevWarningsChecker();
  
  const duration = process.argv[2] ? parseInt(process.argv[2]) : 15;
  
  checker.checkForSeconds(duration)
    .then((report) => {
      const hasIssues = report.warnings.total > 0 || report.errors.total > 0;
      process.exit(hasIssues ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = DevWarningsChecker;