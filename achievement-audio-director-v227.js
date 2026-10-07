/* V2.2.7 — ACHIEVEMENT AUDIO DIRECTOR 🎧💧🏆
 *
 * Coordinates VOICE + SFX + MUSIC DUCKING + HYDRAULIC CUES for the Level Complete experience (victory-capsule-v226.js). The capsule
 * only announces what is happening on screen (CustomEvent "gei:achievement" → show / badge / xp / fill / message / rise / release /
 * continue / arrive / hide); this module decides what to hear. It owns no game state: it never reads or writes progress, FL OZ, XP,
 * purchases, entitlements, ownership or storage, and nothing in the game waits for it.
 *
 *   DECISION MODEL   context {level, milestone{number,start,end,within,remaining,complete}, characterId}
 *                    → tier 1..6 (normal / enhanced / approaching / ONE MORE / MILESTONE COMPLETE / rare WOW),
 *                      the progress-voice category (five-more … one-more, milestone-complete), a character reaction (or not).
 *                    The category is derived from the exact remaining count, so the voice can never contradict the screen;
 *                    only the *performance* (which MP3 of the pool, which sparkle layer, how big) is random.
 *   MP3 POOLS        /audio/achievements/<category>/<base>-NN.mp3, see audio/achievements/README.md. Pools come from
 *                    audio/achievements/manifest.json (central list) PLUS auto-discovery of consecutive numbers (…-03.mp3 appears
 *                    by itself, no code change). Nothing is downloaded until a category is needed; a missing / broken / slow MP3
 *                    is skipped and the built-in synth cue (or silence for voice) covers for it.
 *   ONE VOICE LANE   spoken clips are strictly sequential (never two voices at once); priority flushes lower, still-queued lines;
 *                    a line that did not start within MAX_WAIT_MS is dropped; the game's own Beaver / WOW narrators are never talked over.
 *   MUSIC            the existing master bus is used: GEI_AUDIO.voiceBegin/voiceEnd("achievement") ducks music + SFX smoothly and
 *                    restores to the player's real level. Master volume, mute (instantly stops everything) and pause-on-hide respected.
 *   CONTINUE WINS    "continue" cancels the lane + every layer within ~60 ms, releases the duck and plays the whoosh.
 *   TUNABLE          D.config.distribution (70 / 20 / 8 / 2 %), gains, cooldowns.
 */
