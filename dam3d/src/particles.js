/* One pooled soft-sprite system (spray / mist / dust). Fixed-size typed arrays, no per-particle allocation; capped by quality; zero when reduced-motion. */
import { Points, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Color, DynamicDrawUsage, AdditiveBlending, NormalBlending } from "three";

export function makeParticles(max, color, opts = {}){
  const g = new BufferGeometry(), pa = new Float32BufferAttribute(max * 3, 3).setUsage(DynamicDrawUsage), sa = new Float32BufferAttribute(max, 1).setUsage(DynamicDrawUsage), aa = new Float32BufferAttribute(max, 1).setUsage(DynamicDrawUsage);
  g.setAttribute("position", pa); g.setAttribute("aSize", sa); g.setAttribute("aAlpha", aa);
  const pos = pa.array, vel = new Float32Array(max * 3), life = new Float32Array(max), age = new Float32Array(max), base = new Float32Array(max), peak = new Float32Array(max);
  for(let i = 0; i < max; i++) pos[i * 3 + 1] = -999;
  const mat = new ShaderMaterial({
    transparent:true, depthWrite:false, blending:NormalBlending,
    uniforms:{ uColor:{ value:new Color(color) }, uScale:{ value:400 } },
    vertexShader:`attribute float aSize; attribute float aAlpha; varying float vA; uniform float uScale; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(aSize * uScale / -mv.z, 1.0, 96.0); vA = aAlpha; }`,
    fragmentShader:`varying float vA; uniform vec3 uColor; void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0; float a = smoothstep(1.0, 0.2, d) * vA; if(a < 0.01) discard; gl_FragColor = vec4(uColor, a); }`
  });
  const pts = new Points(g, mat); pts.frustumCulled = false; pts.renderOrder = 5;
  let cursor = 0, cap = max;
  return {
    points:pts, mat, setCap(n){ cap = Math.min(max, n); },
    emit(x, y, z, vx, vy, vz, lifeS, sz, a){
      if(cap <= 0) return;
      for(let k = 0; k < cap; k++){ const i = (cursor + k) % cap; if(life[i] <= 0){ cursor = (i + 1) % cap; pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; vel[i * 3] = vx; vel[i * 3 + 1] = vy; vel[i * 3 + 2] = vz; life[i] = lifeS; age[i] = 0; base[i] = sz; peak[i] = a; return; } }
    },
    update(dt, gravity = 9, drag = 0.4, grow = 0.8){
      const P = g.attributes.position, S = g.attributes.aSize, A = g.attributes.aAlpha;
      for(let i = 0; i < max; i++){
        if(life[i] <= 0){ if(S.array[i] !== 0){ S.array[i] = 0; A.array[i] = 0; pos[i * 3 + 1] = -999; } continue; }
        age[i] += dt; if(age[i] >= life[i]){ life[i] = 0; S.array[i] = 0; A.array[i] = 0; pos[i * 3 + 1] = -999; continue; }
        const t = age[i] / life[i], dr = Math.max(0, 1 - drag * dt);
        vel[i * 3] *= dr; vel[i * 3 + 2] *= dr; vel[i * 3 + 1] = vel[i * 3 + 1] * dr - gravity * dt;
        pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        S.array[i] = base[i] * (1 + grow * t); A.array[i] = peak[i] * (1 - t) * Math.min(1, t * 14);
      }
      P.needsUpdate = true; S.needsUpdate = true; A.needsUpdate = true;
    },
    clear(){ for(let i = 0; i < max; i++){ life[i] = 0; pos[i * 3 + 1] = -999; } g.attributes.position.needsUpdate = true; },
    dispose(){ g.dispose(); mat.dispose(); }
  };
}
