# V1 — DAM STEM ACADEMY

Six STEM labs on the six existing DAM Map regions (MOUNTAIN→mountain, DAM→dam, MILLPOND→reservoir,
SLUICE-GATE→sluice, WATERWHEEL→wheel, FACTORY→ocean). Each: DISCOVER → EXPERIMENT → MISSION → PROVE IT → COMPLETE.

- `stem-academy-data-v1.js`  station data (`GEI_STEM.stations`, `registerStation`), careers, Master reward
- `stem-academy-labs-v1.js`  interactive labs (`GEI_STEM.registerLab`)
- `stem-academy-v1.js`       engine, popout UI, hub, Master screen, DAM Map hooks

Add a station: `GEI_STEM.registerStation("future", {...})` + `GEI_STEM.registerLab("name", fn)`.

STEM XP is educational only: stored as step flags in `localStorage["geiStemAcademy.v1"]` (XP/badges/Master are
derived), never touches `state`, FL OZ, XP, purchases or `/api`. Stations unlock via the map's own progression.

```bash
node tools/v1-stem-academy/stem-academy-regression.mjs   # SHOTS=dir for screenshots
```
Pre-existing `addStyle is not defined` errors come from four unparseable tap-lites modules and are ignored.
