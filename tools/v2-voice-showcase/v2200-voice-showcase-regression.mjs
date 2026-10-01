import fs from "node:fs";
import assert from "node:assert/strict";

const src=fs.readFileSync(new URL("../../dam-ite-voice-showcase-v2200.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["six showcase steps",/mountain.*dam.*millpond.*sluice.*waterwheel.*factory/s],
  ["voice mode controls",/female.*male.*random/s],
  ["replay buttons",/data-v2200-play/],
  ["favorite buttons",/data-v2200-fav/],
  ["Voice Memory integration",/GEI_VOICE_MEMORY/],
  ["Voice Director integration",/GEI_VOICE_DIRECTOR/],
  ["Factory variants documented",/Normal \+ excited variants/],
  ["touch-friendly buttons",/min-height:42px/],
  ["accessible dialog",/aria-label="DAM-ITE Voice Showcase"/],
  ["accessible expanded state",/aria-expanded/],
  ["presentation-only",/No gameplay\/economy\/progression\/XP\/purchase\/save mutations/],
  ["public showcase API",/window\.GEI_VOICE_SHOWCASE/]
];

for(const [name,re] of checks){assert.match(src,re,name);console.log("PASS:",name);}
assert.match(index,/dam-ite-voice-showcase-v2200\.js/);
console.log("PASS: index wiring");
console.log("\nV2.2.00 regression: PASS");
console.log("Checks:",checks.length+1);
