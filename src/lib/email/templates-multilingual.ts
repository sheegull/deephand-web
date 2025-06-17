export type Language = 'ja' | 'en';

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

// Translation mapping
const translations = {
  ja: {
    // Contact form
    contactAdminSubject: '【DeepHand】新しいお問い合わせ',
    contactUserSubject: '【DeepHand】お問い合わせを受け付けました',
    newContactTitle: '新しいお問い合わせがありました',
    contactDetails: 'お問い合わせ内容',
    name: 'お名前',
    email: 'メールアドレス',
    phoneNumber: '電話番号',
    company: '会社名',
    position: '役職',
    inquiryType: 'お問い合わせ種別',
    message: 'お問い合わせ内容',
    receivedAt: '受信日時',
    thankYouTitle: 'お問い合わせありがとうございます',
    thankYouMessage: 'この度は、DeepHandにお問い合わせいただき、誠にありがとうございます。',
    confirmationMessage: '以下の内容でお問い合わせを受け付けました。',
    responseTime: '担当者より3営業日以内にご連絡させていただきます。',
    urgentContact: 'お急ぎの場合は、お電話にてお問い合わせください。',
    
    // Data request
    dataRequestAdminSubject: '【DeepHand】新しい資料請求',
    dataRequestUserSubject: '【DeepHand】資料請求を受け付けました',
    newDataRequestTitle: '新しい資料請求がありました',
    dataRequestDetails: '資料請求内容',
    requestedDocuments: '請求資料',
    dataThankYouTitle: '資料請求ありがとうございます',
    dataThankYouMessage: 'この度は、DeepHandの資料をご請求いただき、誠にありがとうございます。',
    dataConfirmationMessage: '以下の内容で資料請求を受け付けました。',
    dataSendTime: 'ご請求いただいた資料は、1営業日以内にお送りいたします。',
    
    // Common
    inquiryTypes: {
      product: '製品について',
      price: '価格・料金について',
      demo: 'デモ・トライアル',
      support: 'サポート',
      other: 'その他'
    },
    documents: {
      companyBrochure: '会社案内',
      productCatalog: '製品カタログ',
      caseStudies: '導入事例集',
      technicalSpecs: '技術仕様書'
    },
    footer: {
      doNotReply: 'このメールは送信専用のメールアドレスから送信されています。',
      contactInfo: 'お問い合わせはWebサイトのお問い合わせフォームをご利用ください。'
    }
  },
  en: {
    // Contact form
    contactAdminSubject: '[DeepHand] New Contact Inquiry',
    contactUserSubject: '[DeepHand] We have received your inquiry',
    newContactTitle: 'New Contact Inquiry Received',
    contactDetails: 'Inquiry Details',
    name: 'Name',
    email: 'Email',
    phoneNumber: 'Phone Number',
    company: 'Company',
    position: 'Position',
    inquiryType: 'Inquiry Type',
    message: 'Message',
    receivedAt: 'Received At',
    thankYouTitle: 'Thank You for Your Inquiry',
    thankYouMessage: 'Thank you for contacting DeepHand.',
    confirmationMessage: 'We have received your inquiry with the following details:',
    responseTime: 'Our team will contact you within 3 business days.',
    urgentContact: 'For urgent matters, please contact us by phone.',
    
    // Data request
    dataRequestAdminSubject: '[DeepHand] New Document Request',
    dataRequestUserSubject: '[DeepHand] Document Request Received',
    newDataRequestTitle: 'New Document Request Received',
    dataRequestDetails: 'Request Details',
    requestedDocuments: 'Requested Documents',
    dataThankYouTitle: 'Thank You for Your Document Request',
    dataThankYouMessage: 'Thank you for requesting DeepHand documentation.',
    dataConfirmationMessage: 'We have received your document request with the following details:',
    dataSendTime: 'The requested documents will be sent within 1 business day.',
    
    // Common
    inquiryTypes: {
      product: 'About Products',
      price: 'Pricing & Plans',
      demo: 'Demo & Trial',
      support: 'Support',
      other: 'Other'
    },
    documents: {
      companyBrochure: 'Company Brochure',
      productCatalog: 'Product Catalog',
      caseStudies: 'Case Studies',
      technicalSpecs: 'Technical Specifications'
    },
    footer: {
      doNotReply: 'This email was sent from a notification-only address.',
      contactInfo: 'Please use our website contact form for inquiries.'
    }
  }
};

