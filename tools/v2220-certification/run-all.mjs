/* V2.2.20 — sequential certification runner.
 * Every suite runs in its OWN node process (and therefore its own Chromium), one after another. Software-GL contexts accumulate inside a single browser process and make
 * long multi-suite runs slower and slower until waits time out — that was the "cascade" seen when the 3D suites ran together. Process isolation removes that coupling
 * without touching a single assertion.
 *
 * Classification (never mixed):
 *   PASS         exit 0 and "N passed, 0 failed"
 *   FAIL         the suite ran and at least one assertion failed (a ✗ line that is not a crash/timeout)  → a genuine regression
 *   INFRA        the suite never reached its assertions: killed by the wall-clock limit, browser/context closed, or a page.waitForFunction timeout while booting
 *                → re-run ONCE in a fresh process; both outcomes are reported, and an INFRA that passes on re-run is listed as "passed on retry"
 *
 *   node tools/v2220-certification/run-all.mjs [--only name,name] [--group builder|arcade|all]
 */
import { spawn, execSync } from "node:child_process";
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
const sleep = ms => new Promise(r => setTimeout(r, ms));
const root = resolve(new URL("../..", import.meta.url).pathname), T = join(root, "tools");
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const only = (arg("--only") || "").split(",").filter(Boolean), group = arg("--group") || "all", baseline = arg("--baseline");   // --baseline <dir>: a checkout of the pre-Builder commit (d467a61); a failing Arcade suite is re-run there to tell a pre-existing failure from a regression

const B = "tools/v2217-dam-builder/";
const builder = [
  ["builder-svg", B + "dam-builder-regression.mjs", 900],
  ...["loading", "render", "causality", "picking", "parity", "fallbacks", "motion", "lifecycle", "mobile", "chain"].map(s => ["builder-3d:" + s, B + "dam-builder-3d-regression.mjs " + s, 600]),
  ...["chain", "routing", "cycle", "rewards", "fallback", "mobile"].map(s => ["e2e:" + s, B + "dam-builder-e2e.mjs " + s, 1500]),
  ["golden-day5", B + "golden-day5.mjs", 300]
];
const arcade = [];
for (const d of readdirSync(T)) { const dir = join(T, d); if (!statSync(dir).isDirectory() || d === "v2217-dam-builder" || d === "v2220-certification") continue;
  for (const f of readdirSync(dir)) if (/regression.*\.mjs$|economy-chaos\.mjs$|regression-gate\.mjs$|security-certification\.mjs$/.test(f) && !/dam-builder/.test(f)) arcade.push(["arcade:" + d + "/" + f.replace(/\.mjs$/, ""), "tools/" + d + "/" + f, 600]); }
const all = (group === "builder" ? builder : group === "arcade" ? arcade : builder.concat(arcade)).filter(x => !only.length || only.some(o => x[0].includes(o)));

const INFRA = /Target page, context or browser has been closed|Timeout \d+ms exceeded|browser has been closed|ECONNRESET|crashed: page\.waitForFunction|Protocol error|net::ERR/i;

