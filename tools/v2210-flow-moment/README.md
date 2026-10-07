# V2.2.10 — Flow Moment Engine

`flow-moment-engine-v2210.js` is one reusable, presentation-only engine (`window.FlowMomentEngine`, alias `GEI_FLOW_MOMENT`) that owns every
"big moment" in the game loop. It never reads or writes progress, FL OZ, XP, purchases or the save; if it is missing or throws, the original
game behaviour runs unchanged.

```
TAP → big callout → combo escalation → PRESSURE (last 5 s) → warnings 4/3/2/1 s
    → saved: calm success language ........................ YOU CONTROLLED THE FLOW!
    → 0: freeze → UH-OH → PRESSURE CRITICAL → HOLD THE DAM → TOO MUCH FLOW → THE DAM IS CRACKING
         → WE HAVE A BREAK → dam break + flood → character reaction → 🌊 THE DAM BROKE! card → 🔄 TRY DAY AGAIN
```

## Hooks (all in `index.html`, all guarded by `window.FlowMomentEngine &&`)

| Game code | Engine call |
|---|---|
| `renderTimer()` | `sync(remainingMs, live)` — pressure state + 4/3/2/1 s warnings (driven by the existing single clock, no second timer) |
| `registerDamIteCombo()` | `combo(n)` — escalating, throttled big words |
| `beginDay()` | `reset()` |
| `flowSegment()` | `dayComplete(index, remainingMs)` — GATE OPEN! / WATERWHEEL POWER! / JUST IN TIME! |
| `reachOcean()` | `success()` |
| `handleDayTimeout()` | `failure({ onCard })` — the state changes stay in the game; the card is shown by `onCard` after the cinematic (falls back to the old instant card if the engine declines) |
| `retryDay()` | `recover()` — drains the flood, restores the dam, frees every timer / node / voice |

## Combo ladder

×2 FLOW COMBO · ×3 HYDRAULIC SURGE · ×4 FLOW STREAK (usually throttled away) · ×5 MAXIMUM FLOW · ×7 PRESSURE BOOST · ×10 DAM-ITE OVERDRIVE · ×12 SUPER SURGE ·
streak 16 FLOW MASTER · 24 HYDRAULIC MASTER · 36 DAM-ITE LEGEND. One word on screen at a time; a higher tier interrupts, a same-tier word waits
`config.calloutGapMs`, the same word has a cooldown.

## Adding a new Flow Moment (future levels)

```js
FlowMomentEngine.register("turbineSpin", { emoji: "🌀", text: "TURBINE SPIN!", tier: 3, top: 30 });   // tier 1–5, "good" or "warn"
FlowMomentEngine.trigger("turbineSpin");
FlowMomentEngine.say("someClipUrlOrId", { pri: FlowMomentEngine.priorities.achievement });          // voice lane
```

## Voice lane

Priority (smaller wins): 1 failure cinematic · 2 level complete · 3 ONE MORE · 3.5 timer warnings · 4 milestone progress · 5 achievement / combo · 6 character reaction (music is ducked through `GEI_AUDIO.voiceBegin/End`, never a voice).
A higher priority interrupts a lower one; a lower one is dropped while a higher one speaks. While a Flow Moment voice speaks, the female narrator
(`GEI_AUDIO.addFemaleGate`) and the achievement director (`voiceBusy()`) are held back; starting a voice silences the narrator / WOW / Beaver / achievement lines.
One shared `<audio>` element is unlocked on the first gesture, so later clips are not blocked by autoplay rules. Mute, hidden tab and the Dam Map zone are respected.

## Failure randomisation (`config`)

Comedy "WHO TURNED THAT WATER ON?!" 15 % · rare events MEGA FLOOD / BEAVER FLOOD / WATERWHEEL CHAOS 4 % each, HYDRANT FLOOD / RESCUE MOMENT 3 % each ·
the same rare event never repeats back-to-back · reaction (swept / jump / grab / dive / float / popup) never repeats · flood direction, water level, rise time,
shake, particle count and weather (none / storm / mist / sun) vary every time. `config.forcePlan = { event, reaction, weather, dir, lines }` pins a plan (tests / demos).

## Mobile / performance

Everything animates `transform` / `opacity`; ≤ 64 pooled particles (34 on ≤ 4-core / ≤ 2 GB devices, none under `prefers-reduced-motion`); the failure card is
anchored to the **viewport** (not the board) with the button outside the shrinkable body, so it is never below the fold; tap-to-skip arms only after the break;
a 20 s watchdog always reaches the card.

```bash
node tools/v2210-flow-moment/flow-moment-regression.mjs            # all suites
node tools/v2210-flow-moment/flow-moment-regression.mjs failure    # one suite: wiring callouts pressure voice failure random safety success
```
