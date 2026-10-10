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
import { spawn } from "node:child_process";
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
const root = resolve(new URL("../..", import.meta.url).pathname), T = join(root, "tools");
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const only = (arg("--only") || "").split(",").filter(Boolean), group = arg("--group") || "all";

const B = "tools/v2217-dam-builder/";
const builder = [
  ["builder-svg", B + "dam-builder-regression.mjs", 900],
  ...["loading", "render", "causality", "picking", "parity", "fallbacks", "motion", "lifecycle", "mobile", "chain"].map(s => ["builder-3d:" + s, B + "dam-builder-3d-regression.mjs " + s, 600]),
  ...["chain", "routing", "cycle", "rewards", "fallback", "mobile"].map(s => ["e2e:" + s, B + "dam-builder-e2e.mjs " + s, 1500]),
  ["golden-day5", B + "golden-day5.mjs", 300]
];
const arcade = [];
for (const d of readdirSync(T)) { const dir = join(T, d); if (!statSync(dir).isDirectory() || d === "v2217-dam-builder" || d === "v2220-certification") continue;
  for (const f of readdirSync(dir)) if (/regression.*\.mjs$|economy-chaos\.mjs$|regression-gate\.mjs$/.test(f) && !/dam-builder/.test(f)) arcade.push(["arcade:" + d + "/" + f.replace(/\.mjs$/, ""), "tools/" + d + "/" + f, 600]); }
const all = (group === "builder" ? builder : group === "arcade" ? arcade : builder.concat(arcade)).filter(x => !only.length || only.some(o => x[0].includes(o)));

const INFRA = /Target page, context or browser has been closed|Timeout \d+ms exceeded|browser has been closed|ECONNRESET|crashed: page\.waitForFunction|Protocol error|net::ERR/i;
function runOne(name, cmd, limit) {
  return new Promise(ok => {
    const t0 = Date.now(), p = spawn("node", cmd.split(" "), { cwd: root, env: process.env }); let out = "", killed = false;
    const to = setTimeout(() => { killed = true; p.kill("SIGKILL"); }, limit * 1000);
    p.stdout.on("data", d => out += d); p.stderr.on("data", d => out += d);
    p.on("close", code => { clearTimeout(to);
      const lines = out.split("\n").filter(l => !/^\[pid=/.test(l)), text = lines.join("\n");
      const m = [...text.matchAll(/(\d+) passed, (\d+) failed/g)].pop(), passed = m ? +m[1] : 0, failedN = m ? +m[2] : null;
      const bad = lines.filter(l => /^\s*✗/.test(l)), infraBad = bad.filter(l => INFRA.test(l) || /suite .* crashed/.test(l)), realBad = bad.filter(l => !infraBad.includes(l));
      let status = "PASS";
      if (killed) status = "INFRA";
      else if (realBad.length) status = "FAIL";
      else if (infraBad.length || (code !== 0 && failedN !== 0)) status = (m || infraBad.length) ? "INFRA" : "INFRA";
      else if (code !== 0) status = "FAIL";
      ok({ name, status, passed, failed: failedN, secs: Math.round((Date.now() - t0) / 1000), bad: bad.slice(0, 6), killed });
    });
  });
}
const results = [];
for (const [name, cmd, limit] of all) {
  let r = await runOne(name, cmd, limit);
  if (r.status === "INFRA") { const first = r; r = await runOne(name, cmd, limit); r.retry = true; r.first = { status: first.status, passed: first.passed, failed: first.failed, bad: first.bad, killed: first.killed }; }
  results.push(r);
  console.log((r.status === "PASS" ? "PASS " : r.status === "FAIL" ? "FAIL " : "INFRA") + "  " + name.padEnd(46) + String(r.passed).padStart(4) + " passed" + (r.failed ? ", " + r.failed + " failed" : "") + "  " + r.secs + "s" + (r.retry ? "  (re-run after infra timeout; first attempt: " + r.first.status + ")" : ""));
  r.bad.forEach(l => console.log("        " + l.trim()));
}
const tot = results.reduce((a, r) => a + r.passed, 0), f = results.filter(r => r.status === "FAIL"), i = results.filter(r => r.status === "INFRA"), retried = results.filter(r => r.retry);
console.log("\n" + results.length + " suites · " + tot + " assertions passed · genuine FAIL: " + f.length + " · unresolved INFRA: " + i.length + " · passed only after an infra re-run: " + retried.filter(r => r.status === "PASS").length);
writeFileSync(join(root, "tools/v2220-certification/last-run.json"), JSON.stringify({ when: new Date().toISOString(), results }, null, 1));
process.exit(f.length || i.length ? 1 : 0);
