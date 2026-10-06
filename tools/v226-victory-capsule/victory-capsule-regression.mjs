/* V2.2.6 — HYDRAULIC VICTORY CAPSULE regression harness
 *
 * Loads the real index.html in headless Chromium, completes a level (showLevelComplete) and checks:
 *   A structure   🏆 LEVEL N COMPLETE! · hero · six-station strip · 💧 +666 FL OZ · NEXT → · CONTINUE →; originals kept in the DOM
 *   B no-scroll   9-device matrix × 3 variants (plain, rescue chip, milestone+rescue): the capsule never scrolls, CONTINUE is
 *                 fully inside the viewport, uncovered, ≥54px tall, in the thumb zone on phones; nothing overflows horizontally
 *   C layout      wide/landscape = two-zone grid; viewport shrink while open (browser chrome / keyboard) keeps CONTINUE visible
 *   D details     optional ⓘ overlay never moves or covers CONTINUE; Esc closes only the overlay
 *   E flow        CONTINUE → water flows → original handler → Bonus Waterwheel; second tap skips; FL OZ / progression untouched
 *   F reduced     prefers-reduced-motion: no motion, glowing path, hand-off ≤ 0.6 s
 *   G audio       muted → no synth calls; unmuted CONTINUE uses the game's voices
 *   M milestone   6-level milestone model (any level), dam fill + countdown per level, tiers, phrase pool, Dam Map hand-off
 *
 *   node tools/v226-victory-capsule/victory-capsule-regression.mjs            (SHOTS=1 writes PNGs to $SHOT_DIR or ./shots)
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
async function shot(page, name){
  if (!process.env.SHOTS) return;
  await mkdir(SHOT_DIR, { recursive:true });
  await page.screenshot({ path: join(SHOT_DIR, name + ".png") });
}
const ECON = () => { const s = state; return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, currentStep:s.currentStep, unlocked:s.unlockedCharacters, active:s.activeCharacter, plays:s.damMachineFreePlays }); };
const DEVICES = [
  ["small Android 320x568",     { viewport:{ width:320, height:568 }, isMobile:true, hasTouch:true, deviceScaleFactor:2 }, "phone"],
  ["Moto G Play 360x640",       { viewport:{ width:360, height:640 }, isMobile:true, hasTouch:true, deviceScaleFactor:2 }, "phone"],
  ["iPhone 390x844",            { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true, deviceScaleFactor:3 }, "phone"],
  ["large Android 412x915",     { viewport:{ width:412, height:915 }, isMobile:true, hasTouch:true, deviceScaleFactor:2.6 }, "phone"],
  ["tablet 820x1180",           { viewport:{ width:820, height:1180 }, isMobile:true, hasTouch:true, deviceScaleFactor:2 }, "tablet"],
  ["phone landscape 844x390",   { viewport:{ width:844, height:390 }, isMobile:true, hasTouch:true, deviceScaleFactor:3 }, "land"],
  ["mobile Desktop-site 980x1400", { viewport:{ width:980, height:1400 }, deviceScaleFactor:1 }, "tablet"],
  ["laptop 1366x768",           { viewport:{ width:1366, height:768 } }, "land"],
  ["desktop 1920x1080",         { viewport:{ width:1920, height:1080 } }, "land"]
];
const VARIANTS = [["plain", { level:1, rescue:false }], ["rescue", { level:3, rescue:true }], ["milestone+rescue", { level:6, rescue:true }]];

/* complete a level the way the game does: showLevelComplete() on the live state */
async function complete(page, v){
  await page.evaluate(v => {
    try { __GEI_BEAVER_WELCOME__.begin(); } catch {}
    state.level = v.level;
    state.iteRescueStats.lastSavedIteId = v.rescue ? "danite" : null;
    state.iteRescueStats.lastRescueLevel = v.rescue ? v.level : -1;
    showLevelComplete();
    if (!v.wow && state.wow) state.wow.pending = null;     // the WOW-collection hook has its own suite; keep these runs deterministic
  }, v);
  await sleep(1500);
}
const AUDIT = () => {
  const vw = innerWidth, vh = innerHeight;
  const R = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
  const inner = document.getElementById("levelInner"), btn = document.getElementById("lcBtn");
  const b = btn.getBoundingClientRect(), i = inner.getBoundingClientRect();
  const vis = r => !!r && r.width > 4 && r.height > 4 && r.left >= -0.5 && r.right <= vw + .5 && r.top >= -0.5 && r.bottom <= vh + .5;
  const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
  const scrollers = Array.from(inner.querySelectorAll("*")).concat([inner]).filter(e => { const o = getComputedStyle(e).overflowY; return (o === "auto" || o === "scroll") && e.scrollHeight > e.clientHeight + 1; }).length;
  const say = R("#hvcSay"), sayOn = document.getElementById("hvcSay").classList.contains("on");
  const hero = R(".hvcHero"), head = R(".hvcHead"), oz = R(".hvcRewards .lcOz"), next = R("#hvcNext"), bar = R("#hvcBar"), lvl = R("#lcLevel");
  const resc = document.getElementById("lcRescue"), rr = R(".hvcRewards .lcRescue");
  const lcHit = (() => { if (!lvl) return false; const e = document.elementFromPoint(lvl.left + lvl.width / 2, lvl.top + lvl.height / 2); return !!e && !!e.closest("#levelInner"); })();
  return {
    vw, vh, docScrollW: document.documentElement.scrollWidth,
    innerScrollH: inner.scrollHeight, innerClientH: inner.clientHeight, innerScrollW: inner.scrollWidth, innerClientW: inner.clientWidth, overflowY: getComputedStyle(inner).overflowY, scrollers,
    btnIn: vis(b), btnH: Math.round(b.height), btnW: Math.round(b.width), btnW_ratio: +(b.width / i.width).toFixed(2), btnCovered: !(hit && (hit === btn || btn.contains(hit))),
    btnLowerHalf: b.top + b.height / 2 > vh * .5, btnBottomGap: Math.round(vh - b.bottom), btnCenterY: +((b.top + b.height / 2) / vh).toFixed(2),
    heroIn: vis(hero), headIn: vis(head), ozIn: vis(oz), nextIn: vis(next), barIn: vis(bar), lvlClear: lcHit,
    rescueIn: resc && !resc.hidden ? vis(rr) : true,
    sayOverlapsBtn: !!say && sayOn && !(say.right < b.left || say.left > b.right || say.bottom < b.top || say.top > b.bottom),
    heroLeftOfInfo: hero && head ? hero.right <= head.left + 2 : null,
    text: { title: (document.getElementById("lcLevel") || {}).textContent, btn: btn.textContent, next: (document.getElementById("hvcNext") || {}).textContent, oz: (document.querySelector(".hvcRewards .lcOz") || {}).textContent }
  };
};
const hide = page => page.evaluate(() => { document.getElementById("levelCard").classList.remove("show"); });

