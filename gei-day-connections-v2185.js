/* V2.1.85 — GEI SIX-DAY AUDIO CONNECTION ENGINE 🦫💧🎙️
 *
 * The Dam Map becomes a six-day GEI field guide:   PLAY → HEAR → SEE → CONNECT → LEARN
 *   Day N =  ACTION (the game verb)  →  GEI CONNECTION (the framework keyword)
 *
 * FRAMING: every keyword here is part of the user's Genesis Engineered Interpretations (GEI) framework.
 * It is labelled "GEI CONNECTION" and is NOT presented as what the biblical text itself says.
 * The data model keeps BIBLICAL TEXT, GEI INTERPRETATION and ENGINEERING CONNECTION as separate future fields.
 *
 * Audio: the six supplied recordings only — no speech synthesis, no re-recording. They play through the V2.1.84
 * Beaver voice channel of GEI_AUDIO, so they obey the DAM_MAP zone gate, the queue, ducking and mute.
 * The screen teaches too: the card always shows the keyword, with sound on, off, blocked or failed.
 *
 * Presentation only: never reads or writes game progress, economy, purchases or the save.
 * Only storage: its own "heard" flags, kept inside the Beaver voice memory (geiBeaverVoice.v1).
 */
(function(){
  "use strict";
  if(window.GEI_DAY_CONNECTIONS) return;
  var VERSION="V2.1.85";
  var CDN="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var STATIONS=["mountain","dam","millpond","sluice","waterwheel","factory"];
  var STATION_NAMES=["MOUNTAIN","DAM","MILL POND","SLUICE GATE","WATER WHEEL","FACTORY"];
  var ICONS=["🏔️","🧱","🌊","🚪","⚙️","🏭"];

  /* ------------------------------------------------------------------ DATA MODEL
     Implemented now: day · station · actionLabel · connectionLabel · connectionAudio (+ ids).
     Reserved, intentionally empty until real content is supplied:
       actionAudio · quickLesson · genesisText · engineeringConnection
     actionAudio: only a recording that really exists may be named here. Day 4 "Open the gate" already exists in the
     Beaver pack (open_the_gate). The other action phrases have no recordings yet — their slot stays null and the
     action is shown on the card; setActionAudio(day, url) fills a slot later without touching the engine. */
  var GEI_DAY_CONNECTIONS={
    1:{day:1,station:"mountain",   actionLabel:"LET IT FLOW",       actionAudioId:null,          connectionLabel:"SPIRIT",
       connectionId:"day1_spirit",         connectionAudio:CDN+"spirit-TGG8F4lKDE1o7KY7.mp3",
       quickLesson:null,genesisText:null,engineeringConnection:null},
    2:{day:2,station:"dam",        actionLabel:"OPEN THE DAM",      actionAudioId:null,          connectionLabel:"HEAVEN",
       connectionId:"day2_heaven",         connectionAudio:CDN+"heaven-16rDC64mAu7S2tKH.mp3",
       quickLesson:null,genesisText:null,engineeringConnection:null},
    3:{day:3,station:"millpond",   actionLabel:"PRESSURE",          actionAudioId:null,          connectionLabel:"HE SEAS",     // supplied recording is authoritative: "he seas"
       connectionId:"day3_he_seas",        connectionAudio:CDN+"he-seas-bdIovAIEmv6wAddk.mp3",
       quickLesson:null,genesisText:null,engineeringConnection:null},
    4:{day:4,station:"sluice",     actionLabel:"OPEN THE GATE",     actionAudioId:"open_the_gate", connectionLabel:"TWO GREAT LIGHTS",
       connectionId:"day4_two_great_lights",connectionAudio:CDN+"two-great-lights-5EODWI2ApfgzevBJ.mp3",
       quickLesson:null,genesisText:null,engineeringConnection:null},
    5:{day:5,station:"waterwheel", actionLabel:"SPEND THAT WHEEL",  actionAudioId:null,          connectionLabel:"GREAT WHALES",
       connectionId:"day5_great_whales",   connectionAudio:CDN+"great-whales-h7S9UN7vc66uptOP.mp3",
       quickLesson:null,genesisText:null,engineeringConnection:null},
    6:{day:6,station:"factory",    actionLabel:"POWER THE FACTORY", actionAudioId:null,          connectionLabel:"THE BEAST",
       connectionId:"day6_the_beast",      connectionAudio:CDN+"the-beast-iemvfcBCVMKA3reL.mp3",
       quickLesson:null,genesisText:null,engineeringConnection:null}
  };
  window.GEI_DAY_CONNECTIONS=GEI_DAY_CONNECTIONS;

  var A=null,B=null;                       // GEI_AUDIO (master manager), GEI_BEAVER_VOICE (library + memory)
  function $(id){return document.getElementById(id);}
  function reduced(){try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function dlog(m){try{if(window.GEI_DEBUG_AUDIO)console.log("[GEI-DAY] "+m);}catch(e){}}

  /* ------------------------------------------------------------------ heard memory (inside the Beaver memory) */
  function heardMap(){var h=B&&B.recall("geiConnectionHeard");return (h&&typeof h==="object")?h:{};}
  function isHeard(day){return !!heardMap()[day];}
  function markHeard(day){var h=heardMap();if(h[day])return;h[day]=1;if(B)B.remember("geiConnectionHeard",h);}

  /* ------------------------------------------------------------------ clip registration (library lives in the Beaver pack) */
  function registerAll(){
    Object.keys(GEI_DAY_CONNECTIONS).forEach(function(k){
      var d=GEI_DAY_CONNECTIONS[k];
      B.registerClip({id:d.connectionId,url:d.connectionAudio,category:"gei",stations:[d.station],day:d.day,
        repeatable:true,special:true,gei:false});            // special → never drawn by the random pools; played only by this engine
    });
  }
  function setActionAudio(day,url){                          // future recordings: fill a slot, no engine change
    var d=GEI_DAY_CONNECTIONS[day];if(!d||!url||!B)return false;
    var id="day"+day+"_action";
    B.registerClip({id:id,url:url,category:"interaction",stations:[d.station],day:day,repeatable:true,special:true});
    d.actionAudioId=id;return true;
  }

  /* ------------------------------------------------------------------ the GEI CONNECTION card */
  var lastPlacement=null,card=null,cardDay=0,placeT=0,pulseT=0,fallbackT=0,seq=0,revealed={};
  function css(){
    if($("geiDayConnStyle"))return;
    var s=document.createElement("style");s.id="geiDayConnStyle";
    s.textContent=
      ".geiConn{position:absolute;z-index:6;box-sizing:border-box;width:clamp(150px,46%,214px);max-width:calc(100% - 8px);padding:9px 11px 9px;border-radius:16px;text-align:center;"+
        "background:linear-gradient(160deg,rgba(8,16,40,.94),rgba(30,22,84,.94));border:1.5px solid rgba(255,255,255,.42);color:#fff;"+
        "box-shadow:0 0 22px rgba(47,210,255,.38),inset 0 1px 0 rgba(255,255,255,.2);opacity:0;pointer-events:none;transform:translateY(10px) scale(.96);"+
        "transition:left .5s ease,top .5s ease,opacity .35s ease,transform .35s ease}"+
      ".geiConn.show{opacity:1;transform:none;pointer-events:none}"+
      ".geiConn.hidden{display:none}"+
      ".geiConn .gcDay{font-size:.62rem;font-weight:900;letter-spacing:.14em;color:var(--water-bright,#2fd2ff)}"+
      ".geiConn .gcAction{margin-top:3px;font-size:.92rem;font-weight:1000;letter-spacing:.06em;line-height:1.1;color:var(--gold,#ffd76a)}"+
      ".geiConn .gcArrow{font-size:.8rem;line-height:1;opacity:.75;margin:2px 0 1px}"+
      ".geiConn .gcLabel{font-size:.58rem;font-weight:900;letter-spacing:.16em;color:rgba(255,255,255,.72)}"+
      ".geiConn .gcKey{margin-top:2px;font-size:1.22rem;font-weight:1000;letter-spacing:.07em;line-height:1.05;color:#fff;text-shadow:0 0 14px rgba(47,210,255,.7)}"+
      ".geiConn .gcAgain{pointer-events:auto;margin-top:7px;min-height:30px;padding:5px 11px;border-radius:999px;border:1.2px solid rgba(255,255,255,.5);"+
        "background:rgba(255,255,255,.1);color:#fff;font:inherit;font-size:.62rem;font-weight:900;letter-spacing:.1em;cursor:pointer;touch-action:manipulation}"+
      ".geiConn .gcAgain:active{background:rgba(47,210,255,.3)}"+
      ".geiConn .gcNote{margin-top:4px;font-size:.5rem;font-weight:700;letter-spacing:.08em;color:rgba(255,255,255,.5)}"+
      /* reveal sequence ≈ 1.6s: card in → label → keyword → glow pulse → settle */
      ".geiConn.reveal .gcAction{animation:gcFade .4s ease both}"+
      ".geiConn.reveal .gcArrow,.geiConn.reveal .gcLabel{animation:gcFade .4s ease .35s both}"+
      ".geiConn.reveal .gcKey{animation:gcPop .55s cubic-bezier(.3,1.5,.5,1) .6s both,gcGlow 1.0s ease-in-out 1.15s 1}"+
      "@keyframes gcFade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}"+
      "@keyframes gcPop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}"+
      "@keyframes gcGlow{0%,100%{text-shadow:0 0 14px rgba(47,210,255,.7)}50%{text-shadow:0 0 26px rgba(255,215,106,.95),0 0 10px #fff}}"+
      ".geiConn.compact{width:clamp(138px,42%,190px);padding:6px 9px}.geiConn.compact .gcArrow,.geiConn.compact .gcNote{display:none}"+
      ".geiConn.compact .gcKey{font-size:1.02rem}.geiConn.compact .gcAgain{margin-top:4px;min-height:26px;padding:3px 9px}"+
      ".geiConn.micro{width:clamp(132px,40%,176px);padding:5px 8px;border-radius:12px}.geiConn.micro .gcArrow,.geiConn.micro .gcNote,.geiConn.micro .gcLabel{display:none}"+
      ".geiConn.micro .gcDay{font-size:.52rem}.geiConn.micro .gcAction{margin-top:1px;font-size:.7rem}.geiConn.micro .gcKey{margin-top:1px;font-size:.92rem}"+
      ".geiConn.micro .gcKey::before{content:'GEI · ';font-size:.55rem;letter-spacing:.12em;color:rgba(255,255,255,.7);text-shadow:none}"+
      ".geiConn.micro .gcAgain{margin-top:3px;min-height:26px;padding:2px 8px;font-size:.55rem}"+
      ".geiConn.nano{padding:5px 7px}.geiConn.nano .gcKey{font-size:.84rem;line-height:1.05;overflow-wrap:anywhere}.geiConn.nano .gcAction{font-size:.62rem;overflow-wrap:anywhere}"+
      ".geiConn.nano .gcKey::before{content:'GEI';display:block;font-size:.5rem}.geiConn.nano .gcDay{font-size:.48rem}"+
      ".dmwPill.geiTeach{animation:gcPill 1.4s ease-in-out 1}@keyframes gcPill{0%,100%{filter:none}50%{filter:drop-shadow(0 0 10px #ffd76a) brightness(1.25)}}"+
      "@media(prefers-reduced-motion:reduce){.geiConn,.geiConn *{animation:none!important;transition:none!important}.dmwPill.geiTeach{animation:none}}";
    document.head.appendChild(s);
  }
  function ensureCard(){
    if(card&&card.isConnected)return card;
    var scene=$("dmwScene");if(!scene)return null;
    css();
    card=document.createElement("aside");card.id="geiConnCard";card.className="geiConn hidden";
    card.setAttribute("aria-live","polite");card.setAttribute("aria-label","GEI Connection");
    card.innerHTML='<div class="gcDay"></div><div class="gcAction"></div><div class="gcArrow" aria-hidden="true">↓</div>'+
      '<div class="gcLabel">GEI CONNECTION</div><div class="gcKey"></div>'+
      '<button type="button" class="gcAgain" aria-label="Learn again: hear the GEI connection">▶ LEARN AGAIN</button>'+
      '<div class="gcNote">WITHIN THE GEI FRAMEWORK</div>';
    scene.appendChild(card);
    card.querySelector(".gcAgain").addEventListener("click",function(e){e.stopPropagation();learnAgain();});
    return card;
  }
  function fill(day){
    var d=GEI_DAY_CONNECTIONS[day];if(!d||!ensureCard())return false;
    var i=day-1;cardDay=day;
    card.querySelector(".gcDay").textContent=ICONS[i]+" DAY "+day+" · "+STATION_NAMES[i];
    card.querySelector(".gcAction").textContent=d.actionLabel;
    card.querySelector(".gcKey").textContent=d.connectionLabel;
    card.setAttribute("aria-label","GEI Connection. Day "+day+": "+d.actionLabel+". GEI connection: "+d.connectionLabel+".");
    return true;
  }
  /* Candidate spots around the Beaver, in scene px: below him, above him, then the free side. First one that
     fits inside the visible window without touching the Beaver, the station pin or the station-pill row wins. */
  function place(){
    if(!card||card.classList.contains("hidden")||!B)return;
    var L=B.layout();if(!L)return;
    var bv=L.beaver,pn=L.pin,V=L.view,G=9,vis=V.y1-V.y0;
    function hit(a,b,pad){pad=pad||0;return !(a.r+pad<=b.l||a.l-pad>=b.l+b.w||a.b+pad<=b.t||a.t-pad>=b.t+b.h);}
    /* Three sizes, tried in order: full → compact → micro. Smaller phones simply get a smaller card. */
    var levels=vis<330?["compact","micro","nano"]:["","compact","micro","nano"],best=null,fallback=null;
    for(var li=0;li<levels.length&&!best;li++){
      var lv=levels[li];
      card.classList.toggle("compact",lv==="compact");card.classList.toggle("micro",lv==="micro"||lv==="nano");card.classList.toggle("nano",lv==="nano");
      card.style.width="";
      var freeR=V.x1-(pn.l+pn.w)-G-4;                          // free strip right of the station pin
      if(lv==="nano"){if(freeR<76)continue;card.style.width=Math.min(150,Math.round(freeR))+"px";}
      var cw=card.offsetWidth,ch=card.offsetHeight;
      var clampX=function(x){return Math.max(V.x0+4,Math.min(V.x1-cw-4,x));};
      var cx=bv.l+bv.w/2-cw/2,px=pn.l+pn.w/2-cw/2;
      var cands=[
        {l:cx,t:bv.t+bv.h+G},                                // below the Beaver
        {l:cx,t:bv.t-ch-G},                                  // above the Beaver
        {l:pn.l+pn.w+G,t:pn.t+pn.h-ch},                      // right of the pin (bottom-aligned)
        {l:pn.l+pn.w+G,t:Math.max(V.y0+2,Math.min(V.y1-ch,pn.t))},   // right of the pin (top-aligned)
        {l:px,t:pn.t+pn.h+G},                                // under the pin
        {l:px,t:pn.t-ch-G},                                  // above the pin
        {l:V.x1-cw-4,t:V.y0+4},{l:V.x0+4,t:V.y0+4}           // corners of the visible window
      ];
      for(var i=0;i<cands.length;i++){
        var c=cands[i],l=clampX(c.l),t=c.t,r={l:l,t:t,r:l+cw,b:t+ch};
        if(t<V.y0+2||t+ch>V.y1)continue;
        if(hit(r,bv,4)||hit(r,pn,6))continue;
        best={l:l,t:t};lastPlacement={level:lv,cand:i};break;
      }
      if(!fallback)fallback={l:clampX(cands[0].l),t:Math.max(V.y0+2,Math.min(V.y1-ch,cands[0].t))};
    }
    if(!best)lastPlacement={level:"fallback",L:L};
    best=best||fallback;
    card.style.left=Math.round(best.l)+"px";card.style.top=Math.round(best.t)+"px";
  }
  function schedulePlace(delay){clearTimeout(placeT);placeT=setTimeout(place,delay||0);}
  function showCard(day,animate){
    if(!fill(day))return;
    card.classList.remove("hidden");
    place();
    void card.offsetWidth;
    card.classList.add("show");
    if(animate&&!reduced()){card.classList.remove("reveal");void card.offsetWidth;card.classList.add("reveal");}
    else card.classList.remove("reveal");
    schedulePlace(60);                                        // re-measure once fonts/layout settled
    if(animate){
      var pill=document.querySelector('.dmwPill[data-i="'+(day-1)+'"]');                 // the station reacts
      if(pill&&!reduced()){pill.classList.remove("geiTeach");void pill.offsetWidth;pill.classList.add("geiTeach");clearTimeout(pulseT);pulseT=setTimeout(function(){pill.classList.remove("geiTeach");},1500);}
    }
    A&&A.refreshDebug&&A.refreshDebug();
  }
  function hideCard(){
    clearTimeout(fallbackT);clearTimeout(placeT);clearTimeout(pulseT);
    if(card){card.classList.remove("show","reveal");card.classList.add("hidden");}
    cardDay=0;
  }

  /* ------------------------------------------------------------------ the teaching sequence
     first discovery : [Beaver arrival phrase, queued by the guide] → ACTION → short pause → GEI CONNECTION (+ card)
     later visits    : card is shown quietly; ACTION or a short Beaver reaction only; LEARN AGAIN replays the connection */
  function speakConnection(day,o){
    var d=GEI_DAY_CONNECTIONS[day];if(!d||!B)return false;
    return B.speak(d.connectionId,Object.assign({pri:3,ttl:30000},o||{}));
  }
  function onMapOpened(plan){
    if(!A||!B)return;
    var day=(plan.stationIndex|0)+1,d=GEI_DAY_CONNECTIONS[day];if(!d)return;
    var mySeq=++seq;clearTimeout(fallbackT);
    ensureCard();
    A.preloadBeaver([d.connectionId].concat(GEI_DAY_CONNECTIONS[day+1]?[GEI_DAY_CONNECTIONS[day+1].connectionId]:[]));   // this day + the next
    if(isHeard(day)){
      showCard(day,false);                                    // later visit: visual reminder, no automatic lecture
      if(d.actionAudioId&&!plan.welcome)B.speak(d.actionAudioId,{pri:2,delay:1100});
      return;
    }
    var chain=Date.now();
    if(d.actionAudioId)B.speak(d.actionAudioId,{pri:3,after:450,chain:chain,ttl:30000});   // ACTION (only if a recording exists)
    var queued=speakConnection(day,{after:950,chain:chain});                               // short pause, then the GEI CONNECTION
    if(!queued){                                              // muted / blocked / refused: the screen still teaches
      fallbackT=setTimeout(function(){if(mySeq!==seq)return;showCard(day,true);markHeard(day);},1100);
    }else{
      hideCard();                                             // the card is revealed in sync with the connection voice (see onBeaverEvent)
      /* ...but the player is never left without it, even if the voice chain stalls */
      fallbackT=setTimeout(function(){if(mySeq===seq&&!revealed[mySeq]){revealed[mySeq]=1;showCard(day,true);markHeard(day);}},22000);
    }
  }
  /* Voice events drive the reveal: card fades in as the connection voice starts; heard when it finishes. */
  function onBeaverEvent(ev){
    var c=ev&&ev.clip;if(!c||!c.id||ev.channel==="wow")return;
    var m=/^day([1-6])_(?!action)/.exec(c.id);if(!m)return;
    var day=+m[1];
    if(ev.type==="start"){revealed[seq]=1;clearTimeout(fallbackT);showCard(day,true);}
    else if(ev.type==="end"){markHeard(day);}
    else if(ev.type==="fail"||(ev.type==="drop"&&ev.extra!=="outside-dam-map")){if(!revealed[seq]){revealed[seq]=1;showCard(day,true);}markHeard(day);}   // audio impossible → the card still teaches
  }
  function learnAgain(){
    if(!cardDay)return;
    var day=cardDay;
    if(!speakConnection(day,{force:true,pri:3,ttl:8000}))showCard(day,true);   // sound unavailable: replay the visual reveal
  }

  /* ------------------------------------------------------------------ map tap: review any reached day's card */
  function onPillClick(e){
    var b=e.target.closest&&e.target.closest(".dmwPill");if(!b)return;
    var i=+b.dataset.i,cur=B&&B.context&&B.context().currentStationIndex;
    if(typeof cur==="number"&&i<=cur)showCard(i+1,false);     // reached days only; future days stay a surprise
  }

  /* ------------------------------------------------------------------ lifecycle (bind once) */
  function onZone(ev){if(ev&&ev.detail&&ev.detail.zone!=="DAM_MAP"){seq++;hideCard();}}   // leaving the map cancels every pending timer + card
  function debugLine(){
    if(!B||!A)return "";
    var c=B.context(),day=c.currentDay,d=GEI_DAY_CONNECTIONS[day]||{},bs=A.beaver;
    return "Current Day: "+day+"  Station: "+STATION_NAMES[day-1]+"\nBeaver: "+(A.zone==="DAM_MAP"?(bs.speaking?"SPEAKING":"ACTIVE"):"BLOCKED")+
      "\nAction audio: "+(d.actionAudioId||"(none)")+"\nGEI audio: "+(d.connectionId||"-")+(isHeard(day)?"  [heard]":"  [new]");
  }
  var bound=false;
  function bindMapNodes(){
    var page=$("geiDamMapPage");if(!page||page.__geiConnBound)return !!page;
    page.__geiConnBound=true;
    page.addEventListener("click",onPillClick,true);
    return true;
  }
  function boot(){
    if(bound)return;
    A=window.GEI_AUDIO;B=window.GEI_BEAVER_VOICE;
    if(!A||!B){return;}
    bound=true;
    registerAll();
    window.GEI_DAY_TEACH={version:VERSION,onMapOpened:onMapOpened};
    A.onBeaver(onBeaverEvent);
    A.addDebugProvider(debugLine);
    window.addEventListener("gei:audio-zone",onZone);
    window.addEventListener("gei:beaver-placed",function(){schedulePlace(0);});
    window.addEventListener("resize",function(){schedulePlace(120);},{passive:true});
    if(!bindMapNodes()){var mo=new MutationObserver(function(){if(bindMapNodes())mo.disconnect();});mo.observe(document.body,{childList:true});}
    /* a map that is already open when this script finishes loading */
    var page=$("geiDamMapPage");if(page&&page.classList.contains("show")&&A.isDamMapOpen())onMapOpened({stationIndex:B.context().currentStationIndex,welcome:false});
  }

  window.GEI_DAY_CONNECTIONS_API={version:VERSION,data:GEI_DAY_CONNECTIONS,stations:STATION_NAMES.slice(),
    get lastPlacement(){return lastPlacement;},isHeard:isHeard,show:function(day){showCard(day,true);},hide:hideCard,learnAgain:learnAgain,setActionAudio:setActionAudio,
    resetHeard:function(){if(B)B.remember("geiConnectionHeard",{});},
    selfTest:function(){return {version:VERSION,days:Object.keys(GEI_DAY_CONNECTIONS).length,
      allHaveAudio:Object.keys(GEI_DAY_CONNECTIONS).every(function(k){return /^https:\/\/assets\.zyrosite\.com\/.+\.mp3$/.test(GEI_DAY_CONNECTIONS[k].connectionAudio);}),
      labels:Object.keys(GEI_DAY_CONNECTIONS).map(function(k){return GEI_DAY_CONNECTIONS[k].connectionLabel;}),bound:bound,card:!!card,
      noSpeechSynthesis:true,presentationOnly:true};}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
  window.addEventListener("load",boot,{once:true});
})();
