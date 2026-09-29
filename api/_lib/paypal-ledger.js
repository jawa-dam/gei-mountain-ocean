import {
  ECONOMY_AUTHORITY_VERSION,
  validateEntitlementAuthority,
  auditReceipt,
  reconcileEntitlementAuthority,
  getPack
} from "./economy-authority.js";

const LEDGER_TTL_SECONDS = 60 * 60 * 24 * 365;

function ledgerConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Durable entitlement storage is not configured.");
  return { url: url.replace(/\/$/, ""), token };
}

async function redisCommand(command) {
  const { url, token } = ledgerConfig();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || "Durable entitlement storage request failed.");
  return data.result;
}

function getPackKind(packId) {
  return getPack(packId)?.kind || "fl-oz";
}
function getPackCharacterId(packId) {
  return getPack(packId)?.characterId || null;
}

function reconciled(record) {
  const result = reconcileEntitlementAuthority(record);
  if (!result.ok) {
    const error = new Error("Economy authority drift detected.");
    error.code = "ECONOMY_DRIFT_DETECTED";
    error.reconciliation = result;
    throw error;
  }
  return result;
}

function incidentKeyFor(invoiceId) {
  return "gei:paypal:incident:" + invoiceId;
}

export async function recordEconomyIncident({
  invoiceId,
  captureID,
  source,
  reconciliation,
  record
}) {
  if (!invoiceId) throw new Error("Missing entitlement incident identity.");

  const incidentKey = incidentKeyFor(invoiceId);
  const indexKey = "gei:paypal:incident:index:" + invoiceId;
  const incidentId = "GEI-INC-" + String(invoiceId).replace(/[^A-Za-z0-9._:-]/g, "-").slice(0, 96);
  const incident = {
    incidentId,
    incidentVersion: "2.0.27",
    status: "FROZEN",
    source: source || "UNKNOWN",
    invoiceId,
    captureID: captureID || record?.captureID || null,
    orderID: record?.orderID || null,
    packId: record?.packId || null,
    detectedAt: new Date().toISOString(),
    reconciliation: reconciliation || null,
    auditVersion: ECONOMY_AUTHORITY_VERSION
  };

  const script = `
    local existing = redis.call("GET", KEYS[1])
    if existing then return {0, existing} end
    redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
    redis.call("SET", KEYS[2], ARGV[3], "EX", ARGV[2])
    return {1, ARGV[1]}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    2,
    incidentKey,
    indexKey,
    JSON.stringify(incident),
    String(LEDGER_TTL_SECONDS),
    incidentId
  ]);

  return {
    created: Number(result?.[0]) === 1,
    incident: JSON.parse(result?.[1] || JSON.stringify(incident))
  };
}

export async function getEconomyIncident(invoiceId) {
  if (!invoiceId) throw new Error("Missing entitlement incident identity.");
  const indexKey = "gei:paypal:incident:index:" + invoiceId;
  const incidentIdValue = await redisCommand(["GET", indexKey]);
  if (!incidentIdValue) return { ok: false, reason: "NOT_FOUND" };

  const raw = await redisCommand(["GET", incidentKeyFor(invoiceId)]);
  if (!raw) return { ok: false, reason: "INCIDENT_NOT_FOUND" };

  return { ok: true, incident: JSON.parse(raw) };
}

export async function getEntitlement(invoiceId, captureID = null) {
  if (!invoiceId) throw new Error("Missing entitlement identity.");

  const entitlementKey = "gei:paypal:entitlement:" + invoiceId;
  const raw = await redisCommand(["GET", entitlementKey]);
  if (!raw) return { ok: false, reason: "NOT_FOUND" };

  let record;
  try {
    record = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "CORRUPT_RECORD" };
  }

  if (captureID && record.captureID !== captureID) {
    return { ok: false, reason: "CAPTURE_MISMATCH", record };
  }

  const reconciliation = reconcileEntitlementAuthority(record);
  return {
    ok: reconciliation.ok,
    driftDetected: reconciliation.driftDetected,
    reconciliation,
    record
  };
}

export async function reconcileAndFreezeEntitlement(invoiceId, captureID = null, source = "UNKNOWN") {
  const result = await getEntitlement(invoiceId, captureID);
  if (result.ok) {
    return {
      ok: true,
      frozen: false,
      incident: null,
      reconciliation: result.reconciliation,
      record: result.record
    };
  }

  if (result.reason === "NOT_FOUND" || result.reason === "CAPTURE_MISMATCH") {
    return { ok: false, frozen: false, reason: result.reason };
  }

  const incident = await recordEconomyIncident({
    invoiceId,
    captureID,
    source,
    reconciliation: result.reconciliation,
    record: result.record
  });

  return {
    ok: false,
    frozen: true,
    incident: incident.incident,
    reconciliation: result.reconciliation,
    record: result.record
  };
}

export async function recoverEconomyIncident(invoiceId, captureID = null) {
  const incidentResult = await getEconomyIncident(invoiceId);
  if (!incidentResult.ok) return incidentResult;

  const entitlement = await getEntitlement(invoiceId, captureID);
  if (entitlement.reason === "NOT_FOUND") {
    return {
      ok: false,
      recoverable: false,
      status: "FROZEN",
      reason: "ENTITLEMENT_NOT_FOUND",
      incident: incidentResult.incident
    };
  }

  if (entitlement.reason === "CAPTURE_MISMATCH") {
    return {
      ok: false,
      recoverable: false,
      status: "FROZEN",
      reason: "CAPTURE_MISMATCH",
      incident: incidentResult.incident
    };
  }

  if (!entitlement.ok) {
    return {
      ok: false,
      recoverable: false,
      status: "FROZEN",
      reason: "DRIFT_REMAINS",
      incident: incidentResult.incident,
      reconciliation: entitlement.reconciliation
    };
  }

  return {
    ok: true,
    recoverable: true,
    status: "RECOVERABLE",
    action: "REVERIFY_BEFORE_CLAIM_OR_FULFILLMENT",
    incident: incidentResult.incident,
    reconciliation: entitlement.reconciliation,
    record: entitlement.record
  };
}

export async function recordEntitlement({
  eventId,
  orderID,
  captureID,
  invoiceId,
  packId,
  flOz,
  amount,
  currency
}) {
  if (!eventId || !orderID || !captureID || !invoiceId || !packId) {
    throw new Error("Incomplete PayPal entitlement record.");
  }

  if (!validateEntitlementAuthority({ packId, flOz, amount, currency })) {
    throw new Error("Economy authority validation failed.");
  }

  const eventKey = "gei:paypal:event:" + eventId;
  const entitlementKey = "gei:paypal:entitlement:" + invoiceId;
  const record = JSON.stringify({
    status: "FULFILLABLE",
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    audit: auditReceipt({ packId, flOz, amount, currency }),
    orderID,
    captureID,
    invoiceId,
    packId,
    flOz,
    amount,
    currency,
    productType: getPackKind(packId),
    characterId: getPackCharacterId(packId),
    claimedAt: null,
    createdAt: new Date().toISOString()
  });

  const script = `
    local existing = redis.call("GET", KEYS[2])
    if existing then
      redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
      return {0, existing}
    end
    redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
    redis.call("SET", KEYS[2], ARGV[3], "EX", ARGV[2])
    return {1, ARGV[3]}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    2,
    eventKey,
    entitlementKey,
    eventId,
    String(LEDGER_TTL_SECONDS),
    record
  ]);

  const parsed = result?.[1] ? JSON.parse(result[1]) : null;
  if (parsed) reconciled(parsed);

  return {
    created: Number(result?.[0]) === 1,
    record: parsed
  };
}

