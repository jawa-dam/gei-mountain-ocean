import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname);
const chaos = resolve(root, "tools/v2-chaos/economy-chaos.mjs");

if (!existsSync(chaos)) {
  console.error("V2.0.29 REGRESSION GATE FAILED: chaos engine is missing.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [chaos], {
  cwd: root,
  encoding: "utf8"
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

if (result.status !== 0) {
  console.error("V2.0.29 REGRESSION GATE FAILED: one or more economy security tests failed.");
  process.exit(result.status || 1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("V2.0.29 REGRESSION GATE FAILED: chaos engine did not emit valid JSON.");
  process.exit(1);
}

const requiredChain = [
  "ATTACK",
  "DETECT",
  "BLOCK",
  "PRESERVE",
  "RECOVER",
  "VERIFY"
];

const valid =
  report.version === "2.0.28" &&
  report.mode === "deterministic-safe-chaos" &&
  report.productionDataTouched === false &&
  report.productionMoneyTouched === false &&
  Number(report.failed) === 0 &&
  Number(report.passed) === Number(report.testCount) &&
  JSON.stringify(report.chain) === JSON.stringify(requiredChain);

if (!valid) {
  console.error("V2.0.29 REGRESSION GATE FAILED: security contract mismatch.");
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      gate: "GEI Economy Security Regression Gate",
      version: "2.0.29",
      status: "PASS",
      chaosEngine: "2.0.28",
      tests: report.testCount,
      passed: report.passed,
      failed: report.failed,
      productionDataTouched: false,
      productionMoneyTouched: false,
      releaseBlockedOnFailure: true,
      verifiedChain: requiredChain
    },
    null,
    2
  )
);
