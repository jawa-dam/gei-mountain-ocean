/* V2.1.90 — BEAVER-FIRST FIRST IMPRESSION + RETURNING VISITOR WELCOME MEMORY
 *
 * Presentation + startup flow only. The game no longer opens on the Command Guide
 * ("How to Play" / pick-a-player). Instead:
 *   - a brand-new visitor starts with Y'all Too Beaver active (set in index.html at boot,
 *     only when no save exists — ownership rules are untouched, Wilbert stays owned)
 *   - after the splash, the Beaver host greets the player once:
 *       ▶ BEGIN THE FLOW · 👤 CHOOSE ANOTHER PLAYER · ☐ DON'T SHOW THIS WELCOME AGAIN · ✕
 *   - ✕ (or the checked box) writes localStorage geiWelcomeDismissed = "true" and the
 *     welcome never returns on startup
 *   - Profile → "👋 WELCOME AGAIN" reopens the same host card in review mode with the
 *     basics; review mode never reads or writes the dismissal key.
 *
 * Never touches FL OZ, XP, purchases, entitlements, progression, ownership or the save.
 * The only storage it writes is the dismissal key. Gameplay taps never open it.
 */
(function(){
  "use strict";

  var KEY = "geiWelcomeDismissed";
  var BEAVER_IMG = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-beaver-rhhiVplt1GMykxV8.png";
  var W = { root:null, mode:"", shownAt:0, startupDone:false, lastFocus:null };

  function lsGet(k){ try{ return window.localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ window.localStorage.setItem(k,v); return true; }catch(e){ return false; } }
  function isDismissed(){ return lsGet(KEY) === "true"; }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function call(name){
    var fn = window[name];
    if(typeof fn !== "function") return undefined;
    try{ return fn.apply(null, Array.prototype.slice.call(arguments,1)); }catch(e){ return undefined; }
  }

  function css(){
    if(document.getElementById("geiWelcome2190Style")) return;
    var s = document.createElement("style");
    s.id = "geiWelcome2190Style";
    s.textContent =
      "#geiWelcome{position:fixed;inset:0;z-index:99000;display:flex;align-items:flex-end;justify-content:center;"+
        "padding:16px 16px calc(env(safe-area-inset-bottom) + 18px);background:linear-gradient(180deg,rgba(2,8,20,.12),rgba(2,8,20,.62));"+
        "opacity:0;visibility:hidden;pointer-events:none;transition:opacity .35s ease,visibility .35s ease}"+
      "#geiWelcome.show{opacity:1;visibility:visible;pointer-events:auto}"+
      "#geiWelcome .gwCard{position:relative;width:min(100%,440px);max-height:calc(100dvh - 40px);overflow:auto;overscroll-behavior:contain;"+
        "padding:18px 18px 16px;border-radius:26px;color:#f3fbff;font-family:Inter,system-ui,sans-serif;"+
        "background:linear-gradient(160deg,rgba(9,34,62,.96),rgba(6,16,34,.97) 60%,rgba(20,12,44,.96));"+
        "border:1px solid rgba(47,210,255,.34);box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 34px rgba(47,210,255,.16);"+
        "transform:translateY(40px) scale(.97);transition:transform .55s cubic-bezier(.2,.9,.25,1.15)}"+
      "#geiWelcome.show .gwCard{transform:none}"+
      "#geiWelcome .gwCard::before{content:'';position:absolute;left:0;right:0;top:0;height:5px;border-radius:26px 26px 0 0;"+
        "background:linear-gradient(90deg,transparent,#2fd2ff,#9deaff,#2fd2ff,transparent);background-size:200% 100%;animation:gwWater 3s linear infinite}"+
      "#geiWelcome .gwClose{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.22);"+
        "background:rgba(255,255,255,.08);color:#fff;font:800 20px/1 system-ui,sans-serif;cursor:pointer;display:grid;place-items:center}"+
      "#geiWelcome .gwClose:focus-visible,#geiWelcome button:focus-visible,#geiWelcome input:focus-visible{outline:3px solid #9deaff;outline-offset:2px}"+
      "#geiWelcome .gwHost{display:flex;align-items:flex-end;gap:12px;padding-right:44px}"+
      "#geiWelcome .gwBeaver{position:relative;flex:0 0 auto;width:96px;height:104px;display:grid;place-items:end center}"+
      "#geiWelcome .gwBeaver::after{content:'';position:absolute;left:8px;right:8px;bottom:0;height:14px;border-radius:50%;"+
        "background:radial-gradient(closest-side,rgba(47,210,255,.55),transparent);animation:gwRipple 2.6s ease-in-out infinite}"+
      "#geiWelcome .gwBeaver img,#geiWelcome .gwBeaver .gwEmoji{position:relative;z-index:1;max-width:100%;max-height:100%;object-fit:contain;"+
        "filter:drop-shadow(0 6px 14px rgba(0,0,0,.45));transform-origin:50% 100%;animation:gwArrive .8s cubic-bezier(.2,.9,.25,1.3) both,gwIdle 3.2s 0.8s ease-in-out infinite}"+
      "#geiWelcome .gwBeaver .gwEmoji{font-size:72px;line-height:1}"+
      "#geiWelcome .gwWave{position:absolute;z-index:2;right:-4px;top:4px;font-size:28px;transform-origin:70% 80%;animation:gwWave 1.1s .9s ease-in-out 3 both}"+
      "#geiWelcome .gwTitle{margin:0;font:900 clamp(20px,6vw,26px)/1.12 system-ui,sans-serif;letter-spacing:.02em;color:#fff;"+
        "text-shadow:0 0 18px rgba(47,210,255,.45)}"+
      "#geiWelcome .gwBubble{position:relative;margin:12px 0 0;padding:12px 14px;border-radius:18px;background:rgba(255,255,255,.08);"+
        "border:1px solid rgba(157,234,255,.24);font:600 17px/1.4 system-ui,sans-serif;color:#eafcff}"+
      "#geiWelcome .gwBubble::before{content:'';position:absolute;left:34px;top:-8px;width:14px;height:14px;transform:rotate(45deg);"+
        "background:rgba(28,52,78,1);border-left:1px solid rgba(157,234,255,.24);border-top:1px solid rgba(157,234,255,.24)}"+
      "#geiWelcome .gwGuide{display:none;margin:12px 0 0;padding:0;list-style:none}"+
      "#geiWelcome[data-mode='review'] .gwGuide{display:grid;gap:8px}"+
      "#geiWelcome .gwGuide li{padding:10px 12px;border-radius:14px;background:rgba(47,210,255,.08);border:1px solid rgba(47,210,255,.18);"+
        "font:500 16px/1.4 system-ui,sans-serif;color:#dff6ff}"+
      "#geiWelcome .gwGuide strong{color:#fff}"+
      "#geiWelcome .gwActions{display:grid;gap:10px;margin-top:14px}"+
      "#geiWelcome .gwBegin,#geiWelcome .gwChoose{min-height:54px;border-radius:16px;cursor:pointer;font:900 18px/1.1 system-ui,sans-serif;letter-spacing:.04em}"+
      "#geiWelcome .gwBegin{border:0;color:#03121f;background:linear-gradient(135deg,#9deaff,#2fd2ff 55%,#3d8bea);box-shadow:0 8px 24px rgba(47,210,255,.35)}"+
      "#geiWelcome .gwChoose{border:1px solid rgba(255,255,255,.26);color:#fff;background:rgba(255,255,255,.07);font-size:16px}"+
      "#geiWelcome .gwNever{display:flex;align-items:center;gap:10px;margin-top:12px;min-height:44px;font:700 15px/1.3 system-ui,sans-serif;color:#cfeeff;cursor:pointer}"+
      "#geiWelcome .gwNever input{width:24px;height:24px;flex:0 0 auto;accent-color:#2fd2ff;cursor:pointer}"+
      "#geiWelcome[data-mode='review'] .gwNever{display:none}"+
      "#geiWelcome .gwDrops{position:absolute;inset:0;overflow:hidden;pointer-events:none;border-radius:26px}"+
      "#geiWelcome .gwDrops i{position:absolute;bottom:-12px;width:8px;height:8px;border-radius:50%;background:rgba(157,234,255,.5);animation:gwBubble 5s linear infinite}"+
      ".geiWelcomeAgainBtn{display:block;width:100%;min-height:50px;margin:8px 0 12px;border-radius:16px;border:1px solid rgba(47,210,255,.4);"+
        "background:linear-gradient(135deg,rgba(47,210,255,.16),rgba(61,61,234,.14));color:#fff;font:900 16px/1.1 system-ui,sans-serif;letter-spacing:.05em;cursor:pointer}"+
      "@keyframes gwWater{to{background-position:200% 0}}"+
      "@keyframes gwArrive{0%{opacity:0;transform:translateY(34px) scale(.8)}70%{opacity:1;transform:translateY(-4px) scale(1.04)}100%{transform:none}}"+
      "@keyframes gwIdle{0%,100%{transform:translateY(0) scaleY(1)}45%{transform:translateY(-4px) scaleY(1.02)}55%{transform:translateY(-4px) scaleY(.99)}}"+
      "@keyframes gwWave{0%,100%{transform:rotate(0)}25%{transform:rotate(18deg)}75%{transform:rotate(-12deg)}}"+
      "@keyframes gwRipple{0%,100%{transform:scaleX(.8);opacity:.6}50%{transform:scaleX(1.1);opacity:1}}"+
      "@keyframes gwBubble{0%{transform:translateY(0);opacity:0}15%{opacity:.8}100%{transform:translateY(-320px);opacity:0}}"+
      "@media (min-width:700px){#geiWelcome{align-items:center}}"+
      "@media (prefers-reduced-motion:reduce){#geiWelcome,#geiWelcome *{animation:none!important;transition:none!important}#geiWelcome .gwCard{transform:none}}";
    document.head.appendChild(s);
  }

  function build(){
    if(W.root) return W.root;
    css();
    var root = document.createElement("div");
    root.id = "geiWelcome";
    root.setAttribute("role","dialog");
    root.setAttribute("aria-modal","true");
    root.setAttribute("aria-labelledby","geiWelcomeTitle");
    root.setAttribute("aria-hidden","true");
    root.innerHTML =
      '<div class="gwCard">'+
        '<div class="gwDrops" aria-hidden="true"><i style="left:12%;animation-delay:0s"></i><i style="left:38%;animation-delay:1.6s"></i><i style="left:66%;animation-delay:.8s"></i><i style="left:88%;animation-delay:2.7s"></i></div>'+
        '<button class="gwClose" id="geiWelcomeClose" type="button" aria-label="Close welcome and don\'t show it again">✕</button>'+
        '<div class="gwHost">'+
          '<div class="gwBeaver" aria-hidden="true"><img alt="" decoding="async"><span class="gwWave">👋</span></div>'+
          '<h2 class="gwTitle" id="geiWelcomeTitle">HEY, DAM-ITE! WELCOME TO THE FLOW! 🦫💧</h2>'+
        '</div>'+
        '<p class="gwBubble" id="geiWelcomeLine">I\'m your Beaver buddy. You can choose another player or begin the game.</p>'+
        '<ul class="gwGuide" aria-label="DAM-ITE command guide">'+
          '<li>🌊 <strong>What it is:</strong> move water from the ⛰️ Mountain through the 🧱 Dam, 🚪 Sluice, ⚙️ Waterwheel and 🏭 Mill to the Ocean — and rescue the -ites on the way.</li>'+
          '<li>▶ <strong>How to begin:</strong> tap <strong>BEGIN THE FLOW</strong>, then tap anywhere on the board. Your first tap starts the day\'s clock.</li>'+
          '<li>👆 <strong>Controls:</strong> tap to work the glowing station. Finish all six days before the timer runs out to earn FL OZ.</li>'+
          '<li>👤 <strong>Players:</strong> tap <strong>CHOOSE ANOTHER PLAYER</strong> — Beaver and Wilbert are free; more wait in 🛒 BUY-ites.</li>'+
          '<li>🧭 <strong>Top buttons:</strong> 🗺️ DAM Map · 📖 full Command Guide · 👤 Profile (this welcome lives there).</li>'+
        '</ul>'+
        '<div class="gwActions">'+
          '<button class="gwBegin" id="geiWelcomeBegin" type="button">▶ BEGIN THE FLOW</button>'+
          '<button class="gwChoose" id="geiWelcomeChoose" type="button">👤 CHOOSE ANOTHER PLAYER</button>'+
        '</div>'+
        '<label class="gwNever"><input type="checkbox" id="geiWelcomeNever"> DON\'T SHOW THIS WELCOME AGAIN</label>'+
      '</div>';
    document.body.appendChild(root);

    var img = root.querySelector(".gwBeaver img");
    img.onerror = function(){
      var e = document.createElement("span"); e.className = "gwEmoji"; e.textContent = "🦫";
      if(img.parentNode) img.parentNode.replaceChild(e, img);
    };
    img.src = BEAVER_IMG;

    root.querySelector("#geiWelcomeClose").addEventListener("click", function(){ close("x"); });
    root.querySelector("#geiWelcomeBegin").addEventListener("click", function(){ close("begin"); });
    root.querySelector("#geiWelcomeChoose").addEventListener("click", function(){ close("choose"); });
    root.addEventListener("click", function(e){ if(e.target === root) close("backdrop"); });
    root.addEventListener("keydown", function(e){
      if(e.key === "Escape"){ e.preventDefault(); close("x"); return; }
      if(e.key !== "Tab") return;
      var f = Array.prototype.filter.call(root.querySelectorAll("button,input"), function(el){ return el.offsetParent !== null; });
      if(!f.length) return;
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
    W.root = root;
    return root;
  }

  /* ---------- audio: existing friendly/nature layer only, soft and quiet ---------- */
  function welcomeCue(gesture){
    try{
      if(typeof damNoise === "function") damNoise({ dur:.9, from:260, to:900, gain:.012, filter:"lowpass", gesture:!!gesture });
      if(typeof damVoice === "function"){
        damVoice({ freq:392, time:.5, gain:.010, delay:.12, gesture:!!gesture });
        damVoice({ freq:587, time:.6, gain:.008, delay:.34, gesture:!!gesture });
      }
      if(typeof geiBirdChirp === "function") setTimeout(function(){ try{ geiBirdChirp("mountain", 1, true); }catch(e){} }, 520);
    }catch(e){}
  }

  function setOpenFlag(on){
    window.geiWelcomeOpen = !!on;
    document.documentElement.classList.toggle("geiWelcomeOpen", !!on);
    call("syncTimerPause");
  }

  function open(mode){
    var root = build();
    W.mode = mode === "review" ? "review" : "first";
    root.setAttribute("data-mode", W.mode);
    var never = root.querySelector("#geiWelcomeNever");
    if(never) never.checked = false;
    root.querySelector("#geiWelcomeLine").textContent = W.mode === "review"
      ? "Welcome back, DAM-ITE! Here's the quick guide — nothing about your progress changes."
      : "I'm your Beaver buddy. You can choose another player or begin the game.";
    root.querySelector("#geiWelcomeBegin").textContent = W.mode === "review" ? "▶ BACK TO THE FLOW" : "▶ BEGIN THE FLOW";
    root.querySelector("#geiWelcomeClose").setAttribute("aria-label", W.mode === "review" ? "Close welcome" : "Close welcome and don't show it again");
    /* Restart the host entrance each time it appears. */
    Array.prototype.forEach.call(root.querySelectorAll(".gwBeaver img,.gwBeaver .gwEmoji,.gwWave"), function(el){
      el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
    });
    W.lastFocus = document.activeElement;
    root.setAttribute("aria-hidden","false");
    root.classList.add("show");
    W.shownAt = Date.now();
    setOpenFlag(true);
    welcomeCue(W.mode === "review");      // review opens from a tap; first-impression plays only if audio is already unlocked
    setTimeout(function(){ try{ root.querySelector("#geiWelcomeBegin").focus({ preventScroll:true }); }catch(e){} }, 60);
    return true;
  }

  /* reason: begin | choose | x | backdrop | api */
  function close(reason){
    var root = W.root;
    if(!root || !root.classList.contains("show")) return false;
    var never = root.querySelector("#geiWelcomeNever");
    if(W.mode === "first" && (reason === "x" || (never && never.checked))) lsSet(KEY, "true");
    root.classList.remove("show");
    root.setAttribute("aria-hidden","true");
    var wasMode = W.mode;
    W.mode = "";
    setOpenFlag(false);
    if(reason === "begin" || reason === "backdrop"){
      welcomeCue(true);
      if(wasMode === "first"){
        var c = call("getActiveCharacter");
        if(c && c.name) call("showToast", c.name + " is ready — tap the glowing station to begin", 2400);
      }
    }
    if(reason === "choose"){
      call("openGameGuide", true);
      call("showGuideTab", "avatar");
    } else if(W.lastFocus && W.lastFocus.focus && document.contains(W.lastFocus)){
      try{ W.lastFocus.focus({ preventScroll:true }); }catch(e){}
    }
    return true;
  }

  /* ---------- Profile / Character access ---------- */
  function addProfileButton(){
    if(document.getElementById("geiWelcomeAgainBtn")) return;
    var hero = document.querySelector("#profilePanel .profileHero");
    if(!hero || !hero.parentNode) return;
    var b = document.createElement("button");
    b.type = "button";
    b.id = "geiWelcomeAgainBtn";
    b.className = "geiWelcomeAgainBtn";
    b.textContent = "👋 WELCOME AGAIN · COMMAND GUIDE";
    b.addEventListener("click", function(){
      call("closePanels");
      open("review");
    });
    hero.parentNode.insertBefore(b, hero.nextSibling);
  }

  /* ---------- startup: once, after the splash, only if not dismissed ---------- */
  function splashUp(){
    var s = document.getElementById("geiSplash");
    return !!(s && !s.classList.contains("isDone") && s.style.display !== "none");
  }
  function startup(tries){
    if(W.startupDone) return;
    if(isDismissed()){ W.startupDone = true; return; }
    if(splashUp() || !window.__GEI_GAME_BOOTED__){
      if(tries < 150) setTimeout(function(){ startup(tries + 1); }, 200);
      return;
    }
    W.startupDone = true;
    setTimeout(function(){ if(!isDismissed()) open("first"); }, 450);
  }

  function install(){
    build();
    addProfileButton();
    startup(0);
  }

  window.__GEI_BEAVER_WELCOME__ = Object.freeze({
    version:"V2.1.90",
    storageKey:KEY,
    presentationOnly:true,
    isDismissed:isDismissed,
    isOpen:function(){ return !!(W.root && W.root.classList.contains("show")); },
    mode:function(){ return W.mode; },
    openReview:function(){ return open("review"); },
    begin:function(){ return close("begin"); },
    choose:function(){ return close("choose"); },
    dismiss:function(){ return close("x"); }
  });

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once:true });
  else install();
})();
