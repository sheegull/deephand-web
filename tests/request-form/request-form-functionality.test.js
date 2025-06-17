/**
 * データリクエストフォーム機能のTDDテストスイート
 * 
 * /requestページのフォーム機能とAPIの動作確認
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Request Form Functionality - TDD Tests', () => {
  
  describe('1. Request Data Page Component', () => {
    it('should have proper form structure and fields', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have form element with onSubmit
        expect(pageContent).toContain('<form');
        expect(pageContent).toContain('onSubmit={onSubmit}');
        
        // Should collect required form data
        expect(pageContent).toMatch(/formData\.get\(['"]name['"]\)/);
        expect(pageContent).toMatch(/formData\.get\(['"]email['"]\)/);
        expect(pageContent).toMatch(/formData\.get\(['"]backgroundPurpose['"]\)/);
        
        // Should handle data types
        expect(pageContent).toContain('selectedDataTypes');
        expect(pageContent).toContain('setSelectedDataTypes');
      }
    });

    it('should have proper step navigation', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have step management
        expect(pageContent).toContain('currentStep');
        expect(pageContent).toContain('setCurrentStep');
        
        // Should have step validation
        expect(pageContent).toContain('validateStep1');
        expect(pageContent).toContain('step1Valid');
        
        // Should have navigation buttons
        expect(pageContent).toContain('nextButton');
        expect(pageContent).toContain('prevButton');
      }
    });

    it('should have proper form submission handling', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should send to correct API endpoint
        expect(pageContent).toContain("fetch('/api/request'");
        
        // Should handle submission states
        expect(pageContent).toContain('isSubmitting');
        expect(pageContent).toContain('setIsSubmitting');
        expect(pageContent).toContain('submitStatus');
        
        // Should handle response
        expect(pageContent).toContain('response.ok');
        expect(pageContent).toContain('setSubmitStatus');
      }
    });
  });

  describe('2. Validation Schema Compatibility', () => {
    it('should use currentDataRequestFormSchema for validation', () => {
      const requestApiPath = join(process.cwd(), 'src/pages/api/request.ts');
      
      if (existsSync(requestApiPath)) {
        const apiContent = readFileSync(requestApiPath, 'utf8');
        
        // Should use the correct schema
        expect(apiContent).toContain('currentDataRequestFormSchema');
        expect(apiContent).toMatch(/currentDataRequestFormSchema\.safeParse/);
      }
    });

    it('should have schema matching form fields', () => {
      const schemaPath = join(process.cwd(), 'src/lib/validationSchemas.ts');
      
      if (existsSync(schemaPath)) {
        const schemaContent = readFileSync(schemaPath, 'utf8');
        
        // Should have currentDataRequestFormSchema defined
        expect(schemaContent).toContain('currentDataRequestFormSchema');
        
        // Should include required fields that match form
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*name:/);
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*email:/);
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*backgroundPurpose:/);
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*dataType:/);
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*dataVolume:/);
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*deadline:/);
        expect(schemaContent).toMatch(/currentDataRequestFormSchema[\s\S]*budget:/);
      }
    });
  });

  describe('3. API Endpoint Configuration', () => {
    it('should have proper request API endpoint', () => {
      const requestApiPath = join(process.cwd(), 'src/pages/api/request.ts');
      
      expect(existsSync(requestApiPath)).toBe(true);
      
      if (existsSync(requestApiPath)) {
        const apiContent = readFileSync(requestApiPath, 'utf8');
        
        // Should export POST handler
        expect(apiContent).toContain('export const POST: APIRoute');
        
        // Should have prerender disabled
        expect(apiContent).toContain('export const prerender = false');
        
        // Should handle request validation
        expect(apiContent).toContain('safeParse');
        expect(apiContent).toContain('result.success');
      }
    });

    it('should have proper email sending integration', () => {
      const requestApiPath = join(process.cwd(), 'src/pages/api/request.ts');
      
      if (existsSync(requestApiPath)) {
        const apiContent = readFileSync(requestApiPath, 'utf8');
        
        // Should send data request email
        expect(apiContent).toContain('sendDataRequestEmail');
        expect(apiContent).toMatch(/sendDataRequestEmail\(result\.data\)/);
        
        // Should handle email result
        expect(apiContent).toContain('emailResult.success');
      }
    });
  });

  describe('4. Form Data Structure', () => {
    it('should collect all required form fields', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should collect step 1 data
        expect(pageContent).toMatch(/name:.*formData\.get/);
        expect(pageContent).toMatch(/organization:.*formData\.get/);
        expect(pageContent).toMatch(/email:.*formData\.get/);
        expect(pageContent).toMatch(/backgroundPurpose:.*formData\.get/);
        
        // Should collect step 2 data
        expect(pageContent).toMatch(/dataType:.*selectedDataTypes/);
        expect(pageContent).toMatch(/dataDetails:.*formData\.get/);
        expect(pageContent).toMatch(/dataVolume:.*formData\.get/);
        expect(pageContent).toMatch(/deadline:.*formData\.get/);
        expect(pageContent).toMatch(/budget:.*formData\.get/);
        expect(pageContent).toMatch(/otherRequirements:.*formData\.get/);
      }
    });

    it('should handle data types selection properly', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have data type options
        expect(pageContent).toContain('dataTypeOptions');
        expect(pageContent).toContain('handleDataTypeChange');
        
        // Should validate data types selection
        expect(pageContent).toMatch(/selectedDataTypes\.length\s*===\s*0/);
        expect(pageContent).toContain('dataTypeRequired');
      }
    });
  });

  describe('5. Step Validation Logic', () => {
    it('should validate step 1 properly', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should validate required fields in step 1
        expect(pageContent).toMatch(/name.*length\s*>=\s*2/);
        expect(pageContent).toMatch(/email.*includes\('@'\)/);
        expect(pageContent).toMatch(/background.*length\s*>=\s*10/);
        
        // Should update step1Valid state
        expect(pageContent).toContain('setStep1Valid');
      }
    });

    it('should prevent step progression without validation', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Next button should be disabled when invalid
        expect(pageContent).toMatch(/disabled=\{!step1Valid\}/);
        
        // Should validate before step change
        expect(pageContent).toMatch(/if\s*\(\s*validateStep1\(\)\s*\)/);
      }
    });
  });

  describe('6. Error Handling and UX', () => {
    it('should handle form submission errors', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should handle validation errors
        expect(pageContent).toMatch(/submitStatus\s*===\s*['"]error['"]/);
        expect(pageContent).toContain('request.error');
        
        // Should handle success state
        expect(pageContent).toMatch(/submitStatus\s*===\s*['"]success['"]/);
        expect(pageContent).toContain('request.success');
      }
    });

    it('should have proper loading states', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should show submitting state
        expect(pageContent).toContain('request.submitting');
        expect(pageContent).toContain('request.submit');
        
        // Should disable button during submission
        expect(pageContent).toMatch(/disabled=\{isSubmitting\}/);
      }
    });
  });

  describe('7. Internationalization Support', () => {
    it('should use translation keys for all text', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should use i18n for form labels and messages
        expect(pageContent).toContain("t('request.title')");
        expect(pageContent).toContain("t('request.subtitle')");
        expect(pageContent).toContain("t('ui.step1')");
        expect(pageContent).toContain("t('ui.step2')");
        expect(pageContent).toContain("t('ui.nextButton')");
        expect(pageContent).toContain("t('ui.prevButton')");
      }
    });
  });

  describe('8. Responsive Design Elements', () => {
    it('should have responsive layout classes', () => {
      const requestPagePath = join(process.cwd(), 'src/components/RequestDataPage.tsx');
      
      if (existsSync(requestPagePath)) {
        const pageContent = readFileSync(requestPagePath, 'utf8');
        
        // Should have responsive classes
        expect(pageContent).toMatch(/md:flex|md:w-|md:p-|md:text-/);
        expect(pageContent).toMatch(/hidden\s+md:flex|flex\s+md:hidden/);
        
        // Should have mobile-specific elements
        expect(pageContent).toContain('Mobile header');
        expect(pageContent).toContain('Mobile footer');
      }
    });
  });
});