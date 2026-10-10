/* Valley terrain: a heightfield with a dam gorge, a lake basin upstream, a meandering river downstream, alpine walls and distant ranges.
   Non-uniform grid (dense at the action, coarse far away); rock / grass / dirt / snow blended into vertex colours; pines instanced. */
import { PlaneGeometry, BufferAttribute, Mesh, MeshStandardMaterial, Color, InstancedMesh, CylinderGeometry, ConeGeometry, Matrix4, Object3D, DynamicDrawUsage, BufferGeometry, Float32BufferAttribute } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { fbm, ridged, sstep, lerp, clamp, rng, vnoise } from "./util.js";

export const WATER_Y = 9.0, CREST_Y = 10.2, DAM_Z = -16.0, SEA_Y = -1.4;
export const WHEEL = { x:7, y:3.6, z:-1.0, r:3.4 };
const xc = z => -1 + 6 * Math.sin(z * 0.045 + 0.6) * sstep(-8, 22, z);
export const riverY = z => z < 18 ? lerp(0.3, -0.3, sstep(4, 18, z)) : -0.3 - 1.1 * sstep(40, 125, z);
const riverX = z => lerp(WHEEL.x, xc(z) + 1.5, sstep(3, 34, z)) + 4 * Math.sin(z * 0.11) * sstep(8, 40, z);
function hw(z){
  const k = [[-140, 40], [-60, 34], [-26, 18], [-20, 15], [-6, 15], [12, 22], [60, 40], [105, 62], [170, 420]];
  for(let i = 0; i < k.length - 1; i++) if(z <= k[i + 1][0]){ const t = sstep(k[i][0], k[i + 1][0], z); return lerp(k[i][1], k[i + 1][1], t); }
  return 420;
}
export function heightAt(x, z){
  const d = Math.abs(x - xc(z)), W = hw(z), t = Math.max(0, d - W);
  const rr = ridged(x * 0.022 + 3, z * 0.022 - 5, 5, 4);
  let h = 15 * sstep(0, 6.5, t) + 0.34 * Math.pow(t, 1.22) * (0.75 + 0.9 * rr);
  h += sstep(6, 50, t) * (rr - 0.35) * 34 + fbm(x * 0.07, z * 0.07, 4, 8) * 4.2 * sstep(0, 12, t) + (fbm(x * 0.35, z * 0.35, 3, 12) - 0.5) * 0.9 * sstep(0, 8, t);
  h += sstep(-100, -150, z) * (30 + 34 * rr);
  const lake = sstep(-6, -17.5, z);                       // upstream of the dam: basin floor
  const floorY = lerp(-0.012 * Math.max(0, z - 4) - 2.5 * sstep(110, 190, z), -5.5, lake);
  h += floorY + (fbm(x * 0.2, z * 0.2, 3, 3) - 0.5) * 0.35 * (1 - lake);
  // river bed + banks downstream of the wheel
  const rx = Math.abs(x - riverX(z)), rz = sstep(-3, 3, z) * (1 - lake);
  const bed = (1 - sstep(2.0, 6.5, rx)) * rz;
  h = lerp(h, Math.min(h, riverY(z) - 0.55 + 0.18 * Math.sin(z * 0.3 + x * 0.2)), bed * 0.95);
  const ds = streamDist(x, z), sb = (1 - sstep(1.4, 4.2, ds)) * (1 - lake) * sstep(-15, -7, z);
  h = lerp(h, Math.min(h, -0.7), sb * 0.95);
  return h;
}
export const STREAM = [[-13.5, -9], [-12.8, -3], [-11.2, 3], [-8, 7.2], [-3, 9.6], [3, 10.8], [6.6, 11.2]];
function streamDist(x, z){
  let best = 1e9;
  for(let i = 0; i < STREAM.length - 1; i++){
    const ax = STREAM[i][0], az = STREAM[i][1], bx = STREAM[i + 1][0], bz = STREAM[i + 1][1], dx = bx - ax, dz = bz - az, t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
    best = Math.min(best, Math.hypot(x - (ax + dx * t), z - (az + dz * t)));
  }
  return best;
}
export { riverX, xc };

