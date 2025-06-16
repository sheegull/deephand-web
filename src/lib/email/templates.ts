/**
 * Email Templates Module
 * 
 * Contains all HTML and text email templates for the application
 */

import type { ContactFormData, CurrentDataRequestFormData } from '../validationSchemas';

// Contact Form Email Templates
export function generateContactAdminEmailHtml(data: ContactFormData): string {
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

export function generateContactAdminEmailText(data: ContactFormData): string {
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

export function generateContactConfirmationEmailHtml(data: ContactFormData): string {
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
                                <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">今後の流れ</h4>
                                <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                    <li>担当者がお問い合わせ内容を確認いたします</li>
                                    <li>1～2営業日以内にメールでご返信いたします</li>
                                    <li>詳細なご相談が必要な場合は、お電話でのフォローアップをご提案する場合があります</li>
                                </ul>
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

export function generateContactConfirmationEmailText(data: ContactFormData): string {
  return `
お問い合わせありがとうございます

${data.name} 様

DeepHandへのお問い合わせを受け付けました。
1～2営業日以内に担当者よりご返信いたします。

受信内容の確認:
お名前: ${data.name}
メールアドレス: ${data.email}
ご所属: ${data.organization || '未入力'}
送信日時: ${new Date().toLocaleString('ja-JP')}

お問い合わせ内容:
${data.message}

今後の流れ:
• 担当者がお問い合わせ内容を確認いたします
• 1～2営業日以内にメールでご返信いたします
• 詳細なご相談が必要な場合は、お電話でのフォローアップをご提案する場合があります

© 2025 DeepHand. All Rights Reserved.
  `;
}

// Data Request Email Templates - Placeholder for now
export function generateDataRequestAdminEmailHtml(data: CurrentDataRequestFormData): string {
  // TODO: Move template from email.ts
  return 'Data request admin HTML template';
}

export function generateDataRequestAdminEmailText(data: CurrentDataRequestFormData): string {
  // TODO: Move template from email.ts
  return 'Data request admin text template';
}

export function generateDataRequestConfirmationEmailHtml(data: CurrentDataRequestFormData): string {
  // TODO: Move template from email.ts
  return 'Data request confirmation HTML template';
}

export function generateDataRequestConfirmationEmailText(data: CurrentDataRequestFormData): string {
  // TODO: Move template from email.ts
  return 'Data request confirmation text template';
}