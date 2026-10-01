/* V2.2.03 — DAM-ITE AUDIO RELIABILITY regression harness
 *
 * Loads the real index.html in headless Chromium (offline) and drives the real voice chain:
 * V2.1.93 milestone engine → V2.1.94 Director → V2.1.95–V2.2.02 layers → V2.2.03 reliability.
 *
 * The CDN is unreachable from the harness, so <audio> is replaced by a scripted media layer
 * (init script) that behaves like Chromium's: play() is a pending promise that pause() rejects
 * with AbortError, "ended" fires after the clip, failing URLs reject / raise a media error.
 * It also tracks how many clips are audible at once. Real MP3 decoding is browser-only.
 *
 *   R  registry: 14 hosted MP3s, unchanged from the Director source, all valid mappings
 *   S  six core stations resolve correctly in Female and in Male
 *   N  Random resolves to both real packs; Factory normal + excited both reachable
 *   P  replay: same clip twice in a row, and a mid-flight replay never gets stuck
 *   T  rapid taps on Showcase replay never overlap; mode switch silences the old voice
 *   O  a milestone level card plays one clip at a time (V2.1.93 defers to the Director)
 *   F  failure → speech fallback, counted, gameplay unaffected
 *   I  Showcase replay → Voice Discovery → Voice Rewards; soundtrack ducking intact
 *   D  GEI_VOICE_AUDIO_DIAGNOSTICS report/selfTest; idle warm-up; no script errors
 *
 *   node tools/v2-audio-reliability/v2203-audio-reliability-regression.mjs
 */
import fs from "node:fs";
import { loadPlaywright, serve, reporter, openGame, sleep, KNOWN_BROKEN, root } from "../v2203-harness.mjs";

