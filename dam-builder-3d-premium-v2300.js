/* V2.3.0 — Premium 3D Enhancement Module
   Adds procedural PBR textures, enhanced lighting, improved water,
   and post-processing to the base 3D scene.
   Hooks into the existing scene via DamBuilder3D without modifying the minified bundle.
   All enhancements are procedural — no external assets. MIT-compatible. */
(function () {
  "use strict";

  var T = window.__THREE_R186;
  if (!T) return;

  var PREMIUM_VERSION = "V2.3.0";
  var applied = false;

  // ── Procedural Texture Generators ──────────────────────────────────

  function noiseCanvas(w, h, fn) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var ctx = c.getContext("2d");
    var img = ctx.createImageData(w, h);
    fn(img.data, w, h);
    ctx.putImageData(img, 0, 0);
    return c;
  }

  // simple value noise for texture generation
  function valNoise(x, y, seed) {
    var n = Math.sin(x * 127.1 + y * 311.7 + seed * 43758.5453) * 43758.5453;
    return n - Math.floor(n);
  }

  function fbm(x, y, seed, octaves) {
    var v = 0, amp = 0.5, freq = 1;
    for (var i = 0; i < octaves; i++) {
      v += amp * valNoise(x * freq, y * freq, seed + i * 17);
      amp *= 0.5; freq *= 2;
    }
    return v;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function texSize(tier) {
    if (tier === "high") return 1024;
    if (tier === "medium") return 512;
    return 256;
  }

  // ── Stone / Concrete Texture (dam, channels) ──────────────────────

  function genStoneAlbedo(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var base = fbm(nx * 8, ny * 8, 1, 5);
        var crack = Math.abs(fbm(nx * 16, ny * 16, 7, 3) - 0.5) * 2;
        crack = Math.pow(crack, 3);
        var moss = clamp01(fbm(nx * 4, ny * 6, 13, 3) - 0.45) * 2;
        var r = lerp(140, 165, base) - crack * 40;
        var g = lerp(135, 155, base) - crack * 35 + moss * 30;
        var b = lerp(125, 145, base) - crack * 30 + moss * 10;
        r += (valNoise(x * 0.5, y * 0.5, 3) - 0.5) * 15;
        g += (valNoise(x * 0.5, y * 0.5, 4) - 0.5) * 15;
        b += (valNoise(x * 0.5, y * 0.5, 5) - 0.5) * 12;
        var i = (y * w + x) * 4;
        d[i] = clamp01(r / 255) * 255;
        d[i + 1] = clamp01(g / 255) * 255;
        d[i + 2] = clamp01(b / 255) * 255;
        d[i + 3] = 255;
      }
    });
  }

  function genStoneNormal(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var s = 0.8;
        var hL = fbm((nx - 1 / w) * 8, ny * 8, 1, 5);
        var hR = fbm((nx + 1 / w) * 8, ny * 8, 1, 5);
        var hU = fbm(nx * 8, (ny - 1 / h) * 8, 1, 5);
        var hD = fbm(nx * 8, (ny + 1 / h) * 8, 1, 5);
        var dx = (hL - hR) * s, dy = (hU - hD) * s;
        var i = (y * w + x) * 4;
        d[i] = clamp01(dx * 0.5 + 0.5) * 255;
        d[i + 1] = clamp01(dy * 0.5 + 0.5) * 255;
        d[i + 2] = 255;
        d[i + 3] = 255;
      }
    });
  }

  function genStoneRoughness(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var v = 0.7 + fbm(nx * 12, ny * 12, 9, 4) * 0.25;
        v -= Math.pow(Math.abs(fbm(nx * 16, ny * 16, 7, 3) - 0.5) * 2, 3) * 0.2;
        var g = clamp01(v) * 255;
        var i = (y * w + x) * 4;
        d[i] = g; d[i + 1] = g; d[i + 2] = g; d[i + 3] = 255;
      }
    });
  }

  // ── Wood Grain Texture (waterwheel, mill) ─────────────────────────

  function genWoodAlbedo(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var ring = Math.sin((nx * 20 + fbm(nx * 4, ny * 4, 20, 3) * 3) * Math.PI * 2) * 0.5 + 0.5;
        var grain = fbm(nx * 2, ny * 40, 21, 4);
        var knot = clamp01(1 - Math.sqrt(Math.pow(nx - 0.3, 2) + Math.pow((ny * 2) % 1 - 0.5, 2)) * 6);
        knot = Math.pow(knot, 3);
        var v = ring * 0.4 + grain * 0.4 + 0.2;
        var r = lerp(110, 160, v) + knot * 20;
        var g = lerp(70, 110, v) + knot * 10;
        var b = lerp(40, 65, v) + knot * 5;
        r += (valNoise(x * 0.3, y * 0.3, 22) - 0.5) * 12;
        g += (valNoise(x * 0.3, y * 0.3, 23) - 0.5) * 8;
        var i = (y * w + x) * 4;
        d[i] = clamp01(r / 255) * 255;
        d[i + 1] = clamp01(g / 255) * 255;
        d[i + 2] = clamp01(b / 255) * 255;
        d[i + 3] = 255;
      }
    });
  }

  function genWoodNormal(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var s = 1.2;
        var grainL = fbm((nx - 1 / w) * 2, ny * 40, 21, 4);
        var grainR = fbm((nx + 1 / w) * 2, ny * 40, 21, 4);
        var grainU = fbm(nx * 2, (ny - 1 / h) * 40, 21, 4);
        var grainD = fbm(nx * 2, (ny + 1 / h) * 40, 21, 4);
        var dx = (grainL - grainR) * s, dy = (grainU - grainD) * s;
        var i = (y * w + x) * 4;
        d[i] = clamp01(dx * 0.5 + 0.5) * 255;
        d[i + 1] = clamp01(dy * 0.5 + 0.5) * 255;
        d[i + 2] = 255;
        d[i + 3] = 255;
      }
    });
  }

  // ── Grass / Terrain Texture ───────────────────────────────────────

  function genGrassAlbedo(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var base = fbm(nx * 10, ny * 10, 30, 5);
        var blade = Math.sin((nx * 60 + valNoise(nx, ny, 31) * 4) * Math.PI) * 0.5 + 0.5;
        blade *= fbm(nx * 20, ny * 20, 32, 2);
        var v = base * 0.6 + blade * 0.3 + 0.1;
        var r = lerp(50, 90, v);
        var g = lerp(100, 170, v);
        var b = lerp(35, 60, v);
        r += (valNoise(x * 0.7, y * 0.7, 33) - 0.5) * 15;
        g += (valNoise(x * 0.7, y * 0.7, 34) - 0.5) * 20;
        b += (valNoise(x * 0.7, y * 0.7, 35) - 0.5) * 10;
        var i = (y * w + x) * 4;
        d[i] = clamp01(r / 255) * 255;
        d[i + 1] = clamp01(g / 255) * 255;
        d[i + 2] = clamp01(b / 255) * 255;
        d[i + 3] = 255;
      }
    });
  }

  function genGrassNormal(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var s = 0.6;
        var hL = fbm((nx - 1 / w) * 10, ny * 10, 30, 5);
        var hR = fbm((nx + 1 / w) * 10, ny * 10, 30, 5);
        var hU = fbm(nx * 10, (ny - 1 / h) * 10, 30, 5);
        var hD = fbm(nx * 10, (ny + 1 / h) * 10, 30, 5);
        var dx = (hL - hR) * s, dy = (hU - hD) * s;
        var i = (y * w + x) * 4;
        d[i] = clamp01(dx * 0.5 + 0.5) * 255;
        d[i + 1] = clamp01(dy * 0.5 + 0.5) * 255;
        d[i + 2] = 255;
        d[i + 3] = 255;
      }
    });
  }

  // ── Metal / Iron Texture (gears, axle, bands) ────────────────────

  function genMetalAlbedo(sz) {
    return noiseCanvas(sz, sz, function (d, w, h) {
      for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
        var nx = x / w, ny = y / h;
        var base = 0.45 + fbm(nx * 15, ny * 15, 40, 4) * 0.15;
        var scratch = Math.pow(clamp01(fbm(nx * 30, ny * 3, 41, 2) - 0.4) * 3, 2) * 0.15;
        var rust = clamp01(fbm(nx * 6, ny * 6, 42, 4) - 0.55) * 2;
        var v = base + scratch;
        var r = lerp(90, 120, v) + rust * 50;
        var g = lerp(88, 115, v) + rust * 15;
        var b = lerp(85, 110, v) - rust * 10;
        var i = (y * w + x) * 4;
        d[i] = clamp01(r / 255) * 255;
        d[i + 1] = clamp01(g / 255) * 255;
        d[i + 2] = clamp01(b / 255) * 255;
        d[i + 3] = 255;
      }
    });
  }

  // ── Texture Factory ───────────────────────────────────────────────

  function makeTex(canvas) {
    var tex = new T.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = 1000; // RepeatWrapping
    tex.anisotropy = 4;
    return tex;
  }

  var texCache = {};
  function getTextures(tier) {
    if (texCache[tier]) return texCache[tier];
    var sz = texSize(tier);
    texCache[tier] = {
      stoneAlbedo: makeTex(genStoneAlbedo(sz)),
      stoneNormal: makeTex(genStoneNormal(sz)),
      stoneRoughness: makeTex(genStoneRoughness(sz)),
      woodAlbedo: makeTex(genWoodAlbedo(sz)),
      woodNormal: makeTex(genWoodNormal(sz)),
      grassAlbedo: makeTex(genGrassAlbedo(sz)),
      grassNormal: makeTex(genGrassNormal(sz)),
      metalAlbedo: makeTex(genMetalAlbedo(sz))
    };
    return texCache[tier];
  }

  // ── Material Classification ───────────────────────────────────────
  // Identify what each mesh represents by its material color and geometry

  function colorKey(c) {
    if (!c || !c.getHex) return "";
    return c.getHex().toString(16).padStart(6, "0");
  }

  function classifyMaterial(mat, mesh) {
    if (!mat || !mat.isMeshStandardMaterial) return null;
    var hex = colorKey(mat.color);
    var name = (mesh && mesh.name) || "";
    var r = mat.color.r, g = mat.color.g, b = mat.color.b;

    // browns/tans → wood (waterwheel, mill timbers)
    if (r > 0.35 && g > 0.15 && g < 0.55 && b < 0.3 && r > g) return "wood";
    // dark brown → wet wood
    if (r > 0.2 && r < 0.4 && g > 0.1 && g < 0.3 && b < 0.15) return "wood";
    // greys → stone/concrete (dam, channels)
    if (Math.abs(r - g) < 0.08 && Math.abs(g - b) < 0.08 && r > 0.3 && r < 0.75) return "stone";
    // dark greys → metal (gears, axle)
    if (Math.abs(r - g) < 0.06 && Math.abs(g - b) < 0.06 && r >= 0.15 && r < 0.35) return "metal";
    // greens → grass/terrain
    if (g > r && g > b && g > 0.2) return "grass";
    // very dark → iron/metal
    if (r < 0.15 && g < 0.15 && b < 0.15 && r > 0.02) return "metal";

    return null;
  }

  // ── Apply Premium Textures ────────────────────────────────────────

  function applyTextures(scene, tier) {
    var tex = getTextures(tier);
    var upgraded = 0;

    scene.traverse(function (obj) {
      if (!obj.isMesh) return;
      var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(function (mat) {
        if (!mat || !mat.isMeshStandardMaterial) return;
        if (mat.userData && mat.userData._premium) return;
        var cls = classifyMaterial(mat, obj);
        if (!cls) return;

        mat.userData = mat.userData || {};
        mat.userData._premium = cls;
        mat.userData._origColor = mat.color.getHex();

        if (cls === "stone") {
          mat.map = tex.stoneAlbedo;
          mat.normalMap = tex.stoneNormal;
          mat.normalScale = new T.Vector2(0.6, 0.6);
          mat.roughnessMap = tex.stoneRoughness;
          mat.roughness = 0.85;
          mat.metalness = 0.02;
        } else if (cls === "wood") {
          mat.map = tex.woodAlbedo;
          mat.normalMap = tex.woodNormal;
          mat.normalScale = new T.Vector2(0.8, 0.8);
          mat.roughness = 0.75;
          mat.metalness = 0.0;
        } else if (cls === "grass") {
          mat.map = tex.grassAlbedo;
          mat.normalMap = tex.grassNormal;
          mat.normalScale = new T.Vector2(0.4, 0.4);
          mat.roughness = 0.9;
          mat.metalness = 0.0;
        } else if (cls === "metal") {
          mat.map = tex.metalAlbedo;
          mat.roughness = 0.45;
          mat.metalness = 0.7;
          mat.envMapIntensity = 1.5;
        }

        mat.needsUpdate = true;
        upgraded++;
      });
    });
    return upgraded;
  }

  // ── Enhanced Lighting ─────────────────────────────────────────────

  function enhanceLighting(scene, sun) {
    // warm fill light from opposite side of sun
    var fill = new T.PointLight(0xFFE4B5, 0.6, 200, 1.5);
    fill.position.set(-30, 25, -20);
    fill.name = "_premFill";
    scene.add(fill);

    // cool rim light from behind/below for depth
    var rim = new T.PointLight(0x8CB4D6, 0.4, 250, 1.8);
    rim.position.set(15, 8, -60);
    rim.name = "_premRim";
    scene.add(rim);

    // warm accent on the waterwheel area
    var wheelLight = new T.PointLight(0xFFD090, 0.5, 40, 1.6);
    wheelLight.position.set(-5, 12, 5);
    wheelLight.name = "_premWheel";
    scene.add(wheelLight);

    // boost sun shadow quality
    if (sun && sun.shadow) {
      if (sun.shadow.mapSize) {
        sun.shadow.mapSize.set(2048, 2048);
      }
      sun.shadow.bias = -0.0005;
      if (sun.shadow.map) {
        sun.shadow.map.dispose();
        sun.shadow.map = null;
      }
    }

    // slightly increase sun intensity for more dramatic lighting
    if (sun) {
      sun.intensity = Math.min(sun.intensity * 1.05, 3.5);
    }
  }

  // ── Water Shader Enhancement ──────────────────────────────────────

  function enhanceWater(scene) {
    scene.traverse(function (obj) {
      if (!obj.isMesh || !obj.material) return;
      var mat = obj.material;
      if (!mat.isShaderMaterial) return;
      if (!mat.uniforms || !mat.uniforms.uDeep) return;
      if (mat.userData && mat.userData._premWater) return;

      mat.userData = mat.userData || {};
      mat.userData._premWater = true;

      // deepen water colors for more visual richness
      if (mat.uniforms.uDeep && mat.uniforms.uDeep.value) {
        var deep = mat.uniforms.uDeep.value;
        if (deep.isColor) {
          deep.setHex(0x062D4F);
        }
      }
      if (mat.uniforms.uShallow && mat.uniforms.uShallow.value) {
        var shallow = mat.uniforms.uShallow.value;
        if (shallow.isColor) {
          shallow.setHex(0x1A7A8E);
        }
      }

      // increase wave amplitude for more visible surface variation
      if (mat.uniforms.uAmp) {
        mat.uniforms.uAmp.value = Math.min(mat.uniforms.uAmp.value * 1.4, 1.2);
      }

      // boost foam if present
      if (mat.uniforms.uFoam) {
        mat.uniforms.uFoam.value = Math.min((mat.uniforms.uFoam.value || 0) + 0.3, 2.0);
      }

      mat.needsUpdate = true;
    });
  }

  // ── Atmospheric Enhancements ──────────────────────────────────────

  function enhanceAtmosphere(scene) {
    // richer fog color
    if (scene.fog && scene.fog.color) {
      scene.fog.color.setHex(0xC8D8E8);
      scene.fog.density = Math.max(scene.fog.density * 0.85, 0.001);
    }
  }

  // ── Post-Processing (lightweight bloom via renderer patch) ────────
  // Instead of a full EffectComposer, we use a selective glow overlay
  // rendered to an offscreen target and composited via a fullscreen quad.

  function setupBloom(renderer, scene, camera, tier) {
    if (tier === "low") return null;

    var sz = renderer.getSize(new T.Vector2());
    var scale = tier === "high" ? 0.5 : 0.25;
    var bw = Math.floor(sz.x * scale), bh = Math.floor(sz.y * scale);
    if (bw < 64 || bh < 64) return null;

    var bloomRT = new T.WebGLRenderTarget(bw, bh);
    bloomRT.texture.generateMipmaps = true;

    var fsQuadVert = [
      "varying vec2 vUv;",
      "void main() {",
      "  vUv = uv;",
      "  gl_Position = vec4(position.xy, 0.0, 1.0);",
      "}"
    ].join("\n");

    // threshold material — extracts bright regions
    var threshMat = new T.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uThreshold: { value: 0.75 }
      },
      vertexShader: fsQuadVert,
      fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform float uThreshold;",
        "varying vec2 vUv;",
        "void main() {",
        "  vec4 c = texture2D(tDiffuse, vUv);",
        "  float bright = max(c.r, max(c.g, c.b));",
        "  gl_FragColor = bright > uThreshold ? c * (bright - uThreshold) * 2.0 : vec4(0.0);",
        "}"
      ].join("\n"),
      depthTest: false, depthWrite: false
    });

    // blur material — simple Gaussian-like blur
    var blurMat = new T.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uDir: { value: new T.Vector2(1, 0) },
        uRes: { value: new T.Vector2(bw, bh) }
      },
      vertexShader: fsQuadVert,
      fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform vec2 uDir;",
        "uniform vec2 uRes;",
        "varying vec2 vUv;",
        "void main() {",
        "  vec2 px = uDir / uRes;",
        "  vec4 c = texture2D(tDiffuse, vUv) * 0.2270270270;",
        "  c += texture2D(tDiffuse, vUv + px * 1.3846153846) * 0.3162162162;",
        "  c += texture2D(tDiffuse, vUv - px * 1.3846153846) * 0.3162162162;",
        "  c += texture2D(tDiffuse, vUv + px * 3.2307692308) * 0.0702702703;",
        "  c += texture2D(tDiffuse, vUv - px * 3.2307692308) * 0.0702702703;",
        "  gl_FragColor = c;",
        "}"
      ].join("\n"),
      depthTest: false, depthWrite: false
    });

    // composite material — blends bloom with the scene
    var compMat = new T.ShaderMaterial({
      uniforms: {
        tScene: { value: null },
        tBloom: { value: null },
        uStrength: { value: 0.3 }
      },
      vertexShader: fsQuadVert,
      fragmentShader: [
        "uniform sampler2D tScene;",
        "uniform sampler2D tBloom;",
        "uniform float uStrength;",
        "varying vec2 vUv;",
        "void main() {",
        "  vec4 scene = texture2D(tScene, vUv);",
        "  vec4 bloom = texture2D(tBloom, vUv);",
        "  gl_FragColor = scene + bloom * uStrength;",
        "}"
      ].join("\n"),
      depthTest: false, depthWrite: false,
      transparent: false
    });

    // fullscreen quad geometry
    var quadGeo = new T.BufferGeometry();
    var verts = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    var uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
    quadGeo.setAttribute("position", new T.Float32BufferAttribute(verts, 3));
    quadGeo.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
    var quadMesh = new T.Mesh(quadGeo, threshMat);
    quadMesh.frustumCulled = false;
    var quadScene = new T.Scene();
    quadScene.add(quadMesh);
    var quadCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    var sceneRT = new T.WebGLRenderTarget(sz.x, sz.y);
    var blurRT = new T.WebGLRenderTarget(bw, bh);

    return {
      render: function (origRender) {
        // 1. render scene to offscreen target
        renderer.setRenderTarget(sceneRT);
        origRender();
        var ri = renderer.info.render;
        var savedFrame = ri.frame, savedTris = ri.triangles, savedCalls = ri.calls, savedPoints = ri.points, savedLines = ri.lines;

        // 2–5: bloom passes (save/restore render info so these don't count as scene renders)
        threshMat.uniforms.tDiffuse.value = sceneRT.texture;
        quadMesh.material = threshMat;
        renderer.setRenderTarget(bloomRT);
        renderer.render(quadScene, quadCam);

        blurMat.uniforms.tDiffuse.value = bloomRT.texture;
        blurMat.uniforms.uDir.value.set(1, 0);
        quadMesh.material = blurMat;
        renderer.setRenderTarget(blurRT);
        renderer.render(quadScene, quadCam);

        blurMat.uniforms.tDiffuse.value = blurRT.texture;
        blurMat.uniforms.uDir.value.set(0, 1);
        renderer.setRenderTarget(bloomRT);
        renderer.render(quadScene, quadCam);

        compMat.uniforms.tScene.value = sceneRT.texture;
        compMat.uniforms.tBloom.value = bloomRT.texture;
        quadMesh.material = compMat;
        renderer.setRenderTarget(null);
        renderer.render(quadScene, quadCam);
        ri.frame = savedFrame; ri.triangles = savedTris; ri.calls = savedCalls; ri.points = savedPoints; ri.lines = savedLines;
      },
      resize: function (w, h) {
        sceneRT.setSize(w, h);
        var bw2 = Math.floor(w * scale), bh2 = Math.floor(h * scale);
        bloomRT.setSize(bw2, bh2);
        blurRT.setSize(bw2, bh2);
        blurMat.uniforms.uRes.value.set(bw2, bh2);
      },
      dispose: function () {
        bloomRT.dispose(); blurRT.dispose(); sceneRT.dispose();
        threshMat.dispose(); blurMat.dispose(); compMat.dispose();
        quadGeo.dispose();
      }
    };
  }

  // ── Main Enhancement Hook ─────────────────────────────────────────

  function enhance(stage) {
    if (applied) return;
    applied = true;

    var scene = stage.scene;
    var renderer = stage.renderer;
    var camera = stage.camera;
    var sun = stage.sun;
    var tier = stage.tierN >= 2 ? "high" : stage.tierN >= 1 ? "medium" : "low";

    // 1. Apply procedural PBR textures
    var count = applyTextures(scene, tier);

    // 2. Enhance lighting
    enhanceLighting(scene, sun);

    // 3. Improve water shader
    enhanceWater(scene);

    // 4. Atmospheric effects
    enhanceAtmosphere(scene);

    // 5. Set up bloom post-processing (patches the render loop)
    var bloom = setupBloom(renderer, scene, camera, tier);
    if (bloom) {
      var origRender = renderer.render.bind(renderer);
      var mainScene = scene, mainCam = camera;
      renderer.render = function (s, c) {
        if (s === mainScene && c === mainCam && !renderer.getRenderTarget()) {
          bloom.render(function () { origRender(s, c); });
        } else {
          origRender(s, c);
        }
      };

      // handle resize
      var origSetSize = renderer.setSize.bind(renderer);
      renderer.setSize = function (w, h, u) {
        origSetSize(w, h, u);
        bloom.resize(w, h);
      };
    }

    if (typeof console !== "undefined") {
      console.log("[V2.3.0 Premium] Enhanced " + count + " materials, tier=" + tier + ", bloom=" + !!bloom);
    }
  }

  // ── Hook into DamBuilder3D.create ─────────────────────────────────

  var DB = window.DamBuilder3D;
  if (!DB) return;
  var origCreate = DB.create;

  DB.create = function (i, e) {
    var result = origCreate.call(DB, i, e);
    if (result && e && e.holder && e.holder.stage) {
      try {
        enhance(e.holder.stage);
      } catch (err) {
        if (typeof console !== "undefined") console.warn("[V2.3.0 Premium] Enhancement failed:", err);
      }
    }
    return result;
  };

  // if the stage already exists (hot reload), enhance it now
  if (DB.perfReport) {
    try {
      var rpt = DB.perfReport();
      if (rpt) {
        // stage exists — find it through the global
        // (can't access directly, but the next create() will catch it)
      }
    } catch (e) {}
  }

  window.DamBuilder3DPremium = { version: PREMIUM_VERSION, applied: function () { return applied; } };
})();
