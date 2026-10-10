/* THE STAGE — one persistent real-time 3D world shared by all six Days.
   Built once (terrain · sky · lake · dam · gate house · flume · wheel · gear train · mill · sawmill · river · reflections), then the Days attach to it as
   controllers: they set the shared hydraulic state (hydro.js), pick a camera shot, register hotspots / pickable objects and read the same state for their gauges.
   The renderer, textures, geometry, water shaders, lighting and shadows are therefore identical in every Day. */
import { Vector3, Raycaster, Vector2, PointLight, Mesh, SphereGeometry, CylinderGeometry } from "three";
import { createWorld, resize, bakeReflections } from "./world.js";
import { buildMachines, GEAR, SAW } from "./machines.js";
import { buildWaterRig } from "./rig.js";
import { makeParticles } from "./particles.js";
import { buildMillpond } from "./millpond.js";
import { buildFactory } from "./factory.js";
import { buildDamLab } from "./damlab.js";
import { buildSource } from "./source.js";
import { WHEEL } from "./terrain.js";
import { MILL, GATE_SILL, GATE_TRAVEL } from "./structures.js";
import { clamp, lerp } from "./util.js";

export const ease = t => t * t * (3 - 2 * t);
const easeOutBack = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const phase = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

/* Camera shots: same lens, same elevation language, same orbit rules — only the framing changes. `wheel` is the APPROVED composition and must not drift. */
export const SHOTS = {
  wheel:   { target:[2.0, 7.2, -9.0],  dir:[0.5, 0.16, 0.85],  tall:56, wide:34 },
  lab:     { target:[0.0, 4.0, 0.0],   dir:[0.34, 0.2, 0.92],  tall:66, wide:44 },
  gate:    { target:[7.0, 9.0, -13.0], dir:[0.3, 0.24, 0.92],  tall:38, wide:25 },
  dam:     { target:[2.0, 5.5, -13.0], dir:[0.38, 0.12, 0.92], tall:62, wide:40 },
  lake:    { target:[0.0, 9.0, -42.0], dir:[0.08, 0.3, 0.95],  tall:74, wide:48 },
  source:  { target:[43.0, 22.0, -48.0], dir:[-0.62, 0.52, 0.30],  tall:50, wide:32 },
  factory: { target:[-3.0, 3.6, -1.0], dir:[0.34, 0.26, 0.90], tall:70, wide:46 },
  ocean:   { target:[6.0, 0.0, 62.0],  dir:[0.0, 0.3, -0.95], tall:110, wide:72 }
};

export function createStage(env){
  const { canvas, stageEl, kit, level } = env, up = env.up, reduced = () => kit.reduced();
  const tierN = level >= 6 ? 2 : level >= 3 ? 1 : 0;
  const world = createWorld(canvas, { tier:tierN, quality:env.quality });
  const { scene, camera, renderer, sun, q } = world, M = world.arch.M, T = world.T, parts = world.arch.parts;
  const mach = buildMachines(M, T, tierN, up.bear); scene.add(mach.root);
  const cap = q === "low" ? 1 : q === "high" ? 3 : 2;
  const em = { spray:makeParticles(160 * cap, "#f4fbff"), mist:makeParticles(90 * cap, "#e4eef4"), dust:makeParticles(90 * cap, "#f6efdc"), chips:makeParticles(60 * cap, "#d8b88a"), rain:makeParticles(120 * cap, "#d6e6ff"), smoke:makeParticles(70 * cap, "#7d7f88"), spark:makeParticles(50 * cap, "#ffb050") };
  Object.values(em).forEach(e => { scene.add(e.points); e.mat.uniforms.uScale.value = 600; });
  em.rain.mat.uniforms.uScale.value = 260; em.spark.mat.uniforms.uScale.value = 380;
  const rig = buildWaterRig(world, mach.drive); scene.add(rig.group);
  const bulbs = [[-2.6, MILL.floorY + 2.7, -3.5], [-6.0, MILL.floorY + 2.7, -3.5], [-4.2, 3.7, -3.0], [SAW.blade + 0.4, 3.4, SAW.z + 1.6]];
  bulbs.forEach(b => { const m = new Mesh(new SphereGeometry(0.15, 10, 8), M.glass); m.position.set(b[0], b[1], b[2]); const cord = new Mesh(new CylinderGeometry(0.015, 0.015, 1.2, 4), M.dark); cord.position.set(b[0], b[1] + 0.7, b[2]); scene.add(m, cord); });
  const lamp = new PointLight(0xffb866, 0, 26, 1.6); lamp.position.set(-3.2, MILL.floorY + 3, -3); scene.add(lamp);

  const S = { world, scene, camera, renderer, sun, q, mats:M, T, parts, mach, em, rig, lamp, tierN, env, extras:[], hotList:[], pickList:[], onTap:null };
  S.hook = [];                                                    // extra per-frame visual updaters (millpond, ocean, source works …)
  buildMillpond(S); buildFactory(S); S.lab = buildDamLab(S); buildSource(S);
  S.vs = { gateA:0, relA:1, resL:9.0, pondL:9.0, Qg:0, Qref:13, spill:0, Qriver:0, rpm:0, as:[false, false, false], run:[false, false, false], M:2, P:0, D:0, units:0, rain:0 };
  return S;
}

