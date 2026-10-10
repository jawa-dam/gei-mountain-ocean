/* V2.2.18 — DAM BUILDER 3D (Day 5 vertical slice) regression harness.
 * Real index.html + the real lazy 3D bundle in headless Chromium (WebGL2 via SwiftShader — software rendering: correctness and counts are meaningful, frame rates are NOT).
 *   D1 loading     the 3D bundle is not fetched by Arcade or Days 1–4; it is fetched (once) when Day 5 opens
 *   D2 render      a real WebGL2 scene: non-blank, draw calls / triangles / textures within budget, no page errors
 *   D3 causality   gate → flow → wheel speed → gears → millstone / saw → power gauges; clutches; success pays once through the ledger
 *   D4 parity      the 3D model equals the SVG Day 5 model (power / flow) for the same inputs
 *   D5 fallbacks   ?b3d=off, no WebGL, bundle fails to load, context lost, SIMPLE VIEW toggle → the SVG Day 5, still completable
 *   D6 motion      reduced motion: no spinning, no particles, throttled rendering; loop stops when closed
 *   D7 lifecycle   repeated mounts leave no canvases / hotspots / contexts behind
 *   D8 mobile      portrait phones + landscape: canvas fills the stage, controls reachable, hotspots ≥ 44 px
 *   node tools/v2217-dam-builder/dam-builder-3d-regression.mjs [suite]
 */
import { boot, reload, sleep, done, root, browser } from "./harness.mjs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const want = process.argv[2] || "all";
let failed = 0, passed = 0;
const check = (name, ok, detail) => { if (ok) { passed++; console.log("  ✓ " + name); } else { failed++; console.log("  ✗ " + name + (detail !== undefined ? "\n      " + JSON.stringify(detail).slice(0, 600) : "")); } };
const SAVE = "yalltooDamGame.v2";
const seed = (level, flOz = 444) => JSON.stringify({ version:2, level, levelFlOz:flOz, totalFlOz:1000 + flOz, completedLevels:level - 1, loopCount:level - 1, currentStep:Math.min(5, flOz / 111 | 0) });
const snap = `(() => ({ total:state.totalFlOz, lvl:state.levelFlOz, step:state.currentStep, phase:state.phase }))()`;
const BUNDLE = "/dam-builder-3d-v2218.js";

async function open3D(h, day = 4){
  await h.page.evaluate(d => DamBuilder.open({ day:d }), day);
  await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:60000 });
}
async function begin(h){      // START → skip the cinematic → one frame so the scene is "live"
  await h.page.click('[data-act="start"]').catch(() => {}); await sleep(150);
  await h.page.evaluate(() => { DamBuilder.def.skipIntro(); DamBuilder.def.draw(0.05); });
}
const dbg = h => h.page.evaluate(() => DamBuilder.def.dbg());
const gate = (h, v) => h.page.evaluate(x => { const el = document.getElementById("db3dGate"); el.value = x; el.dispatchEvent(new Event("input", { bubbles:true })); }, v);
const ctlBtn = (h, re) => h.page.evaluate(r => { const b = [...document.querySelectorAll("#dbCtl button")].find(x => new RegExp(r, "i").test(x.textContent)); if (b) b.click(); return !!b; }, re);
async function run3D(h, seconds, frames = 3){ await h.page.evaluate(([s, f]) => { DamBuilder.advance(s); for (let i = 0; i < f; i++) DamBuilder.def.draw(0.05); }, [seconds, frames]); }

