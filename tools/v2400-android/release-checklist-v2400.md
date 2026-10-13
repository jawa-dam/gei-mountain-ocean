# V2.4.0 — Android Release Verification Checklist

**Device:** _______________  
**Android version:** _______________  
**Chrome version:** _______________  
**Tester:** _______________  
**Date:** _______________  

---

## 1. Installation & Launch

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1.1 | Install AAB via internal test track | Installs without error | ☐ UNVERIFIED |
| 1.2 | App icon on home screen | Correct TapLites icon, no Chrome badge | ☐ UNVERIFIED |
| 1.3 | Launch from home screen | Opens full-screen, no URL bar (TWA verified) | ☐ UNVERIFIED |
| 1.4 | Splash screen | Brand colors (#06070d), centered icon | ☐ UNVERIFIED |
| 1.5 | Status bar color | Matches theme (#06070d) | ☐ UNVERIFIED |
| 1.6 | Navigation bar color | Matches theme (#06070d) | ☐ UNVERIFIED |

## 2. Core Gameplay (All Six Days)

| # | Test | Expected | Result |
|---|------|----------|--------|
| 2.1 | Day 1 — Mountain loads | Terrain renders, taps register | ☐ UNVERIFIED |
| 2.2 | Day 2 — Dam loads | Dam structure renders, hydraulic sim runs | ☐ UNVERIFIED |
| 2.3 | Day 3 — Millpond loads | Water body renders, interaction works | ☐ UNVERIFIED |
| 2.4 | Day 4 — Sluice Gate loads | Gate mechanism renders and operates | ☐ UNVERIFIED |
| 2.5 | Day 5 — Waterwheel loads | Wheel animation runs, BONUS FLOW works | ☐ UNVERIFIED |
| 2.6 | Day 6 — Factory loads | Factory scene renders, DAM MACHINE works | ☐ UNVERIFIED |
| 2.7 | Day completion rewards | XP, FL OZ, Builder Parts awarded correctly | ☐ UNVERIFIED |
| 2.8 | Day cycling (1→2→…→6→1) | Repeats after Day 6, exactly-once per cycle | ☐ UNVERIFIED |
| 2.9 | DAM MAP navigation | All days accessible from map | ☐ UNVERIFIED |
| 2.10 | TAPLITES ARCADE | Mini-games load and play correctly | ☐ UNVERIFIED |

## 3. 3D Premium Rendering

| # | Test | Expected | Result |
|---|------|----------|--------|
| 3.1 | WebGL available | Three.js scene initializes (Chrome on Android) | ☐ UNVERIFIED |
| 3.2 | Premium 3D scenes load | Per-Day atmosphere, materials, lighting | ☐ UNVERIFIED |
| 3.3 | SVG fallback | Disable WebGL → SVG renders correctly | ☐ UNVERIFIED |
| 3.4 | Frame rate | Smooth animation (target 30+ FPS) | ☐ UNVERIFIED |
| 3.5 | No texture errors | Console free of WebGL texture warnings | ☐ UNVERIFIED |

## 4. Audio

| # | Test | Expected | Result |
|---|------|----------|--------|
| 4.1 | Audio plays after first tap | AudioContext resumes on user gesture | ☐ UNVERIFIED |
| 4.2 | Background music | Soundtrack plays during gameplay | ☐ UNVERIFIED |
| 4.3 | Sound effects | Tap sounds, reward sounds play | ☐ UNVERIFIED |
| 4.4 | Voice clips | Character voice lines play | ☐ UNVERIFIED |
| 4.5 | Audio mute/unmute | Toggle works, state persists | ☐ UNVERIFIED |
| 4.6 | Audio on app switch | Pauses when backgrounded, resumes on return | ☐ UNVERIFIED |

## 5. Orientation & Display

| # | Test | Expected | Result |
|---|------|----------|--------|
| 5.1 | Portrait orientation locked | App does not rotate to landscape | ☐ UNVERIFIED |
| 5.2 | Safe-area rendering | Content not obscured by notch/cutout | ☐ UNVERIFIED |
| 5.3 | Touch targets | All buttons tappable, no overlap | ☐ UNVERIFIED |
| 5.4 | Text legibility | All text readable at default font size | ☐ UNVERIFIED |
| 5.5 | Viewport scaling | No horizontal scroll, content fits screen | ☐ UNVERIFIED |

## 6. Persistence & Save Data

| # | Test | Expected | Result |
|---|------|----------|--------|
| 6.1 | Progress saves | Complete a day, kill app, reopen → progress kept | ☐ UNVERIFIED |
| 6.2 | FL OZ balance persists | Earn FL OZ, close app, reopen → balance correct | ☐ UNVERIFIED |
| 6.3 | Builder Parts persist | Earn parts, close app, reopen → parts correct | ☐ UNVERIFIED |
| 6.4 | Unlocked characters persist | Unlock character, close app, reopen → still unlocked | ☐ UNVERIFIED |
| 6.5 | App update preserves data | Update to new version → save data intact | ☐ UNVERIFIED |

## 7. Purchases (Sandbox/Test Track)

| # | Test | Expected | Result |
|---|------|----------|--------|
| 7.1 | Store UI displays | In-app purchase flow shows products and prices | ☐ UNVERIFIED |
| 7.2 | FL OZ single pack ($6) | Purchase completes, 1 FL OZ credited | ☐ UNVERIFIED |
| 7.3 | FL OZ ten pack ($12) | Purchase completes, 10 FL OZ credited | ☐ UNVERIFIED |
| 7.4 | FL OZ twenty-five pack ($18) | Purchase completes, 25 FL OZ credited | ☐ UNVERIFIED |
| 7.5 | Special character purchase | Character unlocked after purchase | ☐ UNVERIFIED |
| 7.6 | Duplicate purchase blocked | Re-purchasing non-consumable shows already owned | ☐ UNVERIFIED |
| 7.7 | Entitlement persistence | Purchase, kill app, reopen → entitlement intact | ☐ UNVERIFIED |
| 7.8 | Purchase receipt recorded | Server ledger records the transaction | ☐ UNVERIFIED |

## 8. Network & Error Handling

| # | Test | Expected | Result |
|---|------|----------|--------|
| 8.1 | Airplane mode (mid-game) | Game continues (localStorage), purchases fail gracefully | ☐ UNVERIFIED |
| 8.2 | Slow connection (3G) | Game loads (may be slow), no JS errors | ☐ UNVERIFIED |
| 8.3 | CDN audio failure | Game plays without audio, no crash | ☐ UNVERIFIED |
| 8.4 | Purchase during network loss | Error message shown, no phantom credits | ☐ UNVERIFIED |
| 8.5 | Reconnection recovery | Restore network → purchases/audio resume | ☐ UNVERIFIED |

## 9. Accessibility

| # | Test | Expected | Result |
|---|------|----------|--------|
| 9.1 | TalkBack navigation | Key UI elements announced | ☐ UNVERIFIED |
| 9.2 | Font scaling (200%) | UI remains usable at large text | ☐ UNVERIFIED |
| 9.3 | Color contrast | Text meets WCAG AA against backgrounds | ☐ UNVERIFIED |
| 9.4 | Touch target size | Minimum 48×48dp for interactive elements | ☐ UNVERIFIED |

## 10. Performance

| # | Test | Expected | Result |
|---|------|----------|--------|
| 10.1 | Cold start time | App usable within 5 seconds | ☐ UNVERIFIED |
| 10.2 | Memory usage | Stable during gameplay (no unbounded growth) | ☐ UNVERIFIED |
| 10.3 | Battery drain | No abnormal battery usage during play | ☐ UNVERIFIED |
| 10.4 | Background behavior | App suspends cleanly, no background CPU | ☐ UNVERIFIED |

## 11. Signing & Distribution

| # | Test | Expected | Result |
|---|------|----------|--------|
| 11.1 | AAB signed with upload key | `jarsigner -verify` passes | ☐ UNVERIFIED |
| 11.2 | Digital Asset Links | `assetlinks.json` serves correctly at `/.well-known/` | ☐ UNVERIFIED |
| 11.3 | TWA verification | No URL bar visible (DAL verified by Chrome) | ☐ UNVERIFIED |
| 11.4 | Play Console upload | AAB accepted by Google Play Console | ☐ UNVERIFIED |
| 11.5 | Internal test install | Installs from Play Store internal track | ☐ UNVERIFIED |

## 12. Play Store Requirements

| # | Requirement | Status |
|---|-------------|--------|
| 12.1 | Privacy policy URL accessible | ☐ UNVERIFIED |
| 12.2 | Data safety questionnaire completed | ☐ NOT SUBMITTED |
| 12.3 | Content rating (IARC) completed | ☐ NOT SUBMITTED |
| 12.4 | Target API level ≥ 35 | ☐ UNVERIFIED |
| 12.5 | 64-bit support | ☐ N/A (TWA — Chrome handles this) |
| 12.6 | Deceptive behavior declaration | ☐ NOT SUBMITTED |
| 12.7 | App bundle (AAB, not APK) | ☐ UNVERIFIED |
| 12.8 | Store listing complete (title, description, screenshots, icon, feature graphic) | ☐ DRAFT READY |

---

**Summary:** _____ / 62 items verified  
**Blocking issues found:** _____  
**Ready for publication:** ☐ YES / ☐ NO
