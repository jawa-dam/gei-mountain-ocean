/* V2.1.90 — DAM MAP WORLD regression harness
 *
 * Loads the real index.html in headless Chromium and checks the illustrated DAM Map:
 *   A  opens from the dock (mouse + touch), BACK / Escape close it, focus returns
 *   B  stats, pin, day pills, water flow, factory rail all follow live progress
 *      (several progress states are staged inside the throwaway test browser)
 *   C  region pills never overlap or truncate (desktop, laptop, Pixel 7, iPhone SE)
 *   D  pin / pills paint above the scene; pill tap explains the region
 *   E  map sound toggle persists (damMapSound) and reports aria-pressed
 *   F  opening/rendering the map never changes game state
 *   G  every 6th level: real play-through → level card → DAM MAP MILESTONE →
 *      CONTINUE (click, and auto after 5.2 s) → map closes → Bonus Waterwheel opens;
 *      economy identical to BASE_REF; a non-milestone level goes straight to the wheel
 *
 *   node tools/v2-dam-map/dam-map-regression.mjs
 *
 * Offline: every non-local request is blocked. Exits non-zero if any check fails.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync, execFileSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const BASE_REF = process.env.BASE_REF || "b2e7691";
const KNOWN_BROKEN = 4;          // pre-existing unparseable tap-lites modules (V2.1.73/75/77/78)

async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = [];
  try { roots.push(execSync("npm root -g", { encoding:"utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){
    try { return createRequire(join(r, "noop.js"))("playwright"); } catch {}
    try { return createRequire(join(r, "noop.js"))("playwright-core"); } catch {}
  }
  console.error("Playwright is not installed. Run: npm i -D playwright");
  process.exit(2);
}
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
function gitShow(ref, p){ try { return execFileSync("git", ["show", ref + ":" + p.replace(/^\//, "")], { cwd:root, maxBuffer:64 << 20 }); } catch { return null; } }
function serve(ref){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (p === "/") p = "/index.html";
        let body;
        if (ref) { body = gitShow(ref, p); if (!body) throw 0; }
        else { const f = resolve(root, "." + p); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); } await stat(f); body = await readFile(f); }
        res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
        res.end(body);
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}
const results = [];
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function openGame(browser, base, device){
  const ctx = await browser.newContext(device || { viewport:{ width:1366, height:900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  await page.addInitScript(() => { Math.random = (() => { let s = 424242; return () => (s = (s * 16807) % 2147483647) / 2147483647; })(); });
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(700);
  const touch = !!(device && device.hasTouch);
  const tapAt = (x, y) => touch ? page.touchscreen.tap(x, y) : page.mouse.click(x, y);
  const vp = page.viewportSize();
  await tapAt(vp.width / 2, vp.height / 2);
  await sleep(300);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(3400);
  await page.evaluate(() => { try { closeGameGuide(); } catch (e) {} });
  await sleep(600);
  return { ctx, page, errors, tapAt, touch };
}
// eslint-disable-next-line no-undef
const SNAP = () => { const s = state; return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, currentStep:s.currentStep, tapCount:s.tapCount, phase:s.phase, damMachineFreePlays:s.damMachineFreePlays, tribes:(s.tribesFound || []).length }); };
const ECON = () => { const s = state; return JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, damMachineFreePlays:s.damMachineFreePlays }); };

/* Reads everything the map currently shows. */
const READ_MAP = () => {
  const $ = id => document.getElementById(id);
  const pills = [...document.querySelectorAll("#geiMapRegions .dmwPill")];
  const rects = pills.map(p => p.getBoundingClientRect());
  const overlaps = rects.slice(1).filter((r, i) => r.left < rects[i].right - 1).length;
  const truncated = pills.filter(p => { const b = p.querySelector("b"); return b.scrollWidth > b.clientWidth + 1; }).map(p => p.textContent);
  const onTop = pills.map((p, i) => { const r = rects[i], sc = $("dmwScroll").getBoundingClientRect();
    if (r.right < sc.left || r.left > sc.right) return true;                              // scrolled out of view on phones
    const x = Math.min(Math.max(r.left + r.width / 2, sc.left + 2), sc.right - 2), h = document.elementFromPoint(x, r.top + r.height / 2); return !!h && p.contains(h); });
  return {
    open:$("geiDamMapPage").classList.contains("show"),
    level:$("geiMapLevel").textContent, factories:$("geiMapFactories").textContent, flow:$("geiMapFlow").textContent, power:$("geiMapPower").textContent,
    nextStat:$("geiMapNextStat").textContent, railNext:$("geiMapNext").textContent, pin:$("geiMapPinLabel").textContent,
    pills:pills.map(p => p.className.replace("dmwPill ", "") + ":" + p.querySelector("small").textContent),
    lit:[0, 1, 2, 3, 4].filter(i => $("dmwFlow" + i).classList.contains("on")).length,
    locked:[0, 1, 2, 3, 4, 5].filter(i => $("dmwSt" + i).classList.contains("locked")),
    cards:[...document.querySelectorAll("#geiMapFactoryTrack .geiMapFactory")].map(c => c.className.replace("geiMapFactory ", "") + ":" + c.querySelector("b").textContent),
    overlaps, truncated, pillsOnTop:onTop.every(Boolean)
  };
};

