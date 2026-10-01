# V2.2.03 — DAM MAP Random Appearance regression harness

Loads the real `index.html` in headless Chromium (offline) and checks `GEI_MAP_APPEARANCE`
(`dam-map-random-appearance-v2203.js`) on top of the V2.1.90 DAM Map:

- **A** API present; a theme is selected at page load; every theme target exists in the live map
- **B** the map appears; 8 close/reopen cycles each select a new theme; one open never re-themes
- **C** the previous theme is fully replaced (one attribute, computed colours, no stacking);
  Moonlit Valley reproduces the original scene
- **D** game state unchanged; the only storage write is `damMapAppearanceLast`
- **E** every refresh selects a new theme; the first open after a refresh shows it
- **F** overlay-style opens (class change) and a rebuilt map page are themed fresh
- **G** deterministic per seed; every theme reachable
- **H** Pixel 7: no layout shift across themes, pills on top and tappable, no page scroll;
  reduced motion stops the atmosphere animation; no new script errors

```bash
node tools/v2-map-appearance/v2203-map-appearance-regression.mjs
```

Needs Playwright (`npm i -D playwright` if not already available). Chromium only.
