# 不要ファイル削除対象リスト

作成日: 2025年1月17日

## 削除推奨ファイル一覧

### 1. ルートディレクトリのデバッグ・テスト用ファイル

以下のファイルは、環境設定やフォームのデバッグ・修正作業で使用された一時的なファイルと考えられます：

- [ ] `test-contact-form.js`
- [ ] `test-dotenv-fix.cjs`
- [ ] `test-email-config.js`
- [ ] `test-env-fix.cjs`
- [ ] `test-final-fix.cjs`
- [ ] `test-fixed-form.js`
- [ ] `test-form-validation.js`
- [ ] `test-syntax-fix.cjs`
- [ ] `debug-env.cjs`

**削除理由**: 
- プロジェクトの正式なテストは`/tests/`ディレクトリと各コンポーネントの`__tests__/`ディレクトリに配置されている
- ファイル名から判断して、特定の問題解決のための一時的なデバッグファイル
- 本番環境では不要

### 2. バックアップファイル

- [ ] `/src/components/islands/DataRequestForm.tsx.backup`

**削除理由**:
- バックアップファイルはGitで管理すべきではない
- 必要な場合はGitの履歴から復元可能

### 3. 重複フォントファイル

`/public/fonts/`直下の以下のファイル：

- [ ] `AllianceNo1-Black.ttf`
- [ ] `AllianceNo1-Bold.ttf`
- [ ] `AllianceNo1-ExtraBold.ttf`
- [ ] `AllianceNo1-Light.ttf`
- [ ] `AllianceNo1-Medium.ttf`
- [ ] `AllianceNo1-Regular.ttf`
- [ ] `AllianceNo1-SemiBold.ttf`
- [ ] `AllianceNo2-Black.ttf`
- [ ] `AllianceNo2-Bold.ttf`
- [ ] `AllianceNo2-ExtraBold.ttf`
- [ ] `AllianceNo2-Light.ttf`
- [ ] `AllianceNo2-Medium.ttf`
- [ ] `AllianceNo2-Regular.ttf`
- [ ] `AllianceNo2-SemiBold.ttf`

**削除理由**:
- これらのフォントは`/public/fonts/AllianceFontFamily/`ディレクトリ内に整理されて存在している
- 重複ファイルはプロジェクトサイズを不必要に増大させる

## 削除前の確認事項

1. **フォントの参照確認**
   - CSSやコンポーネントでフォントファイルへの参照パスを確認
   - `/public/fonts/AllianceFontFamily/`への参照に統一されているか確認

2. **テストファイルの内容確認**
   - 削除予定のテストファイルに重要な設定やコードが含まれていないか確認
   - 必要な内容があれば、適切な場所に移動

3. **Gitでの追跡状況**
   - 削除するファイルがGitで追跡されているか確認
   - 追跡されている場合は`git rm`で削除

## 削除手順

```bash
# 1. デバッグ・テストファイルの削除
rm test-*.js test-*.cjs debug-env.cjs

# 2. バックアップファイルの削除
rm src/components/islands/DataRequestForm.tsx.backup

# 3. 重複フォントファイルの削除
rm public/fonts/Alliance*.ttf

# 4. Gitから削除（追跡されている場合）
git rm <ファイル名>
```

## 削除後の確認

- [ ] プロジェクトが正常にビルドできることを確認
- [ ] 開発サーバーが正常に起動することを確認
- [ ] フォントが正しく表示されることを確認
- [ ] テストが正常に実行できることを確認