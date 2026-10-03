/* V2.1.89 — CINEMATIC 3D WATER ORIGIN SPLASH 🏔️🏗️💧🫙✨
 *
 * Story:  SOURCE (mountain) → ENGINEER (dam) → FLOW (released water) → CAPTURE (bottle) → BRAND (logo).
 *
 * This replaces the visual presentation of the old flat-SVG opening with a layered, camera-driven, 3D-style composition.
 * It is procedural (no downloads): a handful of pre-rendered 2D-canvas layers (sky, far range, lit hero mountain, forest,
 * lake + concrete dam, rocks) are composed every frame under a moving camera with parallax, plus a small dynamic layer
 * (gate releases, the flowing stream, a refracting transparent bottle that visibly fills, bubbles, spray, weather).
 * The old SVG splash is kept as the FALLBACK: if canvas is unavailable or anything throws, the "cine" class is removed
 * and the previous opening runs exactly as before.
 *
 *   0.0–1.0s  dark → mountain emerges            4.2–5.6s  stream hits the bottle, it splashes and FILLS
 *   1.0–2.0s  camera glides to the dam            5.0–6.4s  camera eases back; the Y'ALL TOO / game logo reveals
 *   2.0–3.0s  gates open, controlled release      6.4–7.4s  "GEI MOUNTAIN OCEAN", then straight into the game
 *   3.0–4.2s  water travels down to the bottle    (Skip works at any time; total ≈ 8s, shorter than the old 10s)
 *
 * Every launch picks one atmosphere (sunrise · daylight · golden · night · rain · snow) — the story never changes.
 * No environment titles are shown. Reduced motion shows the finished composition with a brief fade.
 * Presentation only: it never touches game state, economy, progression, saves or purchases.
 */
