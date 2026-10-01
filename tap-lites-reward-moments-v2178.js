/* V2.1.78 — TAP LITES HYDRAULIC COMBO REWARD MOMENTS
 * Presentation/audio reward layer.
 * Does NOT grant, subtract, persist, or change actual game rewards.
 */
(function(){
  "use strict";

  var R={started:false,lastTap:0,streak:0,lastReward:0,ctx:null,timer:null};

  var MOMENTS={
    ignition:{emoji:"🌄",title:"SOURCE IGNITED",sub:"MOUNTAIN FLOW IS ONLINE",pitch:392},
    pressure:{emoji:"💧",title:"DAM PRESSURE",sub:"THE RESERVOIR IS SURGING",pitch:494},
    acceleration:{emoji:"⚙️",title:"MILL ACCELERATION",sub:"THE WHEEL IS SPINNING",pitch:587},
    release:{emoji:"🌊",title:"OCEAN RELEASE",sub:"THE WATER MADE IT THROUGH",pitch:659},
    overdrive:{emoji:"🔥",title:"FULL HYDRAULIC OVERDRIVE",sub:"TAP LITES SYSTEM MASTERED",pitch:784}
  };

  function css(){
    if(document.getElementById("tapLites2178Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2178Style";
    s.textContent=
      ".tl2178Reward{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.72);z-index:9999;"+
      "width:min(90vw,460px);padding:20px 18px 18px;border-radius:24px;text-align:center;opacity:0;pointer-events:none;"+
      "background:radial-gradient(circle at 50% 0%,rgba(47,210,255,.22),rgba(6,7,13,.92) 62%);"+
      "border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(18px);"+
      "box-shadow:0 20px 90px rgba(0,0,0,.55),0 0 60px rgba(47,210,255,.18);transition:opacity .18s,transform .42s cubic-bezier(.15,.85,.2,1)}"+
      ".tl2178Reward.show{opacity:1;transform:translate(-50%,-50%) scale(1)}"+
      ".tl2178Reward.overdrive{box-shadow:0 20px 100px rgba(0,0,0,.56),0 0 80px rgba(243,16,186,.28),0 0 44px rgba(47,210,255,.24)}"+
      ".tl2178Reward .emoji{font-size:40px;line-height:1;margin-bottom:8px}"+
      ".tl2178Reward .title{font:900 clamp(20px,5.8vw,30px)/1.08 system-ui,sans-serif;letter-spacing:.07em;color:#fff}"+
      ".tl2178Reward .sub{margin-top:9px;font:800 11px/1.25 system-ui,sans-serif;letter-spacing:.16em;color:#bfefff}"+
      ".tl2178Reward .tag{margin-top:13px;font:700 10px/1 system-ui,sans-serif;letter-spacing:.12em;color:rgba(234,252,255,.54)}"+
      ".tl2178Reward .ripple{position:absolute;left:50%;top:50%;width:70px;height:70px;border:2px solid rgba(234,252,255,.45);border-radius:50%;transform:translate(-50%,-50%) scale(.4);opacity:0}"+
      ".tl2178Reward.show .ripple{animation:tl2178Ripple 1s ease-out 1}"+
      ".tl2178Wave{position:fixed;left:50%;bottom:10%;width:min(84vw,520px);height:70px;transform:translateX(-50%);z-index:9997;pointer-events:none;overflow:hidden;opacity:0}"+
      ".tl2178Wave.show{opacity:1}"+
      ".tl2178Wave::before,.tl2178Wave::after{content:\"\";position:absolute;left:-15%;width:130%;height:40px;border:2px solid rgba(47,210,255,.34);border-radius:50%;transform:translateY(50px);animation:tl2178Wave 1.1s ease-out 1}"+
      ".tl2178Wave::after{animation-delay:.16s;border-color:rgba(243,16,186,.24)}"+
      ".tl2178Spark{position:fixed;width:7px;height:7px;border-radius:50%;z-index:9998;pointer-events:none;background:#eafcff;box-shadow:0 0 14px rgba(47,210,255,.9);animation:tl2178Spark .9s ease-out forwards}"+
      "@keyframes tl2178Ripple{0%{opacity:.65;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(-50%,-50%) scale(4)}}"+
      "@keyframes tl2178Wave{0%{opacity:.8;transform:translateY(50px) scaleX(.55)}100%{opacity:0;transform:translateY(-8px) scaleX(1.08)}}"+
      "@keyframes tl2178Spark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.15)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2178Reward.show .ripple,.tl2178Wave::before,.tl2178Wave::after,.tl2178Spark{animation:none!important}.tl2178Reward{transition:none}}";
    document.head.appendChild(s);
  }

  function ensure(){
    var card=document.getElementById("tl2178Reward");
    if(!card){
      card=document.createElement("div");
      card.id="tl2178Reward";
      card.className="tl2178Reward";
      card.setAttribute("aria-live","polite");
      card.innerHTML='<div class="emoji"></div><div class="title"></div><div class="sub"></div><div class="tag">HYDRAULIC COMBO REWARD MOMENT</div><i class="ripple"></i>';
      document.body.appendChild(card);
    }
    var wave=document.getElementById("tl2178Wave");
    if(!wave){
      wave=document.createElement("div");
      wave.id="tl2178Wave";
      wave.className="tl2178Wave";
      document.body.appendChild(wave);
    }
    return {card:card,wave:wave};
  }

  function audioReady(){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return null;
      if(!R.ctx)R.ctx=new AC();
      if(R.ctx.state==="suspended")R.ctx.resume();
      return R.ctx;
    }catch(e){return null}
  }

  function chime(freq,when,dur,gain){
    var c=audioReady();
    if(!c)return;
    try{
      var o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
      o.type="sine";
      o.frequency.setValueAtTime(freq,c.currentTime+when);
      o.frequency.exponentialRampToValueAtTime(freq*1.24,c.currentTime+when+dur);
      f.type="lowpass";f.frequency.value=2600;
      g.gain.setValueAtTime(.0001,c.currentTime+when);
      g.gain.exponentialRampToValueAtTime(gain||.035,c.currentTime+when+.018);
      g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+when+dur);
      o.connect(f);f.connect(g);g.connect(c.destination);
      o.start(c.currentTime+when);o.stop(c.currentTime+when+dur+.02);
    }catch(e){}
  }

  function rewardSound(item){
    chime(item.pitch,0,.22,.035);
    chime(item.pitch*1.25,.10,.28,.028);
    if(item===MOMENTS.overdrive){
      chime(item.pitch*1.5,.22,.42,.038);
      chime(item.pitch*2,.36,.55,.024);
    }
  }

  function sparks(strength){
    var count=strength>=2?20:12;
    for(var i=0;i<count;i++){
      var el=document.createElement("i");
      el.className="tl2178Spark";
      el.style.left=(50+(Math.random()*16-8))+"%";
      el.style.top=(50+(Math.random()*11-5.5))+"%";
      var a=Math.random()*Math.PI*2,d=(strength>=2?90:60)+Math.random()*150;
      el.style.setProperty("--dx",Math.cos(a)*d+"px");
      el.style.setProperty("--dy",Math.sin(a)*d+"px");
      document.body.appendChild(el);
      setTimeout((function(n){return function(){n.remove()}})(el),950);
    }
  }

  function show(item,streak){
    var l=ensure(),card=l.card;
    card.querySelector(".emoji").textContent=item.emoji;
    card.querySelector(".title").textContent=item.title;
    card.querySelector(".sub").textContent=item.sub;
    card.classList.toggle("overdrive",item===MOMENTS.overdrive);
    card.classList.remove("show");void card.offsetWidth;card.classList.add("show");
    l.wave.classList.remove("show");void l.wave.offsetWidth;l.wave.classList.add("show");
    sparks(item===MOMENTS.overdrive?2:1);
    rewardSound(item);
    clearTimeout(R.timer);
    R.timer=setTimeout(function(){
      card.classList.remove("show","overdrive");
      l.wave.classList.remove("show");
    },1500);
    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction(item===MOMENTS.overdrive?"level":"milestone",item===MOMENTS.overdrive?1.5:1.2);
      }
    }catch(e){}
  }

  function getStreak(){
    var now=performance.now();
    if(now-R.lastTap<850)R.streak++;else R.streak=1;
    R.lastTap=now;
    return R.streak;
  }

  function milestoneFor(streak){
    if(streak>=50)return MOMENTS.overdrive;
    if(streak>=40)return MOMENTS.release;
    if(streak>=30)return MOMENTS.acceleration;
    if(streak>=20)return MOMENTS.pressure;
    if(streak>=10)return MOMENTS.ignition;
    return null;
  }

  function keyFor(item){return Object.keys(MOMENTS).find(function(k){return MOMENTS[k]===item})}

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,#tl2178Reward,.modal,.dialog,button,a,input,select,textarea"
    ))return;
    var streak=getStreak(),item=milestoneFor(streak);
    if(!item)return;
    var key=keyFor(item);
    if(R.lastReward===key)return;
    R.lastReward=key;
    show(item,streak);
  }

  function resetWatch(){
    if(R.lastTap && performance.now()-R.lastTap>1150){
      R.streak=0;R.lastReward=0;
    }
    requestAnimationFrame(resetWatch);
  }

  function startup(){
    if(R.started)return;
    R.started=true;
    addStyle();
    ensure();
    document.addEventListener("pointerdown",onPointer,true);
    requestAnimationFrame(resetWatch);
    window.__GEI_TAP_LITES_REWARD_MOMENTS__=Object.freeze({
      version:"V2.1.78",
      presentationOnly:true,
      rewardValuesChanged:false,
      milestoneMoments:Object.keys(MOMENTS).map(function(k){
        return {id:k,title:MOMENTS[k].title};
      })
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();