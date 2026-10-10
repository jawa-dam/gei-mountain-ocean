/* The mechanism: overshot waterwheel on an iron axle, wooden crown (pit) wheel with 36 cogs driving a 19-stave lantern pinion (ratio 36:19, correct pitch),
   a vertical shaft to a millstone with furrowed dress, and a belt-driven sawmill using fast & loose pulleys as its clutch. All moving parts are real geometry
   grouped by what rotates together; static fittings are merged. */
import { Group, Mesh, Shape, Path, ExtrudeGeometry, CylinderGeometry, BufferGeometry, Float32BufferAttribute, MeshStandardMaterial, DoubleSide, TorusGeometry, Vector3, RepeatWrapping, Color } from "three";
import { box, cyl, place, merge, extrude, toothShape } from "./geo.js";
import { WHEEL } from "./terrain.js";
import { MILL } from "./structures.js";

const mesh = (g, m, shadow = true, name) => { const o = new Mesh(g, m); o.castShadow = shadow; o.receiveShadow = true; if(name) o.name = name; return o; };
/* a plank between two points in the wheel's (y,z) plane, `w` wide along x */
function plank(y0, z0, y1, z1, w, t, x = 0){
  const len = Math.hypot(y1 - y0, z1 - z0), g = box(w, len, t, 0.5), a = Math.atan2(z1 - z0, y1 - y0);
  g.rotateX(a); g.translate(x, (y0 + y1) / 2, (z0 + z1) / 2); return g;
}
const P = (r, th) => [r * Math.cos(th), r * Math.sin(th)];

export const GEAR = { crownR:1.05, crownN:36, lanternR:0.55, lanternN:19, pitX:0.9, lanternX:0.09 };
export const SAW = { y:1.2, z:2.2, blade:3.45, arborX0:2.7, arborX1:5.6, fastX:4.62, looseX:5.18, pulleyR:0.27 };
export const AXLE_PULLEY = { x:4.9, r:0.78 };

