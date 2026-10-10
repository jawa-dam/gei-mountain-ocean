# V2.2.17 — DAM BUILDER: FLOW ENGINE

A second, fully interactive game mode next to **TAPLITES ARCADE**. The Builder is a different *interface* onto the **same** six-Day cycle — it owns no progression.

| File | Role |
| --- | --- |
| `dam-builder-v2217.js` | shell: mode selector, Day bar, gauges, sheets (intro / result / workshop), parts store, audio, particle pool, render loop, Arcade integration |
| `dam-builder-days-v2217.js` | the six Day models (deterministic, 20 Hz fixed tick) + their SVG scenes |
| `index.html` | two `<script defer>` lines after `xp-reward-engine-v2216.js` — nothing else changed |

## Modes
`TAPLITES ARCADE | DAM BUILDER` — a pill over Arcade (hidden while a panel / DAM MAP / card is open) and the same selector at the top of the Builder. Opening the Builder from a running Arcade day stops the Arcade clock and puts it back to `ready` — exactly what a page refresh does (the next Arcade tap starts a fresh clock).

## The six-Day cycle (repeats every level)
| Day | Concept | Interaction | Challenge scales with level by… |
| --- | --- | --- | --- |
| 1 Mountain Source / Separation | water follows the open channel and splits at forks | tap forks (◀ · ◀▶ split · ▶) | 1 → 3 forks, 2 → 3 ponds + a drain, more water needed, tighter time |
| 2 Dam Wall / Containment | pressure ∝ depth → thick base | tap wall rows (limited blocks), then FILL | 4 → 7 rows, fewer spare blocks |
| 3 Reservoir / Storage | Δlevel = inflow − outflow | open/close spillway(s) against a rain forecast; stay in the green band | bigger storms, 2 spillways from L4, longer |
| 4 Sluice Gate / Regulation | flow ≈ opening × √head | drag the gate / slider to a target flow band and hold it | 1 → 3 targets, drifting head, tighter band |
| 5 Waterwheel / Mechanical Conversion | power ≈ efficiency × flow; rpm ∝ flow | valve sliders + tap machines to belt them on | 1 → 2 wheels (A small, B large), 1 → 3 machines, overspeed limit |
| 6 Factory / Organized System | a chain: store → regulate → convert → produce | drag from output ● to input ● (or tap, tap) to connect Spring → Reservoir → Gate → Wheel → machines; tune the gate | 2 → 4 machines, inflow dips, tighter clock |

Simplified teaching physics — stated honestly in every intro sheet and result sheet. **Not** an engineering tool.

## Progression & rewards (single authority)
* Level / Day come from the game's ledger (`daysDoneThisLevel()` ← `state.levelFlOz`). Days after the current one are locked; cleared Days can be replayed as practice.
* A cleared **current** Day is paid only by the game's own `awardDay(index)` (pays iff `levelFlOz === index × 111`), after the same preconditions Arcade has. Retry / refresh / re-open / practice replay / mode switch / Arcade-first can never pay twice — the ledger refuses. The Builder then mirrors Arcade's own visuals (`restoreVisualProgress`, `activateStation`, `renderHud`, mill stage on Day 6).
* **Day 6** hands over to the game's `reachOcean()` → Level Complete → Bonus Waterwheel → next level, unchanged. If the player's last mode was the Builder, the next level opens the Builder on Day 1 (a thin wrapper around `beginDay`, only for the `redeemed → beginDay(0)` start, always calls the original first) so the Arcade 6-second clock never times out while they read.
* **Never touched:** purchases, receipts, entitlements, unlocks, payment, reward caps, tap requirements, save format (`SAVE_KEY`), save migration.

## The one new resource — BUILDER PARTS 🔩 (own key `geiDamBuilder.v1`, never FL OZ)
* **Earn:** first Builder clear of each (level, Day) pays **2 + stars** (stars 1–3 ⇒ 3–5). 1★ clear, +1★ first attempt (no retries), +1★ efficiency (Day-specific). Improving stars later pays only the difference. Nothing else pays parts.
* **Spend:** workshop upgrades, 3 levels each, level *n → n+1* costs **6 × (n+1)** parts (6 / 12 / 18): WHEEL BEARINGS (+6 % efficiency, more buckets), RESERVOIR LINING (+10 % capacity), GATE ACTUATOR (finer steps, wider target band). Spend + level are one synchronous write.
* Parts never convert to FL OZ and nothing in the Arcade economy reads them.

## Motion, performance, audio
* Reduced motion: follows the OS preference, with a 🌊/🧊 toggle (persisted). No construction animation, no spray, no CSS animation; the wheel shows a speed-proportional *pose* instead of spinning; gameplay is identical.
* One `requestAnimationFrame` loop that exists only while the Builder is open and the page is visible; the simulation pauses while a sheet is open. Fixed 28-node particle pool (cap 10 on low-power devices, 0 reduced) — no per-burst allocation.
* Audio: short synthesized UI sounds on the game's shared SFX bus; the 🔊 button is the game's single shared mute (`GEI_AUDIO`). The Builder starts no music, no voice, no media element.

## Tests
```bash
node tools/v2217-dam-builder/dam-builder-regression.mjs [wiring|modes|days|failures|rewards|existing|mobile|motion|workshop]
```
Real `index.html` in headless Chromium. Days are solved through real clicks / slider input / pointer drags; `DamBuilder.advance(s)` steps the same fixed-tick model the render loop steps. Test hooks (`DamBuilder.advance`, `def.dbg()`, `_loop`, `_quality`) are read-only/simulation-only and cannot change the ledger — rewards always go through `awardDay`.
