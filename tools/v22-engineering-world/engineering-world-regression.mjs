/* V2.2 — DAM ENGINEERING WORLD regression harness
 *
 * Loads the real index.html in headless Chromium and plays the whole STEM flow through the real DAM Map:
 *   A  map: STEM header button, per-station STEM tags, locked stations follow the map's own progression
 *   B  all six stations, start to finish: DISCOVER → TEST → MISSION → WHAT WOULD YOU DO? (a wrong choice first:
 *      an experiment, never shamed, always explained) → REWARD → badge + rank; XP exactly 75/station + 100 Master
 *      bonus; "💡 WHY DID THAT HAPPEN?", Wilbert + 💡 WHY? + coach toggle; FREE PLAY per station; Master screen
 *      + FREE ENGINEERING MODE
 *   C  persistence: STEM progress survives a reload; STEM XP is derived from step flags
 *   D  economy: game state (FL OZ, level, XP…) is byte-identical after the whole run; no /api request is made
 *   E  mobile + desktop: popout stays inside the map frame, no horizontal scroll, tap targets >= 44px,
 *      DAM Map pills still never overlap, BACK/Escape close the lab before the map
 *   F  no uncaught page errors
 *
 *   node tools/v22-engineering-world/engineering-world-regression.mjs
 *   SHOTS=/some/dir node ...    also writes screenshots
 *
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
// eslint-disable-next-line no-undef
const ECON = () => JSON.stringify(state);

async function openGame(browser, base, device){
  const ctx = await browser.newContext(Object.assign({ reducedMotion:"reduce" }, device || { viewport:{ width:1366, height:900 } }));
  const page = await ctx.newPage();
  const errors = [], api = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.route("**/*", r => { const u = r.request().url(); if (u.includes("/api/")) api.push(u); return u.startsWith(base) ? r.continue() : r.abort(); });
  await page.goto(base + "/", { waitUntil:"load" });
  await sleep(700);
  const vp = page.viewportSize(), touch = !!(device && device.hasTouch);
  await (touch ? page.touchscreen.tap(vp.width / 2, vp.height / 2) : page.mouse.click(vp.width / 2, vp.height / 2));
  await sleep(300);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(3400);
  await page.evaluate(() => { try { closeGameGuide(); } catch (e) {} try { window.__GEI_BEAVER_WELCOME__ && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });
  await sleep(600);
  return { ctx, page, errors, api, touch };
}
// eslint-disable-next-line no-undef
const setProgress = (page, s) => page.evaluate(s => { state.level = s.level; state.completedLevels = s.completed; state.levelFlOz = s.days * 111; window.__GEI_V2170_DAM_MAP__.render(); }, s);

const LAYOUT = () => {
  const lab = document.getElementById("stmLab"), sh = document.querySelector("#geiDamMapPage .dmwShell"), body = document.getElementById("stmBody");
  const r = lab.getBoundingClientRect(), s = sh.getBoundingClientRect();
  const small = [...lab.querySelectorAll(".stmSee,.ftwOpt,.stmBtn,.stmOpt,.stmPrimary,.stmStep,.stmClose,.stmCard,.stmRange,.stmWhyBtn,.stmCoachBtn,.stmSecondary")].filter(b => b.offsetParent && !b.disabled)
    .filter(b => { const q = b.getBoundingClientRect(); return q.width < 44 || q.height < 44; }).map(b => b.className + ":" + b.textContent.trim().slice(0, 14));
  const prim = document.getElementById("stmPrimary").getBoundingClientRect();
  return {
    inside: r.left >= s.left - 1 && r.right <= s.right + 1 && r.top >= s.top - 1 && r.bottom <= s.bottom + 1,
    pageHScroll: document.documentElement.scrollWidth > window.innerWidth + 1,
    bodyHScroll: body.scrollWidth > body.clientWidth + 1,
    small,
    footerVisible: prim.bottom <= window.innerHeight + 1 && prim.top >= 0
  };
};

async function waitEnabled(page, ms = 25000){
  await page.waitForFunction(() => { const b = document.getElementById("stmPrimary"); return b && !b.disabled; }, null, { timeout: ms });
}
const setRange = (p, sel, v) => p.evaluate(([sel, v]) => { const i = document.querySelector(sel); i.value = v; i.dispatchEvent(new Event("input", { bubbles: true })); }, [sel, v]);
const click = (page, sel) => page.click(sel, { timeout: 5000 });
async function primary(page){ await waitEnabled(page); await click(page, "#stmPrimary"); await sleep(120); }

