# Test Fixtures

このディレクトリには、テストで使用する共通のデータ、設定、ヘルパー関数が含まれています。

## 使用方法

```typescript
// テストデータの読み込み例
import { testData } from '../fixtures/testData';

// ヘルパー関数の使用例
import { setupTestEnvironment } from '../fixtures/helpers';
```

## 今後追加予定

- `testData.ts` - テスト用データセット
- `helpers.ts` - テスト共通ヘルパー関数
- `mocks.ts` - モックデータとモック関数
- `setup.ts` - テスト環境セットアップ