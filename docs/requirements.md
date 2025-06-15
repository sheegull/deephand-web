DeepHand Webサイト要件定義書 v1
1. プロジェクト概要
1.1 基本情報

サービス名: DeepHand
目的: AI・ロボティクスに特化したデータアノテーションサービスのMVP構築
ビジョン: 将来的にAI・ロボティクスのデータ流通インフラを目指す
MVP目標: データアノテーション請負を通じた顧客ペインの特定
開発方針: 実用性とイノベーションのバランスを重視

1.2 ターゲット

主要顧客: AI・ロボティクス開発企業（スタートアップ〜大企業）,研究所, 大学, 個人プロジェクト
地域: 日本・グローバル
言語: 日本語・英語

2. 技術スタック
2.1 コアアーキテクチャ

フレームワーク: Astro 4.x + TypeScript
UIライブラリ: React 18（Astro統合）
スタイリング: Tailwind CSS 4.0（Oxide Engine）
アニメーション:

Framer Motion（メイン）
CSS Animations（軽量アニメーション）
Lottie React（高品質アニメーション）
React Three Fiber（3Dビジュアル - Phase 2）


状態管理: Zustand（必要に応じて）
フォーム: React Hook Form + Zod
国際化: react-i18next

2.2 インフラストラクチャ

ホスティング: Cloudflare Pages
API: Cloudflare Workers
メール送信: Resend API
分析: Cloudflare Web Analytics（プライバシー重視・無料）
DNS/CDN: Cloudflare

2.3 開発環境

パッケージマネージャー: pnpm
バージョン管理: Git + GitHub
CI/CD: GitHub Actions
コード品質:

ESLint (Airbnb設定ベース)
Prettier
TypeScript (strict mode)
Husky + lint-staged


開発サーバー: Astro Dev Server

3. アーキテクチャ設計
3.1 Astro Islands Architecture
静的HTML（高速） + Reactコンポーネント（インタラクティブ部分のみ）
├── 静的コンテンツ: Astroで生成
├── お問い合わせフォーム: React Island
├── データリクエストフォーム: React Island
├── 言語切り替え: React Island
└── アニメーション要素: React Island（必要に応じて）
3.2 ディレクトリ構造
deephand-web/
├── src/
│   ├── components/
│   │   ├── common/      # 共通コンポーネント
│   │   ├── forms/       # フォーム関連
│   │   └── sections/    # ページセクション
│   ├── layouts/         # レイアウト
│   ├── pages/           # ルーティング
│   │   ├── index.astro
│   │   ├── request-data.astro
│   │   └── api/         # API routes
│   ├── styles/          # グローバルスタイル
│   ├── i18n/           # 翻訳ファイル
│   ├── lib/            # ユーティリティ
│   └── types/          # TypeScript型定義
├── public/             # 静的アセット
└── astro.config.mjs
4. ページ構成・機能要件
4.1 トップページ (/)

Hero Section

キャッチコピー（アニメーション付き）
CTAボタン → データリクエストページ
背景: CSSグラデーション + パーティクルアニメーション（軽量）


Service Overview

データタイプカード（ホバーエフェクト）
アイコン: Lucide React Icons


Process Flow

3ステップビジュアル
スクロールトリガーアニメーション


Why Choose DeepHand

特徴カード（4つ）
アイコン + 説明文


CTA Section

2つのCTA（Request Data / Get in Touch）
背景: グラデーション



4.2 データリクエストページ (/request-data)

マルチステップフォーム（3ステップ）

Step 1: 基本情報
Step 2: プロジェクト詳細
Step 3: 確認・送信


プログレスバー表示
入力値の一時保存（sessionStorage）
確認モーダル

4.3 API エンドポイント

POST /api/contact - お問い合わせ送信
POST /api/request - データリクエスト送信

5. 技術選定理由（改訂版）
5.1 Astro + React の選択理由

Astro: 静的サイト生成で最高のパフォーマンス
React: 豊富なエコシステム、採用しやすさ
組み合わせ: 必要な部分のみReact化で両方のメリット

