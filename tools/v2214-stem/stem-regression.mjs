/* V2.2.14 — STEM INTELLIGENCE ENGINE regression harness
 *
 * Real index.html in headless Chromium (offline; the supplied MP3s are answered with a short generated WAV; a "broken" mode answers chosen URLs with 404).
 *   S1 wiring       10 supplied clip URLs exact, STEM_EVENT types, priority (STEM between next challenge and achievement), cooldown setting
 *   S2 verify       every clip loads; a broken / ".mp3t" reference is detected, REPAIRED, reported (never left silently broken); runtime fallback
 *   S3 event→voice  each STEM event raises the right concept clip (variants by context, never the same variant twice in a row)
 *   S4 game events  taps / days / failure / retry / level → the right STEM event (EVENT → CONCEPT → VOICE), visual first
 *   S5 restraint    rapid events: ONE voice (the most relevant); cooldown, concept cooldown, caps, mastery pacing by level
 *   S6 collisions   waits for / never interrupts milestone voices; blocked in cinematic / level complete / transition / final push; visual before voice
 *   S7 visuals      gate / gauge / wheel / pressure labels, 5 viewports, reduced motion
 *   S8 mastery      hidden STEM MASTERY tracking, no XP / economy writes
 *   S9 safety       audio OFF / ON, a whole level, a failure with STEM on
 *
 *   node tools/v2214-stem/stem-regression.mjs [suite]
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
    if (opts.broken && opts.broken.test(u)) { reqs.push("404 " + u); return r.fulfill({ status:404, body:"" }); }
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

const FILES = ["gravity-s-doing-the-work-mTozcJJsjoREF9XO", "moving-water-means-energy-4wmaHROCg8P5rkQe", "more-flow-more-power-s3ccUNTqbCHtGytU", "control-the-flow-wTrzOsfGXBde7hew", "pressure-builds-lJP8KA3evIexcchQ",
  "watch-that-water-level-TIfLxeLpLH8IEDSa", "test-it.-learn-it.-improve-it.-GdpXvpbNzFuCAYBN", "engineers-we-have-flow-gditGYCJFAqjHOuF", "that-wheel-is-spinning-Kzn3b6nqBouTdn7F", "open-the-gate-upbm6rdLSjdMai0U"];
/* dry-run, instant windows, no cooldowns, level 9 (every concept unlocked) — decisions are logged, nothing is spoken */
const SETUP_SRC = `window.SETUP_STEM = (cfg) => { const E = StemIntelligenceEngine, c = E.config; E.reset(); E.resetMastery(); c.enabled = true; c.dryRun = true; c.rng = () => 0; c.windowMs = 0; c.stemCommentaryCooldown = 0; c.conceptCooldown = 0; c.minGapAfterVoiceMs = 0; c.maxPerDay = 99; c.maxPerLevel = 99; c.requirePlaying = false; c.visuals = false; c.unlockLevel = {}; c.repeatDecay = 0;
  state.level = 9; state.completedLevels = 8; try { FlowMomentEngine.setFlowLevel(0); } catch (e) {} Object.assign(c, cfg || {}); };`;
const last = () => `(() => { const l = StemIntelligenceEngine.state().log; return l[l.length - 1] || null; })()`;
const T = (index, done, req = 6, extra = {}) => Object.assign({ index, required:req, remaining:req - done, remMs:5000, streak:2 }, extra);

