/* V2.2.2 — DAM VIEW TESTER 🧪
 * "Same game. Same composition. Any screen."  Runs the real index.html through a device matrix and audits the
 * DAM Map experience (map · STEM lab · FOLLOW THE WATER cutaway · hub) with window.__GEI_DAM_VIEW__.audit():
 *
 *   viewports  320×568  360×640  375×667  390×844  412×915  412×766 (Chrome with its URL bar showing)  720×1600
 *              768×1024  1024×1366  1280×800  1440×900  1920×1080
 *   modes      NORMAL · LANDSCAPE (rotate in place: no reload, no reset) · DESKTOP SITE (phones: ~980px layout
 *              viewport on a phone screen) · FULLSCREEN (⛶ FULL MAP, real Fullscreen API)
 *   flags      🔴 clipped · 🔴 truncated · 🔴 offscreen · 🔴 overlap · 🔴 unreadable (<10px)   🟡 small tap target   🟢 PASS
 *
 *   node tools/v222-dam-view/dam-view-tester.mjs            (SHOTS=dir for screenshots, ONLY=412x915 to run one)
 *
 * Offline: non-local requests are blocked. Exits non-zero if any 🔴 is found.
 */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const SHOTS = process.env.SHOTS || "", ONLY = process.env.ONLY || "";
