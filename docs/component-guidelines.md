# コンポーネントガイドライン

**作成日**: 2025年1月17日  
**プロジェクト**: DeepHand Web

## 概要

このドキュメントでは、DeepHand Webプロジェクトで使用するコンポーネントの設計原則、使用方法、ベストプラクティスについて説明します。

## コンポーネント設計原則

### 1. 型安全性
- すべてのコンポーネントはTypeScriptで記述し、適切な型定義を含める
- Props interfaceを明確に定義し、エクスポートする
- `React.forwardRef`を使用してref転送をサポートする

### 2. 拡張性
- `className`プロパティで外部からのスタイル拡張を許可
- `...props`でHTMLの標準属性を転送
- 複数のvariant（バリエーション）をサポート

### 3. 一貫性
- デザインシステムに基づいた統一されたスタイル
- 共通の命名規則とディレクトリ構造
- cn()関数を使用したクラス名の統合

## 主要コンポーネント

### Button コンポーネント

#### 基本的な使用方法
```tsx
import { Button } from '@/components/ui/button';

// 基本的なボタン
<Button>クリック</Button>

// variantを指定
<Button variant="secondary">セカンダリボタン</Button>

// サイズを指定
<Button size="lg">大きなボタン</Button>
```

#### Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

#### Variants
- **primary** (デフォルト): グラデーション背景、メインアクション用
- **secondary**: ボーダーあり、サブアクション用
- **outline**: アウトライン、軽いアクション用
- **ghost**: 背景なし、ナビゲーション用
- **link**: リンクスタイル

#### Sizes
- **sm**: 高さ36px、小さなUI要素用
- **default**: 高さ48px、標準的なボタン
- **lg**: 高さ56px、重要なアクション用
- **icon**: 40x40px、アイコンボタン用

#### 使用例
```tsx
// プライマリアクション
<Button size="lg" onClick={handleSubmit}>
  送信
</Button>

// セカンダリアクション
<Button variant="secondary" onClick={handleCancel}>
  キャンセル
</Button>

// アイコンボタン
<Button variant="ghost" size="icon">
  <Icon name="menu" />
</Button>

// as Childパターン（Linkとして使用）
<Button asChild>
  <Link href="/contact">お問い合わせ</Link>
</Button>
```

### Card コンポーネント

#### 基本的な使用方法
```tsx
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>カードタイトル</CardTitle>
    <CardDescription>カードの説明文</CardDescription>
  </CardHeader>
  <CardContent>
    <p>カードのメインコンテンツ</p>
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>
```

#### 構成要素

##### Card
- メインコンテナ
- 角丸、ボーダー、シャドウを含む
- ホバー効果あり

##### CardHeader
- カードの上部、タイトルと説明用
- `pb-4`で下部余白

##### CardTitle
- `h3`要素、`text-xl`サイズ
- セマンティックな見出し

##### CardDescription
- `p`要素、`text-sm`で説明文
- グレー色で補助的な情報

##### CardContent
- メインコンテンツエリア
- `pt-0`でヘッダーとの隙間なし

##### CardFooter
- アクションボタンや追加情報用
- flexboxでアイテム配置

#### 使用例
```tsx
// 情報カード
<Card>
  <CardHeader>
    <CardTitle>サービス概要</CardTitle>
    <CardDescription>
      DeepHandが提供するAIソリューション
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ul>
      <li>手話認識技術</li>
      <li>音声変換システム</li>
      <li>リアルタイム処理</li>
    </ul>
  </CardContent>
  <CardFooter>
    <Button>詳細を見る</Button>
  </CardFooter>
</Card>

// シンプルなカード
<Card className="w-80">
  <CardContent className="pt-6">
    <p>簡潔な情報表示</p>
  </CardContent>
</Card>
```

## スタイルシステム

### クラス名統合 (cn関数)
```tsx
import { cn } from '@/lib/utils';

// 基本的な使用方法
const className = cn(
  'base-class',
  conditionalClass && 'conditional-class',
  customClassName
);

// コンポーネント内での使用
<div className={cn('default-styles', className)} />
```

### Tailwind CSS設計パターン

#### レスポンシブデザイン
```css
/* モバイルファースト */
.component {
  @apply text-sm;           /* デフォルト */
  @apply md:text-base;      /* タブレット以上 */
  @apply lg:text-lg;        /* デスクトップ以上 */
}
```

#### カラーシステム
- **Primary**: `#234ad9` - メインブランドカラー
- **Primary Dark**: `#1e3eb8` - ホバー状態
- **Gray系**: `gray-100`〜`gray-900` - テキストとボーダー
- **White/Black**: 背景と高コントラストテキスト

#### スペーシングシステム
- **内部余白**: `p-4`, `p-6`, `px-4`, `py-2`
- **外部余白**: `m-2`, `m-4`, `mt-8`, `mb-6`
- **ギャップ**: `gap-2`, `gap-4`, `space-y-4`

## ベストプラクティス

### 1. コンポーネント作成
```tsx
// ✅ 良い例
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
          variant === 'secondary' && 'secondary-styles',
          size === 'sm' && 'small-styles',
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

### 2. フォルダ構造
```
src/components/
├── ui/                    # 基本UIコンポーネント
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── common/                # 共通コンポーネント
│   ├── Container.tsx
│   └── Layout.tsx
├── features/              # 機能別コンポーネント
│   ├── ContactForm/
│   └── HeroSection/
├── forms/                 # フォーム関連
│   └── ContactForm.tsx
└── islands/               # Astro Islands
    ├── ContactModal.tsx
    └── LanguageSwitcher.tsx
```

### 3. インポート規則
```tsx
// ✅ 推奨: 絶対パスでインポート
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ❌ 避ける: 相対パス
import { Button } from '../../ui/button';
```

### 4. テスト作成
```tsx
// コンポーネントテストの基本構造
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-2');
  });
});
```

## アクセシビリティ

### 1. セマンティックHTML
- 適切なHTML要素を使用（`button`, `h1-h6`, `p`, `ul`, `li`など）
- `role`属性で意味を明確化
- `aria-*`属性でアクセシビリティ情報を提供

### 2. キーボードナビゲーション
- `tabIndex`で適切なフォーカス順序
- `onKeyDown`でキーボード操作をサポート
- フォーカス状態の視覚的表示

### 3. カラーコントラスト
- テキストと背景の十分なコントラスト
- 色だけに依存しない情報伝達
- カラーブラインドに配慮した配色

## パフォーマンス考慮事項

### 1. バンドルサイズ
- 必要な機能のみをインポート
- Tree shakingを活用
- 大きなライブラリの動的インポート

### 2. レンダリング最適化
- `React.memo`で不要な再レンダリングを防止
- `useMemo`と`useCallback`で重い計算をメモ化
- 仮想化で大量データの表示を最適化

### 3. 画像最適化
- 適切なフォーマット（WebP, AVIF）
- レスポンシブ画像
- 遅延読み込み

## 今後の拡張計画

1. **フォームコンポーネント**: Input, Select, Checkbox, Radioの統一
2. **レイアウトコンポーネント**: Grid, Flex, Containerの体系化
3. **フィードバックコンポーネント**: Toast, Modal, Tooltipの追加
4. **データ表示コンポーネント**: Table, List, Paginationの実装
5. **ナビゲーションコンポーネント**: Breadcrumb, Tab, Menuの拡充

---

このガイドラインは、プロジェクトの成長に合わせて継続的に更新されます。新しいコンポーネントを追加する際は、このドキュメントの原則に従って実装してください。