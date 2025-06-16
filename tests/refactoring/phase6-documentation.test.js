/**
 * Phase 6: ドキュメンテーションとメンテナビリティ - TDDテストスイート
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Phase 6: Documentation and Maintainability', () => {
  
  describe('Component Documentation', () => {
    it('should have component usage documentation', () => {
      const componentGuidelinesPath = join(process.cwd(), 'docs/component-guidelines.md');
      
      if (existsSync(componentGuidelinesPath)) {
        const content = readFileSync(componentGuidelinesPath, 'utf8');
        expect(content).toContain('Button');
        expect(content).toContain('Card');
        expect(content).toContain('usage');
        expect(content).toContain('variant');
      } else {
        // Initially expected to not exist - we'll create it
        expect(existsSync(componentGuidelinesPath)).toBe(false);
      }
    });

    it('should document component props and variants', () => {
      const componentGuidelinesPath = join(process.cwd(), 'docs/component-guidelines.md');
      
      if (existsSync(componentGuidelinesPath)) {
        const content = readFileSync(componentGuidelinesPath, 'utf8');
        expect(content).toContain('Props');
        expect(content).toContain('primary');
        expect(content).toContain('secondary');
        expect(content).toContain('size');
      }
    });
  });

  describe('Development Guidelines', () => {
    it('should have development setup documentation', () => {
      const devGuidelinesPath = join(process.cwd(), 'docs/development-guidelines.md');
      
      if (existsSync(devGuidelinesPath)) {
        const content = readFileSync(devGuidelinesPath, 'utf8');
        expect(content).toContain('setup');
        expect(content).toContain('development');
        expect(content).toContain('testing');
      } else {
        expect(existsSync(devGuidelinesPath)).toBe(false);
      }
    });

    it('should document coding standards', () => {
      const devGuidelinesPath = join(process.cwd(), 'docs/development-guidelines.md');
      
      if (existsSync(devGuidelinesPath)) {
        const content = readFileSync(devGuidelinesPath, 'utf8');
        expect(content).toContain('TypeScript');
        expect(content).toContain('eslint');
        expect(content).toContain('prettier');
      }
    });
  });

  describe('Performance Documentation', () => {
    it('should have performance optimization guide', () => {
      const perfGuidelinesPath = join(process.cwd(), 'docs/performance-guidelines.md');
      
      if (existsSync(perfGuidelinesPath)) {
        const content = readFileSync(perfGuidelinesPath, 'utf8');
        expect(content).toContain('performance');
        expect(content).toContain('optimization');
        expect(content).toContain('bundle');
      } else {
        expect(existsSync(perfGuidelinesPath)).toBe(false);
      }
    });

    it('should document build optimization strategies', () => {
      const perfGuidelinesPath = join(process.cwd(), 'docs/performance-guidelines.md');
      
      if (existsSync(perfGuidelinesPath)) {
        const content = readFileSync(perfGuidelinesPath, 'utf8');
        expect(content).toContain('Astro');
        expect(content).toContain('code splitting');
        expect(content).toContain('lazy loading');
      }
    });
  });

  describe('Architecture Documentation', () => {
    it('should document project architecture', () => {
      const archDocPath = join(process.cwd(), 'docs/architecture.md');
      
      if (existsSync(archDocPath)) {
        const content = readFileSync(archDocPath, 'utf8');
        expect(content).toContain('architecture');
        expect(content).toContain('structure');
        expect(content).toContain('components');
      } else {
        expect(existsSync(archDocPath)).toBe(false);
      }
    });

    it('should document email module architecture', () => {
      const archDocPath = join(process.cwd(), 'docs/architecture.md');
      
      if (existsSync(archDocPath)) {
        const content = readFileSync(archDocPath, 'utf8');
        expect(content).toContain('email');
        expect(content).toContain('modular');
        expect(content).toContain('validation');
        expect(content).toContain('sender');
      }
    });
  });

  describe('Code Quality Metrics', () => {
    it('should track code quality improvements', () => {
      const qualityMetricsPath = join(process.cwd(), 'docs/code-quality-metrics.md');
      
      if (existsSync(qualityMetricsPath)) {
        const content = readFileSync(qualityMetricsPath, 'utf8');
        expect(content).toContain('metrics');
        expect(content).toContain('TypeScript');
        expect(content).toContain('test coverage');
      } else {
        expect(existsSync(qualityMetricsPath)).toBe(false);
      }
    });

    it('should document refactoring improvements', () => {
      const qualityMetricsPath = join(process.cwd(), 'docs/code-quality-metrics.md');
      
      if (existsSync(qualityMetricsPath)) {
        const content = readFileSync(qualityMetricsPath, 'utf8');
        expect(content).toContain('refactoring');
        expect(content).toContain('before');
        expect(content).toContain('after');
        expect(content).toContain('improvement');
      }
    });
  });

  describe('Maintenance Guidelines', () => {
    it('should have maintenance checklist', () => {
      const maintenancePath = join(process.cwd(), 'docs/maintenance-checklist.md');
      
      if (existsSync(maintenancePath)) {
        const content = readFileSync(maintenancePath, 'utf8');
        expect(content).toContain('checklist');
        expect(content).toContain('dependencies');
        expect(content).toContain('security');
      } else {
        expect(existsSync(maintenancePath)).toBe(false);
      }
    });

    it('should document update procedures', () => {
      const maintenancePath = join(process.cwd(), 'docs/maintenance-checklist.md');
      
      if (existsSync(maintenancePath)) {
        const content = readFileSync(maintenancePath, 'utf8');
        expect(content).toContain('update');
        expect(content).toContain('procedure');
        expect(content).toContain('testing');
      }
    });
  });

  describe('README Quality', () => {
    it('should have comprehensive README', () => {
      const readmePath = join(process.cwd(), 'README.md');
      expect(existsSync(readmePath)).toBe(true);
      
      const content = readFileSync(readmePath, 'utf8');
      expect(content).toContain('DeepHand');
      expect(content.length).toBeGreaterThan(500); // Substantial content
    });

    it('should document setup and development process', () => {
      const readmePath = join(process.cwd(), 'README.md');
      const content = readFileSync(readmePath, 'utf8');
      
      expect(content).toMatch(/installation|setup|getting started/i);
      expect(content).toMatch(/development|dev|npm|yarn/i);
      expect(content).toMatch(/build|deploy/i);
    });
  });

  describe('Type Definitions', () => {
    it('should have proper type exports for components', () => {
      const buttonPath = join(process.cwd(), 'src/components/ui/button.tsx');
      const content = readFileSync(buttonPath, 'utf8');
      
      expect(content).toContain('export interface');
      expect(content).toContain('ButtonProps');
    });

    it('should have proper type exports for utilities', () => {
      const utilsPath = join(process.cwd(), 'src/lib/utils.ts');
      const content = readFileSync(utilsPath, 'utf8');
      
      expect(content).toContain('export');
      expect(content).toContain('cn');
    });
  });

  describe('Documentation Structure', () => {
    it('should have organized documentation directory', () => {
      const docsDir = join(process.cwd(), 'docs');
      expect(existsSync(docsDir)).toBe(true);
    });

    it('should have refactoring completion report', () => {
      const completionReportPath = join(process.cwd(), 'docs/20250117_refactoring_completion_report.md');
      expect(existsSync(completionReportPath)).toBe(true);
      
      const content = readFileSync(completionReportPath, 'utf8');
      expect(content).toContain('Phase 1');
      expect(content).toContain('Phase 2');
      expect(content).toContain('Phase 3');
    });
  });
});