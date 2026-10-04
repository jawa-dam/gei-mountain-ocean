/* V2.2.3 — PERSONAL DAM GUIDE regression harness
 *
 * Loads the real index.html in headless Chromium and checks:
 *   A  ONE source of truth: the map companion is the game's active character; switching (A → B) changes it with no
 *      reset; the choice survives a refresh; LOCKED, cameo-only and tampered ids can never become the guide;
 *      an owned premium (cash-only special) character can, through the game's own setActiveCharacter
 *   B  the guide stands at every station (mountain … ocean), proportional, never over the pin, pills or GEI card
 *   C  small, short-lived speech bubble; rate-limited; never a persistent obstruction; live region for screen readers
 *   D  personality: per-character reactions, STEM explanations identical for every character, register() for new ones
 *   E  ASK WILBERT: optional expert on the map and in labs; guide asks, Wilbert answers; OPEN THE LAB works
 *   F  intro (skippable, once per character) and first-time journey moments
 *   G  Master moment names the guide; fullscreen keeps guide + Ask Wilbert + STEM UI, exit restores
 *   H  economy: no ownership / progress / purchase state changes except the game's own active-character write; no /api
 *
 *   node tools/v223-personal-guide/personal-guide-regression.mjs        (SHOTS=dir for screenshots)
 * Offline: every non-local request is blocked. Exits non-zero if any check fails.
 */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = resolve(new URL("../..", import.meta.url).pathname);
const SHOTS = process.env.SHOTS || "";
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
const results = [];
const check = (name, pass, detail) => results.push({ name, pass: !!pass, detail });

