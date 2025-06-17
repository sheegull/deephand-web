# パフォーマンスガイドライン

**作成日**: 2025年1月17日  
**プロジェクト**: DeepHand Web

## 概要

このドキュメントでは、DeepHand Webプロジェクトのパフォーマンス最適化戦略、ベストプラクティス、監視方法について説明します。

## パフォーマンス目標

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### その他の指標
- **TTFB (Time to First Byte)**: < 800ms
- **First Paint**: < 1.5秒
- **Speed Index**: < 3.0秒

## Astro最適化戦略

### 静的サイト生成 (SSG)
- デフォルトでSSGを使用
- ビルド時にHTMLを事前生成
- CDNでの配信に最適化

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static', // 静的サイト生成
  build: {
    inlineStylesheets: 'auto', // 小さなCSSのインライン化
  }
});
```

### 部分的水和 (Partial Hydration)
- 必要な部分のみJavaScriptを配信
- Astro Islandsパターンの活用

```astro
---
// 静的コンテンツ
const data = await fetchData();
---

<!-- 静的HTML -->
<section>
  <h1>{data.title}</h1>
  <p>{data.description}</p>
</section>

<!-- 動的コンポーネント（必要時のみ水和） -->
<ContactForm client:idle />
<HeroSection client:visible />
```

### 画像最適化

#### 画像フォーマット
- **WebP**: モダンブラウザ対応
- **AVIF**: 最新ブラウザ（Chrome 85+）
- **JPEG/PNG**: フォールバック

#### レスポンシブ画像
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero image"
  width={800}
  height={400}
  format="webp"
  quality={80}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

#### 画像最適化ベストプラクティス
```typescript
// 画像の遅延読み込み
const ImageOptimization = {
  // 品質設定
  quality: {
    hero: 90,        // ヒーロー画像は高品質
    content: 80,     // コンテンツ画像は標準
    thumbnail: 70    // サムネイルは軽量
  },

  // レスポンシブブレークポイント
  sizes: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 80vw',
    desktop: '1200px'
  }
};
```

## フロントエンド最適化

### コード分割 (Code Splitting)

#### 動的インポート
```typescript
// 大きなライブラリの遅延読み込み
const ChartComponent = lazy(() => import('./ChartComponent'));

// 条件付き読み込み
const loadAnalytics = async () => {
  if (process.env.NODE_ENV === 'production') {
    const { initAnalytics } = await import('./analytics');
    initAnalytics();
  }
};
```

#### ルートレベル分割
```typescript
// pages/features/charts.astro
---
// 重いライブラリは該当ページでのみ読み込み
const { Chart } = await import('chart.js');
---
```

### JavaScript最適化

#### バンドルサイズ削減
```typescript
// ✅ 必要な機能のみインポート
import { debounce } from 'lodash/debounce';

// ❌ ライブラリ全体をインポート
import _ from 'lodash';

// ✅ Tree shaking対応
export { validateEmail, formatDate } from './utils';

// ❌ デフォルトエクスポート（Tree shakingが困難）
export default { validateEmail, formatDate };
```

#### 実行時最適化
```typescript
// メモ化によるレンダリング最適化
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyComputation(item)
    }));
  }, [data]);

  return <div>{processedData.map(renderItem)}</div>;
});

// コールバック最適化
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### CSS最適化

#### Tailwind CSS最適化
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      // カスタムカラーを最小限に
      colors: {
        primary: '#234ad9',
        'primary-dark': '#1e3eb8',
      }
    }
  },
  // 未使用スタイルの削除
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  }
};
```

#### クリティカルCSS
```astro
---
// 重要なスタイルの優先読み込み
const criticalCSS = `
  .hero { display: flex; align-items: center; min-height: 100vh; }
  .nav { position: fixed; top: 0; width: 100%; z-index: 50; }
`;
---

<style set:html={criticalCSS}></style>
```

## ネットワーク最適化

### リソース読み込み戦略

#### プリロード
```astro
<head>
  <!-- クリティカルリソースのプリロード -->
  <link rel="preload" href="/fonts/alliance-no2-regular.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- 重要画像のプリロード -->
  <link rel="preload" href="/hero-image.webp" as="image">
  
  <!-- 次ページのプリフェッチ -->
  <link rel="prefetch" href="/contact">
</head>
```

#### Service Worker
```typescript
// service-worker.ts
const CACHE_NAME = 'deephand-v1';
const STATIC_ASSETS = [
  '/',
  '/css/main.css',
  '/js/main.js',
  '/fonts/alliance-no2-regular.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### CDN活用
- 静的アセットのCDN配信
- 画像最適化サービスの使用
- エッジキャッシュの活用

## ビルド最適化

### Vite設定
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    // チャンク分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', '@radix-ui/react-slot'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    },
    
    // 圧縮設定
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 本番環境でconsole.log削除
        drop_debugger: true
      }
    },
    
    // ソースマップ
    sourcemap: false // 本番環境では無効化
  },
  
  // 開発時の最適化
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion']
  }
});
```

### Astroビルド最適化
```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    build: {
      cssCodeSplit: true, // CSS分割
      assetsInlineLimit: 4096 // 4KB以下のアセットをインライン化
    }
  },
  
  // 圧縮設定
  compressHTML: true,
  
  // プリフェッチ設定
  prefetch: {
    prefetchAll: false, // 必要な場合のみプリフェッチ
    defaultStrategy: 'hover'
  }
});
```

## パフォーマンス監視

### Core Web Vitals測定
```typescript
// Web Vitals監視
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // アナリティクスサービスに送信
  console.log('Performance metric:', metric);
}

