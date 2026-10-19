/* DAM MAP ⇄ STEM LAB navigation regression (V2.2.20).
 * Background: tapping a region pill on the DAM MAP opens the Engineering World lab (`#stmLab`, a modal dialog laid over the whole map shell, engineering-world-v22.js). The lab's own
 * "←" (`#stmClose`, aria-label "Back to the DAM Map") sits in the same top-left corner as the map's "← BACK" (`#geiMapBack`). Older suites (cameo F4 / harness) clicked the map's BACK
 * straight after a region pill and failed: "<button id=stmClose> … intercepts pointer events". The overlap is by design (a modal sits above the map) — what must hold is:
 *   N1 the map's BACK is reachable (≥ 44 px, hit-testable, on screen) when the map is open and no lab is
 *   N2 a region pill opens the lab; the lab's close control is reachable (≥ 44 px, hit-testable, on screen); while the lab is open the thing under the map-BACK point is the lab (never a dead zone)
 *   N3 closing the lab (its ← or Escape) returns to the SAME open map — it never navigates away — and the map's BACK is reachable again
 *   N4 the map's BACK closes the map
 *   Both controls are kept and neither is hidden or has pointer-events disabled by this test's expectations.
 *   node tools/v2-dam-map/map-stem-navigation-regression.mjs
 */
import { boot, sleep, done } from "../v2217-dam-builder/harness.mjs";
let passed = 0, failed = 0;
const check = (n, ok, d) => { if (ok) { passed++; console.log("  ✓ " + n); } else { failed++; console.log("  ✗ " + n + (d !== undefined ? "\n      " + JSON.stringify(d).slice(0, 500) : "")); } };
const seed = JSON.stringify({ version:2, level:1, levelFlOz:222, totalFlOz:1222, completedLevels:0, loopCount:0, currentStep:2 });
const probe = h => h.page.evaluate(() => {
  const vw = innerWidth, vh = innerHeight, out = {};
  for (const [k, id] of [["back", "geiMapBack"], ["close", "stmClose"]]) {
    const e = document.getElementById(id); if (!e) { out[k] = null; continue; }
    const r = e.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, hit = document.elementFromPoint(cx, cy), vis = r.width > 0 && r.height > 0;
    out[k] = { w:Math.round(r.width), h:Math.round(r.height), onScreen:vis && r.left >= -1 && r.top >= -1 && r.right <= vw + 1 && r.bottom <= vh + 1, hitSelf:!!hit && (hit === e || e.contains(hit)), hitInLab:!!hit && !!hit.closest("#stmLab"), hitId:hit && (hit.id || hit.className || hit.tagName) };
  }
  const lab = document.getElementById("stmLab");
  out.labOpen = !!lab && lab.classList.contains("show") && getComputedStyle(lab).display !== "none"; out.mapOpen = document.getElementById("geiDamMapPage").classList.contains("show");
  return out;
});
for (const [w, hh, label] of [[390, 844, "390×844"], [360, 640, "360×640"], [320, 568, "320×568"], [844, 390, "844×390 landscape"], [667, 375, "667×375 landscape"]]) {
  const h = await boot({ query:"?b3d=off", viewport:{ width:w, height:hh }, storage:{ "yalltooDamGame.v2":seed } });
  await h.page.tap("#damMapLauncherBtn"); await sleep(900);
  let p = await probe(h);
  check(label + " N1: map open; BACK reachable (≥ 44 px, on screen, hit-testable)", p.mapOpen && !p.labOpen && p.back.h >= 43.5 && p.back.w >= 43.5 && p.back.onScreen && p.back.hitSelf, p);
  const pill = await h.page.$("#geiMapRegions .dmwPill[data-i='2']"); await pill.scrollIntoViewIfNeeded(); await pill.tap(); await sleep(700);
  p = await probe(h);
  check(label + " N2: region pill opens the lab; its ← is reachable (≥ 44 px, on screen, hit-testable)", p.labOpen && p.close && p.close.h >= 43.5 && p.close.w >= 43.5 && p.close.onScreen && p.close.hitSelf, p);
  check(label + " N2b: while the lab is open the map-BACK point is covered by the lab itself (modal), not by anything else", p.back.hitInLab, p.back);
  await h.page.tap("#stmClose"); await sleep(500);
  p = await probe(h);
  check(label + " N3: ← closes the lab only — the same map is still open and its BACK is reachable again", !p.labOpen && p.mapOpen && p.back.hitSelf && p.back.onScreen, p);
  await pill.tap(); await sleep(500); await h.page.keyboard.press("Escape"); await sleep(400);
  p = await probe(h);
  check(label + " N3b: Escape closes the lab only (map stays open)", !p.labOpen && p.mapOpen, p);
  await h.page.tap("#geiMapBack"); await sleep(500);
  p = await probe(h);
  check(label + " N4: BACK closes the map", !p.mapOpen && !p.labOpen, p);
  check(label + ": no page errors", h.errors.length === 0, h.errors);
  await h.close();
}
console.log("\n" + passed + " passed, " + failed + " failed");
await done(); process.exit(failed ? 1 : 0);
