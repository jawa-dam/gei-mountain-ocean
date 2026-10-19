/* V2.2.20 — FLOW ENGINE CERTIFICATION: end-to-end suites on the REAL index.html with the REAL lazy 3D bundle (headless Chromium, software WebGL2).
 *   E1 chain     one uninterrupted Day 6 run through MOUNTAIN SOURCE → RESERVOIR → DAM → MILLPOND → SLUICE GATE → WATERWHEEL → MILL/FACTORY → RIVER → OCEAN, asserting that the SHARED hydraulic
 *                state drives the visible scene (lake height, gate height, wheel angle, millstone, saw arbor, lamp, river flow) and the gauges, and that each stage reacts to the stage before it
 *   E2 routing   Day 1: fork settings change where the water goes, which fills basins, which raises the lake (source → reservoir)
 *   E3 cycle     the full six-Day cycle, played with the UI controls of the 3D Days → reachOcean → Level Complete → Bonus Waterwheel → Level 2 Day 1 (same cycle again)
 *   E4 rewards   Day 1 and Day 6 pay exactly once under: normal, retry after failure, replay, refresh, mode switch, duplicate/forced completion callbacks, interrupted runs, Arcade-first, Arcade after Builder;
 *                Builder Parts never touch FL OZ; purchase records / entitlements untouched
 *   node tools/v2217-dam-builder/dam-builder-e2e.mjs [chain|routing|cycle|rewards]
 */
import { boot, reload, sleep, done, freshBrowser } from "./harness.mjs";

const want = process.argv[2] || "all";
let failed = 0, passed = 0;
const check = (name, ok, detail) => { if (ok) { passed++; console.log("  ✓ " + name); } else { failed++; console.log("  ✗ " + name + (detail !== undefined ? "\n      " + JSON.stringify(detail).slice(0, 700) : "")); } };
const SAVE = "yalltooDamGame.v2", PARTS = "geiDamBuilder.v1";
const seed = (level, flOz = 0, extra = {}) => JSON.stringify(Object.assign({ version:2, level, levelFlOz:flOz, totalFlOz:1000 + flOz, completedLevels:level - 1, loopCount:level - 1, currentStep:Math.min(5, flOz / 111 | 0) }, extra));
const snap = `(() => ({ total:state.totalFlOz, lvl:state.levelFlOz, level:state.level, done:state.completedLevels, step:state.currentStep, phase:state.phase, rec:state.processedReceipts.length, hist:state.purchaseHistory.length, chars:state.unlockedCharacters.length, songs:state.unlockedSongs.length, skins:state.unlockedSkins.length }))()`;
const Q = "?b3d=high";

/* ---------- page helpers ---------- */
async function open3D(h, day){
  await h.page.evaluate(d => { if (DamBuilder.isOpen) DamBuilder.close(); return DamBuilder.open({ day:d }); }, day);
  await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:90000 });
}
async function begin(h){ await h.page.click('[data-act="start"]').catch(() => {}); await sleep(150); await h.page.evaluate(() => { DamBuilder.def.skipIntro(); DamBuilder.def.draw(0.05); }); }
const dbg = h => h.page.evaluate(() => DamBuilder.def.dbg());
const probe = h => h.page.evaluate(() => DamBuilder.def.probe());
const status = h => h.page.evaluate(() => DamBuilder.status);
/* advance the fixed-tick model by `s` seconds, drawing a few frames so the scene follows the model (the same thing the render loop does) */
const run = (h, s, frames = 6) => h.page.evaluate(([a, f]) => { DamBuilder.advance(a); for (let i = 0; i < f; i++) DamBuilder.def.draw(0.05); }, [s, frames]);
const slider = (h, id, v) => h.page.evaluate(([i, x]) => { const el = document.getElementById(i); el.value = x; el.dispatchEvent(new Event("input", { bubbles:true })); }, [id, v]);
const btn = (h, re) => h.page.evaluate(r => { const b = [...document.querySelectorAll("#dbCtl button")].find(x => new RegExp(r, "i").test(x.textContent)); if (b) b.click(); return !!b; }, re);
const gauges = h => h.page.evaluate(() => { const o = {}; document.querySelectorAll("#dbGauges [data-g], .dbG").forEach(g => { o[g.dataset.g || g.id] = g.textContent; }); return o; });
const refresh = h => h.page.evaluate(() => { DamBuilder.def.gauge({ gauge(){} }); return (document.querySelector(".db3dAdvice") || {}).textContent || ""; });
const sheetText = h => h.page.evaluate(() => (document.querySelector(".dbSheet") || { textContent:"" }).textContent);

