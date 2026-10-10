/* Visual guard for the APPROVED Day 5 waterwheel scene (tag v2.2.18-approved-waterwheel).
 *   node golden-day5.mjs --update     render and store golden/day5-approved.png (only ever done on the approved build)
 *   node golden-day5.mjs              render now and compare with the golden: prints mean abs diff (0-255) and the % of pixels that moved
 * Deterministic: seeded Math.random, fixed draw sequence, software GL (SwiftShader), 390×600 @1x, quality "high", level 3, gate 80 %, mill engaged. */
import { createRequire } from "node:module"; import { readFile, writeFile } from "node:fs/promises"; import { resolve } from "node:path";
const require = createRequire("/opt/node-tools/node_modules/noop.js"); const { chromium } = require("playwright");
const root = resolve(new URL("../..", import.meta.url).pathname), golden = resolve(root, "tools/v2217-dam-builder/golden/day5-approved.png");
const update = process.argv.includes("--update"), extra = process.argv.find(a => a.startsWith("--out="));
const b = await chromium.launch({ args:["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport:{ width:390, height:600 }, deviceScaleFactor:1 });
p.on("pageerror", e => console.log("ERR", e.message));
await p.setContent("<body style='margin:0;background:#000'><div id=st style='position:relative;width:390px;height:600px;overflow:hidden'><canvas id=c style='position:absolute;inset:0;width:100%;height:100%'></canvas></div><div id=ctl></div></body>");
await p.addScriptTag({ path:resolve(root, "dam-builder-3d-v2218.js") });
await p.evaluate(async () => {
  let s = 12345; Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const api = { gauge(){}, inspect(){}, sfx(){} }, kit = { reduced:() => false };
  const env = { canvas:document.getElementById("c"), stageEl:document.getElementById("st"), ctl:document.getElementById("ctl"), api, kit, level:3, quality:"high", up:{ bear:0, liner:0, act:0 }, day:4 };
  const def = (window.DamBuilder3D.createDay ? window.DamBuilder3D.createDay(4, env) : window.DamBuilder3D.create(4, env)); window.def = def;
  def.skipIntro(); def.draw(0.05);
  const inp = document.getElementById("db3dGate"); inp.value = 80; inp.dispatchEvent(new Event("input"));
  document.querySelectorAll("#ctl button")[2].click();
  for (let i = 0; i < 160; i++) def.step(0.05);
  for (let i = 0; i < 3; i++) def.draw(0.1);
});
const shot = await p.screenshot();
if (update){ await writeFile(golden, shot); console.log("golden written", shot.length, "bytes"); }
else {
  if (extra) await writeFile(extra.slice(6), shot);
  const g = (await readFile(golden)).toString("base64"), n = shot.toString("base64");
  const r = await p.evaluate(async ([a, c]) => {
    const load = s => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.src = "data:image/png;base64," + s; });
    const [A, B] = await Promise.all([load(a), load(c)]), cv = document.createElement("canvas"); cv.width = A.width; cv.height = A.height; const x = cv.getContext("2d");
    x.drawImage(A, 0, 0); const da = x.getImageData(0, 0, cv.width, cv.height).data; x.drawImage(B, 0, 0); const db = x.getImageData(0, 0, cv.width, cv.height).data;
    let sum = 0, moved = 0; for (let i = 0; i < da.length; i += 4){ const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3; sum += d; if (d > 24) moved++; }
    return { mean:sum / (da.length / 4), movedPct:moved / (da.length / 4) * 100 };
  }, [g, n]);
  console.log(JSON.stringify(r));
  process.exitCode = (r.mean < 3.0 && r.movedPct < 6) ? 0 : 1;
}
await b.close();
