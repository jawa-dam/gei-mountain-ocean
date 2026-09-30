# V2.1.90 — DAM Map world regression harness

Loads the real `index.html` in headless Chromium and checks the illustrated DAM Map
(`dam-map-v2170.js`, engine version V2.1.90):

- **A** opens from the dock (click + touch); BACK / Escape close it; focus returns to the launcher
- **B** stats, "📍 you are here" pin, DAY ✓ / NOW pills, water flow and the factory rail follow live
  progress (level 1, level 6 finished, level 7 start, level 18 are staged inside the test browser only)
- **C** region pills never overlap or truncate (desktop, 1280×720, Pixel 7, iPhone SE)
- **D** pin/pills paint above the scene; tapping a pill explains the region
- **E** map sound toggle persists (`damMapSound`) and reports `aria-pressed`
- **F** opening/rendering the map never changes game state
- **G** real level-6 play-through → level card → DAM MAP MILESTONE → CONTINUE (click and 5.2 s auto)
  → map closes → Bonus Waterwheel; economy identical to `BASE_REF`; non-milestone levels skip the map

```bash
npm i -D playwright   # once, if Playwright is not already available
node tools/v2-dam-map/dam-map-regression.mjs
```

Offline (non-local requests blocked). Prints a JSON report; exits non-zero on any failure. Chromium only.
