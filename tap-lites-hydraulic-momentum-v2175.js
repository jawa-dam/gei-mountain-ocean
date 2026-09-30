/* V2.1.75 — TAP LITES HYDRAULIC MOMENTUM ENGINE
 * Presentation-only momentum layer.
 * Never changes authoritative tap counts, FL OZ, progression, timers,
 * purchases, entitlements, or save data.
 */
(function(){
  "use strict";

  var M={
    taps:0,lastTap:0,streak:0,momentum:0,lastFrame:0,
    lastReaction:0,settleTimer:null,started:false
  };

  function css(){
    if(document.getElementById("tapLites2175Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2175Style";
    s.textContent=
      ".tl2175FlowAura{position:fixed;inset:0;pointer-events:none;z-index:9984;opacity:0;"+
      "background:radial-gradient(circle at 50% 52%,rgba(47,210,255,.20),transparent 36%),"+
      "linear-gradient(180deg,transparent 56%,rgba(47,210,255,.06),transparent);"+
      "transition:opacity .35s ease,filter .35s ease;filter:saturate(1)}"+
      ".tl2175FlowAura.hot{opacity:.82;filter:saturate(1.28)}"+
      ".tl2175Pressure{position:fixed;left:50%;bottom:7.5%;width:min(78vw,460px);height:6px;transform:translateX(-50%);"+
      "border-radius:99px;background:rgba(255,255,255,.08);overflow:hidden;pointer-events:none;z-index:9986;"+
      "box-shadow:inset 0 0 0 1px rgba(255,255,255,.10),0 0 18px rgba(47,210,255,.12)}"+
      ".tl2175Pressure::after{content:"";display:block;height:100%;width:var(--tlp,0%);border-radius:inherit;"+
      "background:linear-gradient(90deg,#2fd2ff,#3d3dea,#f310ba);box-shadow:0 0 14px rgba(47,210,255,.55);transition:width .18s ease}"+
      ".tl2175MomentumBadge{position:fixed;right:12px;bottom:12%;z-index:9987;padding:8px 11px;border-radius:12px;"+
      "background:rgba(6,7,13,.62);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(10px);"+
      "font:800 11px/1 system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#eafcff;"+
      "opacity:0;transform:translateY(8px);transition:opacity .25s,transform .3s;pointer-events:none}"+
      ".tl2175MomentumBadge.show{opacity:1;transform:none}"+
      ".tl2175MomentumBadge.hot{box-shadow:0 0 24px rgba(47,210,255,.20),inset 0 0 16px rgba(243,16,186,.08)}"+
      ".tl2175SystemPulse{animation:tl2175SystemPulse .55s ease-out!important}"+
      ".tl2175Flowing::after{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;"+
      "background:linear-gradient(90deg,transparent,rgba(47,210,255,.12),rgba(243,16,186,.10),transparent);"+
      "background-size:220% 100%;animation:tl2175Travel 1.25s linear infinite}"+
      "@keyframes tl2175SystemPulse{0%{filter:brightness(1)}28%{filter:brightness(1.24)}100%{filter:brightness(1)}}"+
      "@keyframes tl2175Travel{from{background-position:-110% 0}to{background-position:110% 0}}"+
      "@media (prefers-reduced-motion:reduce){.tl2175FlowAura,.tl2175Flowing::after,.tl2175SystemPulse{animation:none!important}.tl2175FlowAura{transition:none}.tl2175Flowing::after{display:none}}";
    document.head.appendChild(s);
  }

  function layers(){
    var aura=document.getElementById("tl2175FlowAura");
    if(!aura){
      aura=document.createElement("div");
      aura.id="tl2175FlowAura";
      aura.className="tl2175FlowAura";
      document.body.appendChild(aura);
    }
    var pressure=document.getElementById("tl2175Pressure");
    if(!pressure){
      pressure=document.createElement("div");
      pressure.id="tl2175Pressure";
      pressure.className="tl2175Pressure";
      pressure.setAttribute("aria-hidden","true");
      document.body.appendChild(pressure);
    }
    var badge=document.getElementById("tl2175MomentumBadge");
    if(!badge){
      badge=document.createElement("div");
      badge.id="tl2175MomentumBadge";
      badge.className="tl2175MomentumBadge";
      badge.setAttribute("aria-live","polite");
      document.body.appendChild(badge);
    }
    return {aura:aura,pressure:pressure,badge:badge};
  }

  function activeGameplayTap(){
    try{
      if(typeof window.state==="undefined" || !window.state)return true;
      return window.state.phase==="playing";
    }catch(e){return true}
  }

  function updateMomentum(){
    var now=performance.now();
    if(now-M.lastTap<850){
      M.streak++;
    }else{
      M.streak=1;
    }
    M.lastTap=now;

    var target=Math.min(100,Math.max(0,(M.streak-1)*8+Math.min(28,M.streak*1.75)));
    M.momentum+=(target-M.momentum)*.42;

    var l=layers(),pct=Math.round(M.momentum);
    l.pressure.style.setProperty("--tlp",pct+"%");
    l.aura.classList.toggle("hot",M.momentum>=35);

    var label=M.momentum>=82?"SYSTEM OVERDRIVE":
      M.momentum>=64?"HYDRAULIC SURGE":
      M.momentum>=45?"RAPID FLOW":
      M.momentum>=25?"FLOW BUILDING":"FLOW START";

    if(M.streak>=3){
      l.badge.textContent="💧 "+label+" · "+pct+"%";
      l.badge.classList.add("show");
      l.badge.classList.toggle("hot",M.momentum>=64);
      clearTimeout(M.settleTimer);
      M.settleTimer=setTimeout(function(){
        l.badge.classList.remove("show","hot");
      },1100);
    }

    return pct;
  }

  function pulseExistingWorld(){
    var selectors=[
      "#gameWorld",".gameWorld","#world","#worldStage",".worldStage",
      "#mountainGroup",".mountain",".dam",".reservoir",".sluice",".waterwheel",".mill","#ocean"
    ];
    var nodes=[];
    selectors.forEach(function(sel){
      try{document.querySelectorAll(sel).forEach(function(n){if(nodes.indexOf(n)<0)nodes.push(n)})}catch(e){}
    });
    nodes.slice(0,18).forEach(function(n,i){
      n.classList.remove("tl2175SystemPulse");
      n.classList.add("tl2175SystemPulse");
      setTimeout(function(){n.classList.remove("tl2175SystemPulse")},560+i*18);
    });
  }

  function markFlowTravel(){
    var candidates=[
      "#flowPath","#waterFlow","#river",".flowPath",".waterFlow",
      "#tapWaterLayer",".tapWaterLayer",".geiSurgeLayer"
    ];
    candidates.forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(n){
          n.classList.add("tl2175Flowing");
          clearTimeout(n.__tl2175Timer);
          n.__tl2175Timer=setTimeout(function(){n.classList.remove("tl2175Flowing")},1250);
        });
      }catch(e){}
    });
  }

  function reactCharacter(strength){
    try{
      var now=performance.now();
      if(now-M.lastReaction<650)return;
      M.lastReaction=now;
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction("rapid",Math.min(1.6,strength||1));
      }
    }catch(e){}
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,.modal,.dialog,button,a,input,select,textarea"
    ))return;
    if(!activeGameplayTap())return;

    M.taps++;
    var p=updateMomentum();

    if(M.streak>=2)markFlowTravel();
    if(M.streak>=3)reactCharacter(Math.min(1.5,.8+M.streak*.035));
    if(M.streak===4||M.streak===8||M.streak===12)pulseExistingWorld();

    if(p>=82) {
      var aura=layers().aura;
      aura.style.opacity=".98";
      clearTimeout(aura.__tl2175HotTimer);
      aura.__tl2175HotTimer=setTimeout(function(){aura.style.opacity=""},220);
    }
  }

  function decay(){
    var now=performance.now();
    if(M.lastTap && now-M.lastTap>950 && M.momentum>0){
      M.momentum=Math.max(0,M.momentum-0.8);
      var l=layers();
      l.pressure.style.setProperty("--tlp",Math.round(M.momentum)+"%");
      if(M.momentum<8)l.aura.classList.remove("hot");
    }
    requestAnimationFrame(decay);
  }

  function startup(){
    if(M.started)return;
    M.started=true;
    css();
    layers();
    document.addEventListener("pointerdown",onPointer,true);
    requestAnimationFrame(decay);
    window.__GEI_TAP_LITES_HYDRAULIC_MOMENTUM__=Object.freeze({
      version:"V2.1.75",
      presentationOnly:true,
      features:["momentum-pressure","flow-travel","world-pulse","character-surge"]
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();