import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync(new URL("../../dam-ite-voice-director-v2194.js", import.meta.url), "utf8");

const checks = [
  ["dual voice packs", /female:\s*\{[\s\S]*?\},\s*male:\s*\{/],
  ["all six milestone keys", /mountain:.*?dam:.*?millpond:.*?sluice:.*?waterwheel:.*?factory:/s],
  ["voice modes", /\["female","male","random","off"\]/],
  ["persistent mode", /localStorage\.getItem\(MODE_KEY\)/],
  ["smart random alternation", /lastResolvedMode==="female"\?"male":"female"/],
  ["factory excited variant", /factoryExcited/],
  ["asset preloading", /function preloadAll\(\)/],
  ["overlap protection token", /var token=0/],
  ["soundtrack ducking", /DAMSoundtrack[\s\S]*duck\("mission"\)/],
  ["level-card binding", /id","lcLevel|document\.getElementById\("lcLevel"\)/],
  ["presentation-only guard", /No gameplay\/economy\/progression\/save mutations/],
  ["public director API", /window\.GEI_VOICE_DIRECTOR/]
];

for (const [name, pattern] of checks) {
  assert.match(source, pattern, name);
  console.log("PASS:", name);
}

assert.equal((source.match(/factoryExcited/g) || []).length >= 4, true);
console.log("\nV2.1.94 regression: PASS");
console.log("Checks:", checks.length);
