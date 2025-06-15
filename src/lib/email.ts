// TDD Green Step: Email service implementation

import { Resend } from 'resend';
import { ENV, diagnoseEnvironment } from './env';
import type { ContactFormData, DataRequestFormData } from './validationSchemas';

export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}

export interface EmailValidation {
  isValid: boolean;
  errors: string[];
}

// Initialize Resend client
const getResendClient = () => {
  const apiKey = ENV.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
};

export function validateEmailConfig(): EmailValidation {
  const errors: string[] = [];

  // 環境変数診断実行
  if (ENV.ENABLE_EMAIL_DEBUG) {
    diagnoseEnvironment();
  }

  // Check if RESEND_API_KEY exists
  if (!ENV.RESEND_API_KEY) {
    errors.push('RESEND_API_KEY is required');
  } else if (!ENV.RESEND_API_KEY.startsWith('re_')) {
    errors.push('RESEND_API_KEY must start with "re_"');
  }

  // Check if site URL is configured
  if (!ENV.PUBLIC_SITE_URL) {
    errors.push('PUBLIC_SITE_URL is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
    config: {
      apiKey: ENV.RESEND_API_KEY,
      siteUrl: ENV.PUBLIC_SITE_URL,
      adminEmail: ENV.ADMIN_EMAIL,
      fromEmail: ENV.FROM_EMAIL,
    },
  };
}

export async function sendContactEmail(data: ContactFormData): Promise<EmailResult> {
  try {
    const resend = getResendClient();

    // Send notification email to admin
    const adminEmailResult = await resend.emails.send({
      from: ENV.FROM_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: `お問い合わせ: ${data.subject}`,
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
      subject: 'お問い合わせありがとうございます - DeepHand',
      html: generateContactConfirmationEmailHtml(data),
      text: generateContactConfirmationEmailText(data),
    });

    if (userEmailResult.error) {
      // Admin email sent but user email failed - log warning but don't fail
      console.warn('User confirmation email failed:', userEmailResult.error.message);
    }

    return {
      success: true,
      emailId: adminEmailResult.data?.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function sendDataRequestEmail(data: DataRequestFormData): Promise<EmailResult> {
  try {
    const resend = getResendClient();

    // Send detailed request email to sales team
    const salesEmailResult = await resend.emails.send({
      from: ENV.REQUESTS_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: `データリクエスト: ${data.projectTitle}`,
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
      subject: 'データリクエストを受け付けました - DeepHand',
      html: generateDataRequestConfirmationEmailHtml(data),
      text: generateDataRequestConfirmationEmailText(data),
    });

    if (userEmailResult.error) {
      console.warn('User confirmation email failed:', userEmailResult.error.message);
    }

    return {
      success: true,
      emailId: salesEmailResult.data?.id,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Email template functions
function generateContactAdminEmailHtml(data: ContactFormData): string {
  return `
    <h2>新しいお問い合わせ</h2>
    <p><strong>お名前:</strong> ${data.name}</p>
    <p><strong>メールアドレス:</strong> ${data.email}</p>
    <p><strong>会社名:</strong> ${data.company || '未入力'}</p>
    <p><strong>件名:</strong> ${data.subject}</p>
    <p><strong>メッセージ:</strong></p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
    <p><small>送信日時: ${new Date().toLocaleString('ja-JP')}</small></p>
  `;
}

function generateContactAdminEmailText(data: ContactFormData): string {
  return `
新しいお問い合わせ

お名前: ${data.name}
メールアドレス: ${data.email}
会社名: ${data.company || '未入力'}
件名: ${data.subject}

メッセージ:
${data.message}

送信日時: ${new Date().toLocaleString('ja-JP')}
  `;
}

function generateContactConfirmationEmailHtml(data: ContactFormData): string {
  return `
    <h2>お問い合わせありがとうございます</h2>
    <p>${data.name} 様</p>
    <p>DeepHandへのお問い合わせを受け付けました。</p>
    <p>24時間以内にご返信いたします。</p>
    
    <h3>お問い合わせ内容</h3>
    <p><strong>件名:</strong> ${data.subject}</p>
    <p><strong>メッセージ:</strong></p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
    
    <p>今後ともDeepHandをよろしくお願いいたします。</p>
    <p>DeepHandチーム</p>
  `;
}

function generateContactConfirmationEmailText(data: ContactFormData): string {
  return `
お問い合わせありがとうございます

${data.name} 様

DeepHandへのお問い合わせを受け付けました。
24時間以内にご返信いたします。

お問い合わせ内容:
件名: ${data.subject}
メッセージ: ${data.message}

今後ともDeepHandをよろしくお願いいたします。

DeepHandチーム
  `;
}

function generateDataRequestAdminEmailHtml(data: DataRequestFormData): string {
  return `
    <h2>新しいデータリクエスト</h2>
    
    <h3>基本情報</h3>
    <p><strong>会社名:</strong> ${data.companyName}</p>
    <p><strong>担当者:</strong> ${data.contactPerson}</p>
    <p><strong>メールアドレス:</strong> ${data.email}</p>
    <p><strong>電話番号:</strong> ${data.phone || '未入力'}</p>
    
    <h3>プロジェクト詳細</h3>
    <p><strong>プロジェクト名:</strong> ${data.projectTitle}</p>
    <p><strong>データ種別:</strong> ${data.dataType}</p>
    <p><strong>データ量:</strong> ${data.dataVolume}</p>
    <p><strong>納期:</strong> ${data.timeline}</p>
    <p><strong>予算:</strong> ${data.budget || '未入力'}</p>
    
    <h3>データ説明</h3>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${data.dataDescription.replace(/\n/g, '<br>')}
    </div>
    
    <h3>アノテーション要件</h3>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${data.annotationRequirements.replace(/\n/g, '<br>')}
    </div>
    
    ${
      data.additionalNotes
        ? `
    <h3>追加要望</h3>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
      ${data.additionalNotes.replace(/\n/g, '<br>')}
    </div>
    `
        : ''
    }
    
    <p><strong>連絡方法:</strong> ${data.communicationPreference}</p>
    <p><small>送信日時: ${new Date().toLocaleString('ja-JP')}</small></p>
  `;
}

function generateDataRequestAdminEmailText(data: DataRequestFormData): string {
  return `
新しいデータリクエスト

基本情報:
会社名: ${data.companyName}
担当者: ${data.contactPerson}
メールアドレス: ${data.email}
電話番号: ${data.phone || '未入力'}

プロジェクト詳細:
プロジェクト名: ${data.projectTitle}
データ種別: ${data.dataType}
データ量: ${data.dataVolume}
納期: ${data.timeline}
予算: ${data.budget || '未入力'}

データ説明:
${data.dataDescription}

アノテーション要件:
${data.annotationRequirements}

${data.additionalNotes ? `追加要望:\n${data.additionalNotes}\n` : ''}

連絡方法: ${data.communicationPreference}
送信日時: ${new Date().toLocaleString('ja-JP')}
  `;
}

function generateDataRequestConfirmationEmailHtml(data: DataRequestFormData): string {
  return `
    <h2>データリクエストを受け付けました</h2>
    <p>${data.contactPerson} 様</p>
    <p>DeepHandへのデータリクエストを受け付けました。</p>
    <p>24時間以内に詳細なお見積もりとスケジュールをご返信いたします。</p>
    
    <h3>リクエスト内容</h3>
    <p><strong>プロジェクト名:</strong> ${data.projectTitle}</p>
    <p><strong>データ種別:</strong> ${data.dataType}</p>
    <p><strong>データ量:</strong> ${data.dataVolume}</p>
    <p><strong>納期:</strong> ${data.timeline}</p>
    
    <p>ご質問等ございましたら、お気軽にお問い合わせください。</p>
    <p>DeepHandチーム</p>
  `;
}

function generateDataRequestConfirmationEmailText(data: DataRequestFormData): string {
  return `
データリクエストを受け付けました

${data.contactPerson} 様

DeepHandへのデータリクエストを受け付けました。
24時間以内に詳細なお見積もりとスケジュールをご返信いたします。

リクエスト内容:
プロジェクト名: ${data.projectTitle}
データ種別: ${data.dataType}
データ量: ${data.dataVolume}
納期: ${data.timeline}

ご質問等ございましたら、お気軽にお問い合わせください。

DeepHandチーム
  `;
}
