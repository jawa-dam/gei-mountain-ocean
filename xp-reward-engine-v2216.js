/* V2.2.16 — XP REWARD ENGINE 💧⚡   "I didn't just get XP. I EARNED that."
 *
 * A PRESENTATION-ONLY celebration layer. XP / Flow Points are FL OZ in this game; the existing economy (safeAddFlOz / awardDay / the Bonus Waterwheel /
 * the DAM Machine) stays the only authority. It commits an award, THEN broadcasts a read-only `gei:xp-event` carrying the amount that was ACTUALLY
 * added. This engine only listens:
 *
 *      AUTHORITATIVE ECONOMY → gei:xp-event → XPRewardEngine → VISUAL + AUDIO CELEBRATION
 *
 *   FLOW → BUILD → EARN → STACK → SECURE → REWARD → PROGRESS
 *   ACTION → +XP appears at the action → droplets stack → XP FLOWS into the XP dam (the HUD counter) → counter ticks + reservoir fills → N XP LOCKED IN → back to play
 *
 *   · it NEVER decides an amount, never writes a balance, never unlocks / purchases / persists anything but its own phrase memory (geiXPRewardV1).
 *     Amounts are validated (positive integer) and shown exactly as received. A purchase is never "earned XP" and is not announced.
 *   · batching: awards that arrive close together merge into ONE number (+10 +10 +10 +10 → +40 XP · XP STACK ×4) and at most ONE voice clip
 *   · event classification (not a random pick): XP_GAIN · XP_COMBO · XP_STACK · XP_THRESHOLD · XP_FLOW · XP_SKILL · XP_LOCKED · REWARD_EARNED · REWARD_SECURED
 *     · FLOW_POINTS_EARNED · MAJOR_REWARD  →  the ten supplied clips, chosen by what actually happened (source · streak · reservoir marks · totals)
 *   · seven reward tiers; micro rewards are silent, voices are gated by gaps, per-level caps, chance and a phrase memory (never the same phrase twice in a row)
 *   · audio: ONE polite request on the shared FlowMomentEngine voice lane (priority … WOW 5.5 < MAJOR REWARD 5.6 < XP LOCK-IN 5.7 < XP EARNED 5.8 < personality 6).
 *     Music ducking is the lane's own smooth duck/restore. It waits for STEM / WOW / any other voice, never talks over the failure cinematic, the Level
 *     Complete sequence (LevelCompleteVoiceEngine stays authoritative), the Next Challenge transition. Audio OFF → no audio request at all, visuals unchanged.
 *   · reduced motion: no flight, no particles, no tremor — numbers still appear, the counter still updates, "LOCKED IN" still confirms.
 *
 * Debug (development hosts / ?xpdebug=1 only — never in production):
 *   testXPReward(10|37|111|666) · testXPStack() · testXPLock() · testRewardSecured() · testFlowPointsSecured() · testMajorReward() · testXPAudio("xpEarned"|…)
 */
