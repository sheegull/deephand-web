# Terms of Service & Privacy Policy ページ実装レポート

**日時**: 2025年6月17日  
**目的**: データアノテーション事業に適した利用規約・プライバシーポリシーページの作成と言語対応

## 実装概要

### 作成されたページ・コンテンツ

#### 1. 利用規約（Terms of Service）
**日本語版** (`/terms`)
- 第1条～第11条まで包括的な利用規約
- データアノテーション事業に特化した内容
- 知的財産権、データ取扱い、秘密保持等の重要事項

**英語版** (`/en/terms`)
- 日本語版の完全英訳
- 国際的な事業展開に対応
- 法的整合性を維持

#### 2. プライバシーポリシー（Privacy Policy）
**日本語版** (`/privacy`)
- 8セクションに分けた詳細な個人情報保護方針
- Cookie使用、第三者提供、開示・訂正等を明記
- 個人情報保護法に準拠

**英語版** (`/en/privacy`)
- 日本語版の完全英訳
- グローバルスタンダードに対応

## 技術実装詳細

### 1. ファイル構成

#### 新規作成ファイル
```
src/
├── components/
│   ├── TermsOfServicePage.tsx    # 利用規約ページコンポーネント
│   └── PrivacyPolicyPage.tsx     # プライバシーポリシーページコンポーネント
└── pages/
    ├── terms.astro              # 日本語利用規約ページ
    ├── privacy.astro            # 日本語プライバシーポリシーページ
    └── en/
        ├── terms.astro          # 英語利用規約ページ
        └── privacy.astro        # 英語プライバシーポリシーページ
```

#### 更新ファイル
```
src/i18n/locales/
├── ja.json                      # 日本語翻訳追加
├── en.json                      # 英語翻訳追加
src/components/
├── HeroSection.tsx              # フッターリンク修正
└── RequestDataPage.tsx          # フッターリンク修正
```

### 2. コンポーネント設計

#### 共通機能
- **言語状態対応**: `useLanguage`フック使用
- **レスポンシブデザイン**: モバイル・デスクトップ両対応
- **モーションアニメーション**: Framer Motion統合
- **統一UI**: 既存デザインシステム準拠

#### TermsOfServicePage特徴
```tsx
// 動的記事レンダリング
const articles = [
  'article1', 'article2', 'article3', 'article4', 'article5', 'article6',
  'article7', 'article8', 'article9', 'article10', 'article11'
];

// アニメーション付きレンダリング
{articles.map((articleKey, index) => (
  <motion.div
    key={articleKey}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="border-l-4 border-[#234ad9] pl-6"
  >
    <h2>{t(`terms.${articleKey}.title`)}</h2>
    <p>{t(`terms.${articleKey}.content`)}</p>
  </motion.div>
))}
```

#### PrivacyPolicyPage特徴
```tsx
// 改行対応レンダリング
<div className="font-alliance font-normal text-gray-700 text-sm md:text-base leading-relaxed">
  {t(`privacy.${sectionKey}.content`).split('\n').map((line, lineIndex) => (
    <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
      {line}
    </p>
  ))}
</div>
```

### 3. 言語対応ナビゲーション実装

#### フッターリンク修正（HeroSection）
```tsx
// Before: 単純なonNavClick呼び出し
onClick={() => onNavClick?.(link.text.toLowerCase().replace(/\s+/g, '-'))}

// After: 言語状態を考慮したナビゲーション
onClick={() => {
  const linkType = link.text.toLowerCase().replace(/\s+/g, '-');
  if (linkType.includes('terms') || linkType.includes('利用規約')) {
    const termsUrl = currentLanguage === 'en' ? '/en/terms' : '/terms';
    handleNavigation(termsUrl);
  } else if (linkType.includes('privacy') || linkType.includes('プライバシー')) {
    const privacyUrl = currentLanguage === 'en' ? '/en/privacy' : '/privacy';
    handleNavigation(privacyUrl);
  }
}}
```

#### RequestDataPage直接ナビゲーション
```tsx
// Desktop & Mobile Footer統一処理
onClick={() => {
  const termsUrl = currentLanguage === 'en' ? '/en/terms' : '/terms';
  handleNavigation(termsUrl);
}}
```

### 4. サーバーサイドレンダリング対応

#### Astroページでの言語設定
```astro
---
import { setCurrentLanguage } from '@/lib/i18n';

// 日本語ページ
setCurrentLanguage('ja');

// 英語ページ  
setCurrentLanguage('en');
---
```

## 法的コンテンツ詳細

### 利用規約の主要条項

1. **第1条（適用）**: サービス利用条件の定義
2. **第2条（サービス内容）**: AI・ロボティクス特化アノテーション
3. **第3条（利用契約の成立）**: 申込・承諾プロセス
4. **第4条（データの取扱い）**: セキュリティ・機密性保持
5. **第5条（知的財産権）**: データ権利・手法権利の明確化
6. **第6条（料金・支払い）**: 30日支払条件・遅延損害金
7. **第7条（品質保証）**: 業界標準品質・100%精度の免責
8. **第8条（責任の制限）**: 直接損害限定・上限設定
9. **第9条（秘密保持）**: 厳格な情報管理
10. **第10条（契約の解除）**: 違反時解除権
11. **第11条（準拠法・管轄裁判所）**: 日本法・東京地裁管轄

### プライバシーポリシーの主要項目

1. **個人情報の収集**: 名前・会社名・メール・アクセスログ等
2. **個人情報の利用目的**: サービス提供・改善・マーケティング
3. **個人情報の第三者提供**: 法令に基づく場合の例外
4. **個人情報の管理**: 漏洩防止・安全管理措置
5. **クッキーの使用**: 利便性向上・無効化可能
6. **個人情報の開示・訂正等**: 本人請求への対応
7. **お問い合わせ窓口**: 専用メールアドレス設置
8. **プライバシーポリシーの変更**: Web掲載による効力発生

## ユーザー体験向上

### 1. 統一されたデザイン
- 既存ページとの一貫性
- DeepHandブランドカラー（#234ad9）の活用
- Alliance No.2フォントファミリー使用

### 2. 言語状態維持
- ENモードからterms/privacy → 英語ページ表示
- JAモードからterms/privacy → 日本語ページ表示
- シームレスな多言語ナビゲーション

### 3. アクセシビリティ
- セマンティックHTML構造
- 適切な見出し階層
- ホバー・フォーカス状態対応

### 4. モバイル最適化
- レスポンシブレイアウト
- タッチフレンドリーなリンクサイズ
- 読みやすい文字サイズ

## 今後の改善提案

### 1. 法的確認
- 弁護士による内容レビュー
- 個人情報保護法改正対応
- 国際法制度への対応検討

### 2. 機能拡張
- PDF版ダウンロード機能
- 更新履歴の表示
- 同意フローの実装

### 3. SEO最適化
- 構造化データマークアップ
- meta description最適化
- 内部リンク最適化

## まとめ

データアノテーション事業に特化した包括的な利用規約・プライバシーポリシーページを実装しました。

**主要成果**:
- 日本語・英語両対応の法的文書ページ
- 言語状態を維持した統一ナビゲーション
- モバイル・デスクトップ対応のレスポンシブデザイン
- 既存デザインシステムとの統合

これにより、企業の信頼性向上と法的コンプライアンス確保を実現し、国内外のクライアントに対して安心してサービスを提供できる基盤が整いました。