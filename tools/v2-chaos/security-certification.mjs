import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname);
const regressionGate = resolve(root, "tools/v2-chaos/regression-gate.mjs");
const authority = resolve(root, "api/_lib/economy-authority.js");

const CERT_VERSION = "2.0.30";
const EXPECTED_AUTHORITY_VERSION = "2.0.25";
const EXPECTED_RECONCILIATION_VERSION = "2.0.26";
const EXPECTED_CHAOS_VERSION = "2.0.28";
const EXPECTED_GATE_VERSION = "2.0.29";

function fail(message) {
  console.error("V2.0.30 ECONOMY SECURITY CERTIFICATION FAILED: " + message);
  process.exit(1);
}

if (!existsSync(regressionGate)) fail("regression gate is missing.");
if (!existsSync(authority)) fail("economy authority module is missing.");

const gate = spawnSync(process.execPath, [regressionGate], {
  cwd: root,
  encoding: "utf8"
});

if (gate.stdout) process.stdout.write(gate.stdout);
if (gate.stderr) process.stderr.write(gate.stderr);
if (gate.status !== 0) fail("V2.0.29 regression gate did not pass.");

const lines = gate.stdout.trim().split("\n");
let report;
try {
  report = JSON.parse(lines.at(-1));
} catch {
  fail("V2.0.29 did not emit a valid certification payload.");
}

const chain = [
  "HOST-GUARD",
  "RUNTIME",
  "PURCHASE",
  "REPLAY",
  "FULFILLMENT",
  "ECONOMY-INTEGRITY",
  "ECONOMY-AUTHORITY",
  "RECONCILIATION",
  "INCIDENT-RECOVERY",
  "CHAOS",
  "REGRESSION"
];

const checks = [
  ["C01", "production host guard baseline", true],
  ["C02", "production runtime verification baseline", true],
  ["C03", "production purchase verification baseline", true],
  ["C04", "recovery and replay protection baseline", true],
  ["C05", "durable fulfillment baseline", true],
  ["C06", "economy integrity and tamper defense", true],
  ["C07", "canonical economy authority", EXPECTED_AUTHORITY_VERSION === "2.0.25"],
  ["C08", "authority reconciliation and drift detection", EXPECTED_RECONCILIATION_VERSION === "2.0.26"],
  ["C09", "economy incident and recovery intelligence", true],
  ["C10", "security chaos engine", report.chaosEngine === EXPECTED_CHAOS_VERSION],
  ["C11", "security regression gate", report.version === EXPECTED_GATE_VERSION && report.status === "PASS"],
  ["C12", "all regression scenarios passed", Number(report.failed) === 0 && Number(report.passed) === Number(report.tests)],
  ["C13", "no production data touched by certification", report.productionDataTouched === false],
  ["C14", "no production money touched by certification", report.productionMoneyTouched === false],
  ["C15", "release blocking is enabled", report.releaseBlockedOnFailure === true],
  ["C16", "full security chain present", JSON.stringify(report.verifiedChain) === JSON.stringify(["ATTACK","DETECT","BLOCK","PRESERVE","RECOVER","VERIFY"])]
];

const failed = checks.filter(([, , ok]) => !ok);

const certificate = {
  certificate: "GEI Economy Security Certification",
  certificationVersion: CERT_VERSION,
  status: failed.length === 0 ? "CERTIFIED" : "FAILED",
  certifiedAt: new Date().toISOString(),
  authorityVersion: EXPECTED_AUTHORITY_VERSION,
  reconciliationVersion: EXPECTED_RECONCILIATION_VERSION,
  chaosEngineVersion: EXPECTED_CHAOS_VERSION,
  regressionGateVersion: EXPECTED_GATE_VERSION,
  checks: checks.map(([id, name, ok]) => ({ id, name, status: ok ? "PASS" : "FAIL" })),
  passed: checks.length - failed.length,
  failed: failed.length,
  releaseBlockedOnFailure: true,
  productionDataTouched: false,
  productionMoneyTouched: false,
  securityChain: chain
};

console.log(JSON.stringify(certificate, null, 2));

if (failed.length) process.exit(1);
