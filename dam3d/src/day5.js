/* DAY 5 — WATERWHEEL / MECHANICAL CONVERSION, as a real-time 3D scene.
   The player controls the sluice gate (slider / ± / drag), and engages the mill clutch and the saw's belt (tap the 3D lever / belt, or the hotspots / buttons).
   Everything visible is driven by the deterministic model in sim.js: gate lifts → flow rate changes → water runs through the flume, falls into the buckets,
   the wheel turns in proportion, the crown wheel drives the lantern pinion → millstone, the axle pulley drives the saw. Rewards are NOT decided here:
   the shell reads status() and pays through the game's own awardDay ledger. */
import { Vector3, Raycaster, Vector2, Object3D, PointLight, Color, Mesh, SphereGeometry, CylinderGeometry } from "three";
import { createWorld, resize, bakeReflections } from "./world.js";
import { createSim } from "./sim.js";
import { buildMachines, GEAR, SAW } from "./machines.js";
import { buildWaterRig } from "./rig.js";
import { makeParticles } from "./particles.js";
import { WHEEL } from "./terrain.js";
import { MILL, GATE_SILL, GATE_TRAVEL } from "./structures.js";
import { clamp, lerp, sstep } from "./util.js";

const easeOutBack = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const ease = t => t * t * (3 - 2 * t);
const stage = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const TARGET = new Vector3(2.0, 7.2, -9.0);
const fmt = (v, d = 1) => v.toFixed(d);