async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = []; try { roots.push(execSync("npm root -g", { encoding: "utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){ try { return createRequire(join(r, "noop.js"))("playwright"); } catch {} }
  console.error("Playwright is not installed. Run: npm i -D playwright"); process.exit(2);
}
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };
const srvP = new Promise(ok => { const s = createServer(async (q, r) => { try { let p = decodeURIComponent(new URL(q.url, "http://x").pathname); if (p === "/") p = "/index.html"; const f = resolve(root, "." + p); if (!f.startsWith(root)) { r.writeHead(403); return r.end(); } await stat(f); r.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }); r.end(await readFile(f)); } catch { r.writeHead(404); r.end(); } }); s.listen(0, "127.0.0.1", () => ok(s)); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const MATRIX = [[320, 568, "phone"], [360, 640, "phone"], [375, 667, "phone"], [390, 844, "phone"], [412, 915, "phone"], [412, 766, "phone"], [720, 1600, "phone"],
  [768, 1024, "tablet"], [1024, 1366, "tablet"], [1280, 800, "desktop"], [1440, 900, "desktop"], [1920, 1080, "desktop"]];

async function openGame(browser, base, o){
  const ctx = await browser.newContext({ viewport: { width: o.w, height: o.h }, screen: o.screen, deviceScaleFactor: o.dpr || 1, isMobile: !!o.mobile, hasTouch: !!o.touch, reducedMotion: "reduce" });
  const page = await ctx.newPage(); const errors = [];
  page.on("pageerror", e => { if (!/addStyle is not defined/.test(e.message)) errors.push(e.message); });
  await page.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  await page.goto(base + "/", { waitUntil: "load" }); await sleep(700);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(3400);
  await page.evaluate(() => { try { closeGameGuide(); } catch (e) {} try { window.__GEI_BEAVER_WELCOME__ && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });
  await sleep(500);
  await page.evaluate(() => { state.level = 39; state.completedLevels = 38; state.levelFlOz = 0; __GEI_V2170_DAM_MAP__.open(); });   // the reference player: Level 39, mountain day
  await sleep(600);
  return { ctx, page, errors };
}

const SCREENS = {
  map: async p => { await p.evaluate(() => { __GEI_STEM_ACADEMY_V1__.close(); }); await sleep(120); },
  lab: async p => { await p.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("mountain", "discover")); await sleep(250); },
  decide: async p => { await p.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("dam", "prove")); await sleep(250); },
  water: async p => { await p.evaluate(() => __GEI_FOLLOW_THE_WATER__.open({})); await sleep(450); },
  hub: async p => { await p.evaluate(() => __GEI_STEM_ACADEMY_V1__.openAcademy()); await sleep(250); }
};
const rows = [];
async function auditAll(page, tag, w, h){
  for (const [name, go] of Object.entries(SCREENS)) {
    await go(page);
    const a = await page.evaluate(() => __GEI_DAM_VIEW__.audit());
    const hard = a.issues.length, warn = a.warns.length;
    rows.push({ combo: `${w}×${h} ${tag}`, screen: name, hard, warn, meta: a.meta, issues: a.issues.slice(0, 6), warns: a.warns.slice(0, 3) });
    if (SHOTS) await page.screenshot({ path: join(SHOTS, `${w}x${h}-${tag.replace(/\W+/g, "_")}-${name}.png`) });
  }
  await SCREENS.map(page);
}

const { chromium } = await loadPlaywright();
const srv = await srvP, base = "http://127.0.0.1:" + srv.address().port;
if (SHOTS) await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch(["--enable-features=FullscreenPopupWindows"].length ? {} : {});
const errorsAll = [];
for (const [w, h, kind] of MATRIX) {
  if (ONLY && ONLY !== `${w}x${h}`) continue;
  const phone = kind === "phone";
  /* NORMAL → LANDSCAPE (rotate in place) → FULLSCREEN, all in one session: nothing may reload or reset */
  const g = await openGame(browser, base, { w, h, mobile: phone, touch: phone || kind === "tablet", dpr: phone ? 1.75 : 1 });
  await auditAll(g.page, "normal", w, h);
  await g.page.setViewportSize({ width: h, height: w }); await sleep(500);
  const lvl = await g.page.evaluate(() => ({ level: state.level, open: document.getElementById("geiDamMapPage").classList.contains("show") }));
  rows.push({ combo: `${w}×${h} rotate`, screen: "session", hard: lvl.level === 39 && lvl.open ? 0 : 1, warn: 0, issues: lvl.level === 39 && lvl.open ? [] : [{ kind: "reset", what: "rotation reset or closed the game", extra: JSON.stringify(lvl) }] });
  await auditAll(g.page, "landscape", h, w);
  await g.page.setViewportSize({ width: w, height: h }); await sleep(400);
  /* FULLSCREEN: click ⛶ FULL MAP (a real user gesture), audit, exit */
  const fsOk = await g.page.evaluate(() => __GEI_DAM_VIEW__.fullscreenSupported());
  if (fsOk) {
    await SCREENS.map(g.page);
    await g.page.click("#dvFsBtn"); await sleep(700);
    const m = await g.page.evaluate(() => ({ mode: __GEI_DAM_VIEW__.mode(), fs: !!document.fullscreenElement, stats: getComputedStyle(document.querySelector(".dmwStats")).display, rail: getComputedStyle(document.querySelector(".dmwRail")).display }));
    rows.push({ combo: `${w}×${h} fullscreen`, screen: "enter", hard: m.mode.fullscreen && m.fs && m.stats === "none" && m.rail === "none" ? 0 : 1, warn: 0, issues: m.mode.fullscreen && m.fs ? [] : [{ kind: "fullscreen", what: "⛶ did not enter immersion", extra: JSON.stringify(m) }] });
    await auditAll(g.page, "fullscreen", w, h);
    await g.page.click("#dvFsBtn"); await sleep(700);
    const back = await g.page.evaluate(() => ({ mode: __GEI_DAM_VIEW__.mode(), stats: getComputedStyle(document.querySelector(".dmwStats")).display }));
    rows.push({ combo: `${w}×${h} fullscreen`, screen: "exit", hard: !back.mode.fullscreen && back.stats !== "none" ? 0 : 1, warn: 0, issues: !back.mode.fullscreen && back.stats !== "none" ? [] : [{ kind: "fullscreen", what: "exit did not restore the map", extra: JSON.stringify(back) }] });
  }
  errorsAll.push(...g.errors.map(e => `${w}x${h}: ${e}`));
  await g.ctx.close();
  /* DESKTOP SITE on a phone: ~980px layout viewport, but the screen is a phone */
  if (phone && w <= 412) {
    const d = await openGame(browser, base, { w: 980, h: Math.round(980 * h / w), screen: { width: w, height: h }, touch: true, dpr: 1 });
    const m = await d.page.evaluate(() => __GEI_DAM_VIEW__.mode());
    rows.push({ combo: `${w}×${h} desktop-site`, screen: "detect", hard: m.desktopSite ? 0 : 1, warn: 0, issues: m.desktopSite ? [] : [{ kind: "desktop-site", what: "desktop-site not detected", extra: JSON.stringify(m) }] });
    await auditAll(d.page, "desktop-site", 980, Math.round(980 * h / w));
    errorsAll.push(...d.errors.map(e => `desktop-site ${w}x${h}: ${e}`));
    await d.ctx.close();
  }
}
await browser.close(); srv.close();

const bad = rows.filter(r => r.hard), warn = rows.filter(r => !r.hard && r.warn);
console.log("\nDAM VIEW TESTER — " + rows.length + " checks · 🟢 " + (rows.length - bad.length - warn.length) + " · 🟡 " + warn.length + " · 🔴 " + bad.length);
for (const r of bad) console.log("🔴", r.combo, r.screen, JSON.stringify(r.issues).slice(0, 700));
for (const r of warn.slice(0, 15)) console.log("🟡", r.combo, r.screen, JSON.stringify(r.warns).slice(0, 200));
if (errorsAll.length) console.log("page errors:", errorsAll.slice(0, 5));
process.exit(bad.length || errorsAll.length ? 1 : 0);
