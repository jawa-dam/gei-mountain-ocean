/* V2.1.76 — TAP LITES MOUNTAIN → DAM → MILL → OCEAN REACTION CHAIN
 * Presentation-only world reaction layer.
 * Never changes authoritative gameplay/economy/save state.
 */
(function(){
  "use strict";

  var S={
    momentum:0,streak:0,lastTap:0,lastStage:0,lastReaction:0,started:false,
    stageNames:["MOUNTAIN","DAM","MILL","OCEAN"]
  };

  var SELECTORS={
    mountain:[
      "#mountainGroup",".mountainGroup","#mountain",".mountain",
      "[data-region='mountain']","[data-stage='mountain']"
    ],
    dam:[
      "#damGroup",".damGroup","#dam",".dam",
      "[data-region='dam']","[data-stage='dam']"
    ],
    mill:[
      "#millGroup",".millGroup","#mill",".mill",
      "#factory",".factory",".waterwheel",".waterWheel",
      "[data-region='mill']","[data-stage='mill']"
    ],
    ocean:[
      "#oceanGroup",".oceanGroup","#ocean",".ocean",
      "[data-region='ocean']","[data-stage='ocean']"
    ]
  };

  function addStyle(){
    if(document.getElementById("tapLites2176Style"))return;
    var s=document.createElement("style");
    s.id="tapLites2176Style";
    s.textContent=
      ".tl2176Chain{position:fixed;left:50%;top:9.5%;transform:translate(-50%,-6px);z-index:9987;"+
      "display:flex;align-items:center;gap:6px;padding:7px 9px;border:1px solid rgba(255,255,255,.14);"+
      "border-radius:999px;background:rgba(6,7,13,.58);backdrop-filter:blur(10px);pointer-events:none;"+
      "opacity:0;transition:opacity .25s,transform .35s;box-shadow:0 0 18px rgba(47,210,255,.10)}"+
      ".tl2176Chain.show{opacity:1;transform:translate(-50%,0)}"+
      ".tl2176Node{min-width:48px;text-align:center;font:800 9px/1.05 system-ui,sans-serif;letter-spacing:.08em;color:rgba(234,252,255,.46);"+
      "text-transform:uppercase;transition:color .25s,transform .25s,text-shadow .25s}"+
      ".tl2176Node.on{color:#eafcff;transform:translateY(-1px);text-shadow:0 0 12px rgba(47,210,255,.72)}"+
      ".tl2176Arrow{font:900 10px/1 system-ui,sans-serif;color:rgba(234,252,255,.26)}"+
      ".tl2176StagePulse{animation:tl2176StagePulse .72s cubic-bezier(.2,.8,.2,1)!important;transform-origin:center}"+
      ".tl2176StageFlow{animation:tl2176StageFlow 1.1s linear infinite!important}"+
      ".tl2176StageFinal{animation:tl2176StageFinal .9s ease-out 1!important}"+
      ".tl2176WakeGlow{filter:brightness(1.12) drop-shadow(0 0 15px rgba(47,210,255,.28))!important}"+
      "@keyframes tl2176StagePulse{0%{filter:brightness(1)}28%{filter:brightness(1.25)}100%{filter:brightness(1)}}"+
      "@keyframes tl2176StageFlow{0%{filter:brightness(1) saturate(1)}50%{filter:brightness(1.18) saturate(1.18)}100%{filter:brightness(1) saturate(1)}}"+
      "@keyframes tl2176StageFinal{0%{filter:brightness(1)}35%{filter:brightness(1.32) drop-shadow(0 0 24px rgba(47,210,255,.45))}100%{filter:brightness(1)}}"+
      "@media (prefers-reduced-motion:reduce){.tl2176StagePulse,.tl2176StageFlow,.tl2176StageFinal{animation:none!important}}";
    document.head.appendChild(s);
  }

  function createChain(){
    var el=document.getElementById("tl2176Chain");
    if(el)return el;
    el=document.createElement("div");
    el.id="tl2176Chain";
    el.className="tl2176Chain";
    el.setAttribute("aria-hidden","true");
    S.stageNames.forEach(function(name,i){
      var n=document.createElement("span");
      n.className="tl2176Node";
      n.dataset.index=String(i);
      n.textContent=name;
      el.appendChild(n);
      if(i<3){
        var a=document.createElement("span");
        a.className="tl2176Arrow";
        a.textContent="›";
        el.appendChild(a);
      }
    });
    document.body.appendChild(el);
    return el;
  }

  function queryStage(stage){
    var list=SELECTORS[stage]||[];
    for(var i=0;i<list.length;i++){
      try{
        var nodes=document.querySelectorAll(list[i]);
        if(nodes.length)return Array.prototype.slice.call(nodes).slice(0,8);
      }catch(e){}
    }
    return [];
  }

  function stageElements(index){
    return queryStage(["mountain","dam","mill","ocean"][index]);
  }

  function clearStageClasses(){
    ["mountain","dam","mill","ocean"].forEach(function(stage){
      queryStage(stage).forEach(function(el){
        el.classList.remove("tl2176WakeGlow","tl2176StageFinal");
      });
    });
  }

  function stageForMomentum(p){
    if(p>=80)return 3;
    if(p>=56)return 2;
    if(p>=30)return 1;
    return 0;
  }

  function updateChain(active){
    var chain=createChain();
    var nodes=chain.querySelectorAll(".tl2176Node");
    nodes.forEach(function(n,i){n.classList.toggle("on",i<=active)});
    chain.classList.add("show");
    clearTimeout(chain.__hide);
    chain.__hide=setTimeout(function(){chain.classList.remove("show")},1200);
  }

  function activateStage(index,final){
    var els=stageElements(index);
    if(!els.length)return;
    els.forEach(function(el){
      el.classList.add("tl2176WakeGlow");
      if(final){
        el.classList.remove("tl2176StageFinal");
        void el.offsetWidth;
        el.classList.add("tl2176StageFinal");
      }else{
        el.classList.remove("tl2176StagePulse");
        void el.offsetWidth;
        el.classList.add("tl2176StagePulse");
        setTimeout(function(){el.classList.remove("tl2176StagePulse")},760);
      }
      setTimeout(function(){el.classList.remove("tl2176WakeGlow")},final?900:640);
    });
  }

  function synchronizeFlow(index){
    var candidates=[];
    var sets=[
      ["#flowPath",".flowPath","#waterFlow",".waterFlow"],
      ["#river",".river",".water",".waterLayer"],
      ["#tapWaterLayer",".tapWaterLayer","#geiSurgeLayer",".geiSurgeLayer"],
      ["#waterwheel",".waterwheel",".wheel"],
      ["#ocean",".ocean","#oceanGroup",".oceanGroup"]
    ];
    sets[index].forEach(function(sel){
      try{document.querySelectorAll(sel).forEach(function(el){if(candidates.indexOf(el)<0)candidates.push(el)})}catch(e){}
    });
    candidates.slice(0,8).forEach(function(el){
      el.classList.add("tl2176StageFlow");
      clearTimeout(el.__tl2176Timer);
      el.__tl2176Timer=setTimeout(function(){el.classList.remove("tl2176StageFlow")},1150);
    });
  }

  function triggerStage(active,final){
    var now=performance.now();
    if(active===S.lastStage && now-S.lastReaction<900 && !final)return;
    if(now-S.lastReaction<350)return;
    S.lastStage=active;
    S.lastReaction=now;
    updateChain(active);
    activateStage(active,final);
    synchronizeFlow(active);
    try{
      if(typeof window.geiCharacterSpotlightPersonalityReaction==="function"){
        window.geiCharacterSpotlightPersonalityReaction(final?"level":"rapid",final?1.45:1.05+active*.12);
      }
    }catch(e){}
  }

  function readMomentumFromExistingEngine(){
    try{
      var el=document.getElementById("tl2175Pressure");
      if(el){
        var w=el.style.getPropertyValue("--tlp").trim().replace("%","");
        var n=Number(w);
        if(isFinite(n))return Math.max(0,Math.min(100,n));
      }
    }catch(e){}
    return null;
  }

  function onPointer(e){
    if(e.button!==undefined&&e.button!==0)return;
    var t=e.target;
    if(t&&t.closest&&t.closest(
      "#guideTopBtn,#profileTopBtn,#fullscreenBtn,#damMapTopBtn,#dmStoreFloatBtn,#dmMachineBtn,#geiCharacterSpotlight,#geiGameGuide,#geiDamMapPage,.modal,.dialog,button,a,input,select,textarea"
    ))return;

    var ext=readMomentumFromExistingEngine();
    var now=performance.now();
    if(now-S.lastTap<850)S.streak++;else S.streak=1;
    S.lastTap=now;

    var p=ext===null
      ? Math.min(100,Math.max(0,(S.streak-1)*8+Math.min(28,S.streak*1.75)))
      : ext;

    S.momentum=p;
    var active=stageForMomentum(p);
    var final=p>=94;

    triggerStage(active,final);
  }

  function decay(){
    var now=performance.now();
    if(S.lastTap && now-S.lastTap>950){
      S.momentum=Math.max(0,S.momentum-.8);
    }
    requestAnimationFrame(decay);
  }

  function selfTest(){
    return {
      version:"V2.1.76",
      presentationOnly:true,
      chain:["Mountain","Dam","Mill","Ocean"],
      thresholds:{mountain:0,dam:30,mill:56,ocean:80,overdrive:94},
      selectors:{
        mountain:stageElements(0).length>0,
        dam:stageElements(1).length>0,
        mill:stageElements(2).length>0,
        ocean:stageElements(3).length>0
      },
      momentumEngine:!!document.getElementById("tl2175Pressure"),
      chainUI:!!document.getElementById("tl2176Chain")
    };
  }

  function startup(){
    if(S.started)return;
    S.started=true;
    addStyle();
    createChain();
    document.addEventListener("pointerdown",onPointer,true);
    requestAnimationFrame(decay);
    window.__GEI_TAP_LITES_REACTION_CHAIN__=Object.freeze({
      version:"V2.1.76",
      presentationOnly:true,
      selfTest:selfTest
    });
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",startup,{once:true});
  else startup();
})();