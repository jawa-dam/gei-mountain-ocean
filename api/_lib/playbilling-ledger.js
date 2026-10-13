import {
  ECONOMY_AUTHORITY_VERSION,
  validateEntitlementAuthority,
  auditReceipt,
  reconcileEntitlementAuthority,
  getPack,
  canonicalFulfillmentId
} from "./economy-authority.js";
import {
  packIdFromPlayProductId,
  isConsumable
} from "./billing-channel.js";

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

export async function recordPlayEntitlement({
  purchaseToken,
  orderId,
  playProductId,
  packId,
  flOz,
  amount,
  currency
}) {
  if (!purchaseToken || !orderId || !playProductId || !packId) {
    throw new Error("Incomplete Google Play entitlement record.");
  }

  if (!validateEntitlementAuthority({ packId, flOz, amount, currency })) {
    throw new Error("Economy authority validation failed.");
  }

  const tokenHash = await hashToken(purchaseToken);
  const eventKey = "gei:playbilling:event:" + tokenHash;
  const entitlementKey = "gei:playbilling:entitlement:" + orderId;
  const tokenOrderKey = "gei:playbilling:token-order:" + tokenHash;
  const productType = getPack(packId)?.kind || "fl-oz";
  const characterId = getPack(packId)?.characterId || null;
  const record = JSON.stringify({
    status: "FULFILLABLE",
    channel: "google_play",
    auditVersion: ECONOMY_AUTHORITY_VERSION,
    audit: auditReceipt({ packId, flOz, amount, currency, productType, characterId }),
    orderId,
    purchaseTokenHash: tokenHash,
    playProductId,
    packId,
    flOz,
    amount,
    currency,
    productType,
    characterId,
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
    redis.call("SET", KEYS[3], ARGV[4], "EX", ARGV[2])
    return {1, ARGV[3]}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    3,
    eventKey,
    entitlementKey,
    tokenOrderKey,
    tokenHash,
    String(LEDGER_TTL_SECONDS),
    record,
    orderId
  ]);

  const parsed = result?.[1] ? JSON.parse(result[1]) : null;
  if (parsed) reconciled(parsed);

  return {
    created: Number(result?.[0]) === 1,
    record: parsed
  };
}

export async function getPlayEntitlement(orderId) {
  if (!orderId) throw new Error("Missing entitlement identity.");

  const entitlementKey = "gei:playbilling:entitlement:" + orderId;
  const raw = await redisCommand(["GET", entitlementKey]);
  if (!raw) return { ok: false, reason: "NOT_FOUND" };

  let record;
  try {
    record = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "CORRUPT_RECORD" };
  }

  const reconciliation = reconcileEntitlementAuthority(record);
  return {
    ok: reconciliation.ok,
    driftDetected: reconciliation.driftDetected,
    reconciliation,
    record
  };
}

