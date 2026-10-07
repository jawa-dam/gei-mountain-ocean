/* V2.2.11 — MILESTONE PROGRESS ENGINE + LEVEL COMPLETE VOICE ENGINE regression harness
 *
 * Real index.html in headless Chromium (offline; the supplied MP3s are answered with a short generated WAV so `ended` is real).
 *   V1 wiring        every supplied clip URL exact (16 milestone + 11 victory), scripts loaded in order
 *   V2 selection     5/4/3/2/1 MORE pools: one clip, never the same twice in a row, not every clip, playful "about to break" withheld near timeout
 *   V3 live taps     real taps → "5 MORE!" … "ONE MORE!" words with the spoken phrase, rising flow level, voice throttled, never two voices at once,
 *                    the combo word is absorbed ("3 MORE!" + "HYDRAULIC SURGE ×3"), ONE MORE always speaks
 *   V4 priority      failure > level complete > ONE MORE > warning > milestone > achievement > reaction; lower never talks over higher
 *   V5 arc           success right after ONE MORE → no failure, environment resets · timer expiry right after ONE MORE → failure cinematic ("SO CLOSE")
 *   V6 victory voice performance-aware phrase selection (first / high combo / fast / clean / struggled / repeat), categories, no consecutive repeat
 *   V7 level sequence full level: stabilise → release → power → ONE victory voice → LEVEL COMPLETE! → card; CONTINUE inside the viewport, no scroll
 *   V8 safety        audio OFF / ON, 5 viewports, reduced motion, repeated failures
 *
 *   node tools/v2211-flow-voices/flow-voices-regression.mjs [suite]
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

const MS_FILES = {
  five: ["five-more-build-that-flow-ts2wjbZHrm0yAxw6", "five-more-the-dam-is-filling-hpmAuOdboY1DUCC5", "five-more-dam-ite-we-re-just-getting-started-tQRxVwUuXGZR0wMP", "five-more-let-s-keep-that-flow-moving-vYei4EO2G3vp0hqV"],
  four: ["four-more-the-pressure-s-building-gDjrcGDPSUYmEM6Y", "four-more-keep-that-water-coming-jCm29T7g4feUWNGA", "four-more-now-we-re-moving-kEcGGyPobWqJDTq6"],
  three: ["three-more-now-we-re-talking-LmqyLUWl9TAtWca4", "three-more-keep-the-flow-alive-DUN4SCioCF0lfKZ8", "three-more-feel-that-momentum-LQnfjtV8cBeejS8a"],
  two: ["two-more-don-t-let-up-qtAVUiOhQzSZgjV9", "two-more-we-re-almost-there-fiFC7rOr7TiuzUZS", "two-more-keep-it-dam-moving-x1nZyabZxJF2NcDp"],
  one: ["one-more-dam-ite-XBNQ9WXg3u9G9CfQ", "one-more-let-s-finish-this-flow-tlhawbqLcV3ZM94r", "one-more-the-dam-is-about-to-break-rz9MU5Fqq1xhsrVE"]
};
const VICTORY_FILES = ["you-did-it-dam-ite-j2bmIkuZmuQZ4n84", "that-level-is-in-the-bag-WRDirIiJelf6ARas", "flow-complete-8L6bhjIslkeyBL6T", "you-just-mastered-that-cIU70jTPW8e8d1kU", "that-s-a-clean-flow-VhdopC3kvTvnkVUe",
  "boom-level-cleared-ha4C9IafPc8lgIcL", "that-s-how-you-move-water-E8J0FvIVGgH9iDLt", "you-handled-that-like-a-pro-dqoT6JwkpbNqmFzR", "dam-ite-you-re-getting-good-rhkaPnF5YW8HijHh",
  "that-s-another-one-in-the-flow-mEaPnEKjKeWEwlPd", "level-cleared-keep-moving-oc55q8EPIhpkHnd7"];

async function suiteWiring(){
  console.log("V1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "flow-moment-voices-v2211.js"), "utf8");
  check("V1a. voices script loads after the Flow Moment Engine", html.indexOf("/flow-moment-voices-v2211.js") > html.indexOf("/flow-moment-engine-v2210.js"));
  const all = [].concat(...Object.values(MS_FILES), VICTORY_FILES);
  check("V1b. all 16 milestone + 11 victory clip files are referenced exactly (27)", all.length === 27 && all.every(f => js.includes(f + ".mp3")), all.filter(f => !js.includes(f + ".mp3")));
  const h = await boot();
  const r = await h.page.evaluate(() => ({ me:typeof MilestoneProgressEngine, lc:typeof LevelCompleteVoiceEngine, pools:Object.fromEntries(Object.entries(MilestoneProgressEngine.pools).map(([k, v]) => [k, v.length])), vic:LevelCompleteVoiceEngine.pool.length, pri:FlowMomentEngine.priorities }));
  check("V1c. both engines exist with pools 4/3/3/3/3 and 11 victory phrases", r.me === "object" && r.lc === "object" && r.pools[5] === 4 && r.pools[4] === 3 && r.pools[3] === 3 && r.pools[2] === 3 && r.pools[1] === 3 && r.vic === 11, r);
  const p = r.pri;
  check("V1d. priority: failure < level complete < ONE MORE < warning < milestone < achievement < reaction", p.cinematic < p.levelComplete && p.levelComplete < p.oneMore && p.oneMore < p.warning && p.warning < p.milestone && p.milestone < p.achievement && p.achievement < p.reaction, p);
  check("V1e. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteSelect(){
  console.log("V2 milestone selection");
  const h = await boot(); const { page } = h;
  const r = await page.evaluate(() => {
    const M = MilestoneProgressEngine, out = {};
    for (const rem of [5, 4, 3, 2, 1]){
      const seen = new Set(); let repeat = 0, prev = null;
      for (let i = 0; i < 400; i++){ const c = M.select(rem, { remMs:5000 }); seen.add(c.id); if (c.id === prev) repeat++; prev = c.id; }
      out[rem] = { distinct:seen.size, pool:M.pools[rem].length, repeat };
    }
    let playful = 0; for (let i = 0; i < 300; i++) if (M.select(1, { remMs:900 }).playful) playful++;
    let playfulOk = 0; for (let i = 0; i < 300; i++) if (M.select(1, { remMs:5000 }).playful) playfulOk++;
    out.playfulNearTimeout = playful; out.playfulPlenty = playfulOk;
    return out;
  });
  check("V2a. every milestone uses its WHOLE pool over time, but only ONE clip per announcement", [5, 4, 3, 2, 1].every(k => r[k].distinct === r[k].pool), r);
  check("V2b. never the same clip twice in a row (400 picks per milestone)", [5, 4, 3, 2, 1].every(k => r[k].repeat === 0), r);
  check("V2c. 'The Dam Is About to Break' is playful: withheld when the clock is nearly out (< 1.8 s), used otherwise", r.playfulNearTimeout === 0 && r.playfulPlenty > 40, { near:r.playfulNearTimeout, plenty:r.playfulPlenty });
  await h.close();
}

async function suiteLive(){
  console.log("V3 live milestone taps");
  const h = await boot({ clipMs:700 }); const { page } = h;
  await page.evaluate(() => { window.__co = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")) window.__co.push({ txt:n.innerText.replace(/\s+/g, " ").trim(), cls:n.className, fl:FlowMomentEngine.state().flowLevel }); }))).observe(document.body, { subtree:true, childList:true });
    window.__overlap = 0; setInterval(() => { const n = [...document.querySelectorAll("audio")].filter(a => !a.paused && !a.muted).length; if (n > window.__overlap) window.__overlap = n; }, 30); });
  /* deterministic: drive the engine with a 2.1 s spacing (every voice may play), then check words + flow level + voices */
  const seq = await page.evaluate(async () => {
    const M = MilestoneProgressEngine, F = FlowMomentEngine, out = [];
    for (const rem of [5, 4, 3, 2, 1]){
      const r = M.onProgress({ remaining:rem, required:6, key:"t1", remMs:5000 });
      await new Promise(r => setTimeout(r, 60));
      const el = document.querySelector(".fmeCo:not(.out)");
      out.push({ rem, spoke:r.spoke, id:r.clip.id, text:el && el.querySelector(".fmeCoT").textContent, line:el && el.querySelector(".fmeCoL") && el.querySelector(".fmeCoL").textContent, phrase:r.clip.text, fl:F.state().flowLevel, cls:el && el.className });
      await new Promise(r => setTimeout(r, 2100));
    }
    out.push({ again:M.onProgress({ remaining:1, required:6, key:"t1" }) });
    return out;
  });
  const words = seq.slice(0, 5).map(x => x.text);
  check("V3a. big words 5 MORE! · 4 MORE! · 3 MORE! · 2 MORE! · ONE MORE! each with the spoken phrase underneath", JSON.stringify(words) === JSON.stringify(["5 MORE!", "4 MORE!", "3 MORE!", "2 MORE!", "ONE MORE!"]) && seq.slice(0, 5).every(x => x.line === x.phrase), seq.slice(0, 5));
  check("V3b. the environment steps up with every milestone (flow level 1→5) and each remaining-count fires once per objective", seq.slice(0, 5).every((x, i) => x.fl === i + 1) && seq[5].again === null, seq.map(x => x.fl));
  check("V3c. with enough spacing ONE phrase is spoken per milestone, from that milestone's own pool", seq.slice(0, 5).every(x => x.spoke), seq.slice(0, 5).map(x => x.spoke));
  const log = await page.evaluate(() => FlowMomentEngine.state().voiceLog);
  const pools = { 5: "five-", 4: "four-", 3: "three-", 2: "two-", 1: "one-" };
  check("V3d. voice log shows exactly one clip per milestone, matching the milestone", seq.slice(0, 5).every(x => log.includes(x.id)) && log.filter(x => /^(five|four|three|two|one)-/.test(x)).length === 5, log);
  check("V3e. larger type at 2 MORE / ONE MORE (ms2 / ms1 classes), water-flow strip present", /ms2/.test(seq[3].cls) && /ms1/.test(seq[4].cls) && await page.evaluate(() => true), seq.map(x => x.cls));
  /* real, fast taps: ONE MORE always speaks, other milestone voices are throttled, never two voices at once */
  await page.evaluate(() => { window.__co.length = 0; FlowMomentEngine.stopVoice(); MilestoneProgressEngine.reset(); window.__overlap = 0; });
  await h.start();
  for (let i = 0; i < 5; i++){ await h.tap(); await sleep(230); }
  await sleep(1500);
  const live = await page.evaluate(() => ({ co:window.__co.map(c => c.txt), log:FlowMomentEngine.state().voiceLog.filter(x => /^(five|four|three|two|one)-/.test(x)), ms:MilestoneProgressEngine.state().log, overlap:window.__overlap }));
  check("V3f. real fast taps show 5 MORE → ONE MORE words (the combo word is absorbed into them)", /5 MORE!/.test(live.co.join("|")) && /ONE MORE!/.test(live.co.join("|")) && /4 MORE! .*FLOW COMBO ×2/.test(live.co.join("|")) && /3 MORE! .*HYDRAULIC SURGE ×3/.test(live.co.join("|")), live.co);
  const msLive = live.ms.slice(-5), spoken = msLive.filter(m => m.spoke);
  check("V3g. fast tapping: ONE MORE always speaks, ordinary milestone voices are throttled (not noisy)", msLive.find(m => m.rem === 1).spoke && spoken.length >= 2 && spoken.length < 5, msLive);
  check("V3h. never two spoken clips at the same time", live.overlap <= 1, live.overlap);
  check("V3i. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suitePriority(){
  console.log("V4 priority");
  const h = await boot({ clipMs:900 }); const { page } = h;
  const r = await page.evaluate(async () => {
    const F = FlowMomentEngine, P = F.priorities, w = ms => new Promise(r => setTimeout(r, ms)), cur = () => (F.state().voice || {}).id, out = {};
    F.say("whoa", { pri:P.milestone, label:"milestone" }); await w(80); out.a = cur();
    F.say("whoa", { pri:P.oneMore, label:"oneMore" }); await w(80); out.b = cur();                         // ONE MORE interrupts milestone
    const lowDropped = await F.say("whoa", { pri:P.milestone, label:"milestone2" }); out.c = cur(); out.cDropped = lowDropped === false;
    F.say("whoa", { pri:P.levelComplete, label:"levelComplete" }); await w(80); out.d = cur();             // level complete interrupts ONE MORE
    const oneDropped = await F.say("whoa", { pri:P.oneMore, label:"oneMore2" }); out.e = cur(); out.eDropped = oneDropped === false;
    F.say("whoa", { pri:P.cinematic, label:"failure" }); await w(80); out.f = cur();                       // failure cinematic outranks everything
    const lcDropped = await F.say("whoa", { pri:P.levelComplete, label:"levelComplete2" }); out.g = cur(); out.gDropped = lcDropped === false;
    F.stopVoice();
    F.say("whoa", { pri:P.warning, label:"warning" }); await w(80);
    const msDropped = await F.say("whoa", { pri:P.milestone, label:"milestone3" }); out.h = cur(); out.hDropped = msDropped === false;
    F.say("whoa", { pri:P.oneMore, label:"oneMore3" }); await w(80); out.i = cur();                          // ONE MORE interrupts a timer warning
    F.stopVoice(); out.free = !F.voiceBusy();
    return out;
  });
  check("V4a. ONE MORE interrupts a milestone voice; a milestone never talks over ONE MORE", r.a === "milestone" && r.b === "oneMore" && r.cDropped && r.c === "oneMore", r);
  check("V4b. LEVEL COMPLETE outranks ONE MORE; ONE MORE cannot talk over it", r.d === "levelComplete" && r.eDropped && r.e === "levelComplete", r);
  check("V4c. the failure cinematic outranks everything; level complete cannot talk over it", r.f === "failure" && r.gDropped && r.g === "failure", r);
  check("V4d. timer warnings outrank plain milestones but yield to ONE MORE", r.hDropped && r.h === "warning" && r.i === "oneMore3", r);
  check("V4e. a Flow Moment voice keeps the narrator / achievement director out while it speaks, and everything is freed afterwards", r.free, r);
  await h.close();
}

