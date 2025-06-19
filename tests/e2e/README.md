# End-to-End Tests

このディレクトリには、ユーザー操作の完全なフローをテストするE2Eテストが含まれています。

## 構造

- `hero-section-refactored.test.ts` - リファクタリング後のHeroSectionテスト
- `phase2-migration.test.ts` - Phase 2移行の検証

## 実行方法

```bash
# 全てのE2Eテストを実行
npx playwright test tests/e2e/

# ヘッドレスモードで実行
npx playwright test tests/e2e/ --headed

# 特定のテストを実行
npx playwright test tests/e2e/hero-section-refactored.test.ts
```

## テスト内容

- フォーム送信フロー
- ナビゲーション機能
- レスポンシブデザイン検証
- パフォーマンス測定
- アクセシビリティ検証