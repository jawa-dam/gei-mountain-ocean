/* V2.2.15 — RARE WOW MOMENT ENGINE regression harness
 *
 * Real index.html in headless Chromium (offline; the supplied MP3s are answered with a short generated WAV; chosen URLs can be answered 404).
 *   W1 wiring      ten supplied clip URLs exact, priority (… STEM < achievement < WOW < personality), tiers, debug function, no production debug UI
 *   W2 verify      every clip loads; a broken / ".mp3t" reference is repaired + reported
 *   W3 scoring     TESTS 1–6: normal tap · good combo · exceptional combo · water surge · power/energy · near-failure recovery (score → tier → phrase)
 *   W4 memory      TEST 9: cooldown, history, no repeated phrase / category, taps between, caps, persisted memory
 *   W5 stage       presentation phases, text, character, 5 portrait viewports, TEST 10 audio OFF, TEST 12 reduced motion
 *   W6 priority    waits for / never interrupts other voices, is interrupted by ONE MORE; blocked in TESTS 7–8 (level complete, failure), layering with STEM + personality
 *   W7 debug       triggerRareWow(tier | phrase) works, never touches memory
 *   W8 safety      a whole level, a failure with WOW eligible, nothing overlaps
 *
 *   node tools/v2215-rare-wow/rare-wow-regression.mjs [suite]
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

const FILES = ["you-just-broke-the-flow-2luy9AL8aCWEpkYo", "okay...-that-was-awesome-PFNYTbtk7XKllNHq", "that-s-a-wow-moment-yEiRstQXKsMCkmtE", "that-was-dam-wild-EAAUorBPfR8UEPId", "whoa-look-at-that-water-qxgCbW23gUj9jOCZ",
  "the-flow-just-went-crazy-J9TfvqTuLhEOCBoa", "now-that-s-some-power-vEhAPKORhyQLiQMf", "oh-that-was-a-big-one-8z2GuBuUkcYKCq5V", "did-that-just-happen-7p9RXjHoZ4DYF9du", "whoa-what-was-that-ifxvQUxNUvyuHA7S"];
/* dry-run, level 9, deterministic luck (rng 0 = every roll succeeds, no random bonus), fresh memory */
const SETUP_SRC = `window.SETUP_WOW = (cfg) => { const E = RareWowMomentEngine, c = E.config; E.reset(); c.enabled = true; c.dryRun = true; c.rng = () => 0; c.requirePlaying = false; c.minLevel = 1; c.rareWowCooldownMs = 80000; c.minTapsBetween = 24; c.maxPerLevel = 2; c.maxPerSession = 12; c.recentIds = 4; c.mysteryChance = 0; c.settleMs = 420; c.tierChance = { common:.6, rare:.5, epic:.55, ultra:.6 };
  state.level = 9; try { FlowMomentEngine.setFlowLevel(0); } catch (e) {} Object.assign(c, cfg || {}); };
window.RAPID = (n, t0, gap) => { const E = RareWowMomentEngine; let last = null; for (let i = 0; i < n; i++) last = E.onEvent("tap", { ts:t0 + i * (gap || 120), index:0, required:30, remaining:30 - i, remMs:5000, streak:i + 1 }); return last; };`;
const lastLog = `(() => { const l = RareWowMomentEngine.state().log; return l[l.length - 1] || null; })()`;

