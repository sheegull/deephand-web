// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://deephand.ai',
  integrations: [react()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
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