async function stage(page, s){
  // eslint-disable-next-line no-undef
  await page.evaluate(s => { state.level = s.level; state.completedLevels = s.completed; state.levelFlOz = s.days * 111; window.__GEI_V2170_DAM_MAP__.render(); }, s);
  await sleep(120);
  return page.evaluate(READ_MAP);
}

async function suiteDesktop(browser, base){
  const g = await openGame(browser, base);
  const { page } = g;
  /* A — open / close / focus */
  await page.click("#damMapLauncherBtn"); await sleep(400);
  let m = await page.evaluate(READ_MAP);
  check("A1. DAM MAP opens from the dock button", m.open, {});
  await page.keyboard.press("Escape"); await sleep(200);
  const esc = await page.evaluate(() => ({ open:document.getElementById("geiDamMapPage").classList.contains("show"), focus:document.activeElement && document.activeElement.id }));
  check("A2. Escape closes the map and focus returns to the launcher", !esc.open && esc.focus === "damMapLauncherBtn", esc);
  const before = await page.evaluate(SNAP);
  await page.click("#damMapLauncherBtn"); await sleep(300);

  /* B — live progress, several staged states (restored afterwards) */
  const saved = await page.evaluate(() => ({ level:state.level, completed:state.completedLevels, days:state.levelFlOz / 111 }));
  const s1 = await stage(page, { level:1, completed:0, days:2 });
  check("B1. Level 1, day 3: pin MILLPOND, 2 days ✓, NOW on day 3, water reaches the pond", s1.pin === "MILLPOND" && s1.pills[0] === "done:DAY 1 ✓" && s1.pills[2] === "now:DAY 3 · NOW" && s1.pills[3] === "future:DAY 4" && s1.lit === 2 && s1.locked.join() === "3,4,5", s1);
  check("B2. Level 1 stats: 0 factories, next LEVEL 6, rail next = Gristmill, rest undiscovered", s1.factories === "0 ONLINE" && s1.nextStat === "LEVEL 6" && s1.railNext.includes("LEVEL 6") && s1.cards[0] === "next:Gristmill" && s1.cards[1].startsWith("future:???"), { f:s1.factories, n:s1.nextStat, c:s1.cards.slice(0, 3) });
  const s2 = await stage(page, { level:18, completed:18, days:3 });
  check("B3. Level 18 (3 factories): pin SLUICE-GATE, 3 ONLINE, next LEVEL 24, power ACTIVE", s2.pin === "SLUICE-GATE" && s2.factories === "3 ONLINE" && s2.nextStat === "LEVEL 24" && s2.power === "ACTIVE" && s2.level === "LEVEL 18", s2);
  check("B4. rail: Sugar Mill newest operational, Oil Mill next, then ??? cards", s2.cards[2] === "operational newest:Sugar Mill" && s2.cards[3] === "next:Oil Mill" && s2.cards[4].startsWith("future:???") && s2.cards[0].startsWith("operational:"), s2.cards.slice(0, 5));
  check("B5. factory pill is named after this block's factory (Sugar Mill)", s2.pills.length === 6 && /SUGAR MILL/.test(await page.evaluate(() => document.querySelectorAll(".dmwPill")[5].textContent)), {});
  const s3 = await stage(page, { level:6, completed:6, days:6 });
  check("B6. level finished: all 6 days ✓, all water lit, pin on the factory (GRISTMILL)", s3.pills.every(p => p.endsWith("✓")) && s3.lit === 5 && s3.locked.length === 0 && s3.pin === "GRISTMILL", s3);
  const s4 = await stage(page, { level:7, completed:6, days:0 });
  check("B7. new level starts back at the MOUNTAIN (not the factory)", s4.pin === "MOUNTAIN" && s4.pills[0] === "now:DAY 1 · NOW" && s4.factories === "1 ONLINE", s4);
  await stage(page, saved);

  /* C/D — pills at desktop size */
  m = await page.evaluate(READ_MAP);
  check("C1. desktop: region pills never overlap or truncate", m.overlaps === 0 && !m.truncated.length, { overlaps:m.overlaps, truncated:m.truncated });
  check("D1. pin/pills paint above the scene", m.pillsOnTop, {});
  await page.click(".dmwPill[data-i='1']"); await sleep(250);
  const cap = await page.evaluate(() => { const c = document.getElementById("dmwCaption"); return { show:c.classList.contains("show"), text:c.textContent }; });
  check("D2. tapping a region pill explains it", cap.show && /DAM · Dividing wall/.test(cap.text), cap);

  /* E — sound toggle */
  const snd0 = await page.evaluate(() => document.getElementById("geiMapSound").getAttribute("aria-pressed"));
  await page.click("#geiMapSound"); await sleep(150);
  const snd1 = await page.evaluate(() => ({ pressed:document.getElementById("geiMapSound").getAttribute("aria-pressed"), ls:localStorage.getItem("damMapSound") }));
  await page.click("#geiMapSound"); await sleep(150);
  const snd2 = await page.evaluate(() => localStorage.getItem("damMapSound"));
  check("E1. map sound toggles, persists, and reports aria-pressed", snd0 === "true" && snd1.pressed === "false" && snd1.ls === "off" && snd2 === "on", { snd0, snd1, snd2 });

  /* F — read-only */
  await page.click("#geiMapBack"); await sleep(200);
  const after = await page.evaluate(SNAP);
  check("F1. opening, staging-restore and closing the map leave game state unchanged", before === after, { before, after });
  const st = await page.evaluate(() => window.__GEI_V2170_DAM_MAP__.selfTest());
  check("F2. selfTest: scene, live state, level hook, launcher", st.scene && st.readsLiveState && st.levelHook && st.launcher && st.version === "V2.1.90", st);
  check("F3. no new script errors", g.errors.length <= KNOWN_BROKEN, g.errors);
  await g.ctx.close();
}

