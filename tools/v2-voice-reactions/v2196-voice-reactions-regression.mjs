import fs from "node:fs";
import assert from "node:assert/strict";

const reaction=fs.readFileSync(new URL("../../dam-ite-voice-reactions-v2196.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["six personality profiles", /mountain.*dam.*millpond.*sluice.*waterwheel.*factory/s],
  ["director integration", /GEI_VOICE_DIRECTOR/],
  ["context-aware reaction", /setReaction\(s\.active/],
  ["Factory finale", /enhanceFactory|v2196FactoryFinale/],
  ["animated personality badge", /v2196PersonalityBadge/],
  ["reaction particles", /v2196Particle/],
  ["per-step visual classes", /v2196Mountain.*v2196Dam.*v2196Millpond.*v2196Sluice.*v2196Waterwheel.*v2196Factory/s],
  ["reduced-motion support", /prefers-reduced-motion/],
  ["presentation-only", /does not alter gameplay, economy, progression, XP, purchases, or saves/],
  ["public API", /window\.GEI_VOICE_REACTIONS/]
];

for(const [name,re] of checks){
  assert.match(reaction,re,name);
  console.log("PASS:",name);
}
assert.match(index,/dam-ite-voice-reactions-v2196\.js/);
console.log("PASS: index wiring");
console.log("\nV2.1.96 regression: PASS");
console.log("Checks:",checks.length+1);
