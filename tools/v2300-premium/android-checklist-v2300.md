# V2.3.0 Android Validation Checklist

**Branch:** `claude/affectionate-johnson-az0k8c`
**HEAD:** (fill in after commit)
**Preview:** `https://gei-mountain-ocean-git-claude-affectionate-john-8fadc5-god-9915.vercel.app/`
**Premium Module:** `dam-builder-3d-premium-v2300.js` (V2.3.0)

> Before testing: confirm the preview deploy SHA matches HEAD above (check Vercel deployment log).
> Record actual measurements. Leave UNVERIFIED if not measured. Never fabricate.

---

## Device Info (fill in)

| Field | Value |
|-------|-------|
| Device model | |
| Android version | |
| Chrome version | |
| `chrome://gpu` WebGL2 | Hardware accelerated? Y / N |
| Battery level | > 50%? Y / N |
| Power saver off? | Y / N |

---

## Step 1: Cold Load
- [ ] Clear site data for the preview URL
- [ ] Open `https://<preview>/?b3dperf=1`
- [ ] Open DAM BUILDER → Day 5 (3D)
- [ ] Record: Time from Day tap to first frame: ______ ms
- [ ] Record: `DamBuilder3D.perfReport().buildMs`: ______ ms
- [ ] **V2.3.0**: Confirm premium console log: `[V2.3.0 Premium] Enhanced N materials, tier=..., bloom=...`
- [ ] **V2.3.0**: `DamBuilder3DPremium.applied()` returns `true`: Y / N

## Step 2: Frame Rate (Day 5, 60 seconds)
- [ ] Play Day 5 for 60s, gate at 60-100%, machines engaged
- [ ] Tap COPY REPORT (top-left readout), paste JSON below:
```json

```
- [ ] Record: fps avg ______, p95 ms ______, tier ______, dpr ______, heap MB ______
- [ ] **V2.3.0**: `textures` count in report (expected ~28): ______
- [ ] **V2.3.0**: `draw` count in report (expected ~40-110): ______

## Step 3: All Days Performance
- [ ] Day 1 (source shot): `DamBuilder3D.perfReset()` first. fps ______, p95 ______
- [ ] Day 2 (lab): fps ______, p95 ______
- [ ] Day 6 (factory + ocean): fps ______, p95 ______

## Step 4: Touch Responsiveness
- [ ] Slider drag works smoothly: Y / N
- [ ] ± gate buttons respond: Y / N
- [ ] Glowing hotspots respond: Y / N
- [ ] 3D objects (lever, gate wheel, forks, wall lifts) respond: Y / N
- [ ] No dropped/late taps: Y / N
- [ ] No scroll/page-zoom hijack: Y / N

## Step 5: Short-Screen Layout (phones ≤ 640px tall)
- [ ] Mode selector does not cover Arcade tap area: Y / N / N/A
- [ ] No controls clipped or unreachable: Y / N
- [ ] Builder HUD does not overflow: Y / N

## Step 6: Soak (5 minutes continuous)
- [ ] fps at 1 min: ______
- [ ] fps at 3 min: ______
- [ ] fps at 5 min: ______
- [ ] Heat/throttling observed? Y / N
- [ ] Tab reload during soak? Y / N
- [ ] **V2.3.0**: Bloom glow remains consistent (no flicker/artifacts): Y / N

## Step 7: Context Loss
- [ ] Run in console: `document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`
- [ ] Falls back to SVG version: Y / N
- [ ] Day remains completable in SVG: Y / N
- [ ] No reward change after context loss: Y / N
- [ ] Background tab 30s then return: works? Y / N

## Step 8: Audio and Soundtrack
- [ ] Music starts only after a tap gesture: Y / N
- [ ] Music ducks during voice events: Y / N
- [ ] Soundtrack continues across Day transitions: Y / N
- [ ] No audio glitches during 3D scene changes: Y / N
- [ ] Music button toggles correctly: Y / N

## Step 9: Reward Behavior
- [ ] Complete a Builder Day
- [ ] Builder Parts awarded (not FL OZ): Y / N
- [ ] Level card shows correctly: Y / N
- [ ] Bonus Waterwheel spins: Y / N
- [ ] Reward ledger increments exactly once: Y / N
- [ ] Did NOT test with real payment credentials: confirmed

## Step 10: Switch to TAPLITES ARCADE
- [ ] 6-second tap clock works normally: Y / N
- [ ] Tap response normal: Y / N
- [ ] `jsHeapMB` fell after leaving Builder: ______ MB → ______ MB
- [ ] Existing Arcade rewards unchanged: Y / N
- [ ] FL OZ balance unchanged: Y / N

## Step 11: Fallback Paths
- [ ] `?b3d=off` — SVG fallback completes a Day: Y / N
- [ ] In-game SIMPLE VIEW toggle — SVG fallback works: Y / N
- [ ] **V2.3.0**: With network throttle, premium module timeout → base 3D renders: Y / N

## Step 12: Six-Day Progression Check
- [ ] Day 1 → Day 6 progression intact: Y / N
- [ ] Day 5 waterwheel scene renders with premium textures: Y / N
- [ ] Builder Parts remain separate from FL OZ: Y / N
- [ ] Saves persist across reload: Y / N

## Step 13: V2.3.0 Premium Visual Checks
- [ ] Stone surfaces show procedural texture (not flat grey): Y / N
- [ ] Wood surfaces show grain pattern (waterwheel, timbers): Y / N
- [ ] Grass areas show blade-like detail: Y / N
- [ ] Metal surfaces show slight sheen/reflection: Y / N
- [ ] Water colors deeper/richer than flat blue: Y / N
- [ ] Waves visibly larger than base (amplitude increase): Y / N
- [ ] Bloom glow visible on bright areas (sun reflections, highlights): Y / N
- [ ] Three fill lights create depth (warm fill, cool rim, wheel accent): Y / N
- [ ] No z-fighting or texture tiling artifacts: Y / N
- [ ] No visual glitches on Day transitions: Y / N

---

## Summary

| Metric | Target | Actual |
|--------|--------|--------|
| fps (capable device) | ≥ 60 | |
| fps (low-end) | ≥ 30, over33 < 10% | |
| Cold load | < 3s on fast connection | |
| Context loss recovery | SVG fallback | |
| Touch responsiveness | No dropped taps | |
| Reward correctness | Exactly-once, Parts not FL OZ | |
| Premium applied | `DamBuilder3DPremium.applied() === true` | |
| Texture count | ~28 (20 base + 8 premium) | |
| Bloom active | medium/high tier | |
| No visual artifacts | Clean textures, no z-fighting | |

**Overall Android status:** UNVERIFIED — no physical device available to this session.

**Tester:** _______________
**Date:** _______________
