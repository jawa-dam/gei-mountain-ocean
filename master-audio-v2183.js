/* V2.1.88 — the voice controller now serves two channels through the SAME queue, pool and ducking: "beaver" (Dam Map only)
 * and "wow" (gameplay only: WOW collection / pressure-release voices). Each channel is gated by the zone; the other channel's
 * queued items are discarded on every zone change. There is still exactly one speaker at a time.
 *
 * V2.1.84 — adds strict VOICE ZONES: GAMEPLAY (female narrator/game voice, Beaver blocked) and DAM_MAP (Beaver only,
 * female narration blocked). The zone is DERIVED from the live Dam Map page state, so it can never drift out of sync.
 *
 * V2.1.83 — MASTER AUDIO BUS & BEAVER VOICE PRIORITY 🎵🦫💧
 *
 * ONE game audio manager, three controlled channels, one shared AudioContext (the game's getAudio()):
 *
 *   MASTER ─┬─ MUSIC  bus   owns: background soundtrack, Dam Map water bed, Song Vault radio (<audio> element)
 *           ├─ SFX    bus   owns: taps, water, UI, celebration, reward, splash and Dam Map chimes
 *           └─ BEAVER voice owns: every Beaver spoken MP3 — pooled, queued, prioritised, ducking the other two
 *
 * Beaver clips are HTMLMediaElements managed HERE (the CDN is not guaranteed to send CORS headers, so
 * they cannot be routed through a MediaElementSource without risking silence); their level is
 * beaverVolume × masterVolume × mute, exactly like the gain-node buses.
 *
 * Ducking is multiplicative on top of whatever the player has set (music volume lives inside the
 * soundtrack, SFX/master in audioState), so "restore" always returns to the player's real level —
 * never to a blind 100%. Ducking never pauses gameplay, the timer, the soundtrack or any SFX.
 *
 * Presentation only: never reads or writes game progress, economy, purchases or the game save.
 */
