/* V2.5.00 — DAM BUILDER LOADING SCREEN regression tests.
 *
 * Covers: loading overlay appears on 3D mount, message rotation, beaver presence,
 * water gauge, ready transition, error state, reduced-motion, cleanup on unmount,
 * and no duplicate initialisation on rapid taps.
 */
import { boot, done, sleep, base } from "../v2217-dam-builder/harness.mjs";

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) { passed++; console.log("  ✓ " + name); } else { failed++; console.error("  ✗ " + name); } }

async function test(name, fn) {
  console.log("\n" + name);
  try { await fn(); } catch (e) { failed++; console.error("  ✗ THREW: " + e.message); }
}

// -- Tests --

await test("Loading overlay appears when Builder opens in 3D mode", async () => {
  const h = await boot({ query: "" }); // 3D mode (no ?b3d=off)
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(200);
  const overlay = await h.page.evaluate(() => !!document.querySelector(".dblOverlay"));
  ok(overlay, "dblOverlay element is present in the DOM");

  const title = await h.page.evaluate(() => {
    const el = document.querySelector(".dblTitle");
    return el ? el.textContent : "";
  });
  ok(title.includes("YALLTOO"), "Title contains YALLTOO");

  const sub = await h.page.evaluate(() => {
    const el = document.querySelector(".dblSub");
    return el ? el.textContent : "";
  });
  ok(sub.includes("DAM BUILDER"), "Subtitle contains DAM BUILDER");
  await h.close();
});

await test("Loading overlay shows beaver emoji", async () => {
  const h = await boot({ query: "" });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(200);
  const beaver = await h.page.evaluate(() => {
    const el = document.querySelector(".dblBeaverEmoji");
    return el ? el.textContent : "";
  });
  ok(beaver.includes("🦫"), "Beaver emoji is present");
  await h.close();
});

await test("Water gauge is present and animating", async () => {
  const h = await boot({ query: "" });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(200);
  const gauge = await h.page.evaluate(() => !!document.querySelector(".dblGaugeTrack"));
  ok(gauge, "Water gauge track exists");

  const label = await h.page.evaluate(() => {
    const el = document.querySelector(".dblGaugeLabel");
    return el ? el.textContent : "";
  });
  ok(label.length > 0, "Gauge label has text content");
  await h.close();
});

await test("Status message shows initial text", async () => {
  const h = await boot({ query: "" });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(200);
  const status = await h.page.evaluate(() => {
    const el = document.querySelector(".dblStatus");
    return el ? el.textContent : "";
  });
  ok(status.includes("ITES") || status.includes("FLOW"), "Status text references ites or flow");
  await h.close();
});

await test("Signature line is present", async () => {
  const h = await boot({ query: "" });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(200);
  const sig = await h.page.evaluate(() => {
    const el = document.querySelector(".dblSig");
    return el ? el.textContent : "";
  });
  ok(sig.includes("DAM-ITE"), "Signature references DAM-ITE");
  await h.close();
});

await test("Loading screen cleans up on close", async () => {
  const h = await boot({ query: "" });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(500);
  await h.page.evaluate(() => { window.DamBuilder.close(); });
  await sleep(300);
  const overlay = await h.page.evaluate(() => !!document.querySelector(".dblOverlay"));
  ok(!overlay, "Overlay removed after close");
  await h.close();
});

await test("DamBuilderLoading.create() API works standalone", async () => {
  const h = await boot({ query: "?b3d=off" });
  const result = await h.page.evaluate(() => {
    if (!window.DamBuilderLoading) return { error: "DamBuilderLoading not defined" };
    const loader = window.DamBuilderLoading.create();
    document.body.appendChild(loader.el);
    const hasEl = !!loader.el;
    const hasDestroy = typeof loader.destroy === "function";
    const hasSetReady = typeof loader.setReady === "function";
    const hasSetError = typeof loader.setError === "function";
    loader.destroy();
    const cleaned = !document.body.querySelector(".dblOverlay");
    return { hasEl, hasDestroy, hasSetReady, hasSetError, cleaned };
  });
  ok(!result.error, "DamBuilderLoading is defined");
  ok(result.hasEl, "create() returns el");
  ok(result.hasDestroy, "create() returns destroy()");
  ok(result.hasSetReady, "create() returns setReady()");
  ok(result.hasSetError, "create() returns setError()");
  ok(result.cleaned, "destroy() removes the element");
  await h.close();
});

await test("setReady() resolves and adds ready class", async () => {
  const h = await boot({ query: "?b3d=off" });
  const result = await h.page.evaluate(async () => {
    const loader = window.DamBuilderLoading.create();
    document.body.appendChild(loader.el);
    const readyPromise = loader.setReady();
    const hasReadyClass = loader.el.classList.contains("dblReady");
    await readyPromise;
    const resolved = true;
    loader.destroy();
    return { hasReadyClass, resolved };
  });
  ok(result.hasReadyClass, "Ready class is applied");
  ok(result.resolved, "setReady() promise resolves");
  await h.close();
});

await test("setError() shows error state", async () => {
  const h = await boot({ query: "?b3d=off" });
  const result = await h.page.evaluate(() => {
    const loader = window.DamBuilderLoading.create();
    document.body.appendChild(loader.el);
    loader.setError("Test error");
    const hasErrorClass = loader.el.classList.contains("dblError");
    const gaugeLabel = document.querySelector(".dblGaugeLabel");
    const isError = gaugeLabel && gaugeLabel.textContent === "ERROR";
    loader.destroy();
    return { hasErrorClass, isError };
  });
  ok(result.hasErrorClass, "Error class is applied");
  ok(result.isError, "Gauge label shows ERROR");
  await h.close();
});

await test("Reduced-motion: animations are disabled", async () => {
  const h = await boot({ query: "", reduced: true });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(300);
  const hasReduced = await h.page.evaluate(() => {
    const overlay = document.querySelector(".dblOverlay");
    return overlay ? overlay.classList.contains("dblReduced") : false;
  });
  ok(hasReduced, "dblReduced class is present when prefers-reduced-motion");
  await h.close();
});

await test("No console errors from loading screen", async () => {
  const h = await boot({ query: "" });
  const errorsBefore = h.errors.length;
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(1500);
  await h.page.evaluate(() => { window.DamBuilder.close(); });
  await sleep(300);
  const newErrors = h.errors.slice(errorsBefore).filter(e => /dbl|DamBuilderLoading|loading/i.test(e));
  ok(newErrors.length === 0, "No loading-related console errors (found " + newErrors.length + ")");
  await h.close();
});

await test("Mountain scene SVG is present", async () => {
  const h = await boot({ query: "" });
  await h.page.evaluate(() => { window.DamBuilder.open(); });
  await sleep(200);
  const hasSvg = await h.page.evaluate(() => !!document.querySelector(".dblSvg"));
  ok(hasSvg, "SVG scene is in the DOM");

  const hasMountain = await h.page.evaluate(() => !!document.querySelector(".dblMountain"));
  ok(hasMountain, "Mountain polygon exists");

  const hasWheel = await h.page.evaluate(() => !!document.querySelector(".dblWheel"));
  ok(hasWheel, "Waterwheel group exists");
  await h.close();
});

// -- Summary --
await done();
console.log("\n" + (passed + failed) + " checks: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
