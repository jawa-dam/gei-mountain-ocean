# V2.1.93 — DAM-ITE Milestone Voice Announcer

Defines the six milestone voice cues and the timing/priority contract for the achievement announcer.

## Cues
- MOUNTAIN
- DAM
- MILL POND
- SLUICE-GATE
- WATERWHEEL
- FACTORY

## Audio priority
Milestone voice ducks the background soundtrack briefly and never overlaps another milestone voice.

## Asset upgrade path
The runtime file `gei-milestone-voice-v2193.js` is wired now with a browser voice fallback so the feature is testable immediately. Dedicated high-quality female vocal files can later be added to the `VOCALS` file map without changing milestone detection.

## Scope
Presentation/audio only; no gameplay, economy, progression, ownership, or save changes.
