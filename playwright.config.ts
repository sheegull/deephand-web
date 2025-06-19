import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright設定ファイル
 * モバイル性能テスト用の包括的な設定
 */
export default defineConfig({
  testDir: './tests/mobile-performance',
  
  // 並列実行設定
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // テストレポート設定
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/mobile-performance-results.json' }]
  ],
  
  // 基本設定
  use: {
    baseURL: 'http://localhost:4324',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // プロジェクト設定（デバイス別テスト）
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // モバイルデバイステスト
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        // モバイル性能制限のシミュレーション
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-gpu',
            '--enable-gpu-memory-buffer-compositor-resources',
            '--enable-gpu-memory-buffer-video-frames',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        }
      },
    },
    
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // 低性能デバイスシミュレーション
    {
      name: 'low-end-mobile',
      use: {
        ...devices['Galaxy S5'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-gpu',
            '--memory-pressure-off',
            '--max_old_space_size=512'
          ]
        }
      },
    },
    
    // タブレット
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // 開発サーバー設定
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4324',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});