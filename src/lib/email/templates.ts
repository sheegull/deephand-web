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
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .padding { padding: 20px !important; }
            .header-padding { padding: 25px 20px !important; }
            .content-padding { padding: 30px 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); min-height: 100vh;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 50px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #234ad9 0%, #1e3eb8 100%); padding: 40px 30px; text-align: center; position: relative;" class="header-padding">
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grid\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><path d=\"M 10 0 L 0 0 0 10\" fill=\"none\" stroke=\"rgba(255,255,255,0.05)\" stroke-width=\"0.5\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grid)\"/></svg>'); opacity: 0.3;"></div>
                            <div style="position: relative; z-index: 1;">
                                <div style="display: inline-flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.2);">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">DeepHand</h1>
                                </div>
                                <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(10px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; border: 2px solid rgba(255, 255, 255, 0.2);">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 500; letter-spacing: -0.5px;">新しいお問い合わせ</h2>
                                <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 300;">管理者様への通知メールです</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;" class="content-padding">
                            <div style="background: linear-gradient(135deg, rgba(35, 74, 217, 0.03) 0%, rgba(30, 62, 184, 0.05) 100%); border: 1px solid rgba(35, 74, 217, 0.08); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative;">
                                <div style="position: absolute; top: -1px; left: -1px; right: -1px; height: 2px; background: linear-gradient(90deg, #234ad9, #1e3eb8); border-radius: 16px 16px 0 0;"></div>
                                <h2 style="margin: 0 0 24px 0; color: #1A1A1A; font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 12px; letter-spacing: -0.3px;">
                                    <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #234ad9, #1e3eb8); border-radius: 50%; box-shadow: 0 2px 8px rgba(35, 74, 217, 0.3);"></div>
                                    お問い合わせ詳細
                                </h2>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(26, 26, 26, 0.06);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <circle cx="12" cy="7" r="4" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">お名前</strong>
                                            </div>
                                            <div style="color: #1A1A1A; font-size: 16px; font-weight: 500; margin-left: 24px;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(26, 26, 26, 0.06);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <polyline points="22,6 12,13 2,6" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">メールアドレス</strong>
                                            </div>
                                            <div style="margin-left: 24px;">
                                                <a href="mailto:${data.email}" style="color: #234ad9; text-decoration: none; font-size: 16px; font-weight: 500; padding: 6px 12px; background: rgba(35, 74, 217, 0.05); border-radius: 6px; display: inline-block; transition: all 0.2s ease;">${data.email}</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(26, 26, 26, 0.06);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <polyline points="9,22 9,12 15,12 15,22" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">ご所属</strong>
                                            </div>
                                            <div style="color: #1A1A1A; font-size: 16px; font-weight: 500; margin-left: 24px;">${data.organization || '未入力'}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0;">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" stroke="#64748B" stroke-width="2"/>
                                                    <polyline points="12,6 12,12 16,14" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">送信日時</strong>
                                            </div>
                                            <div style="color: #64748B; font-size: 14px; margin-left: 24px;">${new Date().toLocaleString('ja-JP')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: #ffffff; border: 1px solid rgba(26, 26, 26, 0.08); border-radius: 16px; padding: 32px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);">
                                <h3 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 12px; letter-spacing: -0.3px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#234ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <polyline points="14,2 14,8 20,8" stroke="#234ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    お問い合わせ内容
                                </h3>
                                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f3f4 100%); border-radius: 12px; padding: 24px; line-height: 1.7; color: #374151; font-size: 15px; border: 1px solid rgba(26, 26, 26, 0.04);">
                                    ${data.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.03) 0%, rgba(248, 113, 113, 0.05) 100%); border: 1px solid rgba(239, 68, 68, 0.1); border-radius: 16px; padding: 28px; position: relative;">
                                <div style="position: absolute; top: -1px; left: -1px; right: -1px; height: 2px; background: linear-gradient(90deg, #ef4444, #f87171); border-radius: 16px 16px 0 0;"></div>
                                <div style="display: flex; align-items: flex-start; gap: 16px;">
                                    <div style="flex-shrink: 0; width: 48px; height: 48px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 11H15M9 15H15M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 style="margin: 0 0 16px 0; color: #7f1d1d; font-size: 16px; font-weight: 600;">対応アクション</h4>
                                        <ul style="margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px; line-height: 1.6; list-style: none;">
                                            <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                                <span style="width: 6px; height: 6px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></span>
                                                24時間以内の返信を心がけてください
                                            </li>
                                            <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                                                <span style="width: 6px; height: 6px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></span>
                                                必要に応じて技術チームと連携してください
                                            </li>
                                            <li style="display: flex; align-items: center; gap: 8px;">
                                                <span style="width: 6px; height: 6px; background: #ef4444; border-radius: 50%; flex-shrink: 0;"></span>
                                                詳細なヒアリングが必要な場合は電話でのフォローアップを検討してください
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1A1A1A; padding: 32px 40px; text-align: center;" class="content-padding">
                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <span style="color: #ffffff; font-size: 18px; font-weight: 500;">DeepHand</span>
                                </div>
                            </div>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 12px; line-height: 1.6;">
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      DeepHand
             新しいお問い合わせが届きました
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📩 新しいお問い合わせが届きました。以下の詳細をご確認ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                お問い合わせ詳細情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ お名前: ${data.name}
▸ メールアドレス: ${data.email}
▸ ご所属: ${data.organization || '未入力'}
▸ 送信日時: ${new Date().toLocaleString('ja-JP')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  対応アクション
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ 迅速な対応をお願いいたします:

• 24時間以内の返信を心がけてください
• 必要に応じて技術チームと連携してください  
• 詳細なヒアリングが必要な場合は電話でのフォローアップを
  検討してください

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは DeepHand お問い合わせフォームから自動送信されています。
© 2025 DeepHand. All Rights Reserved.
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
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .padding { padding: 20px !important; }
            .header-padding { padding: 30px 20px !important; }
            .content-padding { padding: 30px 20px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); min-height: 100vh;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%); min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 50px 20px;">
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="container" style="max-width: 600px; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(20px); border-radius: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #234ad9 0%, #1e3eb8 100%); padding: 50px 30px; text-align: center; position: relative;" class="header-padding">
                            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grid\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><path d=\"M 10 0 L 0 0 0 10\" fill=\"none\" stroke=\"rgba(255,255,255,0.05)\" stroke-width=\"0.5\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grid)\"/></svg>'); opacity: 0.3;"></div>
                            <div style="position: relative; z-index: 1;">
                                <div style="display: inline-flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                                    <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.2);">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">DeepHand</h1>
                                </div>
                                <div style="width: 100px; height: 100px; background: rgba(16, 185, 129, 0.15); backdrop-filter: blur(10px); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 3px solid rgba(16, 185, 129, 0.3); position: relative;">
                                    <div style="position: absolute; inset: -6px; border-radius: 50%; background: conic-gradient(from 0deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.3)); animation: spin 3s linear infinite;"></div>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; z-index: 1;">
                                        <path d="M9 12L11 14L15 10" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/>
                                    </svg>
                                </div>
                                <h2 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 500; letter-spacing: -0.5px;">お問い合わせありがとうございます</h2>
                                <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 300;">ご連絡いただき、ありがとうございます</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;" class="content-padding">
                            <div style="text-align: center; margin-bottom: 40px;">
                                <div style="display: inline-flex; align-items: center; gap: 12px; padding: 16px 24px; background: linear-gradient(135deg, rgba(35, 74, 217, 0.05) 0%, rgba(30, 62, 184, 0.08) 100%); border: 1px solid rgba(35, 74, 217, 0.1); border-radius: 12px; margin-bottom: 20px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#234ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="#234ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <h3 style="margin: 0; color: #234ad9; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">${data.name} 様</h3>
                                </div>
                                <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.7;">
                                    DeepHandへのお問い合わせを受け付けました。<br>
                                    <strong style="color: #234ad9; font-weight: 600;">1～2営業日以内</strong>に担当者よりご返信いたします。
                                </p>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(5, 150, 105, 0.05) 100%); border: 1px solid rgba(16, 185, 129, 0.08); border-radius: 16px; padding: 32px; margin-bottom: 32px; position: relative;">
                                <div style="position: absolute; top: -1px; left: -1px; right: -1px; height: 2px; background: linear-gradient(90deg, #10b981, #059669); border-radius: 16px 16px 0 0;"></div>
                                <h4 style="margin: 0 0 24px 0; color: #1A1A1A; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 12px; letter-spacing: -0.3px;">
                                    <div style="width: 12px; height: 12px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);"></div>
                                    受信内容の確認
                                </h4>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(26, 26, 26, 0.06);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <circle cx="12" cy="7" r="4" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">お名前</strong>
                                            </div>
                                            <div style="color: #1A1A1A; font-size: 16px; font-weight: 500; margin-left: 24px;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(26, 26, 26, 0.06);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <polyline points="22,6 12,13 2,6" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">メールアドレス</strong>
                                            </div>
                                            <div style="color: #1A1A1A; font-size: 15px; margin-left: 24px;">${data.email}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid rgba(26, 26, 26, 0.06);">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <polyline points="9,22 9,12 15,12 15,22" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">ご所属</strong>
                                            </div>
                                            <div style="color: #1A1A1A; font-size: 15px; margin-left: 24px;">${data.organization || '未入力'}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0;">
                                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" stroke="#64748B" stroke-width="2"/>
                                                    <polyline points="12,6 12,12 16,14" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <strong style="color: #64748B; font-size: 14px; font-weight: 500;">送信日時</strong>
                                            </div>
                                            <div style="color: #64748B; font-size: 14px; margin-left: 24px;">${new Date().toLocaleString('ja-JP')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: #ffffff; border: 1px solid rgba(26, 26, 26, 0.08); border-radius: 16px; padding: 32px; margin-bottom: 32px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);">
                                <h4 style="margin: 0 0 20px 0; color: #1A1A1A; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 12px; letter-spacing: -0.3px;">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#234ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <polyline points="14,2 14,8 20,8" stroke="#234ad9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    お問い合わせ内容
                                </h4>
                                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f3f4 100%); border-radius: 12px; padding: 24px; line-height: 1.7; color: #374151; font-size: 15px; border: 1px solid rgba(26, 26, 26, 0.04);">
                                    ${data.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(37, 99, 235, 0.05) 100%); border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 16px; padding: 28px; position: relative;">
                                <div style="position: absolute; top: -1px; left: -1px; right: -1px; height: 2px; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 16px 16px 0 0;"></div>
                                <div style="display: flex; align-items: flex-start; gap: 16px;">
                                    <div style="flex-shrink: 0; width: 48px; height: 48px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px; font-weight: 600;">今後の流れ</h4>
                                        <ul style="margin: 0; padding-left: 0; color: #1e40af; font-size: 14px; line-height: 1.6; list-style: none;">
                                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                                <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                                                    <span style="color: #3b82f6; font-size: 12px; font-weight: 600;">1</span>
                                                </div>
                                                <span>担当者がお問い合わせ内容を確認いたします</span>
                                            </li>
                                            <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 12px;">
                                                <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                                                    <span style="color: #3b82f6; font-size: 12px; font-weight: 600;">2</span>
                                                </div>
                                                <span>1～2営業日以内にメールでご返信いたします</span>
                                            </li>
                                            <li style="display: flex; align-items: flex-start; gap: 12px;">
                                                <div style="flex-shrink: 0; width: 24px; height: 24px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                                                    <span style="color: #3b82f6; font-size: 12px; font-weight: 600;">3</span>
                                                </div>
                                                <span>詳細なご相談が必要な場合は、お電話でのフォローアップをご提案する場合があります</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1A1A1A; padding: 32px 40px; text-align: center;" class="content-padding">
                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-flex; align-items: center; gap: 12px;">
                                    <div style="width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                            <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <span style="color: #ffffff; font-size: 18px; font-weight: 500;">DeepHand</span>
                                </div>
                            </div>
                            <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 12px; line-height: 1.6;">
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      DeepHand
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ お問い合わせありがとうございます

${data.name} 様

この度は、DeepHandへのお問い合わせをいただき、誠にありがとうございます。
お問い合わせを受け付けました。1～2営業日以内に担当者よりご返信いたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  受信内容の確認
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▸ お名前: ${data.name}
▸ メールアドレス: ${data.email}
▸ ご所属: ${data.organization || '未入力'}
▸ 送信日時: ${new Date().toLocaleString('ja-JP')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  今後の流れ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 担当者がお問い合わせ内容を確認いたします
2. 1～2営業日以内にメールでご返信いたします
3. 詳細なご相談が必要な場合は、お電話でのフォローアップを
   ご提案する場合があります

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは DeepHand お問い合わせフォームから自動送信されています。
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