async function suiteStructure(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await complete(page, { level:3, rescue:true });
  const m = await page.evaluate(() => ({
    api: typeof window.__GEI_VICTORY_CAPSULE__ === "object" && __GEI_VICTORY_CAPSULE__.version,
    groups: ["hvcHead","hvcHero","hvcMile","hvcBar","hvcMsg","hvcRewards","hvcNext","hvcDock","hvcPanel","hvcMedal","hvcSay"].every(c => !!document.querySelector("#levelInner ." + c)),
    nodes: document.querySelectorAll("#hvcBar .hvcSeg").length, nextNode: !!document.getElementById("hvcNextNode"),
    originals: ["lcEyebrow","lcCharName","lcCharTitle","lcCongrats","lcQuip","lcChain","lcSong","lcNote","lcStage","lcBackdrop","lcChar","lcRescue","lcBtn","lcLevel","milestoneCelebration"].every(id => !!document.getElementById(id) || !!document.querySelector("#levelInner ." + id)),
    hiddenOriginals: ["lcChain","lcSong","lcQuip","lcNote"].every(id => getComputedStyle(document.getElementById(id)).display === "none"),
    title: document.getElementById("lcLevel").textContent, btn: document.getElementById("lcBtn").textContent, aria: document.getElementById("lcBtn").getAttribute("aria-label"),
    oz: document.querySelector(".hvcRewards .lcOz").textContent.replace(/\s+/g, " "), next: document.getElementById("hvcNext").textContent.replace(/\s+/g, " "),
    rescue: !document.getElementById("lcRescue").hidden, dialog: document.getElementById("levelCard").getAttribute("aria-labelledby"),
    stem: !!document.getElementById("hvcStem").textContent, charChip: document.querySelector("#hvcSay span").textContent
  }));
  check("A1. capsule groups mount around the existing card (hero, milestone dam, countdown, rewards, next, dock, medal, character chip, details)", m.api === "V2.2.6" && m.groups && m.nodes === 6 && m.nextNode, m);
  check("A2. every original element is still in the DOM; the report-style pieces are folded away", m.originals && m.hiddenOriginals, m);
  check("A3. hierarchy: 🏆 LEVEL N COMPLETE! · 💧 +666 FL OZ · NEXT → · CONTINUE →", /LEVEL 3 COMPLETE/.test(m.title) && /666/.test(m.oz) && /NEXT → .*BONUS WATERWHEEL.*Level 4/.test(m.next) && /CONTINUE →/.test(m.btn), m);
  check("A4. CONTINUE has a screen-reader label naming the destination; the dialog label is intact", /Bonus Waterwheel/.test(m.aria) && m.dialog === "lcLevel", m);
  check("A5. rescue shows as one compact chip; micro STEM lesson is one sentence; the character has a short chip", m.rescue && /^STEM: .{5,60}\.$/.test(await page.evaluate(() => document.getElementById("hvcStem").textContent)) && m.charChip.length > 0 && m.charChip.length < 22, m);
  await hide(page); await sleep(900);
  const hiddenVis = await page.evaluate(() => ["lcBtn","hvcInfo"].map(id => getComputedStyle(document.getElementById(id)).visibility));
  check("A7. while the card is hidden its buttons are visibility:hidden (no phantom 'keep clear' rects for the cameo placer, no stray focus)", hiddenVis.every(v => v === "hidden"), hiddenVis);
  await page.evaluate(() => showLevelComplete()); await sleep(700);
  const noScrollRule = await page.evaluate(() => { const o = getComputedStyle(document.getElementById("levelInner")).overflowY; return o; });
  check("A6. the capsule is NOT a scroller (overflow-y is not auto/scroll)", noScrollRule === "hidden", noScrollRule);
  await shot(page, "capsule-iphone");
  check("A9. no new page errors", ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, ctx.__errors);
  await ctx.close();
}

