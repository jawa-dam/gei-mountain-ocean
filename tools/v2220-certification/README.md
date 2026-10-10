# V2.2.20 — FLOW ENGINE CERTIFICATION & ANDROID QUALITY GATE

Nothing in this folder adds a feature. It certifies the V2.2.17–V2.2.19 DAM BUILDER (six interactive Days, shared progression, three.js 3D world) and records what is **verified**, what is **fixed**, and what is **still unverified**.

## Reliable test strategy (software GL)

| Command | What it does |
| --- | --- |
| `node tools/v2220-certification/run-all.mjs` | **The grouped gate.** Runs every suite in its own node process (own Chromium), one after another, and classifies each result as PASS / FAIL / INFRA. Writes `last-run.json`. |
| `node tools/v2220-certification/run-all.mjs --group builder` | Builder suites only (SVG, 3D, end-to-end, golden). |
| `node tools/v2220-certification/run-all.mjs --only e2e:rewards` | One suite. |
| `node tools/v2217-dam-builder/dam-builder-e2e.mjs [chain\|routing\|cycle\|rewards\|mobile]` | The V2.2.20 end-to-end suites (real `index.html`, real lazy 3D bundle). |
| `node tools/v2217-dam-builder/dam-builder-3d-regression.mjs [suite]` | Per-component 3D suites. With no argument it now starts a **fresh browser per suite**. |
| `node tools/v2217-dam-builder/golden-day5.mjs` | Image guard for the approved Day 5 waterwheel scene. |

### Why the 3D suites "cascaded" into timeouts — investigated
* Each suite passes alone, so the failures were not regressions in the code under test.
* Cause: all suites shared **one Chromium process**. Software (SwiftShader) WebGL contexts, their shader caches and GPU-process memory accumulate across contexts that were `close()`d, so every later `waitForFunction` boot got slower until a 15–60 s wait expired, and one suite then crashed the whole browser for the suites after it.
* Fix (test infrastructure only, **no assertion changed or loosened**): `harness.mjs` gained `freshBrowser()`; the 3D/E2E "all" modes relaunch the browser between suites, and `run-all.mjs` goes further with one OS process per suite. The one flaky assertion found on the way (reduced-motion "pose" check, which read the wheel angle *before* the render-throttle window had refreshed it) was made deterministic by drawing one frame past the throttle; the assertion itself is unchanged.
* Classification rule: a result is **FAIL** only if an assertion ran and failed. A suite that never reached its assertions (killed by the wall-clock limit, "browser/context closed", a boot `waitForFunction` timeout) is **INFRA**, is re-run once in a fresh process, and both attempts are reported.

## What the end-to-end suites prove
* **E1 chain** — one uninterrupted Day 6 run, every stage checked against the *drawn* scene (not just the model): lake height ↔ reservoir level, release gate, millpond level, sluice gate plate, flume water, wheel angle, millstone, lamp, river speed, ocean gauge; each stage reacts to the one before it; machines run exactly when the wheel's power covers their own demand; starvation produces plain-language HUD feedback.
* **E2 routing** — Day 1: 27 fork settings → distinct routings, water conserved, only the reservoir chute raises the lake.
* **E3 cycle** — all six 3D Days solved through their own controls from a fresh Level 1 save → `reachOcean` → Level Complete card → Bonus Waterwheel → Level 2, Day 1 (harder variant).
* **E4 rewards** — Day 1 and Day 6: timeout, abandon, refresh, normal clear, repeated award calls, repeated celebration, mode switching, reload, Arcade-first, Builder Parts separate from FL OZ, purchase/receipt/entitlement counts untouched.
* **E5 mobile** — five phone viewports × six Days: no overflow, ≥ 44 px targets, nothing clipped/overlapping/truncated.

## Android quality gate — what can and cannot be claimed
The build/test container has **no Android device** (software GL only). Therefore **no on-device number exists yet and none is claimed.** The 3D scene ships a passive recorder so the first real-phone run produces a complete, honest record.

