/* V2.1.81 — TAP LITES LIVING DAM WORLD RESPONSE ENGINE
 * Presentation-only world vitality layer.
 * Never changes gameplay, economy, progression, timers, purchases, entitlements, or saves.
 */
(function(){
  "use strict";

  var L={
    started:false,
    mood:"calm",
    momentum:0,
    lastTap:0,
    streak:0,
    raf:0,
    activeStage:-1,
    zones:[
      {id:"mountain",label:"MOUNTAIN",min:0},
      {id:"dam",label:"DAM",min:30},
      {id:"mill",label:"MILL",min:56},
      {id:"ocean",label:"OCEAN",min:80}
    ]
  };

  var SELECTORS={
    mountain:["#mountainGroup",".mountainGroup","#mountain",".mountain","[data-region='mountain']","[data-stage='mountain']"],
    dam:["#damGroup",".damGroup","#dam",".dam","[data-region='dam']","[data-stage='dam']"],
    mill:["#millGroup",".millGroup","#mill",".mill","#factory",".factory",".waterwheel",".waterWheel","[data-region='mill']","[data-stage='mill']"],
    ocean:["#oceanGroup",".oceanGroup","#ocean",".ocean","[data-region='ocean']","[data-stage='ocean']"]
  };

  function style(){
    if(document.getElementById("tapLites2181Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2181Style";
    s.textContent=
      ".tl2181Living{transition:filter .5s ease,transform .5s ease,opacity .5s ease;will-change:filter,transform}"+
      ".tl2181Source{animation:tl2181Source 4.2s ease-in-out infinite}"+
      ".tl2181Dam{animation:tl2181Dam 2.7s ease-in-out infinite}"+
      ".tl2181Mill{animation:tl2181Mill 1.55s linear infinite}"+
      ".tl2181Ocean{animation:tl2181Ocean 3.2s ease-in-out infinite}"+
      ".tl2181Active{filter:brightness(1.08) saturate(1.10) drop-shadow(0 0 12px rgba(47,210,255,.18))}"+
      ".tl2181Surge{filter:brightness(1.16) saturate(1.20) drop-shadow(0 0 18px rgba(47,210,255,.28))}"+
      ".tl2181Overdrive{filter:brightness(1.24) saturate(1.28) drop-shadow(0 0 26px rgba(243,16,186,.18))}"+
      ".tl2181FlowMark{position:fixed;z-index:9981;pointer-events:none;width:9px;height:9px;border-radius:50%;"+
      "background:rgba(234,252,255,.82);box-shadow:0 0 14px rgba(47,210,255,.58);opacity:0}"+
      ".tl2181FlowMark.show{animation:tl2181Travel 1.25s cubic-bezier(.18,.8,.2,1) forwards}"+
      ".tl2181Status{position:fixed;left:50%;bottom:3%;transform:translateX(-50%);z-index:9987;pointer-events:none;"+
      "padding:5px 10px;border-radius:999px;background:rgba(6,7,13,.45);border:1px solid rgba(255,255,255,.10);"+
      "backdrop-filter:blur(8px);font:800 9px/1 system-ui,sans-serif;letter-spacing:.13em;color:rgba(234,252,255,.58);"+
      "opacity:0;transition:opacity .3s}"+
      ".tl2181Status.show{opacity:1}"+
      "@keyframes tl2181Source{0%,100%{transform:translateY(0) scale(1);filter:brightness(1)}50%{transform:translateY(-1px) scale(1.008);filter:brightness(1.05)}}"+
      "@keyframes tl2181Dam{0%,100%{transform:scaleY(1);filter:brightness(1)}50%{transform:scaleY(1.012);filter:brightness(1.07)}}"+
      "@keyframes tl2181Mill{0%{transform:rotate(0deg)}50%{transform:rotate(.7deg)}100%{transform:rotate(0deg)}}"+
      "@keyframes tl2181Ocean{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(1px) scale(1.01)}}"+
      "@keyframes tl2181Travel{0%{left:14%;top:76%;opacity:0;transform:scale(.5)}12%{opacity:1}42%{left:36%;top:59%}68%{left:62%;top:46%}88%{left:82%;top:30%;opacity:.82}100%{left:92%;top:18%;opacity:0;transform:scale(.15)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2181Source,.tl2181Dam,.tl2181Mill,.tl2181Ocean,.tl2181FlowMark.show{animation:none!important}.tl2181Living{transition:none}}";
    document.head.appendChild(s);
  }

  function nodes(stage){
    var list=SELECTORS[stage]||[];
    for(var i=0;i<list.length;i++){
      try{
        var found=document.querySelectorAll(list[i]);
        if(found.length)return Array.prototype.slice.call(found).slice(0,10);
      }catch(e){}
    }
    return [];
  }

  function zoneClass(stage){
    return ["tl2181Source","tl2181Dam","tl2181Mill","tl2181Ocean"][stage]||"";
  }

  function momentumFromExisting(){
    try{
      var el=document.getElementById("tl2175Pressure");
      if(el){
        var n=Number(el.style.getPropertyValue("--tlp").replace("%",""));
        if(isFinite(n))return Math.max(0,Math.min(100,n));
      }
    }catch(e){}
    return L.momentum;
  }

  function stageFor(p){
    if(p>=80)return 3;
    if(p>=56)return 2;
    if(p>=30)return 1;
    return 0;
  }

  function currentMood(){
    try{
      var mood=window.__GEI_TAP_LITES_SESSION_ATMOSPHERE__ &&
        window.__GEI_TAP_LITES_SESSION_ATMOSPHERE__.selfTest &&
        window.__GEI_TAP_LITES_SESSION_ATMOSPHERE__.selfTest().currentMood;
      if(mood)return String(mood);
    }catch(e){}
    if(L.momentum>=94)return "overdrive";
    if(L.momentum>=75)return "release";
    if(L.momentum>=50)return "surge";
    if(L.momentum>=25)return "building";
    return "calm";
  }

  function clearDynamic(){
    ["mountain","dam","mill","ocean"].forEach(function(stage){
      nodes(stage).forEach(function(el){
        el.classList.remove("tl2181Living","tl2181Source","tl2181Dam","tl2181Mill","tl2181Ocean",
          "tl2181Active","tl2181Surge","tl2181Overdrive");
      });
    });
  }

  function applyLiving(stage,p){
    var els=nodes(["mountain","dam","mill","ocean"][stage]);
    var mood=currentMood();
    els.forEach(function(el){
      el.classList.add("tl2181Living",zoneClass(stage));
      if(stage===L.activeStage)el.classList.add("tl2181Active");
      if(p>=50)el.classList.add("tl2181Surge");
      if(p>=94)el.classList.add("tl2181Overdrive");
    });
    if(mood==="calm" && p<25){
      /* Calm should breathe, not flash. */
      els.forEach(function(el){el.classList.remove("tl2181Surge","tl2181Overdrive")});
    }
  }

  function applyAll(p){
    clearDynamic();
    var active=stageFor(p);
    L.activeStage=active;
    for(var i=0;i<4;i++)applyLiving(i,p);
  }

  function flowMark(){
    var mark=document.createElement("i");
    mark.className="tl2181FlowMark";
    document.body.appendChild(mark);
    void mark.offsetWidth;
    mark.classList.add("show");
    setTimeout(function(){mark.remove()},1300);
  }

  function status(p){
    var el=document.getElementById("tl2181Status");
    if(!el){
      el=document.createElement("div");
      el.id="tl2181Status";
      el.className="tl2181Status";
      el.setAttribute("aria-hidden","true");
      document.body.appendChild(el);
    }
    var mood=currentMood();
    var label={
      calm:"🌄 MOUNTAIN BREATH",
      building:"💧 DAM PRESSURE",
      surge:"⚙️ MILL IN MOTION",
      release:"🌊 OCEAN CURRENT",
      overdrive:"🔥 SYSTEM ALIVE"
    }[mood]||"💧 WATER MOVING";
    el.textContent=label;
    el.classList.toggle("show",p>=18);
    clearTimeout(el.__hide);
    el.__hide=setTimeout(function(){if(L.momentum<35)el.classList.remove("show")},1200);
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,#tl2179SoundBadge,#tl2180AtmosBadge,#tl2180Nature,#tl2178Reward,#tl2177Milestone,#tl2181Status,.modal,.dialog,button,a,input,select,textarea"
    ))return;

    var now=performance.now();
    if(now-L.lastTap<850)L.streak++;else L.streak=1;
    L.lastTap=now;
    L.momentum=momentumFromExisting();
    var stage=stageFor(L.momentum);
    var changed=stage!==L.activeStage;
    applyAll(L.momentum);
    status(L.momentum);

    if(changed || L.streak%7===0)flowMark();
  }

  function tick(){
    if(L.lastTap && performance.now()-L.lastTap>1400){
      L.momentum=Math.max(0,L.momentum-.5);
      if(L.momentum<12)L.streak=0;
      applyAll(L.momentum);
    }
    L.raf=requestAnimationFrame(tick);
  }

  function selfTest(){
    var p=momentumFromExisting(),stage=stageFor(p);
    return {
      version:"V2.1.81",
      presentationOnly:true,
      worldChain:["Mountain","Dam","Mill","Ocean"],
      currentMomentum:p,
      currentStage:["Mountain","Dam","Mill","Ocean"][stage],
      sessionAtmosphere:currentMood(),
      livingSelectors:{
        mountain:nodes("mountain").length>0,
        dam:nodes("dam").length>0,
        mill:nodes("mill").length>0,
        ocean:nodes("ocean").length>0
      },
      progressOrEconomyChanged:false
    };
  }

  function startup(){
    if(L.started)return;
    L.started=true;
    style();
    document.addEventListener("pointerdown",onPointer,true);
    applyAll(0);
    requestAnimationFrame(tick);
    window.__GEI_TAP_LITES_LIVING_WORLD__=Object.freeze({
      version:"V2.1.81",
      presentationOnly:true,
      selfTest:selfTest
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();