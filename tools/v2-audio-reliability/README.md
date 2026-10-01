# V2.2.03 — DAM-ITE Audio Reliability regression harness

Loads the real `index.html` in headless Chromium (offline: every non-local request is blocked) and
drives the real voice chain — V2.1.93 milestone engine → V2.1.94 Voice Director → V2.1.95–V2.2.02
layers → `dam-ite-audio-reliability-v2203.js`.

The hosted MP3 CDN is unreachable from the harness, so an init script replaces `<audio>` with a
scripted media layer that behaves like Chromium's (pending `play()` that `pause()` rejects with
`AbortError`, `ended` after the clip, media errors for failing URLs) and counts how many clips are
audible at once. **Real MP3 download/decoding is browser-only and is not verified here.**

- **R** registry: the 14 hosted MP3 URLs, exactly as in the Director source; V2.1.93 copy agrees
- **S** the six core stations resolve to the Female pack, then the Male pack
- **N** Random resolves to both real packs; Factory normal + excited both reachable
- **P** the same clip replays twice; a mid-flight replay of the same element never sticks
- **T** rapid Showcase replay taps never overlap; switching voice silences the old voice
- **O** a milestone level card plays one clip at a time (V2.1.93 defers to the Director)
- **F** failed play → speech fallback; media load error → one retry → `load-failed`
- **I** Showcase replay → Voice Discovery → Voice Rewards (live, no reload); soundtrack ducking
- **D** `GEI_VOICE_AUDIO_DIAGNOSTICS` report/selfTest/probe, idle warm-up, no new script errors

```bash
node tools/v2-audio-reliability/v2203-audio-reliability-regression.mjs
```