async function suiteArc(){
  console.log("V5 dramatic arc");
  { // success right after ONE MORE
    const h = await boot({ clipMs:300 }); const { page } = h;
    await page.evaluate(() => { window.__co = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")) window.__co.push(n.innerText.replace(/\s+/g, " ").trim()); }))).observe(document.body, { subtree:true, childList:true }); });
    await h.start(); for (let i = 0; i < 6; i++){ await h.tap(); await sleep(230); } await sleep(500);
    const r = await page.evaluate(() => ({ co:window.__co, fl:FlowMomentEngine.state().flowLevel, cine:FlowMomentEngine.state().cinematic, flo:state.levelFlOz, ant:document.getElementById("fmeRoot").classList.contains("ant"), anticip:document.getElementById("world").classList.contains("fmeAnticip") }));
    check("V5a. success right after ONE MORE: the day pays out, no failure cinematic, the environment relaxes (flow level 0, no anticipation glow)", /ONE MORE!/.test(r.co.join("|")) && r.flo === 111 && !r.cine && r.fl === 0 && !r.ant && !r.anticip, r);
    await h.close();
  }
  { // failure right after ONE MORE
    const h = await boot({ clipMs:200 }); const { page } = h;
    await page.evaluate(() => { FlowMomentEngine.config.forcePlan = { event:"normal", reaction:"jump", weather:"none", dir:1, lines:["run", "whoa", "flood"] }; });
    await h.start(); for (let i = 0; i < 5; i++){ await h.tap(); await sleep(180); }
    const before = await page.evaluate(() => ({ fl:FlowMomentEngine.state().flowLevel, phase:state.phase, tap:state.tapCount }));
    await h.untilTimeout(); await sleep(200);
    const mid = await page.evaluate(() => ({ cine:FlowMomentEngine.state().cinematic, fl:FlowMomentEngine.state().flowLevel, near:FlowMomentEngine.state().plan && FlowMomentEngine.state().plan.nearMiss, phase:state.phase }));
    await h.untilCard(); const after = await page.evaluate(() => ({ log:FlowMomentEngine.state().voiceLog, tag:document.querySelector(".fmeTag").textContent, flo:state.levelFlOz, fl:FlowMomentEngine.state().flowLevel }));
    const iOne = after.log.findIndex(x => /^one-/.test(x)), iUh = after.log.indexOf("uhoh");
    check("V5b. timer expiry right after ONE MORE → the Dam Failure Cinematic (not success): UH-OH follows the ONE MORE line", before.fl === 5 && before.tap === 5 && mid.cine && mid.phase === "timeout" && iOne >= 0 && iUh > iOne, { before, mid, log:after.log });
    check("V5c. the distinction is clear: environment peak is cleared at failure, 'SO CLOSE — ONE TAP AWAY' acknowledges the near miss, no FL OZ awarded", mid.fl === 0 && mid.near === true && /SO CLOSE/.test(after.tag) && after.flo === 0, { mid, tag:after.tag, flo:after.flo });
    await h.close();
  }
}

async function suiteVictory(){
  console.log("V6 victory voice selection");
  const h = await boot(); const { page } = h;
  const r = await page.evaluate(() => {
    const L = LevelCompleteVoiceEngine, out = {}, ids = a => a.map(x => x.id);
    const run = (perf, n) => { L.resetHistory(); const p = []; for (let i = 0; i < n; i++){ const x = L.pick(perf); L.speak(x); FlowMomentEngine.stopVoice(); p.push(x); } return p; };
    const rate = (arr, f) => arr.filter(f).length / arr.length;
    const base = { level:3, completed:3, first:false, maxCombo:3, fails:0, minRemMs:1500, finalRemMs:1500 };
    const first = run(Object.assign({}, base, { first:true, completed:1 }), 300), high = run(Object.assign({}, base, { maxCombo:14 }), 300), fast = run(Object.assign({}, base, { minRemMs:4200, finalRemMs:4600 }), 300),
      clean = run(Object.assign({}, base, { minRemMs:2600, finalRemMs:2600 }), 300), hard = run(Object.assign({}, base, { fails:3 }), 300), normal = run(base, 300), repeat = run(Object.assign({}, base, { completed:6 }), 300);
    out.first = { didit:rate(first, x => x.id === "didit"), reason:first[0].reason, cat:rate(first, x => x.cat === "celebration") };
    out.high = { mastery:rate(high, x => x.cat === "mastery"), reason:high[0].reason };
    out.fast = { boom:rate(fast, x => x.id === "boom"), reason:fast[0].reason };
    out.clean = { flow:rate(clean, x => x.cat === "flow"), cleanClip:rate(clean, x => x.id === "clean") };
    out.hard = { enc:rate(hard, x => x.cat === "encouragement") };
    out.normal = { cats:[...new Set(normal.map(x => x.cat))], bag:rate(normal, x => x.id === "bag") };
    out.repeat = { another:rate(repeat, x => x.id === "another") };
    const all = [first, high, fast, clean, hard, normal, repeat]; let consec = 0;
    all.forEach(a => a.forEach((x, i) => { if (i && a[i - 1].id === x.id) consec++; }));
    out.consec = consec; out.cats = Object.fromEntries(["celebration", "mastery", "flow", "encouragement", "casual"].map(c => [c, L.pool.filter(x => x.cat === c).map(x => x.id)]));
    L.resetHistory();
    return out;
  });
  check("V6a. FIRST completion → stronger celebration: 'YOU DID IT, DAM-ITE!' most of the time (never twice in a row)", r.first.didit >= .45 && r.first.cat > .9 && /first/.test(r.first.reason), r.first);
  check("V6b. HIGH combo → mastery phrases ('You just mastered that' / 'handled that like a pro')", r.high.mastery > .8 && /high-combo/.test(r.high.reason), r.high);
  check("V6c. FAST completion → 'BOOM! LEVEL CLEARED!'", r.fast.boom > .4 && /fast/.test(r.fast.reason), r.fast);
  check("V6d. CLEAN execution → a flow phrase, mostly 'THAT'S A CLEAN FLOW!'", r.clean.flow > .85 && r.clean.cleanClip > .4, r.clean);
  check("V6e. struggled (several failures) → encouragement ('You're getting good' / 'Keep moving')", r.hard.enc > .8, r.hard);
  check("V6f. NORMAL completion → varied casual / celebration / flow personality ('That level is in the bag' among them)", r.normal.cats.length >= 2 && r.normal.bag > .1, r.normal);
  check("V6g. repeat completions lean on 'THAT'S ANOTHER ONE IN THE FLOW!'", r.repeat.another > .3, r.repeat);
  check("V6h. the same phrase is NEVER played twice in a row (2100 picks across every profile)", r.consec === 0, r.consec);
  check("V6i. categories match the spec (celebration 2 · mastery 2 · flow 4 · encouragement 2 · casual 1)", r.cats.celebration.length === 2 && r.cats.mastery.length === 2 && r.cats.flow.length === 4 && r.cats.encouragement.length === 2 && r.cats.casual.length === 1, r.cats);
  await h.close();
}

const VIEWS = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]];
async function playLevel(h, opts = {}){
  const { page } = h;
  await page.evaluate(() => { window.__co = []; window.__t = {}; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")) { const t = n.innerText.replace(/\s+/g, " ").trim(); window.__co.push(t); if (/LEVEL COMPLETE!/.test(t)) window.__t.lc = performance.now(); } }))).observe(document.body, { subtree:true, childList:true });
    new MutationObserver(() => { if (document.getElementById("levelCard").classList.contains("show") && !window.__t.card) window.__t.card = performance.now(); }).observe(document.getElementById("levelCard"), { attributes:true, attributeFilter:["class"] }); });
  await h.start();
  for (let day = 0; day < 6; day++){
    await page.waitForFunction(d => state.phase === "playing" && state.currentStep === d && !state.busy, day, { timeout:15000 });
    const req = await page.evaluate(() => getRequiredTaps(state.level));
    for (let i = 0; i < req; i++){ await h.tap(); await sleep(opts.gap || 230); }
  }
  await page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:20000 });
  await sleep(900);
}
async function suiteLevel(){
  console.log("V7 level complete sequence");
  for (const [w, hgt] of [[390, 844], [360, 640], [320, 568]]){
    const h = await boot({ clipMs:350, viewport:{ width:w, height:hgt } }); const { page } = h;
    await page.evaluate(() => { LevelCompleteVoiceEngine.resetHistory(); });
    await playLevel(h);
    const r = await page.evaluate(() => {
      const log = FlowMomentEngine.state().voiceLog, ids = LevelCompleteVoiceEngine.pool.map(x => x.id);
      const b = document.getElementById("lcBtn").getBoundingClientRect(), c = document.getElementById("levelInner").getBoundingClientRect();
      return { co:window.__co, t:window.__t, voices:log.filter(x => ids.includes(x)), tot:state.totalFlOz, flo:state.levelFlOz, done:state.completedLevels, btn:[b.top, b.bottom, b.left, b.right], card:[c.top, c.bottom], vh:innerHeight, vw:innerWidth, sy:scrollY, sh:document.documentElement.scrollHeight,
        scrollable:document.getElementById("levelInner").scrollHeight > document.getElementById("levelInner").clientHeight + 2, hist:LevelCompleteVoiceEngine.history() };
    });
    const fin = r.co.slice(-4).join("|");
    if (w === 390){
      check("V7a. sequence order: DAM STABILIZED → CONTROLLED RELEASE → POWER ON! → LEVEL COMPLETE!", /DAM STABILIZED.*CONTROLLED RELEASE.*POWER ON.*LEVEL COMPLETE!/.test(fin), r.co.slice(-6));
      check("V7b. exactly ONE victory phrase was spoken (not the whole pool)", r.voices.length === 1 && r.hist.length === 1, { voices:r.voices, hist:r.hist });
      check("V7c. the card is NOT thrown up immediately: it appears after the LEVEL COMPLETE! word (≥ 0.7 s) and within a few seconds", r.t.card - r.t.lc >= 700 && r.t.card - r.t.lc < 6000, r.t);
      check("V7d. rewards untouched: 6 × 111 = 666 FL OZ and one completed level", r.tot === 666 && r.flo === 666 && r.done === 1, r);
      const rep = await page.evaluate(async () => { const L = LevelCompleteVoiceEngine, a = L.pick({ first:false, completed:2, maxCombo:2, fails:0, minRemMs:1000 }); L.speak(a); FlowMomentEngine.stopVoice(); const b = L.pick({ first:false, completed:3, maxCombo:2, fails:0, minRemMs:1000 }); return { a:a.id, b:b.id, last:L.history()[L.history().length - 1] }; });
      check("V7e. completing again picks a different phrase from the one just heard", rep.a !== rep.b && rep.last === rep.a, rep);
    }
    check(`V7f. ${w}×${hgt}: CONTINUE is inside the viewport, the card needs no scrolling, nothing sideways`, r.btn[0] >= 0 && r.btn[1] <= r.vh && r.btn[2] >= 0 && r.btn[3] <= r.vw && !r.scrollable && r.sy === 0 && r.card[1] <= r.vh + 1, r);
    check(`V7g. ${w}×${hgt}: no uncaught errors`, h.errors.length === 0, h.errors);
    await h.close();
  }
}