// Core Web Vitals測定
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### パフォーマンス予算
```javascript
// performance-budget.js
export const performanceBudget = {
  // ファイルサイズ制限
  'dist/**/*.js': '250kb',
  'dist/**/*.css': '50kb',
  'dist/**/*.jpg': '200kb',
  'dist/**/*.png': '200kb',
  
  // ネットワーク制限
  requests: 50,
  totalSize: '2mb',
  
  // タイミング制限
  firstPaint: 1500,
  firstContentfulPaint: 2000,
  speedIndex: 3000
};
```

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.js'
```

## モバイル最適化

### レスポンシブデザイン
```css
/* モバイルファーストアプローチ */
.hero {
  @apply py-8 px-4; /* モバイル */
  @apply md:py-16 md:px-8; /* タブレット */
  @apply lg:py-24 lg:px-12; /* デスクトップ */
}

/* タッチターゲット最適化 */
.button {
  @apply min-h-12 min-w-12; /* 最小44px推奨 */
  @apply touch-manipulation; /* タッチ最適化 */
}
```

### デバイス固有最適化
```typescript
// デバイス検出とパフォーマンス調整
const DeviceOptimization = {
  isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isLowEndDevice: navigator.hardwareConcurrency <= 2,
  
  getOptimizedSettings() {
    return {
      animationReducedMotion: this.isLowEndDevice,
      imageQuality: this.isMobile ? 70 : 80,
      particleCount: this.isLowEndDevice ? 50 : 100
    };
  }
};
```

## サードパーティスクリプト最適化

### 遅延読み込み
```astro
---
// アナリティクスの遅延読み込み
---

<script>
  // ページ読み込み完了後にアナリティクス初期化
  window.addEventListener('load', () => {
    setTimeout(() => {
      import('./analytics.js').then(({ initAnalytics }) => {
        initAnalytics();
      });
    }, 2000);
  });
</script>
```

### 自己ホスティング
```typescript
// Google Fontsの自己ホスティング
const fonts = {
  alliance: {
    400: '/fonts/alliance-no2-regular.woff2',
    500: '/fonts/alliance-no2-medium.woff2',
    600: '/fonts/alliance-no2-semibold.woff2'
  }
};

// フォントプリロード
const preloadFonts = () => {
  Object.values(fonts.alliance).forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
```

## データベース・API最適化

### APIレスポンス最適化
```typescript
// APIレスポンスの最適化
export async function POST({ request }: APIContext) {
  try {
    const data = await request.json();
    
    // データ検証を効率的に実行
    const validation = validateQuickly(data);
    if (!validation.isValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation failed'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 非同期処理の並列実行
    const [emailResult, logResult] = await Promise.all([
      sendEmail(data),
      logActivity(data)
    ]);
    
    return new Response(JSON.stringify({
      success: true,
      messageId: emailResult.messageId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), { status: 500 });
  }
}
```

### キャッシュ戦略
```typescript
// インメモリキャッシュ
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5分

export function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCachedData(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}
```

## パフォーマンステスト

### 定期的な監視
```bash
# Lighthouse監査
npm install -g lighthouse
lighthouse https://deephand.example.com --output json --output-path ./lighthouse-report.json

# WebPageTest
npm install -g webpagetest
webpagetest test https://deephand.example.com

# Bundle Analyzer
npx webpack-bundle-analyzer dist/static/js/*.js
```

### 自動化されたテスト
```javascript
// performance.test.js
describe('Performance Tests', () => {
  it('should load homepage within performance budget', async () => {
    const metrics = await measurePageMetrics('/');
    
    expect(metrics.lcp).toBeLessThan(2500);
    expect(metrics.fid).toBeLessThan(100);
    expect(metrics.cls).toBeLessThan(0.1);
  });
  
  it('should have optimal bundle sizes', () => {
    const bundleStats = getBundleStats();
    
    expect(bundleStats.mainBundle).toBeLessThan(250 * 1024); // 250KB
    expect(bundleStats.vendorBundle).toBeLessThan(500 * 1024); // 500KB
  });
});
```

## 継続的最適化

### 月次レビュー項目
1. **Core Web Vitals分析**
2. **バンドルサイズの変化**
3. **新しい最適化技術の調査**
4. **依存関係の更新とパフォーマンス影響**
5. **ユーザーフィードバックの分析**

### 最適化ロードマップ
- **Q1**: Service Worker実装
- **Q2**: 画像最適化の自動化
- **Q3**: エッジコンピューティング導入
- **Q4**: パフォーマンス予算の厳格化

---

このガイドラインに従って、継続的なパフォーマンス向上を目指し、ユーザー体験の最適化を図ってください。新しい最適化技術や手法については、チーム内で共有し、ガイドラインの更新を行ってください。