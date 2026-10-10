/* THE MOUNTAIN SOURCE WORKS — a masonry terrace on the reservoir's east shore where the spring is captured and divided.
   A spring head feeds stone troughs that fork at wooden diverter flaps; the branches end in the RESERVOIR chute (a real waterfall down the slope into the lake),
   terrace basins, or a scree drain where water is simply lost. In Day 1 the player turns the forks; in every other Day the terrace runs a default route and the waterfall
   into the lake follows the shared inflow (so a storm is visible at its source). Layouts 1–3 are the same fork graphs as the SVG Day 1. */
import { Group, Mesh, MeshStandardMaterial, IcosahedronGeometry, PlaneGeometry, Vector3, CylinderGeometry, CatmullRomCurve3 } from "three";
import { box, cyl, place, merge } from "./geo.js";
import { waterMaterial, ribbonGeometry } from "./water.js";
import { waterfallPath, heightAt } from "./terrain.js";
import { lerp, clamp, rng } from "./util.js";

export const TERRACE = { x0:40.2, x1:50.8, z0:-69, z1:-33, top:25 };
/* the 2D layouts, mapped onto the terrace: (x2d, y2d) → world (x east/back, z along the shore) */
const P2 = (x2, y2) => [49.4 - (y2 - 36) / 178 * 8.6, -51 - (x2 - 180) * 0.115];       // mirrored so the RESERVOIR outlet is at the high, near end (long drop to the lake)
const LAYOUTS = {
  1:{ nodes:{ src:["src", 180, 36], F1:["fork", 180, 104, ["T1", "T2"], 0], T1:["tgt", 84, 208, "RESERVOIR"], T2:["tgt", 276, 208, "TERRACES"] }, route0:{ F1:0 } },
  2:{ nodes:{ src:["src", 180, 36], F1:["fork", 150, 92, ["T1", "F2"], 2], F2:["fork", 250, 140, ["T2", "D1"], 2], T1:["tgt", 70, 208, "RESERVOIR"], T2:["tgt", 206, 214, "TERRACES"], D1:["drain", 314, 214, "SCREE"] }, route0:{ F1:0, F2:0 } },
  3:{ nodes:{ src:["src", 180, 36], F1:["fork", 180, 84, ["F2", "F3"], 0], F2:["fork", 96, 136, ["T1", "D1"], 2], F3:["fork", 264, 136, ["T2", "T3"], 0], T1:["tgt", 54, 214, "RESERVOIR"], D1:["drain", 138, 218, "SCREE"], T2:["tgt", 222, 214, "TERRACES"], T3:["tgt", 308, 214, "VILLAGE WELL"] }, route0:{ F1:0, F2:0, F3:0 } }
};

