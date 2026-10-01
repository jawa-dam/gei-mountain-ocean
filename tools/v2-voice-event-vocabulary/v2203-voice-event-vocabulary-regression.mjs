/* V2.2.03 — DAM-ITE VOICE EVENT VOCABULARY regression harness
 *
 *   node tools/v2-voice-event-vocabulary/v2203-voice-event-vocabulary-regression.mjs
 *
 * Part A (static, always runs): exact supplied URLs, one category each, the 14 core URLs in
 *   V2.1.93 + V2.1.94 + the V2.2.03 reference, script order, presentation-only source.
 * Part B (runtime, headless Chromium on the real index.html): priority, cooldowns, stop,
 *   fallback, autoplay blocks, Off mode, Female/Male/Random core resolution, Factory variants,
 *   milestone protection (Level 6 / 12 / 30 / 36), Showcase / Discovery / Rewards, soundtrack
 *   ducking, no simultaneous voices, no economy/progression mutation.
 *
 * Offline by design: every non-local request is blocked. The hosted voice MP3 URLs are answered
 * with a local 1.2 s silent WAV stub so the real Audio()/play() paths run; a few are aborted on
 * purpose to exercise failure handling. This proves the code paths, NOT that the hosted files
 * are reachable or decodable — that needs GEI_VOICE_AUDIO_DIAGNOSTICS.probe() on a live network.
 * Set SKIP_BROWSER=1 to run Part A only.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const results = [];
function check(name, pass, detail){ results.push({ name, pass:!!pass, detail }); console.log((pass ? "PASS " : "FAIL ") + name + (!pass && detail !== undefined ? "  → " + JSON.stringify(detail) : "")); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* The V2.1.97 welcome plays a core voice right after load; event vocals rightly wait for it. */
const coreIdle = page => page.waitForFunction(() => !window.GEI_VOICE_EVENT_V2203.state().coreBusy, null, { timeout:10000 });
const read = f => readFile(join(root, f), "utf8");

/* ---------- the supplied vocabulary, verbatim ---------- */
const B = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
const SUPPLIED = [
  ["GO","START","voice-go-yL2lP6GrsLtAeI24.mp3"],
  ["READY","START","voice-ready-3PePzRRPDT8m4BIS.mp3"],
  ["LET'S GO","START","voice-let-s-go-4BKDqtw99sSDyBjN.mp3"],
  ["NICE","SUCCESS","voice-nice-dp4hucuzcvuv84Wu.mp3"],
  ["GREAT","SUCCESS","voice-great-mLybRSEm7pG0FQlb.mp3"],
  ["YES","SUCCESS","voice-yes-pHzMQ9t77B9sDF2M.mp3"],
  ["WOW","SUCCESS","voice-wow-wLtEk5yjxCvjhQjK.mp3"],
  ["AWESOME","SUCCESS","voice-awesome-SbnGlewuXT9pyD7G.mp3"],
  ["AMAZING","SUCCESS","voice-amazing-fCKuXIkQC0Bv9cbA.mp3"],
  ["AMAZING CALM","SUCCESS","voice-amazing-calm-c6iHjN4obXalxSDt.mp3"],
  ["COOL","SUCCESS","voice-cool-Y1FhS1clcJFAuDiM.mp3"],
  ["PERFECT","SUCCESS","voice-perfect-HwrT69tkN2UKh2FK.mp3"],
  ["BRILLIANT","SUCCESS","voice-brilliant-e4jugBsQL4QIZUrQ.mp3"],
  ["GOOD","SUCCESS","voice-good-VwAGBFfOgekZkAEg.mp3"],
  ["GOOD JOB","SUCCESS","voice-good-job-JIUBMHMQQgmjPkxo.mp3"],
  ["YOU GOT IT","ENCOURAGEMENT","voice-you-got-it-GmiVfU63kJrv1wpZ.mp3"],
  ["KEEP GOING","ENCOURAGEMENT","voice-keep-going-C4W1Ra2bjpR44hKg.mp3"],
  ["TRY AGAIN","ENCOURAGEMENT","voice-try-again-q3RmWPIJEagZ4OFg.mp3"],
  ["UH-OH","WARNING","voice-uh-oh-kWVlp3GWUmHngCZi.mp3"],
  ["UH-OH CALM","WARNING","voice-uh-oh-calm-6nN6GUXjcpOFSYpS.mp3"],
  ["OOPS","WARNING","voice-oops-TXclqexMAies8s7p.mp3"],
  ["LOOK OUT","WARNING","voice-look-out-CnR85KcEPdk18kQi.mp3"],
  ["WATER","HYDRAULIC","voice-water-nn0m965PYbYSCmgD.mp3"],
  ["FLOW","HYDRAULIC","voice-flow-mAq6w2zboHJ1dfeO.mp3"],
  ["PRESSURE","HYDRAULIC","voice-pressure-bLcLMmzKbaHgApKf.mp3"],
  ["OPEN THE GATE","HYDRAULIC","voice-open-the-gate-M7emQuugxGqasaqO.mp3"],
  ["CLOSE THE GATE","HYDRAULIC","voice-close-the-gate-VZ1Q8uTavlHRZYZX.mp3"],
  ["LET IT FLOW","HYDRAULIC","voice-let-it-flow-ioPD43N35SwaI82W.mp3"],
  ["FULL FLOW","HYDRAULIC","voice-full-flow-WksmFpQX1unmMy7X.mp3"],
  ["OPEN THE DAM","SPECIAL_ACTION","voice-open-the-dam-SKamyshanOZBL4qX.mp3"],
  ["SPIN THAT WHEEL","SPECIAL_ACTION","voice-spin-that-wheel-Krxv1FngHpZKUl67.mp3"],
  ["POWER THE FACTORY","SPECIAL_ACTION","voice-power-the-factory-D6vWmbSkBuDm5RpG.mp3"],
  ["LEVEL COMPLETE","COMPLETION","voice-level-complete-4bZsZHkIbsKOrFZz.mp3"],
  ["MISSION COMPLETE","COMPLETION","voice-mission-complete-awUmeWb3yUwqtYuN.mp3"],
  ["YOU DID IT","COMPLETION","voice-you-did-it-birMlo2lrgvQ7hEe.mp3"],
  ["YOU UNLOCKED IT","COMPLETION","voice-you-unlocked-it-hdfmTWqcJNPKDQxB.mp3"],
  ["NEW CHARACTER","COMPLETION","voice-new-character-BgFWUjECAh73kvkD.mp3"],
  ["COLLECTION COMPLETE","COMPLETION","voice-collection-complete-R2qCaDdNwu5M4kzR.mp3"]
].map(([label, category, file]) => ({ label, category, url:B + file }));

