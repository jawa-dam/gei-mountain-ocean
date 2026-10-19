/* The six Days as CONTROLLERS on the shared stage + shared hydraulic state.
   A controller: configures hydro (preset), chooses the camera shot, builds its controls / hotspots / pickables, applies its objective, and exposes the Day interface the
   Builder shell drives (step · status · gauge · inspect · …). None of them decides rewards: the shell pays through the game's awardDay ledger. */
import { Vector3 } from "three";
import { createHydro } from "./hydro.js";
import { GEAR, SAW } from "./machines.js";
import { FORGE } from "./factory.js";
import { LAB } from "./damlab.js";
import { TERRACE, routeLayout } from "./source.js";
import { DAM_BD } from "./structures.js";
import { MILL } from "./structures.js";
import { WHEEL } from "./terrain.js";
import { clamp } from "./util.js";

const fmt = (v, d = 1) => v.toFixed(d);

/* shared HTML controls ---------------------------------------------------------------- */
export function mkSlider(ctl, id, label, min, max, step, val, onInput, unit = "%"){
  const w = document.createElement("div"); w.className = "dbSl";
  w.innerHTML = '<label for="' + id + '">' + label + '</label><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output></output>';
  const inp = w.querySelector("input"), out = w.querySelector("output"), sync = () => { out.textContent = Math.round(+inp.value) + unit; };
  inp.addEventListener("input", () => { sync(); onInput(+inp.value); }); sync(); ctl.appendChild(w);
  return { input:inp, set(v){ inp.value = v; sync(); } };
}
export function mkBtn(ctl, label, fn, min = "72px"){ const b = document.createElement("button"); b.type = "button"; b.className = "dbBtn"; b.style.minWidth = min; b.textContent = label; b.addEventListener("click", fn); ctl.appendChild(b); return b; }

/* push the shared hydraulic state into the stage's visual state (one place, so every Day shows the same thing the gauges show) */
export function publish(S, H, extra){
  const v = S.vs;
  if(S.source && !S.source.manual){ const q = Math.max(0, H.Qin); S.source.apply({ Qmax:12, edge:{ "src>F1":q, "F1>T1":q }, fall:q, fill:{} }); }      // the default terrace: the spring feeds the lake at the shared inflow rate
  v.gateA = H.gateA; v.relA = H.relA; v.Qrel = H.Qrel; v.resL = H.resL; v.pondL = H.pondL; v.Qg = H.Qg; v.Qref = H.Qref; v.spill = H.spillPond + H.spillRes; v.Qriver = H.Qriver;
  v.rpm = H.rpm; v.as = H.as; v.run = H.run; v.M = H.M; v.P = H.P; v.D = H.D; v.units = H.units;
  if(extra) Object.assign(v, extra);
}

