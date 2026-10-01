import fs from "node:fs";
import assert from "node:assert/strict";

const src=fs.readFileSync(new URL("../../dam-ite-contextual-voice-v2197.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["first-entry moment",/firstEntry/],
  ["return moment",/returnEntry/],
  ["full-cycle moment",/fullCycle/],
  ["character moment",/characterMoment/],
  ["session gating",/geiDamIteSessionV2197/],
  ["persistent one-time state",/localStorage\.setItem\(STORAGE/],
  ["voice director integration",/GEI_VOICE_DIRECTOR/],
  ["randomized contextual copy",/choose\(COPY\.welcome\)|choose\(COPY\.return\)|choose\(COPY\.cycle\)/],
  ["context toast",/v2197ContextToast/],
  ["level completion observation",/lcLevel/],
  ["reduced-motion support",/prefers-reduced-motion/],
  ["presentation-only",/does not alter gameplay, economy, XP, progression, purchases, or saves/],
  ["public contextual API",/window\.GEI_CONTEXTUAL_VOICE/]
];

for(const [name,re] of checks){assert.match(src,re,name);console.log("PASS:",name);}
assert.match(index,/dam-ite-contextual-voice-v2197\.js/);
console.log("PASS: index wiring");
console.log("\nV2.1.97 regression: PASS");
console.log("Checks:",checks.length+1);
