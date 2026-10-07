/* V2.1.91 — DAM-ITE SURPRISE CAMEO ENGINE regression harness
 *
 * Loads the real index.html in headless Chromium (desktop, Pixel 7, iPhone 13) and checks:
 *   A character selection: the nine DAM-ITE SURPRISES are gone from every picker, never sold or
 *     awarded, never activatable; renames applied; art URLs kept; legacy owners keep ownership
 *   B Beaver default + selectable     C Wilbert available + selectable
 *   D try-again idle: music keeps playing, cameos appear on the 1.5–3.5 s / 2.5–6 s rhythm,
 *     never more than one, no immediate repeats, the TRY DAY AGAIN button is never covered
 *   E one tap anywhere ends the show at once and retries the day
 *   F DAM Map: cameos appear, every map button still hit-tests to itself; closing stops them
 *   G refresh: gameplay/economy state + saved keys unchanged
 *   H phones: no overflow, button uncovered     I reduced motion   J tier weights + engine self-test
 *
 *   node tools/v2-cameos/cameo-regression.mjs
 *
 * Offline: every non-local request is blocked (cameo art falls back to its emoji).
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = [];
  try { roots.push(execSync("npm root -g", { encoding:"utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){
    try { return createRequire(join(r, "noop.js"))("playwright"); } catch {}
    try { return createRequire(join(r, "noop.js"))("playwright-core"); } catch {}
  }
  console.error("Playwright is not installed. Run: npm i -D playwright"); process.exit(2);
}
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
function serve(){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p === "/") p = "/index.html";
        const f = resolve(root, "." + p); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
        await stat(f); res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }); res.end(await readFile(f));
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

const results = [];
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CAMEO_IDS = ["character-7","character-8","character-6","character-2","character-1","character-3","character-4","character-5","lion"];
const CAMEO_NAMES = ["DAM Pool","DAM Double Burger","DAM Statue","DAM Lollipop","DAM Sundae","DAM Sundaes","DAM Water","DAM Unicorn","DAM Light","Lion"];
/* Pre-existing on the base (not introduced here): 4 inline scripts fail to parse per load, one self-test row. */
const KNOWN_PAGE_ERROR = /Unexpected string/;
const KNOWN_SELFTEST_FAILS = ["V2.1.8: every canonical character has a spotlight personality"];

