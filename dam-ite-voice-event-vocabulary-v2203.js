/* V2.2.03 → V2.2.04 — DAM-ITE VOICE EVENT VOCABULARY ENGINE
 * Presentation/audio-only event-vocal library layered over the existing voice stack.
 *
 *   Core milestone voices (V2.1.93/V2.1.94, 14 hosted MP3s) tell the player WHERE THEY ARE.
 *   Event vocabulary (49 hosted MP3s, this file) tells the player WHAT IS HAPPENING.
 *
 * Rules:
 *   - The six-level milestone schedule (6 MOUNTAIN · 12 DAM · 18 MILL POND · 24 SLUICE-GATE ·
 *     30 WATERWHEEL · 36 FACTORY, repeating) stays owned by GEI_VOICE_DIRECTOR. Core voices have
 *     absolute priority: event vocals stop for them, wait for them, and never replace them.
 *   - Event vocals are event-driven only (never per tap), one at a time, with category priority,
 *     cooldowns and a global gap.
 *   - Voice mode Off silences every event vocal. Female/Male/Random use the same single supplied
 *     recording per word: the new assets are not labelled Female or Male.
 *   - A URL in this file is CONFIGURED, nothing more. LOADED needs a browser load event and
 *     PLAYBACK SUCCESS needs a resolved play() promise. GEI_VOICE_AUDIO_DIAGNOSTICS reports which.
 * No XP, currency, purchases, progression, scores, save data or account data are read for
 * authority or modified.
 */
