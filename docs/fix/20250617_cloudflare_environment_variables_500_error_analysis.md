# Cloudflare Pages環境変数・500エラー詳細分析

**日時**: 2025年06月17日 21:10  
**問題**: フォーム送信時500エラー + 環境変数管理の問題  
**状況**: wrangler.toml管理 + シークレット未設定の可能性  

## 🚨 現状確認

### **エラー状況**
```
フロントエンド：
Failed to load resource: the server responded with a status of 500 ()

Cloudflare設定：
- 環境変数: wrangler.tomlで管理
- シークレット: ダッシュボード経由で管理可能
- 現状: シークレット（暗号化変数）が未設定の可能性
```

### **推定される問題構造**
```
1. wrangler.toml → 公開可能な環境変数（URL等）
2. Cloudflare Secrets → 機密情報（API KEY等）
3. 500エラー → サーバーサイド処理でのunhandled exception
```

## 📋 wrangler.toml設定不足の詳細分析

### **1. 現在のwrangler.toml状況**
```toml
# 現在の設定（推定）
name = "deephand-web"
compatibility_date = "2025-01-15"
pages_build_output_dir = "dist"

# 不足している可能性のある設定
[vars]
# PUBLIC_SITE_URL = "https://deephandai.com"
# NODE_ENV = "production"

[secrets]
# RESEND_API_KEY は wrangler secret put で設定必要
```

### **2. 必要な環境変数の分類**

#### **2.1 公開変数（wrangler.toml [vars]セクション）**
```toml
[vars]
PUBLIC_SITE_URL = "https://deephandai.com"
NODE_ENV = "production"
ASTRO_MODE = "production"
PUBLIC_API_BASE_URL = "https://f2e1765a.deephand-web.pages.dev"
```

#### **2.2 機密変数（Cloudflare Secrets）**
```bash
# wranglerコマンドで設定が必要
wrangler secret put RESEND_API_KEY
# → APIキーの値を入力

# その他必要に応じて
wrangler secret put SMTP_PASSWORD
wrangler secret put JWT_SECRET
```

## 🔍 500エラーの根本原因分析

### **3. サーバーサイド処理での失敗パターン**

#### **3.1 環境変数undefined問題**
```javascript
// エラーの原因例
const apiKey = process.env.RESEND_API_KEY; // undefined
const resend = new Resend(apiKey); // Error: Invalid API key

// Cloudflare Workersでのアクセス方法
const apiKey = env.RESEND_API_KEY; // Cloudflareの場合はenvオブジェクト
```

#### **3.2 Astro + Cloudflare環境変数アクセス**
```javascript
// ローカル環境（動作）
process.env.RESEND_API_KEY

// Cloudflare Workers環境（必要）
export default async function handler(context) {
  const { env } = context.locals.runtime;
  const apiKey = env.RESEND_API_KEY;
}
```

### **4. メール送信処理でのエラーパターン**

#### **4.1 Resend SDK互換性問題**
```javascript
// 問題のあるパターン（Node.js依存）
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Cloudflare Workers対応パターン
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(emailData)
});
```

#### **4.2 フォームデータ処理エラー**
```javascript
// 問題のあるパターン
const formData = await request.formData();
const name = formData.get('name'); // 型エラーやnull問題

// 安全なパターン
try {
  const formData = await request.formData();
  const name = formData.get('name')?.toString() || '';
  // バリデーション処理
} catch (error) {
  console.error('Form parsing error:', error);
  return new Response('Bad Request', { status: 400 });
}
```

## 🔧 段階的解決戦略

### **Phase 1: 緊急診断（即座実施）**

#### **1.1 Cloudflare Logs確認**
```bash
# リアルタイムログ確認
wrangler pages deployment tail

# または、Cloudflare Dashboardで
# Pages → deephand-web → Functions → Real-time Logs
```

