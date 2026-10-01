/* V2.1.95 — DAM-ITE VOICE EXPERIENCE UI
 * Presentation-only UI layer for GEI_VOICE_DIRECTOR.
 * Adds a compact, touch-friendly voice selector to an existing Settings/Profile surface
 * when a suitable host is present; otherwise creates a floating Voice button + popover.
 * No gameplay/economy/progression/save mutations.
 */
(function(){
  "use strict";
  if(window.__GEI_V2195_VOICE_UI__) return;

  var VERSION="V2.1.95";
  var DIRECTOR_KEY="GEI_VOICE_DIRECTOR";
  var MODES=[
    {id:"female",icon:"♀",label:"FEMALE",sub:"Friendly voice"},
    {id:"male",icon:"♂",label:"MALE",sub:"Alternate voice"},
    {id:"random",icon:"🎲",label:"RANDOM",sub:"Mix it up"},
    {id:"off",icon:"🔇",label:"OFF",sub:"Voice muted"}
  ];
  var styleId="v2195VoiceUIStyle";
  var rootId="v2195VoiceUI";
  var buttonId="v2195VoiceButton";
  var panelId="v2195VoicePanel";

  function director(){ return window[DIRECTOR_KEY]||null; }
  function currentMode(){
    try{
      var d=director();
      return d&&typeof d.getMode==="function"?d.getMode():"female";
    }catch(e){return "female";}
  }
  function setMode(mode){
    try{
      var d=director();
      if(d&&typeof d.setMode==="function") return d.setMode(mode);
    }catch(e){}
    return mode;
  }
  function labelFor(id){
    var m=MODES.find(function(x){return x.id===id;});
    return m?m.label:"VOICE";
  }

  function host(){
    /* Prefer an existing profile/settings control if the current shell exposes one.
       Never rewrite the host menu; this UI is additive. */
    return document.querySelector("#profilePanel, #settingsPanel, [data-profile-panel], [data-settings-panel]");
  }

  function css(){
    if(document.getElementById(styleId))return;
    var s=document.createElement("style");s.id=styleId;
    s.textContent=
      "#"+rootId+"{position:relative;font-family:inherit;z-index:250;}" +
      "#"+buttonId+"{appearance:none;border:1px solid rgba(255,255,255,.22);color:#fff;background:linear-gradient(135deg,rgba(47,210,255,.20),rgba(61,61,234,.22),rgba(243,16,186,.18));border-radius:16px;padding:11px 14px;min-height:46px;display:flex;align-items:center;justify-content:center;gap:9px;font-weight:900;font-size:clamp(.85rem,3.8vw,1rem);letter-spacing:.02em;box-shadow:0 8px 24px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.12);cursor:pointer;touch-action:manipulation;}" +
      "#"+buttonId+":active{transform:scale(.98)}" +
      "#"+panelId+"{position:absolute;top:calc(100% + 8px);right:0;width:min(300px,calc(100vw - 28px));padding:12px;border-radius:20px;background:rgba(8,11,22,.96);border:1px solid rgba(255,255,255,.18);box-shadow:0 18px 45px rgba(0,0,0,.42),0 0 30px rgba(47,210,255,.10);backdrop-filter:blur(20px);display:none;}" +
      "#"+panelId+".show{display:block;animation:v2195Pop .18s ease-out;}" +
      "#"+panelId+" .v2195Title{font-size:1rem;font-weight:950;letter-spacing:.05em;margin:2px 4px 10px;}" +
      "#"+panelId+" .v2195Hint{font-size:.78rem;opacity:.72;margin:0 4px 10px;}" +
      "#"+panelId+" .v2195Grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}" +
      "#"+panelId+" .v2195Option{appearance:none;color:#fff;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.12);border-radius:15px;padding:11px 9px;text-align:left;min-height:68px;cursor:pointer;touch-action:manipulation;}" +
      "#"+panelId+" .v2195Option.active{border-color:rgba(47,210,255,.75);box-shadow:0 0 0 2px rgba(47,210,255,.12),0 0 22px rgba(47,210,255,.10);background:linear-gradient(135deg,rgba(47,210,255,.13),rgba(61,61,234,.12));}" +
      "#"+panelId+" .v2195Icon{font-size:1.2rem;line-height:1;display:inline-block;margin-right:5px;}" +
      "#"+panelId+" .v2195Label{font-size:.83rem;font-weight:950;}" +
      "#"+panelId+" .v2195Sub{display:block;font-size:.68rem;opacity:.68;margin-top:3px;}" +
      "#"+panelId+" .v2195Status{margin-top:10px;padding:8px 9px;border-radius:12px;background:rgba(255,255,255,.05);font-size:.76rem;}" +
      "@keyframes v2195Pop{from{opacity:0;transform:translateY(-5px) scale(.98)}to{opacity:1;transform:none}}" +
      "@media(prefers-reduced-motion:reduce){#"+panelId+".show{animation:none}}" +
      "@media(max-width:380px){#"+panelId+"{width:calc(100vw - 20px);right:-4px;}.v2195Grid{grid-template-columns:1fr 1fr;}}";
    document.head.appendChild(s);
  }

  function build(){
    if(document.getElementById(rootId))return document.getElementById(rootId);
    var wrap=document.createElement("div");wrap.id=rootId;

    var button=document.createElement("button");
    button.type="button";button.id=buttonId;button.setAttribute("aria-expanded","false");
    button.setAttribute("aria-controls",panelId);
    button.innerHTML='<span aria-hidden="true">🎙️</span><span>DAM-ITE VOICE</span>';

    var panel=document.createElement("div");panel.id=panelId;panel.setAttribute("role","dialog");
    panel.innerHTML=
      '<div class="v2195Title">VOICE EXPERIENCE</div>'+
      '<div class="v2195Hint">Choose who speaks at milestone moments.</div>'+
      '<div class="v2195Grid">'+
      MODES.map(function(m){
        return '<button type="button" class="v2195Option" data-v2195-mode="'+m.id+'">'+
          '<span class="v2195Icon">'+m.icon+'</span><span class="v2195Label">'+m.label+'</span>'+
          '<span class="v2195Sub">'+m.sub+'</span></button>';
      }).join("")+
      '</div>'+
      '<div class="v2195Status" aria-live="polite"></div>';

    wrap.appendChild(button);wrap.appendChild(panel);

    button.addEventListener("click",function(e){
      e.stopPropagation();
      var open=panel.classList.toggle("show");
      button.setAttribute("aria-expanded",String(open));
      refresh();
    });

    panel.addEventListener("click",function(e){
      var btn=e.target.closest("[data-v2195-mode]");
      if(!btn)return;
      var mode=btn.getAttribute("data-v2195-mode");
      setMode(mode);
      refresh();
      announcePreview(mode);
    });

    document.addEventListener("click",function(e){
      if(!wrap.contains(e.target)){
        panel.classList.remove("show");
        button.setAttribute("aria-expanded","false");
      }
    });

    var h=host();
    if(h){h.appendChild(wrap);}
    else{
      wrap.style.position="fixed";
      wrap.style.right="12px";wrap.style.top="calc(env(safe-area-inset-top) + 76px)";
      document.body.appendChild(wrap);
    }
    refresh();
    return wrap;
  }

  function refresh(){
    var panel=document.getElementById(panelId);if(!panel)return;
    var mode=currentMode();
    panel.querySelectorAll("[data-v2195-mode]").forEach(function(btn){
      var active=btn.getAttribute("data-v2195-mode")===mode;
      btn.classList.toggle("active",active);
      btn.setAttribute("aria-pressed",String(active));
    });
    var status=panel.querySelector(".v2195Status");
    if(status) status.textContent="Current voice: "+labelFor(mode);
    var button=document.getElementById(buttonId);
    if(button){
      button.innerHTML='<span aria-hidden="true">'+(mode==="female"?"♀":mode==="male"?"♂":mode==="random"?"🎲":"🔇")+'</span><span>VOICE: '+labelFor(mode)+'</span>';
    }
  }

  function announcePreview(mode){
    var d=director();if(!d||typeof d.announce!=="function"||mode==="off")return;
    /* A preview is presentation-only and uses the first milestone voice. */
    setTimeout(function(){try{d.announce("mountain",{force:true});}catch(e){}},60);
  }

  function install(){
    if(!director()){
      window.addEventListener("load",function(){if(director()){css();build();}}, {once:true});
      return;
    }
    css();build();
  }

  var api={
    version:VERSION,modes:MODES.map(function(m){return m.id;}),
    refresh:refresh,open:function(){var p=document.getElementById(panelId);if(p){p.classList.add("show");refresh();}},
    close:function(){var p=document.getElementById(panelId);if(p)p.classList.remove("show");},
    presentationOnly:true
  };
  window.__GEI_V2195_VOICE_UI__=api;
  window.GEI_VOICE_UI=api;

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();