// Helper function to get translated text
function t(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value[k];
    if (!value) return key;
  }
  
  return value;
}

// Base HTML template
function baseHtmlTemplate(language: Language, content: string): string {
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DeepHand</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #001f3f 0%, #003366 100%);
      color: #ffffff;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 20px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #001f3f;
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .detail-row {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .detail-label {
      font-weight: 600;
      color: #333333;
      width: 150px;
      flex-shrink: 0;
    }
    .detail-value {
      flex: 1;
      color: #666666;
    }
    .message-box {
      background-color: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 15px;
      margin-top: 10px;
      color: #666666;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .highlight-box {
      background-color: #e8f4f8;
      border: 1px solid #b8e0eb;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
      color: #001f3f;
    }
    .document-list {
      list-style: none;
      padding: 0;
      margin: 10px 0;
    }
    .document-list li {
      padding: 8px 0;
      color: #333333;
    }
    .document-list li:before {
      content: "✓ ";
      color: #4CAF50;
      font-weight: bold;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`;
}

// Contact Admin Email Template
export function getContactAdminEmail(
  language: Language,
  data: {
    name: string;
    email: string;
    phoneNumber?: string;
    company?: string;
    position?: string;
    inquiryType: string;
    message: string;
    receivedAt: string;
  }
): EmailContent {
  const inquiryTypeTranslated = t(language, `inquiryTypes.${data.inquiryType}`) || data.inquiryType;
  
  const htmlContent = `
    <div class="header">
      <h1>${t(language, 'newContactTitle')}</h1>
    </div>
    <div class="content">
      <div class="section">
        <h2>${t(language, 'contactDetails')}</h2>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'name')}</div>
          <div class="detail-value">${data.name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'email')}</div>
          <div class="detail-value">${data.email}</div>
        </div>
        ${data.phoneNumber ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'phoneNumber')}</div>
          <div class="detail-value">${data.phoneNumber}</div>
        </div>
        ` : ''}
        ${data.company ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'company')}</div>
          <div class="detail-value">${data.company}</div>
        </div>
        ` : ''}
        ${data.position ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'position')}</div>
          <div class="detail-value">${data.position}</div>
        </div>
        ` : ''}
        <div class="detail-row">
          <div class="detail-label">${t(language, 'inquiryType')}</div>
          <div class="detail-value">${inquiryTypeTranslated}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'receivedAt')}</div>
          <div class="detail-value">${data.receivedAt}</div>
        </div>
      </div>
      <div class="section">
        <h2>${t(language, 'message')}</h2>
        <div class="message-box">${data.message}</div>
      </div>
    </div>
  `;

  const textContent = `
${t(language, 'newContactTitle')}

${t(language, 'contactDetails')}
${t(language, 'name')}: ${data.name}
${t(language, 'email')}: ${data.email}
${data.phoneNumber ? `${t(language, 'phoneNumber')}: ${data.phoneNumber}\n` : ''}${data.company ? `${t(language, 'company')}: ${data.company}\n` : ''}${data.position ? `${t(language, 'position')}: ${data.position}\n` : ''}${t(language, 'inquiryType')}: ${inquiryTypeTranslated}
${t(language, 'receivedAt')}: ${data.receivedAt}

${t(language, 'message')}:
${data.message}
`;

  return {
    subject: t(language, 'contactAdminSubject'),
    html: baseHtmlTemplate(language, htmlContent),
    text: textContent
  };
}