#### **1.2 最小限のテストエンドポイント作成**
```javascript
// /pages/api/test.astro.ts
export async function POST({ request, locals }) {
  try {
    // 環境変数確認
    const env = locals.runtime?.env || {};
    
    return new Response(JSON.stringify({
      success: true,
      hasResendKey: !!env.RESEND_API_KEY,
      environment: env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

### **Phase 2: 環境変数設定（当日実施）**

#### **2.1 wrangler.toml設定追加**
```toml
name = "deephand-web"
compatibility_date = "2025-01-15"
pages_build_output_dir = "dist"

[vars]
PUBLIC_SITE_URL = "https://deephandai.com"
NODE_ENV = "production"
PUBLIC_CONTACT_EMAIL = "contact@deephandai.com"

# Cloudflare Pages用の追加設定
[env.production]
vars = { NODE_ENV = "production" }

[env.preview]
vars = { NODE_ENV = "staging" }
```

#### **2.2 Secrets設定コマンド**
```bash
# プロジェクトディレクトリで実行
wrangler secret put RESEND_API_KEY --env production
# → プロンプトでAPIキー入力

# 設定確認
wrangler secret list --env production
```

### **Phase 3: コード修正（1-2日）**

#### **3.1 環境変数アクセス修正**
```javascript
// before: Node.js方式
const apiKey = process.env.RESEND_API_KEY;

// after: Cloudflare Workers方式
export async function POST({ request, locals }) {
  const env = locals.runtime?.env || {};
  const apiKey = env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }
}
```

#### **3.2 メール送信処理の書き直し**
```javascript
// Resend SDK使用停止 → 直接API呼び出し
async function sendEmail(env, emailData) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@deephandai.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}
```

## 🎯 具体的実施手順

### **ステップ1: ログ確認（5分）**
```bash
1. Cloudflare Dashboard → Pages → deephand-web
2. Functions タブ → Real-time Logs
3. フォーム送信を試行
4. エラーの詳細メッセージ確認
```

### **ステップ2: 環境変数設定（15分）**
```bash
1. ローカルでwrangler.toml編集
2. wrangler secret put RESEND_API_KEY
3. 変更をGitにコミット・プッシュ
4. Cloudflare Pages自動デプロイ待機
```

### **ステップ3: テストエンドポイント確認（10分）**
```bash
1. /api/test エンドポイント作成
2. Postmanやcurlでテスト
3. 環境変数が正しく取得できるか確認
4. エラーログの詳細確認
```

### **ステップ4: 段階的修正（30-60分）**
```bash
1. 最小限のメール送信処理作成
2. フロントエンドとの統合テスト
3. エラーハンドリング追加
4. ユーザビリティ改善
```

## 🔍 デバッグポイント

### **確認すべき項目**
```
✅ wrangler.toml の [vars] セクション設定
✅ wrangler secret list の出力結果
✅ Cloudflare Workers Logs のエラー詳細
✅ locals.runtime?.env でのアクセス可能性
✅ Resend APIの直接呼び出し成功
✅ フォームデータの正常な解析
✅ Content-Type headers の正確性
✅ CORS設定の適切性
```

### **よくある落とし穴**
```
❌ process.env の使用（Cloudflare Workersでは無効）
❌ Node.js専用ライブラリの使用
❌ 同期的な処理での Promise未対応
❌ エラーハンドリングの不足
❌ 型安全性の欠如
❌ タイムアウト処理の不適切性
```

## 📈 成功の判定基準

### **Phase 1完了条件**
- Cloudflare Logsでエラー詳細が確認できる
- 環境変数の設定状況が明確になる

### **Phase 2完了条件**
- wrangler secret list でAPIキーが表示される
- テストエンドポイントで環境変数が取得できる

### **Phase 3完了条件**
- フォーム送信が200レスポンスで成功する
- メールが実際に送信される
- エラーハンドリングが適切に動作する

---

**最優先アクション**: Cloudflare Workers Logsでの500エラー詳細確認  
**期待される解決時間**: 環境変数設定で即座改善の可能性  
**バックアップ計画**: Fetch API直接実装への移行