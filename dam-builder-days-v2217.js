/* V2.2.17 — DAM BUILDER: the six Day models + scenes.   (loaded after dam-builder-v2217.js)
 *
 * One factory per Day. Each is a small DETERMINISTIC model stepped at a fixed 20 Hz tick (step(dt)) plus a presentation layer (draw(dt)).
 * The model never touches game progress: it only reports status() = "playing" | "success" | "fail". The shell (dam-builder-v2217.js) decides what a
 * success is worth — through the game's own awardDay ledger.
 *
 * Simplified teaching physics (NOT an engineering tool):
 *   Day 1  water splits at forks and follows the open channel
 *   Day 2  hydrostatic pressure grows with depth → needed wall thickness grows toward the base
 *   Day 3  level change = inflow − outflow (a buffer)
 *   Day 4  flow ≈ gate opening × √head
 *   Day 5  wheel power ≈ efficiency × flow; a machine runs when power ≥ its demand; rpm ∝ flow
 *   Day 6  Spring → Reservoir → Gate → Wheel → machines, all of the above together
 * Difficulty rises with the player's level through layouts, equipment, constraints and time — never by changing the six-Day structure.
 */
(function(){
  "use strict";
  var B = window.DamBuilder;
  if(!B || B.__days) return;
  B.__days = true;
  var K = B.kit, S = K.S, T = K.T, C = K.C, clamp = K.clamp, lerp = K.lerp;

  /* ------------------------------------------------------------ shared helpers */
  function fmt(v, d){ return v.toFixed(d == null ? 1 : d); }
  function motion(){ return !K.reduced(); }
  function eq(el, id, label, api, fn){
    el.setAttribute("data-eq", id); el.setAttribute("tabindex", "0"); el.setAttribute("role", "button"); el.setAttribute("aria-label", label);
    el.addEventListener("click", function(){ if(fn) fn(); api.inspect(id); });
    el.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); if(fn) fn(); api.inspect(id); } });
  }
  function button(ctl, label, cls, fn){
    var b = document.createElement("button"); b.type = "button"; b.className = "dbBtn" + (cls ? " " + cls : ""); b.textContent = label; b.addEventListener("click", fn); ctl.appendChild(b); return b;
  }
  function slider(ctl, label, min, max, step, val, onInput, fmtFn){
    var w = document.createElement("div"); w.className = "dbSl";
    var id = "dbS" + Math.random().toString(36).slice(2, 7);
    w.innerHTML = '<label for="' + id + '">' + label + '</label><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output></output>';
    var inp = w.querySelector("input"), out = w.querySelector("output");
    function sync(){ out.textContent = fmtFn ? fmtFn(+inp.value) : inp.value; }
    inp.addEventListener("input", function(){ sync(); onInput(+inp.value); });
    sync(); ctl.appendChild(w);
    return { input:inp, set:function(v){ inp.value = v; sync(); } };
  }
  function wave(x0, x1, y, t, amp, bottom){
    var d = "M" + x0 + " " + bottom + "L" + x0 + " " + fmt(y + Math.sin(t) * amp), n = 8, w = (x1 - x0) / n;
    for(var i = 1; i <= n; i++) d += "L" + fmt(x0 + w * i, 1) + " " + fmt(y + Math.sin(t + i * 0.9) * amp);
    return d + "L" + x1 + " " + bottom + "Z";
  }
  /* animated water channel: dark bed + translucent body (width ∝ flow) + moving dashes (speed ∝ flow). Reduced motion → solid body, no dashes. */
  function channel(parent, d, w){
    var ch = { off:0, w:w };
    ch.bed = S("path", { d:d, fill:"none", stroke:"#0b1030", "stroke-width":w + 4, "stroke-linecap":"round", "stroke-linejoin":"round" }, parent);
    ch.body = S("path", { d:d, fill:"none", stroke:"#2fd2ff", "stroke-width":0, opacity:0, "stroke-linecap":"round", "stroke-linejoin":"round" }, parent);
    ch.dash = S("path", { d:d, fill:"none", stroke:"#dff9ff", "stroke-width":0, opacity:0, "stroke-linecap":"round", "stroke-dasharray":"2 12" }, parent);
    ch.set = function(q, qmax, dt, speed){
      var f = clamp(q / qmax, 0, 1), on = f > 0.004, sw = on ? 1.6 + (w - 1.6) * Math.sqrt(f) : 0;
      ch.body.setAttribute("stroke-width", fmt(sw, 2)); ch.body.setAttribute("opacity", on ? ".8" : "0");
      if(motion()){
        ch.dash.setAttribute("stroke-width", fmt(sw * 0.45, 2)); ch.dash.setAttribute("opacity", on ? ".9" : "0");
        ch.off -= (10 + 70 * f) * (speed || 1) * dt; ch.dash.setAttribute("stroke-dashoffset", fmt(ch.off, 1));
      } else ch.dash.setAttribute("opacity", "0");
    };
    return ch;
  }
  function wheelGfx(parent, cx, cy, r, bear){
    var g = S("g", { transform:"translate(" + cx + " " + cy + ")" }, parent), rot = S("g", null, g), n = 8 + bear * 2, i;
    S("circle", { r:r, fill:"none", stroke:"#8a5a30", "stroke-width":3 }, rot);
    S("circle", { r:r - 7, fill:"none", stroke:"#6b4423", "stroke-width":1.5 }, rot);
    for(i = 0; i < n; i++){
      var a = i * 360 / n;
      S("line", { x1:0, y1:0, x2:0, y2:-(r - 1), stroke:"#a87444", "stroke-width":2, transform:"rotate(" + a + ")" }, rot);
      S("rect", { x:-4.5, y:-(r + 3), width:9, height:7, rx:1.6, fill:"#c98a4a", stroke:"#6b4423", "stroke-width":1, transform:"rotate(" + a + ")" }, rot);
    }
    S("circle", { r:6.5, fill:bear > 0 ? "#ffd35e" : "#8a5a30", stroke:"#3a2412", "stroke-width":1.5 }, rot);
    if(bear > 1) S("circle", { r:9.5, fill:"none", stroke:"#ffd35e", "stroke-width":1.2, opacity:".8" }, rot);
    return { g:g, rot:rot, ang:0, set:function(a){ rot.setAttribute("transform", "rotate(" + fmt(a % 360, 1) + ")"); } };
  }
  function snap(v, step){ return Math.round(v / step) * step; }
  function ptSvg(svg, e){
    var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var m = svg.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : { x:0, y:0 };
  }
  var DAY_NAMES = ["Mountain Source", "Dam Wall", "Reservoir", "Sluice Gate", "Waterwheel", "Factory"];

  /* ============================================================================================================
     DAY 1 — MOUNTAIN SOURCE / SEPARATION : tap forks to route the stream
     ============================================================================================================ */
  B.registerDay(0, function(env){
    var L = env.level, svg = env.svg, api = env.api, c = Math.min(3, 1 + ((L - 1) >> 1));
    var Q0 = 6, need = 18 + 3 * Math.min(L - 1, 8);
    var N = {}, nodes = [], edges = [];
    function add(id, o){ o.id = id; N[id] = o; nodes.push(o); return o; }
    add("src", { t:"src", x:180, y:36 });
    if(c === 1){
      add("F1", { t:"fork", x:180, y:104, o:["T1", "T2"], m:0, name:"FORK A" });
      add("T1", { t:"tgt", x:84, y:208, name:"MEADOW" }); add("T2", { t:"tgt", x:276, y:208, name:"ORCHARD" });
      N.src.o = ["F1"];
    } else if(c === 2){
      add("F1", { t:"fork", x:150, y:92, o:["T1", "F2"], m:2, name:"FORK A" });
      add("F2", { t:"fork", x:250, y:140, o:["T2", "D1"], m:2, name:"FORK B" });
      add("T1", { t:"tgt", x:70, y:208, name:"MEADOW" }); add("T2", { t:"tgt", x:206, y:214, name:"ORCHARD" }); add("D1", { t:"drain", x:314, y:214, name:"ROCKS" });
      N.src.o = ["F1"];
    } else {
      add("F1", { t:"fork", x:180, y:84, o:["F2", "F3"], m:0, name:"FORK A" });
      add("F2", { t:"fork", x:96, y:136, o:["T1", "D1"], m:2, name:"FORK B" });
      add("F3", { t:"fork", x:264, y:136, o:["T2", "T3"], m:0, name:"FORK C" });
      add("T1", { t:"tgt", x:54, y:214, name:"MEADOW" }); add("D1", { t:"drain", x:138, y:218, name:"ROCKS" });
      add("T2", { t:"tgt", x:222, y:214, name:"ORCHARD" }); add("T3", { t:"tgt", x:308, y:214, name:"VILLAGE" });
      N.src.o = ["F1"];
    }
    var targets = nodes.filter(function(n){ return n.t === "tgt"; });
    targets.forEach(function(n){ n.need = need; n.v = 0; });
    var totalNeed = need * targets.length, factor = Math.max(1.3, 1.9 - 0.06 * (L - 1)), TL = Math.round((totalNeed / Q0) * factor + 5);
    var t = 0, ef = {}, flows = {}, spilled = 0, done = false, failed = false;

    function anchorOut(n){ return [n.x, n.y + (n.t === "src" ? 13 : 11)]; }
    function anchorIn(n){ return [n.x, n.y - (n.t === "tgt" ? 25 : n.t === "drain" ? 14 : 12)]; }
    nodes.forEach(function(n){ (n.o || []).forEach(function(cid){ edges.push({ a:n.id, b:cid }); }); });
    var chs = {};
    edges.forEach(function(e){
      var o = anchorOut(N[e.a]), i = anchorIn(N[e.b]), my = (o[1] + i[1]) / 2;
      chs[e.a + ">" + e.b] = channel(svg, "M" + o[0] + " " + o[1] + "C" + o[0] + " " + my + " " + i[0] + " " + my + " " + i[0] + " " + i[1], 11);
    });

    // spring
    var sg = S("g", null, svg);
    S("path", { d:"M150 36Q180 -6 210 36Z", fill:"#2a2f7a", stroke:"#6a72d8", "stroke-width":1.5 }, sg);
    S("circle", { cx:180, cy:30, r:19, fill:"url(#dbGlow)" }, sg);
    S("ellipse", { cx:180, cy:34, rx:11, ry:6, fill:"#2fd2ff" }, sg);
    T(sg, 180, 54, "SPRING", { "font-size":"8.5", fill:"#9bdcf2" });
    var srcHit = S("circle", { cx:180, cy:34, r:22, fill:"transparent" }, sg); eq(srcHit, "src", "Spring", api);

    function route(){
      flows = {}; ef = {};
      (function go(id, q){
        var n = N[id];
        if(n.t === "fork"){
          var q0 = n.m === 0 ? q : n.m === 1 ? q / 2 : 0, q1 = q - q0;
          ef[id + ">" + n.o[0]] = q0; ef[id + ">" + n.o[1]] = q1; go(n.o[0], q0); go(n.o[1], q1);
        } else if(n.t === "src"){ ef["src>" + n.o[0]] = q; go(n.o[0], q); }
        else flows[id] = q;
      })("src", Q0);
    }
    route();

    // forks + ponds + drains
    var parts = {};
    nodes.forEach(function(n){
      var g = S("g", { transform:"translate(" + n.x + " " + n.y + ")" }, svg);
      if(n.t === "fork"){
        S("circle", { r:13, fill:"#17206b", stroke:"#2fd2ff", "stroke-width":2 }, g);
        var flap = S("line", { x1:0, y1:-1, x2:0, y2:14, stroke:"#ff9df2", "stroke-width":4, "stroke-linecap":"round" }, g);
        flap.style.transition = motion() ? "transform .25s ease" : "none";
        var lab = T(g, 0, 29, "", { "font-size":"11", fill:"#ff9df2" });
        if(n.id === "F1") S("circle", { r:20, fill:"none", stroke:"#ff9df2", "stroke-width":1.6, "stroke-dasharray":"3 4", "class":"dbPulse" }, g);
        var hit = S("circle", { r:24, fill:"transparent" }, g);
        eq(hit, n.id, n.name, api, function(){ n.m = (n.m + 1) % 3; K.sfx("click"); route(); if(motion()) hit.setAttribute("class", ""); });
        parts[n.id] = { flap:flap, lab:lab };
      } else if(n.t === "tgt"){
        S("rect", { x:-30, y:-23, width:60, height:46, rx:7, fill:"#0b1030", stroke:"#6a72d8", "stroke-width":2 }, g);
        var w = S("rect", { x:-28, y:21, width:56, height:0, rx:4, fill:"url(#dbWater)" }, g);
        var pct = T(g, 0, 4, "0%", { "font-size":"12", fill:"#fff" });
        T(g, 0, 38, n.name, { "font-size":"8", fill:"#9bdcf2" });
        var ck = T(g, 22, -12, "✓", { "font-size":"14", fill:"#6dffb0", opacity:0 });
        var h2 = S("rect", { x:-32, y:-25, width:64, height:50, fill:"transparent" }, g); eq(h2, n.id, n.name, api);
        parts[n.id] = { w:w, pct:pct, ck:ck };
      } else if(n.t === "drain"){
        S("ellipse", { rx:24, ry:11, fill:"#02030a", stroke:"#4b4f80", "stroke-width":2 }, g);
        S("path", { d:"M-14 0q14 -7 28 0M-9 3q9 -4 18 0", stroke:"#4b4f80", fill:"none" }, g);
        T(g, 0, 26, n.name + " · LOST", { "font-size":"8", fill:"#ff9df2" });
        var h3 = S("ellipse", { rx:26, ry:14, fill:"transparent" }, g); eq(h3, n.id, n.name, api);
      }
    });
    var ANG = [34, 0, -34], GLYPH = ["◀", "◀▶", "▶"];

    return {
      tips:"Tap a fork to cycle its setting: ◀ everything left · ◀▶ split 50/50 · ▶ everything right. A full pond spills, so send the water on to the next one.",
      explain:"Water always follows the open channel downhill, and it separates wherever a channel forks. Controlling the forks controls where the water goes — and any water sent to a full pond or the rocks is wasted.",
      hint:"Send all the water to one pond first, then turn the fork to the next. Never leave a fork pointing at the rocks or at a pond that's already full.",
      gauges:[{ id:"q", label:"SPRING FLOW" }].concat(targets.map(function(n){ return { id:n.id, label:n.name }; })).concat([{ id:"time", label:"TIME LEFT" }]),
      step:function(dt){
        if(done || failed) return;
        t += dt; route();
        var all = true;
        targets.forEach(function(n){
          var q = flows[n.id] || 0;
          if(n.v < n.need){ n.v = Math.min(n.need, n.v + q * dt); } else spilled += q * dt;
          if(n.v < n.need - 1e-6) all = false;
        });
        if(all) done = true; else if(t >= TL) failed = true;
      },
      status:function(){ return done ? "success" : failed ? "fail" : "playing"; },
      efficient:function(){ return done && t <= TL * 0.8; },
      dbg:function(){ return { Q0:Q0, need:need, TL:TL, t:t, modes:nodes.filter(function(n){ return n.t === "fork"; }).map(function(n){ return n.m; }), targets:targets.map(function(n){ return { id:n.id, v:n.v, need:n.need }; }), spilled:spilled }; },
      failReason:function(){ return "Time ran out. " + targets.map(function(n){ return n.name + " " + Math.round(n.v / n.need * 100) + "%"; }).join(" · ") + "."; },
      draw:function(dt){
        nodes.forEach(function(n){
          var p = parts[n.id];
          if(n.t === "fork"){ p.flap.style.transform = "rotate(" + ANG[n.m] + "deg)"; p.lab.textContent = GLYPH[n.m]; }
          else if(n.t === "tgt"){
            var f = n.v / n.need; p.w.setAttribute("y", fmt(21 - 42 * f, 1)); p.w.setAttribute("height", fmt(42 * f, 1)); p.pct.textContent = Math.round(f * 100) + "%";
            p.ck.setAttribute("opacity", f >= 0.999 ? 1 : 0);
            if(motion() && (flows[n.id] || 0) > 0.1 && Math.random() < dt * 5) api.fx().spawn(n.x + (Math.random() - .5) * 18, n.y - 22, (Math.random() - .5) * 26, -34, .55, 1.6, "#bff4ff");
          } else if(n.t === "drain" && motion() && (flows[n.id] || 0) > 0.1 && Math.random() < dt * 4) api.fx().spawn(n.x + (Math.random() - .5) * 20, n.y - 4, (Math.random() - .5) * 40, -26, .5, 1.5, "#ff9df2");
        });
        for(var k in chs) chs[k].set(ef[k] || 0, Q0, dt);
      },
      gauge:function(a){
        a.gauge("q", fmt(Q0) + " L/s", 1);
        targets.forEach(function(n){ var f = n.v / n.need; a.gauge(n.id, Math.round(f * 100) + "%", f, { tone:f >= 0.999 ? "good" : "" }); });
        var left = Math.max(0, TL - t); a.gauge("time", fmt(left) + " s", left / TL, { tone:left < 4 ? "warn" : "" });
      },
      inspect:function(id){
        var n = N[id]; if(!n) return null;
        if(n.t === "src") return { t:"SPRING", b:"The source: " + fmt(Q0) + " L/s of mountain water." };
        if(n.t === "fork") return { t:n.name, b:["Sends everything LEFT.", "Splits 50/50.", "Sends everything RIGHT."][n.m] + " Tap to change." };
        if(n.t === "tgt") return { t:n.name, b:Math.round(n.v) + " / " + n.need + " L filled · inflow " + fmt(flows[id] || 0) + " L/s" + (n.v >= n.need ? " — full, extra water spills." : "") };
        return { t:"ROCKS", b:"A dead end: water sent here is lost. Inflow " + fmt(flows[id] || 0) + " L/s." };
      }
    };
  });

  /* ============================================================================================================
     DAY 2 — DAM WALL / CONTAINMENT : reinforce rows of the wall; pressure grows with depth
     ============================================================================================================ */
  var keepWall = null;
  B.registerDay(1, function(env){
    var L = env.level, svg = env.svg, api = env.api;
    var R = 4 + Math.min(3, (L - 1) >> 1), m = 4 / R, slack = Math.max(1, 5 - ((L - 1) >> 1)), r, MAXT = 4;
    var need = [], minTotal = 0;
    for(r = 0; r < R; r++){ need[r] = Math.ceil((R - r) * m - 1e-9); minTotal += need[r]; }
    var budget = minTotal + slack, th = [], vw = [];
    for(r = 0; r < R; r++){ th[r] = 0; vw[r] = 0; }
    if(keepWall && keepWall.L === L && keepWall.th.length === R) th = keepWall.th.slice();
    var base = 236, rh = Math.min(30, 168 / R), wallX = 196, TP = 9, rate = 0.45 + 0.03 * Math.min(L, 8);
    var lev = 0, phase = "build", failRow = -1, leakT = 0, holdT = 0, t = 0, attempts = 0;
    function used(){ var s = 0; for(var i = 0; i < R; i++) s += th[i]; return s; }
    function reqAt(row, depth){ return depth > 0 ? Math.ceil(depth * m - 1e-9) : 0; }

    // valley (downstream) + reservoir basin
    var gd = S("g", null, svg);
    S("rect", { x:wallX, y:base, width:170, height:40, fill:"#0a0e2c" }, gd);
    S("path", { d:"M" + (wallX + 30) + " " + base + "Q" + (wallX + 100) + " " + (base - 20) + " 370 " + (base - 8) + "V" + (base + 2) + "H" + (wallX + 30) + "Z", fill:"#15337a", opacity:".7" }, gd);
    T(gd, 300, base + 17, "DRY VALLEY", { "font-size":"8", fill:"#9bdcf2" });
    S("rect", { x:14, y:base - R * rh - 12, width:wallX - 14, height:R * rh + 12 + 6, fill:"#0b1030" }, gd);
    var water = S("path", { d:"", fill:"url(#dbWater)", opacity:".92" }, svg);
    var inflow = channel(svg, "M-4 70C30 70 40 90 56 " + (base - R * rh - 6), 12);
    var arrows = [], rows = [], ghosts = [], labels = [], cracks = [];
    var gw = S("g", null, svg);
    for(r = 0; r < R; r++){
      var y = base - (r + 1) * rh;
      ghosts[r] = S("rect", { x:wallX, y:y + 1, width:MAXT * TP, height:rh - 2, fill:"none", stroke:"#4b5a9c", "stroke-dasharray":"3 3" }, gw);
      rows[r] = S("rect", { x:wallX, y:y + 1, width:0, height:rh - 2, fill:"#9fb3c8", stroke:"#eaf8ff", "stroke-width":1.2, "pointer-events":"none" }, gw);
      cracks[r] = S("path", { d:"M" + (wallX + 4) + " " + (y + 3) + "l5 6 -4 5 6 6", stroke:"#f310ba", "stroke-width":2, fill:"none", opacity:0 }, gw);
      arrows[r] = S("path", { d:"", fill:"#ff9df2", opacity:0, "pointer-events":"none" }, svg);
      labels[r] = T(gw, wallX + MAXT * TP + 12, y + rh / 2 + 3, "", { "font-size":"10", fill:"#eaf8ff", "pointer-events":"none" });
      (function(row){
        var hit = S("rect", { x:wallX - 70, y:y, width:70 + MAXT * TP + 30, height:rh, fill:"transparent" }, gw);
        eq(hit, "row" + row, "Wall row " + (row + 1) + " from the bottom", api, function(){ tapRow(row); });
      })(r);
    }
    T(gw, wallX - 40, base + 14, "tap a row ▸", { "font-size":"8.5", fill:"#ff9df2" });

    function tapRow(row){
      if(phase !== "build") return;
      var nv = th[row] + 1, u = used() - th[row] + nv;
      if(nv > MAXT || u > budget){
        if(nv <= MAXT && u > budget) api.say("Out of blocks — row cleared. Spend them where the pressure is highest.");
        th[row] = 0; K.sfx("bad");
      } else { th[row] = nv; K.sfx("tick"); }
      if(motion()) api.fx().burst(wallX + 10, base - (row + 0.5) * rh, 3, "#cfd9e6", 40);
    }

    var ctl = env.ctl, fillBtn, clrBtn;
    fillBtn = button(ctl, "▶ FILL RESERVOIR", "pri", function(){ if(phase !== "build") return; if(used() === 0){ api.say("Place some wall first — tap a row."); K.sfx("bad"); return; } phase = "fill"; attempts++; K.sfx("splash"); });
    clrBtn = button(ctl, "CLEAR WALL", "", function(){ if(phase !== "build") return; for(var i = 0; i < R; i++) th[i] = 0; K.sfx("click"); });

    return {
      tips:"Tap a wall row to thicken it (1 → 4 blocks, then back to 0). You only have a few blocks. Longer pink arrows = more pressure. When ready, press FILL RESERVOIR.",
      explain:"Water pressure grows with depth, so the deepest part of a dam carries the biggest load. That's why real dams are thick at the base and thinner toward the top: strength goes where the pressure is.",
      hint:"Look at the pink arrows: the longest ones are at the bottom. Give the bottom rows the thickest wall and the top rows only a little.",
      gauges:[{ id:"lev", label:"RESERVOIR" }, { id:"prs", label:"BASE PRESSURE" }, { id:"blk", label:"BLOCKS LEFT" }],
      step:function(dt){
        t += dt;
        if(phase === "fill"){
          lev = Math.min(R, lev + rate * dt);
          for(var i = 0; i < R; i++){
            var d = lev - i; if(d > 0 && th[i] < reqAt(i, d)){ phase = "leak"; failRow = i; leakT = 0; keepWall = { L:L, th:th.slice() }; K.sfx("bad"); return; }
          }
          if(lev >= R){ phase = "hold"; holdT = 0; }
        } else if(phase === "hold"){ holdT += dt; if(holdT >= 1.5){ phase = "done"; keepWall = null; } }
        else if(phase === "leak"){ leakT += dt; if(leakT >= 1.4) phase = "failed"; }
      },
      status:function(){ return phase === "done" ? "success" : phase === "failed" ? "fail" : "playing"; },
      efficient:function(){ return used() <= minTotal + 1 && attempts === 1; },
      dbg:function(){ return { R:R, need:need, th:th.slice(), budget:budget, used:used(), lev:lev, phase:phase, minTotal:minTotal }; },
      failReason:function(){ var r = failRow; return "Row " + (r + 1) + " from the bottom leaked: the water above it pushes with pressure level " + need[r] + ", but that row only had " + th[r] + " block" + (th[r] === 1 ? "" : "s") + "."; },
      draw:function(dt){
        var surf = base - lev * rh, top = base - R * rh - 12;
        water.setAttribute("d", lev > 0.01 ? wave(14, wallX, surf, t * 3, motion() ? 1.4 : 0, base + 6) : "");
        inflow.set(phase === "fill" || phase === "hold" ? 6 : 0, 6, dt);
        for(var i = 0; i < R; i++){
          vw[i] += (th[i] * TP - vw[i]) * Math.min(1, dt * (motion() ? 14 : 100));
          rows[i].setAttribute("width", fmt(Math.max(0, vw[i]), 1)); rows[i].setAttribute("opacity", vw[i] > 0.5 ? 1 : 0);
          labels[i].textContent = th[i] ? String(th[i]) : "";
          var y = base - (i + 1) * rh, d = lev - i, full = R - i;
          var len = phase === "build" ? 4 + full * 6.5 : d > 0 ? 4 + d * 6.5 : 0;
          if(len > 0){
            var ay = y + rh / 2, ax = wallX - 1;
            arrows[i].setAttribute("d", "M" + (ax - len) + " " + (ay - 2.4) + "H" + (ax - 5) + "V" + (ay - 5.5) + "L" + ax + " " + ay + "L" + (ax - 5) + " " + (ay + 5.5) + "V" + (ay + 2.4) + "H" + (ax - len) + "Z");
            arrows[i].setAttribute("opacity", phase === "build" ? ".35" : ".95");
          } else arrows[i].setAttribute("opacity", 0);
          var bad = (phase === "leak" || phase === "failed") && failRow === i;
          cracks[i].setAttribute("opacity", bad ? 1 : 0);
          if(bad && motion() && Math.random() < dt * 24) api.fx().spawn(wallX + vw[i], y + rh / 2, 70 + Math.random() * 60, -30 + Math.random() * 40, .9, 2, "#6fe3ff");
          if(bad) rows[i].setAttribute("fill", "#e86bc6"); else rows[i].setAttribute("fill", "#9fb3c8");
        }
        fillBtn.disabled = clrBtn.disabled = phase !== "build";
      },
      gauge:function(a){
        a.gauge("lev", Math.round(lev / R * 100) + "%", lev / R);
        var bp = lev > 0 ? lev : (phase === "build" ? 0 : 0);
        a.gauge("prs", "level " + Math.min(4, Math.ceil(Math.max(0, bp) * m - 1e-9)) + "/4", Math.min(1, bp * m / 4), { tone:phase === "leak" ? "warn" : "" });
        a.gauge("blk", (budget - used()) + " / " + budget, (budget - used()) / budget, { tone:budget - used() === 0 ? "warn" : "" });
      },
      inspect:function(id){
        if(id.indexOf("row") === 0){ var r2 = +id.slice(3); return { t:"WALL ROW " + (r2 + 1), b:"Pressure here at full reservoir: level " + need[r2] + " · you placed " + th[r2] + ". " + (th[r2] >= need[r2] ? "Holds." : "Too thin!") }; }
        return null;
      }
    };
  });

  /* ============================================================================================================
     DAY 3 — RESERVOIR / STORAGE : retain or release to keep the level in the green band
     ============================================================================================================ */
  B.registerDay(2, function(env){
    var L = env.level, svg = env.svg, api = env.api, k = Math.min(L - 1, 10);
    var b = 5 + 0.3 * k, a = 3 + 0.35 * k, Out = Math.ceil(1.2 * (b + a) * 10) / 10, Cap = 150 * (1 + 0.1 * env.up.liner), D = 36 + 2 * Math.min(L - 1, 6);
    var valves = L >= 4 ? 2 : 1, vcap = Out / valves, LO = 0.25, HI = 0.85, pts = [8 + ((L * 3) % 5), 19 + ((L * 2) % 4), 29 + (L % 4)];
    var V = 0.5 * Cap, t = 0, stress = 0, open = [false, false], vo = [0, 0], inBand = 0, qin = 0, qout = 0, over = false, dry = false, done = false, failed = false, why = "";
    function inflow(tt){ var s = b + 0.5 * Math.sin(0.9 * tt); pts.forEach(function(p){ var x = (tt - p) / 6; if(Math.abs(x) < 1) s += a * (1 - x * x); }); return s; }
    var X0 = 28, X1 = 196, TOP = 80, BOT = 232, H = BOT - TOP;

    // town (downstream) with lights that follow the supply
    var town = S("g", null, svg), houses = [];
    for(var i = 0; i < 5; i++){
      var hx = 236 + i * 25, hh = 18 + (i % 3) * 8;
      S("rect", { x:hx, y:BOT - hh, width:19, height:hh, fill:"#1c2466", stroke:"#4b5aa8" }, town);
      houses.push(S("rect", { x:hx + 6, y:BOT - hh + 5, width:6, height:6, fill:"#ffd35e", opacity:.15 }, town));
    }
    T(town, 296, BOT + 14, "TOWN NEEDS WATER", { "font-size":"8", fill:"#9bdcf2" });
    var ch1 = channel(svg, "M212 200H300", 9), ch2 = valves > 1 ? channel(svg, "M212 164H260Q282 164 282 200", 9) : null;
    S("rect", { x:X0 - 6, y:TOP - 6, width:X1 - X0 + 12 + 18, height:H + 16, rx:3, fill:"none" }, svg);
    S("rect", { x:X0, y:TOP, width:X1 - X0, height:H, fill:"#0b1030", stroke:"#6a72d8", "stroke-width":2 }, svg);
    var water = S("path", { d:"", fill:"url(#dbWater)", opacity:".92" }, svg);
    var inCh = channel(svg, "M-4 46C26 46 52 50 60 64", 8);
    var fall = S("rect", { x:57, y:64, width:6, height:0, fill:"#6fe3ff", opacity:.85 }, svg);
    S("rect", { x:X1, y:TOP - 10, width:16, height:H + 14, fill:"#9fb3c8", stroke:"#eaf8ff", "stroke-width":1.2 }, svg);
    // band markers
    var yLo = BOT - LO * H, yHi = BOT - HI * H;
    S("rect", { x:X0, y:yHi, width:X1 - X0, height:yLo - yHi, fill:"#6dffb0", opacity:".08" }, svg);
    S("line", { x1:X0, x2:X1, y1:yHi, y2:yHi, stroke:"#6dffb0", "stroke-dasharray":"5 4", "stroke-width":1.4 }, svg);
    S("line", { x1:X0, x2:X1, y1:yLo, y2:yLo, stroke:"#6dffb0", "stroke-dasharray":"5 4", "stroke-width":1.4 }, svg);
    T(svg, X0 + 20, yHi - 3, "OVERFLOW ZONE ▲", { "font-size":"7.5", fill:"#ff9df2" }); T(svg, X0 + 20, yLo + 10, "▼ TOO LOW", { "font-size":"7.5", fill:"#ff9df2" });
    T(svg, X0 + 14, (yHi + yLo) / 2 + 3, "SAFE", { "font-size":"8", fill:"#6dffb0" });
    var tankHit = S("rect", { x:X0, y:TOP, width:X1 - X0, height:H, fill:"transparent" }, svg); eq(tankHit, "tank", "Reservoir", api);
    // valves
    var vg = [], vy = [200, 164];
    for(i = 0; i < valves; i++){
      (function(j){
        var g = S("g", { transform:"translate(" + (X1 + 8) + " " + vy[j] + ")" }, svg);
        S("circle", { r:11, fill:"#17206b", stroke:"#ff9df2", "stroke-width":2 }, g);
        var spokes = S("g", null, g); S("line", { x1:-8, x2:8, stroke:"#ff9df2", "stroke-width":2.4 }, spokes); S("line", { y1:-8, y2:8, stroke:"#ff9df2", "stroke-width":2.4 }, spokes);
        T(g, 0, 24, valves > 1 ? "SPILLWAY " + "AB"[j] : "SPILLWAY", { "font-size":"7.5", fill:"#9bdcf2" });
        var hit = S("circle", { r:24, fill:"transparent" }, g); eq(hit, "v" + j, "Spillway " + "AB"[j], api, function(){ toggle(j); });
        vg.push({ g:g, spokes:spokes, ring:g.firstChild });
      })(i);
    }
    // forecast + cloud
    var fb = S("g", null, svg);
    S("rect", { x:214, y:12, width:136, height:50, rx:8, fill:"rgba(6,7,13,.7)", stroke:"#6a72d8" }, fb);
    T(fb, 282, 23, "RAIN FORECAST · next 14 s", { "font-size":"7.5", fill:"#9bdcf2" });
    var poly = S("polyline", { points:"", fill:"none", stroke:"#2fd2ff", "stroke-width":2, "stroke-linejoin":"round" }, fb);
    S("line", { x1:222, x2:222, y1:27, y2:58, stroke:"#ff9df2", "stroke-width":1.5 }, fb);
    var cloud = S("g", { opacity:0 }, svg);
    S("ellipse", { cx:60, cy:26, rx:26, ry:9, fill:"#cfd9ff" }, cloud); S("ellipse", { cx:82, cy:21, rx:16, ry:8, fill:"#cfd9ff" }, cloud);
    for(i = 0; i < 4; i++) S("line", { x1:48 + i * 12, x2:44 + i * 12, y1:38, y2:46, stroke:"#2fd2ff", "stroke-width":1.6 }, cloud);

    function toggle(j){ if(done || failed) return; open[j] = !open[j]; K.sfx(open[j] ? "splash" : "click"); syncBtns(); }
    var ctl = env.ctl, btns = [];
    for(i = 0; i < valves; i++){ (function(j){ btns.push(button(ctl, "", "", function(){ toggle(j); })); })(i); }
    function syncBtns(){ for(var j = 0; j < valves; j++){ btns[j].textContent = (valves > 1 ? "SPILLWAY " + "AB"[j] : "SPILLWAY") + ": " + (open[j] ? "OPEN ▼" : "CLOSED"); btns[j].classList.toggle("on", open[j]); btns[j].setAttribute("aria-pressed", open[j] ? "true" : "false"); } }
    syncBtns();

    return {
      tips:"Tap a spillway (or its button) to open or close it. Watch the forecast: close it before a dry spell, open it before the storm arrives. Don't stay out of the green band for long.",
      explain:"A reservoir is a buffer: its level changes by inflow minus outflow. Holding water back before dry weather and releasing it ahead of a storm keeps the level safe — neither flooding nor running dry.",
      hint:"The level only changes by inflow − outflow. If the forecast shows a storm coming, open a spillway early to make room; if it's dry, keep the water.",
      gauges:[{ id:"lev", label:"LEVEL" }, { id:"in", label:"INFLOW" }, { id:"out", label:"OUTFLOW" }, { id:"st", label:"STRESS" }, { id:"time", label:"TIME LEFT" }],
      step:function(dt){
        if(done || failed) return;
        t += dt; qin = inflow(t); qout = 0;
        for(var j = 0; j < valves; j++){ vo[j] += clamp((open[j] ? 1 : 0) - vo[j], -4 * dt, 4 * dt); qout += vo[j] * vcap; }
        V += (qin - qout) * dt;
        var f = V / Cap;
        if(f >= 1){ V = Cap; failed = true; why = "The reservoir overflowed! More water came in than went out and the level reached the top."; return; }
        if(f <= 0){ V = 0; failed = true; why = "The reservoir ran dry — too much water was released and the town ran out."; return; }
        if(f < LO || f > HI){ stress += dt; } else { stress = Math.max(0, stress - 0.6 * dt); inBand += dt; }
        if(stress >= 5){ failed = true; why = "The level stayed outside the safe band for too long (" + (f > HI ? "too full" : "too low") + ")."; return; }
        if(t >= D) done = true;
      },
      status:function(){ return done ? "success" : failed ? "fail" : "playing"; },
      efficient:function(){ return done && inBand / t >= 0.92; },
      dbg:function(){ return { f:V / Cap, qin:qin, qout:qout, open:open.slice(), valves:valves, D:D, t:t, stress:stress, LO:LO, HI:HI }; },
      failReason:function(){ return why; },
      draw:function(dt){
        var f = V / Cap, sy = BOT - f * H;
        water.setAttribute("d", wave(X0 + 1, X1 - 1, sy, t * 3, motion() ? 1.5 : 0, BOT - 1));
        inCh.set(qin, b + a + 0.5, dt);
        fall.setAttribute("y", 62); fall.setAttribute("height", Math.max(0, sy - 62)); fall.setAttribute("width", fmt(2 + 4 * qin / (b + a), 1)); fall.setAttribute("x", fmt(60 - (2 + 4 * qin / (b + a)) / 2, 1));
        ch1.set(vo[0] * vcap, Out, dt); if(ch2) ch2.set(vo[1] * vcap, Out, dt);
        var storm = clamp((qin - b - 0.6) / a, 0, 1); cloud.setAttribute("opacity", fmt(storm, 2));
        for(var j = 0; j < valves; j++){ var s = vg[j]; s.spokes.setAttribute("transform", "rotate(" + (vo[j] * 90) + ")"); s.ring.setAttribute("stroke", vo[j] > 0.5 ? "#2fd2ff" : "#ff9df2"); }
        var lit = clamp(qout / Out, 0, 1);
        houses.forEach(function(h, idx){ h.setAttribute("opacity", lit * 5 > idx ? ".95" : ".15"); });
        if(motion() && qout > 0.5 && Math.random() < dt * qout){ api.fx().spawn(X1 + 22, vy[0], 30 + Math.random() * 30, -10, .5, 1.6, "#bff4ff"); }
        if(motion() && storm > 0.4 && Math.random() < dt * 14) api.fx().spawn(60 + (Math.random() - .5) * 16, sy, (Math.random() - .5) * 40, -30, .45, 1.4, "#bff4ff");
        // forecast polyline (14 s ahead)
        var s2 = "", lo = b - 1, hi = b + a + 1;
        for(var q = 0; q <= 28; q++){ var tt = t + q * 0.5; s2 += (222 + q * 4.5).toFixed(1) + "," + (58 - (inflow(tt) - lo) / (hi - lo) * 28).toFixed(1) + " "; }
        poly.setAttribute("points", s2);
      },
      gauge:function(a2){
        a2.gauge("lev", Math.round(f0() * 100) + "%", f0(), { band:[LO, HI], tone:(f0() < LO || f0() > HI) ? "warn" : "good" });
        a2.gauge("in", fmt(qin) + " L/s", qin / (b + a + 0.5));
        a2.gauge("out", fmt(qout) + " L/s", qout / Out);
        a2.gauge("st", fmt(stress) + " / 5", stress / 5, { tone:stress > 0.2 ? "warn" : "" });
        a2.gauge("time", fmt(Math.max(0, D - t), 0) + " s", Math.max(0, D - t) / D);
      },
      inspect:function(id){
        if(id === "tank") return { t:"RESERVOIR", b:Math.round(V / Cap * 100) + "% full · " + (qin - qout >= 0 ? "rising " : "falling ") + fmt(Math.abs(qin - qout)) + " L/s (inflow − outflow)" };
        var j = +id.slice(1); return { t:"SPILLWAY " + (valves > 1 ? "AB"[j] : ""), b:(open[j] ? "OPEN: releasing up to " : "CLOSED: would release ") + fmt(vcap) + " L/s. Tap to " + (open[j] ? "close" : "open") + "." };
      }
    };
    function f0(){ return V / Cap; }
  });

  /* ============================================================================================================
     DAY 4 — SLUICE GATE / REGULATION : set the gate so flow lands in the target band and holds
     ============================================================================================================ */
  B.registerDay(3, function(env){
    var L = env.level, svg = env.svg, api = env.api, act = env.up.act;
    var TG = [6, 9, 11, 7, 12, 8, 10, 5, 12, 9, 6, 11], Nt = 1 + Math.min(2, Math.floor((L - 1) / 3)), tg = [], j;
    for(j = 0; j < Nt; j++) tg.push(TG[(L * 2 + j * 5) % 12]);
    var Kc = 7, head0 = 4, amp = L < 4 ? 0 : Math.min(0.8, 0.2 * (L - 3)), tol = Math.max(0.5, 1.4 - 0.1 * (L - 1)) + 0.3 * act, HOLD = 3, TL = 24 * Nt + 6;
    var stepPct = [5, 4, 2.5, 1][act], sp = 0, a = 0, t = 0, idx = 0, holdT = 0, Q = 0, h = head0, done = false, failed = false, FLOOR = 232, SLOT = 34, QMAX = 16;

    // reservoir + wall + channel
    S("rect", { x:14, y:FLOOR - 160, width:136, height:160, fill:"#0b1030", stroke:"#6a72d8", "stroke-width":2 }, svg);
    var water = S("path", { d:"", fill:"url(#dbWater)", opacity:".92" }, svg);
    S("rect", { x:150, y:86, width:18, height:FLOOR - 86 + 6, fill:"#9fb3c8", stroke:"#eaf8ff", "stroke-width":1.2 }, svg);
    S("rect", { x:150, y:FLOOR - SLOT, width:18, height:SLOT, fill:"#02030a" }, svg);
    var jet = channel(svg, "M168 " + (FLOOR - 14) + "H366", 30);
    S("rect", { x:168, y:FLOOR, width:200, height:40, fill:"#0a0e2c" }, svg);
    var gate = S("g", null, svg), plate = S("rect", { x:146, y:60, width:26, height:100, rx:2, fill:"#f310ba", stroke:"#ffd5f6", "stroke-width":1.5 }, gate);
    S("rect", { x:140, y:56, width:38, height:8, rx:3, fill:"#ff9df2" }, gate);
    T(gate, 159, 52, "▲▼ GATE", { "font-size":"8", fill:"#ff9df2" });
    var gHit = S("rect", { x:128, y:40, width:62, height:FLOOR - 40, fill:"transparent" }, gate);
    eq(gHit, "gate", "Sluice gate: drag up to open", api);
    var drag = false;
    gHit.addEventListener("pointerdown", function(e){ drag = true; try{ env.root.setPointerCapture(e.pointerId); }catch(_){} mv(e); });
    env.root.addEventListener("pointermove", function(e){ if(drag) mv(e); });
    env.root.addEventListener("pointerup", function(){ drag = false; });
    env.root.addEventListener("pointercancel", function(){ drag = false; });
    function mv(e){ var p = ptSvg(env.root, e); setGate(snap(clamp((FLOOR - p.y) / 70, 0, 1) * 100, stepPct)); }
    var ctl = env.ctl, sl = slider(ctl, "GATE", 0, 100, stepPct, 0, function(v){ setGate(v, true); }, function(v){ return Math.round(v) + "%"; });
    button(ctl, "− GATE", "", function(){ setGate(sp - stepPct); sl.set(sp); });
    button(ctl, "GATE +", "", function(){ setGate(sp + stepPct); sl.set(sp); });
    function setGate(v, fromSlider){ var nv = clamp(snap(v, stepPct), 0, 100); if(nv !== sp){ sp = nv; if(!fromSlider) sl.set(sp); K.sfx("tick"); } }
    // dial
    var cx = 268, cy = 112, rr = 44, dial = S("g", null, svg);
    function pt(frac, r){ var ang = Math.PI * (1 + frac); return (cx + Math.cos(ang) * r).toFixed(1) + " " + (cy + Math.sin(ang) * r).toFixed(1); }
    function arcD(f0, f1, r){ return "M" + pt(f0, r) + "A" + r + " " + r + " 0 0 1 " + pt(f1, r); }
    S("path", { d:arcD(0, 1, rr), fill:"none", stroke:"#1a2150", "stroke-width":9 }, dial);
    var band = S("path", { d:"", fill:"none", stroke:"#f310ba", "stroke-width":9 }, dial);
    var needle = S("line", { x1:cx, y1:cy, x2:cx, y2:cy - rr, stroke:"#fff", "stroke-width":2.4, "stroke-linecap":"round" }, dial);
    S("circle", { cx:cx, cy:cy, r:4, fill:"#fff" }, dial);
    var qtxt = T(dial, cx, cy + 16, "0.0", { "font-size":"14", fill:"#fff" }); T(dial, cx, cy + 27, "FLOW L/s", { "font-size":"7.5", fill:"#9bdcf2" });
    var ttxt = T(dial, cx, cy - rr - 6, "", { "font-size":"8.5", fill:"#ff9df2" });
    var dialHit = S("circle", { cx:cx, cy:cy, r:rr + 8, fill:"transparent" }, dial); eq(dialHit, "dial", "Flow meter", api);

    return {
      tips:"Drag the gate plate up (or use the slider / ± buttons). The needle shows the flow. Put it inside the pink band and hold it there until the bar fills. Deeper water pushes harder, so a changing depth changes the flow.",
      explain:"A sluice gate regulates flow: more opening lets more water through, and deeper water (more head) pushes it out faster — flow ≈ opening × √head. Operators adjust the gate to hit a target flow as conditions change.",
      hint:"Small gate changes make small flow changes. Move the gate until the needle sits in the pink band, then keep your hands still — the head may drift, so nudge it back if needed.",
      gauges:[{ id:"gate", label:"GATE OPEN" }, { id:"head", label:"HEAD (DEPTH)" }, { id:"flow", label:"FLOW" }, { id:"tgt", label:"TARGET" }, { id:"hold", label:"HOLD" }, { id:"time", label:"TIME LEFT" }],
      step:function(dt){
        if(done || failed) return;
        t += dt; h = head0 + amp * Math.sin(2 * Math.PI * t / 14);
        a += clamp(sp / 100 - a, -0.7 * dt, 0.7 * dt);
        Q = a * Kc * Math.sqrt(h);
        if(Math.abs(Q - tg[idx]) <= tol){ holdT += dt; } else holdT = Math.max(0, holdT - 2 * dt);
        if(holdT >= HOLD){ idx++; holdT = 0; K.sfx("good"); if(idx >= Nt){ done = true; return; } api.say("Target reached! New target: " + tg[idx] + " L/s"); }
        if(t >= TL) failed = true;
      },
      status:function(){ return done ? "success" : failed ? "fail" : "playing"; },
      efficient:function(){ return done && t <= TL * 0.7; },
      dbg:function(){ return { Q:Q, h:h, a:a, sp:sp, tg:tg.slice(), idx:idx, tol:tol, Kc:Kc, holdT:holdT, TL:TL, t:t }; },
      failReason:function(){ return "Time ran out before the flow was held in the target band (" + fmt(tg[Math.min(idx, Nt - 1)] - tol) + "–" + fmt(tg[Math.min(idx, Nt - 1)] + tol) + " L/s)."; },
      draw:function(dt){
        var sy = FLOOR - h / 6 * 150;
        water.setAttribute("d", wave(15, 149, sy, t * 3, motion() ? 1.3 : 0, FLOOR - 1));
        var oh = a * SLOT;
        plate.setAttribute("y", fmt(FLOOR - oh - 100, 1));
        jet.set(Q, QMAX, dt, Math.sqrt(h) / 2);
        jet.body.setAttribute("stroke-width", fmt(Math.max(0, oh * 0.9), 1)); jet.dash.setAttribute("stroke-width", fmt(Math.max(0, oh * 0.4), 1));
        if(motion() && Q > 0.5 && Math.random() < dt * Q * 1.2) api.fx().spawn(170 + Math.random() * 8, FLOOR - 10, 40 + Math.random() * 50, -26, .5, 1.7, "#bff4ff");
        var tq = tg[Math.min(idx, Nt - 1)];
        band.setAttribute("d", arcD(clamp((tq - tol) / QMAX, 0, 1), clamp((tq + tol) / QMAX, 0, 1), rr));
        var ang = Math.PI * (1 + clamp(Q / QMAX, 0, 1));
        needle.setAttribute("x2", fmt(cx + Math.cos(ang) * (rr - 2), 1)); needle.setAttribute("y2", fmt(cy + Math.sin(ang) * (rr - 2), 1));
        qtxt.textContent = fmt(Q); ttxt.textContent = "TARGET " + fmt(tq) + " ±" + fmt(tol);
      },
      gauge:function(g){
        var tq = tg[Math.min(idx, Nt - 1)], inb = Math.abs(Q - tq) <= tol;
        g.gauge("gate", Math.round(a * 100) + "%", a);
        g.gauge("head", fmt(h) + " m", h / 6);
        g.gauge("flow", fmt(Q) + " L/s", Q / QMAX, { band:[clamp((tq - tol) / QMAX, 0, 1), clamp((tq + tol) / QMAX, 0, 1)], tone:inb ? "good" : "" });
        g.gauge("tgt", fmt(tq) + " (" + Math.min(idx + 1, Nt) + "/" + Nt + ")", tq / QMAX);
        g.gauge("hold", fmt(holdT) + " / " + HOLD + " s", holdT / HOLD, { tone:inb ? "good" : "" });
        g.gauge("time", fmt(Math.max(0, TL - t), 0) + " s", Math.max(0, TL - t) / TL, { tone:TL - t < 6 ? "warn" : "" });
      },
      inspect:function(id){
        if(id === "gate") return { t:"SLUICE GATE", b:"Opening " + Math.round(a * 100) + "% × √head " + fmt(Math.sqrt(h), 2) + " → " + fmt(Q) + " L/s. Drag it or use the slider." };
        return { t:"FLOW METER", b:"Needle " + fmt(Q) + " L/s. Target " + fmt(tg[Math.min(idx, Nt - 1)]) + " ± " + fmt(tol) + ". Hold it for " + HOLD + " s." };
      }
    };
  });

  /* ============================================================================================================
     DAY 5 — WATERWHEEL / MECHANICAL CONVERSION : route flow to the wheel(s), belt machines on
     ============================================================================================================ */
  B.registerDay(4, function(env){
    var L = env.level, svg = env.svg, api = env.api, bear = env.up.bear, two = L >= 4;
    var Q0 = two ? 20 : 13;
    var W = two
      ? [{ id:"A", x:132, y:146, r:26, cap:8, eta:0.5 + 0.06 * bear }, { id:"B", x:250, y:140, r:38, cap:14, eta:Math.min(0.99, 0.8 + 0.06 * bear) }]
      : [{ id:"A", x:200, y:140, r:40, cap:14, eta:0.6 + 0.06 * bear }];
    var MD = [{ id:"mill", name:"MILL", icon:"🌾", d:3 }, { id:"saw", name:"SAW", icon:"🪚", d:4 }, { id:"pump", name:"PUMP", icon:"💧", d:5 }];
    var M = two ? (L >= 8 ? 3 : 2) : 1 + ((L - 1) >> 1);
    var MX = M === 1 ? [180] : M === 2 ? [110, 250] : [66, 180, 294], MY = 206;
    var mach = [], i;
    for(i = 0; i < M; i++) mach.push({ def:MD[i], x:MX[i], as:-1, run:false, led:null, ang:0 });
    var v = W.map(function(){ return 0; }), Qk = W.map(function(){ return 0; }), P = W.map(function(){ return 0; }), Dm = W.map(function(){ return 0; }), rpm = W.map(function(){ return 0; }), over = W.map(function(){ return 0; });
    var t = 0, holdT = 0, HOLD = 4, TL = Math.round(45 - Math.min(L - 1, 10) * 1.5), done = false, failed = false, why = "", J = [96, 62];
    var qs = W.map(function(){ return 0; });

    // channels: source → junction → wheels, bypass
    var src = channel(svg, "M-4 40C40 40 70 52 " + J[0] + " " + J[1], 14);
    var chW = W.map(function(w){ return channel(svg, "M" + J[0] + " " + J[1] + "C" + (J[0] + 50) + " " + J[1] + " " + w.x + " " + (w.y - w.r - 40) + " " + w.x + " " + (w.y - w.r - 6), 11); });
    var byp = channel(svg, "M" + J[0] + " " + J[1] + "C" + (J[0] - 40) + " " + (J[1] + 40) + " 36 140 36 232", 10);
    S("circle", { cx:J[0], cy:J[1], r:6, fill:"#17206b", stroke:"#2fd2ff", "stroke-width":2 }, svg);
    T(svg, 36, 244, "BYPASS", { "font-size":"7.5", fill:"#9bdcf2" });
    // ground + wheels
    S("rect", { x:-10, y:MY - 8, width:380, height:80, fill:"#0a0e2c", opacity:.0 }, svg);
    var wg = W.map(function(w){
      S("rect", { x:w.x - w.r - 8, y:w.y + w.r - 6, width:w.r * 2 + 16, height:8, rx:3, fill:"#2a2f7a" }, svg);
      var g = wheelGfx(svg, w.x, w.y, w.r, bear);
      var hit = S("circle", { cx:w.x, cy:w.y, r:w.r + 6, fill:"transparent" }, svg); eq(hit, "w" + w.id, "Waterwheel " + w.id, api);
      T(svg, w.x, w.y + w.r + 16, W.length > 1 ? "WHEEL " + w.id : "WATERWHEEL", { "font-size":"8", fill:"#ff9df2" });
      return g;
    });
    // machines + belts
    var belts = [], mg = [];
    mach.forEach(function(m, k){
      var belt = S("path", { d:"", fill:"none", stroke:"#f310ba", "stroke-width":3, "stroke-dasharray":"6 5", opacity:0 }, svg); belts.push(belt);
      var g = S("g", null, svg);
      S("rect", { x:m.x - 36, y:MY, width:72, height:42, rx:8, fill:"#17206b", stroke:"#ff9df2", "stroke-width":1.6 }, g);
      T(g, m.x - 14, MY + 24, m.def.icon, { "font-size":"18" }); T(g, m.x + 14, MY + 17, m.def.name, { "font-size":"8.5" }); T(g, m.x + 14, MY + 29, "needs " + m.def.d, { "font-size":"8", fill:"#9bdcf2" });
      m.led = S("circle", { cx:m.x + 28, cy:MY + 8, r:4, fill:"#4b4f80" }, g);
      m.lab = T(g, m.x, MY + 55, "tap to belt on", { "font-size":"8", fill:"#ff9df2" });
      m.pul = S("circle", { cx:m.x, cy:MY - 3, r:4, fill:"#ff9df2" }, g);
      var hit = S("rect", { x:m.x - 38, y:MY - 6, width:76, height:66, fill:"transparent" }, g);
      eq(hit, "m" + k, m.def.name, api, function(){ m.as = m.as + 1 >= W.length ? -1 : m.as + 1; K.sfx(m.as >= 0 ? "click" : "tick"); });
    });

    // controls: one valve per wheel
    var ctl = env.ctl;
    W.forEach(function(w, k){ slider(ctl, W.length > 1 ? "VALVE " + w.id : "VALVE → WHEEL", 0, 100, 5, 0, function(val){ v[k] = val / 100; K.sfx("tick"); }, function(x){ return x + "%"; }); });

    function recompute(dt){
      var sum = 0; v.forEach(function(x){ sum += x; });
      var sc = sum > 1 ? 1 / sum : 1;
      W.forEach(function(w, k){
        Qk[k] = Q0 * v[k] * sc; P[k] = w.eta * Math.min(Qk[k], w.cap);
        Dm[k] = 0; mach.forEach(function(m){ if(m.as === k) Dm[k] += m.def.d; });
      });
    }
    return {
      tips:W.length > 1 ? "Use the valves to send water to each wheel (any water you don't send goes to the bypass). Tap a machine to belt it to wheel A, wheel B, or off. A machine runs only when its wheel's power meets its need — and a wheel fed far above its limit overspeeds."
                         : "Use the valve to send water to the wheel (the rest goes to the bypass). Tap a machine to belt it onto the wheel. The machine runs only when the wheel's power meets its need.",
      explain:"A waterwheel converts moving water into rotation. More flow means a faster wheel and more power (power ≈ efficiency × flow). A machine only works when the wheel can supply the power it needs — overload it and it slows; overfeed the wheel and it can overspeed.",
      hint:"Raise the valve until the wheel's POWER bar passes the machine's need, and make sure each machine is belted on (tap it). With two wheels, the big wheel B is more efficient — put the hungriest machines on it.",
      gauges:(W.length > 1
        ? [{ id:"f0", label:"WHEEL A FLOW" }, { id:"p0", label:"A POWER / NEED" }, { id:"f1", label:"WHEEL B FLOW" }, { id:"p1", label:"B POWER / NEED" }]
        : [{ id:"f0", label:"FLOW TO WHEEL" }, { id:"r0", label:"WHEEL SPEED" }, { id:"p0", label:"POWER / NEED" }]).concat([{ id:"hold", label:"ALL RUNNING" }, { id:"time", label:"TIME LEFT" }]),
      step:function(dt){
        if(done || failed) return;
        t += dt; recompute(dt);
        W.forEach(function(w, k){
          var f = Dm[k] > 0 ? Math.min(1, P[k] / Dm[k]) : 1;
          var target = clamp(Qk[k] / w.cap, 0, 1.3) * 48 * (Dm[k] > 0 && f < 1 ? 0.25 + 0.75 * f : 1);
          rpm[k] += (target - rpm[k]) * Math.min(1, dt * 2.5);
          if(Qk[k] > 1.3 * w.cap) over[k] += dt; else over[k] = Math.max(0, over[k] - dt);
          if(over[k] >= 2.5){ failed = true; why = "Wheel " + w.id + " overspeeded and was damaged — it was fed far more water than it can handle (limit ≈ " + w.cap + " L/s)."; }
        });
        var all = true;
        mach.forEach(function(m){ var k = m.as; m.run = k >= 0 && Qk[k] > 0 && Dm[k] > 0 && P[k] >= Dm[k] - 1e-9; if(!m.run) all = false; });
        if(all){ holdT += dt; } else holdT = 0;
        if(holdT >= HOLD){ done = true; return; }
        if(t >= TL){ failed = true; why = "Time ran out before every machine was running."; }
      },
      status:function(){ return done ? "success" : failed ? "fail" : "playing"; },
      efficient:function(){ return done && t <= TL * 0.6; },
      dbg:function(){ return { Q0:Q0, M:M, wheels:W.length, Qk:Qk.slice(), P:P.slice(), Dm:Dm.slice(), rpm:rpm.slice(), v:v.slice(), mach:mach.map(function(m){ return { as:m.as, run:m.run, d:m.def.d }; }), cap:W.map(function(w){ return w.cap; }), eta:W.map(function(w){ return w.eta; }), holdT:holdT, TL:TL, t:t }; },
      failReason:function(){ return why; },
      draw:function(dt){
        src.set(Q0, Q0, dt); byp.set(Math.max(0, Q0 - Qk.reduce(function(a, b){ return a + b; }, 0)), Q0, dt);
        W.forEach(function(w, k){
          chW[k].set(Qk[k], Q0, dt);
          var g = wg[k];
          if(motion()){ g.ang += rpm[k] * 6 * dt; g.set(g.ang); } else g.set(rpm[k] * 1.2);       // reduced motion: a pose that tracks speed, no spinning
          if(motion() && Qk[k] > 0.5 && Math.random() < dt * Qk[k] * 0.9) api.fx().spawn(w.x + (Math.random() - .5) * 14, w.y - w.r - 2, (Math.random() - .5) * 50, -20, .5, 1.6, "#bff4ff");
        });
        mach.forEach(function(m, k){
          var wl = m.as >= 0 ? W[m.as] : null;
          m.led.setAttribute("fill", m.run ? "#6dffb0" : wl ? "#f310ba" : "#4b4f80");
          m.lab.textContent = !wl ? "tap to belt on" : m.run ? "RUNNING" + (W.length > 1 ? " · " + wl.id : "") : "NEEDS POWER" + (W.length > 1 ? " · " + wl.id : "");
          m.lab.setAttribute("fill", m.run ? "#6dffb0" : "#ff9df2");
          var b = belts[k];
          if(wl){
            var px = m.x, py = MY - 3, d = "M" + wl.x + " " + wl.y + "L" + px + " " + py;
            b.setAttribute("d", d); b.setAttribute("opacity", ".95"); b.setAttribute("stroke", m.run ? "#ff9df2" : "#f310ba");
            if(motion()){ b.__o = (b.__o || 0) - rpm[m.as] * 0.6 * dt; b.setAttribute("stroke-dashoffset", fmt(b.__o, 1)); }
          } else b.setAttribute("opacity", 0);
          if(m.run && motion() && Math.random() < dt * 3) api.fx().spawn(m.x + (Math.random() - .5) * 30, MY - 2, (Math.random() - .5) * 30, -40, .5, 1.5, "#ffd35e");
        });
      },
      gauge:function(g){
        W.forEach(function(w, k){
          var Pcap = w.eta * w.cap, ok = Dm[k] > 0 && P[k] >= Dm[k] - 1e-9;
          g.gauge("f" + k, fmt(Qk[k]) + " L/s", Qk[k] / (w.cap * 1.3), { tone:Qk[k] > 1.3 * w.cap ? "warn" : "", band:[0, Math.min(1, 1 / 1.3)] });
          if(W.length === 1) g.gauge("r0", Math.round(rpm[k]) + " rpm", rpm[k] / 62);
          g.gauge("p" + k, fmt(P[k]) + " / " + fmt(Dm[k]), P[k] / Pcap, { band:Dm[k] > 0 ? [Math.min(1, Dm[k] / Pcap), 1] : null, tone:ok ? "good" : Dm[k] > 0 ? "warn" : "" });
        });
        g.gauge("hold", fmt(holdT) + " / " + HOLD + " s", holdT / HOLD, { tone:holdT > 0 ? "good" : "" });
        g.gauge("time", fmt(Math.max(0, TL - t), 0) + " s", Math.max(0, TL - t) / TL, { tone:TL - t < 8 ? "warn" : "" });
      },
      inspect:function(id){
        if(id.charAt(0) === "w"){ var k = id === "wB" ? 1 : 0, w = W[k]; return { t:"WATERWHEEL " + w.id, b:fmt(Qk[k]) + " L/s in · " + Math.round(rpm[k]) + " rpm · power " + fmt(P[k]) + " (η " + Math.round(w.eta * 100) + "%, limit ≈ " + w.cap + " L/s)" }; }
        var m = mach[+id.slice(1)]; if(!m) return null;
        return { t:m.def.name, b:"Needs " + m.def.d + " power. " + (m.as < 0 ? "Not belted on — tap to connect." : "Belted to wheel " + W[m.as].id + (m.run ? ": running." : ": not enough power yet.")) + " Tap to change." };
      }
    };
  });

  /* ============================================================================================================
     DAY 6 — FACTORY / ORGANIZED SYSTEM : drag to connect the whole chain, then run the factory
     ============================================================================================================ */
  B.registerDay(5, function(env){
    var L = env.level, svg = env.svg, api = env.api, bear = env.up.bear, act = env.up.act, root = env.root;
    var Mn = Math.min(4, 2 + ((L - 1) >> 1)), MD = [
      { id:"mill", name:"MILL", icon:"🌾", d:2, r:1.0 }, { id:"press", name:"PRESS", icon:"🧈", d:2.5, r:1.2 }, { id:"saw", name:"SAW", icon:"🪚", d:3, r:1.4 }, { id:"loom", name:"LOOM", icon:"🧵", d:3.5, r:1.6 }];
    var Qin = 4 + 3 * Mn, Cap = 60 * (1 + 0.1 * env.up.liner), Kg = 2.2 * Qin, eta = 0.75 + 0.05 * bear;
    var Dtot = 0, Rtot = 0, i;
    for(i = 0; i < Mn; i++){ Dtot += MD[i].d; Rtot += MD[i].r; }
    var U = Math.round(0.85 * Rtot * 18), TL = Math.round(40 + 20 * Math.max(0, 1 - (L - 1) / 10)), dipOn = L >= 3;
    var stepPct = [5, 4, 2.5, 1][act], sp = 0, a = 0, V = 0.5 * Cap, t = 0, units = 0, Qg = 0, Pw = 0, frac = 0, spill = 0, done = false, failed = false;

    // modules + ports
    var MXs = Mn === 2 ? [100, 260] : Mn === 3 ? [66, 180, 294] : [48, 140, 232, 324], MY = 196;
    var mods = {
      spring:{ x:14, y:24, w:50, h:44, out:[64, 46] },
      res:{ x:92, y:24, w:80, h:60, in:[92, 54], out:[172, 62] },
      gate:{ x:196, y:30, w:36, h:60, in:[196, 62], out:[232, 62] },
      wheel:{ x:290, y:76, r:34, in:[256, 72], out:[290, 112] }
    };
    var ports = {}, links = [], sel = null, hintPulse = null;
    function addPort(id, x, y, kind){ ports[id] = { id:id, x:x, y:y, kind:kind }; }
    addPort("spring.out", 64, 46, "out"); addPort("res.in", 92, 54, "in"); addPort("res.out", 172, 62, "out"); addPort("gate.in", 196, 62, "in"); addPort("gate.out", 232, 62, "out"); addPort("wheel.in", 256, 72, "in"); addPort("wheel.out", 290, 112, "out");
    for(i = 0; i < Mn; i++) addPort("m" + i + ".in", MXs[i], MY - 2, "in");

    // water body of the reservoir + backdrop modules
    var layer = S("g", null, svg);
    var sg = S("g", null, layer);
    S("path", { d:"M14 68Q39 -2 64 68Z", fill:"#2a2f7a", stroke:"#6a72d8", "stroke-width":1.5 }, sg);
    S("ellipse", { cx:39, cy:60, rx:10, ry:5, fill:"#2fd2ff" }, sg); T(sg, 39, 82, "SPRING", { "font-size":"8", fill:"#9bdcf2" });
    var rg = S("g", null, layer);
    S("rect", { x:92, y:24, width:80, height:60, rx:6, fill:"#0b1030", stroke:"#6a72d8", "stroke-width":2 }, rg);
    var rWater = S("rect", { x:94, y:60, width:76, height:22, fill:"url(#dbWater)" }, rg); T(rg, 132, 96, "RESERVOIR", { "font-size":"8", fill:"#9bdcf2" });
    var rBand = S("text", { x:132, y:54, "text-anchor":"middle", "font-size":"11", "font-weight":"900", fill:"#fff", "font-family":"system-ui,sans-serif" }, rg);
    var gg = S("g", null, layer);
    S("rect", { x:196, y:30, width:36, height:60, rx:4, fill:"#9fb3c8", stroke:"#eaf8ff" }, gg);
    var gPlate = S("rect", { x:200, y:34, width:28, height:50, rx:2, fill:"#f310ba" }, gg); T(gg, 214, 104, "GATE", { "font-size":"8", fill:"#ff9df2" });
    var wh = wheelGfx(layer, mods.wheel.x, mods.wheel.y, mods.wheel.r, bear); T(layer, mods.wheel.x, mods.wheel.y + mods.wheel.r + 18, "WATERWHEEL", { "font-size":"8", fill:"#ff9df2" });
    S("rect", { x:-10, y:MY + 52, width:380, height:30, fill:"#0a0e2c" }, layer);
    var mach = [];
    for(i = 0; i < Mn; i++){
      (function(k){
        var d = MD[k], x = MXs[k], g = S("g", null, layer);
        S("rect", { x:x - 38, y:MY, width:76, height:54, rx:8, fill:"#17206b", stroke:"#ff9df2", "stroke-width":1.6 }, g);
        S("rect", { x:x + 14, y:MY - 12, width:8, height:14, fill:"#2a2f7a" }, g);
        T(g, x - 16, MY + 28, d.icon, { "font-size":"20" }); T(g, x + 14, MY + 22, d.name, { "font-size":"8.5" }); T(g, x + 14, MY + 34, "needs " + d.d, { "font-size":"7.5", fill:"#9bdcf2" });
        var led = S("circle", { cx:x + 29, cy:MY + 8, r:4, fill:"#4b4f80" }, g), cnt = T(g, x, MY + 48, "", { "font-size":"8", fill:"#6dffb0" });
        var hit = S("rect", { x:x - 38, y:MY, width:76, height:54, fill:"transparent" }, g); eq(hit, "m" + k, d.name, api);
        mach.push({ d:d, x:x, led:led, cnt:cnt, linked:false, made:0 });
      })(i);
    }
    // links (below ports)
    var linkG = S("g", null, svg), dragPath = S("path", { d:"", fill:"none", stroke:"#fff", "stroke-width":3, "stroke-dasharray":"4 4", opacity:0, "pointer-events":"none" }, svg);
    var portG = S("g", null, svg), portEls = {};
    Object.keys(ports).forEach(function(id){
      var p = ports[id], g = S("g", { "data-port":id }, portG);
      S("circle", { cx:p.x, cy:p.y, r:20, fill:"transparent" }, g);
      var dot = S("circle", { cx:p.x, cy:p.y, r:7, fill:p.kind === "out" ? "#2fd2ff" : "#ff9df2", stroke:"#fff", "stroke-width":2 }, g);
      var ring = S("circle", { cx:p.x, cy:p.y, r:12, fill:"none", stroke:"#ffd35e", "stroke-width":2.4, opacity:0 }, g);
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", (p.kind === "out" ? "Output of " : "Input of ") + id.split(".")[0]);
      g.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); tapPort(id); } });
      portEls[id] = { dot:dot, ring:ring };
    });

    var MSG = {
      "spring.out>gate.in":"Water needs the reservoir first — store it, then regulate it.", "spring.out>wheel.in":"Water can't skip the reservoir and gate: the wheel needs controlled flow.",
      "res.out>wheel.in":"Put the gate between the reservoir and the wheel to control the flow.", "gate.out>res.in":"Water flows downstream, not back up."
    };
    function valid(a, b){
      if(a === "spring.out" && b === "res.in") return true; if(a === "res.out" && b === "gate.in") return true; if(a === "gate.out" && b === "wheel.in") return true;
      return a === "wheel.out" && /^m\d\.in$/.test(b);
    }
    function has(a, b){ return links.some(function(l){ return l.a === a && l.b === b; }); }
    function path(a, b){
      var p = ports[a], q = ports[b], vert = a === "wheel.out";
      return vert ? "M" + p.x + " " + p.y + "C" + p.x + " " + (p.y + 40) + " " + q.x + " " + (q.y - 40) + " " + q.x + " " + q.y : "M" + p.x + " " + p.y + "C" + (p.x + 26) + " " + p.y + " " + (q.x - 26) + " " + q.y + " " + q.x + " " + q.y;
    }
    function tryLink(a, b){
      var pa = ports[a], pb = ports[b];
      if(!pa || !pb || a === b) return;
      if(pa.kind === "in" && pb.kind === "out"){ var tmp = a; a = b; b = tmp; }
      if(has(a, b)){ api.say("Already connected — tap the link to remove it."); return; }
      if(!valid(a, b)){
        K.sfx("bad"); api.say(MSG[a + ">" + b] || (a.split(".")[0] === b.split(".")[0] ? "Connect to a different part." : (/^m\d\.in$/.test(b) && a !== "wheel.out" ? "Machines run on the wheel's shaft power — connect them to the wheel." : "That connection doesn't carry water or power the right way.")));
        if(motion()){ var el = portEls[b] && portEls[b].dot; if(el){ el.classList.remove("dbShake"); void el.getBoundingClientRect(); el.classList.add("dbShake"); } }
        return;
      }
      // one outgoing chain link per module output (the wheel can drive many machines) and one input per port
      for(var k = links.length - 1; k >= 0; k--){ if((links[k].a === a && a !== "wheel.out") || links[k].b === b) removeLink(links[k]); }
      var el2 = S("path", { d:path(a, b), fill:"none", stroke:a === "wheel.out" ? "#f310ba" : "#2fd2ff", "stroke-width":5, "stroke-linecap":"round", opacity:.9 }, linkG);
      var flowEl = S("path", { d:path(a, b), fill:"none", stroke:"#fff", "stroke-width":2, "stroke-dasharray":"2 9", "stroke-linecap":"round", opacity:.9, "pointer-events":"none" }, linkG);
      var hit = S("path", { d:path(a, b), fill:"none", stroke:"transparent", "stroke-width":22, "data-link":a + ">" + b }, linkG);
      var L2 = { a:a, b:b, el:el2, flow:flowEl, hit:hit, off:0 };
      hit.addEventListener("click", function(){ removeLink(L2); K.sfx("click"); api.say("Link removed."); });
      links.push(L2); K.sfx("good"); if(motion()) api.fx().burst(pb.x, pb.y, 6, "#2fd2ff", 40);
      sel = null; syncSel();
    }
    function removeLink(l){ var ix = links.indexOf(l); if(ix >= 0) links.splice(ix, 1); [l.el, l.flow, l.hit].forEach(function(e){ if(e.parentNode) e.parentNode.removeChild(e); }); }
    function syncSel(){ Object.keys(portEls).forEach(function(id){ portEls[id].ring.setAttribute("opacity", sel === id ? 1 : 0); }); }
    function tapPort(id){
      if(sel === null){ sel = id; syncSel(); K.sfx("tick"); api.say("Now tap where it should connect (or drag between the dots)."); return; }
      if(sel === id){ sel = null; syncSel(); return; }
      var s = sel; sel = null; syncSel(); tryLink(s, id);
    }
    // pointer: drag from a port to a port; a tap (no travel) selects, then a second tap connects
    var dragFrom = null, moved = false, startPt = null;
    root.addEventListener("pointerdown", function(e){
      var g = e.target.closest && e.target.closest("[data-port]"); if(!g) return;
      dragFrom = g.getAttribute("data-port"); moved = false; startPt = { x:e.clientX, y:e.clientY };
      try{ root.setPointerCapture(e.pointerId); }catch(_){}
    });
    root.addEventListener("pointermove", function(e){
      if(!dragFrom) return;
      if(Math.abs(e.clientX - startPt.x) + Math.abs(e.clientY - startPt.y) > 8) moved = true;
      if(moved){ var p = ptSvg(root, e), f = ports[dragFrom]; dragPath.setAttribute("d", "M" + f.x + " " + f.y + "L" + fmt(p.x) + " " + fmt(p.y)); dragPath.setAttribute("opacity", 1); }
    });
    function endDrag(e){
      if(!dragFrom) return;
      var from = dragFrom; dragFrom = null; dragPath.setAttribute("opacity", 0);
      if(!moved){ tapPort(from); return; }
      var el = document.elementFromPoint(e.clientX, e.clientY), g = el && el.closest && el.closest("[data-port]");
      if(g) tryLink(from, g.getAttribute("data-port")); else { sel = null; syncSel(); }
    }
    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", function(){ dragFrom = null; dragPath.setAttribute("opacity", 0); });

    var ctl = env.ctl, sl = slider(ctl, "GATE", 0, 100, stepPct, 0, function(val){ setGate(val, true); }, function(x){ return Math.round(x) + "%"; });
    function setGate(v, fs){ var nv = clamp(snap(v, stepPct), 0, 100); if(nv !== sp){ sp = nv; if(!fs) sl.set(sp); K.sfx("tick"); } }
    button(ctl, "CLEAR LINKS", "", function(){ links.slice().forEach(removeLink); sel = null; syncSel(); K.sfx("click"); });

    function nextHint(){
      if(L > 2) return null;
      if(!has("spring.out", "res.in")) return "res.in"; if(!has("res.out", "gate.in")) return "gate.in"; if(!has("gate.out", "wheel.in")) return "wheel.in";
      for(var k = 0; k < Mn; k++) if(!has("wheel.out", "m" + k + ".in")) return "m" + k + ".in";
      return null;
    }
    function connected(){ return { sr:has("spring.out", "res.in"), rg:has("res.out", "gate.in"), gw:has("gate.out", "wheel.in") }; }

    var rpm = 0;
    return {
      tips:"Drag from a blue ● (output) to a pink ● (input) — or tap one then the other: Spring → Reservoir → Gate → Wheel → every machine. Tap a link to remove it. Then tune the gate: too open drains the reservoir, too closed starves the factory.",
      explain:"A hydraulic system is a chain: store (reservoir), regulate (gate), convert (wheel), produce (machines). Each stage depends on the one before it — open the gate too far and the reservoir drains and the whole factory slows; too little and it starves.",
      hint:"Make sure every link is connected (blue chain, then pink shaft links to each machine). Then watch the RESERVOIR gauge: hold the gate where the level stays steady while POWER stays above the machines' need.",
      gauges:[{ id:"res", label:"RESERVOIR" }, { id:"gate", label:"GATE OPEN" }, { id:"flow", label:"FLOW TO WHEEL" }, { id:"pw", label:"POWER / NEED" }, { id:"units", label:"UNITS MADE" }, { id:"time", label:"TIME LEFT" }],
      step:function(dt){
        if(done || failed) return;
        t += dt; var cn = connected();
        var dip = dipOn && t > 18 && t < 26 ? 0.75 : 1;
        var qin = cn.sr ? Qin * dip : 0;
        a += clamp(sp / 100 - a, -0.7 * dt, 0.7 * dt);
        var h = V / Cap; Qg = cn.rg ? a * Kg * Math.sqrt(h) : 0;
        V += (qin - Qg) * dt; if(V > Cap){ spill += V - Cap; V = Cap; } if(V < 0){ V = 0; }
        var wflow = cn.rg && cn.gw ? Qg : 0; Pw = eta * wflow;
        var D = 0, R = 0; mach.forEach(function(m, k){ m.linked = has("wheel.out", "m" + k + ".in"); if(m.linked){ D += m.d.d; R += m.d.r; } });
        frac = D > 0 ? Math.min(1, Pw / D) : 0;
        mach.forEach(function(m){ if(m.linked && frac > 0){ var add = m.d.r * frac * dt; m.made += add; units += add; } });
        rpm += ((cn.gw ? clamp(wflow / (Qin * 1.1), 0, 1.3) * 44 * (D > 0 && frac < 1 ? 0.25 + 0.75 * frac : 1) : 0) - rpm) * Math.min(1, dt * 2.5);
        if(units >= U) done = true; else if(t >= TL) failed = true;
      },
      status:function(){ return done ? "success" : failed ? "fail" : "playing"; },
      efficient:function(){ return done && t <= TL * 0.7; },
      dbg:function(){ return { V:V, Cap:Cap, Qg:Qg, Pw:Pw, units:units, U:U, frac:frac, Qin:Qin, Kg:Kg, eta:eta, Mn:Mn, TL:TL, t:t, links:links.map(function(l){ return l.a + ">" + l.b; }) }; },
      failReason:function(){
        var cn = connected(), miss = [];
        if(!cn.sr) miss.push("Spring → Reservoir"); if(!cn.rg) miss.push("Reservoir → Gate"); if(!cn.gw) miss.push("Gate → Wheel");
        if(miss.length) return "Time ran out — the chain wasn't complete (missing: " + miss.join(", ") + ").";
        return "Time ran out at " + Math.floor(units) + " / " + U + " units. " + (V < Cap * 0.1 ? "The reservoir ran low, so the flow and power dropped." : frac < 1 ? "Power was below the machines' need." : "Some machines weren't connected to the wheel.");
      },
      draw:function(dt){
        var h = V / Cap;
        rWater.setAttribute("y", fmt(82 - h * 56, 1)); rWater.setAttribute("height", fmt(Math.max(0, h * 56), 1));
        rBand.textContent = Math.round(h * 100) + "%";
        gPlate.setAttribute("height", fmt(6 + 44 * (1 - a), 1));
        if(motion()){ wh.ang += rpm * 6 * dt; wh.set(wh.ang); } else wh.set(rpm * 1.2);
        var cn = connected();
        links.forEach(function(l){
          var isW = l.a === "wheel.out", q = isW ? (frac > 0 ? 1 : 0) : (l.a === "spring.out" ? (cn.sr ? Qin : 0) : Qg);
          l.flow.setAttribute("opacity", q > 0.05 ? ".9" : "0");
          if(motion()){ l.off -= (isW ? 10 + rpm : 12 + q * 2.5) * dt * 3; l.flow.setAttribute("stroke-dashoffset", fmt(l.off, 1)); } else l.flow.setAttribute("stroke-dasharray", "none");
        });
        mach.forEach(function(m){
          var run = m.linked && frac > 0.999, starved = m.linked && !run;
          m.led.setAttribute("fill", run ? "#6dffb0" : starved ? "#f310ba" : "#4b4f80");
          m.cnt.textContent = m.linked ? (run ? "▸ " : "⚠ ") + Math.floor(m.made) + " made" : "not connected";
          m.cnt.setAttribute("fill", run ? "#6dffb0" : "#ff9df2");
          if(run && motion() && Math.random() < dt * 2.5) api.fx().spawn(m.x + 18, MY - 12, (Math.random() - .5) * 14, -36, .8, 1.8, "#ffd35e");
        });
        var hp = nextHint();
        Object.keys(portEls).forEach(function(id){ var pe = portEls[id]; pe.dot.setAttribute("r", hp === id && motion() ? (7 + 2 * Math.sin(t * 6 + performance.now() / 160)).toFixed(1) : 7); });
      },
      gauge:function(g){
        var h = V / Cap, D = 0; mach.forEach(function(m){ if(m.linked) D += m.d.d; });
        g.gauge("res", Math.round(h * 100) + "%", h, { band:[0.2, 1], tone:h < 0.1 ? "warn" : "" });
        g.gauge("gate", Math.round(a * 100) + "%", a);
        g.gauge("flow", fmt(Qg) + " L/s", Qg / (Qin * 1.4));
        g.gauge("pw", fmt(Pw) + " / " + fmt(D), Pw / (Dtot * 1.25), { band:D > 0 ? [Math.min(1, D / (Dtot * 1.25)), 1] : null, tone:D > 0 && Pw >= D ? "good" : D > 0 ? "warn" : "" });
        g.gauge("units", Math.floor(units) + " / " + U, units / U, { tone:"good" });
        g.gauge("time", fmt(Math.max(0, TL - t), 0) + " s", Math.max(0, TL - t) / TL, { tone:TL - t < 10 ? "warn" : "" });
      },
      inspect:function(id){
        if(id.charAt(0) === "m"){ var m = mach[+id.slice(1)]; if(!m) return null; return { t:m.d.name, b:"Needs " + m.d.d + " power, makes " + m.d.r + "/s at full power. " + (m.linked ? "Connected." : "Not connected to the wheel yet.") + " Made " + Math.floor(m.made) + "." }; }
        return null;
      },
      destroy:function(){}
    };
  });
})();
