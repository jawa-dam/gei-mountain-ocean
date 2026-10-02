/* V2.1.79 — TAP LITES HYDRAULIC COMBO SOUND & NATURE RESPONSE ENGINE
 * Audio/presentation-only. Never changes gameplay, economy, progression, or saves.
 */
(function(){
  "use strict";

  var A={
    started:false,lastTap:0,streak:0,lastStage:-1,lastSound:0,ctx:null,
    natureSeed:Math.floor(Math.random()*6)
  };

  var STAGES=[
    {name:"MOUNTAIN",min:0,freq:196},
    {name:"DAM",min:30,freq:262},
    {name:"MILL",min:56,freq:330},
    {name:"OCEAN",min:80,freq:392}
  ];

  function css(){
    if(document.getElementById("tapLites2179Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2179Style";
    s.textContent=
      ".tl2179SoundBadge{position:fixed;left:50%;bottom:12%;transform:translate(-50%,8px) scale(.96);z-index:9995;"+
      "padding:7px 12px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(6,7,13,.58);"+
      "backdrop-filter:blur(10px);font:800 10px/1 system-ui,sans-serif;letter-spacing:.13em;text-transform:uppercase;"+
      "color:#eafcff;opacity:0;pointer-events:none;transition:opacity .22s,transform .3s}"+
      ".tl2179SoundBadge.show{opacity:1;transform:translate(-50%,0) scale(1)}"+
      ".tl2179SoundBadge.hot{box-shadow:0 0 28px rgba(47,210,255,.22)}"+
      "@media (prefers-reduced-motion:reduce){.tl2179SoundBadge{transition:none}}";
    document.head.appendChild(s);
  }

  function ensureBadge(){
    var b=document.getElementById("tl2179SoundBadge");
    if(b)return b;
    b=document.createElement("div");
    b.id="tl2179SoundBadge";
    b.className="tl2179SoundBadge";
    b.setAttribute("aria-live","polite");
    document.body.appendChild(b);
    return b;
  }

  function audio(){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return null;
      if(!A.ctx){ try{ if(typeof getAudio==="function") A.ctx=getAudio(); }catch(e){} }   // V2.1.83: one shared AudioContext
      if(!A.ctx)A.ctx=new AC();
      if(A.ctx.state==="suspended")A.ctx.resume();
      return A.ctx;
    }catch(e){return null}
  }

  function osc(freq,dur,when,type,gain,endFreq){
    var c=audio(); if(!c)return;
    try{
      var o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
      o.type=type||"sine";
      o.frequency.setValueAtTime(freq,c.currentTime+when);
      if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,c.currentTime+when+dur);
      f.type="lowpass";f.frequency.value=3200;
      g.gain.setValueAtTime(.0001,c.currentTime+when);
      g.gain.exponentialRampToValueAtTime(gain||.025,c.currentTime+when+.02);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+when+dur);
      o.connect(f);f.connect(g);g.connect(window.GEI_AUDIO?window.GEI_AUDIO.sfxIn(c):c.destination);
      o.start(c.currentTime+when);o.stop(c.currentTime+when+dur+.02);
    }catch(e){}
  }

  function noise(dur,low,high,gain,when){
    var c=audio(); if(!c)return;
    try{
      var n=Math.max(1,Math.floor(c.sampleRate*dur));
      var b=c.createBuffer(2,n,c.sampleRate),l=b.getChannelData(0),r=b.getChannelData(1);
      for(var i=0;i<n;i++){
        var v=(Math.random()*2-1)*.72;
        l[i]=v;r[i]=v;
      }
      var src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
      src.buffer=b;f.type="bandpass";
      f.frequency.setValueAtTime(low,c.currentTime+when);
      f.frequency.exponentialRampToValueAtTime(high,c.currentTime+when+dur);
      f.Q.value=.65;
      g.gain.setValueAtTime(.0001,c.currentTime+when);
      g.gain.exponentialRampToValueAtTime(gain,c.currentTime+when+dur*.25);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+when+dur);
      src.connect(f);f.connect(g);g.connect(window.GEI_AUDIO?window.GEI_AUDIO.sfxIn(c):c.destination);
      src.start(c.currentTime+when);src.stop(c.currentTime+when+dur+.02);
    }catch(e){}
  }

  function bird(){
    var pan=(Math.random()*1.4)-.7;
    var base=1800+Math.random()*900;
    osc(base,.12,0,"sine",.015,base*1.35);
    osc(base*1.22,.13,.10,"sine",.013,base*1.05);
    osc(base*.92,.15,.22,"triangle",.009,base*1.18);
  }

  function stageSound(stage,hot){
    var base=STAGES[stage].freq;
    if(stage===0){
      osc(base,.45,0,"sine",.018,base*.78);
      if(A.natureSeed%2===0)bird();
      noise(.55,120,420,.012,.03);
    }else if(stage===1){
      osc(base,.28,0,"triangle",.022,base*1.12);
      noise(.5,90,380,.028,.02);
      osc(base*1.5,.22,.08,"sine",.014,base*1.9);
    }else if(stage===2){
      osc(base,.18,0,"triangle",.026,base*.92);
      osc(base*1.5,.16,.12,"triangle",.022,base*1.02);
      noise(.55,230,1100,.04,.03);
    }else{
      noise(hot?1.25:.8,130,850,hot?.085:.055,.01);
      [1,1.25,1.5,2].forEach(function(m,i){osc(base*m,.38,.10+i*.05,"sine",hot?.026:.018,base*m*1.08)});
      if(A.natureSeed%3!==1){bird()}
    }
  }

  function comboChime(streak){
    if(streak<3)return;
    var scale=[392,494,587,659];
    var f=scale[Math.min(scale.length-1,Math.floor(streak/4))];
    osc(f,.14,0,"sine",.02,f*1.08);
    osc(f*1.25,.18,.08,"sine",.015,f*1.42);
  }

  function stageFor(p){
    if(p>=80)return 3;
    if(p>=56)return 2;
    if(p>=30)return 1;
    return 0;
  }

  function momentum(){
    var el=document.getElementById("tl2175Pressure");
    if(el){
      var n=Number(el.style.getPropertyValue("--tlp").replace("%",""));
      if(isFinite(n))return Math.max(0,Math.min(100,n));
    }
    return Math.min(100,Math.max(0,(A.streak-1)*8+Math.min(28,A.streak*1.75)));
  }

  function badge(stage,p,hot){
    var b=ensureBadge();
    b.textContent="🔊 "+STAGES[stage].name+" · "+Math.round(p)+"%";
    b.classList.toggle("hot",!!hot);b.classList.add("show");
    clearTimeout(b.__timer);
    b.__timer=setTimeout(function(){b.classList.remove("show","hot")},900);
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,#tl2178Reward,#tl2177Milestone,.modal,.dialog,button,a,input,select,textarea"
    ))return;

    var now=performance.now();
    if(now-A.lastTap<850)A.streak++;else A.streak=1;
    A.lastTap=now;
    var p=momentum(),stage=stageFor(p),hot=p>=94;

    comboChime(A.streak);

    if(stage!==A.lastStage || now-A.lastSound>1150){
      A.lastStage=stage;A.lastSound=now;
      stageSound(stage,hot);
      badge(stage,p,hot);
    }else if(A.streak%6===0){
      stageSound(stage,hot);
    }
  }

  function decay(){
    if(A.lastTap && performance.now()-A.lastTap>1200){
      A.streak=0;
    }
    requestAnimationFrame(decay);
  }

  function startup(){
    if(A.started)return;
    A.started=true;
    css();ensureBadge();
    document.addEventListener("pointerdown",onPointer,true);
    requestAnimationFrame(decay);
    window.__GEI_TAP_LITES_SOUND_NATURE__=Object.freeze({
      version:"V2.1.79",
      presentationOnly:true,
      audioEngine:"Web Audio API",
      randomizedNatureSeed:A.natureSeed,
      stages:STAGES.map(function(x){return x.name}),
      rewardEconomyChanged:false
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();