// Contact User Confirmation Email Template
export function getContactUserEmail(
  language: Language,
  data: {
    name: string;
    email: string;
    phoneNumber?: string;
    company?: string;
    position?: string;
    inquiryType: string;
    message: string;
  }
): EmailContent {
  const inquiryTypeTranslated = t(language, `inquiryTypes.${data.inquiryType}`) || data.inquiryType;
  
  const htmlContent = `
    <div class="header">
      <h1>${t(language, 'thankYouTitle')}</h1>
    </div>
    <div class="content">
      <div class="section">
        <p>${t(language, 'thankYouMessage')}</p>
        <p>${t(language, 'confirmationMessage')}</p>
      </div>
      <div class="highlight-box">
        <p>${t(language, 'responseTime')}</p>
        <p>${t(language, 'urgentContact')}</p>
      </div>
      <div class="section">
        <h2>${t(language, 'contactDetails')}</h2>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'name')}</div>
          <div class="detail-value">${data.name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'email')}</div>
          <div class="detail-value">${data.email}</div>
        </div>
        ${data.phoneNumber ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'phoneNumber')}</div>
          <div class="detail-value">${data.phoneNumber}</div>
        </div>
        ` : ''}
        ${data.company ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'company')}</div>
          <div class="detail-value">${data.company}</div>
        </div>
        ` : ''}
        ${data.position ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'position')}</div>
          <div class="detail-value">${data.position}</div>
        </div>
        ` : ''}
        <div class="detail-row">
          <div class="detail-label">${t(language, 'inquiryType')}</div>
          <div class="detail-value">${inquiryTypeTranslated}</div>
        </div>
      </div>
      <div class="section">
        <h2>${t(language, 'message')}</h2>
        <div class="message-box">${data.message}</div>
      </div>
    </div>
    <div class="footer">
      <p>${t(language, 'footer.doNotReply')}</p>
      <p>${t(language, 'footer.contactInfo')}</p>
    </div>
  `;

  const textContent = `
${t(language, 'thankYouTitle')}

${t(language, 'thankYouMessage')}
${t(language, 'confirmationMessage')}

${t(language, 'responseTime')}
${t(language, 'urgentContact')}

${t(language, 'contactDetails')}
${t(language, 'name')}: ${data.name}
${t(language, 'email')}: ${data.email}
${data.phoneNumber ? `${t(language, 'phoneNumber')}: ${data.phoneNumber}\n` : ''}${data.company ? `${t(language, 'company')}: ${data.company}\n` : ''}${data.position ? `${t(language, 'position')}: ${data.position}\n` : ''}${t(language, 'inquiryType')}: ${inquiryTypeTranslated}

${t(language, 'message')}:
${data.message}

---
${t(language, 'footer.doNotReply')}
${t(language, 'footer.contactInfo')}
`;

  return {
    subject: t(language, 'contactUserSubject'),
    html: baseHtmlTemplate(language, htmlContent),
    text: textContent
  };
}

// Data Request Admin Email Template
export function getDataRequestAdminEmail(
  language: Language,
  data: {
    name: string;
    email: string;
    phoneNumber?: string;
    company?: string;
    position?: string;
    requestedDocuments: string[];
    message?: string;
    receivedAt: string;
  }
): EmailContent {
  const documentsTranslated = data.requestedDocuments.map(doc => 
    t(language, `documents.${doc}`) || doc
  );
  
  const htmlContent = `
    <div class="header">
      <h1>${t(language, 'newDataRequestTitle')}</h1>
    </div>
    <div class="content">
      <div class="section">
        <h2>${t(language, 'dataRequestDetails')}</h2>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'name')}</div>
          <div class="detail-value">${data.name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'email')}</div>
          <div class="detail-value">${data.email}</div>
        </div>
        ${data.phoneNumber ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'phoneNumber')}</div>
          <div class="detail-value">${data.phoneNumber}</div>
        </div>
        ` : ''}
        ${data.company ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'company')}</div>
          <div class="detail-value">${data.company}</div>
        </div>
        ` : ''}
        ${data.position ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'position')}</div>
          <div class="detail-value">${data.position}</div>
        </div>
        ` : ''}
        <div class="detail-row">
          <div class="detail-label">${t(language, 'receivedAt')}</div>
          <div class="detail-value">${data.receivedAt}</div>
        </div>
      </div>
      <div class="section">
        <h2>${t(language, 'requestedDocuments')}</h2>
        <ul class="document-list">
          ${documentsTranslated.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
      </div>
      ${data.message ? `
      <div class="section">
        <h2>${t(language, 'message')}</h2>
        <div class="message-box">${data.message}</div>
      </div>
      ` : ''}
    </div>
  `;

  const textContent = `
${t(language, 'newDataRequestTitle')}

${t(language, 'dataRequestDetails')}
${t(language, 'name')}: ${data.name}
${t(language, 'email')}: ${data.email}
${data.phoneNumber ? `${t(language, 'phoneNumber')}: ${data.phoneNumber}\n` : ''}${data.company ? `${t(language, 'company')}: ${data.company}\n` : ''}${data.position ? `${t(language, 'position')}: ${data.position}\n` : ''}${t(language, 'receivedAt')}: ${data.receivedAt}

${t(language, 'requestedDocuments')}:
${documentsTranslated.map(doc => `- ${doc}`).join('\n')}

${data.message ? `${t(language, 'message')}:\n${data.message}` : ''}
`;

  return {
    subject: t(language, 'dataRequestAdminSubject'),
    html: baseHtmlTemplate(language, htmlContent),
    text: textContent
  };
}

