/* V2.1.89 — QUIET TAP + UTILITY DOCK regression harness
 *
 * Loads the real index.html in headless Chromium (desktop + phone emulation), drives real
 * taps, and checks the V2.1.89 test list:
 *   1  20 rapid taps              6  DAM MAP always clickable (and opens the map)
 *   2  no repeated big text cards 7  BUY-ites / DAM MAP / SONG VAULT vertical dock
 *   3  every tap has water fx     8  fullscreen still works
 *   4  occasional micro moment    9  gameplay state identical to the pre-V2.1.89 code
 *   5  one visible moment         10 mobile viewport
 *
 *   node tools/v2-quiet-tap/quiet-tap-regression.mjs
 *
 * Test 9 replays the same taps against BASE_REF (default: the V2.1.88 merge, b2e7691) by
 * serving that revision's files, and compares economy/progression state + saved storage.
 * Offline: every non-local request is blocked. Exits non-zero if any check fails.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync, execFileSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const BASE_REF = process.env.BASE_REF || "b2e7691";

async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = [];
  try { roots.push(execSync("npm root -g", { encoding:"utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){
    try { return createRequire(join(r, "noop.js"))("playwright"); } catch {}
    try { return createRequire(join(r, "noop.js"))("playwright-core"); } catch {}
  }
  console.error("Playwright is not installed. Run: npm i -D playwright");
  process.exit(2);
}

const TYPES = { ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
function gitShow(ref, p){
  try { return execFileSync("git", ["show", ref + ":" + p.replace(/^\//, "")], { cwd:root, maxBuffer:64 << 20 }); } catch { return null; }
}
function serve(ref){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (p === "/") p = "/index.html";
        let body;
        if (ref) { body = gitShow(ref, p); if (!body) throw 0; }
        else {
          const f = resolve(root, "." + p);
          if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
          await stat(f); body = await readFile(f);
        }
        res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
        res.end(body);
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

const results = [];
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* Scripts that failed to parse before V2.1.89 and are intentionally left alone. */
const KNOWN_BROKEN = 4;

