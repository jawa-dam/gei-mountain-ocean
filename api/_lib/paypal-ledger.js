import { ECONOMY_AUTHORITY_VERSION, validateEntitlementAuthority, auditReceipt } from "./economy-authority.js";

const LEDGER_TTL_SECONDS = 60 * 60 * 24 * 365;

function ledgerConfig() {
  // Support both the explicit Upstash names and the Vercel/Upstash
  // integration names already provisioned on this project.
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

  if (!validateEntitlementAuthority({ packId, flOz, amount, currency })) throw new Error("Economy authority validation failed.");

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

  return {
    created: Number(result?.[0]) === 1,
    record: result?.[1] ? JSON.parse(result[1]) : null
  };
}

export async function claimEntitlement(invoiceId, captureID, claimId) {
  if (!invoiceId || !captureID || !claimId) throw new Error("Missing entitlement claim information.");

  const entitlementKey = "gei:paypal:entitlement:" + invoiceId;
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

  if (Number(result?.[0]) === 1) {
    return { ok: true, alreadyClaimed: false, record: JSON.parse(result[1]) };
  }

  if (Number(result?.[0]) === 2) {
    return { ok: true, alreadyClaimed: true, record: JSON.parse(result[1]) };
  }

  return { ok: false, alreadyClaimed: false, reason: result?.[1] || "NOT_FOUND" };
}


export async function fulfillEntitlement(invoiceId, captureID, fulfillmentId) {
  if (!invoiceId || !captureID || !fulfillmentId) throw new Error("Missing entitlement fulfillment information.");

  const entitlementKey = "gei:paypal:entitlement:" + invoiceId;
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

  if (Number(result?.[0]) === 1) {
    return { ok: true, alreadyFulfilled: false, record: JSON.parse(result[1]) };
  }

  if (Number(result?.[0]) === 2) {
    return { ok: true, alreadyFulfilled: true, record: JSON.parse(result[1]) };
  }

  return { ok: false, alreadyFulfilled: false, reason: result?.[1] || "NOT_FOUND" };
}