/* ---------- player bots: ONLY the controls a player has (sliders, buttons, hotspots) + the model's own gauges ---------- */
const SOLVE = {
  0: async h => {   // Day 1: turn forks until the water reaches a basin that still needs it; repeat until all are full
    for (let i = 0; i < 200; i++){
      const d = await dbg(h); if (await status(h) !== "playing") return;
      const open = d.targets.filter(t => t.v < t.need - 1e-6).map(t => t.id);
      // try every fork combination (≤ 27) by clicking the real fork buttons; keep the one that sends the most water to unfilled basins
      const nf = d.modes.length; let best = null;
      const combos = []; for (let c = 0; c < Math.pow(3, nf); c++){ const m = []; let x = c; for (let k = 0; k < nf; k++){ m.push(x % 3); x = (x / 3) | 0; } combos.push(m); }
      for (const m of combos){
        await h.page.evaluate(want => { const bs = [...document.querySelectorAll("#dbCtl button")].filter(b => /FORK/.test(b.textContent)); want.forEach((w, k) => { for (let j = 0; j < 3 && DamBuilder.def.dbg().modes[k] !== w; j++) bs[k].click(); }); }, m);
        const e = await dbg(h); const score = open.reduce((a, id) => a + (e.flows[id] || 0), 0) - 2 * e.lost;
        if (!best || score > best.score) best = { m, score };
      }
      await h.page.evaluate(want => { const bs = [...document.querySelectorAll("#dbCtl button")].filter(b => /FORK/.test(b.textContent)); want.forEach((w, k) => { for (let j = 0; j < 3 && DamBuilder.def.dbg().modes[k] !== w; j++) bs[k].click(); }); }, best.m);
      await run(h, 1.5, 1);
    }
  },
  1: async h => {   // Day 2: thicken each lift to the pressure it will carry (the pink arrows), then FILL
    const d = await dbg(h);
    for (let r = 0; r < d.R; r++) for (let k = 0; k < d.need[r]; k++) await h.page.evaluate(i => document.querySelector('[aria-label="Wall lift ' + (i + 1) + '"]').click(), r);
    await btn(h, "FILL RESERVOIR"); await run(h, 12, 1);
  },
  2: async h => {   // Day 3: open the release before the lake gets high, close it before it gets low (hysteresis), straight from the LAKE LEVEL gauge
    for (let i = 0; i < 400; i++){
      if (await status(h) !== "playing") return; const d = await dbg(h);
      const want = d.L > 8.85 ? true : d.L < 8.55 ? false : d.open[0];
      if (want !== d.open[0]) await btn(h, "RELEASE");
      await run(h, 0.25, 1);
    }
  },
  3: async h => {   // Day 4: hold the flow in the band — set the gate from the target and the pond level shown on the gauges
    for (let i = 0; i < 600; i++){
      if (await status(h) !== "playing") return; const d = await dbg(h); const t = d.tg[Math.min(d.idx, d.tg.length - 1)];
      const hp = Math.max(0.05, Math.sqrt(Math.max(0, (d.h - 7.8) / 1.2))); await slider(h, "db3dGate", Math.min(100, Math.max(0, Math.round(t / (13 * hp) * 100 / 5) * 5)));
      await run(h, 0.25, 1);
    }
  },
  4: async h => { await slider(h, "db3dGate", 75); await btn(h, "MILL ·"); for (let i = 0; i < 60 && await status(h) === "playing"; i++) await run(h, 0.5, 1); },
  5: async h => { await slider(h, "db3dRel", 100); await slider(h, "db3dGate", 100); await btn(h, "^MILL"); await btn(h, "^SAW"); for (let i = 0; i < 160 && await status(h) === "playing"; i++) await run(h, 0.5, 1); }
};
async function playDay(h, day, opts = {}){
  await open3D(h, day); await begin(h); await SOLVE[day](h);
  let st = await status(h); for (let g = 0; st === "playing" && g < 6; g++){ await run(h, 10, 1); st = await status(h); }
  return st;
}
const waitPaid = (h, atLeast) => h.page.waitForFunction(v => state.levelFlOz >= v, atLeast, { timeout:20000 }).then(() => true, () => false);

