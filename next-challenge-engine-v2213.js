/* V2.2.13 — NEXT CHALLENGE ENGINE 🚀🌊   LEVEL COMPLETE → NEXT STATION → NEXT CHALLENGE
 *
 * The step between two levels is a JOURNEY, not NEXT → NEXT → NEXT:
 *
 *   I did it 🏆 → the water settles → it moves DOWNSTREAM 🌊 → the camera follows it to the next flow station → NEXT STATION / NEXT CHALLENGE
 *   → a compact preview (station, level, difficulty, objective, reward, unlocks) → "READY, DAM-ITE?" → ENTER FLOW →
 *
 * It slots into the existing chain (Level Complete → FLOW FORWARD → Dam Map milestone → Bonus Waterwheel → -ite reveal → next level) at the one point
 * where the next level used to start by itself (`continueToNextLevel`): the original start function is handed to `run({ onStart })` and called exactly once —
 * by ENTER FLOW, by SKIP, or immediately if the engine is missing / declines. It never reads or writes progress, XP, FL OZ, unlocks, the map or the save.
 *
 *   NextChallengeEngine.plan(context)   context-aware voice selection (NOT random: random only BETWEEN fitting phrases)
 *   NextChallengeEngine.run({ onStart }) the transition (first time = full cinematic, repeats = fast, major unlocks = medium)
 *   NextChallengeEngine.registerStation(n, { name, emoji, title }) future stations / chapters plug in without touching the transition
 *
 * Voice: ONE shared lane (FlowMomentEngine) — priority 1 failure · 2 level complete · 3 ONE MORE · 3.5 warnings · 4 milestone · 4.5 NEXT CHALLENGE ·
 * 5 achievement · 6 personality · 7 reaction. Spoken lines are strictly sequential with a brief pause between them; music ducks through GEI_AUDIO.
 */
