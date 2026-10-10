import { WebGLCubeRenderTarget, CubeCamera, HalfFloatType, LinearMipmapLinearFilter, WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, HemisphereLight, FogExp2, ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap, Vector3, Mesh, Color } from "three";
import { makeTextures } from "./tex.js";
import { makeSky, makeEnv, SUN_DIR, FOG } from "./sky.js";
import { buildTerrain, buildForest, buildLake, buildFar } from "./terrain.js";
import { makeWaterUniforms, lakeMaterial, WATER_MATS } from "./water.js";
import { buildArchitecture, buildProps } from "./structures.js";

export function tier(){
  try{ const n = navigator, mem = n.deviceMemory || 4, cores = n.hardwareConcurrency || 4; if(mem <= 2 || cores <= 4) return "low"; if(mem >= 8 && cores >= 8) return "high"; }catch(e){}
  return "medium";
}

export function createWorld(canvas, opts = {}){
  const q = opts.quality || tier();
  const renderer = new WebGLRenderer({ canvas, antialias:q !== "low", alpha:false, powerPreference:"high-performance", preserveDrawingBuffer:!!opts.preserve });
  const lost = [];
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); lost.forEach(f => f()); });
  renderer.outputColorSpace = SRGBColorSpace; renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = q !== "low"; renderer.shadowMap.type = PCFSoftShadowMap;
  const scene = new Scene(), fogD = 0.0030; scene.fog = new FogExp2(FOG.getHex(), fogD); scene.background = FOG.clone();
  const T = makeTextures(q === "low" ? 2 : 4, q === "low" ? 256 : 512);
  const sky = makeSky(); scene.add(sky);
  scene.environment = makeEnv(renderer, sky); scene.environmentIntensity = 0.55;
  const sun = new DirectionalLight(0xffd6a8, 3.1); sun.position.copy(SUN_DIR).multiplyScalar(90).add(new Vector3(4, 3, -4)); sun.target.position.set(4, 3, -4); scene.add(sun, sun.target);
  if(renderer.shadowMap.enabled){ const sz = q === "high" ? 2048 : 1024; sun.castShadow = true; sun.shadow.mapSize.set(sz, sz); const c = sun.shadow.camera; c.left = -30; c.right = 30; c.top = 26; c.bottom = -26; c.near = 20; c.far = 200; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04; }
  scene.add(new HemisphereLight(0x9bb4e8, 0x4a4034, 0.85));
  const camera = new PerspectiveCamera(52, 1, 0.5, 1800);
  const shared = makeWaterUniforms(T, fogD);
  const world = { renderer, scene, camera, sun, T, shared, q, sky, lost };
  const terrain = buildTerrain(T, q); scene.add(terrain); world.terrain = terrain; scene.add(buildFar(terrain.material, q));
  const lake = buildLake(lakeMaterial(shared)); scene.add(lake); world.lake = lake;
  world.forest = buildForest(q === "low" ? 260 : q === "high" ? 700 : 480); scene.add(world.forest);
  const arch = buildArchitecture(T, opts.tier || 0, q); scene.add(arch.root); world.arch = arch; scene.add(buildProps(arch.M));
  return world;
}

export function resize(world, w, h, dpr){
  const r = world.renderer; r.setPixelRatio(dpr); r.setSize(w, h, false);
  world.camera.aspect = w / h; world.camera.updateProjectionMatrix();
}


/* One-off reflection capture: the finished (dry) world is rendered into two small cube maps; the water shader then reflects the REAL mountains, trees and dam
   instead of just a sky gradient. Water, particles and anything in `hide` are excluded from the capture. */
export function bakeReflections(world, hide){
  const { renderer, scene, q, sky } = world, size = q === "low" ? 128 : 256;
  const was = hide.map(o => o.visible); hide.forEach(o => o.visible = false); world.lake.visible = false;
  sky.material.uniforms.uLin.value = 1;
  const mk = (x, y, z) => { const rt = new WebGLCubeRenderTarget(size, { type:HalfFloatType, generateMipmaps:true, minFilter:LinearMipmapLinearFilter }), c = new CubeCamera(1, 3000, rt); c.position.set(x, y, z); scene.add(c); c.update(renderer, scene); scene.remove(c); return rt; };
  const lakeRT = mk(0, 13, -34), riverRT = mk(6, 4, 6);
  sky.material.uniforms.uLin.value = 0; world.lake.visible = true; hide.forEach((o, i) => o.visible = was[i]);
  WATER_MATS.forEach(m => { m.uniforms.uEnv.value = (m === world.lake.material ? lakeRT : riverRT).texture; m.uniforms.uEnvAmt.value = 1; });
  world.reflections = [lakeRT, riverRT];
}
