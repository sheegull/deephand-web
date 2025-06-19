# Unit Tests

このディレクトリには、個別のコンポーネントや関数の単体テストが含まれています。

## 構造

- `performance-baseline.test.ts` - パフォーマンスベースライン測定
- `test_*.js` - レガシーテストファイル（Phase 1から移行）

## 実行方法

```bash
# 全ての単体テストを実行
npm run test:run tests/unit/

# 特定のテストを実行
npm run test:run tests/unit/performance-baseline.test.ts
```

## Phase 3での整理予定

- レガシーテストファイルの統合・最適化
- TypeScript化
- テストカバレッジ改善