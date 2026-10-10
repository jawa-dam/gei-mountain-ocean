/* geometry helpers: world-scaled box UVs, gear/saw shapes, merge */
import { BoxGeometry, Shape, Path, ExtrudeGeometry, CylinderGeometry, BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* box with UVs in world units × s, so concrete / timber / stone textures keep one texel density everywhere */
export function box(w, h, d, s = 0.25){
  const g = new BoxGeometry(w, h, d), uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for(let f = 0; f < 6; f++) for(let v = 0; v < 4; v++){ const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] * s, uv.getY(i) * dims[f][1] * s); }
  return g;
}
export function cyl(rt, rb, h, seg = 16, s = 0.25){
  const g = new CylinderGeometry(rt, rb, h, seg, 1), uv = g.attributes.uv, c = Math.PI * 2 * Math.max(rt, rb);
  for(let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * c * s, uv.getY(i) * h * s);
  return g;
}
export function place(g, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0){ if(rx) g.rotateX(rx); if(ry) g.rotateY(ry); if(rz) g.rotateZ(rz); g.translate(x, y, z); return g; }
export function merge(list){
  const a = list.map(g => g.index ? g.toNonIndexed() : g);
  a.forEach(g => { for(const k of Object.keys(g.attributes)) if(k !== "position" && k !== "normal" && k !== "uv") g.deleteAttribute(k); if(!g.attributes.uv){ const n = g.attributes.position.count; g.setAttribute("uv", new (g.attributes.position.constructor)(new Float32Array(n * 2), 2)); } });
  const m = mergeGeometries(a, false); a.forEach(g => g.dispose()); return m;
}
export function scaleUV(g, s){ const uv = g.attributes.uv; for(let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * s, uv.getY(i) * s); return g; }
const polar = (r, a) => [Math.cos(a) * r, Math.sin(a) * r];

/* toothed disc profile (xy plane). tooth: 'trap' symmetric cog · 'saw' asymmetric ratchet. holes: centre bore + n lightening windows */
export function toothShape(n, ro, ri, bore, windows = 0, kind = "trap", rWinIn = 0, rWinOut = 0){
  const s = new Shape(), a = Math.PI * 2 / n;
  for(let i = 0; i < n; i++){
    const t = i * a, pts = kind === "saw" ? [polar(ri, t), polar(ro, t + a * 0.08), polar(ri, t + a * 0.92 - 0.0001)] : [polar(ri, t), polar(ro, t + a * 0.2), polar(ro, t + a * 0.46), polar(ri, t + a * 0.66)];
    pts.forEach((p, k) => (i === 0 && k === 0) ? s.moveTo(p[0], p[1]) : s.lineTo(p[0], p[1]));
  }
  const hole = new Path(); hole.absarc(0, 0, bore, 0, Math.PI * 2, true); s.holes.push(hole);
  for(let k = 0; k < windows; k++){
    const a0 = (k + 0.14) / windows * Math.PI * 2, a1 = (k + 0.86) / windows * Math.PI * 2, w = new Path(), steps = 6;
    for(let j = 0; j <= steps; j++){ const p = polar(rWinOut, a0 + (a1 - a0) * j / steps); j ? w.lineTo(p[0], p[1]) : w.moveTo(p[0], p[1]); }
    for(let j = steps; j >= 0; j--){ const p = polar(rWinIn, a0 + (a1 - a0) * j / steps); w.lineTo(p[0], p[1]); }
    s.holes.push(w);
  }
  return s;
}
export function extrude(shape, depth, bevel = 0.02, curve = 24){
  const g = new ExtrudeGeometry(shape, { depth, bevelEnabled:bevel > 0, bevelSize:bevel, bevelThickness:bevel, bevelSegments:1, curveSegments:curve });
  g.translate(0, 0, -depth / 2); return g;
}
