/* V2.2.14 — STEM INTELLIGENCE ENGINE 🧠🌊   hydraulics · physics · engineering · experimentation
 *
 * The game teaches real STEM concepts THROUGH play, never by interrupting it:
 *
 *      PLAYER DOES SOMETHING → the game recognises the physical / engineering EVENT → a short STEM voice responds → the player learns without leaving the game
 *      EVENT → CONCEPT → VOICE      (never timer → random audio; the VISUAL happens first, the voice then names what the player just saw)
 *
 * Game code never plays an MP3 for STEM: it raises a STEM event —  StemIntelligenceEngine.trigger(STEM_EVENT.PRESSURE) — and the engine decides:
 *   · rapid events are collected for a moment and only the most educationally relevant one may speak (never four voices in a row)
 *   · a STEM cooldown (config.stemCommentaryCooldown) + a per-concept cooldown + per-day / per-level caps keep it occasional
 *   · mastery-aware: early levels teach gravity + flow, later levels add control, water level, pressure, energy, the wheel, engineering
 *   · voices wait for the shared lane (never overlap, never interrupt), are blocked during the failure cinematic / Level Complete / transition / final push
 *   · every concept can own several clips (variants) — future audio is added to EVENTS[...].variants, no game code changes
 *   · a hidden STEM MASTERY tracking layer (💧 hydraulics ⚙️ mechanics ⚡ energy 📐 engineering 🧪 experimentation 🌊 water systems) for future GEI Academy
 *     integration — it never touches XP, FL OZ, scoring or progression.
 *
 * Voice priority (smaller wins): 1 failure cinematic · 2 level complete · 3 ONE MORE · 3.5 warnings · 4 milestone · 4.5 next challenge · 4.8 STEM ·
 * 5 achievement · 6 personality · 7 reaction. STEM uses a "polite" lane request: it never interrupts or silences another voice system.
 */
