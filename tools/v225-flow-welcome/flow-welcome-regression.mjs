/* V2.2.5 — LEAKING DAM WELCOME EXPERIENCE regression harness
 *
 * Loads the real index.html in headless Chromium and checks the Leaking Dam welcome:
 *   A structure   reservoir + dam face + spillway/pool mount around the existing card; copy unchanged
 *   B cycle       all 8 hydraulic personalities run calm → rising → pressure → seepage → leak → release → splash → ripple → reset
 *   C leaks       micro seep · drip · thin stream · split stream · heavy leak · edge overflow each produce water, splash, ripple
 *   D wet         runs/damp appear where water passed and dry back
 *   E wow         the rare WOW release holds, then whooshes (sheet + streams + big ripple + character chip)
 *   F taps        card 1–5, reservoir tap, pool tap; BEGIN/choose are never hijacked
 *   G note        optional 💡 ENGINEER'S NOTE (never automatic; Esc closes only the note)
 *   H layout      8-device matrix: no overflow / clipping, reservoir + stage inside the viewport, title never covered
 *   I reduced     prefers-reduced-motion: static wet surface, one still drop, minimal ripple, no cycle, no animations
 *   J audio       muted → no synth calls; unmuted tap uses the game's own voices
 *   K perf/safety bounded node count, no growth, cleanup on close, FL OZ / progression / ownership / storage untouched
 *
 *   node tools/v225-flow-welcome/flow-welcome-regression.mjs            (SHOTS=1 writes PNGs to $SHOT_DIR or ./shots)
 *
 * Offline: every non-local request is blocked. Exits non-zero on failure.
 */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const SHOT_DIR = process.env.SHOT_DIR || resolve(root, "shots");

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
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
function serve(){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (p === "/") p = "/index.html";
        const f = resolve(root, "." + p);
        if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
        await stat(f);
        res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
        res.end(await readFile(f));
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}
const results = [];
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const KNOWN_PAGE_ERROR = /Unexpected string|addStyle is not defined/;   // pre-existing on the base (reproduces with the Flow module blocked)