(function(){
  "use strict";
  var FM = window.FlowMomentEngine;
  if(!FM || window.NextChallengeEngine) return;
  var VERSION = "V2.2.13";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var PRI = FM.priorities;
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function rand(a, b){ return a + Math.random() * (b - a); }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function warn(e){ try{ console.warn("[NextChallenge] " + (e && e.message || e)); }catch(_){} }
  function $(id){ return document.getElementById(id); }
  function reduced(){ try{ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return false; } }
  function gs(){ try{ return (typeof state !== "undefined" && state) || {}; }catch(e){ return {}; } }
  function tapsFor(l){ try{ if(typeof getRequiredTaps === "function") return getRequiredTaps(l); }catch(e){} return Math.ceil(Math.max(1, l) / 6) * 6; }
  function rewardOz(){ try{ return typeof LEVEL_REWARD_FL_OZ !== "undefined" ? LEVEL_REWARD_FL_OZ : 666; }catch(e){ return 666; } }
  function rewardSpins(){ try{ return typeof DAM_MACHINE_LEVEL_SPIN_REWARD !== "undefined" ? DAM_MACHINE_LEVEL_SPIN_REWARD : 6; }catch(e){ return 6; } }
  function daysPer(){ try{ return typeof DAYS_PER_LEVEL !== "undefined" ? DAYS_PER_LEVEL : 6; }catch(e){ return 6; } }

  /* ================================================================== AUDIO LIBRARY (10 supplied clips) */
  function clip(id, text, file){ return { id: id, text: text, url: CDN + file }; }
  var CLIPS = {
    readyNext:   clip("readyNext",   "READY FOR WHAT'S NEXT",                          "ready-for-what-s-next-ani23auaekCqpNef.mp3"),
    waiting:     clip("waiting",     "THE NEXT CHALLENGE IS WAITING",                  "the-next-challenge-is-waiting-kknszhwfZTxUJu24.mp3"),
    downstream:  clip("downstream",  "LET'S SEE WHAT'S DOWNSTREAM",                    "let-s-see-what-s-downstream-n3IchVt9o0RB4iMY.mp3"),
    nextStop:    clip("nextStop",    "NEXT STOP: THE FLOW",                            "next-stop-the-flow-JOndCQpxLnJIux84.mp3"),
    readyCheck:  clip("readyCheck",  "YOU READY FOR THE NEXT ONE?",                    "you-ready-for-the-next-one-5z6HPMeq6qDkQqQn.mp3"),
    journey:     clip("journey",     "THE JOURNEY KEEPS MOVING",                       "the-journey-keeps-moving-ARd8p8jA8yg40X2R.mp3"),
    notDone:     clip("notDone",     "WE'RE NOT DONE YET",                             "we-re-not-done-yet-Z5p74bYNKqmMRcdM.mp3"),
    bigger:      clip("bigger",      "NEXT LEVEL. SAME FLOW. BIGGER CHALLENGE.",       "next-level.-same-flow.-bigger-challenge.-sv7gJiIRtDF3cKDC.mp3"),
    stationLive: clip("stationLive", "THE NEXT STATION IS LIVE",                       "the-next-station-is-live-jqX8sSAAdiCUpB7P.mp3"),
    keepWater:   clip("keepWater",   "LET'S KEEP THIS WATER MOVING",                   "let-s-keep-this-water-moving-k5OmlSlePyH9eSN2.mp3")
  };

  /* ================================================================== STATIONS (flow-station language, adapted to the game's own milestones) */
  var STATIONS = {};     // milestone number → { name, emoji, title }
  var STATION_CYCLE = [  // MOUNTAIN → DAM → … → OCEAN, repeating for later chapters; the game's own milestone titles (FOUNDATION, DAM-ITE, MASTER CONTROL…) win when they exist
    { name: "MOUNTAIN", emoji: "🏔️" }, { name: "DAM", emoji: "🧱" }, { name: "MILLPOND", emoji: "🌊" }, { name: "SLUICE GATE", emoji: "🚪" },
    { name: "WATERWHEEL", emoji: "⚙️" }, { name: "FACTORY", emoji: "🏭" }, { name: "DOWNSTREAM", emoji: "🏞️" }, { name: "OCEAN", emoji: "🌅" }
  ];
  function station(n){
    n = Math.max(1, n | 0);
    var o = STATIONS[n] || {}, c = STATION_CYCLE[(n - 1) % STATION_CYCLE.length], cap = null;
    try{ var m = window.__GEI_VICTORY_CAPSULE__ && window.__GEI_VICTORY_CAPSULE__.milestoneFor((n - 1) * 6 + 1); cap = m && m.meta; }catch(e){}
    return { number: n, name: o.name || c.name, emoji: o.emoji || c.emoji, title: o.title || (cap && cap.title) || "" };
  }
  function milestone(level){
    level = Math.max(1, level | 0); var size = 6, index = Math.floor((level - 1) / size), start = index * size + 1;
    return { number: index + 1, start: start, end: start + size - 1, within: level - start + 1, remaining: start + size - 1 - level, size: size };
  }

  /* ================================================================== CONFIG + MEMORY */
  var config = {
    enabled: true,
    rng: null,
    fullMs: 1,                                  // 1 = first-time cinematic pacing; < 1 speeds every wait (tests)
    pauseMs: 380,                               // "brief pause" between two spoken lines
    voiceWaitMs: 1500,                          // how long to wait for another voice to finish before the first line
    readyAfterMs: 350,
    watchdogMs: 60000,                          // the CTA is always there; this only cleans a transition that was abandoned
    maxVoiceMs: 4200,
    difficulty: function(level){ return tapsFor(level); }   // tap requirement per day (the game's own getRequiredTaps; override for other difficulty models)
  };
  var NC = { version: VERSION, config: config, clips: CLIPS, active: false };
  var KEY_SEEN = "geiNextChallengeSeenV1", KEY_HIST = "geiNextChallengeHistV1";
  var mem = { seen: 0, levels: {}, hist: { depart: "", reveal: "", ready: "", all: [] } };
  try{ var m0 = JSON.parse(localStorage.getItem(KEY_SEEN) || "{}"); if(m0 && typeof m0 === "object"){ mem.seen = m0.seen | 0; mem.levels = m0.levels || {}; } }catch(e){}
  try{ var h0 = JSON.parse(localStorage.getItem(KEY_HIST) || "{}"); if(h0 && h0.all) mem.hist = h0; }catch(e){}
  function save(){ try{ localStorage.setItem(KEY_SEEN, JSON.stringify({ seen: mem.seen, levels: mem.levels })); localStorage.setItem(KEY_HIST, JSON.stringify(mem.hist)); }catch(e){} }
  function rng(){ return (config.rng || Math.random)(); }

  /* ================================================================== CONTEXT → PLAN */
  /* buildContext(): everything the selection needs, from the game's own state (the level was already advanced when this runs). */
  NC.buildContext = function(over){
    var st = gs(), next = st.level | 0 || 1, cur = Math.max(1, next - 1), mc = milestone(cur), mn = milestone(next);
    var tapsCur = config.difficulty(cur), tapsNext = config.difficulty(next);
    var ctx = {
      currentLevel: cur, nextLevel: next, currentStation: station(mc.number), nextStation: station(mn.number),
      tapsCurrent: tapsCur, tapsNext: tapsNext, tapIncrease: tapsNext > tapsCur,
      newStation: mn.start === next,                                   // the next level opens a new flow station (a new milestone)
      milestoneEnd: mc.end === cur,                                    // the completed level closed a station
      levelInStation: mn.within, levelsLeftInStation: mn.remaining,    // after the next level
      first: (st.completedLevels | 0) <= 1,                             // first completion ever
      visited: !!mem.levels[next], seenCount: mem.seen,
      unlocked: [], reward: { flOz: rewardOz(), spins: rewardSpins() }, days: daysPer()
    };
    ctx.newTier = ctx.tapIncrease;                                     // a new difficulty tier = a new tap requirement
    ctx.hard = ctx.tapIncrease || ctx.newStation || ctx.milestoneEnd;  // "meaningful increase": harder / new tier / new station / new chapter
    ctx.major = ctx.hard;
    ctx.continued = !ctx.first && cur > 1;
    ctx.manyRemain = ctx.levelsLeftInStation >= 3 && !ctx.hard;       // several levels still ahead in this station
    if(ctx.newStation) ctx.unlocked.push("NEW STATION: " + ctx.nextStation.name);
    if(ctx.tapIncrease) ctx.unlocked.push("NEW TIER: " + ctx.tapsNext + " TAPS / DAY");
    if(over) for(var k in over) ctx[k] = over[k];
    return ctx;
  };
  function pickFrom(ids, beat, avoid, r){
    var pool = ids.filter(function(id){ return avoid.indexOf(id) < 0 && id !== mem.hist[beat] && id !== mem.hist.all[mem.hist.all.length - 1]; });
    if(!pool.length) pool = ids.filter(function(id){ return avoid.indexOf(id) < 0; });
    if(!pool.length) pool = ids.slice();
    return pool[Math.floor((r || rng)() * pool.length) % pool.length];
  }
  /* plan(ctx): which lines, in which order, for which kind of transition. Contexts decide the POOL; chance only chooses between fitting lines.
       COMBO A  normal       ready for what's next → map → station reveal
       COMBO B  downstream   let's see what's downstream → water travel → next stop: the flow
       COMBO C  not done yet we're not done yet → challenge reveal → you ready for the next one?
       COMBO D  harder       the journey keeps moving → next level. same flow. bigger challenge. → ENTER FLOW */
  NC.plan = function(ctx, r){
    ctx = ctx || NC.buildContext(); r = r || rng;
    var first = mem.seen === 0 || ctx.forceFull, mode = first ? "full" : (ctx.major ? "medium" : "fast"), used = [], depart, reveal, combo;
    if(ctx.hard){
      combo = "D";
      depart = ctx.newStation ? "stationLive" : pickFrom(["journey", "keepWater"], "depart", used, r);        // premium line is never the opener: it lands on the reveal
      if(ctx.newStation && !ctx.tapIncrease) depart = "stationLive";
      reveal = "bigger";
    }else if(ctx.manyRemain && r() < .6){
      combo = "C"; depart = "notDone"; reveal = pickFrom(["waiting", "nextStop"], "reveal", ["notDone"], r);
    }else if(ctx.continued && r() < .5){
      combo = "B"; depart = pickFrom(["journey", "keepWater"], "depart", used, r); reveal = pickFrom(["nextStop", "waiting"], "reveal", [depart], r);
    }else if(r() < .5){
      combo = "B"; depart = "downstream"; reveal = "nextStop";
    }else{
      combo = "A"; depart = pickFrom(["readyNext", "waiting"], "depart", used, r); reveal = pickFrom(["waiting", "nextStop", "downstream"], "reveal", [depart], r);
    }
    if(depart === reveal) reveal = pickFrom(["waiting", "nextStop", "readyNext"], "reveal", [depart], r);
    var voices = { depart: CLIPS[depart], reveal: CLIPS[reveal], ready: CLIPS.readyCheck };
    if(mode === "medium") voices = { depart: null, reveal: CLIPS[reveal], ready: null };       // repeat + major: keep the premium line, drop the rest
    if(mode === "fast")   voices = { depart: null, reveal: CLIPS[ctx.hard ? "bigger" : pickFrom(["waiting", "keepWater", "readyNext"], "reveal", [], r)], ready: null };
    return { mode: mode, combo: combo, major: !!ctx.major, voices: voices, ctx: ctx };
  };
  function remember(plan){
    ["depart", "reveal", "ready"].forEach(function(b){ var v = plan.voices[b]; if(v){ mem.hist[b] = v.id; mem.hist.all.push(v.id); } });
    if(mem.hist.all.length > 8) mem.hist.all = mem.hist.all.slice(-8); save();
  }

  /* ================================================================== CSS */
  var CSS = [
".nc{position:fixed;inset:0;z-index:10012;display:flex;flex-direction:column;align-items:center;box-sizing:border-box;padding:max(10px,env(safe-area-inset-top,0px)) 14px max(12px,env(safe-area-inset-bottom,0px));overflow:hidden;color:#fff;opacity:0;transition:opacity .35s;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-user-select:none;user-select:none;touch-action:manipulation;",
"background:radial-gradient(ellipse at 50% 20%,rgba(30,110,200,.92),rgba(8,30,80,.97) 70%),#061a40}",
".nc.in{opacity:1}.nc.out{opacity:0;pointer-events:none}",
".ncWater{position:absolute;left:-10%;right:-10%;bottom:0;height:34%;pointer-events:none;overflow:hidden;opacity:.9}",
".ncWv{position:absolute;left:0;right:0;bottom:0;height:100%;background:linear-gradient(180deg,rgba(60,170,255,.34),rgba(20,90,200,.55));transform:translate3d(0,calc(100% - var(--ncw,30%)),0);transition:transform 1.2s cubic-bezier(.2,.9,.3,1)}",
".ncWv.b{background:linear-gradient(180deg,rgba(120,215,255,.30),rgba(40,150,235,.45));transition-delay:.12s}",
".ncWv::before{content:'';position:absolute;left:-60px;right:-60px;top:-16px;height:18px;background:radial-gradient(circle at 12px 100%,rgba(130,215,255,.7) 10px,rgba(255,255,255,.7) 11px,rgba(255,255,255,.7) 12px,transparent 13px) 0 0/48px 18px repeat-x;animation:ncWaveX var(--ncws,1.6s) linear infinite}",
".ncWv.b::before{animation-direction:reverse;animation-duration:calc(var(--ncws,1.6s) * .75)}",
"@keyframes ncWaveX{from{transform:translate3d(0,0,0)}to{transform:translate3d(48px,0,0)}}",
".nc.hard{--ncws:.8s;background:radial-gradient(ellipse at 50% 20%,rgba(40,130,230,.94),rgba(40,16,90,.97) 72%),#10124a}",
".ncSkip{position:absolute;top:max(8px,env(safe-area-inset-top,0px));right:10px;z-index:3;min-height:40px;min-width:78px;padding:0 14px;border-radius:999px;border:1.5px solid rgba(255,255,255,.55);background:rgba(0,20,60,.45);color:#fff;font:900 .78rem/1 system-ui,sans-serif;letter-spacing:.14em;display:none;cursor:pointer}",
".nc.canSkip .ncSkip{display:block}.ncSkip:focus-visible,.ncGo:focus-visible{outline:3px solid #ffe27a;outline-offset:2px}",
".ncTop{position:relative;z-index:1;flex:0 0 auto;width:100%;text-align:center;padding-top:6px}",
".ncStamp{display:inline-block;padding:.35em .9em;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);font:900 clamp(.7rem,3.2vw,.9rem)/1 system-ui,sans-serif;letter-spacing:.16em;opacity:0;transform:translate3d(0,-8px,0);transition:opacity .4s,transform .4s}",
".nc.in .ncStamp{opacity:1;transform:none}",
".ncWord{margin-top:clamp(6px,1.6vh,14px);font-weight:1000;font-size:clamp(1.9rem,10vw,3.4rem);line-height:.98;letter-spacing:.02em;text-transform:uppercase;text-wrap:balance;min-height:1em;opacity:0;text-shadow:0 0 .4em #5fd4ff,0 0 1em rgba(40,120,255,.9),0 .06em 0 rgba(0,25,70,.85);-webkit-text-stroke:.03em rgba(0,30,80,.5);paint-order:stroke fill}",
".ncWord.show{animation:ncWordIn .75s cubic-bezier(.2,.9,.25,1) forwards}.nc.hard .ncWord{text-shadow:0 0 .4em #ffd56a,0 0 1em rgba(255,120,40,.85),0 .06em 0 rgba(60,20,0,.85)}",
"@keyframes ncWordIn{0%{opacity:0;transform:scale(.5) translate3d(0,14px,0)}55%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}",
".ncCap{margin-top:.4em;font:800 clamp(.68rem,3vw,.88rem)/1.1 system-ui,sans-serif;letter-spacing:.16em;color:#bfeaff;min-height:1.1em;opacity:0;transition:opacity .35s}.ncCap.show{opacity:1}",
".ncMap{position:relative;z-index:1;flex:1 1 auto;width:100%;min-height:clamp(70px,14vh,110px);max-height:40vh;margin:clamp(2px,1vh,10px) 0;overflow:hidden}",
".ncTrack{position:absolute;left:0;top:0;bottom:0;display:flex;align-items:center;will-change:transform}",
".ncRiver{position:absolute;left:0;right:0;top:50%;height:8px;margin-top:-4px;border-radius:4px;background:linear-gradient(90deg,rgba(80,190,255,.15),rgba(110,215,255,.8),rgba(80,190,255,.15))}",
".ncRiver::after{content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(90deg,transparent 0 18px,rgba(255,255,255,.5) 18px 28px);animation:ncFlow .9s linear infinite}",
"@keyframes ncFlow{from{transform:translate3d(0,0,0)}to{transform:translate3d(28px,0,0)}}",
".ncNode{position:relative;flex:0 0 auto;width:var(--nn,72px);height:var(--nn,72px);margin:0 calc((var(--ns,150px) - var(--nn,72px)) / 2);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(10,40,100,.85);border:3px solid rgba(255,255,255,.35);box-shadow:0 0 0 0 rgba(95,212,255,0);transition:transform .5s cubic-bezier(.3,1.5,.4,1),box-shadow .5s,border-color .5s,opacity .5s;opacity:.55}",
".ncNode .e{font-size:calc(var(--nn,72px) * .42);line-height:1}.ncNode .l{margin-top:2px;font:900 calc(var(--nn,72px) * .17)/1 system-ui,sans-serif;letter-spacing:.06em}",
".ncNode.done{opacity:1;border-color:#7dffb4;background:rgba(10,90,70,.85)}.ncNode.cur{opacity:1;border-color:#7dffb4;background:rgba(10,90,70,.9)}",
".ncNode.next.on{opacity:1;transform:scale(1.22);border-color:#ffe27a;background:rgba(40,80,170,.95);box-shadow:0 0 28px 6px rgba(255,226,122,.65)}",
".ncNode.station{border-radius:22px}.ncNode .tag{position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);white-space:nowrap;font:900 calc(var(--nn,72px) * .15)/1 system-ui,sans-serif;letter-spacing:.12em;color:#ffe27a;opacity:0}.ncNode.next.on .tag{opacity:1}",
".ncDrop{position:absolute;left:0;top:50%;width:14px;height:18px;margin:-9px 0 0 -7px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 35% 30%,#fff,#9fe4ff 45%,#2a9dff);box-shadow:0 0 10px rgba(120,210,255,.9);opacity:0;will-change:transform,opacity}",
".ncCard{position:relative;z-index:1;flex:0 1 auto;min-height:0;width:min(100%,420px);box-sizing:border-box;margin-top:clamp(2px,1vh,8px);padding:clamp(8px,1.6vh,14px) 14px;border-radius:22px;background:linear-gradient(160deg,rgba(255,255,255,.17),rgba(255,255,255,.07)),rgba(6,24,70,.74);border:1.5px solid rgba(255,255,255,.4);box-shadow:0 10px 40px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.4);overflow:hidden;display:flex;flex-direction:column;align-items:center;gap:clamp(3px,.8vh,8px);text-align:center;opacity:0;transform:translate3d(0,26px,0) scale(.97);transition:opacity .45s,transform .5s cubic-bezier(.3,1.3,.4,1)}",
".ncCard.show{opacity:1;transform:none}",
".ncEye{font:900 clamp(.7rem,3.1vw,.9rem)/1 system-ui,sans-serif;letter-spacing:.2em;color:#ffe27a}",
".ncLevel{font-weight:1000;font-size:clamp(1.8rem,9.6vw,3rem);line-height:1;letter-spacing:.03em;text-shadow:0 2px 0 rgba(0,25,70,.7)}",
".ncStation{font:900 clamp(.8rem,3.6vw,1.05rem)/1.1 system-ui,sans-serif;letter-spacing:.1em;color:#bfeaff;text-transform:uppercase}",
".ncBadge{display:inline-block;padding:.38em .95em;border-radius:999px;font:1000 clamp(.82rem,3.8vw,1.1rem)/1 system-ui,sans-serif;letter-spacing:.08em;background:linear-gradient(90deg,#1aa6ff,#3d6dff);box-shadow:0 0 16px rgba(60,160,255,.7)}",
".nc.hard .ncBadge{background:linear-gradient(90deg,#ff9a1a,#ff4fd8);box-shadow:0 0 18px rgba(255,140,60,.8)}",
".ncRows{width:100%;display:flex;flex-direction:column;gap:clamp(2px,.6vh,6px)}",
".ncRow{font:800 clamp(.78rem,3.5vw,.98rem)/1.15 system-ui,sans-serif;letter-spacing:.03em;display:flex;align-items:center;justify-content:center;gap:.5em;flex-wrap:wrap}",
".ncRow b{color:#ffe27a}.ncRow.unl{color:#9dffc0}",
".ncChips{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.ncChip{padding:.3em .7em;border-radius:999px;background:rgba(0,20,60,.45);border:1px solid rgba(255,255,255,.3);font:900 clamp(.68rem,3vw,.82rem)/1 system-ui,sans-serif;letter-spacing:.08em}",
".nc.hard .ncChip{border-color:rgba(255,200,100,.7)}",
".ncReady{position:relative;z-index:1;flex:0 0 auto;margin-top:clamp(4px,1.2vh,10px);font-weight:1000;font-size:clamp(1.1rem,5.4vw,1.6rem);letter-spacing:.06em;text-shadow:0 0 .5em #5fd4ff;opacity:0;transform:translate3d(0,8px,0);transition:opacity .35s,transform .35s}.ncReady.show{opacity:1;transform:none}",
".ncGo{position:relative;z-index:2;flex:0 0 auto;width:min(100%,420px);min-height:54px;margin-top:clamp(4px,1vh,8px);border-radius:16px;border:2px solid rgba(255,255,255,.7);background:linear-gradient(135deg,#1fc8ff,#3d5dff 55%,#9a3dff);color:#fff;font:1000 clamp(1.05rem,5vw,1.3rem)/1 system-ui,sans-serif;letter-spacing:.07em;cursor:pointer;box-shadow:0 0 22px rgba(60,170,255,.65),inset 0 1px 0 rgba(255,255,255,.55);opacity:0;pointer-events:none;transform:translate3d(0,14px,0);transition:opacity .35s,transform .35s}",
".ncGo.show{opacity:1;pointer-events:auto;transform:none}.ncGo.pulse{animation:ncPulse 1.5s ease-in-out infinite}.ncGo:active{transform:scale(.97)}",
"@keyframes ncPulse{0%,100%{box-shadow:0 0 22px rgba(60,170,255,.65),inset 0 1px 0 rgba(255,255,255,.55)}50%{box-shadow:0 0 34px rgba(120,210,255,.95),inset 0 1px 0 rgba(255,255,255,.55)}}",
".ncSr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}",
"@media (max-height:640px){.ncChips{display:none}.ncMap{min-height:64px}}",
"@media (max-height:560px){.ncRow.rew{display:none}.ncEye{display:none}.ncWord{font-size:clamp(1.6rem,8.4vw,2.6rem)}}",
"@media (prefers-reduced-motion:reduce){.nc{transition:opacity .2s}.ncWv::before,.ncRiver::after,.ncGo.pulse{animation:none}.ncWv{transition:none}.ncWord.show{animation:none;opacity:1}.ncCard,.ncReady,.ncGo{transition:opacity .2s;transform:none}.ncNode.next.on{transform:none}}"
  ].join("\n");
  function addCss(){ if($("ncStyle")) return; var s = document.createElement("style"); s.id = "ncStyle"; s.textContent = CSS; document.head.appendChild(s); }

  /* ================================================================== DOM */
  var R = null, T = { map: {} }, timers = [], anims = [], run = null;
  function later(fn, ms){ var id = setTimeout(function(){ try{ fn(); }catch(e){ warn(e); } }, Math.max(0, ms)); timers.push(id); return id; }
  function clearTimers(){ timers.forEach(clearTimeout); timers = []; anims.forEach(function(a){ try{ a.cancel(); }catch(e){} }); anims = []; }
  function el(tag, cls, html){ var e = document.createElement(tag); if(cls) e.className = cls; if(html != null) e.innerHTML = html; return e; }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function build(plan){
    var ctx = plan.ctx, cur = ctx.currentStation, nxt = ctx.nextStation;
    R = el("div", "nc" + (ctx.hard ? " hard" : "")); R.id = "ncRoot"; R.setAttribute("role", "dialog"); R.setAttribute("aria-label", "Next challenge");
    var skipTxt = "SKIP →";
    R.innerHTML =
      '<div class="ncWater"><div class="ncWv"></div><div class="ncWv b"></div></div>' +
      '<button type="button" class="ncSkip" id="ncSkip">' + skipTxt + '</button>' +
      '<div class="ncTop"><div class="ncStamp">✓ LEVEL ' + ctx.currentLevel + ' COMPLETE</div><div class="ncWord" id="ncWord"></div><div class="ncCap" id="ncCap"></div></div>' +
      '<div class="ncMap" id="ncMap"><div class="ncTrack" id="ncTrack"><div class="ncRiver" id="ncRiver"></div></div></div>' +
      '<div class="ncCard" id="ncCard"></div>' +
      '<div class="ncReady" id="ncReady">READY, DAM-ITE?</div>' +
      '<button type="button" class="ncGo" id="ncGo">ENTER FLOW →</button><div class="ncSr" aria-live="assertive" id="ncLive"></div>';
    document.body.appendChild(R);
    T.word = R.querySelector("#ncWord"); T.cap = R.querySelector("#ncCap"); T.track = R.querySelector("#ncTrack"); T.river = R.querySelector("#ncRiver"); T.card = R.querySelector("#ncCard");
    T.ready = R.querySelector("#ncReady"); T.go = R.querySelector("#ncGo"); T.skip = R.querySelector("#ncSkip"); T.live = R.querySelector("#ncLive"); T.mapEl = R.querySelector("#ncMap");
    buildMap(ctx); buildCard(ctx, plan);
    T.go.addEventListener("click", onGo); T.skip.addEventListener("click", onSkip);
  }
  /* the journey strip: …previous level ✓ — completed level ✓ — NEXT (a station node when it opens a new flow station) — beyond ? */
  function buildMap(ctx){
    var vw = Math.max(240, R.clientWidth || window.innerWidth), step = clamp(vw * .4, 108, 168), nn = clamp(vw * .19, 56, 84), items = [];
    function lvlNode(level, st){
      var m = milestone(level), isStation = m.start === level, s = station(m.number);
      return { level: level, state: st, station: isStation, emoji: isStation ? s.emoji : "💧", label: isStation ? s.name : "LV " + level, tag: isStation ? "NEW STATION" : "NEXT" };
    }
    if(ctx.currentLevel > 1) items.push(lvlNode(ctx.currentLevel - 1, "done"));
    items.push(lvlNode(ctx.currentLevel, "cur")); items.push(lvlNode(ctx.nextLevel, "next")); items.push(lvlNode(ctx.nextLevel + 1, "future"));
    var curIdx = items.findIndex(function(i){ return i.state === "cur"; }), nextIdx = curIdx + 1;
    R.style.setProperty("--ns", step + "px"); R.style.setProperty("--nn", nn + "px");
    T.track.style.width = items.length * step + "px"; T.river.style.left = step / 2 + "px"; T.river.style.right = step / 2 + "px";
    items.forEach(function(it, i){
      var n = el("div", "ncNode " + it.state + (it.station ? " station" : ""), '<span class="tag">' + esc(it.tag) + '</span><span class="e">' + it.emoji + '</span><span class="l">' + esc(it.label) + '</span>');
      T.track.appendChild(n); it.el = n;
    });
    T.items = items; T.step = step; T.curIdx = curIdx; T.nextIdx = nextIdx; T.vw = vw;
    T.x0 = vw / 2 - (curIdx + .5) * step; T.x1 = vw / 2 - (nextIdx + .5) * step;
    T.track.style.transform = "translate3d(" + T.x0 + "px,0,0)";
  }
  function buildCard(ctx, plan){
    var nxt = ctx.nextStation, rows = "";
    var diff = ctx.hard ? "🔥 BIGGER CHALLENGE" : (ctx.continued ? "💧 KEEP IT MOVING" : "💧 SAME FLOW");
    var obj = ctx.days + " DAYS · <b>" + ctx.tapsNext + " TAPS</b> EACH" + (ctx.tapIncrease ? " <b>↑</b> <span style='opacity:.8'>(was " + ctx.tapsCurrent + ")</span>" : "");
    rows += '<div class="ncRow">🎯 ' + obj + '</div>';
    rows += '<div class="ncRow rew">💧 <b>+' + ctx.reward.flOz + ' FL OZ</b>' + (ctx.reward.spins ? ' · 🎰 +' + ctx.reward.spins + ' SPINS' : '') + '</div>';
    ctx.unlocked.forEach(function(u){ rows += '<div class="ncRow unl">🔓 ' + esc(u) + '</div>'; });
    var chips = ctx.hard ? ["💧 FLOW", "⚡ PRESSURE", "🌊 MOMENTUM"] : ["💧 FLOW", "🌊 MOMENTUM"];
    T.card.innerHTML = '<div class="ncEye">🌊 ' + (ctx.newStation ? "NEXT STATION" : "NEXT CHALLENGE") + '</div><div class="ncLevel">LEVEL ' + ctx.nextLevel + '</div>' +
      '<div class="ncStation">FLOW STATION ' + nxt.number + ' · ' + esc(nxt.name) + (nxt.title ? ' · ' + esc(nxt.title) : '') + ' · ' + ctx.levelInStation + '/6</div>' +
      '<div class="ncBadge">' + diff + '</div><div class="ncRows">' + rows + '</div><div class="ncChips">' + chips.map(function(c){ return '<span class="ncChip">' + c + '</span>'; }).join("") + '</div>';
  }
  function announce(t){ try{ if(T.live){ T.live.textContent = ""; T.live.textContent = t; } }catch(e){} }

  /* ================================================================== FX */
  function startWater(level){ if(!R) return; R.style.setProperty("--ncw", level + "%"); }
  function flowDrops(count, durMs){
    if(reduced() || !T.track || !T.track.animate) return;
    var x0 = T.step * (T.curIdx + .5), x1 = T.step * (T.nextIdx + .5), n = Math.round(count * FM.fx.quality());
    for(var i = 0; i < n; i++){
      var d = el("div", "ncDrop"); T.track.appendChild(d);
      var a = d.animate([{ transform: "translate3d(" + x0 + "px," + rand(-6, 6) + "px,0) scale(.6)", opacity: 0 }, { opacity: 1, offset: .15 },
        { transform: "translate3d(" + (x0 + (x1 - x0) * .6) + "px," + rand(-8, 8) + "px,0) scale(1)", opacity: 1, offset: .65 }, { transform: "translate3d(" + x1 + "px," + rand(-6, 6) + "px,0) scale(.7)", opacity: 0 }],
        { duration: durMs * rand(.8, 1.15), delay: i * (durMs / Math.max(4, n)) * .55, easing: "cubic-bezier(.4,0,.3,1)", fill: "forwards" });
      anims.push(a); a.onfinish = (function(node){ return function(){ if(node.parentNode) node.parentNode.removeChild(node); }; })(d);
    }
  }
  function pan(ms){
    if(!T.track) return;
    if(reduced() || !T.track.animate){ T.track.style.transform = "translate3d(" + T.x1 + "px,0,0)"; return; }
    var a = T.track.animate([{ transform: "translate3d(" + T.x0 + "px,0,0)" }, { transform: "translate3d(" + T.x1 + "px,0,0)" }], { duration: ms, easing: "cubic-bezier(.5,0,.2,1)", fill: "forwards" }); anims.push(a);
  }
  function revealNode(){ var n = T.items && T.items[T.nextIdx]; if(n) n.el.classList.add("on"); }
  function setWord(text){ T.word.textContent = text; T.word.classList.remove("show"); void T.word.offsetWidth; T.word.classList.add("show"); announce(text); }
  function setCap(text){ T.cap.textContent = text; T.cap.classList.toggle("show", !!text); }
  function tone(f, d, t, dl){ try{ if(typeof window.playTone === "function") window.playTone(f, d, t, dl); }catch(e){} }
  function noise(d, a, b, gn){ try{ if(typeof window.playWaterNoise === "function") window.playWaterNoise(d, a, b, gn); }catch(e){} }
  function cheer(){ try{ var s = window.DAMSoundtrack; s && s.notify && s.notify("reward"); }catch(e){} }

  /* ================================================================== SEQUENCE */
  function wait(ms){ return new Promise(function(res){ later(function(){ res(true); }, ms * config.fullMs); }); }
  function beat(min, vp, max){ return Promise.all([wait(min), vp ? Promise.race([vp, wait(max || min + 1800)]) : null]); }
  function say(c){ return c ? FM.say(c.url, { pri: PRI.nextChallenge, maxMs: config.maxVoiceMs, label: "nc:" + c.id }) : Promise.resolve(false); }
  function alive(id){ return run && run.id === id && !run.done; }
  async function sequence(id, plan){
    var A = function(){ return alive(id); }, ctx = plan.ctx, mode = plan.mode, rm = reduced(), k = rm ? .6 : 1, major = plan.major, V = plan.voices;
    try{
      /* STEP 1–2 — the Level Complete celebration just ended: the water stabilises */
      requestAnimationFrame(function(){ if(R) R.classList.add("in"); }); startWater(22); noise(.5, 200, 500, .05); tone(392, .22, "sine");
      if(mode === "fast"){
        setCap("💧 DOWNSTREAM"); pan(700); flowDrops(ctx.hard ? 8 : 5, 900); await wait(260); if(!A()) return;
        revealNode(); setWord(ctx.newStation ? "NEXT STATION" : "NEXT CHALLENGE"); startWater(ctx.hard ? 40 : 30); var vf = say(V.reveal);
        T.card.classList.add("show"); armGo(); T.ready.classList.add("show"); markSeen(ctx);
        await beat(500, vf, 2600); return;
      }
      /* the first voice never talks over the Level Complete voice / anything else: a brief pause, then it goes */
      var t0 = now(); while(A() && (FM.voiceBusy() || FM.fx.othersSpeaking()) && now() - t0 < config.voiceWaitMs) await wait(120);
      if(!A()) return; await wait(config.pauseMs * k); if(!A()) return;
      /* STEP 3 — the water begins to move DOWNSTREAM */
      var vd = say(V.depart); setCap("💧 THE WATER IS MOVING DOWNSTREAM"); startWater(ctx.hard ? 44 : 34); flowDrops(ctx.hard ? 14 : 9, 1500); noise(.9, 250, 1100, .08);
      /* STEP 4 — the map camera follows it to the newly unlocked station */
      await wait(350 * k); if(!A()) return; pan(mode === "full" ? 1300 : 800); if(ctx.hard) cheer();
      await beat((mode === "full" ? 1500 : 950) * k, vd, 2800); if(!A()) return;
      await wait(config.pauseMs * k); if(!A()) return;
      /* STEP 5–6 — NEXT STATION / NEXT CHALLENGE + its voice */
      revealNode(); setCap(""); setWord(ctx.newStation ? "NEXT STATION" : "NEXT CHALLENGE"); tone(659, .14, "triangle"); tone(880, .2, "triangle", .12);
      var vr = say(V.reveal); if(ctx.hard) noise(.7, 400, 1600, .09);
      await wait(500 * k); if(!A()) return;
      /* STEP 7 — the challenge preview */
      T.card.classList.add("show"); armGo(); markSeen(ctx);
      await beat(700 * k, vr, 2800); if(!A()) return;
      /* STEP 8 — READY, DAM-ITE? + "You ready for the next one?" */
      await wait(config.readyAfterMs * k); if(!A()) return;
      T.ready.classList.add("show"); T.go.classList.add("pulse");
      if(V.ready){ var vy = say(V.ready); await Promise.race([vy, wait(2600)]); }
    }catch(e){ warn(e); if(alive(id)){ T.card && T.card.classList.add("show"); armGo(); } }
  }
  function armGo(){ if(!T.go) return; T.go.classList.add("show"); try{ T.go.focus({ preventScroll: true }); }catch(e){} }
  function markSeen(ctx){ if(run && run.marked) return; if(run) run.marked = true; mem.seen++; mem.levels[ctx.nextLevel] = 1; save(); }

  /* ================================================================== CONTROL */
  function finish(how){
    if(!run || run.done) return; run.done = true; var cb = run.onStart, rr = R; run.onStart = null;
    clearTimers(); FM.stopVoice(PRI.nextChallenge); window.__GEI_TRANSITION__ = false; NC.active = false;
    try{ var a = window.GEI_AUDIO; a && a.voiceEnd && a.voiceEnd("nc"); }catch(e){}
    document.removeEventListener("visibilitychange", onHidden); document.removeEventListener("keydown", onKey, true);
    if(rr){ rr.classList.add("out"); rr.classList.remove("in"); setTimeout(function(){ if(rr.parentNode) rr.parentNode.removeChild(rr); }, 450); }
    R = null; T = { map: {} }; run.how = how; var info = { how: how, mode: run.mode, ms: Math.round(now() - run.t0) }; NC.last = info;
    try{ cb && cb(); }catch(e){ warn(e); }
  }
  function onGo(e){ if(e) e.preventDefault(); finish("go"); }
  function onSkip(e){ if(e) e.preventDefault(); finish("skip"); }
  function onHidden(){ if(document.hidden && run && !run.done){ T.card && T.card.classList.add("show"); armGo(); FM.stopVoice(PRI.nextChallenge); } }
  function onKey(e){ if(run && !run.done && (e.key === "Escape")){ onSkip(e); } }

  /* run({ onStart, context }) → true when the transition took over (onStart is called exactly once); false → the caller starts the level itself. */
  NC.run = function(opts){
    try{
      opts = opts || {};
      if(!config.enabled || NC.active || typeof opts.onStart !== "function" || !document.body) return false;
      addCss();
      var plan = NC.plan(NC.buildContext(opts.context)); remember(plan);
      run = { id: (run ? run.id : 0) + 1, done: false, onStart: opts.onStart, mode: plan.mode, plan: plan, t0: now(), marked: false };
      NC.active = true; window.__GEI_TRANSITION__ = true;
      try{ FM.setFlowLevel(0); }catch(e){}
      try{ var a = window.GEI_AUDIO; a && a.voiceBegin && a.voiceBegin("nc"); }catch(e){}
      build(plan);
      if(plan.mode !== "full") R.classList.add("canSkip");               // first time: the full experience, no skip button; repeats: an unobtrusive SKIP →
      document.addEventListener("visibilitychange", onHidden); document.addEventListener("keydown", onKey, true);
      var id = run.id; later(function(){ if(alive(id)){ T.card && T.card.classList.add("show"); armGo(); } }, config.watchdogMs * config.fullMs);
      sequence(id, plan);
      return true;
    }catch(e){ warn(e); try{ run && (run.done = true); }catch(_){} NC.active = false; window.__GEI_TRANSITION__ = false; if(R && R.parentNode) R.parentNode.removeChild(R); R = null; return false; }
  };
  NC.skip = function(){ finish("skip"); };
  NC.enter = function(){ finish("go"); };
  NC.registerStation = function(n, meta){ if(n >= 1 && meta && typeof meta === "object") STATIONS[n | 0] = meta; return NC; };
  NC.station = station; NC.milestone = milestone;
  NC.setSeen = function(n){ mem.seen = Math.max(0, n | 0); save(); return mem.seen; };
  NC.resetSeen = function(){ mem = { seen: 0, levels: {}, hist: { depart: "", reveal: "", ready: "", all: [] } }; save(); };
  NC.state = function(){ return { active: NC.active, mode: run && run.mode, seen: mem.seen, hist: JSON.parse(JSON.stringify(mem.hist)), last: NC.last || null, combo: run && run.plan && run.plan.combo, ui: !!R }; };
  window.NextChallengeEngine = NC;
})();
