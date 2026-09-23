// 問題ファイルのチェック: node scripts/validate.mjs data/genai.json [data/drafts/xxx.json ...]
import fs from "node:fs";

const files = process.argv.slice(2);
if (!files.length) { console.error("使い方: node scripts/validate.mjs <jsonファイル...>"); process.exit(1); }

const norm = s => s.replace(/[\s　、。「」（）()？?・]/g, "");
let errors = 0;
const seenText = new Map();

for (const f of files) {
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  const qs = Array.isArray(d) ? d : d.questions;
  const chs = new Set((d.chapters || []).map(c => c.n));
  const ids = new Set();
  qs.forEach((q, i) => {
    const at = `${f} #${i + 1} (${q.id ?? "idなし"})`;
    const err = m => { console.error(`✗ ${at}: ${m}`); errors++; };
    if (!q.id) err("id がありません");
    if (ids.has(q.id)) err("id が重複しています"); ids.add(q.id);
    if (!Number.isInteger(q.ch)) err("ch（章番号）が整数ではありません");
    if (chs.size && !chs.has(q.ch)) err(`ch=${q.ch} はこの試験の章にありません`);
    if (!q.q || q.q.length < 10) err("問題文が短すぎます");
    if (!Array.isArray(q.o) || q.o.length !== 4) err("選択肢は4つ必要です");
    else if (new Set(q.o).size !== 4) err("選択肢に重複があります");
    if (![0, 1, 2, 3].includes(q.a)) err("a（正解番号）は0〜3です");
    if (!q.e || q.e.length < 15) err("解説が短すぎます");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(q.added || "")) err("added は YYYY-MM-DD 形式にしてください");
    if (q.status === "draft" && (!Array.isArray(q.src) || !q.src.length)) err("新規問題には src（出典URL）が必要です");
    const key = norm(q.q || "");
    if (seenText.has(key)) err(`問題文が ${seenText.get(key)} と重複しています`);
    else seenText.set(key, at);
  });
  console.log(`${f}: ${qs.length}問をチェックしました`);
}
if (errors) { console.error(`\nエラー ${errors}件`); process.exit(1); }
console.log("✓ 問題なし");
