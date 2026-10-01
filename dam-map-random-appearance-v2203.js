/* V2.2.03 — DAM MAP RANDOM APPEARANCE ENGINE 🗺️✨
 * "Same world — different atmosphere."
 *
 * Presentation only. Every page load selects one complete visual treatment for the DAM MAP,
 * and every later opening of the map selects a new one (never the same as the last).
 * A treatment is a whole atmosphere — sky, sun/moon, stars, clouds, ridges, water, fog,
 * flow glow, lamps, smoke, shell accent, an optional atmosphere overlay and motion pacing —
 * applied to the V2.1.90 map's existing SVG gradients, ids and classes. Nothing is added to
 * the map DOM: one attribute (data-dmw-theme) on #geiDamMapPage selects a pre-built CSS
 * block, so a new theme replaces the old one by construction and classes never stack.
 *
 * Opening is detected from the map page's own class change ("show"), so it covers the DAM MAP
 * button, the utility dock, the 6th-level milestone overlay and the fallback launcher alike.
 * One OPEN = one selection; repeated open() calls while it is already open do nothing.
 * If the map page is rebuilt, the engine re-binds to the new element and selects again.
 *
 * Never reads or writes game state, FL OZ, XP, levels, purchases, unlocks or saves.
 * Only persisted key: damMapAppearanceLast (the last theme id, so a refresh never repeats it).
 */
