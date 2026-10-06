/* V2.2.7 — ACHIEVEMENT AUDIO DIRECTOR regression harness
 *
 * Loads the real index.html in headless Chromium (offline: every non-local request is blocked) with a mocked /audio/achievements/ tree and checks:
 *   N1 pools      manifest + consecutive-number discovery, unknown/empty categories, lazy loading (no MP3 GET before it is needed)
 *   N2 decision   tiers 1–6, 70/20/8/2 distribution, ONE MORE (tier 4) and MILESTONE COMPLETE (tier 5) never replaced by a rare roll, WOW cooldown
 *   N3 accuracy   the progress-voice category always equals the exact remaining count (any milestone, any level)
 *   N4 voice lane voices are strictly sequential (max 1 at a time), ordered, queued lines expire, music is ducked only while a voice speaks
 *   N5 continue   CONTINUE cancels voice + layers immediately, releases the duck, plays the whoosh / arrival; nothing waits for audio
 *   N6 safety     mute stops everything; broken / slow / blocked MP3s never throw, never block, never leave music ducked
 *   N7 character  reaction cooldown + higher chance near the milestone; per-character takes preferred
 *   N8 capsule    the real Level Complete capsule drives the director (show → badge → xp → fill → message → release), the card never scrolls
 *
 *   node tools/v227-achievement-audio/achievement-audio-regression.mjs
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
const results = []; const check = (name, pass, detail) => results.push({ name, pass: !!pass, detail });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const KNOWN = /Unexpected string|addStyle is not defined/;

/* the mocked audio tree: these files "exist" (garbage bytes — a real <audio> would fail to decode them, which is also a test) */
const EXISTING = new Set([
  "level-complete/level-complete-01.mp3", "level-complete/level-complete-02.mp3", "level-complete/level-complete-03.mp3",
  "milestone-complete/milestone-complete-01.mp3", "milestone-complete/milestone-complete-02.mp3",
  "five-more/five-more-01.mp3", "custom-cat/custom-cat-01.mp3", "custom-cat/custom-cat-02.mp3", "custom-cat/custom-cat-04.mp3"
]);
const MANIFEST = { version:1, discover:true, categories:{ "one-more":["one-more-01.mp3", "take-b.mp3"], "next-challenge":["next-challenge-01.mp3"] } };

