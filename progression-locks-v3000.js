/* GEI 666 — PROGRESSION LOCK SYSTEM v3000
   Implements feature locks based on completed levels:
   - Song Vault: locked until Level 1 is completed (completedLevels >= 1)
   - DAM MAP: locked until Level 1 is completed (completedLevels >= 1)
   - DAM BUILDER: locked until Level 6 is completed (completedLevels >= 6)

   Uses state.completedLevels as the authoritative progression metric.
   Persists via the existing save system. Never resets existing progress. */
(function(){
  "use strict";
  if(window.__GEI_V3000_LOCKS__) return;

  var VERSION = "V3000";
  function $(id){ return document.getElementById(id); }

  var LOCK_RULES = {
    songVault:   { required: 1, feature: "SONG VAULT",   desc: "Complete Level 1 to unlock your Song Vault.",                        icon: "🎵" },
    damMap:      { required: 1, feature: "DAM MAP",       desc: "Complete Level 1 to unlock the Mountain-to-Ocean map.",              icon: "🗺️" },
    damBuilder:  { required: 6, feature: "DAM BUILDER",   desc: "Complete Level 6 to unlock the hydraulic construction experience.",  icon: "🔨" }
  };

  /* Button/element ID mappings */
  var SONG_VAULT_BTNS = ["songVaultFloatBtn","tbSongVault"];
  var DAM_MAP_BTNS = ["damMapLauncherBtn","tbDamMap"];
  var DAM_BUILDER_BTNS = ["tbDamBuilder"];

  function getCompletedLevels(){
    try { return Math.max(0, Number(window.state && window.state.completedLevels) || 0); }
    catch(e){ return 0; }
  }

  function isUnlocked(featureKey){
    var rule = LOCK_RULES[featureKey];
    if(!rule) return true;
    return getCompletedLevels() >= rule.required;
  }

  function injectStyles(){
    if($("gei666LockStyle")) return;
    var s = document.createElement("style");
    s.id = "gei666LockStyle";
    s.textContent = [
      /* Locked button overlay */
      ".gei666Locked{position:relative;pointer-events:auto!important}",
      ".gei666Locked::after{content:'🔒';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;background:rgba(6,7,13,.65);border-radius:inherit;backdrop-filter:blur(2px);z-index:1;pointer-events:none}",
      ".gei666Locked .tapToolbarLabel,.gei666Locked .tapToolbarIcon{opacity:.4}",

      /* Lock overlay screen */
      ".gei666LockScreen{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(6,7,13,.85);backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity .3s ease}",
      ".gei666LockScreen.show{opacity:1;pointer-events:auto}",
      ".gei666LockScreenInner{text-align:center;padding:28px 24px;max-width:340px;width:90%;background:linear-gradient(135deg,rgba(26,39,68,.95),rgba(6,7,13,.98));border-radius:22px;border:2px solid rgba(47,210,255,.3);box-shadow:0 0 40px rgba(47,210,255,.15)}",
      ".gei666LockIcon{font-size:3rem;margin-bottom:12px;filter:drop-shadow(0 0 12px rgba(47,210,255,.4))}",
      ".gei666LockFeature{font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:8px;letter-spacing:.06em}",
      ".gei666LockDesc{font-size:.85rem;color:rgba(255,255,255,.75);line-height:1.5;margin-bottom:16px}",
      ".gei666LockProgress{width:100%;height:8px;border-radius:4px;background:rgba(47,210,255,.15);overflow:hidden;margin-bottom:8px}",
      ".gei666LockProgressFill{height:100%;border-radius:4px;background:linear-gradient(90deg,#2fd2ff,#f310ba);transition:width .5s ease}",
      ".gei666LockProgressText{font-size:.72rem;color:rgba(47,210,255,.8);letter-spacing:.05em;margin-bottom:16px}",
      ".gei666LockClose{padding:10px 28px;border:none;border-radius:12px;background:linear-gradient(135deg,#2fd2ff,#3d3dea);color:#fff;font-weight:700;font-size:.85rem;letter-spacing:.05em;cursor:pointer;touch-action:manipulation}",
      ".gei666LockClose:active{transform:scale(.96)}",

      /* Preview image area */
      ".gei666LockPreview{width:80px;height:80px;margin:0 auto 12px;border-radius:16px;background:linear-gradient(135deg,rgba(47,210,255,.2),rgba(243,16,186,.15));display:flex;align-items:center;justify-content:center;font-size:2.4rem;border:2px solid rgba(47,210,255,.2)}",

      /* Locked utility dock buttons */
      ".geiUtilityDock .gei666Locked::after{font-size:.9rem;border-radius:22px}"
    ].join("\n");
    document.head.appendChild(s);
  }

  /* Create the lock overlay screen */
  var lockScreen = null;
  function ensureLockScreen(){
    if(lockScreen) return lockScreen;
    lockScreen = document.createElement("div");
    lockScreen.className = "gei666LockScreen";
    lockScreen.id = "gei666LockScreen";
    lockScreen.innerHTML = '<div class="gei666LockScreenInner">' +
      '<div class="gei666LockPreview" id="gei666LockPreview">🔒</div>' +
      '<div class="gei666LockFeature" id="gei666LockFeature">LOCKED</div>' +
      '<div class="gei666LockDesc" id="gei666LockDesc">Complete more levels to unlock this feature.</div>' +
      '<div class="gei666LockProgress"><div class="gei666LockProgressFill" id="gei666LockProgressFill"></div></div>' +
      '<div class="gei666LockProgressText" id="gei666LockProgressText">0 / 1 LEVELS COMPLETE</div>' +
      '<button class="gei666LockClose" id="gei666LockClose" type="button">GOT IT</button>' +
      '</div>';
    document.body.appendChild(lockScreen);
    $("gei666LockClose").addEventListener("click", closeLockScreen);
    lockScreen.addEventListener("click", function(e){
      if(e.target === lockScreen) closeLockScreen();
    });
    return lockScreen;
  }

  function showLockScreen(featureKey){
    var rule = LOCK_RULES[featureKey];
    if(!rule) return;
    var screen = ensureLockScreen();
    var completed = getCompletedLevels();
    var pct = Math.min(100, Math.round((completed / rule.required) * 100));

    $("gei666LockPreview").textContent = rule.icon;
    $("gei666LockFeature").textContent = rule.feature;
    $("gei666LockDesc").textContent = rule.desc;
    $("gei666LockProgressFill").style.width = pct + "%";
    $("gei666LockProgressText").textContent = completed + " / " + rule.required + " LEVELS COMPLETE";

    screen.classList.add("show");
    try { $("gei666LockClose").focus({ preventScroll: true }); } catch(e){}
  }

  function closeLockScreen(){
    if(lockScreen) lockScreen.classList.remove("show");
  }

  /* Intercept clicks on locked buttons */
  function interceptClick(featureKey, btnId){
    var btn = $(btnId);
    if(!btn) return;
    if(!btn._gei666LockHandler){
      btn._gei666LockHandler = function(e){
        if(!isUnlocked(featureKey)){
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();
          showLockScreen(featureKey);
        }
      };
      btn.addEventListener("click", btn._gei666LockHandler, true);
    }
  }

  /* Update visual lock state on buttons */
  function updateLockVisuals(){
    SONG_VAULT_BTNS.forEach(function(id){
      var btn = $(id);
      if(btn) btn.classList.toggle("gei666Locked", !isUnlocked("songVault"));
    });
    DAM_MAP_BTNS.forEach(function(id){
      var btn = $(id);
      if(btn) btn.classList.toggle("gei666Locked", !isUnlocked("damMap"));
    });
    DAM_BUILDER_BTNS.forEach(function(id){
      var btn = $(id);
      if(btn) btn.classList.toggle("gei666Locked", !isUnlocked("damBuilder"));
    });
  }

  /* Intercept panel toggles for locked features */
  function hookPanelToggle(){
    if(typeof window.togglePanel !== "function") return;
    var _orig = window.togglePanel;
    window.togglePanel = function(name){
      if(name === "radio" && !isUnlocked("songVault")){
        showLockScreen("songVault");
        return;
      }
      return _orig.apply(this, arguments);
    };
  }

  /* Hook DamBuilder.open */
  function hookDamBuilder(){
    function checkAndHook(){
      if(window.DamBuilder && typeof window.DamBuilder.open === "function" && !window.DamBuilder._gei666Hooked){
        var _orig = window.DamBuilder.open;
        window.DamBuilder.open = function(){
          if(!isUnlocked("damBuilder")){
            showLockScreen("damBuilder");
            return;
          }
          return _orig.apply(this, arguments);
        };
        window.DamBuilder._gei666Hooked = true;
      }
    }
    checkAndHook();
    setTimeout(checkAndHook, 2000);
    setTimeout(checkAndHook, 5000);
  }

  /* Hook DAM MAP open */
  function hookDamMap(){
    function checkAndHook(){
      if(window.__GEI_V2170_DAM_MAP__ && typeof window.__GEI_V2170_DAM_MAP__.open === "function" && !window.__GEI_V2170_DAM_MAP__._gei666Hooked){
        var _orig = window.__GEI_V2170_DAM_MAP__.open;
        window.__GEI_V2170_DAM_MAP__.open = function(){
          if(!isUnlocked("damMap")){
            showLockScreen("damMap");
            return;
          }
          return _orig.apply(this, arguments);
        };
        window.__GEI_V2170_DAM_MAP__._gei666Hooked = true;
      }
    }
    checkAndHook();
    setTimeout(checkAndHook, 2000);
    setTimeout(checkAndHook, 5000);
  }

  /* Listen for level completion to auto-unlock */
  function watchLevelCompletion(){
    window.addEventListener("gei:xp-event", function(e){
      if(e.detail && e.detail.kind === "reward"){
        setTimeout(updateLockVisuals, 100);
      }
    });

    /* Also poll periodically to catch save loads */
    setInterval(updateLockVisuals, 3000);
  }

  function init(){
    injectStyles();

    /* Set up click interceptors */
    SONG_VAULT_BTNS.forEach(function(id){ interceptClick("songVault", id); });
    DAM_MAP_BTNS.forEach(function(id){ interceptClick("damMap", id); });
    DAM_BUILDER_BTNS.forEach(function(id){ interceptClick("damBuilder", id); });

    hookPanelToggle();
    hookDamBuilder();
    hookDamMap();
    updateLockVisuals();
    watchLevelCompletion();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 1500);

  window.__GEI_V3000_LOCKS__ = {
    version: VERSION,
    rules: LOCK_RULES,
    isUnlocked: isUnlocked,
    updateVisuals: updateLockVisuals,
    selfTest: function(){
      var completed = getCompletedLevels();
      return {
        completedLevels: completed,
        songVaultUnlocked: isUnlocked("songVault"),
        damMapUnlocked: isUnlocked("damMap"),
        damBuilderUnlocked: isUnlocked("damBuilder"),
        lockScreenExists: !!lockScreen,
        stylesInjected: !!$("gei666LockStyle")
      };
    }
  };
})();
