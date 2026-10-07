# V2.2.13 — Next Challenge Engine

`next-challenge-engine-v2213.js` turns the gap between two levels into a journey: **LEVEL COMPLETE → the water settles → it moves DOWNSTREAM → the map camera follows it to the next flow station → NEXT STATION / NEXT CHALLENGE → preview → READY, DAM-ITE? → ENTER FLOW →**.

It plugs into the existing chain at the one place where the next level used to start by itself (`continueToNextLevel`, after Level Complete → FLOW FORWARD → Dam Map milestone → Bonus Waterwheel → -ite reveal). The original start function is handed to `NextChallengeEngine.run({ onStart })` and called **exactly once** — by ENTER FLOW, by SKIP, or immediately if the engine is missing or declines. While the preview is up the next level is not running (no clock). It never reads or writes progress, XP, FL OZ, unlocks, the map or the save.

## Context-aware voices (10 supplied clips; random only *between* fitting lines)
`NextChallengeEngine.buildContext()` reads the game: current / next level, current / next flow station, tap tier (`getRequiredTaps`), new station, new tier, milestone end, first completion, previously visited, levels left in the station, rewards. `plan(ctx)` then picks:

| situation | opener | reveal |
|---|---|---|
| normal next level (combo A / B) | Ready for What's Next · The Next Challenge Is Waiting · Let's See What's Downstream | The Next Challenge Is Waiting · Next Stop: The Flow |
| several levels remain (combo C) | **We're Not Done Yet** | The Next Challenge Is Waiting · Next Stop: The Flow |
| continued journey | The Journey Keeps Moving · Let's Keep This Water Moving | Next Stop: The Flow · … |
| **harder** — new tap tier / new station / chapter (combo D) | The Next Station Is Live (new station) · The Journey Keeps Moving | **Next Level. Same Flow. Bigger Challenge.** (premium, never used otherwise) |
| the READY moment (full cinematic) | | You Ready for the Next One? |

Never the same line twice in a row (history persists), never more than three lines per transition, never two voices at once (one shared lane; the opener waits a brief pause for any Level Complete voice).
Voice priority: 1 failure · 2 level complete · 3 ONE MORE · 3.5 warnings · 4 milestone · **4.5 next challenge** · 5 achievement · 6 personality · 7 reaction. Personality is blocked while the transition is up; music ducks (`GEI_AUDIO`).

## Transition pacing
* **First time** — the full cinematic (~4–5 s to the preview + ENTER FLOW), no skip button.
* **Repeat** — FAST (~1.2 s, one voice) with an unobtrusive **SKIP →** (starts the level immediately).
* **Repeat + major unlock** (new station / new tap tier) — MEDIUM (~2.6 s) keeping the premium line.
Major transitions are warmer / more energetic (stronger water, a music cue) but never stressful. ENTER FLOW is reachable the moment the preview shows.

## The journey
A strip of flow stations (💧 level nodes, an emoji **station node** when the next level opens a new milestone: MOUNTAIN → DAM → MILLPOND → SLUICE GATE → WATERWHEEL → FACTORY → DOWNSTREAM → OCEAN, repeating; the game's own milestone titles win). Water drops travel from the completed node to the next one while the camera pans after them.
`NextChallengeEngine.registerStation(n, { name, emoji, title })` adds future stations; `config.difficulty(level)` swaps the difficulty model.

Mobile: `position:fixed` full viewport with safe-area padding, the card shrinks, chips / reward rows drop on short phones, the CTA sits outside the shrinkable body (≥ 44 px) — verified 320×568 … 430×932. Reduced motion: no drops, no pan, fades only.

```bash
node tools/v2213-next-challenge/next-challenge-regression.mjs   # wiring select sequence repeat viewports safety chain
```
