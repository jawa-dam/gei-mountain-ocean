/* V2.1.89 — UTILITY DOCK
 * One clean vertical dock:   🛒 BUY-ites  /  🗺️ DAM MAP  /  🎵 SONG VAULT
 *
 * Reuses the existing buttons (same ids, same click handlers, same random-skin colors):
 *   #dmStoreFloatBtn   → togglePanel("store")                 (index.html)
 *   #damMapLauncherBtn → __GEI_V2170_DAM_MAP__.open()          (index.html launcher → dam-map-v2170.js)
 *   #songVaultFloatBtn → togglePanel("radio")                 (index.html)
 * The dock sits above every moment/overlay layer so DAM MAP is always independently
 * clickable; it only drops under true full-screen dialogs (guide, level card, bonus wheel,
 * DAM machine, time-up, character spotlight, splash) and the DAM Map page itself.
 * Presentation-only: no gameplay, economy, save or entitlement code is touched.
 */
(function(){
  "use strict";
  if(window.__GEI_V2189_UTILITY_DOCK__)return;
  var VERSION="V2.1.89";
  var ORDER=["dmStoreFloatBtn","damMapLauncherBtn","songVaultFloatBtn"];
  var DIALOGS=["celebCard","preGameCard","levelCard","bonusCard","damMachineCard","timeUpCard","characterSpotlight","geiSplash","geiWelcome"];
  var dock=null;

  function $(id){return document.getElementById(id);}
  function css(){
    if($("geiUtilityDock2189Style"))return;
    var s=document.createElement("style");
    s.id="geiUtilityDock2189Style";
    s.textContent=
      ".geiUtilityDock{position:absolute;right:7px;top:calc(53% - 124px);z-index:9996;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none}"+
      ".geiUtilityDock.underDialog{z-index:84}"+
      /* side panel open (store / vault …): stay clickable, but icon-only so the panel stays readable */
      ".geiUtilityDock.compact{gap:7px}.geiUtilityDock.compact>button{width:52px!important;height:52px!important;padding:4px!important;border-radius:16px!important}"+
      ".geiUtilityDock.compact .dmStoreFloatSub,.geiUtilityDock.compact .songVaultFloatLabel,.geiUtilityDock.compact .damMapLauncherText{display:none!important}"+
      ".geiUtilityDock.compact .dmStoreFloatTitle,.geiUtilityDock.compact .songVaultFloatIcon,.geiUtilityDock.compact .damMapLauncherIcon{font-size:1.5rem!important}"+
      ".geiUtilityDock>button{position:relative!important;inset:auto!important;margin:0!important;flex:0 0 auto;width:76px!important;height:76px!important;max-width:none!important;max-height:none!important;pointer-events:auto!important;touch-action:manipulation}"+
      /* DAM MAP: same card language as its neighbours (skin variables), a readable label, */
      /* and a subtle periodic water-wave pulse instead of a constant float. */
      ".geiUtilityDock #damMapLauncherBtn{border-radius:22px;animation:none;overflow:visible;isolation:isolate}"+
      ".geiUtilityDock #damMapLauncherBtn>span:not(.geiDockWaveClip){position:relative;z-index:1}"+
      ".geiDockWaveClip{position:absolute;inset:0;border-radius:inherit;overflow:hidden;z-index:0;pointer-events:none}"+
      ".geiUtilityDock #damMapLauncherBtn .damMapLauncherIcon{font-size:2rem;animation:geiDockMapBob 3.9s ease-in-out infinite}"+
      ".geiUtilityDock #damMapLauncherBtn .damMapLauncherText{font-size:.68rem;letter-spacing:.04em}"+
      ".geiUtilityDock #damMapLauncherBtn::after{content:none}"+
      ".geiDockWave{position:absolute;left:-10%;right:-10%;bottom:-60%;height:120%;pointer-events:none;border-radius:45% 48% 0 0;"+
      "background:linear-gradient(180deg,color-mix(in srgb,var(--water-bright,#2fd2ff) 46%,transparent),transparent 70%);opacity:0;transform:translateY(40%);animation:geiDockWave 5.2s ease-in-out infinite}"+
      "@keyframes geiDockWave{0%,58%{opacity:0;transform:translateY(40%) rotate(0deg)}70%{opacity:.85;transform:translateY(-14%) rotate(-3deg)}84%{opacity:.4;transform:translateY(-4%) rotate(2deg)}100%{opacity:0;transform:translateY(40%) rotate(0deg)}}"+
      "@keyframes geiDockMapBob{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-2px) rotate(1.5deg)}}"+
      "#damMapTopBtn{display:none!important}"+  /* V2.1.70 injects a second HUD map icon; the dock owns DAM MAP now */
      "@media (max-width:430px){.geiUtilityDock{right:5px;top:calc(53% - 112px);gap:8px}.geiUtilityDock>button{width:68px!important;height:68px!important}"+
      ".geiUtilityDock #damMapLauncherBtn .damMapLauncherIcon{font-size:1.8rem}.geiUtilityDock #damMapLauncherBtn .damMapLauncherText{font-size:.62rem}}"+
      /* V2.1.81: only when the measured world is too short for the full rail do buttons step down */
      ".geiUtilityDock.railTight{gap:6px}.geiUtilityDock.railTight>button{width:64px!important;height:64px!important}"+
      ".geiUtilityDock.railTiny{gap:4px}.geiUtilityDock.railTiny>button{width:54px!important;height:54px!important;padding:3px!important}"+
      ".geiUtilityDock.railTiny .dmStoreFloatSub,.geiUtilityDock.railTiny .songVaultFloatLabel{display:none!important}"+
      "@media (max-height:620px){.geiUtilityDock{top:calc(50% - 94px);gap:6px}.geiUtilityDock>button{width:60px!important;height:60px!important}"+
      ".geiUtilityDock .dmStoreFloatTitle,.geiUtilityDock .songVaultFloatIcon,.geiUtilityDock .damMapLauncherIcon{font-size:1.55rem!important}}"+
      "@media (prefers-reduced-motion:reduce){.geiDockWave,.geiUtilityDock #damMapLauncherBtn .damMapLauncherIcon{animation:none!important}}";
    document.head.appendChild(s);
  }

  function ensureMapLabel(b){
    /* The index.html launcher normally does this; repeat it only if it has not run yet. */
    if(!b.querySelector(".damMapLauncherText")){
      b.innerHTML='<span class="damMapLauncherIcon" aria-hidden="true">🗺️</span><span class="damMapLauncherText">DAM MAP</span>';
      b.className="damMapLauncherBtn";
    }
    if(!b.querySelector(".geiDockWaveClip")){
      var c=document.createElement("span"); c.className="geiDockWaveClip"; c.setAttribute("aria-hidden","true");
      c.innerHTML='<span class="geiDockWave"></span>';
      b.insertBefore(c,b.firstChild);
    }
    if(!b.dataset.damMapHook){
      /* Fallback click wiring when the launcher script is absent. */
      b.dataset.damMapHook="2189";
      b.addEventListener("click",openMap);
    }
  }
  function openMap(){
    var page=$("geiDamMapPage"); if(page&&page.classList.contains("show"))return true;   // the index.html launcher already opened it
    try{ if(window.__GEI_V2170_DAM_MAP__&&typeof window.__GEI_V2170_DAM_MAP__.open==="function"){window.__GEI_V2170_DAM_MAP__.open();return true;} }catch(e){}
    return false;
  }

  function build(){
    var root=$("appRoot"); if(!root)return false;
    var btns=ORDER.map($); if(btns.some(function(b){return !b;}))return false;
    css();
    dock=$("geiUtilityDock");
    if(!dock){
      dock=document.createElement("nav");
      dock.id="geiUtilityDock"; dock.className="geiUtilityDock mobileActionRail"; dock.setAttribute("aria-label","Utilities");
      root.appendChild(dock);
    }
    dock.classList.add("mobileActionRail");
    ensureMapLabel(btns[1]);
    btns.forEach(function(b){ if(b.parentNode!==dock||dock.lastElementChild!==b)dock.appendChild(b); });   // enforce order
    btns[1].setAttribute("aria-label","Open DAM Map"); btns[1].title="DAM Map";
    return true;
  }

  function dialogOpen(){
    for(var i=0;i<DIALOGS.length;i++){
      var m=$(DIALOGS[i]); if(!m||m.classList.contains("isDone"))continue;
      try{var cs=getComputedStyle(m); if(cs.display!=="none"&&cs.visibility!=="hidden"&&parseFloat(cs.opacity||"1")>.03){var r=m.getBoundingClientRect();if(r.width&&r.height)return DIALOGS[i];}}catch(e){}
    }
    return "";
  }
  /* V2.1.81 — measure the real world box inside the app so the rail and the DAM MACHINE button
     stay inside it on every Android viewport (no % of the whole app, no HUD overlap). */
  function syncFrame(){
    var root=$("appRoot"), world=$("world"); if(!root||!world||!dock)return;
    var a=root.getBoundingClientRect(), w=world.getBoundingClientRect();
    if(!w.height||!w.width)return;
    root.style.setProperty("--geiWorldTop",Math.round(w.top-a.top)+"px");
    root.style.setProperty("--geiWorldH",Math.round(w.height)+"px");
    root.classList.add("geiFrameSynced");
    dock.classList.remove("railTight","railTiny");
    var room=w.height-12;
    if(dock.offsetHeight>room){ dock.classList.add("railTight"); if(dock.offsetHeight>room)dock.classList.add("railTiny"); }
  }
  function syncLayer(){
    if(!dock)return;
    syncFrame();
    dock.classList.toggle("underDialog",!!dialogOpen());
    var panel=false; try{panel=typeof anyPanelOpen==="function"&&anyPanelOpen();}catch(e){}
    dock.classList.toggle("compact",!!panel);
  }

  function hitTest(){
    /* What would actually receive a tap at the centre of each dock button right now. */
    return ORDER.map(function(id){
      var b=$(id); if(!b)return {id:id,ok:false,reason:"missing"};
      var r=b.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2;
      var hit=document.elementFromPoint(x,y);
      return {id:id,ok:!!hit&&(hit===b||b.contains(hit)),hit:hit?(hit.id||hit.className||hit.tagName):null,rect:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]};
    });
  }
  function selfTest(){
    var ids=dock?[].map.call(dock.children,function(c){return c.id;}):[];
    var rects=ORDER.map(function(id){var b=$(id);return b?b.getBoundingClientRect():null;});
    var vertical=rects.every(Boolean)&&rects[0].bottom<=rects[1].top+1&&rects[1].bottom<=rects[2].top+1&&
      Math.abs((rects[0].left+rects[0].right)-(rects[1].left+rects[1].right))<3&&Math.abs((rects[1].left+rects[1].right)-(rects[2].left+rects[2].right))<3;
    var hits=hitTest();
    return {
      version:VERSION, dock:!!dock, order:ids, orderOk:ids.join()===ORDER.join(),
      verticalStack:vertical, mapBelowStoreAboveVault:vertical,
      clickable:hits, allClickable:hits.every(function(h){return h.ok;}),
      underDialog:!!(dock&&dock.classList.contains("underDialog")), compact:!!(dock&&dock.classList.contains("compact")), dialog:dialogOpen()||null,
      mapEngine:!!(window.__GEI_V2170_DAM_MAP__&&window.__GEI_V2170_DAM_MAP__.open),
      duplicateHudMapHidden:(function(){var d=$("damMapTopBtn");return !d||getComputedStyle(d).display==="none";})(),
      presentationOnly:true, gameplayStateChanged:false
    };
  }

  function boot(){
    if(!build())return;
    syncLayer();
    var mo=new MutationObserver(syncLayer);
    DIALOGS.forEach(function(id){var m=$(id);if(m)mo.observe(m,{attributes:true,attributeFilter:["class","style","hidden"]});});
    [].forEach.call(document.querySelectorAll(".sidePanel"),function(p){mo.observe(p,{attributes:true,attributeFilter:["class"]});});
    window.addEventListener("resize",syncFrame);
    window.addEventListener("orientationchange",syncFrame);
    try{ if(window.visualViewport)window.visualViewport.addEventListener("resize",syncFrame); }catch(e){}
    try{ if(window.ResizeObserver){ var ro=new ResizeObserver(syncFrame); ro.observe($("world")); ro.observe($("appRoot")); } }catch(e){}
    setInterval(syncLayer,700);                  // splash / late-created dialogs
  }

  window.__GEI_V2189_UTILITY_DOCK__=Object.freeze({version:VERSION,order:ORDER.slice(),rebuild:build,openMap:openMap,hitTest:hitTest,selfTest:selfTest});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
  window.addEventListener("load",function(){build();syncLayer();});
})();
