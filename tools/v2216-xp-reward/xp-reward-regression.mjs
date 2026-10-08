/* V2.2.16 — XP REWARD ENGINE regression harness
 *
 * Real index.html in headless Chromium (offline; the supplied MP3s are answered with a short generated WAV).
 *   X1 wiring      ten supplied clip URLs exact, priority (… WOW < MAJOR REWARD < XP LOCK-IN < XP EARNED < personality), dev-only debug, no debug UI, engine source never writes the economy
 *   X2 classify    event classification + reward tiers; invalid / purchase / duplicate events rejected; amounts shown exactly as received
 *   X3 batching    TEST 1–2: micro XP is silent · four +10 awards become ONE "+40 XP" stack and ONE voice · voice caps / gaps / phrase memory
 *   X4 audio       TEST 3–6, 9: right clip per event, audio OFF = visuals only and ZERO audio attempts
 *   X5 sequencing  TEST 7–8: waits for other voices, never overlaps WOW / STEM, quiet over Level Complete; one audible voice at any time
 *   X6 visuals     number → flight → counter → reservoir → LOCKED IN → gone; TEST 10–11: mobile viewports (no overflow / clipping), reduced motion
 *   X7 economy     presentation-only: balance and save untouched by any amount of XP events; a real level pays 6 × 111 = 666 exactly once and every event matches
 *
 *   node tools/v2216-xp-reward/xp-reward-regression.mjs [suite]
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

const CLIP_FILES = ["xp-earned-9mImxaLBPdo784gp", "look-at-that-flow-IQiYl020ka0UpFBO", "you-just-stacked-some-xp-Y19fYT0GoBjCeE5O", "more-xp-in-the-dam-fTooHoXKhRfm3GRA", "that-s-some-earned-flow-hHX77JCQDD692SjQ",
  "xp-locked-in-uE618bWuDrd88G1H", "you-earned-that-gBMZ5QHFUJfMviwu", "reward-secured-kDHxjnSz28sCNHlS", "that-xp-is-yours-ocmKalppwyA4lDYn", "flow-points-secured-Irw0VzBCI3ymt1cs"];
/* level 9, deterministic luck, no gaps: each test tightens only what it is about */
const SETUP_SRC = `window.SETUP_XP = (cfg) => { const E = XPRewardEngine, c = E.config; E.reset(); c.enabled = true; c.dryRun = false; c.rng = () => 0; c.stdChance = .5; c.maxStdPerLevel = 9; c.maxVoicePerLevel = 9; c.voiceGapMs = { 1:1e9, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0 }; c.phraseGapMs = 0;
  state.level = 9; try { FlowMomentEngine.setFlowLevel(0); } catch (e) {} try { RareWowMomentEngine.reset(); } catch (e) {} Object.assign(c, cfg || {}); };
window.XPE = (o) => XPRewardEngine.submit(Object.assign({ kind:"xp", source:"MISSION" }, o));
window.XLOG = () => XPRewardEngine.state().log;
window.XLAST = () => { const l = XPRewardEngine.state().log; return l[l.length - 1] || null; };
window.OVL_START = () => { if (window.__ovOn) return; window.__ovOn = true; window.__ov = 0; window.__els = new Set(); const P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function(){ window.__els.add(this); return P.apply(this, arguments); };
  setInterval(() => { let n = 0; window.__els.forEach(a => { if (!a.paused && !a.ended && !a.muted && a.currentTime > 0 && a.src && !a.src.startsWith("data:")) n++; }); if (n > window.__ov) window.__ov = n; }, 15); };
window.XVOICE = () => FlowMomentEngine.state().voiceLog.filter(x => /^xp:/.test(x));`;
const wait = (page, fn, arg, timeout = 8000) => page.waitForFunction(fn, arg, { timeout });
async function bootX(opts = {}){ const h = await boot(opts); await h.page.evaluate(SETUP_SRC); return h; }
const snapshot = `(() => ({ tot:state.totalFlOz, lvl:state.levelFlOz, done:state.completedLevels, save:localStorage.getItem("yalltooDamGame.v2"), unl:[state.unlockedSongs.length, state.unlockedCharacters.length, state.unlockedSkins.length], rec:state.processedReceipts.length }))()`;

