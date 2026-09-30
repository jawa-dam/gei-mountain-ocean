/* V2.1.90 — BEAVER-FIRST FIRST IMPRESSION + RETURNING VISITOR WELCOME MEMORY harness
 *
 * Loads the real index.html in headless Chromium and walks the V2.1.90 test matrix:
 *   A new visitor      Beaver active, welcome appears (no guide / How to Play), Begin works
 *   B choose player    Choose Another Player opens the avatar picker; Wilbert selectable + persists
 *   C X dismiss        X writes geiWelcomeDismissed=true; refresh + fresh browser context → no welcome
 *   D checkbox         checked box + Begin persists the same preference
 *   E returning        saved character stays active, game opens directly, taps never reopen it
 *   F profile          👋 WELCOME AGAIN reopens the guide info; save + dismissal untouched
 *   G phone            fits a Pixel 7 / iPhone 13 viewport with large text
 *
 *   node tools/v2-welcome/welcome-regression.mjs
 *
 * Offline: every non-local request is blocked (the Beaver art falls back to 🦫).
 * Exits non-zero if any check fails.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);

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

const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
function serve(){
  return new Promise(ok => {
    const srv = createServer(async (req, res) => {
      try {
        let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (p === "/") p = "/index.html";
        const f = resolve(root, "." + p);
        if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
        await stat(f);
        res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
        res.end(await readFile(f));
      } catch { res.writeHead(404); res.end(); }
    });
    srv.listen(0, "127.0.0.1", () => ok(srv));
  });
}

const results = [];
function check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const KEY = "geiWelcomeDismissed";
/* Pre-existing on the V2.1.89 base (not introduced here): 4 inline scripts fail to parse on every
   load ("Unexpected string"), and one self-test row about spotlight personalities fails. */
const KNOWN_PAGE_ERROR = /Unexpected string/;
const KNOWN_SELFTEST_FAILS = ["V2.1.8: every canonical character has a spotlight personality"];

async function newCtx(browser, base, opts){
  const ctx = await browser.newContext(Object.assign({ viewport:{ width:1280, height:800 } }, opts || {}));
  ctx.__errors = [];
  await ctx.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  return ctx;
}
/* Load (or reload) and skip the splash. Returns the page once the post-splash startup has settled. */
async function boot(ctx, base, page){
  if (!page){ page = await ctx.newPage(); page.on("pageerror", e => ctx.__errors.push(e.message)); await page.goto(base + "/", { waitUntil:"load" }); }
  else await page.reload({ waitUntil:"load" });
  await sleep(500);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(1800);
  return page;
}
const VIEW = () => {
  // eslint-disable-next-line no-undef
  const s = state;
  const w = document.getElementById("geiWelcome"), pre = document.getElementById("preGameCard");
  return {
    welcome: !!(w && w.classList.contains("show")),
    mode: w ? w.getAttribute("data-mode") : null,
    guide: !!(pre && pre.classList.contains("show")),
    guideTab: (document.querySelector("[data-guide-tab].active") || {}).dataset?.guideTab || null,
    active: s.activeCharacter,
    unlocked: s.unlockedCharacters.slice(),
    econ: JSON.stringify({ totalFlOz:s.totalFlOz, level:s.level, levelFlOz:s.levelFlOz, completedLevels:s.completedLevels, currentStep:s.currentStep, millStage:s.millStage, damMachineFreePlays:s.damMachineFreePlays, unlockedCharacters:s.unlockedCharacters, unlockedSongs:s.unlockedSongs, unlockedSkins:s.unlockedSkins }),
    tapCount: s.tapCount, phase: s.phase,
    key: localStorage.getItem("geiWelcomeDismissed"),
    save: localStorage.getItem("yalltooDamGame.v2")
  };
};
async function worldTap(page, n){
  for (let i = 0; i < n; i++){
    const p = await page.evaluate(() => { const r = document.getElementById("world").getBoundingClientRect(); return { x:r.left + r.width * .45, y:r.top + r.height * .55 }; });
    await page.mouse.click(p.x, p.y); await sleep(120);
  }
}