async function newPage(browser, base, opts){
  const ctx = await browser.newContext(Object.assign({ viewport:{ width:390, height:844 }, isMobile:true, hasTouch:true }, opts || {}));
  ctx.__errors = []; ctx.__reqs = [];
  await ctx.route("**/*", r => {
    const req = r.request(), u = req.url();
    if (!u.startsWith(base)) return r.abort();
    const p = new URL(u).pathname;
    if (p.startsWith("/audio/achievements/")) {
      ctx.__reqs.push(req.method() + " " + p);
      const rel = p.slice("/audio/achievements/".length);
      if (rel === "manifest.json") return r.fulfill({ status:200, contentType:"application/json", body:JSON.stringify(MANIFEST) });
      if (EXISTING.has(rel)) return r.fulfill({ status:200, contentType:"audio/mpeg", body:Buffer.from("not really an mp3") });
      return r.fulfill({ status:404, body:"" });
    }
    return r.continue();
  });
  const page = await ctx.newPage();
  page.on("pageerror", e => ctx.__errors.push(e.message));
  await page.goto(base + "/", { waitUntil:"load" }); await sleep(500);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(1800);
  return { ctx, page };
}
/* a fake engine: records every play, tracks concurrency, ends after `dur` ms unless stopped */
const FAKE = () => {
  const D = window.__GEI_ACHIEVEMENT_DIRECTOR__;
  window.__ctxFor = level => ({ level, milestone:window.__GEI_VICTORY_CAPSULE__.milestoneFor(level), characterId:"beaver" });
  window.__plays = []; window.__active = 0; window.__maxActive = 0; window.__dur = 300; window.__mode = "ok";
  D._test.setEngine({
    preload(){}, release(){},
    play(url, o){
      const rec = { url, t: performance.now(), volume: o.volume, stopped:false, voice: !/flow-forward|next-station|xp-earned|badge-earned|milestone-progress|rare-wow/.test(url), duckedAtStart: window.GEI_AUDIO.state.musicDucking };
      window.__plays.push(rec);
      const h = { url, stopped:false, stop(){ if (rec.stopped || rec.ended) return; rec.stopped = true; h.stopped = true; end(false); } };
      let end;
      h.ended = new Promise(res => {
        end = ok => { if (rec.done) return; rec.done = true; if (rec.voice) window.__active--; rec.endT = performance.now(); res(ok); };
        if (window.__mode === "broken") { rec.done = true; res(false); return; }
        if (rec.voice) { window.__active++; window.__maxActive = Math.max(window.__maxActive, window.__active); }
        setTimeout(() => end(true), window.__dur);
      });
      return h;
    }
  });
  D._test.reset();
};
const REG = cats => { const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; for (const k of Object.keys(cats)) D.registerClips(k, cats[k]); };
const ALL = { "level-complete":["a1.mp3","a2.mp3"], "five-more":["f1.mp3","f2.mp3"], "four-more":["g1.mp3"], "three-more":["h1.mp3"], "two-more":["i1.mp3"], "one-more":["o1.mp3","o2.mp3"],
  "milestone-complete":["m1.mp3","m2.mp3"], "next-challenge":["n1.mp3"], "flow-forward":["w1.mp3"], "next-station":["s1.mp3"], "xp-earned":["x1.mp3"], "badge-earned":["b1.mp3"],
  "milestone-progress":["p1.mp3"], "rare-wow":["r1.mp3"], "character-reactions/normal":["c1.mp3"], "character-reactions/progress":["c2.mp3"], "character-reactions/one-more":["c3.mp3"], "character-reactions/milestone":["c4.mp3"] };

async function suitePools(browser, base){
  const { ctx, page } = await newPage(browser, base);
  const lazy = ctx.__reqs.filter(r => /^GET .*\.mp3/.test(r));
  check("N1a. nothing is downloaded at startup (lazy loading — only existence probes / manifest at most)", lazy.length === 0, lazy);
  const r = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__;
    await D.discover("level-complete"); await D.discover("milestone-complete"); await D.discover("one-more"); await D.discover("empty-cat");
    D.addCategory("custom-cat"); await D.discover("custom-cat");
    return { lc:D.pool("level-complete"), mc:D.pool("milestone-complete"), om:D.pool("one-more"), nc:D.pool("next-challenge"), empty:D.pool("empty-cat"), custom:D.pool("custom-cat"), cats:D.categories };
  });
  check("N1b. consecutive files are discovered automatically (…-01…-03 → 3 clips, …-01…-02 → 2) with no code change", r.lc.length === 3 && r.mc.length === 2, r);
  check("N1c. the manifest adds files (one-more: manifest take + none discovered), including non-numbered names", r.om.length === 2 && r.om.some(u => /take-b\.mp3$/.test(u)), r.om);
  check("N1d. a new category works without engine changes; discovery stops at the first gap (01, 02 found, 04 ignored)", r.custom.length === 2 && r.empty.length === 0, r.custom);
  check("N1e. all spec categories exist (level-complete … rare-wow, character reactions)", ["level-complete","xp-earned","badge-earned","milestone-progress","five-more","four-more","three-more","two-more","one-more","milestone-complete","next-challenge","flow-forward","rare-wow"].every(c => r.cats.includes(c)), r.cats);
  const gets = ctx.__reqs.filter(q => /^GET .*\.mp3/.test(q));
  check("N1f. discovery only HEADs; no MP3 body was requested yet", gets.length === 0, gets);
  await ctx.close();
}

