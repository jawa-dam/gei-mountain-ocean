/* Shared headless-Chromium harness for the V2.2.17 DAM BUILDER regression (real index.html, offline; CDN audio/art answered locally). */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, join } from "node:path";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

export const root = resolve(new URL("../..", import.meta.url).pathname);
async function loadPlaywright(){
  try { return await import("playwright"); } catch {}
  const roots = []; try { roots.push(execSync("npm root -g", { encoding:"utf8" }).trim()); } catch {}
  roots.push("/opt/node-tools/node_modules");
  for (const r of roots){ try { return createRequire(join(r, "noop.js"))("playwright"); } catch {} try { return createRequire(join(r, "noop.js"))("playwright-core"); } catch {} }
  console.error("Playwright is not installed. Run: npm i -D playwright"); process.exit(2);
}
const pw = await loadPlaywright(); export const chromium = pw.chromium || (pw.default && pw.default.chromium);
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".json":"application/json", ".css":"text/css", ".png":"image/png", ".svg":"image/svg+xml" };
export const srv = await new Promise(ok => {
  const s = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p === "/") p = "/index.html";
      const f = resolve(root, "." + p); if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
      await stat(f); res.writeHead(200, { "content-type":TYPES[extname(p)] || "application/octet-stream" }); res.end(await readFile(f));
    } catch { res.writeHead(404); res.end(); }
  });
  s.listen(0, "127.0.0.1", () => ok(s));
});
export const base = "http://127.0.0.1:" + srv.address().port;
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const browser = await chromium.launch({ args:["--autoplay-policy=no-user-gesture-required", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
function wav(ms){ const sr = 8000, n = sr * ms / 1000 | 0, b = Buffer.alloc(44 + n * 2); b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40); return b; }
const PNG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#c58a4a"/></svg>';

/* opts: viewport, reduced, storage (object of localStorage keys seeded before load), noSkipIntro */
export async function boot(opts = {}){
  const ctx = opts.ctx || await browser.newContext({ viewport:opts.viewport || { width:390, height:844 }, isMobile:true, hasTouch:true, reducedMotion:opts.reduced ? "reduce" : "no-preference" });
  const errors = [];
  if(!opts.ctx) await ctx.route("**/*", r => {
    const u = r.request().url(); if (u.startsWith(base)) return r.continue();
    if (/zyrosite.*\.mp3/.test(u)) return r.fulfill({ status:200, contentType:"audio/wav", body:wav(300) });
    if (/zyrosite.*\.(png|jpg|webp)/.test(u)) return r.fulfill({ status:200, contentType:"image/svg+xml", body:PNG });
    return r.abort();
  });
  const page = await ctx.newPage();
  page.on("pageerror", e => { if (!/addStyle is not defined/.test(e.message)) errors.push(e.message); });   // pre-existing, unrelated (tap-lites-reward-moments-v2178.js)
  if (opts.storage) await page.addInitScript(s => { if(!sessionStorage.getItem("__seeded")){ for (const k in s) localStorage.setItem(k, s[k]); sessionStorage.setItem("__seeded", "1"); } }, opts.storage);
  await page.goto(base + "/" + (opts.query == null ? "?b3d=off" : opts.query), { waitUntil:"load" }); await sleep(500);
  await page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); });
  await sleep(1800);
  await page.evaluate(() => { const b = document.getElementById("geiWelcomeBegin"); if (b) b.click(); }); await sleep(1100);
  const h = { ctx, page, errors };
  h.close = () => ctx.close();
  return h;
}
export async function reload(h){ await h.page.reload({ waitUntil:"load" }); await sleep(500);
  await h.page.evaluate(() => { const b = document.getElementById("geiSplashSkip"); if (b) b.click(); else if (window.geiFinishSplash) geiFinishSplash(); }); await sleep(1800);
  await h.page.evaluate(() => { const b = document.getElementById("geiWelcomeBegin"); if (b) b.click(); }); await sleep(1100); }
export async function done(){ await browser.close(); srv.close(); }
