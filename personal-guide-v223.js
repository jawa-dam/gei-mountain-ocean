/* V2.2.3 — PERSONAL DAM GUIDE 👤🦫
 * YOUR CHARACTER. YOUR GUIDE. YOUR JOURNEY.
 *
 * The player's ACTIVE CHARACTER becomes their personal companion on the DAM Map, in the STEM labs and in
 * FOLLOW THE WATER. Wilbert stays — as the optional expert mentor ("ASK WILBERT").
 *
 * ONE source of truth: the game's own `state.activeCharacter` (via getActiveCharacter / isUnlocked /
 * isPlayableCharacter in index.html). This module only READS it — no second selector, inventory, unlock,
 * purchase or persistence system. It re-verifies on every read that the character is playable AND owned
 * (the same `unlockedCharacters` list the store / entitlement flow writes), and otherwise falls back exactly
 * like the game does. A locked, cameo-only or unknown id can never become the guide.
 *
 *   current()      → {id,name,image,unlocked,personality,style,emoji,mapAnimations,stationReactions(station)}
 *   line(key)      → a short personalised reaction (per-character → per-style → base library)
 *   register(id,{key:line|[lines]})   future characters get unique reactions without touching the engine
 *   react(key)     → small speech bubble beside the guide on the map (short-lived, never covers the water)
 *
 * Map companion = the existing walking sprite of the Beaver voice guide, re-skinned (setGuideArt); it keeps the
 * station-aware placement, the GEI card avoidance and the Universal DAM View scaling.
 *
 * Presentation only: writes one tiny memory key "geiPersonalGuide.v1" (intro seen / first-time moments).
 * It never touches game state, FL OZ, XP, STEM XP, purchases, ownership or entitlements.
 */