async function suiteWiring(){
  console.log("W1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "rare-wow-moment-engine-v2215.js"), "utf8");
  check("W1a. script loads after the STEM engine", html.indexOf("/rare-wow-moment-engine-v2215.js") > html.indexOf("/stem-intelligence-engine-v2214.js"));
  check("W1b. all ten supplied WOW files are referenced exactly", FILES.every(f => js.includes(f + ".mp3")), FILES.filter(f => !js.includes(f + ".mp3")));
  const h = await boot();
  const r = await h.page.evaluate(() => { const W = RareWowMomentEngine; return { pri:FlowMomentEngine.priorities, n:Object.keys(W.clips).length, urls:Object.values(W.clips).map(c => c.url), tiers:Object.values(W.clips).map(c => c.tier), dbg:typeof window.triggerRareWow, api:["onEvent", "consider", "score", "verify", "state", "reset", "debug"].every(k => k in W),
      ui:[...document.querySelectorAll("button,a,[id],[class]")].filter(e => /wowdebug|rareWowDebug|rwDebug/i.test(e.id + " " + e.className)).length }; });
  const p = r.pri;
  check("W1c. ten clips on the supplied CDN, no '.mp3t' reference; tiers: 2 common · 4 rare · 2 epic · 2 ultra", r.n === 10 && r.urls.every(u => /^https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/.+\.mp3$/.test(u)) && ["common", "rare", "epic", "ultra"].map(t => r.tiers.filter(x => x === t).length).join() === "2,4,2,2", { urls:r.urls, tiers:r.tiers });
  check("W1d. priority: failure < level complete < ONE MORE < milestone < next challenge < STEM < achievement < WOW < personality < reaction", p.cinematic < p.levelComplete && p.levelComplete < p.oneMore && p.oneMore < p.milestone && p.milestone < p.nextChallenge && p.nextChallenge < p.stem && p.stem < p.achievement && p.achievement < p.wow && p.wow < p.personality && p.personality < p.reaction, p);
  check("W1e. API present; triggerRareWow() exists for debugging; NO debug control is rendered in the page", r.api && r.dbg === "function" && r.ui === 0, r);
  check("W1f. selfTest of the core still passes", await h.page.evaluate(() => { const s = FlowMomentEngine.selfTest(); return !s || s.ok !== false && !(s.failed && s.failed.length); }));
  check("W1g. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteVerify(){
  console.log("W2 audio verification");
  { const h = await boot(); const r = await h.page.evaluate(async () => RareWowMomentEngine.verify());
    check("W2a. verify(): all ten WOW clips load", r.length === 10 && r.every(x => x.ok && !x.repaired), r.filter(x => !x.ok)); await h.close(); }
  { const h = await boot({ broken:/\.mp3t$/ });
    const r = await h.page.evaluate(async () => { const c = RareWowMomentEngine.clips.damWild, good = c.url; c.url = good + "t"; const res = await RareWowMomentEngine.verify(); return { x:res.find(y => y.id === "damWild"), fixed:c.url === good }; });
    check("W2b. a '.mp3t' reference is detected and repaired, not left silently broken", r.x.ok && r.x.repaired && r.fixed, r); await h.close(); }
  { const h = await boot({ broken:/bad-wow/ });
    const r = await h.page.evaluate(async () => { const W = RareWowMomentEngine; W.clips.whatWas.url = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/bad-wow.mp3"; const ev = []; window.addEventListener("gei:audio-broken", e => ev.push(e.detail.id)); const res = await W.verify(); return { x:res.find(y => y.id === "whatWas"), ev, d:W.diagnostics().whatWas }; });
    check("W2c. an unrepairable clip is reported (event + diagnostics)", !r.x.ok && r.ev.includes("whatWas") && r.d.ok === false, r); await h.close(); }
}

async function suiteScoring(){
  console.log("W3 scoring → tier → phrase");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const R = await page.evaluate((lastLogSrc) => {
    const W = RareWowMomentEngine, out = {}, ll = () => { const l = W.state().log; return l[l.length - 1] || null; };
    /* TEST 1 — normal taps */
    SETUP_WOW(); for (let i = 0; i < 6; i++) W.onEvent("tap", { ts:1e6 + i * 400, index:0, required:6, remaining:6 - i, remMs:5000, streak:i + 1 }); out.normal = W.state().log.length;
    /* TEST 2 — a good combo at a normal pace (streak 7) */
    SETUP_WOW(); for (let i = 0; i < 7; i++) W.onEvent("tap", { ts:2e6 + i * 380, index:0, required:30, remaining:30 - i, remMs:5000, streak:i + 1 }); out.good = W.state().log.length;
    /* TEST 3 — exceptional combo + rapid taps */
    SETUP_WOW(); for (let i = 0; i < 18; i++) W.onEvent("tap", { ts:3e6 + i * 120, index:0, required:30, remaining:30 - i, remMs:5000, streak:i + 1 }); out.pendingBefore = W.state().log.length; W.flush(); out.exc = ll(); out.excAll = W.state().log.map(x => x.clip + ":" + x.tier);
    /* TEST 4 — major water surge (reservoir station, fast, strong streak) */
    SETUP_WOW(); W.onEvent("day", { ts:4e6, index:2, remMs:4800, streak:11, closeCall:false }); out.water = ll();
    /* TEST 5 — exceptional waterwheel / energy */
    SETUP_WOW(); W.onEvent("day", { ts:5e6, index:4, remMs:4800, streak:13, closeCall:false }); out.power = ll();
    /* TEST 6 — near-failure recovery (after a failure, finishing with 0.9 s left on a streak) */
    SETUP_WOW(); W.onEvent("fail", {}); W.onEvent("start", {}); W.onEvent("day", { ts:6e6, index:1, remMs:900, streak:9, closeCall:true }); out.near = ll();
    /* a near-failure with no streak is not enough */
    SETUP_WOW(); W.onEvent("day", { ts:7e6, index:1, remMs:900, streak:2, closeCall:true }); out.weakNear = ll();
    out.parts = W.score("combo", { ts:1e7, streak:16 }).parts;
    return out;
  });
  check("W3a. TEST 1 — a normal tap is never a WOW (nothing is even a candidate)", R.normal === 0, R.normal);
  check("W3b. TEST 2 — a good combo at a normal pace does not trigger a WOW", R.good === 0, R.good);
  check("W3c. TEST 3 — an exceptional combo with rapid taps earns a RARE-or-better WOW (and only one)", R.exc && !R.exc.skipped && ["rare", "epic"].includes(R.exc.tier) && R.excAll.length === 1, R.excAll);
  check("W3d. TEST 4 — a major water surge earns a contextual WATER wow ('Whoa, look at that water')", R.water && !R.water.skipped && R.water.clip === "lookWater", R.water);
  check("W3e. TEST 5 — an exceptional waterwheel / energy event earns 'Now that's some power'", R.power && !R.power.skipped && R.power.clip === "power" && R.power.tier === "rare", R.power);
  check("W3f. TEST 6 — an exceptional near-failure recovery earns the dramatic 'You just broke the flow'; a weak one earns nothing", R.near && R.near.clip === "flowBreak" && !R.weakNear, { near:R.near, weak:R.weakNear });
  check("W3g. the wowScore is built from real state: comboIntensity grows with the streak, first-time bonus applies, others are 0", R.parts.comboIntensity >= 25 && R.parts.firstTimeBonus === 10 && R.parts.recoveryBonus === 0 && "milestoneBonus" in R.parts && "visualEventBonus" in R.parts && "unusualEvent" in R.parts && "rarityBonus" in R.parts && "flowIntensity" in R.parts, R.parts);
  const U = await page.evaluate(() => {
    const W = RareWowMomentEngine, out = {}; SETUP_WOW({ mysteryChance:1 });
    W.onEvent("day", { ts:8e6, index:2, remMs:3000, streak:6, closeCall:false }); const l = W.state().log; out.mystery = l[l.length - 1];
    SETUP_WOW(); out.tiers = [["combo", 41], ["combo", 60], ["combo", 80], ["perfect", 100]].map(([k, sc]) => W.tierFor(sc)); out.locked = (() => { SETUP_WOW({ minLevel:2 }); state.level = 1; W.onEvent("day", { ts:9e6, index:2, remMs:4800, streak:11 }); return W.state().log.slice(-1)[0].skipped; })();
    return out;
  });
  check("W3h. the hidden 'what was that?' event is an ULTRA-RARE discovery (needs the hidden roll)", U.mystery && U.mystery.tier === "ultra" && ["whatWas", "didThat"].includes(U.mystery.clip), U.mystery);
  check("W3i. thresholds map score → common / rare / epic / ultra; level 1 (learning level) never triggers", U.tiers.join() === "common,rare,epic,ultra" && U.locked === "locked", U);
  check("W3j. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteMemory(){
  console.log("W4 cooldown + history");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const R = await page.evaluate(() => {
    const W = RareWowMomentEngine, out = {}, C = W.config;
    const STRONG = { streak:20, remMs:5000, afterDay:true, milestone:true, maxCombo:16, visual:24, unusual:12 };
    const fire = (kind, ts, extra) => W.consider(kind, Object.assign({ ts, streak:16, remMs:5000 }, extra || {})), tail = () => W.state().log.map(x => (x.clip || "-") + (x.skipped ? "!" + x.skipped : ""));
    /* cooldown: another strong moment right after is refused; after the cooldown AND enough taps it is allowed */
    SETUP_WOW(); fire("water", 1e6, { afterDay:true, visual:24 }); fire("water", 1e6 + 2000, { afterDay:true, visual:24 }); out.cool1 = tail();
    for (let i = 0; i < 30; i++) W.onEvent("tap", { ts:1e6 + 3000 + i * 400, index:0, required:30, remaining:30, remMs:5000, streak:1 });
    fire("combo", 1e6 + 85000, STRONG); out.cool2 = tail();
    /* taps between */
    SETUP_WOW(); fire("combo", 2e6, STRONG); fire("flow", 2e6 + C.rareWowCooldownMs + 1000, STRONG); out.taps = tail();
    /* never the same phrase / category twice in a row; recent phrases are skipped */
    SETUP_WOW({ rareWowCooldownMs:0, minTapsBetween:0, maxPerLevel:99, maxPerSession:99 }); const seq = [];
    for (let i = 0; i < 40; i++){ const r = W.consider(["combo", "flow", "water", "performance"][i % 4], { ts:3e6 + i * 1000, streak:20, afterDay:true, visual:24, milestone:true, remMs:5000 }); if (r && r.clip) seq.push(r.clip); }
    out.seq = seq; out.sameBack = seq.filter((c, i) => i && c === seq[i - 1]).length; out.cats = seq.map(c => W.clips[c].category); out.sameCat = out.cats.filter((c, i) => i && c === out.cats[i - 1]).length;
    out.window = seq.every((c, i) => !seq.slice(Math.max(0, i - 3), i).includes(c));
    /* per-level cap */
    SETUP_WOW({ rareWowCooldownMs:0, minTapsBetween:0, maxPerLevel:2 }); let n = 0; for (let i = 0; i < 10; i++){ const r = W.consider(["combo", "flow", "water", "performance"][i % 4], Object.assign({}, STRONG, { ts:4e6 + i * 5000 })); if (r && r.clip) n++; } out.cap = n;
    /* session cap */
    SETUP_WOW({ rareWowCooldownMs:0, minTapsBetween:0, maxPerLevel:99, maxPerSession:3 }); n = 0; for (let i = 0; i < 12; i++){ state.level = 9 + i; const r = W.consider(["combo", "flow", "water", "performance"][i % 4], Object.assign({}, STRONG, { ts:5e6 + i * 5000 })); if (r && r.clip) n++; } out.session = n; state.level = 9;
    /* memory persists (localStorage) and survives a reload of the engine state */
    SETUP_WOW({ rareWowCooldownMs:0, minTapsBetween:0 }); const q = W.consider("combo", Object.assign({}, STRONG, { ts:6e6 }));
    const stored = JSON.parse(localStorage.getItem("geiRareWowV1") || "null"); out.persist = !!(stored && stored.recentIds.includes(q.clip) && stored.hist[q.clip].n === 1 && stored.discovered.tiers[q.tier]);
    /* the hierarchy: a lone small boost never yields epic */
    SETUP_WOW(); out.noEpicLow = W.score("combo", { ts:7e6, streak:6 }).total < W.config.threshold.rare;
    return out;
  });
  check("W4a. rareWowCooldown: a second WOW right after the first is refused", R.cool1.length === 2 && R.cool1[1].endsWith("!cooldown") && !R.cool1[0].includes("!"), R.cool1);
  check("W4b. once the cooldown has elapsed AND the player has played enough taps, the next WOW is allowed again", R.cool2.length === 3 && !R.cool2[2].includes("!"), R.cool2);
  check("W4c. a long cooldown is not enough alone — the player must also have played taps", R.taps[1] && R.taps[1].endsWith("!taps"), R.taps);
  check("W4d. never the same phrase twice in a row, never the same category back to back, and a recent phrase is not reused for 4 WOWs", R.seq.length >= 6 && R.sameBack === 0 && R.sameCat === 0 && R.window, { seq:R.seq, cats:R.cats });
  check("W4e. per-level cap (2) and per-session cap keep it rare", R.cap === 2 && R.session === 3, { cap:R.cap, session:R.session });
  check("W4f. the engine has memory: recent phrases, usage counts and discovered tiers persist across sessions", R.persist);
  check("W4g. a plain 6-streak can never reach even the first rare tier", R.noEpicLow);
  await h.close();
}

const VIEWS = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]];
async function suiteStage(){
  console.log("W5 presentation");
  { const h = await boot({ clipMs:300 }); const { page } = h; await page.evaluate(SETUP_SRC);
    const R = await page.evaluate(async () => {
      const W = RareWowMomentEngine, F = FlowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms)), out = {}; SETUP_WOW({ dryRun:false, rareWowCooldownMs:0, minTapsBetween:0 }); F.stopVoice();
      const t0 = performance.now(); W.debug.trigger("damWild"); await w(60); const el = document.querySelector(".rwWow");
      out.early = { vis:!!el, voice:!!F.state().voice, txt:el && el.querySelector(".rwTxt").textContent, av:!!(el && el.querySelector(".rwAv, .rwEm")), tag:el && el.querySelector(".rwTag").textContent, lines:!!document.querySelector(".fmeP,.fmeR") };
      await w(500); out.audio = (F.state().voice || {}).id || F.state().voiceLog.slice(-1)[0];
      await w(2300); out.gone = !document.querySelector(".rwWow"); out.durMs = Math.round(performance.now() - t0);
      return out; });
    check("W5a. PHASE 3→4: the WOW text + character appear FIRST (before any voice), then the matching MP3 plays", R.early.vis && !R.early.voice && R.early.txt === "THAT WAS DAM WILD!" && R.early.av && R.audio === "wow:damWild", R);
    check("W5b. PHASE 6: the whole moment dissolves back into gameplay within ~1–3 s", R.gone && R.durMs < 3500, R.durMs);
    await h.close(); }
  for (const [w, hh] of VIEWS){
    const h = await boot({ viewport:{ width:w, height:hh }, clipMs:200 }); const { page } = h; await page.evaluate(SETUP_SRC);
    const R = await page.evaluate(async () => { const W = RareWowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms)), res = []; SETUP_WOW({ dryRun:false });
      for (const id of ["flowCrazy", "lookWater", "didThat", "whatWas", "bigOne"]){ W.debug.trigger(id, { noSlow:true }); await w(520);
        const c = document.querySelector(".rwCore"), t = document.querySelector(".rwTxt"), b = c.getBoundingClientRect(), tb = t.getBoundingClientRect(), root = document.querySelector("#fmeTop").getBoundingClientRect();
        res.push({ id, l:Math.round(tb.left), r:Math.round(tb.right), t:Math.round(b.top), bt:Math.round(b.bottom), fs:parseFloat(getComputedStyle(t).fontSize), pe:getComputedStyle(document.querySelector(".rwWow")).pointerEvents, over:t.scrollWidth > t.clientWidth + 1, rt:Math.round(root.top), rb:Math.round(root.bottom), inHost:b.top >= root.top - 2 && b.bottom <= root.bottom + 2 });
        await w(3300); }
      return { res, vw:innerWidth, vh:innerHeight, sw:document.documentElement.scrollWidth, sy:scrollY, card:document.getElementById("levelCard").classList.contains("show") }; });
    const ok = R.res.every(o => o.l >= -1 && o.r <= R.vw + 1 && o.t >= 0 && o.bt <= R.vh && o.fs >= 24 && o.pe === "none" && !o.over && o.inHost) && R.sw <= R.vw && R.sy === 0;
    check(`W5c. ${w}×${hh} portrait: every WOW fits (huge readable type, no clipping, no horizontal overflow, no scroll, never blocks taps)`, ok, R.res.find(o => o.l < -1 || o.r > R.vw + 1 || o.fs < 24 || !o.inHost || o.over || o.bt > R.vh) || R.sw);
    await h.close();
  }
  { const h = await boot({ clipMs:300 }); const { page } = h; await page.evaluate(SETUP_SRC);   // TEST 10 audio OFF
    const R = await page.evaluate(async () => { const W = RareWowMomentEngine, F = FlowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms)); SETUP_WOW({ dryRun:false, rareWowCooldownMs:0, minTapsBetween:0 }); GEI_AUDIO.setMuted(true);
      const r = W.consider("combo", { ts:performance.now(), streak:20, remMs:5000, afterDay:true, milestone:true }); await w(600); const vis = !!document.querySelector(".rwWow"); const voices = F.state().voiceLog.filter(x => /^wow:/.test(x)).length; const played = [...document.querySelectorAll("audio")].filter(a => !a.paused).length;
      GEI_AUDIO.setMuted(false); await w(3500); return { fired:!!(r && r.clip), vis, voices, played }; });
    check("W5d. TEST 10 — audio OFF: the visual WOW plays perfectly, no audio is requested or played", R.fired && R.vis && R.voices === 0 && R.played === 0, R); await h.close(); }
  { const h = await boot({ clipMs:300, reduced:true }); const { page } = h; await page.evaluate(SETUP_SRC);   // TEST 12 reduced motion
    const R = await page.evaluate(async () => { const W = RareWowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms)); SETUP_WOW({ dryRun:false });
      W.debug.trigger("power"); await w(400); const core = document.querySelector(".rwCore"), av = document.querySelector(".rwAv"), ring = document.querySelector(".rwRing"), wheel = document.querySelector('#stationsGroup .station[data-index="4"] .body');
      return { anim:getComputedStyle(core).animationName, avHidden:!av || getComputedStyle(av).display === "none", ringHidden:getComputedStyle(ring).display === "none", spin:/rwSpin/.test(wheel.getAttribute("class") || ""), txt:document.querySelector(".rwTxt").textContent, op:getComputedStyle(core).opacity }; });
    check("W5e. TEST 12 — reduced motion: the text simply fades in/out (no bounce, rings, spin or character animation) and is still fully readable", /rwFade/.test(R.anim) && R.avHidden && R.ringHidden && !R.spin && R.txt === "NOW THAT'S SOME POWER!", R); await h.close(); }
}

