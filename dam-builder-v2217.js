/* V2.2.17 — DAM BUILDER: FLOW ENGINE 🛠️💧   (second game mode, additive)
 *
 *   TAPLITES ARCADE (the existing tap game, untouched)  ⇄  DAM BUILDER (interactive hydraulic challenges)
 *
 * The Builder is a second INTERFACE onto the same six-Day cycle. It owns no progression:
 *   • The current Level / Day come from the game's own ledger (`state.levelFlOz` via daysDoneThisLevel()).
 *   • A Day is paid ONLY through the game's own `awardDay(index)` — the exactly-once ledger (pays iff levelFlOz === index × 111). A retry, a
 *     refresh, a re-opened challenge, a practice replay or switching modes can never pay twice, and Builder-cleared Days appear as cleared in Arcade.
 *   • Day 6 hands over to the game's own `reachOcean()` → Level Complete → redeem → next level (Day 1 again), exactly like Arcade.
 *   • It never touches purchases, entitlements, payment, the save format (SAVE_KEY), reward caps or tap requirements.
 *
 * The one new resource, BUILDER PARTS 🔩, is isolated in its own localStorage key (KEY below) and is NOT FL OZ:
 *   earn   first Builder clear of a (level, Day) pays 2 parts + 1 per star (1–3 stars → 3–5). Improving your stars on a replay pays only the difference.
 *   spend  workshop upgrades (wheel bearings · reservoir lining · gate actuator), level n → n+1 costs 6 × (n+1) parts. Parts never convert to FL OZ.
 *
 * Physics is a deliberately SIMPLE teaching model (Torricelli-style flow ∝ opening × √head, hydrostatic pressure ∝ depth, power ∝ flow × efficiency).
 * It is deterministic (fixed 20 Hz tick), and it is not an engineering tool.
 *
 * Files: this file = shell, store, audio, FX, arcade integration.  dam-builder-days-v2217.js = the six Day models + scenes.
 */
