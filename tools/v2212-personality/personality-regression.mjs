/* V2.2.12 — GEI PERSONALITY ENGINE regression harness (PersonalityTriggerEngine)
 *
 * Real index.html in headless Chromium (offline; the supplied MP3s are answered with a short generated WAV). Decisions are tested with virtual
 * time via PersonalityTriggerEngine.onEvent(...) (dryRun logs the decision without sound), integration with real taps / failures / levels for real.
 *   P1 wiring       22 supplied clip URLs exact, rarity tiers exactly as specified, priority order
 *   P2 selection    rarity weights, core phrases weighted up, ultra-rare phrases ONLY for their own special triggers, never the same phrase twice
 *   P3 contextual   normal / fast / combo / long streak / low performance / recovery / near-failure / milestones / completion / failure / levels / idle
 *   P4 restraint    cooldown (rarity-scaled), breathing room, per-level cap, no same trigger repeatedly, rapid-fire bursts
 *   P5 priority     never interrupts or overlaps another voice; waits for the lane; blocked in cinematic / level-complete / final push / last seconds
 *   P6 visuals      short callout, the player's OWN selected character, water signature moment (slow-mo then resume), viewports
 *   P7 safety       audio OFF / ON, reduced motion, a whole level with personality forced on
 *
 *   node tools/v2212-personality/personality-regression.mjs [suite]
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

const FILES = ["we-re-too-dam-good-60Q5aHYH8r8g5qiU", "no-dry-spells-allowed-oaV0vBUBca4z0EZ0", "you-came-to-flow-Ol63xxQkOsrQBAf2", "that-dam-didn-t-stand-a-chance-u4d8uBTBVmFPBWxS", "the-water-knows-your-name-VA57ZfRXQXJYebfZ",
  "look-at-you-go-wmERKIbIu68vOa4s", "you-re-making-this-look-easy-AFJQkJ1kUgpx2hby", "who-gave-you-all-that-power-cwQLRisTu0mq9NSU", "now-that-s-what-i-call-flow-VWLTMkAUogTDCCVN", "well-dam-TQ8RWyvFkpr6FDT4",
  "oh-that-s-dam-good-XOHgsyY7J1lT6TdS", "now-that-s-some-serious-flow-L2Ux7yJHkKV3s79Y", "you-re-in-the-flow-rzLW4VwLhFmBKDOk", "keep-that-dam-flow-moving-JSEyCxp7j40caFiJ", "let-s-go-dam-ite-OInFVuDhoB0Hw2j2",
  "oh-yeah-that-water-s-moving-dK4mg1G5HKVqM5ho", "you-just-powered-that-up-g1yIwtOv8RXf7McB", "that-s-how-we-do-it-in-the-flow-Zomtp29d93xGEmX1", "look-at-you-moving-water-PUmxfoqjV3eCL4h7", "you-re-building-momentum-czKiaMG5tuxTnt2G",
  "the-flow-doesn-t-stop-mNkR970wwL5NkXYr", "keep-it-dam-moving-DWe4dvEN6F6vWvZn"];
/* a fresh engine in dry-run with generous cooldowns unless a test says otherwise; virtual clock via ts */
const SETUP = (cfg) => { const P = PersonalityTriggerEngine; P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => 0; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0; P.config.maxPerDay = 99; P.config.maxPerLevel = 99; Object.assign(P.config, cfg || {}); };

