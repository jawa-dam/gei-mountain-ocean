# V2.2.14 — STEM Intelligence Engine regression

`node tools/v2214-stem/stem-regression.mjs [wiring|verify|events|game|restraint|collide|visual|mastery|safety]`

Runs the real `index.html` in headless Chromium (offline; the supplied MP3s are answered with a generated WAV, chosen URLs can be answered 404).
Covers: clip URLs / STEM_EVENT types / priority (S1), `.mp3t` detection + repair + loud reporting (S2), event→concept→voice per STEM event (S3),
game moment→STEM event mapping (S4), restraint: one voice per burst, cooldowns, caps, mastery pacing by level (S5), collisions with milestone /
cinematic / level-complete / transition / final push + visual-before-voice (S6), labels on 5 viewports + reduced motion (S7), hidden mastery
tracking without XP/economy writes (S8), audio OFF/ON, a full level, failure cinematic untouched, retry→experiment (S9).

Priority lane: failure 1 · level complete 2 · ONE MORE 3 · milestone 4 · next challenge 4.5 · **STEM 4.8** · achievement 5 · personality 6 · reaction 7.
Real-device check with the real zyrosite MP3s (esp. `more-flow-more-power`) is still a manual step; `StemIntelligenceEngine.verify()` / `.diagnostics()` do it at runtime.