async function suitePriority(){
  console.log("W6 audio priority + layering");
  const h = await boot({ clipMs:900 }); const { page } = h; await page.evaluate(SETUP_SRC);
  const R = await page.evaluate(async () => {
    const W = RareWowMomentEngine, F = FlowMomentEngine, P = F.priorities, w = ms => new Promise(r => setTimeout(r, ms)), out = {};
    const live = (cfg) => { SETUP_WOW(Object.assign({ dryRun:false, rareWowCooldownMs:0, minTapsBetween:0, holdMs:4000 }, cfg || {})); F.stopVoice(); };
    const strong = (extra) => Object.assign({ ts:performance.now(), streak:20, remMs:5000, afterDay:true, milestone:true }, extra || {});
    /* a milestone voice is speaking: the WOW waits (queued), never talks over it, then plays */
    live(); F.say("whoa", { pri:P.milestone, label:"milestone" }); await w(60); const r1 = W.consider("combo", strong()); await w(300); out.during = (F.state().voice || {}).id; out.held = r1 === "held"; await w(2500); out.after = F.state().voiceLog.slice(-3);
    /* a STEM line is speaking: the WOW layers AFTER it */
    live(); F.say("whoa", { pri:P.stem, label:"stem:probe", polite:true }); await w(60); W.consider("combo", strong()); await w(300); out.stemDuring = (F.state().voice || {}).id; await w(2500); out.stemAfter = F.state().voiceLog.slice(-3);
    /* the WOW itself is the lowest of the "big" voices: ONE MORE interrupts it, a personality line can't */
    live(); W.consider("combo", strong()); await w(1250); out.wowOn = (F.state().voice || {}).id; F.say("hold", { pri:P.oneMore, label:"oneMore" }); await w(100); out.oneMore = (F.state().voice || {}).id;
    live(); W.consider("combo", strong()); await w(1250); let pr = "pending"; F.say("x", { pri:P.personality, polite:true, label:"pers:x" }).then(v => { pr = v; }); await w(40); out.persBlocked = pr === false && ((F.state().voice || {}).id || "").startsWith("wow:");
    /* the personality engine stays out of its way: a forced personality moment right after a WOW is refused */
    live(); W.consider("combo", strong()); await w(150); const PE = PersonalityTriggerEngine; PE.reset(); const n0 = PE.state().log.length; PE.consider("combo", 1, { ts:performance.now(), remMs:5000, force:true }); out.persSkipped = PE.state().log.length === n0;
    return out; });
  check("W6a. while a MILESTONE voice speaks, the WOW is queued, never interrupts it, and plays right afterwards", R.during === "milestone" && R.held && R.after.some(x => /^wow:/.test(x)), R);
  check("W6b. a STEM line is allowed to finish first — then the WOW layers on top ('LEARNING' → 'REACTION')", R.stemDuring === "stem:probe" && R.stemAfter.some(x => /^wow:/.test(x)), R);
  check("W6c. ONE MORE (priority 3) interrupts a WOW line; a personality line can never talk over it", /^wow:/.test(R.wowOn || "") && R.oneMore === "oneMore" && R.persBlocked, R);
  check("W6d. the PersonalityTriggerEngine yields to a WOW (the WOW is its higher-value moment) and is otherwise untouched", R.persSkipped);
  const B = await page.evaluate(async () => {
    const W = RareWowMomentEngine, F = FlowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms)), out = {};
    const case_ = async (fn, back, ctx) => { SETUP_WOW({ dryRun:false, rareWowCooldownMs:0, minTapsBetween:0 }); F.stopVoice(); fn(); await w(120); const n = W.state().log.length, sp0 = F.state().voiceLog.filter(x => /^wow:/.test(x)).length; const r = W.consider("combo", Object.assign({ ts:performance.now(), streak:20, remMs:5000, afterDay:true, milestone:true }, ctx || {})); const l = W.state().log.slice(-1)[0]; await w(300); const spoke = F.state().voiceLog.filter(x => /^wow:/.test(x)).length - sp0; back && back(); return { r:!!(r && r.clip), why:l && l.skipped, shown:!!document.querySelector(".rwWow"), spoke }; };
    out.fail = await case_(() => F.failure({ onCard:() => {} }), () => F.recover());
    out.level = await case_(() => F.levelComplete({ onCard:() => {} })); await w(9500);
    out.trans = await case_(() => { state.level = 13; NextChallengeEngine.resetSeen(); NextChallengeEngine.run({ onStart:() => {} }); }, () => NextChallengeEngine.skip());
    out.final = await case_(() => F.setFlowLevel(4), () => F.setFlowLevel(0), { afterDay:false });
    out.clock = await case_(() => {}, null, { afterDay:false, remMs:1000 });
    out.dbgFail = await (async () => { F.failure({ onCard:() => {} }); await w(150); const r = W.debug.trigger("awesome"); F.recover(); return r; })();
    return out; });
  check("W6e. TEST 8 — dam failure: the cinematic wins; no WOW visual, no WOW voice", B.fail.why === "critical" && !B.fail.shown && B.fail.spoke === 0 && !B.fail.r, B.fail);
  check("W6f. TEST 7 — level complete sequence: the victory wins; no WOW over it", B.level.why === "critical" && !B.level.shown && B.level.spoke === 0, B.level);
  check("W6g. blocked during the Next Challenge transition, the final push (2 MORE / ONE MORE) and the last seconds of the clock", B.trans.why === "critical" && B.final.why === "final-push" && B.clock.why === "clock", { t:B.trans, f:B.final, c:B.clock });
  check("W6h. even the debug trigger refuses to run over the failure cinematic", B.dbgFail && B.dbgFail.skipped === "critical", B.dbgFail);
  const D = await page.evaluate(() => { const W = RareWowMomentEngine; SETUP_WOW({ rareWowCooldownMs:0, minTapsBetween:0 }); W.onEvent("day", { ts:1e6, index:5, remMs:4800, streak:16, closeCall:false }); const d = W.state().deferred, n = W.state().log.length;
    W.onEvent("start", {}); W.onEvent("tap", { ts:1e6 + 5000, index:0, required:6, remaining:5, remMs:5000, streak:1 }); const a = W.state().log.length; W.onEvent("tap", { ts:1e6 + 5300, index:0, required:6, remaining:4, remMs:5000, streak:2 }); return { d, n, a, after:W.state().log.length, deferredNow:W.state().deferred, last:W.state().log.slice(-1)[0] }; });
  check("W6i. an exceptional LAST station of a level is deferred (the victory owns that moment) and delivered at the start of the next run", D.d === "power" && D.n === 0 && D.a === 0 && D.after === 1 && D.deferredNow === "" && D.last && !D.last.skipped, D);
  await h.close();
}

