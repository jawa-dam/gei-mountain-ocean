/* V2.1.77 — TAP LITES HYDRAULIC COMBO MILESTONES
 * Presentation-only milestone celebration layer.
 * Does not modify authoritative tap counts, FL OZ, progression, timers,
 * unlocks, purchases, entitlements, or save data.
 */
(function(){
  "use strict";

  var M={
    started:false,
    highest:0,
    lastTap:0,
    streak:0,
    celebrated:{},
    timer:null
  };

  var MILESTONES=[
    {id:"ignition",threshold:10,stage:0,emoji:"🌄",title:"MOUNTAIN IGNITION",sub:"THE SOURCE IS AWAKE"},
    {id:"pressure",threshold:20,stage:1,emoji:"💧",title:"DAM PRESSURE",sub:"PRESSURE IS BUILDING"},
    {id:"acceleration",threshold:30,stage:2,emoji:"⚙️",title:"MILL ACCELERATION",sub:"THE MACHINE IS MOVING"},
    {id:"release",threshold:40,stage:3,emoji:"🌊",title:"OCEAN RELEASE",sub:"THE FLOW REACHES THE OCEAN"},
    {id:"overdrive",threshold:50,stage:3,emoji:"🔥",title:"FULL SYSTEM OVERDRIVE",sub:"MOUNTAIN → DAM → MILL → OCEAN"}
  ];

  function addStyle(){
    if(document.getElementById("tapLites2177Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2177Style";
    s.textContent=
      ".tl2177Milestone{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.82);z-index:9997;"+
      "width:min(88vw,430px);padding:18px 18px 16px;border:1px solid rgba(255,255,255,.18);border-radius:22px;"+
      "background:radial-gradient(circle at 50% 0%,rgba(47,210,255,.16),rgba(6,7,13,.88) 60%);"+
      "backdrop-filter:blur(16px);box-shadow:0 18px 70px rgba(0,0,0,.45),0 0 46px rgba(47,210,255,.16);"+
      "text-align:center;opacity:0;pointer-events:none;overflow:hidden;transition:opacity .2s,transform .45s cubic-bezier(.2,.8,.2,1)}"+
      ".tl2177Milestone.show{opacity:1;transform:translate(-50%,-50%) scale(1)}"+
      ".tl2177Milestone.hot{box-shadow:0 18px 70px rgba(0,0,0,.5),0 0 68px rgba(243,16,186,.20),0 0 38px rgba(47,210,255,.22)}"+
      ".tl2177Milestone::before{content:"";position:absolute;left:-20%;right:-20%;top:-35%;height:55%;"+
      "background:linear-gradient(90deg,transparent,rgba(47,210,255,.18),rgba(243,16,186,.16),transparent);"+
      "transform:rotate(-4deg);animation:tl2177Sheen 1.1s linear infinite;pointer-events:none}"+
      ".tl2177Milestone .tl2177Emoji{font-size:34px;line-height:1;margin-bottom:8px}"+
      ".tl2177Milestone .tl2177Title{font:900 clamp(18px,5vw,28px)/1.08 system-ui,sans-serif;letter-spacing:.08em;color:#fff}"+
      ".tl2177Milestone .tl2177Sub{margin-top:8px;font:800 11px/1.2 system-ui,sans-serif;letter-spacing:.16em;color:#bfefff}"+
      ".tl2177Milestone .tl2177Meta{margin-top:12px;font:700 10px/1 system-ui,sans-serif;letter-spacing:.1em;color:rgba(234,252,255,.55)}"+
      ".tl2177Spark{position:fixed;width:8px;height:8px;border-radius:50%;z-index:9996;pointer-events:none;background:#eafcff;"+
      "box-shadow:0 0 12px rgba(47,210,255,.9),0 0 24px rgba(243,16,186,.5);animation:tl2177Spark 1s ease-out forwards}"+
      ".tl2177MilestoneBar{position:fixed;left:50%;bottom:5%;transform:translateX(-50%);width:min(76vw,380px);height:5px;"+
      "border-radius:99px;background:rgba(255,255,255,.07);z-index:9988;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .3s}"+
      ".tl2177MilestoneBar.show{opacity:1}"+
      ".tl2177MilestoneBar::after{content:"";display:block;width:var(--tlmbar,0%);height:100%;border-radius:inherit;"+
      "background:linear-gradient(90deg,#2fd2ff,#3d3dea,#f310ba);box-shadow:0 0 16px rgba(47,210,255,.55);transition:width .3s ease}"+
      "@keyframes tl2177Sheen{from{transform:translateX(-28%) rotate(-4deg)}to{transform:translateX(28%) rotate(-4deg)}}"+
      "@keyframes tl2177Spark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.15)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2177Milestone::before,.tl2177Spark{animation:none!important}.tl2177MilestoneBar{transition:none}}";
    document.head.appendChild(s);
  }

  function layers(){
    var card=document.getElementById("tl2177Milestone");
    if(!card){
      card=document.createElement("div");
      card.id="tl2177Milestone";
      card.className="tl2177Milestone";
      card.setAttribute("aria-hidden","true");
      card.innerHTML=
        '<div class="tl2177Emoji"></div>'+
        '<div class="tl2177Title"></div>'+
        '<div class="tl2177Sub"></div>'+
        '<div class="tl2177Meta">HYDRAULIC COMBO MILESTONE</div>';
      document.body.appendChild(card);
    }
    var bar=document.getElementById("tl2177MilestoneBar");
    if(!bar){
      bar=document.createElement("div");
      bar.id="tl2177MilestoneBar";
      bar.className="tl2177MilestoneBar";
      bar.setAttribute("aria-hidden","true");
      document.body.appendChild(bar);
    }
    return {card:card,bar:bar};
  }

  function currentStreak(){
    var now=performance.now();
    if(now-M.lastTap<850)M.streak++;else M.streak=1;
    M.lastTap=now;
    return M.streak;
  }

  function burst(){
    var count=12;
    for(var i=0;i<count;i++){
      var spark=document.createElement("i");
      spark.className="tl2177Spark";
      spark.style.left=(50+(Math.random()*18-9))+"%";
      spark.style.top=(50+(Math.random()*10-5))+"%";
      var a=Math.random()*Math.PI*2,d=60+Math.random()*150;
      spark.style.setProperty("--dx",Math.cos(a)*d+"px");
      spark.style.setProperty("--dy",Math.sin(a)*d+"px");
      document.body.appendChild(spark);
      setTimeout(function(el){return function(){el.remove()}}(spark),1050);
    }
  }

  function showMilestone(item,streak){
    var l=layers(),card=l.card;
    card.querySelector(".tl2177Emoji").textContent=item.emoji;
    card.querySelector(".tl2177Title").textContent=item.title;
    card.querySelector(".tl2177Sub").textContent=item.sub;
    card.classList.toggle("hot",item.id==="overdrive");
    card.classList.remove("show");
    void card.offsetWidth;
    card.classList.add("show");
    burst();
    clearTimeout(M.timer);
    M.timer=setTimeout(function(){card.classList.remove("show","hot")},1400);
    l.bar.style.setProperty("--tlmbar",Math.min(100,streak/50*100)+"%");
    l.bar.classList.add("show");
    clearTimeout(l.bar.__hide);
    l.bar.__hide=setTimeout(function(){l.bar.classList.remove("show")},1600);
    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction(item.id==="overdrive"?"level":"milestone",item.id==="overdrive"?1.5:1.15);
      }
    }catch(e){}
  }

  function pulseStage(item){
    try{
      if(window.__GEI_TAP_LITES_REACTION_CHAIN__ &&
         typeof window.__GEI_TAP_LITES_REACTION_CHAIN__.selfTest==="function"){
        /* The existing chain remains authoritative for stage targeting. */
      }
    }catch(e){}
    var selectors=[
      ["#mountainGroup",".mountainGroup","#mountain",".mountain"],
      ["#damGroup",".damGroup","#dam",".dam"],
      ["#millGroup",".millGroup","#mill",".mill","#factory",".factory",".waterwheel",".waterWheel"],
      ["#oceanGroup",".oceanGroup","#ocean",".ocean"]
    ][item.stage];
    (selectors||[]).forEach(function(sel){
      try{
        document.querySelectorAll(sel).forEach(function(el){
          el.classList.remove("tl2177MilestonePulse");
          void el.offsetWidth;
          el.classList.add("tl2177MilestonePulse");
          setTimeout(function(){el.classList.remove("tl2177MilestonePulse")},850);
        });
      }catch(e){}
    });
  }

  function check(streak){
    for(var i=0;i<MILESTONES.length;i++){
      var item=MILESTONES[i];
      if(streak>=item.threshold && !M.celebrated[item.id]){
        M.celebrated[item.id]=true;
        M.highest=Math.max(M.highest,item.threshold);
        showMilestone(item,streak);
        pulseStage(item);
      }
    }
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,#tl2177Milestone,.modal,.dialog,button,a,input,select,textarea"
    ))return;
    var streak=currentStreak();
    check(streak);
  }

  function startup(){
    if(M.started)return;
    M.started=true;
    addStyle();
    layers();
    document.addEventListener("pointerdown",onPointer,true);
    window.__GEI_TAP_LITES_COMBO_MILESTONES__=Object.freeze({
      version:"V2.1.77",
      presentationOnly:true,
      milestoneCount:MILESTONES.length,
      milestones:MILESTONES.map(function(x){
        return {id:x.id,threshold:x.threshold,stage:x.stage,title:x.title};
      })
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();