(function(){
  "use strict";
  if(window.__GEI_ACHIEVEMENT_DIRECTOR__) return;
  var VERSION = "V2.2.7";
  var BASE = "/audio/achievements/";
  var DUCK_TOKEN = "achievement";

  var config = {
    distribution:{ normal:.70, enhanced:.20, special:.08, wow:.02 },   // starting probabilities for ordinary levels; "wow" only when off cooldown
    wowCooldown:6,              // completions that must pass between two rare WOW moments
    charGap:3,                  // completions between two ordinary character reactions
    charChance:{ normal:.10, progress:.30, one:.60, milestone:1 },
    gain:{ voice:.85, sfx:.7, tier:[0, .7, .78, .86, .95, 1, 1] },
    maxWaitMs:4500,             // a queued voice line that has not started by then is dropped
    loadWaitMs:700,             // how long a not-yet-loaded MP3 may delay its start before it is skipped
    maxClipMs:9000,
    maxProbe:12,                // auto-discovery: numbered files tried per category (stops at the first gap)
    discover:true,
    maxSfxLayers:3
  };

  /* category key → folder / file base. "a" → a/a-NN.mp3 ; "a/b" → a/b-NN.mp3 (character-reactions/one-more-NN.mp3, per character: one-more-<id>-NN.mp3) */
  var CATEGORIES = ["level-complete","xp-earned","badge-earned","milestone-progress","five-more","four-more","three-more","two-more","one-more",
    "milestone-complete","next-challenge","flow-forward","next-station","rare-wow",
    "character-reactions/normal","character-reactions/progress","character-reactions/one-more","character-reactions/milestone"];
  var REMAIN_KEY = { 5:"five-more", 4:"four-more", 3:"three-more", 2:"two-more", 1:"one-more" };

  /* ---------- helpers ---------- */
  function clamp(v, a, b){ v = +v; return v < a ? a : v > b ? b : (v === v ? v : a); }
  function now(){ return Date.now(); }
  function GA(){ return window.GEI_AUDIO || null; }
  function muted(){ try{ return !!(GA() && GA().muted); }catch(e){ return false; } }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function level(v){ var a = GA() && GA().state; return a ? a : { masterVolume:1, sfxVolume:1 }; }
  function dirOf(key){ return key.split("/")[0]; }
  function baseOf(key){ var p = key.split("/"); return p[p.length - 1]; }
  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function urlFor(key, i, charId){ return BASE + dirOf(key) + "/" + baseOf(key) + (charId ? "-" + charId : "") + "-" + pad(i) + ".mp3"; }
  function normalize(key, entry){
    entry = String(entry || ""); if(!entry) return "";
    if(/^(https?:)?\/\//.test(entry) || entry.charAt(0) === "/") return entry;
    return BASE + dirOf(key) + "/" + entry;
  }

  /* ---------- pools: manifest + lazy discovery (nothing is downloaded here, only existence is checked) ---------- */
  var pools = {};                          // key → { urls:[], probed:false, probing:false }
  var manifest = { loaded:false, loading:false };
  function pool(key){ return pools[key] || (pools[key] = { urls:[], probed:false, probing:false }); }
  function addUrls(key, list){
    var p = pool(key);
    (list || []).forEach(function(e){ var u = normalize(key, e); if(u && p.urls.indexOf(u) < 0) p.urls.push(u); });
  }
  function head(url){
    return fetch(url, { method:"HEAD", cache:"no-cache" }).then(function(r){
      var ct = (r.headers.get("content-type") || "").toLowerCase();
      return !!(r.ok && (/audio|mpeg|octet-stream/.test(ct)));
    }).catch(function(){ return false; });
  }
  function loadManifest(){
    if(manifest.loaded || manifest.loading) return manifest.promise;
    manifest.loading = true;
    manifest.promise = fetch(BASE + "manifest.json", { cache:"no-cache" }).then(function(r){
      if(!r.ok || !/json/i.test(r.headers.get("content-type") || "")) throw 0;
      return r.json();
    }).then(function(j){
      var cats = (j && j.categories) || j || {};
      if(j && typeof j.discover === "boolean") config.discover = j.discover;
      Object.keys(cats).forEach(function(k){ if(Array.isArray(cats[k])) addUrls(k, cats[k]); });
    }).catch(function(){}).then(function(){ manifest.loaded = true; manifest.loading = false; });
    return manifest.promise;
  }
  /* sequential HEAD probe …-01, …-02 … stops at the first number that is neither known nor present */
  function discover(key, charId){
    var p = pool(key + (charId ? "|" + charId : ""));
    if(p.probed || p.probing || !config.discover) return Promise.resolve();
    p.probing = true;
    var target = pool(key);
    return loadManifest().then(function(){
      var i = 1;
      function step(){
        if(i > config.maxProbe) return;
        var u = urlFor(key, i, charId);
        if(target.urls.indexOf(u) >= 0 || (charId && p.urls.indexOf(u) >= 0)){ i++; return step(); }
        return head(u).then(function(ok){
          if(!ok) return;
          if(charId) p.urls.push(u); else target.urls.push(u);
          i++; return step();
        });
      }
      return step();
    }).catch(function(){}).then(function(){ p.probing = false; p.probed = true; });
  }
  function warm(){                         // idle-time, one category at a time; never on the critical path
    var keys = CATEGORIES.slice(), i = 0;
    (function next(){
      if(i >= keys.length) return;
      discover(keys[i++]).then(function(){ setTimeout(next, 120); });
    })();
  }

  var lastPick = {};
  function pickUrl(key, charId){
    var list = [];
    if(charId){ var cp = pools[key + "|" + charId]; if(cp && cp.urls.length) list = cp.urls; }
    if(!list.length) list = pool(key).urls;
    if(!list.length) return "";
    var i = Math.floor(rng() * list.length);
    if(list.length > 1 && lastPick[key] === list[i]) i = (i + 1) % list.length;   // never the same take twice in a row
    lastPick[key] = list[i];
    return list[i];
  }
  var rng = Math.random;

  /* ---------- playback engine (HTMLAudioElement, lazily created, small LRU; swappable for tests) ---------- */
  function makeEngine(){
    var cache = {}, order = [], broken = {};
    function get(url){
      var e = cache[url]; if(e) return e;
      if(order.length >= 10){ var old = order.shift(); try{ cache[old].src = ""; }catch(x){} delete cache[old]; }
      e = new Audio(); e.preload = "auto"; e.src = url; cache[url] = e; order.push(url);
      return e;
    }
    return {
      preload:function(url){ if(url && !broken[url]) try{ get(url); }catch(e){} },
      release:function(){ Object.keys(cache).forEach(function(u){ try{ cache[u].pause(); cache[u].src = ""; }catch(e){} }); cache = {}; order = []; },
      play:function(url, o){
        o = o || {};
        var h = { url:url, stopped:false, stop:function(){} };
        h.ended = new Promise(function(res){
          if(!url || broken[url]){ res(false); return; }
          var el, done = false, timers = [];
          try{ el = get(url); }catch(e){ res(false); return; }
          function fin(ok){ if(done) return; done = true; timers.forEach(clearTimeout); el.onended = el.onerror = null; res(ok); }
          h.stop = function(){
            if(done) return; h.stopped = true;
            var v = el.volume, n = 0;
            var f = setInterval(function(){ n++; try{ el.volume = Math.max(0, v * (1 - n / 3)); }catch(e){} if(n >= 3){ clearInterval(f); try{ el.pause(); el.volume = v; }catch(e){} } }, 20);
            fin(false);
          };
          el.onended = function(){ fin(true); };
          el.onerror = function(){ broken[url] = 1; fin(false); };
          timers.push(setTimeout(function(){ try{ el.pause(); }catch(e){} fin(true); }, o.max || config.maxClipMs));
          function go(){
            if(done) return;
            try{ el.volume = clamp(o.volume, 0, 1); el.currentTime = 0; }catch(e){}
            var pr; try{ pr = el.play(); }catch(e){ fin(false); return; }
            if(pr && pr.catch) pr.catch(function(){ fin(false); });   // autoplay blocked etc.: silently skip
          }
          if(el.readyState >= 2) go();
          else {
            timers.push(setTimeout(function(){ fin(false); }, o.wait || config.loadWaitMs));   // too slow: skip, never play late
            var once = function(){ el.removeEventListener("canplay", once); go(); };
            el.addEventListener("canplay", once);
            try{ el.load(); }catch(e){}
          }
        });
        return h;
      }
    };
  }
  var engine = makeEngine();

  /* ---------- synth cues: the same short voices the game already uses (SFX bus → master volume + mute) ---------- */
  function synth(kind, gesture, tier){
    if(muted()) return;
    var V = window.damVoice, N = window.damNoise, g = !!gesture, k = clamp(config.gain.tier[tier || 1] || .8, .5, 1);
    try{
      if(typeof V !== "function") return;
      if(kind === "sparkle"){ V({ freq:1760, time:.1, gain:.007 * k, gesture:g, priority:0 }); V({ freq:2349, time:.14, gain:.006 * k, delay:.06, gesture:g, priority:0 }); }
      else if(kind === "xp"){ V({ freq:1318, time:.09, gain:.008 * k, gesture:g, priority:0 }); V({ freq:1760, time:.12, gain:.006 * k, delay:.07, gesture:g, priority:0 }); }
      else if(kind === "badge"){ V({ freq:1568, time:.1, gain:.008 * k, gesture:g, priority:0 }); V({ freq:2093, time:.1, gain:.007 * k, delay:.07, gesture:g, priority:0 }); V({ freq:2637, time:.16, gain:.006 * k, delay:.14, gesture:g, priority:0 }); }
      else if(kind === "pulse"){ if(typeof N === "function") N({ dur:.34, from:400, to:900, gain:.014 * k, filter:"lowpass", gesture:g }); V({ freq:660, to:880, time:.12, gain:.008 * k, gesture:g, priority:0 }); }
      else if(kind === "sting"){ [988, 1319, 1760].forEach(function(f, i){ V({ freq:f, time:.12, gain:.011 * k, delay:i * .08, gesture:g, priority:0 }); }); }
      else if(kind === "rise"){ if(typeof N === "function") N({ dur:.55, from:300, to:1800, gain:.02 * k, filter:"lowpass", gesture:g }); }
      else if(kind === "release"){
        if(typeof N === "function") N({ dur:.5, from:1800, to:400, gain:.03 * k, filter:"lowpass", gesture:g });
        [784, 988, 1175, 1568].forEach(function(f, i){ V({ freq:f, time:.3, gain:.01 * k, delay:.05 + i * .06, gesture:g, priority:0 }); });
      }
      else if(kind === "shimmer"){ [1568, 1976, 2349, 2794, 3136].forEach(function(f, i){ V({ freq:f, time:.2, gain:.006, delay:i * .07, gesture:g, priority:0 }); }); }
      else if(kind === "whoosh"){ if(typeof N === "function") N({ dur:.7, from:300, to:1500, gain:.02, filter:"lowpass", gesture:g }); }
      else if(kind === "arrive"){ V({ freq:880, time:.1, gain:.01, gesture:g, priority:0 }); V({ freq:1175, time:.16, gain:.009, delay:.08, gesture:g, priority:0 }); }
    }catch(e){}
  }

  /* ---------- the one voice lane ---------- */
  var lane = { q:[], cur:null, ducked:false, endT:0, token:0 };
  function otherSpeaking(){
    try{ var a = GA(); if(!a) return false; if(a.beaver && a.beaver.speaking) return true; if(a.wow && a.wow.speaking) return true; if(a.zone === "DAM_MAP") return true; }catch(e){}
    try{ if(window.FlowMomentEngine && window.FlowMomentEngine.voiceBusy()) return true; }catch(e){}   // V2.2.10: a Flow Moment voice (priority 1–2) is never talked over
    return false;
  }
  function duck(on){
    var a = GA(); if(!a) return;
    try{
      if(on && !lane.ducked){ lane.ducked = true; a.voiceBegin(DUCK_TOKEN); }
      else if(!on && lane.ducked){ lane.ducked = false; a.voiceEnd(DUCK_TOKEN); }
    }catch(e){}
  }
  function voiceVolume(tier){ var s = level(); return clamp(s.masterVolume * config.gain.voice * (config.gain.tier[tier || 1] || .8), 0, 1); }
  function sfxVolume(tier){ var s = level(); return clamp(s.masterVolume * s.sfxVolume * config.gain.sfx * (config.gain.tier[tier || 1] || .8), 0, 1); }
  function enqueueVoice(key, pri, charId){
    if(muted() || !cur) return false;
    var url = pickFor(key, charId); if(!url) return false;
    lane.q.push({ key:key, url:url, pri:pri, at:now(), tok:cur.id });
    engine.preload(url); pump(); return true;
  }
  function pickFor(key, charId){                          // one take per category per card: what is preloaded is what is played
    var k = key + "|" + (charId || ""); if(cur.picks[k] === undefined) cur.picks[k] = pickUrl(key, charId);
    return cur.picks[k];
  }
  function flushBelow(pri){ lane.q = lane.q.filter(function(it){ return it.pri >= pri; }); }
  function pump(){
    if(lane.cur) return;
    clearTimeout(lane.endT);
    var it;
    while((it = lane.q.shift())){
      if(!cur || it.tok !== cur.id) continue;                           // belongs to a card that is gone
      if(now() - it.at > config.maxWaitMs) continue;                    // too late to be relevant
      if(muted() || otherSpeaking()) continue;                          // never talk over the game's narrators, never when muted
      break;
    }
    if(!it){ lane.endT = setTimeout(function(){ if(!lane.cur && !lane.q.length) duck(false); }, 220); return; }
    duck(true);
    var h = engine.play(it.url, { volume:voiceVolume(cur.tier), wait:config.loadWaitMs });
    lane.cur = { item:it, h:h };
    h.ended.then(function(){ lane.cur = null; setTimeout(pump, 110); });
    emitDebug("voice", it.key);
  }
  var layers = [];
  function layer(key, synthKind, o){
    o = o || {};
    if(muted() || !cur) return;
    var tier = cur.tier, gesture = !!o.gesture;
    var url = key ? pickUrl(key) : "";
    if(url && layers.length < config.maxSfxLayers){
      var h = engine.play(url, { volume:sfxVolume(tier), max:3500, wait:o.wait || 350 });
      layers.push(h); h.ended.then(function(ok){ var i = layers.indexOf(h); if(i >= 0) layers.splice(i, 1); if(!ok && !h.stopped && synthKind) synth(synthKind, gesture, tier); });
      emitDebug("layer", key);
    } else if(synthKind) synth(synthKind, gesture, tier);
  }
  function cancelVoice(){
    lane.q = []; clearTimeout(lane.endT);
    if(lane.cur){ try{ lane.cur.h.stop(); }catch(e){} lane.cur = null; }
    duck(false);
  }
  function cancelAll(){
    cancelVoice();
    layers.splice(0).forEach(function(h){ try{ h.stop(); }catch(e){} });
  }

  /* ---------- decision model ---------- */
  var cur = null, seq = 0, completions = 0, lastWowAt = -99, lastCharAt = -99;
  var log = [];
  function emitDebug(kind, what){ log.push(kind + ":" + what); if(log.length > 40) log.shift(); }
  function decide(ctx, r){
    var m = ctx.milestone, rem = m.remaining, complete = !!m.complete, one = rem === 1 && !complete;
    var base = complete ? 5 : one ? 4 : (rem >= 2 && rem <= 3 ? 3 : 1);
    var roll = (r || rng)(), d = config.distribution, tier = base, variant = "normal", rare = false;
    if(!complete && !one){
      var wowOk = completions - lastWowAt >= config.wowCooldown;
      if(roll < d.wow && wowOk){ tier = 6; variant = "wow"; rare = true; }
      else if(roll < d.wow + d.special){ tier = Math.max(base, 3); variant = "special"; }
      else if(roll < d.wow + d.special + d.enhanced){ tier = Math.max(base, 2); variant = "enhanced"; }
    }
    var type = complete ? "milestone" : one ? "one" : rem <= 3 ? "progress" : "normal";
    var charOk = type === "milestone" || (completions - lastCharAt >= config.charGap) || type === "one";
    var chance = config.charChance[type] || 0;
    var char = charOk && (r || rng)() < chance;
    return { tier:tier, variant:variant, rare:rare, type:type, progressKey:complete ? "milestone-complete" : (REMAIN_KEY[rem] || ""), character:char,
      charKey:"character-reactions/" + (type === "milestone" ? "milestone" : type === "one" ? "one-more" : type === "progress" ? "progress" : "normal") };
  }
  function begin(ctx){
    var m = ctx && ctx.milestone; if(!m) return null;
    cancelAll();
    var plan = decide(ctx);
    completions++;
    if(plan.rare) lastWowAt = completions;
    if(plan.character) lastCharAt = completions;
    cur = { id:++seq, ctx:ctx, tier:plan.tier, plan:plan, charId:ctx.characterId || "", picks:{} };
    // lazily bring this card's pools into existence (cheap HEADs), preload the lines it is most likely to speak
    [ "level-complete", plan.progressKey, plan.character ? plan.charKey : "", plan.rare ? "rare-wow" : "" ].forEach(function(k){
      if(!k) return;
      discover(k); if(plan.character && k === plan.charKey && cur.charId) discover(k, cur.charId);
    });
    var mine = cur;
    loadManifest().then(function(){ if(cur === mine){ engine.preload(pickFor("level-complete")); if(plan.progressKey) engine.preload(pickFor(plan.progressKey)); } });
    lastPlan = plan;
    return { tier:plan.tier, rare:plan.rare, variant:plan.variant, type:plan.type, progressKey:plan.progressKey, character:plan.character };
  }
  var lastPlan = null;

  /* the capsule's timeline, as events — the audio is locked to what the player sees */
  var HANDLERS = {
    show:function(){
      enqueueVoice("level-complete", 1);
      if(cur.tier >= 2) layer(null, "sparkle");
      if(cur.plan.rare) layer("rare-wow", "shimmer");
    },
    badge:function(){ layer("badge-earned", "badge"); },
    xp:function(){ layer("xp-earned", "xp"); },
    fill:function(){ layer("milestone-progress", "pulse"); },
    message:function(){
      var p = cur.plan;
      if(p.type === "milestone") return;                         // the milestone moment (release) speaks instead
      if(p.type === "one") layer(null, "sting");                  // anticipation before the voice
      if(p.progressKey) enqueueVoice(p.progressKey, 2);
      if(p.character) enqueueVoice(p.charKey, 3, cur.charId);
    },
    rise:function(){ layer(null, "rise"); },
    release:function(){
      var p = cur.plan;
      flushBelow(4);                                              // the big line goes next, ahead of any lower line still waiting
      layer(null, "release");
      enqueueVoice("milestone-complete", 4);
      enqueueVoice("next-challenge", 4);
      if(p.character) enqueueVoice(p.charKey, 4, cur.charId);
    },
    continue:function(d){
      cancelAll();                                                // the player's input always wins
      var gesture = !(d && d.gesture === false);
      var url = pickUrl("flow-forward");
      if(url && !muted()){ var h = engine.play(url, { volume:sfxVolume(cur ? cur.tier : 3), max:2500, wait:250 }); layers.push(h); h.ended.then(function(ok){ var i = layers.indexOf(h); if(i >= 0) layers.splice(i, 1); if(!ok && !h.stopped) synth("whoosh", gesture); }); }
      else synth("whoosh", gesture);
    },
    arrive:function(d){
      var url = pickUrl("next-station"), gesture = !(d && d.gesture === false);
      if(url && !muted()){ var h = engine.play(url, { volume:sfxVolume(3), max:2000, wait:250 }); layers.push(h); h.ended.then(function(ok){ var i = layers.indexOf(h); if(i >= 0) layers.splice(i, 1); if(!ok && !h.stopped) synth("arrive", gesture); }); }
      else synth("arrive", gesture);
    },
    hide:function(){ cancelVoice(); cur = null; }       // the whoosh / arrival tone of FLOW FORWARD finish on their own
  };
  function event(type, detail){
    var fn = HANDLERS[type]; if(!fn) return;
    if(!cur && type !== "hide") return;
    if(muted() && type !== "hide"){ cancelAll(); return; }
    try{ fn(detail || {}); }catch(e){}
  }
  window.addEventListener("gei:achievement", function(e){ var d = e.detail || {}; event(d.type, d); });
  window.addEventListener("gei:audio-mute", function(e){ if(e.detail && e.detail.muted) cancelAll(); });
  document.addEventListener("visibilitychange", function(){ if(document.hidden) cancelAll(); });
  window.addEventListener("pagehide", function(){ cancelAll(); engine.release(); });

  function api_registerClips(key, list){ addUrls(key, list); pool(key).probed = true; }
  var api = {
    version:VERSION, presentationOnly:true, config:config, categories:CATEGORIES.slice(), base:BASE,
    begin:begin, event:event, decide:decide, warm:warm, cancel:cancelAll,
    pool:function(key){ return pool(key).urls.slice(); }, registerClips:api_registerClips, addCategory:function(key){ if(CATEGORIES.indexOf(key) < 0) CATEGORIES.push(key); return pool(key); },
    discover:discover, loadManifest:loadManifest, urlFor:urlFor,
    state:function(){ return { tier:cur && cur.tier, plan:lastPlan, playing:lane.cur ? lane.cur.item.key : null, queued:lane.q.map(function(i){ return i.key; }), layers:layers.length, ducked:lane.ducked, completions:completions, log:log.slice() }; },
    _test:{ setEngine:function(e){ engine = e; }, setRng:function(f){ rng = f || Math.random; }, reset:function(){ cancelAll(); cur = null; completions = 0; lastWowAt = -99; lastCharAt = -99; lastPick = {}; log = []; }, engine:function(){ return engine; } }
  };
  window.__GEI_ACHIEVEMENT_DIRECTOR__ = Object.freeze(api);

  function idle(fn){ try{ (window.requestIdleCallback || function(f){ return setTimeout(f, 2500); })(fn, { timeout:6000 }); }catch(e){ setTimeout(fn, 3000); } }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ idle(warm); }, { once:true });
  else idle(warm);
})();
