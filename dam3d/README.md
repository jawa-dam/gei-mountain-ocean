# DAM BUILDER 3D — Day 5 vertical slice (V2.2.18)

Real-time WebGL2 (three.js r186) scene for **Day 5 — Waterwheel / Mechanical Conversion**, lazy-loaded by the Builder. The game itself stays build-free; only this bundle is generated.

```bash
cd dam3d && npm i && npm run build      # → ../dam-builder-3d-v2218.js (single IIFE, ~630 KB / ~170 KB gzip)
node ../tools/v2217-dam-builder/dam-builder-3d-regression.mjs     # D1–D8 (needs Playwright + Chromium)
```

## Architecture decision (audit result)
* The repo had **no WebGL, no 3D models, no build step**; art is CDN PNGs; CSP is `script-src 'self'` (no CDN scripts). three.js is therefore bundled and self-hosted, **fetched only when Day 5 opens** (Arcade and Days 1–4 never load it).
* No suitable waterwheel / dam / mill GLB exists in the repo and asset libraries (Poly Pizza, Kenney, Poly Haven, Sketchfab) are not reachable from the build environment, so **every model here is procedural geometry + generated PBR textures**. No GLB is used. `GLTFLoader` is deliberately not bundled until real assets exist.
* Fallbacks: no WebGL2, bundle fetch failure, context loss, `?b3d=off`, or the in-game SIMPLE VIEW toggle → the existing SVG Day 5 (same model, same ledger).
* Debug/review: `?b3d=low|medium|high` forces the quality tier.

## What is in the scene
Terrain heightfield (gorge, lake basin, meandering river, ridged mountains, triplanar rock + bump, snow, instanced pines, distant range) · gradient sky with clouds + PMREM image-based light · baked cube-map reflections of the real mountains/dam in all water · custom water shader (flow-scrolled normals, fresnel, sun glitter, foam, fog) on the lake, gate outflow, flume, falling jet, tailrace, river, stepped spillway sheet + plunge stream and a mountain waterfall · concrete gravity dam (stepped spillway, parapet, rails, gallery windows) · intake gate house with a lifting steel sluice gate on screw stems, hoist deck, gearbox and handwheel · flume on masonry piers · masonry tailrace · open timber-frame mill · overshot wheel (2 rims, 16 spokes, 20 V-buckets, hub, iron straps, axle in brass journals) · 36-cog crown wheel driving a 19-stave lantern pinion (correct pitch) → vertical shaft → millstone with furrowed dress, tun, hopper, sack, flour pile · belt-driven sawmill with fast-and-loose pulleys, blade, carriage and log · instanced water-in-buckets · pooled spray / mist / dust / chips particles · lamps + a point light that come on with production · build-in construction animation, cinematic intro, touch orbit, success push-in.

## Model (shared with the SVG Day 5; parity-tested)
`Q = 13 × gate`, `P = η·min(Q, 14)` (η = 0.60 + 0.06 per bearing level), mill needs 3, saw needs 4 (saw from Level 3), overload slows the wheel `× (0.25 + 0.75·P/D)`, win = all machines running 4 s. Rewards are never decided here: the shell pays through the game's `awardDay` ledger.

## V2.2.19 — shared Mountain-to-Ocean world (all six Days)
One persistent stage (`stage.js`) holds the whole world: mountain source works → reservoir/lake → dam → millpond with release gate → sluice → waterwheel → mill/factory → river → ocean. Each Day (`days.js`: `day1`…`day6`, registered in `main.js`) is a *controller* on that stage: it sets the shared hydro state (`hydro.js`), picks a camera shot (`SHOTS`), and registers hotspots/pickables. `S.vs` is the shared visual state every machine reads (lake level, gate, flow, wheel rpm, power, machines engaged).

| Day | Scene | Objective |
| --- | --- | --- |
| 1 | source works (`source.js`) | turn forks to fill the basins; chute waterfall raises the lake |
| 2 | dam lab (`damlab.js`) | stepped dam wall vs pressure, then FILL |
| 3 | lake / spillway | hold level against a storm forecast |
| 4 | sluice gate + millpond (`millpond.js`) | hold a target flow |
| 5 | the approved waterwheel (unchanged; golden-guarded) | power machines |
| 6 | factory (`factory.js`) | coordinate the whole chain |

All assets are procedural (primitives + generated canvas textures). Missing/commissionable: authored GLB equipment, sculpted terrain, recorded audio, photographic textures.
Tests: `node tools/v2217-dam-builder/dam-builder-3d-regression.mjs [suite]` (run suites one at a time on software GL; a single all-suites run can exceed timeouts), `golden-day5.mjs` for the approved-scene guard.