(function(){
  "use strict";
  var FM = window.FlowMomentEngine;
  if(!FM || window.StemIntelligenceEngine) return;
  var VERSION = "V2.2.14";
  var CDN = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";
  var PRI = FM.priorities;
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function rand(a, b){ return a + Math.random() * (b - a); }
  function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
  function warn(e){ try{ console.warn("[STEM] " + (e && e.message || e)); }catch(_){} }
  function gs(){ try{ return (typeof state !== "undefined" && state) || {}; }catch(e){ return {}; } }
  function reduced(){ try{ return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }catch(e){ return false; } }

  /* ================================================================== EVENT TYPES */
  var STEM_EVENT = Object.freeze({
    GRAVITY: "GRAVITY", FLOW: "FLOW", PRESSURE: "PRESSURE", WATER_LEVEL: "WATER_LEVEL", GATE: "GATE", WATERWHEEL: "WATERWHEEL", ENERGY: "ENERGY",
    EXPERIMENT: "EXPERIMENT", ENGINEERING_MILESTONE: "ENGINEERING_MILESTONE", CONTROL: "CONTROL"
  });

  /* ================================================================== AUDIO LIBRARY (10 supplied clips) */
  function clip(id, text, file, extra){ var o = { id: id, text: text, url: CDN + file }; if(extra) for(var k in extra) o[k] = extra[k]; return o; }
  var CLIPS = {
    gravity:     clip("gravity",     "GRAVITY'S DOING THE WORK",        "gravity-s-doing-the-work-mTozcJJsjoREF9XO.mp3"),
    movingWater: clip("movingWater", "MOVING WATER MEANS ENERGY",       "moving-water-means-energy-4wmaHROCg8P5rkQe.mp3"),
    /* supplied as …s3ccUNTqbCHtGytU.mp3 — engine verification + automatic ".mp3t" → ".mp3" repair guard against the typo'd variant */
    moreFlow:    clip("moreFlow",    "MORE FLOW, MORE POWER",           "more-flow-more-power-s3ccUNTqbCHtGytU.mp3", { fallbacks: [CDN + "more-flow-more-power-s3ccUNTqbCHtGytU.mp3"] }),
    control:     clip("control",     "CONTROL THE FLOW",                "control-the-flow-wTrzOsfGXBde7hew.mp3"),
    pressure:    clip("pressure",    "PRESSURE BUILDS",                 "pressure-builds-lJP8KA3evIexcchQ.mp3"),
    waterLevel:  clip("waterLevel",  "WATCH THAT WATER LEVEL",          "watch-that-water-level-TIfLxeLpLH8IEDSa.mp3"),
    testLearn:   clip("testLearn",   "TEST IT. LEARN IT. IMPROVE IT.",  "test-it.-learn-it.-improve-it.-GdpXvpbNzFuCAYBN.mp3"),
    engineers:   clip("engineers",   "ENGINEERS, WE HAVE FLOW!",        "engineers-we-have-flow-gditGYCJFAqjHOuF.mp3"),
    wheel:       clip("wheel",       "THAT WHEEL IS SPINNING",          "that-wheel-is-spinning-Kzn3b6nqBouTdn7F.mp3"),
    openGate:    clip("openGate",    "OPEN THE GATE",                   "open-the-gate-upbm6rdLSjdMai0U.mp3")
  };

  /* ================================================================== CONCEPTS: event → label / category / relevance / clips (variants chosen by context) */
  var CATEGORIES = {
    HYDRAULICS:     { emoji: "💧", name: "HYDRAULICS" },     MECHANICS: { emoji: "⚙️", name: "MECHANICS" },   ENERGY: { emoji: "⚡", name: "ENERGY" },
    ENGINEERING:    { emoji: "📐", name: "ENGINEERING" },    EXPERIMENTATION: { emoji: "🧪", name: "EXPERIMENTATION" }, WATER_SYSTEMS: { emoji: "🌊", name: "WATER SYSTEMS" }
  };
  /* Add future clips to `variants` — { clip, when(ctx), weight }. The engine never repeats a variant twice in a row. */
  var EVENTS = {};
  EVENTS[STEM_EVENT.GRAVITY]     = { label: "🧠 GRAVITY",             cats: ["WATER_SYSTEMS", "ENERGY"],  relevance: 40,  unlock: 1, rarity: "common", variants: [{ clip: "gravity" }] };
  EVENTS[STEM_EVENT.FLOW]        = { label: "🌊 FLOW",                cats: ["HYDRAULICS", "ENERGY"],     relevance: 50,  unlock: 1, rarity: "common", variants: [{ clip: "movingWater", when: function(c){ return !c.strong; } }, { clip: "moreFlow", when: function(c){ return !!c.strong; } }, { clip: "movingWater", weight: .5 }] };
  EVENTS[STEM_EVENT.ENERGY]      = { label: "⚡ ENERGY",              cats: ["ENERGY", "HYDRAULICS"],     relevance: 45,  unlock: 4, rarity: "common", variants: [{ clip: "moreFlow", when: function(c){ return !!c.powered; } }, { clip: "movingWater" }] };
  EVENTS[STEM_EVENT.CONTROL]     = { label: "🚪 FLOW CONTROL",        cats: ["HYDRAULICS"],               relevance: 70,  unlock: 2, rarity: "common", variants: [{ clip: "control" }] };
  EVENTS[STEM_EVENT.GATE]        = { label: "🚪 GATE CONTROL",        cats: ["HYDRAULICS", "MECHANICS"],  relevance: 75,  unlock: 2, rarity: "common", variants: [{ clip: "openGate", when: function(c){ return c.kind !== "control"; } }, { clip: "control", when: function(c){ return c.kind === "control"; } }] };
  EVENTS[STEM_EVENT.PRESSURE]    = { label: "🔬 PRESSURE",            cats: ["HYDRAULICS"],               relevance: 60,  unlock: 3, rarity: "common", variants: [{ clip: "pressure" }] };
  EVENTS[STEM_EVENT.WATER_LEVEL] = { label: "💧 WATER LEVEL",         cats: ["WATER_SYSTEMS"],            relevance: 55,  unlock: 2, rarity: "common", variants: [{ clip: "waterLevel" }] };
  EVENTS[STEM_EVENT.WATERWHEEL]  = { label: "⚙️ MECHANICAL ENERGY",   cats: ["MECHANICS", "ENERGY"],      relevance: 80,  unlock: 3, rarity: "common", variants: [{ clip: "wheel" }] };
  EVENTS[STEM_EVENT.EXPERIMENT]  = { label: "🧪 TEST · LEARN · IMPROVE", cats: ["EXPERIMENTATION"],       relevance: 90,  unlock: 1, rarity: "signature", variants: [{ clip: "testLearn" }] };
  EVENTS[STEM_EVENT.ENGINEERING_MILESTONE] = { label: "📐 ENGINEERING", cats: ["ENGINEERING"],            relevance: 100, unlock: 2, rarity: "rare", variants: [{ clip: "engineers" }] };

  /* ================================================================== CONFIG */
  var config = {
    enabled: true,
    rng: null,
    dryRun: false,                              // tests: decide + log, no sound, no visual
    visuals: true,
    requirePlaying: true,
    stemCommentaryCooldown: 14000,              // after ANY STEM voice, gameplay breathes this long
    conceptCooldown: 55000,                     // the same concept is not re-taught straight away
    windowMs: 320,                              // events inside this window compete: ONLY the most educationally relevant one may speak
    minGapAfterVoiceMs: 1000,                   // quiet beat after any other voice
    holdMs: 1800,                               // a due line may wait this long for the shared lane, never interrupts
    leadMs: 380,                                // OBSERVE → HEAR: the visual starts first, the voice follows
    maxPerDay: 1, maxPerLevel: 4,
    minRemMs: 2200,                             // silent in the last seconds of the clock
    repeatDecay: .35,                           // the more often a concept has been heard, the less often it is repeated
    chance: { common: .9, signature: 1, rare: .6 },
    unlockLevel: {},                            // per-event override of EVENTS[ev].unlock (mastery pacing); { PRESSURE: 1 } makes it available from level 1
    mastery: { heardPoints: 3, seenPoints: 1, stages: [[0, "OBSERVER"], [12, "OPERATOR"], [30, "TECHNICIAN"], [60, "ENGINEER"], [100, "MASTER"]] }
  };
  var SE = { version: VERSION, config: config, EVENT: STEM_EVENT, events: EVENTS, clips: CLIPS, categories: CATEGORIES };
  function rng(){ return (config.rng || Math.random)(); }

  /* ================================================================== STATE + MASTERY (tracking layer only) */
  var S = { q: [], flushT: 0, lastAt: -1e9, lastByEvent: {}, lastVariant: {}, heard: {}, perLevel: {}, perDay: 0, level: "", day: { fired: {} }, log: [], retryPending: false, recoverPending: false,
    engineerPending: false, pend: null, pendT: 0, heardLevel: {}, timers: [] };
  var MKEY = "geiStemMasteryV1", mastery = { cats: {}, events: {}, total: 0 };
  try{ var m0 = JSON.parse(localStorage.getItem(MKEY) || "null"); if(m0 && m0.cats) mastery = m0; }catch(e){}
  Object.keys(CATEGORIES).forEach(function(k){ if(!mastery.cats[k]) mastery.cats[k] = { seen: 0, heard: 0, points: 0 }; });
  function saveMastery(){ try{ localStorage.setItem(MKEY, JSON.stringify(mastery)); }catch(e){} }
  function stageFor(total){ var st = config.mastery.stages, name = st[0][1], next = null; for(var i = 0; i < st.length; i++){ if(total >= st[i][0]){ name = st[i][1]; next = st[i + 1] || null; } } return { name: name, next: next ? next[1] : null, toNext: next ? next[0] - total : 0 }; }
  function credit(ev, heard){
    var def = EVENTS[ev]; if(!def) return;
    var pts = heard ? config.mastery.heardPoints : config.mastery.seenPoints;
    def.cats.forEach(function(c){ var m = mastery.cats[c] || (mastery.cats[c] = { seen: 0, heard: 0, points: 0 }); if(heard) m.heard++; else m.seen++; m.points += pts; });
    var e = mastery.events[ev] || (mastery.events[ev] = { seen: 0, heard: 0 }); if(heard) e.heard++; else e.seen++;
    mastery.total += pts; saveMastery();
    try{ window.dispatchEvent(new CustomEvent("gei:stem-mastery", { detail: SE.mastery() })); }catch(err){}
  }
  SE.mastery = function(){ var cats = {}; Object.keys(CATEGORIES).forEach(function(k){ var m = mastery.cats[k] || { seen: 0, heard: 0, points: 0 }; cats[k] = { emoji: CATEGORIES[k].emoji, name: CATEGORIES[k].name, seen: m.seen, heard: m.heard, points: m.points }; });
    return { total: mastery.total, stage: stageFor(mastery.total), categories: cats, events: JSON.parse(JSON.stringify(mastery.events)) }; };
  SE.resetMastery = function(){ mastery = { cats: {}, events: {}, total: 0 }; Object.keys(CATEGORIES).forEach(function(k){ mastery.cats[k] = { seen: 0, heard: 0, points: 0 }; }); S.heard = {}; saveMastery(); };

  /* ================================================================== VISUALS (the visual happens FIRST) */
  var css = [
".stemPill{position:absolute;left:50%;top:7%;max-width:92%;display:flex;flex-direction:column;align-items:center;gap:2px;padding:.4em 1em .45em;border-radius:16px;background:linear-gradient(135deg,rgba(14,60,140,.88),rgba(10,30,90,.88));border:1.5px solid rgba(150,225,255,.7);box-shadow:0 0 18px rgba(80,190,255,.55);opacity:0;transform:translate3d(-50%,-14px,0);animation:stemPillIn var(--d,2200ms) cubic-bezier(.2,.9,.25,1) forwards;pointer-events:none;will-change:transform,opacity;color:#fff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-align:center}",
".stemPillL{font:1000 clamp(.82rem,3.9vw,1.1rem)/1 system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-shadow:0 0 10px rgba(120,210,255,.9)}",
".stemPillS{font:800 clamp(.62rem,2.8vw,.8rem)/1.1 system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#bfeaff}",
".stemPill.rare{border-color:#ffe27a;box-shadow:0 0 24px rgba(255,214,90,.75)}.stemPill.rare .stemPillL{text-shadow:0 0 12px rgba(255,214,90,.95)}",
"@keyframes stemPillIn{0%{opacity:0;transform:translate3d(-50%,-14px,0) scale(.8)}12%{opacity:1;transform:translate3d(-50%,0,0) scale(1.06)}20%{transform:translate3d(-50%,0,0) scale(1)}86%{opacity:1;transform:translate3d(-50%,0,0)}100%{opacity:0;transform:translate3d(-50%,-8px,0)}}",
".stemGate{position:absolute;pointer-events:none;overflow:hidden;border-radius:8px;opacity:0;transition:opacity .3s;--open:0}",
".stemGate.on{opacity:1}.stemGate i{position:absolute;top:0;bottom:30%;width:50%;background:linear-gradient(180deg,#9fb2c8,#5f7390);border:1px solid rgba(255,255,255,.55);transition:transform .45s cubic-bezier(.3,1.2,.4,1)}",
".stemGate i.l{left:0;transform:translate3d(calc(var(--open) * -96%),0,0)}.stemGate i.r{right:0;transform:translate3d(calc(var(--open) * 96%),0,0)}",
".stemGate b{position:absolute;left:30%;right:30%;bottom:0;height:34%;background:linear-gradient(180deg,rgba(150,225,255,.9),rgba(60,160,255,.5));opacity:calc(var(--open) * 1);transform:scaleY(calc(.3 + var(--open) * .7));transform-origin:50% 0;transition:opacity .4s,transform .5s}",
".stemGauge{position:absolute;left:7px;width:22px;pointer-events:none;border-radius:11px;background:rgba(0,20,60,.55);border:1.5px solid rgba(150,225,255,.7);overflow:hidden;opacity:0;transition:opacity .3s}.stemGauge.on{opacity:1}",
".stemGauge i{position:absolute;left:0;right:0;bottom:0;height:calc(var(--lv,0) * 100%);background:linear-gradient(180deg,#8fe0ff,#2a8cff);transition:height .45s cubic-bezier(.3,1.2,.4,1)}",
".stemGauge span{position:absolute;left:50%;top:-18px;transform:translateX(-50%);font:900 .62rem/1 system-ui,sans-serif;letter-spacing:.06em;color:#bfeaff;white-space:nowrap}",
".station .body.stemSpin1{animation:fmeSpin 1.1s linear infinite!important;transform-box:fill-box;transform-origin:50% 50%}",
".station .body.stemSpin2{animation:fmeSpin .6s linear infinite!important;transform-box:fill-box;transform-origin:50% 50%}",
".station .body.stemSpin3{animation:fmeSpin .34s linear infinite!important;transform-box:fill-box;transform-origin:50% 50%}",
"@media (prefers-reduced-motion:reduce){.stemPill{animation:fmeCoFade var(--d,2200ms) linear forwards!important}.stemGate i,.stemGate b,.stemGauge i{transition:none}.station .body.stemSpin1,.station .body.stemSpin2,.station .body.stemSpin3{animation:none!important}}"
  ].join("\n");
  function addCss(){ if(document.getElementById("stemStyle")) return; var s = document.createElement("style"); s.id = "stemStyle"; s.textContent = css; document.head.appendChild(s); }
  function later(fn, ms){ var id = setTimeout(function(){ var i = S.timers.indexOf(id); if(i >= 0) S.timers.splice(i, 1); try{ fn(); }catch(e){ warn(e); } }, Math.max(0, ms)); S.timers.push(id); return id; }
  function stationBody(i){ return document.querySelector('#stationsGroup .station[data-index="' + i + '"] .body'); }
  function hostRect(host){ var r = host.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; }
  var pillEl = null, pillT = 0;
  function pill(def, text, rare){
    try{
      var host = FM.fx.top(); if(!host) return; addCss(); if(pillEl && pillEl.parentNode) pillEl.parentNode.removeChild(pillEl);
      var el = document.createElement("div"); el.className = "stemPill" + (rare ? " rare" : ""); el.style.setProperty("--d", (rare ? 2800 : 2200) + "ms");
      el.innerHTML = "<div class='stemPillL'></div><div class='stemPillS'></div>"; el.querySelector(".stemPillL").textContent = def.label; el.querySelector(".stemPillS").textContent = text;
      host.appendChild(el); pillEl = el; clearTimeout(pillT); pillT = setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); if(pillEl === el) pillEl = null; }, (rare ? 2800 : 2200) + 150);
    }catch(e){ warn(e); }
  }
  function overlayAt(body, cls){
    var host = FM.fx.top(); if(!host || !body) return null; addCss(); var hr = hostRect(host), r = body.getBoundingClientRect();
    var el = document.createElement("div"); el.className = cls; el.style.left = (r.left - hr.l + r.width * .12) + "px"; el.style.top = (r.top - hr.t + r.height * .1) + "px"; el.style.width = r.width * .76 + "px"; el.style.height = r.height * .8 + "px";
    host.appendChild(el); return el;
  }
  var V = { gate: null, gauge: null, wheel: 0, wheelT: 0 };
  var visuals = {
    gate: function(ratio){                                       // the gate visibly opens as the player works it
      var body = stationBody(3); if(!body) return;
      if(!V.gate || !V.gate.parentNode){ V.gate = overlayAt(body, "stemGate"); if(!V.gate) return; V.gate.innerHTML = "<i class='l'></i><i class='r'></i><b></b>"; void V.gate.offsetWidth; }
      V.gate.classList.add("on"); V.gate.style.setProperty("--open", String(clamp(ratio, 0, 1)));
    },
    gauge: function(ratio){                                      // the reservoir level is shown as a gauge: observe + measure
      var host = FM.fx.top(); if(!host) return; addCss(); var hr = hostRect(host);
      if(!V.gauge || !V.gauge.parentNode){ var g = document.createElement("div"); g.className = "stemGauge"; g.innerHTML = "<span>💧 LEVEL</span><i></i>"; g.style.top = Math.round(hr.h * .3) + "px"; g.style.height = Math.round(clamp(hr.h * .28, 70, 130)) + "px"; host.appendChild(g); V.gauge = g; void g.offsetWidth; }
      V.gauge.classList.add("on"); V.gauge.style.setProperty("--lv", String(clamp(ratio, 0, 1)));
    },
    wheel: function(speed){                                      // the wheel begins to spin, then accelerates
      var b = stationBody(4); if(!b) return; ["stemSpin1", "stemSpin2", "stemSpin3"].forEach(function(c){ b.classList.remove(c); }); if(!reduced()) b.classList.add("stemSpin" + clamp(speed, 1, 3)); V.wheel = speed;
    },
    pressure: function(){ var b = stationBody(1); if(!b || reduced()) return; b.classList.add("fmeShake1"); later(function(){ b.classList.remove("fmeShake1"); }, 1300); var d = FM.fx.damPoint(); FM.fx.burst(d.x, d.y, 8, { cls: "bub", spread: 70, up: 40, fall: 10 }); },
    glow: function(){ var b = stationBody(5); if(!b || reduced()) return; b.classList.add("fmeGlow"); later(function(){ b.classList.remove("fmeGlow"); }, 1700); },
    fall: function(){ var b = stationBody(0); if(!b) return; var box = FM.fx.box(), br = b.getBoundingClientRect(); FM.fx.burst(br.left - box.l + br.width / 2, br.top - box.t + br.height * .6, 8, { cls: "foam", spread: 30, up: -20, fall: 150, min: 4, max: 8, durMin: 700, durMax: 1100 }); },
    ring: function(){ var d = FM.fx.damPoint(); FM.fx.ring(d.x, d.y); },
    drops: function(){ var d = FM.fx.damPoint(); FM.fx.burst(d.x, d.y, 6, { spread: 80, up: 30, fall: 60 }); }
  };
  function clearVisuals(keep){
    if(V.gate){ var g = V.gate; V.gate = null; g.classList.remove("on"); setTimeout(function(){ if(g.parentNode) g.parentNode.removeChild(g); }, 400); }
    if(V.gauge){ var q = V.gauge; V.gauge = null; q.classList.remove("on"); setTimeout(function(){ if(q.parentNode) q.parentNode.removeChild(q); }, 400); }
    clearTimeout(V.wheelT); var b = stationBody(4); if(b) ["stemSpin1", "stemSpin2", "stemSpin3"].forEach(function(c){ b.classList.remove(c); }); V.wheel = 0;
  }

  /* ================================================================== DECISION */
  function level(){ return gs().level | 0 || 1; }
  function unlockOf(ev){ var o = config.unlockLevel[ev]; return o != null ? o : EVENTS[ev].unlock; }
  function blocked(c){
    var fs = FM.state(); if(fs.cinematic || fs.levelComplete || fs.cardShown || fs.transition) return "critical";
    var st = gs(); if(config.requirePlaying && st.phase && st.phase !== "playing" && !c.afterDay && !c.force) return "phase";
    if(!c.afterDay && !c.force){ if(fs.flowLevel >= 4) return "final-push"; if(c.remMs != null && c.remMs < config.minRemMs) return "clock"; if(fs.pressure && fs.pressure.on && fs.pressure.stage >= 2) return "pressure"; }
    return "";
  }
  function pickVariant(ev, ctx, r){
    var def = EVENTS[ev], list = def.variants.filter(function(v){ return !v.when || v.when(ctx); });
    if(!list.length) list = def.variants.slice();
    var prev = S.lastVariant[ev]; var f = list.filter(function(v){ return v.clip !== prev; }); if(f.length) list = f;
    var tot = 0; list.forEach(function(v){ tot += v.weight || 1; }); var x = r() * tot;
    for(var i = 0; i < list.length; i++){ x -= list[i].weight || 1; if(x < 0) return list[i]; }
    return list[list.length - 1];
  }
  function score(c){
    var def = EVENTS[c.event], heard = S.heard[c.event] || 0, novelty = 1 / (1 + heard * config.repeatDecay), recent = now() - (S.lastByEvent[c.event] || -1e9) < config.conceptCooldown ? .3 : 1;
    return def.relevance * (.6 + .4 * novelty) * recent * (c.ctx.boost || 1);
  }
  function restOk(c, t){
    var ctx = c.ctx;
    if(t - S.lastAt < config.stemCommentaryCooldown) return "cooldown";
    if(t - (S.lastByEvent[c.event] || -1e9) < config.conceptCooldown && !ctx.major) return "concept";
    if(level() < unlockOf(c.event) && !ctx.force) return "locked";
    var lv = S.perLevel[S.level] || 0; if(lv >= config.maxPerLevel && !ctx.major) return "level-cap";
    if(S.perDay >= config.maxPerDay && !ctx.afterDay && !ctx.major && !ctx.force) return "day-cap";
    return "";
  }
  function wowNear(){ try{ var w = window.RareWowMomentEngine; return !!(w && w.active()); }catch(e){ return false; } }      // a WOW on stage: STEM waits its turn (held), never talks over it
  function voiceFree(){ return !wowNear() && !FM.voiceBusy() && !FM.fx.othersSpeaking() && FM.fx.sinceVoice() >= config.minGapAfterVoiceMs; }

  /* trigger(event, ctx) — the ONE entry point. Game code raises STEM events; it never plays an MP3 itself. */
  SE.trigger = function(event, ctx){
    try{
      if(!EVENTS[event]) return false; ctx = ctx || {};
      if(ctx.ts == null) ctx.ts = now();
      credit(event, false);                                                    // the player SAW the physics (mastery tracking only)
      S.q.push({ event: event, ctx: ctx, at: ctx.ts });
      if(config.windowMs <= 0){ flush(); return true; }
      if(!S.flushT) S.flushT = setTimeout(flush, config.windowMs);
      return true;
    }catch(e){ warn(e); return false; }
  };
  /* flush: events that arrived within windowMs compete — only the most educationally relevant one may speak, the rest are suppressed (logged) */
  function flush(){
    S.flushT = 0; var q = S.q; S.q = []; if(!q.length) return null;
    q.forEach(function(c){ if(c.ctx.visual && config.visuals && !config.dryRun && !c.ctx.silent) runVisual(c); });
    var voiced = q.filter(function(c){ return !c.ctx.silent; }); if(!voiced.length) return null;
    voiced.sort(function(a, b){ return score(b) - score(a); });
    var best = voiced[0], sup = voiced.slice(1).map(function(c){ return c.event; });
    return consider(best, sup);
  }
  function runVisual(c){ var v = visuals[c.ctx.visual]; try{ v && v(c.ctx.ratio != null ? c.ctx.ratio : c.ctx.speed); }catch(e){ warn(e); } }
  function consider(c, suppressed){
    var ctx = c.ctx, t = ctx.ts, why = blocked(ctx) || restOk(c, t);
    if(why){ S.log.push({ event: c.event, spoke: false, skipped: why, suppressed: suppressed, t: t }); trim(); return false; }
    var def = EVENTS[c.event], heard = S.heard[c.event] || 0, p = (config.chance[def.rarity] == null ? .9 : config.chance[def.rarity]) / (1 + heard * config.repeatDecay * (def.rarity === "signature" ? .2 : 1));
    if(!(ctx.force || rng() < p)){ S.log.push({ event: c.event, spoke: false, skipped: "chance", suppressed: suppressed, t: t }); trim(); return false; }
    var v = pickVariant(c.event, ctx, rng);
    if(!voiceFree()){ if(config.dryRun){ S.log.push({ event: c.event, spoke: false, skipped: "busy", suppressed: suppressed, t: t }); trim(); return false; } hold({ c: c, v: v, suppressed: suppressed, until: now() + config.holdMs }); return "held"; }
    return perform(c, v, suppressed);
  }
  function hold(h){
    S.pend = h; clearTimeout(S.pendT);
    (function again(){
      S.pendT = setTimeout(function(){
        var q = S.pend; if(!q) return; if(now() > q.until){ S.pend = null; S.log.push({ event: q.c.event, spoke: false, skipped: "expired", suppressed: q.suppressed, t: now() }); trim(); return; }
        if(blocked(q.c.ctx) || restOk(q.c, now())){ S.pend = null; return; }
        if(!voiceFree()) return again();
        S.pend = null; perform(q.c, q.v, q.suppressed);
      }, 250);
    })();
  }
  function trim(){ if(S.log.length > 80) S.log.shift(); }
  function perform(c, v, suppressed){
    var def = EVENTS[c.event], clipObj = CLIPS[v.clip], t = c.ctx.ts, ev = c.event, ctx = c.ctx;
    S.lastAt = t; S.lastByEvent[ev] = t; S.lastVariant[ev] = v.clip; S.heard[ev] = (S.heard[ev] || 0) + 1; S.perDay++; S.perLevel[S.level] = (S.perLevel[S.level] || 0) + 1; S.heardLevel[ev] = true;
    var entry = { event: ev, clip: v.clip, text: clipObj.text, spoke: false, suppressed: suppressed, rarity: def.rarity, t: t }; S.log.push(entry); trim();
    credit(ev, true);
    if(config.dryRun) return entry;
    /* OBSERVE → HEAR: the label + visual come first, the voice names what the player just saw */
    try{ pill(def, clipObj.text, def.rarity === "rare"); }catch(e){}
    later(function(){
      var mine = FM.say(clipObj.url, { pri: PRI.stem, polite: true, maxMs: 4200, label: "stem:" + clipObj.id, fallbacks: clipObj.fallbacks });
      mine.then(function(ok){ entry.spoke = !!ok; });
    }, ctx.visual && config.visuals ? config.leadMs : 120);
    return entry;
  }

  /* ================================================================== WATCHING THE GAME (event → concept) */
  function dayKey(){ return gs().level + ":" + gs().currentStep; }
  function fireOnce(key, event, ctx){ if(S.day.fired[key]) return false; S.day.fired[key] = 1; ctx = ctx || {}; return SE.trigger(event, ctx); }
  function onTap(d){
    var st = gs(); S.level = String(st.level || 0);
    var idx = d.index | 0, req = d.required || 6, done = req - (d.remaining | 0), ratio = clamp(done / req, 0, 1), base = { ts: d.ts, remMs: d.remMs };
    function ctx(extra){ var o = { ts: d.ts, remMs: d.remMs }; for(var k in extra) o[k] = extra[k]; return o; }
    if(S.retryPending && done === 1){ S.retryPending = false; SE.trigger(STEM_EVENT.EXPERIMENT, ctx({ retry: true, boost: 1.1 })); }      // failure → observation → adjustment: the retry itself
    if(idx === 0){
      if(done >= Math.min(2, req)) fireOnce("flow", STEM_EVENT.FLOW, ctx({ strong: false, visual: "drops" }));
    }else if(idx === 1){
      if(ratio >= .5) fireOnce("pressure", STEM_EVENT.PRESSURE, ctx({ visual: "pressure" }));
    }else if(idx === 2){
      if(config.visuals && !config.dryRun) visuals.gauge(ratio);
      if(ratio >= .5) fireOnce("level", STEM_EVENT.WATER_LEVEL, ctx({ ratio: ratio, visual: "gauge" }));
    }else if(idx === 3){
      if(config.visuals && !config.dryRun) visuals.gate(ratio);
      if(ratio >= .34) fireOnce("gate", STEM_EVENT.GATE, ctx({ kind: "open", ratio: ratio, visual: "gate" }));
    }else if(idx === 4){
      if(done === 1){ S.day.fired.wheel1 = 1; SE.trigger(STEM_EVENT.WATERWHEEL, ctx({ phase: "start", speed: 1, visual: "wheel" })); }
      else if(ratio >= .5 && !S.day.fired.wheel2){ S.day.fired.wheel2 = 1; if(config.visuals && !config.dryRun) visuals.wheel(ratio >= .84 ? 3 : 2); SE.trigger(STEM_EVENT.WATERWHEEL, ctx({ phase: "accelerate", silent: true })); }
    }else if(idx === 5){
      if(ratio >= .5) fireOnce("energy", STEM_EVENT.ENERGY, ctx({ powered: true, visual: "glow" }));
    }
    if((d.streak | 0) >= 7) fireOnce("flowStrong", STEM_EVENT.FLOW, ctx({ strong: true, visual: "drops" }));
    if(S.engineerPending && done === 1 && idx === 0){ S.engineerPending = false; SE.trigger(STEM_EVENT.ENGINEERING_MILESTONE, ctx({ major: true, afterDay: true, visual: "ring" })); }
  }
  function onDay(d){
    var idx = d.index | 0, left = d.remMs | 0, ctx = function(extra){ var o = { ts: d.ts, afterDay: true, remMs: d.remMs }; for(var k in extra) o[k] = extra[k]; return o; };
    if(idx === 0) fireOnce("gravity", STEM_EVENT.GRAVITY, ctx({ visual: "fall" }));
    if(idx === 3 && !S.heardLevel[STEM_EVENT.GATE]) fireOnce("control", STEM_EVENT.GATE, ctx({ kind: "control", visual: "ring" }));
    if(idx === 4){ if(config.visuals && !config.dryRun) visuals.wheel(3); clearTimeout(V.wheelT); V.wheelT = setTimeout(clearVisuals, 1800); }
    if(idx === 5) fireOnce("energyDone", STEM_EVENT.ENERGY, ctx({ powered: true, visual: "glow" }));
    if(S.recoverPending){ S.recoverPending = false; SE.trigger(STEM_EVENT.EXPERIMENT, ctx({ recovery: true, boost: 1.2 })); }                    // failure → success: improvement
    else if(left > 1200 && left < 2200 && !d.closeCall) SE.trigger(STEM_EVENT.EXPERIMENT, ctx({ clutch: true }));                                     // a difficult sequence completed
    if(idx === 3 || idx === 2) setTimeout(clearVisuals, 900);
    S.perDay = 0;
  }
  function onFail(){ clearVisuals(); S.recoverPending = true; S.retryPending = true; S.day = { fired: {} }; S.q = []; }
  function onLevel(d){
    clearVisuals(); var p = d.perf || {};
    S.engineerPending = !!(p.first || (p.maxCombo >= 16 && !(p.fails > 0)) || ((p.level | 0) > 0 && (p.level | 0) % 6 === 0 && (p.fails | 0) <= 1));
    S.heardLevel = {}; S.perLevel = {};
  }
  function onStart(){ clearVisuals(); S.day = { fired: {} }; S.perDay = 0; S.level = String(gs().level || 0); }
  window.addEventListener("gei:flow-event", function(e){
    try{ var d = e.detail || {}; if(!config.enabled) return; if(d.type === "tap") onTap(d); else if(d.type === "day") onDay(d); else if(d.type === "fail") onFail(d); else if(d.type === "level") onLevel(d); else if(d.type === "start") onStart(d); }catch(err){ warn(err); }
  });
  SE.onEvent = function(type, d){ d = d || {}; if(type === "tap") return onTap(d); if(type === "day") return onDay(d); if(type === "fail") return onFail(d); if(type === "level") return onLevel(d); if(type === "start") return onStart(d); };
  /* the personality layer asks: will STEM speak about this recovery / retry itself? (then personality stays out of its way) */
  SE.claimed = function(){ if(!config.enabled || !(S.recoverPending || S.retryPending)) return false; if(level() < unlockOf(STEM_EVENT.EXPERIMENT)) return false; return now() - S.lastAt >= config.stemCommentaryCooldown; };
  SE.flush = function(){ clearTimeout(S.flushT); return flush(); };
  SE.state = function(){ return { lastAt: S.lastAt, heard: JSON.parse(JSON.stringify(S.heard)), perDay: S.perDay, perLevel: JSON.parse(JSON.stringify(S.perLevel)), log: S.log.slice(), retryPending: S.retryPending, recoverPending: S.recoverPending, engineerPending: S.engineerPending, held: !!S.pend, queued: S.q.length, wheel: V.wheel, gate: !!V.gate, gauge: !!V.gauge }; };
  SE.reset = function(){ clearTimeout(S.flushT); S.flushT = 0; clearTimeout(S.pendT); S.pend = null; S.q = []; S.lastAt = -1e9; S.lastByEvent = {}; S.lastVariant = {}; S.heard = {}; S.perDay = 0; S.perLevel = {}; S.day = { fired: {} }; S.log = []; S.retryPending = false; S.recoverPending = false; S.engineerPending = false; S.heardLevel = {}; clearVisuals(); };
  SE.showLabel = function(event){ var d = EVENTS[event]; if(d) pill(d, CLIPS[d.variants[0].clip].text, d.rarity === "rare"); return !!d; };

  /* ================================================================== AUDIO VERIFICATION — no broken reference is left silently in production */
  var diag = {};
  function fix(u){ return u.replace(/\.mp3t$/i, ".mp3"); }
  function probe(url){
    return new Promise(function(res){
      var a = new Audio(), done = false; a.preload = "metadata";
      function fin(ok, why){ if(done) return; done = true; clearTimeout(t); try{ a.onloadedmetadata = a.onerror = null; a.removeAttribute("src"); a.load(); }catch(e){} res({ ok: ok, why: why || "" }); }
      var t = setTimeout(function(){ fin(false, "timeout"); }, 7000);
      a.onloadedmetadata = function(){ fin(true); }; a.onerror = function(){ fin(false, "error"); }; try{ a.src = url; }catch(e){ fin(false, "exception"); }
    });
  }
  /* verify(): probes every clip. A URL that fails is repaired when its ".mp3t" → ".mp3" (or an explicit fallback) variant loads; anything still broken is reported loudly. */
  SE.verify = function(){
    var ids = Object.keys(CLIPS);
    return Promise.all(ids.map(function(id){
      var c = CLIPS[id], tried = [c.url].concat(c.fallbacks || []); var f = fix(c.url); if(tried.indexOf(f) < 0) tried.push(f);
      return (function next(i){
        if(i >= tried.length){ diag[id] = { url: c.url, ok: false, tried: tried }; warn("STEM clip '" + id + "' could not be loaded: " + c.url); try{ window.dispatchEvent(new CustomEvent("gei:audio-broken", { detail: { url: c.url, id: id } })); }catch(e){} return { id: id, ok: false }; }
        return probe(tried[i]).then(function(r){ if(r.ok){ var repaired = i > 0; if(repaired){ c.url = tried[i]; warn("STEM clip '" + id + "' repaired → " + tried[i]); } diag[id] = { url: c.url, ok: true, repaired: repaired }; return { id: id, ok: true, repaired: repaired }; } return next(i + 1); });
      })(0);
    })).then(function(results){ SE.lastVerify = results; return results; });
  };
  SE.diagnostics = function(){ return JSON.parse(JSON.stringify(diag)); };
  try{ if(!(navigator.connection && navigator.connection.saveData)) (window.requestIdleCallback || function(f){ return setTimeout(f, 4000); })(function(){ SE.verify(); }, { timeout: 9000 }); }catch(e){}

  window.STEM_EVENT = STEM_EVENT; window.StemIntelligenceEngine = SE;
})();
