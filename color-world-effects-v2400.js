/* V2.4.00 — COLOR WORLD COSMETIC EFFECTS (presentation-only) */
(function(){
"use strict";
var VERSION="2.4.00";
var MAX_TAP=5;
var MAX_AMBIENT=3;
var Z=122;
var tapCount=0;
var ambientCount=0;
var reducedMotion=false;

try{reducedMotion=window.matchMedia("(prefers-reduced-motion:reduce)").matches}catch(e){}

function skin(){return(document.documentElement.dataset.skin||"rainbow")}

function cssVar(n){
  try{return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}catch(e){return""}
}

function injectCSS(){
  if(document.getElementById("cweFx2400"))return;
  var s=document.createElement("style");s.id="cweFx2400";
  s.textContent=
    ".cwe-p{position:fixed;pointer-events:none;z-index:"+Z+";will-change:transform,opacity}"+
    ".cwe-amb{position:fixed;pointer-events:none;z-index:"+(Z-1)+";will-change:transform,opacity;opacity:0}"+
    "@keyframes cwRise{0%{transform:translate(0,0) scale(1);opacity:.9}to{transform:translate(var(--dx,0),var(--dy,-60px)) scale(var(--es,.3));opacity:0}}"+
    "@keyframes cwPop{0%{transform:scale(0);opacity:.8}40%{transform:scale(1.2);opacity:.9}to{transform:scale(1.6);opacity:0}}"+
    "@keyframes cwFlutter{0%{transform:translate(0,0) rotate(0);opacity:.8}to{transform:translate(var(--dx,20px),var(--dy,80px)) rotate(var(--rot,120deg));opacity:0}}"+
    "@keyframes cwSplash{0%{transform:scale(.5);opacity:.85}to{transform:scale(2.2);opacity:0}}"+
    "@keyframes cwStar{0%{transform:scale(0) rotate(0);opacity:.9}50%{transform:scale(1.3) rotate(180deg);opacity:.8}to{transform:scale(.2) rotate(360deg);opacity:0}}"+
    "@keyframes cwConfetti{0%{transform:translate(0,0) rotate(0);opacity:1}to{transform:translate(var(--cx,0),var(--cy,120px)) rotate(var(--cr,400deg));opacity:0}}"+
    "@keyframes cwFloat{0%,to{transform:translate(0,0);opacity:.18}50%{transform:translate(var(--fx,10px),var(--fy,-30px));opacity:.25}}"+
    "@keyframes cwTwinkle{0%,to{opacity:.1;transform:scale(.7)}50%{opacity:.35;transform:scale(1)}}"+
    "@keyframes cwDrift{0%{transform:translateX(-10vw);opacity:.2}50%{opacity:.3}to{transform:translateX(110vw) translateY(var(--dfy,-20px));opacity:.1}}"+
    "@keyframes cwFlash{0%{opacity:.5}to{opacity:0}}"+
    "@media(prefers-reduced-motion:reduce){.cwe-p,.cwe-amb{animation:none!important;transition:none!important}}";
  document.head.appendChild(s);
}

function mkEl(cls,x,y,w,h,bg,anim,dur){
  var d=document.createElement("div");
  d.className="cwe-p "+cls;
  d.style.cssText="left:"+x+"px;top:"+y+"px;width:"+w+"px;height:"+h+"px;background:"+bg+";animation:"+anim+" "+dur+"s ease-out forwards";
  var cleanup=function(){if(d.parentNode){d.remove();tapCount=Math.max(0,tapCount-1)}};
  d.addEventListener("animationend",cleanup,{once:true});
  setTimeout(cleanup,Math.ceil(dur*1000)+500);
  return d;
}

var WORLD_TAP={
  rainbow:function(x,y){
    var colors=["#2fd2ff","#ffd76a","#ff9df2","#7a5cff","#f310ba"];
    var n=3+Math.floor(Math.random()*2);
    for(var i=0;i<n&&tapCount<MAX_TAP;i++){
      tapCount++;
      var c=colors[i%colors.length];
      var el=mkEl("",x-8,y-8,16,16,c,"cwSplash",.6+Math.random()*.3);
      el.style.borderRadius="50%";
      el.style.animationDelay=(i*60)+"ms";
      document.body.appendChild(el);
    }
  },
  bubble:function(x,y){
    var n=3+Math.floor(Math.random()*2);
    for(var i=0;i<n&&tapCount<MAX_TAP;i++){
      tapCount++;
      var sz=8+Math.random()*10;
      var el=mkEl("",x-sz/2,y-sz/2,sz,sz,"radial-gradient(circle,rgba(255,255,255,.6),rgba(0,200,232,.3))","cwPop",.5+Math.random()*.3);
      el.style.borderRadius="50%";
      el.style.border="1.5px solid rgba(255,255,255,.5)";
      document.body.appendChild(el);
    }
  },
  candy:function(x,y){
    var colors=["#ffb0e0","#e8d0ff","#ffe870","#ff70c0"];
    var n=3+Math.floor(Math.random()*2);
    for(var i=0;i<n&&tapCount<MAX_TAP;i++){
      tapCount++;
      var c=colors[Math.floor(Math.random()*colors.length)];
      var dx=(Math.random()-.5)*40;
      var dy=-20-Math.random()*40;
      var el=mkEl("",x-4,y-4,8,8,c,"cwRise",.6+Math.random()*.2);
      el.style.setProperty("--dx",dx+"px");el.style.setProperty("--dy",dy+"px");
      el.style.setProperty("--es",String(.2+Math.random()*.4));
      el.style.borderRadius=Math.random()>.5?"50%":"2px";
      document.body.appendChild(el);
    }
  },
  forest:function(x,y){
    var greens=["#6aaa58","#3a7a30","#e8a020","#ffd040"];
    var n=2+Math.floor(Math.random()*2);
    for(var i=0;i<n&&tapCount<MAX_TAP;i++){
      tapCount++;
      var c=greens[Math.floor(Math.random()*greens.length)];
      var dx=(Math.random()-.5)*50;
      var dy=40+Math.random()*40;
      var rot=60+Math.random()*200;
      var el=mkEl("",x-5,y-5,10,10,c,"cwFlutter",.8+Math.random()*.4);
      el.style.setProperty("--dx",dx+"px");el.style.setProperty("--dy",dy+"px");
      el.style.setProperty("--rot",rot+"deg");
      el.style.borderRadius="40% 60% 50% 50%";
      document.body.appendChild(el);
    }
  },
  mountain:function(x,y){
    var n=3+Math.floor(Math.random()*2);
    for(var i=0;i<n&&tapCount<MAX_TAP;i++){
      tapCount++;
      var sz=6+Math.random()*6;
      var dx=(Math.random()-.5)*30;
      var dy=-30-Math.random()*30;
      var el=mkEl("",x-sz/2,y-sz/2,sz,sz,"rgba(48,176,240,.7)","cwRise",.5+Math.random()*.3);
      el.style.setProperty("--dx",dx+"px");el.style.setProperty("--dy",dy+"px");
      el.style.borderRadius="50%";
      document.body.appendChild(el);
    }
  },
  magic:function(x,y){
    var colors=["#a070ff","#e060d0","#60c8e8","#ffe070"];
    var n=3+Math.floor(Math.random()*2);
    for(var i=0;i<n&&tapCount<MAX_TAP;i++){
      tapCount++;
      var c=colors[Math.floor(Math.random()*colors.length)];
      var el=mkEl("",x-5,y-5,10,10,c,"cwStar",.6+Math.random()*.3);
      el.style.clipPath="polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)";
      document.body.appendChild(el);
    }
  }
};

function handleTap(e){
  if(reducedMotion){
    var fl=document.createElement("div");
    fl.className="cwe-p";
    fl.style.cssText="left:0;top:0;right:0;bottom:0;background:rgba(255,255,255,.08);animation:cwFlash .3s ease-out forwards";
    fl.addEventListener("animationend",function(){fl.remove()},{once:true});
    document.body.appendChild(fl);
    return;
  }
  var s=skin();
  var fn=WORLD_TAP[s]||WORLD_TAP.rainbow;
  var x=e.clientX||0,y=e.clientY||0;
  if(e.touches&&e.touches[0]){x=e.touches[0].clientX;y=e.touches[0].clientY}
  fn(x,y);
}

function celebrate(){
  if(reducedMotion)return;
  var cx=window.innerWidth/2,cy=window.innerHeight/2;
  var accents=[
    cssVar("--water-bright")||"#2fd2ff",
    cssVar("--juicy-blue")||"#3d3dea",
    cssVar("--juicy-violet")||"#7a5cff",
    cssVar("--juicy-magenta")||"#f310ba",
    cssVar("--gold")||"#ffd76a"
  ];
  var n=8+Math.floor(Math.random()*5);
  for(var i=0;i<n;i++){
    var c=accents[i%accents.length];
    var angle=Math.random()*Math.PI*2;
    var dist=60+Math.random()*100;
    var cxv=Math.cos(angle)*dist;
    var cyv=Math.sin(angle)*dist+40;
    var cr=200+Math.random()*400;
    var el=document.createElement("div");
    el.className="cwe-p";
    var sz=6+Math.random()*8;
    el.style.cssText="left:"+cx+"px;top:"+cy+"px;width:"+sz+"px;height:"+sz+"px;background:"+c+
      ";border-radius:"+(Math.random()>.5?"50%":"2px")+
      ";animation:cwConfetti 1.2s cubic-bezier(.2,.8,.3,1) forwards;animation-delay:"+(i*30)+"ms";
    el.style.setProperty("--cx",cxv+"px");
    el.style.setProperty("--cy",cyv+"px");
    el.style.setProperty("--cr",cr+"deg");
    el.addEventListener("animationend",function(){this.remove()},{once:true});
    document.body.appendChild(el);
  }
}

var AMBIENT_SHAPES={
  rainbow:function(){return{bg:"linear-gradient(135deg,#ff5e7a,#ffd76a,#40c880,#2fd2ff,#7a5cff)",w:20,h:6,br:"3px",anim:"cwFloat",dur:6+Math.random()*4}},
  bubble:function(){return{bg:"radial-gradient(circle,rgba(255,255,255,.4),rgba(0,200,232,.15))",w:12+Math.random()*10,h:0,br:"50%",border:"1px solid rgba(255,255,255,.3)",anim:"cwFloat",dur:5+Math.random()*4}},
  candy:function(){return{bg:Math.random()>.5?"#ffb0e0":"#e8d0ff",w:6+Math.random()*5,h:0,br:Math.random()>.5?"50%":"2px",anim:"cwFloat",dur:5+Math.random()*3}},
  forest:function(){return{bg:Math.random()>.5?"#6aaa58":"#e8a020",w:8+Math.random()*6,h:0,br:"40% 60% 50% 50%",anim:"cwDrift",dur:12+Math.random()*8}},
  mountain:function(){return{bg:"rgba(255,255,255,.35)",w:30+Math.random()*30,h:8+Math.random()*6,br:"50%",anim:"cwDrift",dur:18+Math.random()*10}},
  magic:function(){return{bg:Math.random()>.5?"#a070ff":"#e060d0",w:4+Math.random()*4,h:0,br:"50%",anim:"cwTwinkle",dur:2+Math.random()*3}}
};

function spawnAmbient(){
  if(reducedMotion||ambientCount>=MAX_AMBIENT)return;
  var s=skin();
  var factory=AMBIENT_SHAPES[s]||AMBIENT_SHAPES.rainbow;
  var cfg=factory();
  var h=cfg.h||cfg.w;
  var el=document.createElement("div");
  el.className="cwe-amb";
  var lx=Math.random()*90+5;
  var ly=Math.random()*70+10;
  var fx=(Math.random()-.5)*30;
  var fy=-10-Math.random()*20;
  el.style.cssText="left:"+lx+"vw;top:"+ly+"vh;width:"+cfg.w+"px;height:"+h+"px;background:"+cfg.bg+
    ";border-radius:"+cfg.br+(cfg.border?";border:"+cfg.border:"")+
    ";animation:"+cfg.anim+" "+cfg.dur+"s ease-in-out infinite;opacity:.2";
  el.style.setProperty("--fx",fx+"px");
  el.style.setProperty("--fy",fy+"px");
  el.style.setProperty("--dfy",((Math.random()-.5)*40)+"px");
  ambientCount++;
  document.body.appendChild(el);
  setTimeout(function(){
    if(el.parentNode)el.remove();
    ambientCount=Math.max(0,ambientCount-1);
    setTimeout(function(){spawnAmbient()},2000+Math.random()*4000);
  },cfg.dur*3*1000);
}

function selfTest(){
  var w=document.querySelector(".world");
  return{
    version:VERSION,
    ok:!!w&&!!document.getElementById("cweFx2400"),
    skin:skin(),
    reducedMotion:reducedMotion,
    tapHandlerBound:!!w,
    ambientCount:ambientCount
  };
}

function boot(){
  if(window.__GEI_COLOR_WORLD_EFFECTS__)return;
  injectCSS();
  var w=document.querySelector(".world");
  if(w)w.addEventListener("pointerdown",handleTap,{passive:true});
  window.addEventListener("gei:milestone",celebrate);
  if(!reducedMotion){
    var count=2+Math.floor(Math.random()*2);
    for(var i=0;i<count&&i<MAX_AMBIENT;i++){
      setTimeout(spawnAmbient,1000+i*2000);
    }
  }
  window.__GEI_COLOR_WORLD_EFFECTS__=Object.freeze({
    version:VERSION,
    presentationOnly:true,
    selfTest:selfTest
  });
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});
else boot();
})();
