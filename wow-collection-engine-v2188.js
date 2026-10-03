/* V2.1.88 — WOW COLLECTION ENGINE 💥💧🚒
 *
 * ONE reusable, configuration-driven engine for the six collectible WOW campaigns
 * (FIRE HYDRANTS · PLUMBERS · FIRE TRUCKS · ARCHITECTS · WATER TOWERS · CEMENT MASONS).
 *
 *  • Level windows: every six levels is one WOW window with AT MOST ONE random WOW event. The roll at level k of the window
 *    succeeds with probability 1/(7-k), which makes "exactly one random level per window" literally true (level 6 is certain
 *    if none happened earlier). Each window is keyed `w{window}:{collection}:{firstLevel}-{lastLevel}` and recorded in
 *    state.wow.awarded, so a double tap, refresh, back button or repeated callback can never award it twice.
 *  • Six events complete a collection → PRESSURE RELEASE: +3 seconds on the gameplay timer (WOW_TIMER_ENGINE in index.html),
 *    persisted, and the next collection unlocks. The sixth Cement Mason completes the Tap-Lites campaign.
 *  • The WOW scene stars the player's CURRENT character (getActiveCharacter) — never a substitute.
 *  • Voice: the exact supplied MP3s only, played through GEI_AUDIO's "wow" channel (gameplay zone only, one voice at a time,
 *    ducks music/SFX, obeys mute). The Beaver channel and the Dam Map zone are untouched and can never be triggered from here.
 *  • State lives in state.wow and is saved by the normal saveGame()/loadGame(). No second save system.
 *
 * Existing saves: collections are earned in order, one event per six-level window starting from the player's current window,
 * so a veteran is never locked out of a collection whose "intended" level range they have already passed.
 */
