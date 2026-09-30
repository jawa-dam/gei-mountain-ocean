/* V2.1.93 — lightweight static regression checks for milestone voice wiring. */
import { readFile } from "node:fs/promises";
const html = await readFile(new URL("../../index.html", import.meta.url), "utf8");
const js = await readFile(new URL("../../gei-milestone-voice-v2193.js", import.meta.url), "utf8");
const checks = [
  ["voice script wired", html.includes("/gei-milestone-voice-v2193.js")],
  ["six milestone keys", ["mountain","dam","millpond","sluice","waterwheel","factory"].every(k => js.includes(k))],
  ["female voice fallback", js.includes("speechSynthesis") && js.includes("pitch = 1.14")],
  ["audio sting exists", js.includes("function sting(key)")],
  ["level-complete binding exists", js.includes("bindLevelCard")],
  ["no gameplay authority calls", !/safeAddFlOz|purchaseItem|commitDamResult|entitlement|paypal|awardDay/i.test(js)]
];
const failed = checks.filter(([,ok]) => !ok);
for (const [name,ok] of checks) console.log((ok ? "PASS " : "FAIL ") + name);
if (failed.length) process.exit(1);
console.log(JSON.stringify({version:"V2.1.93",passed:checks.length,failed:0}, null, 2));
