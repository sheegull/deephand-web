/**
 * Hydrationエラーとwebmanifest問題のTDD分析テストスイート
 * 
 * 問題: 
 * 1. SSR/CSR間でi18nテキストが不一致 (Solutions vs ソリューション)
 * 2. site.webmanifest 404エラー
 * 3. Reactコンポーネントのハイドレーション失敗
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Hydration Errors Analysis - TDD Tests', () => {
  
  describe('1. Webmanifest File Issues', () => {
    it('should check if site.webmanifest exists', () => {
      const manifestPath = join(process.cwd(), 'public/site.webmanifest');
      
      // Should exist in public directory
      expect(existsSync(manifestPath)).toBe(true);
    });

    it('should have proper manifest link in HTML', () => {
      const layoutPath = join(process.cwd(), 'src/layouts/Layout.astro');
      
      if (existsSync(layoutPath)) {
        const layoutContent = readFileSync(layoutPath, 'utf8');
        
        // Should have manifest link
        expect(layoutContent).toMatch(/<link.*rel="manifest".*href=".*manifest"/);
      }
    });
  });

  describe('2. I18n SSR/CSR Synchronization', () => {
    it('should check HeroSection i18n implementation', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should use i18n translation function
        expect(heroContent).toContain("t('nav.solutions')");
        
        // Should not have hardcoded text
        expect(heroContent).not.toMatch(/Solutions['"]/);
        expect(heroContent).not.toMatch(/ソリューション['"]/);
      }
    });

    it('should verify i18n initialization timing', () => {
      const i18nPath = join(process.cwd(), 'src/lib/i18n.ts');
      
      if (existsSync(i18nPath)) {
        const i18nContent = readFileSync(i18nPath, 'utf8');
        
        // Should handle SSR/CSR language detection
        expect(i18nContent).toMatch(/typeof.*window|navigator\.language/);
        
        // Should have fallback language
        expect(i18nContent).toMatch(/fallback.*ja|en/);
      }
    });

    it('should check for client-only hydration components', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should avoid client-specific code in SSR
        expect(heroContent).not.toMatch(/typeof window !== ['"]undefined['"]/);
        expect(heroContent).not.toMatch(/window\./);
        expect(heroContent).not.toMatch(/document\./);
      }
    });
  });

  describe('3. Component Hydration Safety', () => {
    it('should verify useState initialization consistency', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have consistent initial state
        expect(heroContent).toMatch(/useState\(/);
        
        // Should not use random or time-based initial values
        expect(heroContent).not.toMatch(/Date\.now\(\)|Math\.random\(\)/);
      }
    });

    it('should check for proper useEffect usage', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should use useEffect for client-side operations
        expect(heroContent).toMatch(/useEffect\(/);
        
        // Should handle hydration properly
        expect(heroContent).not.toMatch(/useLayoutEffect/);
      }
    });
  });

  describe('4. Language Detection and Setting', () => {
    it('should have proper language state management', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should manage language state
        expect(heroContent).toMatch(/language.*useState|currentLanguage/);
        
        // Should have language toggle functionality
        expect(heroContent).toMatch(/setLanguage|toggleLanguage/);
      }
    });

    it('should verify initial language detection consistency', () => {
      const i18nPath = join(process.cwd(), 'src/lib/i18n.ts');
      
      if (existsSync(i18nPath)) {
        const i18nContent = readFileSync(i18nPath, 'utf8');
        
        // Should have deterministic initial language
        expect(i18nContent).not.toMatch(/navigator\.language.*direct/);
        
        // Should provide stable default
        expect(i18nContent).toMatch(/default.*ja|en/);
      }
    });
  });

  describe('5. Astro SSR Configuration', () => {
    it('should verify proper output mode for hydration', () => {
      const astroConfigPath = join(process.cwd(), 'astro.config.mjs');
      
      if (existsSync(astroConfigPath)) {
        const configContent = readFileSync(astroConfigPath, 'utf8');
        
        // Should use server mode for proper SSR
        expect(configContent).toContain("output: 'server'");
        
        // Should have React integration
        expect(configContent).toContain('@astrojs/react');
      }
    });

    it('should check client:load directives usage', () => {
      const indexPath = join(process.cwd(), 'src/pages/index.astro');
      
      if (existsSync(indexPath)) {
        const indexContent = readFileSync(indexPath, 'utf8');
        
        // Should use appropriate client directive
        expect(indexContent).toMatch(/client:(load|idle|visible)/);
      }
    });
  });
});