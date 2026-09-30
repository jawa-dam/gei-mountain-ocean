/* V2.1.87 → V2.1.89 — TAP LITES MOMENT DIRECTOR (QUIET TAP + ONE VISIBLE MOMENT)
 * The single owner of on-screen "moments". Presentation-only.
 *
 * V2.1.87 introduced this governor but the file never parsed (a double-escaped regex), so
 * nothing was governed. V2.1.89 repairs it and centralizes ownership:
 *
 *   1  EVERY TAP        ripple / hydraulic water / particles / sound stay. No text, no cards,
 *                       no toasts. Tap-driven text badges are hushed at the source.
 *   2  RAPID / COMBO    one small micro moment (combo flash or signature burst), ≤ 900 ms,
 *                       rate-limited, never stacks with anything, never takes input.
 *   3  LEVEL / DAY      event-driven celebrations (day card, level card, notices) are allowed.
 *   4  MILESTONE        cinematic cards are exclusive: everything else is hushed while active.
 *
 *   GLOBAL RULE  ONE_VISIBLE_MOMENT_AT_A_TIME — whatever system raises a surface, the arbiter
 *   below decides whether it may be seen; losers are hushed (visibility only, never removed).
 *
 * Never changes taps, FL OZ, XP, progression, timers, purchases, entitlements, saves or
 * character ownership. Visual layers never intercept taps (V2.1.68 pointer-layer rule).
 */
