/* V2.2.11 — MILESTONE PROGRESS ENGINE + LEVEL COMPLETE VOICE ENGINE 🎙️🌊
 *
 * "The game is TALKING to the player."  Two small engines that sit on the Flow Moment Engine (flow-moment-engine-v2210.js):
 * they reuse its single voice lane (one spoken clip at a time, priorities, music ducking, mute / hidden tab / Dam Map zone), its big
 * water-flow callouts and its environment (flow level, anticipation, victory sequence). They own NO game state: they never read or write
 * progress, FL OZ, XP, purchases or the save, and nothing waits for them.
 *
 *   MilestoneProgressEngine     remaining taps → "5 MORE! … ONE MORE!" word + ONE phrase from that milestone's pool (never the same
 *                               clip twice in a row, never every clip) + a stronger environment at each step. ONE MORE is the peak.
 *                               "The Dam Is About to Break" is a playful pressure line and is withheld when the real clock is nearly out,
 *                               so it can never be mistaken for the failure story (failure = timer expiry → the Dam Failure Cinematic).
 *   LevelCompleteVoiceEngine    ONE victory phrase per completed level, chosen from five categories by how the player performed
 *                               (first completion · high combo · fast · clean · struggled · repeat), never the same phrase twice in a row.
 *
 * Voice priority (smaller wins): 1 failure cinematic · 2 LEVEL COMPLETE · 3 ONE MORE · 3.5 timer warnings · 4 milestone progress ·
 * 5 achievement / combo · 6 character reaction · music is ducked, never a voice.
 */
