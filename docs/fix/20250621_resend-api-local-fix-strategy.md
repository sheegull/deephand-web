# Resend API ローカル環境修正戦略レポート

**作成日時**: 2025年6月21日  
**対象**: ローカル開発環境でのResend APIフォーム送信機能修復

## 🔍 問題の概要

### 発生している問題
- ローカル開発環境（`npm run dev`）でコンタクトフォーム送信が500エラーで失敗
- 以前は動作していたが、最近の変更で機能しなくなった
- Cloudflare本番環境での動作には影響しない（重要制約）

### エラー状況
```
POST http://localhost:4321/api/contact 500 (Internal Server Error)
```

## 🔬 根本原因分析

### 1. 環境変数読み込みの問題
**発見事項**:
- package.jsonの`dev`スクリプトが`.env.local`を参照していたが、実際は`.env`ファイルに変更されていた
- astro.config.mjsでViteのdefineを使用しているが、`process.env`は.envファイルを自動読み込みしない
- 一部の環境変数（TEST_EMAIL_RECIPIENT、ENABLE_EMAIL_DEBUG）がastro.config.mjsに含まれていない

### 2. Astroのローカル開発サーバーでの環境変数処理
**技術的詳細**:
- Cloudflare Pagesアダプター使用時、ローカル開発環境では`locals.runtime?.env`が未定義
- `import.meta.env`が期待した値を持たない
- dotenv-cliで.envファイルを読み込んでも、Viteのdefineで明示的に設定する必要がある

## 💡 解決策

### 1. package.json修正 ✅ 完了
```json
// 修正前
"dev": "dotenv -e .env.local -- astro dev"

// 修正後  
"dev": "dotenv -e .env -- astro dev"
```

### 2. 環境変数読み込み改善 ✅ 完了
`src/lib/env.ts`にローカル開発環境専用のフォールバック機能を追加:

```typescript
// ローカル開発環境でのみ process.env から直接読み込み
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  localEnv = {
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    // ... 他の環境変数
  };
}
```

### 3. デバッグ強化 ✅ 完了
API endpointに詳細なデバッグログを追加:
```typescript
console.log('🔍 [API DEBUG] Contact endpoint called');
console.log('🔍 [API DEBUG] Import meta env check:', {
  hasResendKey: !!import.meta.env.RESEND_API_KEY,
  resendKeyPrefix: import.meta.env.RESEND_API_KEY?.substring(0, 10)
});
```

## 🚨 重要な制約事項

### 本番環境保護
- **astro.config.mjsの既存設定は維持** - 本番環境のCloudflare Pages設定を破損しない
- **Cloudflare Workersランタイム環境変数処理は変更しない**
- **本番用のVite define設定は現状維持**

### ローカル環境専用の改善
- `process.env`からの直接読み込みは開発環境でのみ実行
- 型安全性を維持しながらフォールバック機能を実装
- 既存のCloudflareランタイム優先順位は維持

## 📋 検証手順

### 1. ローカル環境での動作確認
```bash
# 1. 開発サーバー起動
npm run dev

# 2. ブラウザで http://localhost:4321/ にアクセス
# 3. コンタクトフォームで送信テスト
# 4. ターミナルでデバッグログ確認
```

### 2. 環境変数確認
デバッグログで以下を確認:
- `🔍 [API DEBUG] Import meta env check:` でRESEND_API_KEYが正しく読み込まれているか
- `🔍 [API DEBUG] Email config validation result:` でバリデーションが通るか

### 3. 本番環境への影響確認
```bash
# 本番ビルドで問題ないことを確認
npm run build
```

## 🔄 今後の改善計画

### Phase 1: 緊急修正 ✅ 完了
- [x] package.json devスクリプト修正
- [x] env.tsローカル環境対応
- [x] デバッグログ追加

### Phase 2: 詳細検証 🔄 進行中
- [ ] ローカル環境でのフォーム送信テスト
- [ ] エラーログの詳細分析
- [ ] 必要に応じた追加修正

### Phase 3: 安定化
- [ ] デバッグログの本番用清掃
- [ ] 環境変数管理の最適化
- [ ] ドキュメント更新

## 🎯 成功指標

### 必須条件
1. ローカル環境でコンタクトフォーム送信が成功する
2. 本番環境（Cloudflare Pages）で既存機能が継続動作する
3. 環境変数が正しく読み込まれる

### 追加目標
1. デバッグ情報が分かりやすく表示される
2. 今後同様の問題が発生しにくい設計になる
3. 開発効率が向上する

## 📝 注意事項

### 開発時の注意
- **.envファイルの機密情報管理**: 実際のAPIキーが含まれているため、コミット前に確認
- **型安全性の維持**: TypeScriptの型チェックを満たす実装
- **Cloudflareアダプター互換性**: 本番環境での動作を阻害しない

### デプロイ時の注意
- **環境変数の設定確認**: Cloudflare Pagesでの環境変数が正しく設定されているか
- **ビルド時エラーの確認**: 本番ビルドで問題が発生していないか
- **機能テスト**: 本番環境でのフォーム送信テスト

---

**次のステップ**: ローカル環境でのフォーム送信テストを実行し、修正効果を確認する