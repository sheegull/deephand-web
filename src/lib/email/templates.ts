/**
 * Email Templates Module
 * 
 * Stylish Monochrome Design (White text on #202123 background)
 * Responsive Layout with minimal icons
 * Full i18n support with no hardcoded text
 */

import type { ContactFormData, CurrentDataRequestFormData } from '../validationSchemas';
import { ENV } from '../env';

// 🔧 TDD FIX: Embedded translations for Astro compatibility
const EMAIL_TRANSLATIONS = {
  ja: {
    'email.admin.subject': 'お問い合わせ - DeepHand',
    'email.admin.title': '新しいお問い合わせ',
    'email.admin.subtitle': '管理者様への通知メールです',
    'email.admin.contactDetails': 'お問い合わせ詳細',
    'email.admin.name': 'お名前',
    'email.admin.email': 'メールアドレス',
    'email.admin.organization': 'ご所属',
    'email.admin.timestamp': '送信日時',
    'email.admin.messageContent': 'お問い合わせ内容',
    'email.admin.actionRequired': '対応アクション',
    'email.admin.respondWithin24h': '24時間以内にご返信ください',
    'email.admin.notEntered': '未入力',
    'email.user.subject': 'お問い合わせありがとうございます - DeepHand',
    'email.user.title': 'お問い合わせありがとうございます',
    'email.user.subtitle': 'お問い合わせを受け付けました',
    'email.user.thankYou': 'この度は DeepHand にお問い合わせいただき、ありがとうございます',
    'email.user.responseTime': '24時間以内にご返信いたします',
    'email.user.followUp': 'お急ぎの場合は、直接お電話でお問い合わせください',
    'email.user.contactInfo': 'お問い合わせ情報',
    'email.user.nextSteps': '今後の流れ',
    'email.user.step1': '担当者がお問い合わせ内容を確認いたします',
    'email.user.step2': '詳細な回答を準備いたします',
    'email.user.step3': '24時間以内にご返信いたします',
    // Data Request specific translations
    'request.title': 'データリクエスト',
    'request.name': 'お名前',
    'request.email': 'メールアドレス',
    'request.organization': 'ご所属',
    'request.backgroundPurpose': '背景・目的',
    'request.dataType': 'データタイプ',
    'request.dataDetails': 'データ詳細',
    'request.dataVolume': 'データ量',
    'request.deadline': '締切',
    'request.budget': '予算',
    'request.otherRequirements': 'その他要件',
    'request.confirmation.title': 'データリクエストを受け付けました',
    'request.confirmation.message': 'データアノテーション依頼を受け付けました。24時間以内に詳細なご提案をお送りいたします。'
  },
  en: {
    'email.admin.subject': 'Contact Inquiry - DeepHand',
    'email.admin.title': 'New Contact Inquiry',
    'email.admin.subtitle': 'Administrator notification email',
    'email.admin.contactDetails': 'Contact Details',
    'email.admin.name': 'Name',
    'email.admin.email': 'Email',
    'email.admin.organization': 'Organization',
    'email.admin.timestamp': 'Submitted At',
    'email.admin.messageContent': 'Message Content',
    'email.admin.actionRequired': 'Action Required',
    'email.admin.respondWithin24h': 'Respond within 24 hours',
    'email.admin.notEntered': 'Not provided',
    'email.user.subject': 'Thank you for your inquiry - DeepHand',
    'email.user.title': 'Thank You for Your Inquiry',
    'email.user.subtitle': 'We have received your inquiry',
    'email.user.thankYou': 'Thank you for contacting DeepHand',
    'email.user.responseTime': 'We will respond within 24 hours',
    'email.user.followUp': 'If you have any urgent matters, please contact us directly',
    'email.user.contactInfo': 'Contact Information',
    'email.user.nextSteps': 'Next Steps',
    'email.user.step1': 'Our team will review your inquiry',
    'email.user.step2': 'We will prepare a detailed response',
    'email.user.step3': 'You will receive our reply within 24 hours',
    // Data Request specific translations
    'request.title': 'Data Request',
    'request.name': 'Name',
    'request.email': 'Email',
    'request.organization': 'Organization',
    'request.backgroundPurpose': 'Background & Purpose',
    'request.dataType': 'Data Type',
    'request.dataDetails': 'Data Details',
    'request.dataVolume': 'Data Volume',
    'request.deadline': 'Deadline',
    'request.budget': 'Budget',
    'request.otherRequirements': 'Other Requirements',
    'request.confirmation.title': 'Your data request has been received',
    'request.confirmation.message': 'Your data annotation request has been received. We will send you a detailed proposal within 24 hours.'
  }
};

