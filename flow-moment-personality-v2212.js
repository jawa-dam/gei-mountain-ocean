/* V2.2.12 — GEI PLAYFUL PERSONALITY ENGINE 🎙️😁
 *
 * Three communication layers, never competing:
 *   🌊 MILESTONE VOICE   (MilestoneProgressEngine)   "how close am I"
 *   🏆 ACHIEVEMENT VOICE (LevelCompleteVoiceEngine)  "what I accomplished"
 *   😁 PERSONALITY VOICE (this file)                 spontaneous, playful, surprising commentary — GEI's attitude
 *
 * PersonalityTriggerEngine watches what the PLAYER DOES (taps, combos, finished days, failures, new runs) via the Flow Moment Engine's
 * read-only "gei:flow-event" stream and decides whether a comment is deserved:
 *
 *   PLAYER ACTION → GAME STATE → PERSONALITY RESPONSE      (never TIMER → RANDOM AUDIO)
 *
 * It speaks only when nobody else is speaking, never during the failure cinematic / Level Complete sequence / the final push (2 MORE, ONE MORE),
 * never in the last seconds of the clock, and rests after every phrase (rarity-scaled cooldown, minimum taps between comments, per-level cap,
 * no phrase twice in a row, no trigger twice in a row). Rarer phrases need a stronger moment; ULTRA-RARE ones have their own special triggers.
 * It owns no game state (no progress / FL OZ / XP / save access) and nothing waits for it.
 *
 * Voice priority (smaller wins): 1 failure cinematic · 2 level complete · 3 ONE MORE · 3.5 timer warnings · 4 milestone · 5 achievement ·
 * 6 PERSONALITY · 7 character reaction · music ducked. Personality uses a "polite" lane request: it never interrupts or silences another voice.
 */
