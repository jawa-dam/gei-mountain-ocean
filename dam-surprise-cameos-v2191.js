/* V2.1.91 → V2.1.92 — DAM-ITE SURPRISES: GLOBAL AMBIENT CAMEO ENGINE (damSurpriseCameoEngine)
 *
 * Nine former operators (DAM Pool, DAM Double Burger, DAM Statue, DAM Lollipop, DAM Sundae,
 * DAM Water, DAM Unicorn, DAM Light, Lion) are no longer playable; this ONE engine turns their art
 * into short, decorative, randomized cameos on whichever idle/waiting screen is up. A single
 * director reads the live UI state and picks one mode at a time:
 *
 *   home    board waiting for the first tap (menu/home, before the timer) — screensaver cadence:
 *           wait 3–6 s, one cameo for 1–2 s, random 3–6 s gap, repeat; placed off the HUD, the
 *           floating buttons and the glowing station.
 *   pregame DAM-ITE COMMAND GUIDE (START GAME) — one small friendly cameo at a time, never over
 *           a button, tab or the title.
 *   wheel   Bonus Waterwheel before SPIN — subtle cameos drift around the wheel / card edges,
 *           never over SPIN or the wheel hub; stops the moment the wheel is activated.
 *   level   HYDRAULIC CYCLE COMPLETE — after the card settles, an occasional LARGE cameo with a
 *           random entrance/effect; kept off the headline, rescue card, FL OZ line and buttons.
 *   idle    "THE DAM BROKE! … TRY DAY AGAIN" — while the soundtrack plays: 1.5–3.5 s, one cameo
 *           (0.9–2.2 s), 2.5–6 s gap… breathes on the music's beat. One tap anywhere ends the show
 *           and retries the day.
 *   map     DAM Map — occasional cameos by a fitting region.
 *   ""      gameplay (timer running), input in flight, another dialog/panel/menu, splash, hidden
 *           tab → nothing is shown.
 *
 * Any tap/key on home/pregame/wheel/level removes the cameo at once and restarts the wait.
 * Rules: one reusable aria-hidden layer (one cameo + a small fixed particle pool), pointer-events:none
 * everywhere, never more than one cameo at a time, last-4 no-repeat history, skin colors from CSS
 * variables, reduced motion → short fade/scale only. Presentation only: never writes game state,
 * FL OZ, XP, purchases, entitlements, ownership or storage.
 */
