import fs from "node:fs";
import assert from "node:assert/strict";

const src=fs.readFileSync(new URL("../../dam-ite-voice-memory-v2199.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["local memory key",/geiDamIteVoiceMemoryV2199/],
  ["favorite storage",/state\.favorites/],
  ["favorite limit",/MAX_FAVORITES=8/],
  ["toggle favorite",/toggleFavorite/],
  ["clear favorites",/clearFavorites/],
  ["clear memory",/clearMemory/],
  ["voice mode memory",/rememberMode/],
  ["director sync",/GEI_VOICE_DIRECTOR/],
  ["favorite UI",/v2199MemoryDock|FAVORITES/],
  ["accessible dialog",/role="dialog"/],
  ["aria pressed or expanded",/aria-expanded/],
  ["presentation-only",/Does not store gameplay scores, purchases, XP, progression, or account data/],
  ["public memory API",/window\.GEI_VOICE_MEMORY/]
];

for(const [name,re] of checks){assert.match(src,re,name);console.log("PASS:",name);}
assert.match(index,/dam-ite-voice-memory-v2199\.js/);
console.log("PASS: index wiring");
console.log("\nV2.1.99 regression: PASS");
console.log("Checks:",checks.length+1);
