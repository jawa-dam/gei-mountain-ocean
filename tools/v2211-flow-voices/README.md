# V2.2.11 — Milestone Progress Engine + Level Complete Voice Engine

`flow-moment-voices-v2211.js` adds two small engines on top of the Flow Moment Engine (v2.2.10). They reuse its single voice lane, big water-flow words, environment and
victory sequence, and own no game state (no progress / FL OZ / XP / save access).

```
tap → 5 MORE!  (one phrase)  → 4 MORE! → 3 MORE! → 2 MORE! → ONE MORE!  (peak anticipation)
        success → stabilise → controlled release → wheel reacts → ONE victory voice → LEVEL COMPLETE! → card (rewards · XP · unlocks · CONTINUE)
        timer 0 → Dam Failure Cinematic ("SO CLOSE" if it follows ONE MORE)
```

## MilestoneProgressEngine (`window.MilestoneProgressEngine`)

* Hook (index.html tap handler): `onProgress({ remaining, required, key, remMs })`. Each remaining-count (5…1) fires once per objective (`key`); `gei:flow-reset` (new day / retry) re-arms it.
* ONE clip per announcement from that milestone's pool (4/3/3/3/3), never the same clip twice in a row. "The Dam Is About to Break" is playful and withheld when the clock has < 1.8 s left.
* Words: `5 MORE!` … `ONE MORE!` + the spoken phrase underneath + water-flow strip; larger type at 2 / 1; the combo word for the same tap is absorbed as the small line.
* Environment (`FlowMomentEngine.setFlowLevel(1..5)`): resting flow band, ambient droplets (more + faster each step), at ONE MORE a gold anticipation pulse + faint tremor. Cleared on success, failure and every new day.
* Anti-noise: ordinary milestone voices ≥ 1.8 s apart and never over another voice; ONE MORE may follow after 0.7 s and always outranks them (fast tappers hear 5 MORE and ONE MORE, slow tappers hear all five). `config` is tunable.

## LevelCompleteVoiceEngine (`window.LevelCompleteVoiceEngine`)

* `pick(perf)` → one of 11 phrases, from `FlowMomentEngine.levelPerf()` (first completion, best combo streak, fastest day, failures this level, repeat). Categories: celebration (You Did It · Boom) · mastery (Mastered · Like a Pro) · flow (Flow Complete · Clean Flow · How You Move Water · Another One) · encouragement (Getting Good · Keep Moving) · casual (In the Bag).
  first → *You did it, DAM-ITE!* · high combo → mastery · fast → *Boom! Level cleared!* · clean → *That's a clean flow!* · struggled → encouragement · repeat → *Another one in the flow* · normal → varied.
* Weighted, not uniform; never the same phrase twice in a row (history also kept for the session). `speak(pick)` uses priority 2 (only the failure cinematic outranks it) and the achievement director skips its own level-complete line when this one spoke.

```bash
node tools/v2211-flow-voices/flow-voices-regression.mjs            # wiring select live priority arc victory level safety
```
