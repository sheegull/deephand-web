/**
 * コンタクトフォームバリデーション修正のTDDテストスイート
 * 
 * フロントエンドとバックエンドのスキーマ不一致問題の解決
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Contact Form Validation - TDD Tests', () => {
  
  describe('1. Validation Schema Alignment', () => {
    it('should have schema matching frontend form fields', () => {
      const schemaPath = join(process.cwd(), 'src/lib/validationSchemas.ts');
      
      if (existsSync(schemaPath)) {
        const schemaContent = readFileSync(schemaPath, 'utf8');
        
        // Extract contactFormSchema section
        const contactFormMatch = schemaContent.match(/export const contactFormSchema = z\.object\(\{([^}]+)\}\);/s);
        expect(contactFormMatch).toBeTruthy();
        
        if (contactFormMatch) {
          const contactFormFields = contactFormMatch[1];
          
          // Contact form should NOT require subject field
          expect(contactFormFields).not.toContain('subject:');
          
          // Contact form should NOT require privacyConsent field
          expect(contactFormFields).not.toContain('privacyConsent:');
        }
        
        // Should have basic required fields: name, email, message
        expect(schemaContent).toMatch(/name:.*\.min\(1/);
        expect(schemaContent).toMatch(/email:.*\.email/);
        expect(schemaContent).toMatch(/message:.*\.min\(1/);
      }
    });

    it('should have organization as optional field', () => {
      const schemaPath = join(process.cwd(), 'src/lib/validationSchemas.ts');
      
      if (existsSync(schemaPath)) {
        const schemaContent = readFileSync(schemaPath, 'utf8');
        
        // Organization should be optional
        expect(schemaContent).toMatch(/organization:.*\.optional\(\)/);
      }
    });
  });

  describe('2. Frontend Form Data Structure', () => {
    it('should send correct data structure to API', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should collect the exact fields defined in form
        expect(heroContent).toMatch(/name:.*formData\.get\(['"]name['"]\)/);
        expect(heroContent).toMatch(/email:.*formData\.get\(['"]email['"]\)/);
        expect(heroContent).toMatch(/message:.*formData\.get\(['"]message['"]\)/);
        expect(heroContent).toMatch(/organization:.*formData\.get\(['"]organization['"]\)/);
        
        // Should NOT include subject or privacyConsent if not in form
        expect(heroContent).not.toMatch(/subject:.*formData\.get/);
        expect(heroContent).not.toMatch(/privacyConsent:.*formData\.get/);
      }
    });

    it('should have proper form field names matching data collection', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Form inputs should have correct name attributes
        expect(heroContent).toMatch(/name="name"/);
        expect(heroContent).toMatch(/name="email"/);
        expect(heroContent).toMatch(/name="message"/);
        expect(heroContent).toMatch(/name="organization"/);
      }
    });
  });

  describe('3. API Validation Response', () => {
    it('should have appropriate error handling for validation failures', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should use contactFormSchema for validation
        expect(apiContent).toContain('contactFormSchema.safeParse');
        
        // Should return proper error structure
        expect(apiContent).toMatch(/result\.error\.flatten\(\)\.fieldErrors/);
        
        // Should return success: false for validation errors
        expect(apiContent).toMatch(/success:\s*false/);
      }
    });

    it('should handle successful validation properly', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should check validation success
        expect(apiContent).toMatch(/if\s*\(\s*!result\.success\s*\)/);
        
        // Should use result.data for validated data
        expect(apiContent).toMatch(/result\.data/);
      }
    });
  });

  describe('4. Error Display on Frontend', () => {
    it('should display validation errors appropriately', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should handle error state
        expect(heroContent).toMatch(/setSubmitStatus\(["']error["']\)/);
        
        // Should display error message
        expect(heroContent).toMatch(/submitStatus\s*===\s*["']error["']/);
        expect(heroContent).toContain('contact.error');
      }
    });

    it('should display success message appropriately', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should handle success state
        expect(heroContent).toMatch(/setSubmitStatus\(["']success["']\)/);
        
        // Should display success message
        expect(heroContent).toMatch(/submitStatus\s*===\s*["']success["']/);
        expect(heroContent).toContain('contact.success');
      }
    });
  });

  describe('5. Email Service Integration', () => {
    it('should pass correct data to email service', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should call sendContactEmail with validated data
        expect(apiContent).toMatch(/sendContactEmail\(result\.data\)/);
        
        // Should handle email sending result
        expect(apiContent).toMatch(/emailResult\.success/);
      }
    });
  });

  describe('6. Development Environment Setup', () => {
    it('should have consistent port configuration', () => {
      const envPath = join(process.cwd(), '.env.local');
      
      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf8');
        
        // Should have localhost URL with port
        expect(envContent).toMatch(/PUBLIC_SITE_URL=http:\/\/localhost:\d+/);
      }
    });

    it('should have required email configuration', () => {
      const envPath = join(process.cwd(), '.env.local');
      
      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf8');
        
        // Should have email settings
        expect(envContent).toContain('RESEND_API_KEY=');
        expect(envContent).toContain('ADMIN_EMAIL=');
        expect(envContent).toContain('FROM_EMAIL=');
      }
    });
  });

  describe('7. Form User Experience', () => {
    it('should have proper loading states', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should have submitting state
        expect(heroContent).toMatch(/isSubmitting.*setIsSubmitting/);
        
        // Should disable button during submission
        expect(heroContent).toMatch(/disabled=\{isSubmitting\}/);
        
        // Should show loading indicator
        expect(heroContent).toContain('contact.submitting');
      }
    });

    it('should reset form after successful submission', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should reset form on success
        expect(heroContent).toMatch(/e\.currentTarget\.reset\(\)/);
      }
    });
  });
});