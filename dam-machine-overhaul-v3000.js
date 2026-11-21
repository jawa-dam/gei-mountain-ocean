/* GEI 666 — THE HYDRAULIC DAM MACHINE VISUAL OVERHAUL v3000
   Transforms the DAM MACHINE into a visually impressive hydraulic arcade experience.
   Preserves all existing reward logic, spin mechanics, and state management.
   Only upgrades the PRESENTATION layer. */
(function(){
  "use strict";
  if(window.__GEI_V3000_DAM_MACHINE__) return;

  var VERSION = "V3000";
  var LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-yalltoo-666-9qoyhEUbsZmy89kI.png";
  function $(id){ return document.getElementById(id); }

  function injectStyles(){
    if($("gei666DmStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666DmStyle";
    s.textContent = [
      /* Enhanced DAM MACHINE card */
      ".dmCard{background:linear-gradient(170deg,#06070d 0%,#0a1428 30%,#1a2744 60%,#06070d 100%)!important;border:2px solid rgba(47,210,255,.3)!important;box-shadow:0 0 60px rgba(47,210,255,.15),inset 0 0 40px rgba(47,210,255,.05)!important}",

      /* Industrial frame around reels */
      ".dmCabinet{position:relative;padding:12px;background:linear-gradient(135deg,rgba(26,39,68,.5),rgba(6,7,13,.8));border-radius:16px;border:2px solid rgba(47,210,255,.2);overflow:visible!important}",

      /* Hydraulic pipes on sides */
      ".dmPipe{width:14px!important;background:linear-gradient(180deg,#4a5a7a,#8a9ab8,#4a5a7a)!important;border-radius:7px!important;border:1.5px solid rgba(47,210,255,.3)!important;box-shadow:inset 0 0 8px rgba(47,210,255,.2)!important;position:relative;overflow:hidden!important}",
      ".dmPipe::before{content:'';position:absolute;inset:3px;border-radius:4px;background:linear-gradient(180deg,transparent,rgba(47,210,255,.3),transparent);animation:dmPipeFlow 2s linear infinite}",
      "@keyframes dmPipeFlow{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}",

      /* Enhanced reels */
      ".dmReel{background:linear-gradient(180deg,rgba(6,7,13,.9),rgba(26,39,68,.7),rgba(6,7,13,.9))!important;border:2px solid rgba(47,210,255,.2)!important;border-radius:10px!important;box-shadow:inset 0 0 16px rgba(0,0,0,.5)!important}",
      ".dmSeam{background:rgba(47,210,255,.15)!important;width:3px!important}",

      /* Reel symbols — larger and more visible */
      ".dmSymbol{font-size:1.6rem!important}",
      ".dmSymbol img{filter:drop-shadow(0 0 4px rgba(47,210,255,.3))}",

      /* Water pressure gauge */
      ".dmPressureGauge{position:absolute;top:-36px;right:16px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle,#0a1428,#06070d);border:2.5px solid rgba(47,210,255,.4);box-shadow:0 0 12px rgba(47,210,255,.2);display:flex;align-items:center;justify-content:center;z-index:2}",
      ".dmPressureNeedle{width:2px;height:18px;background:linear-gradient(0deg,#ff5e7a,#2fd2ff);border-radius:1px;transform-origin:bottom center;transition:transform .4s ease;position:absolute;bottom:50%}",
      ".dmPressureCenter{width:6px;height:6px;border-radius:50%;background:#2fd2ff;position:absolute;box-shadow:0 0 6px rgba(47,210,255,.6)}",
      ".dmPressureLabel{position:absolute;bottom:4px;font-size:.42rem;color:rgba(47,210,255,.7);letter-spacing:.04em}",
      ".dmPressureMarks{position:absolute;inset:4px;border-radius:50%}",

      /* Gear decorations */
      ".dmGearDecor{position:absolute;animation:dmGearSpin 4s linear infinite}",
      "@keyframes dmGearSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
      ".dmGearDecor.reverse{animation-direction:reverse}",

      /* Enhanced spin button — hydraulic lever style */
      ".dmSpinBtn{background:linear-gradient(135deg,#2fd2ff,#3d3dea,#f310ba)!important;font-size:1rem!important;font-weight:800!important;letter-spacing:.08em!important;padding:14px 32px!important;border-radius:14px!important;border:2px solid rgba(255,255,255,.2)!important;box-shadow:0 4px 20px rgba(47,210,255,.4),0 0 40px rgba(47,210,255,.1)!important;text-transform:uppercase!important;position:relative;overflow:hidden}",
      ".dmSpinBtn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent 50%);pointer-events:none}",
      ".dmSpinBtn:active{transform:scale(.96)!important;box-shadow:0 2px 10px rgba(47,210,255,.3)!important}",

      /* Water burst on win */
      ".dmWaterBurst{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5}",
      ".dmWaterDrop{position:absolute;width:4px;height:8px;border-radius:50%;background:rgba(47,210,255,.7);animation:dmWaterDropFall 1.2s ease-out forwards}",
      "@keyframes dmWaterDropFall{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx,0),var(--dy,80px))}}",

      /* Jackpot hydraulic burst */
      ".dmJackpotBurst{position:absolute;inset:-20%;border-radius:50%;background:radial-gradient(circle,rgba(255,215,106,.4),rgba(243,16,186,.2),transparent 70%);animation:dmJackpotPulse 1.5s ease-out;pointer-events:none;z-index:4}",
      "@keyframes dmJackpotPulse{0%{opacity:0;transform:scale(.5)}40%{opacity:1}100%{opacity:0;transform:scale(2)}}",

      /* Stats bar */
      ".dmStatsBar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:8px 0;padding:8px 12px;background:rgba(47,210,255,.06);border-radius:10px;border:1px solid rgba(47,210,255,.1)}",
      ".dmStat{text-align:center;padding:4px 10px}",
      ".dmStatLabel{font-size:.55rem;color:rgba(47,210,255,.6);letter-spacing:.06em;text-transform:uppercase}",
      ".dmStatValue{font-size:.82rem;font-weight:700;color:#fff}",

      /* Enhanced title area */
      ".dmTitle{font-size:1.1rem!important;font-weight:800!important;letter-spacing:.08em!important;background:linear-gradient(90deg,#2fd2ff,#f310ba,#2fd2ff)!important;background-size:200% 100%!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;animation:dmTitleShimmer 4s linear infinite!important}",
      "@keyframes dmTitleShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}",

      /* Plays counter enhancement */
      ".dmPlays{background:linear-gradient(135deg,rgba(47,210,255,.15),rgba(243,16,186,.1))!important;border:1.5px solid rgba(47,210,255,.25)!important;border-radius:10px!important;padding:6px 16px!important;font-weight:700!important;letter-spacing:.06em!important}",

      /* Result card enhancement */
      ".dmResult{background:linear-gradient(135deg,rgba(26,39,68,.95),rgba(6,7,13,.98))!important;border:2px solid rgba(47,210,255,.3)!important;border-radius:16px!important;padding:16px!important}",
      ".dmPrizeTitle{font-size:1.1rem!important;font-weight:800!important;color:#fff!important}",
      ".dmJackLine{font-size:1.4rem!important;font-weight:900!important;background:linear-gradient(90deg,#ffd76a,#ff9df2,#ffd76a)!important;background-size:200%!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;animation:dmTitleShimmer 2s linear infinite!important}",

      /* Industrial background texture */
      ".dmCard .dmInner{position:relative}",
      ".dmCard .dmInner::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(0deg,rgba(47,210,255,.02) 0px,transparent 1px,transparent 4px);z-index:0;border-radius:inherit}",
      ".dmCard .dmInner>*{position:relative;z-index:1}",

      /* Reduced motion */
      "@media (prefers-reduced-motion:reduce){.dmPipe::before,.dmGearDecor,.dmTitle,.dmJackLine,.dmPressureNeedle{animation:none!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* Create pressure gauge element */
  function createPressureGauge(){
    var gauge = document.createElement("div");
    gauge.className = "dmPressureGauge";
    gauge.id = "dmPressureGauge";
    gauge.innerHTML =
      '<div class="dmPressureNeedle" id="dmPressureNeedle"></div>' +
      '<div class="dmPressureCenter"></div>' +
      '<div class="dmPressureLabel">PSI</div>';
    return gauge;
  }

  /* Create gear decorations */
  function createGear(size, x, y, reverse){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("viewBox","0 0 40 40");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.style.cssText = "position:absolute;left:" + x + ";top:" + y + ";opacity:.3";
    svg.setAttribute("class", "dmGearDecor" + (reverse ? " reverse" : ""));
    svg.innerHTML = '<circle cx="20" cy="20" r="14" fill="none" stroke="rgba(47,210,255,.5)" stroke-width="2"/>' +
      '<circle cx="20" cy="20" r="5" fill="rgba(47,210,255,.3)"/>' +
      Array.from({length:8},function(_,i){
        var a = i * 45 * Math.PI / 180;
        var x1 = 20 + 12 * Math.cos(a), y1 = 20 + 12 * Math.sin(a);
        var x2 = 20 + 18 * Math.cos(a), y2 = 20 + 18 * Math.sin(a);
        return '<rect x="' + (x2-3) + '" y="' + (y2-3) + '" width="6" height="6" rx="1" fill="rgba(47,210,255,.4)" transform="rotate(' + (i*45) + ' ' + x2 + ' ' + y2 + ')"/>';
      }).join("");
    return svg;
  }

  /* Stats bar showing spin history */
  function createStatsBar(){
    var bar = document.createElement("div");
    bar.className = "dmStatsBar";
    bar.id = "dmStatsBar";
    return bar;
  }

  function updateStatsBar(){
    var bar = $("dmStatsBar");
    if(!bar) return;
    var s = window.state || {};
    bar.innerHTML = [
      { label:"SPINS", value: s.damMachineSpins || 0 },
      { label:"WINS", value: s.damMachineWins || 0 },
      { label:"JACKPOTS", value: s.damMachineJackpots || 0 },
      { label:"BEST", value: (s.damMachineBestReward || 0) + " FL OZ" }
    ].map(function(d){
      return '<div class="dmStat"><div class="dmStatLabel">' + d.label + '</div><div class="dmStatValue">' + d.value + '</div></div>';
    }).join("");
  }

  /* Water drop burst effect */
  function spawnWaterBurst(container, count){
    if(!container) return;
    var burst = document.createElement("div");
    burst.className = "dmWaterBurst";
    for(var i = 0; i < (count || 20); i++){
      var drop = document.createElement("div");
      drop.className = "dmWaterDrop";
      var angle = Math.random() * Math.PI * 2;
      var dist = 40 + Math.random() * 100;
      drop.style.left = "50%";
      drop.style.top = "50%";
      drop.style.setProperty("--dx", (Math.cos(angle) * dist) + "px");
      drop.style.setProperty("--dy", (Math.sin(angle) * dist) + "px");
      drop.style.animationDelay = (Math.random() * 0.3) + "s";
      burst.appendChild(drop);
    }
    container.appendChild(burst);
    setTimeout(function(){ if(burst.parentNode) burst.remove(); }, 1500);
  }

  /* Animate pressure gauge during spin */
  function animatePressure(spinning){
    var needle = $("dmPressureNeedle");
    if(!needle) return;
    if(spinning){
      var angle = -60 + Math.random() * 120;
      needle.style.transform = "rotate(" + angle + "deg)";
    } else {
      needle.style.transform = "rotate(0deg)";
    }
  }

  /* Enhance the DAM MACHINE */
  function enhanceDamMachine(){
    var card = $("damMachineCard");
    if(!card || card.dataset.gei666dm) return;
    card.dataset.gei666dm = "1";

    var inner = card.querySelector(".dmInner");
    if(!inner) return;

    /* Add pressure gauge to cabinet */
    var cabinet = inner.querySelector(".dmCabinet");
    if(cabinet && !$("dmPressureGauge")){
      cabinet.style.position = "relative";
      cabinet.appendChild(createPressureGauge());
    }

    /* Add gear decorations */
    if(cabinet){
      cabinet.appendChild(createGear(28, "-8px", "-8px", false));
      cabinet.appendChild(createGear(22, "calc(100% - 14px)", "calc(100% - 14px)", true));
    }

    /* Add stats bar before the spin button area */
    var autoControls = inner.querySelector(".dmAutoControls");
    if(autoControls && !$("dmStatsBar")){
      autoControls.parentNode.insertBefore(createStatsBar(), autoControls);
      updateStatsBar();
    }

    /* Update spin button text */
    var spinBtn = $("dmSpinBtn");
    if(spinBtn) spinBtn.textContent = "⚡ RELEASE THE FLOW ⚡";
  }

  /* Hook into spin events for animations */
  function hookSpinEvents(){
    var card = $("damMachineCard");
    if(!card) return;

    /* Watch for class changes on the card */
    var observer = new MutationObserver(function(){
      /* Update stats when result shows */
      if(card.classList.contains("hasResult")){
        updateStatsBar();
        animatePressure(false);
        /* Water burst on win */
        var inner = card.querySelector(".dmInner");
        if(inner) spawnWaterBurst(inner, 15);
      }
      if(card.classList.contains("show")){
        updateStatsBar();
        enhanceDamMachine();
      }
    });
    observer.observe(card, { attributes: true, attributeFilter: ["class"] });

    /* Hook the spin button for pressure animation */
    var spinBtn = $("dmSpinBtn");
    if(spinBtn && !spinBtn._gei666Hook){
      spinBtn._gei666Hook = true;
      spinBtn.addEventListener("click", function(){
        animatePressure(true);
        /* Oscillate during spin */
        var iv = setInterval(function(){
          animatePressure(true);
        }, 400);
        setTimeout(function(){ clearInterval(iv); }, 6000);
      });
    }
  }

  function init(){
    injectStyles();
    enhanceDamMachine();
    hookSpinEvents();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 1000);
  setTimeout(init, 3000);

  window.__GEI_V3000_DAM_MACHINE__ = {
    version: VERSION,
    updateStats: updateStatsBar,
    spawnWaterBurst: spawnWaterBurst,
    selfTest: function(){
      return {
        enhanced: !!($("damMachineCard") && $("damMachineCard").dataset.gei666dm),
        pressureGauge: !!$("dmPressureGauge"),
        statsBar: !!$("dmStatsBar"),
        stylesInjected: !!$("gei666DmStyle")
      };
    }
  };
})();
