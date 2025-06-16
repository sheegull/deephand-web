# deephand-web コードクリーンアップ戦略

作成日: 2025年1月16日

## Phase 1: 即座に実行可能な削除作業（影響度: 低）

### タスクリスト
- [ ] バックアップファイルの削除
  - [ ] `src/components/islands/DataRequestForm.tsx.backup`を削除
  
- [ ] 未使用CSSファイルの削除
  - [ ] `src/styles/global.css`を削除（app.cssを直接使用）

- [ ] console文の削除
  - [ ] `src/pages/index.astro`の19行目のconsole.log削除
  - [ ] その他12ファイルのconsole文を確認・削除

## Phase 2: コンポーネントの統一（影響度: 中）

### タスクリスト
- [ ] Buttonコンポーネントの統一
  - [ ] `src/components/ui/button.tsx`を基準に統一
  - [ ] `src/components/common/Button.tsx`を削除
  - [ ] インポートパスをすべて`@/components/ui/button`に変更
  
- [ ] Cardコンポーネントの統一
  - [ ] `src/components/ui/card.tsx`を基準に統一
  - [ ] `src/components/common/Card.tsx`を削除
  - [ ] インポートパスをすべて`@/components/ui/card`に変更

- [ ] Layoutの統一
  - [ ] `src/layouts/Layout.astro`を削除
  - [ ] すべてのページで`BaseLayout.astro`を使用

## Phase 3: 共通関数の統一（影響度: 中）

### タスクリスト
- [ ] cn関数の重複解消
  - [ ] すべてのUIコンポーネントで独自実装のcn関数を削除
  - [ ] `@/lib/utils`からcn関数をインポートするよう変更
  - [ ] 影響ファイル:
    - [ ] `src/components/ui/button.tsx`
    - [ ] `src/components/ui/card.tsx`
    - [ ] `src/components/ui/textarea.tsx`
    - [ ] `src/components/ui/input.tsx`
    - [ ] `src/components/ui/checkbox.tsx`
    - [ ] `src/components/ui/label.tsx`

## Phase 4: ディレクトリ構造の整理（影響度: 高）

### タスクリスト
- [ ] commonディレクトリの削除
  - [ ] `src/components/common/`内のコンポーネントを確認
  - [ ] 必要なものは`src/components/ui/`に移動
  - [ ] `src/components/common/index.ts`を削除
  - [ ] インポートパスをすべて更新

## Phase 5: 大きなファイルの分割（影響度: 高）

### タスクリスト
- [ ] email.tsの分割（771行）
  - [ ] `src/lib/email/`ディレクトリを作成
  - [ ] `templates.ts` - メールテンプレート部分を分離
  - [ ] `sender.ts` - 送信ロジックを分離
  - [ ] `validation.ts` - バリデーションロジックを分離
  - [ ] `index.ts` - エクスポートの統合
  
- [ ] RequestDataPage.tsxの分割（527行）
  - [ ] フォームロジックを`useRequestForm`カスタムフックに分離
  - [ ] API通信を`services/request.ts`に分離
  - [ ] フォームフィールドを個別コンポーネントに分離

- [ ] HeroSection.tsxの分割（428行）
  - [ ] ナビゲーション部分を`HeroNavigation`コンポーネントに分離
  - [ ] アニメーション部分を`HeroAnimation`コンポーネントに分離
  - [ ] CTAボタン部分を`HeroCTA`コンポーネントに分離

## Phase 6: パフォーマンス最適化（影響度: 中）

### タスクリスト
- [ ] 重複CSSクラスの削除
  - [ ] `src/styles/app.css`のbtn-primary、btn-secondaryクラスを削除
  - [ ] Buttonコンポーネントのスタイルに統一

- [ ] テストファイルの最適化
  - [ ] 500行を超えるテストファイルを分割
  - [ ] 共通のテストユーティリティを抽出

## Phase 7: 品質向上（影響度: 低）

### タスクリスト
- [ ] TODOコメントの対応
  - [ ] `src/lib/deployment-process.ts`のTODOを実装または削除

- [ ] インポートパスの統一
  - [ ] すべてのインポートを絶対パス（@/）に統一
  - [ ] tsconfig.jsonのパスマッピングを確認

## 実装順序の推奨

1. **Phase 1** - 即座に実行（リスクなし）
2. **Phase 3** - cn関数の統一（中程度の作業量、低リスク）
3. **Phase 2** - コンポーネントの統一（中程度の作業量、要テスト）
4. **Phase 6** - パフォーマンス最適化（並行して実施可能）
5. **Phase 4** - ディレクトリ構造の整理（高影響度、慎重に実施）
6. **Phase 5** - 大きなファイルの分割（高作業量、機能別に段階実施）
7. **Phase 7** - 品質向上（継続的に実施）

## 期待される成果

- **コード削減**: 約930行（約8%削減）
- **保守性向上**: 重複コードの削除により大幅に向上
- **パフォーマンス**: バンドルサイズの削減
- **開発効率**: 統一されたコンポーネントによる開発速度向上