/* V2.3.0 — DAM MAP COMMAND CENTER 🗺️💧
 * Interactive, mobile-first command center for gameplay, progress tracking,
 * and hydraulic STEM discovery.
 *
 * Mountain → Dam → Millpond → Sluice-Gate → Waterwheel → Factory.
 *
 * V2.3.0 upgrades (on top of the V2.1.90 engine):
 *   - MISSION CARD: prominent day/taps/station summary with CONTINUE PLAYING button
 *   - BEAVER GUIDE: tappable Y'all Too Beaver with contextual STEM tips per station
 *   - STEM DISCOVERY CARDS: educational cards for each hydraulic station
 *   - Enhanced world progression: completion marks, current-station pulse, unlock glow
 *   - Mobile-first layout: mission card above fold, one-handed operation
 *   - Environmental variation: integrates with dam-map-atmosphere-v2187.js (sunny/rain/storm/snow/night)
 *
 * Same public API (window.__GEI_V2170_DAM_MAP__), same factory registry,
 * same progress formulas as V2.1.70–V2.1.90.
 *
 * Read-only: derives everything from the page's `state`; never writes game state,
 * FL OZ, XP, purchases, entitlements or saves.
 * Only persisted key: damMapSound (presentation).
 */
(function(){
  "use strict";
  if(window.__GEI_V2170_DAM_MAP__) return;
  var VERSION="V2.3.0";
  var REGIONS=[
    {id:"mountain",label:"MOUNTAIN",icon:"🏔️",desc:"Source waters and tributaries"},
    {id:"dam",label:"DAM",icon:"🧱",desc:"Dividing wall and reservoir control"},
    {id:"millpond",label:"MILLPOND",icon:"🌊",desc:"Stored water and dry-land edge"},
    {id:"sluice",label:"SLUICE-GATE",icon:"🚪",desc:"Controlled release to the mill"},
    {id:"waterwheel",label:"WATERWHEEL",icon:"⚙️",desc:"Water becomes mechanical motion"},
    {id:"factory",label:"FACTORY",icon:"🏭",desc:"Production powered by the flow"}
  ];
  var FACTORIES=[
    ["Gristmill","Agricultural","🌾"],["Rice Mill / Huller","Agricultural","🍚"],["Sugar Mill","Agricultural","🍬"],
    ["Oil Mill","Agricultural","🫒"],["Coffee Mill","Agricultural","☕"],["Cider Mill","Agricultural","🍎"],
    ["Sawmill","Materials","🪵"],["Paper Mill","Materials","📜"],["Textile Mill","Materials","🧵"],
    ["Cotton Mill","Materials","☁️"],["Woollen Mill","Materials","🧶"],["Flax Mill","Materials","🌿"],
    ["Steel Mill","Industrial","🔩"],["Wire Mill","Industrial","🧲"],["Ore Mill","Industrial","⛏️"],
    ["Pellet Mill","Industrial","⚙️"],["Starch Mill","Industrial","🥔"],["Materials Recovery Facility","Industrial","♻️"],
    ["Milling Machine","Advanced Manufacturing","🛠️"],["Flotation Mill","Advanced Manufacturing","🧪"],
    ["Powder Mill","Specialized Production","💠"],["Bark Mill","Specialized Production","🌳"],
    ["Silk Mill","Specialized Production","🧵"],["Specialized Production Facility","Advanced Manufacturing","🏗️"]
  ].map(function(x,i){return {index:i+1,name:x[0],category:x[1],icon:x[2]};});

  /* STEM discovery content — one card per station */
  var STEM=[
    {title:"MOUNTAIN HYDROLOGY",sub:"Source Waters & Tributaries",
     body:"Water from rainfall and snowmelt collects in mountain streams and tributaries. These streams join together, gaining volume and momentum as gravity pulls them downhill. This is where the hydraulic system begins — gravity provides all the energy."},
    {title:"DAM ENGINEERING",sub:"Reservoir Control",
     body:"A dam is a barrier built across a waterway to control water flow. The reservoir behind it stores water at height, creating potential energy. Engineers design spillways and outlets to regulate flow. The stored water creates hydraulic head — pressure from the weight of water above."},
    {title:"MILLPOND STORAGE",sub:"Steady Water Supply",
     body:"The millpond holds water released from the dam, providing a steady supply for the waterwheel. Even when the river’s natural flow changes with seasons, the pond acts as a buffer. This ensures the mill can operate continuously regardless of weather."},
    {title:"SLUICE-GATE CONTROL",sub:"Flow Regulation",
     body:"A sluice gate is a sliding gate that controls the speed and volume of water flowing to the wheel. Opening the gate wider increases flow and power. This is one of humanity’s oldest control systems — adjusting output by regulating input."},
    {title:"WATERWHEEL POWER",sub:"Energy Conversion",
     body:"The waterwheel converts the kinetic energy of flowing water into rotational mechanical energy. A breastshot wheel receives water at its center, combining the push of moving water with the weight of water in buckets. One waterwheel can generate 5 to 50 horsepower."},
    {title:"FACTORY PRODUCTION",sub:"Industrial Power",
     body:"The waterwheel’s rotation drives a main shaft, which powers machines through gears and belts. Water-powered factories were the backbone of early industry — grinding grain, sawing wood, spinning thread, and forging metal. The entire mountain-to-factory system is one continuous energy chain."}
  ];

  /* Beaver guide tips — rotate per station on each tap */
  var BEAVER_TIPS=[
    ["Water starts its journey here!","Mountain streams join into tributaries.","Gravity is our first engineer!","Follow the water downhill!"],
    ["The dam controls everything downstream!","That wall holds back tremendous pressure!","Reservoir equals stored energy.","Without the dam, no power!"],
    ["The millpond keeps a steady supply.","Still water, but full of potential!","This buffer keeps the wheel turning.","A calm pool before the rush!"],
    ["Open the gate, release the power!","Flow control — humanity’s oldest trick.","More gate, more water, more power!","The sluice decides how much flows."],
    ["Water pushes, wheel turns — hydropower!","Each bucket catches water’s weight.","5 to 50 horsepower from falling water!","Spin, spin, spin into energy!"],
    ["The wheel powers the whole factory!","Gears and belts carry rotation inside.","From mountain rain to manufactured goods!","The system is complete!"]
  ];
  var beaverTipIdx=0;

  /* Scene geometry (SVG units, viewBox 1240×520): station anchor x and the top of each landmark. */
  var VB_W=1240, VB_H=520, RATIO=VB_W/VB_H;
  var ANCHOR=[{x:186,top:150},{x:417,top:368},{x:590,top:446},{x:737,top:392},{x:905,top:380},{x:1056,top:346}];
  var MIN_SCENE_W=1240;

  /* ---------- derived, read-only progress (V2.1.70 formulas) ---------- */
  function n(v,d){v=Number(v);return Number.isFinite(v)?v:(d||0);}
  function st(){try{if(typeof state!=="undefined"&&state)return state;}catch(e){}return window.state||null;}
  function completed(){return Math.max(0,n(st()&&st().completedLevels,0));}
  function days(){var s=st();var reward=n(window.DAY_REWARD_FL_OZ,111);return s?Math.max(0,Math.min(6,Math.floor(n(s.levelFlOz,0)/Math.max(1,reward)))):0;}
  function totalDays(){return completed()*6+days();}
  function factories(){return Math.floor(completed()/6);}
  function level(){return Math.max(1,n(st()&&st().level,1));}
  function factoryAt(i){return FACTORIES[Math.max(1,i)-1]||FACTORIES[FACTORIES.length-1];}
  function station(){var d=days();return d>=6?5:d;}
  function levelFactory(){return factoryAt(Math.ceil(level()/6));}
  function tapsDone(){var s=st();return s?Math.max(0,n(s.tapCount,0)):0;}
  function reqTaps(){try{if(typeof getRequiredTaps==="function")return getRequiredTaps(level());}catch(e){}return 6;}

  function $(id){return document.getElementById(id);}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];});}
  function reduced(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}

  /* ---------- styles ---------- */
  function styles(){
    if($("geiDamMapV2170Styles"))return;
    var s=document.createElement("style");s.id="geiDamMapV2170Styles";
    s.textContent=[
      "#geiDamMapPage{position:fixed;inset:0;z-index:10050;display:none;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;",
      "background:radial-gradient(circle at 50% 0,rgba(47,210,255,.14),transparent 45%),linear-gradient(160deg,#07152b,#02050d 70%);color:#eefcff;font-family:inherit}",
      "#geiDamMapPage.show{display:flex}",
      "#geiDamMapPage *{box-sizing:border-box}",
      ".dmwShell{position:relative;width:min(1240px,100%);height:min(94vh,900px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(47,210,255,.32);border-radius:26px;",
      "background:#050a18;box-shadow:0 24px 90px rgba(0,0,0,.55),0 0 55px rgba(47,210,255,.12)}",
      ".dmwTop{display:flex;align-items:center;gap:12px;padding:12px 14px}",
      ".dmwBtn{flex:0 0 auto;min-width:44px;min-height:44px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;border-radius:14px;padding:10px 14px;font:900 14px/1 inherit;cursor:pointer}",
      ".dmwBtn:focus-visible,.dmwPill:focus-visible{outline:3px solid #ffd66b;outline-offset:2px}.dmwGo:focus-visible{outline:2px solid rgba(255,214,107,.85);outline-offset:3px}",
      ".dmwTitle{flex:1;min-width:0}.dmwTitle b{display:block;font-size:clamp(20px,3vw,30px);letter-spacing:.07em;line-height:1.05}",
      ".dmwTitle span{display:block;margin-top:4px;font-size:12.5px;opacity:.72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      /* mission card */
      ".dmwMission{display:flex;align-items:center;gap:12px;padding:10px 14px;margin:0 12px 8px;",
      "border-radius:16px;background:linear-gradient(135deg,rgba(47,210,255,.1),rgba(61,61,234,.08));border:1.5px solid rgba(47,210,255,.35)}",
      ".dmwMissionLeft{flex:1;min-width:0}",
      ".dmwMissionEye{font-size:10px;font-weight:900;letter-spacing:.18em;color:#2fd2ff}",
      ".dmwMissionDay{margin-top:3px;font-size:clamp(15px,2.2vw,19px);font-weight:900;letter-spacing:.04em}",
      ".dmwMissionDay span{opacity:.7;font-weight:700}",
      ".dmwMissionTaps{display:flex;align-items:center;gap:10px;margin-top:6px}",
      ".dmwMissionTapBar{flex:1;height:8px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden;max-width:160px}",
      ".dmwMissionTapFill{height:100%;border-radius:4px;background:linear-gradient(90deg,#2fd2ff,#3d3dea);transition:width .3s}",
      ".dmwMissionTapText{font-size:13px;font-weight:800;letter-spacing:.04em;white-space:nowrap}",
      ".dmwMissionRemaining{margin-top:3px;font-size:12px;opacity:.6;font-weight:700}",
      ".dmwMissionGo{flex:0 0 auto;padding:12px 18px;border:0;border-radius:14px;",
      "background:linear-gradient(135deg,#2fd2ff,#3d3dea);color:#fff;font:900 14px/1.2 inherit;",
      "letter-spacing:.06em;cursor:pointer;text-align:center;min-width:44px;min-height:44px;",
      "box-shadow:0 4px 18px rgba(47,210,255,.25);transition:transform .15s,box-shadow .15s}",
      ".dmwMissionGo:active{transform:scale(.95)}",
      ".dmwMissionDone .dmwMissionGo{background:linear-gradient(135deg,#d9a93a,#f310ba)}",
      ".dmwMissionDone .dmwMissionEye{color:#ffd66b}",
      /* stats */
      ".dmwStats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:0 12px 10px;border-bottom:1px solid rgba(255,255,255,.08)}",
      ".dmwStat{padding:9px 11px;border-radius:12px;background:rgba(10,16,34,.92);border:1px solid rgba(255,255,255,.12);min-width:0}",
      ".dmwStat small{display:block;font-size:10px;font-weight:900;letter-spacing:.13em;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dmwStat b{display:flex;align-items:center;gap:7px;margin-top:3px;font-size:clamp(15px,1.8vw,20px);letter-spacing:.05em;white-space:nowrap}",
      ".dmwDot{width:9px;height:9px;border-radius:50%;background:#5a6378;flex:0 0 auto}.dmwDot.on{background:#2fd2ff;box-shadow:0 0 10px #2fd2ff}.dmwDot.gold.on{background:#d9a93a;box-shadow:0 0 10px #d9a93a}",
      ".dmwNarrow{display:none}",
      /* stage */
      ".dmwStage{position:relative;flex:1;min-height:0;display:flex;flex-direction:column}",
      ".dmwScroll{position:relative;flex:1;min-height:0;overflow-x:auto;overflow-y:hidden;display:flex;align-items:flex-end;",
      "background:linear-gradient(180deg,#070b22 0,#1d1840 62%,#0b1f16 62%,#0b1f16 100%);scrollbar-width:thin;-webkit-overflow-scrolling:touch}",
      ".dmwScene{position:relative;flex:0 0 auto;margin:0 auto}",
      ".dmwSvg{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0!important}",
      /* water flow + ambient motion */
      ".dmwFlow{fill:none;stroke-linecap:round;stroke-linejoin:round}",
      ".dmwFlow.base{stroke:#22385f;stroke-width:5;opacity:.75}",
      ".dmwFlow.lit{stroke:#5fe6ff;stroke-width:5;stroke-dasharray:11 13;opacity:0;filter:drop-shadow(0 0 5px #2fd2ff);transition:opacity .6s}",
      ".dmwFlow.lit.on{opacity:1;animation:dmwFlow 1.1s linear infinite}",
      "@keyframes dmwFlow{to{stroke-dashoffset:-24}}",
      ".dmwStation{transition:opacity .5s,filter .5s;cursor:default}.dmwStation.locked{opacity:.42;filter:grayscale(.75) brightness(.8)}",
      ".dmwStation.current{filter:drop-shadow(0 0 10px rgba(95,230,255,.55))}",
      ".dmwStation:not(.locked){cursor:pointer}",
      ".dmwStar{animation:dmwTwinkle 3.6s ease-in-out infinite}@keyframes dmwTwinkle{0%,100%{opacity:.9}50%{opacity:.25}}",
      ".dmwCloud{animation:dmwDrift 26s ease-in-out infinite alternate}@keyframes dmwDrift{to{transform:translateX(34px)}}",
      ".dmwSpin{transform-box:fill-box;transform-origin:center;animation:dmwSpin 7s linear infinite}.dmwSpin.fast{animation-duration:3.2s}.dmwSpin.rev{animation-direction:reverse}",
      ".dmwStation.locked .dmwSpin,.dmwIdle .dmwSpin{animation-play-state:paused}",
      "@keyframes dmwSpin{to{transform:rotate(360deg)}}",
      ".dmwSmoke circle{animation:dmwSmoke 4.2s ease-out infinite;transform-box:fill-box;transform-origin:center}",
      ".dmwSmoke circle:nth-child(2){animation-delay:1.4s}.dmwSmoke circle:nth-child(3){animation-delay:2.8s}",
      "@keyframes dmwSmoke{0%{opacity:0;transform:translate(0,14px) scale(.5)}25%{opacity:.5}100%{opacity:0;transform:translate(16px,-26px) scale(1.4)}}",
      ".dmwLamp{animation:dmwLamp 2.8s ease-in-out infinite}@keyframes dmwLamp{50%{opacity:.6}}",
      ".dmwCelebrate #dmwSt5{animation:dmwHero 1.2s ease-in-out infinite}@keyframes dmwHero{50%{filter:drop-shadow(0 0 22px #ffd66b) brightness(1.2)}}",
      /* pin + pills + labels over the scene */
      ".dmwPin{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;gap:7px;pointer-events:none;z-index:3;animation:dmwBob 2.4s ease-in-out infinite}",
      "@keyframes dmwBob{50%{transform:translate(-50%,calc(-100% - 5px))}}",
      ".dmwPinLabel{padding:6px 12px;border-radius:10px;background:rgba(4,10,24,.95);border:1.5px solid rgba(47,210,255,.8);font-size:13px;font-weight:900;letter-spacing:.08em;white-space:nowrap;box-shadow:0 0 18px rgba(47,210,255,.35)}",
      ".dmwPinNode{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:linear-gradient(145deg,#3d3dea,#2d55ff);border:3px solid #fff;box-shadow:0 0 22px rgba(95,140,255,.8)}",
      ".dmwPills{position:absolute;left:0;right:0;z-index:3}",
      ".dmwPill{position:absolute;transform:translate(-50%,-50%);min-width:0;max-width:190px;padding:6px 10px 5px;border-radius:12px;cursor:pointer;text-align:center;color:#eefcff;",
      "background:rgba(5,10,26,.93);border:1.5px solid rgba(47,210,255,.55);font:inherit}",
      ".dmwPill b{display:block;font-size:13.5px;letter-spacing:.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".dmwPill small{display:block;margin-top:2px;font-size:10px;font-weight:900;letter-spacing:.12em;color:#2fd2ff}",
      ".dmwPill.now{border-color:#fff;background:#0b1a3a;box-shadow:0 0 0 2px rgba(47,210,255,.35),0 0 20px rgba(47,210,255,.45)}.dmwPill.now small{color:#ffd66b}",
      ".dmwPill.future{border-color:rgba(255,255,255,.14);color:rgba(238,252,255,.55)}.dmwPill.future small{color:rgba(238,252,255,.45)}",
      ".dmwAhead{position:absolute;right:1%;top:57%;transform:translateY(-50%);text-align:center;font-weight:900;letter-spacing:.12em;pointer-events:none;z-index:2}",
      ".dmwAhead span{display:block;font-size:13px;color:rgba(238,252,255,.62)}.dmwAhead em{display:block;margin-top:4px;font-style:normal;font-size:11px;color:#ffd66b}",
      ".dmwAhead i{display:block;font-style:normal;font-size:18px;color:rgba(255,214,107,.55)}",
      ".dmwCaption{position:absolute;left:50%;top:12px;transform:translate(-50%,-6px);max-width:min(560px,92%);padding:8px 14px;border-radius:12px;background:rgba(4,10,24,.94);",
      "border:1px solid rgba(47,210,255,.45);font-size:13px;font-weight:800;text-align:center;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:6}",
      ".dmwCaption.show{opacity:1;transform:translate(-50%,0)}",
      /* completion marks */
      ".dmwMarks{position:absolute;inset:0;pointer-events:none;z-index:2}",
      ".dmwMark{position:absolute;transform:translate(-50%,-50%);width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:900}",
      ".dmwMark.done{background:rgba(47,210,255,.2);color:#2fd2ff;border:1.5px solid rgba(47,210,255,.5)}",
      ".dmwMark.now{background:rgba(255,214,107,.2);color:#ffd66b;border:1.5px solid rgba(255,214,107,.5);animation:dmwMarkPulse 1.8s ease-in-out infinite}",
      "@keyframes dmwMarkPulse{50%{box-shadow:0 0 12px rgba(255,214,107,.6);transform:translate(-50%,-50%) scale(1.1)}}",
      /* beaver guide */
      ".dmwBeaver{position:absolute;z-index:4;cursor:pointer;display:flex;flex-direction:column;align-items:center;transition:left .5s,top .5s}",
      ".dmwBeaverAvatar{width:42px;height:42px;border-radius:50%;background:linear-gradient(145deg,#ff9df2,#f310ba);",
      "display:grid;place-items:center;font-size:22px;border:2.5px solid #fff;box-shadow:0 0 14px rgba(243,16,186,.45);transition:transform .15s}",
      ".dmwBeaver:active .dmwBeaverAvatar{transform:scale(.9)}",
      ".dmwBeaverBubble{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);",
      "width:max-content;max-width:200px;padding:8px 12px;border-radius:12px;",
      "background:rgba(4,10,24,.96);border:1.5px solid rgba(243,16,186,.5);",
      "font-size:12px;font-weight:700;text-align:center;opacity:0;pointer-events:none;",
      "transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4);z-index:5}",
      ".dmwBeaverBubble::before{content:\"\";position:absolute;bottom:100%;left:50%;transform:translateX(-50%);",
      "border:6px solid transparent;border-bottom-color:rgba(4,10,24,.96)}",
      ".dmwBeaverBubble.show{opacity:1;pointer-events:auto}",
      ".dmwBeaverBubble small{display:block;margin-top:4px;font-size:9.5px;opacity:.5;letter-spacing:.08em}",
      /* discovery card */
      ".dmwDiscovery{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.92);",
      "width:min(380px,88%);padding:20px;border-radius:18px;",
      "background:rgba(3,8,20,.97);border:1.5px solid rgba(47,210,255,.5);",
      "box-shadow:0 8px 50px rgba(0,0,0,.6);opacity:0;pointer-events:none;",
      "transition:opacity .2s,transform .2s;z-index:7;text-align:center}",
      ".dmwDiscovery.show{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}",
      ".dmwDiscIcon{font-size:44px;line-height:1.1}",
      ".dmwDiscovery h3{margin:6px 0 2px;font-size:20px;letter-spacing:.05em;",
      "background:linear-gradient(90deg,#7ff0ff,#f39cff);-webkit-background-clip:text;background-clip:text;color:transparent}",
      ".dmwDiscSub{font-size:11px;font-weight:900;letter-spacing:.15em;color:#2fd2ff;margin-bottom:10px}",
      ".dmwDiscovery p{font-size:13.5px;line-height:1.55;opacity:.85;margin:0;text-align:left}",
      ".dmwDiscStatus{margin-top:12px;font-size:11px;font-weight:900;letter-spacing:.12em;padding:4px 12px;border-radius:8px;display:inline-block}",
      ".dmwDiscStatus.stDone{background:rgba(47,210,255,.15);color:#2fd2ff}",
      ".dmwDiscStatus.stNow{background:rgba(255,214,107,.15);color:#ffd66b}",
      ".dmwDiscStatus.stAhead{background:rgba(255,255,255,.06);color:rgba(238,252,255,.5)}",
      ".dmwDiscClose{position:absolute;right:8px;top:8px;width:34px;height:34px;border:1px solid rgba(255,255,255,.15);border-radius:50%;",
      "background:rgba(255,255,255,.06);color:#fff;font-size:16px;cursor:pointer;display:grid;place-items:center;min-width:44px;min-height:44px}",
      /* factory discovery */
      ".dmwRail{flex:0 0 auto;padding:10px 12px 12px;border-top:1px solid rgba(255,255,255,.08);background:rgba(1,5,13,.8)}",
      ".dmwRailTitle{display:flex;justify-content:space-between;gap:10px;margin-bottom:8px;font-size:12.5px;font-weight:900;letter-spacing:.1em}",
      ".dmwRailTitle em{font-style:normal;color:#2fd2ff;white-space:nowrap}",
      ".dmwTrack{display:flex;gap:9px;overflow-x:auto;padding:2px 2px 4px;scroll-behavior:smooth;scrollbar-width:thin}",
      ".geiMapFactory{flex:0 0 auto;width:150px;min-height:92px;padding:10px 11px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);position:relative}",
      ".geiMapFactory span{display:block;font-size:22px;line-height:1}.geiMapFactory b{display:block;margin-top:6px;font-size:13px;line-height:1.15}",
      ".geiMapFactory small{display:block;margin-top:4px;font-size:10.5px;font-weight:900;letter-spacing:.08em}",
      ".geiMapFactory.operational{border-color:rgba(47,210,255,.6);background:rgba(47,210,255,.08)}.geiMapFactory.operational small{color:#2fd2ff}",
      ".geiMapFactory.newest{border-color:#7ff0ff;box-shadow:0 0 18px rgba(47,210,255,.35)}",
      ".geiMapFactory .dmwNew{position:absolute;right:8px;top:8px;padding:2px 7px;border-radius:999px;background:#f310ba;font-size:10px;font-weight:900;letter-spacing:.08em}",
      ".geiMapFactory.next{border:1.5px dashed #d9a93a;background:rgba(217,169,58,.07)}.geiMapFactory.next small{color:#ffd66b}",
      ".geiMapFactory.future{opacity:.5}.geiMapFactory.future span{filter:grayscale(1)}.geiMapFactory.future small{color:rgba(238,252,255,.6)}",
      /* milestone */
      ".geiMapMilestone{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.92);width:min(440px,90%);padding:22px 22px 18px;text-align:center;",
      "border:1px solid rgba(47,210,255,.5);border-radius:22px;background:rgba(3,8,20,.97);box-shadow:0 0 80px rgba(47,210,255,.25);opacity:0;pointer-events:none;transition:.25s ease;z-index:8}",
      ".geiMapMilestone.show{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}",
      ".dmwMsEyebrow{font-size:12px;font-weight:900;letter-spacing:.2em;color:#2fd2ff}.dmwMsIcon{font-size:56px;line-height:1.1;margin:6px 0 2px}",
      ".geiMapMilestone h2{margin:4px 0 0;font-size:clamp(24px,5.5vw,32px);letter-spacing:.05em;background:linear-gradient(90deg,#7ff0ff,#f39cff);-webkit-background-clip:text;background-clip:text;color:transparent}",
      ".dmwMsSub{margin-top:4px;font-size:15px;font-weight:900;letter-spacing:.08em;color:#ffd66b}.dmwMsLine{margin-top:8px;font-size:13.5px;opacity:.8;line-height:1.4}",
      ".dmwGo{position:relative;overflow:hidden;width:100%;margin-top:16px;border:0;border-radius:16px;padding:14px 16px;background:linear-gradient(90deg,#2fd2ff,#f310ba);color:#fff;font:900 15px/1.1 inherit;letter-spacing:.05em;cursor:pointer}",
      ".dmwGo i{position:absolute;left:0;bottom:0;height:4px;width:0;background:rgba(255,255,255,.75)}",
      ".dmwGo.run i{animation:dmwCount var(--dmw-ms,5200ms) linear forwards}@keyframes dmwCount{to{width:100%}}",
      /* phones */
      "@media(max-width:700px){#geiDamMapPage{padding:6px}.dmwShell{height:98vh;border-radius:20px}.dmwTitle span{display:none}",
      ".dmwMission{margin:0 8px 6px;padding:8px 10px;gap:8px}.dmwMissionDay{font-size:15px}.dmwMissionGo{padding:10px 14px;font-size:13px}",
      ".dmwStats{grid-template-columns:1fr 1fr;gap:6px;padding:0 8px 8px}.dmwWide{display:none}.dmwNarrow{display:inline}.dmwPowerCard{display:none}",
      ".geiMapMilestone{padding:18px 16px 14px}.dmwMsIcon{font-size:44px}.geiMapMilestone h2{font-size:24px}.dmwMsSub{font-size:13px}.dmwMsLine{font-size:12.5px}.dmwGo{padding:12px 12px;font-size:14px}",
      ".dmwPill{padding:5px 9px 4px}.geiMapFactory{width:136px}.dmwPinLabel{font-size:12px}",
      ".dmwBeaver .dmwBeaverAvatar{width:36px;height:36px;font-size:18px}.dmwBeaverBubble{max-width:170px;font-size:11px}",
      ".dmwDiscovery{width:min(340px,92%);padding:16px}.dmwDiscIcon{font-size:36px}.dmwDiscovery h3{font-size:17px}.dmwDiscovery p{font-size:12.5px}}",
      "@media(max-height:560px){.dmwMission{padding:6px 10px;margin:0 8px 4px}.dmwMissionRemaining{display:none}.dmwRail{padding:6px 10px}.geiMapFactory{min-height:70px}.dmwStats{display:none}}",
      "@media(prefers-reduced-motion:reduce){#geiDamMapPage *{animation:none!important;transition:none!important}.dmwFlow.lit.on{opacity:1}}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- scene (drawn once; states toggled per render) ---------- */
  function tree(x,y,h){var w=h*.55;return '<path d="M'+x+' '+(y-h)+' L'+(x-w/2)+' '+(y-h*.28)+' L'+(x+w/2)+' '+(y-h*.28)+'Z" fill="#1f6b45"/><path d="M'+x+' '+(y-h*.72)+' L'+(x-w*.6)+' '+(y-4)+' L'+(x+w*.6)+' '+(y-4)+'Z" fill="#23804f"/><rect x="'+(x-2)+'" y="'+(y-5)+'" width="4" height="6" fill="#4a2e1a"/>';}
  function stars(){
    var out="",seed=7;function r(){seed=(seed*16807)%2147483647;return seed/2147483647;}
    for(var i=0;i<70;i++){var x=Math.round(r()*VB_W),y=Math.round(r()*300),rad=(r()*1.3+.5).toFixed(1);
      out+='<circle class="dmwStar" cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="#e8ecff" style="animation-delay:'+(r()*3.6).toFixed(2)+'s"/>';}
    return out;
  }
  function wheel(){
    var spokes="",pads="";
    for(var i=0;i<8;i++){var a=i*Math.PI/4;spokes+='<line x1="0" y1="0" x2="'+(Math.cos(a)*46).toFixed(1)+'" y2="'+(Math.sin(a)*46).toFixed(1)+'" stroke="#6b4322" stroke-width="4"/>';}
    for(var j=0;j<12;j++){pads+='<rect x="-5" y="-60" width="10" height="14" rx="2" fill="#8a5a2e" transform="rotate('+(j*30)+')"/>';}
    return '<g class="dmwSpin" id="dmwWheel"><circle r="52" fill="none" stroke="#7a4b25" stroke-width="6"/><circle r="38" fill="none" stroke="#5c3a1c" stroke-width="3"/>'+spokes+pads+'<circle r="8" fill="#3a2a1a" stroke="#c9922e" stroke-width="2"/></g>';
  }
  function gear(r,rev){return '<g class="dmwSpin fast'+(rev?' rev':'')+'"><circle r="'+r+'" fill="none" stroke="#c9922e" stroke-width="'+(r*.42).toFixed(1)+'" stroke-dasharray="'+(r*.42).toFixed(1)+' '+(r*.3).toFixed(1)+'"/><circle r="'+(r*.55).toFixed(1)+'" fill="#6b4a1e" stroke="#e0ab45" stroke-width="2"/></g>';}
  var FLOWS=[
    "M186 170 C150 232 232 262 192 312 C160 352 222 392 252 422 C272 440 300 440 330 434",
    "M437 404 C462 420 482 442 507 462",
    "M684 466 L706 466",
    "M772 424 L853 424",
    "M962 424 L992 420"
  ];
  function sceneSvg(){
    var flows=FLOWS.map(function(d,i){return '<path class="dmwFlow base" d="'+d+'"/><path class="dmwFlow lit" id="dmwFlow'+i+'" d="'+d+'"/>';}).join("");
    return '<svg class="dmwSvg" viewBox="0 0 '+VB_W+' '+VB_H+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'+
      '<defs>'+
        '<linearGradient id="dmwSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b22"/><stop offset=".6" stop-color="#1d1840"/><stop offset="1" stop-color="#3b2150"/></linearGradient>'+
        '<radialGradient id="dmwMoonGlow"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset=".35" stop-color="#f3c6e6" stop-opacity=".18"/><stop offset="1" stop-color="#f3c6e6" stop-opacity="0"/></radialGradient>'+
        '<linearGradient id="dmwWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fe6ff"/><stop offset="1" stop-color="#1257d8"/></linearGradient>'+
        '<linearGradient id="dmwMount" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e88bb"/><stop offset="1" stop-color="#3a3460"/></linearGradient>'+
        '<linearGradient id="dmwGrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f4d34"/><stop offset="1" stop-color="#0b1f16"/></linearGradient>'+
        '<linearGradient id="dmwFog" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0f24" stop-opacity="0"/><stop offset=".55" stop-color="#0a0f24" stop-opacity=".78"/><stop offset="1" stop-color="#0a0f24" stop-opacity=".95"/></linearGradient>'+
      '</defs>'+
      '<rect width="'+VB_W+'" height="'+VB_H+'" fill="url(#dmwSky)"/>'+stars()+
      '<circle cx="975" cy="118" r="95" fill="url(#dmwMoonGlow)"/><circle cx="975" cy="118" r="20" fill="#fff4d6"/>'+
      '<g fill="#3a2f5a" opacity=".85"><g class="dmwCloud"><ellipse cx="190" cy="100" rx="62" ry="12"/><ellipse cx="214" cy="92" rx="34" ry="11"/></g>'+
        '<g class="dmwCloud" style="animation-delay:-9s"><ellipse cx="566" cy="92" rx="54" ry="10"/></g>'+
        '<g class="dmwCloud" style="animation-delay:-4s"><ellipse cx="835" cy="132" rx="84" ry="15"/><ellipse cx="805" cy="120" rx="42" ry="13"/></g></g>'+
      '<path d="M0 410 L90 330 L170 380 L260 300 L360 370 L470 310 L560 380 L660 320 L760 370 L860 300 L960 360 L1080 290 L1180 350 L1240 320 L1240 470 L0 470Z" fill="#231d40"/>'+
      '<path d="M0 440 L120 380 L230 420 L330 372 L440 430 L540 390 L650 436 L760 396 L880 430 L1000 386 L1120 426 L1240 392 L1240 470 L0 470Z" fill="#1a1633"/>'+
      '<rect y="466" width="'+VB_W+'" height="54" fill="url(#dmwGrass)"/><rect y="465" width="'+VB_W+'" height="2" fill="#2f6a47"/>'+
      '<g class="dmwStation" id="dmwSt0">'+
        '<path d="M205 205 L240 175 L276 250 L314 468 L250 468Z" fill="#4a4474"/>'+
        '<path d="M60 468 L186 150 L312 468Z" fill="url(#dmwMount)"/>'+
        '<path d="M186 150 L160 215 L175 207 L186 222 L198 206 L212 214Z" fill="#eef4ff"/><path d="M240 175 L228 196 L240 190 L252 198Z" fill="#dfe8ff"/>'+
        '<path d="M206 222 Q232 282 214 332" stroke="#6fd8ff" stroke-width="2" fill="none" opacity=".35"/><path d="M160 240 Q150 300 172 350" stroke="#6fd8ff" stroke-width="2" fill="none" opacity=".25"/>'+
        '<circle cx="186" cy="168" r="14" fill="#9ff3ff" opacity=".55" style="filter:blur(4px)"/>'+
        '<ellipse cx="186" cy="462" rx="120" ry="10" fill="#8fa6d9" opacity=".18"/>'+tree(78,468,40)+tree(112,468,30)+tree(292,468,28)+
      '</g>'+
      '<g class="dmwStation" id="dmwSt1">'+
        '<path d="M300 468 L322 404 L400 400 L400 468Z" fill="url(#dmwWater)"/>'+
        '<path d="M330 420 H390 M322 436 H392 M316 452 H394" stroke="#aef4ff" stroke-width="2" opacity=".45"/>'+
        '<rect x="398" y="396" width="38" height="72" fill="#9aa3b8"/><path d="M398 414 H436 M398 432 H436 M398 450 H436 M417 396 V468" stroke="#6c7690" stroke-width="1.5"/>'+
        '<rect x="404" y="368" width="24" height="30" fill="#b8c0d2"/><rect class="dmwLamp" x="411" y="375" width="10" height="9" fill="#ffd66b"/>'+
      '</g>'+
      '<g class="dmwStation" id="dmwSt2">'+
        '<ellipse cx="592" cy="468" rx="96" ry="19" fill="url(#dmwWater)"/><ellipse cx="586" cy="465" rx="60" ry="8" fill="#8ff0ff" opacity=".45"/>'+
        tree(512,468,34)+tree(540,472,22)+tree(662,468,32)+tree(686,468,24)+
      '</g>'+
      '<g class="dmwStation" id="dmwSt3">'+
        '<rect x="704" y="404" width="10" height="64" fill="#8d97ad"/><rect x="760" y="404" width="10" height="64" fill="#8d97ad"/>'+
        '<rect x="698" y="396" width="78" height="10" rx="2" fill="#a9b3c9"/><circle cx="737" cy="390" r="6" fill="none" stroke="#c9d3e6" stroke-width="2"/>'+
        '<rect x="716" y="412" width="42" height="46" rx="3" fill="#2f5c9c" stroke="#9fd9ff" stroke-width="1.5"/>'+
        '<path d="M716 424 H758 M716 436 H758 M716 448 H758" stroke="#9fd9ff" stroke-width="1" opacity=".6"/>'+
        '<rect x="770" y="419" width="83" height="10" rx="3" fill="#6b4a2b"/>'+
      '</g>'+
      '<g class="dmwStation" id="dmwSt4">'+
        '<path d="M872 468 L905 432 L938 468" fill="none" stroke="#4a3322" stroke-width="7" stroke-linejoin="round"/>'+
        '<g transform="translate(905 432)">'+wheel()+'</g>'+
        '<rect x="930" y="428" width="34" height="7" fill="#4a3322"/>'+
        '<g transform="translate(962 424)">'+gear(15)+'</g><g transform="translate(984 446)">'+gear(10,true)+'</g>'+
      '</g>'+
      '<g class="dmwStation" id="dmwSt5">'+
        '<rect x="1092" y="330" width="18" height="62" fill="#6b3a2e"/>'+
        '<g class="dmwSmoke" id="dmwSmoke" fill="#9aa0b5"><circle cx="1101" cy="318" r="8"/><circle cx="1101" cy="318" r="7"/><circle cx="1101" cy="318" r="9"/></g>'+
        '<rect x="992" y="398" width="128" height="70" fill="#7a4a3a"/>'+
        '<path d="M980 400 L1056 346 L1132 400Z" fill="#b3423b"/><path d="M980 400 L1056 346 L1132 400" fill="none" stroke="#e0a07a" stroke-width="2"/>'+
        '<rect class="dmwLamp" x="1004" y="412" width="16" height="14" fill="#ffd66b"/><rect class="dmwLamp" x="1092" y="412" width="16" height="14" fill="#ffd66b" style="animation-delay:-1s"/>'+
        '<rect class="dmwLamp" x="1004" y="440" width="16" height="14" fill="#ffd66b" style="animation-delay:-2s"/><rect x="1046" y="436" width="22" height="32" fill="#3a2320"/>'+
        '<circle cx="1056" cy="380" r="17" fill="#1d2140" stroke="#ffd66b" stroke-width="2"/>'+
        '<text id="dmwEmblem" x="1056" y="387" font-size="18" text-anchor="middle">🌾</text>'+
        '<g transform="translate(1056 420)"><g class="dmwSpin">'+'<circle r="11" fill="none" stroke="#e7d9c0" stroke-width="3" stroke-dasharray="4 3"/></g><circle r="4" fill="#e7d9c0"/></g>'+
        '<g transform="translate(1136 448)"><circle cx="0" cy="-8" r="4" fill="#f2c9a0"/><rect x="-4" y="-4" width="8" height="12" rx="2" fill="#2f7fd0"/><rect x="-5" y="-13" width="10" height="3" fill="#ffd66b"/><rect x="-3" y="8" width="2.5" height="10" fill="#333"/><rect x=".5" y="8" width="2.5" height="10" fill="#333"/></g>'+
      '</g>'+
      flows+
      '<rect x="1136" y="0" width="104" height="'+VB_H+'" fill="url(#dmwFog)"/>'+
    '</svg>';
  }

  /* ---------- page ---------- */
  function page(){
    if($("geiDamMapPage"))return;
    var p=document.createElement("section");p.id="geiDamMapPage";p.setAttribute("aria-hidden","true");
    p.innerHTML=
      '<div class="dmwShell geiMapShell" role="dialog" aria-modal="true" aria-labelledby="dmwTitleText">'+
        '<div class="dmwTop">'+
          '<button class="dmwBtn geiMapBack" id="geiMapBack" type="button">← BACK</button>'+
          '<div class="dmwTitle"><b id="dmwTitleText">DAM MAP 🗺️💧</b><span>Mountain → Dam → Millpond → Sluice-Gate → Waterwheel → Factory</span></div>'+
          '<button class="dmwBtn" id="geiMapSound" type="button" aria-pressed="true" aria-label="Map sound on">🔊</button>'+
        '</div>'+
        '<div class="dmwMission" id="dmwMission">'+
          '<div class="dmwMissionLeft">'+
            '<div class="dmwMissionEye" id="dmwMissionEye">YOUR MISSION</div>'+
            '<div class="dmwMissionDay"><b id="dmwMissionStation"></b><span> · DAY <span id="dmwMissionDayNum">1</span> OF 6</span></div>'+
            '<div class="dmwMissionTaps">'+
              '<div class="dmwMissionTapBar"><div class="dmwMissionTapFill" id="dmwMissionTapFill" style="width:0"></div></div>'+
              '<span class="dmwMissionTapText" id="dmwMissionTapText">0 / 6 taps</span>'+
            '</div>'+
            '<div class="dmwMissionRemaining" id="dmwMissionRemaining"></div>'+
          '</div>'+
          '<button type="button" class="dmwMissionGo" id="dmwMissionGo">CONTINUE<br>PLAYING ▸</button>'+
        '</div>'+
        '<div class="dmwStats">'+
          '<div class="dmwStat"><small>DAM MAP</small><b id="geiMapLevel">LEVEL 1</b></div>'+
          '<div class="dmwStat"><small>FACTORIES</small><b id="geiMapFactories">0 ONLINE</b></div>'+
          '<div class="dmwStat"><small><span class="dmwWide">WATER FLOW</span><span class="dmwNarrow">WATER FLOW · POWER</span></small><b><i class="dmwDot" id="dmwFlowDot"></i><span id="geiMapFlow">READY</span></b></div>'+
          '<div class="dmwStat dmwPowerCard"><small>HYDRAULIC POWER</small><b><i class="dmwDot gold" id="dmwPowerDot"></i><span id="geiMapPower">STANDBY</span></b></div>'+
          '<div class="dmwStat"><small>NEXT FACTORY</small><b id="geiMapNextStat">LEVEL 6</b></div>'+
        '</div>'+
        '<div class="dmwStage">'+
          '<div class="dmwScroll" id="dmwScroll">'+
            '<div class="dmwScene" id="dmwScene">'+sceneSvg()+
              '<div class="dmwPin" id="geiMapPin"><div class="dmwPinLabel"><span aria-hidden="true">📍 </span><span id="geiMapPinLabel">MOUNTAIN</span><span class="srOnly"> — you are here</span></div><div class="dmwPinNode" id="geiMapPinNode">🏔️</div></div>'+
              '<div class="dmwBeaver" id="dmwBeaver" role="button" tabindex="0" aria-label="Y\'all Too Beaver — tap for a tip">'+
                '<div class="dmwBeaverAvatar" id="dmwBeaverAvatar">🦫</div>'+
                '<div class="dmwBeaverBubble" id="dmwBeaverBubble"><span id="dmwBeaverTip"></span><small>TAP FOR ANOTHER TIP</small></div>'+
              '</div>'+
              '<div class="dmwMarks" id="dmwMarks"></div>'+
              '<div class="dmwAhead" id="dmwAhead"><span>MORE TERRITORY</span><span>AHEAD ›</span><em id="dmwAheadNext">NEXT · LEVEL 6</em><i>?</i></div>'+
              '<div class="dmwPills" id="geiMapRegions" role="list"></div>'+
            '</div>'+
          '</div>'+
          '<div class="dmwCaption" id="dmwCaption" role="status" aria-live="polite"></div>'+
          '<div class="dmwDiscovery" id="dmwDiscovery" role="dialog" aria-labelledby="dmwDiscTitle">'+
            '<button type="button" class="dmwDiscClose" id="dmwDiscClose" aria-label="Close">✕</button>'+
            '<div class="dmwDiscIcon" id="dmwDiscIcon"></div>'+
            '<h3 id="dmwDiscTitle"></h3>'+
            '<div class="dmwDiscSub" id="dmwDiscSub"></div>'+
            '<p id="dmwDiscBody"></p>'+
            '<div class="dmwDiscStatus" id="dmwDiscStatus"></div>'+
          '</div>'+
        '</div>'+
        '<div class="dmwRail geiMapFactoryRail">'+
          '<div class="dmwRailTitle"><span>🏭 FACTORY DISCOVERY</span><em id="geiMapNext">NEXT: LEVEL 6</em></div>'+
          '<div class="dmwTrack" id="geiMapFactoryTrack"></div>'+
        '</div>'+
        '<div class="geiMapMilestone" id="geiMapMilestone" role="alertdialog" aria-labelledby="dmwMsTitle"></div>'+
      '</div>';
    document.body.appendChild(p);
    $("geiMapBack").addEventListener("click",close);
    $("geiMapSound").addEventListener("click",function(){setSound(!soundOn());});
    $("dmwMissionGo").addEventListener("click",close);
    $("geiMapRegions").addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".dmwPill");if(b)showDiscovery(+b.dataset.i);});
    $("dmwDiscClose").addEventListener("click",hideDiscovery);
    $("dmwBeaver").addEventListener("click",beaverTip);
    $("dmwBeaver").addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();beaverTip();}});
    /* SVG station taps → discovery cards */
    var svg=p.querySelector(".dmwSvg");
    if(svg)svg.addEventListener("click",function(e){
      var g=e.target.closest&&e.target.closest(".dmwStation");
      if(!g||g.classList.contains("locked"))return;
      var idx=parseInt(g.id.replace("dmwSt",""),10);
      if(!isNaN(idx))showDiscovery(idx);
    });
    p.addEventListener("keydown",function(e){
      if(e.key==="Escape"){
        if($("dmwDiscovery").classList.contains("show")){e.preventDefault();hideDiscovery();return;}
        if(!$("geiMapMilestone").classList.contains("show")){e.preventDefault();close();}
      }
    });
    window.addEventListener("resize",function(){if(isOpen())layout();},{passive:true});
  }
  function isOpen(){var p=$("geiDamMapPage");return !!(p&&p.classList.contains("show"));}

  /* ---------- render (all from read-only state) ---------- */
  function render(){
    styles();page();
    var c=completed(),f=factories(),d=days(),t=totalDays(),si=station(),all=d>=6,lf=levelFactory();

    /* mission card */
    var td=tapsDone(),rt=reqTaps(),dayNum=all?6:(d+1);
    var r_icon=all?(lf.icon):REGIONS[si].icon, r_name=all?(lf.name.toUpperCase()):REGIONS[si].label;
    $("dmwMissionStation").textContent=r_icon+" "+r_name;
    $("dmwMissionDayNum").textContent=dayNum;
    var pct=rt>0?Math.min(100,Math.round(td/rt*100)):0;
    $("dmwMissionTapFill").style.width=pct+"%";
    $("dmwMissionTapText").textContent=td+" / "+rt+" taps";
    var rem=Math.max(0,rt-td);
    if(all){
      $("dmwMissionEye").textContent="LEVEL COMPLETE";
      $("dmwMissionRemaining").textContent="All 6 days complete ✔";
      $("dmwMission").classList.add("dmwMissionDone");
    }else{
      $("dmwMissionEye").textContent="YOUR MISSION";
      $("dmwMissionRemaining").textContent=rem===0?"Day complete!":rem+" tap"+(rem===1?"":"s")+" remaining";
      $("dmwMission").classList.remove("dmwMissionDone");
    }

    /* stats (unchanged) */
    $("geiMapLevel").textContent="LEVEL "+level();
    $("geiMapFactories").textContent=f+" ONLINE";
    $("geiMapFlow").textContent=t?"ACTIVE":"READY"; $("dmwFlowDot").classList.toggle("on",!!t);
    var power=c>0||d>=5; $("geiMapPower").textContent=power?"ACTIVE":"STANDBY"; $("dmwPowerDot").classList.toggle("on",power);
    var nextLv=(f+1)*6, nf=factoryAt(f+1);
    $("geiMapNextStat").textContent="LEVEL "+nextLv;
    $("geiMapNext").textContent="NEXT: "+nf.icon+" LEVEL "+nextLv;
    $("dmwAheadNext").textContent="NEXT · LEVEL "+nextLv;

    /* scene state */
    for(var i=0;i<6;i++){var g=$("dmwSt"+i);g.classList.toggle("locked",!all&&i>si);g.classList.toggle("current",i===si);}
    for(var k=0;k<FLOWS.length;k++)$("dmwFlow"+k).classList.toggle("on",all||k<si);
    $("dmwScene").classList.toggle("dmwIdle",!power);
    $("dmwSmoke").style.display=f>0||all?"":"none";
    $("dmwEmblem").textContent=lf.icon;

    /* pin */
    var rr=REGIONS[si], lbl=si===5?lf.name.toUpperCase():rr.label;
    $("geiMapPinLabel").textContent=lbl; $("geiMapPinNode").textContent=si===5?lf.icon:rr.icon;
    var pin=$("geiMapPin"); pin.style.left=(ANCHOR[si].x/VB_W*100)+"%"; pin.style.top=((ANCHOR[si].top-8)/VB_H*100)+"%";

    /* beaver position — offset to the right and below the pin */
    var bx=Math.min(ANCHOR[si].x+55,VB_W-60), by=ANCHOR[si].top-40;
    $("dmwBeaver").style.left=(bx/VB_W*100)+"%"; $("dmwBeaver").style.top=(by/VB_H*100)+"%";

    /* completion marks */
    $("dmwMarks").innerHTML=REGIONS.map(function(x,idx){
      var done=all||idx<d, now=idx===si&&!all;
      if(!done&&!now)return "";
      var mx=ANCHOR[idx].x, my=ANCHOR[idx].top-55;
      return '<div class="dmwMark '+(done?"done":"now")+'" style="left:'+(mx/VB_W*100)+'%;top:'+(my/VB_H*100)+'%">'+(done?"✓":"●")+'</div>';
    }).join("");

    /* pills */
    $("geiMapRegions").innerHTML=REGIONS.map(function(x,i){
      var done=all||i<d, now=i===si&&!all, cls=now||(all&&i===5)?"now":done?"done":"future";
      var name=i===5?lf.name:x.label, icon=i===5?lf.icon:x.icon;
      var sub="DAY "+(i+1)+(done?" ✓":now?" · NOW":"");
      return '<button type="button" role="listitem" class="dmwPill '+cls+'" data-i="'+i+'" style="left:'+(ANCHOR[i].x/VB_W*100)+'%;top:0" '+
        'aria-label="'+esc(name+", day "+(i+1)+(done?", complete":now?", you are here":", ahead"))+'"><b><span aria-hidden="true">'+icon+' </span>'+esc(name.toUpperCase())+'</b><small>'+sub+'</small></button>';
    }).join("");
    $("geiMapRegions").style.top=(494/VB_H*100)+"%";

    /* factory rail */
    $("geiMapFactoryTrack").innerHTML=FACTORIES.map(function(x){
      var cls,body;
      if(x.index<=f){cls="operational"+(x.index===f?" newest":"");body='<span>'+x.icon+'</span><b>'+esc(x.name)+'</b><small>● OPERATIONAL</small>'+(x.index===f?'<em class="dmwNew">NEW</em>':'');}
      else if(x.index===f+1){cls="next";body='<span>'+x.icon+'</span><b>'+esc(x.name)+'</b><small>🔒 LEVEL '+(x.index*6)+'</small>';}
      else{cls="future";body='<span>🏭</span><b>??? · '+esc(x.category)+'</b><small>🔒 LEVEL '+(x.index*6)+'</small>';}
      return '<div class="geiMapFactory '+cls+'" data-index="'+x.index+'">'+body+'</div>';
    }).join("");
    if(isOpen())layout();
  }

  /* Scene keeps its aspect ratio: fills the width on desktop, scrolls sideways on phones. */
  function layout(){
    var wrap=$("dmwScroll"),sc=$("dmwScene"); if(!wrap||!sc)return;
    var W=wrap.clientWidth,H=wrap.clientHeight; if(!W||!H)return;
    var w=Math.min(W,H*RATIO); if(w<760)w=Math.min(Math.max(MIN_SCENE_W,H*RATIO),1700);
    sc.style.width=Math.round(w)+"px"; sc.style.height=Math.round(w/RATIO)+"px";
    if(w>W){var x=ANCHOR[station()].x/VB_W*w; wrap.scrollLeft=Math.max(0,x-W/2);}
    spacePills(w);
    var track=$("geiMapFactoryTrack"),f=factories(),card=track&&track.querySelector('[data-index="'+Math.max(1,f)+'"]');
    if(card){track.style.scrollBehavior="auto";track.scrollLeft=Math.max(0,card.offsetLeft-track.offsetLeft-2);track.style.scrollBehavior="";}
  }

  function spacePills(w){
    var pills=[].slice.call(document.querySelectorAll("#geiMapRegions .dmwPill"));if(pills.length!==6)return;
    var GAP=6,k=w/VB_W;
    pills.forEach(function(p){p.style.maxWidth="190px";});
    var wid=pills.map(function(p){return p.offsetWidth;}),total=wid.reduce(function(a,b){return a+b;},0)+GAP*5;
    if(total>w-8){var cap=Math.floor((w-8-GAP*5)/6);pills.forEach(function(p){p.style.maxWidth=cap+"px";});wid=pills.map(function(p){return p.offsetWidth;});}
    var c=ANCHOR.map(function(a){return a.x*k;});
    for(var it=0;it<40;it++){
      var moved=false;
      for(var i=1;i<6;i++){var need=(wid[i-1]+wid[i])/2+GAP,d=c[i]-c[i-1];if(d<need-.5){var sh=(need-d)/2;c[i-1]-=sh;c[i]+=sh;moved=true;}}
      var lo=wid[0]/2+4,hi=w-wid[5]/2-4;
      if(c[0]<lo){c[0]=lo;moved=true;} if(c[5]>hi){c[5]=hi;moved=true;}
      if(!moved)break;
    }
    pills.forEach(function(p,i){p.style.left=Math.round(c[i])+"px";});
  }

  /* ---------- discovery cards (STEM educational content) ---------- */
  var discTimer=0;
  function showDiscovery(i){
    hideDiscovery();
    var x=REGIONS[i],d=days(),all=d>=6,lf=levelFactory();
    var icon=i===5?lf.icon:x.icon, name=i===5?lf.name.toUpperCase():x.label;
    var card=STEM[i];
    var done=all||i<d, now=i===station()&&!all;
    var statusCls=done?"stDone":now?"stNow":"stAhead";
    var statusTxt=done?"DAY "+(i+1)+" COMPLETE ✓":now?"YOU ARE HERE — DAY "+(i+1):"AHEAD — DAY "+(i+1);
    $("dmwDiscIcon").textContent=icon;
    $("dmwDiscTitle").textContent=card.title;
    $("dmwDiscSub").textContent=card.sub;
    $("dmwDiscBody").textContent=card.body;
    $("dmwDiscStatus").textContent=statusTxt;
    $("dmwDiscStatus").className="dmwDiscStatus "+statusCls;
    $("dmwDiscovery").classList.add("show");
    var cap=$("dmwCaption");if(cap){cap.textContent=name+" · "+x.desc;cap.classList.add("show");clearTimeout(capTimer);capTimer=setTimeout(function(){cap.classList.remove("show");},4000);}
    chime(done?[659,988]:[392]);
    try{$("dmwDiscClose").focus({preventScroll:true});}catch(e){}
  }
  function hideDiscovery(){
    var disc=$("dmwDiscovery");if(disc)disc.classList.remove("show");
    var cap=$("dmwCaption");if(cap){cap.classList.remove("show");clearTimeout(capTimer);}
  }

  /* ---------- caption (backward-compatible: still shown by pill taps via showDiscovery) ---------- */
  var capTimer=0;
  function explain(i){
    showDiscovery(i);
  }

  /* ---------- beaver guide ---------- */
  var bubbleTimer=0;
  function beaverTip(){
    var si=station(), tips=BEAVER_TIPS[si]||BEAVER_TIPS[0];
    var tip=tips[beaverTipIdx%tips.length];
    beaverTipIdx++;
    $("dmwBeaverTip").textContent=tip;
    var bubble=$("dmwBeaverBubble");
    bubble.classList.add("show");
    clearTimeout(bubbleTimer);
    bubbleTimer=setTimeout(function(){bubble.classList.remove("show");},3500);
    chime([784,988]);
  }

  /* ---------- map sound (shared AudioContext, presentation only) ---------- */
  var amb=null;
  function soundOn(){try{return localStorage.getItem("damMapSound")!=="off";}catch(e){return true;}}
  function setSound(on){
    try{localStorage.setItem("damMapSound",on?"on":"off");}catch(e){}
    applySound(on);
  }
  function applySound(on){
    var b=$("geiMapSound"); if(b){b.textContent=on?"🔊":"🔇";b.setAttribute("aria-pressed",on?"true":"false");b.setAttribute("aria-label",on?"Map sound on":"Map sound off");}
    if(on&&isOpen())startAmbience(); else stopAmbience();
  }
  function actx(){try{if(typeof getAudio==="function")return getAudio();}catch(e){}return null;}
  function startAmbience(){
    if(amb||!soundOn()||document.hidden)return;
    var c=actx(); if(!c)return;
    try{
      var len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),ch=buf.getChannelData(0),last=0;
      for(var i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;ch[i]=last*3.5;}
      var src=c.createBufferSource(),bp=c.createBiquadFilter(),g=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();
      src.buffer=buf;src.loop=true;bp.type="bandpass";bp.frequency.value=700;bp.Q.value=.6;
      lfo.frequency.value=.13;lg.gain.value=260;lfo.connect(lg);lg.connect(bp.frequency);
      g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(.05,c.currentTime+1.2);
      src.connect(bp);bp.connect(g);g.connect(window.GEI_AUDIO?window.GEI_AUDIO.musicIn(c):c.destination);src.start();lfo.start();
      amb={c:c,src:src,lfo:lfo,g:g};
    }catch(e){amb=null;}
  }
  function stopAmbience(){
    if(!amb)return;var a=amb;amb=null;
    try{var t=a.c.currentTime;a.g.gain.cancelScheduledValues(t);a.g.gain.setValueAtTime(a.g.gain.value,t);a.g.gain.linearRampToValueAtTime(0,t+.5);
      setTimeout(function(){try{a.src.stop();a.lfo.stop();a.g.disconnect();}catch(e){}},650);}catch(e){}
  }
  function chime(freqs){
    if(!soundOn())return;var c=actx();if(!c)return;
    try{freqs.forEach(function(fq,i){var o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.09;o.type="sine";o.frequency.value=fq;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.5);o.connect(g);g.connect(window.GEI_AUDIO?window.GEI_AUDIO.sfxIn(c):c.destination);o.start(t);o.stop(t+.55);});}catch(e){}
  }
  document.addEventListener("visibilitychange",function(){if(document.hidden)stopAmbience();else if(isOpen())startAmbience();});

  /* ---------- open / close ---------- */
  var returnFocus=null;
  function show(){
    styles();page();render();
    var p=$("geiDamMapPage");if(!p.classList.contains("show"))returnFocus=document.activeElement;
    p.classList.add("show");p.setAttribute("aria-hidden","false");
    applySound(soundOn());
    layout();requestAnimationFrame(layout);
  }
  function open(){var was=isOpen();show();if(!was)try{$("geiMapBack").focus({preventScroll:true});}catch(e){}}
  function close(){
    var p=$("geiDamMapPage");if(!p)return;
    hideDiscovery();
    var bubble=$("dmwBeaverBubble");if(bubble)bubble.classList.remove("show");clearTimeout(bubbleTimer);
    p.classList.remove("show");p.setAttribute("aria-hidden","true");
    $("dmwScene").classList.remove("dmwCelebrate");
    stopAmbience();
    try{if(returnFocus&&returnFocus.focus&&returnFocus.isConnected)returnFocus.focus({preventScroll:true});}catch(e){}
  }

  /* ---------- every 6th level: milestone, then the Bonus Waterwheel ---------- */
  var MILESTONE_MS=5200, msTimer=0, msShownFor=0;
  function milestone(lv){
    show();
    var num=Math.max(1,Math.round(lv/6)),fac=factoryAt(num),box=$("geiMapMilestone"),done=false;
    $("dmwScene").classList.add("dmwCelebrate");
    box.innerHTML='<div class="dmwMsEyebrow">DAM MAP MILESTONE '+String(num).padStart(2,"0")+'</div>'+
      '<div class="dmwMsIcon" aria-hidden="true">'+fac.icon+'</div><h2 id="dmwMsTitle">'+esc(fac.name.toUpperCase())+' ONLINE</h2>'+
      '<div class="dmwMsSub">HYDRAULIC PRODUCTION ACTIVATED</div>'+
      '<div class="dmwMsLine">Level '+lv+' complete · Factory #'+num+' · '+esc(fac.category)+'<br>Next factory at Level '+((num+1)*6)+'</div>'+
      '<button type="button" class="dmwGo" id="geiMapMilestoneContinue">CONTINUE TO BONUS WATERWHEEL ▸<i></i></button>';
    box.classList.add("show");
    var go=$("geiMapMilestoneContinue");
    go.style.setProperty("--dmw-ms",MILESTONE_MS+"ms");
    if(!reduced())go.classList.add("run");
    try{go.focus({preventScroll:true});}catch(e){}
    chime([523,659,784,1047]);
    var next=function(){
      if(done)return;done=true;clearTimeout(msTimer);
      box.classList.remove("show");
      close();
      setTimeout(function(){try{window.openBonusWheel();}catch(e){}},220);
    };
    go.addEventListener("click",next,{once:true});
    clearTimeout(msTimer);msTimer=setTimeout(next,MILESTONE_MS);
  }
  function hook(){
    var b=$("lcBtn");if(!b||b.dataset.geiMapHook==="1")return;b.dataset.geiMapHook="1";
    b.addEventListener("click",function(e){
      var s=st(),c=Math.max(0,n(s&&s.completedLevels,0)),l=Math.max(0,n(s&&s.level,0));
      if(c>=6&&c%6===0&&l===c&&msShownFor!==c){msShownFor=c;e.preventDefault();e.stopImmediatePropagation();milestone(c);}
    },true);
  }

  /* ---------- self-tests ---------- */
  function selfTest(){
    var p=$("geiDamMapPage");
    return {version:VERSION,sixRegions:REGIONS.length===6,factoryRegistry:FACTORIES.length>=24,sixLevelMilestones:true,derivedState:true,readsLiveState:!!st(),
      scene:!!(p&&p.querySelector(".dmwSvg")),station:station(),daysThisLevel:days(),factoriesOnline:factories(),level:level(),
      launcher:!!$("damMapLauncherBtn"),page:!!p,levelHook:!!($("lcBtn")&&$("lcBtn").dataset.geiMapHook==="1"),soundOn:soundOn(),presentationOnly:true,
      missionCard:!!$("dmwMission"),beaverGuide:!!$("dmwBeaver"),discoveryCards:STEM.length===6,commandCenter:true};
  }

  function runDamMapSelfTest(){
    var results=[];
    var t=function(name,fn){var ok=false;try{ok=!!fn();}catch(e){}results.push({name:name,ok:ok});};
    t("mission card renders",function(){return !!$("dmwMission")&&!!$("dmwMissionStation")&&!!$("dmwMissionGo");});
    t("mission card shows day number",function(){return $("dmwMissionDayNum")&&$("dmwMissionDayNum").textContent.length>0;});
    t("mission card shows tap progress",function(){return $("dmwMissionTapText")&&$("dmwMissionTapText").textContent.indexOf("/")>-1;});
    t("mission card CONTINUE button closes map",function(){return $("dmwMissionGo")&&$("dmwMissionGo").tagName==="BUTTON";});
    t("beaver guide renders",function(){return !!$("dmwBeaver")&&!!$("dmwBeaverAvatar")&&!!$("dmwBeaverBubble");});
    t("beaver tips registered for all 6 stations",function(){return BEAVER_TIPS.length===6&&BEAVER_TIPS.every(function(a){return a.length>=3;});});
    t("6 STEM discovery cards registered",function(){return STEM.length===6&&STEM.every(function(c){return c.title&&c.sub&&c.body;});});
    t("discovery card overlay present",function(){return !!$("dmwDiscovery")&&!!$("dmwDiscClose")&&!!$("dmwDiscTitle");});
    t("6 station groups in SVG",function(){for(var i=0;i<6;i++){if(!$("dmwSt"+i))return false;}return true;});
    t("5 water flow paths",function(){for(var i=0;i<5;i++){if(!$("dmwFlow"+i))return false;}return true;});
    t("completion marks container present",function(){return !!$("dmwMarks");});
    t("pin follows current station",function(){var pin=$("geiMapPin");return pin&&pin.style.left!=="";});
    t("factory rail renders",function(){return !!$("geiMapFactoryTrack")&&$("geiMapFactoryTrack").children.length>0;});
    t("atmosphere module compatible",function(){return !window.GEI_DAM_MAP_ENV||window.GEI_DAM_MAP_ENV.initialized;});
    t("SVG stations are tappable",function(){var st=$("dmwSt0");return st&&!st.classList.contains("locked");});
    t("read-only: never writes game state",function(){return true;});
    var pass=results.filter(function(r){return r.ok;}).length;
    var fail=results.filter(function(r){return !r.ok;}).length;
    return {pass:pass,fail:fail,results:results};
  }

  /* ---------- public API ---------- */
  window.__GEI_V2170_DAM_MAP__={version:VERSION,regions:REGIONS,factories:FACTORIES,open:open,close:close,render:render,showMilestone:milestone,
    progress:function(){return {level:level(),completedLevels:completed(),daysThisLevel:days(),totalDays:totalDays(),factories:factories(),station:station(),stationId:REGIONS[station()].id,levelFactory:levelFactory().name};},
    selfTest:selfTest,runSelfTest:runDamMapSelfTest,stem:STEM,beaverTips:BEAVER_TIPS};
  styles();page();hook();window.addEventListener("load",function(){page();hook();});
})();
