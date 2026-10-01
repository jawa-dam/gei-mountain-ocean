/* V2.2.01 — DAM-ITE VOICE DISCOVERY
 * Presentation/audio-only discovery layer built on Voice Showcase + Voice Memory.
 * Reveals previously unheard voice/moment variants with gentle "NEW VOICE" feedback.
 * Local-only discovery state. No gameplay, economy, XP, progression, purchase, or account data.
 */
(function(){
  "use strict";
  if(window.__GEI_V2201_VOICE_DISCOVERY__)return;

  var VERSION="V2.2.01";
  var KEY="geiDamIteVoiceDiscoveryV2201";
  var SHOWCASE=window.GEI_VOICE_SHOWCASE||null;
  var MEMORY=window.GEI_VOICE_MEMORY||null;
  var DIRECTOR=window.GEI_VOICE_DIRECTOR||null;
  var STEPS=["mountain","dam","millpond","sluice","waterwheel","factory"];
  var LABELS={mountain:"MOUNTAIN",dam:"DAM",millpond:"MILL POND",sluice:"SLUICE-GATE",waterwheel:"WATERWHEEL",factory:"FACTORY"};

  var state={seen:[],newlySeen:[],sessions:0,lastDiscovery:null};

  function load(){
    try{
      var raw=localStorage.getItem(KEY);
      var obj=raw?JSON.parse(raw):{};
      if(obj&&typeof obj==="object"){
        state.seen=Array.isArray(obj.seen)?obj.seen.slice():[];
        state.newlySeen=Array.isArray(obj.newlySeen)?obj.newlySeen.slice():[];
        state.sessions=Number(obj.sessions||0);
        state.lastDiscovery=obj.lastDiscovery||null;
      }
    }catch(e){}
    return state;
  }

  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}
  }

  function idFor(mode,key,variant){
    return String(mode||"female")+":"+String(key||"")+":"+String(variant||key);
  }

  function alreadySeen(id){return state.seen.indexOf(id)>=0;}

  function markDiscovery(mode,key,variant,source){
    var id=idFor(mode,key,variant);
    if(alreadySeen(id))return false;
    state.seen.push(id);
    state.newlySeen.unshift(id);
    state.newlySeen=state.newlySeen.slice(0,12);
    state.lastDiscovery={id:id,mode:mode,key:key,variant:variant,source:source||"showcase",at:Date.now()};
    save();
    return true;
  }

  function currentMode(){
    try{return DIRECTOR&&DIRECTOR.getMode?DIRECTOR.getMode():"female";}catch(e){return"female";}
  }

  function showToast(title,sub){
    var old=document.getElementById("v2201DiscoveryToast");
    if(old)old.remove();
    var el=document.createElement("div");
    el.id="v2201DiscoveryToast";
    el.innerHTML='<div class="v2201New">✨ NEW VOICE</div><div class="v2201Name"></div><div class="v2201Sub"></div>';
    el.querySelector(".v2201Name").textContent=title;
    el.querySelector(".v2201Sub").textContent=sub||"Discovered in the Voice Showcase";
    document.body.appendChild(el);
    requestAnimationFrame(function(){el.classList.add("show");});
    setTimeout(function(){el.classList.remove("show");},1900);
    setTimeout(function(){el.remove();},2250);
  }

  function visualReveal(key){
    var card=document.querySelector('[data-v2200-key="'+key+'"]');
    if(!card)return;
    card.classList.remove("v2201Reveal");
    void card.offsetWidth;
    card.classList.add("v2201Reveal");
    setTimeout(function(){card.classList.remove("v2201Reveal");},1100);
  }

  function discover(key,variant,mode,source){
    mode=mode||currentMode();
    variant=variant||key;
    var fresh=markDiscovery(mode,key,variant,source);
    if(!fresh)return false;
    visualReveal(key);
    showToast(LABELS[key]||String(key).toUpperCase(),mode.toUpperCase()+" voice discovered");
    return true;
  }

  function firstDiscovery(){
    var mode=currentMode();
    if(mode==="off")return false;
    return discover("mountain","mountain",mode,"first-entry");
  }

  function inspectDirector(){
    if(!DIRECTOR)return;
    try{
      var s=DIRECTOR.state||{};
      if(s.active){
        discover(s.active,s.variant,s.resolvedMode,"milestone");
      }
    }catch(e){}
  }

  function wrapShowcase(){
    if(!SHOWCASE||SHOWCASE.__v2201Wrapped)return;
    if(typeof SHOWCASE.preview==="function"){
      var original=SHOWCASE.preview;
      SHOWCASE.preview=function(key,mode,variant){
        var result=original.apply(SHOWCASE,arguments);
        if(result){
          setTimeout(function(){
            inspectDirector();
          },80);
        }
        return result;
      };
      SHOWCASE.__v2201Wrapped=true;
      SHOWCASE.__v2201Original=original;
    }
  }

  function bindShowcaseOpen(){
    var button=document.getElementById("v2200VoiceShowcaseButton");
    if(!button||button.dataset.v2201Bound)return;
    button.dataset.v2201Bound="1";
    button.addEventListener("click",function(){
      setTimeout(function(){
        injectDiscoveryBadges();
      },60);
    });
  }

  function injectDiscoveryBadges(){
    document.querySelectorAll("[data-v2200-key]").forEach(function(card){
      var key=card.getAttribute("data-v2200-key");
      var mode=currentMode();
      var id=idFor(mode,key,key);
      if(!alreadySeen(id)){
        card.classList.add("v2201Undiscovered");
      }else{
        card.classList.remove("v2201Undiscovered");
      }
    });
  }

  function renderDiscoverySummary(){
    var existing=document.getElementById("v2201DiscoverySummary");
    if(existing)existing.remove();
    var host=document.getElementById("v2200VoiceShowcase");
    if(!host||!host.classList.contains("show"))return;
    var panel=host.querySelector(".v2200Header");
    if(!panel)return;
    var el=document.createElement("div");
    el.id="v2201DiscoverySummary";
    el.className="v2201Summary";
    el.textContent="✨ "+state.seen.length+" voice moment"+(state.seen.length===1?"":"s")+" discovered";
    panel.parentNode.insertBefore(el,panel.nextSibling);
  }

  function session(){
    state.sessions++;
    save();
    if(state.sessions===1){
      setTimeout(firstDiscovery,850);
    }
  }

  function css(){
    if(document.getElementById("v2201DiscoveryStyle"))return;
    var s=document.createElement("style");
    s.id="v2201DiscoveryStyle";
    s.textContent=
      ".v2201Undiscovered{position:relative;box-shadow:0 0 0 1px rgba(47,210,255,.18),0 0 18px rgba(47,210,255,.08);}" +
      ".v2201Undiscovered::after{content:'NEW';position:absolute;top:7px;right:7px;padding:3px 6px;border-radius:999px;background:rgba(47,210,255,.16);border:1px solid rgba(47,210,255,.35);font:950 .56rem/1 Inter,system-ui,sans-serif;letter-spacing:.06em;color:#fff;}" +
      ".v2201Reveal{animation:v2201Reveal .95s cubic-bezier(.18,.9,.18,1) 1;}" +
      ".v2201Summary{max-width:520px;margin:0 auto 9px;padding:9px 12px;border-radius:14px;background:rgba(47,210,255,.07);border:1px solid rgba(47,210,255,.14);font:850 .74rem/1.1 Inter,system-ui,sans-serif;text-align:center;}" +
      "#v2201DiscoveryToast{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 82px);z-index:8400;min-width:min(260px,82vw);padding:13px 16px;border-radius:18px;background:rgba(8,11,22,.97);border:1px solid rgba(47,210,255,.30);box-shadow:0 18px 44px rgba(0,0,0,.42),0 0 30px rgba(47,210,255,.16);color:#fff;text-align:center;transform:translateX(-50%) translateY(-7px) scale(.97);opacity:0;transition:opacity .2s ease,transform .2s ease;font-family:Inter,system-ui,sans-serif;pointer-events:none;}" +
      "#v2201DiscoveryToast.show{opacity:1;transform:translateX(-50%) scale(1);}" +
      "#v2201DiscoveryToast .v2201New{font-size:.72rem;font-weight:950;letter-spacing:.08em;opacity:.82;margin-bottom:4px;}" +
      "#v2201DiscoveryToast .v2201Name{font-size:1.05rem;font-weight:950;}" +
      "#v2201DiscoveryToast .v2201Sub{font-size:.7rem;opacity:.65;margin-top:4px;}" +
      "@keyframes v2201Reveal{0%{transform:scale(.98);filter:brightness(1)}32%{transform:scale(1.045);filter:brightness(1.25)}64%{transform:scale(1.012);filter:brightness(1.08)}100%{transform:scale(1);filter:brightness(1)}}" +
      "@media(prefers-reduced-motion:reduce){.v2201Reveal{animation:none}#v2201DiscoveryToast{transition:none}}";
    document.head.appendChild(s);
  }

  function install(){
    load();css();session();wrapShowcase();bindShowcaseOpen();injectDiscoveryBadges();renderDiscoverySummary();
    window.addEventListener("load",function(){
      wrapShowcase();bindShowcaseOpen();injectDiscoveryBadges();renderDiscoverySummary();
    });
  }

  var api={
    version:VERSION,discover:discover,firstDiscovery:firstDiscovery,refresh:function(){load();injectDiscoveryBadges();renderDiscoverySummary();return snapshot();},
    seen:function(){return state.seen.slice();},recent:function(){return state.newlySeen.slice();},
    clear:function(){state={seen:[],newlySeen:[],sessions:0,lastDiscovery:null};save();injectDiscoveryBadges();renderDiscoverySummary();return snapshot();},
    snapshot:snapshot,presentationOnly:true
  };

  function snapshot(){return JSON.parse(JSON.stringify(state));}

  window.__GEI_V2201_VOICE_DISCOVERY__=api;
  window.GEI_VOICE_DISCOVERY=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();