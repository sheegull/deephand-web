# 開発ガイドライン

**作成日**: 2025年1月17日  
**プロジェクト**: DeepHand Web

## 概要

このドキュメントでは、DeepHand Webプロジェクトの開発環境のセットアップ、コーディング規約、開発ワークフローについて説明します。

## 開発環境セットアップ

### 必要なソフトウェア

#### Node.js
- **バージョン**: 18.x以上
- **推奨**: 20.x LTS
- **インストール**: [公式サイト](https://nodejs.org/)またはnvm使用

#### パッケージマネージャー
- **推奨**: npm (Node.js付属)
- **代替**: yarn, pnpm

#### エディタ
- **推奨**: Visual Studio Code
- **必須拡張機能**:
  - TypeScript and JavaScript Language Features
  - Astro
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### プロジェクトのクローンとセットアップ

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

`.env.local`ファイルで以下を設定：

```bash
# メール設定
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
ADMIN_EMAIL=admin@deephand.example.com
FROM_EMAIL=noreply@deephand.example.com
NOREPLY_EMAIL=noreply@deephand.example.com

# サイトURL
PUBLIC_SITE_URL=http://localhost:4321

# デバッグ設定
ENABLE_EMAIL_DEBUG=true
```

## 技術スタック

### フロントエンド
- **Astro** v5.9.3 - メタフレームワーク
- **React** v19.1.0 - UIライブラリ
- **TypeScript** - 型安全な開発
- **Tailwind CSS** v3.4.17 - ユーティリティファーストCSS

### バックエンド
- **Astro API Routes** - サーバーサイド機能
- **Resend** - メール送信サービス

### ツールチェーン
- **Vite** - ビルドツール
- **Vitest** v3.2.3 - テストフレームワーク
- **ESLint** - 静的解析
- **Prettier** - コードフォーマッター

## コーディング規約

### TypeScript

#### 基本ルール
- 厳密なTypeScript設定を使用
- `any`型の使用を避ける
- 明示的な型定義を優先

```typescript
// ✅ 良い例
interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function processUser(user: UserData): string {
  return `${user.name} (${user.email})`;
}

// ❌ 避ける
function processUser(user: any) {
  return user.name + ' (' + user.email + ')';
}
```

#### 型定義の配置
- コンポーネントと同ファイルでProps interface
- 共通型は`src/types/`ディレクトリ
- API型は各APIルートファイル内

```typescript
// コンポーネントファイル内
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

// 共通型ファイル (src/types/common.ts)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### React コンポーネント

#### 関数コンポーネント
- 関数宣言よりも`forwardRef`を優先
- Props destructuringを使用
- displayNameを設定

```typescript
import { forwardRef } from 'react';

export interface ComponentProps {
  // Props定義
}

const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ prop1, prop2, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {/* JSX */}
      </div>
    );
  }
);
Component.displayName = 'Component';

export { Component };
```

#### フック使用
- useStateの初期値を明確に
- useEffectの依存配列に注意
- カスタムフックで複雑なロジックを分離

```typescript
// ✅ 良い例
function useEmailForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await submitEmail(data);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, status, handleSubmit };
}
```

### CSS とスタイリング

#### Tailwind CSS
- ユーティリティクラスを優先
- カスタムCSSは最小限に
- レスポンシブデザインパターンを統一

```typescript
// ✅ 推奨パターン
<button className={cn(
  // ベーススタイル
  'inline-flex items-center justify-center rounded-lg font-medium transition-all',
  // レスポンシブ
  'text-sm md:text-base',
  'px-4 py-2 md:px-6 md:py-3',
  // 状態
  'hover:shadow-lg active:scale-95',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  // バリアント
  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
  variant === 'secondary' && 'border border-gray-300 hover:bg-gray-50',
  className
)}>
```

#### クラス名統合
- `cn()`関数を使用
- 条件付きクラスは論理演算子で
- カスタムクラスは最後に配置

### ファイル構造

#### ディレクトリ規約
```
src/
├── components/          # コンポーネント
│   ├── ui/             # 基本UIコンポーネント
│   ├── common/         # 共通コンポーネント
│   ├── features/       # 機能別コンポーネント
│   ├── forms/          # フォームコンポーネント
│   └── islands/        # Astro Islands
├── lib/                # ユーティリティとロジック
│   ├── __tests__/      # ライブラリのテスト
│   ├── email/          # メール機能（モジュラー）
│   └── utils.ts        # 共通ユーティリティ
├── pages/              # Astroページとルート
│   ├── api/            # APIエンドポイント
│   └── index.astro     # ページファイル
├── styles/             # グローバルスタイル
└── types/              # 共通型定義
```

#### ファイル命名
- コンポーネント: PascalCase (`Button.tsx`, `ContactForm.tsx`)
- ページ: kebab-case (`index.astro`, `contact-us.astro`)
- ユーティリティ: camelCase (`utils.ts`, `emailHelpers.ts`)
- 定数: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### インポート規約

#### インポート順序
```typescript
// 1. Node modules
import React from 'react';
import { forwardRef } from 'react';

