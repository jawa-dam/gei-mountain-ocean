# V2.1.92 — GLOBAL DAM-ITE AMBIENT SCREENSAVER + LOGO BRANDING + SAVED -ITE SHOWCASE harness

Loads the real `index.html` in headless Chromium (desktop, Pixel 7, iPhone 13) and checks the
12 acceptance items: home screensaver cadence + tap-to-stop, pre-game (START never blocked),
bonus wheel (SPIN never blocked, ambient stops on spin), level-complete large cameos, try-again
loop with music, the larger saved -ite reveal, the saved -ite collection popout, splash + header
logos (with text fallback), non-playable cameo characters, and phone overflow — plus reduced
motion, one bounded aria-hidden layer and presentation-only (no economy/save changes).

```bash
node tools/v2-ambient/ambient-regression.mjs
SHOTS=/tmp/shots node tools/v2-ambient/ambient-regression.mjs   # also writes screenshots
```

Offline: non-local requests are blocked; the two TAPLITES logo URLs are served a local stub PNG
so logo layout is measurable. Exits non-zero on failure.
