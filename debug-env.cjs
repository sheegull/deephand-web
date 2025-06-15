// 環境変数診断スクリプト

const fs = require('fs');
const path = require('path');

console.log('🔍 DeepHand 環境変数診断開始...');
console.log('='.repeat(60));

// 1. ファイル存在確認
console.log('📁 環境ファイル確認:');
const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
envFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${file}:`, exists ? '✅ 存在' : '❌ なし');
  
  if (exists) {
    const stats = fs.statSync(filePath);
    console.log(`    - サイズ: ${stats.size} bytes`);
    console.log(`    - 権限: ${stats.mode.toString(8)}`);
  }
});

console.log('\n🔧 dotenv手動読み込みテスト:');
// 手動でdotenvを読み込み
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// 2. 環境変数確認
console.log('\n📊 Node.js process.env:');
const envVars = {
  'RESEND_API_KEY': process.env.RESEND_API_KEY ? '✅ 設定済み' : '❌ 未設定',
  'PUBLIC_SITE_URL': process.env.PUBLIC_SITE_URL || '❌ 未設定',
  'ADMIN_EMAIL': process.env.ADMIN_EMAIL || 'デフォルト値使用',
  'FROM_EMAIL': process.env.FROM_EMAIL || 'デフォルト値使用',
  'ENABLE_EMAIL_DEBUG': process.env.ENABLE_EMAIL_DEBUG || 'false',
  'NODE_ENV': process.env.NODE_ENV || 'default',
};

Object.entries(envVars).forEach(([key, value]) => {
  const status = value.includes('未設定') ? '❌' : '✅';
  console.log(`  ${status} ${key}: ${value}`);
});

// 3. 重要な検証
console.log('\n🎯 重要項目検証:');
const apiKey = process.env.RESEND_API_KEY;
if (apiKey) {
  console.log('  ✅ RESEND_API_KEY: 設定済み');
  console.log(`    - 形式チェック: ${apiKey.startsWith('re_') ? '✅ 正常' : '❌ 不正'}`);
  console.log(`    - 長さ: ${apiKey.length} 文字`);
} else {
  console.log('  ❌ RESEND_API_KEY: 未設定');
}

const siteUrl = process.env.PUBLIC_SITE_URL;
if (siteUrl) {
  console.log('  ✅ PUBLIC_SITE_URL: 設定済み');
  console.log(`    - URL: ${siteUrl}`);
  console.log(`    - 形式チェック: ${siteUrl.startsWith('http') ? '✅ 正常' : '❌ 不正'}`);
} else {
  console.log('  ❌ PUBLIC_SITE_URL: 未設定');
}

// 4. .env.local ファイル内容確認
console.log('\n📄 .env.local ファイル内容:');
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        const maskedValue = key.includes('API_KEY') ? 
          value.substring(0, 8) + '...' : value;
        console.log(`  ${index + 1}: ${key}=${maskedValue}`);
      }
    }
  });
} else {
  console.log('  ❌ .env.local ファイルが見つかりません');
}

// 5. 修正提案
console.log('\n💡 修正提案:');
const issues = [];

if (!process.env.RESEND_API_KEY) {
  issues.push('RESEND_API_KEY を .env.local に設定してください');
}

if (!process.env.PUBLIC_SITE_URL) {
  issues.push('PUBLIC_SITE_URL を .env.local に設定してください');
}

if (process.env.PUBLIC_SITE_URL && !process.env.PUBLIC_SITE_URL.startsWith('http')) {
  issues.push('PUBLIC_SITE_URL は http:// または https:// で始まる必要があります');
}

if (issues.length === 0) {
  console.log('  ✅ 環境変数設定に問題はありません');
} else {
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
}

console.log('\n🚀 次のステップ:');
console.log('  1. 問題がある場合は .env.local を修正');
console.log('  2. 開発サーバーを完全再起動');
console.log('  3. フォーム送信テストを実行');

console.log('\n' + '='.repeat(60));
console.log('診断完了');