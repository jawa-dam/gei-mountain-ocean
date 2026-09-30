/* V2.1.73 — TAP LITES FIRST-IMPRESSION POLISH
 * Presentation-only. Never mutates gameplay, economy, progress, PayPal, or storage.
 */
(function(){
  "use strict";

  var BRAND="TAP LITES";
  var TAGLINE="TAP WATER. MAKE WAVES. SAVE THE -ITES.";
  var accents=[
    {name:"WATER",glyph:"💧"},
    {name:"WAVE",glyph:"🌊"},
    {name:"SPLASH",glyph:"✨"},
    {name:"FLOW",glyph:"🫧"},
    {name:"NATURE",glyph:"🐦"}
  ];

  function style(){
    if(document.getElementById("tapLites2173Style")) return;
    var css=document.createElement("style");
    css.id="tapLites2173Style";
    css.textContent=
      ".tl2173BrandGlow{position:relative;display:inline-block;will-change:transform,filter;animation:tl2173Breath 3.8s ease-in-out infinite}"+
      ".tl2173BrandGlow::after{content:"";position:absolute;inset:-18%;border-radius:999px;pointer-events:none;"+
      "background:radial-gradient(circle,rgba(47,210,255,.24),rgba(61,61,234,.10) 42%,transparent 72%);"+
      "filter:blur(10px);opacity:.7;animation:tl2173Glow 3.2s ease-in-out infinite}"+
      ".tl2173BrandReveal{animation:tl2173Reveal .8s cubic-bezier(.2,.8,.2,1) both}"+
      ".tl2173Tagline{opacity:.92;letter-spacing:.11em;animation:tl2173Tag .95s .15s ease both}"+
      ".tl2173Waterline{position:absolute;left:50%;bottom:-13px;width:76%;height:4px;transform:translateX(-50%);border-radius:99px;"+
      "background:linear-gradient(90deg,transparent,#2fd2ff,#f310ba,#2fd2ff,transparent);background-size:200% 100%;"+
      "box-shadow:0 0 14px rgba(47,210,255,.58);animation:tl2173Waterline 2.5s linear infinite;pointer-events:none}"+
      ".tl2173OpeningStamp{position:fixed;left:50%;top:calc(50% + 74px);transform:translate(-50%,8px) scale(.96);z-index:9998;"+
      "padding:8px 14px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(6,7,13,.66);"+
      "backdrop-filter:blur(10px);font:700 11px/1.1 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;"+
      "color:#eafcff;opacity:0;pointer-events:none;transition:opacity .35s,transform .45s}"+
      ".tl2173OpeningStamp.show{opacity:1;transform:translate(-50%,0) scale(1)}"+
      ".tl2173FirstTap{animation:tl2173Tap .3s ease-out!important}"+
      "@keyframes tl2173Breath{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.018);filter:brightness(1.08)}}"+
      "@keyframes tl2173Glow{0%,100%{transform:scale(.92);opacity:.45}50%{transform:scale(1.08);opacity:.82}}"+
      "@keyframes tl2173Reveal{0%{opacity:0;transform:translateY(12px) scale(.94);filter:blur(5px)}100%{opacity:1;transform:none;filter:none}}"+
      "@keyframes tl2173Tag{0%{opacity:0;letter-spacing:.2em}100%{opacity:.92;letter-spacing:.11em}}"+
      "@keyframes tl2173Waterline{to{background-position:200% 0}}"+
      "@keyframes tl2173Tap{0%{transform:scale(1)}45%{transform:scale(1.045)}100%{transform:scale(1)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2173BrandGlow,.tl2173BrandGlow::after,.tl2173BrandReveal,.tl2173Tagline,.tl2173Waterline,.tl2173FirstTap{animation:none!important}}";
    document.head.appendChild(css);
  }

  function pick(){
    return accents[Math.floor(Math.random()*accents.length)];
  }

  function apply(){
    style();

    document.title=BRAND+" | YALLTOO";

    var logo=document.getElementById("gameLogo");
    if(logo){
      logo.textContent=BRAND;
      logo.classList.add("tl2173BrandReveal","tl2173BrandGlow");
      var line=document.createElement("span");
      line.className="tl2173Waterline";
      logo.appendChild(line);
    }

    document.querySelectorAll(".brandTag").forEach(function(el){
      el.textContent=TAGLINE;
      el.classList.add("tl2173Tagline");
    });

    document.querySelectorAll(".geiSplashTitle").forEach(function(el){
      el.textContent=BRAND;
      el.classList.add("tl2173BrandReveal","tl2173BrandGlow");
      if(!el.querySelector(".tl2173Waterline")){
        var line2=document.createElement("span");
        line2.className="tl2173Waterline";
        el.appendChild(line2);
      }
    });

    var splash=document.getElementById("geiSplash");
    if(splash){
      var accent=pick();
      var stamp=document.createElement("div");
      stamp.className="tl2173OpeningStamp";
      stamp.textContent=accent.glyph+" "+accent.name+" MODE";
      splash.appendChild(stamp);
      requestAnimationFrame(function(){setTimeout(function(){stamp.classList.add("show")},240)});
      setTimeout(function(){stamp.classList.remove("show")},1800);
    }

    var interacted=false;
    function firstTap(e){
      if(interacted)return;
      if(e && e.target && e.target.closest && e.target.closest(".tl2173OpeningStamp"))return;
      interacted=true;
      [logo].filter(Boolean).forEach(function(el){
        el.classList.remove("tl2173FirstTap"); void el.offsetWidth; el.classList.add("tl2173FirstTap");
      });
      document.removeEventListener("pointerdown",firstTap,true);
    }
    document.addEventListener("pointerdown",firstTap,true);
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",apply,{once:true});
  else apply();

  window.__GEI_TAP_LITES_FIRST_IMPRESSION__=Object.freeze({
    version:"V2.1.73",
    brand:BRAND,
    tagline:TAGLINE,
    presentationOnly:true
  });
})();