async function open(browser, base, opts){
  opts = opts || {};
  const ctx = await browser.newContext(Object.assign({ viewport:{ width:1280, height:800 } }, opts.device || {}, opts.ctx || {}));
  ctx.__errors = [];
  await ctx.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  if (opts.init) await ctx.addInitScript(opts.init.fn, opts.init.arg);
  const page = await ctx.newPage();
  page.on("pageerror", e => ctx.__errors.push(e.message));
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(500);
  const touch = !!(opts.device && opts.device.hasTouch);
  const vp = page.viewportSize();
  if (touch) await page.touchscreen.tap(vp.width / 2, vp.height / 2); else await page.mouse.click(vp.width / 2, vp.height / 2);   // gesture → music
  await sleep(400);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(2600);
  await page.evaluate(() => { try { window.__GEI_BEAVER_WELCOME__ && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });
  await sleep(400);
  return { ctx, page, touch };
}
const ECON = () => {
  // eslint-disable-next-line no-undef
  const s = state;
  return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, millStage:s.millStage,
    damMachineFreePlays:s.damMachineFreePlays, unlockedCharacters:s.unlockedCharacters, unlockedSongs:s.unlockedSongs, unlockedSkins:s.unlockedSkins,
    purchaseHistory:s.purchaseHistory, processedReceipts:s.processedReceipts });
};
async function tapWorld(g, n){
  for (let i = 0; i < n; i++){
    const p = await g.page.evaluate(() => { const r = document.getElementById("world").getBoundingClientRect(); return { x:r.left + r.width * .45, y:r.top + r.height * .55 }; });
    if (g.touch) await g.page.touchscreen.tap(p.x, p.y); else await g.page.mouse.click(p.x, p.y);
    await sleep(110);
  }
}
/* Start the day with a real tap, then let the clock "run out" through the game's own handler. */
async function breakTheDam(g){
  await tapWorld(g, 1);
  await g.page.evaluate(() => { handleDayTimeout(); });
  /* V2.2.10: the failure is a ~7–11 s cinematic (dam break, flood, reaction) before THE DAM BROKE card shows — wait for the card, then measure from there. */
  try { await g.page.waitForFunction(() => document.getElementById("timeUpCard").classList.contains("show"), null, { timeout:30000 }); } catch {}
  return g.page.evaluate(() => ({ phase:state.phase, shown:document.getElementById("timeUpCard").classList.contains("show"), at:performance.now() }));
}
/* 40 ms sampler: visible cameo count, sequence, first-appearance time, button coverage, overflow. */
const SAMPLER = () => {
  const Q = window.__cq = { max:0, seq:[], firstAt:0, spans:[], covered:0, samples:0, overflow:0, outside:0, cur:null, curAt:0, pe:[] };
  const t0 = performance.now();
  Q.iv = setInterval(() => {
    Q.samples++;
    const on = [...document.querySelectorAll(".dscCameo.on")].filter(el => getComputedStyle(el).display !== "none");
    Q.max = Math.max(Q.max, on.length);
    const id = on[0] ? on[0].getAttribute("data-cameo") + "#" + window.__GEI_DAM_SURPRISES__.stats().shown : null;
    if (id !== Q.cur){
      if (Q.cur) Q.spans.push(performance.now() - Q.curAt);
      if (id){ Q.seq.push(on[0].getAttribute("data-cameo")); if (!Q.firstAt) Q.firstAt = performance.now() - t0; }
      Q.cur = id; Q.curAt = performance.now();
    }
    if (document.documentElement.scrollWidth > innerWidth + 1) Q.overflow++;
    if (on[0]){
      /* the drawn figure: the cameo box minus a 15% transparent margin */
      const R = on[0].getBoundingClientRect(), m = .15, r = { left:R.left + R.width*m, right:R.right - R.width*m, top:R.top + R.height*m, bottom:R.bottom - R.height*m };
      const vw = innerWidth, vh = innerHeight;
      Q.pe.push(getComputedStyle(document.getElementById("damSurpriseLayer")).pointerEvents);
      /* must actually be visible: its centre inside the viewport and inside its (clipping) host */
      const cx = (R.left + R.right) / 2, cy = (R.top + R.bottom) / 2;
      const clip = on[0].closest("#dmwScroll") || on[0].closest("#timeUpCard");
      const cr = clip ? clip.getBoundingClientRect() : { left:0, top:0, right:vw, bottom:vh };
      if (cx < Math.max(0, cr.left) || cx > Math.min(vw, cr.right) || cy < Math.max(0, cr.top) || cy > Math.min(vh, cr.bottom)) Q.outside++;
      for (const sel of ["#retryDayBtn", "#geiMapBack", "#geiMapSound", "#geiMapRegions .dmwPill"]){
        document.querySelectorAll(sel).forEach(b => {
          const br = b.getBoundingClientRect(); if (!br.width || b.offsetParent === null) return;
          if (r.left < br.right && r.right > br.left && r.top < br.bottom && r.bottom > br.top){ Q.covered++; Q.coveredBy = sel; }
        });
      }
    }
  }, 40);
};
const SAMPLE_READ = () => { const Q = window.__cq; clearInterval(Q.iv); if (Q.cur) Q.spans.push(performance.now() - Q.curAt); return Q; };

