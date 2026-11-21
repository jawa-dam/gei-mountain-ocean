/* GEI 666 — MOUNTAIN-TO-OCEAN JOURNEY EVOLUTION v3000
   Adds an evolving landscape visualization to the DAM MAP that develops
   as the player progresses through levels. Each completed level reveals
   new construction and environmental detail.

   Read-only: derives everything from state.completedLevels.
   Never writes game state, FL OZ, or saves. */
(function(){
  "use strict";
  if(window.__GEI_V3000_JOURNEY__) return;

  var VERSION = "V3000";
  function $(id){ return document.getElementById(id); }

  var STAGES = [
    { level:0, id:"source",     title:"MOUNTAIN SOURCE",        desc:"Fresh mountain streams and tributaries — the journey begins.",       icon:"⛰️", color:"#4ecdc4" },
    { level:1, id:"dam",        title:"DAM CONSTRUCTION",        desc:"The dam takes shape — controlling the mountain's power.",            icon:"🧱", color:"#e17055" },
    { level:2, id:"reservoir",  title:"RESERVOIR & MILLPOND",    desc:"Water pools behind the dam — stored energy waiting to flow.",        icon:"🌊", color:"#0984e3" },
    { level:3, id:"channels",   title:"GATES & CHANNELS",        desc:"Sluice gates and channels direct the controlled flow.",              icon:"🚪", color:"#6c5ce7" },
    { level:4, id:"waterwheel", title:"WATERWHEEL POWER",        desc:"The waterwheel spins — water becomes mechanical energy.",            icon:"⚙️", color:"#fdcb6e" },
    { level:5, id:"mill",       title:"COMPLETE MILL SYSTEM",     desc:"The full industrial system online — mountain water powers the mill.",icon:"🏭", color:"#2fd2ff" }
  ];

  function getCompleted(){
    try { return Math.max(0, Number(window.state && window.state.completedLevels) || 0); }
    catch(e){ return 0; }
  }

  function injectStyles(){
    if($("gei666JourneyStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666JourneyStyle";
    s.textContent = [
      ".journeyEvolution{padding:0 12px 16px;margin:0 auto;max-width:420px}",
      ".journeyTitle{font-size:.85rem;font-weight:800;color:#2fd2ff;letter-spacing:.08em;text-align:center;margin:12px 0 8px;text-transform:uppercase}",
      ".journeySubtitle{font-size:.65rem;color:rgba(255,255,255,.5);text-align:center;letter-spacing:.04em;margin-bottom:14px}",

      /* Journey path */
      ".journeyPath{position:relative;padding-left:36px}",
      ".journeyPathLine{position:absolute;left:16px;top:0;bottom:0;width:3px;background:rgba(47,210,255,.1);border-radius:2px}",
      ".journeyPathFill{position:absolute;left:16px;top:0;width:3px;border-radius:2px;background:linear-gradient(180deg,#2fd2ff,#f310ba);transition:height .8s ease}",

      /* Stage nodes */
      ".journeyStage{position:relative;padding:10px 0 10px 20px;opacity:.35;transition:opacity .5s ease,transform .5s ease}",
      ".journeyStage.unlocked{opacity:1}",
      ".journeyStage.current{opacity:1;transform:scale(1.02)}",
      ".journeyStageNode{position:absolute;left:-28px;top:12px;width:24px;height:24px;border-radius:50%;border:2.5px solid rgba(47,210,255,.2);background:rgba(6,7,13,.8);display:flex;align-items:center;justify-content:center;font-size:.7rem;transition:all .4s ease;z-index:1}",
      ".journeyStage.unlocked .journeyStageNode{border-color:rgba(47,210,255,.6);background:rgba(47,210,255,.1);box-shadow:0 0 8px rgba(47,210,255,.2)}",
      ".journeyStage.current .journeyStageNode{border-color:#2fd2ff;background:rgba(47,210,255,.2);box-shadow:0 0 16px rgba(47,210,255,.4);animation:journeyNodePulse 2s ease-in-out infinite}",
      "@keyframes journeyNodePulse{0%,100%{box-shadow:0 0 16px rgba(47,210,255,.4)}50%{box-shadow:0 0 24px rgba(47,210,255,.7)}}",

      /* Stage card */
      ".journeyStageCard{background:rgba(26,39,68,.3);border:1px solid rgba(47,210,255,.1);border-radius:12px;padding:10px 14px;transition:all .4s ease}",
      ".journeyStage.unlocked .journeyStageCard{background:rgba(26,39,68,.5);border-color:rgba(47,210,255,.2)}",
      ".journeyStage.current .journeyStageCard{background:linear-gradient(135deg,rgba(47,210,255,.1),rgba(243,16,186,.05));border-color:rgba(47,210,255,.4);box-shadow:0 2px 16px rgba(47,210,255,.1)}",
      ".journeyStageTitle{font-size:.75rem;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.05em;margin-bottom:2px;transition:color .4s}",
      ".journeyStage.unlocked .journeyStageTitle{color:#fff}",
      ".journeyStage.current .journeyStageTitle{color:#2fd2ff}",
      ".journeyStageDesc{font-size:.65rem;color:rgba(255,255,255,.35);line-height:1.4;transition:color .4s}",
      ".journeyStage.unlocked .journeyStageDesc{color:rgba(255,255,255,.65)}",
      ".journeyStageLock{font-size:.55rem;color:rgba(243,16,186,.7);margin-top:4px;letter-spacing:.04em}",
      ".journeyStageBadge{display:inline-block;font-size:.5rem;padding:2px 6px;border-radius:4px;background:rgba(47,210,255,.15);color:#2fd2ff;font-weight:700;letter-spacing:.06em;margin-left:6px;vertical-align:middle}",
      ".journeyStage.current .journeyStageBadge{background:rgba(47,210,255,.25);animation:journeyBadgePulse 2s ease-in-out infinite}",
      "@keyframes journeyBadgePulse{0%,100%{opacity:1}50%{opacity:.6}}",

      /* Completion banner */
      ".journeyComplete{text-align:center;padding:14px;margin-top:8px;background:linear-gradient(135deg,rgba(47,210,255,.1),rgba(243,16,186,.08));border:1.5px solid rgba(47,210,255,.3);border-radius:14px}",
      ".journeyCompleteIcon{font-size:1.5rem;margin-bottom:4px}",
      ".journeyCompleteText{font-size:.75rem;font-weight:700;color:#2fd2ff;letter-spacing:.06em}",
      ".journeyCompleteSub{font-size:.6rem;color:rgba(255,255,255,.5);margin-top:2px}",

      /* Progress summary */
      ".journeyProgress{display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(26,39,68,.3);border-radius:10px;margin-bottom:12px}",
      ".journeyProgressBar{flex:1;height:6px;border-radius:3px;background:rgba(47,210,255,.1);overflow:hidden}",
      ".journeyProgressFill{height:100%;border-radius:3px;background:linear-gradient(90deg,#2fd2ff,#f310ba);transition:width .8s ease}",
      ".journeyProgressText{font-size:.6rem;color:rgba(47,210,255,.7);white-space:nowrap;letter-spacing:.04em}",

      /* Reduced motion */
      "@media (prefers-reduced-motion:reduce){.journeyStageNode,.journeyStageBadge{animation:none!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  function buildJourneyPanel(){
    var completed = getCompleted();
    var currentStage = Math.min(completed, STAGES.length - 1);
    var pct = Math.min(100, Math.round((completed / STAGES.length) * 100));
    var allDone = completed >= STAGES.length;

    var html = '<div class="journeyEvolution">';
    html += '<div class="journeyTitle">MOUNTAIN TO OCEAN</div>';
    html += '<div class="journeySubtitle">YOUR HYDRAULIC JOURNEY</div>';

    html += '<div class="journeyProgress">';
    html += '<div class="journeyProgressBar"><div class="journeyProgressFill" style="width:' + pct + '%"></div></div>';
    html += '<div class="journeyProgressText">' + Math.min(completed, STAGES.length) + ' / ' + STAGES.length + '</div>';
    html += '</div>';

    html += '<div class="journeyPath">';
    html += '<div class="journeyPathLine"></div>';
    var fillH = allDone ? 100 : (currentStage / (STAGES.length - 1)) * 100;
    html += '<div class="journeyPathFill" style="height:' + fillH + '%"></div>';

    for(var i = 0; i < STAGES.length; i++){
      var stage = STAGES[i];
      var unlocked = completed > i;
      var isCurrent = completed === i;
      var cls = "journeyStage";
      if(unlocked) cls += " unlocked";
      if(isCurrent) cls += " current";

      html += '<div class="' + cls + '">';
      html += '<div class="journeyStageNode">' + stage.icon + '</div>';
      html += '<div class="journeyStageCard">';
      html += '<div class="journeyStageTitle">' + stage.title;
      if(unlocked) html += '<span class="journeyStageBadge">COMPLETE</span>';
      else if(isCurrent) html += '<span class="journeyStageBadge">IN PROGRESS</span>';
      html += '</div>';

      if(unlocked || isCurrent){
        html += '<div class="journeyStageDesc">' + stage.desc + '</div>';
      } else {
        html += '<div class="journeyStageLock">🔒 Complete Level ' + (stage.level + 1) + ' to reveal</div>';
      }
      html += '</div></div>';
    }
    html += '</div>';

    if(allDone){
      html += '<div class="journeyComplete">';
      html += '<div class="journeyCompleteIcon">🌊</div>';
      html += '<div class="journeyCompleteText">JOURNEY COMPLETE</div>';
      html += '<div class="journeyCompleteSub">The water flows from mountain to ocean — the full hydraulic cycle.</div>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function injectIntoMap(){
    var mapPage = document.getElementById("geiDamMapPage");
    if(!mapPage) return false;

    var scrollArea = mapPage.querySelector(".dmScrollArea, .damMapScroll, [class*='scroll']");
    var target = scrollArea || mapPage;

    var existing = target.querySelector(".journeyEvolution");
    if(existing) existing.remove();

    var container = document.createElement("div");
    container.innerHTML = buildJourneyPanel();
    var journeyEl = container.firstChild;

    target.appendChild(journeyEl);
    return true;
  }

  function hookMapOpen(){
    if(!window.__GEI_V2170_DAM_MAP__) return;
    var orig = window.__GEI_V2170_DAM_MAP__.open;
    if(typeof orig !== "function" || orig._gei666JourneyHooked) return;

    window.__GEI_V2170_DAM_MAP__.open = function(){
      var result = orig.apply(this, arguments);
      setTimeout(function(){ injectIntoMap(); }, 300);
      return result;
    };
    window.__GEI_V2170_DAM_MAP__.open._gei666JourneyHooked = true;
  }

  function watchMapShow(){
    var mapPage = document.getElementById("geiDamMapPage");
    if(!mapPage || mapPage._gei666JourneyObs) return;
    mapPage._gei666JourneyObs = true;

    var obs = new MutationObserver(function(){
      if(mapPage.classList.contains("show")){
        setTimeout(function(){ injectIntoMap(); }, 200);
      }
    });
    obs.observe(mapPage, { attributes: true, attributeFilter: ["class"] });
  }

  function init(){
    injectStyles();
    hookMapOpen();
    watchMapShow();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 2000);
  setTimeout(init, 5000);

  window.__GEI_V3000_JOURNEY__ = {
    version: VERSION,
    stages: STAGES,
    buildPanel: buildJourneyPanel,
    selfTest: function(){
      return {
        completedLevels: getCompleted(),
        mapHooked: !!(window.__GEI_V2170_DAM_MAP__ && window.__GEI_V2170_DAM_MAP__.open._gei666JourneyHooked),
        stylesInjected: !!$("gei666JourneyStyle")
      };
    }
  };
})();