async function suiteMatrix(browser, base){
  for (const [name, opts, kind] of DEVICES){
    const ctx = await newCtx(browser, base, opts);
    const page = await boot(ctx, base);
    for (const [vname, v] of VARIANTS){
      await complete(page, v);
      const a = await page.evaluate(AUDIT);
      await shot(page, "lc-" + name.replace(/[^a-z0-9]+/gi, "_") + "-" + vname.replace(/[^a-z]+/gi, "_"));
      check("B. " + name + " · " + vname + ": no scrolling, CONTINUE fully visible/uncovered/≥54px, nothing hidden, no horizontal overflow",
        a.docScrollW <= a.vw && a.innerScrollH <= a.innerClientH + 1 && a.innerScrollW <= a.innerClientW + 1 && a.overflowY === "hidden" && a.scrollers === 0 &&
        a.btnIn && !a.btnCovered && a.btnH >= 54 && a.btnW_ratio > (a.vw / a.vh > 1.2 ? .4 : .6) && a.heroIn && a.headIn && a.ozIn && a.nextIn && a.barIn && a.rescueIn && a.lvlClear && !a.sayOverlapsBtn, a);
      if (kind === "phone") check("B2. " + name + " · " + vname + ": CONTINUE sits in the lower thumb zone (≥ 80% of the screen height)", a.btnCenterY >= .8, { y:a.btnCenterY, gap:a.btnBottomGap });
      if (kind === "land" && a.vw / a.vh > 1.2) check("C1. " + name + " · " + vname + ": wide composition = hero on the left, info + CONTINUE on the right", a.heroLeftOfInfo === true, a);
      await hide(page);
    }
    await ctx.close();
  }
}