(function(){
  "use strict";
  if(window.__GEI_DAM_SURPRISES__) return;
  var VERSION = "V2.1.92";

  /* ---------- cameo pool (art comes from the canonical CHARACTERS catalog by id) ---------- */
  var CAMEOS = [
    { id:"character-7", label:"DAM Pool",          emoji:"🏊", fx:["splash","wave","float"],          region:2 },
    { id:"character-8", label:"DAM Double Burger", emoji:"🍔", fx:["bounce","wobble","spin"],         region:4 },
    { id:"character-6", label:"DAM Statue",        emoji:"🗿", fx:["rise","glow","pop"],              region:1, heavy:true },
    { id:"character-2", label:"DAM Lollipop",      emoji:"🍭", fx:["spin","sparkle","wobble"],        region:3 },
    { id:"character-1", label:"DAM Sundae",        emoji:"🍨", fx:["bounce","shimmer","sparkle"],     region:0 },
    { id:"character-3", label:"DAM Water",         emoji:"💧", fx:["splash","float","wave"],          region:-1, travel:true },
    { id:"character-4", label:"DAM Unicorn",       emoji:"🦄", fx:["sparkle","drift","glow"],         region:-1, travel:true, rainbow:true },
    { id:"character-5", label:"DAM Light",         emoji:"💡", fx:["pulse","glow","shimmer"],         region:-2, illuminate:true },
    { id:"lion",        label:"Lion",              emoji:"🦁", fx:["pop","pulse","bounce"],           region:5, roar:true }
  ];
  var EFFECTS = ["splash","glow","sparkle","bounce","float","spin","wobble","pop","wave","drift","shimmer","pulse","rise","drop"];
  var ENTRIES = ["pop","rise","drop","slideL","slideR","spin","fade"];
  var EXITS   = ["fade","shrink","sink","floatAway","slideL","slideR","spin"];
  var TIERS   = [ { id:"normal", w:65 }, { id:"special", w:25 }, { id:"rare", w:8 }, { id:"ultra", w:2 } ];
  var TIMING  = { idleFirst:[1500,3500], idleBetween:[2500,6000], show:[900,2200],
                  mapFirst:[3000,7000], mapBetween:[7000,14000], mapChance:.7, recheck:1500, poll:600 };
  /* V2.1.92 — per-screen rhythm for the global director (ms). */
  var MODES = {
    home:    { first:[3000,6000], between:[3000,6000], show:[1000,2000], chance:1,  size:[70,150],  k:.2  },
    pregame: { first:[2000,4000], between:[4000,8000], show:[1200,2000], chance:1,  size:[56,110],  k:.16, subtle:true },
    wheel:   { first:[1500,3000], between:[3000,6000], show:[1000,1800], chance:1,  size:[56,112],  k:.17, subtle:true },
    level:   { first:[3500,6000], between:[7000,12000], show:[1600,2400], chance:.65, size:[96,230], k:.32, big:true }
  };
  var BIG_FX = ["glow","splash","shimmer","float","bounce","sparkle","pop","rise","wave","pulse"];
  /* Map station anchors (SVG units of the V2.1.90 DAM Map scene, viewBox 1240×520). */
  var MAP_W = 1240, MAP_H = 520;
  var ANCHOR = [{x:186,top:150},{x:417,top:368},{x:590,top:446},{x:737,top:392},{x:905,top:380},{x:1056,top:346}];

  var S = { mode:"", timer:0, cameoTimer:0, anims:[], visible:false, current:null, recent:[], badArt:{},
            idleShowActive:false, installed:false, stats:{ shown:0, maxVisible:0, byTier:{normal:0,special:0,rare:0,ultra:0}, byCameo:{}, byMode:{}, stoppedByTap:0, stoppedByInput:0 },
            tapEnded:false, lastInput:0, poll:0 };
  var L = { layer:null, cameo:null, move:null, beat:null, fig:null, img:null, emoji:null, parts:[] };

  function $(id){ return document.getElementById(id); }
  function rnd(a,b){ return a + Math.random()*(b-a); }
  function rint(r){ return Math.round(rnd(r[0], r[1])); }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  function reduced(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } }
  function catalogArt(id){
    try{ if(typeof CHARACTERS !== "undefined"){ var c = CHARACTERS.find(function(x){ return x.id === id; }); if(c) return c.img; } }catch(e){}
    return "";
  }

  /* ---------- styles: skin-aware glow via the game's CSS variables ---------- */
  function css(){
    if($("damSurpriseStyle")) return;
    var s = document.createElement("style"); s.id = "damSurpriseStyle";
    s.textContent =
      "#damSurpriseLayer{position:absolute;inset:0;overflow:hidden;pointer-events:none!important;z-index:2;contain:layout paint}"+
      "#damSurpriseLayer *{pointer-events:none!important}"+
      "#damSurpriseLayer.map{z-index:2}"+
      /* V2.1.92: over a dialog card the layer sits on the full-width stage, above the card (still click-through) */
      "#damSurpriseLayer.over{z-index:300}"+

      ".dscCameo{position:absolute;left:0;top:0;width:var(--dscSize,120px);height:var(--dscSize,120px);display:none;transform:translate(-50%,-50%) rotate(var(--dscRot,0deg)) scale(var(--dscScale,1));will-change:transform,opacity}"+
      ".dscCameo.on{display:block}"+
      ".dscMove,.dscBeat,.dscFig{position:absolute;inset:0}"+
      ".dscFig{display:grid;place-items:center;filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) drop-shadow(0 0 12px color-mix(in srgb,var(--water-bright,#2fd2ff) 45%,transparent))}"+
      ".dscFig img{max-width:100%;max-height:100%;object-fit:contain;display:block}"+
      ".dscFig .dscEmoji{font-size:calc(var(--dscSize,120px)*.62);line-height:1;display:none}"+
      ".dscFig.noArt img{display:none}.dscFig.noArt .dscEmoji{display:block}"+
      /* tier auras — no text, only light */
      ".dscCameo::before{content:'';position:absolute;inset:-18%;border-radius:50%;opacity:0;pointer-events:none;"+
        "background:radial-gradient(circle,color-mix(in srgb,var(--water-bright,#2fd2ff) 40%,transparent),transparent 68%)}"+
      ".dscCameo.t-special::before{opacity:.55}.dscCameo.t-rare::before{opacity:.8;background:radial-gradient(circle,color-mix(in srgb,var(--juicy-magenta,#ff2ec4) 34%,transparent),color-mix(in srgb,var(--water-bright,#2fd2ff) 22%,transparent) 45%,transparent 70%)}"+
      ".dscCameo.t-ultra::before{opacity:.9;background:conic-gradient(from 0deg,#ff6b9d55,#ffd36b55,#6bffb055,#6bd0ff55,#b06bff55,#ff6b9d55);filter:blur(10px);animation:dscHue 3s linear infinite}"+
      ".dscCameo.rainbow .dscFig{filter:drop-shadow(0 8px 14px rgba(0,0,0,.4)) drop-shadow(0 0 14px #ff9df2aa) drop-shadow(0 0 22px #6bd0ff88)}"+
      ".dscCameo.illuminate::after{content:'';position:absolute;inset:-70%;border-radius:50%;pointer-events:none;"+
        "background:radial-gradient(circle,rgba(255,244,190,.34),rgba(255,244,190,.10) 40%,transparent 70%);animation:dscIllum var(--dscBeat,1.6s) ease-in-out infinite}"+
      /* music sync: one gentle breath per two beats */
      ".dscCameo.sync .dscBeat{animation:dscBreath var(--dscBeat,1.6s) ease-in-out infinite}"+
      /* effect library (runs on the figure while the cameo is up) */
      ".fx-splash .dscFig{animation:dscSplash 1.1s ease-out infinite}"+
      ".fx-glow .dscFig{animation:dscGlow 1.4s ease-in-out infinite}"+
      ".fx-sparkle .dscFig{animation:dscSparkle 1.2s ease-in-out infinite}"+
      ".fx-bounce .dscFig{animation:dscBounce .8s cubic-bezier(.3,.7,.4,1) infinite}"+
      ".fx-float .dscFig{animation:dscFloat 2.2s ease-in-out infinite}"+
      ".fx-spin .dscFig{animation:dscSpin 2.4s linear infinite}"+
      ".fx-wobble .dscFig{animation:dscWobble .9s ease-in-out infinite}"+
      ".fx-pop .dscFig{animation:dscPop 1s cubic-bezier(.3,1.6,.5,1) infinite}"+
      ".fx-wave .dscFig{animation:dscWave 1.6s ease-in-out infinite}"+
      ".fx-drift .dscFig{animation:dscDrift 2.6s ease-in-out infinite}"+
      ".fx-shimmer .dscFig{animation:dscShimmer 1.3s ease-in-out infinite}"+
      ".fx-pulse .dscFig{animation:dscPulse var(--dscBeat,1.2s) ease-in-out infinite}"+
      ".fx-rise .dscFig{animation:dscRise 1.6s ease-out infinite}"+
      ".fx-drop .dscFig{animation:dscDrop 1.2s cubic-bezier(.5,0,.6,1.4) infinite}"+
      ".dscPart{position:absolute;left:0;top:0;width:8px;height:8px;border-radius:50%;display:none;"+
        "background:radial-gradient(circle,#fff,color-mix(in srgb,var(--water-bright,#2fd2ff) 80%,transparent) 60%,transparent);box-shadow:0 0 8px var(--water-bright,#2fd2ff)}"+
      ".dscPart.on{display:block}"+
      "@keyframes dscBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}"+
      "@keyframes dscHue{to{transform:rotate(360deg)}}"+
      "@keyframes dscIllum{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}"+
      "@keyframes dscSplash{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-6%) scale(1.04,.96)}60%{transform:translateY(0) scale(.97,1.03)}100%{transform:translateY(0) scale(1)}}"+
      "@keyframes dscGlow{0%,100%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) drop-shadow(0 0 8px var(--water-bright,#2fd2ff))}50%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) drop-shadow(0 0 22px var(--water-bright,#2fd2ff))}}"+
      "@keyframes dscSparkle{0%,100%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) brightness(1)}50%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) drop-shadow(0 0 14px #fff6) brightness(1.15)}}"+
      "@keyframes dscBounce{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-12%) scale(.98,1.03)}80%{transform:translateY(0) scale(1.03,.97)}}"+
      "@keyframes dscFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7%)}}"+
      "@keyframes dscSpin{to{transform:rotate(360deg)}}"+
      "@keyframes dscWobble{0%,100%{transform:rotate(0)}25%{transform:rotate(-7deg)}75%{transform:rotate(7deg)}}"+
      "@keyframes dscPop{0%,100%{transform:scale(1)}20%{transform:scale(1.12)}40%{transform:scale(.97)}}"+
      "@keyframes dscWave{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(-4%,-3%) rotate(-4deg)}75%{transform:translate(4%,-3%) rotate(4deg)}}"+
      "@keyframes dscDrift{0%,100%{transform:translate(-5%,0)}50%{transform:translate(5%,-4%)}}"+
      "@keyframes dscShimmer{0%,100%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) saturate(1)}50%{filter:drop-shadow(0 8px 14px rgba(0,0,0,.45)) saturate(1.35) brightness(1.12)}}"+
      "@keyframes dscPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}"+
      "@keyframes dscRise{0%{transform:translateY(6%)}60%,100%{transform:translateY(-4%)}}"+
      "@keyframes dscDrop{0%{transform:translateY(-8%)}60%{transform:translateY(2%)}100%{transform:translateY(0)}}"+
      /* reduced motion: short fade/scale only — no loops, no travel, no particles, no flashes */
      "@media (prefers-reduced-motion:reduce){#damSurpriseLayer .dscFig,#damSurpriseLayer .dscBeat,.dscCameo::before,.dscCameo::after{animation:none!important}.dscPart{display:none!important}}";
    document.head.appendChild(s);
  }

  /* ---------- the ONE reusable layer ---------- */
  function build(){
    if(L.layer) return L.layer;
    css();
    var layer = document.createElement("div");
    layer.id = "damSurpriseLayer";
    layer.setAttribute("aria-hidden","true");
    layer.innerHTML = '<div class="dscCameo"><div class="dscMove"><div class="dscBeat"><div class="dscFig"><img alt="" decoding="async" draggable="false"><span class="dscEmoji"></span></div></div></div></div>'+
      '<i class="dscPart"></i><i class="dscPart"></i><i class="dscPart"></i><i class="dscPart"></i><i class="dscPart"></i><i class="dscPart"></i>';
    L.layer = layer;
    L.cameo = layer.querySelector(".dscCameo"); L.move = layer.querySelector(".dscMove");
    L.beat = layer.querySelector(".dscBeat"); L.fig = layer.querySelector(".dscFig");
    L.img = layer.querySelector("img"); L.emoji = layer.querySelector(".dscEmoji");
    L.parts = [].slice.call(layer.querySelectorAll(".dscPart"));
    return layer;
  }
  function mount(host, cls){
    build();
    if(L.layer.parentNode !== host){ host.insertBefore(L.layer, host.firstChild); }
    L.layer.className = cls || "";
  }

  /* ---------- event director ---------- */
  function pickTier(){
    var r = Math.random()*100, acc = 0;
    for(var i = 0; i < TIERS.length; i++){ acc += TIERS[i].w; if(r < acc) return TIERS[i].id; }
    return "normal";
  }
  function pickCameo(){
    var avoid = S.recent.slice(-4);                                          // last several never repeat
    var pool = CAMEOS.filter(function(c){ return avoid.indexOf(c.id) < 0; });
    if(!pool.length) pool = CAMEOS.filter(function(c){ return c.id !== S.recent[S.recent.length-1]; });
    return pick(pool);
  }
  function remember(id){ S.recent.push(id); if(S.recent.length > 6) S.recent.shift(); }

  function musicBeatSeconds(){
    try{
      var m = window.DAMSoundtrack; if(!m || !m.playing) return 0;
      var th = (m.themes || []).find(function(t){ return t.id === m.currentTheme; });
      var bpm = th && th.bpm ? th.bpm : 90;
      return Math.max(.9, Math.min(2.6, 120/bpm));    // one breath per two beats
    }catch(e){ return 0; }
  }
  function musicPlaying(){ try{ return !!(window.DAMSoundtrack && window.DAMSoundtrack.playing); }catch(e){ return false; } }

  function stopAnims(){ S.anims.forEach(function(a){ try{ a.cancel(); }catch(e){} }); S.anims = []; }
  function animate(el, frames, opts){
    if(!el.animate) return null;
    try{ var a = el.animate(frames, opts); S.anims.push(a); return a; }catch(e){ return null; }
  }
  function hideCameo(){
    clearTimeout(S.cameoTimer); S.cameoTimer = 0;
    stopAnims();
    if(L.cameo){ L.cameo.className = "dscCameo"; }
    L.parts.forEach(function(p){ p.classList.remove("on"); });
    S.visible = false; S.current = null;
  }

  var ENTRY_FRAMES = {
    pop:   [{opacity:0,transform:"scale(.2)"},{opacity:1,transform:"scale(1.12)",offset:.7},{opacity:1,transform:"scale(1)"}],
    rise:  [{opacity:0,transform:"translateY(45%) scale(.9)"},{opacity:1,transform:"translateY(0) scale(1)"}],
    drop:  [{opacity:0,transform:"translateY(-60%)"},{opacity:1,transform:"translateY(6%)",offset:.75},{opacity:1,transform:"translateY(0)"}],
    slideL:[{opacity:0,transform:"translateX(-70%) rotate(-8deg)"},{opacity:1,transform:"translateX(0) rotate(0)"}],
    slideR:[{opacity:0,transform:"translateX(70%) rotate(8deg)"},{opacity:1,transform:"translateX(0) rotate(0)"}],
    spin:  [{opacity:0,transform:"rotate(-200deg) scale(.3)"},{opacity:1,transform:"rotate(0) scale(1)"}],
    fade:  [{opacity:0,transform:"scale(.94)"},{opacity:1,transform:"scale(1)"}]
  };
  var EXIT_FRAMES = {
    fade:     [{opacity:1},{opacity:0}],
    shrink:   [{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(.2)"}],
    sink:     [{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(45%)"}],
    floatAway:[{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-55%) scale(.9)"}],
    slideL:   [{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(-70%) rotate(-8deg)"}],
    slideR:   [{opacity:1,transform:"translateX(0)"},{opacity:0,transform:"translateX(70%) rotate(8deg)"}],
    spin:     [{opacity:1,transform:"rotate(0) scale(1)"},{opacity:0,transform:"rotate(200deg) scale(.3)"}]
  };
  var RM_IN = [{opacity:0,transform:"scale(.96)"},{opacity:1,transform:"scale(1)"}];
  var RM_OUT = [{opacity:1},{opacity:0}];

  /* Rare/ultra only: a tiny burst from the fixed six-particle pool (never new DOM). */
  function particles(n, size){
    L.parts.forEach(function(p, i){
      p.classList.remove("on");
      if(i >= n) return;
      p.style.left = L.cameo.style.left; p.style.top = L.cameo.style.top;
      p.classList.add("on");
      var ang = (i / n) * Math.PI * 2 + rnd(-.3,.3), d = size * rnd(.45,.75);
      var dx = Math.cos(ang) * d, dy = Math.sin(ang) * d;
      animate(p, [
        { transform:"translate(-50%,-50%) scale(.4)", opacity:0 },
        { transform:"translate(calc(-50% + "+dx.toFixed(0)+"px),calc(-50% + "+dy.toFixed(0)+"px)) scale(1)", opacity:1, offset:.5 },
        { transform:"translate(calc(-50% + "+(dx*1.3).toFixed(0)+"px),calc(-50% + "+(dy*1.3-10).toFixed(0)+"px)) scale(.2)", opacity:0 }
      ], { duration:rnd(700,1000), delay:rnd(80,300), easing:"ease-out", fill:"both" });
    });
  }

  /* Show one cameo. place = {left, top (css strings), size (px), travelTo (css left string|undefined)} */
  function showCameo(place, forced){
    build();
    hideCameo();
    var c = forced && forced.cameo ? CAMEOS.find(function(x){ return x.id === forced.cameo; }) || pickCameo() : pickCameo();
    forced = forced || {};
    var tier = forced.tier || (forced.subtle ? (Math.random() < .8 ? "normal" : "special") : pickTier());
    var rm = reduced();
    var total = rint(forced.show || TIMING.show);
    if(tier === "rare" || tier === "ultra") total = Math.max(total, 1600);
    var effect = forced.big ? pick(BIG_FX) : pick(c.fx), entry = rm ? "fade" : pick(ENTRIES), exit = rm ? "fade" : pick(EXITS);
    if(c.heavy && !rm) entry = pick(["rise","pop"]);
    var scale = { normal:rnd(.88,1.04), special:rnd(.98,1.12), rare:rnd(1.05,1.18), ultra:rnd(1.12,1.25) }[tier];
    var rot = rm ? 0 : forced.subtle ? rnd(-6,6) : forced.big ? rnd(-14,14) : rnd(-10,10);

    var art = catalogArt(c.id);
    L.fig.classList.toggle("noArt", !art || !!S.badArt[c.id]);
    L.emoji.textContent = c.emoji;
    L.img.onerror = function(){ S.badArt[c.id] = true; L.fig.classList.add("noArt"); };
    if(art && !S.badArt[c.id] && L.img.getAttribute("src") !== art) L.img.src = art;

    var cam = L.cameo;
    cam.style.left = place.left; cam.style.top = place.top;
    cam.style.setProperty("--dscSize", Math.round(place.size) + "px");
    cam.style.setProperty("--dscScale", scale.toFixed(3));
    cam.style.setProperty("--dscRot", rot.toFixed(1) + "deg");
    var beat = musicBeatSeconds();
    if(beat) cam.style.setProperty("--dscBeat", beat.toFixed(2) + "s");
    cam.className = "dscCameo on t-" + tier + (rm ? "" : " fx-" + effect) + (beat && !rm ? " sync" : "") +
      (c.rainbow && tier !== "normal" ? " rainbow" : "") + (c.illuminate && !rm ? " illuminate" : "");
    cam.setAttribute("data-cameo", c.id); cam.setAttribute("data-tier", tier); cam.setAttribute("data-effect", effect);

    var inMs = rm ? 180 : Math.min(520, total * .3), outMs = rm ? 180 : Math.min(460, total * .28);
    animate(L.move, rm ? RM_IN : ENTRY_FRAMES[entry], { duration:inMs, easing:"cubic-bezier(.2,.8,.25,1.1)", fill:"backwards" });
    if(place.travelTo && !rm) animate(cam, [{left:place.left},{left:place.travelTo}], { duration:total, easing:"ease-in-out", fill:"forwards" });
    if(!rm && (tier === "rare" || tier === "ultra" || (forced.big && Math.random() < .6))) particles(tier === "ultra" || forced.big ? 6 : 4, place.size * scale);

    S.visible = true; S.current = { id:c.id, label:c.label, tier:tier, effect:effect, entry:entry, exit:exit, ms:total };
    S.stats.shown++; S.stats.byTier[tier]++; S.stats.byCameo[c.id] = (S.stats.byCameo[c.id] || 0) + 1;
    S.stats.maxVisible = Math.max(S.stats.maxVisible, L.layer ? L.layer.querySelectorAll(".dscCameo.on").length : 0);
    remember(c.id);

    S.cameoTimer = setTimeout(function(){
      var a = animate(L.move, rm ? RM_OUT : EXIT_FRAMES[exit], { duration:outMs, easing:"ease-in", fill:"forwards" });
      S.cameoTimer = setTimeout(hideCameo, a ? outMs + 30 : 0);
    }, Math.max(200, total - outMs));
    return S.current;
  }

  /* ---------- shared gating ---------- */
  function otherModalOpen(except){
    try{
      if(typeof anyPanelOpen === "function" && anyPanelOpen()) return true;
    }catch(e){}
    var ids = ["preGameCard","geiWelcome","characterSpotlight","damMachineCard","bonusCard","levelCard","geiDamMapPage","timeUpCard","geiSplash"];
    for(var i = 0; i < ids.length; i++){
      if(ids[i] === except) continue;
      var el = $(ids[i]); if(!el) continue;
      if(ids[i] === "geiSplash"){ if(!el.classList.contains("isDone") && el.style.display !== "none") return true; continue; }
      if(el.classList.contains("show") || el.classList.contains("open")) return true;
    }
    var ms = $("geiMapMilestone"); if(ms && ms.classList.contains("show")) return true;
    return false;
  }
  function clearSchedule(){ clearTimeout(S.timer); S.timer = 0; }
  function schedule(ms, fn){ clearSchedule(); S.timer = setTimeout(fn, ms); }

  /* ---------- V2.1.92 director: which idle screen is up right now? ---------- */
  function shown(id){ var el = $(id); return !!(el && (el.classList.contains("show") || el.classList.contains("open"))); }
  function splashUp(){ var el = $("geiSplash"); return !!(el && !el.classList.contains("isDone") && el.style.display !== "none"); }
  function gameVar(fn, dflt){ try{ return fn(); }catch(e){ return dflt; } }
  /* Anything that is NOT an idle screen we decorate: panels, the nav menu, DAM MACHINE, spotlight,
     welcome, -ite reveal, saved -ite collection, map milestone card. */
  function blockerUp(){
    if(gameVar(function(){ return typeof anyPanelOpen === "function" && anyPanelOpen(); }, false)) return true;
    if(gameVar(function(){ return navOpen === true; }, false)) return true;
    if(window.geiWelcomeOpen === true) return true;
    var ids = ["characterSpotlight","damMachineCard","geiWelcome","tribeCard","geiIteCollection","geiMapMilestone"];
    for(var i = 0; i < ids.length; i++) if(shown(ids[i])) return true;
    return false;
  }
  function screen(){
    if(document.hidden || splashUp()) return "";
    if(mapOpen()) return "map";
    if(blockerUp()) return "";
    if(timeUpShowing()) return S.tapEnded ? "" : "idle";
    if(gameVar(function(){ return state.busy === true; }, false)) return "";          // input in flight
    if(shown("bonusCard")){
      var b = gameVar(function(){ return bonus; }, null);
      return b && b.awaiting === "spin" && !b.spinning ? "wheel" : "";                   // stop once the wheel is activated
    }
    if(shown("levelCard")) return "level";
    if(shown("preGameCard")) return "pregame";
    var ph = gameVar(function(){ return state.phase; }, "");
    if(ph === "ready" || ph === "redeemed") return "home";                               // waiting for the first tap
    return "";                                                                           // gameplay: stay out of the way
  }
  function evaluate(){
    var want = S.disabled ? "" : screen();
    if(want === S.mode) return;
    if(S.mode === "idle") stopIdle(); else if(S.mode === "map") stopMap(); else stopAmbient();
    if(want === "idle") startIdle();
    else if(want === "map") startMap();
    else if(MODES[want]){ S.mode = want; schedule(rint(MODES[want].first), ambientTick); }
  }
  function stopAmbient(){ if(!MODES[S.mode]) return; clearSchedule(); hideCameo(); S.mode = ""; }

  /* ---------- generic placement: free margin around `inner` first, then its edges / a region,
     never over a guarded rect, never outside the viewport. Returns null when nothing fits. ---------- */
  function rectOf(el){ if(!el) return null; var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 ? r : null; }
  function guardRects(root, sels, pad){
    var out = [];
    if(!root) return out;
    [].forEach.call(root.querySelectorAll(sels), function(el){
      if(L.layer && L.layer.contains(el)) return;
      var r = rectOf(el); if(!r) return;
      try{ var cs = getComputedStyle(el); if(cs.visibility === "hidden" || +cs.opacity === 0) return; }catch(e){}
      out.push({ left:r.left - pad, right:r.right + pad, top:r.top - pad, bottom:r.bottom + pad });
    });
    return out;
  }
  function placeAround(o){
    var hr = rectOf(o.host); if(!hr) return null;
    var vw = window.innerWidth || hr.right, vh = window.innerHeight || hr.bottom;
    var box = { left:Math.max(hr.left, 0), right:Math.min(hr.right, vw), top:Math.max(hr.top, 0), bottom:Math.min(hr.bottom, vh) };
    var ir = rectOf(o.inner) || { left:box.left, right:box.left, top:box.top, bottom:box.top };
    var rg = o.region ? rectOf(o.region) : null;
    if(rg) rg = { left:Math.max(rg.left, box.left), right:Math.min(rg.right, box.right), top:Math.max(rg.top, box.top), bottom:Math.min(rg.bottom, box.bottom) };
    var full = Math.max(o.size[0], Math.min(o.size[1], Math.min(box.right - box.left, box.bottom - box.top) * o.k));
    /* full size first; a crowded screen gets a slightly smaller cameo rather than one over a control */
    var steps = [1, .85, .72];
    for(var si = 0; si < steps.length; si++){
      var size = Math.max(o.size[0] * .8, full * steps[si]), half = size / 2, pad = 6;
      var zones = [
        { x0:box.left, x1:box.right, y0:box.top, y1:ir.top },               // free margin around the card
        { x0:box.left, x1:box.right, y0:ir.bottom, y1:box.bottom },
        { x0:box.left, x1:ir.left, y0:box.top, y1:box.bottom },
        { x0:ir.right, x1:box.right, y0:box.top, y1:box.bottom }
      ].filter(function(z){ return (z.x1 - z.x0) >= size + pad*2 && (z.y1 - z.y0) >= size + pad*2; });
      var useRg = rg && (rg.right - rg.left) >= size * .9 && (rg.bottom - rg.top) >= size * .9;
      for(var k = 0; k < 30; k++){
        var x, y;
        if(zones.length && k < 15){ var z = pick(zones); x = rnd(z.x0 + half + pad, z.x1 - half - pad); y = rnd(z.y0 + half + pad, z.y1 - half - pad); }
        else if(useRg && (k % 2 || !zones.length)){ x = rnd(rg.left + half*.9, rg.right - half*.9); y = rnd(rg.top + half*.9, rg.bottom - half*.9); }
        else {                                                                // splash in from the card's edge
          var side = pick(["left","right","left","right","top","bottom"]);
          if(side === "top" || side === "bottom"){ x = rnd(ir.left + half, ir.right - half); y = side === "top" ? ir.top + rnd(-.1, .3) * size : ir.bottom - rnd(-.1, .3) * size; }
          else { x = side === "left" ? ir.left + rnd(.05, .4) * size : ir.right - rnd(.05, .4) * size; y = rnd(ir.top + half, ir.bottom - half); }
        }
        x = Math.max(box.left + half*.7, Math.min(box.right - half*.7, x)); y = Math.max(box.top + half*.7, Math.min(box.bottom - half*.7, y));
        var b = { left:x - half*.78, right:x + half*.78, top:y - half*.78, bottom:y + half*.78 };
        if(!hits(b, o.guards)) return { left:(x - hr.left).toFixed(0) + "px", top:(y - hr.top).toFixed(0) + "px", size:size };
      }
    }
    return null;
  }
  function shrink(r, f){ if(!r) return null; var dx = r.width * f, dy = r.height * f; return { left:r.left + dx, right:r.right - dx, top:r.top + dy, bottom:r.bottom - dy }; }
  var HOSTS = {
    home:function(){
      var stage = document.querySelector(".stage"), world = $("world");
      if(!stage) return null;
      var g = guardRects(stage, "button,a[href],input,select,[role=button],.hud,.timerBox,#iteHud,.damIteCombo,.navSheet,.station.active,.dmStoreFloatBtn,.songVaultFloatBtn,.dmFloatBtn", 12);
      return { host:stage, inner:$("appRoot"), region:world, guards:g };
    },
    pregame:function(){
      var card = $("preGameCard"), inner = card && card.querySelector(".preGameInner"); if(!card) return null;
      return { host:stageOr(card), over:true, inner:inner, region:inner, guards:guardRects(card, "button,[role=tab],.preGameTitle,.preGameSub,input,a[href]", 12) };
    },
    wheel:function(){
      var card = $("bonusCard"); if(!card) return null;
      var g = guardRects(card, "button,.bwTitle,.bwEyebrow,.bwFree,.bwPrompt", 10);
      g = g.concat(guardRects(card, "#bonusBtn", 22));                              // SPIN gets extra room
      var hub = shrink(rectOf(card.querySelector(".bwWheelBox")), .24); if(hub) g.push(hub);   // pointer + hub stay clear
      return { host:stageOr(card), over:true, inner:card.querySelector(".bonusInner"), region:card.querySelector(".bwWheelBox"), guards:g };
    },
    level:function(){
      var card = $("levelCard"); if(!card) return null;
      return { host:stageOr(card), over:true, inner:$("levelInner"), region:$("levelInner"),
               guards:guardRects(card, "button,.lcEyebrow,.lcLevel,.lcRescue,.lcOz,.lcCongrats,.milestoneTitle,.lcCharName,a[href]", 10) };
    }
  };
  /* The full-width stage: on desktop its side margins are free space beside the card. */
  function stageOr(el){ return document.querySelector(".stage") || el; }
  function ambientTick(){
    S.timer = 0;
    var m = S.mode, cfg = MODES[m];
    if(!cfg) return;
    if(screen() !== m){ evaluate(); return; }
    if(Math.random() < cfg.chance){
      var h = HOSTS[m]();
      if(h){
        var place = placeAround({ host:h.host, inner:h.inner, region:h.region, guards:h.guards, size:cfg.size, k:cfg.k });
        if(place){
          mount(h.host, "amb " + m + (h.over ? " over" : ""));
          var c = showCameo(place, { show:cfg.show, subtle:cfg.subtle, big:cfg.big });
          S.stats.byMode[m] = (S.stats.byMode[m] || 0) + 1;
          schedule(c.ms + rint(cfg.between), ambientTick); return;
        }
      }
    }
    schedule(rint(cfg.between), ambientTick);
  }
  /* The player is doing something: the cameo leaves at once and the wait starts over. */
  function onInput(e){
    S.lastInput = Date.now();
    if(!MODES[S.mode]) return;
    if(S.visible) S.stats.stoppedByInput++;
    hideCameo();
    schedule(rint(MODES[S.mode].first), ambientTick);
    setTimeout(evaluate, 0);                                                     // e.g. SPIN / START / CONTINUE
  }

  /* ---------- IDLE: The Dam Broke / Try Day Again ---------- */
  function timeUp(){ return $("timeUpCard"); }
  function timeUpShowing(){ var t = timeUp(); return !!(t && t.classList.contains("show")); }
  /* The card's controls + headline are protected: a cameo never overlaps them (it is drawn above the card). */
  function protectedRects(host){
    var out = [];
    ["#retryDayBtn","#timeUpTitle"].forEach(function(sel){
      var el = host.querySelector(sel); if(!el) return;
      var r = el.getBoundingClientRect(), pad = sel === "#retryDayBtn" ? 14 : 6;
      if(r.width) out.push({ left:r.left - pad, right:r.right + pad, top:r.top - pad, bottom:r.bottom + pad });
    });
    return out;
  }
  function hits(box, rects){ return rects.some(function(r){ return box.left < r.right && box.right > r.left && box.top < r.bottom && box.bottom > r.top; }); }
  function idlePlace(){
    var host = timeUp(), inner = host && host.querySelector(".gameOverInner");
    var hr = host.getBoundingClientRect(), ir = inner ? inner.getBoundingClientRect() : { left:hr.left, right:hr.left, top:hr.top, bottom:hr.top };
    var size = Math.max(64, Math.min(150, Math.min(hr.width, hr.height) * .24));
    var pad = 6, half = size / 2, guard = protectedRects(host);
    var zones = [
      { x0:hr.left, x1:hr.right, y0:hr.top, y1:ir.top },          // above the card
      { x0:hr.left, x1:hr.right, y0:ir.bottom, y1:hr.bottom },    // below
      { x0:hr.left, x1:ir.left, y0:hr.top, y1:hr.bottom },        // left
      { x0:ir.right, x1:hr.right, y0:hr.top, y1:hr.bottom }       // right
    ].filter(function(z){ return (z.x1 - z.x0) >= size + pad*2 && (z.y1 - z.y0) >= size + pad*2; });
    /* Free margin first; small phones have none, so the cameo sits on the card's edge instead —
       half on, half off, in the open space beside the art — never over the button or headline. */
    var cands = [];
    for(var k = 0; k < 16; k++){
      var x, y;
      if(zones.length){ var z = pick(zones); x = rnd(z.x0 + half + pad, z.x1 - half - pad); y = rnd(z.y0 + half + pad, z.y1 - half - pad); }
      else {
        var side = pick(["left","right","left","right","top"]);
        if(side === "top"){ x = rnd(ir.left + half, ir.right - half); y = ir.top + rnd(-.1, .35) * size; }
        else { x = side === "left" ? ir.left + rnd(.05, .4) * size : ir.right - rnd(.05, .4) * size; y = rnd(ir.top + half, ir.bottom - half); }
      }
      x = Math.max(hr.left + half, Math.min(hr.right - half, x)); y = Math.max(hr.top + half, Math.min(hr.bottom - half, y));
      var box = { left:x - half*.8, right:x + half*.8, top:y - half*.8, bottom:y + half*.8 };
      if(!hits(box, guard)){ cands.push({ x:x, y:y }); break; }
    }
    var c = cands[0] || { x:Math.max(hr.left + half, ir.left + half*.4), y:Math.max(hr.top + half, ir.top + half) };
    return { left:(c.x - hr.left).toFixed(0) + "px", top:(c.y - hr.top).toFixed(0) + "px", size:size };
  }
  function idleTick(){
    S.timer = 0;
    if(S.mode !== "idle" || !timeUpShowing()) return stopIdle();
    if(document.hidden) return;                                             // resumes on visibilitychange
    if(otherModalOpen("timeUpCard") || !musicPlaying()){ schedule(TIMING.recheck, idleTick); return; }
    mount(timeUp(), "idle");
    S.idleShowActive = true;
    S.stats.byMode.idle = (S.stats.byMode.idle || 0) + 1;
    var shown = showCameo(idlePlace());
    schedule(shown.ms + rint(TIMING.idleBetween), idleTick);
  }
  function startIdle(){
    if(S.mode === "map") return;
    S.mode = "idle"; S.idleShowActive = false;
    schedule(rint(TIMING.idleFirst), idleTick);
  }
  function stopIdle(){
    if(S.mode !== "idle") return;
    clearSchedule(); hideCameo(); S.mode = ""; S.idleShowActive = false;
  }
  function bindIdle(){
    var t = timeUp(); if(!t || t.dataset.dscBound) return; t.dataset.dscBound = "1";
    /* End the show on the first touch — immediately, before anything else sees the tap. */
    t.addEventListener("pointerdown", function(e){
      if(S.mode !== "idle") return;
      if(S.idleShowActive){ S.stats.stoppedByTap++; t.dataset.dscEnded = "1"; S.tapEnded = true; stopIdle(); return; }
      schedule(rint(TIMING.idleFirst), idleTick);                           // still settling: the player is active, wait again
    }, true);
    /* …and that same tap starts the day again (no second tap). The button keeps its own handler. */
    t.addEventListener("click", function(e){
      if(t.dataset.dscEnded !== "1") return;
      t.dataset.dscEnded = "";
      if(e.target && e.target.closest && e.target.closest("#retryDayBtn")) return;
      try{ if(typeof retryDay === "function") retryDay(); }catch(err){}
    });
    new MutationObserver(function(){
      if(!timeUpShowing()){ t.dataset.dscEnded = ""; S.tapEnded = false; }
      evaluate();
    }).observe(t, { attributes:true, attributeFilter:["class"] });
  }

  /* ---------- MAP: DAM Map cameos ---------- */
  function mapPage(){ return $("geiDamMapPage"); }
  function mapOpen(){ var p = mapPage(); return !!(p && p.classList.contains("show")); }
  /* Visible slice of the scene in % (phones scroll the full-width scene sideways). */
  function mapView(){
    var wrap = $("dmwScroll"), scene = $("dmwScene");
    if(!wrap || !scene || !scene.clientWidth) return { v0:0, v1:100, t0:0, t1:100 };
    var w = scene.clientWidth, h = scene.clientHeight || 1;
    /* scene offset inside the scroller (it may be centred when narrower) */
    var sr = scene.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    var x0 = wr.left - sr.left, y0 = wr.top - sr.top;
    return { v0:Math.max(0, x0 / w * 100), v1:Math.min(100, (x0 + wrap.clientWidth) / w * 100),
             t0:Math.max(0, y0 / h * 100), t1:Math.min(100, (y0 + wrap.clientHeight) / h * 100) };
  }
  function regionInView(ri, view){ var x = ANCHOR[ri].x / MAP_W * 100; return x >= view.v0 + 4 && x <= view.v1 - 4; }
  function mapCameo(){
    var view = mapView();
    var fits = function(c){ return c.region < 0 || regionInView(c.region, view); };
    var avoid = S.recent.slice(-3);
    var pool = CAMEOS.filter(function(c){ return fits(c) && avoid.indexOf(c.id) < 0; });
    if(!pool.length) pool = CAMEOS.filter(function(c){ return fits(c) && c.id !== S.recent[S.recent.length-1]; });
    return pool.length ? pick(pool) : pickCameo();
  }
  function mapPlace(c){
    var scene = $("dmwScene"); if(!scene) return null;
    var view = mapView(), h = scene.clientHeight || 300, size = Math.max(56, Math.min(130, h * .2));
    var inView = [0,1,2,3,4,5].filter(function(i){ return regionInView(i, view); });
    var ri = c.region >= 0 && regionInView(c.region, view) ? c.region : (inView.length ? pick(inView) : Math.floor(Math.random()*6));
    var a = ANCHOR[ri];
    var halfPct = size / 2 / (scene.clientWidth || 1240) * 100;
    var lo = view.v0 + halfPct + 1, hi = view.v1 - halfPct - 1;
    var xPct = Math.max(lo, Math.min(hi, a.x / MAP_W * 100 + rnd(-4, 4)));
    /* hover above the landmark; never down in the region-pill row (top 88%+) */
    var halfH = size / 2 / h * 100;
    var ylo = Math.max(12, view.t0 + halfH + 1), yhi = Math.min(74, view.t1 - halfH - 1);
    if(yhi < ylo){ ylo = Math.max(view.t0 + halfH, 0); yhi = Math.max(ylo, Math.min(86, view.t1 - halfH)); }
    var yPct = Math.max(ylo, Math.min(yhi, (a.top / MAP_H * 100) - rnd(10, 22)));
    var place = { left:xPct.toFixed(1) + "%", top:yPct.toFixed(1) + "%", size:size };
    if(c.travel){
      var ltr = Math.random() < .5, span = hi - lo;
      var from = ltr ? lo + span * rnd(0, .12) : hi - span * rnd(0, .12), to = ltr ? hi - span * rnd(0, .12) : lo + span * rnd(0, .12);
      place.left = from.toFixed(1) + "%"; place.travelTo = to.toFixed(1) + "%";
      place.top = rnd(Math.max(ylo, 26), Math.max(Math.max(ylo, 26), Math.min(yhi, 60))).toFixed(1) + "%";
    }
    return place;
  }
  function mapTick(){
    S.timer = 0;
    if(S.mode !== "map" || !mapOpen()) return stopMap();
    if(document.hidden) return;
    var ms = $("geiMapMilestone");
    if(ms && ms.classList.contains("show")){ schedule(TIMING.recheck * 2, mapTick); return; }
    if(Math.random() < TIMING.mapChance){
      var scene = $("dmwScene");
      if(scene){
        mount(scene, "map");
        var c = mapCameo();
        var place = mapPlace(c);
        if(place){ var shown = showCameo(place, { cameo:c.id }); schedule(shown.ms + rint(TIMING.mapBetween), mapTick); return; }
      }
    }
    schedule(rint(TIMING.mapBetween), mapTick);
  }
  function startMap(){
    stopIdle(); stopAmbient();
    S.mode = "map";
    schedule(rint(TIMING.mapFirst), mapTick);
  }
  function stopMap(){
    if(S.mode !== "map") return;
    clearSchedule(); hideCameo(); S.mode = "";
  }
  function bindMap(){
    var p = mapPage(); if(!p || p.dataset.dscBound) return; p.dataset.dscBound = "1";
    new MutationObserver(evaluate).observe(p, { attributes:true, attributeFilter:["class"] });
    evaluate();
  }

  /* ---------- lifecycle ---------- */
  function onVisibility(){
    if(document.hidden){ clearSchedule(); hideCameo(); }
    evaluate();                                                   // hidden → "", visible → the screen's mode restarts its wait
  }
  var WATCH = ["preGameCard","bonusCard","levelCard","damMachineCard","characterSpotlight","tribeCard","geiWelcome","geiSplash","geiIteCollection","navSheet"];
  function watchDialogs(){
    var mo = new MutationObserver(function(){ evaluate(); });
    WATCH.forEach(function(id){ var el = $(id); if(el && !el.dataset.dscWatch){ el.dataset.dscWatch = "1"; mo.observe(el, { attributes:true, attributeFilter:["class","style"] }); } });
    [].forEach.call(document.querySelectorAll(".sidePanel"), function(el){ if(!el.dataset.dscWatch){ el.dataset.dscWatch = "1"; mo.observe(el, { attributes:true, attributeFilter:["class"] }); } });
  }
  function install(){
    if(S.installed) return;
    S.installed = true;
    build(); bindIdle(); bindMap(); watchDialogs();
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("pointerdown", onInput, true);
    document.addEventListener("keydown", onInput, true);
    window.addEventListener("load", function(){ bindMap(); watchDialogs(); });
    /* Cheap safety net for state the DOM does not announce (phase, busy, wheel spinning). */
    S.poll = setInterval(function(){ if(!S.disabled) evaluate(); }, TIMING.poll);
    evaluate();
  }

  function selfTest(){
    var layer = L.layer;
    return {
      version:VERSION, cameos:CAMEOS.length, effects:EFFECTS.length, tiers:TIERS.map(function(t){ return t.id + ":" + t.w; }).join(","),
      tierWeightsSum:TIERS.reduce(function(a,t){ return a + t.w; }, 0),
      singleLayer:document.querySelectorAll("#damSurpriseLayer").length <= 1,
      boundedDom:!layer || layer.querySelectorAll("*").length <= 16,
      pointerEventsNone:!layer || !layer.isConnected || getComputedStyle(layer).pointerEvents === "none",
      ariaHidden:!layer || layer.getAttribute("aria-hidden") === "true",
      artFromCatalog:CAMEOS.every(function(c){ return !!catalogArt(c.id); }),
      noneSelectable:(function(){ try{ return CAMEOS.every(function(c){ return !playableCharacters().some(function(p){ return p.id === c.id; }); }); }catch(e){ return false; } })(),
      modes:["home","pregame","wheel","level","idle","map"],
      screen:screen(),
      presentationOnly:true
    };
  }

  window.__GEI_DAM_SURPRISES__ = window.damSurpriseCameoEngine = {
    version:VERSION, name:"DAM-ITE SURPRISES",
    cameos:CAMEOS.map(function(c){ return { id:c.id, label:c.label, effects:c.fx.slice() }; }),
    effects:EFFECTS.slice(), entries:ENTRIES.slice(), exits:EXITS.slice(), tiers:TIERS.slice(), timing:TIMING,
    get mode(){ return S.mode; }, get visible(){ return S.visible; }, get current(){ return S.current; },
    get idleShowActive(){ return S.idleShowActive; },
    get screen(){ return screen(); },
    modes:JSON.parse(JSON.stringify(MODES)),
    stats:function(){ return JSON.parse(JSON.stringify(S.stats)); },
    recent:function(){ return S.recent.slice(); },
    pickTier:pickTier, selfTest:selfTest,
    stop:function(){ S.disabled = true; stopIdle(); stopMap(); stopAmbient(); clearSchedule(); hideCameo(); S.mode = ""; },
    start:function(){ S.disabled = false; evaluate(); },
    evaluate:evaluate,
    debug:{ show:function(opts){ opts = opts || {};
      if(mapOpen()){ mount($("dmwScene"), "map"); var c = CAMEOS.find(function(x){ return x.id === opts.cameo; }) || mapCameo(); return showCameo(mapPlace(c), { cameo:c.id, tier:opts.tier }); }
      if(timeUpShowing()){ mount(timeUp(), "idle"); return showCameo(idlePlace(), opts); }
      var m = MODES[S.mode] ? S.mode : screen(), cfg = MODES[m], h = cfg && HOSTS[m]();
      if(!h) return null;
      var place = placeAround({ host:h.host, inner:h.inner, region:h.region, guards:h.guards, size:cfg.size, k:cfg.k });
      if(!place) return null;
      mount(h.host, "amb " + m + (h.over ? " over" : ""));
      return showCameo(place, { cameo:opts.cameo, tier:opts.tier, show:cfg.show, subtle:cfg.subtle, big:cfg.big }); } }
  };

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once:true });
  else install();
})();
