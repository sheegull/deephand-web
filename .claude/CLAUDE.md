### 通知テンプレート（タスク別サウンド）

#### 1. ファイル編集完了
```bash
osascript -e 'display notification "
📝 ファイル編集完了: [ファイル名]" with title "Claude Code" sound name "Tink"'
```

#### 2. ビルド・コンパイル完了
```bash
osascript -e 'display notification "🔨 ビルド完了" with title "Claude Code" sound name "Hero"'
```

#### 3. テスト実行完了
```bash
osascript -e 'display notification "✅ テスト実行完了 ([結果])" with title "Claude Code" sound name "Glass"'
```

#### 4. 検索・分析完了
```bash
osascript -e 'display notification "🔍 検索・分析完了" with title "Claude Code" sound name "Ping"'
```

#### 5. インストール・設定完了
```bash
osascript -e 'display notification "📦 インストール・設定完了" with title "Claude Code" sound name "Funk"'
```

## 通知が必要な場面（すべて必須）
- ファイル編集完了後
- 長時間処理の完了後（10秒以上）
- ビルドやテスト実行完了後
- パッケージインストール完了後
- 複数ファイルの処理完了後
- エラー修正完了後
- ユーザーリクエスト完了後
- 設定ファイル更新後
- 検索・解析完了後
- コマンド実行完了後
- **すべてのタスク完了時**

**重要**: 通知内容は必ず具体的で分かりやすく記述すること