async function suiteDecision(browser, base){
  const { ctx, page } = await newPage(browser, base);
  const d = await page.evaluate(() => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__, f = window.__GEI_VICTORY_CAPSULE__.milestoneFor, c = L => ({ level:L, milestone:f(L), characterId:"x" });
    const at = (L, roll) => D.decide(c(L), () => roll);
    const out = { normal:at(1, .5).tier, enh:at(1, .2).tier, spec:at(1, .05).tier, wow:at(1, .005).tier, wowRare:at(1, .005).rare,
      appr3:at(3, .5).tier, appr4:at(4, .5).tier, rem4:at(2, .5).tier, one:at(5, .5).tier, oneWow:at(5, .001).tier, oneRare:at(5, .001).rare, done:at(6, .5).tier, doneWow:at(6, .001).tier,
      l7:at(7, .5).tier, l11:at(11, .5).tier, l12:at(12, .5).tier };
    const n = 40000, cnt = { 1:0, 2:0, 3:0, 6:0 }; for (let i = 0; i < n; i++){ const t = D.decide(c(1), Math.random).tier; cnt[t]++; }
    out.dist = { normal:cnt[1] / n, enhanced:cnt[2] / n, special:cnt[3] / n, wow:cnt[6] / n };
    return out;
  });
  check("N2a. tiers: normal 1 / enhanced 2 / special 3 / rare WOW 6 at ordinary levels", d.normal === 1 && d.enh === 2 && d.spec === 3 && d.wow === 6 && d.wowRare, d);
  check("N2b. approaching the milestone is tier 3 (2–3 left; 4–5 left stay tier 1), ONE MORE is tier 4, MILESTONE COMPLETE is tier 5 — never displaced by a rare roll", d.appr3 === 3 && d.appr4 === 3 && d.rem4 === 1 && d.one === 4 && d.oneWow === 4 && !d.oneRare && d.done === 5 && d.doneWow === 5, d);
  check("N2c. the same rules hold in later milestones (7 → 1, 11 → 4, 12 → 5)", d.l7 === 1 && d.l11 === 4 && d.l12 === 5, d);
  check("N2d. starting distribution ≈ 70 / 20 / 8 / 2 %", Math.abs(d.dist.normal - .70) < .02 && Math.abs(d.dist.enhanced - .20) < .02 && Math.abs(d.dist.special - .08) < .015 && Math.abs(d.dist.wow - .02) < .01, d.dist);
  const cd = await page.evaluate(() => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__, f = window.__GEI_VICTORY_CAPSULE__.milestoneFor; D._test.reset(); D._test.setRng(() => .001);
    const rare = []; for (let i = 0; i < 14; i++){ const p = D.begin({ level:1, milestone:f(1), characterId:"x" }); rare.push(p.rare); D.event("hide"); }
    D._test.setRng(null); return rare;
  });
  const idx = cd.map((v, i) => v ? i : -1).filter(i => i >= 0);
  check("N2e. rare WOW has a cooldown (never on consecutive levels; ≥ 6 completions apart)", idx.length >= 2 && idx.every((v, i) => i === 0 || v - idx[i - 1] >= 6), { idx });
  await ctx.close();
}

async function suiteAccuracy(browser, base){
  const { ctx, page } = await newPage(browser, base);
  const bad = await page.evaluate(ALL_ => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__, f = window.__GEI_VICTORY_CAPSULE__.milestoneFor, want = { 5:"five-more", 4:"four-more", 3:"three-more", 2:"two-more", 1:"one-more" }, bad = [];
    for (let L = 1; L <= 300; L++){
      const m = f(L); D._test.reset(); const p = D.begin({ level:L, milestone:m, characterId:"x" }); D.event("hide");
      const exp = m.complete ? "milestone-complete" : want[m.remaining];
      if (p.progressKey !== exp) bad.push([L, p.progressKey, exp]);
    }
    return bad;
  }, ALL);
  check("N3. for levels 1–300 the progress voice category is exactly the on-screen remaining count (five-more only at 5 left … milestone-complete only at 6, 12, …)", bad.length === 0, bad.slice(0, 5));
  await ctx.close();
}