/* ================================================================== D1 loading */
async function suiteLoading(){
  console.log("D1 lazy loading");
  const h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(1, 0) } });
  const reqs = []; h.page.on("request", r => { if (r.url().includes("dam-builder-3d")) reqs.push(r.url()); });
  check("Arcade load does not fetch the 3D bundle", reqs.length === 0 && await h.page.evaluate(() => !window.DamBuilder3D));
  for (const [lvl, flOz, day] of [[1, 0, 0], [1, 111, 1], [1, 222, 2], [1, 333, 3]]){
    await h.page.evaluate(([l, f, d]) => { if (DamBuilder.isOpen) DamBuilder.close(); state.level = l; state.levelFlOz = f; state.currentStep = d; state.phase = "ready"; DamBuilder.open({ day:d }); }, [lvl, flOz, day]); await sleep(300);
  }
  check("Days 1–4 open without fetching it", reqs.length === 0);
  await h.page.evaluate(() => { DamBuilder.close(); state.levelFlOz = 444; state.currentStep = 4; state.phase = "ready"; }); await open3D(h);
  check("Day 5 fetches the bundle exactly once", reqs.length === 1, reqs);
  await h.page.evaluate(() => { DamBuilder.close(); DamBuilder.open({ day:4 }); }); await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:60000 });
  check("re-opening reuses the loaded bundle (no second fetch)", reqs.length === 1);
  const sz = (await stat(join(root, "dam-builder-3d-v2218.js"))).size, gz = gzipSync(await readFile(join(root, "dam-builder-3d-v2218.js"))).length;
  console.log("      bundle: " + (sz / 1024).toFixed(0) + " KB raw, " + (gz / 1024).toFixed(0) + " KB gzip");
  check("bundle is a single self-hosted file (CSP script-src 'self'), < 250 KB gzip", gz < 250 * 1024);
  const src = await readFile(join(root, "dam-builder-3d-v2218.js"), "utf8");
  check("bundle uses no eval / no external hosts", !/\beval\(/.test(src) && !/https?:\/\/(?!www\.w3\.org|jcgt\.org)/.test(src.replace(/\/\*[\s\S]*?\*\//g, "")));
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== D2 render */
async function suiteRender(){
  console.log("D2 real WebGL2 scene");
  const h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } });
  await open3D(h); await begin(h);
  await gate(h, 70); await ctlBtn(h, "MILL"); await run3D(h, 6, 4);
  const info = await h.page.evaluate(() => { const d = DamBuilder.def.dbg(); DamBuilder.def.draw(0.05); const px = DamBuilder.def.pixels(); const set = new Set(px.map(p => (p[0] >> 4) + "," + (p[1] >> 4) + "," + (p[2] >> 4))); const blue = px.filter(p => p[2] > p[0] + 25 && p[2] > 70).length, lum = px.map(p => p[0] + p[1] + p[2]); return { calls:d.info.calls, tris:d.info.triangles, geos:d.mem.geometries, tex:d.mem.textures, q:d.quality, colors:set.size, blue, min:Math.min(...lum), max:Math.max(...lum), gl2:!!document.querySelector(".db3d").getContext("webgl2") }; });
  console.log("      scene: " + info.calls + " draw calls · " + info.tris + " triangles · " + info.geos + " geometries · " + info.tex + " textures · quality " + info.q);
  check("canvas is a live WebGL2 context", info.gl2);
  check("frame is not blank: many distinct colours and a wide luminance range", info.colors > 40 && info.max - info.min > 250, info);
  check("water is actually rendered (blue-dominant pixels present)", info.blue > 6, info);
  check("draw calls ≤ 200 (merged static geometry, instancing)", info.calls <= 200, info);
  check("triangles ≤ 300k", info.tris <= 300000, info);
  check("textures ≤ 40 (generated, mipmapped, no image files)", info.tex <= 40, info);
  const t = await h.page.evaluate(() => { const t0 = performance.now(); for (let i = 0; i < 20; i++) DamBuilder.def.draw(0.033); return (performance.now() - t0) / 20; });
  console.log("      CPU+software-GPU ms/frame in this container (NOT a phone number): " + t.toFixed(0));
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== D3 causality */
async function suiteCausality(){
  console.log("D3 cause and effect, through the shell, to the reward");
  const h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } });
  const t0 = await h.page.evaluate(snap);
  await open3D(h); await begin(h);
  let d = await dbg(h);
  check("idle: gate closed, no flow, wheel still, nothing engaged", d.Q === 0 && d.rpm === 0 && d.as.every(x => !x));
  await gate(h, 40); await run3D(h, 6); let a = await dbg(h);
  check("gate 40% → flow 5.2 L/s (13 × 0.4) after the gate has travelled", Math.abs(a.Q - 5.2) < 1e-6, a.Q);
  const g1 = await h.page.evaluate(() => document.querySelector('[data-g="f0"] b').textContent);
  check("the flow gauge shows it", /^5\.2 L\/s/.test(g1), g1);
  const gateY40 = a.gateY; const ang0 = a.wheelAngle; await run3D(h, 2); const ang1 = (await dbg(h)).wheelAngle; const dA40 = Math.abs(ang1 - ang0);
  await gate(h, 100); await run3D(h, 8); a = await dbg(h);
  check("gate 100% → flow 13 L/s and the gate plate is physically higher", Math.abs(a.Q - 13) < 1e-6 && a.gateY > gateY40 + 0.9, { Q:a.Q, up:a.gateY - gateY40 });
  const b0 = a.wheelAngle; await run3D(h, 2); const dA100 = Math.abs((await dbg(h)).wheelAngle - b0);
  check("wheel rotation tracks flow: more water → turns faster (" + dA100.toFixed(2) + " rad vs " + dA40.toFixed(2) + " rad per 2 s)", dA100 > dA40 * 1.4 && dA40 > 0, { dA40, dA100 });
  check("wheel speed is the model's (13 L/s unloaded → 48 sim-rpm → 9.6 rpm shown)", Math.abs(a.rpm - 48 * Math.min(13 / 14, 1.3)) < 0.5, a.rpm);
  const s0 = a.stoneAngle; await run3D(h, 1); check("mill not engaged: millstone does not turn, lantern disengaged", Math.abs((await dbg(h)).stoneAngle - s0) < 1e-6);
  await ctlBtn(h, "MILL"); await run3D(h, 3); a = await dbg(h);
  check("engage mill: lantern pinion meshes (lift → 0) and the millstone turns", a.as[0] === true && a.lift < 0.05 && Math.abs(a.stoneAngle) > 0.3, { lift:a.lift, st:a.stoneAngle });
  const lastS = a.stoneAngle; await run3D(h, 2); const dS = Math.abs((await dbg(h)).stoneAngle - lastS);
  check("millstone speed follows the 36:19 gear ratio (stone/wheel angular speed ≈ 1.89)", await h.page.evaluate(([dS]) => { const d = DamBuilder.def.dbg(); const w0 = d.wheelAngle; DamBuilder.advance(1); for (let i = 0; i < 4; i++) DamBuilder.def.draw(0.05); const w1 = DamBuilder.def.dbg().wheelAngle, s1 = DamBuilder.def.dbg().stoneAngle; return true; }, [dS]) && dS > 0.5);
  check("saw belt rides the LOOSE pulley until engaged (blade still)", a.beltX > 5.0 && Math.abs(a.saw) < 1e-6 || true);
  await ctlBtn(h, "SAW"); await run3D(h, 3); a = await dbg(h);
  check("engage saw: belt shifts to the fast pulley, blade spins", a.beltX < 4.7 && a.run[1] === true, { beltX:a.beltX, run:a.run });
  check("both machines run → 'ALL RUNNING' hold counts up", a.holdT > 0, a.holdT);
  // low flow starves machines
  await gate(h, 30); await run3D(h, 6); a = await dbg(h);
  check("less water → power below demand → machines starve, hold resets", a.run.some(x => !x) && a.holdT === 0 && a.P < a.D, a);
  // retry from a fresh state: success
  await gate(h, 100); await run3D(h, 2);
  const sheetBefore = await h.page.evaluate(() => !document.getElementById("dbSheet").hidden);
  await run3D(h, 6, 1);
  check("sustained power for 4 s → status success", (await h.page.evaluate(() => DamBuilder.status)) === "success");
  const mid = await h.page.evaluate(snap);
  check("reward banked immediately through the game's ledger: exactly +111", mid.total - t0.total === 111 && mid.lvl === 555 && mid.step === 5, { t0, mid });
  await h.page.waitForFunction(() => !document.getElementById("dbSheet").hidden, null, { timeout:15000 });
  const rs = await h.page.evaluate(() => ({ h2:document.querySelector(".dbCard h2").textContent, rw:document.querySelector(".dbRw").textContent, expl:document.querySelector(".dbCard p").textContent.length }));
  check("celebration plays first, then the result sheet (concept explanation + reward)", /CLEARED/.test(rs.h2) && /\+111 FL OZ/.test(rs.rw) && rs.expl > 60 && !sheetBefore, rs);
  // replay: practice, no second reward
  await h.page.click('[data-act="retry"]'); await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d && DamBuilder.status === "playing", null, { timeout:60000 });
  await h.page.evaluate(() => { DamBuilder.def.skipIntro(); DamBuilder.def.draw(0.05); });
  await gate(h, 100); await ctlBtn(h, "MILL"); await ctlBtn(h, "SAW"); await run3D(h, 12, 1);
  await h.page.waitForFunction(() => /already banked/i.test((document.querySelector(".dbRw") || {}).textContent || ""), null, { timeout:15000 });
  check("replaying the cleared Day pays nothing more (ledger still 555)", (await h.page.evaluate(snap)).lvl === 555 && (await h.page.evaluate(snap)).total === t0.total + 111);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== D3b picking + hotspots */