async function suiteWiring(){
  console.log("P1 wiring");
  const html = await readFile(join(root, "index.html"), "utf8"), js = await readFile(join(root, "flow-moment-personality-v2212.js"), "utf8");
  check("P1a. personality script loads after the milestone / victory voices", html.indexOf("/flow-moment-personality-v2212.js") > html.indexOf("/flow-moment-voices-v2211.js"));
  check("P1b. all 22 supplied clips (10 playful + 12 core signature) are referenced exactly", FILES.length === 22 && FILES.every(f => js.includes(f + ".mp3")), FILES.filter(f => !js.includes(f + ".mp3")));
  const h = await boot();
  const r = await h.page.evaluate(() => { const P = PersonalityTriggerEngine, by = r => P.phrases.filter(p => p.rarity === r).map(p => p.id).sort(), core = P.phrases.filter(p => p.core).length;
    return { n:P.phrases.length, core, common:by("common"), uncommon:by("uncommon"), rare:by("rare"), ultra:by("ultra"), pri:FlowMomentEngine.priorities, vocab:P.vocabulary }; });
  check("P1c. 12 core signature + 10 playful phrases", r.n === 22 && r.core === 12, { n:r.n, core:r.core });
  check("P1d. RARE = Who Gave You All That Power · Making This Look Easy · That Dam Didn't Stand a Chance · We're Too DAM Good", JSON.stringify(r.rare) === JSON.stringify(["dam-didnt", "easy", "too-dam-good", "who-gave"]), r.rare);
  check("P1e. ULTRA-RARE = The Water Knows Your Name · Well DAM · No Dry Spells Allowed", JSON.stringify(r.ultra) === JSON.stringify(["no-dry", "water-knows", "well-dam"]), r.ultra);
  const spec = { common:["in-the-flow", "keep-flow", "momentum", "moving-water"], uncommon:["serious-flow", "powered-up", "how-we-do", "water-moving"] };
  check("P1f. COMMON and UNCOMMON tiers include every phrase the spec lists", spec.common.every(x => r.common.includes(x)) && spec.uncommon.every(x => r.uncommon.includes(x)), r);
  const p = r.pri;
  check("P1g. priority: failure < level complete < ONE MORE < milestone < achievement < PERSONALITY < character reaction", p.cinematic < p.levelComplete && p.levelComplete < p.oneMore && p.oneMore < p.milestone && p.milestone < p.achievement && p.achievement < p.personality && p.personality < p.reaction, p);
  check("P1h. GEI vocabulary is carried by the phrases (DAM-ITE · FLOW · DAM · WATER · MOMENTUM · POWER · MOVING WATER · KEEP IT MOVING)", await h.page.evaluate(() => { const t = PersonalityTriggerEngine.phrases.map(x => x.text).join(" "); return ["DAM-ITE", "FLOW", "DAM", "WATER", "MOMENTUM", "POWER", "MOVING WATER", "MOVING"].every(w => t.includes(w)); }));
  check("P1i. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteSelect(){
  console.log("P2 selection");
  const h = await boot(); const { page } = h;
  const r = await page.evaluate(() => {
    const P = PersonalityTriggerEngine; P.reset(); localStorage.removeItem("geiPersonalityHeardV1");
    const kinds = ["start", "levelup", "burst", "flow", "combo", "momentum", "power", "clean", "streak", "great", "move", "impressive", "recover", "return", "surprise", "epic", "idle"], out = { ultraLeak:0, byRarity:{ common:0, uncommon:0, rare:0, ultra:0 }, core:0, play:0, consec:0 }, ultra = { "well-dam":"surprise", "water-knows":"epic", "no-dry":"idle" };
    let prev = null;
    for (let i = 0; i < 20000; i++){ const k = kinds[i % kinds.length], p = P.pick(k, 1); if (!p) continue;
      if (ultra[p.id] && ultra[p.id] !== k) out.ultraLeak++; if (!["surprise", "epic", "idle"].includes(k)) out.byRarity[p.rarity]++; if (p.core) out.core++; else out.play++; if (prev === p.id && i % kinds.length === 0) out.consec++; prev = p.id; }
    /* strength gate: weak moments never produce RARE phrases */
    let weakRare = 0; for (let i = 0; i < 3000; i++){ const p = P.pick("burst", .3); if (p && p.rarity === "rare") weakRare++; }
    let strongRare = 0; for (let i = 0; i < 3000; i++){ const p = P.pick("burst", 1); if (p && p.rarity === "rare") strongRare++; }
    /* the same phrase twice in a row can never happen through the engine itself */
    P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => Math.random(); P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0; P.config.maxPerDay = 99; P.config.maxPerLevel = 99;
    let ts = 1e6, same = 0, fired = 0, last = ""; for (let i = 0; i < 800; i++){ ts += 3000; const e = P.consider(["combo", "power", "burst"][i % 3], 1, { ts, remMs:5000, force:true, special:true }); if (e && e.id){ fired++; if (e.id === last) same++; last = e.id; } }
    out.weakRare = weakRare; out.strongRare = strongRare; out.fired = fired; out.same = same; P.config.dryRun = false; P.config.rng = null; return out;
  });
  const t = r.byRarity, tot = t.common + t.uncommon + t.rare + t.ultra;
  check("P2a. ULTRA-RARE phrases (Water Knows Your Name · Well DAM · No Dry Spells) appear ONLY for their own special triggers", r.ultraLeak === 0, r);
  check("P2b. rarity is real: common > uncommon > rare, and the ultra-rare tier is a tiny fraction", t.common > t.uncommon && t.uncommon > t.rare && t.ultra / tot < .12, t);
  check("P2c. weak moments never earn a RARE phrase; strong ones sometimes do", r.weakRare === 0 && r.strongRare > 100, { weak:r.weakRare, strong:r.strongRare });
  check("P2d. core signature phrases outnumber the playful pool (the recognisable GEI voice)", r.core > r.play, { core:r.core, play:r.play });
  check("P2e. the same phrase is never played twice in a row (800 decisions)", r.fired > 300 && r.same === 0, r);
  await h.close();
}

/* helper: run a sequence of events in dry-run with a virtual clock */
async function decide(page, script){
  return page.evaluate(async (script) => {
    const P = PersonalityTriggerEngine, F = FlowMomentEngine; const out = []; let ts = 5e6;
    for (const s of script){
      if (s.setup) SETUP_FN(s.setup);
      if (s.flow !== undefined) F.setFlowLevel(s.flow);
      if (s.wait) ts += s.wait;
      if (s.type){ ts = s.at != null ? s.at : ts; const before = P.state().log.length; P.onEvent(s.type, Object.assign({ ts }, s.d || {})); const log = P.state().log; out.push({ type:s.type, fired:log.length > before ? log[log.length - 1] : null }); ts += s.after || 0; }
    }
    return out;
  }, script);
}
const SETUP_SRC = `window.SETUP_FN = (cfg) => { const P = PersonalityTriggerEngine; P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => 0; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0; P.config.maxPerDay = 99; P.config.maxPerLevel = 99; Object.assign(P.config, cfg || {}); try { FlowMomentEngine.setFlowLevel(0); } catch (e) {} };`;
const tapSeq = (ivs, base = {}) => ivs.map(iv => ({ type:"tap", wait:iv, d:Object.assign({ required:12, remaining:9, index:2, remMs:5000, streak:2 }, base) }));

async function suiteContext(){
  console.log("P3 contextual triggers");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  /* 1 normal tapping */
  let r = await decide(page, [{ setup:{} }, ...tapSeq([350, 360, 340, 355, 350, 345], { remaining:7, streak:2 })]);
  check("P3a. NORMAL tapping (steady ~350 ms, small combo) stays quiet — the game does not chatter", r.every(x => !x.fired), r.filter(x => x.fired));
  /* 2 fast tapping: baseline 330 ms, then a sudden acceleration */
  r = await decide(page, [{ setup:{} }, ...tapSeq([330, 340, 335, 330, 335, 120, 115, 110, 105], { remaining:6, streak:4 })]);
  let f = r.find(x => x.fired);
  check("P3b. FAST tapping (sudden acceleration vs the player's own pace) → 'burst' → WHO GAVE YOU ALL THAT POWER? family", f && f.fired.kind === "burst" && ["who-gave", "look-go", "easy", "moving-water"].includes(f.fired.id), r.map(x => x.fired && x.fired.id));
  /* 3 high combo */
  r = await decide(page, [{ setup:{} }, ...tapSeq([300, 300, 300], { streak:9, remaining:4 })]);
  f = r.find(x => x.fired);
  check("P3c. HIGH combo (×9) → 'combo' → NOW THAT'S SOME SERIOUS FLOW / what I call flow / building momentum", f && f.fired.kind === "combo" && ["serious-flow", "what-i-call", "momentum"].includes(f.fired.id), f && f.fired);
  /* 4 long streak: three clean days in a row */
  r = await decide(page, [{ setup:{} }, { type:"start" }, ...[0, 1, 2].flatMap(i => [...tapSeq([300, 300, 300, 300, 300], { index:i }), { type:"day", wait:200, d:{ index:i, remMs:1800, closeCall:false, streak:5, maxStreak:5 } }, { type:"start", wait:100 }])]);
  const days = r.filter(x => x.type === "day").map(x => x.fired && x.fired.kind);
  check("P3d. LONG streak (3 clean days in a row) → 'streak' → THE FLOW DOESN'T STOP / serious flow", days[2] === "streak" || days.includes("streak"), days);
  /* 5 low performance: slow taps, day finished with almost no time, no big combo */
  r = await decide(page, [{ setup:{} }, ...tapSeq([700, 760, 720, 800, 750, 780], { remaining:5, streak:1, remMs:3000 })]);
  check("P3e. LOW performance (slow taps, no combo) → no personality", r.every(x => !x.fired), r.filter(x => x.fired));
  /* 6/7 recovery after a mistake + near failure */
  r = await decide(page, [{ setup:{} }, { type:"fail" }, { type:"start", wait:100 }, ...tapSeq([300, 300, 300, 300], { index:1 }), { type:"day", wait:300, d:{ index:1, remMs:3200, closeCall:false, streak:4, maxStreak:4 } }]);
  f = r.find(x => x.type === "day").fired;
  check("P3f. RECOVERY after a mistake: the first success after a failure is acknowledged (recover family, not a random line)", f && f.kind === "recover" && ["look-go", "keep-flow", "keep-dam-moving"].includes(f.id), f);
  r = await decide(page, [{ setup:{} }, { type:"fail" }, { type:"start", wait:100 }, ...tapSeq([300, 300, 300, 300, 300], { index:1 }), { type:"day", wait:300, d:{ index:1, remMs:700, closeCall:true, streak:4, maxStreak:4 } }]);
  f = r.find(x => x.type === "day").fired;
  check("P3g. NEAR-FAILURE success (saved with < 1.2 s) → the comic WELL DAM.", f && f.kind === "surprise" && f.id === "well-dam", f);
  /* 8/9/10 milestone windows: personality stays out of the way of 3 MORE / ONE MORE */
  r = await decide(page, [{ setup:{} }, { flow:3 }, ...tapSeq([330, 330, 330, 330, 120, 115, 110], { remaining:3, streak:4 })]);
  const at3 = r.filter(x => x.fired).length;
  r = await decide(page, [{ setup:{} }, { flow:5 }, ...tapSeq([330, 330, 330, 330, 120, 115, 110, 105], { remaining:1, streak:9 })]);
  const at1 = r.filter(x => x.fired).length;
  check("P3h. final push (2 MORE / ONE MORE) is protected: no personality while the environment is at peak anticipation", at1 === 0, { at1, at3 });
  r = await decide(page, [{ setup:{} }, { flow:2 }, ...tapSeq([330, 330, 330, 330, 120, 115, 110, 105], { remaining:5, streak:4 })]);
  check("P3i. 5 MORE / 3 MORE: personality may speak between milestones (action-driven), never because a timer says so", r.some(x => x.fired) && r.find(x => x.fired).fired.kind === "burst", r.map(x => x.fired && x.fired.id));
  /* 11 clock almost out → silent */
  r = await decide(page, [{ setup:{} }, ...tapSeq([330, 340, 335, 330, 335, 120, 115, 110, 105], { remaining:6, streak:4, remMs:1800 })]);
  check("P3j. near the end of the clock (< 2.5 s) the personality never talks", r.every(x => !x.fired), r.filter(x => x.fired));
  /* 13-15 levels */
  r = await decide(page, [{ setup:{} }, { type:"level", d:{ perf:{ level:1, maxCombo:5, fails:0 } } }, { type:"start", wait:50 }, { type:"tap", wait:500, d:{ required:6, remaining:5, index:0, remMs:5000, streak:1 } }]);
  const first = r[r.length - 1].fired;
  check("P3k. a normal level change → a run-start / level-up line (LET'S GO, DAM-ITE / YOU CAME TO FLOW) on the first tap", first && ["start", "levelup"].includes(first.kind) && ["lets-go", "came-to-flow"].includes(first.id), first);
  r = await decide(page, [{ setup:{} }, { type:"level", d:{ perf:{ level:6, maxCombo:18, fails:0 } } }, { type:"start", wait:50 }, { type:"tap", wait:500, d:{ required:6, remaining:5, index:0, remMs:5000, streak:1 } }]);
  const epic = r[r.length - 1].fired;
  check("P3l. an exceptional / milestone level earns THE WATER KNOWS YOUR NAME at the start of the next run (signature event)", epic && epic.kind === "epic" && epic.id === "water-knows", epic);
  r = await decide(page, [{ setup:{} }, { type:"level", d:{ perf:{ level:2, maxCombo:4, fails:2 } } }, { type:"start", wait:50 }, { type:"tap", wait:500, d:{ required:6, remaining:5, index:0, remMs:5000, streak:1 } }]);
  check("P3m. a struggling level does NOT trigger the signature event", !r[r.length - 1].fired || r[r.length - 1].fired.id !== "water-knows", r[r.length - 1].fired);
  /* rare idle moment: a long pause then the next tap */
  r = await decide(page, [{ setup:{} }, ...tapSeq(Array(14).fill(300), { remaining:3, streak:1, remMs:5000 }), { type:"tap", wait:30000, d:{ required:12, remaining:9, index:2, remMs:5000, streak:1 } }]);
  const idle = r[r.length - 1].fired;
  check("P3n. a rare idle moment (30 s pause, then the player returns) → NO DRY SPELLS ALLOWED", idle && idle.kind === "idle" && idle.id === "no-dry", idle);
  /* surprising speed: finished with almost the whole clock left */
  r = await decide(page, [{ setup:{} }, ...tapSeq([200, 200, 200, 200, 200], { index:1, remaining:7 }), { type:"day", wait:100, d:{ index:1, remMs:5300, closeCall:false, streak:5, maxStreak:5 } }]);
  const sp = r[r.length - 1].fired;
  check("P3o. extremely fast completion → a comic WELL DAM. or a power / impressive line (never silence for a feat)", sp && (sp.id === "well-dam" || ["impressive", "clean", "move", "power"].includes(sp.kind)), sp);
  /* power an element */
  r = await decide(page, [{ setup:{} }, ...tapSeq([300, 300, 300, 300, 300], { index:4, remaining:7 }), { type:"day", wait:100, d:{ index:4, remMs:2000, closeCall:false, streak:3, maxStreak:3 } }]);
  const pw = r[r.length - 1].fired;
  check("P3p. powering a major element (waterwheel) → YOU JUST POWERED THAT UP / that's how we do it", pw && pw.kind === "power" && ["powered-up", "how-we-do"].includes(pw.id), pw);
  check("P3q. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteRestraint(){
  console.log("P4 restraint");
  const h = await boot(); const { page } = h; await page.evaluate(SETUP_SRC);
  const r = await page.evaluate(() => {
    const P = PersonalityTriggerEngine; SETUP_FN({ cooldownMs:{ common:11000, uncommon:15000, rare:22000, ultra:40000 }, minGapMs:7000, minTapsBetween:6, maxPerLevel:4, maxPerDay:1 });
    P.config.rng = () => 0.001;     // every roll passes: only the restraint rules decide
    const out = {}; let ts = 1e7; const fire = (kind, extra) => { ts += extra || 400; const b = P.state().log.length; P.consider(kind, 1, { ts, remMs:5000 }); return P.state().log.length > b ? P.state().log[P.state().log.length - 1] : null; };
    /* breathing room: needs 6 taps between two comments */
    P.onEvent("start", {}); P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => 0.001; P.config.cooldownMs = { common:11000, uncommon:15000, rare:22000, ultra:40000 }; P.config.minGapMs = 7000; P.config.minTapsBetween = 6; P.config.maxPerLevel = 4; P.config.maxPerDay = 9;
    let tt = ts; for (let i = 0; i < 8; i++){ tt += i % 2 ? 650 : 150; P.onEvent("tap", { ts:tt, required:12, remaining:9, index:2, remMs:5000, streak:2 }); } ts = tt;   // irregular taps: gameplay without a personality-worthy moment
    const a = fire("combo"), b = fire("power", 800);
    out.second = !!b;                                       // 0.8 s later: refused (cooldown)
    const c = fire("power", 16000);                          // 16 s later but < 6 taps since → breathing room
    out.noTaps = !!c;
    tt = ts + 17000; for (let i = 0; i < 7; i++){ tt += i % 2 ? 650 : 150; P.onEvent("tap", { ts:tt, required:12, remaining:9, index:2, remMs:5000, streak:2 }); }
    ts = tt + 2000; const d = fire("power", 800);
    out.afterRest = !!d; out.first = !!a;
    /* rarity-scaled rest: a RARE phrase rests longer than a common one */
    P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => 0.001; P.config.cooldownMs = { common:11000, uncommon:15000, rare:22000, ultra:40000 }; P.config.minGapMs = 7000; P.config.minTapsBetween = 0; P.config.maxPerLevel = 99; P.config.maxPerDay = 99;
    const R = P.consider("burst", 1, { ts:2e7, remMs:5000, force:true });       // first fire (any rarity)
    const rest = P.state().lastRarity; const need = P.config.cooldownMs[rest];
    const tooSoon = P.consider("power", 1, { ts:2e7 + need - 500, remMs:5000, force:true, afterDay:true, special:true });
    out.rarityRest = { rest, need, tooSoon: !!tooSoon };
    /* per-level cap + same kind twice */
    P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => 0.001; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0; P.config.maxPerLevel = 4; P.config.maxPerDay = 99;
    let n = 0; ts = 3e7; for (let i = 0; i < 12; i++){ ts += 30000; if (P.consider(["combo", "power", "burst", "clean"][i % 4], 1, { ts, remMs:5000 })) n++; }
    out.levelFires = n;
    const k1 = P.state().kinds;
    out.sameKind = k1.some((k, i) => i && k === k1[i - 1]);
    /* a rapid-fire burst of 60 qualifying events in 100 ms → at most ONE comment */
    P.reset(); P.config.dryRun = true; P.config.requirePlaying = false; P.config.rng = () => 0.001; P.config.maxPerLevel = 99; P.config.cooldownMs = { common:11000, uncommon:15000, rare:22000, ultra:40000 }; P.config.minGapMs = 7000; P.config.minTapsBetween = 0;
    for (let i = 0; i < 60; i++) P.consider(["combo", "burst", "power", "clean"][i % 4], 1, { ts:4e7 + i * 2, remMs:5000, special:true });
    out.rapid = P.state().log.length;
    return out;
  });
  check("P4a. after a phrase the game breathes: a second comment 0.8 s later is refused (cooldown)", r.first && !r.second, r);
  check("P4b. even after the cooldown, a few taps of gameplay are required (breathing room) — then it may speak again", !r.noTaps && r.afterRest, r);
  check("P4c. the rest scales with rarity: a phrase's own cooldown is honoured to the millisecond", r.rarityRest && !r.rarityRest.tooSoon, r.rarityRest);
  check("P4d. per-level cap (4) and never the same trigger twice in a row", r.levelFires <= 4 && !r.sameKind, { fires:r.levelFires, sameKind:r.sameKind });
  check("P4e. a rapid-fire burst of 60 qualifying actions in 100 ms produces at most ONE comment", r.rapid <= 1, r.rapid);
  check("P4f. the cooldown is configurable (PersonalityTriggerEngine.config.cooldownMs / minGapMs / minTapsBetween / maxPerLevel / maxPerDay)", await page.evaluate(() => { const c = PersonalityTriggerEngine.config; return typeof c.cooldownMs === "object" && typeof c.minGapMs === "number" && typeof c.minTapsBetween === "number" && typeof c.maxPerLevel === "number" && typeof c.maxPerDay === "number"; }));
  await h.close();
}

async function suitePriority(){
  console.log("P5 priority + collisions");
  const h = await boot({ clipMs:900 }); const { page } = h; await page.evaluate(SETUP_SRC);
  const r = await page.evaluate(async () => {
    const F = FlowMomentEngine, P = F.priorities, w = ms => new Promise(r => setTimeout(r, ms)), cur = () => (F.state().voice || {}).id, out = {};
    F.say("whoa", { pri:P.milestone, label:"milestone" }); await w(80);
    const dropped = await F.say("hold", { pri:P.personality, polite:true, label:"pers" }); out.dropped = dropped === false; out.stillMilestone = cur() === "milestone";
    F.stopVoice(); F.say("run", { pri:P.reaction, label:"reaction" }); await w(80);
    F.say("hold", { pri:P.personality, polite:true, label:"pers" }); await w(80); out.overReaction = cur() === "pers";      // personality outranks a minor character reaction
    F.stopVoice(); F.say("whoa", { pri:P.personality, polite:true, label:"pers" }); await w(80);
    F.say("hold", { pri:P.milestone, label:"milestone" }); await w(80); out.milestoneBeatsPers = cur() === "milestone";    // and every real-communication voice outranks personality
    F.say("hold", { pri:P.oneMore, label:"oneMore" }); await w(80); out.oneMore = cur() === "oneMore";
    F.stopVoice(); F.say("whoa", { pri:P.personality, label:"pers" }); await w(80); F.say("pressure", { pri:P.warning, label:"warning" }); await w(80); out.warningBeatsPers = cur() === "warning";
    F.stopVoice(); return out;
  });
  check("P5a. personality never interrupts a milestone voice (it is dropped, not mixed)", r.dropped && r.stillMilestone, r);
  check("P5b. personality outranks only the minor character reaction", r.overReaction, r);
  check("P5c. milestone, ONE MORE and timer warnings all interrupt a personality line (critical communication always wins)", r.milestoneBeatsPers && r.oneMore && r.warningBeatsPers, r);
  /* blocked contexts */
  const b = await page.evaluate(async () => {
    const P = PersonalityTriggerEngine, F = FlowMomentEngine, out = {}; SETUP_FN({});
    const tryFire = (ctx) => { const n = P.state().log.length; P.consider("combo", 1, Object.assign({ ts:performance.now(), remMs:5000, force:true }, ctx)); return P.state().log.length > n; };
    F.stopVoice(); await new Promise(r => setTimeout(r, 1100)); out.free = tryFire({});
    SETUP_FN({}); F.setFlowLevel(4); out.finalPush = tryFire({}); F.setFlowLevel(0);
    SETUP_FN({}); out.lastSeconds = tryFire({ remMs:1800 });
    SETUP_FN({}); let ok = false; F.failure({ onCard:() => {} }); await new Promise(r => setTimeout(r, 300)); out.cinematic = tryFire({ afterDay:true }); F.recover();
    SETUP_FN({}); F.levelComplete({ onCard:() => {} }); await new Promise(r => setTimeout(r, 200)); out.levelSeq = tryFire({ afterDay:true }); await new Promise(r => setTimeout(r, 9500));
    return out;
  });
  check("P5d. personality speaks when the game is calm", b.free);
  check("P5e. …but never during the final push (2 MORE / ONE MORE), the last 2.5 s of the clock, the Dam Failure Cinematic or the Level Complete sequence", !b.finalPush && !b.lastSeconds && !b.cinematic && !b.levelSeq, b);
  check("P5f. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

const VIEWS = [[320, 568], [360, 640], [375, 667], [390, 844], [430, 932]];
async function suiteVisual(){
  console.log("P6 visuals");
  for (const [w, hgt] of VIEWS){
    const h = await boot({ viewport:{ width:w, height:hgt } }); const { page } = h;
    const r = await page.evaluate(async () => {
      const P = PersonalityTriggerEngine, out = [];
      for (const id of ["too-dam-good", "who-gave", "in-the-flow", "water-knows", "well-dam"]){ P.show(id); await new Promise(r => setTimeout(r, 420));
        const el = document.querySelector(".fmePers"), b = el.getBoundingClientRect(), t = el.querySelector(".fmePersT").getBoundingClientRect(); out.push({ id, l:b.left, r:b.right, t:b.top, bt:b.bottom, tl:t.left, tr:t.right, fs:parseFloat(getComputedStyle(el.querySelector(".fmePersT")).fontSize), pe:getComputedStyle(el).pointerEvents });
        await new Promise(r => setTimeout(r, 600)); }
      return { out, vw:innerWidth, vh:innerHeight, sy:scrollY, sw:document.documentElement.scrollWidth };
    });
    const ok = r.out.every(o => o.l >= -2 && o.r <= r.vw + 2 && o.t >= 0 && o.bt <= r.vh && o.tl >= -2 && o.tr <= r.vw + 2 && o.fs >= 18 && o.pe === "none") && r.sy === 0 && r.sw <= r.vw;
    check(`P6a. ${w}×${hgt}: personality callouts stay on screen, readable (≥ 18 px), never block taps, no page scroll`, ok, r);
    await h.close();
  }
  const h = await boot({ clipMs:500 }); const { page } = h;
  const r = await page.evaluate(async () => {
    const P = PersonalityTriggerEngine; const before = state.activeCharacter; state.activeCharacter = "yall-too-beaver"; let src = "";
    P.show("look-go"); await new Promise(r => setTimeout(r, 300)); const av = document.querySelector(".fmePers .fmePersAv"); src = av ? av.getAttribute("src") : "";
    const expected = getActiveCharacter().img; const after = state.activeCharacter; state.activeCharacter = before;
    return { src, expected, same:after === "yall-too-beaver", hasAv:!!av };
  });
  check("P6b. the callout shows the player's CURRENTLY SELECTED character and never switches the character back to the default", r.hasAv && r.src === r.expected && r.same, r);
  const sig = await page.evaluate(async () => {
    const calls = []; const orig = Animation.prototype.updatePlaybackRate; Animation.prototype.updatePlaybackRate = function(v){ calls.push(v); return orig.call(this, v); };
    document.getElementById("world").animate([{ opacity:1 }, { opacity:.99 }], { duration:30000 });
    const P = PersonalityTriggerEngine; P.config.dryRun = false; P.config.enabled = true; P.reset();
    P.consider("epic", 1, { ts:performance.now(), afterDay:true, special:true, force:true }); await new Promise(r => setTimeout(r, 400));
    const el = document.querySelector(".fmePers.water"); const hasW = !!el && el.querySelectorAll(".fmePersR").length >= 3 && el.querySelectorAll(".fmePersW").length === 2, slowed = calls.some(v => v < 1);
    await new Promise(r => setTimeout(r, 2300)); const resumed = calls.length > 1 && calls[calls.length - 1] === 1;
    Animation.prototype.updatePlaybackRate = orig; return { hasW, slowed, resumed, calls:calls.slice(0, 6), text:el && el.innerText };
  });
  check("P6c. THE WATER KNOWS YOUR NAME is a signature moment: flowing-water rings + strips, the visual action slows, then resumes", sig.hasW && sig.slowed && sig.resumed && /WATER KNOWS YOUR NAME/.test(sig.text || ""), sig);
  check("P6d. no uncaught errors", h.errors.length === 0, h.errors);
  await h.close();
}

async function suiteSafety(){
  console.log("P7 safety");
  { // audio OFF / ON
    const h = await boot({ clipMs:400 }); const { page } = h;
    const r = await page.evaluate(async () => { const P = PersonalityTriggerEngine, F = FlowMomentEngine; P.reset(); P.config.dryRun = false; P.config.rng = () => 0; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0;
      GEI_AUDIO.setMuted(true); const e1 = P.consider("combo", 1, { ts:performance.now(), remMs:5000, force:true, special:true, afterDay:true }); await new Promise(r => setTimeout(r, 300));
      const off = { entry:!!e1, spoke:e1 && e1.spoke, log:F.state().voiceLog.filter(x => /^pers:/.test(x)).length, visual:!!document.querySelector(".fmePers") };
      GEI_AUDIO.setMuted(false); P.reset(); P.config.rng = () => 0; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0;
      const e2 = P.consider("combo", 1, { ts:performance.now(), remMs:5000, force:true, special:true, afterDay:true }); await new Promise(r => setTimeout(r, 200));
      const on = { entry:!!e2, voice:(F.state().voice || {}).id }; await new Promise(r => setTimeout(r, 700)); on.spoke = e2 && e2.spoke; return { off, on }; });
    check("P7a. audio OFF: no personality voice is requested, the short visual still shows", r.off.entry && !r.off.spoke && r.off.log === 0 && r.off.visual, r.off);
    check("P7b. audio ON: the personality line speaks (and finishes)", r.on.entry && /^pers:/.test(r.on.voice || "") && r.on.spoke === true, r.on);
    check("P7c. no uncaught errors", h.errors.length === 0, h.errors);
    await h.close();
  }
  { // reduced motion
    const h = await boot({ clipMs:200, reduced:true }); const { page } = h;
    const r = await page.evaluate(async () => { const P = PersonalityTriggerEngine; P.reset(); P.config.dryRun = false; P.config.rng = () => 0; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0;
      const calls = []; const orig = Animation.prototype.updatePlaybackRate; Animation.prototype.updatePlaybackRate = function(v){ calls.push(v); return orig.call(this, v); };
      P.consider("epic", 1, { ts:performance.now(), afterDay:true, special:true, force:true }); await new Promise(r => setTimeout(r, 400)); const el = document.querySelector(".fmePers");
      const o = { shown:!!el, anim:el && getComputedStyle(el).animationName, rings:[...document.querySelectorAll(".fmePersR")].filter(x => getComputedStyle(x).display !== "none").length, slow:calls.length, parts:FlowMomentEngine.state().particles }; Animation.prototype.updatePlaybackRate = orig; return o; });
    check("P7d. reduced motion: the line fades in place — no pop, rings, particles or slow-motion", r.shown && /fmeCoFade/.test(r.anim) && r.rings === 0 && r.slow === 0 && r.parts === 0, r);
    await h.close();
  }
  { // a whole level, personality forced on: nothing critical is disturbed
    const h = await boot({ clipMs:350 }); const { page } = h;
    await page.evaluate(() => { const P = PersonalityTriggerEngine; P.config.rng = () => 0; P.config.cooldownMs = { common:3000, uncommon:3000, rare:3000, ultra:3000 }; P.config.minGapMs = 1500; P.config.minTapsBetween = 1; P.config.maxPerDay = 3; P.config.maxPerLevel = 20; LevelCompleteVoiceEngine.resetHistory();
      window.__ov = 0; setInterval(() => { const n = [...document.querySelectorAll("audio")].filter(a => !a.paused && !a.muted).length; if (n > window.__ov) window.__ov = n; }, 25); });
    await playLevel(h);
    const r = await page.evaluate(() => { const log = FlowMomentEngine.state().voiceLog, ids = LevelCompleteVoiceEngine.pool.map(x => x.id); const b = document.getElementById("lcBtn").getBoundingClientRect();
      return { log, pers:log.filter(x => /^pers:/.test(x)).length, victory:log.filter(x => ids.includes(x)).length, oneMore:log.filter(x => /^one-/.test(x)).length, overlap:window.__ov, tot:state.totalFlOz, done:state.completedLevels, btn:[b.top, b.bottom], vh:innerHeight, plog:PersonalityTriggerEngine.state().log.map(x => x.id) }; });
    check("P7e. a whole level with personality forced on: never two voices at once, ONE MORE and the victory voice still play, rewards intact, CONTINUE reachable", r.overlap <= 1 && r.oneMore >= 1 && r.victory === 1 && r.tot === 666 && r.done === 1 && r.btn[1] <= r.vh && h.errors.length === 0, r);
    await h.close();
  }
  { // failure with personality on: cinematic order untouched
    const h = await boot({ clipMs:200 }); const { page } = h;
    await page.evaluate(() => { const P = PersonalityTriggerEngine; P.config.rng = () => 0; P.config.cooldownMs = { common:0, uncommon:0, rare:0, ultra:0 }; P.config.minGapMs = 0; P.config.minTapsBetween = 0; FlowMomentEngine.config.forcePlan = { event:"normal", reaction:"jump", weather:"none", dir:1, lines:["run", "whoa", "flood"] }; });
    await h.start(); for (let i = 0; i < 3; i++){ await h.tap(); await sleep(300); }
    await h.untilCard(); await sleep(600);
    const r = await page.evaluate(() => { const log = FlowMomentEngine.state().voiceLog; const order = ["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"]; const i0 = log.indexOf("uhoh"); const cin = log.slice(i0).filter(x => order.includes(x)); return { cin, persAfter:log.slice(i0).filter(x => /^pers:/.test(x)).length }; });
    check("P7f. Dam Failure Cinematic is untouched by personality: full voice order, no personality line inside it", JSON.stringify(r.cin.slice(0, 10)) === JSON.stringify(["uhoh", "pressure", "hold", "toomuch", "cracking", "weBreak", "broke", "run", "whoa", "flood"]) && r.persAfter === 0, r);
    await h.close();
  }
}
async function playLevel(h){
  const { page } = h;
  await h.start();
  for (let day = 0; day < 6; day++){
    await page.waitForFunction(d => state.phase === "playing" && state.currentStep === d && !state.busy, day, { timeout:15000 });
    const req = await page.evaluate(() => getRequiredTaps(state.level));
    for (let i = 0; i < req; i++){ await h.tap(); await sleep(i < 2 ? 330 : 140); }
  }
  await page.waitForFunction(() => document.getElementById("levelCard").classList.contains("show"), null, { timeout:25000 });
  await sleep(900);
}

const only = process.argv[2];
const suites = { wiring:suiteWiring, select:suiteSelect, context:suiteContext, restraint:suiteRestraint, priority:suitePriority, visual:suiteVisual, safety:suiteSafety };
for (const [name, fn] of Object.entries(suites)){ if (only && only !== name) continue; try { await fn(); } catch (e) { failed++; console.log("  ✗ suite " + name + " crashed: " + (e && e.message || e)); } }
await browser.close(); srv.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
