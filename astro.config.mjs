// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://deephand.ai',
  integrations: [react()],
  output: 'static',
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