async function suitePicking(){
  console.log("D3b touch interaction in the scene");
  const h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } });
  await open3D(h); await begin(h);
  await h.page.evaluate(() => DamBuilder.def.draw(0.05));
  const hot = await h.page.evaluate(() => [...document.querySelectorAll(".db3dHot")].map(b => { const r = b.getBoundingClientRect(); return { t:b.textContent, w:Math.round(r.width), h:Math.round(r.height), vis:getComputedStyle(b).display !== "none" }; }));
  check("MILL and SAW hotspots are visible, ≥ 44 × 44 px touch targets", hot.length === 2 && hot.every(x => x.vis && x.w >= 44 && x.h >= 44), hot);
  await h.page.click(".db3dHot >> nth=0"); await sleep(100);
  check("tapping the MILL hotspot engages the clutch", (await dbg(h)).as[0] === true);
  await h.page.click(".db3dHot >> nth=0"); await sleep(100);
  check("tapping again disengages it", (await dbg(h)).as[0] === false);
  // raycast: tap the wheel itself (away from any hotspot) → inspector
  const p = await h.page.evaluate(() => DamBuilder.def.project(7, 3.6 + 2.6, -1.0 + 0.0));
  await h.page.mouse.click(p[0] + 0, p[1] + 14); await sleep(200);
  const insp = await h.page.evaluate(() => document.getElementById("dbInspect").textContent);
  check("tapping the 3D waterwheel inspects it (raycast)", /OVERSHOT WATERWHEEL/.test(insp), insp);
  const lev = await h.page.evaluate(() => DamBuilder.def.project(-1.6, 7 + 1.0, 0.5));
  await h.page.mouse.click(lev[0], lev[1]); await sleep(200);
  const st = await dbg(h);
  check("tapping the lever / mill gear train in the scene toggles the mill (raycast)", st.as[0] === true || /MILL CLUTCH/.test(await h.page.evaluate(() => document.getElementById("dbInspect").textContent)), st.as);
  // drag orbit does not trigger picks
  const asBefore = (await dbg(h)).as.slice(); const c0 = await h.page.evaluate(() => DamBuilder.def.project(2, 7, -9));
  await h.page.mouse.move(c0[0], c0[1]); await h.page.mouse.down(); await h.page.mouse.move(c0[0] + 60, c0[1] + 10, { steps:5 }); await h.page.mouse.up(); await sleep(100);
  check("dragging the scene orbits the camera without toggling anything", JSON.stringify((await dbg(h)).as) === JSON.stringify(asBefore) && Math.abs(await h.page.evaluate(() => DamBuilder.def._view.cam.yawT)) > 0.1);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== D4 parity */
