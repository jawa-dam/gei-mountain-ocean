# V2.2.4 — Flow Welcome Effect regression harness

The welcome card is a miniature dam: it holds water, releases a drop from a small spillway lip, and the
drop splashes into a reservoir strip, ripples, and sends a soft wave outward (`flow-welcome-v224.js`).

Loads the real `index.html` in headless Chromium and checks: all six sequence variations (drop / three drops /
stream / big ripple / wave / character-first), the 3-tap toy (drop → splash → ripple → "FLOW ACTIVATED! 🚀"),
an 8-device layout matrix (no overflow, controls inside the viewport, title never covered), reduced motion,
master mute, water tones, and that FL OZ / progression / ownership / storage are untouched and every FX node
is cleaned up on close.

```bash
node tools/v224-flow-welcome/flow-welcome-regression.mjs          # SHOTS=1 SHOT_DIR=./shots to keep PNGs
```

Offline; exits non-zero on failure. Dev hooks: `__GEI_FLOW_WELCOME__.configure({variation:"A".."F", tone:"luminous"})`.
`addStyle is not defined` / `Unexpected string` page errors are pre-existing on the base and are ignored.