(function(){
  "use strict";
  if(window.GEI_AUDIO) return;
  var VERSION="V2.1.88";
  var KEY_MUTED="geiAudioMuted";
  var DUCK={music:.28,sfx:.6,downTau:.16,upTau:.45};     // spec: music → ~28%, SFX → ~60%, Beaver 100%
  var LOW_GAP_MS=4500, POOL_MAX=10, QUEUE_MAX=8, DUCK_WATCHDOG_MS=45000;

  function now(){return Date.now();}
  function lsGet(k){try{return window.localStorage.getItem(k);}catch(e){return null;}}
  function lsSet(k,v){try{window.localStorage.setItem(k,v);}catch(e){}}
  function clamp(v,a,b){v=+v;return v<a?a:v>b?b:(v===v?v:a);}

  /* ------------------------------------------------------------------ central state */
  var audioState={masterVolume:1,sfxVolume:1,beaverVolume:1,muted:lsGet(KEY_MUTED)==="1",beaverSpeaking:false,
    currentBeaverClip:null,beaverPriority:0,musicDucking:false};

  /* ------------------------------------------------------------------ buses (one set per AudioContext; in practice one) */
  var graphs=[];
  function graph(ctx){
    if(!ctx)return null;
    for(var i=0;i<graphs.length;i++)if(graphs[i].ctx===ctx)return graphs[i];
    try{
      var g={ctx:ctx,master:ctx.createGain(),music:ctx.createGain(),sfx:ctx.createGain()};
      g.music.connect(g.master);g.sfx.connect(g.master);g.master.connect(ctx.destination);
      graphs.push(g);applyGraph(g,true);return g;
    }catch(e){return null;}
  }
  function targets(){
    return {master:audioState.muted?0:audioState.masterVolume,
      music:audioState.musicDucking?DUCK.music:1,
      sfx:(audioState.musicDucking?DUCK.sfx:1)*audioState.sfxVolume};
  }
  function ramp(param,v,tau,ctx,immediate){
    try{var t=ctx.currentTime;param.cancelScheduledValues(t);
      if(immediate){param.setValueAtTime(v,t);return;}
      param.setValueAtTime(param.value,t);param.setTargetAtTime(v,t,tau);}catch(e){}
  }
  function applyGraph(g,immediate){
    var t=targets(),tau=audioState.musicDucking?DUCK.downTau:DUCK.upTau;
    ramp(g.master.gain,t.master,.05,g.ctx,immediate);ramp(g.music.gain,t.music,tau,g.ctx,immediate);ramp(g.sfx.gain,t.sfx,tau,g.ctx,immediate);
  }
  /* Nodes elsewhere connect to these instead of ctx.destination. Falls back to the destination if a graph can't be built. */
  function musicIn(ctx){var g=graph(ctx);return g?g.music:ctx.destination;}
  function sfxIn(ctx){var g=graph(ctx);return g?g.sfx:ctx.destination;}

  /* ------------------------------------------------------------------ <audio> music elements (Song Vault radio) */
  var els=[],elTimer=0;
  function registerMusicElement(el){
    if(!el||els.some(function(e){return e.el===el;}))return el;
    els.push({el:el,base:el.volume>0?el.volume:1,cur:null});applyElements(true);return el;
  }
  function elFactor(){return audioState.muted?0:audioState.masterVolume*(audioState.musicDucking?DUCK.music:1);}
  function applyElements(immediate){
    var f=elFactor();if(audioState.muted)immediate=true;   // a mute is never a slow fade
    els.forEach(function(r){r.to=r.base*f;if(r.cur===null)r.cur=r.el.volume;if(immediate){r.cur=r.to;try{r.el.volume=clamp(r.to,0,1);}catch(e){}}});
    if(immediate||elTimer)return;
    elTimer=setInterval(function(){
      var moving=false;
      els.forEach(function(r){var d=r.to-r.cur;if(Math.abs(d)<.01)r.cur=r.to;else{r.cur+=d*.28;moving=true;}try{r.el.volume=clamp(r.cur,0,1);}catch(e){}});
      if(!moving){clearInterval(elTimer);elTimer=0;}
    },35);
  }
  function applyAll(immediate){graphs.forEach(function(g){applyGraph(g,immediate);});applyElements(immediate);syncBeaverVolume();dbg();}

  /* ------------------------------------------------------------------ ducking lifecycle (token based, watchdog protected) */
  var tokens={},wd=0;
  function voiceBegin(token){
    tokens[token||"voice"]=now();
    if(!audioState.musicDucking){audioState.musicDucking=true;applyAll(false);}
    if(!wd)wd=setInterval(watchdog,3000);
  }
  function voiceEnd(token){
    delete tokens[token||"voice"];
    if(!Object.keys(tokens).length)release();
  }
  function release(){
    if(wd){clearInterval(wd);wd=0;}
    if(audioState.musicDucking){audioState.musicDucking=false;applyAll(false);}
  }
  function watchdog(){                                   // a voice that never reported back must not leave the music ducked
    var t=now();Object.keys(tokens).forEach(function(k){if(t-tokens[k]>DUCK_WATCHDOG_MS)delete tokens[k];});
    if(!Object.keys(tokens).length)release();
  }

  /* ------------------------------------------------------------------ master controls */
  function setMuted(on){
    audioState.muted=!!on;lsSet(KEY_MUTED,on?"1":"0");
    if(on){stopBeaver();stopWow();}
    applyAll(false);try{window.dispatchEvent(new CustomEvent("gei:audio-mute",{detail:{muted:audioState.muted}}));}catch(e){}
    return audioState.muted;
  }
  function setMasterVolume(v){audioState.masterVolume=clamp(v,0,1);applyAll(false);}
  function setSfxVolume(v){audioState.sfxVolume=clamp(v,0,1);applyAll(false);}
  function setBeaverVolume(v){audioState.beaverVolume=clamp(v,0,1);syncBeaverVolume();dbg();}
  function musicVolume(){try{var s=window.__GEI_DAM_FRIENDLY_SOUNDTRACK__;if(s&&typeof s.musicVolume==="number")return s.musicVolume;}catch(e){}return 1;}

  /* ------------------------------------------------------------------ VOICE ZONES
     GAMEPLAY : female narrator + game music + SFX      · Beaver BLOCKED
     DAM_MAP  : Beaver + map ambience + SFX             · female narration BLOCKED
     Ownership, not volume: the other channel is stopped and refused, never merely quieted. */
  function mapPage(){return document.getElementById("geiDamMapPage");}
  function isDamMapOpen(){var p=mapPage();return !!(p&&p.classList.contains("show")&&p.getAttribute("aria-hidden")!=="true");}
  function zone(){return isDamMapOpen()?"DAM_MAP":"GAMEPLAY";}
  var lastZone="GAMEPLAY",zoneWatching=false;
  function stopFemale(){                                 // the female narrator / DAM-ITE voices: milestone director, event vocabulary, speech fallback
    try{var d=window.GEI_VOICE_DIRECTOR;if(d&&typeof d.stop==="function")d.stop();}catch(e){}
    try{var v=window.__GEI_V2203_VOICE_EVENT__;if(v&&typeof v.stop==="function")v.stop();}catch(e){}
    try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
  }
  var femaleGates=[];                                    // V2.2.10: Flow Moment Engine (and future owners) can hold the narrator back while THEIR voice speaks
  function addFemaleGate(fn){if(typeof fn==="function"&&femaleGates.indexOf(fn)<0)femaleGates.push(fn);}
  function femaleAllowed(){
    if(!(zone()==="GAMEPLAY"&&!(cur&&cur.ch==="wow")))return false;   // a WOW line owns the voice while it speaks
    for(var i=0;i<femaleGates.length;i++){try{if(!femaleGates[i]())return false;}catch(e){}}
    return true;
  }
  function beaverAllowed(){return zone()==="DAM_MAP";}
  /* setZone(z): run the hand-over side effects once. Called by the Dam Map watcher below; safe to call again (idempotent). */
  function setZone(z){
    z=z==="DAM_MAP"?"DAM_MAP":"GAMEPLAY";
    if(z===lastZone)return z;
    lastZone=z;
    if(z==="DAM_MAP"){stopFemale();stopChannel("wow");}  // map opens: cancel gameplay narration + any WOW voice, enable Beaver
    else{stopBeaver();}                                  // map closes: Beaver stops NOW, queue cleared, music/SFX restored, female re-enabled
    try{window.dispatchEvent(new CustomEvent("gei:audio-zone",{detail:{zone:z}}));}catch(e){}
    dlog("zone -> "+z);dbg();return z;
  }
  function syncZone(){return setZone(zone());}
  function watchZone(){
    if(zoneWatching)return;
    var bind=function(){
      var p=mapPage();if(!p)return false;
      new MutationObserver(syncZone).observe(p,{attributes:true,attributeFilter:["class","aria-hidden"]});
      syncZone();return true;
    };
    if(bind()){zoneWatching=true;return;}
    zoneWatching=true;
    var mo=new MutationObserver(function(){if(bind())mo.disconnect();});
    mo.observe(document.body||document.documentElement,{childList:true});
  }

  /* ------------------------------------------------------------------ BEAVER voice channel */
  var resolver=null,canSpeakGates={beaver:[],wow:[]},busyGates={beaver:[],wow:[]},listeners=[];
  var pool={},poolOrder=[],broken={},fails={};
  var Q=[],cur=null,lastEnd=0,pumpT=0,blocked=false,unlockBound=false,unlockHandler=null;
  function emit(type,item,extra){
    var d={type:type,clip:item&&item.clip,priority:item&&item.pri,extra:extra,channel:(item&&item.ch)||"beaver"};
    listeners.slice().forEach(function(fn){try{fn(d);}catch(e){}});
  }
  function onBeaver(fn){if(typeof fn==="function"&&listeners.indexOf(fn)<0)listeners.push(fn);return function(){listeners=listeners.filter(function(f){return f!==fn;});};}
  function setVoiceResolver(fn){resolver=fn;}
  function addVoiceGate(g){                              // g.channel: "beaver" (default) | "wow"
    var ch=g&&g.channel==="wow"?"wow":"beaver";
    if(g&&typeof g.canSpeak==="function"&&canSpeakGates[ch].indexOf(g.canSpeak)<0)canSpeakGates[ch].push(g.canSpeak);
    if(g&&typeof g.busy==="function"&&busyGates[ch].indexOf(g.busy)<0)busyGates[ch].push(g.busy);
  }
  function canSpeak(ch){ch=ch||"beaver";if(audioState.muted)return false;var a=canSpeakGates[ch]||[];for(var i=0;i<a.length;i++){try{if(!a[i]())return false;}catch(e){}}return true;}
  function externallyBusy(ch){ch=ch||"beaver";var a=busyGates[ch]||[];for(var i=0;i<a.length;i++){try{if(a[i]())return true;}catch(e){}}return false;}
  function channelAllowed(ch){return ch==="wow"?!isDamMapOpen():isDamMapOpen();}   // the zone decides who may speak
  function isBroken(id){return !!broken[id];}

  function beaverElVolume(){return clamp(audioState.beaverVolume*audioState.masterVolume,0,1);}
  function syncBeaverVolume(){if(cur){var el=pool[cur.clip.id];if(el){try{el.volume=beaverElVolume();}catch(e){}}}}

  function dispose(el){if(!el)return;try{el.onended=null;el.onerror=null;el.onplaying=null;el.pause();el.removeAttribute("src");el.load();}catch(e){}}
  function getEl(c){
    var el=pool[c.id];
    if(el){poolOrder=poolOrder.filter(function(x){return x!==c.id;});poolOrder.push(c.id);return el;}
    try{el=new Audio();el.preload="auto";el.src=c.url;}catch(e){return null;}     // the ONLY place a Beaver <audio> is created
    pool[c.id]=el;poolOrder.push(c.id);
    while(poolOrder.length>POOL_MAX){
      var oi=0;while(oi<poolOrder.length-1&&cur&&cur.clip.id===poolOrder[oi])oi++;   // never evict the clip that is speaking
      var old=poolOrder.splice(oi,1)[0];
      dispose(pool[old]);delete pool[old];
    }
    return el;
  }
  function preload(clips){
    try{if(navigator.connection&&navigator.connection.saveData)return;}catch(e){}
    clips.forEach(function(c){c=toClip(c);if(c&&!broken[c.id]&&!pool[c.id])getEl(c);});
  }
  function toClip(x){return typeof x==="string"?(resolver?resolver(x):null):x;}

  /* playVoice(idOrClip,{channel,priority:1-5,pri,delay,after,ttl,chain}) → accepted?  Priorities: 5 day · 4 unlock · 3 GEI · 2 interaction · 1 casual
     playBeaver / playWow are the two public doors; each is hard-gated by the zone. */
  function playBeaver(x,o){o=o||{};return playVoice(x,o,"beaver");}
  function playWow(x,o){o=o||{};return playVoice(x,o,"wow");}
  function playVoice(x,o,ch){
    o=o||{};var c=toClip(x);
    if(!channelAllowed(ch)){emit("drop",{clip:c,pri:0,ch:ch},ch==="wow"?"inside-dam-map":"outside-dam-map");return false;}   // HARD GATE: Beaver only on the map, WOW voices only in gameplay
    syncZone();
    if(!c||!c.url||broken[c.id]||!canSpeak(ch))return false;
    var pri=Math.round(clamp(o.priority||o.pri||2,1,5)),t=now(),delay=o.delay||0;
    if(pri<=2){                                           // casual reactions fit the silence or vanish — they never queue up
      if(cur||Q.length||blocked||externallyBusy(ch)||document.hidden||t-lastEnd<LOW_GAP_MS){emit("drop",{clip:c,pri:pri,ch:ch},"busy");return false;}
    }else{
      if(document.hidden&&!delay)return false;
      if(Q.some(function(q){return q.clip.id===c.id&&q.ch===ch;})||(cur&&cur.clip.id===c.id&&cur.ch===ch))return false;   // never duplicate
    }
    var item={clip:c,pri:pri,ch:ch,at:t+delay,after:o.after||0,exp:t+(o.ttl||(pri>=3?15000:3000))+delay,chain:o.chain||0};
    if(pri>=4&&cur&&cur.pri<=2)interrupt("outranked");
    var front=pri>=4&&!item.chain&&Q.every(function(q){return q.pri<pri;});
    if(front)Q.unshift(item);else Q.push(item);
    while(Q.length>QUEUE_MAX){var lo=0;for(var i=1;i<Q.length;i++)if(Q[i].pri<Q[lo].pri)lo=i;Q.splice(lo,1);}
    schedule(0);dbg();return true;
  }
  function schedule(ms){clearTimeout(pumpT);pumpT=setTimeout(pump,Math.max(0,ms));}
  function pump(){
    if(cur)return;
    var t=now();
    Q=Q.filter(function(q){return q.exp>t;});
    if(!Q.length){settle();return;}
    var before=Q.length;Q=Q.filter(function(q){return channelAllowed(q.ch);});   // zone changed while clips waited: discard them, never play them later in the wrong zone
    if(!Q.length){settle();return;}
    var item=Q[0],wait=Math.max(item.at-t,item.after-(t-lastEnd),0);
    if(wait>0){schedule(wait);return;}
    if(!canSpeak(item.ch)){Q=Q.filter(function(q){return q.ch!==item.ch;});pump();return;}
    if(item.ch==="wow"&&cur===null){/* a WOW line takes the voice: any gameplay narration steps aside */}
    if(externallyBusy(item.ch)||(document.hidden&&item.pri<5)){
      if(item.pri<=2){Q.shift();pump();return;}
      schedule(400);return;
    }
    Q.shift();start(item);
  }
  var settleT=0;
  function settle(){clearTimeout(settleT);settleT=setTimeout(function(){if(!cur&&!Q.length)voiceEnd("beaver");dbg();},650);}   // glide back once the chain is truly finished
  function setSpeaking(item){
    var isB=!item||item.ch!=="wow";
    audioState.beaverSpeaking=!!item&&isB;audioState.wowSpeaking=!!item&&!isB;
    audioState.currentBeaverClip=item?item.clip.id:null;audioState.beaverPriority=item?item.pri:0;
    try{window.dispatchEvent(new CustomEvent("gei:beaver-speaking",{detail:{speaking:!!item&&isB,id:audioState.currentBeaverClip}}));}catch(e){}
    try{window.dispatchEvent(new CustomEvent("gei:wow-speaking",{detail:{speaking:!!item&&!isB,id:audioState.currentBeaverClip}}));}catch(e){}
  }
  function start(item){
    if(!channelAllowed(item.ch)){return;}
    if(item.ch==="wow")stopFemale();                      // controlled interruption: gameplay narration yields to the WOW line
    var c=item.clip,el=getEl(c);
    if(!el){fail(c,"no audio element");schedule(0);return;}
    clearTimeout(settleT);
    cur=item;setSpeaking(item);voiceBegin("beaver");       // 3-5: duck music + SFX, 6: play
    var started=false;
    item.wd=setTimeout(function(){if(cur===item){if(!started)fail(c,"start timeout");finish(item,true);}},6500);
    el.onplaying=function(){started=true;clearTimeout(item.wd);item.wd=setTimeout(function(){finish(item,true);},30000);};
    el.onended=function(){finish(item,false);};
    el.onerror=function(){fail(c,"load error");finish(item,true);};
    try{el.currentTime=0;}catch(e){}
    try{el.volume=beaverElVolume();}catch(e){}
    var p;try{p=el.play();}catch(e){p=Promise.reject(e);}
    emit("start",item);dbg();
    if(p&&p.catch)p.catch(function(err){
      if(cur!==item)return;
      if(err&&err.name==="NotAllowedError")onBlocked(item);
      else{fail(c,String(err&&err.name||err));finish(item,true);}
    });
  }
  function finish(item,aborted){
    if(cur!==item)return;
    clearTimeout(item.wd);
    var el=pool[item.clip.id];if(el){el.onended=null;el.onerror=null;el.onplaying=null;try{el.pause();}catch(e){}}
    cur=null;lastEnd=now();setSpeaking(null);
    emit(aborted?"abort":"end",item);
    if(Q.length)schedule(30);else settle();               // 7-9: restore (after the queue drains) and clear speaking state
    dbg();
  }
  function fail(c,why){
    fails[c.id]=(fails[c.id]||0)+1;
    emit("fail",{clip:c,pri:0},why);dlog("FAIL "+c.id+": "+why);
    if(fails[c.id]>=2){broken[c.id]=1;dlog("giving up on "+c.id);var el=pool[c.id];if(el){dispose(el);delete pool[c.id];poolOrder=poolOrder.filter(function(x){return x!==c.id;});}}  // never hammer a broken URL
  }
  function interrupt(why){
    if(!cur)return;
    var it=cur,el=pool[it.clip.id];cur=null;
    try{if(el){el.onended=null;el.onerror=null;el.onplaying=null;el.pause();}}catch(e){}
    clearTimeout(it.wd);setSpeaking(null);emit("abort",it,why||"interrupt");
  }
  /* autoplay blocked: keep important lines, retry after the next valid user gesture, drop casual ones; music is NOT left ducked */
  function onBlocked(item){
    var el=pool[item.clip.id];if(el){el.onended=null;el.onerror=null;el.onplaying=null;}
    clearTimeout(item.wd);cur=null;setSpeaking(null);blocked=true;dlog("autoplay blocked: "+item.clip.id);
    if(item.pri>=3){item.exp=now()+15000;item.at=0;Q.unshift(item);}
    else emit("drop",item,"blocked");
    voiceEnd("beaver");                                    // nothing is audible: never stay ducked while blocked
    if(unlockBound)return;unlockBound=true;
    var ev=["pointerdown","touchend","keydown","click"];
    unlockHandler=function(){ev.forEach(function(e){document.removeEventListener(e,unlockHandler,true);});unlockBound=false;blocked=false;setTimeout(pump,60);};
    ev.forEach(function(e){document.addEventListener(e,unlockHandler,{capture:true,passive:true});});
  }
  /* stopChannel(ch): stop that channel's current clip, drop its queued clips, restore music + SFX when nothing else speaks. Safe any time. */
  function stopChannel(ch){
    var had=(!!cur&&cur.ch===ch)||Q.some(function(q){return q.ch===ch;});
    Q=Q.filter(function(q){return q.ch!==ch;});
    if(cur&&cur.ch===ch)interrupt("stop");
    if(!cur&&!Q.length){clearTimeout(pumpT);clearTimeout(settleT);voiceEnd("beaver");}else schedule(0);
    dbg();return had;
  }
  function stopBeaver(){return stopChannel("beaver");}
  function stopWow(){return stopChannel("wow");}
  /* free every pooled element (page hide / teardown) */
  function releasePool(){stopBeaver();stopWow();Object.keys(pool).forEach(function(k){dispose(pool[k]);});pool={};poolOrder=[];}

  /* ------------------------------------------------------------------ debug (developer only) */
  var debugOn=false,dbgEl=null,dbgLog=[],debugProviders=[];
  try{debugOn=!!window.GEI_DEBUG_AUDIO;}catch(e){}
  try{Object.defineProperty(window,"GEI_DEBUG_AUDIO",{configurable:true,get:function(){return debugOn;},set:function(v){debugOn=!!v;if(!debugOn&&dbgEl){dbgEl.remove();dbgEl=null;}else dbg();}});}catch(e){}
  function dlog(m){if(!debugOn)return;dbgLog.push(m);if(dbgLog.length>4)dbgLog.shift();try{console.log("[AUDIO] "+m);}catch(e){}dbg();}
  function pct(v){return Math.round(v*100)+"%";}
  function dbg(){
    if(!debugOn||!document.body)return;
    if(!dbgEl){dbgEl=document.createElement("pre");dbgEl.id="geiAudioDebug";dbgEl.setAttribute("aria-hidden","true");
      dbgEl.style.cssText="position:fixed;right:6px;top:6px;z-index:2147483000;margin:0;padding:6px 8px;border-radius:8px;background:rgba(0,0,0,.78);color:#fd8;font:11px/1.35 monospace;pointer-events:none;max-width:60vw;white-space:pre-wrap";
      document.body.appendChild(dbgEl);}
    var t=targets(),extra="";
    debugProviders.forEach(function(fn){try{var l=fn();if(l)extra+="\n"+l;}catch(e){}});
    dbgEl.textContent="MASTER AUDIO"+(audioState.muted?" (MUTED)":"")+"\nMusic: "+pct(musicVolume()*t.music)+"\nSFX: "+pct(t.sfx)+"\nBeaver: "+pct(audioState.beaverVolume)+
      "\nBeaver Speaking: "+audioState.beaverSpeaking+"\nCurrent Beaver Clip: "+(audioState.currentBeaverClip||"-")+"\nVoice Priority: "+(audioState.beaverPriority||"-")+
      "\nZone: "+zone()+"\nMusic Ducking: "+(audioState.musicDucking?"ACTIVE":"off")+"\nQueue: "+Q.length+(blocked?"  [autoplay blocked]":"")+"\nFemale voice: "+(femaleAllowed()?"ALLOWED":"BLOCKED")+extra+"\n"+dbgLog.join("\n");
  }

  /* ------------------------------------------------------------------ public API */
  var A={version:VERSION,
    get state(){var s={};Object.keys(audioState).forEach(function(k){s[k]=audioState[k];});s.musicVolume=musicVolume();return s;},
    get zone(){return zone();},setZone:setZone,isDamMapOpen:isDamMapOpen,femaleAllowed:femaleAllowed,addFemaleGate:addFemaleGate,beaverAllowed:beaverAllowed,stopFemale:stopFemale,
    musicIn:musicIn,sfxIn:sfxIn,registerMusicElement:registerMusicElement,
    channelAllowed:channelAllowed,setMuted:setMuted,toggleMute:function(){return setMuted(!audioState.muted);},get muted(){return audioState.muted;},
    setMasterVolume:setMasterVolume,setSfxVolume:setSfxVolume,setBeaverVolume:setBeaverVolume,
    voiceBegin:voiceBegin,voiceEnd:voiceEnd,
    playBeaver:playBeaver,stopBeaver:stopBeaver,playWow:playWow,stopWow:stopWow,preloadBeaver:preload,isBroken:isBroken,
    setVoiceResolver:setVoiceResolver,addVoiceGate:addVoiceGate,onBeaver:onBeaver,
    get beaver(){var b=cur&&cur.ch!=="wow";return {speaking:!!b,current:b?{id:cur.clip.id,category:cur.clip.category,priority:cur.pri}:null,queue:Q.filter(function(q){return q.ch!=="wow";}).length,blocked:blocked,pool:poolOrder.length,broken:Object.keys(broken)};},
    get wow(){var w=cur&&cur.ch==="wow";return {speaking:!!w,current:w?{id:cur.clip.id,priority:cur.pri}:null,queue:Q.filter(function(q){return q.ch==="wow";}).length};},
    releasePool:releasePool,addDebugProvider:function(fn){if(typeof fn==="function"&&debugProviders.indexOf(fn)<0)debugProviders.push(fn);},refreshDebug:function(){dbg();},
    levels:function(){var g=graphs[0];return {master:g?+g.master.gain.value.toFixed(3):null,music:g?+g.music.gain.value.toFixed(3):null,sfx:g?+g.sfx.gain.value.toFixed(3):null,
      beaverEl:cur&&pool[cur.clip.id]?+pool[cur.clip.id].volume.toFixed(3):null,radio:els.map(function(r){return +r.el.volume.toFixed(3);})};},
    selfTest:function(){var g=graphs[0];return {version:VERSION,buses:graphs.length,oneContext:graphs.length<=1,
      master:!!(g&&g.master),music:!!(g&&g.music),sfx:!!(g&&g.sfx),ducking:audioState.musicDucking,speaking:audioState.beaverSpeaking,
      poolSize:poolOrder.length,poolCap:POOL_MAX,queue:Q.length,tokens:Object.keys(tokens),presentationOnly:true};}};
  window.GEI_AUDIO=A;

  window.addEventListener("pagehide",releasePool);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watchZone,{once:true});else watchZone();
  document.addEventListener("visibilitychange",function(){if(document.hidden){stopBeaver();stopWow();}});
})();
