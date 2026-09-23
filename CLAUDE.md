# AI検定トレーナー

生成AIパスポート・G検定の学習用Webアプリと、その問題を作るClaude Codeエージェントのプロジェクト。

## 構成
- `index.html` … スマホ向け学習アプリ本体（GitHub Pagesで公開）。`data/*.json` を読み込む
- `data/genai.json` … 生成AIパスポートの問題（本番）
- `data/g-kentei.json` … G検定の問題（本番）
- `data/drafts/` … 承認前の下書き。アプリには表示されない
- `research/` … リサーチの事実メモ（出典の記録として残す）
- `scripts/validate.mjs` … 問題ファイルのチェック
- `scripts/merge-drafts.mjs` … 承認済み下書きを本番に統合

## 基本の流れ
`/new-questions` → ユーザーが内容を確認 → `/approve` → git push でアプリに反映

## ルール
- 本番ファイル（`data/genai.json` 等）はユーザーの承認なしに書き換えない。
- すべての新規問題に出典URL（`src`）を付ける。出典は一次情報を優先する。
- 変更後は必ず `node scripts/validate.mjs` を通す。
- `git push` の前にユーザーに確認する。
- 解説・問題文は、AIの初学者がスマホで読むことを想定して平易な日本語で書く。

## 試験ごとの情報源
### 生成AIパスポート（genai）
- 主催: 一般社団法人生成AI活用普及協会（GUGA） https://guga.or.jp/
- シラバス: https://guga.or.jp/assets/syllabus.pdf （2026年2月試験より改訂版を適用）
- 章構成: 1 AI（人工知能） / 2 生成AI / 3 現在の生成AIの動向 / 4 情報リテラシー・基本理念とAI社会原則 / 5 テキスト生成AIのプロンプト制作と実例
- 本番: 60問・60分の多肢選択式

### G検定（g-kentei）
- 主催: 一般社団法人日本ディープラーニング協会（JDLA） https://www.jdla.org/
- 作問を始める前に、exam-researcher で最新シラバスの章構成を確認し、`data/g-kentei.json` の `chapters` を埋めること（ユーザーに確認してから）。
