/* V2.1.83 — TAP LITES RANDOM HYDRAULIC SCENE ENGINE
 * Presentation-only scene director.
 * Randomizes temporary opening atmosphere, hydraulic emphasis, nature accent,
 * character impression, and intro pacing. Never changes gameplay/economy/save data.
 */
(function(){
  "use strict";

  var SCENES=[
    {id:"morning-spring",label:"MORNING SPRING",icon:"🌄",nature:"🐦",natureLabel:"MORNING BIRDS",mood:"calm",accent:"source",pace:"soft",line:"THE MOUNTAIN IS WAKING"},
    {id:"dam-dawn",label:"DAM DAWN",icon:"💧",nature:"🌿",natureLabel:"MEADOW WIND",mood:"building",accent:"dam",pace:"rising",line:"PRESSURE STARTS HERE"},
    {id:"mill-current",label:"MILL CURRENT",icon:"⚙️",nature:"🦆",natureLabel:"WETLAND FLOW",mood:"surge",accent:"mill",pace:"rhythmic",line:"LET THE WHEEL TURN"},
    {id:"ocean-breeze",label:"OCEAN BREEZE",icon:"🌊",nature:"🌊",natureLabel:"OCEAN BREEZE",mood:"release",accent:"ocean",pace:"wide",line:"SEND THE CURRENT DOWNSTREAM"},
    {id:"nite-water",label:"NITE WATER",icon:"🌙",nature:"🌙",natureLabel:"NIGHT WATER",mood:"calm",accent:"night",pace:"mystery",line:"THE NIGHT FLOW IS ALIVE"},
    {id:"storm-pressure",label:"STORM PRESSURE",icon:"⛈️",nature:"⛈️",natureLabel:"STORM RAIN",mood:"surge",accent:"pressure",pace:"electric",line:"PRESSURE IS RISING"},
    {id:"dam-nation",label:"DAM NATION",icon:"🔥",nature:"🔥",natureLabel:"DAM NATION ENERGY",mood:"overdrive",accent:"overdrive",pace:"burst",line:"THE SYSTEM IS ALIVE"},
    {id:"spark-flow",label:"SPARK FLOW",icon:"✨",nature:"🐦",natureLabel:"BIRD & WATER",mood:"building",accent:"spark",pace:"playful",line:"MAKE A SPLASH"}
  ];

  var S={
    started:false,scene:null,sceneKey:"tapLitesV2183Scene",recentKey:"tapLitesV2183Recent",
    introTimer:null
  };

  function css(){
    if(document.getElementById("tapLites2183Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2183Style";
    s.textContent=
      ".tl2183SceneVeil{position:fixed;inset:0;z-index:9980;pointer-events:none;opacity:0;"+
      "background:radial-gradient(circle at 50% 46%,rgba(47,210,255,.18),transparent 34%),"+
      "linear-gradient(180deg,rgba(6,7,13,.02),rgba(6,7,13,.22));transition:opacity .7s ease}"+
      ".tl2183SceneVeil.active{opacity:var(--tl2183Opacity,.25)}"+
      ".tl2183SceneCard{position:fixed;left:50%;top:22%;transform:translate(-50%,-10px) scale(.94);z-index:9993;"+
      "width:min(88vw,430px);padding:14px 16px;border-radius:20px;text-align:center;pointer-events:none;opacity:0;"+
      "background:radial-gradient(circle at 50% 0%,rgba(47,210,255,.18),rgba(6,7,13,.86) 64%);"+
      "border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(15px);"+
      "box-shadow:0 20px 70px rgba(0,0,0,.48),0 0 40px rgba(47,210,255,.14);"+
      "transition:opacity .2s,transform .42s cubic-bezier(.2,.8,.2,1)}"+
      ".tl2183SceneCard.show{opacity:1;transform:translate(-50%,0) scale(1)}"+
      ".tl2183SceneCard .icon{font-size:34px;line-height:1;margin-bottom:6px}"+
      ".tl2183SceneCard .title{font:900 clamp(18px,5vw,26px)/1.08 system-ui,sans-serif;letter-spacing:.08em;color:#fff}"+
      ".tl2183SceneCard .line{margin-top:7px;font:800 9px/1.2 system-ui,sans-serif;letter-spacing:.14em;color:#bfefff}"+
      ".tl2183SceneCard .nature{margin-top:10px;font:700 9px/1 system-ui,sans-serif;letter-spacing:.10em;color:rgba(234,252,255,.56)}"+
      ".tl2183ScenePulse{position:fixed;left:50%;top:50%;width:34px;height:34px;border-radius:50%;"+
      "border:2px solid rgba(234,252,255,.5);z-index:9992;pointer-events:none;transform:translate(-50%,-50%) scale(.35);opacity:0}"+
      ".tl2183ScenePulse.show{animation:tl2183Pulse .9s ease-out 1}"+
      ".tl2183Accent-source{box-shadow:0 0 46px rgba(47,210,255,.14)}"+
      ".tl2183Accent-dam{box-shadow:0 0 52px rgba(61,61,234,.16)}"+
      ".tl2183Accent-mill{box-shadow:0 0 55px rgba(243,16,186,.14)}"+
      ".tl2183Accent-ocean{box-shadow:0 0 62px rgba(47,210,255,.20)}"+
      ".tl2183Accent-overdrive{box-shadow:0 0 75px rgba(243,16,186,.22),0 0 46px rgba(47,210,255,.18)}"+
      "@keyframes tl2183Pulse{0%{opacity:.75;transform:translate(-50%,-50%) scale(.35)}100%{opacity:0;transform:translate(-50%,-50%) scale(5)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2183ScenePulse.show{animation:none!important}.tl2183SceneVeil,.tl2183SceneCard{transition:none}}";
    document.head.appendChild(s);
  }

  function layers(){
    var veil=document.getElementById("tl2183SceneVeil");
    if(!veil){
      veil=document.createElement("div");
      veil.id="tl2183SceneVeil";
      veil.className="tl2183SceneVeil";
      document.body.appendChild(veil);
    }
    var card=document.getElementById("tl2183SceneCard");
    if(!card){
      card=document.createElement("div");
      card.id="tl2183SceneCard";
      card.className="tl2183SceneCard";
      card.innerHTML='<div class="icon"></div><div class="title"></div><div class="line"></div><div class="nature"></div>';
      document.body.appendChild(card);
    }
    return {veil:veil,card:card};
  }

  function choose(){
    var last=null,recent=[];
    try{last=sessionStorage.getItem(S.sceneKey)}catch(e){}
    try{
      recent=JSON.parse(sessionStorage.getItem(S.recentKey)||"[]");
      if(!Array.isArray(recent))recent=[];
    }catch(e){recent=[]}

    var pool=SCENES.filter(function(x){return x.id!==last && recent.indexOf(x.id)<0});
    if(!pool.length)pool=SCENES.filter(function(x){return x.id!==last});
    if(!pool.length)pool=SCENES.slice();

    var scene=pool[Math.floor(Math.random()*pool.length)];
    recent=[scene.id].concat(recent.filter(function(id){return id!==scene.id && SCENES.some(function(x){return x.id===id})})).slice(0,4);

    try{
      sessionStorage.setItem(S.sceneKey,scene.id);
      sessionStorage.setItem(S.recentKey,JSON.stringify(recent));
    }catch(e){}

    return scene;
  }

  function show(scene,delay){
    var l=layers();
    l.card.classList.add("tl2183Accent-"+scene.accent);
    l.card.querySelector(".icon").textContent=scene.icon;
    l.card.querySelector(".title").textContent=scene.label;
    l.card.querySelector(".line").textContent=scene.line+" • TAP LITES";
    var natureEl=l.card.querySelector(".nature");if(natureEl){natureEl.textContent="";natureEl.style.display="none";}   // V2.1.84: no environment-name text

    l.veil.style.setProperty("--tl2183Opacity",String(
      scene.mood==="overdrive"?.42:
      scene.mood==="release"?.30:
      scene.mood==="surge"?.26:
      scene.mood==="building"?.20:.14
    ));
    l.veil.classList.add("active");
    setTimeout(function(){l.card.classList.add("show")},delay||120);
    clearTimeout(l.card.__timer);
    l.card.__timer=setTimeout(function(){
      l.card.classList.remove("show");
      l.veil.classList.remove("active");
      l.card.classList.remove("tl2183Accent-"+scene.accent);
    },scene.mood==="overdrive"?2100:1700);

    var pulse=document.createElement("div");
    pulse.className="tl2183ScenePulse";
    document.body.appendChild(pulse);
    setTimeout(function(){pulse.classList.add("show")},Math.max(0,(delay||120)+100));
    setTimeout(function(){pulse.remove()},1100);

    S.scene=scene;
  }

  function applyMood(scene){
    try{
      var atm=window.__GEI_TAP_LITES_SESSION_ATMOSPHERE__;
      if(atm && typeof atm.selfTest==="function")atm.selfTest();
      /* Presentation coordination only; V2.1.80 remains the mood authority. */
    }catch(e){}
    document.documentElement.setAttribute("data-tap-lites-scene",scene.id);
    document.documentElement.setAttribute("data-tap-lites-scene-pace",scene.pace);
    document.documentElement.setAttribute("data-tap-lites-scene-accent",scene.accent);
  }

  function openingImpression(scene){
    try{
      var box=document.getElementById("geiCharacterSpotlight");
      if(box){
        box.dataset.scene=scene.id;
        box.dataset.scenePace=scene.pace;
        box.classList.remove("sceneImpression");
        void box.offsetWidth;
        box.classList.add("sceneImpression");
        setTimeout(function(){box.classList.remove("sceneImpression")},1100);
      }
    }catch(e){}
  }

  function handleFirstInteraction(){
    if(!S.scene)return;
    openingImpression(S.scene);
    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction(
          S.scene.mood==="overdrive"?"level":S.scene.mood==="calm"?"tap":"rapid",
          S.scene.mood==="overdrive"?1.5:1.0
        );
      }
    }catch(e){}
  }

  function startup(){
    if(S.started)return;
    S.started=true;
    css();layers();
    S.scene=choose();
    applyMood(S.scene);
    show(S.scene,420);
    document.addEventListener("pointerdown",handleFirstInteraction,true);
    window.__GEI_TAP_LITES_RANDOM_SCENE__=Object.freeze({
      version:"V2.1.83",
      presentationOnly:true,
      randomScenes:true,
      sessionOnly:true,
      sceneCount:SCENES.length,
      currentScene:S.scene.id,
      currentSceneLabel:S.scene.label,
      natureAccent:S.scene.natureLabel,
      scenePace:S.scene.pace
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();