export function buildTerrain(T, quality){
  const N = quality === "low" ? 150 : 200, EX = 170, EZ = 215, ZC = -5;
  const g = new PlaneGeometry(2, 2, N, N); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, col = new Float32Array(p.count * 3), uv = g.attributes.uv;
  const warp = t => Math.sign(t) * Math.pow(Math.abs(t), 1.7);
  for(let i = 0; i < p.count; i++){
    const x = warp(p.getX(i)) * EX, z = ZC + warp(p.getZ(i)) * EZ;
    p.setX(i, x); p.setZ(i, z); p.setY(i, heightAt(x, z)); uv.setXY(i, x * 0.045, z * 0.045);
  }
  g.computeVertexNormals();
  const n = g.attributes.normal, C = { rockD:new Color("#45433f"), rockL:new Color("#8c867b"), grassD:new Color("#4d6e30"), grassL:new Color("#7c9a42"), dirt:new Color("#7a6548"), snow:new Color("#f2f6fc"), shore:new Color("#8d8472"), scree:new Color("#7d7468"), sand:new Color("#c4b08c") };
  const tmp = new Color(), tmp2 = new Color();
  for(let i = 0; i < p.count; i++){
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), up = n.getY(i), noise = fbm(x * 0.09, z * 0.09, 3, 5), strata = Math.sin(y * 1.6 + fbm(x * 0.05, z * 0.05, 3, 2) * 7) * 0.5 + 0.5;
    tmp.copy(C.rockD).lerp(C.rockL, clamp(noise * 0.9 + strata * 0.25, 0, 1));
    tmp.lerp(C.scree, sstep(0.45, 0.72, up) * 0.55);
    const gm = sstep(0.66, 0.86, up) * (1 - sstep(16, 30, y)) * sstep(-0.3, 0.3, y);
    tmp2.copy(C.grassD).lerp(C.grassL, fbm(x * 0.18, z * 0.18, 3, 9));
    tmp.lerp(tmp2, gm * 0.95);
    tmp.lerp(C.shore, (1 - sstep(-0.9, -0.1, y)) * 0.9);
    tmp.lerp(C.sand, sstep(92, 128, z) * (1 - sstep(0.4, 2.6, y)) * 0.92);
    tmp.lerp(C.dirt, (1 - sstep(8.2, 9.8, Math.abs(y - WATER_Y))) * 0.5 * (z < -17 ? 1 : 0));
    const snow = sstep(32 + noise * 14, 46 + noise * 12, y) * sstep(0.3, 0.62, up + 0.15);
    tmp.lerp(C.snow, snow);
    const shade = (0.72 + 0.28 * fbm(x * 0.5, z * 0.5, 2, 15)) * (0.78 + 0.22 * sstep(0.2, 0.8, up));
    col[i * 3] = tmp.r * shade; col[i * 3 + 1] = tmp.g * shade; col[i * 3 + 2] = tmp.b * shade;
  }
  g.setAttribute("color", new BufferAttribute(col, 3));
  const mat = new MeshStandardMaterial({ vertexColors:true, roughness:0.98, metalness:0 });
  /* triplanar albedo detail: the rock texture is projected along the dominant axis, so cliffs are not smeared like a planar UV would be */
  mat.onBeforeCompile = sh => {
    sh.uniforms.uDetail = { value:T.rock.map };
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP; varying vec3 vWN;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWP = position; vWN = normal;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWP; varying vec3 vWN; uniform sampler2D uDetail;\nvec3 tri(vec3 p, vec3 n, float s){ vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z); return texture2D(uDetail, p.zy * s).rgb * w.x + texture2D(uDetail, p.xz * s).rgb * w.y + texture2D(uDetail, p.xy * s).rgb * w.z; }")
      .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\n{ vec3 nn2 = normalize(vWN); float h = dot(tri(vWP, nn2, 1.3), vec3(0.34)) * 0.3 + dot(tri(vWP, nn2, 0.42), vec3(0.34)) * 0.4 + dot(tri(vWP, nn2, 0.11), vec3(0.34)) * 0.3; vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition); float dhx = dFdx(h), dhy = dFdy(h); vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx); float det = dot(dpx, r1); vec3 gr = sign(det) * (dhx * r1 + dhy * r2); normal = normalize(abs(det) * normal - 1.15 * gr); }")
      .replace("#include <color_fragment>", "#include <color_fragment>\n{ vec3 nn = normalize(vWN); vec3 d = tri(vWP, nn, 0.42) * 0.38 + tri(vWP, nn, 0.11) * 0.42 + tri(vWP, nn, 0.021) * 0.2; diffuseColor.rgb *= 1.12 + (d.r - 0.5) * 2.1; }");
  };
  const mesh = new Mesh(g, mat); mesh.receiveShadow = true; mesh.name = "terrain";
  return mesh;
}

