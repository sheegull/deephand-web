// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import { messageChannelPolyfillPlugin } from './vite-polyfill-plugin.js';

// SSRポリフィルを事前に読み込み（React 19 + Cloudflare Workers互換性）
import './src/utils/ssr-polyfills.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://deephandai.com',
  integrations: [react()],
  output: 'server',
  adapter: cloudflare({
    mode: 'advanced'
  }),
  // Cloudflare対応画像設定 (Astro 5.x)
  image: {
    service: {
      entrypoint: 'astro/assets/services/noop',
      config: {}
    }
  },
  vite: {
    // plugins: [
    //   messageChannelPolyfillPlugin(),
    // ],
    // Cloudflare Pages SSR環境変数設定
    define: {
      'import.meta.env.RESEND_API_KEY': JSON.stringify(process.env.RESEND_API_KEY || ''),
      'import.meta.env.PUBLIC_SITE_URL': JSON.stringify(process.env.PUBLIC_SITE_URL || 'https://deephandai.com'),
      'import.meta.env.ADMIN_EMAIL': JSON.stringify(process.env.ADMIN_EMAIL || 'contact@deephandai.com'),
      'import.meta.env.FROM_EMAIL': JSON.stringify(process.env.FROM_EMAIL || 'contact@deephandai.com'),
      'import.meta.env.NOREPLY_EMAIL': JSON.stringify(process.env.NOREPLY_EMAIL || 'noreply@deephandai.com'),
      'import.meta.env.REQUESTS_EMAIL': JSON.stringify(process.env.REQUESTS_EMAIL || 'requests@deephandai.com'),
      'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    },
    css: {
      postcss: './postcss.config.js',
    },
    build: {
      chunkSizeWarningLimit: 600, // Three.jsチャンクを考慮して警告制限を調整
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React libraries (small, essential)
            vendor: ['react', 'react-dom'],
            
            // Form handling libraries (medium size)
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            
            // UI components (lightweight)
            ui: ['lucide-react', '@radix-ui/react-slot', 'class-variance-authority'],
            
            // Three.js and heavy 3D dependencies (large, lazy-loaded)
            three: ['three', 'ogl', '@react-three/fiber', '@react-three/postprocessing', 'postprocessing'],
            
            // Animation libraries (medium size, conditionally loaded)
            animation: ['framer-motion'],
            
            // Internationalization (medium size)
            i18n: ['i18next', 'react-i18next'],
            
            // Communication and utilities (small)
            utils: ['resend', 'clsx']
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-hook-form', 'lucide-react'],
    },
  },
  compressHTML: true,
  // 開発環境最適化
  server: {
    host: true,
    port: 4321
  },
  // Astro 5.x最適化設定
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  }
});