const CORE = {
  female:{ mountain:"voice-mountain-6BTaNhF3ATrFV89G.mp3", dam:"voice-dam-lmREB3RHfdTkewgw.mp3", millpond:"voice-millpond-XUviwb2ePIOzlFMq.mp3",
    sluice:"voice-sluice-gate-hEQD902lm4KSCXhp.mp3", waterwheel:"voice-waterwheel-1tpyO8f2tYRXicgv.mp3", factory:"voice-factory-pap6mlywi8BjQhtD.mp3",
    factoryExcited:"voice-factory-excited-wqLUeeBtyJ4UjGQc.mp3" },
  male:{ mountain:"voice-mountain-man-tEaFDCYZ0xZS9kVw.mp3", dam:"voice-dam-man-ZfOndOK3V7esgIoy.mp3", millpond:"voice-millpond-man-rIcShqM3Ov0tDRBL.mp3",
    sluice:"voice-sluice-gate-man-axcTS1BK0rgdEj0T.mp3", waterwheel:"voice-waterwheel-man-7riL8bSH9JojFtSU.mp3", factory:"voice-factory-man-yRn6r400sdsxpMwH.mp3",
    factoryExcited:"voice-factory-man-excited-CCMhfViJX9a1f2Jo.mp3" }
};
const CORE_URLS = Object.values(CORE).flatMap(p => Object.values(p).map(f => B + f));
const CATEGORIES = ["START","SUCCESS","ENCOURAGEMENT","WARNING","HYDRAULIC","SPECIAL_ACTION","COMPLETION"];

/* =====================================================================
   PART A — STATIC
===================================================================== */
const src = await read("dam-ite-voice-event-vocabulary-v2203.js");
const v2193 = await read("gei-milestone-voice-v2193.js");
const v2194 = await read("dam-ite-voice-director-v2194.js");
const html = await read("index.html");

const wordRe = /\{id:"([a-z-]+)",label:"([^"]+)",category:"([A-Z_]+)"[^}]*?file:"([^"]+)"\}/g;
const words = [...src.matchAll(wordRe)].map(m => ({ id:m[1], label:m[2], category:m[3], url:m[4] }));
check("A1 vocabulary has exactly the 38 supplied recordings", words.length === SUPPLIED.length && SUPPLIED.length === 38, words.length);
check("A2 every supplied label/URL/category is present verbatim",
  SUPPLIED.every(s => words.some(w => w.label === s.label && w.url === s.url && w.category === s.category)),
  SUPPLIED.filter(s => !words.some(w => w.label === s.label && w.url === s.url && w.category === s.category)).map(s => s.label));
check("A3 no event URL outside the supplied list (no invented assets)", words.every(w => SUPPLIED.some(s => s.url === w.url)));
check("A4 each recording maps to exactly one category", new Set(words.map(w => w.url)).size === words.length && words.every(w => CATEGORIES.includes(w.category)));
check("A5 all seven categories used", CATEGORIES.every(c => words.some(w => w.category === c)));
check("A6 all 14 original core URLs still present in V2.1.93", CORE_URLS.every(u => v2193.includes(u)), CORE_URLS.filter(u => !v2193.includes(u)));
check("A7 all 14 original core URLs still present in V2.1.94", CORE_URLS.every(u => v2194.includes(u)), CORE_URLS.filter(u => !v2194.includes(u)));
check("A8 V2.2.03 core reference equals the original 14", CORE_URLS.every(u => src.includes(u)) && (src.match(/voice-[a-z-]+-[A-Za-z0-9]{16}\.mp3/g) || []).length === 38 + 14);
check("A9 no event URL collides with a core URL", words.every(w => !CORE_URLS.includes(w.url)));
check("A10 core pack mapping (female/male × 7 keys) unchanged in V2.1.93", Object.entries(CORE).every(([pack, keys]) =>
  Object.entries(keys).every(([k, f]) => new RegExp(k + ':"' + B.replace(/[./]/g, "\\$&") + f.replace(/\./g, "\\.") + '"').test(v2193))));
check("A11 core pack mapping unchanged in V2.1.94", Object.entries(CORE).every(([pack, keys]) =>
  Object.entries(keys).every(([k, f]) => new RegExp(k + ':"' + B.replace(/[./]/g, "\\$&") + f.replace(/\./g, "\\.") + '"').test(v2194))));
check("A12 milestone schedule (every 6 levels, 6-step cycle) unchanged in V2.1.94",
  /level%6!==0\)return null;\s*return STEPS\[\(level\/6-1\)%6\]/.test(v2194) && /STEPS=\["mountain","dam","millpond","sluice","waterwheel","factory"\]/.test(v2194));
