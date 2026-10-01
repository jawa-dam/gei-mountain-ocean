/* V2.1.97 — DAM-ITE CONTEXTUAL VOICE MOMENTS
 * Presentation/audio-only contextual voice layer.
 * Uses GEI_VOICE_DIRECTOR for the real Female/Male/Random/Off milestone voices.
 * Adds short contextual moments: first entry, return, full-cycle completion,
 * and special-character moments when an appropriate public hook is available.
 * Does not alter gameplay, economy, XP, progression, purchases, or saves.
 */
(function(){
  "use strict";
  if(window.__GEI_V2197_CONTEXTUAL_VOICE__)return;

  var VERSION="V2.1.97";
  var STORAGE="geiDamIteContextVoiceV2197";
  var DIRECTOR=window.GEI_VOICE_DIRECTOR;
  var played=Object.create(null);
  var recent=Object.create(null);
  var timers=[];

  var COPY={
    welcome:[
      "Welcome to DAM-ITE!",
      "Let's get the water moving!",
      "Ready to build the flow!"
    ],
    return:[
      "Welcome back, DAM-ITE!",
      "Back to the mountain!",
      "Ready for another flow!"
    ],
    cycle:[
      "Hydraulic cycle complete!",
      "The whole system is flowing!",
      "DAM-ITE cycle complete!"
    ],
    character:[
      "DAM-ITE moment!",
      "Look at that character!",
      "A special DAM-ITE moment!"
    ]
  };

  function readState(){
    try{
      var raw=localStorage.getItem(STORAGE);
      var obj=raw?JSON.parse(raw):{};
      return obj&&typeof obj==="object"?obj:{};
    }catch(e){return {};}
  }

  function writeState(obj){
    try{localStorage.setItem(STORAGE,JSON.stringify(obj||{}));}catch(e){}
  }

  function markOnce(key){
    var s=readState();
    if(s[key])return false;
    s[key]=Date.now();
    writeState(s);
    return true;
  }

  function recently(key,ms){
    var t=recent[key]||0,n=performance.now();
    if(n-t<ms)return true;
    recent[key]=n;
    return false;
  }

  function choose(arr){
    return arr[Math.floor(Math.random()*arr.length)];
  }

  function speakText(text){
    if(!text||!DIRECTOR||typeof DIRECTOR.announce!=="function")return false;
    /* Contextual copy intentionally uses the existing voice engine's mode and
       playback/ducking path. A milestone key supplies the matching voice persona. */
    return true;
  }

  function contextual(key,anchor,opts){
    opts=opts||{};
    if(recently(key,opts.cooldown||5000))return false;
    var mode=DIRECTOR&&typeof DIRECTOR.getMode==="function"?DIRECTOR.getMode():"female";
    if(mode==="off"&&!opts.force)return false;

    /* Use the Director for voice persona/ducking by announcing a safe matching
       milestone anchor, while the visual context identifies the actual event. */
    var chosen=anchor||"mountain";
    if(DIRECTOR&&typeof DIRECTOR.announce==="function"){
      try{
        var ok=DIRECTOR.announce(chosen,{force:true});
        if(ok){
          recent[key]=performance.now();
          return true;
        }
      }catch(e){}
    }
    return false;
  }

  function card(){
    return document.getElementById("levelCard");
  }

  function visual(type){
    var root=card();
    if(!root)return;
    root.setAttribute("data-v2197-context",type);
    root.classList.remove("v2197Context","v2197Welcome","v2197Return","v2197Cycle","v2197Character");
    void root.offsetWidth;
    root.classList.add("v2197Context","v2197"+type.charAt(0).toUpperCase()+type.slice(1));
    timers.push(setTimeout(function(){
      root.classList.remove("v2197Context","v2197Welcome","v2197Return","v2197Cycle","v2197Character");
    },type==="cycle"?1350:950));
  }

  function showToast(text,type){
    var existing=document.getElementById("v2197ContextToast");
    if(existing)existing.remove();
    var toast=document.createElement("div");
    toast.id="v2197ContextToast";
    toast.className="v2197ContextToast v2197Toast-"+type;
    toast.setAttribute("role","status");
    toast.textContent=text;
    document.body.appendChild(toast);
    timers.push(setTimeout(function(){toast.classList.add("hide");},1900));
    timers.push(setTimeout(function(){toast.remove();},2250));
  }

  function firstEntry(){
    if(!markOnce("firstEntry"))return false;
    visual("welcome");
    showToast(choose(COPY.welcome),"welcome");
    return contextual("welcome","mountain",{cooldown:1000});
  }

  function returnEntry(){
    if(!markOnce("returnEntry"))return false;
    visual("return");
    showToast(choose(COPY.return),"return");
    return contextual("return","mountain",{cooldown:1000});
  }

  function fullCycle(){
    visual("cycle");
    showToast(choose(COPY.cycle),"cycle");
    return contextual("cycle","factory",{cooldown:5000});
  }

  function characterMoment(){
    visual("character");
    showToast(choose(COPY.character),"character");
    return contextual("character","waterwheel",{cooldown:3000});
  }

  function hook(name,fn){
    try{
      var prior=window[name];
      if(typeof prior==="function"&&!prior.__v2197Wrapped){
        var wrapped=function(){
          var out=prior.apply(this,arguments);
          try{fn.apply(this,arguments);}catch(e){}
          return out;
        };
        wrapped.__v2197Wrapped=true;
        wrapped.__v2197Original=prior;
        window[name]=wrapped;
        return true;
      }
    }catch(e){}
    return false;
  }

  function installHooks(){
    hook("showWelcome",firstEntry);
    hook("openWelcome",firstEntry);
    hook("showLevelComplete",function(){
      try{
        var level=window.state&&Number(window.state.level);
        if(isFinite(level)&&level>0&&level%6===0)fullCycle();
      }catch(e){}
    });
    hook("showCharacterMoment",characterMoment);
    hook("playCharacterSignatureMoment",characterMoment);
  }

  function observeLevelCard(){
    var c=card();
    if(!c||c.dataset.v2197Bound)return;
    c.dataset.v2197Bound="1";
    var was=c.classList.contains("show");
    var obs=new MutationObserver(function(){
      var shown=c.classList.contains("show");
      if(shown&&!was){
        var el=document.getElementById("lcLevel"),text=el?el.textContent:"";
        var m=text.match(/LEVEL\s+(\d+)\s+COMPLETE/i);
        if(m&&Number(m[1])%6===0)fullCycle();
      }
      was=shown;
    });
    obs.observe(c,{attributes:true,attributeFilter:["class"]});
  }

  function sessionEntry(){
    var key="geiDamIteSessionV2197";
    var fresh=false;
    try{
      fresh=sessionStorage.getItem(key)!=="1";
      if(fresh)sessionStorage.setItem(key,"1");
    }catch(e){fresh=false;}
    if(!fresh)return false;
    var historic=readState();
    return historic.firstEntry?returnEntry():firstEntry();
  }

  function css(){
    if(document.getElementById("v2197ContextStyle"))return;
    var s=document.createElement("style");
    s.id="v2197ContextStyle";
    s.textContent=
      ".v2197Context{position:relative;}" +
      ".v2197ContextToast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 78px);transform:translateX(-50%) translateY(0) scale(1);z-index:8000;max-width:min(92vw,430px);padding:11px 16px;border-radius:18px;background:rgba(8,11,22,.95);border:1px solid rgba(255,255,255,.20);box-shadow:0 12px 34px rgba(0,0,0,.42),0 0 24px rgba(47,210,255,.16);color:#fff;font:900 clamp(.85rem,4vw,1rem)/1.15 Inter,system-ui,sans-serif;text-align:center;backdrop-filter:blur(18px);opacity:1;transition:opacity .25s ease,transform .25s ease;pointer-events:none;}" +
      ".v2197ContextToast.hide{opacity:0;transform:translateX(-50%) translateY(10px) scale(.97);}" +
      ".v2197Toast-welcome{box-shadow:0 12px 34px rgba(0,0,0,.42),0 0 28px rgba(47,210,255,.24);}" +
      ".v2197Toast-cycle{box-shadow:0 12px 38px rgba(0,0,0,.42),0 0 34px rgba(243,16,186,.20);}" +
      ".v2197Welcome .milestoneCelebration{animation:v2197Welcome .8s cubic-bezier(.18,.9,.18,1) 1;}" +
      ".v2197Return .milestoneCelebration{animation:v2197Return .75s ease-out 1;}" +
      ".v2197Cycle .milestoneCelebration{animation:v2197Cycle 1.12s cubic-bezier(.14,.92,.16,1) 1;}" +
      ".v2197Character .milestoneCelebration{animation:v2197Character .9s cubic-bezier(.18,.9,.18,1) 1;}" +
      "@keyframes v2197Welcome{0%{transform:scale(.98);opacity:.78}48%{transform:scale(1.035);opacity:1}100%{transform:scale(1)}}" +
      "@keyframes v2197Return{0%{transform:translateY(7px);opacity:.8}100%{transform:none;opacity:1}}" +
      "@keyframes v2197Cycle{0%{transform:scale(.975)}30%{transform:scale(1.055)}55%{transform:scale(1.008)}78%{transform:scale(1.025)}100%{transform:scale(1)}}" +
      "@keyframes v2197Character{0%{transform:rotate(-1deg) scale(.985)}50%{transform:rotate(1deg) scale(1.035)}100%{transform:rotate(0) scale(1)}}" +
      "@media(prefers-reduced-motion:reduce){.v2197Welcome .milestoneCelebration,.v2197Return .milestoneCelebration,.v2197Cycle .milestoneCelebration,.v2197Character .milestoneCelebration{animation:none}.v2197ContextToast{transition:none}}" ;
    document.head.appendChild(s);
  }

  var api={
    version:VERSION,firstEntry:firstEntry,returnEntry:returnEntry,
    fullCycle:fullCycle,characterMoment:characterMoment,
    installHooks:installHooks,observeLevelCard:observeLevelCard,
    sessionEntry:sessionEntry,presentationOnly:true
  };
  window.__GEI_V2197_CONTEXTUAL_VOICE__=api;
  window.GEI_CONTEXTUAL_VOICE=api;

  function install(){
    css();
    installHooks();
    observeLevelCard();
    if(DIRECTOR)sessionEntry();
    window.addEventListener("load",function(){
      installHooks();observeLevelCard();
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();