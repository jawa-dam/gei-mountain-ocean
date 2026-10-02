/* V2.1.87 — DAM MAP ATMOSPHERE 🌞🌙🌧️⛈️❄️
 *
 * One random environment per page load: sunny · night · rain · storm · snow. It stays fixed for the whole session
 * (opening/closing the map never re-rolls it); a refresh may or may not change it. No cycling, no persistence.
 *
 * PRESENTATION ONLY — it never reads or writes tap rules, timer, FL OZ, XP, progression, characters, odds or prices.
 * There is deliberately NO text: no "RAIN", "STORM RAIN", "NIGHT WATER"… labels anywhere. The weather is discovered visually.
 *
 * The layer is fixed to the map window (sky and weather do not scroll with the scenery).
 * Cheap by construction: one decorative layer of ≈7 elements, CSS-only animation on transform/opacity, tiled SVG
 * particles that loop seamlessly (no per-particle DOM, no JavaScript loop). The map page is display:none when closed,
 * so nothing animates off-screen. The map page's own reduced-motion rule freezes every animation; the layer then stays
 * as a still atmosphere. The layer sits between the map artwork and the pin / Beaver / GEI card / station pills, and is
 * pointer-events:none + aria-hidden, so it can never block or hide any control.
 */
(function(){
  "use strict";
  if(window.GEI_DAM_MAP_ENV) return;
  var IDS=["sunny","night","rain","storm","snow"];
  var env={id:IDS[Math.floor(Math.random()*IDS.length)],initialized:true,ids:IDS.slice()};   // single source of truth
  window.GEI_DAM_MAP_ENV=env;

  function $(id){return document.getElementById(id);}
  function svgTile(w,h,body){return "url(\"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+body+'</svg>')+"\")";}

  /* seamless tiles: every streak/flake sits fully inside the tile, so a one-tile translate loops without a seam */
  var RAIN=svgTile(120,240,'<g stroke="#cfe6ff" stroke-width="1.4" stroke-linecap="round" opacity=".7">'+
    '<line x1="14" y1="10" x2="8" y2="34"/><line x1="52" y1="70" x2="46" y2="96"/><line x1="96" y1="30" x2="90" y2="54"/>'+
    '<line x1="30" y1="130" x2="24" y2="156"/><line x1="76" y1="150" x2="70" y2="174"/><line x1="108" y1="200" x2="102" y2="224"/><line x1="8" y1="190" x2="3" y2="210"/></g>');
  var STORM=svgTile(100,200,'<g stroke="#e4f0ff" stroke-width="1.8" stroke-linecap="round" opacity=".8">'+
    '<line x1="12" y1="8" x2="3" y2="40"/><line x1="46" y1="52" x2="37" y2="86"/><line x1="82" y1="20" x2="73" y2="52"/>'+
    '<line x1="24" y1="112" x2="15" y2="146"/><line x1="64" y1="128" x2="55" y2="162"/><line x1="92" y1="160" x2="84" y2="192"/></g>');
  var SNOW_A=svgTile(180,240,'<g fill="#fff"><circle cx="20" cy="22" r="2.6" opacity=".9"/><circle cx="84" cy="64" r="1.8" opacity=".75"/><circle cx="142" cy="30" r="2.2" opacity=".85"/>'+
    '<circle cx="48" cy="118" r="2.8" opacity=".9"/><circle cx="116" cy="150" r="1.7" opacity=".7"/><circle cx="160" cy="104" r="2.4" opacity=".85"/><circle cx="70" cy="204" r="2.1" opacity=".8"/><circle cx="150" cy="222" r="1.9" opacity=".75"/></g>');
  var SNOW_B=svgTile(130,200,'<g fill="#eaf4ff"><circle cx="30" cy="30" r="1.3" opacity=".7"/><circle cx="96" cy="72" r="1.5" opacity=".7"/><circle cx="60" cy="124" r="1.2" opacity=".65"/><circle cx="112" cy="168" r="1.4" opacity=".7"/><circle cx="14" cy="176" r="1.2" opacity=".6"/></g>');
  var STARS=svgTile(200,160,'<g fill="#fff"><circle cx="18" cy="20" r="1.2" opacity=".9"/><circle cx="70" cy="48" r="0.9" opacity=".7"/><circle cx="126" cy="14" r="1.3" opacity=".95"/><circle cx="170" cy="62" r="1" opacity=".75"/>'+
    '<circle cx="40" cy="96" r="0.9" opacity=".6"/><circle cx="104" cy="88" r="1.1" opacity=".8"/><circle cx="154" cy="128" r="0.9" opacity=".6"/><circle cx="84" cy="140" r="1" opacity=".7"/></g>');

  function css(){
    if($("geiMapAtmosStyle"))return;
    var s=document.createElement("style");s.id="geiMapAtmosStyle";
    s.textContent=
      ".dmwCaption{z-index:8}.geiAtmos{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;border-radius:inherit;contain:strict}"+
      ".geiAtmos>*{position:absolute;pointer-events:none}"+
      ".gaTint,.gaClouds,.gaCelestial,.gaStars,.gaFall,.gaFlash,.gaGround{display:none}"+
      ".gaTint{inset:0}"+
      ".gaClouds{left:-20%;top:0;width:140%;height:30%;background:"+
        "radial-gradient(ellipse 22% 38% at 12% 46%,var(--gaCloud) 0,transparent 70%),radial-gradient(ellipse 26% 42% at 38% 34%,var(--gaCloud) 0,transparent 70%),"+
        "radial-gradient(ellipse 22% 36% at 64% 50%,var(--gaCloud) 0,transparent 70%),radial-gradient(ellipse 28% 44% at 88% 36%,var(--gaCloud) 0,transparent 70%);"+
        "animation:gaDrift 70s linear infinite alternate;will-change:transform}"+
      ".gaFall{left:0;right:0;top:-240px;height:calc(100% + 240px);will-change:transform}"+
      ".gaStars{inset:0;height:58%;background:"+STARS+";background-size:200px 160px;animation:gaTwinkle 5s ease-in-out infinite alternate}"+
      ".gaCelestial{width:clamp(30px,9%,54px);aspect-ratio:1;border-radius:50%;right:9%;top:6%}"+
      ".gaFlash{inset:0;height:62%;background:radial-gradient(ellipse 70% 90% at 62% 0%,rgba(215,230,255,.9),rgba(160,190,255,.25) 55%,transparent 75%);opacity:0}"+
      ".gaGround{left:0;right:0;bottom:0;height:20%;background:linear-gradient(0deg,rgba(255,255,255,.2),transparent)}"+
      /* ---- sunny */
      ".geiAtmos[data-env=sunny]{--gaCloud:rgba(255,255,255,.5)}"+
      ".geiAtmos[data-env=sunny] .gaTint{display:block;background:radial-gradient(ellipse 70% 55% at 85% 0%,rgba(255,220,130,.34),transparent 70%),linear-gradient(180deg,rgba(255,232,170,.12),rgba(255,214,140,.06))}"+
      ".geiAtmos[data-env=sunny] .gaClouds,.geiAtmos[data-env=sunny] .gaCelestial{display:block}"+
      ".geiAtmos[data-env=sunny] .gaCelestial{background:radial-gradient(circle,#fffbe0 0,#ffe27a 55%,rgba(255,200,80,0) 72%);box-shadow:0 0 34px 12px rgba(255,214,110,.5);animation:gaSun 6s ease-in-out infinite alternate}"+
      /* ---- night */
      ".geiAtmos[data-env=night]{--gaCloud:rgba(120,140,200,.22)}"+
      ".geiAtmos[data-env=night] .gaTint{display:block;background:linear-gradient(180deg,rgba(8,16,54,.4),rgba(10,24,70,.26) 60%,rgba(8,20,60,.2))}"+
      ".geiAtmos[data-env=night] .gaStars,.geiAtmos[data-env=night] .gaCelestial,.geiAtmos[data-env=night] .gaClouds{display:block}"+
      ".geiAtmos[data-env=night] .gaCelestial{background:#f3f0d6;box-shadow:inset -9px -4px 0 0 rgba(150,160,190,.5),0 0 26px 8px rgba(200,215,255,.4)}"+
      /* ---- rain */
      ".geiAtmos[data-env=rain]{--gaCloud:rgba(70,84,106,.55)}"+
      ".geiAtmos[data-env=rain] .gaTint{display:block;background:linear-gradient(180deg,rgba(18,30,52,.34),rgba(24,40,66,.2))}"+
      ".geiAtmos[data-env=rain] .gaClouds,.geiAtmos[data-env=rain] .gaFall.f1{display:block}"+
      ".geiAtmos[data-env=rain] .gaFall.f1{background:"+RAIN+";background-size:120px 240px;animation:gaFall240 .9s linear infinite;opacity:.55}"+
      /* ---- storm */
      ".geiAtmos[data-env=storm]{--gaCloud:rgba(36,44,64,.72)}"+
      ".geiAtmos[data-env=storm] .gaTint{display:block;background:linear-gradient(180deg,rgba(8,12,30,.5),rgba(12,20,44,.34))}"+
      ".geiAtmos[data-env=storm] .gaClouds,.geiAtmos[data-env=storm] .gaFall.f1,.geiAtmos[data-env=storm] .gaFlash{display:block}"+
      ".geiAtmos[data-env=storm] .gaClouds{animation-duration:42s}"+
      ".geiAtmos[data-env=storm] .gaFall.f1{background:"+STORM+";background-size:100px 200px;animation:gaFall200 .55s linear infinite;opacity:.65}"+
      ".geiAtmos[data-env=storm] .gaFlash{animation:gaBolt 9s linear infinite}"+
      /* ---- snow */
      ".geiAtmos[data-env=snow]{--gaCloud:rgba(220,232,246,.4)}"+
      ".geiAtmos[data-env=snow] .gaTint{display:block;background:linear-gradient(180deg,rgba(170,205,240,.22),rgba(190,215,240,.1))}"+
      ".geiAtmos[data-env=snow] .gaClouds,.geiAtmos[data-env=snow] .gaFall,.geiAtmos[data-env=snow] .gaGround{display:block}"+
      ".geiAtmos[data-env=snow] .gaFall.f1{background:"+SNOW_A+";background-size:180px 240px;animation:gaFall240 11s linear infinite}"+
      ".geiAtmos[data-env=snow] .gaFall.f2{background:"+SNOW_B+";background-size:130px 200px;animation:gaFall200 17s linear infinite;opacity:.8}"+
      "@keyframes gaFall240{to{transform:translateY(240px)}}@keyframes gaFall200{to{transform:translateY(200px)}}"+
      "@keyframes gaDrift{to{transform:translateX(12%)}}"+
      "@keyframes gaTwinkle{from{opacity:.55}to{opacity:1}}"+
      "@keyframes gaSun{from{filter:brightness(1)}to{filter:brightness(1.12)}}"+
      "@keyframes gaBolt{0%,86%,100%{opacity:0}87%{opacity:.2}88.5%{opacity:0}90%{opacity:.12}92%{opacity:0}}"+   // two soft, short, partial flashes per 9s — never full-screen
      "@media(prefers-reduced-motion:reduce){.gaFall.f2,.gaFlash{display:none!important}.geiAtmos *{animation:none!important}}";
    document.head.appendChild(s);
  }

  function build(){
    var stage=document.querySelector("#geiDamMapPage .dmwStage"),page=$("geiDamMapPage");
    if(!stage||!page)return false;
    page.setAttribute("data-env",env.id);
    if($("geiMapAtmos"))return true;                         // never a second layer
    css();
    var L=document.createElement("div");L.id="geiMapAtmos";L.className="geiAtmos";L.setAttribute("data-env",env.id);L.setAttribute("aria-hidden","true");
    L.innerHTML='<div class="gaTint"></div><div class="gaStars"></div><div class="gaCelestial"></div><div class="gaClouds"></div>'+
      '<div class="gaFall f1"></div><div class="gaFall f2"></div><div class="gaGround"></div><div class="gaFlash"></div>';
    stage.insertBefore(L,stage.firstChild);                  // fixed to the map window (sky doesn't scroll with the scenery), above the artwork, below pin / Beaver / card / pills
    return true;
  }
  function boot(){
    if(build())return;
    var mo=new MutationObserver(function(){if(build())mo.disconnect();});
    mo.observe(document.body,{childList:true});
  }
  /* developer/test hook: switch the (single) environment; players never see a control for it */
  env.set=function(id){if(IDS.indexOf(id)<0)return false;env.id=id;var L=$("geiMapAtmos"),p=$("geiDamMapPage");if(L)L.setAttribute("data-env",id);if(p)p.setAttribute("data-env",id);return true;};
  env.selfTest=function(){var L=document.querySelectorAll("#geiMapAtmos").length;return {id:env.id,initialized:env.initialized,layers:L,children:L?$("geiMapAtmos").childElementCount:0,textNodes:L?$("geiMapAtmos").textContent.trim().length:0,ariaHidden:L?$("geiMapAtmos").getAttribute("aria-hidden"):null,presentationOnly:true};};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();