(function(){
  "use strict";
  var FM = window.FlowMomentEngine;
  if(!FM || window.MilestoneProgressEngine) return;
  var VERSION = "V2.2.11";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var PRI = FM.priorities;
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function pickOne(a, rng){ return a[Math.floor((rng || Math.random)() * a.length) % a.length]; }
  function warn(e){ try{ console.warn("[FlowVoices] " + (e && e.message || e)); }catch(_){} }
  function clip(id, text, file, extra){ var o = { id: id, text: text, url: CDN + file }; if(extra) for(var k in extra) o[k] = extra[k]; return o; }

  /* ================================================================== MILESTONE PROGRESS */
  var POOLS = {
    5: [ clip("five-build",   "BUILD THAT FLOW!",                    "five-more-build-that-flow-ts2wjbZHrm0yAxw6.mp3"),
         clip("five-filling", "THE DAM IS FILLING!",                 "five-more-the-dam-is-filling-hpmAuOdboY1DUCC5.mp3"),
         clip("five-started", "DAM-ITE, WE'RE JUST GETTING STARTED!", "five-more-dam-ite-we-re-just-getting-started-tQRxVwUuXGZR0wMP.mp3"),
         clip("five-keep",    "LET'S KEEP THAT FLOW MOVING!",        "five-more-let-s-keep-that-flow-moving-vYei4EO2G3vp0hqV.mp3") ],
    4: [ clip("four-pressure", "THE PRESSURE'S BUILDING!",           "four-more-the-pressure-s-building-gDjrcGDPSUYmEM6Y.mp3"),
         clip("four-water",    "KEEP THAT WATER COMING!",            "four-more-keep-that-water-coming-jCm29T7g4feUWNGA.mp3"),
         clip("four-moving",   "NOW WE'RE MOVING!",                  "four-more-now-we-re-moving-kEcGGyPobWqJDTq6.mp3") ],
    3: [ clip("three-talking",  "NOW WE'RE TALKING!",                "three-more-now-we-re-talking-LmqyLUWl9TAtWca4.mp3"),
         clip("three-alive",    "KEEP THE FLOW ALIVE!",              "three-more-keep-the-flow-alive-DUN4SCioCF0lfKZ8.mp3"),
         clip("three-momentum", "FEEL THAT MOMENTUM!",               "three-more-feel-that-momentum-LQnfjtV8cBeejS8a.mp3") ],
    2: [ clip("two-letup",   "DON'T LET UP!",                        "two-more-don-t-let-up-qtAVUiOhQzSZgjV9.mp3"),
         clip("two-almost",  "WE'RE ALMOST THERE!",                  "two-more-we-re-almost-there-fiFC7rOr7TiuzUZS.mp3"),
         clip("two-moving",  "KEEP IT DAM MOVING!",                  "two-more-keep-it-dam-moving-x1nZyabZxJF2NcDp.mp3") ],
    1: [ clip("one-damite",  "DAM-ITE!",                             "one-more-dam-ite-XBNQ9WXg3u9G9CfQ.mp3"),
         clip("one-finish",  "LET'S FINISH THIS FLOW!",              "one-more-let-s-finish-this-flow-tlhawbqLcV3ZM94r.mp3"),
         clip("one-break",   "THE DAM IS ABOUT TO BREAK!",           "one-more-the-dam-is-about-to-break-rz9MU5Fqq1xhsrVE.mp3", { playful: true }) ]
  };
  var EMOJI = { 5: "💧", 4: "🌊", 3: "🌊", 2: "⚡", 1: "⚠️" };
  var TIER  = { 5: 2, 4: 2, 3: 3, 2: 4, 1: 5 };
  var ME = {
    version: VERSION, enabled: true, pools: POOLS,
    config: {
      minGapMs: 1800,        // two ordinary milestone voices are never closer than this (fast tappers hear the key lines, slow tappers hear all)
      oneMoreGapMs: 700,     // ONE MORE may follow another voice quickly — it is the peak
      playfulBreakMinMs: 1800 // "The Dam Is About to Break" only while the real clock still has this much left
    }
  };
  var obj = { key: "", announced: {} }, last = {}, lastVoiceAt = -1e9, log = [];

  /* select(remaining, ctx, rng) → one clip of that milestone's pool: never the previous clip of the same milestone, and the playful
     "about to break" line is withheld when the timer is nearly out. */
  ME.select = function(remaining, ctx, rng){
    var pool = POOLS[remaining]; if(!pool) return null;
    ctx = ctx || {};
    var ok = pool.filter(function(c){ return !(c.playful && ctx.remMs > 0 && ctx.remMs < ME.config.playfulBreakMinMs); });
    if(!ok.length) ok = pool.slice();
    if(ok.length > 1 && last[remaining]) ok = ok.filter(function(c){ return c.id !== last[remaining]; });
    var c = pickOne(ok, rng); last[remaining] = c.id; return c;
  };
  /* onProgress({ remaining, required, key, remMs }) — call after every counted tap. Fires each remaining-count once per objective. */
  ME.onProgress = function(info){
    try{
      if(!ME.enabled || !info) return null;
      var rem = info.remaining | 0, key = String(info.key || "");
      if(key !== obj.key) obj = { key: key, announced: {} };
      if(rem < 1 || rem > 5 || obj.announced[rem]) return null;
      obj.announced[rem] = 1;
      var pick = ME.select(rem, info), t = now(), isOne = rem === 1;
      FM.setFlowLevel(6 - rem);
      if(isOne) FM.markOneMore();
      var combo = FM.claimCombo();
      FM.callout({ key: "ms" + rem, emoji: EMOJI[rem], text: isOne ? "ONE MORE!" : rem + " MORE!", line2: pick.text, sub: combo ? combo.text : "",
        tier: TIER[rem], cls: "flow ms" + rem, wave: true, cooldown: 0, gap: 250, hold: isOne ? 750 : 0, top: 36, ms: isOne ? 1500 : rem === 2 ? 1350 : 1200 });
      var gap = isOne ? ME.config.oneMoreGapMs : ME.config.minGapMs, spoke = false;
      if(t - lastVoiceAt >= gap && (isOne || !FM.voiceBusy())){
        lastVoiceAt = t; spoke = true;
        FM.say(pick.url, { pri: isOne ? PRI.oneMore : PRI.milestone, maxMs: 4200, label: pick.id });
      }
      log.push({ rem: rem, id: pick.id, spoke: spoke }); if(log.length > 40) log.shift();
      return { remaining: rem, clip: pick, spoke: spoke };
    }catch(e){ warn(e); return null; }
  };
  ME.reset = function(){ obj = { key: "", announced: {} }; };
  ME.state = function(){ return { key: obj.key, announced: Object.keys(obj.announced), last: JSON.parse(JSON.stringify(last)), lastVoiceAt: lastVoiceAt, log: log.slice() }; };
  window.addEventListener("gei:flow-reset", function(){ ME.reset(); });

  /* ================================================================== LEVEL COMPLETE VOICE */
  var VICTORY = [
    clip("didit",    "YOU DID IT, DAM-ITE!",           "you-did-it-dam-ite-j2bmIkuZmuQZ4n84.mp3",                  { cat: "celebration" }),
    clip("boom",     "BOOM! LEVEL CLEARED!",           "boom-level-cleared-ha4C9IafPc8lgIcL.mp3",                  { cat: "celebration" }),
    clip("mastered", "YOU JUST MASTERED THAT!",        "you-just-mastered-that-cIU70jTPW8e8d1kU.mp3",              { cat: "mastery" }),
    clip("pro",      "YOU HANDLED THAT LIKE A PRO!",   "you-handled-that-like-a-pro-dqoT6JwkpbNqmFzR.mp3",         { cat: "mastery" }),
    clip("complete", "FLOW COMPLETE!",                 "flow-complete-8L6bhjIslkeyBL6T.mp3",                       { cat: "flow" }),
    clip("clean",    "THAT'S A CLEAN FLOW!",           "that-s-a-clean-flow-VhdopC3kvTvnkVUe.mp3",                 { cat: "flow" }),
    clip("water",    "THAT'S HOW YOU MOVE WATER!",     "that-s-how-you-move-water-E8J0FvIVGgH9iDLt.mp3",           { cat: "flow" }),
    clip("another",  "THAT'S ANOTHER ONE IN THE FLOW!", "that-s-another-one-in-the-flow-mEaPnEKjKeWEwlPd.mp3",     { cat: "flow" }),
    clip("good",     "DAM-ITE, YOU'RE GETTING GOOD!",  "dam-ite-you-re-getting-good-rhkaPnF5YW8HijHh.mp3",         { cat: "encouragement" }),
    clip("keep",     "LEVEL CLEARED — KEEP MOVING!",   "level-cleared-keep-moving-oc55q8EPIhpkHnd7.mp3",           { cat: "encouragement" }),
    clip("bag",      "THAT LEVEL IS IN THE BAG!",      "that-level-is-in-the-bag-WRDirIiJelf6ARas.mp3",            { cat: "casual" })
  ];
  var LC = {
    version: VERSION, pool: VICTORY,
    config: { highCombo: 10, fastRemMs: 3500, cleanRemMs: 2000, struggleFails: 2, historyKeep: 4, preferBoost: 5, firstLockChance: .85 }
  };
  var history = [], spokeAt = -1e9;
  try{ var h0 = JSON.parse(sessionStorage.getItem("geiLcvHistory") || "[]"); if(Array.isArray(h0)) history = h0.slice(-LC.config.historyKeep); }catch(e){}
  function byId(id){ for(var i = 0; i < VICTORY.length; i++) if(VICTORY[i].id === id) return VICTORY[i]; return null; }
  function wpick(items, weights, rng){
    var tot = 0, i; for(i = 0; i < weights.length; i++) tot += weights[i];
    var r = (rng || Math.random)() * tot; for(i = 0; i < items.length; i++){ r -= weights[i]; if(r < 0) return items[i]; }
    return items[items.length - 1];
  }
  /* analyse(perf) → category weights + the clip each signal prefers. perf = FlowMomentEngine.levelPerf(). */
  LC.analyse = function(perf){
    perf = perf || {}; var c = LC.config;
    var w = { celebration: 1.2, mastery: .3, flow: 1.2, encouragement: .1, casual: 1.2 }, prefer = [], reasons = [];
    var first = !!perf.first, high = (perf.maxCombo | 0) >= c.highCombo && !(perf.fails > 0);
    var fast = perf.minRemMs >= c.fastRemMs || perf.finalRemMs >= c.fastRemMs + 500;
    var clean = !(perf.fails > 0) && perf.minRemMs >= c.cleanRemMs;
    var struggle = (perf.fails | 0) >= c.struggleFails;
    if(first){ w.celebration += 100; prefer.push("didit"); reasons.push("first"); }
    if(high){ w.mastery += 8; prefer.push("mastered", "pro"); reasons.push("high-combo"); }
    if(fast){ w.celebration += 3; prefer.push("boom"); reasons.push("fast"); }
    if(clean){ w.flow += 4; prefer.push("clean"); reasons.push("clean"); }
    if(struggle){ w.encouragement += 8; prefer.push("good", "keep"); reasons.push("struggled"); }
    if((perf.completed | 0) > 1 && !first){ prefer.push("another"); reasons.push("repeat"); }
    if(!reasons.length) reasons.push("normal");
    return { weights: w, prefer: prefer, reasons: reasons };
  };
  /* pick(perf, rng) → { id, text, url, cat, reason }. Performance-aware, varied, never the same phrase twice in a row. */
  LC.pick = function(perf, rng){
    var a = LC.analyse(perf), lastId = history[history.length - 1], c = LC.config;
    /* a strong, specific signal usually gets its own line (first-time → "YOU DID IT, DAM-ITE!") — but never twice in a row */
    var pref = a.prefer.map(byId).filter(function(x){ return x && x.id !== lastId; });
    if(pref.length && (rng || Math.random)() < c.firstLockChance) return mark(pref[0], a);
    var cats = Object.keys(a.weights), cat = wpick(cats, cats.map(function(k){ return a.weights[k]; }), rng);
    var cand = VICTORY.filter(function(x){ return x.cat === cat && x.id !== lastId; });
    if(!cand.length) cand = VICTORY.filter(function(x){ return x.id !== lastId; });
    var ws = cand.map(function(x){ var wt = a.prefer.indexOf(x.id) >= 0 ? c.preferBoost : 1; var age = history.lastIndexOf(x.id); if(age >= 0) wt *= .3; return wt; });
    return mark(wpick(cand, ws, rng), a);
  };
  function mark(clipObj, a){ return { id: clipObj.id, text: clipObj.text, url: clipObj.url, cat: clipObj.cat, reason: a.reasons.join("+") }; }
  /* speak(pick) → Promise that resolves when the line ends (or is skipped / muted / blocked). Priority 2: only the failure cinematic outranks it. */
  LC.speak = function(p){
    if(!p) return Promise.resolve(false);
    history.push(p.id); while(history.length > LC.config.historyKeep) history.shift();
    try{ sessionStorage.setItem("geiLcvHistory", JSON.stringify(history)); }catch(e){}
    spokeAt = now();
    return FM.say(p.url, { pri: PRI.levelComplete, maxMs: 5200, label: p.id });
  };
  LC.announce = function(perf){ var p = LC.pick(perf); LC.speak(p); return p; };
  LC.spokeRecently = function(ms){ return now() - spokeAt < (ms || 8000); };
  LC.history = function(){ return history.slice(); };
  LC.resetHistory = function(){ history = []; try{ sessionStorage.removeItem("geiLcvHistory"); }catch(e){} };

  window.MilestoneProgressEngine = ME;
  window.LevelCompleteVoiceEngine = LC;
})();
