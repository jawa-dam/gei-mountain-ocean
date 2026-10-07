/* V2.2.15 — RARE WOW MOMENT ENGINE 🌊✨   "the game noticed me"
 *
 * Not a playlist. A rare, scored, remembered moment:
 *
 *      GAME EVENT → WOW SCORE → (rare tier roll) → WOW VISUAL → WOW TEXT → WOW AUDIO → CHARACTER REACTION → back to gameplay     (~1.8–3 s)
 *
 *   · it watches the same read-only `gei:flow-event` stream as the Personality / STEM engines (tap · combo · day · fail · level · start)
 *   · every candidate moment gets a wowScore built from REAL gameplay state:
 *       comboIntensity + flowIntensity + unusualEvent + recoveryBonus + milestoneBonus + visualEventBonus + firstTimeBonus + stemBonus + rarityBonus
 *   · the score must reach a tier threshold (common 40 · rare 58 · epic 76 · ultra 96); eligible phrases are filtered by what actually happened,
 *     recent phrases / categories are removed (the engine has MEMORY, persisted), a strong cooldown (rareWowCooldown) follows every WOW,
 *     and only then is a controlled-random choice made
 *   · it is blocked during the Dam Failure Cinematic, the Level Complete sequence, the Next Challenge transition, the final push (2 MORE / ONE MORE),
 *     the critical last seconds of the clock; moments earned on a level's final station are DEFERRED to the next run instead of fighting the victory
 *   · audio: one polite request on the shared voice lane (priority 5.5 — after failure · level complete · ONE MORE · milestone · next challenge · STEM ·
 *     achievement, before personality · reactions). Never talks over anything, never interrupts anything. Audio OFF = the visual WOW still plays.
 *   · layered with STEM ("Moving water means energy" … then, if exceptional, "Now that's some power!") and Personality (WOW is the higher-value moment;
 *     personality stays quiet around it)
 *
 * Debug (console only — there is NO production UI):  triggerRareWow("common"|"rare"|"epic"|"ultra")  ·  triggerRareWow("damWild")  ·  RareWowMomentEngine.debug.list()
 * Debug triggers bypass score / cooldown / history and never write to the player's memory; they still refuse to run over the failure cinematic.
 */