(function(){
  "use strict";
  if(window.__GEI_PERSONAL_GUIDE__)return;
  var G=window.GEI_STEM||{},VERSION="V2.2.3",MKEY="geiPersonalGuide.v1",PID="geiDamMapPage";
  function $(id){return document.getElementById(id);}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
  function reduced(){try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function isOpen(){var p=$(PID);return !!(p&&p.classList.contains("show"));}

  /* ---------- 1. the active character: read-only view of the game's single source of truth ---------- */
  var CREW={id:"crew",label:"DAM NATION",emoji:"💧",style:"crew",greeting:"Keep the flow moving!"};
  var BEAVERS={"wilbert-dam-guide":1,"yall-too-beaver":1};          // the beaver family keeps the Beaver voice glow
  var EMOTE_FOR={mountain:"lookup",dam:"inspect",reservoir:"float",sluice:"pull",wheel:"sway",ocean:"cheer"};   // station → map animation
  var AMP={energy:1.35,roar:1.3,celebrate:1.25,spark:1.2,steady:.8,watch:.8,night:.8,light:.9};                 // personality → motion size
  function characterById(id){try{return CHARACTERS.filter(function(c){return c.id===id;})[0]||null;}catch(e){return null;}}
  function current(){
    var c=null,ok=false;
    try{c=getActiveCharacter();}catch(e){}
    try{ok=!!c&&isPlayableCharacter(c)&&isUnlocked("characters",c.id);}catch(e){}      // re-verify with the game's own ownership check
    if(!ok){c=characterById("wilbert-dam-guide")||c||{id:"wilbert-dam-guide",name:"Wilbert the DAM Guide",img:""};ok=true;}   // the game's own fallback: the free default
    var per=CREW;try{per=GEI_CHARACTER_PERSONALITIES[c.id]||CREW;}catch(e){}
    var prof={};try{prof=CHARACTER_SPOTLIGHT_PROFILES[c.id]||{};}catch(e){}
    var d={id:c.id,name:c.name,image:c.img,unlocked:ok,personality:per,style:per.style||"crew",emoji:per.emoji||"💧",label:per.label||"DAM NATION",
      accent:prof.accent||"#2fd2ff",beaverFamily:!!BEAVERS[c.id],amp:AMP[per.style]||1};
    d.mapAnimations=EMOTE_FOR;
    d.stationReactions=function(station){var o={};Object.keys(BASE).forEach(function(k){if(k.indexOf(station+".")===0)o[k]=line(k);});return o;};
    return d;
  }
  function wilbert(){var c=characterById("wilbert-dam-guide");return {id:"wilbert-dam-guide",name:"Wilbert",image:c?c.img:"",emoji:"🦫"};}

  /* ---------- 2. reaction library: per-character → per-style → base. Reactions never state new science. ---------- */
  var BASE={
    "ready":"READY TO FOLLOW THE WATER?","letsGo":"LET'S GO!","tryGate":"Try opening the gate!","curious":"What happens if we change it?","celebrate":"YOU DID IT!",
    "encourage":"You've got this!","hub":"Where to next?","badge":"A new badge!","master":"We followed the water all the way!",
    "mountain.observe":"Let's see where this water goes!","mountain.firstVisit":"The water starts right HERE!","mountain.waterStarted":"Look — the water is on its way!",
    "mountain.rain":"Rain! Watch it run downhill.","mountain.snow":"Snow now… meltwater later.","mountain.runoff":"Look at it go!",
    "mountain.pathRight":"Downhill — just like we thought!","mountain.pathWrong":"Hmm, not that way. Try another!","mountain.completed":"The water's journey has begun!",
    "dam.observe":"Let's check this wall…","dam.inspect":"Let's check this wall…","dam.firstVisit":"Whoa — the water stops here!","dam.stable":"That wall is holding!","dam.leak":"Whoa, a leak! Let's improve it.",
    "dam.poor":"Close! The water's too high — make it stronger.","dam.master":"The strongest wall ever!","dam.completed":"What a wall!",
    "reservoir.observe":"Let's see how much water we've got…","reservoir.firstExperiment":"Look at the water level go!","reservoir.rising":"We're storing a lot of water!","reservoir.falling":"The water level is dropping.",
    "reservoir.stable":"Perfectly balanced!","reservoir.overflow":"Whoa — it's full to the top!","reservoir.dry":"Not much water left!","reservoir.safe":"The reservoir is safe!","reservoir.completed":"All that water, under control!",
    "sluice.observe":"What does this gate do?","sluice.firstOperation":"Here comes the water!","sluice.opening":"Here it comes!","sluice.highFlow":"Whoa! Look at that flow!","sluice.controlled":"Now THAT is controlled flow!",
    "sluice.closed":"Gate closed — the water waits.","sluice.lowhead":"Less push this time!","sluice.completed":"You've got the gate under control!",
    "wheel.observe":"What's making it spin?","wheel.firstTurbine":"It's spinning!","wheel.spinning":"It's spinning!","wheel.fast":"Faster and faster!","wheel.stopped":"It stopped… open the gate!",
    "wheel.firstPower":"We made power!","wheel.power":"We made power!","wheel.townLit":"The whole town is glowing!","wheel.completed":"Power on!",
    "ocean.observe":"Where does the water go next?","ocean.arrival":"We made it all the way downstream!","ocean.firstArrival":"We made it all the way downstream!","ocean.low":"The fish need more water…",
    "ocean.flood":"Too much, too fast!","ocean.healthy":"Look — everything is coming alive!","ocean.completed":"People and nature, both happy!",
    "system.observe":"Where is the water going? Let's follow it!","system.tourStart":"Follow the water!","system.tourEnd":"That's the whole journey!","system.changed":"Whoa! We changed the whole system!",
    "system.closed":"Gate closed — watch where the water goes!","system.predictRight":"I thought so!","system.predictWrong":"Good try! Let's see what happens.","system.thinker":"Systems thinker!"
  };
  /* personality styles (the game's own GEI_CHARACTER_PERSONALITIES styles) can flavour a few key moments */
  var STYLE={
    guide:{"dam.stable":"Flow check — that wall is solid!","sluice.highFlow":"Flow check! That's a LOT of flow!"},
    builder:{"dam.stable":"Built to last!","dam.leak":"Back to the drawing board!","dam.master":"Now THAT'S a build!"},
    rescue:{"dam.leak":"Leak alert! Let's patch it!","sluice.highFlow":"Pressure check — strong flow!","reservoir.overflow":"Rescue time — release some water!"},
    command:{"sluice.opening":"Part the flow!","sluice.highFlow":"The water obeys!"},
    heart:{"ocean.healthy":"I love a healthy river!","wheel.power":"Lights on — I love it!"},
    watch:{"dam.inspect":"I'm watching that wall…","reservoir.rising":"I see the level rising!"},
    spooky:{"dam.leak":"Drip… drip… a spooky leak!","wheel.power":"The lights flicker on… spooky!"},
    gift:{"wheel.power":"A gift of light for the town!","ocean.healthy":"What a gift for the river!"},
    celebrate:{"dam.stable":"That's DAM good!","wheel.power":"That's DAM good power!"},
    mechanic:{"wheel.spinning":"Smooth rotation!","wheel.power":"Output looks great!","dam.inspect":"Inspecting the structure…"},
    ocean:{"ocean.arrival":"Downstream, here we come!","sluice.highFlow":"Send it downstream!"},
    roar:{"sluice.highFlow":"ROAR! What a flow!","wheel.fast":"ROAR! So fast!"},
    night:{"wheel.power":"Lights on in the night!"},light:{"wheel.power":"Lights on!"},
    energy:{"sluice.highFlow":"Splash! Look at that flow!","wheel.fast":"Zoom! So fast!"},
    nature:{"ocean.healthy":"Everything is growing!"},mountain:{"mountain.firstVisit":"Mountain to ocean — starting HERE!"},
    rhythm:{"wheel.spinning":"Listen to that rhythm!"},spark:{"wheel.power":"Sparkle! Power on!"},wave:{"ocean.arrival":"Wave to the ocean!"}
  };
  var BIG={"master":1,"badge":1,"ocean.arrival":1,"ocean.firstArrival":1,"wheel.firstPower":1,"wheel.power":1,"celebrate":1,"system.thinker":1,"mountain.completed":1,"dam.completed":1,"reservoir.completed":1,"sluice.completed":1,"wheel.completed":1,"ocean.completed":1};
  var CUSTOM={};                                    // register(): per-character overrides
  function pick(v,seed){return Array.isArray(v)?v[seed%v.length]:v;}
  var seed=0;
  function line(key,fallback,id){
    var d=current(),cid=id||d.id,v=(CUSTOM[cid]&&CUSTOM[cid][key])||(STYLE[d.style]&&STYLE[d.style][key])||BASE[key]||fallback||"";
    var t=String(pick(v,seed++));
    var g=d.personality&&d.personality.greeting;                     // big moments borrow the character's own catchphrase
    if(BIG[key]&&!(CUSTOM[cid]&&CUSTOM[cid][key])&&g&&g.length<=22&&t.length+g.length<44&&!/^(YOU DID|READY)/.test(t))t=g+" "+t;
    return t;
  }
  function register(id,lines){if(!id||!lines||typeof lines!=="object")return false;CUSTOM[id]=Object.assign(CUSTOM[id]||{},lines);return true;}

  /* ---------- memory (presentation only) ---------- */
  function mem(){var m={intro:{},moments:{}};try{var j=JSON.parse(localStorage.getItem(MKEY)||"null");if(j&&typeof j==="object"){["intro","moments"].forEach(function(k){if(j[k]&&typeof j[k]==="object")Object.keys(j[k]).forEach(function(x){if(j[k][x]===1)m[k][x]=1;});});}}catch(e){}return m;}
  function remember(k,x){var m=mem();m[k][x]=1;try{localStorage.setItem(MKEY,JSON.stringify(m));}catch(e){}}

  /* ---------- 3. the map companion: the existing walking sprite wears the active character ---------- */
  function styles(){
    if($("pgStyles"))return;
    var s=document.createElement("style");s.id="pgStyles";
    s.textContent=[
      "#geiBeaverGuide{filter:drop-shadow(0 6px 10px rgba(0,0,0,.55)) drop-shadow(0 0 10px var(--pg-accent,rgba(47,210,255,.35)))}",
      "#geiBeaverGuide.pgEmote .bvBody{animation:var(--pg-anim) 1.5s ease-in-out 1}",
      "@keyframes pgLookup{0%,100%{transform:none}35%{transform:translateY(-4px) rotate(calc(-5deg*var(--pg-amp,1))) scale(1.03)}70%{transform:translateY(-2px) rotate(calc(3deg*var(--pg-amp,1)))}}",
      "@keyframes pgInspect{0%,100%{transform:none}40%{transform:translateX(calc(5px*var(--pg-amp,1))) rotate(calc(4deg*var(--pg-amp,1)))}75%{transform:translateX(calc(2px*var(--pg-amp,1)))}}",
      "@keyframes pgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(-7px*var(--pg-amp,1)))}}",
      "@keyframes pgPull{0%,100%{transform:none}35%{transform:translateX(calc(7px*var(--pg-amp,1))) scale(1.04,.97)}65%{transform:translateX(calc(-3px*var(--pg-amp,1)))}}",
      "@keyframes pgSway{0%,100%{transform:rotate(0)}25%{transform:rotate(calc(-6deg*var(--pg-amp,1)))}75%{transform:rotate(calc(6deg*var(--pg-amp,1)))}}",
      "@keyframes pgCheer{0%,100%{transform:none}30%{transform:translateY(calc(-14px*var(--pg-amp,1))) scale(1.05)}55%{transform:translateY(0)}75%{transform:translateY(calc(-6px*var(--pg-amp,1)))}}",
      "@keyframes pgPop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.12);opacity:1}100%{transform:scale(1)}}",
      "#geiBeaverGuide.pgIntro .bvBody{animation:pgPop .6s ease-out 1}",
      /* small, short-lived speech bubble */
      ".pgBubble{position:absolute;z-index:7;max-width:min(176px,46%);padding:6px 10px;border-radius:14px;background:rgba(255,255,255,.97);color:#0a1230;font-weight:800;font-size:clamp(12px,3.2cqw,14px);line-height:1.2;text-align:center;",
      "pointer-events:none;opacity:0;transform:translateY(4px) scale(.94);transition:opacity .2s,transform .2s;box-shadow:0 4px 14px rgba(0,0,0,.4)}",
      ".pgBubble.show{opacity:1;transform:none}.pgBubble::after{content:\"\";position:absolute;left:var(--pg-tail,50%);bottom:-6px;width:12px;height:12px;background:inherit;transform:translateX(-50%) rotate(45deg);border-radius:2px}",
      ".pgBubble.big{background:linear-gradient(135deg,#fff,#ffe9a8);font-size:clamp(13px,3.6cqw,16px)}",
      /* ASK WILBERT: one small floating button; the answer is a compact, dismissible card */
      ".pgAsk{position:absolute;z-index:8;top:calc(8px + env(safe-area-inset-top,0px)*0);right:8px;min-width:52px;min-height:52px;border-radius:50%;border:2px solid #ffd66b;background:rgba(5,10,24,.9);padding:0;cursor:pointer;display:grid;place-items:center;box-shadow:0 0 14px rgba(255,214,107,.4);color:#fff}",
      ".pgAsk .pgAskFace{position:relative;width:38px;height:38px;border-radius:50%;overflow:hidden;display:grid;place-items:center;font-size:24px;background:#10264a}.pgAsk img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
      ".pgAsk b{position:absolute;right:-2px;bottom:-2px;width:20px;height:20px;border-radius:50%;background:#ffd66b;color:#0a1230;font-size:13px;line-height:20px;text-align:center}",
      ".pgAsk.talk{animation:pgFloat .55s ease-in-out infinite}.pgAsk:focus-visible,.pgSkip:focus-visible,.pgCard button:focus-visible{outline:3px solid #fff;outline-offset:2px}",
      ".pgCard{position:absolute;z-index:9;top:68px;right:8px;left:8px;max-width:360px;margin-left:auto;padding:10px 12px;border-radius:16px;background:rgba(5,10,24,.96);border:1.5px solid #ffd66b;color:#eefcff;box-shadow:0 8px 28px rgba(0,0,0,.55);display:none}",
      ".pgCard.show{display:block}.pgRow{display:flex;gap:8px;align-items:flex-start;margin:0 0 8px}.pgRow:last-of-type{margin-bottom:6px}",
      ".pgFace{flex:0 0 auto;position:relative;width:34px;height:34px;border-radius:50%;overflow:hidden;display:grid;place-items:center;font-size:20px;background:#10264a;border:1.5px solid #7ff0ff}.pgFace img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
      ".pgSay{flex:1;min-width:0;font-size:14px;font-weight:700;line-height:1.3}.pgSay small{display:block;font-size:10.5px;letter-spacing:.12em;color:#7ff0ff;font-weight:900}.pgRow.wil .pgSay small{color:#ffd66b}",
      ".pgBtns{display:flex;gap:8px}.pgBtns button{flex:1;min-height:44px;border-radius:12px;border:1.5px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;font-weight:900;font-size:13px;cursor:pointer}.pgBtns .go{border-color:#7ff0ff;background:rgba(47,210,255,.18)}",
      ".pgSkip{position:absolute;z-index:9;left:8px;top:8px;min-height:44px;min-width:88px;padding:0 14px;border-radius:999px;border:1.5px solid rgba(255,255,255,.5);background:rgba(5,10,24,.85);color:#fff;font-weight:900;font-size:13px;letter-spacing:.06em;cursor:pointer}",
      ".pgSkip[hidden]{display:none}",
      "@media(prefers-reduced-motion:reduce){#geiBeaverGuide.pgEmote .bvBody,#geiBeaverGuide.pgIntro .bvBody,.pgAsk.talk{animation:none!important}.pgBubble{transition:none}}"
    ].join("");
    document.head.appendChild(s);
  }
  function sprite(){return $("geiBeaverGuide");}
  var shownArt="",shownId="";
  function applyArt(){
    var d=current();styles();var bv=window.GEI_BEAVER_VOICE,sp=sprite();
    if(sp){sp.style.setProperty("--pg-accent",d.accent+"88");sp.style.setProperty("--pg-amp",d.amp);sp.setAttribute("data-guide",d.id);}
    if(bv&&bv.setGuideArt&&(shownId!==d.id||shownArt!==d.image)){bv.setGuideArt(d.image,{id:d.id,emoji:d.emoji,wilbert:d.beaverFamily});shownId=d.id;shownArt=d.image;}
    return d;
  }
  function refresh(){return applyArt();}

  /* ---------- station emotes: the guide reacts to where the water journey is ---------- */
  var emoteT=0,pinSeen="";
  function stationId(){try{var p=window.__GEI_V2170_DAM_MAP__.progress();return G.order[p.station]||"mountain";}catch(e){return "mountain";}}
  function emote(name){
    var sp=sprite();if(!sp||reduced())return;
    var anim={lookup:"pgLookup",inspect:"pgInspect",float:"pgFloat",pull:"pgPull",sway:"pgSway",cheer:"pgCheer"}[name];if(!anim)return;
    sp.style.setProperty("--pg-anim",anim);sp.classList.remove("pgEmote");void sp.offsetWidth;sp.classList.add("pgEmote");
    clearTimeout(emoteT);emoteT=setTimeout(function(){sp.classList.remove("pgEmote");},1600);
  }
  function watchPin(){
    var pin=$("geiMapPin");if(!pin||pin.__pgWatch)return;pin.__pgWatch=1;
    new MutationObserver(function(){
      var k=pin.style.left+"|"+pin.style.top;if(k===pinSeen)return;pinSeen=k;
      setTimeout(function(){if(!isOpen())return;var st=stationId();emote(EMOTE_FOR[st]);},1250);     // after the walk to the new station
    }).observe(pin,{attributes:true,attributeFilter:["style"]});
  }

  /* ---------- the small speech bubble beside the guide (never over the pin, GEI card or station pills) ---------- */
  var bubble=null,bubT=0,lastBub=0,live=null;
  function ensureBubble(){
    var scene=$("dmwScene");if(!scene)return null;
    if(!bubble||!bubble.isConnected){bubble=document.createElement("div");bubble.className="pgBubble";bubble.setAttribute("aria-hidden","true");scene.appendChild(bubble);}
    if(!live||!live.isConnected){live=document.createElement("div");live.className="srOnly";live.setAttribute("role","status");live.setAttribute("aria-live","polite");var p=$(PID);if(p)p.appendChild(live);}
    return bubble;
  }
  function rect(el,sr){if(!el)return null;var r=el.getBoundingClientRect();if(!r.width)return null;return {l:r.left-sr.left,t:r.top-sr.top,w:r.width,h:r.height};}
  function hit(a,b,pad){pad=pad||4;return a&&b&&!(a.l+a.w+pad<=b.l||a.l-pad>=b.l+b.w||a.t+a.h+pad<=b.t||a.t-pad>=b.t+b.h);}
  function placeBubble(){
    if(!bubble||!bubble.classList.contains("show"))return;
    var scene=$("dmwScene"),sp=sprite(),wrap=$("dmwScroll");if(!scene||!sp||!wrap)return;
    var sr=scene.getBoundingClientRect(),S=rect(sp,sr),bw=bubble.offsetWidth,bh=bubble.offsetHeight;
    var vx0=wrap.scrollLeft+4,vx1=wrap.scrollLeft+wrap.clientWidth-4,vy0=Math.max(0,scene.clientHeight-wrap.clientHeight)+4;
    var avoid=[rect($("geiMapPin"),sr),rect(document.querySelector(".geiConn.show"),sr)];
    [].forEach.call(document.querySelectorAll("#geiMapRegions .dmwPill"),function(p){avoid.push(rect(p,sr));});
    var cands=[{l:S.l+S.w/2-bw/2,t:S.t-bh-8},{l:S.l+S.w-bw*.25,t:S.t-bh-8},{l:S.l-bw*.75,t:S.t-bh-8},{l:S.l+S.w+6,t:S.t+S.h*.15},{l:S.l-bw-6,t:S.t+S.h*.15}];
    for(var i=0;i<cands.length;i++){
      var l=clamp(cands[i].l,vx0,vx1-bw),t=cands[i].t,r={l:l,t:t,w:bw,h:bh};
      if(t<vy0||l+bw>vx1+1)continue;
      if(avoid.some(function(a){return hit(r,a);}))continue;
      bubble.style.left=Math.round(l)+"px";bubble.style.top=Math.round(t)+"px";
      bubble.style.setProperty("--pg-tail",clamp(S.l+S.w/2-l,14,bw-14)+"px");
      return true;
    }
    bubble.classList.remove("show");return false;                       // no clear spot: stay quiet (the live region still announces it)
  }
  function say(text,o){
    o=o||{};var now=Date.now();
    if(!isOpen())return false;
    if(!o.force&&now-lastBub<2600)return false;                          // a companion, not a narrator: never a stream of chatter
    lastBub=now;var b=ensureBubble();if(!b)return false;
    if(live)live.textContent=text;
    b.textContent=text;b.classList.toggle("big",!!o.big);b.classList.add("show");
    requestAnimationFrame(placeBubble);
    clearTimeout(bubT);bubT=setTimeout(function(){if(bubble)bubble.classList.remove("show");},o.ms||2800);
    return true;
  }
  function react(key,fallback,o){return say(line(key,fallback),o);}
  window.addEventListener("gei:beaver-placed",function(){placeBubble();});

  /* ---------- 4. ASK WILBERT: the optional expert mentor ---------- */
  var ask=null,card=null,cardT=0;
  function face(who){return '<span class="pgFace" aria-hidden="true">'+esc(who.emoji||"🦫")+(who.image?'<img alt="" src="'+esc(who.image)+'" onerror="this.remove()">':"")+'</span>';}
  function mountAsk(){
    var stage=document.querySelector("#"+PID+" .dmwStage");if(!stage||$("pgAsk"))return;styles();
    var w=wilbert();
    ask=document.createElement("button");ask.type="button";ask.id="pgAsk";ask.className="pgAsk";ask.setAttribute("aria-label","Ask Wilbert, the expert dam guide");ask.title="Ask Wilbert";
    ask.innerHTML='<span class="pgAskFace" aria-hidden="true">🦫'+(w.image?'<img alt="" src="'+esc(w.image)+'" onerror="this.remove()">':"")+'</span><b aria-hidden="true">?</b>';
    card=document.createElement("div");card.id="pgCard";card.className="pgCard";card.setAttribute("role","dialog");card.setAttribute("aria-label","Ask Wilbert");
    stage.appendChild(ask);stage.appendChild(card);
    ask.addEventListener("click",function(){card.classList.contains("show")?closeAsk():openAsk();});
    card.addEventListener("click",function(e){
      if(e.target.closest("[data-pg=close]"))closeAsk();
      else if(e.target.closest("[data-pg=lab]")){var id=card.dataset.station;closeAsk();try{window.__GEI_STEM_ACADEMY_V1__.open(id);}catch(err){}}
    });
    $(PID).addEventListener("keydown",function(e){if(e.key==="Escape"&&card.classList.contains("show")){e.preventDefault();e.stopPropagation();closeAsk();}},true);
    document.addEventListener("pointerdown",function(e){if(card&&card.classList.contains("show")&&!card.contains(e.target)&&!ask.contains(e.target))closeAsk();},true);
    window.addEventListener("gei:wilbert-speaking",function(e){if(ask)ask.classList.toggle("talk",!!e.detail);});
  }
  function expert(stId){var st=G.stations&&G.stations[stId];return st&&st.ask?st.ask:{q:"What am I looking at?",a:"This is the DAM Map! Follow the water from the mountain to the ocean."};}
  function openAsk(stId){
    if(!card)return;stId=stId||stationId();var d=current(),w=wilbert(),x=expert(stId);
    card.dataset.station=stId;
    card.innerHTML='<div class="pgRow">'+face({emoji:d.emoji,image:d.image})+'<div class="pgSay"><small>'+esc((d.name||"YOUR GUIDE").toUpperCase())+'</small>'+esc(x.q)+'</div></div>'+
      '<div class="pgRow wil">'+face(w)+'<div class="pgSay"><small>WILBERT · EXPERT</small>'+esc(x.a)+'</div></div>'+
      '<div class="pgBtns"><button type="button" class="go" data-pg="lab">📖 OPEN THE LAB</button><button type="button" data-pg="close">✕ CLOSE</button></div>';
    card.classList.add("show");ask.setAttribute("aria-expanded","true");
    clearTimeout(cardT);cardT=setTimeout(closeAsk,16000);                // never a persistent obstruction
  }
  function closeAsk(){if(card){card.classList.remove("show");}if(ask)ask.setAttribute("aria-expanded","false");clearTimeout(cardT);}

  /* ---------- 5. journey introduction + first-time moments ---------- */
  var skip=null,introT=[],introOn=false;
  function endIntro(){
    introOn=false;introT.forEach(clearTimeout);introT=[];if(skip)skip.hidden=true;
    var sp=sprite();if(sp)sp.classList.remove("pgIntro");
    var f0=$("dmwFlow0");if(f0&&f0.__pgTmp){f0.classList.remove("on");f0.__pgTmp=0;}
  }
  function intro(force){
    var d=current(),m=mem();if(!isOpen())return false;
    if(!force&&m.intro[d.id])return false;
    remember("intro",d.id);introOn=true;styles();
    var page=$(PID),sp=sprite();
    if(!skip||!skip.isConnected){skip=document.createElement("button");skip.type="button";skip.className="pgSkip";skip.textContent="SKIP ▸";skip.setAttribute("aria-label","Skip the introduction");
      var stage=page.querySelector(".dmwStage");(stage||page).appendChild(skip);skip.addEventListener("click",endIntro);}
    skip.hidden=false;
    if(sp&&!reduced()){sp.classList.remove("pgIntro");void sp.offsetWidth;sp.classList.add("pgIntro");}
    function at(ms,fn){introT.push(setTimeout(function(){if(introOn&&isOpen())fn();},reduced()?ms*.4:ms));}
    at(350,function(){say(line("ready"),{force:true,big:true,ms:1900});});
    at(2000,function(){                                              // 🏔️ lights up, the water starts to move
      var p0=document.querySelector('#geiMapRegions .dmwPill[data-i="0"]');if(p0){p0.classList.remove("geiTeach");void p0.offsetWidth;p0.classList.add("geiTeach");}
      var f0=$("dmwFlow0");if(f0&&!f0.classList.contains("on")){f0.classList.add("on");f0.__pgTmp=1;}
      emote("lookup");say(line("mountain.waterStarted"),{force:true,ms:1700});});
    at(3700,function(){say(line("letsGo"),{force:true,big:true,ms:1500});emote("cheer");});
    at(5000,endIntro);
    page.addEventListener("pointerdown",function once(e){if(e.target.closest&&e.target.closest(".dmwPill"))endIntro();page.removeEventListener("pointerdown",once,true);},true);
    return true;
  }
  /* first-time journey moments (remembered; they celebrate, the STEM system still does the explaining) */
  var MOMENTS={
    "station:mountain":"mountain.firstVisit","station:dam":"dam.firstVisit",
    "lab:reservoir.rising":"reservoir.firstExperiment","lab:reservoir.falling":"reservoir.firstExperiment","lab:reservoir.stable":"reservoir.firstExperiment",
    "lab:sluice.opening":"sluice.firstOperation","lab:sluice.highFlow":"sluice.firstOperation","lab:sluice.controlled":"sluice.firstOperation",
    "lab:wheel.spinning":"wheel.firstTurbine","lab:wheel.fast":"wheel.firstTurbine","lab:wheel.power":"wheel.firstPower","lab:wheel.townLit":"wheel.firstPower",
    "lab:ocean.healthy":"ocean.firstArrival","lab:ocean.arrival":"ocean.firstArrival"
  };
  function moment(trigger){
    var k=MOMENTS[trigger];if(!k)return null;var m=mem();if(m.moments[k])return null;
    remember("moments",k);return k;                                  // returns the line key for the caller to display ONCE
  }

  /* ---------- wiring ---------- */
  function onOpen(){
    var d=applyArt();mountAsk();watchPin();closeAsk();
    var m=mem();
    if(!m.intro[d.id])setTimeout(function(){if(isOpen())intro(false);},700);
    else setTimeout(function(){if(isOpen())react("hub","",{ms:1800});},900);                // returning players: one quiet greeting, no intro
  }
  function bind(){
    var p=$(PID);if(!p||p.__pgBound)return !!p;p.__pgBound=1;styles();
    var was=isOpen();
    new MutationObserver(function(){var o=isOpen();if(o&&!was)onOpen();if(!o&&was){endIntro();closeAsk();if(bubble)bubble.classList.remove("show");}was=o;}).observe(p,{attributes:true,attributeFilter:["class"]});
    mountAsk();watchPin();applyArt();if(was)onOpen();return true;
  }
  var tries=0;(function wait(){if(bind()||++tries>80)return;setTimeout(wait,150);})();
  document.addEventListener("visibilitychange",function(){if(!document.hidden)applyArt();});

  window.__GEI_PERSONAL_GUIDE__={version:VERSION,current:current,wilbert:wilbert,line:line,register:register,react:react,say:say,refresh:refresh,intro:intro,
    mapArt:function(){return current().image;},moment:moment,openAsk:openAsk,closeAsk:closeAsk,expert:expert,library:{base:BASE,style:STYLE},emote:emote,
    selfTest:function(){var d=current();return {version:VERSION,active:d.id,unlocked:d.unlocked,style:d.style,hasLines:Object.keys(BASE).length,readOnly:true,singleSourceOfTruth:"state.activeCharacter"};}};
})();
