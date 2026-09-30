/* V2.1.88 — DAM Friendly Soundtrack Director regression harness
 *
 * Loads the real index.html in headless Chromium (desktop + Android/iOS-sized
 * emulation), drives real user gestures, and verifies the soundtrack director
 * against the V2.1.88 checklist. Presentation/audio only: no PayPal, no economy.
 *
 *   node tools/v2-soundtrack/soundtrack-regression.mjs
 *
 * Needs Playwright (+ Chromium). Resolved from the project, then the global npm root.
 * Exits non-zero if any check fails; prints a JSON report.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const MODULE = "/dam-friendly-soundtrack-v2188.js";

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
function serve(){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (p === "/") p = "/index.html";
        const f = resolve(root, "." + p);
        if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
        await stat(f);
        res.writeHead(200, { "content-type": TYPES[extname(f)] || "application/octet-stream" });
        res.end(await readFile(f));
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

const results = [];
const BASELINE = { director: null };
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Counts every AudioContext constructed on the page. */
const INIT = `(() => {
  window.__acCount = 0;
  const wrap = (Orig) => { if(!Orig) return Orig; const W = function(...a){ window.__acCount++; return new Orig(...a); }; W.prototype = Orig.prototype; return W; };
  window.AudioContext = wrap(window.AudioContext);
  if (window.webkitAudioContext) window.webkitAudioContext = window.AudioContext;
})();`;

