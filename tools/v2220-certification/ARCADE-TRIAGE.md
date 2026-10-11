# V2.2.20 follow-up — Arcade regression-suite triage (PR #43, draft)

**Method.** Baseline = commit `d467a61` (the last commit before any DAM BUILDER code) checked out in a separate worktree. Every Arcade suite was run **twice on the current branch and twice on the baseline** by `triage.mjs`; the *names* of the failing checks were extracted from the raw output and compared (raw outputs: `results/triage/`). Suites that differed between repeats were re-run 3–5 more times per side (`results/triage-flake*/`).

**What differs between baseline and this branch.** `git diff d467a61 HEAD` touches exactly one pre-existing file: `index.html` (+2 `<script defer>` lines for the Builder). Everything else is new files (Builder shell/days/3D bundle, `dam3d/`, test tooling). The Builder writes no purchase, receipt, entitlement or save-format state (static grep of the shell and Day files; E4 reward suite checks counts at run time) and does not appear in the Arcade save-key list (quiet-tap 9b shows 7 keys, none of them `geiDamBuilder.v1`).

## Result: no remaining Arcade failure is caused by the Builder
17 suites fail on this branch. All 17 fail on the baseline with the **same failing checks**; the only differences are the timing-flaky checks listed below, which also flake on the baseline. One Arcade regression *was* found earlier in this PR (the mode selector covering the tap area on 320×568; fixed in `d6a3173`, `flow-voices` 57/0 again).

