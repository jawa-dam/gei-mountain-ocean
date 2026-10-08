# V2.2.16 — XP Reward Engine

`xp-reward-engine-v2216.js` — a **presentation-only** celebration layer: *action → XP appears → flows into the XP dam (HUD counter) → counter ticks + reservoir fills → N XP LOCKED IN → back to play.*

XP / Flow Points are **FL OZ** in this game. The economy (`safeAddFlOz`, `awardDay`, Bonus Waterwheel, DAM Machine) stays the only authority. After an award is committed, `announceXP()` in `index.html` broadcasts a read-only `gei:xp-event` with the amount that was actually added; the engine only listens. Purchases are never announced (money is not "earned XP").

```js
XPRewardEngine.showEarnedXP({ amount: actualAwardedXP, source: "WATERWHEEL" });   // amount must be the authoritative number
XPRewardEngine.showFlowPoints({ amount, source: "BONUS" });
XPRewardEngine.showReward({ label: "NEW SONG" });  XPRewardEngine.showRewardSecured({ label: "SONG" });
```

* **Classification** (not random): `XP_GAIN · XP_MAJOR · XP_COMBO · XP_STACK · XP_THRESHOLD · XP_FLOW · XP_SKILL · XP_LOCKED · REWARD_EARNED · REWARD_SECURED · FLOW_POINTS_EARNED · MAJOR_REWARD` → the ten supplied clips, chosen from source, FlowMoment streak, reservoir marks (50% / 75%), and totals crossing the 6,660 unlock price.
* **Tiers**: 1 micro (silent) · 2 standard · 3 stacked · 4 major · 5 reward · 6 secured · 7 major flow reward.
* **Batching**: awards within ~0.4 s merge into one number (`+10 ×4 → +40 XP · XP STACK ×4`) and at most one voice.
* **No spam**: per-tier voice gaps, per-level caps, a 50% chance on standard gains, phrase memory (never the same phrase twice in a row, nor within 45 s).
* **Audio**: one polite request on the shared FlowMoment voice lane (WOW 5.5 < major reward 5.6 < lock-in 5.7 < XP earned 5.8 < personality 6) — the lane's own smooth music ducking. Waits for STEM / WOW / any other voice; silent over the Dam Failure, Level Complete and Next Challenge sequences. Audio OFF → no audio request at all.
* **Reduced motion**: no flight, no particles; number, counter update and LOCKED IN still show.
* **Debug (dev hosts / `?xpdebug=1` only)**: `testXPReward(10|37|111|666)`, `testXPStack()`, `testXPLock()`, `testRewardSecured()`, `testFlowPointsSecured()`, `testMajorReward()`, `testXPAudio("xpEarned")` (omit the id to list clips). Debug events carry no balance and never touch the economy.

```bash
node tools/v2216-xp-reward/xp-reward-regression.mjs [wiring|classify|batching|audio|sequencing|visuals|economy]
```
