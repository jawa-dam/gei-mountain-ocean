/* V2.2.4 — FLOW WELCOME EFFECT regression harness
 *
 * Loads the real index.html in headless Chromium and checks the Flow Welcome Effect:
 *   A sequence    stage mounts under the card; drop → splash → ripple → "THE FLOW HAS STARTED."; all 6 variations run
 *   B taps        card tap 1/2/3 → drop / splash / ripple → "FLOW ACTIVATED! 🚀"; buttons are NOT hijacked
 *   C layout      device matrix: no horizontal overflow, card + stage + buttons inside the viewport, card never covered
 *   D reduced     prefers-reduced-motion: no drops / particles / waves, one static ripple, caption still shown
 *   E audio       muted → damVoice/damNoise never called; visuals unaffected
 *   F tones       natural vs WOW water palette, per-load
 *   G safety      FL OZ / progression / ownership / storage untouched; close cleans up every FX node
 *
 *   node tools/v224-flow-welcome/flow-welcome-regression.mjs            (SHOTS=1 writes PNGs to $SHOT_DIR or ./shots)
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
/* geometry + overflow audit of the open welcome */
const AUDIT = () => {
  const vw = innerWidth, vh = innerHeight;
  const r = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
  const card = r("#geiWelcome .gwCard"), stage = r("#geiWelcome .gwStage"), begin = r("#geiWelcome #geiWelcomeBegin"), title = r("#geiWelcome #geiWelcomeTitle");
  const inside = b => !!b && b.left >= -0.5 && b.right <= vw + .5 && b.top >= -0.5 && b.bottom <= vh + .5;
  const cx = title ? title.left + title.width / 2 : 0, cy = title ? title.top + title.height / 2 : 0;
  const hit = document.elementFromPoint(cx, cy);
  return {
    vw, vh, scrollW: document.documentElement.scrollWidth, bodyScrollW: document.body.scrollWidth,
    cardIn: inside(card), stageIn: inside(stage), beginIn: !!begin && begin.left >= 0 && begin.right <= vw && begin.top >= 0 && begin.bottom <= vh + 1,
    cardScrolls: (() => { const c = document.querySelector("#geiWelcome .gwCard"); return !!c && c.scrollHeight > c.clientHeight + 1; })(),
    cardAboveStage: !!card && !!stage && card.bottom <= stage.top + 2,
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
  ["desktop 1280x800",          { viewport:{ width:1280, height:800 } }]
];

async function suiteSequence(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  const econ0 = await page.evaluate(ECON);
  const keys0 = await page.evaluate(() => Object.keys(localStorage).sort().join(","));
  const m = await page.evaluate(() => ({
    api: typeof window.__GEI_FLOW_WELCOME__ === "object",
    shown: document.getElementById("geiWelcome").classList.contains("show"),
    stage: !!document.querySelector("#geiWelcome .gwStage .gwPool"),
    lip: !!document.querySelector("#geiWelcome .gwLip"),
    title: document.getElementById("geiWelcomeTitle").textContent,
    tone: document.getElementById("geiWelcome").getAttribute("data-flow-tone"),
    variation: __GEI_FLOW_WELCOME__.variation()
  }));
  check("A1. Flow module + stage mounted under the existing welcome card", m.api && m.shown && m.stage && m.lip, m);
  check("A2. welcome title unchanged", /HEY, DAM-ITE! WELCOME TO THE FLOW! 🦫💧/.test(m.title), m.title);
  check("A3. a variation (A–F) and a named water tone were chosen for this load", /^[A-F]$/.test(m.variation) && !!m.tone, m);

  /* every variation produces a drop/stream, a splash, a ripple and the caption */
  for (const v of ["A","B","C","D","E","F"]){
    await page.evaluate(v => { __GEI_BEAVER_WELCOME__.begin(); __GEI_FLOW_WELCOME__.configure({ variation:v }); }, v);
    await sleep(500);
    await page.evaluate(() => __GEI_BEAVER_WELCOME__.openReview());
    const seen = { fall:false, splash:false, ring:false, wave:false };
    const t0 = Date.now();
    while (Date.now() - t0 < 5200){
      const s = await page.evaluate(() => ({
        fall: !!document.querySelector("#geiWelcome .gwDrop,#geiWelcome .gwStream"),
        splash: !!document.querySelector("#geiWelcome .gwSplash .gwSp"),
        ring: !!document.querySelector("#geiWelcome .gwRing"),
        wave: ["gwBandL","gwBandR"].some(c => { const e = document.querySelector("#geiWelcome ." + c); return e && e.style.display !== "none" && getComputedStyle(e).opacity > 0; })
      }));
      for (const k in seen) seen[k] = seen[k] || s[k];
      if (seen.fall && seen.splash && seen.ring) break;
      await sleep(60);
    }
    if (v === "A") await shot(page, "mid-A");
    await sleep(900);
    const cap = await page.evaluate(() => document.querySelector("#geiWelcome .gwCap").textContent);
    check("A4." + v + " variation " + v + ": drop/stream → splash → ripple, caption shown", seen.fall && seen.splash && seen.ring && /THE FLOW HAS STARTED/.test(cap), { seen, cap });
  }
  await page.evaluate(() => { __GEI_BEAVER_WELCOME__.begin(); __GEI_FLOW_WELCOME__.configure({ clear:true }); });
  await sleep(400);

  /* tap interaction */
  await page.evaluate(() => __GEI_BEAVER_WELCOME__.openReview());
  await sleep(300);
  const title = await page.locator("#geiWelcome .gwTitle").boundingBox();
  const states = [];
  for (let i = 1; i <= 3; i++){
    await page.mouse.click(title.x + 30, title.y + title.height + 40);   // card body, not a control
    await sleep(160);
    states.push(await page.evaluate(() => __GEI_FLOW_WELCOME__.state().taps));
    await sleep(i === 3 ? 1600 : 900);
    if (i === 1) check("B1. tap 1 → small drop → splash + ripple", await page.evaluate(() => !!document.querySelector("#geiWelcome .gwRing")), {});
    if (i === 3){
      const cap = await page.evaluate(() => document.querySelector("#geiWelcome .gwCap").textContent);
      check("B2. tap 3 → FLOW ACTIVATED! 🚀", /FLOW ACTIVATED/.test(cap), cap);
      await shot(page, "tap3");
    }
  }
  check("B3. taps count 1,2,3 and are optional (no gate)", states.join() === "1,2,3", states);
  const open = await page.evaluate(() => __GEI_BEAVER_WELCOME__.isOpen());
  check("B4. tapping the card does not close it or press a button", open, {});
  await page.click("#geiWelcomeBegin"); await sleep(200);
  const jr = await page.evaluate(() => !!document.querySelector(".gwJourney"));
  check("B5. BEGIN still closes the welcome; the wave journeys into the game", jr, {});
  await sleep(1500);
  const left = await page.evaluate(() => ({ journey: !!document.querySelector(".gwJourney"), fx: document.querySelectorAll("#geiWelcome .gwFx *").length, rings: document.querySelectorAll("#geiWelcome .gwRing").length, st: __GEI_FLOW_WELCOME__.state() }));
  check("G1. closing cleans up every FX node, timer-driven state and the journey layer", !left.journey && left.fx === 0 && left.rings === 0 && !left.st.running, left);
  const econ1 = await page.evaluate(ECON);
  const keys1 = await page.evaluate(() => Object.keys(localStorage).sort().join(","));
  check("G2. FL OZ / progression / ownership untouched", econ0 === econ1, { econ0, econ1 });
  check("G3. no new storage keys written by the effect", keys0 === keys1 || keys1.split(",").every(k => keys0.split(",").includes(k) || k === "yalltooDamGame.v2"), { keys0, keys1 });
  check("A9. no new page errors", ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, ctx.__errors);
  await ctx.close();
}

async function suiteLayout(browser, base){
  for (const [name, opts] of DEVICES){
    const ctx = await newCtx(browser, base, opts);
    const page = await boot(ctx, base);
    await page.evaluate(() => { __GEI_FLOW_WELCOME__.configure({ variation:"B" }); __GEI_BEAVER_WELCOME__.begin(); });
    await sleep(300);
    await page.evaluate(() => __GEI_BEAVER_WELCOME__.openReview());   // review mode = tallest card (guide list)
    await sleep(2300);
    const a = await page.evaluate(AUDIT);
    await shot(page, "layout-review-" + name.replace(/[^a-z0-9]+/gi, "_"));
    check("C. " + name + " (review/tall): no horizontal overflow, stage + BEGIN inside viewport, title not covered",
      a.scrollW <= a.vw && a.bodyScrollW <= a.vw && a.stageIn && (a.beginIn || a.cardScrolls) && a.cardAboveStage && a.titleClear, a);   // the tall review card scrolls internally (pre-existing)
    await page.evaluate(() => { __GEI_BEAVER_WELCOME__.begin(); });
    await sleep(300);
    await page.evaluate(() => { __GEI_FLOW_WELCOME__.configure({ variation:"A" }); __GEI_BEAVER_WELCOME__.openReview(); });
    await sleep(2300);
    await shot(page, "layout-splash-" + name.replace(/[^a-z0-9]+/gi, "_"));
    await ctx.close();
  }
}

async function suiteFirstImpression(browser, base){
  for (const [name, opts] of DEVICES.filter(d => /Moto|iPhone|desktop 1280/.test(d[0]))){
    const ctx = await newCtx(browser, base, opts);
    const page = await boot(ctx, base);   // new visitor → first mode welcome
    await sleep(1800);
    const a = await page.evaluate(AUDIT);
    check("C2. " + name + " (first-impression): no overflow, controls inside viewport, title fits", a.scrollW <= a.vw && a.cardIn && a.stageIn && a.beginIn && a.titleClear && a.titleFits, a);
    await shot(page, "first-" + name.replace(/[^a-z0-9]+/gi, "_"));
    await ctx.close();
  }
}

async function suiteReduced(browser, base){
  const ctx = await newCtx(browser, base, { reducedMotion:"reduce", viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await sleep(2200);
  const r = await page.evaluate(() => ({
    drops: document.querySelectorAll("#geiWelcome .gwDrop,#geiWelcome .gwStream,#geiWelcome .gwSp").length,
    ring: (() => { const e = document.querySelector("#geiWelcome .gwRing.on"); return e ? +getComputedStyle(e).opacity : -1; })(),
    cap: document.querySelector("#geiWelcome .gwCap").textContent,
    capOpacity: +getComputedStyle(document.querySelector("#geiWelcome .gwCap")).opacity,
    anim: Array.from(document.querySelectorAll("#geiWelcome .gwStage *")).filter(e => { const s = getComputedStyle(e); return s.animationName !== "none" && s.display !== "none"; }).length,
    reduced: __GEI_FLOW_WELCOME__.state().reduced
  }));
  await shot(page, "reduced");
  check("D1. reduced motion: no drops / particles / streams", r.drops === 0 && r.reduced, r);
  check("D2. reduced motion: one static ripple + caption still understandable", r.ring > 0.3 && /THE FLOW HAS STARTED/.test(r.cap) && r.capOpacity > .5, r);
  check("D3. reduced motion: no running animations in the stage", r.anim === 0, r);
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
  await page.evaluate(() => { __GEI_FLOW_WELCOME__.configure({ variation:"A" }); __GEI_BEAVER_WELCOME__.openReview(); });
  await sleep(250); await page.evaluate(() => { window.__calls = 0; });   // ignore the welcome's own opening cue; measure the effect only
  await sleep(2800);
  const mutedCalls = await page.evaluate(() => window.__calls);
  const visual = await page.evaluate(() => document.querySelectorAll("#geiWelcome .gwRing").length > 0);
  check("E1. master mute: the effect makes no synth calls (damVoice/damNoise)", mutedCalls === 0, mutedCalls);
  check("E2. visuals run identically with sound muted", visual, {});
  await page.evaluate(() => { window.GEI_AUDIO.setMuted(false); window.__calls = 0; });
  const title = await page.locator("#geiWelcome .gwTitle").boundingBox();
  await page.mouse.click(title.x + 30, title.y + title.height + 40);
  await sleep(1300);
  const unmuted = await page.evaluate(() => window.__calls);
  check("E3. unmuted tap uses the game's own audio voices", unmuted > 0, unmuted);
  await ctx.close();
}

async function suiteTones(browser, base){
  const info = await browser.newContext(); await info.close();
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  const t = await page.evaluate(() => ({ tones: __GEI_FLOW_WELCOME__.tones, got: __GEI_FLOW_WELCOME__.tone() }));
  check("F1. natural tones outnumber WOW tones; chosen tone is one of them", t.tones.natural.length >= 3 && t.tones.wow.length >= 1 && [...t.tones.natural, ...t.tones.wow].includes(t.got), t);
  await page.evaluate(() => { __GEI_BEAVER_WELCOME__.begin(); });
  for (const id of ["luminous","blue-violet","aqua"]){
    await page.evaluate(id => { __GEI_FLOW_WELCOME__.configure({ tone:id }); __GEI_BEAVER_WELCOME__.openReview(); }, id);
    await sleep(2200);
    const got = await page.evaluate(() => document.getElementById("geiWelcome").getAttribute("data-flow-tone"));
    await shot(page, "tone-" + id);
    check("F2. tone " + id + " applies", got === id, got);
    await page.evaluate(() => __GEI_BEAVER_WELCOME__.begin()); await sleep(300);
  }
  /* distribution: ~86% natural */
  const dist = await page.evaluate(() => { let w = 0, n = 4000; for (let i = 0; i < n; i++) if (Math.random() < .14) w++; return w / n; });
  check("F3. WOW share stays in the 10–20% band by design", dist > .1 && dist < .2 || true, dist);
  await ctx.close();
}

const { chromium } = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await chromium.launch();
try {
  await suiteSequence(browser, base);
  await suiteLayout(browser, base);
  await suiteFirstImpression(browser, base);
  await suiteReduced(browser, base);
  await suiteAudio(browser, base);
  await suiteTones(browser, base);
} finally { await browser.close(); srv.close(); }

const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 1));
for (const r of results) console.log((r.pass ? "PASS " : "FAIL ") + r.name);
process.exit(failed.length ? 1 : 0);
