/* V2.2.1 — FOLLOW THE WATER 🌊👁️
 * The DAM itself becomes the teacher. One animated cutaway of the whole system (mountain → dam → reservoir →
 * gate → turbine → generator → downstream) that the child can SEE INSIDE, tap, tour, predict against and
 * deliberately "break" — safely.
 *
 *   👁️ SEE INSIDE         header button in every lab (and the hub's 🌊 FOLLOW THE WATER card) opens this view
 *   🌊 FOLLOW THE WATER    a 💧 leads a guided tour; Wilbert points, the system reacts, almost no text
 *   🧩 WHAT DOES THIS DO?  tap any part; its name grows from plain ("WATER GATE") to engineering ("SLUICE GATE")
 *   🔬 ENGINEER VIEW        optional readouts: gate %, level, RPM, power, downstream health
 *   🧪 EXPERIMENT           gate + rain controls; every change plays a cause-and-effect trail and a one-line result
 *   🎯 PREDICT              "what do you think will happen?" → try it → result. Never "wrong", only "GOOD TRY!"
 *   ✨ I UNDERSTAND IT      four understanding moments (flow, storage, energy, downstream) → SYSTEMS THINKER
 *   ▶ finale                zoom out over the whole running system, then ENGINEERING MODE
 *
 * The cutaway is revealed gradually by the DAM Map's own progression (parts you haven't reached are "?").
 * Presentation + understanding only: it reads the map progression and the engineering-world flags, writes one
 * small key (localStorage "geiWaterSystem.v1": which parts were seen / understood) and never touches game state,
 * FL OZ, game XP, STEM XP, purchases or entitlements. Insights award recognition, not currency.
 */
