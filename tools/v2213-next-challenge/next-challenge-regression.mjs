/* V2.2.13 — NEXT CHALLENGE ENGINE regression harness
 *
 * Real index.html in headless Chromium (offline; the supplied MP3s are answered with a short generated WAV).
 *   N1 wiring      10 supplied clip URLs exact (incl. the dotted "Next level. Same flow. Bigger challenge." file), hook + script order, voice priority
 *   N2 selection   context-aware plans: normal / downstream / continued / harder / new station / levels remain; premium line only when earned; never random-all-ten
 *   N3 sequence    first-time full cinematic: stabilise → downstream → map → NEXT STATION → preview → READY → ENTER FLOW; strictly sequential voices, bounded time
 *   N4 repeats     repeat = fast / medium, SKIP → appears only after the first experience, onStart exactly once
 *   N5 viewports   everything inside 5 phone viewports, CTA reachable, no page scroll
 *   N6 safety      audio OFF, reduced motion, priority collisions, personality blocked, engine disabled → original start
 *   N7 chain       the real game: level → bonus wheel → -ite reveal → transition → ENTER FLOW → next level playing
 *
 *   node tools/v2213-next-challenge/next-challenge-regression.mjs [suite]
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

const FILES = ["ready-for-what-s-next-ani23auaekCqpNef", "the-next-challenge-is-waiting-kknszhwfZTxUJu24", "let-s-see-what-s-downstream-n3IchVt9o0RB4iMY", "next-stop-the-flow-JOndCQpxLnJIux84",
  "you-ready-for-the-next-one-5z6HPMeq6qDkQqQn", "the-journey-keeps-moving-ARd8p8jA8yg40X2R", "we-re-not-done-yet-Z5p74bYNKqmMRcdM", "next-level.-same-flow.-bigger-challenge.-sv7gJiIRtDF3cKDC",
  "the-next-station-is-live-jqX8sSAAdiCUpB7P", "let-s-keep-this-water-moving-k5OmlSlePyH9eSN2"];
const SET = (page, level, completed, extra) => page.evaluate(([l, c, x]) => { state.level = l; state.completedLevels = c; const N = NextChallengeEngine; N.config.fullMs = x && x.fullMs || 1; N.resetSeen(); if (x && x.seen) N.setSeen(x.seen); return true; }, [level, completed, extra || null]);
/* run a transition and sample it */
async function runNC(page, opts = {}){
  return page.evaluate(async (o) => {
    const N = NextChallengeEngine, F = FlowMomentEngine, out = { events:[], started:0, t:{} }; const logStart = F.state().voiceLog.length; window.__ncStarted = 0; const t0 = performance.now(); let maxV = 0;
    const iv = setInterval(() => { const n = [...document.querySelectorAll("audio")].filter(a => !a.paused && !a.muted).length; if (n > maxV) maxV = n;
      const r = document.getElementById("ncRoot"); if (!r) return; const q = s => r.querySelector(s);
      if (!out.t.word && q("#ncWord").classList.contains("show")) out.t.word = performance.now() - t0; if (!out.t.card && q("#ncCard").classList.contains("show")) out.t.card = performance.now() - t0;
      if (!out.t.go && q("#ncGo").classList.contains("show")) out.t.go = performance.now() - t0; if (!out.t.ready && q("#ncReady").classList.contains("show")) out.t.ready = performance.now() - t0;
      const sk = getComputedStyle(q("#ncSkip")).display !== "none"; if (sk) out.skipShown = true; }, 25);
    const took = N.run({ onStart: () => { window.__ncStarted++; out.t.start = performance.now() - t0; } }); out.took = took;
    await new Promise(r => setTimeout(r, o.waitMs || 600)); out.mode = N.state().mode; out.combo = N.state().combo; out.skipEarly = !!document.querySelector(".nc.canSkip");
    if (o.act === "go"){ await new Promise(r => setTimeout(r, o.goAfter || 0)); const g = document.getElementById("ncGo"); if (g) for (let i = 0; i < 5; i++) g.click(); }
    if (o.act === "skip"){ const s = document.getElementById("ncSkip"); if (s) { for (let i = 0; i < 3; i++) s.click(); } }
    if (o.act === "wait"){ await new Promise(r => setTimeout(r, o.holdMs || 6500)); const g = document.getElementById("ncGo"); out.goVisible = !!g && g.classList.contains("show"); const b = g && g.getBoundingClientRect(); out.go = b && [b.top, b.bottom, b.left, b.right]; out.vw = innerWidth; out.vh = innerHeight; out.sy = scrollY;
      out.voices = F.state().voiceLog.slice(logStart).filter(x => /^nc:/.test(x)); out.card = (() => { const c = document.getElementById("ncCard").getBoundingClientRect(); return [c.top, c.bottom, c.left, c.right]; })(); out.word = (() => { const w = document.getElementById("ncWord").getBoundingClientRect(); return [w.top, w.bottom, w.left, w.right]; })();
      out.texts = { eye:document.querySelector(".ncEye").textContent, lvl:document.querySelector(".ncLevel").textContent, st:document.querySelector(".ncStation").textContent, badge:document.querySelector(".ncBadge").textContent, rows:[...document.querySelectorAll(".ncRow")].map(x => x.textContent), ready:document.getElementById("ncReady").textContent, go:g && g.textContent, word:document.getElementById("ncWord").textContent };
      out.overflow = (() => { const c = document.getElementById("ncCard"); return c.scrollHeight > c.clientHeight + 2; })();
      const sk = getComputedStyle(document.getElementById("ncSkip")).display !== "none"; out.skipNow = sk; }
    await new Promise(r => setTimeout(r, 700)); clearInterval(iv);
    out.started = window.__ncStarted; out.maxOverlap = maxV; const wasActive = N.state().active; out.after = { dom:!!document.getElementById("ncRoot"), flag:!!window.__GEI_TRANSITION__, active:N.state().active, ducked:GEI_AUDIO.state.musicDucking, voice:F.state().voice, log:F.state().voiceLog.slice(logStart).filter(x => /^nc:/.test(x)) };
    if (wasActive){ N.skip(); await new Promise(r => setTimeout(r, 480)); }   // tidy up a transition the test left waiting
    return out;
  }, opts);
}

