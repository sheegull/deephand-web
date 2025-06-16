// TDD Green Step: Email service implementation

import { Resend } from 'resend';
import { ENV, diagnoseEnvironment } from './env';
import type { ContactFormData, CurrentDataRequestFormData } from './validationSchemas';

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
      subject: 'お問い合わせ - DeepHand',
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

export async function sendDataRequestEmail(data: CurrentDataRequestFormData): Promise<EmailResult> {
  try {
    const resend = getResendClient();

    // Send detailed request email to sales team
    const salesEmailResult = await resend.emails.send({
      from: ENV.REQUESTS_EMAIL,
      to: [ENV.TEST_EMAIL_RECIPIENT || ENV.ADMIN_EMAIL],
      replyTo: data.email,
      subject: 'データリクエスト - DeepHand',
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
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - 新しいお問い合わせ</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #234ad9 0%, #1e3eb8 100%); padding: 30px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <div style="width: 24px; height: 24px; background: #ffffff; border-radius: 4px;"></div>
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">DeepHand</h1>
                            </div>
                            <p style="margin: 15px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;">新しいお問い合わせが届きました</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #234ad9; border-radius: 50%; display: inline-block;"></span>
                                    お問い合わせ詳細
                                </h2>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">お名前:</strong>
                                            <div style="color: #1e293b; font-size: 16px; margin-top: 4px;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">メールアドレス:</strong>
                                            <div style="color: #234ad9; font-size: 16px; margin-top: 4px;">
                                                <a href="mailto:${data.email}" style="color: #234ad9; text-decoration: none;">${data.email}</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">ご所属:</strong>
                                            <div style="color: #1e293b; font-size: 16px; margin-top: 4px;">${data.organization || '未入力'}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #475569; font-size: 14px;">送信日時:</strong>
                                            <div style="color: #64748b; font-size: 14px; margin-top: 4px;">${new Date().toLocaleString('ja-JP')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">お問い合わせ内容</h3>
                                <div style="background: #f8fafc; border-radius: 6px; padding: 20px; line-height: 1.6; color: #374151; font-size: 15px;">
                                    ${data.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                            
                            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 8px; border-left: 4px solid #ef4444;">
                                <p style="margin: 0; color: #7f1d1d; font-size: 14px; font-weight: 500;">
                                    <strong>📋 対応アクション:</strong><br>
                                    • 24時間以内の返信を心がけてください<br>
                                    • 必要に応じて技術チームと連携してください<br>
                                    • 詳細なヒアリングが必要な場合は電話でのフォローアップを検討してください
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1e293b; padding: 25px 30px; text-align: center;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                © 2025 DeepHand. All Rights Reserved.<br>
                                このメールはDeepHandお問い合わせフォームから自動送信されています。
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

function generateContactAdminEmailText(data: ContactFormData): string {
  return `
新しいお問い合わせ

お名前: ${data.name}
メールアドレス: ${data.email}
ご所属: ${data.organization || '未入力'}

メッセージ:
${data.message}

送信日時: ${new Date().toLocaleString('ja-JP')}
  `;
}

function generateContactConfirmationEmailHtml(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - お問い合わせありがとうございます</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #234ad9 0%, #1e3eb8 100%); padding: 40px 30px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                                <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <div style="width: 24px; height: 24px; background: #ffffff; border-radius: 4px;"></div>
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">DeepHand</h1>
                            </div>
                            <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                                <div style="color: #ffffff; font-size: 28px;">✓</div>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 400;">お問い合わせありがとうございます</h2>
                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;">ご連絡いただき、ありがとうございます</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 35px;">
                                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${data.name} 様</h3>
                                <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                    DeepHandへのお問い合わせを受け付けました。<br>
                                    <strong style="color: #234ad9;">1～2営業日以内</strong>に担当者よりご返信いたします。
                                </p>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <h4 style="margin: 0 0 20px 0; color: #1e293b; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
                                    受信内容の確認
                                </h4>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">お名前:</strong>
                                            <div style="color: #1e293b; font-size: 15px; margin-top: 4px;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">メールアドレス:</strong>
                                            <div style="color: #1e293b; font-size: 15px; margin-top: 4px;">${data.email}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">ご所属:</strong>
                                            <div style="color: #1e293b; font-size: 15px; margin-top: 4px;">${data.organization || '未入力'}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #475569; font-size: 14px;">送信日時:</strong>
                                            <div style="color: #64748b; font-size: 14px; margin-top: 4px;">${new Date().toLocaleString('ja-JP')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600;">お問い合わせ内容</h4>
                                <div style="background: #f8fafc; border-radius: 6px; padding: 20px; line-height: 1.6; color: #374151; font-size: 15px;">
                                    ${data.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; padding: 25px; border-left: 4px solid #3b82f6;">
                                <h4 style="margin: 0 0 15px 0; color: #1e3a8a; font-size: 16px; font-weight: 600;">🤖 DeepHandについて</h4>
                                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                    DeepHandは、ロボティクスに特化したアノテーション専門チームです。<br>
                                    高品質なアノテーションデータで、次世代のAI・ロボティクス開発をサポートします。<br><br>
                                    <strong>主なサービス:</strong><br>
                                    • 画像・動画アノテーション<br>
                                    • 音声・テキストデータの構造化<br>
                                    • ロボット学習データセットの構築<br>
                                    • カスタムアノテーションソリューション
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1e293b; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: 500;">
                                今後ともDeepHandをよろしくお願いいたします
                            </p>
                            <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px;">
                                DeepHandチーム
                            </p>
                            <div style="border-top: 1px solid #475569; padding-top: 20px;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                                    © 2025 DeepHand. All Rights Reserved.<br>
                                    このメールは自動送信です。返信の必要はありません。
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

function generateContactConfirmationEmailText(data: ContactFormData): string {
  return `
お問い合わせありがとうございます

${data.name} 様

DeepHandへのお問い合わせを受け付けました。
24時間以内にご返信いたします。

お問い合わせ内容:
メッセージ: ${data.message}

今後ともDeepHandをよろしくお願いいたします。

DeepHandチーム
  `;
}

function generateDataRequestAdminEmailHtml(data: CurrentDataRequestFormData): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - 新しいデータリクエスト</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="650" style="max-width: 650px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 30px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <div style="width: 24px; height: 24px; background: #ffffff; border-radius: 4px;"></div>
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">DeepHand</h1>
                            </div>
                            <div style="margin: 20px 0 10px 0;">
                                <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                    <span style="color: #ffffff; font-size: 24px;">📈</span>
                                </div>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 400;">新しいデータリクエスト</h2>
                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;">アノテーション依頼が届きました</p>
                        </td>
                    </tr>
                    
                    <!-- Priority Section -->
                    <tr>
                        <td style="padding: 30px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-bottom: 3px solid #f59e0b;">
                            <div style="text-align: center;">
                                <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 18px; font-weight: 600;">🔥 高優先度案件</h3>
                                <p style="margin: 0; color: #a16207; font-size: 14px; font-weight: 500;">
                                    データ量: <strong>${data.dataVolume}</strong> | 納期: <strong>${data.deadline}</strong> | 予算: <strong>${data.budget}</strong>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <!-- Client Info -->
                            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #7c3aed; border-radius: 50%; display: inline-block;"></span>
                                    クライアント情報
                                </h3>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">お名前:</strong>
                                            <div style="color: #1e293b; font-size: 16px; margin-top: 4px; font-weight: 600;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">ご所属:</strong>
                                            <div style="color: #7c3aed; font-size: 16px; margin-top: 4px; font-weight: 500;">${data.organization || '未入力'}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">メールアドレス:</strong>
                                            <div style="color: #7c3aed; font-size: 16px; margin-top: 4px;">
                                                <a href="mailto:${data.email}" style="color: #7c3aed; text-decoration: none; font-weight: 500;">${data.email}</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #475569; font-size: 14px;">受信日時:</strong>
                                            <div style="color: #64748b; font-size: 14px; margin-top: 4px;">${new Date().toLocaleString('ja-JP')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Project Details -->
                            <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                                <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #059669; border-radius: 50%; display: inline-block;"></span>
                                    プロジェクト詳細
                                </h3>
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">背景・目的</h4>
                                    <div style="background: #f8fafc; border-radius: 6px; padding: 20px; line-height: 1.6; color: #374151; font-size: 15px; border-left: 4px solid #059669;">
                                        ${data.backgroundPurpose.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                                
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
                                    ${Array.isArray(data.dataType) ? data.dataType.map(type => 
                                        `<span style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); color: #5b21b6; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${type}</span>`
                                    ).join('') : `<span style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); color: #5b21b6; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${data.dataType}</span>`}
                                </div>
                                
                                ${data.dataDetails ? `
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">データ詳細</h4>
                                    <div style="background: #f8fafc; border-radius: 6px; padding: 20px; line-height: 1.6; color: #374151; font-size: 15px; border-left: 4px solid #3b82f6;">
                                        ${data.dataDetails.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                                ` : ''}
                                
                                ${data.otherRequirements ? `
                                <div>
                                    <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">その他要望</h4>
                                    <div style="background: #f8fafc; border-radius: 6px; padding: 20px; line-height: 1.6; color: #374151; font-size: 15px; border-left: 4px solid #f59e0b;">
                                        ${data.otherRequirements.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- Specifications Grid -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                                <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 8px; padding: 20px; border-left: 4px solid #10b981;">
                                    <h4 style="margin: 0 0 8px 0; color: #065f46; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">データ量</h4>
                                    <p style="margin: 0; color: #059669; font-size: 18px; font-weight: 700;">${data.dataVolume}</p>
                                </div>
                                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 20px; border-left: 4px solid #f59e0b;">
                                    <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">納期</h4>
                                    <p style="margin: 0; color: #d97706; font-size: 18px; font-weight: 700;">${data.deadline}</p>
                                </div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 8px; padding: 25px; border-left: 4px solid #7c3aed; margin-bottom: 30px;">
                                <h4 style="margin: 0 0 10px 0; color: #5b21b6; font-size: 16px; font-weight: 600;">💰 予算情報</h4>
                                <p style="margin: 0; color: #6d28d9; font-size: 20px; font-weight: 700;">${data.budget}</p>
                            </div>
                            
                            <!-- Action Items -->
                            <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-radius: 8px; padding: 25px; border-left: 4px solid #ef4444;">
                                <h4 style="margin: 0 0 15px 0; color: #7f1d1d; font-size: 16px; font-weight: 600;">🎯 必要アクション</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                    <li><strong>24時間以内:</strong> 初回ヒアリングのスケジュール調整</li>
                                    <li><strong>48時間以内:</strong> 詳細な見積もりとタイムラインの提示</li>
                                    <li><strong>技術チーム連携:</strong> データ種別に応じた専門エンジニアのアサイン</li>
                                    <li><strong>品質管理:</strong> サンプルデータの作成とレビュープロセスの設計</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1e293b; padding: 25px 30px; text-align: center;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5;">
                                © 2025 DeepHand. All Rights Reserved.<br>
                                このメールはDeepHandデータリクエストフォームから自動送信されています。
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

function generateDataRequestAdminEmailText(data: CurrentDataRequestFormData): string {
  return `
新しいデータリクエスト

基本情報:
お名前: ${data.name}
ご所属: ${data.organization || '未入力'}
メールアドレス: ${data.email}

リクエスト詳細:
ご依頼の背景や目的: ${data.backgroundPurpose}
必要なデータ種別: ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}
${data.dataDetails ? `データの詳細: ${data.dataDetails}` : ''}
必要なデータ量: ${data.dataVolume}
ご希望の納期: ${data.deadline}
ご予算目安: ${data.budget}
${data.otherRequirements ? `その他、詳細やご要望: ${data.otherRequirements}` : ''}

送信日時: ${new Date().toLocaleString('ja-JP')}
  `;
}

function generateDataRequestConfirmationEmailHtml(data: CurrentDataRequestFormData): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - データリクエストを受け付けました</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center;">
                            <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                                <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                    <div style="width: 24px; height: 24px; background: #ffffff; border-radius: 4px;"></div>
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">DeepHand</h1>
                            </div>
                            <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                                <div style="color: #ffffff; font-size: 28px;">✓</div>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 400;">データリクエストを受け付けました</h2>
                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;">ご依頼いただき、ありがとうございます</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 35px;">
                                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; font-weight: 600;">${data.name} 様</h3>
                                <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6;">
                                    DeepHandへのデータリクエストを受け付けました。<br>
                                    <strong style="color: #7c3aed;">24時間以内</strong>に詳細なお見積もりとスケジュールをご返信いたします。
                                </p>
                            </div>
                            
                            <!-- Timeline -->
                            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
                                <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">📅 対応スケジュール</h4>
                                <div style="color: #1e3a8a; font-size: 14px; line-height: 1.8;">
                                    <div style="margin-bottom: 8px;">
                                        <strong>Step 1 (24時間以内):</strong> 初回ヒアリングのご連絡
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <strong>Step 2 (48時間以内):</strong> 詳細見積もりとタイムラインの提示
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <strong>Step 3:</strong> サンプルデータの作成とレビュー
                                    </div>
                                    <div>
                                        <strong>Step 4:</strong> 本格的なアノテーション作業の開始
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Request Summary -->
                            <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <h4 style="margin: 0 0 20px 0; color: #1e293b; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
                                    リクエスト内容の確認
                                </h4>
                                
                                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                                    ${Array.isArray(data.dataType) ? data.dataType.map(type => 
                                        `<span style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); color: #5b21b6; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${type}</span>`
                                    ).join('') : `<span style="background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%); color: #5b21b6; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${data.dataType}</span>`}
                                </div>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">データ量:</strong>
                                            <div style="color: #059669; font-size: 16px; margin-top: 4px; font-weight: 600;">${data.dataVolume}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">ご希望納期:</strong>
                                            <div style="color: #d97706; font-size: 16px; margin-top: 4px; font-weight: 600;">${data.deadline}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                                            <strong style="color: #475569; font-size: 14px;">ご予算:</strong>
                                            <div style="color: #7c3aed; font-size: 16px; margin-top: 4px; font-weight: 600;">${data.budget}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <strong style="color: #475569; font-size: 14px;">受付日時:</strong>
                                            <div style="color: #64748b; font-size: 14px; margin-top: 4px;">${new Date().toLocaleString('ja-JP')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- DeepHand Services -->
                            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 8px; padding: 25px; border-left: 4px solid #10b981;">
                                <h4 style="margin: 0 0 15px 0; color: #065f46; font-size: 16px; font-weight: 600;">🤖 DeepHandの強み</h4>
                                <div style="color: #047857; font-size: 14px; line-height: 1.6;">
                                    <div style="margin-bottom: 8px;">
                                        <strong>• ロボティクス特化:</strong> AI・ロボット分野の深い専門知識
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <strong>• 高品質保証:</strong> 多層的な品質管理プロセス
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <strong>• 柔軟な対応:</strong> カスタムアノテーションルールに対応
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <strong>• 迅速納期:</strong> 効率的なワークフローで短納期を実現
                                    </div>
                                    <div>
                                        <strong>• セキュア環境:</strong> データ保護とプライバシー遵守
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1e293b; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 16px; font-weight: 500;">
                                ご質問等ございましたら、お気軽にお問い合わせください
                            </p>
                            <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px;">
                                DeepHandチーム
                            </p>
                            <div style="border-top: 1px solid #475569; padding-top: 20px;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                                    © 2025 DeepHand. All Rights Reserved.<br>
                                    このメールは自動送信です。返信の必要はありません。
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

function generateDataRequestConfirmationEmailText(data: CurrentDataRequestFormData): string {
  return `
データリクエストを受け付けました

${data.name} 様

DeepHandへのデータリクエストを受け付けました。
24時間以内に詳細なお見積もりとスケジュールをご返信いたします。

リクエスト内容:
必要なデータ種別: ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}
データ量: ${data.dataVolume}
納期: ${data.deadline}
予算: ${data.budget}

ご質問等ございましたら、お気軽にお問い合わせください。

DeepHandチーム
  `;
}