export function buildForest(count, avoid){
  const R = rng(77), trunk = new CylinderGeometry(0.12, 0.2, 1.4, 5), cones = [];
  const paint = (geo, c) => { const a = new Float32Array(geo.attributes.position.count * 3); for(let i = 0; i < a.length; i += 3){ a[i] = c.r; a[i + 1] = c.g; a[i + 2] = c.b; } geo.setAttribute("color", new BufferAttribute(a, 3)); return geo; };
  trunk.translate(0, 0.7, 0); paint(trunk, new Color("#4a3322")); cones.push(trunk);
  for(let k = 0; k < 3; k++){ const c = new ConeGeometry(1.25 - k * 0.3, 1.9 - k * 0.2, 7); c.translate(0, 1.7 + k * 1.05, 0); paint(c, new Color().setHSL(0.31, 0.4, 0.055 + k * 0.022)); cones.push(c); }
  const geo = mergeGeometries(cones); geo.computeBoundingSphere();
  const mat = new MeshStandardMaterial({ vertexColors:true, roughness:0.95, flatShading:true });
  const items = []; let guard = 0;
  while(items.length < count && guard++ < count * 30){
    const x = (R() - 0.5) * 220, z = -60 + R() * 130, y = heightAt(x, z);
    if(y < 0.6 || y > 26) continue;
    const e = 1.2, sx = (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e), sz = (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e);
    if(Math.hypot(sx, sz) > 0.75) continue;
    if(z > -17 && Math.abs(x - riverX(z)) < 8) continue;
    if(avoid && avoid(x, z)) continue;
    if(y > 8.2 && y < 10.4 && z < -17) continue;
    items.push([x, y, z, 0.8 + R() * 1.5, R() * 6.28, R()]);
  }
  const im = new InstancedMesh(geo, mat, items.length), m = new Matrix4(), o = new Object3D(), col = new Color();
  items.forEach((it, i) => { o.position.set(it[0], it[1] - 0.15, it[2]); o.scale.set(it[3] * (0.85 + it[5] * 0.3), it[3], it[3] * (0.85 + it[5] * 0.3)); o.rotation.y = it[4]; o.updateMatrix(); im.setMatrixAt(i, o.matrix); col.setHSL(0.02 * it[5], 0.0, 0.7 + it[5] * 0.5); im.setColorAt(i, col); });
  im.castShadow = true; im.receiveShadow = false; im.name = "forest"; im.userData.count = items.length;
  return im;
}

/* Lake surface generated FROM the terrain: only the cells that sit over the basin exist, so the shoreline is the real terrain/water intersection. */
export function buildLake(material){
  const x0 = -100, x1 = 100, z0 = -150, z1 = -17.2, S = 2, nx = Math.round((x1 - x0) / S) + 1, nz = Math.round((z1 - z0) / S) + 1;
  const H = new Float32Array(nx * nz); for(let j = 0; j < nz; j++) for(let i = 0; i < nx; i++) H[j * nx + i] = heightAt(x0 + i * S, z0 + j * S);
  const pos = [], uv = [], idx = [], map = new Int32Array(nx * nz).fill(-1);
  const vid = (i, j) => { const k = j * nx + i; if(map[k] < 0){ map[k] = pos.length / 3; pos.push(x0 + i * S, WATER_Y, z0 + j * S); uv.push(x0 + i * S, z0 + j * S); } return map[k]; };
  for(let j = 0; j < nz - 1; j++) for(let i = 0; i < nx - 1; i++){
    const m = Math.min(H[j * nx + i], H[j * nx + i + 1], H[(j + 1) * nx + i], H[(j + 1) * nx + i + 1]);
    const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
    if(m < WATER_Y + 0.8 && !(cx > 3 && cx < 11 && cz > -26 && cz < -17.5)){ const a = vid(i, j), b = vid(i + 1, j), c = vid(i, j + 1), d = vid(i + 1, j + 1); idx.push(a, c, b, b, c, d); }
  }
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  const n = pos.length / 3, nor = new Float32Array(n * 3), tan = new Float32Array(n * 3); for(let i = 0; i < n; i++){ nor[i * 3 + 1] = 1; tan[i * 3] = 1; }
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3)); g.setAttribute("aTan", new Float32BufferAttribute(tan, 3)); g.setAttribute("aFoam", new Float32BufferAttribute(new Float32Array(n), 1)); g.setIndex(idx);
  const m = new Mesh(g, material); m.name = "lake"; m.renderOrder = 1; m.frustumCulled = false; return m;
}

