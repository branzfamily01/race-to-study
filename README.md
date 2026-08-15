# Race to Study

勉強時間をレーシングゲームの進行に変換する、モバイル向け学習タイマーPWAです。

## GitHub Pages で公開する

1. GitHubで `race-to-study` というリポジトリを作成します。
2. このZIPを解凍します。
3. 解凍後に見える **index.html / app.js / styles.css / manifest.webmanifest / sw.js / assets フォルダ / README.md** を、リポジトリ直下へアップロードします。
4. GitHubの `Settings → Pages` で、`Deploy from a branch`、`main / root` を選びます。

ZIPファイル自体をGitHubへ置く必要はありません。

## 主な機能

- リアル調スーパーカーを使ったガレージ画面
- 11車種選択（色・雰囲気を画像フィルターで変更）
- エンジン始動演出
- 教材登録・個別削除（保護者コード 1234）
- 5〜60分の集中タイマー
- 学習ポイント・連続学習・3日ごとボーナス
- 20種類のパーツ解放
- 全パーツ解放後のレース
- Web Audio効果音
- 端末内自動保存（localStorage）
- 引き継ぎコードによるデータ移行
- PWA / ホーム画面追加 / オフラインキャッシュ

## データ保存

データはブラウザの localStorage に保存されます。ブラウザデータを削除すると消えるため、必要に応じて「引き継ぎ」からコードを保存してください。
