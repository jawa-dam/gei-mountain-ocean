/* V2.1.70 — DAM MAP WORLD ENGINE 🗺️💧 */
(function(){
  "use strict";
  if(window.__GEI_V2170_DAM_MAP__) return;
  var VERSION="V2.1.70";
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
  function n(v,d){v=Number(v);return Number.isFinite(v)?v:(d||0);}
  function st(){/* V2.1.89: index.html declares `const state` (not window.state); read it, never write it. */try{if(typeof state!=="undefined"&&state)return state;}catch(e){}return window.state||null;}
  function completed(){return Math.max(0,n(st()&&st().completedLevels,0));}
  function days(){var s=st();var reward=n(window.DAY_REWARD_FL_OZ,111);return s?Math.max(0,Math.min(6,Math.floor(n(s.levelFlOz,0)/Math.max(1,reward)))):0;}
  function totalDays(){return completed()*6+days();}
  function factories(){return Math.floor(completed()/6);}
  function regionIndex(){var t=totalDays();return t>0&&t%6===0?5:Math.min(5,t%6);}
  function factoryAt(i){return FACTORIES[i-1]||FACTORIES[FACTORIES.length-1];}
  function styles(){
    if(document.getElementById("geiDamMapV2170Styles"))return;
    var s=document.createElement("style");s.id="geiDamMapV2170Styles";
    s.textContent="#geiDamMapPage{position:fixed;inset:0;z-index:10050;display:none;align-items:center;justify-content:center;padding:12px;background:radial-gradient(circle at 50% 8%,rgba(47,210,255,.18),transparent 42%),linear-gradient(145deg,#07152b,#02050d 72%);color:#eefcff;font-family:inherit;box-sizing:border-box}"+
    "#geiDamMapPage.show{display:flex}.geiMapShell{width:min(1180px,100%);height:min(94vh,900px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(47,210,255,.35);border-radius:28px;background:rgba(4,10,23,.96);box-shadow:0 24px 90px rgba(0,0,0,.55),0 0 55px rgba(47,210,255,.12)}"+
    ".geiMapTop{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.1)}.geiMapBack{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#fff;border-radius:14px;padding:11px 14px;font:800 14px/1 inherit}.geiMapTitle{flex:1;min-width:0}.geiMapTitle b{display:block;font-size:clamp(19px,3vw,28px);letter-spacing:.06em}.geiMapTitle span{display:block;margin-top:3px;font-size:13px;opacity:.7}.geiMapStats{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}.geiMapStat{padding:8px 10px;border-radius:12px;background:rgba(47,210,255,.08);border:1px solid rgba(47,210,255,.2);font-size:11px;font-weight:800}.geiMapBody{min-height:0;flex:1;display:flex;flex-direction:column;overflow:hidden}.geiMapViewport{position:relative;min-height:260px;flex:1;overflow:hidden;background:linear-gradient(180deg,rgba(12,39,72,.5),rgba(1,8,18,.8))}"+
    ".geiMapWater{position:absolute;left:6%;right:6%;top:53%;height:14px;border-radius:999px;background:linear-gradient(90deg,#2fd2ff,#7aeaff,#3d3dea,#f310ba);box-shadow:0 0 22px rgba(47,210,255,.45);opacity:.8}.geiMapRegions{position:absolute;inset:10% 4% 18%;display:grid;grid-template-columns:repeat(6,1fr);gap:10px;align-items:center}.geiMapRegion{text-align:center;z-index:2}.geiMapNode{width:clamp(52px,8vw,82px);height:clamp(52px,8vw,82px);margin:auto;display:grid;place-items:center;border-radius:50%;font-size:clamp(24px,4vw,38px);background:rgba(5,13,30,.96);border:2px solid rgba(255,255,255,.15)}.geiMapRegion.unlocked .geiMapNode{border-color:rgba(47,210,255,.75);box-shadow:0 0 24px rgba(47,210,255,.3)}.geiMapRegion.current .geiMapNode{animation:geiMapPulse 1.5s ease-in-out infinite;border-color:#fff}.geiMapRegion.locked{opacity:.38;filter:grayscale(.7)}.geiMapRegionLabel{margin-top:8px;font-size:clamp(9px,1.3vw,13px);font-weight:900;letter-spacing:.05em}.geiMapRegionDesc{margin-top:3px;font-size:10px;opacity:.62}.geiMapTraveler{position:absolute;z-index:5;top:37%;transform:translate(-50%,-50%);transition:left .7s cubic-bezier(.2,.8,.2,1);pointer-events:none}.geiMapTravelerBubble{padding:7px 9px;border-radius:12px;background:#071224;border:1px solid rgba(255,255,255,.18);font-size:10px;font-weight:900;white-space:nowrap}.geiMapTravelerIcon{display:grid;place-items:center;width:44px;height:44px;margin:5px auto 0;border-radius:50%;background:linear-gradient(145deg,#2fd2ff,#3d3dea);border:2px solid #fff;box-shadow:0 0 24px rgba(47,210,255,.55);font-size:24px}.geiMapFactoryRail{height:145px;min-height:145px;padding:10px 14px 14px;overflow-x:auto;overflow-y:hidden;border-top:1px solid rgba(255,255,255,.08);background:rgba(1,5,13,.72)}.geiMapRailTitle{display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;font-weight:900;letter-spacing:.08em}.geiMapFactoryTrack{display:flex;gap:9px;min-width:max-content}.geiMapFactory{width:148px;height:88px;flex:0 0 auto;padding:10px;border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);box-sizing:border-box}.geiMapFactory.operational{border-color:rgba(47,210,255,.55);background:rgba(47,210,255,.08)}.geiMapFactory.future{opacity:.42}.geiMapFactory b{display:block;font-size:12px;line-height:1.1}.geiMapFactory span{display:block;margin-top:5px;font-size:20px}.geiMapFactory small{display:block;margin-top:3px;font-size:9px;opacity:.6}.geiMapMilestone{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.9);width:min(500px,88%);padding:24px;text-align:center;border:1px solid rgba(47,210,255,.5);border-radius:24px;background:rgba(2,8,20,.98);box-shadow:0 0 80px rgba(47,210,255,.22);opacity:0;pointer-events:none;transition:.25s ease;z-index:20}.geiMapMilestone.show{opacity:1;transform:translate(-50%,-50%) scale(1);pointer-events:auto}.geiMapMilestone h2{margin:0;font-size:clamp(22px,5vw,38px);letter-spacing:.05em}.geiMapMilestone p{margin:8px 0 16px;opacity:.75}.geiMapMilestone .factoryHero{font-size:58px}.geiMapMilestone button{border:0;border-radius:14px;padding:12px 18px;background:linear-gradient(90deg,#2fd2ff,#f310ba);color:#fff;font:900 14px/1 inherit;cursor:pointer}@keyframes geiMapPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08);box-shadow:0 0 35px rgba(47,210,255,.6)}}@media(max-width:700px){.geiMapStats{display:none}.geiMapShell{height:96vh;border-radius:20px}.geiMapRegions{inset:12% 2% 20%;gap:3px}.geiMapRegionDesc{display:none}.geiMapFactoryRail{height:132px;min-height:132px}.geiMapFactory{width:132px}}@media(prefers-reduced-motion:reduce){.geiMapRegion.current .geiMapNode{animation:none}.geiMapTraveler{transition:none}}";
    document.head.appendChild(s);
  }
  function button(){
    var dock=document.querySelector(".hudRight");
    if(!dock||document.getElementById("damMapTopBtn"))return;
    var b=document.createElement("button");b.className="iconBtn damTopAction";b.id="damMapTopBtn";b.type="button";b.setAttribute("aria-label","Open DAM Map");b.title="DAM Map";b.textContent="🗺️";
    dock.insertBefore(b,document.getElementById("fullscreenBtn")||null);b.addEventListener("click",open);
  }
  function page(){
    if(document.getElementById("geiDamMapPage"))return;
    var p=document.createElement("section");p.id="geiDamMapPage";p.setAttribute("aria-hidden","true");
    p.innerHTML="<div class=\"geiMapShell\" role=\"dialog\" aria-modal=\"true\"><div class=\"geiMapTop\"><button class=\"geiMapBack\" id=\"geiMapBack\" type=\"button\">← BACK</button><div class=\"geiMapTitle\"><b>DAM MAP 🗺️💧</b><span>Mountain → Dam → Millpond → Sluice-Gate → Waterwheel → Factory</span></div><div class=\"geiMapStats\"><span class=\"geiMapStat\" id=\"geiMapLevel\"></span><span class=\"geiMapStat\" id=\"geiMapFactories\"></span><span class=\"geiMapStat\" id=\"geiMapFlow\"></span></div></div><div class=\"geiMapBody\"><div class=\"geiMapViewport\"><div class=\"geiMapWater\"></div><div class=\"geiMapRegions\" id=\"geiMapRegions\"></div><div class=\"geiMapTraveler\" id=\"geiMapTraveler\"><div class=\"geiMapTravelerBubble\" id=\"geiMapTravelerBubble\">YOU ARE HERE</div><div class=\"geiMapTravelerIcon\" id=\"geiMapTravelerIcon\">🏔️</div></div><div class=\"geiMapMilestone\" id=\"geiMapMilestone\"></div></div><div class=\"geiMapFactoryRail\"><div class=\"geiMapRailTitle\"><span>FACTORY DISCOVERY</span><span id=\"geiMapNext\"></span></div><div class=\"geiMapFactoryTrack\" id=\"geiMapFactoryTrack\"></div></div></div></div>";
    document.body.appendChild(p);document.getElementById("geiMapBack").addEventListener("click",close);
  }
  function render(){
    styles();page();var s=st(),level=Math.max(1,n(s&&s.level,1)),done=days(),c=completed(),f=factories(),t=totalDays(),ri=regionIndex(),r=REGIONS[ri];
    document.getElementById("geiMapLevel").textContent="LEVEL "+level;document.getElementById("geiMapFactories").textContent=f+" FACTORIES";document.getElementById("geiMapFlow").textContent=t?"WATER: ACTIVE":"WATER: READY";
    document.getElementById("geiMapNext").textContent="NEXT FACTORY: LEVEL "+((f+1)*6);
    document.getElementById("geiMapRegions").innerHTML=REGIONS.map(function(x,i){var u=i<=ri;return "<div class=\"geiMapRegion "+(u?"unlocked":"locked")+" "+(i===ri?"current":"")+"\"><div class=\"geiMapNode\">"+x.icon+"</div><div class=\"geiMapRegionLabel\">"+x.label+"</div><div class=\"geiMapRegionDesc\">"+x.desc+"</div></div>";}).join("");
    var tr=document.getElementById("geiMapTraveler");tr.style.left=(ri*100/5)+"%";document.getElementById("geiMapTravelerIcon").textContent=r.icon;document.getElementById("geiMapTravelerBubble").textContent="YOU ARE HERE · "+r.label;
    document.getElementById("geiMapFactoryTrack").innerHTML=FACTORIES.map(function(x){return "<div class=\"geiMapFactory "+(x.index<=f?"operational":"future")+"\"><span>"+x.icon+"</span><b>"+x.name+"</b><small>"+(x.index<=f?"● OPERATIONAL":"LOCKED · LEVEL "+(x.index*6))+"</small></div>";}).join("");
  }
  function open(){styles();page();render();var p=document.getElementById("geiDamMapPage");p.classList.add("show");p.setAttribute("aria-hidden","false");placeTraveler();}
  /* V2.1.89 — display-only: pin the traveler over the current region node and keep its bubble on screen. */
  function placeTraveler(){try{var vp=document.querySelector("#geiDamMapPage .geiMapViewport"),tr=document.getElementById("geiMapTraveler"),node=document.querySelector("#geiMapRegions .geiMapRegion.current .geiMapNode"),bub=document.getElementById("geiMapTravelerBubble");if(!vp||!tr||!node||!bub)return;var v=vp.getBoundingClientRect(),r=node.getBoundingClientRect();if(!v.width||!r.width)return;tr.style.left=(r.left+r.width/2-v.left)+"px";bub.style.transform="";var b=bub.getBoundingClientRect(),dx=0;if(b.left<v.left+6)dx=v.left+6-b.left;else if(b.right>v.right-6)dx=v.right-6-b.right;if(dx)bub.style.transform="translateX("+Math.round(dx)+"px)";}catch(e){}}
  function close(){var p=document.getElementById("geiDamMapPage");if(p){p.classList.remove("show");p.setAttribute("aria-hidden","true");}}
  function milestone(level){
    styles();page();render();var f=factoryAt(level/6),p=document.getElementById("geiDamMapPage"),box=document.getElementById("geiMapMilestone");
    p.classList.add("show");p.setAttribute("aria-hidden","false");placeTraveler();
    box.innerHTML="<div class=\"factoryHero\">"+f.icon+"</div><h2>DAM MAP MILESTONE "+String(level/6).padStart(2,"0")+"</h2><p>LEVEL "+level+" COMPLETE · NEW FACTORY UNLOCKED</p><h3>"+f.name.toUpperCase()+"</h3><p>"+f.category+" · HYDRAULIC PRODUCTION ONLINE</p><button type=\"button\" id=\"geiMapMilestoneContinue\">CONTINUE TO BONUS WATERWHEEL</button>";
    box.classList.add("show");
    var go=function(){box.classList.remove("show");setTimeout(function(){try{window.openBonusWheel();}catch(e){}},220);};
    document.getElementById("geiMapMilestoneContinue").addEventListener("click",go,{once:true});setTimeout(go,5200);
  }
  function hook(){
    var b=document.getElementById("lcBtn");if(!b||b.dataset.geiMapHook==="1")return;b.dataset.geiMapHook="1";
    b.addEventListener("click",function(e){var s=st(),c=Math.max(0,n(s&&s.completedLevels,0)),l=Math.max(0,n(s&&s.level,0));if(c>=6&&c%6===0&&l===c){e.preventDefault();e.stopImmediatePropagation();milestone(c);}},true);
  }
  window.__GEI_V2170_DAM_MAP__={version:VERSION,regions:REGIONS,factories:FACTORIES,open:open,close:close,render:render,showMilestone:milestone,selfTest:function(){return {version:VERSION,sixRegions:REGIONS.length===6,factoryRegistry:FACTORIES.length>=24,sixLevelMilestones:true,derivedState:true,button:!!document.getElementById("damMapTopBtn"),page:!!document.getElementById("geiDamMapPage")};}};
  styles();button();page();hook();window.addEventListener("load",function(){button();page();hook();});window.addEventListener("resize",function(){var p=document.getElementById("geiDamMapPage");if(p&&p.classList.contains("show"))placeTraveler();});
})();