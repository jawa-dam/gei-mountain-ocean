/* V2.1.72 — TAP LITES NAME & BRANDING INTEGRATION
 * Presentation-only public identity layer.
 * Preserves DAM-ITE lore, internal identifiers, storage keys, economy,
 * gameplay, commerce, and existing character names.
 */
(function(){
  "use strict";
  var PUBLIC_NAME = "TAP LITES";
  var TAGLINE = "TAP WATER. MAKE WAVES. SAVE THE -ITES.";

  function setText(id, text){
    var el = document.getElementById(id);
    if(el) el.textContent = text;
  }

  function init(){
    try{
      if(document.title) document.title = PUBLIC_NAME + " | YALLTOO";
      setText("gameLogo", PUBLIC_NAME);

      document.querySelectorAll(".brandTag").forEach(function(el){
        el.textContent = TAGLINE;
      });

      document.querySelectorAll(".geiSplashTitle").forEach(function(el){
        el.textContent = PUBLIC_NAME;
      });

      document.documentElement.setAttribute("data-public-brand", "tap-lites");
      document.documentElement.setAttribute("data-brand-version", "2.1.72");

      window.__GEI_PUBLIC_BRAND__ = Object.freeze({
        name: PUBLIC_NAME,
        tagline: TAGLINE,
        version: "V2.1.72"
      });
    }catch(e){}
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init, {once:true});
  }else{
    init();
  }
})();