(function(){
  "use strict";
  if(window.GEI_WOW_ENGINE) return;
  var VERSION="V2.1.88";
  var CDN="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  function clip(id,file){return {id:id,url:CDN+file,category:"wow"};}

  /* ------------------------------------------------------------------ CONFIGURATION */
  var VOICE_TIMER={
    pressure:clip("wow_pressure_release","pressure-release-hp4d8jypgMLydjwk.mp3"),
    threeMore:clip("wow_three_more_seconds","three-more-seconds-4aYw9BjIYyvlGThF.mp3"),
    sixDidIt:clip("wow_six_you_did_it","six-you-did-it-fkrj4bULWVb18b40.mp3"),
    crewComplete:clip("wow_crew_is_complete","the-crew-is-complete-Y2vDbLIZ1YlBnz4r.mp3")
  };
  var WOW_COLLECTIONS=[
    {id:"fireHydrant",name:"FIRE HYDRANTS",single:"FIRE HYDRANT",icon:"🚒",levels:[1,36],rewardSeconds:3,required:6,
      asset:CDN+"fire-hydrant-Xhzmd0oNFrjcy9X0.png",
      audio:{
        discovery:[clip("hyd_whoa_look","whoa-look-what-we-found-EJGGIB0a6Iqd7ffn.mp3"),clip("hyd_caught","you-caught-a-hydrant-xtQSyygBRMdMfIFO.mp3")],
        celebration:[clip("hyd_big_splash","that-was-a-big-splash-ksb1e04ugcs9tzOS.mp3"),clip("hyd_yes_another","yes-another-one-1alOuHYgQsi6ZqeF.mp3")],   // exact URL as supplied
        progress:[clip("hyd_five_more","five-more-to-go-7bDa2jj8gkHWkze1.mp3")],
        atmosphere:[clip("hyd_pressure_rising","the-water-pressure-is-rising-UYKEwffr9wtcWIbi.mp3")],
        encouragement:[clip("hyd_keep_collecting","wow-keep-collecting-GgoueQuqG2vGExiw.mp3")]}},
    {id:"plumber",name:"PLUMBERS",single:"PLUMBER",icon:"👨‍🔧",levels:[37,72],rewardSeconds:3,required:6,
      asset:CDN+"plumber-ILXyeT3f3OEV0joM.png",
      audio:{
        discovery:[clip("plm_found","we-found-a-plumber-fdzrOcG60fTU4yte.mp3"),clip("plm_call","call-the-plumber-gURuWqDYAd0XeBdO.mp3")],
        celebration:[clip("plm_another","another-one-for-the-crew-SjWILNmOy43uP5UB.mp3")],
        progress:[clip("plm_growing","the-crew-is-growing-zdOiiVA5d6zJlVUu.mp3")],
        atmosphere:[clip("plm_rolling","the-water-crew-is-rolling-u37qCiAxdSOKsDTk.mp3")],
        encouragement:[clip("plm_keep_building","keep-building-the-team-Wjb5DzKLWNmDvlAA.mp3")]}},
    {id:"fireTruck",name:"FIRE TRUCKS",single:"FIRE TRUCK",icon:"🚒",levels:[73,108],rewardSeconds:3,required:6,
      asset:CDN+"fire-truck-tG62zp5ORIfMSwzD.png",
      audio:{
        discovery:[clip("trk_here","the-truck-is-here-T9gh1yRXi4KfYW35.mp3")],
        celebration:[clip("trk_another","another-fire-truck-RKZbAmNGTXM7ILMr.mp3")],
        progress:[],
        atmosphere:[clip("trk_emergency","whoa-emergency-flow-etJyc8HaF3FvLsER.mp3")],
        encouragement:[]}},
    {id:"architect",name:"ARCHITECTS",single:"ARCHITECT",icon:"🏗️",levels:[109,144],rewardSeconds:3,required:6,
      asset:CDN+"architect-p5zRKkAygPUN4rLY.png",
      audio:{
        discovery:[clip("arc_found","we-found-an-architect-8BNc4JXswCcGX1a0.mp3")],
        celebration:[clip("arc_design","look-at-that-design-MKoOOdtahRuhRmBV.mp3")],
        progress:[clip("arc_blueprint","the-blueprint-is-coming-together-0PtemFLwibqCPiyR.mp3")],
        atmosphere:[],encouragement:[]}},
    {id:"waterTower",name:"WATER TOWERS",single:"WATER TOWER",icon:"🗼",levels:[145,180],rewardSeconds:3,required:6,
      asset:CDN+"water-tower-o1rzUqb9k1AIQd3u.png",
      audio:{
        discovery:[clip("twr_the","the-water-tower-5ktWGgFcbKfruWVo.mp3")],
        celebration:[clip("twr_another","another-tower-3wyUc0PvUHlbD0aC.mp3")],
        progress:[],
        atmosphere:[clip("twr_high","look-how-high-that-water-goes-9dFYRzXJTPYpQvSl.mp3")],
        encouragement:[]}},
    {id:"cementMason",name:"CEMENT MASONS",single:"CEMENT MASON",icon:"🧱",levels:[181,216],rewardSeconds:3,required:6,
      asset:CDN+"mason-nzJj7hPmQ1bpqVQR.png",
      audio:{
        discovery:[clip("msn_crew_here","the-cement-crew-is-here-iw4rNRalsbJscY0X.mp3")],
        celebration:[clip("msn_another","another-mason-zbeC56AdMaOxiHDc.mp3")],
        progress:[],
        atmosphere:[clip("msn_big","we-re-building-something-big-P99rOfYXU8odhdKz.mp3")],
        encouragement:[]}}
  ];
  var BY_ID={};WOW_COLLECTIONS.forEach(function(c){BY_ID[c.id]=c;});
  window.WOW_COLLECTIONS=WOW_COLLECTIONS;

  var A=window.GEI_AUDIO||null;
  function $(id){return document.getElementById(id);}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function reduced(){try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}
  function S(){return state.wow;}                         // the one saved object (index.html)
  function save(){try{saveGame();}catch(e){}}
  function dlog(m){try{if(window.GEI_DEBUG_WOW||window.GEI_DEBUG_AUDIO)console.log("[WOW] "+m);}catch(e){}}

  /* ------------------------------------------------------------------ WINDOWS + AWARD (idempotent) */
  function windowOf(level){return Math.floor((Math.max(1,level)-1)/WOW_LEVELS_PER_WINDOW);}
  function windowRange(w){return [w*WOW_LEVELS_PER_WINDOW+1,w*WOW_LEVELS_PER_WINDOW+WOW_LEVELS_PER_WINDOW];}
  function eventId(w,colId){var r=windowRange(w);return "w"+w+":"+colId+":"+r[0]+"-"+r[1];}
  function activeCollection(){return BY_ID[S().activeCollection]||WOW_COLLECTIONS[0];}
  function nextOf(colId){var i=WOW_COLLECTIONS.findIndex(function(c){return c.id===colId;});return WOW_COLLECTIONS[i+1]||null;}

  /* Core award. Returns the pending-scene descriptor, or null when it was already awarded / not allowed. */
  function award(opts){
    var w=S(),colId=opts.collectionId,col=BY_ID[colId];
    if(!col)return null;
    var id=opts.eventId||eventId(opts.window,colId);
    if(w.awarded[id])return null;                          // idempotent: same window+collection can never pay twice
    if(w.counts[colId]>=col.required)return null;          // a finished collection takes no more
    w.awarded[id]=1;
    var win=opts.window;if(typeof win!=="number"){var m=/^w(\d+):/.exec(id);win=m?+m[1]:w.currentWindow;}
    w.windows[win]={t:1,l:Math.max(1,opts.level|0||1),c:colId};
    if(win===w.currentWindow)w.windowTriggered=true;
    w.counts[colId]++;
    var count=w.counts[colId],completes=count>=col.required;
    var from=WOW_TIMER_ENGINE.currentTimerSeconds,to=from;
    if(completes){
      if(w.completed.indexOf(colId)<0)w.completed.push(colId);
      var nxt=nextOf(colId);
      if(nxt)w.activeCollection=nxt.id;else{w.campaignComplete=true;w.completionDate=new Date().toISOString();}
      to=WOW_TIMER_ENGINE.awardBonus(col.rewardSeconds);   // +3s, saved with the normal save
    }
    w.highestLevel=Math.max(w.highestLevel|0,state.level|0);
    w.pending={eventId:id,collectionId:colId,count:count,completes:completes,level:Math.max(1,opts.level|0||state.level|0||1),fromSeconds:from,toSeconds:to,finale:completes&&colId===WOW_COLLECTIONS[WOW_COLLECTIONS.length-1].id};
    save();refreshChip();
    dlog("awarded "+id+" → "+count+"/"+col.required+(completes?" COMPLETE +"+col.rewardSeconds+"s":""));
    return w.pending;
  }

  /* Called once per completed level. One opportunity per window; never more than one event per window. */
  function rollForLevel(level){
    var w=S();level=Math.max(1,level|0);
    if(w.campaignComplete)return null;
    if(level<=w.lastRolledLevel)return null;               // this level was already rolled (refresh / repeated callback)
    var win=windowOf(level),r=windowRange(win);
    w.lastRolledLevel=level;w.highestLevel=Math.max(w.highestLevel|0,level);
    if(w.currentWindow!==win){w.currentWindow=win;w.windowTriggered=!!w.windows[win];}
    if(w.windows[win]){save();return null;}                 // this window already produced its event
    var pos=level-r[0]+1;                                   // 1..6
    var chance=1/(WOW_LEVELS_PER_WINDOW+1-pos);             // 1/6, 1/5, … 1 → exactly one event per window
    if(Math.random()<chance)return award({window:win,level:level,collectionId:w.activeCollection});
    save();return null;
  }

  /* ------------------------------------------------------------------ AUDIO helpers (one voice at a time, wow channel) */
  function pick(list,last){
    if(!list||!list.length)return null;
    var pool=list.filter(function(c){return c.id!==last;});if(!pool.length)pool=list;
    return pool[Math.floor(Math.random()*pool.length)];
  }
  var lastLine=null;
  /* Voice plan for an ordinary (non-completing) event: ONE contextual line, plus the "five more to go" progress cue on the first find. */
  function linesFor(col,count){
    var a=col.audio,out=[],remaining=col.required-count;
    var cat=count===1?"discovery":count===2?"celebration":count===3?(a.atmosphere.length?"atmosphere":"encouragement"):count===4?(a.encouragement.length?"encouragement":"celebration"):"celebration";
    var c=pick(a[cat],lastLine)||pick(a.discovery,lastLine)||pick(a.celebration,lastLine);
    if(c){out.push(c);lastLine=c.id;}
    if(count===1&&a.progress.length&&remaining===5&&col.id==="fireHydrant")out.push(a.progress[0]);   // "Five more to go!"
    else if(count===2&&a.progress.length&&col.id!=="fireHydrant"&&Math.random()<.5)out.push(a.progress[0]);
    return out;
  }
  function sleep(ms){return new Promise(function(r){setTimeout(r,ms);});}
  var skipFlag=false;
  /* speak(clip,minMs): resolves when the clip ends (or fails / is refused) AND at least minMs passed. Muted ⇒ visuals keep their own pace. */
  function speak(c,minMs){
    return new Promise(function(res){
      if(!c||!A){sleep(minMs).then(res);return;}
      var done=false,off=null,t0=Date.now();
      var fin=function(){if(done)return;done=true;if(off)off();clearTimeout(guard);var rest=Math.max(0,minMs-(Date.now()-t0));sleep(skipFlag?0:rest).then(res);};
      var guard=setTimeout(fin,13000);
      off=A.onBeaver(function(ev){
        if(ev.channel!=="wow"||!ev.clip||ev.clip.id!==c.id)return;
        if(ev.type==="end"||ev.type==="abort"||ev.type==="fail"||ev.type==="drop")fin();
      });
      var ok=A.playWow(c,{pri:5,ttl:12000});
      if(!ok)fin();                                         // muted / blocked / refused: the scene still plays, silently
    });
  }

  /* ------------------------------------------------------------------ SCENE */
  var scene=null,sceneRun=0,sceneDone=null;
  function css(){
    if($("geiWowStyle"))return;
    var s=document.createElement("style");s.id="geiWowStyle";
    s.textContent=
      ".wowScene{position:absolute;inset:0;z-index:240;display:flex;align-items:center;justify-content:center;box-sizing:border-box;"+
        "padding:calc(env(safe-area-inset-top) + 10px) 12px calc(env(safe-area-inset-bottom) + 10px);background:rgba(2,8,22,.74);backdrop-filter:blur(5px);"+
        "opacity:0;transition:opacity .25s ease;touch-action:manipulation}"+
      ".wowScene.show{opacity:1}"+
      ".wowCard{position:relative;width:min(100%,400px);max-height:100%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;"+
        "padding:16px 14px 14px;border-radius:26px;overflow:hidden;color:#fff;border:1.5px solid rgba(255,255,255,.45);"+
        "background:linear-gradient(165deg,color-mix(in srgb,var(--juicy-navy,#0b1233) 92%,transparent),color-mix(in srgb,var(--juicy-violet,#7a4dff) 50%,var(--juicy-navy,#0b1233)) 62%,color-mix(in srgb,var(--water-bright,#2fd2ff) 38%,var(--juicy-navy,#0b1233)));"+
        "box-shadow:0 0 50px color-mix(in srgb,var(--water-bright,#2fd2ff) 50%,transparent),inset 0 1px 0 rgba(255,255,255,.4);transform:scale(.86);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}"+
      ".wowScene.show .wowCard{transform:none}"+
      ".wowStageRow{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:4px;width:100%;height:clamp(96px,24vh,170px)}"+
      ".wowChar,.wowItem{height:100%;display:flex;align-items:flex-end;justify-content:center;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}"+
      ".wowChar img,.wowItem img{height:100%;width:auto;max-width:46vw;object-fit:contain;display:block}"+
      ".wowChar{opacity:0;transform:translateX(-40px)}.wowScene.show .wowChar{animation:wowCharIn .5s cubic-bezier(.3,1.4,.5,1) .15s forwards}"+
      ".wowItem{opacity:0;transform:scale(.2) rotate(-14deg)}.wowScene.show .wowItem{animation:wowItemBurst .6s cubic-bezier(.3,1.6,.5,1) .45s forwards}"+
      ".wowItem .wowEmoji{font-size:clamp(54px,14vh,96px);line-height:1}"+
      ".wowTitle{font-size:clamp(1.9rem,9vw,2.6rem);font-weight:1000;letter-spacing:.06em;line-height:1;color:var(--gold,#ffd76a);text-shadow:0 0 20px rgba(255,215,106,.7);opacity:0}"+
      ".wowScene.show .wowTitle{animation:wowPop .45s cubic-bezier(.3,1.7,.5,1) .6s forwards}"+
      ".wowCount{display:flex;flex-direction:column;align-items:center;gap:5px;opacity:0}.wowScene.show .wowCount{animation:wowFade .35s ease .85s forwards}"+
      ".wowCountText{font-size:clamp(.9rem,4vw,1.05rem);font-weight:1000;letter-spacing:.08em}"+
      ".wowCountText b{color:var(--gold,#ffd76a);font-size:1.25em}"+
      ".wowPips{display:flex;gap:5px}.wowPip{width:clamp(16px,5vw,22px);height:8px;border-radius:99px;background:rgba(255,255,255,.18)}"+
      ".wowPip.on{background:linear-gradient(90deg,var(--water-bright,#2fd2ff),var(--gold,#ffd76a));box-shadow:0 0 8px var(--water-bright,#2fd2ff)}"+
      ".wowPip.new{animation:wowPipNew .6s ease-out .9s both}"+
      ".wowRelease{display:none;flex-direction:column;align-items:center;gap:4px;width:100%;margin-top:2px}"+
      ".wowRelease.show{display:flex}"+
      ".wowPress{font-size:clamp(1rem,5.2vw,1.5rem);font-weight:1000;letter-spacing:.05em;white-space:normal;max-width:100%;color:var(--water-bright,#2fd2ff);text-shadow:0 0 18px rgba(47,210,255,.8);animation:wowShake .5s ease-in-out 2}"+
      ".wowPlus{font-size:clamp(1.5rem,7.5vw,2.2rem);font-weight:1000;color:var(--gold,#ffd76a);text-shadow:0 0 20px rgba(255,215,106,.8);animation:wowPop .4s cubic-bezier(.3,1.7,.5,1) both}"+
      ".wowTimer{display:flex;align-items:center;gap:10px;padding:6px 14px;border-radius:14px;background:rgba(0,0,0,.35);border:1.5px solid rgba(255,255,255,.3);font-weight:1000;font-size:clamp(1.1rem,5.4vw,1.5rem)}"+
      ".wowTimer .old{opacity:.55;text-decoration:line-through}.wowTimer .new{color:var(--gold,#ffd76a);display:inline-block}.wowTimer .new.pulse{animation:wowPop .5s cubic-bezier(.3,1.7,.5,1)}"+
      ".wowDone{display:none;flex-direction:column;align-items:center;gap:3px}.wowDone.show{display:flex;animation:wowFade .35s ease both}"+
      ".wowDoneTitle{font-size:clamp(1.05rem,5vw,1.35rem);font-weight:1000;letter-spacing:.07em;color:#fff}"+
      ".wowDoneNext{font-size:clamp(.72rem,3.3vw,.86rem);font-weight:900;letter-spacing:.07em;color:var(--foam,#bff)}"+
      ".wowHint{margin-top:2px;font-size:.62rem;font-weight:800;letter-spacing:.1em;color:rgba(255,255,255,.55)}"+
      ".wowSplash{position:absolute;left:50%;top:54%;width:0;height:0;pointer-events:none}"+
      ".wowRing{position:absolute;left:-90px;top:-90px;width:180px;height:180px;border-radius:50%;border:5px solid rgba(190,235,255,.85);opacity:0;transform:scale(.2)}"+
      ".wowScene.show .wowRing{animation:wowRing .8s ease-out .05s forwards}.wowScene.show .wowRing.r2{animation-delay:.22s}"+
      ".wowDrop{position:absolute;left:-4px;top:-4px;width:9px;height:9px;border-radius:50% 50% 50% 0;background:#bff;opacity:0;transform:rotate(-45deg)}"+
      ".wowScene.show .wowDrop{animation:wowDrop .85s ease-out .1s forwards}"+
      "@keyframes wowCharIn{to{opacity:1;transform:none}}@keyframes wowItemBurst{0%{opacity:0;transform:scale(.2) rotate(-14deg)}70%{opacity:1;transform:scale(1.18) rotate(4deg)}100%{opacity:1;transform:none}}"+
      "@keyframes wowPop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:none}}@keyframes wowFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}"+
      "@keyframes wowPipNew{0%{transform:scaleY(2.4);filter:brightness(2)}100%{transform:none;filter:none}}@keyframes wowShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}"+
      "@keyframes wowRing{0%{opacity:.95;transform:scale(.2)}100%{opacity:0;transform:scale(2.4)}}"+
      "@keyframes wowDrop{0%{opacity:1;transform:translate(0,0) rotate(-45deg) scale(.6)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(-45deg) scale(1)}}"+
      ".gameBar .tapProg.wowBoost,.timerBox.wowBoost{animation:wowPop .6s cubic-bezier(.3,1.7,.5,1)}"+
      "@media(prefers-reduced-motion:reduce){.wowScene,.wowCard,.wowChar,.wowItem,.wowTitle,.wowCount,.wowDone{transition:none!important;animation:none!important;opacity:1!important;transform:none!important}"+
        ".wowRing,.wowDrop,.wowPress,.wowPlus,.wowPip.new,.wowTimer .new.pulse{animation:none!important}.wowDrop:nth-child(n+5){display:none}.wowRing{display:none}}"+
      /* collections panel */
      ".wowPanelTimer{margin:4px 0 10px;padding:10px 12px;border-radius:16px;text-align:center;background:rgba(0,0,0,.28);border:1.5px solid rgba(255,255,255,.22)}"+
      ".wowPanelTimer small{display:block;font-size:.66rem;font-weight:900;letter-spacing:.14em;color:var(--water-bright,#2fd2ff)}"+
      ".wowPanelTimer strong{display:block;font-size:1.7rem;font-weight:1000;color:var(--gold,#ffd76a);line-height:1.1}"+
      ".wowPanelTimer span{display:block;font-size:.7rem;font-weight:800;color:rgba(255,255,255,.7)}"+
      ".wowRow{display:flex;align-items:center;gap:10px;margin:6px 0;padding:8px 10px;border-radius:14px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14)}"+
      ".wowRow.active{border-color:var(--water-bright,#2fd2ff);box-shadow:0 0 14px rgba(47,210,255,.3)}"+
      ".wowRow.done{border-color:var(--gold,#ffd76a);background:linear-gradient(135deg,rgba(255,215,106,.16),rgba(255,255,255,.05))}"+
      ".wowRow.locked{opacity:.5}"+
      ".wowRowImg{width:44px;height:44px;flex:0 0 44px;display:grid;place-items:center;font-size:1.6rem}.wowRowImg img{width:100%;height:100%;object-fit:contain}"+
      ".wowRowText{flex:1;min-width:0}.wowRowName{font-size:.78rem;font-weight:1000;letter-spacing:.06em}.wowRowCount{font-size:.95rem;font-weight:1000;color:var(--gold,#ffd76a)}"+
      ".wowRow.done .wowRowName::after{content:' ✓ COMPLETE';color:var(--gold,#ffd76a);font-size:.62rem}"+
      ".wowRowPips{display:flex;gap:3px;margin-top:4px}.wowRowPips i{flex:1;height:5px;border-radius:99px;background:rgba(255,255,255,.16)}.wowRowPips i.on{background:linear-gradient(90deg,var(--water-bright,#2fd2ff),var(--gold,#ffd76a))}"+
      ".wowNote{margin-top:8px;font-size:.66rem;font-weight:700;line-height:1.35;color:rgba(255,255,255,.62);text-align:center}"+
      ".wowCampaign{margin:8px 0;padding:10px;border-radius:16px;text-align:center;font-weight:1000;letter-spacing:.06em;background:linear-gradient(135deg,rgba(255,215,106,.25),rgba(47,210,255,.15));border:1.5px solid var(--gold,#ffd76a)}"+
      ".wowBtn{display:block;width:100%;margin-top:8px;min-height:44px;border-radius:14px;font:inherit;font-size:.82rem;font-weight:1000;letter-spacing:.06em;color:#fff;cursor:pointer;touch-action:manipulation;"+
        "background:linear-gradient(145deg,var(--juicy-blue,#2d55ff),var(--juicy-violet,#7a4dff));border:1.5px solid rgba(255,255,255,.5)}"+
      ".wowBtn.alt{background:rgba(255,255,255,.1)}"+
      /* certificate */
      ".wowCert{position:relative;width:100%;box-sizing:border-box;padding:14px 12px;border-radius:20px;text-align:center;background:linear-gradient(160deg,rgba(255,244,214,.14),rgba(47,210,255,.1));border:2px solid var(--gold,#ffd76a)}"+
      ".wowCert h3{margin:0;font-size:1.05rem;font-weight:1000;letter-spacing:.07em;color:var(--gold,#ffd76a)}"+
      ".wowCertGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0 4px;text-align:left}"+
      ".wowCertGrid div{padding:6px 8px;border-radius:10px;background:rgba(0,0,0,.25)}.wowCertGrid small{display:block;font-size:.55rem;font-weight:900;letter-spacing:.12em;color:var(--water-bright,#2fd2ff)}"+
      ".wowCertGrid b{font-size:.8rem;font-weight:1000;word-break:break-word}.wowCertGrid .wide{grid-column:1/-1}"+
      ".wowCertChar{width:54px;height:54px;object-fit:contain;margin:0 auto 4px;display:block}";
    document.head.appendChild(s);
  }
  function appRoot(){return $("appRoot")||document.querySelector(".app")||document.body;}
  function imgOrEmoji(src,emoji,cls){
    var box=document.createElement("span");box.className=cls||"";
    var i=new Image();i.alt="";i.decoding="async";i.draggable=false;
    i.onerror=function(){box.textContent=emoji;box.classList.add("wowEmoji");i.remove();};
    i.src=src;box.appendChild(i);return box;
  }
  function charImg(){
    try{var c=getActiveCharacter();var el=characterImage(c,"wowCharImg");var w=document.createElement("div");w.className="wowChar";w.setAttribute("aria-hidden","true");w.appendChild(el);return {el:w,name:c.name};}
    catch(e){var f=document.createElement("div");f.className="wowChar";f.innerHTML='<span class="wowEmoji" style="font-size:64px">💧</span>';return {el:f,name:""};}
  }
  function pips(count,req,newIdx){var h="";for(var i=0;i<req;i++)h+='<i class="wowPip'+(i<count?" on":"")+(i===newIdx?" new":"")+'"></i>';return h;}

  function closeScene(){
    if(!scene)return;
    var el=scene;scene=null;el.classList.remove("show");
    setTimeout(function(){el.remove();},260);
    window.geiWowOpen=false;
    try{syncTimerPause();}catch(e){}
    if(A){try{A.stopWow();}catch(e){}}
    try{var t=$("timerBox");if(t){t.classList.remove("wowBoost");void t.offsetWidth;t.classList.add("wowBoost");setTimeout(function(){t.classList.remove("wowBoost");},700);}}catch(e){}
  }

  /* Plays the whole WOW moment for a pending event. Resolves when it is finished (tap to skip after ~0.9s). */
  function presentScene(p){
    return new Promise(function(resolve){
      if(!p){resolve();return;}
      var col=BY_ID[p.collectionId];if(!col){resolve();return;}
      if(scene){closeScene();}
      css();skipFlag=false;var run=++sceneRun,alive=function(){return run===sceneRun&&scene;};
      var host=appRoot(),ch=charImg();
      var el=document.createElement("div");el.className="wowScene";el.id="wowScene";el.setAttribute("role","status");el.setAttribute("aria-live","polite");
      var card=document.createElement("div");card.className="wowCard";
      var row=document.createElement("div");row.className="wowStageRow";
      var item=document.createElement("div");item.className="wowItem";item.setAttribute("aria-hidden","true");item.appendChild(imgOrEmoji(col.asset,col.icon,""));
      row.appendChild(ch.el);row.appendChild(item);
      var splash=document.createElement("div");splash.className="wowSplash";splash.setAttribute("aria-hidden","true");
      var h='<i class="wowRing"></i><i class="wowRing r2"></i>';
      var nDrops=reduced()?6:12;for(var i=0;i<nDrops;i++){var a=(i/nDrops)*Math.PI*2,d=70+Math.random()*60;h+='<i class="wowDrop" style="--dx:'+Math.round(Math.cos(a)*d)+'px;--dy:'+Math.round(Math.sin(a)*d*.8-20)+'px;animation-delay:'+(.1+Math.random()*.15).toFixed(2)+'s"></i>';}
      splash.innerHTML=h;
      var title=document.createElement("div");title.className="wowTitle";title.textContent="WOW!";
      var count=document.createElement("div");count.className="wowCount";
      count.innerHTML='<div class="wowCountText"><b>'+p.count+' / '+col.required+'</b> '+esc(col.name)+'</div><div class="wowPips" aria-hidden="true">'+pips(p.count,col.required,p.count-1)+'</div>';
      var rel=document.createElement("div");rel.className="wowRelease";
      rel.innerHTML='<div class="wowPress">PRESSURE RELEASE!</div><div class="wowPlus" id="wowPlus" hidden>+'+col.rewardSeconds+' SECONDS</div>'+
        '<div class="wowTimer" id="wowTimer" hidden><span class="old">'+p.fromSeconds+'s</span><span aria-hidden="true">→</span><span class="new" id="wowTimerNew">'+p.fromSeconds+'s</span></div>';
      var done=document.createElement("div");done.className="wowDone";
      var nxt=nextOf(col.id);
      done.innerHTML='<div class="wowDoneTitle">COLLECTION COMPLETE!</div><div class="wowDoneNext">'+(p.finale?'ALL SIX CREWS ARE COMPLETE':'NEXT CREW UNLOCKED: '+esc(nxt?nxt.name:""))+'</div>';
      var hint=document.createElement("div");hint.className="wowHint";hint.textContent="TAP TO CONTINUE";hint.hidden=true;
      card.appendChild(splash);card.appendChild(row);card.appendChild(title);card.appendChild(count);card.appendChild(rel);card.appendChild(done);card.appendChild(hint);
      el.appendChild(card);host.appendChild(el);scene=el;
      el.setAttribute("aria-label",(p.completes?"Collection complete. ":"WOW! ")+p.count+" of "+col.required+" "+col.name+". "+(p.completes?"Pressure release: plus "+col.rewardSeconds+" seconds. Timer "+p.fromSeconds+" to "+p.toSeconds+" seconds.":""));
      window.geiWowOpen=true;try{syncTimerPause();}catch(e){}
      requestAnimationFrame(function(){requestAnimationFrame(function(){if(alive())el.classList.add("show");});});
      try{if(typeof playWaterNoise==="function")playWaterNoise(.6,250,2200,.12);if(typeof playDayRewardSound==="function")setTimeout(playDayRewardSound,220);}catch(e){}   // existing SFX → SFX bus
      var settled=false;
      var finish=function(){if(settled)return;settled=true;
        S().pending=null;save();closeScene();resolve();};
      el.addEventListener("click",function(){if(!hint.hidden||Date.now()-t0>900){skipFlag=true;try{A&&A.stopWow();}catch(e){}finish();}});
      var t0=Date.now();
      setTimeout(function(){if(alive())hint.hidden=false;},900);
      (async function(){
        try{
          await sleep(650);                                  // splash + character + collectible burst land first
          if(!p.completes){
            var lines=linesFor(col,p.count);
            for(var i=0;i<lines.length;i++){if(!alive())return;await speak(lines[i],i===0?1700:0);}
            await sleep(skipFlag?0:600);
          }else{
            await sleep(900);
            if(!alive())return;
            rel.classList.add("show");
            await speak(VOICE_TIMER.pressure,1300);                                  // PRESSURE RELEASE
            if(!alive())return;
            var plus=$("wowPlus"),tm=$("wowTimer");if(plus)plus.hidden=false;if(tm)tm.hidden=false;      // +3 SECONDS
            var three=speak(VOICE_TIMER.threeMore,1400);                              // THREE MORE SECONDS
            await sleep(450);
            var nw=$("wowTimerNew");if(nw){nw.textContent=p.toSeconds+"s";nw.classList.add("pulse");}  // the timer visibly changes
            try{var tb=$("timerBox");if(tb){tb.classList.add("wowBoost");}}catch(e){}
            await three;
            if(!alive())return;
            done.classList.add("show");                                                // collection-complete celebration
            await speak(VOICE_TIMER.sixDidIt,1500);
            if(p.finale){if(!alive())return;await speak(VOICE_TIMER.crewComplete,1500);}
            await sleep(skipFlag?0:500);
          }
        }catch(e){dlog("scene error "+e);}
        if(alive())finish();
      })();
    });
  }

  /* ------------------------------------------------------------------ SESSION OPERATOR chip + COLLECTIONS PANEL */
  function refreshChip(){
    var box=$("geiCharacterSpotlight");if(!box)return;
    var b=box.querySelector(".spotWow");
    if(!b){b=document.createElement("span");b.className="spotWow";b.setAttribute("aria-hidden","true");box.appendChild(b);}
    var w=S(),col=activeCollection();
    b.textContent=w.campaignComplete?"🏆":(col.icon+" "+w.counts[col.id]+"/"+col.required);
  }
  function renderPanel(){
    var body=$("wowPanelBody");if(!body)return;css();
    var w=S(),eng=WOW_TIMER_ENGINE,h="";
    h+='<div class="wowPanelTimer"><small>⏱️ PRESSURE RELEASE</small><small style="color:rgba(255,255,255,.7);margin-top:2px">CURRENT TIMER</small><strong>'+eng.currentTimerSeconds+' SECONDS</strong>'+
       '<span>Base '+eng.baseTimerSeconds+'s + '+eng.bonusTimerSeconds+'s earned · +3s per completed collection</span></div>';
    if(w.campaignComplete)h+='<div class="wowCampaign">🏆 TAP-LITES COMPLETE<button type="button" class="wowBtn" id="wowCertBtn">📜 TAP-LITES COMPLETION CERTIFICATE</button></div>';
    WOW_COLLECTIONS.forEach(function(c){
      var n=w.counts[c.id],done=n>=c.required,active=!w.campaignComplete&&w.activeCollection===c.id;
      var idx=WOW_COLLECTIONS.indexOf(c),locked=!done&&!active;
      var p="";for(var i=0;i<c.required;i++)p+='<i class="'+(i<n?"on":"")+'"></i>';
      h+='<div class="wowRow'+(done?" done":active?" active":"")+(locked?" locked":"")+'" data-id="'+c.id+'"><span class="wowRowImg" data-asset="'+c.id+'"></span>'+
         '<span class="wowRowText"><span class="wowRowName">'+esc(c.icon+" "+c.name)+'</span><br><span class="wowRowCount">'+n+' / '+c.required+'</span><span class="wowRowPips" aria-hidden="true">'+p+'</span></span></div>';
    });
    h+='<div class="wowNote">One random WOW chance per six levels. Complete a collection to release pressure: +3 seconds on every day clock, for good.</div>';
    body.innerHTML=h;
    body.querySelectorAll(".wowRowImg").forEach(function(sp){var c=BY_ID[sp.dataset.asset];if(c)sp.appendChild(imgOrEmoji(c.asset,c.icon,""));});
    var cb=$("wowCertBtn");if(cb)cb.addEventListener("click",function(){try{closePanels();}catch(e){}showCertificate();});
  }

  /* ------------------------------------------------------------------ CERTIFICATE + PORTFOLIO */
  function certData(){
    var w=S(),c=null;try{c=getActiveCharacter();}catch(e){}
    var d=w.completionDate?new Date(w.completionDate):new Date();
    var since="";try{since=($("damProfileSince")&&$("damProfileSince").textContent)||"";}catch(e){}
    var rank="";try{rank=damRank(state.completedLevels);}catch(e){}
    return {name:c?c.name:"",rank:rank,since:since,date:d.toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"}),
      level:Math.max(w.highestLevel|0,state.level|0),collections:w.completed.length,total:WOW_COLLECTIONS.length,bonus:w.timerBonusSeconds|0,timer:WOW_TIMER_ENGINE.currentTimerSeconds,img:c&&c.img};
  }
  function certHtml(){
    var c=certData();
    return '<div class="wowCert"><h3>🏆 TAP-LITES COMPLETE</h3><div style="font-size:.66rem;font-weight:900;letter-spacing:.1em;margin-top:2px">📜 TAP-LITES COMPLETION CERTIFICATE</div>'+
      (c.img?'<img class="wowCertChar" alt="" src="'+esc(c.img)+'" style="margin-top:8px">':"")+
      '<div class="wowCertGrid">'+
        '<div class="wide"><small>PLAYER</small><b>'+esc(c.name||"DAM NATION OPERATOR")+(c.rank?" · "+esc(c.rank):"")+'</b></div>'+
        '<div><small>COMPLETED</small><b>'+esc(c.date)+'</b></div><div><small>HIGHEST LEVEL</small><b>LEVEL '+c.level+'</b></div>'+
        '<div><small>WOW COLLECTIONS</small><b>'+c.collections+' / '+c.total+'</b></div><div><small>TIMER BONUS</small><b>+'+c.bonus+'s → '+c.timer+'s</b></div>'+
        '<div class="wide"><small>STATUS</small><b>✅ CAMPAIGN COMPLETE — keep playing: more WOW collections are coming</b></div>'+
      '</div></div>';
  }
  function showCertificate(onClose){
    if(!S().campaignComplete){if(typeof onClose==="function")onClose();return;}
    css();var host=appRoot(),old=$("wowCertScene");if(old)old.remove();
    var el=document.createElement("div");el.className="wowScene show";el.id="wowCertScene";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Tap-Lites completion certificate");
    var card=document.createElement("div");card.className="wowCard";card.style.transform="none";card.style.overflowY="auto";
    card.innerHTML=certHtml()+'<button type="button" class="wowBtn" id="wowCertPortfolio">VIEW CERTIFICATION PORTFOLIO</button><button type="button" class="wowBtn alt" id="wowCertClose">CONTINUE PLAYING</button>';
    el.appendChild(card);host.appendChild(el);window.geiWowOpen=true;try{syncTimerPause();}catch(e){}
    var close=function(){el.remove();window.geiWowOpen=false;try{syncTimerPause();}catch(e){}if(typeof onClose==="function"){var f=onClose;onClose=null;f();}};
    $("wowCertClose").addEventListener("click",close);
    $("wowCertPortfolio").addEventListener("click",function(){close();try{togglePanel("profile");}catch(e){}setTimeout(function(){var p=$("wowPortfolio");if(p&&p.scrollIntoView)p.scrollIntoView({block:"center"});},350);});
    try{$("wowCertClose").focus({preventScroll:true});}catch(e){}
  }
  function renderPortfolio(){                               // called from renderProfile(): one section inside the existing profile panel
    var panel=$("profilePanel");if(!panel)return;css();
    var box=$("wowPortfolio");if(!box){box=document.createElement("div");box.id="wowPortfolio";box.style.marginTop="12px";panel.appendChild(box);}
    var w=S(),h='<div class="panelTitle" style="font-size:.9rem;margin:10px 0 6px">📜 CERTIFICATION PORTFOLIO</div>';
    if(w.campaignComplete)h+=certHtml();
    else h+='<div class="wowNote">Complete all six WOW collections to earn the TAP-LITES COMPLETION CERTIFICATE. Progress: '+w.completed.length+' / '+WOW_COLLECTIONS.length+' collections.</div>';
    box.innerHTML=h;
  }
  function refreshAll(){refreshChip();var p=$("wowPanel");if(p&&p.classList.contains("open"))renderPanel();}

  /* ------------------------------------------------------------------ HOOKS */
  var replaying=false;
  function bindLevelFlow(){
    /* 1) every completed level rolls its window (idempotent) */
    if(typeof window.showLevelComplete==="function"&&!window.showLevelComplete.__wow2188){
      var orig=window.showLevelComplete,w=function(){
        var out=orig.apply(this,arguments);
        try{rollForLevel(state.level);refreshAll();}catch(e){dlog("roll error "+e);}
        return out;
      };
      w.__wow2188=true;w.__orig=orig;window.showLevelComplete=w;
    }
    /* 2) the level card's CONTINUE first plays a pending WOW scene, then runs the normal flow (bonus wheel → next level) */
    var btn=$("lcBtn");
    if(btn&&!btn.__wow2188){
      btn.__wow2188=true;
      btn.addEventListener("click",function(e){
        if(replaying)return;
        var p=S().pending;if(!p||scene)return;
        e.preventDefault();e.stopImmediatePropagation();
        btn.disabled=true;
        presentScene(p).then(function(){
          var go=function(){replaying=true;btn.disabled=false;try{btn.click();}finally{replaying=false;}};
          if(p.finale)showCertificate(go);                  // the finale certificate first; the normal flow (bonus wheel → next level) continues when it is closed
          else go();
        });
      },true);                                              // capture + registered before the Dam Map hook (script order) → runs first
    }
  }
  function boot(){
    A=window.GEI_AUDIO||A;
    if(A){A.addVoiceGate({channel:"wow",canSpeak:function(){try{return localStorage.getItem("geiMilestoneVoiceMode")!=="off";}catch(e){return true;}},busy:function(){return false;}});}
    bindLevelFlow();refreshChip();
    window.addEventListener("load",function(){bindLevelFlow();refreshChip();},{once:true});
    var mo=0;                                                // the Session Operator chip is built lazily by the spotlight engine
    var tries=0,iv=setInterval(function(){refreshChip();if(++tries>20||$("geiCharacterSpotlight"))clearInterval(iv);},500);
  }

  /* ------------------------------------------------------------------ DEBUG (developer only; never exposed unless GEI_DEBUG_WOW = true) */
  var dbgSeq=0;
  function debugApi(){
    function trig(colId){
      var w=S();var win=100000+(dbgSeq++);                   // synthetic, unique window so repeated debug triggers are distinct events
      var p=award({window:win,level:Math.max(1,state.level|0),collectionId:colId,eventId:"w"+win+":"+colId+":"+(win*6+1)+"-"+(win*6+6)});
      if(p)return presentScene(p).then(function(){if(p.finale)showCertificate();});return Promise.resolve();
    }
    var api={
      triggerFireHydrant:function(){return trig("fireHydrant");},triggerPlumber:function(){return trig("plumber");},triggerFireTruck:function(){return trig("fireTruck");},
      triggerArchitect:function(){return trig("architect");},triggerWaterTower:function(){return trig("waterTower");},triggerCementMason:function(){return trig("cementMason");},
      /* completeCollection(id?): award events until the (active) collection reaches 6/6 — plays only the final scene */
      completeCollection:function(id){var col=BY_ID[id]||activeCollection(),n=0,last=null;while(S().counts[col.id]<col.required&&n++<8){var win=100000+(dbgSeq++);last=award({window:win,level:state.level|0||1,collectionId:col.id,eventId:"w"+win+":"+col.id+":"+(win*6+1)+"-"+(win*6+6)});}return last?presentScene(last).then(function(){if(last.finale)showCertificate();}):Promise.resolve();},
      awardTimerBonus:function(sec){return WOW_TIMER_ENGINE.awardBonus(sec==null?WOW_TIMER_STEP_SECONDS:sec);},
      award:function(eventId,colId){var m=/^w(\d+):/.exec(eventId);return award({eventId:eventId,window:m?+m[1]:0,level:state.level|0||1,collectionId:colId||S().activeCollection});},   // same id twice ⇒ second call returns null
      rollForLevel:rollForLevel,present:function(){return presentScene(S().pending);},showCertificate:showCertificate,
      reset:function(){state.wow=defaultWowState();saveGame();refreshAll();return true;},
      state:function(){return JSON.parse(JSON.stringify(S()));},timer:function(){return WOW_TIMER_ENGINE.snapshot();}
    };
    return api;
  }
  var dbgOn=false;
  function setDebug(v){dbgOn=!!v;if(dbgOn)window.GEI_WOW_DEBUG=debugApi();else try{delete window.GEI_WOW_DEBUG;}catch(e){window.GEI_WOW_DEBUG=undefined;}}
  try{dbgOn=!!window.GEI_DEBUG_WOW;}catch(e){}
  try{Object.defineProperty(window,"GEI_DEBUG_WOW",{configurable:true,get:function(){return dbgOn;},set:setDebug});}catch(e){}
  if(dbgOn)window.GEI_WOW_DEBUG=debugApi();

  window.GEI_WOW_ENGINE={version:VERSION,collections:WOW_COLLECTIONS,voice:VOICE_TIMER,windowOf:windowOf,eventId:eventId,renderPanel:renderPanel,renderPortfolio:renderPortfolio,
    showCertificate:showCertificate,presentScene:presentScene,get state(){return JSON.parse(JSON.stringify(S()));},
    selfTest:function(){var urls=[];WOW_COLLECTIONS.forEach(function(c){urls.push(c.asset);Object.keys(c.audio).forEach(function(k){c.audio[k].forEach(function(a){urls.push(a.url);});});});
      Object.keys(VOICE_TIMER).forEach(function(k){urls.push(VOICE_TIMER[k].url);});
      return {version:VERSION,collections:WOW_COLLECTIONS.length,allRequired6:WOW_COLLECTIONS.every(function(c){return c.required===6&&c.rewardSeconds===3;}),
        urls:urls.length,allCdn:urls.every(function(u){return u.indexOf(CDN)===0;}),noSpeechSynthesis:true,timer:WOW_TIMER_ENGINE.snapshot(),presentationOnly:false};}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
