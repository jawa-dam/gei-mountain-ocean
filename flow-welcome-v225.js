/* V2.2.5 — LEAKING DAM WELCOME EXPERIENCE 💧🧱🌊
 * (extends the V2.2.4 Flow Welcome Effect — one module, no second animation framework)
 *
 * The existing Beaver welcome card (beaver-welcome-v2190.js) becomes a miniature living dam under hydraulic pressure:
 *
 *   ┌ reservoir ┐   water held behind the dam: waves, reflections, caustics, a slowly changing level
 *   │  DAM FACE │   the card itself — concrete seams, damp zones, hairline cracks, wet runs that dry back
 *   └─ spillway ┘   leaks drip / stream / split / overflow into a pool whose surface stays subtly alive
 *
 * HYDRAULIC PRESSURE CYCLE (varies every cycle, every page load):
 *   calm → rising → pressure → seepage → leaks → [hold] → release → splash → ripple → reset
 * Rare WOW release: the level rises, tiny leaks glisten, the system HOLDS… then a controlled whoosh.
 *
 * It attaches to the EXISTING #geiWelcome overlay. The welcome copy, buttons, dismissal, character selection and
 * game flow are untouched. Everything is DOM + SVG + CSS transforms (no video, no library, no per-frame JS):
 *   • ≤ ~18 transient FX nodes, ~30 static nodes, 4 SVG wave paths, 3 tiled caustic layers (one raster each)
 *   • the scheduler is a handful of timeouts per cycle; it pauses while the tab is hidden; after 6 cycles it
 *     settles into calm (surfaces keep their gentle motion, nothing else runs)
 *   • prefers-reduced-motion: static wet surface, one static drop, a minimal ripple, no cycle, no releases
 * Audio reuses damVoice / damNoise (SFX bus → master volume + mute); only when audio is already unlocked or the player
 * tapped; every sound is throttled; visuals never depend on sound.
 * The player's ACTIVE character notices the leak and reacts (short chips, never the default beaver by assumption).
 *
 * Presentation only: never reads or writes progress, FL OZ, XP, purchases, entitlements, ownership or storage.
 */
