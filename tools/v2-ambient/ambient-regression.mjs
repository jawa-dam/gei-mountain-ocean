/* V2.1.92 — GLOBAL DAM-ITE AMBIENT SCREENSAVER + LOGO BRANDING + SAVED -ITE SHOWCASE harness
 *
 * Loads the real index.html in headless Chromium (desktop, Pixel 7, iPhone 13) and checks:
 *    1 MENU IDLE      home screensaver: first cameo after 3–6 s, shows 1–2 s, one at a time, no repeats
 *    2 MENU TAP       a tap removes the cameo at once (board tap → gameplay → engine silent)
 *    3 PRE-GAME       Command Guide cameos never cover START GAME; START still works during a cameo
 *    4 BONUS WHEEL    cameos never cover SPIN or the hub; SPIN stops ambient mode immediately
 *    5 LEVEL COMPLETE large cameos after the card settles, never over headline/rescue/buttons
 *    6 TRY AGAIN      music keeps playing and the cameo loop runs
 *    7 SAVED -ITE     rescue art is substantially larger, inside the viewport, randomized reveal
 *    8 SAVED CARD TAP collection popout opens from the existing record, closes (✕ / Esc / backdrop)
 *    9 SPLASH         Wet logo replaces the "TAP LITES" text; no duplicate text
 *   10 HEADER         standard logo replaces the heading; tagline kept; not tiny
 *   11 CHARACTERS     the nine surprises stay non-playable
 *   12 MOBILE         no clipping/overflow on phones
 *   + reduced motion, one bounded aria-hidden layer, presentation-only (economy/keys unchanged)
 *
 *   node tools/v2-ambient/ambient-regression.mjs
 *
 * Offline: every non-local request is blocked; the two logo URLs are answered with a local stub PNG
 * so the logo layout can be measured (cameo art falls back to its emoji).
 */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { deflateSync } from "node:zlib";

