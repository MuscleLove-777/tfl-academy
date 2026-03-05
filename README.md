# TFL作成アカデミー

臨床試験における Tables, Figures, Listings（TFL）の作成方法を体系的に学べるウェブサイトです。

## 概要

TFL作成アカデミーは、臨床試験の成果物であるTFLの書式ルール、作成手順、QCプロセスを網羅的に解説する学習サイトです。

## サイト構成

- **トップページ** (`index.html`) - サイト概要、TFL3カテゴリの紹介、書式ルールクイックリファレンス
- **テーブル一覧** (`tables/`) - 安全性、有効性、人口統計テーブルなど10種類のテーブル解説
- **図の一覧** (`figures/`) - Kaplan-Meier曲線、Forest Plot、箱ひげ図など7種類の図解説
- **一覧表** (`listings/`) - 被験者一覧、有害事象一覧など6種類の一覧表解説
- **作成ガイド** (`guide/`) - SAP確認からQC・最終出力まで5ステップの作成プロセス
- **シェルビルダー** (`tools/shell-builder.html`) - モックTFL（TFLシェル）を簡単作成するツール
- **理解度クイズ** (`tools/quiz.html`) - 10問のクイズで知識チェック、5段階診断

## 技術スタック

- HTML5 / CSS3 / JavaScript（フレームワーク不使用）
- レスポンシブデザイン対応
- Google Fonts（Noto Sans JP）

## ローカルでの実行

`index.html` をブラウザで開くか、任意のHTTPサーバーでホスティングしてください。

```bash
# 例: Python の簡易サーバー
python -m http.server 8000
```

## ディレクトリ構造

```
tfl-academy/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── main.js
│   ├── tables.js
│   ├── figures.js
│   ├── listings.js
│   ├── guide.js
│   ├── shell-builder.js
│   └── quiz.js
├── tables/
│   └── index.html
├── figures/
│   └── index.html
├── listings/
│   └── index.html
├── guide/
│   └── index.html
└── tools/
    ├── shell-builder.html
    └── quiz.html
```

## 免責事項

本サイトは学習目的の参考資料です。実際のTFL作成にあたっては、各試験のSAP（統計解析計画書）およびスポンサーの規定に従ってください。
