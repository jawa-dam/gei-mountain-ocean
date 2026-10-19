/* The static + hand-animated architecture: concrete gravity dam with spillway, intake gate house with a real lifting sluice gate, timber/concrete flume on stone piers,
   masonry tailrace, open timber-frame mill house. Everything is real geometry with PBR materials; static pieces are merged per material (few draw calls). */
import { Group, Mesh, MeshStandardMaterial, Shape, ExtrudeGeometry, Color, TorusGeometry, CylinderGeometry, IcosahedronGeometry, InstancedMesh, Matrix4, Object3D, MeshBasicMaterial, DoubleSide } from "three";
import { box, cyl, place, merge, scaleUV, extrude } from "./geo.js";
import { rng, lerp } from "./util.js";
import { CREST_Y, WATER_Y, WHEEL, heightAt } from "./terrain.js";

export const FLUME_Y = 7.8, FLUME_X = 7, FLUME_Z0 = -15, FLUME_Z1 = -1.6, GATE_SILL = 7.8, GATE_TRAVEL = 2.2;
export const MILL = { x0:-9, x1:2.4, z0:-7, z1:3.5, floorY:7.0 };

export function materials(T, tierN){
  const std = (t, o = {}) => new MeshStandardMaterial(Object.assign({ map:t.map, normalMap:t.normal, roughnessMap:t.rough, roughness:1, metalness:0, normalScale:{ x:1, y:1 } }, o));
  return {
    concrete:std(T.concrete, { color:0xe4e0d8 }), concreteDark:std(T.concrete, { color:0x9a968e }), stone:std(T.stone, { color:0xcfc7b8 }),
    wood:std(T.wood, { color:0xe0c4a0 }), woodDark:std(T.wood, { color:0x8a6a4c }), roof:std(T.wood, { color:0x6b5a4a }),
    iron:std(T.iron, { color:0xffffff, metalness:0.85, roughness:1 }), brass:new MeshStandardMaterial({ color:0xd6a548, metalness:0.9, roughness:0.32 }),
    steel:new MeshStandardMaterial({ color:0x8d99a6, metalness:0.9, roughness:0.38 }), paintRed:new MeshStandardMaterial({ color:0xb23a2e, metalness:0.2, roughness:0.55 }),
    dark:new MeshStandardMaterial({ color:0x0b0d12, roughness:1 }), glass:new MeshStandardMaterial({ color:0xffe0a0, emissive:0xffb84a, emissiveIntensity:0, roughness:0.4 })
  };
}

function mesh(geo, mat, shadow = true, name){ const m = new Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = true; if(name) m.name = name; return m; }

/* profile in (sx = -z, sy = y) extruded along world X from x0 to x1 */
export function damGeometry(x0, x1, pts){
  const s = new Shape(); pts.forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1]));
  const g = new ExtrudeGeometry(s, { depth:x1 - x0, bevelEnabled:true, bevelSize:0.12, bevelThickness:0.12, bevelSegments:1, curveSegments:4 });
  g.rotateY(Math.PI / 2); g.translate(x0, 0, 0);         // local z → world x, local x → world −z
  g.attributes.uv.array.forEach((v, i, a) => a[i] = v * 0.22);
  return g;
}
function damSegment(M, x0, x1, pts, mat){ return mesh(damGeometry(x0, x1, pts), mat, true, "dam"); }
/* the wall as FIVE STACKED LIFTS (metres of thickness each, bottom → top) with a stepped downstream face; null = the approved smooth profile */
export const DAM_BD = [-3, 0, 3.2, 6.0, 8.2, 10.2];
export function damProfile(c, t){
  if(!t) return MAIN(c);
  const p = [[17.6, -7], [17.6, c]];
  for(let r = 4; r >= 0; r--){ p.push([17.6 - t[r], r === 4 ? c : DAM_BD[r + 1]], [17.6 - t[r], DAM_BD[r]]); }
  p.push([17.6 - t[0], -7]); return p;
}
const MAIN = c => [[17.6, -7], [17.6, c], [14.0, c], [13.7, 9.4], [12.9, 6.8], [11.8, 3.6], [10.2, 0], [8.4, -3], [6.9, -7]];
const SPILL = () => {   // lip at the lake level, then a stepped chute
  const p = [[17.6, -7], [17.6, WATER_Y], [14.4, WATER_Y]]; let sx = 14.4, y = WATER_Y;
  for(let k = 0; k < 6; k++){ const ny = y - 1.5; p.push([sx - 0.15, y], [sx - 0.15, ny]); y = ny; sx -= 0.62; p.push([sx, ny]); }
  p.push([8.6, -2.2], [6.9, -7]); return p;
};
const INTAKE = [[17.6, -7], [17.6, GATE_SILL], [13.6, GATE_SILL], [12.9, 6.8], [11.8, 3.6], [10.2, 0], [8.4, -3], [6.9, -7]];

