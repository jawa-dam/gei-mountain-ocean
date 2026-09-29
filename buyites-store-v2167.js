/* V2.1.67 — BUY-ites STORE SESSION MEMORY & SELECTION FEEDBACK
   Presentation-only enhancement for the V2.1.66 category deck.
   - Remembers the last selected shelf for the current session.
   - Restores that shelf whenever BUY-ites opens.
   - Adds a clear current-shelf status line.
   - Gives category buttons a crisp press/selection response.
   - Does not alter FL OZ, purchases, ownership, progression, or entitlement authority.
*/
(function(){
  "use strict";
  const VERSION="2.1.67";
  const KEY="gei-buyites-last-shelf-v1";
  const DEFAULT_SHELF="storeCharactersSection";

  function qs(s){return document.querySelector(s);}
  function storePanel(){return document.getElementById("storePanel");}
  function buttons(){return Array.from(document.querySelectorAll("#storePanel .storeQuickBtn"));}

  function shelfLabel(id){
    const b=buttons().find(x=>x.getAttribute("data-store-jump")===id);
    return b ? b.textContent.replace(/^[^A-Za-z0-9]+/,"").trim() : "CHARACTERS";
  }

  function readShelf(){
    try{
      const v=sessionStorage.getItem(KEY);
      return v || DEFAULT_SHELF;
    }catch(e){return DEFAULT_SHELF;}
  }

  function saveShelf(id){
    try{sessionStorage.setItem(KEY,id);}catch(e){}
  }

  function ensureStyles(){
    if(document.getElementById("geiV2167StoreStyles")) return;
    const st=document.createElement("style");
    st.id="geiV2167StoreStyles";
    st.textContent=
      "#storePanel .v2167ShelfStatus{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 10px;padding:8px 10px;border:1px solid rgba(255,255,255,.10);border-radius:12px;background:rgba(0,0,0,.16);font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.72)}"+
      "#storePanel .v2167ShelfStatus strong{color:var(--water-bright,#2fd2ff);font-size:.76rem}"+
      "#storePanel .storeQuickBtn{transition:transform .14s ease,box-shadow .18s ease,filter .18s ease}"+
      "#storePanel .storeQuickBtn:active{transform:scale(.965)!important;filter:brightness(1.12)}"+
      "#storePanel .storeQuickBtn.active{position:relative}"+
      "#storePanel .storeQuickBtn.active::after{content:'✓';position:absolute;right:7px;top:5px;width:17px;height:17px;border-radius:50%;display:grid;place-items:center;font-size:.62rem;font-weight:1000;background:var(--water-bright,#2fd2ff);color:#06101b;box-shadow:0 0 10px rgba(47,210,255,.35)}"+
      "@media(max-width:430px){#storePanel .v2167ShelfStatus{font-size:.66rem;padding:7px 9px}}"+
      "@media(prefers-reduced-motion:reduce){#storePanel .storeQuickBtn{transition:none}}";
    document.head.appendChild(st);
  }

  function ensureStatus(){
    const hero=qs("#storePanel .storeFrontHero");
    if(!hero || qs("#buyitesShelfStatus")) return;
    const title=hero.querySelector(".storeFrontHeroTitle");
    const el=document.createElement("div");
    el.id="buyitesShelfStatus";
    el.className="v2167ShelfStatus";
    el.innerHTML="<span>CURRENT SHELF</span><strong></strong>";
    if(title && title.nextSibling) hero.insertBefore(el,title.nextSibling);
    else hero.appendChild(el);
  }

  function updateStatus(id){
    ensureStatus();
    const el=document.getElementById("buyitesShelfStatus");
    if(el){
      const strong=el.querySelector("strong");
      if(strong) strong.textContent=shelfLabel(id);
    }
  }

  function restore(){
    const panel=storePanel();
    if(!panel) return;
    const wanted=readShelf();
    const target=document.getElementById(wanted) || document.getElementById(DEFAULT_SHELF);
    if(!target) return;
    const btn=buttons().find(x=>x.getAttribute("data-store-jump")===target.id);
    document.querySelectorAll("#storePanel .storeSection").forEach(s=>s.classList.toggle("storeSectionActive",s===target));
    buttons().forEach(b=>{
      const active=b===btn;
      b.classList.toggle("active",active);
      b.setAttribute("aria-selected",active?"true":"false");
    });
    updateStatus(target.id);
  }

  function bind(){
    ensureStyles();
    ensureStatus();

    buttons().forEach(btn=>{
      if(btn.dataset.v2167Bound==="1") return;
      btn.dataset.v2167Bound="1";
      btn.addEventListener("click",function(){
        const id=btn.getAttribute("data-store-jump");
        if(!id) return;
        saveShelf(id);
        updateStatus(id);
      },{passive:true});
    });

    restore();

    const panel=storePanel();
    if(panel && !panel.dataset.v2167Observed){
      panel.dataset.v2167Observed="1";
      const observer=new MutationObserver(function(){
        const visible=getComputedStyle(panel).display!=="none" &&
          getComputedStyle(panel).visibility!=="hidden";
        if(visible) restore();
      });
      observer.observe(panel,{attributes:true,attributeFilter:["class","style","hidden"]});
    }

    window.__GEI_V2167_BUYITES__={
      version:VERSION,
      restore:restore,
      getShelf:function(){return readShelf();},
      setShelf:function(id){
        if(document.getElementById(id)){
          saveShelf(id);
          restore();
          return true;
        }
        return false;
      }
    };
  }

  function start(){
    if(!document.body) return;
    const run=function(){setTimeout(bind,0);};
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run,{once:true});
    else run();
  }
  start();
})();