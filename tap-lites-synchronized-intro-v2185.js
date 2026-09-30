/* V2.1.85 — TAP LITES RANDOM SCENE + CHARACTER + SOUND SYNCHRONIZED INTRO
 * Presentation-only intro orchestrator.
 * Uses the already-selected V2.1.83 scene as the single source of intro identity,
 * coordinates the existing character spotlight and existing nature/sound layers,
 * and hands off through V2.1.84 without changing authoritative gameplay/economy state.
 */
(function(){
  "use strict";

  var I={
    started:false,
    scene:null,
    released:false,
    timer:null,
    styleId:"tapLites2185Style"
  };

  var SCENE_MAP={
    "morning-spring":{emoji:"🌄",crew:"MORNING CREW",nature:"MORNING BIRDS",tone:"source",cue:"SOURCE FLOW"},
    "dam-dawn":{emoji:"💧",crew:"WATER CREW",nature:"MEADOW WIND",tone:"dam",cue:"PRESSURE FLOW"},
    "mill-current":{emoji:"⚙️",crew:"MILL CREW",nature:"WETLAND FLOW",tone:"mill",cue:"MACHINE FLOW"},
    "ocean-breeze":{emoji:"🌊",crew:"OCEAN CREW",nature:"OCEAN BREEZE",tone:"ocean",cue:"DOWNSTREAM FLOW"},
    "nite-water":{emoji:"🌙",crew:"NITE CREW",nature:"NIGHT WATER",tone:"night",cue:"NIGHT FLOW"},
    "storm-pressure":{emoji:"⛈️",crew:"NATURE CREW",nature:"STORM RAIN",tone:"storm",cue:"SURGE FLOW"},
    "dam-nation":{emoji:"🔥",crew:"DAM NATION",nature:"DAM NATION ENERGY",tone:"overdrive",cue:"FULL SYSTEM"},
    "spark-flow":{emoji:"✨",crew:"SPARK CREW",nature:"BIRD & WATER",tone:"spark",cue:"LITE FLOW"}
  };

  function getScene(){
    try{
      var root=document.documentElement;
      var id=root.getAttribute("data-tap-lites-scene");
      if(id)return {id:id,pace:root.getAttribute("data-tap-lites-scene-pace")||"soft",accent:root.getAttribute("data-tap-lites-scene-accent")||"source"};
    }catch(e){}
    try{
      var api=window.__GEI_TAP_LITES_RANDOM_SCENE__;
      if(api && api.currentScene)return {
        id:api.currentScene,
        pace:api.scenePace||"soft",
        accent:api.sceneAccent||"source"
      };
    }catch(e){}
    return {id:"morning-spring",pace:"soft",accent:"source"};
  }

  function info(){
    return SCENE_MAP[I.scene&&I.scene.id]||SCENE_MAP["morning-spring"];
  }

  function addStyle(){
    if(document.getElementById(I.styleId))return;
    var s=document.createElement("style");
    s.id=I.styleId;
    s.textContent=
      ".tl2185IntroGlow{position:fixed;inset:0;z-index:9996;pointer-events:none;opacity:0;"+
      "background:radial-gradient(circle at 50% 42%,rgba(47,210,255,.18),transparent 28%),"+
      "linear-gradient(180deg,rgba(6,7,13,0),rgba(6,7,13,.24));"+
      "animation:tl2185GlowIn 1.45s ease-out forwards}"+
      ".tl2185IntroBadge{position:fixed;left:50%;top:11%;transform:translate(-50%,-8px) scale(.94);z-index:9997;"+
      "width:min(86vw,420px);padding:10px 14px;border-radius:18px;text-align:center;pointer-events:none;"+
      "background:rgba(6,7,13,.72);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(14px);"+
      "box-shadow:0 14px 54px rgba(0,0,0,.34);opacity:0;"+
      "transition:opacity .34s ease,transform .44s cubic-bezier(.2,.8,.2,1)}"+
      ".tl2185IntroBadge.show{opacity:1;transform:translate(-50%,0) scale(1)}"+
      ".tl2185IntroBadge .emoji{font-size:22px;line-height:1;margin-bottom:4px}"+
      ".tl2185IntroBadge .title{font:900 clamp(16px,4.8vw,24px)/1.1 system-ui,sans-serif;color:#fff;letter-spacing:.09em}"+
      ".tl2185IntroBadge .sub{margin-top:5px;font:800 9px/1.2 system-ui,sans-serif;color:#bfefff;letter-spacing:.14em}"+
      ".tl2185IntroBadge .crew{margin-top:8px;font:700 9px/1 system-ui,sans-serif;color:rgba(234,252,255,.58);letter-spacing:.1em}"+
      ".tl2185IntroSync{position:fixed;left:50%;bottom:13%;transform:translate(-50%,8px);z-index:9997;"+
      "pointer-events:none;padding:8px 12px;border-radius:999px;background:rgba(6,7,13,.5);"+
      "border:1px solid rgba(255,255,255,.12);font:900 9px/1 system-ui,sans-serif;letter-spacing:.12em;color:#eafcff;"+
      "opacity:0;transition:opacity .25s,transform .35s}"+
      ".tl2185IntroSync.show{opacity:.86;transform:translate(-50%,0)}"+
      ".tl2185Scene-morning-spring{--tl2185A:#2fd2ff}.tl2185Scene-dam-dawn{--tl2185A:#3d3dea}"+
      ".tl2185Scene-mill-current{--tl2185A:#f310ba}.tl2185Scene-ocean-breeze{--tl2185A:#2fd2ff}"+
      ".tl2185Scene-nite-water{--tl2185A:#7a8cff}.tl2185Scene-storm-pressure{--tl2185A:#ff9d45}"+
      ".tl2185Scene-dam-nation{--tl2185A:#ff3dc8}.tl2185Scene-spark-flow{--tl2185A:#ff9df2}"+
      ".tl2185IntroBadge{box-shadow:0 16px 60px rgba(0,0,0,.36),0 0 34px color-mix(in srgb,var(--tl2185A,#2fd2ff) 18%,transparent)}"+
      ".tl2185IntroBadge .title{text-shadow:0 0 18px color-mix(in srgb,var(--tl2185A,#2fd2ff) 34%,transparent)}"+
      "@keyframes tl2185GlowIn{0%{opacity:0}24%{opacity:.72}100%{opacity:.08}}"+
      "@media (prefers-reduced-motion:reduce){.tl2185IntroGlow{animation:none;opacity:.06}.tl2185IntroBadge,.tl2185IntroSync{transition:none}}";
    document.head.appendChild(s);
  }

  function nodes(){
    var glow=document.getElementById("tl2185IntroGlow");
    if(!glow){
      glow=document.createElement("div");
      glow.id="tl2185IntroGlow";
      glow.className="tl2185IntroGlow";
      document.body.appendChild(glow);
    }
    var badge=document.getElementById("tl2185IntroBadge");
    if(!badge){
      badge=document.createElement("div");
      badge.id="tl2185IntroBadge";
      badge.className="tl2185IntroBadge";
      badge.innerHTML='<div class="emoji"></div><div class="title"></div><div class="sub"></div><div class="crew"></div>';
      document.body.appendChild(badge);
    }
    var sync=document.getElementById("tl2185IntroSync");
    if(!sync){
      sync=document.createElement("div");
      sync.id="tl2185IntroSync";
      sync.className="tl2185IntroSync";
      document.body.appendChild(sync);
    }
    return {glow:glow,badge:badge,sync:sync};
  }

  function cueCharacter(){
    try{
      var spotlight=document.getElementById("geiCharacterSpotlight");
      if(spotlight){
        spotlight.dataset.introScene=I.scene.id;
        spotlight.dataset.introCrew=info().crew;
        spotlight.dataset.introNature=info().nature;
        spotlight.classList.remove("tl2185CharacterCue");
        void spotlight.offsetWidth;
        spotlight.classList.add("tl2185CharacterCue");
        setTimeout(function(){spotlight.classList.remove("tl2185CharacterCue")},1250);
      }
    }catch(e){}
    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction("tap",1.08);
      }
    }catch(e){}
  }

  function cueSound(){
    try{
      var api=window.__GEI_TAP_LITES_HYDRAULIC_SOUND__;
      if(api && typeof api.playStageCue==="function"){
        api.playStageCue(I.scene.accent);
        return;
      }
    }catch(e){}
    try{
      var nat=window.__GEI_TAP_LITES_SOUND_NATURE__;
      if(nat && typeof nat.playStageCue==="function"){
        nat.playStageCue(I.scene.accent);
      }
    }catch(e){}
  }

  function cueAtmosphere(){
    try{
      var atm=window.__GEI_TAP_LITES_SESSION_ATMOSPHERE__;
      if(atm && typeof atm.selfTest==="function")atm.selfTest();
    }catch(e){}
  }

  function show(){
    var n=nodes(),m=info();
    n.badge.className="tl2185IntroBadge tl2185Scene-"+I.scene.id;
    n.badge.querySelector(".emoji").textContent=m.emoji;
    n.badge.querySelector(".title").textContent=I.scene.id.replace(/-/g," ").toUpperCase();
    n.badge.querySelector(".sub").textContent="TAP LITES • "+m.nature;
    n.badge.querySelector(".crew").textContent=m.crew+" • "+m.cue;
    n.badge.classList.remove("show");
    void n.badge.offsetWidth;
    n.badge.classList.add("show");

    n.sync.textContent="SYNC: SCENE • CHARACTER • SOUND";
    n.sync.classList.remove("show");
    void n.sync.offsetWidth;
    n.sync.classList.add("show");

    setTimeout(function(){cueCharacter()},240);
    setTimeout(function(){cueSound()},320);
    setTimeout(function(){cueAtmosphere()},380);
    setTimeout(function(){n.sync.classList.remove("show")},1050);
    setTimeout(function(){n.badge.classList.remove("show")},1450);
    setTimeout(function(){n.glow.remove()},1700);
  }

  function release(){
    if(I.released)return;
    I.released=true;
    clearTimeout(I.timer);
    try{
      var transition=window.__GEI_TAP_LITES_SCENE_TRANSITION__;
      if(transition && typeof transition.release==="function"){
        transition.release();
        return;
      }
    }catch(e){}
    var veil=document.getElementById("tl2184TransitionVeil");
    if(veil){
      veil.classList.add("release");
      setTimeout(function(){veil.style.display="none"},900);
    }
  }

  function firstInteraction(){
    release();
    document.removeEventListener("pointerdown",firstInteraction,true);
  }

  function startup(){
    if(I.started)return;
    I.started=true;
    addStyle();
    I.scene=getScene();
    show();
    document.addEventListener("pointerdown",firstInteraction,true);
    I.timer=setTimeout(function(){ if(!I.released && !document.hidden) release(); },1850);

    window.__GEI_TAP_LITES_SYNC_INTRO__=Object.freeze({
      version:"V2.1.85",
      presentationOnly:true,
      scene:I.scene.id,
      crew:info().crew,
      nature:info().nature,
      characterSynchronized:true,
      soundSynchronized:true,
      gameplayStateChanged:false
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();