async function suiteNewVisitor(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  let v = await page.evaluate(VIEW);
  check("A1. new visitor: Beaver is the active character", v.active === "yall-too-beaver", v.active);
  check("A2. new visitor: Wilbert is still owned (not replaced)", v.unlocked.includes("wilbert-dam-guide") && v.unlocked.includes("yall-too-beaver"), v.unlocked);
  check("A3. new visitor: Beaver welcome appears, no Pick-a-Player / How-to-Play guide", v.welcome && v.mode === "first" && !v.guide, v);
  const copy = await page.evaluate(() => ({
    title: document.getElementById("geiWelcomeTitle").textContent,
    line: document.getElementById("geiWelcomeLine").textContent,
    begin: document.getElementById("geiWelcomeBegin").textContent,
    choose: document.getElementById("geiWelcomeChoose").textContent,
    never: !!document.getElementById("geiWelcomeNever"),
    x: !!document.getElementById("geiWelcomeClose"),
    guideHidden: getComputedStyle(document.querySelector("#geiWelcome .gwGuide")).display === "none"
  }));
  check("A4. welcome copy: title, Beaver buddy line, BEGIN / CHOOSE / checkbox / X", /WELCOME TO THE FLOW/.test(copy.title) && /Beaver buddy/.test(copy.line) && /BEGIN THE FLOW/.test(copy.begin) && /CHOOSE ANOTHER PLAYER/.test(copy.choose) && copy.never && copy.x && copy.guideHidden, copy);
  check("A5. loading never persists dismissal; any boot save carries Beaver", v.key === null && (v.save === null || JSON.parse(v.save).activeCharacter === "yall-too-beaver"), { key:v.key });
  const econ0 = v.econ;
  await page.click("#geiWelcomeBegin"); await sleep(500);
  v = await page.evaluate(VIEW);
  check("A6. BEGIN closes the welcome without persisting dismissal", !v.welcome && !v.guide && v.key === null, v);
  check("A6b. FL OZ / progression / ownership untouched by the welcome", v.econ === econ0, { before:econ0, after:v.econ });
  await worldTap(page, 3);
  v = await page.evaluate(VIEW);
  check("A7. after BEGIN, board taps reach the game", v.tapCount > 0 || v.phase === "playing", { tapCount:v.tapCount, phase:v.phase });
  check("A8. Beaver persists in the save once play starts", !!v.save && JSON.parse(v.save).activeCharacter === "yall-too-beaver", v.save && JSON.parse(v.save).activeCharacter);
  check("A9. welcome never reappears from gameplay taps", !v.welcome, {});
  /* not dismissed → it greets again next time (only X / checkbox remember) */
  await boot(ctx, base, page);
  v = await page.evaluate(VIEW);
  check("A10. without X/checkbox the first-impression welcome still greets on reload", v.welcome && v.mode === "first" && v.active === "yall-too-beaver", v);
  check("A12. no page errors (new visitor)", ctx.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, ctx.__errors);
  await ctx.close();
}

async function suiteChoose(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  const before = (await page.evaluate(VIEW)).econ;
  await page.click("#geiWelcomeChoose"); await sleep(500);
  let v = await page.evaluate(VIEW);
  check("B1. CHOOSE ANOTHER PLAYER opens the avatar picker", !v.welcome && v.guide && v.guideTab === "avatar", v);
  check("B2. Choose without checkbox does not persist dismissal", v.key === null, v.key);
  const wilbert = await page.evaluate(() => !!document.querySelector('#preGameAvatarGrid [data-char-id="wilbert-dam-guide"]'));
  check("B3. Wilbert is listed in the picker", wilbert, {});
  const sel = await page.evaluate(() => selectGuideCharacter("wilbert-dam-guide") && beginFromGuide());
  v = await page.evaluate(VIEW);
  check("B4. Wilbert can be selected and the game begins", sel && v.active === "wilbert-dam-guide" && !v.guide, v);
  check("B5. economy unchanged by choosing", v.econ === before, { before, after:v.econ });
  await boot(ctx, base, page);
  v = await page.evaluate(VIEW);
  check("B6. chosen character (Wilbert) stays active after refresh — not reset to Beaver", v.active === "wilbert-dam-guide", v.active);
  await ctx.close();
}