export function buildArchitecture(T, tierN, quality){
  const M = materials(T, tierN), root = new Group(), A = { root, M, parts:{} };
  const timber = tierN === 0, flumeMat = timber ? M.wood : M.concrete;

  /* ---- dam ---- */
  const dam = new Group(); dam.name = "damGroup";
  const mainSegs = [[-22, -16], [-9, 5.3], [8.7, 22]].map(r => { const m = damSegment(M, r[0], r[1], MAIN(CREST_Y), M.concrete); m.userData.x0 = r[0]; m.userData.x1 = r[1]; return m; });
  dam.add(mainSegs[0], damSegment(M, -16, -9, SPILL(), M.concrete), mainSegs[1], damSegment(M, 5.3, 8.7, INTAKE, M.concreteDark), mainSegs[2]);
  A.rebuildDam = t => mainSegs.forEach(m => { const old = m.geometry; m.geometry = damGeometry(m.userData.x0, m.userData.x1, damProfile(CREST_Y, t)); old.dispose(); });
  // crest: upstream parapet, downstream steel railing, lamp posts, a dark inspection gallery on the face
  const par = []; par.push(place(box(14.2, 0.8, 0.35), -15, CREST_Y + 0.4, -17.4)); par.push(place(box(26.8, 0.8, 0.35), 8.6, CREST_Y + 0.4, -17.4));
  dam.add(mesh(merge(par), M.concrete));
  const rail = []; for(let x = -21; x <= 21; x += 2.1){ if(x > 4.4 && x < 9.6) continue; rail.push(place(cyl(0.04, 0.04, 1.0, 5), x, CREST_Y + 0.5, -14.45)); }
  rail.push(place(cyl(0.035, 0.035, 14, 5), -14.5, CREST_Y + 1.0, -14.45, 0, 0, Math.PI / 2), place(cyl(0.035, 0.035, 11.5, 5), 15.5, CREST_Y + 1.0, -14.45, 0, 0, Math.PI / 2));
  dam.add(mesh(merge(rail), M.steel, false));
  const face = []; for(let k = 0; k < 4; k++){ const x = -4 + k * 7.4; if(x > 4 && x < 10) continue; face.push(place(box(1.1, 0.9, 0.5), x, 5.6, -13.05, -0.38)); }
  face.push(place(box(1.1, 0.9, 0.5), 15, 5.6, -13.05, -0.38)); dam.add(mesh(merge(face), M.dark, false));
  A.parts.dam = dam; root.add(dam);

  /* ---- intake gate house: guide columns, hoist deck, gearbox, handwheel, screw stems, and the lifting gate ---- */
  const house = []; [[4.75, -17.2], [4.75, -15.4], [9.25, -17.2], [9.25, -15.4]].forEach(p => house.push(place(box(0.5, 4.2, 0.5), p[0], CREST_Y + 2.1 - 0.2, p[1])));
  house.push(place(box(5.4, 0.3, 2.6), 7, 14.1, -16.3), place(box(5.4, 0.25, 0.45), 7, 12.4, -17.2), place(box(5.4, 0.25, 0.45), 7, 12.4, -15.4));
  const gh = new Group(); gh.add(mesh(merge(house), M.concrete)); gh.name = "gateHouse";
  const hr = []; for(let i = -2; i <= 2; i++){ hr.push(place(cyl(0.03, 0.03, 0.9, 5), 7 + i * 1.3, 14.7, -17.5), place(cyl(0.03, 0.03, 0.9, 5), 7 + i * 1.3, 14.7, -15.1)); }
  hr.push(place(cyl(0.03, 0.03, 5.4, 5), 7, 15.15, -17.5, 0, 0, Math.PI / 2), place(cyl(0.03, 0.03, 5.4, 5), 7, 15.15, -15.1, 0, 0, Math.PI / 2)); gh.add(mesh(merge(hr), M.steel, false));
  const gbox = mesh(box(1.2, 0.8, 0.9, 0.3), M.paintRed, true); gbox.position.set(7, 14.65, -16.3); gh.add(gbox);
  // handwheel (rim + spokes) — turns with the gate
  const hw = new Group(); hw.position.set(7, 14.65, -15.75); hw.add(mesh(new TorusGeometry(0.34, 0.035, 8, 22), M.steel, false));
  for(let k = 0; k < 4; k++){ const sp = mesh(cyl(0.025, 0.025, 0.68, 5), M.steel, false); sp.rotation.z = k * Math.PI / 4; hw.add(sp); }
  hw.add(mesh(cyl(0.07, 0.07, 0.12, 10), M.brass, false)); hw.children[hw.children.length - 1].rotation.x = Math.PI / 2; gh.add(hw); A.parts.handwheel = hw;
  // the gate: steel skin plate + 3 stiffener beams + roller blocks, hung on two screw stems
  const gate = new Group(); gate.name = "gate";
  const gp = [place(box(3.0, 3.2, 0.14, 0.4), 0, 0, 0)]; for(let k = 0; k < 3; k++) gp.push(place(box(3.0, 0.16, 0.34, 0.4), 0, -1.1 + k * 1.1, 0.2));
  gp.push(place(box(0.1, 3.2, 0.34, 0.4), -1.45, 0, 0.2), place(box(0.1, 3.2, 0.34, 0.4), 1.45, 0, 0.2));
  gate.add(mesh(merge(gp), M.steel));
  const stems = []; [-1.1, 1.1].forEach(x => stems.push(place(cyl(0.06, 0.06, 8, 8), x, 4, 0.0))); const st = mesh(merge(stems), M.iron, false); gate.add(st);
  const nuts = mesh(merge([place(box(0.32, 0.24, 0.3), -1.1, 1.7, 0), place(box(0.32, 0.24, 0.3), 1.1, 1.7, 0)]), M.brass, false); gate.add(nuts);
  gate.position.set(7, GATE_SILL + 1.6, -16.35); gh.add(gate); A.parts.gate = gate; A.parts.gateHouse = gh; root.add(gh);
  // guide rails in the slot
  gh.add(mesh(merge([place(box(0.18, 6.4, 0.5), 5.2, GATE_SILL + 3.2, -16.35), place(box(0.18, 6.4, 0.5), 8.8, GATE_SILL + 3.2, -16.35)]), M.steel, false));

  /* ---- flume on masonry piers ---- */
  const L = FLUME_Z1 - FLUME_Z0, zc = (FLUME_Z0 + FLUME_Z1) / 2, fl = new Group(); fl.name = "flume";
  const fparts = [place(box(3.5, 0.4, L), FLUME_X, FLUME_Y - 0.2, zc), place(box(0.32, 1.05, L), FLUME_X - 1.55, FLUME_Y + 0.52, zc), place(box(0.32, 1.05, L), FLUME_X + 1.55, FLUME_Y + 0.52, zc)];
  for(let z = FLUME_Z0 + 1; z < FLUME_Z1; z += 2.4){ fparts.push(place(box(3.9, 0.14, 0.2), FLUME_X, FLUME_Y + 1.1, z)); }
  fl.add(mesh(merge(fparts), flumeMat));
  const piers = []; [-11.2, -7.6, -4.2].forEach(z => { piers.push(place(box(2.5, 7.6, 1.3, 0.3), FLUME_X, 3.6, z), place(box(3.3, 0.45, 1.7, 0.3), FLUME_X, 7.45, z), place(box(3.0, 0.6, 1.5, 0.3), FLUME_X, -0.1, z)); });
  fl.add(mesh(merge(piers), M.stone));
  const brace = []; [-11.2, -7.6, -4.2].forEach(z => { brace.push(place(box(0.16, 4.2, 0.16), FLUME_X - 1.2, 5.0, z + 0.9, 0.0, 0, 0.5), place(box(0.16, 4.2, 0.16), FLUME_X + 1.2, 5.0, z + 0.9, 0.0, 0, -0.5)); });
  fl.add(mesh(merge(brace), M.woodDark, true));
  // the spout the water leaves by
  fl.add(mesh(place(box(2.6, 0.12, 0.7), FLUME_X, FLUME_Y - 0.02, FLUME_Z1 + 0.28, 0.12), M.iron, true));
  A.parts.flume = fl; root.add(fl);

  /* ---- masonry tailrace under the wheel ---- */
  const tr = [place(box(0.6, 1.9, 9.6, 0.3), WHEEL.x - 2.0, 0.05, 1.7), place(box(0.6, 1.9, 9.6, 0.3), WHEEL.x + 2.0, 0.05, 1.7), place(box(4.6, 0.4, 9.6, 0.3), WHEEL.x, -0.95, 1.7)];
  tr.push(place(box(1.4, 3.8, 1.6, 0.3), 10.3, 1.9, WHEEL.z), place(box(1.4, 3.8, 1.6, 0.3), 3.1, 1.9, WHEEL.z));   // pillow-block piers carrying the axle
  const trm = mesh(merge(tr), M.stone); A.parts.tailrace = trm; root.add(trm);

  /* ---- open timber-frame mill house (cutaway to the right and front) ---- */
  const mh = new Group(); mh.name = "mill";
  const { x0, x1, z0, z1, floorY } = MILL, W = x1 - x0, D = z1 - z0, xm = (x0 + x1) / 2, zm = (z0 + z1) / 2;
  const stoneP = [place(box(W + 0.6, 0.7, D + 0.6, 0.3), xm, 0.35, zm), place(box(W, 7.0, 0.7, 0.3), xm, 3.5, z0 + 0.35), place(box(0.7, 7.0, D, 0.3), x0 + 0.35, 3.5, zm)];
  mh.add(mesh(merge(stoneP), M.stone));
  const timb = [];
  [[x0 + 0.4, z0 + 0.4], [x1 - 0.4, z0 + 0.4], [x0 + 0.4, z1 - 0.4], [x1 - 0.4, z1 - 0.4], [xm, z0 + 0.4], [xm, z1 - 0.4]].forEach(p => { timb.push(place(box(0.42, 12.4, 0.42), p[0], 6.2 + 0.4, p[1])); });
  [3.2, floorY, 11.6].forEach(y => { timb.push(place(box(W, 0.38, 0.38), xm, y, z0 + 0.4), place(box(W, 0.38, 0.38), xm, y, z1 - 0.4), place(box(0.38, 0.38, D), x0 + 0.4, y, zm), place(box(0.38, 0.38, D), x1 - 0.4, y, zm)); });
  for(let x = x0 + 1.2; x < x1; x += 1.75) timb.push(place(box(0.28, 0.4, D - 0.6), x, floorY - 0.3, zm));        // floor joists
  mh.add(mesh(merge(timb), M.woodDark));
  const planks = [place(box(W - 0.2, 0.22, D - 0.2, 0.3), xm, floorY - 0.04, zm)]; mh.add(mesh(merge(planks), M.wood));
  const up = [place(box(W, 4.6, 0.25, 0.3), xm, floorY + 2.3, z0 + 0.4), place(box(0.25, 4.6, D, 0.3), x0 + 0.4, floorY + 2.3, zm)]; mh.add(mesh(merge(up), M.wood));
  // gable roof over the back two-thirds, so the open front reads as a cutaway
  const rz0 = z0 - 1.0, rz1 = z0 + D * 0.74, hd = (rz1 - rz0) / 2, th = 0.55, rise = hd * Math.tan(th), plen = hd / Math.cos(th), eaveY = 11.9;
  [-1, 1].forEach(sd => { const r = mesh(box(W + 2.4, 0.3, plen + 0.5, 0.3), M.roof); r.rotation.x = sd * th; r.position.set(xm, eaveY + rise / 2 + 0.15, rz0 + hd + sd * hd / 2); mh.add(r); });
  mh.add(mesh(box(W + 2.4, 0.22, 0.34, 0.3), M.woodDark), mesh(place(box(W + 2.4, 0.22, 0.34, 0.3), 0, 0, 0), M.woodDark));
  mh.children[mh.children.length - 2].position.set(xm, eaveY + rise + 0.2, rz0 + hd); mh.children[mh.children.length - 1].visible = false;
  A.parts.mill = mh; root.add(mh);
  return A;
}