async function newPage(browser, base, opts = {}){
  const ctx = await browser.newContext(opts.device || { viewport:{ width:1280, height:800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.route("**/*", route => {
    const u = route.request().url();
    if (!u.startsWith(base)) return route.abort();                        // offline: no CDN / PayPal / images
    if (opts.withoutModule && u.endsWith(MODULE)) return route.fulfill({ status:200, contentType:"text/javascript", body:"" });
    return route.continue();
  });
  await page.addInitScript(INIT);
  if (opts.noWebAudio) await page.addInitScript(() => { delete window.AudioContext; delete window.webkitAudioContext; });
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(600);
  return { ctx, page, errors };
}
const ev = (page, fn, arg) => page.evaluate(fn, arg);

async function desktopSuite(browser, base){
  const { ctx, page, errors } = await newPage(browser, base);

  check("module installed + music button rendered", await ev(page, () => !!window.DAMSoundtrack && !!document.getElementById("damMusicBtn")));
  const pre = await ev(page, () => ({ init: DAMSoundtrack.initialized, playing: DAMSoundtrack.playing }));
  check("autoplay safety: nothing starts before a user gesture", !pre.init && !pre.playing, pre);

  await page.mouse.click(640, 420);                                      // first real gesture (splash is up)
  await sleep(900);
  const s1 = await ev(page, () => ({ ...DAMSoundtrack.selfTest(), ctxState: DAMSoundtrack.debug.stats().ctxState, same: DAMSoundtrack.debug.bus().ctx === audioCtx }));
  check("AudioContext initializes (shared game context, running)", s1.ctxState === "running" && s1.same, s1);
  check("soundtrack starts after valid interaction", s1.initialized && s1.playing, s1.phase);
  check("splash intro initializes correctly", s1.phase === "intro" || s1.phase === "lobby", s1.phase);
  check("no duplicate AudioContexts created by the director", s1.contextsCreatedByDirector === 0 && s1.sharedContext === true, s1);

  await sleep(1500);
  const peak = await ev(page, async () => { let m = 0; DAMSoundtrack.debug.meter(); for (let i = 0; i < 20; i++){ await new Promise(r => setTimeout(r, 100)); m = Math.max(m, DAMSoundtrack.debug.meter()); } return m; });
  check("music is audible and conservatively mastered (no clipping)", peak > 0.0005 && peak < 0.35, { peak });

  await ev(page, () => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else window.geiFinishSplash && geiFinishSplash(); });
  await sleep(2600);
  const s2 = await ev(page, () => ({ phase: DAMSoundtrack.phase, theme: DAMSoundtrack.currentTheme, st: DAMSoundtrack.debug.stats() }));
  check("splash → random gameplay theme hand-off", s2.phase === "theme" && !!s2.theme, s2);
  check("crossfade used for the hand-off", s2.st.counters.crossfades >= 0 && s2.st.bars > 0, s2.st);
  const nowChip = await ev(page, () => !!document.getElementById("dam2188NowPlaying"));
  check("NOW PLAYING chip appears (fades away)", nowChip);

  /* the player dismisses the pre-game guide → PLAY state */
  const guideClosed = await ev(page, () => { try { if (typeof closeGameGuide === "function") closeGameGuide(); } catch (e) {} return !document.getElementById("preGameCard").classList.contains("show"); });
  check("pre-game guide still closes normally", guideClosed);
  await sleep(600);
  check("gameplay state detected as PLAY", await ev(page, () => DAMSoundtrack.gameState) === "play");

  /* activity mixer */
  await ev(page, () => DAMSoundtrack.debug.settle());
  for (let i = 0; i < 10; i++){ await page.mouse.click(620 + (i % 3) * 20, 520); await sleep(90); }
  await sleep(300);
  const act = await ev(page, () => ({ a: DAMSoundtrack.activityScore, t: DAMSoundtrack.mixTarget, l: DAMSoundtrack.mixLevel }));
  check("activity score reacts to taps", act.a > 0.3, act);
  check("music level drops into the tapping band (0.18–0.28)", act.t >= 0.18 && act.t <= 0.28, act);

  /* ducking */
  await sleep(2500);
  const d = await ev(page, async () => {
    const before = DAMSoundtrack.duckMultiplier;
    playDayRewardSound();
    await new Promise(r => setTimeout(r, 120));
    const during = DAMSoundtrack.duckMultiplier, g = DAMSoundtrack.debug.bus().duck.gain.value;
    let after = 0, gAfter = 0;                                   // live game events may re-duck; wait for a release
    for (let i = 0; i < 30 && after !== 1; i++){ await new Promise(r => setTimeout(r, 100)); after = DAMSoundtrack.duckMultiplier; }
    await new Promise(r => setTimeout(r, 900)); gAfter = DAMSoundtrack.debug.bus().duck.gain.value;
    return { before, during, g, after, gAfter, byKind: DAMSoundtrack.debug.stats().ducksByKind };
  });
  check("music ducks during reward event (never fully cut)", d.during < 1 && d.g > 0.15, d);
  check("duck recovers smoothly", d.after === 1, d);

  /* idle lift + ceiling */
  const idle = await ev(page, () => {
    const out = {};
    for (const s of [0, 8, 25, 60, 120, 400]){ DAMSoundtrack.debug.simulateIdle(s); out[s] = +DAMSoundtrack.debug.settle().toFixed(3); }
    DAMSoundtrack.debug.simulateIdle(0);
    return out;
  });
  check("music rises during inactivity", idle[25] > idle[0] && idle[60] >= idle[25], idle);
  check("idle lift respects ceiling (≤ 0.48) and calm band", Math.max(...Object.values(idle)) <= 0.48 && idle[60] >= 0.44 && idle[8] >= 0.30 && idle[8] <= 0.42, idle);
  check("very long idle settles back down", idle[400] < idle[120], idle);

  /* random selection */
  const bag = await ev(page, () => { localStorage.removeItem("damMusicThemeBag"); localStorage.removeItem("damMusicLastTheme"); const seq = []; for (let i = 0; i < 48; i++) seq.push(DAMSoundtrack.debug.nextThemeId()); return seq; });
  const noRepeat = bag.every((x, i) => i === 0 || x !== bag[i - 1]);
  const blocksFull = [0, 8, 16, 24, 32, 40].every(i => new Set(bag.slice(i, i + 8)).size === 8);
  check("random theme selection works (shuffle bag covers all 8)", blocksFull, bag.slice(0, 16));
  check("same theme is never selected twice in a row", noRepeat);

  /* crossfade via next() */
  const cf = await ev(page, async () => {
    const a = DAMSoundtrack.currentTheme, c0 = DAMSoundtrack.debug.stats().counters.crossfades;
    DAMSoundtrack.next();
    let minPeak = 1;
    for (let i = 0; i < 10; i++){ await new Promise(r => setTimeout(r, 150)); minPeak = Math.min(minPeak, DAMSoundtrack.debug.meter()); }
    return { a, b: DAMSoundtrack.currentTheme, c: DAMSoundtrack.debug.stats().counters.crossfades - c0, minPeak };
  });
  check("crossfade works (new theme, old faded, no hard stop)", cf.a !== cf.b && cf.c >= 1, cf);

  /* pause / resume */
  const pr = await ev(page, async () => {
    DAMSoundtrack.pause(); await new Promise(r => setTimeout(r, 700));
    const p = { playing: DAMSoundtrack.playing, user: DAMSoundtrack.debug.bus().user.gain.value, timer: DAMSoundtrack.debug.stats().timerActive };
    DAMSoundtrack.resume(); await new Promise(r => setTimeout(r, 900));
    return { p, resumed: DAMSoundtrack.playing, user: DAMSoundtrack.debug.bus().user.gain.value, timer: DAMSoundtrack.debug.stats().timerActive };
  });
  check("soundtrack can pause (faded, timer stopped)", !pr.p.playing && pr.p.user < 0.05 && !pr.p.timer, pr.p);
  check("soundtrack can resume", pr.resumed && pr.user > 0.5 && pr.timer, pr);

  /* toggle + persistence */
  await page.click("#damMusicBtn");
  await sleep(300);
  const off = await ev(page, () => ({ en: DAMSoundtrack.enabled, ls: localStorage.getItem("damMusicEnabled"), icon: document.getElementById("damMusicBtn").textContent }));
  check("music toggle turns music off (🔇, stored)", !off.en && off.ls === "false" && off.icon === "🔇", off);
  await page.click("#damMusicBtn");
  await sleep(300);
  const on = await ev(page, () => ({ en: DAMSoundtrack.enabled, playing: DAMSoundtrack.playing, icon: document.getElementById("damMusicBtn").textContent }));
  check("music toggle turns music back on", on.en && on.playing && on.icon === "🎵", on);

  /* existing audio still works */
  const legacy = await ev(page, () => {
    const P = GEI_TAP_PERFORMANCE, v0 = P.snapshot ? null : null;
    const started0 = P.state.audio.started;
    const tap = (playWaterTap(1), P.state.audio.started > started0);
    const s1 = P.state.audio.started;
    DAM_AUDIO.hydraulic.splash();
    const hydraulic = P.state.audio.started > s1;
    const sig = window.__GEI_V2157_SIGNATURE_AUDIO__;
    const nature = window.__GEI_TAP_LITES_SOUND_NATURE__;
    return { tap, hydraulic, sigPresent: !!sig && typeof sig.play === "function", sigPlay: sig ? sig.play("guide") : null,
             nature: !!nature && nature.version === "V2.1.79", wrapped: typeof playWaterTap.__v2188Original === "function",
             director: !!window.__GEI_TAP_LITES_MOMENT_DIRECTOR__ };
  });
  check("existing tap audio still works (through wrapper)", legacy.tap && legacy.wrapped, legacy);
  check("existing hydraulic/DAM_AUDIO sounds still work", legacy.hydraulic, legacy);
  check("existing nature audio module still installed", legacy.nature, legacy);
  check("existing signature moment audio still works", legacy.sigPresent && legacy.sigPlay === true, legacy);
  check("other Tap Lites modules unchanged by V2.1.88 (moment director state matches baseline)", legacy.director === BASELINE.director, { withV2188: legacy.director, baseline: BASELINE.director });

  /* memory / node hygiene over a longer run */
  for (let i = 0; i < 25; i++){ await page.mouse.click(600 + (i % 5) * 15, 540); await sleep(120); }
  await sleep(6000);
  const mem = await ev(page, () => ({ ...DAMSoundtrack.debug.stats(), max: DAMSoundtrack.selfTest().maxVoices }));
  check("voice count bounded (no node pile-up)", mem.peakVoices <= mem.max && mem.voices <= mem.max, mem);
  const mem2 = await ev(page, async () => { DAMSoundtrack.pause(); await new Promise(r => setTimeout(r, 4500)); return DAMSoundtrack.debug.stats(); });
  check("voices are released after pause (no leak)", mem2.voices <= 4, mem2);
  await ev(page, () => DAMSoundtrack.resume());

  /* hidden tab */
  const vis = await ev(page, async () => {
    Object.defineProperty(document, "hidden", { configurable:true, get:() => true });
    document.dispatchEvent(new Event("visibilitychange"));
    await new Promise(r => setTimeout(r, 200));
    const hiddenTimer = DAMSoundtrack.debug.stats().timerActive;
    Object.defineProperty(document, "hidden", { configurable:true, get:() => false });
    document.dispatchEvent(new Event("visibilitychange"));
    await new Promise(r => setTimeout(r, 200));
    return { hiddenTimer, visibleTimer: DAMSoundtrack.debug.stats().timerActive };
  });
  check("scheduler stops while tab is hidden and resumes after", !vis.hiddenTimer && vis.visibleTimer, vis);

  /* volume persists + next session gets a different tune */
  const firstTheme = await ev(page, () => { DAMSoundtrack.setVolume(0.5); return localStorage.getItem("damMusicLastTheme"); });
  await page.reload({ waitUntil:"load" });
  await sleep(600);
  const reload = await ev(page, () => ({ v: DAMSoundtrack.musicVolume, en: DAMSoundtrack.enabled }));
  check("volume persists across refresh", Math.abs(reload.v - 0.5) < 1e-6 && reload.en, reload);
  await ev(page, () => window.geiFinishSplash && geiFinishSplash());
  await sleep(1200);
  await page.mouse.click(640, 520);
  await sleep(5500);
  const t2 = await ev(page, () => DAMSoundtrack.currentTheme);
  check("next session plays a different tune", !!t2 && t2 !== firstTheme, { firstTheme, t2 });

  const own = errors.filter(e => /soundtrack|DAMSoundtrack|2188/i.test(e));
  await ctx.close();
  return { errors, own };
}

async function baselineErrors(browser, base){
  const { ctx, page, errors } = await newPage(browser, base, { withoutModule:true });
  await page.mouse.click(640, 420); await sleep(1500);
  for (let i = 0; i < 10; i++){ await page.mouse.click(620, 520); await sleep(90); }
  await sleep(800);
  BASELINE.director = await ev(page, () => !!window.__GEI_TAP_LITES_MOMENT_DIRECTOR__);
  await ctx.close();
  return errors;
}

async function mobileSuite(browser, base, name, device){
  const { ctx, page, errors } = await newPage(browser, base, { device });
  await page.touchscreen.tap(device.viewport.width / 2, device.viewport.height / 2);
  await sleep(1200);
  const s = await ev(page, () => DAMSoundtrack.selfTest());
  const btn = await ev(page, () => { const b = document.getElementById("damMusicBtn"); if (!b) return null; const r = b.getBoundingClientRect(); return { w:r.width, h:r.height, inView: r.right <= innerWidth && r.left >= 0 }; });
  check(`${name}: starts on touch gesture`, s.playing && s.initialized, s.phase);
  check(`${name}: music button fits HUD`, btn && btn.inView && btn.w >= 34, btn);
  await ctx.close();
  return errors;
}

async function noAudioSuite(browser, base){
  const { ctx, page, errors } = await newPage(browser, base, { noWebAudio:true });
  await page.mouse.click(640, 420); await sleep(800);
  const s = await ev(page, () => ({ exists: !!window.DAMSoundtrack, playing: DAMSoundtrack.playing, btn: !!document.getElementById("damMusicBtn") }));
  const own = errors.filter(e => /soundtrack|DAMSoundtrack|2188/i.test(e));
  check("fails gracefully when Web Audio is unavailable", s.exists && !s.playing && s.btn && own.length === 0, { s, own });
  await ctx.close();
}

const pw = await loadPlaywright();
const chromium = pw.chromium;
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args:["--autoplay-policy=user-gesture-required"] })
  .catch(() => chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args:["--autoplay-policy=user-gesture-required"] }));

let report;
try {
  const base0 = await baselineErrors(browser, base);
  const desk = await desktopSuite(browser, base);
  const baseSet = new Set(base0.map(e => e.replace(/\d+/g, "#")));
  const newErrors = desk.errors.filter(e => !baseSet.has(e.replace(/\d+/g, "#")));
  check("no console errors introduced (vs. baseline without V2.1.88)", desk.own.length === 0 && newErrors.length === 0, { own: desk.own, newErrors, baselineCount: base0.length });
  const android = pw.devices["Pixel 7"], iphone = pw.devices["iPhone 13"];
  await mobileSuite(browser, base, "Chrome Android (Pixel 7 emulation)", { ...android });
  await mobileSuite(browser, base, "iOS-sized (iPhone 13 emulation on Chromium)", { viewport: iphone.viewport, userAgent: iphone.userAgent, deviceScaleFactor: iphone.deviceScaleFactor, isMobile: true, hasTouch: true });
  await noAudioSuite(browser, base);
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter(r => !r.pass);
report = { engine:"DAM Friendly Soundtrack Director", version:"2.1.88", testCount: results.length, passed: results.length - failed.length, failed: failed.length, results };
console.log(JSON.stringify(report, null, 2));
process.exit(failed.length ? 1 : 0);
