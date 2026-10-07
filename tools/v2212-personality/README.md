# V2.2.12 — GEI Playful Personality Engine

`flow-moment-personality-v2212.js` adds the third communication layer on top of the Flow Moment Engine:

| layer | engine | says |
|---|---|---|
| 🌊 milestone voice | `MilestoneProgressEngine` | how close am I |
| 🏆 achievement voice | `LevelCompleteVoiceEngine` | what I accomplished |
| 😁 personality voice | `PersonalityTriggerEngine` (`GEIPersonalityEngine`) | spontaneous, playful commentary — GEI's attitude |

It owns no game state (no progress / FL OZ / XP / save access) and nothing waits for it.

## PLAYER ACTION → GAME STATE → PERSONALITY RESPONSE (never timer → random audio)

The Flow Moment Engine publishes a read-only `gei:flow-event` stream (`tap`, `combo`, `day`, `fail`, `level`, `start`). The trigger engine turns what the player just did into a *kind* of moment:

| kind | seen when | phrases (rarity) |
|---|---|---|
| `burst` | sudden acceleration vs the player's own pace | Who Gave You All That Power? (rare) · Look at You Go · You're Making This Look Easy (rare) · Look at You Moving Water |
| `flow` | long steady tap run | You're in the Flow · Keep That DAM Flow Moving · Keep It DAM Moving |
| `combo` | combo ≥ 7 | Now That's Some Serious Flow · Now That's What I Call Flow · You're Building Momentum |
| `momentum` | accelerating taps | You're Building Momentum · Keep That DAM Flow Moving |
| `power` | a major element is powered (gate / wheel / factory) | You Just Powered That Up · That's How We Do It in the Flow |
| `clean` | a steady, fast day | Oh, That's DAM Good · Now That's What I Call Flow · Making This Look Easy |
| `streak` | 3+ clean days in a row | The Flow Doesn't Stop · Now That's Some Serious Flow |
| `great` / `impressive` | clean days + big finish | We're Too DAM Good (rare) · That DAM Didn't Stand a Chance (rare) |
| `move` | water moved (early days) | Look at You Moving Water · Oh Yeah, That Water's Moving |
| `start` / `levelup` / `return` | new run, new level, back after a failure | You Came to Flow · Let's Go, DAM-ITE |
| `recover` | first success after a failure | Look at You Go · Keep … Moving |
| `surprise` | success with < 1.2 s left, or absurdly fast | **Well DAM.** (ultra-rare, comic: brief slow-down) |
| `epic` | exceptional level / milestone level → next run | **The Water Knows Your Name.** (ultra-rare signature: flowing-water rings + strips, slow-motion, resume) |
| `idle` | the player returns after a 25 s+ pause | **No Dry Spells Allowed.** (ultra-rare) |

Rarity (weights 60 / 25 / 10 / 1.5; core signature phrases ×1.5; never-heard phrases ×2.2; two rare-or-better phrases are never back to back). Rare phrases need a strong moment; ultra-rare ones exist only for their own special kinds.

## Restraint (all in `config`, nothing hard-coded)

`cooldownMs` per rarity (a rare phrase rests longer) · `minGapMs` · `minTapsBetween` (breathing room) · `maxPerDay` / `maxPerLevel` · no same phrase / no same trigger in a row · a probability per kind ·
`holdMs` (a due comment may wait for the lane, never interrupts) · `milestoneQuietMs` · `minRemMs` (silent in the last 2.5 s of the clock).
Blocked during the failure cinematic, the Level Complete sequence, the final push (2 MORE / ONE MORE) and strong pressure.

## Voice
Priority (smaller wins): 1 failure cinematic · 2 level complete · 3 ONE MORE · 3.5 timer warnings · 4 milestone · 5 achievement/combo · **6 personality** · 7 character reaction. Personality uses a *polite* lane request: it never interrupts or silences any other voice system.

## Visuals
Short, smaller than a milestone word, pinned near the top (never over the controls): pop, ripple rings, tiny particle burst, the player's **currently selected** character (never reset to the default beaver). Signature moments slow the *visual* action (`document.getAnimations` playback rate — game clocks untouched) and resume.

```bash
node tools/v2212-personality/personality-regression.mjs            # wiring select context restraint priority visual safety
```
