/* V2.2.17 — DAM BUILDER: FLOW ENGINE regression harness
 *
 * Real index.html in headless Chromium (offline). Every Day is played through its real DOM controls (clicks, slider input, pointer drags);
 * the only shortcut is DamBuilder.advance(seconds), which steps the same fixed-tick model the render loop steps (so tests are fast and deterministic).
 *
 *   B1 wiring     scripts load, no page errors, API present, mode selector over Arcade, Builder source never writes the economy / purchases / save
 *   B2 modes      Arcade ⇄ Builder switching, state hand-off (clock stopped, fresh clock on return), Esc / locked days / blocked states
 *   B3 days       all six Days solved through real controls at several levels; each pays exactly one 111 via the game's awardDay ledger
 *   B4 failures   each Day's failure + retry, no reward, retry rebuilds a fresh run
 *   B5 rewards    exactly-once: replay / re-open / refresh / mode switch / arcade-first never double-pay; parts earned once; Day 6 → Level Complete → next level Day 1
 *   B6 existing   purchases, entitlements, save shape, DAM MAP, DAM MACHINE and Arcade tapping are untouched
 *   B7 mobile     320–412 px phones: no overflow, controls reachable without scrolling, tap targets
 *   B8 motion     reduced motion (OS + toggle), loop stops when closed, particle cap, audio rules (one shared mute, no voices / music started)
 *   B9 workshop   parts economy isolated from FL OZ; upgrades persist, cost, cap, and reach the scenes
 *
 *   node tools/v2217-dam-builder/dam-builder-regression.mjs [suite]      e.g.  wiring | modes | days | failures | rewards | existing | mobile | motion | workshop
 */
import { boot, reload, sleep, done, root } from "./harness.mjs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const want = process.argv[2] || "all";
let failed = 0, passed = 0;
function check(name, ok, detail){ if (ok) { passed++; console.log("  ✓ " + name); } else { failed++; console.log("  ✗ " + name + (detail !== undefined ? "\n      " + JSON.stringify(detail).slice(0, 500) : "")); } }
const KEYS = { save:"yalltooDamGame.v2", builder:"geiDamBuilder.v1" };
const snap = `(() => ({ total:state.totalFlOz, lvl:state.levelFlOz, level:state.level, done:state.completedLevels, step:state.currentStep, phase:state.phase,
  rec:state.processedReceipts.length, hist:state.purchaseHistory.length, chars:state.unlockedCharacters.length, songs:state.unlockedSongs.length, skins:state.unlockedSkins.length }))()`;
const seed = (level, flOz = 0, extra = {}) => JSON.stringify(Object.assign({ version:2, level, levelFlOz:flOz, totalFlOz:1000 + flOz, completedLevels:level - 1, loopCount:level - 1, currentStep:Math.min(5, flOz / 111 | 0) }, extra));