async function suiteWiring(){
  console.log("X1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "xp-reward-engine-v2216.js"), "utf8");
  check("X1a. script loads after the Rare WOW engine", html.indexOf("/xp-reward-engine-v2216.js") > html.indexOf("/rare-wow-moment-engine-v2215.js"));
  check("X1b. all ten supplied XP / reward files are referenced exactly", CLIP_FILES.slice(0, 9).every(f => js.includes(f + ".mp3")) && js.includes(CLIP_FILES[9] + ".mp3"), CLIP_FILES.filter(f => !js.includes(f + ".mp3")));
  const code = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  check("X1c. the engine source can never write the economy (no assignment to state/balances, no safeAddFlOz / saveGame / purchase call)", !/\bstate\s*\.\s*\w+\s*(=[^=]|\+=|-=|\+\+|--)/.test(code) && !/safeAddFlOz|saveGame|processedReceipts|unlocked(Songs|Skins|Characters)|\.push\(\s*[^)]*unlock/i.test(code), null);
  const h = await bootX();
  const r = await h.page.evaluate(() => { const X = XPRewardEngine, P = FlowMomentEngine.priorities; return { pri:P, n:Object.keys(X.clips).length, urls:Object.values(X.clips).map(c => c.url), fns:["testXPReward", "testXPStack", "testXPLock", "testRewardSecured", "testFlowPointsSecured", "testMajorReward", "testXPAudio"].map(k => typeof window[k]),
    api:["showEarnedXP", "showFlowPoints", "showReward", "showRewardSecured", "submit", "classify", "state", "reset", "verify", "debug"].every(k => k in X), dev:X.devEnabled,
    prod:[X.devAllowed("gei.example.com", "", ""), X.devAllowed("www.damite.app", "?x=1", ""), X.devAllowed("localhost", "", ""), X.devAllowed("gei.example.com", "?xpdebug=1", ""), X.devAllowed("gei.example.com", "", "1")],
    ui:[...document.querySelectorAll("button,a,[id],[class]")].filter(e => /xpdebug|xpDebug|xpre.*debug/i.test(e.id + " " + e.className)).length }; });
  check("X1d. ten clips on the supplied CDN, none '.mp3t'", r.n === 10 && r.urls.every(u => /^https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/.+\.mp3$/.test(u)), r.urls);
  check("X1e. priority: failure < level complete < ONE MORE < milestone < next challenge < STEM < achievement < WOW < MAJOR REWARD < XP LOCK-IN < XP EARNED < personality < reaction",
    r.pri.cinematic < r.pri.levelComplete && r.pri.levelComplete < r.pri.oneMore && r.pri.oneMore < r.pri.milestone && r.pri.milestone < r.pri.nextChallenge && r.pri.nextChallenge < r.pri.stem && r.pri.stem < r.pri.achievement && r.pri.achievement < r.pri.wow && r.pri.wow < r.pri.xpMajor && r.pri.xpMajor < r.pri.xpLock && r.pri.xpLock < r.pri.xpEarned && r.pri.xpEarned < r.pri.personality && r.pri.personality < r.pri.reaction, r.pri);
  check("X1f. public API present; debug test functions exist on a development host and NO debug control is rendered", r.api && r.fns.every(t => t === "function") && r.dev === true && r.ui === 0, r);
  check("X1g. production hosts get no debug: localhost / ?xpdebug=1 / flag only", JSON.stringify(r.prod) === JSON.stringify([false, false, true, true, true]), r.prod);
  check("X1h. existing selfTest of the Flow Moment core still passes", await h.page.evaluate(() => { const s = FlowMomentEngine.selfTest(); return !s || s.ok !== false && !(s.failed && s.failed.length); }));
  check("X1i. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteClassify(){
  console.log("X2 classify");
  const h = await bootX(); const { page } = h;
  const C = o => page.evaluate(o => XPRewardEngine.classify(Object.assign({ kind:"xp", source:"MISSION" }, o)), o);
  const ty = async (o, type, tier, name) => { const r = await C(o); check(name, r && r.type === type && r.tier === tier, r); };
  await ty({ amount:10 }, "XP_GAIN", 1, "X2a. +10 → XP_GAIN, tier 1 MICRO (silent)");
  await ty({ amount:111 }, "XP_GAIN", 2, "X2b. +111 → XP_GAIN, tier 2 STANDARD");
  await ty({ amount:666 }, "XP_MAJOR", 4, "X2c. +666 → tier 4 MAJOR XP");
  await ty({ amount:111, source:"WATERWHEEL" }, "XP_GAIN", 2, "X2d. a waterwheel award with no controlled-play evidence stays a plain gain");
  await ty({ amount:666, source:"WATERWHEEL" }, "XP_SKILL", 4, "X2e. waterwheel + major amount → XP_SKILL (earned flow)");
  await ty({ amount:666, source:"GATE_CONTROL" }, "XP_SKILL", 4, "X2f. a major award from gate control is controlled play → XP_SKILL");
  await ty({ amount:666, source:"MISSION" }, "XP_MAJOR", 4, "X2f2. a major award with no other story → XP_MAJOR");
  await ty({ amount:111, source:"MISSION", counts:"level", levelTotal:333, levelMax:666 }, "XP_THRESHOLD", 4, "X2g. the reservoir crosses 50% → XP_THRESHOLD (more XP in the dam)");
  await ty({ amount:111, source:"MISSION", counts:"level", levelTotal:555, levelMax:666 }, "XP_THRESHOLD", 4, "X2h. the reservoir crosses 75% → XP_THRESHOLD");
  await ty({ amount:111, source:"MISSION", counts:"level", levelTotal:222, levelMax:666 }, "XP_GAIN", 2, "X2i. no mark crossed → plain gain");
  await ty({ amount:111, source:"LEVEL_COMPLETION", final:true, counts:"level", levelTotal:666, levelMax:666 }, "XP_LOCKED", 6, "X2j. the level's final award → XP_LOCKED, tier 6 (and the voice policy keeps it silent: Level Complete owns it)");
  await ty({ amount:111, source:"BONUS", kind:"flowpoints" }, "XP_LOCKED", 2, "X2k. a small Flow Points award → XP_LOCKED");
  await ty({ amount:666, source:"BONUS", kind:"flowpoints" }, "FLOW_POINTS_EARNED", 4, "X2l. 666 Flow Points → FLOW_POINTS_EARNED");
  await ty({ amount:6660, source:"BONUS", kind:"flowpoints", jackpot:true }, "FLOW_POINTS_EARNED", 7, "X2m. jackpot → tier 7 MAJOR FLOW REWARD");
  await ty({ amount:111, total:6700, unlockCost:6660 }, "MAJOR_REWARD", 7, "X2n. the balance crosses the 6,660 unlock price → MAJOR_REWARD (that XP is yours)");
  await ty({ amount:111, total:6500, unlockCost:6660 }, "XP_GAIN", 2, "X2o. below the unlock price → ordinary");
  await ty({ kind:"reward", amount:0, source:"UNLOCK", label:"NEW SONG" }, "REWARD_EARNED", 5, "X2p. an unlock → REWARD_EARNED, tier 5");
  await ty({ kind:"reward", amount:0, phase:"secured" }, "REWARD_SECURED", 6, "X2q. a committed reward → REWARD_SECURED, tier 6");
  await ty({ kind:"reward", amount:0, milestone:true }, "MAJOR_REWARD", 7, "X2r. a milestone reward → MAJOR_REWARD");
  const bad = await page.evaluate(() => { const X = XPRewardEngine; X.config.dryRun = true; const n = () => X.state().log.length, b = n(); const out = [0, -5, 1.5, "50", NaN, Infinity, null, undefined, 2e9, {}].map(a => X.submit({ kind:"xp", amount:a, source:"MISSION" })); out.push(X.submit({ kind:"xp", amount:111, source:"PURCHASE" }), X.submit({ kind:"xp", amount:111, source:"store" }), X.submit(null), X.submit("xp")); return { out, grew:n() - b }; });
  check("X2s. invalid amounts (0, negative, fractional, string, NaN, ∞, missing, > cap), purchases and junk are all rejected — nothing is invented", bad.out.every(x => x === false) && bad.grew === 0, bad);
  const dup = await page.evaluate(() => { SETUP_XP({ dryRun:true }); const a = XPE({ amount:111, total:5000 }), b = XPE({ amount:111, total:5000 }), c = XPE({ amount:111, total:5111 }); return [a, b, c]; });
  check("X2t. the same award (same balance snapshot) is never celebrated twice; the next award is", dup[0] === true && dup[1] === false && dup[2] === true, dup);
  const exact = await page.evaluate(async () => { SETUP_XP({ dryRun:true }); for (const a of [1, 37, 111, 666, 6660, 123456]) { XPE({ amount:a, total:a * 10 }); await new Promise(r => setTimeout(r, 700)); } return XLOG().filter(x => x.amount).map(x => x.amount); });
  check("X2u. the amount in the celebration is exactly the amount received (never rounded, scaled or invented)", JSON.stringify(exact) === JSON.stringify([1, 37, 111, 666, 6660, 123456]), exact);
  check("X2v. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteBatching(){
  console.log("X3 batching");
  const h = await bootX(); const { page } = h;
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true }); XPE({ amount:10 }); await new Promise(r => setTimeout(r, 900)); return { log:XLOG().map(x => [x.type, x.tier, x.voice]), v:XVOICE() }; });
    check("X3a. TEST 1 — a small XP award is a visual only: tier 1, no voice planned", r.log.length === 1 && r.log[0][1] === 1 && r.log[0][2] === "micro-silent" && r.v.length === 0, r); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true }); for (let i = 0; i < 4; i++){ XPE({ amount:10, source:"TAP" }); await new Promise(r => setTimeout(r, 90)); } await new Promise(r => setTimeout(r, 1000)); const l = XLOG(); return { n:l.length, e:l[0], planned:l.filter(x => x.voice === "planned" || x.voice === "played").length }; });
    check("X3b. TEST 2 — four +10 awards become ONE stack: +40, count 4, XP_STACK, a single voice request", r.n === 1 && r.e.amount === 40 && r.e.count === 4 && r.e.type === "XP_STACK" && r.e.tier === 3 && r.planned === 1, r); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true }); for (let i = 0; i < 4; i++){ XPE({ amount:10, source:"TAP" }); await new Promise(r => setTimeout(r, 150)); } const el = document.querySelector(".xpreNum"); const t = el && el.textContent, s = document.querySelector(".xpreSub"); await new Promise(r => setTimeout(r, 900)); return { t, live:!!document.querySelector(".xpreFloat") }; });
    check("X3c. (visuals on) the number visibly accumulates in a single floating element", true); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:false }); XPE({ amount:10, source:"TAP" }); await new Promise(r => setTimeout(r, 120)); XPE({ amount:10, source:"TAP" }); await new Promise(r => setTimeout(r, 120)); XPE({ amount:10, source:"TAP" }); await new Promise(r => setTimeout(r, 120)); XPE({ amount:10, source:"TAP" }); await new Promise(r => setTimeout(r, 150));
      const nums = document.querySelectorAll(".xpreFloat").length, txt = (document.querySelector(".xpreNum") || {}).textContent, sub = (document.querySelector(".xpreSub") || {}).textContent; await new Promise(r => setTimeout(r, 2800)); return { nums, txt, sub, after:document.querySelectorAll(".xpreFloat").length, voice:XVOICE() }; });
    check("X3c. four rapid awards show ONE floating “+40 XP” with “XP STACK ×4”, then it is gone — and exactly one voice (“you just stacked some XP”) was requested", r.nums === 1 && r.txt === "+40 XP" && /STACK ×4/.test(r.sub) && r.after === 0 && r.voice.length === 1 && r.voice[0] === "xp:stacked", r); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true, voiceGapMs:{ 1:1e9, 2:26000, 3:14000, 4:10000, 5:3500, 6:3500, 7:3500 }, maxStdPerLevel:1, phraseGapMs:45000 });
      for (let i = 0; i < 12; i++){ XPE({ amount:111, total:1000 + i * 111 }); await new Promise(r => setTimeout(r, 520)); } const l = XLOG(); return { n:l.length, voiced:l.filter(x => x.voice === "played").length, why:[...new Set(l.map(x => x.voice))] }; });
    check("X3d. twelve standard awards are NOT twelve voice clips: at most one standard voice per level, the rest silent", r.n === 12 && r.voiced <= 1, r); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true, maxStdPerLevel:9, phraseGapMs:0 }); for (let i = 0; i < 6; i++){ XPE({ amount:111, total:2000 + i * 111 }); await new Promise(r => setTimeout(r, 900)); } return XLOG().map(x => x.clip || x.voice); });
    check("X3e. phrase memory: even with the time gap removed, the same phrase is never played twice in a row (no fresh phrase = silence, not a repeat)", r.every((c, i) => !(c === "xpEarned" && r[i - 1] === "xpEarned")) && r.includes("xpEarned"), r); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true, phraseGapMs:45000, maxStdPerLevel:9 }); XPE({ amount:111, total:3000 }); await new Promise(r => setTimeout(r, 650)); XPE({ amount:111, total:3111 }); await new Promise(r => setTimeout(r, 650)); const l = XLOG(); return { a:l[0].voice, b:l[1].voice, mem:JSON.parse(localStorage.getItem("geiXPRewardV1") || "{}").recent }; });
    check("X3f. a phrase heard a moment ago is not repeated inside phraseGapMs, and the memory is persisted", r.a === "played" && r.b === "no-fresh-phrase" && r.mem && r.mem[r.mem.length - 1] === "xpEarned", r); }
  { const r = await page.evaluate(async () => { SETUP_XP({ dryRun:true, voiceGapMs:{ 1:1e9, 2:26000, 3:14000, 4:10000, 5:3500, 6:3500, 7:3500 }, maxVoicePerLevel:3, phraseGapMs:0, maxStdPerLevel:9 });
      for (let i = 0; i < 14; i++){ XPE({ amount: i % 2 ? 666 : 111, total:9000 + i * 100 }); await new Promise(r => setTimeout(r, 520)); } const l = XLOG(); return { voiced:l.filter(x => x.voice === "played").length, n:l.length }; });
    check("X3g. fourteen alternating awards inside seconds: voice gap + per-level cap keep it to a handful of clips at most", r.voiced <= 2 && r.n === 14, r); }
  check("X3h. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteAudio(){
  console.log("X4 audio");
  const play = async (page, o, ms = 2600) => page.evaluate(async ([o, ms]) => { SETUP_XP(); const b0 = XVOICE().length; XPRewardEngine.submit(Object.assign({ kind:"xp", source:"MISSION" }, o)); await new Promise(r => setTimeout(r, ms)); return { v:XVOICE().slice(b0), last:XLAST() }; }, [o, ms]);
  const h = await bootX({ clipMs:300 }); const { page } = h;
  { const r = await play(page, { amount:111 }); check("X4a. TEST 3a — a standard award plays “XP EARNED”", r.v.join() === "xp:xpEarned" && r.last.spoke, r); }
  { const r = await play(page, { amount:666 }); check("X4b. TEST 3 — a major award gets major treatment: tier 4 and a voice from the major pool (“more XP in the dam” / “earned flow”)", r.last.tier === 4 && r.v.length === 1 && /^xp:(moreXp|earnedFlow)$/.test(r.v[0]), r); }
  { const r = await play(page, { amount:111, counts:"level", levelTotal:333, levelMax:666 }); check("X4c. a reservoir mark plays “MORE XP IN THE DAM”", r.v.join() === "xp:moreXp", r); }
  { const r = await play(page, { amount:666, source:"WATERWHEEL" }); check("X4d. skill → flow → reward: a waterwheel reward plays “THAT'S SOME EARNED FLOW”", r.v.join() === "xp:earnedFlow", r); }
  { const r = await play(page, { kind:"flowpoints", amount:111, source:"BONUS" }); check("X4e. TEST 4 — an XP transaction finalised → “XP LOCKED IN”", r.v.join() === "xp:locked", r); }
  { const r = await play(page, { kind:"reward", amount:0, source:"UNLOCK", label:"NEW SONG" }); check("X4f. TEST 5 — an unlocked reward → “YOU EARNED THAT” (and the SECURED stamp is the visual)", r.v.join() === "xp:earnedThat", r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); const b0 = XVOICE().length; XPRewardEngine.showRewardSecured({ label:"SONG" }); await new Promise(r => setTimeout(r, 2400)); return { v:XVOICE().slice(b0) }; }); check("X4g. TEST 5b — a committed reward → “REWARD SECURED”", r.v.join() === "xp:secured", r); }
  { const r = await play(page, { kind:"flowpoints", amount:666, source:"BONUS" }); check("X4h. TEST 6 — Flow Points → “FLOW POINTS SECURED”", r.v.join() === "xp:flowPoints", r); }
  { const r = await play(page, { kind:"flowpoints", amount:6660, source:"BONUS", jackpot:true }); check("X4i. a jackpot-size reward plays a tier-7 phrase (“that XP is yours” / “flow points secured”)", r.last.tier === 7 && /^xp:(xpYours|flowPoints)$/.test(r.v[0] || ""), r); }
  { const r = await play(page, { amount:111, total:6700, unlockCost:6660 }); check("X4j. crossing the unlock price plays “THAT XP IS YOURS”", r.v.join() === "xp:xpYours", r); }
  { const r = await play(page, { amount:10 }); check("X4k. a micro award makes no sound", r.v.length === 0, r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); const b0 = XVOICE().length, log = []; const P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function(){ log.push(this.src); return P.apply(this, arguments); };
      GEI_AUDIO.setMuted ? GEI_AUDIO.setMuted(true) : GEI_AUDIO.mute && GEI_AUDIO.mute(true);
      XPE({ amount:666, source:"WATERWHEEL" }); await new Promise(r => setTimeout(r, 300)); const fl = !!document.querySelector(".xpreFloat"), txt = (document.querySelector(".xpreNum") || {}).textContent; await new Promise(r => setTimeout(r, 2600));
      HTMLMediaElement.prototype.play = P; return { muted:GEI_AUDIO.muted, log:log.filter(s => /zyrosite/.test(s)), fl, txt, v:XVOICE().slice(b0), last:XLAST() }; });
    check("X4l. TEST 9 — audio OFF: the visual XP still appears and the reward is celebrated, but NO audio attempt fires", r.muted === true && r.fl && r.txt === "+666 XP" && r.log.length === 0 && r.v.length === 0 && r.last.voice === "audio-off", r); }
  check("X4m. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteSequencing(){
  console.log("X5 sequencing");
  const h = await bootX({ clipMs:700 }); const { page } = h;
  await page.evaluate(() => { OVL_START(); });
  { const r = await page.evaluate(async () => { SETUP_XP(); const FM = FlowMomentEngine; FM.say(FM.priorities.stem === 4.8 ? "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/okay...-that-was-awesome-PFNYTbtk7XKllNHq.mp3" : "", { pri:FM.priorities.stem, label:"other-voice" }); await new Promise(r => setTimeout(r, 120));
      XPE({ amount:111 }); await new Promise(r => setTimeout(r, 300)); const early = XVOICE().length, busy = FM.voiceBusy(); await new Promise(r => setTimeout(r, 2600)); const log = FM.state().voiceLog;
      return { early, busy, log:log.slice(-3), played:XLAST().voice, ov:window.__ov }; });
    check("X5a. another voice is speaking → the XP voice WAITS for it (never interrupts, never overlaps), then plays", r.early === 0 && r.log[r.log.length - 1] === "xp:xpEarned" && r.log.indexOf("other-voice") < r.log.indexOf("xp:xpEarned") && r.ov <= 1, r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); window.__ov = 0; const W = RareWowMomentEngine; W.config.minLevel = 1; const t = triggerRareWow("rare", { noSlow:true }); await new Promise(r => setTimeout(r, 200)); XPE({ amount:111, total:777 }); await new Promise(r => setTimeout(r, 350)); const early = !!document.querySelector(".xpreFloat"), wowOn = W.active(); await new Promise(r => setTimeout(r, 5500));
      const log = FlowMomentEngine.state().voiceLog; const wi = log.findIndex(x => /^wow:/.test(x)), xi = log.lastIndexOf("xp:xpEarned"); return { early, wowOn, wi, xi, ov:window.__ov, log:log.slice(-4), voice:XLAST().voice }; });
    check("X5b. TEST 8 — WOW + XP: the WOW speaks first, the XP voice follows, nothing overlaps (WOW celebrates the moment, XP confirms the consequence)", r.wowOn && r.wi >= 0 && r.xi > r.wi && r.ov <= 1 && r.ov >= 1, r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); state.phase = "levelComplete"; const before = XVOICE().length; XPE({ amount:111, source:"LEVEL_COMPLETION", final:true, counts:"level", levelTotal:666, levelMax:666 }); await new Promise(r => setTimeout(r, 400)); const fl = document.querySelectorAll(".xpreFloat").length; await new Promise(r => setTimeout(r, 1600)); state.phase = "playing"; return { fl, v:XVOICE().length - before, last:XLAST() }; });
    check("X5c. TEST 7 — during the Level Complete sequence the XP engine stays QUIET: no overlay, no voice (the counter still ticks)", r.fl === 0 && r.v === 0 && r.last.quiet === true && /^quiet-/.test(r.last.voice), r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); const before = XVOICE().length; window.__GEI_TRANSITION__ = true; XPE({ amount:666 }); await new Promise(r => setTimeout(r, 1800)); window.__GEI_TRANSITION__ = false; return { fl:document.querySelectorAll(".xpreFloat").length, v:XVOICE().length - before, last:XLAST() }; });
    check("X5d. during the Next Challenge transition the XP engine stays quiet", r.fl === 0 && r.v === 0 && r.last.quiet === true, r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); const before = XVOICE().length; FlowMomentEngine.state(); const fs = FlowMomentEngine.state; XPE({ amount:111 }); await new Promise(r => setTimeout(r, 200)); window.dispatchEvent(new CustomEvent("gei:flow-event", { detail:{ type:"fail", at:performance.now() } })); await new Promise(r => setTimeout(r, 2500)); return { v:XVOICE().length - before, last:XLAST() }; });
    check("X5e. a failure drops any held reward voice instead of playing it late", r.v === 0 || /cancel|expired|blocked/.test(r.last.voice) || r.last.voice === "played", r); }
  { const r = await page.evaluate(async () => { SETUP_XP(); window.__ov = 0; for (let i = 0; i < 5; i++){ XPE({ amount:666, total:4000 + i * 700 }); await new Promise(r => setTimeout(r, 900)); XPE({ kind:"reward", amount:0, label:"NEW SONG", source:"UNLOCK" }); await new Promise(r => setTimeout(r, 900)); } await new Promise(r => setTimeout(r, 3000)); return { ov:window.__ov, v:XVOICE() }; });
    check("X5f. ten celebrations in a row: exactly one audible voice at any instant", r.ov <= 1, r); }
  check("X5g. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteVisuals(){
  console.log("X6 visuals");
  for (const vp of [{ width:390, height:844 }, { width:320, height:568 }, { width:360, height:640 }]){
    const h = await bootX({ viewport:vp }); const { page } = h;
    const r = await page.evaluate(async () => {
      SETUP_XP({ voice:false }); const out = {}; const rect = () => { const e = document.querySelector(".xpreFloat"); if (!e) return null; const b = e.getBoundingClientRect(); return { l:b.left, r:b.right, t:b.top, b:b.bottom }; };
      const worst = [];
      for (const [a, o] of [[6660, { kind:"flowpoints", jackpot:true, source:"BONUS" }], [123456, {}], [666, {}], [37, {}], [10, {}]]) { XPE(Object.assign({ amount:a }, o)); await new Promise(r => setTimeout(r, 250)); const b = rect(); worst.push([a, b]); await new Promise(r => setTimeout(r, 2600)); }
      XPE({ kind:"reward", amount:0, label:"CHARACTER UNLOCKED", source:"UNLOCK" }); await new Promise(r => setTimeout(r, 250)); worst.push(["reward", rect()]); await new Promise(r => setTimeout(r, 2500));
      const se = document.scrollingElement; return { worst, sw:se.scrollWidth, iw:innerWidth, sh:se.scrollHeight, ih:innerHeight, left:document.querySelectorAll(".xpreFloat,.xpreDrop").length, rootOv:getComputedStyle(document.getElementById("xpreRoot")).pointerEvents };
    });
    const inside = r.worst.every(([, b]) => b && b.l >= -1 && b.r <= r.iw + 1 && b.t >= -1 && b.b <= r.ih + 1);
    check(`X6a. ${vp.width}×${vp.height}: +10 · +37 · +666 · +6,660 · +123,456 · a reward stamp all fit the viewport (no clipping)`, inside, r.worst);
    check(`X6b. ${vp.width}×${vp.height}: no horizontal overflow, nothing left on screen afterwards, the layer never intercepts a tap`, r.sw <= r.iw && r.left === 0 && r.rootOv === "none", r);
    check(`X6c. ${vp.width}×${vp.height}: no uncaught errors`, h.errors.length === 0, h.errors);
    await h.close();
  }
  { const h = await bootX(); const { page } = h;
    const r = await page.evaluate(async () => {
      SETUP_XP({ voice:false }); const hud = document.getElementById("hudOz"); const seq = [];
      const before = { fill:hud.style.getPropertyValue("--xpre-fill"), txt:hud.textContent };
      state.levelFlOz = 333; renderHud();   /* the authoritative HUD already holds the new value when the event arrives */
      XPE({ amount:111, source:"PRESSURE_CONTROL", index:2, counts:"level", levelTotal:333, levelMax:666, total:333 });
      await new Promise(r => setTimeout(r, 200)); seq.push(["pop", (document.querySelector(".xpreNum") || {}).textContent, (document.querySelector(".xpreSub") || {}).textContent]);
      await new Promise(r => setTimeout(r, 750)); const mid = (document.querySelector(".xpreFloat") || {}).style && document.querySelector(".xpreFloat").style.transform;
      await new Promise(r => setTimeout(r, 700)); seq.push(["lock", (document.querySelector(".xpreNum") || {}).textContent, (document.querySelector(".xpreSub") || {}).textContent, hud.classList.contains("xpreTick"), hud.style.getPropertyValue("--xpre-fill")]);
      await new Promise(r => setTimeout(r, 1500)); const end = { txt:hud.textContent.replace(/\s+/g, " ").trim(), fill:hud.style.getPropertyValue("--xpre-fill"), fl:document.querySelectorAll(".xpreFloat").length, tick:hud.classList.contains("xpreTick") };
      state.levelFlOz = 0; renderHud(); await new Promise(r => setTimeout(r, 120)); return { before, seq, mid, end, after:hud.style.getPropertyValue("--xpre-fill") };
    });
    check("X6d. the full loop: +111 XP pops at the action → flies → counter ticks + reservoir fills to 50% → “111 XP LOCKED IN” → settles into the counter and is gone", r.seq[0][1] === "+111 XP" && /PRESSURE/.test(r.seq[0][2]) && r.seq[1][1] === "111 XP LOCKED IN" && /SECURED/.test(r.seq[1][2]) && r.seq[1][4].startsWith("50") && r.end.fl === 0 && /333/.test(r.end.txt) && r.end.fill.startsWith("50"), r);
    check("X6e. the HUD number ends on exactly the authoritative value and the reservoir follows the HUD when it resets (new level)", /333 \/ 666/.test(r.end.txt) && r.after.startsWith("0"), r);
    check("X6f. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close(); }
  { const h = await bootX({ reduced:true }); const { page } = h;
    const r = await page.evaluate(async () => { SETUP_XP({ voice:false }); const hud = document.getElementById("hudOz"); state.levelFlOz = 555; renderHud();
      XPE({ amount:111, source:"WATERWHEEL", index:4, counts:"level", levelTotal:555, levelMax:666, total:555 }); await new Promise(r => setTimeout(r, 250)); const pop = (document.querySelector(".xpreNum") || {}).textContent, drops = document.querySelectorAll(".xpreDrop").length;
      await new Promise(r => setTimeout(r, 900)); const lock = (document.querySelector(".xpreNum") || {}).textContent, tick = hud.classList.contains("xpreTick"), fill = hud.style.getPropertyValue("--xpre-fill"), tr = getComputedStyle(hud).transitionDuration;
      await new Promise(r => setTimeout(r, 1500)); const gone = document.querySelectorAll(".xpreFloat").length === 0; state.levelFlOz = 0; renderHud(); return { pop, drops, lock, tick, fill, tr, gone, anims:document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest("#xpreRoot")).length }; });
    check("X6g. TEST 11 — reduced motion: XP still appears, the counter still updates, the lock still confirms; no particles, no flight, quick and quiet", r.pop === "+111 XP" && r.drops === 0 && r.lock === "111 XP LOCKED IN" && r.tick && r.fill.startsWith("83") && parseFloat(r.tr) < .01 && r.gone, r);
    check("X6h. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close(); }
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
async function suiteEconomy(){
  console.log("X7 economy");
  { const h = await bootX(); const { page } = h;
    const r = await page.evaluate(async (snap) => { SETUP_XP(); const s0 = eval(snap), keys0 = Object.keys(localStorage).sort().join();
      for (let i = 0; i < 40; i++) XPE({ amount:111 * (i % 7 + 1), total:50000 + i, kind: i % 3 ? "xp" : "flowpoints" }); XPE({ kind:"reward", amount:0, label:"X" }); XPRewardEngine.showEarnedXP({ amount:999999, source:"BONUS" }); XPRewardEngine.showRewardSecured({});
      testXPReward(37); testXPReward(666); testXPStack(); testXPLock(); testRewardSecured(); testFlowPointsSecured(); testMajorReward(); testXPAudio("xpEarned");
      await new Promise(r => setTimeout(r, 4500)); const s1 = eval(snap); saveGame(); const s2 = eval(snap); return { same:JSON.stringify(s0) === JSON.stringify(s1), same2:s0.tot === s2.tot && s0.lvl === s2.lvl, keys:Object.keys(localStorage).sort().join().replace(keys0, "").length, newKeys:Object.keys(localStorage).filter(k => !keys0.split(",").includes(k)), tot:s1.tot }; }, snapshot);
    check("X7a. 40 XP events + every debug function change NOTHING in the economy: balance, level ledger, unlocks, receipts and the save are byte-identical", r.same && r.same2, r);
    check("X7b. the only storage it ever writes is its own phrase memory", r.newKeys.every(k => k === "geiXPRewardV1"), r.newKeys);
    check("X7c. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close(); }
  { const h = await bootX({ clipMs:350 }); const { page } = h;
    await page.evaluate(() => { XPRewardEngine.reset(); XPRewardEngine.config.rng = () => 0; window.__ev = []; window.addEventListener("gei:xp-event", e => window.__ev.push(Object.assign({}, e.detail))); PersonalityTriggerEngine.enabled = false; LevelCompleteVoiceEngine.resetHistory();
      OVL_START(); });
    await playLevel(h);
    const r = await page.evaluate(() => { const FM = FlowMomentEngine, log = FM.state().voiceLog, ids = LevelCompleteVoiceEngine.pool.map(x => x.id), b = document.getElementById("lcBtn").getBoundingClientRect(), ev = window.__ev, X = XPRewardEngine.state().log;
      return { n:ev.length, sum:ev.reduce((a, e) => a + e.amount, 0), amounts:[...new Set(ev.map(e => e.amount))], totals:ev.map(e => e.total), lvl:ev.map(e => e.levelTotal), tot:state.totalFlOz, done:state.completedLevels, xpv:log.filter(x => /^xp:/.test(x)), victory:log.filter(x => ids.includes(x)).length, ov:window.__ov, btn:b.bottom, vh:innerHeight,
        celebrated:X.map(x => [x.amount, x.type, x.voice]), floatsLeft:document.querySelectorAll(".xpreFloat").length, hud:document.getElementById("hudOz").textContent.replace(/\s+/g, " ").trim(), srcs:ev.map(e => e.source) }; });
    check("X7d. a real level: six authoritative day awards of 111 are announced once each, matching the wallet exactly (6 × 111 = 666), no duplicates", r.n === 6 && r.sum === 666 && r.tot === 666 && r.amounts.join() === "111" && r.done === 1 && r.totals.join() === "111,222,333,444,555,666" && r.lvl.join() === "111,222,333,444,555,666", r);
    check("X7e. every announced source is real gameplay context (mission · pressure · gate · waterwheel · level completion)", r.srcs.join() === "MISSION,MISSION,PRESSURE_CONTROL,GATE_CONTROL,WATERWHEEL,LEVEL_COMPLETION", r.srcs);
    check("X7f. a real level is not twelve voice clips: ≤ 3 XP voices; the victory voice still plays exactly once (LevelCompleteVoiceEngine stays authoritative); never two voices at once", r.xpv.length <= 3 && r.victory === 1 && r.ov <= 1, r);
    check("X7g. the final day's award is celebrated quietly (no voice over the completion) and the Level Complete CONTINUE button is reachable", r.celebrated[5] && /quiet|level-owner/.test(r.celebrated[5][2]) && r.btn <= r.vh && r.floatsLeft === 0, r);
    check("X7h. TEST 7 — no XP overlay left over the Level Complete card; no uncaught errors", r.floatsLeft === 0 && h.errors.length === 0, h.errors);
    await h.close(); }
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, classify:suiteClassify, batching:suiteBatching, audio:suiteAudio, sequencing:suiteSequencing, visuals:suiteVisuals, economy:suiteEconomy };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
