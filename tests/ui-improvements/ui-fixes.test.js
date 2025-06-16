/**
 * UI修正のためのTDDテストスイート
 * 
 * 1. Allianceフォントの反映
 * 2. ボタンカラーの青色統一
 * 3. フォームヘルプテキストの白色化
 * 4. データリクエストボタンアニメーション修正
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('UI Improvements - TDD Tests', () => {
  
  describe('1. Alliance Font Implementation', () => {
    it('should have proper font-face declarations in CSS', () => {
      const globalCssPath = join(process.cwd(), 'src/styles/global.css');
      
      if (existsSync(globalCssPath)) {
        const cssContent = readFileSync(globalCssPath, 'utf8');
        expect(cssContent).toContain('@font-face');
        expect(cssContent).toContain('Alliance');
        expect(cssContent).toContain('font-family');
      } else {
        // Test will initially fail - we need to create proper font loading
        expect(existsSync(globalCssPath)).toBe(true);
      }
    });

    it('should have font preload in HTML head', () => {
      const layoutPath = join(process.cwd(), 'src/layouts/Layout.astro');
      
      if (existsSync(layoutPath)) {
        const layoutContent = readFileSync(layoutPath, 'utf8');
        expect(layoutContent).toContain('<link rel="preload"');
        expect(layoutContent).toContain('Alliance');
        expect(layoutContent).toContain('font/woff2');
      } else {
        expect(existsSync(layoutPath)).toBe(true);
      }
    });

    it('should apply Alliance font to components', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        expect(heroContent).toContain('font-alliance');
      }
    });
  });

  describe('2. Button Color Standardization', () => {
    it('should use solid blue color instead of gradient', () => {
      const buttonPath = join(process.cwd(), 'src/components/ui/button.tsx');
      const buttonContent = readFileSync(buttonPath, 'utf8');
      
      // Should NOT contain gradient
      expect(buttonContent).not.toContain('bg-gradient-to-r');
      expect(buttonContent).not.toContain('from-primary');
      expect(buttonContent).not.toContain('to-primary-dark');
      
      // Should contain solid blue color
      expect(buttonContent).toContain('bg-[#234ad9]');
      expect(buttonContent).toContain('hover:bg-[#1e3eb8]');
    });

    it('should apply consistent blue styling across button variants', () => {
      const buttonPath = join(process.cwd(), 'src/components/ui/button.tsx');
      const buttonContent = readFileSync(buttonPath, 'utf8');
      
      // Primary variant should use solid blue
      expect(buttonContent).toContain('primary:');
      expect(buttonContent).toContain('bg-[#234ad9]');
    });
  });

  describe('3. Form Help Text Color', () => {
    it('should have white color for contact form help text', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Check for white text color in CardDescription using contact.subtitle
        expect(heroContent).toMatch(/CardDescription.*text-white.*contact\.subtitle/s);
      }
    });

    it('should maintain white color for both Japanese and English text', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should apply white color to help text areas
        expect(heroContent).toContain('text-white');
      }
    });
  });

  describe('4. Data Request Button Animation', () => {
    it('should have proper animation properties', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have proper Framer Motion properties
        expect(heroContent).toContain('whileHover');
        expect(heroContent).toContain('whileTap');
        expect(heroContent).toContain('transition');
      }
    });

    it('should have consistent scale and transform values', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have reasonable scale values (not extreme)
        expect(heroContent).toMatch(/scale:\s*[01]\.\d+/);
      }
    });
  });

  describe('Overall UI Consistency', () => {
    it('should maintain consistent design system', () => {
      const buttonPath = join(process.cwd(), 'src/components/ui/button.tsx');
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      const buttonContent = readFileSync(buttonPath, 'utf8');
      const heroContent = readFileSync(heroPath, 'utf8');
      
      // Both should use the same blue color
      expect(buttonContent).toContain('#234ad9');
      expect(heroContent).toContain('#234ad9');
    });

    it('should have proper contrast ratios', () => {
      // White text on blue background should have good contrast
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const heroContent = readFileSync(heroPath, 'utf8');
      
      // Should have white text on colored backgrounds
      expect(heroContent).toMatch(/bg-\[#234ad9\].*text-white|text-white.*bg-\[#234ad9\]/);
    });
  });
});