(function(){
  "use strict";
  var FM = window.FlowMomentEngine;
  if(!FM || window.RareWowMomentEngine) return;
  var VERSION = "V2.2.15";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var PRI = FM.priorities;
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function rand(a, b){ return a + Math.random() * (b - a); }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function warn(e){ try{ console.warn("[WOW] " + (e && e.message || e)); }catch(_){} }
  function gs(){ try{ return (typeof state !== "undefined" && state) || {}; }catch(e){ return {}; } }
  function reduced(){ try{ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return false; } }

  /* ================================================================== AUDIO LIBRARY — the ten supplied WOW clips */
  var TIERS = ["common", "rare", "epic", "ultra"];
  function clip(id, tier, category, kinds, text, file, extra){ var o = { id: id, tier: tier, category: category, kinds: kinds, text: text, url: CDN + file }; if(extra) for(var k in extra) o[k] = extra[k]; return o; }
  var CLIPS = {
    awesome:   clip("awesome",   "common", "performance", ["combo", "flow", "performance", "recovery"], "OKAY… THAT WAS AWESOME!",   "okay...-that-was-awesome-PFNYTbtk7XKllNHq.mp3", { emoji: "🔥" }),
    lookWater: clip("lookWater", "common", "water",       ["water", "surge"],                           "WHOA, LOOK AT THAT WATER!", "whoa-look-at-that-water-qxgCbW23gUj9jOCZ.mp3", { emoji: "💧" }),
    flowBreak: clip("flowBreak", "rare",   "recovery",    ["flowBreak", "recovery"],                    "YOU JUST BROKE THE FLOW!",  "you-just-broke-the-flow-2luy9AL8aCWEpkYo.mp3",  { emoji: "⚡" }),
    wowMoment: clip("wowMoment", "rare",   "general",     ["combo", "performance", "stem", "milestone", "perfect", "flow"], "THAT'S A WOW MOMENT!", "that-s-a-wow-moment-yEiRstQXKsMCkmtE.mp3", { emoji: "🌟" }),
    damWild:   clip("damWild",   "rare",   "dramatic",    ["flow", "water", "surge", "combo"],          "THAT WAS DAM WILD!",        "that-was-dam-wild-EAAUorBPfR8UEPId.mp3",       { emoji: "🌊" }),
    power:     clip("power",     "rare",   "power",       ["power", "stem"],                            "NOW THAT'S SOME POWER!",    "now-that-s-some-power-vEhAPKORhyQLiQMf.mp3",   { emoji: "⚡" }),
    flowCrazy: clip("flowCrazy", "epic",   "flow",        ["flow", "combo"],                            "THAT FLOW JUST WENT CRAZY!", "the-flow-just-went-crazy-J9TfvqTuLhEOCBoa.mp3", { emoji: "🌪️" }),
    bigOne:    clip("bigOne",    "epic",   "milestone",   ["milestone", "combo", "performance"],        "OH, THAT WAS A BIG ONE!",   "oh-that-was-a-big-one-8z2GuBuUkcYKCq5V.mp3",   { emoji: "🏆" }),
    didThat:   clip("didThat",   "ultra",  "mystery",     ["perfect", "mystery"],                       "DID THAT JUST HAPPEN?!",    "did-that-just-happen-7p9RXjHoZ4DYF9du.mp3",    { emoji: "✨" }),
    whatWas:   clip("whatWas",   "ultra",  "mystery",     ["mystery"],                                  "WHOA… WHAT WAS THAT?",      "whoa-what-was-that-ifxvQUxNUvyuHA7S.mp3",      { emoji: "👀" })
  };

  /* ================================================================== CONFIG */
  var config = {
    enabled: true,
    rng: null,
    dryRun: false,                       // tests: decide + log, no visual / sound
    visuals: true,
    requirePlaying: true,
    minLevel: 2,                         // level 1 is the learning level: no WOW yet
    threshold: { common: 40, rare: 58, epic: 76, ultra: 96 },          // wowScore needed per tier
    tierChance: { common: .6, rare: .5, epic: .55, ultra: .6 },        // after the score is reached the moment still has to be "lucky"
    rareWowCooldownMs: 80000,            // after ANY wow nothing else fires for this long (rareWowCooldown)
    minTapsBetween: 24,                  // …and the player must have played this many taps
    maxPerLevel: 2, maxPerSession: 12,
    recentIds: 4,                        // the last N phrases are never repeated; the previous phrase's CATEGORY is also skipped
    minRemMs: 2500,                      // never mid-run in the last seconds of the clock
    minGapAfterVoiceMs: 700, holdMs: 2600, leadMs: 260,
    tapWindowMs: 1000,
    mysteryChance: .03,                  // per eligible day — the hidden "what was that?" event
    slow: { rate: .22, ms: 380 },        // micro-pause (visual only — clocks and scoring never slow)
    show: { common: 1900, rare: 2300, epic: 2700, ultra: 3200 },
    stemWindowMs: 9000,
    deferMaxMs: 120000,                  // a level-end moment is only delivered if the next run starts soon after
    settleMs: 420, maxSettleMs: 1100     // a combo is judged at its PEAK: the engine waits for the run to stop climbing before it decides
  };
  var WOW = { version: VERSION, config: config, clips: CLIPS, tiers: TIERS };
  function rng(){ return (config.rng || Math.random)(); }

  /* ================================================================== STATE + MEMORY */
  var S = { lastAt: -1e9, cooldown: false, tapsSince: 999, perLevel: {}, session: 0, level: "", recentIds: [], recentCats: [], hist: {}, discovered: { kinds: {}, tiers: {}, clips: {} },
    log: [], taps: [], fastRun: 0, bestStreak: 0, brokenStreak: 0, lastTapAt: 0, deferred: null, pend: null, pendT: 0, activeUntil: 0, lastReaction: "", lastEnv: "", dayFailed: false,
    recovered: false, cand: null, candT: 0, timers: [], visEl: null, visT: 0, lastStemAt: -1e9, mysteryDay: "" };
  var KEY = "geiRareWowV1";
  try{ var m = JSON.parse(localStorage.getItem(KEY) || "null"); if(m){ if(m.recentIds) S.recentIds = m.recentIds.slice(-12); if(m.recentCats) S.recentCats = m.recentCats.slice(-12); if(m.hist) S.hist = m.hist; if(m.discovered) S.discovered = m.discovered; } }catch(e){}
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify({ recentIds: S.recentIds, recentCats: S.recentCats, hist: S.hist, discovered: S.discovered })); }catch(e){} }
  function later(fn, ms){ var id = setTimeout(function(){ var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1); try{ fn(); }catch(e){ warn(e); } }, Math.max(0, ms)); S.timers.push(id); return id; }

  /* ================================================================== SCORING — intelligent, not random */
  function tapsWithin(ms, t){ var c = 0; for(var i = S.taps.length - 1; i >= 0; i--){ if(t - S.taps[i] <= ms) c++; else break; } return c; }
  function stemRecent(t){ try{ var s = window.StemIntelligenceEngine && StemIntelligenceEngine.state(); if(s && s.lastAt > 0 && t - s.lastAt >= 0 && t - s.lastAt < config.stemWindowMs) return true; }catch(e){} return false; }
  /* score(kind, ctx) → { total, parts } — every part is derived from the actual game state carried by the event */
  function score(kind, ctx){
    var t = ctx.ts != null ? ctx.ts : now(), streak = ctx.streak | 0, p = {};
    p.comboIntensity = streak >= 6 ? Math.min(30, (streak - 5) * 3) : 0;
    var rate = tapsWithin(config.tapWindowMs, t); p.flowIntensity = rate >= 5 ? Math.min(25, (rate - 4) * 7) + (S.fastRun >= 8 ? 6 : 0) : 0;
    p.unusualEvent = (ctx.unusual | 0) + (kind === "flowBreak" && S.brokenStreak >= 8 && streak >= 6 ? 24 : 0);
    p.recoveryBonus = (ctx.near ? 28 : ctx.closeCall ? 18 : 0) + (ctx.recovered ? 14 : 0);
    p.milestoneBonus = (ctx.milestone ? 24 : 0) + (ctx.firstClear ? 10 : 0) + ((ctx.maxCombo | 0) >= 16 ? 15 : 0);
    p.visualEventBonus = ctx.visual | 0;
    p.firstTimeBonus = S.discovered.kinds[kind] ? 0 : 10;
    p.stemBonus = stemRecent(t) ? 8 : 0;
    p.rarityBonus = rng() * 8;                                       // a little luck, never enough to carry a weak moment
    var total = 0; for(var k in p) total += p[k];
    return { total: total, parts: p };
  }
  function tierFor(total){ var th = config.threshold, r = ""; TIERS.forEach(function(t){ if(total >= th[t]) r = t; }); return r; }

  /* ================================================================== SELECTION: eligible → filter by context → remove recent → rarity → pick */
  function eligible(kind, total){
    var th = config.threshold;
    return Object.keys(CLIPS).map(function(k){ return CLIPS[k]; }).filter(function(c){ return c.kinds.indexOf(kind) >= 0 && total >= th[c.tier]; });
  }
  function usable(list){
    var recent = S.recentIds.slice(-config.recentIds), lastCat = S.recentCats[S.recentCats.length - 1];
    return list.filter(function(c){ return recent.indexOf(c.id) < 0 && c.category !== lastCat; });
  }
  function choose(kind, total, forceTier){
    var list = usable(eligible(kind, total)); if(!list.length) return { clip: null, why: "history" };
    for(var ti = TIERS.length - 1; ti >= 0; ti--){
      var tier = TIERS[ti], group = list.filter(function(c){ return c.tier === tier; }); if(!group.length) continue;
      var chance = config.tierChance[tier] * (S.discovered.tiers[tier] ? 1 : 1.25);
      if(!(forceTier || rng() < chance)) continue;
      var tot = 0, w = group.map(function(c){ var x = 1 / (1 + ((S.hist[c.id] && S.hist[c.id].n) || 0) * .5); tot += x; return x; }), x = rng() * tot;
      for(var i = 0; i < group.length; i++){ x -= w[i]; if(x < 0) return { clip: group[i], tier: tier }; }
      return { clip: group[group.length - 1], tier: tier };
    }
    return { clip: null, why: "chance" };
  }

  /* ================================================================== GATES */
  function level(){ return gs().level | 0 || 1; }
  function blocked(ctx){
    var fs = FM.state(); if(fs.cinematic || fs.levelComplete || fs.cardShown || fs.transition) return "critical";
    var st = gs(); if(config.requirePlaying && st.phase && st.phase !== "playing" && !ctx.afterDay) return "phase";
    if(!ctx.afterDay){ if(fs.flowLevel >= 4) return "final-push"; if(ctx.remMs != null && ctx.remMs < config.minRemMs) return "clock"; if(fs.pressure && fs.pressure.on && fs.pressure.stage >= 2) return "pressure"; }
    return "";
  }
  function restOk(ctx, t, tier){
    if(ctx.force) return "";
    if(level() < config.minLevel) return "locked";
    if(S.cooldown && t - S.lastAt < config.rareWowCooldownMs) return "cooldown";
    if(S.tapsSince < config.minTapsBetween && S.lastAt > 0) return "taps";
    if((S.perLevel[S.level] || 0) >= config.maxPerLevel && tier !== "ultra") return "level-cap";
    if(S.session >= config.maxPerSession) return "session-cap";
    return "";
  }
  function voiceFree(){ return !FM.voiceBusy() && !FM.fx.othersSpeaking() && FM.fx.sinceVoice() >= config.minGapAfterVoiceMs && !stemPending(); }
  function stemPending(){ try{ var s = window.StemIntelligenceEngine && StemIntelligenceEngine.state(); return !!(s && (s.held || s.queued)); }catch(e){ return false; } }
  function audioOn(){ try{ var a = window.GEI_AUDIO; if(a && typeof a.isMuted === "function") return !a.isMuted(); if(a && a.muted != null) return !a.muted; }catch(e){} return true; }

  /* consider(kind, ctx): one scored candidate. Returns the log entry when it fired, "held", or false. */
  function consider(kind, ctx){
    try{
      ctx = ctx || {}; var t = ctx.ts != null ? ctx.ts : (ctx.ts = now());
      if(!config.enabled) return false;
      var sc = score(kind, ctx), tier = tierFor(sc.total), rec = { kind: kind, score: Math.round(sc.total * 10) / 10, parts: sc.parts, tier: tier, t: t };
      var why = !tier ? "score" : blocked(ctx) || "";
      if(!why){ var pick = choose(kind, sc.total, ctx.forceTier); if(!pick.clip) why = pick.why; else { why = restOk(ctx, t, pick.tier); if(!why){ rec.clip = pick.clip.id; rec.tier = pick.tier; rec.category = pick.clip.category; } } }
      if(why){ if(why !== "score") { rec.skipped = why; rec.spoke = false; log(rec); } return false; }       // an ordinary moment is simply not a candidate: nothing to log
      S.cooldown = true; S.lastAt = t;                                        // claim the slot NOW so nothing else (a second tap, a second event) can double-fire
      if(config.dryRun){ commit(rec, ctx); return rec; }
      if(!voiceFree() && audioOn()){ hold({ rec: rec, ctx: ctx, until: now() + config.holdMs }); return "held"; }
      return perform(rec, ctx);
    }catch(e){ warn(e); return false; }
  }
  function log(r){ S.log.push(r); if(S.log.length > 80) S.log.shift(); }
  function commit(rec, ctx){
    var c = CLIPS[rec.clip]; S.lastAt = ctx.ts != null ? ctx.ts : now(); S.cooldown = true; S.tapsSince = 0; S.session++; S.perLevel[S.level] = (S.perLevel[S.level] || 0) + 1;
    S.recentIds.push(c.id); S.recentCats.push(c.category); if(S.recentIds.length > 12) S.recentIds.shift(); if(S.recentCats.length > 12) S.recentCats.shift();
    var h = S.hist[c.id] || (S.hist[c.id] = { n: 0, at: 0 }); h.n++; h.at = Date.now();
    S.discovered.kinds[rec.kind] = 1; S.discovered.tiers[rec.tier] = 1; S.discovered.clips[c.id] = 1; save(); log(rec);
    try{ window.dispatchEvent(new CustomEvent("gei:wow", { detail: { id: c.id, tier: rec.tier, category: c.category, score: rec.score } })); }catch(e){}
  }
  function hold(h){
    S.pend = h; clearTimeout(S.pendT);
    (function again(){
      S.pendT = setTimeout(function(){
        var q = S.pend; if(!q) return;
        if(blocked(q.ctx) && !q.ctx.afterDay || (blocked(q.ctx) === "critical")){ S.pend = null; S.cooldown = false; q.rec.skipped = "blocked-while-held"; q.rec.spoke = false; log(q.rec); return; }
        if(now() > q.until){ S.pend = null; S.cooldown = false; q.rec.skipped = "expired"; q.rec.spoke = false; log(q.rec); return; }
        if(!voiceFree() && audioOn()) return again();
        S.pend = null; perform(q.rec, q.ctx);
      }, 200);
    })();
  }

  /* ================================================================== PRESENTATION — DETECT → MICRO PAUSE → VISUAL → AUDIO → REACTION → RETURN */
  var css = [
".rwWow{position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;overflow:hidden;--d:2200ms;--c1:#7fe3ff;--c2:#1c8cff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}",
".rwTint{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,var(--tint,rgba(120,220,255,.34)),rgba(0,0,0,0) 68%);opacity:0;animation:rwTint var(--d) ease-out forwards}",
".rwCore{position:absolute;left:50%;top:var(--cy,44%);width:min(96%,460px);transform:translate3d(-50%,-50%,0);display:flex;flex-direction:column;align-items:center;gap:.25rem;text-align:center;opacity:0;animation:rwIn var(--d) cubic-bezier(.2,1.1,.25,1) forwards;will-change:transform,opacity}",
".rwTag{font:900 clamp(.62rem,2.9vw,.82rem)/1 system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;padding:.3em .8em;border-radius:99px;color:#04223f;background:linear-gradient(90deg,var(--c1),#fff);box-shadow:0 0 14px var(--c1)}",
".rwTxt{font:1000 clamp(1.45rem,min(10.8vw,calc(var(--fme-h,560px) * .19)),3.4rem)/.98 'Arial Black',Impact,system-ui,sans-serif;letter-spacing:.02em;text-transform:uppercase;color:#fff;max-width:96%;overflow-wrap:anywhere;text-shadow:0 0 .35em var(--c2),0 3px 0 rgba(8,40,90,.9),0 0 22px var(--c1);-webkit-text-stroke:1.5px rgba(5,40,100,.85);paint-order:stroke fill}",
".rwWow.t-epic .rwTxt,.rwWow.t-ultra .rwTxt{font-size:clamp(1.55rem,min(11.6vw,calc(var(--fme-h,560px) * .2)),3.7rem)}",
".rwRow{display:flex;align-items:center;justify-content:center;gap:.5rem;max-width:100%}.rwHead{display:flex;align-items:center;justify-content:center;gap:.5rem}",
".rwAv{flex:0 0 auto;width:clamp(32px,min(13vw,calc(var(--fme-h,560px) * .2)),72px);height:clamp(32px,min(13vw,calc(var(--fme-h,560px) * .2)),72px);object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.55));transform-origin:50% 90%;animation:var(--react,rwJump) var(--d) cubic-bezier(.3,1.5,.4,1) forwards}",
".rwEm{font-size:clamp(1.3rem,min(8vw,calc(var(--fme-h,560px) * .14)),2.4rem);filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}",
".rwRing{position:absolute;left:50%;top:44%;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;border:4px solid var(--c1);box-shadow:0 0 18px var(--c1),inset 0 0 14px var(--c1);opacity:0;animation:rwRing calc(var(--d) * .6) ease-out forwards}",
".rwRing.r2{animation-delay:.18s;border-width:2px}.rwRing.r3{animation-delay:.36s;border-width:2px}",
".rwLines{position:absolute;inset:0;opacity:0;animation:rwTint var(--d) ease-out forwards;background:repeating-linear-gradient(100deg,rgba(255,255,255,0) 0 18px,var(--c1) 18px 20px,rgba(255,255,255,0) 20px 46px);-webkit-mask-image:radial-gradient(ellipse at 50% 44%,transparent 18%,#000 80%);mask-image:radial-gradient(ellipse at 50% 44%,transparent 18%,#000 80%);background-size:200% 100%;animation-name:rwTint,rwLines}",
".rwSpark{position:absolute;width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 10px 3px var(--c1);opacity:0;animation:rwSpark calc(var(--d) * .7) ease-out forwards}",
".rwWow.t-ultra .rwTxt{animation:rwUltra 1.6s ease-in-out infinite alternate}",
".station .body.rwSpin{animation:fmeSpin .3s linear infinite!important;transform-box:fill-box;transform-origin:50% 50%}",
"@keyframes rwTint{0%{opacity:0}18%{opacity:1}70%{opacity:.8}100%{opacity:0}}",
"@keyframes rwLines{from{background-position:0 0}to{background-position:-100% 0}}",
"@keyframes rwIn{0%{opacity:0;transform:translate3d(-50%,-50%,0) scale(.4)}14%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1.18)}26%{transform:translate3d(-50%,-50%,0) scale(.96)}36%{transform:translate3d(-50%,-50%,0) scale(1.03)}46%{transform:translate3d(-50%,-50%,0) scale(1)}84%{opacity:1}100%{opacity:0;transform:translate3d(-50%,-58%,0) scale(1)}}",
"@keyframes rwRing{0%{opacity:.95;transform:scale(.4)}100%{opacity:0;transform:scale(7)}}",
"@keyframes rwSpark{0%{opacity:0;transform:translate3d(0,0,0) scale(.4)}20%{opacity:1}100%{opacity:0;transform:translate3d(var(--sx),var(--sy),0) scale(1.2)}}",
"@keyframes rwUltra{from{text-shadow:0 0 .35em var(--c2),0 3px 0 rgba(8,40,90,.9),0 0 22px var(--c1)}to{text-shadow:0 0 .5em #fff,0 3px 0 rgba(8,40,90,.9),0 0 40px var(--c1)}}",
"@keyframes rwJump{0%{transform:translateY(8px) scale(.4);opacity:0}20%{opacity:1;transform:translateY(-26px) scale(1.15)}40%{transform:translateY(0) scale(1)}58%{transform:translateY(-14px)}76%{transform:translateY(0)}100%{opacity:0}}",
"@keyframes rwCelebrate{0%{opacity:0;transform:scale(.3) rotate(-14deg)}20%{opacity:1;transform:scale(1.2) rotate(10deg)}36%{transform:rotate(-10deg)}52%{transform:rotate(8deg)}68%{transform:rotate(-5deg)}84%{opacity:1;transform:rotate(0)}100%{opacity:0}}",
"@keyframes rwShock{0%{opacity:0;transform:scale(.4)}12%{opacity:1;transform:scale(1.35,.8)}24%{transform:scale(.9,1.2)}36%{transform:translateX(-4px) scale(1.05)}46%{transform:translateX(4px)}56%{transform:translateX(-3px)}66%{transform:translateX(0) scale(1)}86%{opacity:1}100%{opacity:0}}",
"@keyframes rwPoint{0%{opacity:0;transform:translateX(-14px) rotate(-30deg) scale(.5)}22%{opacity:1;transform:translateX(0) rotate(-14deg) scale(1.1)}40%{transform:translateX(6px) rotate(-22deg)}58%{transform:translateX(0) rotate(-14deg)}86%{opacity:1}100%{opacity:0}}",
"@keyframes rwHands{0%{opacity:0;transform:scale(.4)}18%{opacity:1;transform:scale(1,1.3) translateY(-8px)}34%{transform:scale(1.1,.85)}50%{transform:scale(.95,1.25) translateY(-10px)}66%{transform:scale(1)}86%{opacity:1}100%{opacity:0}}",
"@keyframes rwSpinAv{0%{opacity:0;transform:rotate(0) scale(.4)}20%{opacity:1;transform:rotate(180deg) scale(1.2)}50%{transform:rotate(360deg) scale(1)}86%{opacity:1;transform:rotate(360deg)}100%{opacity:0}}",
"@keyframes rwLookR{0%{opacity:0;transform:scale(.5)}20%{opacity:1;transform:scale(1.1)}36%{transform:translateX(10px) rotate(8deg)}60%{transform:translateX(10px) rotate(8deg)}78%{transform:translateX(0)}100%{opacity:0}}",
"@media (prefers-reduced-motion:reduce){.rwTint,.rwCore{animation:rwFade var(--d) linear forwards!important}.rwAv,.rwRing,.rwLines,.rwSpark{display:none}.rwWow.t-ultra .rwTxt{animation:none}.station .body.rwSpin{animation:none!important}}",
"@keyframes rwFade{0%{opacity:0}12%{opacity:1}82%{opacity:1}100%{opacity:0}}"
  ].join("\n");
  function addCss(){ if(document.getElementById("rwStyle")) return; var s = document.createElement("style"); s.id = "rwStyle"; s.textContent = css; document.head.appendChild(s); }
  var TINT = { aqua: ["rgba(120,225,255,.34)", "#7fe3ff", "#1c8cff"], gold: ["rgba(255,214,110,.36)", "#ffe27a", "#e08a00"], dusk: ["rgba(120,130,255,.34)", "#a9b4ff", "#4a46d8"], mist: ["rgba(235,248,255,.38)", "#ffffff", "#5aa6e0"], violet: ["rgba(190,120,255,.38)", "#e1b8ff", "#8a3dff"], green: ["rgba(120,255,190,.30)", "#9dffd0", "#16a874"] };
  var ENVS = { water: ["aqua", "mist", "dusk"], flow: ["aqua", "gold"], power: ["gold", "aqua"], performance: ["gold", "aqua"], milestone: ["gold"], recovery: ["green", "aqua"], dramatic: ["dusk", "aqua", "mist"], general: ["gold", "aqua"], mystery: ["violet"] };
  var REACTIONS = ["rwJump", "rwCelebrate", "rwShock", "rwPoint", "rwHands", "rwSpinAv", "rwLookR"];
  var REACT_BY_CAT = { water: ["rwShock", "rwPoint", "rwJump"], flow: ["rwHands", "rwJump", "rwCelebrate"], power: ["rwLookR", "rwHands", "rwCelebrate"], performance: ["rwCelebrate", "rwJump", "rwSpinAv"], milestone: ["rwHands", "rwSpinAv", "rwCelebrate"],
    recovery: ["rwHands", "rwShock", "rwJump"], dramatic: ["rwShock", "rwHands", "rwJump"], general: ["rwCelebrate", "rwJump", "rwPoint"], mystery: ["rwShock", "rwSpinAv", "rwPoint"] };
  function pickNot(list, last){ var f = list.filter(function(x){ return x !== last; }); f = f.length ? f : list; return f[Math.floor(rng() * f.length) % f.length]; }
  function stationBody(i){ return document.querySelector('#stationsGroup .station[data-index="' + i + '"] .body'); }
  function classFor(b, cls, ms){ if(!b || reduced()) return; b.classList.add(cls); later(function(){ b.classList.remove(cls); }, ms); }

  /* the environment: hydraulic effects that fit the world — water bursts, rings, foam, wheel acceleration, gate flash, pressure pulse, glowing flow path, lighting shift */
  function environment(cat, tier, ctx){
    var box = FM.fx.box(), d = FM.fx.damPoint(), big = tier === "epic" || tier === "ultra", n = big ? 26 : 14;
    if(cat === "water" || cat === "dramatic"){ FM.fx.burst(d.x, d.y, n + 8, { spread: 220, up: 140, fall: 130, max: 15, durMax: 1400 }); FM.fx.ring(d.x, d.y); if(big) later(function(){ FM.fx.ring(d.x, d.y); }, 220); }
    else if(cat === "power"){ classFor(stationBody(4), "rwSpin", 1500); classFor(stationBody(5), "fmeGlow", 1700); FM.fx.burst(box.w * .5, box.h * .42, n, { spread: 150, up: 90, fall: 40, cls: "foam" }); }
    else if(cat === "flow"){ FM.fx.burst(box.w * .5, box.h * .44, n + 10, { spread: 190, up: 70, fall: 70, max: 13 }); FM.fx.ring(box.w * .5, box.h * .44); }
    else if(cat === "recovery"){ classFor(stationBody(1), "fmeShake1", 700); classFor(stationBody(3), "fmeGlow", 1300); FM.fx.ring(d.x, d.y); FM.fx.burst(d.x, d.y, n, { spread: 120, up: 70, fall: 50 }); }
    else if(cat === "milestone"){ FM.fx.burst(box.w * .5, box.h * .4, n + 14, { spread: 200, up: 100, fall: 60, max: 14, durMax: 1400 }); FM.fx.ring(box.w * .5, box.h * .42); classFor(stationBody(5), "fmeGlow", 1700); }
    else if(cat === "mystery"){ FM.fx.ring(box.w * .5, box.h * .44); later(function(){ FM.fx.ring(box.w * .3, box.h * .6); }, 240); later(function(){ FM.fx.ring(box.w * .7, box.h * .3); }, 480); FM.fx.burst(box.w * .5, box.h * .44, n + 12, { spread: 210, up: 60, fall: 20, cls: "bub", max: 12, durMax: 1500 }); }
    else { FM.fx.burst(box.w * .5, box.h * .44, n, { spread: 160, up: 80, fall: 60 }); FM.fx.ring(box.w * .5, box.h * .44); }
  }
  function show(rec, c, ctx, dur){
    try{
      var host = FM.fx.top(); if(!host) return; addCss(); clear();
      var envName = pickNot(ENVS[c.category] || ENVS.general, S.lastEnv); S.lastEnv = envName; var tt = TINT[envName], tier = rec.tier;
      var el = document.createElement("div"); el.className = "rwWow t-" + tier + " c-" + c.category; el.style.setProperty("--d", dur + "ms"); el.style.setProperty("--tint", tt[0]); el.style.setProperty("--c1", tt[1]); el.style.setProperty("--c2", tt[2]);
      var react = pickNot(REACT_BY_CAT[c.category] || REACTIONS, S.lastReaction); S.lastReaction = react; el.style.setProperty("--react", react);
      var src = ""; try{ src = FM.fx.charImage(); }catch(e){}
      var html = "<div class='rwTint'></div>" + (c.category === "flow" || c.category === "power" || tier === "epic" ? "<div class='rwLines'></div>" : "") + "<div class='rwRing'></div><div class='rwRing r2'></div>" + (tier === "ultra" || tier === "epic" ? "<div class='rwRing r3'></div>" : "");
      html += "<div class='rwCore'><div class='rwHead'><div class='rwTag'></div></div><div class='rwTxt'></div></div>";
      el.innerHTML = html;
      el.querySelector(".rwTag").textContent = tier === "common" ? "WOW" : tier === "rare" ? "★ RARE WOW" : tier === "epic" ? "★★ EPIC WOW" : "★★★ ULTRA-RARE";
      el.querySelector(".rwTxt").textContent = c.text;
      var row = el.querySelector(".rwHead");
      if(src){ var im = document.createElement("img"); im.className = "rwAv"; im.alt = ""; im.decoding = "async"; im.src = src; im.addEventListener("error", function(){ if(im.parentNode) im.parentNode.removeChild(im); }); row.insertBefore(im, row.firstChild); }   // the player's OWN selected character
      else { var em = document.createElement("span"); em.className = "rwEm"; em.textContent = c.emoji || "🌟"; row.insertBefore(em, row.firstChild); }
      if(!reduced()){ var sp = tier === "ultra" ? 12 : tier === "epic" ? 8 : 4; for(var i = 0; i < sp; i++){ var s = document.createElement("i"); s.className = "rwSpark"; var a = rand(0, 6.28), r = rand(70, 150); s.style.left = rand(20, 80) + "%"; s.style.top = rand(30, 58) + "%"; s.style.setProperty("--sx", Math.cos(a) * r + "px"); s.style.setProperty("--sy", Math.sin(a) * r - 30 + "px"); s.style.animationDelay = rand(0, .5) + "s"; el.appendChild(s); } }
      var hh = host.getBoundingClientRect().height || 560; el.style.setProperty("--fme-h", Math.round(hh) + "px"); if(hh < 300) el.style.setProperty("--cy", "50%");
      host.appendChild(el); S.visEl = el; clearTimeout(S.visT); S.visT = setTimeout(clear, dur + 200);
      environment(c.category, tier, ctx);
    }catch(e){ warn(e); }
  }
  function clear(){ var el = S.visEl; S.visEl = null; clearTimeout(S.visT); if(el && el.parentNode) el.parentNode.removeChild(el); }

  function perform(rec, ctx){
    var c = CLIPS[rec.clip]; commit(rec, ctx);                                                              // PHASE 1 — DETECT (the moment is recognised and remembered)
    var dur = config.show[rec.tier] || 2200; S.activeUntil = now() + dur + 300;
    var timerSafe = ctx.afterDay || ctx.remMs == null || ctx.remMs > 3500;
    if(timerSafe && !ctx.noSlow) FM.fx.slow(config.slow.rate, config.slow.ms);                              // PHASE 2 — MICRO PAUSE (visual only, ~0.4 s, clocks never slow)
    show(rec, c, ctx, dur);                                                                                  // PHASE 3 — VISUAL WOW (+ environment + character reaction, PHASE 5)
    later(function(){                                                                                        // PHASE 4 — AUDIO
      FM.say(c.url, { pri: PRI.wow, polite: true, maxMs: 4200, label: "wow:" + c.id, fallbacks: c.fallbacks }).then(function(ok){ rec.spoke = !!ok; });
    }, config.leadMs);
    later(function(){ S.activeUntil = 0; }, dur + 200);                                                      // PHASE 6 — RETURN TO GAMEPLAY (the overlay dissolves itself)
    return rec;
  }

  /* ================================================================== WATCHING THE GAME (event → scored moment) */
  function budgetMs(){ try{ return WOW_TIMER_ENGINE.fullBudgetMs(); }catch(e){ return 6000; } }
  function onTap(d){
    var t = d.ts != null ? d.ts : now(), st = gs(); S.level = String(st.level || 0);
    if(t - S.lastTapAt > 1500){ S.fastRun = 0; } S.lastTapAt = t; S.taps.push(t); if(S.taps.length > 40) S.taps.shift(); S.tapsSince++;
    if(tapsWithin(config.tapWindowMs, t) >= 5) S.fastRun++; else S.fastRun = Math.max(0, S.fastRun - 1);
    var streak = d.streak | 0; if(streak > S.bestStreak) S.bestStreak = streak;
    var done = d.required != null && d.remaining != null ? d.required - d.remaining : 0;
    if(S.deferred && done >= 2 && (d.index | 0) === 0){ var df = S.deferred; S.deferred = null; if(df.at && now() - df.at > config.deferMaxMs) return false; return consider(df.kind, merge(df.ctx, { ts: t, remMs: d.remMs, afterDay: true })); }   // the level-end WOW, delivered at the start of the next run
    if(streak < 6 && S.fastRun < 6) return false;                                                          // an ordinary tap is never a WOW candidate
    var ctx = { ts: t, remMs: d.remMs, streak: streak, index: d.index };
    /* what KIND of moment is this? — decided by the state of the game */
    var kind = S.brokenStreak >= 8 && streak >= 6 && S.recovered ? "flowBreak" : (d.index | 0) === 2 && streak >= 8 ? "water" : streak >= 12 && S.fastRun >= 8 ? "flow" : "combo";
    if(kind === "water") ctx.visual = 20;
    if(kind === "flowBreak"){ S.brokenStreak = 0; S.recovered = false; ctx.unusual = 6; }
    return candidate(kind, ctx);
  }
  /* a tap-driven moment is not judged on its first qualifying tap — the best point of the run wins (settleMs after the last rise) */
  function candidate(kind, ctx){
    var total = score(kind, ctx).total; if(!tierFor(total)) return false;
    var c = S.cand; if(!c || total >= c.total){ S.cand = { kind: kind, ctx: ctx, total: total, first: c ? c.first : now() }; }
    clearTimeout(S.candT); var wait = Math.max(0, Math.min(config.settleMs, config.maxSettleMs - (now() - S.cand.first)));
    if(config.settleMs <= 0){ return WOW.flush(); }
    S.candT = setTimeout(WOW.flush, wait); return "settling";
  }
  function dropCand(){ clearTimeout(S.candT); S.cand = null; }
  function merge(a, b){ var o = {}, k; for(k in a) o[k] = a[k]; for(k in b) o[k] = b[k]; return o; }
  function onDay(d){
    WOW.flush();
    var t = d.ts != null ? d.ts : now(), idx = d.index | 0, left = d.remMs | 0, bud = budgetMs(), streak = d.streak | 0, st = gs(); S.level = String(st.level || 0);
    var fast = left >= bud * .62, near = left > 0 && left < 1400, ctx = { ts: t, afterDay: true, remMs: d.remMs, streak: streak, index: idx, near: near, closeCall: !!d.closeCall };
    if(S.dayFailed) ctx.recovered = true;
    var out = false, plan = null;
    if(near || d.closeCall) plan = ["recovery", ctx];
    else if(streak >= 8 && fast && idx === 2) plan = ["water", merge(ctx, { visual: 24 })];
    else if(streak >= 8 && fast && (idx === 4 || idx === 5)) plan = ["power", merge(ctx, { visual: 30 })];
    else if(streak >= 10 && fast) plan = [streak >= 20 && idx >= 5 ? "perfect" : "performance", merge(ctx, streak >= 20 && idx >= 5 ? { unusual: 40 } : {})];
    /* the last station of a level: the victory sequence owns that moment — an exceptional run is DEFERRED to the start of the next run */
    if(idx >= 5){ if(plan){ var dc = merge(plan[1], { streak: streak }); delete dc.afterDay; S.deferred = { kind: plan[0], ctx: dc, at: now() }; } }
    else if(plan) out = consider(plan[0], plan[1]);
    /* the hidden event — extremely rare, needs a decent flow, uses the ultra tier */
    if(!out && idx >= 1 && idx < 5 && level() >= 3 && streak >= 5 && rng() < config.mysteryChance && S.mysteryDay !== dayKey()){ S.mysteryDay = dayKey(); out = consider("mystery", merge(ctx, { unusual: 62, visual: 24 })); }
    S.dayFailed = false; S.recovered = false;
    return out;
  }
  function dayKey(){ return gs().level + ":" + gs().currentStep; }
  function onFail(){ dropCand(); S.dayFailed = true; S.recovered = true; if(S.bestStreak >= 8) S.brokenStreak = S.bestStreak; S.bestStreak = 0; S.fastRun = 0; cancelHold(); S.deferred = null; }
  function onLevel(d){
    var p = d.perf || {}; cancelHold(); dropCand();
    var milestone = (p.level | 0) > 0 && (p.level | 0) % 6 === 0 && (p.fails | 0) <= 1, big = (p.maxCombo | 0) >= 16 && !(p.fails > 0);
    if((milestone || big) && !S.deferred) S.deferred = { kind: "milestone", ctx: { milestone: milestone, maxCombo: p.maxCombo | 0, firstClear: !!p.first, streak: p.maxCombo | 0, unusual: big ? 12 : 0 } };   // "Oh, that was a big one" — after the victory, never over it
    S.bestStreak = 0; S.brokenStreak = 0; S.recovered = false; S.dayFailed = false;
  }
  function onStart(){ S.level = String(gs().level || 0); S.taps = []; S.fastRun = 0; S.tapsSince = Math.max(S.tapsSince, 0); }
  function cancelHold(){ if(S.pend){ var q = S.pend; S.pend = null; clearTimeout(S.pendT); S.cooldown = false; S.lastAt = -1e9; q.rec.skipped = "cancelled"; q.rec.spoke = false; log(q.rec); } }
  window.addEventListener("gei:flow-event", function(e){
    try{ var d = e.detail || {}; if(!config.enabled) return; if(d.type === "tap") onTap(d); else if(d.type === "day") onDay(d); else if(d.type === "fail") onFail(d); else if(d.type === "level") onLevel(d); else if(d.type === "start") onStart(d); }catch(err){ warn(err); }
  });
  WOW.onEvent = function(type, d){ d = d || {}; if(type === "tap") return onTap(d); if(type === "day") return onDay(d); if(type === "fail") return onFail(d); if(type === "level") return onLevel(d); if(type === "start") return onStart(d); };
  WOW.consider = consider; WOW.score = score; WOW.tierFor = tierFor;
  WOW.flush = function(){ clearTimeout(S.candT); var c = S.cand; S.cand = null; return c ? consider(c.kind, c.ctx) : false; };
  WOW.flush = function(){ clearTimeout(S.candT); var c = S.cand; S.cand = null; return c ? consider(c.kind, c.ctx) : false; };
  /* the other engines ask: is a WOW on screen / just happened? (personality + STEM stay out of its way) */
  WOW.active = function(){ return now() < S.activeUntil; };        // on stage right now (a held WOW is not on stage yet — STEM may still finish first)
  WOW.recent = function(ms){ return now() - S.lastAt < (ms || 4000); };
  WOW.state = function(){ return { lastAt: S.lastAt, cooldown: S.cooldown, tapsSince: S.tapsSince, perLevel: JSON.parse(JSON.stringify(S.perLevel)), session: S.session, recentIds: S.recentIds.slice(), recentCats: S.recentCats.slice(), log: S.log.slice(), held: !!S.pend, deferred: S.deferred ? S.deferred.kind : "", active: WOW.active(), discovered: JSON.parse(JSON.stringify(S.discovered)), fastRun: S.fastRun }; };
  WOW.reset = function(){ cancelHold(); dropCand(); clear(); S.timers.forEach(clearTimeout); S.timers = []; S.lastAt = -1e9; S.cooldown = false; S.tapsSince = 999; S.perLevel = {}; S.session = 0; S.recentIds = []; S.recentCats = []; S.hist = {}; S.discovered = { kinds: {}, tiers: {}, clips: {} }; S.log = []; S.taps = []; S.fastRun = 0; S.bestStreak = 0; S.brokenStreak = 0; S.deferred = null; S.activeUntil = 0; S.recovered = false; S.dayFailed = false; S.mysteryDay = ""; S.lastReaction = ""; S.lastEnv = ""; save(); };
  WOW.resetMemory = WOW.reset;

  /* ================================================================== DEBUG (console only — no production UI) */
  /* triggerRareWow("common"|"rare"|"epic"|"ultra") plays a random phrase of that tier; triggerRareWow("damWild") plays that exact phrase.
     Debug runs bypass score / cooldown / history, never touch the player's memory, and still refuse to run over the failure cinematic / level complete. */
  function debugTrigger(what, opts){
    opts = opts || {}; var c = null, fs = FM.state();
    if(CLIPS[what]) c = CLIPS[what];
    else { var pool = Object.keys(CLIPS).map(function(k){ return CLIPS[k]; }).filter(function(x){ return x.tier === what; }); if(!pool.length) return false; c = pool[Math.floor(rng() * pool.length) % pool.length]; }
    if(!opts.ignoreBlocks && (fs.cinematic || fs.levelComplete || fs.transition)) return { skipped: "critical" };
    var rec = { kind: "debug", clip: c.id, tier: c.tier, category: c.category, score: 999, parts: {}, t: now(), debug: true, spoke: false };
    S.log.push(rec); if(S.log.length > 80) S.log.shift();
    if(opts.dryRun || config.dryRun) return rec;
    var wasCool = S.cooldown, wasAt = S.lastAt; var out = perform2(rec, c, opts); S.cooldown = wasCool; S.lastAt = wasAt; return out;
  }
  function perform2(rec, c, opts){                                                                          // same presentation, none of the bookkeeping
    var dur = config.show[rec.tier] || 2200; S.activeUntil = now() + dur + 300; if(!opts.noSlow) FM.fx.slow(config.slow.rate, config.slow.ms);
    show(rec, c, {}, dur);
    later(function(){ FM.say(c.url, { pri: PRI.wow, polite: true, maxMs: 4200, label: "wow:" + c.id }).then(function(ok){ rec.spoke = !!ok; }); }, config.leadMs);
    later(function(){ S.activeUntil = 0; }, dur + 200); return rec;
  }
  WOW.debug = { trigger: debugTrigger, list: function(){ return Object.keys(CLIPS).map(function(k){ return { id: k, tier: CLIPS[k].tier, category: CLIPS[k].category, text: CLIPS[k].text }; }); } };
  window.triggerRareWow = function(what, opts){ return debugTrigger(what || "common", opts); };

  /* ================================================================== AUDIO VERIFICATION + PRELOAD */
  var diag = {};
  function fix(u){ return u.replace(/\.mp3t$/i, ".mp3"); }
  WOW.verify = function(){
    var ids = Object.keys(CLIPS);
    return Promise.all(ids.map(function(id){
      var c = CLIPS[id], tried = [c.url].concat(c.fallbacks || []); var f = fix(c.url); if(tried.indexOf(f) < 0) tried.push(f);
      return (function next(i){
        if(i >= tried.length){ diag[id] = { url: c.url, ok: false, tried: tried }; warn("WOW clip '" + id + "' could not be loaded: " + c.url); try{ window.dispatchEvent(new CustomEvent("gei:audio-broken", { detail: { url: c.url, id: id } })); }catch(e){} return { id: id, ok: false }; }
        return FM.fx.probe(tried[i]).then(function(r){ if(r.ok){ var rep = i > 0; if(rep){ c.url = tried[i]; warn("WOW clip '" + id + "' repaired → " + tried[i]); } diag[id] = { url: c.url, ok: true, repaired: rep }; return { id: id, ok: true, repaired: rep }; } return next(i + 1); });
      })(0);
    })).then(function(res){ WOW.lastVerify = res; return res; });
  };
  WOW.diagnostics = function(){ return JSON.parse(JSON.stringify(diag)); };
  /* preload: only when audio is on, the connection is not data-saving and the browser is idle; the first (common/rare) clips are warmed, the ultra ones on demand */
  WOW.preload = function(){
    try{ if(navigator.connection && navigator.connection.saveData) return; WOW._warm = WOW._warm || {};
      Object.keys(CLIPS).forEach(function(id){ var c = CLIPS[id]; if(c.tier === "ultra" || WOW._warm[id]) return; var a = new Audio(); a.preload = "auto"; a.src = c.url; WOW._warm[id] = a; }); }catch(e){}
  };
  try{ (window.requestIdleCallback || function(f){ return setTimeout(f, 5000); })(function(){ if(audioOn()) WOW.preload(); WOW.verify(); }, { timeout: 12000 }); }catch(e){}

  window.RareWowMomentEngine = WOW;
})();
