/**
 * コンタクトフォームAPI機能のTDDテストスイート
 * 
 * Astro設定とAPIルート動作の検証
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Contact Form API - TDD Tests', () => {
  
  describe('1. Astro Configuration for API Routes', () => {
    it('should have proper output configuration for API endpoints', () => {
      const configPath = join(process.cwd(), 'astro.config.mjs');
      
      if (existsSync(configPath)) {
        const configContent = readFileSync(configPath, 'utf8');
        
        // Should have hybrid or server output for API routes to work
        expect(configContent).toMatch(/output:\s*['"](?:hybrid|server)['"]/);
        
        // Should NOT have static output when API routes are needed
        expect(configContent).not.toMatch(/output:\s*['"]static['"]/);
      } else {
        expect(existsSync(configPath)).toBe(true);
      }
    });

    it('should have adapter configured for server-side rendering', () => {
      const configPath = join(process.cwd(), 'astro.config.mjs');
      
      if (existsSync(configPath)) {
        const configContent = readFileSync(configPath, 'utf8');
        
        // Should have adapter import when using hybrid/server mode
        expect(configContent).toMatch(/import.*node.*from.*@astrojs\/node/);
        
        // Should have adapter in config
        expect(configContent).toMatch(/adapter:/);
      }
    });
  });

  describe('2. API Route Prerender Configuration', () => {
    it('should have prerender disabled for contact API', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should have prerender disabled
        expect(apiContent).toContain('export const prerender = false');
        
        // Should NOT be commented out
        expect(apiContent).not.toMatch(/\/\/\s*export const prerender = false/);
      }
    });

    it('should have prerender disabled for request API', () => {
      const requestApiPath = join(process.cwd(), 'src/pages/api/request.ts');
      
      if (existsSync(requestApiPath)) {
        const apiContent = readFileSync(requestApiPath, 'utf8');
        
        // Should have prerender disabled
        expect(apiContent).toContain('export const prerender = false');
        
        // Should NOT be commented out
        expect(apiContent).not.toMatch(/\/\/\s*export const prerender = false/);
      }
    });
  });

  describe('3. Environment Variables Setup', () => {
    it('should have required environment variables for development', () => {
      const envPath = join(process.cwd(), '.env.local');
      
      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf8');
        
        // Required variables for email functionality
        expect(envContent).toContain('RESEND_API_KEY=');
        expect(envContent).toContain('ADMIN_EMAIL=');
        expect(envContent).toContain('FROM_EMAIL=');
        
        // Development URL
        expect(envContent).toMatch(/PUBLIC_SITE_URL=http:\/\/localhost/);
      }
    });

    it('should have proper NODE_ENV setting', () => {
      const envPath = join(process.cwd(), '.env.local');
      
      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf8');
        
        // Should have development environment
        expect(envContent).toContain('NODE_ENV=development');
      }
    });
  });

  describe('4. API Route Implementation', () => {
    it('should have proper POST handler export', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should export POST handler
        expect(apiContent).toContain('export const POST: APIRoute');
        
        // Should handle request parameter
        expect(apiContent).toMatch(/POST.*=.*async.*\(.*{.*request.*}/);
      }
    });

    it('should have proper error handling and response format', () => {
      const contactApiPath = join(process.cwd(), 'src/pages/api/contact.ts');
      
      if (existsSync(contactApiPath)) {
        const apiContent = readFileSync(contactApiPath, 'utf8');
        
        // Should return proper Response objects
        expect(apiContent).toContain('new Response');
        expect(apiContent).toContain('JSON.stringify');
        
        // Should have proper headers
        expect(apiContent).toContain('Content-Type');
        expect(apiContent).toContain('application/json');
        
        // Should have success property in response
        expect(apiContent).toMatch(/success:\s*true/);
        expect(apiContent).toMatch(/success:\s*false/);
      }
    });
  });

  describe('5. Frontend Integration', () => {
    it('should have proper form submission in HeroSection', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should have fetch to API endpoint
        expect(heroContent).toContain("fetch('/api/contact'");
        
        // Should handle response properly
        expect(heroContent).toContain('response.ok');
        expect(heroContent).toContain('result.success');
        
        // Should have proper error handling
        expect(heroContent).toContain('setSubmitStatus("error")');
        expect(heroContent).toContain('setSubmitStatus("success")');
      }
    });

    it('should have proper form data structure', () => {
      const heroPath = join(process.cwd(), 'src/components/HeroSection.tsx');
      
      if (existsSync(heroPath)) {
        const heroContent = readFileSync(heroPath, 'utf8');
        
        // Should collect form data properly
        expect(heroContent).toContain('FormData');
        expect(heroContent).toContain("formData.get('name')");
        expect(heroContent).toContain("formData.get('email')");
        expect(heroContent).toContain("formData.get('message')");
        
        // Should send as JSON
        expect(heroContent).toContain('JSON.stringify');
        expect(heroContent).toContain("'Content-Type': 'application/json'");
      }
    });
  });

  describe('6. Development Server Configuration', () => {
    it('should have proper package.json scripts for development', () => {
      const packagePath = join(process.cwd(), 'package.json');
      
      if (existsSync(packagePath)) {
        const packageContent = readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        // Should have dev script
        expect(packageJson.scripts).toHaveProperty('dev');
        expect(packageJson.scripts.dev).toContain('astro dev');
      }
    });
  });

  describe('7. Astro Integration Dependencies', () => {
    it('should have proper Astro and React versions', () => {
      const packagePath = join(process.cwd(), 'package.json');
      
      if (existsSync(packagePath)) {
        const packageContent = readFileSync(packagePath, 'utf8');
        const packageJson = JSON.parse(packageContent);
        
        // Should have astro dependency
        expect(packageJson.dependencies || packageJson.devDependencies).toMatchObject(
          expect.objectContaining({
            'astro': expect.any(String)
          })
        );
        
        // Should have React integration
        expect(packageJson.dependencies || packageJson.devDependencies).toMatchObject(
          expect.objectContaining({
            '@astrojs/react': expect.any(String)
          })
        );
      }
    });
  });

  describe('8. Build Configuration Compatibility', () => {
    it('should have compatible build settings for API routes', () => {
      const configPath = join(process.cwd(), 'astro.config.mjs');
      
      if (existsSync(configPath)) {
        const configContent = readFileSync(configPath, 'utf8');
        
        // Should have proper site configuration
        expect(configContent).toMatch(/site:\s*['"]https?:\/\//);
        
        // Should have React integration
        expect(configContent).toContain("import react from '@astrojs/react'");
        expect(configContent).toContain('react()');
      }
    });
  });
});