(function(){
  "use strict";
  var FM = window.FlowMomentEngine;
  if(!FM || window.XPRewardEngine) return;
  var VERSION = "V2.2.16";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var PRI = FM.priorities;
  /* additive priorities on the shared lane: … STEM 4.8 < achievement 5 < WOW 5.5 < MAJOR REWARD < XP LOCK-IN < XP EARNED < personality 6 < reaction 7 */
  if(PRI.xpMajor == null) PRI.xpMajor = 5.6;
  if(PRI.xpLock == null) PRI.xpLock = 5.7;
  if(PRI.xpEarned == null) PRI.xpEarned = 5.8;
  var NS = "http://www.w3.org/2000/svg";
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function warn(e){ try{ console.warn("[XP] " + (e && e.message || e)); }catch(_){} }
  function gs(){ try{ return (typeof state !== "undefined" && state) || {}; }catch(e){ return {}; } }
  function reduced(){ try{ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return false; } }
  function fmt(n){ try{ return Number(n).toLocaleString("en-US"); }catch(e){ return String(n); } }
  function audioOn(){ try{ var a = window.GEI_AUDIO; if(a && typeof a.isMuted === "function") return !a.isMuted(); if(a && a.muted != null) return !a.muted; }catch(e){} return true; }

  /* ================================================================== AUDIO LIBRARY — the ten supplied clips (exact URLs) */
  function clip(id, text, file, pri, extra){ var o = { id: id, text: text, url: CDN + file, pri: pri }; if(extra) for(var k in extra) o[k] = extra[k]; return o; }
  var CLIPS = {
    xpEarned:   clip("xpEarned",   "XP EARNED",                  "xp-earned-9mImxaLBPdo784gp.mp3",                  PRI.xpEarned),
    lookFlow:   clip("lookFlow",   "LOOK AT THAT FLOW",          "look-at-that-flow-IQiYl020ka0UpFBO.mp3",          PRI.xpEarned),
    stacked:    clip("stacked",    "YOU JUST STACKED SOME XP",   "you-just-stacked-some-xp-Y19fYT0GoBjCeE5O.mp3",   PRI.xpEarned),
    moreXp:     clip("moreXp",     "MORE XP IN THE DAM",         "more-xp-in-the-dam-fTooHoXKhRfm3GRA.mp3",         PRI.xpEarned),
    earnedFlow: clip("earnedFlow", "THAT'S SOME EARNED FLOW",    "that-s-some-earned-flow-hHX77JCQDD692SjQ.mp3",    PRI.xpEarned),
    locked:     clip("locked",     "XP LOCKED IN",               "xp-locked-in-uE618bWuDrd88G1H.mp3",               PRI.xpLock),
    earnedThat: clip("earnedThat", "YOU EARNED THAT",            "you-earned-that-gBMZ5QHFUJfMviwu.mp3",            PRI.xpMajor),
    secured:    clip("secured",    "REWARD SECURED",             "reward-secured-kDHxjnSz28sCNHlS.mp3",             PRI.xpLock),
    xpYours:    clip("xpYours",    "THAT XP IS YOURS",           "that-xp-is-yours-ocmKalppwyA4lDYn.mp3",           PRI.xpMajor),
    flowPoints: clip("flowPoints", "FLOW POINTS SECURED",        "flow-points-secured-Irw0VzBCI3ymt1cs.mp3",        PRI.xpMajor)
  };

  /* ================================================================== EVENT CLASSIFICATION → audio pools */
  var TYPES = {
    XP_GAIN:            { pool: ["xpEarned"] },                          // XP just awarded
    XP_COMBO:           { pool: ["stacked", "lookFlow"] },               // consecutive successful actions
    XP_STACK:           { pool: ["stacked"] },                           // several awards batched together
    XP_MAJOR:           { pool: ["moreXp", "earnedFlow"] },              // a large award with no more specific story
    XP_FLOW:            { pool: ["lookFlow"] },                          // a strong flow sequence led to this XP
    XP_SKILL:           { pool: ["earnedFlow", "lookFlow"] },            // controlled play (gate · pressure · waterwheel · STEM) → XP
    XP_THRESHOLD:       { pool: ["moreXp"] },                            // the reservoir crosses a mark: building toward the unlock
    XP_LOCKED:          { pool: ["locked"] },                            // the transaction is finalised
    REWARD_EARNED:      { pool: ["earnedThat", "secured"] },             // an unlock / meaningful reward
    REWARD_SECURED:     { pool: ["secured", "earnedThat"] },             // a reward / milestone committed
    FLOW_POINTS_EARNED: { pool: ["flowPoints", "locked"] },              // Flow Points (FL OZ) banked outside the main level loop
    MAJOR_REWARD:       { pool: ["xpYours", "flowPoints"] }              // an exceptional amount / threshold crossed
  };
  /* reward tiers: 1 micro · 2 standard · 3 stacked · 4 major XP · 5 reward · 6 secured · 7 major flow reward */
  var TIER_NAME = { 1: "micro", 2: "standard", 3: "stacked", 4: "major", 5: "reward", 6: "secured", 7: "flow" };
  var SOURCES = { TAP: "TAP", COMBO: "COMBO", FLOW_STREAK: "FLOW STREAK", MISSION: "MISSION", LEVEL_COMPLETION: "LEVEL COMPLETE", STEM_ACTION: "STEM", WATERWHEEL: "WATERWHEEL",
    GATE_CONTROL: "GATE CONTROL", PRESSURE_CONTROL: "PRESSURE CONTROL", EXPERIMENT: "EXPERIMENT", RECOVERY: "RECOVERY", ACHIEVEMENT: "ACHIEVEMENT", UNLOCK: "UNLOCK", BONUS: "BONUS" };
  var SKILL = { STEM_ACTION: 1, WATERWHEEL: 1, GATE_CONTROL: 1, PRESSURE_CONTROL: 1, EXPERIMENT: 1, FLOW_STREAK: 1, RECOVERY: 1 };   // sources that mean "controlled play"
  var MODAL = { BONUS: 1, UNLOCK: 1 };                                 // celebrated over a panel (wheel / DAM machine): the HUD may be covered, so no flight

  /* ================================================================== CONFIG */
  var config = {
    enabled: true,
    unit: "XP",                           // what the player reads (+37 XP); the economy's own currency name is FL OZ
    rng: null,
    dryRun: false,                        // tests: decide + log, no visual / sound
    visuals: true,
    voice: true,
    microMax: 39,                         // amount ≤ this → tier 1 (silent "+XP")
    majorMin: 300,                        // amount ≥ this → tier 4
    flowMin: 5000,                        // amount ≥ this (or an unlock-price threshold crossed) → tier 7
    batchQuietMs: 420, batchMaxMs: 1500,  // awards closer than batchQuietMs merge; a batch never waits longer than batchMaxMs
    stackMin: 3,                          // this many merged awards = XP STACK
    comboStreak: 6, flowStreak: 10,       // FlowMomentEngine streak thresholds
    marks: [.5, .75],                     // reservoir marks that sound "MORE XP IN THE DAM"
    voiceGapMs: { 1: 1e9, 2: 26000, 3: 14000, 4: 10000, 5: 3500, 6: 3500, 7: 3500 },   // minimum time since the last XP voice, per tier
    stdChance: .5,                        // a standard gain is only sometimes voiced
    maxStdPerLevel: 1, maxVoicePerLevel: 3,
    recentPhrases: 6, phraseGapMs: 45000, // the last N phrases are remembered; one phrase never repeats inside phraseGapMs (never twice in a row, ever)
    holdMs: { 2: 3500, 3: 4500, 4: 5000, 5: 8000, 6: 8000, 7: 9000 },   // how long a voice may wait for the lane to clear before it is dropped (visuals never wait)
    minGapAfterVoiceMs: 600,
    wowWaitMs: 2400,                      // the visual waits for an on-stage WOW this long, so the two never pile up
    stemWindowMs: 9000,
    dupWindowMs: 3000,                    // an identical (total, amount) pair is a duplicate presentation of the SAME award
    maxQueue: 3,
    max: 1e9
  };
  function rng(){ return (config.rng || Math.random)(); }
  var XP = { version: VERSION, config: config, clips: CLIPS, types: TYPES, sources: SOURCES, tiers: TIER_NAME };

  /* ================================================================== STATE + MEMORY (phrases only — never XP) */
  var S = { B: null, queue: [], timers: [], log: [], recent: [], recentAt: {}, lastVoiceAt: -1e9, level: "", perLevel: {}, std: {}, seen: {}, root: null, hudT: 0,
    pend: null, pendT: 0, drops: 0, floats: [], lastKey: "", lastKeyAt: 0, writing: false, anim: 0, hooked: false, voiceRec: null };
  var KEY = "geiXPRewardV1";
  try{ var m = JSON.parse(localStorage.getItem(KEY) || "null"); if(m){ if(m.recent) S.recent = m.recent.slice(-12); if(m.recentAt) S.recentAt = m.recentAt; } }catch(e){}
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify({ recent: S.recent, recentAt: S.recentAt })); }catch(e){} }
  function later(fn, ms){ var id = setTimeout(function(){ var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1); try{ fn(); }catch(e){ warn(e); } }, Math.max(0, ms)); S.timers.push(id); return id; }
  function log(r){ S.log.push(r); if(S.log.length > 80) S.log.shift(); try{ window.dispatchEvent(new CustomEvent("gei:xp-celebrated", { detail: { type: r.type, tier: r.tier, amount: r.amount, clip: r.clip || "", spoke: !!r.spoke } })); }catch(e){} return r; }

  /* ================================================================== DEVELOPMENT GATE */
  function devAllowed(host, search, flag){
    host = String(host == null ? "" : host).toLowerCase();
    if(/(^|[?&])xpdebug=1(&|$)/.test(String(search || ""))) return true;
    if(flag === "1") return true;
    return host === "" || host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1" || /\.local$/.test(host) || /\.localhost$/.test(host);
  }
  XP.devAllowed = devAllowed;
  function isDev(){ var f = ""; try{ f = localStorage.getItem("geiXpDebug") || ""; }catch(e){} return devAllowed(location.hostname, location.search, f); }

  /* ================================================================== GATES */
  function level(){ return String(gs().level || 0); }
  function criticalBlock(){
    var fs = {}; try{ fs = FM.state() || {}; }catch(e){}
    if(fs.cinematic || fs.cardShown) return "cinematic";                      // dam failure owns the stage
    if(fs.levelComplete || (gs().phase === "levelComplete")) return "level-complete";   // LevelCompleteVoiceEngine stays authoritative
    if(fs.transition || window.__GEI_TRANSITION__) return "transition";       // Next Challenge
    try{ if(window.NextChallengeEngine && window.NextChallengeEngine.active) return "transition"; }catch(e){}
    return "";
  }
  function wowBusy(){ try{ var W = window.RareWowMomentEngine; if(!W) return false; if(W.active()) return true; var s = W.state(); return !!(s && s.held); }catch(e){ return false; } }
  function wowRecent(ms){ try{ var W = window.RareWowMomentEngine; return !!(W && W.recent(ms || 2000)); }catch(e){ return false; } }
  function stemPending(){ try{ var s = window.StemIntelligenceEngine && StemIntelligenceEngine.state(); return !!(s && (s.held || s.queued)); }catch(e){ return false; } }
  function stemRecent(t){ try{ var s = window.StemIntelligenceEngine && StemIntelligenceEngine.state(); return !!(s && s.lastAt > 0 && t - s.lastAt >= 0 && t - s.lastAt < config.stemWindowMs); }catch(e){ return false; } }
  function voiceFree(){
    try{ return !FM.voiceBusy() && !FM.fx.othersSpeaking() && FM.fx.sinceVoice() >= config.minGapAfterVoiceMs && !stemPending() && !wowBusy() && !wowRecent(900); }catch(e){ return true; }
  }

  /* ================================================================== VALIDATION — the engine never trusts, invents or edits an amount */
  function cleanEvent(e){
    if(!e || typeof e !== "object") return null;
    var kind = e.kind === "reward" || e.kind === "flowpoints" ? e.kind : "xp";
    var amount = e.amount;
    if(kind === "reward"){ amount = 0; }
    else if(typeof amount !== "number" || !isFinite(amount) || Math.floor(amount) !== amount || amount <= 0 || amount > config.max){ return null; }
    var src = String(e.source || "").toUpperCase().replace(/[^A-Z_]/g, "");
    if(src === "PURCHASE" || src === "STORE" || src === "PAYMENT") return null;   // money is never "earned XP"
    if(!SOURCES[src]) src = kind === "reward" ? "UNLOCK" : "MISSION";
    var total = typeof e.total === "number" && isFinite(e.total) ? e.total : null;
    return { kind: kind, amount: amount, source: src, total: total,
      levelTotal: typeof e.levelTotal === "number" && isFinite(e.levelTotal) ? e.levelTotal : null,
      levelMax: typeof e.levelMax === "number" && e.levelMax > 0 ? e.levelMax : null,
      unlockCost: typeof e.unlockCost === "number" && e.unlockCost > 0 ? e.unlockCost : null,
      index: e.index != null ? e.index | 0 : null, final: !!e.final, jackpot: !!e.jackpot, secured: e.phase === "secured", milestone: !!e.milestone,
      label: e.label ? String(e.label).slice(0, 40) : "", debug: !!e.debug, counts: e.counts === "level" ? "level" : "" };
  }

  /* ================================================================== PUBLIC ENTRY POINTS */
  function submit(raw){
    try{
      if(!config.enabled) return false;
      var e = cleanEvent(raw); if(!e) return false;
      var t = now();
      if(e.total != null && !e.debug){                                    // the same award can never be celebrated twice
        var k = e.kind + ":" + e.total + ":" + e.amount;
        if(S.lastKey === k && t - S.lastKeyAt < config.dupWindowMs) return false;
        S.lastKey = k; S.lastKeyAt = t;
      }
      var cb = criticalBlock();
      if(cb === "cinematic") return log({ type: "SKIPPED", why: cb, amount: e.amount, source: e.source, t: t });
      e.quiet = cb === "level-complete" || cb === "transition";            // the major celebration is on stage: no overlay, no voice — only the counter reacts
      e.ts = t;
      var B = S.B;
      if(B && (B.e0.kind !== e.kind || B.quiet !== e.quiet || (B.e0.kind === "reward" && e.kind === "reward")) ) { enqueue(e); return true; }
      if(!B){ B = S.B = { e0: e, kind: e.kind, sum: 0, count: 0, events: [], first: t, last: t, quiet: e.quiet, mode: "collect", el: null }; }
      B.sum += e.amount; B.count++; B.events.push(e); B.last = t; B.final = B.final || e.final; B.jackpot = B.jackpot || e.jackpot; B.eL = e;
      tick(B, true);
      return true;
    }catch(err){ warn(err); return false; }
  }
  function enqueue(e){ if(S.queue.length >= config.maxQueue){ var q = S.queue[S.queue.length - 1]; if(q && q.kind === e.kind){ q.amount += e.amount; q.total = e.total; return; } } S.queue.push(e); }
  XP.showEarnedXP = function(o){ o = o || {}; return submit({ kind: o.kind || "xp", amount: o.amount, source: o.source, total: o.total, levelTotal: o.levelTotal, levelMax: o.levelMax, unlockCost: o.unlockCost, index: o.index, final: o.final, jackpot: o.jackpot, counts: o.counts, debug: o.debug, label: o.label }); };
  XP.showFlowPoints = function(o){ o = o || {}; o.kind = "flowpoints"; return XP.showEarnedXP(o); };
  XP.showReward = function(o){ o = o || {}; return submit({ kind: "reward", amount: 0, source: o.source || "UNLOCK", label: o.label || o.name, total: o.total, phase: o.phase, milestone: o.milestone, jackpot: o.jackpot, debug: o.debug }); };
  XP.showRewardSecured = function(o){ o = o || {}; o.phase = "secured"; return XP.showReward(o); };
  window.addEventListener("gei:xp-event", function(ev){ try{ submit(ev && ev.detail); }catch(e){ warn(e); } });

  /* ================================================================== CLASSIFICATION */
  function crossedMark(B){
    var e = B.eL; if(!e || e.levelTotal == null || !e.levelMax || e.counts !== "level") return false;
    var after = e.levelTotal / e.levelMax, before = (e.levelTotal - B.sum) / e.levelMax, r = false;
    config.marks.forEach(function(m){ if(before < m - 1e-9 && after >= m - 1e-9 && after < 1 - 1e-9) r = true; });
    return r;
  }
  function crossedUnlock(B){
    var e = B.eL; if(!e || e.total == null || !e.unlockCost || B.kind === "reward") return false;
    return Math.floor(e.total / e.unlockCost) > Math.floor((e.total - B.sum) / e.unlockCost);
  }
  function classify(B){
    var e = B.eL, tier = 1, type = "XP_GAIN", why = "";
    var sum = B.sum, streak = 0; try{ streak = FM.state().streak | 0; }catch(_){}
    var skill = !!SKILL[e.source], t = now();
    if(B.kind === "reward"){
      var big = B.jackpot || e.milestone;
      if(e.secured && !big) return { type: "REWARD_SECURED", tier: 6, why: "secured" };
      return big ? { type: "MAJOR_REWARD", tier: 7, why: "major-unlock" } : { type: "REWARD_EARNED", tier: 5, why: "unlock" };
    }
    if(crossedUnlock(B)) return { type: "MAJOR_REWARD", tier: 7, why: "unlock-price-crossed" };
    if(sum >= config.flowMin || B.jackpot) return { type: B.kind === "flowpoints" ? "FLOW_POINTS_EARNED" : "MAJOR_REWARD", tier: 7, why: "exceptional" };
    if(B.kind === "flowpoints"){
      if(sum >= config.majorMin) return { type: "FLOW_POINTS_EARNED", tier: 4, why: "flow-points" };
      return { type: "XP_LOCKED", tier: 2, why: "flow-points-small" };
    }
    if(B.count >= config.stackMin) return { type: "XP_STACK", tier: 3, why: "batched-" + B.count };
    if(B.final) return { type: "XP_LOCKED", tier: 6, why: "level-final" };
    if(skill && (streak >= config.comboStreak || stemRecent(t) || sum >= config.majorMin)) return { type: "XP_SKILL", tier: 4, why: "controlled-" + e.source };
    if(crossedMark(B)) return { type: "XP_THRESHOLD", tier: 4, why: "reservoir-mark" };
    if(streak >= config.flowStreak || e.source === "FLOW_STREAK") return { type: "XP_FLOW", tier: 4, why: "flow-streak" };
    if(streak >= config.comboStreak || e.source === "COMBO" || B.count === 2) return { type: "XP_COMBO", tier: 3, why: "combo" };
    if(sum >= config.majorMin) return { type: "XP_MAJOR", tier: 4, why: "major-amount" };
    if(sum <= config.microMax) return { type: "XP_GAIN", tier: 1, why: "micro" };
    return { type: "XP_GAIN", tier: 2, why: "standard" };
  }

  /* ================================================================== VOICE POLICY — never a clip for every XP event */
  function usedRecently(id, t){ var at = S.recentAt[id]; return at != null && t - at < config.phraseGapMs; }
  function pickClip(type, tier, debug){
    var pool = (TYPES[type] || TYPES.XP_GAIN).pool.slice(), t = Date.now(), last = S.recent[S.recent.length - 1];
    if(debug) return pool[Math.floor(rng() * pool.length) % pool.length];
    /* never the phrase that just played, never a phrase heard within phraseGapMs — a silent celebration beats a repeated one */
    var fresh = pool.filter(function(id){ return id !== last && !usedRecently(id, t); });
    if(!fresh.length) return "";
    return fresh[Math.floor(rng() * fresh.length) % fresh.length];
  }
  function voicePlan(B, cls, rec){
    var tier = cls.tier;
    if(!config.voice || !audioOn()) return { ok: false, why: "audio-off" };
    if(B.quiet) return { ok: false, why: "quiet-" + criticalBlock() };
    if(tier <= 1) return { ok: false, why: "micro-silent" };
    if(B.eL.debug) return { ok: true, why: "debug" };
    if(cls.type === "XP_LOCKED" && tier === 6) return { ok: false, why: "level-owner" };    // the Level Complete card/voice owns the finish
    var t = now(), lv = level(), used = S.perLevel[lv] || 0;
    var gap = config.voiceGapMs[tier]; if(gap == null) gap = 10000;
    if(t - S.lastVoiceAt < gap) return { ok: false, why: "gap" };
    if(tier < 5 && used >= config.maxVoicePerLevel) return { ok: false, why: "level-cap" };
    if(tier === 2){ if((S.std[lv] || 0) >= config.maxStdPerLevel) return { ok: false, why: "std-cap" }; if(rng() >= config.stdChance) return { ok: false, why: "std-chance" }; }
    return { ok: true, why: "" };
  }
  function clipPriority(id){ var c = CLIPS[id]; return c ? c.pri : PRI.xpEarned; }

  /* ================================================================== PRESENTATION */
  var css = [
"#xpreRoot{position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden;z-index:10003;contain:layout paint;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}",
".xpreFloat{position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;gap:.12rem;text-align:center;max-width:94vw;will-change:transform,opacity;transform:translate(-50%,-50%)}",
".xpreNum{font:1000 var(--xfs,clamp(1.6rem,8.4vw,2.4rem))/1 'Arial Black',Impact,system-ui,sans-serif;letter-spacing:.01em;white-space:nowrap;color:#fff;font-variant-numeric:tabular-nums;" +
  "text-shadow:0 0 .35em var(--xc2,#1c8cff),0 2px 0 rgba(8,40,90,.92),0 0 18px var(--xc1,#7fe3ff);-webkit-text-stroke:1.4px rgba(5,40,100,.85);paint-order:stroke fill}",
".xpreSub{font:900 clamp(.58rem,2.8vw,.78rem)/1 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:.28em .75em;border-radius:99px;color:#04223f;background:linear-gradient(90deg,var(--xc1,#7fe3ff),#fff);box-shadow:0 0 12px var(--xc1,#7fe3ff);white-space:nowrap;max-width:94vw;overflow:hidden;text-overflow:ellipsis}",
".xpreSub:empty{display:none}",
".xpreFloat.t1{--xfs:clamp(1.05rem,5.2vw,1.45rem)}.xpreFloat.t1 .xpreSub{display:none}",
".xpreFloat.t4,.xpreFloat.t5,.xpreFloat.t6{--xfs:clamp(1.9rem,10.4vw,3rem);--xc1:#ffe27a;--xc2:#e08a00}",
".xpreFloat.t7{--xfs:clamp(2rem,11.2vw,3.3rem);--xc1:#ffe27a;--xc2:#e08a00}",
".xpreFloat.t3{--xc1:#9dffd0;--xc2:#16a874}",
".xpreFloat.locked .xpreNum{font-size:clamp(1.15rem,6.2vw,1.7rem);color:#eaffff}",
".xpreFloat.locked .xpreSub{background:linear-gradient(90deg,#fff,var(--xc1,#7fe3ff))}",
".xpreFloat.secured .xpreNum{letter-spacing:.06em}",
".xpreDrop{position:absolute;left:0;top:0;width:var(--ds,6px);height:var(--ds,6px);margin:calc(var(--ds,6px) / -2) 0 0 calc(var(--ds,6px) / -2);border-radius:50% 50% 50% 8%;background:radial-gradient(circle at 35% 30%,#fff,var(--xc1,#7fe3ff) 55%,var(--xc2,#1c8cff));box-shadow:0 0 8px var(--xc1,#7fe3ff);will-change:transform,opacity}",
"#hudOz{background-image:linear-gradient(90deg,rgba(80,190,255,.30),rgba(80,190,255,.30) calc(100% - 2px),rgba(200,244,255,.85) calc(100% - 2px));background-repeat:no-repeat;background-position:left center;background-size:var(--xpre-fill,0%) 100%;border-radius:8px;padding-left:6px;margin-left:-6px;transition:background-size .7s cubic-bezier(.3,.8,.3,1)}",
"#hudOz.xpreTick{animation:xpreTick .75s ease-out}",
"@keyframes xpreTick{0%{transform:scale(1);filter:none}25%{transform:scale(1.07);filter:drop-shadow(0 0 6px rgba(127,227,255,.95)) brightness(1.25)}100%{transform:scale(1);filter:none}}",
"@media (prefers-reduced-motion:reduce){#hudOz{transition:none}#hudOz.xpreTick{animation:xpreGlow .6s linear}.xpreDrop{display:none}@keyframes xpreGlow{0%{filter:none}30%{filter:brightness(1.35)}100%{filter:none}}}"
  ].join("\n");
  function addCss(){ if(document.getElementById("xpreStyle")) return; var s = document.createElement("style"); s.id = "xpreStyle"; s.textContent = css; document.head.appendChild(s); }
  function rootEl(){
    if(S.root && S.root.parentNode) return S.root;
    addCss(); var r = document.getElementById("xpreRoot");
    if(!r){ r = document.createElement("div"); r.id = "xpreRoot"; r.setAttribute("aria-hidden", "true"); (document.body || document.documentElement).appendChild(r); }
    return (S.root = r);
  }
  function vw(){ return window.innerWidth || document.documentElement.clientWidth || 360; }
  function vh(){ return window.innerHeight || document.documentElement.clientHeight || 640; }
  function hud(){ return document.getElementById("hudOz"); }
  function visible(el){ if(!el) return null; var r = el.getBoundingClientRect(); if(!r || r.width < 4 || r.height < 4) return null; if(r.bottom < 0 || r.top > vh() || r.right < 0 || r.left > vw()) return null; var cx = clamp(r.left + r.width / 2, 1, vw() - 1), cy = clamp(r.top + r.height / 2, 1, vh() - 1);
    try{ var top = document.elementFromPoint(cx, cy); if(top && el !== top && !el.contains(top) && !top.contains(el)){ var ov = top.closest && top.closest("#bonusCard,#damMachineCard,#storePanel,.panel,.modal"); if(ov) return null; } }catch(e){}
    return r; }
  function targetPoint(B){
    if(MODAL[B.eL.source]) return null;
    var h = hud(), r = visible(h); if(!r) return null;
    var st = h.querySelector("strong"), sr = st && st.getBoundingClientRect ? st.getBoundingClientRect() : null;
    return sr && sr.width > 2 ? { x: sr.left + sr.width / 2, y: sr.top + sr.height / 2 } : { x: r.left + Math.min(40, r.width / 2), y: r.top + r.height / 2 };
  }
  function originPoint(B){
    var e = B.e0, W = vw(), H = vh();
    try{
      if(!MODAL[e.source] && e.index != null){ var st = document.querySelector('#stationsGroup .station[data-index="' + e.index + '"] .body') || document.querySelector('#stationsGroup .station[data-index="' + e.index + '"]'); var r = st && st.getBoundingClientRect(); if(r && r.width > 2 && r.bottom > 0 && r.top < H) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
      if(!MODAL[e.source]){ var d = FM.fx.damPoint(), b = FM.fx.box(); if(d && b && b.w > 0) return { x: b.l + d.x, y: b.t + d.y }; }
    }catch(err){}
    return { x: W * .5, y: H * (MODAL[e.source] ? .30 : .38) };
  }
  function place(el, x, y, scale){
    var w = el.offsetWidth || 120, h = el.offsetHeight || 40, pad = 8;
    var cx = clamp(x, w / 2 + pad, vw() - w / 2 - pad), cy = clamp(y, h / 2 + pad, vh() - h / 2 - pad);
    el._x = cx; el._y = cy; el.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%) scale(" + (scale || 1) + ")";
    return { x: cx, y: cy };
  }
  function xf(el, x, y, s){ return "translate(" + x + "px," + y + "px) translate(-50%,-50%) scale(" + s + ")"; }
  function animate(el, frames, opts, done){
    try{
      if(!el.animate) { if(done) later(done, opts.duration || 0); return null; }
      var a = el.animate(frames, opts); if(done) a.onfinish = done; return a;
    }catch(e){ if(done) later(done, opts.duration || 0); return null; }
  }
  function theme(tier){ return tier >= 4 ? ["#ffe27a", "#e08a00"] : tier === 3 ? ["#9dffd0", "#16a874"] : ["#7fe3ff", "#1c8cff"]; }
  function drop(from, to, o){
    if(reduced() || S.drops > 44) return; var r = rootEl(), d = document.createElement("i"); d.className = "xpreDrop"; var sz = 4 + Math.random() * 5; d.style.setProperty("--ds", sz + "px");
    if(o.c1) { d.style.setProperty("--xc1", o.c1); d.style.setProperty("--xc2", o.c2); }
    r.appendChild(d); S.drops++;
    function fin(){ S.drops = Math.max(0, S.drops - 1); if(d.parentNode) d.parentNode.removeChild(d); }
    var frames = [{ transform: "translate(" + from.x + "px," + from.y + "px) scale(.4)", opacity: 0 }];
    (o.via || []).forEach(function(p, i){ frames.push({ transform: "translate(" + p.x + "px," + p.y + "px) scale(1)", opacity: 1, offset: (i + 1) / ((o.via || []).length + 2) }); });
    frames.push({ transform: "translate(" + to.x + "px," + to.y + "px) scale(" + (o.end || .45) + ")", opacity: o.fade === false ? 1 : 0 });
    animate(d, frames, { duration: o.dur || 700, delay: o.delay || 0, easing: o.ease || "cubic-bezier(.4,0,.2,1)", fill: "both" }, fin);
  }
  function spray(B, p, n, converge){
    var th = theme(B.tier);
    for(var i = 0; i < n; i++){
      var a = Math.random() * 6.283, r = 26 + Math.random() * 46, o = { x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r * .8 - 14 };
      drop(p, converge ? p : o, { c1: th[0], c2: th[1], via: converge ? [o] : null, dur: converge ? 560 : 520, delay: Math.random() * 120, ease: "cubic-bezier(.2,.8,.3,1)" });
    }
  }
  function burst(B, p){            // the compact hydraulic burst: the game's own foam / ring particles at the action
    try{ if(reduced()) return; var b = FM.fx.box(); FM.fx.burst(p.x - b.l, p.y - b.t, B.tier >= 4 ? 16 : 8, { spread: B.tier >= 4 ? 130 : 80, up: 70, fall: 50, max: 11, durMax: 1000 }); if(B.tier >= 4) FM.fx.ring(p.x - b.l, p.y - b.t); }catch(e){}
  }
  function labelFor(B){
    var e = B.eL, u = config.unit, s = SOURCES[e.source] || "";
    if(B.kind === "reward") return { num: e.label || "REWARD", sub: "REWARD SECURED" };
    var num = "+" + fmt(B.sum) + " " + u;
    var sub = B.count >= 2 ? (B.count >= config.stackMin ? u + " STACK ×" + B.count : "+" + u + " ×" + B.count) : (B.tier >= 2 ? s : "");
    if(B.kind === "flowpoints" && B.count < 2) sub = "FLOW POINTS";
    return { num: num, sub: sub };
  }
  function fitNum(el, num){ var maxW = vw() - 24, fs = parseFloat(getComputedStyle(num).fontSize) || 32, guard = 0; while(num.scrollWidth > maxW && fs > 14 && guard++ < 14){ fs *= .9; num.style.fontSize = fs + "px"; } }
  function makeFloat(B){
    var r = rootEl(), el = document.createElement("div"); el.className = "xpreFloat t" + (B.tier || 2);
    var num = document.createElement("div"); num.className = "xpreNum"; var sub = document.createElement("div"); sub.className = "xpreSub"; el.appendChild(num); el.appendChild(sub);
    var th = theme(B.tier || 2); el.style.setProperty("--xc1", th[0]); el.style.setProperty("--xc2", th[1]);
    r.appendChild(el); B.el = el; B.num = num; B.sub = sub; S.floats.push(el); return el;
  }
  function paint(B){
    var lb = labelFor(B); B.num.textContent = lb.num; B.sub.textContent = lb.sub; B.num.style.fontSize = ""; fitNum(B.el, B.num);
    var th = theme(B.tier || 2); B.el.style.setProperty("--xc1", th[0]); B.el.style.setProperty("--xc2", th[1]); B.el.className = B.el.className.replace(/\bt\d\b/, "t" + (B.tier || 2));
  }
  /* provisional tier for the in-progress number (so a growing stack looks like a stack); the final classification happens at flush */
  function provisional(B){ var e = B.eL, s = B.sum; B.tier = B.kind === "reward" ? 5 : (s >= config.flowMin || B.jackpot) ? 7 : B.count >= config.stackMin ? 3 : s >= config.majorMin ? 4 : s <= config.microMax ? 1 : 2; }

  function tick(B, added){
    if(B.mode !== "collect") return;
    provisional(B);
    if(B.quiet || !config.visuals || config.dryRun){ clearTimeout(B.t); B.t = later(function(){ flush(B); }, config.batchQuietMs); return; }
    if(wowBusy() && now() - B.first < config.wowWaitMs && !B.el){ clearTimeout(B.t); B.t = later(function(){ tick(B, false); }, 150); return; }     // the WOW celebrates the moment first; XP confirms the consequence
    var first = !B.el;
    if(first){ makeFloat(B); }
    paint(B);
    var o = B.origin || (B.origin = originPoint(B));
    if(first){
      var p = place(B.el, o.x, o.y - 6, 1); B.pos = p;
      if(!reduced()) animate(B.el, [{ opacity: 0, transform: xf(B.el, p.x, p.y + 10, .45) }, { opacity: 1, transform: xf(B.el, p.x, p.y - 8, 1.18), offset: .55 }, { opacity: 1, transform: xf(B.el, p.x, p.y - 6, 1) }], { duration: 280, easing: "cubic-bezier(.2,1.1,.25,1)", fill: "both" });
      else animate(B.el, [{ opacity: 0 }, { opacity: 1 }], { duration: 140, fill: "both" });
      burst(B, o);
      spray(B, B.pos, B.tier >= 4 ? 12 : 6, false);
    } else if(added){
      var q = place(B.el, B.pos.x, B.pos.y, 1);
      if(!reduced()){ animate(B.el, [{ transform: xf(B.el, q.x, q.y, 1.22) }, { transform: xf(B.el, q.x, q.y, 1) }], { duration: 170, easing: "cubic-bezier(.3,1.4,.4,1)", fill: "both" }); spray(B, q, 5, true); }   // new droplets visibly stack INTO the number
    }
    var hold = Math.min(config.batchQuietMs, Math.max(80, config.batchMaxMs - (now() - B.first)));
    clearTimeout(B.t); B.t = later(function(){ flush(B); }, hold);
  }

  /* ----- flush: classify → (voice plan) → flow into the dam → lock ------------------------------------------------ */
  function flush(B){
    if(B.mode !== "collect") return; B.mode = "flying"; clearTimeout(B.t); if(S.B === B) S.B = null;
    var cls = classify(B); B.tier = cls.tier; B.cls = cls;
    var rec = { type: cls.type, tier: cls.tier, tierName: TIER_NAME[cls.tier], why: cls.why, amount: B.sum, count: B.count, kind: B.kind, source: B.eL.source, quiet: !!B.quiet, t: now(), total: B.eL.total, spoke: false, clip: "", voice: "" };
    var vp = voicePlan(B, cls, rec); rec.voice = vp.ok ? "planned" : vp.why;
    if(vp.ok) scheduleVoice(B, cls, rec, vp);
    log(rec);
    if(B.el && !B.quiet) fly(B, rec); else arrive(B, rec);
    var nxt = S.queue.shift(); if(nxt) later(function(){ submit(nxt); }, 120);
  }
  function fly(B, rec){
    var el = B.el, tp = targetPoint(B), p = B.pos;
    paint(B);
    if(B.tier >= 4) spray(B, p, 8, true);
    if(!tp || reduced()){ arrive(B, rec, tp); return; }            // no visible counter (panel open) or reduced motion: settle in place — no fake flight
    var dur = 640, th = theme(B.tier), n = Math.min(14, 5 + B.count * 2 + B.tier);
    for(var i = 0; i < n; i++){ var jx = (Math.random() - .5) * 60, jy = (Math.random() - .5) * 40; drop({ x: p.x + jx, y: p.y + jy }, { x: tp.x + (Math.random() - .5) * 10, y: tp.y + (Math.random() - .5) * 6 }, { c1: th[0], c2: th[1], via: [{ x: (p.x + tp.x) / 2 + jx * 1.5, y: Math.min(p.y, tp.y) - 30 - Math.random() * 40 }], dur: dur + 140, delay: i * 22, end: .35 }); }
    animate(el, [{ transform: xf(el, p.x, p.y - 6, 1), opacity: 1 }, { transform: xf(el, p.x, p.y - 22, 1.08), opacity: 1, offset: .22 }, { transform: xf(el, tp.x, tp.y, .42), opacity: .95 }], { duration: dur, easing: "cubic-bezier(.5,0,.2,1)", fill: "both" }, function(){ arrive(B, rec, tp); });
  }
  /* the XP reaches the dam: counter ticks, reservoir fills, number pulses, then LOCKED IN */
  function arrive(B, rec, tp){
    B.mode = "arrived"; var e = B.eL;
    tickCounter(B);
    var el = B.el; if(!el || B.quiet){ done(B); return; }
    var lock = B.tier >= 2, secured = B.kind === "reward" || B.cls.tier >= 6;
    if(!lock){ fadeOut(B, 160); return; }
    B.num.textContent = B.kind === "reward" ? (e.label || "REWARD") : fmt(B.sum) + " " + config.unit + " LOCKED IN";
    B.sub.textContent = secured && B.kind === "reward" ? "🔒 REWARD SECURED" : B.kind === "flowpoints" ? "🔒 FLOW POINTS SECURED" : "🔒 SECURED";
    el.classList.add("locked"); if(secured) el.classList.add("secured"); B.num.style.fontSize = ""; fitNum(el, B.num);
    var x = tp ? tp.x : B.pos.x, y = tp ? tp.y + 30 : B.pos.y + (reduced() ? 0 : -4);
    var q = place(el, x, y, 1);
    if(!reduced()) animate(el, [{ transform: xf(el, q.x, q.y, 1.28), opacity: 1 }, { transform: xf(el, q.x, q.y, .96), offset: .5 }, { transform: xf(el, q.x, q.y, 1), opacity: 1 }], { duration: 220, easing: "cubic-bezier(.3,1.5,.4,1)", fill: "both" });
    else el.style.opacity = "1";
    later(function(){ fadeOut(B, reduced() ? 200 : 320); }, reduced() ? 900 : 760);
  }
  function fadeOut(B, ms){
    var el = B.el; if(!el){ done(B); return; }
    animate(el, [{ opacity: 1, transform: xf(el, el._x, el._y, 1) }, { opacity: 0, transform: xf(el, el._x, el._y - (reduced() ? 0 : 14), .9) }], { duration: ms, easing: "ease-out", fill: "both" }, function(){ done(B); });
    later(function(){ done(B); }, ms + 120);
  }
  function done(B){ if(B.gone) return; B.gone = true; var el = B.el; if(el){ var i = S.floats.indexOf(el); if(i >= 0) S.floats.splice(i, 1); if(el.parentNode) el.parentNode.removeChild(el); } B.el = null; }

  /* ----- the HUD counter = the XP dam (compact: a tinted fill inside the existing FL OZ line — no new layout) ---------- */
  function fillPct(){
    var st = gs(), lv = st.levelFlOz, mx = null; try{ mx = typeof LEVEL_REWARD_FL_OZ !== "undefined" ? LEVEL_REWARD_FL_OZ : null; }catch(e){}
    if(typeof lv !== "number" || !mx) return null; return clamp(lv / mx, 0, 1) * 100;
  }
  function syncFill(){ var h = hud(); if(!h) return; var p = fillPct(); if(p == null) return; h.style.setProperty("--xpre-fill", p.toFixed(1) + "%"); }
  function tickCounter(B){
    var h = hud(); if(!h) return; var e = B.eL;
    try{
      h.classList.remove("xpreTick"); void h.offsetWidth; h.classList.add("xpreTick"); clearTimeout(S.hudT); S.hudT = setTimeout(function(){ h.classList.remove("xpreTick"); }, 800);
      if(e.counts === "level" && e.levelTotal != null && e.levelMax){
        h.style.setProperty("--xpre-fill", clamp(e.levelTotal / e.levelMax, 0, 1) * 100 + "%");              // the reservoir fills to the AUTHORITATIVE level total
        if(!reduced() && !B.quiet) countUp(h, e.levelTotal - B.sum, e.levelTotal);
      } else syncFill();
    }catch(err){ warn(err); }
  }
  /* count-up: the HUD already holds the authoritative value; the animation climbs to exactly that value and stops writing — if anything else rewrites the HUD it yields */
  function countUp(h, from, to){
    var st = h.querySelector("strong"); if(!st || from < 0 || from >= to) return; var want = fmt(to); if(st.textContent !== want) return;
    var t0 = now(), dur = 520, ver = ++S.anim, last = null;
    (function step(){
      if(ver !== S.anim || !st.isConnected) return;
      if(last != null && st.textContent !== last) return;                                    // someone else (renderHud) wrote: yield
      var k = clamp((now() - t0) / dur, 0, 1), v = k >= 1 ? to : Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      last = fmt(v); st.textContent = last;
      if(k < 1) (window.requestAnimationFrame || setTimeout)(step, 16);
    })();
  }
  try{ var hh = function(){ var h = hud(); if(h && window.MutationObserver && !hh.o){ hh.o = new MutationObserver(function(){ if(!S.B) syncFill(); }); hh.o.observe(h, { childList: true, subtree: true, characterData: true }); syncFill(); } return !!hh.o; };
    if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ hh(); }, { once: true }); else hh();
    setTimeout(hh, 1500); setTimeout(hh, 5000); }catch(e){}

  /* ================================================================== AUDIO — one polite request on the shared lane, after everything more important */
  function scheduleVoice(B, cls, rec, vp){
    var holdMs = config.holdMs[cls.tier] || 4500, h = { rec: rec, cls: cls, B: B, until: now() + holdMs, tier: cls.tier };
    if(S.pend){ if(S.pend.tier > cls.tier) { rec.voice = "yielded-to-pending"; return; } S.pend.rec.voice = "replaced"; }   // the more important celebration wins the single slot
    S.pend = h; clearTimeout(S.pendT);
    (function again(){
      S.pendT = setTimeout(function(){
        var q = S.pend; if(!q) return;
        var cb = criticalBlock();
        if(cb){ S.pend = null; q.rec.voice = "blocked-" + cb; return; }
        if(!audioOn()){ S.pend = null; q.rec.voice = "audio-off"; return; }
        if(now() > q.until){ S.pend = null; q.rec.voice = "expired"; return; }
        if(!voiceFree()) return again();
        S.pend = null; speak(q);
      }, 160);
    })();
  }
  function speak(q){
    var rec = q.rec, cls = q.cls, debug = !!q.B.eL.debug, id = pickClip(cls.type, cls.tier, debug);
    if(!id){ rec.voice = "no-fresh-phrase"; return; }
    var c = CLIPS[id]; rec.clip = id; rec.voice = "played"; var lv = level(), t = Date.now();
    if(!debug){
      S.lastVoiceAt = now(); S.perLevel[lv] = (S.perLevel[lv] || 0) + 1; if(cls.tier === 2) S.std[lv] = (S.std[lv] || 0) + 1;
      S.recent.push(id); if(S.recent.length > 12) S.recent.shift(); S.recentAt[id] = t; save();
    }
    if(config.dryRun) return;
    FM.say(c.url, { pri: clipPriority(id), polite: true, maxMs: 4500, label: "xp:" + id, fallbacks: c.fallbacks }).then(function(ok){ rec.spoke = !!ok; });
  }

  /* ================================================================== PUBLIC STATE / RESET */
  XP.submit = submit;
  XP.classify = function(o){ var e = cleanEvent(o); if(!e) return null; var B = { e0: e, eL: e, kind: e.kind, sum: e.amount, count: 1, final: e.final, jackpot: e.jackpot }; return classify(B); };
  XP.state = function(){ return { version: VERSION, recent: S.recent.slice(), lastVoiceAt: S.lastVoiceAt, perLevel: JSON.parse(JSON.stringify(S.perLevel)), log: S.log.slice(), batching: !!S.B, held: !!S.pend, floats: S.floats.length, drops: S.drops, queue: S.queue.length }; };
  XP.reset = function(){ S.timers.forEach(clearTimeout); S.timers = []; clearTimeout(S.pendT); S.pend = null; S.B = null; S.queue = []; S.floats.forEach(function(el){ if(el.parentNode) el.parentNode.removeChild(el); }); S.floats = []; S.drops = 0;
    S.recent = []; S.recentAt = {}; S.lastVoiceAt = -1e9; S.perLevel = {}; S.std = {}; S.log = []; S.lastKey = ""; save(); var r = document.getElementById("xpreRoot"); if(r) r.innerHTML = ""; };
  XP.resetMemory = XP.reset;
  /* failure / level complete / next challenge: any held reward voice is dropped, never replayed late */
  function dropVoice(why){ if(S.pend){ S.pend.rec.voice = why; S.pend = null; clearTimeout(S.pendT); } }
  window.addEventListener("gei:flow-event", function(e){ try{ var d = e.detail || {}; if(d.type === "fail" || d.type === "level") dropVoice("cancelled-" + d.type); if(d.type === "start") S.level = level(); }catch(err){} });
  window.addEventListener("gei:audio-mute", function(e){ try{ if(e.detail && e.detail.muted) dropVoice("audio-off"); }catch(err){} });
  window.addEventListener("resize", function(){ syncFill(); });

  /* ================================================================== DEBUG (development hosts only) */
  function dbgSubmit(o){ var e = { kind: o.kind || "xp", amount: o.amount, source: o.source || "MISSION" }; for(var k in o) e[k] = o[k]; e.debug = true; return submit(e); }   // fake events carry no total: they can never touch a balance
  XP.debug = {
    clips: function(){ return Object.keys(CLIPS).map(function(k){ return { id: k, text: CLIPS[k].text, url: CLIPS[k].url, pri: CLIPS[k].pri }; }); },
    audio: function(id){ var c = CLIPS[id]; if(!c) return false; if(!audioOn()) return false; return FM.say(c.url, { pri: c.pri, polite: true, maxMs: 4500, label: "xp:test:" + id }); },
    xp: function(n, src){ return dbgSubmit({ amount: n, source: src || "MISSION" }); },
    stack: function(n, each){ n = n || 4; each = each || 10; var i = 0; (function go(){ if(i++ >= n) return; dbgSubmit({ amount: each, source: "TAP" }); setTimeout(go, 90); })(); return n * each; },
    lock: function(n){ return dbgSubmit({ amount: n || 111, source: "LEVEL_COMPLETION", final: false, kind: "flowpoints" }); },
    rewardSecured: function(){ return submit({ kind: "reward", amount: 0, source: "UNLOCK", label: "NEW REWARD", phase: "secured", debug: true }); },
    flowPoints: function(n){ return dbgSubmit({ kind: "flowpoints", amount: n || 666, source: "BONUS" }); },
    major: function(){ return dbgSubmit({ amount: 6660, source: "BONUS", jackpot: true, kind: "flowpoints" }); }
  };
  if(isDev()){
    window.testXPReward = function(n){ return XP.debug.xp(n == null ? 37 : n); };
    window.testXPStack = function(){ return XP.debug.stack(); };
    window.testXPLock = function(n){ return XP.debug.lock(n); };
    window.testRewardSecured = function(){ return XP.debug.rewardSecured(); };
    window.testFlowPointsSecured = function(n){ return XP.debug.flowPoints(n); };
    window.testMajorReward = function(){ return XP.debug.major(); };
    window.testXPAudio = function(id){ return id ? XP.debug.audio(id) : XP.debug.clips(); };
    XP.devEnabled = true;
  } else { XP.debug = undefined; XP.devEnabled = false; }

  /* ================================================================== AUDIO VERIFICATION + PRELOAD (same pattern as the WOW engine) */
  var diag = {};
  function fix(u){ return u.replace(/\.mp3t$/i, ".mp3"); }
  XP.verify = function(){
    return Promise.all(Object.keys(CLIPS).map(function(id){
      var c = CLIPS[id], tried = [c.url].concat(c.fallbacks || []); var f = fix(c.url); if(tried.indexOf(f) < 0) tried.push(f);
      return (function next(i){
        if(i >= tried.length){ diag[id] = { url: c.url, ok: false, tried: tried }; warn("XP clip '" + id + "' could not be loaded: " + c.url); try{ window.dispatchEvent(new CustomEvent("gei:audio-broken", { detail: { url: c.url, id: id } })); }catch(e){} return { id: id, ok: false }; }
        return FM.fx.probe(tried[i]).then(function(r){ if(r.ok){ var rep = i > 0; if(rep) c.url = tried[i]; diag[id] = { url: c.url, ok: true, repaired: rep }; return { id: id, ok: true, repaired: rep }; } return next(i + 1); });
      })(0);
    })).then(function(res){ XP.lastVerify = res; return res; });
  };
  XP.diagnostics = function(){ return JSON.parse(JSON.stringify(diag)); };
  XP.preload = function(){
    try{ if(navigator.connection && navigator.connection.saveData) return; XP._warm = XP._warm || {};
      ["xpEarned", "stacked", "locked", "moreXp"].forEach(function(id){ if(XP._warm[id]) return; var a = new Audio(); a.preload = "auto"; a.src = CLIPS[id].url; XP._warm[id] = a; }); }catch(e){}
  };
  try{ (window.requestIdleCallback || function(f){ return setTimeout(f, 6000); })(function(){ if(audioOn()) XP.preload(); XP.verify(); }, { timeout: 14000 }); }catch(e){}

  window.XPRewardEngine = XP;
})();