(function(){
  "use strict";
  if(window.DamBuilder) return;
  var VERSION = "V2.2.17", KEY = "geiDamBuilder.v1", NS = "http://www.w3.org/2000/svg", TICK = 0.05, REWARD = 111;
  var C = { cyan:"#2fd2ff", indigo:"#3d3dea", magenta:"#f310ba", pink:"#ff9df2", ink:"#06070d" };
  var DAYS = [
    { n:1, icon:"⛰️", short:"SOURCE",    name:"MOUNTAIN SOURCE",   sub:"SEPARATION",               sky:["#10123a","#3d3dea","#ff9df2"] },
    { n:2, icon:"🧱", short:"DAM WALL",  name:"DAM WALL",          sub:"CONTAINMENT",              sky:["#0a0d2e","#2b3ad0","#2fd2ff"] },
    { n:3, icon:"🌊", short:"RESERVOIR", name:"RESERVOIR",         sub:"STORAGE",                  sky:["#080b24","#26308f","#6fd9ff"] },
    { n:4, icon:"🚪", short:"SLUICE",    name:"SLUICE GATE",       sub:"REGULATION",               sky:["#07091e","#3d3dea","#9a7bff"] },
    { n:5, icon:"⚙️", short:"WHEEL",     name:"WATERWHEEL",        sub:"MECHANICAL CONVERSION",    sky:["#0a0820","#5b2bc9","#f310ba"] },
    { n:6, icon:"🏭", short:"FACTORY",   name:"FACTORY",           sub:"ORGANIZED SYSTEM",         sky:["#06070d","#2a1b6e","#f310ba"] }
  ];
  var UPGRADES = [
    { id:"bear",  icon:"⚙️", name:"WHEEL BEARINGS",    fx:"+6% wheel efficiency per level · more buckets",   days:"Days 5–6" },
    { id:"liner", icon:"🧱", name:"RESERVOIR LINING",  fx:"+10% storage capacity per level",                 days:"Days 3 & 6" },
    { id:"act",   icon:"🔧", name:"GATE ACTUATOR",     fx:"finer gate steps · wider target band",            days:"Days 4 & 6" }
  ];

  /* ============================================================ small helpers */
  function $(id){ return document.getElementById(id); }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t){ return a + (b - a) * t; }
  function int(v, a, b){ v = Math.floor(Number(v)); return isFinite(v) ? clamp(v, a, b) : a; }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }
  function warn(e){ try{ console.warn("[DamBuilder] " + (e && e.message || e)); }catch(_){} }
  function gs(){ try{ return (typeof state !== "undefined" && state) || {}; }catch(e){ return {}; } }
  function gfn(name){ try{ return typeof window[name] === "function" ? window[name] : null; }catch(e){ return null; } }
  function osReduced(){ try{ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return false; } }
  function setA(el, k, v){ var c = el.__a || (el.__a = {}); if(c[k] === v) return; c[k] = v; el.setAttribute(k, v); }
  function S(tag, attrs, parent){
    var e = document.createElementNS(NS, tag);
    if(attrs) for(var k in attrs) e.setAttribute(k, attrs[k]);
    if(parent) parent.appendChild(e);
    return e;
  }
  function T(parent, x, y, str, attrs){
    var a = { x:x, y:y, "text-anchor":"middle", "font-family":"system-ui,-apple-system,Segoe UI,Roboto,sans-serif", "font-weight":"800", "font-size":"9", fill:"#dff6ff" };
    if(attrs) for(var k in attrs) a[k] = attrs[k];
    var t = S("text", a, parent); t.textContent = str; return t;
  }

  /* ============================================================ PARTS STORE (isolated; never the game save, never FL OZ) */
  function freshStore(){ return { v:1, parts:0, earned:0, up:{ bear:0, liner:0, act:0 }, clears:{}, motion:null, mode:"arcade", r3d:null }; }
  function sanitize(d){
    var s = freshStore();
    if(!d || typeof d !== "object") return s;
    s.parts = int(d.parts, 0, 99999); s.earned = int(d.earned, 0, 999999);
    UPGRADES.forEach(function(u){ s.up[u.id] = int(d.up && d.up[u.id], 0, 3); });
    if(d.clears && typeof d.clears === "object") Object.keys(d.clears).slice(0, 3000).forEach(function(k){ if(/^\d{1,7}:[1-6]$/.test(k)) s.clears[k] = int(d.clears[k], 1, 3); });
    s.motion = d.motion === true || d.motion === false ? d.motion : null;
    s.mode = d.mode === "builder" ? "builder" : "arcade";
    s.r3d = d.r3d === false ? false : null;
    return s;
  }
  var store = (function(){ try{ return sanitize(JSON.parse(window.localStorage.getItem(KEY))); }catch(e){ return freshStore(); } })();
  function persist(){ try{ window.localStorage.setItem(KEY, JSON.stringify(store)); }catch(e){} }
  function upgradeCost(id){ return 6 * (store.up[id] + 1); }

  /* ============================================================ progression bridge (reads + one write path: awardDay) */
  function daysDone(){
    var f = gfn("daysDoneThisLevel"); if(f){ try{ return f(); }catch(e){} }
    return Math.min(6, Math.floor((gs().levelFlOz | 0) / REWARD));
  }
  function level(){ return Math.max(1, gs().level | 0 || 1); }
  function arcadeReady(){ var s = gs(); return (s.phase === "ready" || s.phase === "playing") && !s.busy && (s.levelFlOz | 0) < 6 * REWARD; }

  /* Pays a Day through the game's own exactly-once ledger and mirrors the result onto the Arcade world. Returns {paid, reason}. */
  function commitDay(index){
    var s = gs(), award = gfn("awardDay");
    if(!award) return { paid:false, reason:"unavailable" };
    if(index !== daysDone() || (s.levelFlOz | 0) !== index * REWARD) return { paid:false, reason:"already-banked" };
    if(!arcadeReady()) return { paid:false, reason:"arcade-busy" };
    var mill = index === 5;
    try{
      if(s.phase === "playing"){ var st = gfn("stopDayTimer"); if(st) st(); }
      if(mill) s.millStage++;                         // same order as Arcade: before awardDay so the day-6 save carries it
      var ok = !!award(index);
      if(!ok){ if(mill) s.millStage--; return { paid:false, reason:"ledger" }; }
      s.tapCount = 0;
      try{ var rm = gfn("renderMillStage"); if(mill && rm) rm(); }catch(e){}
      try{ var rv = gfn("restoreVisualProgress"); if(rv) rv(); }catch(e){}
      if(index < 5){
        s.currentStep = index + 1; s.phase = "ready"; s.busy = false;
        try{ var ac = gfn("activateStation"); if(ac) ac(index + 1); }catch(e){}
        try{ var up = gfn("updateProgressDots"); if(up) up(); }catch(e){}
        try{ var rh = gfn("renderHud"); if(rh) rh(); }catch(e){}
      }
      return { paid:true, amount:REWARD };
    }catch(e){ warn(e); return { paid:false, reason:"error" }; }
  }

  /* ============================================================ audio (shared bus, shared mute; short synth only — no new music, no voices) */
  var lastSfx = 0;
  function muted(){ try{ return !!(window.GEI_AUDIO && window.GEI_AUDIO.muted); }catch(e){ return false; } }
  function tone(ac, out, f0, f1, dur, type, vol, delay){
    var t0 = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f0, t0); if(f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(out); o.start(t0); o.stop(t0 + dur + 0.03);
  }
  function sfx(kind){
    if(muted() || !root || root.hidden) return;
    var t = Date.now(); if(t - lastSfx < 55) return; lastSfx = t;
    try{
      var ga = gfn("getAudio"); if(!ga) return;
      var ac = ga(), out = window.GEI_AUDIO ? window.GEI_AUDIO.sfxIn(ac) : ac.destination;
      if(kind === "tick") tone(ac, out, 540, 460, 0.07, "sine", 0.05);
      else if(kind === "click") tone(ac, out, 380, 300, 0.09, "triangle", 0.06);
      else if(kind === "splash") tone(ac, out, 700, 180, 0.2, "triangle", 0.05);
      else if(kind === "good"){ tone(ac, out, 523, 523, 0.16, "sine", 0.07); tone(ac, out, 659, 659, 0.16, "sine", 0.07, 0.11); tone(ac, out, 784, 784, 0.3, "sine", 0.07, 0.22); }
      else if(kind === "bad"){ tone(ac, out, 190, 90, 0.34, "sawtooth", 0.05); }
      else if(kind === "build"){ tone(ac, out, 260, 330, 0.1, "square", 0.03); tone(ac, out, 330, 440, 0.12, "square", 0.03, 0.12); }
    }catch(e){}
  }

  /* ============================================================ motion / quality */
  function reduced(){ return store.motion === null ? osReduced() : store.motion === true; }   // store.motion: true = reduced
  var perf = { low:(function(){ try{ var n = navigator; return !!((n.hardwareConcurrency && n.hardwareConcurrency <= 4) || (n.deviceMemory && n.deviceMemory <= 2)); }catch(e){ return false; } })(), slow:0 };
  function particleCap(){ return reduced() ? 0 : perf.low ? 10 : 28; }

  /* particle pool: a fixed set of <circle>s reused forever (no per-burst allocation → no leaks) */
  function makeFx(g){
    var P = [], i, n = 28;
    for(i = 0; i < n; i++){ var c = S("circle", { r:2, cx:0, cy:0, opacity:0, fill:"#fff" }, g); P.push({ c:c, life:0, max:1, x:0, y:0, vx:0, vy:0, r:2 }); }
    return {
      spawn:function(x, y, vx, vy, life, r, color){
        var cap = particleCap(); if(!cap) return;
        var live = 0, slot = null;
        for(var k = 0; k < n; k++){ if(P[k].life > 0) live++; else if(!slot) slot = P[k]; }
        if(!slot || live >= cap) return;
        slot.life = slot.max = life; slot.x = x; slot.y = y; slot.vx = vx; slot.vy = vy; slot.r = r || 2; slot.c.setAttribute("fill", color || "#bff4ff"); slot.c.setAttribute("r", slot.r);
      },
      burst:function(x, y, cnt, color, spread){
        var cap = particleCap(); if(!cap) return;
        cnt = Math.min(cnt, cap);
        for(var k = 0; k < cnt; k++){ var a = Math.random() * 6.283, sp = (spread || 60) * (0.4 + Math.random() * 0.6); this.spawn(x, y, Math.cos(a) * sp, Math.sin(a) * sp - 20, 0.7 + Math.random() * 0.5, 1.6 + Math.random() * 1.6, color); }
      },
      update:function(dt){
        for(var k = 0; k < n; k++){
          var p = P[k]; if(p.life <= 0) continue;
          p.life -= dt; if(p.life <= 0){ p.c.setAttribute("opacity", 0); continue; }
          p.vy += 140 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
          p.c.setAttribute("cx", p.x.toFixed(1)); p.c.setAttribute("cy", p.y.toFixed(1)); p.c.setAttribute("opacity", Math.min(1, p.life / p.max * 1.4).toFixed(2));
        }
      },
      clear:function(){ for(var k = 0; k < n; k++){ P[k].life = 0; P[k].c.setAttribute("opacity", 0); } }
    };
  }

  /* ============================================================ DOM + CSS */
  var holder3D = {}, heavySkip = 0, envKeep = null, root = null, els = {}, run = null, raf = 0, lastTs = 0, acc = 0, fx = null, defs = {}, sceneG = null, svgEl = null, introSeen = {}, openFlag = false, sheetOpen = false, pillTimer = 0, uiCache = {};
  var CSS = [
    "#dbRoot{position:fixed;inset:0;z-index:10050;display:flex;flex-direction:column;background:#06070d;color:#eaf8ff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-tap-highlight-color:transparent;touch-action:manipulation;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);overflow:hidden}",
    "#dbRoot[hidden]{display:none}",
    "#dbRoot button{font:inherit;color:inherit;cursor:pointer}",
    ".dbHead{display:flex;align-items:center;gap:6px;padding:8px 8px 4px;flex:0 0 auto}",
    ".dbSeg{display:flex;flex:1 1 auto;min-width:0;border:1px solid rgba(47,210,255,.45);border-radius:14px;overflow:hidden;background:#0b0f2a}",
    ".dbSeg button{flex:1 1 0;min-width:0;border:0;background:transparent;padding:0 4px;min-height:44px;font-weight:900;font-size:clamp(10px,3vw,12.5px);letter-spacing:.04em;line-height:1.1}",
    ".dbSeg button[aria-selected=true]{background:linear-gradient(135deg,#3d3dea,#f310ba);color:#fff}",
    ".dbIcon{flex:0 0 auto;min-width:44px;height:44px;border:1px solid rgba(47,210,255,.4);border-radius:12px;background:#0b0f2a;font-size:17px;line-height:1;padding:0 6px;display:flex;align-items:center;justify-content:center;gap:2px}",
    ".dbIcon[aria-pressed=true]{border-color:#ff9df2;background:rgba(243,16,186,.2)}",
    ".dbIcon small{font-size:11px;font-weight:900;color:#ff9df2}",
    ".dbStat{flex:0 0 auto;padding:0 10px 4px;font-size:11px;font-weight:800;letter-spacing:.05em;color:#9bdcf2;display:flex;justify-content:space-between;gap:8px;white-space:nowrap;overflow:hidden}",
    ".dbStat b{color:#fff}",
    ".dbDays{display:flex;gap:4px;padding:0 8px 6px;flex:0 0 auto}",
    ".dbDay{flex:1 1 0;min-width:0;min-height:44px;border:1px solid rgba(255,255,255,.14);border-radius:11px;background:#0b0f2a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;position:relative;padding:2px 0}",
    ".dbDay i{font-style:normal;font-size:16px;line-height:1}.dbDay span{font-size:9px;font-weight:900;letter-spacing:.03em;color:#9bdcf2}",
    ".dbDay[aria-current=true]{border-color:#2fd2ff;background:rgba(47,210,255,.16);box-shadow:0 0 0 1px #2fd2ff inset}",
    ".dbDay.done::after{content:'✓';position:absolute;top:1px;right:4px;font-size:10px;color:#6dffb0;font-weight:900}",
    ".dbDay.lock{opacity:.4}.dbDay.lock::after{content:'🔒';position:absolute;top:0;right:2px;font-size:9px}",
    ".dbDay.now:not([aria-current=true]){border-color:#ff9df2}",
    ".dbMain{position:relative;flex:1 1 auto;min-height:0;display:flex;flex-direction:column}",
    ".dbStage{position:relative;flex:1 1 auto;min-height:170px;overflow:hidden;border-top:1px solid rgba(47,210,255,.25);border-bottom:1px solid rgba(47,210,255,.25);transition:opacity .28s ease,transform .28s ease}",
    ".dbStage.swap{opacity:0;transform:translateY(8px)}",
    ".dbStage svg{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;user-select:none;-webkit-user-select:none}",
    ".dbStage [data-eq]{cursor:pointer;outline:none}.dbStage [data-eq]:focus-visible{outline:2px solid #ffd35e;outline-offset:2px}",
    ".db3d{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none}",
    ".db3dLoad{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:linear-gradient(#10163f,#06070d);font-size:12px;font-weight:900;letter-spacing:.08em;color:#9bdcf2}",
    ".db3dLoad i{width:46px;height:46px;border-radius:50%;border:3px solid rgba(47,210,255,.25);border-top-color:#2fd2ff;animation:dbSpin 1s linear infinite}",
    ".db3dHot{position:absolute;left:0;top:0;z-index:3;width:44px;height:44px;border-radius:50%;border:2px solid #ff9df2;background:rgba(6,7,13,.72);color:#fff;display:none;flex-direction:column;align-items:center;justify-content:center;padding:0;font:900 9px system-ui,sans-serif;letter-spacing:.04em;animation:dbHot 1.6s ease-in-out infinite;will-change:transform}",
    ".db3dHot.pill{width:auto;min-width:56px;border-radius:22px;padding:0 10px;flex-direction:row;gap:6px;font-size:11px;white-space:nowrap}.db3dHot.pill i{margin:0;width:10px;height:10px;border-width:2px}",
    ".db3dHot i{width:14px;height:14px;border-radius:50%;border:3px solid #ff9df2;border-top-color:transparent;margin-bottom:1px}",
    ".db3dHot.on{border-color:#2fd2ff}.db3dHot.on i{border-color:#2fd2ff;border-top-color:transparent}.db3dHot.run{border-color:#6dffb0;animation:none}.db3dHot.run i{border-color:#6dffb0;border-top-color:transparent}",
    ".db3dAdvice{position:absolute;left:8px;bottom:8px;right:104px;z-index:4;min-height:34px;padding:6px 10px;border-radius:12px;font:800 11.5px/1.25 system-ui,sans-serif;letter-spacing:.02em;background:rgba(6,7,13,.84);border:1px solid #2fd2ff;color:#eaf8ff;display:flex;align-items:center;pointer-events:none}",
    ".db3dAdvice[hidden]{display:none}.db3dAdvice.good{border-color:#6dffb0;color:#c9ffe1}.db3dAdvice.warn{border-color:#ff9df2}.db3dAdvice.bad{border-color:#ff5b8a;color:#ffd0dc}",
    ".db3dFc{position:absolute;right:8px;top:8px;width:128px;height:44px;z-index:3;pointer-events:none}.db3dFc[hidden]{display:none}",
    ".dbView{position:absolute;right:8px;bottom:8px;z-index:7;min-height:34px;border-radius:17px;border:1px solid rgba(47,210,255,.6);background:rgba(6,7,13,.78);font:900 10.5px system-ui,sans-serif;letter-spacing:.05em;padding:0 11px;color:#eaf8ff}",
    ".dbView[hidden]{display:none}",
    "@keyframes dbSpin{to{transform:rotate(360deg)}}@keyframes dbHot{0%,100%{box-shadow:0 0 0 0 rgba(255,157,242,.55)}50%{box-shadow:0 0 0 9px rgba(255,157,242,0)}}",
    ".dbInspect{position:absolute;left:8px;right:8px;top:6px;z-index:3;pointer-events:none;background:rgba(6,7,13,.82);border:1px solid rgba(255,157,242,.55);border-radius:10px;padding:5px 9px;font-size:11.5px;line-height:1.3;display:none}",
    ".dbInspect.on{display:block}.dbInspect b{color:#ff9df2;letter-spacing:.05em}",
    ".dbPanel{flex:0 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:7px 8px calc(8px + env(safe-area-inset-bottom,0px));background:linear-gradient(#0b0f2a,#06070d);display:flex;flex-direction:column;gap:6px}",
    ".dbGoal{font-size:12px;line-height:1.3;display:flex;gap:8px;align-items:flex-start}",
    ".dbGoal b{color:#2fd2ff;letter-spacing:.04em}.dbGoal span{color:#d7efff;flex:1}",
    ".dbHelp{flex:0 0 auto;min-width:34px;height:34px;border-radius:50%;border:1px solid rgba(47,210,255,.5);background:#0b0f2a;font-weight:900}",
    ".dbGauges{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}",
    ".dbG{background:#0b0f2a;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:3px 6px 5px;min-width:0}",
    ".dbG label{display:block;font-size:9px;font-weight:900;letter-spacing:.07em;color:#8fc7dc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".dbG b{display:block;font-size:13px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".dbG i{display:block;position:relative;height:5px;border-radius:3px;background:#1a2150;margin-top:2px;overflow:hidden}",
    ".dbG u{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#3d3dea,#2fd2ff);border-radius:3px;transition:width .12s linear}",
    ".dbG s{position:absolute;top:0;bottom:0;background:rgba(109,255,176,.45);border-left:1px solid #6dffb0;border-right:1px solid #6dffb0}",
    ".dbG.warn u{background:linear-gradient(90deg,#f310ba,#ff9df2)}.dbG.good b{color:#6dffb0}.dbG.warn b{color:#ff9df2}",
    ".dbCtl{display:flex;gap:6px;flex-wrap:wrap;align-items:stretch}",
    ".dbCtl:empty{display:none}",
    ".dbBtn{flex:1 1 0;min-width:96px;min-height:46px;border-radius:12px;border:1px solid rgba(47,210,255,.55);background:linear-gradient(#17206b,#0d1246);font-weight:900;font-size:13px;letter-spacing:.03em;padding:6px 8px}",
    ".dbBtn.pri{background:linear-gradient(135deg,#3d3dea,#f310ba);border-color:#ff9df2}",
    ".dbBtn.on{background:linear-gradient(135deg,#0aa6d6,#2fd2ff);color:#06070d;border-color:#fff}",
    ".dbBtn[disabled]{opacity:.4}",
    ".dbSl{flex:1 1 100%;display:flex;align-items:center;gap:8px;font-size:11px;font-weight:900;letter-spacing:.04em}",
    ".dbSl label{flex:0 0 78px;color:#9bdcf2}.dbSl input{flex:1;min-width:0;height:34px;accent-color:#2fd2ff}.dbSl output{flex:0 0 40px;text-align:right}",
    ".dbSheet{position:absolute;inset:0;z-index:6;background:rgba(6,7,13,.86);display:flex;align-items:flex-end;justify-content:center;padding:10px}",
    ".dbSheet[hidden]{display:none}",
    ".dbCard{width:min(100%,460px);max-height:100%;overflow:auto;background:linear-gradient(#10163f,#0a0e2c);border:1px solid rgba(47,210,255,.6);border-radius:18px;padding:14px 14px 12px;box-shadow:0 10px 40px rgba(0,0,0,.6);animation:dbPop .28s ease-out}",
    ".dbCard h2{margin:0 0 2px;font-size:17px;letter-spacing:.03em}.dbCard h3{margin:10px 0 3px;font-size:11px;letter-spacing:.09em;color:#2fd2ff}",
    ".dbCard p{margin:0;font-size:13.5px;line-height:1.4;color:#e0f4ff}",
    ".dbCard small{display:block;margin-top:8px;font-size:10.5px;line-height:1.3;color:#8fb3c6}",
    ".dbRow{display:flex;gap:8px;margin-top:12px}",
    ".dbStars{font-size:26px;letter-spacing:4px;color:#ffd35e;text-align:center;margin:2px 0 4px}",
    ".dbStars span.off{color:#33406e}",
    ".dbRw{display:flex;flex-direction:column;gap:3px;margin-top:8px;font-size:13px;font-weight:800}",
    ".dbRw div{background:#0b0f2a;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:6px 9px;display:flex;justify-content:space-between;gap:8px}",
    ".dbRw .g{color:#6dffb0}.dbRw .m{color:#9bdcf2}",
    ".dbDemo{width:100%;height:82px;display:block;background:#07091e;border-radius:10px;margin:8px 0 2px}",
    ".dbUp{display:flex;align-items:center;gap:8px;background:#0b0f2a;border:1px solid rgba(255,255,255,.14);border-radius:12px;padding:8px;margin-top:6px}",
    ".dbUp>i{font-style:normal;font-size:24px;flex:0 0 30px;text-align:center}.dbUp div{flex:1;min-width:0;font-size:12px;line-height:1.3}.dbUp b{font-size:13px;display:block}",
    ".dbPips{letter-spacing:3px;color:#ffd35e;font-size:12px}.dbPips .off{color:#33406e}",
    ".dbUp .dbBtn{flex:0 0 74px;min-width:74px;min-height:44px;font-size:12px}",
    ".dbBuild{height:6px;border-radius:3px;background:#1a2150;overflow:hidden;margin-top:4px}.dbBuild u{display:block;height:100%;width:0;background:repeating-linear-gradient(45deg,#ffd35e 0 6px,#f310ba 6px 12px);animation:dbFill var(--bt,.9s) linear forwards}",
    "@media (orientation:landscape) and (max-height:560px){.dbMain{flex-direction:row}.dbStage{min-height:0;flex:1 1 0;border-bottom:0;border-top:0}.dbPanel{flex:0 0 min(46%,400px);overflow-y:auto;padding-top:6px}.dbStat{display:none}.dbDay{min-height:44px}.dbDay i{font-size:14px}.dbSeg button,.dbIcon{min-height:44px;height:44px}.dbHead{padding:4px 8px 3px}.dbDays{padding-bottom:4px}.dbCard{max-height:100%}.dbSheet{align-items:center}}",
    ".dbToast{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);z-index:4;background:rgba(6,7,13,.88);border:1px solid #ff9df2;border-radius:12px;padding:7px 12px;font-size:12px;font-weight:800;max-width:92%;text-align:center;pointer-events:none;opacity:0;transition:opacity .2s}",
    ".dbToast.on{opacity:1}",
    ".dbPill{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:9000;display:none;border:1px solid rgba(47,210,255,.7);border-radius:16px;overflow:hidden;background:rgba(6,7,13,.9);box-shadow:0 4px 18px rgba(0,0,0,.5)}",
    ".dbPill.on{display:flex}",
    ".dbPill button{border:0;background:transparent;color:#eaf8ff;font:900 11.5px system-ui,sans-serif;letter-spacing:.04em;min-height:44px;padding:0 11px}",
    ".dbPill button[aria-selected=true]{background:linear-gradient(135deg,#3d3dea,#f310ba)}",
    ".dbPill em{font-style:normal;font-size:9px;background:#ffd35e;color:#06070d;border-radius:6px;padding:1px 4px;margin-left:4px}",
    ".dbBuildIn{animation:dbRise .4s cubic-bezier(.2,.9,.3,1.2) both;animation-delay:calc(var(--i,0) * 45ms);transform-box:fill-box;transform-origin:50% 100%}",
    ".dbPulse{animation:dbPulse 1.2s ease-in-out infinite}",
    ".dbShake{animation:dbShake .32s}",
    ".dbSweep{animation:dbSweep 1.1s ease-out}",
    "#dbRoot.dbRM *,#dbRoot.dbRM *::before,#dbRoot.dbRM *::after{animation:none!important;transition:none!important}",
    "@keyframes dbPop{from{transform:translateY(14px) scale(.97);opacity:0}to{transform:none;opacity:1}}",
    "@keyframes dbRise{from{opacity:0;transform:translateY(10px) scaleY(.6)}to{opacity:1;transform:none}}",
    "@keyframes dbPulse{0%,100%{opacity:.55}50%{opacity:1}}",
    "@keyframes dbShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}",
    "@keyframes dbSweep{from{opacity:.85;transform:translateX(-100%)}to{opacity:0;transform:translateX(100%)}}",
    "@keyframes dbFill{to{width:100%}}",
    "@keyframes dbCloud{from{transform:translateX(-30px)}to{transform:translateX(30px)}}",
    "@keyframes dbDemoFlow{to{stroke-dashoffset:-24}}",
    "@keyframes dbDemoRise{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}",
    "@keyframes dbDemoGate{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}",
    "@keyframes dbDemoSpin{to{transform:rotate(360deg)}}",
    "@keyframes dbDemoLit{0%,100%{opacity:.25}50%{opacity:1}}",
    "@keyframes dbDemoArrow{0%,100%{transform:scaleX(.4)}50%{transform:scaleX(1)}}",
    ".dbCloud{animation:dbCloud 14s ease-in-out infinite alternate}",
    ".dbD1 path{stroke-dasharray:6 6;animation:dbDemoFlow .9s linear infinite}",
    ".dbD2 .a{transform-box:fill-box;transform-origin:left center;animation:dbDemoArrow 2s ease-in-out infinite}",
    ".dbD3 .w{transform-box:fill-box;transform-origin:50% 100%;animation:dbDemoRise 4s ease-in-out infinite}",
    ".dbD4 .gt{animation:dbDemoGate 3s ease-in-out infinite}.dbD4 .jt{transform-box:fill-box;transform-origin:left center;animation:dbDemoArrow 3s ease-in-out infinite}",
    ".dbD5 .wh{transform-box:fill-box;transform-origin:center;animation:dbDemoSpin 4s linear infinite}",
    ".dbD6 .n{animation:dbDemoLit 2.4s ease-in-out infinite;animation-delay:calc(var(--i) * .4s)}"
  ].join("\n");

  function addCss(){
    if($("dbStyles")) return;
    var st = document.createElement("style"); st.id = "dbStyles"; st.textContent = CSS; document.head.appendChild(st);
  }

  function build(){
    if(root) return;
    addCss();
    root = document.createElement("div"); root.id = "dbRoot"; root.hidden = true;
    root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "DAM BUILDER: FLOW ENGINE");
    root.innerHTML =
      '<div class="dbHead">' +
        '<div class="dbSeg" role="tablist" aria-label="Game mode">' +
          '<button type="button" role="tab" data-mode="arcade" aria-selected="false">TAPLITES ARCADE</button>' +
          '<button type="button" role="tab" data-mode="builder" aria-selected="true">DAM BUILDER</button>' +
        '</div>' +
        '<button type="button" class="dbIcon" id="dbSnd" aria-label="Sound" aria-pressed="false">🔊</button>' +
        '<button type="button" class="dbIcon" id="dbMot" aria-label="Reduced motion" aria-pressed="false">🌊</button>' +
        '<button type="button" class="dbIcon" id="dbShop" aria-label="Workshop upgrades">🔧<small id="dbParts">0</small></button>' +
      '</div>' +
      '<div class="dbStat" id="dbStat"></div>' +
      '<div class="dbDays" id="dbDays" role="tablist" aria-label="Days"></div>' +
      '<div class="dbMain">' +
      '<div class="dbStage" id="dbStage"><div class="dbInspect" id="dbInspect" role="status" aria-live="polite"></div><button type="button" class="dbView" id="dbView" hidden></button><div class="dbToast" id="dbToast"></div></div>' +
      '<div class="dbPanel">' +
        '<div class="dbGoal"><div style="flex:1;min-width:0"><b id="dbConcept"></b> <span id="dbObj"></span></div><button type="button" class="dbHelp" id="dbHelp" aria-label="How this works">?</button></div>' +
        '<div class="dbGauges" id="dbGauges"></div>' +
        '<div class="dbCtl" id="dbCtl"></div>' +
      '</div>' +
      '<div class="dbSheet" id="dbSheet" hidden></div>' +
      '</div>';
    document.body.appendChild(root);
    ["dbStage", "dbInspect", "dbToast", "dbDays", "dbStat", "dbGauges", "dbCtl", "dbSheet", "dbConcept", "dbObj", "dbSnd", "dbMot", "dbShop", "dbParts", "dbHelp", "dbView"].forEach(function(id){ els[id] = $(id); });
    root.addEventListener("click", onRootClick);
    els.dbSheet.addEventListener("click", sheetClick);
    els.dbSnd.addEventListener("click", function(){ try{ if(window.GEI_AUDIO) window.GEI_AUDIO.toggleMute(); }catch(e){} syncChrome(); sfx("tick"); });
    els.dbMot.addEventListener("click", function(){ store.motion = !reduced(); persist(); applyMotion(); syncChrome(); });
    els.dbShop.addEventListener("click", function(){ showWorkshop(); });
    els.dbHelp.addEventListener("click", function(){ if(run) showIntro(run.i, true); });
    els.dbView.addEventListener("click", function(){ store.r3d = store.r3d === false ? null : false; persist(); if(run){ var at = run.attempts; mountDay(run.i, { attempts:at, autostart:run.status === "playing", force2d:store.r3d === false }); } });
    document.addEventListener("visibilitychange", function(){ if(document.hidden) stopLoop(); else if(openFlag) startLoop(); });
    window.addEventListener("keydown", function(e){ if(openFlag && e.key === "Escape"){ if(!els.dbSheet.hidden && sheetOpen !== "result") hideSheet(); else if(els.dbSheet.hidden) closeBuilder(); } });
    window.addEventListener("pagehide", stopLoop);
  }

  function onRootClick(e){
    var m = e.target.closest && e.target.closest("[data-mode]");
    if(m && m.getAttribute("data-mode") === "arcade") closeBuilder();
    var d = e.target.closest && e.target.closest("[data-day]");
    if(d && !d.classList.contains("lock")) selectDay(int(d.getAttribute("data-day"), 0, 5));
  }

  function applyMotion(){ if(root) root.classList.toggle("dbRM", reduced()); }
  function syncChrome(){
    if(!root) return;
    els.dbSnd.textContent = muted() ? "🔇" : "🔊"; els.dbSnd.setAttribute("aria-pressed", muted() ? "true" : "false"); els.dbSnd.setAttribute("aria-label", muted() ? "Sound off — tap to unmute" : "Sound on — tap to mute");
    els.dbMot.setAttribute("aria-pressed", reduced() ? "true" : "false"); els.dbMot.setAttribute("aria-label", reduced() ? "Reduced motion on" : "Reduced motion off"); els.dbMot.title = reduced() ? "Reduced motion: ON" : "Reduced motion: OFF";
    els.dbMot.textContent = reduced() ? "🧊" : "🌊";
    els.dbParts.textContent = String(store.parts);
    var L = level(), done = daysDone();
    els.dbStat.innerHTML = '<span>LEVEL <b>' + L + '</b> · DAY <b>' + Math.min(done + 1, 6) + '</b>/6</span><span>💧 <b>' + (gs().levelFlOz | 0) + '</b>/666 FL OZ</span><span>🔩 <b>' + store.parts + '</b></span>';
    var h = "";
    for(var i = 0; i < 6; i++){
      var cls = "dbDay" + (i < done ? " done" : "") + (i === done ? " now" : "") + (i > done ? " lock" : "");
      h += '<button type="button" class="' + cls + '" data-day="' + i + '" role="tab" aria-current="' + (run && run.i === i ? "true" : "false") + '" aria-label="Day ' + (i + 1) + ' ' + DAYS[i].name + (i < done ? ' — cleared' : i > done ? ' — locked' : '') + '"' + (i > done ? " aria-disabled=\"true\"" : "") + '><i>' + DAYS[i].icon + '</i><span>' + DAYS[i].short + '</span></button>';
    }
    if(uiCache.days !== h){ uiCache.days = h; els.dbDays.innerHTML = h; }
  }

  function toast(msg){
    if(!els.dbToast) return;
    els.dbToast.textContent = msg; els.dbToast.classList.add("on");
    clearTimeout(toast.t); toast.t = setTimeout(function(){ els.dbToast.classList.remove("on"); }, 2200);
  }

  /* ============================================================ sheets */
  function hideSheet(){ els.dbSheet.hidden = true; els.dbSheet.innerHTML = ""; sheetOpen = false; }
  function showSheet(kind, html){ els.dbSheet.innerHTML = '<div class="dbCard" role="document">' + html + '</div>'; els.dbSheet.hidden = false; sheetOpen = kind; var b = els.dbSheet.querySelector("button"); if(b) try{ b.focus({ preventScroll:true }); }catch(e){} }

  var DEMOS = [
    '<svg class="dbDemo dbD1" viewBox="0 0 160 82" aria-hidden="true"><circle cx="80" cy="12" r="7" fill="#2fd2ff"/><path d="M80 19V38" stroke="#2fd2ff" stroke-width="4" fill="none"/><path d="M80 38C80 52 40 52 40 70" stroke="#2fd2ff" stroke-width="4" fill="none"/><path d="M80 38C80 52 120 52 120 70" stroke="#ff9df2" stroke-width="4" fill="none"/><rect x="26" y="70" width="28" height="9" rx="3" fill="#3d3dea"/><rect x="106" y="70" width="28" height="9" rx="3" fill="#3d3dea"/></svg>',
    '<svg class="dbDemo dbD2" viewBox="0 0 160 82" aria-hidden="true"><rect x="20" y="10" width="62" height="64" fill="#1b4fd6" opacity=".55"/><rect x="82" y="58" width="44" height="16" fill="#9fb3c8"/><rect x="82" y="42" width="34" height="16" fill="#9fb3c8"/><rect x="82" y="26" width="24" height="16" fill="#9fb3c8"/><rect x="82" y="10" width="14" height="16" fill="#9fb3c8"/><rect class="a" x="52" y="62" width="28" height="4" fill="#ff9df2"/><rect class="a" x="62" y="46" width="18" height="4" fill="#ff9df2"/><rect class="a" x="70" y="30" width="10" height="4" fill="#ff9df2"/></svg>',
    '<svg class="dbDemo dbD3" viewBox="0 0 160 82" aria-hidden="true"><rect x="40" y="10" width="80" height="64" fill="none" stroke="#9bdcf2" stroke-width="2"/><rect class="w" x="42" y="12" width="76" height="60" fill="#2fd2ff" opacity=".7"/><path d="M42 30H118M42 56H118" stroke="#6dffb0" stroke-dasharray="4 4"/></svg>',
    '<svg class="dbDemo dbD4" viewBox="0 0 160 82" aria-hidden="true"><rect x="10" y="10" width="62" height="64" fill="#1b4fd6" opacity=".55"/><rect x="72" y="10" width="10" height="64" fill="#9fb3c8"/><rect class="gt" x="70" y="12" width="14" height="40" fill="#f310ba"/><rect class="jt" x="84" y="58" width="60" height="9" fill="#2fd2ff"/></svg>',
    '<svg class="dbDemo dbD5" viewBox="0 0 160 82" aria-hidden="true"><path d="M10 14C40 14 50 30 72 36" stroke="#2fd2ff" stroke-width="5" fill="none"/><g class="wh"><circle cx="90" cy="46" r="26" fill="none" stroke="#c98a4a" stroke-width="4"/><path d="M90 20V72M64 46H116M72 28L108 64M108 28L72 64" stroke="#c98a4a" stroke-width="3"/></g><rect x="126" y="52" width="26" height="18" rx="4" fill="#f310ba"/></svg>',
    '<svg class="dbDemo dbD6" viewBox="0 0 160 82" aria-hidden="true"><g stroke="#2fd2ff" stroke-width="3"><path d="M26 28H56M72 28H100"/><path d="M118 38C124 54 100 58 90 66" stroke="#f310ba"/></g><circle class="n" style="--i:0" cx="16" cy="28" r="9" fill="#2fd2ff"/><rect class="n" style="--i:1" x="56" y="18" width="16" height="20" fill="#3d3dea"/><rect class="n" style="--i:2" x="100" y="18" width="16" height="20" fill="#ff9df2"/><rect class="n" style="--i:3" x="62" y="60" width="40" height="16" rx="3" fill="#f310ba"/></svg>'
  ];
  var LESSON = [
    { concept:"WATER FOLLOWS THE OPEN CHANNEL", obj:"Tap a fork to send the stream where it's needed and fill every pond before time runs out.", note:"Real streams split wherever the ground forks. Here each fork has three settings: all left, split 50/50, or all right." },
    { concept:"PRESSURE GROWS WITH DEPTH", obj:"Reinforce the wall row by row with your limited blocks, then fill the reservoir without a leak.", note:"Water pressure grows with depth, so the base needs the thickest wall. (Simplified: real dams use shape, material and foundation too.)" },
    { concept:"STORE OR RELEASE", obj:"Open and close the spillway to keep the level inside the green band while the rain forecast changes.", note:"A reservoir is a buffer: level changes by inflow minus outflow. Retain water before a dry spell; release before a storm." },
    { concept:"A GATE REGULATES FLOW", obj:"Move the sluice gate until the flow rate sits inside the pink target band, and hold it there.", note:"Flow ≈ gate opening × √head (water depth). Deeper water pushes harder, so the same gate gives more flow. (Simplified Torricelli-style rule.)" },
    { concept:"FLOW BECOMES ROTATION", obj:"Send enough water to the wheel(s) and belt the machines on, so every machine runs.", note:"Moving water turns the wheel; power ≈ flow × efficiency. Too little flow stalls machines; far too much can overspeed the wheel." },
    { concept:"A SYSTEM, ORGANIZED", obj:"Drag to connect Spring → Reservoir → Gate → Wheel → machines, then tune the gate to hit the production target.", note:"Every stage depends on the one before it: store, regulate, convert, produce. Draining the reservoir faster than it fills slows the whole factory." }
  ];

  function showIntro(i, fromHelp){
    var d = DAYS[i], l = LESSON[i];
    var def = run && run.def;
    var extra = def && def.tips ? '<h3>HOW TO PLAY</h3><p>' + esc(def.tips) + '</p>' : "";
    showSheet("intro",
      '<h2>' + d.icon + ' DAY ' + d.n + ' — ' + d.name + '</h2><div style="font-size:11px;font-weight:900;letter-spacing:.08em;color:#ff9df2">' + d.sub + '</div>' +
      DEMOS[i] +
      '<h3>CONCEPT</h3><p>' + esc(l.concept) + '</p><h3>YOUR OBJECTIVE</h3><p>' + esc(l.obj) + '</p>' + extra +
      '<small>Simplified teaching model — not an engineering tool. ' + esc(l.note) + '</small>' +
      '<div class="dbRow"><button type="button" class="dbBtn pri" data-act="start">' + (fromHelp ? "BACK TO IT ▶" : "START CHALLENGE ▶") + '</button></div>');
    introSeen[i] = true;
  }

  function stars(n){ var h = ""; for(var k = 1; k <= 3; k++) h += '<span class="' + (k <= n ? "" : "off") + '">★</span>'; return '<div class="dbStars" aria-label="' + n + ' of 3 stars">' + h + '</div>'; }

  function showResult(info){
    var ok = info.ok, i = run.i, d = DAYS[i], rows = "";
    if(ok){
      if(info.paid) rows += '<div><span>Day ' + d.n + ' banked</span><span class="g">+' + REWARD + ' FL OZ</span></div>';
      else if(info.reason === "already-banked") rows += '<div><span>Practice run</span><span class="m">Day already banked — no FL OZ</span></div>';
      else rows += '<div><span>Reward</span><span class="m">not available right now</span></div>';
      if(info.parts > 0) rows += '<div><span>Builder parts</span><span class="g">+' + info.parts + ' 🔩</span></div>';
      else rows += '<div><span>Builder parts</span><span class="m">already earned for these stars</span></div>';
      var last = i === 5 && info.paid;
      var nextLabel = last ? "CLAIM LEVEL COMPLETE ▶" : (i < Math.min(5, daysDone()) || (info.paid && i < 5)) ? "NEXT: DAY " + (Math.min(i + 1, 5) + 1) + " ▶" : "";
      showSheet("result",
        '<h2>✅ ' + d.name + ' — CLEARED</h2>' + stars(info.stars) +
        '<h3>WHAT YOU LEARNED</h3><p>' + esc(run.def.explain) + '</p><div class="dbRw">' + rows + '</div>' +
        '<small>Simplified teaching model — not an engineering tool.</small>' +
        '<div class="dbRow">' + (nextLabel ? '<button type="button" class="dbBtn pri" data-act="next">' + nextLabel + '</button>' : "") + '<button type="button" class="dbBtn" data-act="retry">REPLAY</button></div>' +
        (last ? "" : '<div class="dbRow"><button type="button" class="dbBtn" data-act="arcade">BACK TO ARCADE</button></div>'));
    } else {
      showSheet("result",
        '<h2>💥 NOT YET</h2><p>' + esc(info.reason || "The challenge failed.") + '</p>' +
        '<h3>TRY THIS</h3><p>' + esc(run.def.hint || "Watch the gauges — they show what each change does.") + '</p>' +
        '<div class="dbRow"><button type="button" class="dbBtn pri" data-act="retry">RETRY ↻</button><button type="button" class="dbBtn" data-act="help">HOW IT WORKS</button></div>');
    }
  }
  /* ONE delegated handler for every sheet (intro · result · workshop) — no listener is ever added per sheet. */
  function sheetClick(e){
    var t = e.target.closest && e.target.closest("[data-act],[data-buy]"); if(!t || t.disabled || !run) return;
    var buyId = t.getAttribute("data-buy");
    if(buyId){ buy(buyId); return; }
    var a = t.getAttribute("data-act");
    if(a === "start"){ hideSheet(); sfx("click"); if(run.status === "intro") startRun(); else if(run.finished) retry(); }
    else if(a === "retry"){ sfx("click"); retry(); }
    else if(a === "help"){ showIntro(run.i, true); }
    else if(a === "close"){ hideSheet(); }
    else if(a === "arcade"){ closeBuilder(); }
    else if(a === "next"){
      if(run.i === 5 && run.finishedPaid){ finishLevel(); return; }
      var n = Math.min(run.i + 1, Math.min(5, daysDone())); hideSheet(); selectDay(n);
    }
  }

  /* ============================================================ workshop (Builder-only resource: parts) */
  function showWorkshop(){
    var h = '<h2>🔧 WORKSHOP</h2><p>Spend 🔩 builder parts on upgrades. Parts are earned only by clearing Builder challenges and never convert to FL OZ.</p>' +
      '<div class="dbRw"><div><span>Your parts</span><span class="g">' + store.parts + ' 🔩</span></div></div>';
    UPGRADES.forEach(function(u){
      var lv = store.up[u.id], max = lv >= 3, cost = upgradeCost(u.id), pips = "";
      for(var k = 0; k < 3; k++) pips += '<span class="' + (k < lv ? "" : "off") + '">●</span>';
      h += '<div class="dbUp"><i>' + u.icon + '</i><div><b>' + u.name + '</b>' + u.fx + '<br><span class="dbPips">' + pips + '</span> <span style="color:#8fb3c6">' + u.days + '</span><div class="dbBuild" id="dbB_' + u.id + '" hidden><u></u></div></div>' +
        '<button type="button" class="dbBtn' + (max ? "" : " pri") + '" data-buy="' + u.id + '"' + (max || store.parts < cost ? " disabled" : "") + '>' + (max ? "MAX" : cost + " 🔩") + '</button></div>';
    });
    h += '<small>Earning: the first Builder clear of each Day at each level pays 2 parts + 1 per star (3–5). Improving stars pays only the difference. Retries, refreshes and replays pay nothing extra.</small><div class="dbRow"><button type="button" class="dbBtn" data-act="close">CLOSE</button></div>';
    showSheet("shop", h);
  }
  var buying = false;
  function buy(id){
    if(buying) return;
    var u = UPGRADES.filter(function(x){ return x.id === id; })[0]; if(!u) return;
    var lv = store.up[id], cost = upgradeCost(id);
    if(lv >= 3 || store.parts < cost) return;
    buying = true;
    store.parts -= cost; store.up[id] = lv + 1; persist();        // spend + level in ONE synchronous write: a refresh mid-animation can't lose or repeat it
    sfx("build");
    var bar = $("dbB_" + id);
    if(bar){ bar.hidden = false; bar.style.setProperty("--bt", reduced() ? ".25s" : ".9s"); bar.innerHTML = "<u></u>"; }
    setTimeout(function(){
      buying = false; sfx("good"); syncChrome();
      if(sheetOpen === "shop") showWorkshop();
      if(run && run.status !== "playing") mountDay(run.i, { keepIntro:true });   // the scene is rebuilt with the new equipment (construction animation)
    }, reduced() ? 250 : 950);
  }

  /* ============================================================ day selection / mount / loop */
  var kit = { S:S, T:T, C:C, clamp:clamp, lerp:lerp, esc:esc, reduced:reduced, sfx:sfx, perf:perf, DAYS:DAYS, makeFx:makeFx };
  function api(){
    return {
      gauge:function(id, text, frac, o){
        var g = els.dbGauges.querySelector('[data-g="' + id + '"]'); if(!g) return;
        o = o || {};
        var k = text + "|" + (frac == null ? "" : frac.toFixed(2)) + "|" + (o.band ? o.band.join(",") : "") + "|" + (o.tone || "");
        if(g.__k === k) return; g.__k = k;
        g.querySelector("b").textContent = text;
        g.querySelector("u").style.width = (clamp(frac == null ? 0 : frac, 0, 1) * 100).toFixed(1) + "%";
        var s = g.querySelector("s");
        if(o.band){ s.style.left = (o.band[0] * 100).toFixed(1) + "%"; s.style.width = Math.max(1, (o.band[1] - o.band[0]) * 100).toFixed(1) + "%"; s.hidden = false; } else s.hidden = true;
        g.classList.toggle("warn", o.tone === "warn"); g.classList.toggle("good", o.tone === "good");
      },
      inspect:function(id){ if(run){ run.inspectId = id; run.inspectT = 4; sfx("tick"); updateInspect(true); } },
      say:function(msg){ toast(msg); },
      sfx:sfx,
      fx:function(){ return fx; }
    };
  }

  function skyDefs(svg, day){
    var defsEl = S("defs", null, svg), sk = DAYS[day].sky;
    var g = S("linearGradient", { id:"dbSky", x1:0, y1:0, x2:0, y2:1 }, defsEl);
    S("stop", { offset:"0", "stop-color":sk[0] }, g); S("stop", { offset:".55", "stop-color":sk[1] }, g); S("stop", { offset:"1", "stop-color":sk[2], "stop-opacity":".85" }, g);
    var w = S("linearGradient", { id:"dbWater", x1:0, y1:0, x2:0, y2:1 }, defsEl);
    S("stop", { offset:"0", "stop-color":"#6fe3ff" }, w); S("stop", { offset:"1", "stop-color":"#2a4fe0" }, w);
    var m = S("linearGradient", { id:"dbMtn", x1:0, y1:0, x2:0, y2:1 }, defsEl);
    S("stop", { offset:"0", "stop-color":"#3a3f8f" }, m); S("stop", { offset:"1", "stop-color":"#10143a" }, m);
    var gl = S("radialGradient", { id:"dbGlow", cx:".5", cy:".5", r:".5" }, defsEl);
    S("stop", { offset:"0", "stop-color":"#ff9df2", "stop-opacity":".5" }, gl); S("stop", { offset:"1", "stop-color":"#ff9df2", "stop-opacity":"0" }, gl);
    return defsEl;
  }
  function backdrop(svg, day){
    /* drawn well beyond the 360×270 viewBox so a tall phone stage is filled with sky above and ground below (nothing is letter-boxed) */
    var g = S("g", { "aria-hidden":"true", "pointer-events":"none" }, svg);
    S("rect", { x:-400, y:-700, width:1160, height:970, fill:"url(#dbSky)" }, g);
    S("circle", { cx:300, cy:46, r:60, fill:"url(#dbGlow)" }, g);
    S("circle", { cx:300, cy:46, r:11, fill:"#fff4fb", opacity:".85" }, g);
    for(var s = 0; s < 40; s++) S("circle", { cx:((s * 97 + 17) % 760) - 200, cy:((s * 61 + 9) % 420) - 330, r:s % 3 ? .7 : 1.1, fill:"#fff", opacity:.5 }, g);
    var c1 = S("g", { "class":"dbCloud" }, g); S("ellipse", { cx:70, cy:34, rx:30, ry:7, fill:"#fff", opacity:".16" }, c1); S("ellipse", { cx:92, cy:30, rx:18, ry:6, fill:"#fff", opacity:".16" }, c1);
    S("path", { d:"M-400 150L-300 96L-210 140L-100 100L-10 150L40 82L78 128L128 60L186 138L238 76L290 132L340 86L380 140L470 96L560 138L660 100L760 150V270H-400Z", fill:"url(#dbMtn)", opacity:".55" }, g);
    S("path", { d:"M-400 188L-320 140L-240 176L-130 130L-10 188L52 128L104 170L160 118L222 172L284 124L346 176L420 134L520 180L640 138L760 188V270H-400Z", fill:"#141a52", opacity:".9" }, g);
    S("path", { d:"M52 128L64 140L50 138ZM160 118L174 134L156 130ZM284 124L298 140L282 136Z", fill:"#eaf8ff", opacity:".7" }, g);
    S("rect", { x:-400, y:228, width:1160, height:700, fill:"#0a0e2c" }, g);
    for(var t = 0; t < 22; t++){ var tx = -190 + t * 31 + (t % 2) * 9; S("path", { d:"M" + tx + " 238l7 -20l7 20z", fill:"#0c2a3a", opacity:".9" }, g); }
    return g;
  }

  var lastGauges = "";
  /* ---- 3D (optional, lazy): only Day 5 has a real-time WebGL scene so far. Everything else — and every device without WebGL — keeps the SVG Days. ---- */
  var mountToken = 0, load3DP = null;
  var HAS3D = { 0:true, 1:true, 2:true, 3:true, 4:true, 5:true };
  function url3D(){ try{ var m = /[?&]b3d=(off|low|medium|high)/.exec(location.search); return m ? m[1] : ""; }catch(e){ return ""; } }
  function saveData(){ try{ return !!(navigator.connection && navigator.connection.saveData); }catch(e){ return false; } }
  function want3D(i){ return !!HAS3D[i] && store.r3d !== false && url3D() !== "off" && !saveData(); }
  function load3D(){
    if(window.DamBuilder3D) return Promise.resolve(window.DamBuilder3D);
    if(load3DP) return load3DP;
    load3DP = new Promise(function(ok, bad){
      var sc = document.createElement("script"); sc.src = "/dam-builder-3d-v2218.js"; sc.async = true;
      var to = setTimeout(function(){ bad(new Error("3D bundle timeout")); }, 20000);
      sc.onload = function(){ clearTimeout(to); window.DamBuilder3D ? ok(window.DamBuilder3D) : bad(new Error("3D bundle missing API")); };
      sc.onerror = function(){ clearTimeout(to); bad(new Error("3D bundle failed to load")); };
      document.head.appendChild(sc);
    }).catch(function(e){ load3DP = null; throw e; });
    return load3DP;
  }
  function syncViewChip(i){
    if(!els.dbView) return;
    var has = !!HAS3D[i];
    els.dbView.hidden = !has;
    if(has){ var is3 = !!(run && run.is3d); els.dbView.textContent = is3 ? "SIMPLE VIEW" : "3D VIEW"; els.dbView.setAttribute("aria-label", is3 ? "Switch to the simple 2D view" : "Switch to the 3D view"); }
  }

  function mountDay(i, o){
    o = o || {};
    if(!root) build();
    var prev = run, token = ++mountToken;
    var go3d = want3D(i) && !o.force2d;
    unmount(go3d && !!holder3D.stage);                  // moving between 3D Days keeps the one shared world alive (no rebuild)
    if(!go3d) disposeStage();
    var L = level();
    if(go3d){ mount3D(i, o, prev, token); return; }
    var factory = defs[i]; if(!factory){ warn("Day " + i + " is not registered"); return; }
    svgEl = S("svg", { viewBox:"0 0 360 270", preserveAspectRatio:"xMidYMid meet", role:"group", "aria-label":"Day " + (i + 1) + " " + DAYS[i].name + " challenge" });
    els.dbStage.insertBefore(svgEl, els.dbStage.firstChild);
    skyDefs(svgEl, i); backdrop(svgEl, i);
    sceneG = S("g", null, svgEl);
    var fxG = S("g", { "pointer-events":"none" }, svgEl);
    fx = makeFx(fxG);
    els.dbCtl.innerHTML = ""; els.dbGauges.innerHTML = "";
    var env = { level:L, up:{ bear:store.up.bear, liner:store.up.liner, act:store.up.act }, svg:sceneG, root:svgEl, ctl:els.dbCtl, api:api(), kit:kit, day:i };
    var def;
    try{ def = factory(env); }catch(e){ warn(e); toast("This challenge could not load."); return; }
    finishMount(i, def, env, o, prev, false);
    // construction animation: each top-level piece of the scene is wrapped and rises into place in sequence (a wrapper, because a CSS transform would override the piece's own SVG transform)
    if(!reduced()){
      var kids = Array.prototype.slice.call(sceneG.children);
      kids.forEach(function(kid, k){ var w = S("g", { "class":"dbBuildIn" }, sceneG); w.style.setProperty("--i", String(Math.min(k, 12))); w.appendChild(kid); });
    }
  }

  function disposeStage(){
    try{ if(holder3D.stage && window.DamBuilder3D) window.DamBuilder3D.dispose(holder3D); }catch(e){ warn(e); }
    holder3D = {}; if(canvasEl && canvasEl.parentNode) canvasEl.parentNode.removeChild(canvasEl); canvasEl = null;
  }
  function mount3D(i, o, prev, token){
    var fallback = function(why){ if(token !== mountToken || !openFlag) return; warn("3D unavailable (" + why + ") — using the simple view"); toast("3D view unavailable on this device — using the simple view."); mountDay(i, { attempts:o.attempts, keepIntro:o.keepIntro, autostart:o.autostart, force2d:true }); };
    var ld = document.createElement("div"); ld.className = "db3dLoad"; ld.innerHTML = "<i></i><span>BUILDING THE HYDRAULIC WORLD…</span>"; var reuse = !!(holder3D.stage && canvasEl);
    if(!reuse) els.dbStage.appendChild(ld);
    els.dbCtl.innerHTML = ""; els.dbGauges.innerHTML = "";
    var mk = function(D){
      var q = url3D(); if(q === "off") q = "";
      var env = { level:level(), up:{ bear:store.up.bear, liner:store.up.liner, act:store.up.act }, canvas:canvasEl, stageEl:els.dbStage, ctl:els.dbCtl, api:api(), kit:kit, day:i, quality:q || undefined, fast:!!o.autostart, holder:holder3D,
        isPlaying:function(){ return !!(run && run.status === "playing" && !sheetOpen); }, onLost:function(){ if(token === mountToken) fallback("WebGL context lost"); } };
      var def = D.create(i, env);
      if(!def){ ld.remove(); throw new Error("scene refused to build"); }
      ld.remove(); finishMount(i, def, env, o, prev, true);
    };
    load3D().then(function(D){
      if(token !== mountToken || !openFlag){ ld.remove(); return; }
      if(!D.supported()) throw new Error("no WebGL2");
      if(reuse){ mk(D); return; }
      return new Promise(function(r){ setTimeout(r, 40); }).then(function(){       // let the loading screen paint before the (synchronous) world build
        if(token !== mountToken || !openFlag){ ld.remove(); return; }
        var cv = document.createElement("canvas"); cv.className = "db3d"; cv.setAttribute("role", "img"); cv.setAttribute("aria-label", "3D scene: a mountain reservoir, dam, millpond, sluice gate, waterwheel, gears, mill and the river running to the sea");
        els.dbStage.insertBefore(cv, els.dbStage.firstChild); canvasEl = cv; mk(D);
      });
    }).catch(function(e){ ld.remove(); disposeStage(); fallback(e && e.message || e); });
  }

  /* shared by the SVG and 3D mounts: gauges, copy, run record, intro */
  function finishMount(i, def, env, o, prev, is3d){
    (def.gauges || []).forEach(function(g){ var d = document.createElement("div"); d.className = "dbG"; d.setAttribute("data-g", g.id); d.innerHTML = "<label>" + esc(g.label) + "</label><b>–</b><i><u></u><s hidden></s></i>"; els.dbGauges.appendChild(d); });
    els.dbConcept.textContent = LESSON[i].concept + ".";
    els.dbObj.textContent = def.objective || LESSON[i].obj;
    run = { i:i, def:def, is3d:is3d, status:"intro", attempts:(o.attempts != null ? o.attempts : (o.keepIntro && prev && prev.i === i ? prev.attempts : 0)), t:0, inspectId:null, inspectT:0, finished:false, finishedPaid:false };
    acc = 0; lastGauges = ""; envKeep = env;
    try{ def.draw(0); def.gauge && def.gauge(env.api); }catch(e){ warn(e); }
    syncChrome(); syncViewChip(i); updateInspect(true);
    if(o.keepIntro || o.autostart) run.status = "playing";          // rebuilt after an upgrade / retry: play (the sim stays paused while a sheet is open)
    else if(!introSeen[i]) showIntro(i, false);                      // first visit this session: concept + objective + demo first
    else run.status = "playing";
  }

  var canvasEl = null;
  function unmount(keep3d){
    if(run && run.def && run.def.destroy){ try{ run.def.destroy(); }catch(e){} }
    if(svgEl && svgEl.parentNode) svgEl.parentNode.removeChild(svgEl);
    if(!keep3d && canvasEl && canvasEl.parentNode){ canvasEl.parentNode.removeChild(canvasEl); }
    var ld = els.dbStage && els.dbStage.querySelector(".db3dLoad"); if(ld) ld.remove();
    svgEl = null; sceneG = null; fx = null; run = null; if(!keep3d) canvasEl = null;
    if(els.dbCtl){ els.dbCtl.innerHTML = ""; els.dbGauges.innerHTML = ""; }
  }

  function selectDay(i){
    if(!root || i > daysDone()) return;
    if(sheetOpen === "result" || sheetOpen === "shop") hideSheet();
    if(run && run.i === i && run.status === "playing") return;
    els.dbStage.classList.add("swap");
    setTimeout(function(){
      if(!openFlag) return;
      mountDay(i, { attempts:0 });
      els.dbStage.classList.remove("swap");
    }, reduced() ? 0 : 200);
    if(reduced()) els.dbStage.classList.remove("swap");
  }

  function startRun(){ if(!run) return; run.status = "playing"; run.t = 0; acc = 0; sfx("click"); }
  function retry(){
    var i = run ? run.i : 0, at = (run ? run.attempts : 0) + 1;
    hideSheet(); mountDay(i, { attempts:at, autostart:true });
  }

  function updateInspect(force){
    if(!run || !els.dbInspect) return;
    var el = els.dbInspect;
    if(!run.inspectId || run.inspectT <= 0){ if(el.classList.contains("on")) el.classList.remove("on"); return; }
    var info = run.def.inspect ? run.def.inspect(run.inspectId) : null;
    if(!info){ el.classList.remove("on"); return; }
    var h = "<b>" + esc(info.t) + "</b> — " + esc(info.b);
    if(force || el.__h !== h){ el.__h = h; el.innerHTML = h; }
    el.classList.add("on");
  }

  function frame(ts){
    raf = requestAnimationFrame(frame);
    if(!lastTs) lastTs = ts;
    var dt = Math.min(0.1, (ts - lastTs) / 1000); lastTs = ts;
    if(dt > 0.034){ perf.slow += dt; if(perf.slow > 2.4) perf.low = true; } else perf.slow = Math.max(0, perf.slow - dt * 0.5);
    if(!run || !run.def) return;
    if(run.status === "playing" && !sheetOpen){
      acc += dt;
      var guard = 0;
      while(acc >= TICK && guard++ < 8){
        acc -= TICK; run.t += TICK;
        try{ run.def.step(TICK); }catch(e){ warn(e); }
        var st = run.def.status();
        if(st !== "playing"){ finish(st === "success"); break; }
      }
    }
    if(run.inspectT > 0){ run.inspectT -= dt; if(run.inspectT <= 0) updateInspect(true); }
    if(run.is3d && sheetOpen && (++heavySkip % 3)) return;           // a sheet covers the scene: render it at a third of the rate
    try{ run.def.draw(dt); if(run.def.gauge) run.def.gauge(envKeep.api); if(fx) fx.update(dt); }catch(e){ warn(e); }
    if(run && run.inspectId) updateInspect(false);
  }
  function startLoop(){ if(raf) return; lastTs = 0; raf = requestAnimationFrame(frame); }
  function stopLoop(){ if(raf){ cancelAnimationFrame(raf); raf = 0; } }

  /* Deterministic advance for tests / tools: runs `seconds` of simulation without rendering. */
  function advance(seconds){
    var n = Math.round(seconds / TICK), done = 0;
    if(!run || run.status !== "playing") return false;
    for(var k = 0; k < n; k++){
      run.t += TICK; try{ run.def.step(TICK); }catch(e){ warn(e); }
      var st = run.def.status(); done++;
      if(st !== "playing"){ finish(st === "success"); return st; }
    }
    return "playing";
  }

  /* ============================================================ finish: stars, reward (through the game's own ledger), parts */
  function finish(ok){
    if(!run || run.finished) return;
    run.finished = true; run.status = ok ? "success" : "fail";
    var def = run.def, i = run.i;
    if(!ok){
      sfx("bad");
      if(fx && !reduced()) fx.burst(180, 135, 10, "#f310ba", 70);
      showResult({ ok:false, reason:def.failReason ? def.failReason() : "" });
      return;
    }
    var st = 1 + (run.attempts === 0 ? 1 : 0) + (def.efficient && def.efficient() ? 1 : 0);
    var res = commitDay(i);                                  // the ONLY reward path: the game's exactly-once awardDay ledger
    var key = level() + ":" + (i + 1), prev = store.clears[key] || 0, parts = 0;
    if(st > prev){ parts = (prev ? 0 : 2) + (st - prev); store.parts += parts; store.earned += parts; store.clears[key] = st; persist(); }
    run.finishedPaid = !!res.paid;
    sfx("good");
    if(fx && !reduced()){ fx.burst(180, 120, 22, "#2fd2ff", 95); fx.burst(180, 120, 12, "#ff9df2", 70); }
    if(svgEl && !reduced()){ var sw = S("rect", { x:0, y:0, width:360, height:270, fill:"#fff", opacity:.0, "class":"dbSweep" }, svgEl); sw.setAttribute("opacity", ".18"); setTimeout(function(){ if(sw.parentNode) sw.parentNode.removeChild(sw); }, 1200); }
    syncChrome();
    var info = { ok:true, paid:res.paid, reason:res.reason, parts:parts, stars:st }, myRun = run;
    if(def.celebrate && !reduced()){ try{ def.celebrate(); }catch(e){ warn(e); } setTimeout(function(){ if(run === myRun && openFlag) showResult(info); }, def.celebrateMs || 1500); }
    else showResult(info);
  }

  /* Day 6 cleared: hand over to the game's own level-complete flow. */
  function finishLevel(){
    var reach = gfn("reachOcean");
    closeBuilder({ keepPhase:true });
    try{ if(reach) reach(); }catch(e){ warn(e); }
  }

  /* ============================================================ open / close (mode switch) */
  function openBuilder(opts){
    opts = opts || {};
    if(!root) build();
    if(openFlag) return true;
    var s = gs();
    if(!arcadeReady()){
      var msg = (s.levelFlOz | 0) >= 6 * REWARD ? "Claim your Level Complete card in Arcade first." : "Hold on — finish what's on screen first.";
      try{ var st = gfn("showToast"); if(st) st(msg); }catch(e){}
      return false;
    }
    try{ var cw = gfn("closeAllWindows"); if(cw) cw(); }catch(e){}
    if(s.phase === "playing"){          // behave exactly like a refresh would: stop the clock, resume on a fresh clock on the next Arcade tap
      try{ var sd = gfn("stopDayTimer"); if(sd) sd(); var rd = gfn("resetDayTimer"); if(rd) rd(); }catch(e){}
      s.tapCount = 0; s.phase = "ready";
    }
    openFlag = true; root.hidden = false; applyMotion(); syncChrome();
    if(store.mode !== "builder"){ store.mode = "builder"; persist(); }
    var i = opts.day != null ? clamp(opts.day | 0, 0, daysDone()) : Math.min(daysDone(), 5);
    mountDay(i, { attempts:0 });
    startLoop(); updatePill();
    return true;
  }
  function closeBuilder(o){
    if(!openFlag) return;
    openFlag = false; mountToken++; stopLoop(); hideSheet(); unmount(); disposeStage();
    if(root) root.hidden = true;
    uiCache.days = null;
    updatePill();
    if(!(o && o.keepPhase)){
      if(store.mode !== "arcade"){ store.mode = "arcade"; persist(); }       // the player chose Arcade: the next level starts there
      try{ var s = gs(), st = gfn("showToast"); if(st && s.phase === "ready") st("Level " + (s.level | 0) + " · tap to resume Day " + Math.min(daysDone() + 1, 6)); }catch(e){}
    }
  }

  /* ============================================================ mode selector shown over Arcade */
  function buildPill(){
    if($("dbPill")) return;
    addCss();
    var p = document.createElement("div"); p.id = "dbPill"; p.className = "dbPill"; p.setAttribute("role", "tablist"); p.setAttribute("aria-label", "Game mode");
    p.innerHTML = '<button type="button" role="tab" data-mode="arcade" aria-selected="true">TAPLITES ARCADE</button><button type="button" role="tab" data-mode="builder" aria-selected="false">DAM BUILDER<em>NEW</em></button>';
    p.addEventListener("click", function(e){ var b = e.target.closest("[data-mode]"); if(b && b.getAttribute("data-mode") === "builder") openBuilder(); });
    document.body.appendChild(p);
  }
  function overlayBlocking(){
    try{
      if(window.__GEI_GAME_BOOTED__ !== true) return true;
      var sp = $("geiSplash"); if(sp && sp.offsetParent !== null && getComputedStyle(sp).display !== "none" && getComputedStyle(sp).visibility !== "hidden" && !/done|hidden|gone/.test(sp.className)) return true;
      if(window.geiWelcomeOpen === true || window.geiWowOpen === true) return true;
      var mp = $("geiDamMapPage"); if(mp && mp.classList.contains("show")) return true;
      var pa = gfn("anyPanelOpen"); if(pa && pa()) return true;
      var card = ["levelCard", "timeUpCard", "celebCard", "tribeCard", "bonusCard"].some(function(id){ var e = $(id); return e && e.classList.contains("show"); });
      if(card) return true;
      var s = gs(); if(s.phase !== "ready" && s.phase !== "playing") return true;
      if(typeof damMachine === "object" && damMachine.open) return true;
    }catch(e){}
    return false;
  }
  function updatePill(){
    var p = $("dbPill"); if(!p) return;
    p.classList.toggle("on", !openFlag && !overlayBlocking());
  }

  /* ============================================================ public API */
  window.DamBuilder = {
    version:VERSION, kit:kit,
    registerDay:function(i, factory){ if(i >= 0 && i < 6 && typeof factory === "function") defs[i] = factory; },
    open:openBuilder, close:closeBuilder, advance:advance,
    get isOpen(){ return openFlag; },
    get run(){ return run; },
    get store(){ return JSON.parse(JSON.stringify(store)); },
    get status(){ return run ? run.status : null; },
    get def(){ return run ? run.def : null; },
    selectDay:selectDay, retry:retry, start:startRun,
    _quality:perf,
    get _loop(){ return !!raf; }
  };

  /* Level hand-over. The game starts the next level with beginDay(0) while state.phase is still "redeemed" (see continueToNextLevel) and that starts the Arcade
     6-second clock. A player whose last mode was the Builder would hit a Time-Up card while reading — so, only in that case, the Builder opens straight after the
     original beginDay(0) has run (it stops that clock like a refresh would). The original function is always called first and unchanged. */
  function hookLevelStart(){
    var orig = window.beginDay;
    if(typeof orig !== "function" || orig.__db) return;
    var wrapped = function(index){
      var nextLevel = index === 0 && gs().phase === "redeemed";
      var r = orig.apply(this, arguments);
      if(nextLevel && store.mode === "builder") setTimeout(function(){ try{ openBuilder({ day:0 }); }catch(e){ warn(e); } }, 350);
      return r;
    };
    wrapped.__db = true; window.beginDay = wrapped;
  }

  function init(){
    try{ build(); buildPill(); applyMotion(); hookLevelStart(); }catch(e){ warn(e); return; }
    pillTimer = setInterval(updatePill, 800);
    updatePill();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
