/* =========================================================
   V2.1.69 — RANDOMIZED DAY CARD VISUAL EXPERIENCE
   Presentation-only Day 1–Day 6 mastered-card effects.
   Reads existing progression authority; never writes game state.
========================================================= */
(function(){
  "use strict";
  const VERSION="2.1.69", NS="http://www.w3.org/2000/svg", DAYS=6;
  const FALLBACK=[120,245,360,470,580,690];
  const THEMES=[
    ["aqua","#2fd2ff","#7af3ff","#eafcff","#03203f"],
    ["deep","#1e6bff","#2fd2ff","#a8ecff","#021434"],
    ["electric","#7a5cff","#2fd2ff","#e6f7ff","#0d0830"],
    ["magenta","#f310ba","#ff9df2","#ffe3f8","#2a0420"],
    ["golden","#ffb627","#ffd76a","#fff4c9","#2a1a00"],
    ["prism","#2fd2ff","#f310ba","#ffd76a","#10062a"],
    ["cosmic","#3d3dea","#f310ba","#c9c2ff","#07061f"],
    ["crystal","#7fd8ff","#bff4ff","#fff","#062033"],
    ["ripple","#29c6ff","#3ddcb0","#dffcf4","#032a26"]
  ];
  const DAY_AFF=[
    [4,7,0,5],[2,1,4,7],[1,8,0,6],[2,3,0,8],[3,4,2,5],[5,6,4,3]
  ];
  const fx={root:null,cards:[],themes:Array(DAYS),lastDone:0,lastLevel:null,
    pending:new Set(),reduced:false,observer:null,online:null,surge:null,timer:null};

  const rand=(a,b)=>a+Math.random()*(b-a);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  function centers(){
    try{if(typeof CENTERS!=="undefined"&&Array.isArray(CENTERS)&&CENTERS.length>=DAYS)return CENTERS;}catch(e){}
    return FALLBACK;
  }
  function progress(){
    try{
      if(typeof daysDoneThisLevel==="function"&&typeof state==="object"&&state)
        return {done:Math.max(0,Math.min(DAYS,Number(daysDoneThisLevel())||0)),level:state.level,current:state.currentStep};
    }catch(e){}
    let done=0,current=-1;
    document.querySelectorAll("#dayGuide .dayGuideItem").forEach((el,i)=>{
      if(el.classList.contains("done"))done=i+1;
      if(el.classList.contains("current"))current=i;
    });
    return {done,current,level:1};
  }
  function el(tag,a={}){
    const n=document.createElementNS(NS,tag);
    Object.keys(a).forEach(k=>n.setAttribute(k,a[k]));
    return n;
  }
  function path(x,y,w,h,r){
    return `M${x+r} ${y}H${x+w-r}A${r} ${r} 0 0 1 ${x+w} ${y+r}V${y+h-r}A${r} ${r} 0 0 1 ${x+w-r} ${y+h}H${x+r}A${r} ${r} 0 0 1 ${x} ${y+h-r}V${y+r}A${r} ${r} 0 0 1 ${x+r} ${y}Z`;
  }
  function theme(i){
    const used=fx.themes.filter(Boolean).map(x=>x[0]);
    const pool=DAY_AFF[i].map(n=>THEMES[n]).filter(x=>!used.includes(x[0]));
    return pick(pool.length?pool:THEMES);
  }
  function inject(){
    if(document.getElementById("geiDayCardFxStyle"))return;
    const s=document.createElement("style");s.id="geiDayCardFxStyle";
    s.textContent=`
      #dayCardFx,#dayCardFx *{pointer-events:none!important}
      #dayCardFx .dc{--c1:#2fd2ff;--c2:#7af3ff;--c3:#eafcff;--ink:#03203f}
      #dayCardFx .plate{fill:rgba(3,8,26,.34);stroke:none}
      #dayCardFx .tint{fill:url(#dcFill);opacity:0}
      #dayCardFx .edge{fill:none;stroke:var(--c2);stroke-width:2.5;stroke-opacity:.18}
      #dayCardFx .glow{fill:none;stroke:var(--c2);stroke-width:10;stroke-opacity:0;filter:url(#dcBlur)}
      #dayCardFx .motif{fill:none;stroke:var(--c2);stroke-width:2;opacity:.08}
      #dayCardFx .pill{opacity:0}
      #dayCardFx .pill rect{fill:var(--c2);stroke:var(--c3);stroke-width:1.5}
      #dayCardFx .pill text{fill:var(--ink);font:900 15px Inter,system-ui,sans-serif;letter-spacing:1px}
      #dayCardFx .particle{fill:var(--c3);opacity:0}
      #dayCardFx .burst{fill:none;stroke:var(--c3);stroke-width:4;opacity:0;transform-box:fill-box;transform-origin:center}
      #dayCardFx .sweep{fill:url(#dcSweep);opacity:0}
      #dayCardFx .dc.mastered .plate{fill:rgba(3,8,26,.43)}
      #dayCardFx .dc.mastered .tint{opacity:1}
      #dayCardFx .dc.mastered .edge{stroke:url(#dcEdge);stroke-opacity:.8}
      #dayCardFx .dc.mastered .glow{stroke-opacity:.34}
      #dayCardFx .dc.mastered .motif{opacity:.24}
      #dayCardFx .dc.mastered .pill{opacity:1}
      @media(prefers-reduced-motion:no-preference){
        #dayCardFx .dc.mastered .glow{animation:dcBreath 3.8s ease-in-out infinite}
        #dayCardFx .dc.mastered .sweep{animation:dcSweep 8s ease-in-out infinite}
        #dayCardFx .dc.mastered .motif.m1{animation:dcSpin 34s linear infinite}
        #dayCardFx .dc.mastered .motif.m2{animation:dcFlow 3s linear infinite}
        #dayCardFx .dc.burst .burst{animation:dcRing .8s ease-out both}
        #dayCardFx .dc.burst .sweep{animation:dcBurst .85s ease-out both}
        #dayCardFx .dc.burst .particle{animation:dcPop .9s ease-out both}
        #dayCardFx .dc.burst .pill{animation:dcPill .5s .55s cubic-bezier(.3,1.6,.5,1) both}
        #dayCardFx .online{animation:dcOnline .8s ease-out both}
      }
      #dayCardFx .online{opacity:0}
      #dayCardFx .online.show{opacity:1}
      #dayCardFx .online rect{fill:rgba(3,8,26,.72);stroke:url(#dcEdge);stroke-width:2}
      #dayCardFx .online text{fill:#fff;font:900 16px Inter,system-ui,sans-serif;letter-spacing:2px}
      @keyframes dcBreath{0%,100%{opacity:.22}50%{opacity:.48}}
      @keyframes dcSweep{0%,82%,100%{opacity:0;transform:translateX(-80px)}10%,28%{opacity:.5}45%{opacity:0;transform:translateX(560px)}}
      @keyframes dcSpin{to{transform:rotate(360deg)}}
      @keyframes dcFlow{to{stroke-dashoffset:-42}}
      @keyframes dcRing{0%{opacity:.9;transform:scale(.25)}100%{opacity:0;transform:scale(4)}}
      @keyframes dcBurst{0%{opacity:0;transform:translateX(-180px)}20%{opacity:.75}100%{opacity:0;transform:translateX(620px)}}
      @keyframes dcPop{0%{opacity:.9;transform:translate(0,0) scale(1.2)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.35)}}
      @keyframes dcPill{0%{opacity:0;transform:scale(.45)}100%{opacity:1;transform:none}}
      @keyframes dcOnline{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:none}}
      @media(prefers-reduced-motion:reduce){
        #dayCardFx *{animation:none!important;transition:none!important}
        #dayCardFx .particle,#dayCardFx .burst{display:none!important}
      }`;
    document.head.appendChild(s);
  }
  function motif(i,c){
    if(i===0){
      let q="";for(let k=0;k<10;k++){const a=k*Math.PI/5;q+=`<line x1="${200+Math.cos(a)*34}" y1="${c+Math.sin(a)*34}" x2="${200+Math.cos(a)*145}" y2="${c+Math.sin(a)*145}"/>`;}
      return `<g class="motif m1">${q}</g>`;
    }
    if(i===1)return `<g class="motif"><path d="M20 ${c-38}H380M20 ${c-8}H380M20 ${c+22}H380M20 ${c+48}H380"/></g>`;
    if(i===2)return `<g class="motif m2"><path d="M-20 ${c+25}q20-14 40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0t40 0"/></g>`;
    if(i===3)return `<g class="motif m2">${[40,82,124,166,208,250,292,334].map(x=>`<rect x="${x}" y="${c-48}" width="12" height="96" rx="3"/>`).join("")}</g>`;
    if(i===4)return `<g class="motif m1"><circle cx="200" cy="${c}" r="70" stroke-dasharray="10 8"/><circle cx="200" cy="${c}" r="15"/><path d="M200 ${c-90}v180M110 ${c}h180"/></g>`;
    return `<g class="motif m2"><path d="M10 ${c-25}H120V${c+25}H280V${c-25}H390" stroke-dasharray="10 8"/><circle cx="120" cy="${c}" r="5"/><circle cx="280" cy="${c}" r="5"/></g>`;
  }
  function build(){
    const svg=document.getElementById("worldSVG"),guide=document.getElementById("dayGuide");
    if(!svg||!guide)return false;
    let root=document.getElementById("dayCardFx");
    if(root&&root.ownerSVGElement===svg&&fx.cards.length===DAYS)return true;
    if(root)root.remove();
    root=el("g",{id:"dayCardFx","aria-hidden":"true","pointer-events":"none"});
    root.innerHTML=`<defs>
      <filter id="dcBlur"><feGaussianBlur stdDeviation="6"/></filter>
      <linearGradient id="dcFill" x1="0" y1="0" x2="1" y2="1"><stop id="dcS1" offset="0"/><stop id="dcS0" offset=".55"/><stop id="dcS2" offset="1"/></linearGradient>
      <linearGradient id="dcEdge" x1="0" y1="0" x2="1" y2="0"><stop id="dcE1"/><stop id="dcE2" offset=".5"/><stop id="dcE3" offset="1"/></linearGradient>
      <linearGradient id="dcSweep" x1="0" y1="0" x2="1" y2="0"><stop id="dcW0" stop-opacity="0"/><stop id="dcW1" offset=".5" stop-opacity=".55"/><stop id="dcW2" offset="1" stop-opacity="0"/></linearGradient>
    </defs>`;
    fx.cards=[];
    centers().slice(0,DAYS).forEach((c,i)=>{
      const x=8,y=c-52,w=384,h=104,r=18,edge=path(x,y,w,h,r);
      const g=el("g",{class:"dc","data-day":i+1});
      g.innerHTML=`<path class="plate" d="${edge}"/><path class="tint" d="${edge}"/>
        <g clip-path="url(#none)"><g>${motif(i,c)}</g><rect class="sweep" x="-150" y="${y-50}" width="90" height="${h+100}"/></g>
        <circle class="burst" cx="200" cy="${c}" r="34"/><path class="glow" d="${edge}"/><path class="edge" d="${edge}"/>
        <g class="particles"></g><g class="pill"><rect x="34" y="${c+35}" width="108" height="22" rx="11"/><text x="88" y="${c+51}" text-anchor="middle">MASTERED</text></g>`;
      root.appendChild(g);fx.cards.push({g,c,particles:g.querySelector(".particles"),burst:g.querySelector(".burst")});
    });
    fx.surge=el("rect",{class:"surge",x:0,y:0,width:400,height:110});
    fx.online=el("g",{class:"online"});
    fx.online.innerHTML='<rect x="72" y="14" width="256" height="32" rx="16"/><text x="200" y="36" text-anchor="middle">DAM SYSTEM ONLINE</text>';
    root.appendChild(fx.surge);root.appendChild(fx.online);
    svg.insertBefore(root,guide);fx.root=root;
    fx.cards.forEach((_,i)=>roll(i));
    return true;
  }

  function isolateGradients(i){
    const card=fx.cards[i]; if(!card)return;
    const cs=getComputedStyle(card.g);
    const vals={c1:cs.getPropertyValue("--c1").trim(),c2:cs.getPropertyValue("--c2").trim(),c3:cs.getPropertyValue("--c3").trim(),ink:cs.getPropertyValue("--ink").trim()};
    let defs=card.g.querySelector("defs.dcDefs");
    if(!defs){defs=document.createElementNS(NS,"defs");defs.setAttribute("class","dcDefs");card.g.insertBefore(defs,card.g.firstChild);}
    defs.innerHTML='<linearGradient id="dcFillCard'+i+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+vals.c1+'"/><stop offset=".55" stop-color="'+vals.ink+'"/><stop offset="1" stop-color="'+vals.c2+'"/></linearGradient><linearGradient id="dcEdgeCard'+i+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+vals.c1+'"/><stop offset=".5" stop-color="'+vals.c3+'"/><stop offset="1" stop-color="'+vals.c2+'"/></linearGradient><linearGradient id="dcSweepCard'+i+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+vals.c3+'" stop-opacity="0"/><stop offset=".5" stop-color="'+vals.c3+'" stop-opacity=".55"/><stop offset="1" stop-color="'+vals.c3+'" stop-opacity="0"/></linearGradient>';
    const tint=card.g.querySelector(".tint"),edge=card.g.querySelector(".edge"),sweep=card.g.querySelector(".sweep");
    if(tint)tint.style.setProperty("fill","url(#dcFillCard"+i+")");
    if(edge)edge.style.setProperty("stroke","url(#dcEdgeCard"+i+")");
    if(sweep)sweep.style.setProperty("fill","url(#dcSweepCard"+i+")");
    const clipId="dcClipCard"+i;
    let clip=defs.querySelector("#"+clipId);
    if(!clip){clip=document.createElementNS(NS,"clipPath");clip.setAttribute("id",clipId);clip.appendChild(document.createElementNS(NS,"path"));defs.appendChild(clip);}
    clip.firstChild.setAttribute("d",card.g.querySelector(".plate").getAttribute("d"));
    const visualGroup=card.g.querySelector("g[clip-path]");
    if(visualGroup)visualGroup.setAttribute("clip-path","url(#"+clipId+")");
  }

  function roll(i){
    const t=theme(i),[id,c1,c2,c3,ink]=t,card=fx.cards[i];
    fx.themes[i]=t;
    card.g.style.setProperty("--c1",c1);card.g.style.setProperty("--c2",c2);card.g.style.setProperty("--c3",c3);card.g.style.setProperty("--ink",ink);
    const stops=[["dcS1",c1],["dcS0",ink],["dcS2",c2],["dcE1",c1],["dcE2",c3],["dcE3",c2],["dcW0",c3],["dcW1",c3],["dcW2",c3]];
    stops.forEach(([id,v])=>{const n=document.getElementById(id);if(n)n.setAttribute("stop-color",v);});
    card.g.dataset.theme=id;
    isolateGradients(i);
  }
  function particles(card){
    card.particles.replaceChildren();
    if(fx.reduced)return;
    for(let n=0;n<7;n++){
      const p=el("circle",{class:"particle",cx:200,cy:card.c,r:rand(2,4).toFixed(1)});
      const a=n/7*Math.PI*2+rand(-.2,.2),d=rand(65,145);
      p.style.setProperty("--dx",Math.cos(a)*d+"px");p.style.setProperty("--dy",Math.sin(a)*d*.55+"px");
      p.style.animationDelay=rand(.25,.45)+"s";card.particles.appendChild(p);
    }
  }
  function burst(i){
    const card=fx.cards[i];if(!card)return;
    roll(i);card.g.classList.add("mastered");particles(card);
    if(fx.reduced)return;
    card.g.classList.remove("burst");void card.g.getBoundingClientRect();card.g.classList.add("burst");
    setTimeout(()=>card.g.classList.remove("burst"),1500);
  }
  function sync(){
    if(!build())return;
    const p=progress();
    if(fx.lastLevel!==null&&p.level!==fx.lastLevel){
      fx.cards.forEach(c=>c.g.classList.remove("mastered"));fx.lastDone=0;fx.themes.fill(null);
      fx.cards.forEach((_,i)=>roll(i));
    }
    if(p.done>fx.lastDone){
      for(let i=fx.lastDone;i<p.done;i++)burst(i);
    }
    fx.cards.forEach((c,i)=>c.g.classList.toggle("mastered",i<p.done));
    if(fx.online)fx.online.classList.toggle("show",p.done===DAYS);
    fx.lastDone=p.done;fx.lastLevel=p.level;
  }
  function selfTest(){
    const root=document.getElementById("dayCardFx"),p=progress();
    const results=[
      ["layer mounted in worldSVG",!!(root&&root.ownerSVGElement&&root.ownerSVGElement.id==="worldSVG")],
      ["six Day cards render",!!(root&&root.querySelectorAll(".dc").length===DAYS)],
      ["decorative layer is non-interactive",!!(root&&getComputedStyle(root).pointerEvents==="none")],
      ["mastered state mirrors progression",fx.cards.every((c,i)=>c.g.classList.contains("mastered")===i<p.done)],
      ["online state requires all six Days",!!(fx.online&&fx.online.classList.contains("show")===(p.done===DAYS))]
    ];
    return {version:VERSION,pass:results.filter(x=>x[1]).length,fail:results.filter(x=>!x[1]).length,results};
  }
  function boot(){
    inject();const mq=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)");
    fx.reduced=!!(mq&&mq.matches);if(!build()){setTimeout(boot,400);return;}sync();
    const guide=document.getElementById("dayGuide");
    if(guide){fx.observer=new MutationObserver(()=>requestAnimationFrame(sync));fx.observer.observe(guide,{subtree:true,childList:true,attributes:true,attributeFilter:["class"]});}
    setInterval(()=>{if(!document.hidden)sync()},2000);
    window.__GEI_V2169_DAY_CARDS__=Object.freeze({version:VERSION,selfTest,reroll:()=>{fx.cards.forEach((_,i)=>roll(i));},current:()=>fx.themes.map(t=>t&&t[0])});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();