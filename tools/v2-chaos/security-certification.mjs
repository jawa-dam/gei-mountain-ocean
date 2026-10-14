/* GEI Economy Security Certification — V2.0.30, rebuilt in V2.2.20 so that every check EXECUTES something.
 *
 *   node tools/v2-chaos/security-certification.mjs            full run (needs headless Chromium for C01, C02, R01–R03)
 *   SKIP_BROWSER=1 node tools/v2-chaos/security-certification.mjs   server-side checks only → the certificate is INCOMPLETE, never CERTIFIED
 *
 * Exit codes: 0 CERTIFIED (every listed check executed and passed) · 1 FAILED (a check failed) · 3 INCOMPLETE (a check could not run).
 *
 * Before V2.2.20 the checks C01–C09 were literals (`true`), so the certificate could not fail on them. They now run:
 *   C01 production host guard · C02 runtime verification (fail-closed)  → security-client-checks.mjs  (real game page)
 *   C03 purchase verification · C04 replay / duplicates · C05 durable fulfilment · C06 tamper defence · C07 canonical authority · C08 reconciliation · C09 incident / recovery
 *                                                                          → security-server-checks.mjs (the real api/ handlers + ledger on in-memory doubles)
 *   R01–R03 reward integrity / Builder isolation / purchase state          → security-client-checks.mjs
 *   C10–C16 the V2.0.28 chaos engine and V2.0.29 gate contract              → derived from their actual output
 * The certificate lists only what ran. "Production untouched" is measured (requests that reached anything other than a double), not declared.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname);
const regressionGate = resolve(root, "tools/v2-chaos/regression-gate.mjs"), authority = resolve(root, "api/_lib/economy-authority.js");
const CERT_VERSION = "2.2.20", EXPECTED_AUTHORITY_VERSION = "2.0.25", EXPECTED_RECONCILIATION_VERSION = "2.0.26", EXPECTED_CHAOS_VERSION = "2.0.28", EXPECTED_GATE_VERSION = "2.0.29";
const fail = m => { console.error("ECONOMY SECURITY CERTIFICATION FAILED: " + m); process.exit(1); };
if (!existsSync(regressionGate)) fail("regression gate is missing.");
if (!existsSync(authority)) fail("economy authority module is missing.");

/* ---- the regression gate (V2.0.29) ---- */
const gate = spawnSync(process.execPath, [regressionGate], { cwd: root, encoding: "utf8" });
if (gate.status !== 0) { if (gate.stdout) process.stdout.write(gate.stdout); if (gate.stderr) process.stderr.write(gate.stderr); fail("the V2.0.29 regression gate did not pass."); }
// the gate prints the chaos report and then its own pretty-printed JSON object: the gate's object is the LAST top-level block
const out = gate.stdout.trim(), start = out.lastIndexOf("\n{\n");
let report; try { report = JSON.parse(start >= 0 ? out.slice(start + 1) : out); } catch { fail("the V2.0.29 gate did not emit a valid payload."); }

const checks = [];   // { id, name, status: PASS|FAIL|NOT_RUN, assertions, failed[] }
const add = c => checks.push(c);

/* ---- server-side (real handlers + ledger on doubles) ---- */
const { runServerChecks } = await import("./security-server-checks.mjs");
const server = await runServerChecks(); server.results.forEach(add);

/* ---- client-side (real game page) ---- */
let client = { results: [], externalRequests: null, paymentRequests: null }, browserNote = null;
if (process.env.SKIP_BROWSER === "1") browserNote = "SKIP_BROWSER=1";
else { try { const { runClientChecks } = await import("./security-client-checks.mjs"); client = await runClientChecks(); } catch (e) { browserNote = "browser checks could not run: " + (e && e.message || e); } }
const CLIENT_IDS = [["C01", "production host guard (never intercepts gameplay)"], ["C02", "production runtime verification (fails closed on a wrong host)"], ["R01", "reward integrity (awardDay is exactly-once and in-order)"], ["R02", "Builder isolation (no path from the Builder store to FL OZ / XP / purchases)"], ["R03", "purchase state untouched by rewards"]];
for (const [id, name] of CLIENT_IDS) { const r = client.results.find(x => x.id === id); add(r || { id, name, status: "NOT_RUN", assertions: 0, failed: [], reason: browserNote || "not executed" }); }

