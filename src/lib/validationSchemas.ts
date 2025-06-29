import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(1, 'この項目は必須です').min(2, '2文字以上で入力してください'),
  email: z.string().min(1, 'この項目は必須です').email('有効なメールアドレスを入力してください'),
  organization: z.string().optional(),
  message: z.string().min(1, 'この項目は必須です').min(10, '10文字以上で入力してください'),
  language: z.enum(['ja', 'en']).optional().default('ja'), // 言語設定を追加
});

export const dataRequestStep1Schema = z.object({
  companyName: z.string().min(1, 'この項目は必須です'),
  contactPerson: z.string().min(1, 'この項目は必須です'),
  email: z.string().min(1, 'この項目は必須です').email('有効なメールアドレスを入力してください'),
  phone: z.string().optional(),
});

export const dataRequestStep2Schema = z.object({
  projectTitle: z.string().min(1, 'この項目は必須です'),
  dataType: z.enum(['image', 'video', 'text', 'audio', 'sensor', 'other']),
  dataDescription: z.string().min(1, 'この項目は必須です').min(10, '10文字以上で入力してください'),
  annotationRequirements: z.string().min(1, 'この項目は必須です').min(10, '10文字以上で入力してください'),
  dataVolume: z.string().min(1, 'この項目は必須です'),
  timeline: z.string().min(1, 'この項目は必須です'),
  budget: z.string().optional(),
});

export const dataRequestStep3Schema = z.object({
  additionalNotes: z.string().optional(),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: 'プライバシーポリシーに同意してください',
  }),
  communicationPreference: z.enum(['email', 'phone', 'both']),
});

// Simplified schema for current form structure
export const currentDataRequestFormSchema = z.object({
  name: z.string().min(1, 'この項目は必須です').min(2, '2文字以上で入力してください'),
  organization: z.string().optional(),
  email: z.string().min(1, 'この項目は必須です').email('有効なメールアドレスを入力してください'),
  backgroundPurpose: z.string().min(1, 'この項目は必須です').min(5, '5文字以上で入力してください'),
  dataType: z.array(z.string()).min(1, '少なくとも1つのデータ種別を選択してください'),
  dataDetails: z.string().optional(),
  dataVolume: z.string().min(1, 'この項目は必須です'),
  deadline: z.string().min(1, 'この項目は必須です'),
  budget: z.string().min(1, 'この項目は必須です'),
  otherRequirements: z.string().optional(),
  language: z.enum(['ja', 'en']).optional().default('ja'), // 言語設定を追加
});

export const dataRequestFormSchema = dataRequestStep1Schema
  .merge(dataRequestStep2Schema)
  .merge(dataRequestStep3Schema);

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type DataRequestStep1Data = z.infer<typeof dataRequestStep1Schema>;
export type DataRequestStep2Data = z.infer<typeof dataRequestStep2Schema>;
export type DataRequestStep3Data = z.infer<typeof dataRequestStep3Schema>;
export type DataRequestFormData = z.infer<typeof dataRequestFormSchema>;
export type CurrentDataRequestFormData = z.infer<typeof currentDataRequestFormSchema>;