/* boulders + log pile + sacks: instanced props */
export function buildProps(M){
  const g = new Group(), R = rng(5), ico = new IcosahedronGeometry(1, 1), p = ico.attributes.position;
  for(let i = 0; i < p.count; i++){ const k = 0.82 + 0.3 * Math.sin(p.getX(i) * 3.1 + p.getY(i) * 2.3 + p.getZ(i) * 4.7); p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.78, p.getZ(i) * k); }
  ico.computeVertexNormals();
  const items = []; for(let i = 0; i < 46; i++){ const a = R() * Math.PI * 2, x = (R() - 0.5) * 70, z = -9 + R() * 52; if(x > 3.5 && x < 10.5 && z < 6) continue; if(x > MILL.x0 - 1 && x < MILL.x1 + 1 && z > MILL.z0 - 1 && z < MILL.z1 + 1) continue; items.push([x, z, 0.35 + R() * R() * 1.8, a]); }
  const im = new InstancedMesh(ico, new MeshStandardMaterial({ color:0x8a8178, roughness:0.95, flatShading:false }), items.length), o = new Object3D();
  items.forEach((it, i) => { o.position.set(it[0], heightAt(it[0], it[1]) + it[2] * 0.12, it[1]); o.scale.set(it[2], it[2], it[2] * (0.8 + (i % 3) * 0.15)); o.rotation.set(0, it[3], 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  im.castShadow = true; im.receiveShadow = true; g.add(im); return g;
}
