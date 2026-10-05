/* V2.2.4 — FLOW WELCOME EFFECT 💧🚀  "WELCOME TO THE FLOW"
 *
 * The Beaver welcome card (beaver-welcome-v2190.js) becomes a miniature dam:
 *
 *   CARD = DAM · WATER = FLOW · RELEASE = ACTION · SPLASH = REACTION · RIPPLE = CONSEQUENCE
 *
 *   hold → gather → stretch → release → fall → splash → ripple → wave → (journey into the game)
 *
 * It attaches to the EXISTING #geiWelcome overlay (no second dialog, no second animation framework):
 *   • adds a small spillway lip under the card, a reservoir strip below it and a thin FX layer
 *   • starts when the welcome opens (first-impression or Profile review), stops + cleans up when it closes
 *   • tapping the card is an optional toy: drop → splash → ripple → "FLOW ACTIVATED! 🚀" (never required)
 *   • the player's ACTIVE character (getActiveCharacter / personal guide) looks, points and cheers — the default
 *     beaver is never required
 *   • per-load water tone: ~86% natural water blues, ~14% WOW variants (blue-violet / luminous)
 *   • per-load sequence variation A–F (single drop · three drops · stream · drop+big ripple · wave pulse ·
 *     character-first) — the layout never changes, only the rhythm
 *   • sounds reuse the game's damVoice / damNoise (SFX bus → master volume + mute). They only play if audio is
 *     already unlocked or the player tapped; the visuals never depend on them
 *   • prefers-reduced-motion: static water highlight, one soft ripple that fades in, no drops / particles / waves
 *     / character motion / journey
 *   • DOM + CSS transforms only, ≤ ~14 live FX nodes, capped idle loop that pauses when the tab is hidden
 *
 * Presentation only: never reads or writes progress, FL OZ, XP, purchases, entitlements, ownership or storage.
 */
