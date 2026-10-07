/* V2.2.10 — FLOW MOMENT ENGINE 🌊⚡💥
 *
 * ONE reusable presentation engine that makes every important tap feel alive and every timer failure a memorable, funny cinematic.
 *
 *   CALLOUTS     large animated centre-stage achievement words (scale/pop, glow, screen pulse, water particles, directional streaks,
 *                optional character pop, SFX). Combo escalation table + intelligent throttling (one big word at a time, higher tier
 *                interrupts lower, same word never repeats inside its cooldown).
 *   PRESSURE     last 5 s of the day: environment vibration, energetic pressure-water band, urgent timer, music lift, a warning at
 *                4 s / 3 s / 2 s / 1 s (voice + big word + red edge pulse). Driven by the SAME clock — it owns no timer.
 *   FAILURE      timer 0 → freeze → UH-OH → PRESSURE CRITICAL → HOLD THE DAM → TOO MUCH FLOW → THE DAM IS CRACKING → WE HAVE A BREAK →
 *                the actual dam break (debris, jets, shock ring, camera shake, parallax flood) → character reaction → educational card.
 *                Everything is randomised per failure (flood direction, intensity, shake, weather, reaction, rare events, rare comedy).
 *   SUCCESS      the opposite colour/motion language: calm stabilise → gate → flow → power → "YOU CONTROLLED THE FLOW!".
 *   VOICE LANE   ONE spoken clip at a time, priority 1 cinematic · 2 critical warning · 3 achievement · 4 character reaction
 *                (5 = music, ducked through GEI_AUDIO). A higher priority interrupts a lower one; a lower one never talks over a higher one.
 *                The female narrator / achievement director are silenced while a Flow Moment voice speaks.
 *
 * Presentation only: it never reads or writes progress, FL OZ, XP, purchases, entitlements or the save. Nothing in the game waits for it;
 * if it is missing, throws, or audio is blocked, the original game behaviour runs unchanged.
 *
 * Modular: FlowMomentEngine.register("id", { emoji, text, mult, tier, sfx, cooldown, say }) then FlowMomentEngine.trigger("id").
 */
