/* V2.1.93 — DAM-ITE DUAL VOICE MILESTONE ENGINE
 * Presentation/audio only.
 * Real hosted MP3 recordings are used when available.
 * Voice modes: female (default), male, random, off.
 * Milestones: Mountain → Dam → Mill Pond → Sluice-Gate → Waterwheel → Factory.
 * Factory supports normal + excited variants.
 * No gameplay/economy/progression/save mutations.
 */
(function(){
  "use strict";
  if(window.__GEI_V2193_MILESTONE_VOICE__) return;

  var VERSION = "V2.1.93";
  var STEPS = ["mountain","dam","millpond","sluice","waterwheel","factory"];
  var MODE_KEY = "geiMilestoneVoiceMode";
  var DEFAULT_MODE = "female";
  var modes = ["female","male","random","off"];

  var PACKS = {
    female: {
      mountain:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mountain-6BTaNhF3ATrFV89G.mp3",
      dam:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-dam-lmREB3RHfdTkewgw.mp3",
      millpond:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-millpond-XUviwb2ePIOzlFMq.mp3",
      sluice:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-sluice-gate-hEQD902lm4KSCXhp.mp3",
      waterwheel:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-waterwheel-1tpyO8f2tYRXicgv.mp3",
      factory:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-pap6mlywi8BjQhtD.mp3",
      factoryExcited:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-excited-wqLUeeBtyJ4UjGQc.mp3"
    },
    male: {
      mountain:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-mountain-man-tEaFDCYZ0xZS9kVw.mp3",
      dam:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-dam-man-ZfOndOK3V7esgIoy.mp3",
      millpond:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-millpond-man-rIcShqM3Ov0tDRBL.mp3",
      sluice:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-sluice-gate-man-axcTS1BK0rgdEj0T.mp3",
      waterwheel:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-waterwheel-man-7riL8bSH9JojFtSU.mp3",
      factory:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-man-yRn6r400sdsxpMwH.mp3",
      factoryExcited:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/voice-factory-man-excited-CCMhfViJX9a1f2Jo.mp3"
    }
  };

  var LABELS = {
    mountain:"MOUNTAIN", dam:"DAM", millpond:"MILL POND",
    sluice:"SLUICE-GATE", waterwheel:"WATERWHEEL", factory:"FACTORY"
  };

  /* Rough runtime balancing based on the supplied recordings.
     These are deliberately conservative gain multipliers, not destructive audio edits. */
  var GAIN = {
    female:{mountain:1.10,dam:1.12,millpond:0.90,sluice:1.03,waterwheel:1.00,factory:0.94,factoryExcited:0.90},
    male:{mountain:1.08,dam:1.08,millpond:0.94,sluice:1.02,waterwheel:0.98,factory:0.94,factoryExcited:0.88}
  };

  var active = null;
  var last = {key:"",mode:"",at:0,count:0,errors:0,playedFiles:0,fallback:0};
  var audioCache = Object.create(null);
  var failureCache = Object.create(null);

  function now(){ return performance.now(); }

  function getMode(){
    try{
      var m = localStorage.getItem(MODE_KEY);
      return modes.indexOf(m)>=0 ? m : DEFAULT_MODE;
    }catch(e){ return DEFAULT_MODE; }
  }

  function setMode(mode){
    mode = String(mode||"").toLowerCase();
    if(modes.indexOf(mode)<0) mode=DEFAULT_MODE;
    try{ localStorage.setItem(MODE_KEY,mode); }catch(e){}
    return mode;
  }

  function resolvePackMode(){
    var mode = getMode();
    if(mode !== "random") return mode;
    return Math.random()<0.5 ? "female" : "male";
  }

  function chooseFile(key){
    var packMode = resolvePackMode();
    var pack = PACKS[packMode] || PACKS.female;
    var variant = key==="factory" && Math.random()<0.34 ? "factoryExcited" : key;
    var file = pack[variant] || pack[key] || null;
    if(!file && packMode!=="female") {
      packMode = "female";
      pack = PACKS.female;
      file = pack[variant] || pack[key] || null;
    }
    return {mode:packMode,variant:variant,file:file,gain:(GAIN[packMode]||GAIN.female)[variant] || 1};
  }

  function getAudioContext(){
    try{
      if(typeof getAudio==="function"){ var c=getAudio(); if(c) return c; }
    }catch(e){}
    try{
      var C=window.AudioContext||window.webkitAudioContext;
      if(!C) return null;
      if(!getAudioContext.ctx) getAudioContext.ctx=new C();
      if(getAudioContext.ctx.state==="suspended") getAudioContext.ctx.resume();
      return getAudioContext.ctx;
    }catch(e){ return null; }
  }

  function sting(key){
    var ctx=getAudioContext(); if(!ctx) return;
    var map={
      mountain:[196,246.94,293.66], dam:[220,277.18,329.63],
      millpond:[261.63,329.63,392], sluice:[293.66,369.99,440],
      waterwheel:[329.63,415.30,493.88], factory:[392,493.88,587.33]
    };
    var notes=map[key]||map.mountain;
    try{
      notes.forEach(function(f,i){
        var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+0.02+i*0.075;
        o.type=i===1?"triangle":"sine";
        o.frequency.setValueAtTime(f,t);
        o.frequency.exponentialRampToValueAtTime(f*1.018,t+0.26);
        g.gain.setValueAtTime(0.0001,t);
        g.gain.exponentialRampToValueAtTime(i===2?0.035:0.027,t+0.018);
        g.gain.exponentialRampToValueAtTime(0.0001,t+0.34);
        o.connect(g);g.connect(window.GEI_AUDIO?window.GEI_AUDIO.sfxIn(ctx):ctx.destination);o.start(t);o.stop(t+0.36);
      });
    }catch(e){}
  }

  function loadAudio(file){
    if(!file || failureCache[file]) return audioCache[file]||null;
    if(audioCache[file]) return audioCache[file];
    try{
      var a=new Audio();
      a.preload="auto";
      a.crossOrigin="anonymous";
      a.src=file;
      audioCache[file]=a;
      return a;
    }catch(e){ last.errors++; return null; }
  }

  function playFile(file,gain,cb){
    if(!file){ cb&&cb(false); return; }
    var a=loadAudio(file);
    if(!a){ cb&&cb(false); return; }
    try{
      a.pause(); a.currentTime=0; a.volume=Math.max(0,Math.min(1,0.95*gain));
      var done=false;
      function finish(ok){
        if(done)return; done=true;
        a.onended=null;a.onerror=null;
        if(!ok) failureCache[file]=true;
        cb&&cb(ok);
      }
      a.onended=function(){finish(true);};
      a.onerror=function(){finish(false);};
      var p=a.play();
      if(p&&typeof p.catch==="function") p.catch(function(){finish(false);});
    }catch(e){ finish&&finish(false); }
  }

  function speakFallback(text){
    if(!window.speechSynthesis)return false;
    try{
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.rate=0.94;u.pitch=1.12;u.volume=0.9;
      var voices=window.speechSynthesis.getVoices?window.speechSynthesis.getVoices():[];
      var en=voices.filter(function(v){return /^en(-|_|$)/i.test(v.lang||"");});
      if(en[0])u.voice=en[0];
      u.onend=function(){active=null;};
      u.onerror=function(){last.errors++;active=null;};
      window.speechSynthesis.speak(u);
      last.fallback++;
      return true;
    }catch(e){last.errors++;return false;}
  }

  function visualAccent(key,variant){
    var root=document.getElementById("levelCard"); if(!root)return;
    root.setAttribute("data-v2193-voice",key);
    root.setAttribute("data-v2193-voice-variant",variant);
    root.classList.remove("v2193VoiceHit","v2193VoiceFactory");
    void root.offsetWidth;
    root.classList.add(key==="factory"?"v2193VoiceFactory":"v2193VoiceHit");
    setTimeout(function(){
      root.classList.remove("v2193VoiceHit","v2193VoiceFactory");
    },key==="factory"?1100:850);
  }

  function announce(key,opts){
    opts=opts||{};
    if(STEPS.indexOf(key)<0)return false;
    if(getMode()==="off"&&!opts.force)return false;
    /* V2.2.03: once the V2.1.94 Voice Director is installed it is the single core
       milestone player. Standing down here stops the same milestone (same 14 assets)
       from playing twice at once. Pass {direct:true} to use this engine on its own. */
    var director=window.GEI_VOICE_DIRECTOR;
    if(!opts.direct&&director&&director!==api&&typeof director.announce==="function")return false;
    var current=now();
    if(!opts.force&&last.key===key&&current-last.at<1400)return false;

    try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
    active=key;last.key=key;last.at=current;last.count++;

    var pick=chooseFile(key);
    last.mode=pick.mode;
    visualAccent(key,pick.variant);
    sting(key);

    if(pick.file){
      playFile(pick.file,pick.gain,function(ok){
        if(ok){last.playedFiles++;active=null;return;}
        speakFallback(LABELS[key]);
      });
    }else{
      setTimeout(function(){speakFallback(LABELS[key]);},300);
    }

    try{
      if(window.DAMSoundtrack&&typeof window.DAMSoundtrack.duck==="function"){
        window.DAMSoundtrack.duck("mission");
      }
    }catch(e){}
    return true;
  }

  function inferFromLevel(level){
    level=Number(level);
    if(!isFinite(level)||level<1||level%6!==0)return null;
    return STEPS[(level/6-1)%6];
  }

  function bindLevelCard(){
    var card=document.getElementById("levelCard");
    if(!card||card.dataset.v2193Bound)return;
    card.dataset.v2193Bound="1";
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
    if(was){
      var el=document.getElementById("lcLevel"),text=el?el.textContent:"";
      var m=text.match(/LEVEL\s+(\d+)\s+COMPLETE/i),key=m?inferFromLevel(m[1]):null;
      if(key)announce(key);
    }
  }

  function bindExistingMilestoneHooks(){
    if(typeof window.playLevelFanfare==="function"&&!window.playLevelFanfare.__v2193Wrapped){
      var original=window.playLevelFanfare;
      var wrapped=function(){
        var out=original.apply(this,arguments);
        try{
          var level=window.state&&Number(window.state.level),key=inferFromLevel(level);
          if(key)announce(key);
        }catch(e){}
        return out;
      };
      wrapped.__v2193Wrapped=true;wrapped.__v2193Original=original;
      window.playLevelFanfare=wrapped;
    }
  }

  function css(){
    if(document.getElementById("v2193VoiceStyle"))return;
    var s=document.createElement("style");s.id="v2193VoiceStyle";
    s.textContent=
      "#levelCard.v2193VoiceHit .milestoneCelebration{animation:v2193MilestonePulse .72s cubic-bezier(.2,.9,.2,1) 1}" +
      "#levelCard.v2193VoiceFactory .milestoneCelebration{animation:v2193FactoryPulse 1.05s cubic-bezier(.18,.9,.18,1) 1}" +
      "#levelCard.v2193VoiceHit .lcStage{filter:drop-shadow(0 0 24px var(--water-bright,#2fd2ff));}" +
      "#levelCard.v2193VoiceFactory .lcStage{filter:drop-shadow(0 0 32px var(--water-bright,#2fd2ff)) saturate(1.12);}" +
      "@keyframes v2193MilestonePulse{0%{transform:scale(.98)}38%{transform:scale(1.035)}68%{transform:scale(.995)}100%{transform:scale(1)}}" +
      "@keyframes v2193FactoryPulse{0%{transform:scale(.97);filter:brightness(1)}32%{transform:scale(1.055);filter:brightness(1.22)}62%{transform:scale(1.01);filter:brightness(1.08)}100%{transform:scale(1);filter:brightness(1)}}" +
      "@media(prefers-reduced-motion:reduce){#levelCard.v2193VoiceHit .milestoneCelebration,#levelCard.v2193VoiceFactory .milestoneCelebration{animation:none}}";
    document.head.appendChild(s);
  }

  function selfTest(){
    return {
      version:VERSION,
      modes:modes.slice(),
      mode:getMode(),
      sixMilestones:STEPS.length===6,
      labels:STEPS.map(function(k){return LABELS[k];}),
      femaleAssets:STEPS.every(function(k){return !!PACKS.female[k];}),
      maleAssets:STEPS.every(function(k){return !!PACKS.male[k];}),
      femaleFactoryExcited:!!PACKS.female.factoryExcited,
      maleFactoryExcited:!!PACKS.male.factoryExcited,
      announcements:last.count,
      playedFiles:last.playedFiles,
      fallbackCount:last.fallback,
      errors:last.errors,
      active:active,
      presentationOnly:true,
      gameplayStateChanged:false
    };
  }

  function install(){
    css();bindLevelCard();bindExistingMilestoneHooks();
    window.addEventListener("load",function(){bindLevelCard();bindExistingMilestoneHooks();});
  }

  var api={
    version:VERSION,steps:STEPS.slice(),labels:JSON.parse(JSON.stringify(LABELS)),
    packs:JSON.parse(JSON.stringify(PACKS)),
    modes:modes.slice(),getMode:getMode,setMode:setMode,announce:announce,selfTest:selfTest,
    get active(){return active;},get last(){return JSON.parse(JSON.stringify(last));},
    presentationOnly:true
  };

  window.__GEI_V2193_MILESTONE_VOICE__=api;
  window.GEI_MILESTONE_VOICE=api;
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();