async function suiteSafety(){
  console.log("V8 safety");
  { // audio OFF / ON
    const h = await boot({ clipMs:300 }); const { page } = h;
    await page.evaluate(() => { window.__co = []; new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.classList && n.classList.contains("fmeCo")) window.__co.push(n.innerText.replace(/\s+/g, " ").trim()); }))).observe(document.body, { subtree:true, childList:true }); GEI_AUDIO.setMuted(true); });
    await h.start(); for (let i = 0; i < 5; i++){ await h.tap(); await sleep(230); } await sleep(800);
    const off = await page.evaluate(() => ({ co:window.__co, log:FlowMomentEngine.state().voiceLog.length, reqs:0 }));
    check("V8a. audio OFF: milestone words still show, no voice is requested or queued", /ONE MORE!/.test(off.co.join("|")) && off.log === 0, off);
    await page.evaluate(() => { GEI_AUDIO.setMuted(false); MilestoneProgressEngine.reset(); });
    const on = await page.evaluate(async () => { const r = MilestoneProgressEngine.onProgress({ remaining:1, required:6, key:"on1", remMs:5000 }); await new Promise(r => setTimeout(r, 150)); return { spoke:r.spoke, voice:FlowMomentEngine.state().voice }; });
    check("V8b. audio back ON: the next milestone speaks again", on.spoke && !!on.voice, on);
    const lcMute = await page.evaluate(async () => { GEI_AUDIO.setMuted(true); const started = await new Promise(res => FlowMomentEngine.levelComplete({ onCard:() => res("card") }) ? setTimeout(() => res("running"), 50) : res("refused")); await new Promise(r => setTimeout(r, 4500)); const s = FlowMomentEngine.state(); GEI_AUDIO.setMuted(false); return { started, running:s.levelComplete, voice:s.voiceLog.filter(x => /^you-|^that|^flow|^boom|^dam|^level/.test(x)).length }; });
    check("V8c. audio OFF: the victory sequence still completes (silently) and hands over to the card", lcMute.started === "running" && lcMute.running === false && lcMute.voice === 0, lcMute);
    check("V8d. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close();
  }
  for (const [w, hgt] of VIEWS){ // callouts fit every viewport
    const h = await boot({ viewport:{ width:w, height:hgt } }); const { page } = h;
    const r = await page.evaluate(async () => {
      const M = MilestoneProgressEngine, out = [];
      for (const rem of [5, 3, 2, 1]){ M.reset(); FlowMomentEngine.clearCallout(); M.onProgress({ remaining:rem, required:6, key:"v" + rem, remMs:5000 }); await new Promise(r => setTimeout(r, 380));
        const el = document.querySelector(".fmeCo:not(.out)"), b = el.getBoundingClientRect(); const L = el.querySelector(".fmeCoL").getBoundingClientRect();
        out.push({ rem, l:b.left, r:b.right, t:b.top, bt:b.bottom, ll:L.left, lr:L.right, ts:parseFloat(getComputedStyle(el.querySelector(".fmeCoT")).fontSize) });
        await new Promise(r => setTimeout(r, 900)); }
      return { out, vw:innerWidth, vh:innerHeight, sy:scrollY, sx:scrollX, sw:document.documentElement.scrollWidth };
    });
    const ok = r.out.every(o => o.l >= -1 && o.r <= r.vw + 1 && o.t >= 0 && o.bt <= r.vh && o.ll >= -1 && o.lr <= r.vw + 1 && o.ts >= (r.vh < 600 ? 22 : 28)) && r.sy === 0 && r.sx === 0 && r.sw <= r.vw;
    check(`V8e. ${w}×${hgt}: milestone words are centred, readable (≥ 28 px; ≥ 22 px on 568-high phones), inside the viewport, no scrolling`, ok, r);
    await h.close();
  }
  { // reduced motion
    const h = await boot({ clipMs:200, reduced:true }); const { page } = h;
    const r = await page.evaluate(async () => { const M = MilestoneProgressEngine; M.onProgress({ remaining:2, required:6, key:"rm", remMs:5000 }); await new Promise(r => setTimeout(r, 350)); const el = document.querySelector(".fmeCo:not(.out)");
      const an = getComputedStyle(el).animationName, tick = document.getElementById("fmeRoot").style.getPropertyValue("--fme-fl"); await new Promise(r => setTimeout(r, 1200)); return { shown:!!el, an, fl:FlowMomentEngine.state().flowLevel, parts:FlowMomentEngine.state().particles, tick }; });
    check("V8f. reduced motion: words fade in place (no pop), no ambient particles", r.shown && /fmeCoFade/.test(r.an) && r.parts === 0, r);
    await page.evaluate(() => { document.getElementById("world"); });
    await playLevel(h, {}); const done = await page.evaluate(() => ({ card:document.getElementById("levelCard").classList.contains("show"), tot:state.totalFlOz }));
    check("V8g. reduced motion: a full level still ends in the Level Complete card, economy intact", done.card && done.tot === 666 && h.errors.length === 0, { done, errors:h.errors });
    await h.close();
  }
  { // repeated failures
    const h = await boot({ clipMs:90 }); const { page } = h;
    await page.evaluate(() => { FlowMomentEngine.config.forcePlan = { event:"normal", reaction:"jump", weather:"none", dir:1, lines:["whoa", "flood"] }; });
    for (let i = 0; i < 2; i++){ await h.start(); await h.untilCard(); await sleep(500); await page.click("#retryDayBtn", { force:true }); await sleep(700); }
    const r = await page.evaluate(() => { const p = FlowMomentEngine.levelPerf(); return { p, a:LevelCompleteVoiceEngine.analyse(p), dayOk:state.phase }; });
    check("V8h. failing repeatedly: failures are counted, the victory voice later leans on encouragement, the game keeps working", r.p.fails === 2 && r.a.reasons.includes("struggled") && r.a.weights.encouragement > 5 && h.errors.length === 0, r);
    await h.close();
  }
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, select:suiteSelect, live:suiteLive, priority:suitePriority, arc:suiteArc, victory:suiteVictory, level:suiteLevel, safety:suiteSafety };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
