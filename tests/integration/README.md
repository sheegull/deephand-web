# Integration Tests

このディレクトリには、複数のコンポーネントやシステム間の統合テストが含まれています。

## 構造

- `refactoring-validation.test.ts` - リファクタリング効果の検証

## 実行方法

```bash
# 全ての統合テストを実行
npx playwright test tests/integration/

# 特定のテストを実行  
npx playwright test tests/integration/refactoring-validation.test.ts
```

## テスト内容

- コンポーネント間の連携確認
- API統合テスト
- パフォーマンス統合検証
- エラーハンドリング統合テスト