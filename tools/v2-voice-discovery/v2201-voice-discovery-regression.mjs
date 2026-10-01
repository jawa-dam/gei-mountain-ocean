import fs from "node:fs";
import assert from "node:assert/strict";

const src=fs.readFileSync(new URL("../../dam-ite-voice-discovery-v2201.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["six milestone discovery keys",/mountain.*dam.*millpond.*sluice.*waterwheel.*factory/s],
  ["local discovery memory",/geiDamIteVoiceDiscoveryV2201/],
  ["new voice marker",/NEW VOICE/],
  ["seen registry",/state\.seen/],
  ["recent discoveries",/state\.newlySeen/],
  ["showcase integration",/GEI_VOICE_SHOWCASE/],
  ["director integration",/GEI_VOICE_DIRECTOR/],
  ["new badge UI",/v2201Undiscovered|data-v2200-key/],
  ["discovery toast",/v2201DiscoveryToast/],
  ["discovery summary",/v2201DiscoverySummary/],
  ["clear discovery memory",/function clear|clear:function/],
  ["reduced-motion support",/prefers-reduced-motion/],
  ["presentation-only",/No gameplay, economy, XP, progression, purchase, or account data/],
  ["public discovery API",/window\.GEI_VOICE_DISCOVERY/]
];

for(const [name,re] of checks){assert.match(src,re,name);console.log("PASS:",name);}
assert.match(index,/dam-ite-voice-discovery-v2201\.js/);
console.log("PASS: index wiring");
console.log("\nV2.2.01 regression: PASS");
console.log("Checks:",checks.length+1);