const tags = [...html.matchAll(/<script src="\/([^"]+)"/g)].map(m => m[1]);
const voiceOrder = ["gei-milestone-voice-v2193.js","dam-ite-voice-director-v2194.js","dam-ite-voice-ui-v2195.js","dam-ite-voice-reactions-v2196.js",
  "dam-ite-contextual-voice-v2197.js","dam-ite-adaptive-voice-v2198.js","dam-ite-voice-memory-v2199.js","dam-ite-voice-showcase-v2200.js",
  "dam-ite-voice-discovery-v2201.js","dam-ite-voice-discovery-rewards-v2202.js","dam-ite-voice-event-vocabulary-v2203.js"];
check("A13 every voice script tag appears exactly once", voiceOrder.every(f => tags.filter(t => t === f).length === 1));
check("A14 V2.2.03 loads after every voice layer it depends on", voiceOrder.every((f, i) => i === 0 || tags.indexOf(f) > tags.indexOf(voiceOrder[i - 1])));
check("A15 no duplicate script tags anywhere in index.html", tags.length === new Set(tags).size, tags.filter((t, i) => tags.indexOf(t) !== i));
check("A16 presentation-only: no economy/progression/purchase/save authority in V2.2.03",
  !/safeAddFlOz|purchaseItem|commitDamResult|commitBonusPrize|creditPack|awardDay|saveGame|advanceLevel|entitlement|paypal|localStorage\.setItem|sessionStorage\.setItem|\bstate\.\w+\s*=[^=]/i.test(src));
check("A17 public API surface", ["play:play","playWord:playWord","random:function","stop:stop","state:state","selfTest:selfTest","diagnostics:report"].every(s => src.includes(s))
  && /window\.GEI_VOICE_EVENT_V2203=api/.test(src) && /window\.GEI_VOICE_AUDIO_DIAGNOSTICS=/.test(src));
check("A18 diagnostics distinguish CONFIGURED / LOAD ATTEMPTED / LOADED / PLAYBACK SUCCESS / PLAYBACK FAILED / FALLBACK USED / BLOCKED",
  ["\"CONFIGURED\"","\"LOAD ATTEMPTED\"","\"LOADED\"","\"PLAYBACK SUCCESS\"","\"PLAYBACK FAILED\"","\"FALLBACK USED\"","\"PLAYBACK BLOCKED\""].every(s => src.includes(s)));
check("A19 V2.1.93 stands down when the Director owns core playback", /if\(!opts\.direct&&director&&director!==api&&typeof director\.announce==="function"\)return false;/.test(v2193));
check("A20 tone variants grouped (AMAZING/AMAZING CALM, UH-OH/UH-OH CALM)", /id:"amazing",[^}]*group:"amazing",tone:"energetic"/.test(src) && /id:"amazing-calm",[^}]*group:"amazing",tone:"calm"/.test(src)
  && /id:"uh-oh",[^}]*group:"uh-oh",tone:"energetic"/.test(src) && /id:"uh-oh-calm",[^}]*group:"uh-oh",tone:"calm"/.test(src));
check("A21 protected phrases", ["level-complete","mission-complete","you-did-it","you-unlocked-it","collection-complete","open-the-dam","power-the-factory"]
  .every(id => new RegExp('id:"' + id + '",[^}]*protect:true').test(src)));
