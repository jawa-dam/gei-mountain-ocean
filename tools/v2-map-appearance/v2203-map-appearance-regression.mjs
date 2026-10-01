/* V2.2.03 — DAM MAP RANDOM APPEARANCE regression harness
 *
 * Loads the real index.html in headless Chromium (offline) and checks GEI_MAP_APPEARANCE:
 *   A  the map appears; the API exists; a theme is selected at load and is on the map page
 *   B  repeated opens (dock button, BACK/close, reopen) each select a different theme;
 *      one open never re-themes (idempotent open(), render()); the open counter matches
 *   C  the previous theme is removed: one attribute, computed SVG colours follow the latest
 *      theme only, no class/style stacking, one style block
 *   D  never mutates gameplay/progression state; only damMapAppearanceLast is written
 *   E  refresh: every reload selects a new theme (never the previous one)
 *   F  other open paths (overlay class change) and a rebuilt map page are themed too
 *   G  deterministic per seed; every theme's targets exist in the live map
 *   H  mobile: no layout shift between themes, pills still on top/clickable, no page scroll;
 *      prefers-reduced-motion stops the atmosphere animation; no new script errors
 *
 *   node tools/v2-map-appearance/v2203-map-appearance-regression.mjs
 */
import { loadPlaywright, serve, reporter, openGame, sleep, KNOWN_BROKEN, settle } from "../v2203-harness.mjs";