// 2. Astro imports
import Layout from '@/layouts/Layout.astro';

// 3. 内部ライブラリ
import { cn } from '@/lib/utils';
import { validateEmail } from '@/lib/validation';

// 4. コンポーネント
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 5. 型定義
import type { ComponentProps } from './types';
```

#### 絶対パス使用
```typescript
// ✅ 推奨
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ❌ 避ける
import { Button } from '../../components/ui/button';
import { cn } from '../utils';
```

## テスト戦略

### テストファイルの配置
- ユニットテスト: `src/**/__tests__/` または `.test.ts`併設
- 統合テスト: `tests/integration/`
- E2Eテスト: `tests/e2e/`
- リファクタリングテスト: `tests/refactoring/`

### テスト作成指針

#### コンポーネントテスト
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  // 基本機能のテスト
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  // バリアントのテスト
  it('applies variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-gray-300');
  });

  // イベントハンドリングのテスト
  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### ユーティリティ関数テスト
```typescript
import { cn } from './utils';

describe('cn function', () => {
  it('combines class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active', false && 'inactive'))
      .toBe('base active');
  });
});
```

## 開発ワークフロー

### ブランチ戦略
- `main`: 本番環境用の安定版
- `develop`: 開発統合ブランチ
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `refactor/*`: リファクタリング

### 開発手順
1. **ブランチ作成**
   ```bash
   git checkout -b feature/new-component
   ```

2. **開発とテスト**
   ```bash
   # 開発サーバー起動
   npm run dev
   
   # テスト実行
   npm test
   
   # 型チェック
   npm run typecheck
   
   # リント実行
   npm run lint
   ```

3. **コミット**
   ```bash
   # ステージング
   git add .
   
   # コミット（適切なメッセージで）
   git commit -m "feat: add new button component with variants"
   ```

4. **プルリクエスト**
   - 適切なタイトルと説明
   - 関連するissueの参照
   - テスト結果の確認

### コミットメッセージ規約
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイル（機能に影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルドプロセスやツール更新

**例**:
```
feat(button): add size variants for button component

- Add sm, md, lg, and icon size options
- Update component tests
- Add usage examples to documentation

Closes #123
```

## デバッグとトラブルシューティング

### 一般的な問題と解決策

#### ビルドエラー
```bash
# 依存関係の再インストール
npm ci

# キャッシュクリア
npm run build -- --clean

# 型エラーの確認
npm run typecheck
```

#### 開発サーバーの問題
```bash
# ポート変更
npm run dev -- --port 3000

# ホスト設定
npm run dev -- --host 0.0.0.0
```

#### メール機能のテスト
```bash
# 環境変数の確認
node -e "console.log(process.env.RESEND_API_KEY)"

# メール設定のデバッグ
ENABLE_EMAIL_DEBUG=true npm run dev
```

### パフォーマンス監視

#### ビルドサイズ分析
```bash
# バンドル分析
npm run build
npx astro build --analyze

# 依存関係サイズ確認
npx bundlephobia-cli
```

#### 開発時のパフォーマンス
- React Developer Toolsの使用
- Lighthouse監査の定期実行
- Core Web Vitalsの監視

## セキュリティ考慮事項

### 環境変数
- 機密情報は`.env.local`に保存
- `.env.example`でテンプレート提供
- 本番環境では環境変数で設定

### API セキュリティ
- 入力値の検証
- CSRFトークンの使用
- レート制限の実装

### フロントエンド セキュリティ
- XSS攻撃の防止
- Content Security Policyの設定
- 依存関係の脆弱性監視

```bash
# 脆弱性チェック
npm audit

# 依存関係の更新
npm update
```

## 継続的改善

### コードレビュー
- すべてのPRにレビューを必須
- コーディング規約の遵守確認
- パフォーマンスへの影響評価

### 定期メンテナンス
- 依存関係の月次更新
- セキュリティパッチの即座適用
- パフォーマンスベンチマークの実行

### ドキュメント更新
- 機能追加時のドキュメント更新
- APIの変更履歴の管理
- トラブルシューティングの蓄積

---

このガイドラインは、チーム全体の開発効率向上とコード品質維持を目的としています。不明点があれば、チーム内で相談し、ガイドラインの改善提案も歓迎します。