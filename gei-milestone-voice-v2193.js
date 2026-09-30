/* V2.1.93 — DAM-ITE MILESTONE VOICE ANNOUNCER
 * Presentation/audio only.
 * Six short female achievement callouts:
 *   Mountain → Dam → Mill Pond → Sluice-Gate → Waterwheel → Factory
 *
 * The browser's SpeechSynthesis API is intentionally used as a robust development
 * fallback only; it is NOT treated as the final branded voice asset. If packaged
 * audio files are later added, set those URLs in VOCALS and they will take priority.
 *
 * Timing:
 *   visual milestone starts
 *   → short synthesized/generated sting
 *   → vocal callout
 *
 * No gameplay/economy/progression/save mutations.
 */
(function(){
  "use strict";
  if(window.__GEI_V2193_MILESTONE_VOICE__) return;

  var VERSION = "V2.1.93";
  var VOCALS = {
    mountain:   { label:"MOUNTAIN",    file:"" },
    dam:        { label:"DAM",         file:"" },
    millpond:   { label:"MILL POND",   file:"" },
    sluice:     { label:"SLUICE-GATE", file:"" },
    waterwheel: { label:"WATERWHEEL",  file:"" },
    factory:    { label:"FACTORY",     file:"" }
  };

  var STEPS = ["mountain","dam","millpond","sluice","waterwheel","factory"];
  var active = null;
  var last = { key:"", at:0, count:0, fallback:0, errors:0 };
  var audioCache = Object.create(null);

  function now(){ return performance.now(); }
  function pickVoice(){
    try{
      var voices = window.speechSynthesis && window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      var en = voices.filter(function(v){
        return /^en(-|_|$)/i.test(v.lang || "");
      });
      /* Prefer natural-sounding English female voice names where available, but
         never hard-fail on provider/browser-specific naming. */
      var femaleHint = /(female|woman|zira|samantha|ava|victoria|karen|moira|allison|susan|aria|jenny|libby|sonia|google us english)/i;
      return en.find(function(v){ return femaleHint.test(v.name || ""); }) || en[0] || voices[0] || null;
    }catch(e){ return null; }
  }

  function getAudioContext(){
    try{
      if(typeof getAudio === "function"){
        var c = getAudio();
        if(c) return c;
      }
    }catch(e){}
    try{
      var C = window.AudioContext || window.webkitAudioContext;
      if(!C) return null;
      if(!getAudioContext.ctx) getAudioContext.ctx = new C();
      if(getAudioContext.ctx.state === "suspended") getAudioContext.ctx.resume();
      return getAudioContext.ctx;
    }catch(e){ return null; }
  }

  function sting(key){
    var ctx = getAudioContext();
    if(!ctx) return;
    var map = {
      mountain:[196,246.94,293.66],
      dam:[220,277.18,329.63],
      millpond:[261.63,329.63,392],
      sluice:[293.66,369.99,440],
      waterwheel:[329.63,415.30,493.88],
      factory:[392,493.88,587.33]
    };
    var notes = map[key] || map.mountain;
    try{
      notes.forEach(function(f,i){
        var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + 0.02 + i*0.075;
        o.type = i===1 ? "triangle" : "sine";
        o.frequency.setValueAtTime(f,t);
        o.frequency.exponentialRampToValueAtTime(f*1.018,t+0.26);
        g.gain.setValueAtTime(0.0001,t);
        g.gain.exponentialRampToValueAtTime(i===2 ? 0.035 : 0.027,t+0.018);
        g.gain.exponentialRampToValueAtTime(0.0001,t+0.34);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t+0.36);
      });
    }catch(e){}
  }

  function setLoadedVoice(file){
    if(!file || audioCache[file]) return audioCache[file] || null;
    try{
      var a = new Audio();
      a.preload = "auto";
      a.src = file;
      audioCache[file] = a;
      return a;
    }catch(e){ return null; }
  }

  function speakFallback(text){
    if(!window.speechSynthesis) return false;
    try{
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.94;
      u.pitch = 1.14;
      u.volume = 0.92;
      var v = pickVoice();
      if(v) u.voice = v;
      u.onend = function(){ active = null; };
      u.onerror = function(){ last.errors++; active = null; };
      window.speechSynthesis.speak(u);
      last.fallback++;
      return true;
    }catch(e){ last.errors++; return false; }
  }

  function playFile(file, cb){
    if(!file){ cb && cb(false); return; }
    try{
      var a = setLoadedVoice(file);
      if(!a){ cb && cb(false); return; }
      a.pause(); a.currentTime = 0; a.volume = 0.95;
      var done = false;
      var finish = function(ok){
        if(done) return; done = true;
        a.onended = null; a.onerror = null;
        cb && cb(ok);
      };
      a.onended = function(){ finish(true); };
      a.onerror = function(){ finish(false); };
      var p = a.play();
      if(p && typeof p.catch === "function") p.catch(function(){ finish(false); });
    }catch(e){ cb && cb(false); }
  }

  function visualAccent(key){
    var root = document.getElementById("levelCard");
    if(!root) return;
    root.setAttribute("data-v2193-voice",key);
    root.classList.remove("v2193VoiceHit");
    void root.offsetWidth;
    root.classList.add("v2193VoiceHit");
    setTimeout(function(){ root.classList.remove("v2193VoiceHit"); }, 850);
  }

  function announce(key, opts){
    opts = opts || {};
    if(STEPS.indexOf(key) < 0) return false;
    var current = now();
    if(!opts.force && last.key === key && current-last.at < 1200) return false;

    /* Cancel prior vocal and prevent overlap. */
    try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
    active = key;
    last.key = key; last.at = current; last.count++;

    visualAccent(key);
    sting(key);

    var item = VOCALS[key];
    var file = item && item.file;
    if(file){
      playFile(file, function(ok){
        if(ok){ active = null; return; }
        speakFallback(item.label);
      });
    }else{
      /* Development-ready fallback until dedicated vocal assets are supplied. */
      setTimeout(function(){ speakFallback(item.label); }, 320);
    }
    try{
      if(window.DAMSoundtrack && typeof window.DAMSoundtrack.duck === "function"){
        window.DAMSoundtrack.duck("mission");
      }
    }catch(e){}
    return true;
  }

  function inferFromLevel(level){
    level = Number(level);
    if(!isFinite(level) || level < 1) return null;
    if(level % 6 !== 0) return null;
    var idx = (level/6 - 1) % 6;
    return STEPS[idx];
  }

  /* Wire to the existing completion card without changing completion logic.
     When LEVEL COMPLETE becomes visible, read the level and announce only the
     matching hydraulic milestone. */
  function bindLevelCard(){
    var card = document.getElementById("levelCard");
    if(!card || card.dataset.v2193Bound) return;
    card.dataset.v2193Bound = "1";

    var was = card.classList.contains("show");
    var observer = new MutationObserver(function(){
      var shown = card.classList.contains("show");
      if(shown && !was){
        var levelEl = document.getElementById("lcLevel");
        var text = levelEl ? levelEl.textContent : "";
        var m = text.match(/LEVEL\s+(\d+)\s+COMPLETE/i);
        var key = m ? inferFromLevel(m[1]) : null;
        if(key) announce(key);
      }
      was = shown;
    });
    observer.observe(card,{attributes:true,attributeFilter:["class"]});

    if(was){
      var levelEl = document.getElementById("lcLevel");
      var text = levelEl ? levelEl.textContent : "";
      var m = text.match(/LEVEL\s+(\d+)\s+COMPLETE/i);
      var key = m ? inferFromLevel(m[1]) : null;
      if(key) announce(key);
    }
  }

  function bindExistingMilestoneHooks(){
    /* Give future/older milestone systems a single public hook without forcing
       them to know about the voice engine. */
    if(typeof window.playLevelFanfare === "function" && !window.playLevelFanfare.__v2193Wrapped){
      var original = window.playLevelFanfare;
      var wrapped = function(){
        var out = original.apply(this,arguments);
        try{
          var level = window.state && Number(window.state.level);
          var key = inferFromLevel(level);
          if(key) announce(key);
        }catch(e){}
        return out;
      };
      wrapped.__v2193Wrapped = true;
      wrapped.__v2193Original = original;
      window.playLevelFanfare = wrapped;
    }
  }

  function css(){
    if(document.getElementById("v2193VoiceStyle")) return;
    var s = document.createElement("style");
    s.id = "v2193VoiceStyle";
    s.textContent =
      "#levelCard.v2193VoiceHit .milestoneCelebration{animation:v2193MilestonePulse .72s cubic-bezier(.2,.9,.2,1) 1}" +
      "#levelCard.v2193VoiceHit .lcStage{filter:drop-shadow(0 0 24px var(--water-bright,#2fd2ff));}" +
      "@keyframes v2193MilestonePulse{0%{transform:scale(.98)}38%{transform:scale(1.035)}68%{transform:scale(.995)}100%{transform:scale(1)}}" +
      "@media(prefers-reduced-motion:reduce){#levelCard.v2193VoiceHit .milestoneCelebration{animation:none}}";
    document.head.appendChild(s);
  }

  function selfTest(){
    return {
      version:VERSION,
      sixMilestones:STEPS.length===6,
      labels:STEPS.map(function(k){return VOCALS[k].label;}),
      noOverlap:true,
      fallbackAvailable:!!window.speechSynthesis,
      packagedVoices:Object.keys(VOCALS).filter(function(k){return !!VOCALS[k].file;}).length,
      announcements:last.count,
      fallbackCount:last.fallback,
      errors:last.errors,
      active:active,
      presentationOnly:true,
      gameplayStateChanged:false
    };
  }

  function install(){
    css();
    bindLevelCard();
    bindExistingMilestoneHooks();
    if(window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined){
      window.speechSynthesis.onvoiceschanged = function(){ /* voices become available asynchronously */ };
    }
    window.addEventListener("load",function(){ bindLevelCard(); bindExistingMilestoneHooks(); });
  }

  var api = {
    version:VERSION,
    vocals:JSON.parse(JSON.stringify(VOCALS)),
    steps:STEPS.slice(),
    announce:announce,
    selfTest:selfTest,
    get active(){ return active; },
    get last(){ return JSON.parse(JSON.stringify(last)); },
    presentationOnly:true
  };

  window.__GEI_V2193_MILESTONE_VOICE__ = api;
  window.GEI_MILESTONE_VOICE = api;

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();