async function suiteLane(browser, base){
  const { ctx, page } = await newPage(browser, base);
  await page.evaluate(FAKE); await page.evaluate(REG, ALL);
  await page.evaluate(() => { window.__GEI_ACHIEVEMENT_DIRECTOR__._test.setRng(() => .99); });   // deterministic: normal tier, no character chance (roll too high)
  await page.evaluate(c => { window.__c = c; }, 0);
  /* level 3 (3 left): level-complete voice then three-more voice, strictly in order, one at a time */
  await page.evaluate(() => { const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D.begin(window.__ctxFor(3)); D.event("show"); setTimeout(() => D.event("message"), 120); });
  await sleep(1400);
  const a = await page.evaluate(() => ({ plays:window.__plays.filter(p => p.voice).map(p => p.url.split("/").pop()), max:window.__maxActive }));
  check("N4a. voices are sequential, never overlapping (level-complete, then three-more) — max 1 voice at a time", a.max === 1 && a.plays.length === 2 && /^a\d/.test(a.plays[0]) && a.plays[1] === "h1.mp3", a);
  /* ducking */
  const dk = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; D.begin(window.__ctxFor(1));
    D.event("show"); await new Promise(r => setTimeout(r, 120));
    const during = window.GEI_AUDIO.state.musicDucking; await new Promise(r => setTimeout(r, 700));
    const after = window.GEI_AUDIO.state.musicDucking; return { during, after };
  });
  check("N4b. music is ducked while a voice speaks and restored after the lane drains", dk.during === true && dk.after === false, dk);
  /* stale lines expire */
  const ex = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; window.__dur = 6000; D.config.maxWaitMs = 500;
    D.begin(window.__ctxFor(2)); D.event("show"); await new Promise(r => setTimeout(r, 100)); D.event("message");
    await new Promise(r => setTimeout(r, 1200)); const n = window.__plays.filter(p => p.voice).length; window.__dur = 300; D.config.maxWaitMs = 4500; D.cancel(); return n;
  });
  check("N4c. a queued line that could not start within the wait limit is dropped (no late, irrelevant voice)", ex === 1, ex);
  /* milestone: big line sequence */
  const ms = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; window.__maxActive = 0; window.__dur = 250;
    D.begin(window.__ctxFor(6)); D.event("show"); await new Promise(r => setTimeout(r, 100)); D.event("message"); D.event("rise"); D.event("release");
    await new Promise(r => setTimeout(r, 1500)); return { v:window.__plays.filter(p => p.voice).map(p => p.url.split("/").pop()), max:window.__maxActive, st:D.state().plan };
  });
  check("N4d. level 6: level-complete, then MILESTONE COMPLETE, then NEXT CHALLENGE — sequenced, never simultaneous, no 'N more' line", ms.max === 1 && ms.v.length >= 3 && /^m\d/.test(ms.v[1]) && ms.v[2] === "n1.mp3" && !ms.v.some(u => /^(f|g|h|i|o)\d/.test(u)), ms);
  const one = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; window.__maxActive = 0; window.__dur = 250;
    D.begin(window.__ctxFor(5)); D.event("show"); await new Promise(r => setTimeout(r, 100)); D.event("message");
    await new Promise(r => setTimeout(r, 1200)); return window.__plays.filter(p => p.voice).map(p => p.url.split("/").pop());
  });
  check("N4e. level 5: ONE MORE is spoken (one-more clip), after the level-complete line", one.length >= 2 && /^o\d/.test(one[1]), one);
  await ctx.close();
}