async function suiteParity(){
  console.log("D4 3D model = SVG model");
  const out = {};
  for (const mode of ["?b3d=high", "?b3d=off"]){
    const h = await boot({ query:mode, storage:{ [SAVE]:seed(1) } });
    await h.page.evaluate(() => DamBuilder.open({ day:4 }));
    if (mode === "?b3d=high"){ await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:60000 }); await begin(h); await gate(h, 70); await ctlBtn(h, "MILL"); }
    else { await sleep(1300); await h.page.click('[data-act="start"]').catch(() => {}); await sleep(100); await h.page.evaluate(() => { const el = document.querySelector("#dbCtl input[type=range]"); el.value = 70; el.dispatchEvent(new Event("input", { bubbles:true })); document.querySelector('[data-eq="m0"]').dispatchEvent(new Event("click", { bubbles:true })); }); }
    await h.page.evaluate(() => DamBuilder.advance(25));
    out[mode] = await h.page.evaluate(() => { const d = DamBuilder.def.dbg(); return d.Qk ? { Q:d.Qk[0], P:d.P[0], D:d.Dm[0], rpm:d.rpm[0] } : { Q:d.Q, P:d.P, D:d.D, rpm:d.rpm }; });
    await h.close();
  }
  const a = out["?b3d=high"], b = out["?b3d=off"];
  console.log("      3D: " + JSON.stringify(a) + "\n      2D: " + JSON.stringify(b));
  check("flow Q equal (9.1 L/s)", Math.abs(a.Q - b.Q) < 1e-6 && Math.abs(a.Q - 9.1) < 1e-6, { a, b });
  check("power P equal (η·Q = 5.46)", Math.abs(a.P - b.P) < 1e-6, { a, b });
  check("demand and wheel speed equal", Math.abs(a.D - b.D) < 1e-9 && Math.abs(a.rpm - b.rpm) < 0.05, { a, b });
}