const root = resolve(new URL("../..", import.meta.url).pathname);
const SHOTS = process.env.SHOTS || "";
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
/* tiny solid PNG (stand-in for the real logo art, 3:1) */
function png(w, h, rgba){
  const crcT = []; for (let n = 0; n < 256; n++){ let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 6;
  const row = Buffer.alloc(1 + w * 4); for (let x = 0; x < w; x++) row.set(rgba, 1 + x * 4);
  const raw = Buffer.concat(Array.from({ length:h }, () => row));
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk("IHDR", ih), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const LOGO_WET = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/taplite-dam-game-MMriASP81waYdTOV.png";
const LOGO_STD = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/tap-lites-dam-game-jbpqyY7isgNwO53J.png";
const STUB = { [LOGO_WET]:png(600, 200, [47,210,255,255]), [LOGO_STD]:png(600, 200, [243,16,186,255]) };

const results = [];
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CAMEO_IDS = ["character-7","character-8","character-6","character-2","character-1","character-3","character-4","character-5","lion"];
const KNOWN_PAGE_ERROR = /Unexpected string/;
const SAVE_KEY = "yalltooDamGame.v2";
/* Level 5 finished on this refresh → the card waits for CONTINUE, the Israelite was saved this cycle. */
const LEVEL5_SAVE = { version:2, level:5, levelFlOz:666, totalFlOz:4000, completedLevels:5, currentStep:5, unlockedSongs:["masters-build"], unlockedSkins:[],
  unlockedCharacters:["wilbert-dam-guide","yall-too-beaver"], activeCharacter:"yall-too-beaver", charRulesV2:true,
  iteRescueStats:{ savedIteIds:["danite","levite","israelite"], lastSavedIteId:"israelite", lastRescueLevel:5, currentIteId:null } };

async function open(browser, base, opts){
  opts = opts || {};
  const ctx = await browser.newContext(Object.assign({ viewport:{ width:1280, height:800 } }, opts.device || {}, opts.ctx || {}));
  ctx.__errors = [];
  await ctx.route("**/*", r => { const u = r.request().url();
    if (STUB[u]) return r.fulfill({ status:200, contentType:"image/png", body:STUB[u] });
    return u.startsWith(base) ? r.continue() : r.abort(); });
  if (opts.save) await ctx.addInitScript(([k, s]) => { if (!sessionStorage.getItem("__seeded")){ localStorage.setItem(k, JSON.stringify(s)); localStorage.setItem("geiWelcomeDismissed", "true"); sessionStorage.setItem("__seeded","1"); } }, [SAVE_KEY, opts.save]);
  const page = await ctx.newPage();
  page.on("pageerror", e => ctx.__errors.push(e.message));
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(500);
  const touch = !!(opts.device && opts.device.hasTouch);
  const g = { ctx, page, touch };
  if (opts.beforeSkip) await opts.beforeSkip(g);
  const vp = page.viewportSize();
  if (touch) await page.touchscreen.tap(vp.width / 2, vp.height / 2); else await page.mouse.click(vp.width / 2, vp.height / 2);   // gesture → music
  await sleep(400);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(2600);
  await page.evaluate(() => { try { window.__GEI_BEAVER_WELCOME__ && window.geiWelcomeOpen && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });
  await sleep(400);
  return g;
}
async function tap(g, x, y){ if (g.touch) await g.page.touchscreen.tap(x, y); else await g.page.mouse.click(x, y); }
async function tapSel(g, sel){ if (g.touch) await g.page.tap(sel); else await g.page.click(sel); }
async function shot(g, name){ if (!SHOTS) return; await mkdir(SHOTS, { recursive:true }); await g.page.screenshot({ path:join(SHOTS, name + ".png") }); }
const ECON = () => {
  // eslint-disable-next-line no-undef
  const s = state;
  return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, millStage:s.millStage,
    damMachineFreePlays:s.damMachineFreePlays, unlockedCharacters:s.unlockedCharacters, unlockedSongs:s.unlockedSongs, unlockedSkins:s.unlockedSkins,
    purchaseHistory:s.purchaseHistory, processedReceipts:s.processedReceipts, activeCharacter:s.activeCharacter, ites:s.iteRescueStats });
};
const E = "window.__GEI_DAM_SURPRISES__";

/* 40 ms sampler: cameo count/sequence/timing, coverage of the given selectors, overflow, on-screen. */
const SAMPLER = guardSels => {
  const Q = window.__aq = { max:0, seq:[], modes:[], firstAt:0, spans:[], covered:0, coveredBy:[], overflow:0, outside:0, pe:[], sizes:[], cur:null, curAt:0 };
  const t0 = performance.now();
  Q.iv = setInterval(() => {
    const on = [...document.querySelectorAll(".dscCameo.on")].filter(el => getComputedStyle(el).display !== "none");
    Q.max = Math.max(Q.max, on.length);
    const id = on[0] ? on[0].getAttribute("data-cameo") + "#" + window.__GEI_DAM_SURPRISES__.stats().shown : null;
    if (id !== Q.cur){
      if (Q.cur) Q.spans.push(performance.now() - Q.curAt);
      if (id){ Q.seq.push(on[0].getAttribute("data-cameo")); Q.modes.push(window.__GEI_DAM_SURPRISES__.mode); if (!Q.firstAt) Q.firstAt = performance.now() - t0; }
      Q.cur = id; Q.curAt = performance.now();
    }
    if (document.documentElement.scrollWidth > innerWidth + 1) Q.overflow++;
    if (!on[0]) return;
    /* the figure itself sits inside a 15 % margin of the box; entry/exit transforms are on an inner node */
    const R = on[0].getBoundingClientRect(), m = .15, r = { left:R.left + R.width*m, right:R.right - R.width*m, top:R.top + R.height*m, bottom:R.bottom - R.height*m };
    Q.sizes.push(Math.round(R.width));
    Q.pe.push(getComputedStyle(document.getElementById("damSurpriseLayer")).pointerEvents);
    const cx = (R.left + R.right) / 2, cy = (R.top + R.bottom) / 2;
    if (cx < 0 || cx > innerWidth || cy < 0 || cy > innerHeight) Q.outside++;
    for (const sel of guardSels){
      document.querySelectorAll(sel).forEach(b => {
        const br = b.getBoundingClientRect(); if (!br.width || b.offsetParent === null) return;
        if (r.left < br.right && r.right > br.left && r.top < br.bottom && r.bottom > br.top){ Q.covered++; if (!Q.coveredBy.includes(sel)) Q.coveredBy.push(sel); }
      });
    }
  }, 40);
};
const SAMPLE_READ = () => { const Q = window.__aq; clearInterval(Q.iv); if (Q.cur) Q.spans.push(performance.now() - Q.curAt); return Q; };
const noRepeatWithin = (seq, n) => seq.every((id, i) => !seq.slice(Math.max(0, i - n), i).includes(id));
const HOME_GUARDS = ["#fullscreenBtn", "#damMapLauncherBtn", "#guideTopBtn", "#dmStoreFloatBtn", "#songVaultFloatBtn", "#dmFloatBtn", "#timerBox", ".station.active"];

/* ---------- 1 / 2 / 9 / 10 / 11: home screensaver, tap, logos, characters ---------- */
async function suiteHome(browser, base, device, label){
  const tag = label ? "[" + label + "] " : "";
  let splash = null;
  const g = await open(browser, base, { device, beforeSkip: async g => {
    splash = await g.page.evaluate(() => { const t = document.querySelector(".geiSplashTitle"), img = t && t.querySelector("img");
      return { img:!!img, src:img && img.src, alt:img && img.alt, text:(t.textContent || "").trim(), others:[...document.querySelectorAll("#geiSplash *")].filter(e => e.children.length === 0 && /TAP\s*LITES/i.test(e.textContent)).length }; });
  } });
  const econ0 = await g.page.evaluate(ECON), keys0 = await g.page.evaluate(() => Object.keys(localStorage).sort());
  if (!label){
    check("9. SPLASH: TAPLITES Wet logo replaces the plain 'TAP LITES' title; no duplicate text", splash.img && splash.src === LOGO_WET && splash.alt === "TAP LITES" && splash.text === "" && splash.others === 0, splash);
  }
  const hdr = await g.page.evaluate(() => { const l = document.getElementById("gameLogo"), img = l.querySelector("img"), r = img && img.getBoundingClientRect();
    return { src:img && img.src, alt:img && img.alt, text:l.textContent.trim(), h:r && Math.round(r.height), w:r && Math.round(r.width), right:r && r.right, vw:innerWidth,
      tag:document.querySelector(".brandTag").textContent.trim() }; });
  check("10. " + tag + "HEADER: standard TAPLITES logo replaces the heading; tagline kept; logo not tiny", hdr.src === LOGO_STD && hdr.alt === "TAP LITES" && hdr.text === "" && hdr.h >= 34 && hdr.w >= 60 && hdr.right <= hdr.vw && hdr.tag === "TAP WATER. MAKE WAVES. SAVE THE -ITES.", hdr);
  await shot(g, "home-" + (label || "desktop").replace(/\s/g, ""));

  const st0 = await g.page.evaluate(`({ mode:${E}.mode, screen:${E}.screen, phase:state.phase })`);
  /* a harmless tap on the tagline restarts the screensaver's wait, so the first delay is measurable */
  const tg = await g.page.evaluate(() => { const r = document.querySelector(".brandTag").getBoundingClientRect(); return { x:r.left + 8, y:r.top + r.height / 2 }; });
  await tap(g, tg.x, tg.y);
  await g.page.evaluate(SAMPLER, HOME_GUARDS);
  await sleep(label ? 12000 : 16000);
  const q = await g.page.evaluate(SAMPLE_READ);
  check("1a. " + tag + "MENU IDLE: the board waiting for its first tap is the home screensaver", st0.mode === "home" && st0.phase === "ready", st0);
  check("1b. " + tag + "MENU IDLE: cameos appear on their own (first after ~3–6 s)", q.seq.length >= 2 && q.firstAt >= 2900 && q.firstAt <= 6400 && q.modes.every(m => m === "home"), { firstAt:Math.round(q.firstAt), seq:q.seq });
  check("1c. " + tag + "MENU IDLE: each shows ~1–2 s then disappears; one at a time", q.spans.slice(0, -1).every(ms => ms >= 850 && ms <= 2300) && q.max === 1, { spans:q.spans.map(Math.round), max:q.max });
  check("1d. " + tag + "MENU IDLE: no image repeats within the last several", noRepeatWithin(q.seq, 4), q.seq);
  check("1e. " + tag + "MENU IDLE: never over HUD buttons, floating buttons, timer or the glowing station; pointer-events:none", q.covered === 0 && q.pe.every(v => v === "none"), { covered:q.covered, by:q.coveredBy });
  check("12a. " + tag + "MOBILE/desktop: no horizontal overflow, cameo stays on screen (home)", q.overflow === 0 && q.outside === 0, { overflow:q.overflow, outside:q.outside });

  /* 2 — non-board tap: cameo leaves at once, the screensaver waits again */
  for (let i = 0; i < 90; i++){ if (await g.page.evaluate(E + ".visible")) break; await sleep(100); }
  const vis0 = await g.page.evaluate(E + ".visible");
  const brand = await g.page.evaluate(() => { const r = document.querySelector(".brandTag").getBoundingClientRect(); return { x:r.left + 8, y:r.top + r.height / 2 }; });
  await tap(g, brand.x, brand.y); await sleep(50);
  const t1 = await g.page.evaluate(`({ vis:${E}.visible, on:document.querySelectorAll(".dscCameo.on").length, mode:${E}.mode })`);
  check("2a. " + tag + "MENU TAP: any tap removes the cameo immediately and restarts the wait", vis0 && !t1.vis && t1.on === 0 && t1.mode === "home", { vis0, t1 });
  /* board tap starts the day → gameplay → no ambient activity */
  for (let i = 0; i < 90; i++){ if (await g.page.evaluate(E + ".visible")) break; await sleep(100); }
  const w = await g.page.evaluate(() => { const r = document.getElementById("world").getBoundingClientRect(); return { x:r.left + r.width * .45, y:r.top + r.height * .55 }; });
  await tap(g, w.x, w.y); await sleep(80);
  const t2 = await g.page.evaluate(`({ vis:${E}.visible, mode:${E}.mode, phase:state.phase })`);
  await sleep(4000);
  const t3 = await g.page.evaluate(`({ on:document.querySelectorAll(".dscCameo.on").length, mode:${E}.mode, phase:state.phase })`);
  check("2b. " + tag + "MENU TAP: board tap starts play; screensaver stops and stays off during gameplay", !t2.vis && t2.phase === "playing" && t2.mode === "" && (t3.phase !== "playing" || (t3.on === 0 && t3.mode === "")), { t2, t3 });

  if (!label){
    const chars = await g.page.evaluate(ids => { openGameGuide(true); showGuideTab("avatar");
      const got = [...document.querySelectorAll("#preGameAvatarGrid .preGameAvatar")].map(e => e.dataset.charId); closeGameGuide();
      return { got, bad:got.filter(id => ids.includes(id)), playable:playableCharacters().filter(c => ids.includes(c.id)).map(c => c.id) }; }, CAMEO_IDS);
    check("11. CHARACTER SELECTION: the nine cameo images remain non-playable", chars.got.length > 0 && !chars.bad.length && !chars.playable.length, chars);
    const eng = await g.page.evaluate(E + ".selfTest()");
    check("P1. one bounded aria-hidden pointer-events:none layer; V2.1.92 modes", eng.version === "V2.1.92" && eng.singleLayer && eng.boundedDom && eng.pointerEventsNone && eng.ariaHidden && eng.noneSelectable
      && ["home","pregame","wheel","level","idle","map"].every(m => eng.modes.includes(m)), eng);
    const econ1 = await g.page.evaluate(ECON);
    const keys1 = await g.page.evaluate(() => Object.keys(localStorage).sort());
    const added = keys1.filter(k => !keys0.includes(k));
    check("P2. presentation only: engine/showcase write no storage keys", !added.some(k => /tl92|ambient|cameo|surprise|dsc|showcase/i.test(k)), { added });
    check("P3. no new page errors (home)", g.ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, g.ctx.__errors);
    void econ0; void econ1;
  }
  await g.ctx.close();
}

/* ---------- 3: pre-game Command Guide ---------- */
async function suitePregame(browser, base, device, label){
  const tag = label ? "[" + label + "] " : "";
  const g = await open(browser, base, { device });
  const econ0 = await g.page.evaluate(ECON);
  await g.page.evaluate(() => openGameGuide(true)); await sleep(300);
  const m0 = await g.page.evaluate(E + ".mode");
  await g.page.evaluate(SAMPLER, ["#preGameStart", "#preGameClose", "#preGameChooseBtn", ".preGameTab", "#preGameTitle"]);
  await sleep(label ? 9000 : 11000);
  for (let i = 0; i < 12; i++){ await g.page.evaluate(E + ".debug.show()"); await sleep(260); }
  const q = await g.page.evaluate(SAMPLE_READ);
  check("3a. " + tag + "PRE-GAME: guide open → friendly cameo layer, one at a time", m0 === "pregame" && q.seq.length >= 2 && q.max === 1 && q.modes.every(m => m === "pregame"), { m0, seq:q.seq.length, max:q.max });
  check("3b. " + tag + "PRE-GAME: START GAME / tabs / close never covered", q.covered === 0 && q.pe.every(v => v === "none"), { covered:q.covered, by:q.coveredBy });
  check("12b. " + tag + "PRE-GAME: no overflow, cameo on screen", q.overflow === 0 && q.outside === 0, { overflow:q.overflow, outside:q.outside });
  await g.page.evaluate(E + ".debug.show()"); await sleep(200);
  await shot(g, "pregame-" + (label || "desktop").replace(/\s/g, ""));
  await g.page.evaluate(() => document.getElementById("preGameStart").scrollIntoView({ block:"center" })); await sleep(100);
  await g.page.evaluate(E + ".debug.show()"); await sleep(150);
  const hit = await g.page.evaluate(() => { const b = document.getElementById("preGameStart"), r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e === b || b.contains(e); });
  await tapSel(g, "#preGameStart"); await sleep(250);
  const after = await g.page.evaluate(`({ open:document.getElementById("preGameCard").classList.contains("show"), vis:${E}.visible, mode:${E}.mode })`);
  check("3c. " + tag + "PRE-GAME: START GAME hit-tests to itself and works immediately during a cameo", hit && !after.open && !after.vis && after.mode !== "pregame", { hit, after });
  const econ1 = await g.page.evaluate(ECON);
  check("3d. " + tag + "PRE-GAME: economy/progression untouched by the cameo layer", econ0 === econ1, {});
  await g.ctx.close();
}

/* ---------- 5 / 7 / 8 / 4: level complete, rescue showcase, collection, wheel ---------- */
async function suiteLevel(browser, base, device, label){
  const tag = label ? "[" + label + "] " : "";
  const g = await open(browser, base, { device, save:LEVEL5_SAVE });
  const card = await g.page.evaluate(`({ show:document.getElementById("levelCard").classList.contains("show"), title:document.getElementById("lcLevel").textContent, rescue:!document.getElementById("lcRescue").hidden, mode:${E}.mode, phase:state.phase })`);
  check("5a. " + tag + "LEVEL COMPLETE: 'LEVEL 5 COMPLETE' card with the -ite rescue is the level idle screen", card.show && /LEVEL 5 COMPLETE/.test(card.title) && card.rescue && card.mode === "level", card);
  const econ0 = await g.page.evaluate(ECON);

  /* 7 — saved -ite art is the focal point */
  const art = await g.page.evaluate(() => { const a = document.querySelector("#lcRescueAvatar .iteAvatar"), r = a.getBoundingClientRect(), av = document.getElementById("lcRescueAvatar");
    const box = document.getElementById("lcRescue").getBoundingClientRect(), inner = document.getElementById("levelInner").getBoundingClientRect();
    return { w:Math.round(r.width), h:Math.round(r.height), left:r.left, right:r.right, vw:innerWidth, vh:innerHeight, reveal:av.dataset.reveal || "", anim:getComputedStyle(av).animationName,
      boxL:box.left, boxR:box.right, innerL:inner.left, innerR:inner.right, title:getComputedStyle(document.querySelector(".lcRescueTitle"), "::before").content,
      role:document.getElementById("lcRescue").getAttribute("role") }; });
  check("7a. " + tag + "SAVED -ITE: image substantially larger (≥ 2.5× the old 56 px) and the card's focal point", art.w >= 140 && art.h >= 140, art);
  check("7b. " + tag + "SAVED -ITE: stays inside the card and the mobile viewport", art.left >= 0 && art.right <= art.vw && art.left >= art.boxL - 1 && art.right <= art.boxR + 1 && art.w <= art.vw * .6, art);
  check("7c. " + tag + "SAVED -ITE: randomized reveal applied (entrance + afterglow)", /^(pop|bounce|rise|burst)\+(glow|splash|shimmer|float)$/.test(art.reveal) && /tl92/.test(art.anim) && /✅/.test(art.title), { reveal:art.reveal, anim:art.anim });
  const reveals = new Set();
  for (let i = 0; i < 30; i++) reveals.add(await g.page.evaluate(() => { window.__GEI_TAPLITES_SHOWCASE__.reveal(); return document.getElementById("lcRescueAvatar").dataset.reveal; }));
  check("7d. " + tag + "SAVED -ITE: reveal varies between completions", reveals.size >= 4, [...reveals]);
  await sleep(1400);
  await shot(g, "level-" + (label || "desktop").replace(/\s/g, ""));

  /* 5 — large cameos, never over the headline, rescue card, FL OZ line or buttons */
  const LEVEL_GUARDS = ["#lcBtn", "#lcLevel", "#lcRescue", ".lcOz"];
  await g.page.evaluate(SAMPLER, LEVEL_GUARDS);
  let natural = 0;
  for (let i = 0; i < 140 && natural < 1; i++){ await sleep(100); natural = await g.page.evaluate(`(${E}.stats().byMode.level || 0)`); }
  for (let i = 0; i < 14; i++){ await g.page.evaluate(E + ".debug.show()"); await sleep(240); }
  const q = await g.page.evaluate(SAMPLE_READ);
  check("5b. " + tag + "LEVEL COMPLETE: a cameo appears on its own after the card settles", natural >= 1, { natural });
  check("5c. " + tag + "LEVEL COMPLETE: large presentation (≥ 96 px), one at a time", Math.min(...q.sizes) >= 96 && q.max === 1, { min:Math.min(...q.sizes), max:Math.max(...q.sizes) });
  check("5d. " + tag + "LEVEL COMPLETE: never covers the headline, rescue card, FL OZ line or CONTINUE", q.covered === 0 && q.pe.every(v => v === "none"), { covered:q.covered, by:q.coveredBy });
  check("12c. " + tag + "LEVEL COMPLETE: no overflow, cameo on screen", q.overflow === 0 && q.outside === 0, { overflow:q.overflow, outside:q.outside });

  /* 8 — collection popout */
  await g.page.evaluate(E + ".debug.show()"); await sleep(150);
  await g.page.evaluate(() => document.getElementById("lcRescue").scrollIntoView({ block:"center" })); await sleep(150);
  await tapSel(g, "#lcRescue"); await sleep(350);
  const col = await g.page.evaluate(() => { const el = document.getElementById("geiIteCollection"), c = el.querySelector(".tl92ColCard").getBoundingClientRect();
    const tiles = [...el.querySelectorAll(".tl92ColTile")], imgs = tiles.map(t => t.querySelector(".iteAvatar").getBoundingClientRect().width);
    return { show:el.classList.contains("show"), role:el.getAttribute("role"), modal:el.getAttribute("aria-modal"), title:document.getElementById("tl92ColTitle").textContent,
      names:tiles.map(t => t.querySelector(".tl92ColName").textContent), minImg:Math.min(...imgs), latest:tiles[0] && tiles[0].classList.contains("isLatest"),
      inView:c.left >= 0 && c.right <= innerWidth && c.top >= 0 && c.bottom <= innerHeight, focus:document.activeElement && document.activeElement.className,
      overflow:document.documentElement.scrollWidth > innerWidth + 1, cameos:document.querySelectorAll(".dscCameo.on").length, mode:window.__GEI_DAM_SURPRISES__.mode }; });
  check("8a. " + tag + "TAP SAVED -ITE CARD: collection popout opens with the saved -ites (newest first)", col.show && col.role === "dialog" && col.modal === "true" && /SAVED -ITES/.test(col.title)
    && col.names.join() === "Israelite,Levite,Danite" && col.latest, col);
  check("8b. " + tag + "COLLECTION: large thumbnails, fits the viewport, close button focused, no overflow", col.minImg >= 90 && col.inView && /tl92ColClose/.test(col.focus) && !col.overflow, col);
  check("8c. " + tag + "COLLECTION: ambient cameos pause while it is open", col.cameos === 0 && col.mode === "", { cameos:col.cameos, mode:col.mode });
  await shot(g, "collection-" + (label || "desktop").replace(/\s/g, ""));
  /* taps inside do nothing to the game; ✕ closes; Esc and backdrop close too */
  const inside = await g.page.evaluate(() => { const r = document.querySelector(".tl92ColGrid").getBoundingClientRect(); return { x:r.left + 10, y:r.top + 10 }; });
  await tap(g, inside.x, inside.y); await sleep(100);
  const still = await g.page.evaluate(() => ({ show:document.getElementById("geiIteCollection").classList.contains("show"), level:document.getElementById("levelCard").classList.contains("show"), phase:state.phase }));
  await tapSel(g, ".tl92ColClose"); await sleep(150);
  const closed1 = await g.page.evaluate(() => ({ show:document.getElementById("geiIteCollection").classList.contains("show"), focus:document.activeElement && document.activeElement.id }));
  await g.page.evaluate(() => window.__GEI_TAPLITES_SHOWCASE__.openCollection()); await sleep(100);
  await g.page.keyboard.press("Escape"); await sleep(100);
  const closed2 = await g.page.evaluate(() => document.getElementById("geiIteCollection").classList.contains("show"));
  await g.page.evaluate(() => window.__GEI_TAPLITES_SHOWCASE__.openCollection()); await sleep(100);
  await tap(g, 4, 4); await sleep(120);
  const closed3 = await g.page.evaluate(() => document.getElementById("geiIteCollection").classList.contains("show"));
  check("8d. " + tag + "COLLECTION: no accidental gameplay interaction; ✕ / Esc / backdrop close it; focus returns", still.show && still.level && still.phase === "levelComplete" && !closed1.show && closed1.focus === "lcRescue" && !closed2 && !closed3, { still, closed1, closed2, closed3 });
  const econ1 = await g.page.evaluate(ECON);
  check("8e. " + tag + "COLLECTION: reads the existing record; saved data / economy unchanged", econ0 === econ1, {});

  /* 4 — Bonus Waterwheel */
  await tapSel(g, "#lcBtn"); await sleep(500);
  const w0 = await g.page.evaluate(`({ show:document.getElementById("bonusCard").classList.contains("show"), mode:${E}.mode })`);
  await g.page.evaluate(SAMPLER, ["#bonusBtn", ".bwTitle", ".bwPointer"]);
  let wn = 0;
  for (let i = 0; i < 60 && wn < 1; i++){ await sleep(100); wn = await g.page.evaluate(`(${E}.stats().byMode.wheel || 0)`); }
  for (let i = 0; i < 12; i++){ await g.page.evaluate(E + ".debug.show()"); await sleep(230); }
  const wq = await g.page.evaluate(SAMPLE_READ);
  check("4a. " + tag + "BONUS WHEEL: waiting to spin → subtle cameos around the wheel", w0.show && w0.mode === "wheel" && wn >= 1 && wq.max === 1, { w0, wn });
  check("4b. " + tag + "BONUS WHEEL: SPIN, title and pointer never covered", wq.covered === 0 && wq.pe.every(v => v === "none"), { covered:wq.covered, by:wq.coveredBy });
  check("12d. " + tag + "BONUS WHEEL: no overflow, cameo on screen", wq.overflow === 0 && wq.outside === 0, { overflow:wq.overflow, outside:wq.outside });
  await g.page.evaluate(E + ".debug.show()"); await sleep(150);
  await shot(g, "wheel-" + (label || "desktop").replace(/\s/g, ""));
  const spinHit = await g.page.evaluate(() => { const b = document.getElementById("bonusBtn"), r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e === b || b.contains(e); });
  await tapSel(g, "#bonusBtn"); await sleep(60);
  const sp = await g.page.evaluate(`({ vis:${E}.visible, on:document.querySelectorAll(".dscCameo.on").length, mode:${E}.mode, spinning:bonus.spinning })`);
  await sleep(2500);
  const sp2 = await g.page.evaluate(`({ on:document.querySelectorAll(".dscCameo.on").length, shownWheel:${E}.stats().byMode.wheel })`);
  check("4c. " + tag + "BONUS WHEEL: SPIN hit-tests to itself; ambient stops the moment the wheel is activated", spinHit && sp.spinning && !sp.vis && sp.on === 0 && sp.mode !== "wheel" && sp2.on === 0, { spinHit, sp, sp2 });
  if (!label) check("P4. no new page errors (level/wheel)", g.ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, g.ctx.__errors);
  await g.ctx.close();
}

/* ---------- 6: try again ---------- */
async function suiteTryAgain(browser, base){
  const g = await open(browser, base);
  const w = await g.page.evaluate(() => { const r = document.getElementById("world").getBoundingClientRect(); return { x:r.left + r.width * .45, y:r.top + r.height * .55 }; });
  await tap(g, w.x, w.y); await sleep(150);
  await g.page.evaluate(() => handleDayTimeout()); await sleep(300);
  const m = await g.page.evaluate(`({ mode:${E}.mode, music:DAMSoundtrack.playing })`);
  await g.page.evaluate(SAMPLER, ["#retryDayBtn", "#timeUpTitle"]);
  await sleep(12000);
  const q = await g.page.evaluate(SAMPLE_READ);
  const music = await g.page.evaluate(() => DAMSoundtrack.playing);
  check("6a. TRY AGAIN: music keeps playing and the random cameo loop continues", m.mode === "idle" && m.music && music && q.seq.length >= 2 && q.max === 1 && noRepeatWithin(q.seq, 1), { m, music, seq:q.seq });
  check("6b. TRY AGAIN: TRY DAY AGAIN never covered", q.covered === 0, { covered:q.covered, by:q.coveredBy });
  for (let i = 0; i < 80; i++){ if (await g.page.evaluate(E + ".visible")) break; await sleep(100); }
  const pt = await g.page.evaluate(() => { const r = document.getElementById("timeUpCard").getBoundingClientRect(); return { x:r.left + 12, y:r.bottom - 14 }; });
  await tap(g, pt.x, pt.y); await sleep(80);
  const a = await g.page.evaluate(`({ on:document.querySelectorAll(".dscCameo.on").length, mode:${E}.mode, phase:state.phase })`);
  check("6c. TRY AGAIN: a tap stops the sequence, removes the cameo, returns to play", a.on === 0 && a.mode === "" && a.phase === "playing", a);
  await g.ctx.close();
}

/* ---------- reduced motion ---------- */
async function suiteReduced(browser, base){
  const g = await open(browser, base, { ctx:{ reducedMotion:"reduce" }, save:LEVEL5_SAVE });
  const r = await g.page.evaluate(() => { const c = window.__GEI_DAM_SURPRISES__.debug.show({ tier:"ultra" }); const el = document.querySelector(".dscCameo");
    return { c, cls:el.className, parts:[...document.querySelectorAll(".dscPart")].filter(p => getComputedStyle(p).display !== "none").length,
      reveal:getComputedStyle(document.getElementById("lcRescueAvatar")).animationName, glow:getComputedStyle(document.querySelector("#lcRescueAvatar .iteAvatar")).animationName }; });
  check("R1. reduced motion: level cameo fades/scales only; rescue reveal is a simple fade", r.c && r.c.entry === "fade" && r.c.exit === "fade" && !/fx-|sync/.test(r.cls) && r.parts === 0 && r.reveal === "tl92Fade" && r.glow === "none", r);
  await g.ctx.close();
}

/* ---------- logo placements (map / vault / profile) ---------- */
async function suiteLogos(browser, base){
  const g = await open(browser, base);
  await tapSel(g, "#damMapLauncherBtn"); await sleep(500);
  const map = await g.page.evaluate(() => { const i = document.querySelector("#geiDamMapPage .dmwTitle img.tl92LogoMap"); return i && i.src; });
  await tapSel(g, "#geiMapBack"); await sleep(300);
  const marks = await g.page.evaluate(() => ({ vault:(document.querySelector("#radioPanel img.tl92LogoVault") || {}).src, profile:(document.querySelector("#profilePanel .tl92PanelMark img") || {}).src,
    chars:(document.querySelector("#charactersPanel .tl92PanelMark img") || {}).src, count:document.querySelectorAll("img.tl92Logo").length }));
  check("L1. Wet logo in the DAM Map header; standard logo marks in Song Vault / Profile / Characters (not everywhere)", map === LOGO_WET && marks.vault === LOGO_STD && marks.profile === LOGO_STD && marks.chars === LOGO_STD && marks.count <= 7, { map, marks });
  await g.ctx.close();
  /* broken logo art → the original text comes back */
  const ctx = await browser.newContext();
  await ctx.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  const p = await ctx.newPage(); await p.goto(base + "/", { waitUntil:"load" }); await sleep(800);
  const fb = await p.evaluate(() => ({ header:document.getElementById("gameLogo").textContent.trim(), splash:document.querySelector(".geiSplashTitle").textContent.trim() }));
  check("L2. logo image fails → 'TAP LITES' text fallback (header + splash)", fb.header === "TAP LITES" && fb.splash === "TAP LITES", fb);
  await ctx.close();
}

const pw = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await pw.chromium.launch();
try {
  await suiteHome(browser, base);
  await suitePregame(browser, base);
  await suiteLevel(browser, base);
  await suiteTryAgain(browser, base);
  await suiteReduced(browser, base);
  await suiteLogos(browser, base);
  for (const d of ["Pixel 7", "iPhone 13"]){
    await suiteHome(browser, base, pw.devices[d], d);
    await suitePregame(browser, base, pw.devices[d], d);
    await suiteLevel(browser, base, pw.devices[d], d);
  }
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally { await browser.close(); srv.close(); }
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ version:"V2.1.92", passed:results.length - failed.length, failed:failed.length, results }, null, 1));
process.exit(failed.length ? 1 : 0);
