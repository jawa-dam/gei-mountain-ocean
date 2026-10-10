/* dev helper: screenshot a 3D Day inside the real game shell.  node tools/v2220-certification/shot.mjs <dayIdx> <level> <out.png> [W H] ["js run in page after intro skip"] */
import { boot, sleep, done } from "../v2217-dam-builder/harness.mjs";
const [, , day, level, out, W, H, js] = process.argv;
const seed = JSON.stringify({ version:2, level:+level, levelFlOz:day * 111, totalFlOz:1000 + day * 111, completedLevels:level - 1, loopCount:level - 1, currentStep:+day });
const h = await boot({ query:process.env.QUERY || "?b3d=high", viewport:{ width:+W || 390, height:+H || 844 }, storage:{ "yalltooDamGame.v2":seed } });
await h.page.evaluate(d => DamBuilder.open({ day:+d }), day);
await h.page.waitForFunction(() => DamBuilder.run && DamBuilder.run.is3d, null, { timeout:90000 });
await h.page.click('[data-act="start"]').catch(() => {}); await sleep(200);
await h.page.evaluate(() => { DamBuilder.def.skipIntro(); for (let i = 0; i < 4; i++) DamBuilder.def.draw(0.1); });
if (js) { const r = await h.page.evaluate(js); if (r !== undefined) console.log(JSON.stringify(r)); }
await h.page.evaluate(() => { for (let i = 0; i < 30; i++) DamBuilder.def.draw(0.1); });
await sleep(300); await h.page.screenshot({ path:out }); console.log("errors", h.errors.length);
await h.close(); await done();