(function(){
  "use strict";
  if(window.FlowMomentEngine) return;
  var VERSION = "V2.2.10";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var CLIPS = {
    uhoh:     "uh-oh-Y2oFEOm0it5IjoWc.mp3",
    pressure: "pressure-critical-ZrfW0HesXVXYFApK.mp3",
    hold:     "hold-the-dam-XCzbFwtwuQSKIaWv.mp3",
    toomuch:  "too-much-flow-8Yz9tQO0XI2GCwby.mp3",
    cracking: "the-dam-is-cracking-tJRFUUkJaIxGN0ti.mp3",
    weBreak:  "we-have-a-break-5gFKFW7XJGc6Ghap.mp3",
    broke:    "the-dam-broke-4H7sAbRRYVATp7YZ.mp3",
    run:      "run-vGy6nQAE4CxAftGQ.mp3",
    whoa:     "whoa-rl4QpSsPab74UAje.mp3",
    flood:    "that-was-a-flood-oNcCWcGAYWWWzlov.mp3",
    who:      "who-turned-that-water-on-2yJFhN0Ls4FOt51a.mp3",
    again:    "try-again-dam-ite-ilLtMjhuvdHAwmZn.mp3"
  };
  /* spoken-voice priority (smaller number wins): failure cinematic · level complete · ONE MORE · timer warnings · milestone progress · achievement / combo · character reaction (music = ducked, not a voice) */
  var PRI = { cinematic:1, levelComplete:2, oneMore:3, warning:3.5, milestone:4, nextChallenge:4.5, achievement:5, personality:6, reaction:7 };

  var config = {
    comedyChance: .15,                 // WHO TURNED THAT WATER ON?! — 10–20 % of failures
    rareEvents: { mega:.04, beaver:.04, wheel:.04, hydrant:.03, rescue:.03 },   // absolute chances; the rest is a normal failure
    pressureAtMs: 5000,
    warnAtMs: [4000, 3000, 2000, 1000],
    calloutGapMs: 650,                 // a lower/equal tier waits this long behind the word on screen
    maxVoiceMs: 4200,
    voiceGain: .95,
    watchdogMs: 20000
  };

  /* ------------------------------------------------------------------ utilities */
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function rand(a, b){ return a + Math.random() * (b - a); }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function warn(e){ try{ console.warn("[FlowMoment] " + (e && e.message || e)); }catch(_){} }
  function $(id){ return document.getElementById(id); }
  function reduced(){ try{ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return false; } }
  var LITE = (function(){ try{ return (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 2); }catch(e){ return false; } })();
  function quality(){ return reduced() ? 0 : (LITE ? .5 : 1); }

  function Timers(){
    var map = {}, n = 0;
    return {
      later: function(fn, ms){ var id = ++n; map[id] = setTimeout(function(){ delete map[id]; try{ fn(); }catch(e){ warn(e); } }, Math.max(0, ms)); return id; },
      every: function(fn, ms){ var id = ++n; map[id] = setInterval(function(){ try{ fn(); }catch(e){ warn(e); } }, ms); return id; },
      clear: function(id){ if(map[id] !== undefined){ clearTimeout(map[id]); clearInterval(map[id]); delete map[id]; } },
      clearAll: function(){ Object.keys(map).forEach(function(k){ clearTimeout(map[k]); clearInterval(map[k]); }); map = {}; },
      count: function(){ return Object.keys(map).length; }
    };
  }
  var fxT = Timers(), cineT = Timers();

  var enabled = true;
  var root = null, world = null, topEl = null, partsEl = null, calloutsEl = null, bannerEl = null, bannerIn = null, tagEl = null, charEl = null, liveEl = null;
  var waves = {}, crackEl = null, pwEl = null, wxEl = null, pulseEl = null, flashEl = null, warnEl = null, skipEl = null;

  /* ------------------------------------------------------------------ CSS */
  var CSS = [
"html.fmeOn .damIteComboFlash,html.fmeOn .tl2175MomentumBadge{display:none!important}",
".fmeRoot{position:absolute;inset:0;z-index:111;overflow:hidden;pointer-events:none;contain:layout paint;--fme-glow:rgba(47,210,255,.7);--dir:1;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-user-select:none;user-select:none}",
".fmeRoot.skippable{pointer-events:auto;cursor:pointer;touch-action:manipulation}",
".fmeRoot>*{position:absolute;pointer-events:none}",
".fmeSr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
/* callouts */
".fmeTop{position:fixed;left:0;top:0;width:0;height:0;z-index:10005;pointer-events:none;overflow:hidden;contain:layout paint}",
".fmeTop .fmeCallouts{position:absolute;inset:0}",
".fmeCo{position:absolute;left:50%;top:var(--top,38%);width:min(94%,520px);display:flex;flex-direction:column;align-items:center;gap:.04em;text-align:center;opacity:0;transform:translate3d(-50%,-50%,0);animation:fmeCoIn var(--d,1000ms) cubic-bezier(.2,.9,.25,1) forwards;will-change:transform,opacity;pointer-events:none}",
".fmeCo.out{animation:fmeCoOut .14s ease-in forwards}",
".fmeCoE{font-size:clamp(2rem,9vw,3.3rem);line-height:1}",
".fmeCoT{font-weight:1000;font-size:clamp(1.9rem,10.2vw,3.7rem);line-height:.98;letter-spacing:.02em;text-transform:uppercase;color:#fff;text-wrap:balance;max-width:100%;overflow-wrap:anywhere;",
"text-shadow:0 0 .3em var(--c1),0 0 .8em var(--c2),0 .06em 0 rgba(0,25,70,.8);-webkit-text-stroke:.035em rgba(0,30,80,.55);paint-order:stroke fill}",
".fmeCoM{font-weight:1000;font-size:clamp(2.6rem,15vw,5.4rem);line-height:.85;color:var(--c3);text-shadow:0 0 .25em var(--c1),0 0 .7em var(--c2),0 .05em 0 rgba(0,25,70,.8);-webkit-text-stroke:.03em rgba(0,30,80,.5);paint-order:stroke fill}",
".fmeCoS{font-weight:900;font-size:clamp(.72rem,3.2vw,.98rem);letter-spacing:.2em;text-transform:uppercase;color:var(--c3);text-shadow:0 1px 6px rgba(0,0,0,.6)}",
".fmeCo::before,.fmeCo::after{content:'';position:absolute;height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,var(--c1),transparent);opacity:0}",
".fmeCo::before{left:-25%;top:34%;width:60%;animation:fmeStreakL .5s ease-out forwards}",
".fmeCo::after{right:-25%;top:68%;width:60%;animation:fmeStreakR .5s .06s ease-out forwards}",
".fmeCo.t1{--c1:#7fe8ff;--c2:#1aa6ff;--c3:#c9f6ff}.fmeCo.t2{--c1:#5fd4ff;--c2:#2a6bff;--c3:#a9ecff}.fmeCo.t3{--c1:#ffe27a;--c2:#ff9a1a;--c3:#fff1b0}",
".fmeCo.t4{--c1:#ff7be5;--c2:#a02cff;--c3:#ffc7f5}.fmeCo.t5{--c1:#fff3a0;--c2:#ff4fd8;--c3:#fff}.fmeCo.warn{--c1:#ff8a7a;--c2:#ff2a2a;--c3:#ffd5cd}.fmeCo.good{--c1:#a6ffc9;--c2:#18c46a;--c3:#e6fff0}",
".fmeCoChar{position:absolute;bottom:-4.2rem;width:clamp(56px,17vw,92px);height:clamp(56px,17vw,92px);object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.5));animation:fmeCharPop var(--d,1200ms) cubic-bezier(.3,1.6,.4,1) forwards}",
"@keyframes fmeCoIn{0%{opacity:0;transform:translate3d(calc(-50% + var(--sx,0px)),calc(-50% + 20px),0) scale(.35) rotate(var(--rot,0deg))}",
"13%{opacity:1;transform:translate3d(-50%,-50%,0) scale(1.22) rotate(calc(var(--rot,0deg) * -.4))}24%{transform:translate3d(-50%,-50%,0) scale(.97) rotate(0)}",
"36%{transform:translate3d(-50%,-50%,0) scale(1.04)}78%{opacity:1;transform:translate3d(-50%,calc(-50% - 10px),0) scale(1)}",
"100%{opacity:0;transform:translate3d(calc(-50% + var(--ex,0px)),calc(-50% - 46px),0) scale(1.08)}}",
"@keyframes fmeCoOut{to{opacity:0;transform:translate3d(-50%,calc(-50% - 26px),0) scale(.9)}}",
"@keyframes fmeCoFade{0%{opacity:0}15%{opacity:1}80%{opacity:1}100%{opacity:0}}",
"@keyframes fmeStreakL{0%{opacity:0;transform:translate3d(-40%,0,0) scaleX(.3)}35%{opacity:.95}100%{opacity:0;transform:translate3d(90%,0,0) scaleX(1)}}",
"@keyframes fmeStreakR{0%{opacity:0;transform:translate3d(40%,0,0) scaleX(.3)}35%{opacity:.9}100%{opacity:0;transform:translate3d(-90%,0,0) scaleX(1)}}",
"@keyframes fmeCharPop{0%{opacity:0;transform:translate3d(0,24px,0) scale(.3) rotate(-14deg)}22%{opacity:1;transform:translate3d(0,-8px,0) scale(1.15) rotate(8deg)}40%{transform:translate3d(0,0,0) scale(1) rotate(-4deg)}85%{opacity:1}100%{opacity:0;transform:translate3d(0,-14px,0) scale(.9)}}",
/* screen effects */
".fmePulse{inset:0;background:radial-gradient(ellipse at 50% 42%,var(--fme-glow),transparent 62%);opacity:0}",
".fmePulse.go{animation:fmePulse .42s ease-out}",
"@keyframes fmePulse{0%{opacity:0;transform:scale(.92)}28%{opacity:.5}100%{opacity:0;transform:scale(1.08)}}",
".fmeFlash{inset:0;background:#fff;opacity:0}.fmeFlash.go{animation:fmeFlash .55s ease-out}",
"@keyframes fmeFlash{0%{opacity:.92}100%{opacity:0}}",
".fmeWarn{inset:0;box-shadow:inset 0 0 64px 16px rgba(255,40,40,.6);opacity:0}.fmeWarn.go{animation:fmeWarn .6s ease-out}",
"@keyframes fmeWarn{0%{opacity:0}25%{opacity:1}100%{opacity:0}}",
/* banner + tag */
".fmeBanner{left:0;right:0;top:36%;display:flex;justify-content:center;padding:0 3%;opacity:0}.fmeBanner.sm{top:15%}",
".fmeBannerIn{font-weight:1000;text-align:center;text-transform:uppercase;font-size:clamp(2rem,11vw,4.2rem);line-height:.96;letter-spacing:.02em;color:#fff;text-wrap:balance;max-width:100%;overflow-wrap:anywhere;",
"text-shadow:0 0 .3em var(--b1,#ff8a7a),0 0 .85em var(--b2,#ff2a2a),0 .06em 0 rgba(40,0,0,.8);-webkit-text-stroke:.035em rgba(40,0,20,.55);paint-order:stroke fill}",
".fmeBanner.sm .fmeBannerIn{font-size:clamp(1.5rem,8.2vw,3rem)}",
".fmeBanner.cool{--b1:#9fe8ff;--b2:#2a8cff}.fmeBanner.gold{--b1:#ffe27a;--b2:#ff9a1a}.fmeBanner.red{--b1:#ff8a7a;--b2:#ff2a2a}",
".fmeBanner.go{animation:fmeBan var(--ms,900ms) cubic-bezier(.2,.9,.25,1) forwards}",
".fmeBanner.hold.go{animation:fmeBanHold var(--ms,900ms) cubic-bezier(.2,.9,.25,1) forwards}",
"@keyframes fmeBan{0%{opacity:0;transform:scale(2.3)}12%{opacity:1;transform:scale(.93)}22%{transform:scale(1.06)}30%{transform:scale(1)}86%{opacity:1;transform:scale(1.01)}100%{opacity:0;transform:scale(1.05)}}",
"@keyframes fmeBanHold{0%{opacity:0;transform:scale(2.3)}12%{opacity:1;transform:scale(.93)}22%{transform:scale(1.06)}30%,100%{opacity:1;transform:scale(1)}}",
".fmeTag{left:50%;top:6%;padding:.4em 1em;border-radius:999px;background:linear-gradient(90deg,#ffb300,#ff4fd8);color:#fff;font:900 clamp(.78rem,3.5vw,1.05rem)/1 system-ui,sans-serif;letter-spacing:.14em;white-space:nowrap;box-shadow:0 0 18px rgba(255,120,200,.7);opacity:0;transform:translate3d(-50%,-30px,0)}",
".fmeTag.show{animation:fmeTagIn .5s cubic-bezier(.3,1.5,.4,1) forwards}",
"@keyframes fmeTagIn{to{opacity:1;transform:translate3d(-50%,0,0)}}",
".fmeSkip{left:50%;bottom:10px;transform:translateX(-50%);font:800 .68rem/1 system-ui,sans-serif;letter-spacing:.2em;color:rgba(255,255,255,.8);text-shadow:0 1px 4px rgba(0,0,0,.7);opacity:0;transition:opacity .3s}",
".fmeRoot.skippable .fmeSkip{opacity:.85}",
"html.fmeCineOn .geiUtilityDock,html.fmeCineOn .damMapLauncherBtn,html.fmeCineOn .songVaultFloatBtn,html.fmeCineOn .dmFloatBtn,html.fmeCineOn .dmBuyItesItem{opacity:0!important;pointer-events:none!important;transition:opacity .2s}",
/* particles */
".fmeParts{inset:0}",
".fmeP{position:absolute;left:0;top:0;width:var(--sz,8px);height:var(--sz,8px);margin:calc(var(--sz,8px) / -2) 0 0 calc(var(--sz,8px) / -2);border-radius:50% 50% 50% 50%/60% 60% 40% 40%;",
"background:radial-gradient(circle at 35% 30%,#fff,#9fe4ff 45%,#2a9dff);opacity:0;will-change:transform,opacity;animation:fmeFly var(--dur,900ms) cubic-bezier(.2,.7,.4,1) var(--dl,0ms) forwards}",
".fmeP.foam{background:radial-gradient(circle at 40% 35%,#fff,#e6f7ff 60%,#bfe9ff);border-radius:50%}",
".fmeP.deb{border-radius:2px;background:linear-gradient(135deg,#a98a62,#6b5236)}",
".fmeP.spk{border-radius:50%;background:radial-gradient(circle,#fff,#ffe27a 55%,rgba(255,170,0,0))}",
".fmeP.bub{border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(160,225,255,.25) 55%,rgba(160,225,255,.5));box-shadow:inset 0 0 0 1px rgba(255,255,255,.7)}",
"@keyframes fmeFly{0%{opacity:0;transform:translate3d(var(--x),var(--y),0) scale(.5)}10%{opacity:1}",
"55%{transform:translate3d(calc(var(--x) + var(--mx)),calc(var(--y) + var(--my)),0) scale(1) rotate(calc(var(--rt,0deg) * .6))}",
"100%{opacity:0;transform:translate3d(calc(var(--x) + var(--dx)),calc(var(--y) + var(--dy)),0) scale(.7) rotate(var(--rt,0deg))}}",
".fmeJet{position:absolute;left:0;top:calc(var(--h,140px) * -1);width:var(--w,16px);height:var(--h,140px);margin-left:calc(var(--w,16px) / -2);transform-origin:50% 100%;border-radius:999px 999px 6px 6px;",
"background:linear-gradient(0deg,rgba(110,205,255,0),rgba(190,240,255,.95) 40%,#fff);opacity:0;animation:fmeJet .95s cubic-bezier(.15,.8,.3,1) var(--dl,0ms) forwards}",
"@keyframes fmeJet{0%{opacity:0;transform:translate3d(var(--x),var(--y),0) rotate(var(--a)) scaleY(0)}25%{opacity:1;transform:translate3d(var(--x),var(--y),0) rotate(var(--a)) scaleY(1)}",
"100%{opacity:0;transform:translate3d(var(--x),var(--y),0) rotate(var(--a)) translateY(calc(var(--h,140px) * -.4)) scaleY(.15)}}",
".fmeRing{position:absolute;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid rgba(225,247,255,.95);opacity:0;animation:fmeRing .7s ease-out forwards}",
"@keyframes fmeRing{0%{opacity:.95;transform:translate3d(var(--x),var(--y),0) scale(.2)}100%{opacity:0;transform:translate3d(var(--x),var(--y),0) scale(6)}}",
/* dam cracks */
".fmeCrack{left:0;top:0;width:var(--s,120px);height:var(--s,120px);transform:translate3d(var(--x,0px),var(--y,0px),0);opacity:0;transition:opacity .2s}",
".fmeCrack.on{opacity:1}.fmeCrack svg{width:100%;height:100%;display:block;overflow:visible;position:static}",
".fmeCrack path{fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .45s ease-out}",
".fmeCrack g.on path{stroke-dashoffset:0}",
".fmeCrack .cd{stroke:#1b1208;stroke-width:2.4}.fmeCrack .cl{stroke:#ffe9b0;stroke-width:.7;opacity:.85}.fmeCrack .cw{stroke:#7fe3ff;stroke-width:1.3;opacity:.95}",
/* dam / wheel body animation (inner .body group has no transform attribute) */
".station .body.fmeShake1{animation:fmeDam1 .16s linear infinite!important;transform-box:fill-box;transform-origin:50% 100%}",
".station .body.fmeShake2{animation:fmeDam2 .12s linear infinite!important;transform-box:fill-box;transform-origin:50% 100%}",
".station .body.fmeShake3{animation:fmeDam3 .08s linear infinite!important;transform-box:fill-box;transform-origin:50% 100%}",
".station .body.fmeBroken{animation:none!important;transition:transform .55s cubic-bezier(.4,0,.2,1),opacity .55s,filter .55s;transform-box:fill-box;transform-origin:50% 100%;transform:translateY(10px) rotate(-7deg) scale(.9);opacity:.5;filter:brightness(.65)}",
".station .body.fmeSpin{animation:fmeSpin .2s linear infinite!important;transform-box:fill-box;transform-origin:50% 50%}",
"@keyframes fmeDam1{0%,100%{transform:translate3d(0,0,0)}25%{transform:translate3d(-1.4px,0,0) rotate(-.6deg)}75%{transform:translate3d(1.4px,0,0) rotate(.6deg)}}",
"@keyframes fmeDam2{0%,100%{transform:translate3d(0,0,0) scale(1)}25%{transform:translate3d(-2.6px,1px,0) rotate(-1.4deg) scale(1.02)}75%{transform:translate3d(2.6px,-1px,0) rotate(1.4deg) scale(1.02)}}",
"@keyframes fmeDam3{0%,100%{transform:translate3d(0,0,0) scale(1.03)}25%{transform:translate3d(-4px,2px,0) rotate(-2.4deg) scale(1.05)}75%{transform:translate3d(4px,-2px,0) rotate(2.4deg) scale(1.05)}}",
"@keyframes fmeSpin{to{transform:rotate(360deg)}}",
/* pressure state + camera shake */
".world.fmePressure #worldSVG{animation:fmeRumble .13s linear infinite}",
".world.fmeRumble #worldSVG{animation:fmeRumble .09s linear infinite}",
"@keyframes fmeRumble{0%,100%{transform:translate3d(0,0,0)}20%{transform:translate3d(calc(var(--fme-amp,1) * -1px),calc(var(--fme-amp,1) * .6px),0)}",
"45%{transform:translate3d(calc(var(--fme-amp,1) * .9px),calc(var(--fme-amp,1) * -.7px),0)}70%{transform:translate3d(calc(var(--fme-amp,1) * -.6px),calc(var(--fme-amp,1) * -.5px),0)}}",
".world.fmeShake{animation:fmeShake var(--fme-ms,600ms) linear 1 both}",
"@keyframes fmeShake{0%,100%{transform:translate3d(0,0,0) rotate(0)}10%{transform:translate3d(calc(var(--fme-sa,8) * -1px),calc(var(--fme-sa,8) * .5px),0) rotate(-.4deg)}",
"22%{transform:translate3d(calc(var(--fme-sa,8) * .9px),calc(var(--fme-sa,8) * -.8px),0) rotate(.5deg)}36%{transform:translate3d(calc(var(--fme-sa,8) * -.7px),calc(var(--fme-sa,8) * -.6px),0) rotate(-.3deg)}",
"52%{transform:translate3d(calc(var(--fme-sa,8) * .6px),calc(var(--fme-sa,8) * .7px),0) rotate(.3deg)}70%{transform:translate3d(calc(var(--fme-sa,8) * -.35px),calc(var(--fme-sa,8) * .3px),0)}86%{transform:translate3d(calc(var(--fme-sa,8) * .15px),0,0)}}",
".world.fmeFrozen svg *{animation-play-state:paused!important}.world.fmeFrozen #worldSVG{filter:saturate(.7) brightness(.88)}",
".timerBox.fmeUrgent{box-shadow:0 0 18px rgba(255,70,40,.7)}",
".timerBox.fmeUrgent .timerNum{display:inline-block;color:#fff;text-shadow:0 0 12px #ff5a3c,0 0 26px #ff2a2a;animation:fmeNum .45s ease-in-out infinite alternate}",
".timerBox.fmeCritical .timerNum{animation-duration:.2s}",
"@keyframes fmeNum{from{transform:scale(1)}to{transform:scale(1.2)}}",
/* water: pressure band + flood layers */
".fmePW{left:-6%;right:-6%;bottom:0;height:100%;opacity:.0;transform:translate3d(0,calc(100% - var(--pw,0%)),0);transition:transform .5s ease-out,opacity .3s;background:linear-gradient(180deg,rgba(60,170,255,.5),rgba(20,90,200,.62))}",
".fmePW.on{opacity:1}",
".fmePW::before,.fmeWv::before{content:'';position:absolute;left:-60px;right:-60px;top:-18px;height:20px;background:radial-gradient(circle at 12px 100%,var(--wc,rgba(80,185,255,.55)) 10px,rgba(255,255,255,.92) 11px,rgba(255,255,255,.92) 13px,transparent 14px) 0 0/48px 20px repeat-x;animation:fmeWaveX var(--wt,1.2s) linear infinite}",
".fmePW.fast::before{--wt:.5s}",
"@keyframes fmeWaveX{from{transform:translate3d(0,0,0)}to{transform:translate3d(calc(48px * var(--dir,1)),0,0)}}",
".fmeFloodBack,.fmeFloodFront{inset:-10px 0;overflow:hidden}.fmeFloodBack.bob,.fmeFloodFront.bob{animation:fmeBob 1.5s ease-in-out infinite alternate}",
"@keyframes fmeBob{from{transform:translate3d(0,-4px,0)}to{transform:translate3d(0,6px,0)}}",
".fmeWv{position:absolute;left:-8%;width:116%;top:0;height:100%;transform:translate3d(0,var(--ty,105%),0);transition:transform var(--rise,1.1s) cubic-bezier(.22,1.2,.36,1) var(--dl,0ms);will-change:transform}",
".fmeWv.w1{--wc:#1c6fc0;--wt:1.7s;background:linear-gradient(180deg,#1c6fc0,#0b3f8f)}",
".fmeWv.w2{--wc:#2a93e6;--wt:1.25s;background:linear-gradient(180deg,#2a93e6,#145fb8)}",
".fmeWv.w3{--wc:#69d0ff;--wt:.9s;background:linear-gradient(180deg,rgba(105,208,255,.93),rgba(40,150,235,.9))}",
".fmeWv::after{content:'';position:absolute;left:-30%;top:0;width:160%;height:100%;background:radial-gradient(ellipse at 28% 12%,rgba(255,255,255,.28),transparent 45%),radial-gradient(ellipse at 78% 30%,rgba(255,255,255,.16),transparent 40%),repeating-linear-gradient(100deg,transparent 0 46px,rgba(255,255,255,.08) 46px 78px);animation:fmeCaustic 5s linear infinite}",
"@keyframes fmeCaustic{from{transform:translate3d(0,0,0)}to{transform:translate3d(calc(78px * var(--dir,1)),0,0)}}",
".fmeWv.drain{transition-duration:.55s;transition-timing-function:cubic-bezier(.5,0,.8,.4)}",
".fmeRoot.rm .fmeWv{transition:opacity .35s;opacity:0}.fmeRoot.rm .fmeWv.up{opacity:1}.fmeRoot.rm .fmeWv::before,.fmeRoot.rm .fmePW::before{animation:none}",
/* weather */
".fmeWx{inset:0;opacity:0;transition:opacity .5s}.fmeWx.storm{opacity:1;background:linear-gradient(180deg,rgba(8,16,44,.5),rgba(8,16,44,.18))}",
".fmeWx.storm::after{content:'';position:absolute;left:-10%;top:-40%;width:120%;height:140%;background:repeating-linear-gradient(105deg,transparent 0 16px,rgba(190,225,255,.38) 16px 17px);animation:fmeRain .45s linear infinite}",
".fmeWx.mist{opacity:1;background:radial-gradient(ellipse at 50% 70%,rgba(235,245,255,.34),transparent 70%)}",
".fmeWx.sun{opacity:1;background:radial-gradient(ellipse at 80% 8%,rgba(255,225,130,.5),transparent 55%)}",
".fmeWx.bolt{animation:fmeBolt .5s ease-out}",
"@keyframes fmeRain{from{transform:translate3d(0,0,0)}to{transform:translate3d(-34px,48px,0)}}",
"@keyframes fmeBolt{0%{filter:brightness(1)}15%{filter:brightness(2.4)}100%{filter:brightness(1)}}",
/* character + props */
".fmeChar{left:0;top:0;width:var(--cs,96px);height:var(--cs,96px);opacity:0;transform:translate3d(-300px,0,0);will-change:transform,opacity;transition:opacity .4s}",
".fmeChar.out{opacity:0!important}",
".fmeChar img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 6px 8px rgba(0,0,0,.45))}",
".fmeChar .fb{display:none;font-size:calc(var(--cs,96px) * .8);line-height:1;text-align:center}.fmeChar.nofb img{display:none}.fmeChar.nofb .fb{display:block}",
".fmeChar .prop{position:absolute;left:50%;bottom:-16%;transform:translateX(-50%);font-size:calc(var(--cs,96px) * .6);line-height:1}",
".fmeHyd{position:absolute;left:0;top:0;width:34px;height:44px;opacity:0;will-change:transform,opacity}",
/* educational failure card — compact: the button is ALWAYS visible */
"/* the card is anchored to the VIEWPORT (not the board): on short phones the board is cut off by the page, the button must never be */",
".timeUpCard{position:fixed;inset:0;z-index:10010;background:rgba(2,6,16,.5)}",
".timeUpCard .gameOverInner{display:flex;flex-direction:column;align-items:center;box-sizing:border-box;width:min(92vw,380px);max-width:none;max-height:calc(100vh - 20px);max-height:calc(100dvh - 20px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));padding:14px 16px 14px;overflow:hidden}",
".timeUpCard .gameOverInner{position:relative;isolation:isolate}",
".timeUpCard .gameOverInner::before{content:'';position:absolute;inset:0;border-radius:inherit;background:rgba(6,10,30,.4);z-index:-1;pointer-events:none}",
".timeUpCard .fmeEdu{flex:1 1 auto;min-height:0;width:100%;overflow:hidden;display:flex;flex-direction:column;align-items:center}",
".timeUpCard .timeUpArt{height:clamp(56px,15vh,130px);flex:0 1 auto;min-height:0;margin:-4px 0 0}",
".timeUpCard .gameOverTitle{font-size:clamp(1.25rem,6.6vw,1.8rem);margin:4px 0 4px;line-height:1.05;letter-spacing:.01em}",
".timeUpCard .timeUpQuip{margin:0 0 4px;font-size:.92rem}",
".timeUpCard .gameOverSub{font-size:.8rem;margin-bottom:8px;line-height:1.4}",
".timeUpCard .timeUpTip{display:none}",
".fmeTip{width:100%;box-sizing:border-box;margin:0 0 10px;padding:8px 12px 9px;border-radius:14px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.28);text-align:center}",
".fmeTipHead{font-weight:900;font-size:.68rem;letter-spacing:.22em;color:#ffe27a;margin-bottom:4px}",
".fmeTip span{display:block;font-weight:800;font-size:.9rem;line-height:1.32;color:#fff}",
".timeUpCard .rebuildBtn{flex:0 0 auto;width:100%;min-height:50px;font-size:1.05rem;letter-spacing:.02em}",
".timeUpCard.show .fmeTip span{animation:fmeTipIn .5s ease-out both}.timeUpCard.show .fmeTip span:nth-child(2){animation-delay:.12s}.timeUpCard.show .fmeTip span:nth-child(3){animation-delay:.24s}.timeUpCard.show .fmeTip span:nth-child(4){animation-delay:.36s}",
".timeUpCard.show .rebuildBtn{animation:fmeInvite 1.7s ease-in-out .9s 3}",
"@keyframes fmeTipIn{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}",
"@keyframes fmeInvite{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}",
"@media (max-height:700px){.timeUpCard .timeUpArt{height:clamp(44px,11vh,80px)}}",
"@media (max-height:600px){.timeUpCard .timeUpArt,.timeUpCard .timeUpQuip{display:none}.fmeTip span{display:inline;font-size:.82rem}.fmeTip span::after{content:' '}}",
/* milestone progress words ("3 MORE!" + the spoken phrase), water-flow strip, anticipation, level-complete sequence */
".fmeCoL{font-weight:900;font-size:clamp(1rem,5.6vw,1.55rem);line-height:1.1;letter-spacing:.03em;text-transform:uppercase;color:#fff;text-wrap:balance;max-width:92%;overflow-wrap:anywhere;text-shadow:0 0 .5em var(--c1),0 .08em 0 rgba(0,25,70,.85);margin-top:.15em}",
".fmeCoWave{width:min(72%,270px);height:12px;overflow:hidden;position:relative;border-radius:6px;margin-top:.2em}",
".fmeCoWave::before{content:'';position:absolute;left:-28px;right:-28px;top:0;bottom:0;background:radial-gradient(circle at 14px 100%,var(--c1) 9px,transparent 10px) 0 0/28px 12px repeat-x;animation:fmeWaveX2 .6s linear infinite}",
"@keyframes fmeWaveX2{from{transform:translate3d(0,0,0)}to{transform:translate3d(28px,0,0)}}",
".fmeCo.ms4 .fmeCoT{font-size:clamp(2.1rem,12vw,4.2rem)}.fmeCo.ms3 .fmeCoT{font-size:clamp(2.3rem,13vw,4.6rem)}",
".fmeCo.ms2 .fmeCoT{font-size:clamp(2.5rem,14.5vw,5rem)}.fmeCo.ms2 .fmeCoL{font-size:clamp(1.1rem,6.2vw,1.7rem)}",
".fmeCo.ms1 .fmeCoT{font-size:clamp(2.8rem,16.5vw,5.8rem)}.fmeCo.ms1 .fmeCoL{font-size:clamp(1.15rem,6.6vw,1.8rem)}.fmeCo.ms1 .fmeCoE{animation:fmeNum .3s ease-in-out infinite alternate}",
".fmeCo.lc .fmeCoT{font-size:clamp(2.2rem,12.5vw,4.6rem)}",
".fmeTop.short .fmeCo .fmeCoE,.fmeTop.short .fmeCo .fmeCoWave{display:none}",
".fmeTop.short .fmeCo .fmeCoT{font-size:clamp(1.5rem,9vw,2.5rem)}.fmeTop.short .fmeCo .fmeCoM{font-size:clamp(1.8rem,10vw,2.8rem)}",
".fmeTop.short .fmeCo .fmeCoL{font-size:clamp(.85rem,4.6vw,1.1rem)}.fmeTop.short .fmeCo .fmeCoS{font-size:.66rem}",
".fmeRoot.ant .fmeWarn{opacity:.55;box-shadow:inset 0 0 70px 14px rgba(255,214,90,.55);animation:fmeAntPulse .85s ease-in-out infinite alternate}",
"@keyframes fmeAntPulse{from{opacity:.25}to{opacity:.7}}",
".world.fmeAnticip{--fme-amp:.7}.world.fmeAnticip #worldSVG{animation:fmeRumble .16s linear infinite}",
".fmeRoot.calm .fmePulse{background:radial-gradient(ellipse at 50% 42%,rgba(120,220,255,.5),rgba(255,226,140,.18) 45%,transparent 66%)}",
".station .body.fmeSpinSlow{animation:fmeSpin .7s linear infinite!important;transform-box:fill-box;transform-origin:50% 50%}",
".station .body.fmeGlow{animation:fmeGlowPulse .7s ease-in-out infinite alternate!important}",
"@keyframes fmeGlowPulse{from{filter:brightness(1)}to{filter:brightness(1.45) drop-shadow(0 0 8px rgba(255,226,120,.9))}}",
/* reduced motion + low power */
"@media (prefers-reduced-motion:reduce){.fmeCo{animation:fmeCoFade var(--d,1000ms) linear forwards!important}.fmeCo::before,.fmeCo::after,.fmeCoChar{display:none}",
".fmeBanner.go,.fmeBanner.hold.go{animation:fmeCoFade var(--ms,900ms) linear forwards!important}.fmePulse.go,.fmeFlash.go,.fmeWarn.go{animation:none}",
".world.fmePressure #worldSVG,.world.fmeRumble #worldSVG,.world.fmeShake{animation:none!important}.station .body.fmeShake1,.station .body.fmeShake2,.station .body.fmeShake3,.station .body.fmeSpin{animation:none!important}",
".timerBox.fmeUrgent .timerNum{animation:none}.timeUpCard.show .rebuildBtn,.timeUpCard.show .fmeTip span{animation:none}",
".fmeCoWave::before,.fmeCo.ms1 .fmeCoE,.fmeRoot.ant .fmeWarn,.world.fmeAnticip #worldSVG,.station .body.fmeSpinSlow,.station .body.fmeGlow{animation:none!important}}"
  ].join("\n");

  function addStyle(){
    if($("fmeStyle")) return;
    var s = document.createElement("style"); s.id = "fmeStyle"; s.textContent = CSS; document.head.appendChild(s);
    document.documentElement.classList.add("fmeOn");
  }

  /* ------------------------------------------------------------------ DOM */
  var CRACKS = [
    ["M52 18 L48 32 L53 44 L47 55", "M70 62 L63 68 L66 77"],
    ["M47 55 L38 60 L36 72 L28 80", "M53 44 L63 41 L70 30", "M30 35 L38 42 L35 50"],
    ["M47 55 L50 68 L45 78 L48 90", "M63 68 L74 72 L80 84", "M38 42 L24 40 L16 46"],
    ["M50 6 L47 25 L55 40 L45 55 L52 70 L46 85 L50 97", "M14 52 L40 51 L45 55 L60 52 L86 58"]
  ];
  function crackSvg(){
    var out = '<svg viewBox="0 0 100 100" aria-hidden="true">';
    CRACKS.forEach(function(stage, i){
      out += '<g class="c' + (i + 1) + '">';
      stage.forEach(function(d){
        out += '<path class="cd" pathLength="1" d="' + d + '"/><path class="cl" pathLength="1" d="' + d + '"/>' + (i === 3 ? '<path class="cw" pathLength="1" d="' + d + '"/>' : "");
      });
      out += "</g>";
    });
    return out + "</svg>";
  }
  function ensure(){
    if(root && root.isConnected) return true;
    world = $("world"); if(!world) return false;
    addStyle();
    root = document.createElement("div"); root.id = "fmeRoot"; root.className = "fmeRoot"; root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<div class="fmeWx"></div><div class="fmePW"></div>' +
      '<div class="fmeFloodBack"><div class="fmeWv w1"></div><div class="fmeWv w2"></div></div>' +
      '<div class="fmeCrack">' + crackSvg() + '</div>' +
      '<div class="fmeChar"><img alt="" decoding="async"><span class="fb" aria-hidden="true">🦫</span><span class="prop"></span></div>' +
      '<div class="fmeFloodFront"><div class="fmeWv w3"></div></div>' +
      '<div class="fmeParts"></div>' +
      '<div class="fmeBanner"><div class="fmeBannerIn"></div></div><div class="fmeTag"></div>' +
      '<div class="fmePulse"></div><div class="fmeFlash"></div><div class="fmeWarn"></div><div class="fmeSkip">TAP TO CONTINUE</div>';
    world.appendChild(root);
    var q = function(s){ return root.querySelector(s); };
    partsEl = q(".fmeParts");
    var oldTop = $("fmeTop"); if(oldTop && oldTop.parentNode) oldTop.parentNode.removeChild(oldTop);
    topEl = document.createElement("div"); topEl.id = "fmeTop"; topEl.className = "fmeTop"; topEl.setAttribute("aria-hidden", "true");
    calloutsEl = document.createElement("div"); calloutsEl.className = "fmeCallouts"; topEl.appendChild(calloutsEl); document.body.appendChild(topEl); bannerEl = q(".fmeBanner"); bannerIn = q(".fmeBannerIn"); tagEl = q(".fmeTag");
    charEl = q(".fmeChar"); crackEl = q(".fmeCrack"); pwEl = q(".fmePW"); wxEl = q(".fmeWx");
    pulseEl = q(".fmePulse"); flashEl = q(".fmeFlash"); warnEl = q(".fmeWarn"); skipEl = q(".fmeSkip");
    waves = { w1: q(".w1"), w2: q(".w2"), w3: q(".w3"), back: q(".fmeFloodBack"), front: q(".fmeFloodFront") };
    var img = charEl.querySelector("img");
    img.addEventListener("error", function(){ charEl.classList.add("nofb"); });
    partsEl.addEventListener("animationend", function(e){ var t = e.target; if(!t || t.parentNode !== partsEl) return; if(t.classList.contains("fmeP")) recycle(t); else partsEl.removeChild(t); });   // jets / rings are one-shot, never pooled
    liveEl = $("fmeLive");
    if(!liveEl){ liveEl = document.createElement("div"); liveEl.id = "fmeLive"; liveEl.className = "fmeSr"; liveEl.setAttribute("aria-live", "assertive"); liveEl.setAttribute("role", "status"); document.body.appendChild(liveEl); }
    return true;
  }
  /* The callout layer lives ABOVE the floating action dock (z-index 9996) but is pinned to the board's rectangle, so big words are never cut off. */
  function placeTop(){
    if(!topEl || !world) return;
    var r = world.getBoundingClientRect(), s = topEl.style, top = Math.max(r.top, 0), bottom = Math.min(r.bottom, window.innerHeight || r.bottom), h = Math.max(120, bottom - top);
    /* pinned to the VISIBLE part of the board: on short phones the page cuts the board off, big words must stay on screen */
    s.left = Math.round(r.left) + "px"; s.top = Math.round(top) + "px"; s.width = Math.round(r.width) + "px"; s.height = Math.round(h) + "px";
    topEl.classList.toggle("short", h < 300); s.setProperty("--fme-h", Math.round(h) + "px");
  }
  function announce(t){ try{ if(liveEl){ liveEl.textContent = ""; liveEl.textContent = t; } }catch(e){} }
  function box(){ var r = root.getBoundingClientRect(); return { w: r.width || 360, h: r.height || 560, l: r.left, t: r.top }; }
  function reflow(el){ void el.offsetWidth; }
  function retrigger(el, cls){ el.classList.remove(cls); reflow(el); el.classList.add(cls); }

  /* ------------------------------------------------------------------ particles (pooled, capped, transform/opacity only) */
  var pool = [], liveP = 0, MAXP = LITE ? 34 : 64;
  function recycle(el){ if(el._u){ el._u = 0; liveP = Math.max(0, liveP - 1); } el.className = "fmeP"; el.style.animation = "none"; if(el.parentNode) el.parentNode.removeChild(el); if(pool.length < 90) pool.push(el); }
  function particle(x, y, o){
    if(!partsEl || reduced()) return null;
    if(liveP >= MAXP){
      var kids = partsEl.children, t = now();
      for(var i = 0; i < kids.length && liveP >= MAXP; i++){ if(kids[i]._u && t - kids[i]._u > 3500){ recycle(kids[i]); i--; } }
      if(liveP >= MAXP) return null;
    }
    var el = pool.pop() || document.createElement("div");
    el.className = "fmeP" + (o.cls ? " " + o.cls : "");
    var s = el.style; s.animation = ""; s.setProperty("--x", x.toFixed(1) + "px"); s.setProperty("--y", y.toFixed(1) + "px");
    s.setProperty("--dx", (o.dx || 0).toFixed(1) + "px"); s.setProperty("--dy", (o.dy || 0).toFixed(1) + "px");
    s.setProperty("--mx", (o.mx != null ? o.mx : (o.dx || 0) * .6).toFixed(1) + "px"); s.setProperty("--my", (o.my != null ? o.my : (o.dy || 0) * .6 - 24).toFixed(1) + "px");
    s.setProperty("--sz", (o.sz || 8).toFixed(1) + "px"); s.setProperty("--dur", Math.round(o.dur || 900) + "ms"); s.setProperty("--dl", Math.round(o.dl || 0) + "ms"); s.setProperty("--rt", Math.round(o.rt || 0) + "deg");
    el._u = now(); liveP++; partsEl.appendChild(el); return el;
  }
  function burst(x, y, n, o){
    o = o || {}; n = Math.round(n * quality()); if(n <= 0) return;
    var spread = o.spread != null ? o.spread : 120, up = o.up != null ? o.up : 60;
    for(var i = 0; i < n; i++){
      var a = rand(0, Math.PI * 2), d = rand(.35, 1) * spread;
      particle(x + rand(-6, 6), y + rand(-6, 6), { cls: o.cls || (Math.random() < .3 ? "foam" : ""), dx: Math.cos(a) * d, dy: Math.sin(a) * d + (o.fall || 40), mx: Math.cos(a) * d * .65, my: Math.sin(a) * d * .65 - up,
        sz: rand(o.min || 5, o.max || 11), dur: rand(o.durMin || 650, o.durMax || 1100), dl: rand(0, o.delay || 80), rt: rand(-120, 120) });
    }
  }
  function jets(x, y, n, hMin, hMax){
    if(reduced() || !partsEl) return;
    n = Math.max(2, Math.round(n * quality()));
    for(var i = 0; i < n; i++){
      var j = document.createElement("div"); j.className = "fmeJet"; var s = j.style;
      s.setProperty("--x", x.toFixed(1) + "px"); s.setProperty("--y", y.toFixed(1) + "px");
      s.setProperty("--a", Math.round(lerp(-72, 72, n === 1 ? .5 : i / (n - 1)) + rand(-8, 8)) + "deg");
      s.setProperty("--h", Math.round(rand(hMin, hMax)) + "px"); s.setProperty("--w", Math.round(rand(10, 22)) + "px"); s.setProperty("--dl", Math.round(rand(0, 160)) + "ms");
      partsEl.appendChild(j); (function(el){ fxT.later(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 1400); })(j);
    }
  }
  function ring(x, y){
    if(reduced() || !partsEl) return;
    var r = document.createElement("div"); r.className = "fmeRing"; r.style.setProperty("--x", x + "px"); r.style.setProperty("--y", y + "px");
    partsEl.appendChild(r); fxT.later(function(){ if(r.parentNode) r.parentNode.removeChild(r); }, 900);
  }
  function lerp(a, b, t){ return a + (b - a) * t; }

  /* ------------------------------------------------------------------ voice lane (ONE spoken clip at a time, priority aware) */
  var lane = { el: null, cur: null, primed: false, warmEls: [], duckT: 0, ducked: false, lastAt: 0, log: [] };
  var SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  function GA(){ return window.GEI_AUDIO || null; }
  function audioMuted(){ try{ var a = GA(); return !!(a && a.muted); }catch(e){ return false; } }
  function zoneBlocked(){ try{ var a = GA(); return !!(a && a.zone === "DAM_MAP"); }catch(e){ return false; } }
  function masterVol(){ try{ var a = GA(); return a ? clamp(a.state.masterVolume, 0, 1) : 1; }catch(e){ return 1; } }
  function urlOf(id){ return CDN + CLIPS[id]; }
  function laneEl(){
    if(!lane.el){ var a = new Audio(); a.preload = "auto"; try{ a.setAttribute("playsinline", ""); }catch(e){} lane.el = a; }
    return lane.el;
  }
  function prime(){
    if(lane.primed) return; lane.primed = true;
    try{
      var a = laneEl(); a.muted = true; a.src = SILENT; var p = a.play();
      var done = function(){ try{ a.pause(); a.muted = false; a.removeAttribute("src"); }catch(e){} };
      if(p && p.then) p.then(done, done); else done();
    }catch(e){}
  }
  ["pointerdown", "touchend", "keydown"].forEach(function(ev){
    document.addEventListener(ev, function once(){ document.removeEventListener(ev, once, true); prime(); }, { capture: true, passive: true });
  });
  function duckOn(){ clearTimeout(lane.duckT); if(!lane.ducked){ lane.ducked = true; try{ var a = GA(); a && a.voiceBegin("fme"); }catch(e){} } }
  function duckOff(delay){
    clearTimeout(lane.duckT);
    lane.duckT = setTimeout(function(){ if(!lane.cur && lane.ducked){ lane.ducked = false; try{ var a = GA(); a && a.voiceEnd("fme"); }catch(e){} } }, delay == null ? 380 : delay);
  }
  /* is any OTHER voice system (Beaver / WOW / narrator / achievement director / event vocabulary) speaking right now? */
  function othersSpeaking(){
    try{ var a = GA(); if(a){ if(a.beaver && a.beaver.speaking) return true; if(a.wow && a.wow.speaking) return true; } }catch(e){}
    try{ var d = window.__GEI_ACHIEVEMENT_DIRECTOR__; if(d && d.state){ var st = d.state(); if(st && st.playing) return true; } }catch(e){}
    try{ var v = window.__GEI_V2203_VOICE_EVENT__; if(v && v.state){ var vs = v.state(); if(vs && vs.current) return true; } }catch(e){}
    return false;
  }
  function silenceOthers(){
    try{ var a = GA(); if(a){ a.stopFemale && a.stopFemale(); a.stopWow && a.stopWow(); a.stopBeaver && a.stopBeaver(); } }catch(e){}
    try{ var d = window.__GEI_ACHIEVEMENT_DIRECTOR__; if(d && d.cancel) d.cancel(); }catch(e){}
  }
  function settle(item, played){
    if(!item || item.done) return; item.done = true; clearTimeout(item.t);
    if(lane.cur === item){ lane.cur = null; try{ item.el.onended = item.el.onerror = null; item.el.pause(); }catch(e){} duckOff(); }
    try{ item.res(played); }catch(e){}
  }
  /* say(id, {pri, maxMs}) → Promise<boolean>. Resolves when the clip ENDS (or is skipped / interrupted / blocked), never rejects. */
  function say(id, o){
    o = o || {};
    var pri = o.pri || PRI.achievement, url = o.url || (CLIPS[id] ? urlOf(id) : id);
    return new Promise(function(res){
      try{
        if(!enabled || audioMuted() || zoneBlocked() || document.hidden) return res(false);
        if(o.polite && othersSpeaking()) return res(false);                 // personality never talks over or silences anyone else
        if(lane.cur){ if(lane.cur.pri < pri) return res(false); settle(lane.cur, false); }   // higher priority is speaking → drop; equal/lower → interrupt
        if(!o.polite) silenceOthers();
        var el = laneEl(), item = { id: o.label || id, pri: pri, res: res, el: el, done: false, t: 0 };
        lane.cur = item; lane.lastAt = now(); lane.log.push(o.label || id); if(lane.log.length > 24) lane.log.shift();
        duckOn();
        el.onended = function(){ settle(item, true); };
        el.onerror = function(){ settle(item, false); };
        el.muted = false; el.src = url; el.volume = clamp(config.voiceGain * masterVol(), 0, 1);
        item.t = setTimeout(function(){ settle(item, false); }, o.maxMs || config.maxVoiceMs);
        var p = el.play();
        if(p && p.catch) p.catch(function(){ settle(item, false); });
      }catch(e){ warn(e); res(false); }
    });
  }
  function stopVoice(maxPri){   // stop the current clip when its priority number is >= maxPri (i.e. as important as or less than)
    var c = lane.cur; if(c && (maxPri == null || c.pri >= maxPri)) settle(c, false);
  }
  function voiceBusy(){ return !!lane.cur; }
  function warm(ids){
    try{
      if(navigator.connection && navigator.connection.saveData) return;
      (ids || Object.keys(CLIPS)).forEach(function(id){
        if(!CLIPS[id] || lane.warmEls[id]) return;
        var a = new Audio(); a.preload = "auto"; a.src = urlOf(id); lane.warmEls[id] = a;
      });
    }catch(e){}
  }
  function releaseWarm(){ try{ Object.keys(lane.warmEls).forEach(function(k){ var a = lane.warmEls[k]; if(a){ a.removeAttribute("src"); a.load(); } }); lane.warmEls = []; }catch(e){} }
  try{ var _ga = GA(); if(_ga && _ga.addFemaleGate) _ga.addFemaleGate(function(){ return !lane.cur; }); }catch(e){}
  window.addEventListener("gei:audio-mute", function(e){ if(e.detail && e.detail.muted) stopVoice(); });

  /* ------------------------------------------------------------------ synth SFX (shared game synth, budgeted) */
  function tone(f, d, t, dl){ try{ if(typeof window.playTone === "function") window.playTone(f, d, t, dl); }catch(e){} }
  function noise(d, a, b, g){ try{ if(typeof window.playWaterNoise === "function") window.playWaterNoise(d, a, b, g); }catch(e){} }

  /* ------------------------------------------------------------------ callouts + combo escalation */
  var co = { cur: null, lastKey: {}, lastChar: 0, streak: 0, n: 0, pending: null };
  /* gei:flow-event — a read-only stream of what the player just did (tap / combo / day / fail / level / start). Listeners (PersonalityTriggerEngine) react to ACTIONS, never to a timer. */
  function emit(type, d){ try{ var o = d || {}; o.type = type; o.at = now(); window.dispatchEvent(new CustomEvent("gei:flow-event", { detail: o })); }catch(e){} }
  function tap(info){ try{ var o = info || {}; o.streak = co.streak; emit("tap", o); }catch(e){} }
  var lv = { id: "", maxStreak: 0, fails: 0, minRem: 1e9, finalRem: 0, days: 0, oneMoreAt: 0 };   // per-level performance (feeds the victory voice)
  var DUR = { 1: 900, 2: 1000, 3: 1150, 4: 1300, 5: 1700, warn: 950, good: 1300 };
  var moments = {};
  function register(id, def){ if(id && def) moments[id] = def; return API; }
  function charImage(){ try{ var c = typeof window.getActiveCharacter === "function" ? window.getActiveCharacter() : null; return c && c.img ? c.img : ""; }catch(e){ return ""; } }
  function tierKey(t){ return typeof t === "string" ? t : "t" + clamp(t || 1, 1, 5); }
  function callout(def){
    if(!enabled || !ensure()) return false;
    var tier = def.tier || 1, key = def.key || def.text, t = now(), tk = tierKey(tier), rank = typeof tier === "string" ? (tier === "warn" ? 6 : 3) : tier;
    placeTop();
    var cur = co.cur;
    if(cur && cur.el.parentNode && !cur.out){
      if(cur.hold && t - cur.at < cur.hold && !def.force) return false;   // ONE MORE holds the stage for a beat
      if(!(rank > cur.rank || t - cur.at >= (def.gap != null ? def.gap : config.calloutGapMs))) return false;
      if(cur.rank >= 6 && rank < 5 && t - cur.at < 500) return false;     // a timer warning is never wiped by a fresh small word
    }
    if(co.lastKey[key] && t - co.lastKey[key] < (def.cooldown != null ? def.cooldown : 900)) return false;
    co.lastKey[key] = t;
    if(cur && cur.el.parentNode && !cur.out){ cur.out = true; cur.el.classList.add("out"); (function(e){ fxT.later(function(){ if(e.parentNode) e.parentNode.removeChild(e); }, 200); })(cur.el); }
    var el = document.createElement("div"); el.className = "fmeCo " + tk;
    var dur = def.ms || DUR[tier] || 1000, big = rank >= 4;
    el.style.setProperty("--d", dur + "ms"); el.style.setProperty("--top", (def.top || 38) + "%");
    el.style.setProperty("--sx", Math.round(rand(-60, 60)) + "px"); el.style.setProperty("--ex", Math.round(rand(-40, 40)) + "px"); el.style.setProperty("--rot", rand(-7, 7).toFixed(1) + "deg");
    var html = "";
    if(def.emoji) html += '<div class="fmeCoE">' + def.emoji + "</div>";
    html += '<div class="fmeCoT"></div>';
    if(def.mult) html += '<div class="fmeCoM"></div>';
    if(def.line2) html += '<div class="fmeCoL"></div>';
    if(def.wave) html += '<div class="fmeCoWave"></div>';
    if(def.sub) html += '<div class="fmeCoS"></div>';
    el.innerHTML = html;
    if(def.cls) el.className += " " + def.cls;
    if(def.line2) el.querySelector(".fmeCoL").textContent = def.line2;
    el.querySelector(".fmeCoT").textContent = def.text;
    if(def.mult) el.querySelector(".fmeCoM").textContent = def.mult;
    if(def.sub) el.querySelector(".fmeCoS").textContent = def.sub;
    var rec = { el: el, rank: rank, at: t, out: false, hold: def.hold || 0 }; co.cur = rec;
    calloutsEl.appendChild(el);
    /* optional character reaction (rare, big words only) */
    if(def.char !== false && rank >= 4 && rank < 6 && t - co.lastChar > 3500 && !reduced()){
      var src = charImage();
      if(src){ co.lastChar = t; var im = document.createElement("img"); im.className = "fmeCoChar"; im.alt = ""; im.decoding = "async"; im.src = src; if(Math.random() < .5) im.style.left = "-2%"; else im.style.right = "-2%";
        im.addEventListener("error", function(){ if(im.parentNode) im.parentNode.removeChild(im); }); el.appendChild(im); }
    }
    fxT.later(function(){ if(el.parentNode) el.parentNode.removeChild(el); if(co.cur === rec) co.cur = null; }, dur + 120);
    /* screen pulse + particles */
    var b = box(), cx = b.w / 2, cy = b.h * ((def.top || 38) / 100);
    var glow = { 1: "rgba(47,210,255,.6)", 2: "rgba(60,140,255,.7)", 3: "rgba(255,200,60,.7)", 4: "rgba(220,70,255,.7)", 5: "rgba(255,230,120,.85)", warn: "rgba(255,50,40,.7)", good: "rgba(60,230,150,.7)" }[tier] || "rgba(47,210,255,.6)";
    root.style.setProperty("--fme-glow", glow);
    if(rank >= 2 && !reduced()) retrigger(pulseEl, "go");
    var n = { 1: 5, 2: 9, 3: 13, 4: 18, 5: 26, warn: 6, good: 14 }[tier] || 6;
    burst(cx, cy, n, { spread: big ? 190 : 130, up: 70, delay: 120 });
    if(rank >= 4 && rank < 6) shake(rank >= 5 ? 5 : 3, 380);
    if(def.sfx !== false) callSfx(rank);
    if(typeof def.say === "string") say(def.say, { pri: def.pri || PRI.achievement });
    return true;
  }
  function clearCallout(){
    var cur = co.cur; if(!cur || cur.out || !cur.el.parentNode) return;
    cur.out = true; cur.el.classList.add("out"); fxT.later(function(){ if(cur.el.parentNode) cur.el.parentNode.removeChild(cur.el); }, 200);
  }
  function callSfx(rank){
    if(rank >= 6) return;
    noise(.16 + rank * .03, 500 + rank * 90, 1500 + rank * 160, .03 + rank * .01);
    if(rank >= 3) tone(rank >= 5 ? 1046 : 784, .12, "triangle", .04);
  }
  var COMBO = {
    2:  { emoji: "💧", text: "FLOW COMBO", mult: "×2", tier: 1 },
    3:  { emoji: "🌊", text: "HYDRAULIC SURGE", mult: "×3", tier: 2 },
    4:  { emoji: "✨", text: "FLOW STREAK", mult: "×4", tier: 1 },
    5:  { emoji: "💦", text: "MAXIMUM FLOW", mult: "×5", tier: 3 },
    7:  { emoji: "⚡", text: "PRESSURE BOOST", mult: "×7", tier: 3 },
    10: { emoji: "🔥", text: "DAM-ITE OVERDRIVE", mult: "×10", tier: 4 },
    12: { emoji: "🌀", text: "SUPER SURGE", mult: "×12", tier: 4 },
    16: { emoji: "🏅", text: "FLOW MASTER", tier: 5, sub: "16 tap streak" },
    24: { emoji: "👑", text: "HYDRAULIC MASTER", tier: 5, sub: "24 tap streak" },
    36: { emoji: "🏆", text: "DAM-ITE LEGEND", tier: 5, sub: "36 tap streak" }
  };
  /* The game calls this with its own combo count on every continuing tap (n = 1 → a fresh combo). The engine keeps a streak that
     keeps climbing past the game's cap so the "master" words stay reachable; each milestone fires once per streak. */
  function combo(n){
    try{
      if(!enabled) return false;
      if(!(n > 1)){ co.streak = 1; return false; }
      co.streak = Math.max(co.streak + 1, n);
      if(co.streak > lv.maxStreak) lv.maxStreak = co.streak;
      emit("combo", { n: n, streak: co.streak });
      var m = COMBO[co.streak];
      if(!m) return false;
      /* Held for one tick: if a milestone word ("3 MORE!") fires for the same tap it absorbs the combo as its small line instead of two words fighting. */
      co.pending = { key: "combo" + co.streak, emoji: m.emoji, text: m.text, mult: m.mult, sub: m.sub, tier: m.tier, cooldown: 400, at: now() };
      fxT.later(flushCombo, 0);
      return true;
    }catch(e){ warn(e); return false; }
  }
  function flushCombo(){ var p = co.pending; co.pending = null; if(p) callout(p); }
  function claimCombo(){ var p = co.pending; if(!p) return null; co.pending = null; return { text: p.text + (p.mult ? " " + p.mult : ""), tier: p.tier }; }
  function trigger(id, extra){
    var d = moments[id]; if(!d) return false;
    var o = {}; Object.keys(d).forEach(function(k){ o[k] = d[k]; }); if(extra) Object.keys(extra).forEach(function(k){ o[k] = extra[k]; });
    o.key = o.key || id; return callout(o);
  }
  register("gateOpen",        { emoji: "🚪", text: "GATE OPEN!", tier: 3, top: 30 });
  register("waterwheelPower", { emoji: "⚙️", text: "WATERWHEEL POWER!", tier: 3, top: 30 });
  register("damControlled",   { emoji: "🧱", text: "DAM CONTROLLED!", tier: "good", top: 30 });
  register("flowing",         { emoji: "💧", text: "MOUNTAIN FLOW!", tier: "good", top: 30 });
  register("pondRising",      { emoji: "🌊", text: "POND RISING!", tier: "good", top: 30 });
  register("factoryOnline",   { emoji: "🏭", text: "FACTORY ONLINE!", tier: 3, top: 30 });
  register("justInTime",      { emoji: "😮‍💨", text: "JUST IN TIME!", sub: "you saved the dam", tier: 4, top: 30 });
  register("controlled",      { emoji: "🏆", text: "YOU CONTROLLED THE FLOW!", tier: 5, top: 34, ms: 1900 });

  /* ------------------------------------------------------------------ camera shake / screen effects */
  function shake(amp, ms){
    if(!world || reduced()) return;
    world.style.setProperty("--fme-sa", String(amp * quality() || 1)); world.style.setProperty("--fme-ms", ms + "ms");
    retrigger(world, "fmeShake");
    fxT.later(function(){ world.classList.remove("fmeShake"); }, ms + 60);
  }
  function flash(){ if(!reduced() && flashEl) retrigger(flashEl, "go"); }

  /* ------------------------------------------------------------------ geometry helpers */
  function stationBody(i){ return document.querySelector('#stationsGroup .station[data-index="' + i + '"] .body'); }
  function damPoint(){
    var b = box(), body = stationBody(1), r = body && body.getBoundingClientRect ? body.getBoundingClientRect() : null;
    if(r && r.width > 4) return { x: r.left - b.l + r.width / 2, y: r.top - b.t + r.height / 2, s: Math.max(r.width, r.height) };
    return { x: b.w / 2, y: b.h * .28, s: Math.min(b.w, b.h) * .3 };
  }

  /* ------------------------------------------------------------------ PRESSURE STATE */
  var FLOW_PW = [0, 2, 3.4, 5.4, 7.6, 10.5];                // milestone flow level 0..5 → resting height of the flow band (%)
  var fl = { level: 0, tick: 0 };
  var pr = { on: false, stage: 0, fired: {}, lastDrip: 0, lastMusic: 0, minRem: 1e9, timerBox: null };
  var WARN = [
    { at: 4000, clip: "pressure", text: "PRESSURE CRITICAL!", emoji: "⚠️" },
    { at: 3000, clip: "hold",     text: "HOLD THE DAM!",       emoji: "🧱" },
    { at: 2000, clip: "toomuch",  text: "TOO MUCH FLOW!",      emoji: "🌊" },
    { at: 1000, clip: "cracking", text: "THE DAM IS CRACKING!", emoji: "💥" }
  ];
  function stageFor(rem){ return rem <= 1000 ? 4 : rem <= 2000 ? 3 : rem <= 3000 ? 2 : rem <= 4000 ? 1 : 0; }
  function pressureApply(stage){
    pr.stage = stage; pr.on = true;
    if(!reduced()){ world.classList.add("fmePressure"); world.style.setProperty("--fme-amp", String(.5 + stage * .55)); }
    applyPW();
    var tb = pr.timerBox || (pr.timerBox = $("timerBox"));
    if(tb){ tb.classList.add("fmeUrgent"); tb.classList.toggle("fmeCritical", stage >= 3); }
  }
  function pressureOff(){
    if(!pr.on && !pr.stage) return;
    pr.on = false; pr.stage = 0;
    if(world){ world.classList.remove("fmePressure"); world.style.removeProperty("--fme-amp"); }
    applyPW();
    var tb = pr.timerBox || $("timerBox"); if(tb) tb.classList.remove("fmeUrgent", "fmeCritical");
  }
  function applyPW(){
    if(!pwEl) return;
    var press = pr.on ? 3 + pr.stage * 2.4 : 0, floor = FLOW_PW[fl.level] || 0, v = Math.max(press, floor);
    pwEl.classList.toggle("on", v > 0); pwEl.classList.toggle("fast", pr.stage >= 2 || fl.level >= 4); pwEl.style.setProperty("--pw", v + "%");
  }
  /* sync(remainingMs, live): called by the game on every timer render (≈10 Hz and on pause/stop). */
  function sync(rem, live){
    try{
      if(!enabled || cine.active) return;
      if(!live || !(rem > 0) || rem > config.pressureAtMs){
        if(pr.on) pressureOff();
        if(live && rem > config.pressureAtMs + 300){ pr.fired = {}; pr.minRem = 1e9; }
        return;
      }
      if(!ensure()) return;
      var stage = stageFor(rem); pr.minRem = Math.min(pr.minRem, rem);
      if(!pr.on || stage !== pr.stage) pressureApply(stage);
      var idx = -1; for(var i = 0; i < WARN.length; i++) if(rem <= WARN[i].at && !pr.fired[i]) idx = i;
      if(idx >= 0){ for(var j = 0; j <= idx; j++) pr.fired[j] = 1; fireWarning(idx); }
      var t = now();
      if(t - pr.lastDrip > 300 - stage * 40){ pr.lastDrip = t; var d = damPoint(), a = rand(-1.1, 1.1);
        particle(d.x + rand(-d.s * .3, d.s * .3), d.y + d.s * .25, { cls: Math.random() < .5 ? "bub" : "", dx: Math.sin(a) * rand(20, 70), dy: rand(30, 80), my: -rand(14, 40), sz: rand(4, 8), dur: rand(500, 800) }); }
      if(t - pr.lastMusic > 650){ pr.lastMusic = t; try{ var s = window.DAMSoundtrack; s && s.notify && s.notify("game"); }catch(e){} }
    }catch(e){ warn(e); }
  }
  function fireWarning(i){
    var w = WARN[i];
    say(w.clip, { pri: PRI.warning });
    callout({ key: "warn" + i, emoji: w.emoji, text: w.text, tier: "warn", top: 36, cooldown: 0, gap: 0 });
    if(!reduced() && warnEl) retrigger(warnEl, "go");
    shake(2 + i, 260); announce(w.text);
    noise(.2, 120 + i * 60, 700, .05 + i * .015);
  }
  function reset(){
    if(cine.active || cine.cardShown) recover();
    pr.fired = {}; pr.minRem = 1e9; co.streak = 0; pressureOff(); lvSync(); lv.oneMoreAt = 0; setFlowLevel(0);
    try{ window.dispatchEvent(new CustomEvent("gei:flow-reset")); }catch(e){}
    emit("start", { level: lv.id });
    if(!lane.warmed){ lane.warmed = true; try{ (window.requestIdleCallback || function(f){ return setTimeout(f, 1800); })(function(){ warm(); }, { timeout: 4000 }); }catch(e){} }
  }

  /* ------------------------------------------------------------------ FAILURE CINEMATIC */
  var cine = { active: false, id: 0, lastEvent: "", lastReaction: "", anims: [], onCard: null, cardShown: false, skippable: false, plan: null, tick: 0, extra: [] };
  var REACTIONS = ["swept", "jump", "grab", "dive", "float", "popup"];
  function makePlan(){
    var q = quality(), r = Math.random(), acc = 0, event = "normal", table = [["comedy", config.comedyChance]];
    Object.keys(config.rareEvents).forEach(function(k){ table.push([k, config.rareEvents[k]]); });
    for(var i = 0; i < table.length; i++){ if(table[i][0] === cine.lastEvent) continue; acc += table[i][1]; if(r < acc){ event = table[i][0]; break; } }
    var mega = event === "mega";
    var reaction = event === "beaver" ? "swept" : event === "rescue" ? "escape" : event === "comedy" ? "popup" : pick(REACTIONS.filter(function(x){ return x !== cine.lastReaction; }));
    var lines;
    if(event === "comedy") lines = pick([["whoa", "who"], ["run", "who"], ["who"]]);
    else if(event === "rescue") lines = [{ text: "RUN!", clip: "run" }, { text: "PHEW!", clip: null }, "flood"];
    else lines = pick([["run", "whoa", "flood"], ["run", "whoa", "flood"], ["whoa", "flood"], ["run", "flood"]]);
    return {
      event: event, reaction: reaction, lines: lines, mega: mega, q: q, rm: reduced(),
      dir: Math.random() < .5 ? 1 : -1, water: rand(.88, 1.1) * (mega ? 1.18 : 1), shake: rand(.75, 1.3) * (mega ? 1.55 : 1),
      weather: pick(["none", "none", "storm", "mist", "sun"]), rise: rand(.95, 1.4) * (mega ? 1.15 : 1)
    };
  }
  var LINE = { run: "RUN!", whoa: "WHOA!", flood: "THAT WAS A FLOOD!", who: "WHO TURNED THAT WATER ON?!" };
  var EVENT_TAG = { mega: "🌊 MEGA FLOOD", beaver: "🦫 BEAVER FLOOD", wheel: "⚙️ WATERWHEEL CHAOS", hydrant: "🚒 HYDRANT FLOOD", rescue: "🛟 RESCUE MOMENT", comedy: "😂 COMEDY FAILURE" };

  function banner(text, cls, ms, o){
    if(!bannerEl) return; o = o || {};
    bannerIn.textContent = text; bannerEl.className = "fmeBanner " + (cls || "red") + (o.sm ? " sm" : "") + (o.hold ? " hold" : "");
    bannerEl.style.setProperty("--ms", ms + "ms"); reflow(bannerEl); bannerEl.classList.add("go"); announce(text);
  }
  function tagShow(text){ if(!tagEl) return; tagEl.textContent = text; tagEl.classList.remove("show"); reflow(tagEl); tagEl.classList.add("show"); }
  function setCrack(stage){
    if(!crackEl) return;
    var d = damPoint(), s = d.s * 1.1;
    crackEl.style.setProperty("--s", s.toFixed(0) + "px"); crackEl.style.setProperty("--x", (d.x - s / 2).toFixed(0) + "px"); crackEl.style.setProperty("--y", (d.y - s / 2).toFixed(0) + "px");
    crackEl.classList.toggle("on", stage > 0);
    for(var i = 1; i <= 4; i++){ var g = crackEl.querySelector("g.c" + i); if(g) g.classList.toggle("on", stage >= i); }
  }
  function damClass(cls){
    var b = stationBody(1); if(!b) return;
    b.classList.remove("fmeShake1", "fmeShake2", "fmeShake3", "fmeBroken"); if(cls) b.classList.add(cls);
  }
  function setPressureStage(plan, st){
    var amp = [0, 1.2, 2, 3.2, 4.8][st] * plan.shake;
    if(!plan.rm){ world.classList.add("fmeRumble"); world.style.setProperty("--fme-amp", String(amp)); }
    pwEl.classList.add("on"); pwEl.classList.toggle("fast", st >= 2); pwEl.style.setProperty("--pw", (4 + st * 3.4 * plan.water) + "%");
    damClass(st >= 3 ? "fmeShake3" : st >= 2 ? "fmeShake2" : "fmeShake1"); setCrack(st);
  }
  function wait(ms){ return new Promise(function(res){ cineT.later(function(){ res(true); }, ms); }); }
  function beat(min, vp, max){ return Promise.all([wait(min), vp ? Promise.race([vp, wait(max || min + 1500)]) : null]); }
  function alive(id){ return cine.active && cine.id === id; }

  function charSetup(S){
    var src = charImage(), img = charEl.querySelector("img");
    charEl.classList.remove("out", "nofb"); charEl.style.setProperty("--cs", S + "px");
    if(src){ if(img.getAttribute("src") !== src) img.src = src; } else charEl.classList.add("nofb");
    charEl.querySelector(".fb").textContent = "🦫"; charEl.querySelector(".prop").textContent = "";
  }
  function playChar(frames, dur){
    cine.anims.forEach(function(a){ try{ a.cancel(); }catch(e){} }); cine.anims = [];
    charEl.style.opacity = "1";
    if(!charEl.animate){ var last = frames[frames.length - 1]; charEl.style.transform = last.transform; return null; }
    var a = charEl.animate(frames, { duration: dur, easing: "linear", fill: "forwards" }); cine.anims.push(a); return a;
  }
  function T(x, y, r, s){ return "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px,0) rotate(" + Math.round(r || 0) + "deg) scale(" + (s == null ? 1 : s) + ")"; }
  function reactionFrames(kind, plan){
    var b = box(), W = b.w, H = b.h, S = clamp(W * .27, 72, 124), d = plan.dir, f = [], n, i, t, surf = H * .3;
    charSetup(S);
    function F(off, x, y, r, s, o){ f.push({ offset: clamp(off, 0, 1), transform: T(x, y, r, s), opacity: o == null ? 1 : o }); }
    var dur = 2600;
    if(kind === "swept"){
      var x0 = d > 0 ? -S : W, x1 = d > 0 ? W : -S; n = 12; dur = 2500;
      for(i = 0; i <= n; i++){ t = i / n; F(t, lerp(x0, x1, t), surf + Math.sin(t * Math.PI * 4) * S * .22 - S * .2, d * 720 * t, 1); }
    }else if(kind === "jump"){
      var cx = W / 2 - S / 2 + rand(-W * .15, W * .15), base = H * .4; dur = 2500;
      F(0, cx, H * .75, 0, .6, 0); F(.1, cx, base, -6, 1.1); F(.22, cx, base - H * .15, 10, 1); F(.34, cx, base, -4, .92); F(.46, cx, base - H * .12, -10, 1); F(.58, cx, base, 4, .94);
      F(.7, cx, base - H * .08, 8, 1); F(.82, cx, base + S * .1, -6, 1); F(1, cx, base + S * .1, 0, 1);
    }else if(kind === "grab"){
      charEl.querySelector(".prop").textContent = "🪵"; var gx0 = W * (d > 0 ? .1 : .7), gx1 = W * (d > 0 ? .7 : .1); n = 10; dur = 2800;
      for(i = 0; i <= n; i++){ t = i / n; F(t, lerp(gx0, gx1, t), surf + Math.sin(t * Math.PI * 3) * S * .2 - S * .1, Math.sin(t * Math.PI * 5) * 14, 1); }
    }else if(kind === "dive"){
      var dx = W / 2 - S / 2 + rand(-W * .12, W * .12); dur = 2800;
      F(0, dx, surf - S * .2, 0, 1); F(.14, dx, surf + S * .2, 12, 1); F(.3, dx, H * .66, 0, .8, .0); F(.5, dx, H * .66, 0, .8, 0);
      F(.62, dx, surf - S * .7, -10, 1.3); F(.7, dx, surf - S * .45, 14, 1.1); F(.76, dx, surf - S * .45, -16, 1.1); F(.82, dx, surf - S * .45, 16, 1.1); F(.88, dx, surf - S * .45, -12, 1.05); F(.94, dx, surf - S * .4, 8, 1); F(1, dx, surf - S * .4, 0, 1);
    }else if(kind === "float"){
      charEl.querySelector(".prop").textContent = "🛟"; var fx0 = d > 0 ? -S * .5 : W - S * .5, fx1 = d > 0 ? W - S * .5 : -S * .5; n = 10; dur = 3200;
      for(i = 0; i <= n; i++){ t = i / n; F(t, lerp(fx0, fx1, t * .85 + .05), surf + Math.sin(t * Math.PI * 3) * S * .12 - S * .15, Math.sin(t * Math.PI * 4) * 8, 1); }
    }else if(kind === "escape"){
      var ex = W * (d > 0 ? .12 : .78), tx = W * .5 + (d > 0 ? W * .14 : -W * .14); dur = 3000; var run = H * .58;
      F(0, ex, run, 0, 1); F(.1, lerp(ex, tx, .15), run - S * .18, d * 6, 1); F(.2, lerp(ex, tx, .3), run, 0, 1); F(.3, lerp(ex, tx, .45), run - S * .18, d * 6, 1); F(.4, lerp(ex, tx, .6), run, 0, 1);
      F(.5, lerp(ex, tx, .8), run - S * .2, d * 6, 1); F(.6, tx, run - H * .08, d * 14, 1.05); F(.72, tx, H * .1, -8, 1.12); F(.8, tx, H * .12, 8, 1.1); F(.88, tx, H * .1, -8, 1.12); F(1, tx, H * .12, 0, 1.1);
    }else{ // popup
      var px = W * rand(.28, .72) - S / 2; dur = 2400;
      F(0, px, H * .66, 0, .7, 0); F(.18, px, H * .66, 0, .7, 0); F(.36, px, surf - S * .75, -8, 1.25); F(.46, px, surf - S * .5, 12, 1.1); F(.54, px, surf - S * .5, -14, 1.1);
      F(.62, px, surf - S * .5, 14, 1.1); F(.7, px, surf - S * .5, -14, 1.1); F(.78, px, surf - S * .5, 12, 1.08); F(.88, px, surf - S * .45, -6, 1.04); F(1, px, surf - S * .45, 0, 1);
    }
    return { frames: f, dur: dur * (plan.rm ? .6 : 1), S: S, kind: kind };
  }
  function floodRise(plan, big){
    var w = plan.water, rise = plan.rise;
    root.style.setProperty("--dir", String(plan.dir));
    [["w1", 100 * (big ? .06 : .14) / w, rise * 1.25, 0], ["w2", (big ? 14 : 25) / Math.max(.8, w), rise * 1.1, 110], ["w3", (big ? 28 : 40) / Math.max(.8, w), rise * .95, 220]].forEach(function(a){
      var el = waves[a[0]]; el.classList.remove("drain"); el.style.setProperty("--ty", clamp(a[1], 3, 70).toFixed(1) + "%"); el.style.setProperty("--rise", a[2].toFixed(2) + "s"); el.style.setProperty("--dl", a[3] + "ms");
      reflow(el); el.classList.add("up");
    });
    waves.back.classList.add("bob"); waves.front.classList.add("bob");
  }
  function foamLoop(ms){
    var end = now() + ms;
    var id = cineT.every(function(){
      if(now() > end){ cineT.clear(id); return; }
      var b = box(); burst(rand(0, b.w), b.h * rand(.22, .42), 3, { cls: "foam", spread: 50, up: 40, fall: 10, min: 4, max: 9, durMin: 500, durMax: 800 });
    }, 170);
  }
  function hydrants(plan){
    var b = box(), n = plan.q ? 3 : 2, svg = '<svg viewBox="0 0 34 44" aria-hidden="true"><rect x="9" y="12" width="16" height="26" rx="4" fill="#e63a2e"/><rect x="5" y="10" width="24" height="7" rx="3" fill="#c42a20"/><circle cx="17" cy="7" r="6" fill="#e63a2e"/><rect x="2" y="21" width="7" height="8" rx="2" fill="#f2f2f2"/><rect x="25" y="21" width="7" height="8" rx="2" fill="#f2f2f2"/><rect x="7" y="37" width="20" height="5" rx="2" fill="#8c1d16"/></svg>';
    for(var i = 0; i < n; i++){
      var h = document.createElement("div"); h.className = "fmeHyd"; h.innerHTML = svg; h.style.width = "clamp(30px,9vw,44px)"; h.style.height = "clamp(40px,12vw,58px)"; root.appendChild(h);
      var x0 = plan.dir > 0 ? -50 : b.w + 20, x1 = plan.dir > 0 ? b.w + 20 : -50, y = b.h * rand(.3, .44), ph = rand(0, 3);
      if(h.animate){ var fr = [], k; for(k = 0; k <= 8; k++){ var t = k / 8; fr.push({ offset: t, opacity: k === 0 || k === 8 ? 0 : 1, transform: T(lerp(x0, x1, t), y + Math.sin(t * 8 + ph) * 14, Math.sin(t * 7 + ph) * 28, 1) }); }
        cine.anims.push(h.animate(fr, { duration: 2200 + i * 450, delay: i * 380 + 150, fill: "forwards", easing: "linear" })); }
      (function(el, d){ cineT.later(function(){ var b2 = box(); burst(rand(b2.w * .2, b2.w * .8), b2.h * .35, 4, { spread: 60, up: 120, fall: 60 }); }, d); })(h, 400 + i * 450);
      cine.extra.push(h);
    }
  }
  function cleanVisuals(drain){
    cineT.clearAll(); fxT.clearAll();
    cine.anims.forEach(function(a){ try{ a.cancel(); }catch(e){} }); cine.anims = [];
    cine.extra.forEach(function(e){ if(e.parentNode) e.parentNode.removeChild(e); }); cine.extra = [];
    if(!root) return;
    world.classList.remove("fmeRumble", "fmeShake", "fmeFrozen", "fmePressure"); world.style.removeProperty("--fme-amp");
    root.classList.remove("skippable", "rm");
    damClass(null); var wb = stationBody(4); if(wb) wb.classList.remove("fmeSpin");
    setCrack(0); pwEl.classList.remove("on", "fast"); pwEl.style.setProperty("--pw", "0%");
    bannerEl.className = "fmeBanner"; tagEl.className = "fmeTag"; wxEl.className = "fmeWx";
    charEl.classList.add("out"); charEl.style.opacity = "0";
    if(partsEl){ while(partsEl.firstChild){ var c = partsEl.firstChild; if(c.classList && c.classList.contains("fmeP")) recycle(c); else partsEl.removeChild(c); } }
    ["w1", "w2", "w3"].forEach(function(k){
      var el = waves[k]; if(drain){ el.classList.add("drain"); el.style.setProperty("--ty", "105%"); el.style.setProperty("--dl", "0ms"); el.classList.remove("up"); }
      else{ el.classList.remove("up", "drain"); el.style.setProperty("--ty", "105%"); }
    });
    waves.back.classList.remove("bob"); waves.front.classList.remove("bob");
    if(drain) fxT.later(function(){ ["w1", "w2", "w3"].forEach(function(k){ waves[k].classList.remove("drain"); }); }, 700);
    var tb = pr.timerBox || $("timerBox"); if(tb) tb.classList.remove("fmeUrgent", "fmeCritical");
    co.cur = null; while(calloutsEl && calloutsEl.firstChild) calloutsEl.removeChild(calloutsEl.firstChild);
  }
  function endCine(drain){
    var was = cine.active; cine.active = false; cine.skippable = false; document.documentElement.classList.remove("fmeCineOn");
    document.removeEventListener("visibilitychange", onHidden);
    cine.id++;
    cleanVisuals(drain);
    stopVoice(); clearTimeout(lane.duckT);
    if(lane.ducked){ lane.ducked = false; try{ var a = GA(); a && a.voiceEnd("fme"); }catch(e){} }
    try{ var g = GA(); g && g.voiceEnd("fme-cine"); }catch(e){}
    return was;
  }
  function onHidden(){ if(document.hidden && cine.active) showCard(); }
  function showCard(){
    if(cine.cardShown) return; cine.cardShown = true;
    var cb = cine.onCard; cine.onCard = null; cine.skippable = false; if(root) root.classList.remove("skippable");
    cineT.clearAll(); stopVoice(PRI.cinematic);
    cine.anims.forEach(function(a){ try{ a.cancel(); }catch(e){} }); cine.anims = [];
    if(charEl){ charEl.classList.add("out"); }
    if(bannerEl) bannerEl.className = "fmeBanner"; if(tagEl) tagEl.className = "fmeTag";
    world.classList.remove("fmeRumble", "fmeFrozen", "fmeShake"); world.style.removeProperty("--fme-amp");
    try{ cb && cb(); }catch(e){ warn(e); }
    announce("The dam broke! Dam guide tip: control the flow, watch the pressure, keep the system moving. Try day again.");
    var id = cine.id;
    cineT.later(function(){ if(cine.id !== id || !cine.active) return; say("again", { pri: PRI.cinematic, maxMs: 4500 }).then(function(){ try{ var g = GA(); g && g.voiceEnd("fme-cine"); }catch(e){} }); }, 220);
    cineT.later(function(){ try{ var g = GA(); g && g.voiceEnd("fme-cine"); }catch(e){} }, 5200);
  }
  function skip(){ if(vc.active && vc.skippable) vcFinish(); else if(cine.active && cine.skippable) showCard(); }

  async function runFailure(id, plan){
    var A = function(){ return alive(id); }, rm = plan.rm, k = rm ? .6 : 1;
    try{
      /* PHASE 1 — silence / freeze */
      world.classList.add("fmeFrozen"); flash();
      tone(70, .35, "sine"); noise(.35, 300, 60, .08);
      await wait(rand(260, 380) * k); if(!A()) return;
      world.classList.remove("fmeFrozen");
      /* PHASE 2 — UH-OH */
      var v = say("uhoh", { pri: PRI.cinematic }); banner("UH-OH…", "gold", 1000, { hold: false }); tone(220, .2, "square"); tone(165, .3, "square", .18);
      if(plan.event === "wheel"){ var wb = stationBody(4); wb && wb.classList.add("fmeSpin"); tagShow(EVENT_TAG.wheel); }
      await beat(650 * k, v, 1600); if(!A()) return;
      /* PHASE 3 — PRESSURE CRITICAL */
      v = say("pressure", { pri: PRI.cinematic }); banner("PRESSURE CRITICAL", "red", 1000); setPressureStage(plan, 1);
      if(!rm) retrigger(warnEl, "go"); noise(.5, 90, 240, .08); shake(2 * plan.shake, 400); burst(damPoint().x, damPoint().y, 8, { cls: "bub", spread: 70, up: 40, fall: 10 });
      cine.tick = cineT.every(function(){ var d = damPoint(); particle(d.x + rand(-d.s * .4, d.s * .4), d.y + rand(-d.s * .1, d.s * .4), { cls: Math.random() < .5 ? "bub" : "", dx: rand(-60, 60), dy: rand(20, 90), my: -rand(10, 40), sz: rand(4, 9), dur: rand(450, 800) }); }, Math.round(150 / Math.max(.4, plan.q || .4)));
      await beat(700 * k, v, 1600); if(!A()) return;
      /* PHASE 4 — HOLD THE DAM */
      v = say("hold", { pri: PRI.cinematic }); banner("HOLD THE DAM!", "gold", 1000); setPressureStage(plan, 2);
      tone(98, .5, "sawtooth"); noise(.6, 120, 320, .1); shake(3 * plan.shake, 450); if(!rm) retrigger(warnEl, "go");
      await beat(700 * k, v, 1600); if(!A()) return;
      /* PHASE 5 — TOO MUCH FLOW */
      v = say("toomuch", { pri: PRI.cinematic }); banner("TOO MUCH FLOW!", "cool", 1000); setPressureStage(plan, 3);
      noise(.8, 160, 600, .13); shake(4 * plan.shake, 500); var d0 = damPoint(); jets(d0.x, d0.y, 4, 40, 80); if(!rm) retrigger(warnEl, "go");
      await beat(700 * k, v, 1600); if(!A()) return;
      /* PHASE 6 — CRACKING */
      v = say("cracking", { pri: PRI.cinematic }); banner("THE DAM IS CRACKING!", "red", 1100); setPressureStage(plan, 4);
      noise(.14, 4000, 900, .16); tone(55, .5, "sawtooth"); shake(6 * plan.shake, 700); burst(d0.x, d0.y, 14, { cls: "deb", spread: 90, up: 30, fall: 70, min: 4, max: 8 }); burst(d0.x, d0.y, 12, { spread: 110, up: 60 });
      cineT.later(function(){ var d = damPoint(); noise(.12, 3500, 700, .14); burst(d.x, d.y, 8, { cls: "deb", spread: 80, up: 20, fall: 60, min: 3, max: 6 }); }, 420);
      await beat(850 * k, v, 1700); if(!A()) return;
      /* PHASE 7 — WE HAVE A BREAK */
      v = say("weBreak", { pri: PRI.cinematic }); banner("WE HAVE A BREAK!", "red", 1000); flash(); shake(10 * plan.shake, 650);
      noise(.3, 5000, 200, .18); tone(45, .6, "sawtooth"); var d1 = damPoint(); burst(d1.x, d1.y, 22, { cls: "deb", spread: 150, up: 50, fall: 100, min: 4, max: 10 }); ring(d1.x, d1.y);
      await beat(640 * k, v, 1500); if(!A()) return;
      /* PHASE 8 — THE ACTUAL DAM BREAK */
      v = say("broke", { pri: PRI.cinematic, maxMs: 4800 });
      if(typeof window.playDamBreakSound === "function"){ try{ window.playDamBreakSound(); }catch(e){} } else { tone(90, .6, "sawtooth"); noise(2.2, 400, 60, .28); }
      noise(1.6, 900, 120, .2); flash(); shake(16 * plan.shake, 1100);
      damClass("fmeBroken"); setCrack(0); pwEl.classList.remove("on"); world.classList.remove("fmeRumble"); if(cine.tick){ cineT.clear(cine.tick); cine.tick = 0; }
      var d2 = damPoint(); ring(d2.x, d2.y); jets(d2.x, d2.y, plan.mega ? 11 : 8, 110 * plan.water, 230 * plan.water);
      burst(d2.x, d2.y, plan.mega ? 56 : 40, { spread: 230 * plan.water, up: 120, fall: 140, max: 14, durMax: 1400 });
      burst(d2.x, d2.y, 20, { cls: "deb", spread: 190, up: 90, fall: 160, min: 5, max: 12, durMax: 1300 });
      if(plan.weather !== "none") wxEl.className = "fmeWx " + plan.weather; if(plan.weather === "storm") cineT.later(function(){ wxEl.classList.add("bolt"); }, 500);
      if(rm) root.classList.add("rm");
      floodRise(plan, plan.mega); foamLoop(rm ? 0 : 2400);
      cineT.later(function(){ if(!A()) return; if(plan.event !== "wheel" && EVENT_TAG[plan.event]) tagShow(EVENT_TAG[plan.event]); else if(plan.nearMiss && plan.event === "normal") tagShow("😬 SO CLOSE — ONE TAP AWAY"); }, 350);
      if(plan.event === "wheel"){ var wb2 = stationBody(4); cineT.later(function(){ wb2 && wb2.classList.remove("fmeSpin"); }, 900); }
      if(plan.event === "hydrant") hydrants(plan);
      if(plan.event === "mega"){ cineT.later(function(){ if(A()){ shake(10 * plan.shake, 700); var b = box(); jets(b.w * rand(.3, .7), b.h * .6, 6, 140, 260); } }, 700); }
      await beat(900 * k, v, 2400); if(!A()) return;
      /* PHASE 9 — character reaction (tap to skip from here on) */
      cine.skippable = true; var armSkip = id; cineT.later(function(){ if(alive(armSkip) && cine.skippable) root.classList.add("skippable"); }, 700);
      var rf = reactionFrames(plan.reaction, plan); playChar(rf.frames, rf.dur);
      if(plan.reaction === "popup" || plan.reaction === "dive"){ cineT.later(function(){ var b = box(); burst(b.w * .5, b.h * .3, 14, { spread: 90, up: 70, fall: 60 }); }, rf.dur * .8); }
      for(var i = 0; i < plan.lines.length; i++){
        var ln = plan.lines[i], clipId = typeof ln === "string" ? ln : ln.clip, text = typeof ln === "string" ? LINE[ln] : ln.text, last = i === plan.lines.length - 1;
        var vv = clipId ? say(clipId, { pri: PRI.reaction }) : null;
        banner(text, plan.event === "comedy" && last ? "gold" : last ? "cool" : "gold", last ? 1700 : 900, { sm: true, hold: last });
        tone(last ? 523 : 392, .12, "triangle");
        await beat((last ? 900 : 560) * k, vv, last ? 2400 : 1500); if(!A()) return;
      }
      await wait(260 * k); if(!A()) return;
      showCard();
    }catch(e){ warn(e); if(alive(id)) showCard(); }
  }

  function failure(opts){
    try{
      opts = opts || {};
      if(!enabled || cine.active || !ensure() || typeof opts.onCard !== "function") return false;
      pressureOff(); setFlowLevel(0); lvSync(); lv.fails++; emit("fail", { fails: lv.fails }); unslow(); cleanVisuals(false);
      cine.active = true; cine.cardShown = false; cine.onCard = opts.onCard; cine.skippable = false; cine.extra = cine.extra || [];
      var plan = cine.plan = makePlan(); plan.nearMiss = !!(lv.oneMoreAt && now() - lv.oneMoreAt < 9000); var forced = opts.plan || config.forcePlan; if(forced) Object.keys(forced).forEach(function(k){ plan[k] = forced[k]; }); cine.lastEvent = plan.event; cine.lastReaction = plan.reaction; var id = ++cine.id;
      silenceOthers(); try{ var g = GA(); g && g.voiceBegin("fme-cine"); }catch(e){}
      root.classList.toggle("rm", false); document.documentElement.classList.add("fmeCineOn");
      document.addEventListener("visibilitychange", onHidden);
      cineT.later(function(){ if(alive(id)) showCard(); }, config.watchdogMs);   // never trap the player in a cinematic
      runFailure(id, plan);
      return true;
    }catch(e){ warn(e); endCine(false); return false; }
  }
  /* "Try Day Again": drain the flood quickly and give everything back. */
  function recover(){
    try{
      if(!root) return; var was = cine.active || cine.cardShown;
      cine.cardShown = false; cine.onCard = null; endCine(true); pressureOff();
      if(was) announce("");
    }catch(e){ warn(e); }
  }
  function abort(){ recover(); }

  /* ------------------------------------------------------------------ SUCCESS — the opposite of failure */
  var DAY_MOMENT = { 0: "flowing", 1: "damControlled", 2: "pondRising", 3: "gateOpen", 4: "waterwheelPower" };
  function dayComplete(index, remMs){
    try{
      if(!enabled || cine.active) return;
      var closeCall = pr.on || (remMs > 0 && remMs < 3000) || pr.minRem < 3000;
      emit("day", { index: index, remMs: remMs > 0 ? remMs : 0, closeCall: closeCall, streak: co.streak, fails: lv.fails, maxStreak: lv.maxStreak });
      pressureOff(); setFlowLevel(0); lvSync(); lv.days++; lv.minRem = Math.min(lv.minRem, remMs > 0 ? remMs : 0); lv.finalRem = remMs > 0 ? remMs : 0; lv.oneMoreAt = 0;
      pr.fired = {}; pr.minRem = 1e9; co.streak = 0;
      if(lane.cur && lane.cur.pri === PRI.warning) stopVoice(PRI.warning);
      if(!ensure()) return;
      clearCallout();                                           // the celebration card gets a clean stage
      if(index === 5) return;                                   // the final day is announced by levelComplete()
      if(closeCall) trigger("justInTime", { gap: 0, cooldown: 0 });
      else if(DAY_MOMENT[index] && (index === 3 || index === 4)) trigger(DAY_MOMENT[index], { gap: 0, cooldown: 0 });
      /* calm, controlled visuals: a gentle ripple on the dam, no shake */
      if(index === 1 || index === 3){ var d = damPoint(); ring(d.x, d.y); }
    }catch(e){ warn(e); }
  }
  /* ------------------------------------------------------------------ slow-motion (signature moments): visual only — game clocks are untouched */
  var slowS = { anims: [], t: 0 };
  function unslow(){
    clearTimeout(slowS.t); slowS.anims.forEach(function(a){ try{ a.updatePlaybackRate(1); }catch(e){} }); slowS.anims = [];
  }
  function slow(rate, ms){
    try{
      if(reduced() || !document.getAnimations) return false;
      unslow();
      slowS.anims = document.getAnimations().filter(function(a){ var t = a.effect && a.effect.target; return t && !(t.closest && t.closest("#fmeTop,.fmePers")); });
      slowS.anims.forEach(function(a){ try{ a.updatePlaybackRate(rate); }catch(e){} });
      slowS.t = setTimeout(unslow, ms); return true;
    }catch(e){ warn(e); return false; }
  }
  var fx = { burst: function(x, y, n, o){ if(ensure()) burst(x, y, n, o); }, ring: function(x, y){ if(ensure()) ring(x, y); }, box: function(){ return ensure() ? box() : { w: 360, h: 560, l: 0, t: 0 }; },
    damPoint: function(){ return ensure() ? damPoint() : { x: 180, y: 140, s: 100 }; }, slow: slow, unslow: unslow, shake: function(a, ms){ shake(a, ms); },
    top: function(){ ensure(); placeTop(); return topEl; }, charImage: charImage, quality: quality, reduced: reduced, othersSpeaking: othersSpeaking };

  /* ------------------------------------------------------------------ MILESTONE FLOW LEVEL (5 MORE … ONE MORE): the environment builds toward the finish */
  function lvSync(){
    var L = 0; try{ L = (typeof state !== "undefined" && state) ? state.level : 0; }catch(e){}
    if(lv.id !== String(L)){ lv.id = String(L); lv.maxStreak = 0; lv.fails = 0; lv.minRem = 1e9; lv.finalRem = 0; lv.days = 0; lv.oneMoreAt = 0; }
  }
  function markOneMore(){ lv.oneMoreAt = now(); }
  function levelPerf(){
    lvSync(); var st = {}; try{ st = (typeof state !== "undefined" && state) || {}; }catch(e){}
    return { level: st.level | 0, completed: st.completedLevels | 0, first: (st.completedLevels | 0) <= 1, maxCombo: lv.maxStreak, fails: lv.fails,
      minRemMs: lv.minRem === 1e9 ? 0 : lv.minRem, finalRemMs: lv.finalRem, days: lv.days };
  }
  function flowDrip(){
    if(!root || cine.active || !fl.level) return;
    var d = damPoint(), n = fl.level >= 4 ? 2 : 1, spd = 1 - fl.level * .09;
    for(var i = 0; i < n; i++){
      var a = rand(-1, 1);
      particle(d.x + rand(-d.s * .35, d.s * .35), d.y + d.s * .2, { cls: Math.random() < .4 ? "foam" : "", dx: Math.sin(a) * rand(30, 70 + fl.level * 14), dy: rand(34, 90), my: -rand(12, 36 + fl.level * 6), sz: rand(4, 7 + fl.level), dur: rand(520, 820) * spd });
    }
    if(fl.level >= 3){ var w = stationBody(4), r = w && w.getBoundingClientRect ? w.getBoundingClientRect() : null, b = box();
      if(r && r.width > 4) particle(r.left - b.l + r.width / 2 + rand(-r.width * .3, r.width * .3), r.top - b.t + r.height * .5, { cls: "foam", dx: rand(-50, 50), dy: rand(20, 60), my: -rand(10, 30), sz: rand(3, 6), dur: rand(450, 700) * spd }); }
  }
  /* setFlowLevel(0..5): 1 = "5 MORE" … 5 = "ONE MORE". Slightly more water, ambient droplets, faster flow band; at 5 peak anticipation (gold edge pulse + faint tremor). */
  function setFlowLevel(l){
    l = clamp(l | 0, 0, 5);
    if(!root && !l) return; if(!ensure()) return;
    var was = fl.level; fl.level = l; applyPW();
    root.classList.toggle("ant", l >= 5);
    world.classList.toggle("fmeAnticip", l >= 5 && !reduced());
    root.style.setProperty("--fme-fl", String(l));
    fxT.clear(fl.tick); fl.tick = 0;
    if(l >= 1 && !reduced()) fl.tick = fxT.every(flowDrip, Math.max(170, 640 - l * 100));
    if(l >= 2 && l > was && !reduced()){ root.style.setProperty("--fme-glow", l >= 5 ? "rgba(255,214,90,.75)" : "rgba(80,190,255,.6)"); retrigger(pulseEl, "go"); }
  }

  /* ------------------------------------------------------------------ LEVEL COMPLETE SEQUENCE: stabilise → controlled release → wheel reacts → ONE victory voice → LEVEL COMPLETE! → card */
  var vc = { active: false, id: 0, onCard: null, skippable: false }, vcT = Timers();
  register("stabilized", { emoji: "🧱", text: "DAM STABILIZED", tier: "good", top: 30, ms: 950 });
  register("release",    { emoji: "💧", text: "CONTROLLED RELEASE", tier: "good", top: 30, ms: 950 });
  register("power",      { emoji: "⚙️", text: "POWER ON!", tier: 3, top: 30, ms: 950 });
  function vcWait(ms){ return new Promise(function(res){ vcT.later(function(){ res(true); }, ms); }); }
  function vcClean(){
    vcT.clearAll(); vc.skippable = false;
    var w = stationBody(4), m = stationBody(5); if(w) w.classList.remove("fmeSpinSlow"); if(m) m.classList.remove("fmeGlow");
    if(root) root.classList.remove("skippable", "calm");
    document.removeEventListener("visibilitychange", vcHidden);
  }
  function vcFinish(){
    if(!vc.active) return; vc.active = false;
    var cb = vc.onCard; vc.onCard = null; vc.id++; vcClean();
    try{ cb && cb(); }catch(e){ warn(e); }
  }
  function vcHidden(){ if(document.hidden) vcFinish(); }
  function levelComplete(opts){
    try{
      opts = opts || {};
      if(!enabled || cine.active || vc.active || typeof opts.onCard !== "function" || !ensure()) return false;
      var perf = levelPerf(); emit("level", { perf: perf }); unslow(); lv.id = ""; lv.oneMoreAt = 0;
      pressureOff(); setFlowLevel(0); clearCallout();
      vc.active = true; vc.onCard = opts.onCard; vc.skippable = false; var id = ++vc.id, A = function(){ return vc.active && vc.id === id; };
      document.addEventListener("visibilitychange", vcHidden);
      vcT.later(function(){ if(A()) vcFinish(); }, 9000);              // never trap the player before the Level Complete card
      (async function(){
        var b = box(), d = damPoint(), rm = reduced(), k = rm ? .6 : 1;
        /* STEP 2 — stabilise */
        root.classList.add("calm"); ring(d.x, d.y); noise(.5, 200, 500, .06); tone(392, .25, "sine"); trigger("stabilized", { gap: 0, cooldown: 0 });
        await vcWait(560 * k); if(!A()) return;
        /* STEP 3 — controlled water release */
        trigger("release", { gap: 0, cooldown: 0 }); noise(.9, 300, 1200, .09);
        var until = now() + 900; var rid = vcT.every(function(){ if(now() > until){ vcT.clear(rid); return; } var q = damPoint(); particle(q.x + rand(-q.s * .3, q.s * .3), q.y + q.s * .25, { cls: "foam", dx: rand(-26, 26), dy: rand(70, 150), my: rand(0, 16), sz: rand(5, 9), dur: rand(600, 900) }); }, 90);
        await vcWait(560 * k); if(!A()) return;
        /* STEP 4 — waterwheel + factory react */
        var w = stationBody(4), m = stationBody(5); if(w && !rm) w.classList.add("fmeSpinSlow"); if(m && !rm) m.classList.add("fmeGlow");
        trigger("power", { gap: 0, cooldown: 0 }); tone(523, .12, "triangle"); tone(659, .12, "triangle", .1); tone(784, .2, "triangle", .2);
        vc.skippable = true; vcT.later(function(){ if(A() && root) root.classList.add("skippable"); }, 300);
        await vcWait(520 * k); if(!A()) return;
        /* STEP 5/6 — ONE victory voice + a big LEVEL COMPLETE! */
        var LCV = window.LevelCompleteVoiceEngine, pick = null, vp = null;
        try{ if(LCV){ pick = LCV.pick(perf); vp = LCV.speak(pick); } }catch(e){ warn(e); }
        callout({ key: "levelComplete", emoji: "🌊", text: "LEVEL COMPLETE!", sub: pick ? pick.text : "", tier: 5, top: 34, ms: 2300, cooldown: 0, gap: 0, wave: true, cls: "lc" });
        burst(b.w / 2, b.h * .34, 30, { cls: "spk", spread: 220, up: 110, fall: 120, min: 5, max: 12, durMax: 1400 });
        burst(b.w / 2, b.h * .34, 16, { spread: 200, up: 90, fall: 100 });
        noise(.9, 300, 1800, .09); tone(784, .2, "triangle", .05); tone(988, .2, "triangle", .2); tone(1318, .4, "triangle", .36);
        announce("Level complete! " + (pick ? pick.text : ""));
        await Promise.all([vcWait(1100 * k), vp ? Promise.race([vp, vcWait(2400)]) : null]); if(!A()) return;
        await vcWait(150); if(!A()) return;
        /* STEP 7–10 — rewards, XP, unlocks and CONTINUE → are the Level Complete card */
        vcFinish();
      })().catch(function(e){ warn(e); vcFinish(); });
      return true;
    }catch(e){ warn(e); vc.active = false; vcClean(); return false; }
  }

  /* ------------------------------------------------------------------ public API */
  function state(){ return { version: VERSION, enabled: enabled, cinematic: cine.active, plan: cine.plan, cardShown: cine.cardShown, skippable: cine.skippable, pressure: { on: pr.on, stage: pr.stage, fired: Object.keys(pr.fired) },
    streak: co.streak, transition: !!window.__GEI_TRANSITION__, flowLevel: fl.level, levelComplete: vc.active, voice: lane.cur ? { id: lane.cur.id, pri: lane.cur.pri } : null, voiceLog: lane.log.slice(), particles: liveP, timers: fxT.count() + cineT.count() }; }
  function selfTest(){
    var r = []; function t(n, f){ var ok = false; try{ ok = !!f(); }catch(e){} r.push({ name: n, ok: ok }); }
    t("dom mounts inside the world", function(){ return ensure() && root.parentNode === world; });
    t("one voice lane / priorities ordered", function(){ return PRI.milestone < PRI.nextChallenge && PRI.nextChallenge < PRI.achievement && PRI.cinematic < PRI.levelComplete && PRI.levelComplete < PRI.oneMore && PRI.oneMore < PRI.warning && PRI.warning < PRI.milestone && PRI.milestone < PRI.achievement && PRI.achievement < PRI.personality && PRI.personality < PRI.reaction; });
    t("all twelve clips use the supplied CDN", function(){ return Object.keys(CLIPS).length === 12 && Object.keys(CLIPS).every(function(k){ return /^https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/.+\.mp3$/.test(urlOf(k)); }); });
    t("too-much-flow uses the corrected URL", function(){ return urlOf("toomuch") === "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/too-much-flow-8Yz9tQO0XI2GCwby.mp3"; });
    t("combo ladder", function(){ return COMBO[2].text === "FLOW COMBO" && COMBO[3].text === "HYDRAULIC SURGE" && COMBO[5].text === "MAXIMUM FLOW" && COMBO[7].text === "PRESSURE BOOST" && COMBO[10].text === "DAM-ITE OVERDRIVE"; });
    t("comedy chance within 10–20 %", function(){ return config.comedyChance >= .1 && config.comedyChance <= .2; });
    return r;
  }
  var API = {
    version: VERSION, config: config, clips: CLIPS, priorities: PRI,
    callout: callout, combo: combo, register: register, trigger: trigger,
    sync: sync, reset: reset, dayComplete: dayComplete, tap: tap, fx: fx, levelComplete: levelComplete, setFlowLevel: setFlowLevel, claimCombo: claimCombo, markOneMore: markOneMore, levelPerf: levelPerf, clearCallout: clearCallout,
    failure: failure, recover: recover, abort: abort, skip: skip,
    say: say, stopVoice: stopVoice, voiceBusy: voiceBusy, warm: warm,
    setEnabled: function(v){ enabled = !!v; if(!enabled) recover(); },
    state: state, selfTest: selfTest,
    _test: { makePlan: makePlan, setRandom: function(f){ Math.random = f; }, ensure: ensure, damPoint: damPoint, COMBO: COMBO, WARN: WARN }
  };
  window.FlowMomentEngine = API; window.GEI_FLOW_MOMENT = API;

  window.addEventListener("pagehide", function(){ try{ vcClean(); endCine(false); stopVoice(); releaseWarm(); }catch(e){} });
  document.addEventListener("click", function(e){ if(((cine.active && cine.skippable) || (vc.active && vc.skippable)) && root && root.contains(e.target)) skip(); }, true);
  document.addEventListener("keydown", function(e){ if(((cine.active && cine.skippable) || (vc.active && vc.skippable)) && (e.key === "Enter" || e.key === " " || e.key === "Escape")) skip(); });
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensure, { once: true }); else ensure();
})();