/* Distant ranges: a coarse ring of the same heightfield beyond the detailed valley, so the world has layers of mountains fading into haze. */
export function buildFar(mat, quality){
  const EXX = 170, ZMIN = -220, ZMAX = 210, X0 = -1300, X1 = 1300, Z0 = -1000, Z1 = 700, N = quality === "low" ? 70 : 110, MZ = Math.round(N * 0.7);
  const pos = [], idx = [], col = [], map = new Int32Array((N + 1) * (MZ + 1)).fill(-1);
  const hv = (i, j) => { const x = X0 + (X1 - X0) * i / N, z = Z0 + (Z1 - Z0) * j / MZ, w = (x < -EXX || x > EXX || z < ZMIN || z > ZMAX); return [x, z, w]; };
  const C1 = new Color("#6c6a68"), C2 = new Color("#9a948a"), CS = new Color("#f2f6fc"), CG = new Color("#4a5a38"), t = new Color();
  const vid = (i, j) => { const k = j * (N + 1) + i; if(map[k] < 0){ const [x, z] = hv(i, j), y = heightAt(x, z) - 2; map[k] = pos.length / 3; pos.push(x, y, z); const nz = fbm(x * 0.01, z * 0.01, 3, 3); t.copy(C1).lerp(C2, nz); t.lerp(CG, (1 - sstep(10, 60, y)) * 0.6); t.lerp(CS, sstep(70 + nz * 40, 130 + nz * 40, y)); col.push(t.r, t.g, t.b); } return map[k]; };
  for(let j = 0; j < MZ; j++) for(let i = 0; i < N; i++){
    const a = hv(i, j), b = hv(i + 1, j), c = hv(i, j + 1), d = hv(i + 1, j + 1);
    if(!(a[2] || b[2] || c[2] || d[2])) continue;                       // inside the detailed valley: skip
    const A = vid(i, j), B = vid(i + 1, j), Cc = vid(i, j + 1), D = vid(i + 1, j + 1); idx.push(A, Cc, B, B, Cc, D);
  }
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("color", new Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new Mesh(g, mat.clone()); m.material.polygonOffset = true; m.material.polygonOffsetFactor = 3; m.material.polygonOffsetUnits = 3; m.name = "farRange"; m.frustumCulled = false;
  return m;
}

/* A waterfall that follows the steepest descent from a high point down to the lake, hugging the real terrain. */
export function waterfallPath(x0, z0, yTop){
  const pts = []; let x = x0, z = z0, y = heightAt(x, z);
  for(let k = 0; k < 90 && y > WATER_Y + 0.4; k++){
    const e = 1.5, gx = (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e), gz = (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e), gl = Math.hypot(gx, gz) || 1;
    pts.push([x, y + 0.35, z]); x -= gx / gl * 1.6; z -= gz / gl * 1.6; y = heightAt(x, z);
  }
  pts.push([x, WATER_Y + 0.05, z]); return pts;
}

/* The sea: only the cells whose terrain is below sea level (a true shoreline), foam from shallowness, plus a vast quad to the horizon. */
export function buildSea(material, shoreFoam){
  const x0 = -260, x1 = 260, z0 = 60, z1 = 330, S = 3, nx = Math.round((x1 - x0) / S) + 1, nz = Math.round((z1 - z0) / S) + 1;
  const H = new Float32Array(nx * nz); for(let j = 0; j < nz; j++) for(let i = 0; i < nx; i++) H[j * nx + i] = heightAt(x0 + i * S, z0 + j * S);
  const pos = [], uv = [], fo = [], idx = [], map = new Int32Array(nx * nz).fill(-1);
  const vid = (i, j) => { const k = j * nx + i; if(map[k] < 0){ map[k] = pos.length / 3; pos.push(x0 + i * S, SEA_Y, z0 + j * S); uv.push(x0 + i * S, z0 + j * S); fo.push(clamp(1 - (SEA_Y - H[k]) / 1.6, 0, 1)); } return map[k]; };
  for(let j = 0; j < nz - 1; j++) for(let i = 0; i < nx - 1; i++){
    const m = Math.min(H[j * nx + i], H[j * nx + i + 1], H[(j + 1) * nx + i], H[(j + 1) * nx + i + 1]);
    if(m < SEA_Y + 0.4){ const a = vid(i, j), b = vid(i + 1, j), c = vid(i, j + 1), d = vid(i + 1, j + 1); idx.push(a, c, b, b, c, d); }
  }
  // open ocean to the horizon (a single big quad beyond the detailed grid)
  const bx = pos.length / 3, F = 2600; [[-F, z1 - 1], [F, z1 - 1], [-F, F], [F, F]].forEach(p => { pos.push(p[0], SEA_Y, p[1]); uv.push(p[0], p[1]); fo.push(0); }); idx.push(bx, bx + 2, bx + 1, bx + 1, bx + 2, bx + 3);
  const g = new BufferGeometry(), n = pos.length / 3, nor = new Float32Array(n * 3), tan = new Float32Array(n * 3); for(let i = 0; i < n; i++){ nor[i * 3 + 1] = 1; tan[i * 3] = 1; }
  g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2)); g.setAttribute("normal", new Float32BufferAttribute(nor, 3)); g.setAttribute("aTan", new Float32BufferAttribute(tan, 3)); g.setAttribute("aFoam", new Float32BufferAttribute(new Float32Array(fo), 1)); g.setIndex(idx);
  const m = new Mesh(g, material); m.name = "sea"; m.renderOrder = 1; m.frustumCulled = false; return m;
}
