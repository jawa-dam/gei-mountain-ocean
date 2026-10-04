# V2.2.2 — UNIVERSAL DAM VIEW (`dam-view-v222.js`)

"Same game. Same composition. Same proportions. Any screen." The display engine for the DAM Map experience
(map + STEM labs + FOLLOW THE WATER). It does not touch the main tap game's layout.

| Concern | What it does |
|---|---|
| Visible viewport | Stage height/width come from `visualViewport` (`--dam-vw/--dam-vh`), not `100vh`, so Chrome's URL bar / gesture bar can never crop the top or bottom of the map |
| Fit modes | `data-dam-fit="mobile" · "mobile-land" · "tablet" · "desktop"`, plus `data-dam-orient`, `-narrow`, `-h560/-h620/-tall`. Rotate / resize / fullscreen only re-layout: no reload, no reset |
| Desktop site | Chrome's "Desktop site" lays a phone out ~980px wide. Detected (`data-dam-desktop-site=1`), the stage is zoom-compensated back to a phone-sized composition and the phone CSS rules are re-applied by attribute (media queries still see 980px) |
| ⛶ FULL MAP | Fullscreens only `#geiDamMapPage` (Fullscreen API). Immersion layout hides stats + factory rail; exit (button / system gesture / BACK) restores everything. Hidden where the browser can't (iPhone Safari) |
| Safe areas | `env(safe-area-inset-*)` padding on the stage (`viewport-fit=cover` was already set) |
| No clipping | Header title one line, stat labels wrap, lab titles wrap, Wilbert's bubble grows, station pills hang from the bottom edge, GEI card type floored at ~10.5px |
| Container queries | The STEM lab's narrow-screen rules use `@container` on the lab, so they follow the stage, not the window |

Presentation only: no storage, no game state, no FL OZ / XP / STEM XP / purchases.

## 🧪 DAM VIEW TESTER

```bash
node tools/v222-dam-view/dam-view-tester.mjs          # SHOTS=dir for screenshots, ONLY=412x915 for one viewport
```
Viewports 320×568 … 1920×1080 (incl. 412×766 = Chrome with its URL bar, and 720×1600) × NORMAL · LANDSCAPE (rotated in
place) · DESKTOP SITE (phones) · FULLSCREEN, on five screens (map, lab, decision, cutaway, hub). In the browser console,
`__GEI_DAM_VIEW__.audit()` runs the same audit on whatever is on screen:
🔴 clipped / truncated / offscreen / overlap / unreadable (<10px) · 🟡 tap target <44px · 🟢 pass.
