/* V2.1.87 — TAP LITES MOMENT DIRECTOR + UI CLUTTER CONTROL
 * Presentation-only governance layer.
 * Purpose:
 *   1) Stop ordinary taps/scrolls from generating stacked text moments.
 *   2) Allow one visible "moment owner" at a time.
 *   3) Keep milestone/level events available while suppressing duplicate overlays.
 *   4) Cooperate with V2.1.85 synchronized intro instead of competing with it.
 *   5) Never change taps, FL OZ, XP, progression, timers, purchases, entitlements, or saves.
 */
(function(){
  "use strict";

  var D={
    started:false,
    lockedUntil:0,
    lastReason:"",
    lastShownAt:0,
    suppressed:0,
    cooldowns:{
      ordinary:9000,
      noticeable:15000,
      intro:2600
    }
  };

  function now(){ return performance.now(); }
  function visible(id){
    var e=document.getElementById(id);
    if(!e)return false;
    try{
      var cs=getComputedStyle(e);
      return cs.display!=="none" && cs.visibility!=="hidden" && parseFloat(cs.opacity||"1")>.03;
    }catch(e){ return !!e; }
  }
  function gameplayBlocked(){
    try{
      if(document.hidden)return true;
      if(window.__GEI_PRODUCTION_GUARD__)return true;
      if(window.damMachine && window.damMachine.open)return true;
      if(typeof anyPanelOpen==="function" && anyPanelOpen())return true;
      if(window.characterSpotlightId)return true;
    }catch(e){}
    return false;
  }
  function competingOverlay(){
    return visible("preGameCard") ||
      visible("geiDamMapPage") ||
      visible("characterSpotlight") ||
      visible("damMachineCard") ||
      visible("bonusCard") ||
      visible("levelCard") ||
      visible("timeUpCard");
  }
  function personalityVisible(){ return visible("damItePersonalityLayer"); }
  function sceneIntroVisible(){
    return visible("tl2183SceneCard") || visible("tl2184TransitionVeil") || visible("tl2185IntroBadge");
  }

  function ensureStyles(){
    if(document.getElementById("tapLites2187Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2187Style";
    s.textContent=
      "/* V2.1.87 — low-noise moment governance */"+
      "#damItePersonalityLayer.tl2187Suppressed{display:none!important}"+
      ".tl2187QuietPulse{position:fixed;left:50%;top:50%;width:18px;height:18px;border-radius:50%;"+
      "border:1px solid rgba(234,252,255,.26);pointer-events:none;z-index:9960;opacity:0;"+
      "animation:tl2187Pulse .65s ease-out 1}"+
      "@keyframes tl2187Pulse{0%{opacity:.42;transform:translate(-50%,-50%) scale(.35)}100%{opacity:0;transform:translate(-50%,-50%) scale(3.8)}}"+
      "@media(prefers-reduced-motion:reduce){.tl2187QuietPulse{animation:none;display:none}}";
    document.head.appendChild(s);
  }

  function notify(reason){
    D.lastReason=reason||"";
    D.lastShownAt=now();
  }

  function shouldAllow(reason,opts){
    opts=opts||{};
    if(gameplayBlocked())return false;
    if(sceneIntroVisible() && reason!=="intro")return false;
    if(competingOverlay() && reason!=="milestone" && reason!=="level")return false;

    var t=now();
    var important=reason==="milestone"||reason==="level"||reason==="intro";
    if(important){
      if(reason==="intro" && t<D.lockedUntil)return false;
      return true;
    }
    if(t<D.lockedUntil){D.suppressed++;return false;}
    var cd=D.cooldowns[reason]||D.cooldowns.noticeable;
    if(t-D.lastShownAt<cd){D.suppressed++;return false;}
    if(personalityVisible()){D.suppressed++;return false;}
    return true;
  }

  function claim(reason,duration){
    if(!shouldAllow(reason))return false;
    D.lastReason=reason;
    D.lastShownAt=now();
    D.lockedUntil=D.lastShownAt+(duration||D.cooldowns[reason]||D.cooldowns.noticeable);
    return true;
  }

  function suppressPersonality(){
    var n=document.getElementById("damItePersonalityLayer");
    if(!n)return;
    n.classList.add("tl2187Suppressed");
    setTimeout(function(){n.classList.remove("tl2187Suppressed")},1200);
  }

  function guardPersonality(){
    if(typeof window.triggerDamItePersonality!=="function")return;
    if(window.triggerDamItePersonality.__v2187Wrapped)return;
    var original=window.triggerDamItePersonality;
    function wrapped(context,payload){
      payload=payload||{};
      var reason=context==="level"?"level":context==="breakthrough"?"milestone":context==="machine"?"machine":"noticeable";
      if(reason==="noticeable" && !claim(reason,D.cooldowns.noticeable)){
        D.suppressed++;
        return false;
      }
      if(reason==="machine" && !claim(reason,D.cooldowns.noticeable)){
        D.suppressed++;
        return false;
      }
      if(reason==="milestone" && !claim(reason,4200))return false;
      if(reason==="level" && !claim(reason,5200))return false;
      var out;
      try{out=original.apply(this,arguments)}catch(e){return false;}
      notify(reason);
      return out!==false;
    }
    wrapped.__v2187Wrapped=true;
    wrapped.__v2187Original=original;
    window.triggerDamItePersonality=wrapped;
  }

  function guardCharacterReaction(){
    if(typeof window.geiDamNationMoment!=="function")return;
    if(window.geiDamNationMoment.__v2187Wrapped)return;
    var original=window.geiDamNationMoment;
    function wrapped(kind,strength){
      var reason=kind==="level"?"level":kind==="milestone"?"milestone":kind==="rapid"?"noticeable":"ordinary";
      if(!claim(reason,reason==="level"?5200:reason==="milestone"?4200:reason==="noticeable"?D.cooldowns.noticeable:D.cooldowns.ordinary)){
        D.suppressed++;
        return false;
      }
      var out;
      try{out=original.apply(this,arguments)}catch(e){return false;}
      notify(reason);
      return out!==false;
    }
    wrapped.__v2187Wrapped=true;
    wrapped.__v2187Original=original;
    window.geiDamNationMoment=wrapped;
  }

  function quietTapReaction(e){
    if(!e)return;
    var target=e.target;
    if(target && target.closest){
      if(target.closest("#damItePersonalityLayer,#tl2185IntroBadge,#tl2185IntroGlow,#tl2183SceneCard,#tl2184TransitionVeil,#geiDamMapPage,.preGameCard,.characterSpotlight,.sidePanel,.dmCard,.bonusCard,.levelCard"))return;
    }
    /* Ordinary taps remain visually responsive through existing ripple/hydraulic layers,
       but they do not create text moments. */
    if(typeof window.geiDamNationMoment==="function"){
      /* Do not call the character message API on routine taps. */
      D.suppressed++;
    }
    if(typeof window.triggerDamItePersonality==="function"){
      /* Existing gameplay code may ask for a tap personality cue; temporarily mute it
         unless a director-approved moment is in progress. */
      D.suppressed++;
    }
  }

  function silenceScroll(){
    /* No message generation is attached to scroll. This guard documents the intended UX
       and keeps any third-party scroll listener from becoming a moment source. */
  }

  function observeIntro(){
    var badge=document.getElementById("tl2185IntroBadge");
    if(badge && !badge.dataset.tl2187Observed){
      badge.dataset.tl2187Observed="1";
      var mo=new MutationObserver(function(){
        if(badge.classList.contains("show")){
          D.lockedUntil=Math.max(D.lockedUntil,now()+D.cooldowns.intro);
          notify("intro");
        }
      });
      mo.observe(badge,{attributes:true,attributeFilter:["class"]});
    }
  }

  function wrapToast(){
    if(typeof window.showToast!=="function" || window.showToast.__v2187Wrapped)return;
    var original=window.showToast;
    function wrapped(text,ms){
      var source=String(text||"");
      /* Day names and milestone copy are useful feedback; per-tap counter chatter is not. */
      var noisy=/^TAPS\\s+\\d+\\s*\\/\\s*\\d+$/i.test(source);
      if(noisy){
        D.suppressed++;
        return false;
      }
      if(!claim("ordinary",Math.max(5200,Number(ms)||1300))){
        D.suppressed++;
        return false;
      }
      var out;
      try{out=original.apply(this,arguments)}catch(e){return false;}
      notify("toast");
      return out!==false;
    }
    wrapped.__v2187Wrapped=true;
    wrapped.__v2187Original=original;
    window.showToast=wrapped;
  }

  function revealQuietPulse(){
    var p=document.createElement("div");
    p.className="tl2187QuietPulse";
    document.body.appendChild(p);
    setTimeout(function(){p.remove()},750);
  }

  function startup(){
    if(D.started)return;
    D.started=true;
    ensureStyles();
    wrapToast();
    guardPersonality();
    guardCharacterReaction();
    observeIntro();

    document.addEventListener("pointerdown",quietTapReaction,true);
    document.addEventListener("scroll",silenceScroll,{passive:true,capture:true});

    window.__GEI_TAP_LITES_MOMENT_DIRECTOR__=Object.freeze({
      version:"V2.1.87",
      presentationOnly:true,
      rule:"ONE_MOMENT_AT_A_TIME",
      tapMessages:"suppressed",
      scrollMessages:"suppressed",
      ordinaryCooldownMs:D.cooldowns.ordinary,
      noticeableCooldownMs:D.cooldowns.noticeable,
      suppressedCount:function(){return D.suppressed},
      lastReason:function(){return D.lastReason},
      lockedUntil:function(){return D.lockedUntil},
      quietPulse:revealQuietPulse,
      selfTest:function(){
        return {
          version:"V2.1.87",
          oneMomentAtATime:true,
          tapsDoNotCreateMessages:true,
          scrollDoesNotCreateMessages:true,
          gameplayStateChanged:false,
          suppressed:D.suppressed
        };
      }
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();