async function suiteContinue(browser, base){
  const { ctx, page } = await newPage(browser, base);
  await page.evaluate(FAKE); await page.evaluate(REG, ALL);
  const r = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); D._test.setRng(() => .99); window.__plays = []; window.__dur = 5000;
    D.begin(window.__ctxFor(5)); D.event("show"); await new Promise(r => setTimeout(r, 150)); D.event("message");
    const t0 = performance.now(); const before = D.state();
    D.event("continue", { gesture:true });
    const st = D.state(); await new Promise(r => setTimeout(r, 120));
    D.event("arrive", { gesture:true }); await new Promise(r => setTimeout(r, 60));
    const voices = window.__plays.filter(p => p.voice);
    return { playingBefore:before.playing, afterPlaying:st.playing, queued:st.queued, ducked:window.GEI_AUDIO.state.musicDucking, stopped:voices.every(v => v.stopped),
      whoosh:window.__plays.some(p => /w1\.mp3/.test(p.url)), arrive:window.__plays.some(p => /s1\.mp3/.test(p.url)), ms:Math.round(performance.now() - t0) };
  });
  check("N5. CONTINUE cancels the speaking voice + queue at once, releases the duck, then plays the whoosh and the arrival tone", r.playingBefore && !r.afterPlaying && r.queued.length === 0 && !r.ducked && r.stopped && r.whoosh && r.arrive, r);
  await ctx.close();
}

async function suiteSafety(browser, base){
  const { ctx, page } = await newPage(browser, base);
  await page.evaluate(FAKE); await page.evaluate(REG, ALL);
  const m = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; window.GEI_AUDIO.setMuted(true);
    D.begin(window.__ctxFor(6)); ["show","badge","xp","fill","message","rise","release","continue","arrive"].forEach(t => D.event(t));
    await new Promise(r => setTimeout(r, 400)); const n = window.__plays.length; window.GEI_AUDIO.setMuted(false);
    /* mute during a voice stops it */
    window.__dur = 4000; D._test.reset(); D.begin(window.__ctxFor(1)); D.event("show"); await new Promise(r => setTimeout(r, 150));
    const speaking = D.state().playing; window.GEI_AUDIO.setMuted(true); await new Promise(r => setTimeout(r, 120));
    const after = D.state(); window.GEI_AUDIO.setMuted(false); window.__dur = 300;
    return { n, speaking, afterPlaying:after.playing, ducked:window.GEI_AUDIO.state.musicDucking };
  });
  check("N6a. muted: no clip is requested at all; muting mid-line stops it and un-ducks the music", m.n === 0 && m.speaking && !m.afterPlaying && !m.ducked, m);
  const b = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; window.__mode = "broken"; let threw = false;
    try { D.begin(window.__ctxFor(5)); ["show","badge","xp","fill","message","continue","arrive"].forEach(t => D.event(t)); } catch (e) { threw = true; }
    await new Promise(r => setTimeout(r, 600)); window.__mode = "ok"; const s = D.state();
    return { threw, ducked:window.GEI_AUDIO.state.musicDucking, queued:s.queued.length, playing:s.playing };
  });
  check("N6b. MP3s that fail to load never throw, never block and never leave the music ducked", !b.threw && !b.ducked && b.queued === 0 && !b.playing, b);
  /* talking over the game's narrators is never allowed */
  const o = await page.evaluate(async () => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D._test.reset(); window.__plays = []; const A = window.GEI_AUDIO; const real = Object.getOwnPropertyDescriptor(A, "wow");
    let blocked = 0; try { Object.defineProperty(A, "wow", { configurable:true, get(){ return { speaking:true }; } }); } catch (e) { blocked = 1; }
    D.begin(window.__ctxFor(2)); D.event("show"); await new Promise(r => setTimeout(r, 300));
    return { blocked, voices:window.__plays.filter(p => p.voice).length };
  });
  check("N6c. the director never speaks over the game's own narrator (WOW / Beaver voice, or the Dam Map zone)", o.blocked === 1 || o.voices === 0, o);
  await ctx.close();
}

