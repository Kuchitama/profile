# Profile Page

YAML 設定ファイルから静的なプロフィールページを生成し、GitHub Pages にデプロイするツールです。

## Features

- Prairie card スタイルのプロフィールカード（アバター、名前、bio）
- SNS リンクボタン（既知プラットフォームはアイコン付き）
- ブラウザ設定に応じたダーク/ライトモード自動切り替え
- YAML ファイルの編集だけでコンテンツを更新
- GitHub Actions による自動ビルド & デプロイ

## Quick Start

```bash
# 依存関係のインストール
npm install

# 設定ファイルを作成
cp profile.yml.example profile.yml
# profile.yml を編集

# アバター画像を配置
cp /path/to/your/avatar.png images/avatar.png

# ビルド
npm run build

# ブラウザで確認
open dist/index.html
```

## Configuration

`profile.yml` を編集してプロフィール情報を設定します。

```yaml
name: "Your Name"
bio: |
  Your bio text
  Supports multiple lines
avatar: "images/avatar.png"  # ローカルファイルまたは外部 URL
links:
  - platform: x
    url: "https://x.com/yourhandle"
  - platform: github
    url: "https://github.com/yourhandle"
  - platform: my-blog
    url: "https://blog.example.com"
    label: "Blog"
```

### アイコン対応プラットフォーム

以下のプラットフォームは自動でアイコンが表示されます。

`x` / `github` / `linkedin` / `instagram` / `facebook` / `youtube` / `speakerdeck`

それ以外の `platform` 値はテキストのみで表示されます。`label` を指定すると表示名をカスタマイズできます。

## Deployment

`main` ブランチにプッシュすると、GitHub Actions が自動でビルドし GitHub Pages にデプロイします。

リポジトリの Settings > Pages > Source を **GitHub Actions** に設定してください。

## Tech Stack

- TypeScript + [tsx](https://github.com/privatenumber/tsx)
- [Handlebars](https://handlebarsjs.com/) (テンプレートエンジン)
- [js-yaml](https://github.com/nodeca/js-yaml) (YAML パーサー)
- [Simple Icons](https://simpleicons.org/) (SVG アイコン、インライン埋め込み)
