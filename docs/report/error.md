要点まとめ — コード上は response.ok 判定に書き換わっているのに UI が失敗トーストを出すのは、
フォーム送信時に fetch がそもそも実行されていない／実行前に JavaScript 例外やネイティブ submit が走っている──という形跡が濃厚です。
以下では「fetch が飛ばない理由」を３カテゴリに整理し、再現確認 → 原因特定 → 恒久対策の流れで解説します。全手順を実施すれば、“直接 fetch で成功／フォーム経由で失敗” のギャップを埋められます。

1. onSubmit が通らないパターンを総洗い出し
1-A. ネイティブ submit へのフォールバック
兆候	確認方法	代表的な落とし穴
ページリロード or ネットワークタブに document 行だけ出る	DevTools 「Network › Doc」	e.preventDefault() を書いても別の例外で早期 return → 実行されず
stackoverflow.com
fetch 行が無い	DevTools 「Fetch/XHR」	- <form action="/api/send"> が残っている
- <button> の type 属性が未指定で submit になっている

対策　

tsx
コピーする
編集する
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();                 // 必ず最上行
  try {
    console.log('submit-start');      // デバッグ用
    await sendMail();                 // fetch 呼び出し
  } catch (err) {
    console.error(err);
  }
};

<form onSubmit={handleSubmit} action="">  {/* ← action を空文字で上書き */}
  <button type="button" onClick={handleSubmit}>Send</button>
</form>
ネイティブ submit 経路を完全に断ち、fetch 失敗時は try-catch に落ちる構成にする。
stackoverflow.com
reddit.com

1-B. onSubmit が呼ばれているのに 途中で例外 → fetch まで到達しない
最頻出は バリデーションライブラリの throw と 非同期関数の未 await。

兆候	確認方法	代表的ライブラリ
Console が真っ赤 / Network に何も出ない	DevTools 「Console」	react-hook-form の handleSubmit(onValid, onInvalid) で onInvalid 側が未実装
github.com

対策

送信関数の先頭で必ず log

ts
コピーする
編集する
console.log('before-validation');
window.addEventListener('error' …) と unhandledrejection を仕込んで隠れ例外を拾う。
gist.github.com

バリデーション失敗時は UI に適切なフィードバックを返し、fetch へは進ませない。

1-C. コンソールがそもそも出力されていない（ログ抑制ビルド）
CRA / Next.js / Expo などでは NODE_ENV==='production' で

js
コピーする
編集する
console.log = () => {};
が噛んでいる例が多い
stackoverflow.com
github.com
。

対策

ts
コピーする
編集する
if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
  // 任意環境変数で強制的に有効化
  console.log = (...args) => window.originalLog?.(...args) || (window.originalLog = console.info, console.info(...args));
}
2. 直接 fetch との比較で差分を洗う手順
イベントが発火しているか確認

ts
コピーする
編集する
form.addEventListener('submit', () => console.log('native submit'));
→ 出なければフォーム階層の問題（<form> が無い／別レイヤ）。

fetch をラップしてネットワークに常に残す

ts
コピーする
編集する
globalThis.fetch = ((orig) => (...args) => {
  console.log('fetch called', args);
  return orig(...args);
})(globalThis.fetch);
→ これで DevTools に現れなければ呼び出し自体無し。

React DevTools でコンポーネントツリー確認
ビルドモードで別 bundle を読んでいないか（Code-Splitting でフォームを Lazy load 失敗）。

3. 恒久的なガード実装
レイヤ	ガード方法	効果
グローバル	window.onerror / unhandledrejection	例外の可視化
React	ErrorBoundary + fallback UI	ユーザーに「送信できませんでした」ではなく「ページでエラーが発生しました」と正確に表示
Network	Sentry や LogRocket で fetch, console, DOMEvent を一括収集	“本番だけ再現” をリモート確認
sentry.io

4. ここまでで原因が掴めない場合のチェックリスト
StrictMode の二重実行で副作用コードが一度目の実行で例外 → 二度目はスキップ。

フォーム要素が display:none のまま → submit 抑制。

iframe / portal 内フォームで同一オリジン外 → fetch だけ成功、UI 側 postMessage 失敗。

ビルド時の dead-code elimination で console.* が全削除 → ログが出ないだけ。

5. 最小再現リポジトリ作成のすすめ
npx create-next-app@latest resend-debug --ts --no-eslint.

50 行以内 でフォーム → fetch → トーストだけを実装。

問題が再現するか確認し、しなければ元プロジェクトとの差分を git diff で追う。

こうして “差分だけ” を比べるのが最短ルートです。再現 repo があれば Stack Overflow でも回答を得やすいです
stackoverflow.com
。

6. まとめ
フォーム経由だけ fetch が走らない ⇒ ほぼ onSubmit 発火前にネイティブ submit or JS 例外。

DevTools で Network と Console の両面ログを取り、上記 1-A〜1-C を順に潰す。

ログ抑制・ビルド差異も疑う。console.log が見えない＝実行されていない、とは限らない。

最小再現を切り出せば、原因はほぼ数行レベルで特定できる。

この手順で確認すれば、「API成功なのに失敗トースト」が出る真犯人を確実に見つけられるはずです。
