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
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  vite: {
    // plugins: [
    //   messageChannelPolyfillPlugin(),
    // ],
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
});