| # | Suite | Failing checks (stable) | Classification | Root cause (evidence) |
|---|---|---|---|---|
| 1 | economy-chaos | C17 | **Pre-existing test-fixture defect — fixed** | The "authoritative repair" re-spread the drifted record over the clean one, so `flOz:1` was never repaired; `recover()` correctly answered `DRIFT_REMAINS`. Identical on baseline; `api/_lib` untouched. Fixture now restores `flOz`; assertions unchanged. 18/18. |
| 2 | regression-gate | C17 (via #1) | same | Wraps #1. Now PASS. |
| — | security-certification (not in the 16) | parse error | **Pre-existing tooling defect — fixed** | Parsed only the last line of the gate's pretty-printed JSON (`}`), so it could never succeed (also failing on baseline). Now parses the final JSON object → CERTIFIED 16/16. **Caveat:** its checks C01–C09 are hard-coded `true`, so that certificate is weaker than its name implies. |
| 3 | adaptive-voice | `new-player pacing` | Pre-existing stale test | Greps source for `maturity==="new"`; the unchanged source no longer contains it. |
| 4 | contextual-voice | `presentation-only` | Pre-existing stale test | Source-text regex for wording that is not in the unchanged file. |
| 5 | voice-reactions | `presentation-only` | Pre-existing stale test | same |
| 6 | voice-rewards | `presentation-only boundary` | Pre-existing stale test | same |
| 7 | voice-showcase | `accessible dialog` | Pre-existing stale test | Expects `aria-label="DAM-ITE Voice Showcase"` literal. |
| 8 | voice-ui | `Female default` | Pre-existing stale test | Expects `DEFAULT_MODE="female"` literal. |
| 9 | milestone-voice | `female voice fallback` | Pre-existing stale test | Expects `pitch = 1.14` in source. |
| 10 | voice-event-vocabulary | A1, A3, A8, B1, B23 | Pre-existing stale test | Asserts exactly 38 recordings; the asset list is 49. |
| 11 | quiet-tap | 6d, 9b | Pre-existing stale test | 9b expects a single save key; the game now stores 7. 6d snapshots `localStorage` and the DAM MAP now writes `geiBeaverVoice.v1` (visit memory); `state` itself is unchanged. |
| 12 | dam-map | G2, G3, G4 | Pre-existing: feature absent / stale test | Expects a "DAM MAP MILESTONE 01 · GRISTMILL ONLINE" screen after level 6; that text exists nowhere in the repo. |
| 13 | welcome | A12, C6 | **Pre-existing product defect (not fixed)** | `ReferenceError: addStyle is not defined` at load. |
| 14 | cameos | A8, D7, F2, harness | Pre-existing product defect (addStyle → A8/D7) + overlay defect (not fixed) | F2/harness: the stem layer's `#stmClose` button intercepts clicks on the DAM MAP's `#geiMapBack` (17 covered controls). |
| 15 | ambient | P3, P4, 6a | Pre-existing (P3/P4 = addStyle); 6a undiagnosed | 3/3 runs on both sides: 105 pass / 3 fail. **Flaky, both sides:** 1b (3 of 10 runs: 2 baseline, 1 current), **5b failed once on current (1 of 5 runs), 0 of 5 on baseline, 0 of 3 in the re-runs** — inconclusive, treated as timing flake (random cameo timer). |
| 16 | flow-moment | F3c | Pre-existing, undiagnosed | 56/1 on both sides in every run. |
| 17 | soundtrack | 1–4 timing-dependent idle-audio checks | **Flaky test, both sides** | Same patterns (1f, 2f, 3f, 4f) on baseline and current across 10 runs each; the 4-failure outcome occurred on both. |

### The `addStyle` defect (not fixed — decision needed)
`tap-lites-reward-moments-v2178.js:184` calls `addStyle()` in `startup()`, but the function does not exist anywhere in that file, so the module throws after `R.started=true` and never finishes initialising (no listeners, no public API). It is the reason six "no page errors" checks fail across welcome/cameos/ambient. A one-line fix would **activate a feature that has never run in production** (new pointer listener and visuals), so it is not a "test-silencing" fix and I left it for the owner. The original authors list it as `KNOWN_BROKEN` in the dam-map suite.

## Gates re-run on this commit (headless Chromium, software GL)
| Gate | Result |
|---|---|
| Builder certification gate (18 suites) | 415 assertions, 0 failures, no retries needed this time (`results/followup-builder-gate.log`) |
| SVG / 3D components / chain, six-Day e2e / Day 1+6 rewards / fallbacks / mobile | all inside the 18 above, all pass |
| economy-chaos, regression-gate, security-certification | PASS (18/18, PASS, CERTIFIED 16/16) |
| XP-reward 83, next-challenge 45, personality 57, stem 60, rare-wow 51, flow-welcome 80, victory-capsule 91, achievement-audio 29, flow-voices 57, voice-director/discovery/memory | pass |
| The 17 failing suites above | fail identically to baseline (table) |

## Still open (not satisfiable here)
Android real-device measurements (FPS, load time, memory, touch, context recovery) — **UNVERIFIED**; deployment / CI — **UNVERIFIED** (no checks attached to the PR); the `addStyle` decision; undiagnosed baseline failures (ambient 6a, flow-moment F3c, dam-map milestone).

---

# Follow-up 2 — root causes found, fixes made, what is still open (this supersedes the "Classification" column above)

The first triage said "identical on the baseline ⇒ pre-existing". That is true but it was not enough: most of those failures had a concrete cause, several hid other failures (a crash or an `assert` throw stops a suite at the first problem), and some were real product defects. Each suite was reproduced and diagnosed.

## Product defects found and fixed
| Defect | Evidence | Fix |
|---|---|---|
| `tap-lites-reward-moments-v2178.js` called an undefined `addStyle()`; its style function is `css()` | `ReferenceError` at load; module never initialised (no card, listener or API) since V2.1.78 (until `a9526bf` it did not even parse, which masked it) | `css()`. New `tools/v2178-reward-moments` (18 assertions): loads clean, the 10/20/30/40/50 streak moments, resets, ignores buttons, never intercepts input, real Day 1 pays +111 with the module present **and** blocked (identical economy). Fails when the fix is reverted. |
| DAM MAP cameos drawn over the region pills on wide screens | `mapPlace()` assumed the pill row starts at 88 %; on 1280×800 it starts at ~76 % (2 of 36 forced placements overlapped, up to 81 %) | measure the first pill's top; 0/36 overlap now. Cameos are `pointer-events:none` — visual only. |
| `api/paypal/webhook.js` had its own pack table with the pre-V2.1.13 prices (1 / 3 / 6 USD) | executed: a genuine capture at the canonical 6 / 12 / 18 USD → **500 "PayPal capture validation failed"** | imports `PACKS` from `economy-authority.js` (retired 1.00 price still rejected) |
| `claim-entitlement.js`, `fulfill-entitlement.js`: `claimToken` / `captureID` destructured **inside** `try`, used in `catch` | executed: a drifted record → `ReferenceError: claimToken is not defined`; no incident frozen, no 409 | destructuring moved above `try` |
| `security-certification.mjs` C01–C09 were literals (`true`) and the script could never parse the gate output | read + executed | rebuilt: see below |

**Payment-path change — owner review before any deploy.** Only the three `api/paypal` files above changed (7 insertions, 7 deletions); no pricing, ledger script, entitlement or verification rule changed.

## Per-suite result (the 17 that failed)
| Suite | Root cause | Now |
|---|---|---|
| economy-chaos / regression-gate | C17 fixture's "repair" re-spread the drifted `flOz:1` | fixture fixed → 18/18, gate PASS |
| welcome | `addStyle` (A12, C6) | PASS |
| cameos | `addStyle` (A8, D7); STEM lab modal opened by the region pill sits over the map BACK (test clicked BACK anyway); cameo over pills (F2) | fixed; PASS in the final gate (see "flaky" for D1) |
| dam-map | the milestone screen **exists** (`dam-map-v2170.js`, `geiMapMilestone`); since V2.2.6 the victory capsule delays the hand-off ~3.5 s and since V2.2.11 the card appears after a victory sequence, so the test clicked an invisible card and read the page 500 ms later; plus `KNOWN_BROKEN=4` | test waits for the card and the hand-off; allowance → 0; PASS (26/26) |
| quiet-tap | 9b compared against V2.1.88 (`b2e7691`) so every later save key looked "new"; voice/XP/personality memory keys are presentation memory written on a race; 6d compared key **order** | reference → `d467a61`; those keys are presentation-only; data compared, not order; PASS (32/32 in 3 consecutive runs and in the final gate) |
| flow-moment F3c | read the class in a separate round-trip, racing the game's own 100 ms `sync()` loop | one synchronous evaluate; 57/57 |
| voice-event-vocabulary | 38 → **49** recordings (V2.2.04, per the module header); B23's wrapper walk stopped at the WOW layer (`__orig`); B42 clicked a retired Showcase button on `null`, **aborting the run and hiding B40–B42** | updated from the contract; 77/77 |
| adaptive-voice, contextual-voice, voice-reactions, voice-rewards, voice-showcase, voice-ui, milestone-voice | single source-**wording** regexes (`maturity==="new"`, doc-comment sentences, `aria-label="…"`, `DEFAULT_MODE="female"`, `pitch = 1.14`) | replaced by behaviour in `tools/v2-voice-behavior` (15 assertions): default female in the Director, new/returning pacing with a stubbed contextual engine, 34 voice API calls change no balance/XP/save/receipt, retired Showcase shows nothing, spoken fallback pitch/rate/voice. The old suites only lose the stale regex. |
| ambient | `addStyle` (P3, P4); 6a measured 300 ms after a timeout, but the Try-Again card appears ~7.5 s later | fixed. **1b, 5b, 5d remain random** (see below) |
| soundtrack | timing-dependent idle-audio checks **and** a check that counts console 404s | **unchanged — open** (see below) |

## Still failing, with evidence
* **soundtrack** — fails on the baseline and on this branch at the same rates over 10 runs each: *no console errors introduced* 10/10 vs 10/10 (404s for `/audio/achievements/**` — the V2.2.7 clip files are **not in the repo** while the engine requests them), *autoplay safety* 5/10 vs 4/10, *idle lift* 2/10 vs 2/10, *very long idle settles* 2/10 vs 2/10. Pre-existing; not fixed (needs the audio assets or a different check design).
* **ambient** `1b` (MENU IDLE cameo timing), `5b`, `5d` (random cameo placement vs the CONTINUE button): intermittent. A/B on `5d`: 1/8 with the reward-moments module broken, 1/8 fixed, 0/8 fixed again → independent of the fix. `1b` failed 2/8 baseline, ~5/14 current runs — not shown to differ, not proven equal either. The final full gate failed it once (Pixel 7).
* **Undiagnosed or unfixed product observations:** `showLevelComplete` is wrapped twice by the V2.1.97 / V2.1.98 / WOW layers (a duplicate-wrapper chain; the old B23 could not see it); the PayPal runtime-diagnostic function is dead code whose panel markup is no longer in the HTML (it throws on `null` if called); `/audio/achievements/**` is missing.

## DAM MAP ⇄ STEM lab (the `#stmClose` / `#geiMapBack` report)
Not a layout bug. Tapping a region pill opens the Engineering World lab (`#stmLab`, `aria-modal`, `position:absolute; inset:0` inside the map shell) and its own **←** (`#stmClose`, "Back to the DAM Map") occupies the top-left corner exactly like the map's **← BACK**. The lab covers the map by design; closing it returns to the **same open map**, whose BACK works. `tools/v2-dam-map/map-stem-navigation-regression.mjs` (35 assertions; 390×844, 360×640, 320×568, 844×390, 667×375, touch) pins this: BACK reachable ≥ 44 px; pill opens the lab; ← reachable ≥ 44 px and hit-testable; while open the BACK point belongs to the lab; ← and Escape close only the lab; the map stays open; BACK then closes the map. No control was hidden or had pointer events disabled.

## Security certification (V2.2.20 rebuild)
`node tools/v2-chaos/security-certification.mjs` → **CERTIFIED, 20 checks, 106 assertions** (C01–C09, R01–R03, C10–C16, ISO). C03–C09 execute the **real `api/paypal` handlers and `api/_lib` ledger** against an in-memory Redis and PayPal (`security-lab.mjs`; the four Lua scripts are fingerprint-pinned) — tampered amount / currency / pack / FL OZ / audit / fulfilment id, replay of capture / webhook / claim / fulfil, duplicate credit, incident freeze and recovery without auto-credit. C01, C02, R01–R03 run in the real game page. Exit 0 CERTIFIED · 1 FAILED · 3 INCOMPLETE (anything that could not run, e.g. `SKIP_BROWSER=1`). Mutation checks: original API files → **FAILED** (C03, C04, C06, C07, C09); altered price table → FAILED (C04, C07).
**Not covered (stated in the certificate):** live PayPal / Upstash, webhook signature cryptography, a player editing their own browser save (FL OZ is client-held), hosts other than the test host, rate limiting / endpoint authentication, penetration testing. This is not a comprehensive security certification.

## Final gate on the last commit (headless Chromium, software GL; `results/followup2-final-gate.log`)
Builder gate **18 / 18 suites, 415 assertions, 0 retries**. Arcade + security + new suites: 35 suites, 870 assertions, 33 PASS, 2 FAIL (ambient `1b`, soundtrack — both above). XP-reward 83, next-challenge 45, flow-voices 57, flow-moment 57, personality 57, stem 60, rare-wow 51, flow-welcome, victory-capsule 91, achievement-audio 29, reward-moments 18, voice-behavior 15, map-stem-navigation 35.
Android and deployment remain **UNVERIFIED**.
