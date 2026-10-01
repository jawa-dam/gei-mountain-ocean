import fs from "node:fs";
import assert from "node:assert/strict";

const src=fs.readFileSync(new URL("../../dam-ite-voice-discovery-rewards-v2202.js",import.meta.url),"utf8");
const index=fs.readFileSync(new URL("../../index.html",import.meta.url),"utf8");

const checks=[
  ["five cosmetic reward tiers",/FIRST VOICE.*FLOW LISTENER.*HYDRAULIC LISTENER.*VOICE COLLECTOR.*VOICE VAULT/s],
  ["discovery count source",/discoveryCount\(\)/],
  ["new reward unlock detection",/unlockNew/],
  ["local reward memory",/geiDamIteVoiceRewardsV2202/],
  ["reward toast",/v2202RewardToast/],
  ["reward burst",/v2202Burst/],
  ["showcase reward panel",/v2202Rewards/],
  ["reward reset",/function reset/],
  ["presentation-only boundary",/No XP, currency, progression, purchases, scores, or account data/],
  ["public rewards API",/window\.GEI_VOICE_REWARDS/]
];

for(const [name,re] of checks){assert.match(src,re,name);console.log("PASS:",name);}
assert.match(index,/dam-ite-voice-discovery-rewards-v2202\.js/);
console.log("PASS: index wiring");
console.log("\nV2.2.02 regression: PASS");
console.log("Checks:",checks.length+1);
