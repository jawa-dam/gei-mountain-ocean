/* GEI 666 — INDUSTRIAL MILL ENVIRONMENTS v3000
   Eight distinct mill experiences that replace the generic waterwheel bonus.
   Each mill has its own visual environment, animated machinery, and reward presentation.
   Hooks into the existing bonus waterwheel system without replacing the prize logic. */
(function(){
  "use strict";
  if(window.__GEI_V3000_MILLS__) return;

  var VERSION = "V3000";
  function $(id){ return document.getElementById(id); }

  /* The eight mills, cycled based on completedLevels */
  var MILLS = [
    { id:"grist",  name:"GRIST MILL",  icon:"🌾", product:"FLOUR",  color:"#c8a060", accent:"#f0d090",
      desc:"Grain flows from mountain hoppers through grinding stones into fresh flour sacks." },
    { id:"rice",   name:"RICE MILL",   icon:"🍚", product:"RICE",   color:"#e8e0c0", accent:"#f8f4e0",
      desc:"Paddy husks split open as the wheel drives conveyors and separation drums." },
    { id:"saw",    name:"SAWMILL",     icon:"🪵", product:"LUMBER", color:"#8a6038", accent:"#c89060",
      desc:"Timber rides the carriage as spinning blades cut fresh planks from mountain logs." },
    { id:"paper",  name:"PAPER MILL",  icon:"📄", product:"PAPER",  color:"#e8e8e0", accent:"#f8f8f4",
      desc:"Pulp flows through rollers, presses, and drying racks into crisp sheets of paper." },
    { id:"cider",  name:"CIDER MILL",  icon:"🍎", product:"CIDER",  color:"#c84040", accent:"#f08060",
      desc:"Apples tumble into the crusher, juice flows through the press into oak barrels." },
    { id:"coffee", name:"COFFEE MILL", icon:"☕", product:"COFFEE", color:"#4a2a18", accent:"#8a5a30",
      desc:"Green beans roast in turning drums, then grind into rich aromatic coffee." },
    { id:"oil",    name:"OIL MILL",    icon:"🫒", product:"OIL",    color:"#6a8040", accent:"#a0c060",
      desc:"Crushing stones press olives through channels that fill glass containers with golden oil." },
    { id:"sugar",  name:"SUGAR MILL",  icon:"🍬", product:"SUGAR",  color:"#f0e0f0", accent:"#f8f0f8",
      desc:"Sugarcane feeds through rollers, juice flows into evaporators, crystals form." }
  ];

  function getMillForLevel(completedLevels){
    return MILLS[Math.max(0, (completedLevels - 1)) % MILLS.length];
  }

  function injectStyles(){
    if($("gei666MillStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666MillStyle";
    s.textContent = [
      /* Mill environment container */
      ".millEnv{position:relative;width:100%;min-height:200px;border-radius:18px;overflow:hidden;margin:0 auto 12px;background:var(--mill-bg,#1a2744)}",
      ".millEnv *{box-sizing:border-box}",

      /* Water channel at bottom */
      ".millWaterChannel{position:absolute;bottom:0;left:0;right:0;height:32px;background:linear-gradient(0deg,rgba(47,210,255,.7),rgba(47,210,255,.2));overflow:hidden}",
      ".millWaterFlow{position:absolute;bottom:0;left:-100%;width:300%;height:100%;background:repeating-linear-gradient(90deg,transparent,rgba(255,255,255,.15) 20px,transparent 40px);animation:millWaterScroll 2s linear infinite}",
      "@keyframes millWaterScroll{0%{transform:translateX(0)}100%{transform:translateX(33.33%)}}",

      /* Waterwheel */
      ".millWheelWrap{position:absolute;left:8%;bottom:20px;width:80px;height:80px}",
      ".millWheel{width:100%;height:100%;animation:millWheelSpin 4s linear infinite}",
      "@keyframes millWheelSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",

      /* Gear train connecting wheel to machinery */
      ".millGearTrain{position:absolute;top:50%;left:28%;width:16%;display:flex;align-items:center;gap:4px}",
      ".millGear{width:24px;height:24px;border-radius:50%;border:3px solid var(--mill-accent,#c89060);animation:millGearSpin 2s linear infinite}",
      ".millGear:nth-child(2){animation-direction:reverse;width:18px;height:18px}",
      "@keyframes millGearSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",

      /* Mill building */
      ".millBuilding{position:absolute;right:8%;top:12%;width:48%;height:70%;background:var(--mill-wall,rgba(140,120,100,.9));border-radius:6px 6px 0 0;border:2px solid rgba(255,255,255,.15)}",
      ".millRoof{position:absolute;top:-16px;left:-8%;width:116%;height:24px;background:var(--mill-roof,#8a3a2d);clip-path:polygon(0 100%,50% 0,100% 100%);border-radius:2px}",
      ".millWindow{position:absolute;width:20px;height:16px;background:var(--mill-light,#ffe9a8);border:1.5px solid rgba(0,0,0,.3);border-radius:2px}",
      ".millDoor{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:28px;height:36px;background:#2a170a;border-radius:4px 4px 0 0;border:1.5px solid rgba(0,0,0,.3)}",

      /* Machinery area inside building */
      ".millMachinery{position:absolute;top:20%;left:8%;right:8%;bottom:30%;overflow:hidden;border-radius:4px;background:rgba(0,0,0,.2)}",

      /* Product output */
      ".millProductArea{position:absolute;bottom:36px;right:4%;display:flex;gap:4px;align-items:flex-end}",
      ".millProduct{font-size:1.4rem;animation:millProductBob 2.5s ease-in-out infinite;animation-delay:var(--d,0s)}",
      "@keyframes millProductBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}",

      /* Mill name banner */
      ".millBanner{position:absolute;top:6px;left:50%;transform:translateX(-50%);padding:4px 14px;background:rgba(6,7,13,.75);border-radius:10px;color:#fff;font-size:.72rem;font-weight:700;letter-spacing:.08em;white-space:nowrap;text-transform:uppercase;backdrop-filter:blur(4px);border:1px solid rgba(47,210,255,.3)}",
      ".millBannerIcon{margin-right:4px}",

      /* Animated process elements */
      ".millConveyor{position:absolute;bottom:0;left:0;right:0;height:6px;background:rgba(100,80,60,.8);overflow:hidden}",
      ".millConveyorBelt{position:absolute;bottom:0;left:-50%;width:200%;height:100%;background:repeating-linear-gradient(90deg,rgba(0,0,0,.2) 0px,transparent 2px,transparent 8px,rgba(0,0,0,.2) 10px);animation:millConveyorMove 1.5s linear infinite}",
      "@keyframes millConveyorMove{0%{transform:translateX(0)}100%{transform:translateX(5px)}}",

      /* Water pipe from wheel to machinery */
      ".millPipe{position:absolute;left:26%;top:40%;width:18%;height:8px;background:linear-gradient(90deg,rgba(47,210,255,.4),rgba(47,210,255,.7));border-radius:4px;overflow:hidden}",
      ".millPipeFlow{position:absolute;inset:2px;border-radius:3px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.4) 6px,rgba(255,255,255,.2) 12px);animation:millPipeAnim 1s linear infinite}",
      "@keyframes millPipeAnim{0%{transform:translateX(0)}100%{transform:translateX(12px)}}",

      /* Specific mill machinery animations */
      ".millGrindStone{width:30px;height:30px;border-radius:50%;background:conic-gradient(#8a8a8a,#c0c0c0,#8a8a8a,#c0c0c0,#8a8a8a);border:2px solid #666;animation:millGrindSpin 1.5s linear infinite;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}",
      "@keyframes millGrindSpin{0%{transform:translate(-50%,-50%) rotate(0deg)}100%{transform:translate(-50%,-50%) rotate(360deg)}}",
      ".millSawBlade{width:28px;height:28px;border-radius:50%;background:conic-gradient(#c0c0c0 0deg,#808080 30deg,#c0c0c0 60deg,#808080 90deg,#c0c0c0 120deg,#808080 150deg,#c0c0c0 180deg,#808080 210deg,#c0c0c0 240deg,#808080 270deg,#c0c0c0 300deg,#808080 330deg);border:2px solid #aaa;animation:millSawSpin .6s linear infinite;position:absolute;top:50%;left:40%;transform:translate(-50%,-50%)}",
      "@keyframes millSawSpin{0%{transform:translate(-50%,-50%) rotate(0deg)}100%{transform:translate(-50%,-50%) rotate(360deg)}}",
      ".millRoller{width:40px;height:12px;border-radius:6px;background:linear-gradient(#999,#ccc,#999);border:1px solid #777;position:absolute;animation:millRollerSpin 2s linear infinite}",
      "@keyframes millRollerSpin{0%{box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}50%{box-shadow:inset 0 0 0 1px rgba(0,0,0,.4)}100%{box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}}",
      ".millPress{width:24px;height:40px;background:linear-gradient(#888,#aaa);border:1.5px solid #666;border-radius:2px;position:absolute;animation:millPressAnim 2s ease-in-out infinite}",
      "@keyframes millPressAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}",

      /* Hopper / input */
      ".millHopper{position:absolute;top:4px;right:20%;width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:20px solid var(--mill-accent,#c89060)}",
      ".millHopperFeed{position:absolute;top:22px;right:calc(20% + 12px);width:8px;overflow:hidden}",
      ".millFeedDot{width:4px;height:4px;border-radius:50%;background:var(--mill-accent,#c89060);margin:2px auto;animation:millFeedFall 1s linear infinite;animation-delay:var(--d,0s)}",
      "@keyframes millFeedFall{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(30px)}}",

      /* Steam / smoke effect from building */
      ".millSteam{position:absolute;top:-10px;right:20%;pointer-events:none}",
      ".millSteamPuff{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.4);position:absolute;animation:millSteamRise 3s ease-out infinite;animation-delay:var(--d,0s)}",
      "@keyframes millSteamRise{0%{opacity:.6;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx,5px),-40px) scale(2.5)}}",

      /* Reduced motion */
      "@media (prefers-reduced-motion:reduce){.millWheel,.millGear,.millGrindStone,.millSawBlade,.millRoller,.millPress,.millProduct,.millConveyorBelt,.millWaterFlow,.millPipeFlow,.millFeedDot,.millSteamPuff{animation:none!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* Shared SVG waterwheel */
  function svgWheel(){
    return '<svg viewBox="-50 -50 100 100" width="100%" height="100%">' +
      '<g fill="#7a4a26" stroke="#3d2412" stroke-width=".8">' +
      Array.from({length:12},function(_,i){
        return '<rect x="-4" y="-48" width="8" height="10" rx="1" transform="rotate(' + (i*30) + ')"/>';
      }).join("") +
      '</g>' +
      '<circle r="38" fill="none" stroke="#b97a4a" stroke-width="4.5"/>' +
      '<circle r="26" fill="none" stroke="#9c6538" stroke-width="2.5"/>' +
      Array.from({length:8},function(_,i){
        return '<line x1="0" y1="-7" x2="0" y2="-38" stroke="#8a5a32" stroke-width="2.8" stroke-linecap="round" transform="rotate(' + (i*45) + ')"/>';
      }).join("") +
      '<circle r="8" fill="#5a3519" stroke="#c89060" stroke-width="1.5"/>' +
      '<circle r="2.5" fill="#2a170a"/>' +
      '</svg>';
  }

  /* Build the specific machinery for each mill type */
  function buildMachineryContent(mill){
    switch(mill.id){
      case "grist":
        return '<div class="millGrindStone"></div>' +
          '<div style="position:absolute;bottom:4px;left:8px;font-size:.6rem;color:rgba(255,255,255,.7)">GRINDING</div>';
      case "rice":
        return '<div class="millRoller" style="top:30%;left:20%"></div>' +
          '<div class="millRoller" style="top:55%;left:35%"></div>' +
          '<div style="position:absolute;bottom:4px;left:8px;font-size:.6rem;color:rgba(255,255,255,.7)">HUSKING</div>';
      case "saw":
        return '<div class="millSawBlade"></div>' +
          '<div style="position:absolute;top:50%;left:60%;width:30px;height:6px;background:linear-gradient(#8a6038,#6a4020);border-radius:1px;transform:translateY(-50%);animation:sawLogMove 3s linear infinite"></div>' +
          '<style>@keyframes sawLogMove{0%{transform:translateY(-50%) translateX(20px)}100%{transform:translateY(-50%) translateX(-20px)}}</style>';
      case "paper":
        return '<div class="millRoller" style="top:25%;left:15%"></div>' +
          '<div class="millRoller" style="top:25%;left:55%"></div>' +
          '<div style="position:absolute;top:60%;left:10%;right:10%;height:2px;background:rgba(255,255,255,.5)"></div>' +
          '<div style="position:absolute;bottom:4px;left:8px;font-size:.6rem;color:rgba(255,255,255,.7)">PRESSING</div>';
      case "cider":
        return '<div class="millPress" style="left:30%;top:10%"></div>' +
          '<div style="position:absolute;bottom:0;left:20%;right:20%;height:8px;background:linear-gradient(rgba(200,100,40,.6),rgba(200,100,40,.3));border-radius:0 0 4px 4px"></div>' +
          '<div style="position:absolute;bottom:4px;left:8px;font-size:.6rem;color:rgba(255,255,255,.7)">PRESSING</div>';
      case "coffee":
        return '<div style="position:absolute;top:20%;left:20%;width:32px;height:32px;border-radius:50%;background:conic-gradient(#4a2a18,#6a4028,#4a2a18);border:2px solid #3a1a0a;animation:millGrindSpin 2s linear infinite"></div>' +
          '<div style="position:absolute;top:15%;right:15%;width:20px;height:28px;border-radius:50%;background:linear-gradient(#8a5a30,#6a4020);border:1.5px solid #4a2a10;animation:coffeeRoast 3s ease-in-out infinite"></div>' +
          '<style>@keyframes coffeeRoast{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}</style>';
      case "oil":
        return '<div class="millGrindStone" style="background:conic-gradient(#6a6a5a,#9a9a8a,#6a6a5a,#9a9a8a,#6a6a5a)"></div>' +
          '<div style="position:absolute;bottom:0;left:30%;right:20%;height:4px;background:linear-gradient(90deg,rgba(160,192,96,.6),rgba(160,192,96,.2));border-radius:2px"></div>';
      case "sugar":
        return '<div class="millRoller" style="top:30%;left:10%;width:50px"></div>' +
          '<div class="millRoller" style="top:48%;left:10%;width:50px"></div>' +
          '<div style="position:absolute;bottom:0;right:10%;width:20px;height:20px;background:rgba(240,224,240,.4);border-radius:2px;animation:sugarCrystal 2s ease-in-out infinite"></div>' +
          '<style>@keyframes sugarCrystal{0%,100%{opacity:.4}50%{opacity:.8}}</style>';
      default:
        return '<div class="millGrindStone"></div>';
    }
  }

  /* Products for each mill */
  function getProducts(mill){
    var products = {
      grist:  ["🌾","🌾","🫘","🌾"],
      rice:   ["🍚","🍚","🌾","🍚"],
      saw:    ["🪵","🪵","🪓","🪵"],
      paper:  ["📄","📃","📄","📜"],
      cider:  ["🍎","🍏","🍎","🍺"],
      coffee: ["☕","☕","🫘","☕"],
      oil:    ["🫒","🫒","🫒","🧴"],
      sugar:  ["🍬","🍬","🍰","🍬"]
    };
    return products[mill.id] || ["💧","💧","💧","💧"];
  }

  /* Build the full mill environment HTML */
  function buildMillEnvironment(mill){
    var products = getProducts(mill);
    var steamPuffs = Array.from({length:4},function(_,i){
      return '<div class="millSteamPuff" style="--d:' + (i*0.7) + 's;--dx:' + ((Math.random()-.5)*16) + 'px;left:' + (i*6) + 'px"></div>';
    }).join("");

    var feedDots = Array.from({length:4},function(_,i){
      return '<div class="millFeedDot" style="--d:' + (i*0.25) + 's"></div>';
    }).join("");

    var productEls = products.map(function(p,i){
      return '<span class="millProduct" style="--d:' + (i*0.4) + 's">' + p + '</span>';
    }).join("");

    return '<div class="millEnv" style="--mill-bg:linear-gradient(135deg,' + mill.color + '22,' + mill.accent + '11,#1a274488);--mill-accent:' + mill.accent + ';--mill-wall:' + mill.color + 'cc;--mill-roof:' + mill.color + '" data-mill="' + mill.id + '">' +
      '<div class="millBanner"><span class="millBannerIcon">' + mill.icon + '</span>' + mill.name + '</div>' +

      /* Water channel */
      '<div class="millWaterChannel"><div class="millWaterFlow"></div></div>' +

      /* Waterwheel */
      '<div class="millWheelWrap"><div class="millWheel">' + svgWheel() + '</div></div>' +

      /* Pipe from wheel to building */
      '<div class="millPipe"><div class="millPipeFlow"></div></div>' +

      /* Gear train */
      '<div class="millGearTrain"><div class="millGear"></div><div class="millGear"></div></div>' +

      /* Mill building */
      '<div class="millBuilding">' +
        '<div class="millRoof"></div>' +
        '<div class="millWindow" style="top:30%;left:14%"></div>' +
        '<div class="millWindow" style="top:30%;right:14%"></div>' +
        '<div class="millDoor"></div>' +
        '<div class="millMachinery">' + buildMachineryContent(mill) + '<div class="millConveyor"><div class="millConveyorBelt"></div></div></div>' +
        '<div class="millSteam">' + steamPuffs + '</div>' +
      '</div>' +

      /* Hopper / input */
      '<div class="millHopper"></div>' +
      '<div class="millHopperFeed">' + feedDots + '</div>' +

      /* Products */
      '<div class="millProductArea">' + productEls + '</div>' +
    '</div>';
  }

  /* Hook into the bonus waterwheel opening to inject the mill environment */
  var _origOpen = null;
  function hookBonusWheel(){
    var bonusCard = $("bonusCard");
    if(!bonusCard) return;

    /* Create a container for the mill scene above the wheel */
    var millContainer = document.createElement("div");
    millContainer.id = "millEnvContainer";
    millContainer.style.cssText = "width:100%;margin:0 auto";

    var inner = bonusCard.querySelector(".bonusInner");
    if(!inner) return;

    var wheelBox = inner.querySelector(".bwWheelBox");
    if(wheelBox && !$("millEnvContainer")){
      inner.insertBefore(millContainer, wheelBox);
    }

    /* Observe when bonusCard becomes visible */
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        if(m.type === "attributes" && m.attributeName === "class"){
          var container = $("millEnvContainer");
          if(!container) return;
          if(bonusCard.classList.contains("show") && !bonusCard.classList.contains("hasResult")){
            var completedLevels = 0;
            try { completedLevels = window.state ? window.state.completedLevels : 0; } catch(e){}
            var mill = getMillForLevel(completedLevels + 1);
            container.innerHTML = buildMillEnvironment(mill);

            /* Update title */
            var title = $("bwTitle");
            if(title) title.textContent = mill.icon + " " + mill.name + " WATERWHEEL";

            /* Update description */
            var eyebrow = bonusCard.querySelector(".bwEyebrow");
            if(eyebrow) eyebrow.textContent = mill.desc;
          }
        }
      });
    });
    observer.observe(bonusCard, { attributes: true, attributeFilter: ["class"] });
  }

  function init(){
    injectStyles();
    hookBonusWheel();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 1000);

  function getCurrentMill(){
    try {
      var cl = Math.max(0, Number(window.state && window.state.completedLevels) || 0);
      return getMillForLevel(cl);
    } catch(e){ return MILLS[0]; }
  }

  window.__GEI_V3000_MILLS__ = {
    version: VERSION,
    mills: MILLS,
    getMillForLevel: getMillForLevel,
    getCurrentMill: getCurrentMill,
    buildMillEnvironment: buildMillEnvironment,
    selfTest: function(){
      return {
        mills: MILLS.length,
        millIds: MILLS.map(function(m){ return m.id; }),
        containerExists: !!$("millEnvContainer"),
        stylesInjected: !!$("gei666MillStyle")
      };
    }
  };
})();
