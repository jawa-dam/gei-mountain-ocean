/* Sky dome + the one sky function shared with the water shader (so reflections match what's overhead), plus a PMREM environment for PBR reflections. */
import { Mesh, SphereGeometry, ShaderMaterial, BackSide, Vector3, Scene, Color, PMREMGenerator } from "three";

export const SUN_DIR = new Vector3(0.52, 0.64, 0.56).normalize();
export const HORIZON = new Color("#f1c3a6"), ZENITH = new Color("#1f3480"), MID = new Color("#8aa6e6"), FOG = new Color("#aebbd6");

export const SKY_GLSL = /* glsl */`
uniform vec3 uSunDir;
vec3 skyColor(vec3 d){
  float h = clamp(d.y, -0.2, 1.0);
  vec3 hor = vec3(0.945, 0.765, 0.651), mid = vec3(0.541, 0.651, 0.902), zen = vec3(0.122, 0.204, 0.502);
  vec3 c = mix(hor, mid, smoothstep(0.0, 0.28, h));
  c = mix(c, zen, smoothstep(0.22, 0.95, h));
  float s = max(dot(d, uSunDir), 0.0);
  c += vec3(1.0, 0.72, 0.42) * (pow(s, 6.0) * 0.28 + pow(s, 48.0) * 0.55);
  c += vec3(1.0, 0.93, 0.8) * smoothstep(0.9993, 0.9998, s) * 2.2;
  return c;
}`;

export function makeSky(){
  const mat = new ShaderMaterial({
    side:BackSide, depthWrite:false, fog:false,
    uniforms:{ uSunDir:{ value:SUN_DIR }, uTime:{ value:0 }, uLin:{ value:0 } },
    vertexShader:`varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }`,
    fragmentShader:`${SKY_GLSL}
      varying vec3 vDir; uniform float uTime, uLin;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
      float fbm(vec2 p){ float s = 0.0, a = 0.5; for(int i = 0; i < 4; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
      void main(){
        vec3 d = normalize(vDir); vec3 c = skyColor(d);
        // high stratocumulus bands, lit warm toward the sun
        vec2 cp = d.xz / max(d.y, 0.05) * 0.55 + vec2(uTime * 0.004, 0.0);
        float cl = smoothstep(0.52, 0.8, fbm(cp * 1.6)) * smoothstep(0.02, 0.22, d.y);
        float lit = pow(max(dot(d, uSunDir), 0.0), 3.0);
        c = mix(c, mix(vec3(0.72, 0.62, 0.74), vec3(1.0, 0.82, 0.66), lit), cl * 0.55);
        if(uLin > 0.5) c = pow(c, vec3(2.2));
        gl_FragColor = vec4(c, 1.0);
      }`
  });
  const m = new Mesh(new SphereGeometry(900, 32, 20), mat); m.frustumCulled = false; m.renderOrder = -10; m.name = "sky";
  return m;
}

/* PBR image-based light from the sky itself (one-off PMREM; the env scene is thrown away after) */
export function makeEnv(renderer, skyMesh){
  const pm = new PMREMGenerator(renderer), s = new Scene(); const clone = skyMesh.clone(); s.add(clone);
  const rt = pm.fromScene(s, 0, 1, 2000); pm.dispose();
  return rt.texture;
}
