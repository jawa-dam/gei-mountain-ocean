/* V2.1.82 — TAP LITES LIVING WORLD CHARACTER SYNCHRONIZATION
 * Character reaction + randomized impression layer.
 * Presentation-only: never changes ownership, progress, economy, or save data.
 */
(function(){
  "use strict";

  var C={
    started:false,
    lastTap:0,
    streak:0,
    lastStage:-1,
    lastImpression:0,
    impressionKey:"tapLitesV2182CharacterImpression"
  };

  var STAGES=[
    {id:"mountain",min:0,mode:"SOURCE",emoji:"🌄",voice:"SOURCE AWAKENING"},
    {id:"dam",min:30,mode:"PRESSURE",emoji:"💧",voice:"DAM PRESSURE"},
    {id:"mill",min:56,mode:"MACHINE",emoji:"⚙️",voice:"MILL MOTION"},
    {id:"ocean",min:80,mode:"CURRENT",emoji:"🌊",voice:"OCEAN CURRENT"}
  ];

  var IMPRESSIONS=[
    {id:"morning",emoji:"🐦",title:"MORNING CREW",sub:"THE BIRDS ARE ON SHIFT"},
    {id:"water",emoji:"💧",title:"WATER CREW",sub:"FLOW CHECK COMPLETE"},
    {id:"mechanic",emoji:"🔧",title:"MILL CREW",sub:"MACHINERY READY"},
    {id:"ocean",emoji:"🌊",title:"OCEAN CREW",sub:"DOWNSTREAM IS LIVE"},
    {id:"spark",emoji:"✨",title:"SPARK CREW",sub:"FIRST IMPRESSION: ELECTRIC"},
    {id:"night",emoji:"🌙",title:"NITE CREW",sub:"THE NIGHT FLOW IS ACTIVE"},
    {id:"damnation",emoji:"🔥",title:"DAM NATION",sub:"THE SYSTEM IS ALIVE"},
    {id:"nature",emoji:"🌿",title:"NATURE CREW",sub:"WATER + LIFE + MOTION"}
  ];

  function css(){
    if(document.getElementById("tapLites2182Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2182Style";
    s.textContent=
      ".tl2182CharacterSync{position:fixed;right:12px;top:25%;z-index:9989;max-width:min(72vw,280px);"+
      "padding:8px 10px;border-radius:13px;background:rgba(6,7,13,.58);border:1px solid rgba(255,255,255,.14);"+
      "backdrop-filter:blur(11px);font:800 10px/1.18 system-ui,sans-serif;letter-spacing:.08em;color:#eafcff;"+
      "opacity:0;transform:translateY(6px) scale(.97);transition:opacity .25s,transform .35s;pointer-events:none}"+
      ".tl2182CharacterSync.show{opacity:1;transform:none}"+
      ".tl2182CharacterSync .title{font-size:11px;letter-spacing:.11em}"+
      ".tl2182CharacterSync .sub{margin-top:4px;font-size:8px;letter-spacing:.10em;color:rgba(234,252,255,.58)}"+
      ".tl2182CharacterImpression{position:fixed;left:50%;top:25%;transform:translate(-50%,-10px) scale(.92);z-index:9994;"+
      "width:min(86vw,410px);padding:15px 16px;border-radius:20px;text-align:center;"+
      "background:radial-gradient(circle at 50% 0%,rgba(47,210,255,.18),rgba(6,7,13,.88) 64%);"+
      "border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 70px rgba(0,0,0,.45),0 0 40px rgba(47,210,255,.14);"+
      "backdrop-filter:blur(15px);opacity:0;pointer-events:none;transition:opacity .2s,transform .45s cubic-bezier(.2,.8,.2,1)}"+
      ".tl2182CharacterImpression.show{opacity:1;transform:translate(-50%,0) scale(1)}"+
      ".tl2182CharacterImpression .emoji{font-size:30px;line-height:1;margin-bottom:6px}"+
      ".tl2182CharacterImpression .title{font:900 clamp(17px,5vw,25px)/1.1 system-ui,sans-serif;letter-spacing:.08em;color:#fff}"+
      ".tl2182CharacterImpression .sub{margin-top:7px;font:800 9px/1.2 system-ui,sans-serif;letter-spacing:.14em;color:#bfefff}"+
      ".tl2182CharacterImpression.overdrive{box-shadow:0 20px 85px rgba(0,0,0,.5),0 0 68px rgba(243,16,186,.22),0 0 38px rgba(47,210,255,.22)}"+
      ".tl2182SyncPulse{animation:tl2182SyncPulse .64s ease-out 1!important}"+
      "@keyframes tl2182SyncPulse{0%{transform:scale(1);filter:brightness(1)}35%{transform:scale(1.045);filter:brightness(1.22) drop-shadow(0 0 18px rgba(47,210,255,.34))}100%{transform:scale(1);filter:brightness(1)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2182SyncPulse{animation:none!important}.tl2182CharacterSync,.tl2182CharacterImpression{transition:none}}";
    document.head.appendChild(s);
  }

  function readMomentum(){
    try{
      var el=document.getElementById("tl2175Pressure");
      if(el){
        var n=Number(el.style.getPropertyValue("--tlp").replace("%",""));
        if(isFinite(n))return Math.max(0,Math.min(100,n));
      }
    }catch(e){}
    return 0;
  }

  function stageFor(p){
    for(var i=STAGES.length-1;i>=0;i--)if(p>=STAGES[i].min)return i;
    return 0;
  }

  function ensureSync(){
    var el=document.getElementById("tl2182CharacterSync");
    if(el)return el;
    el=document.createElement("div");
    el.id="tl2182CharacterSync";
    el.className="tl2182CharacterSync";
    el.setAttribute("aria-live","polite");
    el.innerHTML='<div class="title"></div><div class="sub"></div>';
    document.body.appendChild(el);
    return el;
  }

  function ensureImpression(){
    var el=document.getElementById("tl2182CharacterImpression");
    if(el)return el;
    el=document.createElement("div");
    el.id="tl2182CharacterImpression";
    el.className="tl2182CharacterImpression";
    el.setAttribute("aria-live","polite");
    el.innerHTML='<div class="emoji"></div><div class="title"></div><div class="sub"></div>';
    document.body.appendChild(el);
    return el;
  }

  function activeCharacter(){
    try{
      if(typeof window.geiCharacterPersonality==="function"){
        var p=window.geiCharacterPersonality();
        if(p)return p;
      }
    }catch(e){}
    try{
      var box=document.getElementById("geiCharacterSpotlight");
      if(box){
        var name=box.querySelector(".spotName");
        return {label:name?name.textContent:"DAM NATION",style:box.dataset.personality||"crew"};
      }
    }catch(e){}
    return {label:"DAM NATION",style:"crew",emoji:"💧"};
  }

  function personalityLine(stage,p){
    var c=activeCharacter(),style=String(c.style||"crew");
    var bank={
      mountain:{
        nature:"Breathe in the mountain flow.",
        rhythm:"Catch the source rhythm.",
        mechanic:"Source check: online.",
        energy:"Power starts here!",
        wave:"The first wave is rising.",
        crew:"Mountain source online."
      },
      dam:{
        nature:"The water is gathering.",
        rhythm:"Pressure has a rhythm.",
        mechanic:"Wall pressure: climbing.",
        energy:"Build that pressure!",
        wave:"Hold the wave behind the wall.",
        crew:"Dam pressure rising."
      },
      mill:{
        nature:"Water is feeding the machine.",
        rhythm:"Hear that wheel turn.",
        mechanic:"Machinery is engaging.",
        energy:"Spin it up!",
        wave:"Send the current through.",
        crew:"Mill motion online."
      },
      ocean:{
        nature:"Downstream feels alive.",
        rhythm:"Catch the ocean rhythm.",
        mechanic:"System discharge confirmed.",
        energy:"Make the splash!",
        wave:"Ride it to the ocean.",
        crew:"Ocean current released."
      }
    };
    var b=bank[STAGES[stage].id]||bank.mountain;
    return b[style]||b.crew;
  }

  function sync(stage,p,force){
    var now=performance.now(),st=STAGES[stage];
    if(!force && stage===C.lastStage && now-C.lastImpression<900)return;
    C.lastStage=stage;C.lastImpression=now;

    var el=ensureSync(),c=activeCharacter();
    el.querySelector(".title").textContent=(c.emoji||"💧")+" "+(c.label||"DAM NATION");
    el.querySelector(".sub").textContent=st.emoji+" "+st.voice+" · "+personalityLine(stage,p);
    el.classList.add("show");
    el.classList.remove("tl2182SyncPulse");void el.offsetWidth;el.classList.add("tl2182SyncPulse");
    clearTimeout(el.__timer);
    el.__timer=setTimeout(function(){el.classList.remove("show")},1050);

    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction(
          stage===3&&p>=94?"level":stage>0?"rapid":"tap",
          Math.min(1.6,.85+p/125)
        );
      }
    }catch(e){}
  }

  function pickImpression(){
    var last=null;
    try{last=sessionStorage.getItem(C.impressionKey)}catch(e){}
    var pool=IMPRESSIONS.filter(function(x){return x.id!==last});
    if(!pool.length)pool=IMPRESSIONS.slice();
    var pick=pool[Math.floor(Math.random()*pool.length)];
    try{sessionStorage.setItem(C.impressionKey,pick.id)}catch(e){}
    return pick;
  }

  function showImpression(){
    var x=pickImpression(),el=ensureImpression();
    el.querySelector(".emoji").textContent=x.emoji;
    el.querySelector(".title").textContent=x.title;
    el.querySelector(".sub").textContent=x.sub+" • TAP LITES";
    el.classList.remove("show","overdrive");void el.offsetWidth;el.classList.add("show");
    clearTimeout(el.__timer);
    el.__timer=setTimeout(function(){el.classList.remove("show")},1600);
  }

  function resetOnPause(){
    if(C.lastTap && performance.now()-C.lastTap>1200){
      C.streak=0;C.lastStage=-1;
    }
    requestAnimationFrame(resetOnPause);
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,#tl2182CharacterSync,#tl2182CharacterImpression,#tl2178Reward,#tl2177Milestone,.modal,.dialog,button,a,input,select,textarea"
    ))return;

    var now=performance.now();
    if(now-C.lastTap<850)C.streak++;else C.streak=1;
    C.lastTap=now;
    var p=readMomentum(),stage=stageFor(p);

    sync(stage,p,false);
    if(C.streak===1)showImpression();
  }

  function startup(){
    if(C.started)return;
    C.started=true;
    css();
    ensureSync();
    ensureImpression();
    document.addEventListener("pointerdown",onPointer,true);
    requestAnimationFrame(resetOnPause);
    /* One randomized first impression per fresh page/session. */
    setTimeout(function(){showImpression()},420);
    window.__GEI_TAP_LITES_CHARACTER_SYNC__=Object.freeze({
      version:"V2.1.82",
      presentationOnly:true,
      randomImpressions:true,
      sessionOnly:true,
      stages:STAGES.map(function(x){return x.id}),
      impressionCount:IMPRESSIONS.length
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();