async function openGame(browser, base, device){
  const ctx = await browser.newContext(device || { viewport:{ width:1280, height:800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  await page.addInitScript(() => { Math.random = (() => { let s = 1234567; return () => (s = (s * 16807) % 2147483647) / 2147483647; })(); });
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(700);
  const touch = !!(device && device.hasTouch);
  const tapAt = (x, y) => touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y);
  const vp = page.viewportSize();
  await tapAt(vp.width / 2, vp.height / 2);
  await sleep(300);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(3400);
  await page.evaluate(() => { try { closeGameGuide(); } catch (e) {} try { window.__GEI_BEAVER_WELCOME__ && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });   // V2.1.90: Begin never writes storage
  await sleep(700);
  return { ctx, page, errors, tapAt };
}

/* Samples every 40 ms: visible text overlays, chatter, dock hit-test, water fx per tap. */
const SAMPLER = () => {
  const CHATTER = ["tl2174Combo","tl2175MomentumBadge","tl2176Chain","tl2179SoundBadge","tl2180AtmosBadge","tl2181Status","tl2182CharacterSync","tl2182CharacterImpression"];
  const TEXT = ["labelToast","dayReward","damItePersonalityLayer","damIteComboFlash","geiSignatureMoment","celebCard","tribeCard","tl2177Milestone","tl2178Reward","tl2183SceneCard","tl2185IntroBadge"].concat(CHATTER);
  const vis = el => { if (!el || !el.isConnected) return false; const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") return false;
    let o = 1, n = el; while (n && n !== document.body){ o *= parseFloat(getComputedStyle(n).opacity || "1"); n = n.parentElement; } if (o < .2) return false;
    const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
  const Q = window.__qt = { maxSim:0, sims:[], chatterSeen:{}, textSeen:{}, runs:{}, mapBlocked:0, mapSamples:0, taps:[], fx:[] };
  /* V2.2.10: the old small combo flash is hidden; the Flow Moment Engine's big combo words (.fmeCo, one at a time, throttled) are now the micro moment. */
  Q.flow = { count:0, maxMs:0 };
  new MutationObserver(l => l.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")){ Q.flow.count++; Q.flow.maxMs = Math.max(Q.flow.maxMs, parseFloat(n.style.getPropertyValue("--d")) || 0); } }))).observe(document.body, { childList:true, subtree:true });
  const layer = document.getElementById("tapWaterLayer");
  new MutationObserver(l => { const t = performance.now(); l.forEach(m => { if (m.addedNodes.length) Q.fx.push(t); }); }).observe(layer, { childList:true, subtree:true });
  document.addEventListener("pointerdown", e => { if (e.target.closest && e.target.closest("#world")) Q.taps.push(performance.now()); }, true);
  Q.iv = setInterval(() => {
    const on = TEXT.filter(id => vis(document.getElementById(id)));
    on.forEach(id => { Q.textSeen[id] = (Q.textSeen[id] || 0) + 1; if (CHATTER.includes(id)) Q.chatterSeen[id] = (Q.chatterSeen[id] || 0) + 1;
      const r = Q.runs[id] = Q.runs[id] || { cur:0, max:0, count:0 }; if (!r.cur) r.count++; r.cur += 40; r.max = Math.max(r.max, r.cur); });
    TEXT.filter(id => !on.includes(id)).forEach(id => { if (Q.runs[id]) Q.runs[id].cur = 0; });
    if (on.length > Q.maxSim){ Q.maxSim = on.length; Q.sims.push(on); }
    if (vis(document.getElementById("levelCard"))){ Q.levelSamples = (Q.levelSamples || 0) + 1; if (on.length){ Q.levelOverlap = (Q.levelOverlap || 0) + 1; Q.levelOverlapWith = on; } }
    const dock = window.__GEI_V2189_UTILITY_DOCK__;
    const dirApi = window.__GEI_TAP_LITES_MOMENT_DIRECTOR__;
    if (dock && !(dirApi && dirApi.modalOpen() && dirApi.modalOpen() !== "sidePanel")){
      Q.mapSamples++; const h = dock.hitTest()[1]; if (!h.ok) Q.mapBlocked++;
    }
  }, 40);
};
const SAMPLE_READ = () => { const Q = window.__qt; clearInterval(Q.iv);
  const tapsWithFx = Q.taps.filter(t => Q.fx.some(f => f >= t - 5 && f <= t + 260)).length;
  return { flow:Q.flow, levelSamples:Q.levelSamples || 0, levelOverlap:Q.levelOverlap || 0, levelOverlapWith:Q.levelOverlapWith || null, maxSim:Q.maxSim, sims:Q.sims.slice(-3), chatterSeen:Q.chatterSeen, textSeen:Q.textSeen, runs:Q.runs, mapBlocked:Q.mapBlocked, mapSamples:Q.mapSamples, taps:Q.taps.length, tapsWithFx }; };

const SNAP = () => {
  /* `state` is a top-level let in index.html: reachable by name, not as window.state. */
  // eslint-disable-next-line no-undef
  const s = (typeof state !== "undefined" && state) || window.state || {};
  const pick = {}; ["totalFlOz","level","levelFlOz","completedLevels","currentStep","tapCount","phase","millStage","damMachineFreePlays","xp","totalXp","unlocked","owned","characters","activeCharacter","songs"].forEach(k => { if (k in s) pick[k] = s[k]; });
  const ls = {}; for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i);
    if (/dam(Music|Moment|MapSound)|tl21|gei2189|soundtrack|atmos|skin|mood|scene|intro|splash|bird/i.test(k)) continue;   // presentation-only keys
    ls[k] = localStorage.getItem(k); }
  return { state:pick, storage:ls };
};

async function worldPoint(page){
  return page.evaluate(() => { const r = document.getElementById("world").getBoundingClientRect(); return { x:r.left + r.width * .45, y:r.top + r.height * .55 }; });
}

async function rapidTaps(g, n, gap){
  const p = await worldPoint(g.page);
  for (let i = 0; i < n; i++){ await g.tapAt(p.x + (i % 3) * 6, p.y + (i % 2) * 5); await sleep(gap); }
}

async function desktopSuite(browser, base){
  const g = await openGame(browser, base);
  const { page } = g;
  await page.evaluate(SAMPLER);
  /* 1 — 20 rapid taps */
  await rapidTaps(g, 20, 95);
  await sleep(1200);
  const s = await page.evaluate(SAMPLE_READ);
  const dir = await page.evaluate(() => window.__GEI_TAP_LITES_MOMENT_DIRECTOR__.selfTest());
  check("1. 20 rapid taps were delivered to the world", s.taps >= 20, { taps:s.taps });
  /* 2 — no repeated large text cards from tapping */
  const tapDriven = ["labelToast","damItePersonalityLayer"].filter(id => s.textSeen[id]);
  check("2. no tap-driven text cards (toast / personality / chatter badges)", !tapDriven.length && !Object.keys(s.chatterSeen).length, { tapDriven, chatter:s.chatterSeen, seen:s.textSeen });
  check("2b. only event-driven day card may be large", Object.keys(s.textSeen).every(id => ["damIteComboFlash","geiSignatureMoment","celebCard"].includes(id)), s.textSeen);
  /* 3 — every tap still has hydraulic water feedback */
  check("3. every tap produced hydraulic water feedback", s.tapsWithFx === s.taps, { taps:s.taps, withFx:s.tapsWithFx });
  /* 5 — one visible moment */
  check("5. never more than one visible moment", s.maxSim <= 1 && dir.maxVisibleObserved <= 1, { maxSim:s.maxSim, sims:s.sims, director:dir.maxVisibleObserved });
  /* 6 — DAM MAP clickable during all sampled play */
  check("6a. DAM MAP hit-test passed on every sample during taps", s.mapSamples > 20 && s.mapBlocked === 0, { samples:s.mapSamples, blocked:s.mapBlocked });

  /* 4 — rapid tapping can still create an occasional short micro moment */
  await page.evaluate(SAMPLER);
  await rapidTaps(g, 44, 85);
  await sleep(1300);
  const s4 = await page.evaluate(SAMPLE_READ);
  const micro = ["damIteComboFlash","geiSignatureMoment"].map(id => s4.runs[id]).filter(Boolean);
  const microCount = micro.reduce((a, r) => a + r.count, 0) + (s4.flow ? s4.flow.count : 0), microMax = Math.max(0, ...micro.map(r => r.max));
  check("4. rapid tapping creates an occasional micro moment", microCount >= 1 && microCount <= 8, { microCount, runs:s4.runs });
  check("4b. micro moments stay short (≤ ~900 ms; Flow Moment words ≤ 1.8 s)", microMax <= 1000 && (!s4.flow || s4.flow.maxMs <= 1800), { microMaxMs:microMax, flow:s4.flow });
  check("5b. one visible moment during a long rapid burst", s4.maxSim <= 1, { maxSim:s4.maxSim, sims:s4.sims });

  /* 5c — forced stress: several systems ask for the screen at once */
  const stress = await page.evaluate(async () => {
    const w = ms => new Promise(r => setTimeout(r, ms));
    try { showToast("🎰 A free DAM MACHINE spin is ready!", 3000); } catch (e) {}
    try { triggerDamItePersonality("machine", {}); } catch (e) {}
    try { const f = document.getElementById("damIteComboFlash"); if (f){ f.classList.add("show"); } } catch (e) {}
    const d = window.__GEI_TAP_LITES_MOMENT_DIRECTOR__;
    /* Allowed = raised by its system and not hushed (independent of CSS fade timing);
       visible is re-sampled across the 0.25 s fade-in. */
    const allowed = () => d.surfaces.map(x => document.getElementById(x.id)).filter(e => e && e.classList.contains("show") && !e.classList.contains("gei2189Hush")).map(e => e.id);
    const out = { allowedMax:0, visibleMax:0, visibleEver:0, samples:[] };
    for (let i = 0; i < 12; i++){
      await w(60);
      const a = allowed(), v = d.visibleMoments();
      out.allowedMax = Math.max(out.allowedMax, a.length); out.visibleMax = Math.max(out.visibleMax, v.length);
      if (v.length) out.visibleEver++;
      if (i % 4 === 0) out.samples.push({ allowed:a, visible:v });
    }
    out.owner = d.owner();
    try { document.getElementById("damIteComboFlash").classList.remove("show"); } catch (e) {}
    return out;
  });
  check("5c. simultaneous requests → exactly one allowed and visible owner", stress.allowedMax === 1 && stress.visibleMax === 1 && stress.visibleEver > 0, stress);

  /* 7 — vertical dock */
  const dock = await page.evaluate(() => window.__GEI_V2189_UTILITY_DOCK__.selfTest());
  check("7. BUY-ites / DAM MAP / SONG VAULT form one vertical dock (map in the middle)", dock.orderOk && dock.verticalStack && dock.duplicateHudMapHidden, dock);
  check("6b. all dock buttons receive taps", dock.allClickable, dock.clickable);
  /* 6c — map opens and closes, state untouched */
  const before = await page.evaluate(SNAP);
  await page.click("#damMapLauncherBtn");
  await sleep(350);
  const mapOpen = await page.evaluate(() => { const p = document.getElementById("geiDamMapPage"); return !!p && p.classList.contains("show") && document.querySelectorAll("#geiMapFactoryTrack .geiMapFactory").length >= 24; });
  const mapData = await page.evaluate(() => {
    // eslint-disable-next-line no-undef
    const days = Math.min(6, Math.floor(state.levelFlOz / 111)), si = days >= 6 ? 5 : days, M = window.__GEI_V2170_DAM_MAP__;
    const expected = si === 5 ? M.progress().levelFactory.toUpperCase() : M.regions[si].label;
    return { levelFlOz:state.levelFlOz, expected, shown:document.getElementById("geiMapPinLabel").textContent, level:document.getElementById("geiMapLevel").textContent, stateLevel:state.level };
  });
  check("6f. DAM MAP pin + level reflect live progress", mapData.levelFlOz > 0 && mapData.shown === mapData.expected && mapData.level === "LEVEL " + mapData.stateLevel, mapData);
  await page.click("#geiMapBack");
  await sleep(250);
  const after = await page.evaluate(SNAP);
  check("6c. DAM MAP opens the world map (24 factories rendered) and closes", mapOpen, {});
  check("6d. opening the map changes no gameplay state", JSON.stringify(before) === JSON.stringify(after), {});
  /* dock buttons still do their jobs */
  const jobs = {};
  await page.click("#dmStoreFloatBtn"); await sleep(250);
  jobs.store = await page.evaluate(() => document.getElementById("storePanel").classList.contains("open"));
  const mapOverStore = await page.evaluate(() => window.__GEI_V2189_UTILITY_DOCK__.hitTest()[1].ok);
  await page.click("#songVaultFloatBtn"); await sleep(250);
  jobs.vault = await page.evaluate(() => document.getElementById("radioPanel").classList.contains("open"));
  await page.evaluate(() => { try { closePanels(); } catch (e) {} });
  check("7b. BUY-ites opens the store, SONG VAULT opens the vault", jobs.store && jobs.vault, jobs);
  check("6e. DAM MAP stays clickable while a side panel is open", mapOverStore, {});

  /* 8 — fullscreen */
  const fs = await page.evaluate(async () => {
    const b = document.getElementById("fullscreenBtn"), r = b.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { clickable: hit === b || b.contains(hit) };
  });
  await page.click("#fullscreenBtn"); await sleep(300);
  fs.entered = await page.evaluate(() => !!(document.fullscreenElement || document.webkitFullscreenElement));
  if (fs.entered){ await page.click("#fullscreenBtn"); await sleep(300); fs.exited = await page.evaluate(() => !document.fullscreenElement); }
  check("8. fullscreen button is clickable and toggles fullscreen", fs.clickable && fs.entered && fs.exited !== false, fs);

  /* 3-tier — play a whole level: day cards + level card are event-driven and exclusive. */
  await page.evaluate(SAMPLER);
  const p = await worldPoint(page);
  let phase = "";
  for (let i = 0; i < 400 && phase !== "levelComplete"; i++){
    // eslint-disable-next-line no-undef
    const st = await page.evaluate(() => ({ phase:state.phase, busy:state.busy }));
    phase = st.phase;
    if ((st.phase === "playing" || st.phase === "ready") && !st.busy) await g.tapAt(p.x, p.y);
    await sleep(110);
  }
  /* V2.2.11: the card now follows a ~3 s victory sequence (stabilise → release → voice → LEVEL COMPLETE!) */
  try { await page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:15000 }); } catch {}
  await sleep(2500);
  const lv = await page.evaluate(SAMPLE_READ);
  check("3b. a full level completes and shows the level card", phase === "levelComplete" && lv.levelSamples > 5, { phase, levelSamples:lv.levelSamples });
  check("3c. level card is exclusive (no other moment over it) and one moment at a time all level", lv.levelOverlap === 0 && lv.maxSim <= 1, { overlap:lv.levelOverlap, with:lv.levelOverlapWith, maxSim:lv.maxSim, sims:lv.sims, seen:lv.textSeen });
  check("3d. whole level: no tap chatter, no tap toasts", !Object.keys(lv.chatterSeen).length, lv.chatterSeen);
  await page.evaluate(() => { const b = document.getElementById("levelCard"); b && b.classList.remove("show"); });

  const selfTests = await page.evaluate(() => ({ director:window.__GEI_TAP_LITES_MOMENT_DIRECTOR__.selfTest(), tapLayer:window.__GEI_V2168_TAP_LAYER__.selfTest() }));
  check("V2.1.68 pointer layer intact + moment surfaces never take input", selfTests.tapLayer.ok && selfTests.director.momentSurfacesPointerSafe, selfTests);
  check("no new script errors (only the 4 pre-existing unparseable modules)", g.errors.length <= KNOWN_BROKEN, g.errors);
  await g.ctx.close();
}

/* 9 — same deterministic taps on the pre-V2.1.89 revision vs now: economy must match. */
async function stateParity(browser, base, baseUrl){
  async function run(url){
    const g = await openGame(browser, url);
    await rapidTaps(g, 20, 140);
    await sleep(2600);
    const snap = await g.page.evaluate(SNAP);
    await g.ctx.close();
    return snap;
  }
  const now = await run(base), then = await run(baseUrl);
  const econ = s => JSON.stringify({ totalFlOz:s.state.totalFlOz, level:s.state.level, levelFlOz:s.state.levelFlOz, completedLevels:s.state.completedLevels, damMachineFreePlays:s.state.damMachineFreePlays, xp:s.state.xp, unlocked:s.state.unlocked });
  check("9. taps actually progressed the game (non-vacuous comparison)", now.state.levelFlOz > 0 && Object.keys(now.storage).length > 0, { now:now.state, keys:Object.keys(now.storage) });
  check("9. gameplay/economy state identical to " + BASE_REF + " after the same taps", econ(now) === econ(then), { now:econ(now), base:econ(then) });
  const keys = o => Object.keys(o.storage).sort().join();
  check("9b. no new or removed saved-state keys", keys(now) === keys(then), { now:Object.keys(now.storage), base:Object.keys(then.storage) });
}

/* 10 — phones */
async function mobileSuite(browser, base, pw, name){
  const g = await openGame(browser, base, pw.devices[name]);
  await g.page.evaluate(SAMPLER);
  await rapidTaps(g, 20, 110);
  await sleep(1200);
  const s = await g.page.evaluate(SAMPLE_READ);
  const dock = await g.page.evaluate(() => window.__GEI_V2189_UTILITY_DOCK__.selfTest());
  const fit = await g.page.evaluate(() => { const r = document.getElementById("geiUtilityDock").getBoundingClientRect(); return { right:r.right, vw:innerWidth, top:r.top, bottom:r.bottom, vh:innerHeight, noHScroll:document.documentElement.scrollWidth <= innerWidth + 1 }; });
  check("10. [" + name + "] one visible moment, no chatter, every tap has water fx", s.maxSim <= 1 && !Object.keys(s.chatterSeen).length && s.tapsWithFx === s.taps && s.taps >= 20, { maxSim:s.maxSim, chatter:s.chatterSeen, taps:s.taps, fx:s.tapsWithFx });
  check("10b. [" + name + "] dock vertical, on-screen, all clickable; map never blocked", dock.orderOk && dock.verticalStack && dock.allClickable && s.mapBlocked === 0 && fit.right <= fit.vw && fit.bottom <= fit.vh && fit.noHScroll, { dock:dock.clickable, fit, mapBlocked:s.mapBlocked });
  await g.page.tap("#damMapLauncherBtn"); await sleep(350);
  const open = await g.page.evaluate(() => document.getElementById("geiDamMapPage").classList.contains("show"));
  check("10c. [" + name + "] DAM MAP opens by touch", open, {});
  await g.ctx.close();
}

const pw = await loadPlaywright();
const srv = await serve(null), baseSrv = await serve(BASE_REF);
const base = "http://127.0.0.1:" + srv.address().port, baseUrl = "http://127.0.0.1:" + baseSrv.address().port;
const browser = await pw.chromium.launch();
try {
  await desktopSuite(browser, base);
  if (gitShow(BASE_REF, "index.html")) await stateParity(browser, base, baseUrl);
  else check("9. baseline revision available (" + BASE_REF + ")", false, "git show failed");
  await mobileSuite(browser, base, pw, "Pixel 7");
  await mobileSuite(browser, base, pw, "iPhone 13");
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally {
  await browser.close(); srv.close(); baseSrv.close();
}
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ version:"V2.1.89", passed:results.length - failed.length, failed:failed.length, results }, null, 1));
process.exit(failed.length ? 1 : 0);
