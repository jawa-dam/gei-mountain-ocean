/* Procedural PBR texture sets, generated once on a canvas (no network, no image files): albedo + normal (from a height field) + roughness.
   Everything tiles (period-wrapped noise) and is small (256–512 px) — mipmapped, anisotropic. These are real textures, authored by code. */
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, LinearMipmapLinearFilter, LinearFilter } from "three";
import { fbm, vnoise, clamp, lerp, rng } from "./util.js";

function canvasOf(n){ const c = document.createElement("canvas"); c.width = c.height = n; return c; }
function finish(c, srgb, aniso){ const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = aniso; t.generateMipmaps = true; t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter; if(srgb) t.colorSpace = SRGBColorSpace; return t; }

/* fn(u,v,x,y) → [r,g,b,h,rough]  (0..1). Returns {map, normal, rough} */
function make(n, aniso, strength, fn){
  const col = canvasOf(n), nor = canvasOf(n), rgh = canvasOf(n);
  const cx = col.getContext("2d"), nx = nor.getContext("2d"), rx = rgh.getContext("2d");
  const ci = cx.createImageData(n, n), ni = nx.createImageData(n, n), ri = rx.createImageData(n, n);
  const H = new Float32Array(n * n);
  for(let y = 0; y < n; y++) for(let x = 0; x < n; x++){
    const o = fn(x / n, y / n, x, y), i = y * n + x;
    ci.data[i * 4] = clamp(o[0], 0, 1) * 255; ci.data[i * 4 + 1] = clamp(o[1], 0, 1) * 255; ci.data[i * 4 + 2] = clamp(o[2], 0, 1) * 255; ci.data[i * 4 + 3] = 255;
    H[i] = o[3]; const r = clamp(o[4] == null ? 0.85 : o[4], 0, 1) * 255; ri.data[i * 4] = ri.data[i * 4 + 1] = ri.data[i * 4 + 2] = r; ri.data[i * 4 + 3] = 255;
  }
  for(let y = 0; y < n; y++) for(let x = 0; x < n; x++){
    const l = H[y * n + (x + n - 1) % n], r = H[y * n + (x + 1) % n], u = H[((y + n - 1) % n) * n + x], d = H[((y + 1) % n) * n + x];
    let dx = (l - r) * strength, dy = (u - d) * strength, dz = 1, len = Math.hypot(dx, dy, dz); dx /= len; dy /= len; dz /= len;
    const i = (y * n + x) * 4; ni.data[i] = (dx * 0.5 + 0.5) * 255; ni.data[i + 1] = (dy * 0.5 + 0.5) * 255; ni.data[i + 2] = (dz * 0.5 + 0.5) * 255; ni.data[i + 3] = 255;
  }
  cx.putImageData(ci, 0, 0); nx.putImageData(ni, 0, 0); rx.putImageData(ri, 0, 0);
  return { map:finish(col, true, aniso), normal:finish(nor, false, aniso), rough:finish(rgh, false, aniso) };
}

