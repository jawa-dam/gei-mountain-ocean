/* Water — the main character. One custom shader (flow-scrolled dual-octave normals, fresnel sky reflection using the SAME sky function as the dome,
   sun glitter, depth tint, flow-driven foam, shore/edge foam, exp2 fog) used for the lake, the flume, the falling jet, the spillway sheet and the river.
   Ribbons are real geometry following the water's path; their speed, width, foam and thickness are driven by the simulated flow every frame. */
import { ShaderMaterial, BufferGeometry, Float32BufferAttribute, Mesh, Vector3, Color, PlaneGeometry, DoubleSide, RepeatWrapping } from "three";
import { SKY_GLSL, SUN_DIR, FOG } from "./sky.js";

export const WATER_MATS = [];
export function makeWaterUniforms(T, fogDensity){
  return { uTime:{ value:0 }, uSunDir:{ value:SUN_DIR }, uTex:{ value:T.water }, uFogColor:{ value:FOG.clone() }, uFogDensity:{ value:fogDensity } };
}

export function waterMaterial(shared, o = {}){
  const m = new ShaderMaterial({
    transparent:o.transparent !== false, depthWrite:!!o.depthWrite, side:DoubleSide, fog:false,
    uniforms:Object.assign({}, shared, {
      uSpeed:{ value:o.speed || 0 }, uAmp:{ value:o.amp == null ? 1 : o.amp }, uScale:{ value:o.scale || 0.22 }, uStretch:{ value:o.stretch || 1 }, uAcross:{ value:o.across || 3.2 },
      uShallow:{ value:new Color(o.shallow || "#4fb6c4") }, uDeep:{ value:new Color(o.deep || "#0f4a78") }, uOpacity:{ value:o.opacity == null ? 0.9 : o.opacity },
      uFoam:{ value:o.foam == null ? 1 : o.foam }, uEdgeFoam:{ value:o.edgeFoam == null ? 0.6 : o.edgeFoam }, uFlow:{ value:o.flow == null ? 1 : o.flow }, uClear:{ value:o.clear == null ? 0.5 : o.clear }, uWhite:{ value:o.white || 0 }, uEnv:{ value:null }, uEnvAmt:{ value:0 }
    }),
    vertexShader:`
      attribute vec3 aTan; attribute float aFoam;
      varying vec3 vW, vN, vT; varying vec2 vUv; varying float vFoam;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vT = normalize(mat3(modelMatrix) * aTan); vUv = uv; vFoam = aFoam; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader:`${SKY_GLSL}
      uniform float uTime, uSpeed, uAmp, uScale, uStretch, uAcross, uOpacity, uFoam, uEdgeFoam, uFlow, uClear, uWhite, uFogDensity; uniform sampler2D uTex;
      uniform samplerCube uEnv; uniform float uEnvAmt; uniform vec3 uShallow, uDeep, uFogColor; varying vec3 vW, vN, vT; varying vec2 vUv; varying float vFoam;
      void main(){
        vec3 N = normalize(vN), T = normalize(vT - N * dot(vN, vT)), B = cross(N, T);
        float s = uSpeed * uTime;
        vec2 p1 = vec2(vUv.x * uScale * uStretch - s * 0.55, vUv.y * uAcross);
        vec2 p2 = vec2(vUv.x * uScale * 2.3 * uStretch - s * 0.9 + 0.37, vUv.y * uAcross * 1.8 + 0.2);
        vec4 a = texture2D(uTex, p1), b = texture2D(uTex, p2);
        float dist = length(cameraPosition - vW); vec2 g = ((a.xy - 0.5) * 1.0 + (b.xy - 0.5) * 0.45) * (0.5 + 0.8 * uFlow) * uAmp / (1.0 + dist * 0.035);
        vec3 n = normalize(N + T * g.x * 1.1 + B * g.y * 1.1);
        vec3 V = normalize(cameraPosition - vW);
        float ndv = clamp(dot(n, V), 0.0, 1.0);
        float fres = 0.03 + 0.97 * pow(1.0 - ndv, 4.0);
        vec3 R = reflect(-V, n); R.y = abs(R.y) * 0.85 + 0.04;
        vec3 sky = skyColor(R);
        if(uEnvAmt > 0.5){ vec3 e = textureCube(uEnv, R).rgb; e = clamp((e * (2.51 * e + 0.03)) / (e * (2.43 * e + 0.59) + 0.14), 0.0, 1.0); sky = mix(sky, pow(e, vec3(1.0 / 2.2)), 0.92); }
        float edge = min(vUv.y, 1.0 - vUv.y) * 2.0;
        float depth = clamp(uClear + (1.0 - uClear) * smoothstep(0.0, 0.5, edge), 0.0, 1.0);
        vec3 body = mix(uShallow, uDeep, depth) * (0.94 + 0.12 * a.z);
        vec3 col = mix(body, sky, clamp(fres * 1.15, 0.0, 1.0));
        vec3 L = normalize(uSunDir); vec3 H = normalize(L + V);
        float glint = pow(max(dot(n, H), 0.0), 140.0) * 1.2 + pow(max(dot(n, H), 0.0), 30.0) * 0.1;
        col += vec3(1.0, 0.86, 0.66) * glint;
        // foam: noise threshold boosted by flow, per-vertex turbulence and the banks
        float fn = texture2D(uTex, vec2(vUv.x * uScale * 1.3 * uStretch - s * 0.75, vUv.y * uAcross * 1.5)).z * 0.6 + b.z * 0.4;
        float foam = smoothstep(0.55, 0.78, fn + vFoam * 0.5 - 0.1) * clamp(vFoam * uFoam, 0.0, 1.0);
        foam += smoothstep(0.78, 1.0, 1.0 - edge) * uEdgeFoam * (0.4 + 0.6 * fn) * (0.35 + 0.65 * uFlow);
        foam = clamp(foam + uWhite * (0.55 + 0.45 * fn), 0.0, 1.0);
        col = mix(col, vec3(0.95, 0.98, 1.0) * (0.78 + 0.22 * ndv), foam * 0.9);
        float alpha = clamp(uOpacity * (0.6 + 0.4 * depth) + fres * 0.3 + foam * 0.4, 0.0, 1.0);
        float d = length(cameraPosition - vW); float f = 1.0 - exp(-pow(d * uFogDensity, 2.0));
        col = mix(col, uFogColor, clamp(f, 0.0, 1.0));
        gl_FragColor = vec4(col, alpha);
      }`
  });
  WATER_MATS.push(m); return m;
}

/* Ribbon along a polyline: pts = [Vector3…]; width = number | fn(i,t)→metres; foam = fn(i,t)→0..1. side: fixed across-vector (default: horizontal ⟂ path). */
export function ribbonGeometry(pts, width, foam, side){
  const n = pts.length, pos = new Float32Array(n * 6), nor = new Float32Array(n * 6), tan = new Float32Array(n * 6), uv = new Float32Array(n * 4), fo = new Float32Array(n * 2), idx = [];
  let len = 0; const t = new Vector3(), s = new Vector3(), nn = new Vector3(), up = new Vector3(0, 1, 0);
  for(let i = 0; i < n; i++){
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)]; t.copy(b).sub(a).normalize();
    if(i > 0) len += pts[i].distanceTo(pts[i - 1]);
    if(side) s.copy(side); else s.crossVectors(up, t).normalize();
    nn.crossVectors(t, s).normalize(); if(nn.y < 0 && !side) nn.negate();
    const w = (typeof width === "function" ? width(i, i / (n - 1)) : width) / 2, f = foam ? foam(i, i / (n - 1)) : 0;
    for(let k = 0; k < 2; k++){
      const sg = k ? 1 : -1, o = (i * 2 + k) * 3;
      pos[o] = pts[i].x + s.x * w * sg; pos[o + 1] = pts[i].y + s.y * w * sg; pos[o + 2] = pts[i].z + s.z * w * sg;
      nor[o] = nn.x; nor[o + 1] = nn.y; nor[o + 2] = nn.z; tan[o] = t.x; tan[o + 1] = t.y; tan[o + 2] = t.z;
      uv[(i * 2 + k) * 2] = len; uv[(i * 2 + k) * 2 + 1] = k; fo[i * 2 + k] = f;
    }
    if(i < n - 1){ const q = i * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
  }
  const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  g.setAttribute("aTan", new Float32BufferAttribute(tan, 3)); g.setAttribute("uv", new Float32BufferAttribute(uv, 2)); g.setAttribute("aFoam", new Float32BufferAttribute(fo, 1)); g.setIndex(idx);
  g.userData.n = n; return g;
}

export function lakeMaterial(shared){
  return waterMaterial(shared, { speed:0.05, amp:0.45, scale:0.1, across:0.1, deep:"#0c3c66", shallow:"#2f7f95", opacity:1, clear:1, edgeFoam:0, transparent:false, depthWrite:true });
}