export function buildMachines(M, T, tierN, bear){
  const root = new Group(), H = { root };
  const wx = WHEEL.x, wy = WHEEL.y, wz = WHEEL.z, R = WHEEL.r;

  /* ===== drive group: everything on the axle turns together about the X axis through (wy, wz) ===== */
  const drive = new Group(); drive.position.set(wx, wy, wz); H.drive = drive;
  const woodParts = [], ironParts = [], brassParts = [];
  const nb = 20, hubR = 0.62, rimIn = 0.3, W2 = 1.2;
  // rims (two) — thick ring + inner stiffening ring
  const ring = (ro, ri, d, x) => { const s = new Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false); const h = new Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h); const g = extrude(s, d, 0.02, 48); g.rotateY(Math.PI / 2); g.translate(x, 0, 0); return g; };
  [-W2, W2].forEach(x => { woodParts.push(ring(R + 0.02, R - rimIn, 0.16, x), ring(R - 0.62, R - 0.78, 0.12, x)); });
  // spokes (8 per side), set 22.5° off each other from side to side
  for(let side = -1; side <= 1; side += 2) for(let k = 0; k < 8; k++){
    const th = k * Math.PI / 4 + (side > 0 ? Math.PI / 8 : 0), a = P(hubR * 0.8, th), b = P(R - rimIn + 0.05, th);
    woodParts.push(plank(a[0], a[1], b[0], b[1], 0.2, 0.16, side * (W2 - 0.25)));
  }
  // bucket boards: radial start-board + angled sole-board forming each V-bucket, spanning both rims
  const d = Math.PI * 2 / nb;
  for(let k = 0; k < nb; k++){
    const th = k * d, a0 = P(R - 0.62, th), a1 = P(R + 0.03, th), b1 = P(R - 0.62, th + d * 0.0), b2 = P(R - 0.02, th + d * 0.96);
    woodParts.push(plank(a0[0], a0[1], a1[0], a1[1], 2 * W2 - 0.1, 0.07), plank(b1[0], b1[1], b2[0], b2[1], 2 * W2 - 0.1, 0.06));
  }
  // hub + axle collar + iron straps
  woodParts.push(place(cyl(hubR, hubR, 2 * W2 - 0.1, 20), 0, 0, 0, 0, 0, Math.PI / 2));
  [-0.95, 0.95].forEach(x => ironParts.push(place(cyl(hubR + 0.04, hubR + 0.04, 0.12, 20), x, 0, 0, 0, 0, Math.PI / 2)));
  [-W2, W2].forEach(x => { for(let k = 0; k < nb; k += 2){ const th = k * d, a = P(R - 0.34, th); ironParts.push(place(box(0.05, 0.1, 0.1, 1), x + (x > 0 ? 0.1 : -0.1), a[0], a[1], th)); } });
  H.wheelWood = mesh(merge(woodParts), M.wood, true, "wheelWood"); drive.add(H.wheelWood);
  drive.add(mesh(merge(ironParts), M.iron, true));
  // axle across the whole machine (world x ≈ −0.2 … 9.9), brass journals where it rides in the pillow blocks
  const ax0 = -0.2 - wx, ax1 = 9.9 - wx;
  drive.add(mesh(place(cyl(0.17, 0.17, ax1 - ax0, 14), (ax0 + ax1) / 2, 0, 0, 0, 0, Math.PI / 2), M.iron, true, "axle"));
  [3.1 - wx, 10.3 - wx].forEach(x => brassParts.push(place(cyl(0.2, 0.2, 0.9, 14), x, 0, 0, 0, 0, Math.PI / 2)));
  drive.add(mesh(merge(brassParts), M.brass, true));
  if(bear > 0){ const gold = []; for(let k = 0; k < bear; k++) gold.push(place(cyl(hubR + 0.1 + k * 0.03, hubR + 0.1 + k * 0.03, 0.09, 20), 1.15 + 0.14 * k, 0, 0, 0, 0, Math.PI / 2), place(cyl(hubR + 0.1 + k * 0.03, hubR + 0.1 + k * 0.03, 0.09, 20), -1.15 - 0.14 * k, 0, 0, 0, 0, Math.PI / 2)); drive.add(mesh(merge(gold), M.brass, true)); }

  // crown (pit) wheel: ring of cogs on the face — real teeth on the real rim, 36 of them
  { const pitL = GEAR.pitX - wx, disc = new Shape(); disc.absarc(0, 0, 1.22, 0, Math.PI * 2, false); const hole = new Path(); hole.absarc(0, 0, 0.22, 0, Math.PI * 2, true); disc.holes.push(hole);
    for(let k = 0; k < 6; k++){ const a0 = (k + 0.18) / 6 * Math.PI * 2, a1 = (k + 0.82) / 6 * Math.PI * 2, w = new Path(); for(let j = 0; j <= 6; j++){ const p = P(1.0, a0 + (a1 - a0) * j / 6); j ? w.lineTo(p[0], p[1]) : w.moveTo(p[0], p[1]); } for(let j = 6; j >= 0; j--){ const p = P(0.42, a0 + (a1 - a0) * j / 6); w.lineTo(p[0], p[1]); } disc.holes.push(w); }
    const dg = extrude(disc, 0.24, 0.02, 40); dg.rotateY(Math.PI / 2); dg.translate(pitL, 0, 0);
    const cogs = []; for(let k = 0; k < GEAR.crownN; k++){ const th = k * Math.PI * 2 / GEAR.crownN, p = P(GEAR.crownR, th), c = box(0.38, 0.17, 0.13, 1); c.rotateX(th + Math.PI / 2); c.translate(pitL - 0.27, p[0], p[1]); cogs.push(c); }
    drive.add(mesh(dg, M.wood, true, "pitWheel"), mesh(merge(cogs), M.woodDark, true, "cogs")); }
  // belt pulley on the axle (flat-faced, wide enough for both belt positions)
  drive.add(mesh(place(cyl(AXLE_PULLEY.r, AXLE_PULLEY.r, 1.15, 28), AXLE_PULLEY.x - wx + 0.2, 0, 0, 0, 0, Math.PI / 2), M.iron, true, "axlePulley"));
  root.add(drive);

  /* ===== lantern pinion + vertical shaft + millstone (rotate about Y) ===== */
  const lant = new Group(), lx = GEAR.lanternX, lz = wz, topY = wy + GEAR.crownR; H.lantern = lant; lant.position.set(lx, 0, lz);
  const lp = []; const rL = GEAR.lanternR;
  lp.push(place(cyl(rL + 0.06, rL + 0.06, 0.1, 24), 0, topY - 0.34, 0), place(cyl(rL + 0.06, rL + 0.06, 0.1, 24), 0, topY + 0.34, 0));
  for(let k = 0; k < GEAR.lanternN; k++){ const a = k * Math.PI * 2 / GEAR.lanternN; lp.push(place(cyl(0.05, 0.05, 0.68, 6), Math.cos(a) * rL, topY, Math.sin(a) * rL)); }
  lant.add(mesh(merge(lp), M.woodDark, true, "lanternStaves"));
  lant.add(mesh(place(cyl(0.13, 0.13, 5.4, 10), 0, topY + 2.4, 0), M.iron, true, "shaft"));
  // runner stone + bedstone + tun + hopper, on the upper floor
  const sy = MILL.floorY + 0.25;
  const runner = mesh(place(cyl(1.0, 1.0, 0.3, 40), 0, sy + 0.62, 0), new MeshStandardMaterial({ map:T.millstone.map, color:0xffffff, roughness:0.95 }), true, "runnerStone"); lant.add(runner);
  const bed = mesh(place(cyl(1.04, 1.04, 0.32, 40), 0, sy + 0.2, 0), M.stone, true); H.bedstone = bed; lant.add(bed);
  lant.add(mesh(place(cyl(0.16, 0.16, 0.5, 10), 0, sy + 1.0, 0), M.iron, true));
  lant.add(mesh(box(2.2, 0.08, 0.1, 1), M.iron, true));
  lant.children[lant.children.length - 1].position.set(0, sy + 0.82, 0);
  root.add(lant);
  // static millwork: tun (vat), hopper on legs, shoe, flour chute + sack
  const st = [];
  const tun = mesh(new CylinderGeometry(1.32, 1.32, 0.62, 40, 1, true), new MeshStandardMaterial({ map:T.wood.map, normalMap:T.wood.normal, color:0xc9a77c, side:DoubleSide, roughness:0.8 }), true); tun.position.set(lx, sy + 0.45, lz); root.add(tun);
  [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]].forEach(p => st.push(place(box(0.14, 2.4, 0.14, 1), lx + p[0], sy + 1.6, lz + p[1])));
  const hop = new CylinderGeometry(0.2, 0.95, 0.9, 4, 1, true); hop.rotateY(Math.PI / 4); hop.translate(lx, sy + 3.15, lz);
  root.add(mesh(merge(st), M.woodDark), mesh(hop, new MeshStandardMaterial({ map:T.wood.map, color:0xb89468, side:DoubleSide, roughness:0.85 }), true));
  const chute = mesh(plank(sy + 0.45, 0, sy - 0.65, 1.2, 0.34, 0.06), M.wood, true); chute.position.set(lx + 1.15, 0, lz + 0.3); chute.rotation.y = 0; root.add(chute);
  const sack = mesh(box(0.7, 0.9, 0.5, 1), new MeshStandardMaterial({ color:0xd8c9a3, roughness:1 }), true); sack.position.set(lx + 1.15, MILL.floorY + 0.5, lz + 1.6); root.add(sack);
  const flour = mesh(new CylinderGeometry(0.05, 0.38, 0.5, 14), new MeshStandardMaterial({ color:0xf4efe2, roughness:1 }), false); flour.position.set(lx + 1.15, MILL.floorY + 0.16, lz + 2.2); flour.scale.y = 0.01; H.flour = flour; root.add(flour);
  // engage lever (tap me): a long timber lever pivoting at the floor
  const lev = new Group(); lev.position.set(lx - 1.7, MILL.floorY + 0.12, lz + 1.5); const arm = mesh(box(0.14, 1.9, 0.14, 1), M.woodDark, true, "lever"); arm.position.y = 0.95; lev.add(arm); const knob = mesh(new CylinderGeometry(0.16, 0.16, 0.2, 12), M.paintRed, true, "leverKnob"); knob.rotation.z = Math.PI / 2; knob.position.y = 1.95; lev.add(knob);
  lev.add(mesh(box(0.5, 0.3, 0.3, 1), M.stone, true)); lev.children[lev.children.length - 1].position.set(0, 0.0, 0); H.lever = lev; root.add(lev);

  /* ===== sawmill: belt from the axle pulley to fast & loose pulleys on the saw arbor ===== */
  const sawG = new Group(); sawG.name = "sawmill"; H.sawGroup = sawG; root.add(sawG);
  const arbor = new Group(); arbor.position.set(0, SAW.y, SAW.z); H.arbor = arbor;
  arbor.add(mesh(place(cyl(0.1, 0.1, SAW.arborX1 - SAW.arborX0 + 0.8, 10), (SAW.arborX0 + SAW.arborX1) / 2, 0, 0, 0, 0, Math.PI / 2), M.iron, true));
  arbor.add(mesh(place(cyl(SAW.pulleyR, SAW.pulleyR, 0.46, 24), SAW.fastX, 0, 0, 0, 0, Math.PI / 2), M.iron, true));
  const loose = mesh(place(cyl(SAW.pulleyR, SAW.pulleyR, 0.46, 24), SAW.looseX, 0, 0, 0, 0, Math.PI / 2), M.steel, true); H.loose = loose; arbor.add(loose);
  const blade = toothShape(52, 1.0, 0.9, 0.12, 0, "saw"), bg = extrude(blade, 0.035, 0, 24); bg.rotateY(Math.PI / 2); bg.translate(SAW.blade, 0, 0);
  arbor.add(mesh(bg, M.steel, true, "sawBlade"), mesh(place(cyl(0.3, 0.3, 0.08, 20), SAW.blade + 0.05, 0, 0, 0, 0, Math.PI / 2), M.iron, true));
  sawG.add(arbor);
  // saw frame + table + a log on a carriage
  const fr = [place(box(0.4, 1.7, 0.4, 1), SAW.arborX0 - 0.2, 0.85, SAW.z - 0.4), place(box(0.4, 1.7, 0.4, 1), SAW.arborX1 + 0.1, 0.85, SAW.z - 0.4), place(box(0.4, 1.7, 0.4, 1), SAW.arborX0 - 0.2, 0.85, SAW.z + 0.4), place(box(0.4, 1.7, 0.4, 1), SAW.arborX1 + 0.1, 0.85, SAW.z + 0.4)];
  fr.push(place(box(SAW.arborX1 - SAW.arborX0 + 0.8, 0.22, 1.3, 1), (SAW.arborX0 + SAW.arborX1) / 2, 1.78 - 0.9 + 0.0, SAW.z));
  sawG.add(mesh(merge(fr), M.woodDark));
  const rails = [place(box(9.0, 0.16, 0.2, 1), 5.0, 0.62, SAW.z - 0.5), place(box(9.0, 0.16, 0.2, 1), 5.0, 0.62, SAW.z + 0.5)]; sawG.add(mesh(merge(rails), M.iron));
  const log = mesh(cyl(0.38, 0.4, 2.6, 14), new MeshStandardMaterial({ map:T.wood.map, normalMap:T.wood.normal, color:0xb08a5c, roughness:0.9 }), true, "log"); log.rotation.z = Math.PI / 2; log.position.set(6.0, 1.05, SAW.z); H.log = log; sawG.add(log);
  const sawn = mesh(box(1.4, 0.16, 0.7, 1), M.wood, true); sawn.visible = false; H.sawn = sawn; sawG.add(sawn);

  /* ===== belt (flat leather, closed loop in the YZ plane) ===== */
  H.beltTex = T.belt.map.clone(); H.beltTex.wrapS = H.beltTex.wrapT = RepeatWrapping; H.beltTex.needsUpdate = true;
  H.belt = makeBelt(new Vector3(0, wy, wz), AXLE_PULLEY.r + 0.02, new Vector3(0, SAW.y, SAW.z), SAW.pulleyR + 0.02, 0.4, H.beltTex);
  H.belt.position.x = SAW.fastX; sawG.add(H.belt);
  return H;
}

