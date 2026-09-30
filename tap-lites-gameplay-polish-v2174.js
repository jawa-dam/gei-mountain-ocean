/* V2.1.74 — TAP LITES GAMEPLAY POLISH
 * Presentation-only enhancement layer.
 * Does not alter tap counts, FL OZ, progression, timers, unlocks, purchases, or save data.
 */
(function(){
  "use strict";

  var state2174={
    taps:0,lastTap:0,streak:0,bpm:0,burst:0,raf:0,
    lastBurst:0
  };

  function css(){
    if(document.getElementById("tapLites2174Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2174Style";
    s.textContent=
      ".tl2174Pulse{position:fixed;inset:0;pointer-events:none;z-index:9988;opacity:0;"+
      "background:radial-gradient(circle at var(--tlx,50%) var(--tly,50%),rgba(47,210,255,.24),rgba(61,61,234,.09) 18%,transparent 45%);"+
      "transform:scale(.82);mix-blend-mode:screen}"+
      ".tl2174Pulse.on{animation:tl2174Pulse .42s cubic-bezier(.18,.8,.25,1) both}"+
      ".tl2174Ripple{position:fixed;width:24px;height:24px;border:2px solid rgba(234,252,255,.8);border-radius:50%;"+
      "pointer-events:none;z-index:9990;transform:translate(-50%,-50%) scale(.4);opacity:0;box-shadow:0 0 16px rgba(47,210,255,.45)}"+
      ".tl2174Ripple.on{animation:tl2174Ripple .7s ease-out both}"+
      ".tl2174Combo{position:fixed;left:50%;bottom:16%;transform:translate(-50%,12px) scale(.96);z-index:9989;"+
      "padding:7px 13px;border-radius:999px;background:rgba(6,7,13,.62);border:1px solid rgba(255,255,255,.16);"+
      "backdrop-filter:blur(10px);font:800 12px/1 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;"+
      "color:#eafcff;opacity:0;pointer-events:none;transition:opacity .2s,transform .35s}"+
      ".tl2174Combo.show{opacity:1;transform:translate(-50%,0) scale(1)}"+
      ".tl2174Combo.hot{box-shadow:0 0 28px rgba(47,210,255,.24),inset 0 0 18px rgba(243,16,186,.08)}"+
      ".tl2174TapReady{animation:tl2174Ready 1.8s ease-in-out infinite}"+
      "@keyframes tl2174Pulse{0%{opacity:0;transform:scale(.82)}18%{opacity:.7}100%{opacity:0;transform:scale(1.18)}}"+
      "@keyframes tl2174Ripple{0%{opacity:.9;transform:translate(-50%,-50%) scale(.35)}100%{opacity:0;transform:translate(-50%,-50%) scale(4.2)}}"+
      "@keyframes tl2174Ready{0%,100%{filter:drop-shadow(0 0 0 rgba(47,210,255,0))}50%{filter:drop-shadow(0 0 12px rgba(47,210,255,.5))}}"+
      "@media (prefers-reduced-motion:reduce){.tl2174Pulse.on,.tl2174Ripple.on,.tl2174TapReady{animation:none!important}.tl2174Pulse,.tl2174Ripple{display:none!important}}";
    document.head.appendChild(s);
  }

  function ensureLayers(){
    var pulse=document.getElementById("tl2174Pulse");
    if(!pulse){
      pulse=document.createElement("div");
      pulse.id="tl2174Pulse";
      pulse.className="tl2174Pulse";
      document.body.appendChild(pulse);
    }
    var combo=document.getElementById("tl2174Combo");
    if(!combo){
      combo=document.createElement("div");
      combo.id="tl2174Combo";
      combo.className="tl2174Combo";
      document.body.appendChild(combo);
    }
    return {pulse:pulse,combo:combo};
  }

  function splashAt(x,y){
    var p=ensureLayers(),pulse=p.pulse;
    pulse.style.setProperty("--tlx",x+"px");
    pulse.style.setProperty("--tly",y+"px");
    pulse.classList.remove("on"); void pulse.offsetWidth; pulse.classList.add("on");

    var r=document.createElement("div");
    r.className="tl2174Ripple";
    r.style.left=x+"px"; r.style.top=y+"px";
    document.body.appendChild(r);
    r.classList.add("on");
    setTimeout(function(){r.remove()},760);
  }

  function updateCombo(){
    var now=performance.now();
    if(now-state2174.lastTap<900){
      state2174.streak++;
    }else{
      state2174.streak=1;
    }
    state2174.lastTap=now;
    var c=ensureLayers().combo;
    var n=state2174.streak;
    if(n<3){c.classList.remove("show","hot");return;}
    var label=n>=12?"HYDRAULIC FRENZY":n>=8?"RAPID FLOW":n>=5?"FLOW COMBO":"FLOW START";
    c.textContent=(n+"× "+label);
    c.classList.toggle("hot",n>=8);
    c.classList.add("show");
    clearTimeout(c._hide);
    c._hide=setTimeout(function(){c.classList.remove("show","hot")},900);
  }

  function wakeCharacter(){
    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction("rapid",Math.min(1.5,0.85+state2174.streak*.04));
      }else if(typeof window.geiCharacterSpotlightReact==="function"){
        window.geiCharacterSpotlightReact("tap",1);
      }
    }catch(e){}
  }

  function markTapReady(){
    var logo=document.getElementById("gameLogo");
    if(!logo)return;
    if(state2174.streak>=5)logo.classList.add("tl2174TapReady");
    else logo.classList.remove("tl2174TapReady");
  }

  function onPointer(e){
    if(e.button!==undefined && e.button!==0)return;
    var t=e.target;
    if(t && t.closest && t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,.modal,.dialog,button,a,input,select,textarea"
    ))return;

    var x=e.clientX || window.innerWidth/2;
    var y=e.clientY || window.innerHeight/2;
    splashAt(x,y);
    updateCombo();
    markTapReady();
    if(state2174.streak>=3)wakeCharacter();

    var now=performance.now();
    if(now-state2174.lastBurst>1800){
      state2174.lastBurst=now;
      try{
        if(typeof window.triggerDamIteHydraulicReaction==="function"){
          window.triggerDamIteHydraulicReaction(1);
        }
      }catch(err){}
    }
  }

  function startup(){
    css();
    ensureLayers();
    document.addEventListener("pointerdown",onPointer,true);
    window.__GEI_TAP_LITES_GAMEPLAY_POLISH__=Object.freeze({
      version:"V2.1.74",
      presentationOnly:true,
      features:["tap-pulse","ripple","flow-combo","character-wake"]
    });
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",startup,{once:true});
  }else startup();
})();