### Procedure (≈ 15 minutes on a phone)
1. Phone: Chrome (stable), battery > 50 %, not in power-saver, screen on, 5 min since last reboot is fine. Note model, Android version, Chrome version, `chrome://gpu` WebGL2 line (must say *Hardware accelerated*).
2. Cold load: clear site data, open `https://<preview>/?b3dperf=1`, open DAM BUILDER on Day 5 (3D). Record time from tapping the Day until the first frame (stopwatch or `DamBuilder3D.perfReport().buildMs` for scene build + the network time shown in `chrome://inspect` → Network).
3. Frame rate: play Day 5 for 60 s with the gate at 60–100 % and the machines engaged. Tap **COPY REPORT** (top-left readout) and paste the JSON. Fields: `fps`, `p50ms/p95ms/p99ms/worstMs`, `over16`/`over33` (% of frames slower than 60/30 fps), `quality` tier chosen, `dpr` after adaptation, `draw`, `tris`, `jsHeapMB`, `gpu`, `contextLost`.
4. Repeat for Day 1 (source shot), Day 2 (lab), Day 6 (factory, ocean view). `DamBuilder3D.perfReset()` between Days.
5. Touch responsiveness: slider drag, ± gate buttons, tapping the glowing hotspots and the 3D objects (lever, gate wheel, forks, wall lifts) — note any dropped/late taps and any scroll/page-zoom hijack.
6. Soak: 5 minutes continuous; note heat/throttling (fps trend in `perfReport()` every minute) and any tab reload.
7. Context loss: with the phone attached (`chrome://inspect`), run in the console: `document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()`. Expected: the Day falls back to the SVG version and stays completable; no reward change. Also background the tab for 30 s and return.
8. Switch back to TAPLITES ARCADE; check the 6-second tap clock and tap response are normal, and that memory (`jsHeapMB`) has fallen after leaving the Builder.
9. Fallback paths on the phone: `?b3d=off`, and the in-game SIMPLE VIEW toggle.

### Targets (not results)
60 fps on capable devices; on low-end devices the tier/DPR adaptation should hold ≥ 30 fps with `over33 < 10 %`. If a device misses this, record it — do not tune the numbers.

### Recorded device results
| Device / Android / Chrome | WebGL2 | Build ms | fps (avg) | p95 ms | tier / dpr | heap MB | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **UNVERIFIED — no physical Android device available to this session** | | | | | | | |

## Defects found and fixed during certification (all caught by the new end-to-end tests or by looking at the real shell)
1. **Day 3 release valve did nothing** (3D only): the pinned-millpond shortcut forced `release = 13 L/s` whatever the valve said, so the lake always drained and Day 3 was unwinnable. Fixed with an explicit free-release mode in the shared engine (`H.freeRel`).
2. **Millpond inflow jet never appeared**: the shared state never published `Qrel`.
3. **Stray RAIN FORECAST panel** stretched over the whole stage in every Day except Day 3 (an SVG has no `hidden` property and the shell's generic `.dbStage svg` rule overrode the sizing). Day 5 included.
4. **River/ocean ignored the simulated flow**: its speed was constant; it now follows the water that actually reaches the sea (identical to the approved look at Day 5's 13 L/s).
5. Presentation: Day 1 source shot dark (added a warm key light active only in that shot, higher camera), Day 2 dam-lab arrows tiny and the section camera on the wrong side (rebuilt shot, 2.2× arrows, thicker wall, pill hotspots that no longer wrap), Day 6 factory/ocean framing.

## Still not done (explicitly out of scope for certification)
* Mid-challenge save/resume (refresh restarts the run, no reward, no penalty — preserved on purpose). Possible future improvement.
* Premium asset expansion (authored GLB equipment, sculpted terrain, recorded audio, photographic textures).
