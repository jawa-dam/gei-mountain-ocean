/* V1 — DAM STEM ACADEMY 💧🔬  (engine)
 * Turns the six existing DAM Map regions into playable STEM labs:  LEARN → EXPERIMENT → PROVE → EARN.
 *
 * Plugs into the existing DAM Map (dam-map-v2170.js) without changing it:
 *   - tapping a region pill also opens that station's STEM popout inside the map frame
 *   - each pill gains a "STEM ✓ / STEM 60% / STEM 🔒" tag, the map header gains a 💧 STEM button
 *   - which stations are playable follows the map's own progression (window.__GEI_V2170_DAM_MAP__.progress())
 *
 * Data lives in stem-academy-data-v1.js, interactive labs in stem-academy-labs-v1.js (window.GEI_STEM).
 *
 * ECONOMY RULE: STEM XP is educational progression only. This module never reads or writes `state`, FL OZ,
 * game XP, purchases, entitlements or any server/economy API, and nothing here grants purchasable currency.
 * Only persisted key: localStorage "geiStemAcademy.v1" — step flags per station. STEM XP, badges and Master
 * status are DERIVED from those flags on every load, so there is no second balance to corrupt or inflate.
 */
(function(){
  "use strict";
  if(window.__GEI_STEM_ACADEMY_V1__)return;
  var G=window.GEI_STEM;
  if(!G||!G.stations){try{console.warn("[STEM] data module missing — academy disabled");}catch(e){}return;}
  var VERSION="V2.2.0", KEY="geiStemAcademy.v1";
  var STEPS=["discover","experiment","challenge","quiz"];
  var PHASES=[["discover","DISCOVER","💡"],["experiment","TEST","🧪"],["mission","MISSION","🎯"],["prove","DECIDE","🧭"],["complete","REWARD","🏆"],["free","FREE","🛠️"]];
  var FLAG={discover:"discover",experiment:"experiment",mission:"challenge",prove:"quiz"};
  var GUIDE_IMG="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-beaver-rhhiVplt1GMykxV8.png";

  function $(id){return document.getElementById(id);}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
  function reduced(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}
  function ids(){return G.order.slice();}

  /* ---------- persistence: flags only; everything else is derived ---------- */
  var store=load();
  function blank(){var s={v:1,seen:0,st:{}};ids().forEach(function(id){s.st[id]={};});return s;}
  function load(){
    var s=blank();
    try{
      var j=JSON.parse(localStorage.getItem(KEY)||"null");
      if(j&&typeof j==="object"){
        s.seen=j.seen?1:0;
        ids().forEach(function(id){var o=j.st&&j.st[id];if(o&&typeof o==="object")STEPS.forEach(function(k){if(o[k]===1||o[k]===true)s.st[id][k]=1;});});
      }
    }catch(e){}
    return s;
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
  function flag(id,k){return !!(store.st[id]&&store.st[id][k]);}
  function count(id){return STEPS.filter(function(k){return flag(id,k);}).length;}
  function pct(id){return count(id)*25;}
  function badgeEarned(id){return count(id)===STEPS.length;}
  function core(){return ids().filter(function(id){return G.stations[id].badge&&G.stations[id].core!==false;});}
  function master(){var c=core();return c.length>0&&c.every(badgeEarned);}
  function xp(){
    var t=0;ids().forEach(function(id){STEPS.forEach(function(k){if(flag(id,k))t+=G.stations[id].reward[k]||0;});});
    if(master())t+=G.master.bonus;return t;
  }
  function maxXp(){var t=0;ids().forEach(function(id){STEPS.forEach(function(k){t+=G.stations[id].reward[k]||0;});});return t+G.master.bonus;}
  function award(id,k){
    if(flag(id,k))return 0;
    var before=master();store.st[id][k]=1;save();
    var n=G.stations[id].reward[k]||0;if(!before&&master())n+=G.master.bonus;
    refreshMap();return n;
  }

  /* ---------- map progression (read-only) ---------- */
  function mapProgress(){try{var a=window.__GEI_V2170_DAM_MAP__;return a&&a.progress?a.progress():null;}catch(e){return null;}}
  function unlocked(id){
    var s=G.stations[id];if(!s||s.region==null)return true;
    var p=mapProgress();if(!p)return s.region===0;
    return p.completedLevels>=1||p.daysThisLevel>=6||s.region<=p.station;
  }
  function nextStation(id){var o=ids(),i=o.indexOf(id);return i>=0&&i<o.length-1?o[i+1]:null;}

  /* ---------- sound: the shared audio graph, the map's sound toggle, kept subtle ---------- */
  function soundOn(){try{return localStorage.getItem("damMapSound")!=="off";}catch(e){return true;}}
  var TONES={tap:[[523],.025],good:[[659,988],.06],oops:[[349],.04],xp:[[784,1047],.05],wow:[[523,659,784,1047],.07],badge:[[523,659,784,1047],.08],master:[[523,659,784,1047,1319,1568],.09]};
  var lastFx={};
  /* soft synthesized STEM sounds: water = filtered noise, build = thud, gate = low sweep, spin = rising hum, zap = blip */
  var FX={
    water:function(c,o,out){var len=c.sampleRate*.4,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
      var src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=buf;f.type="bandpass";f.frequency.value=900;f.Q.value=.7;g.gain.value=.05;src.connect(f);f.connect(g);g.connect(out);src.start(c.currentTime);},
    build:function(c,o,out){tone(c,out,"triangle",150,70,.18,.07);},
    gate:function(c,o,out){tone(c,out,"sawtooth",100,180,.28,.03);},
    spin:function(c,o,out){tone(c,out,"triangle",220,340,.22,.03);},
    zap:function(c,o,out){tone(c,out,"sine",880,1760,.14,.035);}
  };
  function tone(c,out,type,f0,f1,dur,vol){
    var o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.linearRampToValueAtTime(f1,t+dur);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+.05);
  }
  function sfx(kind){
    if(!soundOn()||document.hidden)return;
    var now=Date.now();if(now-(lastFx[kind]||0)<(FX[kind]?450:120))return;lastFx[kind]=now;     // never a constant din
    try{
      var c=typeof getAudio==="function"?getAudio():null;if(!c)return;
      var out=window.GEI_AUDIO&&window.GEI_AUDIO.sfxIn?window.GEI_AUDIO.sfxIn(c):c.destination;
      if(FX[kind]){FX[kind](c,null,out);return;}
      var t=TONES[kind];if(!t)return;
      t[0].forEach(function(fq,i){var o=c.createOscillator(),g=c.createGain(),at=c.currentTime+i*.09;
        o.type="sine";o.frequency.value=fq;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(t[1],at+.015);g.gain.exponentialRampToValueAtTime(.0001,at+.45);
        o.connect(g);g.connect(out);o.start(at);o.stop(at+.5);});
    }catch(e){}
  }

  /* ---------- styles (existing DAM-ITE glass / cyan-magenta language) ---------- */
  function styles(){
    if($("stmStyles"))return;
    var s=document.createElement("style");s.id="stmStyles";
    s.textContent=[
      ".stmTopBtn{display:flex;align-items:center;gap:6px;white-space:nowrap}.stmTopBtn b{color:#7ff0ff}",
      ".stmTag{display:block;margin-top:2px;color:#7ff0ff;font-weight:900;letter-spacing:.08em;white-space:nowrap}.stmTag.done{color:#8dffb0}.stmTag.lock{color:rgba(238,252,255,.5)}",
      ".stmLab{position:absolute;inset:0;z-index:9;display:none;flex-direction:column;min-height:0;background:radial-gradient(120% 80% at 50% 0,#0d2140 0,#050a18 70%);color:#eefcff;border-radius:inherit;overflow:hidden}",
      ".stmLab.show{display:flex}.stmLab *{box-sizing:border-box}",
      ".stmHead{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid rgba(47,210,255,.25);background:rgba(3,8,20,.8)}",
      ".stmClose{flex:0 0 auto;min-width:48px;min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:#fff;font:900 20px/1 inherit;cursor:pointer}",
      ".stmHT{flex:1;min-width:0}.stmHT b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:clamp(17px,4.4vw,24px);letter-spacing:.06em;line-height:1.1}.stmHT small{display:block;margin-top:3px;font-size:13px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
      ".stmXp{flex:0 0 auto;padding:8px 12px;border-radius:14px;border:1px solid rgba(47,210,255,.5);background:rgba(47,210,255,.1);font-weight:900;letter-spacing:.04em;position:relative;font-size:16px}",
      ".stmToast{position:absolute;right:6px;top:100%;margin-top:4px;padding:6px 12px;border-radius:12px;background:linear-gradient(90deg,#2fd2ff,#f310ba);font-weight:900;font-size:15px;white-space:nowrap;animation:stmToast 2.2s ease forwards;pointer-events:none;z-index:3}",
      "@keyframes stmToast{0%{opacity:0;transform:translateY(-6px)}12%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(8px)}}",
      ".stmSteps{display:flex;gap:6px;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.08)}",
      ".stmStep{flex:1;min-width:0;min-height:48px;padding:4px 2px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:rgba(238,252,255,.7);font:800 11px/1.15 inherit;letter-spacing:.04em;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}",
      ".stmStep i{font-style:normal;font-size:16px}.stmStep.done{border-color:rgba(141,255,176,.6);color:#bfffd2}.stmStep.now{border-color:#fff;background:rgba(47,210,255,.18);color:#fff;box-shadow:0 0 14px rgba(47,210,255,.4)}.stmStep[disabled]{opacity:.4;cursor:default}",
      ".stmBody{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:12px;-webkit-overflow-scrolling:touch;font-size:16px;line-height:1.4}",
      ".stmFoot{padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(255,255,255,.1);background:rgba(3,8,20,.9)}",
      ".stmPrimary,.stmGo{width:100%;min-height:56px;border:0;border-radius:16px;padding:14px 16px;background:linear-gradient(90deg,#2fd2ff,#f310ba);color:#fff;font:900 17px/1.1 inherit;letter-spacing:.05em;cursor:pointer}",
      ".stmGo{margin-top:12px}.stmPrimary[disabled],.stmGo[disabled]{opacity:.45;cursor:default;filter:grayscale(.5)}",
      ".stmPrimary:focus-visible,.stmBtn:focus-visible,.stmClose:focus-visible,.stmStep:focus-visible,.stmCard:focus-visible,.stmCareerBtn:focus-visible{outline:3px solid #ffd66b;outline-offset:2px}",
      ".stmSec{margin:0 0 6px;font-size:13px;font-weight:900;letter-spacing:.14em;color:#7ff0ff}",
      ".stmGuide{display:flex;gap:10px;align-items:flex-start;margin-bottom:12px}",
      ".stmAv{flex:0 0 auto;width:52px;height:52px;border-radius:50%;border:2px solid #7ff0ff;background:#10264a;display:grid;place-items:center;font-size:28px;overflow:hidden;position:relative}",
      ".stmAv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
      ".stmBubble{flex:1;min-width:0;padding:10px 12px;border-radius:4px 16px 16px 16px;background:rgba(47,210,255,.12);border:1px solid rgba(47,210,255,.45);font-size:16px;font-weight:700}",
      ".stmBubble small{display:block;font-size:11px;letter-spacing:.14em;color:#7ff0ff;margin-bottom:2px}",
      ".stmLearn{font-size:clamp(18px,4.6vw,22px);font-weight:800;line-height:1.35;margin:4px 0 12px}",
      ".stmFacts{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:8px}.stmFacts li{padding:12px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-size:16px;font-weight:700}",
      ".stmNote{margin:8px 0 0;padding:10px 12px;border-radius:12px;font-size:14px;line-height:1.35;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04)}",
      ".stmNote b{display:block;font-size:11px;letter-spacing:.14em;margin-bottom:2px}.stmNote.real b{color:#8dffb0}.stmNote.gei b{color:#f39cff}",
      ".stmPrompt{margin:0 0 10px;font-size:17px;font-weight:800}",
      ".stmViz{width:100%;height:auto;max-height:34vh;display:block;margin:0 0 10px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1)}",
      ".stmSvgLbl{fill:#cfeeff;font:700 11px sans-serif}.stmDrop{fill:#7fe8ff}.stmFlake{fill:#fff}",
      ".stmStream{fill:none;stroke:#22385f;stroke-width:7;stroke-linecap:round}.stmStream.glow{stroke:#5fe6ff}",
      ".stmPath{fill:none;stroke:rgba(255,255,255,.45);stroke-width:5;stroke-dasharray:2 8;stroke-linecap:round}.stmPath.pick{stroke:#ffd66b;stroke-dasharray:none}",
      ".stmMark circle{fill:#0b1a3a;stroke:#fff;stroke-width:2}.stmMark text{fill:#fff;font:900 13px sans-serif}",
      ".stmStat,.stmResult{margin:0 0 10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);font-size:16px;font-weight:800;min-height:46px}",
      ".stmResult em{display:block;margin-top:4px;font-style:normal;font-weight:700;color:#ffd66b;font-size:15px}",
      ".stmRow{display:grid;gap:8px;margin:0 0 10px}.stmRow.c1{grid-template-columns:1fr}.stmRow.c2{grid-template-columns:repeat(2,1fr)}.stmRow.c3{grid-template-columns:repeat(3,1fr)}.stmRow.c4{grid-template-columns:repeat(4,1fr)}.stmRow.c5{grid-template-columns:repeat(5,1fr)}.stmRow.c6{grid-template-columns:repeat(6,1fr)}",
      ".stmBtn{min-height:56px;padding:8px 6px;border-radius:14px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:#fff;font:800 22px/1.1 inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;text-align:center}",
      ".stmBtn b{font-size:14px;letter-spacing:.04em}.stmBtn small{font-size:12px;font-weight:800;letter-spacing:.04em;opacity:.85}",
      ".stmBtn.sel{border-color:#7ff0ff;background:rgba(47,210,255,.2);box-shadow:0 0 14px rgba(47,210,255,.4)}.stmBtn.sel::after{content:\"✓\";font-size:12px}",
      ".stmBtn.good{border-color:#8dffb0;background:rgba(141,255,176,.18)}.stmBtn[disabled]{opacity:.5}",
      ".stmBtn.stmWide{flex-direction:row;justify-content:flex-start;gap:10px;padding:10px 14px;font-size:17px;text-align:left}.stmBtn.stmWide b{font-size:20px}",
      ".stmRow.c5 .stmBtn,.stmRow.c6 .stmBtn{font-size:12px;padding:6px 2px;font-weight:900}.stmRow.c6 .stmBtn b{font-size:22px}",
      ".stmLbl{margin:2px 0 6px;font-size:12.5px;font-weight:900;letter-spacing:.12em;color:#7ff0ff}",
      ".stmChecks{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}.stmChecks span{padding:6px 10px;border-radius:999px;border:1px dashed rgba(255,255,255,.3);font-size:14px;font-weight:800;opacity:.7}.stmChecks span.on{border-style:solid;border-color:#8dffb0;opacity:1}.stmChecks span.on::before{content:\"✓ \"}",
      ".stmCycle{display:flex;gap:4px;margin-bottom:8px}.stmCycle span{flex:1;padding:6px 0;text-align:center;border-radius:8px;border:1px solid rgba(255,255,255,.15);font:900 9.5px/1 inherit;letter-spacing:.03em;opacity:.6}.stmCycle span.past{opacity:.9;border-color:rgba(141,255,176,.5)}.stmCycle span.on{opacity:1;border-color:#fff;background:rgba(47,210,255,.2)}",
      ".stmWall.holds{filter:drop-shadow(0 0 8px #8dffb0)}",
      ".stmBars{display:grid;gap:8px;margin:0 0 4px;font-size:13px;font-weight:900;letter-spacing:.06em}.stmBar{height:12px;margin-top:4px;border-radius:8px;background:rgba(255,255,255,.1);overflow:hidden}.stmBar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#2fd2ff,#7ff0ff);transition:width .25s}",
      ".stmMeter{margin:0 0 8px;font-size:18px;font-weight:900;letter-spacing:.05em}.stmMS{letter-spacing:2px}",
      ".stmEq{margin:0 0 8px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.05);font-size:14px;font-weight:800;letter-spacing:.03em}.stmEq:empty{display:none}.stmEq span{white-space:nowrap}.stmEq b{color:#ffd66b;font-size:17px}",
      ".stmProg{margin:0 0 8px;font-weight:900;letter-spacing:.08em;font-size:15px}.stmProg b{color:#ffd66b;letter-spacing:3px}",
      ".stmFlowTxt{margin:0 0 8px;font-size:22px;font-weight:900;text-align:center}.stmFlowTxt b{font-size:15px;letter-spacing:.06em}.stmFlowTxt small{font-size:12px;opacity:.75}",
      ".stmJet line{stroke:#7fe8ff;stroke-linecap:round;stroke-dasharray:12 9;animation:stmDash 1s linear infinite;opacity:0;stroke-width:3}@keyframes stmDash{to{stroke-dashoffset:-42}}",
      ".stmWheelG{transform-box:fill-box;transform-origin:center}.stmWheelG.go{animation:stmSpin 7s linear infinite}@keyframes stmSpin{to{transform:rotate(360deg)}}",
      ".stmSpeed{margin:0 0 8px;font-size:17px;font-weight:900;letter-spacing:.04em}.stmSpeed b{color:#ffd66b}.stmSpeed small{opacity:.7;font-size:12px}",
      ".stmEnergy{margin:0 0 8px;font-weight:900;letter-spacing:.06em;font-size:15px}.stmEnergy .stmBar{height:16px}.stmEnergy .stmBar i{background:linear-gradient(90deg,#ffd66b,#ff9d2f)}",
      ".stmChain{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:0 0 10px;font-size:12px;font-weight:900}.stmChain em{font-style:normal;opacity:.6}.stmChain span{padding:6px 8px;border-radius:10px;border:1px dashed rgba(255,255,255,.3);opacity:.6}.stmChain span.on{opacity:1;border:1px solid #ffd66b;background:rgba(255,214,107,.14)}",
      ".stmQ{margin:0 0 10px;font-size:17px;font-weight:800}.stmQ b{color:#ffd66b}",
      ".stmFlowRow{display:flex;align-items:center;justify-content:space-between;gap:2px;margin:0 0 6px}.stmFlowRow em{font-style:normal;opacity:.55;font-size:14px}",
      ".stmNode{flex:1;min-width:0;padding:6px 2px;border-radius:12px;border:1.5px dashed rgba(255,255,255,.25);text-align:center;opacity:.55}.stmNode i{display:block;font-style:normal;font-size:22px}.stmNode small{display:block;font-size:9.5px;font-weight:900;letter-spacing:.04em}",
      ".stmNode.lit{opacity:1;border-style:solid;border-color:#7ff0ff;background:rgba(47,210,255,.15)}.stmNode.lit small::after{content:\" ✓\"}",
      ".stmRiver{height:12px;margin:0 0 10px;border-radius:8px;background:rgba(255,255,255,.08);overflow:hidden}.stmRiver i{display:block;height:100%;width:0;background:repeating-linear-gradient(90deg,#2fd2ff 0 14px,#7ff0ff 14px 22px);background-size:44px 100%;animation:stmRiv 1s linear infinite;transition:width .4s}@keyframes stmRiv{to{background-position:44px 0}}",
      ".stmRiver.f1 i{width:30%}.stmRiver.f2 i{width:60%}.stmRiver.f3 i{width:80%}.stmRiver.f4 i{width:100%}.stmRiver.f5 i{width:100%;animation-duration:.35s}",
      ".stmLife{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}.stmLife div{padding:10px;border-radius:14px;border:1.5px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);display:grid;grid-template-columns:auto 1fr;column-gap:8px;align-items:center}",
      ".stmLife i{grid-row:span 2;font-style:normal;font-size:28px}.stmLife b{font-size:13px;letter-spacing:.08em}.stmLife span{font-size:13px;font-weight:800}.stmLife .good{border-color:#8dffb0}.stmLife .bad{border-color:#ffb36b}.stmLife .glow{box-shadow:0 0 18px #8dffb0;animation:stmGlow 1.2s ease-in-out infinite}@keyframes stmGlow{50%{box-shadow:0 0 6px #8dffb0}}",
      /* quiz */
      ".stmQuizQ{margin:0 0 12px;font-size:clamp(20px,5vw,24px);font-weight:900;line-height:1.25}.stmQN{font-size:12px;font-weight:900;letter-spacing:.14em;color:#7ff0ff;margin-bottom:4px}",
      ".stmOpt{display:flex;align-items:center;gap:12px;width:100%;min-height:60px;margin:0 0 8px;padding:10px 14px;border-radius:14px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.07);color:#fff;font:800 18px/1.2 inherit;text-align:left;cursor:pointer}",
      ".stmOpt i{flex:0 0 auto;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-style:normal;background:rgba(47,210,255,.2);font-size:16px}.stmOpt.right{border-color:#8dffb0;background:rgba(141,255,176,.18)}.stmOpt.try{opacity:.55}",
      ".stmFeed{min-height:48px;margin:6px 0;font-size:16px;font-weight:800}",
      /* complete */
      ".stmWow{text-align:center;margin:6px 0 10px;padding:16px 8px;border-radius:18px;background:radial-gradient(100% 100% at 50% 0,rgba(47,210,255,.25),rgba(243,16,186,.1));border:1px solid rgba(47,210,255,.4);overflow:hidden;position:relative}",
      ".stmChainW{display:flex;justify-content:center;gap:6px;font-size:clamp(30px,9vw,44px)}.stmChainW span{opacity:0;animation:stmPop .5s ease forwards}@keyframes stmPop{from{opacity:0;transform:scale(.3) translateY(10px)}to{opacity:1;transform:none}}",
      ".stmWow p{margin:8px 0 0;font-size:18px;font-weight:900}",
      ".stmBadge{display:flex;align-items:center;gap:12px;margin:10px 0;padding:14px;border-radius:16px;border:2px solid #ffd66b;background:rgba(255,214,107,.12)}.stmBadge i{font-style:normal;font-size:46px}.stmBadge b{display:block;font-size:18px;letter-spacing:.06em}.stmBadge small{font-size:14px;opacity:.85}",
      ".stmSum{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:0 0 8px}.stmSum div{padding:8px 2px;text-align:center;border-radius:12px;background:rgba(255,255,255,.06);font-size:11px;font-weight:900;letter-spacing:.04em}.stmSum b{display:block;font-size:15px;color:#7ff0ff}",
      ".stmConf{position:absolute;top:-10%;font-size:20px;animation:stmFall 2.4s linear forwards;pointer-events:none}@keyframes stmFall{to{transform:translateY(260px) rotate(200deg);opacity:0}}",
      /* hub + master */
      ".stmHubXp{display:flex;align-items:center;gap:12px;margin:0 0 10px;padding:12px;border-radius:16px;border:1px solid rgba(47,210,255,.4);background:rgba(47,210,255,.08);font-weight:900}.stmHubXp b{font-size:26px;color:#7ff0ff}",
      ".stmGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px}",
      ".stmCard{min-height:104px;padding:10px;border-radius:16px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font:inherit;text-align:center;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}",
      ".stmCard i{font-style:normal;font-size:30px}.stmCard b{font-size:13px;letter-spacing:.05em}.stmCard small{font-size:12px;font-weight:800;color:#7ff0ff}",
      ".stmCard.done{border-color:#ffd66b;background:rgba(255,214,107,.1)}.stmCard.done small{color:#ffd66b}.stmCard.lock{opacity:.6}.stmCard.lock small{color:rgba(238,252,255,.7)}",
      ".stmMasterCard{grid-column:1/-1;border-color:#ffd66b;background:linear-gradient(90deg,rgba(255,214,107,.18),rgba(243,16,186,.14))}",
      ".stmCareerBtn{width:100%;min-height:52px;margin:0 0 8px;border-radius:14px;border:1.5px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:#fff;font:900 15px/1.1 inherit;letter-spacing:.06em;cursor:pointer}",
      ".stmCareers{display:none;gap:8px;margin:0 0 12px}.stmCareers.show{display:grid}.stmCareers div{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12)}.stmCareers i{font-style:normal;font-size:28px}.stmCareers b{display:block;font-size:15px;letter-spacing:.04em}.stmCareers span{font-size:14px;opacity:.9}",
      ".stmMaster{text-align:center}.stmMaster h2{margin:4px 0 2px;font-size:clamp(22px,6vw,30px);letter-spacing:.05em;background:linear-gradient(90deg,#7ff0ff,#f39cff);-webkit-background-clip:text;background-clip:text;color:transparent}",
      ".stmTrophy{font-size:64px;line-height:1.1}.stmQuote{margin:8px 0 12px;font-size:16px;font-weight:700;line-height:1.4}",
      ".stmBadgeList{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:6px;text-align:left}.stmBadgeList li{padding:10px 12px;border-radius:12px;background:rgba(255,214,107,.1);border:1px solid rgba(255,214,107,.5);font-size:16px;font-weight:900;letter-spacing:.04em}",
      ".stmJourney{display:flex;align-items:center;justify-content:space-between;margin:10px 0 4px;position:relative}.stmJourney::before{content:\"\";position:absolute;left:6%;right:6%;top:50%;height:6px;margin-top:-3px;border-radius:4px;background:repeating-linear-gradient(90deg,#2fd2ff 0 14px,#7ff0ff 14px 22px);background-size:44px 100%;animation:stmRiv 1s linear infinite}",
      ".stmJourney span{position:relative;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:#0b1a3a;border:2px solid #7ff0ff;box-shadow:0 0 12px rgba(47,210,255,.5)}",
      ".stmJNames{display:flex;justify-content:space-between;font-size:9.5px;font-weight:900;letter-spacing:.02em;margin:0 0 12px}.stmJNames span{flex:1;text-align:center}",
      ".stmLock{text-align:center;padding:24px 8px}.stmLock i{display:block;font-style:normal;font-size:56px}.stmLock p{font-size:18px;font-weight:800}",
      /* V2.2 */
      ".stmSteps:empty{display:none}",
      ".stmCoach{display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid rgba(47,210,255,.2);background:rgba(47,210,255,.06)}",
      ".stmCoach .stmAv{width:40px;height:40px;font-size:22px}.stmCoach .stmBubble{padding:5px 9px;border-radius:4px 12px 12px 12px;font-size:14px;line-height:1.25;max-height:3.9em;overflow:hidden}.stmCoach .stmBubble small{font-size:9.5px;margin:0}",
      ".stmWhyBtn,.stmCoachBtn{flex:0 0 auto;min-width:48px;min-height:48px;border-radius:14px;border:1.5px solid #ffd66b;background:rgba(255,214,107,.14);color:#fff;font:900 12px/1 inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:0 6px}",
      ".stmWhyBtn span{font-size:18px}.stmCoachBtn{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.07);font-size:22px}.stmCoach.off .stmAv{filter:grayscale(1);opacity:.6}.stmCoachBtn[aria-pressed=false]{opacity:.6}",
      ".stmWhyBtn:focus-visible,.stmCoachBtn:focus-visible,.stmSecondary:focus-visible{outline:3px solid #ffd66b;outline-offset:2px}",
      ".stmWhy{margin:0;padding:8px 12px;border-top:1px solid rgba(255,214,107,.5);background:rgba(255,214,107,.1);font-size:14.5px;font-weight:700;line-height:1.3}.stmWhy[hidden]{display:none}.stmWhy b{display:block;font-size:10.5px;letter-spacing:.14em;color:#ffd66b}",
      ".stmSecondary{width:100%;min-height:52px;margin:6px 0 4px;border-radius:14px;border:1.5px solid #7ff0ff;background:rgba(47,210,255,.12);color:#fff;font:900 15px/1.1 inherit;letter-spacing:.04em;cursor:pointer;padding:8px 12px}",
      ".stmSlide{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-size:11px;font-weight:900;letter-spacing:.08em;color:#7ff0ff}",
      ".stmRange{flex:1;min-width:0;height:44px;accent-color:#2fd2ff;cursor:pointer;background:transparent}",
      ".stmRange::-webkit-slider-runnable-track{height:12px;border-radius:8px;background:rgba(255,255,255,.18)}.stmRange::-webkit-slider-thumb{-webkit-appearance:none;width:34px;height:34px;margin-top:-11px;border-radius:50%;background:linear-gradient(145deg,#7ff0ff,#2fd2ff);border:3px solid #fff}",
      ".stmRange::-moz-range-track{height:12px;border-radius:8px;background:rgba(255,255,255,.18)}.stmRange::-moz-range-thumb{width:30px;height:30px;border-radius:50%;background:#2fd2ff;border:3px solid #fff}",
      ".stmWallG.wobble{animation:stmWobble .35s ease-in-out infinite}@keyframes stmWobble{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.5px)}75%{transform:translateX(1.5px)}}",
      ".stmFlowMeter{margin:0 0 8px}.stmFM{font:900 15px/1.2 ui-monospace,monospace;letter-spacing:.04em;margin-bottom:4px}.stmFlowBar{position:relative;height:16px}.stmFlowBar u{position:absolute;top:-3px;bottom:-3px;width:4px;margin-left:-2px;background:#ffd66b;border-radius:2px}.stmFlowBar u[hidden]{display:none}",
      ".stmChain5{display:flex;flex-direction:column;gap:2px;margin:0 0 8px;font-size:12.5px;font-weight:900;align-items:stretch}.stmChain5 em{font-style:normal;text-align:center;opacity:.5;line-height:.9}.stmChain5 span{padding:5px 10px;border-radius:10px;border:1px dashed rgba(255,255,255,.3);opacity:.6}.stmChain5 span.on{opacity:1;border:1px solid #ffd66b;background:rgba(255,214,107,.14)}",
      ".stmTown{display:flex;gap:6px;justify-content:space-between;margin:0 0 4px}.stmHome{flex:1;text-align:center;padding:6px 0;border-radius:12px;border:1.5px dashed rgba(255,255,255,.25);opacity:.7}.stmHome i{display:block;font-style:normal;font-size:24px}.stmHome b{display:block;font-size:16px}.stmHome.lit{opacity:1;border:1.5px solid #ffd66b;background:rgba(255,214,107,.18);box-shadow:0 0 14px rgba(255,214,107,.5)}",
      ".stmTownTxt{margin:0 0 8px;font-size:13px;font-weight:900;letter-spacing:.1em;color:#ffd66b}",
      ".stmHealthy{margin:0 0 8px;padding:8px;text-align:center;border-radius:12px;border:1.5px solid #8dffb0;background:rgba(141,255,176,.14);font-weight:900;letter-spacing:.08em;font-size:16px}.stmHealthy[hidden]{display:none}",
      ".stmLife{grid-template-columns:repeat(2,minmax(0,1fr))}.stmLife div{min-width:0;grid-template-columns:auto minmax(0,1fr)}.stmLife span{font-size:12px;overflow-wrap:anywhere}.stmLife b{font-size:11px;letter-spacing:.02em;overflow-wrap:anywhere}.stmLife i{font-size:24px}",
      ".stmScn{margin:0 0 6px;font-size:clamp(20px,5.4vw,25px);font-weight:900;line-height:1.2}",
      ".stmSimMeter{margin:0 0 10px}.stmSimLbl{font-size:13px;font-weight:900;letter-spacing:.06em}.stmSimLbl b{color:#ffd66b;margin-left:6px}.stmSimBar{height:16px}.stmSimBar i{transition:width .9s ease;background:linear-gradient(90deg,#2fd2ff,#ffd66b 70%,#ff7b7b)}",
      ".stmRank{margin:6px 0;padding:10px 12px;border-radius:12px;border:1px solid rgba(127,240,255,.45);background:rgba(47,210,255,.08);font-size:14px;font-weight:800;letter-spacing:.04em}.stmRank b{color:#7ff0ff}",
      ".stmCareerCard{display:flex;gap:10px;align-items:center;margin:6px 0;padding:10px 12px;border-radius:14px;border:1px dashed rgba(255,255,255,.3);background:rgba(255,255,255,.04);font-size:14px}.stmCareerCard i{font-style:normal;font-size:30px}.stmCareerCard small{display:block;font-size:9.5px;letter-spacing:.14em;color:#7ff0ff}.stmCareerCard b{display:block;font-size:14px}",
      ".stmJourney7{display:flex;align-items:center;justify-content:space-between;margin:10px 0 4px;position:relative}.stmJourney7::before{content:\"\";position:absolute;left:5%;right:5%;top:50%;height:6px;margin-top:-3px;border-radius:4px;background:repeating-linear-gradient(90deg,#2fd2ff 0 14px,#7ff0ff 14px 22px);background-size:44px 100%;animation:stmRiv 1s linear infinite}",
      ".stmJourney7 span{position:relative;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-size:19px;background:#0b1a3a;border:2px solid #7ff0ff;box-shadow:0 0 12px rgba(47,210,255,.5)}",
      ".stmTravel{position:absolute;left:3%;top:50%;margin-top:-13px;z-index:2;text-decoration:none;font-size:24px;animation:stmTravel 4.5s ease-in-out infinite}@keyframes stmTravel{0%{left:3%}100%{left:90%}}",
      ".stmFinale{margin:10px 0;text-align:center}.stmFinale b{display:block;font-size:clamp(16px,4.6vw,21px);letter-spacing:.05em;background:linear-gradient(90deg,#7ff0ff,#f39cff);-webkit-background-clip:text;background-clip:text;color:transparent}",
      ".stmFreeChip{margin:8px 0;padding:12px;text-align:center;border-radius:14px;border:2px solid #8dffb0;background:rgba(141,255,176,.12);font-weight:900;letter-spacing:.06em}",
      "@media(max-width:480px){.stmNode{overflow:hidden;padding:6px 0}.stmNode small{font-size:7.5px;letter-spacing:0}.stmFlowRow em{font-size:11px}.stmSteps{gap:3px;padding:6px 6px}.stmCoach .stmBubble small{display:none}.stmChain5{font-size:11.5px}}",
      "@media(max-height:620px){.stmCoach .stmAv{display:none}.stmWhy{font-size:13px;padding:6px 10px}}",
      "@media(max-width:700px){.stmHT small{display:none}.stmXp{padding:6px 9px;font-size:14px}.stmHead{padding:8px 10px}.stmClose{min-width:48px}}",
      "@media(max-width:480px){.stmXl{display:none}.stmStep{font-size:8.5px;letter-spacing:0;padding:4px 0;overflow:hidden}.stmRow.c5{grid-template-columns:repeat(3,1fr)}.stmRow.c6{grid-template-columns:repeat(3,1fr)}.stmStep{font-size:10px}.stmCycle span{font-size:8.5px}}",
      "@media(min-width:760px){.stmBody{padding:16px 22px}.stmBody>*{max-width:720px;margin-left:auto;margin-right:auto}.stmFoot>*{max-width:720px;display:block;margin:0 auto}}",
      "@media(max-height:560px){.stmViz{max-height:26vh}.stmHT small{display:none}}",
      "@media(prefers-reduced-motion:reduce){.stmLab *,.stmTopBtn *{animation:none!important;transition:none!important}.stmTravel{left:48%}.stmChainW span{opacity:1!important}.stmToast{opacity:1}}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- overlay shell, mounted inside the DAM Map frame so it never leaves the playable area ---------- */
  var lab=null,V={mode:null,id:null,phase:null},ctx=null,returnFocus=null,lastWhy="",lastSay=0;
  function shell(){var p=$("geiDamMapPage");return p&&p.querySelector(".dmwShell");}

  /* Wilbert, the DAM Guide: an optional coach. Reactions are throttled and can be switched off; 💡 WHY? always works. */
  function coachOn(){try{return localStorage.getItem("geiStemCoach.v1")!=="off";}catch(e){return true;}}
  function setCoach(on){try{localStorage.setItem("geiStemCoach.v1",on?"on":"off");}catch(e){}paintCoach();}
  function paintCoach(){
    var c=$("stmCoach");if(!c)return;var on=coachOn(),b=$("stmCoachBtn");
    c.classList.toggle("off",!on);b.setAttribute("aria-pressed",on);b.setAttribute("aria-label",on?"Wilbert coach is on. Tap to rest him.":"Wilbert coach is resting. Tap to wake him.");
    if(!on)$("stmBubbleTxt").textContent="Wilbert is resting. Tap 💡 WHY? any time.";
  }
  function say(msg,force){if(!force&&!coachOn())return;var t=$("stmBubbleTxt");if(t)t.textContent=msg;}
  function wilbert(msg){var n=Date.now();if(n-lastSay<3500)return;lastSay=n;say(msg);}
  function showWhy(key){
    var text=key?G.why[key]:"";if(key&&!text)return;
    if(text){lastWhy=text;var w=$("stmWhy");if(w){w.hidden=false;w.innerHTML='<b>💡 WHY DID THAT HAPPEN?</b><span>'+esc(text)+'</span>';}}
  }
  function askWhy(){
    var st=V.id&&G.stations[V.id],msg=lastWhy||(st?st.realWorld:"Tap things in the lab and I'll explain what happened!");
    say("💡 "+msg,true);if(lastWhy)showWhy();
  }

  function mount(){
    if(lab&&lab.isConnected)return lab;
    var sh=shell();if(!sh)return null;
    styles();
    lab=document.createElement("div");lab.className="stmLab";lab.id="stmLab";lab.setAttribute("role","dialog");lab.setAttribute("aria-modal","true");lab.setAttribute("aria-labelledby","stmTitle");lab.setAttribute("aria-hidden","true");
    lab.innerHTML='<div class="stmHead"><button type="button" class="stmClose" id="stmClose" aria-label="Back to the DAM Map">←</button>'+
      '<div class="stmHT"><b id="stmTitle"></b><small id="stmSub"></small></div><div class="stmXp" id="stmXp" aria-live="polite"></div></div>'+
      '<div class="stmSteps" id="stmSteps" role="tablist" aria-label="Lab steps"></div>'+
      '<div class="stmCoach" id="stmCoach"><div class="stmAv" aria-hidden="true">🦫<img alt="" src="'+GUIDE_IMG+'" onerror="this.remove()"></div>'+
      '<div class="stmBubble"><small>WILBERT · DAM GUIDE</small><span id="stmBubbleTxt" aria-live="polite"></span></div>'+
      '<button type="button" class="stmWhyBtn" id="stmWhyBtn" aria-label="Why? Wilbert explains"><span aria-hidden="true">💡</span><b>WHY?</b></button>'+
      '<button type="button" class="stmCoachBtn" id="stmCoachBtn" aria-pressed="true"><span aria-hidden="true">🦫</span></button></div>'+
      '<div class="stmBody" id="stmBody" tabindex="-1"></div><div class="stmWhy" id="stmWhy" role="status" aria-live="polite" hidden></div>'+
      '<div class="stmFoot"><button type="button" class="stmPrimary" id="stmPrimary"></button></div>';
    sh.appendChild(lab);
    $("stmClose").addEventListener("click",closeLab);
    $("stmWhyBtn").addEventListener("click",askWhy);
    $("stmCoachBtn").addEventListener("click",function(){setCoach(!coachOn());});
    paintCoach();
    lab.addEventListener("keydown",function(e){if(e.key==="Escape"){e.preventDefault();e.stopPropagation();closeLab();}});
    return lab;
  }
  function clearLab(){if(ctx){ctx.dead=true;ctx.timers.forEach(function(t){clearTimeout(t);clearInterval(t);});}ctx=null;}
  function makeCtx(host,mode){
    var c={host:host,mode:mode,reduced:reduced(),dead:false,timers:[],_done:false};
    c.alive=function(){return !c.dead&&host.isConnected;};
    c.every=function(fn,ms){var t=setInterval(function(){if(c.alive())fn();},ms);c.timers.push(t);return t;};
    c.after=function(fn,ms){var t=setTimeout(function(){if(c.alive())fn();},ms);c.timers.push(t);return t;};
    c.sfx=sfx;c.say=say;c.wilbert=wilbert;c.why=showWhy;
    c.done=function(){if(c._done)return;c._done=true;if(c.onDone)c.onDone();};
    return c;
  }
  function setXpBadge(gain){
    var x=$("stmXp");if(!x)return;x.innerHTML='💧 <b>'+xp()+'</b><span class="stmXl"> STEM XP</span>';
    if(gain){var t=document.createElement("span");t.className="stmToast";t.textContent="+"+gain+" 💧 STEM XP";x.appendChild(t);setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t);},2300);}
    refreshTopBtn();
  }
  function reward(id,k){
    var n=award(id,k);
    if(n){sfx("xp");setXpBadge(n);}
    return n;
  }
  function badgeCount(){return core().filter(badgeEarned).length;}
  function rank(){return G.ranks[clamp(badgeCount(),0,G.ranks.length-1)];}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}

  /* ---------- open / close ---------- */
  function openLab(){
    var l=mount();if(!l)return false;
    var was=l.classList.contains("show");
    if(!was)returnFocus=document.activeElement;
    l.classList.add("show");l.setAttribute("aria-hidden","false");return true;
  }
  function closeLab(){
    clearLab();V.mode=null;
    if(lab){lab.classList.remove("show");lab.setAttribute("aria-hidden","true");}
    refreshMap();
    try{if(returnFocus&&returnFocus.focus&&returnFocus.isConnected)returnFocus.focus({preventScroll:true});}catch(e){}
  }

  function stepsBar(id,cur){
    var h="";
    var reach=[true,flag(id,"discover"),flag(id,"experiment"),flag(id,"challenge"),flag(id,"quiz"),flag(id,"challenge")];
    PHASES.forEach(function(p,i){
      var done=i<4?flag(id,FLAG[p[0]]):i===4?badgeEarned(id):false,on=p[0]===cur;
      h+='<button type="button" role="tab" class="stmStep'+(done?" done":"")+(on?" now":"")+'" data-p="'+p[0]+'" aria-selected="'+on+'"'+(reach[i]?"":" disabled")+'>'+
        '<i aria-hidden="true">'+(done?"✓":p[2])+'</i>'+p[1]+'</button>';
    });
    $("stmSteps").innerHTML=h;
  }
  function primary(txt,fn,disabled){
    var b=$("stmPrimary"),n=b.cloneNode(false);n.textContent=txt;n.disabled=!!disabled;b.parentNode.replaceChild(n,b);
    n.addEventListener("click",fn);return n;
  }

  function entryPhase(id){
    if(!flag(id,"discover"))return "discover";if(!flag(id,"experiment"))return "experiment";
    if(!flag(id,"challenge"))return "mission";if(!flag(id,"quiz"))return "prove";return "complete";
  }

  function openStation(id,phase){
    var st=G.stations[id];if(!st||!openLab())return;
    clearLab();V={mode:"station",id:id,phase:null};lastWhy="";
    $("stmTitle").textContent=st.icon+" "+st.title;$("stmSub").textContent=st.subtitle+" · "+st.topic;
    setXpBadge();
    if(!unlocked(id)&&!(phase==="free"&&master()))return renderLocked(id);
    go(phase||entryPhase(id));
    try{$("stmBody").focus({preventScroll:true});}catch(e){}
  }
  function renderLocked(id){
    var st=G.stations[id],body=$("stmBody");V.phase="locked";stepsBar(id,"");[].forEach.call($("stmSteps").children,function(b){b.disabled=true;});
    $("stmWhy").hidden=true;
    say("This lab opens when you reach "+st.title.toLowerCase()+" on the DAM Map. Keep playing — the water is on its way!");
    body.innerHTML='<div class="stmLock"><i aria-hidden="true">🔒</i><p>'+st.icon+' '+esc(st.title)+'<br>unlocks as you travel the DAM Map.</p></div>';
    primary("🗺️ BACK TO MAP",closeLab);
  }

  function go(phase){
    clearLab();V.phase=phase;lastWhy="";
    var id=V.id,st=G.stations[id],body=$("stmBody");
    $("stmWhy").hidden=true;$("stmWhy").innerHTML="";
    stepsBar(id,phase);body.scrollTop=0;body.onclick=null;
    if(phase==="discover")return viewDiscover(st,body);
    if(phase==="experiment")return viewLab(st,body,"experiment");
    if(phase==="mission")return viewLab(st,body,"mission");
    if(phase==="prove")return viewDecide(st,body);
    if(phase==="free")return viewFree(st,body);
    return viewComplete(st,body);
  }

  function viewDiscover(st,body){
    say(st.discover.guide);
    body.innerHTML='<div class="stmSec">💡 DISCOVER</div><p class="stmLearn">'+esc(st.discover.text)+'</p>'+
      '<ul class="stmFacts">'+st.discover.facts.map(function(f){return '<li>'+esc(f)+'</li>';}).join("")+'</ul>'+
      '<div class="stmNote real"><b>🔬 REAL-WORLD STEM</b>'+esc(st.realWorld)+'</div>'+
      '<div class="stmNote gei"><b>🎮 GEI GAME STORY</b>'+esc(st.gei)+'</div>';
    primary("💧 TRY IT",function(){reward(st.id,"discover");sfx("tap");go("experiment");});
  }

  function viewLab(st,body,mode){
    var isExp=mode==="experiment",def=isExp?st.experiment:st.challenge,k=isExp?"experiment":"challenge";
    say(isExp?"Your turn! Change something and watch what happens.":"Mission time! You can do this.");
    body.innerHTML='<div class="stmSec">'+(isExp?"🧪 EXPERIMENT":"🎯 MISSION")+'</div><p class="stmPrompt">'+esc(isExp?def.prompt:def.title)+'</p><div id="stmLabHost"></div>';
    var host=$("stmLabHost"),fn=G.labs[def.lab],c=ctx=makeCtx(host,mode);
    var nextLabel=isExp?"🎯 START MISSION ▸":"🧭 WHAT WOULD YOU DO? ▸",nextPhase=isExp?"mission":"prove";
    var already=flag(st.id,k);
    primary(already?nextLabel:(isExp?"🧪 DO THE EXPERIMENT":"🎯 COMPLETE THE MISSION"),function(){go(nextPhase);},!already);
    c.onDone=function(){
      var n=reward(st.id,k);
      if(n){sfx("good");}
      var b=$("stmPrimary");b.disabled=false;b.textContent=nextLabel;stepsBar(st.id,V.phase);
    };
    if(typeof fn==="function")fn(c);else host.textContent="Lab coming soon.";
    sfx("tap");
  }

  /* 🛠️ FREE PLAY — unlocked once the mission is done: no timer, no goal, no wrong answer, no XP */
  function viewFree(st,body){
    say("Free play! Build, pour, test, change — and test again. Nothing can go wrong here.");
    body.innerHTML='<div class="stmSec">🛠️ FREE PLAY</div><p class="stmPrompt">BUILD → POUR → TEST → CHANGE → TEST AGAIN</p><div id="stmLabHost"></div>';
    var host=$("stmLabHost"),fn=G.labs[st.experiment.lab];ctx=makeCtx(host,"free");
    primary("✅ DONE",function(){go(flag(st.id,"quiz")?"complete":entryPhase(st.id));});
    if(typeof fn==="function")fn(ctx);else host.textContent="Lab coming soon.";
  }

  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}

  /* 🧭 WHAT WOULD YOU DO? — DECISION → RESULT → EXPLANATION. Wrong choices are experiments, never failures. */
  function viewDecide(st,body){
    var d=st.decide;if(!d)return viewQuiz(st,body);
    var opts=shuffle(d.options),won=flag(st.id,"quiz");
    say("Pick what you'd do. I'll show you what really happens!");
    body.innerHTML='<div class="stmSec">🧭 WHAT WOULD YOU DO?</div><div class="stmScn">'+esc(d.scenario)+'</div><p class="stmPrompt">'+esc(d.sub)+'</p>'+
      '<div class="stmSimMeter"><div class="stmSimLbl">'+esc(d.meter.label)+' <b class="stmSimN">'+d.meter.from+'%</b></div><div class="stmBar stmSimBar" role="progressbar" aria-label="'+esc(d.meter.label)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+d.meter.from+'"><i style="width:'+d.meter.from+'%"></i></div></div>'+
      opts.map(function(o,i){return '<button type="button" class="stmOpt" data-i="'+i+'"><i aria-hidden="true">'+"ABC"[i]+'</i><span>'+esc(o.text)+'</span></button>';}).join("")+
      '<div class="stmFeed" role="status" aria-live="polite"></div>';
    primary(won?"🏆 FINISH":"CHOOSE WHAT YOU'D DO",function(){go("complete");},!won);
    body.onclick=function(e){
      var b=e.target.closest&&e.target.closest(".stmOpt");if(!b||b.disabled||V.phase!=="prove")return;
      var o=opts[+b.dataset.i],bar=body.querySelector(".stmSimBar i"),n=body.querySelector(".stmSimN"),feed=body.querySelector(".stmFeed");
      bar.style.transition="none";bar.style.width=d.meter.from+"%";void bar.offsetWidth;bar.style.transition="";
      bar.style.width=o.to+"%";bar.parentNode.setAttribute("aria-valuenow",o.to);n.textContent=o.to+"%"+(o.to>=90?" ⚠️":"");
      showWhy(o.why);sfx(o.ok?"good":"oops");
      if(o.ok){
        b.classList.add("right");[].forEach.call(body.querySelectorAll(".stmOpt"),function(x){x.disabled=true;});
        feed.textContent="✅ "+o.outcome;wilbert("Great decision, engineer!");
        reward(st.id,"quiz");stepsBar(st.id,"prove");primary("🏆 FINISH",function(){go("complete");});
      }else{
        b.disabled=true;b.classList.add("try");feed.textContent="💙 "+o.outcome+" Good experiment! Try another choice.";
      }
    };
  }

  /* fallback for stations that ship quiz questions but no decision mission */
  function viewQuiz(st,body){
    var qi=0,qs=st.quiz;
    function show(){
      var q=qs[qi],opts=shuffle(q.options.map(function(t,i){return {t:t,ok:i===q.answer};}));
      body.innerHTML='<div class="stmSec">🧠 PROVE IT</div><div class="stmQN">QUESTION '+(qi+1)+' OF '+qs.length+'</div><div class="stmQuizQ">'+esc(q.q)+'</div>'+
        opts.map(function(o,i){return '<button type="button" class="stmOpt" data-ok="'+(o.ok?1:0)+'"><i aria-hidden="true">'+"ABC"[i]+'</i><span>'+esc(o.t)+'</span></button>';}).join("")+'<div class="stmFeed" role="status" aria-live="polite"></div>';
      primary("ANSWER A QUESTION",function(){},true);body.scrollTop=0;
    }
    show();
    body.onclick=function(e){
      var b=e.target.closest&&e.target.closest(".stmOpt");if(!b||b.disabled||V.phase!=="prove")return;
      var feed=body.querySelector(".stmFeed");
      if(b.dataset.ok==="1"){
        sfx("good");b.classList.add("right");[].forEach.call(body.querySelectorAll(".stmOpt"),function(x){x.disabled=true;});feed.textContent="✅ "+qs[qi].why;
        if(qi<qs.length-1){primary("NEXT QUESTION ▸",function(){qi++;show();});}
        else{reward(st.id,"quiz");stepsBar(st.id,"prove");primary("🏆 FINISH",function(){go("complete");});}
      }else{sfx("oops");b.disabled=true;b.classList.add("try");feed.textContent="💙 Good try! Have another look and pick again.";}
    };
  }

  function confetti(box,list){
    if(reduced())return;
    for(var i=0;i<14;i++){var s=document.createElement("span");s.className="stmConf";s.textContent=list[i%list.length];s.style.left=(Math.random()*92)+"%";s.style.animationDelay=(Math.random()*1.2)+"s";box.appendChild(s);}
  }
  function viewComplete(st,body){
    var b=st.badge,earned=badgeEarned(st.id),m=master(),newMaster=m&&!store.seen,nxt=nextStation(st.id);
    var rd=st.reward,total=STEPS.reduce(function(a,k){return a+(flag(st.id,k)?rd[k]:0);},0),rk=rank();
    var car=earned&&st.career&&G.careers.filter(function(c){return c.name===st.career;})[0];
    say(earned?"ENGINEER MODE ACTIVATED! Look what you earned.":"Finish every step to earn your badge.");
    body.innerHTML='<div class="stmSec">🏆 REWARD</div>'+
      '<div class="stmWow" id="stmWow"><div class="stmChainW" aria-hidden="true">'+st.wow.chain.map(function(c,i){return '<span style="animation-delay:'+(i*.45)+'s">'+c+'</span>';}).join("")+'</div><p>'+esc(st.wow.line)+'</p></div>'+
      '<div class="stmSum">'+STEPS.map(function(k){return '<div>'+({discover:"💡",experiment:"🧪",challenge:"🎯",quiz:"🧭"}[k])+'<b>'+(flag(st.id,k)?"+"+rd[k]:"—")+'</b>'+({discover:"DISCOVER",experiment:"TEST",challenge:"MISSION",quiz:"DECIDE"}[k])+'</div>';}).join("")+'</div>'+
      '<div class="stmBadge"><i aria-hidden="true">'+(earned?b.icon:"🔒")+'</i><div><b>'+(earned?"🏅 "+esc(b.name):"BADGE LOCKED")+'</b><small>'+(earned?esc(b.desc):"Complete all four steps.")+'</small><small> · '+total+' 💧 STEM XP earned here</small></div></div>'+
      '<div class="stmRank" aria-label="Engineer rank">'+rk.icon+' ENGINEER RANK: <b>'+esc(rk.name)+'</b></div>'+
      (car?'<div class="stmCareerCard"><i aria-hidden="true">'+car.icon+'</i><span><small>OPTIONAL · WHO DOES THIS JOB?</small><b>'+esc(car.name.toUpperCase())+'</b>'+esc(car.line)+'</span></div>':"")+
      (flag(st.id,"challenge")?'<button type="button" class="stmSecondary" data-free="1">🛠️ FREE PLAY — build, pour, test, change!</button>':"");
    body.onclick=function(e){if(e.target.closest&&e.target.closest("[data-free]")){go("free");}};
    if(earned){confetti($("stmWow"),["💧","✨","🌊","⭐"]);sfx(newMaster?"master":"badge");}
    if(newMaster){primary("🏆 SEE MY FINAL REWARD ▸",function(){showMaster();});}
    else if(nxt&&earned){
      var ok=unlocked(nxt),ns=G.stations[nxt];
      primary(ok?"NEXT: "+ns.icon+" "+ns.title+" ▸":"🗺️ BACK TO MAP",function(){if(ok)openStation(nxt);else closeLab();});
    }else primary("🗺️ BACK TO MAP",closeLab);
  }

  /* ---------- hub + master ---------- */
  function openAcademy(){
    if(!openLab())return;clearLab();V={mode:"academy",id:null,phase:"hub"};
    $("stmTitle").textContent="💧 ENGINEERING WORLD";$("stmSub").textContent="From Mountain to Ocean";setXpBadge();
    $("stmSteps").innerHTML="";$("stmWhy").hidden=true;
    var body=$("stmBody"),m=master(),total=core().length,got=badgeCount(),rk=rank();
    say("Tap a lab to learn, experiment and earn badges. Each lab is on your DAM Map!");
    body.innerHTML='<div class="stmHubXp"><span aria-hidden="true">'+rk.icon+'</span><div><b>'+xp()+'</b> / '+maxXp()+' STEM XP<br><small>RANK: '+esc(rk.name)+' · '+got+' of '+total+' badges</small></div></div>'+
      '<div class="stmGrid">'+(m?'<button type="button" class="stmCard stmMasterCard" data-master="1"><i aria-hidden="true">🏆</i><b>'+esc(G.master.name)+' ✓</b><small>TAP TO CELEBRATE</small></button>':"")+
      ids().map(function(id){var s=G.stations[id],e=badgeEarned(id),u=unlocked(id);
        return '<button type="button" class="stmCard'+(e?" done":"")+(u?"":" lock")+'" data-id="'+id+'"><i aria-hidden="true">'+(e?s.badge.icon:u?s.icon:"🔒")+'</i><b>'+esc(s.badge.name)+'</b><small>'+(e?"✓ EARNED":u?"STEM "+pct(id)+"%":"🔒 LOCKED")+'</small></button>';}).join("")+'</div>'+
      (m?'<div class="stmLbl">🚀 FREE ENGINEERING MODE</div><div class="stmGrid">'+ids().map(function(id){var s=G.stations[id];return '<button type="button" class="stmCard" data-free="'+id+'"><i aria-hidden="true">'+s.icon+'</i><b>FREE PLAY</b><small>'+esc(s.title)+'</small></button>';}).join("")+'</div>':
        (ids().some(function(id){return flag(id,"challenge");})?'<div class="stmNote real"><b>🛠️ FREE PLAY</b>Finish a lab mission to unlock free play for it. Finish all six for FREE ENGINEERING MODE.</div>':""))+
      '<button type="button" class="stmCareerBtn" aria-expanded="false" aria-controls="stmCareers">👷 WHO WORKS WITH WATER? <span aria-hidden="true">▾</span></button>'+
      '<div class="stmCareers" id="stmCareers">'+G.careers.map(function(c){return '<div><i aria-hidden="true">'+c.icon+'</i><span><b>'+esc(c.name.toUpperCase())+'</b>'+esc(c.line)+'</span></div>';}).join("")+'</div>'+
      '<div class="stmNote real"><b>🔬 REAL-WORLD STEM</b>Water cycle, gravity, dams, reservoirs, flow, hydropower and ecosystems are real science.</div>'+
      '<div class="stmNote gei"><b>🎮 GEI GAME STORY</b>The GEI journey is the game\'s own story and imagination — not established science.</div>';
    body.onclick=function(e){
      var c=e.target.closest&&e.target.closest("[data-id]"),m2=e.target.closest&&e.target.closest("[data-master]"),cb=e.target.closest&&e.target.closest(".stmCareerBtn"),fr=e.target.closest&&e.target.closest("[data-free]");
      if(fr)openStation(fr.dataset.free,"free");else if(c)openStation(c.dataset.id);else if(m2)showMaster();
      else if(cb){var box=$("stmCareers"),on=!box.classList.contains("show");box.classList.toggle("show",on);cb.setAttribute("aria-expanded",on);}
    };
    primary("🗺️ BACK TO MAP",closeLab);body.scrollTop=0;
  }
  function showMaster(){
    if(!openLab())return;clearLab();V={mode:"master",id:null,phase:"master"};
    store.seen=1;save();
    $("stmTitle").textContent="💧 ENGINEERING WORLD";$("stmSub").textContent="From Mountain to Ocean";$("stmSteps").innerHTML="";$("stmWhy").hidden=true;setXpBadge();
    var body=$("stmBody"),ms=G.master,J=[["🏔️","MOUNTAIN"],["💧","RAIN"],["🧱","DAM"],["🌊","RESERVOIR"],["🚪","SLUICE"],["⚙️","TURBINE"],["🌎","OCEAN"]];
    say("ENGINEER MODE ACTIVATED!",true);
    body.innerHTML='<div class="stmMaster stmWow" id="stmWow"><div class="stmTrophy" aria-hidden="true">'+ms.icon+'</div><div class="stmSec">💧 '+esc(ms.world)+'</div><h2>'+esc(ms.name)+' 🏆</h2>'+
      '<p class="stmQuote">“'+esc(ms.line)+'”</p></div>'+
      '<ul class="stmBadgeList">'+core().map(function(id){var b=G.stations[id].badge;return '<li>'+b.icon+' '+esc(b.name)+' '+(badgeEarned(id)?"✓":"")+'</li>';}).join("")+'</ul>'+
      '<div class="stmJourney7" aria-hidden="true"><u class="stmTravel">💧</u>'+J.map(function(j){return '<span>'+j[0]+'</span>';}).join("")+'</div>'+
      '<div class="stmJNames">'+J.map(function(j){return '<span>'+j[1]+'</span>';}).join("")+'</div>'+
      '<p class="stmQuote" style="text-align:center;font-weight:900;letter-spacing:.04em">MOUNTAIN → DAM → RESERVOIR → SLUICE → WHEEL → OCEAN</p>'+
      '<div class="stmFinale"><b>'+esc(ms.finale[0])+'</b><b>'+esc(ms.finale[1])+'</b></div>'+
      '<div class="stmFreeChip">🚀 FREE ENGINEERING MODE UNLOCKED</div>'+
      '<div class="stmNote real"><b>💧 '+xp()+' STEM XP</b>Educational progress only — it never changes your game coins or purchases.</div>';
    body.onclick=null;
    confetti($("stmWow"),["🏆","💧","✨","🌎","⚙️"]);sfx("master");
    primary("🚀 OPEN FREE ENGINEERING MODE",openAcademy);body.scrollTop=0;
  }

  /* step-tab navigation (shared by all station views) */
  document.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest(".stmStep");
    if(t&&!t.disabled&&V.mode==="station"&&lab&&lab.contains(t)){sfx("tap");go(t.dataset.p);}
  });

  /* ---------- map integration ---------- */
  function tagFor(i){
    var id=G.order[i];if(!id)return null;
    if(badgeEarned(id))return {t:"STEM ✓",c:"done"};
    if(!unlocked(id))return {t:"STEM 🔒",c:"lock"};
    return {t:"STEM "+pct(id)+"%",c:""};
  }
  function decorate(){
    var box=$("geiMapRegions");if(!box)return;var changed=false;
    [].forEach.call(box.querySelectorAll(".dmwPill"),function(p){
      var tg=tagFor(+p.dataset.i);if(!tg)return;
      var sm=p.querySelector("small:not(.stmTag)"),old=p.querySelector(".stmTag");
      var html='💧 '+tg.t;
      if(old){if(old.textContent!==html){old.textContent=html;old.className="stmTag "+tg.c;changed=true;}return;}
      var span=document.createElement("small");span.className="stmTag "+tg.c;span.textContent=html;p.appendChild(span);
      p.setAttribute("aria-label",(p.getAttribute("aria-label")||"")+", "+tg.t.replace("🔒","locked")+", tap to open the STEM lab");changed=true;
    });
    if(changed){var pg=$("geiDamMapPage");if(pg&&pg.classList.contains("show"))try{window.dispatchEvent(new Event("resize"));}catch(e){}}
  }
  function refreshTopBtn(){
    var b=$("stmTopBtn");if(!b)return;
    b.innerHTML='<span aria-hidden="true">💧</span><span>STEM</span><b>'+xp()+'</b>';
    b.setAttribute("aria-label","DAM STEM Academy, "+xp()+" STEM XP, "+core().filter(badgeEarned).length+" of "+core().length+" badges");
  }
  function refreshMap(){decorate();refreshTopBtn();}
  function wire(){
    var top=document.querySelector("#geiDamMapPage .dmwTop"),box=$("geiMapRegions");
    if(!top||!box)return false;
    styles();
    if(!$("stmTopBtn")){
      var b=document.createElement("button");b.type="button";b.id="stmTopBtn";b.className="dmwBtn stmTopBtn";
      top.insertBefore(b,$("geiMapSound")||null);
      b.addEventListener("click",openAcademy);
    }
    if(!box.dataset.stmWired){
      box.dataset.stmWired="1";
      box.addEventListener("click",function(e){var p=e.target.closest&&e.target.closest(".dmwPill");if(p){var id=G.order[+p.dataset.i];if(id)openStation(id);}});
      new MutationObserver(decorate).observe(box,{childList:true});
    }
    watchMap();refreshMap();return true;
  }
  /* The map closing (BACK / Escape / milestone) must never leave a lab on screen. */
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&lab&&lab.classList.contains("show")){e.preventDefault();e.stopPropagation();closeLab();}},true);
  function watchMap(){
    var pg=$("geiDamMapPage");if(!pg||pg.dataset.stmWatch)return;pg.dataset.stmWatch="1";
    new MutationObserver(function(){if(!pg.classList.contains("show")&&lab&&lab.classList.contains("show")){clearLab();lab.classList.remove("show");lab.setAttribute("aria-hidden","true");V.mode=null;}})
      .observe(pg,{attributes:true,attributeFilter:["class"]});
  }

  function selfTest(){
    return {version:VERSION,stations:ids().length,sixStations:core().length===6,labsRegistered:ids().every(function(id){var s=G.stations[id];return typeof G.labs[s.experiment.lab]==="function"&&typeof G.labs[s.challenge.lab]==="function";}),
      quizzesOk:ids().every(function(id){var q=G.stations[id].quiz;return q.length>=1&&q.length<=3;}),xp:xp(),maxXp:maxXp(),master:master(),wired:!!$("stmTopBtn"),
      separateFromEconomy:true,storageKey:KEY};
  }
  var API=window.__GEI_STEM_ACADEMY_V1__=window.__GEI_ENGINEERING_WORLD_V22__={version:VERSION,rank:function(){return rank().name;},coach:function(){return coachOn();},open:openStation,openAcademy:openAcademy,showMaster:showMaster,close:closeLab,
    progress:function(){var o={xp:xp(),maxXp:maxXp(),master:master(),rank:rank().name,freeMode:master(),badges:core().filter(badgeEarned),stations:{}};ids().forEach(function(id){o.stations[id]={freePlay:flag(id,"challenge"),percent:pct(id),steps:STEPS.filter(function(k){return flag(id,k);}),badge:badgeEarned(id),unlocked:unlocked(id)};});return o;},
    selfTest:selfTest};

  function init(){wire();}
  init();window.addEventListener("load",function(){init();});
  document.addEventListener("DOMContentLoaded",init);
})();