export async function claimEntitlement(invoiceId, captureID, claimId) {
  if (!invoiceId || !captureID || !claimId) throw new Error("Missing entitlement claim information.");

  const entitlementKey = "gei:paypal:entitlement:" + invoiceId;
  const preflight = await getEntitlement(invoiceId, captureID);
  if (!preflight.ok) {
    if (preflight.reason === "NOT_FOUND") return { ok: false, alreadyClaimed: false, reason: "NOT_FOUND" };
    if (preflight.reason === "CAPTURE_MISMATCH") return { ok: false, alreadyClaimed: false, reason: "CAPTURE_MISMATCH" };
    const error = new Error("Economy authority drift detected.");
    error.code = "ECONOMY_DRIFT_DETECTED";
    error.reconciliation = preflight.reconciliation;
    throw error;
  }

  const now = new Date().toISOString();

  const script = `
    local raw = redis.call("GET", KEYS[1])
    if not raw then return {0, "NOT_FOUND"} end
    local obj = cjson.decode(raw)
    if obj.captureID ~= ARGV[1] then return {0, "CAPTURE_MISMATCH"} end
    if obj.claimedAt then
      if obj.claimId == ARGV[3] then return {2, raw} end
      return {0, "ALREADY_CLAIMED"}
    end
    obj.claimedAt = ARGV[2]
    obj.claimId = ARGV[3]
    local updated = cjson.encode(obj)
    redis.call("SET", KEYS[1], updated, "EX", ARGV[4])
    return {1, updated}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    1,
    entitlementKey,
    captureID,
    now,
    claimId,
    String(LEDGER_TTL_SECONDS)
  ]);

  if (Number(result?.[0]) === 1 || Number(result?.[0]) === 2) {
    const record = JSON.parse(result[1]);
    reconciled(record);
    return {
      ok: true,
      alreadyClaimed: Number(result?.[0]) === 2,
      record
    };
  }

  return { ok: false, alreadyClaimed: false, reason: result?.[1] || "NOT_FOUND" };
}

export async function fulfillEntitlement(invoiceId, captureID, fulfillmentId) {
  if (!invoiceId || !captureID || !fulfillmentId) throw new Error("Missing entitlement fulfillment information.");

  const entitlementKey = "gei:paypal:entitlement:" + invoiceId;
  const preflight = await getEntitlement(invoiceId, captureID);
  if (!preflight.ok) {
    if (preflight.reason === "NOT_FOUND") return { ok: false, alreadyFulfilled: false, reason: "NOT_FOUND" };
    if (preflight.reason === "CAPTURE_MISMATCH") return { ok: false, alreadyFulfilled: false, reason: "CAPTURE_MISMATCH" };
    const error = new Error("Economy authority drift detected.");
    error.code = "ECONOMY_DRIFT_DETECTED";
    error.reconciliation = preflight.reconciliation;
    throw error;
  }

  const now = new Date().toISOString();

  const script = `
    local raw = redis.call("GET", KEYS[1])
    if not raw then return {0, "NOT_FOUND"} end
    local obj = cjson.decode(raw)
    if obj.captureID ~= ARGV[1] then return {0, "CAPTURE_MISMATCH"} end
    if not obj.claimedAt then return {0, "NOT_CLAIMED"} end
    if obj.fulfilledAt then
      if obj.fulfillmentId == ARGV[3] then return {2, raw} end
      return {0, "ALREADY_FULFILLED"}
    end
    obj.fulfilledAt = ARGV[2]
    obj.fulfillmentId = ARGV[3]
    obj.status = "FULFILLED"
    local updated = cjson.encode(obj)
    redis.call("SET", KEYS[1], updated, "EX", ARGV[4])
    return {1, updated}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    1,
    entitlementKey,
    captureID,
    now,
    fulfillmentId,
    String(LEDGER_TTL_SECONDS)
  ]);

  if (Number(result?.[0]) === 1 || Number(result?.[0]) === 2) {
    const record = JSON.parse(result[1]);
    reconciled(record);
    return {
      ok: true,
      alreadyFulfilled: Number(result?.[0]) === 2,
      record
    };
  }

  return { ok: false, alreadyFulfilled: false, reason: result?.[1] || "NOT_FOUND" };
}
