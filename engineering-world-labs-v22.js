/* V2.2 — DAM ENGINEERING WORLD · LABS 🧪
 * Interactive experiments. Each lab is registered by name:  GEI_STEM.registerLab("name", function(ctx){ ... })
 *
 * ctx (provided by engineering-world-v22.js):
 *   host        element to draw into              mode      "experiment" | "mission" | "free"
 *   reduced     prefers-reduced-motion            done()    this step is complete (ignored in free play)
 *   why(key)    show "💡 WHY DID THAT HAPPEN?"    react(key,msg)  the player's guide reacts in their own voice (throttled, can be quieted)
 *   say(msg)    guide speech                      sfx(kind) tap|good|oops|wow|water|build|gate|spin|zap
 *   every(fn,ms) / after(fn,ms)  timers cleared automatically    alive()  false once the lab is closed
 *
 * Free play (mode "free") reuses a station's experiment lab with every control open: no goal, no timer,
 * no wrong answer, no XP. Labs only draw inside `host` — they never touch game state, FL OZ, XP or purchases.
 */
(function(){
  "use strict";
  var G=window.GEI_STEM; if(!G||!G.registerLab||G.labsLoaded)return; G.labsLoaded=true;
  var NS="http://www.w3.org/2000/svg";

  function btn(cls,html,attrs){return '<button type="button" class="stmBtn '+(cls||"")+'" '+(attrs||"")+'>'+html+'</button>';}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function el(h,sel){return h.querySelector(sel);}
  function pick(h,sel,on){[].forEach.call(h.querySelectorAll(sel),function(x){var s=x===on;x.classList.toggle("sel",s);x.setAttribute("aria-pressed",s);});}
  function range(cls,label,min,max,val){
    return '<div class="stmSlide"><span aria-hidden="true">LOW</span><input type="range" class="stmRange '+cls+'" min="'+min+'" max="'+max+'" step="1" value="'+val+'" aria-label="'+label+'"><span aria-hidden="true">HIGH</span></div>';
  }

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
  function free(ctx){return ctx.mode==="free";}
  function finish(ctx){if(!free(ctx))ctx.done();}

  /* ================= 🏔️ MOUNTAIN — WATER SOURCE LAB ================= */
  var MTN_STREAM="M120 62 C140 95 168 108 190 134 C214 158 262 158 296 170";
  function mountainSvg(){
    return '<svg class="stmViz" viewBox="0 0 320 190" role="img" aria-label="A mountain with a stream running downhill to a reservoir">'+
      '<defs><linearGradient id="stmMt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8e88bb"/><stop offset="1" stop-color="#3a3460"/></linearGradient></defs>'+
      '<polygon points="0,190 60,92 110,36 150,76 210,126 320,160 320,190" fill="url(#stmMt)"/>'+
      '<polygon class="stmSnow" points="88,58 110,36 132,58 122,54 112,64 102,54" fill="#f2fbff" opacity="0"/>'+
      '<path d="'+MTN_STREAM+'" class="stmStream"/>'+
      '<ellipse class="stmPool" cx="300" cy="176" rx="22" ry="8" fill="#2fa8ff"/><text x="206" y="184" class="stmSvgLbl">🌊 → RESERVOIR</text>'+
      '<text class="stmCloud" x="82" y="26" font-size="30" opacity=".35">☁️</text><text x="18" y="30" class="stmSvgLbl">⬆️ HIGH</text><text x="18" y="182" class="stmSvgLbl">⬇️ LOW</text>'+
      '<g class="drops"></g></svg>';
  }
  G.registerLab("mountain",function(ctx){
    var h=ctx.host;
    h.innerHTML=mountainSvg()+'<div class="stmStat" role="status" aria-live="polite">Tap the weather buttons.</div>'+
      '<div class="stmRow c3">'+btn("","☁️<b>MAKE IT RAIN</b>",'data-a="rain"')+btn("","❄️<b>SNOW</b>",'data-a="snow"')+btn("","💧<b>RUNOFF</b>",'data-a="runoff"')+'</div>'+
      '<div class="stmChecks" aria-label="Tried so far"><span data-c="rain">☁️ Rain</span><span data-c="snow">❄️ Snow</span><span data-c="runoff">💧 Runoff</span></div>';
    var layer=el(h,".drops"),path=el(h,".stmStream"),stat=el(h,".stmStat"),snow=el(h,".stmSnow"),cloud=el(h,".stmCloud"),used={},busy=false;
    function mark(a){used[a]=1;el(h,'[data-c="'+a+'"]').classList.add("on");
      if(used.rain&&used.snow&&used.runoff){stat.textContent="✅ Every drop went downhill! Gravity did that.";ctx.react("mountain.completed","See that? Rain, snow, runoff — it all ends up flowing downhill.");finish(ctx);}}
    h.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest("[data-a]");if(!b||busy)return;
      var a=b.dataset.a;busy=true;ctx.sfx("tap");
      function end(msg){stat.textContent=msg;ctx.why("mountain."+a);mark(a);busy=false;}
      if(a==="rain"){
        stat.textContent="☁️ Clouds gather… 🌧️ rain falls!";cloud.setAttribute("opacity","1");ctx.sfx("water");
        for(var i=0;i<7;i++)(function(i){ctx.after(function(){fall(ctx,layer,70+i*14,32,70+Math.abs(i-3)*8,700);},i*110);})(i);
        ctx.after(function(){stat.textContent="💧 Runoff starts — streams appear!";travel(ctx,layer,path,5,2200,function(){end("🌊 The water gathered in the stream and reached the reservoir!");});},900);
      }else if(a==="snow"){
        stat.textContent="❄️ Snow piles up on the peak…";snow.setAttribute("opacity","1");
        for(var j=0;j<6;j++)(function(j){ctx.after(function(){fall(ctx,layer,86+j*10,30,58,1100,"stmFlake");},j*140);})(j);
        ctx.after(function(){end("❄️ Snow melts later, and the meltwater runs downhill too!");},1700);
      }else{
        stat.textContent="💧 Runoff starts to move…";snow.setAttribute("opacity","0");ctx.sfx("water");
        travel(ctx,layer,path,7,2400,function(){end("🌊 Runoff always flows to lower ground.");});
      }
    });
  });

  G.registerLab("mountain-path",function(ctx){
    var h=ctx.host,P={a:"M60 92 L150 28",b:"M60 92 L220 92",c:"M60 92 L170 150"};
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 190" role="img" aria-label="A raindrop on a slope with three possible paths: A up, B flat, C down to a stream">'+
      '<polygon points="0,190 0,92 60,92 170,152 320,160 320,190" fill="#3a3460"/><polygon points="150,28 175,10 200,28 200,40 150,40" fill="#4d4680"/>'+
      '<path d="'+P.a+'" class="stmPath" data-p="a"/><path d="'+P.b+'" class="stmPath" data-p="b"/><path d="'+P.c+'" class="stmPath" data-p="c"/>'+
      '<circle cx="60" cy="92" r="9" fill="#5fe6ff"/><text x="60" y="84" text-anchor="middle" font-size="16">💧</text>'+
      '<g class="stmMark"><circle cx="150" cy="22" r="11"/><text x="150" y="27" text-anchor="middle">A</text></g>'+
      '<g class="stmMark"><circle cx="228" cy="92" r="11"/><text x="228" y="97" text-anchor="middle">B</text></g>'+
      '<g class="stmMark"><circle cx="178" cy="156" r="11"/><text x="178" y="161" text-anchor="middle">C</text></g>'+
      '<ellipse cx="270" cy="172" rx="34" ry="9" fill="#2fa8ff"/><text x="270" y="152" text-anchor="middle" class="stmSvgLbl">🌊 RESERVOIR</text><g class="drops"></g></svg>'+
      '<div class="stmStat" role="status" aria-live="polite">Where will the water go? Pick a path.</div>'+
      '<div class="stmRow c1">'+btn("stmWide","<b>A</b> ⬆️ UP to the hilltop",'data-c="a"')+btn("stmWide","<b>B</b> ➡️ ALONG the flat ridge",'data-c="b"')+btn("stmWide","<b>C</b> ⬇️ DOWN to the stream",'data-c="c"')+'</div>';
    var layer=el(h,".drops"),stat=el(h,".stmStat"),won=false,busy=false;
    h.addEventListener("click",function(e){
      var b=e.target.closest&&e.target.closest("[data-c]");if(!b||won||busy)return;
      var c=b.dataset.c,path=el(h,'.stmPath[data-p="'+c+'"]'),len=path.getTotalLength(),dropC=dot(layer,6),ok=c==="c";busy=true;ctx.sfx("tap");
      pick(h,".stmPath",path);path.classList.add("pick");
      run(ctx,1500,function(p){var q=ok?p:(p<.5?p*2*.55:(1-p)*2*.55),pt=path.getPointAtLength(len*q);dropC.setAttribute("cx",pt.x);dropC.setAttribute("cy",pt.y);},function(){
        busy=false;
        if(ok){won=true;b.classList.add("good");stat.textContent="✅ "+G.stations.mountain.challenge.success;ctx.sfx("good");ctx.why("mountain.path.right");ctx.react("mountain.pathRight","Yes! Downhill. Gravity does the work.");finish(ctx);}
        else{if(dropC.parentNode)dropC.parentNode.removeChild(dropC);stat.textContent="🤔 Not that way — try a path that goes lower!";ctx.sfx("oops");ctx.why("mountain.path.wrong");}
      });
    });
  });

  /* ================= 🧱 DAM — STRUCTURAL ENGINEERING LAB ================= */
  var MATS=[
    {id:"concrete",icon:"🧱",name:"CONCRETE",s:100,tag:"Very strong"},
    {id:"rock",icon:"🪨",name:"ROCK",s:75,tag:"Strong"},
    {id:"wood",icon:"🪵",name:"WOOD",s:44,tag:"Medium"},
    {id:"soil",icon:"🌍",name:"SOIL",s:30,tag:"Soft"}
  ];
  var STEPS=["ASK","IMAGINE","PLAN","BUILD","TEST","IMPROVE"];
  var WALLC={concrete:"#aeb7c9",rock:"#8a8f9c",wood:"#a8723a",soil:"#8a5d3a"};
  function damLab(demand0,mission){
    return function(ctx){
      var h=ctx.host,mat="concrete",thick=false,reinf=false,tests=0,busy=false,won=false,demand=demand0;
      var fp=free(ctx);
      h.innerHTML='<div class="stmCycle" aria-label="Engineering cycle">'+STEPS.map(function(s,i){return '<span data-s="'+i+'">'+s+'</span>';}).join("")+'</div>'+
        '<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="Water behind a dam wall">'+
        '<rect x="0" y="150" width="320" height="20" fill="#3b2a1a"/>'+
        '<rect class="stmWater" x="6" y="120" width="132" height="30" fill="#2fa8ff" opacity=".85"/>'+
        '<g class="stmWallG"><rect class="stmWall" x="138" y="80" width="16" height="70" rx="3" fill="#9aa4b8" stroke="#fff" stroke-width="2"/>'+
        '<g class="stmBars2" opacity="0" stroke="#ffd66b" stroke-width="2"><line x1="142" y1="88" x2="142" y2="146"/><line x1="148" y1="88" x2="148" y2="146"/></g></g>'+
        '<path class="stmCrack" d="M146 90 l5 14 -6 12 6 14" fill="none" stroke="#ff7b7b" stroke-width="3" opacity="0"/>'+
        '<text class="stmPush" x="70" y="60" text-anchor="middle" font-size="18"></text><g class="drops"></g></svg>'+
        '<div class="stmResult" role="status" aria-live="polite">'+(mission?"🌊 A FLOOD is coming! Build a dam that can hold it.":"Choose your materials, then press TEST.")+'</div>'+
        '<div class="stmRow c2 stmMats">'+MATS.map(function(m){return btn(m.id==="concrete"?"sel":"",m.icon+'<b>'+m.name+'</b><small>'+m.tag+'</small>','data-m="'+m.id+'" aria-pressed="'+(m.id==="concrete")+'"');}).join("")+'</div>'+
        '<div class="stmRow c2 stmThick">'+btn("sel","▯<b>THIN WALL</b>",'data-t="0" aria-pressed="true"')+btn("","▮<b>THICK WALL</b>",'data-t="1" aria-pressed="false"')+'</div>'+
        '<div class="stmRow c1">'+btn("","🏗️<b>REINFORCEMENT: OFF</b><small>Steel bars make walls stronger</small>",'data-x="1" aria-pressed="false"')+'</div>'+
        (fp?'<div class="stmLbl">🌊 FLOOD SIZE</div>'+range("stmFlood","Flood size",30,130,demand0):"")+
        '<div class="stmBars"><div>💦 WATER PUSH <b class="stmPN">0</b><div class="stmBar"><i class="stmPB"></i></div></div><div>🧱 WALL STRENGTH <b class="stmSN">0</b><div class="stmBar"><i class="stmSB"></i></div></div></div>'+
        btn("stmGo",'🌊 TEST MY DAM','data-go="1"');
      var wall=el(h,".stmWall"),wg=el(h,".stmWallG"),water=el(h,".stmWater"),crack=el(h,".stmCrack"),res=el(h,".stmResult"),layer=el(h,".drops"),push=el(h,".stmPush"),rb=el(h,".stmBars2");
      function strength(){var m=MATS.filter(function(x){return x.id===mat;})[0];return Math.round(m.s*(thick?1.5:1)*(reinf?1.35:1));}
      function stage(n){[].forEach.call(h.querySelectorAll(".stmCycle span"),function(s){s.classList.toggle("on",+s.dataset.s===n);s.classList.toggle("past",+s.dataset.s<n);});}
      function draw(){
        wall.setAttribute("width",thick?32:16);wall.setAttribute("fill",WALLC[mat]);rb.setAttribute("opacity",reinf?1:0);wg.classList.remove("wobble");wall.classList.remove("holds");
        el(h,".stmSN").textContent=strength();el(h,".stmSB").style.width=clamp(strength()/2,0,100)+"%";
        el(h,".stmPN").textContent=0;el(h,".stmPB").style.width="0%";
        crack.setAttribute("opacity",0);water.setAttribute("height",30);water.setAttribute("y",120);push.textContent="";layer.innerHTML="";
      }
      draw();stage(2);
      h.addEventListener("input",function(e){if(e.target.classList.contains("stmFlood")){demand=+e.target.value;}});
      h.addEventListener("click",function(e){
        if(busy)return;
        var m=e.target.closest&&e.target.closest("[data-m]"),t=e.target.closest&&e.target.closest("[data-t]"),x=e.target.closest&&e.target.closest("[data-x]"),g=e.target.closest&&e.target.closest("[data-go]");
        if(m){mat=m.dataset.m;pick(h,"[data-m]",m);ctx.sfx("build");draw();stage(3);res.textContent="Built with "+m.querySelector("b").textContent+". Ready to test!";return;}
        if(t){thick=t.dataset.t==="1";pick(h,"[data-t]",t);ctx.sfx("build");draw();stage(3);res.textContent=thick?"A thicker wall is stronger. Ready to test!":"A thin wall. Ready to test!";return;}
        if(x){reinf=!reinf;x.classList.toggle("sel",reinf);x.setAttribute("aria-pressed",reinf);x.querySelector("b").textContent="REINFORCEMENT: "+(reinf?"ON":"OFF");ctx.sfx("build");draw();stage(3);res.textContent=reinf?"🏗️ Steel bars added. Ready to test!":"Reinforcement removed.";return;}
        if(!g||won)return;
        busy=true;g.disabled=true;ctx.sfx("water");draw();stage(4);res.textContent="🌊 The water is rising…";
        var S=strength(),ratio=S/demand;push.textContent="➡️➡️➡️";if(!ctx.reduced&&ratio<1.5)wg.classList.add("wobble");
        run(ctx,1700,function(p){
          var lvl=30+50*p;water.setAttribute("height",lvl);water.setAttribute("y",150-lvl);
          var pn=Math.round(demand*p);el(h,".stmPN").textContent=pn;el(h,".stmPB").style.width=clamp(pn/1.5,0,100)+"%";
        },function(){
          busy=false;g.disabled=false;tests++;wg.classList.remove("wobble");
          if(ratio>=1){
            var top=ratio>=1.5;
            res.innerHTML=(top?'🚀 <b>ENGINEERING MASTER!</b> ✅':'🧱 <b>DAM HOLDING!</b> ✅')+' Strength '+S+' vs push '+demand+'.';wall.classList.add("holds");ctx.sfx("good");
            ctx.why(top?"dam.master":"dam.hold");ctx.react(top?"dam.master":"dam.stable",top?"ENGINEER MODE ACTIVATED!":"Look at that! The dam is holding.");
            if(mission){won=true;stage(5);finish(ctx);}
            else if(tests>=2)finish(ctx);
            ctx.after(function(){wall.classList.remove("holds");},1600);
          }else{
            var poor=ratio>=.7;
            crack.setAttribute("opacity",1);
            res.innerHTML=(poor?'🌊 <b>TOO MUCH WATER!</b> ⚠️':'💦 <b>LEAK!</b> ⚠️')+' Strength '+S+' is less than push '+demand+'. <em>IMPROVE it: try a stronger material, a thicker wall or reinforcement.</em>';
            stage(5);ctx.sfx("oops");ctx.why(poor?"dam.poor":"dam.leak");ctx.react(poor?"dam.poor":"dam.leak","Oops! Engineers don't give up — improve it and test again!");
            for(var i=0;i<6;i++)(function(i){ctx.after(function(){fall(ctx,layer,170+(i%3)*10,110,150,700);},i*160);})(i);
            if(!mission&&tests>=2)finish(ctx);
          }
        });
      });
    };
  }
  G.registerLab("dam",damLab(65,false));
  G.registerLab("dam-flood",damLab(80,true));

  /* ================= 🌊 RESERVOIR — WATER STORAGE LAB ================= */
  function meterText(level){var segs=clamp(Math.ceil(level/2),0,5),s="";for(var i=0;i<5;i++)s+=i<segs?"🟦":"⬜";return s;}
  function levelName(l){return l>=8?"HIGH":l>=4?"MEDIUM":"LOW";}
  function reservoirBase(h){
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="Reservoir tank filling with water">'+
      '<text class="stmRainTxt" x="46" y="34" font-size="26">🌧️</text>'+
      '<rect x="100" y="22" width="130" height="128" rx="6" fill="rgba(255,255,255,.06)" stroke="#9fe8ff" stroke-width="2"/>'+
      '<rect class="stmRes" x="102" y="130" width="126" height="20" fill="#2fa8ff" opacity=".9"/>'+
      '<line x1="100" y1="22" x2="230" y2="22" stroke="#ff7b7b" stroke-width="2" stroke-dasharray="6 4"/><text x="236" y="26" class="stmSvgLbl">FULL</text>'+
      '<rect x="230" y="146" width="90" height="10" fill="#2fa8ff" opacity=".5"/><text class="stmOutTxt" x="262" y="136" font-size="20" text-anchor="middle"></text></svg>'+
      '<div class="stmMeter" aria-live="polite"><b>LEVEL</b> <span class="stmMS"></span> <b class="stmMN"></b></div>'+
      '<div class="stmEq" aria-live="polite"></div><div class="stmStat" role="status" aria-live="polite"></div>';
  }
  function resDraw(h,level,rain,out,start){
    var res=el(h,".stmRes"),ht=level/10*126;res.setAttribute("height",ht);res.setAttribute("y",150-ht);
    el(h,".stmMS").textContent=meterText(level);el(h,".stmMN").textContent=levelName(level)+" · "+level+"/10";
    el(h,".stmRainTxt").textContent=rain>=3?"⛈️":rain===2?"🌧️":rain===1?"🌦️":"☀️";
    el(h,".stmOutTxt").textContent=out>0?new Array(out+1).join("💧"):"";
    el(h,".stmEq").innerHTML=start==null?"":'<span>START <b>'+start+'</b></span> + <span>IN <b>'+rain+'</b></span> − <span>OUT <b>'+out+'</b></span> = <span>END <b>'+level+'</b></span>';
  }
  G.registerLab("reservoir",function(ctx){
    var h=ctx.host,level=5,rain=1,out=1,seen={},last="",fp=free(ctx);
    reservoirBase(h);
    h.insertAdjacentHTML("beforeend",'<div class="stmLbl">💧 INCOMING WATER</div>'+range("stmIn","Incoming water",0,4,rain)+'<div class="stmLbl">🚪 RELEASE</div>'+range("stmOut","Released water",0,4,out));
    var stat=el(h,".stmStat");stat.textContent="Slide INCOMING and RELEASE and watch the level.";resDraw(h,level,rain,out,level);
    h.addEventListener("input",function(e){
      if(e.target.classList.contains("stmIn")){rain=+e.target.value;ctx.sfx("water");}
      else if(e.target.classList.contains("stmOut")){out=+e.target.value;ctx.sfx("gate");}
    });
    ctx.every(function(){
      var s=level,e=s+rain-out,kind;
      if(e>10){e=10;kind="overflow";stat.textContent="💦 OVERFLOW! The reservoir is full.";}
      else{if(e<0)e=0;
        if(rain>out){kind="rise";stat.textContent="🌊 WATER LEVEL RISES";}
        else if(rain<out){kind="fall";stat.textContent="💧 WATER LEVEL FALLS";}
        else{kind="stable";stat.textContent="✅ RESERVOIR STABLE";}}
      level=e;resDraw(h,level,rain,out,s);
      if(kind!==last){last=kind;ctx.why("reservoir."+kind);ctx.react({rise:"reservoir.rising",fall:"reservoir.falling",stable:"reservoir.stable",overflow:"reservoir.overflow"}[kind],"");}
      if(kind!=="overflow")seen[kind]=1;
      if(!fp&&seen.rise&&seen.fall&&seen.stable){seen.done=1;ctx.react("reservoir.safe","You made it rise, fall and hold steady. Nice engineering!");finish(ctx);}
    },1100);
  });
  var STORM=[2,3,3,2,3,3,2,3,2,2];
  G.registerLab("reservoir-storm",function(ctx){
    var h=ctx.host,level=5,rel=1,tick=0,running=false;
    reservoirBase(h);
    h.insertAdjacentHTML("beforeend",'<div class="stmLbl">🚪 RELEASE (OUT) — the storm sets the incoming water</div>'+range("stmOut","Released water",0,4,rel)+
      '<div class="stmProg" aria-live="polite">STORM <b class="stmTN">0</b>/10</div>'+btn("stmGo","▶ START STORM",'data-go="1"'));
    var stat=el(h,".stmStat"),go=el(h,"[data-go]");
    stat.textContent="A storm is coming! Keep the level below FULL — and don't run dry.";resDraw(h,level,0,rel,null);
    function reset(){level=5;tick=0;running=false;go.disabled=false;go.textContent="▶ START STORM";el(h,".stmTN").textContent=0;resDraw(h,level,0,rel,null);}
    h.addEventListener("input",function(e){if(e.target.classList.contains("stmOut")){rel=+e.target.value;ctx.sfx("gate");}});
    h.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-go]")&&!running){reset();running=true;go.disabled=true;go.textContent="⛈️ STORM…";ctx.sfx("water");}});
    ctx.every(function(){
      if(!running)return;
      var rain=STORM[tick],s=level,avail=s+rain,out=Math.min(rel,avail),e=avail-out;tick++;el(h,".stmTN").textContent=tick;
      level=Math.min(e,11);resDraw(h,Math.min(level,10),rain,out,s);
      if(e>10){running=false;stat.innerHTML="💦 <b>OVERFLOW!</b> Too much came in. Release more water — try again!";ctx.sfx("oops");ctx.why("reservoir.overflow");ctx.react("reservoir.overflow","WHOA! The water is too high. Open up the release!");go.disabled=false;go.textContent="↻ TRY AGAIN";return;}
      if(e<1){running=false;stat.innerHTML="🏜️ <b>TOO DRY!</b> You released too much. Keep some for later — try again!";ctx.sfx("oops");ctx.why("reservoir.dry");go.disabled=false;go.textContent="↻ TRY AGAIN";return;}
      stat.textContent=e>=8?"⚠️ HIGH! Release more water.":e<=2?"⚠️ LOW! Release less.":"✅ RESERVOIR STABLE. Keep watching!";
      if(tick>=STORM.length){running=false;stat.textContent="✅ "+G.stations.reservoir.challenge.success;ctx.why("reservoir.stable");ctx.react("reservoir.safe","The storm passed and the reservoir stayed safe!");finish(ctx);go.textContent="✅ RESERVOIR SAFE";}
    },1100);
  });

  /* ================= 🚪 SLUICE — FLOW CONTROL LAB ================= */
  var GATE=[
    {pct:0,txt:"🔒 CLOSED",drops:"💧",name:"TRICKLE",n:0},
    {pct:25,txt:"25%",drops:"💧💧",name:"SMALL",n:1},
    {pct:50,txt:"50%",drops:"💧💧💧",name:"MEDIUM",n:2},
    {pct:75,txt:"75%",drops:"🌊🌊🌊",name:"STRONG",n:3},
    {pct:100,txt:"💦 100% OPEN",drops:"🌊🌊🌊🌊🌊",name:"MAXIMUM",n:4}
  ];
  function flowBar(pct){var n=Math.round(pct/12.5),s="";for(var i=0;i<8;i++)s+=i<n?"█":"░";return s;}
  function sluiceBase(h){
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="A sluice gate in a wall with water flowing underneath">'+
      '<rect x="0" y="150" width="320" height="20" fill="#3b2a1a"/><rect class="stmHead" x="6" y="40" width="130" height="110" fill="#2fa8ff" opacity=".8"/>'+
      '<rect x="136" y="20" width="22" height="130" fill="#6c7488"/><rect class="stmGate" x="134" y="82" width="26" height="68" fill="#d9a93a" stroke="#fff" stroke-width="2" rx="2"/>'+
      '<g class="stmJet"><line class="stmJ1" x1="162" x2="316" y1="140" y2="140"/><line class="stmJ2" x1="162" x2="316" y1="130" y2="130"/><line class="stmJ3" x1="162" x2="316" y1="120" y2="120"/><line class="stmJ4" x1="162" x2="316" y1="110" y2="110"/></g>'+
      '<text x="70" y="30" text-anchor="middle" class="stmSvgLbl">RESERVOIR</text><text x="240" y="100" text-anchor="middle" class="stmSvgLbl">DOWNSTREAM</text></svg>'+
      '<div class="stmFlowTxt" aria-live="polite"></div>'+
      '<div class="stmFlowMeter"><div class="stmFM" aria-live="polite"></div><div class="stmBar stmFlowBar" role="progressbar" aria-label="Flow" aria-valuemin="0" aria-valuemax="100"><i></i><u class="stmTgt" hidden></u></div></div>'+
      '<div class="stmStat" role="status" aria-live="polite"></div>';
  }
  /* head: 1 = full reservoir, .5 = low reservoir (water pushes less) */
  function sluiceSet(h,i,head){
    head=head||1;var g=GATE[i],flow=Math.round(g.pct*head),lift=(g.pct/100)*56,n=Math.round(g.n*head*(g.n>=3?1:1));
    el(h,".stmGate").setAttribute("y",82-lift);
    var hw=el(h,".stmHead");hw.setAttribute("y",head<1?70:40);hw.setAttribute("height",head<1?80:110);
    [].forEach.call(h.querySelectorAll(".stmJet line"),function(l,k){var on=flow===0?(k===0?.35:0):(k<=Math.floor(flow/28)?1:0);l.style.opacity=on;l.style.animationDuration=(1.1-flow/140)+"s";l.style.strokeWidth=(2+flow/25);});
    var drops=flow===0?"💧":flow<=25?"💧💧":flow<=50?"💧💧💧":flow<=75?"🌊🌊🌊":"🌊🌊🌊🌊🌊";
    el(h,".stmFlowTxt").innerHTML='<span>'+drops+'</span> <small>(GATE '+g.pct+'%)</small>';
    el(h,".stmFM").textContent="💧 FLOW "+flowBar(flow)+" "+flow+"%";
    var bar=el(h,".stmFlowBar");bar.setAttribute("aria-valuenow",flow);el(h,".stmFlowBar i").style.width=flow+"%";
    return flow;
  }
  function gateBtns(sel){return '<div class="stmLbl">🚪 GATE OPENING</div><div class="stmRow c5 stmGateRow">'+GATE.map(function(g,i){return btn(i===sel?"sel":"",g.txt,'data-g="'+i+'" aria-pressed="'+(i===sel)+'"');}).join("")+'</div>';}
  G.registerLab("sluice",function(ctx){
    var h=ctx.host,tried={},n=0,prev=0,fp=free(ctx);sluiceBase(h);h.insertAdjacentHTML("beforeend",gateBtns(0));
    sluiceSet(h,0);el(h,".stmStat").textContent="Slide the gate open and watch the flow.";
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-g]");if(!b)return;
      var i=+b.dataset.g;pick(h,"[data-g]",b);sluiceSet(h,i);ctx.sfx(i>prev?"gate":"gate");
      el(h,".stmStat").textContent=i===0?"🔒 Closed — almost nothing gets through.":i===4?"💦 Wide open — a big surge of water!":"🚪 The wider the gate, the more water flows.";
      ctx.why(i===0?"sluice.closed":i>prev?"sluice.more":"sluice.less");
      if(i===4&&prev<4)ctx.react("sluice.highFlow","WHOA! That's a LOT of water!");else if(i>prev&&i>0)ctx.react("sluice.opening","Here it comes!");
      prev=i;if(!tried[i]){tried[i]=1;n++;}
      if(!fp&&n>=3){ctx.react("sluice.controlled","MORE OPEN = MORE WATER FLOW. That's cause and effect!");finish(ctx);}
    });
  });
  var TARGETS=[{head:1,t:50,note:"The reservoir is full."},{head:.5,t:25,note:"The reservoir is LOW, so water pushes out less."},{head:.5,t:50,note:"The reservoir is still LOW."}];
  G.registerLab("sluice-target",function(ctx){
    var h=ctx.host,ti=0,sel=0,locked=false;sluiceBase(h);
    h.insertAdjacentHTML("beforeend",'<div class="stmQ">🎯 TARGET FLOW: <b class="stmTT"></b> <span class="stmTN2"></span></div>'+gateBtns(0));
    var stat=el(h,".stmStat"),tgt=el(h,".stmTgt"),bar=el(h,".stmFlowBar");
    function show(){
      var t=TARGETS[ti];el(h,".stmTT").textContent=t.t+"%";el(h,".stmTN2").textContent="("+(ti+1)+"/"+TARGETS.length+") "+t.note;
      tgt.hidden=false;tgt.style.left=t.t+"%";tgt.setAttribute("title","target "+t.t+"%");
      sel=0;pick(h,"[data-g]",el(h,'[data-g="0"]'));sluiceSet(h,0,t.head);locked=false;
      stat.textContent="Adjust the gate until the flow meter reaches the TARGET mark.";
    }
    show();
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-g]");if(!b||locked)return;
      var i=+b.dataset.g,t=TARGETS[ti],flow;pick(h,"[data-g]",b);flow=sluiceSet(h,i,t.head);ctx.sfx("gate");
      if(flow===t.t){
        locked=true;ctx.sfx("good");stat.textContent="✅ TARGET HIT! Flow is "+flow+"%.";ctx.why(t.head<1?"sluice.lowhead":"sluice.more");ctx.react("sluice.controlled","Now THAT looks like controlled flow!");
        if(ti>=TARGETS.length-1){stat.textContent="✅ "+G.stations.sluice.challenge.success;finish(ctx);}
        else ctx.after(function(){ti++;show();},1600);
      }else if(flow>t.t+25){ctx.sfx("oops");stat.textContent="🌊 Too much flow ("+flow+"%). Close the gate a bit.";ctx.react("sluice.highFlow","WHOA! That's a LOT of water!");ctx.why("sluice.more");}
      else{stat.textContent=flow>t.t?"⬇️ A bit too much ("+flow+"%). Try a smaller opening.":"⬆️ Not enough yet ("+flow+"%). Open the gate more.";ctx.why(flow>t.t?"sluice.less":"sluice.more");}
    });
  });

  /* ================= ⚙️ TURBINE / WATERWHEEL — ENERGY LAB ================= */
  var SPEED=["STOPPED","SLOW","SLOW","MEDIUM","MEDIUM","FAST","FAST","FAST","SUPER FAST"];
  var HOMES=5;
  function homesFor(power){return clamp(Math.floor(power*5/6),0,HOMES);}
  function wheelBase(h){
    var sp="",pads="";for(var i=0;i<8;i++){var a=i*Math.PI/4;sp+='<line x1="0" y1="0" x2="'+(Math.cos(a)*40).toFixed(1)+'" y2="'+(Math.sin(a)*40).toFixed(1)+'" stroke="#6b4322" stroke-width="4"/>';}
    for(var j=0;j<12;j++)pads+='<rect x="-5" y="-52" width="10" height="13" rx="2" fill="#8a5a2e" transform="rotate('+(j*30)+')"/>';
    h.innerHTML='<svg class="stmViz" viewBox="0 0 320 170" role="img" aria-label="Water falling onto a turbine wheel that powers a town">'+
      '<rect x="0" y="150" width="320" height="20" fill="#3b2a1a"/><path class="stmChute" d="M0 60 L120 60 L150 78" fill="none" stroke="#5fe6ff" stroke-width="8" stroke-linecap="round" opacity="0"/>'+
      '<g transform="translate(210 96)"><g class="stmWheelG"><circle r="46" fill="none" stroke="#7a4b25" stroke-width="6"/>'+sp+pads+'<circle r="7" fill="#3a2a1a" stroke="#c9922e" stroke-width="2"/></g></g>'+
      '<g class="stmGenFlash" opacity="0"><text x="268" y="40" font-size="22">⚡</text></g></svg>'+
      '<div class="stmSpeed" aria-live="polite"></div>'+
      '<div class="stmChain5"><span data-k="0">💧 MOVING WATER</span><em>↓</em><span data-k="1">⚙️ TURBINE</span><em>↓</em><span data-k="2">🔄 ROTATION</span><em>↓</em><span data-k="3">⚡ GENERATOR</span><em>↓</em><span data-k="4">💡 ELECTRICITY</span></div>'+
      '<div class="stmEnergy"><div>⚡ POWER OUTPUT <b class="stmEN">0</b>%</div><div class="stmBar" role="progressbar" aria-label="Power output" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="stmEB"></i></div></div>'+
      '<div class="stmTown" aria-label="Town lights">'+new Array(HOMES+1).join("").split("").map(function(_,k){return '<span class="stmHome" data-hm="'+k+'"><i>🏠</i><b>🌑</b></span>';}).join("")+'</div><div class="stmTownTxt" aria-live="polite"></div>'+
      '<div class="stmStat" role="status" aria-live="polite"></div>';
  }
  function wheelCtl(){
    return '<div class="stmLbl">🚪 WATER FLOW (GATE)</div><div class="stmRow c5 stmGateRow">'+GATE.map(function(g,i){return btn(i===0?"sel":"",g.txt,'data-f="'+i+'" aria-pressed="'+(i===0)+'"');}).join("")+'</div>'+
      '<div class="stmLbl">🎓 BIG KIDS: FLOW + HEIGHT → ENERGY</div><div class="stmRow c2 stmHt">'+btn("sel","⬇️ LOW DROP",'data-h="1" aria-pressed="true"')+btn("","⬇️⬇️ HIGH DROP",'data-h="2" aria-pressed="false"')+'</div>';
  }
  function wheelLab(mission){
    return function(ctx){
      var h=ctx.host,flow=0,ht=1,out=0,tried={},nt=0,won=false,hold=0,lastHomes=0,fp=free(ctx);
      wheelBase(h);h.insertAdjacentHTML("beforeend",wheelCtl());
      var wg=el(h,".stmWheelG"),stat=el(h,".stmStat");
      stat.textContent=mission?"Light up all 5 homes! Hold full power for 3 seconds.":"Open the gate to send water to the turbine.";
      function paint(){
        var p=flow*ht;wg.style.animationDuration=p?(7/p).toFixed(2)+"s":"0s";wg.classList.toggle("go",p>0&&!ctx.reduced);
        el(h,".stmChute").setAttribute("opacity",flow?1:0);
        el(h,".stmSpeed").innerHTML='⚙️ TURBINE: <b>'+SPEED[p]+'</b> <small>(FLOW '+flow+' × DROP '+ht+')</small>';
        var en=Math.round(out),homes=homesFor(out/12.5);el(h,".stmEN").textContent=en;el(h,".stmEB").style.width=en+"%";el(h,".stmEB").parentNode.setAttribute("aria-valuenow",en);
        [].forEach.call(h.querySelectorAll(".stmChain5 span"),function(s,k){s.classList.toggle("on",k===0?flow>0:k<=2?p>0:k===3?out>40:homes>0);});
        [].forEach.call(h.querySelectorAll(".stmHome"),function(s,k){var on=k<homes;s.classList.toggle("lit",on);s.querySelector("b").textContent=on?"💡":"🌑";});
        el(h,".stmTownTxt").textContent="TOWN LIGHTS "+homes+"/"+HOMES;
        el(h,".stmGenFlash").setAttribute("opacity",out>40?1:0);
        if(homes>lastHomes){ctx.sfx("zap");if(lastHomes===0)ctx.react("wheel.power","We made power!");}lastHomes=homes;
      }
      paint();
      h.addEventListener("click",function(e){
        var f=e.target.closest&&e.target.closest("[data-f]"),t=e.target.closest&&e.target.closest("[data-h]");
        if(f){var nf=+f.dataset.f;pick(h,"[data-f]",f);ctx.sfx("spin");
          stat.textContent=nf===0?"🔒 No flow — the turbine stops.":nf>=3?"🌊 Strong flow — the turbine spins fast!":"💧 A little flow — the turbine turns slowly.";
          ctx.why(nf===0?"wheel.stopped":nf>flow?"wheel.faster":"wheel.slower");
          if(nf>=3&&flow<3)ctx.react("wheel.fast","The turbine is accelerating — the generator is waking up!");
          flow=nf;
          if(flow>0&&!tried[flow]){tried[flow]=1;nt++;if(!mission&&!fp&&nt>=2){ctx.react("wheel.spinning","More flow, faster turbine. Moving water has energy!");finish(ctx);}}paint();}
        if(t){ht=+t.dataset.h;pick(h,"[data-h]",t);ctx.sfx("spin");ctx.why("wheel.height");paint();}
      });
      ctx.every(function(){
        if(won)return;
        var target=flow*ht*(100/8);out=out+(target-out)*.5;if(Math.abs(target-out)<1)out=target;paint();
        if(mission){
          if(homesFor(flow*ht)>=HOMES&&homesFor(out/12.5)>=HOMES){hold++;stat.textContent="🏘️ All homes lit! Hold it… "+hold+"/3";}else hold=0;
          if(hold>=3){won=true;stat.textContent="✅ "+G.stations.wheel.challenge.success;ctx.sfx("wow");ctx.why("wheel.lights");ctx.react("wheel.townLit","The whole town is glowing! POWER THE CITY complete!");finish(ctx);}
        }
      },500);
    };
  }
  G.registerLab("wheel",wheelLab(false));
  G.registerLab("wheel-power",wheelLab(true));

  /* ================= 🌎 OCEAN — WATER STEWARDSHIP LAB ================= */
  var NODES=[["🧱","DAM",0],["🏞️","RIVER",1],["🌾","WETLAND",2],["🌊","ESTUARY",2],["🌎","OCEAN",2]];
  var LIFE=[["fish","🐟","FISH"],["plants","🌱","PLANTS"],["frogs","🐸","FROGS"],["birds","🦆","BIRDS"],["beaver","🦫","BEAVER"],["town","🏘️","COMMUNITY"]];
  function oceanState(r){
    var lowT=["⚠️","TOO LITTLE WATER"],hiT=["⚠️","WASHED OUT"];
    function band(lo,hi,okT){return r<lo?lowT:r>hi?hiT:["✅",okT];}
    return {
      fish:band(2,4,"HAPPY"),plants:band(2,4,"GREEN"),frogs:r<2?["⚠️","DRY POND"]:r>3?["⚠️","FLOODED POND"]:["✅","SINGING"],
      birds:band(2,4,"VISITING"),beaver:r<2?["⚠️","LODGE DRY"]:r>4?["⚠️","LODGE FLOODED"]:["✅","BUILDING"],
      town:r>3?["⚠️","WATER RUNNING LOW"]:["✅","HAS WATER"],
      ok:r>=2&&r<=3
    };
  }
  function oceanBase(h){
    h.innerHTML='<div class="stmFlowRow" aria-label="Water path from the dam to the ocean">'+NODES.map(function(n,i){return (i?'<em>→</em>':'')+'<span class="stmNode" data-n="'+i+'"><i>'+n[0]+'</i><small>'+n[1]+'</small></span>';}).join("")+'</div>'+
      '<div class="stmRiver"><i></i></div><div class="stmHealthy" hidden>🌱🐟🦆 HEALTHY RIVER</div>'+
      '<div class="stmLife">'+LIFE.map(function(l){return '<div data-l="'+l[0]+'"><i>'+l[1]+'</i><b>'+l[2]+'</b><span></span></div>';}).join("")+'</div>'+
      '<div class="stmStat" role="status" aria-live="polite"></div><div class="stmLbl">💧 WATER RELEASED DOWNSTREAM</div>'+
      '<div class="stmRow c6 stmRelRow">'+[0,1,2,3,4,5].map(function(n){return btn("",'<b>'+n+'</b>','data-r="'+n+'" aria-pressed="false" aria-label="Release '+n+'"');}).join("")+'</div>';
  }
  function oceanPaint(h,r){
    var s=oceanState(r);
    [].forEach.call(h.querySelectorAll(".stmNode"),function(n,i){n.classList.toggle("lit",r>=NODES[i][2]&&(i===0||r>=1));});
    LIFE.forEach(function(l){var d=el(h,'[data-l="'+l[0]+'"]'),v=s[l[0]];d.querySelector("span").textContent=v[0]+" "+v[1];d.classList.toggle("bad",v[0]==="⚠️");d.classList.toggle("good",v[0]==="✅");});
    var riv=el(h,".stmRiver");riv.className="stmRiver f"+r;el(h,".stmHealthy").hidden=!s.ok;
    [].forEach.call(h.querySelectorAll("[data-r]"),function(b){var on=+b.dataset.r===r;b.classList.toggle("sel",on);b.setAttribute("aria-pressed",on);});
    return s;
  }
  function oceanWhy(r){return r<2?"ocean.low":r>4?"ocean.high":r>3?"ocean.town":"ocean.healthy";}
  G.registerLab("ocean",function(ctx){
    var h=ctx.host,tried={},n=0,fp=free(ctx);oceanBase(h);var stat=el(h,".stmStat");stat.textContent="Pick how much water to release. Try a few!";oceanPaint(h,0);
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-r]");if(!b)return;var r=+b.dataset.r;ctx.sfx("water");oceanPaint(h,r);
      stat.textContent=r<2?"🏜️ Too little: fish struggle and the wetland dries out.":r>4?"🌊 Too much: the river rises fast.":r>3?"🏘️ Nature is fine, but the town is running low.":"🌎 The water reaches the ocean and life lights up!";
      ctx.why(oceanWhy(r));if(r<2)ctx.react("ocean.low","Uh-oh, the fish are struggling!");else if(r>4)ctx.react("ocean.flood","Too much, too fast!");else if(r>=2&&r<=3)ctx.react("ocean.arrival","The water reaches the ocean!");
      if(!tried[r]){tried[r]=1;n++;if(!fp&&n>=3){ctx.react("ocean.arrival","Water doesn't disappear — it keeps going downstream!");finish(ctx);}}});
  });
  G.registerLab("ocean-balance",function(ctx){
    var h=ctx.host,r=0,hold=0,won=false;oceanBase(h);var stat=el(h,".stmStat");
    h.insertAdjacentHTML("beforeend",'<div class="stmProg" aria-live="polite">HEALTHY FOR <b class="stmHN">○○○</b></div>');
    stat.textContent="Find a release that is healthy for BOTH nature and the community. Then hold it!";oceanPaint(h,0);
    h.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-r]");if(!b||won)return;r=+b.dataset.r;hold=0;ctx.sfx("water");var s=oceanPaint(h,r);
      el(h,".stmHN").textContent="○○○";ctx.why(oceanWhy(r));
      stat.textContent=s.ok?"✅ Healthy for nature AND the community. Hold it!":r<2?"🏜️ Not enough water for nature yet.":r>4?"🌊 Too much — the river floods.":"🏘️ The community is running low. Release a bit less.";});
    ctx.every(function(){
      if(won)return;var s=oceanState(r);
      if(s.ok){hold++;el(h,".stmHN").textContent=new Array(hold+1).join("●")+new Array(Math.max(0,3-hold)+1).join("○");
        if(hold>=3){won=true;[].forEach.call(h.querySelectorAll(".stmLife div"),function(d){d.classList.add("glow");});stat.textContent="✅ "+G.stations.ocean.challenge.success;ctx.sfx("wow");ctx.why("ocean.healthy");ctx.react("ocean.healthy","Look — the whole ecosystem lights up!");finish(ctx);}}
    },1000);
  });
})();