const { check, finish } = reporter();
// eslint-disable-next-line no-undef
const SNAP = () => { const s = state; return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, currentStep:s.currentStep, tapCount:s.tapCount, phase:s.phase, damMachineFreePlays:s.damMachineFreePlays, tribes:(s.tribesFound || []).length }); };
const STORE = () => { const o = {}; for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; };
const MAP = () => {
  const p = document.getElementById("geiDamMapPage"), sky = document.querySelector("#dmwSky stop");
  return { open:p.classList.contains("show"), theme:p.getAttribute("data-dmw-theme"), cls:p.className,
    attrs:[...p.attributes].map(a => a.name).filter(n => /theme/.test(n)), style:p.getAttribute("style") || "",
    sky:getComputedStyle(sky).stopColor, cur:GEI_MAP_APPEARANCE.current() };
};
const hex = h => "rgb(" + [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(", ") + ")";

const pw = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await pw.chromium.launch();

async function openViaDock(page){ await page.click("#damMapLauncherBtn"); await sleep(350); return page.evaluate(MAP); }
async function closeViaBack(page){ await page.click("#geiMapBack"); await sleep(200); }

try {
  const g = await openGame(browser, base);
  const { page } = g;
  const themeSky = await page.evaluate(() => { const css = document.getElementById("geiDamMapAppearanceV2203").textContent, o = {};
    for (const m of css.matchAll(/data-dmw-theme="([^"]+)"\] #dmwSky stop:nth-child\(1\)\{stop-color:(#[0-9a-f]{6})\}/gi)) o[m[1]] = m[2]; return o; });

  /* A */
  const api = await page.evaluate(() => ["randomize", "apply", "current", "refresh", "selfTest"].every(k => typeof GEI_MAP_APPEARANCE[k] === "function"));
  const load = await page.evaluate(MAP);
  const st = await page.evaluate(() => GEI_MAP_APPEARANCE.selfTest());
  check("A1. GEI_MAP_APPEARANCE exposes randomize/apply/current/refresh/selfTest", api && st.themes >= 6 && st.allThemesComplete && st.uniqueIds, st);
  check("A2. page load selected a theme and applied it to the (hidden) map", !load.open && load.cur.reason === "load" && load.theme === load.cur.id && load.cur.selections === 1 && load.sky === hex(themeSky[load.theme]), load);
  check("A3. every theme target exists in the live V2.1.90 map (no invented assets)", st.reusedTargetsPresent && st.mapPage && st.bound, st.missingTargets);

  /* B — repeated opens */
  const before = await page.evaluate(SNAP), store0 = await page.evaluate(STORE);
  const seq = [];
  const first = await openViaDock(page);
  check("B1. the DAM MAP appears and the first opening reveals the page-load theme", first.open && first.theme === load.theme && first.cur.opens === 1, first);
  seq.push(first.theme);
  await page.evaluate(() => { window.__GEI_V2170_DAM_MAP__.open(); window.__GEI_V2170_DAM_MAP__.render(); });
  await sleep(250);
  const same = await page.evaluate(MAP);
  check("B2. one opening = one theme (open() again and render() while open do not re-theme)", same.theme === first.theme && same.cur.opens === 1 && same.cur.selections === 1, same);
  for (let i = 0; i < 7; i++){ await closeViaBack(page); const m = await openViaDock(page); seq.push(m.theme); }
  const last = await page.evaluate(MAP);
  const consecutiveDiffer = seq.every((t, i) => i === 0 || t !== seq[i - 1]);
  check("B3. close + reopen selects a new theme every time (8 opens)", consecutiveDiffer && new Set(seq).size >= 3 && last.cur.opens === 8 && last.cur.selections === 8 && last.cur.reason === "open", { seq, cur:last.cur });

  /* C — previous theme removed */
  check("C1. exactly one theme attribute, no stacked classes/inline styles on the map page", last.attrs.length === 1 && last.cls.trim() === "show" && last.style === "" && st.singleStyleBlock, last);
  const swap = await page.evaluate(() => { GEI_MAP_APPEARANCE.apply("sunset"); const a = getComputedStyle(document.querySelector("#dmwSky stop")).stopColor;
    GEI_MAP_APPEARANCE.apply("mist"); const p = document.getElementById("geiDamMapPage");
    return { a, b:getComputedStyle(document.querySelector("#dmwSky stop")).stopColor, theme:p.getAttribute("data-dmw-theme"),
      stars:[...document.querySelectorAll(".dmwStar")].filter(s => getComputedStyle(s).display !== "none").length,
      lamp:getComputedStyle(document.querySelector(".dmwLamp")).fill, flow:getComputedStyle(document.querySelector(".dmwFlow.lit")).stroke }; });
  check("C2. applying a new theme fully replaces the previous one (sunset → mist)", swap.a === hex(themeSky.sunset) && swap.b === hex(themeSky.mist) && swap.theme === "mist" && swap.stars === 0, swap);
  const classic = await page.evaluate(() => { GEI_MAP_APPEARANCE.apply("moonlit"); return { sky:getComputedStyle(document.querySelector("#dmwSky stop")).stopColor,
    stars:[...document.querySelectorAll(".dmwStar")].filter(s => getComputedStyle(s).display !== "none").length }; });
  check("C3. the classic Moonlit Valley theme reproduces the original V2.1.90 night scene", classic.sky === "rgb(7, 11, 34)" && classic.stars === 70, classic);

  /* D — read-only */
  await page.evaluate(() => { for (let i = 0; i < 20; i++) GEI_MAP_APPEARANCE.randomize(); GEI_MAP_APPEARANCE.refresh(); });
  await closeViaBack(page);
  const after = await page.evaluate(SNAP), store1 = await page.evaluate(STORE);
  const changed = Object.keys({ ...store0, ...store1 }).filter(k => store0[k] !== store1[k]);
  check("D1. opens, randomize ×20 and close leave game state unchanged", before === after, { before, after });
  check("D2. the only storage write is damMapAppearanceLast (presentation)", changed.every(k => k === "damMapAppearanceLast"), changed);

  /* F — other open paths + rebuild */
  const ov = await page.evaluate(async () => { const p = document.getElementById("geiDamMapPage"), t0 = p.getAttribute("data-dmw-theme"), o0 = GEI_MAP_APPEARANCE.current().opens;
    p.classList.add("show"); await new Promise(r => setTimeout(r, 50)); const t1 = p.getAttribute("data-dmw-theme"), o1 = GEI_MAP_APPEARANCE.current().opens;
    window.__GEI_V2170_DAM_MAP__.close(); return { t0, t1, opened:o1 - o0 }; });
  check("F1. an overlay-style open (class change, as the fallback launcher/milestone do) selects a new theme", ov.opened === 1 && ov.t1 && ov.t1 !== ov.t0, ov);
  const rb = await page.evaluate(async () => { const old = document.getElementById("geiDamMapPage"), t0 = old.getAttribute("data-dmw-theme");
    old.remove(); window.__GEI_V2170_DAM_MAP__.render(); await new Promise(r => setTimeout(r, 60));
    const p = document.getElementById("geiDamMapPage"), s = GEI_MAP_APPEARANCE.selfTest();
    window.__GEI_V2170_DAM_MAP__.open(); await new Promise(r => setTimeout(r, 60)); const t2 = p.getAttribute("data-dmw-theme"), opens = GEI_MAP_APPEARANCE.current().opens;
    window.__GEI_V2170_DAM_MAP__.close();
    return { rebuilt:p !== old, t0, t1:s.themeAttribute, t2, rebinds:s.rebinds, bound:s.bound, opens }; });
  check("F2. a reconstructed map page is re-bound, themed fresh, and its openings still re-theme", rb.rebuilt && rb.rebinds === 1 && rb.bound && rb.t1 && rb.t1 !== rb.t0 && rb.t2 && rb.t2 !== rb.t1, rb);

  /* G — determinism */
  const det = await page.evaluate(() => { GEI_MAP_APPEARANCE.apply("moonlit"); const a = GEI_MAP_APPEARANCE.randomize({ seed:4242 }).id;
    GEI_MAP_APPEARANCE.apply("moonlit"); const b = GEI_MAP_APPEARANCE.randomize({ seed:4242 }).id;
    const seen = new Set(); for (let s = 1; s <= 400; s++){ GEI_MAP_APPEARANCE.apply("moonlit"); seen.add(GEI_MAP_APPEARANCE.randomize({ seed:s * 7919 }).id); }
    return { a, b, reach:seen.size, total:GEI_MAP_APPEARANCE.themes.length }; });
  check("G1. a seed selects a complete theme deterministically; every other theme is reachable", det.a === det.b && det.a !== "moonlit" && det.reach === det.total - 1, det);

  /* E — refresh */
  const reloads = [await page.evaluate(() => GEI_MAP_APPEARANCE.current().id)];
  for (let i = 0; i < 3; i++){
    await page.reload({ waitUntil:"load" }); await sleep(400);
    reloads.push(await page.evaluate(() => { const c = GEI_MAP_APPEARANCE.current(); return c.reason === "load" && c.appliedToPage ? c.id : "!" + JSON.stringify(c); }));
  }
  check("E1. every refresh selects a new theme, never repeating the previous one", reloads.every((t, i) => !t.startsWith("!") && (i === 0 || t !== reloads[i - 1])), reloads);
  await settle(page);
  const post = await openViaDock(page);
  check("E2. after a refresh, opening the map shows that refresh's selection", post.open && post.theme === reloads[reloads.length - 1] && post.cur.opens === 1, post.cur);
  check("H4. no new script errors (desktop; 4 page loads, each may carry the known pre-existing errors)", g.errors.length <= KNOWN_BROKEN * reloads.length, g.errors);
  await g.ctx.close();

  /* H — mobile + reduced motion */
  const m = await openGame(browser, base, { device:pw.devices["Pixel 7"], reducedMotion:true });
  await m.page.tap("#damMapLauncherBtn"); await sleep(500);
  const geo = await m.page.evaluate(async () => {
    const rect = () => { const r = document.getElementById("dmwScene").getBoundingClientRect(), s = document.querySelector(".dmwShell").getBoundingClientRect(); return [r.width, r.height, s.width, s.height].map(Math.round).join("x"); };
    const out = [], hits = [];
    for (const id of GEI_MAP_APPEARANCE.themes.map(t => t.id)){
      GEI_MAP_APPEARANCE.apply(id); await new Promise(r => requestAnimationFrame(() => r()));
      out.push(rect());
      const pill = document.querySelector('.dmwPill[data-i="0"]'), pr = pill.getBoundingClientRect(), sc = document.getElementById("dmwScroll").getBoundingClientRect();
      const x = Math.min(Math.max(pr.left + pr.width / 2, sc.left + 2), sc.right - 2), h = document.elementFromPoint(x, pr.top + pr.height / 2);
      hits.push(!!h && pill.contains(h));
    }
    GEI_MAP_APPEARANCE.apply("mist");
    const after = getComputedStyle(document.getElementById("dmwScene"), "::after");
    return { sizes:[...new Set(out)], hits, noPageScroll:document.documentElement.scrollWidth <= innerWidth + 1, mistAnim:after.animationName, overlayInput:after.pointerEvents };
  });
  check("H1. [Pixel 7] no layout shift across all themes (scene + shell size identical)", geo.sizes.length === 1, geo.sizes);
  check("H2. [Pixel 7] region pills stay on top and tappable under every atmosphere; no page scroll", geo.hits.every(Boolean) && geo.noPageScroll && geo.overlayInput === "none", geo);
  check("H3. prefers-reduced-motion: atmosphere overlay animation is off", geo.mistAnim === "none", geo.mistAnim);
  check("H5. no new script errors (mobile)", m.errors.length <= KNOWN_BROKEN, m.errors);
  await m.ctx.close();
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally {
  await browser.close(); srv.close();
}
finish("V2.2.03-map");