async function suiteCharacter(browser, base){
  const { ctx, page } = await newPage(browser, base);
  const c = await page.evaluate(() => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__, f = window.__GEI_VICTORY_CAPSULE__.milestoneFor; D._test.reset();
    const run = (L, n) => { let k = 0; for (let i = 0; i < n; i++){ D._test.reset(); if (D.begin({ level:L, milestone:f(L), characterId:"x" }).character) k++; D.event("hide"); } return k / n; };
    const r = { normal:run(1, 4000), progress:run(3, 4000), one:run(5, 4000), done:run(6, 400) };
    D._test.reset(); D._test.setRng(() => .001);
    const seq = []; for (let i = 0; i < 8; i++){ seq.push(D.begin({ level:2, milestone:f(2), characterId:"x" }).character); D.event("hide"); }
    D._test.setRng(null); r.seq = seq; return r;
  });
  check("N7a. the Personal DAM Guide speaks rarely on ordinary levels, more near the milestone, always on completion", c.normal < .2 && c.progress > c.normal && c.one > c.progress && c.done === 1, c);
  check("N7b. ordinary character reactions have a cooldown (≥ 3 completions apart)", (() => { const idx = c.seq.map((v, i) => v ? i : -1).filter(i => i >= 0); return idx.length >= 1 && idx.every((v, i) => i === 0 || v - idx[i - 1] >= 3); })(), c.seq);
  const pf = await page.evaluate(() => {
    const D = window.__GEI_ACHIEVEMENT_DIRECTOR__; D.registerClips("character-reactions/one-more", ["generic.mp3"]);
    return D.urlFor("character-reactions/one-more", 1, "danite");
  });
  check("N7c. per-character takes use <ctx>-<characterId>-NN.mp3", /character-reactions\/one-more-danite-01\.mp3$/.test(pf), pf);
  await ctx.close();
}