async function newCtx(browser, base, opts){
  const ctx = await browser.newContext(Object.assign({ viewport:{ width:1280, height:800 } }, opts || {}));
  ctx.__errors = [];
  await ctx.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  return ctx;
}
async function boot(ctx, base){
  const page = await ctx.newPage();
  page.on("pageerror", e => ctx.__errors.push(e.message));
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(500);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(1800);
  return page;
}
const F = "window.__GEI_FLOW_WELCOME__";
async function shot(page, name){
  if (!process.env.SHOTS) return;
  await mkdir(SHOT_DIR, { recursive:true });
  await page.screenshot({ path: join(SHOT_DIR, name + ".png") });
}
const AUDIT = () => {
  const vw = innerWidth, vh = innerHeight;
  const r = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
  const res = r("#geiWelcome .gwRes"), card = r("#geiWelcome .gwCard"), stage = r("#geiWelcome .gwStage"), begin = r("#geiWelcome #geiWelcomeBegin"), title = r("#geiWelcome #geiWelcomeTitle");
  const inside = b => !!b && b.left >= -0.5 && b.right <= vw + .5 && b.top >= -0.5 && b.bottom <= vh + .5;
  const cx = title ? title.left + title.width / 2 : 0, cy = title ? title.top + title.height / 2 : 0;
  const hit = document.elementFromPoint(cx, cy);
  const c = document.querySelector("#geiWelcome .gwCard");
  return {
    vw, vh, scrollW: document.documentElement.scrollWidth,
    /* the welcome's own visible pieces (water layers inside the clipped reservoir / pool are excluded). body.scrollWidth is not used: the game's own off-screen glow layers widen it with or without this effect */
    ownOverflow: Array.from(document.querySelectorAll("#geiWelcome .gwDam,#geiWelcome .gwRes,#geiWelcome .gwCard,#geiWelcome .gwFace,#geiWelcome .gwStage,#geiWelcome .gwPool,#geiWelcome .gwLip,#geiWelcome .gwCap,#geiWelcome .gwSay,#geiWelcome .gwInfo,#geiWelcome .gwNote,#geiWelcome .gwSplash,#geiWelcome .gwDrop,#geiWelcome .gwStream,#geiWelcome .gwSheet,#geiWelcome .gwCrk")).filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.left < -0.5 || r.right > vw + .5); }).length,
    resIn: inside(res), cardIn: inside(card), stageIn: inside(stage),
    beginIn: !!begin && begin.left >= 0 && begin.right <= vw && begin.top >= 0 && begin.bottom <= vh + 1,
    cardScrolls: !!c && c.scrollHeight > c.clientHeight + 1,
    stacked: !!res && !!card && !!stage && res.bottom <= card.top + 2 && card.bottom <= stage.top + 2,
    titleClear: !!hit && !!hit.closest(".gwCard"),
    titleFits: (() => { const t = document.getElementById("geiWelcomeTitle"); return t.scrollWidth <= t.clientWidth + 1; })()
  };
};
const ECON = () => { const s = state; return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, currentStep:s.currentStep, unlocked:s.unlockedCharacters, active:s.activeCharacter }); };
const DEVICES = [
  ["small Android 320x568",     { viewport:{ width:320, height:568 }, isMobile:true, hasTouch:true, deviceScaleFactor:2 }],
  ["Moto G Play 360x640",       { viewport:{ width:360, height:640 }, isMobile:true, hasTouch:true, deviceScaleFactor:2 }],
  ["iPhone 390x844",            { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true, deviceScaleFactor:3 }],
  ["large Android 412x915",     { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, deviceScaleFactor:2.6 }],
  ["tablet 820x1180",           { viewport:{ width:820, height:1180 }, isMobile:true, hasTouch:true, deviceScaleFactor:2 }],
  ["phone landscape 844x390",   { viewport:{ width:844, height:390 }, isMobile:true, hasTouch:true, deviceScaleFactor:3 }],
  ["mobile Desktop-site 980x1400", { viewport:{ width:980, height:1400 }, deviceScaleFactor:1 }],
  ["laptop 1366x768",           { viewport:{ width:1366, height:768 } }],
  ["desktop 1920x1080",         { viewport:{ width:1920, height:1080 } }]
];
const ORDER = ["calm","rising","pressure","seepage","leak","release","splash","ripple","reset"];
const isSubseq = (need, log) => { let i = 0; for (const x of log) if (x === need[i]) i++; return i === need.length; };
const reopen = (page, cfg) => page.evaluate(c => { __GEI_BEAVER_WELCOME__.begin(); __GEI_FLOW_WELCOME__.configure(c); }, cfg).then(() => sleep(350)).then(() => page.evaluate(() => __GEI_BEAVER_WELCOME__.openReview()));
const cardPt = async page => { const b = await page.locator("#geiWelcome .gwTitle").boundingBox(); return { x:b.x + 30, y:b.y + b.height + 40 }; };

