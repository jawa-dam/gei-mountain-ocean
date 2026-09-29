/* V2.1.57 — SIGNATURE MOMENT AUDIO & HYDRAULIC SYNC
   Character Signature Moments now have synchronized natural/hydraulic sound design.
   No external audio files. Uses the existing GEI DAM_AUDIO / damVoice / damNoise bus.
   Presentation-only: never changes FL OZ, purchases, progression, ownership or saves.
*/
(function(){
  "use strict";

  const VERSION="2.1.57";
  const SYNC=Object.freeze({
    audioLeadMs:35,
    peakMs:260,
    cooldownMs:8200
  });

  /* Each signature has a hydraulic "sound identity".
     The design deliberately favors water, air, pressure, machinery and nature over
     musical beats. Existing DAM_AUDIO primitives remain the audio authority. */
  const AUDIO_PROFILES=Object.freeze({
    guide:   {start:["rush"], peak:["drip","shimmer"], tail:["splash"]},
    builder: {start:["pressure"], peak:["thud","rush"], tail:["release"]},
    rescue:  {start:["alarmRush"], peak:["pressure"], tail:["release"]},
    moses:   {start:["part"], peak:["rush"], tail:["splash"]},
    heart:   {start:["softPulse"], peak:["waterPulse"], tail:["drip"]},
    watch:   {start:["scan"], peak:["drip"], tail:["swell"]},
    pumpkin: {start:["spooky"], peak:["surge"], tail:["drip"]},
    santa:   {start:["rush"], peak:["sparkle"], tail:["splash"]},
    wave:    {start:["wave"], peak:["rush"], tail:["splash"]},
    water:   {start:["wave"], peak:["splash"], tail:["drip"]},
    energy:  {start:["pressure"], peak:["surge"], tail:["release"]},
    nature:  {start:["bird"], peak:["splash"], tail:["drip"]},
    rhythm:  {start:["waterPulse"], peak:["rush"], tail:["drip"]},
    mechanic:{start:["click"], peak:["pressure"], tail:["release"]},
    ocean:   {start:["rush"], peak:["wave"], tail:["ocean"]},
    spark:   {start:["sparkle"], peak:["rush"], tail:["drip"]},
    mountain:{start:["deep"], peak:["pressure"], tail:["release"]},
    lion:    {start:["roar"], peak:["surge"], tail:["release"]},
    night:   {start:["night"], peak:["swell"], tail:["drip"]},
    light:   {start:["shimmer"], peak:["rush"], tail:["splash"]},
    crew:    {start:["rush"], peak:["splash"], tail:["drip"]}
  });

  const state={lastAt:0,played:0,installed:false};

  function fn(name){
    try{
      if(name==="rush") return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.hydraulic.rush();
      if(name==="pressure") return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.hydraulic.pressure();
      if(name==="release") return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.hydraulic.release();
      if(name==="splash") return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.hydraulic.splash();
      if(name==="drip") return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.hydraulic.drip();
      if(name==="click") return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.machine.click();
      if(name==="ocean") return typeof playOceanSound==="function" && playOceanSound();
      if(name==="thud") return typeof damVoice==="function" && damVoice({freq:72,to:46,time:.16,gain:.035,filter:"lowpass"});
      if(name==="scan") return typeof damNoise==="function" && damNoise({dur:.16,from:1800,to:900,gain:.012,filter:"highpass"});
      if(name==="wave") return typeof damNoise==="function" && damNoise({dur:.48,from:1500,to:280,gain:.024,filter:"lowpass"});
      if(name==="surge") return typeof damNoise==="function" && damNoise({dur:.34,from:180,to:2400,gain:.026,filter:"bandpass"});
      if(name==="part"){
        if(typeof damNoise!=="function")return false;
        damNoise({dur:.72,from:1800,to:320,gain:.022,filter:"bandpass"});
        setTimeout(()=>{try{damNoise({dur:.38,from:320,to:1700,gain:.016,filter:"highpass"});}catch(e){}},210);
        return true;
      }
      if(name==="softPulse"){
        return typeof damNoise==="function" && damNoise({dur:.32,from:180,to:85,gain:.018,filter:"lowpass"});
      }
      if(name==="waterPulse"){
        if(typeof damNoise!=="function")return false;
        damNoise({dur:.22,from:900,to:1500,gain:.014,filter:"bandpass"});
        setTimeout(()=>{try{damNoise({dur:.24,from:1500,to:500,gain:.012,filter:"bandpass"});}catch(e){}},120);
        return true;
      }
      if(name==="sparkle"){
        if(typeof damVoice!=="function")return false;
        damVoice({freq:1320,to:1900,time:.07,gain:.008,type:"sine"});
        setTimeout(()=>{try{damVoice({freq:1900,to:2450,time:.06,gain:.006,type:"sine"});}catch(e){}},65);
        return true;
      }
      if(name==="bird"){
        /* A tiny natural chirp — intentionally not a musical melody. */
        if(typeof damVoice!=="function")return false;
        damVoice({freq:1900,to:3050,time:.11,gain:.007,type:"sine"});
        setTimeout(()=>{try{damVoice({freq:3000,to:2200,time:.09,gain:.006,type:"sine"});}catch(e){}},115);
        return true;
      }
      if(name==="alarmRush"){
        if(typeof damNoise!=="function")return false;
        damNoise({dur:.18,from:700,to:2500,gain:.018,filter:"highpass"});
        setTimeout(()=>{try{damNoise({dur:.16,from:2500,to:700,gain:.014,filter:"highpass"});}catch(e){}},150);
        return true;
      }
      if(name==="spooky"){
        if(typeof damNoise!=="function")return false;
        damNoise({dur:.5,from:90,to:420,gain:.018,filter:"lowpass"});
        return true;
      }
      if(name==="deep"){
        return typeof damNoise==="function" && damNoise({dur:.46,from:70,to:180,gain:.024,filter:"lowpass"});
      }
      if(name==="roar"){
        if(typeof damNoise!=="function")return false;
        damNoise({dur:.5,from:70,to:240,gain:.03,filter:"lowpass"});
        setTimeout(()=>{try{damNoise({dur:.28,from:500,to:110,gain:.022,filter:"lowpass"});}catch(e){}},120);
        return true;
      }
      if(name==="night"){
        return typeof damNoise==="function" && damNoise({dur:.6,from:240,to:90,gain:.012,filter:"lowpass"});
      }
      if(name==="shimmer"){
        return typeof damNoise==="function" && damNoise({dur:.22,from:1200,to:2400,gain:.009,filter:"highpass"});
      }
      if(name==="swell"){
        return typeof DAM_AUDIO!=="undefined" && DAM_AUDIO.env.play("swell");
      }
    }catch(e){ return false; }
    return false;
  }

  function profile(cls){
    return AUDIO_PROFILES[cls]||AUDIO_PROFILES.crew;
  }

  function play(cls){
    const now=performance.now();
    if(now-state.lastAt<SYNC.cooldownMs)return false;
    state.lastAt=now;

    const p=profile(cls);
    /* Audio begins just ahead of the visual peak, then resolves with the movement. */
    setTimeout(()=>{p.start.forEach(fn);},SYNC.audioLeadMs);
    setTimeout(()=>{p.peak.forEach(fn);},SYNC.peakMs);
    setTimeout(()=>{p.tail.forEach(fn);},Math.min(620,SYNC.peakMs+260));
    state.played++;
    return true;
  }

  function attachToSignature(){
    const old=window.__GEI_V2156_SIGNATURE_MOMENTS__;
    if(!old || old.__v2157Wrapped)return false;

    const originalShow=old.show;
    old.show=function(){
      const before=old.getCount();
      const result=originalShow.apply(this,arguments);
      const after=old.getCount();
      if(result && after>before){
        try{
          const box=document.getElementById("geiCharacterSpotlight");
          const cls=box?.dataset?.signature||"crew";
          play(cls);
        }catch(e){play("crew");}
      }
      return result;
    };
    old.__v2157Wrapped=true;
    old.audio={
      version:VERSION,
      getCount:()=>state.played,
      play:play
    };
    window.__GEI_V2157_SIGNATURE_AUDIO__=old.audio;
    return true;
  }

  function install(){
    if(state.installed)return true;
    state.installed=true;
    if(attachToSignature())return true;

    /* V2.1.56 is loaded as a deferred module. Retry briefly if the prior module
       has not finished installing yet. */
    let tries=0;
    const timer=setInterval(()=>{
      if(attachToSignature() || ++tries>40) clearInterval(timer);
    },25);
    return true;
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",install,{once:true});
  else install();
})();