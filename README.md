# AI検定トレーナー

スマホで生成AIパスポート・G検定の勉強ができるWebアプリと、Claude Codeで最新の問題を作り足すエージェントのセットです。

## はじめの準備（1回だけ）

1. このフォルダを、iCloudの同期対象外の場所（例: `~/dev/ai-kentei-trainer`）に置く
2. GitHubで新しいリポジトリ `ai-kentei-trainer` を作る（Public）
3. ターミナルでこのフォルダに移動して:
   ```
   git init
   git add .
   git commit -m "最初の版"
   git branch -M main
   git remote add origin https://github.com/<アカウント名>/ai-kentei-trainer.git
   git push -u origin main
   ```
4. GitHubのリポジトリ画面 → Settings → Pages → Branch を `main` / `(root)` にして Save
5. 数分後に `https://<アカウント名>.github.io/ai-kentei-trainer/` が開けるようになる。スマホで開いて「ホーム画面に追加」

## 問題を増やす（ふだんの使い方）

このフォルダで `claude` を起動して:

| やりたいこと | コマンド例 |
|---|---|
| 新しい問題を作る | `/new-questions genai 第3章 RAGとAIエージェント 10` |
| 章を指定せずおまかせ | `/new-questions genai` |
| 下書きを承認して公開 | `/approve all-pass` または `/approve g3-rag-202609-01,g3-rag-202609-03` |
| シラバスや法律の変更を確認 | `/check-syllabus genai` |
| 既存問題に選択肢ごとの解説を追加 | `/enrich-explanations genai 2 10` |

新しく追加した問題は、アプリの「新着問題」モードに30日間表示されます。

## 仕組み

```
/new-questions
  ├ exam-researcher  … 公式シラバス・官公庁・開発企業の一次情報を調査 → research/
  ├ question-writer  … 事実メモから4択問題の下書きを作成 → data/drafts/
  └ fact-checker     … 出典に当たり直して1問ずつ検証（pass / fixed / reject）
あなたが内容を確認
/approve  → data/genai.json に統合 → チェック → git push → アプリに反映
```

## 注意
- 学習記録はスマホのブラウザに保存されます。以前の版（claude.aiのリンク）とは記録が別になります。
- `index.html` をパソコンで直接ダブルクリックすると問題が読み込めません。確認するときは `npx serve` などでローカルサーバーを起動してください。