async function suiteViewport(browser, base, name, device){
  const g = await openGame(browser, base, device);
  await g.page.evaluate(() => window.__GEI_V2189_UTILITY_DOCK__ ? document.getElementById("damMapLauncherBtn").scrollIntoView() : 0);
  if (g.touch) await g.page.tap("#damMapLauncherBtn"); else await g.page.click("#damMapLauncherBtn");
  await sleep(500);
  const out = {};
  for (const s of [{ level:3, completed:2, days:3 }, { level:18, completed:18, days:4 }, { level:60, completed:60, days:5 }]){
    const m = await stage(g.page, s);
    out[s.level] = { overlaps:m.overlaps, truncated:m.truncated, onTop:m.pillsOnTop, open:m.open };
  }
  const geo = await g.page.evaluate(() => { const sh = document.querySelector(".dmwShell").getBoundingClientRect(); const tr = document.getElementById("geiMapFactoryTrack").getBoundingClientRect();
    return { shellFits:sh.right <= innerWidth + 1 && sh.bottom <= innerHeight + 1, railVisible:tr.bottom <= innerHeight + 1 && tr.height > 50, noPageScroll:document.documentElement.scrollWidth <= innerWidth + 1 }; });
  const ok = Object.values(out).every(o => o.open && o.overlaps === 0 && !o.truncated.length && o.onTop);
  check("C2. [" + name + "] opens by " + (g.touch ? "touch" : "click") + "; pills never overlap/truncate; shell + rail fit the screen", ok && geo.shellFits && geo.railVisible && geo.noPageScroll, { out, geo });
  await g.ctx.close();
}