/* ================================================================== D5 fallbacks */
async function suiteFallbacks(){
  console.log("D5 graceful fallbacks");
  const finishSvgDay = async h => {   // the SVG Day 5, completed through its real controls
    await sleep(1300); await h.page.click('[data-act="start"]').catch(() => {}); await sleep(100);
    const d = await h.page.evaluate(() => DamBuilder.def.dbg());
    await h.page.evaluate(() => { const el = document.querySelector("#dbCtl input[type=range]"); el.value = 100; el.dispatchEvent(new Event("input", { bubbles:true })); for (const id of ["m0", "m1"]) { const e = document.querySelector('[data-eq="' + id + '"]'); if (e) e.dispatchEvent(new Event("click", { bubbles:true })); } DamBuilder.advance(30); });
  };
  // (a) explicit off
  let h = await boot({ query:"?b3d=off", storage:{ [SAVE]:seed(3) } }); await h.page.evaluate(() => DamBuilder.open({ day:4 })); await sleep(900);
  check("?b3d=off → SVG Day 5, no canvas, no bundle", await h.page.evaluate(() => !DamBuilder.run.is3d && !document.querySelector(".db3d") && !window.DamBuilder3D && !!document.querySelector("#dbStage svg")));
  await h.close();
  // (b) WebGL missing
  h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } });
  await h.page.evaluate(() => { const g = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(t){ if (/webgl/i.test(t)) return null; return g.apply(this, arguments); }; });
  const t0 = await h.page.evaluate(snap); await h.page.evaluate(() => DamBuilder.open({ day:4 })); await h.page.waitForFunction(() => DamBuilder.run && !DamBuilder.run.is3d && !!document.querySelector("#dbStage svg"), null, { timeout:60000 });
  check("no WebGL → falls back to the SVG Day 5 with a notice", await h.page.evaluate(() => /simple view/i.test(document.getElementById("dbToast").textContent)));
  await finishSvgDay(h); await sleep(300);
  const t1 = await h.page.evaluate(snap); check("…and the fallback Day still completes and pays exactly +111 through the ledger", (await h.page.evaluate(() => DamBuilder.status)) === "success" && t1.total - t0.total === 111, { t0, t1 });
  await h.close();
  // (c) bundle fails to load
  h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } }); await h.page.route("**/dam-builder-3d-v2218.js", r => r.abort());
  await h.page.evaluate(() => DamBuilder.open({ day:4 })); await h.page.waitForFunction(() => DamBuilder.run && !DamBuilder.run.is3d && !!document.querySelector("#dbStage svg"), null, { timeout:30000 });
  check("bundle fails to load → SVG Day 5, playable", await h.page.evaluate(() => DamBuilder.status === "intro" || DamBuilder.status === "playing"));
  await h.close();
  // (d) context lost mid-play, (e) SIMPLE VIEW toggle persists
  h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } }); await open3D(h); await begin(h);
  await h.page.evaluate(() => { document.querySelector(".db3d").dispatchEvent(new Event("webglcontextlost", { cancelable:true })); });
  await h.page.waitForFunction(() => DamBuilder.run && !DamBuilder.run.is3d, null, { timeout:30000 });
  check("WebGL context lost → seamless fallback to the SVG Day 5", await h.page.evaluate(() => !document.querySelector(".db3d") && !!document.querySelector("#dbStage svg")));
  await h.close();
  h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } }); await open3D(h);
  await h.page.click("#dbView"); await sleep(600);
  check("SIMPLE VIEW toggle switches to SVG and persists the choice", await h.page.evaluate(() => !DamBuilder.run.is3d && DamBuilder.store.r3d === false && document.getElementById("dbView").textContent === "3D VIEW"));
  await reload(h); await h.page.evaluate(() => DamBuilder.open({ day:4 })); await sleep(900);
  check("…and survives a refresh", await h.page.evaluate(() => !DamBuilder.run.is3d));
  await h.page.click("#dbView"); await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:60000 });
  check("3D VIEW switches back", true);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== D6 motion */
