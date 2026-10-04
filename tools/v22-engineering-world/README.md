# V2.2 — DAM ENGINEERING WORLD

The six existing DAM Map regions are now interactive engineering labs (MOUNTAIN→mountain, DAM→dam,
MILLPOND→reservoir, SLUICE-GATE→sluice, WATERWHEEL→wheel/turbine, FACTORY→ocean). Per lab:
DISCOVER → TEST (experiment) → MISSION → 🧭 WHAT WOULD YOU DO? (decision → result → explanation) → REWARD → 🛠️ FREE PLAY.

- `engineering-world-data-v22.js`  `GEI_STEM.stations` (= `GEI_STEM.world`), `GEI_STEM.why` (💡 WHY DID THAT HAPPEN? text), ranks, careers, Master reward
- `engineering-world-labs-v22.js`  the interactive labs (`GEI_STEM.registerLab`); `ctx.why()`, `ctx.wilbert()`, free-play mode
- `engineering-world-v22.js`       engine: popout UI, Wilbert coach + 💡 WHY?, decisions, free play, ranks, hub, Master screen, map hooks

Add an experiment later (V2.3+): `GEI_STEM.registerStation("id", {...})` + `GEI_STEM.registerLab("name", fn)` + `GEI_STEM.why["id.event"]`.

**Economy rule.** STEM XP, ranks, badges, Master and Free Engineering Mode are educational only. They are derived from step flags
stored in `localStorage["geiStemAcademy.v1"]` (same key as V1, so V1 progress carries over) and never read or write `state`,
FL OZ, game XP, purchases, entitlements or any `/api` route. Free play awards nothing; each step awards XP once.
Wilbert's coach preference is `geiStemCoach.v1` (presentation only).

```bash
node tools/v22-engineering-world/engineering-world-regression.mjs   # SHOTS=dir for screenshots
```
Pre-existing `addStyle is not defined` errors come from four unparseable tap-lites modules and are ignored by the harness.

## V2.2.1 — FOLLOW THE WATER (`follow-the-water-v221.js`)
One animated cutaway of the whole system (mountain → dam → reservoir → gate → turbine → generator → downstream),
opened by the 👁️ SEE INSIDE button in every lab, the hub's 🌊 card, or the Master screen's ▶ WATCH THE WHOLE SYSTEM.

- 🌊 **Follow the water** — a guided tour: a 💧 leads, Wilbert's pointer highlights each part, the system reacts.
- 🧩 **What does this do?** — tap any part. Names grow from plain (WATER GATE, SPINNING WHEEL) to engineering
  (SLUICE GATE, TURBINE) once the matching lab is discovered.
- 🧪 **Experiment** — gate + rain controls; each change plays a cause-and-effect trail and a one-line result.
- 🎯 **Predict** — four predictions (flow, storage, energy, downstream) → ✨ understanding moments → 🧠 SYSTEMS THINKER.
- 🔬 **Engineer view** — optional readouts (gate %, level, RPM, power, river health); the preference is remembered.
- ▶ **Finale** — zooms out over the running system, then ENGINEERING MODE UNLOCKED.
- The cutaway is revealed by the DAM Map's own progression (parts not reached yet are "?").

Plug-in point: `GEI_STEM.views.<name>(body, ctx, env, opts)`; open with `GEI_STEM.engine.openView(name, opts)`.
Writes only `geiWaterSystem.v1` (parts seen / understood) and `geiEngineerView.v1`. No STEM XP, game XP, FL OZ, purchases or `/api`.
