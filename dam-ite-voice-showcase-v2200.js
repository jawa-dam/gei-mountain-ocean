/* V2.2.00 — DAM-ITE VOICE SHOWCASE & REPLAY
 * Presentation/audio-only showcase built on GEI_VOICE_DIRECTOR + GEI_VOICE_MEMORY.
 * Players can browse, preview, replay, and favorite milestone voice moments.
 * Supports Female, Male, and Random preview modes plus Factory excited variants.
 * No gameplay/economy/progression/XP/purchase/save mutations.
 */
(function(){
  "use strict";
  if(window.__GEI_V2200_VOICE_SHOWCASE__)return;

  var VERSION="V2.2.00";
  var DIRECTOR=window.GEI_VOICE_DIRECTOR||null;
  var MEMORY=window.GEI_VOICE_MEMORY||null;
  var modes=["female","male","random"];
  var steps=["mountain","dam","millpond","sluice","waterwheel","factory"];
  var labels={
    mountain:"MOUNTAIN",dam:"DAM",millpond:"MILL POND",
    sluice:"SLUICE-GATE",waterwheel:"WATERWHEEL",factory:"FACTORY"
  };
  var icons={
    mountain:"⛰️",dam:"🏗️",millpond:"🌊",sluice:"🚪",waterwheel:"⚙️",factory:"🏭"
  };
  var panelId="v2200VoiceShowcase";
  var buttonId="v2200VoiceShowcaseButton";

  function currentMode(){
    try{return DIRECTOR&&DIRECTOR.getMode?DIRECTOR.getMode():"female";}catch(e){return"female";}
  }
  function setDirectorMode(mode){
    try{if(DIRECTOR&&DIRECTOR.setMode)return DIRECTOR.setMode(mode);}catch(e){}
    return mode;
  }
  function isFav(key){try{return !!(MEMORY&&MEMORY.isFavorite&&MEMORY.isFavorite(key));}catch(e){return false;}}
  function toggleFav(key){try{return MEMORY&&MEMORY.toggleFavorite?MEMORY.toggleFavorite(key):false;}catch(e){return false;}}

  function preview(key,mode,variant){
    if(!DIRECTOR||typeof DIRECTOR.announce!=="function")return false;
    if(mode&&mode!=="off")setDirectorMode(mode);
    var opts={force:true};
    if(variant==="factoryExcited"){
      /* The Director owns variant selection. The showcase requests Factory replay;
         excited selection remains part of the Director's normal Factory rules. */
      return DIRECTOR.announce("factory",opts);
    }
    return DIRECTOR.announce(key,opts);
  }

  function renderCard(key){
    var fav=isFav(key);
    return '<div class="v2200Card" data-v2200-key="'+key+'">'+
      '<div class="v2200Icon" aria-hidden="true">'+icons[key]+'</div>'+
      '<div class="v2200Info"><div class="v2200Label">'+labels[key]+'</div>'+
      '<div class="v2200Meta">'+(key==="factory"?"Normal + excited variants":"Milestone voice")+'</div></div>'+
      '<button type="button" class="v2200Play" data-v2200-play="'+key+'" aria-label="Replay '+labels[key]+'">▶</button>'+
      '<button type="button" class="v2200Fav '+(fav?"active":"")+'" data-v2200-fav="'+key+'" aria-label="'+(fav?"Remove ":"Add ")+' '+labels[key]+' favorite">★</button>'+
      '</div>';
  }

  function build(){
    /* V2.2.04 — Voice Showcase UI retired. Internal API remains available. */
    return null;
    if(document.getElementById(panelId))return;
    var wrap=document.createElement("section");
    wrap.id=panelId;
    wrap.setAttribute("aria-label","DAM-ITE Voice Showcase");
    wrap.innerHTML=
      '<div class="v2200Header"><div><div class="v2200Title">🎙️ DAM-ITE VOICE SHOWCASE</div>'+
      '<div class="v2200Subtitle">Replay your favorite milestone voices.</div></div>'+
      '<button type="button" class="v2200Close" aria-label="Close voice showcase">✕</button></div>'+
      '<div class="v2200ModeRow">'+
      modes.map(function(m){return '<button type="button" class="v2200Mode" data-v2200-mode="'+m+'">'+
        (m==="female"?"♀":m==="male"?"♂":"🎲")+" "+m.toUpperCase()+'</button>';}).join("")+
      '</div>'+
      '<div class="v2200Grid">'+steps.map(renderCard).join("")+'</div>'+
      '<div class="v2200FactoryNote">🏭 FACTORY includes the normal and excited voice variants.</div>';

    document.body.appendChild(wrap);

    wrap.addEventListener("click",function(e){
      var close=e.target.closest(".v2200Close");
      if(close){closePanel();return;}
      var mode=e.target.closest("[data-v2200-mode]");
      if(mode){
        setDirectorMode(mode.getAttribute("data-v2200-mode"));
        refresh();
        return;
      }
      var play=e.target.closest("[data-v2200-play]");
      if(play){preview(play.getAttribute("data-v2200-play"),currentMode());return;}
      var fav=e.target.closest("[data-v2200-fav]");
      if(fav){toggleFav(fav.getAttribute("data-v2200-fav"));refresh();return;}
    });
  }

  function refresh(){
    var wrap=document.getElementById(panelId);if(!wrap)return;
    var mode=currentMode();
    wrap.querySelectorAll("[data-v2200-mode]").forEach(function(btn){
      var active=btn.getAttribute("data-v2200-mode")===mode;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-pressed",String(active));
    });
    wrap.querySelectorAll("[data-v2200-fav]").forEach(function(btn){
      var key=btn.getAttribute("data-v2200-fav");
      var active=isFav(key);
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-pressed",String(active));
      btn.setAttribute("aria-label",(active?"Remove ":"Add ")+" "+labels[key]+" favorite");
    });
    var title=wrap.querySelector(".v2200Title");
    if(title)title.textContent="🎙️ DAM-ITE VOICE SHOWCASE";
  }

  function openPanel(){ return false; }
  function closePanel(){
    removeVisibleUI();
    var wrap=document.getElementById(panelId);if(!wrap)return;
    wrap.classList.remove("show");
  }

  function buildLauncher(){
    /* V2.2.04 — launcher retired from visible UI. */
    return null;
    if(document.getElementById(buttonId))return;
    var btn=document.createElement("button");
    btn.id=buttonId;btn.type="button";
    btn.innerHTML="🎙️ VOICE SHOWCASE";
    btn.setAttribute("aria-controls",panelId);btn.setAttribute("aria-expanded","false");
    btn.addEventListener("click",function(){
      var wrap=document.getElementById(panelId);
      var open=!!wrap&&!wrap.classList.contains("show");
      if(open){openPanel();btn.setAttribute("aria-expanded","true");}
      else{closePanel();btn.setAttribute("aria-expanded","false");}
    });
    document.body.appendChild(btn);
    document.addEventListener("click",function(e){
      var wrap=document.getElementById(panelId);
      if(wrap&&!wrap.contains(e.target)&&e.target!==btn){
        closePanel();btn.setAttribute("aria-expanded","false");
      }
    });
  }

  function injectStyles(){
    if(document.getElementById("v2200VoiceShowcaseStyle"))return;
    var s=document.createElement("style");s.id="v2200VoiceShowcaseStyle";
    s.textContent=
      "#"+buttonId+"{position:fixed;left:12px;bottom:calc(env(safe-area-inset-bottom) + 16px);z-index:8190;appearance:none;color:#fff;background:linear-gradient(135deg,rgba(47,210,255,.22),rgba(61,61,234,.22),rgba(243,16,186,.18));border:1px solid rgba(255,255,255,.20);border-radius:16px;min-height:46px;padding:11px 14px;font:950 .82rem/1 Inter,system-ui,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.34);touch-action:manipulation;}" +
      "#"+panelId+"{position:fixed;inset:0;z-index:8180;display:none;padding:calc(env(safe-area-inset-top) + 14px) 12px calc(env(safe-area-inset-bottom) + 80px);background:rgba(4,7,14,.72);backdrop-filter:blur(10px);overflow:auto;font-family:inherit;}" +
      "#"+panelId+".show{display:block;animation:v2200Fade .16s ease-out;}" +
      "#"+panelId+" .v2200Header{max-width:520px;margin:0 auto 10px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px;border-radius:20px;background:rgba(8,11,22,.96);border:1px solid rgba(255,255,255,.18);box-shadow:0 18px 42px rgba(0,0,0,.38);}" +
      "#"+panelId+" .v2200Title{font-size:clamp(1rem,4.5vw,1.2rem);font-weight:950;letter-spacing:.04em;}" +
      "#"+panelId+" .v2200Subtitle{font-size:.76rem;opacity:.70;margin-top:4px;}" +
      "#"+panelId+" .v2200Close{min-width:44px;min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;font-size:1.05rem;}" +
      "#"+panelId+" .v2200ModeRow{max-width:520px;margin:0 auto 10px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}" +
      "#"+panelId+" .v2200Mode{min-height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.06);color:#fff;font:900 .76rem/1 Inter,system-ui,sans-serif;}" +
      "#"+panelId+" .v2200Mode.active{border-color:rgba(47,210,255,.78);box-shadow:0 0 20px rgba(47,210,255,.10);background:rgba(47,210,255,.11);}" +
      "#"+panelId+" .v2200Grid{max-width:520px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:9px;}" +
      "#"+panelId+" .v2200Card{min-height:116px;padding:11px;border-radius:18px;background:rgba(8,11,22,.95);border:1px solid rgba(255,255,255,.14);display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:1fr auto;gap:8px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.24);}" +
      "#"+panelId+" .v2200Icon{font-size:1.65rem;grid-row:1/3;}" +
      "#"+panelId+" .v2200Label{font-size:.84rem;font-weight:950;}" +
      "#"+panelId+" .v2200Meta{font-size:.66rem;opacity:.62;margin-top:4px;}" +
      "#"+panelId+" .v2200Play,#"+panelId+" .v2200Fav{min-width:42px;min-height:42px;border-radius:13px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.055);color:#fff;font-weight:950;}" +
      "#"+panelId+" .v2200Fav.active{color:#ffd85a;border-color:rgba(255,216,90,.60);background:rgba(255,216,90,.08);}" +
      "#"+panelId+" .v2200FactoryNote{max-width:520px;margin:10px auto 0;padding:10px 12px;border-radius:15px;background:rgba(243,16,186,.08);border:1px solid rgba(243,16,186,.18);font-size:.74rem;text-align:center;}" +
      "@keyframes v2200Fade{from{opacity:0}to{opacity:1}}" +
      "@media(max-width:390px){#"+panelId+" .v2200Grid{grid-template-columns:1fr}.v2200Mode{font-size:.70rem}}" +
      "@media(prefers-reduced-motion:reduce){#"+panelId+".show{animation:none}}";
    document.head.appendChild(s);
  }

  function removeVisibleUI(){
    var panel=document.getElementById(panelId);if(panel)panel.remove();
    var button=document.getElementById(buttonId);if(button)button.remove();
  }

  function install(){
    if(!DIRECTOR)return;
    removeVisibleUI();
  }

  var api={
    version:VERSION,steps:steps.slice(),open:openPanel,close:closePanel,refresh:refresh,
    preview:preview,isFavorite:isFav,toggleFavorite:toggleFav,presentationOnly:true
  };
  window.__GEI_V2200_VOICE_SHOWCASE__=api;
  window.GEI_VOICE_SHOWCASE=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();