export function buildSource(S){
  const { mats:M, world } = S, root = new Group(); root.name = "source"; S.scene.add(root); S.extras.push(root);
  const mesh = (geo, mat, sh = true) => { const m = new Mesh(geo, mat); m.castShadow = sh; m.receiveShadow = true; return m; };
  // masonry terrace (a solid block let into the slope) + low parapet at the front edge
  const { x0, x1, z0, z1, top } = TERRACE, zm = (z0 + z1) / 2;
  root.add(mesh(merge([place(box(x1 - x0, top - 6, z1 - z0, 0.3), (x0 + x1) / 2, (top + 6) / 2, zm)]), M.stone));
  root.add(mesh(box(x1 - x0 - 0.2, 0.12, z1 - z0 - 0.2, 0.3), new MeshStandardMaterial({ color:0x4f4638, roughness:1 }))); root.children[root.children.length - 1].position.set((x0 + x1) / 2, top + 0.02, zm);
  root.add(mesh(merge([place(box(0.5, 0.9, z1 - z0, 0.3), x0 + 0.25, top + 0.45, zm), place(box(x1 - x0, 0.9, 0.5, 0.3), (x0 + x1) / 2, top + 0.45, z0 + 0.25), place(box(x1 - x0, 0.9, 0.5, 0.3), (x0 + x1) / 2, top + 0.45, z1 - 0.25)]), M.concrete));
  // spring head: a rock mound with a welling pool
  const R = rng(11), ico = new IcosahedronGeometry(1, 1), rocks = [];
  for(let i = 0; i < 6; i++){ const r = ico.clone(); r.scale(1.2 + R() * 1.2, 0.9 + R() * 0.8, 1.2 + R() * 1.2); r.translate(50.4 + (R() - .5) * 2.2, top + 0.6 + R() * 0.8, -50 + (R() - .5) * 3.4); rocks.push(r); }
  root.add(mesh(merge(rocks), new MeshStandardMaterial({ color:0x7d766c, roughness:0.95 })));
  const pool = mesh(new CylinderGeometry(1.1, 1.1, 0.12, 20), new MeshStandardMaterial({ color:0x4fc7e0, roughness:0.05, transparent:true, opacity:0.85 }), false); pool.position.set(49.6, top + 1.3, -50); root.add(pool);

  const dyn = new Group(); root.add(dyn);
  const SRC = { group:root, layout:0, nodes:{}, edges:[], flaps:{}, hits:[], basins:{}, drains:{}, fall:null, state:{ route:{}, flows:{}, fill:{}, lake:0 } };
  const disposeDyn = () => { dyn.traverse(o => { if(o.geometry) o.geometry.dispose(); if(o.material && o.material.dispose) o.material.dispose(); }); while(dyn.children.length) dyn.remove(dyn.children[0]); };
  const wm = o => waterMaterial(world.shared, o);

  SRC.setLayout = c => {
    disposeDyn(); SRC.layout = c; SRC.nodes = {}; SRC.edges = []; SRC.flaps = {}; SRC.hits = []; SRC.basins = {}; SRC.drains = {}; SRC.fall = null;
    const L = LAYOUTS[c], N = SRC.nodes, y0 = top + 0.02;
    Object.keys(L.nodes).forEach(id => { const d = L.nodes[id], [wx, wz] = P2(d[1], d[2]); N[id] = { id, t:d[0], x:wx, z:wz, o:d[0] === "fork" ? d[3] : null, name:d[0] === "tgt" || d[0] === "drain" ? d[3] : null, m:d[0] === "fork" ? d[4] : 0 }; });
    N.src.o = [Object.keys(N).find(k => N[k].t === "fork")];
    // troughs + water ribbons along every edge
    const trough = [];
    Object.keys(N).forEach(id => (N[id].o || []).forEach(cid => {
      const a = N[id], b = N[cid], dx = b.x - a.x, dz = b.z - a.z, len = Math.hypot(dx, dz), ang = Math.atan2(dx, dz);
      [place(box(1.7, 0.14, len, 0.4), 0, 0.07, 0), place(box(0.2, 0.62, len, 0.4), -0.75, 0.31, 0), place(box(0.2, 0.62, len, 0.4), 0.75, 0.31, 0)].forEach(t => { t.rotateY(ang); t.translate((a.x + b.x) / 2, y0, (a.z + b.z) / 2); trough.push(t); });
      const pts = []; for(let i = 0; i <= 8; i++) pts.push(new Vector3(lerp(a.x, b.x, i / 8), y0 + 0.3, lerp(a.z, b.z, i / 8)));
      const rib = new Mesh(ribbonGeometry(pts, 1.15, i => i < 2 ? 0.7 : 0.15), wm({ speed:1, amp:1.0, scale:0.4, stretch:0.6, shallow:"#8fe0e8", deep:"#2a86a8", opacity:0.9, clear:0.2, edgeFoam:0.5 })); rib.frustumCulled = false; rib.renderOrder = 3; dyn.add(rib);
      SRC.edges.push({ a:id, b:cid, rib });
    }));
    if(trough.length) dyn.add(mesh(merge(trough), M.concrete));
    // forks (junction block + wooden flap), targets (basins), drains (pits)
    Object.keys(N).forEach(id => {
      const n = N[id];
      if(n.t === "fork"){
        const blk = mesh(box(2.6, 0.9, 2.6, 0.4), M.stone); blk.position.set(n.x, y0 + 0.45, n.z); dyn.add(blk);
        const flap = new Group(); flap.position.set(n.x, y0 + 1.15, n.z); flap.add(mesh(box(0.22, 0.14, 2.0, 0.5), M.woodDark), mesh(cyl(0.22, 0.22, 0.28, 12), M.brass, false)); dyn.add(flap); SRC.flaps[id] = flap;
        const hit = new Mesh(new CylinderGeometry(1.5, 1.5, 1.6, 10), new (M.dark.constructor)({ visible:false, transparent:true, opacity:0 })); hit.position.set(n.x, y0 + 0.9, n.z); hit.userData.fork = id; dyn.add(hit); SRC.hits.push(hit);
      } else if(n.t === "tgt"){
        const w = 4.2, d = 4.2, basin = mesh(merge([place(box(w, 0.2, d, 0.4), 0, 0.1, 0), place(box(w, 1.3, 0.4, 0.4), 0, 0.65, d / 2 - 0.2), place(box(w, 1.3, 0.4, 0.4), 0, 0.65, -d / 2 + 0.2), place(box(0.4, 1.3, d, 0.4), w / 2 - 0.2, 0.65, 0), place(box(0.4, 1.3, d, 0.4), -w / 2 + 0.2, 0.65, 0)]), M.stone); basin.position.set(n.x, y0, n.z); dyn.add(basin);
        const pg = new PlaneGeometry(w - 0.8, d - 0.8); pg.rotateX(-Math.PI / 2); const cnt = pg.attributes.position.count, tan = new Float32Array(cnt * 3), fo = new Float32Array(cnt); for(let i = 0; i < cnt; i++){ tan[i * 3] = 1; pg.attributes.uv.setXY(i, pg.attributes.position.getX(i) + n.x, pg.attributes.position.getZ(i) + n.z); }
        pg.setAttribute("aTan", new (pg.attributes.position.constructor)(tan, 3)); pg.setAttribute("aFoam", new (pg.attributes.position.constructor)(fo, 1));
        const wp = new Mesh(pg, wm({ speed:0.1, amp:0.6, scale:0.3, across:0.3, deep:"#0d4a74", shallow:"#3da0b8", opacity:1, clear:1, edgeFoam:0, transparent:false, depthWrite:true })); wp.position.set(n.x, y0 + 0.25, n.z); dyn.add(wp); SRC.basins[id] = { wp, y0:y0 + 0.25, y1:y0 + 1.15 };
      } else if(n.t === "drain"){
        const pit = mesh(new CylinderGeometry(1.5, 1.7, 0.3, 14), new MeshStandardMaterial({ color:0x15171c, roughness:1 }), false); pit.position.set(n.x, y0 + 0.15, n.z); dyn.add(pit);
        const grate = mesh(merge([0, 1, 2, 3].map(k => place(box(2.6, 0.06, 0.1, 1), 0, 0.0, -0.9 + k * 0.6))), M.iron); grate.position.set(n.x, y0 + 0.32, n.z); dyn.add(grate); SRC.drains[id] = { x:n.x, z:n.z };
      }
    });
    // the reservoir chute: a stone spout at the front edge, then a waterfall that follows the real slope down into the lake
    const t1 = N.T1; if(t1){
      const sp = [t1.x - 2.2, y0 + 0.3, t1.z], spout = mesh(box(2.4, 0.7, 1.8, 0.4), M.stone); spout.position.set(sp[0] - 0.4, y0 + 0.35, sp[2]); dyn.add(spout);
      const path = waterfallPath(TERRACE.x0 - 0.5, t1.z, top); if(path.length > 3){ const pts = [new Vector3(sp[0] - 0.4, y0 + 0.6, sp[2])].concat(path.map(p => new Vector3(p[0], p[1] + 0.05, p[2])));
        const f = new Mesh(ribbonGeometry(pts, (i, tt) => lerp(1.6, 3.4, tt), (i, tt) => 0.4 + 0.5 * tt, new Vector3(0, 0, 1)), wm({ speed:2.6, amp:1.2, scale:0.25, stretch:0.5, across:2.2, shallow:"#dff6fa", deep:"#9fd4e6", opacity:0.92, clear:0.1, edgeFoam:0.9, white:0.35 })); f.frustumCulled = false; f.renderOrder = 3; dyn.add(f); SRC.fall = { mesh:f, base:pts[pts.length - 1] }; }
    }
    SRC.apply(SRC.state);
  };

  /* state: route {forkId: mode 0|1|2}, flows {nodeId: L/s into it}, edge flows computed by the caller → {a>b: q}, fill {targetId: 0..1}, srcQ */
  SRC.apply = st => { SRC.state = st; };
  const flapAng = [0.6, 0, -0.6];
  S.hook.push((vs, dt, time, rd, intro) => {
    const st = SRC.state, Qmax = st.Qmax || 12; const em = S.em;
    SRC.edges.forEach(e => { const q = (st.edge && st.edge[e.a + ">" + e.b]) || 0, u = e.rib.material.uniforms, f = clamp(q / Qmax, 0, 1); e.rib.visible = f > 0.01; u.uSpeed.value = rd ? 0 : 0.6 + 2.4 * f; u.uFlow.value = 0.3 + 0.7 * f; e.rib.scale.x = 0.5 + 0.5 * Math.sqrt(f); });
    Object.keys(SRC.flaps).forEach(id => { const f = SRC.flaps[id], tgt = flapAng[SRC.nodes[id].m]; f.rotation.y += (tgt - f.rotation.y) * Math.min(1, dt * 8); });
    Object.keys(SRC.basins).forEach(id => { const b = SRC.basins[id], k = clamp((st.fill && st.fill[id]) || 0, 0, 1); b.wp.position.y = lerp(b.y0, b.y1, k); });
    if(SRC.fall){ const q = clamp((st.fall != null ? st.fall : (st.edge && st.edge["F1>T1"]) || 0) / Qmax, 0, 1); SRC.fall.mesh.visible = q > 0.02; const u = SRC.fall.mesh.material.uniforms; u.uSpeed.value = rd ? 0 : 1.6 + 3 * q; u.uFlow.value = 0.3 + 0.7 * q; SRC.fall.mesh.scale.x = 0.4 + 0.6 * Math.sqrt(q);
      if(!rd && q > 0.05){ const n = q * 30 * dt, k = Math.floor(n) + (Math.random() < n - Math.floor(n) ? 1 : 0); for(let i = 0; i < k; i++) em.mist.emit(SRC.fall.base.x + (Math.random() - .5) * 3, vs.resL + 0.4, SRC.fall.base.z + (Math.random() - .5) * 3, (Math.random() - .5) * 0.6, 0.8 + Math.random(), (Math.random() - .5) * 0.6, 2.4, 1.0, 0.3); } }
    Object.keys(SRC.drains).forEach(id => { const q = (st.drain && st.drain[id]) || 0; if(!rd && q > 0.1){ const n = q * 6 * dt, k = Math.floor(n) + (Math.random() < n - Math.floor(n) ? 1 : 0); for(let i = 0; i < k; i++) em.spray.emit(SRC.drains[id].x + (Math.random() - .5) * 2, top + 0.5, SRC.drains[id].z + (Math.random() - .5) * 2, (Math.random() - .5) * 1.5, 1.2 + Math.random(), (Math.random() - .5) * 1.5, 0.6, 0.12, 0.6); } });
    pool.scale.y = 1 + 0.2 * Math.sin(time * 3);
  });
  SRC.setLayout(1);
  S.source = SRC; S.parts.source = root;
  return SRC;
}

/* the route solver shared by Day 1 and the default terrace (pure) */
export function routeLayout(SRC, Q0){
  const N = SRC.nodes, edge = {}, flows = {}, drain = {};
  (function go(id, q){
    const n = N[id];
    if(n.t === "fork"){ const q0 = n.m === 0 ? q : n.m === 1 ? q / 2 : 0, q1 = q - q0; edge[id + ">" + n.o[0]] = q0; edge[id + ">" + n.o[1]] = q1; go(n.o[0], q0); go(n.o[1], q1); }
    else if(n.t === "src"){ edge["src>" + n.o[0]] = q; go(n.o[0], q); }
    else if(n.t === "drain"){ drain[id] = q; flows[id] = q; } else flows[id] = q;
  })("src", Q0);
  return { edge, flows, drain };
}
