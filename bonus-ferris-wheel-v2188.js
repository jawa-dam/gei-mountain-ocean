/* V2.1.88 — DAM FLOW BONUS FERRIS WHEEL 💧🎡
 *
 * The bonus waterwheel becomes a circus Ferris wheel powered by water. The prize logic, odds, commit and reveal in
 * index.html are untouched — this file only ADDS scenery and physics-flavoured animation on top of the existing SVG:
 *
 *   • circus A-frame + striped legs behind the wheel, blinking rim bulbs on it
 *   • 8 water cups (gondolas) hanging from the rim; they stay upright while the wheel turns
 *   • a spout fills each cup as it climbs the left side; past the top it tips and spills; the water falls and SPLASHES in a tray
 *   • everything driven by ONE requestAnimationFrame loop that only runs while the wheel is turning; a small, reused pool of
 *     SVG droplets/splashes (≈14 elements); no per-particle DOM growth
 *   • splash sounds use the game's existing synthesized water SFX (SFX bus), throttled
 *   • reduced motion: no tipping, no falling water, a handful of soft splashes only
 */
(function(){
  "use strict";
  if(window.GEI_FERRIS) return;
  var NS="http://www.w3.org/2000/svg",N=8,R=148;
  var cups=[],drops=[],splashes=[],loop=0,lastSplashSfx=0,lastT=0,emitAt={};
  function $(id){return document.getElementById(id);}
  function el(tag,attrs,parent){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
  function reduced(){try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}
  function css(){
    if($("geiFerrisStyle"))return;
    var s=document.createElement("style");s.id="geiFerrisStyle";
    s.textContent=
      ".bwFerrisLeg{stroke:#ff5a5a;stroke-width:7;stroke-linecap:round;stroke-dasharray:10 10}.bwFerrisLegBack{stroke:#fff;stroke-width:7;stroke-linecap:round}"+
      ".bwFerrisBase{fill:#ffd76a;stroke:#fff;stroke-width:2}"+
      ".bwBulb{fill:#fff6b0;animation:bwBulbBlink 1.1s steps(2,end) infinite}.bwBulb:nth-child(even){animation-delay:.55s}"+
      "@keyframes bwBulbBlink{0%{opacity:1}50%{opacity:.25}100%{opacity:1}}"+
      ".bonusCard:not(.show) .bwBulb,.bonusCard:not(.show) .bwStream{animation:none}"+
      ".bwCup .cupBody{fill:#ffd76a;stroke:#fff;stroke-width:1.4}.bwCup .cupWater{fill:#4fd6ff}.bwCup .cupRim{fill:none;stroke:#fff;stroke-width:1.6;stroke-linecap:round}"+
      ".bwCup .cupHang{stroke:#fff;stroke-width:1.4}"+
      ".bwStream{stroke:#7fe0ff;stroke-width:3;stroke-linecap:round;stroke-dasharray:5 5;opacity:0;animation:bwStreamFlow .35s linear infinite}"+
      ".bonusCard.ferrisSpin .bwStream{opacity:.9}.bwSpout{fill:#c9d7ff;stroke:#fff;stroke-width:1.4}"+
      "@keyframes bwStreamFlow{to{stroke-dashoffset:-10}}"+
      ".bwTray{fill:rgba(79,214,255,.55);stroke:#fff;stroke-width:1.4}"+
      ".bwDrop{fill:#9fe8ff;opacity:0}.bwDrop.go{animation:bwDropFall var(--t,.5s) cubic-bezier(.5,0,.9,.6) forwards}"+
      "@keyframes bwDropFall{0%{opacity:1;transform:translate(0,0)}100%{opacity:1;transform:translate(var(--dx,0px),var(--dy,90px))}}"+
      ".bwSplash{fill:none;stroke:#d8f6ff;stroke-width:2.4;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:50% 100%}.bwSplash.go{animation:bwSplashArc .42s ease-out forwards}"+
      "@keyframes bwSplashArc{0%{opacity:.95;transform:scale(.3)}100%{opacity:0;transform:scale(1.5) translateY(-6px)}}"+
      ".bwSpark{fill:#fff;opacity:0}.bonusCard.ferrisSpin .bwSpark{animation:bwSparkle 1.2s ease-in-out infinite}.bwSpark:nth-child(2){animation-delay:.4s}.bwSpark:nth-child(3){animation-delay:.8s}"+
      "@keyframes bwSparkle{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:.95;transform:scale(1)}}"+
      "@media(prefers-reduced-motion:reduce){.bwBulb,.bwStream,.bwSpark{animation:none!important}.bwSplash.go,.bwDrop.go{animation-duration:.01s!important}}";
    document.head.appendChild(s);
  }

  /* ---- build (once): backdrop + cups + fx. Safe to call again; it never duplicates. */
  function build(){
    var svg=document.querySelector("#bonusCard .bwWheel"),rotor=$("bwRotor");
    if(!svg||!rotor||$("bwFerrisBack"))return false;
    css();
    var defs=el("defs",{},svg);
    var cp=el("clipPath",{id:"bwCupClip"},defs);el("path",{d:"M-9 0 L9 0 L6.5 16 L-6.5 16 Z"},cp);
    /* circus frame behind the wheel */
    var back=el("g",{id:"bwFerrisBack","aria-hidden":"true"});
    el("line",{class:"bwFerrisLegBack",x1:0,y1:0,x2:-98,y2:158},back);el("line",{class:"bwFerrisLegBack",x1:0,y1:0,x2:98,y2:158},back);
    el("line",{class:"bwFerrisLeg",x1:0,y1:0,x2:-98,y2:158},back);el("line",{class:"bwFerrisLeg",x1:0,y1:0,x2:98,y2:158},back);
    el("rect",{class:"bwFerrisBase",x:-112,y:156,width:224,height:7,rx:3},back);
    svg.insertBefore(back,rotor);
    /* rim bulbs + cups ride the rotor */
    var bulbs=el("g",{"aria-hidden":"true"},rotor);
    for(var i=0;i<16;i++){var a=i*22.5*Math.PI/180;el("circle",{class:"bwBulb",cx:(Math.sin(a)*154).toFixed(1),cy:(-Math.cos(a)*154).toFixed(1),r:2.4},bulbs);}
    var cg=el("g",{id:"bwCups","aria-hidden":"true"},rotor);
    cups=[];
    for(var k=0;k<N;k++){
      var base=k*360/N;
      var outer=el("g",{transform:"rotate("+base+") translate(0 "+(-R)+")"},cg);
      var inner=el("g",{class:"bwCup"},outer);
      el("line",{class:"cupHang",x1:0,y1:-6,x2:0,y2:0},inner);
      var body=el("g",{},inner);
      el("path",{class:"cupBody",d:"M-9 0 L9 0 L6.5 16 L-6.5 16 Z"},body);
      var wg=el("g",{"clip-path":"url(#bwCupClip)"},body);
      var water=el("rect",{class:"cupWater",x:-10,y:16,width:20,height:0},wg);
      el("path",{class:"cupRim",d:"M-10 0 L10 0"},body);
      cups.push({base:base,inner:inner,body:body,water:water,f:0,tilt:0,spilled:0});
    }
    /* water source (upper-left corner), tray + particle pools in wheel space, above the rotor */
    var fx=el("g",{id:"bwFerrisFx","aria-hidden":"true"});
    el("path",{class:"bwSpout",d:"M-156 -112 L-134 -112 L-134 -104 L-141 -98 L-149 -98 L-156 -104 Z"},fx);
    el("line",{class:"bwStream",x1:-141,y1:-98,x2:-141,y2:-62},fx);
    el("path",{class:"bwTray",d:"M70 152 L158 152 L158 164 L70 164 Z"},fx);
    for(var d=0;d<10;d++)drops.push(el("circle",{class:"bwDrop",r:2.8,cx:0,cy:0},fx));
    for(var q=0;q<4;q++)splashes.push(el("path",{class:"bwSplash",d:"M-9 0 Q-5 -11 0 0 Q5 -11 9 0"},fx));
    var sp=el("g",{"aria-hidden":"true"},fx);for(var j=0;j<3;j++)el("circle",{class:"bwSpark",cx:[-120,118,0][j],cy:[-100,-110,-124][j],r:2},sp);
    svg.insertBefore(fx,svg.querySelector(".bwPointer"));
    drops.forEach(function(c){c.addEventListener("animationend",function(){landed(c);});});
    return true;
  }

  /* ---- physics-flavoured model: fill on the left climb, hold over the top, tip + spill on the right descent */
  function ramp(x,a,b){return Math.max(0,Math.min(1,(x-a)/(b-a)));}
  function model(phi){
    var f,tilt=0;
    if(phi>=274&&phi<=304)f=ramp(phi,274,304);                       // filling under the spout (upper-left)
    else if(phi>304||phi<70)f=1;                                     // carried full over the top
    else if(phi>=70&&phi<150){f=1-ramp(phi,92,148);tilt=ramp(phi,70,100)*(1-ramp(phi,132,160))*(reduced()?0:46);}   // tipping + spilling
    else f=0;                                                        // empty on the way back down
    return {f:f,tilt:tilt};
  }
  function angle(){
    var r=$("bwRotor");if(!r)return 0;
    var m=getComputedStyle(r).transform;if(!m||m==="none")return 0;
    var v=m.match(/matrix\(([^)]+)\)/);if(!v)return 0;var p=v[1].split(",").map(parseFloat);
    return Math.atan2(p[1],p[0])*180/Math.PI;
  }
  function spawn(x,y,landX){
    var d=null;for(var i=0;i<drops.length;i++)if(!drops[i].classList.contains("go")){d=drops[i];break;}
    if(!d)return;
    var tray=156,dy=Math.max(20,tray-y);
    d.setAttribute("cx",x.toFixed(1));d.setAttribute("cy",y.toFixed(1));
    d.style.setProperty("--dx",(landX-x).toFixed(1)+"px");d.style.setProperty("--dy",dy.toFixed(1)+"px");d.style.setProperty("--t",Math.max(.3,Math.sqrt(dy/160)*.7).toFixed(2)+"s");
    d.dataset.lx=landX.toFixed(1);d.classList.remove("go");void d.getBBox();d.classList.add("go");
  }
  function landed(c){
    c.classList.remove("go");
    var sp=null;for(var i=0;i<splashes.length;i++)if(!splashes[i].classList.contains("go")){sp=splashes[i];break;}
    if(!sp)return;
    var x=Math.max(78,Math.min(150,parseFloat(c.dataset.lx)||110));
    sp.setAttribute("transform","translate("+x.toFixed(1)+" 152)");sp.classList.remove("go");void sp.getBBox();sp.classList.add("go");
    sp.addEventListener("animationend",function h(){sp.classList.remove("go");sp.removeEventListener("animationend",h);});
    var now=Date.now();
    if(now-lastSplashSfx>260){lastSplashSfx=now;try{if(typeof playWaterNoise==="function")playWaterNoise(.22,500,2600,.045);}catch(e){}}   // existing SFX → SFX bus
  }
  function frame(t){
    loop=0;
    if(spinning())lastT=t;
    var th=angle(),rot=$("bwRotor");
    if(!rot||!$("bonusCard").classList.contains("show")){return;}
    var rm=reduced();
    cups.forEach(function(c,idx){
      var abs=c.base+th,phi=((abs%360)+360)%360,m=model(phi);
      c.f=m.f;c.tilt=m.tilt;
      c.inner.setAttribute("transform","rotate("+(-abs).toFixed(2)+")");                       // gondolas stay upright
      c.body.setAttribute("transform",c.tilt?"rotate("+c.tilt.toFixed(1)+" 0 8)":"");           // …until they tip to spill
      var h=16*c.f;c.water.setAttribute("y",(16-h).toFixed(2));c.water.setAttribute("height",h.toFixed(2));
      if(c.f>.12&&phi>=96&&phi<150&&c.tilt>6&&(!rm||phi<104)){                                   // spilling: droplets leave the lip
        if(!emitAt[idx]||t-emitAt[idx]>(rm?400:110)){
          emitAt[idx]=t;
          var a=abs*Math.PI/180,px=R*Math.sin(a),py=-R*Math.cos(a);
          spawn(px+8,py+10,Math.max(80,Math.min(148,px+10+Math.random()*16)));
        }
      }
    });
    if(spinning()||t-lastT<400)loop=requestAnimationFrame(frame);
  }
  function spinning(){try{return bonus.spinning;}catch(e){return false;}}
  function start(){
    var card=$("bonusCard");if(!card)return;
    card.classList.add("ferrisSpin");
    if(!loop){lastT=performance.now();loop=requestAnimationFrame(function tick(t){lastT=spinning()?t:lastT;frame(t);});}
  }
  function settle(){var card=$("bonusCard");if(card)card.classList.remove("ferrisSpin");}

  /* ---- hooks: wrap the existing functions, never replace their behaviour */
  function wrap(name,fn){
    var o=window[name];if(typeof o!=="function"||o.__ferris)return false;
    var w=function(){var out=o.apply(this,arguments);try{fn.apply(null,[out].concat([].slice.call(arguments)));}catch(e){}return out;};
    w.__ferris=true;window[name]=w;return true;
  }
  function boot(){
    wrap("buildBonusWheel",function(){if(!build()){}requestAnimationFrame(frame);});
    wrap("spinBonusWheel",function(result){if(result)start();});
    wrap("revealBonusResult",function(){settle();requestAnimationFrame(frame);});
    wrap("continueFromBonus",function(){settle();});
  }
  window.GEI_FERRIS={version:"V2.1.88",build:build,selfTest:function(){return {built:!!$("bwFerrisBack"),cups:cups.length,drops:drops.length,splashes:splashes.length,running:!!loop};}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
