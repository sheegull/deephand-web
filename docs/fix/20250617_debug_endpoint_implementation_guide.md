# デバッグ版エンドポイント実装ガイド

**目的**: Cloudflare Workers Logsでエラー詳細を可視化  
**方法**: 既存のcontact APIを一時的にデバッグ版に置き換え  
**所要時間**: 5-10分  

## 🔧 実装手順

### **ステップ1: 既存ファイルの確認**

#### **1.1 現在のcontact APIファイルを特定**
```bash
# プロジェクトルートで実行
find . -name "*contact*" -type f | grep -E "\.(astro|ts|js)$"
```

**予想されるファイル場所:**
- `src/pages/api/contact.astro`
- `src/pages/api/contact.ts`
- `pages/api/contact.astro`

### **ステップ2: デバッグ版APIの実装**

#### **2.1 既存ファイルのバックアップ**
```bash
# 既存ファイルをバックアップ
cp src/pages/api/contact.astro src/pages/api/contact.astro.backup
# または
cp src/pages/api/contact.ts src/pages/api/contact.ts.backup
```

#### **2.2 デバッグ版コードで置き換え**

**src/pages/api/contact.astro (または .ts) の内容を以下に置き換え:**

```javascript
---
// デバッグ版 Contact API Handler
export async function POST({ request, locals }) {
  console.log('🚀 === CONTACT FORM DEBUG START ===');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    step: 'initialization',
    error: null,
    environment: {},
    request: {},
    processing: []
  };

  try {
    // Step 1: Environment Variables Check
    console.log('📋 Step 1: Environment Variables Check');
    debugInfo.step = 'env-check';
    
    const env = locals?.runtime?.env || {};
    const envKeys = Object.keys(env);
    
    debugInfo.environment = {
      localsExists: !!locals,
      runtimeExists: !!locals?.runtime,
      envExists: !!env,
      envKeys: envKeys,
      hasResendKey: !!env.RESEND_API_KEY,
      resendKeyLength: env.RESEND_API_KEY ? env.RESEND_API_KEY.length : 0,
      nodeEnv: env.NODE_ENV || 'undefined'
    };
    
    console.log('🔑 Environment Info:', JSON.stringify(debugInfo.environment, null, 2));
    debugInfo.processing.push('env-check-completed');

    // Step 2: Request Analysis
    console.log('📨 Step 2: Request Analysis');
    debugInfo.step = 'request-analysis';
    
    const contentType = request.headers.get('content-type');
    const method = request.method;
    const url = request.url;
    
    debugInfo.request = {
      method: method,
      url: url,
      contentType: contentType,
      hasBody: !!request.body,
      headers: Object.fromEntries(request.headers.entries())
    };
    
    console.log('🌐 Request Info:', JSON.stringify(debugInfo.request, null, 2));
    debugInfo.processing.push('request-analysis-completed');

    // Step 3: Body Parsing
    console.log('📦 Step 3: Body Parsing');
    debugInfo.step = 'body-parsing';
    
    let requestBody = null;
    try {
      if (contentType?.includes('application/json')) {
        requestBody = await request.json();
        console.log('📄 JSON Body parsed successfully:', JSON.stringify(requestBody, null, 2));
      } else {
        const formData = await request.formData();
        requestBody = Object.fromEntries(formData.entries());
        console.log('📋 Form Data parsed successfully:', JSON.stringify(requestBody, null, 2));
      }
      debugInfo.processing.push('body-parsing-completed');
    } catch (bodyError) {
      console.error('❌ Body parsing failed:', bodyError.message);
      debugInfo.error = {
        step: 'body-parsing',
        name: bodyError.name,
        message: bodyError.message,
        stack: bodyError.stack
      };
      throw bodyError;
    }

    // Step 4: API Key Validation
    console.log('🔐 Step 4: API Key Validation');
    debugInfo.step = 'api-key-validation';
    
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('🚨 CRITICAL: RESEND_API_KEY not found in environment');
      console.error('🔍 Available env keys:', envKeys);
      throw new Error('RESEND_API_KEY not configured in Cloudflare Secrets');
    }
    
    console.log('✅ API Key found, length:', apiKey.length);
    console.log('🔑 API Key prefix:', apiKey.substring(0, 8) + '...');
    debugInfo.processing.push('api-key-validation-completed');

    // Step 5: Email Data Preparation
    console.log('📧 Step 5: Email Data Preparation');
    debugInfo.step = 'email-preparation';
    
    const emailData = {
      from: 'contact@deephandai.com',
      to: 'contact@deephandai.com',
      subject: `[DeepHand] Contact Form: ${requestBody.name || 'No Name'}`,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${requestBody.name || 'Not provided'}</p>
        <p><strong>Email:</strong> ${requestBody.email || 'Not provided'}</p>
        <p><strong>Company:</strong> ${requestBody.company || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${requestBody.message || 'No message'}</p>
        <hr>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `
    };
    
    console.log('📮 Email data prepared:', JSON.stringify(emailData, null, 2));
    debugInfo.processing.push('email-preparation-completed');

    // Step 6: Resend API Call
    console.log('🌐 Step 6: Resend API Call');
    debugInfo.step = 'resend-api-call';
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });
    
    console.log('📡 Resend API Response Status:', resendResponse.status);
    console.log('📡 Resend API Response Headers:', Object.fromEntries(resendResponse.headers.entries()));
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('❌ Resend API Error:', errorText);
      throw new Error(`Resend API error: ${resendResponse.status} - ${errorText}`);
    }
    
    const resendResult = await resendResponse.json();
    console.log('✅ Resend API Success:', JSON.stringify(resendResult, null, 2));
    debugInfo.processing.push('resend-api-call-completed');

    // Success Response
    debugInfo.step = 'success';
    console.log('🎉 === CONTACT FORM DEBUG SUCCESS ===');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Email sent successfully',
      emailId: resendResult.id,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    // Comprehensive Error Logging
    console.error('🚨 === CRITICAL ERROR DETAILS ===');
    console.error('❌ Error Name:', error.name);
    console.error('❌ Error Message:', error.message);
    console.error('❌ Error Stack:', error.stack);
    console.error('📍 Failed at step:', debugInfo.step);
    console.error('🔍 Debug Info:', JSON.stringify(debugInfo, null, 2));
    console.error('🚨 ================================');

    debugInfo.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      step: debugInfo.step
    };

    return new Response(JSON.stringify({
      success: false,
      error: 'Internal Server Error',
      message: error.message,
      debug: debugInfo,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
}

export async function OPTIONS({ request }) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
---
```

### **ステップ3: デプロイとテスト**

#### **3.1 変更のコミット・プッシュ**
```bash
# 変更をGitにコミット
git add src/pages/api/contact.astro
git commit -m "Add debug version of contact API for troubleshooting"

# プッシュしてCloudflare Pagesに自動デプロイ
git push origin main
```

#### **3.2 デプロイ完了の確認**
```bash
# Cloudflare Pagesのデプロイ状況確認
# Dashboard → Pages → deephand-web → Deployments
# 新しいデプロイが完了するまで1-2分待機
```

### **ステップ4: デバッグ実行**

#### **4.1 リアルタイムログの準備**
```bash
# ターミナルでリアルタイムログを開始
wrangler pages deployment tail
```

#### **4.2 フォーム送信テスト**
**ブラウザで以下を実行:**
1. https://deephandai.com/en にアクセス
2. お問い合わせフォームに入力
3. 送信ボタンクリック
4. ターミナルのログを確認

#### **4.3 直接APIテスト（代替方法）**
```bash
# curlでの直接テスト
curl -X POST https://deephandai.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Debug Test",
    "email": "test@example.com", 
    "company": "Test Company",
    "message": "This is a debug test message"
  }'
```

### **ステップ5: ログ分析**

#### **5.1 期待されるログ出力**
```
🚀 === CONTACT FORM DEBUG START ===
📋 Step 1: Environment Variables Check
🔑 Environment Info: {"localsExists": true, "hasResendKey": false, ...}
📨 Step 2: Request Analysis
🌐 Request Info: {"method": "POST", "contentType": "application/json", ...}
```

#### **5.2 問題特定のポイント**
- `hasResendKey: false` → RESEND_API_KEY未設定
- `localsExists: false` → Astro設定問題
- `body-parsing` エラー → リクエスト形式問題
- `resend-api-call` エラー → API通信問題

## 🎯 次のアクション

### **ログでRESEND_API_KEY未設定が確認できた場合:**
```bash
# Secretsを設定
wrangler secret put RESEND_API_KEY
# プロンプトでAPIキーを入力
```

### **別の問題が特定できた場合:**
- ログの詳細情報を元に段階的修正
- 必要に応じてwrangler.toml設定調整

### **デバッグ完了後:**
```bash
# 元のファイルに戻す
cp src/pages/api/contact.astro.backup src/pages/api/contact.astro
git add src/pages/api/contact.astro
git commit -m "Restore original contact API after debugging"
git push origin main
```

---

**重要**: デバッグ版は本番用ではないため、問題解決後は必ず元のファイルに戻してください。