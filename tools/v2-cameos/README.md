# V2.1.91 — DAM-ITE SURPRISE CAMEO ENGINE regression harness

Loads the real `index.html` in headless Chromium (desktop, Pixel 7, iPhone 13) and checks:
the nine retired characters are gone from every picker/store/prize path (but still owned by
legacy saves), renames, Beaver + Wilbert, the THE DAM BROKE idle cameo show (timing, one at a
time, no repeats, music keeps playing, button never covered, one tap ends it and retries the day),
DAM Map cameos (on screen, never over the map buttons, stop on BACK), reduced motion, tier
weights, and that FL OZ / progression / ownership / saved keys never change.

```bash
node tools/v2-cameos/cameo-regression.mjs
```

Offline: every non-local request is blocked (cameo art falls back to its emoji). Exits non-zero on failure.
