/* V2.1.84 — TAP LITES RANDOM SCENE TRANSITION ENGINE
 * Presentation-only transition layer.
 * Bridges the randomized V2.1.83 opening scene into live gameplay without changing
 * tap authority, FL OZ, progression, timers, purchases, entitlements, or saves.
 */
(function(){
  "use strict";

  var T={
    started:false,
    scene:null,
    transitioned:false,
    timer:null,
    transitionMs:1150
  };

  function style(){
    if(document.getElementById("tapLites2184Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2184Style";
    s.textContent=
      ".tl2184TransitionVeil{position:fixed;inset:0;z-index:10000;pointer-events:none;"+
      "background:radial-gradient(circle at 50% 48%,rgba(47,210,255,.22),rgba(6,7,13,.12) 36%,rgba(6,7,13,.82) 100%);"+
      "opacity:1;transition:opacity .75s cubic-bezier(.2,.8,.2,1)}"+
      ".tl2184TransitionVeil.release{opacity:0}"+
      ".tl2184TransitionRing{position:fixed;left:50%;top:50%;width:60px;height:60px;border-radius:50%;"+
      "border:2px solid rgba(234,252,255,.72);box-shadow:0 0 22px rgba(47,210,255,.42),0 0 34px rgba(243,16,186,.16);"+
      "transform:translate(-50%,-50%) scale(.65);opacity:0;z-index:10001;pointer-events:none}"+
      ".tl2184TransitionRing.show{animation:tl2184Ring 1.05s cubic-bezier(.16,.76,.2,1) forwards}"+
      ".tl2184TransitionLabel{position:fixed;left:50%;top:50%;transform:translate(-50%,34px) scale(.96);"+
      "z-index:10002;pointer-events:none;padding:7px 12px;border-radius:999px;"+
      "background:rgba(6,7,13,.58);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(10px);"+
      "font:800 10px/1 system-ui,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#eafcff;"+
      "opacity:0;transition:opacity .28s,transform .42s}"+
      ".tl2184TransitionLabel.show{opacity:1;transform:translate(-50%,0)}"+
      ".tl2184TransitionLabel .accent{display:inline-block;margin-right:5px}"+
      ".tl2184SceneEcho{animation:tl2184Echo .8s ease-out 1!important}"+
      "@keyframes tl2184Ring{0%{opacity:0;transform:translate(-50%,-50%) scale(.65)}16%{opacity:.9}100%{opacity:0;transform:translate(-50%,-50%) scale(7)}}"+
      "@keyframes tl2184Echo{0%{filter:brightness(1)}35%{filter:brightness(1.2) saturate(1.18)}100%{filter:brightness(1)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2184TransitionRing.show{animation:none!important}.tl2184TransitionVeil,.tl2184TransitionLabel{transition:none}}";
    document.head.appendChild(s);
  }

  function sceneMeta(){
    try{
      var root=document.documentElement;
      var id=root.getAttribute("data-tap-lites-scene");
      if(id){
        return {
          id:id,
          pace:root.getAttribute("data-tap-lites-scene-pace")||"soft",
          accent:root.getAttribute("data-tap-lites-scene-accent")||"source"
        };
      }
    }catch(e){}
    try{
      var api=window.__GEI_TAP_LITES_RANDOM_SCENE__;
      if(api)return {
        id:api.currentScene||"unknown",
        pace:api.scenePace||"soft",
        accent:api.sceneAccent||"source"
      };
    }catch(e){}
    return {id:"unknown",pace:"soft",accent:"source"};
  }

  function sceneInfo(){
    var id=T.scene&&T.scene.id||"unknown";
    var map={
      "morning-spring":{emoji:"🌄",name:"MORNING SPRING",handoff:"SOURCE FLOW"},
      "dam-dawn":{emoji:"💧",name:"DAM DAWN",handoff:"PRESSURE FLOW"},
      "mill-current":{emoji:"⚙️",name:"MILL CURRENT",handoff:"MACHINE FLOW"},
      "ocean-breeze":{emoji:"🌊",name:"OCEAN BREEZE",handoff:"DOWNSTREAM FLOW"},
      "nite-water":{emoji:"🌙",name:"NITE WATER",handoff:"NIGHT FLOW"},
      "storm-pressure":{emoji:"⛈️",name:"STORM PRESSURE",handoff:"SURGE FLOW"},
      "dam-nation":{emoji:"🔥",name:"DAM NATION",handoff:"FULL SYSTEM"},
      "spark-flow":{emoji:"✨",name:"SPARK FLOW",handoff:"LITE FLOW"}
    };
    return map[id]||{emoji:"💧",name:"TAP LITES",handoff:"WATER FLOW"};
  }

  function ensureLayers(){
    var veil=document.getElementById("tl2184TransitionVeil");
    if(!veil){
      veil=document.createElement("div");
      veil.id="tl2184TransitionVeil";
      veil.className="tl2184TransitionVeil";
      document.body.appendChild(veil);
    }
    var ring=document.getElementById("tl2184TransitionRing");
    if(!ring){
      ring=document.createElement("div");
      ring.id="tl2184TransitionRing";
      ring.className="tl2184TransitionRing";
      document.body.appendChild(ring);
    }
    var label=document.getElementById("tl2184TransitionLabel");
    if(!label){
      label=document.createElement("div");
      label.id="tl2184TransitionLabel";
      label.className="tl2184TransitionLabel";
      label.innerHTML='<span class="accent"></span><span class="text"></span>';
      document.body.appendChild(label);
    }
    return {veil:veil,ring:ring,label:label};
  }

  function sceneCard(){
    return document.getElementById("tl2183SceneCard");
  }

  function existingWorldNodes(){
    var selectors=[
      "#gameLogo",".brand",".brandTag","#world",".worldStage","#mountainGroup",".mountainGroup",
      "#damGroup",".damGroup","#millGroup",".millGroup","#oceanGroup",".oceanGroup",
      "#tl2175Pressure","#tl2176Chain","#tl2179SoundBadge","#tl2180AtmosBadge","#tl2182CharacterSync"
    ];
    var found=[];
    selectors.forEach(function(sel){
      try{document.querySelectorAll(sel).forEach(function(el){if(found.indexOf(el)<0)found.push(el)})}catch(e){}
    });
    return found;
  }

  function echoWorld(){
    existingWorldNodes().slice(0,30).forEach(function(el,i){
      el.classList.remove("tl2184SceneEcho");
      void el.offsetWidth;
      el.classList.add("tl2184SceneEcho");
      setTimeout(function(){el.classList.remove("tl2184SceneEcho")},820+i*10);
    });
  }

  function release(){
    if(T.transitioned)return;
    T.transitioned=true;
    var l=ensureLayers(),info=sceneInfo();

    var card=sceneCard();
    if(card){
      card.classList.remove("show");
      card.style.opacity="0";
      card.style.transform="translate(-50%,12px) scale(.96)";
      setTimeout(function(){
        card.style.removeProperty("opacity");
        card.style.removeProperty("transform");
      },520);
    }

    l.label.querySelector(".accent").textContent=info.emoji;
    l.label.querySelector(".text").textContent=info.handoff+" • TAP LITES";
    l.label.classList.remove("show");
    void l.label.offsetWidth;
    l.label.classList.add("show");

    l.ring.classList.remove("show");
    void l.ring.offsetWidth;
    l.ring.classList.add("show");

    echoWorld();

    setTimeout(function(){l.label.classList.remove("show")},620);
    setTimeout(function(){l.veil.classList.add("release")},260);
    setTimeout(function(){
      l.ring.classList.remove("show");
      l.veil.classList.remove("release");
      l.veil.style.display="none";
    },T.transitionMs);
  }

  function firstInteraction(){
    if(T.transitioned)return;
    release();
    document.removeEventListener("pointerdown",firstInteraction,true);
  }

  function delayedAutoRelease(){
    clearTimeout(T.timer);
    /* Let the randomized scene breathe before handing control back. */
    T.timer=setTimeout(function(){
      if(!T.transitioned && !document.hidden)release();
    },1750);
  }

  function startup(){
    if(T.started)return;
    T.started=true;
    style();
    T.scene=sceneMeta();
    ensureLayers();
    document.addEventListener("pointerdown",firstInteraction,true);
    delayedAutoRelease();
    document.addEventListener("visibilitychange",function(){
      if(document.hidden)return;
      if(!T.transitioned)delayedAutoRelease();
    });
    window.__GEI_TAP_LITES_SCENE_TRANSITION__=Object.freeze({
      version:"V2.1.84",
      presentationOnly:true,
      sceneTransitionMs:T.transitionMs,
      currentScene:T.scene.id,
      currentPace:T.scene.pace,
      currentAccent:T.scene.accent,
      gameplayStateChanged:false
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();