/* closed belt loop around two pulleys (outer tangents), as a thin strip */
function makeBelt(c1, r1, c2, r2, width, tex){
  const dy = c2.y - c1.y, dz = c2.z - c1.z, D = Math.hypot(dy, dz), a0 = Math.atan2(dz, dy), phi = Math.acos((r1 - r2) / D), pts = [];
  for(let i = 0; i <= 24; i++){ const a = a0 + phi + (Math.PI * 2 - 2 * phi) * i / 24; pts.push([c1.y + r1 * Math.cos(a), c1.z + r1 * Math.sin(a)]); }
  for(let i = 0; i <= 24; i++){ const a = a0 - phi + (2 * phi) * i / 24; pts.push([c2.y + r2 * Math.cos(a), c2.z + r2 * Math.sin(a)]); }
  const n = pts.length, pos = [], uv = [], idx = [], nor = []; let len = 0;
  for(let i = 0; i < n; i++){
    const p = pts[i], q = pts[(i + 1) % n], pr = pts[(i + n - 1) % n]; if(i) len += Math.hypot(p[0] - pr[0], p[1] - pr[1]);
    const ty = q[0] - pr[0], tz = q[1] - pr[1], tl = Math.hypot(ty, tz) || 1, ny = tz / tl, nz = -ty / tl;
    for(let k = 0; k < 2; k++){ pos.push((k ? 1 : -1) * width / 2, p[0], p[1]); nor.push(0, ny, nz); uv.push(k, len / 1.2); }
    const j = i * 2, jn = ((i + 1) % n) * 2; idx.push(j, j + 1, jn, j + 1, jn + 1, jn);
  }
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new Float32BufferAttribute(nor, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  const m = new Mesh(g, new MeshStandardMaterial({ map:tex, color:0xffffff, roughness:0.7, side:DoubleSide })); m.castShadow = true; m.receiveShadow = true; m.name = "belt"; return m;
}
