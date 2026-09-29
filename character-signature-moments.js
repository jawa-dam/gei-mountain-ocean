/* V2.1.56 — CHARACTER SIGNATURE MOMENTS
   Each character owns one unmistakable visual "that's THEIR move" moment.
   Presentation-only: never mutates FL OZ, purchases, progression, ownership,
   activeCharacter, or economy authority.

   Strong-flow trigger:
   - 7+ real gameplay taps inside 2.2 seconds
   - randomized appearance chance so it stays surprising
   - per-moment cooldown prevents spam
   - respects reduced-motion preferences
*/
(function(){
  "use strict";

  const VERSION = "2.1.56";
  const TRIGGER = Object.freeze({
    tapsNeeded: 7,
    windowMs: 2200,
    chance: 0.34,
    cooldownMs: 8200,
    maxBurstMs: 1450
  });

  const SIGNATURES = Object.freeze({
    "wilbert-dam-guide":       {name:"THE GUIDE'S FLOW CHECK", emoji:"🧭", cls:"guide",  line:"Follow the flow."},
    "yall-too-beaver":         {name:"THE BEAVER BUILD",       emoji:"🦫", cls:"builder",line:"Build it. Hold it. Flow it."},
    "operator-fireman":        {name:"THE RESCUE RUSH",        emoji:"🚒", cls:"rescue", line:"Pressure under control!"},
    "operator-moses":          {name:"THE PARTING FLOW",       emoji:"🌊", cls:"moses",   line:"Make way for the water!"},
    "operator-valentine":      {name:"THE HEARTBEAT FLOW",    emoji:"💗", cls:"heart",   line:"Flow with heart."},
    "operator-sam":            {name:"THE WATCHMAN SCAN",      emoji:"👀", cls:"watch",   line:"I saw that flow."},
    "operator-jack-o-lantern": {name:"THE SPOOKY SURGE",       emoji:"🎃", cls:"pumpkin", line:"The DAM is alive!"},
    "operator-santa-claus":   {name:"THE FLOW GIFT",           emoji:"🎅", cls:"santa",   line:"A little flow for everybody!"},
    "operator-woman":          {name:"THE DAM NATION WAVE",    emoji:"👩", cls:"wave",    line:"Keep it moving!"},
    "operator-man":            {name:"THE DAM NATION WAVE",    emoji:"👨", cls:"wave",    line:"That's DAM good!"},
    "character-8":             {name:"THE WATER WAVE",         emoji:"💧", cls:"water",   line:"Ride the wave!"},
    "character-7":             {name:"THE PRESSURE BURST",     emoji:"⚡", cls:"energy",  line:"Bring the pressure!"},
    "character-6":             {name:"THE BLOOM & FLOW",       emoji:"🌱", cls:"nature",  line:"Let the system grow."},
    "character-5":             {name:"THE FLOW BEAT",          emoji:"🎵", cls:"rhythm",  line:"Catch that rhythm!"},
    "character-4":             {name:"THE WRENCH LOCK",        emoji:"🔧", cls:"mechanic",line:"System locked in."},
    "character-3":             {name:"THE DOWNSTREAM SEND",    emoji:"🌊", cls:"ocean",   line:"Send it downstream!"},
    "character-2":             {name:"THE SPARK FLASH",        emoji:"✨", cls:"spark",   line:"Make it shine!"},
    "character-1":             {name:"THE SUMMIT PULSE",        emoji:"🏔️", cls:"mountain",line:"Mountain to ocean!"},
    "lion":                    {name:"THE LION ROAR",          emoji:"🦁", cls:"lion",    line:"HEAR THE FLOW!"},
    "nite":                    {name:"THE NIGHT GLIDE",        emoji:"🌙", cls:"night",   line:"Night flow."},
    "lite":                    {name:"THE LIGHT BURST",        emoji:"💡", cls:"light",   line:"Light the flow!"},
    "jesus":                   {name:"THE LIVING FLOW",         emoji:"✝️", cls:"jesus",   line:"Let the living water flow."},
    "dam-black-jesus":         {name:"THE BLACK JESUS FLOW",      emoji:"✝🏿", cls:"blackJesus", line:"Let the living water move."},
    "devil":                   {name:"THE TEMPTATION SURGE",    emoji:"😈", cls:"devil",   line:"Pressure meets resistance."}
  });

  const state = {
    taps: [],
    lastMomentAt: 0,
    count: 0,
    installed: false
  };

  function ready(){
    return !!(
      window.geiCharacterSpotlightState &&
      window.geiCharacterSpotlightState.started &&
      window.geiCharacterSpotlightState.character &&
      document.getElementById("geiCharacterSpotlight")
    );
  }

  function characterId(){
    return ready() ? String(window.geiCharacterSpotlightState.character.id || "") : "";
  }

  function signature(){
    return SIGNATURES[characterId()] || {
      name:"THE DAM NATION SIGNATURE",
      emoji:"💧",
      cls:"crew",
      line:"Keep the flow moving!"
    };
  }

  function reducedMotion(){
    try{return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}
  }

  function ensureStyles(){
    if(document.getElementById("geiV2156SignatureStyles")) return;
    const style=document.createElement("style");
    style.id="geiV2156SignatureStyles";
    style.textContent=`
      /* V2.1.56 — signature moments */
      .geiSignatureMoment{
        position:absolute;left:50%;top:50%;z-index:40;
        width:min(92%,420px);pointer-events:none;
        transform:translate(-50%,-50%) scale(.82);
        opacity:0;
        padding:12px 16px 14px;
        border:1.5px solid rgba(255,255,255,.28);
        border-radius:20px;
        background:linear-gradient(145deg,rgba(5,10,24,.94),rgba(12,18,42,.82));
        box-shadow:0 0 38px rgba(47,210,255,.26),inset 0 1px 0 rgba(255,255,255,.13);
        text-align:center;color:#fff;
        overflow:hidden;
        isolation:isolate;
      }
      .geiSignatureMoment.show{animation:geiSignatureCard 1.45s cubic-bezier(.2,.85,.25,1) 1}
      .geiSignatureMoment .sigBurst{
        position:absolute;inset:-35%;z-index:-1;
        background:radial-gradient(circle,rgba(47,210,255,.30),transparent 58%);
        opacity:.8;
      }
      .geiSignatureMoment .sigEmoji{
        display:block;font-size:clamp(2rem,10vw,3.2rem);
        line-height:1;margin-bottom:4px;
        filter:drop-shadow(0 0 12px rgba(255,255,255,.3));
      }
      .geiSignatureMoment .sigTitle{
        font-size:clamp(1rem,4.5vw,1.3rem);font-weight:1000;
        letter-spacing:.07em;text-transform:uppercase;
      }
      .geiSignatureMoment .sigLine{
        margin-top:4px;font-size:.9rem;font-weight:800;
        color:rgba(255,255,255,.72);
      }
      .geiSignatureMoment .sigWater{
        position:absolute;left:8%;right:8%;bottom:5px;height:3px;
        border-radius:999px;background:var(--water-bright,#2fd2ff);
        box-shadow:0 0 14px var(--water-bright,#2fd2ff);
        transform:scaleX(0);
        transform-origin:center;
      }
      .geiSignatureMoment.show .sigWater{animation:geiSignatureWater 1.15s ease-out .12s 1 forwards}

      /* unmistakable character motion language */
      .geiSignatureMoment.guide .sigEmoji{animation:sigGuide .72s ease-out .08s 1}
      .geiSignatureMoment.builder .sigEmoji{animation:sigBuilder .72s cubic-bezier(.2,.9,.2,1) .08s 1}
      .geiSignatureMoment.rescue .sigEmoji{animation:sigRescue .66s ease-out .08s 1}
      .geiSignatureMoment.moses .sigEmoji{animation:sigMoses .9s ease-in-out .05s 1}
      .geiSignatureMoment.heart .sigEmoji{animation:sigHeart .86s ease-out .05s 1}
      .geiSignatureMoment.watch .sigEmoji{animation:sigWatch .76s ease-in-out .06s 1}
      .geiSignatureMoment.pumpkin .sigEmoji{animation:sigPumpkin .9s ease-in-out .05s 1}
      .geiSignatureMoment.santa .sigEmoji{animation:sigSanta .82s ease-out .06s 1}
      .geiSignatureMoment.wave .sigEmoji{animation:sigWave .88s ease-in-out .05s 1}
      .geiSignatureMoment.water .sigEmoji{animation:sigWater .9s ease-in-out .05s 1}
      .geiSignatureMoment.energy .sigEmoji{animation:sigEnergy .7s ease-out .04s 1}
      .geiSignatureMoment.nature .sigEmoji{animation:sigNature .95s ease-out .04s 1}
      .geiSignatureMoment.rhythm .sigEmoji{animation:sigRhythm .86s ease-in-out .04s 1}
      .geiSignatureMoment.mechanic .sigEmoji{animation:sigMechanic .78s ease-out .05s 1}
      .geiSignatureMoment.ocean .sigEmoji{animation:sigOcean .95s ease-in-out .04s 1}
      .geiSignatureMoment.spark .sigEmoji{animation:sigSpark .72s ease-out .04s 1}
      .geiSignatureMoment.mountain .sigEmoji{animation:sigMountain .92s ease-out .04s 1}
      .geiSignatureMoment.lion .sigEmoji{animation:sigLion .72s ease-out .04s 1}
      .geiSignatureMoment.night .sigEmoji{animation:sigNight .95s ease-in-out .04s 1}
      .geiSignatureMoment.light .sigEmoji{animation:sigLight .76s ease-out .04s 1}
      .geiSignatureMoment.blackJesus .sigEmoji{animation:sigJesus .9s ease-out .05s 1}

      @keyframes geiSignatureCard{
        0%{opacity:0;transform:translate(-50%,-50%) scale(.78)}
        14%{opacity:1;transform:translate(-50%,-50%) scale(1.04)}
        25%{transform:translate(-50%,-50%) scale(1)}
        78%{opacity:1}
        100%{opacity:0;transform:translate(-50%,-50%) scale(.96)}
      }
      @keyframes geiSignatureWater{to{transform:scaleX(1)}}
      @keyframes sigGuide{30%{transform:translateX(-9px) rotate(-9deg)}60%{transform:translateX(9px) rotate(9deg)}100%{transform:translateX(0) rotate(0)}}
      @keyframes sigBuilder{25%{transform:translateY(9px) rotate(-8deg)}55%{transform:translateY(-11px) rotate(8deg) scale(1.13)}100%{transform:translateY(0) rotate(0) scale(1)}}
      @keyframes sigRescue{25%{transform:translateX(-12px)}55%{transform:translateX(12px) scale(1.14)}100%{transform:translateX(0) scale(1)}}
      @keyframes sigMoses{35%{transform:scaleX(.72)}65%{transform:scaleX(1.2)}100%{transform:scaleX(1)}}
      @keyframes sigHeart{35%{transform:scale(1.24)}55%{transform:scale(.94)}75%{transform:scale(1.12)}100%{transform:scale(1)}}
      @keyframes sigWatch{25%{transform:translateX(-14px) rotate(-5deg)}50%{transform:translateX(14px) rotate(5deg)}100%{transform:translateX(0) rotate(0)}}
      @keyframes sigPumpkin{25%{transform:scale(.78) rotate(-12deg)}55%{transform:scale(1.2) rotate(12deg)}100%{transform:scale(1) rotate(0)}}
      @keyframes sigSanta{35%{transform:translateY(-15px) rotate(-7deg)}65%{transform:translateY(3px) rotate(7deg)}100%{transform:translateY(0) rotate(0)}}
      @keyframes sigWave{25%{transform:translateY(8px) rotate(-12deg)}55%{transform:translateY(-9px) rotate(12deg)}100%{transform:translateY(0) rotate(0)}}
      @keyframes sigWater{30%{transform:scale(1.22) rotate(-6deg)}60%{transform:scale(.9) rotate(6deg)}100%{transform:scale(1)}}
      @keyframes sigEnergy{20%{transform:scale(.82)}45%{transform:scale(1.3)}65%{transform:scale(.9)}85%{transform:scale(1.16)}100%{transform:scale(1)}}
      @keyframes sigNature{35%{transform:translateY(-13px) rotate(-4deg) scale(1.08)}70%{transform:translateY(3px) rotate(4deg)}100%{transform:translateY(0) rotate(0)}}
      @keyframes sigRhythm{20%,60%{transform:translateY(-9px) rotate(-8deg)}40%,80%{transform:translateY(4px) rotate(8deg)}100%{transform:none}}
      @keyframes sigMechanic{35%{transform:rotate(16deg) scale(1.1)}70%{transform:rotate(-12deg) scale(.96)}100%{transform:rotate(0) scale(1)}}
      @keyframes sigOcean{35%{transform:translateX(-18px) rotate(-8deg)}65%{transform:translateX(18px) rotate(8deg)}100%{transform:none}}
      @keyframes sigSpark{20%{transform:scale(.75)}40%{transform:scale(1.28) rotate(10deg)}60%{transform:scale(.92) rotate(-8deg)}100%{transform:scale(1)}}
      @keyframes sigMountain{35%{transform:translateY(-14px) scale(1.08)}70%{transform:translateY(2px) scale(.98)}100%{transform:none}}
      @keyframes sigLion{28%{transform:scale(.88)}48%{transform:scale(1.3)}68%{transform:scale(.94)}100%{transform:scale(1)}}
      @keyframes sigNight{35%{transform:translateY(-10px) rotate(-5deg)}65%{transform:translateY(3px) rotate(5deg)}100%{transform:none}}
      @keyframes sigJesus{0%{transform:scale(.75) translateY(8px);opacity:.45}45%{transform:scale(1.18) translateY(-7px);opacity:1}100%{transform:scale(1)}}
      @keyframes sigDevil{0%,100%{transform:rotate(0) scale(1)}30%{transform:rotate(-8deg) scale(1.12)}60%{transform:rotate(8deg) scale(.96)}}
      @keyframes sigLight{25%{transform:scale(.88)}45%{transform:scale(1.3)}65%{transform:scale(.96)}100%{transform:scale(1)}}

      .geiSignatureMoment .sigBurst{animation:sigBurst 1.2s ease-out .05s 1}
      @keyframes sigBurst{0%{transform:scale(.3);opacity:.1}45%{transform:scale(1.1);opacity:.85}100%{transform:scale(1.35);opacity:0}}
      @media(prefers-reduced-motion:reduce){
        .geiSignatureMoment.show,.geiSignatureMoment .sigEmoji,.geiSignatureMoment .sigBurst{animation:none!important}
        .geiSignatureMoment.show{opacity:1;transform:translate(-50%,-50%)}
      }
    `;
    document.head.appendChild(style);
  }

  function show(){
    if(!ready()) return false;
    const now=performance.now();
    if(now-state.lastMomentAt<TRIGGER.cooldownMs) return false;
    if(Math.random()>TRIGGER.chance) return false;

    const box=document.getElementById("geiCharacterSpotlight");
    if(!box) return false;
    ensureStyles();

    const s=signature();
    let card=document.getElementById("geiSignatureMoment");
    if(!card){
      card=document.createElement("div");
      card.id="geiSignatureMoment";
      card.className="geiSignatureMoment";
      card.setAttribute("aria-hidden","true");
      box.parentNode.appendChild(card);
    }

    card.className="geiSignatureMoment "+s.cls;
    card.innerHTML=
      '<span class="sigBurst"></span>'+
      '<span class="sigEmoji">'+s.emoji+'</span>'+
      '<span class="sigTitle">'+s.name+'</span>'+
      '<span class="sigLine">'+s.line+'</span>'+
      '<span class="sigWater"></span>';

    void card.offsetWidth;
    card.classList.add("show");
    state.lastMomentAt=now;
    state.count++;

    box.dataset.signature=s.cls;
    box.classList.add("signatureMoment");
    setTimeout(function(){
      box.classList.remove("signatureMoment");
      if(card) card.classList.remove("show");
    },TRIGGER.maxBurstMs+80);

    return true;
  }

  function recordTap(){
    if(!ready() || document.hidden) return;
    const now=performance.now();
    state.taps.push(now);
    while(state.taps.length && now-state.taps[0]>TRIGGER.windowMs) state.taps.shift();
    if(state.taps.length<TRIGGER.tapsNeeded) return;

    /* Keep the trigger random and special: strong flow is a condition, not a guarantee. */
    if(state.taps.length===TRIGGER.tapsNeeded) show();
  }

  function install(){
    if(state.installed)return true;
    if(!document.body)return false;
    state.installed=true;
    ensureStyles();

    /* Separate passive observer: never intercepts or alters the gameplay tap. */
    document.addEventListener("pointerdown",function(e){
      if(e.target && e.target.closest && e.target.closest("#geiCharacterSpotlight,#geiSignatureMoment")) return;
      recordTap();
    },{passive:true});

    document.addEventListener("visibilitychange",function(){
      if(document.hidden) state.taps.length=0;
    });

    window.__GEI_V2156_SIGNATURE_MOMENTS__={
      version:VERSION,
      trigger:TRIGGER,
      show:show,
      getCount:function(){return state.count;},
      getCharacterSignature:function(){return signature().name;}
    };
    return true;
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",install,{once:true});
  }else{
    install();
  }
})();