/* V2.5.00 — DAM BUILDER: WATER-THEMED LOADING EXPERIENCE 💧🦫
 *
 * Replaces the plain spinner + "BUILDING THE HYDRAULIC WORLD…" with a playful,
 * animated water scene: miniature mountain, flowing stream, filling reservoir,
 * spinning waterwheel, beaver mascot, rotating "ite" messages, and a water gauge.
 *
 * Integration: DamBuilderLoading.create(container) → { el, destroy, setReady }
 *   - container: parent element (the .dbStage)
 *   - el: the loading overlay element
 *   - destroy(): stops all timers and animations, removes the element
 *   - setReady(): triggers the "ready" celebration and resolves when the
 *     transition-out animation completes (or immediately if reduced-motion)
 */
(function () {
  "use strict";
  if (window.DamBuilderLoading) return;

  var C = {
    cyan: "#2fd2ff", indigo: "#3d3dea", magenta: "#f310ba",
    pink: "#ff9df2", ink: "#06070d", sky1: "#10163f", sky2: "#0a0e2c"
  };

  var MESSAGES = [
    "HEY, DAM-ITE! THE WATER’S ON ITS WAY! 💧",
    "The ites are getting their flow together!",
    "Hold your dam! We’re building something awesome!",
    "Every drop has a job, and every ite has a mission!",
    "Filling the reservoir… no drop left behind!",
    "Get those wheels turning, DAM-ITE!",
    "The flow is growing… your Builder is almost ready!",
    "Your hydraulic world is getting its splash together!",
    "The beaver’s checking the pipes. Carry on, DAM-ITE!"
  ];

  var TIPS = [
    { icon: "⛰️", name: "SOURCE", tip: "Every great flow starts somewhere." },
    { icon: "🧱", name: "DAM WALL", tip: "Control the water. Build your world." },
    { icon: "🌊", name: "RESERVOIR", tip: "Store the flow for what’s coming next." },
    { icon: "🚪", name: "SLUICE", tip: "Release the water when the system is ready." },
    { icon: "⚙️", name: "WHEEL", tip: "Put moving water to work." },
    { icon: "🏭", name: "FACTORY", tip: "Turn the flow into a working system." }
  ];

  var LONG_WAIT_MSG = "THE BEAVER’S CHECKING THE PIPES… THANKS FOR HANGING IN THERE, DAM-ITE!";
  var READY_MSG = "DAM! LOOK AT THAT FLOW!";
  var SIGNATURE = "DON’T GO WITH THE FLOW… BUILD IT, DAM-ITE!";

  function reduced() {
    try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }

  function pickRandom(arr, exclude) {
    if (arr.length <= 1) return arr[0] || "";
    var idx;
    do { idx = Math.floor(Math.random() * arr.length); } while (arr[idx] === exclude && arr.length > 1);
    return arr[idx];
  }

  function create() {
    var destroyed = false;
    var timers = [];
    var rafs = [];
    var startTime = Date.now();
    var isReady = false;
    var stage = 0; // 0=welcome, 1=flowing, 2=hydraulic, 3=ready
    var lastMsg = "";
    var longWaitShown = false;

    function addTimer(fn, ms) {
      var id = setInterval(fn, ms);
      timers.push(id);
      return id;
    }
    function addTimeout(fn, ms) {
      var id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    }
    function addRaf(fn) {
      var id;
      function loop(ts) {
        if (destroyed) return;
        fn(ts);
        id = requestAnimationFrame(loop);
        rafs.push(id);
      }
      id = requestAnimationFrame(loop);
      rafs.push(id);
    }

    // Build the DOM
    var el = document.createElement("div");
    el.className = "dblOverlay";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Loading DAM BUILDER");

    el.innerHTML =
      '<div class="dblScene">' +
        // SVG scene: mountain, stream, dam, reservoir, waterwheel
        '<svg class="dblSvg" viewBox="0 0 360 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
          '<defs>' +
            '<linearGradient id="dblSky" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0%" stop-color="#10163f"/>' +
              '<stop offset="100%" stop-color="#06070d"/>' +
            '</linearGradient>' +
            '<linearGradient id="dblWater" x1="0" y1="0" x2="1" y2="0">' +
              '<stop offset="0%" stop-color="#3d3dea"/>' +
              '<stop offset="100%" stop-color="#2fd2ff"/>' +
            '</linearGradient>' +
            '<linearGradient id="dblResFill" x1="0" y1="1" x2="0" y2="0">' +
              '<stop offset="0%" stop-color="#3d3dea"/>' +
              '<stop offset="100%" stop-color="rgba(47,210,255,0.6)"/>' +
            '</linearGradient>' +
          '</defs>' +
          // Sky
          '<rect width="360" height="200" fill="url(#dblSky)"/>' +
          // Stars
          '<g class="dblStars">' +
            '<circle cx="30" cy="15" r="1" fill="#fff" opacity=".6"/>' +
            '<circle cx="85" cy="28" r=".8" fill="#fff" opacity=".4"/>' +
            '<circle cx="140" cy="10" r="1.2" fill="#fff" opacity=".5"/>' +
            '<circle cx="210" cy="22" r=".7" fill="#fff" opacity=".3"/>' +
            '<circle cx="280" cy="8" r="1" fill="#fff" opacity=".5"/>' +
            '<circle cx="320" cy="30" r=".9" fill="#fff" opacity=".4"/>' +
            '<circle cx="55" cy="38" r=".6" fill="#fff" opacity=".3"/>' +
            '<circle cx="250" cy="35" r=".8" fill="#fff" opacity=".4"/>' +
          '</g>' +
          // Mountain
          '<polygon class="dblMountain" points="40,160 100,50 160,160" fill="#1a2150"/>' +
          '<polygon points="80,90 100,50 120,90" fill="#2a3580" opacity=".5"/>' +
          // Snow cap
          '<polygon points="92,65 100,50 108,65" fill="#eaf8ff" opacity=".8"/>' +
          // Stream path from mountain to dam
          '<path class="dblStream" d="M110,110 C130,115 150,130 170,140 S200,148 220,150" fill="none" stroke="url(#dblWater)" stroke-width="3" stroke-linecap="round"/>' +
          // Stream droplets (animated along path)
          '<g class="dblDroplets">' +
            '<circle class="dblDrop dblDrop1" cx="120" cy="112" r="2.5" fill="#2fd2ff" opacity=".8"/>' +
            '<circle class="dblDrop dblDrop2" cx="145" cy="125" r="2" fill="#2fd2ff" opacity=".7"/>' +
            '<circle class="dblDrop dblDrop3" cx="170" cy="138" r="2.5" fill="#2fd2ff" opacity=".8"/>' +
            '<circle class="dblDrop dblDrop4" cx="195" cy="145" r="2" fill="#2fd2ff" opacity=".6"/>' +
          '</g>' +
          // Dam wall
          '<rect class="dblDam" x="218" y="130" width="12" height="40" rx="2" fill="#3d3dea"/>' +
          '<rect x="220" y="132" width="8" height="36" rx="1" fill="#2a2ac0" opacity=".6"/>' +
          // Reservoir (behind dam)
          '<rect class="dblReservoir" x="160" y="150" width="58" height="20" fill="url(#dblResFill)" opacity=".7" rx="2"/>' +
          // Water flowing out of dam
          '<path class="dblOutflow" d="M230,155 C245,155 255,158 270,160" fill="none" stroke="#2fd2ff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>' +
          // Waterwheel
          '<g class="dblWheel" transform="translate(280,152)">' +
            '<circle r="18" fill="none" stroke="#ff9df2" stroke-width="2" opacity=".6"/>' +
            '<circle r="3" fill="#ff9df2" opacity=".8"/>' +
            '<line x1="0" y1="-18" x2="0" y2="18" stroke="#ff9df2" stroke-width="1.5" opacity=".5"/>' +
            '<line x1="-18" y1="0" x2="18" y2="0" stroke="#ff9df2" stroke-width="1.5" opacity=".5"/>' +
            '<line x1="-12.7" y1="-12.7" x2="12.7" y2="12.7" stroke="#ff9df2" stroke-width="1.5" opacity=".5"/>' +
            '<line x1="12.7" y1="-12.7" x2="-12.7" y2="12.7" stroke="#ff9df2" stroke-width="1.5" opacity=".5"/>' +
            // Paddles
            '<rect x="-3" y="-20" width="6" height="6" rx="1" fill="#f310ba" opacity=".7"/>' +
            '<rect x="-3" y="14" width="6" height="6" rx="1" fill="#f310ba" opacity=".7"/>' +
            '<rect x="-20" y="-3" width="6" height="6" rx="1" fill="#f310ba" opacity=".7"/>' +
            '<rect x="14" y="-3" width="6" height="6" rx="1" fill="#f310ba" opacity=".7"/>' +
          '</g>' +
          // Bubbles
          '<g class="dblBubbles">' +
            '<circle class="dblBubble dblB1" cx="235" cy="158" r="1.5" fill="#2fd2ff" opacity="0"/>' +
            '<circle class="dblBubble dblB2" cx="240" cy="160" r="1" fill="#2fd2ff" opacity="0"/>' +
            '<circle class="dblBubble dblB3" cx="270" cy="155" r="1.2" fill="#2fd2ff" opacity="0"/>' +
          '</g>' +
          // Ground
          '<rect x="0" y="170" width="360" height="30" fill="#0a0e2c"/>' +
          '<rect x="0" y="170" width="360" height="2" fill="#1a2150"/>' +
        '</svg>' +
      '</div>' +
      // Beaver
      '<div class="dblBeaver" aria-hidden="true">' +
        '<span class="dblBeaverEmoji">🦫</span>' +
      '</div>' +
      // Text area
      '<div class="dblText">' +
        '<h2 class="dblTitle">YALLTOO PRESENTS</h2>' +
        '<h3 class="dblSub">THE DAM BUILDER</h3>' +
        '<p class="dblStatus">💧 THE ITES ARE GETTING THE FLOW READY!</p>' +
        '<p class="dblMsg"></p>' +
      '</div>' +
      // Water gauge
      '<div class="dblGauge" role="progressbar" aria-valuetext="Loading">' +
        '<div class="dblGaugeTrack">' +
          '<div class="dblGaugeFill"></div>' +
          '<div class="dblGaugeDrops">' +
            '<span class="dblGD dblGD1">💧</span>' +
            '<span class="dblGD dblGD2">💧</span>' +
            '<span class="dblGD dblGD3">💧</span>' +
          '</div>' +
        '</div>' +
        '<small class="dblGaugeLabel">PREPARING YOUR HYDRAULIC WORLD</small>' +
      '</div>' +
      // Tip area
      '<div class="dblTip"></div>' +
      // Signature
      '<p class="dblSig">' + SIGNATURE + '</p>';

    // Query sub-elements
    var msgEl = el.querySelector(".dblMsg");
    var statusEl = el.querySelector(".dblStatus");
    var tipEl = el.querySelector(".dblTip");
    var beaverEl = el.querySelector(".dblBeaver");
    var wheelEl = el.querySelector(".dblWheel");
    var reservoirEl = el.querySelector(".dblReservoir");
    var gaugeLabel = el.querySelector(".dblGaugeLabel");

    // Message rotation
    function rotateMessage() {
      if (destroyed || isReady) return;
      var elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 8 && !longWaitShown) {
        longWaitShown = true;
        statusEl.textContent = LONG_WAIT_MSG;
        beaverEl.classList.add("dblBeaverInspect");
      }
      var msg = pickRandom(MESSAGES, lastMsg);
      lastMsg = msg;
      msgEl.style.opacity = "0";
      addTimeout(function () {
        if (destroyed || isReady) return;
        msgEl.textContent = msg;
        msgEl.style.opacity = "1";
      }, 300);
    }

    // Tip rotation
    var lastTip = "";
    function rotateTip() {
      if (destroyed || isReady) return;
      var tip = pickRandom(TIPS, lastTip);
      lastTip = tip;
      tipEl.style.opacity = "0";
      addTimeout(function () {
        if (destroyed || isReady) return;
        tipEl.innerHTML = '<span class="dblTipIcon">' + tip.icon + '</span> <b>' + tip.name + ':</b> ' + tip.tip;
        tipEl.style.opacity = "1";
      }, 300);
    }

    // Animate reservoir filling (visual only, no fake progress)
    var resHeight = 5;
    function animateReservoir() {
      if (destroyed || !reservoirEl) return;
      if (isReady) {
        resHeight = 20;
      } else {
        resHeight = Math.min(18, resHeight + 0.15);
      }
      reservoirEl.setAttribute("height", String(Math.round(resHeight)));
      reservoirEl.setAttribute("y", String(170 - Math.round(resHeight)));
    }

    // Stage progression (visual storytelling, not fake milestones)
    function advanceStage() {
      if (destroyed || isReady) return;
      var elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 3 && stage < 2) {
        stage = 2;
        el.classList.add("dblStageB");
        gaugeLabel.textContent = "WATER FLOWING THROUGH THE SYSTEM";
      }
      if (elapsed > 1.2 && stage < 1) {
        stage = 1;
        el.classList.add("dblStageA");
        gaugeLabel.textContent = "STREAM IS FLOWING";
      }
    }

    // Beaver states
    function updateBeaver() {
      if (destroyed) return;
      var elapsed = (Date.now() - startTime) / 1000;
      if (isReady) {
        beaverEl.className = "dblBeaver dblBeaverCelebrate";
        return;
      }
      if (elapsed > 8) {
        beaverEl.className = "dblBeaver dblBeaverInspect";
      } else if (elapsed > 3) {
        beaverEl.className = "dblBeaver dblBeaverWatch";
      } else {
        beaverEl.className = "dblBeaver dblBeaverWave";
      }
    }

    // Start animations (unless reduced motion)
    if (!reduced()) {
      addTimer(rotateMessage, 2200);
      addTimer(rotateTip, 4500);
      addTimer(advanceStage, 500);
      addTimer(updateBeaver, 1000);
      addTimer(animateReservoir, 100);
      addTimeout(rotateMessage, 600);
      addTimeout(rotateTip, 1200);
    } else {
      // Reduced motion: show static content
      msgEl.textContent = MESSAGES[0];
      var t0 = TIPS[0];
      tipEl.innerHTML = '<span class="dblTipIcon">' + t0.icon + '</span> <b>' + t0.name + ':</b> ' + t0.tip;
      el.classList.add("dblReduced");
    }

    function setReady() {
      if (destroyed || isReady) return Promise.resolve();
      isReady = true;
      stage = 3;
      statusEl.textContent = READY_MSG;
      msgEl.textContent = "";
      gaugeLabel.textContent = "READY!";
      el.classList.add("dblReady");
      beaverEl.className = "dblBeaver dblBeaverCelebrate";

      if (reduced()) {
        return Promise.resolve();
      }
      return new Promise(function (resolve) {
        addTimeout(function () {
          if (destroyed) { resolve(); return; }
          el.classList.add("dblFadeOut");
          addTimeout(function () { resolve(); }, 500);
        }, 800);
      });
    }

    function setError(msg) {
      if (destroyed) return;
      isReady = true;
      statusEl.textContent = "Something went wrong.";
      msgEl.textContent = msg || "Please try again.";
      gaugeLabel.textContent = "ERROR";
      el.classList.add("dblError");
      beaverEl.className = "dblBeaver dblBeaverInspect";
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      timers.forEach(function (id) { clearInterval(id); clearTimeout(id); });
      rafs.forEach(function (id) { cancelAnimationFrame(id); });
      timers = [];
      rafs = [];
      if (el.parentNode) el.parentNode.removeChild(el);
    }

    return { el: el, destroy: destroy, setReady: setReady, setError: setError };
  }

  // Inject CSS
  function addCss() {
    if (document.getElementById("dblStyles")) return;
    var rm = "@media(prefers-reduced-motion:reduce)";
    var css = [
      // Overlay
      ".dblOverlay{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:linear-gradient(180deg,#10163f 0%,#06070d 100%);font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;padding:8px 16px;overflow:hidden;transition:opacity .5s ease}",
      ".dblOverlay.dblFadeOut{opacity:0;pointer-events:none}",
      // Scene
      ".dblScene{width:100%;max-width:360px;flex:0 0 auto;position:relative;border-radius:12px;overflow:hidden;border:1px solid rgba(47,210,255,.2)}",
      ".dblSvg{display:block;width:100%;height:auto}",
      // Stars twinkling
      ".dblStars circle{animation:dblTwinkle 3s ease-in-out infinite alternate}",
      ".dblStars circle:nth-child(2n){animation-delay:-.8s}",
      ".dblStars circle:nth-child(3n){animation-delay:-1.6s}",
      "@keyframes dblTwinkle{0%{opacity:.2}100%{opacity:.7}}",
      // Stream animation
      ".dblStream{stroke-dasharray:8 6;animation:dblFlow 1.2s linear infinite}",
      "@keyframes dblFlow{to{stroke-dashoffset:-14}}",
      // Droplets floating along stream
      ".dblDrop{animation:dblDropFloat 2s ease-in-out infinite}",
      ".dblDrop2{animation-delay:-.5s}",
      ".dblDrop3{animation-delay:-1s}",
      ".dblDrop4{animation-delay:-1.5s}",
      "@keyframes dblDropFloat{0%{opacity:.3;transform:translate(0,0)}50%{opacity:.9;transform:translate(4px,-3px)}100%{opacity:.3;transform:translate(0,0)}}",
      // Waterwheel rotation
      ".dblWheel{animation:dblWheelSpin 4s linear infinite;transform-origin:280px 152px}",
      "@keyframes dblWheelSpin{to{transform:translate(280px,152px) rotate(360deg)}}",
      // Bubbles
      ".dblBubble{animation:dblBub 2.5s ease-in-out infinite}",
      ".dblB2{animation-delay:-.8s}",
      ".dblB3{animation-delay:-1.6s}",
      "@keyframes dblBub{0%{opacity:0;transform:translateY(0)}30%{opacity:.7}100%{opacity:0;transform:translateY(-15px)}}",
      // Reservoir fill animation (grows via JS)
      ".dblReservoir{transition:height .3s ease,y .3s ease}",
      // Beaver
      ".dblBeaver{font-size:32px;line-height:1;flex:0 0 auto;transition:transform .3s ease}",
      ".dblBeaverEmoji{display:inline-block;transition:transform .3s ease}",
      ".dblBeaverWave .dblBeaverEmoji{animation:dblWave 1.5s ease-in-out infinite}",
      ".dblBeaverWatch .dblBeaverEmoji{animation:dblBob 2s ease-in-out infinite}",
      ".dblBeaverInspect .dblBeaverEmoji{animation:dblPeek 2.5s ease-in-out infinite}",
      ".dblBeaverCelebrate .dblBeaverEmoji{animation:dblBounce .6s ease-in-out 3}",
      "@keyframes dblWave{0%,100%{transform:rotate(0deg)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}",
      "@keyframes dblBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}",
      "@keyframes dblPeek{0%,100%{transform:rotate(0) translateX(0)}50%{transform:rotate(-8deg) translateX(-3px)}}",
      "@keyframes dblBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.15)}}",
      // Text
      ".dblText{text-align:center;flex:0 0 auto;max-width:320px}",
      ".dblTitle{margin:0;font-size:clamp(10px,3vw,13px);font-weight:900;letter-spacing:.12em;color:#ff9df2;text-transform:uppercase}",
      ".dblSub{margin:2px 0 0;font-size:clamp(14px,4.5vw,20px);font-weight:900;letter-spacing:.06em;color:#fff;text-transform:uppercase}",
      ".dblStatus{margin:6px 0 0;font-size:clamp(10px,2.8vw,12px);font-weight:800;letter-spacing:.05em;color:#2fd2ff}",
      ".dblMsg{margin:4px 0 0;font-size:clamp(10px,2.5vw,11.5px);font-weight:700;color:#9bdcf2;min-height:1.4em;transition:opacity .3s ease}",
      // Gauge
      ".dblGauge{width:100%;max-width:280px;flex:0 0 auto;padding:0 4px}",
      ".dblGaugeTrack{position:relative;height:10px;border-radius:5px;background:#1a2150;border:1px solid rgba(47,210,255,.3);overflow:hidden}",
      ".dblGaugeFill{position:absolute;inset:0;background:linear-gradient(90deg,#3d3dea,#2fd2ff);border-radius:5px;animation:dblGaugePulse 2.2s ease-in-out infinite;transform-origin:left center}",
      "@keyframes dblGaugePulse{0%{transform:scaleX(.15);opacity:.6}50%{transform:scaleX(.85);opacity:1}100%{transform:scaleX(.15);opacity:.6}}",
      ".dblReady .dblGaugeFill{animation:none;transform:scaleX(1);opacity:1;background:linear-gradient(90deg,#3d3dea,#6dffb0)}",
      ".dblError .dblGaugeFill{animation:none;transform:scaleX(1);opacity:1;background:linear-gradient(90deg,#f310ba,#ff5b8a)}",
      // Gauge droplets
      ".dblGaugeDrops{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-around;pointer-events:none}",
      ".dblGD{font-size:8px;animation:dblGDFloat 1.8s ease-in-out infinite;opacity:.7}",
      ".dblGD2{animation-delay:-.6s}",
      ".dblGD3{animation-delay:-1.2s}",
      "@keyframes dblGDFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}",
      ".dblGaugeLabel{display:block;text-align:center;margin-top:4px;font-size:9px;font-weight:900;letter-spacing:.08em;color:#9bdcf2}",
      // Tip
      ".dblTip{text-align:center;font-size:clamp(9px,2.2vw,10.5px);font-weight:700;color:#8fb3c6;min-height:1.3em;transition:opacity .3s ease;max-width:300px}",
      ".dblTipIcon{font-size:12px}",
      ".dblTip b{color:#2fd2ff;letter-spacing:.05em;font-size:inherit}",
      // Signature
      ".dblSig{margin:4px 0 0;font-size:clamp(8px,2vw,9.5px);font-weight:900;letter-spacing:.06em;color:#ff9df2;text-align:center;opacity:.7}",
      // Reduced motion
      ".dblReduced .dblStream{animation:none}",
      ".dblReduced .dblDrop{animation:none;opacity:.6}",
      ".dblReduced .dblWheel{animation:none}",
      ".dblReduced .dblBubble{animation:none}",
      ".dblReduced .dblStars circle{animation:none;opacity:.5}",
      ".dblReduced .dblGaugeFill{animation:none;transform:scaleX(.5);opacity:.8}",
      ".dblReduced .dblBeaverEmoji{animation:none !important}",
      ".dblReduced .dblGD{animation:none;opacity:.5}",
      // Stage reveals
      ".dblStageA .dblStream{stroke-width:4}",
      ".dblStageB .dblOutflow{opacity:1;stroke-width:3.5}",
      // Ready state
      ".dblReady .dblWheel{animation:dblWheelSpin 1.5s linear infinite;transform-origin:280px 152px}",
      rm + "{.dblReady .dblWheel{animation:none}}",
      rm + "{.dblOverlay{transition:none}}",
      rm + "{.dblGaugeFill{animation:none;transform:scaleX(.5);opacity:.8}}",
      rm + "{.dblReady .dblGaugeFill{transform:scaleX(1);opacity:1}}",
      rm + "{.dblBeaverEmoji{animation:none !important}}",
      rm + "{.dblDrop,.dblBubble,.dblStars circle,.dblGD{animation:none}}",
      rm + "{.dblStream{animation:none}}"
    ].join("\n");

    var st = document.createElement("style");
    st.id = "dblStyles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  window.DamBuilderLoading = {
    create: function () {
      addCss();
      return create();
    }
  };
})();
