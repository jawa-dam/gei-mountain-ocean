# V2.3.0 Premium 3D World — Asset Plan

**Branch:** `claude/affectionate-johnson-az0k8c`
**Baseline HEAD:** `d514b71`
**Baseline visual:** 100% procedural — flat-color MeshStandardMaterial, no textures, no GLB models, no post-processing

## Architecture

The premium upgrade uses an **add-on module** (`dam-builder-3d-premium-v2300.js`) that enhances the existing scene after `DamBuilder3D.create()` returns. This preserves all existing gameplay, physics, SVG fallback, and the minified 3D bundle.

Enhancement pipeline:
1. Scene hook intercepts the created stage
2. Materials are upgraded in-place (procedural PBR textures)
3. Post-processing compositor is added
4. Lighting is enhanced
5. Water shader is replaced with an improved version
6. Particle emitters are attached to key elements

## Current State by Category

### 1. Mountain Terrain and Water Source (Day 1)
**Current:** `PlaneGeometry` displaced by procedural height function, `MeshStandardMaterial` with solid green-brown color.
**Upgrade:**
- Procedural grass/rock texture (Canvas2D → normal map + albedo)
- Slope-dependent material blending (grass on flat, rock on steep)
- Terrain detail via displacement refinement on higher tiers
- **Source:** procedural (runtime Canvas2D textures)
- **License:** N/A (self-generated)

### 2. Dam Structure and Reservoir (Days 2–3)
**Current:** `BoxGeometry` + `ExtrudeGeometry` solids, flat grey/brown colors.
**Upgrade:**
- Procedural stone/concrete texture (Canvas2D → albedo + normal + roughness)
- Moss/weathering detail on lower surfaces
- Water line staining effect
- **Source:** procedural
- **License:** N/A

### 3. Spillways, Water Channels, and Sluice Gates (Day 4)
**Current:** Box/cylinder geometry, uniform grey material.
**Upgrade:**
- Worn stone channel textures with water erosion marks
- Metal material for gate mechanism (higher metalness + roughness variation)
- Wet surface darkening near water contact
- **Source:** procedural
- **License:** N/A

### 4. Waterwheel, Axle, Gears, and Mill (Day 5 — VERTICAL SLICE)
**Current:** ~20+ merged CylinderGeometry/BoxGeometry pieces, flat brown/grey colors.
**Upgrade:**
- Procedural wood grain texture for wheel structure (Canvas2D → albedo + normal)
- Procedural iron/metal texture for axle, bands, and gears
- Subsurface-style darkening on wet wood below waterline
- Improved bucket geometry with depth
- Water dripping particle effect from rising buckets
- **Source:** procedural
- **License:** N/A

### 5. Factory, Downstream River, and Ocean (Day 6)
**Current:** Box geometry buildings, procedural sine-wave water, foam threshold shader.
**Upgrade:**
- Building textures (wood planks, stone foundation)
- River flow particles and white-water effect at rapids
- Ocean horizon with improved wave displacement
- Distant mountain silhouettes via fog and layered planes
- **Source:** procedural
- **License:** N/A

### 6. Environmental Scenery, Lighting, Materials, and Effects
**Current:** Single DirectionalLight + HemisphereLight, FogExp2, procedural sky sphere, cone+cylinder instanced trees, no post-processing.
**Upgrade:**
- **Post-processing pipeline:** EffectComposer → RenderPass → UnrealBloomPass → OutputPass
- **SSAO:** Screen-space ambient occlusion for depth and contact shadows (medium+ tier)
- **Enhanced shadows:** Higher resolution shadow maps, cascaded on high tier
- **Improved sky:** Better atmospheric scattering colors, cloud hints
- **Tree variation:** Multiple tree LOD shapes, seasonal color variation
- **Atmospheric perspective:** Distance-based color desaturation
- **Source:** Three.js post-processing addons (MIT license, bundled inline)
- **License:** MIT (Three.js)

## Water Effects Plan (All Days)

**Current:** Custom ShaderMaterial with sin-based vertex displacement, procedural foam, basic Fresnel reflection from runtime cubemap.
**Upgrade:**
- Procedural normal map (Canvas2D noise → creates ripple detail without geometry cost)
- Multi-layer wave displacement (2–3 octaves vs current single)
- Improved Fresnel with view-angle-dependent color shift
- Foam particles at wheel contact and channel turbulence
- Refraction-like depth darkening
- Caustics pattern on shallow-water surfaces
- **Source:** procedural shader enhancements
- **License:** N/A

## Performance Budget

| Metric | Current | Target (capable) | Target (low-end) |
|--------|---------|-------------------|-------------------|
| Draw calls | ~40 | < 80 | < 50 |
| Triangles | ~15K | < 60K | < 25K |
| Texture memory | 0 MB | < 16 MB | < 8 MB |
| FPS (capable) | 60 | ≥ 60 | — |
| FPS (low-end) | 30+ | — | ≥ 30 |
| Cold load | ~1.5s | < 3s | < 3s |

Textures generated at runtime via Canvas2D, sized by tier:
- Low: 256×256
- Medium: 512×512
- High: 1024×1024

## Asset Sourcing Summary

| Asset Type | Source | License | Notes |
|------------|--------|---------|-------|
| All geometry | Procedural (enhanced Three.js primitives) | N/A | Runtime-generated |
| All textures | Procedural (Canvas2D at runtime) | N/A | Tier-scaled resolution |
| Normal maps | Procedural (Perlin/simplex noise → Canvas) | N/A | Runtime-generated |
| Post-processing | Three.js addons (MIT) | MIT | Bundled inline |
| Water shader | Custom GLSL | N/A | Enhanced from existing |
| Particles | Custom point sprites | N/A | Runtime-generated |

**No external asset downloads required.** All improvements are procedural code enhancements. No licensing issues. No proprietary assets from other games.

## Implementation Order

1. **Day 5 vertical slice** — waterwheel scene premium upgrade
2. Review and approval checkpoint
3. Expand to Days 1–4, 6 with shared material/texture library
4. Performance validation on Android
5. Full gate regression
