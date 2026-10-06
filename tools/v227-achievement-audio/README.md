# V2.2.7 — Achievement Audio Director

`achievement-audio-director-v227.js` coordinates voice, SFX, music ducking and hydraulic cues for the Level Complete capsule.
The capsule only dispatches `gei:achievement` events (show · badge · xp · fill · message · rise · release · continue · arrive · hide);
the director decides what to hear. MP3 conventions and how to add files: `audio/achievements/README.md`.

* Decision model: context → tier 1–6 (normal / enhanced / approaching 2–3 left / ONE MORE / MILESTONE COMPLETE / rare WOW; starting mix 70/20/8/2 %, WOW cooldown 6 levels, never on ONE MORE or MILESTONE COMPLETE).
* The progress-voice category comes from the exact remaining count (`five-more` only at 5 left …) — randomness only picks the take.
* One voice lane (sequential, priorities, stale lines dropped), SFX layers (≤ 3), synth fallbacks via the game's own `damVoice` / `damNoise`.
* Music: existing master bus ducking (`GEI_AUDIO.voiceBegin/voiceEnd`), master volume + mute respected, never talks over the Beaver / WOW narrators or the Dam Map zone.
* CONTINUE always wins: voice + layers cancelled in ~60 ms, then whoosh and arrival tone.
* Lazy: manifest + HEAD discovery only; an MP3 is fetched when its card needs it; broken / slow files are skipped.

```bash
node tools/v227-achievement-audio/achievement-audio-regression.mjs
```
