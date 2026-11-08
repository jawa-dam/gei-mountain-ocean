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
      "#geiWelcome{position:fixed;inset:0;z-index:99000;display:flex;align-items:center;justify-content:center;"+
        "padding:16px;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .45s ease,visibility .45s ease;"+
        "background:radial-gradient(ellipse at 50% 80%,#0a3d6b 0%,#041428 55%,#020a14 100%);overflow:hidden}"+
      "#geiWelcome.show{opacity:1;visibility:visible;pointer-events:auto}"+
      /* Animated ocean floor background */
      "#geiWelcome .gwOcean{position:absolute;inset:0;overflow:hidden;pointer-events:none}"+
      "#geiWelcome .gwWaveTop{position:absolute;top:-2px;left:-5%;width:110%;height:80px;"+
        "background:repeating-linear-gradient(90deg,transparent,rgba(47,210,255,.12) 25%,transparent 50%);"+
        "background-size:200px 100%;animation:gwWaveMove 4s linear infinite;border-radius:0 0 50% 50%}"+
      "#geiWelcome .gwWaveTop:nth-child(2){top:6px;opacity:.5;animation-duration:5.5s;animation-direction:reverse}"+
      /* Floating bubbles */
      "#geiWelcome .gwBub{position:absolute;border-radius:50%;pointer-events:none;"+
        "background:radial-gradient(circle at 35% 35%,rgba(255,255,255,.35),rgba(47,210,255,.18) 60%,transparent);"+
        "border:1px solid rgba(157,234,255,.25);animation:gwFloat linear infinite}"+
      /* Light rays from above */
      "#geiWelcome .gwRays{position:absolute;top:-20%;left:10%;width:80%;height:70%;"+
        "background:conic-gradient(from 170deg at 50% 0%,transparent 40%,rgba(47,210,255,.06) 45%,transparent 50%,"+
        "transparent 65%,rgba(157,234,255,.05) 70%,transparent 75%);animation:gwRayPulse 6s ease-in-out infinite;pointer-events:none}"+
      /* The card */
      "#geiWelcome .gwCard{position:relative;width:min(100%,420px);max-height:calc(100dvh - 40px);overflow:auto;overscroll-behavior:contain;"+
        "padding:28px 22px 22px;border-radius:32px;color:#f3fbff;font-family:Inter,system-ui,sans-serif;text-align:center;"+
        "background:linear-gradient(170deg,rgba(10,61,107,.88) 0%,rgba(4,20,40,.92) 50%,rgba(12,8,32,.9) 100%);"+
        "border:1.5px solid rgba(47,210,255,.4);box-shadow:0 24px 80px rgba(0,0,0,.55),0 0 60px rgba(47,210,255,.18),inset 0 1px 0 rgba(255,255,255,.1);"+
        "transform:translateY(50px) scale(.92);transition:transform .65s cubic-bezier(.2,.9,.25,1.12);backdrop-filter:blur(12px)}"+
      "#geiWelcome.show .gwCard{transform:none}"+
      /* Water shimmer top bar */
      "#geiWelcome .gwCard::before{content:'';position:absolute;left:0;right:0;top:0;height:6px;border-radius:32px 32px 0 0;"+
        "background:linear-gradient(90deg,transparent,#2fd2ff,#9deaff,#5ff5c8,#2fd2ff,transparent);background-size:300% 100%;animation:gwWater 2.5s linear infinite}"+
      "#geiWelcome .gwClose{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(255,255,255,.2);"+
        "background:rgba(0,30,60,.5);color:#9deaff;font:800 18px/1 system-ui,sans-serif;cursor:pointer;display:grid;place-items:center;"+
        "transition:background .2s,transform .15s;z-index:2}"+
      "#geiWelcome .gwClose:hover{background:rgba(47,210,255,.2);transform:scale(1.1)}"+
      "#geiWelcome .gwClose:focus-visible,#geiWelcome button:focus-visible,#geiWelcome input:focus-visible{outline:3px solid #9deaff;outline-offset:2px}"+
      /* Character spotlight */
      "#geiWelcome .gwHost{display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:6px}"+
      "#geiWelcome .gwBeaver{position:relative;flex:0 0 auto;width:120px;height:120px;display:grid;place-items:center;"+
        "border-radius:50%;background:radial-gradient(circle,rgba(47,210,255,.15),transparent 70%)}"+
      "#geiWelcome .gwBeaver::after{content:'';position:absolute;left:10%;right:10%;bottom:-4px;height:18px;border-radius:50%;"+
        "background:radial-gradient(closest-side,rgba(47,210,255,.6),transparent);animation:gwRipple 2.2s ease-in-out infinite}"+
      "#geiWelcome .gwBeaver::before{content:'';position:absolute;inset:-8px;border-radius:50%;"+
        "border:2px solid rgba(47,210,255,.25);animation:gwRing 3s ease-in-out infinite}"+
      "#geiWelcome .gwBeaver img,#geiWelcome .gwBeaver .gwEmoji{position:relative;z-index:1;max-width:88%;max-height:88%;object-fit:contain;"+
        "filter:drop-shadow(0 8px 18px rgba(0,0,0,.5));transform-origin:50% 100%;animation:gwArrive .9s cubic-bezier(.2,.9,.25,1.3) both,gwBob 3s 0.9s ease-in-out infinite}"+
      "#geiWelcome .gwBeaver .gwEmoji{font-size:72px;line-height:1}"+
      "#geiWelcome .gwWave{position:absolute;z-index:2;right:2px;top:8px;font-size:32px;transform-origin:70% 80%;animation:gwWaveHand 1.1s .9s ease-in-out 3 both}"+
      /* Title */
      "#geiWelcome .gwTitle{margin:0;font:900 clamp(22px,7vw,30px)/1.1 system-ui,sans-serif;letter-spacing:.01em;"+
        "background:linear-gradient(135deg,#eafcff 0%,#2fd2ff 40%,#5ff5c8 70%,#9deaff 100%);-webkit-background-clip:text;background-clip:text;color:transparent;"+
        "filter:drop-shadow(0 2px 8px rgba(47,210,255,.4))}"+
      /* Speech bubble */
      "#geiWelcome .gwBubble{position:relative;margin:10px 0 0;padding:14px 16px;border-radius:20px;"+
        "background:rgba(47,210,255,.08);border:1px solid rgba(157,234,255,.22);font:600 15px/1.45 system-ui,sans-serif;color:#d0f4ff;text-align:left}"+
      "#geiWelcome .gwBubble::before{content:'';position:absolute;left:50%;top:-7px;margin-left:-7px;width:14px;height:14px;transform:rotate(45deg);"+
        "background:rgba(10,45,75,.9);border-left:1px solid rgba(157,234,255,.22);border-top:1px solid rgba(157,234,255,.22)}"+
      /* Guide list */
      "#geiWelcome .gwGuide{display:none;margin:12px 0 0;padding:0;list-style:none;text-align:left}"+
      "#geiWelcome[data-mode='review'] .gwGuide{display:grid;gap:8px}"+
      "#geiWelcome .gwGuide li{padding:10px 12px;border-radius:14px;background:rgba(47,210,255,.06);border:1px solid rgba(47,210,255,.15);"+
        "font:500 15px/1.4 system-ui,sans-serif;color:#d0f4ff}"+
      "#geiWelcome .gwGuide strong{color:#fff}"+
      /* Buttons */
      "#geiWelcome .gwActions{display:grid;gap:10px;margin-top:16px}"+
      "#geiWelcome .gwBegin,#geiWelcome .gwChoose{min-height:56px;border-radius:18px;cursor:pointer;font:900 18px/1.1 system-ui,sans-serif;letter-spacing:.04em;"+
        "transition:transform .15s,box-shadow .15s}"+
      "#geiWelcome .gwBegin{border:0;color:#021a2e;position:relative;overflow:hidden;"+
        "background:linear-gradient(135deg,#5ff5c8 0%,#2fd2ff 50%,#3d8bea 100%);"+
        "box-shadow:0 8px 28px rgba(47,210,255,.4),inset 0 1px 0 rgba(255,255,255,.3)}"+
      "#geiWelcome .gwBegin::after{content:'';position:absolute;inset:0;"+
        "background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);background-size:200% 100%;animation:gwShine 2.5s ease-in-out infinite}"+
      "#geiWelcome .gwBegin:active{transform:scale(.97)}"+
      "#geiWelcome .gwChoose{border:1.5px solid rgba(47,210,255,.35);color:#fff;background:rgba(47,210,255,.1);font-size:16px;"+
        "box-shadow:0 4px 16px rgba(47,210,255,.12)}"+
      "#geiWelcome .gwChoose:active{transform:scale(.97)}"+
      "#geiWelcome .gwNever{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;min-height:44px;"+
        "font:700 14px/1.3 system-ui,sans-serif;color:rgba(157,234,255,.7);cursor:pointer}"+
      "#geiWelcome .gwNever input{width:22px;height:22px;flex:0 0 auto;accent-color:#2fd2ff;cursor:pointer}"+
      "#geiWelcome[data-mode='review'] .gwNever{display:none}"+
      /* Floating drop particles inside card */
      "#geiWelcome .gwDrops{position:absolute;inset:0;overflow:hidden;pointer-events:none;border-radius:32px}"+
      "#geiWelcome .gwDrops i{position:absolute;bottom:-12px;width:6px;height:6px;border-radius:50%;background:rgba(157,234,255,.4);animation:gwDropUp 6s linear infinite}"+
      ".geiWelcomeAgainBtn{display:block;width:100%;min-height:50px;margin:8px 0 12px;border-radius:16px;border:1px solid rgba(47,210,255,.4);"+
        "background:linear-gradient(135deg,rgba(47,210,255,.16),rgba(61,61,234,.14));color:#fff;font:900 16px/1.1 system-ui,sans-serif;letter-spacing:.05em;cursor:pointer}"+
      "@keyframes gwWater{to{background-position:300% 0}}"+
      "@keyframes gwWaveMove{to{background-position:200px 0}}"+
      "@keyframes gwFloat{0%{transform:translateY(0) scale(1);opacity:.7}50%{opacity:1}100%{transform:translateY(calc(-100vh - 40px)) scale(.6);opacity:0}}"+
      "@keyframes gwRayPulse{0%,100%{opacity:.5}50%{opacity:1}}"+
      "@keyframes gwArrive{0%{opacity:0;transform:translateY(40px) scale(.7)}60%{opacity:1;transform:translateY(-8px) scale(1.06)}100%{transform:none}}"+
      "@keyframes gwBob{0%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}60%{transform:translateY(-5px)}}"+
      "@keyframes gwWaveHand{0%,100%{transform:rotate(0)}25%{transform:rotate(20deg)}75%{transform:rotate(-14deg)}}"+
      "@keyframes gwRipple{0%,100%{transform:scaleX(.7);opacity:.5}50%{transform:scaleX(1.15);opacity:1}}"+
      "@keyframes gwRing{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.08);opacity:.9}}"+
      "@keyframes gwDropUp{0%{transform:translateY(0);opacity:0}10%{opacity:.7}100%{transform:translateY(-400px);opacity:0}}"+
      "@keyframes gwShine{0%,100%{background-position:-200% 0}50%{background-position:200% 0}}"+
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
    var bubbles = '';
    var sizes = [14,10,18,8,12,16,9,22,11,15,7,20];
    for(var b = 0; b < 12; b++){
      var sz = sizes[b];
      bubbles += '<div class="gwBub" style="width:'+sz+'px;height:'+sz+'px;left:'+(5+b*8)+'%;bottom:-'+sz+'px;animation-duration:'+(5+b*1.3).toFixed(1)+'s;animation-delay:'+(b*.7).toFixed(1)+'s"></div>';
    }
    root.innerHTML =
      '<div class="gwOcean" aria-hidden="true">'+
        '<div class="gwWaveTop"></div><div class="gwWaveTop"></div>'+
        '<div class="gwRays"></div>'+
        bubbles+
      '</div>'+
      '<div class="gwCard">'+
        '<div class="gwDrops" aria-hidden="true"><i style="left:10%;animation-delay:0s"></i><i style="left:30%;animation-delay:1.4s"></i><i style="left:55%;animation-delay:.6s"></i><i style="left:75%;animation-delay:2.2s"></i><i style="left:90%;animation-delay:3.1s"></i></div>'+
        '<button class="gwClose" id="geiWelcomeClose" type="button" aria-label="Close welcome and don\'t show it again">✕</button>'+
        '<div class="gwHost">'+
          '<div class="gwBeaver" aria-hidden="true"><img alt="" decoding="async"><span class="gwWave">👋</span></div>'+
          '<h2 class="gwTitle" id="geiWelcomeTitle">WELCOME TO THE FLOW! 💧</h2>'+
        '</div>'+
        '<p class="gwBubble" id="geiWelcomeLine">Hey DAM-ITE! I\'m your Beaver buddy. Tap to move water from the Mountain to the Ocean!</p>'+
        '<ul class="gwGuide" aria-label="DAM-ITE command guide">'+
          '<li>🌊 <strong>What it is:</strong> move water from the ⛰️ Mountain through the 🧱 Dam, 🚪 Sluice, ⚙️ Waterwheel and 🏭 Mill to the Ocean — and rescue the -ites on the way.</li>'+
          '<li>▶ <strong>How to begin:</strong> tap <strong>BEGIN THE FLOW</strong>, then tap anywhere on the board. Your first tap starts the day\'s clock.</li>'+
          '<li>👆 <strong>Controls:</strong> tap to work the glowing station. Finish all six days before the timer runs out to earn FL OZ.</li>'+
          '<li>👤 <strong>Players:</strong> tap <strong>CHOOSE ANOTHER PLAYER</strong> — Beaver and Wilbert are free; more wait in 🛒 BUY-ites.</li>'+
          '<li>🧭 <strong>Top buttons:</strong> 🗺️ DAM Map · 📖 full Command Guide · 👤 Profile (this welcome lives there).</li>'+
        '</ul>'+
        '<div class="gwActions">'+
          '<button class="gwBegin" id="geiWelcomeBegin" type="button">💧 BEGIN THE FLOW</button>'+
          '<button class="gwChoose" id="geiWelcomeChoose" type="button">👤 CHOOSE ANOTHER PLAYER</button>'+
        '</div>'+
        '<label class="gwNever"><input type="checkbox" id="geiWelcomeNever"> DON\'T SHOW THIS AGAIN</label>'+
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
      : "Hey DAM-ITE! I'm your Beaver buddy. Tap to move water from the Mountain to the Ocean!";
    root.querySelector("#geiWelcomeBegin").textContent = W.mode === "review" ? "💧 BACK TO THE FLOW" : "💧 BEGIN THE FLOW";
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