/* the NAMES of the failing checks, whatever the suite's output format: "✗ x" / "FAIL x" lines, JSON {name, pass:false}, {id, name, status:"FAIL"}, node:assert "AssertionError: x" */
function failingNames(text) {
  const s = new Set();
  text.split("\n").forEach(l => { let m; if ((m = l.match(/^\s*✗\s*(.*)$/))) s.add(m[1].replace(/\s+/g, " ").slice(0, 110)); else if ((m = l.match(/^\s*FAIL[:\s]+(.*)$/))) s.add(m[1].replace(/\s+/g, " ").slice(0, 110)); else if ((m = l.match(/AssertionError[^:]*:\s*(.*)$/))) s.add("AssertionError: " + m[1].slice(0, 100)); else if (/GATE FAILED|CERTIFICATION (FAILED|INCOMPLETE)/.test(l)) s.add(l.trim().slice(0, 110)); });
  for (const m of text.matchAll(/"name":\s*"([^"]+)",\s*"pass":\s*false/g)) s.add(m[1]);
  for (const m of text.matchAll(/"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"status":\s*"FAIL"/g)) s.add(m[1] + " " + m[2]);
  return [...s];
}
function runOne(name, cmd, limit, cwd = root) {
  return new Promise(ok => {
    const t0 = Date.now(), p = spawn("node", cmd.split(" "), { cwd, env: process.env }); let out = "", killed = false;
    const to = setTimeout(() => { killed = true; p.kill("SIGKILL"); }, limit * 1000);
    p.stdout.on("data", d => out += d); p.stderr.on("data", d => out += d);
    p.on("close", code => { clearTimeout(to);
      const lines = out.split("\n").filter(l => !/^\[pid=/.test(l)), text = lines.join("\n");
      const m = [...text.matchAll(/(\d+) passed, (\d+) failed/g)].pop(), okLines = lines.filter(l => /^\s*(✓|PASS\b)/.test(l)).length, passed = m ? +m[1] : okLines, failedN = m ? +m[2] : null;
      const names = failingNames(text), bad = names.map(n => "✗ " + n), infraBad = bad.filter(l => INFRA.test(l) || /suite .* crashed/.test(l)), realBad = bad.filter(l => !infraBad.includes(l));
      let status = "PASS";
      if (killed) status = "INFRA";
      else if (realBad.length) status = "FAIL";
      else if (infraBad.length || INFRA.test(text)) status = "INFRA";
      else if (code !== 0) { status = "FAIL"; bad.push("✗ exited " + code + ": " + (lines.filter(l => /Error|assert/i.test(l)).slice(0, 2).join(" | ") || "no summary line")); }
      ok({ name, status, passed, failed: failedN, secs: Math.round((Date.now() - t0) / 1000), bad: bad.slice(0, 40), killed });
    });
  });
}
function cleanBetweenSuites() {
  try { execSync('rm -rf /tmp/.org.chromium.* /tmp/Crashpad /tmp/mesa_shader_cache* /tmp/.font-unix/chromium* 2>/dev/null', { stdio: 'ignore' }); } catch {}
}
const results = [];
for (const [name, cmd, limit] of all) {
  cleanBetweenSuites();
  await sleep(500);
  let r = await runOne(name, cmd, limit);
  if (r.status === "INFRA") { const first = r; r = await runOne(name, cmd, limit); r.retry = true; r.first = { status: first.status, passed: first.passed, failed: first.failed, bad: first.bad, killed: first.killed }; }
  if (r.status === "FAIL" && baseline && /^arcade:/.test(name)) { const b = await runOne(name, cmd, limit, baseline); r.baseline = { status: b.status, passed: b.passed, bad: b.bad };
    const norm = l => l.replace(/\d+(\.\d+)?\s*(ms|s)\b/g, "").replace(/\s+/g, " ").trim().slice(0, 160), A = new Set(r.bad.map(norm)), B = new Set(b.bad.map(norm));   // compare the SET of failing checks, not just "fails"
    r.sameFailures = b.status === "FAIL" && [...A].every(x => B.has(x)) && r.passed >= b.passed; r.newFailures = [...A].filter(x => !B.has(x));
    if (b.status === "FAIL" && r.sameFailures) r.status = "PRE-EXISTING"; }
  results.push(r);
  console.log((r.status === "PASS" ? "PASS " : r.status === "FAIL" ? "FAIL " : r.status === "PRE-EXISTING" ? "PRE  " : "INFRA") + "  " + name.padEnd(46) + String(r.passed).padStart(4) + " passed" + (r.failed ? ", " + r.failed + " failed" : "") + "  " + r.secs + "s" + (r.retry ? "  (re-run after infra timeout; first attempt: " + r.first.status + ")" : ""));
  r.bad.slice(0, 4).forEach(l => console.log("        " + l.trim().slice(0, 170)));
  if (r.newFailures && r.newFailures.length) console.log("        !! failures NOT present on the baseline: " + JSON.stringify(r.newFailures).slice(0, 400));
}
const pre = results.filter(r => r.status === "PRE-EXISTING");
const tot = results.reduce((a, r) => a + r.passed, 0), f = results.filter(r => r.status === "FAIL"), i = results.filter(r => r.status === "INFRA"), retried = results.filter(r => r.retry);
console.log("\n" + results.length + " suites · " + tot + " assertions passed · genuine FAIL: " + f.length + " · unresolved INFRA: " + i.length + " · failing identically on the pre-Builder baseline: " + pre.length + " · passed only after an infra re-run: " + retried.filter(r => r.status === "PASS").length);
writeFileSync(join(root, "tools/v2220-certification/last-run.json"), JSON.stringify({ when: new Date().toISOString(), results }, null, 1));
process.exit(f.length || i.length ? 1 : 0);