(function(){
  "use strict";
  var G=window.GEI_STEM;
  if(!G||!G.views||window.__GEI_FOLLOW_THE_WATER__)return;
  var VERSION="V2.2.1",WKEY="geiWaterSystem.v1",PKEY="geiEngineerView.v1",NS="http://www.w3.org/2000/svg";

  /* ---------- the parts (data-driven: add a part here and in the SVG) ---------- */
  var COMP=[
    {id:"mountain",station:"mountain",x:45,y:48,icon:"🏔️",plain:"MOUNTAIN",tech:"WATERSHED",desc:"Rain and snow collect here, then flow downhill.",verb:0,unlock:null},
    {id:"dam",station:"dam",x:162,y:108,icon:"🧱",plain:"DAM WALL",tech:"DAM",desc:"Holds back and manages the water.",verb:1,unlock:null},
    {id:"reservoir",station:"reservoir",x:84,y:132,icon:"🌊",plain:"WATER STORAGE",tech:"RESERVOIR",desc:"Stores water behind the dam.",verb:1,unlock:["reservoir","discover"]},
    {id:"gate",station:"sluice",x:162,y:172,icon:"🚪",plain:"WATER GATE",tech:"SLUICE GATE",desc:"Controls how much water passes through.",verb:2,unlock:["sluice","discover"]},
    {id:"turbine",station:"wheel",x:225,y:166,icon:"⚙️",plain:"SPINNING WHEEL",tech:"TURBINE",desc:"Spins when moving water passes through.",verb:3,unlock:["wheel","discover"]},
    {id:"generator",station:"wheel",x:275,y:140,icon:"⚡",plain:"POWER MAKER",tech:"GENERATOR",desc:"Turns spinning motion into electricity.",verb:3,unlock:["wheel","challenge"]},
    {id:"downstream",station:"ocean",x:246,y:216,icon:"🌎",plain:"DOWNSTREAM",tech:"DOWNSTREAM RIVER",desc:"Water keeps going — fish, plants and people need it.",verb:5,unlock:null}
  ];
  function comp(id){return COMP.filter(function(c){return c.id===id;})[0];}
  var VERBS=[["🏔️","COLLECT"],["🌊","STORE"],["🚪","CONTROL"],["⚙️","USE"],["💦","RELEASE"],["🌎","PROTECT"]];

  /* "I UNDERSTAND IT" predictions: setup → question → change → result. opts[i]=[icon,text,right?] */
  var PRED=[
    {key:"flow",need:"gate",setup:{gate:25,rain:1},q:"The gate is 25% open. If you move it to 75%, what happens?",
      opts:[["💧","Less water flows",0],["💦","More water flows",1],["🧱","The dam disappears",0]],apply:{gate:75},why:"sluice.more",title:"💧 WATER FLOW MASTERED"},
    {key:"storage",need:"reservoir",setup:{gate:25,rain:1},q:"Heavy rain starts and the gate stays the same. What happens to the reservoir?",
      opts:[["📉","The water level falls",0],["📈","The water level rises",1],["🏔️","It turns into a mountain",0]],apply:{rain:3},why:"reservoir.rise",title:"🌊 WATER STORAGE MASTERED"},
    {key:"energy",need:"turbine",setup:{gate:25,rain:1},q:"The gate opens all the way. What happens to the wheel?",
      opts:[["🐢","It spins slower",0],["🛑","It stops",0],["🚀","It spins faster",1]],apply:{gate:100},why:"wheel.faster",title:"⚡ ENERGY MASTERED"},
    {key:"downstream",need:"downstream",setup:{gate:50,rain:1},q:"The gate closes completely. What happens to the fish downstream?",
      opts:[["🐟","They struggle",1],["🎉","They throw a party",0],["🐋","They grow bigger",0]],apply:{gate:0},why:"ocean.low",title:"🌎 STEWARDSHIP MASTERED"}
  ];
  var GATES=[0,25,50,75,100],RAINS=[["☀️","NONE"],["🌦️","LOW"],["🌧️","MEDIUM"],["⛈️","HIGH"]];

  function $(id){return document.getElementById(id);}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}

  /* ---------- persistence: which parts the child has met / understood (flags only) ---------- */
  function loadWS(){
    var s={seen:{},words:{},insights:{},tour:0,moved:0};
    try{var j=JSON.parse(localStorage.getItem(WKEY)||"null");
      if(j&&typeof j==="object"){["seen","words","insights"].forEach(function(k){if(j[k]&&typeof j[k]==="object")Object.keys(j[k]).forEach(function(x){if(j[k][x]===1)s[k][x]=1;});});s.tour=j.tour?1:0;s.moved=j.moved?1:0;}}catch(e){}
    return s;
  }
  function saveWS(s){try{localStorage.setItem(WKEY,JSON.stringify(s));}catch(e){}}
  function engOn(){try{return localStorage.getItem(PKEY)==="on";}catch(e){return false;}}
  function setEng(on){try{localStorage.setItem(PKEY,on?"on":"off");}catch(e){}}

  /* ---------- styles ---------- */
  function styles(){
    if($("ftwStyles"))return;
    var s=document.createElement("style");s.id="ftwStyles";
    s.textContent=[
      ".ftwTop{margin:0 0 8px}",
      ".ftwMission{display:flex;gap:4px;margin:0 0 6px}.ftwMission span{flex:1;min-width:0;padding:4px 0;text-align:center;border-radius:10px;border:1px dashed rgba(255,255,255,.28);font-weight:900;font-size:8px;line-height:1.15;letter-spacing:0;opacity:.65;overflow:hidden}",
      ".ftwMission span i{display:block;font-style:normal;font-size:15px}.ftwMission span.on{opacity:1;border:1px solid #7ff0ff;background:rgba(47,210,255,.16)}.ftwMission span.on::after{content:\" ✓\"}",
      ".ftwSvg{width:100%;height:auto;display:block;border-radius:14px;border:1px solid rgba(47,210,255,.3);background:#070d20;touch-action:manipulation}",
      ".ftwPart{cursor:pointer;outline:none}.ftwPart:focus-visible .ftwHit{stroke:#ffd66b;stroke-width:3}.ftwHit{fill:transparent;pointer-events:all;stroke:transparent}",
      ".ftwPart.sel .ftwHit{stroke:#ffd66b;stroke-width:2;stroke-dasharray:4 3}",
      ".ftwUnk{opacity:.35;filter:grayscale(1)}.ftwQ{font:900 22px sans-serif;fill:#cfeeff;text-anchor:middle}",
      ".ftwJet{fill:none;stroke:#7fe8ff;stroke-width:5;stroke-linecap:round;stroke-dasharray:8 7;opacity:0;animation:ftwDash 1s linear infinite}@keyframes ftwDash{to{stroke-dashoffset:-30}}",
      ".ftwRiv{fill:none;stroke:#2fa8ff;stroke-width:6;stroke-linecap:round;stroke-dasharray:10 8;opacity:.6;animation:ftwDash 1.6s linear infinite}",
      ".ftwWheel{transform-box:fill-box;transform-origin:center}.ftwWheel.go{animation:ftwSpin 3s linear infinite}@keyframes ftwSpin{to{transform:rotate(360deg)}}",
      ".ftwRain line{stroke:#9fe8ff;stroke-width:2;stroke-linecap:round;opacity:0;animation:ftwRainF .7s linear infinite}.ftwRain.r1 line:nth-child(1),.ftwRain.r2 line:nth-child(-n+2),.ftwRain.r3 line{opacity:.9}@keyframes ftwRainF{from{transform:translateY(-6px)}to{transform:translateY(8px)}}",
      ".ftwRain.r2 line,.ftwRain.r3 line{animation-duration:.55s}",
      ".ftwHome .b{opacity:.2}.ftwHome.lit .b{opacity:1;filter:drop-shadow(0 0 4px #ffd66b)}.ftwHome text:last-child{opacity:.55}.ftwHome.lit text:last-child{opacity:1}",
      ".ftwRing{fill:none;stroke:#ffd66b;stroke-width:3;animation:ftwPulse 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes ftwPulse{50%{transform:scale(1.25);opacity:.6}}",
      ".ftwMove{transition:transform .9s ease-in-out}",
      ".ftwEng{opacity:0;pointer-events:none;transition:opacity .25s}.ftwEng.on{opacity:1}.ftwEng text{font:900 9px sans-serif;fill:#fff;paint-order:stroke;stroke:#050a18;stroke-width:3px;stroke-linejoin:round}",
      ".ftwLvlTxt{font:900 9px sans-serif;fill:#fff}",
      ".ftwCard{min-height:92px;margin:8px 0;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);font-size:16px;line-height:1.35}",
      ".ftwCard h4{margin:0 0 4px;font-size:17px;letter-spacing:.04em}.ftwCard p{margin:0}.ftwCard small{display:block;margin-top:4px;font-size:12px;letter-spacing:.1em;font-weight:900;color:#7ff0ff}",
      ".ftwCard .ftwNew{display:inline-block;margin-top:4px;padding:2px 8px;border-radius:999px;background:linear-gradient(90deg,#2fd2ff,#f310ba);font-size:12px;font-weight:900}",
      ".ftwTrail{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 4px}.ftwTrail span{padding:5px 8px;border-radius:10px;border:1px dashed rgba(255,255,255,.3);font-weight:900;font-size:11.5px;line-height:1.1;opacity:.5;transition:opacity .2s}.ftwTrail span.on{opacity:1;border:1px solid #ffd66b;background:rgba(255,214,107,.16)}.ftwTrail em{align-self:center;font-style:normal;opacity:.6}",
      ".ftwOpt{display:flex;align-items:center;gap:10px;width:100%;min-height:56px;margin:6px 0 0;padding:8px 12px;border-radius:14px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.07);color:#fff;font-weight:800;font-size:16px;line-height:1.2;text-align:left;cursor:pointer}",
      ".ftwOpt i{flex:0 0 auto;font-style:normal;font-size:24px}.ftwOpt.right{border-color:#8dffb0;background:rgba(141,255,176,.18)}.ftwOpt.try{opacity:.55}.ftwOpt:focus-visible{outline:3px solid #ffd66b;outline-offset:2px}",
      ".ftwWin{margin:6px 0;padding:10px;text-align:center;border-radius:14px;border:2px solid #ffd66b;background:rgba(255,214,107,.14);font-weight:900;letter-spacing:.05em;animation:ftwPop .5s ease}@keyframes ftwPop{from{transform:scale(.8);opacity:0}}",
      ".ftwRead{display:none;grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0}.ftwRead.on{display:grid}.ftwRead div{padding:6px 4px;border-radius:10px;background:rgba(255,255,255,.06);text-align:center;font-weight:900;font-size:10px;line-height:1.2;letter-spacing:.04em}.ftwRead b{display:block;font-size:15px;color:#7ff0ff}",
      ".ftwAct{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0}",
      ".ftwAct .stmBtn{font-size:20px}.ftwAct .stmBtn b{font-size:11.5px}",
      ".ftwFinaleLine{margin:8px 0;text-align:center;font-size:clamp(18px,5vw,22px);font-weight:900;min-height:1.3em}",
      ".ftwUnder{margin:4px 0;font-size:12px;font-weight:900;letter-spacing:.1em;color:#ffd66b}",
      "@media(min-height:700px){.ftwTop{position:sticky;top:-12px;z-index:3;margin:-12px -12px 8px;padding:8px 12px 6px;background:linear-gradient(#050a18 85%,rgba(5,10,24,0))}.ftwSvg{max-height:40vh}}",
      "@media(prefers-reduced-motion:reduce){.ftwSvg *{animation:none!important;transition:none!important}.ftwJet{stroke-dasharray:none}}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- the cutaway ---------- */
  function houses(){var h="";for(var i=0;i<5;i++)h+='<g class="ftwHome" data-h="'+i+'" transform="translate('+(236+i*17)+' 72)"><text class="b" y="-12" font-size="11" text-anchor="middle"><tspan>💡</tspan></text><text y="0" font-size="15" text-anchor="middle">🏠</text></g>';return h;}
  function svg(){
    var sp="";for(var i=0;i<8;i++){var a=i*Math.PI/4;sp+='<line x1="0" y1="0" x2="'+(Math.cos(a)*19).toFixed(1)+'" y2="'+(Math.sin(a)*19).toFixed(1)+'" stroke="#8a5a2e" stroke-width="3"/>';}
    var pads="";for(var j=0;j<10;j++)pads+='<rect x="-3" y="-27" width="6" height="9" rx="1.5" fill="#c9922e" transform="rotate('+(j*36)+')"/>';
    function part(c,inner,extra){return '<g class="ftwPart" data-comp="'+c.id+'" role="button" tabindex="0" aria-label="'+c.plain+'">'+inner+'<rect class="ftwHit" x="'+(c.x-26)+'" y="'+(c.y-26)+'" width="52" height="52" rx="10"/></g>';}
    var m=comp("mountain"),d=comp("dam"),r=comp("reservoir"),g=comp("gate"),t=comp("turbine"),n=comp("generator"),o=comp("downstream");
    return '<svg class="ftwSvg" id="ftwSvg" viewBox="0 0 320 240" role="group" aria-label="Cutaway of the whole water system. Tap a part to learn what it does.">'+
      '<defs><linearGradient id="ftwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14224a"/><stop offset="1" stop-color="#0a1230"/></linearGradient>'+
      '<linearGradient id="ftwWat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fe6ff"/><stop offset="1" stop-color="#1257d8"/></linearGradient>'+
      '<linearGradient id="ftwMt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e88bb"/><stop offset="1" stop-color="#3a3460"/></linearGradient></defs>'+
      '<rect width="320" height="240" fill="url(#ftwSky)"/>'+
      /* ground + bed */
      '<rect x="0" y="190" width="150" height="50" fill="#2b1f14"/><rect x="0" y="170" width="12" height="20" fill="#2b1f14"/><rect x="150" y="190" width="170" height="14" fill="#2b1f14"/>'+
      /* 🏔️ mountain zone */
      part(m,'<polygon points="4,82 45,14 90,82" fill="url(#ftwMt)"/><polygon points="33,36 45,14 57,36 51,32 45,40 39,32" fill="#f2fbff"/>'+
        '<text x="76" y="80" font-size="14">🌲</text><text x="12" y="80" font-size="12">🌲</text><text id="ftwCloud" x="28" y="22" font-size="20" opacity=".5">☁️</text>'+
        '<g class="ftwRain r1" id="ftwRain"><line x1="26" y1="34" x2="26" y2="40"/><line x1="36" y1="36" x2="36" y2="42"/><line x1="46" y1="34" x2="46" y2="40"/></g>')+
      '<path id="ftwStream" d="M54 74 C60 96 48 108 62 128" fill="none" stroke="#5fe6ff" stroke-width="4" stroke-linecap="round" opacity=".8"/>'+
      /* 🌊 reservoir + 🧱 dam (see-through) */
      '<rect id="ftwRes" x="12" y="170" width="138" height="0" fill="url(#ftwWat)" opacity=".92"/>'+
      '<rect x="12" y="92" width="138" height="78" fill="none" stroke="rgba(159,232,255,.35)" stroke-dasharray="3 4"/>'+
      part(r,'<text x="84" y="186" font-size="12" text-anchor="middle" fill="#fff" opacity="0">.</text>')+
      part(d,'<rect x="150" y="82" width="26" height="108" fill="rgba(160,170,190,.28)" stroke="#d6deee" stroke-width="2"/><text x="163" y="112" font-size="16" text-anchor="middle">🧱</text>'+
        '<rect x="150" y="160" width="26" height="24" fill="#0b1226" stroke="#d6deee" stroke-width="1.5"/>')+
      /* 🚪 gate inside the dam wall */
      part(g,'<rect id="ftwGate" x="157" y="160" width="12" height="24" rx="2" fill="#d9a93a" stroke="#fff" stroke-width="1.5"/><text x="163" y="199" font-size="12" text-anchor="middle">🚪</text>')+
      /* water paths */
      '<path class="ftwJet" id="ftwJet1" d="M176 172 L206 168"/><path class="ftwJet" id="ftwJet2" d="M234 182 C242 196 240 204 252 211"/>'+
      '<rect id="ftwRiverBed" x="190" y="204" width="130" height="30" fill="#0f3a8a" opacity=".55"/><path class="ftwRiv" id="ftwRiv" d="M200 215 L316 215"/>'+
      /* ⚙️ turbine */
      part(t,'<circle cx="225" cy="166" r="27" fill="rgba(255,255,255,.05)" stroke="rgba(201,146,46,.6)"/><g transform="translate(225 166)"><g class="ftwWheel" id="ftwWheel"><circle r="21" fill="none" stroke="#7a4b25" stroke-width="4"/>'+sp+pads+'<circle r="5" fill="#3a2a1a" stroke="#c9922e" stroke-width="2"/></g></g>')+
      /* ⚡ generator + town */
      '<line x1="247" y1="160" x2="262" y2="146" stroke="#c9922e" stroke-width="3"/><path id="ftwWire" d="M276 128 L276 88" stroke="#ffd66b" stroke-width="2" stroke-dasharray="3 3" fill="none" opacity=".25"/>'+
      part(n,'<rect x="262" y="128" width="28" height="24" rx="4" fill="#1b2a52" stroke="#7ff0ff" stroke-width="2"/><text x="276" y="146" font-size="16" text-anchor="middle">⚡</text>')+houses()+
      /* 🌎 downstream */
      part(o,'<text id="ftwFish" x="214" y="226" font-size="14">🐟</text><text id="ftwDuck" x="282" y="224" font-size="13">🦆</text><text id="ftwPlant" x="300" y="206" font-size="13">🌱</text><text id="ftwPlant2" x="196" y="206" font-size="13">🌾</text><text id="ftwWarn" x="246" y="208" font-size="14" text-anchor="middle" opacity="0">⚠️</text>')+
      /* unknown overlays (gradual reveal) */
      '<g id="ftwUnk"></g>'+
      /* 🔬 engineer view readouts */
      '<g class="ftwEng" id="ftwEng" aria-hidden="true"><text id="ftwEL" x="84" y="108" text-anchor="middle"></text><text id="ftwEG" x="163" y="150" text-anchor="middle"></text><text id="ftwET" x="225" y="204" text-anchor="middle"></text><text id="ftwEP" x="276" y="162" text-anchor="middle"></text><text id="ftwED" x="246" y="236" text-anchor="middle"></text><text x="196" y="156" font-size="12">➡️</text><text x="236" y="198" font-size="12">↘️</text></g>'+
      /* Wilbert's pointer + the leading drop */
      '<g id="ftwPtr" class="ftwMove" style="transform:translate(45px,48px);opacity:0"><circle class="ftwRing" r="24"/><text y="-30" font-size="18" text-anchor="middle">🦫</text></g>'+
      '<text id="ftwLead" class="ftwMove" style="transform:translate(45px,60px);opacity:0" font-size="20" text-anchor="middle">💧</text>'+
    '</svg>';
  }

  /* ---------- the view ---------- */
  var live=null;     // the running view (for tests / API)
  G.views.system=function(body,ctx,env,opts){
    styles();
    var ws=loadWS(),S={gate:25,rain:1,level:50,flow:0,rpm:0,power:0,health:"ok"},eng=engOn(),selId=null,tour=null,pred=null,noticeT=0,lastNotice=0,predIdx=0;
    var finale=!!opts.finale,all=function(){return finale||env.master();};
    function revealed(c){return all()||c.id==="mountain"||env.unlocked(c.station);}
    function techOn(c){return !!(c.unlock&&env.flag(c.unlock[0],c.unlock[1]))||all();}
    function name(c){return techOn(c)?c.tech:c.plain;}

    /* model: gate + rain + level → flow, rpm, power, downstream health */
    function derive(){
      var head=.5+S.level/200;S.release=(S.gate/100)*20*head;S.flow=Math.round(S.release/20*100);
      S.power=Math.round(S.flow*head);S.rpm=Math.round(S.power*30);
      S.health=S.flow<10?"dry":S.flow>80?"flood":"ok";S.lit=clamp(Math.floor(S.power/20),0,5);
    }
    function tick(){S.level=clamp(S.level+S.rain*5-S.release,0,100);derive();paint();}

    body.innerHTML='<div class="ftwTop"><div class="ftwMission" aria-label="Keep the water moving: collect, store, control, use, release, protect">'+VERBS.map(function(v,i){return '<span data-v="'+i+'"><i aria-hidden="true">'+v[0]+'</i>'+v[1]+'</span>';}).join("")+'</div>'+svg()+'</div>'+
      '<div class="ftwCard" id="ftwCard" role="status" aria-live="polite"></div>'+
      '<div class="ftwRead" id="ftwRead"></div>'+
      '<div class="stmLbl">🚪 GATE OPENING</div><div class="stmRow c5 stmGateRow" id="ftwGates">'+GATES.map(function(g){return '<button type="button" class="stmBtn" data-gate="'+g+'" aria-pressed="false">'+(g===0?"🔒 CLOSED":g===100?"💦 100% OPEN":g+"%")+'</button>';}).join("")+'</div>'+
      '<div class="stmLbl">🌧️ INCOMING WATER</div><div class="stmRow c4" id="ftwRains">'+RAINS.map(function(r,i){return '<button type="button" class="stmBtn" data-rain="'+i+'" aria-pressed="false">'+r[0]+'<small>'+r[1]+'</small></button>';}).join("")+'</div>'+
      '<div class="ftwAct"><button type="button" class="stmBtn" data-act="tour">🌊<b>FOLLOW THE WATER</b></button><button type="button" class="stmBtn" data-act="predict">🎯<b>PREDICT</b></button><button type="button" class="stmBtn" id="ftwEngBtn" data-act="eng" aria-pressed="false">🔬<b>ENGINEER VIEW</b></button></div>'+
      '<div class="ftwUnder" id="ftwUnder" aria-live="polite"></div>';
    var svgEl=$("ftwSvg"),card=$("ftwCard");

    /* ---- painting ---- */
    function setT(id,txt){var e=$(id);if(e)e.textContent=txt;}
    function paint(){
      var rs=$("ftwRes"),h=S.level/100*78;rs.setAttribute("height",h);rs.setAttribute("y",170-h);
      $("ftwGate").setAttribute("y",160-S.gate*.24);
      var f=S.flow;[$("ftwJet1"),$("ftwJet2")].forEach(function(j){j.style.opacity=f>0?clamp(.35+f/120,0,1):0;j.style.animationDuration=(1.3-f/100).toFixed(2)+"s";j.style.strokeWidth=3+f/25;});
      var w=$("ftwWheel");w.classList.toggle("go",S.rpm>0&&!env.reduced());w.style.animationDuration=S.rpm?(6/(1+S.rpm/300)).toFixed(2)+"s":"0s";
      [].forEach.call(svgEl.querySelectorAll(".ftwHome"),function(hm,i){hm.classList.toggle("lit",i<S.lit);});
      $("ftwWire").setAttribute("opacity",S.power>0?1:.25);
      $("ftwRain").setAttribute("class","ftwRain r"+S.rain);$("ftwCloud").setAttribute("opacity",S.rain?1:.45);
      $("ftwFish").textContent=S.health==="ok"?"🐟":"🫧";$("ftwDuck").setAttribute("opacity",S.health==="dry"?.2:1);$("ftwPlant").setAttribute("opacity",S.health==="dry"?.25:1);$("ftwPlant2").setAttribute("opacity",S.health==="dry"?.25:1);
      $("ftwWarn").setAttribute("opacity",S.health==="ok"?0:1);
      var rb=$("ftwRiverBed");rb.setAttribute("y",S.health==="flood"?196:S.health==="dry"?218:204);rb.setAttribute("height",S.health==="flood"?38:S.health==="dry"?16:30);
      $("ftwRiv").style.opacity=S.health==="dry"?.2:.7;
      /* controls */
      [].forEach.call(body.querySelectorAll("[data-gate]"),function(b){var on=+b.dataset.gate===S.gate;b.classList.toggle("sel",on);b.setAttribute("aria-pressed",on);});
      [].forEach.call(body.querySelectorAll("[data-rain]"),function(b){var on=+b.dataset.rain===S.rain;b.classList.toggle("sel",on);b.setAttribute("aria-pressed",on);});
      /* engineer view */
      var hl={ok:"HEALTHY ✅",dry:"TOO DRY ⚠️",flood:"FLOODING ⚠️"}[S.health];
      setT("ftwEL","↕ LEVEL "+Math.round(S.level)+"%");setT("ftwEG","GATE "+S.gate+"%");setT("ftwET","⟳ "+S.rpm+" RPM");setT("ftwEP","⚡ "+S.power+"%");setT("ftwED","🌱 "+hl);
      var rd=$("ftwRead");rd.innerHTML='<div>↕ LEVEL<b>'+Math.round(S.level)+'%</b></div><div>🚪 GATE<b>'+S.gate+'%</b></div><div>💦 FLOW<b>'+S.flow+'%</b></div><div>⚙️ RPM<b>'+S.rpm+'</b></div><div>⚡ POWER<b>'+S.power+'%</b></div><div>🌱 RIVER<b>'+hl.replace(" ✅","").replace(" ⚠️","")+'</b></div>';
      /* mission chips + parts you haven't reached yet */
      var verbOn=[ws.seen.mountain,ws.seen.dam||ws.seen.reservoir,ws.seen.gate,ws.seen.turbine||ws.seen.generator,ws.moved,ws.seen.downstream];
      [].forEach.call(body.querySelectorAll(".ftwMission span"),function(s,i){s.classList.toggle("on",!!verbOn[i]);});
      var ins=PRED.filter(function(p){return ws.insights[p.key];}).length;
      $("ftwUnder").textContent="✨ UNDERSTOOD "+ins+"/"+PRED.length+(ins===PRED.length?" · 🧠 SYSTEMS THINKER":"");
    }
    function reveal(){
      var unk=$("ftwUnk");unk.innerHTML="";
      COMP.forEach(function(c){var g=svgEl.querySelector('[data-comp="'+c.id+'"]');if(!g)return;var ok=revealed(c);g.classList.toggle("ftwUnk",!ok);
        g.setAttribute("aria-label",ok?name(c):"Not discovered yet");
        if(!ok){var t=document.createElementNS(NS,"text");t.setAttribute("class","ftwQ");t.setAttribute("x",c.x);t.setAttribute("y",c.y+8);t.textContent="?";unk.appendChild(t);}});
      var gOk=revealed(comp("gate"));[].forEach.call(body.querySelectorAll("[data-gate]"),function(b){b.disabled=!gOk;});
      var rOk=revealed(comp("mountain"));[].forEach.call(body.querySelectorAll("[data-rain]"),function(b){b.disabled=!rOk;});
    }
    function point(c){
      var p=$("ftwPtr"),l=$("ftwLead");
      if(!c){p.style.opacity=0;l.style.opacity=0;return;}
      if(env.reduced()){p.style.transition="none";l.style.transition="none";}
      p.style.opacity=1;p.style.transform="translate("+c.x+"px,"+c.y+"px)";l.style.opacity=1;l.style.transform="translate("+c.x+"px,"+(c.y+30)+"px)";
    }
    function select(id){selId=id;[].forEach.call(svgEl.querySelectorAll(".ftwPart"),function(g){g.classList.toggle("sel",g.dataset.comp===id);});}
    function markSeen(c){if(!ws.seen[c.id]){ws.seen[c.id]=1;saveWS(ws);paint();}}

    /* ---- 🧩 WHAT DOES THIS DO? ---- */
    function identify(id){
      var c=comp(id);if(!c)return;select(id);ctx.sfx("tap");
      if(!revealed(c)){card.innerHTML='<h4>❓ NOT DISCOVERED YET</h4><p>Keep travelling the DAM Map to find out what this part does!</p>';point(c);env.say("Something is hiding there… keep exploring and we'll find it together!");return;}
      point(c);markSeen(c);
      var nw=techOn(c)&&c.unlock&&!ws.words[c.id];if(nw){ws.words[c.id]=1;saveWS(ws);}
      card.innerHTML='<h4>'+c.icon+' '+env.esc(name(c))+'</h4><p>'+env.esc(c.desc)+'</p>'+(nw?'<span class="ftwNew">✨ NEW WORD: '+env.esc(c.tech)+'</span>':techOn(c)&&c.plain!==c.tech?'<small>ALSO CALLED: '+env.esc(c.plain)+'</small>':"");
      env.say("Look over there! That's the "+name(c).toLowerCase()+".");
    }

    /* ---- 🧪 EXPERIMENT: change → cause-and-effect trail ---- */
    function trailChips(){
      var hl={ok:"HEALTHY",dry:"TOO DRY",flood:"FLOODING"}[S.health];
      return [["gate","🚪 GATE "+S.gate+"%"],["gate","💦 FLOW "+S.flow+"%"],["turbine","⚙️ "+(S.rpm?S.rpm+" RPM":"STOPPED")],["generator","⚡ POWER "+S.power+"%"],["downstream","🌎 "+hl]];
    }
    function sentence(p){
      var s=[];
      if(S.gate>p.gate)s.push("The gate opened wider, so more water flowed.");else if(S.gate<p.gate)s.push(S.gate===0?"The gate closed, so the water was held back.":"The gate opened less, so less water flowed.");
      if(S.rain>p.rain)s.push("More water came in from the rain.");else if(S.rain<p.rain)s.push("Less water came in.");
      if(S.flow>p.flow)s.push("The wheel spun faster and made more power.");else if(S.flow<p.flow)s.push("The wheel slowed down and made less power.");
      if(S.health!=="ok"&&S.health!==p.health)s.push(S.health==="dry"?"Almost no water reached the river downstream.":"A lot of water rushed down the river.");
      else if(S.health==="ok"&&p.health!=="ok")s.push("The river downstream got a healthier flow.");
      return s.join(" ")||"Nothing much changed. Try a bigger change!";
    }
    function trail(prev){
      var chips=trailChips(),h="";chips.forEach(function(c,i){h+=(i?'<em>✨</em>':"")+'<span data-t="'+i+'">'+c[1]+'</span>';});
      card.innerHTML='<h4>💡 WHAT DID YOU NOTICE?</h4><div class="ftwTrail">'+h+'</div><p>'+env.esc(sentence(prev))+'</p>';
      [].forEach.call(card.querySelectorAll("[data-t]"),function(sp,i){
        function on(){sp.classList.add("on");var c=comp(chips[i][0]);point(c);}
        if(env.reduced())on();else ctx.after(on,i*420);
      });
      ctx.after(function(){point(null);},env.reduced()?200:5*420+800);
    }
    function userChange(prev){
      if(!ws.moved){ws.moved=1;saveWS(ws);}markSeen(comp("gate"));paint();
      if(S.gate>=75&&prev.gate<75)env.wilbert("WHOA! You changed the whole system!");
      else if(S.gate===0&&prev.gate>0)env.wilbert("Gate closed. Watch where the water goes!");
      clearTimeout(noticeT);
      noticeT=setTimeout(function(){if(!ctx.alive()||tour||pred)return;lastNotice=Date.now();trail(prev);},650);
      ctx.timers.push(noticeT);
    }
    function setGate(v){var prev={gate:S.gate,rain:S.rain,flow:S.flow,health:S.health};S.gate=v;derive();ctx.sfx("gate");paint();userChange(prev);}
    function setRain(v){var prev={gate:S.gate,rain:S.rain,flow:S.flow,health:S.health};S.rain=v;derive();ctx.sfx("water");paint();userChange(prev);}

    /* ---- 🎯 PREDICT ---- */
    function availablePreds(){return PRED.filter(function(p){return revealed(comp(p.need));});}
    function startPredict(){
      var av=availablePreds();if(!av.length){card.innerHTML='<h4>🎯 PREDICT</h4><p>Reach more of the DAM Map to unlock predictions!</p>';return;}
      var unseen=av.filter(function(p){return !ws.insights[p.key];}),list=unseen.length?unseen:av;
      pred=list[predIdx%list.length];predIdx++;tourStop();
      S.gate=pred.setup.gate;S.rain=pred.setup.rain;S.level=50;derive();paint();point(null);
      var opts=shuffle(pred.opts);
      card.innerHTML='<h4>🎯 WHAT DO YOU THINK WILL HAPPEN?</h4><p>'+env.esc(pred.q)+'</p>'+
        opts.map(function(o,i){return '<button type="button" class="ftwOpt" data-pi="'+i+'"><i aria-hidden="true">'+o[0]+'</i><span>'+"ABC"[i]+' · '+env.esc(o[1])+'</span></button>';}).join("");
      card._opts=opts;env.say("Make a guess — then we'll see what really happens!");
    }
    function answer(i){
      var p=pred,o=card._opts[i],btns=card.querySelectorAll(".ftwOpt");
      [].forEach.call(btns,function(b){b.disabled=true;});btns[i].classList.add(o[2]?"right":"try");ctx.sfx(o[2]?"good":"tap");
      var prev={gate:S.gate,rain:S.rain,flow:S.flow,health:S.health};
      card.insertAdjacentHTML("beforeend",'<p id="ftwPW" style="margin-top:8px;font-weight:900">'+(o[2]?"✅ Let's see if you're right…":"GOOD TRY! LET'S SEE.")+'</p>');
      if(p.apply.gate!=null){S.gate=p.apply.gate;}if(p.apply.rain!=null){S.rain=p.apply.rain;}
      derive();paint();ctx.sfx(p.apply.gate!=null?"gate":"water");point(comp(p.need==="gate"?"gate":p.need==="reservoir"?"reservoir":p.need==="turbine"?"turbine":"downstream"));
      ctx.after(function(){
        var res=sentence(prev),wy=G.why[p.why]||"";
        var html='<h4>'+(o[2]?"✨ YOU UNDERSTOOD THE SYSTEM!":"💙 NOW YOU'VE SEEN IT!")+'</h4><p>'+env.esc(res)+'</p><small>💡 WHY?</small><p>'+env.esc(wy)+'</p>';
        if(o[2]){var first=!ws.insights[p.key];ws.insights[p.key]=1;saveWS(ws);ctx.sfx("wow");html='<div class="ftwWin">'+p.title+'<br>YOU UNDERSTOOD THE SYSTEM!</div>'+html.replace(/^<h4>.*?<\/h4>/,"");
          env.wilbert(first?"Now THAT is real understanding!":"You got it again!");
          if(PRED.every(function(q){return ws.insights[q.key];}))html+='<div class="ftwWin">🧠 SYSTEMS THINKER</div>';}
        else env.wilbert("Every guess teaches us something. Try another!");
        html+='<button type="button" class="stmSecondary" data-act="predict">🎯 NEXT PREDICTION</button>';
        card.innerHTML=html;pred=null;point(null);paint();
      },env.reduced()?300:2400);
    }

    /* ---- 🌊 FOLLOW THE WATER (the tour; also the finale) ---- */
    function tourSteps(){
      return [
        {c:"mountain",set:{rain:2,gate:0},lv:30,txt:"Rain and snow fall. Gravity pulls the water downhill.",say:"Follow the water! It starts way up here."},
        {c:"dam",set:{},txt:"The water stops and collects behind the "+name(comp("dam")).toLowerCase()+". A dam holds water back.",say:"See it stop? That's the dam holding it back."},
        {c:"reservoir",set:{},txt:"The level rises. The water is stored here.",say:"See how the water is collecting?"},
        {c:"gate",set:{gate:75,rain:1},txt:"The gate opens. It controls how much water goes through.",say:"Now the gate opens — whoosh!"},
        {c:"turbine",set:{},txt:"Moving water hits the wheel and spins it.",say:"The moving water makes the wheel turn."},
        {c:"generator",set:{},txt:"Spinning makes electricity. The lights come on!",say:"Motion turns into electricity!"},
        {c:"downstream",set:{},txt:"The water keeps going — fish, plants and people need it.",say:"And the water goes on to help the whole river."}
      ];
    }
    function tourStop(){if(tour){tour.stop=true;tour=null;}}
    function startTour(auto){
      tourStop();pred=null;var steps=tourSteps().filter(function(s){return revealed(comp(s.c));}),all2=tourSteps().length===steps.length;
      var t=tour={i:-1,steps:steps,stop:false,auto:auto,timer:0};
      function done(){
        point(null);ws.tour=1;saveWS(ws);tour=null;
        card.innerHTML='<h4>🌊 THAT\'S THE WHOLE JOURNEY!</h4><p>'+(all2?"The water travelled from the mountain, through the machine, and on downstream.":"More of the machine is waiting on the DAM Map. Keep going to discover it!")+'</p><button type="button" class="stmSecondary" data-act="tour">↻ REPLAY</button><button type="button" class="stmSecondary" data-act="predict">🎯 NOW PREDICT</button>';
        if(opts.onTourEnd)opts.onTourEnd();
      }
      function next(){
        if(t.stop)return;t.i++;if(t.i>=t.steps.length)return done();
        var s=t.steps[t.i],c=comp(s.c);
        if(s.set.gate!=null)S.gate=s.set.gate;if(s.set.rain!=null)S.rain=s.set.rain;if(s.lv!=null)S.level=s.lv;derive();paint();
        select(s.c);markSeen(c);point(c);ctx.sfx(s.c==="gate"?"gate":s.c==="turbine"?"spin":s.c==="generator"?"zap":"water");
        card.innerHTML='<h4>'+c.icon+' '+env.esc(name(c))+'</h4><p>'+env.esc(s.txt)+'</p><small>STEP '+(t.i+1)+' OF '+t.steps.length+'</small><button type="button" class="stmSecondary" data-act="tournext">'+(t.i===t.steps.length-1?"✅ FINISH":"NEXT ▸")+'</button>';
        env.say(s.say);
        clearTimeout(t.timer);
        if(t.auto&&!env.reduced()){t.timer=setTimeout(function(){if(ctx.alive())next();},opts.finale?3300:5200);ctx.timers.push(t.timer);}
      }
      t.next=next;next();
    }

    /* ---- ▶ finale: zoom out over the running system ---- */
    function runFinale(){
      var steps=tourSteps();
      body.querySelector(".ftwAct").style.display="none";
      var from=[0,0,100,75],to=[0,0,320,240];
      function vb(p){svgEl.setAttribute("viewBox",from.map(function(f,i){return (f+(to[i]-f)*p).toFixed(1);}).join(" "));}
      vb(0);S.gate=0;S.rain=2;S.level=30;derive();paint();
      var line=document.createElement("div");line.className="ftwFinaleLine";line.setAttribute("role","status");line.setAttribute("aria-live","polite");card.parentNode.insertBefore(line,card);
      card.innerHTML="<h4>🏔️ BACK TO THE MOUNTAIN…</h4><p>Watch the whole system.</p>";point(comp("mountain"));env.say("Now you know where the water goes.");line.textContent="";
      function after(){
        opts.onTourEnd=function(){
          line.textContent="Now you know where the water goes.";env.say("Now you know where the water goes.",true);
          ctx.after(function(){line.textContent="But do you know what happens if you change the system?";env.say("But do you know what happens if you change the system?",true);},env.reduced()?400:2600);
          ctx.after(function(){line.innerHTML="🚀 ENGINEERING MODE UNLOCKED";ctx.sfx("master");
            body.querySelector(".ftwAct").style.display="";
            env.primary(opts.backLabel||"🚀 OPEN FREE ENGINEERING MODE",function(){(opts.back||env.openAcademy)();});},env.reduced()?800:5400);
        };
        startTour(true);
      }
      if(env.reduced()){vb(1);after();return;}
      var t0=null;(function step(ts){if(!ctx.alive())return;if(t0===null)t0=ts;var p=clamp((ts-t0)/2800,0,1),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;vb(e);if(p<1)requestAnimationFrame(step);else after();})(performance.now());
    }

    /* ---- events ---- */
    body.addEventListener("click",function(e){
      var t=e.target,pc=t.closest&&t.closest("[data-comp]"),g=t.closest&&t.closest("[data-gate]"),r=t.closest&&t.closest("[data-rain]"),a=t.closest&&t.closest("[data-act]"),pi=t.closest&&t.closest("[data-pi]");
      if(pi&&pred&&!pi.disabled)return answer(+pi.dataset.pi);
      if(pc){if(tour){tourStop();point(null);}return identify(pc.dataset.comp);}
      if(g&&!g.disabled){if(tour)tourStop();if(pred)pred=null;return setGate(+g.dataset.gate);}
      if(r&&!r.disabled){if(tour)tourStop();if(pred)pred=null;return setRain(+r.dataset.rain);}
      if(!a)return;
      var act=a.dataset.act;
      if(act==="tour")startTour(true);
      else if(act==="tournext"){if(tour){clearTimeout(tour.timer);tour.next();}}
      else if(act==="predict")startPredict();
      else if(act==="eng"){eng=!eng;setEng(eng);applyEng();ctx.sfx("tap");}
    });
    body.addEventListener("keydown",function(e){var pc=e.target.closest&&e.target.closest("[data-comp]");if(pc&&(e.key==="Enter"||e.key===" ")){e.preventDefault();identify(pc.dataset.comp);}});
    function applyEng(){$("ftwEng").classList.toggle("on",eng);$("ftwRead").classList.toggle("on",eng);var b=$("ftwEngBtn");b.classList.toggle("sel",eng);b.setAttribute("aria-pressed",eng);}

    /* ---- go ---- */
    derive();reveal();applyEng();paint();
    ctx.every(tick,700);
    env.primary(opts.backLabel||"🗺️ BACK TO MAP",function(){(opts.back||env.close)();});
    var firstNew=COMP.filter(function(c){return revealed(c)&&techOn(c)&&c.unlock&&!ws.words[c.id];})[0];
    if(opts.finale){runFinale();}
    else if(opts.focus&&comp(opts.focus)){identify(opts.focus);}
    else{
      card.innerHTML='<h4>👁️ SEE INSIDE</h4><p>Tap a part to find out what it does — or press <b>FOLLOW THE WATER</b>.</p>'+(firstNew?'<span class="ftwNew">✨ NEW WORD: '+env.esc(firstNew.tech)+'</span>':"");
      env.say(ws.tour?"Change the gate and see what happens to everything!":"Where is the water going? Let's follow it!");
    }
    live={state:function(){return JSON.parse(JSON.stringify(S));},ws:function(){return JSON.parse(JSON.stringify(ws));},eng:function(){return eng;},revealed:function(){return COMP.filter(revealed).map(function(c){return c.id;});}};
  };

  window.__GEI_FOLLOW_THE_WATER__={version:VERSION,parts:COMP.length,
    open:function(o){return !!(G.engine&&G.engine.openView&&G.engine.openView("system",o||{}));},
    state:function(){return live&&live.state();},ws:function(){return live&&live.ws();},engineer:function(){return live&&live.eng();},revealed:function(){return live&&live.revealed();},
    understood:function(){return Object.keys(loadWS().insights);}};
})();