export async function claimPlayEntitlement(orderId, claimId) {
  if (!orderId || !claimId) throw new Error("Missing entitlement claim information.");

  const entitlementKey = "gei:playbilling:entitlement:" + orderId;
  const preflight = await getPlayEntitlement(orderId);
  if (!preflight.ok) {
    if (preflight.reason === "NOT_FOUND") return { ok: false, alreadyClaimed: false, reason: "NOT_FOUND" };
    if (preflight.reason === "CORRUPT_RECORD") return { ok: false, alreadyClaimed: false, reason: "CORRUPT_RECORD" };
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
    if obj.claimedAt then
      if obj.claimId == ARGV[2] then return {2, raw} end
      return {0, "ALREADY_CLAIMED"}
    end
    obj.claimedAt = ARGV[1]
    obj.claimId = ARGV[2]
    local updated = cjson.encode(obj)
    redis.call("SET", KEYS[1], updated, "EX", ARGV[3])
    return {1, updated}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    1,
    entitlementKey,
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

export async function fulfillPlayEntitlement(orderId, fulfillmentId) {
  if (!orderId || !fulfillmentId) throw new Error("Missing entitlement fulfillment information.");

  const entitlementKey = "gei:playbilling:entitlement:" + orderId;
  const preflight = await getPlayEntitlement(orderId);
  if (!preflight.ok) {
    if (preflight.reason === "NOT_FOUND") return { ok: false, alreadyFulfilled: false, reason: "NOT_FOUND" };
    if (preflight.reason === "CORRUPT_RECORD") return { ok: false, alreadyFulfilled: false, reason: "CORRUPT_RECORD" };
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
    if not obj.claimedAt then return {0, "NOT_CLAIMED"} end
    if obj.fulfilledAt then
      if obj.fulfillmentId == ARGV[2] then return {2, raw} end
      return {0, "ALREADY_FULFILLED"}
    end
    obj.fulfilledAt = ARGV[1]
    obj.fulfillmentId = ARGV[2]
    obj.status = "FULFILLED"
    local updated = cjson.encode(obj)
    redis.call("SET", KEYS[1], updated, "EX", ARGV[3])
    return {1, updated}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    1,
    entitlementKey,
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

export async function recordRtdnEvent({
  messageId,
  notificationType,
  notificationLabel,
  purchaseToken,
  sku,
  packId,
  eventTimeMillis,
  googleApiError
}) {
  const tokenHash = await hashToken(purchaseToken);
  const dedupKey = "gei:playbilling:rtdn:" + tokenHash + ":" + notificationType + ":" + (messageId || "no-id");

  const record = JSON.stringify({
    messageId: messageId || null,
    notificationType,
    notificationLabel,
    purchaseTokenHash: tokenHash,
    sku,
    packId,
    eventTimeMillis: eventTimeMillis || null,
    googleApiError: googleApiError || null,
    processedAt: new Date().toISOString()
  });

  const script = `
    local existing = redis.call("GET", KEYS[1])
    if existing then return {0, existing} end
    redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[2])
    return {1, ARGV[1]}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    1,
    dedupKey,
    record,
    String(LEDGER_TTL_SECONDS)
  ]);

  return {
    created: Number(result?.[0]) === 1,
    record: JSON.parse(result?.[1] || record)
  };
}

export async function revokePlayEntitlement({
  purchaseToken,
  packId,
  notificationType,
  notificationLabel,
  googlePurchaseState,
  consumable
}) {
  const tokenHash = await hashToken(purchaseToken);
  const entitlementLookupKey = "gei:playbilling:token-order:" + tokenHash;
  const orderId = await redisCommand(["GET", entitlementLookupKey]);

  if (!orderId) {
    return { action: "NO_ENTITLEMENT_FOUND", tokenHash };
  }

  const entitlementKey = "gei:playbilling:entitlement:" + orderId;
  const raw = await redisCommand(["GET", entitlementKey]);
  if (!raw) {
    return { action: "ENTITLEMENT_EXPIRED", orderId };
  }

  let record;
  try {
    record = JSON.parse(raw);
  } catch {
    return { action: "CORRUPT_RECORD", orderId };
  }

  if (record.status === "REVOKED") {
    return { action: "ALREADY_REVOKED", orderId };
  }

  const now = new Date().toISOString();

  const script = `
    local raw = redis.call("GET", KEYS[1])
    if not raw then return {0, "NOT_FOUND"} end
    local obj = cjson.decode(raw)
    if obj.status == "REVOKED" then return {2, raw} end
    obj.revokedAt = ARGV[1]
    obj.revocationReason = ARGV[2]
    obj.revocationNotificationType = tonumber(ARGV[3])
    obj.googlePurchaseState = tonumber(ARGV[4])
    obj.previousStatus = obj.status
    obj.status = "REVOKED"
    local updated = cjson.encode(obj)
    redis.call("SET", KEYS[1], updated, "EX", ARGV[5])
    return {1, updated}
  `;

  const result = await redisCommand([
    "EVAL",
    script,
    1,
    entitlementKey,
    now,
    notificationLabel,
    String(notificationType),
    String(googlePurchaseState ?? -1),
    String(LEDGER_TTL_SECONDS)
  ]);

  if (Number(result?.[0]) === 2) {
    return { action: "ALREADY_REVOKED", orderId };
  }

  if (Number(result?.[0]) === 1) {
    const revokedRecord = JSON.parse(result[1]);
    const revocationKey = "gei:playbilling:revocation:" + orderId;
    const revocationRecord = JSON.stringify({
      orderId,
      packId,
      consumable,
      previousStatus: revokedRecord.previousStatus,
      notificationType,
      notificationLabel,
      googlePurchaseState,
      revokedAt: now,
      flOz: revokedRecord.flOz,
      productType: revokedRecord.productType || "fl-oz",
      characterId: revokedRecord.characterId || null,
      debtPolicy: consumable ? "AUDIT_REVIEW" : "ACCESS_REVOKED"
    });

    await redisCommand(["SET", revocationKey, revocationRecord, "EX", String(LEDGER_TTL_SECONDS)]);

    return {
      action: consumable ? "CONSUMABLE_REVOKED_AUDIT_PENDING" : "NON_CONSUMABLE_ACCESS_REVOKED",
      orderId,
      packId,
      consumable,
      previousStatus: revokedRecord.previousStatus
    };
  }

  return { action: "NO_ENTITLEMENT_FOUND", orderId };
}

export async function getRevocationRecord(orderId) {
  if (!orderId) return { ok: false, reason: "MISSING_ORDER_ID" };
  const revocationKey = "gei:playbilling:revocation:" + orderId;
  const raw = await redisCommand(["GET", revocationKey]);
  if (!raw) return { ok: false, reason: "NOT_FOUND" };
  return { ok: true, record: JSON.parse(raw) };
}

async function hashToken(token) {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export { hashToken };
