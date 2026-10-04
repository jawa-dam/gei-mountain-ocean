/* V2.2.2 — UNIVERSAL DAM VIEW 📱🖥️⛶
 * One display engine for the DAM Map experience (map + STEM labs + FOLLOW THE WATER):
 *   "Same game. Same composition. Same proportions. Any screen."
 *
 *   • tracks the VISIBLE viewport (visualViewport) instead of 100vh, so Chrome's URL bar / gesture bar never
 *     crops the top or bottom of the map                       → --dam-vw / --dam-vh on #geiDamMapPage
 *   • chooses a presentation mode, never reloads, never resets  → data-dam-fit="mobile|mobile-land|tablet|desktop"
 *     rotate / resize / fullscreen / toolbar changes just re-layout
 *   • "Desktop site" on a phone: the browser lays the page out ~980px wide on a ~400px screen, which makes the
 *     UI tiny. The stage is zoom-compensated back to a phone-sized composition     → data-dam-desktop-site
 *   • ⛶ FULL MAP: fullscreens ONLY the DAM Map container (Fullscreen API) into an immersion layout that keeps
 *     the journey prominent and hides secondary chrome; exiting restores everything → data-dam-fs="on"
 *   • safe-area insets protect HUD + floating controls from cutouts, rounded corners and gesture areas
 *   • NO-CLIPPING rule + type floors for the map chrome; header/pills are anchored so nothing is cut off
 *   • audit(): the DAM VIEW TESTER's engine — flags clipped / offscreen / overlapping / unreadable / tiny-target UI
 *     (see tools/v222-dam-view/dam-view-tester.mjs for the device matrix)
 *
 * Presentation only: reads viewport metrics, writes nothing to storage, never touches game state, FL OZ, XP,
 * STEM XP, purchases or entitlements.
 */