(function(){
  "use strict";
  if(window.__GEI_V2203_MAP_APPEARANCE__)return;

  var VERSION="V2.2.03";
  var PAGE_ID="geiDamMapPage";
  var STYLE_ID="geiDamMapAppearanceV2203";
  var ATTR="data-dmw-theme";
  var LAST_KEY="damMapAppearanceLast";

  /* Each theme restyles only things the V2.1.90 scene already draws.
     sky/glow/mount/grass/water: gradient stops · ridges: far + near hills · fog: right-edge fog
     stars: none|low|normal|high · atmosphere: none|sunwash|vignette|warm|mist|sparkle|calm
     motion: calm|normal|lively (cloud drift + water-flow pace; off under reduced motion). */
  var THEMES=[
    {id:"moonlit",name:"Moonlit Valley",mood:"The classic DAM-ITE night",
      sky:["#070b22","#1d1840","#3b2150"],glow:["#fff6d8","#f3c6e6","#f3c6e6"],disc:"#fff4d6",stars:"normal",
      clouds:["#3a2f5a",.85],ridges:["#231d40","#1a1633"],mount:["#8e88bb","#3a3460"],grass:["#1f4d34","#0b1f16"],
      water:["#5fe6ff","#1257d8"],fog:"#0a0f24",flow:["#5fe6ff","#2fd2ff","#22385f"],lamp:"#ffd66b",smoke:"#9aa0b5",
      accent:"47,210,255",page:["#07152b","#02050d"],atmosphere:"none",motion:"normal"},
    {id:"daybreak",name:"Bright Daybreak",mood:"Sunny water, soft clouds, clean glow",
      sky:["#1d4f9a","#3f8fd6","#a9dcf2"],glow:["#fff3c4","#ffd27a","#ffd27a"],disc:"#fff8e0",stars:"none",
      clouds:["#e9f3ff",.55],ridges:["#4a5f9a","#344a7e"],mount:["#b9c4e6","#5b6a9e"],grass:["#2f7a4a","#14402a"],
      water:["#8ff6ff","#1e8be6"],fog:"#183a6a",flow:["#bff8ff","#7fe9ff","#2c5c8f"],lamp:"#fff2b0",smoke:"#dfe6f2",
      accent:"127,233,255",page:["#0c2a52","#04101f"],atmosphere:"sunwash",motion:"normal"},
    {id:"deep-current",name:"Deep Current",mood:"Deep blue water, cool atmospheric light",
      sky:["#01040f","#041a36","#0a3a5e"],glow:["#cfe9ff","#6fb6ff","#6fb6ff"],disc:"#e6f3ff",stars:"low",
      clouds:["#0e2a4a",.9],ridges:["#0b2240","#081a33"],mount:["#5f7fae","#1d3456"],grass:["#0f3b3a","#04161a"],
      water:["#3fb6ff","#0838a8"],fog:"#020814",flow:["#39b8ff","#1f7bff","#13304f"],lamp:"#9fd9ff",smoke:"#6f8aa8",
      accent:"63,182,255",page:["#03112a","#010409"],atmosphere:"vignette",motion:"calm"},
    {id:"sunset",name:"Sunset Spillway",mood:"Sunset glow, warm highlights",
      sky:["#1b0f3a","#7a2d5c","#f0894b"],glow:["#fff1c9","#ffb36b","#ff8a5c"],disc:"#ffe2a8",stars:"low",
      clouds:["#8a3d63",.75],ridges:["#4a2350","#33183f"],mount:["#c98a9e","#5a2e56"],grass:["#3d4a2a","#151a0c"],
      water:["#ffd18a","#2f63d8"],fog:"#1a0c24",flow:["#ffd66b","#ff9a4a","#4a2f55"],lamp:"#ffc46b",smoke:"#c9a0a8",
      accent:"255,179,107",page:["#2a0f2e","#0a0410"],atmosphere:"warm",motion:"normal"},
    {id:"mist",name:"Hydraulic Mist",mood:"Misty hydraulic morning",
      sky:["#0d1a26","#26394a","#4b6170"],glow:["#f2f6ff","#b8c7d6","#b8c7d6"],disc:"#e8eef6",stars:"none",
      clouds:["#8da0b3",.5],ridges:["#2e4252","#22323f"],mount:["#9fb0c2","#43566a"],grass:["#21443a","#0b1d18"],
      water:["#9fe8f0","#2a6fb0"],fog:"#0e1822",flow:["#bff3ff","#8fdfff","#2a4256"],lamp:"#ffe7a8",smoke:"#b9c4cf",
      accent:"185,215,230",page:["#122230","#05090d"],atmosphere:"mist",motion:"calm"},
    {id:"surge",name:"Surge Sparkle",mood:"High-energy sparkling water",
      sky:["#070321","#251060","#55197e"],glow:["#ffffff","#f39cff","#f310ba"],disc:"#ffffff",stars:"high",
      clouds:["#4a2a7a",.7],ridges:["#2a1a5a","#1d1245"],mount:["#a99ae0","#3c2c78"],grass:["#164a4a","#061a1e"],
      water:["#7ff8ff","#2a4dff"],fog:"#0a0624",flow:["#7ff8ff","#f310ba","#2c2466"],lamp:"#ffd6ff",smoke:"#b6a9e0",
      accent:"243,16,186",page:["#1a0838","#05020d"],atmosphere:"sparkle",motion:"lively"},
    {id:"still-waters",name:"Still Waters",mood:"Calm, peaceful exploration",
      sky:["#081a22","#16343c","#2a5450"],glow:["#f4fff0","#bfe8d6","#bfe8d6"],disc:"#f4ffe8",stars:"low",
      clouds:["#24464a",.7],ridges:["#1a3a3e","#132c30"],mount:["#8cb4b0","#2f5552"],grass:["#1f5240","#0a2018"],
      water:["#9ff5e6","#1d7fa8"],fog:"#06141a",flow:["#a8fff0","#4fe0c8","#1d4446"],lamp:"#ffe9b8",smoke:"#a6c2c0",
      accent:"127,240,214",page:["#082026","#02080a"],atmosphere:"calm",motion:"calm"}
  ];
  var BY_ID=Object.create(null);
  THEMES.forEach(function(t){BY_ID[t.id]=t;});

  var MOTION={calm:{cloud:"40s",flow:"1.8s",star:"5.2s"},normal:{cloud:"26s",flow:"1.1s",star:"3.6s"},lively:{cloud:"16s",flow:".75s",star:"2.2s"}};

  var sel={theme:null,seed:0,reason:"",selections:0,opens:0,appliedAt:0,history:[]};
  var page=null,pageObserver=null,bodyObserver=null,wasOpen=false,loadPending=true,rebinds=0;

  function $(id){return document.getElementById(id);}

  /* ---------- CSS: one block per theme, all scoped to the attribute ---------- */
  function themeCss(t){
    var P='#'+PAGE_ID+'['+ATTR+'="'+t.id+'"]', m=MOTION[t.motion]||MOTION.normal, a=t.accent, out=[];
    function rule(sel,body){out.push(sel.split(",").map(function(s){return P+" "+s.trim();}).join(",")+"{"+body+"}");}
    out.push(P+"{background:radial-gradient(circle at 50% 0,rgba("+a+",.16),transparent 45%),linear-gradient(160deg,"+t.page[0]+","+t.page[1]+" 70%)}");
    rule(".dmwShell","border-color:rgba("+a+",.36);box-shadow:0 24px 90px rgba(0,0,0,.55),0 0 55px rgba("+a+",.14)");
    rule(".dmwScroll","background:linear-gradient(180deg,"+t.sky[0]+" 0,"+t.sky[1]+" 62%,"+t.grass[1]+" 62%,"+t.grass[1]+" 100%)");
    t.sky.forEach(function(c,i){rule("#dmwSky stop:nth-child("+(i+1)+")","stop-color:"+c);});
    t.glow.forEach(function(c,i){rule("#dmwMoonGlow stop:nth-child("+(i+1)+")","stop-color:"+c);});
    rule('.dmwSvg>circle[fill="#fff4d6"]',"fill:"+t.disc);
    rule('.dmwSvg>g[fill="#3a2f5a"]',"fill:"+t.clouds[0]+";opacity:"+t.clouds[1]);
    rule('.dmwSvg>path[fill="#231d40"]',"fill:"+t.ridges[0]);
    rule('.dmwSvg>path[fill="#1a1633"]',"fill:"+t.ridges[1]);
    t.mount.forEach(function(c,i){rule("#dmwMount stop:nth-child("+(i+1)+")","stop-color:"+c);});
    t.grass.forEach(function(c,i){rule("#dmwGrass stop:nth-child("+(i+1)+")","stop-color:"+c);});
    t.water.forEach(function(c,i){rule("#dmwWater stop:nth-child("+(i+1)+")","stop-color:"+c);});
    rule("#dmwFog stop","stop-color:"+t.fog);
    rule(".dmwFlow.base","stroke:"+t.flow[2]);
    rule(".dmwFlow.lit","stroke:"+t.flow[0]+";filter:drop-shadow(0 0 5px "+t.flow[1]+")");
    rule(".dmwFlow.lit.on","animation-duration:"+m.flow);
    rule(".dmwStation.current","filter:drop-shadow(0 0 10px rgba("+a+",.6))");
    rule(".dmwLamp","fill:"+t.lamp);
    rule(".dmwSmoke","fill:"+t.smoke);
    rule(".dmwCloud","animation-duration:"+m.cloud);
    rule(".dmwStar","animation-duration:"+m.star);
    if(t.stars==="none")rule(".dmwStar","display:none");
    if(t.stars==="low")rule(".dmwStar:nth-of-type(3n),.dmwStar:nth-of-type(3n+1)","display:none");
    if(t.stars==="high")rule(".dmwStar","fill:#ffffff");
    rule(".dmwPinLabel","border-color:rgba("+a+",.85);box-shadow:0 0 18px rgba("+a+",.35)");
    rule(".dmwPill","border-color:rgba("+a+",.55)");
    rule(".dmwPill.future","border-color:rgba(255,255,255,.14)");
    rule(".dmwPill.now","border-color:#fff;box-shadow:0 0 0 2px rgba("+a+",.35),0 0 20px rgba("+a+",.45)");
    var o=ATMOSPHERE[t.atmosphere];
    if(o)rule(".dmwScene::after",o);
    if(t.atmosphere==="sparkle")rule(".dmwScene::before",SPARKLE_DOTS);
    return out.join("\n");
  }

  /* Overlays sit between the SVG (z 0) and the pin/pills/labels (z 2–3), never take input,
     and only ever animate opacity (compositor-only, no layout, no repaint loops). */
  var OVERLAY="content:'';position:absolute;inset:0;pointer-events:none;z-index:1;";
  var ATMOSPHERE={
    none:"",
    sunwash:OVERLAY+"background:radial-gradient(ellipse at 79% 20%,rgba(255,236,170,.30),rgba(255,236,170,.08) 32%,transparent 58%);",
    vignette:OVERLAY+"background:radial-gradient(ellipse at 50% 55%,transparent 52%,rgba(1,8,26,.55) 100%);",
    warm:OVERLAY+"background:linear-gradient(180deg,transparent 40%,rgba(255,150,80,.13) 74%,rgba(255,120,70,.06) 100%),radial-gradient(ellipse at 79% 26%,rgba(255,180,110,.24),transparent 50%);",
    mist:OVERLAY+"background:linear-gradient(180deg,transparent 46%,rgba(214,228,238,.16) 64%,rgba(214,228,238,.24) 80%,rgba(214,228,238,.10) 100%);animation:dmwApMist 14s ease-in-out infinite alternate;",
    sparkle:OVERLAY+"background:radial-gradient(ellipse at 50% 100%,rgba(243,16,186,.12),transparent 60%);",
    calm:OVERLAY+"background:linear-gradient(180deg,transparent 58%,rgba(170,255,230,.07) 82%,transparent 100%);"
  };
  var SPARKLE_DOTS=OVERLAY+"background-image:radial-gradient(circle,rgba(255,255,255,.9) 0 1px,transparent 1.6px),radial-gradient(circle,rgba(127,248,255,.8) 0 1px,transparent 1.6px);"+
    "background-size:97px 61px,151px 89px;background-position:11px 7px,53px 29px;opacity:.55;animation:dmwApSparkle 5s ease-in-out infinite alternate;";

  function injectStyles(){
    if($(STYLE_ID))return;
    var s=document.createElement("style");s.id=STYLE_ID;
    s.textContent=THEMES.map(themeCss).join("\n")+"\n"+
      "#"+PAGE_ID+"["+ATTR+"] .dmwAhead{text-shadow:0 1px 3px rgba(0,0,0,.85)}\n"+
      "@keyframes dmwApMist{from{opacity:.65}to{opacity:1}}\n"+
      "@keyframes dmwApSparkle{from{opacity:.3}to{opacity:.7}}\n"+
      "@media(prefers-reduced-motion:reduce){#"+PAGE_ID+" .dmwScene::before,#"+PAGE_ID+" .dmwScene::after{animation:none!important}}";
    (document.head||document.documentElement).appendChild(s);
  }

  /* ---------- selection ---------- */
  function rand32(){
    try{var b=new Uint32Array(1);window.crypto.getRandomValues(b);return b[0];}
    catch(e){return Math.floor(Math.random()*4294967296)>>>0;}
  }
  /* Deterministic per seed: the same seed + same previous theme always selects the same theme. */
  function seeded(seed){
    var s=seed>>>0;
    return function(){s=(s+0x6D2B79F5)>>>0;var t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};
  }
  function readLast(){try{return localStorage.getItem(LAST_KEY)||"";}catch(e){return "";}}
  function writeLast(id){try{localStorage.setItem(LAST_KEY,id);}catch(e){}}

  function choose(seed,exclude){
    var pool=THEMES.filter(function(t){return t.id!==exclude;});
    if(!pool.length)pool=THEMES.slice();
    return pool[Math.floor(seeded(seed)()*pool.length)];
  }

  function randomize(opts){
    opts=opts||{};
    var seed=opts.seed!=null?(Number(opts.seed)>>>0):rand32();
    var previous=sel.theme?sel.theme.id:readLast();
    var t=choose(seed,previous);
    sel.seed=seed;
    sel.selections++;
    apply(t.id,{reason:opts.reason||"randomize"});
    return current();
  }

  function apply(id,meta){
    var t=BY_ID[id&&id.id||id];
    if(!t)return false;
    injectStyles();
    sel.theme=t;
    sel.reason=meta&&meta.reason||"apply";
    sel.appliedAt=Date.now();
    sel.history.push(t.id);
    if(sel.history.length>12)sel.history.shift();
    writeLast(t.id);
    paint();
    return true;
  }

  /* Re-apply the current selection to the live map page (e.g. after a rebuild) — no re-roll. */
  function paint(){
    var p=$(PAGE_ID);
    if(!p||!sel.theme)return false;
    if(p.getAttribute(ATTR)!==sel.theme.id)p.setAttribute(ATTR,sel.theme.id);
    return true;
  }
  function refresh(){
    bind();
    if(!sel.theme)return randomize({reason:"refresh"});
    paint();
    return current();
  }

  function current(){
    var t=sel.theme;
    return {
      version:VERSION,
      id:t?t.id:null,name:t?t.name:null,mood:t?t.mood:null,
      atmosphere:t?t.atmosphere:null,stars:t?t.stars:null,motion:t?t.motion:null,
      seed:sel.seed,reason:sel.reason,selections:sel.selections,opens:sel.opens,
      appliedToPage:!!(t&&$(PAGE_ID)&&$(PAGE_ID).getAttribute(ATTR)===t.id),
      history:sel.history.slice()
    };
  }

  /* ---------- open detection ---------- */
  function isOpen(p){return !!(p&&p.classList.contains("show"));}
  function onOpen(){
    sel.opens++;
    /* The page-load selection is the one the first opening reveals; every later opening
       selects anew. Either way one OPEN shows exactly one theme. */
    if(loadPending){loadPending=false;paint();sel.reason="load";return;}
    randomize({reason:"open"});
  }
  function watchPage(p){
    if(pageObserver){pageObserver.disconnect();pageObserver=null;}
    page=p;
    wasOpen=isOpen(p);
    if(!p)return;
    pageObserver=new MutationObserver(function(){
      var open=isOpen(page);
      if(open&&!wasOpen)onOpen();
      wasOpen=open;
    });
    pageObserver.observe(p,{attributes:true,attributeFilter:["class"]});
  }
  /* Binds to the current #geiDamMapPage; a different element than before means the map
     was reconstructed, which counts as a fresh encounter. */
  function bind(){
    var p=$(PAGE_ID);
    if(p===page)return false;
    var rebuilt=!!page&&!!p;
    watchPage(p);
    if(!p)return true;
    if(rebuilt){rebinds++;if(!loadPending)randomize({reason:"rebuild"});else paint();}
    else paint();
    if(isOpen(p)&&!rebuilt)onOpen();
    return true;
  }
  function watchBody(){
    if(bodyObserver||!document.body)return;
    /* childList only (no subtree): cheap even with the many toasts other layers append. */
    bodyObserver=new MutationObserver(function(){if($(PAGE_ID)!==page)bind();});
    bodyObserver.observe(document.body,{childList:true});
  }

  /* ---------- self-test ---------- */
  var HEX=/^#[0-9a-f]{6}$/i;
  function themeValid(t){
    var colors=[].concat(t.sky,t.glow,[t.disc],[t.clouds[0]],t.ridges,t.mount,t.grass,t.water,[t.fog],t.flow,[t.lamp,t.smoke],t.page);
    return t.sky.length===3&&t.glow.length===3&&t.mount.length===2&&t.grass.length===2&&t.water.length===2&&t.flow.length===3&&
      colors.every(function(c){return HEX.test(c);})&&/^\d{1,3},\d{1,3},\d{1,3}$/.test(t.accent)&&
      ["none","low","normal","high"].indexOf(t.stars)>=0&&ATMOSPHERE.hasOwnProperty(t.atmosphere)&&!!MOTION[t.motion]&&
      typeof t.clouds[1]==="number";
  }
  function selfTest(){
    var p=$(PAGE_ID),cur=current();
    /* Everything the themes target must exist in the live map, or the theme would be a no-op. */
    var targets=["#dmwSky","#dmwMoonGlow","#dmwMount","#dmwGrass","#dmwWater","#dmwFog",".dmwStar",".dmwCloud",".dmwFlow.lit",".dmwLamp",".dmwSmoke",".dmwScene",".dmwScroll",".dmwShell",
      '.dmwSvg>g[fill="#3a2f5a"]','.dmwSvg>path[fill="#231d40"]','.dmwSvg>path[fill="#1a1633"]','.dmwSvg>circle[fill="#fff4d6"]'];
    var missing=p?targets.filter(function(s){return !p.querySelector(s);}):targets.slice();
    return {
      version:VERSION,
      themes:THEMES.length,
      themeIds:THEMES.map(function(t){return t.id;}),
      allThemesComplete:THEMES.every(themeValid),
      uniqueIds:Object.keys(BY_ID).length===THEMES.length,
      mapPage:!!p,
      bound:!!p&&p===page,
      reusedTargetsPresent:!missing.length,
      missingTargets:missing,
      singleStyleBlock:document.querySelectorAll("#"+STYLE_ID).length===1,
      themeAttribute:p?p.getAttribute(ATTR):null,
      appliedMatchesSelection:cur.appliedToPage,
      reducedMotionRespected:!!($(STYLE_ID)&&/prefers-reduced-motion/.test($(STYLE_ID).textContent)),
      rebinds:rebinds,
      current:cur,
      touchesGameState:false,
      presentationOnly:true
    };
  }

  /* ---------- install ---------- */
  function install(){
    injectStyles();
    /* One selection per page load / refresh, ready before the map is ever shown. */
    if(!sel.theme)randomize({reason:"load"});
    bind();
    watchBody();
  }

  var api={
    version:VERSION,
    themes:THEMES.map(function(t){return {id:t.id,name:t.name,mood:t.mood};}),
    randomize:randomize,apply:function(id){return apply(id,{reason:"apply"});},
    current:current,refresh:refresh,selfTest:selfTest,
    presentationOnly:true
  };
  window.__GEI_V2203_MAP_APPEARANCE__=api;
  window.GEI_MAP_APPEARANCE=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
  window.addEventListener("load",function(){bind();watchBody();},{once:true});
})();