/* DAY 5 — WATERWHEEL / MECHANICAL CONVERSION (the approved scene) -------------------------------- */
export function day5(env, S){
  const { api, ctl, level, up } = env, kit = env.kit, reduced = () => kit.reduced();
  const H = createHydro(level, up, { pin:9.0 });                      // a full, steady millpond: flow = 13 L/s × gate — exactly the approved Day 5 model
  const st = { t:0, HOLD:4, holdT:0, TL:Math.round(45 - Math.min(level - 1, 10) * 1.5), done:false, failed:false, why:"" };
  S.setShot("wheel", true);
  const sl = mkSlider(ctl, "db3dGate", "SLUICE GATE", 0, 100, 5, 0, v => { H.setGate(v); sl.set(H.gateSet); api.sfx("tick"); S.dirty(); });
  mkBtn(ctl, "− GATE", () => { H.setGate(H.gateSet - 5); sl.set(H.gateSet); api.sfx("tick"); S.dirty(); });
  mkBtn(ctl, "GATE +", () => { H.setGate(H.gateSet + 5); sl.set(H.gateSet); api.sfx("tick"); S.dirty(); });
  const eng = [mkBtn(ctl, "MILL · OFF", () => toggle(0))]; if(H.M > 1) eng.push(mkBtn(ctl, "SAW · OFF", () => toggle(1)));
  function toggle(i){ if(st.done || st.failed) return; H.engage(i); api.sfx(H.as[i] ? "click" : "tick"); api.inspect(i ? "saw" : "mill"); S.dirty(); }
  function syncBtns(){ eng.forEach((b, i) => { const on = H.as[i]; b.textContent = (i ? "SAW · " : "MILL · ") + (on ? "ENGAGED" : "OFF"); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); }
  syncBtns();
  S.setHot([{ label:"MILL", anchor:new Vector3(GEAR.lanternX - 1.7, MILL.floorY + 2.4, WHEEL.z + 1.5), fn:() => toggle(0), state:() => ({ on:H.as[0], run:H.run[0] }) }].concat(H.M > 1 ? [{ label:"SAW", anchor:new Vector3(SAW.fastX + 0.1, SAW.y + 1.3, SAW.z), fn:() => toggle(1), state:() => ({ on:H.as[1], run:H.run[1] }) }] : []));
  const { mach, parts } = S;
  S.pickList = [{ object:mach.lever, id:"mill" }, { object:mach.lantern, id:"mill" }, { object:mach.sawGroup, id:"saw" }, { object:parts.gate, id:"gate" }, { object:parts.handwheel, id:"gate" }, { object:parts.gateHouse, id:"gate" }, { object:mach.wheelWood, id:"wheel" }, { object:mach.drive, id:"wheel" }, { object:parts.dam, id:"dam" }];
  S.onTap = id => { if(id === "mill") toggle(0); else if(id === "saw" && H.M > 1) toggle(1); else api.inspect(id); };
  S.hotHidden = false;

  return {
    H, tips:"Drag the SLUICE GATE slider (or ± buttons) to lift the gate and send water down the flume. Then ENGAGE the mill clutch" + (H.M > 1 ? " and the saw belt" : "") + " — tap the hotspots, the lever / belt in the scene, or the buttons. Every machine must run at once for 4 seconds. Drag the scene to look around.",
    explain:"A waterwheel converts moving water into rotation. More flow means a faster wheel and more power (power ≈ efficiency × flow). A machine only works when the wheel can supply the power it needs — engage too many and the wheel slows under load.",
    hint:"Lift the gate until the POWER bar passes what the engaged machines need. Water you don't send to the wheel goes over the spillway. Engage every machine (tap the glowing hotspots) and hold it.",
    celebrateMs:1700,
    gauges:[{ id:"f0", label:"FLOW TO WHEEL" }, { id:"r0", label:"WHEEL SPEED" }, { id:"p0", label:"POWER / NEED" }, { id:"hold", label:"ALL RUNNING" }, { id:"time", label:"TIME LEFT" }],
    step(dt){
      if(!S.introDone && !reduced()) return;
      if(st.done || st.failed) return;
      st.t += dt; H.step(dt);
      let all = true; for(let i = 0; i < H.M; i++) if(!H.run[i]) all = false;
      if(all) st.holdT += dt; else st.holdT = 0;
      if(st.holdT >= st.HOLD){ st.done = true; return; }
      if(st.t >= st.TL){ st.failed = true; st.why = "Time ran out before every machine was running."; }
    },
    status(){ return st.done ? "success" : st.failed ? "fail" : "playing"; },
    efficient(){ return st.done && st.t <= st.TL * 0.6; },
    failReason(){ return st.why; },
    celebrate(){ S.celebrate(); },
    skipIntro(){ S.skipIntro(); },
    project:(x, y, z) => S.project(x, y, z), pixels:() => S.pixels(), _view:{ cam:S.cam },
    dbg(){ const si = S.info(); return { Q:H.Qg, P:H.P, D:H.D, rpm:H.rpm, a:H.gateA, sp:H.gateSet, as:H.as.slice(0, H.M), run:H.run.slice(0, H.M), holdT:st.holdT, t:st.t, TL:st.TL, Q0:H.Qref, cap:H.cap, eta:H.eta, M:H.M, wheelAngle:mach.drive.rotation.x, stoneAngle:mach.lantern.rotation.y, lift:S.vis.lift, gateY:parts.gate.position.y, introDone:S.introDone, info:si.info, mem:si.mem, quality:si.quality, dpr:si.dpr, saw:S.vis.saw, beltX:S.vis.beltX }; },
    gauge(a){
      const Pcap = H.eta * H.cap, ok = H.D > 0 && H.P >= H.D - 1e-9, left = Math.max(0, st.TL - st.t);
      a.gauge("f0", fmt(H.Qg) + " L/s", H.Qg / (H.cap * 1.3), { tone:"" });
      a.gauge("r0", fmt(H.rpm * 0.2) + " rpm", H.rpm / 62);
      a.gauge("p0", fmt(H.P) + " / " + fmt(H.D), H.P / Pcap, { band:H.D > 0 ? [Math.min(1, H.D / Pcap), 1] : null, tone:ok ? "good" : H.D > 0 ? "warn" : "" });
      a.gauge("hold", fmt(st.holdT) + " / " + st.HOLD + " s", st.holdT / st.HOLD, { tone:st.holdT > 0 ? "good" : "" });
      a.gauge("time", fmt(left, 0) + " s", left / st.TL, { tone:left < 8 ? "warn" : "" });
      syncBtns();
    },
    inspect(id){
      if(id === "gate") return { t:"SLUICE GATE", b:"Opening " + Math.round(H.gateA * 100) + "% → " + fmt(H.Qg) + " L/s to the wheel; the other " + fmt(H.Qref - H.Qg) + " L/s spills over the dam." };
      if(id === "wheel") return { t:"OVERSHOT WATERWHEEL", b:fmt(H.rpm * 0.2) + " rpm · power " + fmt(H.P) + " (η " + Math.round(H.eta * 100) + "%) · water falls into the buckets and its weight turns the wheel." };
      if(id === "mill") return { t:"MILL CLUTCH", b:"Needs " + H.defs[0].d + " power. " + (H.as[0] ? (H.run[0] ? "Running: the crown wheel drives the lantern pinion and the millstone." : "Engaged but starved — open the gate more.") : "Out of gear. Tap to engage.") };
      if(id === "saw") return { t:"SAW BELT", b:"Needs " + (H.defs[1] ? H.defs[1].d : 4) + " power. " + (H.as[1] ? (H.run[1] ? "Running: the belt rides the fast pulley and drives the blade." : "Engaged but starved — open the gate more.") : "Belt on the loose pulley (idle). Tap to shift it.") };
      if(id === "dam") return { t:"CONCRETE DAM", b:"A gravity dam: its weight resists the lake's push. Water not sent to the wheel goes over the stepped spillway." };
      return null;
    },
    draw(dt){ publish(S, H); S.frame(dt); },
    destroy(){ S.setHot([]); S.pickList = []; S.onTap = null; }
  };
}

/* ================================================================================================================================
   DAY 4 — SLUICE GATE / REGULATION : set the gate so the flow to the wheel lands in the target band and holds.
   The millpond's level (the head) drifts at higher levels, so the same gate gives different flow — the player keeps correcting while the water, the gate,
   the wheel and the machines all respond. Same flow law as everywhere: Q = gate × 13 × √((pond − 7.8)/1.2). */
export function day4(env, S){
  const { api, ctl, level, up } = env, kit = env.kit, reduced = () => kit.reduced(), act = up.act | 0, L = level;
  const TG = [6, 9, 10.5, 7, 10, 8, 9.5, 5, 10.5, 9, 6, 10.5], Nt = 1 + Math.min(2, Math.floor((L - 1) / 3)), tg = [];
  for(let j = 0; j < Nt; j++) tg.push(TG[(L * 2 + j * 5) % 12]);
  const amp = L < 4 ? 0 : Math.min(0.34, 0.08 * (L - 3)), tol = Math.max(0.5, 1.4 - 0.1 * (L - 1)) + 0.3 * act, HOLD = 3, TL = 24 * Nt + 6, stepPct = [5, 4, 2.5, 1][act];
  const H = createHydro(level, up, { pin:9.0, M:1 }); H.engage(0, true);               // the mill is the downstream equipment that shows the consequences
  const st = { t:0, idx:0, holdT:0, done:false, failed:false };
  S.setShot("gate", true);
  const sl = mkSlider(ctl, "db3dGate", "SLUICE GATE", 0, 100, stepPct, 0, v => { setGate(v); });
  function setGate(v){ H.gateSet = clamp(Math.round(v / stepPct) * stepPct, 0, 100); sl.set(H.gateSet); api.sfx("tick"); S.dirty(); }
  mkBtn(ctl, "− GATE", () => setGate(H.gateSet - stepPct)); mkBtn(ctl, "GATE +", () => setGate(H.gateSet + stepPct));
  const { mach, parts } = S;
  S.setHot([{ label:"GATE", anchor:new Vector3(7, 12.2, -16.35), fn:() => api.inspect("gate"), state:() => ({ run:Math.abs(H.Qg - tg[Math.min(st.idx, Nt - 1)]) <= tol }) }]);
  S.pickList = [{ object:parts.gate, id:"gate" }, { object:parts.gateHouse, id:"gate" }, { object:parts.pondSurface, id:"pond" }, { object:mach.wheelWood, id:"wheel" }, { object:parts.flume, id:"flume" }];
  S.onTap = id => api.inspect(id); S.hotHidden = false;
  const cur = () => tg[Math.min(st.idx, Nt - 1)];
  return {
    H, tips:"Drag the SLUICE GATE slider (or use the ± buttons) and watch the flow gauge and the wheel. Put the flow inside the pink band and keep it there until the bar fills. A deeper millpond pushes harder, so when the pond level changes the same gate gives a different flow.",
    explain:"A sluice gate regulates flow: more opening lets more water through, and deeper water (more head) pushes it out faster — flow ≈ opening × √head. Operators keep adjusting the gate to hold a target flow as conditions change.",
    hint:"Small gate changes make small flow changes. Move the gate until the FLOW bar sits in the green band, then keep still — if the pond level drifts, nudge the gate to compensate.",
    celebrateMs:1500,
    gauges:[{ id:"gate", label:"GATE OPEN" }, { id:"head", label:"POND LEVEL" }, { id:"flow", label:"FLOW" }, { id:"tgt", label:"TARGET" }, { id:"hold", label:"HOLD" }, { id:"time", label:"TIME LEFT" }],
    step(dt){
      if(!S.introDone && !reduced()) return; if(st.done || st.failed) return;
      st.t += dt; H.pin = 9.0 - amp * (0.5 + 0.5 * Math.sin(2 * Math.PI * st.t / 14)); H.step(dt);
      if(Math.abs(H.Qg - cur()) <= tol) st.holdT += dt; else st.holdT = Math.max(0, st.holdT - 2 * dt);
      if(st.holdT >= HOLD){ st.idx++; st.holdT = 0; api.sfx("good"); if(st.idx >= Nt){ st.done = true; return; } api.say("Target reached! New target: " + fmt(cur()) + " L/s"); }
      if(st.t >= TL) st.failed = true;
    },
    status(){ return st.done ? "success" : st.failed ? "fail" : "playing"; },
    efficient(){ return st.done && st.t <= TL * 0.7; },
    failReason(){ return "Time ran out before the flow was held in the target band (" + fmt(cur() - tol) + "–" + fmt(cur() + tol) + " L/s)."; },
    celebrate(){ S.celebrate(); }, skipIntro(){ S.skipIntro(); }, project:(x, y, z) => S.project(x, y, z), pixels:() => S.pixels(), _view:{ cam:S.cam },
    dbg(){ const si = S.info(); return { Q:H.Qg, h:H.pondL, a:H.gateA, sp:H.gateSet, tg:tg.slice(), idx:st.idx, tol, holdT:st.holdT, TL, t:st.t, rpm:H.rpm, P:H.P, as:H.as.slice(0, 1), run:H.run.slice(0, 1), gateY:parts.gate.position.y, introDone:S.introDone, info:si.info, mem:si.mem, quality:si.quality, wheelAngle:mach.drive.rotation.x }; },
    gauge(a){
      const inb = Math.abs(H.Qg - cur()) <= tol, QM = 13;
      a.gauge("gate", Math.round(H.gateA * 100) + "%", H.gateA);
      a.gauge("head", fmt(H.pondL, 2) + " m", (H.pondL - 7.8) / 1.4);
      a.gauge("flow", fmt(H.Qg) + " L/s", H.Qg / QM, { band:[clamp((cur() - tol) / QM, 0, 1), clamp((cur() + tol) / QM, 0, 1)], tone:inb ? "good" : "" });
      a.gauge("tgt", fmt(cur()) + " ±" + fmt(tol) + " (" + Math.min(st.idx + 1, Nt) + "/" + Nt + ")", cur() / QM);
      a.gauge("hold", fmt(st.holdT) + " / " + HOLD + " s", st.holdT / HOLD, { tone:inb ? "good" : "" });
      a.gauge("time", fmt(Math.max(0, TL - st.t), 0) + " s", Math.max(0, TL - st.t) / TL, { tone:TL - st.t < 6 ? "warn" : "" });
      S.setAdvice(inb ? { tone:"good", text:"ON TARGET — hold it steady (" + fmt(H.Qg) + " L/s)" } : H.Qg < cur() ? { tone:"warn", text:"TOO LITTLE FLOW — open the gate a little" } : { tone:"warn", text:"TOO MUCH FLOW — close the gate a little" });
    },
    inspect(id){
      if(id === "gate") return { t:"SLUICE GATE", b:"Opening " + Math.round(H.gateA * 100) + "% × √head " + fmt(Math.sqrt(Math.max(0, (H.pondL - 7.8) / 1.2)), 2) + " → " + fmt(H.Qg) + " L/s. Drag the slider to move it." };
      if(id === "pond") return { t:"MILLPOND", b:"Level " + fmt(H.pondL, 2) + " m. The deeper it is, the harder the water pushes through the gate (flow ∝ √head)." };
      if(id === "wheel") return { t:"WATERWHEEL", b:fmt(H.rpm * 0.2) + " rpm — it follows the flow the gate lets through." };
      if(id === "flume") return { t:"FLUME", b:"Carries " + fmt(H.Qg) + " L/s from the gate to the top of the wheel." };
      return null;
    },
    draw(dt){ publish(S, H); S.frame(dt); },
    destroy(){ S.setHot([]); S.pickList = []; S.onTap = null; S.setAdvice(null); }
  };
}

/* ================================================================================================================================
   DAY 3 — RESERVOIR / STORAGE : keep the lake inside its safe band while the weather changes.
   Level change = inflow − release. Open the release before a storm arrives, close it before a dry spell. The lake you see rising and falling IS the model. */
export function day3(env, S){
  const { api, ctl, level, up } = env, kit = env.kit, reduced = () => kit.reduced(), L = level, k = Math.min(L - 1, 10);
  const b = 5 + 0.3 * k, a = 3 + 0.35 * k, Out = Math.ceil(1.2 * (b + a) * 10) / 10, D = 36 + 2 * Math.min(L - 1, 6), valves = L >= 4 ? 2 : 1;
  const pts = [8 + ((L * 3) % 5), 19 + ((L * 2) % 4), 29 + (L % 4)];
  const inflow = tt => { let s = b + 0.5 * Math.sin(0.9 * tt); pts.forEach(p => { const x = (tt - p) / 6; if(Math.abs(x) < 1) s += a * (1 - x * x); }); return s; };
  const H = createHydro(level, up, { pin:7.8, M:1, inflow, relCoef:Out, relSat:true, dynamicLake:true, rel:0, freeRel:true });
  H.resCap = 240 * (1 + 0.1 * (up.liner | 0)); H.resV = (8.7 - 6.0) / 3.8 * H.resCap; H.relSet = 0; H.relA = 0; H.gateSet = 40; H.gateA = 0.4; H.engage(0, true);
  const LO = 8.2, HI = 9.2, st = { t:0, stress:0, inBand:0, done:false, failed:false, why:"", open:[false, false] };
  S.setShot("lake", true);
  const tg = [];
  const syncRel = () => { H.relSet = st.open.slice(0, valves).filter(Boolean).length / valves; for(let j = 0; j < valves; j++){ tg[j].textContent = (valves > 1 ? "RELEASE " + "AB"[j] : "RESERVOIR RELEASE") + ": " + (st.open[j] ? "OPEN" : "CLOSED"); tg[j].classList.toggle("on", st.open[j]); tg[j].setAttribute("aria-pressed", st.open[j] ? "true" : "false"); } };
  const toggleV = j => { if(st.done || st.failed) return; st.open[j] = !st.open[j]; api.sfx(st.open[j] ? "splash" : "click"); syncRel(); S.dirty(); };
  for(let j = 0; j < valves; j++) tg.push(mkBtn(ctl, "", () => toggleV(j), "150px"));
  syncRel();
  const { parts } = S;
  S.setHot([{ label:"RELEASE", anchor:new Vector3(7, 14.6, -25.6), fn:() => toggleV(0), state:() => ({ on:st.open[0] }) }]);
  S.pickList = [{ object:parts.releaseGate, id:"rel" }, { object:parts.releaseWheel, id:"rel" }, { object:parts.millpond, id:"rel" }, { object:parts.dam, id:"dam" }];
  S.onTap = id => { if(id === "rel") toggleV(0); else api.inspect(id); }; S.hotHidden = false;
  return {
    H, tips:"Open or close the RESERVOIR RELEASE (button, hotspot, or tap the release gate in the scene). Watch the forecast: store water before a dry spell, release it before the storm arrives. Keep the lake level inside the green band — too full spills over the dam, too low starves the mill.",
    explain:"A reservoir is a buffer: its level changes by inflow minus release. Holding water back before dry weather and releasing it ahead of a storm keeps the level safe — neither overflowing nor running dry.",
    hint:"The level only changes by inflow − release. If the forecast shows a storm coming, open the release early to make room; if it's dry, close it and keep the water.",
    celebrateMs:1500,
    gauges:[{ id:"lev", label:"LAKE LEVEL" }, { id:"in", label:"INFLOW" }, { id:"out", label:"RELEASE" }, { id:"st", label:"STRESS" }, { id:"time", label:"TIME LEFT" }],
    step(dt){
      if(!S.introDone && !reduced()) return; if(st.done || st.failed) return;
      st.t += dt; H.step(dt);
      if(H.overtopped){ st.failed = true; st.why = "The reservoir overtopped the dam! More water came in than went out and the level reached the crest."; return; }
      if(H.resL < LO || H.resL > HI) st.stress += dt; else { st.stress = Math.max(0, st.stress - 0.6 * dt); st.inBand += dt; }
      if(st.stress >= 5){ st.failed = true; st.why = "The lake stayed outside the safe band for too long (" + (H.resL > HI ? "too full — water was wasted over the spillway" : "too low — the mill could not draw water") + ")."; return; }
      if(st.t >= D) st.done = true;
    },
    status(){ return st.done ? "success" : st.failed ? "fail" : "playing"; },
    efficient(){ return st.done && st.inBand / Math.max(1, st.t) >= 0.92; },
    failReason(){ return st.why; },
    celebrate(){ S.celebrate(); }, skipIntro(){ S.skipIntro(); }, project:(x, y, z) => S.project(x, y, z), pixels:() => S.pixels(), _view:{ cam:S.cam },
    dbg(){ const si = S.info(); return { f:(H.resL - 6.0) / 3.8, L:H.resL, qin:H.Qin, qout:H.Qrel, open:st.open.slice(), valves, D, t:st.t, stress:st.stress, LO, HI, spill:H.spillRes, introDone:S.introDone, info:si.info, mem:si.mem, quality:si.quality, relA:H.relA, pondL:H.pondL }; },
    gauge(g){
      const out = H.resL < LO || H.resL > HI;
      g.gauge("lev", fmt(H.resL, 2) + " m", (H.resL - 6.0) / 3.8, { band:[(LO - 6.0) / 3.8, (HI - 6.0) / 3.8], tone:out ? "warn" : "good" });
      g.gauge("in", fmt(H.Qin) + " L/s", H.Qin / (b + a + 0.5));
      g.gauge("out", fmt(H.Qrel) + " L/s", H.Qrel / Out);
      g.gauge("st", fmt(st.stress) + " / 5", st.stress / 5, { tone:st.stress > 0.2 ? "warn" : "" });
      g.gauge("time", fmt(Math.max(0, D - st.t), 0) + " s", Math.max(0, D - st.t) / D);
      S.setForecast(inflow, st.t, 14, b - 1, b + a + 1);
      S.setAdvice(H.resL > HI ? { tone:"bad", text:"TOO FULL — open the release (water is spilling over the dam)" } : H.resL < LO ? { tone:"bad", text:"TOO LOW — close the release and store water" } : H.Qin > b + a * 0.5 ? { tone:"info", text:"STORM INFLOW — the lake is rising" } : { tone:"good", text:"LAKE IN THE SAFE BAND" });
    },
    inspect(id){
      if(id === "rel") return { t:"RESERVOIR RELEASE", b:(st.open.some(Boolean) ? "Open: releasing up to " : "Closed: would release up to ") + fmt(Out) + " L/s into the millpond. Tap to " + (st.open[0] ? "close" : "open") + "." };
      if(id === "dam") return { t:"DAM", b:"Holds the lake at " + fmt(H.resL, 2) + " m. Above 9.0 m water goes over the spillway; at 9.8 m it overtops the crest." };
      return null;
    },
    draw(dt){ publish(S, H, { rain:clamp((H.Qin - b - 0.6) / a, 0, 1) }); S.frame(dt); },
    destroy(){ S.setHot([]); S.pickList = []; S.onTap = null; S.setAdvice(null); S.setForecast(null); S.vs.rain = 0; }
  };
}

/* ================================================================================================================================
   DAY 6 — FACTORY / ORGANIZED SYSTEM : coordinate the WHOLE chain.
   Release from the reservoir, the sluice gate, the wheel and every machine share one state: draining the lake too fast slows the gate's flow, too little starves the
   wheel, engaging every machine overloads it. Reach the production target while the water keeps running on to the ocean. */
export function day6(env, S){
  const { api, ctl, level, up } = env, kit = env.kit, reduced = () => kit.reduced(), L = level;
  const Mn = L >= 3 ? 3 : 2, dip = L >= 3;
  const inflow = tt => 10.5 + 1.5 * Math.sin(0.35 * tt) * 0.5 - (dip && tt > 18 && tt < 28 ? 3 : 0);
  const H = createHydro(level, up, { pin:null, M:Mn, inflow, relCoef:20, relSat:true, dynamicLake:true, rel:0.5, resFrac:0.72 });
  H.resCap = 220 * (1 + 0.1 * (up.liner | 0)); H.resV = 0.72 * H.resCap; H.pondV = 0.78 * H.pondCap; H.relSet = 0.5; H.relA = 0.5; H.gateSet = 50; H.gateA = 0.5;
  const rmax = Math.min(1, H.eta * 13 / H.defs.slice(0, Mn).reduce((s, m) => s + m.d, 0)), rsum = H.defs.slice(0, Mn).reduce((s, m) => s + m.r, 0), U = Math.round(0.85 * rsum * rmax * 20), TL = Math.round(46 + 14 * Math.max(0, 1 - (L - 1) / 10));
  const st = { t:0, done:false, failed:false, why:"", okRiver:0 };
  S.setShot("factory", true);
  const slR = mkSlider(ctl, "db3dRel", "RELEASE", 0, 100, 5, 50, v => { H.setRelease(v / 100); api.sfx("tick"); S.dirty(); });
  const slG = mkSlider(ctl, "db3dGate", "SLUICE GATE", 0, 100, 5, 50, v => { H.setGate(v); api.sfx("tick"); S.dirty(); });
  const eng = H.defs.slice(0, Mn).map((m, i) => mkBtn(ctl, m.name + " · OFF", () => toggle(i), "92px"));
  function toggle(i){ if(st.done || st.failed) return; H.engage(i); api.sfx(H.as[i] ? "click" : "tick"); api.inspect(["mill", "saw", "hammer"][i]); S.dirty(); }
  function syncBtns(){ eng.forEach((b, i) => { const on = H.as[i]; b.textContent = H.defs[i].name + " · " + (on ? "ON" : "OFF"); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); }
  syncBtns();
  const views = ["factory", "ocean", "wheel", "lake"]; let vi = 0; const vb = mkBtn(ctl, "VIEW: FACTORY", () => { vi = (vi + 1) % views.length; S.setShot(views[vi]); vb.textContent = "VIEW: " + views[vi].toUpperCase(); }, "120px");
  const { mach, parts } = S;
  S.setHot([{ label:"MILL", anchor:new Vector3(GEAR.lanternX - 1.7, MILL.floorY + 2.4, WHEEL.z + 1.5), fn:() => toggle(0), state:() => ({ on:H.as[0], run:H.run[0] }) }, { label:"SAW", anchor:new Vector3(SAW.fastX + 0.1, SAW.y + 1.3, SAW.z), fn:() => toggle(1), state:() => ({ on:H.as[1], run:H.run[1] }) }].concat(Mn >= 3 ? [{ label:"HAMMER", anchor:new Vector3(FORGE.camX, 3.6, FORGE.shaftZ + 1.7), fn:() => toggle(2), state:() => ({ on:H.as[2], run:H.run[2] }) }] : []));
  S.pickList = [{ object:mach.lever, id:"mill" }, { object:mach.lantern, id:"mill" }, { object:mach.sawGroup, id:"saw" }, { object:parts.hammer, id:"hammer" }, { object:parts.factory, id:"hammer" }, { object:parts.gate, id:"gate" }, { object:parts.releaseGate, id:"rel" }, { object:mach.wheelWood, id:"wheel" }];
  S.onTap = id => { if(id === "mill") toggle(0); else if(id === "saw") toggle(1); else if(id === "hammer" && Mn >= 3) toggle(2); else api.inspect(id); }; S.hotHidden = false;
  return {
    H, tips:"Run the whole chain: set the RESERVOIR RELEASE (lake → millpond), the SLUICE GATE (millpond → wheel) and switch the machines on. Draining the lake too fast drops the head and the flow; too little water starves the wheel; every extra machine loads it. Reach the production target — and the spill and river show where the rest of the water goes.",
    explain:"A hydraulic system is a chain: store (reservoir), regulate (release and gate), convert (wheel), produce (machines). Each stage depends on the one before it: drain the lake too fast and the flow falls; open the gate too little and the wheel starves; overload it and everything slows.",
    hint:"Keep the LAKE near its level while the POWER bar stays above what the engaged machines need. If machines starve, open the gate or switch one off; if water spills, you are wasting power.",
    celebrateMs:1800,
    gauges:[{ id:"lake", label:"LAKE LEVEL" }, { id:"flow", label:"FLOW TO WHEEL" }, { id:"pw", label:"POWER / NEED" }, { id:"units", label:"UNITS MADE" }, { id:"sea", label:"TO THE OCEAN" }, { id:"time", label:"TIME LEFT" }],
    step(dt){
      if(!S.introDone && !reduced()) return; if(st.done || st.failed) return;
      st.t += dt; H.step(dt);
      if(H.units >= U){ st.done = true; return; }
      if(st.t >= TL){ st.failed = true; st.why = "Time ran out at " + Math.floor(H.units) + " / " + U + " units. " + (H.resL < 8.0 ? "The lake ran low, so the head and flow dropped." : H.D > 0 && H.f < 1 ? "Power was below the machines' need." : H.D === 0 ? "No machine was switched on." : "The system was not producing fast enough.") ; }
    },
    status(){ return st.done ? "success" : st.failed ? "fail" : "playing"; },
    efficient(){ return st.done && st.t <= TL * 0.7; },
    failReason(){ return st.why; },
    celebrate(){ S.celebrate(); }, skipIntro(){ S.skipIntro(); }, project:(x, y, z) => S.project(x, y, z), pixels:() => S.pixels(), _view:{ cam:S.cam },
    dbg(){ const si = S.info(); return { L:H.resL, pondL:H.pondL, Qin:H.Qin, Qrel:H.Qrel, Qg:H.Qg, P:H.P, D:H.D, f:H.f, units:H.units, U, TL, t:st.t, Mn, rpm:H.rpm, as:H.as.slice(0, Mn), run:H.run.slice(0, Mn), Qriver:H.Qriver, spill:H.spillRes + H.spillPond, relA:H.relA, gateA:H.gateA, introDone:S.introDone, info:si.info, mem:si.mem, quality:si.quality }; },
    gauge(a){
      const ok = H.D > 0 && H.P >= H.D - 1e-9, Pcap = H.eta * H.cap;
      a.gauge("lake", fmt(H.resL, 2) + " m", (H.resL - 6) / 3.8, { band:[(8.2 - 6) / 3.8, (9.2 - 6) / 3.8], tone:H.resL < 8.0 || H.resL > 9.3 ? "warn" : "good" });
      a.gauge("flow", fmt(H.Qg) + " L/s", H.Qg / 14);
      a.gauge("pw", fmt(H.P) + " / " + fmt(H.D), H.P / Pcap, { band:H.D > 0 ? [Math.min(1, H.D / Pcap), 1] : null, tone:ok ? "good" : H.D > 0 ? "warn" : "" });
      a.gauge("units", Math.floor(H.units) + " / " + U, H.units / U, { tone:"good" });
      a.gauge("sea", fmt(H.Qriver) + " L/s", H.Qriver / 20, { tone:"good" });
      a.gauge("time", fmt(Math.max(0, TL - st.t), 0) + " s", Math.max(0, TL - st.t) / TL, { tone:TL - st.t < 10 ? "warn" : "" });
      S.setAdvice(H.advice()); syncBtns();
    },
    inspect(id){
      if(id === "mill") return { t:"MILL", b:"Needs " + H.defs[0].d + " power. " + (H.as[0] ? (H.run[0] ? "Running." : "Starved — open the gate or drop a machine.") : "Out of gear. Tap to engage.") };
      if(id === "saw") return { t:"SAWMILL", b:"Needs " + H.defs[1].d + " power. " + (H.as[1] ? (H.run[1] ? "Running." : "Starved.") : "Belt idle. Tap to engage.") };
      if(id === "hammer") return { t:"TRIP HAMMER", b:"Needs " + H.defs[2].d + " power. " + (H.as[2] ? "Engaged." : "Off.") };
      if(id === "gate") return { t:"SLUICE GATE", b:Math.round(H.gateA * 100) + "% → " + fmt(H.Qg) + " L/s to the wheel." };
      if(id === "rel") return { t:"RESERVOIR RELEASE", b:Math.round(H.relA * 100) + "% → " + fmt(H.Qrel) + " L/s from the lake into the millpond." };
      if(id === "wheel") return { t:"WATERWHEEL", b:fmt(H.rpm * 0.2) + " rpm · power " + fmt(H.P) };
      return null;
    },
    draw(dt){ publish(S, H, { rain:dip && st.t > 16 && st.t < 30 ? 0.0 : 0 }); S.frame(dt); },
    destroy(){ S.setHot([]); S.pickList = []; S.onTap = null; S.setAdvice(null); }
  };
}

/* ================================================================================================================================
   DAY 2 — DAM WALL / CONTAINMENT : build the wall lift by lift, then fill the reservoir.
   Pressure grows with depth, so the base needs the thickest wall. The REAL dam's profile is rebuilt from your thicknesses; the engineer's section model beside the river
   shows the water, the pressure on every lift and the lift that gives way. Same wall rule as the SVG Day 2: lift r needs ceil((5 − r) × 0.8) blocks. */
const keepWall = {};
export function day2(env, S){
  const { api, ctl, level } = env, kit = env.kit, reduced = () => kit.reduced(), L = level, R = 5, m = 4 / R, MAXT = 4;
  const slack = Math.max(1, 5 - ((L - 1) >> 1)), need = [], rate = 0.45 + 0.03 * Math.min(L, 8);
  let minTotal = 0; for(let r = 0; r < R; r++){ need[r] = Math.ceil((R - r) * m - 1e-9); minTotal += need[r]; }
  const budget = minTotal + slack, th = keepWall[L] ? keepWall[L].slice() : [0, 0, 0, 0, 0], lab = S.lab, arch = S.world.arch;
  const st = { phase:"build", lev:0, failRow:-1, leakT:0, holdT:0, t:0, attempts:0 };
  const B = [-3, 0, 3.2, 6.0, 8.2, 9.0], levelY = lev => { const k = Math.min(R - 1, Math.floor(lev)), f = lev - k; return B[k] + (B[k + 1] - B[k]) * clamp(f, 0, 1); };
  const used = () => th.reduce((a, b) => a + b, 0), reqAt = (r, d) => d > 0 ? Math.ceil(d * m - 1e-9) : 0;
  const H = createHydro(level, up_(env), { pin:9.0, M:1 });
  function up_(e){ return e.up; }
  S.setShot("lab", true); lab.show = true; lab.group.visible = true; lab.th = th; lab.need = need;
  const apply = () => { lab.th = th; lab.rebuild(); arch.rebuildDam(th.map(u => 1.8 + 1.7 * u)); };
  apply();
  const tap = r => {
    if(st.phase !== "build") return;
    const nv = th[r] + 1, u = used() - th[r] + nv;
    if(nv > MAXT || u > budget){ if(nv <= MAXT && u > budget) api.say("Out of blocks — lift cleared. Spend them where the pressure is highest."); th[r] = 0; api.sfx("bad"); }
    else { th[r] = nv; api.sfx("tick"); }
    apply(); S.dirty();
  };
  const fillBtn = mkBtn(ctl, "▶ FILL RESERVOIR", () => { if(st.phase !== "build") return; if(used() === 0){ api.say("Build some wall first — tap a lift on the model."); api.sfx("bad"); return; } st.phase = "fill"; st.attempts++; api.sfx("splash"); }, "150px");
  const clrBtn = mkBtn(ctl, "CLEAR WALL", () => { if(st.phase !== "build") return; for(let r = 0; r < R; r++) th[r] = 0; apply(); api.sfx("click"); }, "110px");
  const hots = []; for(let r = 0; r < R; r++){ const yMid = ((DAM_BD[r] + DAM_BD[r + 1]) / 2 + 3) * LAB.sc;
    hots.push({ label:"L" + (r + 1) + " · " + th[r], text:() => "L" + (r + 1) + " · " + th[r], aria:"Wall lift " + (r + 1), pill:true, anchor:new Vector3(LAB.x + (LAB.w / 2 + 0.55) * LAB.k, (0.55 + yMid) * LAB.k, LAB.z - 0.3 * LAB.k), fn:() => tap(r), state:() => ({ on:th[r] >= need[r], run:false }) }); }
  S.setHot(hots);
  S.pickList = lab.hits.map(h => ({ object:h, id:"row" + h.userData.row })).concat([{ object:S.parts.dam, id:"dam" }]);
  S.onTap = id => { if(id.indexOf("row") === 0) tap(+id.slice(3)); else api.inspect(id); }; S.hotHidden = false;
  const bad = () => st.phase === "leak" || st.phase === "failed";
  return {
    H, tips:"Tap a lift of the wall (the numbered markers or the section model) to thicken it — 1 to 4 blocks, then back to 0. You only have a few blocks. Longer pink arrows = more pressure. Press FILL RESERVOIR when you are ready.",
    explain:"Water pressure grows with depth, so the deepest part of a dam carries the biggest load. That's why real dams are thick at the base and thinner toward the top: strength goes where the pressure is.",
    hint:"Look at the pink arrows on the model: the longest ones are at the bottom. Give the bottom lifts the thickest wall and the top lifts only a little.",
    celebrateMs:1500,
    gauges:[{ id:"lev", label:"RESERVOIR" }, { id:"prs", label:"BASE PRESSURE" }, { id:"blk", label:"BLOCKS LEFT" }],
    step(dt){
      if(!S.introDone && !reduced()) return; st.t += dt;
      if(st.phase === "fill"){
        st.lev = Math.min(R, st.lev + rate * dt);
        for(let i = 0; i < R; i++){ const d = st.lev - i; if(d > 0 && th[i] < reqAt(i, d)){ st.phase = "leak"; st.failRow = i; st.leakT = 0; keepWall[L] = th.slice(); api.sfx("bad"); lab.fail = i; return; } }
        if(st.lev >= R){ st.phase = "hold"; st.holdT = 0; }
      } else if(st.phase === "hold"){ st.holdT += dt; if(st.holdT >= 1.5){ st.phase = "done"; delete keepWall[L]; } }
      else if(st.phase === "leak"){ st.leakT += dt; if(st.leakT >= 1.6) st.phase = "failed"; }
    },
    status(){ return st.phase === "done" ? "success" : st.phase === "failed" ? "fail" : "playing"; },
    efficient(){ return used() <= minTotal + 1 && st.attempts === 1; },
    failReason(){ const r = st.failRow; return "Lift " + (r + 1) + " from the bottom leaked: the water above it pushes with pressure level " + need[r] + ", but that lift only had " + th[r] + " block" + (th[r] === 1 ? "" : "s") + "."; },
    celebrate(){ S.celebrate(); }, skipIntro(){ S.skipIntro(); }, project:(x, y, z) => S.project(x, y, z), pixels:() => S.pixels(), _view:{ cam:S.cam },
    dbg(){ const si = S.info(); return { R, need:need.slice(), th:th.slice(), budget, used:used(), lev:st.lev, phase:st.phase, minTotal, resL:S.vs.resL, introDone:S.introDone, info:si.info, mem:si.mem, quality:si.quality, failRow:st.failRow }; },
    gauge(g){
      const d0 = Math.max(0, st.lev), prs = Math.min(4, Math.ceil(d0 * m - 1e-9));
      g.gauge("lev", Math.round(st.lev / R * 100) + "%", st.lev / R);
      g.gauge("prs", "level " + prs + "/4", Math.min(1, d0 * m / 4), { tone:st.phase === "leak" ? "warn" : "" });
      g.gauge("blk", (budget - used()) + " / " + budget, (budget - used()) / budget, { tone:budget - used() === 0 ? "warn" : "" });
      fillBtn.disabled = clrBtn.disabled = st.phase !== "build";
      S.setAdvice(bad() ? { tone:"bad", text:"LEAK in lift " + (st.failRow + 1) + " — it was too thin for the pressure there" } : st.phase === "fill" ? { tone:"info", text:"RESERVOIR RISING — pressure grows with depth" } : st.phase === "hold" ? { tone:"good", text:"THE WALL HOLDS" } : { tone:"info", text:"BUILD THE WALL: thickest at the base, where the pressure is greatest" });
    },
    inspect(id){
      if(id.indexOf("row") === 0){ const r = +id.slice(3); return { t:"WALL LIFT " + (r + 1), b:"Pressure at full reservoir: level " + need[r] + " · you placed " + th[r] + ". " + (th[r] >= need[r] ? "Holds." : "Too thin!") }; }
      if(id === "dam") return { t:"THE DAM", b:"Your wall, lift by lift. The reservoir will push on it harder the deeper it gets." };
      return null;
    },
    draw(dt){
      const lev = st.lev, resL = levelY(lev); publish(S, H, { resL, pondL:Math.min(9.0, Math.max(7.8, resL)) });
      lab.update(lev);
      if(st.phase === "leak" || st.phase === "failed"){
        const r = st.failRow, tR = 1.8 + 1.7 * th[r], zf = -(17.6 - tR), y = Math.max(0.4, (DAM_BD[r] + DAM_BD[r + 1]) / 2);
        if(!reduced()) for(let i = 0; i < 3; i++) S.em.spray.emit(-3 + (Math.random() - .5) * 4, y, zf + 0.2, (Math.random() - .5) * 1.2, 0.4 + Math.random(), 3 + Math.random() * 3, 0.9, 0.2, 0.7);
      }
      S.frame(dt);
    },
    destroy(){ S.setHot([]); S.pickList = []; S.onTap = null; S.setAdvice(null); lab.show = false; lab.group.visible = false; lab.fail = -1; arch.rebuildDam(null); }
  };
}

/* ================================================================================================================================
   DAY 1 — MOUNTAIN SOURCE / SEPARATION : turn the forks on the source terrace so the spring's water reaches the right places.
   Water follows the open channel and divides at every fork. Fill every basin — the RESERVOIR chute is a real waterfall into the lake, which rises as it fills — before time runs out;
   anything sent to the scree drain or to a full basin is lost. Same fork graphs as the SVG Day 1 (1–3 forks by level). */
export function day1(env, S){
  const { api, ctl, level } = env, kit = env.kit, reduced = () => kit.reduced(), L = level, c = Math.min(3, 1 + ((L - 1) >> 1)), SRC = S.source;
  SRC.manual = true; SRC.setLayout(c);
  const N = SRC.nodes, forks = Object.keys(N).filter(k => N[k].t === "fork"), targets = Object.keys(N).filter(k => N[k].t === "tgt"), Q0 = 6, need = 18 + 3 * Math.min(L - 1, 8);
  const v = {}; targets.forEach(k => v[k] = 0);
  const totalNeed = need * targets.length, factor = Math.max(1.3, 1.9 - 0.06 * (L - 1)), TL = Math.round((totalNeed / Q0) * factor + 5);
  const st = { t:0, done:false, failed:false, spilled:0 }; let route = routeLayout(SRC, Q0);
  const H = createHydro(level, env.up, { pin:9.0, M:1 });
  S.setShot("source", true);
  const GLY = ["◀", "◀▶", "▶"], NAMES = ["A", "B", "C"];
  const turn = id => { if(st.done || st.failed) return; N[id].m = (N[id].m + 1) % 3; api.sfx("click"); api.inspect("fork:" + id); route = routeLayout(SRC, Q0); S.dirty(); sync(); };
  const btns = forks.map((id, i) => mkBtn(ctl, "", () => turn(id), "104px"));
  function sync(){ forks.forEach((id, i) => { btns[i].textContent = "FORK " + NAMES[i] + " " + GLY[N[id].m]; }); }
  sync();
  const y = TERRACE.top + 1.9;
  S.setHot(forks.map((id, i) => ({ label:"FORK " + NAMES[i], text:() => NAMES[i] + " " + GLY[N[id].m], aria:"Fork " + NAMES[i], anchor:new Vector3(N[id].x, y, N[id].z), fn:() => turn(id), state:() => ({ on:N[id].m !== 1, run:false }) })));
  S.pickList = SRC.hits.map(h => ({ object:h, id:"fork:" + h.userData.fork }));
  S.onTap = id => { if(id.indexOf("fork:") === 0) turn(id.slice(5)); else api.inspect(id); }; S.hotHidden = false;
  const frac = k => clamp(v[k] / need, 0, 1);
  return {
    H, tips:"Tap a fork (the lettered markers, or the wooden flap on the terrace) to turn it: ◀ everything left · ◀▶ split 50/50 · ▶ everything right. Fill every basin before time runs out — the RESERVOIR chute is a waterfall into the lake, and a full basin spills, so send the water on to the next one.",
    explain:"Water always follows the open channel downhill, and it separates wherever a channel forks. Controlling the forks controls where the water goes — and any water sent to a full basin or the scree drain is wasted.",
    hint:"Send all the water to one basin first, then turn the fork to the next. Never leave a fork pointing at the scree drain or at a basin that's already full.",
    celebrateMs:1500,
    gauges:[{ id:"q", label:"SPRING FLOW" }].concat(targets.map(k => ({ id:k, label:N[k].name }))).concat([{ id:"time", label:"TIME LEFT" }]),
    step(dt){
      if(!S.introDone && !reduced()) return; if(st.done || st.failed) return;
      st.t += dt; route = routeLayout(SRC, Q0); let all = true;
      targets.forEach(k => { const q = route.flows[k] || 0; if(v[k] < need) v[k] = Math.min(need, v[k] + q * dt); else st.spilled += q * dt; if(v[k] < need - 1e-6) all = false; });
      if(all) st.done = true; else if(st.t >= TL) st.failed = true;
    },
    status(){ return st.done ? "success" : st.failed ? "fail" : "playing"; },
    efficient(){ return st.done && st.t <= TL * 0.8; },
    failReason(){ return "Time ran out. " + targets.map(k => N[k].name + " " + Math.round(frac(k) * 100) + "%").join(" · ") + "."; },
    celebrate(){ S.celebrate(); }, skipIntro(){ S.skipIntro(); }, project:(x, y2, z) => S.project(x, y2, z), pixels:() => S.pixels(), _view:{ cam:S.cam },
    dbg(){ const si = S.info(); return { Q0, need, TL, t:st.t, modes:forks.map(k => N[k].m), targets:targets.map(k => ({ id:k, name:N[k].name, v:v[k], need })), flows:Object.assign({}, route.flows), lost:Object.keys(route.drain).reduce((a, k) => a + route.drain[k], 0), spilled:st.spilled, fall:route.flows.T1 || 0, c, introDone:S.introDone, info:si.info, mem:si.mem, quality:si.quality, resL:S.vs.resL }; },
    gauge(g){
      g.gauge("q", fmt(Q0) + " L/s", 1);
      targets.forEach(k => { const f = frac(k); g.gauge(k, Math.round(f * 100) + "%", f, { tone:f >= 0.999 ? "good" : "" }); });
      const left = Math.max(0, TL - st.t); g.gauge("time", fmt(left) + " s", left / TL, { tone:left < 4 ? "warn" : "" });
      const lost = Object.keys(route.drain).reduce((a, k) => a + route.drain[k], 0), toFull = targets.reduce((a, k) => a + (v[k] >= need - 1e-6 ? (route.flows[k] || 0) : 0), 0);
      S.setAdvice(lost > 0.2 ? { tone:"warn", text:"WATER IS BEING LOST DOWN THE SCREE DRAIN — turn the fork" } : toFull > 0.2 ? { tone:"warn", text:"A FULL BASIN IS SPILLING — send the water on to the next one" } : { tone:"good", text:"ALL THE WATER IS GOING TO USE" });
    },
    inspect(id){
      if(id.indexOf("fork:") === 0){ const f = id.slice(5); return { t:"FORK " + NAMES[forks.indexOf(f)], b:["Sends everything LEFT.", "Splits 50/50.", "Sends everything RIGHT."][N[f].m] + " Tap to change." }; }
      return null;
    },
    draw(dt){
      const fall = route.flows.T1 || 0, resL = 6.0 + 3.0 * frac("T1");
      const fill = {}; targets.forEach(k => fill[k] = frac(k));
      SRC.apply({ Qmax:Q0, edge:route.edge, fill, drain:route.drain, fall });
      publish(S, H, { resL, Qrel:0 }); S.vs.resL = resL; S.frame(dt);
    },
    destroy(){ S.setHot([]); S.pickList = []; S.onTap = null; S.setAdvice(null); SRC.manual = false; SRC.setLayout(1); }
  };
}
