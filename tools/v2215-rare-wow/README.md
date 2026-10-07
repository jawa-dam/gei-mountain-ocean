# V2.2.15 — Rare WOW Moment Engine regression

`node tools/v2215-rare-wow/rare-wow-regression.mjs [wiring|verify|scoring|memory|stage|priority|debug|safety]`

Real `index.html` in headless Chromium, offline (the ten supplied MP3s are answered with a generated WAV; chosen URLs can be answered 404).

| group | covers |
|---|---|
| W1 wiring | exact clip URLs, priority (STEM < achievement < WOW < personality), four tiers, `triggerRareWow`, no debug UI |
| W2 verify | every clip loads; a `.mp3t` reference is repaired + reported |
| W3 scoring | TESTS 1–6: normal tap · good combo · exceptional combo · water surge · power · near-failure recovery |
| W4 memory | TEST 9: cooldown, taps-between, history, no repeated phrase/category, caps, persisted memory |
| W5 stage | phases, text, character, five portrait viewports, TEST 10 audio OFF, TEST 12 reduced motion |
| W6 priority | queues behind / never interrupts other voices, ONE MORE interrupts it, TESTS 7–8, STEM → WOW layering, personality yields, deferral of last-station moments |
| W7 debug | `triggerRareWow(tier)` and each of the ten phrases; memory untouched |
| W8 safety | a whole level with WOW made easy; failure cinematic untouched |

Debug (console only): `triggerRareWow("common"|"rare"|"epic"|"ultra")`, `triggerRareWow("damWild")`, `RareWowMomentEngine.debug.list()`.
Real-device check with the real MP3s remains manual.
