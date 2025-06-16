/**
 * フォームレスポンス処理修正の検証テストスイート
 * 
 * 修正内容: RequestDataPageのレスポンス処理をHeroSectionと同じ正しいパターンに統一
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Form Response Handling Fix - Verification Tests', () => {
  
  describe('1. RequestDataPage Response Processing Fix', () => {
    it('should have proper JSON response parsing', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should get response text first
        expect(pageContent).toContain('await response.text()');
        
        // Should parse JSON safely
        expect(pageContent).toContain('JSON.parse(responseText)');
        
        // Should have proper error handling for JSON parsing
        expect(pageContent).toContain('parseError');
        expect(pageContent).toContain('data_request_form_parse_error');
      }
    });

    it('should check both response.ok and result.success', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should check both conditions like HeroSection
        expect(pageContent).toMatch(/response\.ok.*&&.*result.*&&.*result\.success.*===.*true/);
        
        // Should set success state properly
        expect(pageContent).toMatch(/setSubmitStatus\('success'\)/);
        
        // Should reset form state on success
        expect(pageContent).toContain('setCurrentStep(1)');
      }
    });

    it('should have enhanced error logging', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should log response status and data for debugging
        expect(pageContent).toContain('responseStatus: response.status');
        expect(pageContent).toContain('responseData: result');
        
        // Should have detailed operation names
        expect(pageContent).toContain('data_request_form_failed');
        expect(pageContent).toContain('data_request_form_parse_error');
      }
    });
  });

  describe('2. Consistency Between Forms', () => {
    it('should have matching response handling patterns', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(heroSectionPath) && existsSync(requestPagePath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Both should use response.text()
        expect(heroContent).toContain('response.text()');
        expect(requestContent).toContain('response.text()');
        
        // Both should parse JSON safely
        expect(heroContent).toContain('JSON.parse(');
        expect(requestContent).toContain('JSON.parse(');
        
        // Both should check response.ok AND result.success
        expect(heroContent).toMatch(/response\.ok.*&&.*result\.success/);
        expect(requestContent).toMatch(/response\.ok.*&&.*result\.success/);
      }
    });

    it('should have proper form reset logic', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should reset form on success
        expect(pageContent).toContain('e.currentTarget.reset()');
        
        // Should reset data types selection
        expect(pageContent).toContain('setSelectedDataTypes([])');
        expect(pageContent).toContain("setOtherDataType('')");
        
        // Should reset to step 1
        expect(pageContent).toContain('setCurrentStep(1)');
      }
    });
  });

  describe('3. Error Handling Improvements', () => {
    it('should handle JSON parsing errors separately', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have separate try-catch for JSON parsing
        expect(pageContent).toMatch(/try\s*{\s*result = JSON\.parse/);
        expect(pageContent).toMatch(/catch\s*\(\s*parseError\s*\)/);
        
        // Should return early if parsing fails
        expect(pageContent).toMatch(/setSubmitStatus\('error'\);\s*return;/);
      }
    });

    it('should provide detailed error information', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should log response status for debugging
        expect(pageContent).toContain('responseStatus:');
        
        // Should log response data for debugging
        expect(pageContent).toContain('responseData:');
        
        // Should use descriptive operation names
        expect(pageContent).toContain('data_request_form_failed');
      }
    });
  });

  describe('4. Success State Management', () => {
    it('should properly handle successful submissions', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should check result.success explicitly
        expect(pageContent).toMatch(/result\.success === true/);
        
        // Should reset all form states on success
        expect(pageContent).toMatch(/setSubmitStatus\('success'\)/);
        expect(pageContent).toContain('e.currentTarget.reset()');
        expect(pageContent).toContain('setSelectedDataTypes([])');
        expect(pageContent).toContain('setCurrentStep(1)');
      }
    });
  });
});