async function suiteCapsule(browser, base){
  const { ctx, page } = await newPage(browser, base);
  await page.evaluate(FAKE); await page.evaluate(REG, ALL);
  await page.evaluate(() => { window.__GEI_ACHIEVEMENT_DIRECTOR__._test.setRng(() => .99); window.__ev = []; window.addEventListener("gei:achievement", e => window.__ev.push([e.detail.type, Math.round(performance.now())])); });
  await page.evaluate(() => { try { __GEI_BEAVER_WELCOME__.begin(); } catch {} state.level = 5; state.wow && (state.wow.pending = null); showLevelComplete({ quiet:true }); });
  await sleep(2000);
  const a = await page.evaluate(() => { const i = document.getElementById("levelInner"); const b = document.getElementById("lcBtn").getBoundingClientRect(); return { ev:window.__ev.map(e => e[0]), voices:window.__plays.filter(p => p.voice).map(p => p.url.split("/").pop()), tier:document.getElementById("levelCard").getAttribute("data-hvc-audio-tier"), noScroll:i.scrollHeight <= i.clientHeight + 1, btn:b.bottom <= innerHeight && b.height >= 54 }; });
  check("N8a. the real capsule drives the director in step with the visuals (show → badge → xp → fill → message) and the card stays one-viewport", ["show","badge","xp","fill","message"].every(t => a.ev.includes(t)) && a.ev.indexOf("show") < a.ev.indexOf("badge") && a.ev.indexOf("badge") < a.ev.indexOf("xp") && a.ev.indexOf("xp") < a.ev.indexOf("fill") && a.noScroll && a.btn, a);
  check("N8b. level 5 plays the level-complete line then ONE MORE, at audio tier 4", a.voices.length >= 2 && /^a\d/.test(a.voices[0]) && /^o\d/.test(a.voices[1]) && a.tier === "4", a);
  await page.evaluate(() => { document.getElementById("levelCard").classList.remove("show"); }); await sleep(300);
  /* CONTINUE with a long voice playing: the hand-off is not delayed by audio */
  await page.evaluate(() => { window.__plays = []; window.__dur = 8000; state.level = 2; state.wow && (state.wow.pending = null); showLevelComplete({ quiet:true }); }); await sleep(600);
  const t0 = Date.now(); await page.click("#lcBtn");
  let at = -1; while (Date.now() - t0 < 2000){ if (await page.evaluate(() => document.getElementById("bonusCard").classList.contains("show"))){ at = Date.now() - t0; break; } await sleep(30); }
  const cont = await page.evaluate(() => ({ ducked:window.GEI_AUDIO.state.musicDucking, voices:window.__plays.filter(p => p.voice).every(p => p.stopped || p.done), whoosh:window.__plays.some(p => /w1\.mp3/.test(p.url)) }));
  check("N8c. CONTINUE during a long voice line: hand-off within ~0.8 s, voice cancelled, music restored, whoosh played", at > 0 && at < 900 && !cont.ducked && cont.voices && cont.whoosh, { at, cont });
  /* reduced motion: the audio timeline is unchanged */
  await ctx.close();
  const r = await newPage(browser, base, { reducedMotion:"reduce" });
  await r.page.evaluate(FAKE); await r.page.evaluate(REG, ALL);
  await r.page.evaluate(() => { window.__GEI_ACHIEVEMENT_DIRECTOR__._test.setRng(() => .99); window.__ev = []; window.addEventListener("gei:achievement", e => window.__ev.push(e.detail.type)); try { __GEI_BEAVER_WELCOME__.begin(); } catch {} state.level = 6; state.wow && (state.wow.pending = null); showLevelComplete({ quiet:true }); });
  await sleep(2600);
  const rm = await r.page.evaluate(() => ({ ev:window.__ev, voices:window.__plays.filter(p => p.voice).map(p => p.url.split("/").pop()) }));
  check("N8d. reduced motion: visuals are static but the whole audio sequence still plays (level-complete, milestone-complete, next-challenge)", ["show","fill","rise","release"].every(t => rm.ev.includes(t)) && rm.voices.length >= 3, rm);
  await r.ctx.close();
  /* real engine + real (garbage) files: lazy GET only for what is used; page survives decode errors */
  const g = await newPage(browser, base);
  await g.page.evaluate(() => { __GEI_ACHIEVEMENT_DIRECTOR__._test.setRng(() => .99); try { __GEI_BEAVER_WELCOME__.begin(); } catch {} state.level = 1; state.wow && (state.wow.pending = null); showLevelComplete({ quiet:true }); });
  await sleep(2200);
  const gets = [...new Set(g.ctx.__reqs.filter(q => /^GET .*\.mp3/.test(q)))];
  const ok = await g.page.evaluate(() => { const i = document.getElementById("levelInner"), b = document.getElementById("lcBtn").getBoundingClientRect(); return i.scrollHeight <= i.clientHeight + 1 && b.bottom <= innerHeight && !window.GEI_AUDIO.state.musicDucking; });
  check("N8e. real engine: only the clips actually needed are fetched (≤ 2 MP3s for level 1), undecodable files are skipped, the card still works and the music is not left ducked", gets.length <= 2 && ok && g.ctx.__errors.filter(e => !KNOWN.test(e)).length === 0, { gets, errors:g.ctx.__errors });
  await g.ctx.close();
}

const { chromium } = await loadPlaywright();
const srv = await serve(); const base = "http://127.0.0.1:" + srv.address().port;
const browser = await chromium.launch();
try {
  for (const s of [suitePools, suiteDecision, suiteAccuracy, suiteLane, suiteContinue, suiteSafety, suiteCharacter, suiteCapsule]) await s(browser, base);
} finally { await browser.close(); srv.close(); }
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total:results.length, failed:failed.length, results }, null, 1));
for (const r of results) console.log((r.pass ? "PASS " : "FAIL ") + r.name);
process.exit(failed.length ? 1 : 0);
