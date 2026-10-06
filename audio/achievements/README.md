# Achievement audio (V2.2.7) — drop MP3s here

The Achievement Audio Director (`achievement-audio-director-v227.js`) plays these during the Level Complete experience.
**The game works with zero files** (built-in synth cues cover the sound effects, voice lines are simply skipped). Every MP3 is optional,
lazy-loaded the first time it is needed, and a missing / broken / slow file is skipped silently.

## Layout and naming

`/audio/achievements/<folder>/<base>-NN.mp3` — `NN` is `01`, `02`, `03` … consecutive.

| Category | Folder / files | When | Kind |
|---|---|---|---|
| `level-complete` | `level-complete/level-complete-01.mp3` | the card appears | voice |
| `xp-earned` | `xp-earned/xp-earned-01.mp3` | the FL OZ reward pops | sfx layer |
| `badge-earned` | `badge-earned/badge-earned-01.mp3` | the level medal appears | sfx layer |
| `milestone-progress` | `milestone-progress/milestone-progress-01.mp3` | a water tank fills | sfx layer |
| `five-more` … `two-more` | `five-more/five-more-01.mp3` … | only when exactly 5 / 4 / 3 / 2 levels remain | voice |
| `one-more` | `one-more/one-more-01.mp3` | Level 5 of 6 (exactly one remains) | voice |
| `milestone-complete` | `milestone-complete/milestone-complete-01.mp3` | the dam releases (level 6, 12, …) | voice |
| `next-challenge` | `next-challenge/next-challenge-01.mp3` | right after milestone-complete | voice |
| `flow-forward` | `flow-forward/flow-forward-01.mp3` | CONTINUE tapped (whoosh) | sfx |
| `next-station` | `next-station/next-station-01.mp3` | the next stop lights up | sfx |
| `rare-wow` | `rare-wow/rare-wow-01.mp3` | ~2 % of ordinary levels (cooldown 6 levels) | sfx layer |
| `character-reactions/normal` | `character-reactions/normal-01.mp3` | occasional, ordinary level | voice |
| `character-reactions/progress` | `character-reactions/progress-01.mp3` | 2–3 levels left | voice |
| `character-reactions/one-more` | `character-reactions/one-more-01.mp3` | one level left | voice |
| `character-reactions/milestone` | `character-reactions/milestone-01.mp3` | milestone complete | voice |

Per-character takes: `character-reactions/one-more-<characterId>-01.mp3` (character ids as in the game, e.g. `…-danite-01.mp3`) are used
instead of the generic pool when that character is the active Personal DAM Guide.

A category named in the voice table says exactly what is on screen (`five-more` is only ever chosen at exactly 5 remaining), so a clip may be
chosen at random *within* a category but never contradicts the count.

## Adding files

1. Drop `milestone-complete-03.mp3` next to `-01` and `-02`. **That is all** — consecutive numbers are discovered automatically
   (up to 12 per category; discovery stops at the first gap).
2. Optional: list files (or non-consecutive / external files) in `manifest.json`; names are relative to the category folder, or absolute paths / URLs.
   Set `"discover": false` to use only the manifest.
3. New category? Add the key to `manifest.json` and call `__GEI_ACHIEVEMENT_DIRECTOR__.pool("my-category")`, no code changes to the engine.

Keep clips short (voice ≤ ~2.5 s, sfx ≤ ~3 s) and mastered at a consistent, moderate level — the director only scales by the player's master volume
and a per-tier gain (0.70 … 1.0), it does not normalise loudness. Voices are sequenced (never two at once); music is ducked while a voice speaks.
