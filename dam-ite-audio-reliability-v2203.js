/* V2.2.03 — DAM-ITE AUDIO RELIABILITY LAYER 🎙️
 * Presentation/audio only. Sits on top of the V2.1.94 Voice Director (the single playback
 * owner) and the V2.1.95–V2.2.02 voice layers. It never plays its own clips.
 *
 * Responsibilities:
 *   - validate the hosted MP3 registry (every key, Female/Male packs, Factory normal/excited)
 *   - record each asset's real lifecycle from the Director's "gei:voice-audio" events:
 *       configured → load attempted → loaded | load failed → playback failed → fallback used
 *   - verify live that every announcement resolved to the registry asset for its mode/variant
 *   - absorb accidental double taps on Showcase replay (touch + ghost click)
 *   - warm the current mode's pack once the page is idle (never blocks startup, honours Save-Data)
 *   - window.GEI_VOICE_AUDIO_DIAGNOSTICS: report(), validate(), probe(), probeAll(), selfTest()
 *
 * Honest verification: the browser cannot HEAD the CDN from this page (CSP connect-src does
 * not list it), so nothing here claims remote verification. probe() loads the clip through a
 * throwaway <audio> element and reports exactly what the browser said.
 * No gameplay/economy/progression/XP/purchase/save mutations. No account data is read.
 */