(function(){
  "use strict";
  if(window.__GEI_DAM_VIEW__)return;
  var VERSION="V2.2.2",PID="geiDamMapPage";
  function $(id){return document.getElementById(id);}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function page(){return $(PID);}
  function isOpen(){var p=page();return !!(p&&p.classList.contains("show"));}

  /* ---------- styles: override the map's 100vh sizing, fix header/pills, type floors, fullscreen ---------- */
  function styles(){
    if($("dvStyles"))return;
    var s=document.createElement("style");s.id="dvStyles";
    s.textContent=[
      /* stage = the visible viewport (never 100vh); safe areas keep HUD and controls clear of cutouts / gesture areas */
      "#"+PID+"{top:var(--dam-top,0px);bottom:auto;height:100vh;height:100dvh;height:var(--dam-vh,100dvh);",
      "padding:max(6px,env(safe-area-inset-top)) max(6px,env(safe-area-inset-right)) max(6px,env(safe-area-inset-bottom)) max(6px,env(safe-area-inset-left))}",
      "#"+PID+" .dmwShell{width:min(var(--dam-maxw,1240px),100%);height:min(100%,var(--dam-maxh,900px))}",
      "#"+PID+"[data-dam-fit=tablet]{--dam-maxw:980px}#"+PID+"[data-dam-fit=desktop]{--dam-maxw:1320px;--dam-maxh:940px}",
      "#"+PID+"[data-dam-fit=mobile-land] .dmwShell{border-radius:16px}",
      /* header: one line, big targets; the title may shrink but never wraps into the HUD */
      "#"+PID+" .dmwTop{gap:6px;padding:10px 10px 8px}",
      "#"+PID+" .dmwTitle b{white-space:nowrap;font-size:clamp(15px,calc(var(--dam-vw,100vw)*4.4/100),30px);letter-spacing:.03em}",
      "#"+PID+" .dvEmoji{font-size:.9em}",
      "#"+PID+" .dmwBtn{min-width:44px;min-height:44px;padding:8px 10px;font-size:clamp(13px,calc(var(--dam-vw,100vw)*3.4/100),15px)}",
      "#dvFsBtn{font-size:20px;line-height:1;padding:8px 10px}#dvFsBtn[hidden]{display:none}#dvFsBtn[aria-pressed=true]{border-color:#7ff0ff;background:rgba(47,210,255,.18)}",
      /* type floors for the map chrome */
      "#"+PID+" .dmwStat small{font-size:clamp(11px,calc(var(--dam-vw,100vw)*2.9/100),13px)}#"+PID+" .dmwStat b{font-size:clamp(16px,calc(var(--dam-vw,100vw)*4.2/100),22px)}",
      "#"+PID+" .dmwPill b{font-size:clamp(13px,calc(var(--dam-vw,100vw)*3.6/100),17px)}#"+PID+" .dmwPill small,#"+PID+" .stmTag{font-size:clamp(10.5px,calc(var(--dam-vw,100vw)*2.8/100),12.5px)}",
      "#"+PID+" .dmwRailTitle{font-size:clamp(12px,calc(var(--dam-vw,100vw)*3.2/100),15px)}#"+PID+" .geiMapFactory b{font-size:clamp(13px,calc(var(--dam-vw,100vw)*3.4/100),16px)}#"+PID+" .geiMapFactory small{font-size:clamp(10.5px,calc(var(--dam-vw,100vw)*2.8/100),12px)}",
      "#"+PID+" .dmwPinLabel{font-size:clamp(12px,calc(var(--dam-vw,100vw)*3.2/100),15px)}",
      /* station pills hang from the bottom edge of the scene: they can grow (STEM tag, bigger type) without being clipped */
      "#"+PID+" .dmwPills{top:auto!important;bottom:10px}#"+PID+" .dmwPills .dmwPill{top:auto!important;bottom:0;transform:translate(-50%,0)}",
      /* compact STEM header button on narrow stages */
      "#"+PID+"[data-dam-narrow=\"1\"] .dvEmoji,#"+PID+"[data-dam-narrow=\"1\"] .stmTopBtn span:nth-child(2){display:none}",
      /* no clipping: labels wrap, the subtitle only shows where it has room */
      "#"+PID+" .dmwStat small{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.2;letter-spacing:.09em}",
      "#"+PID+"[data-dam-fit=mobile] .dmwTitle span,#"+PID+"[data-dam-fit=mobile-land] .dmwTitle span{display:none}",
      /* the GEI card keeps its auto-fit sizes but never drops below readable type */
      "#"+PID+" .geiConn .gcDay{font-size:max(.7rem,11px)}#"+PID+" .geiConn .gcLabel{font-size:max(.66rem,10.5px)}#"+PID+" .geiConn .gcAgain{font-size:max(.7rem,11px)}#"+PID+" .geiConn .gcNote{font-size:max(.65rem,10.5px)}",
      "#"+PID+" .geiConn.micro .gcDay,#"+PID+" .geiConn.nano .gcDay{font-size:max(.65rem,10.5px)}#"+PID+" .geiConn.micro .gcAgain{font-size:max(.66rem,10.5px)}",
      "#"+PID+" .geiConn.micro .gcKey::before,#"+PID+" .geiConn.nano .gcKey::before{font-size:max(.62rem,10px)}",
      /* roomier layouts: station pills stack icon over name so six names always fit (never an ellipsis); subtitle may wrap */
      "#"+PID+"[data-dam-fit=tablet] .dmwPill b>span,#"+PID+"[data-dam-fit=desktop] .dmwPill b>span,#"+PID+"[data-dam-fit=mobile-land] .dmwPill b>span{display:block;text-align:center}",
      "#"+PID+"[data-dam-fit=tablet] .dmwPill b,#"+PID+"[data-dam-fit=desktop] .dmwPill b,#"+PID+"[data-dam-fit=mobile-land] .dmwPill b{font-size:13px}",
      "#"+PID+" .dmwPill{min-height:44px}#"+PID+" .dmwTitle span{white-space:normal;overflow:visible;text-overflow:clip}",
      /* landscape phone: the map gets the room, secondary chrome steps aside */
      "#"+PID+"[data-dam-fit=mobile-land] .dmwRail,#"+PID+"[data-dam-fit=mobile-land] .dmwAhead{display:none}",
      "#"+PID+"[data-dam-fit=mobile-land] .dmwTop{padding:4px 8px;gap:6px}#"+PID+"[data-dam-fit=mobile-land] .dmwTitle b{font-size:18px}",
      "#"+PID+"[data-dam-fit=mobile-land] .dmwPill{padding:3px 9px}#"+PID+"[data-dam-fit=mobile-land] .dmwPill b{font-size:13px}#"+PID+"[data-dam-fit=mobile-land] .dmwPill:not(.now) .stmTag{display:none}",
      "#"+PID+"[data-dam-fit=mobile-land] .dmwPinNode{width:34px;height:34px;font-size:17px}#"+PID+"[data-dam-fit=mobile-land] .dmwPin{gap:3px}",
      /* short stages (landscape phones, small windows): the lab chrome shrinks so the work area keeps its room */
      "#"+PID+"[data-dam-h560=\"1\"] .stmSteps{display:none}#"+PID+"[data-dam-h560=\"1\"] .stmHead{padding:4px 8px}#"+PID+"[data-dam-h560=\"1\"] .stmCoach{padding:3px 8px}",
      "#"+PID+"[data-dam-h560=\"1\"] .stmCoach .stmAv{display:none}#"+PID+"[data-dam-h560=\"1\"] .stmFoot{padding:6px 10px calc(6px + env(safe-area-inset-bottom,0px))}#"+PID+"[data-dam-h560=\"1\"] .stmPrimary{min-height:48px;padding:8px 12px}",
      "#"+PID+"[data-dam-h560=\"1\"] .stmWhy{padding:4px 10px;font-size:13px}#"+PID+"[data-dam-h560=\"1\"] .stmBody{padding:8px 12px}",
      /* "Desktop site" on a phone: the browser's media queries see ~980px, so the phone rules are re-applied by attribute */
      "#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwTitle span{display:none}",
      "#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwStats{grid-template-columns:1fr 1fr;gap:6px;padding:0 8px 8px}",
      "#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwWide,#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwPowerCard{display:none}",
      "#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwNarrow{display:inline}",
      "#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .geiMapMilestone{padding:18px 16px 14px}#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwMsIcon{font-size:44px}",
      "#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .dmwPill{padding:5px 9px 4px}#"+PID+"[data-dam-desktop-site=\"1\"][data-dam-fit^=mobile] .geiMapFactory{width:136px}",
      /* ⛶ FULL MAP — immersion layout: the journey is the centerpiece, secondary chrome steps aside */
      "#"+PID+"[data-dam-fs=on]{padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}",
      "#"+PID+"[data-dam-fs=on] .dmwShell{width:100%;height:100%;max-width:none;max-height:none;border-radius:0;border-width:0}",
      "#"+PID+"[data-dam-fs=on] .dmwStats,#"+PID+"[data-dam-fs=on] .dmwRail{display:none}",
      "#"+PID+"[data-dam-h560=\"1\"] .dmwTop{padding:6px 8px}#"+PID+"[data-dam-h560=\"1\"] .dmwStats{display:none}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------- viewport engine ---------- */
  var sig="";
  function fsEl(){return document.fullscreenElement||document.webkitFullscreenElement||null;}
  function measure(){
    var vv=window.visualViewport,iw=window.innerWidth,ih=window.innerHeight;
    var vw=vv?vv.width:iw,vh=vv?vv.height:ih,top=vv?vv.offsetTop:0;
    var sw=(window.screen&&screen.width)||iw;               // the screen width in the CURRENT orientation (a rotated phone is not "desktop site")
    var coarse=false;try{coarse=matchMedia("(pointer:coarse)").matches||navigator.maxTouchPoints>0;}catch(e){}
    /* "Desktop site" on a phone: wide layout viewport squeezed onto a small screen → compensate with a zoom */
    var desk=coarse&&sw<=900&&vw/sw>=1.5&&vw>=900;
    var z=desk?clamp(vw/sw,1,3.2):1;
    var lw=vw/z,lh=vh/z,land=lw>lh;
    var fit=lw>=1024&&!desk?"desktop":lw>=600&&lh>=500?"tablet":land&&lh<500?"mobile-land":"mobile";
    if(desk)fit=lw>=600&&lh>=500?"tablet":land?"mobile-land":"mobile";
    return {vw:Math.round(vw),vh:Math.round(vh),lw:Math.round(lw),lh:Math.round(lh),z:Math.round(z*100)/100,top:Math.round(top),fit:fit,land:land,desk:desk,sw:sw};
  }
  function apply(force){
    var p=page();if(!p)return;styles();
    var m=measure(),fs=fsEl()===p?"on":"off",s=[m.lw,m.lh,m.z,m.top,m.fit,m.desk,fs].join("|");
    if(s===sig&&!force)return;sig=s;
    p.style.setProperty("--dam-vw",m.lw+"px");p.style.setProperty("--dam-vh",m.lh+"px");p.style.setProperty("--dam-top",m.top+"px");p.style.setProperty("--dam-z",m.z);
    p.style.zoom=m.z>1?String(m.z):"";
    p.style.width=m.z>1?m.lw+"px":"";p.style.right=m.z>1?"auto":"";                          // zoomed stages are sized in logical px; the normal stage is left:0/right:0
    p.setAttribute("data-dam-fit",m.fit);p.setAttribute("data-dam-orient",m.land?"landscape":"portrait");
    p.setAttribute("data-dam-desktop-site",m.desk?"1":"0");p.setAttribute("data-dam-narrow",m.lw<=440?"1":"0");p.setAttribute("data-dam-h560",m.lh<560?"1":"0");p.setAttribute("data-dam-h620",m.lh<620?"1":"0");p.setAttribute("data-dam-tall",m.lh>=700?"1":"0");p.setAttribute("data-dam-fs",fs);
    paintFs();
    if(isOpen()){try{window.dispatchEvent(new Event("resize"));}catch(e){}}      // the map re-lays itself out; no reload, no reset
  }
  var raf=0;function soon(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;apply(false);});}

  /* ---------- ⛶ FULL MAP ---------- */
  function fsSupported(){var p=page();return !!(p&&(p.requestFullscreen||p.webkitRequestFullscreen)&&(document.fullscreenEnabled||document.webkitFullscreenEnabled));}
  function enterFs(){var p=page();if(!p)return;var f=p.requestFullscreen||p.webkitRequestFullscreen;try{var r=f.call(p,{navigationUI:"hide"});if(r&&r.catch)r.catch(function(){});}catch(e){}}
  function exitFs(){var f=document.exitFullscreen||document.webkitExitFullscreen;if(!fsEl()||!f)return;try{var r=f.call(document);if(r&&r.catch)r.catch(function(){});}catch(e){}}
  function toggleFs(){if(fsEl()===page())exitFs();else enterFs();}
  function paintFs(){
    var b=$("dvFsBtn");if(!b)return;var on=fsEl()===page();
    b.hidden=!fsSupported();b.setAttribute("aria-pressed",on?"true":"false");
    b.setAttribute("aria-label",on?"Exit full map":"Full map: fill the screen");b.title=on?"Exit full map":"Full map";b.textContent=on?"⤢":"⛶";
  }
  function wire(){
    var p=page();if(!p)return false;styles();
    var top=p.querySelector(".dmwTop"),title=$("dmwTitleText");
    if(title&&!title.querySelector(".dvEmoji"))title.innerHTML='DAM MAP<span class="dvEmoji" aria-hidden="true"> 🗺️💧</span>';
    if(top&&!$("dvFsBtn")){
      var b=document.createElement("button");b.type="button";b.id="dvFsBtn";b.className="dmwBtn";b.addEventListener("click",toggleFs);
      var snd=$("geiMapSound");top.insertBefore(b,snd||null);
    }
    if(!p.dataset.dvWatch){
      p.dataset.dvWatch="1";
      new MutationObserver(function(){if(!isOpen()){exitFs();}else soon();}).observe(p,{attributes:true,attributeFilter:["class"]});
    }
    paintFs();apply(true);return true;
  }
  ["resize","orientationchange"].forEach(function(ev){window.addEventListener(ev,soon,{passive:true});});
  if(window.visualViewport){window.visualViewport.addEventListener("resize",soon,{passive:true});window.visualViewport.addEventListener("scroll",soon,{passive:true});}
  ["fullscreenchange","webkitfullscreenchange"].forEach(function(ev){document.addEventListener(ev,function(){apply(true);setTimeout(function(){apply(true);},250);});});

  /* ---------- 🧪 audit: the DAM VIEW TESTER's engine ---------- */
  function vis(e,cs){
    if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity===0)return false;
    var r=e.getBoundingClientRect();return r.width>1&&r.height>1;
  }
  function occluded(e,r){
    var x=r.left+r.width/2,y=r.top+r.height/2;if(x<0||y<0||x>window.innerWidth||y>window.innerHeight)return false;
    var t=document.elementFromPoint(x,y);return !!t&&!e.contains(t)&&!t.contains(e);
  }
  /* the part of an element that is really on screen: its box ∩ every ancestor that clips (hidden / auto / scroll) */
  function visibleRect(e,r){
    var L=r.left,T=r.top,R=r.right,B=r.bottom;
    for(var a=e.parentElement;a;a=a.parentElement){
      var ac=getComputedStyle(a);if(ac.overflowX==="visible"&&ac.overflowY==="visible")continue;
      var ar=a.getBoundingClientRect();
      if(ac.overflowX!=="visible"){L=Math.max(L,ar.left);R=Math.min(R,ar.right);}
      if(ac.overflowY!=="visible"){T=Math.max(T,ar.top);B=Math.min(B,ar.bottom);}
    }
    return R-L>1&&B-T>1?{left:L,top:T,right:R,bottom:B,width:R-L,height:B-T}:null;
  }
  function describe(e){return (e.id?"#"+e.id:"")+(e.className&&typeof e.className==="string"?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):e.tagName.toLowerCase())+" “"+(e.textContent||"").trim().replace(/\s+/g," ").slice(0,24)+"”";}
  function ownText(e){for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&/\S/.test(n.nodeValue))return true;return false;}
  function audit(root){
    var p=root||page(),out={ok:true,issues:[],warns:[],meta:null};
    if(!p||!p.classList.contains("show")){out.ok=false;out.issues.push({kind:"closed",what:"DAM Map is not open"});return out;}
    var m=measure();out.meta={fit:p.getAttribute("data-dam-fit"),vw:m.vw,vh:m.vh,z:m.z,fs:p.getAttribute("data-dam-fs"),desk:m.desk};
    var W=window.innerWidth,H=window.innerHeight,all=[].slice.call(p.querySelectorAll("*")),ctrls=[];
    function add(list,kind,e,extra){if(list.length<40)list.push({kind:kind,what:describe(e),extra:extra||""});}
    var sh=p.querySelector(".dmwShell");
    if(sh){var sr=sh.getBoundingClientRect();if(sr.top<-1||sr.left<-1||sr.right>W+1||sr.bottom>H+1)add(out.issues,"offscreen",sh,"stage "+Math.round(sr.top)+","+Math.round(sr.bottom)+" of "+H);}
    all.forEach(function(e){
      if(e.closest("svg")||e.closest("[data-dv-ok]")||e.classList.contains("srOnly"))return;
      var cs=getComputedStyle(e);if(!vis(e,cs))return;
      var r=e.getBoundingClientRect(),interactive=e.matches("button,[role=button],a[href],input,select");
      var vr=visibleRect(e,r);if(!vr)return;                       // scrolled out of its container: not on screen
      if(occluded(e,vr))return;                                    // covered by an overlay (e.g. the STEM lab over the map): not on screen
      if(interactive)ctrls.push({e:e,r:vr});
      /* unreadable */
      if(ownText(e)&&parseFloat(cs.fontSize)<10)add(out.issues,"unreadable",e,cs.fontSize);
      /* truncated / clipped by itself */
      if(ownText(e)&&(cs.overflowX==="hidden"||cs.overflowX==="clip"||cs.textOverflow==="ellipsis")&&e.scrollWidth>e.clientWidth+2)add(out.issues,"truncated",e,e.scrollWidth+">"+e.clientWidth);
      if(ownText(e)&&(cs.overflowY==="hidden"||cs.overflowY==="clip")&&e.scrollHeight>e.clientHeight+2)add(out.issues,"clipped",e,e.scrollHeight+">"+e.clientHeight);
      /* clipped by an ancestor that hides overflow on that axis */
      if(ownText(e)||interactive){
        var stopX=false,stopY=false;
        for(var a=e.parentElement;a;a=a.parentElement){
          if(a.hasAttribute("data-dv-ok"))break;
          var ac=getComputedStyle(a),ar=a.getBoundingClientRect();
          var sx=/(auto|scroll)/.test(ac.overflowX),sy=/(auto|scroll)/.test(ac.overflowY),hx=/(hidden|clip)/.test(ac.overflowX),hy=/(hidden|clip)/.test(ac.overflowY);
          if(!stopY&&hy&&(r.bottom>ar.bottom+1.5||r.top<ar.top-1.5)){add(out.issues,"clipped",e,"by "+describe(a).split(" “")[0]+" (y)");break;}
          if(!stopX&&hx&&(r.right>ar.right+1.5||r.left<ar.left-1.5)){add(out.issues,"clipped",e,"by "+describe(a).split(" “")[0]+" (x)");break;}
          if(sy)stopY=true;if(sx)stopX=true;
          if(a===p||(stopX&&stopY))break;
        }
        /* off the stage */
        var pr=p.getBoundingClientRect();
        if(interactive&&!e.closest(".dmwScroll,.dmwTrack,.stmBody")&&(r.left<pr.left-1||r.right>pr.right+1||r.top<pr.top-1||r.bottom>pr.bottom+1||r.bottom>H+1||r.right>W+1))add(out.issues,"offscreen",e);
      }
      if(interactive&&(r.width<44||r.height<44)&&!e.closest(".dmwTrack"))add(out.warns,"small-target",e,Math.round(r.width)+"x"+Math.round(r.height));
    });
    /* overlapping controls (siblings in chrome; scene parts excluded) */
    for(var i=0;i<ctrls.length;i++)for(var j=i+1;j<ctrls.length;j++){
      var A=ctrls[i],B=ctrls[j];if(A.e.contains(B.e)||B.e.contains(A.e))continue;
      if(A.e.closest(".dmwScene,.dmwTrack,.stmBody")&&B.e.closest(".dmwScene,.dmwTrack,.stmBody")&&A.e.closest(".dmwScene")===B.e.closest(".dmwScene")&&!A.e.closest(".dmwScene"))continue;
      var ox=Math.min(A.r.right,B.r.right)-Math.max(A.r.left,B.r.left),oy=Math.min(A.r.bottom,B.r.bottom)-Math.max(A.r.top,B.r.top);
      if(ox>3&&oy>3&&!(A.e.closest(".stmBody")&&B.e.closest(".stmBody")&&(A.e.matches("[data-comp],.ftwOpt")||B.e.matches("[data-comp],.ftwOpt"))))add(out.issues,"overlap",A.e,"with "+describe(B.e).split(" “")[0]);
    }
    out.ok=out.issues.length===0;return out;
  }

  window.__GEI_DAM_VIEW__={version:VERSION,measure:measure,apply:function(){apply(true);},audit:audit,toggleFullscreen:toggleFs,enterFullscreen:enterFs,exitFullscreen:exitFs,fullscreenSupported:fsSupported,
    mode:function(){var p=page();return p?{fit:p.getAttribute("data-dam-fit"),orient:p.getAttribute("data-dam-orient"),desktopSite:p.getAttribute("data-dam-desktop-site")==="1",fullscreen:p.getAttribute("data-dam-fs")==="on"}:null;}};
  wire();window.addEventListener("load",function(){wire();});document.addEventListener("DOMContentLoaded",wire);
})();