/* G — real level play-through to the level card. */
async function playLevel(g){
  const p = await g.page.evaluate(() => { const r = document.getElementById("world").getBoundingClientRect(); return { x:r.left + r.width * .45, y:r.top + r.height * .55 }; });
  let phase = "";
  for (let i = 0; i < 400 && phase !== "levelComplete"; i++){
    // eslint-disable-next-line no-undef
    const st = await g.page.evaluate(() => ({ phase:state.phase, busy:state.busy }));
    phase = st.phase;
    if ((st.phase === "playing" || st.phase === "ready") && !st.busy) await g.tapAt(p.x, p.y);
    await sleep(110);
  }
  await sleep(1600);
  return phase;
}
async function milestoneRun(browser, base, { milestoneLevel, auto }){
  const g = await openGame(browser, base);
  // eslint-disable-next-line no-undef
  if (milestoneLevel) await g.page.evaluate(() => { state.level = 6; state.completedLevels = 5; });
  const phase = await playLevel(g);
  const pre = await g.page.evaluate(ECON);
  await g.page.click("#lcBtn");
  await sleep(500);
  const during = await g.page.evaluate(() => { const box = document.getElementById("geiMapMilestone"); return { map:document.getElementById("geiDamMapPage") ? document.getElementById("geiDamMapPage").classList.contains("show") : false,
    milestone:!!box && box.classList.contains("show"), text:box ? box.textContent : "", bonus:document.getElementById("bonusCard").classList.contains("show") }; });
  if (during.milestone){ if (auto) await sleep(5600); else { await g.page.click("#geiMapMilestoneContinue"); await sleep(700); } }
  const end = await g.page.evaluate(() => ({ map:!!document.getElementById("geiDamMapPage") && document.getElementById("geiDamMapPage").classList.contains("show"),
    bonus:document.getElementById("bonusCard").classList.contains("show"), phase:state.phase, levelCard:document.getElementById("levelCard").classList.contains("show") }));
  const econ = await g.page.evaluate(ECON);
  await g.ctx.close();
  return { phase, pre, during, end, econ, errors:g.errors };
}

async function suiteMilestone(browser, base, baseUrl){
  const click = await milestoneRun(browser, base, { milestoneLevel:true, auto:false });
  check("G1. level 6 play-through reaches the level card", click.phase === "levelComplete", click.phase);
  check("G2. CONTINUE on level 6 shows DAM MAP MILESTONE 01 · GRISTMILL ONLINE over the map", click.during.map && click.during.milestone && /MILESTONE 01/.test(click.during.text) && /GRISTMILL ONLINE/.test(click.during.text) && !click.during.bonus, click.during);
  check("G3. milestone CONTINUE closes the map and opens the Bonus Waterwheel", !click.end.map && click.end.bonus && !click.end.levelCard, click.end);
  const auto = await milestoneRun(browser, base, { milestoneLevel:true, auto:true });
  check("G4. milestone auto-continues to the Bonus Waterwheel after 5.2 s", auto.during.milestone && !auto.end.map && auto.end.bonus, { during:auto.during.milestone, end:auto.end });
  const plain = await milestoneRun(browser, base, { milestoneLevel:false, auto:false });
  check("G5. a non-milestone level (1) goes straight to the Bonus Waterwheel", plain.phase === "levelComplete" && !plain.during.milestone && plain.during.bonus && !plain.end.map, plain.during);
  const baseline = gitShow(BASE_REF, "index.html") ? await milestoneRun(browser, baseUrl, { milestoneLevel:true, auto:false }) : null;
  check("G6. economy after milestone → wheel identical to " + BASE_REF + " (which went straight to the wheel)", baseline && baseline.end.bonus && baseline.econ === click.econ && click.pre === click.econ, { now:click.econ, base:baseline && baseline.econ, beforeContinue:click.pre });
  check("G7. no new script errors during the milestone flow", [click, auto, plain].every(r => r.errors.length <= KNOWN_BROKEN), click.errors);
}

const pw = await loadPlaywright();
const srv = await serve(null), baseSrv = await serve(BASE_REF);
const base = "http://127.0.0.1:" + srv.address().port, baseUrl = "http://127.0.0.1:" + baseSrv.address().port;
const browser = await pw.chromium.launch();
try {
  await suiteDesktop(browser, base);
  await suiteViewport(browser, base, "laptop 1280×720", { viewport:{ width:1280, height:720 } });
  await suiteViewport(browser, base, "Pixel 7", pw.devices["Pixel 7"]);
  await suiteViewport(browser, base, "iPhone SE", pw.devices["iPhone SE"]);
  await suiteMilestone(browser, base, baseUrl);
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally {
  await browser.close(); srv.close(); baseSrv.close();
}
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ version:"V2.1.90", passed:results.length - failed.length, failed:failed.length, results }, null, 1));
process.exit(failed.length ? 1 : 0);
