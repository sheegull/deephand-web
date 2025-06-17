/**
 * Hydrationエラー修正の検証テストスイート
 * 
 * 修正内容:
 * 1. site.webmanifest作成とlink追加
 * 2. window.*の呼び出しをuseEffect内の安全な関数に置換
 * 3. Date.now()をisClient条件付きに変更
 * 4. Reactコンポーネントのハイドレーション安全性確保
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Hydration Fix Verification - TDD Tests', () => {
  
  describe('1. Webmanifest Fix Verification', () => {
    it('should have site.webmanifest file created', () => {
      const manifestPath = join(process.cwd(), 'public/site.webmanifest');
      
      expect(existsSync(manifestPath)).toBe(true);
      
      if (existsSync(manifestPath)) {
        const manifestContent = readFileSync(manifestPath, 'utf8');
        const manifest = JSON.parse(manifestContent);
        
        // Should have proper PWA structure
        expect(manifest.name).toContain('DeepHand');
        expect(manifest.theme_color).toBe('#234ad9');
        expect(manifest.background_color).toBe('#1e1e1e');
        expect(manifest.icons).toBeInstanceOf(Array);
      }
    });

    it('should have manifest link in Layout.astro', () => {
      const layoutPath = join(process.cwd(), 'src/layouts/Layout.astro');
      
      if (existsSync(layoutPath)) {
        const layoutContent = readFileSync(layoutPath, 'utf8');
        
        // Should have manifest link
        expect(layoutContent).toContain('<link rel="manifest" href="/site.webmanifest" />');
      }
    });
  });

  describe('2. HeroSection Hydration Safety', () => {
    it('should have hydration-safe client detection', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have isClient state
        expect(heroContent).toContain('const [isClient, setIsClient]');
        
        // Should use useEffect for client detection
        expect(heroContent).toMatch(/useEffect\(\(\)\s*=>\s*{\s*setIsClient\(true\)/);
        
        // Should have client-safe navigation function
        expect(heroContent).toContain('const handleNavigation = (url: string)');
        expect(heroContent).toMatch(/if\s*\(\s*isClient.*typeof window/);
      }
    });

    it('should use safe navigation handlers', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should not have direct window.location calls
        expect(heroContent).not.toMatch(/onClick.*=.*window\.location/);
        
        // Should use handleNavigation function
        expect(heroContent).toContain('handleNavigation(\'/\')');
        expect(heroContent).toContain('handleNavigation(\'/request\')');
        
        // Should have handleReload function
        expect(heroContent).toContain('handleReload()');
      }
    });

    it('should have conditional Date.now() usage', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should use conditional Date.now()
        expect(heroContent).toMatch(/timestamp:\s*isClient\s*\?\s*Date\.now\(\)\s*:\s*0/);
        
        // Should not have direct Date.now() calls
        expect(heroContent).not.toMatch(/timestamp:\s*Date\.now\(\)/);
      }
    });
  });

  describe('3. RequestDataPage Hydration Safety', () => {
    it('should have hydration-safe client detection', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have isClient state
        expect(requestContent).toContain('const [isClient, setIsClient]');
        
        // Should use useEffect for client detection
        expect(requestContent).toMatch(/useEffect\(\(\)\s*=>\s*{\s*setIsClient\(true\)/);
        
        // Should have client-safe navigation function
        expect(requestContent).toContain('const handleNavigation = (url: string)');
      }
    });

    it('should use safe navigation handlers', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Should not have direct window.location calls
        expect(requestContent).not.toMatch(/onClick.*=.*window\.location/);
        
        // Should use handleNavigation function
        expect(requestContent).toContain('handleNavigation(\'/\')');
      }
    });

    it('should have conditional Date.now() usage', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Should use conditional Date.now()
        expect(requestContent).toMatch(/timestamp:\s*isClient\s*\?\s*Date\.now\(\)\s*:\s*0/);
        
        // Should not have direct Date.now() calls
        expect(requestContent).not.toMatch(/timestamp:\s*Date\.now\(\)/);
      }
    });
  });

  describe('4. Component Consistency Verification', () => {
    it('should have consistent hydration patterns across components', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(heroSectionPath) && existsSync(requestPagePath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Both should have isClient state management
        expect(heroContent).toContain('setIsClient(true)');
        expect(requestContent).toContain('setIsClient(true)');
        
        // Both should have handleNavigation function
        expect(heroContent).toContain('handleNavigation');
        expect(requestContent).toContain('handleNavigation');
        
        // Both should use conditional timestamps
        expect(heroContent).toMatch(/isClient\s*\?\s*Date\.now\(\)/);
        expect(requestContent).toMatch(/isClient\s*\?\s*Date\.now\(\)/);
      }
    });
  });

  describe('5. React Best Practices Compliance', () => {
    it('should properly handle useEffect dependencies', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      [heroSectionPath, requestPagePath].forEach(componentPath => {
        if (existsSync(componentPath)) {
          const componentContent = readFileSync(componentPath, 'utf8');
          
          // Should have empty dependency array for client detection
          expect(componentContent).toMatch(/useEffect\(\(\)\s*=>\s*{\s*setIsClient\(true\).*},\s*\[\]\)/);
        }
      });
    });

    it('should avoid hydration-unsafe operations', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      [heroSectionPath, requestPagePath].forEach(componentPath => {
        if (existsSync(componentPath)) {
          const componentContent = readFileSync(componentPath, 'utf8');
          
          // Should not have direct browser API calls in render
          expect(componentContent).not.toMatch(/Math\.random\(\)/);
          expect(componentContent).not.toMatch(/Date\.now\(\)(?!.*isClient)/);
          
          // Window access should be protected
          expect(componentContent).not.toMatch(/window\.(?!location\.href.*handleNavigation)/);
        }
      });
    });
  });
});