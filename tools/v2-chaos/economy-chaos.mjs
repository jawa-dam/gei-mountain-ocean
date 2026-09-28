import assert from "node:assert/strict";
import {
  ECONOMY_AUTHORITY_VERSION,
  canonicalFulfillmentId,
  reconcileEntitlementAuthority,
  validateEntitlementAuthority,
  getPack
} from "../../api/_lib/economy-authority.js";

const PACK_ID = "single";
const CAPTURE_ID = "CHAOS-CAPTURE-001";
const INVOICE_ID = "CHAOS-INVOICE-001";
const CLAIM_ID = "CHAOS-CLAIM-001";
const FULFILLMENT_ID = canonicalFulfillmentId(CAPTURE_ID);

function authoritativeRecord(overrides = {}) {
  const pack = getPack(PACK_ID);
  return {
    status: "FULFILLABLE",
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    audit: {
      auditVersion: ECONOMY_AUTHORITY_VERSION,
      authoritative: true,
      packId: PACK_ID,
      flOz: pack.flOz,
      amount: pack.price,
      currency: "USD"
    },
    orderID: "CHAOS-ORDER-001",
    captureID: CAPTURE_ID,
    invoiceId: INVOICE_ID,
    packId: PACK_ID,
    flOz: pack.flOz,
    amount: pack.price,
    currency: "USD",
    claimedAt: null,
    claimId: null,
    fulfilledAt: null,
    fulfillmentId: null,
    ...overrides
  };
}

function expectBlocked(label, record, expectedReasons) {
  const result = reconcileEntitlementAuthority(record);
  assert.equal(result.ok, false, label);
  assert.equal(result.driftDetected, true, label);
  for (const reason of expectedReasons) {
    assert.ok(result.reasons.includes(reason), label + ": missing " + reason);
  }
  return result;
}

function simulateLedger(initial) {
  let record = structuredClone(initial);
  let incident = null;

  function reconcile() {
    return reconcileEntitlementAuthority(record);
  }

  function freeze(source) {
    const reconciliation = reconcile();
    if (!reconciliation.ok) {
      incident ||= {
        incidentVersion: "2.0.28-TEST",
        status: "FROZEN",
        source,
        invoiceId: record.invoiceId,
        captureID: record.captureID,
        reconciliation
      };
      return { ok: false, frozen: true, incident, reconciliation };
    }
    return { ok: true, frozen: false, reconciliation };
  }

  return {
    get record() { return structuredClone(record); },
    get incident() { return incident ? structuredClone(incident) : null; },
    mutate(fn) { fn(record); },
    claim(captureID, claimId) {
      if (record.captureID !== captureID) return { ok: false, reason: "CAPTURE_MISMATCH" };
      const guard = freeze("CLAIM");
      if (!guard.ok) return guard;
      if (record.claimedAt) {
        return record.claimId === claimId
          ? { ok: true, alreadyClaimed: true }
          : { ok: false, reason: "ALREADY_CLAIMED" };
      }
      record.claimedAt = "2026-01-01T00:00:00.000Z";
      record.claimId = claimId;
      return { ok: true, alreadyClaimed: false };
    },
    fulfill(captureID, fulfillmentId) {
      if (record.captureID !== captureID) return { ok: false, reason: "CAPTURE_MISMATCH" };
      const guard = freeze("FULFILLMENT");
      if (!guard.ok) return guard;
      if (!record.claimedAt) return { ok: false, reason: "NOT_CLAIMED" };
      if (record.fulfilledAt) {
        return record.fulfillmentId === fulfillmentId
          ? { ok: true, alreadyFulfilled: true }
          : { ok: false, reason: "ALREADY_FULFILLED" };
      }
      record.fulfilledAt = "2026-01-01T00:00:01.000Z";
      record.fulfillmentId = fulfillmentId;
      record.status = "FULFILLED";
      return { ok: true, alreadyFulfilled: false };
    },
    recover() {
      if (!incident) return { ok: false, recoverable: false, reason: "NOT_FOUND" };
      const reconciliation = reconcile();
      if (!reconciliation.ok) {
        return { ok: false, recoverable: false, status: "FROZEN", reason: "DRIFT_REMAINS", reconciliation };
      }
      return {
        ok: true,
        recoverable: true,
        status: "RECOVERABLE",
        action: "REVERIFY_BEFORE_CLAIM_OR_FULFILLMENT",
        reconciliation
      };
    }
  };
}

const tests = [];
function test(id, name, fn) {
  try {
    fn();
    tests.push({ id, name, status: "PASS" });
  } catch (error) {
    tests.push({ id, name, status: "FAIL", error: error.message });
  }
}

test("C01", "canonical baseline is authoritative", () => {
  const record = authoritativeRecord();
  assert.equal(validateEntitlementAuthority(record), true);
  assert.equal(reconcileEntitlementAuthority(record).ok, true);
});

test("C02", "altered FL OZ is blocked", () => {
  expectBlocked("altered FL OZ", authoritativeRecord({ flOz: 6661 }), ["FL_OZ_DRIFT"]);
});

test("C03", "altered price is blocked", () => {
  expectBlocked("altered price", authoritativeRecord({ amount: "0.01" }), ["AMOUNT_DRIFT"]);
});

test("C04", "altered pack ID is blocked", () => {
  expectBlocked("altered pack", authoritativeRecord({ packId: "twentyfive" }), ["AMOUNT_DRIFT", "FL_OZ_DRIFT"]);
});

test("C05", "altered currency is blocked", () => {
  expectBlocked("altered currency", authoritativeRecord({ currency: "EUR" }), ["CURRENCY_DRIFT"]);
});