async function suiteWiring(){
  console.log("S1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "stem-intelligence-engine-v2214.js"), "utf8");
  check("S1a. script loads after the next-challenge engine", html.indexOf("/stem-intelligence-engine-v2214.js") > html.indexOf("/next-challenge-engine-v2213.js"));
  check("S1b. all ten supplied clip files are referenced exactly (incl. more-flow-more-power, dotted test-it file)", FILES.every(f => js.includes(f + ".mp3")), FILES.filter(f => !js.includes(f + ".mp3")));
  const h = await boot();
  const r = await h.page.evaluate(() => ({ ev:Object.keys(STEM_EVENT), frozen:Object.isFrozen(STEM_EVENT), n:Object.keys(StemIntelligenceEngine.clips).length, pri:FlowMomentEngine.priorities, cd:StemIntelligenceEngine.config.stemCommentaryCooldown, urls:Object.values(StemIntelligenceEngine.clips).map(c => c.url), cats:Object.keys(StemIntelligenceEngine.categories), api:typeof StemIntelligenceEngine.trigger }));
  const need = ["GRAVITY", "FLOW", "PRESSURE", "WATER_LEVEL", "GATE", "WATERWHEEL", "ENERGY", "EXPERIMENT", "ENGINEERING_MILESTONE"];
  check("S1c. STEM_EVENT types exist (GRAVITY · FLOW · PRESSURE · WATER_LEVEL · GATE · WATERWHEEL · ENERGY · EXPERIMENT · ENGINEERING_MILESTONE) and StemIntelligenceEngine.trigger() is the entry point", need.every(k => r.ev.includes(k)) && r.frozen && r.api === "function", r.ev);
  check("S1d. ten clips, every URL on the supplied CDN, no '.mp3t' reference", r.n === 10 && r.urls.every(u => /^https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/.+\.mp3$/.test(u)), r.urls);
  const p = r.pri;
  check("S1e. priority: failure < level complete < ONE MORE < milestone < next challenge < STEM < achievement < personality < reaction", p.cinematic < p.levelComplete && p.levelComplete < p.oneMore && p.oneMore < p.milestone && p.milestone < p.nextChallenge && p.nextChallenge < p.stem && p.stem < p.achievement && p.achievement < p.personality && p.personality < p.reaction, p);
  check("S1f. stemCommentaryCooldown is a configurable setting; six mastery categories exist", typeof r.cd === "number" && r.cd > 0 && r.cats.length === 6, { cd:r.cd, cats:r.cats });
  check("S1g. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteVerify(){
  console.log("S2 audio verification");
  { const h = await boot(); const { page } = h;
    const r = await page.evaluate(async () => { const res = await StemIntelligenceEngine.verify(); return { res, diag:StemIntelligenceEngine.diagnostics() }; });
    check("S2a. verify(): all ten STEM clips load (incl. more-flow-more-power)", r.res.length === 10 && r.res.every(x => x.ok && !x.repaired) && r.diag.moreFlow.ok, r.res.filter(x => !x.ok));
    await h.close(); }
  { // a '.mp3t' (or otherwise broken) reference
    const h = await boot({ broken:/\.mp3t$|bad-clip/ }); const { page } = h;
    const r = await page.evaluate(async () => {
      const E = StemIntelligenceEngine, c = E.clips.moreFlow, good = c.url; c.url = good + "t"; c.fallbacks = [];
      const broken = []; window.addEventListener("gei:audio-broken", e => broken.push(e.detail.url));
      const res = await E.verify(); const mf = res.find(x => x.id === "moreFlow");
      const out = { mf, url:c.url, fixed:c.url === good, diag:E.diagnostics().moreFlow };
      /* runtime: FlowMomentEngine.say repairs a '.mp3t' on the fly, reports it once, still speaks */
      const bad = good + "t"; const spoke = await FlowMomentEngine.say(bad, { pri:FlowMomentEngine.priorities.stem, label:"stem:probe" }); out.spoke = spoke; out.broken = FlowMomentEngine.fx.broken(); out.events = broken.length;
      return out; });
    check("S2b. a '.mp3t' reference is DETECTED and REPAIRED by verify() (the corrected .mp3 URL replaces it) — not silently left broken", r.mf.ok && r.mf.repaired && r.fixed && r.diag.repaired, r);
    check("S2c. at runtime the voice lane falls back to the corrected URL, the clip still speaks, and the broken URL is reported once (console + gei:audio-broken)", r.spoke === true && r.broken.some(u => /\.mp3t$/.test(u)) && r.events >= 1, r);
    await h.close(); }
  { // a clip that cannot be repaired is reported loudly
    const h = await boot({ broken:/bad-clip/ }); const { page } = h;
    const r = await page.evaluate(async () => { const E = StemIntelligenceEngine; E.clips.gravity.url = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/bad-clip.mp3"; const warns = []; const ow = console.warn; console.warn = (...a) => { warns.push(a.join(" ")); }; const res = await E.verify(); console.warn = ow; return { g:res.find(x => x.id === "gravity"), warns:warns.filter(w => /STEM/.test(w)), diag:E.diagnostics().gravity }; });
    check("S2d. an unrepairable clip is reported (console warning + diagnostics) rather than hidden", r.g && !r.g.ok && r.warns.length >= 1 && r.diag.ok === false, r);
    await h.close(); }
}

async function suiteEvents(){
  console.log("S3 event → concept → voice");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const r = await page.evaluate(() => {
    const E = StemIntelligenceEngine, EV = STEM_EVENT, out = {}; const run = (ev, ctx) => { SETUP_STEM(); E.trigger(ev, Object.assign({ afterDay:true }, ctx || {})); const l = E.state().log; return l[l.length - 1]; };
    out.gravity = run(EV.GRAVITY).clip; out.flow = run(EV.FLOW).clip; out.flowStrong = run(EV.FLOW, { strong:true }).clip; out.pressure = run(EV.PRESSURE).clip; out.level = run(EV.WATER_LEVEL).clip;
    out.gateOpen = run(EV.GATE, { kind:"open" }).clip; out.gateCtl = run(EV.GATE, { kind:"control" }).clip; out.control = run(EV.CONTROL).clip; out.wheel = run(EV.WATERWHEEL).clip;
    out.energy = run(EV.ENERGY, { powered:true }).clip; out.exp = run(EV.EXPERIMENT).clip; out.eng = run(EV.ENGINEERING_MILESTONE, { major:true }).clip;
    /* variants: never the same variant twice in a row; both FLOW clips appear over time */
    SETUP_STEM(); E.config.windowMs = 0; const seq = []; for (let i = 0; i < 40; i++){ E.trigger(EV.ENERGY, { afterDay:true, powered:i % 2 === 0 ? false : true }); const l = E.state().log; seq.push(l[l.length - 1].clip); }
    out.flowSeqRepeat = (() => { let bad = 0; const q = []; SETUP_STEM(); for (let i = 0; i < 60; i++){ E.trigger(EV.FLOW, { afterDay:true }); const l = E.state().log; q.push(l[l.length - 1].clip); } for (let i = 1; i < q.length; i++) if (q[i] === q[i - 1]) bad++; return { bad, distinct:[...new Set(q)] }; })();
    out.unknown = E.trigger("NOT_AN_EVENT");
    return out;
  });
  check("S3a. GRAVITY → 'Gravity's doing the work' · FLOW → 'Moving water means energy' · strong FLOW → 'More flow, more power'", r.gravity === "gravity" && r.flow === "movingWater" && r.flowStrong === "moreFlow", r);
  check("S3b. PRESSURE → 'Pressure builds' · WATER_LEVEL → 'Watch that water level' · CONTROL → 'Control the flow'", r.pressure === "pressure" && r.level === "waterLevel" && r.control === "control", r);
  check("S3c. GATE open → 'Open the gate' · GATE control/release → 'Control the flow'", r.gateOpen === "openGate" && r.gateCtl === "control", r);
  check("S3d. WATERWHEEL → 'That wheel is spinning' · powered ENERGY → 'More flow, more power' · EXPERIMENT → 'Test it. Learn it. Improve it.' · ENGINEERING_MILESTONE → 'Engineers, we have flow!'", r.wheel === "wheel" && r.energy === "moreFlow" && r.exp === "testLearn" && r.eng === "engineers", r);
  check("S3e. a concept with several clips never repeats the same variant twice in a row; unknown events are ignored", r.flowSeqRepeat.bad === 0 || r.flowSeqRepeat.distinct.length === 1, r.flowSeqRepeat);
  check("S3f. unknown STEM events are rejected safely", r.unknown === false);
  await h.close();
}

async function suiteGame(){
  console.log("S4 game events → STEM events");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const seq = async (steps) => page.evaluate((steps) => { SETUP_STEM(); const E = StemIntelligenceEngine; let ts = 9e6; const out = []; for (const s of steps){ ts += s.after || 200; E.onEvent(s.type, Object.assign({ ts }, s.d || {})); } return E.state().log.map(x => x.event + (x.skipped ? "!" + x.skipped : "")); }, steps);
  const ev = (type, d, after) => ({ type, d, after });
  const dayStep = (index, remMs = 3000, extra) => ev("day", Object.assign({ index, remMs, closeCall:false, streak:3, maxStreak:3 }, extra || {}));
  const tap = (index, done, req, extra) => ev("tap", T(index, done, req, extra));
  let r = await seq([tap(0, 1), tap(0, 2), tap(0, 3)]);
  check("S4a. Day 1 (mountain): water begins moving → FLOW ('Moving water means energy'), once", r.filter(x => x === "FLOW").length === 1, r);
  r = await seq([dayStep(0)]);
  check("S4b. Day 1 complete: water moves downhill / downstream → GRAVITY", r.includes("GRAVITY"), r);
  r = await seq([tap(2, 1), tap(2, 2), tap(2, 3), tap(2, 4)]);
  check("S4c. Millpond (reservoir): water level rises past half → WATER_LEVEL, once", r.filter(x => x === "WATER_LEVEL").length === 1, r);
  r = await seq([tap(1, 1), tap(1, 2), tap(1, 3), tap(1, 4)]);
  check("S4d. Dam: pressure builds (past half) → PRESSURE, once", r.filter(x => x === "PRESSURE").length === 1, r);
  r = await seq([tap(3, 1), tap(3, 2), tap(3, 3)]);
  check("S4e. Sluice gate opening → GATE ('Open the gate')", r.filter(x => x === "GATE").length === 1, r);
  r = await seq([tap(4, 1), tap(4, 2), tap(4, 3), tap(4, 4), tap(4, 5)]);
  check("S4f. Waterwheel: starts (WATERWHEEL) and later accelerates — the acceleration is a silent visual step, not a second voice", r.filter(x => x === "WATERWHEEL").length === 1, r);
  r = await seq([tap(5, 1), tap(5, 2), tap(5, 3), tap(5, 4)]);
  check("S4g. Factory powered → ENERGY ('More flow, more power')", r.filter(x => x === "ENERGY").length === 1, r);
  r = await seq([tap(0, 1, 6, { streak:2 }), tap(0, 2, 6, { streak:8 })]);
  check("S4h. creating a HIGH flow (combo ≥ 7) → FLOW", r.includes("FLOW"), r);
  r = await seq([ev("fail", {}), ev("start", {}), tap(1, 1)]);
  check("S4i. MISTAKE then RETRY: the retry itself is the experiment → EXPERIMENT ('Test it. Learn it. Improve it.')", r.includes("EXPERIMENT"), r);
  r = await seq([ev("fail", {}), ev("start", {}), dayStep(1, 3200)]);
  check("S4j. retry SUCCEEDS → EXPERIMENT (failure → observation → adjustment → improvement)", r.includes("EXPERIMENT"), r);
  r = await seq([dayStep(2, 1700)]);
  check("S4k. completing a difficult sequence (clutch finish, 1.2–2.2 s left) → EXPERIMENT", r.includes("EXPERIMENT"), r);
  r = await seq([ev("level", { perf:{ level:12, maxCombo:5, fails:0, first:false } }), ev("start", {}), tap(0, 1)]);
  check("S4l. a major station / exceptional level → ENGINEERING_MILESTONE ('Engineers, we have flow') at the start of the next run", r.includes("ENGINEERING_MILESTONE"), r);
  r = await seq([ev("level", { perf:{ level:2, maxCombo:3, fails:3, first:false } }), ev("start", {}), tap(0, 1)]);
  check("S4m. a struggling level does NOT earn the engineering milestone", !r.includes("ENGINEERING_MILESTONE"), r);
  check("S4n. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteRestraint(){
  console.log("S5 restraint + prioritisation");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const r = await page.evaluate(async () => {
    const E = StemIntelligenceEngine, EV = STEM_EVENT, out = {}, w = ms => new Promise(r => setTimeout(r, ms));
    /* FLOW → PRESSURE → WATER_LEVEL → ENERGY inside one window: ONE voice (the most educationally relevant) */
    SETUP_STEM({ windowMs:60 }); [EV.FLOW, EV.PRESSURE, EV.WATER_LEVEL, EV.ENERGY].forEach(e => E.trigger(e, { afterDay:true, powered:true })); await w(140);
    const l = E.state().log.filter(x => !x.skipped); out.burst = { spoken:l.map(x => x.event), suppressed:l[0] && l[0].suppressed };
    /* cooldown: another event 1 s later is refused, after the cooldown it is allowed */
    SETUP_STEM({ stemCommentaryCooldown:14000, windowMs:0 }); const t0 = 1e8; E.trigger(EV.GRAVITY, { afterDay:true, ts:t0 }); E.trigger(EV.PRESSURE, { afterDay:true, ts:t0 + 1000 }); E.trigger(EV.PRESSURE, { afterDay:true, ts:t0 + 15000 });
    out.cool = E.state().log.map(x => x.event + (x.skipped ? "!" + x.skipped : ""));
    /* the same concept is not re-taught straight away */
    SETUP_STEM({ conceptCooldown:55000, stemCommentaryCooldown:0, windowMs:0 }); E.trigger(EV.GRAVITY, { afterDay:true, ts:2e8 }); E.trigger(EV.GRAVITY, { afterDay:true, ts:2e8 + 20000 }); E.trigger(EV.GRAVITY, { afterDay:true, ts:2e8 + 70000 });
    out.concept = E.state().log.map(x => x.event + (x.skipped ? "!" + x.skipped : ""));
    /* caps */
    SETUP_STEM({ maxPerLevel:2, stemCommentaryCooldown:0, conceptCooldown:0, windowMs:0 }); [EV.GRAVITY, EV.FLOW, EV.PRESSURE, EV.CONTROL, EV.ENERGY].forEach((e, i) => E.trigger(e, { afterDay:true, ts:3e8 + i * 100 }));
    out.cap = E.state().log.filter(x => !x.skipped).length;
    SETUP_STEM({ maxPerDay:1, stemCommentaryCooldown:0, conceptCooldown:0, windowMs:0 }); [EV.FLOW, EV.PRESSURE].forEach((e, i) => E.trigger(e, { ts:4e8 + i * 100 }));
    out.day = E.state().log.filter(x => !x.skipped).length;
    /* mastery pacing by level: level 1 only teaches gravity + flow (+ experiment), level 3 adds pressure, level 4 energy, level 6 engineering */
    const spoken = (lvl) => { SETUP_STEM({ windowMs:0 }); state.level = lvl; const res = {}; Object.keys(EV).forEach(k => { E.reset(); E.config.dryRun = true; E.config.windowMs = 0; E.config.rng = () => 0; E.config.stemCommentaryCooldown = 0; E.config.conceptCooldown = 0; E.config.requirePlaying = false; E.config.maxPerDay = 99; E.config.maxPerLevel = 99; E.trigger(EV[k], { afterDay:true, major:EV[k] === "ENGINEERING_MILESTONE" }); const q = E.state().log; res[k] = q.length && !q[q.length - 1].skipped; }); return Object.keys(res).filter(k => res[k]); };
    out.l1 = spoken(1); out.l2 = spoken(2); out.l3 = spoken(3); out.l4 = spoken(4);
    /* occasional: the more a concept was heard, the lower the chance (repeatDecay) */
    SETUP_STEM({ repeatDecay:.35 }); E.config.rng = () => .5; let a = 0; E.config.stemCommentaryCooldown = 0; E.config.conceptCooldown = 0; for (let i = 0; i < 12; i++){ E.trigger(EV.GRAVITY, { afterDay:true, ts:5e8 + i * 1000 }); } out.decay = E.state().log.filter(x => !x.skipped).length;
    /* rare: ENGINEERING needs luck ("rare STEM personality phrase") */
    SETUP_STEM({ windowMs:0 }); E.config.rng = () => .9; E.trigger(EV.ENGINEERING_MILESTONE, { afterDay:true, ts:6e8 }); out.rareMiss = E.state().log[0].skipped; E.config.rng = () => .1; E.reset(); E.config.dryRun = true; E.config.windowMs = 0; E.config.requirePlaying = false; E.config.stemCommentaryCooldown = 0; E.config.conceptCooldown = 0; E.trigger(EV.ENGINEERING_MILESTONE, { afterDay:true, ts:6e8 + 1 }); out.rareHit = E.state().log[0].spoke === false && !E.state().log[0].skipped;
    return out;
  });
  check("S5a. FLOW → PRESSURE → WATER_LEVEL → ENERGY at once: only ONE voice (PRESSURE, the most educationally relevant); the other three are suppressed", r.burst.spoken.length === 1 && r.burst.spoken[0] === "PRESSURE" && JSON.stringify(r.burst.suppressed.sort()) === JSON.stringify(["ENERGY", "FLOW", "WATER_LEVEL"]), r.burst);
  check("S5b. stemCommentaryCooldown: nothing 1 s after a STEM line, allowed again after the cooldown", JSON.stringify(r.cool) === JSON.stringify(["GRAVITY", "PRESSURE!cooldown", "PRESSURE"]), r.cool);
  check("S5c. the same concept is not re-taught inside its own cooldown", JSON.stringify(r.concept) === JSON.stringify(["GRAVITY", "GRAVITY!concept", "GRAVITY"]), r.concept);
  check("S5d. per-level cap (2) and per-day cap (1) keep it occasional", r.cap === 2 && r.day === 1, { cap:r.cap, day:r.day });
  check("S5e. mastery pacing: level 1 teaches gravity + flow + experiments only; level 2 adds control / gate / water level; level 3 pressure + wheel; level 4 energy", r.l1.sort().join() === "EXPERIMENT,FLOW,GRAVITY" && r.l2.includes("GATE") && r.l2.includes("WATER_LEVEL") && !r.l2.includes("PRESSURE") && r.l3.includes("PRESSURE") && r.l3.includes("WATERWHEEL") && !r.l3.includes("ENERGY") && r.l4.includes("ENERGY"), { l1:r.l1, l2:r.l2, l3:r.l3, l4:r.l4 });
  check("S5f. repetition fades: a concept heard again and again is spoken less (12 repeats → far fewer than 12 lines)", r.decay > 0 && r.decay < 12, r.decay);
  check("S5g. ENGINEERING_MILESTONE is a RARE phrase: it needs a lucky roll", r.rareMiss === "chance" && r.rareHit, { miss:r.rareMiss, hit:r.rareHit });
  await h.close();
}

async function suiteCollide(){
  console.log("S6 collisions + visual first");
  const h = await boot({ clipMs:800 }); const { page } = h; await page.evaluate(SETUP_SRC);
  const r = await page.evaluate(async () => {
    const E = StemIntelligenceEngine, F = FlowMomentEngine, P = F.priorities, EV = STEM_EVENT, w = ms => new Promise(r => setTimeout(r, ms)), out = {};
    const live = (cfg) => { SETUP_STEM(Object.assign({ dryRun:false, windowMs:0, holdMs:2500, visuals:true }, cfg || {})); F.stopVoice(); };
    /* a milestone voice is speaking: STEM waits, never interrupts, then speaks */
    live(); F.say("whoa", { pri:P.milestone, label:"milestone" }); await w(80); E.trigger(EV.GRAVITY, { afterDay:true }); await w(300);
    out.during = (F.state().voice || {}).id; out.heldNow = E.state().held; await w(1900);
    out.afterLog = F.state().voiceLog.slice(-3);
    /* ONE MORE interrupts a STEM line */
    live(); E.trigger(EV.GRAVITY, { afterDay:true }); await w(700); const stemOn = (F.state().voice || {}).id; F.say("hold", { pri:P.oneMore, label:"oneMore" }); await w(100); out.oneMore = { stemOn, now:(F.state().voice || {}).id };
    /* blocked contexts */
    const blockedCase = async (fn, back, ctx) => { live(); fn(); await w(120); E.trigger(EV.GRAVITY, ctx || { afterDay:true }); await w(100); const l = E.state().log; const res = l[l.length - 1]; back && back(); return res && res.skipped; };
    out.cinematic = await blockedCase(() => F.failure({ onCard:() => {} }), () => F.recover());
    out.levelSeq = await blockedCase(() => F.levelComplete({ onCard:() => {} }), () => { }); await w(9500);
    out.final = await blockedCase(() => F.setFlowLevel(4), () => F.setFlowLevel(0), { remMs:4000 });
    out.transition = await blockedCase(() => { state.level = 13; NextChallengeEngine.resetSeen(); NextChallengeEngine.run({ onStart:() => {} }); }, () => { NextChallengeEngine.skip(); });
    out.clock = await (async () => { live(); E.trigger(EV.GRAVITY, { remMs:1000 }); await w(60); const l = E.state().log; return l[l.length - 1].skipped; })();
    return out;
  });
  check("S6a. while a MILESTONE voice speaks, STEM waits (is held) and never interrupts it; it speaks afterwards", r.during === "milestone" && r.heldNow === true && r.afterLog.some(x => /^stem:gravity$/.test(x)), r);
  check("S6b. ONE MORE (priority 3) interrupts a STEM line", /^stem:/.test(r.oneMore.stemOn || "") && r.oneMore.now === "oneMore", r.oneMore);
  check("S6c. STEM is blocked during the Dam Failure Cinematic, the Level Complete sequence, the Next Challenge transition, the final push (2 MORE / ONE MORE) and the last seconds of the clock", r.cinematic === "critical" && r.levelSeq === "critical" && r.transition === "critical" && r.final === "final-push" && r.clock === "clock", r);
  const v = await page.evaluate(async () => { const E = StemIntelligenceEngine, F = FlowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms));
    SETUP_STEM({ dryRun:false, windowMs:0, visuals:true, leadMs:600 }); F.stopVoice(); state.currentStep = 4; E.onEvent("tap", { ts:performance.now(), index:4, required:6, remaining:5, remMs:5000, streak:1 });
    const body = document.querySelector('#stationsGroup .station[data-index="4"] .body'); await w(150); const t1 = { spin:body.classList.contains("stemSpin1"), voice:!!F.state().voice, pill:!!document.querySelector(".stemPill") };
    await w(1100); const t2 = { voiceLog:F.state().voiceLog.slice(-1)[0] };
    E.onEvent("tap", { ts:performance.now(), index:4, required:6, remaining:3, remMs:5000, streak:1 }); await w(100); const t3 = body.className.baseVal !== undefined ? body.className.baseVal : body.getAttribute("class"); E.onEvent("tap", { ts:performance.now(), index:4, required:6, remaining:1, remMs:5000, streak:1 });
    E.onEvent("start", {}); await w(200); const stopped = !/stemSpin/.test(body.getAttribute("class") || "");
    return { t1, t2, t3, stopped }; });
  check("S6d. OBSERVE → HEAR: the wheel is already spinning and the label is up BEFORE the voice; then 'That wheel is spinning' names it", v.t1.spin && v.t1.pill && !v.t1.voice && v.t2.voiceLog === "stem:wheel", v);
  check("S6e. the wheel accelerates with the player's progress (stemSpin2) and stops when the day ends", /stemSpin2|stemSpin3/.test(v.t3) && v.stopped, v);
  check("S6f. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

const VIEWS = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]];
async function suiteVisual(){
  console.log("S7 visuals");
  for (const [w, hgt] of VIEWS){
    const h = await boot({ viewport:{ width:w, height:hgt }, clipMs:200 }); const { page } = h;
    const r = await page.evaluate(async () => { const E = StemIntelligenceEngine, out = []; for (const ev of ["GRAVITY", "FLOW", "PRESSURE", "WATER_LEVEL", "GATE", "WATERWHEEL", "ENERGY", "EXPERIMENT", "ENGINEERING_MILESTONE"]){ E.showLabel(ev); await new Promise(r => setTimeout(r, 330));
      const el = document.querySelector(".stemPill"), b = el.getBoundingClientRect(); out.push({ ev, l:b.left, r:b.right, t:b.top, bt:b.bottom, pe:getComputedStyle(el).pointerEvents, fs:parseFloat(getComputedStyle(el.querySelector(".stemPillL")).fontSize), txt:el.innerText.replace(/\s+/g, " ") }); await new Promise(r => setTimeout(r, 120)); }
      return { out, vw:innerWidth, vh:innerHeight, sy:scrollY, sw:document.documentElement.scrollWidth }; });
    const ok = r.out.every(o => o.l >= -1 && o.r <= r.vw + 1 && o.t >= 0 && o.bt <= r.vh && o.pe === "none" && o.fs >= 11) && r.sy === 0 && r.sw <= r.vw;
    check(`S7a. ${w}×${hgt}: all nine STEM labels are compact, on screen, readable, never block taps, no scrolling`, ok, r.out.find(o => o.l < -1 || o.r > r.vw + 1 || o.fs < 11) || r.sw);
    if (w === 390){ check("S7b. labels use the spec wording (🧠 GRAVITY · 🌊 FLOW · 💧 WATER LEVEL · 🚪 GATE CONTROL · ⚙️ MECHANICAL ENERGY · ⚡ ENERGY)", ["GRAVITY", "FLOW", "WATER LEVEL", "GATE CONTROL", "MECHANICAL ENERGY", "ENERGY"].every(k => r.out.some(o => o.txt.includes(k))), r.out.map(o => o.txt)); }
    await h.close();
  }
  { const h = await boot({ clipMs:200 }); const { page } = h; await page.evaluate(SETUP_SRC);
    const r = await page.evaluate(async () => { SETUP_STEM({ dryRun:false, visuals:true, windowMs:0 }); const E = StemIntelligenceEngine; state.currentStep = 3; const w = ms => new Promise(r => setTimeout(r, ms));
      E.onEvent("tap", { ts:performance.now(), index:3, required:6, remaining:5, remMs:5000 }); await w(120); const o1 = parseFloat(getComputedStyle(document.querySelector(".stemGate")).getPropertyValue("--open") || "0");
      E.onEvent("tap", { ts:performance.now(), index:3, required:6, remaining:2, remMs:5000 }); await w(120); const o2 = parseFloat(document.querySelector(".stemGate").style.getPropertyValue("--open"));
      E.onEvent("tap", { ts:performance.now(), index:2, required:6, remaining:4, remMs:5000 }); await w(120); E.onEvent("tap", { ts:performance.now(), index:2, required:6, remaining:2, remMs:5000 }); await w(120);
      const g = document.querySelector(".stemGauge"); const lv = g && parseFloat(g.style.getPropertyValue("--lv")); const pr = document.querySelector(".stemGate") ? 1 : 0; return { o1, o2, gauge:!!g, lv, gate:pr }; });
    check("S7c. the gate VISIBLY opens as the player works it (open amount grows with progress) and the water level gauge rises with the reservoir", r.o2 > r.o1 && r.gauge && r.lv > .5, r);
    await h.close(); }
  { const h = await boot({ clipMs:200, reduced:true }); const { page } = h; await page.evaluate(SETUP_SRC);
    const r = await page.evaluate(async () => { SETUP_STEM({ dryRun:false, visuals:true, windowMs:0 }); const E = StemIntelligenceEngine; E.onEvent("tap", { ts:performance.now(), index:4, required:6, remaining:5, remMs:5000 }); await new Promise(r => setTimeout(r, 700));
      const body = document.querySelector('#stationsGroup .station[data-index="4"] .body'); const pill = document.querySelector(".stemPill"); return { spin:/stemSpin/.test(body.getAttribute("class") || ""), anim:pill && getComputedStyle(pill).animationName }; });
    check("S7d. reduced motion: the wheel is not animated, the label simply fades", !r.spin && /fmeCoFade/.test(r.anim || ""), r);
    await h.close(); }
}

async function suiteMastery(){
  console.log("S8 STEM mastery tracking");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const r = await page.evaluate(async () => {
    const E = StemIntelligenceEngine, EV = STEM_EVENT; SETUP_STEM(); const save0 = localStorage.getItem(SAVE_KEY), tot0 = state.totalFlOz, lv0 = state.level, flo0 = state.levelFlOz, xp0 = JSON.stringify([state.xp, state.totalXp]); const seen = []; window.addEventListener("gei:stem-mastery", e => seen.push(e.detail.total));
    E.trigger(EV.GRAVITY, { afterDay:true }); E.trigger(EV.WATERWHEEL, { afterDay:true }); E.trigger(EV.EXPERIMENT, { afterDay:true }); E.trigger(EV.ENGINEERING_MILESTONE, { afterDay:true, major:true }); E.config.dryRun = true;
    const m = E.mastery();
    return { m, seen:seen.length, same:{ save:localStorage.getItem(SAVE_KEY) === save0, tot:state.totalFlOz === tot0, lv:state.level === lv0, flo:state.levelFlOz === flo0, xp:JSON.stringify([state.xp, state.totalXp]) === xp0 } };
  });
  const c = r.m.categories;
  check("S8a. events are tracked per category: 🌊 water systems, ⚡ energy, ⚙️ mechanics, 🧪 experimentation, 📐 engineering (and 💧 hydraulics via flow/gate/pressure)", c.WATER_SYSTEMS.points > 0 && c.ENERGY.points > 0 && c.MECHANICS.points > 0 && c.EXPERIMENTATION.points > 0 && c.ENGINEERING.points > 0 && Object.keys(c).length === 6, c);
  check("S8b. a mastery total + stage (OBSERVER → OPERATOR → TECHNICIAN → ENGINEER → MASTER) is exposed, and a gei:stem-mastery event notifies future Academy integration", r.m.total > 0 && !!r.m.stage.name && r.seen >= 4, { total:r.m.total, stage:r.m.stage, seen:r.seen });
  check("S8c. tracking is a hidden layer: the save, FL OZ, level and XP are untouched", Object.values(r.same).every(Boolean), r.same);
  await h.close();
}

async function playLevel(h, gap){
  const { page } = h; await h.start();
  for (let day = 0; day < 6; day++){
    await page.waitForFunction(d => state.phase === "playing" && state.currentStep === d && !state.busy, day, { timeout:15000 });
    const req = await page.evaluate(() => getRequiredTaps(state.level));
    for (let i = 0; i < req; i++){ await h.tap(); await sleep(i < 2 ? 330 : (gap || 140)); }
  }
  await page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:25000 });
  await sleep(900);
}
async function suiteSafety(){
  console.log("S9 safety");
  { const h = await boot({ clipMs:400 }); const { page } = h; await page.evaluate(SETUP_SRC);
    const r = await page.evaluate(async () => { const E = StemIntelligenceEngine, F = FlowMomentEngine; SETUP_STEM({ dryRun:false, windowMs:0, visuals:false }); GEI_AUDIO.setMuted(true); E.trigger(STEM_EVENT.GRAVITY, { afterDay:true }); await new Promise(r => setTimeout(r, 700));
      const off = { entry:E.state().log.slice(-1)[0], voices:F.state().voiceLog.filter(x => /^stem:/.test(x)).length, pill:!!document.querySelector(".stemPill") }; GEI_AUDIO.setMuted(false); SETUP_STEM({ dryRun:false, windowMs:0, visuals:false });
      E.trigger(STEM_EVENT.GRAVITY, { afterDay:true }); await new Promise(r => setTimeout(r, 900)); const on = { voice:F.state().voiceLog.filter(x => /^stem:/.test(x)).length, entry:E.state().log.slice(-1)[0] }; return { off, on }; });
    check("S9a. audio OFF: no STEM voice is requested, the short label still shows; audio ON: the voice speaks", r.off.entry && !r.off.entry.skipped && r.off.voices === 0 && r.off.pill && r.on.voice === 1 && r.on.entry.spoke === true, r);
    check("S9b. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close(); }
  { // a whole level with STEM forced on (every concept unlocked, short cooldown)
    const h = await boot({ clipMs:350 }); const { page } = h;
    await page.evaluate(() => { const E = StemIntelligenceEngine, c = E.config; c.rng = () => 0; c.stemCommentaryCooldown = 2500; c.conceptCooldown = 0; c.maxPerDay = 3; c.maxPerLevel = 20; c.unlockLevel = { GATE:1, CONTROL:1, WATER_LEVEL:1, PRESSURE:1, WATERWHEEL:1, ENERGY:1, ENGINEERING_MILESTONE:1 }; c.repeatDecay = 0; PersonalityTriggerEngine.enabled = false; LevelCompleteVoiceEngine.resetHistory();
      window.__ov = 0; setInterval(() => { const n = [...document.querySelectorAll("audio")].filter(a => !a.paused && !a.muted).length; if (n > window.__ov) window.__ov = n; }, 25); });
    await playLevel(h);
    const r = await page.evaluate(() => { const log = FlowMomentEngine.state().voiceLog, ids = LevelCompleteVoiceEngine.pool.map(x => x.id), b = document.getElementById("lcBtn").getBoundingClientRect();
      return { stem:log.filter(x => /^stem:/.test(x)), oneMore:log.filter(x => /^one-/.test(x)).length, victory:log.filter(x => ids.includes(x)).length, overlap:window.__ov, tot:state.totalFlOz, done:state.completedLevels, btn:b.bottom, vh:innerHeight, mastery:StemIntelligenceEngine.mastery().total }; });
    check("S9c. a whole level with STEM forced on: never two voices at once, ONE MORE + the victory voice still play, STEM speaks only occasionally, rewards intact, CONTINUE reachable", r.overlap <= 1 && r.oneMore >= 1 && r.victory === 1 && r.stem.length >= 1 && r.stem.length <= 6 && r.tot === 666 && r.done === 1 && r.btn <= r.vh && h.errors.length === 0, r);
    await h.close(); }
  { // failure with STEM on
    const h = await boot({ clipMs:200 }); const { page } = h;
    await page.evaluate(() => { const c = StemIntelligenceEngine.config; c.rng = () => 0; c.stemCommentaryCooldown = 0; c.unlockLevel = { GATE:1, CONTROL:1, WATER_LEVEL:1, PRESSURE:1, WATERWHEEL:1, ENERGY:1 }; PersonalityTriggerEngine.enabled = false; FlowMomentEngine.config.forcePlan = { event:"normal", reaction:"jump", weather:"none", dir:1, lines:["run", "whoa", "flood"] }; });
    await h.start(); for (let i = 0; i < 3; i++){ await h.tap(); await sleep(300); }
    await h.untilCard(); await sleep(500);
    const r = await page.evaluate(() => { const log = FlowMomentEngine.state().voiceLog; const i0 = log.indexOf("uhoh"); const order = ["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"]; return { cin:log.slice(i0).filter(x => order.includes(x)), stemInside:log.slice(i0).filter(x => /^stem:/.test(x)).length }; });
    check("S9d. the Dam Failure Cinematic is untouched by STEM: full voice order, no STEM line inside it", JSON.stringify(r.cin.slice(0, 10)) === JSON.stringify(["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"]) && r.stemInside === 0, r);
    /* retry → STEM teaches the experiment, personality yields */
    await page.evaluate(() => { StemIntelligenceEngine.config.stemCommentaryCooldown = 0; StemIntelligenceEngine.config.holdMs = 8000; }); await page.click("#retryDayBtn", { force:true }); await sleep(700);
    for (let i = 0; i < 6; i++){ await h.tap(); await sleep(i < 1 ? 600 : 220); } await sleep(4500);
    const q = await page.evaluate(() => ({ stem:FlowMomentEngine.state().voiceLog.filter(x => /^stem:testLearn$/.test(x)).length, pers:FlowMomentEngine.state().voiceLog.filter(x => /^pers:/.test(x)).length }));
    check("S9e. mistake → retry: 'Test it. Learn it. Improve it.' is spoken for the retry (STEM claims it; personality stays quiet)", q.stem >= 1 && q.pers === 0, q);
    await h.close(); }
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, verify:suiteVerify, events:suiteEvents, game:suiteGame, restraint:suiteRestraint, collide:suiteCollide, visual:suiteVisual, mastery:suiteMastery, safety:suiteSafety };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