/* ---------- A/B/C: selection ---------- */
async function suiteSelection(browser, base){
  const g = await open(browser, base);
  const r = await g.page.evaluate(ids => {
    openGameGuide(true); showGuideTab("avatar");
    const guideIds = [...document.querySelectorAll("#preGameAvatarGrid .preGameAvatar")].map(e => e.dataset.charId);
    const guideNames = [...document.querySelectorAll("#preGameAvatarGrid .preGameAvatar")].map(e => e.textContent);
    closeGameGuide();
    renderStoreCharacterShelf(); renderCharactersPanel();
    const store = document.getElementById("storeCharactersGrid").innerHTML, panel = document.getElementById("charactersGrid").innerHTML;
    const names = CHARACTERS.map(c => c.name);
    return {
      guideIds, guideNamesJoined:guideNames.join("|"), inStore:ids.filter(id => store.includes(id)), inPanel:ids.filter(id => panel.includes(id)),
      beaverIn:guideIds.includes("yall-too-beaver"), wilbertIn:guideIds.includes("wilbert-dam-guide"),
      c6:CHARACTERS.find(c => c.id === "character-6").name, c8:CHARACTERS.find(c => c.id === "character-8").name,
      dupNames:names.filter((n, i) => names.indexOf(n) !== i), ampersand:names.some(n => /&/.test(n)),
      art:ids.map(id => CHARACTERS.find(c => c.id === id).img),
      cameoFlag:ids.every(id => CHARACTERS.find(c => c.id === id).cameoOnly === true),
      nextLocked:(nextLockedItem("characters") || {}).id,
      active:state.activeCharacter
    };
  }, CAMEO_IDS);
  check("A1. guide picker shows none of the nine DAM-ITE SURPRISES", r.guideIds.length > 0 && !r.guideIds.some(id => CAMEO_IDS.includes(id)), r.guideIds);
  check("A2. store shelf + characters panel show none of them", !r.inStore.length && !r.inPanel.length, { store:r.inStore, panel:r.inPanel });
  check("A3. no picker label names a removed character", !CAMEO_NAMES.some(n => r.guideNamesJoined.split("|").some(t => t.trim().startsWith(n + " ") || t.trim() === n)), {});
  check("A4. renames: character-6 → DAM Statue, character-8 → DAM Double Burger; no duplicates, no '&'", r.c6 === "DAM Statue" && r.c8 === "DAM Double Burger" && !r.dupNames.length && !r.ampersand, { c6:r.c6, c8:r.c8, dup:r.dupNames });
  check("A5. image URLs kept in the catalog (cameoOnly flag, not deleted)", r.art.every(u => /^https:\/\/assets\.zyrosite\.com\//.test(u)) && r.cameoFlag, r.art);
  check("A6. prize path never awards a surprise (nextLockedItem)", !CAMEO_IDS.includes(r.nextLocked), r.nextLocked);
  check("B1. Beaver is the default active character and listed", r.active === "yall-too-beaver" && r.beaverIn, r.active);
  check("C1. Wilbert is listed", r.wilbertIn, {});
  const sel = await g.page.evaluate(() => {
    const before = JSON.stringify(state.unlockedCharacters);
    const w = setActiveCharacter("wilbert-dam-guide"), a1 = state.activeCharacter;
    const b = setActiveCharacter("yall-too-beaver"), a2 = state.activeCharacter;
    const lionActive = setActiveCharacter("lion");
    state.totalFlOz += 0;                                                   // read-only probe below
    const buy = purchaseItem("characters", "character-7", { save:false });
    return { w, a1, b, a2, lionActive, buy, ownershipSame:before === JSON.stringify(state.unlockedCharacters) };
  });
  check("C2. Wilbert selectable", sel.w && sel.a1 === "wilbert-dam-guide", sel);
  check("B2. Beaver selectable", sel.b && sel.a2 === "yall-too-beaver", sel);
  check("A7. a surprise can't be made active or bought", !sel.lionActive && !sel.buy.ok && /SURPRISE/.test(sel.buy.message) && sel.ownershipSame, sel);
  check("A8. no new page errors (selection)", g.ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, g.ctx.__errors);
  const st = await g.page.evaluate(() => runCommandCenterSelfTest());
  const nf = st.results.filter(x => !x.ok && !KNOWN_SELFTEST_FAILS.includes(x.name));
  check("A9. in-page command-center self-test: no new failures", nf.length === 0, nf);
  const eng = await g.page.evaluate(() => window.__GEI_DAM_SURPRISES__.selfTest());
  check("J1. engine self-test (9 cameos, 14 effects, tiers=100, single layer, pointer-events none, aria-hidden, art from catalog, none selectable)",
    eng.cameos === 9 && eng.effects === 14 && eng.tierWeightsSum === 100 && eng.singleLayer && eng.boundedDom && eng.pointerEventsNone && eng.ariaHidden && eng.artFromCatalog && eng.noneSelectable, eng);
  const tiers = await g.page.evaluate(() => { const c = { normal:0, special:0, rare:0, ultra:0 }; for (let i = 0; i < 40000; i++) c[window.__GEI_DAM_SURPRISES__.pickTier()]++; return c; });
  const pct = k => tiers[k] / 400;
  check("J2. tier weights ≈ 65 / 25 / 8 / 2 %", Math.abs(pct("normal") - 65) < 1.5 && Math.abs(pct("special") - 25) < 1.5 && Math.abs(pct("rare") - 8) < 1 && Math.abs(pct("ultra") - 2) < .6, tiers);
  await g.ctx.close();
}

/* ---------- A10: legacy save whose active operator is now a surprise ---------- */
async function suiteLegacy(browser, base){
  const save = { version:2, level:4, levelFlOz:222, totalFlOz:777, completedLevels:3, unlockedSongs:["masters-build"], unlockedSkins:[],
    unlockedCharacters:["wilbert-dam-guide","yall-too-beaver","character-6","lion"], activeCharacter:"character-6", charRulesV2:true };
  const g = await open(browser, base, { init:{ fn:s => { if (!sessionStorage.getItem("__seeded")){ localStorage.setItem("yalltooDamGame.v2", JSON.stringify(s)); sessionStorage.setItem("__seeded","1"); } }, arg:save } });
  const r = await g.page.evaluate(() => ({ active:state.activeCharacter, owned:state.unlockedCharacters.slice(), fl:state.totalFlOz, level:state.level, lfo:state.levelFlOz }));
  check("A10. legacy save: active surprise → Beaver; purchased surprises stay owned; FL OZ/progress untouched",
    r.active === "yall-too-beaver" && r.owned.includes("character-6") && r.owned.includes("lion") && r.fl === 777 && r.level === 4 && r.lfo === 222, r);
  await g.ctx.close();
}

/* ---------- D/E/G: try-again idle ---------- */
async function suiteIdle(browser, base, device, label){
  const g = await open(browser, base, { device });
  const tag = label ? "[" + label + "] " : "";
  const music0 = await g.page.evaluate(() => DAMSoundtrack.playing);
  const econ0 = await g.page.evaluate(ECON);
  const keys0 = await g.page.evaluate(() => Object.keys(localStorage).sort());
  const bt = await breakTheDam(g);
  check("D0. " + tag + "THE DAM BROKE card shows with music playing", bt.shown && bt.phase === "timeout" && music0, { bt, music0 });
  await g.page.evaluate(SAMPLER);
  await sleep(label ? 13000 : 16000);          // worst case for the 2nd cameo: 3.5 + 2.2 + 6 s
  const q = await g.page.evaluate(SAMPLE_READ);
  const music1 = await g.page.evaluate(() => DAMSoundtrack.playing);
  const reps = q.seq.filter((id, i) => i > 0 && id === q.seq[i - 1]).length;
  check("D1. " + tag + "cameos appear (first after ~1.5–3.5 s)", q.seq.length >= (label ? 2 : 3) && q.firstAt >= 1400 && q.firstAt <= 3900, { firstAt:Math.round(q.firstAt), seq:q.seq });
  check("D2. " + tag + "only one cameo visible at a time", q.max === 1, { max:q.max });
  check("D3. " + tag + "appearances are short (≈0.9–2.2 s)", q.spans.slice(0, -1).every(ms => ms >= 800 && ms <= 2500), q.spans.map(Math.round));
  check("D4. " + tag + "no cameo twice in a row", reps === 0, q.seq);
  check("D5. " + tag + "music keeps playing through the idle show", music1, {});
  check("D6. " + tag + "TRY DAY AGAIN never covered; layer pointer-events:none", q.covered === 0 && q.pe.every(v => v === "none"), { covered:q.covered });
  check("H1. " + tag + "no horizontal overflow; cameo stays on screen", q.overflow === 0 && q.outside === 0, { overflow:q.overflow, outside:q.outside });
  /* E — wait until one is visible, then a single tap on the card background */
  for (let i = 0; i < 80; i++){ if (await g.page.evaluate(() => window.__GEI_DAM_SURPRISES__.visible)) break; await sleep(100); }
  const pt = await g.page.evaluate(() => { const r = document.getElementById("timeUpCard").getBoundingClientRect(), b = document.getElementById("retryDayBtn").getBoundingClientRect(); return { x:r.left + 12, y:Math.min(r.bottom - 12, b.bottom + 60), vis:window.__GEI_DAM_SURPRISES__.visible }; });
  if (g.touch) await g.page.touchscreen.tap(pt.x, pt.y); else await g.page.mouse.click(pt.x, pt.y);
  await sleep(60);
  const after = await g.page.evaluate(() => ({ vis:window.__GEI_DAM_SURPRISES__.visible, on:document.querySelectorAll(".dscCameo.on").length, mode:window.__GEI_DAM_SURPRISES__.mode,
    card:document.getElementById("timeUpCard").classList.contains("show"), phase:state.phase }));
  check("E1. " + tag + "one tap ends the show immediately and retries the day", pt.vis && !after.vis && after.on === 0 && after.mode === "" && !after.card && after.phase !== "timeout", { before:pt.vis, after });
  await sleep(4500);
  const quiet = await g.page.evaluate(() => ({ shown:document.querySelectorAll(".dscCameo.on").length, mode:window.__GEI_DAM_SURPRISES__.mode }));
  check("E2. " + tag + "no cameos after returning to gameplay", quiet.shown === 0 && quiet.mode === "", quiet);
  const econ1 = await g.page.evaluate(ECON);
  check("G1. " + tag + "FL OZ / XP / progression / ownership unchanged by cameos", econ0 === econ1, { econ0, econ1 });
  await g.page.reload({ waitUntil:"load" }); await sleep(1500);
  const econ2 = await g.page.evaluate(ECON), keys2 = await g.page.evaluate(() => Object.keys(localStorage).sort());
  const newKeys = keys2.filter(k => !keys0.includes(k) && !/damMusic|dam2188|bird|tl21|scene|skin|mood|geiCharacter|gei2189/i.test(k));
  check("G2. " + tag + "refresh: same gameplay state, no new saved keys from the engine", econ2 === econ0 && !newKeys.some(k => /surprise|cameo|dsc/i.test(k)), { newKeys });
  if (!label) check("D7. no new page errors (idle)", g.ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, g.ctx.__errors);
  await g.ctx.close();
}

/* music off → no idle cameos */
async function suiteNoMusic(browser, base){
  const g = await open(browser, base);
  await g.page.evaluate(() => DAMSoundtrack.pause());
  await breakTheDam(g);
  await sleep(5500);
  const s = await g.page.evaluate(() => window.__GEI_DAM_SURPRISES__.stats().shown);
  check("D8. no music playing → no idle cameos", s === 0, { shown:s });
  await g.ctx.close();
}

/* ---------- F: DAM Map ---------- */
async function suiteMap(browser, base, device, label){
  const g = await open(browser, base, { device });
  const tag = label ? "[" + label + "] " : "";
  if (g.touch) await g.page.tap("#damMapLauncherBtn"); else await g.page.click("#damMapLauncherBtn");
  await sleep(500);
  await g.page.evaluate(SAMPLER);
  let seen = 0;
  for (let i = 0; i < 400 && seen < 2; i++){ await sleep(100); seen = await g.page.evaluate(() => window.__GEI_DAM_SURPRISES__.stats().shown); }
  /* force a few more placements to exercise every region quickly */
  for (const id of ["character-7","character-6","lion","character-3","character-4","character-5"]){
    await g.page.evaluate(id => window.__GEI_DAM_SURPRISES__.debug.show({ cameo:id }), id); await sleep(700);
  }
  const q = await g.page.evaluate(SAMPLE_READ);
  const inScene = await g.page.evaluate(() => { const l = document.getElementById("damSurpriseLayer"); return !!(l && l.parentNode && l.parentNode.id === "dmwScene"); });
  check("F1. " + tag + "cameos appear on the DAM Map on their own", seen >= 1 && inScene, { seen, inScene });
  check("F2. " + tag + "map buttons (BACK, sound, region pills) never covered", q.covered === 0 && q.max <= 1, { covered:q.covered, max:q.max });
  check("F5. " + tag + "every map cameo is actually on screen (inside the visible map viewport)", q.outside === 0 && q.seq.length >= 6, { outside:q.outside, seq:q.seq });
  /* real clicks while a cameo is up */
  await g.page.evaluate(() => window.__GEI_DAM_SURPRISES__.debug.show({ cameo:"character-7" })); await sleep(250);
  const sndBefore = await g.page.evaluate(() => document.getElementById("geiMapSound").getAttribute("aria-pressed"));
  if (g.touch) await g.page.tap("#geiMapSound"); else await g.page.click("#geiMapSound");
  const sndAfter = await g.page.evaluate(() => document.getElementById("geiMapSound").getAttribute("aria-pressed"));
  if (g.touch) await g.page.tap("#geiMapSound"); else await g.page.click("#geiMapSound");            // restore
  const pill = await g.page.$("#geiMapRegions .dmwPill[data-i='2']");
  await pill.scrollIntoViewIfNeeded(); if (g.touch) await pill.tap(); else await pill.click({ timeout:3000 });
  const cap = await g.page.evaluate(() => document.getElementById("dmwCaption").textContent);
  check("F3. " + tag + "sound toggle + region pill respond to real clicks during a cameo", sndBefore !== sndAfter && /./.test(cap), { sndBefore, sndAfter, cap });
  if (g.touch) await g.page.tap("#geiMapBack"); else await g.page.click("#geiMapBack");
  await sleep(300);
  const closed = await g.page.evaluate(() => ({ open:document.getElementById("geiDamMapPage").classList.contains("show"), mode:window.__GEI_DAM_SURPRISES__.mode, on:document.querySelectorAll(".dscCameo.on").length }));
  /* V2.1.92: the global director hands off to the next idle screen (e.g. "home"), never keeps "map". */
  check("F4. " + tag + "BACK closes the map and stops map cameos", !closed.open && closed.mode !== "map" && closed.on === 0, closed);
  check("H2. " + tag + "no horizontal page overflow on the map", q.overflow === 0, { overflow:q.overflow });
  await g.ctx.close();
}

/* ---------- I: reduced motion ---------- */
async function suiteReduced(browser, base){
  const g = await open(browser, base, { ctx:{ reducedMotion:"reduce" } });
  await breakTheDam(g);
  await sleep(300);
  const r = await g.page.evaluate(() => { const c = window.__GEI_DAM_SURPRISES__.debug.show({ tier:"ultra" }); const el = document.querySelector(".dscCameo");
    return { c, cls:el.className, parts:[...document.querySelectorAll(".dscPart")].filter(p => getComputedStyle(p).display !== "none").length, figAnim:getComputedStyle(el.querySelector(".dscFig")).animationName }; });
  check("I1. reduced motion: fade/scale only (no effect loops, no music sway, no particles, no flashing aura)", r.c && r.c.entry === "fade" && r.c.exit === "fade" && !/fx-|sync|illuminate/.test(r.cls) && r.parts === 0 && r.figAnim === "none", r);
  await g.ctx.close();
}

const pw = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await pw.chromium.launch();
try {
  await suiteSelection(browser, base);
  await suiteLegacy(browser, base);
  await suiteIdle(browser, base);
  await suiteNoMusic(browser, base);
  await suiteMap(browser, base);
  await suiteReduced(browser, base);
  for (const d of ["Pixel 7", "iPhone 13"]){ await suiteIdle(browser, base, pw.devices[d], d); await suiteMap(browser, base, pw.devices[d], d); }
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally { await browser.close(); srv.close(); }
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ version:"V2.1.91", passed:results.length - failed.length, failed:failed.length, results }, null, 1));
process.exit(failed.length ? 1 : 0);
