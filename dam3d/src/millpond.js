/* THE MILLPOND and the RESERVOIR RELEASE GATE.
   A stone-walled basin built into the lake against the dam face, in front of the sluice gate. Water gets into it only through the release gate in its front wall;
   the sluice gate at the dam end draws it out toward the flume. Its own water surface rises and falls with the shared hydraulic state (vs.pondL),
   independently of the lake (vs.resL). Pieces: masonry walls, two pylons, a lifting steel gate with hoist deck and handwheel, pond surface, inflow jet. */
import { Group, Mesh, PlaneGeometry, Vector3, TorusGeometry } from "three";
import { box, cyl, place, merge } from "./geo.js";
import { waterMaterial, ribbonGeometry } from "./water.js";
import { CREST_Y, WATER_Y } from "./terrain.js";
import { lerp, clamp } from "./util.js";

export const POND = { x0:3.8, x1:10.2, z0:-25.1, z1:-17.6, gateZ:-25.6, sill:6.2, travel:2.6, cx:7 };

export function buildMillpond(S){
  const { mats:M, world } = S, g = new Group(); g.name = "millpond";
  const W = (w, h, d, x, y, z) => place(box(w, h, d, 0.3), x, y, z);
  const wall = [];
  wall.push(W(1.2, 17, 8.6, 3.2, 2.6, -21.8), W(1.2, 17, 8.6, 10.8, 2.6, -21.8));                                  // side walls
  wall.push(W(2.2, 17, 1.2, 4.3, 2.6, POND.gateZ), W(2.2, 17, 1.2, 9.7, 2.6, POND.gateZ));   // front wall: the gate opening is open from the sill (y 6.2) up
  wall.push(W(4.0, 11.8, 1.2, 7, 0.3, POND.gateZ));                                                                  // solid below the sill
  const walls = new Mesh(merge(wall), M.stone); walls.castShadow = true; walls.receiveShadow = true; g.add(walls);
  // release gate: steel plate in guides, two screw stems, hoist deck with gearbox + handwheel
  const gate = new Group(), gp = [place(box(3.2, 4.0, 0.14, 0.4), 0, 0, 0)]; for(let k = 0; k < 4; k++) gp.push(place(box(3.2, 0.16, 0.3, 0.4), 0, -1.5 + k * 1.0, 0.18));
  gate.add(Object.assign(new Mesh(merge(gp), M.steel), { castShadow:true, receiveShadow:true })); gate.add(Object.assign(new Mesh(merge([place(cyl(0.06, 0.06, 7.5, 8), -1.2, 3.7, 0), place(cyl(0.06, 0.06, 7.5, 8), 1.2, 3.7, 0)]), M.iron), { castShadow:true }));
  gate.position.set(7, POND.sill + 2.0, POND.gateZ + 0.35); g.add(gate);
  const hoist = [place(box(5.4, 0.28, 2.0), 7, 13.4, POND.gateZ), place(box(0.5, 3.4, 0.5), 4.6, 11.7, POND.gateZ + 0.5), place(box(0.5, 3.4, 0.5), 9.4, 11.7, POND.gateZ + 0.5), place(box(0.5, 3.4, 0.5), 4.6, 11.7, POND.gateZ - 0.5), place(box(0.5, 3.4, 0.5), 9.4, 11.7, POND.gateZ - 0.5)];
  g.add(Object.assign(new Mesh(merge(hoist), M.concrete), { castShadow:true, receiveShadow:true }));
  const gb = Object.assign(new Mesh(box(1.1, 0.7, 0.8, 0.3), M.paintRed), { castShadow:true }); gb.position.set(7, 13.9, POND.gateZ); g.add(gb);
  const hw = new Group(); hw.position.set(7, 13.9, POND.gateZ + 0.5); hw.add(new Mesh(new TorusGeometry(0.32, 0.035, 8, 20), M.steel)); for(let k = 0; k < 4; k++){ const sp = new Mesh(cyl(0.025, 0.025, 0.64, 5), M.steel); sp.rotation.z = k * Math.PI / 4; hw.add(sp); } g.add(hw);
  // pond surface (own level) — same water shader as the lake
  const pg = new PlaneGeometry(POND.x1 - POND.x0, POND.z1 - POND.z0, 1, 1); pg.rotateX(-Math.PI / 2);
  const n = pg.attributes.position.count, uv = pg.attributes.uv, pos = pg.attributes.position, tan = new Float32Array(n * 3), fo = new Float32Array(n);
  for(let i = 0; i < n; i++){ tan[i * 3] = 1; uv.setXY(i, pos.getX(i) + POND.cx, pos.getZ(i)); }
  pg.setAttribute("aTan", new (pos.constructor)(tan, 3)); pg.setAttribute("aFoam", new (pos.constructor)(fo, 1));
  const pm = waterMaterial(world.shared, { speed:0.12, amp:0.7, scale:0.16, across:0.16, deep:"#0d4a74", shallow:"#2f8aa0", opacity:1, clear:1, edgeFoam:0, transparent:false, depthWrite:true });
  const pond = new Mesh(pg, pm); pond.position.set(POND.cx, 8.6, (POND.z0 + POND.z1) / 2); pond.renderOrder = 1; g.add(pond);
  // inflow jet through the release gate (a short fast, foamy ribbon)
  const pts = []; for(let i = 0; i <= 10; i++) pts.push(new Vector3(7, 8.6, lerp(POND.gateZ + 0.2, POND.gateZ + 4.6, i / 10)));
  const jet = new Mesh(ribbonGeometry(pts, 3.0, i => 1 - i / 12), waterMaterial(world.shared, { speed:2.0, amp:1.2, scale:0.35, stretch:0.6, shallow:"#9fe0e4", deep:"#3a96b4", opacity:0.9, clear:0.1, edgeFoam:0.6, white:0.2 })); jet.renderOrder = 3; jet.frustumCulled = false; g.add(jet);
  g.userData.noReflect = false;
  S.scene.add(g); S.parts.millpond = g; S.parts.releaseGate = gate; S.parts.releaseWheel = hw; S.parts.pondSurface = pond; S.extras.push(g);
  S.hook.push((vs, dt, time, rd) => {
    gate.position.y = POND.sill + 2.0 + vs.relA * POND.travel; hw.rotation.z = vs.relA * 9 * Math.PI;
    pond.position.y = vs.pondL;
    const q = clamp(vs.Qrel / 13, 0, 1.6);
    jet.visible = q > 0.04 && vs.resL > 6.4; if(jet.visible){ jet.position.y = Math.min(vs.pondL, vs.resL) - 8.6 + 0.04; const u = jet.material.uniforms; u.uSpeed.value = rd ? 0 : 1 + 3 * q; u.uFlow.value = 0.4 + 0.6 * Math.min(1, q); u.uOpacity.value = 0.5 + 0.4 * Math.min(1, q * 2); }
  });
  return g;
}