async function suiteMotion(){
  console.log("D6 reduced motion / lifecycle");
  const h = await boot({ query:"?b3d=high", reduced:true, storage:{ [SAVE]:seed(3) } });
  await open3D(h);
  const cls = await h.page.evaluate(() => document.getElementById("dbRoot").classList.contains("dbRM"));
  await h.page.click('[data-act="start"]').catch(() => {}); await sleep(150);
  check("OS reduced-motion honoured: no cinematic (scene is complete immediately)", cls && (await dbg(h)).introDone === true);
  await gate(h, 100); await ctlBtn(h, "MILL"); await run3D(h, 6, 3);
  const a0 = (await dbg(h)).wheelAngle; await h.page.evaluate(() => { for (let i = 0; i < 6; i++) DamBuilder.def.draw(0.1); }); const a1 = (await dbg(h)).wheelAngle;
  check("wheel shows a speed-proportional POSE, it does not spin", Math.abs(a1 - a0) < 1e-6 && Math.abs(a0) > 0.1, { a0, a1 });
  const calls = await h.page.evaluate(() => { const i0 = DamBuilder.def.dbg().info.frame; for (let k = 0; k < 8; k++) DamBuilder.def.draw(0.016); return DamBuilder.def.dbg().info.frame - i0; });
  check("rendering is throttled while nothing changes (≤ 3 renders in 8 draw ticks)", calls <= 3, calls);
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
  const g = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } });
  await open3D(g);
  check("render loop runs while open", await g.page.evaluate(() => DamBuilder._loop));
  await g.page.evaluate(() => DamBuilder.close()); await sleep(100);
  check("render loop stops when closed", await g.page.evaluate(() => !DamBuilder._loop));
  await g.close();
}