/* ---- the part of the stage that needs the finished world: reflections, camera, input, sizing, per-frame application of the shared state ---- */
export function startStage(S){
  const { world, scene, camera, renderer, sun, q, parts, mach, em, rig, lamp, env } = S, kit = env.kit, reduced = () => kit.reduced(), canvas = env.canvas, stageEl = env.stageEl;
  const vs = S.vs, proj = new Vector3();
  try{ bakeReflections(world, [rig.group, em.spray.points, em.mist.points, em.dust.points, em.chips.points, em.rain.points, em.smoke.points, em.spark.points, ...S.extras.filter(o => o && o.userData && o.userData.noReflect)]); }catch(e){ console.warn("[DamBuilder3D] reflection bake skipped: " + (e && e.message)); }

  /* ---------- camera ---------- */
  const cam = { yaw:0, pitch:0, yawT:0, pitchT:0, hold:0, intro:0, celeb:0 };
  const cur = { target:new Vector3(...SHOTS.wheel.target), dir:new Vector3(...SHOTS.wheel.dir).normalize(), tall:SHOTS.wheel.tall, wide:SHOTS.wheel.wide }, from = { target:new Vector3(), dir:new Vector3(), tall:0, wide:0 };
  let shot = "wheel", shotT = 1, drag = null, time = 0, dirty = true, lastRender = 0, celebrating = false;
  S.setShot = (name, instant) => {
    const d = SHOTS[name]; if(!d || (name === shot && shotT >= 1)) return; shot = name;
    from.target.copy(cur.target); from.dir.copy(cur.dir); from.tall = cur.tall; from.wide = cur.wide;
    S._to = { target:new Vector3(...d.target), dir:new Vector3(...d.dir).normalize(), tall:d.tall, wide:d.wide }; shotT = instant || reduced() ? 1 : 0; if(shotT === 1) applyShot(1);
    dirty = true;
  };
  function applyShot(k){ const e = ease(k), t = S._to; cur.target.lerpVectors(from.target, t.target, e); cur.dir.lerpVectors(from.dir, t.dir, e).normalize(); cur.tall = lerp(from.tall, t.tall, e); cur.wide = lerp(from.wide, t.wide, e); }
  function frameCamera(dt){
    if(shotT < 1){ shotT = Math.min(1, shotT + dt / 1.7); applyShot(shotT); }
    const ar = camera.aspect, base = lerp(cur.tall, cur.wide, clamp((ar - 0.6) / 1.4, 0, 1)), celeb = cam.celeb ? ease(clamp(cam.celeb / 1.6, 0, 1)) : 0;
    const introT = reduced() || S.introDone ? 1 : ease(clamp(cam.intro / 3.0, 0, 1)), dist = base * (1 - 0.22 * celeb) * lerp(1.5, 1, introT);
    cam.hold = Math.max(0, cam.hold - dt); if(cam.hold === 0 && !drag){ cam.yawT *= Math.pow(0.35, dt); cam.pitchT *= Math.pow(0.35, dt); }
    cam.yaw += (cam.yawT - cam.yaw) * Math.min(1, dt * 6); cam.pitch += (cam.pitchT - cam.pitch) * Math.min(1, dt * 6);
    const sway = reduced() ? 0 : Math.sin(time * 0.23) * 0.035, az = Math.atan2(cur.dir.x, cur.dir.z) + cam.yaw + sway + (1 - introT) * 0.6 - celeb * 0.2;
    const el = Math.asin(cur.dir.y) + cam.pitch + (1 - introT) * 0.32 - celeb * 0.04, cl = Math.cos(el), T0 = cur.target;
    camera.position.set(T0.x + Math.sin(az) * cl * dist, T0.y + Math.sin(el) * dist, T0.z + Math.cos(az) * cl * dist);
    const ty = T0.y + (ar < 1 ? lerp(2.0, 0, clamp((ar - 0.5) / 0.5, 0, 1)) : 0);
    camera.lookAt(T0.x - celeb * 3.2, ty, T0.z + celeb * 0.8);
  }
  S.cam = cam; S.introDone = !!env.keepIntro;

  /* ---------- hotspots (DOM buttons anchored to 3D points) + picking ---------- */
  S.setHot = list => {
    S.hotList.forEach(o => o.b.remove()); S.hotList = [];
    (list || []).forEach(h => { const b = document.createElement("button"); b.type = "button"; b.className = "db3dHot"; b.innerHTML = "<i></i><span>" + h.label + "</span>"; b.setAttribute("aria-label", h.aria || h.label); b.addEventListener("click", ev => { ev.stopPropagation(); h.fn(); }); stageEl.appendChild(b); S.hotList.push({ b, anchor:h.anchor, state:h.state, text:h.text, span:b.querySelector("span"), k:h.label }); });
  };
  const ray = new Raycaster(), nd = new Vector2();
  function onPick(e){
    const r = canvas.getBoundingClientRect(); nd.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(nd, camera);
    const objs = S.pickList.map(p => p.object).filter(Boolean), hits = ray.intersectObjects(objs, true); if(!hits.length) return;
    for(let n = hits[0].object; n; n = n.parent){ const it = S.pickList.find(p => p.object === n); if(it){ if(S.onTap) S.onTap(it.id, e, hits[0]); return; } }
  }
  canvas.addEventListener("pointerdown", e => { drag = { x:e.clientX, y:e.clientY, moved:false, yaw:cam.yawT, pitch:cam.pitchT, t:performance.now() }; try{ canvas.setPointerCapture(e.pointerId); }catch(_){} });
  canvas.addEventListener("pointermove", e => { if(!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if(Math.abs(dx) + Math.abs(dy) > 9) drag.moved = true; if(drag.moved){ cam.yawT = clamp(drag.yaw - dx * 0.005, -0.5, 0.5); cam.pitchT = clamp(drag.pitch + dy * 0.003, -0.16, 0.22); cam.hold = 3; dirty = true; } });
  canvas.addEventListener("pointerup", e => { if(drag && !drag.moved && performance.now() - drag.t < 600){ if(!S.introDone && !reduced()) cam.intro = Math.max(cam.intro, 3.2); else onPick(e); } drag = null; });
  canvas.addEventListener("pointercancel", () => { drag = null; });

  /* ---------- HUD: system advice + storm forecast ---------- */
  const adv = document.createElement("div"); adv.className = "db3dAdvice"; adv.setAttribute("role", "status"); adv.setAttribute("aria-live", "polite"); adv.hidden = true; stageEl.appendChild(adv);
  const fc = document.createElementNS("http://www.w3.org/2000/svg", "svg"); fc.setAttribute("class", "db3dFc"); fc.setAttribute("viewBox", "0 0 100 34"); fc.setAttribute("aria-label", "Rain forecast"); fc.hidden = true;
  fc.innerHTML = '<rect x="0" y="0" width="100" height="34" rx="6" fill="rgba(6,7,13,.7)" stroke="#6a72d8"/><text x="50" y="9" text-anchor="middle" font-size="5.2" font-weight="800" fill="#9bdcf2" font-family="system-ui">RAIN FORECAST · NEXT 14 s</text><polyline points="" fill="none" stroke="#2fd2ff" stroke-width="1.6" stroke-linejoin="round"/><line x1="6" x2="6" y1="12" y2="31" stroke="#ff9df2" stroke-width="1"/>'; stageEl.appendChild(fc);
  let advK = "";
  S.setAdvice = a => { if(!a){ adv.hidden = true; advK = ""; return; } const k = a.tone + "|" + a.text; if(k === advK) return; advK = k; adv.hidden = false; adv.className = "db3dAdvice " + a.tone; adv.textContent = a.text; };
  S.setForecast = (fn, t0, horizon = 14, lo = 0, hi = 1) => { if(!fn){ fc.hidden = true; return; } fc.hidden = false; let pts = ""; for(let q = 0; q <= 28; q++){ const v = fn(t0 + q * horizon / 28); pts += (6 + q * 3.3).toFixed(1) + "," + (31 - clamp((v - lo) / (hi - lo), 0, 1) * 17).toFixed(1) + " "; } fc.querySelector("polyline").setAttribute("points", pts); };

  /* ---------- sizing + adaptive resolution ---------- */
  let dpr = Math.min(window.devicePixelRatio || 1, q === "high" ? 2 : q === "medium" ? 1.5 : 1), slow = 0;
  function size(){ const r = stageEl.getBoundingClientRect(); resize(world, Math.max(160, Math.round(r.width)), Math.max(120, Math.round(r.height)), dpr); dirty = true; }
  const ro = new ResizeObserver(size); ro.observe(stageEl); size();
  world.lost.push(() => { if(env.onLost) env.onLost(); });
  S.size = size; S.dirty = () => { dirty = true; };
  S.skipIntro = () => { cam.intro = 4; dirty = true; };
  S.celebrate = () => { celebrating = true; cam.celeb = 0.001; dirty = true; for(let i = 0; i < 40 && !reduced(); i++) em.dust.emit(-3 + Math.random() * 6, MILL.floorY + 1 + Math.random() * 2, -3 + Math.random() * 3, (Math.random() - .5) * 1.5, 0.8 + Math.random(), (Math.random() - .5), 2.4, 0.7, 0.5); };
  S.endCelebrate = () => { celebrating = false; cam.celeb = 0; };
  S.project = (x, y, z) => { const v = new Vector3(x, y, z).project(camera), r = canvas.getBoundingClientRect(); return [r.left + (v.x * 0.5 + 0.5) * r.width, r.top + (-v.y * 0.5 + 0.5) * r.height]; };
  S.pixels = () => { const gl = renderer.getContext(), n = 24, buf = new Uint8Array(4), out = []; for(let j = 1; j < n; j++) for(let i = 1; i < n; i++){ gl.readPixels(Math.floor(gl.drawingBufferWidth * i / n), Math.floor(gl.drawingBufferHeight * j / n), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf); out.push([buf[0], buf[1], buf[2]]); } return out; };
  S.info = () => ({ info:renderer.info.render, mem:renderer.info.memory, quality:q, dpr });
  S.state = { get introAll(){ return reduced() ? 1 : clamp(cam.intro / 3.2, 0, 1); }, get time(){ return time; } };

  /* ---------- construction: the world assembles itself in sequence (first Day of a session only) ---------- */
  const grow = (g, s, y0 = -1) => { g.scale.y = Math.max(0.001, s); g.position.y = y0 * (1 - s); };
  function buildIn(t, rd){
    if(rd || S.introDone){ if(!S._built){ [parts.dam, parts.flume, parts.tailrace, parts.mill].forEach(g => { g.scale.set(1, 1, 1); g.position.set(0, 0, 0); g.visible = true; }); parts.gateHouse.position.y = 0; parts.gateHouse.visible = true; mach.drive.scale.setScalar(1); mach.drive.visible = true; mach.lantern.scale.setScalar(1); mach.lever.visible = true; mach.root.visible = true; S._built = true; } return; }
    grow(parts.dam, easeOutBack(phase(t, 0.1, 1.1)), -7);
    parts.gateHouse.position.y = (1 - easeOutBack(phase(t, 0.9, 1.7))) * 10; parts.gateHouse.visible = t > 0.9;
    grow(parts.flume, easeOutBack(phase(t, 1.2, 2.0)), 0); parts.flume.visible = t > 1.2;
    grow(parts.tailrace, easeOutBack(phase(t, 1.4, 2.1)), -1); parts.tailrace.visible = t > 1.4;
    grow(parts.mill, easeOutBack(phase(t, 1.5, 2.4)), 0); parts.mill.visible = t > 1.5;
    const ws = easeOutBack(phase(t, 1.9, 2.8)); mach.drive.scale.setScalar(Math.max(0.001, ws)); mach.drive.visible = t > 1.9;
    mach.lantern.scale.setScalar(Math.max(0.001, easeOutBack(phase(t, 2.1, 2.9)))); mach.lever.visible = t > 2.2;
    mach.root.visible = t > 2.0;
  }
  buildIn(0, reduced());

  /* ---------- per-frame: apply the shared state to every visual, then render ---------- */
  let runSecs = 0, lift = 0, beltX = SAW.fastX, lever = 0, blade = 0, saw0 = 0, stoneA = 0;
  S.vis = { get lift(){ return lift; }, get beltX(){ return beltX; }, get saw(){ return vs.M >= 2 ? mach.arbor.rotation.x : null; } };
  S.frame = function(dt){
    dt = Math.min(dt, 0.1); time += dt;
    if(!S.introDone && (reduced() || (env.isPlaying ? env.isPlaying() : true))) cam.intro += dt * (env.fast ? 2.6 : 1);
    const rd = reduced(), rpmV = vs.rpm * 0.2, om = rpmV * Math.PI * 2 / 60, introAll = rd ? 1 : clamp(cam.intro / 3.2, 0, 1);
    if(introAll >= 1) S.introDone = true;
    if(celebrating) cam.celeb += dt;
    if(rd){ if(!dirty && time - lastRender < 0.25) return; mach.drive.rotation.x = -rpmV * 0.9; }
    else mach.drive.rotation.x -= om * dt;
    parts.gate.position.y = GATE_SILL + 1.6 + vs.gateA * GATE_TRAVEL; parts.handwheel.rotation.z = vs.gateA * 9 * Math.PI;
    const mi = vs.as[0] ? 1 : 0; lift += ((1 - mi) * 0.62 - lift) * Math.min(1, dt * 4); mach.lantern.position.y = lift;
    lever += ((mi ? 1 : -1) * 0.5 - lever) * Math.min(1, dt * 6); mach.lever.rotation.z = lever;
    stoneA = mi ? om * (GEAR.crownN / GEAR.lanternN) : stoneA * Math.pow(0.15, dt); mach.lantern.rotation.y += (rd ? 0 : stoneA) * dt;
    if(rd && mi) mach.lantern.rotation.y = rpmV * 1.7;
    mach.sawGroup.visible = vs.M >= 2;
    if(vs.M >= 2){
      const si = vs.as[1] ? 1 : 0; beltX += ((si ? SAW.fastX : SAW.looseX) - beltX) * Math.min(1, dt * 5); mach.belt.position.x = beltX;
      const ratio = 0.78 / SAW.pulleyR; blade = si ? om * ratio : blade * Math.pow(0.2, dt); mach.arbor.rotation.x -= (rd ? 0 : blade) * dt; if(rd && si) mach.arbor.rotation.x = -rpmV * 3;
      if(!rd) mach.beltTex.offset.y -= om * 0.78 / 1.2 * dt;
      const lg = mach.log; if(si && vs.run[1]){ saw0 += dt * 0.16 * (vs.P / Math.max(vs.D, 1)); if(saw0 > 3.2) saw0 = 0; } lg.position.x = 6.1 - saw0;
      if(!rd && si && vs.run[1] && Math.random() < dt * 40 && saw0 > 1.3) em.chips.emit(SAW.blade + 0.1, SAW.y + 0.5, SAW.z + 0.2, 1.4 + Math.random(), 1.5 + Math.random() * 1.5, (Math.random() - .5) * 2, 0.7, 0.1, 0.8);
    }
    if(vs.run[0]){ runSecs += dt; mach.flour.scale.y = Math.min(1, 0.01 + runSecs / 30); if(!rd && Math.random() < dt * 20) em.dust.emit(GEAR.lanternX + (Math.random() - .5) * 1.8, MILL.floorY + 1.1, WHEEL.z + (Math.random() - .5) * 1.8, (Math.random() - .5) * 0.5, 0.35, (Math.random() - .5) * 0.5, 2.2, 0.55, 0.28); }
    const lit = (vs.run.some(Boolean) ? 1 : 0) * 0.85 + (S.tierN >= 2 ? 0.25 : 0) + (celebrating ? 0.6 : 0); lamp.intensity += (lit * 38 - lamp.intensity) * Math.min(1, dt * 3);
    S.mat_glass(lamp.intensity / 20);
    buildIn(cam.intro, rd);
    frameCamera(dt);
    world.lake.position.y = vs.resL - 9.0;
    rig.update({ Qg:vs.Qg, Qref:vs.Qref, spill:vs.spill, rpm:vs.rpm }, dt, time, mach.drive.rotation.x, em, rd, introAll);
    for(const h of S.hook) h(vs, dt, time, rd, introAll);
    renderer.toneMappingExposure = 1.05 + (celebrating ? 0.22 * Math.sin(clamp(cam.celeb / 1.6, 0, 1) * Math.PI) : 0);
    world.shared.uTime.value = rd ? 0 : time; world.sky.material.uniforms.uTime.value = rd ? 0 : time;
    if(!rd && vs.rain > 0.02){ const n = vs.rain * 90 * dt * 60; for(let i = 0, k = Math.floor(n) + (Math.random() < n - Math.floor(n) ? 1 : 0); i < k; i++) em.rain.emit(-34 + Math.random() * 74, 34, -88 + Math.random() * 78, 0.6, -20, 0.4, 1.9, 0.07, 0.55); }
    if(!rd){ em.rain.update(dt, 0, 0, 0); em.smoke.update(dt, -0.5, 0.3, 2.2); em.spark.update(dt, 9, 0.2, -0.4); }
    if(!rd){ em.spray.update(dt, 9, 0.5, 0.7); em.mist.update(dt, -0.3, 0.8, 1.6); em.dust.update(dt, -0.02, 0.6, 1.4); em.chips.update(dt, 9, 0.4, 0.2); }
    const hw = canvas.clientWidth, hh = canvas.clientHeight;
    S.hotList.forEach(o => { proj.copy(o.anchor).project(camera); const vis = proj.z < 1 && introAll > 0.95 && !S.hotHidden; o.b.style.display = vis ? "flex" : "none"; if(vis){ o.b.style.transform = "translate(" + ((proj.x * 0.5 + 0.5) * hw - 22).toFixed(0) + "px," + ((-proj.y * 0.5 + 0.5) * hh - 22).toFixed(0) + "px)"; if(o.text){ const t = o.text(); if(t !== o.k){ o.k = t; o.span.textContent = t; } } const st = o.state ? o.state() : null; o.b.classList.toggle("on", !!(st && st.on)); o.b.classList.toggle("run", !!(st && st.run)); } });
    renderer.render(scene, camera); lastRender = time; dirty = false;
    if(dt > 0.034) slow += dt; else slow = Math.max(0, slow - dt);
    if(slow > 1.2 && dpr > 0.7){ dpr = Math.max(0.7, dpr * 0.8); slow = 0; size(); } else if(slow > 1.2 && sun.castShadow){ sun.castShadow = false; slow = 0; }
  };
  S.mat_glass = v => { S.mats.glass.emissiveIntensity = v; };

  S.dispose = function(){
    ro.disconnect(); S.hotList.forEach(o => o.b.remove()); adv.remove(); fc.remove();
    scene.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { for(const k in m){ const v = m[k]; if(v && v.isTexture) v.dispose(); } if(m.uniforms) for(const k in m.uniforms){ const v = m.uniforms[k].value; if(v && v.isTexture) v.dispose(); } m.dispose(); }); } });
    if(world.reflections) world.reflections.forEach(r => r.dispose());
    Object.values(world.T).forEach(t => Object.values(t).forEach(x => x && x.dispose && x.dispose()));
    if(scene.environment) scene.environment.dispose();
    renderer.dispose(); try{ renderer.forceContextLoss(); }catch(e){}
  };
  return S;
}
