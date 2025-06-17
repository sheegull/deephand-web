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

export async function sendDataRequestEmail(data: CurrentDataRequestFormData): Promise<EmailResult> {
  try {
    console.log('🔍 [DATA REQUEST EMAIL DEBUG] Starting email send with config:', {
      fromEmail: ENV.REQUESTS_EMAIL,
      toEmail: ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL,
      hasApiKey: !!ENV.RESEND_API_KEY,
      apiKeyPrefix: ENV.RESEND_API_KEY?.substring(0, 10) + '...',
      userEmail: data.email,
      userName: data.name
    });
    
    const resend = getResendClient();
    
    // Get language from data or default to 'ja'
    const language = (data as any).language || 'ja';
    const isJapanese = language === 'ja';

    // 🔧 TEMPORARY: Back to simple template while fixing template system
    const simpleHtml = `
<!DOCTYPE html>
<html>
<head><title>データリクエスト - DeepHand</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #1e3eb8; margin-bottom: 20px;">データリクエスト - DeepHand</h1>
        <h2 style="color: #333; border-bottom: 2px solid #234ad9; padding-bottom: 10px;">お客様情報</h2>
        <p><strong>お名前:</strong> ${data.name}</p>
        <p><strong>メールアドレス:</strong> ${data.email}</p>
        <p><strong>組織名:</strong> ${data.organization || '未入力'}</p>
        <h2 style="color: #333; border-bottom: 2px solid #234ad9; padding-bottom: 10px;">プロジェクト詳細</h2>
        <p><strong>背景・目的:</strong> ${data.backgroundPurpose}</p>
        <p><strong>データタイプ:</strong> ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}</p>
        <p><strong>データ詳細:</strong> ${data.dataDetails || '未入力'}</p>
        <p><strong>データ量:</strong> ${data.dataVolume || '未入力'}</p>
        <p><strong>締切:</strong> ${data.deadline || '未入力'}</p>
        <p><strong>予算:</strong> ${data.budget || '未入力'}</p>
        <p><strong>その他要件:</strong> ${data.otherRequirements || '未入力'}</p>
        <div style="margin-top: 30px; padding: 20px; background: #f0f7ff; border-left: 4px solid #234ad9;">
            <p><strong>対応要請:</strong> 24時間以内にご返信ください</p>
        </div>
    </div>
</body>
</html>`;

    const simpleText = `データリクエスト - DeepHand

お客様情報:
お名前: ${data.name}
メールアドレス: ${data.email}
組織名: ${data.organization || '未入力'}

プロジェクト詳細:
背景・目的: ${data.backgroundPurpose}
データタイプ: ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}
データ詳細: ${data.dataDetails || '未入力'}
データ量: ${data.dataVolume || '未入力'}
締切: ${data.deadline || '未入力'}
予算: ${data.budget || '未入力'}
その他要件: ${data.otherRequirements || '未入力'}

対応要請: 24時間以内にご返信ください`;

    // Send detailed request email to sales team
    const salesEmailResult = await resend.emails.send({
      from: ENV.REQUESTS_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: isJapanese ? 'データリクエスト - DeepHand' : 'Data Request - DeepHand',
      html: simpleHtml,
      text: simpleText,
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

    // Send confirmation email to user - 🔧 TEMPORARY: Simple styled template
    const userEmailResult = await resend.emails.send({
      from: ENV.NOREPLY_EMAIL,
      to: data.email,
      subject: isJapanese ? 'データリクエストを受け付けました - DeepHand' : 'Your data request has been received - DeepHand',
      html: `
<!DOCTYPE html>
<html>
<head><title>データリクエスト受付確認 - DeepHand</title></head>
<body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #1e3eb8; margin-bottom: 20px;">データリクエストを受け付けました</h1>
        <p>${data.name}様</p>
        <p>データアノテーション依頼を受け付けました。</p>
        <p>24時間以内に詳細なご提案をお送りいたします。</p>
        <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
        <div style="margin-top: 30px; padding: 20px; background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 4px;">
            <p style="margin: 0;"><strong>次のステップ:</strong> 担当者からの詳細な提案をお待ちください</p>
        </div>
        <br>
        <p style="color: #666;">DeepHand チーム</p>
    </div>
</body>
</html>`,
      text: `データリクエストを受け付けました

${data.name}様

データアノテーション依頼を受け付けました。
24時間以内に詳細なご提案をお送りいたします。

ご不明な点がございましたら、お気軽にお問い合わせください。

次のステップ: 担当者からの詳細な提案をお待ちください

DeepHand チーム`,
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