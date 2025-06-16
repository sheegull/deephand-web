/**
 * Phase 2 UI修正のためのTDDテストスイート
 * 
 * 1. AllianceNo2フォントの適切な実装
 * 2. データリクエストボタンアニメーション簡素化
 * 3. トップページフォームカラー調整
 * 4. 問い合わせフォーム機能テスト
 * 5. 言語切り替えボタンアイコン追加
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('UI Improvements Phase 2 - TDD Tests', () => {
  
  describe('1. AllianceNo2 Font Implementation', () => {
    it('should reference TTF files from public/fonts instead of non-existent woff files', () => {
      const globalCssPath = join(process.cwd(), 'src/styles/global.css');
      
      if (existsSync(globalCssPath)) {
        const cssContent = readFileSync(globalCssPath, 'utf8');
        
        // Should reference TTF files from public/fonts
        expect(cssContent).toContain('url(\'/fonts/AllianceNo2-Light.ttf\')');
        expect(cssContent).toContain('url(\'/fonts/AllianceNo2-Regular.ttf\')');
        expect(cssContent).toContain('url(\'/fonts/AllianceNo2-Medium.ttf\')');
        expect(cssContent).toContain('url(\'/fonts/AllianceNo2-SemiBold.ttf\')');
        expect(cssContent).toContain('url(\'/fonts/AllianceNo2-Bold.ttf\')');
        
        // Should NOT reference non-existent woff/woff2 files
        expect(cssContent).not.toContain('AllianceFontFamily');
        expect(cssContent).not.toContain('.woff2');
        expect(cssContent).not.toContain('.woff');
      }
    });

    it('should have proper font preload links for TTF files', () => {
      const layoutPath = join(process.cwd(), 'src/layouts/Layout.astro');
      
      if (existsSync(layoutPath)) {
        const layoutContent = readFileSync(layoutPath, 'utf8');
        
        // Should preload TTF files
        expect(layoutContent).toMatch(/<link rel="preload".*AllianceNo2.*\.ttf.*as="font"/);
      }
    });
  });

  describe('2. Data Request Button Animation Simplification', () => {
    it('should have only one level of animation (no nested animations)', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have motion.div for data request button
        expect(heroContent).toContain('whileHover');
        expect(heroContent).toContain('whileTap');
        
        // Main data request button should be simplified (not wrapped in motion.div)
        const mainRequestButtonMatch = heroContent.match(/hero\.requestButton.*?Button>/s);
        if (mainRequestButtonMatch) {
          const buttonSection = mainRequestButtonMatch[0];
          // Main request button should not be wrapped in motion.div
          expect(buttonSection).not.toContain('motion.div');
        }
      }
    });

    it('should have simplified animation values', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have reasonable scale values (not extreme)
        expect(heroContent).toMatch(/scale:\s*1\.0[0-9]/);
        expect(heroContent).toMatch(/scale:\s*0\.9[0-9]/);
      }
    });
  });

  describe('3. Contact Form Color Adjustment', () => {
    it('should have better integrated colors for form elements', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Form card should have better integrated background
        expect(heroContent).toMatch(/Card.*bg-\[#[0-9a-fA-F]{6}\]/);
        
        // Input fields should have consistent dark theme
        expect(heroContent).toMatch(/className=".*!bg-\[#[0-9a-fA-F]{6}\]/);
        
        // Should have consistent border colors
        expect(heroContent).toMatch(/border-gray-[0-9]{3}/);
      }
    });

    it('should maintain proper contrast ratios', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have white text on dark backgrounds
        expect(heroContent).toMatch(/text-white.*bg-\[#[0-9a-fA-F]{6}\]/);
      }
    });
  });

  describe('4. Contact Form Functionality', () => {
    it('should have proper API endpoint file', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      expect(existsSync(contactApiPath)).toBe(true);
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should export POST handler
        expect(apiContent).toContain('export');
        expect(apiContent).toContain('POST');
        
        // Should handle request properly
        expect(apiContent).toMatch(/request|Request/);
      }
    });

    it('should have proper form submission logic in frontend', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have onSubmit handler
        expect(heroContent).toContain('onSubmit');
        expect(heroContent).toContain('fetch');
        expect(heroContent).toContain('/api/contact');
        
        // Should handle response properly
        expect(heroContent).toContain('response.ok');
        expect(heroContent).toContain('setSubmitStatus');
      }
    });
  });

  describe('5. Language Toggle Button with Icon', () => {
    it('should have globe or language icon', () => {
      const languageTogglePath = join(process.cwd(), 'src/components/ui/language-toggle.tsx');
      
      if (existsSync(languageTogglePath)) {
        const toggleContent = readFileSync(languageTogglePath, 'utf8');
        
        // Should import an icon (Globe, Languages, etc.)
        expect(toggleContent).toMatch(/import.*Globe|Languages|World/);
        
        // Should render the icon
        expect(toggleContent).toMatch(/<Globe|<Languages|<World/);
      }
    });

    it('should have icon positioned before text', () => {
      const languageTogglePath = join(process.cwd(), 'src/components/ui/language-toggle.tsx');
      
      if (existsSync(languageTogglePath)) {
        const toggleContent = readFileSync(languageTogglePath, 'utf8');
        
        // Should have flex layout with icon and text
        expect(toggleContent).toMatch(/flex.*items-center|items-center.*flex/);
        expect(toggleContent).toMatch(/gap-[0-9]/);
      }
    });

    it('should maintain proper button sizing with icon', () => {
      const languageTogglePath = join(process.cwd(), 'src/components/ui/language-toggle.tsx');
      
      if (existsSync(languageTogglePath)) {
        const toggleContent = readFileSync(languageTogglePath, 'utf8');
        
        // Should have updated width to accommodate icon
        expect(toggleContent).toMatch(/w-1[0-9]|w-[2-9][0-9]/);
      }
    });
  });

  describe('Overall Integration Tests', () => {
    it('should maintain consistent design system', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const buttonPath = join(process.cwd(), 'src/components/ui/button.tsx');
      
      if (existsSync(heroPath) && existsSync(buttonPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        const buttonContent = readFileSync(buttonPath, 'utf8');
        
        // Should use consistent color scheme
        expect(heroContent).toContain('#234ad9');
        expect(buttonContent).toContain('#234ad9');
      }
    });

    it('should have proper accessibility attributes', () => {
      const languageTogglePath = join(process.cwd(), 'src/components/ui/language-toggle.tsx');
      
      if (existsSync(languageTogglePath)) {
        const toggleContent = readFileSync(languageTogglePath, 'utf8');
        
        // Should have proper aria-label or title
        expect(toggleContent).toMatch(/aria-label|title=/);
      }
    });
  });
});