/* V2.1.92 — TAPLITES LOGO BRANDING + SAVED -ITE SHOWCASE
 *
 * Logos (brand hierarchy: GAMEPLAY > SAVED -ITE ART > CHARACTER > LOGO)
 *   TAPLITES Wet  → splash title (replaces the plain "TAP LITES" text, no duplicate text under it)
 *                   and the DAM Map header.
 *   TAPLITES      → main game header (above "TAP WATER. MAKE WAVES. SAVE THE -ITES."), plus small
 *                   secondary marks in the Song Vault, Profile and Characters panels.
 *   Every logo keeps "TAP LITES" as its accessible name (or is aria-hidden next to a text title) and
 *   falls back to the original text if the image cannot load.
 *
 * Saved -ite showcase
 *   "-ITE RESCUE COMPLETE!" card on the level card: the saved -ite becomes the focal point
 *   (much larger, kept inside the mobile viewport) with a randomized reveal — pop / bounce / rise /
 *   scale burst entrance + glow / splash / shimmer / float afterglow.
 *   Tapping the card opens a SAVED -ITES collection popout built from the existing rescue record
 *   (state.iteRescueStats.savedIteIds + ITE_BY_ID + renderIte). Read-only: no new economy, no writes.
 *
 * Presentation only: never touches FL OZ, XP, purchases, entitlements, progression, ownership,
 * character authority or saved data.
 */
