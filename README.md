# DeepHand Web

**手話認識AIソリューション** - モダンなWebアプリケーション

DeepHand Webは、手話認識技術を活用したAIソリューションを提供するWebアプリケーションです。Astro v5.9.3をベースとしたJAMstackアーキテクチャで構築され、高いパフォーマンスとユーザビリティを実現しています。

## ✨ 主な機能

- 🎯 **手話認識AI**: リアルタイム手話認識技術
- 🔄 **音声変換**: 手話を音声・テキストに変換
- 📱 **レスポンシブデザイン**: すべてのデバイスで最適な体験
- 🚀 **高速パフォーマンス**: Astro Islands架構による最適化
- 🌐 **多言語対応**: 日本語・英語切り替え機能
- 📧 **お問い合わせ**: スムーズなコンタクトフォーム
- 📊 **データリクエスト**: カスタムデータ要求システム

## 🛠 技術スタック

### フロントエンド
- **Astro** v5.9.3 - メタフレームワーク
- **React** v19.1.0 - UIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS** v3.4.17 - ユーティリティCSS
- **Framer Motion** - アニメーションライブラリ

### バックエンド
- **Astro API Routes** - サーバーサイド機能
- **Resend** - メール送信サービス
- **Zod** - スキーマ検証

### 開発ツール
- **Vite** - 高速ビルドツール
- **Vitest** v3.2.3 - テストフレームワーク
- **ESLint** - 静的解析
- **Prettier** - コードフォーマッター

## 🚀 Getting Started

### 必要な環境

- **Node.js** 18.x以上 (推奨: 20.x LTS)
- **npm** または **yarn**, **pnpm**

### インストールとセットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd deephand-web

# 依存関係をインストール
npm install

# 環境変数ファイルを作成
cp .env.example .env.local

# 開発サーバーを起動
npm run dev
```

### 環境変数設定

`.env.local`ファイルで以下を設定してください：

```bash
# メール設定（Resend API Key）
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
ADMIN_EMAIL=admin@example.com
FROM_EMAIL=noreply@example.com
NOREPLY_EMAIL=noreply@example.com

# サイトURL
PUBLIC_SITE_URL=http://localhost:4321

# デバッグ設定（開発時のみ）
ENABLE_EMAIL_DEBUG=true
```

## 📁 プロジェクト構造

```
deephand-web/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── ui/             # 基本UIコンポーネント
│   │   ├── common/         # 共通コンポーネント
│   │   ├── features/       # 機能別コンポーネント
│   │   ├── forms/          # フォームコンポーネント
│   │   └── islands/        # Astro Islands
│   ├── lib/                # ビジネスロジック
│   │   ├── email/          # メール機能（モジュラー）
│   │   ├── animations/     # アニメーション設定
│   │   └── utils.ts        # ユーティリティ関数
│   ├── pages/              # ページとAPIルート
│   │   ├── api/            # APIエンドポイント
│   │   ├── index.astro     # ホームページ
│   │   └── request.astro   # データリクエストページ
│   └── styles/             # グローバルスタイル
├── public/                 # 静的アセット
├── tests/                  # テストファイル
├── docs/                   # プロジェクトドキュメント
└── dist/                   # ビルド出力
```

## 🧞 Commands

| Command | Action |
|:--------|:-------|
| `npm install` | 依存関係をインストール |
| `npm run dev` | 開発サーバーを起動 (`localhost:4321`) |
| `npm run build` | 本番用ビルドを作成 (`./dist/`) |
| `npm run preview` | ビルド結果をローカルでプレビュー |
| `npm test` | テストを実行 |
| `npm run test:coverage` | カバレッジ付きでテストを実行 |
| `npm run typecheck` | TypeScript型チェックを実行 |
| `npm run lint` | ESLintでコードを検証 |
| `npm run format` | Prettierでコードをフォーマット |

## 🧪 テスト

### テスト実行
```bash
# すべてのテストを実行
npm test

# ウォッチモードでテスト
npm run test:watch

# カバレッジレポート生成
npm run test:coverage

# 特定のテストファイルを実行
npm test -- src/components/__tests__/Button.test.tsx
```

### テストの種類
- **ユニットテスト**: コンポーネントとユーティリティ関数
- **統合テスト**: API機能とデータフロー
- **リファクタリングテスト**: コード品質と構造検証

## 🏗 開発ガイドライン

### コンポーネント作成
```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          variant === 'primary' && 'primary-styles',
          size === 'lg' && 'large-styles',
          className
        )}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component };
```

### インポート規則
```typescript
// 絶対パスを使用
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 相対パスは避ける
// import { Button } from '../../ui/button';
```

## 🚀 デプロイ

### Cloudflare Pages
```bash
# 本番ビルド
npm run build

# Cloudflare Pagesにデプロイ
npm run deploy
```

### 環境別デプロイ
```bash
# 本番環境
npm run deploy:production

# プレビュー環境
npm run deploy:preview
```

## 📈 パフォーマンス

### Core Web Vitals目標
- **LCP (Largest Contentful Paint)**: < 2.5秒
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 最適化手法
- 静的サイト生成（SSG）
- Islands Architecture
- 画像最適化（WebP/AVIF）
- コード分割
- CSS最適化

## 🔒 セキュリティ

- 入力値検証（Zod schema）
- CSRF保護
- XSS防止
- セキュリティヘッダー
- 依存関係脆弱性監視

## 🤝 Contributing

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コミット規約
```
<type>(<scope>): <description>

feat: 新機能
fix: バグ修正
docs: ドキュメント
style: コードスタイル
refactor: リファクタリング
test: テスト
chore: ビルド・ツール
```

## 📚 ドキュメント

- [コンポーネントガイドライン](./docs/component-guidelines.md)
- [開発ガイドライン](./docs/development-guidelines.md)
- [パフォーマンスガイドライン](./docs/performance-guidelines.md)
- [システムアーキテクチャ](./docs/architecture.md)

## 🏆 プロジェクト成果

### リファクタリング成果（2025年1月）
- ✅ **24個の不要ファイル削除** (200KB削減)
- ✅ **Email機能のモジュラー化** (772行→4モジュール)
- ✅ **コンポーネント構造統一** (重複解決)
- ✅ **型安全性100%達成** (TypeScriptエラー0)
- ✅ **テストカバレッジ大幅向上** (ユニット・統合・E2E)
- ✅ **Console文48%削減** (構造化ログ導入)

## 🆘 トラブルシューティング

### よくある問題

**依存関係エラー**
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

**ビルドエラー**
```bash
# キャッシュクリア
npm run build -- --clean
npm run typecheck
```

**メール送信エラー**
- `RESEND_API_KEY`の設定確認
- 環境変数の読み込み確認
- API制限の確認

## 📝 ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

## 👥 チーム

- **開発**: DeepHand Development Team
- **設計**: UI/UX Design Team
- **AI技術**: Machine Learning Team

## 📞 お問い合わせ

- **ウェブサイト**: [https://deephand.example.com](https://deephand.example.com)
- **お問い合わせ**: [contact@deephand.example.com](mailto:contact@deephand.example.com)
- **技術サポート**: [support@deephand.example.com](mailto:support@deephand.example.com)

---

**Made with ❤️ by DeepHand Team**

手話とテクノロジーの橋渡しを目指して 🤟