# V2.1.89 — Quiet Tap + Utility Dock regression harness

Loads the real `index.html` in headless Chromium (desktop, Pixel 7 and iPhone 13 emulation),
drives real taps, and checks the V2.1.89 test list:

1. 20 rapid taps reach the world
2. no tap-driven text cards (toasts, personality card, V2.1.74–V2.1.82 chatter badges)
3. every tap still produces hydraulic water feedback; a full level plays through
4. rapid tapping can still create an occasional micro moment (≤ ~900 ms)
5. never more than one visible moment (sampled every 40 ms + a forced stress case)
6. DAM MAP hit-tests clean on every sample, opens the V2.1.70 map with live progress
7. BUY-ites / DAM MAP / SONG VAULT form one vertical dock, and each still opens its panel
8. fullscreen still toggles
9. economy/progression state and saved keys are identical to `BASE_REF` after the same taps
10. phone viewports: the same rules plus touch-opening the map

Offline and presentation-only: every non-local request (PayPal, CDN) is blocked.

```bash
npm i -D playwright   # once, if Playwright is not already available
node tools/v2-quiet-tap/quiet-tap-regression.mjs
BASE_REF=<commit> node tools/v2-quiet-tap/quiet-tap-regression.mjs   # parity against another revision
```

Prints a JSON report and exits non-zero if any check fails. Chromium only — verify Safari on a device.