async function suiteDismiss(browser, base){
  const ctx = await newCtx(browser, base);
  let page = await boot(ctx, base);
  await page.click("#geiWelcomeClose"); await sleep(400);
  let v = await page.evaluate(VIEW);
  check("C1. X closes the welcome and writes geiWelcomeDismissed=\"true\"", !v.welcome && v.key === "true", v.key);
  await worldTap(page, 4);
  await boot(ctx, base, page); await sleep(1200);
  v = await page.evaluate(VIEW);
  check("C2. refresh: welcome does not return, game opens directly", !v.welcome && !v.guide, v);
  check("C3. returning visitor keeps Beaver active", v.active === "yall-too-beaver", v.active);
  /* close the browser, reopen later: carry storage into a brand-new context */
  const saved = await ctx.storageState();
  await ctx.close();
  const ctx2 = await newCtx(browser, base, { storageState:saved });
  page = await boot(ctx2, base); await sleep(1200);
  v = await page.evaluate(VIEW);
  check("C4. reopened browser: still dismissed, game opens directly", !v.welcome && !v.guide && v.key === "true", v);
  /* ordinary gameplay taps never bring it back */
  await worldTap(page, 12);
  v = await page.evaluate(VIEW);
  check("C5. 12 gameplay taps never open the welcome", !v.welcome, {});

  /* Profile: reopen the information */
  const saveBefore = v.save, econBefore = v.econ;
  await page.click("#profileTopBtn"); await sleep(400);
  const hasBtn = await page.evaluate(() => { const b = document.getElementById("geiWelcomeAgainBtn"); return !!b && b.offsetParent !== null && /WELCOME AGAIN/.test(b.textContent); });
  check("F1. Profile shows 👋 WELCOME AGAIN", hasBtn, {});
  await page.click("#geiWelcomeAgainBtn"); await sleep(500);
  v = await page.evaluate(VIEW);
  const info = await page.evaluate(() => { const g = document.querySelector("#geiWelcome .gwGuide"); return { shown:getComputedStyle(g).display !== "none", text:g.textContent, never:getComputedStyle(document.querySelector("#geiWelcome .gwNever")).display }; });
  check("F2. review mode opens with what/how-to-begin/choose/controls", v.welcome && v.mode === "review" && info.shown && /What it is/.test(info.text) && /How to begin/.test(info.text) && /CHOOSE ANOTHER PLAYER/.test(info.text) && /Controls/.test(info.text) && info.never === "none", { mode:v.mode, info });
  check("F3. reopening does not clear gameplay state or the dismissal", v.save === saveBefore && v.econ === econBefore && v.key === "true", { key:v.key });
  const paused = await page.evaluate(() => isTimerBlocked());
  check("F4. day clock is held while the welcome is open", paused, {});
  await page.click("#geiWelcomeClose"); await sleep(400);
  v = await page.evaluate(VIEW);
  check("F5. closing review keeps the preference", !v.welcome && v.key === "true" && v.save === saveBefore, { key:v.key });
  await boot(ctx2, base, page); await sleep(1200);
  v = await page.evaluate(VIEW);
  check("F6. reviewing does NOT make the welcome return on startup", !v.welcome, {});
  check("C6. no page errors (dismissed visitor)", ctx2.__errors.filter(e => !KNOWN_PAGE_ERROR.test(e)).length === 0, ctx2.__errors);
  await ctx2.close();
}

