/* V2.6.00 — APPEARANCE MODE SELECTOR
 * Adds a small skin-mode button to the utility dock.
 * Cycles: SURPRISE ME → PLAYFUL FLOW → PREMIUM FLOW
 * Saves preference to localStorage. Reloads page on change.
 * Presentation-only: no gameplay, economy, save or entitlement code is touched.
 */
(function(){
  "use strict";
  if(window.__GEI_V2600_APPEARANCE__)return;
  var VERSION="V2.6.00";
  var MODES=[
    {id:"surprise", label:"SURPRISE ME", icon:"🎲", desc:"Both collections"},
    {id:"playful",  label:"PLAYFUL",     icon:"🌈", desc:"Colorful skins"},
    {id:"premium",  label:"PREMIUM",     icon:"🌙", desc:"Sophisticated skins"}
  ];

  function currentMode(){
    try{ var m=localStorage.getItem("ytSkinMode"); if(m&&["surprise","playful","premium"].indexOf(m)>=0) return m; }catch(e){}
    return "surprise";
  }

  function modeIndex(id){
    for(var i=0;i<MODES.length;i++) if(MODES[i].id===id) return i;
    return 0;
  }

  function $(id){return document.getElementById(id);}

  function css(){
    if($("geiAppearance2600Style"))return;
    var s=document.createElement("style");
    s.id="geiAppearance2600Style";
    s.textContent=
      "#geiAppearanceBtn{display:flex;flex-direction:column;align-items:center;justify-content:center;"+
      "width:42px!important;height:42px!important;min-width:42px;min-height:42px;border-radius:50%!important;"+
      "border:1.5px solid var(--glassBorder,rgba(47,210,255,.25));"+
      "background:var(--panel,rgba(255,255,255,.92));color:var(--world-text,#1a2744);"+
      "font-size:.75rem;font-weight:700;cursor:pointer;touch-action:manipulation;pointer-events:auto;"+
      "transition:transform .15s,box-shadow .15s;box-shadow:0 2px 8px rgba(0,0,0,.15);margin-top:4px}"+
      "#geiAppearanceBtn:active{transform:scale(.92)}"+
      "#geiAppearanceBtn .geiAppIcon{font-size:1.1rem;line-height:1}"+
      "#geiAppearanceBtn .geiAppLabel{font-size:.42rem;letter-spacing:.03em;opacity:.8;margin-top:1px}"+
      ".geiAppearanceToast{position:fixed;left:50%;top:80px;transform:translateX(-50%) translateY(-8px);z-index:10000;"+
      "padding:10px 20px;border-radius:14px;background:var(--panel,rgba(255,255,255,.92));"+
      "border:1px solid var(--glassBorder,rgba(47,210,255,.25));"+
      "color:var(--world-text,#1a2744);font:700 13px/1.3 system-ui,sans-serif;text-align:center;"+
      "box-shadow:0 4px 20px rgba(0,0,0,.2);opacity:0;pointer-events:none;"+
      "transition:opacity .3s,transform .3s}"+
      ".geiAppearanceToast.show{opacity:1;transform:translateX(-50%) translateY(0)}"+
      ".geiAppearanceToast .geiToastDesc{font-weight:400;font-size:11px;opacity:.7;margin-top:2px}"+
      "@media(max-width:430px){#geiAppearanceBtn{width:36px!important;height:36px!important;min-width:36px;min-height:36px}"+
      "#geiAppearanceBtn .geiAppIcon{font-size:.95rem}#geiAppearanceBtn .geiAppLabel{font-size:.38rem}}"+
      "@media(max-height:620px){#geiAppearanceBtn{width:34px!important;height:34px!important;min-width:34px;min-height:34px}}"+
      "@media(prefers-reduced-motion:reduce){.geiAppearanceToast{transition:none!important}}";
    document.head.appendChild(s);
  }

  function showToast(mode){
    var old=$("geiAppearanceToast");
    if(old)old.remove();
    var t=document.createElement("div");
    t.id="geiAppearanceToast";
    t.className="geiAppearanceToast";
    t.innerHTML="<div>"+mode.icon+" "+mode.label+"</div><div class=\"geiToastDesc\">"+mode.desc+"</div>";
    document.body.appendChild(t);
    requestAnimationFrame(function(){setTimeout(function(){t.classList.add("show")},20)});
    setTimeout(function(){
      t.classList.remove("show");
      setTimeout(function(){if(t.parentNode)t.remove()},400);
    },1400);
  }

  function cycle(){
    var cur=currentMode();
    var idx=(modeIndex(cur)+1)%MODES.length;
    var next=MODES[idx];
    try{localStorage.setItem("ytSkinMode",next.id);}catch(e){}
    showToast(next);
    setTimeout(function(){location.reload()},800);
  }

  function build(){
    var dock=$("geiUtilityDock");
    if(!dock||$("geiAppearanceBtn"))return false;
    css();
    var btn=document.createElement("button");
    btn.id="geiAppearanceBtn";
    btn.setAttribute("aria-label","Change appearance mode");
    var m=MODES[modeIndex(currentMode())];
    btn.title="Appearance: "+m.label;
    btn.innerHTML="<span class=\"geiAppIcon\" aria-hidden=\"true\">"+m.icon+"</span><span class=\"geiAppLabel\">SKIN</span>";
    btn.addEventListener("click",function(e){e.stopPropagation();cycle();});
    dock.appendChild(btn);
    return true;
  }

  function boot(){
    if(!build()){
      var tries=0;
      var iv=setInterval(function(){
        if(build()||++tries>30)clearInterval(iv);
      },300);
    }
  }

  window.__GEI_V2600_APPEARANCE__=Object.freeze({
    version:VERSION,
    currentMode:currentMode,
    modes:MODES.slice(),
    presentationOnly:true
  });
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
  window.addEventListener("load",function(){build()});
})();