(function(){
  "use strict";
  if(window.__GEI_V2203_AUDIO_RELIABILITY__)return;

  var VERSION="V2.2.03";
  var STEPS=["mountain","dam","millpond","sluice","waterwheel","factory"];
  var VARIANTS=STEPS.concat(["factoryExcited"]);
  var PACK_MODES=["female","male"];
  var MODES=["female","male","random","off"];
  /* Filename slug each key must carry, e.g. voice-sluice-gate-…mp3 / voice-sluice-gate-man-…mp3 */
  var SLUG={mountain:"mountain",dam:"dam",millpond:"millpond",sluice:"sluice-gate",waterwheel:"waterwheel",factory:"factory",factoryExcited:"factory"};
  var REPLAY_GUARD_MS=260;

  var assetsByFile=Object.create(null);
  var counts={announcements:0,playbackStarts:0,played:0,playbackFailures:0,interrupted:0,fallbacks:0,errors:0,loadErrors:0,resolutionMismatches:0,guardedRapidTaps:0,modeSwitches:0,stops:0};
  var active=null;
  var lastAnnounce=null;
  var lastForce={key:"",mode:"",at:0};
  var warmed=Object.create(null);
  var installed=false;

  function director(){return window.GEI_VOICE_DIRECTOR||null;}
  function now(){try{return performance.now();}catch(e){return Date.now();}}
  function copy(o){return JSON.parse(JSON.stringify(o));}

  /* ---------- registry ---------- */
  function registry(){
    var d=director();
    try{if(d&&typeof d.assets==="function")return d.assets();}catch(e){}
    try{var m=window.GEI_MILESTONE_VOICE;if(m&&m.packs)return copy(m.packs);}catch(e){}
    return {};
  }

  function track(file,mode,key){
    if(!file)return null;
    var a=assetsByFile[file];
    if(!a){
      a=assetsByFile[file]={file:file,mode:mode||"",key:key||"",configured:true,loadAttempted:false,loaded:false,
        loadFailed:false,mediaErrorCode:0,playAttempts:0,played:0,playbackFailed:0,lastOutcome:"",lastFailure:"",fallbackUsed:0};
    }
    if(mode&&!a.mode)a.mode=mode;
    if(key&&!a.key)a.key=key;
    return a;
  }

  function syncRegistry(){
    var reg=registry();
    PACK_MODES.forEach(function(mode){
      var pack=reg[mode]||{};
      Object.keys(pack).forEach(function(k){track(pack[k],mode,k);});
    });
    return reg;
  }

  /* Reflects the latest outcome: a clip that played before but fails now reports the failure. */
  function statusOf(a){
    if(a.loadFailed)return "load-failed";
    if(a.lastOutcome==="playback-failed")return "playback-failed";
    if(a.loaded||a.played)return "loaded";
    if(a.loadAttempted)return "load-attempted";
    return "configured";
  }

  function validUrl(u){
    if(typeof u!=="string")return false;
    try{var p=new URL(u);return p.protocol==="https:"&&/\.mp3$/i.test(p.pathname);}catch(e){return false;}
  }

  /* Static validation: every key present, well-formed, unique, and named for its key/voice. */
  function validate(){
    var reg=syncRegistry(),issues=[],mappings=[],seen=Object.create(null);
    PACK_MODES.forEach(function(mode){
      var pack=reg[mode];
      if(!pack){issues.push(mode+": pack missing");return;}
      VARIANTS.forEach(function(k){
        var f=pack[k],problems=[];
        if(!f)problems.push("missing");
        else{
          if(!validUrl(f))problems.push("not an https .mp3 URL");
          var name=(f.split("/").pop()||"").toLowerCase();
          if(name.indexOf("voice-"+SLUG[k]+"-")!==0)problems.push("filename does not match key");
          var isMale=/-man-/.test(name);
          if(mode==="male"&&!isMale)problems.push("not a male recording");
          if(mode==="female"&&isMale)problems.push("male recording in female pack");
          var excited=/-excited-/.test(name);
          if(k==="factoryExcited"&&!excited)problems.push("excited variant is not the excited take");
          if(k!=="factoryExcited"&&excited)problems.push("excited take mapped to "+k);
          if(seen[f])problems.push("URL reused by "+seen[f]);
          seen[f]=mode+":"+k;
        }
        problems.forEach(function(p){issues.push(mode+":"+k+" — "+p);});
        mappings.push({mode:mode,key:k,file:f||"",valid:!problems.length});
      });
    });
    /* The V2.1.93 engine keeps its own copy of the packs: it must agree with the Director. */
    try{
      var legacy=window.GEI_MILESTONE_VOICE&&window.GEI_MILESTONE_VOICE.packs;
      if(legacy)PACK_MODES.forEach(function(mode){
        VARIANTS.forEach(function(k){
          if(legacy[mode]&&reg[mode]&&legacy[mode][k]!==reg[mode][k])issues.push(mode+":"+k+" — V2.1.93 and Director registries disagree");
        });
      });
    }catch(e){}
    return {ok:!issues.length,configured:mappings.length,valid:mappings.filter(function(m){return m.valid;}).length,issues:issues,mappings:mappings};
  }

  /* What a mode may legitimately resolve to (Random resolves to either real pack). */
  function expectedFile(mode,variant){
    var reg=registry();
    return reg[mode]&&reg[mode][variant]||"";
  }

  /* ---------- live lifecycle from the Director ---------- */
  function onEvent(e){
    var d=e&&e.detail||{};
    var a=d.file?track(d.file,d.mode,d.variant):null;
    switch(d.phase){
      case "load-start": if(a)a.loadAttempted=true; break;
      case "load-ok": if(a){a.loadAttempted=true;a.loaded=true;a.loadFailed=false;a.mediaErrorCode=0;} break;
      case "load-error":
        counts.loadErrors++;counts.errors++;
        if(a){a.loadAttempted=true;a.mediaErrorCode=d.code||0;a.lastFailure="media error "+(d.code||0);if(d.final)a.loadFailed=true;}
        break;
      case "announce":
        counts.announcements++;
        lastAnnounce={key:d.key,mode:d.mode,variant:d.variant,file:d.file,voiceMode:d.voiceMode};
        if(d.file&&d.file!==expectedFile(d.mode,d.variant)){counts.resolutionMismatches++;counts.errors++;}
        /* Female/Male must resolve to their own pack; Random must resolve to one of the two. */
        if((d.voiceMode==="female"||d.voiceMode==="male")&&d.mode!==d.voiceMode){counts.resolutionMismatches++;counts.errors++;}
        if(d.voiceMode==="random"&&PACK_MODES.indexOf(d.mode)<0){counts.resolutionMismatches++;counts.errors++;}
        break;
      case "play-start":
        counts.playbackStarts++;
        if(a){a.playAttempts++;a.loadAttempted=true;}
        active={key:d.key,mode:d.mode,variant:d.variant,file:d.file,since:Date.now()};
        break;
      case "play-ok":
        counts.played++;
        if(a){a.played++;a.loaded=true;a.lastOutcome="played";}
        if(active&&active.file===d.file)active=null;
        break;
      case "play-fail":
        counts.playbackFailures++;counts.errors++;
        if(a){a.playbackFailed++;a.lastOutcome="playback-failed";a.lastFailure=d.reason||"play failed";}
        if(active&&active.file===d.file)active=null;
        break;
      case "play-interrupted": counts.interrupted++; break;
      case "fallback":
        counts.fallbacks++;
        if(d.file&&assetsByFile[d.file])assetsByFile[d.file].fallbackUsed++;
        active=null;
        break;
      case "stop": counts.stops++; active=null; break;
      case "mode": counts.modeSwitches++; active=null; scheduleWarm(d.mode,1200); break;
    }
  }

  /* ---------- rapid-tap guard ---------- */
  /* Showcase/UI replays use force:true, which bypasses the Director's own same-key cooldown.
     A touch tap plus its ghost click (or a double tap) within REPLAY_GUARD_MS would restart the
     same clip from zero twice. Only an identical clip that is still playing is absorbed. */
  function guardDirector(){
    var d=director();
    if(!d||d.__v2203Guarded||typeof d.announce!=="function")return false;
    var original=d.announce;
    d.announce=function(key,opts){
      try{
        if(opts&&opts.force&&!opts.preloadOnly){
          var t=now(),mode=typeof d.getMode==="function"?d.getMode():"";
          var s=d.state||{};
          if(key===lastForce.key&&mode===lastForce.mode&&t-lastForce.at<REPLAY_GUARD_MS&&s.active===key){
            counts.guardedRapidTaps++;
            return false;
          }
          lastForce={key:key,mode:mode,at:t};
        }
      }catch(e){}
      return original.apply(d,arguments);
    };
    d.__v2203Guarded=true;
    d.__v2203Original=original;
    return true;
  }

  /* ---------- idle warm-up (never blocks startup) ---------- */
  function saveData(){
    try{var c=navigator.connection;return !!(c&&(c.saveData||/(^|-)2g$/.test(c.effectiveType||"")));}catch(e){return false;}
  }
  function idle(fn,delay){
    setTimeout(function(){
      if(typeof window.requestIdleCallback==="function")window.requestIdleCallback(fn,{timeout:4000});
      else fn();
    },delay);
  }
  function scheduleWarm(mode,delay){
    var d=director();
    if(!d||typeof d.warmUp!=="function")return false;
    mode=mode||currentMode();
    if(mode==="off"||warmed[mode]||saveData())return false;
    warmed[mode]=true;
    idle(function(){try{d.warmUp(mode);}catch(e){counts.errors++;}},delay||0);
    return true;
  }

  /* ---------- explicit browser probe (developer tool; not run automatically) ---------- */
  function probe(file,timeoutMs){
    timeoutMs=timeoutMs||8000;
    return new Promise(function(resolve){
      var a,done=false,timer=0;
      var entry=track(file);
      function finish(result,code){
        if(done)return;done=true;clearTimeout(timer);
        try{a.removeAttribute("src");a.load();}catch(e){}
        if(entry){
          entry.loadAttempted=true;
          if(result==="loaded"){entry.loaded=true;entry.loadFailed=false;}
          else if(result==="failed"){entry.loadFailed=true;entry.mediaErrorCode=code||0;entry.lastFailure="probe: media error "+(code||0);}
        }
        resolve({file:file,result:result,mediaErrorCode:code||0,method:"audio-element-metadata",remoteHeadRequest:false});
      }
      if(!validUrl(file)){resolve({file:file,result:"invalid-url",mediaErrorCode:0,method:"none",remoteHeadRequest:false});return;}
      try{
        a=new Audio();
        a.preload="metadata";
        a.addEventListener("loadedmetadata",function(){finish("loaded");},{once:true});
        a.addEventListener("error",function(){finish("failed",a.error&&a.error.code);},{once:true});
        timer=setTimeout(function(){finish("timeout");},timeoutMs);
        a.src=file;
      }catch(e){finish("failed",0);}
    });
  }
  function probeAll(timeoutMs){
    var files=validate().mappings.map(function(m){return m.file;}).filter(Boolean);
    var out=[],i=0;
    /* Two at a time: gentle on mobile connections. */
    function next(){
      if(i>=files.length)return Promise.resolve();
      var f=files[i++];
      return probe(f,timeoutMs).then(function(r){out.push(r);return next();});
    }
    return Promise.all([next(),next()]).then(function(){
      return {
        total:out.length,
        loaded:out.filter(function(r){return r.result==="loaded";}).length,
        failed:out.filter(function(r){return r.result!=="loaded";}).map(function(r){return r.file+" ("+r.result+")";}),
        results:out,
        note:"Browser media-element load of each clip. Not an HTTP HEAD request."
      };
    });
  }

  /* ---------- diagnostics ---------- */
  function currentMode(){
    var d=director();
    try{return d&&typeof d.getMode==="function"?d.getMode():"female";}catch(e){return "female";}
  }

  function report(){
    var v=validate(),d=director(),cache={},dir={};
    try{cache=d&&typeof d.cacheState==="function"?d.cacheState():{};}catch(e){}
    try{dir=d&&typeof d.selfTest==="function"?d.selfTest():{};}catch(e){}
    var list=v.mappings.map(function(m){
      var a=assetsByFile[m.file]||track(m.file,m.mode,m.key)||{};
      var c=cache[m.file]||{};
      return {mode:m.mode,key:m.key,file:m.file,validMapping:m.valid,status:statusOf(a),
        configured:true,loadAttempted:!!(a.loadAttempted||c.cached),loaded:!!(a.loaded||c.readyState>=2),
        loadFailed:!!a.loadFailed,playAttempts:a.playAttempts||0,played:a.played||0,
        playbackFailed:a.playbackFailed||0,fallbackUsed:a.fallbackUsed||0,lastFailure:a.lastFailure||"",
        cached:!!c.cached,readyState:c.readyState||0};
    });
    return {
      version:VERSION,
      currentMode:currentMode(),
      activeVoice:active?copy(active):null,
      lastAnnouncement:lastAnnounce?copy(lastAnnounce):null,
      configuredAssets:v.configured,
      validMappings:v.valid,
      registryOk:v.ok,
      registryIssues:v.issues.slice(),
      assets:list,
      preload:{
        warmedModes:Object.keys(warmed),
        attempted:list.filter(function(x){return x.loadAttempted;}).length,
        loaded:list.filter(function(x){return x.loaded;}).length,
        cacheEntries:dir.cacheEntries||0
      },
      failedAssetUrls:list.filter(function(x){return x.loadFailed||x.status==="playback-failed";}).map(function(x){return x.file;}),
      playbackCount:counts.playbackStarts,
      playedToEnd:counts.played,
      fallbackCount:counts.fallbacks,
      errorCount:counts.errors,
      counters:copy(counts),
      verification:{
        remoteHeadRequest:false,
        method:"Browser lifecycle events (loadeddata / ended / error) plus optional probe() via an <audio> element.",
        legend:{"configured":"URL is in the registry; the browser has not touched it yet",
          "load-attempted":"the browser started loading it",
          "loaded":"the browser decoded audio data or played it to the end",
          "load-failed":"the browser reported a media error (after one automatic retry)",
          "playback-failed":"play() was rejected or errored and the clip never completed"}
      },
      presentationOnly:true
    };
  }

  function selfTest(){
    var v=validate(),d=director(),showcase=window.GEI_VOICE_SHOWCASE,disc=window.GEI_VOICE_DISCOVERY,rew=window.GEI_VOICE_REWARDS;
    var modeRes={};
    PACK_MODES.forEach(function(m){modeRes[m]=VARIANTS.every(function(k){var f=expectedFile(m,k);return !!f&&v.mappings.some(function(x){return x.file===f&&x.mode===m&&x.valid;});});});
    return {
      version:VERSION,
      registryOk:v.ok,
      configuredAssets:v.configured,
      validMappings:v.valid,
      sixCoreStations:STEPS.length===6&&PACK_MODES.every(function(m){return STEPS.every(function(k){return !!expectedFile(m,k);});}),
      femaleResolves:modeRes.female,
      maleResolves:modeRes.male,
      randomResolves:modeRes.female&&modeRes.male,
      factoryVariants:PACK_MODES.every(function(m){return !!expectedFile(m,"factory")&&!!expectedFile(m,"factoryExcited")&&expectedFile(m,"factory")!==expectedFile(m,"factoryExcited");}),
      modes:MODES.slice(),
      directorPresent:!!d,
      rapidTapGuard:!!(d&&d.__v2203Guarded),
      showcaseReplay:!!(showcase&&typeof showcase.preview==="function"),
      discoveryHook:!!(disc&&typeof disc.discover==="function"&&showcase&&showcase.__v2201Wrapped),
      rewardsHook:!!(disc&&disc.__v2202Wrapped&&rew&&typeof rew.check==="function"),
      soundtrackDuck:!!(window.DAMSoundtrack&&typeof window.DAMSoundtrack.duck==="function"),
      singlePlaybackOwner:!!(window.GEI_MILESTONE_VOICE&&window.GEI_MILESTONE_VOICE.selfTest&&"deferredToDirector" in window.GEI_MILESTONE_VOICE.selfTest()),
      resolutionMismatches:counts.resolutionMismatches,
      remoteHeadRequest:false,
      presentationOnly:true
    };
  }

  function install(){
    if(installed)return;
    installed=true;
    syncRegistry();
    window.addEventListener("gei:voice-audio",onEvent);
    guardDirector();
    /* Warm after the page has loaded and gone idle; the game never waits on it. */
    var start=function(){scheduleWarm(null,0);};
    if(document.readyState==="complete")idle(start,3500);
    else window.addEventListener("load",function(){idle(start,3500);},{once:true});
  }

  var api={
    version:VERSION,
    report:report,validate:validate,probe:probe,probeAll:probeAll,selfTest:selfTest,
    assets:function(){return report().assets;},
    get currentMode(){return currentMode();},
    get activeVoice(){return active?copy(active):null;},
    get counters(){return copy(counts);},
    presentationOnly:true
  };
  window.__GEI_V2203_AUDIO_RELIABILITY__=api;
  window.GEI_VOICE_AUDIO_DIAGNOSTICS=api;

  /* Install at once so no Director event is missed (the Director's script precedes this one).
     The guard wraps the bare Director.announce; the V2.1.96 reactions and V2.1.99 memory
     wrappers install at DOMContentLoaded around it, so an absorbed double tap triggers neither. */
  install();
})();