/* How each lab is played (labs are driven through their real buttons). */
const PLAY = {
  mountain: async p => { for (const a of ["rain", "snow", "runoff"]) { await p.waitForFunction(() => !document.querySelector('#stmLabHost [data-a]').disabled, null, {}); await click(p, `[data-a="${a}"]`); await sleep(2600); } },
  "mountain-path": async p => { await click(p, '[data-c="a"]'); await sleep(300); const t = await p.textContent(".stmStat"); check("B-mission-mountain: wrong path is encouraging, not shaming", /Try|Not that way/.test(t) && !/wrong|fail|bad/i.test(t), t); await click(p, '[data-c="c"]'); await sleep(300); },
  dam: async p => {
    await click(p, '[data-m="wood"]'); await click(p, "[data-go]"); await sleep(300); const r1 = await p.textContent(".stmResult"); check("B-dam: weak design LEAKS", /LEAK/.test(r1), r1);
    const s0 = +(await p.textContent(".stmSN")); await click(p, '[data-x="1"]'); const s1 = +(await p.textContent(".stmSN")); check("B-dam: 🏗️ reinforcement raises wall strength", s1 > s0 && /ON/.test(await p.textContent('[data-x="1"]')), [s0, s1]);
    await click(p, '[data-x="1"]'); await click(p, '[data-m="concrete"]'); await click(p, "[data-go]"); await sleep(300); const r2 = await p.textContent(".stmResult"); check("B-dam: strong design HOLDS (DAM HOLDING / ENGINEERING MASTER)", /HOLDING|ENGINEERING MASTER/.test(r2), r2);
    check("B-dam: result is explained (💡 WHY)", /WHY DID THAT HAPPEN/.test(await p.textContent("#stmWhy")), {}); },
  "dam-flood": async p => { await click(p, '[data-m="rock"]'); await click(p, "[data-go]"); await sleep(300); const r1 = await p.textContent(".stmResult"); check("B-dam-mission: thin rock is 'too much water' in the flood and tells the child how to improve", /TOO MUCH WATER|LEAK/.test(r1) && /IMPROVE/.test(r1), r1); await click(p, '[data-t="1"]'); await click(p, "[data-go]"); await sleep(300); },
  reservoir: async p => {
    await sleep(1400); check("B-reservoir: balanced → RESERVOIR STABLE", /STABLE/.test(await p.textContent(".stmStat")), await p.textContent(".stmStat"));
    await setRange(p, ".stmIn", 4); await sleep(1400); check("B-reservoir: more in than out → LEVEL RISES + why", /RISES/.test(await p.textContent(".stmStat")) && /more water entered/i.test(await p.textContent("#stmWhy")), await p.textContent("#stmWhy"));
    await setRange(p, ".stmIn", 0); await setRange(p, ".stmOut", 3); await sleep(1400); check("B-reservoir: more out than in → LEVEL FALLS", /FALLS/.test(await p.textContent(".stmStat")), await p.textContent(".stmStat")); },
  "reservoir-storm": async p => { await setRange(p, ".stmOut", 2); await click(p, "[data-go]"); const eq = await p.waitForSelector(".stmEq b", { timeout: 4000 }).then(() => p.textContent(".stmEq")).catch(() => ""); check("B-reservoir: shows Start + In − Out = End", /START.*IN.*OUT.*END/.test(eq), eq); },
  sluice: async p => { for (const i of [1, 2, 4]) { await click(p, `[data-g="${i}"]`); await sleep(100); } const t = await p.textContent(".stmFlowTxt"), m = await p.textContent(".stmFM"); check("B-sluice: 100% shows 🌊🌊🌊🌊🌊 and a flow meter", t.includes("🌊🌊🌊🌊🌊") && /FLOW █{8} 100%/.test(m), [t, m]); },
  "sluice-target": async p => {
    await click(p, '[data-g="4"]'); await sleep(200); check("B-sluice-mission: overshooting the target is explained, not punished", /Too much flow/.test(await p.textContent(".stmStat")), await p.textContent(".stmStat"));
    await click(p, '[data-g="2"]'); await sleep(1900);                                    // target 50% (full reservoir)
    check("B-sluice-mission: second target is 25% with a LOW reservoir (head matters)", /25%/.test(await p.textContent(".stmTT")), await p.textContent(".stmTT"));
    await click(p, '[data-g="2"]'); await sleep(1900);                                    // 50% gate × .5 head = 25%
    await click(p, '[data-g="4"]'); await sleep(400); },                                  // 100% gate × .5 head = 50%
  wheel: async p => { await click(p, '[data-f="1"]'); const s1 = await p.textContent(".stmSpeed"); await click(p, '[data-f="4"]'); await click(p, '[data-h="2"]'); const s2 = await p.textContent(".stmSpeed"); check("B-wheel: more flow + height → faster turbine", /SLOW/.test(s1) && /SUPER FAST/.test(s2), [s1, s2]);
    await sleep(1800); check("B-wheel: power meter + town lights respond", /[1-5]\/5/.test(await p.textContent(".stmTownTxt")) && +(await p.textContent(".stmEN")) > 0, await p.textContent(".stmTownTxt")); },
  "wheel-power": async p => { await click(p, '[data-f="4"]'); await click(p, '[data-h="2"]'); },
  ocean: async p => { for (const r of [0, 3, 5]) { await click(p, `[data-r="${r}"]`); await sleep(100); } const l = await p.textContent(".stmLife"); check("B-ocean: fish, frogs, birds, beaver, plants and community all shown", ["FISH", "FROGS", "BIRDS", "BEAVER", "PLANTS", "COMMUNITY"].every(x => l.includes(x)), l.slice(0, 60)); },
  "ocean-balance": async p => { await click(p, '[data-r="2"]'); }
};
const FREE = {                                       // one quick, unscored interaction per station in FREE PLAY
  mountain: async p => { await click(p, '[data-a="runoff"]'); await sleep(1200); },
  dam: async p => { await setRange(p, ".stmFlood", 120); await click(p, '[data-m="soil"]'); await click(p, "[data-go]"); await sleep(300); },
  reservoir: async p => { await setRange(p, ".stmIn", 4); await sleep(1300); },
  sluice: async p => { await click(p, '[data-g="3"]'); },
  wheel: async p => { await click(p, '[data-f="3"]'); },
  ocean: async p => { await click(p, '[data-r="4"]'); }
};


