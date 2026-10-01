/* V2.1.99 — DAM-ITE VOICE MEMORY & FAVORITE MOMENTS
 * Local-only presentation memory layer.
 * Remembers voice preference + favorite contextual/milestone moments.
 * Does not store gameplay scores, purchases, XP, progression, or account data.
 */
(function(){
  "use strict";
  if(window.__GEI_V2199_VOICE_MEMORY__)return;

  var VERSION="V2.1.99";
  var KEY="geiDamIteVoiceMemoryV2199";
  var MAX_FAVORITES=8;
  var state={mode:"female",favorites:[],recent:[],lastFavorite:null,updatedAt:0};

  function director(){return window.GEI_VOICE_DIRECTOR||null;}
  function adaptive(){return window.GEI_ADAPTIVE_VOICE||null;}

  function load(){
    try{
      var raw=localStorage.getItem(KEY);
      var obj=raw?JSON.parse(raw):{};
      if(obj&&typeof obj==="object"){
        state.mode=typeof obj.mode==="string"?obj.mode:"female";
        state.favorites=Array.isArray(obj.favorites)?obj.favorites.slice(0,MAX_FAVORITES):[];
        state.recent=Array.isArray(obj.recent)?obj.recent.slice(-12):[];
        state.lastFavorite=obj.lastFavorite||null;
        state.updatedAt=Number(obj.updatedAt||0);
      }
    }catch(e){}
    return state;
  }

  function save(){
    state.updatedAt=Date.now();
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}
    return snapshot();
  }

  function snapshot(){
    return JSON.parse(JSON.stringify(state));
  }

  function syncMode(){
    var d=director();
    if(d&&typeof d.getMode==="function"){
      state.mode=d.getMode();
    }
  }

  function rememberMode(mode){
    mode=String(mode||"female").toLowerCase();
    state.mode=mode;
    save();
    return mode;
  }

  function addRecent(moment){
    if(!moment)return;
    state.recent=state.recent.filter(function(x){return x!==moment;});
    state.recent.push(moment);
    if(state.recent.length>12)state.recent.shift();
  }

  function isFavorite(moment){
    return state.favorites.indexOf(moment)>=0;
  }

  function toggleFavorite(moment){
    moment=String(moment||"").toLowerCase();
    if(!moment)return false;
    if(isFavorite(moment)){
      state.favorites=state.favorites.filter(function(x){return x!==moment;});
      state.lastFavorite=null;
    }else{
      if(state.favorites.length>=MAX_FAVORITES)state.favorites.shift();
      state.favorites.push(moment);
      state.lastFavorite=moment;
    }
    addRecent(moment);
    save();
    return isFavorite(moment);
  }

  function clearFavorites(){
    state.favorites=[];
    state.lastFavorite=null;
    save();
    return true;
  }

  function clearMemory(){
    state={mode:"female",favorites:[],recent:[],lastFavorite:null,updatedAt:0};
    try{localStorage.removeItem(KEY);}catch(e){}
    return snapshot();
  }

  function favoriteMoments(){
    return state.favorites.slice();
  }

  function titleFor(moment){
    var map={
      mountain:"MOUNTAIN",dam:"DAM",millpond:"MILL POND",
      sluice:"SLUICE-GATE",waterwheel:"WATERWHEEL",factory:"FACTORY",
      welcome:"WELCOME",return:"WELCOME BACK",cycle:"FULL CYCLE",character:"CHARACTER MOMENT"
    };
    return map[moment]||String(moment||"MOMENT").toUpperCase();
  }

  function flash(text){
    var old=document.getElementById("v2199MemoryToast");if(old)old.remove();
    var el=document.createElement("div");
    el.id="v2199MemoryToast";el.className="v2199MemoryToast";el.textContent=text;
    document.body.appendChild(el);
    requestAnimationFrame(function(){el.classList.add("show");});
    setTimeout(function(){el.classList.remove("show");},1250);
    setTimeout(function(){el.remove();},1550);
  }

  function bindToDirector(){
    var d=director();
    if(!d||d.__v2199MemoryWrapped||typeof d.announce!=="function")return;
    var original=d.announce;
    d.announce=function(key,opts){
      var out=original.call(d,key,opts);
      if(out){
        syncMode();
        addRecent(key);
        save();
        if(isFavorite(key))flash("⭐ "+titleFor(key)+" is one of your favorites");
      }
      return out;
    };
    d.__v2199MemoryWrapped=true;
    d.__v2199MemoryOriginal=original;
  }

  function installUI(){
    /* V2.2.04 — Favorites UI retired from the visible game screen. Keep memory API internal. */
    var old=document.getElementById("v2199MemoryDock");if(old)old.remove();
    var toast=document.getElementById("v2199MemoryToast");if(toast)toast.remove();
    return null;
    if(document.getElementById("v2199MemoryDock"))return;
    var wrap=document.createElement("div");
    wrap.id="v2199MemoryDock";
    wrap.innerHTML=
      '<button type="button" class="v2199MemoryButton" aria-expanded="false" aria-controls="v2199MemoryPanel">⭐ FAVORITES</button>'+
      '<div id="v2199MemoryPanel" class="v2199MemoryPanel" role="dialog" aria-label="Favorite voice moments">'+
      '<div class="v2199MemoryTitle">VOICE MEMORY</div>'+
      '<div class="v2199MemoryHint">Save the moments you like most.</div>'+
      '<div id="v2199MemoryList" class="v2199MemoryList"></div>'+
      '<button type="button" class="v2199Clear">CLEAR FAVORITES</button>'+
      '</div>';
    document.body.appendChild(wrap);

    var btn=wrap.querySelector(".v2199MemoryButton");
    var panel=wrap.querySelector(".v2199MemoryPanel");
    btn.addEventListener("click",function(){
      var open=panel.classList.toggle("show");
      btn.setAttribute("aria-expanded",String(open));
      render();
    });
    panel.addEventListener("click",function(e){
      var fav=e.target.closest("[data-v2199-fav]");
      if(fav){
        toggleFavorite(fav.getAttribute("data-v2199-fav"));
        render();
        return;
      }
      if(e.target.closest(".v2199Clear")){
        clearFavorites();render();flash("Favorites cleared");
      }
    });
    document.addEventListener("click",function(e){
      if(!wrap.contains(e.target)){panel.classList.remove("show");btn.setAttribute("aria-expanded","false");}
    });
    render();
  }

  function render(){
    var list=document.getElementById("v2199MemoryList");if(!list)return;
    if(!state.favorites.length){
      list.innerHTML='<div class="v2199Empty">Your favorite moments will appear here.</div>';
      return;
    }
    list.innerHTML=state.favorites.map(function(m){
      return '<button type="button" class="v2199Fav '+(m===state.lastFavorite?"last":"")+'" data-v2199-fav="'+m+'">⭐ '+titleFor(m)+'</button>';
    }).join("");
  }

  function hookUI(){
    try{
      var ui=window.GEI_VOICE_UI;
      if(!ui||ui.__v2199MemoryWrapped||typeof ui.refresh!=="function")return;
      var original=ui.refresh;
      ui.refresh=function(){
        var out=original.apply(ui,arguments);
        syncMode();save();render();
        return out;
      };
      ui.__v2199MemoryWrapped=true;
    }catch(e){}
  }

  function css(){
    if(document.getElementById("v2199MemoryStyle"))return;
    var s=document.createElement("style");
    s.id="v2199MemoryStyle";
    s.textContent=
      "#v2199MemoryDock{position:fixed;right:12px;bottom:calc(env(safe-area-inset-bottom) + 16px);z-index:8200;font-family:inherit;}" +
      ".v2199MemoryButton{appearance:none;color:#fff;background:linear-gradient(135deg,rgba(243,16,186,.22),rgba(47,210,255,.20));border:1px solid rgba(255,255,255,.19);border-radius:16px;min-height:46px;padding:11px 14px;font-weight:950;font-size:.84rem;box-shadow:0 10px 28px rgba(0,0,0,.32);touch-action:manipulation;}" +
      ".v2199MemoryPanel{position:absolute;right:0;bottom:58px;width:min(300px,calc(100vw - 24px));display:none;padding:13px;border-radius:20px;background:rgba(8,11,22,.97);border:1px solid rgba(255,255,255,.18);box-shadow:0 18px 45px rgba(0,0,0,.44),0 0 28px rgba(243,16,186,.10);backdrop-filter:blur(20px);}" +
      ".v2199MemoryPanel.show{display:block;animation:v2199MemoryPop .18s ease-out;}" +
      ".v2199MemoryTitle{font-size:1rem;font-weight:950;letter-spacing:.05em;}" +
      ".v2199MemoryHint{font-size:.76rem;opacity:.7;margin:5px 0 10px;}" +
      ".v2199MemoryList{display:grid;grid-template-columns:1fr 1fr;gap:8px;}" +
      ".v2199Fav,.v2199Clear{appearance:none;color:#fff;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.055);border-radius:14px;min-height:44px;padding:9px;text-align:left;font-weight:850;font-size:.78rem;touch-action:manipulation;}" +
      ".v2199Fav.last{border-color:rgba(243,16,186,.65);box-shadow:0 0 18px rgba(243,16,186,.10);}" +
      ".v2199Clear{width:100%;margin-top:9px;text-align:center;}" +
      ".v2199Empty{grid-column:1/-1;padding:12px 8px;border-radius:12px;background:rgba(255,255,255,.045);font-size:.78rem;opacity:.72;text-align:center;}" +
      ".v2199MemoryToast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 72px);transform:translateX(-50%) translateY(8px);z-index:8300;padding:9px 13px;border-radius:14px;background:rgba(8,11,22,.96);border:1px solid rgba(255,255,255,.18);font:900 .8rem/1.1 Inter,system-ui,sans-serif;opacity:0;transition:opacity .2s ease,transform .2s ease;pointer-events:none;}" +
      ".v2199MemoryToast.show{opacity:1;transform:translateX(-50%);}" +
      "@keyframes v2199MemoryPop{from{opacity:0;transform:translateY(5px) scale(.98)}to{opacity:1;transform:none}}" +
      "@media(prefers-reduced-motion:reduce){.v2199MemoryPanel.show{animation:none}.v2199MemoryToast{transition:none}}" ;
    document.head.appendChild(s);
  }

  function install(){
    load();syncMode();css();bindToDirector();hookUI();installUI();
  }

  var api={
    version:VERSION,maxFavorites:MAX_FAVORITES,get:snapshot,
    syncMode:syncMode,rememberMode:rememberMode,
    toggleFavorite:toggleFavorite,isFavorite:isFavorite,
    favorites:favoriteMoments,clearFavorites:clearFavorites,
    clearMemory:clearMemory,titleFor:titleFor,presentationOnly:true
  };

  window.__GEI_V2199_VOICE_MEMORY__=api;
  window.GEI_VOICE_MEMORY=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();