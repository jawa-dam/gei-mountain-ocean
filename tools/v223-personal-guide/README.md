# V2.2.3 — PERSONAL DAM GUIDE (`personal-guide-v223.js`)

YOUR CHARACTER. YOUR GUIDE. YOUR JOURNEY. The player's **active character** is their companion on the DAM Map, in the
STEM labs and in FOLLOW THE WATER. Wilbert stays — as the optional expert ("ASK WILBERT").

## One source of truth
`state.activeCharacter` (index.html) stays authoritative. `personal-guide-v223.js` only **reads** it through the game's
own `getActiveCharacter()`, and re-verifies `isPlayableCharacter()` + `isUnlocked("characters", id)` on every read;
otherwise it falls back exactly like the game does (the free default). There is no second selector, inventory, unlock,
purchase or persistence system. Locked, cameo-only (DAM Unicorn/Statue/Pool/Double Burger… — non-playable since V2.1.91)
and tampered ids can never become the guide. Selection still happens in the main game; premium (cash-only) characters
count as owned only after the existing entitlement flow has put them in `unlockedCharacters`.

## What changed
| Where | What |
|---|---|
| Map | the existing walking sprite (Beaver voice guide) wears the active character; station-aware placement, GEI-card avoidance and Universal DAM View scaling are unchanged. It now also clears wide pin labels and stays inside the visible window (shrinks slightly on narrow screens instead of covering a label) |
| Reactions | small, short-lived speech bubble beside the guide (never over the pin, pills or GEI card; rate-limited; announced via a live region) + station emotes (look up / inspect / float / pull / sway / cheer) scaled by personality |
| Personality | built on the game's own `GEI_CHARACTER_PERSONALITIES` styles. `line(key)` = per-character → per-style → base library. `register(id, {key: line})` gives a future character unique reactions with no engine change. The 💡 WHY science card is identical for every character |
| ASK WILBERT | one small button on the map and in labs. The guide wonders, Wilbert answers (`station.ask` in the data file); asking again goes deeper. Wilbert's voice clips stay Wilbert's — the sprite only glows for the beaver family |
| Journey | short skippable intro (once per character), first-time moments (mountain, dam, reservoir experiment, sluice, turbine, power, downstream), Master moment: DAM JOURNEY COMPLETE → YOUR GUIDE → six badges → ENGINEERING MODE UNLOCKED. FOLLOW THE WATER's pointer wears the guide |

Memory: only `geiPersonalGuide.v1` (intro seen / first-time moments). No game state, FL OZ, XP, STEM XP, purchases or entitlements are touched.

```bash
node tools/v223-personal-guide/personal-guide-regression.mjs      # SHOTS=dir for screenshots
```