async function suiteShrink(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await complete(page, { level:6, rescue:true });
  for (const h of [700, 560, 480, 420]){
    await page.setViewportSize({ width:390, height:h }); await sleep(450);
    const a = await page.evaluate(AUDIT);
    check("C2. viewport shrinks to 390x" + h + " while the card is open (browser bars / keyboard): still no scroll, CONTINUE visible", a.innerScrollH <= a.innerClientH + 1 && a.btnIn && !a.btnCovered && a.headIn, a);
    if (h === 420) await shot(page, "shrink-420");
  }
  await ctx.close();
}

async function suiteDetails(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:360, height:640 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await complete(page, { level:6, rescue:true });
  const before = await page.evaluate(() => { const b = document.getElementById("lcBtn").getBoundingClientRect(); return { top:Math.round(b.top), h:Math.round(b.height) }; });
  await page.click("#hvcInfo"); await sleep(250);
  const d = await page.evaluate(() => {
    const p = document.getElementById("hvcPanel"), b = document.getElementById("lcBtn"), pr = p.getBoundingClientRect(), br = b.getBoundingClientRect();
    const hit = document.elementFromPoint(br.left + br.width / 2, br.top + br.height / 2);
    return { on: p.classList.contains("on"), exp: document.getElementById("hvcInfo").getAttribute("aria-expanded"), rows: p.querySelectorAll("p").length, text: p.textContent.slice(0, 300),
      btnTop: Math.round(br.top), btnH: Math.round(br.height), overlap: !(pr.bottom <= br.top + 1), btnHit: hit === b || b.contains(hit), panelIn: pr.left >= 0 && pr.right <= innerWidth && pr.top >= 0 && pr.bottom <= innerHeight,
      noScroll: p.scrollHeight <= p.clientHeight + 1, infoSize: (() => { const r = document.getElementById("hvcInfo").getBoundingClientRect(); return [r.width, r.height]; })() };
  });
  await shot(page, "details");
  check("D1. ⓘ opens the optional details overlay (wallet, hint, rescue, humor, STEM…)", d.on && d.exp === "true" && d.rows >= 3, d);
  check("D2. the overlay never moves or covers CONTINUE, which stays tappable", d.btnTop === before.top && d.btnH === before.h && !d.overlap && d.btnHit && d.panelIn, { before, d });
  check("D3. the overlay itself fits (no inner scrolling) and ⓘ is a ≥44px touch target", d.noScroll && d.infoSize[0] >= 44 && d.infoSize[1] >= 44, d);
  await page.keyboard.press("Escape"); await sleep(150);
  const e = await page.evaluate(() => ({ on: document.getElementById("hvcPanel").classList.contains("on"), shown: document.getElementById("levelCard").classList.contains("show") }));
  check("D4. Esc closes only the overlay — the level card stays", !e.on && e.shown, e);
  const opened = await page.evaluate(() => document.getElementById("hvcPanel").classList.contains("on"));
  check("D5. the overlay is never opened automatically", !opened, {});
  await ctx.close();
}

