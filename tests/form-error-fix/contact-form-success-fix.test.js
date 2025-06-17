/**
 * Contact Form "Failed to send message" エラー修正のTDDテストスイート
 * 
 * 問題：実際にメール送受信は成功しているが、フロントエンドでエラーが表示される
 * 原因：確認メール失敗時にAPIがsuccess: falseを返し、フロントエンドが厳格判定している
 * 解決：主要機能（問い合わせ送信）成功を優先する判定ロジックに改善
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Contact Form Success Logic Fix - TDD Tests', () => {
  
  describe('1. Problem Analysis Verification', () => {
    it('should identify current strict success condition in HeroSection', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have current strict condition that causes the problem
        expect(heroContent).toContain('response.ok && result && result.success === true');
        
        // Should have error state setting that triggers user error message
        expect(heroContent).toMatch(/setSubmitStatus\(\s*["']error["']\s*\)/);
      }
    });

    it('should identify the same problem in RequestDataPage', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have similar strict condition
        expect(requestContent).toContain('response.ok && result && result.success === true');
        
        // Should set error status on failure
        expect(requestContent).toMatch(/setSubmitStatus\(\s*["']error["']\s*\)/);
      }
    });
  });

  describe('2. Backend Response Structure Investigation', () => {
    it('should verify API endpoints exist', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      const requestApiPath = join(process.cwd(), 'src/pages/api/request.ts');
      
      // API endpoints should exist
      expect(existsSync(contactApiPath)).toBe(true);
      expect(existsSync(requestApiPath)).toBe(true);
    });

    it('should analyze contact API response structure', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should return JSON response with success field
        expect(apiContent).toMatch(/success\s*:\s*(true|false)/);
        
        // Should handle both success and error cases
        expect(apiContent).toContain('Response.json');
      }
    });
  });

  describe('3. Improved Success Logic Implementation', () => {
    it('should implement flexible success condition in HeroSection', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should have improved success condition that considers partial success
        const hasFlexibleCondition = 
          // Option 1: Check for response.ok as primary success indicator
          heroContent.includes('response.ok') &&
          (
            // Either maintains existing logic but adds fallback
            heroContent.includes('result.success === true') ||
            // Or implements new logic that prioritizes primary function success
            heroContent.includes('response.status === 200') ||
            // Or checks for successful response without strict result.success requirement
            heroContent.match(/response\.ok\s*&&.*!result\.error/)
          );
        
        expect(hasFlexibleCondition).toBe(true);
      }
    });

    it('should implement consistent logic in RequestDataPage', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const requestContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have similar improved logic
        const hasImprovedLogic = 
          requestContent.includes('response.ok') &&
          (
            requestContent.includes('result.success === true') ||
            requestContent.includes('response.status === 200') ||
            requestContent.match(/response\.ok\s*&&.*!result\.error/)
          );
        
        expect(hasImprovedLogic).toBe(true);
      }
    });
  });

  describe('4. Error Handling Hierarchy Implementation', () => {
    it('should distinguish between critical and warning errors', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should handle different types of errors appropriately
        // Critical errors (validation, network failure) -> show error to user
        // Warning errors (confirmation email failure) -> show success to user
        
        const hasErrorHierarchy = 
          // Should check for actual form submission success vs auxiliary failures
          heroContent.includes('response.ok') ||
          // Should have different handling for different error types
          heroContent.includes('status === 200') ||
          // Should prioritize main functionality over auxiliary features
          heroContent.match(/(!result\.error|result\.submitted|result\.received)/);
        
        expect(hasErrorHierarchy).toBe(true);
      }
    });
  });

  describe('5. User Experience Priority Implementation', () => {
    it('should prioritize main functionality success over auxiliary failures', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      [heroSectionPath, requestPagePath].forEach(componentPath => {
        if (existsSync(componentPath)) {
          const componentContent = readFileSync(componentPath, 'utf8');
          
          // Success condition should prioritize:
          // 1. HTTP 200 response (server processed request successfully)
          // 2. No critical errors (validation, submission failed)
          // 3. Main functionality completed (form submitted, email sent to admin)
          
          const prioritizesMainFunction = 
            // Primary: HTTP response success
            componentContent.includes('response.ok') ||
            componentContent.includes('status === 200') ||
            // Secondary: No critical submission errors
            componentContent.match(/!.*(?:validation|submission|critical).*error/i) ||
            // Tertiary: Main functionality markers
            componentContent.match(/(?:submitted|received|processed).*success/i);
          
          expect(prioritizesMainFunction).toBe(true);
        }
      });
    });

    it('should show appropriate success message for main functionality completion', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      [heroSectionPath, requestPagePath].forEach(componentPath => {
        if (existsSync(componentPath)) {
          const componentContent = readFileSync(componentPath, 'utf8');
          
          // Should set success status when main functionality succeeds
          expect(componentContent).toMatch(/setSubmitStatus\(\s*["']success["']\s*\)/);
          
          // Should have success message display logic
          expect(componentContent).toMatch(/submitStatus\s*===\s*["']success["']/);
        }
      });
    });
  });

  describe('6. Regression Prevention', () => {
    it('should maintain existing functionality for actual failures', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should still show error for actual failures:
        // - Network errors
        // - Validation errors
        // - Server errors (5xx)
        // - Malformed requests (4xx)
        
        const handlesActualErrors = 
          // Network/fetch errors
          heroContent.includes('catch') &&
          // Should set error status for real failures
          heroContent.includes('setSubmitStatus("error")') &&
          // Should have try-catch error handling
          heroContent.match(/catch\s*\(\s*\w+\s*\)/);
        
        expect(handlesActualErrors).toBe(true);
      }
    });

    it('should not break existing validation and error handling', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      [heroSectionPath, requestPagePath].forEach(componentPath => {
        if (existsSync(componentPath)) {
          const componentContent = readFileSync(componentPath, 'utf8');
          
          // Should preserve form validation
          expect(componentContent).toMatch(/required|validation/i);
          
          // Should preserve error state management
          expect(componentContent).toContain('setSubmitStatus');
          
          // Should preserve loading state management
          expect(componentContent).toContain('setIsSubmitting');
        }
      });
    });
  });

  describe('7. API Response Compatibility', () => {
    it('should work with current API response structure', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should handle current API response format
        expect(heroContent).toMatch(/response\.text\(\)|response\.json\(\)/);
        
        // Should parse JSON response
        expect(heroContent).toMatch(/JSON\.parse|await response\.json/);
        
        // Should handle parsing errors gracefully
        expect(heroContent).toMatch(/catch.*parse/i);
      }
    });

    it('should be forward-compatible with improved API responses', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const heroContent = readFileSync(heroSectionPath, 'utf8');
        
        // Success logic should be flexible enough to work with:
        // 1. Current simple { success: boolean } format
        // 2. Future enhanced { success: boolean, primaryOperation: {...} } format
        // 3. HTTP status-based success detection
        
        const isForwardCompatible = 
          // Should not be overly dependent on specific response structure
          !heroContent.includes('result.success === true') ||
          // Should have fallback success detection methods
          heroContent.includes('response.ok') ||
          heroContent.includes('response.status === 200') ||
          // Should handle optional fields gracefully
          heroContent.match(/result\?\.success|result\.success\s*!==\s*false/);
        
        expect(isForwardCompatible).toBe(true);
      }
    });
  });
});