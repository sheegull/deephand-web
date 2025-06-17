// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

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
    css: {
      postcss: './postcss.config.js',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            ui: ['lucide-react', '@radix-ui/react-slot', 'class-variance-authority'],
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
