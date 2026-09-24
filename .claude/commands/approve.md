---
description: 下書きの問題を承認して本番の問題ファイルに反映し、GitHubに公開する
argument-hint: <承認するid（カンマ区切り）または all-pass>
---

承認対象: $ARGUMENTS

1. `data/drafts/` の下書きファイルを読む。
2. 指定された id（`all-pass` の場合は review.result が pass または fixed のもの全て）の `status` を `"approved"` に変える。reject のものは承認しない。
3. `node scripts/merge-drafts.mjs <下書き> data/<試験>.json` を実行する。
4. `node scripts/validate.mjs data/<試験>.json` を実行し、エラーがないことを確認する。エラーがあれば修正してから進む。
5. 追加した問題数と、解説を更新した問題数（`"update": true` の下書き）を報告し、`git add data research && git commit -m "問題追加: <試験> <問題数>問"` を実行する。
6. `git push` してよいかユーザーに確認し、OKなら実行する。push するとスマホのアプリにも数分で反映されることを伝える。
