# Vercel 404エラー原因分析と解決策レポート

**日時**: 2025年06月17日 19:52  
**問題**: VercelデプロイメントでNOT_FOUND (404)エラー発生  
**エラーID**: hnd1::tj275-175015755429-473503e255d9

## 🚨 問題の概要

AstroプロジェクトをVercelにデプロイした際、サイト全体で404エラーが発生。ビルドは正常完了するが、ランタイムでページが見つからない状態。

## 🔍 根本原因の分析

### 1. **アダプター不一致問題（最重要）**
```javascript
// 現在の設定（問題あり）
adapter: cloudflare({
  mode: 'advanced'
})
```

**問題**: Cloudflareアダプターを使用しているため、Vercel環境でサーバーレス関数が正しく動作しない

**影響**: 
- SSR機能が動作しない
- ルーティングが機能しない
- すべてのページで404エラー

### 2. **サイトURL設定問題**
```javascript
// 現在の設定
site: 'https://deephandai.com'
```

**問題**: 固定ドメインに設定されているため、Vercelの動的URLで動作しない

**影響**:
- 相対パスの解決が正しく行われない
- アセットの読み込みが失敗する可能性

### 3. **ビルド出力形式の不一致**
**問題**: Cloudflareアダプターの出力形式（Workers形式）がVercelの要求する形式と異なる

**Vercel要求形式**:
- Serverless Functions (.vercel/output)
- Edge Functions
- Static Assets

**現在の出力**: Cloudflare Workers形式

## ⚡ 解決策

### **Phase 1: アダプター変更（必須）**

1. **Vercelアダプターのインストール**
   ```bash
   pnpm remove @astrojs/cloudflare
   pnpm add @astrojs/vercel
   ```

2. **astro.config.mjs修正**
   ```javascript
   import vercel from '@astrojs/vercel/serverless';
   
   export default defineConfig({
     site: process.env.VERCEL_URL 
       ? `https://${process.env.VERCEL_URL}` 
       : 'https://deephandai.com',
     adapter: vercel(),
     // 他の設定は維持
   });
   ```

### **Phase 2: Vercel環境設定**

1. **環境変数設定**
   ```
   NODE_ENV=production
   PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
   RESEND_API_KEY=[your-api-key]
   ```

2. **Vercel.json設定（必要に応じて）**
   ```json
   {
     "functions": {
       "src/pages/api/**/*.astro": {
         "maxDuration": 30
       }
     }
   }
   ```

### **Phase 3: デプロイメント確認**

1. **ビルド検証**
   - `.vercel/output`ディレクトリの生成確認
   - Serverless Functions出力確認

2. **ルーティングテスト**
   - トップページ（/）
   - 英語ページ（/en）
   - APIエンドポイント（/api/contact, /api/request）

## 🎯 優先度別対応

### **🔴 緊急（即座に対応）**
- Astroアダプターの変更
- サイトURL設定の修正

### **🟡 重要（24時間以内）**
- 環境変数の設定
- デプロイメントテスト

### **🟢 推奨（1週間以内）**
- パフォーマンス最適化
- エラーハンドリングの改善

## 📊 技術的詳細

### **Vercel vs Cloudflare アーキテクチャ比較**

| 項目 | Cloudflare | Vercel |
|------|------------|--------|
| Runtime | Workers | Serverless Functions |
| 制限時間 | 制限なし | 30秒（Pro: 60秒） |
| コールドスタート | 非常に高速 | 高速 |
| Node.js API | 制限あり | フルサポート |
| メモリ制限 | 128MB | 1GB（Pro: 3GB） |

### **期待される結果**
- ✅ すべてのページが正常表示
- ✅ SSR機能が動作
- ✅ API endpoints が機能
- ✅ メールフォームが動作

## ⚠️ 注意事項

1. **wrangler.toml**: Vercelでは使用されないが、削除は不要（他のツールで使用される可能性）

2. **React 19互換性**: Vercelでは問題ないがパフォーマンスに注意

3. **Bundle Size**: HeroSection.jsが933.67KBと大きいため、コード分割を推奨

## 🔄 次回同様の問題を防ぐために

1. **プラットフォーム固有設定の分離**
   - 環境別設定ファイルの作成
   - CI/CDでの設定自動切り替え

2. **マルチプラットフォーム対応**
   - アダプター選択の自動化
   - 環境変数による動的設定

3. **デプロイメントテスト**
   - プラットフォーム切り替え時のチェックリスト作成
   - 自動テストの導入

---

**ステータス**: 🔴 対応必要  
**推定作業時間**: 30分  
**影響範囲**: サイト全体  
**緊急度**: 高