/* V2.2.20 follow-up — Arcade failure triage. For each suite: run it REPS times on the current checkout and REPS times on the pre-Builder baseline checkout (separate worktree),
 * extract the NAMES of the failing checks from the raw output (✗ lines, "FAIL x" lines, JSON {name,pass:false}/{status:"FAIL"}, AssertionError messages) and compare the sets.
 *   node tools/v2220-certification/triage.mjs <baselineDir> [reps=2] [suite-substring,...]
 * Raw outputs are kept in tools/v2220-certification/results/triage/. */
import { spawn } from "node:child_process";
import { readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
const root = resolve(new URL("../..", import.meta.url).pathname), base = resolve(process.argv[2]), reps = +(process.argv[3] || 2), only = (process.argv[4] || "").split(",").filter(Boolean);
const out = join(root, "tools/v2220-certification/results", process.argv[5] || "triage"); mkdirSync(out, { recursive: true });
const suites = [];
for (const d of readdirSync(join(root, "tools"))) { const dir = join(root, "tools", d); if (!statSync(dir).isDirectory() || /dam-builder|v2220|v2217/.test(d)) continue;
  for (const f of readdirSync(dir)) if (/regression.*\.mjs$|economy-chaos\.mjs$|regression-gate\.mjs$/.test(f)) suites.push("tools/" + d + "/" + f); }
const run = (cwd, f) => new Promise(ok => { const p = spawn("node", [f], { cwd }); let o = ""; const t = setTimeout(() => { p.kill("SIGKILL"); o += "\n[TRIAGE: killed after 900 s]"; }, 900000); p.stdout.on("data", d => o += d); p.stderr.on("data", d => o += d); p.on("close", code => { clearTimeout(t); ok({ code, text: o.split("\n").filter(l => !/^\[pid=/.test(l)).join("\n") }); }); });
function failing(text) {
  const s = new Set(); const L = text.split("\n");
  L.forEach(l => { let m; if ((m = l.match(/^\s*✗\s*(.*)$/))) s.add(m[1].replace(/\s+/g, " ").slice(0, 110)); else if ((m = l.match(/^\s*FAIL[:\s]+(.*)$/))) s.add(m[1].replace(/\s+/g, " ").slice(0, 110)); else if ((m = l.match(/AssertionError[^:]*:\s*(.*)$/))) s.add("AssertionError: " + m[1].slice(0, 100)); });
  for (const m of text.matchAll(/"name":\s*"([^"]+)",\s*"pass":\s*false/g)) s.add(m[1]);
  for (const m of text.matchAll(/"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"status":\s*"FAIL"/g)) s.add(m[1] + " " + m[2]);
  return s;
}
const passes = t => (t.match(/^\s*(✓|PASS\b)/gm) || []).length + ((t.match(/"pass":\s*true/g) || []).length) + ((t.match(/"status":\s*"PASS"/g) || []).length);
const rows = [];
for (const f of suites) { if (only.length && !only.some(o => f.includes(o))) continue;
  const r = { suite: f, cur: [], bas: [] };
  for (let i = 0; i < reps; i++) for (const [tag, cwd] of [["cur", root], ["bas", base]]) {
    const x = await run(cwd, f); const fs = [...failing(x.text)]; r[tag].push({ code: x.code, passes: passes(x.text), fails: fs });
    writeFileSync(join(out, f.replace(/[\/]/g, "__") + "." + tag + (i + 1) + ".txt"), x.text);
  }
  const u = a => [...new Set(a.flatMap(x => x.fails))];
  r.onlyCurrent = u(r.cur).filter(x => !u(r.bas).includes(x)); r.onlyBaseline = u(r.bas).filter(x => !u(r.cur).includes(x));
  r.stable = r.cur.every(x => JSON.stringify(x.fails) === JSON.stringify(r.cur[0].fails)) && r.bas.every(x => JSON.stringify(x.fails) === JSON.stringify(r.bas[0].fails));
  rows.push(r);
  console.log(f.padEnd(78) + " cur[" + r.cur.map(x => x.code + ":" + x.passes + "p/" + x.fails.length + "f").join(" ") + "] base[" + r.bas.map(x => x.code + ":" + x.passes + "p/" + x.fails.length + "f").join(" ") + "]" + (r.onlyCurrent.length ? "  ONLY-CURRENT: " + JSON.stringify(r.onlyCurrent).slice(0, 300) : "") + (r.stable ? "" : "  (UNSTABLE between repeats)"));
}
writeFileSync(join(out, "summary.json"), JSON.stringify(rows, null, 1));