(function(){
  "use strict";
  if(window.__GEI_FLOW_WELCOME__) return;
  var VERSION = "V2.2.4";
  var PID = "geiWelcome";

  /* ---------- water tones: natural first, a few WOW variants ---------- */
  var NATURAL = [
    { id:"cyan",       b:"#2fd2ff", d:"#03203f", f:"#eafcff", w:4 },   // the game's own water
    { id:"clear-blue", b:"#4db8ff", d:"#0a3f7a", f:"#eefaff", w:3 },
    { id:"aqua",       b:"#4ee6d8", d:"#06454a", f:"#eafffb", w:2 },
    { id:"deep-blue",  b:"#3d8bea", d:"#07305f", f:"#e8f3ff", w:2 }
  ];
  var WOW = [
    { id:"blue-violet", b:"#8a8cff", d:"#25267f", f:"#f1efff", w:1, wow:true },
    { id:"luminous",    b:"#bff6ff", d:"#0b5d8f", f:"#ffffff", w:1, wow:true, glow:1 }
  ];
  var WOW_CHANCE = .14;

  var VARIATIONS = ["A","B","C","D","E","F"];   // A drop · B three drops · C stream · D drop+ripple · E wave · F character first
  var MAX_FX = 14, IDLE_EVERY = 9000, IDLE_MAX = 3, TAP_GAP = 140;

  var S = { root:null, stage:null, fx:null, rings:null, cap:null, mode:"", timers:[], active:0, taps:0, lastTap:0,
            idleRuns:0, running:false, reduced:false, variation:"A", tone:null, begin:0, capT:0, lastReact:0, forced:null };

  /* ---------- tiny helpers ---------- */
  function $(sel, ctx){ return (ctx || document).querySelector(sel); }
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function later(fn, ms){
    var id = setTimeout(function(){
      var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1);
      try{ fn(); }catch(e){}
    }, ms);
    S.timers.push(id);
    return id;
  }
  function make(cls, parent, css){
    var el = document.createElement("i");
    el.className = cls;
    if(css) el.style.cssText = css;
    if(parent) parent.appendChild(el);
    return el;
  }
  function pickWeighted(list){
    var t = 0, i; for(i = 0; i < list.length; i++) t += list[i].w;
    var r = Math.random() * t;
    for(i = 0; i < list.length; i++){ r -= list[i].w; if(r <= 0) return list[i]; }
    return list[0];
  }
  function pickTone(){ return Math.random() < WOW_CHANCE ? pickWeighted(WOW) : pickWeighted(NATURAL); }
  function mutedOrLocked(){
    try{ if(window.GEI_AUDIO && window.GEI_AUDIO.muted) return true; }catch(e){}
    return false;
  }

  /* ---------- audio: the game's own synth voices, short and quiet ---------- */
  function jit(v){ return v * rnd(.93, 1.08); }
  function sound(kind, gesture){
    if(mutedOrLocked()) return;
    var voice = window.damVoice, noise = window.damNoise;
    if(typeof voice !== "function" && typeof noise !== "function") return;
    var g = !!gesture;
    try{
      if(kind === "drop" && typeof voice === "function")
        voice({ freq:jit(1180), to:jit(640), time:.09, gain:.009, type:"sine", gesture:g, priority:0 });
      else if(kind === "splash"){
        if(typeof noise === "function") noise({ dur:.26, from:jit(1500), to:700, gain:.011, filter:"bandpass", q:.9, gesture:g });
        if(typeof voice === "function") voice({ freq:jit(520), to:260, time:.13, gain:.008, delay:.02, type:"sine", gesture:g, priority:0 });
      } else if(kind === "wave" && typeof noise === "function")
        noise({ dur:.85, from:300, to:760, gain:.007, filter:"lowpass", gesture:g });
      else if(kind === "activate" && typeof voice === "function"){
        voice({ freq:660, time:.1, gain:.010, gesture:g, priority:0 });
        voice({ freq:990, time:.16, gain:.009, delay:.08, gesture:g, priority:0 });
      }
    }catch(e){}
  }

  /* ---------- styles ---------- */
  function css(){
    if(document.getElementById("geiFlowWelcome224Style")) return;
    var s = document.createElement("style");
    s.id = "geiFlowWelcome224Style";
    var R = "#" + PID;
    s.textContent = [
      /* layout: the overlay becomes a column = [card][spillway + reservoir]; both stay inside the viewport */
      R+"{--gwSpillH:54px;--gwPoolH:46px;--gwStageH:calc(var(--gwSpillH) + var(--gwPoolH));--gw-b:#2fd2ff;--gw-d:#03203f;--gw-f:#eafcff;flex-direction:column;align-items:center;justify-content:flex-end;overflow:hidden}",
      "@media (min-width:700px){"+R+"{justify-content:center}}",
      "@media (max-height:480px){"+R+"{--gwSpillH:34px;--gwPoolH:30px}}",
      R+" .gwCard{max-height:calc(100dvh - 40px - var(--gwStageH));box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 34px color-mix(in srgb,var(--gw-b) 20%,transparent);cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}",
      R+" .gwCard button,"+R+" .gwCard label{cursor:pointer}",
      R+" .gwCard::after{content:'';position:absolute;left:22px;right:22px;bottom:6px;height:2px;border-radius:2px;pointer-events:none;"+
        "background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--gw-b) 55%,transparent) 14%,color-mix(in srgb,var(--gw-b) 55%,transparent) 41%,transparent 43%,transparent 57%,color-mix(in srgb,var(--gw-b) 55%,transparent) 59%,color-mix(in srgb,var(--gw-b) 55%,transparent) 86%,transparent)}",
      R+".gwFlowing .gwCard{box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 40px color-mix(in srgb,var(--gw-b) 30%,transparent)}",

      /* stage = spillway lip + falling zone + reservoir strip */
      R+" .gwStage{position:relative;flex:0 0 auto;width:min(100%,440px);height:var(--gwStageH);margin-top:-1px;pointer-events:none}",
      R+" .gwLip{position:absolute;left:50%;top:0;width:58px;height:13px;transform:translateX(-50%);border-radius:0 0 16px 16px;"+
        "background:linear-gradient(180deg,rgba(9,28,52,.97),rgba(6,16,34,.97));border:1px solid rgba(47,210,255,.34);border-top:0;"+
        "box-shadow:0 6px 14px color-mix(in srgb,var(--gw-b) 24%,transparent)}",
      R+" .gwLip::after{content:'';position:absolute;left:30%;right:30%;bottom:2px;height:3px;border-radius:3px;background:color-mix(in srgb,var(--gw-b) 70%,transparent);opacity:.55;transition:opacity .4s ease}",
      R+".gwFlowing .gwLip::after{opacity:1}",
      R+" .gwFx{position:absolute;left:0;right:0;top:0;height:var(--gwSpillH)}",
      R+" .gwPool{position:absolute;left:0;right:0;bottom:0;height:var(--gwPoolH);border-radius:20px 20px 24px 24px;overflow:hidden;"+
        "background:linear-gradient(180deg,color-mix(in srgb,var(--gw-b) 32%,#061226),color-mix(in srgb,var(--gw-d) 88%,#020814));"+
        "border:1px solid color-mix(in srgb,var(--gw-b) 40%,transparent);box-shadow:inset 0 0 20px color-mix(in srgb,var(--gw-b) 20%,transparent),0 0 24px color-mix(in srgb,var(--gw-b) 14%,transparent)}",
      R+" .gwSurf{position:absolute;left:8%;right:8%;top:3px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--gw-f),transparent);opacity:.55}",
      R+" .gwSheen{position:absolute;top:0;bottom:0;left:-30%;width:30%;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--gw-f) 22%,transparent),transparent);animation:gwfxSheen 7s ease-in-out infinite}",
      R+" .gwRings{position:absolute;inset:0}",
      R+" .gwRing{position:absolute;left:50%;top:9px;width:120px;height:22px;border-radius:50%;border:2px solid var(--gw-b);opacity:0;"+
        "box-shadow:0 0 12px color-mix(in srgb,var(--gw-b) 55%,transparent),inset 0 0 8px color-mix(in srgb,var(--gw-f) 30%,transparent);"+
        "transform:translate(-50%,-50%) scale(.15);animation:gwfxRing var(--rd,1.5s) ease-out var(--rdl,0s) forwards}",
      R+" .gwBand{position:absolute;top:0;bottom:0;width:26%;opacity:0;"+
        "background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--gw-f) 38%,transparent),color-mix(in srgb,var(--gw-b) 40%,transparent),transparent)}",
      R+" .gwBandR{left:50%;animation:gwfxBandR var(--wd,2.3s) ease-out forwards}",
      R+" .gwBandL{right:50%;animation:gwfxBandL var(--wd,2.3s) ease-out forwards}",
      R+" .gwCap{position:absolute;left:0;right:0;bottom:7px;text-align:center;font:800 13px/1.2 system-ui,sans-serif;letter-spacing:.09em;color:var(--gw-f);"+
        "text-shadow:0 1px 6px rgba(2,8,20,.9),0 0 10px color-mix(in srgb,var(--gw-b) 60%,transparent);opacity:0;transform:translateY(4px);transition:opacity .45s ease,transform .45s ease;white-space:nowrap;padding:0 8px}",
      R+" .gwCap.on{opacity:1;transform:none}",
      R+".gwLuminous .gwPool,"+R+".gwLuminous .gwLip{box-shadow:inset 0 0 22px color-mix(in srgb,var(--gw-f) 30%,transparent),0 0 30px color-mix(in srgb,var(--gw-b) 36%,transparent)}",

      /* drop: gather → stretch → release → fall (one keyframe animation, transform/opacity only) */
      R+" .gwDrop{position:absolute;left:50%;top:0;width:calc(10px*var(--s,1));height:calc(13px*var(--s,1));margin-left:calc(-5px*var(--s,1));"+
        "border-radius:50% 50% 50% 50%/62% 62% 38% 38%;opacity:0;transform-origin:50% 0;"+
        "background:radial-gradient(circle at 35% 30%,var(--gw-f),var(--gw-b) 48%,var(--gw-d) 105%);box-shadow:0 0 8px color-mix(in srgb,var(--gw-b) 60%,transparent);"+
        "animation:gwfxDrop var(--dd,1.05s) linear forwards}",
      R+" .gwStream{position:absolute;left:50%;top:0;width:5px;height:var(--gwSpillH);margin-left:-2.5px;border-radius:3px;opacity:.95;"+
        "background:linear-gradient(90deg,color-mix(in srgb,var(--gw-d) 70%,transparent),var(--gw-f) 45%,var(--gw-b) 70%,color-mix(in srgb,var(--gw-d) 70%,transparent));"+
        "box-shadow:0 0 8px color-mix(in srgb,var(--gw-b) 55%,transparent);clip-path:inset(0 0 100% 0);animation:gwfxStream var(--sd,1.7s) ease-in-out forwards}",

      /* splash: impact ring + 4–8 tiny arcs + mist */
      R+" .gwSplash{position:absolute;left:50%;top:var(--gwSpillH);width:0;height:0}",
      R+" .gwImpact{position:absolute;left:-14px;top:-5px;width:28px;height:10px;border-radius:50%;border:2px solid color-mix(in srgb,var(--gw-f) 85%,transparent);opacity:0;animation:gwfxImpact .55s ease-out forwards;transform-origin:50% 50%}",
      R+" .gwMist{position:absolute;left:-30px;top:-22px;width:60px;height:30px;border-radius:50%;opacity:0;background:radial-gradient(ellipse at 50% 80%,color-mix(in srgb,var(--gw-f) 55%,transparent),transparent 70%);animation:gwfxMist .8s ease-out forwards}",
      R+" .gwSp{position:absolute;left:-2px;top:-2px;width:4px;height:4px;border-radius:50%;opacity:0;background:var(--gw-f);box-shadow:0 0 5px color-mix(in srgb,var(--gw-b) 70%,transparent);animation:gwfxSp .65s ease-out forwards}",

      /* character reactions land on the existing host wrapper */
      R+" .gwBeaver.gwR-look{animation:gwfxLook 1.5s ease-in-out 1}",
      R+" .gwBeaver.gwR-down{animation:gwfxDown 1.3s ease-in-out 1}",
      R+" .gwBeaver.gwR-point{animation:gwfxPoint 1.2s ease-in-out 1}",
      R+" .gwBeaver.gwR-cheer{animation:gwfxCheer 1.1s ease-out 1}",

      /* journey: after BEGIN the last wave drifts up toward the board — subtle, never blocks input */
      ".gwJourney{position:fixed;inset:0;z-index:99001;overflow:hidden;pointer-events:none}",
      ".gwJourney i{position:absolute;left:50%;width:min(92vw,520px);height:min(26vh,180px);margin-left:calc(min(92vw,520px)/-2);bottom:calc(env(safe-area-inset-bottom) + 24px);opacity:0;border-radius:50%;"+
        "background:radial-gradient(ellipse at 50% 60%,color-mix(in srgb,var(--gw-f,#eafcff) 30%,transparent),color-mix(in srgb,var(--gw-b,#2fd2ff) 22%,transparent) 42%,transparent 70%);animation:gwfxJourney 1.15s ease-out forwards}",

      "@keyframes gwfxSheen{0%,55%{transform:translateX(0);opacity:0}65%{opacity:1}100%{transform:translateX(480%);opacity:0}}",
      "@keyframes gwfxDrop{"+
        "0%{opacity:0;transform:translateY(0) scale(.1)}"+
        "30%{opacity:1;transform:translateY(1px) scale(1,1);animation-timing-function:ease-in-out}"+
        "48%{opacity:1;transform:translateY(4px) scale(.82,1.4);animation-timing-function:cubic-bezier(.5,0,.95,.55)}"+
        "100%{opacity:1;transform:translateY(calc(var(--gwSpillH) - 12px*var(--s,1))) scale(.9,1.18)}}",
      "@keyframes gwfxStream{0%{clip-path:inset(0 0 100% 0);opacity:0}28%{clip-path:inset(0 0 0 0);opacity:1}72%{clip-path:inset(0 0 0 0);opacity:1}100%{clip-path:inset(100% 0 0 0);opacity:0}}",
      "@keyframes gwfxImpact{0%{opacity:.95;transform:scale(.3)}100%{opacity:0;transform:scale(2.4,2)}}",
      "@keyframes gwfxMist{0%{opacity:0;transform:scale(.5)}30%{opacity:.7}100%{opacity:0;transform:translateY(-6px) scale(1.4)}}",
      "@keyframes gwfxSp{0%{opacity:0;transform:translate(0,0)}12%{opacity:1}45%{transform:translate(calc(var(--dx)*.6),var(--dy))}100%{opacity:0;transform:translate(var(--dx),calc(var(--dy)*.1 + 6px))}}",
      "@keyframes gwfxRing{0%{opacity:.9;transform:translate(-50%,-50%) scale(.15)}100%{opacity:0;transform:translate(-50%,-50%) scale(var(--rx,3),var(--ry,1.4))}}",
      "@keyframes gwfxBandR{0%{opacity:0;transform:translateX(-60%)}20%{opacity:.9}100%{opacity:0;transform:translateX(var(--wx,190%))}}",
      "@keyframes gwfxBandL{0%{opacity:0;transform:translateX(60%)}20%{opacity:.9}100%{opacity:0;transform:translateX(calc(var(--wx,190%)*-1))}}",
      "@keyframes gwfxLook{0%,100%{transform:none}25%,70%{transform:translate(calc(3px*var(--gwAmp,1)),calc(1px*var(--gwAmp,1))) rotate(calc(7deg*var(--gwAmp,1)))}}",
      "@keyframes gwfxDown{0%,100%{transform:none}35%,65%{transform:translate(calc(3px*var(--gwAmp,1)),calc(4px*var(--gwAmp,1))) rotate(calc(10deg*var(--gwAmp,1))) scaleY(.97)}}",
      "@keyframes gwfxPoint{0%,100%{transform:none}30%{transform:translate(calc(6px*var(--gwAmp,1)),0) rotate(calc(9deg*var(--gwAmp,1)))}50%{transform:translate(calc(4px*var(--gwAmp,1)),calc(-3px*var(--gwAmp,1))) rotate(calc(5deg*var(--gwAmp,1)))}70%{transform:translate(calc(6px*var(--gwAmp,1)),0) rotate(calc(9deg*var(--gwAmp,1)))}}",
      "@keyframes gwfxCheer{0%,100%{transform:none}25%{transform:translateY(calc(-9px*var(--gwAmp,1))) scale(1.04)}50%{transform:none}75%{transform:translateY(calc(-6px*var(--gwAmp,1)))}}",
      "@keyframes gwfxJourney{0%{opacity:0;transform:translateY(0) scale(.7)}25%{opacity:.85}100%{opacity:0;transform:translateY(-34vh) scale(1.25)}}",

      /* reduced motion: static highlight + one soft ripple that fades in; nothing travels */
      "@media (prefers-reduced-motion:reduce){"+
        R+" .gwStage *{animation:none!important}"+
        R+" .gwSheen,"+R+" .gwBand,"+R+" .gwDrop,"+R+" .gwStream,"+R+" .gwSplash{display:none!important}"+
        R+" .gwStage .gwRing{opacity:0;transform:translate(-50%,-50%) scale(2.2,1)!important;transition:opacity .45s ease!important}"+
        R+" .gwStage .gwRing.on{opacity:.6}"+
        R+" .gwStage .gwCap{transition:opacity .45s ease!important;transform:none}"+
        R+" .gwBeaver{animation:none!important}"+
      "}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- mount: stage lives inside the existing overlay, after the card ---------- */
  function mount(){
    var root = document.getElementById(PID);
    if(!root) return false;
    if(S.root === root && S.stage && root.contains(S.stage)) return true;
    css();
    var stage = document.createElement("div");
    stage.className = "gwStage";
    stage.innerHTML =
      '<i class="gwLip" aria-hidden="true"></i>'+
      '<div class="gwFx" aria-hidden="true"></div>'+
      '<div class="gwPool">'+
        '<i class="gwSurf" aria-hidden="true"></i><i class="gwSheen" aria-hidden="true"></i>'+
        '<div class="gwRings" aria-hidden="true"></div>'+
        '<i class="gwBand gwBandL" aria-hidden="true" style="display:none"></i><i class="gwBand gwBandR" aria-hidden="true" style="display:none"></i>'+
        '<b class="gwCap" role="status" aria-live="polite"></b>'+
      '</div>';
    root.appendChild(stage);
    S.root = root; S.stage = stage;
    S.fx = $(".gwFx", stage); S.rings = $(".gwRings", stage); S.cap = $(".gwCap", stage);

    var card = $(".gwCard", root);
    if(card) card.addEventListener("click", function(e){
      if(e.target.closest && e.target.closest("button,input,label,a,.gwClose")) return;
      handlePlayerTap();
    });
    /* remember a BEGIN / backdrop dismissal so the last wave can travel into the game */
    root.addEventListener("click", function(e){
      var t = e.target;
      if(t === root || (t && t.id === "geiWelcomeBegin")) S.begin = Date.now();
    }, true);

    try{
      new MutationObserver(function(){
        var shown = root.classList.contains("show");
        if(shown && !S.running) start(root.getAttribute("data-mode") || "first");
        else if(!shown && S.running) stop();
      }).observe(root, { attributes:true, attributeFilter:["class"] });
    }catch(e){}
    return true;
  }

  /* ---------- character: the PLAYER's active character is the one that reacts ---------- */
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
    if(names.indexOf(kind) < 0) kind = "look";
    names.forEach(function(n){ host.classList.remove("gwR-" + n); });
    void host.offsetWidth;
    host.classList.add("gwR-" + kind);
    var done = function(){ host.classList.remove("gwR-" + kind); host.removeEventListener("animationend", done); };
    host.addEventListener("animationend", done);
    later(done, 1700);
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

  /* gather → stretch → release → fall. Calls onLand() when the drop reaches the reservoir. */
  function createDrop(o){
    o = o || {};
    if(!S.fx || !budget()) return null;
    var el = make("gwDrop", S.fx);
    el.style.setProperty("--s", String(o.size || 1));
    var dur = o.quick ? .72 : (o.dur || 1.05);
    el.style.setProperty("--dd", dur + "s");
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
    if(!o.silent) later(function(){ sound("drop", !!o.gesture); }, el.__dur * .5);
    return el;
  }
  function createStream(o, onLand){
    o = o || {};
    if(!S.fx || !budget()){ if(onLand) onLand(); return null; }
    var el = make("gwStream", S.fx), dur = o.dur || 1.7;
    el.style.setProperty("--sd", dur + "s");
    track(el, dur * 1000 + 100);
    later(function(){ createSplash({ size:.7, gesture:!!o.gesture }); sound("splash", !!o.gesture); }, dur * 1000 * .3);
    later(function(){ createSplash({ size:.7 }); }, dur * 1000 * .55);
    later(function(){ if(onLand) onLand(); }, dur * 1000 * .72);
    sound("drop", !!o.gesture);
    return el;
  }
  function createSplash(o){
    o = o || {};
    if(!S.fx || !budget()) return null;
    var size = o.size || 1, box = make("gwSplash", S.fx);
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
  /* ripple = expanding rings in the reservoir, same ring language as the game's tap ripples */
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
      r.style.setProperty("--rx", (2.6 + size * 1.1).toFixed(2));
      r.style.setProperty("--ry", (1.2 + size * .35).toFixed(2));
      r.style.setProperty("--rd", (1.3 + size * .35).toFixed(2) + "s");
      r.style.setProperty("--rdl", (i * .22).toFixed(2) + "s");
      track(r, (1.3 + size * .35 + i * .22) * 1000 + 100);
      first = first || r;
    }
    return first;
  }
  /* wave = one soft crest travelling outward from the impact point; calm, never continuous */
  function createWave(o){
    o = o || {};
    if(S.reduced || !S.stage) return null;
    var l = $(".gwBandL", S.stage), r = $(".gwBandR", S.stage);
    if(!l || !r) return null;
    var wd = (o.strength || 1) > 1 ? 2.8 : 2.3;
    [l, r].forEach(function(b){
      b.style.display = "none"; void b.offsetWidth;
      b.style.setProperty("--wd", wd + "s");
      b.style.display = "";
    });
    if(!o.silent) sound("wave", !!o.gesture);
    return true;
  }

  function caption(text, hold){
    if(!S.cap) return;
    clearTimeout(S.capT);
    S.cap.textContent = text;
    S.cap.classList.add("on");
    if(hold) S.capT = setTimeout(function(){ if(S.cap) S.cap.classList.remove("on"); }, hold);
  }
  function flowing(on){ if(S.root) S.root.classList.toggle("gwFlowing", !!on); }

  /* ---------- the welcome sequence ---------- */
  function landing(o){
    o = o || {};
    createSplash({ size:o.splash || 1 });
    createRipple({ rings:o.rings || 2, size:o.ripple || 1 });
    if(o.wave) createWave({ strength:o.wave });
    if(!o.noCap){ flowing(true); caption("THE FLOW HAS STARTED."); }
    if(!o.noReact) triggerCharacterReaction(o.react || "down");
  }
  function runSequence(v){
    if(S.reduced){
      later(function(){ createRipple(); flowing(true); caption("THE FLOW HAS STARTED."); }, 500);
      return;
    }
    var T = 750;   // the card arrives first
    function finish(extraMs){
      later(function(){ triggerCharacterReaction("cheer"); }, 650);
      later(function(){ scheduleIdle(); }, (extraMs || 2200));
    }
    switch(v){
      case "B":   // three small drops
        [0, 480, 960].forEach(function(d, i){
          later(function(){
            releaseDrop({ size:.8, dur:1 }, function(){
              if(i < 2) createSplash({ size:.6 });
              else{ landing({ splash:.9, wave:1 }); finish(2400); }
            });
            if(i === 0) triggerCharacterReaction("look");
          }, T + d);
        });
        break;
      case "C":   // tiny continuous stream
        later(function(){
          triggerCharacterReaction("look");
          createStream({ dur:1.8 }, function(){ landing({ splash:.8, ripple:1, wave:1 }); finish(2200); });
        }, T);
        break;
      case "D":   // one drop, then a larger, softer ripple
        later(function(){
          releaseDrop({ size:1.1 }, function(){ landing({ ripple:1.8, rings:3, wave:0 }); finish(2600); });
          triggerCharacterReaction("look");
        }, T);
        break;
      case "E":   // drop → soft wave pulse takes the lead
        later(function(){
          releaseDrop({ size:1 }, function(){ landing({ ripple:.9, wave:2 }); later(function(){ createWave({ strength:2 }); }, 1500); finish(3200); });
          triggerCharacterReaction("look");
        }, T);
        break;
      case "F":   // the character reacts first, then the water drops
        triggerCharacterReaction("point");
        later(function(){
          releaseDrop({ size:1 }, function(){ landing({ wave:1 }); finish(2200); });
        }, T + 700);
        break;
      default:    // A — one large drop
        later(function(){
          releaseDrop({ size:1.3 }, function(){ landing({ splash:1.2, wave:1 }); finish(2200); });
          triggerCharacterReaction("look");
        }, T);
    }
  }
  /* calm repeating rhythm: a handful of quiet pulses, then stillness. Skips while the tab is hidden. */
  function scheduleIdle(){
    if(!S.running || S.reduced || S.idleRuns >= IDLE_MAX) return;
    later(function(){
      if(!S.running) return;
      if(document.hidden){ scheduleIdle(); return; }
      S.idleRuns++;
      releaseDrop({ size:.8, silent:true }, function(){
        createSplash({ size:.6 }); createRipple({ rings:1, size:.7 }); createWave({ strength:1, silent:true });
        scheduleIdle();
      });
    }, IDLE_EVERY);
  }

  /* ---------- optional player interaction: tap the card 3× ---------- */
  function handlePlayerTap(){
    if(!S.running) return false;
    var t = Date.now();
    if(t - S.lastTap < TAP_GAP) return false;
    S.lastTap = t;
    S.taps = (S.taps % 3) + 1;
    var n = S.taps;
    if(S.reduced){
      createRipple();
      caption(n === 3 ? "FLOW ACTIVATED! 🚀" : "THE FLOW HAS STARTED.", n === 3 ? 2200 : 0);
      sound(n === 3 ? "activate" : "drop", true);
      return true;
    }
    if(n === 1){            // 💧 small drop
      releaseDrop({ size:.8, quick:true, gesture:true }, function(){ createSplash({ size:.6 }); createRipple({ rings:1, size:.7 }); });
      triggerCharacterReaction("look");
    } else if(n === 2){     // 💦 larger splash
      releaseDrop({ size:1.15, quick:true, gesture:true }, function(){ createSplash({ size:1.5 }); createRipple({ rings:2, size:1 }); });
      triggerCharacterReaction("point");
    } else {                // 🌊 larger ripple → FLOW ACTIVATED
      releaseDrop({ size:1.3, quick:true, gesture:true }, function(){
        createSplash({ size:1.5 }); createRipple({ rings:3, size:1.8 }); createWave({ strength:2, gesture:true });
        caption("FLOW ACTIVATED! 🚀", 2200); flowing(true); sound("activate", true);
        triggerCharacterReaction("cheer");
        later(function(){ if(S.running) caption("THE FLOW HAS STARTED."); }, 2300);
      });
    }
    return true;
  }

  /* ---------- journey: the final wave drifts toward the game, then it's gone ---------- */
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
    clearTimeout(S.capT);
    S.active = 0; S.taps = 0; S.idleRuns = 0; S.lastTap = 0;
    if(S.fx) S.fx.innerHTML = "";
    if(S.rings) S.rings.innerHTML = "";
    if(S.cap){ S.cap.classList.remove("on"); S.cap.textContent = ""; }
    if(S.stage) Array.prototype.forEach.call(S.stage.querySelectorAll(".gwBand"), function(b){ b.style.display = "none"; });
    var host = S.root && $(".gwBeaver", S.root);
    if(host) host.className = host.className.replace(/\bgwR-\w+/g, "").trim();
    flowing(false);
  }
  function start(mode){
    if(!mount()) return false;
    reset();
    S.running = true;
    S.mode = mode === "review" ? "review" : "first";
    S.reduced = reduced();
    var v = S.forced && S.forced.variation || S.variation;
    applyTone(S.forced && S.forced.tone || S.tone || pickTone());
    syncCharacter();
    runSequence(v);
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
      if(S.root.classList.contains("show")) start(S.root.getAttribute("data-mode") || "first");
      return;
    }
    if((tries || 0) < 60) setTimeout(function(){ install((tries || 0) + 1); }, 200);
  }

  window.__GEI_FLOW_WELCOME__ = Object.freeze({
    version:VERSION, presentationOnly:true,
    createDrop:createDrop, releaseDrop:releaseDrop, createStream:createStream, createSplash:createSplash,
    createRipple:createRipple, createWave:createWave, triggerCharacterReaction:triggerCharacterReaction,
    handlePlayerTap:handlePlayerTap, reset:reset, start:start, stop:stop, configure:configure,
    variation:function(){ return (S.forced && S.forced.variation) || S.variation; },
    tone:function(){ return S.tone && S.tone.id; },
    state:function(){ return { running:S.running, taps:S.taps, active:S.active, reduced:S.reduced, mode:S.mode }; },
    tones:{ natural:NATURAL.map(function(t){ return t.id; }), wow:WOW.map(function(t){ return t.id; }) },
    variations:VARIATIONS.slice()
  });

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ install(0); }, { once:true });
  else install(0);
})();
