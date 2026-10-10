/* Every body of water in the scene, driven by the simulated flow: gate outflow, flume stream, falling jet, water standing in the wheel's buckets,
   tailrace, the river, the spillway sheet + plunge stream. Geometry follows real paths; speed, width, foam and visibility are updated per frame. */
import { Group, Mesh, CatmullRomCurve3, Vector3, InstancedMesh, SphereGeometry, MeshStandardMaterial, Object3D, Matrix4, Euler, Quaternion, MeshPhysicalMaterial } from "three";
import { waterMaterial, ribbonGeometry } from "./water.js";
import { FLUME_X, FLUME_Y, FLUME_Z0, FLUME_Z1, GATE_SILL } from "./structures.js";
import { WHEEL, riverX, riverY, STREAM, WATER_Y, waterfallPath } from "./terrain.js";
import { sstep, lerp, clamp } from "./util.js";

export const NB = 20;
const V = (x, y, z) => new Vector3(x, y, z);

export function buildWaterRig(world, drive){
  const g = new Group(), sh = world.shared, R = {};
  const mk = (pts, w, foam, mo, side) => { const geo = ribbonGeometry(pts, w, foam, side), m = new Mesh(geo, waterMaterial(sh, mo)); m.frustumCulled = false; m.renderOrder = 3; g.add(m); return m; };

  // gate outflow (under the gate, a short fast pulse of foam) and the flume stream
  { const pts = []; for(let i = 0; i <= 10; i++) pts.push(V(FLUME_X, FLUME_Y + 0.04, lerp(-16.35, -13.4, i / 10)));
    R.gateOut = mk(pts, 2.9, (i) => 1 - i / 12, { speed:1.4, amp:1.1, scale:0.35, stretch:0.55, shallow:"#7ad2d6", deep:"#2a86a8", opacity:0.9, clear:0.2, edgeFoam:0.5 }); }
  { const pts = []; for(let i = 0; i <= 30; i++) pts.push(V(FLUME_X, FLUME_Y + 0.06, lerp(-13.4, FLUME_Z1 + 0.15, i / 30)));
    R.flume = mk(pts, 2.5, (i) => i < 6 ? 0.85 - i * 0.13 : 0.1 + 0.08 * Math.sin(i), { speed:1, amp:0.9, scale:0.3, stretch:0.5, shallow:"#5cc0cc", deep:"#1f7096", opacity:0.88, clear:0.25, edgeFoam:0.55 }); }
  // the falling jet (vertical sheet, normal faces +z)
  { const pts = []; for(let i = 0; i <= 12; i++){ const t = i / 12; pts.push(V(FLUME_X, lerp(FLUME_Y + 0.08, WHEEL.y + WHEEL.r + 0.05, t), WHEEL.z - 0.55 + 0.26 * t * t)); }
    R.jet = mk(pts, 2.3, (i) => 0.25 + i / 20, { speed:3.2, amp:1.3, scale:0.5, stretch:0.7, shallow:"#bfeaf0", deep:"#5fb6d0", opacity:0.9, clear:0.1, edgeFoam:0.8, white:0.25 }, new Vector3(1, 0, 0)); }
  // tailrace and river
  { const pts = []; for(let i = 0; i <= 20; i++) pts.push(V(WHEEL.x, 0.32 - 0.00 * i, lerp(-2.9, 6.2, i / 20)));
    R.tail = mk(pts, 3.45, (i) => i < 7 ? 0.95 : 0.35, { speed:1, amp:1.2, scale:0.28, stretch:0.45, shallow:"#7fc7cc", deep:"#2d7fa0", opacity:0.9, clear:0.2, edgeFoam:0.7 }); }
  { const pts = []; for(let i = 0; i <= 80; i++){ const z = lerp(6.0, 150, Math.pow(i / 80, 1.15)); pts.push(V(riverX(z), riverY(z) + 0.02, z)); }
    R.river = mk(pts, (i, t) => lerp(4.4, 22, Math.pow(t, 1.6)), (i) => 0.25 + 0.45 * Math.abs(Math.sin(i * 0.8)) * (i < 30 ? 1 : 0.4), { speed:0.9, amp:1.0, scale:0.12, stretch:0.3, across:2.4, shallow:"#69b4b8", deep:"#216e8d", opacity:0.92, clear:0.4, edgeFoam:0.9 }); }
  // spillway sheet down the stepped chute, plunge pool stream
  { const pts = []; let sx = 14.4, y = WATER_Y; pts.push(V(-12.5, y + 0.06, -sx - 1.2), V(-12.5, y + 0.06, -sx));
    for(let k = 0; k < 6; k++){ const ny = y - 1.5; pts.push(V(-12.5, y + 0.07, -(sx - 0.15)), V(-12.5, ny + 0.5, -(sx - 0.15) + 0.05), V(-12.5, ny + 0.07, -(sx - 0.15) + 0.1)); y = ny; sx -= 0.62; pts.push(V(-12.5, ny + 0.07, -sx)); }
    R.spill = mk(pts, 6.2, (i) => (i % 4 === 3) ? 0.9 : 0.4, { speed:2.4, amp:1.4, scale:0.4, stretch:0.7, shallow:"#cfeff2", deep:"#6dbdd6", opacity:0.88, clear:0.1, edgeFoam:0.9, white:0.2 }, new Vector3(1, 0, 0)); }
  { const c = new CatmullRomCurve3(STREAM.map(p => V(p[0], -0.22, p[1])), false, "catmullrom", 0.5), pts = c.getPoints(54); pts.forEach((p, i) => p.y = lerp(-0.22, 0.08, i / pts.length));
    R.stream = mk(pts, (i, t) => lerp(3.4, 4.8, t), (i) => i < 12 ? 1 : 0.35, { speed:1.2, amp:1.2, scale:0.2, stretch:0.4, shallow:"#7cc8cc", deep:"#2a7d9b", opacity:0.92, clear:0.3, edgeFoam:0.8 }); }

  // a high mountain waterfall into the reservoir (follows the real slope): distance, scale and a sound-of-water cue for the eye
  { const wp = waterfallPath(-6, -140, 60); if(wp.length > 8){ const pts = wp.map(p => V(p[0], p[1], p[2])); R.fall = mk(pts, (i, t) => lerp(2.2, 4.6, t), (i, t) => 0.4 + 0.5 * t, { speed:2.6, amp:1.2, scale:0.25, stretch:0.5, across:2.2, shallow:"#dff6fa", deep:"#9fd4e6", opacity:0.9, clear:0.1, edgeFoam:0.9, white:0.4 }, new Vector3(1, 0, 0)); R.fallBase = pts[pts.length - 1]; } }
  // water standing in the wheel's buckets (child of the rotating drive group, kept level against the rotation)
  const bm = new MeshPhysicalMaterial({ color:0x58b8da, roughness:0.08, metalness:0, transparent:true, opacity:0.88, envMapIntensity:1.6, clearcoat:0.6 });
  const inst = new InstancedMesh(new SphereGeometry(1, 12, 8), bm, NB); inst.frustumCulled = false; inst.renderOrder = 4; drive.add(inst); R.fill = inst;
  R.group = g;
  const n2 = (rate, dt) => { const x = rate * dt; return Math.floor(x) + (Math.random() < x - Math.floor(x) ? 1 : 0); };
  const m4 = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s3 = new Vector3(), TWO = Math.PI * 2;
  const d = TWO / NB;

  const spill = { x:-12.5, y:0.35, z:-8.9 };
  R.update = function(S, dt, time, rot, em, reduced, intro){
    const f = clamp(S.Qg / S.Qref, 0, 1), fs = clamp(S.spill / S.Qref, 0, 1), flowSpeed = reduced ? 0 : 1, vis = intro;
    const set = (m, o) => { const u = m.material.uniforms; for(const k in o) u[k].value = o[k]; };
    // gate outflow + flume
    R.gateOut.visible = R.flume.visible = f > 0.03 && vis > 0.4;
    if(R.flume.visible){
      const depth = 0.14 + 0.62 * Math.pow(f, 0.66); R.flume.position.y = depth; R.gateOut.position.y = depth * 0.7;
      set(R.flume, { uSpeed:flowSpeed * (0.5 + 2.4 * f), uFlow:0.35 + f * 0.65, uOpacity:0.55 + 0.35 * Math.min(1, f * 3) });
      set(R.gateOut, { uSpeed:flowSpeed * (1.2 + 3.2 * f), uFlow:0.5 + f * 0.5, uOpacity:0.55 + 0.35 * Math.min(1, f * 3) });
    }
    // jet
    R.jet.visible = f > 0.04 && vis > 0.5; if(R.jet.visible){ R.jet.scale.x = clamp(0.35 + 0.7 * Math.sqrt(f), 0.3, 1.05); set(R.jet, { uSpeed:flowSpeed * (3 + 3 * f), uFlow:f, uOpacity:0.6 + 0.3 * Math.min(1, f * 4) }); }
    // tail + river + spill + stream
    const rf = clamp(S.rpm / 48, 0, 1.2);
    R.tail.visible = vis > 0.5; set(R.tail, { uSpeed:flowSpeed * (0.6 + 1.6 * f), uFlow:0.35 + 0.65 * Math.max(f, rf), uFoam:0.55 + 0.9 * rf });
    R.river.visible = vis > 0.3; set(R.river, { uSpeed:flowSpeed * 0.9 * clamp(0.3 + 0.7 * (S.Qriver == null ? S.Qref : S.Qriver) / S.Qref, 0.3, 1.5), uFlow:0.55 + 0.25 * f });   // the river carries gate outflow + every overflow on to the sea (13 L/s = the approved look)
    R.spill.visible = R.stream.visible = fs > 0.02 && vis > 0.6;
    if(R.spill.visible){ const o = 0.35 + 0.55 * Math.min(1, fs * 2.2); set(R.spill, { uSpeed:flowSpeed * (1.4 + 3 * fs), uFlow:0.35 + 0.65 * fs, uOpacity:o, uWhite:0.12 + 0.2 * fs }); set(R.stream, { uSpeed:flowSpeed * (0.7 + 1.6 * fs), uFlow:0.4 + 0.6 * fs, uFoam:0.5 + fs }); R.spill.scale.x = 0.45 + 0.55 * Math.sqrt(fs); }
    // bucket water: fill depends on where the bucket is (filling at the top, spilling on the way down, empty at the tailwater)
    const g1 = Math.pow(f, 0.7);
    for(let k = 0; k < NB; k++){
      const th = k * d, ph = ((th + rot + Math.PI) % TWO + TWO) % TWO - Math.PI;   // −π..π, 0 = top, − = upstream (descending) side
      let fill = 0;
      if(ph < -0.05 && ph > -2.95){ fill = ph > -0.5 ? sstep(-0.05, -0.5, ph) : ph > -1.5 ? 1 : 1 - sstep(-1.5, -2.95, ph); }
      fill *= g1;
      const rr = WHEEL.r - 0.3, a = th + d * 0.42;
      e.set(-rot, 0, 0); q.setFromEuler(e); p.set(0, rr * Math.cos(a), rr * Math.sin(a)); s3.set(1.05, Math.max(0.0001, 0.13 * fill), 0.3 * Math.max(0.2, fill)); m4.compose(p, q, s3); inst.setMatrixAt(k, m4);
    }
    inst.instanceMatrix.needsUpdate = true;
    // spray / mist
    if(em && !reduced){
      if(R.fallBase) for(let i = n2(24, dt); i--;) em.mist.emit(R.fallBase.x + (Math.random() - .5) * 5, R.fallBase.y + 0.4, R.fallBase.z + (Math.random() - .5) * 2, (Math.random() - .5) * 0.6, 0.8 + Math.random(), 0.3, 3.2, 3.2, 0.3);
      const n = (rate) => { const x = rate * dt; return Math.floor(x) + (Math.random() < x - Math.floor(x) ? 1 : 0); };
      for(let i = n(70 * f * f); i--;) em.spray.emit(FLUME_X + (Math.random() - .5) * 1.6, WHEEL.y + WHEEL.r + 0.1, WHEEL.z - 0.35 + Math.random() * 0.3, (Math.random() - .5) * 1.4, 1.2 + Math.random() * 2.0, (Math.random() - .3) * 1.4, 0.7 + Math.random() * 0.5, 0.16, 0.55);
      for(let i = n(55 * rf * (0.4 + f)); i--;) em.spray.emit(WHEEL.x + (Math.random() - .5) * 2.2, 0.5, WHEEL.z - 2.6 + Math.random() * 1.5, (Math.random() - .5) * 1.8, 1.4 + Math.random() * 2.2, (Math.random() - .3) * 2.5, 0.9 + Math.random() * 0.5, 0.2, 0.6);
      for(let i = n(26 * rf * f); i--;){ const k = Math.floor(Math.random() * NB), ph2 = -1.6 - Math.random() * 1.2, y = WHEEL.y + Math.cos(ph2) * (WHEEL.r - 0.4), z = WHEEL.z + Math.sin(ph2) * (WHEEL.r - 0.4); em.spray.emit(WHEEL.x + (Math.random() - .5) * 2.2, y, z, (Math.random() - .5) * 0.4, -0.5, -0.4, 0.7, 0.12, 0.5); }
      for(let i = n(90 * fs); i--;) em.mist.emit(spill.x + (Math.random() - .5) * 5, spill.y + 0.2, spill.z + 0.4 + Math.random() * 1.6, (Math.random() - .5) * 0.8, 0.5 + Math.random() * 1.2, 0.6 + Math.random(), 1.8 + Math.random(), 0.9, 0.34);
      for(let i = n(14 * f); i--;) em.mist.emit(FLUME_X + (Math.random() - .5) * 2, WHEEL.y + WHEEL.r - 0.6, WHEEL.z - 0.3 + Math.random() * 0.4, (Math.random() - .5) * 0.6, 0.5 + Math.random(), 0.2, 1.4, 0.8, 0.2);
    }
  };
  return R;
}