async function suiteDebug(){
  console.log("W7 debug + memory safety");
  const h = await boot({ clipMs:250 }); const { page } = h; await page.evaluate(SETUP_SRC);
  const R = await page.evaluate(async () => {
    const W = RareWowMomentEngine, F = FlowMomentEngine, w = ms => new Promise(r => setTimeout(r, ms)), out = {}; SETUP_WOW({ dryRun:false }); const mem0 = JSON.stringify([W.state().recentIds, W.state().session, W.state().cooldown, localStorage.getItem("geiRareWowV1")]);
    out.tiers = {}; for (const t of ["common", "rare", "epic", "ultra"]){ F.stopVoice(); const r = triggerRareWow(t, { noSlow:true }); await w(600); out.tiers[t] = { tier:r.tier, voice:F.state().voiceLog.slice(-1)[0], clip:r.clip, vis:!!document.querySelector(".rwWow") }; await w(3400); }
    out.phrases = {}; for (const id of Object.keys(W.clips)){ F.stopVoice(); triggerRareWow(id, { noSlow:true }); await w(520); out.phrases[id] = { voice:F.state().voiceLog.slice(-1)[0], txt:(document.querySelector(".rwTxt") || {}).textContent }; await w(3300); }
    out.mem = mem0 === JSON.stringify([W.state().recentIds, W.state().session, W.state().cooldown, localStorage.getItem("geiRareWowV1")]); out.bad = triggerRareWow("nonsense");
    return out; });
  check("W7a. triggerRareWow('common'|'rare'|'epic'|'ultra') shows + plays a phrase of that tier", Object.entries(R.tiers).every(([t, x]) => x.tier === t && x.vis && x.voice === "wow:" + x.clip), R.tiers);
  check("W7b. every one of the ten phrases can be tested on its own (visual text + its own MP3)", Object.entries(R.phrases).every(([id, x]) => x.voice === "wow:" + id && x.txt && x.txt.length > 8), R.phrases);
  check("W7c. debug triggers leave the player's WOW memory, cooldown and counters untouched; an unknown tier is ignored", R.mem && R.bad === false);
  check("W7d. no uncaught errors", h.errors.length === 0, h.errors);
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
  console.log("W8 safety");
  { const h = await boot({ clipMs:350 }); const { page } = h;
    await page.evaluate(() => { const W = RareWowMomentEngine, c = W.config; c.rng = () => 0; c.minLevel = 1; c.rareWowCooldownMs = 8000; c.minTapsBetween = 6; c.threshold = { common:8, rare:30, epic:60, ultra:96 }; c.maxPerLevel = 3; PersonalityTriggerEngine.enabled = false; StemIntelligenceEngine.config.stemCommentaryCooldown = 6000; LevelCompleteVoiceEngine.resetHistory();
      window.__ov = 0; setInterval(() => { const n = [...document.querySelectorAll("audio")].filter(a => !a.paused && !a.muted).length; if (n > window.__ov) window.__ov = n; }, 25); });
    await playLevel(h);
    const r = await page.evaluate(() => { const log = FlowMomentEngine.state().voiceLog, ids = LevelCompleteVoiceEngine.pool.map(x => x.id), b = document.getElementById("lcBtn").getBoundingClientRect(), W = RareWowMomentEngine;
      return { wow:log.filter(x => /^wow:/.test(x)), oneMore:log.filter(x => /^one-/.test(x)).length, victory:log.filter(x => ids.includes(x)).length, overlap:window.__ov, tot:state.totalFlOz, done:state.completedLevels, btn:b.bottom, vh:innerHeight, rw:!!document.querySelector(".rwWow"), wlog:W.state().log.map(x => x.clip || x.skipped) }; });
    check("W8a. a whole level with WOW made easy: never two voices at once, ONE MORE + the victory voice still play, WOW stays rare, rewards intact, CONTINUE reachable, no WOW left on screen", r.overlap <= 1 && r.oneMore >= 1 && r.victory === 1 && r.wow.length <= 3 && r.tot === 666 && r.done === 1 && r.btn <= r.vh && !r.rw && h.errors.length === 0, r);
    await h.close(); }
  { const h = await boot({ clipMs:200 }); const { page } = h;
    await page.evaluate(() => { const W = RareWowMomentEngine, c = W.config; c.rng = () => 0; c.minLevel = 1; c.threshold = { common:1, rare:2, epic:3, ultra:96 }; c.rareWowCooldownMs = 0; c.minTapsBetween = 0; PersonalityTriggerEngine.enabled = false; FlowMomentEngine.config.forcePlan = { event:"normal", reaction:"jump", weather:"none", dir:1, lines:["run", "whoa", "flood"] }; });
    await h.start(); for (let i = 0; i < 3; i++){ await h.tap(); await sleep(300); }
    await h.untilCard(); await sleep(600);
    const r = await page.evaluate(() => { const log = FlowMomentEngine.state().voiceLog; const i0 = log.indexOf("uhoh"); const order = ["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"]; return { cin:log.slice(i0).filter(x => order.includes(x)), wowInside:log.slice(i0).filter(x => /^wow:/.test(x)).length, rw:!!document.querySelector(".rwWow") }; });
    check("W8b. the Dam Failure Cinematic is untouched even with WOW made trivially easy: full voice order, no WOW inside it", JSON.stringify(r.cin.slice(0, 10)) === JSON.stringify(["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"]) && r.wowInside === 0 && !r.rw, r);
    await h.close(); }
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, verify:suiteVerify, scoring:suiteScoring, memory:suiteMemory, stage:suiteStage, priority:suitePriority, debug:suiteDebug, safety:suiteSafety };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
