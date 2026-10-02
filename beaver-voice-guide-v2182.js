/* V2.1.82 — BEAVER VOICE GUIDE ENGINE 🦫💧
 *
 * The Beaver becomes the living voice guide of the DAM MAP and the Mountain → Dam → Mill Pond →
 * Sluice Gate → Water Wheel → Factory journey. Purposeful, short, contextual — never chatty.
 *
 *   1. BEAVER_VOICE_LIBRARY      one central registry of every Beaver clip (id · url · category · stations · repeat policy)
 *   2. GEI_VOICE_LESSONS         empty per-day extension points for future GEI lesson recordings
 *   3. voice controller          one speaker at a time, priorities 1-5, tiny capped queue, anti-repeat, anti-spam
 *   4. music ducking             background music glides to ~28% while the Beaver speaks (soundtrack.voiceDuck)
 *   5. context engine            reads the EXISTING game / Dam Map state — it owns no progress state of its own
 *   6. visual guide              the existing Beaver artwork walks along the Dam Map beside the "you are here" pin
 *
 * Presentation only: never reads or writes FL OZ, XP, purchases, ownership, progression or the game save.
 * The only storage written is its own small heard/visited memory (localStorage "geiBeaverVoice.v1"),
 * the same pattern as damMapSound / geiWelcomeDismissed.
 */
