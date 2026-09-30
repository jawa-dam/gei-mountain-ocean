# V2.1.88 — DAM Friendly Soundtrack Director regression harness

Loads the real `index.html` in headless Chromium, drives real gestures, and checks the
soundtrack director against the V2.1.88 checklist (autoplay safety, shared AudioContext,
splash intro → gameplay hand-off, activity mixer, ducking, idle lift ceiling, shuffle bag,
crossfade, pause/resume, toggle + persistence, legacy audio, voice hygiene, hidden-tab
behavior, Android/iOS-sized emulation, no-Web-Audio fallback, console errors vs. baseline).

Offline and presentation-only: every non-local request (PayPal, CDN images) is blocked.

```bash
npm i -D playwright   # once, if Playwright is not already available
node tools/v2-soundtrack/soundtrack-regression.mjs
```

Prints a JSON report and exits non-zero if any check fails.
Safari/WebKit is not exercised here (Chromium only) — verify iOS Safari on a real device.