check("A22 reduced-motion rule present", /prefers-reduced-motion:reduce\)\{#v2203VoiceFx/.test(src));
check("A23 completion phrases never in SUCCESS pools", !/success(Small|Big):\[[^\]]*(complete|did-it|unlocked|new-character)/.test(src));

/* =====================================================================
   PART B — RUNTIME (real page)
===================================================================== */
async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = [];
  try { roots.push(execSync("npm root -g", { encoding:"utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){
    try { return createRequire(join(r, "noop.js"))("playwright"); } catch {}
    try { return createRequire(join(r, "noop.js"))("playwright-core"); } catch {}
  }
  return null;
}
function wav(seconds){
  const rate = 8000, n = Math.round(rate * seconds), data = Buffer.alloc(n * 2), h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
function serve(){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p === "/") p = "/index.html";
        const f = resolve(root, "." + p); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
        await stat(f); res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }); res.end(await readFile(f));
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

const FAILING = new Set([B + "voice-cool-Y1FhS1clcJFAuDiM.mp3", B + "voice-mission-complete-awUmeWb3yUwqtYuN.mp3"]);
const STUB = wav(1.2);
const KNOWN_PAGE_ERROR = /Unexpected string/;   // pre-existing page error, also tolerated by the V2.1.92 harness

/* Init script: logs every voice play() with time + src, and the peak number of voice media
   elements audibly playing at once (core + event; the soundtrack is Web Audio, not media). */
const INIT = () => {
  /* Playwright's evaluate() carries a user gesture; this switch lets one check see a page that has none. */
  const ua = navigator.userActivation;
  if (ua) Object.defineProperty(Navigator.prototype, "userActivation", { configurable:true,
    get(){ return window.__noGesture ? { hasBeenActive:false, isActive:false } : ua; } });
  const L = window.__vlog = { plays:[], maxConcurrent:0, live:new Set() };
  const isVoice = el => /\/voice-[a-z-]+-[A-Za-z0-9]{16}\.mp3$/.test(el.currentSrc || el.src || "");
  const origPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function(){
    if (isVoice(this)){
      const el = this;
      L.plays.push({ t:performance.now(), file:(el.currentSrc || el.src).split("/").pop() });
      L.live.add(el);
      /* paused is updated synchronously by pause(), unlike the async "pause" event */
      const audible = [...L.live].filter(x => x === el || (!x.paused && !x.ended)).length;
      L.maxConcurrent = Math.max(L.maxConcurrent, audible);
    }
    return origPlay.apply(this, arguments);
  };
};

async function runtime(){
  const pw = await loadPlaywright();
  if (!pw){ check("B0 Playwright available for runtime checks", false, "install playwright to run Part B"); return; }
  const srv = await serve(), base = "http://127.0.0.1:" + srv.address().port;
  const browser = await pw.chromium.launch({ args:["--autoplay-policy=no-user-gesture-required"] });
  const errors = [];
  async function open(opts = {}){
    const ctx = await browser.newContext(Object.assign({ viewport:{ width:1280, height:800 } }, opts.ctx || {}));
    await ctx.route("**/*", r => {
      const u = r.request().url();
      if (u.startsWith(base)) return r.continue();
      if (/\/voice-[a-z-]+-[A-Za-z0-9]{16}\.mp3$/.test(u) && !FAILING.has(u))
        return r.fulfill({ status:200, contentType:"audio/wav", body:STUB, headers:{ "access-control-allow-origin":"*" } });
      return r.abort();
    });
    await ctx.addInitScript(INIT);
    if (opts.init) await ctx.addInitScript(opts.init);
    const page = await ctx.newPage();
    page.on("pageerror", e => { if (!KNOWN_PAGE_ERROR.test(e.message)) errors.push(e.message); });
    await page.goto(base + "/", { waitUntil:"load" });
    await sleep(600);
    return { ctx, page };
  }
  const ECON = () => {
    // eslint-disable-next-line no-undef
    const s = state;
    return JSON.stringify({ totalFlOz:s.totalFlOz, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, millStage:s.millStage,
      damMachineFreePlays:s.damMachineFreePlays, unlockedCharacters:s.unlockedCharacters, unlockedSongs:s.unlockedSongs, unlockedSkins:s.unlockedSkins,
      purchaseHistory:s.purchaseHistory, processedReceipts:s.processedReceipts, activeCharacter:s.activeCharacter, ites:s.iteRescueStats,
      save:localStorage.getItem("yalltooDamGame.v2") });
  };

  try {
    /* ---------------- B1: engine, priority, cooldown, stop, fallback ---------------- */
    const { ctx, page } = await open();
    const econBefore = await page.evaluate(ECON);
    const st = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.selfTest());
    check("B1 selfTest: 38 assets, unique hosted URLs, no core overlap, core matches reference",
      st.eventAssets === 38 && st.uniqueEventUrls && st.hostedMp3Urls && st.noCoreOverlap && st.coreMatchesReference && st.everyWordOneCategory, st);
    check("B2 priority order COMPLETION > SPECIAL_ACTION > HYDRAULIC > WARNING > ENCOURAGEMENT > SUCCESS > START",
      JSON.stringify(st.priorityOrder) === JSON.stringify(["COMPLETION","SPECIAL_ACTION","HYDRAULIC","WARNING","ENCOURAGEMENT","SUCCESS","START"]), st.priorityOrder);

    const d0 = await page.evaluate(() => window.GEI_VOICE_AUDIO_DIAGNOSTICS.report());
    check("B3 diagnostics: 14 original core assets (7 female + 7 male), none missing or overwritten",
      d0.originalCoreAssetCount === 14 && d0.femaleCoreCount === 7 && d0.maleCoreCount === 7 && !d0.missingCoreAssets.length
      && !d0.mismatchedCoreAssets.length && d0.coreOverwrittenByEventVocabulary === false, { n:d0.originalCoreAssetCount, f:d0.femaleCoreCount, m:d0.maleCoreCount });
    check("B4 diagnostics do not claim playback before any attempt",
      d0.successfulPlaybacks === 0 && d0.eventAssets.every(a => a.playback === "NOT PLAYED") && d0.configuredCoreAssets.every(r => r.state === "CONFIGURED"), d0.preload);
    check("B5 diagnostics expose mode, active voice, attempts, success, fallback, errors",
      ["voiceMode","activeVoice","playbackAttempts","successfulPlaybacks","fallbackCount","errorCount","preload","verificationNote"].every(k => k in d0));

    const gated = await page.evaluate(() => { window.__noGesture = true; const r = window.GEI_VOICE_EVENT_V2203.playWord("nice"); window.__noGesture = false; return r; });
    check("B6 no event vocal before the first user gesture (autoplay-safe)", !gated.ok && gated.reason === "awaiting-user-gesture", gated);

    await page.mouse.click(1270, 790);              // a real gesture
    await sleep(300);
    await coreIdle(page);
    await page.evaluate(() => { window.__vlog.plays.length = 0; });

    const r1 = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("nice"));
    await sleep(350);
    const s1 = await page.evaluate(() => { const d = window.GEI_VOICE_AUDIO_DIAGNOSTICS.report(); return { a:d.eventAssets.find(a => a.id === "nice"), cur:d.activeVoice.event }; });
    check("B7 playWord plays the exact hosted asset and records PLAYBACK SUCCESS only after play() resolves",
      r1.ok && s1.cur === "nice" && s1.a.playback === "PLAYBACK SUCCESS" && s1.a.load === "LOADED", s1);

    const busy = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("great", { cooldownKey:"t-busy" }));
    check("B8 equal priority does not stack a second voice", !busy.ok && busy.reason === "busy", busy);
    const up = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("open-the-dam"));
    const lower = await page.evaluate(() => [window.GEI_VOICE_EVENT_V2203.playWord("look-out"), window.GEI_VOICE_EVENT_V2203.playWord("water")]);
    check("B9 higher priority interrupts; lower priority never interrupts OPEN THE DAM", up.ok && lower.every(x => !x.ok && x.reason === "busy"), { up, lower });
    const top = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("level-complete"));
    const blockTop = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("power-the-factory", { cooldownKey:"t-top" }));
    await sleep(300);
    const s2 = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.state());
    check("B10 COMPLETION outranks SPECIAL_ACTION; SPECIAL_ACTION waits behind a protected COMPLETION",
      top.ok && !blockTop.ok && blockTop.reason === "deferred-busy" && s2.current && s2.current.id === "level-complete", { top, blockTop, cur:s2.current });
    await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.stop());
    const s3 = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.state());
    check("B11 stop() clears current and deferred vocals", !s3.current && !s3.pending, s3);

    await sleep(1000);
    const cd = await page.evaluate(async () => {
      const E = window.GEI_VOICE_EVENT_V2203, a = E.play("SUCCESS", { cooldownKey:"t-cd" });
      E.stop(); await new Promise(r => setTimeout(r, 1000));
      return [a, E.play("SUCCESS", { cooldownKey:"t-cd" })];
    });
    check("B12 SUCCESS cooldown suppresses rapid repeats", cd[0].ok && !cd[1].ok && cd[1].reason === "cooldown", cd);

    const rnd = await page.evaluate(() => {
      const E = window.GEI_VOICE_EVENT_V2203, ids = [], cats = {};
      E.words.forEach(w => cats[w.id] = w.category);
      for (let i = 0; i < 80; i++) ids.push(E.random("SUCCESS"));
      return { ids, cats, repeats:ids.filter((x, i) => i && x === ids[i - 1] && !/amazing/.test(x)).length,
        calmUh:E.random("WARNING", { pool:["uh-oh"], tone:"calm" }), loudUh:E.random("WARNING", { pool:["uh-oh"], tone:"energetic" }),
        calmAmazing:E.random("SUCCESS", { pool:["amazing"], tone:"calm" }), bad:E.random("NOPE") };
    });
    check("B13 random(category) stays in its category, varies, avoids back-to-back repeats",
      rnd.ids.every(id => rnd.cats[id] === "SUCCESS") && new Set(rnd.ids).size >= 8 && rnd.repeats === 0 && rnd.bad === null, { distinct:new Set(rnd.ids).size, repeats:rnd.repeats });
    check("B14 calm/energetic deliveries resolve inside one reaction group", rnd.calmUh === "uh-oh-calm" && rnd.loudUh === "uh-oh" && rnd.calmAmazing === "amazing-calm", rnd);

    /* fallback: aborted URL */
    await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.stop());
    await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("cool", { force:true }));
    await sleep(1200);
    const fb = await page.evaluate(() => { const d = window.GEI_VOICE_AUDIO_DIAGNOSTICS.report(); return { a:d.eventAssets.find(a => a.id === "cool"), fb:d.fallbackCount, err:d.errorCount, cur:d.activeVoice.event }; });
    check("B15 a failed MP3 is reported LOAD FAILED + FALLBACK USED (never PLAYBACK SUCCESS) and frees the slot",
      fb.a.load === "LOAD FAILED" && fb.a.playback === "FALLBACK USED" && fb.a.success === 0 && fb.fb >= 1 && fb.err >= 1 && fb.cur === null, fb);
    const after = await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.playWord("yes", { force:true }));
    check("B16 engine keeps working after a failure", after.ok, after);

    /* autoplay block */
    await page.evaluate(() => window.GEI_VOICE_EVENT_V2203.stop());
    const blk = await page.evaluate(async () => {
      const p = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function(){ HTMLMediaElement.prototype.play = p; return Promise.reject(new DOMException("blocked", "NotAllowedError")); };
      window.GEI_VOICE_EVENT_V2203.playWord("good", { force:true });
      await new Promise(r => setTimeout(r, 200));
      const d = window.GEI_VOICE_AUDIO_DIAGNOSTICS.report();
      return { a:d.eventAssets.find(a => a.id === "good"), blocked:d.blockedCount, seen:d.autoplay.blockedSeen, cur:d.activeVoice.event };
    });
    check("B17 autoplay rejection is PLAYBACK BLOCKED, not a broken asset, and frees the slot",
      blk.a.playback === "PLAYBACK BLOCKED" && blk.a.failures === 0 && blk.blocked === 1 && blk.seen && blk.cur === null, blk);

    /* Off mode */
    const off = await page.evaluate(() => {
      const D = window.GEI_VOICE_DIRECTOR, E = window.GEI_VOICE_EVENT_V2203, prev = D.getMode();
      E.stop(); D.setMode("off");
      const r = [E.play("SUCCESS", { force:true }), E.playWord("level-complete", { force:true }), E.playWord("open-the-dam", { force:true }), D.announce("mountain")];
      D.setMode(prev);
      return r;
    });
    check("B18 Off mode suppresses every event vocal (even forced) and the core voice", off.slice(0, 3).every(x => !x.ok && x.reason === "voice-off") && off[3] === false, off);

    /* ducking */
    const duck = await page.evaluate(async () => {
      const S = window.DAMSoundtrack, calls = [], orig = S.duck;
      S.duck = function(k){ calls.push(k); return orig.apply(this, arguments); };
      const E = window.GEI_VOICE_EVENT_V2203;
      E.stop(); E.playWord("water", { force:true }); await new Promise(r => setTimeout(r, 120));
      E.stop(); E.playWord("you-did-it", { force:true }); await new Promise(r => setTimeout(r, 120));
      E.stop(); S.duck = orig;
      return calls;
    });
    check("B19 soundtrack ducks for event vocals; COMPLETION/SPECIAL use the stronger 'mission' duck", duck[0] === "reward" && duck.includes("mission"), duck);
    const restore = await page.evaluate(async () => {
      const S = window.DAMSoundtrack;
      S.setEnabled(true);
      await new Promise(r => setTimeout(r, 500));
      if (!S.playing) return { skipped:true };
      window.GEI_VOICE_EVENT_V2203.playWord("mission-complete", { force:true });
      window.GEI_VOICE_EVENT_V2203.playWord("power-the-factory", { force:true });
      await new Promise(r => setTimeout(r, 200));
      const during = S.duckMultiplier;
      await new Promise(r => setTimeout(r, 4200));
      return { during, after:S.duckMultiplier };
    });
    check("B20 ducking is temporary (music returns to full after the vocal)", restore.skipped || (restore.during < 1 && restore.after === 1), restore);

    /* game hooks: event-driven only */
    await page.evaluate(() => { window.GEI_VOICE_EVENT_V2203.stop(); window.__vlog.plays.length = 0; });
    await sleep(1000);
    const hooks = await page.evaluate(async () => {
      const files = () => window.__vlog.plays.map(p => p.file);
      spawnHydraulicBreakthrough(1);                                  // Day 2 Dam completed
      await new Promise(r => setTimeout(r, 150));
      const dam = files().slice();
      window.GEI_VOICE_EVENT_V2203.stop(); window.__vlog.plays.length = 0;
      await new Promise(r => setTimeout(r, 1000));
      for (let i = 0; i < 40; i++){ registerDamIteCombo("dam", 1); await new Promise(r => setTimeout(r, 40)); }   // 40 rapid taps
      await new Promise(r => setTimeout(r, 400));
      return { dam, tapVoices:files().length };
    });
    check("B21 day completion fires its station vocal (Dam → OPEN THE DAM)", hooks.dam.length === 1 && /open-the-dam/.test(hooks.dam[0]), hooks.dam);
    check("B22 40 rapid combo taps produce at most 2 vocals (never per tap)", hooks.tapVoices <= 2, hooks.tapVoices);
    await page.evaluate(() => { const c = typeof damIteCombo !== "undefined" ? damIteCombo : null; if (c){ c.count = 0; c.lastAt = 0; } });

    /* wrappers installed once */
    const once = await page.evaluate(() => ({
      dir:!!window.GEI_VOICE_DIRECTOR.__v2203Guarded && !window.GEI_VOICE_DIRECTOR.__v2203Original.__v2203Guarded,
      /* count V2.2.03 wrappers along each function's full wrapper chain (other layers wrap too) */
      hooks:["beginDay","spawnHydraulicBreakthrough","showDamIteComboFlash","handleDayTimeout","retryDay","spinBonusWheel","revealBonusResult","presentDamMachineWin","presentDamMachineNoFlow","showLevelComplete"]
        .map(n => { let f = window[n], mine = 0; for (let i = 0; f && i < 16; i++){ if (f.__v2203Wrapped) mine++;
          const k = Object.keys(f).find(k => /^__v\d+Original$/.test(k)); f = k ? f[k] : null; } return mine === 1; }),
      styles:document.querySelectorAll("#v2203VoiceEventStyle").length, layers:document.querySelectorAll("#v2203VoiceFx").length
    }));
    check("B23 hooks/guards/styles installed exactly once (no duplicated listeners)", once.dir && once.hooks.every(Boolean) && once.styles === 1 && once.layers <= 1, once);
    check("B24 visual reaction is non-blocking (pointer-events:none, single layer)",
      await page.evaluate(() => { const l = document.getElementById("v2203VoiceFx"); return !!l && getComputedStyle(l).pointerEvents === "none"; }));

    /* core resolution (silent: preloadOnly) */
    const res = await page.evaluate(() => {
      const D = window.GEI_VOICE_DIRECTOR, prev = D.getMode(), steps = ["mountain","dam","millpond","sluice","waterwheel","factory"], out = {};
      const file = () => D.state.lastFile.split("/").pop();
      ["female","male"].forEach(m => { D.setMode(m); out[m] = steps.map(k => { D.announce(k, { force:true, preloadOnly:true }); return file(); }); });
      D.setMode("female"); const fac = new Set(); for (let i = 0; i < 60; i++){ D.announce("factory", { force:true, preloadOnly:true }); fac.add(file()); }
      D.setMode("male"); const facM = new Set(); for (let i = 0; i < 60; i++){ D.announce("factory", { force:true, preloadOnly:true }); facM.add(file()); }
      D.setMode("random"); const rnd = new Set(); for (let i = 0; i < 12; i++){ D.announce("dam", { force:true, preloadOnly:true }); rnd.add(file()); }
      D.stop(); D.setMode(prev);
      return { female:out.female, male:out.male, fac:[...fac], facM:[...facM], rnd:[...rnd] };
    });
    const exp = m => ["mountain","dam","millpond","sluice","waterwheel","factory"].map(k => CORE[m][k]);
    check("B25 Female mode resolves the 6 Female milestone assets", JSON.stringify(res.female.map((f, i) => i === 5 && f === CORE.female.factoryExcited ? CORE.female.factory : f)) === JSON.stringify(exp("female")), res.female);
    check("B26 Male mode resolves the 6 Male milestone assets", JSON.stringify(res.male.map((f, i) => i === 5 && f === CORE.male.factoryExcited ? CORE.male.factory : f)) === JSON.stringify(exp("male")), res.male);
    check("B27 Factory normal + excited variants both resolve (Female and Male)",
      res.fac.sort().join() === [CORE.female.factory, CORE.female.factoryExcited].sort().join() && res.facM.sort().join() === [CORE.male.factory, CORE.male.factoryExcited].sort().join(), res);
    check("B28 Random mode resolves both packs", res.rnd.sort().join() === [CORE.female.dam, CORE.male.dam].sort().join(), res.rnd);

    /* Showcase / Discovery / Rewards */
    await page.evaluate(() => { window.__vlog.plays.length = 0; });
    const sc = await page.evaluate(async () => {
      const D = window.GEI_VOICE_DIRECTOR, prev = D.getMode();
      const ok = window.GEI_VOICE_SHOWCASE.preview("sluice", "male");
      await new Promise(r => setTimeout(r, 400));
      const seen = window.GEI_VOICE_DISCOVERY.seen();
      window.GEI_VOICE_REWARDS.check();
      const rewards = window.GEI_VOICE_REWARDS.snapshot();
      D.stop(); D.setMode(prev);
      return { ok, plays:window.__vlog.plays.map(p => p.file), seen, rewards };
    });
    check("B29 Voice Showcase replay still plays the same core asset", sc.ok && sc.plays.includes(CORE.male.sluice), sc.plays);
    check("B30 Voice Discovery still sees the core voice moment", sc.seen.includes("male:sluice:sluice"), sc.seen);
    check("B31 Voice Rewards still sees discoveries", sc.rewards.totalDiscoveries >= 1 && sc.rewards.unlocked.includes("first-voice"), sc.rewards);

    const econAfter = await page.evaluate(ECON);
    check("B32 no economy/progression/save mutation from event vocabulary use", econBefore === econAfter);
    check("B33 never more than one voice audible at once (engine section)", (await page.evaluate(() => window.__vlog.maxConcurrent)) <= 1, await page.evaluate(() => window.__vlog.maxConcurrent));
    await ctx.close();

    /* ---------------- B2: core milestone protection on the real level card ---------------- */
    const m = await open();
    await m.page.mouse.click(1270, 790);
    await sleep(5600);                                  // past V2.1.97's start-up window so its cycle anchor really fires
    const levelRun = async (level, mode) => m.page.evaluate(async ([level, mode]) => {
      const D = window.GEI_VOICE_DIRECTOR, E = window.GEI_VOICE_EVENT_V2203, prevMode = D.getMode(), prevLevel = state.level;
      D.setMode(mode);
      levelCard.classList.remove("show");
      await new Promise(r => setTimeout(r, 150));
      E.stop();
      E.playWord("power-the-factory", { force:true });    // an event vocal is mid-flight when the level completes
      await new Promise(r => setTimeout(r, 200));
      window.__vlog.plays.length = 0; window.__vlog.live.clear(); window.__vlog.maxConcurrent = 0;
      const protectedBefore = window.GEI_VOICE_AUDIO_DIAGNOSTICS.report().core.milestoneProtected;
      const t0 = performance.now();
      state.level = level;
      showLevelComplete();
      await new Promise(r => setTimeout(r, 4200));
      const plays = window.__vlog.plays.map(p => ({ file:p.file, t:Math.round(p.t - t0) }));
      const d = window.GEI_VOICE_AUDIO_DIAGNOSTICS.report();
      levelCard.classList.remove("show");
      state.level = prevLevel; D.setMode(prevMode); E.stop();
      return { plays, max:window.__vlog.maxConcurrent, protectedNow:d.core.milestoneProtected - protectedBefore, coreStops:d.counters.coreStops };
    }, [level, mode]);
    const coreFiles = new Set(CORE_URLS.map(u => u.split("/").pop()));
    const eventFiles = new Set(SUPPLIED.map(s => s.url.split("/").pop()));
    const SUCCESS_BIG = new Set(["WOW","AWESOME","AMAZING","AMAZING CALM","PERFECT","BRILLIANT","GOOD JOB"].map(l => SUPPLIED.find(s => s.label === l).url.split("/").pop()));
    const ms = [
      [6, "female", [CORE.female.mountain], null],
      [12, "male", [CORE.male.dam], null],
      [30, "female", [CORE.female.waterwheel], null],
      [36, "female", [CORE.female.factory, CORE.female.factoryExcited], "voice-mission-complete-awUmeWb3yUwqtYuN.mp3"]
    ];
    for (const [level, mode, expect, follow] of ms){
      const r = await levelRun(level, mode);
      if (process.env.VERBOSE) console.log("   level", level, JSON.stringify(r.plays));
      const core = r.plays.filter(p => coreFiles.has(p.file)), ev = r.plays.filter(p => eventFiles.has(p.file));
      check(`B34 Level ${level} (${mode}): exactly one core voice, the right one, first`,
        core.length === 1 && expect.includes(core[0].file) && r.plays[0].file === core[0].file, r.plays);
      check(`B35 Level ${level}: no other milestone/cycle voice replaces it (protected ${r.protectedNow})`, core.every(p => expect.includes(p.file)), r.plays);
      /* exactly one short reaction, only after the 1.2 s core stub has finished */
      const followOk = ev.length === 1 && ev[0].t > core[0].t + 1200 && (follow ? ev[0].file === follow : SUCCESS_BIG.has(ev[0].file));
      check(`B36 Level ${level}: core voice first, then one short follow-up (${ev[0] ? ev[0].file.split("-").slice(1, -1).join(" ") : "none"})`, core.length === 1 && followOk, r.plays);
      check(`B37 Level ${level}: never two voices at once`, r.max <= 1, r.max);
    }
    const nm = await m.page.evaluate(async () => {
      const prevLevel = state.level;
      levelCard.classList.remove("show");
      await new Promise(r => setTimeout(r, 1500));
      window.__vlog.plays.length = 0;
      state.level = 7; showLevelComplete();
      await new Promise(r => setTimeout(r, 900));
      const files = window.__vlog.plays.map(p => p.file);
      levelCard.classList.remove("show"); state.level = prevLevel;
      return files;
    });
    check("B38 non-milestone Level 7: LEVEL COMPLETE / YOU DID IT, no core voice",
      nm.length === 1 && /level-complete|you-did-it/.test(nm[0]) && !nm.some(f => coreFiles.has(f)), nm);
    check("B39 core milestone stopped the in-flight event vocal", (await m.page.evaluate(() => window.GEI_VOICE_AUDIO_DIAGNOSTICS.report().counters.coreStops)) >= 1);
    const tapReplay = await m.page.evaluate(async () => {
      const D = window.GEI_VOICE_DIRECTOR, prevLevel = state.level, prevMode = D.getMode();
      D.setMode("female");
      await new Promise(r => setTimeout(r, 1500));
      state.level = 6; showLevelComplete();
      await new Promise(r => setTimeout(r, 150));
      window.__vlog.plays.length = 0;
      window.GEI_VOICE_SHOWCASE.open();
      document.querySelector('[data-v2200-play="dam"]').click();     // the player taps REPLAY while MOUNTAIN plays
      await new Promise(r => setTimeout(r, 150));
      const files = window.__vlog.plays.map(p => p.file);
      window.GEI_VOICE_SHOWCASE.close(); levelCard.classList.remove("show"); state.level = prevLevel; D.stop(); D.setMode(prevMode);
      return files;
    });
    check("B42 a player's Showcase replay tap is never held back by milestone protection", tapReplay.includes(CORE.female.dam), tapReplay);
    await m.ctx.close();

    /* ---------------- B3: reduced motion ---------------- */
    const rm = await open({ ctx:{ reducedMotion:"reduce" } });
    await rm.page.mouse.click(1270, 790);
    await sleep(200);
    await coreIdle(rm.page);
    const bits = await rm.page.evaluate(async () => { window.GEI_VOICE_EVENT_V2203.playWord("open-the-dam", { force:true }); await new Promise(r => setTimeout(r, 50));
      return { bits:document.querySelectorAll("#v2203VoiceFx .v2203Bit").length, ring:document.querySelectorAll("#v2203VoiceFx .v2203Ring").length }; });
    check("B40 reduced motion: no particles, a static cue only", bits.bits === 0 && bits.ring === 1, bits);
    await rm.ctx.close();

    check("B41 no new page errors", errors.length === 0, errors);
  } finally {
    await browser.close();
    srv.close();
  }
}

if (process.env.SKIP_BROWSER) console.log("SKIP_BROWSER set — runtime checks skipped");
else await runtime();

const failed = results.filter(r => !r.pass);
console.log(`\nV2.2.03 voice event vocabulary regression: ${failed.length ? "FAIL" : "PASS"} — ${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) process.exit(1);