export function createDay5(env){
  const { canvas, stageEl, ctl, api, kit, level } = env, up = env.up, reduced = () => kit.reduced();
  const tierN = level >= 6 ? 2 : level >= 3 ? 1 : 0;
  let world;
  try{ world = createWorld(canvas, { tier:tierN, quality:env.quality }); }catch(e){ console.warn("[DamBuilder3D] world failed: " + (e && e.message)); return null; }
  const { scene, camera, renderer, sun, q } = world, M = world.arch.M, T = world.T, parts = world.arch.parts;
  const sim = createSim(level, up.bear);
  const mach = buildMachines(M, T, tierN, up.bear); scene.add(mach.root);
  mach.sawGroup.visible = sim.M >= 2;
  const cap = q === "low" ? 1 : q === "high" ? 3 : 2;
  const em = { spray:makeParticles(160 * cap, "#f4fbff"), mist:makeParticles(90 * cap, "#e4eef4"), dust:makeParticles(90 * cap, "#f6efdc"), chips:makeParticles(60 * cap, "#d8b88a") };
  Object.values(em).forEach(e => scene.add(e.points));
  const rig = buildWaterRig(world, mach.drive); scene.add(rig.group);
  // lamps: emissive bulbs + one warm point light inside the mill that comes on when the mill runs
  const bulbs = [[-2.6, MILL.floorY + 2.7, -3.5], [-6.0, MILL.floorY + 2.7, -3.5], [-4.2, 3.7, -3.0], [SAW.blade + 0.4, 3.4, SAW.z + 1.6]];
  bulbs.forEach(b => { const m = new Mesh(new SphereGeometry(0.15, 10, 8), M.glass); m.position.set(b[0], b[1], b[2]); const cord = new Mesh(new CylinderGeometry(0.015, 0.015, 1.2, 4), M.dark); cord.position.set(b[0], b[1] + 0.7, b[2]); scene.add(m, cord); });
  const lamp = new PointLight(0xffb866, 0, 26, 1.6); lamp.position.set(-3.2, MILL.floorY + 3, -3); scene.add(lamp);
  em.spray.mat.uniforms.uScale.value = em.mist.mat.uniforms.uScale.value = em.dust.mat.uniforms.uScale.value = em.chips.mat.uniforms.uScale.value = 600;
  const capN = () => reduced() ? 0 : 1; // particle emission off when reduced
  const rdNow = () => reduced();

  try{ bakeReflections(world, [rig.group, em.spray.points, em.mist.points, em.dust.points, em.chips.points]); }catch(e){ console.warn('[DamBuilder3D] reflection bake skipped: ' + (e && e.message)); }

  /* ---------- controls (HTML, in the shell's panel) ---------- */
  const sl = document.createElement("div"); sl.className = "dbSl";
  sl.innerHTML = '<label for="db3dGate">SLUICE GATE</label><input id="db3dGate" type="range" min="0" max="100" step="5" value="0"><output>0%</output>';
  const inp = sl.querySelector("input"), out = sl.querySelector("output");
  const setGate = v => { sim.setGate(v); inp.value = sim.setpoint; out.textContent = Math.round(sim.setpoint) + "%"; api.sfx("tick"); dirty = true; };
  inp.addEventListener("input", () => setGate(+inp.value));
  ctl.appendChild(sl);
  const btn = (label, cls, fn) => { const b = document.createElement("button"); b.type = "button"; b.className = "dbBtn" + (cls ? " " + cls : ""); b.style.minWidth = "72px"; b.textContent = label; b.addEventListener("click", fn); ctl.appendChild(b); return b; };
  btn("− GATE", "", () => setGate(sim.setpoint - 5)); btn("GATE +", "", () => setGate(sim.setpoint + 5));
  const eng = [btn("MILL · OFF", "", () => toggle(0))];
  if(sim.M > 1) eng.push(btn("SAW · OFF", "", () => toggle(1)));
  function toggle(i){ if(sim.done || sim.failed) return; sim.engage(i); api.sfx(sim.as[i] ? "click" : "tick"); api.inspect(i ? "saw" : "mill"); dirty = true; }
  function syncBtns(){ eng.forEach((b, i) => { const on = sim.as[i]; b.textContent = (i ? "SAW · " : "MILL · ") + (on ? "ENGAGED" : "OFF"); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); }
  syncBtns();

  /* ---------- hotspots: DOM buttons anchored to 3D points (reliable 44px touch targets) ---------- */
  const hot = [];
  const mkHot = (label, anchor, fn) => { const b = document.createElement("button"); b.type = "button"; b.className = "db3dHot"; b.innerHTML = '<i></i><span>' + label + "</span>"; b.addEventListener("click", ev => { ev.stopPropagation(); fn(); }); stageEl.appendChild(b); hot.push({ b, anchor, fn }); return b; };
  mkHot("MILL", new Vector3(GEAR.lanternX - 1.7, MILL.floorY + 2.4, WHEEL.z + 1.5), () => toggle(0));
  if(sim.M > 1) mkHot("SAW", new Vector3(SAW.fastX + 0.1, SAW.y + 1.3, SAW.z), () => toggle(1));
  const proj = new Vector3();

  /* ---------- camera: composed per aspect, cinematic intro, touch orbit, idle drift, success push-in ---------- */
  const cam = { yaw:0, pitch:0, yawT:0, pitchT:0, hold:0, intro:0, celeb:0, ar:0.7 };
  const DIR = new Vector3(0.5, 0.16, 0.85).normalize();
  function frameCamera(time, dt){
    const ar = camera.aspect, base = lerp(56, 34, clamp((ar - 0.6) / 1.4, 0, 1)), celeb = cam.celeb ? ease(clamp(cam.celeb / 1.6, 0, 1)) : 0;
    const introT = reduced() ? 1 : ease(clamp(cam.intro / 3.0, 0, 1)), dist = base * (1 - 0.22 * celeb) * lerp(1.5, 1, introT);
    cam.hold = Math.max(0, cam.hold - dt); if(cam.hold === 0 && !drag){ cam.yawT *= Math.pow(0.35, dt); cam.pitchT *= Math.pow(0.35, dt); }
    cam.yaw += (cam.yawT - cam.yaw) * Math.min(1, dt * 6); cam.pitch += (cam.pitchT - cam.pitch) * Math.min(1, dt * 6);
    const sway = reduced() ? 0 : Math.sin(time * 0.23) * 0.035, az = Math.atan2(DIR.x, DIR.z) + cam.yaw + sway + (1 - introT) * 0.6 - celeb * 0.2;
    const el = Math.asin(DIR.y) + cam.pitch + (1 - introT) * 0.32 - celeb * 0.04, cl = Math.cos(el);
    camera.position.set(TARGET.x + Math.sin(az) * cl * dist, TARGET.y + Math.sin(el) * dist, TARGET.z + Math.cos(az) * cl * dist);
    const ty = TARGET.y + (ar < 1 ? lerp(2.0, 0, clamp((ar - 0.5) / 0.5, 0, 1)) : 0) - celeb * 0.0;
    camera.lookAt(TARGET.x - celeb * 3.2, ty, TARGET.z + celeb * 0.8);
  }

  /* ---------- state ---------- */
  let time = 0, dirty = true, lastRender = 0, drag = null, celebrating = false, runSecs = 0, lift = 0, beltX = SAW.fastX, lever = 0, blade = 0, introAll = 0, saw0 = 0, stoneA = 0, doneFlag = false;
  const ray = new Raycaster(), nd = new Vector2();
  const pick = [mach.lever, mach.lantern, mach.sawGroup, parts.gate, parts.handwheel, mach.wheelWood, parts.dam];
  function onPick(e){
    const r = canvas.getBoundingClientRect(); nd.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(nd, camera);
    const hits = ray.intersectObjects(pick, true); if(!hits.length) return;
    let o = hits[0].object, id = null;
    for(let n = o; n && !id; n = n.parent){ if(n === mach.lever || n === mach.lantern) id = "mill"; else if(n === mach.sawGroup) id = "saw"; else if(n === parts.gate || n === parts.handwheel || n === parts.gateHouse) id = "gate"; else if(n === mach.wheelWood || n === mach.drive) id = "wheel"; else if(n === parts.dam) id = "dam"; }
    if(id === "mill") toggle(0); else if(id === "saw" && sim.M > 1) toggle(1); else if(id) api.inspect(id);
  }
  canvas.addEventListener("pointerdown", e => { drag = { x:e.clientX, y:e.clientY, moved:false, yaw:cam.yawT, pitch:cam.pitchT, t:performance.now() }; try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
  canvas.addEventListener("pointermove", e => { if(!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if(Math.abs(dx) + Math.abs(dy) > 9) drag.moved = true; if(drag.moved){ cam.yawT = clamp(drag.yaw - dx * 0.005, -0.5, 0.5); cam.pitchT = clamp(drag.pitch + dy * 0.003, -0.16, 0.22); cam.hold = 3; dirty = true; } });
  const endDrag = e => { if(drag && !drag.moved && performance.now() - drag.t < 600){ if(introAll < 1 && !reduced()) cam.intro = Math.max(cam.intro, 3.2); else onPick(e); } drag = null; };
  canvas.addEventListener("pointerup", endDrag); canvas.addEventListener("pointercancel", () => { drag = null; });

  /* ---------- sizing + adaptive resolution ---------- */
  let dpr = Math.min(window.devicePixelRatio || 1, q === "high" ? 2 : q === "medium" ? 1.5 : 1), slow = 0, fastN = 0, w = 0, h = 0;
  function size(){ const r = stageEl.getBoundingClientRect(); w = Math.max(160, Math.round(r.width)); h = Math.max(120, Math.round(r.height)); resize(world, w, h, dpr); dirty = true; }
  const ro = new ResizeObserver(size); ro.observe(stageEl); size();
  world.lost.push(() => { if(env.onLost) env.onLost(); });

  /* ---------- the Day interface the shell drives ---------- */
  const def = {
    tips:"Drag the SLUICE GATE slider (or ± buttons) to lift the gate and send water down the flume. Then ENGAGE the mill clutch" + (sim.M > 1 ? " and the saw belt" : "") + " — tap the hotspots, the lever / belt in the scene, or the buttons. Every machine must run at once for 4 seconds. Drag the scene to look around.",
    explain:"A waterwheel converts moving water into rotation. More flow means a faster wheel and more power (power ≈ efficiency × flow). A machine only works when the wheel can supply the power it needs — engage too many and the wheel slows under load.",
    hint:"Lift the gate until the POWER bar passes what the engaged machines need. Water you don't send to the wheel goes over the spillway. Engage every machine (tap the glowing hotspots) and hold it.",
    _view:{ TARGET, DIR, cam },
    project(x, y, z){ const v = new Vector3(x, y, z).project(camera), r = canvas.getBoundingClientRect(); return [r.left + (v.x * 0.5 + 0.5) * r.width, r.top + (-v.y * 0.5 + 0.5) * r.height]; },
    pixels(){ const gl = renderer.getContext(), n = 24, buf = new Uint8Array(4), out = []; for(let j = 1; j < n; j++) for(let i = 1; i < n; i++){ gl.readPixels(Math.floor(gl.drawingBufferWidth * i / n), Math.floor(gl.drawingBufferHeight * j / n), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf); out.push([buf[0], buf[1], buf[2]]); } return out; },
    celebrateMs:1700, skipIntro(){ cam.intro = 4; dirty = true; },
    gauges:[{ id:"f0", label:"FLOW TO WHEEL" }, { id:"r0", label:"WHEEL SPEED" }, { id:"p0", label:"POWER / NEED" }, { id:"hold", label:"ALL RUNNING" }, { id:"time", label:"TIME LEFT" }],
    step(dt){ if(introAll < 1 && !reduced()) return; sim.step(dt); },
    status(){ return sim.done ? "success" : sim.failed ? "fail" : "playing"; },
    efficient(){ return sim.done && sim.t <= sim.TL * 0.6; },
    failReason(){ return sim.why; },
    celebrate(){ celebrating = true; cam.celeb = 0.001; dirty = true; for(let i = 0; i < 40 && capN(); i++){ em.dust.emit(-3 + Math.random() * 6, MILL.floorY + 1 + Math.random() * 2, -3 + Math.random() * 3, (Math.random() - .5) * 1.5, 0.8 + Math.random(), (Math.random() - .5), 2.4, 0.7, 0.5); } },
    dbg(){ return { Q:sim.Q, P:sim.P, D:sim.D, rpm:sim.rpm, a:sim.a, sp:sim.setpoint, as:sim.as.slice(), run:sim.run.slice(), holdT:sim.holdT, t:sim.t, TL:sim.TL, Q0:sim.Q0, cap:sim.cap, eta:sim.eta, M:sim.M, wheelAngle:mach.drive.rotation.x, stoneAngle:mach.lantern.rotation.y, lift, gateY:parts.gate.position.y, introDone:introAll >= 1, info:renderer.info.render, mem:renderer.info.memory, quality:q, dpr, saw:sim.M > 1 ? mach.arbor.rotation.x : null, beltX }; },
    gauge(a){
      const Pcap = sim.eta * sim.cap, ok = sim.D > 0 && sim.P >= sim.D - 1e-9, left = Math.max(0, sim.TL - sim.t);
      a.gauge("f0", fmt(sim.Q) + " L/s", sim.Q / (sim.cap * 1.3), { tone:"" });
      a.gauge("r0", fmt(sim.rpm * 0.2) + " rpm", sim.rpm / 62);
      a.gauge("p0", fmt(sim.P) + " / " + fmt(sim.D), sim.P / Pcap, { band:sim.D > 0 ? [Math.min(1, sim.D / Pcap), 1] : null, tone:ok ? "good" : sim.D > 0 ? "warn" : "" });
      a.gauge("hold", fmt(sim.holdT) + " / " + sim.HOLD + " s", sim.holdT / sim.HOLD, { tone:sim.holdT > 0 ? "good" : "" });
      a.gauge("time", fmt(left, 0) + " s", left / sim.TL, { tone:left < 8 ? "warn" : "" });
      syncBtns();
    },
    inspect(id){
      if(id === "gate") return { t:"SLUICE GATE", b:"Opening " + Math.round(sim.a * 100) + "% → " + fmt(sim.Q) + " L/s to the wheel; the other " + fmt(sim.Q0 - sim.Q) + " L/s spills over the dam." };
      if(id === "wheel") return { t:"OVERSHOT WATERWHEEL", b:fmt(sim.rpm * 0.2) + " rpm · power " + fmt(sim.P) + " (η " + Math.round(sim.eta * 100) + "%) · water falls into the buckets and its weight turns the wheel." };
      if(id === "mill") return { t:"MILL CLUTCH", b:"Needs " + sim.defs[0].d + " power. " + (sim.as[0] ? (sim.run[0] ? "Running: the crown wheel drives the lantern pinion and the millstone." : "Engaged but starved — open the gate more.") : "Out of gear. Tap to engage.") };
      if(id === "saw") return { t:"SAW BELT", b:"Needs " + (sim.defs[1] ? sim.defs[1].d : 4) + " power. " + (sim.as[1] ? (sim.run[1] ? "Running: the belt rides the fast pulley and drives the blade." : "Engaged but starved — open the gate more.") : "Belt on the loose pulley (idle). Tap to shift it.") };
      if(id === "dam") return { t:"CONCRETE DAM", b:"A gravity dam: its weight resists the lake's push. Water not sent to the wheel goes over the stepped spillway." };
      return null;
    },
    draw(dt){
      dt = Math.min(dt, 0.1); time += dt;
      if(introAll < 1 && (rdNow() || (env.isPlaying ? env.isPlaying() : true))) cam.intro += dt * (env.fast ? 2.6 : 1);
      const rd = reduced(), rpmV = sim.rpm * 0.2, om = rpmV * Math.PI * 2 / 60;          // rad/s
      introAll = rd ? 1 : clamp(cam.intro / 3.2, 0, 1);
      if(celebrating) cam.celeb += dt;
      if(rd){ if(!dirty && time - lastRender < 0.25) return; mach.drive.rotation.x = -rpmV * 0.9; }
      else mach.drive.rotation.x -= om * dt;
      // gate: the plate rises with the actual opening; handwheel + stems turn with it
      parts.gate.position.y = GATE_SILL + 1.6 + sim.a * GATE_TRAVEL; parts.handwheel.rotation.z = sim.a * 9 * Math.PI;
      // mill clutch: engaged = lantern meshed with the crown wheel; disengaged = lifted clear and coasting to a stop
      const mi = sim.as[0] ? 1 : 0; lift += ((1 - mi) * 0.62 - lift) * Math.min(1, dt * 4); mach.lantern.position.y = lift;
      lever += ((mi ? 1 : -1) * 0.5 - lever) * Math.min(1, dt * 6); mach.lever.rotation.z = lever;
      stoneA = mi ? om * (GEAR.crownN / GEAR.lanternN) : stoneA * Math.pow(0.15, dt); mach.lantern.rotation.y += (rd ? 0 : stoneA) * dt;
      if(rd && mi) mach.lantern.rotation.y = rpmV * 1.7;
      // saw: belt shifts between the loose and fast pulleys; blade turns only on the fast pulley
      if(sim.M > 1){
        const si = sim.as[1] ? 1 : 0; beltX += ((si ? SAW.fastX : SAW.looseX) - beltX) * Math.min(1, dt * 5); mach.belt.position.x = beltX;
        const ratio = 0.78 / SAW.pulleyR; blade = si ? om * ratio : blade * Math.pow(0.2, dt); mach.arbor.rotation.x -= (rd ? 0 : blade) * dt; if(rd && si) mach.arbor.rotation.x = -rpmV * 3;
        if(!rd) mach.beltTex.offset.y -= om * 0.78 / 1.2 * dt;
        const lg = mach.log; if(si && sim.run[1]){ saw0 += dt * 0.16 * (sim.P / Math.max(sim.D, 1)); if(saw0 > 3.2) saw0 = 0; } lg.position.x = 6.1 - saw0;
        if(!rd && si && sim.run[1] && Math.random() < dt * 40 && saw0 > 1.3) em.chips.emit(SAW.blade + 0.1, SAW.y + 0.5, SAW.z + 0.2, 1.4 + Math.random(), 1.5 + Math.random() * 1.5, (Math.random() - .5) * 2, 0.7, 0.1, 0.8);
      }
      // production visuals: flour pile, dust over the stone, lamps
      if(sim.run[0]){ runSecs += dt; mach.flour.scale.y = Math.min(1, 0.01 + runSecs / 30); if(!rd && Math.random() < dt * 20) em.dust.emit(GEAR.lanternX + (Math.random() - .5) * 1.8, MILL.floorY + 1.1, WHEEL.z + (Math.random() - .5) * 1.8, (Math.random() - .5) * 0.5, 0.35, (Math.random() - .5) * 0.5, 2.2, 0.55, 0.28); }
      const lit = (sim.run.some(Boolean) ? 1 : 0) * 0.85 + (tierN >= 2 ? 0.25 : 0) + (celebrating ? 0.6 : 0); lamp.intensity += (lit * 38 - lamp.intensity) * Math.min(1, dt * 3);
      M.glass.emissiveIntensity = lamp.intensity / 20;
      // build-in animation
      buildIn(cam.intro, rd);
      frameCamera(time, dt);
      rig.update(sim, dt, time, mach.drive.rotation.x, em, rd, introAll);
      mach.root.visible = cam.intro > 2.0 || rd;
      renderer.toneMappingExposure = 1.05 + (celebrating ? 0.22 * Math.sin(clamp(cam.celeb / 1.6, 0, 1) * Math.PI) : 0);
      world.shared.uTime.value = rd ? 0 : time; world.sky.material.uniforms.uTime.value = rd ? 0 : time;
      if(!rd){ em.spray.update(dt, 9, 0.5, 0.7); em.mist.update(dt, -0.3, 0.8, 1.6); em.dust.update(dt, -0.02, 0.6, 1.4); em.chips.update(dt, 9, 0.4, 0.2); }
      // hotspots follow their 3D anchors
      const hw = canvas.clientWidth, hh = canvas.clientHeight;
      hot.forEach((o, i) => { proj.copy(o.anchor).project(camera); const vis = proj.z < 1 && introAll > 0.95 && !sim.done; o.b.style.display = vis ? "flex" : "none"; if(vis){ o.b.style.transform = "translate(" + ((proj.x * 0.5 + 0.5) * hw - 22).toFixed(0) + "px," + ((-proj.y * 0.5 + 0.5) * hh - 22).toFixed(0) + "px)"; o.b.classList.toggle("on", !!sim.as[i]); o.b.classList.toggle("run", !!sim.run[i]); } });
      const t0 = performance.now(); renderer.render(scene, camera); lastRender = time; dirty = false;
      // adaptive resolution: sustained slow frames lower the render scale (then shadows) so a weak phone stays smooth
      const ft = performance.now() - t0; if(dt > 0.034){ slow += dt; fastN = 0; } else { fastN++; slow = Math.max(0, slow - dt); }
      if(slow > 1.2 && dpr > 0.7){ dpr = Math.max(0.7, dpr * 0.8); slow = 0; size(); } else if(slow > 1.2 && sun.castShadow){ sun.castShadow = false; slow = 0; }
    },
    destroy(){
      ro.disconnect(); hot.forEach(o => o.b.remove());
      scene.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { for(const k in m){ const v = m[k]; if(v && v.isTexture) v.dispose(); } if(m.uniforms) for(const k in m.uniforms){ const v = m.uniforms[k].value; if(v && v.isTexture) v.dispose(); } m.dispose(); }); } });
      if(world.reflections) world.reflections.forEach(r => r.dispose());
      Object.values(world.T).forEach(t => Object.values(t).forEach(x => x && x.dispose && x.dispose()));
      if(scene.environment) scene.environment.dispose();
      renderer.dispose(); try{ renderer.forceContextLoss(); }catch(e){}
    }
  };

  /* ---------- construction: the world assembles itself in sequence ---------- */
  const pivot = (g, y0) => g.userData.p = y0;
  const grow = (g, s, y0 = -1) => { g.scale.y = Math.max(0.001, s); g.position.y = y0 * (1 - s); };
  function buildIn(t, rd){
    if(rd){ [parts.dam, parts.flume, parts.tailrace, parts.mill, mach.drive].forEach(g => { g.scale.set(1, 1, 1); g.position.set(g.userData.bx || 0, 0, 0); }); parts.gateHouse.position.y = 0; mach.drive.scale.setScalar(1); return; }
    grow(parts.dam, easeOutBack(stage(t, 0.1, 1.1)), -7);
    parts.gateHouse.position.y = (1 - easeOutBack(stage(t, 0.9, 1.7))) * 10; parts.gateHouse.visible = t > 0.9;
    grow(parts.flume, easeOutBack(stage(t, 1.2, 2.0)), 0); parts.flume.visible = t > 1.2;
    grow(parts.tailrace, easeOutBack(stage(t, 1.4, 2.1)), -1); parts.tailrace.visible = t > 1.4;
    grow(parts.mill, easeOutBack(stage(t, 1.5, 2.4)), 0); parts.mill.visible = t > 1.5;
    const ws = easeOutBack(stage(t, 1.9, 2.8)); mach.drive.scale.setScalar(Math.max(0.001, ws)); mach.drive.visible = t > 1.9;
    mach.lantern.scale.setScalar(Math.max(0.001, easeOutBack(stage(t, 2.1, 2.9)))); mach.lever.visible = t > 2.2;
  }
  buildIn(0, reduced());
  return def;
}
