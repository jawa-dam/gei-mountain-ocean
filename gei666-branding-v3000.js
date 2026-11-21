/* GEI 666 — OFFICIAL BRANDING MODULE v3000
   Integrates the official GEI 666 logo throughout the game.
   Presentation-only: no gameplay, economy, or progression state is changed. */
(function(){
  "use strict";
  if(window.__GEI_V3000_BRANDING__) return;

  var LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-yalltoo-666-9qoyhEUbsZmy89kI.png";
  var VERSION = "V3000";

  function $(id){ return document.getElementById(id); }

  /* Preload the logo so it's cached for all uses */
  var logoImg = new Image();
  logoImg.src = LOGO_URL;

  function injectStyles(){
    if($("gei666BrandStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666BrandStyle";
    s.textContent = [
      /* Logo base class */
      ".gei666Logo{display:inline-block;background:url('" + LOGO_URL + "') center/contain no-repeat;image-rendering:auto}",
      ".gei666LogoImg{max-width:100%;height:auto;object-fit:contain;image-rendering:auto}",

      /* Toolbar brand logo */
      ".tapToolbarBrand{display:flex!important;align-items:center;gap:0}",
      ".tapToolbarBrandLogo{width:40px;height:40px;flex-shrink:0}",
      ".tapToolbarBrandLogo img{width:100%;height:100%;object-fit:contain}",

      /* Splash screen logo */
      ".geiSplashBrandLogo{width:min(220px,55vw);height:auto;margin:0 auto 8px;display:block;filter:drop-shadow(0 0 24px rgba(47,210,255,.5)) drop-shadow(0 0 8px rgba(243,16,186,.3));animation:gei666LogoPulse 3s ease-in-out infinite}",
      "@keyframes gei666LogoPulse{0%,100%{filter:drop-shadow(0 0 24px rgba(47,210,255,.5)) drop-shadow(0 0 8px rgba(243,16,186,.3));transform:scale(1)}50%{filter:drop-shadow(0 0 36px rgba(47,210,255,.7)) drop-shadow(0 0 16px rgba(243,16,186,.5));transform:scale(1.03)}}",

      /* DAM MACHINE logo */
      ".dmBrandLogo{width:min(160px,42vw);height:auto;margin:0 auto 6px;display:block;filter:drop-shadow(0 0 12px rgba(47,210,255,.4))}",

      /* Waterwheel bonus logo */
      ".bwBrandLogo{width:min(100px,28vw);height:auto;margin:0 auto 4px;display:block;filter:drop-shadow(0 0 8px rgba(47,210,255,.3))}",

      /* Level completion logo */
      ".lcBrandLogo{width:min(120px,32vw);height:auto;margin:0 auto 8px;display:block;filter:drop-shadow(0 0 16px rgba(255,215,106,.5));animation:gei666LcGlow 2s ease-in-out infinite}",
      "@keyframes gei666LcGlow{0%,100%{filter:drop-shadow(0 0 16px rgba(255,215,106,.5))}50%{filter:drop-shadow(0 0 28px rgba(255,215,106,.8))}}",

      /* Song Vault logo */
      ".svBrandLogo{width:min(100px,26vw);height:auto;margin:0 auto 4px;display:block;opacity:.85}",

      /* DAM MAP logo */
      ".mapBrandLogo{width:min(110px,30vw);height:auto;margin:0 auto 4px;display:block;filter:drop-shadow(0 0 8px rgba(47,210,255,.3))}",

      /* Profile logo */
      ".profileBrandLogo{width:min(100px,26vw);height:auto;margin:0 auto 8px;display:block;opacity:.9}",

      /* Credits / info */
      ".creditsBrandLogo{width:min(80px,22vw);height:auto;margin:4px auto;display:block;opacity:.7}",

      /* Reduced motion */
      "@media (prefers-reduced-motion:reduce){.geiSplashBrandLogo,.lcBrandLogo{animation:none!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  function createLogoEl(className){
    var img = document.createElement("img");
    img.src = LOGO_URL;
    img.alt = "GEI 666";
    img.className = "gei666LogoImg " + (className || "");
    img.draggable = false;
    img.setAttribute("aria-hidden","true");
    return img;
  }

  /* 1. TOOLBAR BRAND — replace text "GEI 6" with logo */
  function brandToolbar(){
    var tb = $("tapToolbar");
    if(!tb) return;
    var brand = tb.querySelector(".tapToolbarBrand");
    if(!brand || brand.dataset.gei666) return;
    brand.dataset.gei666 = "1";
    brand.innerHTML = "";
    var wrap = document.createElement("span");
    wrap.className = "tapToolbarBrandLogo";
    wrap.appendChild(createLogoEl());
    brand.appendChild(wrap);
  }

  /* 2. SPLASH SCREEN — add logo above title */
  function brandSplash(){
    var splash = $("geiSplash");
    if(!splash || splash.dataset.gei666) return;
    splash.dataset.gei666 = "1";
    var brandBox = splash.querySelector(".geiSplashBrand");
    if(brandBox){
      var logo = createLogoEl("geiSplashBrandLogo");
      brandBox.insertBefore(logo, brandBox.firstChild);
      var title = brandBox.querySelector(".geiSplashTitle");
      if(title) title.textContent = "GEI 666";
      var eyebrow = brandBox.querySelector(".geiSplashEyebrow");
      if(eyebrow) eyebrow.textContent = "GENESIS ENGINEERED INFRASTRUCTURE";
    }
  }

  /* 3. DAM MACHINE — add logo above title */
  function brandDamMachine(){
    var card = $("damMachineCard");
    if(!card || card.dataset.gei666) return;
    card.dataset.gei666 = "1";
    var title = $("dmTitle");
    if(title){
      title.parentNode.insertBefore(createLogoEl("dmBrandLogo"), title);
      title.textContent = "THE HYDRAULIC DAM MACHINE";
    }
    var eyebrow = card.querySelector(".bwEyebrow");
    if(eyebrow) eyebrow.textContent = "GEI 666 — FREE HYDRAULIC ARCADE";
  }

  /* 4. BONUS WATERWHEEL — add logo */
  function brandWaterwheel(){
    var card = $("bonusCard");
    if(!card || card.dataset.gei666) return;
    card.dataset.gei666 = "1";
    var title = $("bwTitle");
    if(title){
      title.parentNode.insertBefore(createLogoEl("bwBrandLogo"), title);
    }
  }

  /* 5. LEVEL COMPLETION — add logo */
  function brandLevelCard(){
    var card = $("levelCard");
    if(!card || card.dataset.gei666) return;
    card.dataset.gei666 = "1";
    var eyebrow = card.querySelector(".lcEyebrow");
    if(eyebrow){
      eyebrow.parentNode.insertBefore(createLogoEl("lcBrandLogo"), eyebrow);
      eyebrow.textContent = "GEI 666 — HYDRAULIC CYCLE COMPLETE";
    }
  }

  /* 6. SONG VAULT */
  function brandSongVault(){
    var panel = $("radioPanel");
    if(!panel || panel.dataset.gei666) return;
    panel.dataset.gei666 = "1";
    var title = panel.querySelector(".panelTitle");
    if(title) title.parentNode.insertBefore(createLogoEl("svBrandLogo"), title);
  }

  /* 7. PROFILE */
  function brandProfile(){
    var panel = $("profilePanel");
    if(!panel || panel.dataset.gei666) return;
    panel.dataset.gei666 = "1";
    var title = panel.querySelector(".panelTitle");
    if(title) title.parentNode.insertBefore(createLogoEl("profileBrandLogo"), title);
  }

  /* 8. STORE */
  function brandStore(){
    var panel = $("storePanel");
    if(!panel || panel.dataset.gei666) return;
    panel.dataset.gei666 = "1";
    var hero = panel.querySelector(".storeFrontHeroTitle");
    if(hero){
      var logo = createLogoEl("svBrandLogo");
      hero.parentNode.insertBefore(logo, hero);
    }
  }

  /* 9. PRE-GAME GUIDE */
  function brandGuide(){
    var card = $("preGameCard");
    if(!card || card.dataset.gei666) return;
    card.dataset.gei666 = "1";
    var title = $("preGameTitle");
    if(title){
      title.parentNode.insertBefore(createLogoEl("svBrandLogo"), title);
      title.textContent = "GEI 666 — DAM-ITE COMMAND GUIDE";
    }
  }

  /* 10. PAGE TITLE */
  function brandPageTitle(){
    document.title = "GEI 666 | MOUNTAIN TO OCEAN";
  }

  function brandAll(){
    injectStyles();
    brandToolbar();
    brandSplash();
    brandDamMachine();
    brandWaterwheel();
    brandLevelCard();
    brandSongVault();
    brandProfile();
    brandStore();
    brandGuide();
    brandPageTitle();
  }

  /* Run on load and periodically to catch late-rendered elements */
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", brandAll);
  } else {
    brandAll();
  }
  setTimeout(brandAll, 500);
  setTimeout(brandAll, 2000);
  setTimeout(brandAll, 5000);

  window.__GEI_V3000_BRANDING__ = {
    version: VERSION,
    logoUrl: LOGO_URL,
    createLogoEl: createLogoEl,
    brandAll: brandAll,
    selfTest: function(){
      var checks = {
        toolbar: !!($("tapToolbar") && $("tapToolbar").querySelector(".tapToolbarBrandLogo")),
        splash: !!($("geiSplash") && $("geiSplash").dataset.gei666),
        damMachine: !!($("damMachineCard") && $("damMachineCard").dataset.gei666),
        waterwheel: !!($("bonusCard") && $("bonusCard").dataset.gei666),
        levelCard: !!($("levelCard") && $("levelCard").dataset.gei666),
        songVault: !!($("radioPanel") && $("radioPanel").dataset.gei666),
        profile: !!($("profilePanel") && $("profilePanel").dataset.gei666),
        pageTitle: document.title.indexOf("666") >= 0
      };
      checks.allBranded = Object.keys(checks).every(function(k){ return checks[k]; });
      return checks;
    }
  };
})();