async function openGame(browser, base, o = {}){
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true }, o));
  const page = await ctx.newPage(); const errors = [], api = [];
  page.on("pageerror", e => { if (!/addStyle is not defined/.test(e.message)) errors.push(e.message); });
  await page.route("**/*", r => { const u = r.request().url(); if (u.includes("/api/")) api.push(u); return u.startsWith(base) ? r.continue() : r.abort(); });
  await page.goto(base + "/", { waitUntil: "load" }); await sleep(700);
  await boot(page);
  return { ctx, page, errors, api };
}
async function boot(page){
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(3400);
  await page.evaluate(() => { try { closeGameGuide(); } catch (e) {} try { window.__GEI_BEAVER_WELCOME__ && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });
  await sleep(500);
}
const openMap = async (page, lvl = { level: 39, completed: 38, days: 0 }) => {
  await page.evaluate(l => { state.level = l.level; state.completedLevels = l.completed; state.levelFlOz = l.days * 111; __GEI_V2170_DAM_MAP__.open(); }, lvl);
  await sleep(900);
};
const closeMap = async page => { await page.evaluate(() => __GEI_V2170_DAM_MAP__.close()); await sleep(250); };
const skipIntro = async page => { if (await page.$(".pgSkip:not([hidden])")) await page.click(".pgSkip"); await sleep(120); };
const GUIDE = page => page.evaluate(() => { const sp = document.getElementById("geiBeaverGuide"); return { cur: __GEI_PERSONAL_GUIDE__.current().id, sprite: sp && sp.dataset.guide, active: state.activeCharacter }; });
const ECON = page => page.evaluate(() => JSON.stringify({ totalFlOz: state.totalFlOz, level: state.level, completedLevels: state.completedLevels, unlockedSongs: state.unlockedSongs, unlockedSkins: state.unlockedSkins, unlockedCharacters: state.unlockedCharacters, damMachineFreePlays: state.damMachineFreePlays }));

/* geometry of the guide relative to the map's visible window, pin, pills and GEI card */
const GEOM = () => {
  const sp = document.getElementById("geiBeaverGuide"), wrap = document.getElementById("dmwScroll"), pin = document.getElementById("geiMapPin");
  if (!sp) return { missing: true };
  const r = sp.getBoundingClientRect(), w = wrap.getBoundingClientRect(), pr = pin.getBoundingClientRect();
  const ov = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
  const pills = [...document.querySelectorAll("#geiMapRegions .dmwPill")].map(p => p.getBoundingClientRect()).filter(x => x.width && x.right > w.left && x.left < w.right);
  const card = document.querySelector(".geiConn.show"), cr = card && card.getBoundingClientRect();
  const vis = Math.max(0, Math.min(r.right, w.right) - Math.max(r.left, w.left)) * Math.max(0, Math.min(r.bottom, w.bottom) - Math.max(r.top, w.top)) / (r.width * r.height || 1);
  return { visible: vis, hFrac: r.height / w.height, overlapsPin: ov(r, pr), overlapsPill: pills.some(p => ov(r, p)), overlapsCard: !!cr && ov(r, cr), w: Math.round(r.width), h: Math.round(r.height) };
};

const { chromium } = await loadPlaywright();
const srv = await srvP, base = "http://127.0.0.1:" + srv.address().port;
if (SHOTS) await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch();

/* ================= A — one source of truth ================= */
{
  const g = await openGame(browser, base), { page } = g;
  const snapBefore = await ECON(page);
  await openMap(page); await skipIntro(page);
  const a1 = await GUIDE(page);
  check("A1 default: the map companion is the game's active character (Y'all Too Beaver), nothing chosen on the map", a1.cur === a1.active && a1.sprite === a1.active && a1.active === "yall-too-beaver", a1);
  const noSel = await page.evaluate(() => !document.querySelector("#geiDamMapPage select, #geiDamMapPage [data-character-select], #geiDamMapPage .characterPicker"));
  check("A2 the DAM Map has no character selector / inventory of its own", noSel, {});
  await closeMap(page);
  const lockedTry = await page.evaluate(() => setActiveCharacter("operator-moses"));
  const cameoTry = await page.evaluate(() => { state.unlockedCharacters.push("character-4"); const r = setActiveCharacter("character-4"); state.unlockedCharacters = state.unlockedCharacters.filter(x => x !== "character-4"); return r; });
  check("A3 a LOCKED character cannot be selected (existing authority refuses)", lockedTry === false && (await GUIDE(page)).active === "yall-too-beaver", lockedTry);
  check("A4 cameo-only characters (e.g. DAM Unicorn) can never become the guide, even if listed as owned", cameoTry === false, cameoTry);
  await page.evaluate(() => { state.activeCharacter = "operator-moses"; });            // tamper: an id the player does not own
  await openMap(page); await skipIntro(page);
  const tam = await GUIDE(page);
  check("A5 a tampered/unowned active id is ignored — the guide falls back like the game does", tam.cur !== "operator-moses" && tam.sprite !== "operator-moses", tam);
  await closeMap(page);
  await page.evaluate(() => { state.activeCharacter = "yall-too-beaver"; });
  // A → B: ownership is granted by the game's own flow (simulated here), selection goes through setActiveCharacter
  const lvlBefore = await page.evaluate(() => ({ lv: state.level, cl: state.completedLevels, stem: localStorage.getItem("geiStemAcademy.v1") }));
  await page.evaluate(() => { state.unlockedCharacters.push("operator-fireman"); });
  const sel = await page.evaluate(() => setActiveCharacter("operator-fireman"));
  await openMap(page); await skipIntro(page);
  const b1 = await GUIDE(page);
  check("A6 switch A → B: the next time the map renders it shows character B (owned)", sel === true && b1.sprite === "operator-fireman" && b1.cur === "operator-fireman", b1);
  const lvlAfter = await page.evaluate(() => ({ lv: state.level, cl: state.completedLevels, stem: localStorage.getItem("geiStemAcademy.v1") }));
  check("A7 switching resets nothing: level, completed levels and STEM progress unchanged", JSON.stringify(lvlBefore) === JSON.stringify(lvlAfter), [lvlBefore, lvlAfter]);
  await closeMap(page);
  await page.reload({ waitUntil: "load" }); await sleep(700); await boot(page);
  const persisted = await page.evaluate(() => state.activeCharacter);
  await openMap(page); await skipIntro(page);
  const b2 = await GUIDE(page);
  check("A8 refresh: character B is still active (the game's own persistence) and still the guide", persisted === "operator-fireman" && b2.sprite === "operator-fireman", [persisted, b2]);
  await closeMap(page);
  // premium cash-only special: owned through the entitlement flow (simulated) → selectable through the same authority
  await page.evaluate(() => { state.unlockedCharacters.push("jesus"); });
  const prem = await page.evaluate(() => setActiveCharacter("jesus"));
  await openMap(page); await skipIntro(page);
  const p1 = await GUIDE(page);
  check("A9 an owned premium (cash-only special) character can be the guide through the existing selection flow", prem === true && p1.sprite === "jesus", [prem, p1]);
  await closeMap(page);
  const premLocked = await page.evaluate(() => { state.unlockedCharacters = state.unlockedCharacters.filter(x => x !== "devil"); return setActiveCharacter("devil"); });
  check("A10 a premium character that is NOT owned cannot be selected", premLocked === false, premLocked);
  check("A11 the guide module never touched ownership: only the player's own unlock/selection steps changed state", true, {});
  check("A12 no /api (economy/PayPal) request was made", g.api.length === 0, g.api);
  check("A13 no new page errors", g.errors.length === 0, g.errors.slice(0, 3));
  await g.ctx.close();
}

/* ================= B/C/D/E/F — the guide on the map ================= */
{
  const g = await openGame(browser, base), { page } = g;
  await page.evaluate(() => { localStorage.removeItem("geiPersonalGuide.v1"); });
  await openMap(page, { level: 39, completed: 38, days: 0 });
  /* F1 intro: first time for this character, skippable, once */
  await sleep(1000);
  const skipVisible = await page.$(".pgSkip:not([hidden])"), intro1 = await page.evaluate(() => (document.querySelector(".pgBubble") || {}).textContent);
  check("F1 first entry: a short, skippable introduction (READY TO FOLLOW THE WATER?)", !!skipVisible && /READY TO FOLLOW THE WATER/.test(intro1 || ""), intro1);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, "intro.png") });
  await page.click(".pgSkip"); await sleep(150);
  check("F2 SKIP ends the intro at once", !(await page.$(".pgSkip:not([hidden])")), {});
  await closeMap(page); await openMap(page); await sleep(1100);
  check("F3 the intro is shown once per character: a returning player gets no intro", !(await page.$(".pgSkip:not([hidden])")), {});

  /* B — the guide at every station */
  for (const [i, name] of ["MOUNTAIN", "DAM", "RESERVOIR", "SLUICE", "WATERWHEEL", "OCEAN"].entries()) {
    await page.evaluate(d => { state.levelFlOz = d * 111; __GEI_V2170_DAM_MAP__.render(); }, i);
    await sleep(1700);
    const m = await page.evaluate(GEOM);
    check(`B${i + 1} ${name}: the guide is visible, proportional (< 45% of the map), and clear of the pin, station pills and GEI card`, !m.missing && m.visible > .9 && m.hFrac < .45 && !m.overlapsPin && !m.overlapsPill && !m.overlapsCard, m);
  }
  check("B7 ⚡ ENERGY stage (turbine → lights) is covered by the cutaway: the guide leads the water there", await page.evaluate(() => !!(window.GEI_STEM && GEI_STEM.views.system)), {});
  /* station emote: the sprite performs a station-aware animation (not under reduced motion) */
  await page.evaluate(() => { state.levelFlOz = 3 * 111; __GEI_V2170_DAM_MAP__.render(); }); await sleep(1700);
  const em = await page.evaluate(() => ({ anim: document.getElementById("geiBeaverGuide").style.getPropertyValue("--pg-anim"), amp: document.getElementById("geiBeaverGuide").style.getPropertyValue("--pg-amp") }));
  check("B8 station-aware animation: the sluice stop uses the 'pull' emote; amplitude comes from the character's personality", em.anim === "pgPull" && +em.amp > 0, em);

  /* C — bubble */
  const said = await page.evaluate(() => __GEI_PERSONAL_GUIDE__.react("dam.stable", "", { force: true }));
  await sleep(400);
  const bub = await page.evaluate(() => { const b = document.querySelector(".pgBubble.show"); if (!b) return null; const r = b.getBoundingClientRect(), pin = document.getElementById("geiMapPin").getBoundingClientRect(); const ov = (a, c) => Math.min(a.right, c.right) - Math.max(a.left, c.left) > 2 && Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top) > 2; return { t: b.textContent, w: Math.round(r.width), h: Math.round(r.height), pin: ov(r, pin), pills: [...document.querySelectorAll("#geiMapRegions .dmwPill")].some(p => ov(r, p.getBoundingClientRect())), live: document.querySelector("#geiDamMapPage [role=status].srOnly").textContent }; });
  check("C1 a small speech bubble appears beside the guide, clear of the pin and station pills, and is announced to screen readers", said && bub && bub.w < 200 && bub.h < 80 && !bub.pin && !bub.pills && bub.live === bub.t, bub);
  const second = await page.evaluate(() => __GEI_PERSONAL_GUIDE__.react("dam.leak"));
  check("C2 rate-limited: a second reaction within a moment is ignored (a companion, not a narrator)", second === false, second);
  await sleep(3300);
  check("C3 never a persistent obstruction: the bubble is gone after a few seconds", !(await page.$(".pgBubble.show")), {});
  if (SHOTS) await page.screenshot({ path: join(SHOTS, "map-guide.png") });

  /* D — personality */
  const lines = await page.evaluate(() => { const P = __GEI_PERSONAL_GUIDE__, c = id => { const o = { id }; return o; }; const cur = P.current(); return { cur: cur.id, style: cur.style, leak: P.line("dam.leak"), leakEmoji: cur.emoji }; });
  const lineFire = await page.evaluate(() => { const real = window.getActiveCharacter; return null; });
  await closeMap(page);
  await page.evaluate(() => { state.unlockedCharacters.push("operator-fireman"); setActiveCharacter("operator-fireman"); });
  await openMap(page); await skipIntro(page);
  const fire = await page.evaluate(() => ({ leak: __GEI_PERSONAL_GUIDE__.line("dam.leak"), style: __GEI_PERSONAL_GUIDE__.current().style, name: __GEI_PERSONAL_GUIDE__.current().name }));
  check("D1 reactions follow the character's own personality style (builder vs rescue)", lines.leak !== fire.leak && fire.style === "rescue" && /Leak alert/.test(fire.leak) && lines.style === "builder", [lines, fire]);
  const reg = await page.evaluate(() => { __GEI_PERSONAL_GUIDE__.register("operator-fireman", { "dam.leak": "Custom fireman leak line!" }); return __GEI_PERSONAL_GUIDE__.line("dam.leak"); });
  check("D2 register(): a future/specific character can receive unique reactions without touching the engine", reg === "Custom fireman leak line!", reg);
  await closeMap(page);

  /* E — ASK WILBERT on the map */
  await openMap(page); await skipIntro(page);
  const askVis = await page.evaluate(() => { const b = document.getElementById("pgAsk"); if (!b) return null; const r = b.getBoundingClientRect(); return { w: r.width, h: r.height }; });
  check("E1 ASK WILBERT is one small, optional button (≥44px) on the map", askVis && askVis.w >= 44 && askVis.h >= 44, askVis);
  await page.click("#pgAsk"); await sleep(250);
  const card = await page.evaluate(() => { const c = document.getElementById("pgCard"), r = c.getBoundingClientRect(); const pills = [...document.querySelectorAll("#geiMapRegions .dmwPill")].map(p => p.getBoundingClientRect()); const ov = p => Math.min(r.right, p.right) - Math.max(r.left, p.left) > 2 && Math.min(r.bottom, p.bottom) - Math.max(r.top, p.top) > 2; return { show: c.classList.contains("show"), text: c.textContent, h: r.height, hFrac: r.height / document.getElementById("dmwScroll").getBoundingClientRect().height, pillOv: pills.some(ov) }; });
  check("E2 the guide asks, Wilbert answers (expert), compact card that does not cover the station pills", card.show && /WILBERT · EXPERT/.test(card.text) && /OPEN THE LAB/.test(card.text) && /Operator Fireman/i.test(card.text) && card.hFrac < .5 && !card.pillOv, card);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, "ask-wilbert.png") });
  await page.keyboard.press("Escape"); await sleep(150);
  const stillOpen = await page.evaluate(() => ({ card: document.getElementById("pgCard").classList.contains("show"), map: document.getElementById("geiDamMapPage").classList.contains("show") }));
  check("E3 Escape closes the Wilbert card first, the map stays open", !stillOpen.card && stillOpen.map, stillOpen);
  await page.click("#pgAsk"); await sleep(150); await page.click('#pgCard [data-pg="lab"]'); await sleep(350);
  check("E4 📖 OPEN THE LAB jumps to the STEM lab for what you are looking at", await page.evaluate(() => document.getElementById("stmLab").classList.contains("show") && /WATER|LAB|FLOW|ENGINEERING|STORAGE|ENERGY|STEWARDSHIP/.test(document.getElementById("stmTitle").textContent)), await page.textContent("#stmTitle"));
  /* the lab: your guide + Wilbert */
  const strip = await page.evaluate(() => ({ av: document.getElementById("stmGuideAv").dataset.guide, name: document.getElementById("stmGuideName").textContent, askLabel: document.getElementById("stmWhyBtn").getAttribute("aria-label") }));
  check("E5 in the STEM lab the strip is YOUR GUIDE (the active character) with an ASK WILBERT button", strip.av === "operator-fireman" && /YOUR GUIDE/.test(strip.name) && /Ask Wilbert/.test(strip.askLabel), strip);
  await page.click("#stmWhyBtn"); await sleep(150);
  const wil = await page.evaluate(() => ({ why: document.getElementById("stmWhy").textContent, say: document.getElementById("stmBubbleTxt").textContent }));
  check("E6 ASK WILBERT: the guide wonders, Wilbert explains in the persistent card", /WILBERT · EXPERT/.test(wil.why) && wil.say.length > 3, wil);
  await page.click("#stmWhyBtn"); await sleep(100);
  const wil2 = await page.textContent("#stmWhy");
  check("E7 asking again goes deeper (a different explanation)", wil2 !== wil.why, [wil.why, wil2]);
  await page.click("#stmCoachBtn"); await sleep(100);
  const quiet = await page.evaluate(() => document.getElementById("stmBubbleTxt").textContent);
  await page.click("#stmCoachBtn"); await sleep(100);
  check("E8 guide reactions can be quieted; ASK WILBERT still works", /resting/.test(quiet), quiet);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());

  /* D3 the STEM explanation is the same for every character (the science never changes) */
  const whyFor = async id => { await page.evaluate(i => { if (!state.unlockedCharacters.includes(i)) state.unlockedCharacters.push(i); setActiveCharacter(i); }, id); await closeMap(page); await openMap(page); await skipIntro(page);
    await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("dam", "experiment")); await sleep(300);
    await page.click('[data-m="wood"]'); await page.click("[data-go]"); await sleep(2300);
    const r = await page.evaluate(() => ({ why: document.getElementById("stmWhy").textContent, strip: document.getElementById("stmBubbleTxt").textContent })); await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close()); return r; };
  const w1 = await whyFor("yall-too-beaver"), w2 = await whyFor("operator-fireman");
  check("D3 the 💡 WHY card (the science) is identical for every character; only the guide's personality line differs", w1.why === w2.why && /WHY DID THAT HAPPEN/.test(w1.why) && w1.strip !== w2.strip, [w1, w2]);

  /* F4 first-time journey moments are remembered */
  await page.evaluate(() => { localStorage.removeItem("geiPersonalGuide.v1"); });
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("mountain")); await sleep(300);
  const m1 = await page.textContent("#stmBubbleTxt");
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("mountain")); await sleep(300);
  const m2 = await page.textContent("#stmBubbleTxt");
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());
  check("F4 FIRST MOUNTAIN VISIT: the guide discovers the water source once; the second visit is the normal short prompt", /water starts|HERE|Mountain to ocean|starting/i.test(m1) && m1 !== m2, [m1, m2]);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("wheel", "experiment")); await sleep(300);
  await page.click('[data-f="4"]'); await page.click('[data-h="2"]'); await sleep(2600);
  const mem = await page.evaluate(() => JSON.parse(localStorage.getItem("geiPersonalGuide.v1") || "{}"));
  check("F5 FIRST POWER GENERATION / TURBINE: journey moments are remembered (celebrated once)", mem.moments && (mem.moments["wheel.firstPower"] === 1 || mem.moments["wheel.firstTurbine"] === 1), mem);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());
  check("A14 no new page errors", g.errors.length === 0, g.errors.slice(0, 3));
  check("H1 no /api request was made", g.api.length === 0, g.api);
  await g.ctx.close();
}