5.2 Tailwind CSS v4 の選択理由

Oxide Engine: Rust製エンジンによる超高速ビルド（10倍高速化）
Lightning CSS: 最新CSS機能の自動ポリフィル
CSS-first設定: より直感的な設定方法
バンドルサイズ削減: v3比で最大50%削減
将来性: 最新版採用でメンテナンス期間延長

5.3 その他の選択

React Hook Form: 業界標準、パフォーマンス良好
Framer Motion: 公式版で安定、ドキュメント充実
Cloudflare: 無料枠充実、エンタープライズ級性能

6. デザインシステム
6.1 Tailwind CSS v4 設定
css/* app.css - Tailwind v4のCSS-first設定 */
@import "tailwindcss";

@theme {
  /* カラーパレット */
  --color-primary: #00FF88;
  --color-primary-dark: #00CC6A;
  --color-primary-light: #33FFB3;

  --color-gray-50: #F9FAFB;
  --color-gray-900: #0A0A0A;

  /* カスタムスペーシング */
  --spacing-section: 5rem;

  /* フォントファミリー */
  --font-family-sans: 'Inter', 'Noto Sans JP', system-ui;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* アニメーション */
  --animate-duration-fast: 150ms;
  --animate-duration-normal: 300ms;
  --animate-duration-slow: 500ms;
}
6.2 コンポーネントライブラリ

ベース: Radix UI（アクセシビリティ保証）
スタイリング: Tailwind CSS v4
バリアント管理: CVA (class-variance-authority)
カスタムユーティリティ: CSS Layersで管理

7. パフォーマンス戦略
7.1 Tailwind CSS v4 最適化

JIT by default: 使用クラスのみ生成
Lightning CSS: ベンダープレフィックス自動付与
CSS Layers: カスケード制御で詳細度問題解決
PostCSS不要: ビルド時間短縮

7.2 段階的な最適化アプローチ

Phase 1 (MVP): 基本的な最適化

画像最適化（WebP, AVIF）
Critical CSS（Tailwind v4で自動最適化）
基本的な遅延読み込み


Phase 2: 測定に基づく最適化

Core Web Vitals モニタリング
ボトルネック特定・改善
必要に応じた高度な最適化



7.3 目標メトリクス

Lighthouse Score: 90+ (MVP) → 95+ (最適化後)
FCP: < 2秒
TTI: < 3.5秒
CSS Bundle: < 10KB (gzip)

8. 開発フェーズ（現実的なスケジュール）
Phase 1: MVP開発（2週間）

Week 1:

 環境構築・Tailwind v4設定
 デザインシステム構築
 トップページ実装
 基本的なレスポンシブ対応


Week 2:

 データリクエストページ
 フォーム機能実装
 API実装（Workers）
 多言語対応基盤



Phase 2: 品質向上（1週間）

 アニメーション追加
 エラーハンドリング
 アクセシビリティ改善
 SEO最適化

Phase 3: リリース準備（3日）

 パフォーマンステスト
 ブラウザ互換性確認
 最終調整・デプロイ

9. リスク管理
9.1 技術的リスクと対策

リスク: Tailwind v4の新しさによる情報不足
対策: 公式ドキュメント重視、v3からの移行ガイド活用

9.2 運用リスクと対策

リスク: メール送信制限（100通/日）
対策: 初期は十分、成長時に有料プラン移行

10. 将来の拡張性
10.1 技術的拡張

React開発者の採用が容易
Tailwind v4の長期サポート期待
コンポーネントの再利用性高い

10.2 機能拡張ロードマップ

ブログ機能（Astro Content Collections）
ダッシュボード（認証付き）
API公開
リアルタイムチャット

11. 成功の定義
11.1 技術的成功指標

エラー率 < 0.5%
ページロード時間 < 2.5秒
Lighthouse Score 90+
CSS Bundle < 10KB

11.2 ビジネス成功指標

月間10件以上の有効問い合わせ
直帰率 < 60%
フォーム完了率 > 20%