(function(){
  "use strict";
  if(window.__GEI_V2182_BEAVER_VOICE__) return;
  var A=window.GEI_AUDIO;                  // V2.1.83: the master audio manager (master-audio-v2183.js) owns all playback
  if(!A){try{console.warn("[BEAVER] GEI_AUDIO missing — voice guide disabled");}catch(e){}return;}
  var VERSION="V2.1.82";
  var STORE_KEY="geiBeaverVoice.v1";
  var BEAVER_IMG="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-beaver-rhhiVplt1GMykxV8.png";
  var CDN="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var STATIONS=["mountain","dam","millpond","sluice","waterwheel","factory"];
      var STATION_TAP_COOLDOWN_MS=30000;
  var ARRIVAL_COOLDOWN_MS=90000;

  /* ------------------------------------------------------------------ 1. LIBRARY
     Add a future recording by adding one entry (or calling registerClip) — the engine never changes.
     stations: optional station ids the clip suits (omit = any).  repeatable:false = "heard" once, remembered. */
  function clip(id,file,category,o){
    o=o||{};
    return {id:id,url:CDN+file,category:category,stations:o.stations||null,day:o.day||null,
      repeatable:o.repeatable!==false,cooldownMs:o.cooldownMs||0,special:!!o.special,gei:!!o.gei};
  }
  var BEAVER_VOICE_LIBRARY={
    arrival:{},teaching:{},gei:{},interaction:{},progression:{},celebration:{}
  };
  function reg(c){BEAVER_VOICE_LIBRARY[c.category][c.id]=c;return c;}

  /* arrival / navigation */
  reg(clip("this_way","this-way-NsVAmQrpOWzYkGQe.mp3","arrival",{stations:["dam","millpond","waterwheel"]}));
  reg(clip("come_on_water_is_moving","come-on-the-water-is-moving-zhevlDC8BLgzuS1q.mp3","arrival",{stations:["mountain","dam"]}));
  reg(clip("lets_see_where_flow_takes_us","let-s-see-where-the-flow-takes-us-ASryowDIoJ7IeO1u.mp3","arrival",{stations:["millpond","sluice"]}));
  reg(clip("welcome_to_dam_map","welcome-to-the-dam-map-Ia2wHddbAz9oVFuH.mp3","arrival",{repeatable:false,special:true}));
  reg(clip("hey_follow_the_water","hey-follow-the-water-vp0cHjMxnSHLaRzv.mp3","arrival",{stations:["mountain"]}));
  /* teaching */
  reg(clip("lets_learn_what_happens_here","let-s-learn-what-happens-here-6FfbprDZdtadqvqd.mp3","teaching"));
  reg(clip("watch_the_flow","watch-the-flow-S4GUzs1ym4jqjMDr.mp3","teaching",{stations:["dam","millpond","sluice","waterwheel"]}));
  reg(clip("look_closely","look-closely-3oooNkIS3n2IDSHD.mp3","teaching",{stations:["dam","millpond","waterwheel","factory"]}));
  reg(clip("this_is_part_of_the_system","this-is-part-of-the-system-p9wqTF9TuCLuBhsy.mp3","teaching",{stations:["waterwheel","factory"]}));
  reg(clip("follow_water_watch_what_happens","follow-the-water-and-watch-what-happens-fuGDm7gOfSFSV59m.mp3","teaching",{stations:["mountain","millpond"]}));
  /* GEI teaching — introductory cues only, heard once each, until real lesson recordings are supplied */
  reg(clip("in_genesis_engineered_interpretations","in-genesis-engineered-interpretations-we-follow-the-water-as-an-engineered-system-2xM9RS9hOTvKk4hy.mp3","gei",{stations:["mountain"],repeatable:false,gei:true}));
  reg(clip("think_like_engineer_follow_flow","think-like-an-engineer.-follow-the-flow-QFvQUb526XIcWjpZ.mp3","gei",{stations:["millpond"],repeatable:false,gei:true}));
  reg(clip("in_gei_flow_changes","in-gei-this-is-where-the-flow-changes-cT0EjuG1387ecdaI.mp3","gei",{stations:["sluice"],repeatable:false,gei:true}));
  reg(clip("the_system_is_connected","the-system-is-connected-FDOAkqb3scJNDChf.mp3","gei",{stations:["factory"],repeatable:false,gei:true}));
  /* interaction */
  reg(clip("whoa_water_is_moving","whoa-the-water-is-moving-jUFF3KaqGKU8Vium.mp3","interaction",{cooldownMs:60000}));
  reg(clip("look_at_that","look-at-that-YY9rOz20e4zIi6x3.mp3","interaction"));
  reg(clip("keep_flow_moving","keep-the-flow-moving-tO0EiQNkIh9esebm.mp3","interaction",{cooldownMs:60000}));
  reg(clip("open_the_gate","open-the-gate-uKvq6bfmdpfXEmAP.mp3","interaction",{stations:["sluice"],cooldownMs:60000}));
  reg(clip("try_it","try-it-BeILvm3Bf7nvXi8d.mp3","interaction"));
  reg(clip("tap_it","tap-it-jIVayttM9utm97B1.mp3","interaction"));
  /* progression */
  reg(clip("follow_me_next_station","follow-me-to-the-next-station-HtTw9Fgls24X07J0.mp3","progression"));
  reg(clip("the_flow_continues","the-flow-continues-TnzJwy51Hp4te4UG.mp3","progression"));
  reg(clip("you_unlocked_next_station","you-unlocked-the-next-station-9oS8Csr0AaNOmXHj.mp3","progression"));
  reg(clip("day_complete","day-complete-eC3jUnBqVxJjaoy6.mp3","progression"));
  /* celebration */
  reg(clip("you_did_it","you-did-it-dp49JNCmxgf4oDVa.mp3","celebration"));
  reg(clip("awesome_flow","awesome-flow-hrTJVei3FbLkhfnX.mp3","celebration"));
  reg(clip("system_is_working","the-system-is-working-LfWajhohV2jUdpgZ.mp3","celebration"));
  reg(clip("keep_going","keep-going-SlUkoMGvfsEbVyi1.mp3","celebration"));
  reg(clip("gei_explorer","you-re-becoming-a-gei-explorer-yafmll9Uv0M9alPv.mp3","celebration",{cooldownMs:300000}));

  /* ------------------------------------------------------------------ 2. FUTURE GEI LESSONS
     Fill with ids of clips registered via registerClip()/registerLesson(). Nothing is invented here. */
  var GEI_VOICE_LESSONS={day1:[],day2:[],day3:[],day4:[],day5:[],day6:[]};

  /* reaction pools (ids) — contextual picking happens in pick() */
  var POOL_STATION_TAP=["tap_it","try_it","look_closely","watch_the_flow","look_at_that"];
  var POOL_CELEBRATE=["you_did_it","awesome_flow","system_is_working"];
  var POOL_WATER=["whoa_water_is_moving","keep_flow_moving"];
  var POOL_NEXT=["follow_me_next_station","the_flow_continues"];
  var POOL_MAP_OPEN=["hey_follow_the_water","lets_see_where_flow_takes_us"];

  var FLAT={};
  function reindex(){FLAT={};Object.keys(BEAVER_VOICE_LIBRARY).forEach(function(cat){Object.keys(BEAVER_VOICE_LIBRARY[cat]).forEach(function(id){FLAT[id]=BEAVER_VOICE_LIBRARY[cat][id];});});}
  reindex();

  /* ------------------------------------------------------------------ helpers / persistence */
  function $(id){return document.getElementById(id);}
  function now(){return Date.now();}
  function rnd(n){return Math.floor(Math.random()*n);}
  function lsGet(k){try{return window.localStorage.getItem(k);}catch(e){return null;}}
  function lsSet(k,v){try{window.localStorage.setItem(k,v);return true;}catch(e){return false;}}
  function reduced(){try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}

  var mem={heard:{},visited:{},mapOpens:0,lastMapStation:-1,lastPos:null,muted:false};
  (function load(){
    try{var o=JSON.parse(lsGet(STORE_KEY)||"null");
      if(o&&typeof o==="object"){mem.heard=o.heard&&typeof o.heard==="object"?o.heard:{};mem.visited=o.visited&&typeof o.visited==="object"?o.visited:{};
        mem.mapOpens=+o.mapOpens||0;mem.lastMapStation=typeof o.lastMapStation==="number"?o.lastMapStation:-1;mem.lastPos=o.lastPos||null;mem.muted=!!o.muted;}
    }catch(e){}
  })();
  var saveT=0;
  function save(){clearTimeout(saveT);saveT=setTimeout(function(){lsSet(STORE_KEY,JSON.stringify(mem));},150);}

  /* ------------------------------------------------------------------ debug (developer only) */
  var debugOn=false,dbgEl=null;
  try{debugOn=!!window.GEI_DEBUG_BEAVER;}catch(e){}
  try{Object.defineProperty(window,"GEI_DEBUG_BEAVER",{configurable:true,get:function(){return debugOn;},set:function(v){debugOn=!!v;if(!debugOn&&dbgEl){dbgEl.remove();dbgEl=null;}else dbg();}});}catch(e){}
  var dbgLog=[];
  function dlog(msg){if(!debugOn)return;dbgLog.push(msg);if(dbgLog.length>6)dbgLog.shift();try{console.log("[BEAVER] "+msg);}catch(e){}dbg();}
  function dbg(){
    if(!debugOn)return;
    if(!dbgEl){dbgEl=document.createElement("pre");dbgEl.id="geiBeaverDebug";dbgEl.setAttribute("aria-hidden","true");
      dbgEl.style.cssText="position:fixed;left:6px;top:6px;z-index:2147483000;margin:0;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.78);color:#8ff;font:11px/1.35 monospace;pointer-events:none;max-width:70vw;white-space:pre-wrap";
      document.body.appendChild(dbgEl);}
    var c=context(),bs=A.beaver,cur=bs.current;
    dbgEl.textContent="BEAVER:\nclip: "+(cur?cur.id:"-")+"\ncategory: "+(cur?cur.category:"-")+"\nday: "+c.currentDay+"  station: "+c.currentStation+
      "\npriority: "+(cur?cur.priority:"-")+"\nplaying: "+!!cur+"  queue: "+bs.queue+(bs.blocked?"  [autoplay blocked]":"")+"\n"+dbgLog.join("\n");
  }

  /* ------------------------------------------------------------------ 5. CONTEXT (reads existing state only) */
  function gameState(){try{if(typeof state!=="undefined"&&state)return state;}catch(e){}return window.state||null;}
  function mapApi(){return window.__GEI_V2170_DAM_MAP__||null;}
  function context(){
    var p=null,s=gameState(),idx=0,done=0;
    try{var m=mapApi();p=m&&m.progress?m.progress():null;}catch(e){}
    if(p){idx=+p.station||0;done=+p.daysThisLevel||0;}
    else if(s){idx=Math.max(0,Math.min(5,+s.currentStep||0));done=Math.max(0,Math.min(6,Math.floor((+s.levelFlOz||0)/111)));}
    var unlocked=done>=6?6:Math.min(6,done+1),vis=[];
    STATIONS.forEach(function(id,i){if(mem.visited[id])vis.push(id);});
    return {currentDay:idx+1,currentStationIndex:idx,currentStation:STATIONS[idx],unlockedStations:STATIONS.slice(0,unlocked),
      completedDays:done,visitedStations:vis,playerProgress:p||{level:s&&s.level,daysThisLevel:done}};
  }
  function stationOf(i){return STATIONS[Math.max(0,Math.min(5,i|0))];}

  /* ------------------------------------------------------------------ preload (the pool itself lives in GEI_AUDIO) */
  function warmContext(){
    var c=context(),ids=[];
    Object.keys(FLAT).forEach(function(id){var k=FLAT[id];
      if(k.special)return;
      if((k.category==="arrival"||k.category==="teaching"||k.category==="gei")&&(!k.stations||k.stations.indexOf(c.currentStation)>=0)&&!(k.gei&&mem.heard[id]))ids.push(id);
    });
    ids=ids.slice(0,4).concat(["day_complete"],POOL_CELEBRATE.slice(0,1),["you_unlocked_next_station"],POOL_NEXT.slice(0,1),POOL_STATION_TAP.slice(0,2));
    setTimeout(function(){A.preloadBeaver(ids);},1200);
  }

  /* ------------------------------------------------------------------ gates: is the Beaver allowed / needed to be quiet? */
  function otherVoiceBusy(){
    try{var d=window.GEI_VOICE_DIRECTOR;if(d&&d.state&&d.state.active)return true;}catch(e){}
    try{var ev=window.__GEI_V2203_VOICE_EVENT__;var st=ev&&typeof ev.state==="function"?ev.state():null;if(st&&st.activeVoice&&(st.activeVoice.event||st.activeVoice.core))return true;}catch(e){}
    try{if(window.speechSynthesis&&window.speechSynthesis.speaking)return true;}catch(e){}
    return false;
  }
  function overlayUp(){
    var ids=["geiSplash","geiWelcome","preGameCard"];
    for(var i=0;i<ids.length;i++){var e=$(ids[i]);if(!e||e.classList.contains("isDone"))continue;
      try{var cs=getComputedStyle(e);if(cs.display!=="none"&&cs.visibility!=="hidden"&&parseFloat(cs.opacity||"1")>.03){var r=e.getBoundingClientRect();if(r.width&&r.height)return true;}}catch(x){}}
    return false;
  }
  function mapOpen(){var p=$("geiDamMapPage");return !!(p&&p.classList.contains("show"));}
  function enabledNow(){
    if(lsGet("geiMilestoneVoiceMode")==="off")return false;                 // the player's existing voice setting
    if(mapOpen()&&lsGet("damMapSound")==="off")return false;                // the Dam Map's own sound toggle
    return true;
  }

  /* ------------------------------------------------------------------ 3. voice requests → the master audio manager
     Playback, queue, priority, ducking and error handling all live in GEI_AUDIO.playBeaver. This file only decides WHAT to say. */
  var history=[],lastPlayedAt={},stationCool={};
  function resolve(x){return typeof x==="string"?FLAT[x]:x;}
  function recent(id,n){return history.slice(-n).indexOf(id)>=0;}
  A.setVoiceResolver(function(id){return FLAT[id]||null;});
  A.addVoiceGate({canSpeak:enabledNow,busy:function(){return otherVoiceBusy()||overlayUp();}});
  A.onBeaver(function(ev){
    var c=ev.clip;if(!c)return;
    if(ev.type==="start"){setSpeaking(true);dlog("play "+c.id+" p"+ev.priority);}
    else if(ev.type==="end"||ev.type==="abort"){
      lastPlayedAt[c.id]=now();setSpeaking(false);
      if(ev.type==="end"){history.push(c.id);if(history.length>12)history.shift();if(!c.repeatable){mem.heard[c.id]=1;save();}}
      dlog(ev.type+" "+c.id);
    }else if(ev.type==="fail")dlog("FAIL "+c.id+": "+ev.extra);
    else if(ev.type==="drop")dlog("drop "+c.id+" ("+ev.extra+")");
  });
  /* request(idOrClip,{pri:1-5,delay,after,ttl,chain,force}) → accepted? */
  function request(x,o){
    o=o||{};var c=resolve(x);
    if(!c||A.isBroken(c.id))return false;
    var t=now();
    if(!c.repeatable&&mem.heard[c.id]&&!o.force)return false;
    if(c.cooldownMs&&lastPlayedAt[c.id]&&t-lastPlayedAt[c.id]<c.cooldownMs&&!o.force)return false;
    return A.playBeaver(c,o);
  }
  function stop(){A.stopBeaver();}

  /* ------------------------------------------------------------------ contextual picking (anti-repeat) */
  function candidates(cats,station,opts){
    opts=opts||{};var out=[];
    cats.forEach(function(cat){Object.keys(BEAVER_VOICE_LIBRARY[cat]||{}).forEach(function(id){
      var k=BEAVER_VOICE_LIBRARY[cat][id];
      if(k.special||A.isBroken(id))return;
      if(k.gei&&!opts.gei)return;
      if(!k.repeatable&&mem.heard[id])return;
      if(k.stations&&station&&k.stations.indexOf(station)<0)return;
      out.push(id);
    });});
    return out;
  }
  function pickFrom(ids){
    ids=ids.filter(function(id){return FLAT[id]&&!A.isBroken(id)&&(FLAT[id].repeatable||!mem.heard[id]);});
    if(!ids.length)return null;
    var fresh=ids.filter(function(id){return !recent(id,3);});
    var from=fresh.length?fresh:ids.filter(function(id){return id!==history[history.length-1];});
    if(!from.length)from=ids;
    return from[rnd(from.length)];
  }

  /* ------------------------------------------------------------------ event reactions */
  function lessonFor(day){
    var list=GEI_VOICE_LESSONS["day"+day]||[];
    for(var i=0;i<list.length;i++){var c=FLAT[list[i]];if(c&&!A.isBroken(c.id)&&!mem.heard[c.id])return c.id;}
    return null;
  }
  /* A station became the active one (game or map). One short, purposeful line — GEI intro/lesson first, else a contextual arrival. */
  function arrive(idx,source,delay){
    var st=stationOf(idx),t=now();
    var first=!mem.visited[st];
    mem.visited[st]=1;save();
    if(stationCool[st]&&t-stationCool[st]<ARRIVAL_COOLDOWN_MS)return false;
    var id=lessonFor(idx+1);                                              // future recordings take priority automatically
    if(!id){
      var intro=candidates(["gei"],st,{gei:true});                        // introductory GEI cue (heard once)
      if(intro.length&&(first||Math.random()<.5))id=intro[0];
    }
    if(id){stationCool[st]=t;return request(id,{pri:3,delay:delay||600,ttl:9000});}
    if(st==="sluice"&&source!=="map"){stationCool[st]=t;return request("open_the_gate",{pri:2,delay:delay||500});}
    id=pickFrom(candidates(["arrival","teaching"],st));
    if(!id)return false;
    stationCool[st]=t;
    return request(id,{pri:2,delay:delay||500});
  }
  /* A Day finished. day_complete → (celebration | water) → unlock → follow, strictly sequential. */
  function dayComplete(index){
    var chain=now(),last=index>=5;
    if(!request("day_complete",{pri:5,delay:350,chain:chain,ttl:6000}))return false;
    var second=null;
    if((index===3||index===4)&&Math.random()<.5)second=pickFrom(POOL_WATER);   // the gate opened / the wheel turns
    if(!second)second=pickFrom(POOL_CELEBRATE);
    if(last&&!lastPlayedAt.gei_explorer&&FLAT.gei_explorer)second="gei_explorer";
    if(second)request(second,{pri:5,after:650,chain:chain,ttl:9000});
    if(last){request("the_flow_continues",{pri:4,after:450,chain:chain,ttl:14000});}
    else{
      request("you_unlocked_next_station",{pri:4,after:450,chain:chain,ttl:14000});
      /* next stop is the Sluice Gate → the closing line is the gate cue itself; otherwise "follow me" */
      var closer=index===2?"open_the_gate":(Math.random()<.7?"follow_me_next_station":pickFrom(POOL_NEXT));
      request(closer,{pri:5,after:350,chain:chain,ttl:18000,force:index===2});
    }
    stationCool[stationOf(Math.min(5,index+1))]=now();   // the chain IS the arrival line for the next station
    return true;
  }
  /* The player poked a station (map pill, or the first tap on a station in the world). */
  function stationTap(idx,source){
    var st=stationOf(idx),t=now();
    if(stationCool["tap_"+st]&&t-stationCool["tap_"+st]<STATION_TAP_COOLDOWN_MS)return false;
    var c=context(),id=null;
    if(source==="map"&&idx>c.currentStationIndex&&c.completedDays<6)id="keep_going";                 // still ahead of you
    else if(st==="sluice"&&idx===c.currentStationIndex)id="open_the_gate";
    else id=pickFrom(POOL_STATION_TAP);
    if(!id)return false;
    var ok=request(id,{pri:2,delay:120});
    if(ok)stationCool["tap_"+st]=t;
    return ok;
  }
  function discover(){return request("look_at_that",{pri:2,delay:1500});}
  function waterMoving(){return request(pickFrom(POOL_WATER),{pri:2,delay:200});}

  /* ------------------------------------------------------------------ Dam Map hooks */
  var mapWasOpen=false;
  function onMapOpened(){
    mem.mapOpens++;
    var c=context(),idx=c.currentStationIndex,st=c.currentStation,t=now();
    walkBeaver(true);
    if(!mem.heard.welcome_to_dam_map){                                    // first meaningful visit: welcome, then ONE nav line
      var chain=t;
      if(request("welcome_to_dam_map",{pri:3,delay:900,chain:chain,ttl:10000})){
        var nav=pickFrom(POOL_MAP_OPEN);
        if(nav)request(nav,{pri:3,after:500,chain:chain,ttl:20000});
        mem.visited[st]=1;stationCool[st]=t;
      }
    }else{
      var progressed=mem.lastMapStation>=0&&idx>mem.lastMapStation;
      if(progressed)request(pickFrom(POOL_NEXT),{pri:2,delay:1200});      // the Beaver noticed you moved on
      else arrive(idx,"map",900);
    }
    mem.lastMapStation=idx;save();warmContext();
  }
  function bindMap(){
    var page=$("geiDamMapPage");
    if(!page)return false;
    if(page.__beaverBound)return true;page.__beaverBound=true;
    ensureBeaver(page);
    new MutationObserver(function(){
      var open=page.classList.contains("show");
      var was=mapWasOpen;mapWasOpen=open;
      try{
        if(open&&!was)onMapOpened();
        if(!open&&was)A.stopBeaver();                      // leaving the Dam Map: no sentence follows the player back into the game
      }catch(e){dlog("map hook error: "+e);}
    }).observe(page,{attributes:true,attributeFilter:["class"]});
    var pin=$("geiMapPin");
    if(pin)new MutationObserver(function(){walkBeaver(false);}).observe(pin,{attributes:true,attributeFilter:["style"]});
    page.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest(".dmwPill");
      if(b){stationTap(+b.dataset.i,"map");}
    },true);
    if(page.classList.contains("show")){mapWasOpen=true;onMapOpened();}
    return true;
  }
  /* wait (cheaply) for the lazily-built Dam Map page */
  var watching=false,gameBound=false;
  function watchForMap(){
    if(bindMap()||watching)return;
    watching=true;
    var mo=new MutationObserver(function(){if(bindMap())mo.disconnect();});
    mo.observe(document.body,{childList:true});
  }

  /* ------------------------------------------------------------------ 6. visual Beaver (existing artwork) */
  var bv=null,lastWalkKey="";
  function ensureBeaver(page){
    var scene=$("dmwScene");if(!scene||$("geiBeaverGuide"))return;
    if(!$("geiBeaverGuideStyle")){
      var s=document.createElement("style");s.id="geiBeaverGuideStyle";
      s.textContent=
        ".geiBeaverGuide{position:absolute;z-index:4;width:46px;height:46px;margin:-56px 0 0 -92px;pointer-events:none;transition:left 1.1s cubic-bezier(.4,.1,.2,1),top 1.1s cubic-bezier(.4,.1,.2,1)}"+
        ".geiBeaverGuide .bvFace{width:100%;height:100%;border-radius:50%;display:grid;place-items:center;font-size:24px;background:radial-gradient(circle at 35% 30%,#ffd9a0,#b9783a);border:2.5px solid #fff;box-shadow:0 0 16px rgba(255,180,90,.55);overflow:hidden;animation:geiBvIdle 3.4s ease-in-out infinite}"+
        ".geiBeaverGuide img{width:100%;height:100%;object-fit:cover;display:block}"+
        ".geiBeaverGuide.walking .bvFace{animation:geiBvWalk .42s ease-in-out infinite}"+
        ".geiBeaverGuide.speaking .bvFace{box-shadow:0 0 0 4px rgba(47,210,255,.55),0 0 22px rgba(47,210,255,.8)}"+
        "@keyframes geiBvIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}"+
        "@keyframes geiBvWalk{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-4px) rotate(4deg)}}"+
        "@media(prefers-reduced-motion:reduce){.geiBeaverGuide{transition:none}.geiBeaverGuide .bvFace{animation:none!important}}";
      document.head.appendChild(s);
    }
    bv=document.createElement("div");bv.id="geiBeaverGuide";bv.className="geiBeaverGuide";bv.setAttribute("aria-hidden","true");
    bv.innerHTML='<div class="bvFace"><span>🦫</span></div>';
    scene.appendChild(bv);
    var img=new Image();img.alt="";img.decoding="async";
    img.onload=function(){var f=bv&&bv.querySelector(".bvFace");if(f){f.innerHTML="";f.appendChild(img);}};
    img.src=BEAVER_IMG;                                                    // falls back to 🦫 if the artwork is unreachable
    var pin=$("geiMapPin");
    if(pin){var from=mem.lastPos;if(from&&from.l){bv.style.left=from.l;bv.style.top=from.t;}else{bv.style.left=pin.style.left;bv.style.top=pin.style.top;}}
  }
  /* The Beaver travels to the active station, pauses beside the pin, then idles. */
  function walkBeaver(fromOpen){
    var pin=$("geiMapPin");if(!bv||!pin)return;
    var l=pin.style.left,t=pin.style.top;if(!l||!t)return;
    var key=l+"|"+t;if(key===lastWalkKey&&!fromOpen)return;
    var go=function(){
      bv.style.left=l;bv.style.top=t;lastWalkKey=key;mem.lastPos={l:l,t:t};save();
      if(!reduced()){bv.classList.add("walking");setTimeout(function(){if(bv)bv.classList.remove("walking");},1150);}
    };
    if(fromOpen&&mem.lastPos&&mem.lastPos.l&&(mem.lastPos.l!==l||mem.lastPos.t!==t)){bv.style.left=mem.lastPos.l;bv.style.top=mem.lastPos.t;setTimeout(go,420);}
    else go();
  }
  function setSpeaking(on){if(bv)bv.classList.toggle("speaking",!!on);}

  /* ------------------------------------------------------------------ game hooks (wrap existing functions, never replace behaviour) */
  function wrap(name,fn){
    var orig=window[name];
    if(typeof orig!=="function"||orig.__beaver2182)return false;
    var w=function(){var out=orig.apply(this,arguments);try{fn.apply(null,arguments);}catch(e){}return out;};
    w.__beaver2182=true;w.__orig=orig;window[name]=w;return true;
  }
  var lastTapKey="";
  function bindGame(){
    if(gameBound)return true;
    var ok=true;
    ok=wrap("beginDay",function(index){arrive(index|0,"game",900);warmContext();})&&ok;
    ok=wrap("showDayReward",function(index){dayComplete(index|0);})&&ok;
    var w=$("world");
    if(w&&!w.__beaverTap){w.__beaverTap=1;
      w.addEventListener("click",function(){
        setTimeout(function(){var s=gameState();if(!s||s.tapCount!==1)return;var k=s.level+":"+s.currentStep;if(k===lastTapKey)return;lastTapKey=k;stationTap(s.currentStep|0,"game");},0);
      },true);
    }
    window.addEventListener("damnation:ite-in-flow",discover);
    window.addEventListener("damnation:ite-rescued",discover);
    gameBound=true;                                        // listeners are attached exactly once, however often boot retries
    return ok;
  }

  /* ------------------------------------------------------------------ extension API for future recordings */
  function registerClip(def){
    if(!def||!def.id||!def.url||!BEAVER_VOICE_LIBRARY[def.category])return null;
    var c={id:def.id,url:def.url,category:def.category,stations:def.stations||null,day:def.day||null,
      repeatable:def.repeatable!==false,cooldownMs:def.cooldownMs||0,special:!!def.special,gei:!!def.gei};
    BEAVER_VOICE_LIBRARY[c.category][c.id]=c;FLAT[c.id]=c;return c;
  }
  /* registerLesson(day, {id,url}) → appends to GEI_VOICE_LESSONS["day"+day]; played automatically on arrival, once. */
  function registerLesson(day,def){
    var key="day"+day;if(!GEI_VOICE_LESSONS[key]||!def)return null;
    var c=registerClip({id:def.id,url:def.url,category:"gei",day:day,stations:[STATIONS[day-1]],repeatable:false,gei:true});
    if(c&&GEI_VOICE_LESSONS[key].indexOf(c.id)<0)GEI_VOICE_LESSONS[key].push(c.id);
    return c;
  }
  function playLesson(day,n){var ids=GEI_VOICE_LESSONS["day"+day]||[];var id=ids[n|0];return id?request(id,{pri:3,force:true}):false;}

  function selfTest(){
    var all=Object.keys(FLAT).map(function(k){return FLAT[k];});
    return {version:VERSION,clips:all.length,allHaveUrlAndCategory:all.every(function(c){return /^https:\/\/assets\.zyrosite\.com\//.test(c.url)&&!!c.category&&!!c.id;}),
      categories:Object.keys(BEAVER_VOICE_LIBRARY),lessonsEmpty:Object.keys(GEI_VOICE_LESSONS).every(function(k){return GEI_VOICE_LESSONS[k].length===0;}),
      speaking:A.beaver.speaking,queue:A.beaver.queue,blocked:A.beaver.blocked,broken:A.beaver.broken,sharedAudioManager:true,mapBound:!!(($("geiDamMapPage")||{}).__beaverBound),
      gameHooks:gameBound,presentationOnly:true};
  }

  window.BEAVER_VOICE_LIBRARY=BEAVER_VOICE_LIBRARY;
  window.GEI_VOICE_LESSONS=GEI_VOICE_LESSONS;
  var api={version:VERSION,library:BEAVER_VOICE_LIBRARY,lessons:GEI_VOICE_LESSONS,stations:STATIONS.slice(),
    context:context,speak:function(id,o){return request(id,o||{pri:3});},react:function(kind){
      return kind==="discover"?discover():kind==="water"?waterMoving():kind==="tap"?stationTap(context().currentStationIndex,"game"):false;},
    arrive:arrive,dayComplete:dayComplete,stop:stop,registerClip:registerClip,registerLesson:registerLesson,playLesson:playLesson,
    get enabled(){return enabledNow();},get speaking(){return A.beaver.speaking;},get current(){return A.beaver.current;},
    get queueLength(){return A.beaver.queue;},
    memory:function(){return JSON.parse(JSON.stringify(mem));},resetMemory:function(){mem.heard={};mem.visited={};mem.mapOpens=0;mem.lastMapStation=-1;mem.lastPos=null;save();},
    selfTest:selfTest,presentationOnly:true};
  window.__GEI_V2182_BEAVER_VOICE__=api;
  window.GEI_BEAVER_VOICE=api;

  function boot(){
    bindGame();watchForMap();warmContext();
    window.addEventListener("load",function(){bindGame();watchForMap();},{once:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
