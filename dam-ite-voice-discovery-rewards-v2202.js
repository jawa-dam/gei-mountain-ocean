/* V2.2.02 — DAM-ITE VOICE DISCOVERY REWARDS
 * Presentation-only cosmetic reward layer over Voice Discovery + Memory + Showcase.
 * Rewards are local cosmetic achievements only. No XP, currency, progression,
 * purchases, scores, or account data are modified.
 */
(function(){
  "use strict";
  if(window.__GEI_V2202_VOICE_REWARDS__)return;

  var VERSION="V2.2.02";
  var KEY="geiDamIteVoiceRewardsV2202";
  var DISCOVERY=window.GEI_VOICE_DISCOVERY||null;
  var MEMORY=window.GEI_VOICE_MEMORY||null;

  var REWARDS=[
    {id:"first-voice",need:1,icon:"🎙️",title:"FIRST VOICE",sub:"Discover your first DAM-ITE voice."},
    {id:"flow-listener",need:3,icon:"💧",title:"FLOW LISTENER",sub:"Discover 3 voice moments."},
    {id:"hydraulic-listener",need:6,icon:"⚙️",title:"HYDRAULIC LISTENER",sub:"Discover all 6 core milestones."},
    {id:"voice-collector",need:10,icon:"⭐",title:"VOICE COLLECTOR",sub:"Discover 10 voice variants."},
    {id:"voice-vault",need:14,icon:"🏆",title:"VOICE VAULT",sub:"Discover the full current voice set."}
  ];

  var state={unlocked:[],lastUnlocked:null,totalDiscoveries:0};

  function load(){
    try{
      var raw=localStorage.getItem(KEY),obj=raw?JSON.parse(raw):{};
      if(obj&&typeof obj==="object"){
        state.unlocked=Array.isArray(obj.unlocked)?obj.unlocked:[];
        state.lastUnlocked=obj.lastUnlocked||null;
        state.totalDiscoveries=Number(obj.totalDiscoveries||0);
      }
    }catch(e){}
    return state;
  }

  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}

  function discoveryCount(){
    try{
      var s=DISCOVERY&&typeof DISCOVERY.snapshot==="function"?DISCOVERY.snapshot():null;
      return s&&Array.isArray(s.seen)?s.seen.length:0;
    }catch(e){return state.totalDiscoveries||0;}
  }

  function rewardForCount(count){
    return REWARDS.filter(function(r){return count>=r.need;});
  }

  function toast(reward){
    var old=document.getElementById("v2202RewardToast");if(old)old.remove();
    var el=document.createElement("div");
    el.id="v2202RewardToast";
    el.innerHTML='<div class="v2202RewardTop">✨ REWARD UNLOCKED</div><div class="v2202RewardIcon"></div><div class="v2202RewardTitle"></div><div class="v2202RewardSub"></div>';
    el.querySelector(".v2202RewardIcon").textContent=reward.icon;
    el.querySelector(".v2202RewardTitle").textContent=reward.title;
    el.querySelector(".v2202RewardSub").textContent=reward.sub;
    document.body.appendChild(el);
    requestAnimationFrame(function(){el.classList.add("show");});
    setTimeout(function(){el.classList.remove("show");},2100);
    setTimeout(function(){el.remove();},2450);
  }

  function cardBurst(reward){
    var host=document.getElementById("v2200VoiceShowcase")||document.body;
    var burst=document.createElement("div");
    burst.className="v2202Burst";
    burst.textContent=reward.icon+"  "+reward.title;
    host.appendChild(burst);
    setTimeout(function(){burst.classList.add("show");},20);
    setTimeout(function(){burst.remove();},1650);
  }

  function unlockNew(count){
    state.totalDiscoveries=count;
    var available=rewardForCount(count);
    var newly=available.filter(function(r){return state.unlocked.indexOf(r.id)<0;});
    if(!newly.length){save();return[];}
    newly.forEach(function(r){state.unlocked.push(r.id);});
    var newest=newly[newly.length-1];
    state.lastUnlocked=newest.id;
    save();
    newly.forEach(function(r,i){
      setTimeout(function(){toast(r);cardBurst(r);},i*700);
    });
    return newly;
  }

  function check(){
    return unlockNew(discoveryCount());
  }

  function reset(){
    state={unlocked:[],lastUnlocked:null,totalDiscoveries:0};
    save();
    render();
    return snapshot();
  }

  function snapshot(){return JSON.parse(JSON.stringify(state));}

  function render(){
    var host=document.getElementById("v2200VoiceShowcase");
    if(!host)return;
    var old=document.getElementById("v2202Rewards");
    if(old)old.remove();
    var wrap=document.createElement("div");
    wrap.id="v2202Rewards";
    wrap.className="v2202Rewards";
    wrap.innerHTML='<div class="v2202RewardsTitle">🏆 DISCOVERY REWARDS</div>'+
      '<div class="v2202RewardsSub">Cosmetic rewards for exploring the DAM-ITE voices.</div>'+
      '<div class="v2202RewardGrid"></div>';
    var grid=wrap.querySelector(".v2202RewardGrid");
    REWARDS.forEach(function(r){
      var unlocked=state.unlocked.indexOf(r.id)>=0;
      var item=document.createElement("div");
      item.className="v2202RewardItem"+(unlocked?" unlocked":"");
      item.innerHTML='<span class="v2202RewardMiniIcon">'+r.icon+'</span><span><strong></strong><small></small></span>';
      item.querySelector("strong").textContent=r.title;
      item.querySelector("small").textContent=unlocked?"UNLOCKED":"DISCOVER "+r.need;
      grid.appendChild(item);
    });
    var header=host.querySelector(".v2200Header");
    if(header)header.parentNode.insertBefore(wrap,header.nextSibling);
    else host.prepend(wrap);
  }

  function observeDiscovery(){
    if(!DISCOVERY||DISCOVERY.__v2202Wrapped)return;
    if(typeof DISCOVERY.discover!=="function")return;
    var original=DISCOVERY.discover;
    DISCOVERY.discover=function(){
      var result=original.apply(DISCOVERY,arguments);
      if(result)setTimeout(function(){check();render();},45);
      return result;
    };
    DISCOVERY.__v2202Wrapped=true;
    DISCOVERY.__v2202Original=original;
  }

  function install(){
    load();
    observeDiscovery();
    setTimeout(function(){check();render();},120);
    window.addEventListener("load",function(){observeDiscovery();check();render();});
  }

  var api={
    version:VERSION,rewards:REWARDS.slice(),check:check,reset:reset,render:render,
    snapshot:snapshot,presentationOnly:true
  };
  window.__GEI_V2202_VOICE_REWARDS__=api;
  window.GEI_VOICE_REWARDS=api;

  function css(){
    if(document.getElementById("v2202VoiceRewardsStyle"))return;
    var s=document.createElement("style");s.id="v2202VoiceRewardsStyle";
    s.textContent=
      ".v2202Rewards{max-width:520px;margin:0 auto 9px;padding:12px;border-radius:18px;background:rgba(8,11,22,.94);border:1px solid rgba(255,255,255,.14);box-shadow:0 12px 30px rgba(0,0,0,.24);}" +
      ".v2202RewardsTitle{font-size:.94rem;font-weight:950;letter-spacing:.04em;}" +
      ".v2202RewardsSub{font-size:.72rem;opacity:.68;margin:4px 0 10px;}" +
      ".v2202RewardGrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}" +
      ".v2202RewardItem{display:flex;gap:8px;align-items:center;min-height:54px;padding:8px;border-radius:13px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);opacity:.52;}" +
      ".v2202RewardItem.unlocked{opacity:1;border-color:rgba(255,216,90,.48);background:rgba(255,216,90,.07);box-shadow:0 0 18px rgba(255,216,90,.08);}" +
      ".v2202RewardMiniIcon{font-size:1.15rem;}" +
      ".v2202RewardItem strong{display:block;font-size:.69rem;font-weight:950;}" +
      ".v2202RewardItem small{display:block;font-size:.58rem;opacity:.68;margin-top:3px;font-weight:800;}" +
      "#v2202RewardToast{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 86px);z-index:8500;min-width:min(285px,84vw);padding:13px 16px;border-radius:19px;background:rgba(8,11,22,.98);border:1px solid rgba(255,216,90,.38);box-shadow:0 18px 45px rgba(0,0,0,.44),0 0 35px rgba(255,216,90,.12);color:#fff;text-align:center;transform:translateX(-50%) translateY(-8px) scale(.96);opacity:0;transition:opacity .22s ease,transform .22s ease;font-family:Inter,system-ui,sans-serif;pointer-events:none;}" +
      "#v2202RewardToast.show{opacity:1;transform:translateX(-50%) scale(1);}" +
      ".v2202RewardTop{font-size:.68rem;font-weight:950;letter-spacing:.08em;opacity:.78;}" +
      ".v2202RewardIcon{font-size:1.8rem;margin:4px 0;}" +
      ".v2202RewardTitle{font-size:1rem;font-weight:950;}" +
      ".v2202RewardSub{font-size:.68rem;opacity:.66;margin-top:3px;}" +
      ".v2202Burst{position:fixed;left:50%;top:50%;z-index:8490;transform:translate(-50%,-50%) scale(.72);padding:10px 15px;border-radius:16px;background:rgba(8,11,22,.94);border:1px solid rgba(255,216,90,.32);box-shadow:0 0 28px rgba(255,216,90,.10);font:950 .84rem/1 Inter,system-ui,sans-serif;opacity:0;pointer-events:none;transition:opacity .2s ease,transform .3s cubic-bezier(.18,.9,.18,1);}" +
      ".v2202Burst.show{opacity:1;transform:translate(-50%,-50%) scale(1);}" +
      "@media(max-width:390px){.v2202RewardGrid{grid-template-columns:1fr}}" +
      "@media(prefers-reduced-motion:reduce){#v2202RewardToast,.v2202Burst{transition:none}}" ;
    document.head.appendChild(s);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){css();install();},{once:true});
  else{css();install();}
})();