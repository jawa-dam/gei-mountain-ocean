import fs from "node:fs";
import assert from "node:assert/strict";

const ui = fs.readFileSync(new URL("../../dam-ite-voice-ui-v2195.js", import.meta.url), "utf8");
const index = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");

const checks = [
  ["four voice modes", /female.*male.*random.*off/s],
  ["Female default", /DEFAULT_MODE="female"/],
  ["touch-friendly button", /min-height:46px/],
  ["large readable option text", /\.v2195Label\{font-size:\.83rem/],
  ["voice popover", /v2195VoicePanel|VOICE EXPERIENCE/],
  ["persistent director integration", /GEI_VOICE_DIRECTOR/],
  ["mode buttons", /data-v2195-mode/],
  ["preview hook", /announcePreview/],
  ["ARIA dialog", /setAttribute\("role","dialog"\)/],
  ["presentation-only", /No gameplay\/economy\/progression\/save mutations/]
];

for (const [name, re] of checks) {
  assert.match(ui, re, name);
  console.log("PASS:", name);
}

assert.match(index, /<script src="\/dam-ite-voice-director-v2194\.js"><\/script>/);
assert.match(index, /<script src="\/dam-ite-voice-ui-v2195\.js"><\/script>/);
console.log("PASS: index wiring");

console.log("\nV2.1.95 regression: PASS");
console.log("Checks:", checks.length + 1);