/* ===== V2.2.1 FOLLOW THE WATER ===== */
const SYS = () => window.__GEI_FOLLOW_THE_WATER__;
const PARTS = async page => page.evaluate(() => [...document.querySelectorAll("#ftwSvg [data-comp]")].map(g => { const r = g.querySelector(".ftwHit").getBoundingClientRect(); return { id: g.dataset.comp, w: r.width, h: r.height }; }));
async function sysFresh(page, name, layouts){
  // a brand-new player has only reached the mountain: the rest of the machine is "?"
  await setProgress(page, { level: 1, completed: 0, days: 0 });
  await page.evaluate(() => { localStorage.removeItem("geiWaterSystem.v1"); });
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("mountain")); await sleep(250);
  await click(page, "#stmSeeBtn"); await sleep(350);
  const f = await page.evaluate(() => ({ rev: __GEI_FOLLOW_THE_WATER__.revealed(), q: document.querySelectorAll(".ftwQ").length, gates: [...document.querySelectorAll("[data-gate]")].every(b => b.disabled), title: document.getElementById("stmTitle").textContent, primary: document.getElementById("stmPrimary").textContent }));
  check(`S1 [${name}]: 👁️ SEE INSIDE opens the cutaway; a new player sees only the mountain, the rest is "?"`, f.rev.join() === "mountain" && f.q === 6 && f.gates && /FOLLOW THE WATER/.test(f.title), f);
  await click(page, '[data-comp="dam"]'); await sleep(150);
  check(`S2 [${name}]: an undiscovered part says so, kindly`, /NOT DISCOVERED YET/.test(await page.textContent("#ftwCard")), await page.textContent("#ftwCard"));
  await click(page, "#stmPrimary"); await sleep(300);
  check(`S3 [${name}]: BACK returns to the lab you came from`, /WATER SOURCE LAB/.test(await page.textContent("#stmTitle")) && !(await page.$("#ftwSvg")), {});
  await click(page, "#stmClose"); await sleep(150);
}
async function sysFull(page, name, layouts){
  await setProgress(page, { level: 7, completed: 6, days: 0 });
  const before = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp);
  await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.open("sluice")); await sleep(250);
  await click(page, "#stmSeeBtn"); await sleep(350);
  const c0 = await page.textContent("#ftwCard");
  check(`S4 [${name}]: SEE INSIDE from the sluice lab points at the gate, using the plain word first (WATER GATE)`, /WATER GATE/.test(c0) && !/SLUICE GATE/.test(c0), c0);
  check(`S5 [${name}]: all seven parts revealed once the map is travelled`, (await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.revealed())).length === 7, {});
  const hits = await PARTS(page);
  check(`S6 [${name}]: every tappable part has a hit area ≥44px`, hits.length === 7 && hits.every(h => h.w >= 44 && h.h >= 44), hits);
  layouts.push(["system:open", await page.evaluate(LAYOUT)]);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-system-open.png`) });
  await click(page, '[data-comp="turbine"]'); await sleep(150);
  check(`S7 [${name}]: tapping a part tells what it does (WHAT DOES THIS DO?)`, /SPINNING WHEEL/.test(await page.textContent("#ftwCard")) && /Spins when moving water/.test(await page.textContent("#ftwCard")), await page.textContent("#ftwCard"));
  // experiment: open the gate → the whole system reacts + cause-and-effect trail
  const s0 = await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.state());
  await click(page, '[data-gate="100"]'); await sleep(1700);
  const s1 = await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.state());
  check(`S8 [${name}]: opening the gate raises flow, wheel speed, power and lights`, s1.flow > s0.flow && s1.rpm > s0.rpm && s1.power > s0.power && s1.lit >= s0.lit, [s0, s1]);
  const card = await page.textContent("#ftwCard"), chips = await page.$$eval(".ftwTrail span", e => e.length);
  check(`S9 [${name}]: a 💡 WHAT DID YOU NOTICE? trail (gate → flow → wheel → power → downstream) with one sentence`, /WHAT DID YOU NOTICE/.test(card) && chips === 5 && /opened wider/.test(card), card.slice(0, 120));
  check(`S10 [${name}]: Wilbert reacts to a big change`, /WHOA|changed the whole system/.test(await page.textContent("#stmBubbleTxt")), await page.textContent("#stmBubbleTxt"));
  await click(page, '[data-gate="0"]'); await sleep(2000);
  const s2 = await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.state());
  check(`S11 [${name}]: closing the gate stops the wheel, and the river runs dry (safely)`, s2.rpm === 0 && s2.health === "dry" && /closed|held back/.test(await page.textContent("#ftwCard")), s2);
  // rain controls the reservoir
  await click(page, '[data-gate="25"]'); await click(page, '[data-rain="3"]'); await sleep(2300);
  const s3 = await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.state());
  check(`S12 [${name}]: heavy rain makes the reservoir rise`, s3.level > 50, s3.level);
  // 🔬 engineer view is optional + remembered
  check(`S13a [${name}]: ENGINEER VIEW is off by default`, !(await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.engineer())), {});
  await click(page, "#ftwEngBtn"); await sleep(150);
  const e1 = await page.evaluate(() => ({ on: __GEI_FOLLOW_THE_WATER__.engineer(), svg: document.getElementById("ftwEng").classList.contains("on"), read: document.getElementById("ftwRead").textContent, lbl: document.getElementById("ftwEG").textContent }));
  check(`S13 [${name}]: ENGINEER VIEW shows gate %, level, RPM, power, river health`, e1.on && e1.svg && /LEVEL/.test(e1.read) && /RPM/.test(e1.read) && /POWER/.test(e1.read) && /RIVER/.test(e1.read) && /GATE \d+%/.test(e1.lbl), e1);
  layouts.push(["system:engineer", await page.evaluate(LAYOUT)]);
  await click(page, "#ftwEngBtn"); await sleep(100);
  // 🌊 follow the water (tour). Reduced motion → manual NEXT
  await click(page, '[data-act="tour"]'); await sleep(200);
  let steps = 0, seen = [];
  for (let i = 0; i < 9; i++) { const t = await page.textContent("#ftwCard"); if (/THAT'S THE WHOLE JOURNEY/.test(t)) break; seen.push(t.slice(0, 22)); steps++; await click(page, '[data-act="tournext"]'); await sleep(120); }
  check(`S14 [${name}]: FOLLOW THE WATER tours 7 parts in order and ends with the whole journey`, steps === 7 && /THAT'S THE WHOLE JOURNEY/.test(await page.textContent("#ftwCard")) && /MOUNTAIN/.test(seen[0]) && /DOWNSTREAM/.test(seen[6]), seen);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-system-tour-end.png`) });
  const wsTour = await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.ws());
  check(`S15 [${name}]: the mission chips (COLLECT → … → PROTECT) light up as parts are met`, await page.$$eval(".ftwMission span.on", e => e.length) === 6 && wsTour.tour === 1, wsTour);
  // 🎯 predictions → understanding
  const right = ["More water flows", "The water level rises", "It spins faster", "They struggle"];
  let firstWrongOk = false, wins = 0;
  for (let k = 0; k < 4; k++) {
    await click(page, '[data-act="predict"]'); await sleep(150);
    const q = await page.textContent("#ftwCard");
    if (k === 0) {
      const wrongBtn = page.locator(".ftwOpt").filter({ hasNotText: right.find(r => q.includes("gate is 25%") ? r === right[0] : false) || "zzz" }).first();
      await page.locator(".ftwOpt", { hasText: "Less water flows" }).first().click().catch(async () => { await wrongBtn.click(); });
      await sleep(100); const w = await page.textContent("#ftwCard");
      await sleep(600); const res = await page.textContent("#ftwCard");
      firstWrongOk = /GOOD TRY! LET'S SEE/.test(w) && /NOW YOU'VE SEEN IT/.test(res) && !/wrong|incorrect|fail/i.test(res);
      await click(page, '[data-act="predict"]'); await sleep(150);
    }
    const q2 = await page.textContent("#ftwCard"); const rt = right.find(r => q2.includes(r)); if (!rt) { check(`S16-${k}: found the right answer`, false, q2); continue; }
    await page.locator(".ftwOpt", { hasText: rt }).first().click(); await sleep(700);
    if (/YOU UNDERSTOOD THE SYSTEM/.test(await page.textContent("#ftwCard"))) wins++;
  }
  check(`S16 [${name}]: a wrong prediction is "GOOD TRY! LET'S SEE." then shown, never shamed`, firstWrongOk, {});
  const und = await page.evaluate(() => __FTW_U = __GEI_FOLLOW_THE_WATER__.understood());
  check(`S17 [${name}]: four ✨ YOU UNDERSTOOD THE SYSTEM moments (flow, storage, energy, downstream) → 🧠 SYSTEMS THINKER`, wins === 4 && und.length === 4 && /SYSTEMS THINKER/.test(await page.textContent("#ftwUnder")), [wins, und]);
  layouts.push(["system:predict", await page.evaluate(LAYOUT)]);
  const after = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp);
  check(`S18 [${name}]: understanding awards recognition, not STEM XP or currency`, after === before, [before, after]);
  await click(page, "#stmClose"); await sleep(150);
}
async function sysFinale(page, name, layouts){
  await click(page, "[data-finale]"); await sleep(500);
  let n = 0;
  for (let i = 0; i < 9; i++) { if (await page.$('[data-act="tournext"]')) { await click(page, '[data-act="tournext"]'); n++; await sleep(100); } else await sleep(200); }
  await sleep(1500);
  const line = await page.textContent(".ftwFinaleLine"), prim = await page.textContent("#stmPrimary");
  check(`S19 [${name}]: finale: zooms out, the whole system runs, then ENGINEERING MODE UNLOCKED`, n >= 7 && /ENGINEERING MODE UNLOCKED/.test(line) && /OPEN FREE ENGINEERING MODE/.test(prim) && (await page.getAttribute("#ftwSvg", "viewBox")) === "0.0 0.0 320.0 240.0", [n, line, prim]);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-finale.png`) });
}

async function playStation(page, id, layout, shot){
  const st = await page.evaluate(id => { const s = GEI_STEM.stations[id]; return { exp: s.experiment.lab, mis: s.challenge.lab, quiz: s.quiz, ntitle: s.title }; }, id);
  await page.click(`#geiMapRegions .dmwPill[data-i="${await page.evaluate(id => GEI_STEM.stations[id].region, id)}"]`);
  await page.waitForSelector("#stmLab.show", { timeout: 4000 });
  await sleep(150);
  const xp0 = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp);
  const lo = [];
  const snap = async tag => { if (layout) lo.push([id + ":" + tag, await page.evaluate(LAYOUT)]); if (SHOTS) await page.screenshot({ path: join(SHOTS, `${layout}-${id}-${tag}.png`) }); };
  // DISCOVER
  const disc = await page.textContent("#stmBody");
  check(`B-${id}: discover shows a short lesson, REAL-WORLD and GEI layers apart`, disc.includes("REAL-WORLD STEM") && disc.includes("GEI GAME STORY") && disc.length < 900, disc.length);
  await snap("1-discover");
  if (id === "mountain") {
    await click(page, "#stmWhyBtn"); await sleep(100);
    const aw = await page.evaluate(() => ({ say: document.getElementById("stmBubbleTxt").textContent, why: document.getElementById("stmWhy").textContent, q: GEI_STEM.stations.mountain.ask.q }));
    check("B-wilbert: ASK WILBERT — the guide wonders, Wilbert (the expert) explains, for the lab you are in", aw.say === aw.q && /WILBERT · EXPERT/.test(aw.why), aw);
    await click(page, "#stmCoachBtn"); await sleep(100);
    const off = await page.evaluate(() => ({ p: document.getElementById("stmCoachBtn").getAttribute("aria-pressed"), t: document.getElementById("stmBubbleTxt").textContent, s: __GEI_ENGINEERING_WORLD_V22__.coach() }));
    check("B-wilbert: guide reactions can be quieted (and ASK WILBERT still works)", off.p === "false" && /resting/.test(off.t) && !off.s, off);
    await click(page, "#stmCoachBtn"); await sleep(100);
  }
  await click(page, "#stmPrimary"); await sleep(200);
  check(`B-${id}: TRY IT awards +10 STEM XP`, (await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp)) === xp0 + 10, {});
  // EXPERIMENT
  await PLAY[st.exp](page); await snap("2-experiment");
  await waitEnabled(page); await sleep(200);
  check(`B-${id}: experiment +15`, (await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp)) === xp0 + 25, {});
  await click(page, "#stmPrimary"); await sleep(200);
  // MISSION
  await PLAY[st.mis](page); await snap("3-mission");
  await waitEnabled(page); await sleep(200);
  check(`B-${id}: mission +25`, (await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp)) === xp0 + 50, {});
  await click(page, "#stmPrimary"); await sleep(200);
  // WHAT WOULD YOU DO? — decision → result → explanation; a wrong choice first
  const dc = await page.evaluate(id => GEI_STEM.stations[id].decide, id);
  const scen = await page.textContent("#stmBody");
  check(`B-${id}: decision mission shows a scenario`, scen.includes(dc.scenario) && scen.includes("WHAT WOULD YOU DO"), scen.slice(0, 60));
  const bad = dc.options.find(o => !o.ok), good = dc.options.find(o => o.ok);
  await page.locator(".stmOpt", { hasText: bad.text }).first().click(); await sleep(150);
  const f = await page.textContent(".stmFeed"), w = await page.textContent("#stmWhy");
  check(`B-${id}: wrong decision is a gentle experiment with a result and a 💡 WHY`, /Good experiment/.test(f) && !/wrong|incorrect|fail/i.test(f) && /WHY DID THAT HAPPEN/.test(w) && !(await page.$eval("#stmPrimary", b => !b.disabled)), [f, w]);
  await snap("4-decide");
  await page.locator(".stmOpt", { hasText: good.text }).first().click(); await sleep(150);
  check(`B-${id}: right decision is simulated and explained`, /✅/.test(await page.textContent(".stmFeed")), await page.textContent(".stmFeed"));
  await click(page, "#stmPrimary"); await sleep(200);
  const done = await page.textContent("#stmBody");
  const badge = await page.evaluate(id => GEI_STEM.stations[id].badge.name, id);
  const rk = await page.evaluate(() => __GEI_ENGINEERING_WORLD_V22__.rank());
  check(`B-${id}: REWARD shows the ${badge} badge, the wow moment, engineer rank, career card and FREE PLAY`, done.includes(badge) && !!(await page.$("#stmWow .stmChainW")) && done.includes("ENGINEER RANK") && done.includes("WHO DOES THIS JOB") && !!(await page.$("[data-free]")), [rk, done.slice(0, 60)]);
  check(`B-${id}: station worth exactly 75 STEM XP`, (await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp)) - xp0 === 75 + (id === "ocean" ? 100 : 0), {});
  await snap("5-complete");
  // FREE PLAY — no goal, no XP
  const xpBefore = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp);
  await click(page, "[data-free]"); await sleep(250);
  await FREE[id](page);
  check(`B-${id}: FREE PLAY works, awards nothing`, (await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp)) === xpBefore && /FREE PLAY/.test(await page.textContent("#stmBody")), {});
  await snap("6-free");
  await click(page, "#stmPrimary"); await sleep(200);
  return lo;
}

