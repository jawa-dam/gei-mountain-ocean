# V2.2.5 — Leaking Dam Welcome Experience

`flow-welcome-v225.js` (extends the V2.2.4 Flow Welcome Effect) turns the Beaver welcome card into a miniature
living dam: a reservoir above (waves, reflections, caustics, a changing level), the card as the dam face (concrete
seams, damp zones, hairline cracks, wet runs that dry back), and a spillway + pool below. A hydraulic pressure cycle
(calm → rising → pressure → seepage → leaks → [hold] → release → splash → ripple → reset) repeats with variation; a
rare WOW release holds, then whooshes. Eight per-load personalities (A–H), six leak types (micro seep, drip, thin
stream, split stream, heavy leak, edge overflow), tap interaction (card 1–5, reservoir, pool), an optional
💡 Engineer's Note (ⓘ), active-character chips/reactions, throttled hydraulic audio (damVoice/damNoise), reduced-motion mode.

```bash
node tools/v225-flow-welcome/flow-welcome-regression.mjs          # SHOTS=1 SHOT_DIR=./shots keeps PNGs
```

Offline; exits non-zero on failure. Dev hooks: `__GEI_FLOW_WELCOME__.configure({variation:"A".."H", tone:"luminous", time:.3})`,
`.leak("split")`, `.release("wow")`, `.phaseLog()`. `addStyle is not defined` / `Unexpected string` page errors and the
game's own off-screen glow layers (body.scrollWidth) are pre-existing and ignored.
