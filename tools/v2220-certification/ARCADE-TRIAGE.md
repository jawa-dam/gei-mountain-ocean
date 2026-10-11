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
| 15 | ambient | P3, P4, 6a | Pre-existing (P3/P4 = addStyle); 6a undiagnosed | 3/3 runs on both sides: 105 pass / 3 fail. **Flaky, both sides:** 1b (3 of 8 runs, base and current), **5b failed once on current (1 of 5 runs), 0 of 5 on baseline, 0 of 3 in the re-runs** — inconclusive, treated as timing flake (random cameo timer). |
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
