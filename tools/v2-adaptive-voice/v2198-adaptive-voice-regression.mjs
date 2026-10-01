import fs from "node:fs";
import assert from "node:assert/strict";

const src=fs.readFileSync(new URL("../../dam-ite-adaptive-voice-v2198.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["adaptive profile",/id:"adaptive"/],
  ["social profile",/id:"social"/],
  ["calm profile",/id:"calm"/],
  ["off profile",/id:"off"/],
  ["persistent profile",/localStorage\.getItem\(SETTINGS_KEY\)/],
  ["session maturity",/function userMaturity/],
  ["new-player pacing",/maturity==="new"/],
  ["returning-player pacing",/maturity==="returning"/],
  ["context suppression",/contextCooldown/],
  ["cycle cooldown",/cycleCooldown/],
  ["character cooldown",/characterCooldown/],
  ["session tracking",/SESSION_KEY/],
  ["presentation-only",/No gameplay\/economy\/progression\/XP\/purchase\/save mutations/],
  ["public API",/window\.GEI_ADAPTIVE_VOICE/]
];

for(const [name,re] of checks){assert.match(src,re,name);console.log("PASS:",name);}
assert.match(index,/dam-ite-adaptive-voice-v2198\.js/);
console.log("PASS: index wiring");
console.log("\nV2.1.98 regression: PASS");
console.log("Checks:",checks.length+1);
