/* GEI 666 — VISUAL UNITY & INDUSTRIAL THEME v3000
   Unifies the visual design across the entire game with industrial hydraulic engineering aesthetics.
   GEI brand colors: #2fd2ff, #3d3dea, #f310ba, #ff9df2, #06070d
   Presentation-only: no gameplay, economy, or state changes. */
(function(){
  "use strict";
  if(window.__GEI_V3000_VISUAL__) return;

  var VERSION = "V3000";
  function $(id){ return document.getElementById(id); }

  function injectStyles(){
    if($("gei666VisualStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666VisualStyle";
    s.textContent = [
      /* Industrial blueprint texture on panels */
      ".sidePanel{background:linear-gradient(170deg,rgba(6,7,13,.97),rgba(26,39,68,.95),rgba(6,7,13,.98))!important;border-left:3px solid rgba(47,210,255,.2)!important;color:#fff!important}",
      ".sidePanel .panelTitle{color:#fff!important;font-weight:800;letter-spacing:.06em;position:relative;padding-left:12px}",
      ".sidePanel .panelTitle::before{content:'';position:absolute;left:0;top:4px;bottom:4px;width:3px;background:linear-gradient(180deg,#2fd2ff,#f310ba);border-radius:2px}",
      ".sidePanel .panelGroup{color:rgba(47,210,255,.85)!important;border-bottom-color:rgba(47,210,255,.15)!important}",
      ".sidePanel .groupPrice,.sidePanel .emptyNote{color:rgba(255,255,255,.65)!important}",
      ".sidePanel .walletBlock{background:linear-gradient(135deg,rgba(47,210,255,.1),rgba(243,16,186,.05))!important;border:1px solid rgba(47,210,255,.2)!important;border-radius:12px!important}",
      ".sidePanel .wbLabel{color:rgba(47,210,255,.8)!important}",
      ".sidePanel .wbValue{color:#fff!important}",

      /* Enhanced toolbar */
      ".tapToolbar{background:linear-gradient(90deg,rgba(6,7,13,.95),rgba(26,39,68,.9),rgba(6,7,13,.95))!important;border-bottom:2px solid rgba(47,210,255,.2)!important;backdrop-filter:blur(12px)!important;box-shadow:0 2px 16px rgba(0,0,0,.4)!important}",
      ".tapToolbarBtn{color:rgba(255,255,255,.85)!important;transition:color .2s,background .2s}",
      ".tapToolbarBtn:hover,.tapToolbarBtn:active{background:rgba(47,210,255,.1)!important;color:#2fd2ff!important}",
      ".tapToolbarLabel{font-size:.55rem!important;letter-spacing:.04em!important}",

      /* Stage/app area refinement */
      ".stage{background:linear-gradient(135deg,var(--page-bg-a),var(--page-bg-b))!important}",

      /* Enhanced level card */
      ".levelCard{background:linear-gradient(170deg,rgba(6,7,13,.96),rgba(26,39,68,.94),rgba(6,7,13,.97))!important}",
      ".levelInner{border:2px solid rgba(47,210,255,.2)!important;border-radius:22px!important;box-shadow:0 0 40px rgba(47,210,255,.1)!important}",
      ".lcLevel{background:linear-gradient(90deg,#2fd2ff,#f310ba)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;font-weight:900!important;letter-spacing:.08em!important}",
      ".lcOz .lcOzNum{color:#ffd76a!important;font-weight:900}",

      /* Enhanced bonus card */
      ".bonusCard{background:linear-gradient(170deg,rgba(6,7,13,.96),rgba(26,39,68,.94))!important}",
      ".bonusInner{border:2px solid rgba(47,210,255,.2)!important;border-radius:22px!important}",
      ".bwTitle{font-weight:800!important;letter-spacing:.06em!important}",

      /* Game bar / HUD */
      ".gameBar{background:linear-gradient(180deg,rgba(6,7,13,.85),rgba(6,7,13,.65),transparent)!important;backdrop-filter:blur(4px)!important}",
      ".tapProg{background:rgba(6,7,13,.7)!important;border:1.5px solid rgba(47,210,255,.2)!important;border-radius:14px!important}",
      ".tpLabel{color:rgba(47,210,255,.7)!important}",
      ".tpNum{color:#fff!important}",
      ".tpSep,.tpReq{color:rgba(255,255,255,.5)!important}",

      /* Water accents */
      ".lcBtn,.bonusBtn,.rebuildBtn,.preGameStart{background:linear-gradient(135deg,#2fd2ff,#3d3dea)!important;color:#fff!important;border:none!important;font-weight:700!important;letter-spacing:.05em!important;border-radius:12px!important;box-shadow:0 4px 16px rgba(47,210,255,.3)!important}",
      ".lcBtn:active,.bonusBtn:active,.rebuildBtn:active,.preGameStart:active{transform:scale(.97)!important;box-shadow:0 2px 8px rgba(47,210,255,.2)!important}",

      /* Store buttons */
      ".storeBtn{background:linear-gradient(135deg,#3d3dea,#2fd2ff)!important;border:none!important;color:#fff!important;font-weight:700!important;border-radius:10px!important}",

      /* Toast notifications */
      ".labelToast{background:linear-gradient(135deg,rgba(6,7,13,.92),rgba(26,39,68,.9))!important;border:1.5px solid rgba(47,210,255,.25)!important;color:#fff!important;border-radius:12px!important;backdrop-filter:blur(8px)!important}",

      /* Day reward card */
      ".dayReward{background:linear-gradient(135deg,rgba(6,7,13,.95),rgba(26,39,68,.92))!important;border:2px solid rgba(47,210,255,.25)!important;border-radius:16px!important;color:#fff!important}",
      ".dayReward .drTitle{color:#fff!important}",
      ".dayReward .drPlus{color:#ffd76a!important;font-weight:800!important}",

      /* Celebration cards */
      ".celebCard{border:2px solid rgba(47,210,255,.2)!important;border-radius:18px!important}",

      /* Game over card */
      ".gameOverCard{background:linear-gradient(170deg,rgba(6,7,13,.97),rgba(40,20,20,.95))!important;border:2px solid rgba(255,94,122,.3)!important}",

      /* Character cards */
      ".charGrid .charCard{background:rgba(26,39,68,.5)!important;border:1.5px solid rgba(47,210,255,.15)!important;border-radius:14px!important}",

      /* Song rows in vault */
      ".songRow{background:rgba(26,39,68,.3)!important;border:1px solid rgba(47,210,255,.1)!important;border-radius:10px!important}",
      ".songRow.unlocked{background:rgba(47,210,255,.08)!important;border-color:rgba(47,210,255,.2)!important}",

      /* Profile stats grid */
      ".profileGrid .profileStat{background:rgba(47,210,255,.06)!important;border:1px solid rgba(47,210,255,.1)!important;border-radius:10px!important}",

      /* Radio player */
      ".radioPlayer{background:rgba(26,39,68,.4)!important;border:1.5px solid rgba(47,210,255,.15)!important;border-radius:14px!important}",
      ".rpBtn{background:linear-gradient(135deg,#2fd2ff,#3d3dea)!important;border:none!important;color:#fff!important;border-radius:10px!important}",

      /* Pre-game card */
      ".preGameCard .preGameInner{background:linear-gradient(170deg,rgba(6,7,13,.97),rgba(26,39,68,.95))!important;border:2px solid rgba(47,210,255,.2)!important;color:#fff!important}",
      ".preGameTab{color:rgba(255,255,255,.7)!important}",
      ".preGameTab.active{color:#2fd2ff!important;border-bottom-color:#2fd2ff!important}",

      /* Utility dock enhancement */
      ".geiUtilityDock>button{background:linear-gradient(135deg,rgba(6,7,13,.85),rgba(26,39,68,.8))!important;border:1.5px solid rgba(47,210,255,.25)!important;box-shadow:0 2px 12px rgba(0,0,0,.3)!important}",

      /* Store quick nav */
      ".storeQuickBtn{background:rgba(26,39,68,.5)!important;color:rgba(255,255,255,.7)!important;border:1px solid rgba(47,210,255,.1)!important;border-radius:8px!important}",
      ".storeQuickBtn.active{background:rgba(47,210,255,.15)!important;color:#2fd2ff!important;border-color:rgba(47,210,255,.3)!important}",

      /* Scrollbar styling for panels */
      ".sidePanel::-webkit-scrollbar{width:6px}",
      ".sidePanel::-webkit-scrollbar-track{background:rgba(6,7,13,.5)}",
      ".sidePanel::-webkit-scrollbar-thumb{background:rgba(47,210,255,.3);border-radius:3px}",

      /* Mobile optimization */
      "@media (max-width:430px){" +
        ".tapToolbar{padding:4px 2px!important}" +
        ".tapToolbarBtn{padding:4px 6px!important}" +
        ".tapToolbarLabel{font-size:.5rem!important}" +
      "}",

      /* Smooth transitions */
      ".sidePanel,.levelCard,.bonusCard,.dmCard,.celebCard,.gameOverCard,.preGameCard{transition:opacity .3s ease,transform .3s ease!important}",

      /* Reduced motion */
      "@media (prefers-reduced-motion:reduce){.sidePanel,.levelCard,.bonusCard,.dmCard,.celebCard,.gameOverCard,.preGameCard{transition:none!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  function init(){
    injectStyles();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.__GEI_V3000_VISUAL__ = {
    version: VERSION,
    selfTest: function(){
      return { stylesInjected: !!$("gei666VisualStyle") };
    }
  };
})();