(function(){
  "use strict";
  if(window.__GEI_TAPLITES_SHOWCASE__) return;
  var VERSION = "V2.1.92";
  var LOGO_WET = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/taplite-dam-game-MMriASP81waYdTOV.png";
  var LOGO_STD = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/tap-lites-dam-game-jbpqyY7isgNwO53J.png";
  var BRAND = "TAP LITES";
  var ENTRANCES = ["pop","bounce","rise","burst"];
  var AFTERGLOWS = ["glow","splash","shimmer","float"];

  function $(id){ return document.getElementById(id); }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function game(fn, d){ try{ return fn(); }catch(e){ return d; } }

  function css(){
    if($("tl92Style")) return;
    var s = document.createElement("style"); s.id = "tl92Style";
    s.textContent =
      /* ---- logos ---- */
      ".tl92Logo{display:block;width:auto;object-fit:contain;-webkit-user-drag:none;user-select:none}"+
      ".tl92HasLogo{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:inherit!important;line-height:0!important;letter-spacing:0!important}"+
      ".tl92HasLogo .tl2173Waterline{display:none}"+
      "#gameLogo.tl92HasLogo{display:block;width:auto;max-width:100%}"+
      "#gameLogo.tl92HasLogo::after{bottom:-3px}"+
      ".tl92LogoHeader{height:clamp(36px,9vw,54px);max-width:min(54vw,270px);filter:drop-shadow(0 2px 6px rgba(0,0,0,.45)) drop-shadow(0 0 10px color-mix(in srgb,var(--water-bright,#2fd2ff) 35%,transparent))}"+
      ".geiSplashTitle.tl92HasLogo{display:flex;justify-content:center;filter:none}"+
      ".tl92LogoSplash{height:auto;width:min(80vw,560px);max-height:min(30vh,260px);margin:0 auto;filter:drop-shadow(0 0 22px rgba(47,210,255,.45)) drop-shadow(0 6px 14px rgba(0,0,0,.5))}"+
      ".tl92LogoMap{height:clamp(30px,5vw,46px);max-width:min(46vw,240px);margin:0 0 4px;filter:drop-shadow(0 0 10px rgba(47,210,255,.35))}"+
      ".tl92LogoVault{height:30px;max-width:60%;margin:0 auto 8px;opacity:.95}"+
      ".tl92PanelMark{display:flex;justify-content:center;margin:-2px 0 8px}.tl92PanelMark img{height:24px;max-width:50%;opacity:.9}"+
      "@media (max-width:380px){.tl92LogoHeader{height:36px;max-width:50vw}}"+

      /* ---- saved -ite rescue card: the saved art is the focal point ---- */
      ".lcRescue.tl92Rescue{flex-direction:column;align-items:center;text-align:center;gap:6px;padding:12px 12px 10px;cursor:pointer;position:relative;overflow:hidden;"+
        "transition:transform .18s ease,box-shadow .18s ease;-webkit-tap-highlight-color:transparent}"+
      ".lcRescue.tl92Rescue:hover{box-shadow:0 0 26px color-mix(in srgb,var(--gold,#ffd66b) 45%,transparent)}"+
      ".lcRescue.tl92Rescue:active{transform:scale(.985)}"+
      ".lcRescue.tl92Rescue:focus-visible{outline:3px solid var(--gold,#ffd66b);outline-offset:3px}"+
      ".tl92Rescue .lcRescueText{text-align:center}"+
      ".tl92Rescue .lcRescueTitle::before{content:'✅ '}"+
      "#lcRescueAvatar{position:relative;justify-content:center;max-width:100%}"+
      "#lcRescueAvatar .iteAvatar{--iteSize:min(52vw,210px,28vh)!important}"+
      "#lcRescueAvatar .iteBadge{font-size:clamp(22px,7vw,34px);right:2%;bottom:2%}"+
      "#lcRescueAvatar .iteImg{filter:drop-shadow(0 0 14px var(--gold,#ffd66b)) drop-shadow(0 8px 16px rgba(0,0,0,.45))}"+
      ".tl92Hint{margin-top:6px;font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--foam,#dff8ff);opacity:.85}"+
      /* entrances */
      ".tl92In-pop{animation:tl92Pop .8s cubic-bezier(.3,1.6,.5,1) .35s both}"+
      ".tl92In-bounce{animation:tl92Bounce 1.1s cubic-bezier(.3,.7,.4,1) .35s both}"+
      ".tl92In-rise{animation:tl92Rise .9s cubic-bezier(.2,.8,.25,1.1) .35s both}"+
      ".tl92In-burst{animation:tl92Burst .9s cubic-bezier(.2,1.4,.4,1) .35s both}"+
      /* afterglows (the entrance element's child keeps moving) */
      ".tl92Glow-glow .iteAvatar{animation:tl92GlowK 2.2s ease-in-out 1.3s infinite}"+
      ".tl92Glow-float .iteAvatar{animation:tl92FloatK 2.8s ease-in-out 1.3s infinite}"+
      ".tl92Glow-shimmer .iteAvatar{animation:tl92ShimK 1.8s ease-in-out 1.3s infinite}"+
      ".tl92Glow-splash .iteAvatar{animation:tl92FloatK 2.4s ease-in-out 1.3s infinite}"+
      "#lcRescueAvatar::before,#lcRescueAvatar::after{content:'';position:absolute;left:50%;top:50%;width:100%;aspect-ratio:1;border-radius:50%;pointer-events:none;opacity:0;transform:translate(-50%,-50%) scale(.3)}"+
      "#lcRescueAvatar::before{background:radial-gradient(circle,color-mix(in srgb,var(--gold,#ffd66b) 40%,transparent),transparent 65%)}"+
      "#lcRescueAvatar.tl92Revealed::before{animation:tl92Halo 1.4s ease-out .5s both}"+
      "#lcRescueAvatar.tl92Glow-splash::after{border:3px solid color-mix(in srgb,var(--water-bright,#2fd2ff) 80%,transparent);animation:tl92Ripple 1.3s ease-out .75s 2 both}"+
      ".tl92Glow-shimmer .iteAvatar::before{content:'';position:absolute;inset:0;z-index:3;pointer-events:none;border-radius:12px;"+
        "background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 48%,transparent 66%);background-size:250% 100%;animation:tl92Sweep 2.2s ease-in-out 1.2s infinite;mix-blend-mode:overlay}"+
      "@keyframes tl92Pop{0%{opacity:0;transform:scale(.2)}70%{opacity:1;transform:scale(1.14)}100%{opacity:1;transform:scale(1)}}"+
      "@keyframes tl92Bounce{0%{opacity:0;transform:translateY(-40%)}45%{opacity:1;transform:translateY(0)}62%{transform:translateY(-12%)}78%{transform:translateY(0)}90%{transform:translateY(-4%)}100%{opacity:1;transform:translateY(0)}}"+
      "@keyframes tl92Rise{0%{opacity:0;transform:translateY(40%) scale(.85)}100%{opacity:1;transform:none}}"+
      "@keyframes tl92Burst{0%{opacity:0;transform:scale(.3) rotate(-12deg);filter:brightness(2)}55%{opacity:1;transform:scale(1.22) rotate(4deg)}100%{opacity:1;transform:none;filter:none}}"+
      "@keyframes tl92GlowK{0%,100%{filter:drop-shadow(0 0 6px var(--gold,#ffd66b))}50%{filter:drop-shadow(0 0 24px var(--gold,#ffd66b)) brightness(1.08)}}"+
      "@keyframes tl92FloatK{0%,100%{transform:translateY(0)}50%{transform:translateY(-6%)}}"+
      "@keyframes tl92ShimK{0%,100%{filter:saturate(1)}50%{filter:saturate(1.3) brightness(1.12)}}"+
      "@keyframes tl92Sweep{0%{background-position:150% 0}100%{background-position:-100% 0}}"+
      "@keyframes tl92Halo{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}40%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.5)}}"+
      "@keyframes tl92Ripple{0%{opacity:.9;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.45)}}"+

      /* ---- saved -ite collection popout ---- */
      "#geiIteCollection{position:fixed;inset:0;z-index:10060;display:none;align-items:center;justify-content:center;box-sizing:border-box;"+
        "padding:calc(env(safe-area-inset-top) + 12px) 12px calc(env(safe-area-inset-bottom) + 12px);background:rgba(2,6,14,.82);backdrop-filter:blur(8px)}"+
      "#geiIteCollection.show{display:flex}"+
      ".tl92ColCard{position:relative;box-sizing:border-box;width:min(600px,100%);max-height:100%;overflow:auto;overscroll-behavior:contain;text-align:center;padding:18px 16px 16px;border-radius:26px;color:#fff;"+
        "background:linear-gradient(165deg,var(--juicy-navy,#0b1640) 0%,color-mix(in srgb,var(--juicy-navy,#0b1640) 60%,var(--juicy-violet,#5b2bd6)) 55%,color-mix(in srgb,var(--juicy-violet,#5b2bd6) 70%,var(--juicy-magenta,#f310ba)) 100%);"+
        "border:1.5px solid var(--gold,#ffd66b);box-shadow:0 0 50px color-mix(in srgb,var(--water-bright,#2fd2ff) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.4);animation:tl92ColIn .38s cubic-bezier(.2,1.2,.4,1) both}"+
      ".tl92ColClose{position:absolute;top:10px;right:10px;width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.3);background:rgba(0,0,0,.3);color:#fff;font:900 18px/1 inherit;cursor:pointer}"+
      ".tl92ColClose:focus-visible{outline:3px solid var(--gold,#ffd66b);outline-offset:2px}"+
      ".tl92ColEyebrow{font-size:.74rem;font-weight:900;letter-spacing:.14em;color:var(--gold,#ffd66b);text-transform:uppercase;padding:0 48px}"+
      ".tl92ColTitle{margin:4px 0 2px;font-size:clamp(1.4rem,6.5vw,2rem);font-weight:1000;letter-spacing:.04em;text-transform:uppercase;text-shadow:0 0 18px var(--water-bright,#2fd2ff)}"+
      ".tl92ColCount{font-size:.84rem;font-weight:800;color:var(--foam,#dff8ff);opacity:.92;margin-bottom:12px}"+
      ".tl92ColGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(40%,150px),1fr));gap:12px;list-style:none;margin:0;padding:0}"+
      ".tl92ColTile{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 8px 10px;border-radius:18px;background:rgba(0,0,0,.26);border:1.5px solid color-mix(in srgb,var(--gold,#ffd66b) 60%,transparent);min-width:0}"+
      ".tl92ColTile .iteAvatar{--iteSize:min(30vw,124px)!important}.tl92ColTile .iteBadge{font-size:22px}"+
      ".tl92ColTile.isLatest{box-shadow:0 0 20px color-mix(in srgb,var(--gold,#ffd66b) 45%,transparent)}"+
      ".tl92ColNew{position:absolute;top:6px;left:6px;padding:3px 7px;border-radius:999px;background:var(--gold,#ffd66b);color:var(--juicy-navy,#0b1640);font-size:.62rem;font-weight:1000;letter-spacing:.06em}"+
      ".tl92ColName{font-size:.9rem;font-weight:900;text-transform:uppercase;line-height:1.15;overflow-wrap:anywhere}"+
      ".tl92ColStatus{font-size:.7rem;font-weight:800;color:var(--foam,#dff8ff);opacity:.85}"+
      ".tl92ColEmpty{padding:18px 8px;font-weight:800;opacity:.9}"+
      ".tl92ColFoot{margin-top:12px;font-size:.76rem;font-weight:800;opacity:.8}"+
      "@keyframes tl92ColIn{0%{opacity:0;transform:scale(.9) translateY(14px)}100%{opacity:1;transform:none}}"+

      "@media (prefers-reduced-motion:reduce){"+
        "[class*='tl92In-']{animation:tl92Fade .3s ease-out both!important}"+
        "[class*='tl92Glow-'] .iteAvatar,[class*='tl92Glow-'] .iteAvatar::before,#lcRescueAvatar::before,#lcRescueAvatar::after{animation:none!important}"+
        ".tl92ColCard{animation:tl92Fade .2s ease-out both}}"+
      "@keyframes tl92Fade{0%{opacity:0;transform:scale(.96)}100%{opacity:1;transform:none}}";
    document.head.appendChild(s);
  }

  /* ---------- logos ---------- */
  function logoImg(src, cls, alt){
    var img = document.createElement("img");
    img.className = "tl92Logo " + cls;
    img.alt = alt; img.decoding = "async"; img.draggable = false;
    if(!alt) img.setAttribute("aria-hidden", "true");
    img.src = src;
    return img;
  }
  /* Replace a text wordmark with a logo; the original text comes back if the image fails. */
  function brandHost(el, src, cls){
    if(!el || el.dataset.tl92Logo) return;
    el.dataset.tl92Logo = "1";
    var img = logoImg(src, cls, BRAND);
    img.addEventListener("error", function(){
      el.classList.remove("tl92HasLogo"); el.textContent = BRAND; el.dataset.tl92Logo = "failed";
    }, { once:true });
    el.textContent = "";
    el.appendChild(img);
    el.classList.add("tl92HasLogo");
    el.setAttribute("aria-label", BRAND);
  }
  function mark(parent, before, src, cls, wrapCls){
    if(!parent || parent.querySelector("." + cls)) return;
    var img = logoImg(src, cls, "");
    img.addEventListener("error", function(){ var n = wrapCls ? img.parentNode : img; if(n && n.parentNode) n.parentNode.removeChild(n); }, { once:true });
    var node = img;
    if(wrapCls){ node = document.createElement("div"); node.className = wrapCls; node.setAttribute("aria-hidden", "true"); node.appendChild(img); }
    parent.insertBefore(node, before || parent.firstChild);
  }
  function mapHeader(){
    var t = document.querySelector("#geiDamMapPage .dmwTitle");
    if(!t) return false;
    mark(t, t.firstChild, LOGO_WET, "tl92LogoMap");
    return true;
  }
  function brandAll(){
    brandHost($("gameLogo"), LOGO_STD, "tl92LogoHeader");
    [].forEach.call(document.querySelectorAll(".geiSplashTitle"), function(el){ brandHost(el, LOGO_WET, "tl92LogoSplash"); });
    var hero = document.querySelector("#radioPanel .songVaultHero");
    if(hero) mark(hero, hero.firstChild, LOGO_STD, "tl92LogoVault");
    ["profilePanel","charactersPanel"].forEach(function(id){
      var t = document.querySelector("#" + id + " .panelTitle");
      if(t && t.parentNode && !t.parentNode.querySelector(".tl92PanelMark")) mark(t.parentNode, t.nextSibling, LOGO_STD, "tl92PanelLogo", "tl92PanelMark");
    });
    if(!mapHeader()){
      /* the DAM Map page is built lazily — add the Wet logo as soon as it exists */
      var mo = new MutationObserver(function(){ if(mapHeader()) mo.disconnect(); });
      mo.observe(document.body, { childList:true });
    }
  }

  /* ---------- saved -ite rescue card ---------- */
  var R = { reveals:0, last:"" };
  function rescueBox(){ return $("lcRescue"); }
  function enhanceRescue(){
    var box = rescueBox(); if(!box || box.dataset.tl92) return;
    box.dataset.tl92 = "1";
    box.classList.add("tl92Rescue");
    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-label", "-ite rescue complete. Open your saved -ites collection");
    box.setAttribute("aria-haspopup", "dialog");
    var text = box.querySelector(".lcRescueText");
    if(text && !text.querySelector(".tl92Hint")){
      var h = document.createElement("div"); h.className = "tl92Hint"; h.setAttribute("aria-hidden", "true");
      h.textContent = "👆 Tap to see your saved -ites";
      text.appendChild(h);
    }
    box.addEventListener("click", function(e){ e.stopPropagation(); openCollection(box); });
    box.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); e.stopPropagation(); openCollection(box); }
    });
  }
  function reveal(){
    var box = rescueBox(), av = $("lcRescueAvatar");
    if(!box || box.hidden || !av) return;
    var entrance = pick(ENTRANCES), glow = pick(AFTERGLOWS);
    av.className = av.className.replace(/\btl92(In|Glow)-\w+|\btl92Revealed\b/g, "").trim();
    void av.offsetWidth;                                           // restart the animation
    av.classList.add("tl92In-" + entrance, "tl92Glow-" + glow, "tl92Revealed");
    av.dataset.reveal = entrance + "+" + glow;
    R.reveals++; R.last = av.dataset.reveal;
  }
  function watchLevelCard(){
    var card = $("levelCard"); if(!card || card.dataset.tl92Watch) return;
    card.dataset.tl92Watch = "1";
    var was = card.classList.contains("show");
    new MutationObserver(function(){
      var now = card.classList.contains("show");
      if(now && !was) reveal();
      was = now;
      if(!now) closeCollection();
    }).observe(card, { attributes:true, attributeFilter:["class"] });
    if(was) reveal();
  }

  /* ---------- saved -ite collection popout (read-only view of the existing rescue record) ---------- */
  var C = { el:null, returnFocus:null, opens:0 };
  function savedRecord(){
    var st = game(function(){ return state.iteRescueStats; }, null) || {};
    var ids = Array.isArray(st.savedIteIds) ? st.savedIteIds.slice() : [];
    var byId = game(function(){ return ITE_BY_ID; }, {}) || {};
    var total = game(function(){ return ITES.length; }, 0);
    return { list:ids.filter(function(id){ return byId[id]; }).map(function(id){ return byId[id]; }),
             latest:st.lastSavedIteId || "", water:+st.rescuedWater || 0, total:total };
  }
  function buildCollection(){
    if(C.el) return C.el;
    var el = document.createElement("div");
    el.id = "geiIteCollection";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-labelledby", "tl92ColTitle");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<div class="tl92ColCard">'+
        '<button class="tl92ColClose" type="button" aria-label="Close saved -ites">✕</button>'+
        '<div class="tl92ColEyebrow">✅ -ITE RESCUE RECORD</div>'+
        '<h2 class="tl92ColTitle" id="tl92ColTitle">SAVED -ITES</h2>'+
        '<div class="tl92ColCount" id="tl92ColCount"></div>'+
        '<ul class="tl92ColGrid" id="tl92ColGrid"></ul>'+
        '<div class="tl92ColFoot" id="tl92ColFoot"></div>'+
      '</div>';
    /* nothing inside the popout reaches the game underneath */
    ["pointerdown","pointerup","click","touchstart","touchend"].forEach(function(t){
      el.addEventListener(t, function(e){ e.stopPropagation(); if(t === "click" && e.target === el) closeCollection(); }, t.indexOf("touch") === 0 ? { passive:true } : false);
    });
    el.querySelector(".tl92ColClose").addEventListener("click", function(e){ e.stopPropagation(); closeCollection(); });
    el.addEventListener("keydown", function(e){
      if(e.key === "Escape"){ e.preventDefault(); e.stopPropagation(); closeCollection(); return; }
      if(e.key === "Tab"){                                         // keep focus inside the popout
        var f = [].filter.call(el.querySelectorAll("button,[tabindex]:not([tabindex='-1'])"), function(n){ return n.offsetParent !== null; });
        if(!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });
    document.body.appendChild(el);
    C.el = el;
    return el;
  }
  function renderCollection(){
    var rec = savedRecord(), grid = $("tl92ColGrid");
    var fmtN = function(n){ return game(function(){ return fmt(n); }, String(n)); };
    $("tl92ColCount").textContent = rec.list.length + " of " + (rec.total || rec.list.length) + " saved · " + fmtN(rec.water) + " FL OZ water rescued";
    grid.innerHTML = "";
    if(!rec.list.length){
      var e = document.createElement("li"); e.className = "tl92ColEmpty";
      e.textContent = "No -ites saved yet — finish a full hydraulic cycle to carry one home.";
      grid.appendChild(e);
    }
    rec.list.slice().reverse().forEach(function(ite){                     // newest first
      var li = document.createElement("li");
      li.className = "tl92ColTile" + (ite.id === rec.latest ? " isLatest" : "");
      var av = game(function(){ return renderIte(ite, "saved", { size:124 }); }, null);
      if(!av){ av = document.createElement("img"); av.alt = ""; av.src = ite.imageUrl || ""; av.style.cssText = "width:124px;height:124px;object-fit:contain"; }
      li.appendChild(av);
      if(ite.id === rec.latest){ var n = document.createElement("span"); n.className = "tl92ColNew"; n.textContent = "NEW"; n.setAttribute("aria-hidden", "true"); li.appendChild(n); }
      var nm = document.createElement("div"); nm.className = "tl92ColName"; nm.textContent = ite.name; li.appendChild(nm);
      var stt = document.createElement("div"); stt.className = "tl92ColStatus"; stt.textContent = "✅ SAVED"; li.appendChild(stt);
      grid.appendChild(li);
    });
    var left = Math.max(0, (rec.total || 0) - rec.list.length);
    $("tl92ColFoot").textContent = left ? left + " -ite" + (left === 1 ? "" : "s") + " still waiting in the flow." : "Every -ite is home. Keep the water flowing.";
  }
  function openCollection(from){
    var el = buildCollection();
    renderCollection();
    C.returnFocus = from || document.activeElement;
    el.classList.add("show"); el.setAttribute("aria-hidden", "false");
    C.opens++;
    try{ window.damSurpriseCameoEngine && window.damSurpriseCameoEngine.evaluate(); }catch(e){}
    setTimeout(function(){ try{ el.querySelector(".tl92ColClose").focus({ preventScroll:true }); }catch(e){} }, 30);
  }
  function closeCollection(){
    if(!C.el || !C.el.classList.contains("show")) return;
    C.el.classList.remove("show"); C.el.setAttribute("aria-hidden", "true");
    try{ window.damSurpriseCameoEngine && window.damSurpriseCameoEngine.evaluate(); }catch(e){}
    var r = C.returnFocus; C.returnFocus = null;
    if(r && r.isConnected){ try{ r.focus({ preventScroll:true }); }catch(e){} }
  }

  function init(){
    css();
    brandAll();
    enhanceRescue();
    watchLevelCard();
  }

  window.__GEI_TAPLITES_SHOWCASE__ = {
    version:VERSION, logos:{ wet:LOGO_WET, standard:LOGO_STD },
    entrances:ENTRANCES.slice(), afterglows:AFTERGLOWS.slice(),
    openCollection:function(){ openCollection(); }, closeCollection:closeCollection,
    get collectionOpen(){ return !!(C.el && C.el.classList.contains("show")); },
    stats:function(){ return { reveals:R.reveals, lastReveal:R.last, opens:C.opens }; },
    reveal:reveal, presentationOnly:true
  };

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
  window.addEventListener("load", brandAll);
})();