export function makeTextures(aniso = 4, size = 512){
  const T = {};
  /* poured concrete: pitted, stained, with horizontal formwork seams */
  T.concrete = make(size, aniso, 2.2, (u, v) => {
    const big = fbm(u * 6, v * 6, 4, 3, 6), fine = fbm(u * 48, v * 48, 3, 9, 48), pit = vnoise(u * 90, v * 90, 5, 90) > 0.93 ? 1 : 0;
    const seam = Math.abs(((v * 4) % 1) - 0.5) > 0.492 ? 1 : 0, stain = fbm(u * 3, v * 14, 3, 21, 3);
    let g = 0.56 + (big - 0.5) * 0.18 + (fine - 0.5) * 0.12 - pit * 0.12 - seam * 0.16 - Math.max(0, stain - 0.55) * 0.35;
    return [g * 1.0, g * 1.0, g * 0.97, g * 0.7 + fine * 0.3 - pit * 0.5 - seam * 0.6, 0.9 - pit * 0.1];
  });
  /* weathered timber: long grain streaks + plank joints + knots */
  T.wood = make(size, aniso, 2.6, (u, v) => {
    const plank = Math.floor(v * 6), pv = (v * 6) % 1, off = plank * 0.37;
    const grain = fbm((u + off) * 4, v * 90, 4, 41 + plank, 0), ring = Math.sin((grain * 14 + u * 3 + off) * 6.283) * 0.5 + 0.5;
    const joint = pv < 0.035 || pv > 0.965 ? 1 : 0, knot = Math.max(0, 1 - Math.hypot((u + off) % 1 - 0.5, (pv - 0.5) * 0.4) * 8) * (vnoise(plank, 1, 7) > 0.6 ? 1 : 0);
    const t = 0.35 + ring * 0.22 + (grain - 0.5) * 0.25 - joint * 0.28 - knot * 0.2, tint = vnoise(plank, 3, 11);
    return [t * (0.95 + tint * 0.2) * 1.0, t * 0.68, t * 0.42, t * 0.8 - joint * 0.7 - knot * 0.2, 0.78];
  });
  /* dressed stone blocks with mortar */
  T.stone = make(size, aniso, 3.2, (u, v) => {
    const rows = 5, r = Math.floor(v * rows), bu = (u * 3 + (r % 2) * 0.5) % 1, bv = (v * rows) % 1, ri = r + Math.floor(u * 3 + (r % 2) * 0.5);
    const mort = bu < 0.04 || bu > 0.96 || bv < 0.06 || bv > 0.94 ? 1 : 0, tone = 0.45 + vnoise(ri, 9, 5) * 0.25, n = fbm(u * 24, v * 24, 4, 51, 24);
    const g = mort ? 0.3 : tone + (n - 0.5) * 0.22;
    return [g * 1.02, g, g * 0.92, mort ? 0.0 : 0.55 + (n - 0.5) * 0.5, mort ? 0.98 : 0.86];
  });
  /* rough rock / earth detail (greyscale — multiplied by vertex colour) */
  T.rock = make(size, aniso, 4.0, (u, v) => {
    const a = fbm(u * 8, v * 8, 6, 61, 8), b = fbm(u * 3, v * 3, 4, 71, 3), strata = Math.sin((v * 22 + b * 5) * 6.283) * 0.5 + 0.5, chip = fbm(u * 32, v * 32, 3, 83, 32);
    const g = 0.5 + (a - 0.5) * 0.5 + (b - 0.5) * 0.22 + (strata - 0.5) * 0.06 + (chip - 0.5) * 0.12;
    return [g, g, g, a * 0.6 + b * 0.2 + strata * 0.1 + chip * 0.3, 0.92];
  });
  /* brushed dark iron with scratches (used with metalness) */
  T.iron = make(256, aniso, 1.2, (u, v) => {
    const s = vnoise(u * 3, v * 80, 13, 0) * 0.5 + fbm(u * 12, v * 12, 3, 17, 12) * 0.5;
    const g = 0.2 + s * 0.14; return [g, g * 1.02, g * 1.08, s, 0.45 + s * 0.2];
  });
  /* fine tileable noise normal for water + foam masks (RG = two normal-ish octaves, B = foam noise) */
  { const n = 256, c = canvasOf(n), x = c.getContext("2d"), im = x.createImageData(n, n);
    const hh = (a, b) => fbm(a * 4, b * 4, 3, 91, 4) * 0.78 + fbm(a * 16, b * 16, 2, 93, 16) * 0.22;
    for(let j = 0; j < n; j++) for(let i = 0; i < n; i++){
      const u = i / n, v = j / n, e = 1 / n, dx = (hh(u + e, v) - hh(u - e, v)) * 11, dy = (hh(u, v + e) - hh(u, v - e)) * 11;
      const k = (j * n + i) * 4; im.data[k] = clamp(0.5 + dx, 0, 1) * 255; im.data[k + 1] = clamp(0.5 + dy, 0, 1) * 255; im.data[k + 2] = fbm(u * 10, v * 10, 4, 97, 10) * 255; im.data[k + 3] = 255;
    }
    x.putImageData(im, 0, 0); T.water = finish(c, false, aniso);
  }
  /* millstone dress (radial furrows / harps) + stitched leather belt */
  { const n = 256, c = canvasOf(n), x = c.getContext("2d"); x.fillStyle = "#b9b2a4"; x.fillRect(0, 0, n, n);
    const im = x.getImageData(0, 0, n, n); for(let i = 0; i < n * n; i++){ const v = (vnoise((i % n) * 0.25, Math.floor(i / n) * 0.25, 3) - 0.5) * 36; im.data[i * 4] += v; im.data[i * 4 + 1] += v; im.data[i * 4 + 2] += v; } x.putImageData(im, 0, 0);
    x.translate(n / 2, n / 2); x.strokeStyle = "#5e584d"; x.lineWidth = 3;
    for(let q = 0; q < 8; q++){ x.save(); x.rotate(q * Math.PI / 4); for(let k = 0; k < 6; k++){ x.beginPath(); x.moveTo(24, -6 + k * 5); x.lineTo(124, -22 + k * 8); x.stroke(); } x.restore(); }
    x.fillStyle = "#2a2723"; x.beginPath(); x.arc(0, 0, 20, 0, 6.283); x.fill();
    T.millstone = { map:finish(c, true, aniso) }; }
  { const w = 128, h = 128, c = canvasOf(w), x = c.getContext("2d"); x.fillStyle = "#3b2a1e"; x.fillRect(0, 0, w, h);
    const R = rng(9); for(let i = 0; i < 400; i++){ x.fillStyle = "rgba(" + (70 + R() * 40 | 0) + "," + (48 + R() * 25 | 0) + ",30,0.5)"; x.fillRect(R() * w, R() * h, 2 + R() * 6, 1); }
    x.fillStyle = "#c9a36a"; for(let k = 0; k < 8; k++) x.fillRect(k * 16 + 7, 0, 2, h);       // stitch / lacing marks
    T.belt = { map:finish(c, true, aniso) }; }
  return T;
}