(function(){
  "use strict";
  var splash=document.getElementById("geiSplash");
  if(!splash||!splash.classList.contains("cine")||window.__GEI_CINE__)return;
  window.__GEI_CINE__={version:"V2.1.89"};
  var TOTAL_MS=8200;

  function fallback(why){
    try{splash.classList.remove("cine");}catch(e){}
    window.__GEI_CINE__.failed=String(why||"fallback");
    try{console.warn("[SPLASH] cinematic unavailable → classic opening ("+why+")");}catch(e){}
  }

  /* ------------------------------------------------------------------ helpers */
  function clamp(v,a,b){return v<a?a:v>b?b:v;}
  function lerp(a,b,t){return a+(b-a)*t;}
  function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}
  function seg(t,a,b){return clamp((t-a)/(b-a),0,1);}
  function mix3(a,b,t){return [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];}
  function rgb(c,a){return "rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+(a==null?1:a)+")";}
  var perm=new Uint8Array(512);(function(){var s=1337;for(var i=0;i<256;i++)perm[i]=i;for(var j=255;j>0;j--){s=(s*16807)%2147483647;var k=s%(j+1),t=perm[j];perm[j]=perm[k];perm[k]=t;}for(var q=0;q<256;q++)perm[q+256]=perm[q];})();
  function h2(x,y){return perm[(perm[x&255]+y)&255]/255;}
  function vn(x,y){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
    return lerp(lerp(h2(xi,yi),h2(xi+1,yi),u),lerp(h2(xi,yi+1),h2(xi+1,yi+1),u),v);}
  function fbm(x,y,o){var s=0,a=.5,f=1;for(var i=0;i<o;i++){s+=a*vn(x*f,y*f);f*=2.03;a*=.5;}return s;}

  /* ------------------------------------------------------------------ atmospheres (one per launch) */
  var ENVS={
    sunrise:{sky:[[22,28,70],[120,86,128],[255,170,120],[255,214,150]],sun:[255,200,130],sunX:.78,sunY:.5,sunI:1.05,haze:[255,190,150],rock:[1.05,.92,.88],water:[1.0,.92,.95],mist:.55,weather:null,amb:[1,.86,.8],star:0,stage:"sunrise"},
    daylight:{sky:[[58,128,214],[120,184,240],[190,225,248],[226,243,252]],sun:[255,248,225],sunX:.82,sunY:.12,sunI:1.0,haze:[200,225,245],rock:[1,1,1],water:[.95,1,1],mist:.4,weather:null,amb:[1,1,1],star:0,stage:"day"},
    golden:{sky:[[70,98,160],[196,150,130],[255,196,110],[255,226,160]],sun:[255,214,130],sunX:.2,sunY:.44,sunI:1.1,haze:[255,206,140],rock:[1.08,.96,.82],water:[1,.96,.88],mist:.5,weather:null,amb:[1.05,.94,.8],star:0,stage:"gold"},
    night:{sky:[[4,8,30],[12,24,64],[26,50,98],[42,72,120]],sun:[170,200,255],sunX:.76,sunY:.14,sunI:.55,haze:[40,70,130],rock:[.45,.55,.85],water:[.7,.9,1.1],mist:.45,weather:null,amb:[.5,.62,.95],star:1,stage:"night"},
    rain:{sky:[[60,70,86],[92,104,122],[132,146,160],[170,182,194]],sun:[200,215,230],sunX:.5,sunY:.1,sunI:.45,haze:[150,165,180],rock:[.72,.78,.84],water:[.85,.95,1],mist:.85,weather:"rain",amb:[.78,.84,.92],star:0,stage:"rain"},
    snow:{sky:[[120,150,190],[176,200,226],[214,228,242],[240,246,252]],sun:[240,246,255],sunX:.7,sunY:.14,sunI:.7,haze:[226,236,248],rock:[.9,.96,1.05],water:[.95,1,1.05],mist:.6,weather:"snow",amb:[.9,.96,1.04],star:0,stage:"snow"}
  };
  var NAMES=["sunrise","daylight","golden","night","rain","snow"];
  var forced=null;try{forced=new URLSearchParams(location.search).get("splashEnv");}catch(e){}
  var envName=(forced&&ENVS[forced])?forced:null;
  if(!envName){
    var last="";try{last=sessionStorage.getItem("geiCineEnv")||"";}catch(e){}
    var pool=NAMES.filter(function(n){return n!==last;});envName=pool[Math.floor(Math.random()*pool.length)];
  }
  try{sessionStorage.setItem("geiCineEnv",envName);}catch(e){}
  var ENV=ENVS[envName];
  window.__GEI_CINE__.env=envName;

  /* ------------------------------------------------------------------ canvas + sizing */
  var reduced=false;try{reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){}
  var cv=document.createElement("canvas");cv.id="geiCine";cv.setAttribute("aria-hidden","true");
  cv.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;opacity:0;transition:opacity .5s ease";
  var ctx=cv.getContext&&cv.getContext("2d",{alpha:false});
  if(!ctx){fallback("no 2d context");return;}
  splash.insertBefore(cv,splash.firstChild);
  (function(){var sub=splash.querySelector(".geiSplashSub");if(sub)sub.textContent="GEI MOUNTAIN OCEAN";var sk=document.getElementById("geiSplashSkip");if(sk)sk.setAttribute("aria-label","Skip the intro");})();

  var W=0,H=0,DPR=1,SW=0,SX=0,M=0,MY=0;
  var L={};                              // pre-rendered layers
  var ready=0,started=0,t0=0,raf=0,dead=false,lowQ=false,frames=0,slow=0,lastTs=0;
  function measure(){
    var r=splash.getBoundingClientRect();W=Math.max(240,Math.round(r.width||innerWidth));H=Math.max(360,Math.round(r.height||innerHeight));
    var maxPx=1250000;DPR=Math.min(window.devicePixelRatio||1,1.5);while(W*H*DPR*DPR>maxPx&&DPR>1)DPR-=.1;
    SW=Math.min(W,H*.62);SX=(W-SW)/2;M=Math.round(Math.max(W*.2,60));MY=Math.round(H*.12);
    cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
  }

  /* layer = offscreen canvas covering the screen + margins, in scene coordinates (origin = top-left of the screen) */
  function mkLayer(rs){
    var c=document.createElement("canvas");c.width=Math.round((W+2*M)*rs);c.height=Math.round((H+2*MY)*rs);
    var g=c.getContext("2d");g.scale(rs,rs);g.translate(M,MY);return {cv:c,g:g,rs:rs};
  }

  /* ------------------------------------------------------------------ geometry (fractions of the stage) */
  var G={};
  function geometry(){
    var w=SW,h=H,x0=SX;
    G.x0=x0;G.w=w;G.h=h;
    G.peakY=h*.30;G.baseY=h*.63;
    G.lakeY=h*.455;G.crestY=h*.468;G.damBaseY=h*.592;
    G.damL=x0+w*.40;G.damR=x0+w*1.02;
    G.gateX=[.30,.55,.80].map(function(u){return G.damL+(G.damR-G.damL)*u;});G.gateY=G.damBaseY-h*.045;G.gateW=w*.052;G.gateH=h*.032;
    G.bottle={cx:x0+w*.50,top:h*.668,w:w*.36,h:h*.275};
    G.path=[[G.gateX[1],G.damBaseY+4],[x0+w*.84,h*.620],[x0+w*.80,h*.636],[x0+w*.66,h*.640],[x0+w*.52,h*.648],[x0+w*.50,G.bottle.top-6]];
  }

  /* ------------------------------------------------------------------ static layer: sky */
  function renderSky(){
    var l=mkLayer(1),g=l.g,top=-MY,bot=H+MY;
    var gr=g.createLinearGradient(0,top,0,H*.66);
    gr.addColorStop(0,rgb(ENV.sky[0]));gr.addColorStop(.38,rgb(ENV.sky[1]));gr.addColorStop(.72,rgb(ENV.sky[2]));gr.addColorStop(1,rgb(ENV.sky[3]));
    g.fillStyle=gr;g.fillRect(-M,top,W+2*M,bot-top);
    g.fillStyle=rgb(mix3(ENV.sky[3],[8,20,30],.55));g.fillRect(-M,H*.62,W+2*M,bot);                     // ground band (covered by later layers)
    var sx=SX+SW*ENV.sunX,sy=H*ENV.sunY;
    var sg=g.createRadialGradient(sx,sy,0,sx,sy,H*.5);sg.addColorStop(0,rgb(ENV.sun,.55*ENV.sunI));sg.addColorStop(.25,rgb(ENV.sun,.2*ENV.sunI));sg.addColorStop(1,rgb(ENV.sun,0));
    g.fillStyle=sg;g.fillRect(-M,top,W+2*M,bot-top);
    if(ENV.star){for(var i=0;i<130;i++){var px=Math.random()*(W+2*M)-M,py=Math.random()*H*.5,r=Math.random()*1.2+.2;g.fillStyle="rgba(255,255,255,"+(.25+Math.random()*.6)+")";g.beginPath();g.arc(px,py,r,0,6.283);g.fill();}}
    if(ENV.stage==="night"||ENV.stage==="day"||ENV.stage==="sunrise"||ENV.stage==="gold"){                    // sun disc / moon
      var rd=ENV.stage==="night"?W*.045:W*.05;
      var dg=g.createRadialGradient(sx,sy,0,sx,sy,rd);
      if(ENV.stage==="night"){dg.addColorStop(0,"rgba(246,248,255,1)");dg.addColorStop(.85,"rgba(222,232,255,.95)");dg.addColorStop(1,"rgba(190,210,255,0)");}
      else{dg.addColorStop(0,"rgba(255,255,255,1)");dg.addColorStop(.6,rgb(ENV.sun,1));dg.addColorStop(1,rgb(ENV.sun,0));}
      g.fillStyle=dg;g.beginPath();g.arc(sx,sy,rd*1.6,0,6.283);g.fill();
    }
    L.sky=l;
  }

  /* ------------------------------------------------------------------ static layer: far range (hazy) */
  function renderFar(){
    var rs=.75,l=mkLayer(rs),g=l.g,w=W+2*M;
    function ridge(base,amp,seed,col,alpha){
      g.beginPath();g.moveTo(-M,H*.7);
      for(var x=-M;x<=W+M;x+=4){var n=fbm(x/90+seed,seed*3,4),y=base-amp*Math.pow(n,1.35)*1.7-amp*.25*Math.sin(x/(W*.17)+seed);g.lineTo(x,y);}
      g.lineTo(W+M,H*.7);g.closePath();
      var gr=g.createLinearGradient(0,base-amp*1.2,0,base+H*.08);gr.addColorStop(0,rgb(col,alpha));gr.addColorStop(1,rgb(ENV.haze,alpha*.9));g.fillStyle=gr;g.fill();
    }
    ridge(H*.43,H*.12,2.3,mix3(ENV.sky[2],[90,110,150],.45),.7);
    ridge(H*.48,H*.10,5.1,mix3(ENV.sky[2],[70,92,130],.6),.82);
    L.far=l;
  }

  /* ------------------------------------------------------------------ static layer: hero mountain (per-pixel lit relief) */
  var PEAKS=null;
  function topY(x){
    var best=1e9;
    for(var i=0;i<PEAKS.length;i++){var p=PEAKS[i],dx=(x-p.x)/(x<p.x?p.wl:p.wr),t=Math.max(0,1-Math.abs(dx)),y=G.baseY-(G.baseY-p.y)*Math.pow(t,p.e);if(y<best)best=y;}
    return best+(fbm(x/55,7.7,4)-.5)*G.h*.045+(fbm(x/14,3.1,3)-.5)*G.h*.008;
  }
  function renderMountain(){
    var rs=.8,l=mkLayer(rs),g=l.g;
    var x0=-M,x1=W+M,y0=Math.floor(G.peakY-G.h*.05),y1=Math.ceil(G.baseY+G.h*.05);
    var pw=Math.ceil((x1-x0)*rs),ph=Math.ceil((y1-y0)*rs);
    var img=g.createImageData(pw,ph),d=img.data;
    var sunL=[ -.55,-.62,.56 ];   // light from the upper right-ish (x flipped below)
    var sl=Math.sqrt(sunL[0]*sunL[0]+sunL[1]*sunL[1]+sunL[2]*sunL[2]);sunL=[sunL[0]/sl,sunL[1]/sl,sunL[2]/sl];
    var sunDir=ENV.sunX>.5?1:-1;
    var tops=new Float32Array(pw+2);for(var xi=0;xi<pw+2;xi++)tops[xi]=topY(x0+(xi-1)/rs);
    var rockDark=[54,50,56],rockLight=[170,156,146],snowL=[250,252,255],snowD=[150,176,214],forest=[34,56,44];
    var tint=ENV.rock,amb=ENV.amb,hz=ENV.haze;
    function zf(x,y){var a=fbm(x/46,y/58,5),b=Math.abs(fbm(x/30+11,y/36+4,4)-.5)*2;return a*70+(1-b)*34+fbm(x/9,y/9,3)*10;}
    for(var py=0;py<ph;py++){
      var y=y0+py/rs;
      for(var px=0;px<pw;px++){
        var x=x0+px/rs,top=tops[px+1],dy=y-top;
        var i4=(py*pw+px)*4;
        if(dy<-1){d[i4+3]=0;continue;}
        var cov=clamp(dy+1,0,1);
        var alt=clamp(1-(y-G.peakY)/(G.baseY-G.peakY),0,1);
        var zc=zf(x,y)+(dy<40?dy*.6:24),zx=zf(x+1.4,y)+(dy<40?dy*.6:24),zy=zf(x,y+1.4)+(dy<40?dy*.6:24);
        var gx=(zx-zc)*.9*sunDir,gy=(zy-zc)*.9;
        var nx=-gx,ny=-gy,nz=1,nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;
        var lam=clamp(nx*sunL[0]*(-sunDir)*-1+ny*sunL[1]+nz*sunL[2],0,1);
        var slope=(tops[Math.min(pw+1,px+3)]-tops[Math.max(0,px-1)]);
        lam=clamp(lam+(-slope*sunDir*.012)*Math.min(1,alt*1.6+.2),0,1);
        lam=.18+lam*.95;
        var tex=fbm(x/5,y/5,3);
        var rc=mix3(rockDark,rockLight,clamp(lam*(.75+tex*.5),0,1));
        rc=[rc[0]*tint[0],rc[1]*tint[1],rc[2]*tint[2]];
        var fm=smooth(seg(.34-alt,0,.2))*.9*(.55+tex*.6);                       // forest toward the base
        rc=mix3(rc,[forest[0]*tint[0]*(.6+lam),forest[1]*tint[1]*(.6+lam),forest[2]*tint[2]*(.6+lam)],clamp(fm,0,1));
        var sm=smooth(seg(alt+(fbm(x/22,y/22,4)-.5)*.5+(lam-.5)*.2,.56,.7));      // snow cap
        var sc=mix3(snowD,snowL,clamp(lam*1.1,0,1));
        var col=mix3(rc,sc,sm);
        if(dy<2.6)col=mix3(col,ENV.sun,.34*ENV.sunI*(1-dy/2.6));                    // rim light on the ridge
        var hh=clamp((1-alt)*.5*ENV.mist+.1,0,.75);
        col=mix3(col,hz,hh*.55);
        d[i4]=clamp(col[0]*amb[0],0,255);d[i4+1]=clamp(col[1]*amb[1],0,255);d[i4+2]=clamp(col[2]*amb[2],0,255);d[i4+3]=255*cov;
      }
    }
    var tmp=document.createElement("canvas");tmp.width=pw;tmp.height=ph;tmp.getContext("2d").putImageData(img,0,0);
    g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";
    g.drawImage(tmp,x0,y0,pw/rs,ph/rs);
    /* atmospheric haze veil + soft depth falloff at the foot */
    var hv=g.createLinearGradient(0,G.baseY-G.h*.16,0,G.baseY+G.h*.04);hv.addColorStop(0,rgb(hz,0));hv.addColorStop(1,rgb(hz,.5*ENV.mist+.1));
    g.fillStyle=hv;g.fillRect(x0,G.baseY-G.h*.16,x1-x0,G.h*.2);
    L.hero=l;
  }

  /* ------------------------------------------------------------------ static layer: forest ridge, lake, dam, rocks */
  function renderLand(){
    var l=mkLayer(1),g=l.g,x0=G.x0,w=G.w,h=G.h,tint=ENV.rock,amb=ENV.amb;
    /* near forest slopes framing the left and right */
    function slope(side){
      g.beginPath();var sx=side<0?-M:W+M;g.moveTo(sx,h*.8);
      for(var i=0;i<=24;i++){var u=i/24,x=side<0?lerp(-M,x0+w*.22,u):lerp(W+M,x0+w*.9,u);var y=lerp(side<0?h*.5:h*.44,h*.7,Math.pow(u,1.4))+(fbm(x/20,side*3,3)-.5)*h*.035;g.lineTo(x,y);}
      g.lineTo(side<0?x0+w*.22:x0+w*.9,h*.8);g.closePath();
      var gr=g.createLinearGradient(0,h*.45,0,h*.8);gr.addColorStop(0,rgb([34*tint[0]*amb[0],58*tint[1]*amb[1],50*tint[2]*amb[2]],1));gr.addColorStop(1,rgb([20*amb[0],34*amb[1],36*amb[2]],1));g.fillStyle=gr;g.fill();
      for(var k=0;k<90;k++){var tx=side<0?lerp(-M,x0+w*.2,Math.random()):lerp(W+M,x0+w*.88,Math.random()),ty=lerp(h*.52,h*.72,Math.random()*Math.random());                 // conifer silhouettes
        var th=h*(.014+Math.random()*.02);g.fillStyle="rgba(8,20,18,"+(.45+Math.random()*.35)+")";g.beginPath();g.moveTo(tx,ty-th);g.lineTo(tx-th*.32,ty);g.lineTo(tx+th*.32,ty);g.closePath();g.fill();}
    }
    slope(-1);
    /* reservoir behind the dam */
    var lakeL=G.damL-w*.12,lakeR=W+M,ly=G.lakeY,cy=G.crestY;
    var lg=g.createLinearGradient(0,ly-h*.03,0,cy);lg.addColorStop(0,rgb(mix3(ENV.sky[2],[40,120,150],.45),.95));lg.addColorStop(1,rgb(mix3(ENV.sky[3],[10,70,100],.55),1));
    g.fillStyle=lg;g.beginPath();g.moveTo(lakeL,cy);g.quadraticCurveTo(lakeL+w*.04,ly-h*.012,lakeL+w*.22,ly-h*.018);g.lineTo(lakeR,ly-h*.022);g.lineTo(lakeR,cy+4);g.closePath();g.fill();
    /* mountain reflection (very soft) */
    g.save();g.beginPath();g.moveTo(lakeL,cy);g.quadraticCurveTo(lakeL+w*.04,ly-h*.012,lakeL+w*.22,ly-h*.018);g.lineTo(lakeR,ly-h*.022);g.lineTo(lakeR,cy+4);g.closePath();g.clip();
    g.globalAlpha=.28;g.translate(0,ly*2-h*.09);g.scale(1,-.22);if(L.hero)g.drawImage(L.hero.cv,-M,-MY,W+2*M,H+2*MY);g.restore();
    /* concrete arch dam */
    var xl=G.damL,xr=G.damR,top=cy,bot=G.damBaseY;
    function facePath(){g.beginPath();g.moveTo(xl,top+2);g.quadraticCurveTo((xl+xr)/2,top-h*.016,xr,top+2);g.lineTo(xr+w*.05,bot);g.lineTo(xl+w*.035,bot);g.closePath();}
    facePath();
    var cg=g.createLinearGradient(xl,0,xr,0);
    var cL=[196,198,200],cD=[104,108,116];
    var lit=ENV.sunX>.5;
    cg.addColorStop(0,rgb(mix3(cD,cL,lit?.45:.85)));cg.addColorStop(.5,rgb(mix3(cD,cL,.72)));cg.addColorStop(1,rgb(mix3(cD,cL,lit?.92:.4)));
    g.fillStyle=cg;g.fill();
    g.save();facePath();g.clip();
    /* concrete grain */
    var gw=Math.ceil(xr-xl+w*.06),gh=Math.ceil(bot-top+8),gimg=g.createImageData(gw,gh),gd=gimg.data;
    for(var py=0;py<gh;py++)for(var px=0;px<gw;px++){var n=fbm((xl+px)/3,(top+py)/3,2)*.9+Math.random()*.1,i4=(py*gw+px)*4,v=(n-.5)*60;gd[i4]=gd[i4+1]=gd[i4+2]=v>0?255:0;gd[i4+3]=Math.abs(v)*2.6;}
    var gc=document.createElement("canvas");gc.width=gw;gc.height=gh;gc.getContext("2d").putImageData(gimg,0,0);g.globalAlpha=.55;g.drawImage(gc,xl,top);g.globalAlpha=1;
    /* lifts, monolith joints, wet base */
    g.strokeStyle="rgba(40,48,60,.16)";g.lineWidth=1;
    for(var yy=top+7;yy<bot;yy+=6.5){g.beginPath();g.moveTo(xl,yy+Math.sin(yy)*.4);g.quadraticCurveTo((xl+xr)/2,yy-h*.004,xr+w*.05,yy);g.stroke();}
    for(var xx=xl;xx<xr+w*.05;xx+=w*.045){g.beginPath();g.moveTo(xx,top);g.lineTo(xx+w*.01,bot);g.stroke();}
    var wet=g.createLinearGradient(0,top+(bot-top)*.55,0,bot);wet.addColorStop(0,"rgba(30,60,80,0)");wet.addColorStop(1,"rgba(20,56,78,.5)");g.fillStyle=wet;g.fillRect(xl,top,xr-xl+w*.06,bot-top+2);
    var ov=g.createLinearGradient(0,top,0,top+(bot-top)*.18);ov.addColorStop(0,"rgba(10,16,26,.5)");ov.addColorStop(1,"rgba(10,16,26,0)");g.fillStyle=ov;g.fillRect(xl,top,xr-xl+w*.06,(bot-top)*.2);
    /* gate recesses */
    for(var gi=0;gi<G.gateX.length;gi++){var gx=G.gateX[gi]-G.gateW/2;g.fillStyle="rgba(10,18,28,.78)";g.fillRect(gx,G.gateY,G.gateW,G.gateH);g.strokeStyle="rgba(200,206,214,.6)";g.lineWidth=1.4;g.strokeRect(gx-1,G.gateY-1,G.gateW+2,G.gateH+2);}
    g.restore();
    /* crest road, parapet and lamps */
    g.strokeStyle="rgba(235,238,242,.85)";g.lineWidth=2.2;g.beginPath();g.moveTo(xl,top+1);g.quadraticCurveTo((xl+xr)/2,top-h*.016,xr,top+1);g.stroke();
    g.strokeStyle="rgba(30,38,50,.55)";g.lineWidth=1;for(var px2=xl+6;px2<xr;px2+=w*.028){var u=(px2-xl)/(xr-xl),py2=top-h*.016*4*u*(1-u)*.5;g.beginPath();g.moveTo(px2,py2+1);g.lineTo(px2,py2-3.2);g.stroke();}
    /* tailwater rocks + foreground ground */
    var gr2=g.createLinearGradient(0,bot-h*.01,0,h*1.02);var gb=mix3(ENV.sky[3],[40,62,72],.62);gr2.addColorStop(0,rgb([gb[0]*amb[0]*.8,gb[1]*amb[1]*.8,gb[2]*amb[2]*.8]));gr2.addColorStop(.45,rgb([gb[0]*amb[0]*.42,gb[1]*amb[1]*.42,gb[2]*amb[2]*.42]));gr2.addColorStop(1,rgb([gb[0]*.16,gb[1]*.2,gb[2]*.24]));
    g.fillStyle=gr2;g.beginPath();g.moveTo(-M,h*.995);g.lineTo(-M,h*.66);
    for(var i2=0;i2<=40;i2++){var u2=i2/40,x2=lerp(-M,W+M,u2);g.lineTo(x2,h*.668+(fbm(x2/36,9.5,3)-.5)*h*.03+Math.sin(u2*6.28*1.2)*h*.004);}
    g.lineTo(W+M,h*1.02);g.lineTo(-M,h*1.02);g.closePath();g.fill();
    for(var r=0;r<26;r++){var rx=G.x0+w*(.55+Math.random()*.5),ry=h*(.595+Math.random()*.045),rr=w*(.012+Math.random()*.03);var rg=g.createRadialGradient(rx-rr*.3,ry-rr*.3,rr*.1,rx,ry,rr);rg.addColorStop(0,rgb([120*amb[0],118*amb[1],122*amb[2]]));rg.addColorStop(1,rgb([32*amb[0],36*amb[1],44*amb[2]]));g.fillStyle=rg;g.beginPath();g.ellipse(rx,ry,rr*1.2,rr*.7,0,0,6.283);g.fill();}
    slope(1);
    L.land=l;
  }

  /* ------------------------------------------------------------------ bottle (path + condensation sprite) */
  function bottlePath(g,B,inset){
    var cx=B.cx,top=B.top,w=B.w,h=B.h,i=inset||0,nw=w*.20-i,bw=w*.5-i,ny=top+h*.13,sy=top+h*.30,by=top+h-h*.035;
    g.beginPath();
    g.moveTo(cx-nw,top+i*.3);g.lineTo(cx-nw,ny);
    g.bezierCurveTo(cx-nw,sy-h*.06,cx-bw,sy-h*.04,cx-bw,sy+h*.07);
    g.lineTo(cx-bw,by-h*.05);g.quadraticCurveTo(cx-bw,by+i*.3,cx-bw*.82,by+h*.032-i*.3);
    g.lineTo(cx+bw*.82,by+h*.032-i*.3);g.quadraticCurveTo(cx+bw,by+i*.3,cx+bw,by-h*.05);
    g.lineTo(cx+bw,sy+h*.07);g.bezierCurveTo(cx+bw,sy-h*.04,cx+nw,sy-h*.06,cx+nw,ny);
    g.lineTo(cx+nw,top+i*.3);g.closePath();
  }
  var COND=null;
  function renderCondensation(){
    var B=G.bottle,c=document.createElement("canvas");c.width=Math.ceil(B.w*1.1);c.height=Math.ceil(B.h*1.05);var g=c.getContext("2d");g.translate(-(B.cx-B.w*.55),-B.top);
    bottlePath(g,B,2);g.clip();
    for(var i=0;i<70;i++){var x=B.cx-B.w*.48+Math.random()*B.w*.96,y=B.top+B.h*(.18+Math.random()*.74),r=1+Math.random()*2.4;
      var rg=g.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);rg.addColorStop(0,"rgba(255,255,255,.95)");rg.addColorStop(.55,"rgba(200,236,255,.28)");rg.addColorStop(1,"rgba(160,210,240,.08)");
      g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,6.283);g.fill();}
    COND=c;
  }

  /* ------------------------------------------------------------------ particles (small, reused) */
  var sprays=[],bubbles=[],weather=[],clouds=[];
  function initParticles(){
    sprays.length=0;for(var i=0;i<(lowQ?22:46);i++)sprays.push({a:0,x:0,y:0,vx:0,vy:0,life:0,r:1});
    bubbles.length=0;for(var b=0;b<(lowQ?14:30);b++)bubbles.push({x:Math.random(),y:Math.random(),s:.3+Math.random()*.7,r:1+Math.random()*2.6,ph:Math.random()*6.28});
    weather.length=0;var wn=ENV.weather==="rain"?(lowQ?70:130):ENV.weather==="snow"?(lowQ?50:90):0;for(var k=0;k<wn;k++)weather.push({x:Math.random(),y:Math.random(),s:.6+Math.random()*.8,r:Math.random()});
    clouds.length=0;for(var c=0;c<5;c++)clouds.push({x:Math.random(),y:.04+Math.random()*.18,s:.7+Math.random()*.9,sp:.004+Math.random()*.006});
  }

  /* ------------------------------------------------------------------ camera */
  var KEYS=[ // t, focus (stage fractions), zoom
    [0,.36,.34,1.0],[1.0,.36,.36,1.04],[2.0,.7,.50,1.32],[3.0,.7,.54,1.36],[3.6,.62,.60,1.4],[4.3,.5,.72,1.62],[5.2,.5,.75,1.58],[6.4,.5,.52,1.0],[8.2,.5,.5,1.0]];
  function camAt(t){
    var i=0;while(i<KEYS.length-2&&t>KEYS[i+1][0])i++;
    var a=KEYS[i],b=KEYS[i+1],u=smooth(seg(t,a[0],b[0]));
    return {fx:lerp(a[1],b[1],u),fy:lerp(a[2],b[2],u),z:lerp(a[3],b[3],u)};
  }
  /* draw a layer under the camera with parallax: p = how strongly it follows the camera, kz = how much it zooms */
  function drawLayer(l,cam,p,kz,alpha){
    if(!l)return;var z=1+(cam.z-1)*kz,fx=G.x0+G.w*cam.fx,fy=G.h*cam.fy;
    var cx=W/2,cy=H/2;
    var ox=(fx-cx)*p,oy=(fy-cy)*p;
    ctx.save();
    ctx.globalAlpha=alpha==null?1:alpha;
    ctx.translate(cx,cy);ctx.scale(z,z);ctx.translate(-(cx+ox),-(cy+oy));
    ctx.drawImage(l.cv,-M,-MY,W+2*M,H+2*MY);
    ctx.restore();
  }
  function sceneXform(cam,p,kz){var z=1+(cam.z-1)*kz,fx=G.x0+G.w*cam.fx,fy=G.h*cam.fy,cx=W/2,cy=H/2;ctx.translate(cx,cy);ctx.scale(z,z);ctx.translate(-(cx+(fx-cx)*p),-(cy+(fy-cy)*p));}

  /* ------------------------------------------------------------------ dynamic water: gates, stream, bottle */
  function bez(p0,p1,p2,u){var a=1-u;return [a*a*p0[0]+2*a*u*p1[0]+u*u*p2[0],a*a*p0[1]+2*a*u*p1[1]+u*u*p2[1]];}
  var STREAM=null;
  function buildStream(){
    var P=G.path,pts=[];
    for(var i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],mid=[(a[0]+b[0])/2+(i%2?-1:1)*G.w*.015,(a[1]+b[1])/2];for(var s=0;s<=14;s++){if(i>0&&s===0)continue;pts.push(bez(a,mid,b,s/14));}}
    // cumulative length
    var cum=[0];for(var k=1;k<pts.length;k++)cum.push(cum[k-1]+Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]));
    STREAM={pts:pts,cum:cum,len:cum[cum.length-1]};
  }
  function drawJets(t){
    var open=smooth(seg(t,2.0,3.0));if(open<=0)return;
    var g=ctx,wob=function(x,y){return Math.sin(x*.21+y*.3+t*9)*1.2;};
    for(var i=0;i<G.gateX.length;i++){
      var u=smooth(seg(t,2.0+i*.28,2.9+i*.28));if(u<=0)continue;
      var gx=G.gateX[i],gw=G.gateW,gy=G.gateY+G.gateH*.3,fall=(G.damBaseY-gy)+4;
      /* gate door lifts */
      g.fillStyle="rgba(24,34,46,.95)";g.fillRect(gx-gw/2,G.gateY,gw,G.gateH*(1-u*.85));
      /* white-cyan sheet pouring down the face */
      var gr=g.createLinearGradient(0,gy,0,gy+fall);gr.addColorStop(0,"rgba(255,255,255,"+(.9*u)+")");gr.addColorStop(.5,"rgba(200,246,255,"+(.7*u)+")");gr.addColorStop(1,"rgba(120,225,255,"+(.5*u)+")");
      g.fillStyle=gr;g.beginPath();g.moveTo(gx-gw*.46,gy);g.lineTo(gx+gw*.46,gy);g.lineTo(gx+gw*.62,gy+fall);g.lineTo(gx-gw*.62,gy+fall);g.closePath();g.fill();
      /* moving streaks */
      g.save();g.beginPath();g.moveTo(gx-gw*.46,gy);g.lineTo(gx+gw*.46,gy);g.lineTo(gx+gw*.62,gy+fall);g.lineTo(gx-gw*.62,gy+fall);g.closePath();g.clip();
      g.strokeStyle="rgba(255,255,255,"+(.65*u)+")";g.lineWidth=1.3;
      for(var s=0;s<7;s++){var sx=gx-gw*.4+s*gw*.135,off=((t*140+s*37)%28);for(var yy=gy-28+off;yy<gy+fall;yy+=28){g.beginPath();g.moveTo(sx+wob(sx,yy),yy);g.lineTo(sx+wob(sx,yy+14),yy+14);g.stroke();}}
      g.restore();
      /* mist at the foot (soft lighter blobs) */
      g.save();g.globalCompositeOperation="lighter";
      for(var m=0;m<4;m++){var mx=gx+Math.sin(t*1.7+m*1.9+i)*gw*.5,my=gy+fall-m*2,mr=gw*(.9+.25*m),mg=g.createRadialGradient(mx,my,0,mx,my,mr);mg.addColorStop(0,"rgba(220,248,255,"+(.34*u*(1-m*.18))+")");mg.addColorStop(1,"rgba(220,248,255,0)");g.fillStyle=mg;g.beginPath();g.arc(mx,my,mr,0,6.283);g.fill();}
      g.restore();
    }
    /* stilling pool */
    var px=G.gateX[1],py=G.damBaseY+2,pw=(G.gateX[2]-G.gateX[0])*.9+G.gateW,pg=g.createRadialGradient(px,py,0,px,py,pw*.55);pg.addColorStop(0,"rgba(235,252,255,"+(.75*open)+")");pg.addColorStop(.55,"rgba(130,226,255,"+(.5*open)+")");pg.addColorStop(1,"rgba(80,190,230,0)");
    g.fillStyle=pg;g.beginPath();g.ellipse(px,py+3,pw*.55,G.h*.014,0,0,6.283);g.fill();
  }
  function headIndex(t){var p=smooth(seg(t,2.9,4.25));return p*(STREAM.len);}
  function drawStream(t){
    var head=headIndex(t);if(head<=2)return;
    var pts=STREAM.pts,cum=STREAM.cum,g=ctx,n=0;while(n<pts.length-1&&cum[n+1]<=head)n++;
    var last=pts[n],nxt=pts[Math.min(pts.length-1,n+1)],f=(head-cum[n])/Math.max(1,(cum[Math.min(pts.length-1,n+1)]-cum[n]));
    var tip=[lerp(last[0],nxt[0],f),lerp(last[1],nxt[1],f)];
    function trace(width){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(var i=1;i<=n;i++)g.lineTo(pts[i][0],pts[i][1]);g.lineTo(tip[0],tip[1]);g.lineWidth=width;g.lineCap="round";g.lineJoin="round";g.stroke();}
    var base=G.w*.034,wv=ENV.water;
    g.save();
    g.strokeStyle="rgba("+(90*wv[0])+","+(205*wv[1])+","+(240*wv[2])+",.30)";trace(base*1.9);
    g.strokeStyle="rgba("+(150*wv[0]|0)+","+(228*wv[1]|0)+",255,.55)";trace(base*1.25);
    g.strokeStyle="rgba(228,250,255,.82)";trace(base*.62);
    g.strokeStyle="rgba(255,255,255,.95)";g.setLineDash([G.w*.05,G.w*.07]);g.lineDashOffset=-t*G.w*.9;trace(base*.26);g.setLineDash([]);
    g.globalCompositeOperation="lighter";g.strokeStyle="rgba(120,230,255,.28)";trace(base*2.6);
    g.restore();
    /* foam / sparkle where the water changes direction */
    g.save();g.globalCompositeOperation="lighter";
    for(var k=0;k<STREAM.pts.length;k+=7){if(cum[k]>head)break;var p=pts[k],r=base*(.5+.4*Math.sin(t*8+k)),fg=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r*1.8);fg.addColorStop(0,"rgba(255,255,255,.28)");fg.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=fg;g.beginPath();g.arc(p[0],p[1],r*1.8,0,6.283);g.fill();}
    g.restore();
  }

  function drawBottle(t){
    var g=ctx,B=G.bottle,cx=B.cx,top=B.top;
    var appear=smooth(seg(t,3.3,4.0));g.save();g.globalAlpha=appear;
    var sway=Math.sin(t*.9)*.012;                                // very slight rotation, like it is being turntabled
    g.translate(cx,top+B.h*.7);g.rotate(sway);g.translate(-cx,-(top+B.h*.7));
    /* ground contact: soft shadow + caustic reflection pool */
    var sg=g.createRadialGradient(cx,top+B.h+4,2,cx,top+B.h+4,B.w*.62);sg.addColorStop(0,"rgba(0,0,0,.5)");sg.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=sg;g.beginPath();g.ellipse(cx,top+B.h+5,B.w*.62,B.h*.045,0,0,6.283);g.fill();
    var fill=smooth(seg(t,4.3,5.7)),level=fill*.80;                 // fraction of the body height
    var inner=3;
    /* water + refracted scenery clipped to the bottle */
    g.save();bottlePath(g,B,inner);g.clip();
    /* faint glass tint */
    g.fillStyle="rgba(170,225,245,.10)";g.fillRect(cx-B.w,top,B.w*2,B.h*1.1);
    if(level>0){
      var wy=top+B.h*(1-level*.86)-B.h*.04;
      var surf=function(x){return wy+Math.sin(x*.09+t*3.1)*2.2+Math.sin(x*.21-t*2.2)*1.1;};
      g.save();g.beginPath();g.moveTo(cx-B.w,surf(cx-B.w));for(var x=cx-B.w*.6;x<=cx+B.w*.6;x+=4)g.lineTo(x,surf(x));g.lineTo(cx+B.w,top+B.h+20);g.lineTo(cx-B.w,top+B.h+20);g.closePath();g.clip();
      var wg=g.createLinearGradient(0,wy,0,top+B.h);wg.addColorStop(0,"rgba(190,244,255,.78)");wg.addColorStop(.35,"rgba(96,214,250,.62)");wg.addColorStop(1,"rgba(40,150,210,.78)");
      g.fillStyle=wg;g.fillRect(cx-B.w,wy-8,B.w*2,B.h*1.2);
      /* refracted (inverted, magnified) background seen through the water */
      if(!lowQ){g.globalAlpha=.34;g.save();g.translate(cx,wy+B.h*.35);g.scale(-1.18,-1.18);g.translate(-cx,-(wy+B.h*.35));g.drawImage(refr,-M,-MY,W+2*M,H+2*MY);g.restore();g.globalAlpha=1;}
      /* light shafts in the water + caustics */
      g.globalCompositeOperation="lighter";
      for(var s=0;s<5;s++){var sx=cx-B.w*.4+s*B.w*.2+Math.sin(t*1.3+s)*5;var lg=g.createLinearGradient(sx,wy,sx+8,top+B.h);lg.addColorStop(0,"rgba(255,255,255,.22)");lg.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=lg;g.beginPath();g.moveTo(sx-6,wy);g.lineTo(sx+10,wy);g.lineTo(sx+26,top+B.h);g.lineTo(sx-14,top+B.h);g.closePath();g.fill();}
      /* bubbles rising */
      for(var b=0;b<bubbles.length;b++){var bb=bubbles[b],by=((bb.y-t*.12*bb.s)%1+1)%1,bx=cx+(bb.x-.5)*B.w*.8+Math.sin(t*2+bb.ph)*3,byy=wy+B.h*.02+by*(top+B.h-wy);
        g.strokeStyle="rgba(255,255,255,"+(.5*fill)+")";g.lineWidth=.9;g.beginPath();g.arc(bx,byy,bb.r,0,6.283);g.stroke();g.fillStyle="rgba(255,255,255,"+(.18*fill)+")";g.fill();}
      g.globalCompositeOperation="source-over";
      /* bright meniscus line */
      g.strokeStyle="rgba(255,255,255,.9)";g.lineWidth=1.6;g.beginPath();g.moveTo(cx-B.w*.6,surf(cx-B.w*.6));for(var x2=cx-B.w*.6;x2<=cx+B.w*.6;x2+=4)g.lineTo(x2,surf(x2));g.stroke();
      g.restore();
      /* impact: stream pours in, foam, crown splash */
      var inflow=seg(t,4.2,5.9)*(1-seg(t,5.8,6.3));
      if(inflow>0){
        var mx=cx-B.w*.0,iy=wy+2;g.save();g.globalCompositeOperation="lighter";
        var cg=g.createRadialGradient(mx,iy,0,mx,iy,B.w*.28);cg.addColorStop(0,"rgba(255,255,255,"+(.7*inflow)+")");cg.addColorStop(1,"rgba(160,236,255,0)");g.fillStyle=cg;g.beginPath();g.ellipse(mx,iy,B.w*.28,B.h*.035,0,0,6.283);g.fill();g.restore();
        g.fillStyle="rgba(240,252,255,"+(.85*inflow)+")";g.fillRect(cx-B.w*.036,top-6,B.w*.072,iy-top+6);                       // the column of water inside the bottle
        g.fillStyle="rgba(160,230,255,"+(.5*inflow)+")";g.fillRect(cx-B.w*.056,top-6,B.w*.112,iy-top+6);
      }
    }
    /* condensation droplets */
    if(COND){g.globalAlpha=.9;g.drawImage(COND,cx-B.w*.55,top);g.globalAlpha=1;}
    g.restore();
    /* glass: outline, rim, specular streaks */
    g.lineJoin="round";
    bottlePath(g,B,0);g.strokeStyle="rgba(235,248,255,.8)";g.lineWidth=2;g.stroke();
    bottlePath(g,B,4);g.strokeStyle="rgba(120,210,245,.35)";g.lineWidth=1.2;g.stroke();
    var drift=Math.sin(t*.9)*B.w*.015;
    var hl=function(x,y0,y1,w,a){var gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,"rgba(255,255,255,0)");gr.addColorStop(.18,"rgba(255,255,255,"+a+")");gr.addColorStop(.82,"rgba(255,255,255,"+a*.85+")");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.beginPath();g.moveTo(x,y0);g.quadraticCurveTo(x+w,(y0+y1)/2,x,y1);g.quadraticCurveTo(x-w*.4,(y0+y1)/2,x,y0);g.closePath();g.fill();};
    g.save();bottlePath(g,B,1);g.clip();
    hl(cx-B.w*.36+drift,top+B.h*.34,top+B.h*.9,B.w*.09,.85);hl(cx-B.w*.24+drift,top+B.h*.38,top+B.h*.8,B.w*.025,.55);hl(cx+B.w*.38+drift,top+B.h*.36,top+B.h*.86,B.w*.045,.45);
    hl(cx-B.w*.14,top+B.h*.02,top+B.h*.14,B.w*.025,.7);
    var rim=g.createLinearGradient(cx-B.w*.5,0,cx+B.w*.5,0);rim.addColorStop(0,"rgba(255,255,255,.18)");rim.addColorStop(.12,"rgba(255,255,255,0)");rim.addColorStop(.88,"rgba(255,255,255,0)");rim.addColorStop(1,"rgba(120,210,255,.22)");g.fillStyle=rim;g.fillRect(cx-B.w,top,B.w*2,B.h*1.1);
    g.restore();
    /* neck lip + threads */
    var nw=B.w*.20;g.strokeStyle="rgba(240,250,255,.85)";g.lineWidth=2.4;g.beginPath();g.ellipse(cx,top,nw,3.4,0,0,6.283);g.stroke();
    g.strokeStyle="rgba(210,238,252,.5)";g.lineWidth=1.3;for(var th=0;th<3;th++){g.beginPath();g.moveTo(cx-nw,top+B.h*.045+th*5);g.lineTo(cx+nw,top+B.h*.045+th*5+1.6);g.stroke();}
    g.restore();
  }
  var refr=null;
  function snapshotRefraction(){var c=document.createElement("canvas");c.width=Math.round((W+2*M)*.4);c.height=Math.round((H+2*MY)*.4);var g=c.getContext("2d");g.scale(.4,.4);
    [L.sky,L.far,L.hero,L.land].forEach(function(l){if(l)g.drawImage(l.cv,0,0,W+2*M,H+2*MY);});refr=c;}

  /* splashes: spray from the bottle mouth + stream impact on the ground-level pool */
  function emitSpray(x,y,n,pow){
    var k=0;for(var i=0;i<sprays.length&&k<n;i++){var s=sprays[i];if(s.a>0)continue;k++;var a=-Math.PI/2+(Math.random()-.5)*2.2,v=(.5+Math.random())*pow;s.a=1;s.x=x;s.y=y;s.vx=Math.cos(a)*v;s.vy=Math.sin(a)*v;s.life=.6+Math.random()*.5;s.r=1+Math.random()*2.2;}
  }
  var lastEmit=0;
  function drawSprays(dt,t){
    var g=ctx;g.save();g.globalCompositeOperation="lighter";
    for(var i=0;i<sprays.length;i++){var s=sprays[i];if(s.a<=0)continue;s.vy+=520*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(s.life<=0){s.a=0;continue;}
      g.fillStyle="rgba(220,248,255,"+clamp(s.life*1.4,0,.8)+")";g.beginPath();g.arc(s.x,s.y,s.r,0,6.283);g.fill();}
    g.restore();
  }

  /* lake shimmer, clouds, godrays, weather, vignette */
  function drawLake(t){
    var g=ctx,x1=G.damL-G.w*.1,x2=W+M,y1=G.lakeY-G.h*.01,y2=G.crestY;
    g.save();g.beginPath();g.rect(x1,y1,x2-x1,y2-y1);g.clip();g.strokeStyle="rgba(255,255,255,.22)";g.lineWidth=1;
    for(var i=0;i<9;i++){var y=lerp(y1+4,y2-2,i/9),ph=t*.6+i*1.3;g.beginPath();for(var x=x1;x<x2;x+=8){var yy=y+Math.sin(x*.05+ph)*1.2;if(x===x1)g.moveTo(x,yy);else g.lineTo(x,yy);}g.stroke();}
    var sx=SX+SW*ENV.sunX,gl=g.createLinearGradient(sx-60,0,sx+60,0);gl.addColorStop(0,"rgba(255,255,255,0)");gl.addColorStop(.5,"rgba(255,255,255,"+(.2*ENV.sunI)+")");gl.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gl;g.fillRect(sx-60,y1,120,y2-y1);
    g.restore();
  }
  function cloudSprite(){var c=document.createElement("canvas");c.width=260;c.height=110;var g=c.getContext("2d");for(var i=0;i<14;i++){var x=40+Math.random()*180,y=36+Math.random()*34,r=22+Math.random()*30,rg=g.createRadialGradient(x,y,0,x,y,r);rg.addColorStop(0,"rgba(255,255,255,.55)");rg.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=rg;g.beginPath();g.arc(x,y,r,0,6.283);g.fill();}return c;}
  var CLOUD=null;
  function drawClouds(t,cam){
    var g=ctx,dark=ENV.stage==="rain"?.55:ENV.stage==="night"?.35:ENV.stage==="snow"?.75:.8;
    g.save();sceneXform(cam,.55,.4);g.globalAlpha=dark*(ENV.stage==="rain"?1:.7);
    for(var i=0;i<clouds.length;i++){var c=clouds[i],x=((c.x+t*c.sp)%1.4-.2)*(W+M),y=c.y*H,w=W*.55*c.s;if(ENV.stage==="rain"){g.filter="none";}g.drawImage(CLOUD,x-w/2,y-w*.2,w,w*.42);}
    g.restore();
  }
  function drawGodrays(t,cam){
    if(lowQ||ENV.sunI<.8||ENV.stage==="rain")return;
    var g=ctx;g.save();sceneXform(cam,.3,.2);g.globalCompositeOperation="lighter";
    var sx=SX+SW*ENV.sunX,sy=H*ENV.sunY;
    for(var i=0;i<5;i++){var a=Math.PI*(.55+i*.09)+Math.sin(t*.25+i)*.02,len=H*.9,w=W*.07;var gr=g.createLinearGradient(sx,sy,sx+Math.cos(a)*len,sy+Math.sin(a)*len);gr.addColorStop(0,rgb(ENV.sun,.035*ENV.sunI));gr.addColorStop(1,rgb(ENV.sun,0));g.fillStyle=gr;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+Math.cos(a-.05)*len,sy+Math.sin(a-.05)*len);g.lineTo(sx+Math.cos(a+.05)*len,sy+Math.sin(a+.05)*len);g.closePath();g.fill();}
    g.restore();
  }
  function drawMist(t,cam){
    var g=ctx;g.save();sceneXform(cam,.7,.8);g.globalCompositeOperation="lighter";
    for(var i=0;i<6;i++){var x=G.x0+G.w*(.1+i*.17)+Math.sin(t*.2+i)*14,y=G.baseY-G.h*.02+Math.sin(i*2)*8,r=G.w*.34,mg=g.createRadialGradient(x,y,0,x,y,r);mg.addColorStop(0,rgb(ENV.haze,.16*ENV.mist));mg.addColorStop(1,rgb(ENV.haze,0));g.fillStyle=mg;g.beginPath();g.ellipse(x,y,r,r*.28,0,0,6.283);g.fill();}
    g.restore();
  }
  function drawWeather(t,dt){
    if(!ENV.weather)return;var g=ctx;g.save();
    if(ENV.weather==="rain"){g.strokeStyle="rgba(210,228,245,.42)";g.lineWidth=1;g.beginPath();for(var i=0;i<weather.length;i++){var p=weather[i];p.y+=dt*(1.6+p.s)*(ENV.stage==="rain"?1:1);p.x-=dt*.28*p.s;if(p.y>1.05){p.y=-.05;p.x=Math.random()*1.2;}if(p.x<-.1)p.x=1.1;var x=p.x*W,y=p.y*H,l=14*p.s;g.moveTo(x,y);g.lineTo(x-l*.18,y+l);}g.stroke();}
    else{g.fillStyle="rgba(255,255,255,.85)";for(var j=0;j<weather.length;j++){var q=weather[j];q.y+=dt*(.07+q.s*.08);q.x+=Math.sin(t*.8+q.r*9)*dt*.02;if(q.y>1.05){q.y=-.05;q.x=Math.random();}g.beginPath();g.arc(((q.x%1)+1)%1*W,q.y*H,.8+q.r*1.8,0,6.283);g.fill();}}
    g.restore();
  }
  function drawLightning(t){
    if(ENV.stage!=="rain")return;var f=(t%7.3);var a=f>6.6&&f<6.75?.18:f>6.85&&f<6.95?.1:0;if(a<=0||reduced)return;
    ctx.save();ctx.fillStyle="rgba(220,232,255,"+a+")";ctx.fillRect(0,0,W,H*.55);ctx.restore();
  }
  function vignette(){
    var g=ctx,vg=g.createRadialGradient(W/2,H*.55,Math.min(W,H)*.28,W/2,H*.55,Math.max(W,H)*.78);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(2,6,14,.62)");g.fillStyle=vg;g.fillRect(0,0,W,H);
  }

  /* ------------------------------------------------------------------ frame */
  var logoShown=false,subShown=false,ctaShown=false,iteShown=false,audioCued=false;
  function stage(t){
    if(!logoShown&&t>=5.3){logoShown=true;splash.classList.add("cineLogo");}
    if(!subShown&&t>=6.3){subShown=true;splash.classList.add("cineSub");}
    if(!ctaShown&&t>=6.9){ctaShown=true;splash.classList.add("cineCta");}
    if(!iteShown&&t>=5.9){iteShown=true;splash.classList.add("cineIte");}
  }
  function frame(ts){
    raf=0;if(dead)return;
    if(!splash.isConnected||splash.classList.contains("isDone")){cleanup();return;}
    var dt=lastTs?Math.min(.05,(ts-lastTs)/1000):.016;lastTs=ts;
    var t=reduced?6.4:(ts-t0)/1000;
    frames++;if(frames>30&&frames<=90){if(dt>.034)slow++;if(frames===90&&slow>34&&!lowQ){lowQ=true;initParticles();}}
    var cam=camAt(t),g=ctx;
    g.setTransform(DPR,0,0,DPR,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";
    var rise=reduced?1:smooth(seg(t,.05,1.1));
    g.fillStyle="#030711";g.fillRect(0,0,W,H);
    g.save();g.globalAlpha=1;
    drawLayer(L.sky,cam,.08,.12,1);
    drawClouds(t,cam);
    g.globalAlpha=rise;
    drawLayer(L.far,cam,.32,.5,1);
    g.globalAlpha=1;
    g.save();g.globalAlpha=rise;
    drawLayer(L.hero,cam,.55,.82,1);
    g.restore();
    drawMist(t,cam);
    g.save();g.globalAlpha=smooth(seg(t,.7,1.7));
    /* land (forest, lake, dam, ground) + dynamic parts share ONE camera transform so they stay locked together */
    g.restore();
    var dm=reduced?1:smooth(seg(t,.8,1.8));
    g.save();g.globalAlpha=dm;sceneXform(cam,1,1);g.drawImage(L.land.cv,-M,-MY,W+2*M,H+2*MY);
    g.globalAlpha=1;drawLake(t);
    drawJets(t);
    drawStream(t);
    drawBottle(t);
    /* splash emission */
    var tt=t;
    if(tt>2.6&&tt<4.3&&tt-lastEmit>.07){lastEmit=tt;var pj=smooth(seg(tt,2.0,3.0));emitSpray(G.gateX[1]+(Math.random()-.5)*G.gateW*3,G.damBaseY+2,2,90*pj);}
    if(tt>4.25&&tt<6.0&&tt-lastEmit>.05){lastEmit=tt;var B=G.bottle;emitSpray(B.cx+(Math.random()-.5)*B.w*.1,B.top+B.h*.1,3,150);}
    drawSprays(dt,t);
    g.restore();
    drawGodrays(t,cam);
    drawWeather(t,dt);
    drawLightning(t);
    vignette();
    /* fade up from black */
    var fade=1-smooth(seg(t,0,.7));if(fade>0){g.fillStyle="rgba(3,7,17,"+fade+")";g.fillRect(0,0,W,H);}
    /* closing fade handled by the existing #geiSplash.isDone transition */
    stage(t);
    if(!audioCued){audioCued=true;}
    if(!reduced||frames<3)raf=requestAnimationFrame(frame);
  }
  function cleanup(){
    dead=true;if(raf)cancelAnimationFrame(raf);window.removeEventListener("resize",onResize);
    try{cv.width=cv.height=0;for(var k in L){L[k].cv.width=L[k].cv.height=0;}refr=null;COND=null;CLOUD=null;}catch(e){}
  }
  var resizeT=0;
  function onResize(){clearTimeout(resizeT);resizeT=setTimeout(function(){if(dead)return;try{buildAll(true);}catch(e){}},250);}

  /* ------------------------------------------------------------------ build + start */
  function buildAll(rebuild){
    measure();geometry();
    PEAKS=[{x:G.x0+G.w*.30,y:G.peakY,wl:G.w*.62,wr:G.w*.62,e:1.35},{x:G.x0+G.w*.12,y:G.h*.40,wl:G.w*.3,wr:G.w*.3,e:1.1},{x:G.x0+G.w*.62,y:G.h*.37,wl:G.w*.3,wr:G.w*.5,e:1.2},{x:G.x0+G.w*.96,y:G.h*.40,wl:G.w*.3,wr:G.w*.5,e:1.1}];
    renderSky();renderFar();renderMountain();renderLand();renderCondensation();snapshotRefraction();buildStream();
    if(!CLOUD)CLOUD=cloudSprite();initParticles();
  }
  var onAudio=null;
  function begin(){
    if(started)return;started=1;t0=performance.now();cv.style.opacity="1";
    window.__GEI_CINE_OK__=true;window.__GEI_CINE__.t0=t0;window.__GEI_CINE__.elapsed=function(){return (performance.now()-t0)/1000;};
    raf=requestAnimationFrame(frame);
    if(!reduced)setTimeout(function(){if(!dead&&window.geiFinishSplash)window.geiFinishSplash();},TOTAL_MS);       // earlier than the old 10s timer; Skip still works anytime
    else setTimeout(function(){if(!dead&&window.geiFinishSplash)window.geiFinishSplash();},2400);
  }
  try{
    window.addEventListener("resize",onResize,{passive:true});
    /* build in slices so the first paint (a dark screen) is never blocked */
    setTimeout(function(){
      try{
        var s0=performance.now();buildAll(false);
        window.__GEI_CINE__.buildMs=Math.round(performance.now()-s0);
        begin();
      }catch(e){cleanup();fallback(e&&e.message||e);}
    },30);
  }catch(e){fallback(e&&e.message||e);}
  /* classic fallback if the cinematic did not start in time */
  setTimeout(function(){if(!window.__GEI_CINE_OK__&&!dead){cleanup();fallback("timeout");}},4500);

  window.__GEI_CINE__.selfTest=function(){return {version:"V2.1.89",env:envName,started:!!started,canvas:!!cv.parentNode,layers:Object.keys(L),dpr:DPR,size:[W,H],lowQ:lowQ,buildMs:window.__GEI_CINE__.buildMs,reduced:reduced,presentationOnly:true};};
})();