// Data Request User Confirmation Email Template
export function getDataRequestUserEmail(
  language: Language,
  data: {
    name: string;
    email: string;
    phoneNumber?: string;
    company?: string;
    position?: string;
    requestedDocuments: string[];
    message?: string;
  }
): EmailContent {
  const documentsTranslated = data.requestedDocuments.map(doc => 
    t(language, `documents.${doc}`) || doc
  );
  
  const htmlContent = `
    <div class="header">
      <h1>${t(language, 'dataThankYouTitle')}</h1>
    </div>
    <div class="content">
      <div class="section">
        <p>${t(language, 'dataThankYouMessage')}</p>
        <p>${t(language, 'dataConfirmationMessage')}</p>
      </div>
      <div class="highlight-box">
        <p>${t(language, 'dataSendTime')}</p>
      </div>
      <div class="section">
        <h2>${t(language, 'dataRequestDetails')}</h2>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'name')}</div>
          <div class="detail-value">${data.name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">${t(language, 'email')}</div>
          <div class="detail-value">${data.email}</div>
        </div>
        ${data.phoneNumber ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'phoneNumber')}</div>
          <div class="detail-value">${data.phoneNumber}</div>
        </div>
        ` : ''}
        ${data.company ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'company')}</div>
          <div class="detail-value">${data.company}</div>
        </div>
        ` : ''}
        ${data.position ? `
        <div class="detail-row">
          <div class="detail-label">${t(language, 'position')}</div>
          <div class="detail-value">${data.position}</div>
        </div>
        ` : ''}
      </div>
      <div class="section">
        <h2>${t(language, 'requestedDocuments')}</h2>
        <ul class="document-list">
          ${documentsTranslated.map(doc => `<li>${doc}</li>`).join('')}
        </ul>
      </div>
      ${data.message ? `
      <div class="section">
        <h2>${t(language, 'message')}</h2>
        <div class="message-box">${data.message}</div>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>${t(language, 'footer.doNotReply')}</p>
      <p>${t(language, 'footer.contactInfo')}</p>
    </div>
  `;

  const textContent = `
${t(language, 'dataThankYouTitle')}

${t(language, 'dataThankYouMessage')}
${t(language, 'dataConfirmationMessage')}

${t(language, 'dataSendTime')}

${t(language, 'dataRequestDetails')}
${t(language, 'name')}: ${data.name}
${t(language, 'email')}: ${data.email}
${data.phoneNumber ? `${t(language, 'phoneNumber')}: ${data.phoneNumber}\n` : ''}${data.company ? `${t(language, 'company')}: ${data.company}\n` : ''}${data.position ? `${t(language, 'position')}: ${data.position}\n` : ''}

${t(language, 'requestedDocuments')}:
${documentsTranslated.map(doc => `- ${doc}`).join('\n')}

${data.message ? `${t(language, 'message')}:\n${data.message}` : ''}

---
${t(language, 'footer.doNotReply')}
${t(language, 'footer.contactInfo')}
`;

  return {
    subject: t(language, 'dataRequestUserSubject'),
    html: baseHtmlTemplate(language, htmlContent),
    text: textContent
  };
}