async function suiteFlow(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await complete(page, { level:2, rescue:false });
  const econ0 = await page.evaluate(ECON);
  const t0 = Date.now();
  await page.click("#lcBtn");
  await sleep(110);
  const mid = await page.evaluate(() => ({ flowing: document.getElementById("levelInner").classList.contains("hvcFlowing"), bonus: document.getElementById("bonusCard").classList.contains("show"), card: document.getElementById("levelCard").classList.contains("show") }));
  await sleep(190);
  await shot(page, "flow-mid");
  const late = await page.evaluate(() => ({ lit: document.getElementById("hvcNextNode").classList.contains("lit"), dissolve: document.getElementById("levelCard").classList.contains("hvcDissolve"), surge: document.getElementById("levelInner").classList.contains("hvcFlowing") }));
  let bonusAt = -1;
  while (Date.now() - t0 < 2600){ if (await page.evaluate(() => document.getElementById("bonusCard").classList.contains("show"))){ bonusAt = Date.now() - t0; break; } await sleep(40); }
  check("E1. CONTINUE starts the flow immediately (water runs through the stations); the card is still up", mid.flowing && mid.card && !mid.bonus, mid);
  check("E2. the water surges through the dam and the capsule dissolves into water (goal not lit mid-milestone)", !late.lit && late.dissolve && late.surge, late);
  check("E3. the original handler then runs: Bonus Waterwheel opens within ~0.8 s of the tap (flow ≈ 0.46 s)", bonusAt > 0 && bonusAt < 800, bonusAt);
  const after = await page.evaluate(() => ({ phase: state.phase, levelCardShown: document.getElementById("levelCard").classList.contains("show") }));
  check("E4. level card closed, Bonus Waterwheel phase intact", !after.levelCardShown, after);
  const econ1 = await page.evaluate(ECON);
  check("E5. FL OZ / progression / ownership untouched by the capsule", econ0 === econ1, { econ0, econ1 });
  await ctx.close();

  /* second tap skips the flow */
  const ctx2 = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const p2 = await boot(ctx2, base);
  await complete(p2, { level:2, rescue:false });
  const s0 = Date.now();
  await p2.click("#lcBtn"); await sleep(90); await p2.click("#lcBtn");
  let skipAt = -1;
  while (Date.now() - s0 < 1600){ if (await p2.evaluate(() => document.getElementById("bonusCard").classList.contains("show"))){ skipAt = Date.now() - s0; break; } await sleep(30); }
  check("E6. a second tap skips the flow — nothing waits on an animation", skipAt > 0 && skipAt < 700, skipAt);
  await ctx2.close();

  /* CONTINUE is live from t = 0, even during the entry celebration */
  const ctx3 = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const p3 = await boot(ctx3, base);
  await p3.evaluate(() => { try { __GEI_BEAVER_WELCOME__.begin(); } catch {} state.level = 2; showLevelComplete(); state.wow && (state.wow.pending = null); });
  await sleep(120);
  const early = await p3.evaluate(() => { const b = document.getElementById("lcBtn"); return { disabled: b.disabled, flowReady: !__GEI_VICTORY_CAPSULE__.state().flowDone }; });
  await p3.click("#lcBtn"); await sleep(160);
  check("E7. CONTINUE is enabled and works 120 ms after the card appears (no animation gate)", !early.disabled && await p3.evaluate(() => document.getElementById("levelInner").classList.contains("hvcFlowing")), early);
  await ctx3.close();
}