(function(){
  "use strict";
  if(window.__GEI_FLOW_WELCOME__) return;
  var VERSION = "V2.2.5";
  var PID = "geiWelcome";

  /* ---------- water tones: ~86% natural, ~14% WOW ---------- */
  var NATURAL = [
    { id:"cyan",       b:"#2fd2ff", d:"#03203f", f:"#eafcff", w:4 },
    { id:"clear-blue", b:"#4db8ff", d:"#0a3f7a", f:"#eefaff", w:3 },
    { id:"aqua",       b:"#4ee6d8", d:"#06454a", f:"#eafffb", w:2 },
    { id:"deep-blue",  b:"#3d8bea", d:"#07305f", f:"#e8f3ff", w:2 }
  ];
  var WOW = [
    { id:"blue-violet", b:"#8a8cff", d:"#25267f", f:"#f1efff", w:1, wow:true },
    { id:"luminous",    b:"#bff6ff", d:"#0b5d8f", f:"#ffffff", w:1, wow:true, glow:1 }
  ];
  var WOW_CHANCE = .14;

  /* ---------- hydraulic personalities (behavior varies, composition and usability never do) ---------- */
  var BASE = { calm:1, rise:1, press:1, seep:1, leak:1, nSeep:3, leakN:3, leaks:["micro","drip","thin"], rel:"thin",
               wowFrom:2, lvl0:.42, lvl1:.78, notice:false, bigRipple:false, multi:false };
  var PERS = {
    A:{ name:"slow seepage",          seep:1.7, leak:.9, nSeep:5, leakN:2, leaks:["micro","micro","drip"], rel:"thin" },
    B:{ name:"several small drips",   seep:.9, nSeep:3, leakN:5, leaks:["drip","drip","micro","drip","drip"], rel:"thin", wowFrom:3 },
    C:{ name:"one thin stream",       nSeep:2, leakN:1, leaks:["thin"], rel:"thin" },
    D:{ name:"multiple leaks",        nSeep:3, leakN:4, leaks:["drip","thin","drip","split"], multi:true, rel:"heavy" },
    E:{ name:"slow reservoir rise",   rise:2.1, lvl1:.9, nSeep:3, leakN:3, leaks:["micro","drip","thin"], rel:"heavy", wowFrom:2 },
    F:{ name:"rare larger release",   nSeep:3, leakN:2, leaks:["drip","thin"], wowFrom:0 },
    G:{ name:"character notices first", notice:true, nSeep:3, leakN:3, leaks:["micro","drip","thin"], rel:"thin" },
    H:{ name:"large ripple event",    bigRipple:true, nSeep:2, leakN:3, leaks:["drip","thin","split"], rel:"overflow", wowFrom:3 }
  };
  var VARIATIONS = Object.keys(PERS);
  function pers(v){ var o = {}, k; for(k in BASE) o[k] = BASE[k]; for(k in PERS[v] || {}) o[k] = PERS[v][k]; o.id = v; return o; }

  /* leak sites on the dam face: x = where water leaves the bottom edge (% of card width) */
  var SITES = [
    { id:"L", x:5.6,  run:"M2.8 34 L2.8 88 Q2.8 97 5.6 100", crack:"M2.2 33 l1.3 2.2 l-1 2 l1.2 2.4" },
    { id:"a", x:24,   run:"M24 96 L24 100",                 crack:"M23.2 92.8 l1 1.3 l-.8 1.2" },
    { id:"b", x:38,   run:"M38 96 L38 100",                   crack:"M37.2 93.2 l1 1.3 l-.8 1.2" },
    { id:"c", x:50,   run:"M50 96 L50 100",                   crack:"M49.2 92.4 l1.1 1.3 l-.8 1.3" },
    { id:"d", x:62,   run:"M62 96 L62 100",                   crack:"M61.2 93.2 l1 1.3 l-.8 1.2" },
    { id:"e", x:76,   run:"M76 96 L76 100",                 crack:"M75.2 92.8 l1 1.3 l-.8 1.2" },
    { id:"R", x:94.4, run:"M97.2 40 L97.2 88 Q97.2 97 94.4 100", crack:"M96.6 39 l1.3 2.2 l-1 2 l1.2 2.4" }
  ];
  var LIP = 3;   // index of the spillway lip site (x 50)

  var CHIPS = {
    notice:["Is that a drip? 💧","Look at that!","The water is moving!"],
    leak:["The water is moving!","Look at that!","Hmm… a leak! 💧"],
    release:["Whoa!","Look at that!","LET'S FOLLOW IT!"],
    wow:["WHOA!","What was THAT?!","LET'S FOLLOW IT!"],
    tap:["The water likes you! 💧","Splash!","Ooh, it moves!"]
  };
  var NOTES = [
    "Water pushes against the walls of a dam. Engineers design dams to safely manage that force.",
    "Deeper water pushes harder, so many dams are thickest at the bottom.",
    "Tiny leaks are called seepage. Engineers watch for them and drain them safely.",
    "A spillway is a safe path that lets extra water leave the reservoir.",
    "Water that leaves the dam keeps moving downstream, carrying energy with it.",
    "Later in the game, moving water can spin a turbine and help make electricity. ⚡"
  ];

  var MAX_FX = 18, MAX_CYCLES = 6, TAP_GAP = 140;
  var S = { root:null, wrap:null, res:null, face:null, stage:null, fx:null, rings:null, cap:null, say:null, note:null, info:null,
            mode:"", timers:[], active:0, taps:0, lastTap:0, cycles:0, running:false, reduced:false, variation:"A", pers:null,
            tone:null, begin:0, capT:0, sayT:0, lastSay:0, forced:null, time:1, phase:"", level:.42, damp:0, noteIdx:0, noteT:0,
            sndAt:{}, lastSnd:0, wowAt:-9, listeners:false };

  /* ---------- helpers ---------- */
  function $(sel, ctx){ return (ctx || document).querySelector(sel); }
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function rint(a, b){ return Math.floor(rnd(a, b + 1)); }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function later(fn, ms){
    var id = setTimeout(function(){
      var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1);
      try{ fn(); }catch(e){}
    }, Math.max(0, ms));
    S.timers.push(id);
    return id;
  }
  /* timeline step: scaled by S.time (tests), deferred while the tab is hidden */
  function at(ms, fn){
    later(function run(){
      if(!S.running) return;
      if(document.hidden){ later(run, 600); return; }
      fn();
    }, ms * S.time);
  }
  function make(cls, parent, css, tag){
    var el = document.createElement(tag || "i");
    el.className = cls;
    if(css) el.style.cssText = css;
    if(parent) parent.appendChild(el);
    return el;
  }
  var NS = "http://www.w3.org/2000/svg";
  function pickWeighted(list){
    var t = 0, i; for(i = 0; i < list.length; i++) t += list[i].w;
    var r = Math.random() * t;
    for(i = 0; i < list.length; i++){ r -= list[i].w; if(r <= 0) return list[i]; }
    return list[0];
  }
  function pickTone(){ return Math.random() < WOW_CHANCE ? pickWeighted(WOW) : pickWeighted(NATURAL); }
  function muted(){ try{ return !!(window.GEI_AUDIO && window.GEI_AUDIO.muted); }catch(e){ return false; } }
  function setVar(el, k, v){ if(el) el.style.setProperty(k, v); }

  /* ---------- hydraulic audio: the game's own synth voices; short, quiet, throttled ---------- */
  var GAP = { drip:650, seep:900, trickle:2400, splash:380, whoosh:7000, ripple:1100, activate:600 };
  function jit(v){ return v * rnd(.93, 1.08); }
  function sound(kind, gesture){
    if(muted() || (document.hidden && !gesture)) return;
    var voice = window.damVoice, noise = window.damNoise;
    if(typeof voice !== "function" && typeof noise !== "function") return;
    var t = Date.now();
    if(!gesture && (t - (S.sndAt[kind] || 0) < (GAP[kind] || 400) || t - S.lastSnd < 160)) return;
    S.sndAt[kind] = t; S.lastSnd = t;
    var g = !!gesture, V = typeof voice === "function", N = typeof noise === "function";
    try{
      switch(kind){
        case "drip":    if(V) voice({ freq:jit(1180), to:jit(640), time:.08, gain:.008, type:"sine", gesture:g, priority:0 }); break;
        case "seep":    if(N) noise({ dur:.11, from:jit(3200), to:2200, gain:.0035, filter:"bandpass", q:2, gesture:g }); break;
        case "trickle": if(N) noise({ dur:.65, from:jit(1100), to:1900, gain:.0055, filter:"bandpass", q:1.4, gesture:g }); break;
        case "splash":
          if(N) noise({ dur:.26, from:jit(1500), to:700, gain:.011, filter:"bandpass", q:.9, gesture:g });
          if(V) voice({ freq:jit(520), to:260, time:.13, gain:.007, delay:.02, type:"sine", gesture:g, priority:0 });
          break;
        case "whoosh":
          if(N){ noise({ dur:.7, from:220, to:1250, gain:.012, filter:"lowpass", gesture:g });
                 noise({ dur:.9, from:1250, to:260, gain:.009, filter:"lowpass", delay:.55, gesture:g }); }
          break;
        case "ripple":  if(V) voice({ freq:jit(330), to:290, time:.3, gain:.004, type:"sine", gesture:g, priority:0 }); break;
        case "activate":
          if(V){ voice({ freq:660, time:.1, gain:.009, gesture:g, priority:0 }); voice({ freq:990, time:.16, gain:.008, delay:.08, gesture:g, priority:0 }); }
          break;
      }
    }catch(e){}
  }

  /* ---------- textures (tiny tiled SVG rasters: painted once, no per-frame cost) ---------- */
  function uri(svg){ return "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")"; }
  var TEX = {
    noise: "<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .62  0 0 0 0 .78  0 0 0 0 .88  0 0 0 .10 0'/></filter><rect width='140' height='140' filter='url(#n)'/></svg>",
    blocks:"<svg xmlns='http://www.w3.org/2000/svg' width='132' height='88'><g fill='none' stroke='rgba(157,234,255,.075)' stroke-width='1'><path d='M0 .5H132M0 44.5H132M33.5 0V44M99.5 44V88'/></g><g fill='none' stroke='rgba(255,255,255,.035)' stroke-width='1'><path d='M0 1.5H132M0 45.5H132M34.5 0V44M100.5 44V88'/></g></svg>",
    caus:  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='c' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='.017 .027' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 0 1 0 0 0 0 0'/></feComponentTransfer></filter><rect width='180' height='180' filter='url(#c)'/></svg>"
  };

  /* ---------- styles ---------- */
  function css(){
    if(document.getElementById("geiFlowWelcome225Style")) return;
    var s = document.createElement("style");
    s.id = "geiFlowWelcome225Style";
    var R = "#" + PID, W = R + " .gwDam";
    var cm = function(c, p){ return "color-mix(in srgb,var(" + c + ") " + p + "%,transparent)"; };
    s.textContent = [
      /* ===== layout: [reservoir][dam face = existing card][spillway lip + falling zone + pool]. Fixed heights → no layout jumping ===== */
      R+"{--gwResH:clamp(22px,5.2dvh,36px);--gwSpillH:clamp(30px,6.6dvh,46px);--gwPoolH:clamp(28px,5.8dvh,40px);--gwStageH:calc(var(--gwSpillH) + var(--gwPoolH));"+
        "--gw-b:#2fd2ff;--gw-d:#03203f;--gw-f:#eafcff;--gw-noise:"+uri(TEX.noise)+";--gw-blocks:"+uri(TEX.blocks)+";--gw-caus:"+uri(TEX.caus)+";"+
        "flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}",
      "@media (min-width:700px){"+R+"{justify-content:center}}",
      "@media (max-height:480px){"+R+"{--gwResH:18px;--gwSpillH:30px;--gwPoolH:28px}"+R+" .gwCrk,"+R+" .gwBead{display:none}}",   /* short viewports: the card scrolls, so keep the overlay off its content */
      W+"{position:relative;flex:0 1 auto;width:min(100%,440px);min-height:0;display:flex;flex-direction:column;transform:translateY(40px) scale(.97);transition:transform .55s cubic-bezier(.2,.9,.25,1.15)}",
      R+".show .gwDam{transform:none}",
      R+" .gwCard,"+R+".show .gwCard{transform:none;transition:none;width:100%;flex:0 1 auto;max-height:calc(100dvh - 40px - var(--gwResH) - var(--gwStageH));cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;"+
        "background:var(--gw-noise),var(--gw-blocks),radial-gradient(120% 60% at 50% 100%,"+cm("--gw-b",10)+",transparent 70%),linear-gradient(160deg,rgba(9,34,62,.97),rgba(6,16,34,.98) 60%,rgba(20,12,44,.97));"+
        "border-radius:0 0 26px 26px;border-top-color:"+cm("--gw-b",50)+";"+
        "box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 34px "+cm("--gw-b",16)+",inset 0 1px 0 rgba(255,255,255,.1),inset 0 -10px 18px rgba(0,0,0,.28),inset 3px 0 0 rgba(255,255,255,.03),inset -3px 0 0 rgba(0,0,0,.18)}",
      R+" .gwCard::before{border-radius:0}",
      R+" .gwCard button,"+R+" .gwCard label{cursor:pointer}",
      R+" .gwCard::after{content:'';position:absolute;left:22px;right:22px;bottom:6px;height:2px;border-radius:2px;pointer-events:none;"+
        "background:linear-gradient(90deg,transparent,"+cm("--gw-b",55)+" 14%,"+cm("--gw-b",55)+" 41%,transparent 43%,transparent 57%,"+cm("--gw-b",55)+" 59%,"+cm("--gw-b",55)+" 86%,transparent)}",

      /* ===== reservoir (water held behind the dam) ===== */
      R+" .gwRes{position:relative;flex:0 0 auto;height:var(--gwResH);margin-bottom:-1px;border-radius:20px 20px 0 0;overflow:hidden;contain:layout paint;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;"+
        "background:linear-gradient(180deg,rgba(4,14,30,.9),"+cm("--gw-d",90)+");border:1px solid "+cm("--gw-b",34)+";border-bottom:0;box-shadow:inset 0 0 14px rgba(0,0,0,.45)}",
      R+" .gwRes .gwWater{position:absolute;left:0;right:0;top:0;bottom:0;transform:translateY(calc((1 - var(--lvl,.42)) * 78%));transition:transform var(--lvlT,3s) cubic-bezier(.4,0,.2,1);"+
        "background:linear-gradient(180deg,"+cm("--gw-b",52)+","+cm("--gw-d",92)+" 85%)}",
      R+" .gwWaves{position:absolute;left:0;top:-9px;width:200%;height:13px;will-change:transform}",
      R+" .gwWaves path{vector-effect:none}",
      R+" .gwW1{animation:gwfxWave 10s linear infinite}",
      R+" .gwW2{animation:gwfxWave 16s linear infinite reverse;opacity:.7;top:-6px}",
      R+" .gwCaus{position:absolute;left:-30%;top:-30%;width:160%;height:160%;background:var(--gw-caus);background-size:150px 150px;opacity:.16;will-change:transform;pointer-events:none}",
      R+" .gwCaus.c1{animation:gwfxCaus1 22s linear infinite}",
      R+" .gwCaus.c2{background-size:96px 96px;opacity:.1;animation:gwfxCaus2 31s linear infinite}",
      R+" .gwRefl{position:absolute;top:0;bottom:0;left:-30%;width:26%;background:linear-gradient(100deg,transparent,"+cm("--gw-f",18)+",transparent);transform:skewX(-18deg);animation:gwfxRefl 13s ease-in-out infinite;pointer-events:none;will-change:transform}",
      R+" .gwResRing{position:absolute;top:var(--ry,8px);left:var(--x,50%);width:70px;height:12px;border-radius:50%;border:1.5px solid "+cm("--gw-f",70)+";opacity:0;transform:translate(-50%,-50%) scale(.2);animation:gwfxResRing 1.3s ease-out forwards}",
      R+".gwPressure .gwRes{box-shadow:inset 0 0 14px rgba(0,0,0,.45),0 6px 16px "+cm("--gw-b",30)+";animation:gwfxPress 2.4s ease-in-out infinite}",

      /* ===== dam face overlay (non-scrolling frame over the card) ===== */
      R+" .gwFace{position:absolute;left:0;right:0;bottom:0;top:var(--gwResH);border-radius:0 0 26px 26px;overflow:hidden;pointer-events:none;z-index:3;contain:layout paint}",
      R+" .gwDamp{position:absolute;inset:0;opacity:var(--damp,0);transition:opacity var(--dampT,.9s) ease;"+
        "background:linear-gradient(90deg,rgba(0,8,20,.34),transparent 9%,transparent 91%,rgba(0,8,20,.34)),linear-gradient(0deg,rgba(0,8,20,.3),transparent 22%),linear-gradient(0deg,"+cm("--gw-b",10)+",transparent 12%)}",
      R+" .gwRuns{position:absolute;inset:0;width:100%;height:100%;overflow:visible}",
      R+" .gwRuns path{fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}",
      R+" .gwCrk{position:absolute;width:8px;height:14px;margin:-2px 0 0 -4px}",
      R+" .gwCrk svg{display:block;overflow:visible}",
      R+" .gwCrk path{fill:none;stroke-linecap:round;stroke-linejoin:round}",
      R+" .gwCr{stroke:rgba(0,6,16,.6);stroke-width:1.1;opacity:.85}",
      R+" .gwGl{stroke:var(--gw-f);stroke-width:1.3;opacity:0;filter:drop-shadow(0 0 2px var(--gw-b))}",
      R+" .gwGl.on{animation:gwfxGlint 2.6s ease-in-out infinite}",
      R+" .gwRWet{stroke:rgba(0,10,26,.5);stroke-width:5;stroke-dasharray:1;stroke-dashoffset:1;opacity:0}",
      R+" .gwRHi{stroke:var(--gw-f);stroke-width:1.6;stroke-dasharray:1;stroke-dashoffset:1;opacity:0;filter:drop-shadow(0 0 2px "+cm("--gw-b",70)+")}",
      R+" .gwRWet.run{animation:gwfxRun var(--rt,1.4s) cubic-bezier(.45,0,.9,.6) forwards,gwfxWetDry 17s ease-out forwards}",
      R+" .gwRHi.run{animation:gwfxRun var(--rt,1.4s) cubic-bezier(.45,0,.9,.6) forwards,gwfxHiDry 9s ease-out forwards}",
      R+" .gwBead{position:absolute;width:5px;height:6px;margin:-3px 0 0 -2.5px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;opacity:0;"+
        "background:radial-gradient(circle at 35% 30%,var(--gw-f),var(--gw-b) 55%,var(--gw-d));animation:gwfxBead 1.7s ease-in-out forwards}",

      /* ===== stage: spillway lip + falling zone + pool ===== */
      R+" .gwStage{position:relative;flex:0 0 auto;width:min(100%,440px);height:var(--gwStageH);margin-top:-1px;pointer-events:none}",
      R+" .gwLip{position:absolute;left:50%;top:0;width:58px;height:13px;transform:translateX(-50%);border-radius:0 0 16px 16px;"+
        "background:linear-gradient(180deg,rgba(9,28,52,.97),rgba(6,16,34,.97));border:1px solid "+cm("--gw-b",34)+";border-top:0;box-shadow:0 6px 14px "+cm("--gw-b",24)+"}",
      R+" .gwLip::after{content:'';position:absolute;left:30%;right:30%;bottom:2px;height:3px;border-radius:3px;background:"+cm("--gw-b",70)+";opacity:.5;transition:opacity .5s ease}",
      R+".gwFlowing .gwLip::after,"+R+".gwPressure .gwLip::after{opacity:1}",
      R+" .gwFx{position:absolute;left:0;right:0;top:0;height:var(--gwSpillH)}",
      R+" .gwPool{position:absolute;left:0;right:0;bottom:0;height:var(--gwPoolH);border-radius:18px 18px 24px 24px;overflow:hidden;contain:layout paint;pointer-events:auto;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;"+
        "background:linear-gradient(180deg,rgba(6,18,38,.97),"+cm("--gw-d",92)+");border:1px solid "+cm("--gw-b",40)+";box-shadow:inset 0 0 20px "+cm("--gw-b",16)+",0 0 24px "+cm("--gw-b",14)+"}",
      R+" .gwPool .gwWater{position:absolute;left:0;right:0;top:0;bottom:0;transform:translateY(var(--pl,34%));transition:transform .9s cubic-bezier(.3,.7,.3,1);"+
        "background:linear-gradient(180deg,"+cm("--gw-b",50)+","+cm("--gw-d",94)+")}",
      R+" .gwSurf{position:absolute;left:8%;right:8%;top:0;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--gw-f),transparent);opacity:.5}",
      R+" .gwGlint{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--gw-f);box-shadow:0 0 6px var(--gw-f);opacity:0;animation:gwfxTwinkle 5s ease-in-out infinite}",
      R+" .gwRings{position:absolute;inset:0}",
      R+" .gwRing{position:absolute;left:var(--x,50%);top:9px;width:120px;height:22px;border-radius:50%;border:2px solid var(--gw-b);opacity:0;"+
        "box-shadow:0 0 12px "+cm("--gw-b",55)+",inset 0 0 8px "+cm("--gw-f",30)+";transform:translate(-50%,-50%) scale(.15);animation:gwfxRing var(--rd,1.5s) ease-out var(--rdl,0s) forwards}",
      R+" .gwBand{position:absolute;top:0;bottom:0;width:26%;opacity:0;background:linear-gradient(90deg,transparent,"+cm("--gw-f",38)+","+cm("--gw-b",40)+",transparent)}",
      R+" .gwBandR{left:var(--x,50%);animation:gwfxBandR var(--wd,2.3s) ease-out forwards}",
      R+" .gwBandL{right:calc(100% - var(--x,50%));animation:gwfxBandL var(--wd,2.3s) ease-out forwards}",
      R+" .gwCap{position:absolute;left:0;right:0;bottom:7px;text-align:center;font:800 13px/1.2 system-ui,sans-serif;letter-spacing:.09em;color:var(--gw-f);"+
        "text-shadow:0 1px 6px rgba(2,8,20,.95),0 0 10px "+cm("--gw-b",60)+";opacity:0;transform:translateY(4px);transition:opacity .6s ease,transform .6s ease;white-space:nowrap;padding:0 46px;pointer-events:none}",
      R+" .gwCap.on{opacity:1;transform:none}",
      R+".gwLuminous .gwPool,"+R+".gwLuminous .gwRes,"+R+".gwLuminous .gwLip{box-shadow:inset 0 0 22px "+cm("--gw-f",28)+",0 0 30px "+cm("--gw-b",34)+"}",

      /* info indicator + engineer's note (optional, never automatic) */
      R+" .gwInfo{position:absolute;right:0;bottom:-4px;width:44px;height:44px;border:0;padding:0;background:transparent;cursor:pointer;pointer-events:auto;display:grid;place-items:center;z-index:4}",
      R+" .gwInfo span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;font:800 14px/1 system-ui,sans-serif;color:var(--gw-f);border:1px solid "+cm("--gw-f",60)+";background:rgba(2,10,24,.6);box-shadow:0 0 8px "+cm("--gw-b",40)+"}",
      R+" .gwInfo:focus-visible{outline:3px solid #9deaff;outline-offset:-4px;border-radius:12px}",
      R+" .gwNote{position:absolute;inset:0;z-index:5;display:none;align-items:center;gap:10px;padding:6px 12px;border-radius:18px;pointer-events:auto;cursor:pointer;"+
        "background:linear-gradient(160deg,rgba(7,24,46,.985),rgba(4,12,28,.985));border:1px solid "+cm("--gw-b",50)+";color:#eafcff;font:600 14px/1.3 system-ui,sans-serif;overflow:auto}",
      R+" .gwNote.on{display:flex}",
      R+" .gwNote b{flex:0 0 auto;font-size:22px}",
      R+" .gwNote small{display:block;font:800 11px/1.2 system-ui,sans-serif;letter-spacing:.1em;color:"+cm("--gw-b",100)+";margin-bottom:2px}",

      /* character chip (short line; sits over the reservoir, never over the text) */
      R+" .gwSay{position:absolute;left:10px;bottom:4px;max-width:78%;padding:3px 10px;border-radius:13px;background:rgba(2,10,24,.72);border:1px solid "+cm("--gw-f",35)+";"+
        "color:#fff;font:800 13px/1.25 system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transform:translateY(5px) scale(.96);transition:opacity .35s ease,transform .35s ease;z-index:6;pointer-events:none}",
      R+" .gwSay.on{opacity:1;transform:none}",

      /* ===== falling water ===== */
      R+" .gwDrop{position:absolute;left:var(--x,50%);top:0;width:calc(10px*var(--s,1));height:calc(13px*var(--s,1));margin-left:calc(-5px*var(--s,1));"+
        "border-radius:50% 50% 50% 50%/62% 62% 38% 38%;opacity:0;transform-origin:50% 0;"+
        "background:radial-gradient(circle at 35% 30%,var(--gw-f),var(--gw-b) 48%,var(--gw-d) 105%);box-shadow:0 0 8px "+cm("--gw-b",60)+";animation:gwfxDrop var(--dd,1.05s) linear forwards}",
      R+" .gwDrop.fall{animation-name:gwfxFall;animation-duration:var(--dd,.6s)}",
      R+" .gwStream{position:absolute;left:var(--x,50%);top:0;width:var(--w,5px);height:var(--gwSpillH);margin-left:calc(var(--w,5px)/-2);border-radius:3px;opacity:.95;"+
        "background:linear-gradient(90deg,"+cm("--gw-d",70)+",var(--gw-f) 40%,var(--gw-b) 68%,"+cm("--gw-d",70)+");box-shadow:0 0 8px "+cm("--gw-b",55)+";clip-path:inset(0 0 100% 0);animation:gwfxStream var(--sd,1.7s) ease-in-out forwards}",
      R+" .gwStream.wob{animation:gwfxStream var(--sd,1.7s) ease-in-out forwards,gwfxWob .5s ease-in-out infinite}",
      R+" .gwStream.cut{animation-name:gwfxStreamCut}",
      R+" .gwSheet{position:absolute;left:50%;top:0;width:44px;height:var(--gwSpillH);margin-left:-22px;border-radius:6px 6px 14px 14px;opacity:0;transform-origin:50% 0;"+
        "background:linear-gradient(90deg,"+cm("--gw-d",60)+","+cm("--gw-f",78)+" 30%,"+cm("--gw-b",70)+" 70%,"+cm("--gw-d",60)+");box-shadow:0 0 14px "+cm("--gw-b",50)+";animation:gwfxSheet var(--sd,1.9s) ease-in-out forwards}",
      R+" .gwSplash{position:absolute;left:var(--x,50%);top:var(--gwSpillH);width:0;height:0}",
      R+" .gwImpact{position:absolute;left:-14px;top:-5px;width:28px;height:10px;border-radius:50%;border:2px solid "+cm("--gw-f",85)+";opacity:0;animation:gwfxImpact .55s ease-out forwards;transform-origin:50% 50%}",
      R+" .gwMist{position:absolute;left:-30px;top:-22px;width:60px;height:30px;border-radius:50%;opacity:0;background:radial-gradient(ellipse at 50% 80%,"+cm("--gw-f",55)+",transparent 70%);animation:gwfxMist .8s ease-out forwards}",
      R+" .gwSp{position:absolute;left:-2px;top:-2px;width:4px;height:4px;border-radius:50%;opacity:0;background:var(--gw-f);box-shadow:0 0 5px "+cm("--gw-b",70)+";animation:gwfxSp .65s ease-out forwards}",

      /* character reactions on the existing host wrapper */
      R+" .gwBeaver.gwR-look{animation:gwfxLook 1.5s ease-in-out 1}",
      R+" .gwBeaver.gwR-down{animation:gwfxDown 1.3s ease-in-out 1}",
      R+" .gwBeaver.gwR-point{animation:gwfxPoint 1.2s ease-in-out 1}",
      R+" .gwBeaver.gwR-cheer{animation:gwfxCheer 1.1s ease-out 1}",

      /* journey */
      ".gwJourney{position:fixed;inset:0;z-index:99001;overflow:hidden;pointer-events:none}",
      ".gwJourney i{position:absolute;left:50%;width:min(92vw,520px);height:min(26vh,180px);margin-left:calc(min(92vw,520px)/-2);bottom:calc(env(safe-area-inset-bottom) + 24px);opacity:0;border-radius:50%;"+
        "background:radial-gradient(ellipse at 50% 60%,color-mix(in srgb,var(--gw-f,#eafcff) 30%,transparent),color-mix(in srgb,var(--gw-b,#2fd2ff) 22%,transparent) 42%,transparent 70%);animation:gwfxJourney 1.15s ease-out forwards}",

      /* paused (tab hidden / welcome closed): nothing animates */
      R+".gwPaused *,"+R+":not(.show) *{animation-play-state:paused!important}",

      /* ===== keyframes ===== */
      "@keyframes gwfxWave{to{transform:translateX(-50%)}}",
      "@keyframes gwfxCaus1{to{transform:translate3d(150px,60px,0)}}",
      "@keyframes gwfxCaus2{to{transform:translate3d(-96px,48px,0)}}",
      "@keyframes gwfxRefl{0%,40%{transform:translateX(0) skewX(-18deg);opacity:0}55%{opacity:1}100%{transform:translateX(520%) skewX(-18deg);opacity:0}}",
      "@keyframes gwfxPress{0%,100%{filter:brightness(1)}50%{filter:brightness(1.18)}}",
      "@keyframes gwfxResRing{0%{opacity:.8;transform:translate(-50%,-50%) scale(.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(3.6,1.6)}}",
      "@keyframes gwfxGlint{0%,100%{opacity:0}45%,55%{opacity:.95}}",
      "@keyframes gwfxRun{from{stroke-dashoffset:1;opacity:1}to{stroke-dashoffset:var(--reach,0);opacity:1}}",
      "@keyframes gwfxWetDry{0%,25%{opacity:.85}100%{opacity:0}}",
      "@keyframes gwfxHiDry{0%,12%{opacity:.8}100%{opacity:0}}",
      "@keyframes gwfxBead{0%{opacity:0;transform:scale(.2)}25%{opacity:1;transform:scale(1)}80%{opacity:.85;transform:translateY(5px) scale(1.1,1.25)}100%{opacity:0;transform:translateY(9px) scale(.8)}}",
      "@keyframes gwfxTwinkle{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:.85;transform:scale(1)}}",
      "@keyframes gwfxDrop{"+
        "0%{opacity:0;transform:translateY(0) scale(.1)}"+
        "30%{opacity:1;transform:translateY(1px) scale(1,1);animation-timing-function:ease-in-out}"+
        "48%{opacity:1;transform:translateY(4px) scale(.82,1.4);animation-timing-function:cubic-bezier(.5,0,.95,.55)}"+
        "100%{opacity:1;transform:translateY(calc(var(--gwSpillH) - 12px*var(--s,1))) scale(.9,1.18)}}",
      "@keyframes gwfxFall{0%{opacity:1;transform:translateY(var(--y0,0px)) scale(.9,1.3)}100%{opacity:1;transform:translateY(calc(var(--gwSpillH) - 12px*var(--s,1))) scale(.88,1.25)}}",
      "@keyframes gwfxStream{0%{clip-path:inset(0 0 100% 0);opacity:0}26%{clip-path:inset(0 0 0 0);opacity:1}72%{clip-path:inset(0 0 0 0);opacity:1}100%{clip-path:inset(100% 0 0 0);opacity:0}}",
      "@keyframes gwfxStreamCut{0%{clip-path:inset(0 0 100% 0);opacity:0}30%{clip-path:inset(0 0 40% 0);opacity:1}52%{clip-path:inset(0 0 40% 0);opacity:1}100%{clip-path:inset(100% 0 0 0);opacity:0}}",
      "@keyframes gwfxWob{0%,100%{transform:translateX(-.5px)}50%{transform:translateX(.6px)}}",
      "@keyframes gwfxSheet{0%{opacity:0;transform:scaleY(.05)}22%{opacity:.9;transform:scaleY(1)}70%{opacity:.9;transform:scaleY(1)}100%{opacity:0;transform:scaleY(1) translateY(6px)}}",
      "@keyframes gwfxImpact{0%{opacity:.95;transform:scale(.3)}100%{opacity:0;transform:scale(2.4,2)}}",
      "@keyframes gwfxMist{0%{opacity:0;transform:scale(.5)}30%{opacity:.7}100%{opacity:0;transform:translateY(-6px) scale(1.4)}}",
      "@keyframes gwfxSp{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}45%{transform:translate(calc(var(--dx)*.6),var(--dy))}100%{opacity:0;transform:translate(var(--dx),calc(var(--dy)*.1 + 6px))}}",
      "@keyframes gwfxRing{0%{opacity:.9;transform:translate(-50%,-50%) scale(.15)}100%{opacity:0;transform:translate(-50%,-50%) scale(var(--rx,3),var(--ry,1.4))}}",
      "@keyframes gwfxBandR{0%{opacity:0;transform:translateX(-60%)}20%{opacity:.9}100%{opacity:0;transform:translateX(var(--wxr,190%))}}",
      "@keyframes gwfxBandL{0%{opacity:0;transform:translateX(60%)}20%{opacity:.9}100%{opacity:0;transform:translateX(calc(var(--wxl,190%)*-1))}}",
      "@keyframes gwfxLook{0%,100%{transform:none}25%,70%{transform:translate(calc(3px*var(--gwAmp,1)),calc(1px*var(--gwAmp,1))) rotate(calc(7deg*var(--gwAmp,1)))}}",
      "@keyframes gwfxDown{0%,100%{transform:none}35%,65%{transform:translate(calc(3px*var(--gwAmp,1)),calc(4px*var(--gwAmp,1))) rotate(calc(10deg*var(--gwAmp,1))) scaleY(.97)}}",
      "@keyframes gwfxPoint{0%,100%{transform:none}30%{transform:translate(calc(6px*var(--gwAmp,1)),0) rotate(calc(9deg*var(--gwAmp,1)))}50%{transform:translate(calc(4px*var(--gwAmp,1)),calc(-3px*var(--gwAmp,1))) rotate(calc(5deg*var(--gwAmp,1)))}70%{transform:translate(calc(6px*var(--gwAmp,1)),0) rotate(calc(9deg*var(--gwAmp,1)))}}",
      "@keyframes gwfxCheer{0%,100%{transform:none}25%{transform:translateY(calc(-9px*var(--gwAmp,1))) scale(1.04)}50%{transform:none}75%{transform:translateY(calc(-6px*var(--gwAmp,1)))}}",
      "@keyframes gwfxJourney{0%{opacity:0;transform:translateY(0) scale(.7)}25%{opacity:.85}100%{opacity:0;transform:translateY(-34vh) scale(1.25)}}",

      /* ===== reduced motion: static wet surface, one static drop, minimal ripple, no cycle ===== */
      "@media (prefers-reduced-motion:reduce){"+
        W+" *,"+R+" .gwStage *{animation:none!important}"+
        R+" .gwDam{transform:none}"+
        R+" .gwCaus,"+R+" .gwRefl,"+R+" .gwBand,"+R+" .gwStream,"+R+" .gwSheet,"+R+" .gwSplash,"+R+" .gwGlint{display:none!important}"+
        R+" .gwStage .gwRing{opacity:0;transform:translate(-50%,-50%) scale(2.2,1)!important;transition:opacity .45s ease!important}"+
        R+" .gwStage .gwRing.on{opacity:.6}"+
        R+" .gwStage .gwCap,"+R+" .gwSay{transition:opacity .45s ease!important;transform:none}"+
        R+" .gwDamp{transition:opacity .45s ease!important}"+
        R+" .gwDrop.still{display:block;opacity:1;transform:translateY(5px) scale(.9,1.2)}"+
        R+" .gwBeaver{animation:none!important}"+
      "}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- mount: reservoir + dam face around the existing card, stage after it ---------- */
  function svgEl(tag, attrs, parent){
    var e = document.createElementNS(NS, tag);
    for(var k in attrs) e.setAttribute(k, attrs[k]);
    if(parent) parent.appendChild(e);
    return e;
  }
  function wavePath(amp, per, y){
    var d = "M0 " + y + " q" + (per / 4) + " " + (-amp) + " " + (per / 2) + " 0", i;
    for(i = 0; i < 15; i++) d += " t" + (per / 2) + " 0";
    return d + " V16 H0Z";
  }
  function wavesSvg(cls, amp, per, fillOpacity){
    var sv = svgEl("svg", { "class":"gwWaves " + cls, viewBox:"0 0 800 16", preserveAspectRatio:"none", "aria-hidden":"true" });
    svgEl("path", { d:wavePath(amp, per, 7), style:"fill:color-mix(in srgb,var(--gw-b) " + fillOpacity + "%,transparent)" }, sv);
    svgEl("path", { d:wavePath(amp, per, 7).replace(/ V16 H0Z$/, ""), style:"fill:none;stroke:color-mix(in srgb,var(--gw-f) 55%,transparent);stroke-width:1" }, sv);
    return sv;
  }
  function mount(){
    var root = document.getElementById(PID);
    if(!root) return false;
    if(S.root === root && S.stage && root.contains(S.stage)) return true;
    var card = $(".gwCard", root);
    if(!card) return false;
    css();

    var wrap = document.createElement("div"); wrap.className = "gwDam";
    card.parentNode.insertBefore(wrap, card);

    var res = make("gwRes", wrap, "", "div");
    res.setAttribute("aria-hidden", "true");
    var rw = make("gwWater", res, "", "div");
    rw.appendChild(wavesSvg("gwW2", 2.4, 70, 30));
    rw.appendChild(wavesSvg("gwW1", 3.4, 100, 62));
    make("gwCaus c1", res); make("gwCaus c2", res); make("gwRefl", res);
    S.say = make("gwSay", res, "", "div");   // chip lives in reservoir space; aria-hidden by parent

    wrap.appendChild(card);

    var face = make("gwFace", wrap, "", "div");
    face.setAttribute("aria-hidden", "true");
    make("gwDamp", face, "", "div");
    var runs = svgEl("svg", { "class":"gwRuns", viewBox:"0 0 100 100", preserveAspectRatio:"none" }, face);
    SITES.forEach(function(st, i){
      svgEl("path", { "class":"gwRWet", id:"gwRW" + i, d:st.run, pathLength:"1" }, runs);
      svgEl("path", { "class":"gwRHi",  id:"gwRH" + i, d:st.run, pathLength:"1" }, runs);
    });
    /* hairline cracks are fixed-size elements (the run overlay stretches with the card) */
    SITES.forEach(function(st, i){
      var edge = i === 0 || i === SITES.length - 1, k = make("gwCrk", face, "left:" + (edge ? (i ? 97.2 : 2.8) : st.x) + "%;top:" + (edge ? (i ? 40 : 35) : 95) + "%", "div");
      k.innerHTML = '<svg viewBox="0 0 8 14" width="8" height="14" aria-hidden="true"><path class="gwCr" d="M4 0 L3 4 L5 7 L3.4 10 L4.4 14"/><path class="gwGl" id="gwGl' + i + '" d="M4 0 L3 4 L5 7 L3.4 10 L4.4 14"/></svg>';
    });

    var stage = document.createElement("div");
    stage.className = "gwStage";
    stage.innerHTML =
      '<i class="gwLip" aria-hidden="true"></i>'+
      '<div class="gwFx" aria-hidden="true"></div>'+
      '<div class="gwPool">'+
        '<div class="gwWater" aria-hidden="true"></div>'+
        '<i class="gwSurf" aria-hidden="true"></i>'+
        '<div class="gwRings" aria-hidden="true"></div>'+
        '<i class="gwBand gwBandL" aria-hidden="true" style="display:none"></i><i class="gwBand gwBandR" aria-hidden="true" style="display:none"></i>'+
        '<b class="gwCap" role="status" aria-live="polite"></b>'+
      '</div>'+
      '<button type="button" class="gwInfo" id="geiFlowInfo" aria-label="Engineer\'s note" aria-expanded="false"><span aria-hidden="true">i</span></button>'+
      '<div class="gwNote" id="geiFlowNote" role="note" aria-hidden="true"><b aria-hidden="true">💡</b><div><small>ENGINEER\'S NOTE</small><span class="gwNoteText"></span></div></div>';
    root.appendChild(stage);

    var pw = $(".gwPool .gwWater", stage);
    pw.insertBefore(wavesSvg("gwW2", 2, 60, 28), pw.firstChild);
    pw.insertBefore(wavesSvg("gwW1", 2.8, 90, 58), pw.firstChild);
    var pool = $(".gwPool", stage);
    make("gwCaus c1", pool, "opacity:.16"); make("gwCaus c2", pool, "opacity:.1");
    make("gwGlint", pool, "left:22%;top:38%;animation-delay:.4s"); make("gwGlint", pool, "left:61%;top:52%;animation-delay:2.1s"); make("gwGlint", pool, "left:81%;top:34%;animation-delay:3.4s");

    S.root = root; S.wrap = wrap; S.res = res; S.face = face; S.stage = stage;
    S.fx = $(".gwFx", stage); S.rings = $(".gwRings", stage); S.cap = $(".gwCap", stage);
    S.note = $(".gwNote", stage); S.info = $(".gwInfo", stage);
    S.pool = pool;

    /* interactions */
    card.addEventListener("click", function(e){
      if(e.target.closest && e.target.closest("button,input,label,a,.gwClose")) return;
      handlePlayerTap({ x:fracX(e, wrap) });
    });
    res.addEventListener("click", function(e){ tapReservoir(fracX(e, res)); });
    pool.addEventListener("click", function(e){ tapPool(fracX(e, pool)); });
    S.info.addEventListener("click", function(e){ e.stopPropagation(); toggleNote(); });
    S.note.addEventListener("click", function(e){ e.stopPropagation(); nextNoteOrClose(); });
    root.addEventListener("keydown", function(e){
      if(e.key === "Escape" && S.note.classList.contains("on")){ e.preventDefault(); e.stopPropagation(); closeNote(); }
    }, true);
    root.addEventListener("click", function(e){
      var t = e.target;
      if(t === root || (t && t.id === "geiWelcomeBegin")) S.begin = Date.now();
    }, true);
    document.addEventListener("visibilitychange", function(){ if(S.root) S.root.classList.toggle("gwPaused", document.hidden); });

    try{
      new MutationObserver(function(){
        var shown = root.classList.contains("show");
        if(shown && !S.running) start(root.getAttribute("data-mode") || "first");
        else if(!shown && S.running) stop();
      }).observe(root, { attributes:true, attributeFilter:["class"] });
    }catch(e){}
    return true;
  }
  function fracX(e, el){
    var r = el.getBoundingClientRect(), x = r.width ? ((e.clientX - r.left) / r.width) * 100 : 50;
    return Math.max(6, Math.min(94, x));
  }

  /* ---------- character: the PLAYER's active character notices and reacts ---------- */
  function amp(){
    var a = 1;
    try{ a = window.__GEI_PERSONAL_GUIDE__.current().amp || 1; }catch(e){}
    return Math.max(.8, Math.min(1.35, a));
  }
  function syncCharacter(){
    var host = S.root && $(".gwBeaver", S.root);
    if(!host) return;
    host.style.setProperty("--gwAmp", amp());
    var c = null; try{ c = window.getActiveCharacter && window.getActiveCharacter(); }catch(e){}
    if(!c) return;
    var img = $("img", host);
    if(img && c.img && img.getAttribute("src") !== c.img){
      img.onerror = function(){
        var e = document.createElement("span"); e.className = "gwEmoji"; e.textContent = (function(){
          try{ return window.__GEI_PERSONAL_GUIDE__.current().emoji || "🦫"; }catch(x){ return "🦫"; } })();
        if(img.parentNode) img.parentNode.replaceChild(e, img);
      };
      img.src = c.img;
    }
    if(S.mode === "first"){
      var line = $("#geiWelcomeLine", S.root);
      var beaverFamily = c.id === "yall-too-beaver" || c.id === "wilbert-dam-guide";
      if(line && !beaverFamily && c.name) line.textContent = "I'm " + c.name + ". You can choose another player or begin the game.";
    }
  }
  function triggerCharacterReaction(kind){
    if(S.reduced) return false;
    var host = S.root && $(".gwBeaver", S.root);
    if(!host) return false;
    var names = ["look","down","point","cheer"];
    if(kind === "notice") kind = "look";
    if(names.indexOf(kind) < 0) kind = "look";
    names.forEach(function(n){ host.classList.remove("gwR-" + n); });
    void host.offsetWidth;
    host.classList.add("gwR-" + kind);
    var done = function(){ host.classList.remove("gwR-" + kind); host.removeEventListener("animationend", done); };
    host.addEventListener("animationend", done);
    later(done, 1700);
    return true;
  }
  /* short line in a chip over the reservoir; throttled so it never chatters */
  function chip(kind, force){
    if(S.reduced || !S.say) return false;
    var now = Date.now();
    if(!force && now - S.lastSay < 5200) return false;
    S.lastSay = now;
    S.say.textContent = pick(CHIPS[kind] || CHIPS.leak);
    S.say.classList.add("on");
    clearTimeout(S.sayT);
    S.sayT = setTimeout(function(){ if(S.say) S.say.classList.remove("on"); }, kind === "wow" ? 2600 : 1900);
    return true;
  }

  /* ---------- FX primitives ---------- */
  function budget(){ return S.active < MAX_FX; }
  function track(el, ms){
    S.active++;
    var gone = false;
    function rm(){ if(gone) return; gone = true; S.active = Math.max(0, S.active - 1); if(el.parentNode) el.parentNode.removeChild(el); }
    later(rm, ms);
    return rm;
  }
  function px(x){ return (x == null ? 50 : x) + "%"; }

  /* gather → stretch → release → fall. */
  function createDrop(o){
    o = o || {};
    if(!S.fx || !budget()) return null;
    var el = make("gwDrop", S.fx);
    setVar(el, "--x", px(o.x)); setVar(el, "--s", String(o.size || 1));
    var dur = o.quick ? .72 : (o.dur || 1.05);
    setVar(el, "--dd", dur + "s");
    el.__dur = dur * 1000;
    track(el, el.__dur + 120);
    return el;
  }
  function releaseDrop(o, onLand){
    o = o || {};
    var el = createDrop(o);
    if(!el){ if(onLand) onLand(); return null; }
    var done = false;
    function land(){ if(done) return; done = true; if(el.parentNode) el.parentNode.removeChild(el); if(!o.silent) sound("splash", !!o.gesture); if(onLand) onLand(); }
    el.addEventListener("animationend", land);
    later(land, el.__dur + 60);
    if(!o.silent) later(function(){ sound("drip", !!o.gesture); }, el.__dur * .5);
    return el;
  }
  /* a drop that is already falling (a stream breaking into droplets) */
  function fallingDrop(x, size, y0, dur, onLand){
    if(!S.fx || !budget()){ if(onLand) onLand(); return null; }
    var el = make("gwDrop fall", S.fx);
    setVar(el, "--x", px(x)); setVar(el, "--s", String(size)); setVar(el, "--y0", y0 + "px"); setVar(el, "--dd", dur + "s");
    track(el, dur * 1000 + 100);
    later(function(){ if(el.parentNode) el.parentNode.removeChild(el); createSplash({ x:x, size:size * .55 }); if(onLand) onLand(); }, dur * 1000);
    return el;
  }
  function createStream(o, onLand){
    o = o || {};
    if(!S.fx || !budget()){ if(onLand) onLand(); return null; }
    var dur = o.dur || 1.7, el = make("gwStream wob", S.fx);
    setVar(el, "--x", px(o.x)); setVar(el, "--w", (o.w || 5) + "px"); setVar(el, "--sd", dur + "s");
    if(o.cut) el.classList.add("cut");
    track(el, dur * 1000 + 100);
    var big = (o.w || 5) >= 7;
    later(function(){ createSplash({ x:o.x, size:big ? 1.3 : .7 }); sound("splash", !!o.gesture); }, dur * 1000 * .3);
    if(!o.cut) later(function(){ createSplash({ x:o.x, size:big ? 1.1 : .7 }); }, dur * 1000 * .55);
    later(function(){ if(onLand) onLand(); }, dur * 1000 * .34);
    sound("trickle", !!o.gesture);
    return el;
  }
  function createSplash(o){
    o = o || {};
    if(!S.fx || !budget()) return null;
    var size = o.size || 1, box = make("gwSplash", S.fx);
    setVar(box, "--x", px(o.x));
    make("gwImpact", box, "transform:scale(" + (.8 * size) + ")");
    make("gwMist", box);
    var n = size >= 1.4 ? 8 : size >= 1 ? 6 : 4, i;
    for(i = 0; i < n; i++){
      var side = (i % 2 ? 1 : -1), dx = side * rnd(8, 22) * size, dy = -rnd(14, 26) * Math.min(size, 1.5);
      make("gwSp", box, "--dx:" + dx.toFixed(1) + "px;--dy:" + dy.toFixed(1) + "px;animation-delay:" + (i * 12) + "ms");
    }
    track(box, 900);
    return box;
  }
  /* ripple = expanding rings in the pool, same ring language as the game's tap ripples */
  function createRipple(o){
    o = o || {};
    if(!S.rings) return null;
    if(S.reduced){
      var st = $(".gwRing", S.rings) || make("gwRing", S.rings);
      st.classList.add("on");
      return st;
    }
    var rings = o.rings || 2, size = o.size || 1, first = null, i;
    for(i = 0; i < rings && budget(); i++){
      var r = make("gwRing", S.rings);
      setVar(r, "--x", px(o.x));
      setVar(r, "--rx", (2.6 + size * 1.1).toFixed(2));
      setVar(r, "--ry", (1.2 + size * .35).toFixed(2));
      setVar(r, "--rd", (1.3 + size * .35).toFixed(2) + "s");
      setVar(r, "--rdl", (i * .22).toFixed(2) + "s");
      track(r, (1.3 + size * .35 + i * .22) * 1000 + 100);
      first = first || r;
    }
    sound("ripple", !!o.gesture);
    poolSurge(Math.min(1, size / 2));
    return first;
  }
  /* wave = one soft crest travelling outward from the impact point; calm, never continuous */
  function createWave(o){
    o = o || {};
    if(S.reduced || !S.stage) return null;
    var l = $(".gwBandL", S.stage), r = $(".gwBandR", S.stage);
    if(!l || !r) return null;
    var x = o.x == null ? 50 : o.x;
    [l, r].forEach(function(b){
      b.style.display = "none"; void b.offsetWidth;
      setVar(b, "--x", x + "%");
      setVar(b, "--wd", ((o.strength || 1) > 1 ? 2.8 : 2.3) + "s");
      setVar(b, "--wxr", (((100 - x) / 26) * 100 + 60).toFixed(0) + "%");
      setVar(b, "--wxl", ((x / 26) * 100 + 60).toFixed(0) + "%");
      b.style.display = "";
    });
    return true;
  }
  /* the pool surface rises a touch when water lands, then settles */
  function poolSurge(a){
    if(S.reduced || !S.pool) return;
    setVar(S.pool, "--pl", (34 - 20 * a).toFixed(0) + "%");
    later(function(){ setVar(S.pool, "--pl", "34%"); }, 800);
  }
  function resRipple(x){
    if(!S.res || !budget() || S.reduced) return;
    var r = make("gwResRing", S.res);
    setVar(r, "--x", px(x));
    setVar(r, "--ry", Math.max(4, Math.round((1 - S.level) * 20 + 5)) + "px");
    track(r, 1400);
  }
  function setLevel(v, secs){
    S.level = v;
    if(!S.res) return;
    setVar(S.res, "--lvlT", (S.reduced ? 0 : (secs || 3)) + "s");
    setVar(S.res, "--lvl", String(v));
  }

  /* ---------- wet surfaces: runs on the face, damp zones that dry back ---------- */
  function faceRun(i, o){
    o = o || {};
    if(S.reduced) return;
    var wet = $("#gwRW" + i, S.face), hi = $("#gwRH" + i, S.face);
    if(!wet || !hi) return;
    [wet, hi].forEach(function(p){
      p.classList.remove("run"); void p.getBoundingClientRect();
      p.style.setProperty("--rt", (o.rt || 1.4) + "s");
      p.style.setProperty("--reach", String(o.reach == null ? 0 : o.reach));
      p.classList.add("run");
    });
    glint(i, true);
    later(function(){ glint(i, false); }, 4200);
  }
  function glint(i, on){
    var g = $("#gwGl" + i, S.face);
    if(g) g.classList.toggle("on", !!on);
  }
  function bump(amount){
    if(S.reduced || !S.face) return;
    S.damp = Math.min(1, S.damp + amount);
    S.face.style.setProperty("--dampT", ".9s");
    S.face.style.setProperty("--damp", S.damp.toFixed(2));
    later(function(){
      S.damp = Math.max(0, S.damp - amount);
      S.face.style.setProperty("--dampT", "13s");
      S.face.style.setProperty("--damp", S.damp.toFixed(2));
    }, 2600);
  }
  function bead(i){
    if(S.reduced || !S.face || !budget()) return;
    var st = SITES[i], yc = i === 0 || i === SITES.length - 1 ? 40 : 96;
    var b = make("gwBead", S.face, "left:" + st.x + "%;top:" + yc + "%", "div");
    track(b, 1800);
  }

  function caption(text, hold){
    if(!S.cap) return;
    clearTimeout(S.capT);
    S.cap.textContent = text;
    S.cap.classList.add("on");
    if(hold) S.capT = setTimeout(function(){ if(S.cap) S.cap.classList.remove("on"); }, hold);
  }
  function flowing(on){ if(S.root) S.root.classList.toggle("gwFlowing", !!on); }
  function phase(name){
    S.phase = name;
    if(S.root) S.root.setAttribute("data-flow-phase", name);
    S.log.push(name);
  }

  /* ---------- the six leak behaviours ---------- */
  function siteIndex(avoid){
    var i, tries = 0;
    do{ i = rint(0, SITES.length - 1); tries++; }while(avoid && avoid.indexOf(i) >= 0 && tries < 12);
    return i;
  }
  function landing(x, o){
    o = o || {};
    phase("splash");
    createSplash({ x:x, size:o.splash || 1 });
    if(o.second) later(function(){ createSplash({ x:x + rnd(-8, 8), size:(o.splash || 1) * .6 }); }, 220);
    later(function(){ phase("ripple"); createRipple({ x:x, rings:o.rings || 2, size:o.ripple || 1 }); if(o.wave) createWave({ x:x, strength:o.wave }); }, 160);
    flowing(true);
    bump(o.damp || .12);
  }
  /* type: micro | drip | thin | split | heavy | overflow */
  function leak(type, si, o){
    o = o || {};
    if(!S.running && !o.force) return false;
    if(si == null) si = type === "overflow" ? LIP : siteIndex();
    var st = SITES[si], x = st.x, edge = si === 0 || si === SITES.length - 1;
    var rt = type === "micro" ? 2.2 : (edge ? 1.7 : .9);
    switch(type){
      case "micro":
        glint(si, true); bead(si); bump(.1); sound("seep");
        faceRun(si, { rt:2.6, reach:edge ? .72 : .35 });
        later(function(){ releaseDrop({ x:x, size:.35, dur:1.5, silent:true }, function(){ createSplash({ x:x, size:.35 }); sound("drip"); }); }, 1100);
        break;
      case "drip":
        faceRun(si, { rt:rt }); bump(.18);
        later(function(){
          var n = rint(1, 2);
          for(var k = 0; k < n; k++) (function(k){ later(function(){
            releaseDrop({ x:x, size:rnd(.6, .9), dur:rnd(.95, 1.2) }, function(){ createSplash({ x:x, size:.6 }); if(k === n - 1) createRipple({ x:x, rings:1, size:.6 }); });
          }, k * 1100); })(k);
        }, rt * 700);
        break;
      case "thin":
        faceRun(si, { rt:rt }); bump(.25);
        later(function(){ createStream({ x:x, w:3, dur:rnd(1.4, 1.9) }, function(){ createRipple({ x:x, rings:1, size:.8 }); }); }, rt * 700);
        break;
      case "split":
        faceRun(si, { rt:rt }); bump(.25);
        later(function(){
          createStream({ x:x, w:3, dur:1.5, cut:true });
          [0, 1, 2].forEach(function(k){ later(function(){ fallingDrop(x + rnd(-1.4, 1.4), rnd(.5, .75), rnd(8, 18), rnd(.45, .6), k === 2 ? function(){ createRipple({ x:x, rings:1, size:.7 }); } : null); }, 500 + k * 170); });
        }, rt * 700);
        break;
      case "heavy":
        faceRun(si, { rt:rt }); bump(.4);
        later(function(){
          createStream({ x:x, w:7, dur:2.1 }, function(){ landing(x, { splash:1.4, ripple:1.5, rings:3, wave:1 }); });
          chip("release");
        }, rt * 600);
        break;
      case "overflow":
        if(S.reduced) return false;
        var sh = S.fx && budget() ? make("gwSheet", S.fx) : null;
        if(sh){ setVar(sh, "--sd", "2s"); track(sh, 2100); }
        glint(LIP, true); bump(.3); sound("trickle");
        setLevel(Math.max(.3, S.level - .08), 2);
        later(function(){ landing(50, { splash:1.3, ripple:1.4, rings:3, wave:1 }); }, 520);
        later(function(){ createSplash({ x:44, size:.8 }); }, 900);
        break;
    }
    return true;
  }

  /* ---------- releases ---------- */
  function release(kind){
    var P = S.pers || pers("A");
    if(!S.running && kind !== "tap") return false;
    kind = kind || P.rel;
    phase("release");
    flowing(true);
    if(kind === "wow"){
      S.wowAt = S.cycles;
      sound("whoosh"); chip("wow", true);
      glint(LIP, true); bump(.55);
      var sh = S.fx && budget() ? make("gwSheet", S.fx) : null;
      if(sh){ setVar(sh, "--sd", "2.4s"); track(sh, 2500); }
      createStream({ x:50, w:9, dur:2.7 }, function(){ landing(50, { splash:1.9, second:true, ripple:2.4, rings:4, wave:2, damp:.3 }); });
      later(function(){ createStream({ x:38, w:6, dur:2.3 }, function(){ landing(38, { splash:1.3, ripple:1.6, rings:3, wave:1 }); }); }, 260);
      later(function(){ createStream({ x:62, w:6, dur:2.3 }, function(){ landing(62, { splash:1.3, ripple:1.6, rings:3 }); }); }, 430);
      [0, 5, 6].forEach(function(i){ later(function(){ faceRun(i, { rt:1.3 }); }, i * 60); });
      setLevel(Math.max(.18, P.lvl0 - .22), 2.6);
      later(function(){ triggerCharacterReaction("cheer"); }, 900);
      return true;
    }
    if(kind === "heavy"){
      sound("trickle"); leak("heavy", pick([2, 4]), { force:true });
      setLevel(Math.max(.24, P.lvl0 - .12), 2.4);
      later(function(){ triggerCharacterReaction("point"); }, 800);
    } else if(kind === "overflow"){
      chip("release"); leak("overflow", LIP, { force:true });
      later(function(){ triggerCharacterReaction("point"); }, 800);
    } else {   // thin → "a stronger stream emerges"
      sound("trickle");
      faceRun(LIP, { rt:.9 }); bump(.3);
      later(function(){
        createStream({ x:50, w:5, dur:2.2 }, function(){ landing(50, { splash:1.2, ripple:P.bigRipple ? 2.2 : 1.2, rings:P.bigRipple ? 4 : 2, wave:1 }); });
        chip("release");
      }, 600);
      setLevel(Math.max(.26, P.lvl0 - .1), 2.4);
      later(function(){ triggerCharacterReaction("point"); }, 1500);
    }
    return true;
  }

  /* ---------- the hydraulic pressure cycle ---------- */
  function runCycle(n){
    if(!S.running || S.reduced) return;
    S.cycles = n;
    var P = S.pers, first = n === 0, k = first ? .72 : 1;
    var wow = P.wowFrom === n || (n > P.wowFrom && S.cycles - S.wowAt >= 3 && Math.random() < .55) || (P.wowFrom === 0 && n > 0 && n % 3 === 0);
    var t = 0, lvl0 = P.lvl0 + rnd(-.04, .04), lvl1 = P.lvl1 + rnd(-.05, .05);
    var seepMs = rnd(2600, 3800) * P.seep * k, leakMs = rnd(3600, 5200) * P.leak * k;

    at(t, function(){ phase("calm"); setLevel(lvl0, 2.4); if(first) later(function(){ if(S.running && S.phase === "calm") releaseDrop({ x:50, size:.55, dur:1.3, silent:false }, function(){ createSplash({ x:50, size:.45 }); }); }, 900 * S.time); });
    t += rnd(1900, 2900) * P.calm * k;

    at(t, function(){ phase("rising"); setLevel(lvl1, 4.2 * P.rise * k * S.time); });
    t += rnd(3600, 4800) * P.rise * k;

    at(t, function(){
      phase("pressure"); S.root.classList.add("gwPressure");
      var hot = [0, 2, 4, 6, 3].slice(0, 2 + P.nSeep); hot.forEach(function(i, j){ later(function(){ glint(i, true); }, j * 220); });
      if(P.notice){ chip("notice", true); triggerCharacterReaction("look"); }
    });
    t += rnd(1800, 2400) * P.press * k;

    at(t, function(){
      phase("seepage");
      var avoid = [];
      for(var j = 0; j < P.nSeep; j++) (function(j){
        var si = siteIndex(avoid); avoid.push(si);
        later(function(){ leak("micro", si); }, j * (seepMs / P.nSeep) * S.time);
      })(j);
    });
    t += seepMs;

    at(t, function(){
      phase("leak");
      if(!P.notice) chip("leak");
      triggerCharacterReaction("look");
      var avoid = [], gap = leakMs / P.leakN;
      for(var j = 0; j < P.leakN; j++) (function(j){
        var type = P.leaks[j % P.leaks.length], si = type === "overflow" ? LIP : siteIndex(avoid); avoid.push(si);
        later(function(){ leak(type, si); }, (P.multi ? j * 260 : j * gap) * S.time);
      })(j);
    });
    t += leakMs + 600 * k;

    if(wow){   // the system HOLDS… then WHOOSH
      at(t, function(){ phase("hold"); });
      t += rnd(1500, 2100);
    }
    at(t, function(){ release(wow ? "wow" : P.rel); });
    t += wow ? 4300 : 3400;

    at(t, function(){
      phase("reset"); S.root.classList.remove("gwPressure");
      SITES.forEach(function(s, i){ glint(i, false); });
      setLevel(lvl0 - .04, 4);
      caption("WELCOME TO THE FLOW.");
      if(wow) chip("release", true);
      triggerCharacterReaction("cheer");
    });
    t += rnd(2800, 3600) * k;

    at(t, function(){
      if(n + 1 >= MAX_CYCLES){ phase("calm"); setLevel(.46, 4); return; }
      runCycle(n + 1);
    });
  }

  /* ---------- interaction: the water responds to the player ---------- */
  function tapReservoir(x){
    if(!S.running) return false;
    if(S.reduced){ createRipple(); caption("WELCOME TO THE FLOW."); return true; }
    resRipple(x); sound("ripple", true);
    setLevel(Math.min(.95, S.level + .05), .8);
    if(Math.random() < .5) chip("tap");
    triggerCharacterReaction("look");
    return true;
  }
  function tapPool(x){
    if(!S.running) return false;
    if(S.reduced){ createRipple(); return true; }
    createSplash({ x:x, size:.9 }); createRipple({ x:x, rings:2, size:1, gesture:true }); sound("splash", true);
    triggerCharacterReaction("down");
    return true;
  }
  /* tap card: 1 droplet · 2 splash · 3 larger ripple · 4 droplet · 5 SPECIAL release → FLOW ACTIVATED */
  function handlePlayerTap(o){
    if(!S.running) return false;
    var t = Date.now();
    if(t - S.lastTap < TAP_GAP) return false;
    S.lastTap = t;
    S.taps = (S.taps % 5) + 1;
    var n = S.taps, x = o && o.x != null ? o.x : 50;
    if(S.reduced){
      createRipple();
      caption(n === 5 ? "FLOW ACTIVATED! 🚀" : "WELCOME TO THE FLOW.", n === 5 ? 2200 : 0);
      sound(n === 5 ? "activate" : "drip", true);
      return true;
    }
    if(n === 1 || n === 4){
      releaseDrop({ x:x, size:.8, quick:true, gesture:true }, function(){ createSplash({ x:x, size:.6 }); createRipple({ x:x, rings:1, size:.7 }); });
      bump(.1); triggerCharacterReaction("look");
    } else if(n === 2){
      releaseDrop({ x:x, size:1.15, quick:true, gesture:true }, function(){ createSplash({ x:x, size:1.5 }); createRipple({ x:x, rings:2, size:1 }); });
      bump(.15); triggerCharacterReaction("point"); chip("tap");
    } else if(n === 3){
      releaseDrop({ x:x, size:1.3, quick:true, gesture:true }, function(){ createSplash({ x:x, size:1.5, second:true }); createRipple({ x:x, rings:3, size:1.8, gesture:true }); createWave({ x:x, strength:1 }); });
      bump(.2); setLevel(Math.min(.95, S.level + .06), 1);
      triggerCharacterReaction("down");
    } else {
      /* special: a brief, controlled release */
      sound("whoosh", true);
      leak("heavy", LIP, { force:true });
      caption("FLOW ACTIVATED! 🚀", 2400); flowing(true); sound("activate", true);
      chip("release", true); triggerCharacterReaction("cheer");
      setLevel(Math.max(.2, S.level - .1), 2);
      later(function(){ if(S.running) caption("WELCOME TO THE FLOW."); }, 2500);
    }
    return true;
  }

  /* ---------- Engineer's note (optional; never automatic) ---------- */
  function openNote(){
    if(!S.note) return false;
    S.note.querySelector(".gwNoteText").textContent = NOTES[S.noteIdx % NOTES.length];
    S.note.classList.add("on"); S.note.setAttribute("aria-hidden", "false");
    S.info.setAttribute("aria-expanded", "true");
    clearTimeout(S.noteT);
    S.noteT = setTimeout(closeNote, 14000);
    return true;
  }
  function closeNote(){
    if(!S.note) return false;
    clearTimeout(S.noteT);
    S.note.classList.remove("on"); S.note.setAttribute("aria-hidden", "true");
    S.info.setAttribute("aria-expanded", "false");
    return true;
  }
  function toggleNote(){
    if(S.note.classList.contains("on")){ closeNote(); return false; }
    return openNote();
  }
  /* tapping the note shows the next fact; after the last one it closes */
  function nextNoteOrClose(){
    S.noteIdx++;
    if(S.noteIdx % NOTES.length === 0){ closeNote(); return; }
    openNote();
  }

  /* ---------- journey: the final wave drifts toward the game ---------- */
  function journey(){
    if(S.reduced || !document.body) return;
    var layer = document.createElement("div");
    layer.className = "gwJourney";
    layer.setAttribute("aria-hidden", "true");
    layer.style.setProperty("--gw-b", S.tone ? S.tone.b : "#2fd2ff");
    layer.style.setProperty("--gw-f", S.tone ? S.tone.f : "#eafcff");
    layer.appendChild(document.createElement("i"));
    document.body.appendChild(layer);
    setTimeout(function(){ if(layer.parentNode) layer.parentNode.removeChild(layer); }, 1300);
  }

  /* ---------- lifecycle ---------- */
  function applyTone(tone){
    S.tone = tone;
    if(!S.root) return;
    S.root.style.setProperty("--gw-b", tone.b);
    S.root.style.setProperty("--gw-d", tone.d);
    S.root.style.setProperty("--gw-f", tone.f);
    S.root.classList.toggle("gwLuminous", !!tone.glow);
    S.root.setAttribute("data-flow-tone", tone.id);
  }
  function reset(){
    S.timers.forEach(clearTimeout); S.timers = [];
    clearTimeout(S.capT); clearTimeout(S.sayT); clearTimeout(S.noteT);
    S.active = 0; S.taps = 0; S.lastTap = 0; S.cycles = 0; S.damp = 0; S.wowAt = -9; S.lastSay = 0; S.sndAt = {};
    S.log = [];
    if(S.fx) S.fx.innerHTML = "";
    if(S.rings) S.rings.innerHTML = "";
    if(S.res) Array.prototype.forEach.call(S.res.querySelectorAll(".gwResRing"), function(e){ e.remove(); });
    if(S.face){
      Array.prototype.forEach.call(S.face.querySelectorAll(".gwBead"), function(e){ e.remove(); });
      Array.prototype.forEach.call(S.face.querySelectorAll(".run,.on"), function(e){ e.classList.remove("run", "on"); });
      S.face.style.setProperty("--dampT", ".3s"); S.face.style.setProperty("--damp", "0");
    }
    if(S.cap){ S.cap.classList.remove("on"); S.cap.textContent = ""; }
    if(S.say) S.say.classList.remove("on");
    closeNote();
    if(S.stage) Array.prototype.forEach.call(S.stage.querySelectorAll(".gwBand"), function(b){ b.style.display = "none"; });
    if(S.pool) setVar(S.pool, "--pl", "34%");
    var host = S.root && $(".gwBeaver", S.root);
    if(host) host.className = host.className.replace(/\bgwR-\w+/g, "").trim();
    if(S.root){ S.root.classList.remove("gwFlowing", "gwPressure", "gwReduced"); S.root.removeAttribute("data-flow-phase"); }
    S.phase = "";
  }
  function start(mode){
    if(!mount()) return false;
    reset();
    S.running = true;
    S.mode = mode === "review" ? "review" : "first";
    S.reduced = reduced();
    var f = S.forced || {};
    S.pers = pers(f.variation || S.variation);
    S.time = f.time || 1;
    applyTone(f.tone || S.tone || pickTone());
    syncCharacter();
    if(S.reduced){
      /* calm static scene: wet surface, one still drop, a minimal ripple, no cycle, no releases */
      S.root.classList.add("gwReduced");
      setLevel(.55, 0);
      S.face.style.setProperty("--dampT", "0s"); S.face.style.setProperty("--damp", ".55");
      var d = make("gwDrop still", S.fx); setVar(d, "--x", "50%");
      later(function(){ createRipple(); caption("WELCOME TO THE FLOW."); }, 450);
      return true;
    }
    setLevel(S.pers.lvl0, 0);
    at(500, function(){ runCycle(0); });
    return true;
  }
  function stop(){
    var wasBegin = Date.now() - S.begin < 600;
    S.running = false;
    reset();
    if(wasBegin) journey();
    return true;
  }
  function configure(o){
    o = o || {};
    S.forced = S.forced || {};
    if(o.variation && VARIATIONS.indexOf(o.variation) >= 0) S.forced.variation = o.variation;
    if(o.time) S.forced.time = Math.max(.1, +o.time || 1);
    if(o.tone){
      var all = NATURAL.concat(WOW), t = all.filter(function(x){ return x.id === o.tone; })[0];
      if(t) S.forced.tone = t;
    }
    if(o.clear) S.forced = null;
    return true;
  }

  function install(tries){
    if(mount()){
      S.variation = VARIATIONS[Math.floor(Math.random() * VARIATIONS.length)];
      S.tone = pickTone();
      applyTone(S.tone);
      S.log = [];
      if(S.root.classList.contains("show")) start(S.root.getAttribute("data-mode") || "first");
      return;
    }
    if((tries || 0) < 60) setTimeout(function(){ install((tries || 0) + 1); }, 200);
  }

  S.log = [];
  window.__GEI_FLOW_WELCOME__ = Object.freeze({
    version:VERSION, presentationOnly:true,
    createDrop:createDrop, releaseDrop:releaseDrop, createStream:createStream, createSplash:createSplash,
    createRipple:createRipple, createWave:createWave, triggerCharacterReaction:triggerCharacterReaction,
    handlePlayerTap:handlePlayerTap, leak:leak, release:release, setLevel:setLevel, openNote:openNote, closeNote:closeNote,
    reset:reset, start:start, stop:stop, configure:configure,
    variation:function(){ return (S.forced && S.forced.variation) || S.variation; },
    personality:function(){ return S.pers && S.pers.name; },
    tone:function(){ return S.tone && S.tone.id; },
    phaseLog:function(){ return S.log.slice(); },
    state:function(){ return { running:S.running, taps:S.taps, active:S.active, reduced:S.reduced, mode:S.mode, phase:S.phase, cycles:S.cycles, level:S.level, damp:S.damp }; },
    tones:{ natural:NATURAL.map(function(t){ return t.id; }), wow:WOW.map(function(t){ return t.id; }) },
    variations:VARIATIONS.slice(), leakTypes:["micro","drip","thin","split","heavy","overflow"]
  });

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ install(0); }, { once:true });
  else install(0);
})();
