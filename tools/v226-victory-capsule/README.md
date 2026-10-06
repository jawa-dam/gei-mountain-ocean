# V2.2.6 — Hydraulic Victory Capsule (LEVEL COMPLETE → FLOW FORWARD)

`victory-capsule-v226.js` recomposes the existing Level Complete card (`#levelCard`, `showLevelComplete`) into a compact
capsule that never scrolls and keeps **CONTINUE →** in the thumb zone. It MOVES the existing nodes into capsule groups
(nothing is recreated, so the Dam-ITE voice, cameo, ambient, WOW and Dam Map systems keep their references) and hides the
report-style pieces (eyebrow, congrats, wallet box, quip, chain, note) — their text is folded into an optional ⓘ DETAILS overlay.

| Tier | Content |
|------|---------|
| Primary | 🏆 LEVEL N COMPLETE! · hero (dam + mill + the active character) · 💧 +666 FL OZ · rescue chip · NEXT → 🎡 BONUS WATERWHEEL · CONTINUE → |
| Secondary | six-station strip (stamped), level medal, one-line STEM (only when the container is ≥ 660px tall), short character chip |
| Optional | ⓘ overlay: wallet, store hint, rescue water, humor line, milestone stats, STEM — overlays the hero, never moves CONTINUE |

Layout is container-based (`#levelCard { container: hvc / size }`): the hero flexes to the remaining height, wide containers
switch to a two-zone grid, portrait screens anchor the capsule to the bottom. On wide viewports the card is lifted from the game's
phone-shaped app column to the full stage. FLOW FORWARD delays only the first CONTINUE click per card (~0.46 s, 0.36 s reduced
motion, a second tap skips) and then re-dispatches the click to the ORIGINAL chain (WOW scene → Dam Map milestone → Bonus
Waterwheel → next level). It never touches FL OZ, XP, progression, ownership or storage.

```bash
node tools/v226-victory-capsule/victory-capsule-regression.mjs        # SHOTS=1 SHOT_DIR=./shots keeps PNGs
```

Offline; exits non-zero on failure. Pre-existing `addStyle is not defined` / `Unexpected string` page errors are ignored.
