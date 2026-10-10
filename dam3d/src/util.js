/* small deterministic helpers: seeded RNG, tileable value noise, fbm */
export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(ix, iy, seed){ let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967295; }
/* value noise; per>0 makes it tile with that integer period */
export function vnoise(x, y, seed = 0, per = 0){
  let ix = Math.floor(x), iy = Math.floor(y); const fx = x - ix, fy = y - iy, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  let ix1 = ix + 1, iy1 = iy + 1;
  if(per > 0){ ix = ((ix % per) + per) % per; iy = ((iy % per) + per) % per; ix1 = (ix + 1) % per; iy1 = (iy + 1) % per; }
  const a = hash(ix, iy, seed), b = hash(ix1, iy, seed), c = hash(ix, iy1, seed), d = hash(ix1, iy1, seed);
  return lerp(lerp(a, b, sx), lerp(c, d, sx), sy);
}
export function fbm(x, y, oct = 5, seed = 0, per = 0){
  let s = 0, a = 0.5, f = 1, n = 0;
  for(let i = 0; i < oct; i++){ s += a * vnoise(x * f, y * f, seed + i * 17, per ? per * f : 0); n += a; a *= 0.5; f *= 2; }
  return s / n;
}
export function ridged(x, y, oct = 5, seed = 0){
  let s = 0, a = 0.5, f = 1, n = 0;
  for(let i = 0; i < oct; i++){ const v = 1 - Math.abs(vnoise(x * f, y * f, seed + i * 31) * 2 - 1); s += a * v * v; n += a; a *= 0.5; f *= 2; }
  return s / n;
}
