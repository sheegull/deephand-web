/**
 * Email Sender Module
 * 
 * Contains core email sending functionality using Resend
 */

import { Resend } from 'resend';
import { getCloudflareEnv, diagnoseEnvironment } from '../env';
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

// Initialize Resend client with Cloudflare runtime environment
const getResendClient = (runtimeEnv?: any) => {
  const ENV = getCloudflareEnv(runtimeEnv);
  const apiKey = ENV.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
};

export async function sendContactEmail(data: ContactFormData, runtimeEnv?: any): Promise<EmailResult> {
  try {
    const ENV = getCloudflareEnv(runtimeEnv);
    const resend = getResendClient(runtimeEnv);
    
    // Get language from data or default to 'ja'
    const language = (data as any).language || 'ja';
    const isJapanese = language === 'ja';

    // Send notification email to admin
    const adminEmailResult = await resend.emails.send({
      from: ENV.FROM_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: isJapanese ? 'お問い合わせ - DeepHand' : 'Contact Inquiry - DeepHand',
      html: generateContactAdminEmailHtml(data, language),
      text: generateContactAdminEmailText(data, language),
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
      html: generateContactConfirmationEmailHtml(data, language),
      text: generateContactConfirmationEmailText(data, language),
    });

    if (userEmailResult.error) {
      // Admin email sent but user email failed - log warning but don't fail
      logWarn(`User confirmation email failed: ${userEmailResult.error.message}`, {
        operation: 'contact_email_user_confirmation',
        timestamp: Date.now(),
        userEmail: data.email,
        errorType: userEmailResult.error.name || 'unknown'
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

export async function sendDataRequestEmail(data: CurrentDataRequestFormData, runtimeEnv?: any): Promise<EmailResult> {
  try {
    const ENV = getCloudflareEnv(runtimeEnv);
    
    console.log('🔍 [DATA REQUEST EMAIL DEBUG] Starting email send with config:', {
      fromEmail: ENV.REQUESTS_EMAIL,
      toEmail: ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL,
      hasApiKey: !!ENV.RESEND_API_KEY,
      apiKeyPrefix: ENV.RESEND_API_KEY?.substring(0, 10) + '...',
      userEmail: data.email,
      userName: data.name
    });
    
    const resend = getResendClient(runtimeEnv);
    
    // Get language from data or default to 'ja'
    const language = (data as any).language || 'ja';
    const isJapanese = language === 'ja';

    // 🔧 IMPROVED: Professional template matching contact form style
    const professionalHtml = `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - ${isJapanese ? 'データリクエスト' : 'Data Request'}</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-padding { padding: 20px !important; }
            .mobile-text { font-size: 14px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #202123; color: #ffffff;">
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background: #202123; min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; background: #202123; border: 1px solid #333333; border-radius: 12px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: #202123; padding: 32px 30px; text-align: center; border-bottom: 1px solid #333333;" class="mobile-padding">
                            <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                <div style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="DeepHand Logo">
                                        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="0.5" fill="none" opacity="0.3"/>
                                        <circle cx="12" cy="12" r="8" stroke="white" stroke-width="0.8" fill="none" opacity="0.5"/>
                                        <circle cx="12" cy="12" r="6" stroke="white" stroke-width="1" fill="none" opacity="0.7"/>
                                        <circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.2" fill="none" opacity="0.9"/>
                                        <circle cx="12" cy="12" r="2" stroke="white" stroke-width="1.5" fill="none"/>
                                        <circle cx="12" cy="12" r="0.5" fill="white"/>
                                    </svg>
                                </div>
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -1px;">DeepHand</h1>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 500;">${isJapanese ? 'データリクエスト受付' : 'Data Request Received'}</h2>
                            <p style="margin: 8px 0 0 0; color: #cccccc; font-size: 14px;">${isJapanese ? '管理者様への通知メールです' : 'Administrator notification email'}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 30px;" class="mobile-padding">
                            
                            <!-- Customer Information Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Contact Icon">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${isJapanese ? 'お客様情報' : 'Customer Information'}
                                </h3>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'お名前' : 'Name'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'メールアドレス' : 'Email'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">
                                                <a href="mailto:${data.email}" style="color: #ffffff; text-decoration: none;">${data.email}</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'ご所属' : 'Organization'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.organization || (isJapanese ? '未入力' : 'Not provided')}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? '送信日時' : 'Submitted At'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Project Details Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Project Icon">
                                        <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2"/>
                                    </svg>
                                    ${isJapanese ? 'プロジェクト詳細' : 'Project Details'}
                                </h3>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? '背景・目的' : 'Background & Purpose'}</div>
                                            <div style="color: #ffffff; font-size: 14px; line-height: 1.5;">${data.backgroundPurpose}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'データタイプ' : 'Data Type'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'データ詳細' : 'Data Details'}</div>
                                            <div style="color: #ffffff; font-size: 14px; line-height: 1.5;">${data.dataDetails || (isJapanese ? '未入力' : 'Not provided')}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'データ量' : 'Data Volume'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.dataVolume || (isJapanese ? '未入力' : 'Not provided')}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? '希望納期' : 'Deadline'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.deadline || (isJapanese ? '未入力' : 'Not provided')}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'ご予算' : 'Budget'}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.budget || (isJapanese ? '未入力' : 'Not provided')}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${isJapanese ? 'その他要件' : 'Other Requirements'}</div>
                                            <div style="color: #ffffff; font-size: 14px; line-height: 1.5;">${data.otherRequirements || (isJapanese ? '未入力' : 'Not provided')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Action Required Section -->
                            <div style="background: #2a4a3a; border: 1px solid #4a6741; border-radius: 8px; padding: 24px;">
                                <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Action Icon">
                                        <circle cx="12" cy="12" r="10" stroke="#4ade80" stroke-width="2"/>
                                        <path d="M12 6V12L16 14" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${isJapanese ? '対応要請' : 'Action Required'}
                                </h3>
                                <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.5;">
                                    ${isJapanese ? '24時間以内にお客様へご返信ください。データリクエストの詳細を確認し、適切な提案を準備してください。' : 'Please respond to the customer within 24 hours. Review the data request details and prepare an appropriate proposal.'}
                                </p>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1a1a1a; padding: 24px 30px; text-align: center; border-top: 1px solid #333333;" class="mobile-padding">
                            <p style="margin: 0; color: #888888; font-size: 12px;">
                                ${isJapanese ? 'このメールは DeepHand システムから自動送信されています。' : 'This email is automatically sent from the DeepHand system.'}
                            </p>
                            <p style="margin: 8px 0 0 0; color: #666666; font-size: 11px;">
                                © 2025 DeepHand. All Rights Reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    const professionalText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DeepHand - ${isJapanese ? 'データリクエスト受付' : 'Data Request Received'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${isJapanese ? '管理者様への通知メールです' : 'Administrator notification email'}

【${isJapanese ? 'お客様情報' : 'Customer Information'}】
${isJapanese ? 'お名前' : 'Name'}: ${data.name}
${isJapanese ? 'メールアドレス' : 'Email'}: ${data.email}
${isJapanese ? 'ご所属' : 'Organization'}: ${data.organization || (isJapanese ? '未入力' : 'Not provided')}
${isJapanese ? '送信日時' : 'Submitted At'}: ${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}

【${isJapanese ? 'プロジェクト詳細' : 'Project Details'}】
${isJapanese ? '背景・目的' : 'Background & Purpose'}: 
${data.backgroundPurpose}

${isJapanese ? 'データタイプ' : 'Data Type'}: ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}

${isJapanese ? 'データ詳細' : 'Data Details'}: 
${data.dataDetails || (isJapanese ? '未入力' : 'Not provided')}

${isJapanese ? 'データ量' : 'Data Volume'}: ${data.dataVolume || (isJapanese ? '未入力' : 'Not provided')}
${isJapanese ? '希望納期' : 'Deadline'}: ${data.deadline || (isJapanese ? '未入力' : 'Not provided')}
${isJapanese ? 'ご予算' : 'Budget'}: ${data.budget || (isJapanese ? '未入力' : 'Not provided')}

${isJapanese ? 'その他要件' : 'Other Requirements'}: 
${data.otherRequirements || (isJapanese ? '未入力' : 'Not provided')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【${isJapanese ? '対応要請' : 'Action Required'}】
${isJapanese ? '24時間以内にお客様へご返信ください。データリクエストの詳細を確認し、適切な提案を準備してください。' : 'Please respond to the customer within 24 hours. Review the data request details and prepare an appropriate proposal.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

© 2025 DeepHand. All Rights Reserved.
${isJapanese ? 'このメールは DeepHand システムから自動送信されています。' : 'This email is automatically sent from the DeepHand system.'}
`;

    // Send detailed request email to sales team
    const salesEmailResult = await resend.emails.send({
      from: ENV.REQUESTS_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: isJapanese ? 'データリクエスト - DeepHand' : 'Data Request - DeepHand',
      html: professionalHtml,
      text: professionalText,
    });

    if (salesEmailResult.error) {
      console.error('🔍 [RESEND ERROR DEBUG] Sales email failed:', {
        error: salesEmailResult.error,
        errorMessage: salesEmailResult.error.message,
        errorName: salesEmailResult.error.name,
        fullError: JSON.stringify(salesEmailResult.error, null, 2)
      });
      
      logError('Sales email failed with detailed error', {
        operation: 'send_data_request_sales_email',
        timestamp: Date.now(),
        errorMessage: salesEmailResult.error.message,
        errorName: salesEmailResult.error.name,
        resendError: salesEmailResult.error
      });
      
      return {
        success: false,
        error: salesEmailResult.error.message,
      };
    }

    // Send confirmation email to user using templates.ts functions

    const userEmailResult = await resend.emails.send({
      from: ENV.NOREPLY_EMAIL,
      to: data.email,
      subject: isJapanese ? 'データリクエストを受け付けました - DeepHand' : 'Your data request has been received - DeepHand',
      html: generateDataRequestConfirmationEmailHtml(data, language),
      text: generateDataRequestConfirmationEmailText(data, language),
    });

    if (userEmailResult.error) {
      logWarn(`Data request user confirmation email failed: ${userEmailResult.error.message}`, {
        operation: 'data_request_email_user_confirmation',
        timestamp: Date.now(),
        userEmail: data.email,
        errorType: userEmailResult.error.name || 'unknown'
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