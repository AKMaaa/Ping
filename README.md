# Ping!

自己紹介用のアイスブレイクアプリ。職業ごとのカードセットを選んで「カードを引く！」を押すと、全カードが3Dで回転して、お題が1枚選ばれます。カード1枚から、会話をはじめましょう。

## 機能

- 職業ごとのカードセットから、3Dリングが回って1枚を選ぶ（効果音つき・オン/オフ可）
- カード図鑑、Ping!について、利用規約
- みんなで写真を撮る：5秒後に集合写真を撮影し、引いたお題つきのフレームで端末に保存できる。カメラ映像と写真は端末内だけで処理され、送信されない（カメラの利用はHTTPSまたはlocalhostのみ）

## 技術構成

Svelte 5 / TypeScript / Vite / Tailwind CSS 4 / GSAP。バックエンドはありません。

## ローカルで動かす

Node.js 22 以上を想定しています。

```sh
npm install   # 初回のみ
npm run dev   # 開発サーバーを起動 → http://localhost:5173/
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（ホットリロード） |
| `npm run build` | 本番ビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run check` | 型チェック |

GitHub Pages 用の `base` を付けて確認したいときは次のとおりです。

```sh
GITHUB_PAGES=true npm run build && npm run preview   # → http://localhost:4173/Ping/
```

## GitHub Pages で公開する

1. GitHub に `Ping` という名前のリポジトリを作って push する（`vite.config.ts` の `repositoryName` と一致させる。名前を変えるときはここも直す）。
2. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする。
3. `main` に push すると `.github/workflows/deploy.yml` がビルドとデプロイを行う。
4. 公開URLは `https://<ユーザー名>.github.io/Ping/`。

## カードを編集する

- 質問・カテゴリ・テーマカラー: `src/lib/data/cards.ts`（エンジニア向けカード）
- 職業ごとのカードセット（デッキ）の一覧: `src/lib/data/decks.ts`。新しい職業はここに足す。イラストは `public/` 配下に置き、カードの `image` で指す
- ページ: `src/lib/pages/`（トップ、プレイ、カード図鑑、Ping!について、利用規約）。URLは `#/`、`#/play/<デッキID>`、`#/cards`、`#/about`、`#/terms`
- イラスト: `public/cards/1.png`〜`10.png`（カード番号と同じ番号。ファイル名は変えない）
- 色・フォント: `src/app.css`
- デザインの方針: `docs/design-rules.md`