const { check, finish } = reporter();
const directorSrc = fs.readFileSync(root + "/dam-ite-voice-director-v2194.js", "utf8");
const SOURCE_URLS = [...new Set(directorSrc.match(/https:\/\/assets\.zyrosite\.com\/[^"]+\.mp3/g))].sort();

/* Scripted media layer — runs before any page script. */
function fakeMedia(){
  const T = window.__fake = { clipMs:420, failPlay:new Set(), failLoad:new Set(), playing:new Set(), maxPlaying:0, plays:[], speaks:[], ducks:[] };
  const P = HTMLMediaElement.prototype;
  function stopped(el){ T.playing.delete(el); }
  Object.defineProperty(P, "src", { configurable:true,
    get(){ return this.__src || ""; },
    set(v){
      const el = this; el.__src = String(v); el.__err = null; el.__ready = 0;
      setTimeout(() => {
        if (T.failLoad.has(el.__src)){ el.__err = { code:4 }; el.dispatchEvent(new Event("error")); return; }
        el.__ready = 4; ["loadedmetadata", "loadeddata", "canplaythrough"].forEach(t => el.dispatchEvent(new Event(t)));
      }, 15);
    } });
  Object.defineProperty(P, "error", { configurable:true, get(){ return this.__err || null; } });
  Object.defineProperty(P, "readyState", { configurable:true, get(){ return this.__ready || 0; } });
  P.load = function(){};
  P.play = function(){
    const el = this;
    clearTimeout(el.__pt); clearTimeout(el.__et);
    T.plays.push(el.__src);
    if (T.failLoad.has(el.__src)) return new Promise((res, rej) => setTimeout(() => {   // network drop: media error, then play() rejects
      el.__err = { code:2 }; el.dispatchEvent(new Event("error")); rej(new DOMException("unsupported", "NotSupportedError")); }, 5));
    return new Promise((res, rej) => {
      el.__pending = { res, rej };
      el.__pt = setTimeout(() => {
        el.__pending = null;
        if (T.failPlay.has(el.__src)){ rej(new DOMException("unsupported", "NotSupportedError")); return; }
        T.playing.add(el); T.maxPlaying = Math.max(T.maxPlaying, T.playing.size);
        res();
        el.__et = setTimeout(() => { stopped(el); el.dispatchEvent(new Event("ended")); }, T.clipMs);
      }, 30);
    });
  };
  P.pause = function(){
    clearTimeout(this.__pt); clearTimeout(this.__et); stopped(this);
    if (this.__pending){ const p = this.__pending; this.__pending = null; p.rej(new DOMException("interrupted", "AbortError")); }
  };
  const synth = { speak(u){ T.speaks.push(u.text); setTimeout(() => u.onend && u.onend(), 20); }, cancel(){}, getVoices(){ return []; } };
  Object.defineProperty(window, "speechSynthesis", { configurable:true, value:synth });
  window.addEventListener("load", () => {
    const S = window.DAMSoundtrack;
    if (S && typeof S.duck === "function"){ const o = S.duck; S.duck = function(k){ T.ducks.push(k); return o.apply(this, arguments); }; }
  });
}

const pw = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await pw.chromium.launch();

/* Helpers evaluated in the page. */
const until = async (page, fn, arg, ms = 3000) => { const t = Date.now(); while (Date.now() - t < ms){ if (await page.evaluate(fn, arg)) return true; await sleep(40); } return false; };

try {
  const g = await openGame(browser, base, { init:fakeMedia });
  const { page } = g;
  await sleep(4200);   // let the idle warm-up run

  /* R — registry */
  const reg = await page.evaluate(() => ({ v:GEI_VOICE_AUDIO_DIAGNOSTICS.validate(), assets:GEI_VOICE_DIRECTOR.assets(), legacy:GEI_MILESTONE_VOICE.packs }));
  const regUrls = [...new Set(Object.values(reg.assets).flatMap(p => Object.values(p)))].sort();
  check("R1. registry: 14 configured hosted MP3s, 14 valid mappings, no issues", reg.v.configured === 14 && reg.v.valid === 14 && reg.v.ok && !reg.v.issues.length, reg.v.issues);
  check("R2. registry URLs are exactly the hosted URLs in the Director source (none replaced)", JSON.stringify(regUrls) === JSON.stringify(SOURCE_URLS) && SOURCE_URLS.length === 14, { regUrls, SOURCE_URLS });
  check("R3. V2.1.93 and Director registries agree key-for-key", JSON.stringify(reg.legacy) === JSON.stringify(reg.assets), {});

  /* S — six stations, Female then Male */
  const STEPS = ["mountain", "dam", "millpond", "sluice", "waterwheel", "factory"];
  for (const mode of ["female", "male"]){
    const rows = [];
    for (const key of STEPS){
      const r = await page.evaluate(([mode, key]) => {
        const d = GEI_VOICE_DIRECTOR; d.setMode(mode); d.stop();
        const ok = d.announce(key, { force:true });
        const last = GEI_VOICE_AUDIO_DIAGNOSTICS.report().lastAnnouncement;
        return { ok, last, expected:d.assets()[last.mode][last.variant] };
      }, [mode, key]);
      rows.push({ key, ok:r.ok, mode:r.last.mode, variant:r.last.variant, match:r.last.file === r.expected, slug:r.last.file.split("/").pop() });
      await sleep(80);
    }
    const good = rows.every(x => x.ok && x.mode === mode && x.match && (x.key === "factory" ? /^factory(Excited)?$/.test(x.variant) : x.variant === x.key));
    check("S" + (mode === "female" ? 1 : 2) + ". six core stations resolve to the " + mode.toUpperCase() + " pack", good && rows.every(x => mode === "male" ? /-man-/.test(x.slug) : !/-man-/.test(x.slug)), rows);
  }

  /* N — Random + Factory variants */
  const rnd = await page.evaluate(async () => {
    const d = GEI_VOICE_DIRECTOR, seen = new Set(), files = [];
    d.setMode("random");
    for (let i = 0; i < 6; i++){ d.stop(); d.announce("dam", { force:true }); const l = GEI_VOICE_AUDIO_DIAGNOSTICS.report().lastAnnouncement; seen.add(l.mode); files.push(l.file === d.assets()[l.mode].dam); }
    return { modes:[...seen], allMatch:files.every(Boolean), mode:d.getMode() };
  });
  check("N1. Random resolves to both real packs and every pick matches the registry", rnd.mode === "random" && rnd.modes.includes("female") && rnd.modes.includes("male") && rnd.allMatch, rnd);
  const fac = await page.evaluate(() => {
    const d = GEI_VOICE_DIRECTOR, v = { female:new Set(), male:new Set() }; let mismatch = 0;
    for (const m of ["female", "male"]){ d.setMode(m); for (let i = 0; i < 60; i++){ d.stop(); d.announce("factory", { force:true }); const l = GEI_VOICE_AUDIO_DIAGNOSTICS.report().lastAnnouncement; v[m].add(l.variant); if (l.file !== d.assets()[m][l.variant]) mismatch++; } }
    d.stop();
    return { female:[...v.female], male:[...v.male], mismatch, counted:GEI_VOICE_AUDIO_DIAGNOSTICS.counters.resolutionMismatches };
  });
  check("N2. Factory normal + excited variants are both reachable and valid in both packs", ["female", "male"].every(m => fac[m].includes("factory") && fac[m].includes("factoryExcited")) && !fac.mismatch && !fac.counted, fac);

  /* P — replay */
  await page.evaluate(() => { GEI_VOICE_DIRECTOR.setMode("female"); GEI_VOICE_DIRECTOR.stop(); window.__p0 = GEI_VOICE_DIRECTOR.state.played; GEI_VOICE_DIRECTOR.announce("millpond", { force:true }); });
  const p1 = await until(page, () => GEI_VOICE_DIRECTOR.state.played === window.__p0 + 1 && !GEI_VOICE_DIRECTOR.state.active);
  await page.evaluate(() => GEI_VOICE_DIRECTOR.announce("millpond", { force:true }));
  const p2 = await until(page, () => GEI_VOICE_DIRECTOR.state.played === window.__p0 + 2 && !GEI_VOICE_DIRECTOR.state.active);
  check("P1. the same clip replays to the end twice in a row", p1 && p2, await page.evaluate(() => GEI_VOICE_DIRECTOR.state));
  /* Mid-flight replay of the SAME element: the interrupted play() rejects (AbortError) after the
     replay has installed its handlers. Before V2.2.03 that nulled the replay's onended → stuck. */
  await page.evaluate(() => { const bare = GEI_VOICE_DIRECTOR.__v2203Original; window.__p1 = GEI_VOICE_DIRECTOR.state.played; bare("sluice", { force:true }); setTimeout(() => bare("sluice", { force:true }), 8); });
  const p3 = await until(page, () => GEI_VOICE_DIRECTOR.state.played === window.__p1 + 1 && !GEI_VOICE_DIRECTOR.state.active, null, 2500);
  check("P2. a mid-flight replay of the same clip still finishes (never stuck active)", p3, await page.evaluate(() => ({ state:GEI_VOICE_DIRECTOR.state, interrupted:GEI_VOICE_AUDIO_DIAGNOSTICS.counters.interrupted })));

  /* T — rapid taps via the real Showcase UI, and mode switching */
  await page.evaluate(() => { GEI_VOICE_SHOWCASE.open(); __fake.maxPlaying = 0; });
  await sleep(150);
  const g0 = await page.evaluate(() => GEI_VOICE_AUDIO_DIAGNOSTICS.counters.guardedRapidTaps);
  const btn = page.locator('[data-v2200-play="dam"]');
  for (let i = 0; i < 6; i++){ await btn.click({ delay:0 }); await sleep(35); }
  await sleep(900);
  const taps = await page.evaluate(() => ({ max:__fake.maxPlaying, guarded:GEI_VOICE_AUDIO_DIAGNOSTICS.counters.guardedRapidTaps, state:GEI_VOICE_DIRECTOR.state }));
  check("T1. rapid Showcase replay taps never overlap and settle cleanly", taps.max <= 1 && taps.guarded > g0 && !taps.state.active, { ...taps, before:g0 });
  await page.evaluate(() => { GEI_VOICE_SHOWCASE.close(); GEI_VOICE_DIRECTOR.setMode("female"); GEI_VOICE_DIRECTOR.announce("waterwheel", { force:true }); });
  await until(page, () => __fake.playing.size === 1);
  const sw = await page.evaluate(() => { GEI_VOICE_DIRECTOR.setMode("male"); return { playing:__fake.playing.size, active:GEI_VOICE_DIRECTOR.state.active, diag:GEI_VOICE_AUDIO_DIAGNOSTICS.activeVoice }; });
  check("T2. switching Female → Male silences the old voice immediately", sw.playing === 0 && !sw.active && !sw.diag, sw);

  /* O — one owner at a milestone level card (V2.1.93 + V2.1.94 + V2.1.97 all observe it) */
  const own = await page.evaluate(async () => {
    GEI_VOICE_DIRECTOR.setMode("random"); GEI_VOICE_DIRECTOR.stop(); __fake.maxPlaying = 0;
    const d0 = GEI_MILESTONE_VOICE.selfTest().deferredToDirector;
    const card = document.getElementById("levelCard"), lv = document.getElementById("lcLevel"), prev = lv.textContent;
    lv.textContent = "LEVEL 12 COMPLETE"; card.classList.add("show");
    await new Promise(r => setTimeout(r, 900));
    card.classList.remove("show"); lv.textContent = prev;
    return { max:__fake.maxPlaying, deferred:GEI_MILESTONE_VOICE.selfTest().deferredToDirector - d0 };
  });
  check("O1. a milestone level card never plays two voices at once (V2.1.93 defers to the Director)", own.max === 1 && own.deferred >= 1, own);

  /* F — fallback */
  const fb = await page.evaluate(async () => {
    const d = GEI_VOICE_DIRECTOR; d.setMode("female"); d.stop();
    const file = d.assets().female.dam; __fake.failPlay.add(file);
    const f0 = GEI_VOICE_AUDIO_DIAGNOSTICS.report().fallbackCount, s0 = __fake.speaks.length;
    d.announce("dam", { force:true });
    await new Promise(r => setTimeout(r, 400));
    __fake.failPlay.delete(file);
    const rep = GEI_VOICE_AUDIO_DIAGNOSTICS.report(), row = rep.assets.find(a => a.file === file);
    return { fallback:rep.fallbackCount - f0, spoke:__fake.speaks.slice(s0), status:row.status, failedUrls:rep.failedAssetUrls.includes(file), errors:rep.errorCount };
  });
  check("F1. a failed clip falls back to speech, and is reported as playback-failed", fb.fallback === 1 && fb.spoke.includes("DAM") && fb.status === "playback-failed" && fb.failedUrls && fb.errors > 0, fb);
  const ld = await page.evaluate(async () => {
    const d = GEI_VOICE_DIRECTOR; d.setMode("male"); d.stop();
    const file = d.assets().male.millpond; __fake.failLoad.add(file);
    for (let i = 0; i < 3; i++){ d.stop(); d.announce("millpond", { force:true }); await new Promise(r => setTimeout(r, 120)); }
    const row = GEI_VOICE_AUDIO_DIAGNOSTICS.report().assets.find(a => a.file === file);
    const cache = d.cacheState()[file];
    __fake.failLoad.delete(file);
    return { status:row.status, loadFailed:row.loadFailed, fallbackUsed:row.fallbackUsed, retried:cache.retried, failed:cache.failed, phase:state.phase };
  });
  check("F2. a media load error retries once, then is reported load-failed and keeps falling back", ld.status === "load-failed" && ld.loadFailed && ld.retried && ld.failed && ld.fallbackUsed >= 2 && typeof ld.phase === "string", ld);

  /* I — Showcase → Discovery → Rewards, soundtrack duck */
  const disc = await page.evaluate(async () => {
    GEI_VOICE_DIRECTOR.setMode("female"); GEI_VOICE_DIRECTOR.stop();
    const before = GEI_VOICE_DISCOVERY.seen().slice();
    GEI_VOICE_REWARDS.reset();   // test browser only: rewards must re-unlock from a live discovery, not a page-load check
    const ok = GEI_VOICE_SHOWCASE.preview("waterwheel", "female");
    await new Promise(r => setTimeout(r, 400));
    const after = GEI_VOICE_DISCOVERY.seen();
    return { ok, had:before.includes("female:waterwheel:waterwheel"), has:after.includes("female:waterwheel:waterwheel"), count:after.length, rewards:GEI_VOICE_REWARDS.snapshot().unlocked };
  });
  check("I1. Showcase replay plays and Voice Discovery records the played voice", disc.ok && disc.has, disc);
  check("I2. Voice Rewards react to a live discovery (rewards re-unlock without a reload)", !disc.had && disc.rewards.includes("first-voice") && (disc.count < 3 || disc.rewards.includes("flow-listener")), disc);
  const duck = await page.evaluate(() => ({ ducks:__fake.ducks.filter(k => k === "mission").length, api:!!(window.DAMSoundtrack && DAMSoundtrack.duck) }));
  check("I3. soundtrack ducking is still requested for every voice moment", duck.api && duck.ducks > 10, duck);

  /* D — diagnostics */
  const rep = await page.evaluate(() => GEI_VOICE_AUDIO_DIAGNOSTICS.report());
  const need = ["configuredAssets", "validMappings", "assets", "preload", "failedAssetUrls", "currentMode", "activeVoice", "playbackCount", "fallbackCount", "errorCount", "verification"];
  check("D1. diagnostics report exposes assets, mappings, preload/cache, failures, mode, active voice and counts", need.every(k => k in rep) && rep.configuredAssets === 14 && rep.validMappings === 14 && rep.playbackCount > 0 && rep.assets.length === 14, need.filter(k => !(k in rep)));
  check("D2. report never claims a remote check and leaks no account/payment data", rep.verification.remoteHeadRequest === false && !/paypal|token|secret|email|entitlement|password/i.test(JSON.stringify(rep)), rep.verification);
  const st = await page.evaluate(() => GEI_VOICE_AUDIO_DIAGNOSTICS.selfTest());
  const stKeys = ["registryOk", "sixCoreStations", "femaleResolves", "maleResolves", "randomResolves", "factoryVariants", "directorPresent", "rapidTapGuard", "showcaseReplay", "discoveryHook", "rewardsHook", "singlePlaybackOwner"];
  check("D3. selfTest: registry, Female/Male/Random, Factory variants, guard, showcase/discovery/rewards hooks", stKeys.every(k => st[k] === true) && st.resolutionMismatches === 0, st);
  const warm = rep.preload;
  check("D4. idle warm-up preloaded the starting mode's pack without blocking startup", warm.warmedModes.length >= 1 && warm.attempted >= 7, warm);
  const probe = await page.evaluate(async () => GEI_VOICE_AUDIO_DIAGNOSTICS.probe(GEI_VOICE_DIRECTOR.assets().female.mountain, 2000));
  check("D5. probe() reports a browser media load, labelled as not a HEAD request", probe.result === "loaded" && probe.remoteHeadRequest === false && probe.method === "audio-element-metadata", probe);
  check("D6. no new script errors", g.errors.length <= KNOWN_BROKEN, g.errors);
  await g.ctx.close();
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally {
  await browser.close(); srv.close();
}
finish("V2.2.03-audio");