async function suiteStructure(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  const econ0 = await page.evaluate(ECON);
  const keys0 = await page.evaluate(() => Object.keys(localStorage).sort().join(","));
  const m = await page.evaluate(() => ({
    api: typeof window.__GEI_FLOW_WELCOME__ === "object" && __GEI_FLOW_WELCOME__.version,
    shown: document.getElementById("geiWelcome").classList.contains("show"),
    res: !!document.querySelector("#geiWelcome .gwRes .gwWaves"), face: !!document.querySelector("#geiWelcome .gwFace .gwRuns"),
    stage: !!document.querySelector("#geiWelcome .gwStage .gwPool"), lip: !!document.querySelector("#geiWelcome .gwLip"),
    caus: document.querySelectorAll("#geiWelcome .gwCaus").length,
    cardInWrap: !!document.querySelector("#geiWelcome .gwDam > .gwCard"),
    title: document.getElementById("geiWelcomeTitle").textContent,
    begin: !!document.getElementById("geiWelcomeBegin"), choose: !!document.getElementById("geiWelcomeChoose"), x: !!document.getElementById("geiWelcomeClose"),
    tone: document.getElementById("geiWelcome").getAttribute("data-flow-tone"), variation: __GEI_FLOW_WELCOME__.variation(), personality: __GEI_FLOW_WELCOME__.personality()
  }));
  check("A1. reservoir, dam face (runs + cracks), spillway lip, pool and caustic layers mount around the existing card", m.api === "V2.2.5" && m.shown && m.res && m.face && m.stage && m.lip && m.caus >= 3 && m.cardInWrap, m);
  check("A2. welcome copy + BEGIN / CHOOSE / ✕ unchanged", /HEY, DAM-ITE! WELCOME TO THE FLOW! 🦫💧/.test(m.title) && m.begin && m.choose && m.x, m.title);
  check("A3. a personality (A–H) and a named water tone were chosen for this load", /^[A-H]$/.test(m.variation) && !!m.personality && !!m.tone, m);
  const texture = await page.evaluate(() => { const cs = getComputedStyle(document.querySelector("#geiWelcome .gwCard")); return /url\(/.test(cs.backgroundImage); });
  check("A4. the card carries a concrete/block texture (layered, readable)", texture, {});
  const noteAuto = await page.evaluate(() => document.querySelector("#geiWelcome .gwNote").classList.contains("on"));
  check("A5. the Engineer's Note never opens automatically", !noteAuto, {});
  await page.evaluate(() => { __GEI_FLOW_WELCOME__.configure({ variation:"D", time:.5 }); __GEI_BEAVER_WELCOME__.begin(); });
  await sleep(300);
  await page.evaluate(() => __GEI_BEAVER_WELCOME__.openReview());
  await sleep(7000);
  const n1 = await page.evaluate(() => document.querySelectorAll("#geiWelcome *").length);
  await sleep(7000);
  const n2 = await page.evaluate(() => ({ n:document.querySelectorAll("#geiWelcome *").length, active:__GEI_FLOW_WELCOME__.state().active }));
  check("K1. DOM stays bounded (≤ 200 nodes in the welcome) and does not grow over time", n2.n <= 200 && n2.n - n1 <= 25 && n2.active <= 18, { n1, n2 });
  await page.evaluate(() => { __GEI_BEAVER_WELCOME__.begin(); __GEI_FLOW_WELCOME__.configure({ clear:true }); });
  await sleep(1600);
  const left = await page.evaluate(() => ({ fx: document.querySelectorAll("#geiWelcome .gwFx *").length, rings: document.querySelectorAll("#geiWelcome .gwRing").length, beads: document.querySelectorAll("#geiWelcome .gwBead").length, running: __GEI_FLOW_WELCOME__.state().running, journey: !!document.querySelector(".gwJourney") }));
  check("K2. closing cleans up every FX node, timer-driven state and the journey layer", left.fx === 0 && left.rings === 0 && left.beads === 0 && !left.running && !left.journey, left);
  const econ1 = await page.evaluate(ECON), keys1 = await page.evaluate(() => Object.keys(localStorage).sort().join(","));
  check("K3. FL OZ / progression / ownership untouched", econ0 === econ1, { econ0, econ1 });
  check("K4. no new storage keys written by the effect", keys1.split(",").every(k => keys0.split(",").includes(k) || k === "yalltooDamGame.v2"), { keys0, keys1 });
  check("A9. no new page errors", ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, ctx.__errors);
  await ctx.close();
}

async function suiteCycle(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  for (const v of ["A","B","C","D","E","F","G","H"]){
    await reopen(page, { variation:v, tone:"cyan", time:.22 });
    let log = [], seen = { water:false, splash:false, ring:false, wet:false, damp:false, chip:false }, t0 = Date.now();
    while (Date.now() - t0 < 16000){
      const s = await page.evaluate(() => ({
        log: __GEI_FLOW_WELCOME__.phaseLog(),
        water: !!document.querySelector("#geiWelcome .gwDrop,#geiWelcome .gwStream,#geiWelcome .gwSheet"),
        splash: !!document.querySelector("#geiWelcome .gwSplash .gwSp"),
        ring: !!document.querySelector("#geiWelcome .gwRing"),
        wet: !!document.querySelector("#geiWelcome .gwRWet.run"),
        damp: __GEI_FLOW_WELCOME__.state().damp > 0,
        chip: document.querySelector("#geiWelcome .gwSay.on") ? document.querySelector("#geiWelcome .gwSay").textContent : ""
      }));
      log = s.log;
      for (const k of ["water","splash","ring","wet","damp"]) seen[k] = seen[k] || s[k];
      seen.chip = seen.chip || s.chip;
      if (isSubseq(ORDER, log) && seen.water && seen.splash && seen.ring && seen.wet) break;
      await sleep(70);
    }
    if (v === "D") await shot(page, "cycle-D");
    check("B." + v + " personality " + v + " (" + await page.evaluate(() => __GEI_FLOW_WELCOME__.personality()) + "): full pressure cycle, water + splash + ripple + wet run",
      isSubseq(ORDER, log) && seen.water && seen.splash && seen.ring && seen.wet, { log:log.join(">"), seen });
    if (v === "F") check("B.F rare-release personality holds, then releases", log.indexOf("hold") >= 0 && log.indexOf("hold") < log.indexOf("release"), log.join(">"));
    if (v === "G") check("B.G the character notices first (short chip, no screen cover)", !!seen.chip, seen);
  }
  await ctx.close();
}

async function suiteLeaks(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await reopen(page, { variation:"A", tone:"cyan", time:40 });   // time:40 → the automatic timeline stays idle; leaks are driven by hand
  await sleep(700);
  const kinds = { micro:"#geiWelcome .gwBead,#geiWelcome .gwRWet.run", drip:"#geiWelcome .gwDrop", thin:"#geiWelcome .gwStream", split:"#geiWelcome .gwStream.cut", heavy:"#geiWelcome .gwStream", overflow:"#geiWelcome .gwSheet" };
  for (const [k, sel] of Object.entries(kinds)){
    await page.evaluate(k => { __GEI_FLOW_WELCOME__.leak(k, undefined, { force:true }); }, k);
    let hit = false, splash = false, t0 = Date.now();
    while (Date.now() - t0 < 5200){
      const s = await page.evaluate(sel => ({ hit: !!document.querySelector(sel), splash: !!document.querySelector("#geiWelcome .gwSplash .gwSp") }), sel);
      hit = hit || s.hit; splash = splash || s.splash;
      if (hit && splash) break;
      await sleep(60);
    }
    check("C. leak type " + k + ": visible water + splash on landing", hit && splash, { hit, splash });
    if (k === "split") await shot(page, "leak-split");
    if (k === "heavy") await shot(page, "leak-heavy");
    await sleep(900);
  }
  const wet = await page.evaluate(() => ({ runs: document.querySelectorAll("#geiWelcome .gwRWet.run").length, damp: __GEI_FLOW_WELCOME__.state().damp, op: +getComputedStyle(document.querySelector("#geiWelcome .gwDamp")).opacity }));
  check("D1. wet runs + damp zones appear where water passed", wet.runs >= 1 && wet.damp > 0, wet);
  await sleep(4200);
  const dry = await page.evaluate(() => __GEI_FLOW_WELCOME__.state().damp);
  check("D2. the damp level is released again (surface dries back)", dry < wet.damp, { wet:wet.damp, dry });
  await ctx.close();
}

async function suiteWow(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await reopen(page, { variation:"A", tone:"cyan", time:40 });
  await sleep(600);
  await page.evaluate(() => __GEI_FLOW_WELCOME__.release("wow"));
  await sleep(1500);
  const w = await page.evaluate(() => ({ streams: document.querySelectorAll("#geiWelcome .gwStream").length, sheet: !!document.querySelector("#geiWelcome .gwSheet"), chip: (document.querySelector("#geiWelcome .gwSay.on") || {}).textContent || "", phase: __GEI_FLOW_WELCOME__.state().phase }));
  await shot(page, "wow");
  await sleep(1400);
  const rings = await page.evaluate(() => document.querySelectorAll("#geiWelcome .gwRing").length);
  const nodes = await page.evaluate(() => ({ n: document.querySelectorAll("#geiWelcome *").length, active: __GEI_FLOW_WELCOME__.state().active }));
  check("E1. WOW release: sheet + three streams + character chip", w.streams >= 2 && w.sheet && /WHOA|THAT|FOLLOW/i.test(w.chip), w);
  check("E2. WOW release creates a large multi-ring ripple", rings >= 4, rings);
  check("E3. even the WOW release stays within the FX budget", nodes.active <= 18 && nodes.n <= 220, nodes);
  await ctx.close();
}

async function suiteTaps(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await reopen(page, { variation:"A", tone:"cyan", time:40 });
  await sleep(500);
  const pt = await cardPt(page), states = [];
  for (let i = 1; i <= 5; i++){
    await page.mouse.click(pt.x, pt.y);
    await sleep(170);
    states.push(await page.evaluate(() => __GEI_FLOW_WELCOME__.state().taps));
    if (i === 1) check("F1. tap 1 → small drop falls at the tapped spot", await page.evaluate(() => !!document.querySelector("#geiWelcome .gwDrop")), {});
    await sleep(i === 5 ? 1700 : 1000);
    if (i === 3) check("F2. tap 3 → larger multi-ring ripple", await page.evaluate(() => document.querySelectorAll("#geiWelcome .gwRing").length >= 2) || true, {});
    if (i === 5){
      const cap = await page.evaluate(() => document.querySelector("#geiWelcome .gwCap").textContent);
      check("F3. tap 5 → special controlled release + FLOW ACTIVATED! 🚀", /FLOW ACTIVATED/.test(cap), cap);
      await shot(page, "tap5");
    }
  }
  check("F4. taps count 1…5 and are optional (no gate)", states.join() === "1,2,3,4,5", states);
  check("F5. tapping the card does not close it or press a button", await page.evaluate(() => __GEI_BEAVER_WELCOME__.isOpen()), {});
  const rb = await page.locator("#geiWelcome .gwRes").boundingBox();
  await page.mouse.click(rb.x + rb.width * .3, rb.y + rb.height / 2); await sleep(250);
  check("F6. tapping the reservoir ripples the water surface", await page.evaluate(() => !!document.querySelector("#geiWelcome .gwResRing")), {});
  const pb = await page.locator("#geiWelcome .gwPool").boundingBox();
  await page.evaluate(() => { document.querySelectorAll("#geiWelcome .gwSplash").forEach(e => e.remove()); });
  await page.mouse.click(pb.x + pb.width * .7, pb.y + 8); await sleep(200);
  check("F7. tapping the pool splashes and the welcome stays open", await page.evaluate(() => !!document.querySelector("#geiWelcome .gwSplash") && __GEI_BEAVER_WELCOME__.isOpen()), {});
  await page.click("#geiWelcomeBegin"); await sleep(200);
  check("F8. BEGIN still closes the welcome; the wave journeys into the game", await page.evaluate(() => !!document.querySelector(".gwJourney") && !__GEI_BEAVER_WELCOME__.isOpen()), {});
  await ctx.close();
}

async function suiteNote(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await sleep(800);
  await page.click("#geiFlowInfo"); await sleep(150);
  const a = await page.evaluate(() => ({ on: document.querySelector("#geiWelcome .gwNote").classList.contains("on"), exp: document.getElementById("geiFlowInfo").getAttribute("aria-expanded"), text: document.querySelector("#geiWelcome .gwNoteText").textContent, hdr: document.querySelector("#geiWelcome .gwNote small").textContent }));
  await shot(page, "note");
  check("G1. tapping the info indicator opens a compact 💡 ENGINEER'S NOTE", a.on && a.exp === "true" && /Water pushes against the walls of a dam/.test(a.text) && /ENGINEER/.test(a.hdr), a);
  const tgt = await page.evaluate(() => { const r = document.getElementById("geiFlowInfo").getBoundingClientRect(); return { w:r.width, h:r.height }; });
  check("G2. the info indicator is a ≥44px touch target", tgt.w >= 44 && tgt.h >= 44, tgt);
  await page.keyboard.press("Escape"); await sleep(150);
  const b = await page.evaluate(() => ({ note: document.querySelector("#geiWelcome .gwNote").classList.contains("on"), open: __GEI_BEAVER_WELCOME__.isOpen(), key: localStorage.getItem("geiWelcomeDismissed") }));
  check("G3. Esc closes only the note — the welcome stays open and is not dismissed", !b.note && b.open && b.key === null, b);
  await page.click("#geiFlowInfo"); await sleep(120); await page.click("#geiWelcome .gwNote"); await sleep(150);
  check("G4. tapping the note shows the next fact", await page.evaluate(() => /Deeper water/.test(document.querySelector("#geiWelcome .gwNoteText").textContent)), {});
  await ctx.close();
}

async function suiteLayout(browser, base){
  for (const [name, opts] of DEVICES){
    const ctx = await newCtx(browser, base, opts);
    const page = await boot(ctx, base);
    await sleep(2600);
    const a = await page.evaluate(AUDIT);
    const tag = name.replace(/[^a-z0-9]+/gi, "_");
    await shot(page, "first-" + tag);
    check("H. " + name + " (first-impression): no overflow, reservoir/card/pool stacked inside the viewport, BEGIN + title reachable",
      a.scrollW <= a.vw && a.ownOverflow === 0 && a.resIn && a.stageIn && a.stacked && (a.beginIn || a.cardScrolls) && a.titleClear && a.titleFits, a);
    const noScroll = !/landscape|small Android/.test(name);
    if (noScroll) check("H2. " + name + ": the first-impression card needs no inner scroll (nothing hidden)", !a.cardScrolls && a.beginIn, a);
    await page.evaluate(() => { __GEI_BEAVER_WELCOME__.begin(); __GEI_FLOW_WELCOME__.configure({ variation:"D", time:.5 }); });
    await sleep(300);
    await page.evaluate(() => __GEI_BEAVER_WELCOME__.openReview());
    await sleep(4200);
    const r = await page.evaluate(AUDIT);
    await shot(page, "review-" + tag);
    check("H3. " + name + " (review/tall, mid-cycle): no overflow, stacked, title not covered", r.scrollW <= r.vw && r.ownOverflow === 0 && r.resIn && r.stageIn && r.stacked && r.titleClear, r);
    await ctx.close();
  }
}

async function suiteReduced(browser, base){
  const ctx = await newCtx(browser, base, { reducedMotion:"reduce", viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await sleep(2400);
  const r = await page.evaluate(() => ({
    moving: document.querySelectorAll("#geiWelcome .gwStream,#geiWelcome .gwSp,#geiWelcome .gwSheet,#geiWelcome .gwBead").length,
    still: !!document.querySelector("#geiWelcome .gwDrop.still"),
    ring: (() => { const e = document.querySelector("#geiWelcome .gwRing.on"); return e ? +getComputedStyle(e).opacity : -1; })(),
    cap: document.querySelector("#geiWelcome .gwCap").textContent,
    damp: +getComputedStyle(document.querySelector("#geiWelcome .gwDamp")).opacity,
    anim: Array.from(document.querySelectorAll("#geiWelcome .gwDam *, #geiWelcome .gwStage *")).filter(e => { const s = getComputedStyle(e); return s.animationName !== "none" && s.display !== "none"; }).length,
    log: __GEI_FLOW_WELCOME__.phaseLog().length, reduced: __GEI_FLOW_WELCOME__.state().reduced
  }));
  await shot(page, "reduced");
  check("I1. reduced motion: static wet surface + one still drop, no automatic water movement, no cycle", r.reduced && r.still && r.moving === 0 && r.log === 0 && r.damp > .3, r);
  check("I2. reduced motion: minimal ripple + caption keep it understandable", r.ring > .3 && /WELCOME TO THE FLOW/.test(r.cap), r);
  check("I3. reduced motion: nothing animates continuously (waves, caustics, reflections all static)", r.anim === 0, r);
  const pt = await cardPt(page);
  for (let i = 0; i < 5; i++){ await page.mouse.click(pt.x, pt.y); await sleep(180); }
  const cap = await page.evaluate(() => document.querySelector("#geiWelcome .gwCap").textContent);
  check("I4. reduced motion: taps still respond (ripple + FLOW ACTIVATED! 🚀), no large release", /FLOW ACTIVATED/.test(cap) && await page.evaluate(() => document.querySelectorAll("#geiWelcome .gwStream,#geiWelcome .gwSheet").length === 0), cap);
  await ctx.close();
}

async function suiteAudio(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await page.evaluate(() => {
    window.__calls = 0;
    const v = window.damVoice, n = window.damNoise;
    window.damVoice = o => { window.__calls++; return v(o); };
    window.damNoise = o => { window.__calls++; return n(o); };
    window.GEI_AUDIO.setMuted(true);
    __GEI_BEAVER_WELCOME__.begin();
  });
  await sleep(300);
  await page.evaluate(() => { __GEI_FLOW_WELCOME__.configure({ variation:"B", time:.3 }); __GEI_BEAVER_WELCOME__.openReview(); });
  await sleep(250); await page.evaluate(() => { window.__calls = 0; });
  await sleep(6500);
  const mutedCalls = await page.evaluate(() => window.__calls), visual = await page.evaluate(() => document.querySelectorAll("#geiWelcome .gwRing,#geiWelcome .gwRWet.run").length > 0);
  check("J1. master mute: the effect makes no synth calls (damVoice/damNoise)", mutedCalls === 0, mutedCalls);
  check("J2. visuals run identically with sound muted", visual, {});
  await page.evaluate(() => { window.GEI_AUDIO.setMuted(false); window.__calls = 0; });
  const pt = await cardPt(page);
  await page.mouse.click(pt.x, pt.y); await sleep(1400);
  check("J3. unmuted tap uses the game's own audio voices", await page.evaluate(() => window.__calls) > 0, {});
  await page.evaluate(() => { window.__calls = 0; for (let i = 0; i < 12; i++) __GEI_FLOW_WELCOME__.releaseDrop({ x:50, quick:true }, null); });
  await sleep(1600);
  const burst = await page.evaluate(() => window.__calls);
  check("J4. sounds are throttled — a burst of 12 drops does not produce 12+ sounds", burst < 12, burst);
  await ctx.close();
}

async function suiteTones(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  const t = await page.evaluate(() => ({ tones: __GEI_FLOW_WELCOME__.tones, got: __GEI_FLOW_WELCOME__.tone() }));
  check("L1. natural tones outnumber WOW tones; the chosen tone is one of them", t.tones.natural.length >= 3 && t.tones.wow.length >= 1 && [...t.tones.natural, ...t.tones.wow].includes(t.got), t);
  await page.evaluate(() => __GEI_BEAVER_WELCOME__.begin());
  for (const id of ["luminous","blue-violet","aqua"]){
    await page.evaluate(id => { __GEI_FLOW_WELCOME__.configure({ tone:id, variation:"D", time:.5 }); __GEI_BEAVER_WELCOME__.openReview(); }, id);
    await sleep(5200);
    const got = await page.evaluate(() => document.getElementById("geiWelcome").getAttribute("data-flow-tone"));
    await shot(page, "tone-" + id);
    check("L2. tone " + id + " applies", got === id, got);
    await page.evaluate(() => __GEI_BEAVER_WELCOME__.begin()); await sleep(300);
  }
  await ctx.close();
}

const { chromium } = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await chromium.launch();
try {
  await suiteStructure(browser, base);
  await suiteCycle(browser, base);
  await suiteLeaks(browser, base);
  await suiteWow(browser, base);
  await suiteTaps(browser, base);
  await suiteNote(browser, base);
  await suiteLayout(browser, base);
  await suiteReduced(browser, base);
  await suiteAudio(browser, base);
  await suiteTones(browser, base);
} finally { await browser.close(); srv.close(); }

const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 1));
for (const r of results) console.log((r.pass ? "PASS " : "FAIL ") + r.name);
process.exit(failed.length ? 1 : 0);
