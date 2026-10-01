/* V2.2.03 — shared helpers for the audio-reliability and map-appearance regression harnesses.
 * Serves the working tree on 127.0.0.1, blocks every non-local request (offline), and opens the
 * real index.html in headless Chromium the same way tools/v2-dam-map does.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

export const root = resolve(new URL("..", import.meta.url).pathname);
export const KNOWN_BROKEN = 4;   // pre-existing unparseable tap-lites modules (V2.1.73/75/77/78), same allowance as tools/v2-dam-map
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function loadPlaywright(){
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
export function serve(){
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

export function reporter(){
  const results = [];
  return {
    results,
    check(name, pass, detail){ results.push({ name, pass: !!pass, detail }); },
    finish(version){
      const failed = results.filter(r => !r.pass);
      console.log(JSON.stringify({ version, passed:results.length - failed.length, failed:failed.length, results }, null, 1));
      process.exit(failed.length ? 1 : 0);
    }
  };
}

/* Opens the game past the splash/guide, exactly like the DAM Map harness. */
export async function openGame(browser, base, { device, init, reducedMotion } = {}){
  const ctx = await browser.newContext({ ...(device || { viewport:{ width:1366, height:900 } }), ...(reducedMotion ? { reducedMotion:"reduce" } : {}) });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.route("**/*", r => r.request().url().startsWith(base) ? r.continue() : r.abort());
  if (init) await page.addInitScript(init);
  await page.goto(base + "/", { waitUntil:"load" });
  await settle(page, device);
  return { ctx, page, errors, touch: !!(device && device.hasTouch) };
}

export async function settle(page, device){
  await sleep(700);
  const vp = page.viewportSize();
  if (device && device.hasTouch) await page.touchscreen.tap(vp.width / 2, vp.height / 2); else await page.mouse.click(vp.width / 2, vp.height / 2);
  await sleep(300);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) window.geiFinishSplash(); });
  await sleep(3400);
  await page.evaluate(() => { try { closeGameGuide(); } catch (e) {} try { window.__GEI_BEAVER_WELCOME__ && window.__GEI_BEAVER_WELCOME__.begin(); } catch (e) {} });
  await sleep(600);
}