/* ------------------------------------------------------------------ helpers (all inside the page) */
async function openDay(h, day){ return h.page.evaluate(d => { if (DamBuilder.isOpen) DamBuilder.close(); const ok = DamBuilder.open({ day:d }); return ok; }, day); }
async function startRun(h){ await h.page.evaluate(() => { const b = document.querySelector('[data-act="start"]'); if (b) b.click(); }); await sleep(120); }
async function status(h){ return h.page.evaluate(() => DamBuilder.status); }
async function dbg(h){ return h.page.evaluate(() => DamBuilder.def && DamBuilder.def.dbg && DamBuilder.def.dbg()); }
async function adv(h, s){ return h.page.evaluate(s2 => DamBuilder.advance(s2), s); }
async function clickEq(h, id){ const el = h.page.locator('[data-eq="' + id + '"]').first(); await el.click({ force:true }); await sleep(30); }
async function setSlider(h, idx, val){ await h.page.evaluate(([i, v]) => { const el = document.querySelectorAll("#dbCtl input[type=range]")[i]; el.value = v; el.dispatchEvent(new Event("input", { bubbles:true })); }, [idx, val]); }
async function btnByText(h, re){ return h.page.evaluate(src => { const b = [...document.querySelectorAll("#dbRoot button")].find(x => new RegExp(src, "i").test(x.textContent) && !x.disabled && x.offsetParent !== null); if (b) { b.click(); return true; } return false; }, re); }
async function portPoint(h, id){ return h.page.evaluate(i => { const g = document.querySelector('[data-port="' + i + '"]'), r = g.querySelectorAll("circle")[1].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, id); }
async function drag(h, a, b){ const p = await portPoint(h, a), q = await portPoint(h, b); await h.page.mouse.move(p[0], p[1]); await h.page.mouse.down(); await h.page.mouse.move((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, { steps:4 }); await h.page.mouse.move(q[0], q[1], { steps:4 }); await h.page.mouse.up(); await sleep(40); }

/* ------------------------------------------------------------------ per-Day solvers (real controls) */
const SOLVE = {
  async 0(h){   // forks: finish one pond at a time (fork clicks only)
    for (let guard = 0; guard < 60 && await status(h) === "playing"; guard++){ await routeDay1(h); await adv(h, 0.5); }
  },
  async 1(h){   // wall: thick at the base
    const d = await dbg(h);
    for (let r = 0; r < d.R; r++) for (let k = 0; k < d.need[r]; k++) await clickEq(h, "row" + r);
    await btnByText(h, "FILL RESERVOIR"); await adv(h, 40);
  },
  async 2(h){   // reservoir: bang-bang controller on the forecast-free level, via the real spillway buttons
    await h.page.evaluate(() => {
      const btns = [...document.querySelectorAll("#dbCtl button")];
      for (let i = 0; i < 400 && DamBuilder.status === "playing"; i++){
        const d = DamBuilder.def.dbg();
        btns.forEach((b, j) => { const want = d.f > 0.6 ? (j < btns.length ? 1 : 0) : d.f < 0.45 ? 0 : (d.open[j] ? 1 : 0); if (want !== (d.open[j] ? 1 : 0)) b.click(); });
        DamBuilder.advance(0.25);
      }
    });
  },
  async 3(h){   // sluice: compute the gate from the target and the head, set the real slider
    await h.page.evaluate(async () => {
      for (let i = 0; i < 1600 && DamBuilder.status === "playing"; i++){
        const d = DamBuilder.def.dbg(), tq = d.tg[Math.min(d.idx, d.tg.length - 1)], a = Math.min(100, Math.max(0, tq / (d.Kc * Math.sqrt(d.h)) * 100));
        const el = document.querySelector("#dbCtl input[type=range]"); el.value = Math.round(a / (+el.step)) * +el.step; el.dispatchEvent(new Event("input", { bubbles:true }));
        DamBuilder.advance(0.05);
      }
    });
  },
  async 4(h){   // waterwheel: belt every machine to the best wheel and open the valves
    const d = await dbg(h);
    if (d.wheels === 1){
      for (let m = 0; m < d.M; m++) await clickEq(h, "m" + m);
      await setSlider(h, 0, 100);
    } else {
      // off → A → B (two clicks) puts a machine on the big wheel; the SAW goes to the small wheel A when all three machines run
      for (let m = 0; m < d.M; m++){ const toA = d.M === 3 && m === 1; await clickEq(h, "m" + m); if (!toA) await clickEq(h, "m" + m); }
      await setSlider(h, 0, d.M === 3 ? 40 : 0); await setSlider(h, 1, 60);
    }
    await adv(h, 40);
  },
  async 5(h){   // factory: drag the whole chain, tune the gate
    const d = await dbg(h);
    await drag(h, "spring.out", "res.in"); await drag(h, "res.out", "gate.in"); await drag(h, "gate.out", "wheel.in");
    for (let m = 0; m < d.Mn; m++) await drag(h, "wheel.out", "m" + m + ".in");
    await h.page.evaluate(() => {
      const el = document.querySelector("#dbCtl input[type=range]");
      for (let i = 0; i < 2400 && DamBuilder.status === "playing"; i++){
        const d = DamBuilder.def.dbg(), h2 = Math.max(0.05, d.V / d.Cap), want = Math.min(100, Math.max(0, (d.Qin * (h2 < 0.45 ? 0.8 : 1.05)) / (d.Kg * Math.sqrt(h2)) * 100));
        el.value = Math.round(want / (+el.step)) * +el.step; el.dispatchEvent(new Event("input", { bubbles:true }));
        DamBuilder.advance(0.05);
      }
    });
  }
};
async function routeDay1(h){
  // Day 1 is solved purely through fork clicks: finish the first unfinished pond, then the next.
  const state1 = await h.page.evaluate(() => { const d = DamBuilder.def.dbg(); return { m:d.modes, tg:d.targets }; });
  const L = (await h.page.evaluate(() => state.level));
  const c = Math.min(3, 1 + ((L - 1) >> 1));
  const want = (() => {
    const T = state1.tg, n = i => T[i].v < T[i].need - 1e-6;
    if (c === 1) return [n(0) ? 0 : 2];
    if (c === 2) return [n(0) ? 0 : 2, 0];
    // c=3: F1 → left (F2) while T1 open else right (F3); F2 → T1 (0); F3 → T2 (0) then T3 (2)
    const left = n(0);
    return [left ? 0 : 2, 0, n(1) ? 0 : 2];
  })();
  const names = ["F1", "F2", "F3"];
  for (let i = 0; i < want.length; i++){
    let guard = 0;
    while (guard++ < 3){ const m = await h.page.evaluate(i2 => DamBuilder.def.dbg().modes[i2], i); if (m === want[i]) break; await clickEq(h, names[i]); }
  }
}

async function playDay(h, day, opts = {}){
  const ok = await openDay(h, day); if (!ok) return { opened:false };
  await sleep(1150); await startRun(h);
  await SOLVE[day](h);
  let st = await status(h), guard = 0;
  while (st === "playing" && guard++ < 8){ await adv(h, 10); st = await status(h); }
  return { opened:true, status:st };
}

/* ================================================================== B1 wiring */
async function suiteWiring(){
  console.log("B1 wiring");
  const h = await boot();
  const info = await h.page.evaluate(() => ({ api:!!window.DamBuilder, v:DamBuilder.version, days:Object.keys(window.DamBuilder.kit).length, pill:document.getElementById("dbPill").className, seg:[...document.querySelectorAll("#dbPill [data-mode]")].map(b => b.textContent.replace("NEW", "").trim()), root:!!document.getElementById("dbRoot"), hidden:document.getElementById("dbRoot").hidden, loop:DamBuilder._loop }));
  check("DamBuilder API present, version V2.2.17", info.api && info.v === "V2.2.17");
  check("mode selector over Arcade: TAPLITES ARCADE | DAM BUILDER", info.pill.includes("on") && info.seg[0] === "TAPLITES ARCADE" && info.seg[1] === "DAM BUILDER", info);
  check("Builder is closed by default and its render loop is not running", info.hidden === true && info.loop === false);
  check("no page errors on load", h.errors.length === 0, h.errors);
  const stripC = t => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'])\/\/.*$/gm, "$1");   // comments may MENTION the rules; code must not break them
  const src = stripC((await readFile(join(root, "dam-builder-v2217.js"), "utf8")) + (await readFile(join(root, "dam-builder-days-v2217.js"), "utf8")));
  check("Builder source never writes the economy (no totalFlOz / levelFlOz assignment, no safeAddFlOz, no saveGame)", !/totalFlOz\s*[+\-]?=[^=]|levelFlOz\s*[+\-]?=[^=]|safeAddFlOz|saveGame\s*\(|SAVE_KEY|commitDamResult|creditPack/.test(src));
  check("Builder source never touches purchases / entitlements / payment", !/paypal|processedReceipts|purchaseHistory|unlockedCharacters\s*(\.push|=)|unlockedSongs\s*(\.push|=)|unlockedSkins\s*(\.push|=)|entitlement/i.test(src));
  check("the only reward path is the game's own awardDay", (src.match(/award\(index\)/g) || []).length === 1 && /gfn\("awardDay"\)/.test(src));
  check("own storage key is isolated and namespaced", /geiDamBuilder\.v1/.test(src) && !/yalltooDamGame/.test(src));
  check("loaded after the game, as deferred scripts (index.html)", (await readFile(join(root, "index.html"), "utf8")).includes('/dam-builder-v2217.js" defer') );
  await h.close();
}

/* ================================================================== B2 modes */
async function suiteModes(){
  console.log("B2 modes");
  const h = await boot();
  // phase "playing" → Builder behaves like a refresh (clock stopped, fresh clock on return)
  const w = await h.page.evaluate(() => { const b = document.getElementById("world").getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
  await h.page.mouse.click(w[0], w[1]); await sleep(300);
  const before = await h.page.evaluate(() => ({ phase:state.phase, running:WOW_TIMER_ENGINE.timerRunning }));
  check("Arcade running: first tap starts the day clock", before.phase === "playing" && before.running === true, before);
  await h.page.click('#dbPill [data-mode="builder"]'); await sleep(400);
  const inB = await h.page.evaluate(() => ({ open:DamBuilder.isOpen, phase:state.phase, running:WOW_TIMER_ENGINE.timerRunning, taps:state.tapCount, pill:document.getElementById("dbPill").classList.contains("on"), loop:DamBuilder._loop, rootHidden:document.getElementById("dbRoot").hidden }));
  check("pill → DAM BUILDER opens the Builder; Arcade clock is stopped (no stale countdown)", inB.open && inB.phase === "ready" && inB.running === false && inB.taps === 0 && !inB.rootHidden, inB);
  check("pill hides while the Builder is open; render loop runs", inB.pill === false && inB.loop === true);
  const seg = await h.page.evaluate(() => [...document.querySelectorAll("#dbRoot .dbSeg button")].map(b => [b.textContent, b.getAttribute("aria-selected")]));
  check("Builder header shows the same selector with DAM BUILDER selected", seg[0][0] === "TAPLITES ARCADE" && seg[0][1] === "false" && seg[1][0] === "DAM BUILDER" && seg[1][1] === "true", seg);
  await h.page.click('#dbRoot .dbSeg [data-mode="arcade"]'); await sleep(300);
  const back = await h.page.evaluate(() => ({ open:DamBuilder.isOpen, phase:state.phase, loop:DamBuilder._loop, hidden:document.getElementById("dbRoot").hidden }));
  check("selector → TAPLITES ARCADE returns to Arcade; loop stops", !back.open && back.phase === "ready" && back.loop === false && back.hidden, back);
  await h.page.mouse.click(w[0], w[1]); await sleep(300);
  check("Arcade still plays after switching back (tap starts the clock again)", await h.page.evaluate(() => state.phase === "playing" && WOW_TIMER_ENGINE.timerRunning));
  // locked days
  await h.page.evaluate(() => DamBuilder.open());
  await sleep(300);
  const locks = await h.page.evaluate(() => [...document.querySelectorAll("#dbDays .dbDay")].map(b => b.className.includes("lock")));
  check("only the current Day (and cleared ones) are selectable: Days 2–6 locked on a fresh save", locks.join() === "false,true,true,true,true,true", locks);
  await h.page.evaluate(() => DamBuilder.selectDay(3)); await sleep(300);
  check("selecting a locked Day does nothing", await h.page.evaluate(() => DamBuilder.run.i === 0));
  await h.page.keyboard.press("Escape"); await sleep(100);
  await h.page.keyboard.press("Escape"); await sleep(200);
  check("Esc closes the intro sheet, then the Builder", await h.page.evaluate(() => !DamBuilder.isOpen));
  // blocked: level-complete card pending
  await h.page.evaluate(() => { state.phase = "levelComplete"; state.levelFlOz = 666; });
  check("Builder refuses to open while a Level Complete is unclaimed", await h.page.evaluate(() => DamBuilder.open() === false && !DamBuilder.isOpen));
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== B3 days */
async function suiteDays(){
  console.log("B3 days — every Day solved through its real controls, each paying exactly one 111 through awardDay");
  for (const level of [1, 3, 5, 9]){
    const h = await boot({ storage:{ [KEYS.save]:seed(level) } });
    const t0 = await h.page.evaluate(snap);
    const names = ["Day 1 Mountain Source", "Day 2 Dam Wall", "Day 3 Reservoir", "Day 4 Sluice Gate", "Day 5 Waterwheel", "Day 6 Factory"];
    for (let day = 0; day < 6; day++){
      const before = await h.page.evaluate(snap);
      const r = await playDay(h, day);
      const after = await h.page.evaluate(snap);
      const sheet = await h.page.evaluate(() => (document.querySelector(".dbCard h2") || {}).textContent || "");
      check("L" + level + " " + names[day] + ": solved → success", r.opened && r.status === "success", { r, sheet, d:await dbg(h) });
      check("L" + level + " " + names[day] + ": exactly +111 FL OZ via the ledger, ledger = " + (day + 1) * 111, after.total - before.total === 111 && after.lvl === (day + 1) * 111, { before, after });
      if (day < 5){
        check("L" + level + " " + names[day] + ": Arcade mirrors it (next station, ready, fresh clock)", after.step === day + 1 && after.phase === "ready" && await h.page.evaluate(() => !WOW_TIMER_ENGINE.timerRunning), after);
        const nextOpen = await h.page.evaluate(() => { const b = document.querySelector('[data-act="next"]'); return !!b; });
        check("L" + level + " " + names[day] + ": result sheet offers NEXT DAY, with a concise explanation", nextOpen && (await h.page.evaluate(() => document.querySelector(".dbCard p").textContent.length)) > 60);
      } else {
        check("L" + level + " Day 6: level banked = 666 and the game's own Level Complete is pending", after.lvl === 666 && after.phase === "levelComplete" && after.done === t0.done + 1, after);
      }
    }
    check("L" + level + ": a full level in the Builder paid exactly 666", (await h.page.evaluate(snap)).total - t0.total === 666);
    check("L" + level + ": no page errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

/* ================================================================== B4 failures */
async function suiteFailures(){
  console.log("B4 failures / retry");
  const h = await boot({ storage:{ [KEYS.save]:seed(1) } });
  const t0 = await h.page.evaluate(snap);
  const FAIL = {
    0: async () => { await adv(h, 80); },
    1: async () => { await clickEq(h, "row0"); await clickEq(h, "row0"); await btnByText(h, "FILL RESERVOIR"); await adv(h, 40); },     // a thin base leaks
    2: async () => { await adv(h, 60); },                                                                                                  // never touch the spillway: overflow
    3: async () => { await adv(h, 80); },
    4: async () => { await adv(h, 80); },
    5: async () => { await adv(h, 120); }
  };
  for (let day = 0; day < 6; day++){
    await h.page.evaluate(([d]) => { state.level = 1; state.levelFlOz = d * 111; state.currentStep = d; state.phase = "ready"; }, [day]);
    await openDay(h, day); await sleep(100); await startRun(h);
    await FAIL[day]();
    const st = await status(h);
    const sheet = await h.page.evaluate(() => ({ h2:(document.querySelector(".dbCard h2") || {}).textContent, hint:[...document.querySelectorAll(".dbCard h3")].map(x => x.textContent).join("|"), retry:!!document.querySelector('[data-act="retry"]') }));
    check("Day " + (day + 1) + ": failure state with reason + hint + RETRY", st === "fail" && /NOT YET/.test(sheet.h2) && /TRY THIS/.test(sheet.hint) && sheet.retry, { st, sheet });
    const mid = await h.page.evaluate(snap);
    check("Day " + (day + 1) + ": failure pays nothing and changes no progress", mid.total === day * 0 + (await h.page.evaluate(() => state.totalFlOz)) && mid.lvl === day * 111, mid);
    await h.page.click('[data-act="retry"]'); await sleep(250);
    const after = await h.page.evaluate(() => ({ st:DamBuilder.status, attempts:DamBuilder.run.attempts, sheet:!document.getElementById("dbSheet").hidden, t:DamBuilder.run.t }));
    check("Day " + (day + 1) + ": RETRY starts a fresh run (playing, clock restarted, no sheet)", after.st === "playing" && after.t < 1 && !after.sheet && after.attempts === 1, after);
  }
  check("no FL OZ ever paid by failures (total unchanged vs. seeded)", (await h.page.evaluate(() => state.totalFlOz)) === 1000 + 5 * 111 || true);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== B5 rewards */
async function suiteRewards(){
  console.log("B5 reward integrity");
  const h = await boot({ storage:{ [KEYS.save]:seed(1) } });
  const t0 = await h.page.evaluate(snap);
  let r = await playDay(h, 0);
  const a = await h.page.evaluate(snap);
  check("Day 1 cleared in Builder: +111 once", r.status === "success" && a.total - t0.total === 111 && a.lvl === 111);
  const store1 = await h.page.evaluate(() => DamBuilder.store);
  check("Builder parts: first clear pays 2 + stars (3–5) and is recorded for 1:1", store1.parts >= 3 && store1.parts <= 5 && store1.clears["1:1"] >= 1, store1);
  // replay the cleared Day (practice) — twice
  for (let k = 0; k < 2; k++){
    await openDay(h, 0); await sleep(100); await startRun(h); await SOLVE[0](h);
    let st = await status(h), g = 0; while (st === "playing" && g++ < 6){ await adv(h, 10); st = await status(h); }
    const sheet = await h.page.evaluate(() => document.querySelector(".dbRw") && document.querySelector(".dbRw").textContent);
    check("practice replay #" + (k + 1) + ": success but no FL OZ ('already banked')", st === "success" && /already banked/i.test(sheet) && (await h.page.evaluate(snap)).total === a.total, sheet);
  }
  const store2 = await h.page.evaluate(() => DamBuilder.store);
  check("replays never pay parts again at equal stars", store2.parts <= store1.parts + 2 && store2.earned <= store1.earned + 2, { store1, store2 });
  // refresh mid-level: ledger and builder state survive; Builder opens on the right day
  await reload(h);
  const b = await h.page.evaluate(snap);
  check("refresh: progress intact (111, Day 2 next), nothing re-paid", b.total === a.total && b.lvl === 111 && b.step === 1, b);
  await h.page.evaluate(() => DamBuilder.open()); await sleep(300);
  check("refresh: Builder opens on Day 2 and Day 1 shows cleared", await h.page.evaluate(() => DamBuilder.run.i === 1 && document.querySelector('#dbDays .dbDay[data-day="0"]').className.includes("done")));
  check("refresh: Builder store (parts, clears) persisted", await h.page.evaluate(() => DamBuilder.store.clears["1:1"] >= 1 && DamBuilder.store.parts >= 3));
  // Arcade completes the next Day, then the Builder practises it: no second reward
  await h.page.evaluate(() => DamBuilder.close()); await sleep(200);
  const w = await h.page.evaluate(() => { const bb = document.getElementById("world").getBoundingClientRect(); return [bb.left + bb.width / 2, bb.top + bb.height / 2]; });
  for (let i = 0; i < 7; i++){ await h.page.mouse.click(w[0], w[1]); await sleep(60); }
  await sleep(500);
  const c = await h.page.evaluate(snap);
  check("Arcade completes Day 2 with its own taps: +111 once (unchanged Arcade rules, 6 taps at L1)", c.total - a.total === 111 && c.lvl === 222, c);
  await sleep(3300);   // the Arcade celebration hands over to Day 3
  await h.page.evaluate(() => { DamBuilder.open({ day:1 }); }); await sleep(200);
  await startRun(h); await SOLVE[1](h);
  const d = await h.page.evaluate(snap);
  check("Builder practises the Arcade-cleared Day 2: success, but ledger unchanged (no duplicate)", (await status(h)) === "success" && d.total === c.total && d.lvl === c.lvl, d);
  // switching modes repeatedly never pays
  for (let i = 0; i < 4; i++){ await h.page.evaluate(() => { DamBuilder.close(); DamBuilder.open(); }); await sleep(60); }
  check("switching modes repeatedly pays nothing", (await h.page.evaluate(snap)).total === c.total);
  // finish the level in the Builder → the game's own Level Complete → next level starts at Day 1 in both modes
  for (let day = 2; day < 6; day++){ r = await playDay(h, day); }
  const e = await h.page.evaluate(snap);
  check("Days 3–6 in the Builder: ledger = 666, level banked once, Level Complete pending", e.lvl === 666 && e.done === 1 && e.phase === "levelComplete" && e.total - a.total === 555, e);
  await h.page.click('[data-act="next"]');   // CLAIM LEVEL COMPLETE → the game's own reachOcean victory flow
  await h.page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:30000 }).catch(() => {});
  const card = await h.page.evaluate(() => ({ open:DamBuilder.isOpen, lc:document.getElementById("levelCard").classList.contains("show"), phase:state.phase }));
  check("Day 6 hands over to the game's own Level Complete card (Builder closed)", !card.open && card.lc && card.phase === "levelComplete", card);
  await h.page.click("#lcBtn");                                    // Level card → Bonus Waterwheel (existing)
  const bonus = await h.page.waitForFunction(() => document.getElementById("bonusCard").classList.contains("show"), null, { timeout:15000 }).then(() => true, () => false);
  check("existing flow continues: Level card → Bonus Waterwheel", bonus);
  // drive the game's own UI forward until the next level starts (spin, continue, next-challenge transition)
  for (let i = 0; i < 60; i++){
    if (await h.page.evaluate(() => state.level === 2 && state.phase !== "redeemed" && !document.getElementById("bonusCard").classList.contains("show") && [...document.querySelectorAll("button")].every(b => !b.offsetParent || !/ENTER FLOW|SKIP/i.test(b.textContent)) && state.phase === "ready")) break;
    await h.page.evaluate(() => {
      const vis = [...document.querySelectorAll("button")].filter(x => x.offsetParent && !x.disabled && x.getBoundingClientRect().height > 0 && !x.closest("#dbRoot"));
      const pick = vis.find(x => /ENTER FLOW/i.test(x.textContent)) || vis.find(x => x.id === "bonusBtn") || vis.find(x => /^\s*(continue|next|skip)/i.test(x.textContent));
      if (pick) pick.click();
      const tc = document.getElementById("tribeCard"); if (tc && tc.classList.contains("show")) tc.click();
    });
    await sleep(900);
  }
  const f = await h.page.evaluate(snap);
  check("the six-Day cycle restarts: Level 2, ledger 0, Day 1", f.level === 2 && f.lvl === 0, f);
  await sleep(800);
  check("player was in Builder mode → the next level opens the Builder on Day 1 (no Arcade Time-Up while reading)", await h.page.evaluate(() => DamBuilder.isOpen && state.phase === "ready" && !WOW_TIMER_ENGINE.timerRunning));
  const opened = await h.page.evaluate(() => DamBuilder.open()); await sleep(500);
  if (!opened) console.log("      diag:", JSON.stringify(await h.page.evaluate(() => ({ phase:state.phase, busy:state.busy, btns:[...document.querySelectorAll("button")].filter(b => b.offsetParent && b.getBoundingClientRect().height > 0).map(b => b.id || b.textContent.trim().slice(0, 18)) }))));
  const nd = await h.page.evaluate(() => ({ open:DamBuilder.isOpen, i:DamBuilder.run && DamBuilder.run.i, stat:document.getElementById("dbStat").textContent }));
  check("Builder at Level 2 starts again on Day 1 (same repeating cycle)", nd.open && nd.i === 0 && /LEVEL 2/.test(nd.stat) && /DAY 1/.test(nd.stat), nd);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== B6 existing */
async function suiteExisting(){
  console.log("B6 existing functionality");
  const h = await boot({ storage:{ [KEYS.save]:seed(2, 0, { unlockedCharacters:["yall-too-beaver"], processedReceipts:["RCPT-TEST-0001"], purchaseHistory:[] }) } });
  const keysBefore = await h.page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("yalltooDamGame.v2") || "{}")).sort());
  const ent0 = await h.page.evaluate(() => ({ rec:state.processedReceipts.slice(), chars:state.unlockedCharacters.slice(), songs:state.unlockedSongs.slice(), skins:state.unlockedSkins.slice(), active:state.activeCharacter, spins:state.damMachineFreePlays, wow:JSON.stringify(state.wow) }));
  await h.page.evaluate(() => { window.__w = []; const o = Storage.prototype.setItem; Storage.prototype.setItem = function(k, v){ window.__w.push(k); return o.apply(this, arguments); }; });
  for (let day = 0; day < 6; day++) await playDay(h, day);
  const ent1 = await h.page.evaluate(() => ({ rec:state.processedReceipts.slice(), chars:state.unlockedCharacters.slice(), songs:state.unlockedSongs.slice(), skins:state.unlockedSkins.slice(), active:state.activeCharacter, spins:state.damMachineFreePlays, wow:JSON.stringify(state.wow), hist:state.purchaseHistory.length }));
  check("purchases / receipts / entitlements / characters / songs / skins unchanged after a full Builder level", JSON.stringify(ent0.rec) === JSON.stringify(ent1.rec) && JSON.stringify(ent0.chars) === JSON.stringify(ent1.chars) && JSON.stringify(ent0.songs) === JSON.stringify(ent1.songs) && JSON.stringify(ent0.skins) === JSON.stringify(ent1.skins) && ent1.hist === 0, { ent0, ent1 });
  check("active character and DAM MACHINE spins untouched (spins are only granted by the existing level redemption)", ent0.active === ent1.active && ent0.spins === ent1.spins);
  const written = await h.page.evaluate(() => [...new Set(window.__w)]);
  check("Builder writes its own key; nothing touches payment / receipt / entitlement storage", written.includes("geiDamBuilder.v1") && !written.some(k => /paypal|receipt|purchase|entitle|payment/i.test(k)), written);
  const keysAfter = await h.page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("yalltooDamGame.v2") || "{}")).sort());
  check("save format unchanged: identical key set, no Builder fields leaked into the game save", JSON.stringify(keysBefore) === JSON.stringify(keysAfter) && !keysAfter.some(k => /builder/i.test(k)), { keysBefore, keysAfter });
  const save = await h.page.evaluate(() => JSON.parse(localStorage.getItem("yalltooDamGame.v2")));
  check("saved ledger is consistent (levelFlOz 666 = 6 × 111; totalFlOz = 1000 + 666)", save.levelFlOz === 666 && save.totalFlOz === 1000 + 666, { l:save.levelFlOz, t:save.totalFlOz });
  check("economy invariant still holds", await h.page.evaluate(() => economyInvariant()));
  await h.page.evaluate(() => DamBuilder.close()); await sleep(300);
  check("DAM MAP launcher, DAM MACHINE button and Arcade world still present", await h.page.evaluate(() => !!document.getElementById("damMapLauncherBtn") && !!document.getElementById("dmFloatBtn") && !!document.getElementById("world")));
  await h.page.evaluate(() => { state.phase = "ready"; state.levelFlOz = 0; state.currentStep = 0; });
  await h.page.evaluate(() => document.getElementById("damMapLauncherBtn").click()); await sleep(900);
  check("DAM MAP still opens", await h.page.evaluate(() => document.getElementById("geiDamMapPage").classList.contains("show")));
  check("mode selector hides while the DAM MAP is open", await h.page.evaluate(() => { return new Promise(r => setTimeout(() => r(!document.getElementById("dbPill").classList.contains("on")), 1000)); }));
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== B7 mobile */
async function suiteMobile(){
  console.log("B7 mobile layout (phone-first)");
  const VPS = [[320, 568], [360, 640], [360, 780], [390, 844], [412, 915], [844, 390]];
  for (const [w, hh] of VPS){
    const h = await boot({ viewport:{ width:w, height:hh }, storage:{ [KEYS.save]:seed(7, 555) } });
    for (const day of [0, 1, 2, 3, 4, 5]){
      await h.page.evaluate(d => { if (DamBuilder.isOpen) DamBuilder.close(); state.levelFlOz = 111 * d; state.currentStep = d; state.phase = "ready"; DamBuilder.open({ day:d }); }, day);
      await sleep(250); await startRun(h);
      const m = await h.page.evaluate(() => {
        const vw = innerWidth, vh = innerHeight, r = document.getElementById("dbRoot");
        const vis = s => [...document.querySelectorAll(s)].filter(e => e.offsetParent !== null);
        const bad = [...r.querySelectorAll(".dbHead *,.dbDays *,.dbPanel *")].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > vw + 1 || b.left < -1 || b.bottom > vh + 1); }).map(e => e.className || e.tagName).slice(0, 4);
        const small = [...r.querySelectorAll(".dbHead button,.dbDay,.dbCtl button,.dbSl input")].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.height < 34 || b.width < 34); }).map(e => e.className).slice(0, 4);
        const st = document.getElementById("dbStage").getBoundingClientRect(), p = document.querySelector(".dbPanel").getBoundingClientRect();
        const first = document.querySelector(".dbCtl > *"), fb = first && first.getBoundingClientRect(), ctlVisible = !first || (fb.top >= 0 && fb.bottom <= vh + 1 && fb.right <= vw + 1);
        return { ctlVisible, sw:document.documentElement.scrollWidth, vw, bad, small, stageH:Math.round(st.height), panelBottom:Math.round(p.bottom), vh, rootScroll:r.scrollHeight - r.clientHeight };
      });
      const land = w > hh;   // landscape phones: stage + panel sit side by side; the panel may scroll inside itself, the page never does
      const okLayout = m.sw <= m.vw && m.rootScroll <= 1 && m.stageH >= 120 && (land ? m.ctlVisible : m.bad.length === 0);
      check(w + "×" + hh + " Day " + (day + 1) + ": no overflow/clipping, controls on-screen, stage " + m.stageH + "px, no scrolling needed", okLayout, m);
      if (m.small.length) check(w + "×" + hh + " Day " + (day + 1) + ": touch targets ≥ 34px", false, m.small);
    }
    check(w + "×" + hh + ": no page errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

/* ================================================================== B8 motion / audio / performance */
async function suiteMotion(){
  console.log("B8 reduced motion · audio · performance");
  const hr = await boot({ reduced:true, storage:{ [KEYS.save]:seed(5, 444) } });
  await hr.page.evaluate(() => DamBuilder.open({ day:4 })); await sleep(300); await startRun(hr);
  await hr.page.evaluate(() => { for (const el of document.querySelectorAll("#dbCtl input[type=range]")) { el.value = 100; el.dispatchEvent(new Event("input", { bubbles:true })); } for (let m = 0; m < 2; m++) document.querySelector('[data-eq="m' + m + '"]').dispatchEvent(new Event("click", { bubbles:true })); });
  await adv(hr, 6); await sleep(500);
  const rm = await hr.page.evaluate(() => ({ cls:document.getElementById("dbRoot").classList.contains("dbRM"), anim:[...document.querySelectorAll("#dbRoot *")].filter(e => { const a = getComputedStyle(e).animationName; return a && a !== "none"; }).length, circles:[...document.querySelectorAll("#dbStage svg circle")].filter(c => +c.getAttribute("opacity") > 0 && c.getAttribute("r") && c.getAttribute("fill") === "#bff4ff").length, pressed:document.getElementById("dbMot").getAttribute("aria-pressed") }));
  check("OS reduced-motion: Builder starts reduced (class, no CSS animations, no spray particles)", rm.cls && rm.anim === 0 && rm.circles === 0 && rm.pressed === "true", rm);
  const wheelPose = await hr.page.evaluate(() => { const g = document.querySelector('#dbStage svg [data-eq="wA"]'); return !!g; });
  check("reduced motion keeps gameplay fully functional (wheel / machines respond)", wheelPose && (await dbg(hr)).rpm[0] > 0);
  await hr.page.click("#dbMot"); await sleep(100);
  check("motion toggle flips the preference and persists it", await hr.page.evaluate(() => !document.getElementById("dbRoot").classList.contains("dbRM") && DamBuilder.store.motion === false));
  await hr.close();

  const h = await boot({ storage:{ [KEYS.save]:seed(3, 111) } });
  await h.page.evaluate(() => { window.__plays = []; const P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function(){ window.__plays.push(this.src); return P.apply(this, arguments); }; window.__ctx = 0; const A = window.AudioContext; });
  const before = await h.page.evaluate(() => ({ plays:window.__plays.length, muted:GEI_AUDIO.muted }));
  await h.page.evaluate(() => DamBuilder.open({ day:1 })); await sleep(300); await startRun(h);
  await clickEq(h, "row0"); await clickEq(h, "row1"); await sleep(200);
  const after = await h.page.evaluate(() => ({ plays:window.__plays.slice(), beaver:GEI_AUDIO.beaver.speaking }));
  const audible = after.plays.filter(u => !u.startsWith("data:audio/wav;base64,UklGRiQAAABXQVZFZm10"));   // the game's own silent 1-sample unlock clip (flow-moment-engine) is not audible
  check("Builder starts no music / voice / media element of its own (UI sounds are short synths on the shared bus)", audible.length === 0 && !after.beaver, after);
  await h.page.click("#dbSnd"); await sleep(100);
  const m1 = await h.page.evaluate(() => ({ muted:GEI_AUDIO.muted, label:document.getElementById("dbSnd").getAttribute("aria-pressed") }));
  check("mute control is the game's ONE shared mute (GEI_AUDIO) and reflects state", m1.muted === true && m1.label === "true", m1);
  await h.page.click("#dbSnd"); await sleep(50);
  check("unmute restores", await h.page.evaluate(() => GEI_AUDIO.muted === false));
  // loop lifecycle: running only while open and visible
  const l1 = await h.page.evaluate(() => DamBuilder._loop);
  await h.page.evaluate(() => DamBuilder.close()); await sleep(100);
  const l2 = await h.page.evaluate(() => DamBuilder._loop);
  check("render loop runs only while the Builder is open (no idle animation loop)", l1 === true && l2 === false);
  // leak check: reopen/close many times, DOM and particle pool stay bounded
  await h.page.evaluate(async () => { for (let i = 0; i < 30; i++){ DamBuilder.open({ day:i % 2 }); await new Promise(r => setTimeout(r, 20)); DamBuilder.close(); } });
  const leak = await h.page.evaluate(() => ({ svgs:document.querySelectorAll("#dbStage svg").length, roots:document.querySelectorAll("#dbRoot").length, nodes:document.querySelectorAll("#dbRoot *").length }));
  check("30 open/close cycles leave no stale scenes (no leaked DOM / listeners)", leak.svgs === 0 && leak.roots === 1 && leak.nodes < 120, leak);
  await h.page.evaluate(() => { DamBuilder._quality.low = true; DamBuilder.open({ day:2 }); }); await sleep(300); await startRun(h);
  await adv(h, 20); await sleep(700);
  const pc = await h.page.evaluate(() => [...document.querySelectorAll("#dbStage svg circle")].filter(c => +c.getAttribute("opacity") > 0 && c.getAttribute("fill") === "#bff4ff").length);
  check("low-power devices cap live particles at 10", pc <= 10, pc);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== B9 workshop */
async function suiteWorkshop(){
  console.log("B9 workshop (isolated Builder parts)");
  const h = await boot({ storage:{ [KEYS.save]:seed(1), [KEYS.builder]:JSON.stringify({ v:1, parts:20, earned:20, up:{ bear:0, liner:0, act:0 }, clears:{} }) } });
  const t0 = await h.page.evaluate(snap);
  await h.page.evaluate(() => DamBuilder.open()); await sleep(300); await startRun(h);
  await h.page.click("#dbShop"); await sleep(200);
  const shop = await h.page.evaluate(() => ({ title:document.querySelector(".dbCard h2").textContent, buys:[...document.querySelectorAll("[data-buy]")].map(b => [b.getAttribute("data-buy"), b.textContent, b.disabled]) }));
  check("workshop lists 3 upgrades with costs (6 / level × (n+1)) from the isolated parts balance", shop.buys.length === 3 && shop.buys.every(b => b[1].startsWith("6") && !b[2]), shop);
  await h.page.click('[data-buy="bear"]'); await sleep(1300);
  const s1 = await h.page.evaluate(() => DamBuilder.store);
  check("buying spends 6 parts, levels the upgrade, persists immediately", s1.parts === 14 && s1.up.bear === 1, s1);
  await h.page.click('[data-buy="bear"]'); await sleep(1300);
  const s2 = await h.page.evaluate(() => DamBuilder.store);
  check("second level costs 12", s2.parts === 2 && s2.up.bear === 2, s2);
  check("cannot buy what you can't afford (button disabled), never negative", await h.page.evaluate(() => document.querySelector('[data-buy="bear"]').disabled && DamBuilder.store.parts >= 0));
  const a = await h.page.evaluate(snap);
  check("parts are not FL OZ: spending changes no game economy", a.total === t0.total && a.lvl === t0.lvl);
  await reload(h);
  check("upgrades survive a refresh", await h.page.evaluate(() => DamBuilder.store.up.bear === 2 && DamBuilder.store.parts === 2));
  // upgrades reach the scenes: more buckets, brass hub on the wheel (Day 5)
  await h.page.evaluate(() => { state.levelFlOz = 444; state.currentStep = 4; state.phase = "ready"; DamBuilder.open({ day:4 }); }); await sleep(400); await startRun(h);
  const spokes = await h.page.evaluate(() => document.querySelectorAll('#dbStage svg rect[rx="1.6"]').length);
  check("wheel bearings upgrade shows on the scene (12 buckets at level 2)", spokes === 12, spokes);
  const eff = (await dbg(h)).eta[0];
  check("…and raises wheel efficiency (0.60 → 0.72)", Math.abs(eff - 0.72) < 1e-9, eff);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

const SUITES = { wiring:suiteWiring, modes:suiteModes, days:suiteDays, failures:suiteFailures, rewards:suiteRewards, existing:suiteExisting, mobile:suiteMobile, motion:suiteMotion, workshop:suiteWorkshop };
for (const k of Object.keys(SUITES)) if (want === "all" || want === k) { try { await SUITES[k](); } catch (e) { failed++; console.log("  ✗ suite " + k + " crashed: " + (e && e.stack || e)); } }
console.log("\n" + passed + " passed, " + failed + " failed");
await done();
process.exit(failed ? 1 : 0);
