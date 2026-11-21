/* GEI 666 — COLLECTIBLE MILL DESTINATIONS v3000
   Makes the 8 industrial mills into collectible destinations that players
   discover through bonus waterwheel spins. Each mill is a unique experience
   with its own product, machinery, and character.

   Persists collection to its own localStorage key (safe for existing saves).
   Never modifies the core game state, FL OZ, or progression. */
(function(){
  "use strict";
  if(window.__GEI_V3000_MILL_COLLECTION__) return;

  var VERSION = "V3000";
  var SAVE_KEY = "gei666.millCollection.v1";
  function $(id){ return document.getElementById(id); }

  var MILLS = [
    { id:"grist",  name:"GRIST MILL",  icon:"🌾", product:"Flour",  region:"Mountain Valley",  desc:"The oldest type of water mill, grinding grain between heavy millstones to produce flour. The rhythmic grinding has echoed through valleys for millennia.",  machinery:"Twin millstones", color:"#d4a574", accent:"#8B6914" },
    { id:"rice",   name:"RICE MILL",   icon:"🍚", product:"Rice",   region:"River Delta",       desc:"A huller that strips the tough husk from rice paddy, powered by the steady flow of delta waters. Each grain passes through stone rollers.",                machinery:"Dehusking rollers", color:"#f5f0e1", accent:"#a89f91" },
    { id:"saw",    name:"SAWMILL",     icon:"🪵", product:"Lumber", region:"Forest Edge",       desc:"The shriek of the water-powered saw blade turns raw timber into lumber. Log carriages feed trees through the spinning blade one by one.",                 machinery:"Reciprocating saw", color:"#8B4513", accent:"#654321" },
    { id:"paper",  name:"PAPER MILL",  icon:"📜", product:"Paper",  region:"Clear Creek",       desc:"Rags and wood pulp are beaten in a stamping mill, then spread on screens to dry. Pure, clear water is essential — that's why paper mills sit on the cleanest streams.",  machinery:"Stamping hammers", color:"#f5f5dc", accent:"#c4b896" },
    { id:"cider",  name:"CIDER MILL",  icon:"🍎", product:"Cider",  region:"Orchard Hills",     desc:"Apples tumble into the stone press, crushed by the weight of a granite wheel. Sweet juice flows into oak barrels below.",                                 machinery:"Screw press", color:"#c0392b", accent:"#922b21" },
    { id:"coffee", name:"COFFEE MILL", icon:"☕", product:"Coffee", region:"Trading Port",      desc:"Green coffee beans from distant shores are roasted and ground by water-powered burr grinders. The aroma fills the entire port.",                           machinery:"Burr grinder", color:"#4a2c2a", accent:"#2c1810" },
    { id:"oil",    name:"OIL MILL",    icon:"🛢️", product:"Oil",    region:"Olive Groves",      desc:"Seeds and olives are crushed under massive stone wheels, then pressed through woven mats to extract precious oils. The golden liquid drips slowly into clay urns.", machinery:"Edge runner stones", color:"#b8a042", accent:"#8B7D3C" },
    { id:"sugar",  name:"SUGAR MILL",  icon:"🍬", product:"Sugar",  region:"Tropical River",    desc:"Sugarcane stalks pass through iron rollers, water-powered to squeeze every drop of sweet juice. The juice is boiled in copper kettles until crystals form.", machinery:"Triple rollers", color:"#e8d5b7", accent:"#c4956a" }
  ];

  var collection = { discovered: [], firstVisit: {}, visitCount: {}, lastVisit: null };

  function loadCollection(){
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if(!raw) return;
      var d = JSON.parse(raw);
      if(d && typeof d === "object"){
        collection.discovered = Array.isArray(d.discovered) ? d.discovered.filter(function(id){ return MILLS.some(function(m){ return m.id === id; }); }) : [];
        collection.firstVisit = (d.firstVisit && typeof d.firstVisit === "object") ? d.firstVisit : {};
        collection.visitCount = (d.visitCount && typeof d.visitCount === "object") ? d.visitCount : {};
        collection.lastVisit = typeof d.lastVisit === "string" ? d.lastVisit : null;
      }
    } catch(e){}
  }

  function saveCollection(){
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(collection)); }
    catch(e){}
  }

  function discoverMill(millId){
    var mill = MILLS.find(function(m){ return m.id === millId; });
    if(!mill) return false;

    var isNew = collection.discovered.indexOf(millId) === -1;
    if(isNew) collection.discovered.push(millId);

    collection.visitCount[millId] = (collection.visitCount[millId] || 0) + 1;
    collection.lastVisit = millId;
    if(!collection.firstVisit[millId]) collection.firstVisit[millId] = Date.now();

    saveCollection();
    return isNew;
  }

  function getProgress(){
    return {
      discovered: collection.discovered.length,
      total: MILLS.length,
      percent: Math.round((collection.discovered.length / MILLS.length) * 100),
      complete: collection.discovered.length >= MILLS.length
    };
  }

  function injectStyles(){
    if($("gei666MillCollStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666MillCollStyle";
    s.textContent = [
      /* Collection panel */
      ".millCollPanel{position:fixed;inset:0;z-index:9500;background:rgba(6,7,13,.92);backdrop-filter:blur(12px);opacity:0;pointer-events:none;transition:opacity .3s ease;overflow-y:auto;-webkit-overflow-scrolling:touch}",
      ".millCollPanel.show{opacity:1;pointer-events:auto}",
      ".millCollInner{max-width:420px;margin:0 auto;padding:16px 16px 32px}",
      ".millCollClose{position:sticky;top:8px;float:right;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(47,210,255,.3);background:rgba(6,7,13,.8);color:#fff;font-size:1.1rem;cursor:pointer;z-index:2;display:flex;align-items:center;justify-content:center;touch-action:manipulation}",
      ".millCollClose:active{transform:scale(.9)}",

      /* Header */
      ".millCollHeader{text-align:center;padding:20px 0 12px}",
      ".millCollTitle{font-size:1.1rem;font-weight:800;color:#fff;letter-spacing:.08em}",
      ".millCollSubtitle{font-size:.65rem;color:rgba(47,210,255,.7);letter-spacing:.05em;margin-top:4px}",

      /* Progress bar */
      ".millCollProgress{display:flex;align-items:center;gap:8px;padding:10px 14px;background:rgba(26,39,68,.4);border-radius:12px;margin:12px 0 16px;border:1px solid rgba(47,210,255,.15)}",
      ".millCollProgressBar{flex:1;height:8px;border-radius:4px;background:rgba(47,210,255,.1);overflow:hidden}",
      ".millCollProgressFill{height:100%;border-radius:4px;background:linear-gradient(90deg,#2fd2ff,#f310ba);transition:width .6s ease}",
      ".millCollProgressText{font-size:.7rem;font-weight:700;color:#2fd2ff;white-space:nowrap}",

      /* Mill grid */
      ".millCollGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}",

      /* Mill card */
      ".millCollCard{background:rgba(26,39,68,.3);border:1.5px solid rgba(47,210,255,.1);border-radius:14px;padding:14px 12px;text-align:center;transition:all .4s ease;position:relative;overflow:hidden}",
      ".millCollCard.discovered{background:linear-gradient(135deg,rgba(26,39,68,.5),rgba(47,210,255,.06));border-color:rgba(47,210,255,.25)}",
      ".millCollCard.discovered:active{transform:scale(.97)}",
      ".millCollCard.undiscovered{opacity:.5}",

      /* Card content */
      ".millCollIcon{font-size:2rem;margin-bottom:6px;filter:grayscale(1) opacity(.3);transition:filter .4s}",
      ".millCollCard.discovered .millCollIcon{filter:none}",
      ".millCollName{font-size:.7rem;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.05em;transition:color .4s}",
      ".millCollCard.discovered .millCollName{color:#fff}",
      ".millCollProduct{font-size:.55rem;color:rgba(47,210,255,.3);margin-top:2px;transition:color .4s}",
      ".millCollCard.discovered .millCollProduct{color:rgba(47,210,255,.7)}",
      ".millCollRegion{font-size:.5rem;color:rgba(255,255,255,.2);margin-top:4px;font-style:italic;transition:color .4s}",
      ".millCollCard.discovered .millCollRegion{color:rgba(255,255,255,.45)}",
      ".millCollVisits{font-size:.5rem;color:rgba(47,210,255,.4);margin-top:4px}",
      ".millCollLock{font-size:1.5rem;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(6,7,13,.3)}",

      /* Completion banner */
      ".millCollComplete{text-align:center;padding:16px;margin-top:16px;background:linear-gradient(135deg,rgba(255,215,106,.1),rgba(243,16,186,.08));border:2px solid rgba(255,215,106,.3);border-radius:16px}",
      ".millCollCompleteIcon{font-size:2rem;margin-bottom:4px}",
      ".millCollCompleteTitle{font-size:.9rem;font-weight:800;color:#ffd76a;letter-spacing:.06em}",
      ".millCollCompleteSub{font-size:.65rem;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.4}",

      /* Detail overlay */
      ".millCollDetail{position:fixed;inset:0;z-index:9600;background:rgba(6,7,13,.9);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s ease}",
      ".millCollDetail.show{opacity:1;pointer-events:auto}",
      ".millCollDetailCard{max-width:360px;width:90%;background:linear-gradient(170deg,rgba(26,39,68,.95),rgba(6,7,13,.98));border:2px solid rgba(47,210,255,.3);border-radius:22px;padding:24px 20px;text-align:center;position:relative}",
      ".millCollDetailClose{position:absolute;top:12px;right:12px;width:28px;height:28px;border-radius:50%;border:1px solid rgba(47,210,255,.2);background:rgba(6,7,13,.5);color:#fff;font-size:.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center}",
      ".millCollDetailIcon{font-size:3rem;margin-bottom:8px}",
      ".millCollDetailName{font-size:1.1rem;font-weight:800;color:#fff;letter-spacing:.06em;margin-bottom:4px}",
      ".millCollDetailRegion{font-size:.65rem;color:rgba(47,210,255,.7);font-style:italic;margin-bottom:12px}",
      ".millCollDetailDesc{font-size:.75rem;color:rgba(255,255,255,.75);line-height:1.6;margin-bottom:14px;text-align:left}",
      ".millCollDetailMeta{display:flex;justify-content:center;gap:16px;padding:10px;background:rgba(47,210,255,.06);border-radius:10px;border:1px solid rgba(47,210,255,.1)}",
      ".millCollDetailStat{text-align:center}",
      ".millCollDetailStatLabel{font-size:.5rem;color:rgba(47,210,255,.6);letter-spacing:.06em;text-transform:uppercase}",
      ".millCollDetailStatValue{font-size:.8rem;font-weight:700;color:#fff;margin-top:2px}",

      /* Toolbar badge */
      ".millCollBadge{position:absolute;top:2px;right:2px;min-width:14px;height:14px;border-radius:7px;background:linear-gradient(135deg,#f310ba,#2fd2ff);color:#fff;font-size:.45rem;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 3px;pointer-events:none}",

      /* New discovery toast */
      ".millDiscoveryToast{position:fixed;top:60px;left:50%;transform:translateX(-50%) translateY(-20px);z-index:9800;background:linear-gradient(135deg,rgba(6,7,13,.95),rgba(26,39,68,.92));border:2px solid rgba(47,210,255,.4);border-radius:16px;padding:12px 20px;text-align:center;opacity:0;pointer-events:none;transition:opacity .4s ease,transform .4s ease;box-shadow:0 4px 24px rgba(47,210,255,.2)}",
      ".millDiscoveryToast.show{opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto}",
      ".millDiscoveryToastIcon{font-size:1.5rem}",
      ".millDiscoveryToastTitle{font-size:.7rem;font-weight:700;color:#2fd2ff;letter-spacing:.06em;margin-top:2px}",
      ".millDiscoveryToastName{font-size:.85rem;font-weight:800;color:#fff;margin-top:2px}",

      /* Reduced motion */
      "@media (prefers-reduced-motion:reduce){.millCollPanel,.millCollDetail,.millDiscoveryToast{transition:none!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* ---- UI: Collection panel ---- */
  var panelEl = null;
  var detailEl = null;

  function ensurePanel(){
    if(panelEl) return panelEl;
    panelEl = document.createElement("div");
    panelEl.className = "millCollPanel";
    panelEl.id = "millCollPanel";
    panelEl.innerHTML = '<div class="millCollInner" id="millCollInner"></div>';
    document.body.appendChild(panelEl);
    return panelEl;
  }

  function ensureDetail(){
    if(detailEl) return detailEl;
    detailEl = document.createElement("div");
    detailEl.className = "millCollDetail";
    detailEl.id = "millCollDetail";
    detailEl.addEventListener("click", function(e){ if(e.target === detailEl) closeDetail(); });
    document.body.appendChild(detailEl);
    return detailEl;
  }

  function openCollection(){
    var panel = ensurePanel();
    var inner = $("millCollInner");
    var prog = getProgress();

    var html = '<button class="millCollClose" id="millCollCloseBtn" type="button" aria-label="Close">✕</button>';
    html += '<div class="millCollHeader">';
    html += '<div class="millCollTitle">MILL COLLECTION</div>';
    html += '<div class="millCollSubtitle">DISCOVER ALL 8 INDUSTRIAL DESTINATIONS</div>';
    html += '</div>';

    html += '<div class="millCollProgress">';
    html += '<div class="millCollProgressBar"><div class="millCollProgressFill" style="width:' + prog.percent + '%"></div></div>';
    html += '<div class="millCollProgressText">' + prog.discovered + ' / ' + prog.total + '</div>';
    html += '</div>';

    html += '<div class="millCollGrid">';
    for(var i = 0; i < MILLS.length; i++){
      var mill = MILLS[i];
      var found = collection.discovered.indexOf(mill.id) !== -1;
      var visits = collection.visitCount[mill.id] || 0;
      html += '<div class="millCollCard ' + (found ? 'discovered' : 'undiscovered') + '" data-mill="' + mill.id + '">';
      if(found){
        html += '<div class="millCollIcon">' + mill.icon + '</div>';
        html += '<div class="millCollName">' + mill.name + '</div>';
        html += '<div class="millCollProduct">Produces: ' + mill.product + '</div>';
        html += '<div class="millCollRegion">' + mill.region + '</div>';
        html += '<div class="millCollVisits">Visited ' + visits + 'x</div>';
      } else {
        html += '<div class="millCollIcon">❓</div>';
        html += '<div class="millCollName">???</div>';
        html += '<div class="millCollProduct">Undiscovered</div>';
        html += '<div class="millCollLock">🔒</div>';
      }
      html += '</div>';
    }
    html += '</div>';

    if(prog.complete){
      html += '<div class="millCollComplete">';
      html += '<div class="millCollCompleteIcon">🏆</div>';
      html += '<div class="millCollCompleteTitle">ALL MILLS DISCOVERED!</div>';
      html += '<div class="millCollCompleteSub">You have visited every industrial destination on the mountain-to-ocean journey. Master hydraulic engineer!</div>';
      html += '</div>';
    }

    inner.innerHTML = html;

    $("millCollCloseBtn").addEventListener("click", closeCollection);

    var cards = inner.querySelectorAll(".millCollCard.discovered");
    for(var j = 0; j < cards.length; j++){
      cards[j].addEventListener("click", function(){
        openDetail(this.dataset.mill);
      });
    }

    panel.classList.add("show");
  }

  function closeCollection(){
    if(panelEl) panelEl.classList.remove("show");
  }

  function openDetail(millId){
    var mill = MILLS.find(function(m){ return m.id === millId; });
    if(!mill) return;
    var detail = ensureDetail();
    var visits = collection.visitCount[millId] || 0;
    var firstDate = collection.firstVisit[millId] ? new Date(collection.firstVisit[millId]).toLocaleDateString() : "—";

    detail.innerHTML = '<div class="millCollDetailCard">' +
      '<button class="millCollDetailClose" id="millCollDetailCloseBtn" type="button">✕</button>' +
      '<div class="millCollDetailIcon">' + mill.icon + '</div>' +
      '<div class="millCollDetailName">' + mill.name + '</div>' +
      '<div class="millCollDetailRegion">' + mill.region + '</div>' +
      '<div class="millCollDetailDesc">' + mill.desc + '</div>' +
      '<div class="millCollDetailMeta">' +
        '<div class="millCollDetailStat"><div class="millCollDetailStatLabel">MACHINERY</div><div class="millCollDetailStatValue">' + mill.machinery + '</div></div>' +
        '<div class="millCollDetailStat"><div class="millCollDetailStatLabel">VISITS</div><div class="millCollDetailStatValue">' + visits + '</div></div>' +
        '<div class="millCollDetailStat"><div class="millCollDetailStatLabel">DISCOVERED</div><div class="millCollDetailStatValue">' + firstDate + '</div></div>' +
      '</div>' +
      '</div>';

    $("millCollDetailCloseBtn").addEventListener("click", closeDetail);
    detail.classList.add("show");
  }

  function closeDetail(){
    if(detailEl) detailEl.classList.remove("show");
  }

  /* ---- Discovery toast ---- */
  var toastEl = null;
  var toastTimer = null;

  function showDiscoveryToast(mill){
    if(!toastEl){
      toastEl = document.createElement("div");
      toastEl.className = "millDiscoveryToast";
      toastEl.id = "millDiscoveryToast";
      document.body.appendChild(toastEl);
    }

    toastEl.innerHTML =
      '<div class="millDiscoveryToastIcon">' + mill.icon + '</div>' +
      '<div class="millDiscoveryToastTitle">NEW MILL DISCOVERED!</div>' +
      '<div class="millDiscoveryToastName">' + mill.name + '</div>';

    clearTimeout(toastTimer);
    toastEl.classList.add("show");
    toastTimer = setTimeout(function(){ toastEl.classList.remove("show"); }, 4000);
  }

  /* ---- Hook into bonus waterwheel to discover mills ---- */
  function hookBonusWheel(){
    var bonusCard = $("bonusCard");
    if(!bonusCard || bonusCard._gei666MillCollHook) return;
    bonusCard._gei666MillCollHook = true;

    var obs = new MutationObserver(function(){
      if(bonusCard.classList.contains("spinning") || bonusCard.classList.contains("show")){
        var millsModule = window.__GEI_V3000_MILLS__;
        if(millsModule && typeof millsModule.getCurrentMill === "function"){
          var currentMill = millsModule.getCurrentMill();
          if(currentMill && currentMill.id){
            var isNew = discoverMill(currentMill.id);
            if(isNew){
              var millData = MILLS.find(function(m){ return m.id === currentMill.id; });
              if(millData) showDiscoveryToast(millData);
              updateBadge();
            }
          }
        }
      }
    });
    obs.observe(bonusCard, { attributes: true, attributeFilter: ["class"] });
  }

  /* ---- Add collection button to toolbar ---- */
  function addToolbarButton(){
    var toolbar = $("tapToolbar");
    if(!toolbar || $("tbMillCollection")) return;

    var tbArcade = $("tbArcade");
    if(!tbArcade) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tapToolbarBtn";
    btn.id = "tbMillCollection";
    btn.style.position = "relative";
    btn.innerHTML = '<span class="tapToolbarIcon" aria-hidden="true">🏭</span><span class="tapToolbarLabel">Mills</span>';
    btn.addEventListener("click", function(){
      openCollection();
    });

    tbArcade.parentNode.insertBefore(btn, tbArcade);
    updateBadge();
  }

  function updateBadge(){
    var btn = $("tbMillCollection");
    if(!btn) return;
    var existing = btn.querySelector(".millCollBadge");
    if(existing) existing.remove();

    var prog = getProgress();
    if(prog.discovered > 0 && !prog.complete){
      var badge = document.createElement("span");
      badge.className = "millCollBadge";
      badge.textContent = prog.discovered + "/" + prog.total;
      btn.appendChild(badge);
    } else if(prog.complete){
      var badge2 = document.createElement("span");
      badge2.className = "millCollBadge";
      badge2.textContent = "✓";
      btn.appendChild(badge2);
    }
  }

  function init(){
    loadCollection();
    injectStyles();
    addToolbarButton();
    hookBonusWheel();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 2000);
  setTimeout(init, 5000);

  window.__GEI_V3000_MILL_COLLECTION__ = {
    version: VERSION,
    mills: MILLS,
    discover: discoverMill,
    getProgress: getProgress,
    open: openCollection,
    close: closeCollection,
    selfTest: function(){
      return {
        discovered: collection.discovered.slice(),
        progress: getProgress(),
        panelExists: !!panelEl,
        toolbarButton: !!$("tbMillCollection"),
        bonusHooked: !!($("bonusCard") && $("bonusCard")._gei666MillCollHook),
        stylesInjected: !!$("gei666MillCollStyle")
      };
    }
  };
})();