(function(){
  "use strict";
  if(window.__GEI_V2203_VOICE_EVENT__)return;

  var VERSION="V2.2.03";
  var MODE_KEY="geiMilestoneVoiceMode";
  var MODES=["female","male","random","off"];

  /* ---------------------------------------------------------------------------
     CORE MILESTONE REFERENCE — the original 14 hosted production assets.
     Read-only reference used to verify V2.1.93/V2.1.94 have not drifted. This file never plays
     them; GEI_VOICE_DIRECTOR does.
  --------------------------------------------------------------------------- */
  var CORE_STEPS=["mountain","dam","millpond","sluice","waterwheel","factory"];
  var CORE_KEYS=CORE_STEPS.concat(["factoryExcited"]);
  var CORE_LABELS={mountain:"MOUNTAIN",dam:"DAM",millpond:"MILL POND",sluice:"SLUICE-GATE",
    waterwheel:"WATERWHEEL",factory:"FACTORY",factoryExcited:"FACTORY EXCITED"};
  var CORE_REFERENCE=Object.freeze({
    female:Object.freeze({
      mountain:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mountain-6BTaNhF3ATrFV89G.mp3",
      dam:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-dam-lmREB3RHfdTkewgw.mp3",
      millpond:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-millpond-XUviwb2ePIOzlFMq.mp3",
      sluice:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-sluice-gate-hEQD902lm4KSCXhp.mp3",
      waterwheel:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-waterwheel-1tpyO8f2tYRXicgv.mp3",
      factory:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-pap6mlywi8BjQhtD.mp3",
      factoryExcited:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-excited-wqLUeeBtyJ4UjGQc.mp3"
    }),
    male:Object.freeze({
      mountain:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mountain-man-tEaFDCYZ0xZS9kVw.mp3",
      dam:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-dam-man-ZfOndOK3V7esgIoy.mp3",
      millpond:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-millpond-man-rIcShqM3Ov0tDRBL.mp3",
      sluice:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-sluice-gate-man-axcTS1BK0rgdEj0T.mp3",
      waterwheel:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-waterwheel-man-7riL8bSH9JojFtSU.mp3",
      factory:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-man-yRn6r400sdsxpMwH.mp3",
      factoryExcited:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-man-excited-CCMhfViJX9a1f2Jo.mp3"
    })
  });

  /* ---------------------------------------------------------------------------
     EVENT VOCABULARY — exactly the supplied recordings, one category each.
     group/tone: AMAZING + AMAZING CALM and UH-OH + UH-OH CALM are two deliveries of one
     reaction (energetic / calm), not unrelated events.
     protect: lower-priority audio never interrupts these.
  --------------------------------------------------------------------------- */
  var CATEGORIES=["START","SUCCESS","ENCOURAGEMENT","WARNING","HYDRAULIC","SPECIAL_ACTION","COMPLETION"];
  /* Higher number = higher priority. COMPLETION 1st … START 7th. Core milestones sit above all. */
  var PRIORITY=Object.freeze({START:1,SUCCESS:2,ENCOURAGEMENT:3,WARNING:4,HYDRAULIC:5,SPECIAL_ACTION:6,COMPLETION:7});
  var COOLDOWN_MS=Object.freeze({START:4000,SUCCESS:4500,ENCOURAGEMENT:9000,WARNING:8000,HYDRAULIC:3000,SPECIAL_ACTION:1500,COMPLETION:1200});
  var GLOBAL_GAP_MS=900;          // minimum quiet time between two event vocals (unless outranked)
  var MAX_CLIP_MS=6000;           // safety release if a clip never reports ended/error
  var CORE_MAX_MS=7000;           // a core voice that never reports its end stops blocking after this
  var PENDING_TTL_MS=4000;        // a deferred major vocal is dropped if it cannot play by then
  var DUCK_KIND=Object.freeze({START:"reward",SUCCESS:"reward",ENCOURAGEMENT:"reward",WARNING:"reward",
    HYDRAULIC:"reward",SPECIAL_ACTION:"mission",COMPLETION:"mission"});

  var WORDS=[
    /* START / GAME FLOW */
    {id:"go",label:"GO",category:"START",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-go-yL2lP6GrsLtAeI24.mp3"},
    {id:"ready",label:"READY",category:"START",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-ready-3PePzRRPDT8m4BIS.mp3"},
    {id:"lets-go",label:"LET'S GO",category:"START",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-let-s-go-4BKDqtw99sSDyBjN.mp3"},
    /* SUCCESS / POSITIVE REACTIONS */
    {id:"nice",label:"NICE",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-nice-dp4hucuzcvuv84Wu.mp3"},
    {id:"great",label:"GREAT",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-great-mLybRSEm7pG0FQlb.mp3"},
    {id:"yes",label:"YES",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-yes-pHzMQ9t77B9sDF2M.mp3"},
    {id:"wow",label:"WOW",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-wow-wLtEk5yjxCvjhQjK.mp3"},
    {id:"awesome",label:"AWESOME",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-awesome-SbnGlewuXT9pyD7G.mp3"},
    {id:"amazing",label:"AMAZING",category:"SUCCESS",group:"amazing",tone:"energetic",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-amazing-fCKuXIkQC0Bv9cbA.mp3"},
    {id:"amazing-calm",label:"AMAZING CALM",category:"SUCCESS",group:"amazing",tone:"calm",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-amazing-calm-c6iHjN4obXalxSDt.mp3"},
    {id:"cool",label:"COOL",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-cool-Y1FhS1clcJFAuDiM.mp3"},
    {id:"perfect",label:"PERFECT",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-perfect-HwrT69tkN2UKh2FK.mp3"},
    {id:"brilliant",label:"BRILLIANT",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-brilliant-e4jugBsQL4QIZUrQ.mp3"},
    {id:"good",label:"GOOD",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-good-VwAGBFfOgekZkAEg.mp3"},
    {id:"good-job",label:"GOOD JOB",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-good-job-JIUBMHMQQgmjPkxo.mp3"},
    /* ENCOURAGEMENT */
    {id:"you-got-it",label:"YOU GOT IT",category:"ENCOURAGEMENT",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-you-got-it-GmiVfU63kJrv1wpZ.mp3"},
    {id:"keep-going",label:"KEEP GOING",category:"ENCOURAGEMENT",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-keep-going-C4W1Ra2bjpR44hKg.mp3"},
    {id:"try-again",label:"TRY AGAIN",category:"ENCOURAGEMENT",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-try-again-q3RmWPIJEagZ4OFg.mp3"},
    /* WARNING / RECOVERY */
    {id:"uh-oh",label:"UH-OH",category:"WARNING",group:"uh-oh",tone:"energetic",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-uh-oh-kWVlp3GWUmHngCZi.mp3"},
    {id:"uh-oh-calm",label:"UH-OH CALM",category:"WARNING",group:"uh-oh",tone:"calm",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-uh-oh-calm-6nN6GUXjcpOFSYpS.mp3"},
    {id:"oops",label:"OOPS",category:"WARNING",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-oops-TXclqexMAies8s7p.mp3"},
    {id:"look-out",label:"LOOK OUT",category:"WARNING",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-look-out-CnR85KcEPdk18kQi.mp3"},
    {id:"here-we-go",label:"HERE WE GO",category:"START",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-here-we-go-jLjpnZ3MVNkIHjQR.mp3"},
    {id:"that-was-close",label:"THAT WAS CLOSE",category:"WARNING",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-that-was-close-KAIo9nVGvsnwFkN6.mp3"},
    {id:"oh-yeah",label:"OH YEAH",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-oh-yeah-ro7dFI336tfsiZyg.mp3"},
    {id:"no-way",label:"NO WAY",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-no-way-ryDf90cjCKGwOJsg.mp3"},
    {id:"wait",label:"WAIT",category:"WARNING",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-wait-Aa9VobX29CSQ82kB.mp3"},
    {id:"hey",label:"HEY",category:"SUCCESS",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-hey-lEZtLNazjjUkflas.mp3"},
    {id:"new-discovery",label:"NEW DISCOVERY",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-new-discovery-kQQUHMvpJILfogVe.mp3"},
    {id:"the-flow-is-strong",label:"THE FLOW IS STRONG",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-the-flow-is-strong-h7q1oacx2jtWgvuh.mp3"},
    {id:"the-water-is-rising",label:"THE WATER IS RISING",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-the-water-is-rising-gAo96BsjyvLJBJ1b.mp3"},
    {id:"hydraulic-power",label:"HYDRAULIC POWER",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-hydraulic-power-6UYqLPKzOpzw01z3.mp3"},
    {id:"challenge-complete",label:"CHALLENGE COMPLETE",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-challenge-complete-78VFoXFLw6xr6GXO.mp3"},
    /* HYDRAULIC VOCABULARY */
    {id:"water",label:"WATER",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-water-nn0m965PYbYSCmgD.mp3"},
    {id:"flow",label:"FLOW",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-flow-mAq6w2zboHJ1dfeO.mp3"},
    {id:"pressure",label:"PRESSURE",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-pressure-bLcLMmzKbaHgApKf.mp3"},
    {id:"open-the-gate",label:"OPEN THE GATE",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-open-the-gate-M7emQuugxGqasaqO.mp3"},
    {id:"close-the-gate",label:"CLOSE THE GATE",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-close-the-gate-VZ1Q8uTavlHRZYZX.mp3"},
    {id:"let-it-flow",label:"LET IT FLOW",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-let-it-flow-ioPD43N35SwaI82W.mp3"},
    {id:"full-flow",label:"FULL FLOW",category:"HYDRAULIC",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-full-flow-WksmFpQX1unmMy7X.mp3"},
    /* SPECIAL ACTIONS */
    {id:"open-the-dam",label:"OPEN THE DAM",category:"SPECIAL_ACTION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-open-the-dam-SKamyshanOZBL4qX.mp3"},
    {id:"spin-that-wheel",label:"SPIN THAT WHEEL",category:"SPECIAL_ACTION",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-spin-that-wheel-Krxv1FngHpZKUl67.mp3"},
    {id:"power-the-factory",label:"POWER THE FACTORY",category:"SPECIAL_ACTION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-power-the-factory-D6vWmbSkBuDm5RpG.mp3"},
    /* COMPLETION / ACHIEVEMENT */
    {id:"level-complete",label:"LEVEL COMPLETE",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-level-complete-4bZsZHkIbsKOrFZz.mp3"},
    {id:"mission-complete",label:"MISSION COMPLETE",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mission-complete-awUmeWb3yUwqtYuN.mp3"},
    {id:"you-did-it",label:"YOU DID IT",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-you-did-it-birMlo2lrgvQ7hEe.mp3"},
    {id:"you-unlocked-it",label:"YOU UNLOCKED IT",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-you-unlocked-it-hdfmTWqcJNPKDQxB.mp3"},
    {id:"new-character",label:"NEW CHARACTER",category:"COMPLETION",file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-new-character-BgFWUjECAh73kvkD.mp3"},
    {id:"collection-complete",label:"COLLECTION COMPLETE",category:"COMPLETION",protect:true,file:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-collection-complete-R2qCaDdNwu5M4kzR.mp3"}
  ];

  var BY_ID=Object.create(null),GROUPS=Object.create(null);
  WORDS.forEach(function(w){
    Object.freeze(w);
    BY_ID[w.id]=w;
    if(w.group)(GROUPS[w.group]=GROUPS[w.group]||{})[w.tone]=w.id;
  });

  /* Event-driven selection pools (ids or tone groups). Completion phrases never appear in
     ordinary SUCCESS chatter. */
  var POOLS=Object.freeze({
    successSmall:["nice","good","cool","yes","great"],
    successBig:["wow","awesome","amazing","perfect","brilliant","good-job"],
    retry:["you-got-it","keep-going"],
    noFlow:["try-again","keep-going"],
    timeout:["uh-oh","oops"],
    comboFlow:["flow","let-it-flow"],
    levelComplete:["level-complete","you-did-it"]
  });
  /* Day completion → the hydraulic action that day performs (DAM_DAYS order). */
  var STATION_CUES=[
    {category:"HYDRAULIC",pool:["water","let-it-flow"]},     // Day 1 Mountain: the mountain releases its water
    {category:"SPECIAL_ACTION",pool:["open-the-dam"]},       // Day 2 Dam
    {category:"HYDRAULIC",pool:["pressure","flow"]},         // Day 3 Millpond: the reservoir stores the water
    {category:"HYDRAULIC",pool:["open-the-gate"]},           // Day 4 Sluice Gate: the channel releases the water
    {category:"SPECIAL_ACTION",pool:["spin-that-wheel"]},    // Day 5 Waterwheel
    {category:"SPECIAL_ACTION",pool:["power-the-factory"]}   // Day 6 Mill: the cycle completes
  ];

  /* ---------------------------------------------------------------------------
     STATE
  --------------------------------------------------------------------------- */
  var LOAD={CONFIGURED:"CONFIGURED",ATTEMPTED:"LOAD ATTEMPTED",LOADED:"LOADED",FAILED:"LOAD FAILED",TIMEOUT:"LOAD TIMEOUT"};
  var PLAY={NONE:"NOT PLAYED",SUCCESS:"PLAYBACK SUCCESS",FAILED:"PLAYBACK FAILED",BLOCKED:"PLAYBACK BLOCKED",FALLBACK:"FALLBACK USED"};

  var cache=Object.create(null);           // word id → Audio (one element per asset, listeners bound once)
  var assets=Object.create(null);          // word id → observed load/playback state
  WORDS.forEach(function(w){
    assets[w.id]={load:LOAD.CONFIGURED,playback:PLAY.NONE,attempts:0,success:0,completed:0,failures:0,blocked:0,fallback:0,lastError:""};
  });
  var probeResults=Object.create(null);    // url → LOAD state from an explicit diagnostics probe

  var counters={requests:0,attempts:0,success:0,completed:0,failures:0,blocked:0,fallback:0,
    fallbackSpeech:0,fallbackVisual:0,errors:0,interrupted:0,deferred:0,milestoneProtected:0,
    coreStops:0,suppressed:{}};
  var current=null;                        // {word,token,priority,startedAt,audio,opts}
  var pending=null;                        // one deferred major vocal
  var token=0,lastPlayAt=-1e9,lastPriority=0,lastPick=Object.create(null),lastByKey=Object.create(null);
  var clipTimer=null,reduckTimer=null,pendingTimer=null,followTimer=null,fxTimer=null,warmTimer=null;
  var coreTrack=null,milestoneHoldUntil=0,previewDepth=0,userPreviewUntil=0,levelCompleteFlag=null,collectionDone=false;
  var autoplayBlockedSeen=false,speaking=false,log=[];

  function now(){return (window.performance&&performance.now)?performance.now():Date.now();}
  function director(){return window.GEI_VOICE_DIRECTOR||null;}
  function note(kind,detail){
    log.push({t:Math.round(now()),kind:kind,detail:detail||""});
    if(log.length>40)log.shift();
  }
  function suppress(reason,id){
    counters.suppressed[reason]=(counters.suppressed[reason]||0)+1;
    note("suppressed:"+reason,id);
    return {ok:false,reason:reason,id:id||null};
  }

  function voiceMode(){
    try{var d=director();if(d&&typeof d.getMode==="function")return d.getMode();}catch(e){}
    try{var m=localStorage.getItem(MODE_KEY);if(MODES.indexOf(m)>=0)return m;}catch(e){}
    return "female";
  }
  function adaptiveProfile(){
    try{var a=window.GEI_ADAPTIVE_VOICE;if(a&&typeof a.profile==="function")return a.profile();}catch(e){}
    return "adaptive";
  }
  function gestureSeen(){
    try{var u=navigator.userActivation;if(u&&typeof u.hasBeenActive==="boolean")return u.hasBeenActive;}catch(e){}
    return true;   // no User Activation API: let play() decide and record the result honestly
  }
  function reducedMotion(){
    try{return !!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches);}catch(e){return false;}
  }

  /* ---------------------------------------------------------------------------
     CORE MILESTONE AWARENESS (read-only)
  --------------------------------------------------------------------------- */
  function milestoneKeyForLevel(level){
    level=Number(level);
    if(!isFinite(level)||level<6||level%6!==0)return null;
    return CORE_STEPS[(level/6-1)%6];
  }
  function shownLevel(){
    var card=document.getElementById("levelCard");
    if(!card||!card.classList.contains("show"))return null;
    var el=document.getElementById("lcLevel"),m=(el?el.textContent:"").match(/LEVEL\s+([\d,]+)\s+COMPLETE/i);
    return m?Number(m[1].replace(/,/g,"")):null;
  }
  function coreActive(){
    var d=director(),s=null;
    try{s=d?d.state:null;}catch(e){}
    if(!s||!s.active){coreTrack=null;return null;}
    var id=s.active+"#"+s.count;
    if(!coreTrack||coreTrack.id!==id)coreTrack={id:id,key:s.active,since:now()};
    return now()-coreTrack.since<CORE_MAX_MS?s.active:null;
  }
  function coreBusy(){return now()<milestoneHoldUntil||!!coreActive();}

  /* ---------------------------------------------------------------------------
     AUDIO ELEMENTS — one cached element per asset, listeners attached once at creation.
  --------------------------------------------------------------------------- */
  function audioFor(word){
    if(cache[word.id])return cache[word.id];
    var a;
    try{a=new Audio();}catch(e){counters.errors++;assets[word.id].lastError="Audio() unavailable";return null;}
    var st=assets[word.id];
    a.preload="auto";
    a.addEventListener("loadeddata",function(){if(st.load!==LOAD.LOADED)st.load=LOAD.LOADED;});
    a.addEventListener("error",function(){
      st.load=LOAD.FAILED;
      st.lastError=mediaErrorText(a);
      if(current&&current.audio===a)fail(current.token,current.word,"media-error");
    });
    a.addEventListener("ended",function(){
      if(current&&current.audio===a){st.completed++;counters.completed++;finish(current.token,"ended");}
    });
    try{a.src=word.file;st.load=LOAD.ATTEMPTED;}catch(e){counters.errors++;st.load=LOAD.FAILED;st.lastError=String(e&&e.message||e);}
    cache[word.id]=a;
    return a;
  }
  function mediaErrorText(a){
    var e=a&&a.error;
    if(!e)return "error event";
    var names={1:"MEDIA_ERR_ABORTED",2:"MEDIA_ERR_NETWORK",3:"MEDIA_ERR_DECODE",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"};
    return names[e.code]||("MEDIA_ERR_"+e.code);
  }

  /* Staggered warm-up after the first user gesture: six assets per step, then the timer ends. */
  function warmUp(){
    if(warmTimer)return false;
    var queue=WORDS.filter(function(w){return !cache[w.id];});
    function step(){
      warmTimer=null;
      queue.splice(0,6).forEach(function(w){audioFor(w);});
      if(queue.length)warmTimer=setTimeout(step,400);
    }
    step();
    try{var d=director();if(d&&typeof d.warmUp==="function")d.warmUp();}catch(e){}
    return true;
  }

  /* ---------------------------------------------------------------------------
     SELECTION
  --------------------------------------------------------------------------- */
  function normalizeId(word){
    var id=String(word||"").toLowerCase().replace(/['’]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
    return id;
  }
  function preferredTone(opts){
    if(opts&&(opts.tone==="calm"||opts.tone==="energetic"))return opts.tone;
    if(adaptiveProfile()==="calm")return "calm";
    return Math.random()<0.7?"energetic":"calm";
  }
  /* A pool entry is a word id or a tone group; groups resolve to one delivery. */
  function resolveEntry(entry,opts){
    var id=normalizeId(entry);
    if(GROUPS[id]){var t=preferredTone(opts);return BY_ID[GROUPS[id][t]]||BY_ID[GROUPS[id].energetic]||null;}
    var w=BY_ID[id]||null;
    if(w&&w.group&&opts&&opts.tone&&GROUPS[w.group][opts.tone])w=BY_ID[GROUPS[w.group][opts.tone]];
    return w;
  }
  function slotsFor(category){
    var seen=Object.create(null),out=[];
    WORDS.forEach(function(w){
      if(w.category!==category)return;
      var slot=w.group||w.id;
      if(!seen[slot]){seen[slot]=1;out.push(slot);}
    });
    return out;
  }
  function pickFrom(list,key,opts){
    if(!list||!list.length)return null;
    var options=list.length>1?list.filter(function(x){return x!==lastPick[key];}):list;
    var slot=options[Math.floor(Math.random()*options.length)];
    lastPick[key]=slot;
    return resolveEntry(slot,opts);
  }
  function random(category,opts){
    category=String(category||"").toUpperCase();
    if(CATEGORIES.indexOf(category)<0)return null;
    var pool=opts&&Array.isArray(opts.pool)?opts.pool.filter(function(x){var w=resolveEntry(x,{tone:"energetic"});return w&&w.category===category;}):null;
    return pickFrom(pool&&pool.length?pool:slotsFor(category),category+(pool?":"+pool.join("|"):""),opts);
  }

  /* ---------------------------------------------------------------------------
     PLAYBACK — priority, cooldowns, interruption, deferral, fallback.
  --------------------------------------------------------------------------- */
  function cooldownFor(word,opts){
    if(opts&&typeof opts.cooldown==="number")return opts.cooldown;
    var base=COOLDOWN_MS[word.category];
    return adaptiveProfile()==="calm"?base*2:base;
  }

  function request(word,opts){
    opts=opts||{};
    counters.requests++;
    if(window.GEI_AUDIO&&!window.GEI_AUDIO.femaleAllowed())return suppress("dam-map-zone");   // V2.1.84: DAM_MAP zone — female/DAM-ITE voice blocked
    if(!word)return suppress("unknown-word");
    var priority=PRIORITY[word.category];
    if(voiceMode()==="off")return suppress("voice-off",word.id);
    if(adaptiveProfile()==="off"&&priority<PRIORITY.SPECIAL_ACTION)return suppress("adaptive-off",word.id);
    if(!gestureSeen())return suppress("awaiting-user-gesture",word.id);
    var t=now(),key=opts.cooldownKey||word.category;

    /* Core milestone voices outrank everything in this file. */
    if(coreBusy()){
      if(priority>=PRIORITY.SPECIAL_ACTION||opts.afterCore){defer(word,opts);return {ok:false,reason:"deferred-core-voice",id:word.id};}
      return suppress("core-voice-active",word.id);
    }
    if(!opts.force&&t-(lastByKey[key]||-1e9)<cooldownFor(word,opts))return suppress("cooldown",word.id);
    if(current&&opts.waitForCurrent&&current.word.protect){defer(word,opts);return {ok:false,reason:"deferred-protected",id:word.id};}
    if(current){
      var outranks=priority>current.priority;
      var forcedEqual=opts.force&&priority===current.priority&&!current.word.protect;
      if(!outranks&&!forcedEqual){
        if(priority>=PRIORITY.SPECIAL_ACTION){defer(word,opts);return {ok:false,reason:"deferred-busy",id:word.id};}
        return suppress("busy",word.id);
      }
      counters.interrupted++;
      note("interrupt",current.word.id+"→"+word.id);
      halt();
    }else if(!opts.force&&t-lastPlayAt<GLOBAL_GAP_MS&&priority<=lastPriority){
      return suppress("gap",word.id);
    }
    start(word,opts,key);
    return {ok:true,id:word.id,category:word.category};
  }

  function defer(word,opts){
    if(pending&&PRIORITY[pending.word.category]>PRIORITY[word.category])return;
    pending={word:word,opts:opts,at:now()};
    counters.deferred++;
    note("deferred",word.id);
    schedulePending();
  }
  function schedulePending(){
    if(pendingTimer)return;
    pendingTimer=setTimeout(function(){
      pendingTimer=null;
      if(!pending)return;
      if(now()-pending.at>PENDING_TTL_MS){suppress("deferred-expired",pending.word.id);pending=null;return;}
      if(coreBusy()||current){schedulePending();return;}
      var p=pending;pending=null;
      request(p.word,Object.assign({},p.opts,{force:true,afterCore:false,waitForCurrent:false}));
    },250);
  }

  function start(word,opts,key){
    var st=assets[word.id],myToken=++token,t=now();
    var a=audioFor(word);
    current={word:word,token:myToken,priority:PRIORITY[word.category],startedAt:t,audio:a,opts:opts};
    lastByKey[key]=t;lastPlayAt=t;lastPriority=current.priority;
    counters.attempts++;st.attempts++;
    note("play",word.id);
    visual(word,opts);
    if(!a){fail(myToken,word,"audio-unavailable");return;}
    try{
      a.pause();
      try{a.currentTime=0;}catch(e){}
      a.volume=Math.max(0,Math.min(1,typeof opts.volume==="number"?opts.volume:0.92));
      duck(word.category);
      clipTimer=setTimeout(function(){finish(myToken,"clip-timeout");},MAX_CLIP_MS);
      var p=a.play();
      if(p&&typeof p.then==="function"){
        p.then(function(){
          if(myToken!==token)return;
          st.playback=PLAY.SUCCESS;st.success++;counters.success++;
          if(st.load!==LOAD.LOADED)st.load=LOAD.LOADED;
          reduckTimer=setTimeout(function(){reduckTimer=null;if(current&&current.token===myToken)duck(word.category);},900);
        },function(err){
          if(myToken!==token)return;   // superseded (AbortError from our own pause) — not a failure
          if(err&&err.name==="NotAllowedError"){
            st.playback=PLAY.BLOCKED;st.blocked++;counters.blocked++;autoplayBlockedSeen=true;
            st.lastError="NotAllowedError (autoplay policy)";
            finish(myToken,"blocked");
            return;
          }
          st.lastError=(err&&err.name)||"play() rejected";
          fail(myToken,word,"play-rejected");
        });
      }else{
        /* Legacy play() without a promise: success is only claimed on "ended". */
        st.playback=PLAY.NONE;
      }
    }catch(e){
      st.lastError=String(e&&e.message||e);
      fail(myToken,word,"exception");
    }
  }

  /* One failure per playback: the media error event and the play() rejection can both fire. */
  function fail(myToken,word,why){
    if(!current||current.token!==myToken)return;
    var st=assets[word.id];
    st.failures++;counters.failures++;
    st.playback=PLAY.FAILED;
    note("failed:"+why,word.id);
    finish(myToken,why);
    fallback(word);
  }

  /* Major vocals fall back to a short spoken label when nothing else is speaking; chatter
     falls back to its visual reaction only. Neither is reported as a successful MP3. */
  function fallback(word){
    var st=assets[word.id];
    st.fallback++;counters.fallback++;st.playback=PLAY.FALLBACK;
    if(PRIORITY[word.category]>=PRIORITY.SPECIAL_ACTION&&!coreBusy()&&window.speechSynthesis&&window.SpeechSynthesisUtterance){
      try{
        if(window.speechSynthesis.speaking)throw new Error("speech busy");
        var u=new SpeechSynthesisUtterance(word.label.toLowerCase());
        u.rate=1;u.pitch=1.08;u.volume=0.85;
        u.onend=u.onerror=function(){speaking=false;};
        speaking=true;
        window.speechSynthesis.speak(u);
        counters.fallbackSpeech++;
        note("fallback:speech",word.id);
        return;
      }catch(e){speaking=false;}
    }
    counters.fallbackVisual++;
    note("fallback:visual",word.id);
  }

  /* Release the single playback slot (ended, failed, blocked or safety timeout). */
  function finish(myToken,why){
    if(!current||current.token!==myToken)return false;
    clearTimeout(clipTimer);clipTimer=null;
    clearTimeout(reduckTimer);reduckTimer=null;
    if(why==="clip-timeout"){try{current.audio&&current.audio.pause();}catch(e){}}
    current=null;
    if(pending)schedulePending();
    return true;
  }

  /* Stop the current event vocal without clearing what is deferred. */
  function halt(){
    token++;
    clearTimeout(clipTimer);clipTimer=null;
    clearTimeout(reduckTimer);reduckTimer=null;
    if(current&&current.audio){try{current.audio.pause();}catch(e){}}
    current=null;
    if(speaking){try{window.speechSynthesis.cancel();}catch(e){}speaking=false;}
  }
  function stop(){
    halt();
    pending=null;
    clearTimeout(pendingTimer);pendingTimer=null;
    clearTimeout(followTimer);followTimer=null;
    return true;
  }

  function duck(category){
    try{
      var s=window.DAMSoundtrack;
      if(s&&typeof s.duck==="function")return s.duck(DUCK_KIND[category]||"reward")!==false;
    }catch(e){}
    return false;
  }

  /* ---------------------------------------------------------------------------
     VISUAL REACTIONS — small, non-blocking, one live element; text only for major events.
  --------------------------------------------------------------------------- */
  var FX={
    START:{cls:"v2203FxStart",glyphs:["💧"]},
    SUCCESS:{cls:"v2203FxSuccess",glyphs:["✨","💧"]},
    ENCOURAGEMENT:{cls:"v2203FxEncourage",glyphs:["💪"]},
    WARNING:{cls:"v2203FxWarning",glyphs:["⚠️"]},
    HYDRAULIC:{cls:"v2203FxHydraulic",glyphs:["💧","🌊"]},
    SPECIAL_ACTION:{cls:"v2203FxSpecial",glyphs:["💧","⚙️","✨"],chip:true},
    COMPLETION:{cls:"v2203FxCompletion",glyphs:["🎉","✨","⭐","💧"],chip:true}
  };
  function fxLayer(){
    var el=document.getElementById("v2203VoiceFx");
    if(el)return el;
    if(!document.body)return null;
    el=document.createElement("div");
    el.id="v2203VoiceFx";
    el.setAttribute("aria-hidden","true");
    document.body.appendChild(el);
    return el;
  }
  function visual(word,opts){
    if(opts&&opts.visual===false)return;
    var cfg=FX[word.category];if(!cfg)return;
    var layer=fxLayer();if(!layer)return;
    var world=document.getElementById("world"),r=world&&world.getBoundingClientRect?world.getBoundingClientRect():null;
    var x=r&&r.width?r.left+r.width/2:window.innerWidth/2;
    var y=r&&r.height?r.top+Math.min(r.height*0.28,160):Math.min(window.innerHeight*0.28,200);
    layer.style.left=Math.round(x)+"px";
    layer.style.top=Math.round(Math.max(48,y))+"px";
    layer.className="";
    layer.textContent="";
    void layer.offsetWidth;
    layer.className="show "+cfg.cls;
    var ring=document.createElement("span");ring.className="v2203Ring";layer.appendChild(ring);
    if(!reducedMotion()){
      var n=word.category==="COMPLETION"?6:word.category==="SPECIAL_ACTION"?4:2;
      for(var i=0;i<n;i++){
        var p=document.createElement("span");
        p.className="v2203Bit";
        p.textContent=cfg.glyphs[i%cfg.glyphs.length];
        var ang=(i/n)*Math.PI*2+Math.random()*0.5,dist=34+Math.random()*30;
        p.style.setProperty("--v2203-x",Math.round(Math.cos(ang)*dist)+"px");
        p.style.setProperty("--v2203-y",Math.round(Math.sin(ang)*dist*0.7-12)+"px");
        layer.appendChild(p);
      }
    }
    var levelCardUp=!!shownLevel();
    if(cfg.chip&&!levelCardUp){
      var chip=document.createElement("span");chip.className="v2203Chip";chip.textContent=word.label;layer.appendChild(chip);
    }
    clearTimeout(fxTimer);
    fxTimer=setTimeout(function(){fxTimer=null;layer.className="";layer.textContent="";},word.category==="COMPLETION"?1500:word.category==="SPECIAL_ACTION"?1250:850);
  }

  function css(){
    if(document.getElementById("v2203VoiceEventStyle"))return;
    var s=document.createElement("style");
    s.id="v2203VoiceEventStyle";
    s.textContent=
      "#v2203VoiceFx{position:fixed;left:50%;top:30%;width:0;height:0;z-index:7900;pointer-events:none;display:none;}" +
      "#v2203VoiceFx.show{display:block;}" +
      "#v2203VoiceFx .v2203Ring{position:absolute;left:-28px;top:-28px;width:56px;height:56px;border-radius:50%;border:2px solid var(--v2203-c,rgba(47,210,255,.85));box-shadow:0 0 18px var(--v2203-c,rgba(47,210,255,.5));opacity:0;animation:v2203Ring .8s ease-out 1;}" +
      "#v2203VoiceFx .v2203Bit{position:absolute;left:0;top:0;font-size:clamp(.8rem,3.6vw,1.1rem);transform:translate(-50%,-50%);opacity:0;animation:v2203Bit .85s ease-out 1;}" +
      "#v2203VoiceFx .v2203Chip{position:absolute;left:0;top:34px;transform:translateX(-50%);white-space:nowrap;padding:5px 10px;border-radius:999px;background:rgba(8,11,22,.86);border:1px solid var(--v2203-c,rgba(47,210,255,.6));color:#fff;font:900 clamp(.66rem,3vw,.78rem)/1 Inter,system-ui,sans-serif;letter-spacing:.06em;opacity:0;animation:v2203Chip 1.2s ease-out 1 forwards;}" +
      "#v2203VoiceFx.v2203FxStart{--v2203-c:rgba(140,230,255,.75);}" +
      "#v2203VoiceFx.v2203FxSuccess{--v2203-c:rgba(47,210,255,.85);}" +
      "#v2203VoiceFx.v2203FxEncourage{--v2203-c:rgba(120,255,190,.8);}" +
      "#v2203VoiceFx.v2203FxWarning{--v2203-c:rgba(255,190,70,.9);}" +
      "#v2203VoiceFx.v2203FxHydraulic{--v2203-c:rgba(47,170,255,.9);}" +
      "#v2203VoiceFx.v2203FxSpecial{--v2203-c:rgba(61,140,255,.95);}" +
      "#v2203VoiceFx.v2203FxSpecial .v2203Ring{width:74px;height:74px;left:-37px;top:-37px;border-width:3px;}" +
      "#v2203VoiceFx.v2203FxCompletion{--v2203-c:rgba(255,216,90,.95);}" +
      "#v2203VoiceFx.v2203FxCompletion .v2203Ring{width:84px;height:84px;left:-42px;top:-42px;border-width:3px;}" +
      "@keyframes v2203Ring{0%{transform:scale(.45);opacity:.9}100%{transform:scale(1.35);opacity:0}}" +
      "@keyframes v2203Bit{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--v2203-x)),calc(-50% + var(--v2203-y))) scale(1)}}" +
      "@keyframes v2203Chip{0%{opacity:0;transform:translateX(-50%) translateY(4px)}15%{opacity:1;transform:translateX(-50%)}75%{opacity:1}100%{opacity:0}}" +
      "@media(prefers-reduced-motion:reduce){#v2203VoiceFx .v2203Ring{animation:none;opacity:.55;transform:none}#v2203VoiceFx .v2203Bit{display:none}#v2203VoiceFx .v2203Chip{animation:none;opacity:1}}";
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------------------
     PUBLIC PLAY API
  --------------------------------------------------------------------------- */
  function play(category,opts){
    opts=opts||{};
    category=String(category||"").toUpperCase();
    if(CATEGORIES.indexOf(category)<0)return suppress("unknown-category");
    if(voiceMode()==="off")return suppress("voice-off");
    return request(random(category,opts),opts);
  }
  function playWord(word,opts){
    opts=opts||{};
    return request(resolveEntry(word,opts),opts);
  }
  function playPool(category,pool,opts){
    return play(category,Object.assign({},opts||{},{pool:pool}));
  }

  /* ---------------------------------------------------------------------------
     GAME EVENT HOOKS — wrap existing global presentation functions; call the original first,
     never change arguments or return values, never touch economy/progression authority.
  --------------------------------------------------------------------------- */
  /* Other layers (V2.1.97/V2.1.98) re-wrap on window load, so look through the whole chain. */
  function alreadyWrapped(fn){
    for(var i=0;fn&&i<16;i++){
      if(fn.__v2203Wrapped)return true;
      var next=null;
      for(var k in fn){if(/^__v\d+Original$/.test(k)&&typeof fn[k]==="function"){next=fn[k];break;}}
      fn=next;
    }
    return false;
  }
  function hookGlobal(name,before,after){
    var prior=window[name];
    if(typeof prior!=="function"||alreadyWrapped(prior))return false;
    var wrapped=function(){
      var ctx=null;
      try{if(before)ctx=before.apply(this,arguments);}catch(e){counters.errors++;}
      var out=prior.apply(this,arguments);
      try{if(after)after(arguments,out,ctx);}catch(e){counters.errors++;}
      return out;
    };
    wrapped.__v2203Wrapped=true;
    wrapped.__v2203Original=prior;
    window[name]=wrapped;
    return true;
  }
  function el(id){return document.getElementById(id);}
  function shown(id){var e=el(id);return !!(e&&e.classList.contains("show"));}

  var retrying=false;
  function rewardCue(res,key){
    if(!res)return;
    var kind=res.kind||(res.prize&&res.prize.kind)||"";
    if(res.unlockedId&&kind==="character")return playWord("new-character",{cooldownKey:key});
    if(res.unlockedId)return playWord("you-unlocked-it",{cooldownKey:key});
    if(res.jackpot||(res.prize&&res.prize.jackpot))return playPool("SUCCESS",POOLS.successBig,{cooldownKey:key,tone:"energetic"});
    if(kind==="freeSpin")return playWord("go",{cooldownKey:key});
    if(Math.random()<0.6)return playPool("SUCCESS",POOLS.successSmall,{cooldownKey:key});
  }

  function installHooks(){
    /* START — a new level's first day (not a retry). */
    hookGlobal("beginDay",null,function(args){
      if(Number(args[0])===0&&!retrying)play("START",{cooldownKey:"start"});
    });
    /* HYDRAULIC / SPECIAL_ACTION — only fires when a day was actually completed. */
    hookGlobal("spawnHydraulicBreakthrough",null,function(args){
      var cue=STATION_CUES[Number(args[0])];
      if(cue)playPool(cue.category,cue.pool,{cooldownKey:"station"});
    });
    /* SUCCESS / HYDRAULIC — combo tiers only (the game flashes x2, x4, x6 …; never per tap). */
    hookGlobal("showDamIteComboFlash",null,function(args){
      var text=String(args[0]||""),m=text.match(/x(\d+)/i),n=m?Number(m[1]):0;
      if(!n)return;   // e.g. the level-end "FLOW MASTERED" flash belongs to the completion sequence
      if(n===4)playPool("SUCCESS",POOLS.successSmall,{cooldownKey:"combo"});
      else if(n===6)playPool("HYDRAULIC",POOLS.comboFlow,{cooldownKey:"combo"});
      else if(n===8)playWord("full-flow",{cooldownKey:"combo"});
      else if(n>=10)playPool("SUCCESS",POOLS.successBig,{cooldownKey:"combo"});
    });
    /* WARNING — the clock ran out and the dam broke. */
    hookGlobal("handleDayTimeout",function(){return shown("timeUpCard");},function(args,out,was){
      if(!was&&shown("timeUpCard"))playPool("WARNING",POOLS.timeout,{cooldownKey:"timeout",tone:"energetic"});
    });
    /* ENCOURAGEMENT — the player chose to retry. */
    hookGlobal("retryDay",function(){retrying=true;return shown("timeUpCard");},function(args,out,was){
      retrying=false;
      if(was&&!shown("timeUpCard"))playPool("ENCOURAGEMENT",POOLS.retry,{cooldownKey:"retry"});
    });
    /* SPECIAL_ACTION — Bonus Waterwheel spin actually started. */
    hookGlobal("spinBonusWheel",null,function(args,out){
      if(out)playWord("spin-that-wheel",{cooldownKey:"bonus-spin"});
    });
    hookGlobal("revealBonusResult",function(){var r=el("bwResult");return !!(r&&r.hidden);},function(args,out,wasHidden){
      var r=el("bwResult");
      if(wasHidden&&r&&!r.hidden)rewardCue(args[0],"bonus-result");
    });
    /* Dam Machine results — cooldown-limited so auto-spin never chatters. */
    hookGlobal("presentDamMachineWin",null,function(args){rewardCue(args[0],"machine");});
    hookGlobal("presentDamMachineNoFlow",null,function(){
      if(Math.random()<0.5)playPool("ENCOURAGEMENT",POOLS.noFlow,{cooldownKey:"machine-noflow",cooldown:15000});
    });
    /* Level complete: remember whether it is a live completion (not a quiet restore). */
    hookGlobal("showLevelComplete",function(opts){
      levelCompleteFlag={at:now(),quiet:!!(opts&&opts.quiet)};
    },null);
  }

  function onLevelCardShown(){
    var level=shownLevel();
    if(level==null)return;
    var flag=levelCompleteFlag;levelCompleteFlag=null;
    var live=!!(flag&&!flag.quiet&&now()-flag.at<1500);
    var key=milestoneKeyForLevel(level);
    if(key){
      /* Core milestone: it owns this moment. Stop event audio, then follow up afterwards. */
      milestoneHoldUntil=now()+1200;
      if(current||pending){counters.coreStops++;note("core-milestone-stop",key);}
      stop();
      if(!live)return;
      var follow=collectionDone?"collection-complete":key==="factory"?"mission-complete":null;
      collectionDone=false;
      afterCore(function(){
        if(!shownLevel())return;   // the card was dismissed: the moment has passed
        if(follow)playWord(follow,{afterCore:true,cooldownKey:"milestone-follow"});
        else playPool("SUCCESS",POOLS.successBig,{afterCore:true,force:true,cooldownKey:"milestone-follow"});
      });
      return;
    }
    if(!live)return;
    if(collectionDone){collectionDone=false;playWord("collection-complete",{cooldownKey:"level-complete",waitForCurrent:true});}
    else playPool("COMPLETION",POOLS.levelComplete,{cooldownKey:"level-complete",waitForCurrent:true});
  }

  /* Wait (bounded) until the core voice has finished, then run fn once. */
  function afterCore(fn){
    clearTimeout(followTimer);
    var began=now();
    (function poll(){
      followTimer=setTimeout(function(){
        followTimer=null;
        if(coreBusy()&&now()-began<CORE_MAX_MS){poll();return;}
        followTimer=setTimeout(function(){followTimer=null;fn();},350);
      },250);
    })();
  }

  function bindLevelCard(){
    var card=el("levelCard");
    if(!card||card.dataset.v2203Bound)return;
    card.dataset.v2203Bound="1";
    var was=card.classList.contains("show");
    new MutationObserver(function(){
      var isShown=card.classList.contains("show");
      if(isShown&&!was){try{onLevelCardShown();}catch(e){counters.errors++;}}
      if(!isShown&&was)levelCompleteFlag=null;
      was=isShown;
    }).observe(card,{attributes:true,attributeFilter:["class"]});
  }

  /* WARNING — pressure reaches critical while a day is live (once per crossing). */
  function bindPressure(){
    var world=el("world");
    if(!world||world.dataset.v2203Bound)return;
    world.dataset.v2203Bound="1";
    var was=world.classList.contains("pressureCritical");
    new MutationObserver(function(){
      var crit=world.classList.contains("pressureCritical");
      if(crit&&!was){
        try{
          if(adaptiveProfile()==="calm")playWord("uh-oh-calm",{cooldownKey:"pressure",cooldown:15000});
          else playWord("look-out",{cooldownKey:"pressure",cooldown:15000});
        }catch(e){counters.errors++;}
      }
      was=crit;
    }).observe(world,{attributes:true,attributeFilter:["class"]});
  }

  /* COMPLETION — the last -ite is saved (fires once, on the level that completes the set).
     The phrase is held for that level's completion card. */
  function bindCollection(){
    if(bindCollection.done)return;
    bindCollection.done=true;
    window.addEventListener("damnation:rescue-completed",function(e){
      try{
        var d=e&&e.detail,total=0;
        try{total=(typeof ITES!=="undefined"&&ITES&&ITES.length)||0;}catch(x){}
        if(d&&total&&Number(d.savedCount)>=total)collectionDone=true;
      }catch(x){counters.errors++;}
    });
  }

  /* ---------------------------------------------------------------------------
     CORE MILESTONE PROTECTION — while the shown milestone's core voice is playing, other
     Director announcements (e.g. the V2.1.97 cycle anchor "factory") are held back so Level 6
     says MOUNTAIN, Level 30 says WATERWHEEL … Player-initiated Showcase replays still pass.
     Any core announcement stops event vocals first.
  --------------------------------------------------------------------------- */
  function guardDirector(){
    var d=director();
    if(!d||d.__v2203Guarded||typeof d.announce!=="function")return false;
    var original=d.announce;
    d.announce=function(key,opts){
      if(!previewDepth&&now()>userPreviewUntil){
        var lvlKey=milestoneKeyForLevel(shownLevel());
        if(lvlKey&&coreActive()===lvlKey){
          counters.milestoneProtected++;
          note("milestone-protected",String(key)+" held during "+lvlKey);
          return false;
        }
      }
      if(current||pending){counters.coreStops++;stop();}
      return original.apply(d,arguments);
    };
    d.__v2203Guarded=true;
    d.__v2203Original=original;
    return true;
  }
  /* The Showcase and Voice panels call the Director from their own click handlers (and the
     Voice panel after a 60 ms timeout); a tap there is the player asking to hear a voice. */
  function bindPreviewTaps(){
    if(bindPreviewTaps.done)return;
    bindPreviewTaps.done=true;
    document.addEventListener("click",function(e){
      var t=e.target;
      if(t&&t.closest&&t.closest("#v2200VoiceShowcase,#v2195VoicePanel"))userPreviewUntil=now()+400;
    },true);
  }
  function guardShowcase(){
    var s=window.GEI_VOICE_SHOWCASE;
    if(!s||s.__v2203Guarded||typeof s.preview!=="function")return false;
    var original=s.preview;
    s.preview=function(){
      previewDepth++;
      try{return original.apply(s,arguments);}finally{previewDepth--;}
    };
    s.__v2203Guarded=true;
    return true;
  }

  /* ---------------------------------------------------------------------------
     DIAGNOSTICS
  --------------------------------------------------------------------------- */
  function configuredCore(){
    var mv=window.GEI_MILESTONE_VOICE,packs=mv&&mv.packs?mv.packs:null;
    return packs||null;
  }
  function eventUrlSet(){var o=Object.create(null);WORDS.forEach(function(w){o[w.file]=w.id;});return o;}

  function coreReport(){
    var packs=configuredCore(),events=eventUrlSet(),d=director(),ds=null;
    try{ds=d?d.state:null;}catch(e){}
    var rows=[],missing=[],mismatched=[];
    ["female","male"].forEach(function(pack){
      CORE_KEYS.forEach(function(k){
        var ref=CORE_REFERENCE[pack][k],live=packs&&packs[pack]?packs[pack][k]:null;
        var row={pack:pack,key:k,label:CORE_LABELS[k],url:live||null,referenceUrl:ref,
          matchesReference:live===ref,collidesWithEventVocabulary:!!(live&&events[live]),
          state:live?(probeResults[live]||LOAD.CONFIGURED):"MISSING",
          lastRequestedByDirector:!!(ds&&live&&ds.lastFile===live)};
        if(!live)missing.push(pack+":"+k);
        else if(live!==ref)mismatched.push(pack+":"+k);
        rows.push(row);
      });
    });
    return {rows:rows,missing:missing,mismatched:mismatched,
      femaleCount:rows.filter(function(r){return r.pack==="female"&&r.url;}).length,
      maleCount:rows.filter(function(r){return r.pack==="male"&&r.url;}).length,
      director:ds};
  }

  function report(){
    var core=coreReport(),ds=core.director||{};
    var loadCounts={},playCounts={};
    WORDS.forEach(function(w){
      var st=assets[w.id];
      loadCounts[st.load]=(loadCounts[st.load]||0)+1;
      playCounts[st.playback]=(playCounts[st.playback]||0)+1;
    });
    var ua=null;
    try{var u=navigator.userActivation;ua=u?{hasBeenActive:u.hasBeenActive,isActive:u.isActive}:"unsupported";}catch(e){ua="unavailable";}
    return {
      version:VERSION,
      originalCoreAssetCount:core.rows.filter(function(r){return r.url&&r.matchesReference;}).length,
      femaleCoreCount:core.femaleCount,
      maleCoreCount:core.maleCount,
      missingCoreAssets:core.missing,
      mismatchedCoreAssets:core.mismatched,
      configuredCoreAssets:core.rows,
      coreOverwrittenByEventVocabulary:core.rows.some(function(r){return r.collidesWithEventVocabulary;}),
      eventAssetCount:WORDS.length,
      eventAssets:WORDS.map(function(w){var st=assets[w.id];return {id:w.id,label:w.label,category:w.category,url:w.file,
        load:st.load,playback:st.playback,attempts:st.attempts,success:st.success,completed:st.completed,
        failures:st.failures,blocked:st.blocked,fallback:st.fallback,lastError:st.lastError};}),
      preload:{
        eventLoadStates:loadCounts,
        eventPlaybackStates:playCounts,
        eventCached:Object.keys(cache).length,
        corePreloadedByDirector:ds.preloaded||0,
        coreCacheObservable:false,
        coreNote:"V2.1.94 keeps a private cache; core per-asset LOADED state is only known after probe()."
      },
      voiceMode:voiceMode(),
      adaptiveProfile:adaptiveProfile(),
      activeVoice:{core:coreActive(),event:current?current.word.id:null,pending:pending?pending.word.id:null},
      playbackAttempts:counters.attempts,
      successfulPlaybacks:counters.success,
      completedPlaybacks:counters.completed,
      fallbackCount:counters.fallback,
      errorCount:counters.failures+counters.errors,
      blockedCount:counters.blocked,
      core:{announcements:ds.count||0,played:ds.played||0,fallback:ds.fallback||0,errors:ds.errors||0,
        lastFile:ds.lastFile||"",resolvedMode:ds.resolvedMode||null,milestoneProtected:counters.milestoneProtected},
      counters:JSON.parse(JSON.stringify(counters)),
      autoplay:{userActivation:ua,blockedSeen:autoplayBlockedSeen},
      verificationNote:"CONFIGURED means a URL is present in JavaScript. LOADED needs a browser loadeddata event; PLAYBACK SUCCESS needs a resolved play() promise. Autoplay blocks are recorded as PLAYBACK BLOCKED, not as broken assets.",
      recent:log.slice(-12)
    };
  }

  /* Explicit, opt-in load probe of all 14 core + 38 event URLs. Loads, never plays. */
  function probe(timeoutMs){
    timeoutMs=Math.max(1000,Number(timeoutMs)||8000);
    var urls=[];
    ["female","male"].forEach(function(p){CORE_KEYS.forEach(function(k){
      var packs=configuredCore();var u=packs&&packs[p]&&packs[p][k]||CORE_REFERENCE[p][k];urls.push(u);
    });});
    WORDS.forEach(function(w){urls.push(w.file);});
    return Promise.all(urls.map(function(url){
      return new Promise(function(resolve){
        var a,done=false,timer;
        function end(state,detail){
          if(done)return;done=true;clearTimeout(timer);
          probeResults[url]=state;
          var id=eventUrlSet()[url];
          if(id){var st=assets[id];if(st.load!==LOAD.LOADED||state===LOAD.LOADED)st.load=state;if(detail)st.lastError=detail;}
          try{a.removeAttribute("src");a.load();}catch(e){}
          resolve({url:url,state:state,detail:detail||""});
        }
        try{a=new Audio();}catch(e){probeResults[url]=LOAD.FAILED;resolve({url:url,state:LOAD.FAILED,detail:"Audio() unavailable"});return;}
        probeResults[url]=LOAD.ATTEMPTED;
        a.preload="auto";
        a.addEventListener("loadeddata",function(){end(LOAD.LOADED);},{once:true});
        a.addEventListener("error",function(){end(LOAD.FAILED,mediaErrorText(a));},{once:true});
        timer=setTimeout(function(){end(LOAD.TIMEOUT);},timeoutMs);
        a.src=url;
      });
    })).then(function(results){
      return {results:results,loaded:results.filter(function(r){return r.state===LOAD.LOADED;}).length,
        failed:results.filter(function(r){return r.state===LOAD.FAILED;}).length,
        timedOut:results.filter(function(r){return r.state===LOAD.TIMEOUT;}).length,total:results.length};
    });
  }

  function state(){
    return {version:VERSION,mode:voiceMode(),current:current?{id:current.word.id,category:current.word.category,priority:current.priority}:null,
      pending:pending?pending.word.id:null,coreActive:coreActive(),coreBusy:coreBusy(),
      lastPlayAt:lastPlayAt,counters:JSON.parse(JSON.stringify(counters))};
  }

  function selfTest(){
    var urls=WORDS.map(function(w){return w.file;}),unique=urls.filter(function(u,i){return urls.indexOf(u)===i;});
    var core=coreReport(),coreUrls=[];
    ["female","male"].forEach(function(p){CORE_KEYS.forEach(function(k){coreUrls.push(CORE_REFERENCE[p][k]);});});
    var byCat={};WORDS.forEach(function(w){byCat[w.category]=(byCat[w.category]||0)+1;});
    var order=CATEGORIES.slice().sort(function(a,b){return PRIORITY[b]-PRIORITY[a];});
    return {
      version:VERSION,
      eventAssets:WORDS.length,
      categories:byCat,
      everyWordOneCategory:WORDS.every(function(w){return CATEGORIES.indexOf(w.category)>=0;}),
      uniqueEventUrls:unique.length===WORDS.length,
      hostedMp3Urls:urls.every(function(u){return /^https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/voice-[a-z0-9-]+-[A-Za-z0-9]{16}\.mp3$/.test(u);}),
      noCoreOverlap:urls.every(function(u){return coreUrls.indexOf(u)<0;}),
      coreReferenceAssets:coreUrls.length,
      coreMatchesReference:!core.missing.length&&!core.mismatched.length,
      priorityOrder:order,
      protectedWords:WORDS.filter(function(w){return w.protect;}).map(function(w){return w.label;}),
      toneGroups:JSON.parse(JSON.stringify(GROUPS)),
      mode:voiceMode(),
      presentationOnly:true,
      gameplayStateChanged:false
    };
  }

  /* ---------------------------------------------------------------------------
     INSTALL
  --------------------------------------------------------------------------- */
  function onFirstGesture(){
    document.removeEventListener("pointerdown",onFirstGesture,true);
    document.removeEventListener("keydown",onFirstGesture,true);
    setTimeout(warmUp,1200);
  }

  function install(){
    css();
    guardDirector();guardShowcase();bindPreviewTaps();
    installHooks();bindLevelCard();bindPressure();bindCollection();
    if(!install.gestureBound){
      install.gestureBound=true;
      document.addEventListener("pointerdown",onFirstGesture,true);
      document.addEventListener("keydown",onFirstGesture,true);
    }
  }

  var api={
    version:VERSION,
    categories:CATEGORIES.slice(),
    priority:PRIORITY,
    cooldowns:COOLDOWN_MS,
    words:WORDS.map(function(w){return {id:w.id,label:w.label,category:w.category,file:w.file,group:w.group||null,tone:w.tone||null,protect:!!w.protect};}),
    pools:POOLS,
    play:play,playWord:playWord,random:function(category,opts){var w=random(category,opts);return w?w.id:null;},
    stop:stop,state:state,selfTest:selfTest,diagnostics:report,warmUp:warmUp,
    presentationOnly:true
  };
  window.__GEI_V2203_VOICE_EVENT__=api;
  window.GEI_VOICE_EVENT_V2203=api;
  window.GEI_VOICE_AUDIO_DIAGNOSTICS={version:VERSION,report:report,probe:probe,selfTest:selfTest,presentationOnly:true};

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
  window.addEventListener("load",function(){guardDirector();guardShowcase();installHooks();bindLevelCard();bindPressure();},{once:true});
})();
