import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  dataRequestStep1Schema,
  dataRequestStep2Schema,
  dataRequestStep3Schema,
  dataRequestFormSchema,
  type ContactFormData,
  type DataRequestFormData,
} from '../validationSchemas';

describe('Validation Schemas', () => {
  describe('contactFormSchema', () => {
    it('should validate correct contact form data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Company',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        privacyConsent: true,
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validData);
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.privacyConsent).toBe(true);
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        privacyConsent: true,
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['email'],
              message: '有効なメールアドレスを入力してください',
            }),
          ])
        );
      }
    });

    it('should reject when privacy consent is false', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough characters',
        privacyConsent: false,
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['privacyConsent'],
              message: 'プライバシーポリシーに同意してください',
            }),
          ])
        );
      }
    });

    it('should require minimum message length', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Short',
        privacyConsent: true,
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path: ['message'],
              message: '10文字以上で入力してください',
            }),
          ])
        );
      }
    });
  });

  describe('dataRequestFormSchema', () => {
    it('should validate complete data request form', () => {
      const validData = {
        // Step 1
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'john@example.com',
        phone: '+81-90-1234-5678',

        // Step 2
        projectTitle: 'AI Vision Project',
        dataType: 'image' as const,
        dataDescription: 'Object detection training images with various lighting conditions',
        annotationRequirements: 'Bounding boxes for cars, pedestrians, and traffic signs',
        dataVolume: '10,000 images',
        timeline: '4 weeks',
        budget: '¥500,000',

        // Step 3
        additionalNotes: 'Please ensure high quality annotations',
        privacyConsent: true,
        communicationPreference: 'email' as const,
      };

      const result = dataRequestFormSchema.safeParse(validData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.companyName).toBe('Test Company');
        expect(result.data.dataType).toBe('image');
        expect(result.data.communicationPreference).toBe('email');
      }
    });

    it('should reject invalid data type enum', () => {
      const invalidData = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'john@example.com',
        projectTitle: 'AI Vision Project',
        dataType: 'invalid-type',
        dataDescription: 'Object detection training images',
        annotationRequirements: 'Bounding boxes for objects',
        dataVolume: '10,000 images',
        timeline: '4 weeks',
        privacyConsent: true,
        communicationPreference: 'email',
      };

      const result = dataRequestFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle optional fields correctly', () => {
      const dataWithoutOptionals = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'john@example.com',
        projectTitle: 'AI Vision Project',
        dataType: 'image' as const,
        dataDescription: 'Object detection training images with various lighting conditions',
        annotationRequirements: 'Bounding boxes for cars, pedestrians, and traffic signs',
        dataVolume: '10,000 images',
        timeline: '4 weeks',
        privacyConsent: true,
        communicationPreference: 'email' as const,
      };

      const result = dataRequestFormSchema.safeParse(dataWithoutOptionals);
      expect(result.success).toBe(true);
    });
  });

  describe('Type Inference', () => {
    it('should correctly infer ContactFormData type', () => {
      const data: ContactFormData = {
        name: 'Test',
        email: 'test@example.com',
        company: 'Test Company',
        subject: 'Test Subject',
        message: 'Test message with enough characters',
        privacyConsent: true,
      };

      expect(typeof data.name).toBe('string');
      expect(typeof data.email).toBe('string');
      expect(typeof data.privacyConsent).toBe('boolean');
    });

    it('should correctly infer DataRequestFormData type', () => {
      const data: DataRequestFormData = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'john@example.com',
        projectTitle: 'AI Vision Project',
        dataType: 'image',
        dataDescription: 'Object detection training images',
        annotationRequirements: 'Bounding boxes for objects',
        dataVolume: '10,000 images',
        timeline: '4 weeks',
        privacyConsent: true,
        communicationPreference: 'email',
      };

      expect(data.dataType).toMatch(/^(image|video|text|audio|sensor|other)$/);
      expect(data.communicationPreference).toMatch(/^(email|phone|both)$/);
    });
  });
});