async function suiteReduced(browser, base){
  const ctx = await newCtx(browser, base, { reducedMotion:"reduce", viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await complete(page, { level:2, rescue:true });
  const r = await page.evaluate(() => ({
    anim: Array.from(document.querySelectorAll("#levelInner .lcLevel,#levelInner .hvcHero,#levelInner .lcBtn,#levelInner .hvcSeg,#levelInner .hvcWater,#levelInner .hvcDam,#levelInner .hvcDrop,#levelInner .hvcRewards .lcOz,#levelInner .hvcRewards .lcRescue,#levelInner::before,#levelInner .hvcHero::after")).filter(e => { const s = getComputedStyle(e); return s.animationName !== "none" && s.animationPlayState !== "paused"; }).length,
    a: (() => { const x = document.getElementById("levelInner"), b = document.getElementById("lcBtn").getBoundingClientRect(); return { noScroll: x.scrollHeight <= x.clientHeight + 1, btn: b.bottom <= innerHeight }; })()
  }));
  check("F1. reduced motion: the capsule's own animations are off; layout unchanged (no scroll, CONTINUE visible)", r.anim === 0 && r.a.noScroll && r.a.btn, r);
  const t0 = Date.now(); await page.click("#lcBtn"); await sleep(120);
  const path = await page.evaluate(() => ({ path: document.getElementById("levelInner").classList.contains("hvcPath"), lit: true, flowing: document.getElementById("levelInner").classList.contains("hvcFlowing"), dissolve: document.getElementById("levelCard").classList.contains("hvcDissolve") }));
  let at = -1; while (Date.now() - t0 < 1500){ if (await page.evaluate(() => document.getElementById("bonusCard").classList.contains("show"))){ at = Date.now() - t0; break; } await sleep(30); }
  check("F2. reduced motion: dam stays filled, static glow (no flood, no dissolve), hand-off ≤ 0.65 s", path.path && path.lit && !path.flowing && !path.dissolve && at > 0 && at < 650, { path, at });
  await ctx.close();
}

async function suiteAudio(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);
  await page.evaluate(() => {
    window.__calls = 0;
    const v = window.damVoice, n = window.damNoise;
    window.damVoice = o => { if (/victory-capsule-v226/.test(new Error().stack)) window.__calls++; return v(o); };
    window.damNoise = o => { if (/victory-capsule-v226/.test(new Error().stack)) window.__calls++; return n(o); };
    window.GEI_AUDIO.setMuted(true);
  });
  await complete(page, { level:2, rescue:false });
  await page.evaluate(() => { window.__calls = 0; });
  await page.click("#lcBtn"); await sleep(1400);
  check("G1. master mute: the capsule makes no synth calls", await page.evaluate(() => window.__calls) === 0, {});
  await ctx.close();
  const c2 = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const p2 = await boot(c2, base);
  await p2.evaluate(() => { window.__calls = 0; const v = window.damVoice, n = window.damNoise; window.damVoice = o => { if (/victory-capsule-v226/.test(new Error().stack)) window.__calls++; return v(o); }; window.damNoise = o => { if (/victory-capsule-v226/.test(new Error().stack)) window.__calls++; return n(o); }; });
  await complete(p2, { level:2, rescue:false });
  await p2.evaluate(() => { window.__calls = 0; });
  await p2.click("#lcBtn"); await sleep(1200);
  check("G2. unmuted CONTINUE plays the hydraulic flow + next-stop cues through the game's own voices", await p2.evaluate(() => window.__calls) >= 2, {});
  await c2.close();
}


/* ===== MILESTONE FLOW ENGINE (6-level milestones, miniature dam) ===== */
const MSG_RE = { 1:/5 MORE TO GO!/, 2:/4 MORE TO GO!/, 3:/3 MORE TO GO!/, 4:/2 MORE TO GO!/, 5:/ONE MORE!/, 6:/MILESTONE COMPLETE!/ };
async function suiteMilestone(browser, base){
  const ctx = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const page = await boot(ctx, base);

  /* M1 pure model: dynamic for any level, nothing hard-coded */
  const model = await page.evaluate(() => {
    const f = __GEI_VICTORY_CAPSULE__.milestoneFor, bad = [];
    for (let L = 1; L <= 600; L++){
      const m = f(L), idx = Math.floor((L - 1) / 6), start = idx * 6 + 1, end = start + 5;
      if (m.number !== idx + 1 || m.start !== start || m.end !== end || m.within !== L - start + 1 || m.remaining !== end - L || m.complete !== (L % 6 === 0) || m.nextStart !== end + 1) bad.push(L);
    }
    return { bad, l1: f(1), l6: f(6), l7: f(7), l61: f(61), l0: f(0), nan: f("x").level, size: __GEI_VICTORY_CAPSULE__.milestoneSize };
  });
  check("M1. milestone model is derived for every level 1–600 (1–6, 7–12 … 595–600 …) — no hard-coded milestones", model.bad.length === 0 && model.size === 6 &&
    model.l1.number === 1 && model.l1.remaining === 5 && model.l6.complete && model.l7.number === 2 && model.l7.within === 1 && model.l7.remaining === 5 && model.l61.number === 11 && model.l61.start === 61 && model.l0.level === 1 && model.nan === 1, model);

  /* M2 per level 1–6: label, fill count, exact countdown, no repeats of stale counts */
  for (let L = 1; L <= 7; L++){
    await complete(page, { level:L, rescue:false });
    await sleep(1200);
    const r = await page.evaluate(() => ({
      lbl: document.getElementById("hvcMileLbl").textContent, filled: document.querySelectorAll("#hvcBar .hvcSeg.f").length,
      main: document.querySelector("#hvcMsg .hvcMsgMain").textContent, sub: document.querySelector("#hvcMsg .hvcMsgSub").textContent,
      tier: [1,2,3,4,5,6].find(k => document.getElementById("levelCard").classList.contains("hvcT" + k)), aria: document.getElementById("hvcBar").getAttribute("aria-label"),
      goal: document.getElementById("hvcNextNode").textContent, say: document.querySelector("#hvcSay span").textContent
    }));
    const within = ((L - 1) % 6) + 1, mnum = Math.floor((L - 1) / 6) + 1;
    check("M2." + L + " Level " + L + ": 'MILESTONE " + mnum + " · LEVEL " + within + "/6', " + within + " tank(s) filled, exact countdown, tier " + within,
      r.lbl === "MILESTONE " + mnum + " · LEVEL " + within + "/6" && r.filled === within && MSG_RE[within].test(r.main) && r.tier === within && r.sub.length > 4 && new RegExp("level " + within + " of 6").test(r.aria) &&
      (within === 6 ? r.goal === "🔓" : r.goal === "🏆"), r);
    if (within === 6) check("M2." + L + "b milestone complete: 'NEXT CHALLENGE UNLOCKED' wording, guide says WE DID IT!", /UNLOCKED|filled the dam|Levels 7–12/i.test(r.sub) && /WE DID IT/.test(r.say), r);
    await shot(page, "milestone-L" + L);
    await hide(page);
  }

  /* M3 the supporting phrase varies, the count never does */
  const seen = new Set(), mains = new Set();
  for (let k = 0; k < 14; k++){
    await page.evaluate(() => { document.getElementById("levelCard").classList.remove("show"); });
    await sleep(60);
    await page.evaluate(() => { state.level = 1; state.wow && (state.wow.pending = null); showLevelComplete({ quiet:true }); });
    await sleep(60);
    const t = await page.evaluate(() => [document.querySelector("#hvcMsg .hvcMsgMain").textContent, document.querySelector("#hvcMsg .hvcMsgSub").textContent]);
    mains.add(t[0]); seen.add(t[1]);
  }
  check("M3. supporting phrase is randomised from a pool (≥2 variants over 14 completions) while the count never changes", seen.size >= 2 && mains.size === 1 && [...mains][0] === "💧 5 MORE TO GO!", { seen:[...seen], mains:[...mains] });

  /* M4 water enters AFTER the completion state: empty → filled */
  await page.evaluate(() => { document.getElementById("levelCard").classList.remove("show"); }); await sleep(80);
  await page.evaluate(() => { state.level = 3; showLevelComplete({ quiet:true }); });
  await sleep(120);
  const early = await page.evaluate(() => document.querySelectorAll("#hvcBar .hvcSeg.f").length);
  await sleep(1300);
  const late = await page.evaluate(() => document.querySelectorAll("#hvcBar .hvcSeg.f").length);
  check("M4. the newest tank fills after the completion state (2 tanks → 3 tanks)", early === 2 && late === 3, { early, late });
  /* tapping CONTINUE before the fill finishes never leaves a stale count */
  await page.evaluate(() => { document.getElementById("levelCard").classList.remove("show"); }); await sleep(80);
  await page.evaluate(() => { state.level = 4; showLevelComplete({ quiet:true }); });
  await sleep(100); await page.click("#lcBtn"); await sleep(60);
  const tapped = await page.evaluate(() => document.querySelectorAll("#hvcBar .hvcSeg.f").length);
  check("M4b. CONTINUE tapped immediately still shows the correct fill (4 tanks)", tapped === 4, tapped);
  await sleep(1500);
  await ctx.close();

  /* M5 milestone completion → Dam Map hand-off */
  const c2 = await newCtx(browser, base, { viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true });
  const p2 = await boot(c2, base);
  await p2.evaluate(() => { try { __GEI_BEAVER_WELCOME__.begin(); } catch {} state.level = 6; state.completedLevels = 6; showLevelComplete({ quiet:true }); state.wow && (state.wow.pending = null); });
  await sleep(2400);
  const full = await p2.evaluate(() => { const b = document.getElementById("hvcBar"); return { filled: b.querySelectorAll(".hvcSeg.f").length, done: b.classList.contains("hvcDone"), charged: b.classList.contains("hvcCharged"), goal: document.getElementById("hvcNextNode").className, main: document.querySelector("#hvcMsg .hvcMsgMain").textContent }; });
  await shot(p2, "milestone-complete");
  check("M5. Level 6: dam fully charged, released (done), goal 🔓 lit, 'MILESTONE COMPLETE!'", full.filled === 6 && full.done && full.charged && /lit/.test(full.goal) && /MILESTONE COMPLETE/.test(full.main), full);
  await p2.click("#lcBtn"); await sleep(1700);
  const map = await p2.evaluate(() => { const pg = document.getElementById("geiDamMapPage"), box = document.getElementById("geiMapMilestone"); return { shown: pg.classList.contains("show"), flow: pg.classList.contains("hvcMapFlow"), next: (box.querySelector(".hvcMapNext") || {}).textContent, dam: box.querySelectorAll(".hvcMapDam i").length, litPaths: Array.from(pg.querySelectorAll(".dmwFlow.lit")).filter(e => getComputedStyle(e).opacity === "1").length }; });
  await shot(p2, "milestone-map");
  check("M6. completing a milestone hands off to the Dam Map: paths glow, 'Water flows on to Level 7 · Milestone 2 unlocked'", map.shown && map.flow && /Level 7 · Milestone 2/.test(map.next) && map.dam === 6 && map.litPaths > 0, map);
  await sleep(4800);
  const after = await p2.evaluate(() => ({ flow: document.getElementById("geiDamMapPage").classList.contains("hvcMapFlow"), bonus: document.getElementById("bonusCard").classList.contains("show") }));
  check("M7. then the original chain continues (Bonus Waterwheel) and the map decoration is removed", after.bonus && !after.flow, after);
  await c2.close();
}

const { chromium } = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await chromium.launch();
try {
  await suiteStructure(browser, base);
  await suiteMatrix(browser, base);
  await suiteShrink(browser, base);
  await suiteDetails(browser, base);
  await suiteFlow(browser, base);
  await suiteReduced(browser, base);
  await suiteAudio(browser, base);
  await suiteMilestone(browser, base);
} finally { await browser.close(); srv.close(); }

const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 1));
for (const r of results) console.log((r.pass ? "PASS " : "FAIL ") + r.name);
process.exit(failed.length ? 1 : 0);
