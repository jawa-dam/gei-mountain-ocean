/* V1 — DAM STEM ACADEMY · LABS 🧪
 * Small interactive experiments, one per station phase. Every lab is registered by name:
 *
 *   GEI_STEM.registerLab("name", function(ctx){ ... })
 *
 * ctx (provided by stem-academy-v1.js):
 *   host      the element to draw into            reduced   true when prefers-reduced-motion
 *   done()    the child finished this phase       say(msg)  DAM Guide speech bubble
 *   sfx(kind) "tap" | "good" | "oops" | "wow"     every(fn,ms) / after(fn,ms)  timers cleared automatically
 *   alive()   false once the lab is closed
 *
 * Labs only draw and animate inside `host`. They never read or write game state, FL OZ, XP or purchases.
 */
(function(){
  "use strict";
  var G=window.GEI_STEM; if(!G||!G.registerLab||G.labsLoaded)return; G.labsLoaded=true;
  var NS="http://www.w3.org/2000/svg";

  function btn(cls,html,attrs){return '<button type="button" class="stmBtn '+(cls||"")+'" '+(attrs||"")+'>'+html+'</button>';}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function el(h,sel){return h.querySelector(sel);}
  function say(ctx,txt){ctx.say(txt);}

  /* run fn(progress 0..1) over ms with requestAnimationFrame; stops when the lab closes */
  function run(ctx,ms,fn,end){
    if(ctx.reduced){fn(1);if(end)end();return;}
    var t0=null;
    (function step(ts){
      if(!ctx.alive())return;
      if(t0===null)t0=ts;
      var p=clamp((ts-t0)/ms,0,1);fn(p);
      if(p<1)requestAnimationFrame(step);else if(end)end();
    })(performance.now());
  }
  function dot(layer,r,cls){var c=document.createElementNS(NS,"circle");c.setAttribute("r",r);c.setAttribute("class",cls||"stmDrop");layer.appendChild(c);return c;}
  /* send n drops along an SVG path, staggered */
  function travel(ctx,layer,path,n,ms,end){
    var len=path.getTotalLength();
    if(ctx.reduced){path.classList.add("glow");ctx.after(function(){path.classList.remove("glow");if(end)end();},900);return;}
    var left=n;
    for(var i=0;i<n;i++){(function(i){
      var c=dot(layer,4);c.style.opacity=0;
      ctx.after(function(){
        run(ctx,ms,function(p){var pt=path.getPointAtLength(len*p);c.setAttribute("cx",pt.x);c.setAttribute("cy",pt.y);c.style.opacity=p<.04||p>.96?0:1;},
          function(){if(c.parentNode)c.parentNode.removeChild(c);if(--left===0&&end)end();});
      },i*(ms/n)*.6);
    })(i);}
  }
  function fall(ctx,layer,x,y0,y1,ms,cls){
    if(ctx.reduced)return;
    var c=dot(layer,3,cls||"stmDrop");c.setAttribute("cx",x);
    run(ctx,ms,function(p){c.setAttribute("cy",y0+(y1-y0)*p);},function(){if(c.parentNode)c.parentNode.removeChild(c);});
  }

  /* ================= 🏔️ MOUNTAIN — experiment ================= */
  var MTN_STREAM="M120 62 C140 95 168 108 190 134 C214 158 262 158 296 170";
  function mountainSvg(){
    return '<svg class="stmViz" viewBox="0 0 320 190" role="img" aria-label="A mountain with a stream running downhill to a lake">'+
      '<defs><linearGradient id="stmMt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e88bb"/><stop offset="1" stop-color="#3a3460"/></linearGradient></defs>'+
      '<polygon points="0,190 60,92 110,36 150,76 210,126 320,160 320,190" fill="url(#stmMt)"/>'+
      '<polygon class="stmSnow" points="88,58 110,36 132,58 122,54 112,64 102,54" fill="#f2fbff" opacity="0"/>'+
      '<path d="'+MTN_STREAM+'" class="stmStream"/>'+
      '<ellipse cx="300" cy="176" rx="22" ry="8" fill="#2fa8ff"/><text x="214" y="184" class="stmSvgLbl">🏞️ STREAM → RIVER</text>'+
      '<text class="stmCloud" x="82" y="26" font-size="30">☁️</text><text x="18" y="30" font-size="20" class="stmSvgLbl">⬆️ HIGH</text><text x="18" y="182" font-size="20" class="stmSvgLbl">⬇️ LOW</text>'+
      '<g class="drops"></g></svg>';
  }
  G.registerLab("mountain",function(ctx){
    var h=ctx.host;
    h.innerHTML=mountainSvg()+'<div class="stmStat" role="status" aria-live="polite">Tap the weather buttons.</div>'+
      '<div class="stmRow c3">'+btn("","☁️<b>RAIN</b>",'data-a="rain"')+btn("","❄️<b>SNOW</b>",'data-a="snow"')+btn("","💧<b>RUNOFF</b>",'data-a="runoff"')+'</div>'+
      '<div class="stmChecks" aria-label="Tried so far"><span data-c="rain">☁️ Rain</span><span data-c="snow">❄️ Snow</span><span data-c="runoff">💧 Runoff</span></div>';
    var svg=el(h,"svg"),layer=el(h,".drops"),path=el(h,".stmStream"),stat=el(h,".stmStat"),snow=el(h,".stmSnow"),used={},busy=false;
    function mark(a){used[a]=1;el(h,'[data-c="'+a+'"]').classList.add("on");if(used.rain&&used.snow&&used.runoff){stat.textContent="✅ Every drop went downhill! Gravity did that.";say(ctx,"See that? Rain, snow, runoff — it all ends up flowing downhill.");ctx.done();}}
    h.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest("[data-a]");if(!b||busy)return;
      var a=b.dataset.a;busy=true;ctx.sfx("tap");
      function finish(msg){stat.textContent=msg;mark(a);busy=false;}
      if(a==="rain"){
        stat.textContent="☁️ Rain falls on the mountain…";
        for(var i=0;i<7;i++)(function(i){ctx.after(function(){fall(ctx,layer,70+i*14,32,70+Math.abs(i-3)*8,700);},i*110);})(i);
        ctx.after(function(){stat.textContent="💧 The rain runs downhill!";travel(ctx,layer,path,5,2200,function(){finish("🌊 It gathered in the stream. Downhill!");});},900);
      }else if(a==="snow"){
        stat.textContent="❄️ Snow piles up on the peak…";snow.setAttribute("opacity","1");
        for(var j=0;j<6;j++)(function(j){ctx.after(function(){fall(ctx,layer,86+j*10,30,58,1100,"stmFlake");},j*140);})(j);
        ctx.after(function(){finish("❄️ Snow melts later. Then the meltwater runs downhill too!");},1700);
      }else{
        stat.textContent="💧 Runoff starts to move…";snow.setAttribute("opacity","0");
        travel(ctx,layer,path,7,2400,function(){finish("🌊 Runoff always flows to lower ground.");});
      }
    });
  });

  /* ================= 🏔️ MOUNTAIN — mission: pick the downhill path ================= */
  G.registerLab("mountain-path",function(ctx){
    var h=ctx.host,P={a:"M60 92 L150 28",b:"M60 92 L220 92",c:"M60 92 L170 150"};
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 190" role="img" aria-label="A raindrop on a slope with three possible paths: A up, B flat, C down to a stream">'+
      '<polygon points="0,190 0,92 60,92 170,152 320,160 320,190" fill="#3a3460"/><polygon points="150,28 175,10 200,28 200,40 150,40" fill="#4d4680"/>'+
      '<path d="'+P.a+'" class="stmPath" data-p="a"/><path d="'+P.b+'" class="stmPath" data-p="b"/><path d="'+P.c+'" class="stmPath" data-p="c"/>'+
      '<circle cx="60" cy="92" r="9" fill="#5fe6ff"/><text x="60" y="84" text-anchor="middle" font-size="16">💧</text>'+
      '<g class="stmMark"><circle cx="150" cy="22" r="11"/><text x="150" y="27" text-anchor="middle">A</text></g>'+
      '<g class="stmMark"><circle cx="228" cy="92" r="11"/><text x="228" y="97" text-anchor="middle">B</text></g>'+
      '<g class="stmMark"><circle cx="178" cy="156" r="11"/><text x="178" y="161" text-anchor="middle">C</text></g>'+
      '<ellipse cx="270" cy="172" rx="34" ry="9" fill="#2fa8ff"/><text x="270" y="152" text-anchor="middle" class="stmSvgLbl">🏞️ STREAM</text><g class="drops"></g></svg>'+
      '<div class="stmStat" role="status" aria-live="polite">Which way will the water travel? Pick a path.</div>'+
      '<div class="stmRow c1">'+btn("stmWide","<b>A</b> ⬆️ UP to the hilltop",'data-c="a"')+btn("stmWide","<b>B</b> ➡️ ALONG the flat ridge",'data-c="b"')+btn("stmWide","<b>C</b> ⬇️ DOWN to the stream",'data-c="c"')+'</div>';
    var layer=el(h,".drops"),stat=el(h,".stmStat"),won=false,busy=false;
    h.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest("[data-c]");if(!b||won||busy)return;
      var c=b.dataset.c,path=el(h,'.stmPath[data-p="'+c+'"]'),len=path.getTotalLength(),dropC=dot(layer,6),ok=c==="c";busy=true;ctx.sfx("tap");
      [].forEach.call(h.querySelectorAll(".stmPath"),function(p){p.classList.remove("pick");});path.classList.add("pick");
      run(ctx,1500,function(p){var q=ok?p:(p<.5?p*2*.55:(1-p)*2*.55),pt=path.getPointAtLength(len*q);dropC.setAttribute("cx",pt.x);dropC.setAttribute("cy",pt.y);},function(){
        busy=false;
        if(ok){won=true;b.classList.add("good");stat.textContent="✅ "+G.stations.mountain.challenge.success;ctx.sfx("good");say(ctx,"Yes! Downhill. Gravity does the work.");ctx.done();}
        else{if(dropC.parentNode)dropC.parentNode.removeChild(dropC);stat.textContent="🤔 Not that way — water can't climb up on its own. Try a path that goes lower!";ctx.sfx("oops");}
      });
    });
  });

  /* ================= 🧱 DAM — engineering lab ================= */
  var MATS=[
    {id:"concrete",icon:"🧱",name:"CONCRETE",s:100,tag:"Very strong"},
    {id:"rock",icon:"🪨",name:"ROCK",s:75,tag:"Strong"},
    {id:"wood",icon:"🌲",name:"WOOD",s:44,tag:"Medium"},
    {id:"soil",icon:"🟫",name:"SOIL",s:30,tag:"Soft"}
  ];
  var STEPS=["ASK","IMAGINE","PLAN","BUILD","TEST","IMPROVE"];
  function damLab(demand,mission){
    return function(ctx){
      var h=ctx.host,mat="concrete",thick=false,tests=0,busy=false,won=false,stage=0;
      h.innerHTML='<div class="stmCycle" aria-label="Engineering cycle">'+STEPS.map(function(s,i){return '<span data-s="'+i+'">'+s+'</span>';}).join("")+'</div>'+
        '<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="Water behind a dam wall">'+
        '<rect x="0" y="150" width="320" height="20" fill="#3b2a1a"/>'+
        '<rect class="stmWater" x="6" y="120" width="132" height="30" fill="#2fa8ff" opacity=".85"/>'+
        '<rect class="stmWall" x="138" y="80" width="16" height="70" rx="3" fill="#9aa4b8" stroke="#fff" stroke-width="2"/>'+
        '<path class="stmCrack" d="M146 90 l5 14 -6 12 6 14" fill="none" stroke="#ff7b7b" stroke-width="3" opacity="0"/>'+
        '<text class="stmPush" x="70" y="60" text-anchor="middle" font-size="18"></text><g class="drops"></g></svg>'+
        '<div class="stmResult" role="status" aria-live="polite">'+(mission?"🌊 A FLOOD is coming! Build a dam that can hold it.":"Choose a material and a wall, then press TEST.")+'</div>'+
        '<div class="stmRow c2 stmMats">'+MATS.map(function(m){return btn(m.id==="concrete"?"sel":"",m.icon+'<b>'+m.name+'</b><small>'+m.tag+'</small>','data-m="'+m.id+'" aria-pressed="'+(m.id==="concrete")+'"');}).join("")+'</div>'+
        '<div class="stmRow c2 stmThick">'+btn("sel","▯<b>THIN WALL</b>",'data-t="0" aria-pressed="true"')+btn("","▮<b>THICK WALL</b>",'data-t="1" aria-pressed="false"')+'</div>'+
        '<div class="stmBars"><div>💦 WATER PUSH <b class="stmPN">0</b><div class="stmBar"><i class="stmPB"></i></div></div><div>🧱 WALL STRENGTH <b class="stmSN">0</b><div class="stmBar"><i class="stmSB"></i></div></div></div>'+
        btn("stmGo",'🌊 TEST MY DAM','data-go="1"');
      var wall=el(h,".stmWall"),water=el(h,".stmWater"),crack=el(h,".stmCrack"),res=el(h,".stmResult"),layer=el(h,".drops"),push=el(h,".stmPush");
      function strength(){var m=MATS.filter(function(x){return x.id===mat;})[0];return Math.round(m.s*(thick?1.5:1));}
      function stage_(n){stage=n;[].forEach.call(h.querySelectorAll(".stmCycle span"),function(s){s.classList.toggle("on",+s.dataset.s===n);s.classList.toggle("past",+s.dataset.s<n);});}
      function draw(){
        wall.setAttribute("width",thick?32:16);
        var m=MATS.filter(function(x){return x.id===mat;})[0];
        wall.setAttribute("fill",{concrete:"#aeb7c9",rock:"#8a8f9c",wood:"#a8723a",soil:"#8a5d3a"}[mat]);
        el(h,".stmSN").textContent=strength();el(h,".stmSB").style.width=clamp(strength()/1.5,0,100)+"%";
        el(h,".stmPN").textContent=0;el(h,".stmPB").style.width="0%";
        crack.setAttribute("opacity",0);water.setAttribute("height",30);water.setAttribute("y",120);push.textContent="";layer.innerHTML="";
      }
      draw();stage_(2);
      h.addEventListener("click",function(e){
        if(busy)return;
        var m=e.target.closest&&e.target.closest("[data-m]"),t=e.target.closest&&e.target.closest("[data-t]"),g=e.target.closest&&e.target.closest("[data-go]");
        if(m){mat=m.dataset.m;[].forEach.call(h.querySelectorAll("[data-m]"),function(b){var on=b===m;b.classList.toggle("sel",on);b.setAttribute("aria-pressed",on);});ctx.sfx("tap");draw();stage_(3);res.textContent="Built with "+m.querySelector("b").textContent+". Ready to test!";return;}
        if(t){thick=t.dataset.t==="1";[].forEach.call(h.querySelectorAll("[data-t]"),function(b){var on=b===t;b.classList.toggle("sel",on);b.setAttribute("aria-pressed",on);});ctx.sfx("tap");draw();stage_(3);res.textContent=thick?"A thicker wall is stronger. Ready to test!":"A thin wall. Ready to test!";return;}
        if(!g||won)return;
        busy=true;g.disabled=true;ctx.sfx("tap");draw();stage_(4);res.textContent="🌊 The water is rising…";
        var S=strength();push.textContent="➡️➡️➡️";
        run(ctx,1700,function(p){
          var lvl=30+50*p;water.setAttribute("height",lvl);water.setAttribute("y",150-lvl);
          var pn=Math.round(demand*p);el(h,".stmPN").textContent=pn;el(h,".stmPB").style.width=clamp(pn/1.5,0,100)+"%";
        },function(){
          busy=false;g.disabled=false;tests++;
          if(S>=demand){
            res.innerHTML='🧱 <b>DAM HOLDS!</b> ✅ Strength '+S+' ≥ push '+demand+'.';wall.classList.add("holds");ctx.sfx("good");
            if(mission){won=true;stage_(5);say(ctx,"It held! That's the engineering cycle in action.");ctx.done();}
            else if(tests>=2){say(ctx,"Nice testing! Different designs give different results.");ctx.done();}
            ctx.after(function(){wall.classList.remove("holds");},1600);
          }else{
            crack.setAttribute("opacity",1);res.innerHTML='💦 <b>LEAK!</b> ⚠️ Strength '+S+' is less than push '+demand+'. <em>IMPROVE it: try a stronger material or a thicker wall.</em>';
            stage_(5);ctx.sfx("oops");
            for(var i=0;i<6;i++)(function(i){ctx.after(function(){fall(ctx,layer,170+(i%3)*10,110,150,700);},i*160);})(i);
            if(!mission&&tests>=2){ctx.done();}
          }
        });
      });
    };
  }
  G.registerLab("dam",damLab(65,false));
  G.registerLab("dam-flood",damLab(80,true));

  /* ================= 🌊 RESERVOIR ================= */
  function meterText(level){var segs=clamp(Math.ceil(level/2),0,5),s="";for(var i=0;i<5;i++)s+=i<segs?"🟦":"⬜";return s;}
  function levelName(l){return l>=8?"HIGH":l>=4?"MEDIUM":"LOW";}
  function reservoirBase(h,mission){
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="Reservoir tank filling with water">'+
      '<text class="stmRainTxt" x="60" y="34" font-size="26">🌧️</text>'+
      '<rect x="100" y="22" width="130" height="128" rx="6" fill="rgba(255,255,255,.06)" stroke="#9fe8ff" stroke-width="2"/>'+
      '<rect class="stmRes" x="102" y="130" width="126" height="20" fill="#2fa8ff" opacity=".9"/>'+
      '<line x1="100" y1="22" x2="230" y2="22" stroke="#ff7b7b" stroke-width="2" stroke-dasharray="6 4"/><text x="236" y="26" class="stmSvgLbl">FULL</text>'+
      '<rect x="230" y="146" width="90" height="10" fill="#2fa8ff" opacity=".5"/><text class="stmOutTxt" x="262" y="136" font-size="20" text-anchor="middle"></text></svg>'+
      '<div class="stmMeter" aria-live="polite"><b class="stmML">LEVEL</b> <span class="stmMS"></span> <b class="stmMN"></b></div>'+
      '<div class="stmEq" aria-live="polite"></div><div class="stmStat" role="status" aria-live="polite"></div>';
  }
  function resDraw(h,level,rain,out,start){
    var res=el(h,".stmRes"),ht=level/10*126;res.setAttribute("height",ht);res.setAttribute("y",150-ht);
    el(h,".stmMS").textContent=meterText(level);el(h,".stmMN").textContent=levelName(level)+" · "+level+"/10";
    el(h,".stmRainTxt").textContent=rain>=3?"⛈️":rain===2?"🌧️":rain===1?"🌦️":"☀️";
    el(h,".stmOutTxt").textContent=out>0?new Array(out+1).join("💧"):"";
    el(h,".stmEq").innerHTML=start==null?"":'<span>START <b>'+start+'</b></span> + <span>IN <b>'+rain+'</b></span> − <span>OUT <b>'+out+'</b></span> = <span>END <b>'+level+'</b></span>';
  }
  var RAIN=[["☀️","NONE",0],["🌦️","LIGHT",1],["🌧️","MEDIUM",2],["⛈️","HEAVY",3]];
  function rainBtns(){return '<div class="stmLbl">🌧️ RAINFALL</div><div class="stmRow c4 stmRain">'+RAIN.map(function(r){return btn(r[2]===1?"sel":"",r[0]+'<small>'+r[1]+'</small>','data-r="'+r[2]+'" aria-pressed="'+(r[2]===1)+'"');}).join("")+'</div>';}
  G.registerLab("reservoir",function(ctx){
    var h=ctx.host,level=4,rain=1,out=1,changed=0,won=false;
    reservoirBase(h,false);h.insertAdjacentHTML("beforeend",rainBtns());
    var stat=el(h,".stmStat");stat.textContent="Water leaks out a little (OUT 1). Change the rain!";resDraw(h,level,rain,out,level);
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-r]");if(!b)return;rain=+b.dataset.r;changed++;ctx.sfx("tap");
      [].forEach.call(h.querySelectorAll("[data-r]"),function(x){var on=x===b;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on);});});
    ctx.every(function(){
      var s=level,e=s+rain-out;
      if(e>10){e=10;stat.textContent="💦 OVERFLOW! The reservoir is full. Lower the rain.";}
      else if(e<0)e=0;else stat.textContent=rain>out?"📈 More IN than OUT — the level rises.":rain<out?"📉 More OUT than IN — the level falls.":"⚖️ IN = OUT — the level stays steady!";
      level=e;resDraw(h,level,rain,out,s);
      if(!won&&level>=8&&changed>0){won=true;say(ctx,"HIGH! More water in than out fills the reservoir.");ctx.done();}
    },1100);
  });
  var STORM=[2,3,3,2,3,3,2,3,2,2];
  G.registerLab("reservoir-storm",function(ctx){
    var h=ctx.host,level=5,rel=1,tick=0,running=false,over=false;
    reservoirBase(h,true);
    h.insertAdjacentHTML("beforeend",'<div class="stmLbl">🚪 WATER RELEASE (OUT)</div><div class="stmRow c4 stmRel">'+[0,1,2,3].map(function(n){return btn(n===1?"sel":"",'🚪<small>'+(n?"OUT "+n:"CLOSED")+'</small>','data-o="'+n+'" aria-pressed="'+(n===1)+'"');}).join("")+'</div>'+
      '<div class="stmProg" aria-live="polite">STORM <b class="stmTN">0</b>/10</div>'+btn("stmGo","▶ START STORM",'data-go="1"'));
    var stat=el(h,".stmStat"),go=el(h,"[data-go]");
    stat.textContent="A storm is coming! Keep the level from going over FULL — and don't run dry.";resDraw(h,level,0,rel,null);
    function reset(){level=5;tick=0;running=false;over=false;go.disabled=false;go.textContent="▶ START STORM";el(h,".stmTN").textContent=0;resDraw(h,level,0,rel,null);}
    h.addEventListener("click",function(e){
      var o=e.target.closest&&e.target.closest("[data-o]");
      if(o){rel=+o.dataset.o;ctx.sfx("tap");[].forEach.call(h.querySelectorAll("[data-o]"),function(x){var on=x===o;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on);});return;}
      if(e.target.closest&&e.target.closest("[data-go]")&&!running){reset();running=true;go.disabled=true;go.textContent="⛈️ STORM…";ctx.sfx("tap");}
    });
    ctx.every(function(){
      if(!running)return;
      var rain=STORM[tick],s=level,avail=s+rain,out=Math.min(rel,avail),e=avail-out;tick++;el(h,".stmTN").textContent=tick;
      level=Math.min(e,11);resDraw(h,Math.min(level,10),rain,out,s);
      if(e>10){running=false;stat.innerHTML="💦 <b>OVERFLOW!</b> Too much came in. Release more water — try again!";ctx.sfx("oops");go.disabled=false;go.textContent="↻ TRY AGAIN";return;}
      if(e<1){running=false;stat.innerHTML="🏜️ <b>TOO DRY!</b> You released too much. Keep some for later — try again!";ctx.sfx("oops");go.disabled=false;go.textContent="↻ TRY AGAIN";return;}
      stat.textContent=e>=8?"⚠️ HIGH! Release more water.":e<=2?"⚠️ LOW! Release less.":"✅ Balanced. Keep watching!";
      if(tick>=STORM.length){running=false;stat.textContent="✅ "+G.stations.reservoir.challenge.success;say(ctx,"The storm passed and the water stayed in balance!");ctx.done();go.textContent="✅ STORM SURVIVED";}
    },1100);
  });

  /* ================= 🚪 SLUICE ================= */
  var GATE=[
    {pct:0,txt:"🔒 CLOSED",drops:"💧",name:"TRICKLE",n:0},
    {pct:25,txt:"25%",drops:"💧💧",name:"SMALL",n:1},
    {pct:50,txt:"50%",drops:"💧💧💧",name:"MEDIUM",n:2},
    {pct:75,txt:"75%",drops:"🌊🌊🌊",name:"STRONG",n:3},
    {pct:100,txt:"💦 100% OPEN",drops:"🌊🌊🌊🌊🌊",name:"MAXIMUM",n:4}
  ];
  function sluiceBase(h){
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="A sluice gate in a wall with water flowing underneath">'+
      '<rect x="0" y="150" width="320" height="20" fill="#3b2a1a"/><rect x="6" y="40" width="130" height="110" fill="#2fa8ff" opacity=".8"/>'+
      '<rect x="136" y="20" width="22" height="130" fill="#6c7488"/><rect class="stmGate" x="134" y="82" width="26" height="68" fill="#d9a93a" stroke="#fff" stroke-width="2" rx="2"/>'+
      '<g class="stmJet"><line class="stmJ1" x1="162" x2="316" y1="140" y2="140"/><line class="stmJ2" x1="162" x2="316" y1="130" y2="130"/><line class="stmJ3" x1="162" x2="316" y1="120" y2="120"/><line class="stmJ4" x1="162" x2="316" y1="110" y2="110"/></g>'+
      '<text x="70" y="30" text-anchor="middle" class="stmSvgLbl">RESERVOIR</text><text x="240" y="100" text-anchor="middle" class="stmSvgLbl">DOWNSTREAM</text></svg>'+
      '<div class="stmFlowTxt" aria-live="polite"></div><div class="stmStat" role="status" aria-live="polite"></div>';
  }
  function sluiceSet(h,i){
    var g=GATE[i],gate=el(h,".stmGate"),lift=(g.pct/100)*56;
    gate.setAttribute("y",82-lift);gate.setAttribute("height",68);
    var lines=h.querySelectorAll(".stmJet line");
    [].forEach.call(lines,function(l,k){l.style.opacity=g.n===0?(k===0?.35:0):(k<=g.n-1+(g.n>=3?1:0)?1:0);l.style.animationDuration=(1.1-g.n*.2)+"s";l.style.strokeWidth=(2+g.n*1.5);});
    el(h,".stmFlowTxt").innerHTML='<span>'+g.drops+'</span> <b>FLOW: '+g.name+'</b> <small>(GATE '+g.txt.replace(/[^\d%A-Z ]/g,"").trim()+')</small>';
  }
  function gateBtns(sel){return '<div class="stmRow c5 stmGateRow">'+GATE.map(function(g,i){return btn(i===sel?"sel":"",g.txt,'data-g="'+i+'" aria-pressed="'+(i===sel)+'"');}).join("")+'</div>';}
  G.registerLab("sluice",function(ctx){
    var h=ctx.host,tried={},n=0;sluiceBase(h);h.insertAdjacentHTML("beforeend",gateBtns(0));
    sluiceSet(h,0);el(h,".stmStat").textContent="Slide the gate open and watch the flow.";
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-g]");if(!b)return;
      var i=+b.dataset.g;[].forEach.call(h.querySelectorAll("[data-g]"),function(x){var on=x===b;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on);});
      sluiceSet(h,i);ctx.sfx(i>=4?"wow":"tap");if(!tried[i]){tried[i]=1;n++;}
      el(h,".stmStat").textContent=i===0?"🔒 Closed — almost nothing gets through.":i===4?"💦 Wide open — a big surge of water!":"🚪 The wider the gate, the more water flows.";
      if(n>=3){say(ctx,"More opening, more flow. That's cause and effect!");ctx.done();}
    });
  });
  G.registerLab("sluice-predict",function(ctx){
    var h=ctx.host,won=false,busy=false;sluiceBase(h);sluiceSet(h,1);
    h.insertAdjacentHTML("beforeend",'<div class="stmQ">The gate is at <b>25%</b>. What happens when you open it to <b>100%</b>?</div><div class="stmRow c1">'+
      btn("stmWide","<b>A</b> More water flows through",'data-a="1"')+btn("stmWide","<b>B</b> Less water flows through",'data-a="0"')+btn("stmWide","<b>C</b> The flow stays the same",'data-a="0"')+'</div>');
    var stat=el(h,".stmStat");stat.textContent="Pick your prediction, then watch!";
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-a]");if(!b||won||busy)return;busy=true;ctx.sfx("tap");
      stat.textContent="🚪 Opening the gate…";sluiceSet(h,4);
      ctx.after(function(){busy=false;
        if(b.dataset.a==="1"){won=true;b.classList.add("good");stat.textContent="✅ "+G.stations.sluice.challenge.success;ctx.sfx("wow");say(ctx,"Whoosh! You predicted it!");ctx.done();}
        else{stat.textContent="🤔 Look at the water — did the flow get bigger or smaller? Try again!";ctx.sfx("oops");ctx.after(function(){sluiceSet(h,1);},900);}
      },1400);
    });
  });

  /* ================= ⚙️ WATERWHEEL ================= */
  var SPEED=["STOPPED","SLOW","SLOW","MEDIUM","MEDIUM","FAST","FAST","FAST","SUPER FAST"];
  function wheelBase(h){
    var sp="",pads="";for(var i=0;i<8;i++){var a=i*Math.PI/4;sp+='<line x1="0" y1="0" x2="'+(Math.cos(a)*40).toFixed(1)+'" y2="'+(Math.sin(a)*40).toFixed(1)+'" stroke="#6b4322" stroke-width="4"/>';}
    for(var j=0;j<12;j++)pads+='<rect x="-5" y="-52" width="10" height="13" rx="2" fill="#8a5a2e" transform="rotate('+(j*30)+')"/>';
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="Water falling onto a waterwheel">'+
      '<rect x="0" y="150" width="320" height="20" fill="#3b2a1a"/><path class="stmChute" d="M0 60 L120 60 L150 78" fill="none" stroke="#5fe6ff" stroke-width="8" stroke-linecap="round" opacity="0"/>'+
      '<g transform="translate(220 96)"><g class="stmWheelG"><circle r="46" fill="none" stroke="#7a4b25" stroke-width="6"/>'+sp+pads+'<circle r="7" fill="#3a2a1a" stroke="#c9922e" stroke-width="2"/></g></g>'+
      '<text class="stmBulb" x="296" y="30" font-size="30" text-anchor="middle" opacity=".35">💡</text></svg>'+
      '<div class="stmSpeed" aria-live="polite"></div>'+
      '<div class="stmEnergy"><div>⚡ ENERGY <b class="stmEN">0</b>/100</div><div class="stmBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="stmEB"></i></div></div>'+
      '<div class="stmChain"><span data-k="0">🌊 MOVING WATER</span><em>→</em><span data-k="1">⚙️ TURBINE</span><em>→</em><span data-k="2">🔌 GENERATOR</span><em>→</em><span data-k="3">⚡ ELECTRICITY</span></div>'+
      '<div class="stmStat" role="status" aria-live="polite"></div>';
  }
  function wheelCtl(){
    return '<div class="stmLbl">🚪 GATE (FLOW)</div><div class="stmRow c5 stmGateRow">'+GATE.map(function(g,i){return btn(i===0?"sel":"",g.txt,'data-f="'+i+'" aria-pressed="'+(i===0)+'"');}).join("")+'</div>'+
      '<div class="stmLbl">🎓 BIG KIDS: FLOW + HEIGHT → ENERGY</div><div class="stmRow c2 stmHt">'+btn("sel","⬇️ LOW DROP",'data-h="1" aria-pressed="true"')+btn("","⬇️⬇️ HIGH DROP",'data-h="2" aria-pressed="false"')+'</div>';
  }
  function wheelLab(mission){
    return function(ctx){
      var h=ctx.host,flow=0,ht=1,energy=0,tried={},nt=0,won=false;
      wheelBase(h);h.insertAdjacentHTML("beforeend",wheelCtl());
      var wg=el(h,".stmWheelG"),stat=el(h,".stmStat");
      stat.textContent=mission?"Fill the ⚡ energy meter to light the lamp 💡!":"Open the gate to send water to the wheel.";
      function paint(){
        var p=flow*ht;wg.style.animationDuration=p?(7/p).toFixed(2)+"s":"0s";wg.classList.toggle("go",p>0&&!ctx.reduced);
        el(h,".stmChute").setAttribute("opacity",flow?1:0);
        el(h,".stmSpeed").innerHTML='⚙️ WHEEL: <b>'+SPEED[p]+'</b> <small>(FLOW '+flow+' × DROP '+ht+')</small>';
        var en=Math.round(energy);el(h,".stmEN").textContent=en;el(h,".stmEB").style.width=en+"%";el(h,".stmEB").parentNode.setAttribute("aria-valuenow",en);
        [].forEach.call(h.querySelectorAll(".stmChain span"),function(s,k){s.classList.toggle("on",en>=k*25&&(k===0?flow>0:en>0));});
        el(h,".stmBulb").setAttribute("opacity",en>=100?1:.35);
      }
      paint();
      h.addEventListener("click",function(e){
        var f=e.target.closest&&e.target.closest("[data-f]"),t=e.target.closest&&e.target.closest("[data-h]");
        if(f){flow=+f.dataset.f;[].forEach.call(h.querySelectorAll("[data-f]"),function(x){var on=x===f;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on);});ctx.sfx("tap");
          stat.textContent=flow===0?"🔒 No flow — the wheel stops.":flow>=3?"🌊 Strong flow — the wheel spins fast!":"💧 A little flow — the wheel turns slowly.";
          if(flow>0&&!tried[flow]){tried[flow]=1;nt++;if(!mission&&nt>=2){say(ctx,"More flow, faster wheel. Moving water has energy!");ctx.done();}}paint();}
        if(t){ht=+t.dataset.h;[].forEach.call(h.querySelectorAll("[data-h]"),function(x){var on=x===t;x.classList.toggle("sel",on);x.setAttribute("aria-pressed",on);});ctx.sfx("tap");paint();}
      });
      ctx.every(function(){
        if(won)return;energy=clamp(energy+flow*ht*2-1,0,100);paint();
        if(mission&&energy>=100){won=true;stat.textContent="✅ "+G.stations.wheel.challenge.success;ctx.sfx("wow");say(ctx,"The lamp is lit! Moving water made electricity!");ctx.done();}
      },500);
    };
  }
  G.registerLab("wheel",wheelLab(false));
  G.registerLab("wheel-power",wheelLab(true));

  /* ================= 🌎 OCEAN ================= */
  var NODES=[["🧱","DAM",0],["🏞️","RIVER",1],["🌿","WETLAND",2],["🌊","ESTUARY",2],["🌎","OCEAN",2]];
  function oceanState(r){
    return {
      fish:r<2?["⚠️","TOO LITTLE WATER"]:r>4?["⚠️","WASHED OUT"]:["✅","HAPPY"],
      plants:r<2?["⚠️","DRY"]:r>4?["⚠️","FLOODED"]:["✅","GREEN"],
      wild:r<2?["⚠️","LEAVING"]:r>4?["⚠️","NEEDS CALM"]:["✅","VISITING"],
      town:r>3?["⚠️","RUNNING LOW"]:["✅","HAS WATER"],
      ok:r>=2&&r<=3
    };
  }
  function oceanBase(h){
    h.innerHTML='<div class="stmFlowRow" aria-label="Water path from the dam to the ocean">'+NODES.map(function(n,i){return (i?'<em>→</em>':'')+'<span class="stmNode" data-n="'+i+'"><i>'+n[0]+'</i><small>'+n[1]+'</small></span>';}).join("")+'</div>'+
      '<div class="stmRiver"><i></i></div>'+
      '<div class="stmLife"><div data-l="fish"><i>🐟</i><b>FISH</b><span></span></div><div data-l="plants"><i>🌱</i><b>PLANTS</b><span></span></div><div data-l="wild"><i>🦆</i><b>WILDLIFE</b><span></span></div><div data-l="town"><i>🏘️</i><b>TOWN</b><span></span></div></div>'+
      '<div class="stmStat" role="status" aria-live="polite"></div><div class="stmLbl">💧 WATER RELEASED DOWNSTREAM</div>'+
      '<div class="stmRow c6 stmRelRow">'+[0,1,2,3,4,5].map(function(n){return btn("",'<b>'+n+'</b>','data-r="'+n+'" aria-pressed="false" aria-label="Release '+n+'"');}).join("")+'</div>';
  }
  function oceanPaint(h,r){
    var s=oceanState(r);
    [].forEach.call(h.querySelectorAll(".stmNode"),function(n,i){var lit=r>=NODES[i][2]&&(i===0||r>=1);n.classList.toggle("lit",lit);});
    ["fish","plants","wild","town"].forEach(function(k){var d=el(h,'[data-l="'+k+'"]');d.querySelector("span").textContent=s[k][0]+" "+s[k][1];d.classList.toggle("bad",s[k][0]==="⚠️");d.classList.toggle("good",s[k][0]==="✅");});
    var riv=el(h,".stmRiver");riv.className="stmRiver f"+r;
    [].forEach.call(h.querySelectorAll("[data-r]"),function(b){var on=+b.dataset.r===r;b.classList.toggle("sel",on);b.setAttribute("aria-pressed",on);});
    return s;
  }
  G.registerLab("ocean",function(ctx){
    var h=ctx.host,tried={},n=0;oceanBase(h);var stat=el(h,".stmStat");stat.textContent="Pick how much water to release. Try a few!";oceanPaint(h,0);
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-r]");if(!b)return;var r=+b.dataset.r;ctx.sfx("tap");var s=oceanPaint(h,r);
      stat.textContent=r<2?"🏜️ Too little: the river and wetland dry out.":r>4?"🌊 Too much: the river floods fast.":r>3?"🏘️ Nature is fine, but the town is running low.":"🌎 The water reaches the ocean and life lights up!";
      if(!tried[r]){tried[r]=1;n++;if(n>=3){say(ctx,"Water doesn't disappear — it keeps going downstream!");ctx.done();}}});
  });
  G.registerLab("ocean-balance",function(ctx){
    var h=ctx.host,r=0,hold=0,won=false;oceanBase(h);var stat=el(h,".stmStat");
    h.insertAdjacentHTML("beforeend",'<div class="stmProg" aria-live="polite">HEALTHY FOR <b class="stmHN">○○○</b></div>');
    stat.textContent="Find a release that is healthy for BOTH nature and the town. Then hold it!";oceanPaint(h,0);
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-r]");if(!b||won)return;r=+b.dataset.r;hold=0;ctx.sfx("tap");var s=oceanPaint(h,r);
      el(h,".stmHN").textContent="○○○";
      stat.textContent=s.ok?"✅ Healthy for nature AND the town. Hold it!":r<2?"🏜️ Not enough water for nature yet.":r>4?"🌊 Too much — the river floods.":"🏘️ The town is running low. Release a bit less.";});
    ctx.every(function(){
      if(won)return;var s=oceanState(r);
      if(s.ok){hold++;el(h,".stmHN").textContent=new Array(hold+1).join("●")+new Array(Math.max(0,3-hold)+1).join("○");
        if(hold>=3){won=true;[].forEach.call(h.querySelectorAll(".stmLife div"),function(d){d.classList.add("glow");});stat.textContent="✅ "+G.stations.ocean.challenge.success;ctx.sfx("wow");say(ctx,"Look — the whole ecosystem lights up!");ctx.done();}}
    },1000);
  });
})();
