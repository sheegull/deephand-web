export interface DataRequestFormData {
  // Step 1: Basic Information
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  
  // Step 2: Project Details
  projectTitle: string;
  dataType: 'image' | 'video' | 'text' | 'audio' | 'sensor' | 'other';
  dataDescription: string;
  annotationRequirements: string;
  dataVolume: string;
  timeline: string;
  budget?: string;
  
  // Step 3: Additional Information
  additionalNotes?: string;
  privacyConsent: boolean;
  communicationPreference: 'email' | 'phone' | 'both';
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
}

export interface ServiceCard {
  id: string;
  title: {
    en: string;
    ja: string;
  };
  description: {
    en: string;
    ja: string;
  };
  icon: string;
  features: {
    en: string[];
    ja: string[];
  };
}

export interface ProcessStep {
  id: string;
  step: number;
  title: {
    en: string;
    ja: string;
  };
  description: {
    en: string;
    ja: string;
  };
  icon: string;
}

export interface FeatureCard {
  id: string;
  title: {
    en: string;
    ja: string;
  };
  description: {
    en: string;
    ja: string;
  };
  icon: string;
}

export type Language = 'en' | 'ja';

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}