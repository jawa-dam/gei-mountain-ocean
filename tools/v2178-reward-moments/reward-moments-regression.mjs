/* V2.1.78 TAP LITES HYDRAULIC COMBO REWARD MOMENTS — regression (added in V2.2.20 with the `addStyle` fix).
 * The module called an undefined `addStyle()` (its style function is `css()`), threw during startup and never initialised: no card, no listener, no public API.
 *   R1 loads        no page errors; public API frozen + presentationOnly; style + card + wave elements exist
 *   R2 behaviour    streaks of rapid taps (< 850 ms apart) show SOURCE IGNITED (10) → DAM PRESSURE (20) → MILL ACCELERATION (30) → OCEAN RELEASE (40) → FULL HYDRAULIC OVERDRIVE (50),
 *                   each once; the card never blocks input (pointer-events:none); buttons / panels do not count; the streak resets after a pause
 *   R3 economy      presentation only: any number of reward moments change no balance / XP / save key; a REAL Day-1 clear pays exactly +111 through awardDay with the module present
 *                   and exactly the same as with the module blocked
 *   node tools/v2178-reward-moments/reward-moments-regression.mjs
 */
import { boot, sleep, done, browser } from "../v2217-dam-builder/harness.mjs";
let passed = 0, failed = 0;
const check = (n, ok, d) => { if (ok) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d !== undefined ? "\n      " + JSON.stringify(d).slice(0, 500) : "")); } };
const SAVE = "yalltooDamGame.v2";
const seed = (l = 1, f = 0) => JSON.stringify({ version:2, level:l, levelFlOz:f, totalFlOz:1000 + f, completedLevels:l - 1, loopCount:l - 1, currentStep:f / 111 | 0 });
const SNAP = `(() => ({ total:state.totalFlOz, lvl:state.levelFlOz, level:state.level, step:state.currentStep, phase:state.phase, taps:state.tapCount, keys:Object.keys(localStorage).sort(), save:localStorage.getItem("${SAVE}"), xp:localStorage.getItem("geiXPRewardV1") }))()`;
/* a burst of pointer-downs on an inert element (<body>), as fast as a hand can tap */
const burst = (h, n, gapMs = 40, target = "body") => h.page.evaluate(async ([k, g, t]) => { const el = t === "body" ? document.body : document.querySelector(t); for (let i = 0; i < k; i++) { el.dispatchEvent(new PointerEvent("pointerdown", { bubbles:true, cancelable:true, button:0, pointerType:"touch" })); await new Promise(r => setTimeout(r, g)); } }, [n, gapMs, target]);
const card = h => h.page.evaluate(() => { const c = document.getElementById("tl2178Reward"); return { show:c.classList.contains("show"), title:c.querySelector(".title").textContent, od:c.classList.contains("overdrive") }; });

console.log("R1 loads");
let h = await boot({ query:"?b3d=off", storage:{ [SAVE]:seed() } });
check("no page errors at load (the old ReferenceError: addStyle is not defined)", h.errors.length === 0, h.errors);
const api = await h.page.evaluate(() => { const a = window.__GEI_TAP_LITES_REWARD_MOMENTS__; return a && { v:a.version, po:a.presentationOnly, rv:a.rewardValuesChanged, m:a.milestoneMoments.map(x => x.title), frozen:Object.isFrozen(a) }; });
check("the module finished initialising: frozen public API, presentationOnly, rewardValuesChanged false", api && api.po === true && api.rv === false && api.frozen && api.m.length === 5, api);
check("its style, card and wave elements exist (css() ran)", await h.page.evaluate(() => !!document.getElementById("tapLites2178Style") && !!document.getElementById("tl2178Reward") && !!document.getElementById("tl2178Wave")));

console.log("R2 behaviour");
const base = await h.page.evaluate(SNAP);
const seen = [];
for (const [n, title] of [[10, "SOURCE IGNITED"], [20, "DAM PRESSURE"], [30, "MILL ACCELERATION"], [40, "OCEAN RELEASE"], [50, "FULL HYDRAULIC OVERDRIVE"]]) {
  if (n === 10) await burst(h, 10); else await burst(h, 10);
  const c = await card(h); seen.push(c.title); check("streak " + n + " → " + title + " is shown" + (n === 50 ? " with the overdrive style" : ""), c.show && c.title === title && (n === 50) === c.od, c);
}
check("the card never intercepts input (pointer-events: none)", await h.page.evaluate(() => getComputedStyle(document.getElementById("tl2178Reward")).pointerEvents === "none"));
await h.page.evaluate(() => { document.getElementById("tl2178Reward").classList.remove("show"); }); await sleep(1300);       // pause > 1150 ms: streak resets
await burst(h, 9); const nine = await card(h);
check("after a pause the streak restarts (9 taps show nothing new)", !nine.show, nine);
await burst(h, 1); check("…and the 10th tap of the new streak shows SOURCE IGNITED again", (await card(h)).title === "SOURCE IGNITED" && (await card(h)).show);
await sleep(1300); await h.page.evaluate(() => { document.getElementById("tl2178Reward").classList.remove("show"); });
await sleep(1300);
const ign = await h.page.evaluate(async () => { const b = document.createElement("button"); document.body.appendChild(b); for (let i = 0; i < 12; i++) { b.dispatchEvent(new PointerEvent("pointerdown", { bubbles:true, cancelable:true, button:0 })); await new Promise(r => setTimeout(r, 40)); } b.remove(); return document.getElementById("tl2178Reward").classList.contains("show"); });
check("pointer-downs on buttons do not build a streak", ign === false);

console.log("R3 economy");
const after = await h.page.evaluate(SNAP);
check("55+ synthetic taps and five reward moments changed no balance, level, tap count, XP or save key", JSON.stringify(after) === JSON.stringify(base), { base, after });
check("no page errors during the moments", h.errors.length === 0, h.errors);
await h.close();

/* a REAL Day-1 clear (the game's own 6 taps), with the module present and with the module blocked: identical economy */
async function clearDay(block) {
  const hh = await boot({ query:"?b3d=off", block, storage:{ [SAVE]:seed() } });
  const req = await hh.page.evaluate(() => getRequiredTaps(state.level));
  for (let i = 0; i < req + 1; i++) { const p = await hh.page.evaluate(() => { const b = document.getElementById("world").getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }); await hh.page.mouse.click(p[0], p[1]); await sleep(230); }
  await sleep(800);
  const s = await hh.page.evaluate(SNAP), mod = await hh.page.evaluate(() => !!window.__GEI_TAP_LITES_REWARD_MOMENTS__), errs = hh.errors.slice(); await hh.close(); return { s, mod, errs };
}
const withMod = await clearDay(null), without = await clearDay("tap-lites-reward-moments-v2178.js");
check("module present in one run and absent in the other", withMod.mod === true && without.mod === false, [withMod.mod, without.mod]);
check("a real Day-1 clear pays exactly +111 through the Arcade ledger with the module present", withMod.s.total === 1111 && withMod.s.lvl === 111, withMod.s);
check("…and exactly the same economy with the module blocked (reward moments add nothing, bypass nothing)", withMod.s.total === without.s.total && withMod.s.lvl === without.s.lvl && withMod.s.step === without.s.step && withMod.s.level === without.s.level, [withMod.s, without.s]);
check("no page errors in either run", withMod.errs.length === 0 && without.errs.length === 0, [withMod.errs, without.errs]);
console.log("\n" + passed + " passed, " + failed + " failed");
await done(); process.exit(failed ? 1 : 0);
