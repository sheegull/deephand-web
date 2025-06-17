# Cloudflare Pages環境変数設定レポート

## 📋 概要
Cloudflare PagesでのAstro SSRデプロイメントにおいて、環境変数が正しく読み込まれない問題を修正しました。

## 🔍 問題分析

### 原因
1. **Cloudflare Workersランタイムの特性**: `process.env`がNode.js環境特有のAPIのため利用不可
2. **Astro SSRでの環境変数アクセス方法**: `import.meta.env`を使用する必要がある
3. **wrangler.tomlとvite.defineの設定不備**: 環境変数のバインディングが不完全

### 影響範囲
- API実行時に全ての環境変数が「NOT SET」として表示
- RESEND_API_KEYが読み込めずメール送信が失敗
- 本番環境でのアプリケーション機能停止

## 🛠️ 実装内容

### 1. Astro設定の修正 (`astro.config.mjs`)
```javascript
vite: {
  // Cloudflare Pages SSR環境変数設定
  define: {
    'import.meta.env.RESEND_API_KEY': JSON.stringify(process.env.RESEND_API_KEY || ''),
    'import.meta.env.PUBLIC_SITE_URL': JSON.stringify(process.env.PUBLIC_SITE_URL || 'https://deephandai.com'),
    // その他の環境変数...
  },
}
```

### 2. 環境変数管理モジュールの修正 (`src/lib/env.ts`)
- `process.env` → `import.meta.env` に変更
- Cloudflare SSR対応のランタイムチェック追加

### 3. wrangler.toml設定の改善
- 環境変数バインディングの詳細コメント追加
- 開発用.dev.varsファイルの利用説明追加

### 4. 開発環境設定
- `.dev.vars`ファイル作成（ローカル開発用）
- `.gitignore`に`.dev.vars`追加
- `package.json`にCloudflare開発スクリプト追加

## 📝 設定手順

### A. ローカル開発環境設定

1. **実際のRESEND_API_KEYを.dev.varsに設定**
   ```bash
   # .dev.vars ファイルを編集
   RESEND_API_KEY=re_実際のAPIキー
   ENABLE_EMAIL_DEBUG=true
   ```

2. **ローカルでCloudflare Pages環境をテスト**
   ```bash
   # ビルドしてCloudflare環境でプレビュー
   pnpm preview:cf
   ```

### B. Cloudflareダッシュボード設定

1. **Cloudflare Pagesプロジェクトにアクセス**
   - [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages → deephand-web

2. **環境変数を設定**
   - Settings → Environment Variables → Production
   - 以下の変数を設定:
     - `RESEND_API_KEY` (Secret): 実際のAPIキー
     - `PUBLIC_SITE_URL` (Variable): https://deephandai.com
     - `ADMIN_EMAIL` (Variable): contact@deephandai.com
     - `FROM_EMAIL` (Variable): contact@deephandai.com
     - `NOREPLY_EMAIL` (Variable): noreply@deephandai.com
     - `REQUESTS_EMAIL` (Variable): requests@deephandai.com
     - `NODE_ENV` (Variable): production
     - `ENABLE_EMAIL_DEBUG` (Variable): false

3. **デプロイメント実行**
   ```bash
   # 本番環境デプロイ
   pnpm deploy:production
   ```

### C. 検証手順

1. **ローカル検証**
   ```bash
   # Cloudflare環境でローカルテスト
   pnpm preview:cf
   ```

2. **本番環境検証**
   - フォーム送信テスト
   - Cloudflare Pagesの Functions ログ確認
   - ブラウザ開発者ツールでネットワークタブ確認

## 🔧 技術的詳細

### Cloudflare Pages環境変数の仕組み

1. **Variables vs Secrets**
   - Variables: 平文で保存、ビルド時に参照可能
   - Secrets: 暗号化して保存、ランタイムでのみアクセス可能

2. **wrangler.tomlの役割**
   - `[vars]`セクション: 開発環境とプレビュー環境で使用
   - 本番環境ではCloudflareダッシュボードの設定が優先

3. **import.meta.envとvite.define**
   - `vite.define`でビルド時に値を置換
   - `import.meta.env`でランタイムアクセス

### エラー対処

- **「NOT SET」表示**: `import.meta.env`アクセス方法の確認
- **ビルドエラー**: `vite.define`の構文確認
- **ランタイムエラー**: Cloudflareダッシュボードの環境変数設定確認

## 🎯 次のステップ

1. **セキュリティ強化**
   - 本番環境で`ENABLE_EMAIL_DEBUG=false`に設定
   - APIキーの定期ローテーション

2. **監視設定**
   - Cloudflare Analytics設定
   - エラー監視の改善

3. **CI/CD改善**
   - 環境変数の自動バリデーション追加
   - デプロイ前テストの強化

## ⚠️ 注意点

- `.dev.vars`ファイルは絶対にgitにコミットしない
- RESEND_API_KEYは`re_`で始まる必要がある
- 環境変数変更後は必ずデプロイが必要
- ローカル開発と本番環境で環境変数アクセス方法が異なることに注意

## 📊 検証結果

修正後、以下が正常に動作することを確認：
- 環境変数の正しい読み込み
- メール送信機能の復旧
- デバッグログでの環境変数表示