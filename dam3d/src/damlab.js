/* THE DAM SECTION MODEL — an engineer's cutaway of the dam on a plinth beside the river, used by Day 2 (and hidden otherwise).
   It shows what you cannot see from downstream: the reservoir water, the pressure acting on every lift of the wall (arrows that grow with depth), and the wall's real
   profile, with a failing lift turning red and weeping. It is driven by the very same wall thickness that rebuilds the REAL dam's profile. */
import { Group, Mesh, MeshStandardMaterial, MeshBasicMaterial, ExtrudeGeometry, Shape, BoxGeometry, ConeGeometry, CylinderGeometry, InstancedMesh, Matrix4, Object3D, Color, PlaneGeometry } from "three";
import { box, cyl, place, merge } from "./geo.js";
import { clamp } from "./util.js";
import { DAM_BD } from "./structures.js";

export const LAB = { x:-1.5, z:15.5, sc:0.4, w:2.6, rows:5, k:1.55 };
const BASE = -3, TOP = 10.2;                                  // real-dam heights represented (model y = (y − BASE) × sc)

export function buildDamLab(S){
  const { mats:M } = S, g = new Group(); g.name = "damLab"; g.visible = false; g.position.set(LAB.x, 0, LAB.z); g.scale.setScalar(LAB.k);
  const mesh = (geo, mat, sh = true) => { const m = new Mesh(geo, mat); m.castShadow = sh; m.receiveShadow = true; return m; };
  const sc = LAB.sc, H = (TOP - BASE) * sc, plinthH = 0.55;
  g.add(mesh(merge([place(box(5.6, plinthH, 5.8, 0.3), 0, plinthH / 2, 0), place(box(5.9, 0.16, 6.1, 0.3), 0, 0.08, 0)]), M.stone));
  const stand = new Group(); stand.position.y = plinthH; g.add(stand);
  // wall section (rebuilt from the five thicknesses)
  const wallMat = new MeshStandardMaterial({ map:S.T.concrete.map, normalMap:S.T.concrete.normal, color:0xe4e0d8, roughness:0.9 }), wall = mesh(new BoxGeometry(0.01, 0.01, 0.01), wallMat); stand.add(wall);
  // reservoir water block (translucent)
  const waterMat = new MeshStandardMaterial({ color:0x3aa6d0, roughness:0.08, metalness:0, transparent:true, opacity:0.55, envMapIntensity:1.4 }), water = new Mesh(new BoxGeometry(LAB.w, 1, 2.6), waterMat); water.castShadow = false; stand.add(water);
  // pressure arrows, one per lift, each = shaft + head; instanced
  const sh = cyl(0.08, 0.08, 1, 8), hd = new ConeGeometry(0.2, 0.36, 10); sh.translate(0, 0.5, 0); hd.translate(0, 1.18, 0);
  const arrows = [];
  const arrowMat = new MeshStandardMaterial({ color:0xff9df2, emissive:0xf310ba, emissiveIntensity:0.35, roughness:0.5 });
  for(let r = 0; r < LAB.rows; r++){ const a = new Group(); a.add(mesh(sh, arrowMat, false), mesh(hd, arrowMat, false)); a.rotation.x = Math.PI / 2; stand.add(a); arrows.push(a); }   // +y of the arrow → +z (into the wall)
  // tap targets for the lifts (invisible)
  const hits = []; for(let r = 0; r < LAB.rows; r++){ const m = new Mesh(new BoxGeometry(LAB.w + 0.4, 0.5, 2.4), new MeshBasicMaterial({ visible:false })); m.userData.row = r; stand.add(m); hits.push(m); }
  // weeping droplets on a failing lift
  const leakMat = new MeshStandardMaterial({ color:0x9fe6ff, roughness:0.05, transparent:true, opacity:0.8 }), leak = new Mesh(new BoxGeometry(LAB.w * 0.7, 0.05, 0.5), leakMat); leak.visible = false; stand.add(leak);
  S.scene.add(g); S.parts.damLab = g; S.extras.push(g);
  const L = { group:g, hits, th:[0, 0, 0, 0, 0], need:[4, 4, 3, 2, 1], lev:0, fail:-1, show:false };
    const profile = () => {         // (z toward +z downstream, y) of the model: lake on −z; the same five stacked lifts as the real dam, thickness × sc
    const t = L.th.map(u => 1.8 + 1.7 * u), zu = -1.3, y = k => (DAM_BD[k] - BASE) * sc, pts = [[zu, 0], [zu, H]];
    for(let r = 4; r >= 0; r--){ pts.push([zu + t[r] * sc, r === 4 ? H : y(r + 1)], [zu + t[r] * sc, y(r)]); }
    pts.push([zu + t[0] * sc, 0]); return pts;
  };
  L.rebuild = () => {
    const s = new Shape(); const p = profile(); p.forEach((q, i) => i ? s.lineTo(q[0], q[1]) : s.moveTo(q[0], q[1]));
    const geo = new ExtrudeGeometry(s, { depth:LAB.w, bevelEnabled:false }); geo.rotateY(-Math.PI / 2); geo.translate(LAB.w / 2, 0, 0);      // shape x → world z, extrude → world x
    geo.attributes.uv.array.forEach((v, i, a) => a[i] = v * 0.6);
    const old = wall.geometry; wall.geometry = geo; old.dispose();
    for(let r = 0; r < LAB.rows; r++){ const yMid = ((DAM_BD[r] + DAM_BD[r + 1]) / 2 - BASE) * sc; hits[r].position.set(0, yMid, -0.3); hits[r].scale.set(1, (DAM_BD[r + 1] - DAM_BD[r]) * sc / 0.5, 1); }
  };
  L.update = (resLev) => {                // resLev 0..rows
    const lev = clamp(resLev, 0, LAB.rows), yTop = (lev / LAB.rows) * H;
    water.scale.y = Math.max(0.001, yTop); water.position.set(0, yTop / 2, -1.3 - 1.3);
    for(let r = 0; r < LAB.rows; r++){
      const rowY = ((DAM_BD[r] + DAM_BD[r + 1]) / 2 - BASE) * sc, depth = Math.max(0, yTop - rowY), a = arrows[r];
      a.visible = depth > 0.02; const len = 0.25 + depth * 1.9; a.scale.set(1, len, 1); a.position.set(0, rowY, -1.3 - len - 0.18); a.children.forEach(c => { c.material = r === L.fail ? failMat : arrowMat; });
    }
    leak.visible = L.fail >= 0; if(L.fail >= 0){ const yL = ((DAM_BD[L.fail] + DAM_BD[L.fail + 1]) / 2 - BASE) * sc; leak.position.set(0, yL, -1.3 + (1.8 + 1.7 * L.th[L.fail]) * sc + 0.2); }
    wall.material.color.setHex(L.fail >= 0 ? 0xf0b7d8 : 0xe4e0d8);
  };
  const failMat = new MeshStandardMaterial({ color:0xff3b6a, emissive:0xff1a55, emissiveIntensity:0.9, roughness:0.4 });
  L.rebuild(); L.update(0);
  return L;
}
