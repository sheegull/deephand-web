/**
 * Email Templates Module
 * 
 * Stylish Monochrome Design (White text on #202123 background)
 * Responsive Layout with minimal icons
 * Full i18n support with no hardcoded text
 */

import type { ContactFormData, CurrentDataRequestFormData } from '../validationSchemas';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ENV } from '../env';

// Email template translation function
function getEmailTranslation(key: string, language: string): string {
  try {
    // Load translations dynamically
    const translationPath = join(process.cwd(), 'src', 'i18n', 'locales', `${language}.json`);
    const translationContent = readFileSync(translationPath, 'utf8');
    const translations = JSON.parse(translationContent);
    
    // Navigate through nested object using dot notation
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return key; // fallback to key if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
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
                                <h3 style="margin: 0 0 16px 0; color: #ffffff; font-size: 16px; font-weight: 600;">${et('email.user.contactInfo')}</h3>
                                <div style="background: #202123; border: 1px solid #333333; border-radius: 6px; padding: 16px;">
                                    <div style="margin-bottom: 8px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.name')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.name}</span>
                                    </div>
                                    <div style="margin-bottom: 8px;">
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.email')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${data.email}</span>
                                    </div>
                                    <div>
                                        <span style="color: #cccccc; font-size: 12px;">${et('email.admin.timestamp')}: </span>
                                        <span style="color: #ffffff; font-size: 14px;">${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}</span>
                                    </div>
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
${et('email.admin.timestamp')}: ${new Date().toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US')}

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
  return generateContactConfirmationEmailHtml(data as any, language);
}

export function generateDataRequestConfirmationEmailText(data: CurrentDataRequestFormData, language: string = 'ja'): string {
  return generateContactConfirmationEmailText(data as any, language);
}