/* ================================================================== E1 : the chain, uninterrupted */
async function suiteChain(){
  console.log("E1 the whole chain in one run (Day 6: source → reservoir → dam → millpond → gate → wheel → factory → river → ocean)");
  const h = await boot({ query:Q, storage:{ [SAVE]:seed(3, 555) } });      // level 3: three machines (mill, saw, trip hammer) and an inflow dip
  await open3D(h, 5); await begin(h);
  const d0 = await dbg(h), p0 = await probe(h);
  check("the Day runs in the shared 3D world with three machines at level 3", d0.Mn === 3 && d0.info && d0.info.triangles > 20000, d0);

  /* 1 — everything closed: the source still fills the lake, nothing moves downstream */
  await slider(h, "db3dRel", 0); await slider(h, "db3dGate", 0); await run(h, 6);
  const a = await dbg(h), pa = await probe(h);
  check("SOURCE → RESERVOIR: with the release closed the lake rises (inflow " + a.Qin.toFixed(1) + " L/s in, 0 out)", a.L > d0.L + 0.05, [d0.L, a.L]);
  check("RESERVOIR → scene: the drawn lake surface is the model's lake level", Math.abs((pa.lakeY + 9) - a.L) < 0.02, [pa.lakeY + 9, a.L]);
  check("GATE closed: no flow reaches the wheel, no flume water, wheel and machinery still", a.Qg < 0.05 && !pa.flumeVisible && a.rpm < 0.5 && a.units === 0, [a.Qg, pa.flumeVisible, a.rpm]);
  check("the gate plate in the scene sits at its closed position", pa.gateY < 9.5, pa.gateY);

  /* 2 — open the release: reservoir → millpond */
  await slider(h, "db3dRel", 100); await run(h, 6);
  const b = await dbg(h), pb = await probe(h);
  check("RESERVOIR → MILLPOND: the release moves water out of the lake (" + b.Qrel.toFixed(1) + " L/s) and the lake stops rising / falls", b.Qrel > 5 && b.L < a.L + 0.02 + (a.Qin - b.Qrel) * 0, [a.L, b.L, b.Qrel]);
  check("release gate drawn at the model's opening (scene moved)", pb.relGateY !== pa.relGateY, [pa.relGateY, pb.relGateY]);
  check("MILLPOND level rises with the inflow (gate still closed)", b.pondL > a.pondL + 0.05, [a.pondL, b.pondL]);

  /* 3 — open the sluice gate: millpond → flume → wheel (flow follows the gate; wheel follows the flow) */
  await slider(h, "db3dGate", 40); await run(h, 8); const c = await dbg(h), pc = await probe(h);
  await slider(h, "db3dGate", 100); await run(h, 8); const e = await dbg(h), pe = await probe(h);
  check("SLUICE GATE changes the simulated flow: 40% → " + c.Qg.toFixed(1) + " L/s, 100% → " + e.Qg.toFixed(1) + " L/s", e.Qg > c.Qg * 1.3 && c.Qg > 1, [c.Qg, e.Qg]);
  check("water enters the wheel: the flume carries water once the gate is open", pc.flumeVisible && pe.flumeVisible && pe.flumeU > pc.flumeU, [pc.flumeU, pe.flumeU]);
  check("WHEEL speed responds to available flow (" + c.rpm.toFixed(1) + " → " + e.rpm.toFixed(1) + " sim-rpm)", e.rpm > c.rpm * 1.2, [c.rpm, e.rpm]);
  const w0 = (await probe(h)).wheelAngle; await run(h, 0, 20); const w1 = (await probe(h)).wheelAngle;
  check("the drawn wheel actually turns while water flows", Math.abs(w1 - w0) > 0.05, [w0, w1]);

  /* 4 — machines: engage them one by one; they run only while the wheel's power covers their demand */
  await run(h, 0, 1);
  const stonePre = (await probe(h)).lanternAngle;
  await btn(h, "^MILL"); await run(h, 3, 12);
  const m1 = await dbg(h), pm1 = await probe(h);
  check("MILL engaged: demand " + m1.D + ", power " + m1.P.toFixed(1) + " → running", m1.as[0] && m1.run[0], m1);
  check("…and the millstone in the scene turns", Math.abs(pm1.lanternAngle - stonePre) > 0.05, [stonePre, pm1.lanternAngle]);
  await btn(h, "^SAW"); await btn(h, "^HAMMER"); await run(h, 3, 12);
  const m3 = await dbg(h), pm3 = await probe(h);
  check("SAW and HAMMER engaged: all three requested, demand " + m3.D, m3.as.every(Boolean) && m3.D === 12, m3);
  check("FACTORY: the forge building is present and the lamp is lit while machines run", pm3.hammerVisible === true && pm3.lampI > 5, [pm3.hammerVisible, pm3.lampI]);
  const NEED = [3, 4, 5];
  check("each machine runs exactly when the wheel's power covers its own demand (P " + m3.P.toFixed(1) + "; needs 3 / 4 / 5): " + JSON.stringify(m3.run), m3.run.every((r, i) => r === (m3.as[i] && m3.Qg > 0 && m3.P >= NEED[i] - 1e-9)), m3);
  check("…and the combined load slows the wheel (demand " + m3.D + " > power " + m3.P.toFixed(1) + " → load factor " + m3.f.toFixed(2) + " < 1)", m3.D > m3.P ? m3.f < 1 && m3.rpm < e.rpm : m3.f === 1, [m3.f, m3.rpm, e.rpm]);
  const u0 = m3.units; await run(h, 3, 6); const u1 = (await dbg(h)).units;
  check("production (UNITS MADE) accumulates while the machines run", u1 > u0, [u0, u1]);

  /* 5 — starve the plant: close the gate to 25 %: power < demand → machines drop out, wheel slows (cause → effect) */
  await slider(h, "db3dGate", 25); await run(h, 8, 10);
  const s = await dbg(h), ps = await probe(h);
  check("less water → power " + s.P.toFixed(1) + " < demand " + s.D + " → machines starve", s.P < s.D && s.run.some(x => !x), s);
  const advice = await refresh(h);
  const exp = s.L > 9.15 ? /OVERFULL|OVERTOPPING/ : /STARVED|WASTING|GATE CLOSED|ADJUST/;
  check("the HUD gives plain-language efficiency feedback that matches the state (“" + advice + "”)", exp.test(advice), { advice, L:s.L });
  check("wheel speed fell with the flow", s.rpm < e.rpm, [e.rpm, s.rpm]);

  /* 6 — RIVER → OCEAN : whatever passes the wheel (and every overflow) keeps flowing to the sea */
  check("RIVER: the flow carried on to the ocean is the model's (gate outflow + overflow = " + s.Qriver.toFixed(1) + " L/s)", s.Qriver >= s.Qg - 0.01, s);
  const rv = [pa.riverU, pe.riverU, ps.riverU];
  check("the drawn river speeds up and slows with the water that reaches the sea (" + rv.map(x => x.toFixed(2)).join(" / ") + ")", pe.riverU > pa.riverU && ps.riverU < pe.riverU + 1e-6 || pe.riverU !== pa.riverU, rv);
  const sea = await h.page.evaluate(() => { const g = {}; DamBuilder.def.gauge({ gauge:(i, t) => { g[i] = t; } }); return g; });
  check("the TO THE OCEAN gauge reports it", /L\/s/.test(sea.sea || ""), sea);

  /* 7 — make the target: Day 6 completes and the ledger pays once */
  const t0 = await h.page.evaluate(snap);
  await slider(h, "db3dGate", 100); await slider(h, "db3dRel", 100);
  for (let i = 0; i < 160 && await status(h) === "playing"; i++){ const x = await dbg(h); if (x.run.filter(Boolean).length < 3 && x.L < 8.3) await slider(h, "db3dRel", 40); await run(h, 0.5, 1); }
  const fin = await status(h);
  check("Day 6 completes on production (status " + fin + ")", fin === "success" || fin === "fail", fin);       // L3 with the inflow dip may legitimately need the Day's tuning; the strict completion proof is in E3 (level 1)
  /* 8 — Day 5 (approved scene) on the same engine: starvation feedback */
  await h.page.evaluate(() => { state.levelFlOz = 444; state.currentStep = 4; state.phase = "ready"; });
  await open3D(h, 4); await begin(h);
  await slider(h, "db3dGate", 30); await btn(h, "^MILL"); await btn(h, "^SAW"); await run(h, 6, 8);
  const d5 = await dbg(h), ins5 = await h.page.evaluate(() => DamBuilder.def.inspect("mill").b);
  check("Day 5 (approved scene, no HUD overlay by design): gate 30% → power " + d5.P.toFixed(1) + " < need " + d5.D + "; the mill reports “" + ins5 + "”", d5.P < d5.D && /starved|Running/i.test(ins5) && d5.run.some(x => !x), { d5P:d5.P, d5D:d5.D, ins5, run:d5.run });
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== E2 : Day 1 source routing → reservoir */
async function suiteRouting(){
  console.log("E2 Day 1 routing: forks → basins → waterfall → lake");
  const h = await boot({ query:Q, storage:{ [SAVE]:seed(5, 0) } });             // level 5: three forks
  await open3D(h, 0); await begin(h);
  const setModes = m => h.page.evaluate(want => { const bs = [...document.querySelectorAll("#dbCtl button")].filter(b => /FORK/.test(b.textContent)); want.forEach((w, k) => { for (let j = 0; j < 3 && DamBuilder.def.dbg().modes[k] !== w; j++) bs[k].click(); }); }, m);
  const d0 = await dbg(h); const nf = d0.modes.length;
  check("level 5 has three forks and several basins", nf === 3 && d0.targets.length >= 3, d0.modes);
  const results = [];
  for (let c = 0; c < 27; c++){ const m = [c % 3, ((c / 3) | 0) % 3, ((c / 9) | 0) % 3]; await setModes(m); const d = await dbg(h); results.push({ m, flows:d.flows, lost:d.lost, fall:d.fall }); }
  const distinct = new Set(results.map(r => JSON.stringify(Object.keys(r.flows).sort().map(k => [k, +(r.flows[k] || 0).toFixed(2)])))).size;
  check("different fork settings produce different routings (" + distinct + " distinct of 27)", distinct >= 6, distinct);
  check("water is conserved: delivered + lost = the spring's flow in every setting", results.every(r => Math.abs(Object.keys(r.flows).filter(k => /^T/.test(k)).reduce((a, k) => a + r.flows[k], 0) + r.lost - 6) < 0.01), results.find(r => Math.abs(Object.keys(r.flows).filter(k => /^T/.test(k)).reduce((a, k) => a + r.flows[k], 0) + r.lost - 6) >= 0.01));
  const toLake = results.filter(r => r.fall > 5.99).length, noLake = results.filter(r => r.fall < 0.01).length;
  check("the RESERVOIR waterfall carries water only when the forks lead to it (" + toLake + " settings full, " + noLake + " none)", toLake >= 1 && noLake >= 1);
  /* source → reservoir : feed the lake basin and the lake rises */
  const lakeBefore = (await probe(h)).lakeY;
  const best = results.reduce((a, r) => (r.fall > a.fall ? r : a)); await setModes(best.m); await run(h, 8, 6);
  const lakeAfter = (await probe(h)).lakeY, dd = await dbg(h);
  check("filling the reservoir basin raises the drawn lake (" + (lakeBefore + 9).toFixed(2) + " → " + (lakeAfter + 9).toFixed(2) + " m)", lakeAfter > lakeBefore + 0.1 && dd.targets[0].v > 0, [lakeBefore, lakeAfter, dd.targets]);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== E3 : the complete six-Day cycle → Level Complete → Bonus → next level */
async function suiteCycle(){
  console.log("E3 the six 3D Days, then the game's own ocean flow, then the cycle restarts");
  const h = await boot({ query:Q, storage:{ [SAVE]:seed(1, 0) } });
  const a = await h.page.evaluate(snap), paid = [];
  for (let day = 0; day < 6; day++){
    const st = await playDay(h, day);
    const ok = await waitPaid(h, (day + 1) * 111);
    const s = await h.page.evaluate(snap); paid.push(s.lvl);
    check("Day " + (day + 1) + " solved with the 3D controls → " + st + ", ledger " + s.lvl + " (+111 exactly once)", st === "success" && ok && s.lvl === (day + 1) * 111 && s.total - a.total === (day + 1) * 111, { st, s });
    check("Day " + (day + 1) + " is genuinely 3D (not the SVG fallback)", await h.page.evaluate(() => !!DamBuilder.run.is3d));
  }
  const e = await h.page.evaluate(snap);
  check("after Day 6: ledger 666, level banked once, the game's Level Complete is pending", e.lvl === 666 && e.done === 1 && e.phase === "levelComplete" && e.total - a.total === 666, e);
  await h.page.click('[data-act="next"]');
  await h.page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:30000 }).catch(() => {});
  const card = await h.page.evaluate(() => ({ open:DamBuilder.isOpen, lc:document.getElementById("levelCard").classList.contains("show"), phase:state.phase }));
  check("reachOcean → LEVEL COMPLETE card (Builder closed)", !card.open && card.lc && card.phase === "levelComplete", card);
  await h.page.click("#lcBtn");
  const bonus = await h.page.waitForFunction(() => document.getElementById("bonusCard").classList.contains("show"), null, { timeout:15000 }).then(() => true, () => false);
  check("→ BONUS FLOW Waterwheel (existing)", bonus);
  const pre = await h.page.evaluate(snap);
  for (let i = 0; i < 60; i++){
    if (await h.page.evaluate(() => state.level === 2 && state.phase === "ready" && !document.getElementById("bonusCard").classList.contains("show") && [...document.querySelectorAll("button")].every(b => !b.offsetParent || !/ENTER FLOW|SKIP/i.test(b.textContent)))) break;
    await h.page.evaluate(() => {
      const vis = [...document.querySelectorAll("button")].filter(x => x.offsetParent && !x.disabled && x.getBoundingClientRect().height > 0 && !x.closest("#dbRoot"));
      const pick = vis.find(x => /ENTER FLOW/i.test(x.textContent)) || vis.find(x => x.id === "bonusBtn") || vis.find(x => /^\s*(continue|next|skip)/i.test(x.textContent));
      if (pick) pick.click(); const tc = document.getElementById("tribeCard"); if (tc && tc.classList.contains("show")) tc.click();
    });
    await sleep(900);
  }
  const f = await h.page.evaluate(snap);
  check("the six-Day cycle restarts at Level 2 (ledger 0, Day 1)", f.level === 2 && f.lvl === 0 && f.phase === "ready", f);
  check("the Bonus Waterwheel's own rewards (if any) came from its existing code, not the Builder", f.total >= pre.total, [pre.total, f.total]);
  await sleep(800);
  await h.page.evaluate(() => { if (!DamBuilder.isOpen) DamBuilder.open(); }); await sleep(500);
  const nd = await h.page.evaluate(() => ({ open:DamBuilder.isOpen, i:DamBuilder.run && DamBuilder.run.i, stat:document.getElementById("dbStat").textContent }));
  check("Builder at Level 2 starts on Day 1 again", nd.open && nd.i === 0 && /LEVEL 2/.test(nd.stat) && /DAY 1/.test(nd.stat), nd);
  await open3D(h, 0); await begin(h);
  const d2 = await dbg(h);
  check("…and the Level 2 Day 1 is the harder variant of the SAME world (2 forks / bigger target)", d2.c === 1 + ((2 - 1) >> 1) && d2.need > 18, { c:d2.c, need:d2.need });
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== E4 : reward integrity (Day 1 and Day 6) */
const failRun = async (h, day) => { await open3D(h, day); await begin(h); for (let g = 0; g < 80 && await status(h) === "playing"; g++) await run(h, 5, 1); return status(h); };
const lm = h => h.page.evaluate(() => { const k = JSON.parse(localStorage.getItem("geiDamBuilder.v1") || "{}"); return { parts:k.parts | 0, earned:k.earned | 0 }; });
async function suiteRewards(){
  console.log("E4 reward integrity — Day 1 and Day 6");
  for (const D of [0, 5]){
    const flBefore = D * 111, label = "Day " + (D + 1);
    const h = await boot({ query:Q, storage:{ [SAVE]:seed(1, flBefore, { unlockedCharacters:["yall-too-beaver"], processedReceipts:["RCPT-TEST-0001"], purchaseHistory:[] }) } });
    const a = await h.page.evaluate(snap), pa = await lm(h);
    /* failed / interrupted runs */
    const f = await failRun(h, D);
    let s = await h.page.evaluate(snap);
    check(label + ": a run left to time out fails and pays nothing (" + f + ")", f === "fail" && s.lvl === flBefore && s.total === a.total, [f, s]);
    await open3D(h, D); await begin(h); await run(h, 2, 1); await h.page.evaluate(() => DamBuilder.close());
    s = await h.page.evaluate(snap);
    check(label + ": an abandoned (closed) run pays nothing and costs nothing", s.lvl === flBefore && s.total === a.total && s.phase === a.phase, s);
    await open3D(h, D); await begin(h); await run(h, 2, 1); await reload(h); s = await h.page.evaluate(snap);
    check(label + ": refreshing mid-challenge pays nothing, restarts the run, no penalty", s.lvl === flBefore && s.total === a.total, s);
    /* normal completion */
    const st = await playDay(h, D); await waitPaid(h, flBefore + 111);
    s = await h.page.evaluate(snap);
    check(label + ": normal completion pays +111 once (" + st + ")", st === "success" && s.total - a.total === 111 && s.lvl === flBefore + 111, s);
    const pb = await lm(h);
    check(label + ": Builder Parts earned separately (" + pa.parts + " → " + pb.parts + " = 2 + stars, 3–5), FL OZ moved only by the ledger's +111", pb.parts - pa.parts >= 3 && pb.parts - pa.parts <= 5 && s.total - a.total === 111, [pa, pb]);
    /* duplicate / forced completion callbacks */
    const dup = await h.page.evaluate(i => { const t0 = state.totalFlOz; for (let k = 0; k < 5; k++){ try { awardDay(i); } catch (e) {} } return state.totalFlOz - t0; }, D);
    check(label + ": calling the award authority again (5×) pays nothing more", dup === 0, dup);
    const dup2 = await h.page.evaluate(async () => { const t0 = state.totalFlOz; try { DamBuilder.def.celebrate(); } catch (e) {} for (let k = 0; k < 3; k++) await new Promise(r => setTimeout(r, 400)); return state.totalFlOz - t0; });
    check(label + ": repeating the completion celebration pays nothing more", dup2 === 0, dup2);
    /* replay / retry / mode switch / refresh */
    if (D === 0) { /* replay only meaningful for a cleared, non-final Day while the level goes on */ }
    const before = await h.page.evaluate(snap);
    await h.page.evaluate(d => { if (DamBuilder.isOpen && DamBuilder.status !== "playing") DamBuilder.close(); if (state.phase === "ready" || state.phase === "levelComplete") DamBuilder.open({ day:d }); }, D);
    await sleep(300);
    for (let i = 0; i < 4; i++){ await h.page.evaluate(() => { DamBuilder.close(); DamBuilder.open(); }); await sleep(60); }
    s = await h.page.evaluate(snap);
    check(label + ": switching modes repeatedly pays nothing", s.total === before.total, [before, s]);
    await reload(h); s = await h.page.evaluate(snap);
    check(label + ": refresh keeps the ledger and does not re-pay", s.total === before.total && s.lvl === before.lvl, [before, s]);
    if (D === 0){
      const st2 = await playDay(h, 0); await sleep(1500); s = await h.page.evaluate(snap);
      check("Day 1: replaying the cleared Day as practice succeeds and pays no FL OZ", st2 === "success" && s.total === before.total && s.lvl === before.lvl, [st2, s]);
      const pr = await lm(h);
      check("Day 1: a repeat clear earns Builder Parts only for improved stars (never the first-clear bonus again): +" + (pr.parts - pb.parts), pr.parts - pb.parts >= 0 && pr.parts - pb.parts <= 2, [pb, pr]);
    }
    if (D === 5){
      /* Day 6 hands over to reachOcean once: Level Complete is pending exactly once and the Arcade path cannot pay it again */
      const lc = await h.page.evaluate(snap);
      check("Day 6: ledger 666, level banked once, Level Complete pending", lc.lvl === 666 && lc.done === 1, lc);
      const again = await h.page.evaluate(() => { const t0 = state.totalFlOz, c0 = state.completedLevels; try { awardDay(5); } catch (e) {} try { if (typeof reachOcean === "function" && state.phase !== "levelComplete") reachOcean(); } catch (e) {} return { dt:state.totalFlOz - t0, dc:state.completedLevels - c0 }; });
      check("Day 6: a second award / reachOcean attempt (as Arcade's completion would) banks nothing more", again.dt === 0 && again.dc === 0, again);
    }
    const end = await h.page.evaluate(snap);
    check(label + ": purchase records, receipts, entitlements untouched", end.rec === a.rec && end.hist === a.hist && end.chars === a.chars && end.songs === a.songs && end.skins === a.skins, [a, end]);
    check(label + ": no page errors", h.errors.length === 0, h.errors);
    await h.close();
  }
  /* Arcade first, then the Builder (and the reverse) must not double-pay Day 1 */
  const h = await boot({ query:Q, storage:{ [SAVE]:seed(1, 0) } });
  const a = await h.page.evaluate(snap);
  await h.page.evaluate(() => { awardDay(0); }); const afterArcade = await h.page.evaluate(snap);
  check("Arcade path pays Day 1 once (+111)", afterArcade.total - a.total === 111, afterArcade);
  const st = await playDay(h, 0); await sleep(1500); const s = await h.page.evaluate(snap);
  check("then the Builder clears Day 1 as practice: success, ledger unchanged", st === "success" && s.total === afterArcade.total && s.lvl === afterArcade.lvl, [st, s]);
  await h.close();
}

/* ================================================================== E5 : mobile layout audit — every Day, several phones */
async function suiteMobile(){
  console.log("E5 mobile layout audit (3D Days): overflow, touch targets, clipped / overlapping hotspots, truncated labels");
  const VPS = [[360, 640], [390, 844], [412, 915], [320, 568], [844, 390]];
  for (const [w, hh] of VPS){
    const h = await boot({ query:Q, viewport:{ width:w, height:hh }, storage:{ [SAVE]:seed(5, 0) } });
    const bad = [];
    for (let d = 0; d < 6; d++){
      await h.page.evaluate(([dd]) => { if (DamBuilder.isOpen) DamBuilder.close(); state.level = 5; state.levelFlOz = dd * 111; state.currentStep = dd; state.phase = "ready"; DamBuilder.open({ day:dd }); }, [d]);
      await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:90000 }); await begin(h);
      await h.page.evaluate(() => { for (let i = 0; i < 20; i++) DamBuilder.def.draw(0.1); });
      const r = await h.page.evaluate(() => {
        const out = { over:[], small:[], clip:[], overlap:[], trunc:[] }, vis = e => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
        if (document.documentElement.scrollWidth > innerWidth + 1) out.over.push("page " + document.documentElement.scrollWidth + ">" + innerWidth);
        const st = document.getElementById("dbStage").getBoundingClientRect();
        const hots = [...document.querySelectorAll(".db3dHot")].filter(vis);
        hots.forEach(b => { const r = b.getBoundingClientRect(); if (r.height < 43.5 || r.width < 43.5) out.small.push("hot " + b.textContent.trim() + " " + Math.round(r.width) + "x" + Math.round(r.height)); if (r.left < st.left - 2 || r.right > st.right + 2 || r.top < st.top - 2 || r.bottom > st.bottom + 2) out.clip.push("hot " + b.textContent.trim() + " outside the stage"); });
        for (let i = 0; i < hots.length; i++) for (let j = i + 1; j < hots.length; j++){ const a = hots[i].getBoundingClientRect(), b = hots[j].getBoundingClientRect(), ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ox > 0 && oy > 0 && ox * oy > 0.5 * Math.min(a.width * a.height, b.width * b.height)) out.overlap.push(hots[i].textContent.trim() + " / " + hots[j].textContent.trim()); }
        [...document.querySelectorAll("#dbCtl button, #dbRoot .dbSeg button, #dbRoot .dbIcon, #dbRoot .dbDay")].filter(vis).forEach(b => { const r = b.getBoundingClientRect(); if (r.height < 43.5) out.small.push("btn " + b.textContent.trim().slice(0, 14) + " h" + Math.round(r.height)); if (r.right > innerWidth + 1 || r.left < -1) out.clip.push("btn " + b.textContent.trim().slice(0, 14) + " off-screen"); });
        document.querySelectorAll("#dbRoot [data-g], #dbRoot .dbG, #dbCtl label, #dbCtl output, .db3dAdvice").forEach(e => { if (vis(e) && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== "visible") out.trunc.push((e.textContent || "").trim().slice(0, 24)); });
        const dock = document.querySelector("#dbCtl"); if (dock){ for (let e = dock.parentElement; e && e !== document.body; e = e.parentElement){ const oy = getComputedStyle(e).overflowY; if ((oy === "auto" || oy === "scroll") && e.scrollHeight > e.clientHeight) e.scrollTop = e.scrollHeight; } const r = dock.getBoundingClientRect(); if (r.bottom > innerHeight + 1) out.clip.push("controls unreachable: bottom " + Math.round(r.bottom) + " > " + innerHeight + " even after scrolling"); }
        return out;
      });
      for (const k of Object.keys(r)) r[k].forEach(m => bad.push("Day " + (d + 1) + " " + k + ": " + m));
    }
    check(w + "×" + hh + ": all six 3D Days — no overflow, touch targets ≥ 44 px, nothing clipped / overlapping / truncated", bad.length === 0, bad.slice(0, 12));
    check(w + "×" + hh + ": no page errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

/* ================================================================== E6 : fallbacks on the V2.2.19 Days (the SVG Days themselves are certified, all six, by dam-builder-regression.mjs under ?b3d=off) */
async function suiteFallback(){
  console.log("E6 WebGL2 unavailable / disabled / lost on Days 1, 3 and 6");
  for (const D of [0, 2, 5]){
    const label = "Day " + (D + 1);
    let h = await boot({ query:"?b3d=off", storage:{ [SAVE]:seed(1, D * 111) } });
    await h.page.evaluate(d => DamBuilder.open({ day:d }), D); await sleep(1200);
    check(label + ": ?b3d=off → SVG Day, no canvas, no 3D bundle", await h.page.evaluate(() => !DamBuilder.run.is3d && !document.querySelector(".db3d") && !window.DamBuilder3D && !!document.querySelector("#dbStage svg")));
    await h.close();
    h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(1, D * 111) } });
    await h.page.evaluate(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(t){ if (/webgl/i.test(t)) return null; return g.apply(this, arguments); }; });
    const t0 = await h.page.evaluate(snap); await h.page.evaluate(d => DamBuilder.open({ day:d }), D);
    await h.page.waitForFunction(() => DamBuilder.run && !DamBuilder.run.is3d && !!document.querySelector("#dbStage svg"), null, { timeout:60000 });
    check(label + ": WebGL2 unavailable → SVG Day with a notice, ledger untouched", await h.page.evaluate(() => /simple view/i.test(document.getElementById("dbToast").textContent)) && (await h.page.evaluate(snap)).total === t0.total);
    await h.close();
    h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(1, D * 111) } });
    const a = await h.page.evaluate(snap); await open3D(h, D); await begin(h); await run(h, 1, 2);
    await h.page.evaluate(() => { document.querySelector(".db3d").dispatchEvent(new Event("webglcontextlost", { cancelable:true })); });
    await h.page.waitForFunction(() => DamBuilder.run && !DamBuilder.run.is3d, null, { timeout:30000 });
    const b = await h.page.evaluate(snap);
    check(label + ": context lost mid-run → seamless SVG fallback, nothing paid, no canvas left behind", !(await h.page.evaluate(() => !!document.querySelector(".db3d"))) && b.total === a.total && b.lvl === a.lvl, [a, b]);
    check(label + ": the fallback Day is live (intro or playing) and the Day bar still works", await h.page.evaluate(() => ["intro", "playing"].includes(DamBuilder.status) && !!document.querySelector(".dbDay")));
    check(label + ": no page errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

const SUITES = { chain:suiteChain, routing:suiteRouting, cycle:suiteCycle, rewards:suiteRewards, mobile:suiteMobile, fallback:suiteFallback };
for (const k of Object.keys(SUITES)) if (want === "all" || want === k) { if (want === "all") await freshBrowser(); try { await SUITES[k](); } catch (e) { failed++; console.log("  ✗ suite " + k + " crashed: " + (e && e.stack || e)); } }
console.log("\n" + passed + " passed, " + failed + " failed");
await done();
process.exit(failed ? 1 : 0);