(function(){
  "use strict";
  if(window.__GEI_TAP_LITES_MOMENT_DIRECTOR__)return;

  var VERSION="V2.1.89";
  var HUSH="gei2189Hush";
  var MICRO_MAX_MS=900;          // rapid-tap micro feedback lifetime cap
  var MICRO_GAP_MS=3200;         // at most one micro moment per this window
  var NOTICE_GAP_MS=2600;        // repeated personality notices are spaced out

  /* Tap-driven text chatter (V2.1.74–V2.1.82 badges). Their non-text visuals — stage glows,
     auras, pulses — keep running; only these text surfaces are silenced. */
  var TAP_CHATTER=["tl2174Combo","tl2175MomentumBadge","tl2176Chain","tl2179SoundBadge",
    "tl2180AtmosBadge","tl2181Status","tl2182CharacterSync","tl2182CharacterImpression"];

  /* Governed surfaces. p = priority (higher preempts lower). tier drives the rules above. */
  var SURFACES=[
    {id:"damIteComboFlash",   tier:"micro",     p:1},
    {id:"geiSignatureMoment", tier:"micro",     p:1},
    {id:"tl2177Milestone",    tier:"micro",     p:1},
    {id:"labelToast",         tier:"notice",    p:2},
    {id:"damItePersonalityLayer", tier:"notice",p:2},
    {id:"tl2178Reward",       tier:"event",     p:3},
    {id:"celebCard",          tier:"event",     p:3},
    {id:"dayReward",          tier:"event",     p:3},     // Day 6 reward pop
    {id:"tribeCard",          tier:"event",     p:3},
    {id:"tl2183SceneCard",    tier:"event",     p:3},
    {id:"tl2185IntroBadge",   tier:"event",     p:3},
    {id:"geiMapMilestone",    tier:"cinematic", p:4}
  ];
  /* Full-screen dialogs/pages: while one is open no moment is shown over it. */
  var MODALS=["preGameCard","levelCard","bonusCard","damMachineCard","timeUpCard","characterSpotlight","geiDamMapPage","geiSplash"];

  var D={
    started:false, owner:null, ownerSince:0, lastMicroAt:-1e9, lastNoticeAt:-1e9,
    suppressed:0, hushed:0, allowed:0, maxVisible:0, byTier:{}, log:[],
    tapDispatch:false, lastReason:"", lastShownAt:0
  };
  var BY_ID={}; SURFACES.forEach(function(s){BY_ID[s.id]=s;});

  function now(){return performance.now();}
  function $(id){return document.getElementById(id);}
  function raised(el){
    /* "Raised" = its own system wants it on screen (ignores our hush). */
    if(!el||!el.isConnected)return false;
    if(el.classList.contains("show")||el.classList.contains("open"))return true;
    return false;
  }
  function visibleNow(el){
    if(!el||!el.isConnected)return false;
    try{
      var cs=getComputedStyle(el);
      if(cs.display==="none"||cs.visibility==="hidden"||parseFloat(cs.opacity||"1")<.03)return false;
      var r=el.getBoundingClientRect();return r.width>0&&r.height>0;
    }catch(e){return false;}
  }
  function modalOpen(){
    for(var i=0;i<MODALS.length;i++){var m=$(MODALS[i]);if(m&&!m.classList.contains("isDone")&&visibleNow(m))return MODALS[i];}
    try{if(typeof anyPanelOpen==="function"&&anyPanelOpen())return "sidePanel";}catch(e){}
    return "";
  }
  function note(kind,id){
    D.byTier[kind]=(D.byTier[kind]||0)+1;
    D.log.push({t:Math.round(now()),kind:kind,id:id}); if(D.log.length>40)D.log.shift();
  }

  function ensureStyles(){
    if($("tapLites2189Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2189Style";
    s.textContent=
      "/* V2.1.89 — quiet tap + one visible moment */"+
      TAP_CHATTER.map(function(id){return "#"+id;}).join(",")+"{display:none!important}"+
      "."+HUSH+"{visibility:hidden!important;opacity:0!important;animation:none!important;transition:none!important}"+
      /* micro moments: short, and never take input */
      "#geiSignatureMoment.show{animation-duration:.9s!important}"+
      "#geiSignatureMoment.show .sigWater{animation-duration:.7s!important}"+
      "#damIteComboFlash.show{animation-duration:.72s!important}"+
      /* V2.1.68 pointer-layer rule: moment surfaces are display-only */
      "#damIteComboFlash,#geiSignatureMoment,#tl2177Milestone,#labelToast,#damItePersonalityLayer,"+
      "#damItePersonalityLayer *,#celebCard,#dayReward,#tl2178Reward,#tl2185IntroBadge,#tl2187QuietPulse,.tl2187QuietPulse{pointer-events:none!important}";
    document.head.appendChild(s);
  }

  function hush(el,why){
    if(!el.classList.contains(HUSH)){el.classList.add(HUSH);D.hushed++;note("hushed:"+why,el.id);}
  }
  function unhush(el){ if(el.classList.contains(HUSH))el.classList.remove(HUSH); }

  /* The arbiter. Runs on every class change of a governed surface (+ a slow safety tick). */
  var microTimer=0;
  function arbitrate(fresh){
    var t=now(), modal=modalOpen(), active=[];
    /* A surface re-raised by its own system is a new showing: it gets a fresh decision. */
    if(fresh)fresh.forEach(function(id){
      /* …except the micro owner re-raising itself (combo x2 → x4): same moment, same 900 ms cap. */
      if(D.owner===id&&BY_ID[id].tier==="micro"&&t-D.ownerSince<MICRO_MAX_MS)return;
      var e=$(id);if(e)unhush(e);if(D.owner===id)D.owner=null;
    });
    SURFACES.forEach(function(s){
      var el=$(s.id); if(!el)return;
      if(!raised(el)){ unhush(el); if(D.owner===s.id){D.owner=null;} return; }
      active.push({s:s,el:el});
    });
    /* A dialog opening over a live moment takes the screen from it (cinematic excepted). */
    if(modal&&D.owner&&BY_ID[D.owner]&&BY_ID[D.owner].tier!=="cinematic"){var mo0=$(D.owner);if(mo0)hush(mo0,"modal");D.owner=null;}
    /* Current owner stays unless something strictly higher wants the screen. */
    var owner=D.owner&&BY_ID[D.owner]&&active.some(function(a){return a.s.id===D.owner;})?BY_ID[D.owner]:null;
    active.forEach(function(a){
      if(a.s.id===D.owner)return;
      if(a.el.classList.contains(HUSH))return;                         // already lost this showing
      var s=a.s, ok=true, why="";
      if(modal && s.tier!=="cinematic"){ok=false;why="modal";}
      else if(owner && s.p<=owner.p){ok=false;why="busy";}
      else if(s.tier==="micro" && t-D.lastMicroAt<MICRO_GAP_MS){ok=false;why="micro-rate";}
      if(!ok){hush(a.el,why);D.suppressed++;return;}
      if(owner){var o=$(owner.id);if(o)hush(o,"preempted");}
      owner=s; D.owner=s.id; D.ownerSince=t; D.allowed++; note(s.tier,s.id);
      D.lastReason=s.tier; D.lastShownAt=t;
      if(s.tier==="micro"){
        D.lastMicroAt=t;
        clearTimeout(microTimer);
        var el=a.el; microTimer=setTimeout(function(){ if(D.owner!==s.id)return; if(raised(el))hush(el,"micro-cap"); D.owner=null; arbitrate(); },MICRO_MAX_MS);
      }
    });
    if(D.owner){var oe=$(D.owner); if(!oe||!raised(oe)||oe.classList.contains(HUSH))D.owner=null;}
    var vis=SURFACES.filter(function(s){var e=$(s.id);return e&&raised(e)&&!e.classList.contains(HUSH)&&visibleNow(e);}).length;
    if(vis>D.maxVisible)D.maxVisible=vis;
  }

  var observed=new WeakSet();
  var mo=null;
  function observeSurfaces(){
    SURFACES.concat(MODALS.map(function(id){return {id:id};})).forEach(function(s){
      var el=$(s.id);
      if(el&&!observed.has(el)){observed.add(el);mo.observe(el,{attributes:true,attributeOldValue:true,attributeFilter:["class"]});}
    });
  }
  function watch(){
    mo=new MutationObserver(function(list){
      var fresh=[];
      list.forEach(function(r){
        var was=/(^|\s)(show|open)(\s|$)/.test(r.oldValue||""), el=r.target;
        if(!was&&raised(el)&&fresh.indexOf(el.id)<0)fresh.push(el.id);
      });
      arbitrate(fresh);
    });
    observeSurfaces();
    /* Surfaces created lazily (combo flash, signature card, personality layer) get picked up. */
    new MutationObserver(function(list){
      for(var i=0;i<list.length;i++){
        var added=list[i].addedNodes;
        for(var j=0;j<added.length;j++){
          var n=added[j];                                               // tap particles carry no id: ignored cheaply
          if(n.nodeType===1&&(BY_ID[n.id]||MODALS.indexOf(n.id)>=0||(n.firstElementChild&&n.querySelector&&SURFACES.some(function(s){return n.querySelector("#"+s.id);})))){observeSurfaces();arbitrate();return;}
        }
      }
    }).observe(document.body,{childList:true,subtree:true});
    setInterval(function(){arbitrate();},500);
  }

  /* ---- Source-level quieting: ordinary taps never ask for text. ---- */
  function markTapDispatch(e){
    var t=e&&e.target;
    if(!t||!t.closest||!t.closest("#world"))return;
    if(t.closest("button,a,input,select,textarea,.sidePanel,.tribeCard,.gameOverCard,.hud"))return;
    D.tapDispatch=true; setTimeout(function(){D.tapDispatch=false;},0);
  }

  function wrap(obj,name,make){
    try{
      var fn=obj[name];
      if(typeof fn!=="function"||fn.__v2189Wrapped)return false;
      var w=make(fn); w.__v2189Wrapped=true; w.__v2189Original=fn; obj[name]=w;
      return obj[name]===w;
    }catch(e){return false;}
  }
  function guardToast(){
    return wrap(window,"showToast",function(orig){return function(text,ms){
      var s=String(text==null?"":text);
      /* Tap counter chatter, and anything raised from inside an ordinary world tap. */
      if(/^TAPS\s+\d+\s*\/\s*\d+$/i.test(s)||D.tapDispatch){D.suppressed++;note("quiet","labelToast");return false;}
      return orig.apply(this,arguments);
    };});
  }
  function guardPersonality(){
    return wrap(window,"triggerDamItePersonality",function(orig){return function(context){
      /* "tap" = ordinary tap chatter. "breakthrough" always coincides with the day card. */
      if(context==="tap"||context==="breakthrough"){D.suppressed++;note("quiet","personality:"+context);return false;}
      var t=now(); if(t-D.lastNoticeAt<NOTICE_GAP_MS&&context!=="level"){D.suppressed++;return false;}
      var out=orig.apply(this,arguments); if(out)D.lastNoticeAt=t; return out;
    };});
  }
  function guardCharacterMoment(){
    return wrap(window,"geiDamNationMoment",function(orig){return function(kind){
      /* The spotlight still pulses (geiCharacterSpotlightReact); its text only changes for
         real events, never for taps or rapid streaks. */
      if(kind!=="level"&&kind!=="milestone"){D.suppressed++;note("quiet","spotlight:"+kind);return false;}
      return orig.apply(this,arguments);
    };});
  }

  function revealQuietPulse(){
    var p=document.createElement("div");
    p.className="tl2187QuietPulse";
    document.body.appendChild(p);
    setTimeout(function(){p.remove();},750);
  }

  function visibleMoments(){
    return SURFACES.filter(function(s){var e=$(s.id);return e&&raised(e)&&!e.classList.contains(HUSH)&&visibleNow(e);}).map(function(s){return s.id;});
  }
  function selfTest(){
    var chatterHidden=TAP_CHATTER.every(function(id){var e=$(id);return !e||!visibleNow(e);});
    var vis=visibleMoments();
    var pointerSafe=SURFACES.every(function(s){var e=$(s.id);if(!e)return true;try{return getComputedStyle(e).pointerEvents==="none"||s.id==="tribeCard"||s.id==="tl2183SceneCard"||s.id==="geiMapMilestone";}catch(x){return true;}});
    var tapLayer=window.__GEI_V2168_TAP_LAYER__&&window.__GEI_V2168_TAP_LAYER__.selfTest?window.__GEI_V2168_TAP_LAYER__.selfTest():null;
    return {
      version:VERSION, rule:"ONE_VISIBLE_MOMENT_AT_A_TIME",
      oneVisibleNow:vis.length<=1, visibleMoments:vis, maxVisibleObserved:D.maxVisible,
      tapChatterHidden:chatterHidden,
      toastGuarded:!!(window.showToast&&window.showToast.__v2189Wrapped),
      personalityGuarded:!!(window.triggerDamItePersonality&&window.triggerDamItePersonality.__v2189Wrapped),
      spotlightGuarded:!!(window.geiDamNationMoment&&window.geiDamNationMoment.__v2189Wrapped),
      momentSurfacesPointerSafe:pointerSafe, tapLayer:tapLayer,
      owner:D.owner, modal:modalOpen()||null,
      allowed:D.allowed, suppressed:D.suppressed, hushed:D.hushed, byTier:JSON.parse(JSON.stringify(D.byTier)),
      presentationOnly:true, gameplayStateChanged:false
    };
  }

  function startup(){
    if(D.started)return;
    D.started=true;
    ensureStyles();
    guardToast(); guardPersonality(); guardCharacterMoment();
    /* Globals defined later by other deferred scripts get wrapped once they exist. */
    window.addEventListener("load",function(){guardToast();guardPersonality();guardCharacterMoment();});
    window.addEventListener("click",markTapDispatch,true);
    watch();
    arbitrate();
  }

  window.__GEI_TAP_LITES_MOMENT_DIRECTOR__=Object.freeze({
    version:VERSION,
    presentationOnly:true,
    rule:"ONE_VISIBLE_MOMENT_AT_A_TIME",
    tapMessages:"suppressed",
    scrollMessages:"suppressed",
    microMaxMs:MICRO_MAX_MS,
    microGapMs:MICRO_GAP_MS,
    surfaces:SURFACES.map(function(s){return {id:s.id,tier:s.tier,priority:s.p};}),
    tapChatter:TAP_CHATTER.slice(),
    owner:function(){return D.owner;},
    modalOpen:modalOpen,
    visibleMoments:visibleMoments,
    suppressedCount:function(){return D.suppressed;},
    lastReason:function(){return D.lastReason;},
    log:function(){return D.log.slice();},
    arbitrate:arbitrate,
    quietPulse:revealQuietPulse,
    selfTest:selfTest
  });

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();