async function suiteCheckbox(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  await page.check("#geiWelcomeNever");
  await page.click("#geiWelcomeBegin"); await sleep(400);
  let v = await page.evaluate(VIEW);
  check("D1. checkbox + BEGIN persists geiWelcomeDismissed", !v.welcome && v.key === "true", v.key);
  await boot(ctx, base, page); await sleep(1200);
  v = await page.evaluate(VIEW);
  check("D2. refresh after checkbox: no welcome", !v.welcome && !v.guide, v);
  /* review from a NOT-dismissed player never writes the key */
  await page.evaluate(() => localStorage.removeItem("geiWelcomeDismissed"));
  await page.evaluate(() => window.__GEI_BEAVER_WELCOME__.openReview()); await sleep(300);
  await page.click("#geiWelcomeClose"); await sleep(300);
  v = await page.evaluate(VIEW);
  check("F7. review-mode X never writes the dismissal key", v.key === null, v.key);
  await ctx.close();
}

async function suiteSelfTest(browser, base){
  const ctx = await newCtx(browser, base);
  const page = await boot(ctx, base);
  await page.evaluate(() => window.__GEI_BEAVER_WELCOME__.begin());
  const r = await page.evaluate(() => runCommandCenterSelfTest());
  const newFails = r.results.filter(x => !x.ok && !KNOWN_SELFTEST_FAILS.includes(x.name));
  check("H1. in-page command-center self-test: no new failures", newFails.length === 0, newFails);
  await ctx.close();
}

async function suitePhone(browser, base, pw, name){
  const ctx = await newCtx(browser, base, pw.devices[name]);
  const page = await boot(ctx, base);
  const fit = await page.evaluate(() => {
    const card = document.querySelector("#geiWelcome .gwCard").getBoundingClientRect();
    const px = sel => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize);
    const size = sel => { const r = document.querySelector(sel).getBoundingClientRect(); return Math.min(r.width, r.height); };
    return { shown:document.getElementById("geiWelcome").classList.contains("show"), left:card.left, right:card.right, top:card.top, bottom:card.bottom, vw:innerWidth, vh:innerHeight,
      noHScroll:document.documentElement.scrollWidth <= innerWidth + 1,
      title:px("#geiWelcomeTitle"), line:px("#geiWelcomeLine"), begin:px("#geiWelcomeBegin"), never:px("#geiWelcome .gwNever"),
      xTarget:size("#geiWelcomeClose"), beginH:document.getElementById("geiWelcomeBegin").getBoundingClientRect().height };
  });
  check("G1. [" + name + "] welcome fits the phone, no horizontal scroll", fit.shown && fit.left >= 0 && fit.right <= fit.vw && fit.top >= 0 && fit.bottom <= fit.vh && fit.noHScroll, fit);
  check("G2. [" + name + "] large readable text + big tap targets", fit.title >= 20 && fit.line >= 16 && fit.begin >= 16 && fit.never >= 14 && fit.xTarget >= 44 && fit.beginH >= 48, fit);
  await page.tap("#geiWelcomeClose"); await sleep(400);
  const key = await page.evaluate(() => localStorage.getItem("geiWelcomeDismissed"));
  check("G3. [" + name + "] touch X dismisses permanently", key === "true", key);
  await ctx.close();
}

const pw = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await pw.chromium.launch();
try {
  await suiteNewVisitor(browser, base);
  await suiteChoose(browser, base);
  await suiteDismiss(browser, base);
  await suiteCheckbox(browser, base);
  await suiteSelfTest(browser, base);
  await suitePhone(browser, base, pw, "Pixel 7");
  await suitePhone(browser, base, pw, "iPhone 13");
} catch (e) {
  check("harness ran to completion", false, String(e && e.stack || e));
} finally {
  await browser.close(); srv.close();
}
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ version:"V2.1.90", passed:results.length - failed.length, failed:failed.length, results }, null, 1));
process.exit(failed.length ? 1 : 0);
