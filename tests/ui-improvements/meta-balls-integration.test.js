/**
 * Meta Balls アニメーション統合のTDDテストスイート
 * 
 * /requestページの左側黒背景箇所へのMeta Balls配置
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Meta Balls Integration - TDD Tests', () => {
  
  describe('1. OGL Library Dependency', () => {
    it('should have ogl library installed', () => {
      const packagePath = join(process.cwd(), 'package.json');
      
      if (existsSync(packagePath)) {
        const packageContent = readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        // Should have ogl dependency
        const hasDependency = 
          packageJson.dependencies?.ogl || 
          packageJson.devDependencies?.ogl;
        
        expect(hasDependency).toBeTruthy();
      }
    });
  });

  describe('2. MetaBalls Component Implementation', () => {
    it('should have MetaBalls component file', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      expect(existsSync(metaBallsPath)).toBe(true);
    });

    it('should have proper MetaBalls component structure', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should import required dependencies
        expect(componentContent).toContain('import React');
        expect(componentContent).toContain('from "ogl"');
        
        // Should have proper TypeScript interface
        expect(componentContent).toMatch(/type MetaBallsProps.*=/);
        
        // Should export default MetaBalls component
        expect(componentContent).toContain('export default MetaBalls');
        
        // Should have WebGL renderer setup
        expect(componentContent).toContain('new Renderer');
        expect(componentContent).toContain('new Program');
        
        // Should have proper vertex and fragment shaders
        expect(componentContent).toContain('vertex');
        expect(componentContent).toContain('fragment');
      }
    });

    it('should have proper props configuration for dark theme', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should have color prop configuration
        expect(componentContent).toMatch(/color\?:\s*string/);
        expect(componentContent).toMatch(/cursorBallColor\?:\s*string/);
        
        // Should have animation configuration
        expect(componentContent).toMatch(/speed\?:\s*number/);
        expect(componentContent).toMatch(/ballCount\?:\s*number/);
        expect(componentContent).toMatch(/animationSize\?:\s*number/);
        
        // Should have interaction configuration
        expect(componentContent).toMatch(/enableMouseInteraction\?:\s*boolean/);
        expect(componentContent).toMatch(/enableTransparency\?:\s*boolean/);
      }
    });
  });

  describe('3. RequestDataPage Integration', () => {
    it('should import MetaBalls component', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should import MetaBalls component
        expect(pageContent).toMatch(/import.*MetaBalls.*from/);
      }
    });

    it('should place MetaBalls in left side center area', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have MetaBalls component in the layout
        expect(pageContent).toContain('<MetaBalls');
        
        // Should be positioned in the left side spacer area
        expect(pageContent).toMatch(/flex-1.*MetaBalls|MetaBalls.*flex-1/s);
        
        // Should have proper container styling
        expect(pageContent).toMatch(/absolute.*inset-0.*MetaBalls|MetaBalls.*absolute.*inset-0/s);
      }
    });

    it('should have proper responsive design for MetaBalls', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should be hidden on mobile (only shown on desktop)
        expect(pageContent).toMatch(/hidden.*md:.*MetaBalls|MetaBalls.*hidden.*md:/s);
      }
    });
  });

  describe('4. MetaBalls Configuration for Dark Theme', () => {
    it('should have dark theme appropriate colors', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should use appropriate colors for dark background
        expect(pageContent).toMatch(/color.*=.*["']#[a-fA-F0-9]{6}["']/);
        expect(pageContent).toMatch(/cursorBallColor.*=.*["']#[a-fA-F0-9]{6}["']/);
      }
    });

    it('should have performance optimized settings', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have reasonable performance settings
        expect(pageContent).toMatch(/ballCount.*=.*\d+/);
        expect(pageContent).toMatch(/speed.*=.*\d*\.?\d+/);
        expect(pageContent).toMatch(/animationSize.*=.*\d+/);
      }
    });
  });

  describe('5. WebGL Canvas Styling', () => {
    it('should have proper canvas container styling', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should have proper container div with styling
        expect(componentContent).toMatch(/div.*ref=\{containerRef\}.*className/);
        expect(componentContent).toMatch(/w-full.*h-full/);
        
        // Should handle canvas responsiveness
        expect(componentContent).toContain('resize');
        expect(componentContent).toContain('addEventListener');
      }
    });

    it('should have proper WebGL context setup', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should setup WebGL context properly
        expect(componentContent).toContain('gl.clearColor');
        expect(componentContent).toMatch(/alpha:\s*true/);
        expect(componentContent).toMatch(/premultipliedAlpha:\s*false/);
      }
    });
  });

  describe('6. Animation Performance', () => {
    it('should have proper cleanup on unmount', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should cleanup animation frame
        expect(componentContent).toContain('cancelAnimationFrame');
        
        // Should cleanup event listeners
        expect(componentContent).toContain('removeEventListener');
        
        // Should cleanup WebGL context
        expect(componentContent).toMatch(/loseContext|getExtension.*WEBGL_lose_context/);
      }
    });

    it('should have proper mouse interaction handling', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should handle mouse events
        expect(componentContent).toMatch(/pointermove|mousemove/);
        expect(componentContent).toMatch(/pointerenter|mouseenter/);
        expect(componentContent).toMatch(/pointerleave|mouseleave/);
        
        // Should have smooth interpolation
        expect(componentContent).toContain('hoverSmoothness');
      }
    });
  });

  describe('7. Layout Integration Tests', () => {
    it('should not interfere with form functionality', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should maintain existing form structure
        expect(pageContent).toContain('onSubmit');
        expect(pageContent).toContain('currentStep');
        expect(pageContent).toContain('setIsSubmitting');
        
        // MetaBalls should not interfere with form layout
        expect(pageContent).toMatch(/Right side with form.*w-full md:w-1\/2/s);
      }
    });

    it('should maintain responsive design', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should maintain mobile layout
        expect(pageContent).toContain('md:flex-row');
        expect(pageContent).toMatch(/hidden.*md:flex/);
        
        // Should maintain desktop layout
        expect(pageContent).toMatch(/md:w-1\/2/);
      }
    });
  });

  describe('8. Performance and Accessibility', () => {
    it('should have proper z-index layering', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // MetaBalls should be behind interactive elements
        expect(pageContent).toMatch(/z-\[?-?\d+\]?.*MetaBalls|MetaBalls.*z-\[?-?\d+\]?/s);
      }
    });

    it('should not affect page load performance', () => {
      const metaBallsPath = join(process.cwd(), 'src/components/ui/MetaBalls.tsx');
      
      if (existsSync(metaBallsPath)) {
        const componentContent = readFileSync(metaBallsPath, 'utf8');
        
        // Should use React.lazy or similar for code splitting (optional)
        // Or at least have proper useEffect cleanup
        expect(componentContent).toContain('useEffect');
        expect(componentContent).toMatch(/return.*=>/);
      }
    });
  });
});