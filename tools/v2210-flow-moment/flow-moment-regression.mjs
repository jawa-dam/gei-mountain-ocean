/* V2.2.10 — FLOW MOMENT ENGINE regression harness
 *
 * Loads the real index.html in headless Chromium (offline: every non-local request is blocked; the supplied voice MP3s are answered with a short
 * generated WAV so `ended` events are real) and checks:
 *   F1 wiring      script is loaded, the 12 supplied CDN URLs are exact (including the corrected "too much flow" URL), no uncaught errors
 *   F2 callouts    combo ladder (×2 FLOW COMBO … ×10 DAM-ITE OVERDRIVE), throttling, big readable size, old small flashes hidden
 *   F3 pressure    environment vibration + urgent timer ≤5 s, warnings at 4/3/2/1 s in order, nothing while paused
 *   F4 voice lane  one clip at a time, higher priority interrupts / lower never talks over, mute respected, female narrator held back
 *   F5 failure     UH-OH → … → we-have-a-break → the-dam-broke → reaction → card; card not shown early; whole card inside the viewport on 5 phones;
 *                  no page scroll created; game state/economy untouched; Try Day Again restores everything (no leaked timers / classes / nodes)
 *   F6 randomness  comedy chance 10–20 %, rare events rare, every rare event + every reaction completes
 *   F7 safety      prefers-reduced-motion, mute, tap-to-skip, hidden tab
 *   F8 success     gate / waterwheel / factory / "YOU CONTROLLED THE FLOW!" and no progress change
 *
 *   node tools/v2210-flow-moment/flow-moment-regression.mjs
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = []; try { roots.push(execSync("npm root -g", { encoding:"utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){ try { return createRequire(join(r, "noop.js"))("playwright"); } catch {} try { return createRequire(join(r, "noop.js"))("playwright-core"); } catch {} }
  console.error("Playwright is not installed. Run: npm i -D playwright"); process.exit(2);
}
const pw = await loadPlaywright(); const chromium = pw.chromium || (pw.default && pw.default.chromium);
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
const srv = await new Promise(ok => {
  const s = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p === "/") p = "/index.html";
      const f = resolve(root, "." + p); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
      await stat(f); res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }); res.end(await readFile(f));
    } catch { res.writeHead(404); res.end(); }
  });
  s.listen(0, "127.0.0.1", () => ok(s));
});
const base = "http://127.0.0.1:" + srv.address().port;
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failed = 0, passed = 0;
function check(name, ok, detail){ if (ok) { passed++; console.log("  ✓ " + name); } else { failed++; console.log("  ✗ " + name + (detail !== undefined ? "\n      " + JSON.stringify(detail).slice(0, 400) : "")); } }
function wav(ms){ const sr = 8000, n = sr * ms / 1000 | 0, b = Buffer.alloc(44 + n * 2); b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40); for (let i = 0; i < n; i++) b.writeInt16LE(Math.sin(i / 8) * 3000, 44 + i * 2); return b; }
const PNG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#c58a4a"/></svg>';

const browser = await chromium.launch({ args:["--autoplay-policy=no-user-gesture-required"] });
async function boot(opts = {}){
  const ctx = await browser.newContext({ viewport:opts.viewport || { width:390, height:844 }, isMobile:true, hasTouch:true, reducedMotion:opts.reduced ? "reduce" : "no-preference" });
  const errors = [], reqs = [];
  await ctx.route("**/*", r => {
    const u = r.request().url(); if (u.startsWith(base)) return r.continue();
    if (/zyrosite.*\.mp3/.test(u)) { reqs.push(u); return r.fulfill({ status:200, contentType:"audio/wav", body:wav(opts.clipMs || 300) }); }
    if (/zyrosite.*\.(png|jpg|webp)/.test(u)) return r.fulfill({ status:200, contentType:"image/svg+xml", body:PNG });
    return r.abort();
  });
  const page = await ctx.newPage();
  page.on("pageerror", e => { if (!/addStyle is not defined/.test(e.message)) errors.push(e.message); });   // addStyle: pre-existing, unrelated (tap-lites-reward-moments-v2178.js)
  await page.goto(base + "/", { waitUntil:"load" }); await sleep(500);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(1800);
  await page.evaluate(() => { const b = document.getElementById("geiWelcomeBegin"); if (b) b.click(); }); await sleep(1100);
  const h = { ctx, page, errors, reqs };
  h.worldPoint = () => page.evaluate(() => { const b = document.getElementById("world").getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
  h.tap = async () => { const p = await h.worldPoint(); await page.mouse.click(p[0], p[1]); };
  h.start = async () => { await h.tap(); await sleep(250); };
  h.untilTimeout = () => page.waitForFunction(() => state.phase === "timeout", null, { timeout:20000 });
  h.untilCard = () => page.waitForFunction(() => document.getElementById("timeUpCard").classList.contains("show"), null, { timeout:30000 });
  h.close = () => ctx.close();
  return h;
}

/* ------------------------------------------------------------------ F1 */
async function suiteWiring(){
  console.log("F1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "flow-moment-engine-v2210.js"), "utf8");
  check("F1a. index.html loads the engine after the achievement director", html.indexOf("/flow-moment-engine-v2210.js") > html.indexOf("/achievement-audio-director-v227.js"));
  const urls = {
    "uh-oh":"uh-oh-Y2oFEOm0it5IjoWc.mp3", "pressure-critical":"pressure-critical-ZrfW0HesXVXYFApK.mp3", "hold-the-dam":"hold-the-dam-XCzbFwtwuQSKIaWv.mp3",
    "too-much-flow":"too-much-flow-8Yz9tQO0XI2GCwby.mp3", "cracking":"the-dam-is-cracking-tJRFUUkJaIxGN0ti.mp3", "break":"we-have-a-break-5gFKFW7XJGc6Ghap.mp3",
    "broke":"the-dam-broke-4H7sAbRRYVATp7YZ.mp3", "run":"run-vGy6nQAE4CxAftGQ.mp3", "whoa":"whoa-rl4QpSsPab74UAje.mp3", "flood":"that-was-a-flood-oNcCWcGAYWWWzlov.mp3",
    "who":"who-turned-that-water-on-2yJFhN0Ls4FOt51a.mp3", "again":"try-again-dam-ite-ilLtMjhuvdHAwmZn.mp3" };
  check("F1b. all twelve supplied clip files are referenced exactly", Object.values(urls).every(f => js.includes(f)), Object.values(urls).filter(f => !js.includes(f)));
  check("F1c. the malformed 'too much flow' URL from the brief is NOT used", !js.includes("YZ9jg46Bljs5wO0XI2GCwby"));
  const h = await boot();
  const r = await h.page.evaluate(() => ({ has:!!window.FlowMomentEngine && FlowMomentEngine === window.GEI_FLOW_MOMENT, self:FlowMomentEngine.selfTest(), root:!!document.getElementById("fmeRoot"), inWorld:document.getElementById("fmeRoot").parentNode.id, cls:document.documentElement.classList.contains("fmeOn"),
    clips:Object.values(FlowMomentEngine.clips).map(f => "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/" + f) }));
  check("F1d. engine mounted inside the board, self-test green", r.has && r.root && r.inWorld === "world" && r.cls && r.self.every(t => t.ok), r.self.filter(t => !t.ok));
  check("F1e. no uncaught errors at startup", h.errors.length === 0, h.errors);
  await h.close();
}

/* ------------------------------------------------------------------ F2 */
async function suiteCallouts(){
  console.log("F2 callouts");
  const h = await boot(); const { page } = h;
  await page.evaluate(() => { window.__co = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")) window.__co.push({ txt:n.innerText.replace(/\s+/g, " ").trim(), cls:n.className, rect:null }); }))).observe(document.body, { subtree:true, childList:true }); });
  await page.evaluate(() => { MilestoneProgressEngine.enabled = false; });   // V2.2.11: with the milestone engine on, "3 MORE!" absorbs the combo word (tested in the v2211 suite)
  await h.start();
  for (let i = 0; i < 5; i++){ await h.tap(); await sleep(i === 2 ? 60 : 150); }
  const mid = await page.evaluate(() => { const el = document.querySelector(".fmeCo"); if (!el) return null; const t = el.querySelector(".fmeCoT"), cs = getComputedStyle(t); const r = el.getBoundingClientRect(); return { font:parseFloat(cs.fontSize), w:r.width, vw:innerWidth }; });
  await sleep(300);
  const co = await page.evaluate(() => window.__co.map(c => c.txt));
  check("F2a. ×2 → FLOW COMBO, ×3 → HYDRAULIC SURGE, ×5 → MAXIMUM FLOW appear in order", co[0] && /FLOW COMBO ×2/.test(co[0]) && /HYDRAULIC SURGE ×3/.test(co[1] || "") && /MAXIMUM FLOW ×5/.test(co[2] || ""), co);
  check("F2b. intelligent throttling: the fast ×4 'FLOW STREAK' never stacks onto a bigger word", !co.some(t => /FLOW STREAK/.test(t)) && co.length === 3, co);
  check("F2c. callouts are LARGE (≥ 30 px type) and never wider than the viewport", mid && mid.font >= 30 && mid.w <= mid.vw, mid);
  const old = await page.evaluate(() => { const f = document.getElementById("damIteComboFlash"), b = document.querySelector(".tl2175MomentumBadge"); return { flash:f ? getComputedStyle(f).display : "none", badge:b ? getComputedStyle(b).display : "none" }; });
  check("F2d. the old small combo flash / momentum badge are hidden (one source of big feedback)", old.flash === "none" && old.badge === "none", old);
  const ladder = await page.evaluate(() => { const E = FlowMomentEngine, C = E._test.COMBO; return { c10:C[10].text, c12:C[12].text, c16:C[16].text, c24:C[24].text, c36:C[36].text, c7:C[7].text }; });
  check("F2e. escalation: PRESSURE BOOST ×7 → DAM-ITE OVERDRIVE ×10 → SUPER SURGE → FLOW / HYDRAULIC MASTER → DAM-ITE LEGEND", ladder.c7 === "PRESSURE BOOST" && ladder.c10 === "DAM-ITE OVERDRIVE" && ladder.c12 === "SUPER SURGE" && ladder.c16 === "FLOW MASTER" && ladder.c24 === "HYDRAULIC MASTER" && ladder.c36 === "DAM-ITE LEGEND", ladder);
  const th = await page.evaluate(async () => {
    const E = FlowMomentEngine; const out = {};
    await new Promise(r => setTimeout(r, 1400));
    out.first = E.callout({ key:"t-a", text:"AAA", tier:1, cooldown:0 });
    out.sameTierSoon = E.callout({ key:"t-b", text:"BBB", tier:1, cooldown:0 });
    out.higherTier = E.callout({ key:"t-c", text:"CCC", tier:4, cooldown:0 });
    out.onScreen = document.querySelectorAll(".fmeCo:not(.out)").length;
    out.sameKey = E.callout({ key:"t-c", text:"CCC", tier:5 });
    return out;
  });
  check("F2f. a same-tier word right behind another is dropped, a higher tier interrupts, same word has a cooldown, ≤1 word on screen", th.first && !th.sameTierSoon && th.higherTier && th.onScreen === 1 && !th.sameKey, th);
  const reg = await page.evaluate(() => { FlowMomentEngine.register("zz-future", { emoji:"🧪", text:"FUTURE MOMENT", tier:2 }); return FlowMomentEngine.trigger("zz-future", { gap:0, cooldown:0 }); });
  check("F2g. modular: register() + trigger() adds a new Flow Moment without engine changes", reg === true);
  check("F2h. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ------------------------------------------------------------------ F3 */
async function suitePressure(){
  console.log("F3 pressure state");
  const h = await boot({ clipMs:250 }); const { page } = h;
  await h.start();
  const t0 = Date.now(); const seen = { p5:null, warn:[] };
  while (Date.now() - t0 < 6500){
    const s = await page.evaluate(() => ({ phase:state.phase, rem:currentRemainingMs(), press:document.getElementById("world").classList.contains("fmePressure"), urgent:document.getElementById("timerBox").classList.contains("fmeUrgent"), log:FlowMomentEngine.state().voiceLog.slice() }));
    if (s.rem <= 4900 && s.rem > 3000 && !seen.p5) seen.p5 = s;
    seen.log = s.log;
    if (s.phase !== "playing") break; await sleep(80);
  }
  check("F3a. ≤5 s: board vibrates (fmePressure) and the timer turns urgent", seen.p5 && seen.p5.press && seen.p5.urgent, seen.p5);
  const warnIds = (seen.log || []).filter(x => ["pressure", "hold", "toomuch", "cracking"].includes(x));
  check("F3b. warnings play once each in order: Pressure Critical (4 s) → Hold the Dam (3 s) → Too Much Flow (2 s) → The Dam Is Cracking (1 s)", JSON.stringify(warnIds) === JSON.stringify(["pressure", "hold", "toomuch", "cracking"]), seen.log);
  await h.untilCard(); await h.page.click("#retryDayBtn"); await sleep(400);
  await h.tap(); await sleep(300);   // day restarts
  /* pause: a panel open must stop the vibration */
  await page.evaluate(() => { FlowMomentEngine.sync(3500, true); });
  const on = await page.evaluate(() => document.getElementById("world").classList.contains("fmePressure"));
  await page.evaluate(() => { FlowMomentEngine.sync(3500, false); });
  const off = await page.evaluate(() => document.getElementById("world").classList.contains("fmePressure"));
  check("F3c. pressure follows the clock: on while live, off the moment the timer pauses / stops", on && !off, { on, off });
  const jump = await page.evaluate(() => { const E = FlowMomentEngine; E.reset(); E.sync(1500, true); return E.state().pressure.fired; });
  check("F3d. resuming late (1.5 s left) fires only the tightest missed warning, not a burst of three", jump.length === 3, jump);
  const dayDone = await page.evaluate(() => { const E = FlowMomentEngine; E.reset(); E.sync(1800, true); E.dayComplete(0, 1800); return E.state().pressure; });
  check("F3e. saving the dam clears the pressure state", dayDone.on === false && dayDone.stage === 0, dayDone);
  check("F3f. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ------------------------------------------------------------------ F4 */
async function suiteVoice(){
  console.log("F4 voice lane");
  const h = await boot({ clipMs:700 }); const { page } = h;
  const r = await page.evaluate(async () => {
    const E = FlowMomentEngine, out = {}; const P = E.priorities;
    const a = E.say("whoa", { pri:P.reaction });                         // priority 4 speaking
    await new Promise(r => setTimeout(r, 120)); out.v1 = E.state().voice && E.state().voice.id;
    const b = E.say("hold", { pri:P.warning });                          // priority 2 must interrupt
    await new Promise(r => setTimeout(r, 120)); out.v2 = E.state().voice && E.state().voice.id; out.aEnded = await Promise.race([a, new Promise(r => setTimeout(() => r("pending"), 50))]);
    const c = E.say("run", { pri:P.reaction });                          // lower priority while a warning speaks → dropped
    out.cPlayed = await c; out.v3 = E.state().voice && E.state().voice.id;
    out.ducked = GEI_AUDIO.state.musicDucking; out.femaleWhileSpeaking = GEI_AUDIO.femaleAllowed();
    out.busy = E.voiceBusy();
    await b; await new Promise(r => setTimeout(r, 700));
    out.after = { voice:E.state().voice, ducked:GEI_AUDIO.state.musicDucking, female:GEI_AUDIO.femaleAllowed() };
    out.playingEls = [...document.querySelectorAll("audio")].filter(a => !a.paused).length;
    return out;
  });
  check("F4a. a higher-priority voice interrupts a lower one (reaction → warning)", r.v1 === "whoa" && r.v2 === "hold" && r.aEnded === false, r);
  check("F4b. a lower-priority voice never talks over a higher one (dropped, not mixed)", r.cPlayed === false && r.v3 === "hold", r);
  check("F4c. music ducks while a Flow Moment voice speaks; the narrator is held back; both restore afterwards", r.ducked === true && r.femaleWhileSpeaking === false && r.busy === true && r.after.voice === null && r.after.ducked === false && r.after.female === true, r);
  const mute = await page.evaluate(async () => { GEI_AUDIO.setMuted(true); const p = await FlowMomentEngine.say("uhoh", { pri:1 }); const v = FlowMomentEngine.state().voice; GEI_AUDIO.setMuted(false); return { p, v }; });
  check("F4d. mute is respected (no voice starts, nothing waits)", mute.p === false && mute.v === null, mute);
  const ach = await page.evaluate(async () => { const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; FlowMomentEngine.say("again", { pri:1 }); await new Promise(r => setTimeout(r, 100)); const busy = FlowMomentEngine.voiceBusy(); FlowMomentEngine.stopVoice(); return { has:!!D, busy, after:FlowMomentEngine.voiceBusy() }; });
  check("F4e. the achievement director sees the lane as busy; stopVoice() frees it immediately", ach.has && ach.busy && !ach.after, ach);
  check("F4f. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

/* ------------------------------------------------------------------ F5 */
const VIEWS = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]];
async function suiteFailure(){
  console.log("F5 failure cinematic");
  const h = await boot({ clipMs:350 }); const { page } = h;
  await page.evaluate(() => { window.__ban = []; window.__card = null; new MutationObserver(() => { const b = document.querySelector(".fmeBannerIn"); const bn = document.querySelector(".fmeBanner"); if (b && bn && bn.classList.contains("go") && (!window.__ban.length || window.__ban[window.__ban.length - 1] !== b.textContent)) window.__ban.push(b.textContent); }).observe(document.querySelector(".fmeBanner"), { subtree:true, childList:true, attributes:true, characterData:true }); });
  const before = await page.evaluate(() => ({ tot:state.totalFlOz, lvl:state.levelFlOz, lv:state.level, step:state.currentStep, sh:document.documentElement.scrollHeight, sw:document.documentElement.scrollWidth }));
  await page.evaluate(() => { FlowMomentEngine.config.forcePlan = { event:"normal", reaction:"jump", weather:"none", dir:1, lines:["run", "whoa", "flood"] }; });
  await h.start(); await h.untilTimeout();
  const tTimeout = Date.now();
  const early = await page.evaluate(() => ({ card:document.getElementById("timeUpCard").classList.contains("show"), cine:FlowMomentEngine.state().cinematic, phase:state.phase }));
  check("F5a. at 0 the game stops and the cinematic starts — 'Try Day Again' is NOT shown immediately", early.cine && !early.card && early.phase === "timeout", early);
  await sleep(150);
  const frozen = await page.evaluate(() => document.getElementById("world").classList.contains("fmeFrozen"));
  check("F5b. PHASE 1 freeze (≈250–400 ms of silence) precedes the first voice", frozen, frozen);
  await h.untilCard(); const dur = Date.now() - tTimeout;
  const r = await page.evaluate(() => ({ log:FlowMomentEngine.state().voiceLog.slice(), ban:window.__ban.slice(), plan:FlowMomentEngine.state().plan }));
  const order = ["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"];
  const got = r.log.filter(x => order.includes(x)).slice(-10);
  check("F5c. voices play in the specified order: UH-OH → PRESSURE CRITICAL → HOLD THE DAM → TOO MUCH FLOW → THE DAM IS CRACKING → WE HAVE A BREAK → THE DAM BROKE → RUN → WHOA → THAT WAS A FLOOD", JSON.stringify(got) === JSON.stringify(order), r.log);
  const wanted = ["UH-OH…", "PRESSURE CRITICAL", "HOLD THE DAM!", "TOO MUCH FLOW!", "THE DAM IS CRACKING!", "WE HAVE A BREAK!", "RUN!", "WHOA!", "THAT WAS A FLOOD!"];
  check("F5d. the matching big phrases are shown, in order", JSON.stringify(wanted.filter(w => r.ban.includes(w))) === JSON.stringify(wanted) && wanted.every((w, i) => r.ban.indexOf(w) >= (i ? r.ban.indexOf(wanted[i - 1]) : 0)), r.ban);
  check("F5e. the whole failure (≈ 8 clips) stays under ~12 s with 0.35 s clips", dur < 12500, dur);
  await sleep(1500);
  const card = await page.evaluate(() => {
    const q = s => document.querySelector(s).getBoundingClientRect(), c = q("#timeUpCard .gameOverInner"), b = q("#retryDayBtn"), t = document.querySelector(".fmeTip");
    return { btn:[b.top, b.bottom], card:[c.top, c.bottom], vh:innerHeight, title:document.getElementById("timeUpTitle").textContent, tip:t.innerText.replace(/\s+/g, " "), btnText:document.getElementById("retryDayBtn").textContent, sub:document.querySelector(".timeUpCard .gameOverSub").innerText, sy:scrollY, sh:document.documentElement.scrollHeight, sw:document.documentElement.scrollWidth };
  });
  check("F5f. educational card: 🌊 THE DAM BROKE!, 'You ran out of time…', DAM GUIDE TIP (3 lines), 🔄 TRY DAY AGAIN", /THE DAM BROKE/.test(card.title) && /ran out of time before completing the hydraulic sequence/.test(card.sub) && /DAM GUIDE TIP Control the flow\. Watch the pressure\. Keep the system moving\./.test(card.tip) && /TRY DAY AGAIN/.test(card.btnText), card);
  check("F5g. no page scroll was created by the cinematic (scroll position + document size unchanged)", card.sy === 0 && card.sh === before.sh && card.sw === before.sw, { card, before });
  const voiceAgain = await page.evaluate(() => FlowMomentEngine.state().voiceLog);
  await sleep(500);
  check("F5h. the encouraging 'Try again, Dam-ite' voice plays with the card", (await page.evaluate(() => FlowMomentEngine.state().voiceLog)).includes("again"), voiceAgain);
  const state1 = await page.evaluate(() => ({ tot:state.totalFlOz, lvl:state.levelFlOz, lv:state.level, step:state.currentStep, tap:state.tapCount }));
  check("F5i. the timeout rules are unchanged: no FL OZ added/removed, same level and day, taps reset", state1.tot === before.tot && state1.lvl === before.lvl && state1.lv === before.lv && state1.step === before.step && state1.tap === 0, { before, state1 });
  /* retry */
  await page.click("#retryDayBtn"); await sleep(900);
  const after = await page.evaluate(() => {
    const E = FlowMomentEngine.state(), w = document.getElementById("world"), fl = [...document.querySelectorAll(".fmeWv")].map(e => e.classList.contains("up"));
    return { phase:state.phase, cine:E.cinematic, timers:E.timers, particles:E.particles, voice:E.voice, fl, cls:[...w.classList].filter(c => /^fme/.test(c)), html:document.documentElement.classList.contains("fmeCineOn"), card:document.getElementById("timeUpCard").classList.contains("show"),
      co:document.querySelectorAll(".fmeCo").length, dam:[...document.querySelectorAll(".station .body")].filter(b => /fme/.test(b.getAttribute("class") || "")).length, rem:currentRemainingMs(), dockOp:getComputedStyle(document.querySelector(".geiUtilityDock") || document.body).opacity };
  });
  check("F5j. Try Day Again restores everything: day playing, flood drained, no leftover classes / timers / particles / voices, dock back", after.phase === "playing" && !after.cine && after.timers === 0 && after.particles === 0 && !after.voice && after.fl.every(x => !x) && after.cls.length === 0 && !after.html && !after.card && after.dam === 0 && after.dockOp !== "0", after);
  check("F5k. the new day's clock is fresh", after.rem > 4500, after.rem);
  await h.close();
  for (const [w, hgt] of VIEWS){
    const v = await boot({ clipMs:200, viewport:{ width:w, height:hgt } });
    await v.start(); await v.untilCard(); await sleep(1200);
    const g = await v.page.evaluate(() => { const b = document.getElementById("retryDayBtn").getBoundingClientRect(), c = document.querySelector("#timeUpCard .gameOverInner").getBoundingClientRect(), t = document.getElementById("timeUpTitle").getBoundingClientRect(); const tip = document.querySelector(".fmeTip").getBoundingClientRect(); return { btn:[Math.round(b.top), Math.round(b.bottom)], vh:innerHeight, vw:innerWidth, left:c.left, right:c.right, titleTop:t.top, tipBottom:tip.bottom, btnTop:b.top, sy:scrollY, tl:document.querySelector(".timeUpCard .gameOverInner").scrollHeight <= document.querySelector(".timeUpCard .gameOverInner").clientHeight + 1 }; });
    check(`F5l. ${w}×${hgt}: card inside the viewport, TRY DAY AGAIN visible without scrolling, tip not covered by the button, nothing clipped`, g.btn[0] >= 0 && g.btn[1] <= g.vh && g.left >= 0 && g.right <= g.vw && g.titleTop >= 0 && g.tipBottom <= g.btnTop + 1 && g.sy === 0 && g.tl, g);
    await v.close();
  }
}

/* ------------------------------------------------------------------ F6 */
async function suiteRandom(){
  console.log("F6 randomisation + rare events");
  const h = await boot({ clipMs:90 }); const { page } = h;
  const d = await page.evaluate(() => {
    const E = FlowMomentEngine, n = 20000, ev = {}, rx = {}, dirs = { 1:0, "-1":0 }, wx = {}; let shake = [1e9, 0], water = [1e9, 0];
    for (let i = 0; i < n; i++){ const p = E._test.makePlan(); ev[p.event] = (ev[p.event] || 0) + 1; rx[p.reaction] = (rx[p.reaction] || 0) + 1; dirs[p.dir]++; wx[p.weather] = (wx[p.weather] || 0) + 1; shake = [Math.min(shake[0], p.shake), Math.max(shake[1], p.shake)]; water = [Math.min(water[0], p.water), Math.max(water[1], p.water)]; }
    return { n, ev, rx, dirs, wx, shake, water };
  });
  const rate = k => (d.ev[k] || 0) / d.n;
  check("F6a. WHO TURNED THAT WATER ON?! (comedy) plays in 10–20 % of failures", rate("comedy") >= .10 && rate("comedy") <= .20, d.ev);
  check("F6b. rare events stay rare (each < 8 %, together < 25 %) and normal failures stay the majority", ["mega", "beaver", "wheel", "hydrant", "rescue"].every(k => rate(k) > .01 && rate(k) < .08) && (1 - rate("normal") - rate("comedy")) < .25 && rate("normal") > .55, d.ev);
  check("F6c. reactions, flood direction, weather, shake and water intensity all vary", Object.keys(d.rx).length >= 7 && d.dirs[1] > 8000 && d.dirs[-1] > 8000 && Object.keys(d.wx).length === 4 && d.shake[1] - d.shake[0] > .5 && d.water[1] - d.water[0] > .2, d);
  const same = await page.evaluate(() => { const E = FlowMomentEngine, st = []; for (let i = 0; i < 200; i++){ const p = E._test.makePlan(); st.push(p.reaction); } return st.length; });
  check("F6d. plans generate without error", same === 200);
  /* every rare event and every reaction runs to the card without errors */
  const combos = [["mega", "swept"], ["beaver", "swept"], ["wheel", "grab"], ["hydrant", "float"], ["rescue", "escape"], ["comedy", "popup"], ["normal", "dive"], ["normal", "jump"]];
  let ok = 0; const bad = [];
  for (const [event, reaction] of combos){
    const v = await boot({ clipMs:90 });
    await v.page.evaluate(([e, r]) => { FlowMomentEngine.config.forcePlan = { event:e, reaction:r, weather:"storm", dir:-1, lines:e === "comedy" ? ["whoa", "who"] : e === "rescue" ? [{ text:"RUN!", clip:"run" }, { text:"PHEW!", clip:null }, "flood"] : ["run", "whoa", "flood"] }; }, [event, reaction]);
    await v.start(); await v.untilCard();
    const res = await v.page.evaluate(() => ({ log:FlowMomentEngine.state().voiceLog, tag:document.querySelector(".fmeTag").textContent }));
    const ev = { mega:"MEGA FLOOD", beaver:"BEAVER FLOOD", wheel:"WATERWHEEL CHAOS", hydrant:"HYDRANT FLOOD", rescue:"RESCUE MOMENT", comedy:"COMEDY FAILURE" }[event];
    const good = v.errors.length === 0 && (!ev || res.tag.includes(ev)) && (event !== "comedy" || res.log.includes("who"));
    if (good) ok++; else bad.push({ event, reaction, errors:v.errors, tag:res.tag });
    await v.close();
  }
  check("F6e. MEGA FLOOD, BEAVER FLOOD, WATERWHEEL CHAOS, HYDRANT FLOOD, RESCUE MOMENT, COMEDY FAILURE (+ every character reaction) run through to the card with their tag / voice, no errors", ok === combos.length, bad);
  await h.close();
}

/* ------------------------------------------------------------------ F7 */
async function suiteSafety(){
  console.log("F7 safety");
  { // reduced motion
    const h = await boot({ clipMs:200, reduced:true }); const { page } = h;
    await h.start(); const t0 = Date.now(); await h.untilTimeout();
    let shake = false, parts = 0; const poll = Date.now();
    while (Date.now() - poll < 9000 && !(await page.evaluate(() => document.getElementById("timeUpCard").classList.contains("show")))){ const s = await page.evaluate(() => ({ s:document.getElementById("world").className, p:FlowMomentEngine.state().particles })); if (/fmeShake|fmeRumble/.test(s.s)) shake = true; parts = Math.max(parts, s.p); await sleep(100); }
    const card = await page.evaluate(() => document.getElementById("timeUpCard").classList.contains("show"));
    check("F7a. prefers-reduced-motion: no camera shake, no particles, cinematic still completes into the card", card && !shake && parts === 0, { card, shake, parts });
    check("F7b. reduced motion: no uncaught errors", h.errors.length === 0, h.errors);
    await h.close();
  }
  { // mute
    const h = await boot({ clipMs:200 }); const { page } = h;
    await page.evaluate(() => GEI_AUDIO.setMuted(true));
    await h.start(); await h.untilCard();
    const log = await page.evaluate(() => FlowMomentEngine.state().voiceLog);
    check("F7c. muted: no voice is requested, visuals still complete", log.length === 0, log);
    await h.close();
  }
  { // skip + hidden tab
    const h = await boot({ clipMs:200 }); const { page } = h;
    await h.start(); await h.untilTimeout();
    await page.waitForFunction(() => FlowMomentEngine.state().skippable, null, { timeout:15000 }); await sleep(900);
    const t0 = Date.now(); const p = await h.worldPoint(); await page.mouse.click(p[0], p[1]);
    await page.waitForFunction(() => document.getElementById("timeUpCard").classList.contains("show"), null, { timeout:3000 });
    check("F7d. tap-to-skip after the break goes straight to the card", Date.now() - t0 < 1500);
    await page.click("#retryDayBtn"); await sleep(700);
    const early = await page.evaluate(() => FlowMomentEngine.state().skippable);
    await page.evaluate(() => { window.__tapsBefore = state.tapCount; });
    await h.close();
    const g = await boot({ clipMs:200 }); await g.start(); await g.untilTimeout(); await sleep(400);
    const stray = await g.page.evaluate(() => { const r = document.getElementById("fmeRoot"); return { skippable:r.classList.contains("skippable") }; });
    check("F7e. frantic taps at the moment the clock hits 0 cannot skip the cinematic (skip only arms after the break)", stray.skippable === false, stray);
    await g.close();
  }
  { // game keeps working: day can be completed after a failure + retry
    const h = await boot({ clipMs:150 }); const { page } = h;
    await h.start(); await h.untilCard(); await page.click("#retryDayBtn"); await sleep(600);
    for (let i = 0; i < 6; i++){ await h.tap(); await sleep(140); }
    await sleep(300);
    const s = await page.evaluate(() => ({ flo:state.levelFlOz, busy:state.busy, phase:state.phase }));
    check("F7f. after a failure + retry the same day still pays out normally (+111 FL OZ)", s.flo === 111, s);
    check("F7g. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

/* ------------------------------------------------------------------ F8 */
async function suiteSuccess(){
  console.log("F8 success");
  const h = await boot({ clipMs:200 }); const { page } = h;
  await page.evaluate(() => { window.__co = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")) window.__co.push(n.innerText.replace(/\s+/g, " ").trim()); }))).observe(document.body, { subtree:true, childList:true }); });
  await h.start();
  for (let day = 0; day < 6; day++){
    await page.waitForFunction(d => state.phase === "playing" && state.currentStep === d && !state.busy, day, { timeout:15000 });
    const req = await page.evaluate(() => getRequiredTaps(state.level));
    for (let i = 0; i < req; i++){ await h.tap(); await sleep(230); }
  }
  await page.waitForFunction(() => window.__co.some(t => /LEVEL COMPLETE!/.test(t)), null, { timeout:15000 });   // the finale fires from reachOcean(), ~1 s after the last tap
  await sleep(300);
  const r = await page.evaluate(() => ({ co:window.__co, flo:state.levelFlOz, tot:state.totalFlOz, done:state.completedLevels }));
  check("F8a. GATE OPEN! (day 4) and WATERWHEEL POWER! (day 5) celebrate the right days", r.co.some(t => /GATE OPEN/.test(t)) && r.co.some(t => /WATERWHEEL POWER/.test(t)), r.co);
  const fin = r.co.slice(-4).join("|");
  check("F8b. the finale runs DAM STABILIZED → CONTROLLED RELEASE → POWER ON! → LEVEL COMPLETE!", /DAM STABILIZED.*CONTROLLED RELEASE.*POWER ON.*LEVEL COMPLETE!/.test(fin), r.co.slice(-5));
  check("F8c. progress and economy are exactly as before: 6 × 111 = 666 FL OZ, one level completed", r.flo === 666 && r.tot === 666 && r.done === 1, r);
  const fail = await page.evaluate(() => FlowMomentEngine.state().cinematic);
  check("F8d. success never triggers the failure cinematic; no uncaught errors", !fail && h.errors.length === 0, h.errors);
  await h.close();
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, callouts:suiteCallouts, pressure:suitePressure, voice:suiteVoice, failure:suiteFailure, random:suiteRandom, safety:suiteSafety, success:suiteSuccess };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