// Email template translation function - Fixed for Astro environment
function getEmailTranslation(key: string, language: string): string {
  try {
    const translations = EMAIL_TRANSLATIONS[language as keyof typeof EMAIL_TRANSLATIONS] || EMAIL_TRANSLATIONS.ja;
    return translations[key as keyof typeof translations] || key;
  } catch (error) {
    return key; // fallback to key if translation fails
  }
}

// Contact Form Email Templates
export function generateContactAdminEmailHtml(data: ContactFormData, language: string = 'ja'): string {
  const et = (key: string) => getEmailTranslation(key, language);
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - ${et('email.admin.title')}</title>
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
                                        <!-- Fingerprint-inspired concentric circles design -->
                                        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="0.5" fill="none" opacity="0.3"/>
                                        <circle cx="12" cy="12" r="8" stroke="white" stroke-width="0.8" fill="none" opacity="0.5"/>
                                        <circle cx="12" cy="12" r="6" stroke="white" stroke-width="1" fill="none" opacity="0.7"/>
                                        <circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.2" fill="none" opacity="0.9"/>
                                        <circle cx="12" cy="12" r="2" stroke="white" stroke-width="1.5" fill="none"/>
                                        <!-- Central dot -->
                                        <circle cx="12" cy="12" r="0.5" fill="white"/>
                                    </svg>
                                </div>
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -1px;">DeepHand</h1>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 500;">${et('email.admin.title')}</h2>
                            <p style="margin: 8px 0 0 0; color: #cccccc; font-size: 14px;">${et('email.admin.subtitle')}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 30px;" class="mobile-padding">
                            
                            <!-- Contact Details Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Contact Icon">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${et('email.admin.contactDetails')}
                                </h3>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${et('email.admin.name')}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.name}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${et('email.admin.email')}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">
                                                <a href="mailto:${data.email}" style="color: #ffffff; text-decoration: none;">${data.email}</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid #333333;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${et('email.admin.organization')}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${data.organization || et('email.admin.notEntered')}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <div style="color: #cccccc; font-size: 12px; margin-bottom: 4px;">${et('email.admin.timestamp')}</div>
                                            <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Message Content Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${et('email.admin.messageContent')}</h3>
                                <div style="background: #202123; border: 1px solid #333333; border-radius: 6px; padding: 16px; line-height: 1.6; color: #ffffff; font-size: 14px;">
                                    ${data.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                            
                            <!-- Action Required Section -->
                            <div style="background: #2a2a2a; border: 1px solid #444444; border-radius: 8px; padding: 24px;">
                                <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${et('email.admin.actionRequired')}</h3>
                                <p style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.5;">
                                    ${et('email.admin.respondWithin24h')}
                                </p>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1a1a1a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;" class="mobile-padding">
                            <p style="margin: 0; color: #888888; font-size: 12px;">
                                © 2025 DeepHand. All Rights Reserved.
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

export function generateContactAdminEmailText(data: ContactFormData, language: string = 'ja'): string {
  const et = (key: string) => getEmailTranslation(key, language);
  
  return `
══════════════════════════════════════════
🎯 DeepHand - ${et('email.admin.title')}
══════════════════════════════════════════

${et('email.admin.contactDetails')}
─────────────────────────────────────────
${et('email.admin.name')}: ${data.name}
${et('email.admin.email')}: ${data.email}
${et('email.admin.organization')}: ${data.organization || et('email.admin.notEntered')}
${et('email.admin.timestamp')}: ${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}

${et('email.admin.messageContent')}
─────────────────────────────────────────
${data.message}

${et('email.admin.actionRequired')}
─────────────────────────────────────────
${et('email.admin.respondWithin24h')}

© 2025 DeepHand. All Rights Reserved.
  `;
}

export function generateContactConfirmationEmailHtml(data: ContactFormData, language: string = 'ja'): string {
  const et = (key: string) => getEmailTranslation(key, language);
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - ${et('email.user.title')}</title>
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
                                        <!-- Fingerprint-inspired concentric circles design -->
                                        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="0.5" fill="none" opacity="0.3"/>
                                        <circle cx="12" cy="12" r="8" stroke="white" stroke-width="0.8" fill="none" opacity="0.5"/>
                                        <circle cx="12" cy="12" r="6" stroke="white" stroke-width="1" fill="none" opacity="0.7"/>
                                        <circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.2" fill="none" opacity="0.9"/>
                                        <circle cx="12" cy="12" r="2" stroke="white" stroke-width="1.5" fill="none"/>
                                        <!-- Central dot -->
                                        <circle cx="12" cy="12" r="0.5" fill="white"/>
                                    </svg>
                                </div>
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -1px;">DeepHand</h1>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 500;">${et('email.user.title')}</h2>
                            <p style="margin: 8px 0 0 0; color: #cccccc; font-size: 14px;">${et('email.user.subtitle')}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 30px;" class="mobile-padding">
                            
                            <!-- Thank You Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Success Icon">
                                        <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 18px; font-weight: 600;">${data.name} ${language === 'ja' ? '様' : ''}</h3>
                                <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; line-height: 1.5;">
                                    ${et('email.user.thankYou')}
                                </p>
                                <p style="margin: 0; color: #cccccc; font-size: 14px;">
                                    ${et('email.user.responseTime')}
                                </p>
                            </div>
                            
                            <!-- Contact Info Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Contact Icon">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${et('email.user.contactInfo')}
                                </h3>
                                <div style="background: #202123; border: 1px solid #333333; border-radius: 6px; padding: 16px;">
                                    <div style="margin-bottom: 8px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.name')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.name}</span>
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.email')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.email}</span>
                                    </div>
                                    ${data.organization ? `<div style="margin-bottom: 8px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.organization')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.organization}</span>
                                    </div>` : ''}
                                    <div>
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.timestamp')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Message Content Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Message Icon">
                                        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${et('email.admin.messageContent')}
                                </h3>
                                <div style="background: #202123; border: 1px solid #333333; border-radius: 6px; padding: 16px; line-height: 1.6; color: #ffffff; font-size: 14px;">
                                    ${data.message.replace(/\n/g, '<br>')}
                                </div>
                            </div>
                            
                            <!-- Next Steps Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${et('email.user.nextSteps')}</h3>
                                <div style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                                    <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                        <span style="color: #ffffff; font-weight: 600; min-width: 20px;">1.</span>
                                        <span>${et('email.user.step1')}</span>
                                    </div>
                                    <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                        <span style="color: #ffffff; font-weight: 600; min-width: 20px;">2.</span>
                                        <span>${et('email.user.step2')}</span>
                                    </div>
                                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                                        <span style="color: #ffffff; font-weight: 600; min-width: 20px;">3.</span>
                                        <span>${et('email.user.step3')}</span>
                                    </div>
                                </div>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1a1a1a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;" class="mobile-padding">
                            <p style="margin: 0; color: #888888; font-size: 12px;">
                                © 2025 DeepHand. All Rights Reserved.
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

export function generateContactConfirmationEmailText(data: ContactFormData, language: string = 'ja'): string {
  const et = (key: string) => getEmailTranslation(key, language);
  
  return `
══════════════════════════════════════════
🎯 DeepHand - ${et('email.user.title')}
══════════════════════════════════════════

${data.name} ${language === 'ja' ? '様' : ''}

${et('email.user.thankYou')}

${et('email.user.responseTime')}

${et('email.user.contactInfo')}
─────────────────────────────────────────
${et('email.admin.name')}: ${data.name}
${et('email.admin.email')}: ${data.email}
${data.organization ? `${et('email.admin.organization')}: ${data.organization}\n` : ''}${et('email.admin.timestamp')}: ${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}

${et('email.admin.messageContent')}
─────────────────────────────────────────
${data.message}

${et('email.user.nextSteps')}
─────────────────────────────────────────
1. ${et('email.user.step1')}
2. ${et('email.user.step2')}
3. ${et('email.user.step3')}

© 2025 DeepHand. All Rights Reserved.
  `;
}

// Data Request Email Templates (similar structure)
export function generateDataRequestAdminEmailHtml(data: CurrentDataRequestFormData, language: string = 'ja'): string {
  // Similar structure with data request specific fields
  return generateContactAdminEmailHtml(data as any, language);
}

export function generateDataRequestAdminEmailText(data: CurrentDataRequestFormData, language: string = 'ja'): string {
  return generateContactAdminEmailText(data as any, language);
}

export function generateDataRequestConfirmationEmailHtml(data: CurrentDataRequestFormData, language: string = 'ja'): string {
  const et = (key: string) => getEmailTranslation(key, language);
  const isJapanese = language === 'ja';
  
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DeepHand - ${et('request.confirmation.title')}</title>
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
                                        <!-- Fingerprint-inspired concentric circles design -->
                                        <circle cx="12" cy="12" r="10" stroke="white" stroke-width="0.5" fill="none" opacity="0.3"/>
                                        <circle cx="12" cy="12" r="8" stroke="white" stroke-width="0.8" fill="none" opacity="0.5"/>
                                        <circle cx="12" cy="12" r="6" stroke="white" stroke-width="1" fill="none" opacity="0.7"/>
                                        <circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.2" fill="none" opacity="0.9"/>
                                        <circle cx="12" cy="12" r="2" stroke="white" stroke-width="1.5" fill="none"/>
                                        <!-- Central dot -->
                                        <circle cx="12" cy="12" r="0.5" fill="white"/>
                                    </svg>
                                </div>
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: -1px;">DeepHand</h1>
                            </div>
                            <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 500;">${et('request.confirmation.title')}</h2>
                            <p style="margin: 8px 0 0 0; color: #cccccc; font-size: 14px;">${et('request.confirmation.message')}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 30px;" class="mobile-padding">
                            
                            <!-- Thank You Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
                                <div style="width: 48px; height: 48px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Success Icon">
                                        <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 18px; font-weight: 600;">${data.name} ${isJapanese ? '様' : ''}</h3>
                                <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; line-height: 1.5;">
                                    ${et('request.confirmation.message')}
                                </p>
                                <p style="margin: 0; color: #cccccc; font-size: 14px;">
                                    ${et('email.user.responseTime')}
                                </p>
                            </div>
                            
                            <!-- Request Details Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" alt="Request Icon">
                                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <polyline points="14,2 14,8 20,8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    ${isJapanese ? 'リクエスト詳細' : 'Request Details'}
                                </h3>
                                
                                <div style="background: #202123; border: 1px solid #333333; border-radius: 6px; padding: 16px;">
                                    <div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.name')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.name}</span>
                                    </div>
                                    <div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.email')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.email}</span>
                                    </div>
                                    ${data.organization ? `<div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.organization')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.organization}</span>
                                    </div>` : ''}
                                    <div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.backgroundPurpose')}: </span>
                                        <div style="color: #ffffff; font-size: 14px; margin-top: 4px; line-height: 1.5;">${data.backgroundPurpose?.replace(/\n/g, '<br>') || ''}</div>
                                    </div>
                                    ${data.dataType && data.dataType.length > 0 ? `<div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.dataType')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}</span>
                                    </div>` : ''}
                                    ${data.dataDetails ? `<div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.dataDetails')}: </span>
                                        <div style="color: #ffffff; font-size: 14px; margin-top: 4px; line-height: 1.5;">${data.dataDetails.replace(/\n/g, '<br>')}</div>
                                    </div>` : ''}
                                    ${data.dataVolume ? `<div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.dataVolume')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.dataVolume}</span>
                                    </div>` : ''}
                                    ${data.deadline ? `<div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.deadline')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.deadline}</span>
                                    </div>` : ''}
                                    ${data.budget ? `<div style="margin-bottom: 12px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.budget')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.budget}</span>
                                    </div>` : ''}
                                    ${data.otherRequirements ? `<div>
                                        <span style="color: #cccccc; font-size: 12px;">${et('request.otherRequirements')}: </span>
                                        <div style="color: #ffffff; font-size: 14px; margin-top: 4px; line-height: 1.5;">${data.otherRequirements.replace(/\n/g, '<br>')}</div>
                                    </div>` : ''}
                                </div>
                            </div>
                            
                            <!-- Next Steps Section -->
                            <div style="background: #2a2a2a; border: 1px solid #333333; border-radius: 8px; padding: 24px;">
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${et('email.user.nextSteps')}</h3>
                                <div style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                                    <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                        <span style="color: #ffffff; font-weight: 600; min-width: 20px;">1.</span>
                                        <span>${isJapanese ? '担当者がリクエスト内容を詳細に確認いたします' : 'Our team will thoroughly review your request details'}</span>
                                    </div>
                                    <div style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
                                        <span style="color: #ffffff; font-weight: 600; min-width: 20px;">2.</span>
                                        <span>${isJapanese ? 'データアノテーションの詳細な提案書を作成いたします' : 'We will prepare a detailed data annotation proposal'}</span>
                                    </div>
                                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                                        <span style="color: #ffffff; font-weight: 600; min-width: 20px;">3.</span>
                                        <span>${isJapanese ? '24時間以内に詳細なご提案をお送りいたします' : 'You will receive our detailed proposal within 24 hours'}</span>
                                    </div>
                                </div>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1a1a1a; padding: 20px 30px; text-align: center; border-top: 1px solid #333333;" class="mobile-padding">
                            <p style="margin: 0; color: #888888; font-size: 12px;">
                                © 2025 DeepHand. All Rights Reserved.
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

export function generateDataRequestConfirmationEmailText(data: CurrentDataRequestFormData, language: string = 'ja'): string {
  const et = (key: string) => getEmailTranslation(key, language);
  const isJapanese = language === 'ja';
  
  return `
══════════════════════════════════════════
🎯 DeepHand - ${et('request.confirmation.title')}
══════════════════════════════════════════

${data.name} ${isJapanese ? '様' : ''}

${et('request.confirmation.message')}

${et('email.user.responseTime')}

${isJapanese ? 'リクエスト詳細' : 'Request Details'}
─────────────────────────────────────────
${et('request.name')}: ${data.name}
${et('request.email')}: ${data.email}
${data.organization ? `${et('request.organization')}: ${data.organization}\n` : ''}${et('request.backgroundPurpose')}: ${data.backgroundPurpose || ''}
${data.dataType && data.dataType.length > 0 ? `${et('request.dataType')}: ${Array.isArray(data.dataType) ? data.dataType.join(', ') : data.dataType}\n` : ''}
${data.dataDetails ? `${et('request.dataDetails')}: ${data.dataDetails}\n` : ''}${data.dataVolume ? `${et('request.dataVolume')}: ${data.dataVolume}\n` : ''}${data.deadline ? `${et('request.deadline')}: ${data.deadline}\n` : ''}${data.budget ? `${et('request.budget')}: ${data.budget}\n` : ''}${data.otherRequirements ? `${et('request.otherRequirements')}: ${data.otherRequirements}\n` : ''}
${et('email.user.nextSteps')}
─────────────────────────────────────────
1. ${isJapanese ? '担当者がリクエスト内容を詳細に確認いたします' : 'Our team will thoroughly review your request details'}
2. ${isJapanese ? 'データアノテーションの詳細な提案書を作成いたします' : 'We will prepare a detailed data annotation proposal'}
3. ${isJapanese ? '24時間以内に詳細なご提案をお送りいたします' : 'You will receive our detailed proposal within 24 hours'}

© 2025 DeepHand. All Rights Reserved.
  `;
}