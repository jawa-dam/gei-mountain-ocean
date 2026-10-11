/* V2.2.20 — client-side security checks, executed in the REAL game page (headless Chromium, offline; every non-local request is aborted by the harness).
 *   C01 production host guard      the V2.1.35 host guard never intercepts gameplay on a non-production host, and the real tap path still works under it
 *   C02 runtime verification       on a wrong host the production diagnostic reports WRONG HOST, fails closed and contacts no payment endpoint
 *   R01 reward integrity           awardDay pays exactly 111 once per Day, only in order, and never again for repeated / out-of-order / forged calls
 *   R02 Builder isolation          editing or forging the Builder's own store can never move FL OZ, XP, purchases or entitlements (it has no path to them)
 *   R03 purchase state untouched   rewarding a Day never writes receipts, purchase history or unlocks
 * NOT claimed: the game's FL OZ balance lives in the player's own browser storage, so a player editing their own save is outside this model; purchases are protected by the server ledger (C03–C09).
 */
export async function runClientChecks() {
  const { boot, sleep, done } = await import("../v2217-dam-builder/harness.mjs");
  const out = []; const mk = (id, name) => { const a = []; return { ok: (l, c, d) => a.push({ label: l, pass: !!c, detail: c ? undefined : d }), finish: () => { const f = a.filter(x => !x.pass); out.push({ id, name, status: f.length ? "FAIL" : "PASS", assertions: a.length, failed: f.map(x => ({ label: x.label, detail: x.detail })) }); } }; };
  const SAVE = "yalltooDamGame.v2";
  const seed = (f = 0, extra = {}) => JSON.stringify({ version: 2, level: 1, levelFlOz: f, totalFlOz: 1000 + f, completedLevels: 0, loopCount: 0, currentStep: f / 111 | 0, unlockedCharacters: ["yall-too-beaver"], processedReceipts: ["RCPT-TEST-0001"], purchaseHistory: [], ...extra });
  const SNAP = `(() => ({ total:state.totalFlOz, lvl:state.levelFlOz, level:state.level, step:state.currentStep, done:state.completedLevels, rec:state.processedReceipts.slice(), hist:state.purchaseHistory.slice(), chars:state.unlockedCharacters.slice(), songs:state.unlockedSongs.length, skins:state.unlockedSkins.length, xp:localStorage.getItem("geiXPRewardV1") }))()`;
  let external = 0, payment = 0; const watch = page => page.on("request", r => { const u = r.url(); if (!u.startsWith("http://127.0.0.1")) external++; if (/paypal|\/api\//i.test(u) && !/\.(png|jpe?g|webp|mp3|svg)(\?|$)/i.test(u)) payment++; });
  try {
    /* C01 + C02 */
    let h = await boot({ query: "?b3d=off", storage: { [SAVE]: seed(0) } });
    watch(h.page);
    const c1 = mk("C01", "production host guard (never intercepts gameplay)"), c2 = mk("C02", "production runtime verification (fails closed on a wrong host)");
    const g = await h.page.evaluate(() => { const guard = document.getElementById("productionHostGuard"), w = document.getElementById("world").getBoundingClientRect(), hit = document.elementFromPoint(w.left + w.width / 2, w.top + w.height / 2), cs = guard && getComputedStyle(guard);
      return { flag: window.__GEI_PRODUCTION_GUARD__, guardShown: !!guard && cs.display !== "none" && cs.visibility !== "hidden" && guard.getBoundingClientRect().width > 0, hitInGuard: !!(hit && hit.closest && hit.closest("#productionHostGuard")), host: location.hostname }; });
    c1.ok("on a non-production host (" + g.host + ") the full-screen guard is off (__GEI_PRODUCTION_GUARD__ === false) and not displayed", g.flag === false && !g.guardShown, g);
    c1.ok("the middle of the tap world is not covered by the guard", !g.hitInGuard, g);
    const p = await h.page.evaluate(() => { const b = document.getElementById("world").getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
    for (let i = 0; i < 3; i++) { await h.page.mouse.click(p[0], p[1]); await sleep(200); }
    c1.ok("real taps still reach the game under the guard (the day starts and taps are counted)", await h.page.evaluate(() => state.phase === "playing" && state.tapCount > 0), await h.page.evaluate(() => ({ phase: state.phase, taps: state.tapCount })));
    c1.finish();
    /* The diagnostic panel markup (#runtimeHost, #paypalRuntimeMeta …) is not part of the shipped HTML any more — calling the function there throws on a null element. The fixture below supplies the rows it expects so its LOGIC can be exercised. */
    const v = await h.page.evaluate(async () => { const fx = document.createElement("div"); fx.id = "secFixture"; fx.innerHTML = ["runtimeHost", "runtimeConfig", "runtimeSdkProbe", "runtimeCredProbe", "runtimeButtons"].map(i => '<div class="paypalRuntimeCheck"><span>' + i + '</span><span id="' + i + '"></span></div>').join("") + '<div id="paypalRuntimeMeta"></div>'; document.body.appendChild(fx); const calls = []; const f = window.fetch; window.fetch = (...a) => { calls.push(String(a[0])); return f.apply(window, a); }; let r, err = null; try { r = await runProductionRuntimeVerification(); } catch (e) { err = e.message; } window.fetch = f; const shown = document.getElementById("runtimeHost").textContent; fx.remove(); return { r, err, calls, shown, host: location.hostname }; });
    c2.ok("the diagnostic returns ok:false with checks.host:false on a wrong host and shows WRONG HOST", v.r && v.r.ok === false && v.r.checks && v.r.checks.host === false && v.shown === "WRONG HOST", v);
    c2.ok("…and contacts no payment endpoint while doing so (fails closed)", v.calls.filter(u => /\/api\/paypal\//.test(u)).length === 0, v.calls);
    c2.finish(); await h.close();

    /* R01 – R03 */
    h = await boot({ query: "?b3d=off", storage: { [SAVE]: seed(0) } });
    watch(h.page);
    const r1 = mk("R01", "reward integrity (awardDay is exactly-once and in-order)"), r2 = mk("R02", "Builder isolation (no path from the Builder store to FL OZ / XP / purchases)"), r3 = mk("R03", "purchase state untouched by rewards");
    const s0 = await h.page.evaluate(SNAP);
    const a1 = await h.page.evaluate(() => { const t = state.totalFlOz; for (let i = 0; i < 5; i++) awardDay(0); return state.totalFlOz - t; });
    r1.ok("Day 1 called 5× pays exactly +111", a1 === 111, a1);
    const a2 = await h.page.evaluate(() => { const t = state.totalFlOz; awardDay(3); awardDay(5); awardDay(0); awardDay(-1); awardDay(99); return state.totalFlOz - t; });
    r1.ok("out-of-order (Day 4, Day 6), repeated (Day 1) and nonsense indexes pay nothing", a2 === 0, a2);
    const a3 = await h.page.evaluate(() => { const t = state.totalFlOz; awardDay(1); awardDay(1); return state.totalFlOz - t; });
    r1.ok("Day 2 pays +111 once", a3 === 111, a3);
    const a4 = await h.page.evaluate(() => { const t = state.totalFlOz, before = state.levelFlOz; try { awardDay(1.5); awardDay(null); awardDay({}); awardDay(NaN); awardDay(Infinity); awardDay(undefined); } catch (e) {} return { dt: state.totalFlOz - t, lvl: state.levelFlOz, before }; });
    r1.ok("forged argument types (1.5, null, {}, NaN, Infinity, undefined) cannot pay or move the ledger", a4.dt === 0 && a4.lvl === a4.before, a4);
    r1.ok("a reload keeps the ledger (no double pay on refresh)", (await (async () => { const b = await h.page.evaluate(() => state.totalFlOz); await h.page.reload({ waitUntil: "load" }); await sleep(2500); return (await h.page.evaluate(() => state.totalFlOz)) === b; })()));
    r1.finish();
    const before = await h.page.evaluate(SNAP);
    await h.page.evaluate(() => { localStorage.setItem("geiDamBuilder.v1", JSON.stringify({ v: 1, parts: 99999, earned: 99999, up: { bear: 3, liner: 3, act: 3 }, clears: {}, motion: null, mode: "builder", r3d: null })); });
    await h.page.reload({ waitUntil: "load" }); await sleep(2500);
    const after = await h.page.evaluate(SNAP);
    r2.ok("forging 99,999 Builder Parts and max upgrades changes no FL OZ, ledger, XP, receipts or unlocks", JSON.stringify(after) === JSON.stringify(before), { before, after });
    const parts = await h.page.evaluate(() => DamBuilder.store.parts);
    r2.ok("the forged parts exist only inside the Builder's own store (" + parts + ") — there is no conversion to FL OZ in the game", parts === 99999 && after.total === before.total);
    r2.finish();
    r3.ok("rewarding Days changed no receipts, purchase history, unlocked characters, songs or skins", JSON.stringify([s0.rec, s0.hist, s0.chars, s0.songs, s0.skins]) === JSON.stringify([after.rec, after.hist, after.chars, after.songs, after.skins]), { s0, after });
    r3.finish();
    await h.close();
  } finally { await done(); }
  return { results: out, externalRequests: external, paymentRequests: payment };
}
