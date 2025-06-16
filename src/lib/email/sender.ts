/**
 * Email Sender Module
 * 
 * Contains core email sending functionality using Resend
 */

import { Resend } from 'resend';
import { ENV, diagnoseEnvironment } from '../env';
import type { ContactFormData, CurrentDataRequestFormData } from '../validationSchemas';
import { 
  generateContactAdminEmailHtml,
  generateContactAdminEmailText,
  generateContactConfirmationEmailHtml,
  generateContactConfirmationEmailText,
  generateDataRequestAdminEmailHtml,
  generateDataRequestAdminEmailText,
  generateDataRequestConfirmationEmailHtml,
  generateDataRequestConfirmationEmailText
} from './templates';
import { 
  getContactAdminEmail,
  getContactUserEmail,
  getDataRequestAdminEmail,
  getDataRequestUserEmail,
  type Language
} from './templates-multilingual';
import { logError, logWarn } from '../error-handling';

export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

// Initialize Resend client
const getResendClient = () => {
  const apiKey = ENV.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
};

export async function sendContactEmail(data: ContactFormData): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    
    // Get language from data or default to 'ja'
    const language = (data as any).language || 'ja';
    const isJapanese = language === 'ja';

    // Send notification email to admin
    const adminEmailResult = await resend.emails.send({
      from: ENV.FROM_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: isJapanese ? 'お問い合わせ - DeepHand' : 'Contact Inquiry - DeepHand',
      html: generateContactAdminEmailHtml(data),
      text: generateContactAdminEmailText(data),
    });

    if (adminEmailResult.error) {
      return {
        success: false,
        error: adminEmailResult.error.message,
      };
    }

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: ENV.NOREPLY_EMAIL,
      to: data.email,
      subject: isJapanese ? 'お問い合わせありがとうございます - DeepHand' : 'Thank you for your inquiry - DeepHand',
      html: generateContactConfirmationEmailHtml(data),
      text: generateContactConfirmationEmailText(data),
    });

    if (userEmailResult.error) {
      // Admin email sent but user email failed - log warning but don't fail
      logWarn('User confirmation email failed', {
        operation: 'contact_email_user_confirmation',
        timestamp: Date.now()
      });
    }

    return {
      success: true,
      emailId: adminEmailResult.data?.id,
    };
  } catch (error: any) {
    logError('Contact email sending failed', {
      operation: 'send_contact_email',
      timestamp: Date.now()
    });
    
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function sendDataRequestEmail(data: CurrentDataRequestFormData): Promise<EmailResult> {
  try {
    const resend = getResendClient();
    
    // Get language from data or default to 'ja'
    const language = (data as any).language || 'ja';
    const isJapanese = language === 'ja';

    // Send detailed request email to sales team
    const salesEmailResult = await resend.emails.send({
      from: ENV.REQUESTS_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: isJapanese ? 'データリクエスト - DeepHand' : 'Data Request - DeepHand',
      html: generateDataRequestAdminEmailHtml(data),
      text: generateDataRequestAdminEmailText(data),
    });

    if (salesEmailResult.error) {
      return {
        success: false,
        error: salesEmailResult.error.message,
      };
    }

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: ENV.NOREPLY_EMAIL,
      to: data.email,
      subject: isJapanese ? 'データリクエストを受け付けました - DeepHand' : 'Your data request has been received - DeepHand',
      html: generateDataRequestConfirmationEmailHtml(data),
      text: generateDataRequestConfirmationEmailText(data),
    });

    if (userEmailResult.error) {
      logWarn('Data request user confirmation email failed', {
        operation: 'data_request_email_user_confirmation',
        timestamp: Date.now()
      });
    }

    return {
      success: true,
      emailId: salesEmailResult.data?.id,
    };
  } catch (error: any) {
    logError('Data request email sending failed', {
      operation: 'send_data_request_email',
      timestamp: Date.now()
    });
    
    return {
      success: false,
      error: error.message,
    };
  }
}