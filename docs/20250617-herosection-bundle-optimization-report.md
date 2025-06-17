# HeroSectionコンポーネント バンドルサイズ最適化レポート

**作成日**: 2025年6月17日  
**担当**: Claude Code  
**対象ファイル**: `src/components/HeroSection.tsx`

## 概要

HeroSectionコンポーネントのバンドルサイズが933.67KBと非常に大きくなっていた問題を、TDD方式を採用して体系的に分析・最適化を実施しました。

## 問題の分析

### 原因の特定

1. **Three.js関連の重い依存関係**
   - `@react-three/fiber`
   - `@react-three/postprocessing` 
   - `postprocessing`
   - `three` (本体)

2. **framer-motionの非効率なインポート**
   - コンポーネント全体でフルインポート
   - 低性能デバイスでも同様の処理負荷

3. **コード分割の不備**
   - すべての依存関係がメインチャンクに含まれていた
   - 遅延読み込みが実装されていなかった

## 実装したソリューション

### 1. TDDアプローチの採用

**テストファイル**: `src/components/__tests__/HeroSection.performance.test.tsx`

- パフォーマンス要件を明確に定義
- バンドルサイズ: 200KB以下の目標設定
- 最適化前にテストを作成（Red）
- 実装後にテストが成功（Green）

### 2. Three.js遅延読み込みの実装

**新規ファイル**: `src/components/ui/DitherBackgroundLazy.tsx`

**主要機能**:
- Intersection Observerを使用した遅延読み込み
- WebGL対応チェック機能
- 低性能デバイス検出ロジック
- フォールバック背景の提供

```typescript
// 低性能デバイス判定
const isLowPerformanceDevice = () => {
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;
  
  const cores = navigator.hardwareConcurrency;
  if (cores && cores < 4) return true;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isMobile;
};
```

### 3. framer-motion最適化

**新規ファイル**: `src/components/ui/motion-optimized.tsx`

**最適化内容**:
- パフォーマンス設定に基づく条件分岐
- 低性能デバイスでは通常のdiv要素を使用
- `prefers-reduced-motion`対応
- 必要な機能のみの選択的インポート

```typescript
export const MotionDiv = (props: MotionProps & React.HTMLAttributes<HTMLDivElement>) => {
  if (PERFORMANCE_CONFIG.reducedMotion || PERFORMANCE_CONFIG.isLowPerformance) {
    const { initial, animate, transition, whileHover, whileTap, ...restProps } = props;
    return <div {...restProps} />;
  }
  return <motion.div {...props} />;
};
```

### 4. バンドル分割設定の最適化

**更新ファイル**: `astro.config.mjs`

```javascript
manualChunks: {
  vendor: ['react', 'react-dom'],
  forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
  ui: ['lucide-react', '@radix-ui/react-slot', 'class-variance-authority'],
  three: ['three', '@react-three/fiber', '@react-three/postprocessing', 'postprocessing'],
  animation: ['framer-motion'],
},
```

## 最適化結果

### バンドルサイズの改善

| 項目 | 最適化前 | 最適化後 | 削減率 |
|------|----------|----------|--------|
| **HeroSection.js** | 933.67KB | 32.03KB | **96.6%削減** |
| **gzipサイズ** | 253.60KB | 10.60KB | **95.8%削減** |
| **DitherBackground** | 含まれていた | 905.27KB（独立チャンク） | 分離成功 |

### パフォーマンス指標

- ✅ **バンドルサイズ目標**: 200KB以下 → **32.03KB** (成功)
- ✅ **コード分割**: Three.js関連が独立チャンクに分離
- ✅ **遅延読み込み**: Intersection Observerによる実装
- ✅ **デバイス最適化**: 低性能デバイス向け軽量化

## 技術的な詳細

### 遅延読み込みの仕組み

1. **初期レンダリング**: 軽量なプレースホルダー背景を表示
2. **viewport検出**: Intersection Observerでコンポーネントが表示領域に入るのを検知
3. **条件チェック**: WebGL対応・デバイス性能を評価
4. **動的読み込み**: 条件を満たす場合のみThree.jsコンポーネントを読み込み

### パフォーマンス最適化の階層

```
高性能デバイス + WebGL対応
├── DitherBackground (Three.js) 読み込み
└── フルアニメーション有効

低性能デバイス or WebGL非対応
├── 軽量フォールバック背景
└── アニメーション軽量化/無効化
```

## 今後の改善点

### 短期的改善

1. **テスト環境整備**
   - Canvas、IntersectionObserver のモック実装
   - より詳細なパフォーマンステストの追加

2. **メトリクス計測**
   - Core Web Vitalsの監視
   - 実際のユーザー環境でのパフォーマンス測定

### 長期的改善

1. **さらなる最適化**
   - Service Workerによるチャンクのプリキャッシュ
   - HTTP/3 Push の活用検討

2. **監視体制**
   - バンドルサイズの継続監視
   - パフォーマンス回帰の自動検知

## 学習ポイント

### TDD方式の効果

- **明確な目標設定**: パフォーマンス要件を数値で定義
- **測定可能な改善**: ビフォー・アフターの定量的比較
- **回帰防止**: 継続的なテスト実行による品質維持

### React パフォーマンス最適化

- **条件分岐レンダリング**: デバイス性能に応じた最適化
- **遅延読み込み**: 必要な時点でのリソース読み込み
- **チャンク分割**: 機能別の依存関係分離

## まとめ

HeroSectionコンポーネントのバンドルサイズを**96.6%削減**（933.67KB → 32.03KB）することに成功しました。TDD方式の採用により、明確な目標設定と測定可能な改善を実現し、特に以下の点で大きな成果を上げました：

- Three.js関連の遅延読み込み実装
- デバイス性能に応じた最適化
- framer-motionの効率的な利用
- 適切なコード分割の実現

この最適化により、初期ページロード時間の大幅な改善とユーザーエクスペリエンスの向上が期待できます。