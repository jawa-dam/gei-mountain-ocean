/* V2.1.96 — DAM-ITE VOICE REACTIONS & PERSONALITY
 * Presentation/audio-only personality layer.
 * Adds context-aware visual reactions around the existing Voice Director and UI.
 * Does not alter gameplay, economy, progression, XP, purchases, or saves.
 */
(function(){
  "use strict";
  if(window.__GEI_V2196_VOICE_REACTIONS__)return;

  var VERSION="V2.1.96";
  var DIRECTOR=window.GEI_VOICE_DIRECTOR;
  var UI=window.GEI_VOICE_UI;
  var lastContext="";
  var timers=[];

  var PROFILE={
    mountain:{emoji:"⛰️",className:"v2196Mountain",burst:["💧","✨","⛰️"]},
    dam:{emoji:"🏗️",className:"v2196Dam",burst:["💧","🧱","⚡"]},
    millpond:{emoji:"🌊",className:"v2196Millpond",burst:["💧","🌊","✨"]},
    sluice:{emoji:"🚪",className:"v2196Sluice",burst:["💧","➡️","✨"]},
    waterwheel:{emoji:"⚙️",className:"v2196Waterwheel",burst:["💧","⚙️","🔄"]},
    factory:{emoji:"🏭",className:"v2196Factory",burst:["💧","🏭","🎉","✨"]}
  };

  function clearTimers(){
    timers.forEach(function(t){try{clearTimeout(t);}catch(e){}});
    timers=[];
  }

  function card(){
    return document.getElementById("levelCard");
  }

  function emitParticles(key,scale){
    var root=card();if(!root||!document.body)return;
    var cfg=PROFILE[key]||PROFILE.mountain;
    var host=root.querySelector(".milestoneCelebration")||root;
    var count=scale||1;
    for(var i=0;i<cfg.burst.length*count;i++){
      var el=document.createElement("span");
      el.className="v2196Particle";
      el.textContent=cfg.burst[i%cfg.burst.length];
      el.style.setProperty("--v2196-x",(Math.random()*180-90)+"px");
      el.style.setProperty("--v2196-y",(-35-Math.random()*85)+"px");
      el.style.setProperty("--v2196-r",(Math.random()*40-20)+"deg");
      host.appendChild(el);
      (function(node){timers.push(setTimeout(function(){node.remove();},900));})(el);
    }
  }

  function setReaction(key,mode,variant){
    var root=card();if(!root)return;
    var cfg=PROFILE[key]||PROFILE.mountain;
    lastContext=key+":"+mode+":"+variant;
    root.setAttribute("data-v2196-personality",key);
    root.setAttribute("data-v2196-voice-mode",mode||"female");
    root.setAttribute("data-v2196-voice-variant",variant||key);
    root.classList.remove(
      "v2196Reaction","v2196Mountain","v2196Dam","v2196Millpond",
      "v2196Sluice","v2196Waterwheel","v2196Factory"
    );
    void root.offsetWidth;
    root.classList.add("v2196Reaction",cfg.className);
    var emoji=root.querySelector(".v2196PersonalityBadge");
    if(!emoji){
      emoji=document.createElement("div");
      emoji.className="v2196PersonalityBadge";
      emoji.setAttribute("aria-hidden","true");
      (root.querySelector(".milestoneCelebration")||root).appendChild(emoji);
    }
    emoji.textContent=cfg.emoji;
    emoji.classList.remove("v2196BadgePop");
    void emoji.offsetWidth;
    emoji.classList.add("v2196BadgePop");
    emitParticles(key,key==="factory"?2:1);
    timers.push(setTimeout(function(){
      root.classList.remove("v2196Reaction",cfg.className);
    },key==="factory"?1450:1000));
  }

  function enhanceFactory(){
    var root=card();if(!root)return;
    root.classList.add("v2196FactoryFinale");
    var title=document.getElementById("lcLevel");
    if(title){
      title.setAttribute("data-v2196-final","1");
    }
    timers.push(setTimeout(function(){root.classList.remove("v2196FactoryFinale");},1500));
  }

  function reactFromState(){
    if(!DIRECTOR)return;
    try{
      var s=DIRECTOR.state||{};
      if(!s.active)return;
      setReaction(s.active,s.resolvedMode,s.variant);
      if(s.active==="factory")enhanceFactory();
    }catch(e){}
  }

  function wrapDirector(){
    if(!DIRECTOR||DIRECTOR.__v2196Wrapped)return;
    var original=DIRECTOR.announce;
    if(typeof original!=="function")return;
    DIRECTOR.announce=function(key,opts){
      var result=original.call(DIRECTOR,key,opts);
      if(result){
        var self=DIRECTOR;
        timers.push(setTimeout(function(){
          try{
            var s=self.state||{};
            setReaction(key,s.resolvedMode,s.variant);
            if(key==="factory")enhanceFactory();
          }catch(e){}
        },25));
      }
      return result;
    };
    DIRECTOR.__v2196Wrapped=true;
    DIRECTOR.__v2196Original=original;
  }

  function injectStyles(){
    if(document.getElementById("v2196VoiceReactionStyle"))return;
    var s=document.createElement("style");
    s.id="v2196VoiceReactionStyle";
    s.textContent=
      ".v2196Reaction .milestoneCelebration{position:relative;overflow:visible;}" +
      ".v2196PersonalityBadge{position:absolute;right:10px;top:8px;font-size:clamp(1.25rem,6vw,1.9rem);filter:drop-shadow(0 0 10px rgba(47,210,255,.45));pointer-events:none;}" +
      ".v2196BadgePop{animation:v2196BadgePop .6s cubic-bezier(.18,.9,.18,1) 1;}" +
      ".v2196Particle{position:absolute;left:50%;top:46%;font-size:clamp(.9rem,4.5vw,1.4rem);pointer-events:none;animation:v2196Particle .85s ease-out forwards;transform:translate(-50%,-50%) rotate(0);}" +
      ".v2196Reaction.v2196Mountain .v2196PersonalityBadge{animation:v2196Float .95s ease-out 1;}" +
      ".v2196Reaction.v2196Dam .v2196PersonalityBadge{animation:v2196Pressure .75s ease-out 1;}" +
      ".v2196Reaction.v2196Millpond .v2196PersonalityBadge{animation:v2196Ripple 1s ease-out 1;}" +
      ".v2196Reaction.v2196Sluice .v2196PersonalityBadge{animation:v2196Slide .75s ease-out 1;}" +
      ".v2196Reaction.v2196Waterwheel .v2196PersonalityBadge{animation:v2196Spin .9s ease-out 1;}" +
      ".v2196Reaction.v2196Factory .v2196PersonalityBadge{animation:v2196FactoryBadge 1.15s cubic-bezier(.15,.9,.15,1) 1;}" +
      ".v2196FactoryFinale .milestoneCelebration{animation:v2196Finale .95s cubic-bezier(.16,.9,.18,1) 1;}" +
      "@keyframes v2196BadgePop{0%{transform:scale(.45);opacity:0}45%{transform:scale(1.2);opacity:1}100%{transform:scale(1);opacity:1}}" +
      "@keyframes v2196Float{0%{transform:translateY(12px);opacity:0}100%{transform:none;opacity:1}}" +
      "@keyframes v2196Pressure{0%{transform:scale(.7)}45%{transform:scale(1.18)}100%{transform:scale(1)}}" +
      "@keyframes v2196Ripple{0%{transform:scale(.75)}55%{transform:scale(1.12)}100%{transform:scale(1)}}" +
      "@keyframes v2196Slide{0%{transform:translateX(-18px);opacity:0}100%{transform:none;opacity:1}}" +
      "@keyframes v2196Spin{0%{transform:rotate(-65deg) scale(.8)}100%{transform:rotate(0) scale(1)}}" +
      "@keyframes v2196FactoryBadge{0%{transform:scale(.5);opacity:0}30%{transform:scale(1.28);opacity:1}62%{transform:scale(.96)}100%{transform:scale(1)}}" +
      "@keyframes v2196Finale{0%{transform:scale(.985)}28%{transform:scale(1.045)}52%{transform:scale(1.01)}76%{transform:scale(1.028)}100%{transform:scale(1)}}" +
      "@keyframes v2196Particle{0%{opacity:0;transform:translate(-50%,-50%) scale(.5) rotate(0)}12%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--v2196-x)),calc(-50% + var(--v2196-y))) rotate(var(--v2196-r)) scale(1.1)}}" +
      "@media(prefers-reduced-motion:reduce){.v2196BadgePop,.v2196Particle,.v2196Reaction .v2196PersonalityBadge,.v2196FactoryFinale .milestoneCelebration{animation:none!important}}" ;
    document.head.appendChild(s);
  }

  function install(){
    injectStyles();
    if(DIRECTOR){wrapDirector();reactFromState();}
    if(UI&&typeof UI.refresh==="function")UI.refresh();
  }

  var api={
    version:VERSION,profiles:Object.keys(PROFILE),refresh:reactFromState,clear:clearTimers,
    presentationOnly:true,get lastContext(){return lastContext;}
  };
  window.__GEI_V2196_VOICE_REACTIONS__=api;
  window.GEI_VOICE_REACTIONS=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();