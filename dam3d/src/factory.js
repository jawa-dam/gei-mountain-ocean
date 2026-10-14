/* THE FACTORY WING: a forge shed beside the mill with a trip hammer driven by a line shaft from the wheel's axle, a brick chimney that smokes with production,
   and a stack of sawn boards that grows as the sawmill works. Only present when the Day's machine count is 3 (vs.M ≥ 3); otherwise hidden, so earlier Days keep
   exactly the approved look. Geometry is real (cam drum with lobes, pivoting oak helve, iron head, anvil block, brick stack). */
import { Group, Mesh, MeshStandardMaterial } from "three";
import { box, cyl, place, merge } from "./geo.js";
import { WHEEL } from "./terrain.js";
import { MILL } from "./structures.js";
import { clamp } from "./util.js";

export const FORGE = { x0:-15.4, x1:-9.6, z0:-5.2, z1:1.6, shaftY:WHEEL.y, shaftZ:WHEEL.z, camX:-12.6 };

export function buildFactory(S){
  const { mats:M, em } = S, g = new Group(); g.name = "factory"; g.visible = false;
  const mesh = (geo, mat, shadow = true) => { const m = new Mesh(geo, mat); m.castShadow = shadow; m.receiveShadow = true; return m; };
  const { x0, x1, z0, z1 } = FORGE, xm = (x0 + x1) / 2, zm = (z0 + z1) / 2;
  // masonry floor + back/left walls, open front and right (cutaway like the mill)
  g.add(mesh(merge([place(box(x1 - x0 + 0.6, 0.6, z1 - z0 + 0.6, 0.3), xm, 0.3, zm), place(box(x1 - x0, 6.2, 0.7, 0.3), xm, 3.1, z0 + 0.35), place(box(0.7, 6.2, z1 - z0, 0.3), x0 + 0.35, 3.1, zm)]), M.stone));
  const posts = []; [[x0 + 0.4, z1 - 0.4], [x1 - 0.4, z1 - 0.4], [x1 - 0.4, z0 + 0.4]].forEach(p => posts.push(place(box(0.36, 6.4, 0.36), p[0], 3.4, p[1]))); posts.push(place(box(x1 - x0, 0.34, 0.34), xm, 6.4, z1 - 0.4), place(box(0.34, 0.34, z1 - z0), x1 - 0.4, 6.4, zm));
  g.add(mesh(merge(posts), M.woodDark));
  const roof = mesh(box(x1 - x0 + 1.6, 0.3, z1 - z0 + 1.6, 0.3), M.roof); roof.rotation.z = -0.1; roof.position.set(xm, 7.0, zm); g.add(roof);
  // chimney
  const chim = mesh(merge([place(cyl(0.62, 0.78, 9.4, 14), 0, 4.7, 0), place(cyl(0.8, 0.8, 0.5, 14), 0, 9.5, 0)]), new MeshStandardMaterial({ color:0x8b4a38, roughness:0.95 })); chim.position.set(x0 + 1.6, 0, z0 + 1.4); g.add(chim);
  // line shaft from the wheel's axle across the mill to the forge (turns with the wheel)
  const shaft = new Group(); shaft.position.set(0, FORGE.shaftY, FORGE.shaftZ);
  const sx0 = FORGE.camX - 1.4, sx1 = 0.0; shaft.add(mesh(place(cyl(0.15, 0.15, sx1 - sx0, 12), (sx0 + sx1) / 2, 0, 0, 0, 0, Math.PI / 2), M.iron));
  const drum = [place(cyl(0.34, 0.34, 1.3, 16), FORGE.camX, 0, 0, 0, 0, Math.PI / 2)]; for(let k = 0; k < 4; k++){ const a = k * Math.PI / 2, lobe = box(0.4, 0.34, 0.22, 1); lobe.translate(0, 0.46, 0); lobe.rotateX(a); lobe.translate(FORGE.camX, 0, 0); drum.push(lobe); }
  shaft.add(mesh(merge(drum), M.iron)); g.add(shaft);
  // bearings along the line shaft
  g.add(mesh(merge([-3.0, -6.4, -9.4].map(x => place(box(0.7, 0.9, 0.9, 1), x, FORGE.shaftY - 0.6, FORGE.shaftZ)).concat([place(box(0.7, 0.9, 0.9, 1), FORGE.camX - 1.3, FORGE.shaftY - 0.6, FORGE.shaftZ)])), M.stone));
  // trip hammer: oak helve pivoting on a post, iron head over the anvil; a cam lobe lifts the tail
  const piv = new Group(); piv.position.set(FORGE.camX, 1.9, FORGE.shaftZ + 1.7);
  const helve = mesh(box(0.3, 0.3, 4.4, 0.5), M.wood); helve.position.set(0, 0, -0.6); piv.add(helve);
  const head = mesh(box(0.7, 0.8, 0.9, 1), M.iron); head.position.set(0, -0.15, 1.65); piv.add(head);
  g.add(piv);
  g.add(mesh(merge([place(box(0.5, 2.3, 0.5, 1), FORGE.camX, 0.9 + 0.2, FORGE.shaftZ + 1.7 + 0.0), place(box(1.0, 0.9, 1.4, 1), FORGE.camX, 0.55 + 0.0, FORGE.shaftZ + 3.35 + 0.0)]), M.iron));
  // stack of sawn boards that grows with the sawmill's output
  const boards = []; for(let k = 0; k < 10; k++){ const b = mesh(box(2.4, 0.12, 0.7, 1), M.wood); b.position.set(6.0 + (k % 2) * 0.05, 0.1 + 0.13 * k, 4.6); b.visible = false; boards.push(b); g.add(b); }
  S.scene.add(g); S.parts.factory = g; S.parts.hammer = piv; S.extras.push(g);
  let phase = 0, prevSin = 0, shown = 0;
  S.pickables = S.pickables || [];
  S.hook.push((vs, dt, time, rd) => {
    const on = vs.M >= 3; g.visible = on; if(!on) return;
    shaft.rotation.x = S.mach.drive.rotation.x;                                       // the line shaft is the wheel's axle extended
    const om = Math.abs(S.mach.drive.rotation.x);
    const cam = shaft.rotation.x;                                                     // lobes: 4 per turn
    // hammer: lifted while a lobe passes under the tail, then falls
    const running = vs.as[2] && vs.run[2];
    const w = vs.as[2] ? Math.sin(cam * 4) : 0, lift = vs.as[2] ? clamp(w, 0, 1) : 0;
    piv.rotation.x = -0.52 * (rd ? (running ? 0.3 : 0) : Math.pow(lift, 0.6));
    if(!rd && vs.as[2] && prevSin > 0.05 && w <= 0.05 && running){ for(let i = 0; i < 6; i++) em.spark.emit(FORGE.camX + (Math.random() - .5) * 0.6, 1.4, FORGE.shaftZ + 3.2, (Math.random() - .5) * 3, 2 + Math.random() * 2.5, 1.5 + Math.random() * 2, 0.5, 0.06, 0.9); }
    prevSin = w;
    // smoke ∝ production
    if(!rd && vs.as.some(Boolean) && Math.random() < dt * (6 + 24 * clamp(vs.units / 80, 0, 1) + 10 * (vs.run[2] ? 1 : 0))) em.smoke.emit(x0 + 1.6 + (Math.random() - .5) * 0.4, 10.0, z0 + 1.4 + (Math.random() - .5) * 0.4, 0.5 + Math.random() * 0.6, 1.4 + Math.random(), (Math.random() - .5) * 0.4, 3.0, 0.7, 0.34);
    const nb = Math.min(10, Math.floor(vs.units / 6)); if(nb !== shown){ boards.forEach((b, k) => b.visible = k < nb); shown = nb; }
  });
  return g;
}