(function(){
  "use strict";
  var FM = window.FlowMomentEngine;
  if(!FM || window.PersonalityTriggerEngine) return;
  var VERSION = "V2.2.12";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var PRI = FM.priorities;
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function warn(e){ try{ console.warn("[Personality] " + (e && e.message || e)); }catch(_){} }
  function ph(id, text, file, rarity, core, emoji, kinds, extra){ var o = { id: id, text: text, url: CDN + file, rarity: rarity, core: !!core, emoji: emoji, kinds: kinds }; if(extra) for(var k in extra) o[k] = extra[k]; return o; }

  /* ================================================================== PHRASES */
  var PHRASES = [
    /* ---- CORE SIGNATURE (the recognisable GEI voice: weighted up) ---- */
    ph("dam-good",     "OH, THAT'S DAM GOOD!",             "oh-that-s-dam-good-XOHgsyY7J1lT6TdS.mp3",                 "uncommon", true, "🎙️", ["clean"]),
    ph("serious-flow", "NOW THAT'S SOME SERIOUS FLOW!",    "now-that-s-some-serious-flow-L2Ux7yJHkKV3s79Y.mp3",       "uncommon", true, "🌊", ["combo", "streak"]),
    ph("in-the-flow",  "YOU'RE IN THE FLOW!",              "you-re-in-the-flow-rzLW4VwLhFmBKDOk.mp3",                 "common",   true, "🌊", ["flow"]),
    ph("keep-flow",    "KEEP THAT DAM FLOW MOVING!",       "keep-that-dam-flow-moving-JSEyCxp7j40caFiJ.mp3",          "common",   true, "💧", ["flow", "momentum", "recover", "return"]),
    ph("lets-go",      "LET'S GO, DAM-ITE!",               "let-s-go-dam-ite-OInFVuDhoB0Hw2j2.mp3",                   "common",   true, "🎙️", ["start", "levelup", "return"]),
    ph("water-moving", "OH YEAH, THAT WATER'S MOVING!",    "oh-yeah-that-water-s-moving-dK4mg1G5HKVqM5ho.mp3",        "uncommon", true, "💧", ["move"]),
    ph("powered-up",   "YOU JUST POWERED THAT UP!",        "you-just-powered-that-up-g1yIwtOv8RXf7McB.mp3",           "uncommon", true, "⚡", ["power"]),
    ph("how-we-do",    "THAT'S HOW WE DO IT IN THE FLOW!", "that-s-how-we-do-it-in-the-flow-Zomtp29d93xGEmX1.mp3",    "uncommon", true, "🌊", ["power", "clean"]),
    ph("moving-water", "LOOK AT YOU MOVING WATER!",        "look-at-you-moving-water-PUmxfoqjV3eCL4h7.mp3",           "common",   true, "💧", ["move", "burst"]),
    ph("momentum",     "YOU'RE BUILDING MOMENTUM!",        "you-re-building-momentum-czKiaMG5tuxTnt2G.mp3",           "common",   true, "🌊", ["momentum", "combo"]),
    ph("flow-doesnt",  "THE FLOW DOESN'T STOP!",           "the-flow-doesn-t-stop-mNkR970wwL5NkXYr.mp3",              "uncommon", true, "🌊", ["streak"]),
    ph("keep-dam-moving", "KEEP IT DAM MOVING!",           "keep-it-dam-moving-DWe4dvEN6F6vWvZn.mp3",                 "common",   true, "💧", ["flow", "recover"]),
    /* ---- PLAYFUL POOL ---- */
    ph("too-dam-good", "WE'RE TOO DAM GOOD!",              "we-re-too-dam-good-60Q5aHYH8r8g5qiU.mp3",                 "rare",     false, "🎙️", ["great", "impressive"]),
    ph("no-dry",       "NO DRY SPELLS ALLOWED!",           "no-dry-spells-allowed-oaV0vBUBca4z0EZ0.mp3",              "ultra",    false, "💦", ["idle"],      { exclusive: true }),
    ph("came-to-flow", "YOU CAME TO FLOW!",                "you-came-to-flow-Ol63xxQkOsrQBAf2.mp3",                   "common",   false, "🌊", ["start", "levelup"]),
    ph("dam-didnt",    "THAT DAM DIDN'T STAND A CHANCE!",  "that-dam-didn-t-stand-a-chance-u4d8uBTBVmFPBWxS.mp3",     "rare",     false, "💥", ["impressive", "great"]),
    ph("water-knows",  "THE WATER KNOWS YOUR NAME.",       "the-water-knows-your-name-VA57ZfRXQXJYebfZ.mp3",          "ultra",    false, "💧", ["epic"],      { exclusive: true, signature: true }),
    ph("look-go",      "LOOK AT YOU GO!",                  "look-at-you-go-wmERKIbIu68vOa4s.mp3",                     "common",   false, "🎙️", ["burst", "recover"]),
    ph("easy",         "YOU'RE MAKING THIS LOOK EASY!",    "you-re-making-this-look-easy-AFJQkJ1kUgpx2hby.mp3",       "rare",     false, "😎", ["clean", "burst", "impressive"]),
    ph("who-gave",     "WHO GAVE YOU ALL THAT POWER?!",    "who-gave-you-all-that-power-cwQLRisTu0mq9NSU.mp3",        "rare",     false, "⚡", ["burst"]),
    ph("what-i-call",  "NOW THAT'S WHAT I CALL FLOW!",     "now-that-s-what-i-call-flow-VWLTMkAUogTDCCVN.mp3",        "uncommon", false, "🌊", ["combo", "clean"]),
    ph("well-dam",     "WELL DAM.",                        "well-dam-TQ8RWyvFkpr6FDT4.mp3",                           "ultra",    false, "😅", ["surprise"],  { exclusive: true, comic: true })
  ];
  var VOCAB = ["DAM-ITE", "FLOW", "DAM", "WATER", "MOMENTUM", "POWER", "PRESSURE", "MOVING WATER", "KEEP IT MOVING"];

  /* ================================================================== CONFIG */
  var config = {
    enabled: true,
    requirePlaying: true,                       // tap-driven comments only while a day is actually being played (tests may relax)
    rng: null,                                  // tests: () => number in [0,1)
    dryRun: false,                              // tests: decide + log, but no sound and no visual
    cooldownMs: { common: 11000, uncommon: 15000, rare: 22000, ultra: 40000 },   // rest after a phrase of that rarity
    minGapMs: 7000,                             // absolute minimum between any two personality phrases
    minTapsBetween: 6,                          // taps of "breathing room" (special moments skip this)
    maxPerLevel: 4, maxPerDay: 1,               // a day = one clock; a level = six days
    holdMs: 1600,                               // how long a due comment may wait for another voice to finish
    milestoneQuietMs: 1500,                     // stay out of the way after a milestone voice
    minRemMs: 2500,                             // never talk in the last seconds of the clock
    idleReturnMs: 25000,                        // a very long pause before the next tap = "rare idle moment" return
    probability: { start: .6, levelup: .7, burst: .75, flow: .35, combo: .5, momentum: .3, power: .6, clean: .55, streak: .6, great: .6, move: .18,
      impressive: .55, recover: .7, surprise: .6, epic: .85, idle: .5, return: .7 },
    rarityWeight: { common: 60, uncommon: 25, rare: 10, ultra: 1.5 },
    coreBoost: 1.5,                             // core signature phrases outweigh the playful pool
    minStrength: { rare: .7 },                  // rare phrases need a strong moment
    tempo: { burstIv: 200, burstRatio: .65, burstBaseMin: 250, steadyCv: .38 },
    slow: { epicRate: .4, epicMs: 1900, comicRate: .25, comicMs: 700 }
  };
  var PE = { version: VERSION, config: config, phrases: PHRASES, vocabulary: VOCAB, get enabled(){ return config.enabled; }, set enabled(v){ config.enabled = !!v; } };

  /* ================================================================== STATE */
  var S = { lastTap: 0, run: 0, ivs: [], base: 0, dayTaps: [], tapsTotal: 0, sinceLast: 99, lastAt: -1e9, lastRarity: "", lastKind: "", lastId: "", kinds: [], rarities: [],
    perLevel: {}, perDay: 0, level: "", cleanDays: 0, dayFailed: false, recover: false, epicPending: false, pend: null, pendT: 0, log: [], sessionStart: now(), lastDay: -1, hist: {} };
  try{ var h = JSON.parse(localStorage.getItem("geiPersonalityHeardV1") || "{}"); if(h && typeof h === "object") S.hist = h; }catch(e){}
  function saveHist(){ try{ localStorage.setItem("geiPersonalityHeardV1", JSON.stringify(S.hist)); }catch(e){} }
  function rng(){ return (config.rng || Math.random)(); }
  function clock(d){ return d && d.ts != null ? d.ts : now(); }
  function gameState(){ try{ return (typeof state !== "undefined" && state) || {}; }catch(e){ return {}; } }
  function budgetMs(){ try{ return WOW_TIMER_ENGINE.fullBudgetMs(); }catch(e){ return 6000; } }

  /* ================================================================== PHRASE SELECTION */
  /* pick(kind, strength): the phrases that fit this KIND of moment, weighted by rarity (and core / freshness), excluding the last phrase and — for rare
     ones — moments that are not strong enough. Ultra-rare phrases only ever appear for their own special kinds. */
  PE.pick = function(kind, strength, rngFn){
    strength = strength == null ? .6 : strength;
    var r = rngFn || rng, pool = PHRASES.filter(function(p){
      if(p.kinds.indexOf(kind) < 0) return false;
      if(p.id === S.lastId) return false;
      if(!p.exclusive && config.minStrength[p.rarity] && strength < config.minStrength[p.rarity]) return false;
      return true;
    });
    /* two rare-or-better phrases in a row would stop feeling rare */
    if(S.rarities.length && (S.rarities[S.rarities.length - 1] === "rare" || S.rarities[S.rarities.length - 1] === "ultra")) pool = pool.filter(function(p){ return p.exclusive || (p.rarity !== "rare" && p.rarity !== "ultra"); });
    if(!pool.length) pool = PHRASES.filter(function(p){ return p.kinds.indexOf(kind) >= 0 && p.id !== S.lastId; });
    if(!pool.length) return null;
    var t = now(), ws = pool.map(function(p){
      var w = config.rarityWeight[p.rarity] || 10; if(p.core) w *= config.coreBoost;
      var rec = S.hist[p.id];
      if(!rec) w *= 2.2;                                         // never heard: "whoa, I haven't heard that one"
      else if(Date.now() - rec.at > 3 * 864e5) w *= 1.6;          // not heard in days
      else if(S.recentIds && S.recentIds.indexOf(p.id) >= 0) w *= .25;
      return w; });
    var tot = 0, i; for(i = 0; i < ws.length; i++) tot += ws[i];
    var x = r() * tot; for(i = 0; i < pool.length; i++){ x -= ws[i]; if(x < 0) return pool[i]; }
    return pool[pool.length - 1];
  };
  S.recentIds = [];

  /* ================================================================== GATING */
  function milestoneRecent(t){ try{ var ms = window.MilestoneProgressEngine && window.MilestoneProgressEngine.state(); return !!(ms && t - ms.lastVoiceAt < config.milestoneQuietMs); }catch(e){ return false; } }
  function blocked(ctx, t){
    var fs = FM.state();
    if(fs.cinematic || fs.levelComplete || fs.cardShown || fs.transition) return "cinematic";
    if(wowNear()) return "wow";                                                                  // a RARE WOW is the higher-value personality moment: it owns the stage
    var st = gameState(); if(config.requirePlaying && st.phase && st.phase !== "playing" && !ctx.afterDay) return "phase";
    if(!ctx.afterDay){ if(fs.flowLevel >= 4) return "final-push"; if(ctx.remMs != null && ctx.remMs < config.minRemMs) return "clock"; if(fs.pressure && fs.pressure.on && fs.pressure.stage >= 2) return "pressure"; }
    return "";
  }
  function restOk(kind, ctx, t){
    var need = Math.max(config.minGapMs, config.cooldownMs[S.lastRarity] || 0);
    if(t - S.lastAt < need) return "cooldown";
    if(!ctx.special && S.sinceLast < config.minTapsBetween) return "breathing";
    var lv = S.perLevel[S.level] || 0; if(lv >= config.maxPerLevel && !ctx.special) return "level-cap";
    if(!ctx.afterDay && !ctx.special && S.perDay >= config.maxPerDay) return "day-cap";
    if(kind === S.lastKind && !ctx.special) return "same-kind";
    if(S.kinds.length >= 3 && S.kinds.slice(-3).every(function(k){ return k === kind; })) return "repeat-kind";
    return "";
  }
  function voiceFree(){ return !FM.voiceBusy() && !FM.fx.othersSpeaking() && FM.fx.sinceVoice() >= 900; }
  function wowNear(){ try{ var w = window.RareWowMomentEngine; return !!(w && (w.active() || w.recent(5000))); }catch(e){ return false; } }
  function stemClaims(){ try{ var s = window.StemIntelligenceEngine; return !!(s && s.claimed && s.claimed()); }catch(e){ return false; } }   // STEM teaches the recovery / retry itself ("Test it. Learn it. Improve it.")

  /* ================================================================== SHOW + SPEAK */
  var css = [
".fmePers{position:absolute;left:50%;top:15%;width:min(90%,440px);display:flex;align-items:center;justify-content:center;gap:.5rem;opacity:0;transform:translate3d(-50%,-50%,0);animation:fmePersIn var(--d,1400ms) cubic-bezier(.2,.9,.25,1) forwards;pointer-events:none;will-change:transform,opacity}",
".fmePersT{position:relative;z-index:1;font:1000 clamp(1.15rem,6.2vw,1.9rem)/1.05 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;letter-spacing:.02em;text-align:center;text-transform:uppercase;color:#fff;text-wrap:balance;max-width:100%;overflow-wrap:anywhere;",
"text-shadow:0 0 .45em #5fd4ff,0 0 1em rgba(40,120,255,.8),0 .07em 0 rgba(0,25,70,.85);-webkit-text-stroke:.03em rgba(0,30,80,.5);paint-order:stroke fill}",
".fmePersAv{position:relative;z-index:1;flex:0 0 auto;width:clamp(34px,10vw,52px);height:clamp(34px,10vw,52px);object-fit:contain;filter:drop-shadow(0 3px 5px rgba(0,0,0,.5));animation:fmePersAv var(--d,1400ms) cubic-bezier(.3,1.6,.4,1) forwards}",
".fmePersR{position:absolute;left:50%;top:50%;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;border:2px solid rgba(170,235,255,.85);opacity:0;animation:fmePersRing 1s ease-out forwards}.fmePersR.r2{animation-delay:.18s}.fmePersR.r3{animation-delay:.36s}",
".fmePers.water{top:28%;width:min(94%,500px)}.fmePers.water .fmePersT{font-size:clamp(1.5rem,8.4vw,2.7rem);text-shadow:0 0 .5em #bff4ff,0 0 1.1em rgba(60,170,255,.95),0 .07em 0 rgba(0,25,70,.85)}",
".fmePersW{position:absolute;left:5%;right:5%;height:12px;overflow:hidden;border-radius:6px;z-index:0}.fmePersW.a{top:-14px}.fmePersW.b{bottom:-14px}",
".fmePersW::before{content:'';position:absolute;left:-28px;right:-28px;top:0;bottom:0;background:radial-gradient(circle at 14px 100%,rgba(120,215,255,.9) 9px,transparent 10px) 0 0/28px 12px repeat-x;animation:fmeWaveX2 .9s linear infinite}.fmePersW.b::before{animation-direction:reverse}",
".fmePers.comic .fmePersT{font-size:clamp(1.4rem,7.4vw,2.3rem);text-shadow:0 0 .4em #ffe27a,0 0 .9em rgba(255,150,30,.8),0 .07em 0 rgba(60,25,0,.85)}",
"@keyframes fmePersIn{0%{opacity:0;transform:translate3d(-50%,-30%,0) scale(.55)}14%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1.14)}26%{transform:translate3d(-50%,-50%,0) scale(.97)}36%{transform:translate3d(-50%,-50%,0) scale(1.03)}82%{opacity:1;transform:translate3d(-50%,-58%,0) scale(1)}100%{opacity:0;transform:translate3d(-50%,-70%,0) scale(1.04)}}",
"@keyframes fmePersAv{0%{opacity:0;transform:scale(.3) rotate(-14deg)}20%{opacity:1;transform:scale(1.2) rotate(8deg)}38%{transform:scale(1) rotate(-4deg)}85%{opacity:1}100%{opacity:0}}",
"@keyframes fmePersRing{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(8)}}",
"@media (prefers-reduced-motion:reduce){.fmePers{animation:fmeCoFade var(--d,1400ms) linear forwards!important}.fmePersR,.fmePersAv{display:none}.fmePersW::before{animation:none}}"
  ].join("\n");
  function addCss(){ if(document.getElementById("fmePersStyle")) return; var s = document.createElement("style"); s.id = "fmePersStyle"; s.textContent = css; document.head.appendChild(s); }
  var visT = 0, visEl = null;
  function show(p, kind){
    try{
      var host = FM.fx.top(); if(!host) return; addCss();
      if(visEl && visEl.parentNode) visEl.parentNode.removeChild(visEl);
      var water = !!p.signature, comic = !!p.comic, dur = water ? 3300 : comic ? 1500 : 1500, el = document.createElement("div");
      el.className = "fmePers" + (water ? " water" : "") + (comic ? " comic" : ""); el.style.setProperty("--d", dur + "ms");
      var src = ""; try{ src = FM.fx.charImage(); }catch(e){}
      var html = "<div class='fmePersR'></div><div class='fmePersR r2'></div>" + (water ? "<div class='fmePersR r3'></div><div class='fmePersW a'></div><div class='fmePersW b'></div>" : "");
      el.innerHTML = html + "<div class='fmePersT'></div>";
      el.querySelector(".fmePersT").textContent = p.emoji + " " + p.text;
      if(src){ var im = document.createElement("img"); im.className = "fmePersAv"; im.alt = ""; im.decoding = "async"; im.src = src; im.addEventListener("error", function(){ if(im.parentNode) im.parentNode.removeChild(im); }); el.insertBefore(im, el.firstChild); }   // the player's OWN selected character
      host.appendChild(el); visEl = el; clearTimeout(visT);
      visT = setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); if(visEl === el) visEl = null; }, dur + 150);
      var b = FM.fx.box(), cy = b.h * (water ? .3 : .16);
      FM.fx.burst(b.w / 2, cy, water ? 22 : 7, { spread: water ? 170 : 90, up: 50, fall: 50, delay: 100 });
      if(water){ var d = FM.fx.damPoint(); FM.fx.ring(d.x, d.y); }
    }catch(e){ warn(e); }
  }
  function commit(p, kind, strength, ctx, t){
    S.lastAt = t; S.lastRarity = p.rarity; S.lastKind = kind; S.lastId = p.id; S.sinceLast = 0; S.perDay++; S.perLevel[S.level] = (S.perLevel[S.level] || 0) + 1;
    S.kinds.push(kind); if(S.kinds.length > 8) S.kinds.shift(); S.rarities.push(p.rarity); if(S.rarities.length > 8) S.rarities.shift();
    S.recentIds.push(p.id); if(S.recentIds.length > 8) S.recentIds.shift();
    var rec = S.hist[p.id] || { n: 0, at: 0 }; rec.n++; rec.at = Date.now(); S.hist[p.id] = rec; saveHist();
  }
  function perform(p, kind, strength, ctx){
    var t = clock(ctx), entry = { kind: kind, id: p.id, rarity: p.rarity, strength: strength, spoke: false, t: t };
    commit(p, kind, strength, ctx, t);
    S.log.push(entry); if(S.log.length > 60) S.log.shift();
    if(config.dryRun) return entry;
    /* signature + comedy moments slightly slow the visual action (never the clocks), then everything resumes */
    var timerSafe = ctx.afterDay || ctx.remMs == null || ctx.remMs > 3500;
    if(timerSafe && p.signature) FM.fx.slow(config.slow.epicRate, config.slow.epicMs);
    else if(timerSafe && p.comic) FM.fx.slow(config.slow.comicRate, config.slow.comicMs);
    show(p, kind);
    FM.say(p.url, { pri: PRI.personality, polite: true, maxMs: 4200, label: "pers:" + p.id }).then(function(ok){ entry.spoke = !!ok; });
    return entry;
  }

  /* ================================================================== DECISION */
  /* consider(kind, strength, ctx): one candidate moment. Returns the log entry when it fired, "held" when it is waiting for the lane, or false. */
  function consider(kind, strength, ctx){
    ctx = ctx || {};
    if(!config.enabled) return false;
    var t = clock(ctx);
    if(blocked(ctx, t)) return false;
    if(restOk(kind, ctx, t)) return false;
    var p0 = config.probability[kind] == null ? .5 : config.probability[kind];
    if(!(ctx.force || rng() < p0 * (.55 + .45 * strength))) return false;     // a moment is a chance, not a guarantee
    var phrase = PE.pick(kind, strength); if(!phrase) return false;
    if(!voiceFree() || milestoneRecent(t)){                                     // never collide: wait a moment for the lane, then re-check everything
      if(config.dryRun) return false;
      hold({ kind: kind, strength: strength, ctx: ctx, phrase: phrase, until: now() + config.holdMs });
      return "held";
    }
    return perform(phrase, kind, strength, ctx);
  }
  function hold(p){
    S.pend = p; clearTimeout(S.pendT);
    (function again(){
      S.pendT = setTimeout(function(){
        var q = S.pend; if(!q) return;
        if(now() > q.until){ S.pend = null; return; }
        var t = now();
        if(blocked(q.ctx, t) || restOk(q.kind, Object.assign({}, q.ctx, { ts: null }), t)){ S.pend = null; return; }
        if(!voiceFree() || milestoneRecent(t)) return again();
        S.pend = null; perform(q.phrase, q.kind, q.strength, q.ctx);
      }, 250);
    })();
  }
  function cancelHold(){ S.pend = null; clearTimeout(S.pendT); }

  /* ================================================================== WATCHING THE PLAYER */
  function mean(a){ var s = 0; for(var i = 0; i < a.length; i++) s += a[i]; return a.length ? s / a.length : 0; }
  function cv(a){ var m = mean(a); if(!m || a.length < 3) return 1; var v = 0; for(var i = 0; i < a.length; i++) v += (a[i] - m) * (a[i] - m); return Math.sqrt(v / a.length) / m; }
  function levelKey(){ var st = gameState(); return String(st.level || 0); }
  function onTap(d){
    var t = clock(d), iv = S.lastTap ? t - S.lastTap : 0, tc = config.tempo;
    S.level = levelKey();
    var longPause = S.lastTap && iv > config.idleReturnMs && S.tapsTotal > 12;
    if(!S.lastTap || iv > 1500) S.run = 1; else S.run++;
    if(S.lastTap && iv < 1500){ S.ivs.push(iv); if(S.ivs.length > 12) S.ivs.shift(); if(iv > 60 && iv < 900) S.base = S.base ? S.base * .9 + iv * .1 : iv; }
    S.lastTap = t; S.dayTaps.push(t); S.tapsTotal++; S.sinceLast++;
    var done = d.required != null && d.remaining != null ? d.required - d.remaining : 0, ctx = { ts: d.ts, remMs: d.remMs, index: d.index };
    var c = [], recent3 = S.ivs.slice(-3), r3 = mean(recent3), streak = d.streak | 0;
    if(longPause) c.push(["idle", .7]);
    if(done === 1 && (S.recover || d.index === 0) && !(S.recover && stemClaims())) c.push([S.recover ? "return" : "start", .8]);        // a new run, or coming back after a failure
    if(S.run >= 4 && recent3.length === 3 && r3 < tc.burstIv && S.base > tc.burstBaseMin && r3 < S.base * tc.burstRatio) c.push(["burst", 1]);
    if(streak >= 10) c.push(["combo", .9]); else if(streak >= 7) c.push(["combo", .7]);
    if(S.run >= 8 && cv(S.ivs.slice(-7)) < tc.steadyCv) c.push(["flow", .65]);
    else if(streak >= 5 && cv(S.ivs.slice(-4)) < tc.steadyCv) c.push(["flow", .5]);
    var l4 = S.ivs.slice(-4); if(l4.length === 4 && l4[0] > l4[1] && l4[1] > l4[2] && l4[2] > l4[3] && l4[3] < l4[0] * .8) c.push(["momentum", .5]);
    c.sort(function(a, b){ return b[1] - a[1]; });
    for(var i = 0; i < c.length; i++){ var r = consider(c[i][0], c[i][1], ctx); if(r) return r; }
    return false;
  }
  function onDay(d){
    var t = clock(d), ctx = { ts: d.ts, afterDay: true, remMs: d.remMs, index: d.index }, bud = budgetMs(), left = d.remMs | 0;
    var taps = S.dayTaps.slice(), ivs = []; for(var i = 1; i < taps.length; i++) ivs.push(taps[i] - taps[i - 1]);
    var steady = taps.length >= 4 && cv(ivs) < config.tempo.steadyCv && mean(ivs) < 520 && Math.max.apply(null, ivs) < 900;
    var fast = left >= bud * .72, near = left > 0 && left < 1200;
    if(!S.dayFailed) S.cleanDays++;
    var out = false, tries = [];
    if(near || d.closeCall && left < 1500) tries.push(["surprise", 1, { special: true }]);                   // unexpected success / recovery from near-failure
    else if(left >= bud * .86) tries.push(["surprise", .6, { special: true }]);                              // so fast it is funny
    if(d.streak >= 24 || (S.cleanDays >= 5 && (d.maxStreak | 0) >= 16)) tries.push(["epic", .95, { special: true }]);   // long streak → THE WATER KNOWS YOUR NAME
    if(S.recover && !stemClaims()){ tries.push(["recover", .8, {}]); }
    if(S.cleanDays >= 3) tries.push(["streak", S.cleanDays >= 5 ? .85 : .65, {}]);
    if(d.index >= 3) tries.push(["power", .8, {}]);
    if(steady && fast) tries.push(["clean", .85, {}]);
    if(fast && d.streak >= 6) tries.push(["impressive", .75, {}]);
    if(S.cleanDays >= 3 && fast) tries.push(["great", .7, {}]);
    if(d.index <= 2) tries.push(["move", .4, {}]);
    S.recover = false;
    for(var j = 0; j < tries.length && !out; j++){ var c2 = Object.assign({}, ctx, tries[j][2]); out = consider(tries[j][0], tries[j][1], c2); if(out === "held") break; }
    S.perDay = 0; S.dayTaps = []; return out;
  }
  function onFail(){ cancelHold(); S.cleanDays = 0; S.dayFailed = true; S.recover = true; S.dayTaps = []; S.run = 0; }
  function onLevel(d){
    cancelHold(); var p = d.perf || {}, st = gameState();
    /* an exceptional level (big streak with no failures, a milestone level, or a strong return after a break) earns THE WATER KNOWS YOUR NAME at the start of the NEXT run */
    S.epicPending = (p.maxCombo >= 16 && !(p.fails > 0)) || ((p.level | 0) > 0 && (p.level | 0) % 6 === 0 && (p.fails | 0) <= 1) || (S.tapsTotal > 0 && Date.now() - (S.hist.__lastPlay || 0) > 864e5 && p.maxCombo >= 12);
    S.hist.__lastPlay = Date.now(); saveHist(); S.cleanDays = 0; S.perDay = 0;
  }
  function onStart(){
    var st = gameState(), lvl = levelKey(); var newLevel = S.level !== "" && lvl !== S.level && S.levelSeen; S.level = lvl; S.levelSeen = true;
    S.dayTaps = []; S.dayFailed = false; S.perDay = 0; S.run = 0;
    if(S.epicPending){ S.epicPending = false; PE._epicDue = true; }
    if(newLevel) PE._levelUpDue = true;
  }
  PE._epicDue = false; PE._levelUpDue = false;
  /* the first tap of a new run speaks the "run start" moments (new level / epic return) */
  var origTap = onTap;
  onTap = function(d){
    if(d.index === 0 && ((d.required | 0) - (d.remaining | 0)) === 1){
      if(PE._epicDue){ PE._epicDue = false; PE._levelUpDue = false; var r = consider("epic", .95, { ts: d.ts, remMs: d.remMs, special: true }); if(r) return r; }
      if(PE._levelUpDue){ PE._levelUpDue = false; var r2 = consider("levelup", .8, { ts: d.ts, remMs: d.remMs, special: true }); if(r2) return r2; }
    }
    return origTap(d);
  };

  window.addEventListener("gei:flow-event", function(e){
    try{
      var d = e.detail || {}; if(!config.enabled) return;
      if(d.type === "tap") onTap(d); else if(d.type === "day") onDay(d); else if(d.type === "fail") onFail(d); else if(d.type === "level") onLevel(d); else if(d.type === "start") onStart(d);
    }catch(err){ warn(err); }
  });
  PE.onEvent = function(type, d){ d = d || {}; if(type === "tap") return onTap(d); if(type === "day") return onDay(d); if(type === "fail") return onFail(d); if(type === "level") return onLevel(d); if(type === "start") return onStart(d); };
  PE.consider = consider;
  PE.state = function(){ return { lastAt: S.lastAt, lastRarity: S.lastRarity, lastKind: S.lastKind, lastId: S.lastId, sinceLast: S.sinceLast, perDay: S.perDay, perLevel: JSON.parse(JSON.stringify(S.perLevel)), cleanDays: S.cleanDays,
    recover: S.recover, epicPending: S.epicPending, held: !!S.pend, log: S.log.slice(), kinds: S.kinds.slice(), rarities: S.rarities.slice() }; };
  PE.reset = function(){ cancelHold(); S.lastAt = -1e9; S.lastRarity = ""; S.lastKind = ""; S.lastId = ""; S.sinceLast = 99; S.perLevel = {}; S.perDay = 0; S.kinds = []; S.rarities = []; S.recentIds = []; S.log = []; S.ivs = []; S.base = 0; S.run = 0; S.lastTap = 0;
    S.cleanDays = 0; S.recover = false; S.epicPending = false; S.dayTaps = []; PE._epicDue = false; PE._levelUpDue = false; };
  PE.show = function(id){ var p = PHRASES.filter(function(x){ return x.id === id; })[0]; if(p) show(p, "demo"); return !!p; };
  window.PersonalityTriggerEngine = PE;
  window.GEIPersonalityEngine = PE;
})();