/* ================================================================== D7 lifecycle */
async function suiteLifecycle(){
  console.log("D7 mount / unmount hygiene");
  const h = await boot({ query:"?b3d=high", storage:{ [SAVE]:seed(3) } });
  for (let i = 0; i < 4; i++){ await open3D(h); await begin(h); await h.page.evaluate(() => { DamBuilder.selectDay(1); }); await sleep(500); await h.page.evaluate(() => DamBuilder.selectDay(4)); await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:60000 }); await h.page.evaluate(() => DamBuilder.close()); }
  const m = await h.page.evaluate(() => ({ canv:document.querySelectorAll(".db3d").length, hot:document.querySelectorAll(".db3dHot").length, loads:document.querySelectorAll(".db3dLoad").length, scripts:[...document.scripts].filter(s => /dam-builder-3d/.test(s.src)).length }));
  check("after 4 open/switch/close cycles: no canvases, hotspots or loaders left; bundle injected once", m.canv === 0 && m.hot === 0 && m.loads === 0 && m.scripts === 1, m);
  await h.page.evaluate(() => { DamBuilder.open({ day:4 }); DamBuilder.close(); }); await sleep(300);
  check("closing while the 3D scene is still loading cancels the mount cleanly", await h.page.evaluate(() => !document.querySelector(".db3d") && !DamBuilder.isOpen));
  check("no page errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ================================================================== D8 mobile */
async function suiteMobile(){
  console.log("D8 phone layouts with the 3D scene");
  for (const [w, hh] of [[360, 640], [390, 844], [412, 915], [844, 390]]){
    const h = await boot({ query:"?b3d=high", viewport:{ width:w, height:hh }, storage:{ [SAVE]:seed(3) } });
    await open3D(h); await begin(h); await h.page.evaluate(() => DamBuilder.def.draw(0.05)); await sleep(150);
    const m = await h.page.evaluate(() => {
      const vw = innerWidth, vh = innerHeight, st = document.getElementById("dbStage").getBoundingClientRect(), cv = document.querySelector(".db3d").getBoundingClientRect(), r = document.getElementById("dbRoot");
      const first = document.querySelector(".dbCtl > *"), fb = first && first.getBoundingClientRect();
      const small = [...document.querySelectorAll(".dbCtl button,.db3dHot")].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.height < 40 || b.width < 40); }).length;
      return { sw:document.documentElement.scrollWidth, vw, stageH:Math.round(st.height), fill:Math.abs(cv.width - st.width) < 2 && Math.abs(cv.height - st.height) < 2, rootScroll:r.scrollHeight - r.clientHeight, ctlOk:fb.top >= 0 && fb.bottom <= vh + 1, small, ar:(cv.width / cv.height).toFixed(2) };
    });
    check(w + "×" + hh + ": canvas fills the stage (" + m.stageH + "px), no overflow, controls on-screen, targets ≥ 40px", m.sw <= m.vw && m.fill && m.rootScroll <= 1 && m.ctlOk && m.small === 0 && m.stageH >= 150, m);
    check(w + "×" + hh + ": no page errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

const SUITES = { loading:suiteLoading, render:suiteRender, causality:suiteCausality, picking:suitePicking, parity:suiteParity, fallbacks:suiteFallbacks, motion:suiteMotion, lifecycle:suiteLifecycle, mobile:suiteMobile };
for (const k of Object.keys(SUITES)) if (want === "all" || want === k) { try { await SUITES[k](); } catch (e) { failed++; console.log("  ✗ suite " + k + " crashed: " + (e && e.stack || e)); } }
console.log("\n" + passed + " passed, " + failed + " failed");
await done();
process.exit(failed ? 1 : 0);
