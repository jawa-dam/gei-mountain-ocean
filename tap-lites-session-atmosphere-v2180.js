/* V2.1.80 — TAP LITES HYDRAULIC STATE MEMORY & SESSION ATMOSPHERE
 * Presentation/audio atmosphere only.
 * Uses sessionStorage only for temporary session mood. Never stores game economy
 * or progression and never changes authoritative gameplay state.
 */
(function(){
  "use strict";

  var ATMOS=[
    {id:"calm",min:0,max:24,label:"CALM FLOW",sub:"MOUNTAIN AIR • SOFT WATER",intensity:.18},
    {id:"building",min:25,max:49,label:"PRESSURE BUILDING",sub:"DAM WALL • RISING WATER",intensity:.35},
    {id:"surge",min:50,max:74,label:"HYDRAULIC SURGE",sub:"MILL MOTION • FAST FLOW",intensity:.58},
    {id:"release",min:75,max:93,label:"OCEAN CURRENT",sub:"DOWNSTREAM • OPEN WATER",intensity:.78},
    {id:"overdrive",min:94,max:100,label:"SYSTEM OVERDRIVE",sub:"MOUNTAIN → DAM → MILL → OCEAN",intensity:1}
  ];

  var NATURE=[
    {id:"morning",emoji:"🐦",name:"MORNING BIRDS"},
    {id:"wetland",emoji:"🦆",name:"WETLAND FLOW"},
    {id:"meadow",emoji:"🌿",name:"MEADOW WIND"},
    {id:"night",emoji:"🌙",name:"NIGHT WATER"},
    {id:"storm",emoji:"⛈️",name:"STORM RAIN"},
    {id:"ocean",emoji:"🌊",name:"OCEAN BREEZE"}
  ];

  var S={
    started:false,momentum:0,lastTap:0,streak:0,atmosphere:"calm",
    sessionMood:"calm",nature:null,storageKey:"tapLitesV2180SessionMood"
  };

  function css(){
    if(document.getElementById("tapLites2180Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2180Style";
    s.textContent=
      ".tl2180Aura{position:fixed;inset:0;pointer-events:none;z-index:9982;opacity:0;transition:opacity .7s ease,filter .7s ease;"+
      "background:radial-gradient(circle at 50% 48%,rgba(47,210,255,.16),transparent 38%),"+
      "radial-gradient(circle at 18% 78%,rgba(61,61,234,.10),transparent 30%),"+
      "radial-gradient(circle at 82% 22%,rgba(243,16,186,.08),transparent 28%);filter:saturate(1)}"+
      ".tl2180Aura.active{opacity:var(--tl2180Opacity,.2);filter:saturate(1.08)}"+
      ".tl2180Aura.surge{animation:tl2180Surge 2.8s ease-in-out infinite}"+
      ".tl2180AtmosBadge{position:fixed;left:50%;top:16%;transform:translate(-50%,-6px) scale(.97);z-index:9986;"+
      "padding:8px 13px;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(6,7,13,.56);"+
      "backdrop-filter:blur(11px);font:800 10px/1.1 system-ui,sans-serif;letter-spacing:.13em;text-align:center;"+
      "color:#eafcff;opacity:0;pointer-events:none;transition:opacity .28s,transform .35s;white-space:nowrap}"+
      ".tl2180AtmosBadge.show{opacity:1;transform:translate(-50%,0)}"+
      ".tl2180AtmosBadge .sub{display:block;margin-top:4px;font-size:8px;letter-spacing:.11em;color:rgba(234,252,255,.55)}"+
      ".tl2180Nature{position:fixed;right:12px;top:16%;z-index:9985;padding:6px 9px;border-radius:10px;"+
      "background:rgba(6,7,13,.50);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(9px);"+
      "font:700 9px/1 system-ui,sans-serif;letter-spacing:.1em;color:rgba(234,252,255,.66);opacity:0;transition:opacity .35s;pointer-events:none}"+
      ".tl2180Nature.show{opacity:1}"+
      "@keyframes tl2180Surge{0%,100%{transform:scale(1);opacity:var(--tl2180Opacity,.35)}50%{transform:scale(1.018);opacity:calc(var(--tl2180Opacity,.35) + .08)}}"+
      ".tl2180AtmosBadge,.tl2180Nature{display:none!important}"+
      "@media (prefers-reduced-motion:reduce){.tl2180Aura.surge{animation:none!important}.tl2180Aura,.tl2180AtmosBadge{transition:none}}";
    document.head.appendChild(s);
  }

  function sessionLoad(){
    try{
      var raw=sessionStorage.getItem(S.storageKey);
      if(raw){
        var parsed=JSON.parse(raw);
        if(parsed && parsed.mood && ATMOS.some(function(a){return a.id===parsed.mood})){
          S.sessionMood=parsed.mood;
        }
        if(parsed && parsed.nature && NATURE.some(function(n){return n.id===parsed.nature})){
          S.nature=parsed.nature;
        }
      }
    }catch(e){}
    if(!S.nature){
      var pick=NATURE[Math.floor(Math.random()*NATURE.length)];
      S.nature=pick.id;
    }
    try{
      sessionStorage.setItem(S.storageKey,JSON.stringify({
        mood:S.sessionMood,nature:S.nature,version:"V2.1.80"
      }));
    }catch(e){}
  }

  function layers(){
    var aura=document.getElementById("tl2180Aura");
    if(!aura){
      aura=document.createElement("div");aura.id="tl2180Aura";aura.className="tl2180Aura";
      document.body.appendChild(aura);
    }
    var badge=document.getElementById("tl2180AtmosBadge");
    if(!badge){
      badge=document.createElement("div");badge.id="tl2180AtmosBadge";badge.className="tl2180AtmosBadge";
      document.body.appendChild(badge);
    }
    var nature=document.getElementById("tl2180Nature");
    if(!nature){
      nature=document.createElement("div");nature.id="tl2180Nature";nature.className="tl2180Nature";
      document.body.appendChild(nature);
    }
    return {aura:aura,badge:badge,nature:nature};
  }

  function getMomentum(){
    var el=document.getElementById("tl2175Pressure");
    if(el){
      var n=Number(el.style.getPropertyValue("--tlp").replace("%",""));
      if(isFinite(n))return Math.max(0,Math.min(100,n));
    }
    return Math.min(100,Math.max(0,(S.streak-1)*8+Math.min(28,S.streak*1.75)));
  }

  function atmosphereFor(p){
    for(var i=ATMOS.length-1;i>=0;i--){
      if(p>=ATMOS[i].min)return ATMOS[i];
    }
    return ATMOS[0];
  }

  function showAtmosphere(a,p,force){
    var l=layers(),mood=a.id;
    if(!force && mood===S.atmosphere && performance.now()-S.lastTap<1000)return;
    S.atmosphere=mood;S.sessionMood=mood;
    l.aura.style.setProperty("--tl2180Opacity",String(a.intensity*.72));
    l.aura.classList.toggle("active",p>=12);
    l.aura.classList.toggle("surge",p>=50);

    /* V2.1.84: atmosphere / nature TITLE badges (CALM FLOW, STORM RAIN, NIGHT WATER…) are no longer rendered.
       The aura and the ambient nature sound above keep working; only the floating text over the HUD is gone. */

    try{
      sessionStorage.setItem(S.storageKey,JSON.stringify({
        mood:mood,nature:S.nature,version:"V2.1.80",updatedAt:Date.now()
      }));
    }catch(e){}

    if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
      try{
        window.geiCharacterSpotlightPersonalityReaction(
          mood==="overdrive"?"level":mood==="calm"?"tap":"rapid",
          Math.min(1.5,.8+a.intensity*.6)
        );
      }catch(e){}
    }
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,#tl2180AtmosBadge,#tl2180Nature,#tl2178Reward,#tl2177Milestone,.modal,.dialog,button,a,input,select,textarea"
    ))return;

    var now=performance.now();
    if(now-S.lastTap<850)S.streak++;else S.streak=1;
    S.lastTap=now;
    S.momentum=getMomentum();
    var a=atmosphereFor(S.momentum);
    showAtmosphere(a,S.momentum,false);
  }

  function settle(){
    if(S.lastTap && performance.now()-S.lastTap>1400){
      S.streak=0;
      S.momentum=Math.max(0,S.momentum-0.45);
      var a=atmosphereFor(S.momentum);
      if(a.id!==S.atmosphere)showAtmosphere(a,S.momentum,true);
      if(S.momentum<10){
        var l=layers();
        l.aura.classList.remove("active","surge");
      }
    }
    requestAnimationFrame(settle);
  }

  function selfTest(){
    var l=layers();
    return {
      version:"V2.1.80",
      presentationOnly:true,
      sessionStorageOnly:true,
      persistedFields:["mood","nature","version","updatedAt"],
      currentMood:S.atmosphere,
      currentNature:S.nature,
      atmosphereStates:ATMOS.map(function(a){return a.id}),
      uiPresent:!!l.aura&&!!l.badge&&!!l.nature,
      gameStateMutated:false,
      rewardEconomyMutated:false
    };
  }

  function startup(){
    if(S.started)return;
    S.started=true;
    css();sessionLoad();layers();
    document.addEventListener("pointerdown",onPointer,true);
    requestAnimationFrame(settle);
    window.__GEI_TAP_LITES_SESSION_ATMOSPHERE__=Object.freeze({
      version:"V2.1.80",
      presentationOnly:true,
      sessionKey:S.storageKey,
      selfTest:selfTest
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();