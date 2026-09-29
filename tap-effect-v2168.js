/* =========================================================
   V2.1.68 — TAP EFFECT VISIBILITY & POINTER-LAYER REPAIR
   Presentation-only guard for the global hydraulic tap layer.
   Never intercepts input and never touches gameplay/economy authority.
========================================================= */
(function(){
  "use strict";
  const VERSION = "2.1.68";
  const SELECTOR = "#tapWaterLayer";
  const TARGET_Z = 130;

  function layer(){
    return document.querySelector(SELECTOR);
  }

  function repair(){
    const el = layer();
    if(!el) return false;

    /* Keep the layer attached to body so fixed coordinates match clientX/clientY. */
    if(el.parentElement !== document.body) document.body.appendChild(el);

    el.style.setProperty("position","fixed","important");
    el.style.setProperty("inset","0","important");
    el.style.setProperty("z-index",String(TARGET_Z),"important");
    el.style.setProperty("pointer-events","none","important");
    el.style.setProperty("overflow","hidden","important");
    el.style.setProperty("isolation","isolate");
    el.style.setProperty("contain","layout paint");
    el.style.setProperty("transform","translateZ(0)");

    el.querySelectorAll("*").forEach(node=>{
      node.style.setProperty("pointer-events","none","important");
    });
    return true;
  }

  function selfTest(){
    const el = layer();
    if(!el) return {version:VERSION,ok:false,reason:"tapWaterLayer missing"};
    const cs = getComputedStyle(el);
    const z = Number.parseInt(cs.zIndex,10);
    return {
      version:VERSION,
      ok: cs.pointerEvents === "none" &&
          cs.position === "fixed" &&
          Number.isFinite(z) && z >= TARGET_Z &&
          el.parentElement === document.body,
      pointerEvents:cs.pointerEvents,
      position:cs.position,
      zIndex:z,
      parent:el.parentElement && el.parentElement.tagName
    };
  }

  function boot(){
    repair();
    window.__GEI_V2168_TAP_LAYER__ = Object.freeze({
      version:VERSION,
      repair,
      selfTest,
      targetZ:TARGET_Z
    });
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();
