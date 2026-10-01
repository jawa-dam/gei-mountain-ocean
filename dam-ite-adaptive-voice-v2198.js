/* V2.1.98 — DAM-ITE ADAPTIVE VOICE FREQUENCY
 * Presentation/audio-only pacing layer over GEI_CONTEXTUAL_VOICE + GEI_VOICE_DIRECTOR.
 * Goal: richer personality for new players, calmer behavior for returning players.
 * No gameplay/economy/progression/XP/purchase/save mutations.
 */
(function(){
  "use strict";
  if(window.__GEI_V2198_ADAPTIVE_VOICE__)return;

  var VERSION="V2.1.98";
  var SETTINGS_KEY="geiDamIteAdaptiveVoiceV2198";
  var SESSION_KEY="geiDamIteAdaptiveVoiceSessionV2198";
  var DEFAULT_PROFILE="adaptive";
  var PROFILES=[
    {id:"adaptive",label:"ADAPTIVE",sub:"Learns your pace"},
    {id:"social",label:"SOCIAL",sub:"More voice moments"},
    {id:"calm",label:"CALM",sub:"Fewer interruptions"},
    {id:"off",label:"OFF",sub:"No contextual voice"}
  ];

  var PROFILE_CAPS={
    adaptive:{welcomeCooldown:0,returnCooldown:21600000,contextCooldown:10000,cycleCooldown:120000,characterCooldown:45000},
    social:{welcomeCooldown:0,returnCooldown:3600000,contextCooldown:6000,cycleCooldown:60000,characterCooldown:20000},
    calm:{welcomeCooldown:0,returnCooldown:86400000,contextCooldown:30000,cycleCooldown:300000,characterCooldown:120000}
  };

  var telemetry={sessions:0,contextAttempts:0,contextPlayed:0,suppressed:0,lastEvent:"",profile:DEFAULT_PROFILE};

  function director(){return window.GEI_VOICE_DIRECTOR||null;}
  function contextual(){return window.GEI_CONTEXTUAL_VOICE||null;}

  function readSettings(){
    try{
      var raw=localStorage.getItem(SETTINGS_KEY);
      var obj=raw?JSON.parse(raw):{};
      if(!obj||typeof obj!=="object")obj={};
      if(!obj.profile)obj.profile=DEFAULT_PROFILE;
      if(!PROFILE_CAPS[obj.profile]&&obj.profile!=="off")obj.profile=DEFAULT_PROFILE;
      return obj;
    }catch(e){return {profile:DEFAULT_PROFILE};}
  }
  function writeSettings(obj){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(obj));}catch(e){}}
  function profile(){return readSettings().profile||DEFAULT_PROFILE;}

  function setProfile(id){
    id=String(id||"").toLowerCase();
    if(!PROFILE_CAPS[id]&&id!=="off")id=DEFAULT_PROFILE;
    var s=readSettings();s.profile=id;writeSettings(s);
    telemetry.profile=id;
    return id;
  }

  function now(){return Date.now();}

  function readSession(){
    try{
      var raw=sessionStorage.getItem(SESSION_KEY);
      return raw?JSON.parse(raw):{};
    }catch(e){return {};}
  }
  function writeSession(o){try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(o||{}));}catch(e){}}

  function seenRecently(event,ms){
    var s=readSession();
    var last=Number(s[event]||0);
    return last>0 && now()-last<ms;
  }
  function mark(event){
    var s=readSession();s[event]=now();writeSession(s);
  }

  function userMaturity(){
    var s=readSession();
    var starts=Number(s.sessions||0);
    var hasHistory=false;
    try{hasHistory=!!localStorage.getItem("geiDamIteContextVoiceV2197");}catch(e){}
    return starts>=3||hasHistory?"returning":"new";
  }

  function permitted(event,force){
    if(force)return true;
    var p=profile();
    if(p==="off")return false;
    var cap=PROFILE_CAPS[p]||PROFILE_CAPS.adaptive;
    if(seenRecently(event,cap[event+"Cooldown"]||cap.contextCooldown))return false;

    /* Adaptive behavior: new players get more social moments; returning players
       receive stronger cooldowns except important cycle completions. */
    var maturity=userMaturity();
    if(p==="adaptive"){
      if(event==="context"&&maturity==="returning")return Math.random()<0.52;
      if(event==="character"&&maturity==="returning")return Math.random()<0.68;
      if(event==="cycle")return true;
    }
    return true;
  }

  function invoke(type,method,anchor,opts){
    opts=opts||{};
    telemetry.contextAttempts++;
    if(!permitted(type,opts.force)){telemetry.suppressed++;return false;}
    var c=contextual();
    if(!c||typeof c[method]!=="function"){telemetry.suppressed++;return false;}
    try{
      var ok=c[method]({anchor:anchor,force:!!opts.force,cooldown:opts.cooldown||5000});
      if(ok){
        mark(type);
        telemetry.contextPlayed++;
        telemetry.lastEvent=type;
      }
      return !!ok;
    }catch(e){telemetry.suppressed++;return false;}
  }

  function firstEntry(){
    var p=profile();if(p==="off")return false;
    var c=contextual();if(!c)return false;
    if(seenRecently("entry",PROFILE_CAPS[p] ? PROFILE_CAPS[p].welcomeCooldown : 0))return false;
    try{
      var ok=userMaturity()==="new"&&typeof c.firstEntry==="function"?c.firstEntry():typeof c.returnEntry==="function"?c.returnEntry():false;
      if(ok){mark("entry");telemetry.contextPlayed++;telemetry.lastEvent="entry";}
      return !!ok;
    }catch(e){return false;}
  }

  function cycleComplete(){return invoke("cycle","fullCycle","factory",{cooldown:PROFILE_CAPS[profile()]?.cycleCooldown||120000});}
  function character(){return invoke("character","characterMoment","waterwheel",{cooldown:PROFILE_CAPS[profile()]?.characterCooldown||45000});}
  function ambient(){return invoke("context","characterMoment","millpond",{cooldown:PROFILE_CAPS[profile()]?.contextCooldown||10000});}

  function bindNamedHook(name,fn){
    try{
      var prior=window[name];
      if(typeof prior!=="function"||prior.__v2198Wrapped)return false;
      var wrapped=function(){
        var out=prior.apply(this,arguments);
        try{fn.apply(this,arguments);}catch(e){}
        return out;
      };
      wrapped.__v2198Wrapped=true;
      wrapped.__v2198Original=prior;
      window[name]=wrapped;
      return true;
    }catch(e){return false;}
  }

  function installHooks(){
    bindNamedHook("showWelcome",firstEntry);
    bindNamedHook("openWelcome",firstEntry);
    bindNamedHook("showLevelComplete",function(){
      try{
        var level=window.state&&Number(window.state.level);
        if(isFinite(level)&&level>0&&level%6===0)cycleComplete();
      }catch(e){}
    });
    bindNamedHook("showCharacterMoment",character);
    bindNamedHook("playCharacterSignatureMoment",character);
  }

  function observeCard(){
    var card=document.getElementById("levelCard");
    if(!card||card.dataset.v2198Bound)return;
    card.dataset.v2198Bound="1";
    var was=card.classList.contains("show");
    var observer=new MutationObserver(function(){
      var shown=card.classList.contains("show");
      if(shown&&!was){
        var el=document.getElementById("lcLevel"),text=el?el.textContent:"";
        var m=text.match(/LEVEL\s+(\d+)\s+COMPLETE/i);
        if(m&&Number(m[1])%6===0)cycleComplete();
      }
      was=shown;
    });
    observer.observe(card,{attributes:true,attributeFilter:["class"]});
  }

  function startSession(){
    var s=readSession();
    s.sessions=Number(s.sessions||0)+1;
    writeSession(s);
    telemetry.sessions=s.sessions;
  }

  function css(){
    if(document.getElementById("v2198AdaptiveVoiceStyle"))return;
    var s=document.createElement("style");
    s.id="v2198AdaptiveVoiceStyle";
    s.textContent=
      ".v2198VoiceHint{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 18px);transform:translateX(-50%) scale(1);z-index:8100;max-width:min(92vw,420px);padding:9px 13px;border-radius:15px;background:rgba(8,11,22,.90);border:1px solid rgba(255,255,255,.15);box-shadow:0 10px 28px rgba(0,0,0,.36);color:#fff;font:800 .78rem/1.15 Inter,system-ui,sans-serif;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s ease,transform .2s ease;}" +
      ".v2198VoiceHint.show{opacity:1;transform:translateX(-50%);}" +
      "@media(prefers-reduced-motion:reduce){.v2198VoiceHint{transition:none}}";
    document.head.appendChild(s);
  }

  function announceProfileChange(){
    var old=document.getElementById("v2198VoiceHint");
    if(old)old.remove();
    var el=document.createElement("div");
    el.id="v2198VoiceHint";
    el.className="v2198VoiceHint";
    var p=profile();
    el.textContent=p==="adaptive"?"Voice pacing: adaptive":p==="social"?"Voice pacing: social":p==="calm"?"Voice pacing: calm":"Contextual voice off";
    document.body.appendChild(el);
    requestAnimationFrame(function(){el.classList.add("show");});
    setTimeout(function(){el.classList.remove("show");},1500);
    setTimeout(function(){el.remove();},1800);
  }

  function install(){
    css();
    telemetry.profile=profile();
    startSession();
    installHooks();
    observeCard();
    window.addEventListener("load",function(){installHooks();observeCard();});
    /* Gentle first-entry orchestration after the main UI settles. */
    setTimeout(function(){firstEntry();},450);
  }

  var api={
    version:VERSION,profiles:PROFILES,profile:profile,setProfile:setProfile,
    firstEntry:firstEntry,cycleComplete:cycleComplete,character:character,ambient:ambient,
    refresh:function(){telemetry.profile=profile();return JSON.parse(JSON.stringify(telemetry));},
    announceProfileChange:announceProfileChange,
    presentationOnly:true
  };
  window.__GEI_V2198_ADAPTIVE_VOICE__=api;
  window.GEI_ADAPTIVE_VOICE=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();