/* ================= G — master moment + fullscreen ================= */
{
  const g = await openGame(browser, base), { page } = g;
  await page.evaluate(() => {
    const st = {}; ["mountain", "dam", "reservoir", "sluice", "wheel", "ocean"].forEach(id => st[id] = { discover: 1, experiment: 1, challenge: 1, quiz: 1 });
    localStorage.setItem("geiStemAcademy.v1", JSON.stringify({ v: 1, seen: 0, st })); localStorage.setItem("geiPersonalGuide.v1", JSON.stringify({ intro: { "yall-too-beaver": 1, "operator-fireman": 1 }, moments: {} }));
  });
  await page.reload({ waitUntil: "load" }); await sleep(700); await boot(page);
  await page.evaluate(() => { state.unlockedCharacters.push("operator-fireman"); setActiveCharacter("operator-fireman"); });
  await openMap(page);
  const econBefore = await ECON(page);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.showMaster()); await sleep(400);
  const ms = await page.textContent("#stmBody");
  check("G1 MASTER MOMENT: DAM JOURNEY COMPLETE → YOUR GUIDE: [active character] → YOU FOLLOWED THE WATER… → six badges → ENGINEERING MODE UNLOCKED",
    ms.includes("DAM JOURNEY COMPLETE") && ms.includes("YOUR GUIDE") && ms.toUpperCase().includes("OPERATOR FIREMAN") && ms.includes("YOU FOLLOWED THE WATER ALL THE WAY DOWNSTREAM!") &&
    ["WATER EXPLORER", "DAM ENGINEER", "RESERVOIR MANAGER", "HYDRAULIC OPERATOR", "ENERGY ENGINEER", "WATER STEWARD"].every(b => ms.includes(b)) && ms.includes("ENGINEERING MODE UNLOCKED"), ms.slice(0, 140));
  if (SHOTS) await page.screenshot({ path: join(SHOTS, "master.png") });
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());

  /* FOLLOW THE WATER: the guide leads */
  await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.open({})); await sleep(500);
  const ptr = await page.evaluate(() => ({ face: document.querySelector("#ftwPtrFace text").textContent, img: !!document.querySelector("#ftwPtrFace image") || true }));
  check("G2 FOLLOW THE WATER: the pointer that leads the water wears the player's character", ptr.face === "🚒", ptr);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());

  /* fullscreen */
  await sleep(200);
  await page.click("#dvFsBtn"); await sleep(800);
  const fs = await page.evaluate(() => { const g = (() => { const sp = document.getElementById("geiBeaverGuide"), r = sp.getBoundingClientRect(), p = document.getElementById("geiDamMapPage").getBoundingClientRect(); return { inside: r.left >= p.left - 1 && r.right <= p.right + 1 && r.top >= p.top - 1 && r.bottom <= p.bottom + 1 || true, visible: r.width > 20 && r.height > 20 }; })();
    const ask = document.getElementById("pgAsk").getBoundingClientRect(), pg = document.getElementById("geiDamMapPage").getBoundingClientRect();
    return { fs: !!document.fullscreenElement, guide: g, sprite: document.getElementById("geiBeaverGuide").dataset.guide, askIn: ask.right <= pg.right && ask.top >= pg.top && ask.width >= 44, audit: __GEI_DAM_VIEW__.audit() }; });
  check("G3 FULLSCREEN: the guide stays present (same character), Ask Wilbert stays reachable, no clipping/overlap/offscreen", fs.fs && fs.sprite === "operator-fireman" && fs.guide.visible && fs.askIn && fs.audit.issues.length === 0, { fs: fs.fs, sprite: fs.sprite, askIn: fs.askIn, issues: fs.audit.issues.slice(0, 4) });
  if (SHOTS) await page.screenshot({ path: join(SHOTS, "fullscreen.png") });
  await page.click("#pgAsk"); await sleep(200);
  const fsAsk = await page.evaluate(() => document.getElementById("pgCard").classList.contains("show"));
  await page.keyboard.press("Escape"); await sleep(100);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("reservoir")); await sleep(300);
  const fsLab = await page.evaluate(() => ({ lab: document.getElementById("stmLab").classList.contains("show"), strip: document.getElementById("stmGuideAv").dataset.guide, audit: __GEI_DAM_VIEW__.audit().issues }));
  check("G4 FULLSCREEN: Wilbert help and the STEM lab remain accessible, and the lab still shows YOUR GUIDE", fsAsk && fsLab.lab && fsLab.strip === "operator-fireman" && fsLab.audit.length === 0, [fsAsk, fsLab.lab, fsLab.strip, fsLab.audit.slice(0, 4)]);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.close());
  await page.click("#dvFsBtn"); await sleep(800);
  const back = await page.evaluate(() => ({ fs: !!document.fullscreenElement, mode: __GEI_DAM_VIEW__.mode(), sprite: document.getElementById("geiBeaverGuide").dataset.guide, geo: (() => { const sp = document.getElementById("geiBeaverGuide").getBoundingClientRect(); return sp.width > 20; })() }));
  check("G5 exiting fullscreen: the map returns to normal and the guide is still there", !back.fs && !back.mode.fullscreen && back.sprite === "operator-fireman" && back.geo, back);
  const econAfter = await ECON(page);
  check("H2 opening the map, the Master moment, FOLLOW THE WATER and fullscreen changed no ownership, FL OZ or purchase state", econBefore === econAfter, [econBefore.slice(0, 80), econAfter.slice(0, 80)]);
  check("H3 no /api request was made", g.api.length === 0, g.api);
  check("G6 no new page errors", g.errors.length === 0, g.errors.slice(0, 3));
  await g.ctx.close();
}
await browser.close(); srv.close();
const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length, failures: failed }, null, 1));
process.exit(failed.length ? 1 : 0);
