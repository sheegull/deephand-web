/**
 * フォーム送信エラー表示問題のTDD分析テストスイート
 * 
 * 現象: メール送信は成功しているがフロントエンドでエラー表示される
 * 目的: 原因特定とレスポンス処理の修正
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Form Error Handling Analysis - TDD Tests', () => {
  
  describe('1. API Response Structure Analysis', () => {
    it('should check contact API response format', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should return success response with proper structure
        expect(apiContent).toContain('Response.json');
        expect(apiContent).toMatch(/success.*true/);
        
        // Should handle email sending result properly
        expect(apiContent).toContain('emailResult.success');
        
        // Should have error handling for failed cases
        expect(apiContent).toMatch(/Response\.json.*error/);
      }
    });

    it('should check request API response format', () => {
      const requestApiPath = join(process.cwd(), 'src/pages/api/request.ts');
      
      if (existsSync(requestApiPath)) {
        const apiContent = readFileSync(requestApiPath, 'utf8');
        
        // Should return success response with proper structure
        expect(apiContent).toContain('Response.json');
        expect(apiContent).toMatch(/success.*true/);
        
        // Should handle email sending result properly
        expect(apiContent).toContain('emailResult.success');
        
        // Should have proper status codes
        expect(apiContent).toMatch(/status.*200/);
      }
    });
  });

  describe('2. Frontend Response Processing', () => {
    it('should check contact form response handling', () => {
      const heroSectionPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroSectionPath)) {
        const componentContent = readFileSync(heroSectionPath, 'utf8');
        
        // Should check response.ok for success
        expect(componentContent).toContain('response.ok');
        
        // Should handle both success and error states
        expect(componentContent).toMatch(/setSubmitStatus.*success/);
        expect(componentContent).toMatch(/setSubmitStatus.*error/);
        
        // Should parse JSON response if needed
        expect(componentContent).toMatch(/response\.json|await.*response/);
      }
    });

    it('should check request form response handling', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const componentContent = readFileSync(requestPagePath, 'utf8');
        
        // Should check response.ok for success
        expect(componentContent).toContain('response.ok');
        
        // Should handle both success and error states
        expect(componentContent).toMatch(/setSubmitStatus.*success/);
        expect(componentContent).toMatch(/setSubmitStatus.*error/);
        
        // Should handle response parsing
        expect(componentContent).toMatch(/response\.json|await.*response/);
      }
    });
  });

  describe('3. Error Handling Logic', () => {
    it('should verify proper error status codes in APIs', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should return 400 for validation errors
        expect(apiContent).toMatch(/status.*400/);
        
        // Should return 500 for server errors
        expect(apiContent).toMatch(/status.*500/);
        
        // Should return 200 for successful operations
        expect(apiContent).toMatch(/status.*200/);
      }
    });

    it('should verify response structure consistency', () => {
      const emailServicePath = join(process.cwd(), 'src/lib/email.ts');
      
      if (existsSync(emailServicePath)) {
        const emailContent = readFileSync(emailServicePath, 'utf8');
        
        // Should return structured response
        expect(emailContent).toMatch(/success.*boolean/);
        
        // Should include error details when failed
        expect(emailContent).toMatch(/error.*Error/);
      }
    });
  });

  describe('4. Specific Issue Detection', () => {
    it('should identify user confirmation email handling', () => {
      const emailServicePath = join(process.cwd(), 'src/lib/email.ts');
      
      if (existsSync(emailServicePath)) {
        const emailContent = readFileSync(emailServicePath, 'utf8');
        
        // Should send admin email first
        expect(emailContent).toContain('sendContactEmail');
        expect(emailContent).toContain('sendDataRequestEmail');
        
        // Should handle user confirmation separately
        expect(emailContent).toMatch(/user.*confirmation/i);
        
        // Should not fail entire operation if user email fails
        expect(emailContent).toMatch(/try.*catch/);
      }
    });

    it('should check if partial failure affects main response', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should prioritize main email success over user confirmation
        expect(apiContent).toMatch(/emailResult\.success/);
        
        // Should not let user email failure affect main response
        expect(apiContent).not.toMatch(/userEmailResult.*success.*false/);
      }
    });
  });

  describe('5. HTTP Status Code Validation', () => {
    it('should ensure 200 status for successful main email send', () => {
      const apis = ['contact.ts', 'request.ts'];
      
      apis.forEach(apiFile => {
        const apiPath = join(process.cwd(), 'src/pages/api', apiFile);
        
        if (existsSync(apiPath)) {
          const apiContent = readFileSync(apiPath, 'utf8');
          
          // When emailResult.success is true, should return 200
          expect(apiContent).toMatch(/if.*emailResult\.success.*200/);
          
          // Should not return error status for partial failures
          expect(apiContent).not.toMatch(/userConfirmation.*failed.*500/);
        }
      });
    });
  });
});