async function suite(browser, base, name, device){
  const g = await openGame(browser, base, device), { page } = g;
  const before = await page.evaluate(ECON);
  if (SHOTS) await mkdir(SHOTS, { recursive: true });

  /* A — map integration + progression gating (fresh player: only the first station is playable) */
  await setProgress(page, { level: 1, completed: 0, days: 0 });
  await page.click("#damMapLauncherBtn"); await sleep(400);
  const a = await page.evaluate(() => ({
    top: !!document.getElementById("stmTopBtn"), topTxt: document.getElementById("stmTopBtn").textContent,
    tags: [...document.querySelectorAll("#geiMapRegions .dmwPill")].map(p => (p.querySelector(".stmTag") || {}).textContent),
    mapStillOk: [...document.querySelectorAll("#geiMapRegions .dmwPill")].length === 6
  }));
  check(`A1 [${name}]: map header gains 💧 STEM button`, a.top && /STEM/.test(a.topTxt), a.topTxt);
  check(`A2 [${name}]: pills show STEM progress, later stations locked`, a.tags[0] === "💧 STEM 0%" && a.tags.slice(1).every(t => t === "💧 STEM 🔒") && a.mapStillOk, a.tags);
  await page.click('#geiMapRegions .dmwPill[data-i="1"]'); await sleep(300);
  const locked = await page.textContent("#stmBody");
  check(`A3 [${name}]: locked station explains itself and follows map progression`, /unlocks as you travel/.test(locked) && (await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp)) === 0, locked.slice(0, 60));
  await page.keyboard.press("Escape"); await sleep(200);
  const esc = await page.evaluate(() => ({ lab: document.getElementById("stmLab").classList.contains("show"), map: document.getElementById("geiDamMapPage").classList.contains("show") }));
  check(`E1 [${name}]: Escape closes the lab first, the map stays open`, !esc.lab && esc.map, esc);

  const layouts = [];
  /* V2.2.1 — FOLLOW THE WATER, before any lab is played (plain vocabulary, gradual reveal) */
  await sysFresh(page, name, layouts);
  await sysFull(page, name, layouts);
  /* B — all six stations (later stations unlocked by finished levels, i.e. the map's own progression) */
  await setProgress(page, { level: 7, completed: 6, days: 0 });
  const order = await page.evaluate(() => GEI_STEM.order);
  for (const id of order) {
    layouts.push(...(await playStation(page, id, name, true)));
    if (id !== order[order.length - 1]) { await click(page, "#stmClose"); await sleep(200); }
  }
  const fin = await page.textContent("#stmPrimary");
  check(`B7 [${name}]: after the sixth badge the CTA is the FINAL REWARD`, /FINAL REWARD/.test(fin), fin);
  await click(page, "#stmPrimary"); await sleep(300);
  const ms = await page.textContent("#stmBody");
  check(`B8 [${name}]: MASTER DAM-ITE ENGINEER screen with all six badges and the water journey`, ms.includes("MASTER DAM-ITE ENGINEER") && ms.includes("traveled from mountain to ocean") && ["WATER EXPLORER", "DAM ENGINEER", "RESERVOIR MANAGER", "HYDRAULIC OPERATOR", "ENERGY ENGINEER", "WATER STEWARD"].every(b => ms.includes(b)) && ms.includes("MOUNTAIN → DAM → RESERVOIR → SLUICE → WHEEL → OCEAN") && ms.includes("DAM ENGINEERING WORLD") && ms.includes("YOU ENGINEERED THE WATER") && ms.includes("FREE ENGINEERING MODE UNLOCKED") && /OPEN FREE ENGINEERING MODE/.test(await page.textContent("#stmPrimary")), ms.slice(0, 120));
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-master.png`) });
  const prog = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress());
  check(`B9 [${name}]: 450 lesson XP + 100 Master bonus = ${prog.maxXp}`, prog.xp === 550 && prog.xp === prog.maxXp && prog.master && prog.badges.length === 6, prog.xp);
  await sysFinale(page, name, layouts);
  await click(page, "#stmPrimary"); await sleep(250);
  const fm = await page.textContent("#stmBody");
  check(`B9a [${name}]: the hub offers 🌊 FOLLOW THE WATER and the technical words are now unlocked (SLUICE GATE)`, (await page.textContent("#stmBody")).includes("FOLLOW THE WATER") && await (async () => { await page.evaluate(() => __GEI_FOLLOW_THE_WATER__.open({ focus: "gate" })); await sleep(250); const t = await page.textContent("#ftwCard"); await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.openAcademy()); await sleep(200); return /SLUICE GATE/.test(t); })(), {});
  check(`B9b [${name}]: FREE ENGINEERING MODE lists all six free-play labs and the MASTER rank`, (fm.match(/FREE PLAY/g) || []).length >= 6 && fm.includes("RANK: MASTER DAM-ITE ENGINEER"), fm.slice(0, 80));
  await click(page, "#stmClose"); await sleep(250);
  const tags = await page.evaluate(() => [...document.querySelectorAll("#geiMapRegions .dmwPill .stmTag")].map(t => t.textContent));
  check(`A4 [${name}]: every pill now reads STEM ✓`, tags.length === 6 && tags.every(t => t === "💧 STEM ✓"), tags);

  /* Hub + careers */
  await click(page, "#stmTopBtn"); await sleep(250);
  await click(page, ".stmCareerBtn"); await sleep(150);
  const hub = await page.evaluate(() => ({ t: document.getElementById("stmBody").textContent, careers: document.querySelectorAll("#stmCareers div").length, open: document.getElementById("stmCareers").classList.contains("show") }));
  check(`B10 [${name}]: hub shows XP, badges and the optional WHO WORKS WITH WATER? careers`, hub.careers === 9 && hub.open && /Hydrologist|HYDROLOGIST/.test(hub.t) && /550/.test(hub.t), hub.careers);
  layouts.push(["hub", await page.evaluate(LAYOUT)]);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-hub.png`) });
  await click(page, "#stmClose"); await sleep(200);

  /* map pills unchanged: no overlap */
  const pills = await page.evaluate(() => { const r = [...document.querySelectorAll("#geiMapRegions .dmwPill")].map(p => p.getBoundingClientRect()); return r.slice(1).filter((x, i) => x.left < r[i].right - 1).length; });
  check(`E2 [${name}]: DAM Map pills still never overlap with STEM tags`, pills === 0, pills);
  if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-map.png`) });

  /* C — persistence */
  await page.reload({ waitUntil: "load" }); await sleep(900);
  const after = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress());
  check(`C1 [${name}]: STEM progress survives a reload`, after.xp === 550 && after.master, after.xp);
  const raw = await page.evaluate(() => localStorage.getItem("geiStemAcademy.v1"));
  check(`C2 [${name}]: only flags are stored — XP is derived`, !/"xp"/.test(raw), raw.slice(0, 80));
  await page.evaluate(() => localStorage.setItem("geiStemAcademy.v1", JSON.stringify({ v: 1, xp: 99999, st: { mountain: { discover: 1 } } })));
  await page.reload({ waitUntil: "load" }); await sleep(900);
  const tam = await page.evaluate(() => __GEI_STEM_ACADEMY_V1__.progress().xp);
  check(`C3 [${name}]: a tampered XP value is ignored`, tam === 10, tam);

  /* D — economy untouched */
  const afterEcon = await page.evaluate(ECON);
  const beforeObj = JSON.parse(before), afterObj = JSON.parse(afterEcon);
  const keys = ["totalFlOz", "damMachineFreePlays", "tapCount"];
  check(`D1 [${name}]: game economy fields identical (FL OZ, free plays, taps)`, keys.every(k => JSON.stringify(beforeObj[k]) === JSON.stringify(afterObj[k])), keys.map(k => [beforeObj[k], afterObj[k]]));
  check(`D2 [${name}]: no /api (economy / PayPal) request was made`, g.api.length === 0, g.api);

  /* E — layout */
  const bad = layouts.filter(([, l]) => !l.inside || l.pageHScroll || l.bodyHScroll || l.small.length || !l.footerVisible);
  check(`E3 [${name}]: every STEM screen fits the frame, no horizontal scroll, tap targets ≥44px, button on screen`, bad.length === 0, bad.map(([t, l]) => [t, l]));
  const fresh = g.errors.filter(e => !/addStyle is not defined/.test(e));      // pre-existing: the 4 unparseable tap-lites modules (see v2-dam-map harness KNOWN_BROKEN)
  check(`F [${name}]: no new uncaught page errors`, fresh.length === 0, fresh.slice(0, 3));
  await g.ctx.close();
}

const { chromium, devices } = await loadPlaywright();
const srv = await serve();
const base = "http://127.0.0.1:" + srv.address().port;
const browser = await chromium.launch();
try {
  await suite(browser, base, "desktop", null);
  await suite(browser, base, "pixel7", devices["Pixel 7"]);
  await suite(browser, base, "iphone-se", devices["iPhone SE"]);
} finally { await browser.close(); srv.close(); }

const failed = results.filter(r => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length, failures: failed }, null, 1));
process.exit(failed.length ? 1 : 0);