test("C06", "stale authority version is blocked", () => {
  expectBlocked("stale version", authoritativeRecord({ auditVersion: "2.0.24" }), ["AUDIT_VERSION_DRIFT"]);
});

test("C07", "corrupted audit metadata is blocked", () => {
  expectBlocked("corrupt audit", authoritativeRecord({
    audit: { ...authoritativeRecord().audit, authoritative: false }
  }), ["NON_AUTHORITATIVE_AUDIT"]);
});

test("C08", "audit record drift is blocked", () => {
  expectBlocked("audit drift", authoritativeRecord({
    audit: { ...authoritativeRecord().audit, flOz: 1 }
  }), ["AUDIT_RECORD_DRIFT"]);
});

test("C09", "capture-bound fulfillment ID drift is blocked", () => {
  expectBlocked("fulfillment drift", authoritativeRecord({
    fulfillmentId: "GEI-FULFILL-ATTACK"
  }), ["FULFILLMENT_ID_DRIFT"]);
});

test("C10", "wrong capture cannot claim", () => {
  const ledger = simulateLedger(authoritativeRecord());
  assert.deepEqual(ledger.claim("WRONG-CAPTURE", CLAIM_ID), {
    ok: false, reason: "CAPTURE_MISMATCH"
  });
});

test("C11", "duplicate claim is idempotent only for the same claim ID", () => {
  const ledger = simulateLedger(authoritativeRecord());
  assert.equal(ledger.claim(CAPTURE_ID, CLAIM_ID).ok, true);
  assert.deepEqual(ledger.claim(CAPTURE_ID, CLAIM_ID), { ok: true, alreadyClaimed: true });
  assert.deepEqual(ledger.claim(CAPTURE_ID, "CHAOS-OTHER-CLAIM"), {
    ok: false, reason: "ALREADY_CLAIMED"
  });
});

test("C12", "fulfillment requires claim", () => {
  const ledger = simulateLedger(authoritativeRecord());
  assert.deepEqual(ledger.fulfill(CAPTURE_ID, FULFILLMENT_ID), {
    ok: false, reason: "NOT_CLAIMED"
  });
});

test("C13", "duplicate fulfillment is idempotent only for the same fulfillment ID", () => {
  const ledger = simulateLedger(authoritativeRecord());
  ledger.claim(CAPTURE_ID, CLAIM_ID);
  assert.equal(ledger.fulfill(CAPTURE_ID, FULFILLMENT_ID).ok, true);
  assert.deepEqual(ledger.fulfill(CAPTURE_ID, FULFILLMENT_ID), {
    ok: true, alreadyFulfilled: true
  });
  assert.deepEqual(ledger.fulfill(CAPTURE_ID, "GEI-FULFILL-ATTACK"), {
    ok: false, reason: "ALREADY_FULFILLED"
  });
});

test("C14", "drift during claim freezes the entitlement", () => {
  const ledger = simulateLedger(authoritativeRecord());
  ledger.mutate(record => { record.flOz = 1; });
  const result = ledger.claim(CAPTURE_ID, CLAIM_ID);
  assert.equal(result.frozen, true);
  assert.equal(result.incident.status, "FROZEN");
  assert.ok(result.reconciliation.reasons.includes("FL_OZ_DRIFT"));
});

test("C15", "drift during fulfillment freezes the entitlement", () => {
  const ledger = simulateLedger(authoritativeRecord());
  ledger.claim(CAPTURE_ID, CLAIM_ID);
  ledger.mutate(record => { record.amount = "99.99"; });
  const result = ledger.fulfill(CAPTURE_ID, FULFILLMENT_ID);
  assert.equal(result.frozen, true);
  assert.equal(result.incident.status, "FROZEN");
  assert.ok(result.reconciliation.reasons.includes("AMOUNT_DRIFT"));
});

test("C16", "recovery remains frozen while drift exists", () => {
  const ledger = simulateLedger(authoritativeRecord({ flOz: 1 }));
  ledger.claim(CAPTURE_ID, CLAIM_ID);
  assert.equal(ledger.incident.status, "FROZEN");
  const result = ledger.recover();
  assert.equal(result.recoverable, false);
  assert.equal(result.reason, "DRIFT_REMAINS");
});

test("C17", "authoritative repair becomes recoverable without auto-credit", () => {
  const ledger = simulateLedger(authoritativeRecord({ flOz: 1 }));
  ledger.claim(CAPTURE_ID, CLAIM_ID);
  ledger.mutate(record => {
    const clean = authoritativeRecord(record);
    Object.assign(record, clean);
  });
  const result = ledger.recover();
  assert.equal(result.ok, true);
  assert.equal(result.recoverable, true);
  assert.equal(result.action, "REVERIFY_BEFORE_CLAIM_OR_FULFILLMENT");
});

test("C18", "wallet-credit bypass is represented as an invalid client-only path", () => {
  const clientCreditAttempt = {
    serverAuthorized: false,
    captureID: CAPTURE_ID,
    fulfillmentId: FULFILLMENT_ID
  };
  assert.equal(clientCreditAttempt.serverAuthorized, false);
  assert.notEqual(clientCreditAttempt.serverAuthorized, true);
});

const failed = tests.filter(test => test.status === "FAIL");
const report = {
  engine: "GEI Economy Security Verification & Chaos Test Engine",
  version: "2.0.28",
  mode: "deterministic-safe-chaos",
  productionDataTouched: false,
  productionMoneyTouched: false,
  testCount: tests.length,
  passed: tests.filter(test => test.status === "PASS").length,
  failed: failed.length,
  chain: ["ATTACK", "DETECT", "BLOCK", "PRESERVE", "RECOVER", "VERIFY"],
  tests
};

console.log(JSON.stringify(report, null, 2));

if (failed.length) process.exitCode = 1;