/* ---- gate / chaos contract (C10–C16), from the gate's real output ---- */
const sim = (id, name, ok) => add({ id, name, status: ok ? "PASS" : "FAIL", assertions: 1, failed: ok ? [] : [{ label: name }] });
sim("C10", "security chaos engine present at 2.0.28", report.chaosEngine === EXPECTED_CHAOS_VERSION);
sim("C11", "security regression gate passed (2.0.29)", report.version === EXPECTED_GATE_VERSION && report.status === "PASS");
sim("C12", "all chaos scenarios passed", Number(report.failed) === 0 && Number(report.passed) === Number(report.tests) && Number(report.tests) >= 18);
sim("C13", "chaos engine reports no production data touched", report.productionDataTouched === false);
sim("C14", "chaos engine reports no production money touched", report.productionMoneyTouched === false);
sim("C15", "release blocking is enabled in the gate", report.releaseBlockedOnFailure === true);
sim("C16", "full security chain present", JSON.stringify(report.verifiedChain) === JSON.stringify(["ATTACK", "DETECT", "BLOCK", "PRESERVE", "RECOVER", "VERIFY"]));

/* ---- measured isolation ---- */
const isolation = {
  serverRequestsOutsideTheDoubles: server.blocked.length,                  // anything that was not answered by the fake Redis / fake PayPal (the lab refuses and records it)
  browserPaymentEndpointRequests: client.paymentRequests,                  // requests to PayPal / /api/ from the game page
  redisAndPayPalWereInMemoryDoubles: true, ledgerLuaScriptsPinned: server.scriptsPinned
};
sim("ISO", "isolation measured: no request reached anything but the in-memory doubles; no payment endpoint was contacted by the page", isolation.serverRequestsOutsideTheDoubles === 0 && (isolation.browserPaymentEndpointRequests === 0 || isolation.browserPaymentEndpointRequests === null) && isolation.ledgerLuaScriptsPinned);

const failed = checks.filter(c => c.status === "FAIL"), notRun = checks.filter(c => c.status === "NOT_RUN"), ran = checks.filter(c => c.status !== "NOT_RUN");
const status = failed.length ? "FAILED" : notRun.length ? "INCOMPLETE" : "CERTIFIED";
const certificate = {
  certificate: "GEI Economy Security Certification",
  certificationVersion: CERT_VERSION, status, certifiedAt: new Date().toISOString(),
  authorityVersion: EXPECTED_AUTHORITY_VERSION, reconciliationVersion: EXPECTED_RECONCILIATION_VERSION, chaosEngineVersion: EXPECTED_CHAOS_VERSION, regressionGateVersion: EXPECTED_GATE_VERSION,
  checksExecuted: ran.length, assertionsExecuted: ran.reduce((a, c) => a + (c.assertions || 0), 0), passed: ran.length - failed.length, failed: failed.length, notRun: notRun.length,
  checks: checks.map(c => ({ id: c.id, name: c.name, status: c.status, assertions: c.assertions, ...(c.failed && c.failed.length ? { failures: c.failed } : {}), ...(c.reason ? { reason: c.reason } : {}) })),
  isolation,
  scope: "Executes the real api/paypal handlers and api/_lib ledger against in-memory Redis and PayPal doubles, the V2.0.28 chaos engine, and the real game page offline. Covers tampering (amount, currency, pack, FL OZ, audit, fulfilment id), replay (capture, webhook, claim, fulfil), duplicate credit, incident freeze / recovery, and awardDay exactly-once.",
  notCovered: [
    "The live PayPal API and the live Upstash/Redis store (doubles only; the Lua scripts are fingerprint-pinned, not executed by a real Redis).",
    "Webhook signature cryptography (PayPal's verify endpoint is a double).",
    "A player editing their own browser save: the FL OZ balance is client-held; only purchases are server-ledger-protected.",
    "The production-host allow-list for hosts other than the local test host, and any deployed environment configuration.",
    "Penetration testing, rate limiting, authentication of the claim endpoints, or third-party security review."
  ],
  releaseBlockedOnFailure: true
};
console.log(JSON.stringify(certificate, null, 2));
if (status === "FAILED") process.exit(1);
if (status === "INCOMPLETE") { console.error("ECONOMY SECURITY CERTIFICATION INCOMPLETE: " + notRun.map(c => c.id).join(", ") + " did not run (" + (browserNote || "unknown") + ")."); process.exit(3); }
process.exit(0);
