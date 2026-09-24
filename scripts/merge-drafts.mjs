// 承認済みの下書きを本番ファイルに追加:
// node scripts/merge-drafts.mjs data/drafts/genai-2026-09-23.json data/genai.json
// 下書き内の各問題の status を "approved" にしたものだけが反映されます。
// "update": true の下書きは、同じ id の既存問題の解説（e, oe, tip, src）だけを更新します。
import fs from "node:fs";

const [draftPath, mainPath] = process.argv.slice(2);
if (!draftPath || !mainPath) { console.error("使い方: node scripts/merge-drafts.mjs <下書き.json> <本番.json>"); process.exit(1); }

const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
const main = JSON.parse(fs.readFileSync(mainPath, "utf8"));
const list = Array.isArray(draft) ? draft : draft.questions;
const ok = list.filter(q => q.status === "approved");
const rest = list.filter(q => q.status !== "approved");
const have = new Set(main.questions.map(q => q.id));

let added = 0, updated = 0;
for (const q of ok) {
  if (q.update) {
    const cur = main.questions.find(x => x.id === q.id);
    if (!cur) { console.warn(`スキップ（更新対象なし）: ${q.id}`); rest.push(q); continue; }
    for (const k of ["e", "oe", "tip"]) if (q[k] !== undefined) cur[k] = q[k];
    cur.src = [...new Set([...(cur.src || []), ...(q.src || [])])];
    updated++; continue;
  }
  if (have.has(q.id)) { console.warn(`スキップ（id重複）: ${q.id}`); rest.push(q); continue; }
  const { status, review, update, ...clean } = q;
  main.questions.push(clean); added++;
}
main.updated = new Date().toLocaleDateString("sv-SE");
fs.writeFileSync(mainPath, JSON.stringify(main, null, 1));
if (rest.length) fs.writeFileSync(draftPath, JSON.stringify(rest, null, 1));
else fs.unlinkSync(draftPath);
console.log(`${added}問を追加、${updated}問の解説を更新しました（${mainPath}、残りの下書き ${rest.length}問）`);
