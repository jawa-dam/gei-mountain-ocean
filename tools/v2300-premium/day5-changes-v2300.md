# V2.3.0 Day 5 Premium Vertical Slice — Change Log

**Branch:** `claude/affectionate-johnson-az0k8c`
**Scope:** Day 5 Waterwheel scene (extends to all Days via shared materials)

## Files Changed

| File | Change | Risk |
|------|--------|------|
| `dam-builder-3d-v2218.js` | Added `window.__THREE_R186` export (one line at end of IIFE) | Minimal — exports only, no logic change |
| `dam-builder-v2217.js` | Modified `load3D()` to chain-load premium module | Low — premium load failure is caught and ignored |
| `dam-builder-3d-premium-v2300.js` | **NEW** — premium enhancement module | N/A — additive only |

## What Changed (New vs Approved)

### 1. Procedural PBR Textures (biggest visual upgrade)
**Before:** All materials are flat solid colors (`MeshStandardMaterial` with `color` only, no maps).
**After:** Materials are classified by color (stone, wood, grass, metal) and receive:
- Albedo maps (Canvas2D procedural — stone blocks, wood grain, grass blades, weathered metal)
- Normal maps (surface detail without extra geometry)
- Roughness maps (stone only — variation in surface sheen)
- Tier-scaled resolution: 256px (low), 512px (medium), 1024px (high)

### 2. Enhanced Lighting
**Before:** Single `DirectionalLight` (#FFF8B8, intensity 3.1) + `HemisphereLight` (#9BADE8/#4A4634, intensity 0.85).
**After:** Adds three `PointLight` fills:
- Warm fill (opposite sun) — reduces harsh shadows, adds depth
- Cool rim light (behind scene) — atmospheric edge definition
- Warm waterwheel accent — draws eye to the mechanical heart of the scene
- Shadow map upgraded to 2048x2048 with reduced bias

### 3. Water Shader Improvements
**Before:** Procedural sin-wave displacement, basic Fresnel, uniform color.
**After:** In-place uniform modifications:
- Deeper water colors (deep: #062D4F, shallow: #1A7A8E) for richer appearance
- Increased wave amplitude (+40%) for more visible surface motion
- Boosted foam effect for turbulence visibility

### 4. Bloom Post-Processing (medium/high tier only)
**Before:** No post-processing pipeline.
**After:** Lightweight 3-pass bloom:
1. Threshold extract (bright regions > 0.75)
2. Two-pass Gaussian blur at quarter/half resolution
3. Additive composite at 30% strength
- Adds sun glints on water, warm glow on highlights
- Skipped on low-tier devices for performance

### 5. Atmospheric Refinement
**Before:** FogExp2 with default density and color.
**After:** Slightly reduced fog density (−15%), cooler fog tint (#C8D8E8) for atmospheric perspective.

## What Did NOT Change

- **No geometry changes** — all meshes, vertices, draw calls identical
- **No physics/simulation changes** — hydraulic engine untouched
- **No reward/payment changes** — awardDay, FL OZ, Builder Parts, caps all preserved
- **No SVG fallback changes** — `dam-builder-days-v2217.js` untouched
- **No new external assets** — all textures are procedural (Canvas2D at runtime)
- **No Three.js version change** — still r186, same minified bundle (only the export line added)
- **Existing 3D bundle logic unchanged** — the IIFE body is identical; only a read-only export was appended

## Performance Impact

| Metric | Before | Expected After |
|--------|--------|---------------|
| Draw calls | ~40 | ~40 (unchanged — textures don't add draws) |
| Triangles | ~15K | ~15K (unchanged — no new geometry) |
| Texture memory | 0 MB | ~2–8 MB (tier-dependent, Canvas2D) |
| Bloom overhead | none | 3 extra draws at reduced resolution (render info restored) |
| Material compile | instant | +50–150ms first frame (shader recompile for maps) |

## Fallback Behavior

- If `dam-builder-3d-premium-v2300.js` fails to load → 5-second timeout, warning logged, base 3D scene used unchanged
- If `window.__THREE_R186` is missing → premium module returns immediately, no-op
- If material classification finds no match → material left as-is (original flat color)
- If bloom setup fails (e.g. small viewport) → null returned, no bloom applied
- SVG fallback path completely unaffected
