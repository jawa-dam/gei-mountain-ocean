/* V2.1.94 — DAM-ITE VOICE DIRECTOR & REACTION LAYER
 * Presentation/audio only.
 * Builds on V2.1.93 dual-voice milestone assets.
 * Responsibilities:
 *   - smart Female/Male/Random/Off selection
 *   - preload hosted milestone assets
 *   - interruption/overlap protection
 *   - voice + visual reaction synchronization
 *   - Factory finale direction
 *   - clean public API for future UI/profile controls
 * No gameplay/economy/progression/save mutations.
 */
(function(){
  "use strict";
  if(window.__GEI_V2194_VOICE_DIRECTOR__) return;

  var VERSION="V2.1.94";
  var MODE_KEY="geiMilestoneVoiceMode";
  var DEFAULT_MODE="female";
  var MODES=["female","male","random","off"];
  var STEPS=["mountain","dam","millpond","sluice","waterwheel","factory"];

  var LABELS={
    mountain:"MOUNTAIN",dam:"DAM",millpond:"MILL POND",
    sluice:"SLUICE-GATE",waterwheel:"WATERWHEEL",factory:"FACTORY"
  };

  var ASSETS={
    female:{
      mountain:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mountain-6BTaNhF3ATrFV89G.mp3",
      dam:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-dam-lmREB3RHfdTkewgw.mp3",
      millpond:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-millpond-XUviwb2ePIOzlFMq.mp3",
      sluice:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-sluice-gate-hEQD902lm4KSCXhp.mp3",
      waterwheel:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-waterwheel-1tpyO8f2tYRXicgv.mp3",
      factory:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-pap6mlywi8BjQhtD.mp3",
      factoryExcited:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-excited-wqLUeeBtyJ4UjGQc.mp3"
    },
    male:{
      mountain:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mountain-man-tEaFDCYZ0xZS9kVw.mp3",
      dam:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-dam-man-ZfOndOK3V7esgIoy.mp3",
      millpond:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-millpond-man-rIcShqM3Ov0tDRBL.mp3",
      sluice:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-sluice-gate-man-axcTS1BK0rgdEj0T.mp3",
      waterwheel:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-waterwheel-man-7riL8bSH9JojFtSU.mp3",
      factory:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-man-yRn6r400sdsxpMwH.mp3",
      factoryExcited:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-man-excited-CCMhfViJX9a1f2Jo.mp3"
    }
  };

  /* Conservative presentation gains; no destructive editing of user recordings. */
  var GAIN={
    female:{mountain:1.10,dam:1.12,millpond:0.90,sluice:1.03,waterwheel:1.00,factory:0.94,factoryExcited:0.90},
    male:{mountain:1.08,dam:1.08,millpond:0.94,sluice:1.02,waterwheel:0.98,factory:0.94,factoryExcited:0.88}
  };

  var cache=Object.create(null),failed=Object.create(null);
  var state={
    active:null,voiceMode:getMode(),resolvedMode:null,variant:null,lastFile:"",
    count:0,played:0,fallback:0,errors:0,preloaded:0
  };
  var token=0, lastKey="", lastAt=0, lastResolvedMode="";

  function now(){return performance.now();}
  function getMode(){
    try{
      var m=localStorage.getItem(MODE_KEY);
      return MODES.indexOf(m)>=0?m:DEFAULT_MODE;
    }catch(e){return DEFAULT_MODE;}
  }
  function setMode(mode){
    mode=String(mode||"").toLowerCase();
    if(MODES.indexOf(mode)<0) mode=DEFAULT_MODE;
    try{localStorage.setItem(MODE_KEY,mode);}catch(e){}
    state.voiceMode=mode;
    return mode;
  }
  function resolveVoiceMode(){
    var mode=getMode();
    if(mode!=="random"){lastResolvedMode=mode;return mode;}
    var pick=lastResolvedMode==="female"?"male":"female";
    lastResolvedMode=pick;
    return pick;
  }
  function pickVariant(key){
    if(key!=="factory") return key;
    /* Excited Factory is a finale accent, not a constant every-time behavior. */
    return Math.random()<0.38?"factoryExcited":"factory";
  }
  function getAsset(key){
    var mode=resolveVoiceMode(),variant=pickVariant(key);
    var pack=ASSETS[mode]||ASSETS.female;
    var file=pack[variant]||pack[key]||null;
    if(!file){
      mode="female";pack=ASSETS.female;file=pack[variant]||pack[key]||null;
    }
    return {
      mode:mode,variant:variant,file:file,
      gain:((GAIN[mode]||GAIN.female)[variant]||1)
    };
  }

  function preloadFile(file){
    if(!file||failed[file]||cache[file]) return !!cache[file];
    try{
      var a=new Audio();
      a.preload="auto";
      a.crossOrigin="anonymous";
      a.src=file;
      cache[file]=a;
      a.addEventListener("canplaythrough",function(){state.preloaded++;},{once:true});
      return true;
    }catch(e){state.errors++;return false;}
  }

  function preloadAll(){
    Object.keys(ASSETS).forEach(function(mode){
      Object.keys(ASSETS[mode]).forEach(function(k){preloadFile(ASSETS[mode][k]);});
    });
  }

  function stopActive(){
    token++;
    Object.keys(cache).forEach(function(file){
      var a=cache[file];
      try{
        a.onended=null;a.onerror=null;a.pause();
      }catch(e){}
    });
    try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
    state.active=null;
  }

  function playFile(file,gain,localToken,done){
    if(!file){done&&done(false);return;}
    var a=cache[file];
    if(!a && !preloadFile(file)) {done&&done(false);return;}
    a=cache[file];
    try{
      a.pause();a.currentTime=0;
      a.volume=Math.max(0,Math.min(1,0.95*gain));
      var finished=false;
      function finish(ok){
        if(finished)return;
        finished=true;
        a.onended=null;a.onerror=null;
        if(!ok)failed[file]=true;
        if(localToken!==token)return;
        done&&done(ok);
      }
      a.onended=function(){finish(true);};
      a.onerror=function(){finish(false);};
      var p=a.play();
      if(p&&typeof p.catch==="function")p.catch(function(){finish(false);});
    }catch(e){done&&done(false);}
  }

  function fallback(text,localToken){
    if(localToken!==token||!window.speechSynthesis)return false;
    try{
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.rate=0.94;u.pitch=1.12;u.volume=0.90;
      var voices=window.speechSynthesis.getVoices?window.speechSynthesis.getVoices():[];
      var en=voices.filter(function(v){return /^en(-|_|$)/i.test(v.lang||"");});
      if(en[0])u.voice=en[0];
      u.onend=function(){if(localToken===token)state.active=null;};
      u.onerror=function(){state.errors++;if(localToken===token)state.active=null;};
      window.speechSynthesis.speak(u);
      state.fallback++;
      return true;
    }catch(e){state.errors++;return false;}
  }

  function getAudioContext(){
    try{
      if(typeof getAudio==="function"){var c=getAudio();if(c)return c;}
    }catch(e){}
    try{
      var C=window.AudioContext||window.webkitAudioContext;
      if(!C)return null;
      if(!getAudioContext.ctx)getAudioContext.ctx=new C();
      if(getAudioContext.ctx.state==="suspended")getAudioContext.ctx.resume();
      return getAudioContext.ctx;
    }catch(e){return null;}
  }

  function sting(key){
    var ctx=getAudioContext();if(!ctx)return;
    var map={
      mountain:[196,246.94,293.66],dam:[220,277.18,329.63],
      millpond:[261.63,329.63,392],sluice:[293.66,369.99,440],
      waterwheel:[329.63,415.30,493.88],factory:[392,493.88,587.33]
    };
    var notes=map[key]||map.mountain;
    try{
      notes.forEach(function(f,i){
        var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+0.015+i*0.07;
        o.type=i===1?"triangle":"sine";
        o.frequency.setValueAtTime(f,t);
        o.frequency.exponentialRampToValueAtTime(f*1.018,t+0.24);
        g.gain.setValueAtTime(0.0001,t);
        g.gain.exponentialRampToValueAtTime(i===2?0.034:0.026,t+0.018);
        g.gain.exponentialRampToValueAtTime(0.0001,t+0.33);
        o.connect(g);g.connect(window.GEI_AUDIO?window.GEI_AUDIO.sfxIn(ctx):ctx.destination);o.start(t);o.stop(t+0.35);
      });
    }catch(e){}
  }

  function visualReaction(key,variant){
    var root=document.getElementById("levelCard");
    if(!root)return;
    root.setAttribute("data-v2194-voice",key);
    root.setAttribute("data-v2194-voice-variant",variant);
    root.setAttribute("data-v2194-voice-mode",state.resolvedMode||"female");
    root.classList.remove("v2194VoiceHit","v2194VoiceFactory");
    void root.offsetWidth;
    root.classList.add(key==="factory"?"v2194VoiceFactory":"v2194VoiceHit");
    var duration=key==="factory"?1250:900;
    setTimeout(function(){root.classList.remove("v2194VoiceHit","v2194VoiceFactory");},duration);
  }

  function duck(){
    try{
      if(window.DAMSoundtrack&&typeof window.DAMSoundtrack.duck==="function"){
        window.DAMSoundtrack.duck("mission");
        return true;
      }
    }catch(e){}
    return false;
  }

  function announce(key,opts){
    opts=opts||{};
    if(STEPS.indexOf(key)<0)return false;
    if(!opts.preloadOnly&&window.GEI_AUDIO&&!window.GEI_AUDIO.femaleAllowed())return false;   // V2.1.84: DAM_MAP zone — female narration blocked
    if(getMode()==="off"&&!opts.force)return false;
    var t=now();
    if(!opts.force&&lastKey===key&&t-lastAt<1500)return false;
    lastKey=key;lastAt=t;
    stopActive();
    var localToken=token;
    state.count++;state.active=key;
    var asset=getAsset(key);
    state.resolvedMode=asset.mode;state.variant=asset.variant;state.lastFile=asset.file||"";
    if(opts.preloadOnly)return true;
    visualReaction(key,asset.variant);
    duck();
    sting(key);
    if(asset.file){
      playFile(asset.file,asset.gain,localToken,function(ok){
        if(localToken!==token)return;
        if(ok){state.played++;state.active=null;return;}
        fallback(LABELS[key],localToken);
      });
    }else{
      fallback(LABELS[key],localToken);
    }
    return true;
  }

  function warmUp(){
    preloadAll();
    return {preloaded:state.preloaded,cached:Object.keys(cache).length};
  }

  function inferFromLevel(level){
    level=Number(level);
    if(!isFinite(level)||level<1||level%6!==0)return null;
    return STEPS[(level/6-1)%6];
  }

  function bindLevelCard(){
    var card=document.getElementById("levelCard");
    if(!card||card.dataset.v2194Bound)return;
    card.dataset.v2194Bound="1";
    var was=card.classList.contains("show");
    var observer=new MutationObserver(function(){
      var shown=card.classList.contains("show");
      if(shown&&!was){
        var el=document.getElementById("lcLevel"),text=el?el.textContent:"";
        var m=text.match(/LEVEL\s+(\d+)\s+COMPLETE/i),key=m?inferFromLevel(m[1]):null;
        if(key)announce(key);
      }
      was=shown;
    });
    observer.observe(card,{attributes:true,attributeFilter:["class"]});
  }

  function bindFanfare(){
    if(typeof window.playLevelFanfare!=="function"||window.playLevelFanfare.__v2194Wrapped)return;
    var original=window.playLevelFanfare;
    var wrapped=function(){
      var out=original.apply(this,arguments);
      try{
        var level=window.state&&Number(window.state.level);
        var key=inferFromLevel(level);
        if(key)announce(key);
      }catch(e){}
      return out;
    };
    wrapped.__v2194Wrapped=true;
    wrapped.__v2194Original=original;
    window.playLevelFanfare=wrapped;
  }

  function css(){
    if(document.getElementById("v2194VoiceStyle"))return;
    var s=document.createElement("style");s.id="v2194VoiceStyle";
    s.textContent=
      "#levelCard.v2194VoiceHit .milestoneCelebration{animation:v2194Pulse .72s cubic-bezier(.2,.9,.2,1) 1}" +
      "#levelCard.v2194VoiceFactory .milestoneCelebration{animation:v2194Factory 1.18s cubic-bezier(.16,.9,.18,1) 1}" +
      "#levelCard.v2194VoiceHit .lcStage{filter:drop-shadow(0 0 25px var(--water-bright,#2fd2ff));}" +
      "#levelCard.v2194VoiceFactory .lcStage{filter:drop-shadow(0 0 34px var(--water-bright,#2fd2ff)) saturate(1.14);}" +
      "@keyframes v2194Pulse{0%{transform:scale(.985)}36%{transform:scale(1.035)}68%{transform:scale(.998)}100%{transform:scale(1)}}" +
      "@keyframes v2194Factory{0%{transform:scale(.97);filter:brightness(1)}30%{transform:scale(1.06);filter:brightness(1.24)}58%{transform:scale(1.015);filter:brightness(1.10)}100%{transform:scale(1);filter:brightness(1)}}" +
      "@media(prefers-reduced-motion:reduce){#levelCard.v2194VoiceHit .milestoneCelebration,#levelCard.v2194VoiceFactory .milestoneCelebration{animation:none}}";
    document.head.appendChild(s);
  }

  function selfTest(){
    return {
      version:VERSION,mode:getMode(),modes:MODES.slice(),steps:STEPS.slice(),
      femaleAssets:STEPS.every(function(k){return !!ASSETS.female[k];}),
      maleAssets:STEPS.every(function(k){return !!ASSETS.male[k];}),
      factoryVariants:!!ASSETS.female.factoryExcited&&!!ASSETS.male.factoryExcited,
      cacheEntries:Object.keys(cache).length,
      preloaded:state.preloaded,announcements:state.count,played:state.played,
      fallback:state.fallback,errors:state.errors,active:state.active,
      presentationOnly:true
    };
  }

  var api={
    version:VERSION,modes:MODES.slice(),steps:STEPS.slice(),labels:JSON.parse(JSON.stringify(LABELS)),
    getMode:getMode,setMode:setMode,announce:announce,warmUp:warmUp,selfTest:selfTest,stop:stopActive,
    get state(){return JSON.parse(JSON.stringify(state));},presentationOnly:true
  };

  window.__GEI_V2194_VOICE_DIRECTOR__=api;
  window.GEI_VOICE_DIRECTOR=api;

  function install(){
    css();bindLevelCard();
    /* Fanfare may exist later in the page lifecycle. */
    bindFanfare();
    window.addEventListener("load",function(){bindLevelCard();bindFanfare();});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();