async function suiteWiring(){
  console.log("N1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "next-challenge-engine-v2213.js"), "utf8");
  check("N1a. script loads after the personality engine; the hook sits in continueToNextLevel", html.indexOf("/next-challenge-engine-v2213.js") > html.indexOf("/flow-moment-personality-v2212.js") && /NextChallengeEngine\.run\(\{ onStart: startNext \}\)/.test(html));
  check("N1b. all ten supplied clips are referenced exactly (incl. the dotted premium file)", FILES.length === 10 && FILES.every(f => js.includes(f + ".mp3")), FILES.filter(f => !js.includes(f + ".mp3")));
  const h = await boot();
  const r = await h.page.evaluate(() => ({ n:Object.keys(NextChallengeEngine.clips).length, pri:FlowMomentEngine.priorities, urls:Object.values(NextChallengeEngine.clips).map(c => c.url) }));
  check("N1c. ten clips in the library, every URL on the supplied CDN", r.n === 10 && r.urls.every(u => /^https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/.+\.mp3$/.test(u)), r.urls);
  const p = r.pri;
  check("N1d. priority: failure < level complete < ONE MORE < milestone < NEXT CHALLENGE < achievement < personality < reaction", p.cinematic < p.levelComplete && p.levelComplete < p.oneMore && p.oneMore < p.milestone && p.milestone < p.nextChallenge && p.nextChallenge < p.achievement && p.achievement < p.personality && p.personality < p.reaction, p);
  check("N1e. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteSelect(){
  console.log("N2 context-aware selection");
  const h = await boot(); const { page } = h;
  const r = await page.evaluate(() => {
    const N = NextChallengeEngine; N.resetSeen(); const out = {};
    const ctxAt = (level, completed = 5) => { state.level = level; state.completedLevels = completed; return N.buildContext(); };
    const many = (level, completed, n = 400) => { const seen = { depart:{}, reveal:{}, ready:{}, combos:{}, premiumOpen:0 }; let prev = ""; let consec = 0, ten = 0;
      for (let i = 0; i < n; i++){ N.resetSeen(); const c = ctxAt(level, completed), p = N.plan(Object.assign(c, { forceFull:true }));
        seen.depart[p.voices.depart && p.voices.depart.id] = 1; seen.reveal[p.voices.reveal && p.voices.reveal.id] = 1; seen.ready[p.voices.ready && p.voices.ready.id] = 1; seen.combos[p.combo] = 1;
        if (p.voices.depart && p.voices.depart.id === "bigger") seen.premiumOpen++; if (p.voices.depart && p.voices.reveal && p.voices.depart.id === p.voices.reveal.id) consec++; }
      return { depart:Object.keys(seen.depart).sort(), reveal:Object.keys(seen.reveal).sort(), ready:Object.keys(seen.ready), combos:Object.keys(seen.combos).sort(), premiumOpen:seen.premiumOpen, sameInOne:consec }; };
    out.c13 = (() => { const c = ctxAt(13, 12); return { next:c.nextLevel, cur:c.currentLevel, hard:c.hard, newStation:c.newStation, tapIncrease:c.tapIncrease, tapsNext:c.tapsNext, tapsCur:c.tapsCurrent, unlocked:c.unlocked, within:c.levelInStation, st:c.nextStation.name, curSt:c.currentStation.name, first:c.first }; })();
    out.c8 = (() => { const c = ctxAt(8, 7); return { hard:c.hard, newStation:c.newStation, tapIncrease:c.tapIncrease, manyRemain:c.manyRemain, left:c.levelsLeftInStation, continued:c.continued }; })();
    out.c2 = (() => { const c = ctxAt(2, 1); return { first:c.first, continued:c.continued, hard:c.hard }; })();
    out.normal = many(9, 8); out.hard = many(13, 12); out.firstNormal = many(2, 1);
    out.hardPremium = (() => { let ok = 0, n = 200; for (let i = 0; i < n; i++){ const p = N.plan(Object.assign(ctxAt(13, 12), { forceFull:true })); if (p.voices.reveal.id === "bigger") ok++; } return ok / n; })();
    out.normalPremium = (() => { let bad = 0; for (let i = 0; i < 600; i++){ N.resetSeen(); const p = N.plan(Object.assign(ctxAt([2, 3, 4, 8, 9, 10, 14][i % 7], 6), { forceFull:true })); if ([p.voices.depart, p.voices.reveal].some(v => v && v.id === "bigger")) bad++; } return bad; })();
    out.stationLive = (() => { let n = 0; for (let i = 0; i < 100; i++){ N.resetSeen(); const p = N.plan(Object.assign(ctxAt(13, 12), { forceFull:true })); if (p.voices.depart.id === "stationLive" || p.voices.reveal.id === "stationLive") n++; } return n; })();
    out.notDone = (() => { let n = 0; for (let i = 0; i < 300; i++){ N.resetSeen(); const p = N.plan(Object.assign(ctxAt(8, 7), { forceFull:true })); if (p.voices.depart.id === "notDone") n++; } return n; })();
    out.modes = (() => { N.resetSeen(); const a = N.plan(ctxAt(8, 7)).mode; const b = N.plan(ctxAt(13, 12)).mode; localStorage.setItem("geiNextChallengeSeenV1", "{}"); return { a, b }; })();
    out.maxVoices = (() => { let m = 0; for (let i = 0; i < 300; i++){ N.resetSeen(); const p = N.plan(Object.assign(ctxAt([2, 8, 13][i % 3], 5), { forceFull:true })); m = Math.max(m, Object.values(p.voices).filter(Boolean).length); } return m; })();
    /* history: no clip twice in a row across consecutive full transitions */
    out.consec = (() => { N.resetSeen(); let last = "", bad = 0; for (let i = 0; i < 300; i++){ const p = N.plan(Object.assign(ctxAt(8, 7), { forceFull:true })); const ids = [p.voices.depart, p.voices.reveal].filter(Boolean).map(v => v.id); if (ids[0] === last) bad++; last = ids[ids.length - 1]; /* remember() is internal: emulate */ } return bad; })();
    return out;
  });
  check("N2a. context: level 13 after 12 = new flow station + new tap tier → BIGGER CHALLENGE (18 taps, was 12)", r.c13.hard && r.c13.newStation && r.c13.tapIncrease && r.c13.tapsNext === 18 && r.c13.tapsCur === 12 && r.c13.within === 1 && r.c13.unlocked.length === 2, r.c13);
  check("N2b. context: level 8 after 7 = same station, same tap tier, several levels remain (not hard)", !r.c8.hard && !r.c8.newStation && !r.c8.tapIncrease && r.c8.manyRemain && r.c8.continued, r.c8);
  check("N2c. NORMAL next level uses READY FOR WHAT'S NEXT / THE NEXT CHALLENGE IS WAITING / downstream family — never the premium line", r.normalPremium === 0 && r.normal.combos.every(c => ["A", "B", "C"].includes(c)), { normalPremium:r.normalPremium, combos:r.normal.combos });
  check("N2d. HARDER level (new tier / station): the premium 'NEXT LEVEL. SAME FLOW. BIGGER CHALLENGE.' is the reveal every time; 'THE NEXT STATION IS LIVE' opens it", r.hardPremium === 1 && r.stationLive === 100 && r.hard.combos.join() === "D", { premium:r.hardPremium, live:r.stationLive, hard:r.hard });
  check("N2e. MULTIPLE LEVELS REMAIN → 'WE'RE NOT DONE YET' is used (sometimes — chance only picks between fitting lines)", r.notDone > 60 && r.notDone < 260, r.notDone);
  check("N2f. the pool varies inside a context (≥ 2 different openers for a normal level) but a transition never uses more than 3 lines and never the same line twice", r.normal.depart.length >= 2 && r.maxVoices <= 3 && r.normal.sameInOne === 0, { depart:r.normal.depart, maxVoices:r.maxVoices, same:r.normal.sameInOne });
  check("N2g. first time = full cinematic; after one experience: repeat = fast, repeat + major unlock = medium", r.modes.a === "full" && r.modes.b === "full", r.modes);
  await h.close();
}

async function suiteSequence(){
  console.log("N3 first-time sequence");
  const h = await boot({ clipMs:350 }); const { page } = h;
  await SET(page, 13, 12);
  const r = await runNC(page, { act:"wait", waitMs:600, holdMs:5600 });
  check("N3a. FIRST time: the full cinematic (mode full), no SKIP button, preview card and ENTER FLOW appear within 5 s", r.took && r.mode === "full" && !r.skipShown && r.t.card < 5000 && r.t.go < 5000, { mode:r.mode, skip:r.skipShown, t:r.t });
  check("N3b. order: NEXT STATION word → preview card → READY, DAM-ITE? (and the CTA is up before the ready line)", r.t.word < r.t.card && r.t.card <= r.t.ready + 1 && r.t.go <= r.t.ready + 50, r.t);
  check("N3c. voices are strictly sequential: THE NEXT STATION IS LIVE → NEXT LEVEL. SAME FLOW. BIGGER CHALLENGE. → YOU READY FOR THE NEXT ONE? (never two at once)", JSON.stringify(r.voices) === JSON.stringify(["nc:stationLive", "nc:bigger", "nc:readyCheck"]) && r.maxOverlap <= 1, { v:r.voices, o:r.maxOverlap });
  check("N3d. the preview card shows station, level, difficulty, objective, reward and unlocks", /NEXT STATION/.test(r.texts.eye) && r.texts.lvl === "LEVEL 13" && /FLOW STATION 3 · MILLPOND/.test(r.texts.st) && /BIGGER CHALLENGE/.test(r.texts.badge) && /18 TAPS/.test(r.texts.rows[0]) && /666 FL OZ/.test(r.texts.rows[1]) && r.texts.rows.some(x => /NEW STATION/.test(x)) && /READY, DAM-ITE\?/.test(r.texts.ready) && /ENTER FLOW/.test(r.texts.go), r.texts);
  check("N3e. READY moment + ENTER FLOW are visible and inside the viewport; the card is not clipped", r.goVisible && r.go[1] <= r.vh && r.go[0] >= 0 && r.go[3] <= r.vw && !r.overflow && r.sy === 0, { go:r.go, vh:r.vh, overflow:r.overflow });
  check("N3f. waiting changes nothing: the next level has NOT started by itself (the player is in control)", r.started === 0 && r.after.dom, { started:r.started });
  /* act */
  await SET(page, 13, 12);
  const g = await runNC(page, { act:"go", waitMs:600, goAfter:3800 });
  check("N3g. ENTER FLOW starts the level EXACTLY once (5 rapid taps), cleans the overlay, releases the duck and the transition flag", g.started === 1 && !g.after.dom && !g.after.flag && !g.after.active && g.after.ducked === false && !g.after.voice, g);
  check("N3h. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteRepeat(){
  console.log("N4 repeats + skip");
  const h = await boot({ clipMs:350 }); const { page } = h;
  await SET(page, 8, 7, { seen:2 });
  const t0 = Date.now(); const a = await runNC(page, { act:"wait", waitMs:400, holdMs:2200 });
  check("N4a. REPEAT normal transition = FAST: card + ENTER FLOW within ~1.5 s, one voice only, an unobtrusive SKIP →", a.mode === "fast" && a.t.go < 1800 && a.voices.length === 1 && a.skipNow && a.skipEarly, { mode:a.mode, go:a.t.go, v:a.voices, skip:a.skipNow });
  await SET(page, 13, 12, { seen:2 });
  const b = await runNC(page, { act:"wait", waitMs:400, holdMs:3600 });
  check("N4b. REPEAT + major unlock = MEDIUM: keeps the premium line (BIGGER CHALLENGE) but drops the opener and the ready line", b.mode === "medium" && b.voices.length === 1 && b.voices[0] === "nc:bigger" && b.t.go < 4200, { mode:b.mode, v:b.voices, go:b.t.go });
  await SET(page, 8, 7, { seen:2 });
  const s = await runNC(page, { act:"skip", waitMs:300 });
  check("N4c. SKIP → starts the level immediately, exactly once (3 rapid taps), overlay removed", s.started === 1 && s.t.start < 900 && !s.after.dom && !s.after.flag, s);
  await SET(page, 13, 12);
  const f = await runNC(page, { act:"wait", waitMs:400, holdMs:1200 });
  check("N4d. first-time has no skip button even while it plays (discovery preserved)", !f.skipShown && !f.skipEarly, f);
  /* the very first transition really marks itself as seen, so the NEXT one is fast */
  await SET(page, 8, 7);
  await runNC(page, { act:"go", waitMs:500, goAfter:3800 });
  const next = await page.evaluate(() => { const c = NextChallengeEngine.buildContext(); return { mode:NextChallengeEngine.plan(c).mode, seen:NextChallengeEngine.state().seen }; });
  check("N4e. after the first full transition the engine remembers it: the next plan is FAST", next.mode === "fast" && next.seen === 1, next);
  check("N4f. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

const VIEWS = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]];
async function suiteViewports(){
  console.log("N5 mobile viewports");
  for (const [w, hgt] of VIEWS){
    const h = await boot({ clipMs:200, viewport:{ width:w, height:hgt } }); const { page } = h;
    await SET(page, 13, 12, { fullMs:.4 });
    const r = await runNC(page, { act:"wait", waitMs:300, holdMs:3800 });
    const inside = (b) => b && b[0] >= 0 && b[1] <= r.vh + 1 && b[2] >= -1 && b[3] <= r.vw + 1;
    const gh = r.go && r.go[1] - r.go[0];
    check(`N5a. ${w}×${hgt}: word, card and ENTER FLOW inside the viewport, CTA ≥ 44 px, nothing clipped, no scrolling`, inside(r.go) && inside(r.card) && inside(r.word) && gh >= 44 && !r.overflow && r.sy === 0, { go:r.go, card:r.card, word:r.word, vh:r.vh, overflow:r.overflow });
    await h.close();
  }
}

async function suiteSafety(){
  console.log("N6 safety");
  { // audio OFF
    const h = await boot({ clipMs:300 }); const { page } = h; await SET(page, 13, 12, { fullMs:.4 });
    await page.evaluate(() => GEI_AUDIO.setMuted(true));
    const r = await runNC(page, { act:"go", waitMs:300, goAfter:2600 });
    check("N6a. audio OFF: the whole journey still plays (silently), nothing waits for audio, ENTER FLOW works", r.took && r.started === 1 && r.after.log.length === 0 && !r.after.dom, r);
    await page.evaluate(() => GEI_AUDIO.setMuted(false)); await SET(page, 13, 12, { fullMs:.4 });
    const on = await runNC(page, { act:"go", waitMs:300, goAfter:3200 });
    check("N6b. audio ON again: the transition speaks", on.after.log.length >= 2, on.after.log);
    check("N6c. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close();
  }
  { // reduced motion
    const h = await boot({ clipMs:200, reduced:true }); const { page } = h; await SET(page, 13, 12);
    const r = await page.evaluate(async () => { const N = NextChallengeEngine; N.run({ onStart:() => {} }); await new Promise(r => setTimeout(r, 2200)); const t = document.getElementById("ncTrack"), cs = getComputedStyle(t);
      const out = { transform:t.style.transform, drops:document.querySelectorAll(".ncDrop").length, anims:document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest("#ncRoot")).length, go:document.getElementById("ncGo").classList.contains("show") };
      N.skip(); return out; });
    check("N6d. reduced motion: no drops, no camera pan animation (the map simply settles on the next station), ENTER FLOW reachable", r.drops === 0 && r.anims <= 3 && r.go, r);
    await h.close();
  }
  { // priority + personality + disabled
    const h = await boot({ clipMs:700 }); const { page } = h; await SET(page, 13, 12);
    const r = await page.evaluate(async () => { const N = NextChallengeEngine, F = FlowMomentEngine, P = F.priorities, w = ms => new Promise(r => setTimeout(r, ms)), out = {};
      F.say("whoa", { pri:P.levelComplete, label:"levelComplete" }); await w(60); N.run({ onStart:() => {} }); await w(900); out.waitedForLevelComplete = (F.state().voiceLog.filter(x => /^nc:/.test(x)).length === 0) || F.state().voiceLog.indexOf("levelComplete") < F.state().voiceLog.findIndex(x => /^nc:/.test(x));
      await w(2500); N.skip(); F.stopVoice();
      N.resetSeen(); N.run({ onStart:() => {} }); await w(700); const nc = (F.state().voice || {}).id; F.say("hold", { pri:P.levelComplete, label:"levelComplete2" }); await w(80); out.levelCompleteWins = (F.state().voice || {}).id === "levelComplete2";
      out.ncDropped = await F.say("run", { pri:P.nextChallenge, label:"nc:x" }) === false; N.skip(); F.stopVoice();
      /* personality is blocked while the transition is up */
      const PT = PersonalityTriggerEngine; PT.reset(); PT.config.dryRun = true; PT.config.requirePlaying = false; PT.config.rng = () => 0; PT.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; PT.config.minGapMs = 0; PT.config.minTapsBetween = 0;
      N.resetSeen(); N.run({ onStart:() => {} }); await w(200); const n0 = PT.state().log.length; PT.consider("combo", 1, { ts:performance.now(), remMs:5000, force:true, special:true, afterDay:true }); out.persBlocked = PT.state().log.length === n0; out.flag = FlowMomentEngine.state().transition; N.skip();
      PT.config.dryRun = false; PT.config.requirePlaying = true; PT.config.rng = null;
      /* disabled / failing engine: the original start runs */
      N.config.enabled = false; out.disabledRun = N.run({ onStart:() => {} }); N.config.enabled = true; out.noCb = N.run({}); return out; });
    check("N6e. the transition waits (brief pause) for a Level Complete voice instead of talking over it", r.waitedForLevelComplete, r);
    check("N6f. LEVEL COMPLETE (pri 2) interrupts a Next Challenge line; a Next Challenge line can never talk over it", r.levelCompleteWins && r.ncDropped, r);
    check("N6g. personality is blocked while the transition is on screen", r.persBlocked && r.flag === true, r);
    check("N6h. disabled engine / missing callback → run() declines (the game starts the level itself)", r.disabledRun === false && r.noCb === false, r);
    check("N6i. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close();
  }
}

async function suiteChain(){
  console.log("N7 the real game chain");
  const h = await boot({ clipMs:250 }); const { page } = h;
  await page.evaluate(() => { PersonalityTriggerEngine.enabled = false; window.__ncOrder = []; const N = NextChallengeEngine; const run = N.run; N.run = function(o){ window.__ncOrder.push("run:" + state.phase + ":L" + state.level); return run.call(N, o); }; });
  await h.start();
  for (let day = 0; day < 6; day++){
    await page.waitForFunction(d => state.phase === "playing" && state.currentStep === d && !state.busy, day, { timeout:15000 });
    const req = await page.evaluate(() => getRequiredTaps(state.level));
    for (let i = 0; i < req; i++){ await h.tap(); await sleep(i < 2 ? 330 : 140); }
  }
  await page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:25000 });
  await sleep(700);
  const before = await page.evaluate(() => ({ level:state.level, done:state.completedLevels, flo:state.levelFlOz }));
  await page.evaluate(() => document.getElementById("lcBtn").click());
  /* flow forward (≈0.5 s) → bonus wheel → spin until the prize is final → continue → -ite reveal → transition */
  for (let i = 0; i < 40; i++){
    const st = await page.evaluate(() => ({ nc:!!document.getElementById("ncRoot"), aw:bonus.awaiting, open:bonus.open, phase:state.phase, map:document.getElementById("geiDamMapPage") && document.getElementById("geiDamMapPage").classList.contains("show") }));
    if (st.nc) break;
    if (st.map) await page.evaluate(() => { const b = document.getElementById("geiMapBack"); b && b.click(); });
    else if (st.open && (st.aw === "spin" || st.aw === "continue")) await page.evaluate(() => document.getElementById("bonusBtn").click());
    else if (st.phase === "levelComplete" && !st.open) await page.evaluate(() => document.getElementById("lcBtn").click());
    await sleep(700);
  }
  await page.waitForFunction(() => !!document.getElementById("ncRoot"), null, { timeout:15000 });
  const mid = await page.evaluate(() => ({ phase:state.phase, level:state.level, order:window.__ncOrder.slice(), tribeShown:document.getElementById("tribeCard").classList.contains("show") }));
  check("N7a. the transition appears AFTER the bonus waterwheel and -ite reveal, with the level already advanced (phase 'redeemed')", mid.phase === "redeemed" && mid.level === before.level + 1 && mid.order[0] === "run:redeemed:L" + (before.level + 1), { mid, before });
  await page.waitForFunction(() => document.getElementById("ncGo").classList.contains("show"), null, { timeout:12000 });
  const ctxTxt = await page.evaluate(() => ({ lvl:document.querySelector(".ncLevel").textContent, st:document.querySelector(".ncStation").textContent, badge:document.querySelector(".ncBadge").textContent }));
  check("N7b. the card names the real next level / flow station for this game state", /LEVEL 2/.test(ctxTxt.lvl) && /FLOW STATION 1/.test(ctxTxt.st) && /SAME FLOW|KEEP IT MOVING/.test(ctxTxt.badge), ctxTxt);
  const idle = await page.evaluate(async () => { await new Promise(r => setTimeout(r, 1500)); return { phase:state.phase, timer:WOW_TIMER_ENGINE.timerRunning }; });
  check("N7c. while the preview is up the next level is NOT running (no clock ticking behind the card)", idle.phase === "redeemed" && !idle.timer, idle);
  await page.evaluate(() => document.getElementById("ncGo").click());
  await page.waitForFunction(() => state.phase === "playing", null, { timeout:5000 });
  await sleep(500);
  const after = await page.evaluate(() => ({ phase:state.phase, level:state.level, step:state.currentStep, done:state.completedLevels, dom:!!document.getElementById("ncRoot"), running:WOW_TIMER_ENGINE.timerRunning }));
  check("N7d. ENTER FLOW → Day 1 of the next level plays normally: level +1 exactly once, completed levels unchanged, clock running, overlay gone", after.phase === "playing" && after.level === before.level + 1 && after.step === 0 && after.done === before.done && !after.dom && after.running, { before, after });
  check("N7e. no uncaught errors through the whole chain", h.errors.length === 0, h.errors);
  await h.close();
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, select:suiteSelect, sequence:suiteSequence, repeat:suiteRepeat, viewports:suiteViewports, safety:suiteSafety, chain:suiteChain };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
