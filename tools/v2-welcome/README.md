# V2.1.90 — Beaver-first welcome regression harness

Loads the real `index.html` in headless Chromium (desktop, Pixel 7, iPhone 13) and walks the
V2.1.90 test matrix: new visitor (Beaver active, welcome instead of the guide, BEGIN works),
CHOOSE ANOTHER PLAYER (Wilbert selectable and persisted), X / checkbox dismissal
(`localStorage.geiWelcomeDismissed = "true"`, survives refresh and a fresh browser context),
returning visitor (opens directly, gameplay taps never reopen it), and Profile →
👋 WELCOME AGAIN (review mode; save and dismissal untouched).

```bash
node tools/v2-welcome/welcome-regression.mjs
```

Offline: every non-local request is blocked. Prints a JSON report; exits non-zero on failure.
